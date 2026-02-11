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
    <div style={{ width: "280px", padding: "12px" }}>
      {/* User info */}
      <div
        style={{
          marginBottom: "12px",
          borderRadius: "var(--radius-md)",
          border: "1px solid var(--border-subtle)",
          background: "var(--surface-interactive)",
          padding: "12px",
        }}
      >
        <div style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--ink)" }}>
          {user?.username ?? "Guest"}
        </div>
        <div style={{ fontSize: "0.8rem", color: "var(--slate)" }}>
          {user?.email ?? "Not signed in"}
        </div>
        {user?.role && (
          <span className="badge badge-brand" style={{ marginTop: "8px" }}>
            role: {user.role}
          </span>
        )}
      </div>

      {/* Actions */}
      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        {user ? (
          <>
            <Link href="/account" className="dropdown-item">
              My account
            </Link>
            <Link href="/account?tab=orders" className="dropdown-item">
              Orders
            </Link>
            {isAdmin && (
              <Link href="/account?tab=dashboard" className="dropdown-item">
                Admin dashboard
              </Link>
            )}
            <div className="dropdown-divider" />
            <button type="button" onClick={onLogout} className="dropdown-item" style={{ color: "#ef4444" }}>
              Logout
            </button>
          </>
        ) : (
          <Link href="/account" className="dropdown-item">
            Login / Register
          </Link>
        )}
      </div>
    </div>
  );
}