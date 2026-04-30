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

    // Criar tabela de logs se não existir (garantia extra)
    console.log("📝 Verificando tabela de logs...");
    await ensureAccessLogsTable(databaseUrl);

    // Seed do admin padrão
    console.log("👤 Criando admin padrão...");
    await seedAdmin(databaseUrl);

    // Seed dos status de proxy
    console.log("📡 Criando status iniciais de proxy...");
    await seedProxyStatus(databaseUrl);

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
      ["@ruanwq"]
    );

    if (rows.length === 0) {
      // Hash da senha padrão com bcrypt
      const passwordHash = "$2b$10$YourHashedPasswordHere"; // Será gerado dinamicamente

      // Importar bcrypt
      const bcrypt = await import("bcryptjs");
      const hash = await bcrypt.default.hash("@ruanwq", 10);

      await connection.execute(
        "INSERT INTO local_users (username, passwordHash, role, credits) VALUES (?, ?, ?, ?)",
        ["@ruanwq", hash, "admin", 1000]
      );
      console.log("✅ Admin '@ruanwq' criado com sucesso!");
    } else {
      console.log("ℹ️  Admin '@ruanwq' já existe no banco.");
    }

    await connection.end();
  } catch (error) {
    console.error("❌ Erro ao fazer seed do admin:", error);
    // Não falha se houver erro aqui, pois o admin pode já existir
  }
}

async function ensureAccessLogsTable(databaseUrl) {
  try {
    const url = new URL(databaseUrl);
    const connection = await mysql.createConnection({
      host: url.hostname,
      user: url.username,
      password: url.password,
      database: url.pathname.slice(1),
      port: url.port || 3306,
    });    await connection.execute(`
      CREATE TABLE IF NOT EXISTS access_logs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        userId INT NOT NULL,
        username VARCHAR(64) NOT NULL,
        ipAddress VARCHAR(255) NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Adicionar campos novos se não existirem (para Railway)
    try {
      await connection.execute("ALTER TABLE local_users ADD COLUMN maxIps INT NOT NULL DEFAULT 1");
    } catch (e) {}
    try {
      await connection.execute("ALTER TABLE local_users ADD COLUMN sessionSecret VARCHAR(36) NOT NULL DEFAULT 'default-secret'");
    } catch (e) {}

    console.log("✅ Tabela 'access_logs' e campos de controle verificados.");
    
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS proxy_status (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(64) NOT NULL UNIQUE,
        status ENUM('online', 'offline') NOT NULL DEFAULT 'offline',
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log("✅ Tabela 'proxy_status' verificada/criada.");

    await connection.end();
  } catch (error) {
    console.error("❌ Erro ao verificar tabelas:", error);
  }
}

async function seedProxyStatus(databaseUrl) {
  try {
    const url = new URL(databaseUrl);
    const connection = await mysql.createConnection({
      host: url.hostname,
      user: url.username,
      password: url.password,
      database: url.pathname.slice(1),
      port: url.port || 3306,
    });

    const proxies = ["HS Pescoço com Antena", "HS Pescoço"];
    for (const name of proxies) {
      const [rows] = await connection.execute("SELECT id FROM proxy_status WHERE name = ?", [name]);
      if (rows.length === 0) {
        await connection.execute("INSERT INTO proxy_status (name, status) VALUES (?, ?)", [name, "offline"]);
        console.log(`✅ Status inicial criado para: ${name}`);
      }
    }

    await connection.end();
  } catch (error) {
    console.error("❌ Erro ao fazer seed dos status de proxy:", error);
  }
}

// Executar se for chamado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
  runMigrations();
}

export { runMigrations };
