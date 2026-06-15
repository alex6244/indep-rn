import type { Context, Next } from "hono";
import { apiError } from "../lib/apiError.js";
import { envBool, isProduction } from "../lib/env.js";

const DEFAULT_ME_TIMEOUT_MS = 5_000;

export function isAuthRequired(): boolean {
  return envBool("AI_API_AUTH_REQUIRED", isProduction());
}

export function getAuthMeUrl(): string | null {
  const direct = process.env.AI_API_AUTH_ME_URL?.trim();
  if (direct) return direct;

  const base = process.env.AI_API_AUTH_API_BASE?.trim().replace(/\/$/, "");
  if (base) return `${base}/me`;

  return null;
}

export function extractBearerToken(header: string | undefined): string | null {
  if (!header) return null;
  const match = header.match(/^Bearer\s+(.+)$/i);
  const token = match?.[1]?.trim();
  return token && token.length > 0 ? token : null;
}

/** Токен из EXPO_PUBLIC_AUTH_SOURCE=mock (`mock_<userId>_<ts>`, userId может содержать `_`). */
export function isMockDevToken(token: string): boolean {
  return /^mock_.+_\d+$/.test(token);
}

export function isMockAuthAllowed(): boolean {
  return envBool("AI_API_ALLOW_MOCK_AUTH", false);
}

export async function validateTokenWithMe(
  meUrl: string,
  token: string,
  fetchImpl: typeof fetch = fetch,
): Promise<boolean> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), DEFAULT_ME_TIMEOUT_MS);

  try {
    const res = await fetchImpl(meUrl, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      signal: controller.signal,
    });
    return res.ok;
  } catch {
    return false;
  } finally {
    clearTimeout(timeout);
  }
}

export function requireUserAuth() {
  return async (c: Context, next: Next) => {
    if (!isAuthRequired()) {
      await next();
      return;
    }

    const token = extractBearerToken(c.req.header("Authorization"));
    if (!token) {
      return c.json(apiError("unauthorized", "Требуется авторизация"), 401);
    }

    if (isMockAuthAllowed() && isMockDevToken(token)) {
      await next();
      return;
    }

    const meUrl = getAuthMeUrl();
    if (!meUrl) {
      console.error(
        "[ai-api] AI_API_AUTH_REQUIRED is enabled but AI_API_AUTH_ME_URL is not set",
      );
      return c.json(apiError("unauthorized", "Требуется авторизация"), 401);
    }

    const valid = await validateTokenWithMe(meUrl, token);
    if (!valid) {
      return c.json(apiError("unauthorized", "Требуется авторизация"), 401);
    }

    await next();
  };
}
