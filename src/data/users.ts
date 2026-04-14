export type UserRole = "client" | "picker";

export interface User {
  id: string;
  login: string;
  role: UserRole;
  name: string;
  phone?: string;
  email: string;
}

// Passwords are stored in .env.local (EXPO_PUBLIC_MOCK_*_PASSWORD), never in source.
export type MockUserRecord = User & { password: string };

function getMockPasswords(): { client: string; picker: string } {
  return {
    client: process.env.EXPO_PUBLIC_MOCK_CLIENT_PASSWORD ?? "",
    picker: process.env.EXPO_PUBLIC_MOCK_PICKER_PASSWORD ?? "",
  };
}

const mockUserProfiles: { client: User; picker: User } = {
  client: {
    id: "client_1",
    login: "client@test.com",
    role: "client",
    name: "Аркадий Паровозов",
    phone: "+7 995 185 88 90",
    email: "client@test.com",
  },
  picker: {
    id: "picker_1",
    login: "picker@test.com",
    role: "picker",
    name: "Иван Подборщик",
    phone: "+7 999 123 45 67",
    email: "picker@test.com",
  },
};

export function getMockUsers(): { client: MockUserRecord; picker: MockUserRecord } {
  const passwords = getMockPasswords();
  return {
    client: { ...mockUserProfiles.client, password: passwords.client },
    picker: { ...mockUserProfiles.picker, password: passwords.picker },
  };
}

