import crypto from "node:crypto";
if (!globalThis.crypto) {
  // @ts-ignore
  globalThis.crypto = crypto;
}
import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import { runMigrations } from "./migrate-and-seed.mjs";
import { createExpressMiddleware } from "@trpc/server/adapters/express";

// Importar routers e contexto
// Tenta usar arquivos compilados primeiro, depois TypeScript
let appRouter, createContext;
try {
  const routers = await import("./dist/server/routers.js");
  const context = await import("./dist/server/_core/context.js");
  appRouter = routers.appRouter;
  createContext = context.createContext;
  console.log("✅ Usando routers compilados");
} catch (e) {
  console.log("⚠️  Routers compilados não encontrados, usando TypeScript...");
  const routers = await import("./server/routers.ts");
  const context = await import("./server/_core/context.ts");
  appRouter = routers.appRouter;
  createContext = context.createContext;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Rodar migrações antes de iniciar o servidor
console.log("🔄 Iniciando migrações...");
await runMigrations();
console.log("✅ Migrações concluídas!");

const app = express();
const server = createServer(app);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// tRPC API routes
console.log("📡 Configurando rotas tRPC...");
app.use(
  "/api/trpc",
  createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

// Serve static files from dist/public
const distPath = path.join(__dirname, "dist", "public");
console.log(`📁 Servindo arquivos estáticos de: ${distPath}`);

if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
} else {
  console.warn(`⚠️  Aviso: dist/public não encontrado em ${distPath}`);
}

// Fallback to index.html for SPA
app.get("*", (req, res) => {
  const indexPath = path.join(distPath, "index.html");
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send("Not found");
  }
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${port}/`);
  console.log(`📡 API tRPC disponível em http://localhost:${port}/api/trpc`);
});
