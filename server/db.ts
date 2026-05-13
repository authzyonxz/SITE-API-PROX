import { eq, desc, count, and, lt, gte, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import crypto from "node:crypto";
import { InsertUser, users, localUsers, generatedKeys, InsertLocalUser, InsertGeneratedKey, accessLogs, InsertAccessLog, proxyStatus, ipBlacklist, InsertIpBlacklist, reports, InsertReport } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
      
      // Auto-migration: Garantir que as tabelas e colunas existam
      const db = _db;
      setTimeout(async () => {
        try {
          console.log("[Database] Verificando estrutura das tabelas...");
          // Tabela de denúncias
          await db.execute(sql`CREATE TABLE IF NOT EXISTS reports (
            id INT AUTO_INCREMENT PRIMARY KEY,
            reporterName VARCHAR(255) NOT NULL,
            discordLink VARCHAR(255) NOT NULL,
            scamKey VARCHAR(255) NOT NULL,
            description TEXT NOT NULL,
            imageUrls TEXT,
            status ENUM('pending', 'reviewed', 'resolved') DEFAULT 'pending' NOT NULL,
            createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
          )`);
          
          await db.execute(sql`ALTER TABLE local_users ADD COLUMN IF NOT EXISTS deviceId VARCHAR(1000)`);
          await db.execute(sql`ALTER TABLE access_logs ADD COLUMN IF NOT EXISTS deviceId VARCHAR(255)`);
          console.log("[Database] Estrutura verificada com sucesso.");
        } catch (e) {
          console.error("[Database] Erro na auto-migração:", e);
        }
      }, 1000);
      // Rodamos em um bloco try-catch separado para não travar se a coluna já existir
      const db = _db;
      setTimeout(async () => {
        try {
          console.log("[Database] Verificando estrutura das tabelas...");
          await db.execute(sql`ALTER TABLE local_users ADD COLUMN IF NOT EXISTS deviceId VARCHAR(1000)`);
          await db.execute(sql`ALTER TABLE access_logs ADD COLUMN IF NOT EXISTS deviceId VARCHAR(255)`);
          console.log("[Database] Estrutura verificada com sucesso.");
        } catch (e) {
          // Se falhar (ex: MySQL antigo que não suporta IF NOT EXISTS), tentamos sem o IF NOT EXISTS e ignoramos erro de "coluna duplicada"
          try {
            await db.execute(sql`ALTER TABLE local_users ADD COLUMN deviceId VARCHAR(1000)`);
          } catch (err) {}
          try {
            await db.execute(sql`ALTER TABLE access_logs ADD COLUMN deviceId VARCHAR(255)`);
          } catch (err) {}
        }
      }, 1000);
      
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
    deviceId: localUsers.deviceId,
    createdAt: localUsers.createdAt,
  }).from(localUsers).orderBy(desc(localUsers.createdAt));
}

export async function updateUserDeviceId(userId: number, deviceId: string | null) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(localUsers).set({ deviceId }).where(eq(localUsers.id, userId));
}

export async function deleteLocalUser(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(localUsers).where(eq(localUsers.id, userId));
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

export async function updateUserPassword(userId: number, passwordHash: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(localUsers).set({ passwordHash }).where(eq(localUsers.id, userId));
}

export async function updateUserMaxIps(userId: number, maxDevices: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(localUsers).set({ maxDevices }).where(eq(localUsers.id, userId));
}

export async function resetUserSession(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const newSecret = crypto.randomUUID();
  await db.update(localUsers).set({ sessionSecret: newSecret }).where(eq(localUsers.id, userId));
}

export async function resetAllSessions() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const newSecret = crypto.randomUUID();
  await db.update(localUsers).set({ sessionSecret: newSecret });
}

