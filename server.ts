import "dotenv/config";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import {
  type ChatRequestBody,
  generateSejongJsonReply,
  getAiClient,
  streamSejongReply,
} from "./lib/sejongChat.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;

async function startServer() {
  const app = express();
  app.use(express.json({ limit: "2mb" }));

  app.get("/api/health", (_req, res) => {
    res.json({ ok: true });
  });

  app.post("/api/chat", async (req, res) => {
    const body = (req.body ?? {}) as ChatRequestBody;
    const studentName =
      typeof body.studentName === "string" ? body.studentName : "어린 벗";
    const message = typeof body.message === "string" ? body.message.trim() : "";
    const history = Array.isArray(body.history) ? body.history : [];
    const useJsonMode =
      req.query.mode === "json" || req.headers["x-response-mode"] === "json";

    if (!message) {
      res.status(400).json({ error: "질문 내용을 입력해 주세요." });
      return;
    }

    const ai = getAiClient();
    if (!ai) {
      res.status(500).json({
        error:
          "GEMINI_API_KEY가 설정되어 있지 않습니다. Settings > Secrets 패널에서 API 키를 확인해 주세요.",
      });
      return;
    }

    if (useJsonMode) {
      try {
        const text = await generateSejongJsonReply(ai, studentName, history, message);
        res.json({ text });
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "세종대왕님과 연결하는 중 일시적인 문제가 생겼습니다.";
        res.status(502).json({ error: errorMessage });
      }
      return;
    }

    res.setHeader("Content-Type", "text/event-stream; charset=utf-8");
    res.setHeader("Cache-Control", "no-cache, no-transform");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Accel-Buffering", "no");
    res.flushHeaders?.();

    try {
      await streamSejongReply(ai, studentName, history, message, (textChunk) => {
        res.write(`data: ${JSON.stringify({ text: textChunk })}\n\n`);
      });
      res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
      res.end();
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "세종대왕님과 연결하는 중 일시적인 문제가 생겼습니다.";
      res.write(`data: ${JSON.stringify({ error: errorMessage })}\n\n`);
      res.end();
    }
  });

  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.join(__dirname, "dist");
    app.use(express.static(distDir));
    app.get("/{*splat}", (_req, res) => {
      res.sendFile(path.join(distDir, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
