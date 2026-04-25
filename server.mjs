import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = createServer(app);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Serve static files from dist/public
const distPath = path.join(__dirname, "dist", "public");
console.log(`Serving static files from: ${distPath}`);

if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
} else {
  console.warn(`Warning: dist/public not found at ${distPath}`);
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
  console.log(`Server running on http://localhost:${port}/`);
});
