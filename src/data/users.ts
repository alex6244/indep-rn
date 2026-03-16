export type UserRole = "client" | "picker";

export interface User {
  id: string;
  login: string;
  password: string;
  role: UserRole;
  name: string;
  phone: string;
}

export const mockUsers: { client: User; picker: User } = {
  client: {
    id: "client_1",
    login: "client@test.com",
    password: "client123",
    role: "client",
    name: "Аркадий Паровозов",
    phone: "+7 995 185 88 90",
  },
  picker: {
    id: "picker_1",
    login: "picker@test.com",
    password: "picker123",
    role: "picker",
    name: "Иван Подборщик",
    phone: "+7 999 123 45 67",
  },
};

