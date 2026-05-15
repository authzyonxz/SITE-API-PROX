import { drizzle } from "drizzle-orm/mysql2";
import { eq } from "drizzle-orm";
import { localUsers } from "../drizzle/schema.js";
import crypto from "node:crypto";

async function main() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error("DATABASE_URL não encontrada!");
    process.exit(1);
  }

  const db = drizzle(databaseUrl);
  const username = "79998630914";

  console.log(`[Reset] Iniciando reset para o usuário: ${username}`);

  try {
    // 1. Buscar o usuário
    const result = await db.select().from(localUsers).where(eq(localUsers.username, username)).limit(1);
    
    if (result.length === 0) {
      console.log(`[Reset] Usuário ${username} não encontrado no banco de dados.`);
      process.exit(0);
    }

    const user = result[0];
    const newSecret = crypto.randomUUID();

    // 2. Resetar deviceId e sessionSecret
    // Isso força o logout de todos os dispositivos e limpa o vínculo de HWID
    await db.update(localUsers)
      .set({ 
        deviceId: null, 
        sessionSecret: newSecret 
      })
      .where(eq(localUsers.id, user.id));

    console.log(`[Reset] SUCESSO: Dispositivos e sessões do usuário ${username} foram resetados.`);
    console.log(`[Reset] Agora o usuário precisará fazer login novamente e vincular seu dispositivo atual.`);
    
  } catch (error) {
    console.error("[Reset] Erro ao executar reset:", error);
    process.exit(1);
  }
}

main();
