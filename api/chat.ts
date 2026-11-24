import type { IncomingMessage as HttpIncomingMessage, ServerResponse } from "node:http";
import {
  type ChatRequestBody,
  generateSejongJsonReply,
  getAiClient,
  streamSejongReply,
} from "../lib/sejongChat.ts";

interface VercelRequest extends HttpIncomingMessage {
  body?: unknown;
  query?: Record<string, string | string[] | undefined>;
}

function sendJson(res: ServerResponse, status: number, payload: unknown): void {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(payload));
}

async function readJsonBody(req: VercelRequest): Promise<ChatRequestBody> {
  if (req.body && typeof req.body === "object") {
    return req.body as ChatRequestBody;
  }
  if (typeof req.body === "string") {
    try {
      return JSON.parse(req.body) as ChatRequestBody;
    } catch {
      return {};
    }
  }

  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }
  const raw = Buffer.concat(chunks).toString("utf-8").trim();
  if (!raw) return {};
  try {
    return JSON.parse(raw) as ChatRequestBody;
  } catch {
    return {};
  }
}

export default async function handler(
  req: VercelRequest,
  res: ServerResponse
): Promise<void> {
  if (req.method !== "POST") {
    sendJson(res, 405, { error: "Method Not Allowed" });
    return;
  }

  const body = await readJsonBody(req);
  const studentName =
    typeof body.studentName === "string" ? body.studentName : "어린 벗";
  const message = typeof body.message === "string" ? body.message.trim() : "";
  const history = Array.isArray(body.history) ? body.history : [];

  const parsedUrl = new URL(req.url ?? "/api/chat", "http://localhost");
  const modeParam =
    req.query?.mode ?? parsedUrl.searchParams.get("mode") ?? undefined;
  const useJsonMode =
    modeParam === "json" || req.headers["x-response-mode"] === "json";

  if (!message) {
    sendJson(res, 400, { error: "질문 내용을 입력해 주세요." });
    return;
  }

  const ai = getAiClient();
  if (!ai) {
    sendJson(res, 500, {
      error:
        "GEMINI_API_KEY가 설정되어 있지 않습니다. Vercel 환경 변수 설정에서 GEMINI_API_KEY를 추가해 주세요.",
    });
    return;
  }

  if (useJsonMode) {
    try {
      const text = await generateSejongJsonReply(ai, studentName, history, message);
      sendJson(res, 200, { text });
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "세종대왕님과 연결하는 중 일시적인 문제가 생겼습니다.";
      sendJson(res, 502, { error: errorMessage });
    }
    return;
  }

  res.statusCode = 200;
  res.setHeader("Content-Type", "text/event-stream; charset=utf-8");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no");

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
}
