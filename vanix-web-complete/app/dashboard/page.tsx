"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { readUser } from "@/lib/authClient";

type Stats = {
  users: number;
  orders: number;
  updatedAt: string;
};

export default function DashboardPage() {
  const [role, setRole] = useState<"client" | "admin" | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let t: any;

    (async () => {
      const u = await readUser();
      if (!u) {
        setRole(null);
        setErr("Not signed in.");
        return;
      }

      setRole(u.role);

      if (u.role !== "admin") {
        setErr("Forbidden (admin only).");
        return;
      }

      const load = async () => {
        setErr(null);

        const { data: sessionData } = await supabase.auth.getSession();
        const token = sessionData.session?.access_token;

        if (!token) {
          setErr("Missing access token.");
          return;
        }

        const res = await fetch("/api/admin/stats", {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
        });

        const json = await res.json();

        if (!res.ok) {
          setErr(json?.error ?? "Failed to load stats.");
          return;
        }

        setStats(json);
      };

      await load();
      t = setInterval(load, 5000);
    })();

    return () => t && clearInterval(t);
  }, []);

  if (role !== "admin") {
    return (
      <div className="min-h-screen p-6">
        <div className="text-2xl font-semibold">Dashboard</div>
        <div className="mt-3 rounded-2xl border p-4">
          {err ?? "Loading..."}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 space-y-4">
      <div className="text-2xl font-semibold">Admin Dashboard</div>

      {err && <div className="rounded-2xl border p-4">{err}</div>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-2xl border p-4">
          <div className="text-sm opacity-70">Users</div>
          <div className="text-3xl font-semibold">{stats?.users ?? "—"}</div>
        </div>

        <div className="rounded-2xl border p-4">
          <div className="text-sm opacity-70">Orders</div>
          <div className="text-3xl font-semibold">{stats?.orders ?? "—"}</div>
        </div>

        <div className="rounded-2xl border p-4">
          <div className="text-sm opacity-70">Last update</div>
          <div className="text-sm">{stats?.updatedAt ?? "—"}</div>
        </div>
      </div>
    </div>
  );
}
