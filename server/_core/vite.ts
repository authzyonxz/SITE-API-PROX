import express, { type Express } from "express";
import fs from "fs";
import { type Server } from "http";
import { nanoid } from "nanoid";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import viteConfig from "../../vite.config";

// Get __dirname in ESM
let __dirname: string;
try {
  const __filename = fileURLToPath(import.meta.url);
  __dirname = path.dirname(__filename);
} catch (e) {
  // Fallback for Railway/production environments
  __dirname = process.cwd();
}

export async function setupVite(app: Express, server: Server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true as const,
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    server: serverOptions,
    appType: "custom",
  });

  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      // Try multiple possible paths for index.html
      const possiblePaths = [
        path.join(__dirname, "../../client/index.html"),
        path.join(process.cwd(), "client/index.html"),
        path.join("/app", "client/index.html"),
      ];

      let clientTemplate = "";
      for (const filePath of possiblePaths) {
        try {
          if (fs.existsSync(filePath)) {
            clientTemplate = filePath;
            break;
          }
        } catch (e) {
          // Continue to next path
        }
      }

      if (!clientTemplate) {
        console.error("Could not find client template at any of:", possiblePaths);
        return res.status(500).send("Client template not found");
      }

      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      console.error("Error in setupVite:", e);
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

export function serveStatic(app: Express) {
  // Try multiple possible paths for dist
  const possibleDistPaths = [
    path.join(__dirname, "../../dist/public"),
    path.join(process.cwd(), "dist/public"),
    path.join("/app", "dist/public"),
  ];

  let distPath = "";
  for (const filePath of possibleDistPaths) {
    try {
      if (fs.existsSync(filePath)) {
        distPath = filePath;
        break;
      }
    } catch (e) {
      // Continue to next path
    }
  }

  if (!distPath) {
    console.error("Could not find dist directory at any of:", possibleDistPaths);
    distPath = possibleDistPaths[0]; // Use first as fallback
  }

  console.log(`Serving static files from: ${distPath}`);

  app.use(express.static(distPath));

  // fall through to index.html if the file doesn't exist
  app.use("*", (_req, res) => {
    const indexPath = path.resolve(distPath, "index.html");
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      res.status(404).send("index.html not found");
    }
  });
}
