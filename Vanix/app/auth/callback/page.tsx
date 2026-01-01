"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const verify = async () => {
      const supabase = createClient();

      const code = searchParams.get("code");
      const token = searchParams.get("token");
      const type = searchParams.get("type");
      const email = searchParams.get("email");

      // ✅ Magic link / PKCE (най-често)
      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) return setError(error.message);
        router.replace("/account");
        return;
      }

      // ✅ OTP flow
      if (token && type && email) {
        const { error } = await supabase.auth.verifyOtp({
          email,
          token,
          type: type as any,
        });
        if (error) return setError(error.message);
        router.replace("/account");
        return;
      }

      setError("Invalid or expired verification link.");
    };

    verify();
  }, [router, searchParams]);

  return (
    <main>
      {error ? <p>{error}</p> : <p>Verifying…</p>}
    </main>
  );
}
