"use client";

import { useState, useEffect } from "react";

export type StoredUser = {
  id: string;
  email: string;
  username: string;
  role: string;
} | null;

// Get current user from API
export async function getCurrentUser(): Promise<StoredUser> {
  try {
    const response = await fetch("/api/auth/me");
    const data = await response.json();
    return data.user || null;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
}

// Alias for compatibility
export async function readUser(): Promise<StoredUser> {
  return getCurrentUser();
}

// Sign out
export async function signOut(): Promise<void> {
  try {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/";
  } catch (error) {
    console.error("Error signing out:", error);
  }
}

// Hook to listen for auth changes
export function onAuthChanged(callback: (user: StoredUser) => void) {
  // Initial load
  getCurrentUser().then(callback);

  // Return cleanup function
  return () => {};
}

// React hook for auth state
export function useAuth() {
  const [user, setUser] = useState<StoredUser>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCurrentUser().then((user) => {
      setUser(user);
      setLoading(false);
    });
  }, []);

  return { user, loading, signOut };
}
