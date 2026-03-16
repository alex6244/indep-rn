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
  login: (login: string, password: string) => Promise<boolean>;
  register: (name: string, phone: string, role: User["role"]) => Promise<boolean>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // ✅ useCallback для стабильности функций
  const checkAuth = useCallback(async () => {
    try {
      const userData = await AsyncStorage.getItem("user");
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.log("Auth check error:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(
    async (login: string, password: string): Promise<boolean> => {
      return new Promise((resolve) => {
        setTimeout(() => {
          if (
            login === mockUsers.client.login &&
            password === mockUsers.client.password
          ) {
            const userData = mockUsers.client;
            AsyncStorage.setItem("user", JSON.stringify(userData));
            setUser(userData); // ✅ Теперь работает!
            resolve(true);
          } else if (
            login === mockUsers.picker.login &&
            password === mockUsers.picker.password
          ) {
            const userData = mockUsers.picker;
            AsyncStorage.setItem("user", JSON.stringify(userData));
            setUser(userData);
            resolve(true);
          } else {
            resolve(false);
          }
        }, 1000);
      });
    },
    [],
  );

  // ✅ register ПЕРЕМЕЩЕН ВНУТРЬ!
  const register = useCallback(
    async (name: string, phone: string, role: User["role"]): Promise<boolean> => {
      return new Promise((resolve) => {
        setTimeout(() => {
          const newUser: User = {
            id: Date.now().toString(),
            login: phone, // Телефон = логин
            password: "123", // Фикс для теста
            name,
            phone,
            role,
          };

          AsyncStorage.setItem("user", JSON.stringify(newUser));
          setUser(newUser);
          resolve(true);
        }, 1000);
      });
    },
    [],
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
