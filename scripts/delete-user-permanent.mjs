import mysql from "mysql2/promise";

async function main() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error("❌ DATABASE_URL não encontrada!");
    process.exit(1);
  }

  const username = "79998630914";

  try {
    const url = new URL(databaseUrl);
    const connection = await mysql.createConnection({
      host: url.hostname,
      user: url.username,
      password: url.password,
      database: url.pathname.slice(1),
      port: url.port || 3306,
    });

    console.log(`[Delete] Tentando deletar o usuário: ${username}`);

    // 1. Deletar registros relacionados (se houver logs de acesso)
    const [userRows] = await connection.execute("SELECT id FROM local_users WHERE username = ?", [username]);
    
    if (userRows.length === 0) {
      console.log(`[Delete] Usuário ${username} não encontrado no banco de dados.`);
    } else {
      const userId = userRows[0].id;
      
      // Deletar logs de acesso
      await connection.execute("DELETE FROM access_logs WHERE userId = ?", [userId]);
      console.log(`[Delete] Logs de acesso removidos.`);

      // Deletar o usuário
      const [result] = await connection.execute("DELETE FROM local_users WHERE id = ?", [userId]);
      
      if (result.affectedRows > 0) {
        console.log(`[Delete] SUCESSO: Usuário ${username} foi deletado permanentemente do banco de dados.`);
      } else {
        console.log(`[Delete] Falha ao deletar o usuário.`);
      }
    }

    await connection.end();
  } catch (error) {
    console.error("[Delete] Erro ao executar a exclusão:", error);
    process.exit(1);
  }
}

main();
