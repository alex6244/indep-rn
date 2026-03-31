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

interface AuthContextType {
  user: User | null;
  // Унифицированные поля формы: имя + телефон + почта
  login: (name: string, phone: string, email: string) => Promise<boolean>;
  register: (
    name: string,
    email: string,
    role: User["role"],
  ) => Promise<boolean>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type UserLike = Partial<User> & { role?: unknown; id?: unknown; login?: unknown; email?: unknown };

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
  // Локальное хранилище мок-пользователей
  const [users, setUsers] = useState<User[]>([]);

  const USERS_KEY = "users";
  const USER_KEY = "user";

  const checkAuth = useCallback(async () => {
    // Восстанавливаем текущего пользователя
    try {
      const userData = await AsyncStorage.getItem(USER_KEY);
      if (userData) {
        const parsed = JSON.parse(userData);
        if (isValidStoredUser(parsed)) {
          setUser(parsed as User);
        } else {
          await AsyncStorage.removeItem(USER_KEY);
          setUser(null);
        }
      }
    } catch {
      // Повреждённые данные — сбрасываем, пользователь останется разлогинен
      await AsyncStorage.removeItem(USER_KEY);
    }

    // Восстанавливаем список пользователей
    try {
      const storedUsers = await AsyncStorage.getItem(USERS_KEY);
      if (storedUsers) {
        const parsed: User[] = JSON.parse(storedUsers);
        setUsers(parsed);
      } else {
        // Если в хранилище пусто — инициализируем mockUsers и сохраняем
        const initial = [mockUsers.client, mockUsers.picker];
        setUsers(initial);
        await AsyncStorage.setItem(USERS_KEY, JSON.stringify(initial));
      }
    } catch {
      // Повреждённые данные — сбрасываем и инициализируем заново
      const initial = [mockUsers.client, mockUsers.picker];
      setUsers(initial);
      await AsyncStorage.setItem(USERS_KEY, JSON.stringify(initial));
    }

    setLoading(false);
  }, []);

  const login = useCallback(
    async (_name: string, _phone: string, email: string): Promise<boolean> => {
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
            await AsyncStorage.setItem(USER_KEY, JSON.stringify(found));
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
          await AsyncStorage.setItem(USERS_KEY, JSON.stringify(updated));
          await AsyncStorage.setItem(USER_KEY, JSON.stringify(newUser));
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
    await AsyncStorage.removeItem(USER_KEY);
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
