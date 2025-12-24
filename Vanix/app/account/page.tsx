"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

type Mode = "login" | "register";

export default function AccountPage() {
  const [accountOpen, setAccountOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [mode, setMode] = useState<Mode>("login");

  return (
    <div className="min-h-screen bg-animated-gradient">
      {/* NAVBAR */}
      <header className="w-full pt-4">
        <div className="max-w-6xl mx-auto px-6">
          <div className="relative rounded-2xl bg-white/80 backdrop-blur shadow-lg border border-white/60">
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-indigo-500 via-pink-500 to-emerald-400 opacity-80" />

            <div className="flex items-center justify-between gap-6 px-5 py-3">
              {/* Logo */}
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
              <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-gray-700">
                <Link href="/" className="group relative">
                  <span className="transition-colors duration-200 group-hover:text-indigo-600">
                    Home
                  </span>
                  <span className="absolute left-0 -bottom-1 h-[2px] w-0 rounded-full bg-gradient-to-r from-indigo-500 to-sky-400 transition-all duration-200 group-hover:w-full" />
                </Link>

                <Link href="/shop" className="group relative">
                  <span className="transition-colors duration-200 group-hover:text-indigo-600">
                    Shop
                  </span>
                  <span className="absolute left-0 -bottom-1 h-[2px] w-0 rounded-full bg-gradient-to-r from-indigo-500 to-sky-400 transition-all duration-200 group-hover:w-full" />
                </Link>

                <Link href="/contact" className="group relative">
                  <span className="transition-colors duration-200 group-hover:text-indigo-600">
                    Contact Us
                  </span>
                  <span className="absolute left-0 -bottom-1 h-[2px] w-0 rounded-full bg-gradient-to-r from-indigo-500 to-sky-400 transition-all duration-200 group-hover:w-full" />
                </Link>
              </nav>

              {/* Icons */}
              <div className="flex items-center gap-3">
                {/* Account */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setAccountOpen(!accountOpen);
                      setCartOpen(false);
                    }}
                    className="w-10 h-10 rounded-full border border-gray-300 flex justify-center items-center bg-white/90 hover:bg-gray-100 text-lg transition hover:scale-105"
                  >
                    👤
                  </button>

                  {accountOpen && (
                    <div className="absolute right-0 mt-2 w-44 bg-white border rounded-xl shadow-xl z-30 text-gray-900">
                      <button className="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-900">
                        My Account
                      </button>
                      <button className="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-900">
                        Order History
                      </button>
                      <button className="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-900">
                        Log out
                      </button>
                    </div>
                  )}
                </div>

                {/* Cart */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setCartOpen(!cartOpen);
                      setAccountOpen(false);
                    }}
                    className="w-10 h-10 rounded-full border border-gray-300 flex justify-center items-center bg-white/90 hover:bg-gray-100 text-lg transition hover:scale-105"
                  >
                    🛒
                  </button>

                  {cartOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white border rounded-xl shadow-xl z-30 text-gray-900 text-sm">
                      <div className="px-4 py-3 border-b font-semibold text-gray-900">
                        Cart
                      </div>
                      <div className="px-4 py-4 text-gray-700 text-sm">
                        Your cart is empty.
                      </div>
                      <div className="px-4 py-2 border-t">
                        <Link
                          href="/shop"
                          className="block text-center text-indigo-600 hover:underline text-sm"
                        >
                          Go to shop
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="max-w-5xl mx-auto px-6 pt-10 pb-20">
        <h1 className="text-3xl font-bold text-white drop-shadow mb-6">
          My Account
        </h1>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Login / Register */}
          <div className="bg-white rounded-2xl shadow p-6 text-gray-900">
            <h2 className="text-xl font-bold mb-4 text-gray-900">
              {mode === "login" ? "Login" : "Create account"}
            </h2>

            <AccountForm mode={mode} />

            <button
              onClick={() =>
                setMode((prev) => (prev === "login" ? "register" : "login"))
              }
              className="mt-4 text-sm text-indigo-600 hover:underline"
            >
              {mode === "login"
                ? "Нямате акаунт? Създайте нов."
                : "Вече имате акаунт? Влезте."}
            </button>
          </div>

          {/* Orders / history */}
          <div className="bg-white rounded-2xl shadow p-6 text-gray-900">
            <h2 className="text-xl font-bold mb-3 text-gray-900">My Orders</h2>
            <p className="text-sm text-gray-700 mb-4">
              Тук по-късно ще показваме реалната история на поръчките и
              статусите им от SQL базата (pending, in progress, done).
            </p>

            <div className="border rounded-xl p-4 text-sm text-gray-600">
              No orders yet. Once you start buying services, your order history
              will appear here.
            </div>

            <div className="mt-6">
              <Link
                href="/shop"
                className="text-indigo-600 hover:underline text-sm"
              >
                → Go to shop
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function AccountForm({ mode }: { mode: Mode }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();
  setLoading(true);
  setError(null);
  setSuccess(null);

  const form = e.currentTarget;
  const data = new FormData(form);

  const body =
    mode === "register"
      ? {
          username: data.get("fullName"),
          email: data.get("email"),
          password: data.get("password"),
        }
      : {
          email: data.get("email"),
          password: data.get("password"),
        };

  const endpoint =
    mode === "login" ? "/api/auth/login" : "/api/auth/register";

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const json = await res.json();

    if (!res.ok) throw new Error(json.error || "Something went wrong");

    if (mode === "login") {
      setSuccess("Успешен вход!");
    } else {
      setSuccess("Акаунтът е създаден успешно!");
    }

    form.reset();
  } catch (err: any) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
}
  return (
    <>
      <form className="space-y-3" onSubmit={handleSubmit}>
        {mode === "register" && (
          <input
            className="w-full border rounded-xl px-3 py-2 text-sm text-gray-900"
            placeholder="Full name"
            name="fullName"
          />
        )}

        <input
          className="w-full border rounded-xl px-3 py-2 text-sm text-gray-900"
          placeholder="Email"
          type="email"
          name="email"
          required
        />

        <input
          className="w-full border rounded-xl px-3 py-2 text-sm text-gray-900"
          placeholder="Password"
          type="password"
          name="password"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 disabled:opacity-60"
        >
          {loading
            ? mode === "login"
              ? "Logging in..."
              : "Creating account..."
            : mode === "login"
            ? "Login"
            : "Create account"}
        </button>
      </form>

      {success && (
        <p className="mt-3 text-sm text-green-600">
          {success}
        </p>
      )}
      {error && (
        <p className="mt-2 text-sm text-red-600">
          ❌ {error}
        </p>
      )}
    </>
  );
}
