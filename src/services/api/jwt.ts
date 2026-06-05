function decodeBase64Url(input: string): string | null {
  const normalized = input.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), "=");
  try {
    if (typeof globalThis.atob === "function") {
      return globalThis.atob(padded);
    }
    const maybeBuffer = (
      globalThis as {
        Buffer?: { from: (v: string, enc: string) => { toString: (enc: string) => string } };
      }
    ).Buffer;
    if (maybeBuffer) {
      return maybeBuffer.from(padded, "base64").toString("utf8");
    }
    return null;
  } catch {
    return null;
  }
}

export function decodeJwtPayload(token: string): Record<string, unknown> | null {
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const payloadRaw = decodeBase64Url(parts[1]);
  if (!payloadRaw) return null;
  try {
    const parsed: unknown = JSON.parse(payloadRaw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return null;
    return parsed as Record<string, unknown>;
  } catch {
    return null;
  }
}

export function getTokenExp(token: string): number | null {
  const payload = decodeJwtPayload(token);
  if (!payload) return null;
  const exp = payload.exp;
  if (typeof exp === "number" && Number.isFinite(exp)) return exp;
  if (typeof exp === "string") {
    const numeric = Number(exp);
    if (Number.isFinite(numeric)) return numeric;
  }
  return null;
}

function isJwtShapedToken(token: string): boolean {
  return token.split(".").length === 3;
}

export function isTokenExpired(token: string, leewaySec = 30): boolean {
  // Opaque tokens (e.g. Laravel Sanctum `api_token`) — no client-side expiry; server returns 401 when invalid.
  if (!isJwtShapedToken(token)) return false;
  const exp = getTokenExp(token);
  // JWT-shaped but missing/invalid `exp` — do not send as a long-lived credential.
  if (exp == null) return true;
  const nowSec = Math.floor(Date.now() / 1000);
  return exp <= nowSec + Math.max(0, leewaySec);
}
