import { envBool, envNumber, envString } from "../../config/env";
import { isTokenExpired } from "./jwt";
import {
  ApiError,
  classifyApiErrorByContractCode,
  classifyApiErrorByStatus,
  parseErrorPayload,
} from "./parseApiError";
import { refreshTokenStorage, tokenStorage } from "./tokenStorage";

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

export function setUnauthorizedHandler(handler: UnauthorizedHandler | null) {
  unauthorizedHandler = handler;
}

export function setRefreshHandler(handler: RefreshHandler | null) {
  refreshHandler = handler;
}

// ─── Базовый клиент ──────────────────────────────────────────────────────────

function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
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
      const hasVersionSegment = p
        .split("/")
        .filter(Boolean)
        .some((segment) => segment === "v1" || segment === "v1.0");
      if (hasVersionSegment) {
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
    Accept: "application/json",
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
