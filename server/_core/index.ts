import "dotenv/config";
import crypto from "node:crypto";
if (!globalThis.crypto) {
  // @ts-ignore
  globalThis.crypto = crypto;
}
import express from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { registerStorageProxy } from "./storageProxy";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";
import { getDb } from "../db";
import { localUsers } from "../../drizzle/schema";
import { sql, eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  // Forçar atualização da senha do administrador mestre na inicialização
  try {
    const db = await getDb();
    if (db) {
      const passwordHash = await bcrypt.hash("@ruanwq", 12);
      console.log("[Auth] Garantindo credenciais do administrador mestre...");
      await db.update(localUsers)
        .set({ passwordHash })
        .where(eq(localUsers.username, "ADMIN"));
    }
  } catch (error) {
    console.error("[Auth] Erro ao atualizar senha do admin:", error);
  }

  // Configurar tarefa de renovação de créditos a cada 7 dias
  setInterval(async () => {
    try {
      const db = await getDb();
      if (db) {
        console.log("[Cron] Renovando créditos dos usuários (7 dias)...");
        // Adiciona 1000 créditos para todos os revendedores
        await db.update(localUsers)
          .set({ credits: sql`${localUsers.credits} + 1000` })
          .where(sql`${localUsers.role} = 'reseller'`);
        console.log("[Cron] Créditos renovados com sucesso!");
      }
    } catch (error) {
      console.error("[Cron] Erro ao renovar créditos:", error);
    }
  }, 7 * 24 * 60 * 60 * 1000); // 7 dias em milissegundos

  const app = express();
  const server = createServer(app);
  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  registerStorageProxy(app);
  registerOAuthRoutes(app);
  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
