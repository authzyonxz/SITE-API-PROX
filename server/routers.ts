import { z } from "zod";
import bcrypt from "bcryptjs";
import * as jose from "jose";

import { TRPCError } from "@trpc/server";
import { eq, and, gte, sql } from "drizzle-orm";
import { accessLogs, localUsers } from "../drizzle/schema";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { systemRouter } from "./_core/systemRouter";
import { webhookRouter } from "./webhookRouter";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import {
  getLocalUserByUsername,
  getLocalUserById,
  createLocalUser,
  listLocalUsers,
  deleteLocalUser,
  deductCredits,
  addCredits,
  updateUserCredits,
  updateUserDeviceId,
  saveGeneratedKey,
  markKeyDeleted,
  getKeyStats,
  getResellerCount,
  getKeysByUser,
  createAccessLog,
  listAccessLogs,
  deleteKeysByUserId,
  getKeysByUserId,
  updateUserPassword,
  updateUserMaxIps,
  resetUserSession,
  resetAllSessions,
  getActiveDevicesCount,
  getDb,
  listProxyStatus,
  updateProxyStatus,
  banUser,
  countKeysGeneratedRecently,
  findKeyCreator,
  listGenerationHistory,
  addToBlacklist,
  removeFromBlacklist,
  listBlacklist,
  isIpBlacklisted,
  createReport,
  listReports,
  deleteReport,
} from "./db";

// ─── Configuração segura via variáveis de ambiente ────────────────────────────
// SEGURANÇA: API_BASE e MASTER_KEY devem ser definidos como variáveis de ambiente.
// Nunca exponha credenciais diretamente no código-fonte.
const API_BASE = process.env.PROXY_API_BASE ?? "https://ruan.arifi.site";
const MASTER_KEY = process.env.PROXY_MASTER_KEY ?? "";

const LOCAL_SESSION_COOKIE = "auth_proxy_session";

// IPs banidos permanentemente — complementado pela tabela ip_blacklist no banco
const BANNED_IPS = ["24.152.71.107", "157.52.85.28"];

// ─── Rate Limiting Aprimorado ─────────────────────────────────────────────────
// Rate limiting por IP E por username para dificultar ataques de força bruta
// mesmo com IPs diferentes (botnets, proxies, etc.)
interface RateLimitEntry {
  count: number;
  lastAttempt: number;
  blockedUntil?: number;
}

const loginAttemptsByIp = new Map<string, RateLimitEntry>();
const loginAttemptsByUser = new Map<string, RateLimitEntry>();

const RATE_LIMIT_MAX_ATTEMPTS = 8;          // Máximo de tentativas antes do bloqueio
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // Janela de 15 minutos
const RATE_LIMIT_BLOCK_MS = 30 * 60 * 1000;  // Bloqueio de 30 minutos após exceder

