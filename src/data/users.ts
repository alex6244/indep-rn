export type UserRole = "client" | "picker";

export interface User {
  id: string;
  login: string;
  role: UserRole;
  name: string;
  phone?: string;
  email: string;
}

type MockUserRecord = User & { password: string };

export const mockUsers: { client: MockUserRecord; picker: MockUserRecord } = {
  client: {
    id: "client_1",
    login: "client@test.com",
    password: "client123",
    role: "client",
    name: "Аркадий Паровозов",
    phone: "+7 995 185 88 90",
    email: "client@test.com",
  },
  picker: {
    id: "picker_1",
    login: "picker@test.com",
    password: "picker123",
    role: "picker",
    name: "Иван Подборщик",
    phone: "+7 999 123 45 67",
    email: "picker@test.com",
  },
};

