// ─── Типы ────────────────────────────────────────────────────────────────────

export function classifyApiErrorByStatus(status: number): ApiErrorCode {
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

export function classifyApiErrorByContractCode(code: unknown): ApiErrorCode | null {
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

export function classifyApiError(error: unknown): ApiErrorCode {
  if (error instanceof ApiError) return error.code;
  if (error instanceof TypeError) return "network";
  return "unknown";
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

export async function parseErrorPayload(response: Response): Promise<{
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
