import { reportTelemetry } from "../shared/monitoring/errorReporting";
import { envLowerString, type EnvKey } from "./env";

type InvalidSourceTelemetry = {
  source: string;
  key: string;
  value: string;
  fallback: string;
};

function warnInvalidEnv(prefix: string, key: string, raw: string, fallback: string): void {
  reportTelemetry("invalid_env_source", { source: prefix, key, value: raw, fallback } satisfies InvalidSourceTelemetry);
  if (__DEV__) {
    console.warn(`[${prefix}] Invalid ${key}="${raw}". Falling back to "${fallback}".`);
  }
}

export function readSourceEnv<T extends string>(opts: {
  source: string;
  key: EnvKey;
  allowed: readonly T[];
  fallback: T;
}): T {
  const raw = envLowerString(opts.key);
  if (!raw) return opts.fallback;
  const allowedSet = new Set<string>(opts.allowed as readonly string[]);
  if (allowedSet.has(raw)) return raw as T;
  warnInvalidEnv(opts.source, opts.key, raw, opts.fallback);
  return opts.fallback;
}