function checkRateLimit(ip: string, username?: string): { allowed: boolean; message?: string } {
  const now = Date.now();

  // Verificar bloqueio por IP
  const ipEntry = loginAttemptsByIp.get(ip);
  if (ipEntry) {
    if (ipEntry.blockedUntil && now < ipEntry.blockedUntil) {
      const minutesLeft = Math.ceil((ipEntry.blockedUntil - now) / 60000);
      return { allowed: false, message: `IP bloqueado por excesso de tentativas. Tente novamente em ${minutesLeft} minuto(s).` };
    }
    if (now - ipEntry.lastAttempt > RATE_LIMIT_WINDOW_MS) {
      loginAttemptsByIp.set(ip, { count: 1, lastAttempt: now });
    } else if (ipEntry.count >= RATE_LIMIT_MAX_ATTEMPTS) {
      loginAttemptsByIp.set(ip, { count: ipEntry.count + 1, lastAttempt: now, blockedUntil: now + RATE_LIMIT_BLOCK_MS });
      return { allowed: false, message: "Muitas tentativas de login. IP bloqueado por 30 minutos." };
    } else {
      ipEntry.count += 1;
      ipEntry.lastAttempt = now;
    }
  } else {
    loginAttemptsByIp.set(ip, { count: 1, lastAttempt: now });
  }

  // Verificar bloqueio por username (protege contra ataques distribuídos)
  if (username) {
    const userEntry = loginAttemptsByUser.get(username.toLowerCase());
    if (userEntry) {
      if (userEntry.blockedUntil && now < userEntry.blockedUntil) {
        const minutesLeft = Math.ceil((userEntry.blockedUntil - now) / 60000);
        return { allowed: false, message: `Conta temporariamente bloqueada por excesso de tentativas. Tente novamente em ${minutesLeft} minuto(s).` };
      }
      if (now - userEntry.lastAttempt > RATE_LIMIT_WINDOW_MS) {
        loginAttemptsByUser.set(username.toLowerCase(), { count: 1, lastAttempt: now });
      } else if (userEntry.count >= RATE_LIMIT_MAX_ATTEMPTS) {
        loginAttemptsByUser.set(username.toLowerCase(), { count: userEntry.count + 1, lastAttempt: now, blockedUntil: now + RATE_LIMIT_BLOCK_MS });
        return { allowed: false, message: "Conta temporariamente bloqueada por excesso de tentativas. Tente novamente em 30 minutos." };
      } else {
        userEntry.count += 1;
        userEntry.lastAttempt = now;
      }
    } else {
      loginAttemptsByUser.set(username.toLowerCase(), { count: 1, lastAttempt: now });
    }
  }

  return { allowed: true };
}

// Limpar entradas expiradas periodicamente para evitar vazamento de memória
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of loginAttemptsByIp.entries()) {
    if (now - entry.lastAttempt > RATE_LIMIT_WINDOW_MS * 2) {
      loginAttemptsByIp.delete(key);
    }
  }
  for (const [key, entry] of loginAttemptsByUser.entries()) {
    if (now - entry.lastAttempt > RATE_LIMIT_WINDOW_MS * 2) {
      loginAttemptsByUser.delete(key);
    }
  }
}, 60 * 60 * 1000); // Limpeza a cada hora

// ─── Extração segura de IP ────────────────────────────────────────────────────
// SEGURANÇA: Pegar apenas o primeiro IP do header x-forwarded-for para evitar
// spoofing via IPs extras injetados pelo atacante (ex: "IP_REAL, IP_FALSO")
function getClientIp(req: any): string {
  const forwarded = req.headers?.["x-forwarded-for"];
  if (forwarded) {
    // Pegar apenas o primeiro IP (mais próximo do cliente real)
    const firstIp = (Array.isArray(forwarded) ? forwarded[0] : forwarded)
      .split(",")[0]
      .trim();
    if (firstIp) return firstIp;
  }
  return req.socket?.remoteAddress ?? "0.0.0.0";
}

// ─── Local Auth Helpers ───────────────────────────────────────────────────────

async function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    // Em produção, JWT_SECRET DEVE estar definido com pelo menos 32 caracteres.
    // Se não estiver, o servidor não deve operar de forma segura.
    if (process.env.NODE_ENV === "production") {
      throw new Error("[SEGURANÇA CRÍTICA] JWT_SECRET não configurado ou muito curto em produção!");
    }
    // Em desenvolvimento, usar fallback com aviso
    console.warn("[AVISO DE SEGURANÇA] JWT_SECRET não configurado. Use uma variável de ambiente segura em produção!");
    return new TextEncoder().encode("auth-proxy-dev-secret-CHANGE-IN-PRODUCTION-min32chars");
  }
  return new TextEncoder().encode(secret);
}

async function signLocalToken(userId: number, role: string, sessionSecret: string) {
  const secret = await getJwtSecret();
  return new jose.SignJWT({ userId, role, ss: sessionSecret })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(secret);
}

async function verifyLocalToken(token: string) {
  try {
    const secret = await getJwtSecret();
    const { payload } = await jose.jwtVerify(token, secret);
    return payload as { userId: number; role: string; ss: string };
  } catch {
    return null;
  }
}