export async function getActiveDevicesCount(userId: number) {
  const db = await getDb();
  if (!db) return 0;
  
  // Buscar o usuário para ver quais dispositivos estão vinculados
  const user = await getLocalUserById(userId);
  if (!user || !user.deviceId) return 0;
  
  // O deviceId é uma string com IDs separados por vírgula
  const devices = user.deviceId.split(",").filter(id => id.trim() !== "");
  return devices.length;
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

// ─── Access Logs ──────────────────────────────────────────────────────────────

export async function createAccessLog(data: InsertAccessLog) {
  const db = await getDb();
  if (!db) return;
  await db.insert(accessLogs).values(data);
}

export async function listAccessLogs() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(accessLogs).orderBy(desc(accessLogs.createdAt)).limit(100);
}

export async function listGenerationHistory() {
  const db = await getDb();
  if (!db) return [];
  
  return db.select({
    id: generatedKeys.id,
    keyValue: generatedKeys.keyValue,
    days: generatedKeys.days,
    status: generatedKeys.status,
    createdAt: generatedKeys.createdAt,
    expiresAt: generatedKeys.expiresAt,
    creator: {
      username: localUsers.username,
      role: localUsers.role
    }
  })
  .from(generatedKeys)
  .innerJoin(localUsers, eq(generatedKeys.createdById, localUsers.id))
  .orderBy(desc(generatedKeys.createdAt))
  .limit(200);
}

// ─── Key Management ───────────────────────────────────────────────────────────

export async function getKeysByUserId(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(generatedKeys).where(eq(generatedKeys.createdById, userId));
}

export async function findKeyCreator(keyValue: string) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.select({
    key: generatedKeys,
    creator: {
      username: localUsers.username,
      role: localUsers.role
    }
  })
  .from(generatedKeys)
  .innerJoin(localUsers, eq(generatedKeys.createdById, localUsers.id))
  .where(eq(generatedKeys.keyValue, keyValue))
  .limit(1);
  
  return result.length > 0 ? result[0] : null;
}

export async function deleteKeysByUserId(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(generatedKeys)
    .set({ status: "deleted" })
    .where(eq(generatedKeys.createdById, userId));
}

// ─── Proxy Status ─────────────────────────────────────────────────────────────

export async function listProxyStatus() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(proxyStatus);
}

export async function updateProxyStatus(id: number, status: "online" | "offline") {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(proxyStatus).set({ status }).where(eq(proxyStatus.id, id));
}

export async function banUser(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(localUsers).set({ isBanned: 1 }).where(eq(localUsers.id, userId));
}

// ─── IP Blacklist ─────────────────────────────────────────────────────────────

export async function addToBlacklist(data: InsertIpBlacklist) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(ipBlacklist).values(data).onDuplicateKeyUpdate({ set: { reason: data.reason } });
}

export async function removeFromBlacklist(ipAddress: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(ipBlacklist).where(eq(ipBlacklist.ipAddress, ipAddress));
}

export async function listBlacklist() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(ipBlacklist).orderBy(desc(ipBlacklist.createdAt));
}

export async function isIpBlacklisted(ipAddress: string) {
  const db = await getDb();
  if (!db) return false;
  const result = await db.select().from(ipBlacklist).where(eq(ipBlacklist.ipAddress, ipAddress)).limit(1);
  return result.length > 0;
}

export async function countKeysGeneratedRecently(userId: number, minutes: number) {
  const db = await getDb();
  if (!db) return 0;
  const since = new Date(Date.now() - minutes * 60 * 1000);
  const [result] = await db.select({ value: count() })
    .from(generatedKeys)
    .where(and(
      eq(generatedKeys.createdById, userId),
      gte(generatedKeys.createdAt, since),
      eq(generatedKeys.status, "active")
    ));
  return result?.value ?? 0;
}

export async function createReport(report: InsertReport) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(reports).values(report);
}

export async function listReports() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(reports).orderBy(desc(reports.createdAt));
}

export async function deleteReport(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(reports).where(eq(reports.id, id));
}
