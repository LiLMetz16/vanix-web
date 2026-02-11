"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { readUser, signOut, onAuthChanged } from "@/lib/authClient";
import type { StoredUser } from "@/lib/types/auth";

type Tab = "profile" | "orders" | "dashboard";
type AuthMode = "login" | "register";

type Order = {
  id: string;
  items: any;
  totalEUR: number;
  status: string;
  createdAt: string;
};

type DashboardStats = {
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  recentOrders: Order[];
};

export default function AccountClient() {
  const router = useRouter();
  const sp = useSearchParams();

  const [user, setUser] = useState<StoredUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>("profile");

  // Auth form (when not logged in)
  const [mode, setMode] = useState<AuthMode>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailVisible, setEmailVisible] = useState(true);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // Profile editing
  const [editMode, setEditMode] = useState(false);
  const [editUsername, setEditUsername] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [updateError, setUpdateError] = useState("");
  const [updateSuccess, setUpdateSuccess] = useState("");

  // Orders
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  // Dashboard (admin only)
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(false);

  /* ── Load user on mount ── */
  useEffect(() => {
    async function init() {
      const u = await readUser();
      setUser(u ? { ...u, role: u.role as StoredUser["role"] } : null);
      if (u) {
        setEditUsername(u.username ?? "");
        setEditEmail(u.email ?? "");
      }
      setLoading(false);
    }
    init();

    const unsub = onAuthChanged((u) => {
      setUser(u ? { ...u, role: u.role as StoredUser["role"] } : null);
      if (u) {
        setEditUsername(u.username ?? "");
        setEditEmail(u.email ?? "");
      }
    });
    return () => unsub();
  }, []);

  /* ── Tab from URL ── */
  useEffect(() => {
    const tabParam = sp.get("tab");
    if (tabParam === "orders" || tabParam === "dashboard") {
      setActiveTab(tabParam as Tab);
    }
  }, [sp]);

  /* ── Load tab data ── */
  useEffect(() => {
    if (!user) return;
    if (activeTab === "orders") loadOrders();
    else if (activeTab === "dashboard" && user.role === "admin") loadDashboard();
  }, [activeTab, user]);

  /* ── Auth handlers ── */
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErr(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");

      // authClient should pick up the cookie / localStorage change
      const u = await readUser();
      setUser(u ? { ...u, role: u.role as StoredUser["role"] } : null);
      if (u) {
        setEditUsername(u.username ?? "");
        setEditEmail(u.email ?? "");
      }
    } catch (e: any) {
      setErr(e?.message ?? "Login failed.");
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErr(null);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed");

      const u = await readUser();
      setUser(u ? { ...u, role: u.role as StoredUser["role"] } : null);
      if (u) {
        setEditUsername(u.username ?? "");
        setEditEmail(u.email ?? "");
      }
    } catch (e: any) {
      setErr(e?.message ?? "Registration failed.");
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    await signOut();
    setUser(null);
  }

  /* ── Profile update ── */
  async function handleUpdateProfile(e: React.FormEvent) {
    e.preventDefault();
    setUpdateError("");
    setUpdateSuccess("");
    try {
      const res = await fetch("/api/auth/update-profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: editUsername, email: editEmail }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update profile");
      setUpdateSuccess("Profile updated successfully!");
      setEditMode(false);
      const u = await readUser();
      setUser(u ? { ...u, role: u.role as StoredUser["role"] } : null);
    } catch (error: any) {
      setUpdateError(error.message);
    }
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setUpdateError("");
    setUpdateSuccess("");
    if (newPassword !== confirmPassword) {
      setUpdateError("New passwords don't match");
      return;
    }
    if (newPassword.length < 6) {
      setUpdateError("Password must be at least 6 characters");
      return;
    }
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to change password");
      setUpdateSuccess("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      setUpdateError(error.message);
    }
  }

  /* ── Orders ── */
  async function loadOrders() {
    setOrdersLoading(true);
    try {
      const res = await fetch("/api/orders");
      const data = await res.json();
      setOrders(data.orders || []);
    } catch (error) {
      console.error("Error loading orders:", error);
    } finally {
      setOrdersLoading(false);
    }
  }

  /* ── Dashboard ── */
  async function loadDashboard() {
    if (user?.role !== "admin") return;
    setStatsLoading(true);
    try {
      const res = await fetch("/api/admin/dashboard");
      const data = await res.json();
      setStats(data);
    } catch (error) {
      console.error("Error loading dashboard:", error);
    } finally {
      setStatsLoading(false);
    }
  }

  /* ═══════════════════════════════════════════
     RENDER — Loading
     ═══════════════════════════════════════════ */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-label" style={{ fontSize: "1.1rem" }}>Loading…</div>
      </div>
    );
  }

  /* ═══════════════════════════════════════════
     RENDER — Not logged in (Login / Register)
     ═══════════════════════════════════════════ */
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="w-full max-w-md">
          <div className="card" style={{ padding: "32px" }}>
            <h1
              className="heading-display"
              style={{ fontSize: "1.75rem", marginBottom: "24px", textAlign: "center" }}
            >
              Welcome to <span className="accent">Vanix</span>
            </h1>

            {/* Login / Register toggle */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "4px",
                borderRadius: "var(--radius-lg)",
                border: "1.5px solid var(--border-default)",
                background: "var(--surface-secondary)",
                padding: "4px",
                marginBottom: "24px",
              }}
            >
              <button
                type="button"
                onClick={() => { setMode("login"); setErr(null); }}
                className={mode === "login" ? "btn btn-primary btn-sm" : "btn btn-ghost btn-sm"}
                style={{ borderRadius: "var(--radius-md)" }}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => { setMode("register"); setErr(null); }}
                className={mode === "register" ? "btn btn-primary btn-sm" : "btn btn-ghost btn-sm"}
                style={{ borderRadius: "var(--radius-md)" }}
              >
                Register
              </button>
            </div>

            <form
              onSubmit={mode === "login" ? handleLogin : handleRegister}
              style={{ display: "flex", flexDirection: "column", gap: "16px" }}
            >
              {mode === "register" && (
                <div>
                  <label className="text-label" style={{ marginBottom: "6px", display: "block" }}>
                    Username
                  </label>
                  <input
                    className="input-field"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your username"
                    required
                  />
                </div>
              )}

              <div>
                <label className="text-label" style={{ marginBottom: "6px", display: "block" }}>
                  Email
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    className="input-field"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    type={emailVisible ? "text" : "password"}
                    required
                    style={{ paddingRight: "52px" }}
                  />
                  <button
                    type="button"
                    onClick={() => setEmailVisible((v) => !v)}
                    style={{
                      position: "absolute",
                      right: "8px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "var(--surface-interactive)",
                      border: "1px solid var(--border-default)",
                      borderRadius: "var(--radius-sm)",
                      padding: "4px 8px",
                      cursor: "pointer",
                      fontSize: "0.85rem",
                    }}
                  >
                    {emailVisible ? "👁️" : "🙈"}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-label" style={{ marginBottom: "6px", display: "block" }}>
                  Password
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    className="input-field"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    type={passwordVisible ? "text" : "password"}
                    required
                    style={{ paddingRight: "52px" }}
                  />
                  <button
                    type="button"
                    onClick={() => setPasswordVisible((v) => !v)}
                    style={{
                      position: "absolute",
                      right: "8px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "var(--surface-interactive)",
                      border: "1px solid var(--border-default)",
                      borderRadius: "var(--radius-sm)",
                      padding: "4px 8px",
                      cursor: "pointer",
                      fontSize: "0.85rem",
                    }}
                  >
                    {passwordVisible ? "👁️" : "🙈"}
                  </button>
                </div>
              </div>

              {err && (
                <div
                  style={{
                    background: "rgba(239,68,68,0.08)",
                    border: "1px solid rgba(239,68,68,0.3)",
                    borderRadius: "var(--radius-md)",
                    padding: "12px 16px",
                    fontSize: "0.9rem",
                    color: "#dc2626",
                  }}
                >
                  {err}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary"
                style={{ width: "100%", marginTop: "8px" }}
              >
                {loading ? "Please wait…" : mode === "login" ? "Login" : "Create Account"}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  /* ═══════════════════════════════════════════
     RENDER — Logged in (Account page)
     ═══════════════════════════════════════════ */
  return (
    <div style={{ minHeight: "100vh", padding: "40px 24px" }}>
      <div style={{ maxWidth: "960px", margin: "0 auto" }}>
        {/* Header */}
        <div className="card" style={{ padding: "28px 32px", marginBottom: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
            <div>
              <h1 className="heading-display" style={{ fontSize: "1.75rem" }}>My Account</h1>
              <p className="text-body" style={{ marginTop: "4px" }}>
                Welcome back,{" "}
                <span style={{ fontWeight: 600, color: "var(--ink)" }}>
                  {user.username ?? user.username ?? "User"}
                </span>
                {user.role === "admin" && (
                  <span className="badge badge-brand" style={{ marginLeft: "10px" }}>
                    Admin
                  </span>
                )}
              </p>
            </div>
            <button onClick={handleLogout} className="btn btn-danger btn-sm">
              Logout
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="card" style={{ padding: 0, marginBottom: "24px" }}>
          <div style={{ display: "flex", borderBottom: "1px solid var(--border-default)", overflow: "auto" }}>
            <button
              onClick={() => setActiveTab("profile")}
              className={`tab-btn ${activeTab === "profile" ? "active" : ""}`}
            >
              Profile
            </button>
            <button
              onClick={() => setActiveTab("orders")}
              className={`tab-btn ${activeTab === "orders" ? "active" : ""}`}
            >
              Order History
            </button>
            {user.role === "admin" && (
              <button
                onClick={() => setActiveTab("dashboard")}
                className={`tab-btn ${activeTab === "dashboard" ? "active" : ""}`}
              >
                Dashboard
              </button>
            )}
          </div>

          <div style={{ padding: "28px" }}>
            {/* ── PROFILE TAB ── */}
            {activeTab === "profile" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                {updateError && (
                  <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "var(--radius-md)", padding: "14px 18px", color: "#dc2626" }}>
                    {updateError}
                  </div>
                )}
                {updateSuccess && (
                  <div style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.3)", borderRadius: "var(--radius-md)", padding: "14px 18px", color: "#16a34a" }}>
                    {updateSuccess}
                  </div>
                )}

                {/* Profile Info */}
                <div style={{ background: "var(--surface-secondary)", borderRadius: "var(--radius-lg)", padding: "28px" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
                    <h2 className="heading-display" style={{ fontSize: "1.25rem" }}>Profile Information</h2>
                    {!editMode && (
                      <button onClick={() => setEditMode(true)} className="btn btn-ghost btn-sm">
                        Edit
                      </button>
                    )}
                  </div>

                  {editMode ? (
                    <form onSubmit={handleUpdateProfile} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                      <div>
                        <label className="text-label" style={{ marginBottom: "6px", display: "block" }}>Username</label>
                        <input
                          className="input-field"
                          type="text"
                          value={editUsername}
                          onChange={(e) => setEditUsername(e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <label className="text-label" style={{ marginBottom: "6px", display: "block" }}>Email</label>
                        <input
                          className="input-field"
                          type="email"
                          value={editEmail}
                          onChange={(e) => setEditEmail(e.target.value)}
                          required
                        />
                      </div>
                      <div style={{ display: "flex", gap: "12px" }}>
                        <button type="submit" className="btn btn-primary btn-sm">Save Changes</button>
                        <button
                          type="button"
                          onClick={() => {
                            setEditMode(false);
                            setEditUsername(user.username ?? user.username ?? "");
                            setEditEmail(user.email ?? "");
                            setUpdateError("");
                          }}
                          className="btn btn-secondary btn-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                      <div>
                        <p className="text-label" style={{ marginBottom: "2px" }}>Username</p>
                        <p style={{ fontWeight: 500, color: "var(--ink)" }}>{user.username ?? "-"}</p>
                      </div>
                      <div>
                        <p className="text-label" style={{ marginBottom: "2px" }}>Email</p>
                        <p style={{ fontWeight: 500, color: "var(--ink)" }}>{user.email ?? "-"}</p>
                      </div>
                      <div>
                        <p className="text-label" style={{ marginBottom: "2px" }}>Role</p>
                        <p style={{ fontWeight: 500, color: "var(--ink)", textTransform: "capitalize" }}>{user.role}</p>
                      </div>
                      <div>
                        <p className="text-label" style={{ marginBottom: "2px" }}>Password</p>
                        <p style={{ fontWeight: 500, color: "var(--ink)" }}>••••••••</p>
                        <p style={{ fontSize: "0.8rem", color: "var(--slate)", marginTop: "2px" }}>
                          Use the form below to change your password
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Change Password */}
                <div style={{ background: "var(--surface-secondary)", borderRadius: "var(--radius-lg)", padding: "28px" }}>
                  <h2 className="heading-display" style={{ fontSize: "1.25rem", marginBottom: "20px" }}>
                    Change Password
                  </h2>
                  <form onSubmit={handleChangePassword} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    <div>
                      <label className="text-label" style={{ marginBottom: "6px", display: "block" }}>Current Password</label>
                      <input
                        className="input-field"
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="Enter current password"
                        required
                      />
                      <p style={{ fontSize: "0.8rem", color: "var(--slate)", marginTop: "4px" }}>
                        You must enter your current password correctly
                      </p>
                    </div>
                    <div>
                      <label className="text-label" style={{ marginBottom: "6px", display: "block" }}>New Password</label>
                      <input
                        className="input-field"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="At least 6 characters"
                        required
                        minLength={6}
                      />
                    </div>
                    <div>
                      <label className="text-label" style={{ marginBottom: "6px", display: "block" }}>Confirm New Password</label>
                      <input
                        className="input-field"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Re-enter new password"
                        required
                        minLength={6}
                      />
                    </div>
                    <button type="submit" className="btn btn-primary btn-sm" style={{ alignSelf: "flex-start" }}>
                      Change Password
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* ── ORDERS TAB ── */}
            {activeTab === "orders" && (
              <div>
                <h2 className="heading-display" style={{ fontSize: "1.25rem", marginBottom: "20px" }}>
                  Order History
                </h2>
                {ordersLoading ? (
                  <div style={{ textAlign: "center", padding: "48px 0", color: "var(--slate)" }}>
                    Loading orders…
                  </div>
                ) : orders.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "48px 0" }}>
                    <p style={{ color: "var(--slate)" }}>No orders yet.</p>
                    <a href="/shop" className="btn btn-ghost btn-sm" style={{ marginTop: "12px", display: "inline-flex" }}>
                      Browse our shop →
                    </a>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {orders.map((order) => (
                      <div
                        key={order.id}
                        style={{
                          background: "var(--surface-secondary)",
                          borderRadius: "var(--radius-md)",
                          padding: "18px 20px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <div>
                          <p style={{ fontWeight: 600, color: "var(--ink)" }}>
                            Order #{order.id.slice(0, 8)}
                          </p>
                          <p style={{ fontSize: "0.85rem", color: "var(--slate)" }}>
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <p style={{ fontWeight: 700, color: "var(--ink)" }}>€{order.totalEUR}</p>
                          <span
                            className={`badge ${
                              order.status === "completed"
                                ? "badge-green"
                                : order.status === "pending"
                                ? "badge-yellow"
                                : "badge-red"
                            }`}
                          >
                            {order.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── DASHBOARD TAB (Admin) ── */}
            {activeTab === "dashboard" && user.role === "admin" && (
              <div>
                <h2 className="heading-display" style={{ fontSize: "1.25rem", marginBottom: "20px" }}>
                  Admin Dashboard
                </h2>
                {statsLoading ? (
                  <div style={{ textAlign: "center", padding: "48px 0", color: "var(--slate)" }}>
                    Loading statistics…
                  </div>
                ) : stats ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                    {/* Stats Cards */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
                      <div className="card-stat card">
                        <div className="stat-label">Total Users</div>
                        <div className="stat-value">{stats.totalUsers}</div>
                      </div>
                      <div className="card-stat card">
                        <div className="stat-label">Total Orders</div>
                        <div className="stat-value">{stats.totalOrders}</div>
                      </div>
                      <div className="card-stat card">
                        <div className="stat-label">Total Revenue</div>
                        <div className="stat-value">€{stats.totalRevenue}</div>
                      </div>
                    </div>

                    {/* Recent Orders */}
                    <div>
                      <h3 style={{ fontWeight: 700, color: "var(--ink)", marginBottom: "14px", fontSize: "1.1rem" }}>
                        Recent Orders
                      </h3>
                      {stats.recentOrders.length === 0 ? (
                        <p style={{ color: "var(--slate)" }}>No orders yet.</p>
                      ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                          {stats.recentOrders.map((order) => (
                            <div
                              key={order.id}
                              style={{
                                background: "var(--surface-secondary)",
                                borderRadius: "var(--radius-md)",
                                padding: "16px 20px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                              }}
                            >
                              <div>
                                <p style={{ fontWeight: 600, color: "var(--ink)" }}>
                                  Order #{order.id.slice(0, 8)}
                                </p>
                                <p style={{ fontSize: "0.85rem", color: "var(--slate)" }}>
                                  {new Date(order.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                              <div style={{ textAlign: "right" }}>
                                <p style={{ fontWeight: 700, color: "var(--ink)" }}>€{order.totalEUR}</p>
                                <span
                                  className={`badge ${
                                    order.status === "completed"
                                      ? "badge-green"
                                      : order.status === "pending"
                                      ? "badge-yellow"
                                      : "badge-red"
                                  }`}
                                >
                                  {order.status}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div style={{ textAlign: "center", padding: "48px 0", color: "var(--slate)" }}>
                    Failed to load dashboard data
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}