export type UserRole = "client" | "picker";

export interface User {
  id: string;
  login: string;
  role: UserRole;
  name: string;
  phone?: string;
  email: string;
}
