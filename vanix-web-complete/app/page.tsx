"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
  return (
    <div className="min-h-screen">
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
