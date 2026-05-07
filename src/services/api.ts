import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { reportTelemetry } from "../shared/monitoring/errorReporting";
import { envBool, envNumber, envString } from "../config/env";

let inMemoryToken: string | null = null;
const TOKEN_KEY = "auth.token";
const LEGACY_TOKEN_KEY = "@auth/token";
const DEFAULT_TIMEOUT_MS = 10000;
const RETRY_BACKOFF_MS = [300, 700] as const;

function resolveBaseUrl(): string {
  const envUrl = envString("EXPO_PUBLIC_API_URL");
  const allowHttpDevFallback = envBool("EXPO_PUBLIC_ALLOW_HTTP_DEV");

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
  const parsed = envNumber("EXPO_PUBLIC_API_TIMEOUT_MS", DEFAULT_TIMEOUT_MS);
  return parsed > 0 ? parsed : DEFAULT_TIMEOUT_MS;
}

// ─── Типы ────────────────────────────────────────────────────────────────────

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly code: ApiErrorCode = classifyApiErrorByStatus(status),
    public readonly contractCode?: string,
    public readonly details?: unknown,
    public readonly requestId?: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export type ApiErrorCode =
  | "network"
  | "timeout"
  | "aborted"
  | "unauthorized"
  | "forbidden"
  | "not_found"
  | "conflict"
  | "rate_limited"
  | "validation"
  | "server_error"
  | "http_error"
  | "unknown";

function classifyApiErrorByStatus(status: number): ApiErrorCode {
  if (status === 0) return "network";
  if (status === 401) return "unauthorized";
  if (status === 403) return "forbidden";
  if (status === 404) return "not_found";
  if (status === 409) return "conflict";
  if (status === 422) return "validation";
  if (status === 429) return "rate_limited";
  if (status >= 500) return "server_error";
  if (status >= 400) return "http_error";
  return "unknown";
}

function classifyApiErrorByContractCode(code: unknown): ApiErrorCode | null {
  if (typeof code !== "string") return null;
  switch (code.trim().toUpperCase()) {
    case "UNAUTHENTICATED":
      return "unauthorized";
    case "FORBIDDEN":
      return "forbidden";
    case "NOT_FOUND":
      return "not_found";
    case "CONFLICT":
      return "conflict";
    case "RATE_LIMITED":
      return "rate_limited";
    case "VALIDATION_ERROR":
      return "validation";
    case "INTERNAL":
      return "server_error";
    default:
      return null;
  }
}

