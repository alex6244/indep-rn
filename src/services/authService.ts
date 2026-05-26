import { ApiError, api, tokenStorage, refreshTokenStorage } from "./api";
import type { User, UserRole } from "../types/user";
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
  api_token?: string;
  refresh_token?: string;
  accessToken?: string;
  refreshToken?: string;
  expiresInSeconds?: number;
  user: User;
};
type VerificationRequestResponse = { message?: string };
type VerificationRequestPayload = { email: string; name?: string; role?: string };
type ConfirmVerificationPayload = {
  email: string;
  code: string;
  name?: string;
  role?: string;
};

/** Reads access token from common API shapes (camelCase, Laravel snake_case, `api_token`, nested `tokens`). */
function pickAccessToken(source: unknown): string | null {
  if (!source || typeof source !== "object") return null;
  const o = source as Record<string, unknown>;
  for (const key of ["accessToken", "token", "access_token", "api_token"] as const) {
    const v = o[key];
    if (typeof v === "string" && v.trim()) return v;
  }
  const nested = o.tokens;
  if (nested && typeof nested === "object") {
    return pickAccessToken(nested);
  }
  return null;
}

/** Reads refresh token from common API shapes (including nested `tokens`). */
function pickRefreshToken(source: unknown): string | null {
  if (!source || typeof source !== "object") return null;
  const o = source as Record<string, unknown>;
  for (const key of ["refreshToken", "refresh_token"] as const) {
    const v = o[key];
    if (typeof v === "string" && v.trim()) return v;
  }
  const nested = o.tokens;
  if (nested && typeof nested === "object") {
    return pickRefreshToken(nested);
  }
  return null;
}

function getAccessToken(response: unknown): string | null {
  return pickAccessToken(response);
}

function getRefreshToken(response: unknown): string | null {
  return pickRefreshToken(response);
}

function pickRoleField(u: Record<string, unknown>): unknown {
  if (u.role !== undefined) return u.role;
  if (u.user_role !== undefined) return u.user_role;
  if (u.userRole !== undefined) return u.userRole;
  if (Array.isArray(u.roles) && u.roles.length > 0) return u.roles[0];
  return undefined;
}

/** Normalizes API role strings (case, nested objects, legacy aliases). */
export function normalizeUserRole(value: unknown): UserRole {
  if (value === null || value === undefined) return "client";
  if (Array.isArray(value) && value.length > 0) {
    return normalizeUserRole(value[0]);
  }
  if (typeof value === "object") {
    const o = value as Record<string, unknown>;
    for (const key of ["slug", "name", "code", "value", "type"] as const) {
      if (typeof o[key] === "string") return normalizeUserRole(o[key]);
    }
    return "client";
  }
  if (typeof value !== "string") return "client";
  const r = value.trim().toLowerCase();
  if (
    r === "picker" ||
    r === "pickers" ||
    r === "realtor" ||
    r === "realtors" ||
    r === "autopicker" ||
    r === "car_picker" ||
    r === "selector" ||
    r === "подборщик"
  ) {
    return "picker";
  }
  return "client";
}

/** Backend contract uses `realtor`; app domain uses `picker` for the same role. */
export function toApiRole(value: unknown): "client" | "realtor" {
  return normalizeUserRole(value) === "picker" ? "realtor" : "client";
}

function withApiRolePayload<T extends { role?: string }>(payload: T): T {
  if (payload.role === undefined) return payload;
  return { ...payload, role: toApiRole(payload.role) };
}

function applyRegistrationRoleFromPayload(
  user: User,
  payload: ConfirmVerificationPayload,
): User {
  if (!payload.role) return user;
  const intended = normalizeUserRole(payload.role);
  if (intended === "picker" && user.role !== "picker") {
    return { ...user, role: "picker" };
  }
  return user;
}

