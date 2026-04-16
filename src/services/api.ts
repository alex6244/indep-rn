import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { reportTelemetry } from "../shared/monitoring/errorReporting";

let inMemoryToken: string | null = null;
const TOKEN_KEY = "@auth/token";
const DEFAULT_TIMEOUT_MS = 10000;
const RETRY_BACKOFF_MS = [300, 700] as const;

function resolveBaseUrl(): string {
  const envUrl = process.env.EXPO_PUBLIC_API_URL?.trim();
  const allowHttpDevFallback = process.env.EXPO_PUBLIC_ALLOW_HTTP_DEV === "true";

  if (!envUrl) {
    if (__DEV__ && allowHttpDevFallback) {
      return "http://localhost:3000/api";
    }
    throw new Error(
      "API base URL is not configured. Set EXPO_PUBLIC_API_URL. " +
        "For local HTTP in dev only, set EXPO_PUBLIC_ALLOW_HTTP_DEV=true.",
    );
  }

  let parsed: URL;
  try {
    parsed = new URL(envUrl);
  } catch {
    throw new Error("Invalid EXPO_PUBLIC_API_URL format.");
  }

  if (!__DEV__ && parsed.protocol !== "https:") {
    throw new Error("In non-dev mode EXPO_PUBLIC_API_URL must use HTTPS.");
  }

  return envUrl;
}

let cachedBaseUrl: string | null = null;

/**
 * Test helper for deterministic API base URL behavior between tests.
 * Intentionally a no-op outside test/dev environments.
 */
export function resetApiBaseUrlCacheForTests(): void {
  if (process.env.NODE_ENV !== "test" && !__DEV__) return;
  cachedBaseUrl = null;
}

function getBaseUrl(): string {
  if (!cachedBaseUrl) {
    cachedBaseUrl = resolveBaseUrl();
  }
  return cachedBaseUrl;
}

function getRequestTimeoutMs(): number {
  const raw = process.env.EXPO_PUBLIC_API_TIMEOUT_MS?.trim();
  if (!raw) return DEFAULT_TIMEOUT_MS;
  const parsed = Number(raw);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_TIMEOUT_MS;
}

// ─── Типы ────────────────────────────────────────────────────────────────────

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

type RetryConfig = {
  maxRetries?: number;
};

type RequestOptions = RequestInit & {
  retry?: RetryConfig;
  timeoutMs?: number;
  /** Prevents refresh-token retry to avoid infinite loops on /auth/refresh itself */
  _skipRefresh?: boolean;
};

type UnauthorizedHandler = () => Promise<void> | void;
type RefreshHandler = () => Promise<string | null>;

let unauthorizedHandler: UnauthorizedHandler | null = null;
let unauthorizedHandlerTask: Promise<void> | null = null;
let refreshHandler: RefreshHandler | null = null;
let refreshTask: Promise<string | null> | null = null;

type StorageTelemetryOperation = "get" | "set" | "clear";
type StorageTelemetryStorage = "secure_store" | "async_storage" | "fallback";

type StorageTelemetryEvent = {
  operation: StorageTelemetryOperation;
  storage: StorageTelemetryStorage;
  error: string;
  scope: "token_storage";
  timestamp: number;
};

function toErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message) return error.message;
  try {
    return String(error);
  } catch {
    return "unknown_error";
  }
}

// Non-blocking reporter: observability only, never control-flow.
function reportStorageTelemetry(event: StorageTelemetryEvent): void {
  try {
    reportTelemetry("token_storage_failure", event);
  } catch {
    // Never throw from telemetry path.
  }
}

function trackStorageFailure(
  operation: StorageTelemetryOperation,
  storage: StorageTelemetryStorage,
  error: unknown,
): void {
  reportStorageTelemetry({
    operation,
    storage,
    error: toErrorMessage(error),
    scope: "token_storage",
    timestamp: Date.now(),
  });
}

export function setUnauthorizedHandler(handler: UnauthorizedHandler | null) {
  unauthorizedHandler = handler;
}

export function setRefreshHandler(handler: RefreshHandler | null) {
  refreshHandler = handler;
}

// ─── Токены ──────────────────────────────────────────────────────────────────

const REFRESH_TOKEN_KEY = "@auth/refresh_token";
let inMemoryRefreshToken: string | null = null;

