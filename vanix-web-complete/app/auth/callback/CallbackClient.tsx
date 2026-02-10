"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function CallbackClient() {
  const router = useRouter();
  const sp = useSearchParams();
  const [msg, setMsg] = useState("Working...");

  useEffect(() => {
    const error = sp.get("error");
    const errorDesc = sp.get("error_description");

    if (error) {
      setMsg(`${error}: ${errorDesc ?? ""}`);
      return;
    }

    setMsg("Done. Redirecting...");
    router.replace("/account");
  }, [router, sp]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-6">
      <div className="max-w-md w-full rounded-2xl border border-white/10 bg-white/5 p-6">
        <h1 className="text-xl font-semibold">Auth Callback</h1>
        <p className="mt-2 opacity-80">{msg}</p>
      </div>
    </div>
  );
}
