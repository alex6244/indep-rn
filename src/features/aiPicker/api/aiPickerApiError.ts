export class AiPickerApiError extends Error {
  readonly status: number;
  readonly code?: string;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.name = "AiPickerApiError";
    this.status = status;
    this.code = code;
  }
}

export function isAiPickerUnauthorizedError(error: unknown): boolean {
  if (error instanceof AiPickerApiError) {
    return error.status === 401 || error.code === "unauthorized";
  }
  return false;
}
