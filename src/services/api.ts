import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";

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
};

type UnauthorizedHandler = () => Promise<void> | void;

let unauthorizedHandler: UnauthorizedHandler | null = null;
let unauthorizedHandlerTask: Promise<void> | null = null;

export function setUnauthorizedHandler(handler: UnauthorizedHandler | null) {
  unauthorizedHandler = handler;
}

// ─── Токен ───────────────────────────────────────────────────────────────────

export const tokenStorage = {
  get: async () => {
    if (inMemoryToken) return inMemoryToken;

    try {
      const secure = await SecureStore.getItemAsync(TOKEN_KEY);
      if (secure) {
        inMemoryToken = secure;
        return secure;
      }
    } catch {
      // TODO(auth): report secure store read errors to telemetry.
    }

    try {
      const fallback = await AsyncStorage.getItem(TOKEN_KEY);
      if (fallback) {
        inMemoryToken = fallback;
        return fallback;
      }
    } catch {
      // TODO(auth): report AsyncStorage read errors to telemetry.
    }

    return null;
  },
  set: async (token: string) => {
    inMemoryToken = token;
    try {
      await SecureStore.setItemAsync(TOKEN_KEY, token);
      return;
    } catch {
      // TODO(auth): report secure store write errors to telemetry.
    }
    try {
      await AsyncStorage.setItem(TOKEN_KEY, token);
    } catch {
      // TODO(auth): report AsyncStorage write errors to telemetry.
    }
  },
  clear: async () => {
    inMemoryToken = null;
    try {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
    } catch {
      // TODO(auth): report secure store delete errors to telemetry.
    }
    try {
      await AsyncStorage.removeItem(TOKEN_KEY);
    } catch {
      // TODO(auth): report AsyncStorage delete errors to telemetry.
    }
  },
};

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

async function requestOnce<T>(path: string, options: RequestOptions): Promise<T> {
  const token = await tokenStorage.get();
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
    if (response.status === 401) {
      await tokenStorage.clear();
      await triggerUnauthorizedHandler();
    }
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
  for (;;) {
    try {
      return await requestOnce<T>(path, options);
    } catch (error) {
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