// Middleware to get local user from cookie
async function getLocalUserFromReq(req: any) {
  const cookieHeader = req.headers?.cookie ?? "";
  const cookies: Record<string, string> = {};
  cookieHeader.split(";").forEach((c: string) => {
    const [k, ...v] = c.trim().split("=");
    if (k) cookies[k.trim()] = decodeURIComponent(v.join("="));
  });
  const token = cookies[LOCAL_SESSION_COOKIE];
  if (!token) return null;
  const payload = await verifyLocalToken(token);
  if (!payload) return null;
  
  const user = await getLocalUserById(payload.userId);
  if (!user) return null;

  // Verificar se o usuário está banido
  if (user.isBanned === 1) return null;
  
  // SEGURANÇA: Validar se o segredo da sessão ainda é o mesmo.
  // Isso garante que ao resetar a sessão ou trocar a senha, tokens antigos são invalidados.
  if (user.sessionSecret !== payload.ss) return null;
  
  return user;
}

// ─── API Call Helper ──────────────────────────────────────────────────────────

async function callProxyApi(path: string) {
  const url = `${API_BASE}${path}`;
  const response = await fetch(url, { signal: AbortSignal.timeout(10000) });
  const text = await response.text();
  try {
    return { ok: response.ok, data: JSON.parse(text), raw: text };
  } catch {
    return { ok: response.ok, data: null, raw: text };
  }
}

// ─── Local Auth Procedure ─────────────────────────────────────────────────────

const localAuthProcedure = publicProcedure.use(async ({ ctx, next }) => {
  const ip = getClientIp(ctx.req);
  const localUser = await getLocalUserFromReq(ctx.req);

  // Verificar se o IP está na lista negra do banco de dados
  if (await isIpBlacklisted(ip)) {
    if (localUser) {
      await banUser(localUser.id);
      await resetUserSession(localUser.id);
    }
    ctx.res.clearCookie(LOCAL_SESSION_COOKIE, { path: "/" });
    throw new TRPCError({ code: "FORBIDDEN", message: "ACESSO BLOQUEADO: Seu IP está na lista negra." });
  }

  // Verificar se o IP está na lista estática de banidos
  if (BANNED_IPS.includes(ip)) {
    if (localUser) {
      await banUser(localUser.id);
      await resetUserSession(localUser.id);
    }
    ctx.res.clearCookie(LOCAL_SESSION_COOKIE, { path: "/" });
    throw new TRPCError({ code: "FORBIDDEN", message: "ACESSO BLOQUEADO: Seu IP foi banido permanentemente." });
  }

  if (!localUser) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Faça login para continuar" });
  }

  if (localUser.isBanned === 1) {
    ctx.res.clearCookie(LOCAL_SESSION_COOKIE, { path: "/" });
    throw new TRPCError({ code: "FORBIDDEN", message: "SUA CONTA FOI BANIDA PERMANENTEMENTE." });
  }

  return next({ ctx: { ...ctx, localUser } });
});

const adminProcedure = localAuthProcedure.use(async ({ ctx, next }) => {
  if (ctx.localUser.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Acesso restrito ao administrador" });
  }
  return next({ ctx });
});

// ─── App Router ───────────────────────────────────────────────────────────────

