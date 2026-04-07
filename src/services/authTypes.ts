import type { UserRole } from "../data/users";

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
  | "user_exists"
  | "network_error"
  | "unknown";

export class AuthFlowError extends Error {
  constructor(
    public readonly code: AuthErrorCode,
    message?: string,
  ) {
    super(message ?? code);
    this.name = "AuthFlowError";
  }
}

