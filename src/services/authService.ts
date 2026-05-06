import { ApiError, api, tokenStorage, refreshTokenStorage } from "./api";
import type { User } from "../types/user";
import {
  type AuthCredentials,
  type AuthError,
  type AuthErrorCode,
  getDefaultAuthErrorMessage,
  type RegisterPayload,
} from "./authTypes";
import { envBool } from "../config/env";

// API transport/provider for auth endpoints: login/register/me/logout.
// Source selection (mock|api via EXPO_PUBLIC_AUTH_SOURCE) is owned by AuthContext; UI works through useAuth().

type ApiAuthResponse = {
  token?: string;
  refresh_token?: string;
  accessToken?: string;
  refreshToken?: string;
  expiresInSeconds?: number;
  user: User;
};
type VerificationRequestResponse = { message?: string };
type ConfirmVerificationPayload = { email: string; code: string };

function mapApiAuthResponseToDomainUser(response: ApiAuthResponse): User {
  return response.user;
}

function getAccessToken(response: {
  token?: string;
  accessToken?: string;
}): string | null {
  if (typeof response.accessToken === "string" && response.accessToken.trim()) {
    return response.accessToken;
  }
  if (typeof response.token === "string" && response.token.trim()) {
    return response.token;
  }
  return null;
}

function getRefreshToken(response: {
  refresh_token?: string;
  refreshToken?: string;
}): string | null {
  if (typeof response.refreshToken === "string" && response.refreshToken.trim()) {
    return response.refreshToken;
  }
  if (typeof response.refresh_token === "string" && response.refresh_token.trim()) {
    return response.refresh_token;
  }
  return null;
}

function requiresRefreshRotation(): boolean {
  return envBool("EXPO_PUBLIC_REQUIRE_REFRESH_ROTATION");
}

function isInvalidRefreshError(error: unknown): boolean {
  return error instanceof ApiError && (error.status === 401 || error.status === 403);
}

function isTransientRefreshError(error: unknown): boolean {
  if (error instanceof TypeError) return true;
  if (!(error instanceof ApiError)) return false;
  return error.status === 0 || error.status >= 500;
}

function mapAuthErrorCode(error: unknown): AuthErrorCode {
  if (error instanceof ApiError) {
    if (error.status === 0) return "network_error";
    if (error.status === 401) return "invalid_credentials";
    if (error.status === 400 || error.status === 422) return "validation_error";
    if (error.status === 409) return "user_exists";
    if (error.status === 429) return "rate_limited";
    if (error.status >= 500) return "server_error";
    return "unknown";
  }
  if (error instanceof TypeError) {
    return "network_error";
  }
  return "unknown";
}

function mapAuthError(error: unknown): AuthError {
  const code = mapAuthErrorCode(error);
  return { code, message: getDefaultAuthErrorMessage(code) };
}

export const authService = {
  requestVerification: async (email: string): Promise<VerificationRequestResponse | void> => {
    try {
      return await api.post<VerificationRequestResponse>("/auth/request-verification", { email });
    } catch (error) {
      throw mapAuthError(error);
    }
  },

  confirmVerification: async (payload: ConfirmVerificationPayload): Promise<User> => {
    try {
      const res = await api.post<ApiAuthResponse>("/auth/confirm-verification", payload);
      const accessToken = getAccessToken(res);
      if (!accessToken) {
        throw new Error("Confirm verification response did not contain access token.");
      }
      await tokenStorage.set(accessToken);
      const refreshToken = getRefreshToken(res);
      if (refreshToken) await refreshTokenStorage.set(refreshToken);
      return mapApiAuthResponseToDomainUser(res);
    } catch (error) {
      throw mapAuthError(error);
    }
  },

  login: async (data: AuthCredentials): Promise<User> => {
    try {
      const res = await api.post<ApiAuthResponse>("/auth/login", data);
      const accessToken = getAccessToken(res);
      if (!accessToken) {
        throw new Error("Auth response did not contain access token.");
      }
      await tokenStorage.set(accessToken);
      const refreshToken = getRefreshToken(res);
      if (refreshToken) await refreshTokenStorage.set(refreshToken);
      return mapApiAuthResponseToDomainUser(res);
    } catch (error) {
      throw mapAuthError(error);
    }
  },

  register: async (data: RegisterPayload): Promise<User> => {
    try {
      const res = await api.post<ApiAuthResponse>("/auth/register", data);
      const accessToken = getAccessToken(res);
      if (!accessToken) {
        throw new Error("Auth response did not contain access token.");
      }
      await tokenStorage.set(accessToken);
      const refreshToken = getRefreshToken(res);
      if (refreshToken) await refreshTokenStorage.set(refreshToken);
      return mapApiAuthResponseToDomainUser(res);
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
      const res = await api.post<{
        token?: string;
        accessToken?: string;
        refresh_token?: string;
        refreshToken?: string;
      }>(
        "/auth/refresh",
        { refresh_token: storedRefreshToken },
        { _skipRefresh: true },
      );
      // When rotation is required, backend must always return a fresh refresh_token.
      const accessToken = getAccessToken(res);
      if (!accessToken) return null;
      const nextRefreshToken = getRefreshToken(res);
      if (nextRefreshToken) {
        await refreshTokenStorage.set(nextRefreshToken);
      } else if (requiresRefreshRotation()) {
        await Promise.all([refreshTokenStorage.clear(), tokenStorage.clear()]);
        return null;
      }
      return accessToken;
    } catch (error) {
      if (isInvalidRefreshError(error)) {
        await Promise.all([refreshTokenStorage.clear(), tokenStorage.clear()]);
        return null;
      }
      if (isTransientRefreshError(error)) {
        throw error;
      }
      throw new Error("Не удалось обновить сессию. Попробуйте ещё раз.");
    }
  },

  me: async (): Promise<User> => {
    try {
      return await api.get<User>("/me");
    } catch (error) {
      throw mapAuthError(error);
    }
  },
};
