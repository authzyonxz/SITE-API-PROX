import { z } from "zod";
import bcrypt from "bcryptjs";
import * as jose from "jose";
import { TRPCError } from "@trpc/server";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { systemRouter } from "./_core/systemRouter";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import {
  getLocalUserByUsername,
  getLocalUserById,
  createLocalUser,
  listLocalUsers,
  deductCredits,
  addCredits,
  updateUserCredits,
  saveGeneratedKey,
  markKeyDeleted,
  getKeyStats,
  getResellerCount,
  getKeysByUser,
} from "./db";

const API_BASE = "http://212.227.7.153:9945";
const MASTER_KEY = "RUANKEY367382F6";
const LOCAL_SESSION_COOKIE = "auth_proxy_session";

// ─── Local Auth Helpers ───────────────────────────────────────────────────────

async function getJwtSecret() {
  const secret = process.env.JWT_SECRET ?? "auth-proxy-secret-fallback";
  return new TextEncoder().encode(secret);
}

async function signLocalToken(userId: number, role: string) {
  const secret = await getJwtSecret();
  return new jose.SignJWT({ userId, role })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(secret);
}

async function verifyLocalToken(token: string) {
  try {
    const secret = await getJwtSecret();
    const { payload } = await jose.jwtVerify(token, secret);
    return payload as { userId: number; role: string };
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
  return getLocalUserById(payload.userId);
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
  const localUser = await getLocalUserFromReq(ctx.req);
  if (!localUser) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Faça login para continuar" });
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

        console.log("[Login] Senha válida, gerando token...");
        let token;
        try {
          token = await signLocalToken(user.id, user.role);
        } catch (e) {
          console.error("[Login] Erro ao gerar token JWT:", e);
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Erro ao gerar sessão" });
        }

        const isSecure = ctx.req.protocol === "https" ||
          (ctx.req.headers["x-forwarded-proto"] as string) === "https";

        ctx.res.cookie(LOCAL_SESSION_COOKIE, token, {
          httpOnly: true,
          secure: isSecure,
          sameSite: isSecure ? "none" : "lax",
          maxAge: 7 * 24 * 60 * 60 * 1000,
          path: "/",
        });

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

        if (user.role !== "admin" && user.credits < totalCost) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: `Créditos insuficientes. Necessário: ${totalCost}, disponível: ${user.credits}`,
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

    myKeys: localAuthProcedure.query(async ({ ctx }) => {
      return getKeysByUser(ctx.localUser.id);
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
  }),
});

export type AppRouter = typeof appRouter;