export const refreshTokenStorage = {
  get: async () => {
    if (inMemoryRefreshToken) return inMemoryRefreshToken;
    try {
      const secure = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
      if (secure) {
        inMemoryRefreshToken = secure;
        return secure;
      }
    } catch (error) {
      trackStorageFailure("get", "secure_store", error);
    }
    try {
      const fallback = await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
      if (fallback) {
        inMemoryRefreshToken = fallback;
        return fallback;
      }
    } catch (error) {
      trackStorageFailure("get", "async_storage", error);
    }
    return null;
  },
  set: async (token: string) => {
    inMemoryRefreshToken = token;
    try {
      await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, token);
      return;
    } catch (error) {
      trackStorageFailure("set", "secure_store", error);
    }
    try {
      await AsyncStorage.setItem(REFRESH_TOKEN_KEY, token);
    } catch (error) {
      trackStorageFailure("set", "async_storage", error);
    }
  },
  clear: async () => {
    inMemoryRefreshToken = null;
    try {
      await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
    } catch (error) {
      trackStorageFailure("clear", "secure_store", error);
    }
    try {
      await AsyncStorage.removeItem(REFRESH_TOKEN_KEY);
    } catch (error) {
      trackStorageFailure("clear", "async_storage", error);
    }
  },
};

export const tokenStorage = {
  get: async () => {
    if (inMemoryToken) return inMemoryToken;

    try {
      const secure = await SecureStore.getItemAsync(TOKEN_KEY);
      if (secure) {
        inMemoryToken = secure;
        return secure;
      }
    } catch (error) {
      trackStorageFailure("get", "secure_store", error);
    }

    try {
      const fallback = await AsyncStorage.getItem(TOKEN_KEY);
      if (fallback) {
        inMemoryToken = fallback;
        return fallback;
      }
    } catch (error) {
      trackStorageFailure("get", "async_storage", error);
    }

    return null;
  },
  set: async (token: string) => {
    inMemoryToken = token;
    try {
      await SecureStore.setItemAsync(TOKEN_KEY, token);
      return;
    } catch (error) {
      trackStorageFailure("set", "secure_store", error);
    }
    try {
      await AsyncStorage.setItem(TOKEN_KEY, token);
    } catch (error) {
      trackStorageFailure("set", "async_storage", error);
      trackStorageFailure("set", "fallback", error);
    }
  },
  clear: async () => {
    inMemoryToken = null;
    try {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
    } catch (error) {
      trackStorageFailure("clear", "secure_store", error);
    }
    try {
      await AsyncStorage.removeItem(TOKEN_KEY);
    } catch (error) {
      trackStorageFailure("clear", "async_storage", error);
      trackStorageFailure("clear", "fallback", error);
    }
  },
};

// ─── Базовый клиент ──────────────────────────────────────────────────────────

function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function decodeBase64Url(input: string): string | null {
  const normalized = input.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), "=");
  try {
    if (typeof globalThis.atob === "function") {
      return globalThis.atob(padded);
    }
    const maybeBuffer = (globalThis as { Buffer?: { from: (v: string, enc: string) => { toString: (enc: string) => string } } }).Buffer;
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

export function isTokenExpired(token: string, leewaySec = 30): boolean {
  const exp = getTokenExp(token);
  // Conservative default: malformed/missing exp should not be treated as a valid long-lived token.
  if (exp == null) return true;
  const nowSec = Math.floor(Date.now() / 1000);
  return exp <= nowSec + Math.max(0, leewaySec);
}

function isAbortError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "name" in error &&
    (error as { name?: string }).name === "AbortError"
  );
}

function isRetryableMethod(method?: string): boolean {
  const m = (method ?? "GET").toUpperCase();
  return m === "GET" || m === "HEAD";
}

function shouldRetry(error: unknown, method: string, attempt: number, maxRetries: number): boolean {
  if (!isRetryableMethod(method) || attempt >= maxRetries) return false;
  if (error instanceof ApiError) {
    if (error.status === 502 || error.status === 503 || error.status === 504) return true;
    if (error.status !== 0) return false;
    return error.message === "Request timeout" || error.message === "Network request failed";
  }
  return false;
}

async function parseErrorMessage(response: Response): Promise<string> {
  const fallback = `HTTP ${response.status}`;
  try {
    const body = await response.json();
    if (body && typeof body.message === "string" && body.message.trim()) return body.message;
    return fallback;
  } catch {
    try {
      const text = await response.text();
      return text?.trim() || fallback;
    } catch {
      return fallback;
    }
  }
}

