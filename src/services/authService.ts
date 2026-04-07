import { ApiError, api, tokenStorage } from "./api";
import type { User } from "../data/users";
import {
  type AuthCredentials,
  AuthFlowError,
  type RegisterPayload,
} from "./authTypes";

// Backend-ready auth service.
// Current UI auth flow still uses AuthContext mock mode until API integration is enabled.

interface AuthResponse {
  token: string;
  user: User;
}

function mapAuthError(error: unknown): never {
  if (error instanceof ApiError) {
    if (error.status === 401) {
      throw new AuthFlowError("invalid_credentials", error.message);
    }
    if (error.status === 409) {
      throw new AuthFlowError("user_exists", error.message);
    }
    throw new AuthFlowError("unknown", error.message);
  }
  if (error instanceof TypeError) {
    throw new AuthFlowError("network_error", error.message);
  }
  throw new AuthFlowError("unknown");
}

export const authService = {
  login: async (data: AuthCredentials): Promise<User> => {
    try {
      const res = await api.post<AuthResponse>("/auth/login", data);
      await tokenStorage.set(res.token);
      return res.user;
    } catch (error) {
      mapAuthError(error);
    }
  },

  register: async (data: RegisterPayload): Promise<User> => {
    try {
      const res = await api.post<AuthResponse>("/auth/register", data);
      await tokenStorage.set(res.token);
      return res.user;
    } catch (error) {
      mapAuthError(error);
    }
  },

  logout: async (): Promise<void> => {
    try {
      await api.post("/auth/logout", {});
    } finally {
      await tokenStorage.clear();
    }
  },

  me: async (): Promise<User> => {
    try {
      return await api.get<User>("/auth/me");
    } catch (error) {
      mapAuthError(error);
    }
  },
};
