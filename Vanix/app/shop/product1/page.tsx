"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

type Service = {
  id: string;
  title: string;
  desc: string;
  price: number;
};

const PRODUCT: Service = {
  id: "website",
  title: "Website from scratch",
  desc: "Професионален бизнес сайт, изграден от нулата.",
  price: 1500,
};

export default function WebsiteProductPage() {
  const [accountOpen, setAccountOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [added, setAdded] = useState(false);

  function addToCart(service: Service) {
    // Тук по-късно ще вържем реалната количка / контекст
    console.log("Add to cart:", service);
    setAdded(true);
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

                <Link href="/contacts" className="group relative">
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
                        (Тук по-късно ще показваме реалната количка.)
                      </div>
                      <div className="px-4 py-2 border-t">
                        <Link
                          href="/shop"
                          className="block text-center text-indigo-600 hover:underline text-sm"
                        >
                          Back to shop
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
        {/* ГОРНА КАРТА – ЗАГЛАВИЕ + ЦЕНА + CTA */}
        <section className="mb-8">
          <div className="bg-white rounded-2xl shadow p-6 flex flex-col lg:flex-row gap-6">
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                Website from scratch
              </h1>
              <p className="text-sm text-gray-600 mt-2">
                Професионален уебсайт, изграден специално за твоя бранд — без
                шаблони, без компромиси. Оптимизиран за скорост, SEO и реални
                клиенти.
              </p>

              <div className="mt-4 flex items-center gap-4">
                <span className="text-2xl font-extrabold text-indigo-700">
                  €{PRODUCT.price}
                </span>
                <span className="text-xs text-gray-500">
                  * Възможна е индивидуална оферта при по-сложни проекти.
                </span>
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  onClick={() => addToCart(PRODUCT)}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700"
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

              {added && (
                <p className="mt-3 text-xs text-green-600">
                  ✔ Product added (симулирано – по-късно ще вържем реалната количка)
                </p>
              )}
            </div>

            {/* Главно място за снимка */}
            <div className="w-full lg:w-64 h-40 lg:h-44 rounded-xl bg-gray-100 flex items-center justify-center overflow-hidden">
              {/* Смени снимката с реален пример, когато имаш */}
              <Image
                src="/examples/website-main.png"
                alt="Website example"
                width={400}
                height={260}
                className="object-cover"
              />
            </div>
          </div>
        </section>

        {/* ДЪЛГО ОПИСАНИЕ */}
        <section className="mb-8">
          <div className="bg-white rounded-2xl shadow p-6 text-gray-900">
            <h2 className="text-xl font-bold mb-3">
              Какво включва услугата?
            </h2>
            <p className="text-sm text-gray-700 mb-3">
              Когато избереш <b>Website from scratch</b>, ние създаваме сайт,
              който е изцяло съобразен с твоята идея, бранд и цели. Не
              използваме готови теми и шаблони – всеки проект започва от празен
              файл и стига до напълно завършен уебсайт.
            </p>

            <ul className="text-sm text-gray-700 list-disc list-inside space-y-1 mb-4">
              <li>Индивидуален дизайн според бранда</li>
              <li>Респонсив дизайн – работи отлично на телефон, таблет и десктоп</li>
              <li>Бързо зареждане и добра оптимизация</li>
              <li>Базова SEO оптимизация (title, description, структура)</li>
              <li>Интеграция с контактни форми, социални мрежи и др.</li>
            </ul>

            <h3 className="text-base font-semibold mb-2">
              Процес на работа:
            </h3>
            <ol className="text-sm text-gray-700 list-decimal list-inside space-y-1">
              <li>Кратко интервю за целите на сайта (онлайн среща или чат).</li>
              <li>Създаване на wireframe и структура на страниците.</li>
              <li>Дизайн на ключовите страници (home, about, services, contact).</li>
              <li>Фронтенд + бекенд разработка (ако е необходимо).</li>
              <li>Тестване, корекции и финален deploy.</li>
            </ol>
          </div>
        </section>

        {/* ПРИМЕРИ / СНИМКИ */}
        <section>
          <div className="bg-white rounded-2xl shadow p-6 text-gray-900">
            <h2 className="text-xl font-bold mb-4">Примери и визуални идеи</h2>
            <p className="text-sm text-gray-700 mb-4">
              Тук можеш да добавиш реални или демо проекти, които показват стил
              и качество. В момента са сложени примерни placeholder-и. Когато
              имаш собствени сайтове за портфолио, просто замени снимките.
            </p>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="rounded-xl border bg-gray-50 overflow-hidden">
                <div className="h-32 bg-gray-100 flex items-center justify-center">
                  <Image
                    src="/examples/website-1.png"
                    alt="Example website 1"
                    width={300}
                    height={200}
                    className="object-cover"
                  />
                </div>
                <div className="px-3 py-2">
                  <p className="text-xs font-semibold text-gray-900">
                    Modern Business Landing
                  </p>
                  <p className="text-[11px] text-gray-600">
                    Един екран, фокусиран върху конверсии и ясно послание.
                  </p>
                </div>
              </div>

              <div className="rounded-xl border bg-gray-50 overflow-hidden">
                <div className="h-32 bg-gray-100 flex items-center justify-center">
                  <Image
                    src="/examples/website-2.png"
                    alt="Example website 2"
                    width={300}
                    height={200}
                    className="object-cover"
                  />
                </div>
                <div className="px-3 py-2">
                  <p className="text-xs font-semibold text-gray-900">
                    Portfolio / Personal Brand
                  </p>
                  <p className="text-[11px] text-gray-600">
                    Подходящ за фрийлансъри, артисти и създатели на съдържание.
                  </p>
                </div>
              </div>

              <div className="rounded-xl border bg-gray-50 overflow-hidden">
                <div className="h-32 bg-gray-100 flex items-center justify-center">
                  <Image
                    src="/examples/website-3.png"
                    alt="Example website 3"
                    width={300}
                    height={200}
                    className="object-cover"
                  />
                </div>
                <div className="px-3 py-2">
                  <p className="text-xs font-semibold text-gray-900">
                    E-commerce Preview
                  </p>
                  <p className="text-[11px] text-gray-600">
                    Продуктов листинг, категории и CTA бутони за покупки.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 text-xs text-gray-500">
              * Снимките са примерни – когато имаш реални проекти, можеш да
              смениш пътищата в <code>src="/examples/..."</code> с твои
              изображения.
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
