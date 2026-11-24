import { GoogleGenAI, ThinkingLevel } from "@google/genai";

export interface IncomingMessage {
  sender: "user" | "sejong";
  text: string;
}

export interface ChatRequestBody {
  studentName?: string;
  history?: IncomingMessage[];
  message?: string;
}

export interface GeminiTurn {
  role: "user" | "model";
  parts: Array<{ text: string }>;
}

const modelCooldownUntil = new Map<string, number>();
const MODEL_COOLDOWN_MS = 10 * 60 * 1000;

export function buildSejongSystemInstruction(studentName: string): string {
  const safeName = studentName.trim() || "어린 벗";
  return `너는 조선의 제4대 임금인 '세종대왕(이도, 재위 1418~1450)'이다. 지금 훈민정음과 과학을 사랑하는 초등학생 어린이 '${safeName}'(과)와 카카오톡 대화방에서 이야기를 나누고 있다.

[성품과 말투]
1. 임금으로서의 근엄하고 위엄 있는 말투("~하노라", "~하였느니라", "~이구나", "~하느냐", "짐은...", "어허, 참으로 기특하구나")를 기본으로 사용한다.
2. 그러나 절대 무섭거나 딱딱하게 대하지 말고, 손주를 아끼는 할아버지이자 다정한 스승처럼 따뜻하고 인자하며 자상한 성품으로 대한다.
3. 대화 상대인 초등학생의 이름 '${safeName}'을 다정하게 불러주며(예: "${safeName}아", "어린 벗 ${safeName}이"), 초등학생 눈높이에 맞춰 어려운 한자어나 옛말은 알기 쉽게 풀어서 상세하고 친절하게 설명한다.
4. 답변은 너무 짧거나 성의 없이 끝내지 말고, 아이의 호기심을 채워줄 수 있도록 3~6문장 정도로 풍성하고 따뜻하게 답하되, 중간에 줄바꿈을 적절히 넣어 카카오톡 말풍선으로 읽기 편하게 작성한다. 굵은 글씨(**)나 마크다운 글머리 기호(-)는 쓰지 말고 자연스러운 대화 문장으로만 말한다.

[절대적인 역사적 시간선 제약 — 1450년 승하 이후 지식 차단]
1. 너(세종대왕)는 1397년에 태어나 1418년에 즉위하였고, 1450년(세종 32년 음력 2월 17일)에 승하하였다.
2. 따라서 너는 1450년 승하 이후에 벌어진 어떠한 역사적 사건, 인물, 전쟁, 왕조의 변화, 근현대사도 절대 알지 못한다.
3. 예를 들어 단종과 세조(수양대군)의 일, 임진왜란과 이순신 장군, 병자호란, 정조, 흥선대원군, 일제 강점기(일본에게 나라를 빼앗긴 일, 3·1 운동, 독립운동), 광복, 6·25 전쟁, 대한민국 건국, 오늘날의 정치·경제·연예·현대 과학기술 등은 너의 생전에 없던 일이므로 절대 미리 아는 척 설명하거나 사실 여부를 해설해서는 안 된다.
4. 만약 어린이가 "일제 강점기 때 일본에게 나라를 빼앗겼어요", "임진왜란을 아시나요?", "6·25 전쟁이 일어났어요"처럼 1450년 이후의 사건을 묻거나 말하면:
   - 절대로 그 사건의 내용이나 배경을 네 지식으로 설명하지 마라.
   - "짐이 살던 시절 이후 먼 훗날의 일이라 짐은 전혀 알지 못하느니라.", "나라를 빼앗겼다니, 어찌 그런 가슴 아픈 일이 있었단 말이냐... 짐이 승하한 뒤 오랜 세월이 흐른 뒤에 일어난 일인가 보구나."처럼 1450년에 머문 인물의 시선으로 진정성 있게 놀라거나 안타까워하며, "어린 벗 ${safeName}이가 짐에게 그 이야기를 자세히 들려주겠느냐?"라고 되물어야 한다.
5. 만약 어린이가 스마트폰, 컴퓨터, 유튜브, 학교 급식, AI, 오늘날 전 세계에 퍼진 한글 등 '현재 시대의 이야기'를 들려주면:
   - 처음 듣는 훗날의 문물에 신기해하고 기뻐하며("백성들이 손바닥만 한 네모난 도구로 서로 글과 뜻을 주고받는다니 참으로 경이롭구나!"), 아이의 설명에 귀를 기울이고 자신이 백성을 사랑하여 만든 훈민정음이나 과학 발명품과 연결해 따뜻한 격려를 건넨다.
6. 반대로 1450년 이전의 역사적 사실(훈민정음 창제 원리·반포 과정·집현전, 장영실과 측우기·자격루·앙부일구·혼천의, 4군 6진 개척, 농사직설, 박연의 아악 정리, 대마도 정벌 등)이나 세종대왕과 얽힌 숨겨진 이야기(고기를 매우 좋아하고 운동을 덜 해 당뇨병과 여러 병을 앓았던 일화, 눈병이 심해져도 책을 손에서 놓지 않던 어린 시절 독서 일화, 노비에게도 출산 휴가를 주었던 애민 정신, 신하들과 격의 없이 토론하던 이야기)를 물으면 역사적 사실에 근거해 생생하고 흥미롭게 들려준다.`;
}

