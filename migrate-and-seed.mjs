import { execSync } from "child_process";
import mysql from "mysql2/promise";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function runMigrations() {
  try {
    console.log("🔄 Iniciando migrações do banco de dados...");

    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      console.error("❌ DATABASE_URL não configurada!");
      process.exit(1);
    }

    // Executar drizzle migrations
    console.log("📝 Executando drizzle-kit migrate...");
    execSync("pnpm drizzle-kit migrate", { stdio: "inherit" });

    // Seed do admin padrão
    console.log("👤 Criando admin padrão...");
    await seedAdmin(databaseUrl);

    console.log("✅ Migrações e seed concluídas com sucesso!");
  } catch (error) {
    console.error("❌ Erro durante migrações:", error);
    process.exit(1);
  }
}

async function seedAdmin(databaseUrl) {
  try {
    // Parse DATABASE_URL
    const url = new URL(databaseUrl);
    const connection = await mysql.createConnection({
      host: url.hostname,
      user: url.username,
      password: url.password,
      database: url.pathname.slice(1),
      port: url.port || 3306,
    });

    // Verificar se admin já existe
    const [rows] = await connection.execute(
      "SELECT * FROM local_users WHERE username = ?",
      ["Ruan"]
    );

    if (rows.length === 0) {
      // Hash da senha "Ruan00" com bcrypt
      const passwordHash = "$2b$10$YourHashedPasswordHere"; // Será gerado dinamicamente

      // Importar bcrypt
      const bcrypt = await import("bcryptjs");
      const hash = await bcrypt.default.hash("Ruan00", 10);

      await connection.execute(
        "INSERT INTO local_users (username, passwordHash, role, credits) VALUES (?, ?, ?, ?)",
        ["Ruan", hash, "admin", 1000]
      );
      console.log("✅ Admin 'Ruan' criado com sucesso!");
    } else {
      console.log("ℹ️  Admin 'Ruan' já existe no banco.");
    }

    await connection.end();
  } catch (error) {
    console.error("❌ Erro ao fazer seed do admin:", error);
    // Não falha se houver erro aqui, pois o admin pode já existir
  }
}

// Executar se for chamado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
  runMigrations();
}

export { runMigrations };
