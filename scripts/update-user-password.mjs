import { drizzle } from "drizzle-orm/mysql2";
import { eq } from "drizzle-orm";
import { localUsers } from "../drizzle/schema.js";
import bcrypt from "bcryptjs";

async function main() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error("DATABASE_URL não encontrada!");
    process.exit(1);
  }

  const db = drizzle(databaseUrl);
  const username = "79998630914";
  const newPassword = "@ruanwq";

  console.log(`[Update] Iniciando atualização de senha para o usuário: ${username}`);

  try {
    // 1. Buscar o usuário
    const result = await db.select().from(localUsers).where(eq(localUsers.username, username)).limit(1);
    
    if (result.length === 0) {
      console.log(`[Update] Usuário ${username} não encontrado no banco de dados.`);
      process.exit(0);
    }

    const user = result[0];
    const passwordHash = await bcrypt.hash(newPassword, 12);

    // 2. Atualizar a senha
    await db.update(localUsers)
      .set({ 
        passwordHash: passwordHash
      })
      .where(eq(localUsers.id, user.id));

    console.log(`[Update] SUCESSO: A senha do usuário ${username} foi atualizada para ${newPassword}.`);
    
  } catch (error) {
    console.error("[Update] Erro ao executar atualização:", error);
    process.exit(1);
  }
}

main();
