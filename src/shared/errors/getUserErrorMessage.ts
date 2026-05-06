import { getDefaultAuthErrorMessage, type AuthErrorCode } from "../../services/authTypes";

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isSafeBackendMessage(message: string): boolean {
  // Keep UX-facing message constraints conservative for backend-provided text.
  return message.length <= 220 && !/[<>]/.test(message);
}

function readAuthCode(error: unknown): AuthErrorCode | null {
  if (!error || typeof error !== "object") return null;
  const code = (error as { code?: unknown }).code;
  if (!isNonEmptyString(code)) return null;
  const normalized = code.trim() as AuthErrorCode;
  const knownCodes: AuthErrorCode[] = [
    "invalid_credentials",
    "validation_error",
    "user_exists",
    "rate_limited",
    "server_error",
    "network_error",
    "unknown",
  ];
  return knownCodes.includes(normalized) ? normalized : null;
}

function readAuthMessage(error: unknown): string | null {
  if (!error || typeof error !== "object") return null;
  const message = (error as { message?: unknown }).message;
  if (!isNonEmptyString(message)) return null;
  const trimmed = message.trim();
  return isSafeBackendMessage(trimmed) ? trimmed : null;
}

export function getAuthErrorMessage(code: AuthErrorCode, fallback?: string): string {
  if (isNonEmptyString(fallback)) return fallback;
  return getDefaultAuthErrorMessage(code);
}

export function getUserErrorMessage(error: unknown, fallback?: string): string {
  const safeBackendMessage = readAuthMessage(error);
  if (safeBackendMessage) return safeBackendMessage;

  const code = readAuthCode(error);
  if (code) return getDefaultAuthErrorMessage(code);

  if (isNonEmptyString(fallback)) return fallback;
  return getDefaultAuthErrorMessage("unknown");
}
