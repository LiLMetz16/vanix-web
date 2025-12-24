"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

type Service = {
  id: string;
  slug: string;
  title: string;
  desc: string;
  price: number;
};

type ServiceInCart = Service & { effectivePrice: number };

const SERVICES: Service[] = [
  {
    id: "website",
    slug: "product1",
    title: "Website from scratch",
    desc: "Професионален бизнес сайт, изграден от нулата.",
    price: 1500,
  },
  {
    id: "webapp",
    slug: "product2",
    title: "Web app from scratch",
    desc: "Custom web приложение с backend и frontend.",
    price: 3000,
  },
  {
    id: "desktop",
    slug: "product3",
    title: "Desktop app from scratch",
    desc: "Десктоп софтуер за Windows/Mac.",
    price: 2500,
  },
  {
    id: "ui",
    slug: "product4",
    title: "UI design",
    desc: "Интерфейс, компоненти и визуален стил.",
    price: 800,
  },
  {
    id: "ux",
    slug: "product5",
    title: "UX design",
    desc: "Потребителски потоци, структура и wireframes.",
    price: 700,
  },
];

export default function ShopPage() {
  const [accountOpen, setAccountOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState<Service[]>([]);

  function addToCart(service: Service) {
    setCart((prev) => [...prev, service]);
  }

  function removeFromCart(index: number) {
    setCart((prev) => prev.filter((_, i) => i !== index));
  }

  const hasDev = cart.some((s) =>
    ["website", "webapp", "desktop"].includes(s.id)
  );

  const cartWithDiscount: ServiceInCart[] = cart.map((s) => {
    let effectivePrice = s.price;
    if (hasDev && (s.id === "ui" || s.id === "ux")) {
      effectivePrice = s.price / 2;
    }
    return { ...s, effectivePrice };
  });

  const total = cartWithDiscount.reduce(
    (sum, s) => sum + s.effectivePrice,
    0
  );

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
                    <div className="absolute right-0 mt-2 w-72 bg-white border rounded-xl shadow-xl z-30 text-gray-900 text-sm">
                      <div className="px-4 py-3 border-b font-semibold text-gray-900">
                        Cart
                      </div>

                      <div className="max-h-64 overflow-auto">
                        {cartWithDiscount.length === 0 && (
                          <div className="px-4 py-4 text-gray-700 text-sm">
                            Your cart is empty.
                          </div>
                        )}

                        {cartWithDiscount.map((item, index) => (
                          <div
                            key={index}
                            className="px-4 py-2 flex items-center justify-between text-sm"
                          >
                            <div>
                              <div className="font-medium">{item.title}</div>
                              <div className="text-xs text-gray-600">
                                €{item.effectivePrice.toFixed(2)}
                              </div>
                            </div>
                            <button
                              className="text-red-500 text-xs"
                              onClick={() => removeFromCart(index)}
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>

                      <div className="px-4 py-2 border-t flex items-center justify-between">
                        <span className="font-semibold text-xs">
                          Total: €{total.toFixed(2)}
                        </span>
                        <button
                          className="px-3 py-1 rounded-lg bg-indigo-600 text-white text-xs hover:bg-indigo-700"
                          onClick={() =>
                            alert("Тук по-късно ще вържем реална поръчка и запис в база.")
                          }
                        >
                          Checkout
                        </button>
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
        <h1 className="text-3xl font-bold text-white drop-shadow mb-3">
          Shop
        </h1>
        <p className="text-white/95 mb-8 max-w-2xl text-base">
          Избери комбинация от разработка и дизайн. Когато комбинираш
          разработка (website / web app / desktop) с UI или UX дизайн, дизайнът
          е на <b>половин цена</b>.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-2xl shadow p-5"
            >
              {/* ЛИНК КЪМ /shop/productX */}
              <Link href={`/shop/${service.slug}`}>
                <h2 className="font-semibold text-lg text-gray-900 hover:text-indigo-600 transition-colors cursor-pointer">
                  {service.title}
                </h2>
              </Link>

              <p className="text-sm text-gray-600 mt-2">{service.desc}</p>

              <div className="mt-4 flex items-center justify-between">
                <span className="font-bold text-indigo-700">
                  €{service.price}
                </span>
                <button
                  onClick={() => addToCart(service)}
                  className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm hover:bg-indigo-700"
                >
                  Add to cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
