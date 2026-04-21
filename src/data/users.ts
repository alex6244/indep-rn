import type { User } from "../types/user";

export type { UserRole, User } from "../types/user";

export type MockUserRecord = User & { password: string };

// Dev-only mock credentials used only when EXPO_PUBLIC_AUTH_SOURCE=mock.
const MOCK_PASSWORDS = {
  client: "client123",
  picker: "picker123",
} as const;

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
  return {
    client: { ...mockUserProfiles.client, password: MOCK_PASSWORDS.client },
    picker: { ...mockUserProfiles.picker, password: MOCK_PASSWORDS.picker },
  };
}