async function triggerUnauthorizedHandler() {
  if (!unauthorizedHandler) return;
  if (unauthorizedHandlerTask) {
    await unauthorizedHandlerTask;
    return;
  }
  unauthorizedHandlerTask = Promise.resolve()
    .then(() => unauthorizedHandler?.())
    .finally(() => {
      unauthorizedHandlerTask = null;
    });
  await unauthorizedHandlerTask;
}

/**
 * Deduplicated refresh: concurrent 401s all await the same single refresh call.
 * Uses _skipRefresh on the inner api call to prevent infinite loops.
 */
async function tryRefreshToken(): Promise<string | null> {
  if (!refreshHandler) return null;
  if (refreshTask) return refreshTask;
  refreshTask = Promise.resolve()
    .then(() => refreshHandler!())
    .finally(() => {
      refreshTask = null;
    });
  return refreshTask;
}

async function requestOnce<T>(path: string, options: RequestOptions): Promise<T> {
  let token = await tokenStorage.get();
  if (token && !options._skipRefresh && isTokenExpired(token)) {
    const refreshedToken = await tryRefreshToken();
    if (refreshedToken) {
      await tokenStorage.set(refreshedToken);
      token = refreshedToken;
    } else {
      await Promise.all([tokenStorage.clear(), refreshTokenStorage.clear()]);
      await triggerUnauthorizedHandler();
      throw new ApiError(401, "Session expired");
    }
  }
  const timeoutMs = options.timeoutMs ?? getRequestTimeoutMs();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const baseUrl = getBaseUrl();
  const controller = new AbortController();
  const callerSignal = options.signal;
  if (callerSignal?.aborted) {
    throw new ApiError(0, "Request aborted");
  }

  const onCallerAbort = () => controller.abort();
  if (callerSignal) callerSignal.addEventListener("abort", onCallerAbort, { once: true });

  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  let response: Response;
  try {
    response = await fetch(`${baseUrl}${path}`, {
      ...options,
      headers,
      signal: controller.signal,
    });
  } catch (error) {
    if (isAbortError(error)) {
      if (callerSignal?.aborted) {
        throw new ApiError(0, "Request aborted");
      }
      throw new ApiError(0, "Request timeout");
    }
    throw new ApiError(0, "Network request failed");
  } finally {
    clearTimeout(timeoutId);
    if (callerSignal) callerSignal.removeEventListener("abort", onCallerAbort);
  }

  if (!response.ok) {
    const message = await parseErrorMessage(response);
    throw new ApiError(response.status, message);
  }

  // 204 No Content — возвращаем undefined
  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const method = (options.method ?? "GET").toUpperCase();
  const maxRetries = Math.max(0, options.retry?.maxRetries ?? 2);

  let attempt = 0;
  let tokenRefreshed = false;

  for (;;) {
    try {
      return await requestOnce<T>(path, options);
    } catch (error) {
      // On 401: attempt token refresh once, then retry. Skip for refresh requests themselves.
      if (
        error instanceof ApiError &&
        error.status === 401 &&
        !tokenRefreshed &&
        !options._skipRefresh
      ) {
        tokenRefreshed = true;
        const newToken = await tryRefreshToken();
        if (newToken) {
          await tokenStorage.set(newToken);
          continue;
        }
        // Refresh failed or unavailable — clear session and notify
        await Promise.all([tokenStorage.clear(), refreshTokenStorage.clear()]);
        await triggerUnauthorizedHandler();
        throw error;
      }
      if (!shouldRetry(error, method, attempt, maxRetries)) {
        throw error;
      }
      const delayMs = RETRY_BACKOFF_MS[attempt] ?? RETRY_BACKOFF_MS[RETRY_BACKOFF_MS.length - 1];
      attempt += 1;
      await sleep(delayMs);
    }
  }
}

export const api = {
  get: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { ...(options ?? {}), method: "GET" }),

  post: <T>(path: string, body: unknown, options?: RequestOptions) =>
    request<T>(path, { ...(options ?? {}), method: "POST", body: JSON.stringify(body) }),

  put: <T>(path: string, body: unknown, options?: RequestOptions) =>
    request<T>(path, { ...(options ?? {}), method: "PUT", body: JSON.stringify(body) }),

  patch: <T>(path: string, body: unknown, options?: RequestOptions) =>
    request<T>(path, { ...(options ?? {}), method: "PATCH", body: JSON.stringify(body) }),

  delete: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { ...(options ?? {}), method: "DELETE" }),
};
