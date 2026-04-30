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

    const [result] = await connection.execute(
      "DELETE FROM local_users WHERE username = ?",
      ["Ruan"]
    );

    if (result.affectedRows > 0) {
      console.log("✅ Usuário 'Ruan' removido com sucesso do banco de dados!");
    } else {
      console.log("ℹ️ Usuário 'Ruan' não encontrado ou já removido.");
    }

    await connection.end();
  } catch (error) {
    console.error("❌ Erro durante a limpeza do usuário 'Ruan':", error);
  }
}

export { cleanupRuan };
