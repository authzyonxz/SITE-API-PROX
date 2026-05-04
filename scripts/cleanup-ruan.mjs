import mysql from "mysql2/promise";

async function cleanupRuan() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error("❌ DATABASE_URL não configurada para o cleanup!");
    return;
  }

  try {
    console.log("🧹 Iniciando limpeza do usuário 'Ruan'...");
    const url = new URL(databaseUrl);
    const connection = await mysql.createConnection({
      host: url.hostname,
      user: url.username,
      password: url.password,
      database: url.pathname.slice(1),
      port: url.port || 3306,
    });

    // Remover 'Ruan'
    const [res1] = await connection.execute("DELETE FROM local_users WHERE username = ?", ["Ruan"]);
    // Remover '@ruanwq'
    const [res2] = await connection.execute("DELETE FROM local_users WHERE username = ?", ["@ruanwq"]);

    if (res1.affectedRows > 0 || res2.affectedRows > 0) {
      console.log("✅ Usuários antigos removidos com sucesso!");
    } else {
      console.log("ℹ️ Nenhum usuário antigo encontrado.");
    }

    await connection.end();
  } catch (error) {
    console.error("❌ Erro durante a limpeza do usuário 'Ruan':", error);
  }
}

export { cleanupRuan };
