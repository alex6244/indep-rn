import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getMockUsers } from "../data/users";
import type { User } from "../types/user";
import { setRefreshHandler, setUnauthorizedHandler, tokenStorage, refreshTokenStorage } from "../services/api";
import { authService } from "../services/authService";
import {
  type AuthCredentials,
  type AuthError,
  AuthFlowError,
  type AuthErrorCode,
  getDefaultAuthErrorMessage,
  type RegisterPayload,
} from "../services/authTypes";
import { reportTelemetry } from "../shared/monitoring/errorReporting";

type AuthSource = "mock" | "api";

export type AuthResult =
  | { success: true }
  | { success: false; error: AuthError };

type AuthContextType = {
  user: User | null;
  login: (credentials: AuthCredentials) => Promise<AuthResult>;
  register: (payload: RegisterPayload) => Promise<AuthResult>;
  logout: () => Promise<void>;
  authError: AuthError | null;
  loading: boolean;
};

type AuthGateway = {
  checkAuth: () => Promise<User | null>;
  login: (credentials: AuthCredentials) => Promise<User>;
  register: (payload: RegisterPayload) => Promise<User>;
  logout: () => Promise<void>;
};

const USER_KEY = "@auth/user";
const DEFAULT_MOCK_TOKEN_TTL_MS = 24 * 60 * 60 * 1000;
const AuthContext = createContext<AuthContextType | undefined>(undefined);

function resolveAuthSource(): AuthSource {
  const fromEnv = process.env.EXPO_PUBLIC_AUTH_SOURCE?.trim().toLowerCase();
  if (!fromEnv || fromEnv === "api") return "api";
  if (fromEnv === "mock") return "mock";
  reportTelemetry("invalid_env_source", {
    source: "auth",
    key: "EXPO_PUBLIC_AUTH_SOURCE",
    value: fromEnv,
    fallback: "api",
  });
  if (__DEV__) {
    console.warn(
      `[auth] Invalid EXPO_PUBLIC_AUTH_SOURCE="${fromEnv}". Falling back to "api".`,
    );
  }
  return "api";
}

function getMockTokenTtlMs(): number {
  const raw = process.env.EXPO_PUBLIC_MOCK_TOKEN_TTL_MS?.trim();
  if (!raw) return DEFAULT_MOCK_TOKEN_TTL_MS;
  const parsed = Number(raw);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_MOCK_TOKEN_TTL_MS;
}

function normalizeAuthError(error: unknown): AuthError {
  const fallback = (code: AuthErrorCode): AuthError => ({
    code,
    message: getDefaultAuthErrorMessage(code),
  });

  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof (error as { code?: unknown }).code === "string"
  ) {
    const code = (error as { code: AuthErrorCode }).code;
    const message = (error as { message?: unknown }).message;
    return {
      code,
      message:
        typeof message === "string" && message.trim().length > 0
          ? message
          : getDefaultAuthErrorMessage(code),
    };
  }
  if (error instanceof AuthFlowError) {
    return {
      code: error.code,
      message: error.message || getDefaultAuthErrorMessage(error.code),
    };
  }
  return fallback("unknown");
}

async function persistSessionUser(user: User): Promise<void> {
  await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
}

function isValidUser(obj: unknown): obj is User {
  if (!obj || typeof obj !== "object") return false;
  const u = obj as Record<string, unknown>;
  return (
    typeof u.id === "string" &&
    typeof u.login === "string" &&
    typeof u.name === "string" &&
    typeof u.email === "string" &&
    (u.role === "client" || u.role === "picker")
  );
}

