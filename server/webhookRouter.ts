import { z } from "zod";
import { publicProcedure, router } from "./_core/trpc";
import { updateProxyStatus, getDb } from "./db";
import { proxyStatus } from "../drizzle/schema";
import { eq } from "drizzle-orm";

export const webhookRouter = router({
  // Endpoint para receber atualizações de status do proxy via webhook
  proxyStatusUpdate: publicProcedure
    .input(z.object({
      name: z.string(),
      status: z.enum(["online", "offline"]),
      secret: z.string()
    }))
    .mutation(async ({ input }) => {
      // Verificação simples de segredo para evitar chamadas maliciosas
      // Em um cenário real, isso viria de uma variável de ambiente
      const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || "RUAN_WEBHOOK_SECRET_2024";
      
      if (input.secret !== WEBHOOK_SECRET) {
        throw new Error("Unauthorized webhook call");
      }

      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Verifica se o proxy existe
      const existing = await db.select().from(proxyStatus).where(eq(proxyStatus.name, input.name)).limit(1);
      
      if (existing.length > 0) {
        await updateProxyStatus(existing[0].id, input.status);
      } else {
        // Se não existir, cria um novo registro
        await db.insert(proxyStatus).values({
          name: input.name,
          status: input.status
        });
      }

      return { success: true };
    }),
});
