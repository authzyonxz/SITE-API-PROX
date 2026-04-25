import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock database functions
vi.mock("./db", () => ({
  getLocalUserByUsername: vi.fn(),
  getLocalUserById: vi.fn(),
  createLocalUser: vi.fn(),
  listLocalUsers: vi.fn(),
  deductCredits: vi.fn(),
  addCredits: vi.fn(),
  updateUserCredits: vi.fn(),
  saveGeneratedKey: vi.fn(),
  markKeyDeleted: vi.fn(),
  getKeyStats: vi.fn(),
  getResellerCount: vi.fn(),
  getKeysByUser: vi.fn(),
  upsertUser: vi.fn(),
  getUserByOpenId: vi.fn(),
}));

import * as db from "./db";

function createPublicContext(): TrpcContext {
  const cookies: Record<string, string> = {};
  return {
    user: null,
    req: {
      protocol: "https",
      headers: { cookie: "" },
    } as TrpcContext["req"],
    res: {
      cookie: vi.fn(),
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

function createAdminContext(token?: string): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: { cookie: token ? `auth_proxy_session=${token}` : "" },
    } as TrpcContext["req"],
    res: {
      cookie: vi.fn(),
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

describe("localAuth.me", () => {
  it("returns null when no session cookie", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.localAuth.me();
    expect(result).toBeNull();
  });
});

describe("localAuth.login", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns user data on valid credentials", async () => {
    const bcrypt = await import("bcryptjs");
    const hash = await bcrypt.hash("testpass", 12);

    vi.mocked(db.getLocalUserByUsername).mockResolvedValue({
      id: 1,
      username: "testuser",
      passwordHash: hash,
      role: "reseller",
      credits: 50,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.localAuth.login({ username: "testuser", password: "testpass" });

    expect(result.username).toBe("testuser");
    expect(result.role).toBe("reseller");
    expect(result.credits).toBe(50);
  });

  it("throws UNAUTHORIZED on invalid password", async () => {
    const bcrypt = await import("bcryptjs");
    const hash = await bcrypt.hash("correctpass", 12);

    vi.mocked(db.getLocalUserByUsername).mockResolvedValue({
      id: 1,
      username: "testuser",
      passwordHash: hash,
      role: "reseller",
      credits: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.localAuth.login({ username: "testuser", password: "wrongpass" })
    ).rejects.toThrow("Usuário ou senha inválidos");
  });

  it("throws UNAUTHORIZED when user not found", async () => {
    vi.mocked(db.getLocalUserByUsername).mockResolvedValue(undefined);

    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.localAuth.login({ username: "nonexistent", password: "anypass" })
    ).rejects.toThrow("Usuário ou senha inválidos");
  });
});

describe("users.create (admin only)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("blocks non-admin from creating users", async () => {
    // No valid session cookie = UNAUTHORIZED
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.users.create({ username: "newuser", password: "pass123", credits: 10 })
    ).rejects.toThrow();
  });
});

describe("dashboard.stats", () => {
  it("blocks unauthenticated access", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(caller.dashboard.stats()).rejects.toThrow("Faça login para continuar");
  });
});
