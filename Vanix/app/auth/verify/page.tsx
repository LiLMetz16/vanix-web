"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AuthVerifyPage() {
  const router = useRouter();

  useEffect(() => {
    // Просто препращаме целия URL (query/hash) към /auth/callback
    const full = window.location.href;

    // Вземаме всичко след домейна
    const afterOrigin = full.replace(window.location.origin, "");

    // afterOrigin е нещо като /auth/verify?type=signup&token=...
    // Прехвърляме го към /auth/callback със същите параметри
    const target = afterOrigin.replace("/auth/verify", "/auth/callback");

    router.replace(target);
  }, [router]);

  return (
    <div className="min-h-screen bg-animated-gradient flex items-center justify-center px-6">
      <div className="rounded-2xl bg-white/80 backdrop-blur shadow-lg border border-white/60 p-6">
        <div className="text-lg font-semibold text-black">Opening confirmation…</div>
        <div className="text-sm opacity-70 mt-1 text-black">Please wait.</div>
      </div>
    </div>
  );
}
