import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";
import { localUsers } from "../drizzle/schema.ts";
import { eq } from "drizzle-orm";
import dotenv from "dotenv";
dotenv.config();

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection);

// Create tables
await connection.execute(`
CREATE TABLE IF NOT EXISTS \`generated_keys\` (
  \`id\` int AUTO_INCREMENT NOT NULL,
  \`keyValue\` varchar(255) NOT NULL,
  \`days\` int NOT NULL,
  \`createdById\` int NOT NULL,
  \`status\` enum('active','expired','deleted') NOT NULL DEFAULT 'active',
  \`createdAt\` timestamp NOT NULL DEFAULT (now()),
  \`expiresAt\` timestamp NOT NULL,
  CONSTRAINT \`generated_keys_id\` PRIMARY KEY(\`id\`)
)
`);

await connection.execute(`
CREATE TABLE IF NOT EXISTS \`local_users\` (
  \`id\` int AUTO_INCREMENT NOT NULL,
  \`username\` varchar(64) NOT NULL,
  \`passwordHash\` varchar(255) NOT NULL,
  \`role\` enum('admin','reseller') NOT NULL DEFAULT 'reseller',
  \`credits\` int NOT NULL DEFAULT 0,
  \`createdAt\` timestamp NOT NULL DEFAULT (now()),
  \`updatedAt\` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT \`local_users_id\` PRIMARY KEY(\`id\`),
  CONSTRAINT \`local_users_username_unique\` UNIQUE(\`username\`)
)
`);

console.log("Tables created/verified.");

// Seed admin user
const existing = await db.select().from(localUsers).where(eq(localUsers.username, "Ruan")).limit(1);
if (existing.length === 0) {
  const hash = await bcrypt.hash("Ruan00", 12);
  await db.insert(localUsers).values({
    username: "Ruan",
    passwordHash: hash,
    role: "admin",
    credits: 999999,
  });
  console.log("Admin user 'Ruan' created.");
} else {
  console.log("Admin user 'Ruan' already exists.");
}

await connection.end();
console.log("Migration and seed complete.");
