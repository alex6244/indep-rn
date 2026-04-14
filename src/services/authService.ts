import { ApiError, api, tokenStorage, refreshTokenStorage } from "./api";
import type { User } from "../data/users";
import {
  type AuthCredentials,
  type AuthError,
  type AuthErrorCode,
  getDefaultAuthErrorMessage,
  type RegisterPayload,
} from "./authTypes";

// API transport/provider for auth endpoints: login/register/me/logout.
// Source selection (mock|api via EXPO_PUBLIC_AUTH_SOURCE) is owned by AuthContext; UI works through useAuth().

interface AuthResponse {
  token: string;
  refresh_token?: string;
  user: User;
}

function requiresRefreshRotation(): boolean {
  return process.env.EXPO_PUBLIC_REQUIRE_REFRESH_ROTATION === "true";
}

function mapAuthErrorCode(error: unknown): AuthErrorCode {
  if (error instanceof ApiError) {
    if (error.status === 0) return "network_error";
    if (error.status === 401) return "invalid_credentials";
    if (error.status === 409) return "user_exists";
    return "unknown";
  }
  if (error instanceof TypeError) {
    return "network_error";
  }
  return "unknown";
}

function mapAuthError(error: unknown): AuthError {
  const code = mapAuthErrorCode(error);
  const message =
    error instanceof ApiError || error instanceof TypeError
      ? (error.message?.trim() || getDefaultAuthErrorMessage(code))
      : getDefaultAuthErrorMessage(code);
  return { code, message };
}

export const authService = {
  login: async (data: AuthCredentials): Promise<User> => {
    try {
      const res = await api.post<AuthResponse>("/auth/login", data);
      await tokenStorage.set(res.token);
      if (res.refresh_token) await refreshTokenStorage.set(res.refresh_token);
      return res.user;
    } catch (error) {
      throw mapAuthError(error);
    }
  },

  register: async (data: RegisterPayload): Promise<User> => {
    try {
      const res = await api.post<AuthResponse>("/auth/register", data);
      await tokenStorage.set(res.token);
      if (res.refresh_token) await refreshTokenStorage.set(res.refresh_token);
      return res.user;
    } catch (error) {
      throw mapAuthError(error);
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
      // When rotation is required, backend must always return a fresh refresh_token.
      const nextRefreshToken = res.refresh_token?.trim();
      if (nextRefreshToken) {
        await refreshTokenStorage.set(nextRefreshToken);
      } else if (requiresRefreshRotation()) {
        await Promise.all([refreshTokenStorage.clear(), tokenStorage.clear()]);
        return null;
      }
      return res.token;
    } catch {
      return null;
    }
  },

  me: async (): Promise<User> => {
    try {
      return await api.get<User>("/auth/me");
    } catch (error) {
      throw mapAuthError(error);
    }
  },
};
