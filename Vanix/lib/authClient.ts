"use client";

import { supabase } from "@/lib/supabaseClient";
import type { StoredUser, UserRole } from "@/lib/types/auth";

export async function readUser(): Promise<StoredUser | null> {
  const { data: authData } = await supabase.auth.getUser();
  const u = authData.user;
  if (!u) return null;

  const { data: row } = await supabase
    .from("users")
    .select("email, username, role")
    .eq("id", u.id)
    .single();

  const role = ((row?.role as UserRole) ?? "client");

  return {
    id: u.id,
    email: row?.email ?? u.email ?? null,
    name: row?.username ?? null,
    role,
  };
}

export function onAuthChanged(cb: (user: StoredUser | null) => void) {
  readUser().then(cb).catch(() => cb(null));

  const { data: sub } = supabase.auth.onAuthStateChange(async () => {
    try {
      cb(await readUser());
    } catch {
      cb(null);
    }
  });

  return () => sub.subscription.unsubscribe();
}

export async function signOut(): Promise<void> {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}
