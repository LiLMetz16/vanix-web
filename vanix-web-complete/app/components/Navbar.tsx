"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { onAuthChanged, signOut } from "@/lib/authClient";
import type { StoredUser } from "@/lib/types/auth";

export default function Navbar() {
  const pathname = usePathname();

  const [user, setUser] = useState<StoredUser | null>(null);
  const [accountOpen, setAccountOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    const unsub = onAuthChanged((u) => setUser(u));
    return () => unsub();
  }, []);

  async function handleLogout() {
    await signOut();
    setAccountOpen(false);
  }

  const active = (href: string) => 
    pathname === href 
      ? "text-[#27296d] font-semibold border-b-2 border-[#5e63b6]" 
      : "text-[#5e63b6] hover:text-[#27296d]";

  return (
    <>
      <header className="w-full pt-6 relative z-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="relative rounded-2xl bg-white/90 backdrop-blur shadow-lg border border-[#5e63b6]/20">
            {/* Gradient line at bottom */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[3px] bg-gradient-to-r from-[#5e63b6] via-[#87CEEB] to-[#AAF0D1] opacity-90" />

            <div className="flex items-center justify-between gap-6 px-8 py-6">
              {/* Logo + Brand */}
              <div className="flex items-center gap-4">
                <Link href="/" className="flex items-center gap-4 group">
                  <Image
                    src="/logo.png"
                    alt="Vanix Logo"
                    width={50}
                    height={50}
                    className="object-contain rounded-xl transition-transform duration-200 group-hover:scale-105"
                  />
                  <div className="flex flex-col leading-tight">
                    <span className="font-extrabold text-2xl text-[#27296d]">
                      Vanix
                    </span>
                    <span className="text-sm text-[#889E9E]">
                      Anton Kabakov & Viktor Kanev
                    </span>
                  </div>
                </Link>
              </div>

              {/* Navigation */}
              <nav className="hidden md:flex items-center gap-8 text-base font-medium">
                <Link href="/" className={active("/")}>
                  Home
                </Link>
                <Link href="/shop" className={active("/shop")}>
                  Shop
                </Link>
                <Link href="/portfolio" className={active("/portfolio")}>
                  Portfolio
                </Link>
                <Link href="/about" className={active("/about")}>
                  About Us
                </Link>
                <Link href="/contact" className={active("/contact")}>
                  Contact Us
                </Link>
              </nav>

              {/* Icons: Cart + Account */}
              <div className="flex items-center gap-4">
                {/* Shopping Cart */}
                <button
                  type="button"
                  onClick={() => {
                    setCartOpen(!cartOpen);
                    setAccountOpen(false);
                  }}
                  className="w-12 h-12 rounded-full border-2 border-[#5e63b6]/30 flex justify-center items-center bg-white/90 hover:bg-[#DCD0FF]/30 hover:border-[#5e63b6] text-xl transition hover:scale-105"
                >
                  🛒
                </button>

                {/* Account */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => {
                      setAccountOpen(!accountOpen);
                      setCartOpen(false);
                    }}
                    className="w-12 h-12 rounded-full border-2 border-[#5e63b6]/30 flex justify-center items-center bg-white/90 hover:bg-[#DCD0FF]/30 hover:border-[#5e63b6] text-xl transition hover:scale-105"
                  >
                    👤
                  </button>

                  {accountOpen && (
                    <div className="absolute right-0 mt-2 w-48 rounded-2xl border-2 border-[#5e63b6]/20 bg-white/95 backdrop-blur shadow-xl z-[100]">
                      <div className="p-2">
                        {!user ? (
                          // NOT LOGGED IN - Show only Login button
                          <Link
                            href="/auth"
                            onClick={() => setAccountOpen(false)}
                            className="block px-4 py-3 text-center text-white bg-gradient-to-r from-[#5e63b6] to-[#27296d] hover:from-[#27296d] hover:to-[#5e63b6] rounded-lg font-semibold transition-all"
                          >
                            Login
                          </Link>
                        ) : (
                          // LOGGED IN - Show options based on role
                          <>
                            <Link
                              href="/account"
                              onClick={() => setAccountOpen(false)}
                              className="block px-4 py-2 text-[#27296d] hover:bg-[#DCD0FF]/30 rounded-lg transition-colors"
                            >
                              My Account
                            </Link>
                            
                            {user.role === "admin" ? (
                              // ADMIN - Show Dashboard
                              <Link
                                href="/account?tab=dashboard"
                                onClick={() => setAccountOpen(false)}
                                className="block px-4 py-2 text-[#27296d] hover:bg-[#DCD0FF]/30 rounded-lg transition-colors"
                              >
                                Dashboard
                              </Link>
                            ) : (
                              // USER/CLIENT - Show Order History
                              <Link
                                href="/account?tab=orders"
                                onClick={() => setAccountOpen(false)}
                                className="block px-4 py-2 text-[#27296d] hover:bg-[#DCD0FF]/30 rounded-lg transition-colors"
                              >
                                Order History
                              </Link>
                            )}
                            
                            <hr className="my-2 border-[#5e63b6]/20" />
                            <button
                              onClick={handleLogout}
                              className="w-full text-left px-4 py-2 text-[#F4C2C2] hover:bg-[#F4C2C2]/20 rounded-lg transition-colors"
                            >
                              Logout
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Cart Sidebar - Previous Design */}
      {cartOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-[#27296d]/50 backdrop-blur-sm z-[60]"
            onClick={() => setCartOpen(false)}
          />
          
          {/* Sidebar */}
          <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white/95 backdrop-blur shadow-2xl z-[70] flex flex-col border-l-2 border-[#5e63b6]/20">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b-2 border-[#5e63b6]/20">
              <h2 className="text-xl font-bold text-[#27296d]">Shopping Cart</h2>
              <button
                onClick={() => setCartOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-[#DCD0FF]/30 flex items-center justify-center text-[#5e63b6]"
              >
                ✕
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="text-center py-12 text-[#889E9E]">
                <div className="text-6xl mb-4">🛒</div>
                <p className="text-lg font-semibold text-[#27296d] mb-2">Your cart is empty</p>
                <p className="text-sm text-[#5e63b6]">Add items from the shop to get started</p>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t-2 border-[#5e63b6]/20 p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[#5e63b6]">Subtotal:</span>
                <span className="text-xl font-bold text-[#27296d]">€0</span>
              </div>
              <Link
                href="/shop"
                onClick={() => setCartOpen(false)}
                className="block w-full text-center px-6 py-3 bg-gradient-to-r from-[#5e63b6] to-[#27296d] text-white font-semibold rounded-lg hover:from-[#27296d] hover:to-[#5e63b6] transition-all"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </>
      )}
    </>
  );
}
