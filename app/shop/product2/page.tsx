"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Product2Page() {
  const [accountOpen, setAccountOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

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
                      setAccountOpen((prev) => !prev);
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
                      <button className="w-full text-left px-4 py-2 hover:bg-gray-100">
                        Log out
                      </button>
                    </div>
                  )}
                </div>

                {/* Cart */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setCartOpen((prev) => !prev);
                      setAccountOpen(false);
                    }}
                    className="w-10 h-10 rounded-full border border-gray-300 flex justify-center items-center bg-white/90 hover:bg-gray-100 text-lg transition hover:scale-105"
                  >
                    🛒
                  </button>

                  {cartOpen && (
                    <div className="absolute right-0 mt-2 w-60 bg-white border rounded-xl shadow-xl z-30 text-gray-900 text-sm">
                      <div className="px-4 py-3 border-b font-semibold">
                        Cart
                      </div>
                      <div className="px-4 py-4 text-sm text-gray-700">
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
        {/* HERO CARD */}
        <section className="mb-8">
          <div className="bg-white rounded-2xl shadow p-6 flex flex-col lg:flex-row gap-6">
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                Web app from scratch
              </h1>
              <p className="text-sm text-gray-700 mt-2">
                Custom web приложение, изградено от нулата – с отделен frontend
                и backend, оптимизирано за скорост, сигурност и скалируемост.
                Подходящо за вътрешни системи, SaaS продукти, админ панели,
                CRM/ERP решения и много други.
              </p>

              <div className="mt-4 flex items-center gap-4">
                <span className="text-2xl font-extrabold text-indigo-700">
                  €3000
                </span>
                <span className="text-xs text-gray-500">
                  * Цената е ориентировъчна. При по-сложни функционалности се
                  изготвя индивидуална оферта.
                </span>
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700"
                  onClick={() =>
                    alert(
                      "Тук по-късно ще вържем реалната количка и поръчка за Web app."
                    )
                  }
                >
                  Add to cart
                </button>
                <Link
                  href="/contact"
                  className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-800 text-sm font-medium hover:bg-gray-100"
                >
                  Contact us for custom offer
                </Link>
              </div>
            </div>

            {/* Main image placeholder */}
            <div className="w-full lg:w-64 h-40 lg:h-44 rounded-xl bg-gray-100 flex items-center justify-center overflow-hidden">
              {/* Смени с реална снимка когато имаш */}
              <Image
                src="/examples/webapp-main.png"
                alt="Web app example"
                width={400}
                height={260}
                className="object-cover"
              />
            </div>
          </div>
        </section>

        {/* LONG DESCRIPTION */}
        <section className="mb-8">
          <div className="bg-white rounded-2xl shadow p-6 text-gray-900">
            <h2 className="text-xl font-bold mb-3">
              Какво представлява Web app from scratch?
            </h2>
            <p className="text-sm text-gray-700 mb-3">
              Тази услуга е насочена към бизнеси и хора, които имат нужда от
              реално работеща система – не просто сайт, а приложение, в което
              потребителите могат да влизат, да работят с данни, да управляват
              процеси или да ползват услуга онлайн.
            </p>
            <p className="text-sm text-gray-700 mb-3">
              Всеки проект започва от идеята и нуждите ти – обсъждаме какви
              роли ще има (admin, user, moderator), какви модули са нужни
              (dashboard, статистики, формуляри, файлове, плащания и т.н.) и
              какво е бъдещото развитие на системата.
            </p>

            <h3 className="text-base font-semibold mb-2">
              Включени компоненти:
            </h3>
            <ul className="text-sm text-gray-700 list-disc list-inside space-y-1 mb-4">
              <li>Frontend приложение (React / Next.js)</li>
              <li>Backend API (REST или GraphQL според нуждите)</li>
              <li>База данни и модел на данните</li>
              <li>Система за автентикация (login, register, роли)</li>
              <li>Админ панел / Dashboard за управление</li>
              <li>Интеграции с външни услуги (плащания, email, 3rd party APIs)</li>
            </ul>

            <h3 className="text-base font-semibold mb-2">
              Процес на работа:
            </h3>
            <ol className="text-sm text-gray-700 list-decimal list-inside space-y-1">
              <li>Разговор за целите на приложението и основните сценарии.</li>
              <li>Изготвяне на техническо задание и архитектура.</li>
              <li>Скициране на UI/UX за основните екрани.</li>
              <li>Паралелна разработка на frontend и backend.</li>
              <li>Тестване, корекции, оптимизация и деплой.</li>
            </ol>
          </div>
        </section>

        {/* EXAMPLES / SHOWCASE */}
        <section>
          <div className="bg-white rounded-2xl shadow p-6 text-gray-900">
            <h2 className="text-xl font-bold mb-4">
              Примери за типове web приложения
            </h2>
            <p className="text-sm text-gray-700 mb-4">
              По-долу са няколко примерни категории web приложения, които могат
              да бъдат изградени чрез тази услуга. Когато имаш реални
              проекти/портфолио, просто замени снимките с твои.
            </p>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="rounded-xl border bg-gray-50 overflow-hidden">
                <div className="h-32 bg-gray-100 flex items-center justify-center">
                  <Image
                    src="/examples/webapp-1.png"
                    alt="Admin dashboard example"
                    width={300}
                    height={200}
                    className="object-cover"
                  />
                </div>
                <div className="px-3 py-2">
                  <p className="text-xs font-semibold text-gray-900">
                    Admin Dashboard / CRM
                  </p>
                  <p className="text-[11px] text-gray-600">
                    Управление на клиенти, заявки, статистики и вътрешни
                    процеси.
                  </p>
                </div>
              </div>

              <div className="rounded-xl border bg-gray-50 overflow-hidden">
                <div className="h-32 bg-gray-100 flex items-center justify-center">
                  <Image
                    src="/examples/webapp-2.png"
                    alt="SaaS web app example"
                    width={300}
                    height={200}
                    className="object-cover"
                  />
                </div>
                <div className="px-3 py-2">
                  <p className="text-xs font-semibold text-gray-900">
                    SaaS платформа
                  </p>
                  <p className="text-[11px] text-gray-600">
                    Онлайн услуга с абонаменти, потребителски акаунти и
                    разделено по роли съдържание.
                  </p>
                </div>
              </div>

              <div className="rounded-xl border bg-gray-50 overflow-hidden">
                <div className="h-32 bg-gray-100 flex items-center justify-center">
                  <Image
                    src="/examples/webapp-3.png"
                    alt="Internal tools example"
                    width={300}
                    height={200}
                    className="object-cover"
                  />
                </div>
                <div className="px-3 py-2">
                  <p className="text-xs font-semibold text-gray-900">
                    Internal tools
                  </p>
                  <p className="text-[11px] text-gray-600">
                    Вътрешни панели за екипи – управление на документи, задачи,
                    инвентар или ресурси.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 text-xs text-gray-500">
              * Пътищата към снимките са примерни – просто ги замени с реални
              файлове в <code>/public/examples/</code>, когато имаш материали.
            </div>

            <div className="mt-6">
              <Link
                href="/shop"
                className="text-indigo-600 text-sm hover:underline"
              >
                ← Back to shop
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
