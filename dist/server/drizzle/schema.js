import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";
/**
 * Core user table backing Manus OAuth flow.
 */
export const users = mysqlTable("users", {
    id: int("id").autoincrement().primaryKey(),
    openId: varchar("openId", { length: 64 }).notNull().unique(),
    name: text("name"),
    email: varchar("email", { length: 320 }),
    loginMethod: varchar("loginMethod", { length: 64 }),
    role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
    lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});
/**
 * Local panel users: admin and resellers (revendedores).
 * Authentication is done locally with username + password hash.
 */
export const localUsers = mysqlTable("local_users", {
    id: int("id").autoincrement().primaryKey(),
    username: varchar("username", { length: 64 }).notNull().unique(),
    passwordHash: varchar("passwordHash", { length: 255 }).notNull(),
    role: mysqlEnum("role", ["admin", "reseller"]).default("reseller").notNull(),
    credits: int("credits").default(0).notNull(),
    maxDevices: int("maxIps").default(1).notNull(),
    isBanned: int("isBanned").default(0).notNull(),
    sessionSecret: varchar("sessionSecret", { length: 36 }).notNull().default("default-secret"),
    deviceId: varchar("deviceId", { length: 1000 }),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
/**
 * History of generated keys (local record for dashboard stats).
 */
export const generatedKeys = mysqlTable("generated_keys", {
    id: int("id").autoincrement().primaryKey(),
    keyValue: varchar("keyValue", { length: 255 }).notNull(),
    days: int("days").notNull(),
    createdById: int("createdById").notNull(),
    status: mysqlEnum("status", ["active", "expired", "deleted"]).default("active").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    expiresAt: timestamp("expiresAt").notNull(),
});
/**
 * Logs of user login activity.
 */
export const accessLogs = mysqlTable("access_logs", {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull(),
    username: varchar("username", { length: 64 }).notNull(),
    ipAddress: varchar("ipAddress", { length: 255 }).notNull(),
    deviceId: varchar("deviceId", { length: 255 }),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export const proxyStatus = mysqlTable("proxy_status", {
    id: int("id").autoincrement().primaryKey(),
    name: varchar("name", { length: 64 }).notNull().unique(),
    status: mysqlEnum("status", ["online", "offline"]).default("offline").notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
export const ipBlacklist = mysqlTable("ip_blacklist", {
    id: int("id").autoincrement().primaryKey(),
    ipAddress: varchar("ipAddress", { length: 255 }).notNull().unique(),
    reason: text("reason"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
});
/**
 * Table for reporting reseller scams/fraud.
 */
export const reports = mysqlTable("reports", {
    id: int("id").autoincrement().primaryKey(),
    reporterName: varchar("reporterName", { length: 255 }).notNull(),
    discordLink: varchar("discordLink", { length: 255 }).notNull(),
    scamKey: varchar("scamKey", { length: 255 }).notNull(),
    description: text("description").notNull(),
    imageUrls: text("imageUrls"), // Comma-separated or JSON array of image URLs
    status: mysqlEnum("status", ["pending", "reviewed", "resolved"]).default("pending").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
});
