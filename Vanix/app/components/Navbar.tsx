"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AccountDropdownContent } from "@/app/components/accountDropdownContent";
import { onAuthChanged, signOut } from "@/lib/authClient";
import type { StoredUser } from "@/lib/types/auth";

export default function Navbar() {
  const pathname = usePathname();

  const [user, setUser] = useState<StoredUser | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const unsub = onAuthChanged((u) => setUser(u));
    return () => unsub();
  }, []);

  async function handleLogout() {
    await signOut();
    setOpen(false);
  }

  const active = (href: string) => (pathname === href ? "opacity-100" : "opacity-70 hover:opacity-100");

  return (
    <header className="w-full pt-4">
      <div className="max-w-6xl mx-auto px-6">
        <div className="relative rounded-2xl bg-white/80 backdrop-blur shadow-lg border border-white/60 px-4 py-3 flex items-center justify-between">
          <Link href="/" className="font-semibold">
            VANIX
          </Link>

          <nav className="flex items-center gap-4 text-sm">
            <Link className={active("/")} href="/">Home</Link>
            <Link className={active("/shop")} href="/shop">Shop</Link>
            <Link className={active("/contact")} href="/contact">Contact</Link>

            <div className="relative">
              <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="rounded-2xl border border-black/10 bg-white/60 px-3 py-2 hover:bg-white"
              >
                My account
              </button>

              {open && (
                <div className="absolute right-0 mt-2 rounded-2xl border border-black/10 bg-white shadow-xl">
                  <AccountDropdownContent user={user} onLogout={handleLogout} />
                </div>
              )}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
