export type UserRole = "user" | "admin";

export type StoredUser = {
  id: string;
  email: string;
  username: string;
  role: UserRole;
};
