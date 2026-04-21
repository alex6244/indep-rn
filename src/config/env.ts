export type EnvKey =
  | "EXPO_PUBLIC_API_URL"
  | "EXPO_PUBLIC_ALLOW_HTTP_DEV"
  | "EXPO_PUBLIC_API_TIMEOUT_MS"
  | "EXPO_PUBLIC_ALLOW_INSECURE_TOKEN_STORAGE"
  | "EXPO_PUBLIC_MOCK_TOKEN_TTL_MS"
  | "EXPO_PUBLIC_REQUIRE_REFRESH_ROTATION"
  | "EXPO_PUBLIC_AUTH_SOURCE"
  | "EXPO_PUBLIC_CATALOG_SOURCE"
  | "EXPO_PUBLIC_REPORTS_SOURCE"
  | "EXPO_PUBLIC_SENTRY_DSN"
  | "EXPO_PUBLIC_SENTRY_ENVIRONMENT";

function readEnvRaw(key: EnvKey): string | undefined {
  // Avoid dynamic process.env access to satisfy expo/no-dynamic-env-var.
  switch (key) {
    case "EXPO_PUBLIC_API_URL":
      return process.env.EXPO_PUBLIC_API_URL;
    case "EXPO_PUBLIC_ALLOW_HTTP_DEV":
      return process.env.EXPO_PUBLIC_ALLOW_HTTP_DEV;
    case "EXPO_PUBLIC_API_TIMEOUT_MS":
      return process.env.EXPO_PUBLIC_API_TIMEOUT_MS;
    case "EXPO_PUBLIC_ALLOW_INSECURE_TOKEN_STORAGE":
      return process.env.EXPO_PUBLIC_ALLOW_INSECURE_TOKEN_STORAGE;
    case "EXPO_PUBLIC_MOCK_TOKEN_TTL_MS":
      return process.env.EXPO_PUBLIC_MOCK_TOKEN_TTL_MS;
    case "EXPO_PUBLIC_REQUIRE_REFRESH_ROTATION":
      return process.env.EXPO_PUBLIC_REQUIRE_REFRESH_ROTATION;
    case "EXPO_PUBLIC_AUTH_SOURCE":
      return process.env.EXPO_PUBLIC_AUTH_SOURCE;
    case "EXPO_PUBLIC_CATALOG_SOURCE":
      return process.env.EXPO_PUBLIC_CATALOG_SOURCE;
    case "EXPO_PUBLIC_REPORTS_SOURCE":
      return process.env.EXPO_PUBLIC_REPORTS_SOURCE;
    case "EXPO_PUBLIC_SENTRY_DSN":
      return process.env.EXPO_PUBLIC_SENTRY_DSN;
    case "EXPO_PUBLIC_SENTRY_ENVIRONMENT":
      return process.env.EXPO_PUBLIC_SENTRY_ENVIRONMENT;
  }
}

export function envString(key: EnvKey): string | null {
  const raw = readEnvRaw(key);
  if (typeof raw !== "string") return null;
  const trimmed = raw.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export function envLowerString(key: EnvKey): string | null {
  const v = envString(key);
  return v ? v.toLowerCase() : null;
}

export function envBool(key: EnvKey): boolean {
  return readEnvRaw(key) === "true";
}

export function envNumber(key: EnvKey, fallback: number): number {
  const raw = envString(key);
  if (!raw) return fallback;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : fallback;
}
