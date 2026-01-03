"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
  const [accountOpen, setAccountOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <div className="min-h-screen bg-animated-gradient">
      {/* NAVBAR */}
      <header className="w-full pt-4">
        <div className="max-w-6xl mx-auto px-6">
          <div className="relative rounded-2xl bg-white/80 backdrop-blur shadow-lg border border-white/60">
            {/* цветна линия долу */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-indigo-500 via-pink-500 to-emerald-400 opacity-80" />

            <div className="flex items-center justify-between gap-6 px-5 py-3">
              {/* Logo + brand */}
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
      <main className="max-w-6xl mx-auto px-6 pt-10 pb-20">
        <section className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white drop-shadow-md">
              Vanix — Software & Design Studio
            </h1>
            <p className="mt-5 text-lg text-white/90">
              Лична фрийланс компания, притежавана от <b>Антон Кабаков</b> и{" "}
              <b>Виктор Кънев</b>. Създаваме модерни уеб сайтове, уеб
              приложения, десктоп приложения, UI и UX дизайн — изцяло от
              нулата.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link
                href="/shop"
                className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-medium text-lg hover:bg-indigo-700 transition text-center"
              >
                View Services
              </Link>
              <Link
                href="/contact"
                className="px-6 py-3 rounded-xl bg-white/20 text-white font-medium text-lg hover:bg-white/30 transition text-center border border-white/40"
              >
                Contact Us
              </Link>
            </div>
          </div>

          <div>
            <div className="bg-white/90 rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900">
                Custom software & design
              </h2>
              <p className="mt-3 text-sm text-gray-700">
                Уебсайтове, уеб приложения, десктоп софтуер, UI и UX дизайн.
                При комбиниране на разработка + дизайн, дизайнът е на{" "}
                <b>половин цена</b>.
              </p>

              <ul className="mt-4 text-sm text-gray-700 space-y-2">
                <li>• Website from scratch</li>
                <li>• Web application from scratch</li>
                <li>• Desktop app from scratch</li>
                <li>• UI design</li>
                <li>• UX design</li>
              </ul>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
