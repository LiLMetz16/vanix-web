"use client";

<<<<<<< HEAD:Vanix/app/account/AccountClient.tsx
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { readUser } from "@/lib/authClient";
import type { StoredUser } from "@/lib/types/auth";

type Mode = "login" | "register";
type Tab = "profile" | "orders" | "dashboard" | "users";

type AdminUserRow = {
  id: string;
  email: string | null;
  username: string | null;
  role: "client" | "admin";
};

function mapSupabaseRegisterError(msg: string) {
  const m = msg.toLowerCase();
  if (m.includes("already registered") || m.includes("already exists")) return "Вече има акаунт с този email.";
  if (m.includes("duplicate") || m.includes("unique constraint") || m.includes("already in use"))
    return "Вече има акаунт с този email.";
  return msg;
}
=======
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { readUser, signOut } from "@/lib/authClient";
import type { StoredUser } from "@/lib/types/auth";

type Tab = "profile" | "orders" | "dashboard";

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
>>>>>>> 1f766ad (update changes):vanix-web-complete/app/account/AccountClient.tsx

export default function AccountClient() {
  const router = useRouter();
  const sp = useSearchParams();

<<<<<<< HEAD:Vanix/app/account/AccountClient.tsx
  // IMPORTANT: use the canonical browser client
  const supabase = useMemo(() => createClient(), []);

  const [mode, setMode] = useState<Mode>("login");
  const [user, setUser] = useState<StoredUser | null>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const [emailVisible, setEmailVisible] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // admin stats
  const [stats, setStats] = useState<{ users: number; orders: number; updatedAt: string } | null>(null);
  const [statsErr, setStatsErr] = useState<string | null>(null);

  // admin users
  const [usersList, setUsersList] = useState<AdminUserRow[]>([]);
  const [usersErr, setUsersErr] = useState<string | null>(null);
  const [usersLoading, setUsersLoading] = useState(false);

  const isAdmin = user?.role === "admin";

  const tab = useMemo(() => {
    const t = (sp.get("tab") ?? "profile").toLowerCase();
    if (t === "orders") return "orders" as const;
    if (t === "dashboard") return "dashboard" as const;
    if (t === "users") return "users" as const;
    return "profile" as const;
  }, [sp]);

  useEffect(() => {
    readUser().then(setUser).catch(() => setUser(null));
  }, []);

  function setTab(next: Tab) {
    router.replace(`/account?tab=${next}`);
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErr(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;

      const u = await readUser();
      setUser(u);
      router.push("/account");
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
      const origin = window.location.origin;

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { username: name },
          emailRedirectTo: `${origin}/auth/verify`,
        },
      });

      if (error) {
        setErr(mapSupabaseRegisterError(error.message));
        return;
      }

      setMode("login");
    } catch (e: any) {
      setErr(mapSupabaseRegisterError(e?.message ?? "Register failed."));
    } finally {
      setLoading(false);
=======
  const [user, setUser] = useState<StoredUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>("profile");

  // Profile editing
  const [editMode, setEditMode] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
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

  useEffect(() => {
    loadUser();
  }, []);

  useEffect(() => {
    const tabParam = sp.get("tab");
    if (tabParam === "orders" || tabParam === "dashboard") {
      setActiveTab(tabParam as Tab);
    }
  }, [sp]);

  async function loadUser() {
    const u = await readUser();
    if (!u) {
      router.push("/auth");
      return;
    }
    setUser(u);
    setUsername(u.username);
    setEmail(u.email);
    setLoading(false);
  }

  async function loadOrders() {
    setOrdersLoading(true);
    try {
      const response = await fetch("/api/orders");
      const data = await response.json();
      setOrders(data.orders || []);
    } catch (error) {
      console.error("Error loading orders:", error);
    } finally {
      setOrdersLoading(false);
    }
  }

  async function loadDashboard() {
    if (user?.role !== "admin") return;
    setStatsLoading(true);
    try {
      const response = await fetch("/api/admin/dashboard");
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error("Error loading dashboard:", error);
    } finally {
      setStatsLoading(false);
    }
  }

  useEffect(() => {
    if (!user) return;
    if (activeTab === "orders") {
      loadOrders();
    } else if (activeTab === "dashboard" && user.role === "admin") {
      loadDashboard();
    }
  }, [activeTab, user]);

  async function handleUpdateProfile(e: React.FormEvent) {
    e.preventDefault();
    setUpdateError("");
    setUpdateSuccess("");

    try {
      const response = await fetch("/api/auth/update-profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update profile");
      }

      setUpdateSuccess("Profile updated successfully!");
      setEditMode(false);
      await loadUser();
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
      const response = await fetch("/api/auth/change-password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to change password");
      }

      setUpdateSuccess("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      setUpdateError(error.message);
>>>>>>> 1f766ad (update changes):vanix-web-complete/app/account/AccountClient.tsx
    }
  }

  async function handleLogout() {
<<<<<<< HEAD:Vanix/app/account/AccountClient.tsx
    setLoading(true);
    setErr(null);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
      router.replace("/account");
    } catch (e: any) {
      setErr(e?.message ?? "Logout failed.");
    } finally {
      setLoading(false);
    }
  }

  // Admin stats polling (dashboard)
  useEffect(() => {
    let t: any;

    const load = async () => {
      setStatsErr(null);

      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;

      if (!token) {
        setStatsErr("Missing access token.");
        return;
      }

      const res = await fetch("/api/admin/stats", {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });

      const json = await res.json();

      if (!res.ok) {
        setStatsErr(json?.error ?? "Failed to load stats.");
        return;
      }

      setStats(json);
    };

    if (user?.role === "admin" && tab === "dashboard") {
      load();
      t = setInterval(load, 5000);
    }

    return () => t && clearInterval(t);
  }, [supabase, user?.role, tab]);

  // Admin users list
  async function loadUsers() {
    setUsersLoading(true);
    setUsersErr(null);

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;
      if (!token) {
        setUsersErr("Missing access token.");
        return;
      }

      const res = await fetch("/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });

      const json = await res.json();
      if (!res.ok) {
        setUsersErr(json?.error ?? "Failed to load users.");
        return;
      }

      setUsersList(json.users ?? []);
    } finally {
      setUsersLoading(false);
    }
  }

  async function setUserRole(id: string, role: "client" | "admin") {
    setUsersErr(null);

    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData.session?.access_token;
    if (!token) {
      setUsersErr("Missing access token.");
      return;
    }

    const res = await fetch("/api/admin/users/role", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id, role }),
    });

    const json = await res.json();
    if (!res.ok) {
      setUsersErr(json?.error ?? "Failed to update role.");
      return;
    }

    await loadUsers();
  }

  useEffect(() => {
    if (user?.role === "admin" && tab === "users") {
      loadUsers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.role, tab]);

  return (
    <div className="min-h-screen bg-animated-gradient">
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="w-full max-w-2xl">
          <div className="relative rounded-2xl bg-white/80 backdrop-blur shadow-lg border border-white/60 p-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-semibold text-black">My Account</h1>

              {user ? (
                <button
                  onClick={handleLogout}
                  disabled={loading}
                  className="rounded-xl border border-black/10 bg-white/60 px-3 py-1.5 text-sm hover:bg-white disabled:opacity-60 text-black"
                >
                  Logout
                </button>
              ) : null}
            </div>

            {user ? (
              <>
                <div className="mt-5 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setTab("profile")}
                    className={`rounded-xl border border-black/10 px-3 py-2 text-sm font-medium text-black ${
                      tab === "profile" ? "bg-white shadow" : "bg-white/60 hover:bg-white"
                    }`}
                  >
                    Profile
                  </button>

                  <button
                    type="button"
                    onClick={() => setTab("orders")}
                    className={`rounded-xl border border-black/10 px-3 py-2 text-sm font-medium text-black ${
                      tab === "orders" ? "bg-white shadow" : "bg-white/60 hover:bg-white"
                    }`}
                  >
                    Orders
                  </button>

                  {isAdmin && (
                    <>
                      <button
                        type="button"
                        onClick={() => setTab("dashboard")}
                        className={`rounded-xl border border-black/10 px-3 py-2 text-sm font-medium text-black ${
                          tab === "dashboard" ? "bg-white shadow" : "bg-white/60 hover:bg-white"
                        }`}
                      >
                        Dashboard
                      </button>

                      <button
                        type="button"
                        onClick={() => setTab("users")}
                        className={`rounded-xl border border-black/10 px-3 py-2 text-sm font-medium text-black ${
                          tab === "users" ? "bg-white shadow" : "bg-white/60 hover:bg-white"
                        }`}
                      >
                        Users
                      </button>
                    </>
                  )}
                </div>

                <div className="mt-5">
                  {tab === "profile" && (
                    <div className="rounded-xl border border-black/10 bg-white/60 p-4 space-y-2 text-sm text-black">
                      <div>
                        <span className="font-semibold">Email:</span> {user.email ?? "-"}
                      </div>
                      <div>
                        <span className="font-semibold">Name:</span> {user.name ?? "-"}
                      </div>
                      <div>
                        <span className="font-semibold">Role:</span> {user.role}
                      </div>
                    </div>
                  )}

                  {tab === "orders" && (
                    <div className="rounded-xl border border-black/10 bg-white/60 p-4 text-black">
                      <div className="text-sm font-semibold">Orders</div>
                      <div className="text-sm opacity-70 mt-1">
                        Тук ще показваш реалните поръчки (като имаш таблица/данни).
                      </div>
                    </div>
                  )}

                  {tab === "dashboard" && (
                    <div className="rounded-xl border border-black/10 bg-white/60 p-4 text-black">
                      {!isAdmin ? (
                        <div className="text-sm">Forbidden</div>
                      ) : (
                        <>
                          <div className="text-sm font-semibold">Admin Dashboard (live)</div>
                          <div className="text-xs opacity-70 mt-1">Auto refresh: 5s</div>

                          {statsErr && (
                            <div className="mt-3 rounded-xl border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
                              {statsErr}
                            </div>
                          )}

                          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div className="rounded-xl border border-black/10 bg-white/70 p-3">
                              <div className="text-xs opacity-70">Users</div>
                              <div className="text-2xl font-semibold">{stats?.users ?? "—"}</div>
                            </div>

                            <div className="rounded-xl border border-black/10 bg-white/70 p-3">
                              <div className="text-xs opacity-70">Orders</div>
                              <div className="text-2xl font-semibold">{stats?.orders ?? "—"}</div>
                            </div>

                            <div className="rounded-xl border border-black/10 bg-white/70 p-3">
                              <div className="text-xs opacity-70">Updated</div>
                              <div className="text-xs break-words">{stats?.updatedAt ?? "—"}</div>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  )}

                  {tab === "users" && (
                    <div className="rounded-xl border border-black/10 bg-white/60 p-4 text-black">
                      {!isAdmin ? (
                        <div className="text-sm">Forbidden</div>
                      ) : (
                        <>
                          <div className="flex items-center justify-between gap-3">
                            <div>
                              <div className="text-sm font-semibold">Users (public.users)</div>
                              <div className="text-xs opacity-70">
                                Тук виждаш акаунтите, които са се записали в таблицата ти.
                              </div>
                            </div>

                            <button
                              onClick={loadUsers}
                              disabled={usersLoading}
                              className="rounded-xl border border-black/10 bg-white/70 px-3 py-2 text-sm font-medium hover:bg-white disabled:opacity-60"
                            >
                              {usersLoading ? "Loading..." : "Refresh"}
                            </button>
                          </div>

                          {usersErr && (
                            <div className="mt-3 rounded-xl border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
                              {usersErr}
                            </div>
                          )}

                          <div className="mt-4 overflow-x-auto">
                            <table className="w-full text-sm">
                              <thead>
                                <tr className="text-left border-b border-black/10">
                                  <th className="py-2 pr-3">Email</th>
                                  <th className="py-2 pr-3">Username</th>
                                  <th className="py-2 pr-3">Role</th>
                                  <th className="py-2 pr-3">Actions</th>
                                </tr>
                              </thead>
                              <tbody>
                                {usersList.map((u) => (
                                  <tr key={u.id} className="border-b border-black/5">
                                    <td className="py-2 pr-3">{u.email ?? "-"}</td>
                                    <td className="py-2 pr-3">{u.username ?? "-"}</td>
                                    <td className="py-2 pr-3">{u.role}</td>
                                    <td className="py-2 pr-3">
                                      <div className="flex gap-2">
                                        <button
                                          onClick={() => setUserRole(u.id, "client")}
                                          className="rounded-lg border border-black/10 bg-white/70 px-2 py-1 hover:bg-white"
                                        >
                                          client
                                        </button>
                                        <button
                                          onClick={() => setUserRole(u.id, "admin")}
                                          className="rounded-lg border border-black/10 bg-white/70 px-2 py-1 hover:bg-white"
                                        >
                                          admin
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                ))}

                                {usersList.length === 0 && !usersLoading && (
                                  <tr>
                                    <td className="py-3 text-sm opacity-70" colSpan={4}>
                                      Няма данни (или още няма регистрации в public.users).
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <div className="mt-5 grid grid-cols-2 gap-2 rounded-2xl border border-black/10 bg-white/60 p-1">
                  <button
                    type="button"
                    onClick={() => setMode("login")}
                    className={`rounded-xl px-3 py-2 text-sm font-medium transition text-black ${
                      mode === "login" ? "bg-white shadow" : "hover:bg-white/60"
                    }`}
                  >
                    Login
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode("register")}
                    className={`rounded-xl px-3 py-2 text-sm font-medium transition text-black ${
                      mode === "register" ? "bg-white shadow" : "hover:bg-white/60"
                    }`}
                  >
                    Register
                  </button>
                </div>

                <form onSubmit={mode === "login" ? handleLogin : handleRegister} className="mt-5 space-y-3">
                  {mode === "register" && (
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-black">Username</label>
                      <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full rounded-xl border border-black/10 bg-white/60 px-3 py-2.5 outline-none focus:bg-white text-black placeholder:text-black/40"
                        placeholder="Username"
                        required
                      />
                    </div>
                  )}

                  <div className="space-y-1">
                    <label className="text-sm font-medium text-black">Email</label>
                    <div className="relative">
                      <input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full rounded-xl border border-black/10 bg-white/60 pl-3 pr-12 py-2.5 outline-none focus:bg-white text-black placeholder:text-black/40"
                        placeholder="Email"
                        type={emailVisible ? "text" : "password"}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setEmailVisible((v) => !v)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg border border-black/10 bg-white/70 px-2 py-1 text-sm hover:bg-white text-black"
                        title={emailVisible ? "Show" : "Hide"}
                      >
                        {emailVisible ? "👁️" : "🙈"}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-medium text-black">Password</label>
                    <div className="relative">
                      <input
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full rounded-xl border border-black/10 bg-white/60 pl-3 pr-12 py-2.5 outline-none focus:bg-white text-black placeholder:text-black/40"
                        placeholder="Password"
                        type={passwordVisible ? "text" : "password"}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setPasswordVisible((v) => !v)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg border border-black/10 bg-white/70 px-2 py-1 text-sm hover:bg-white text-black"
                        title={passwordVisible ? "Show" : "Hide"}
                      >
                        {passwordVisible ? "👁️" : "🙈"}
                      </button>
                    </div>
                  </div>

                  {err && (
                    <div className="rounded-xl border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
                      {err}
                    </div>
                  )}

                  <button
                    disabled={loading}
                    className="w-full rounded-xl border border-black/10 bg-white/70 px-4 py-2.5 font-semibold hover:bg-white disabled:opacity-60 text-black"
                    type="submit"
                  >
                    {loading ? "Please wait..." : mode === "login" ? "Login" : "Create account"}
                  </button>

                  {mode === "register" && (
                    <p className="text-xs opacity-70 text-black">
                      Ако email confirmation е включен, ще получиш линк за потвърждение.
                    </p>
                  )}
                </form>
              </>
=======
    await signOut();
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen py-10 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-white/90 backdrop-blur rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Account</h1>
              <p className="text-gray-600 mt-1">
                Welcome back, <span className="font-semibold">{user.username}</span>
                {user.role === "admin" && (
                  <span className="ml-2 bg-indigo-600 text-white text-xs px-2 py-1 rounded-full">
                    Admin
                  </span>
                )}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white/90 backdrop-blur rounded-2xl shadow-lg mb-6">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab("profile")}
              className={`px-6 py-4 font-semibold transition ${
                activeTab === "profile"
                  ? "text-indigo-600 border-b-2 border-indigo-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Profile
            </button>
            <button
              onClick={() => setActiveTab("orders")}
              className={`px-6 py-4 font-semibold transition ${
                activeTab === "orders"
                  ? "text-indigo-600 border-b-2 border-indigo-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Order History
            </button>
            {user.role === "admin" && (
              <button
                onClick={() => setActiveTab("dashboard")}
                className={`px-6 py-4 font-semibold transition ${
                  activeTab === "dashboard"
                    ? "text-indigo-600 border-b-2 border-indigo-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Dashboard
              </button>
            )}
          </div>

          <div className="p-6">
            {/* PROFILE TAB */}
            {activeTab === "profile" && (
              <div className="space-y-6">
                {updateError && (
                  <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                    {updateError}
                  </div>
                )}
                {updateSuccess && (
                  <div className="p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                    {updateSuccess}
                  </div>
                )}

                {/* Profile Information */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-900">Profile Information</h2>
                    {!editMode && (
                      <button
                        onClick={() => setEditMode(true)}
                        className="text-indigo-600 hover:underline"
                      >
                        Edit
                      </button>
                    )}
                  </div>

                  {editMode ? (
                    <form onSubmit={handleUpdateProfile} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Username
                        </label>
                        <input
                          type="text"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email
                        </label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
                          required
                        />
                      </div>
                      <div className="flex gap-3">
                        <button
                          type="submit"
                          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                        >
                          Save Changes
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setEditMode(false);
                            setUsername(user.username);
                            setEmail(user.email);
                            setUpdateError("");
                          }}
                          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-600">Username</p>
                        <p className="text-gray-900 font-medium">{user.username}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Email</p>
                        <p className="text-gray-900 font-medium">{user.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Role</p>
                        <p className="text-gray-900 font-medium capitalize">{user.role}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Password</p>
                        <p className="text-gray-900 font-medium">••••••••</p>
                        <p className="text-xs text-gray-500 mt-1">Use the form below to change your password</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Change Password */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Change Password</h2>
                  <form onSubmit={handleChangePassword} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Current Password
                      </label>
                      <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
                        placeholder="Enter current password"
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1">You must enter your current password correctly</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        New Password
                      </label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
                        placeholder="At least 6 characters"
                        required
                        minLength={6}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
                        placeholder="Re-enter new password"
                        required
                        minLength={6}
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                    >
                      Change Password
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* ORDERS TAB */}
            {activeTab === "orders" && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Order History</h2>
                {ordersLoading ? (
                  <div className="text-center py-10 text-gray-600">Loading orders...</div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-10">
                    <p className="text-gray-600">No orders yet.</p>
                    <a href="/shop" className="text-indigo-600 hover:underline mt-2 inline-block">
                      Browse our shop
                    </a>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order.id} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <p className="font-semibold text-gray-900">Order #{order.id.slice(0, 8)}</p>
                            <p className="text-sm text-gray-600">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-gray-900">€{order.totalEUR}</p>
                            <span
                              className={`text-xs px-2 py-1 rounded-full ${
                                order.status === "completed"
                                  ? "bg-green-100 text-green-700"
                                  : order.status === "pending"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {order.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* DASHBOARD TAB (Admin only) */}
            {activeTab === "dashboard" && user.role === "admin" && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Admin Dashboard</h2>
                {statsLoading ? (
                  <div className="text-center py-10 text-gray-600">Loading statistics...</div>
                ) : stats ? (
                  <div className="space-y-6">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-indigo-50 rounded-lg p-6">
                        <p className="text-sm text-indigo-600 font-semibold">Total Users</p>
                        <p className="text-3xl font-bold text-indigo-900 mt-2">{stats.totalUsers}</p>
                      </div>
                      <div className="bg-green-50 rounded-lg p-6">
                        <p className="text-sm text-green-600 font-semibold">Total Orders</p>
                        <p className="text-3xl font-bold text-green-900 mt-2">{stats.totalOrders}</p>
                      </div>
                      <div className="bg-purple-50 rounded-lg p-6">
                        <p className="text-sm text-purple-600 font-semibold">Total Revenue</p>
                        <p className="text-3xl font-bold text-purple-900 mt-2">€{stats.totalRevenue}</p>
                      </div>
                    </div>

                    {/* Recent Orders */}
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-3">Recent Orders</h3>
                      {stats.recentOrders.length === 0 ? (
                        <p className="text-gray-600">No orders yet.</p>
                      ) : (
                        <div className="space-y-3">
                          {stats.recentOrders.map((order) => (
                            <div key={order.id} className="bg-gray-50 rounded-lg p-4 flex items-center justify-between">
                              <div>
                                <p className="font-semibold text-gray-900">Order #{order.id.slice(0, 8)}</p>
                                <p className="text-sm text-gray-600">
                                  {new Date(order.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-gray-900">€{order.totalEUR}</p>
                                <span className={`text-xs px-2 py-1 rounded-full ${
                                  order.status === "completed" ? "bg-green-100 text-green-700" :
                                  order.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                                  "bg-red-100 text-red-700"
                                }`}>
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
                  <div className="text-center py-10 text-gray-600">Failed to load dashboard data</div>
                )}
              </div>
>>>>>>> 1f766ad (update changes):vanix-web-complete/app/account/AccountClient.tsx
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
