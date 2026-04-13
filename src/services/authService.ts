import { ApiError, api, tokenStorage, refreshTokenStorage } from "./api";
import type { User } from "../data/users";
import {
  type AuthCredentials,
  AuthFlowError,
  type RegisterPayload,
} from "./authTypes";

// API transport/provider for auth endpoints: login/register/me/logout.
// Source selection (mock|api via EXPO_PUBLIC_AUTH_SOURCE) is owned by AuthContext; UI works through useAuth().

interface AuthResponse {
  token: string;
  refresh_token?: string;
  user: User;
}

function mapAuthError(error: unknown): never {
  if (error instanceof ApiError) {
    if (error.status === 0) {
      throw new AuthFlowError("network_error", error.message);
    }
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
      if (res.refresh_token) await refreshTokenStorage.set(res.refresh_token);
      return res.user;
    } catch (error) {
      mapAuthError(error);
    }
  },

  register: async (data: RegisterPayload): Promise<User> => {
    try {
      const res = await api.post<AuthResponse>("/auth/register", data);
      await tokenStorage.set(res.token);
      if (res.refresh_token) await refreshTokenStorage.set(res.refresh_token);
      return res.user;
    } catch (error) {
      mapAuthError(error);
    }
  },

  logout: async (): Promise<void> => {
    try {
      await api.post("/auth/logout", {});
    } finally {
      await Promise.all([tokenStorage.clear(), refreshTokenStorage.clear()]);
    }
  },

  /**
   * Exchange refresh token for a new access token.
   * Uses _skipRefresh to prevent infinite 401 loops.
   * Returns new access token or null if refresh is not possible.
   */
  refresh: async (): Promise<string | null> => {
    try {
      const storedRefreshToken = await refreshTokenStorage.get();
      if (!storedRefreshToken) return null;
      const res = await api.post<{ token: string; refresh_token?: string }>(
        "/auth/refresh",
        { refresh_token: storedRefreshToken },
        { _skipRefresh: true },
      );
      if (res.refresh_token) await refreshTokenStorage.set(res.refresh_token);
      return res.token;
    } catch {
      return null;
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
