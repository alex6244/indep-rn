import { envInt } from "../lib/env.js";

export type DeepSeekMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

function getApiKey(): string | null {
  const key = process.env.DEEPSEEK_API_KEY?.trim();
  return key && key.length > 0 ? key : null;
}

export function isDeepSeekEnabled(): boolean {
  return getApiKey() !== null;
}

export async function completeDeepSeekChat(
  messages: DeepSeekMessage[],
  options?: { signal?: AbortSignal },
): Promise<string> {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error("DEEPSEEK_API_KEY is not configured");
  }

  const baseUrl = (
    process.env.DEEPSEEK_API_BASE_URL ?? "https://api.deepseek.com"
  ).replace(/\/$/, "");
  const model = process.env.DEEPSEEK_MODEL ?? "deepseek-chat";
  const timeoutMs = envInt("DEEPSEEK_TIMEOUT_MS", 12_000);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages,
        stream: false,
        temperature: 0.6,
        max_tokens: envInt("DEEPSEEK_MAX_TOKENS", 400),
      }),
      signal: options?.signal ?? controller.signal,
    });

    let payload: unknown = null;
    try {
      payload = await res.json();
    } catch {
      payload = null;
    }

    if (!res.ok) {
      const detail =
        payload &&
        typeof payload === "object" &&
        "error" in payload &&
        typeof (payload as { error: unknown }).error === "object" &&
        (payload as { error: { message?: string } }).error?.message
          ? (payload as { error: { message: string } }).error.message
          : `HTTP ${res.status}`;
      throw new Error(`DeepSeek API error: ${detail}`);
    }

    const content = (
      payload as {
        choices?: { message?: { content?: string } }[];
      }
    ).choices?.[0]?.message?.content?.trim();

    if (!content) {
      throw new Error("DeepSeek API returned empty content");
    }

    return content;
  } finally {
    clearTimeout(timeout);
  }
}

/** @internal */
export function resetDeepSeekEnvForTests(): void {
  delete process.env.DEEPSEEK_API_KEY;
  delete process.env.DEEPSEEK_API_BASE_URL;
  delete process.env.DEEPSEEK_MODEL;
}
