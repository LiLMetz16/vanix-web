"use client";

import Link from "next/link";
import type { StoredUser } from "@/lib/types/auth";

type Props = {
  user: StoredUser | null;
  onLogout: () => void;
};

export function AccountDropdownContent({ user, onLogout }: Props) {
  const isAdmin = user?.role === "admin";

  return (
    <div className="w-72 p-3">
      <div className="mb-3 rounded-xl border border-black/10 bg-white/70 p-3">
        <div className="text-sm font-semibold">{user?.name ?? "Guest"}</div>
        <div className="text-xs opacity-70">{user?.email ?? "Not signed in"}</div>
        {user?.role && (
          <div className="mt-2 inline-flex rounded-full border border-black/10 bg-white/60 px-2 py-1 text-xs">
            role: {user.role}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2">
        {user ? (
          <>
            <Link className="rounded-xl border border-black/10 bg-white/60 px-3 py-2 text-sm hover:bg-white" href="/account">
              My account
            </Link>

            <Link className="rounded-xl border border-black/10 bg-white/60 px-3 py-2 text-sm hover:bg-white" href="/account?tab=orders">
              Orders
            </Link>

            {isAdmin && (
              <Link className="rounded-xl border border-black/10 bg-white/60 px-3 py-2 text-sm hover:bg-white" href="/account?tab=dashboard">
                Admin dashboard
              </Link>
            )}

            <button
              type="button"
              onClick={onLogout}
              className="rounded-xl border border-black/10 bg-white/60 px-3 py-2 text-left text-sm hover:bg-white"
            >
              Logout
            </button>
          </>
        ) : (
          <Link className="rounded-xl border border-black/10 bg-white/60 px-3 py-2 text-sm hover:bg-white" href="/account">
            Login / Register
          </Link>
        )}
      </div>
    </div>
  );
}
