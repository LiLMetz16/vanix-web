import { readUser } from "@/lib/authClient";

export async function routeAfterAuth(): Promise<string> {
  const user = await readUser();
  if (!user) return "/account";
  return "/account";
}
