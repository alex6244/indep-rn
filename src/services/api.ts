let inMemoryToken: string | null = null;

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

// ─── Токен ───────────────────────────────────────────────────────────────────

export const tokenStorage = {
  // Temporary: keep token in memory only until secure storage is introduced.
  get: async () => inMemoryToken,
  set: async (token: string) => {
    inMemoryToken = token;
  },
  clear: async () => {
    inMemoryToken = null;
  },
};

// ─── Базовый клиент ──────────────────────────────────────────────────────────

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = await tokenStorage.get();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const baseUrl = getBaseUrl();
  const response = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let message = `HTTP ${response.status}`;
    try {
      const body = await response.json();
      message = body?.message ?? message;
    } catch {
      // оставляем дефолтное сообщение
    }
    throw new ApiError(response.status, message);
  }

  // 204 No Content — возвращаем undefined
  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export const api = {
  get: <T>(path: string) => request<T>(path),

  post: <T>(path: string, body: unknown) =>
    request<T>(path, { method: "POST", body: JSON.stringify(body) }),

  put: <T>(path: string, body: unknown) =>
    request<T>(path, { method: "PUT", body: JSON.stringify(body) }),

  patch: <T>(path: string, body: unknown) =>
    request<T>(path, { method: "PATCH", body: JSON.stringify(body) }),

  delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),
};