export function classifyApiError(error: unknown): ApiErrorCode {
  if (error instanceof ApiError) return error.code;
  if (error instanceof TypeError) return "network";
  return "unknown";
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

function allowInsecureAsyncTokenStorage(): boolean {
  // AsyncStorage is not a secure storage for tokens. Keep it strictly opt-in.
  if (process.env.NODE_ENV === "test") return true;
  return envBool("EXPO_PUBLIC_ALLOW_INSECURE_TOKEN_STORAGE");
}

export function setUnauthorizedHandler(handler: UnauthorizedHandler | null) {
  unauthorizedHandler = handler;
}

export function setRefreshHandler(handler: RefreshHandler | null) {
  refreshHandler = handler;
}

// ─── Токены ──────────────────────────────────────────────────────────────────

const REFRESH_TOKEN_KEY = "auth.refresh_token";
const LEGACY_REFRESH_TOKEN_KEY = "@auth/refresh_token";
let inMemoryRefreshToken: string | null = null;

async function getSecureItemWithMigration(
  key: string,
  legacyKey: string,
): Promise<string | null> {
  try {
    const currentValue = await SecureStore.getItemAsync(key);
    if (currentValue) return currentValue;
  } catch (error) {
    trackStorageFailure("get", "secure_store", error);
  }

  try {
    const legacyValue = await SecureStore.getItemAsync(legacyKey);
    if (!legacyValue) return null;
    try {
      await SecureStore.setItemAsync(key, legacyValue);
    } catch (error) {
      trackStorageFailure("set", "secure_store", error);
    }
    try {
      await SecureStore.deleteItemAsync(legacyKey);
    } catch (error) {
      trackStorageFailure("clear", "secure_store", error);
    }
    return legacyValue;
  } catch (error) {
    trackStorageFailure("get", "secure_store", error);
    return null;
  }
}

async function getAsyncItemWithMigration(
  key: string,
  legacyKey: string,
): Promise<string | null> {
  try {
    const currentValue = await AsyncStorage.getItem(key);
    if (currentValue) return currentValue;
  } catch (error) {
    trackStorageFailure("get", "async_storage", error);
  }

  try {
    const legacyValue = await AsyncStorage.getItem(legacyKey);
    if (!legacyValue) return null;
    try {
      await AsyncStorage.setItem(key, legacyValue);
    } catch (error) {
      trackStorageFailure("set", "async_storage", error);
    }
    try {
      await AsyncStorage.removeItem(legacyKey);
    } catch (error) {
      trackStorageFailure("clear", "async_storage", error);
    }
    return legacyValue;
  } catch (error) {
    trackStorageFailure("get", "async_storage", error);
    return null;
  }
}

export const refreshTokenStorage = {
  get: async () => {
    if (inMemoryRefreshToken) return inMemoryRefreshToken;
    const secure = await getSecureItemWithMigration(
      REFRESH_TOKEN_KEY,
      LEGACY_REFRESH_TOKEN_KEY,
    );
    if (secure) {
      inMemoryRefreshToken = secure;
      return secure;
    }
    if (!allowInsecureAsyncTokenStorage()) return null;
    const fallback = await getAsyncItemWithMigration(
      REFRESH_TOKEN_KEY,
      LEGACY_REFRESH_TOKEN_KEY,
    );
    if (fallback) {
      inMemoryRefreshToken = fallback;
      return fallback;
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
    if (!allowInsecureAsyncTokenStorage()) return;
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
      await SecureStore.deleteItemAsync(LEGACY_REFRESH_TOKEN_KEY);
    } catch (error) {
      trackStorageFailure("clear", "secure_store", error);
    }
    if (!allowInsecureAsyncTokenStorage()) return;
    try {
      await AsyncStorage.removeItem(REFRESH_TOKEN_KEY);
    } catch (error) {
      trackStorageFailure("clear", "async_storage", error);
    }
    try {
      await AsyncStorage.removeItem(LEGACY_REFRESH_TOKEN_KEY);
    } catch (error) {
      trackStorageFailure("clear", "async_storage", error);
    }
  },
};

export const tokenStorage = {
  get: async () => {
    if (inMemoryToken) return inMemoryToken;

    const secure = await getSecureItemWithMigration(TOKEN_KEY, LEGACY_TOKEN_KEY);
    if (secure) {
      inMemoryToken = secure;
      return secure;
    }

    if (!allowInsecureAsyncTokenStorage()) return null;
    const fallback = await getAsyncItemWithMigration(TOKEN_KEY, LEGACY_TOKEN_KEY);
    if (fallback) {
      inMemoryToken = fallback;
      return fallback;
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
    if (!allowInsecureAsyncTokenStorage()) return;
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
      await SecureStore.deleteItemAsync(LEGACY_TOKEN_KEY);
    } catch (error) {
      trackStorageFailure("clear", "secure_store", error);
    }
    if (!allowInsecureAsyncTokenStorage()) return;
    try {
      await AsyncStorage.removeItem(TOKEN_KEY);
    } catch (error) {
      trackStorageFailure("clear", "async_storage", error);
      trackStorageFailure("clear", "fallback", error);
    }
    try {
      await AsyncStorage.removeItem(LEGACY_TOKEN_KEY);
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
    if (error.code === "network" || error.code === "timeout") return true;
    return false;
  }
  return false;
}

async function parseErrorMessage(response: Response): Promise<string> {
  const fallback = `HTTP ${response.status}`;
  try {
    const body = await response.json();
    if (
      body &&
      typeof body === "object" &&
      "error" in body &&
      body.error &&
      typeof body.error === "object"
    ) {
      const envelopeMessage = (body.error as { message?: unknown }).message;
      if (typeof envelopeMessage === "string" && envelopeMessage.trim()) return envelopeMessage;
    }
    if (body && typeof body === "object" && "message" in body) {
      const rawMessage = (body as { message?: unknown }).message;
      if (typeof rawMessage === "string" && rawMessage.trim()) return rawMessage;
    }
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

async function parseErrorPayload(response: Response): Promise<{
  message: string;
  contractCode?: string;
  details?: unknown;
  requestId?: string;
}> {
  const fallback = `HTTP ${response.status}`;
  try {
    const body = await response.json();
    if (
      body &&
      typeof body === "object" &&
      "error" in body &&
      body.error &&
      typeof body.error === "object"
    ) {
      const payload = body.error as {
        code?: unknown;
        message?: unknown;
        details?: unknown;
        requestId?: unknown;
      };
      return {
        message:
          typeof payload.message === "string" && payload.message.trim()
            ? payload.message
            : fallback,
        contractCode: typeof payload.code === "string" ? payload.code : undefined,
        details: payload.details,
        requestId: typeof payload.requestId === "string" ? payload.requestId : undefined,
      };
    }
    if (body && typeof body === "object" && "message" in body) {
      const rawMessage = (body as { message?: unknown }).message;
      if (typeof rawMessage === "string" && rawMessage.trim()) {
        return { message: rawMessage };
      }
    }
    return { message: fallback };
  } catch {
    const message = await parseErrorMessage(response);
    return { message };
  }
}

function normalizeApiPath(path: string): string {
  if (!path.startsWith("/")) {
    return normalizeApiPath(`/${path}`);
  }
  // If the base URL already includes a version segment (e.g. ".../api/v1.0"),
  // do not prefix another version here.
  const envUrl = envString("EXPO_PUBLIC_API_URL");
  if (envUrl) {
    try {
      const parsed = new URL(envUrl);
      const p = parsed.pathname.replace(/\/+$/, "");
      if (p === "/v1" || p.startsWith("/v1/") || p === "/v1.0" || p.startsWith("/v1.0/")) {
        return path;
      }
    } catch {
      // ignore; invalid URL will be handled in resolveBaseUrl()
    }
  }

  if (path === "/v1" || path.startsWith("/v1/")) return path;
  if (path === "/v1.0" || path.startsWith("/v1.0/")) return path;
  return `/v1${path}`;
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
      throw new ApiError(401, "Session expired", "unauthorized");
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
    throw new ApiError(0, "Request aborted", "aborted");
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
        throw new ApiError(0, "Request aborted", "aborted");
      }
      throw new ApiError(0, "Request timeout", "timeout");
    }
    throw new ApiError(0, "Network request failed", "network");
  } finally {
    clearTimeout(timeoutId);
    if (callerSignal) callerSignal.removeEventListener("abort", onCallerAbort);
  }

  if (!response.ok) {
    const parsedError = await parseErrorPayload(response);
    const mappedByContract = classifyApiErrorByContractCode(parsedError.contractCode);
    const mappedByStatus = classifyApiErrorByStatus(response.status);
    throw new ApiError(
      response.status,
      parsedError.message,
      mappedByContract ?? mappedByStatus,
      parsedError.contractCode,
      parsedError.details,
      parsedError.requestId,
    );
  }

  // 204 No Content — возвращаем undefined
  if (response.status === 204) {
    return undefined as T;
  }

  const payload = (await response.json()) as unknown;
  if (payload && typeof payload === "object" && "data" in payload) {
    return (payload as { data: T }).data;
  }
  return payload as T;
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
    request<T>(normalizeApiPath(path), { ...(options ?? {}), method: "GET" }),

  post: <T>(path: string, body: unknown, options?: RequestOptions) =>
    request<T>(normalizeApiPath(path), {
      ...(options ?? {}),
      method: "POST",
      body: JSON.stringify(body),
    }),

  put: <T>(path: string, body: unknown, options?: RequestOptions) =>
    request<T>(normalizeApiPath(path), {
      ...(options ?? {}),
      method: "PUT",
      body: JSON.stringify(body),
    }),

  patch: <T>(path: string, body: unknown, options?: RequestOptions) =>
    request<T>(normalizeApiPath(path), {
      ...(options ?? {}),
      method: "PATCH",
      body: JSON.stringify(body),
    }),

  delete: <T>(path: string, options?: RequestOptions) =>
    request<T>(normalizeApiPath(path), { ...(options ?? {}), method: "DELETE" }),
};
