import type { Context, Next } from "hono";
import { apiError, RATE_LIMITED_MESSAGE } from "../lib/apiError.js";
import { envBool, envInt } from "../lib/env.js";

export type RateLimitBucket = "chat" | "leads" | "meta";

const WINDOW_MS = 60_000;

type WindowEntry = {
  count: number;
  windowStart: number;
};

const buckets = new Map<string, WindowEntry>();

export function resetRateLimitStoreForTests(): void {
  buckets.clear();
}

export function getClientIp(headers: Headers): string {
  const xff = headers.get("x-forwarded-for");
  if (xff) {
    const first = xff.split(",")[0]?.trim();
    if (first) return first;
  }
  const realIp = headers.get("x-real-ip")?.trim();
  if (realIp) return realIp;
  return "unknown";
}

function limitForBucket(bucket: RateLimitBucket): number {
  switch (bucket) {
    case "chat":
      return envInt("AI_API_RATE_CHAT_PER_MIN", 30);
    case "leads":
      return envInt("AI_API_RATE_LEADS_PER_MIN", 10);
    case "meta":
      return envInt("AI_API_RATE_META_PER_MIN", 60);
  }
}

export function isRateLimitEnabled(): boolean {
  return envBool("AI_API_RATE_LIMIT_ENABLED", true);
}

export function checkRateLimit(
  bucket: RateLimitBucket,
  clientKey: string,
  now = Date.now(),
): { allowed: true } | { allowed: false; retryAfterSec: number } {
  const limit = limitForBucket(bucket);
  const storeKey = `${bucket}:${clientKey}`;
  const entry = buckets.get(storeKey);

  if (!entry || now - entry.windowStart >= WINDOW_MS) {
    buckets.set(storeKey, { count: 1, windowStart: now });
    return { allowed: true };
  }

  if (entry.count < limit) {
    entry.count += 1;
    return { allowed: true };
  }

  const retryAfterSec = Math.max(
    1,
    Math.ceil((entry.windowStart + WINDOW_MS - now) / 1000),
  );
  return { allowed: false, retryAfterSec };
}

export function rateLimitMiddleware(bucket: RateLimitBucket) {
  return async (c: Context, next: Next): Promise<Response | void> => {
    if (!isRateLimitEnabled()) {
      await next();
      return;
    }

    const ip = getClientIp(c.req.raw.headers);
    const result = checkRateLimit(bucket, ip);

    if (!result.allowed) {
      return c.json(apiError("rate_limited", RATE_LIMITED_MESSAGE), 429, {
        "Retry-After": String(result.retryAfterSec),
      });
    }

    await next();
  };
}
