"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

function getHashParams(): Record<string, string> {
  const raw = window.location.hash.startsWith("#")
    ? window.location.hash.slice(1)
    : window.location.hash;
  const p = new URLSearchParams(raw);
  const out: Record<string, string> = {};
  p.forEach((v, k) => (out[k] = v));
  return out;
}

export default function AuthCallbackPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const debug = useMemo(() => {
    const url = new URL(window.location.href);
    const hash = getHashParams();

    // НЕ показваме токените целите (security), само дали съществуват
    return {
      path: url.pathname,
      hasCode: Boolean(url.searchParams.get("code")),
      hasToken: Boolean(url.searchParams.get("token")),
      type: url.searchParams.get("type"),
      hasAccessToken: Boolean(hash["access_token"]),
      hasRefreshToken: Boolean(hash["refresh_token"]),
      search: url.search,
      hashKeys: Object.keys(hash),
    };
  }, []);

  async function handleConfirm() {
    setLoading(true);
    setErr(null);

    try {
      const url = new URL(window.location.href);

      // A) PKCE: ?code=...
      const code = url.searchParams.get("code");
      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) return setErr(error.message);
        router.replace("/account");
        return;
      }

      // B) Verify: ?token=...&type=signup
      const token = url.searchParams.get("token");
      const type = url.searchParams.get("type") as any;

      if (token && type) {
        const code = searchParams.get("code");
const token = searchParams.get("token");
const type = searchParams.get("type");
const email = searchParams.get("email");

if (code) {
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) return setErr(error.message);
  router.replace("/account");
  return;
}

if (token && type) {
  if (!email) return setErr("Missing email in verification link.");
  const { error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: type as any,
  });
  if (error) return setErr(error.message);
  router.replace("/account");
  return;
}

      }

      // C) Implicit hash tokens
      const hash = getHashParams();
      const access_token = hash["access_token"];
      const refresh_token = hash["refresh_token"];
      if (access_token && refresh_token) {
        const { error } = await supabase.auth.setSession({ access_token, refresh_token });
        if (error) return setErr(error.message);
        router.replace("/account");
        return;
      }

      setErr("NO TOKEN FOUND IN URL. The email link is not arriving with code/token/access_token.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-3xl mx-auto space-y-4">
        <h1 className="text-2xl font-semibold">Auth Callback Debug</h1>

        <pre className="rounded-xl bg-white/10 p-4 overflow-auto text-sm">
{JSON.stringify(debug, null, 2)}
        </pre>

        {err && (
          <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-200">
            {err}
          </div>
        )}

        <button
          onClick={handleConfirm}
          disabled={loading}
          className="rounded-xl bg-white text-black px-4 py-2 disabled:opacity-50"
        >
          {loading ? "Confirming..." : "Confirm"}
        </button>

        <button
          onClick={() => router.replace("/account")}
          className="rounded-xl border border-white/20 px-4 py-2"
        >
          Back to login
        </button>
      </div>
    </div>
  );
}
