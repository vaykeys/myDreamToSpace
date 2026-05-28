import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import chatHandler from "./api/chat";
import healthHandler from "./api/health";

async function startServer() {
  const app = express();
  app.use(express.json());

  // Mount clean Vercel/Express compatible endpoints
  app.get("/api/health", healthHandler);
  app.post("/api/chat", chatHandler);

  // Serve static assets
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  const PORT = 3000;
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
