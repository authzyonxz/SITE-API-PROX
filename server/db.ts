import { eq, desc, count, and, lt, gte } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, localUsers, generatedKeys, InsertLocalUser, InsertGeneratedKey } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ─── Manus OAuth users (required by template) ────────────────────────────────

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) { console.warn("[Database] Cannot upsert user: database not available"); return; }

  try {
    const values: InsertUser = { openId: user.openId };
    const updateSet: Record<string, unknown> = {};
    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];
    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };
    textFields.forEach(assignNullable);
    if (user.lastSignedIn !== undefined) { values.lastSignedIn = user.lastSignedIn; updateSet.lastSignedIn = user.lastSignedIn; }
    if (user.role !== undefined) { values.role = user.role; updateSet.role = user.role; }
    else if (user.openId === ENV.ownerOpenId) { values.role = 'admin'; updateSet.role = 'admin'; }
    if (!values.lastSignedIn) values.lastSignedIn = new Date();
    if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = new Date();
    await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ─── Local panel users ────────────────────────────────────────────────────────

export async function getLocalUserByUsername(username: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(localUsers).where(eq(localUsers.username, username)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getLocalUserById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(localUsers).where(eq(localUsers.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createLocalUser(data: InsertLocalUser) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(localUsers).values(data);
  return getLocalUserByUsername(data.username);
}

export async function listLocalUsers() {
  const db = await getDb();
  if (!db) return [];
  return db.select({
    id: localUsers.id,
    username: localUsers.username,
    role: localUsers.role,
    credits: localUsers.credits,
    createdAt: localUsers.createdAt,
  }).from(localUsers).orderBy(desc(localUsers.createdAt));
}

export async function deductCredits(userId: number, amount: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const user = await getLocalUserById(userId);
  if (!user) throw new Error("User not found");
  if (user.credits < amount) throw new Error("Créditos insuficientes");
  await db.update(localUsers)
    .set({ credits: user.credits - amount })
    .where(eq(localUsers.id, userId));
}

export async function addCredits(userId: number, amount: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const user = await getLocalUserById(userId);
  if (!user) throw new Error("User not found");
  await db.update(localUsers)
    .set({ credits: user.credits + amount })
    .where(eq(localUsers.id, userId));
}

export async function updateUserCredits(userId: number, credits: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(localUsers).set({ credits }).where(eq(localUsers.id, userId));
}

// ─── Generated keys ───────────────────────────────────────────────────────────

export async function saveGeneratedKey(data: InsertGeneratedKey) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(generatedKeys).values(data);
}

export async function markKeyDeleted(keyValue: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(generatedKeys)
    .set({ status: "deleted" })
    .where(eq(generatedKeys.keyValue, keyValue));
}

export async function getKeyStats() {
  const db = await getDb();
  if (!db) return { active: 0, expired: 0, deleted: 0 };
  const now = new Date();

  // Update expired keys
  await db.update(generatedKeys)
    .set({ status: "expired" })
    .where(and(eq(generatedKeys.status, "active"), lt(generatedKeys.expiresAt, now)));

  const [activeResult] = await db.select({ value: count() }).from(generatedKeys)
    .where(eq(generatedKeys.status, "active"));
  const [expiredResult] = await db.select({ value: count() }).from(generatedKeys)
    .where(eq(generatedKeys.status, "expired"));

  return {
    active: activeResult?.value ?? 0,
    expired: expiredResult?.value ?? 0,
  };
}

export async function getResellerCount() {
  const db = await getDb();
  if (!db) return 0;
  const [result] = await db.select({ value: count() }).from(localUsers)
    .where(eq(localUsers.role, "reseller"));
  return result?.value ?? 0;
}

export async function getKeysByUser(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(generatedKeys)
    .where(eq(generatedKeys.createdById, userId))
    .orderBy(desc(generatedKeys.createdAt))
    .limit(50);
}