export const appRouter = router({
  system: systemRouter,
  webhook: webhookRouter,

  // Manus OAuth (required by template, kept for compatibility)
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // ─── Local Auth ────────────────────────────────────────────────────────────
  localAuth: router({
    login: publicProcedure
      .input(z.object({ 
        username: z.string().min(1).max(64).trim(), 
        password: z.string().min(1).max(256),
        deviceId: z.string().optional() 
      }))
      .mutation(async ({ input, ctx }) => {
        // Limpar cookies antigos antes de definir o novo para evitar conflitos
        const cookieOptions = getSessionCookieOptions(ctx.req);
        ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });

        const ip = getClientIp(ctx.req);
        
        // Bloqueio imediato por IP estático
        if (BANNED_IPS.includes(ip)) {
          throw new TRPCError({ code: "FORBIDDEN", message: "ACESSO BLOQUEADO: Seu IP foi banido permanentemente." });
        }

        // Verificar blacklist do banco de dados
        if (await isIpBlacklisted(ip)) {
          throw new TRPCError({ code: "FORBIDDEN", message: "ACESSO BLOQUEADO: Seu IP está na lista negra." });
        }

        // SEGURANÇA: Rate limiting por IP E por username
        const rateLimitCheck = checkRateLimit(ip, input.username);
        if (!rateLimitCheck.allowed) {
          throw new TRPCError({ 
            code: "TOO_MANY_REQUESTS", 
            message: rateLimitCheck.message ?? "Muitas tentativas de login. Tente novamente mais tarde." 
          });
        }

        console.log(`[Login] Tentativa de login para usuário: ${input.username} | IP: ${ip}`);
        let user;
        try {
          user = await getLocalUserByUsername(input.username);
        } catch (e) {
          console.error("[Login] Erro ao buscar usuário no banco:", e);
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Erro de banco de dados" });
        }

        if (!user) {
          // SEGURANÇA: Usar tempo constante para evitar timing attacks (user não encontrado vs senha errada)
          await bcrypt.hash("dummy-timing-protection", 12);
          console.warn(`[Login] Usuário não encontrado: ${input.username}`);
          throw new TRPCError({ code: "UNAUTHORIZED", message: "Usuário ou senha inválidos" });
        }

        let valid = false;
        try {
          valid = await bcrypt.compare(input.password, user.passwordHash);
        } catch (e) {
          console.error("[Login] Erro ao comparar senha com bcrypt:", e);
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Erro na verificação de senha" });
        }

        if (!valid) {
          console.warn(`[Login] Senha inválida para usuário: ${input.username}`);
          throw new TRPCError({ code: "UNAUTHORIZED", message: "Usuário ou senha inválidos" });
        }

        // Verificar se o usuário está banido
        if (user.isBanned === 1) {
          throw new TRPCError({ code: "FORBIDDEN", message: "SUA CONTA FOI BANIDA PERMANENTEMENTE." });
        }

        // Sistema de Vínculo de Dispositivo (HWID)
        if (user.role !== "admin") {
          if (!input.deviceId || input.deviceId.trim().length < 4) {
            throw new TRPCError({ code: "BAD_REQUEST", message: "ID do dispositivo não identificado ou inválido." });
          }

          // SEGURANÇA: Sanitizar o deviceId para evitar injeção de dados
          const sanitizedDeviceId = input.deviceId.trim().substring(0, 128);

          const currentDevices = user.deviceId
            ? user.deviceId.split(",").map(id => id.trim()).filter(id => id !== "")
            : [];
          
          // Se o dispositivo ATUAL já está na lista, permite o login sem fazer nada
          if (!currentDevices.includes(sanitizedDeviceId)) {
            // Se o dispositivo não está na lista, verificamos se ainda há espaço para novos vínculos
            if (currentDevices.length < user.maxDevices) {
              // Ainda tem espaço no limite, vincular este novo dispositivo
              const newDevices = [...currentDevices, sanitizedDeviceId].join(",");
              console.log(`[Login] Vinculando NOVO dispositivo ao usuário ${user.username}. Total: ${currentDevices.length + 1}/${user.maxDevices}`);
              await updateUserDeviceId(user.id, newDevices);
            } else {
              // Atingiu o limite de dispositivos diferentes
              console.warn(`[Login] Bloqueio de dispositivo: Usuário ${user.username} atingiu limite de ${user.maxDevices} aparelhos.`);
              throw new TRPCError({ 
                code: "FORBIDDEN", 
                message: `LIMITE DE DISPOSITIVOS ATINGIDO (${user.maxDevices}): Esta conta já está vinculada ao número máximo de aparelhos permitidos. Entre em contato com o administrador.` 
              });
            }
          }
        }

        console.log("[Login] Senha válida, gerando token...");
        let token;
        try {
          token = await signLocalToken(user.id, user.role, user.sessionSecret);
        } catch (e) {
          console.error("[Login] Erro ao gerar token JWT:", e);
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Erro ao gerar sessão" });
        }

        ctx.res.cookie(LOCAL_SESSION_COOKIE, token, cookieOptions);

        // Registrar log de acesso
        try {
          await createAccessLog({
            userId: user.id,
            username: user.username,
            ipAddress: ip,
            deviceId: input.deviceId,
          });
        } catch (e) {
          console.error("[Login] Erro ao registrar log de acesso:", e);
        }

        return {
          id: user.id,
          username: user.username,
          role: user.role,
          credits: user.credits,
        };
      }),

    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      // Limpar todos os cookies possíveis para evitar sessões fantasmas
      ctx.res.clearCookie(LOCAL_SESSION_COOKIE, { ...cookieOptions, path: "/", maxAge: -1 });
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, path: "/", maxAge: -1 });
      return { success: true };
    }),

    me: publicProcedure.query(async ({ ctx }) => {
      try {
        const localUser = await getLocalUserFromReq(ctx.req);
        if (!localUser) return null;
        
        return {
          id: localUser.id,
          username: localUser.username,
          role: localUser.role,
          credits: localUser.credits,
        };
      } catch (e) {
        return null;
      }
    }),
  }),

  // ─── Dashboard ─────────────────────────────────────────────────────────────
  dashboard: router({
    stats: localAuthProcedure.query(async ({ ctx }) => {
      const [keyStats, resellerCount, users] = await Promise.all([
        getKeyStats(),
        getResellerCount(),
        listLocalUsers(),
      ]);

      const resellerCredits = users
        .filter(u => u.role === "reseller")
        .map(u => ({ username: u.username, credits: u.credits }));

      return {
        activeKeys: keyStats.active,
        expiredKeys: keyStats.expired,
        resellerCount,
        resellerCredits,
        myCredits: ctx.localUser.credits,
        myRole: ctx.localUser.role,
      };
    }),
  }),

  // ─── Keys ──────────────────────────────────────────────────────────────────
  keys: router({
    generate: localAuthProcedure
      .input(z.object({
        days: z.union([z.literal(1), z.literal(3), z.literal(7), z.literal(30)]),
        quantity: z.number().int().min(1).max(50),
      }))
      .mutation(async ({ input, ctx }) => {
        const { days, quantity } = input;
        
        // SEGURANÇA: Verificar se a MASTER_KEY está configurada antes de prosseguir
        if (!MASTER_KEY) {
          console.error("[Keys] PROXY_MASTER_KEY não configurada!");
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Serviço de geração de keys indisponível. Contate o administrador.",
          });
        }

        // Tabela de preços atualizada
        const prices = {
          1: 10,
          3: 25,
          7: 35,
          30: 55
        };
        
        const pricePerKey = prices[days as keyof typeof prices];
        const totalCost = pricePerKey * quantity;
        const user = ctx.localUser;

        // Verificação de créditos para revendedores
        if (user.role !== "admin" && user.credits < totalCost) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: `Créditos insuficientes. Necessário: ${totalCost}, disponível: ${user.credits}`,
          });
        }

        const limit = 50;
        if (quantity > limit && user.role !== "admin") {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: `O limite máximo de geração é de ${limit} keys por vez.`,
          });
        }

        const results: string[] = [];
        const errors: string[] = [];

        for (let i = 0; i < quantity; i++) {
          const result = await callProxyApi(`/generate?key=${MASTER_KEY}&days=${days}`);
          if (result.ok && result.data?.key) {
            const key = result.data.key as string;
            results.push(key);

            const expiresAt = new Date();
            expiresAt.setDate(expiresAt.getDate() + days);
            await saveGeneratedKey({
              keyValue: key,
              days,
              createdById: user.id,
              status: "active",
              expiresAt,
            });
          } else {
            errors.push(`Erro ao gerar key ${i + 1}: ${result.raw}`);
          }
        }

        if (results.length > 0 && user.role !== "admin") {
          await deductCredits(user.id, results.length * pricePerKey);
        }

        return { keys: results, errors, days, totalGenerated: results.length };
      }),

    check: localAuthProcedure
      .input(z.object({ generatedKey: z.string().min(1).max(512) }))
      .query(async ({ input }) => {
        if (!MASTER_KEY) {
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Serviço indisponível." });
        }
        const result = await callProxyApi(`/check?key=${MASTER_KEY}&generated_key=${encodeURIComponent(input.generatedKey)}`);
        return { ok: result.ok, data: result.data, raw: result.raw };
      }),

    updateIp: localAuthProcedure
      .input(z.object({ generatedKey: z.string().min(1).max(512), newIp: z.string().min(1).max(64) }))
      .mutation(async ({ input }) => {
        // Verificar se o IP está na blacklist
        if (await isIpBlacklisted(input.newIp)) {
          throw new TRPCError({ code: "FORBIDDEN", message: "Este IP está na lista negra e não pode ser utilizado." });
        }

        if (!MASTER_KEY) {
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Serviço indisponível." });
        }

        const result = await callProxyApi(
          `/update?key=${MASTER_KEY}&generated_key=${encodeURIComponent(input.generatedKey)}&new_ip=${encodeURIComponent(input.newIp)}`
        );
        return { ok: result.ok, data: result.data, raw: result.raw };
      }),

    delete: localAuthProcedure
      .input(z.object({ generatedKey: z.string().min(1).max(512) }))
      .mutation(async ({ input }) => {
        if (!MASTER_KEY) {
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Serviço indisponível." });
        }
        const result = await callProxyApi(
          `/delete?key=${MASTER_KEY}&generated_key=${encodeURIComponent(input.generatedKey)}`
        );
        if (result.ok) {
          await markKeyDeleted(input.generatedKey);
        }
        return { ok: result.ok, data: result.data, raw: result.raw };
      }),

    deleteBulk: localAuthProcedure
      .input(z.object({ keys: z.array(z.string().min(1).max(512)).max(50) }))
      .mutation(async ({ input }) => {
        if (!MASTER_KEY) {
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Serviço indisponível." });
        }
        const results = [];
        for (const key of input.keys) {
          const result = await callProxyApi(
            `/delete?key=${MASTER_KEY}&generated_key=${encodeURIComponent(key)}`
          );
          if (result.ok) {
            await markKeyDeleted(key);
          }
          results.push({ key, ok: result.ok });
        }
        return { results };
      }),

    myKeys: localAuthProcedure.query(async ({ ctx }) => {
      return getKeysByUser(ctx.localUser.id);
    }),

    findCreator: adminProcedure
      .input(z.object({ keyValue: z.string().min(1).max(512) }))
      .query(async ({ input }) => {
        const result = await findKeyCreator(input.keyValue);
        if (!result) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Chave não encontrada no banco de dados local" });
        }
        return result;
      }),

    publicUpdateIp: publicProcedure
      .input(z.object({ generatedKey: z.string().min(1).max(512), newIp: z.string().min(1).max(64) }))
      .mutation(async ({ input, ctx }) => {
        // SEGURANÇA: Verificar blacklist antes de processar
        if (await isIpBlacklisted(input.newIp)) {
          throw new TRPCError({ code: "FORBIDDEN", message: "Este IP está na lista negra e não pode ser utilizado." });
        }

        // SEGURANÇA: Também verificar o IP do solicitante
        const requesterIp = getClientIp(ctx.req);
        if (BANNED_IPS.includes(requesterIp) || await isIpBlacklisted(requesterIp)) {
          throw new TRPCError({ code: "FORBIDDEN", message: "ACESSO BLOQUEADO: Seu IP está na lista negra." });
        }

        if (!MASTER_KEY) {
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Serviço indisponível." });
        }

        const result = await callProxyApi(
          `/update?key=${MASTER_KEY}&generated_key=${encodeURIComponent(input.generatedKey)}&new_ip=${encodeURIComponent(input.newIp)}`
        );
        return { ok: result.ok, data: result.data, raw: result.raw };
      }),
  }),

  // ─── Logs (admin only) ─────────────────────────────────────────────────────
  logs: router({
    list: adminProcedure.query(async () => {
      return listAccessLogs();
    }),
    generation: adminProcedure.query(async () => {
      return listGenerationHistory();
    }),
  }),

  // ─── Users (admin only) ────────────────────────────────────────────────────
  users: router({
    create: adminProcedure
      .input(z.object({
        username: z.string().min(3).max(64),
        password: z.string().min(6).max(256),
        credits: z.number().int().min(0).default(0),
      }))
      .mutation(async ({ input }) => {
        const existing = await getLocalUserByUsername(input.username);
        if (existing) {
          throw new TRPCError({ code: "CONFLICT", message: "Nome de usuário já existe" });
        }
        const passwordHash = await bcrypt.hash(input.password, 12);
        const user = await createLocalUser({
          username: input.username,
          passwordHash,
          role: "reseller",
          credits: input.credits,
        });
        return { id: user!.id, username: user!.username, role: user!.role, credits: user!.credits };
      }),

    list: adminProcedure.query(async () => {
      const users = await listLocalUsers();
      console.log(`[Admin] Listando ${users.length} usuários locais.`);
      return users;
    }),

    addCredits: adminProcedure
      .input(z.object({ userId: z.number().int(), amount: z.number().int().min(1) }))
      .mutation(async ({ input }) => {
        try {
          await addCredits(input.userId, input.amount);
          console.log(`[Admin] ${input.amount} créditos adicionados ao usuário ID: ${input.userId}`);
          return { success: true };
        } catch (e) {
          console.error(`[Admin] Erro ao adicionar créditos:`, e);
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Falha ao salvar créditos no banco" });
        }
      }),

    setCredits: adminProcedure
      .input(z.object({ userId: z.number().int(), credits: z.number().int().min(0) }))
      .mutation(async ({ input }) => {
        await updateUserCredits(input.userId, input.credits);
        return { success: true };
      }),

    removeCredits: adminProcedure
      .input(z.object({ userId: z.number().int(), amount: z.number().int().min(1) }))
      .mutation(async ({ input }) => {
        const user = await getLocalUserById(input.userId);
        if (!user) throw new TRPCError({ code: "NOT_FOUND", message: "Usuário não encontrado" });
        const newCredits = Math.max(0, user.credits - input.amount);
        await updateUserCredits(input.userId, newCredits);
        return { success: true, newCredits };
      }),

    delete: adminProcedure
      .input(z.object({ userId: z.number().int() }))
      .mutation(async ({ input, ctx }) => {
        console.log(`[Admin] Tentando excluir usuário ID: ${input.userId}`);
        const user = await getLocalUserById(input.userId);
        if (!user) {
          console.error(`[Admin] Falha ao excluir: Usuário ${input.userId} não encontrado.`);
          throw new TRPCError({ code: "NOT_FOUND", message: "Usuário não encontrado" });
        }
        if (user.role === "admin") {
          console.warn(`[Admin] Tentativa bloqueada de excluir outro administrador: ${user.username}`);
          throw new TRPCError({ code: "FORBIDDEN", message: "Não é possível excluir um administrador" });
        }
        
        try {
          await deleteLocalUser(input.userId);
          console.log(`[Admin] Usuário ${user.username} (ID: ${input.userId}) excluído com sucesso do banco.`);
          return { success: true };
        } catch (e) {
          console.error(`[Admin] Erro fatal ao excluir usuário no banco:`, e);
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Erro ao processar exclusão no banco de dados" });
        }
      }),

    deleteAllKeys: adminProcedure
      .input(z.object({ userId: z.number().int() }))
      .mutation(async ({ input }) => {
        const user = await getLocalUserById(input.userId);
        if (!user) throw new TRPCError({ code: "NOT_FOUND", message: "Usuário não encontrado" });
        
        // Buscar as keys do usuário para deletar na API externa também
        const userKeys = await getKeysByUserId(input.userId);
        const activeKeys = userKeys.filter(k => k.status === "active");
        
        console.log(`[Admin] Deletando ${activeKeys.length} keys do usuário ${user.username}`);
        
        // Deletar na API externa
        if (MASTER_KEY) {
          for (const key of activeKeys) {
            await callProxyApi(`/delete?key=${MASTER_KEY}&generated_key=${encodeURIComponent(key.keyValue)}`);
          }
        }
        
        // Marcar como deletado no banco local
        await deleteKeysByUserId(input.userId);
        
        return { success: true, count: activeKeys.length };
      }),

    changePassword: adminProcedure
      .input(z.object({ userId: z.number().int(), newPassword: z.string().min(6).max(256) }))
      .mutation(async ({ input }) => {
        const passwordHash = await bcrypt.hash(input.newPassword, 12);
        await updateUserPassword(input.userId, passwordHash);
        // Ao mudar a senha, também resetamos a sessão por segurança
        await resetUserSession(input.userId);
        return { success: true };
      }),

    updateMaxDevices: adminProcedure
      .input(z.object({ userId: z.number().int(), maxDevices: z.number().int().min(1).max(50) }))
      .mutation(async ({ input }) => {
        await updateUserMaxIps(input.userId, input.maxDevices);
        return { success: true };
      }),

    resetSession: adminProcedure
      .input(z.object({ userId: z.number().int() }))
      .mutation(async ({ input }) => {
        await resetUserSession(input.userId);
        return { success: true };
      }),
    
    resetDevice: adminProcedure
      .input(z.object({ userId: z.number().int() }))
      .mutation(async ({ input }) => {
        await updateUserDeviceId(input.userId, null);
        return { success: true };
      }),

    resetAllSessions: adminProcedure.mutation(async () => {
      await resetAllSessions();
      return { success: true };
    }),
  }),

  proxy: router({
    list: publicProcedure.query(async () => {
      return listProxyStatus();
    }),
    updateStatus: adminProcedure
      .input(z.object({ id: z.number().int(), status: z.enum(["online", "offline"]) }))
      .mutation(async ({ input }) => {
        await updateProxyStatus(input.id, input.status);
        return { success: true };
      }),
  }),

  blacklist: router({
    list: adminProcedure.query(async () => {
      return listBlacklist();
    }),
    add: adminProcedure
      .input(z.object({ ipAddress: z.string().min(1), reason: z.string().optional() }))
      .mutation(async ({ input }) => {
        await addToBlacklist(input);
        return { success: true };
      }),
    remove: adminProcedure
      .input(z.object({ ipAddress: z.string().min(1) }))
      .mutation(async ({ input }) => {
        await removeFromBlacklist(input.ipAddress);
        return { success: true };
      }),
  }),

  // ─── Reports ───────────────────────────────────────────────────────────────
  reports: router({
    submit: publicProcedure
      .input(z.object({
        reporterName: z.string().min(1).max(255),
        discordLink: z.string().min(1).max(255),
        scamKey: z.string().min(1).max(255),
        description: z.string().min(1).max(2000),
        imageUrls: z.string().max(5000).optional(),
      }))
      .mutation(async ({ input }) => {
        try {
          console.log(`[Reports] Recebendo denúncia de ${input.reporterName}`);
          await createReport({
            reporterName: input.reporterName,
            discordLink: input.discordLink,
            scamKey: input.scamKey,
            description: input.description,
            imageUrls: input.imageUrls,
          });
          return { success: true };
        } catch (error) {
          console.error("[Reports] Erro ao salvar denúncia:", error);
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Erro ao salvar denúncia no servidor. Verifique se as imagens não são muito grandes.',
          });
        }
      }),

    list: adminProcedure.query(async () => {
      return listReports();
    }),

    delete: adminProcedure
      .input(z.object({ id: z.number().int() }))
      .mutation(async ({ input }) => {
        await deleteReport(input.id);
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
