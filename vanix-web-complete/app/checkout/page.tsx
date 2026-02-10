"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const [accountOpen, setAccountOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false); // тук dropdown-ът може да е празен/демо
  const [accepted, setAccepted] = useState(false);
  const [total, setTotal] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const t = window.localStorage.getItem("vanixLastOrderTotal");
    if (t) setTotal(t);
  }, []);

  const handleProceed = () => {
    if (!accepted) return;

    alert(
      `Order confirmed (demo).\nTotal: €${total ?? "0.00"}\nThank you!`
    );

    // по желание: чистим количката/тотала и пращаме към Account или Home
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("vanixLastOrderTotal");
    }
    router.push("/account?tab=orders");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* NAVBAR */}
      <header className="w-full bg-white text-black border-b">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          {/* Logo + Brand */}
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="Vanix Logo"
              width={45}
              height={45}
              className="object-contain"
            />
            <div className="flex flex-col leading-tight">
              <span className="font-extrabold text-2xl text-black">
                Vanix
              </span>
              <span className="text-sm text-gray-700">
                Anton Kabakov & Viktor Kanev
              </span>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8 text-lg font-semibold">
            <Link href="/">Home</Link>
            <Link href="/shop">Shop</Link>
            <Link href="/contact">Contact Us</Link>
          </nav>

          {/* Icons (demo) */}
          <div className="flex items-center gap-4">
            {/* Account */}
            <div className="relative">
              <button
                onClick={() => {
                  setAccountOpen((prev) => !prev);
                  setCartOpen(false);
                }}
                className="w-11 h-11 rounded-full border flex justify-center items-center hover:bg-gray-100 text-xl"
              >
                👤
              </button>

              {accountOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border rounded-xl shadow-lg text-base z-20">
                  <Link
                    href="/account"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    My Account
                  </Link>
                  <Link
                    href="/account?tab=orders"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Order History
                  </Link>
                  <button
                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                    onClick={() => {
                      if (typeof window !== "undefined") {
                        window.localStorage.removeItem("vanixUser");
                      }
                      alert("You are logged out (demo).");
                    }}
                  >
                    Log out
                  </button>
                </div>
              )}
            </div>

            {/* Cart icon (тук може да е просто празен, защото сме на финалната стъпка) */}
            <div className="relative">
              <button
                onClick={() => {
                  setCartOpen((prev) => !prev);
                  setAccountOpen(false);
                }}
                className="w-11 h-11 rounded-full border flex justify-center items-center hover:bg-gray-100 text-xl"
              >
                🛒
              </button>

              {cartOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white border rounded-xl shadow-lg text-base z-20">
                  <div className="px-4 py-3 border-b font-semibold text-black">
                    Cart
                  </div>
                  <div className="px-4 py-4 text-gray-700 text-sm">
                    This is the final checkout step. Cart details are handled in
                    the shop page (demo).
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* CHECKOUT CONTENT */}
      <main className="max-w-3xl mx-auto px-6 py-10">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-black">
          Checkout
        </h1>
        <p className="text-gray-700 mb-6">
          Please review your order and accept the terms before proceeding.
        </p>

        <div className="bg-white rounded-2xl shadow p-6 space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold text-black">
              Order total:
            </span>
            <span className="text-xl font-bold text-black">
              €{total ?? "0.00"}
            </span>
          </div>

          <div className="border-t pt-4 space-y-3 text-sm text-gray-700">
            <div className="flex items-start gap-2">
              <input
                id="terms"
                type="checkbox"
                className="mt-1"
                checked={accepted}
                onChange={(e) => setAccepted(e.target.checked)}
              />
              <label htmlFor="terms">
                I have read and agree to the{" "}
                <span className="font-semibold">Terms of Service</span> and{" "}
                <span className="font-semibold">Privacy Policy</span>. I
                understand this is a demo checkout and does not create a real
                contract.
              </label>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => router.push("/shop")}
              className="px-4 py-2 rounded-xl border border-gray-300 text-sm font-medium text-gray-800 hover:bg-gray-100 transition"
            >
              ← Back to shop
            </button>
            <button
              type="button"
              disabled={!accepted}
              onClick={handleProceed}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition w-full ${
                accepted
                  ? "bg-green-600 text-white hover:bg-green-700"
                  : "bg-gray-300 text-gray-600 cursor-not-allowed"
              }`}
            >
              Proceed
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
