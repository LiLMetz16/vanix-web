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
      ? "text-gray-900 font-semibold" 
      : "text-gray-700 hover:text-gray-900";

  return (
    <>
      <header className="w-full pt-4 relative z-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="relative rounded-2xl bg-white/80 backdrop-blur shadow-lg border border-white/60">
            {/* Gradient line at bottom */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-indigo-500 via-pink-500 to-emerald-400 opacity-80" />

            <div className="flex items-center justify-between gap-6 px-5 py-3">
              {/* Logo + Brand */}
              <div className="flex items-center gap-3">
                <Link href="/" className="flex items-center gap-3 group">
                  <Image
                    src="/logo.png"
                    alt="Vanix Logo"
                    width={40}
                    height={40}
                    className="object-contain rounded-xl transition-transform duration-200 group-hover:scale-105"
                  />
                  <div className="flex flex-col leading-tight">
                    <span className="font-extrabold text-xl text-gray-900">
                      Vanix
                    </span>
                    <span className="text-xs text-gray-500">
                      Anton Kabakov & Viktor Kanev
                    </span>
                  </div>
                </Link>
              </div>

              {/* Navigation */}
              <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
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
              <div className="flex items-center gap-3">
                {/* Shopping Cart */}
                <button
                  type="button"
                  onClick={() => {
                    setCartOpen(!cartOpen);
                    setAccountOpen(false);
                  }}
                  className="w-10 h-10 rounded-full border border-gray-300 flex justify-center items-center bg-white/90 hover:bg-gray-100 text-lg transition hover:scale-105"
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
                    className="w-10 h-10 rounded-full border border-gray-300 flex justify-center items-center bg-white/90 hover:bg-gray-100 text-lg transition hover:scale-105"
                  >
                    👤
                  </button>

                  {accountOpen && (
                    <div className="absolute right-0 mt-2 w-48 rounded-2xl border border-gray-200 bg-white shadow-xl z-[100]">
                      <div className="p-2">
                        {!user ? (
                          // NOT LOGGED IN - Show only Login button
                          <Link
                            href="/auth"
                            onClick={() => setAccountOpen(false)}
                            className="block px-4 py-3 text-center text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg font-semibold"
                          >
                            Login
                          </Link>
                        ) : (
                          // LOGGED IN - Show options based on role
                          <>
                            <Link
                              href="/account"
                              onClick={() => setAccountOpen(false)}
                              className="block px-4 py-2 text-gray-900 hover:bg-gray-100 rounded-lg"
                            >
                              My Account
                            </Link>
                            
                            {user.role === "admin" ? (
                              // ADMIN - Show Dashboard
                              <Link
                                href="/account?tab=dashboard"
                                onClick={() => setAccountOpen(false)}
                                className="block px-4 py-2 text-gray-900 hover:bg-gray-100 rounded-lg"
                              >
                                Dashboard
                              </Link>
                            ) : (
                              // USER/CLIENT - Show Order History
                              <Link
                                href="/account?tab=orders"
                                onClick={() => setAccountOpen(false)}
                                className="block px-4 py-2 text-gray-900 hover:bg-gray-100 rounded-lg"
                              >
                                Order History
                              </Link>
                            )}
                            
                            <hr className="my-2" />
                            <button
                              onClick={handleLogout}
                              className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg"
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
            className="fixed inset-0 bg-black/50 z-[60]"
            onClick={() => setCartOpen(false)}
          />
          
          {/* Sidebar */}
          <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-[70] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-bold text-gray-900">Shopping Cart</h2>
              <button
                onClick={() => setCartOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-600"
              >
                ✕
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="text-center py-12 text-gray-500">
                <div className="text-6xl mb-4">🛒</div>
                <p className="text-lg font-semibold text-gray-900 mb-2">Your cart is empty</p>
                <p className="text-sm text-gray-600">Add items from the shop to get started</p>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-600">Subtotal:</span>
                <span className="text-xl font-bold text-gray-900">€0</span>
              </div>
              <Link
                href="/shop"
                onClick={() => setCartOpen(false)}
                className="block w-full text-center px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition"
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