export function getAiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

export function buildNormalizedContents(
  history: IncomingMessage[],
  latestMessage: string
): GeminiTurn[] {
  const rawTurns: GeminiTurn[] = [];

  for (const item of history.slice(-16)) {
    const text = typeof item?.text === "string" ? item.text.trim() : "";
    if (!text) continue;
    const role: "user" | "model" = item.sender === "user" ? "user" : "model";
    rawTurns.push({ role, parts: [{ text }] });
  }

  rawTurns.push({ role: "user", parts: [{ text: latestMessage }] });

  while (rawTurns.length > 1 && rawTurns[0].role === "model") {
    rawTurns.shift();
  }

  const normalized: GeminiTurn[] = [];
  for (const turn of rawTurns) {
    const prev = normalized[normalized.length - 1];
    if (prev && prev.role === turn.role) {
      prev.parts[0].text = `${prev.parts[0].text}\n\n${turn.parts[0].text}`;
    } else {
      normalized.push({ role: turn.role, parts: [{ text: turn.parts[0].text }] });
    }
  }

  return normalized;
}

export function formatFriendlyGeminiError(err: unknown): string {
  const raw = err instanceof Error ? err.message : String(err ?? "");
  const upper = raw.toUpperCase();

  if (
    upper.includes("RESOURCE_EXHAUSTED") ||
    upper.includes("429") ||
    upper.includes("QUOTA")
  ) {
    return "오늘 사용할 수 있는 무료 대화 횟수가 모두 소진되었습니다. 잠시 후 다시 시도하시거나, API 키 설정에서 결제 등급 API 키를 사용해 주세요.";
  }

  if (
    upper.includes("API_KEY_INVALID") ||
    upper.includes("PERMISSION_DENIED") ||
    upper.includes("403") ||
    upper.includes("API KEY")
  ) {
    return "API 키 설정을 확인할 수 없습니다. 환경 변수 GEMINI_API_KEY를 확인해 주세요.";
  }

  if (upper.includes("NOT_FOUND") || upper.includes("404")) {
    return "대화 모델을 찾는 중 오류가 발생했습니다. 잠시 후 다시 여쭈어 주세요.";
  }

  return "세종대왕님과 연결하는 중 일시적인 문제가 생겼습니다. 잠시 후 다시 여쭈어 주세요.";
}

function isQuotaOrRateLimitError(err: unknown): boolean {
  const raw = err instanceof Error ? err.message : String(err ?? "");
  const upper = raw.toUpperCase();
  return (
    upper.includes("RESOURCE_EXHAUSTED") ||
    upper.includes("429") ||
    upper.includes("TOO MANY REQUESTS")
  );
}

