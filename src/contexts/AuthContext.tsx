import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { mockUsers, type User } from "../data/users";
import { setRefreshHandler, setUnauthorizedHandler, tokenStorage, refreshTokenStorage } from "../services/api";
import { authService } from "../services/authService";
import {
  type AuthCredentials,
  AuthFlowError,
  type AuthErrorCode,
  type RegisterPayload,
} from "../services/authTypes";

type AuthSource = "mock" | "api";

type AuthContextType = {
  user: User | null;
  login: (credentials: AuthCredentials) => Promise<boolean>;
  register: (payload: RegisterPayload) => Promise<boolean>;
  logout: () => Promise<void>;
  loading: boolean;
  authError: AuthErrorCode | null;
};

type AuthGateway = {
  checkAuth: () => Promise<User | null>;
  login: (credentials: AuthCredentials) => Promise<User>;
  register: (payload: RegisterPayload) => Promise<User>;
  logout: () => Promise<void>;
};

const USER_KEY = "@auth/user";
const AuthContext = createContext<AuthContextType | undefined>(undefined);

function resolveAuthSource(): AuthSource {
  const fromEnv = process.env.EXPO_PUBLIC_AUTH_SOURCE?.trim().toLowerCase();
  return fromEnv === "mock" ? "mock" : "api";
}

function normalizeAuthErrorCode(error: unknown): AuthErrorCode {
  if (error instanceof AuthFlowError) {
    return error.code;
  }
  return "unknown";
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

function createMockAuthGateway(): AuthGateway {
  return {
    checkAuth: async () => readSessionUser(),
    login: async (credentials) => {
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
        const code = normalizeAuthErrorCode(error);
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
  const [authError, setAuthError] = useState<AuthErrorCode | null>(null);

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
    setAuthError(null);
    try {
      const sessionUser = await gateway.login(credentials);
      setUser(sessionUser);
      return true;
    } catch (error) {
      setAuthError(normalizeAuthErrorCode(error));
      return false;
    }
  };

  const register: AuthContextType["register"] = async (payload) => {
    setAuthError(null);
    try {
      const sessionUser = await gateway.register(payload);
      setUser(sessionUser);
      return true;
    } catch (error) {
      setAuthError(normalizeAuthErrorCode(error));
      return false;
    }
  };

  const logout: AuthContextType["logout"] = async () => {
    setAuthError(null);
    await gateway.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, authError }}>
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
