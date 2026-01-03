"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function ContactPage() {
  const [accountOpen, setAccountOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();
  setLoading(true);
  setSent(false);
  setError(null);

  const form = e.currentTarget;                // <- ВАЖНО: пазим формата
  const formData = new FormData(form);

  const body = {
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message"),
  };

  try {
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(data.error || "Something went wrong");
    }

    setSent(true);
    setError(null);
    form.reset();                              // <- вече е безопасно
  } catch (err: any) {
    setError(err.message || "Something went wrong");
  } finally {
    setLoading(false);
  }
    
  }

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
                      <Link
                        href="/account"
                        className="block px-4 py-2 hover:bg-gray-100 text-gray-900"
                      >
                        My Account
                      </Link>
                      <Link
                        href="/account?tab=orders"
                        className="block px-4 py-2 hover:bg-gray-100 text-gray-900"
                      >
                        Order History
                      </Link>
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
      <main className="max-w-5xl mx-auto px-6 pt-14 pb-20">
        <h1 className="text-3xl font-bold text-white drop-shadow mb-6">
          Contact Us
        </h1>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact info */}
          <div className="bg-white rounded-2xl shadow p-6 text-gray-900">
            <h2 className="text-xl font-bold mb-3">Get in touch</h2>
            <p className="text-sm text-gray-700 mb-4">
              Свържете се с нашия екип за въпроси относно услуги, цени или
              поръчки.
            </p>

            <ul className="text-sm space-y-2">
              <li>
                <b>Email:</b> vanix.team@gmail.com
              </li>
              <li>
                <b>Phone:</b> +359 88 123 4567
              </li>
              <li>
                <b>Location:</b> Bulgaria, Burgas / Varna
              </li>
            </ul>

            <div className="mt-6">
              <p className="text-xs text-gray-600">
                Отговаряме най-често в рамките на 1–2 часа.
              </p>
            </div>
          </div>

          {/* Contact form */}
          <div className="bg-white rounded-2xl shadow p-6 text-gray-900">
            <h2 className="text-xl font-bold mb-4">Send a message</h2>

            <form className="space-y-3" onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                placeholder="Your name"
                className="w-full border rounded-xl px-3 py-2 text-sm text-gray-900"
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                className="w-full border rounded-xl px-3 py-2 text-sm text-gray-900"
                required
              />
              <textarea
                name="message"
                placeholder="Your message"
                rows={4}
                className="w-full border rounded-xl px-3 py-2 text-sm text-gray-900"
                required
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 disabled:opacity-60"
              >
                {loading ? "Sending..." : "Send message"}
              </button>
            </form>

            {sent && (
              <p className="mt-3 text-sm text-green-600">
                ✅ Your message has been sent successfully.
              </p>
            )}

            {error && (
              <p className="mt-3 text-sm text-red-600">
                ❌ Error: {error}
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
