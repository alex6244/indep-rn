// src/contexts/AuthContext.tsx
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { mockUsers, type User } from "../data/users";
import { tokenStorage } from "../services/api";

interface AuthContextType {
  user: User | null;
  // Mock runtime contract (email-only) until backend auth is wired via authService.
  login: (email: string) => Promise<boolean>;
  register: (
    name: string,
    email: string,
    role: User["role"],
  ) => Promise<boolean>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
// Runtime mock auth switch. Backend login/register should go through authService later.
const IS_MOCK_AUTH = process.env.EXPO_PUBLIC_USE_MOCK_AUTH === "true" || __DEV__;

type UserLike = Partial<User> & { role?: unknown; id?: unknown; login?: unknown; email?: unknown };
type SessionUser = Pick<User, "id" | "login" | "name" | "phone" | "email" | "role">;

function isValidStoredUser(value: unknown): value is UserLike {
  if (!value || typeof value !== "object") {
    return false;
  }

  const user = value as UserLike;
  const hasId = typeof user.id === "string" && user.id.trim().length > 0;
  const hasRole = user.role === "client" || user.role === "picker";
  const hasLogin = typeof user.login === "string" && user.login.trim().length > 0;
  const hasEmail = typeof user.email === "string" && user.email.trim().length > 0;

  return hasId && hasRole && (hasLogin || hasEmail);
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([mockUsers.client, mockUsers.picker]);

  const USER_KEY = "user";

  const toSessionUser = (value: User): SessionUser => ({
    id: value.id,
    login: value.login,
    name: value.name,
    phone: value.phone,
    email: value.email,
    role: value.role,
  });

  const checkAuth = useCallback(async () => {
    // Temporary mock persistence: keep only minimal user session data in AsyncStorage.
    try {
      const userData = await AsyncStorage.getItem(USER_KEY);
      if (userData) {
        const parsed = JSON.parse(userData) as UserLike;
        if (isValidStoredUser(parsed)) {
          const fallback = users.find((u) => u.id === parsed.id);
          const restored: User = fallback ?? {
            id: parsed.id as string,
            login: (parsed.login as string) ?? (parsed.email as string),
            password: "",
            role: parsed.role as User["role"],
            name: (parsed.name as string) ?? "",
            phone: (parsed.phone as string) ?? "",
            email:
              (parsed.email as string | undefined) ??
              ((parsed.login as string | undefined) ?? ""),
          };
          setUser(restored);
        } else {
          await AsyncStorage.removeItem(USER_KEY);
          setUser(null);
        }
      }
    } catch {
      // Повреждённые данные — сбрасываем, пользователь останется разлогинен
      await AsyncStorage.removeItem(USER_KEY);
    }

    setLoading(false);
  }, [users]);

  const login = useCallback(
    async (email: string): Promise<boolean> => {
      if (!IS_MOCK_AUTH) {
        if (__DEV__) {
          console.log("[auth] login blocked: backend auth not connected");
        }
        return false;
      }

      return new Promise((resolve) => {
        setTimeout(async () => {
          const trimmedEmail = email.trim();
          if (!trimmedEmail) {
            if (__DEV__) {
              console.log("[auth] login: missing email");
            }
            resolve(false);
            return;
          }

          const found = users.find((u) => (u.email ?? "").trim() === trimmedEmail);

          if (found) {
            await AsyncStorage.setItem(
              USER_KEY,
              JSON.stringify(toSessionUser(found)),
            );
            setUser(found);
            if (__DEV__) {
              console.log("[auth] login success", { usersCount: users.length });
            }
            resolve(true);
          } else {
            if (__DEV__) {
              console.log("[auth] login fail: not found", { usersCount: users.length });
            }
            resolve(false);
          }
        }, 500);
      });
    },
    [users],
  );

  const register = useCallback(
    async (
      name: string,
      email: string,
      role: User["role"],
    ): Promise<boolean> => {
      if (!IS_MOCK_AUTH) {
        if (__DEV__) {
          console.log("[auth] register blocked: backend auth not connected");
        }
        return false;
      }

      return new Promise((resolve) => {
        setTimeout(async () => {
          const trimmedEmail = email.trim();
          if (!trimmedEmail) {
            resolve(false);
            return;
          }

          // Проверяем, что такой email ещё не зарегистрирован
          const exists = users.some((u) => (u.email ?? "") === trimmedEmail);

          if (exists) {
            if (__DEV__) {
              console.log("[auth] register: user already exists");
            }
            resolve(false);
            return;
          }

          const newUser: User = {
            id: Date.now().toString(),
            login: trimmedEmail, // login для совместимости
            password: "123", // фикс для мок-логики, сейчас не используется формой
            name,
            phone: "", // phone больше не запрашивается регистрацией
            email: trimmedEmail,
            role,
          };

          const updated = [...users, newUser];
          setUsers(updated);
          await AsyncStorage.setItem(
            USER_KEY,
            JSON.stringify(toSessionUser(newUser)),
          );
          setUser(newUser);
          if (__DEV__) {
            console.log("[auth] register success", { usersCount: updated.length });
          }
          resolve(true);
        }, 1000);
      });
    },
    [users],
  );

  const logout = useCallback(async () => {
    await Promise.all([AsyncStorage.removeItem(USER_KEY), tokenStorage.clear()]);
    setUser(null);
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
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
