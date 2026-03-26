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
import { normalizePhone } from "../shared/utils/phone";

interface AuthContextType {
  user: User | null;
  // Унифицированные поля формы: имя + телефон + почта
  login: (name: string, phone: string, email: string) => Promise<boolean>;
  register: (
    name: string,
    phone: string,
    email: string,
    role: User["role"],
  ) => Promise<boolean>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

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
        setUser(JSON.parse(userData));
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
    async (name: string, phone: string, email: string): Promise<boolean> => {
      return new Promise((resolve) => {
        setTimeout(() => {
          const normalizedPhone = normalizePhone(phone);
          if (!normalizedPhone) {
            if (__DEV__) {
              console.log("[auth] login: invalid phone after normalize", {
                raw: phone,
              });
            }
            resolve(false);
            return;
          }

          const found = users.find(
            (u) => u.phone === normalizedPhone && u.email === email,
          );

          if (found) {
            AsyncStorage.setItem(USER_KEY, JSON.stringify(found));
            setUser(found);
            if (__DEV__) {
              console.log("[auth] login success", {
                phone: normalizedPhone,
                email,
              });
            }
            resolve(true);
          } else {
            if (__DEV__) {
              console.log("[auth] login fail: not found", {
                phone: normalizedPhone,
                email,
                usersCount: users.length,
              });
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
      phone: string,
      email: string,
      role: User["role"],
    ): Promise<boolean> => {
      return new Promise((resolve) => {
        setTimeout(() => {
          const normalizedPhone = normalizePhone(phone);
          if (!normalizedPhone) {
            if (__DEV__) {
              console.log("[auth] register: invalid phone after normalize", {
                raw: phone,
              });
            }
            resolve(false);
            return;
          }

          // Проверяем, что такого телефона или почты ещё нет
          const exists = users.some(
            (u) => u.phone === normalizedPhone || u.email === email,
          );

          if (exists) {
            if (__DEV__) {
              console.log("[auth] register: user already exists", {
                phone: normalizedPhone,
                email,
              });
            }
            resolve(false);
            return;
          }

          const newUser: User = {
            id: Date.now().toString(),
            login: email || phone, // login для совместимости
            password: "123", // фикс для мок-логики, сейчас не используется формой
            name,
            phone: normalizedPhone,
            email,
            role,
          };

          const updated = [...users, newUser];
          setUsers(updated);
          AsyncStorage.setItem(USERS_KEY, JSON.stringify(updated));
          AsyncStorage.setItem(USER_KEY, JSON.stringify(newUser));
          setUser(newUser);
          if (__DEV__) {
            console.log("[auth] register success", {
              phone: normalizedPhone,
              email,
              usersCount: updated.length,
            });
          }
          resolve(true);
        }, 1000);
      });
    },
    [users],
  );

  const logout = useCallback(async () => {
    await AsyncStorage.removeItem("user");
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
