import { envStringList, isProduction } from "../lib/env.js";

const DEFAULT_DEV_ORIGINS = [
  "http://localhost:8081",
  "http://localhost:19006",
  "http://localhost:8787",
  "http://127.0.0.1:8081",
  "http://127.0.0.1:19006",
  "http://127.0.0.1:8787",
];

export function getAllowedCorsOrigins(): string[] {
  const fromEnv = envStringList("AI_API_CORS_ORIGINS");
  if (fromEnv.length > 0) return fromEnv;
  if (isProduction()) return [];
  return DEFAULT_DEV_ORIGINS;
}

/** React Native fetch often has no Origin — allow those requests. */
export function isOriginAllowed(origin: string | undefined): boolean {
  if (!origin) return true;
  return getAllowedCorsOrigins().includes(origin);
}

/** Hono cors `origin` callback: return matched origin or deny. */
export function resolveCorsOrigin(origin: string | undefined): string | undefined {
  if (!origin) return "*";
  if (isOriginAllowed(origin)) return origin;
  return undefined;
}
