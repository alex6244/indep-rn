export type AppErrorKind =
  | "network"
  | "unauthorized"
  | "not_found"
  | "server"
  | "validation"
  | "unknown";

export type AppErrorContext = Record<string, unknown>;

type AppErrorInit = {
  kind: AppErrorKind;
  message: string;
  status?: number;
  cause?: unknown;
  context?: AppErrorContext;
};

export class AppError extends Error {
  public readonly kind: AppErrorKind;
  public readonly status?: number;
  public readonly context?: AppErrorContext;
  public readonly cause?: unknown;

  constructor(init: AppErrorInit) {
    super(init.message);
    this.name = "AppError";
    this.kind = init.kind;
    this.status = init.status;
    this.context = init.context;
    this.cause = init.cause;
  }
}

export function toAppError(error: unknown, fallbackMessage: string): AppError {
  if (error instanceof AppError) return error;
  const message =
    error instanceof Error && typeof error.message === "string" && error.message.trim()
      ? error.message
      : fallbackMessage;
  return new AppError({ kind: "unknown", message, cause: error });
}

export function mapAppErrorToUserMessage(error: unknown, fallbackMessage: string): string {
  if (error instanceof AppError) return error.message || fallbackMessage;
  if (error instanceof Error && error.message?.trim()) return error.message.trim();
  return fallbackMessage;
}
