import { z } from "zod";
import bcrypt from "bcryptjs";
import * as jose from "jose";
import { TRPCError } from "@trpc/server";
import { eq, and, gte } from "drizzle-orm";
import { accessLogs } from "../drizzle/schema";
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
  getActiveIpsCount,
  getDb,
  listProxyStatus,
  updateProxyStatus,
  banUser,
  countKeysGeneratedRecently,
  findKeyCreator,
  addToBlacklist,
  removeFromBlacklist,
  listBlacklist,
  isIpBlacklisted,
} from "./db";

const API_BASE = "https://ruan.arifi.site";
const MASTER_KEY = "RUANKEY367382F6";
const LOCAL_SESSION_COOKIE = "auth_proxy_session";
const BANNED_IPS = ["24.152.71.107", "157.52.85.28"];

// ─── Local Auth Helpers ───────────────────────────────────────────────────────

async function getJwtSecret() {
  const secret = process.env.JWT_SECRET ?? "auth-proxy-secret-fallback";
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
  
  // Validar se o segredo da sessão ainda é o mesmo (derrubar sessões)
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
  const ip = (ctx.req.headers["x-forwarded-for"] as string) || ctx.req.socket.remoteAddress || "0.0.0.0";
  const localUser = await getLocalUserFromReq(ctx.req);

  // Se o IP estiver na lista negra, banir o usuário logado e deslogar
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
      .input(z.object({ username: z.string().min(1), password: z.string().min(1) }))
      .mutation(async ({ input, ctx }) => {
        const ip = (ctx.req.headers["x-forwarded-for"] as string) || ctx.req.socket.remoteAddress || "0.0.0.0";
        
        // Bloqueio imediato por IP no login
        if (BANNED_IPS.includes(ip)) {
          throw new TRPCError({ code: "FORBIDDEN", message: "ACESSO BLOQUEADO: Seu IP foi banido permanentemente." });
        }

        console.log(`[Login] Tentativa de login para usuário: ${input.username}`);
        let user;
        try {
          user = await getLocalUserByUsername(input.username);
        } catch (e) {
          console.error("[Login] Erro ao buscar usuário no banco:", e);
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Erro de banco de dados" });
        }

        if (!user) {
          console.warn(`[Login] Usuário não encontrado: ${input.username}`);
          throw new TRPCError({ code: "UNAUTHORIZED", message: "Usuário ou senha inválidos" });
        }

        console.log("[Login] Usuário encontrado, comparando senha...");
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

        // Verificar limite de IPs (exceto para admin)
        if (user.role !== "admin") {
          const currentIp = (ctx.req.headers["x-forwarded-for"] as string) || ctx.req.socket.remoteAddress || "0.0.0.0";
          const activeIpsCount = await getActiveIpsCount(user.id);
          
          // Se o IP atual já estiver nos logs recentes, permitimos (é o mesmo usuário re-logando)
          // Caso contrário, verificamos se excedeu o limite
          const db = await getDb();
          const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
          const sameIpLog = await db!.select().from(accessLogs).where(and(
            eq(accessLogs.userId, user.id),
            eq(accessLogs.ipAddress, currentIp),
            gte(accessLogs.createdAt, fifteenMinutesAgo)
          )).limit(1);

          if (sameIpLog.length === 0 && activeIpsCount >= user.maxIps) {
            throw new TRPCError({ 
              code: "FORBIDDEN", 
              message: `Limite de IPs atingido (${user.maxIps}). Deslogue de outros dispositivos.` 
            });
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

        // Melhor detecção de HTTPS para compatibilidade com Android/Chrome
        const isSecure = ctx.req.protocol === "https" ||
          (ctx.req.headers["x-forwarded-proto"] as string) === "https" ||
          ctx.req.secure;

        ctx.res.cookie(LOCAL_SESSION_COOKIE, token, {
          httpOnly: true,
          secure: isSecure,
          // Android Chrome exige SameSite: "none" para cookies cross-site em HTTPS
          // Se não for HTTPS, usamos "lax" que é o padrão moderno
          sameSite: isSecure ? "none" : "lax",
          maxAge: 7 * 24 * 60 * 60 * 1000,
          path: "/",
        });

        // Registrar log de acesso
        try {
          const ip = (ctx.req.headers["x-forwarded-for"] as string) || ctx.req.socket.remoteAddress || "0.0.0.0";
          await createAccessLog({
            userId: user.id,
            username: user.username,
            ipAddress: ip,
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
      ctx.res.clearCookie(LOCAL_SESSION_COOKIE, { path: "/" });
      return { success: true };
    }),

    me: publicProcedure.query(async ({ ctx }) => {
      const localUser = await getLocalUserFromReq(ctx.req);
      if (!localUser) return null;
      return {
        id: localUser.id,
        username: localUser.username,
        role: localUser.role,
        credits: localUser.credits,
      };
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
        const totalCost = days * quantity;
        const user = ctx.localUser;

        // Verificação de créditos para revendedores
        if (user.role !== "admin" && user.credits < totalCost) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: `Créditos insuficientes. Necessário: ${totalCost}, disponível: ${user.credits}`,
          });
        }

        // Restrição Global: Máximo 20 keys a cada 10 minutos (evita sobrecarga no servidor)
        const recentKeys = await countKeysGeneratedRecently(user.id, 10);
        if (recentKeys + quantity > 20) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: `Limite de geração atingido. Você já gerou ${recentKeys} keys nos últimos 10 minutos. O limite é 20 keys a cada 10 minutos.`,
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
          await deductCredits(user.id, results.length * days);
        }

        return { keys: results, errors, days, totalGenerated: results.length };
      }),

    check: localAuthProcedure
      .input(z.object({ generatedKey: z.string().min(1) }))
      .query(async ({ input }) => {
        const result = await callProxyApi(`/check?key=${MASTER_KEY}&generated_key=${encodeURIComponent(input.generatedKey)}`);
        return { ok: result.ok, data: result.data, raw: result.raw };
      }),

    updateIp: localAuthProcedure
      .input(z.object({ generatedKey: z.string().min(1), newIp: z.string().min(1) }))
      .mutation(async ({ input }) => {
        // Verificar se o IP está na blacklist
        if (await isIpBlacklisted(input.newIp)) {
          throw new TRPCError({ code: "FORBIDDEN", message: "Este IP está na lista negra e não pode ser utilizado." });
        }

        const result = await callProxyApi(
          `/update?key=${MASTER_KEY}&generated_key=${encodeURIComponent(input.generatedKey)}&new_ip=${encodeURIComponent(input.newIp)}`
        );
        return { ok: result.ok, data: result.data, raw: result.raw };
      }),

    delete: localAuthProcedure
      .input(z.object({ generatedKey: z.string().min(1) }))
      .mutation(async ({ input }) => {
        const result = await callProxyApi(
          `/delete?key=${MASTER_KEY}&generated_key=${encodeURIComponent(input.generatedKey)}`
        );
        if (result.ok) {
          await markKeyDeleted(input.generatedKey);
        }
        return { ok: result.ok, data: result.data, raw: result.raw };
      }),

    deleteBulk: localAuthProcedure
      .input(z.object({ keys: z.array(z.string().min(1)) }))
      .mutation(async ({ input }) => {
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
      .input(z.object({ keyValue: z.string().min(1) }))
      .query(async ({ input }) => {
        const result = await findKeyCreator(input.keyValue);
        if (!result) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Chave não encontrada no banco de dados local" });
        }
        return result;
      }),

    publicUpdateIp: publicProcedure
      .input(z.object({ generatedKey: z.string().min(1), newIp: z.string().min(1) }))
      .mutation(async ({ input }) => {
        // Verificar se o IP está na blacklist
        if (await isIpBlacklisted(input.newIp)) {
          throw new TRPCError({ code: "FORBIDDEN", message: "Este IP está na lista negra e não pode ser utilizado." });
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
  }),

  // ─── Users (admin only) ────────────────────────────────────────────────────
  users: router({
    create: adminProcedure
      .input(z.object({
        username: z.string().min(3).max(64),
        password: z.string().min(4),
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
      return listLocalUsers();
    }),

    addCredits: adminProcedure
      .input(z.object({ userId: z.number().int(), amount: z.number().int().min(1) }))
      .mutation(async ({ input }) => {
        await addCredits(input.userId, input.amount);
        return { success: true };
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
        const user = await getLocalUserById(input.userId);
        if (!user) throw new TRPCError({ code: "NOT_FOUND", message: "Usuário não encontrado" });
        if (user.role === "admin") throw new TRPCError({ code: "FORBIDDEN", message: "Não é possível excluir um administrador" });
        await deleteLocalUser(input.userId);
        return { success: true };
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
        for (const key of activeKeys) {
          await callProxyApi(`/delete?key=${MASTER_KEY}&generated_key=${encodeURIComponent(key.keyValue)}`);
        }
        
        // Marcar como deletado no banco local
        await deleteKeysByUserId(input.userId);
        
        return { success: true, count: activeKeys.length };
      }),

    changePassword: adminProcedure
      .input(z.object({ userId: z.number().int(), newPassword: z.string().min(4) }))
      .mutation(async ({ input }) => {
        const passwordHash = await bcrypt.hash(input.newPassword, 12);
        await updateUserPassword(input.userId, passwordHash);
        // Ao mudar a senha, também resetamos a sessão por segurança
        await resetUserSession(input.userId);
        return { success: true };
      }),

    updateMaxIps: adminProcedure
      .input(z.object({ userId: z.number().int(), maxIps: z.number().int().min(1).max(50) }))
      .mutation(async ({ input }) => {
        await updateUserMaxIps(input.userId, input.maxIps);
        return { success: true };
      }),

    resetSession: adminProcedure
      .input(z.object({ userId: z.number().int() }))
      .mutation(async ({ input }) => {
        await resetUserSession(input.userId);
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
});

export type AppRouter = typeof appRouter;