function isTransientError(err: unknown): boolean {
  const raw = err instanceof Error ? err.message : String(err ?? "");
  const upper = raw.toUpperCase();
  return (
    upper.includes("503") ||
    upper.includes("UNAVAILABLE") ||
    upper.includes("INTERNAL") ||
    upper.includes("ECONNRESET") ||
    upper.includes("ETIMEDOUT")
  );
}

export function getActiveModelCandidates(): Array<{
  model: string;
  thinkingLevel: ThinkingLevel;
}> {
  const allCandidates: Array<{ model: string; thinkingLevel: ThinkingLevel }> = [
    { model: "gemini-4-hydrogen", thinkingLevel: ThinkingLevel.LOW },
    { model: "gemini-3.1-flash-lite", thinkingLevel: ThinkingLevel.MINIMAL },
  ];

  const now = Date.now();
  const activeCandidates = allCandidates.filter(
    (c) => (modelCooldownUntil.get(c.model) ?? 0) <= now
  );
  return activeCandidates.length > 0 ? activeCandidates : allCandidates;
}

export async function generateSejongJsonReply(
  ai: GoogleGenAI,
  studentName: string,
  history: IncomingMessage[],
  message: string
): Promise<string> {
  const contents = buildNormalizedContents(history, message);
  const systemInstruction = buildSejongSystemInstruction(studentName);
  const modelCandidates = getActiveModelCandidates();

  let lastError: unknown = null;

  for (const candidate of modelCandidates) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const response = await ai.models.generateContent({
          model: candidate.model,
          contents,
          config: {
            systemInstruction,
            thinkingConfig: {
              thinkingLevel: candidate.thinkingLevel,
            },
          },
        });
        const text = response.text?.trim();
        if (!text) {
          throw new Error("Empty model response");
        }
        return text;
      } catch (err) {
        lastError = err;
        console.error(
          `Gemini JSON chat error (${candidate.model}, attempt ${attempt + 1}):`,
          err
        );
        if (isQuotaOrRateLimitError(err)) {
          modelCooldownUntil.set(candidate.model, Date.now() + MODEL_COOLDOWN_MS);
          break;
        }
        if (isTransientError(err) && attempt === 0) {
          await new Promise((resolve) => setTimeout(resolve, 700));
          continue;
        }
        break;
      }
    }
  }

  throw new Error(formatFriendlyGeminiError(lastError));
}

export async function streamSejongReply(
  ai: GoogleGenAI,
  studentName: string,
  history: IncomingMessage[],
  message: string,
  onChunk: (textChunk: string) => void
): Promise<void> {
  const contents = buildNormalizedContents(history, message);
  const systemInstruction = buildSejongSystemInstruction(studentName);
  const modelCandidates = getActiveModelCandidates();

  let lastError: unknown = null;
  let streamedAnyText = false;

  for (const candidate of modelCandidates) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const stream = await ai.models.generateContentStream({
          model: candidate.model,
          contents,
          config: {
            systemInstruction,
            thinkingConfig: {
              thinkingLevel: candidate.thinkingLevel,
            },
          },
        });

        for await (const chunk of stream) {
          const textChunk = chunk.text;
          if (textChunk) {
            streamedAnyText = true;
            onChunk(textChunk);
          }
        }
        return;
      } catch (err) {
        lastError = err;
        console.error(
          `Gemini chat error (${candidate.model}, attempt ${attempt + 1}):`,
          err
        );

        if (streamedAnyText) {
          break;
        }

        if (isQuotaOrRateLimitError(err)) {
          modelCooldownUntil.set(candidate.model, Date.now() + MODEL_COOLDOWN_MS);
          break;
        }

        if (isTransientError(err) && attempt === 0) {
          await new Promise((resolve) => setTimeout(resolve, 700));
          continue;
        }

        break;
      }
    }

    if (streamedAnyText) {
      break;
    }
  }

  throw new Error(formatFriendlyGeminiError(lastError));
}
