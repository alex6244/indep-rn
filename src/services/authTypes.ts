import type { UserRole } from "../types/user";

export type AuthCredentials = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  name: string;
  email: string;
  password: string;
  role: UserRole;
};

export type AuthErrorCode =
  | "invalid_credentials"
  | "validation_error"
  | "user_exists"
  | "rate_limited"
  | "server_error"
  | "network_error"
  | "unknown";

export type AuthError = {
  code: AuthErrorCode;
  message: string;
};

const AUTH_ERROR_MESSAGES: Record<AuthErrorCode, string> = {
  invalid_credentials: "Неверный e-mail или пароль.",
  validation_error: "Проверьте корректность введённых данных.",
  user_exists: "Пользователь с таким e-mail уже существует.",
  rate_limited: "Слишком много попыток. Попробуйте позже.",
  server_error: "Сервис временно недоступен. Попробуйте позже.",
  network_error: "Сервис авторизации недоступен или нет сети. Попробуйте снова.",
  unknown: "Сервис авторизации недоступен. Попробуйте снова.",
};

export function getDefaultAuthErrorMessage(code: AuthErrorCode): string {
  return AUTH_ERROR_MESSAGES[code];
}

export class AuthFlowError extends Error {
  constructor(
    public readonly code: AuthErrorCode,
    message?: string,
  ) {
    super(message ?? code);
    this.name = "AuthFlowError";
  }
}

