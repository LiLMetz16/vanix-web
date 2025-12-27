"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
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

  // Supabase често връща "User already registered"
  if (m.includes("already registered") || m.includes("already exists")) {
    return "Вече има акаунт с този email.";
  }

  // Ако имаш unique constraint на public.users.email и някак си стигнеш до него
  if (m.includes("duplicate") || m.includes("unique constraint") || m.includes("already in use")) {
    return "Вече има акаунт с този email.";
  }

  return msg;
}

export default function AccountPage() {
  const router = useRouter();
  const sp = useSearchParams();

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

      const { data, error } = await supabase.auth.signUp({
  email,
  password,
  options: {
    data: { username: name }, // или name, според твоя state
    emailRedirectTo: `${origin}/auth/verify`,
  },
});

      if (error) {
        setErr(mapSupabaseRegisterError(error.message));
        return;
      }

      // ако email confirmation е включен – ще трябва да потвърдиш
      setMode("login");
    } catch (e: any) {
      setErr(mapSupabaseRegisterError(e?.message ?? "Register failed."));
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
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
  }, [user?.role, tab]);

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

    // refresh
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
                {/* mode switch */}
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

                  {/* Email with 🙈/👁️ */}
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
                        title={emailVisible ? "Unhash (show)" : "Hash (hide)"}
                      >
                        {emailVisible ? "👁️" : "🙈"}
                      </button>
                    </div>
                  </div>

                  {/* Password with 🙈/👁️ */}
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
                        title={passwordVisible ? "Unhash (show)" : "Hash (hide)"}
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