async function readSessionUser(): Promise<User | null> {
  try {
    const raw = await AsyncStorage.getItem(USER_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (!isValidUser(parsed)) {
      await AsyncStorage.removeItem(USER_KEY);
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

function parseMockToken(token: string | null): { userId: string; issuedAt: number } | null {
  if (!token) return null;
  const match = /^mock_(.+)_(\d+)$/.exec(token);
  if (!match) return null;
  const issuedAt = Number(match[2]);
  if (!Number.isFinite(issuedAt) || issuedAt <= 0) return null;
  const ageMs = Date.now() - issuedAt;
  if (ageMs > getMockTokenTtlMs()) return null;
  return { userId: match[1], issuedAt };
}

function createMockAuthGateway(): AuthGateway {
  return {
    checkAuth: async () => {
      const token = await tokenStorage.get();
      const parsedToken = parseMockToken(token);
      if (!parsedToken) {
        if (token) await Promise.all([tokenStorage.clear(), AsyncStorage.removeItem(USER_KEY)]);
        return null;
      }

      const sessionUser = await readSessionUser();
      if (!sessionUser || sessionUser.id !== parsedToken.userId) {
        await Promise.all([tokenStorage.clear(), AsyncStorage.removeItem(USER_KEY)]);
        return null;
      }
      return sessionUser;
    },
    login: async (credentials) => {
      const mockUsers = getMockUsers();
      const trimmedEmail = credentials.email.trim();
      const found = [mockUsers.client, mockUsers.picker].find(
        (u) =>
          (u.email ?? "").trim().toLowerCase() === trimmedEmail.toLowerCase() &&
          u.password === credentials.password,
      );
      if (!found) {
        throw new AuthFlowError("invalid_credentials");
      }
      await tokenStorage.set(`mock_${found.id}_${Date.now()}`);
      const { password: _pw, ...sessionUser } = found;
      await persistSessionUser(sessionUser);
      return sessionUser;
    },
    register: async (payload) => {
      const mockUsers = getMockUsers();
      const trimmedEmail = payload.email.trim();
      const exists = [mockUsers.client, mockUsers.picker].some(
        (u) => (u.email ?? "").trim().toLowerCase() === trimmedEmail.toLowerCase(),
      );
      if (exists) {
        throw new AuthFlowError("user_exists");
      }
      const newUser: User = {
        id: Date.now().toString(),
        login: trimmedEmail,
        role: payload.role,
        name: payload.name,
        phone: "",
        email: trimmedEmail,
      };
      await tokenStorage.set(`mock_${newUser.id}_${Date.now()}`);
      await persistSessionUser(newUser);
      return newUser;
    },
    logout: async () => {
      await AsyncStorage.removeItem(USER_KEY);
      await tokenStorage.clear();
      await refreshTokenStorage.clear();
    },
  };
}

function createApiAuthGateway(): AuthGateway {
  return {
    checkAuth: async () => {
      const token = await tokenStorage.get();
      if (!token) return null;
      try {
        const me = await authService.me();
        await persistSessionUser(me);
        return me;
      } catch (error) {
        const code = normalizeAuthError(error).code;
        if (code === "invalid_credentials" || code === "unknown") {
          await Promise.all([tokenStorage.clear(), AsyncStorage.removeItem(USER_KEY)]);
        }
        return null;
      }
    },
    login: async (credentials) => {
      const user = await authService.login(credentials);
      await persistSessionUser(user);
      return user;
    },
    register: async (payload) => {
      const user = await authService.register(payload);
      await persistSessionUser(user);
      return user;
    },
    logout: async () => {
      await authService.logout();
      await AsyncStorage.removeItem(USER_KEY);
    },
  };
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<AuthError | null>(null);

  const gateway = useMemo<AuthGateway>(() => {
    const source = resolveAuthSource();
    return source === "mock" ? createMockAuthGateway() : createApiAuthGateway();
  }, []);

  useEffect(() => {
    let active = true;
    void (async () => {
      const restored = await gateway.checkAuth();
      if (!active) return;
      setUser(restored);
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, [gateway]);

  useEffect(() => {
    setUnauthorizedHandler(async () => {
      await refreshTokenStorage.clear();
      await AsyncStorage.removeItem(USER_KEY);
      setUser(null);
    });
    return () => {
      setUnauthorizedHandler(null);
    };
  }, []);

  useEffect(() => {
    const source = resolveAuthSource();
    if (source === "api") {
      setRefreshHandler(authService.refresh);
    }
    return () => {
      setRefreshHandler(null);
    };
  }, []);

  const login: AuthContextType["login"] = async (credentials) => {
    try {
      const sessionUser = await gateway.login(credentials);
      setUser(sessionUser);
      setAuthError(null);
      return { success: true };
    } catch (error) {
      const normalized = normalizeAuthError(error);
      setAuthError(normalized);
      return { success: false, error: normalized };
    }
  };

  const register: AuthContextType["register"] = async (payload) => {
    try {
      const sessionUser = await gateway.register(payload);
      setUser(sessionUser);
      setAuthError(null);
      return { success: true };
    } catch (error) {
      const normalized = normalizeAuthError(error);
      setAuthError(normalized);
      return { success: false, error: normalized };
    }
  };

  const logout: AuthContextType["logout"] = async () => {
    await gateway.logout();
    setUser(null);
    setAuthError(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, authError, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
