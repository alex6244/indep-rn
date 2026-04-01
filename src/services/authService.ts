import { api, tokenStorage } from "./api";
import type { User, UserRole } from "../data/users";

interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

interface AuthResponse {
  token: string;
  user: User;
}

export const authService = {
  login: async (data: LoginRequest): Promise<User> => {
    const res = await api.post<AuthResponse>("/auth/login", data);
    await tokenStorage.set(res.token);
    return res.user;
  },

  register: async (data: RegisterRequest): Promise<User> => {
    const res = await api.post<AuthResponse>("/auth/register", data);
    await tokenStorage.set(res.token);
    return res.user;
  },

  logout: async (): Promise<void> => {
    try {
      await api.post("/auth/logout", {});
    } finally {
      await tokenStorage.clear();
    }
  },

  me: (): Promise<User> => api.get<User>("/auth/me"),
};
