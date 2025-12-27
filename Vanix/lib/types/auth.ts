export type UserRole = "client" | "admin";

export type StoredUser = {
  id: string;
  email: string | null;
  name: string | null; // твоето поле (мапваме от users.username)
  role: UserRole;
};
