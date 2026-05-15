import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { User } from "../../drizzle/schema";
import { sdk } from "./sdk";

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: User | null;
};

import * as jose from "jose";
import { getLocalUserById } from "../db";

const LOCAL_SESSION_COOKIE = "auth_proxy_session";

async function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("[SEGURANÇA CRÍTICA] JWT_SECRET não configurado ou muito curto em produção!");
    }
    return new TextEncoder().encode("auth-proxy-dev-secret-CHANGE-IN-PRODUCTION-min32chars");
  }
  return new TextEncoder().encode(secret);
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

export async function createContext(
  opts: CreateExpressContextOptions
): Promise<TrpcContext> {
  let user: any = null;

  try {
    // 1. Tentar autenticação local (auth_proxy_session) - Prioridade para o seu sistema
    const cookieHeader = opts.req.headers?.cookie ?? "";
    const cookies: Record<string, string> = {};
    cookieHeader.split(";").forEach((c: string) => {
      const [k, ...v] = c.trim().split("=");
      if (k) cookies[k.trim()] = decodeURIComponent(v.join("="));
    });
    
    const token = cookies[LOCAL_SESSION_COOKIE];
    if (token) {
      const payload = await verifyLocalToken(token);
      if (payload) {
        const localUser = await getLocalUserById(payload.userId);
        // SEGURANÇA: Verificar isBanned E sessionSecret para garantir que sessões
        // antigas sejam invalidadas após reset de senha ou logout forçado pelo admin.
        if (localUser && localUser.isBanned !== 1 && localUser.sessionSecret === payload.ss) {
          user = localUser;
        }
      }
    }

    // 2. Se não encontrou usuário local, tentar autenticação padrão (Manus SDK)
    if (!user) {
      user = await sdk.authenticateRequest(opts.req);
    }
  } catch (error) {
    // Authentication is optional for public procedures.
    user = null;
  }

  return {
    req: opts.req,
    res: opts.res,
    user,
  };
}