/** Maps backend user shapes (numeric id, no `login`) into app `User`. */
export function mapApiUserToDomain(raw: unknown): User | null {
  if (!raw || typeof raw !== "object") return null;
  const u = raw as Record<string, unknown>;
  const email =
    typeof u.email === "string" && u.email.trim() ? u.email.trim() : "";
  const id =
    typeof u.id === "string"
      ? u.id.trim()
      : typeof u.id === "number" && Number.isFinite(u.id)
        ? String(u.id)
        : "";
  if (!id || !email) return null;
  const role = normalizeUserRole(pickRoleField(u));
  const login =
    typeof u.login === "string" && u.login.trim()
      ? u.login.trim()
      : email;
  const name =
    typeof u.name === "string" && u.name.trim()
      ? u.name.trim()
      : login;
  const phone =
    typeof u.phone === "string" && u.phone.trim() ? u.phone.trim() : undefined;
  return { id, login, role, name, email, phone };
}

/** Backend may return only tokens; then we hydrate the user via GET /me. */
function extractUserFromAuthPayload(res: unknown): User | null {
  if (!res || typeof res !== "object") return null;
  const u = (res as Record<string, unknown>).user;
  return mapApiUserToDomain(u);
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
  if (
    error instanceof ApiError &&
    (error.status === 400 || error.status === 422) &&
    typeof error.message === "string" &&
    error.message.trim().length > 0
  ) {
    return { code, message: error.message };
  }
  // 5xx: show backend message when present (helps debug server bugs; avoids generic "server_error" only).
  if (
    error instanceof ApiError &&
    error.status >= 500 &&
    typeof error.message === "string" &&
    error.message.trim().length > 0 &&
    error.message !== `HTTP ${error.status}`
  ) {
    return { code, message: error.message };
  }
  // Plain Error (e.g. success HTTP body without token / user) — show real message, not generic "unknown".
  // Exclude TypeError so network failures still use localized `network_error` copy.
  if (
    !(error instanceof ApiError) &&
    error instanceof Error &&
    !(error instanceof TypeError) &&
    typeof error.message === "string" &&
    error.message.trim().length > 0
  ) {
    return { code, message: error.message };
  }
  return { code, message: getDefaultAuthErrorMessage(code) };
}

export const authService = {
  requestVerification: async (
    payload: VerificationRequestPayload,
  ): Promise<VerificationRequestResponse | void> => {
    try {
      return await api.post<VerificationRequestResponse>(
        "/auth/request-verification",
        withApiRolePayload(payload),
      );
    } catch (error) {
      throw mapAuthError(error);
    }
  },

  confirmVerification: async (payload: ConfirmVerificationPayload): Promise<User> => {
    try {
      const res = await api.post<ApiAuthResponse>(
        "/auth/confirm-verification",
        withApiRolePayload(payload),
      );
      const accessToken = getAccessToken(res);
      if (!accessToken) {
        throw new Error("Confirm verification response did not contain access token.");
      }
      await tokenStorage.set(accessToken);
      const refreshToken = getRefreshToken(res);
      if (refreshToken) await refreshTokenStorage.set(refreshToken);
      const userFromPayload = extractUserFromAuthPayload(res);
      const user = userFromPayload ?? (await authService.me());
      return applyRegistrationRoleFromPayload(user, payload);
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
      const userFromPayload = extractUserFromAuthPayload(res);
      return userFromPayload ?? (await authService.me());
    } catch (error) {
      throw mapAuthError(error);
    }
  },

  register: async (data: RegisterPayload): Promise<User> => {
    try {
      const res = await api.post<ApiAuthResponse>("/auth/register", {
        ...data,
        role: toApiRole(data.role),
      });
      const accessToken = getAccessToken(res);
      if (!accessToken) {
        throw new Error("Auth response did not contain access token.");
      }
      await tokenStorage.set(accessToken);
      const refreshToken = getRefreshToken(res);
      if (refreshToken) await refreshTokenStorage.set(refreshToken);
      const userFromPayload = extractUserFromAuthPayload(res);
      return userFromPayload ?? (await authService.me());
    } catch (error) {
      throw mapAuthError(error);
    }
  },

  logout: async (): Promise<void> => {
    try {
      await api.post("/auth/logout", {});
    } catch {
      // Local session must clear even when POST /auth/logout fails (5xx, network, etc.).
    }
    await Promise.all([tokenStorage.clear(), refreshTokenStorage.clear()]);
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
      const raw = await api.get<unknown>("/me");
      const user = mapApiUserToDomain(raw);
      if (!user) {
        throw new Error("Profile response did not contain a valid user.");
      }
      return user;
    } catch (error) {
      throw mapAuthError(error);
    }
  },
};
