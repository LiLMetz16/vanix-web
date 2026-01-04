"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { PRODUCTS } from "@/lib/types/products";
import type { Product } from "@/lib/types/products";
import type { ProductCategory } from "@/lib/types/products";

type CartItem = {
  productId: string;
  qty: number;
};

const STORAGE_KEY = "vanix_cart_v1";

const USER_KEYS_TO_TRY = ["vanix_user_v1", "vanix_user", "user", "currentUser", "loggedUser"] as const;

type SessionUser = { username: string; email?: string; role?: "user" | "admin" };

const ORDER_KEYS_TO_TRY = ["vanix_orders_v1", "vanix_orders", "orders", "orderHistory"] as const;

type OrderLike = { createdAt?: string; created_at?: string; date?: string; time?: string };

function eur(n: number) {
  return new Intl.NumberFormat("bg-BG", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(n);
}

function clampQty(n: number) {
  if (Number.isNaN(n) || !Number.isFinite(n)) return 1;
  return Math.max(1, Math.min(99, Math.floor(n)));
}

function safeString(v: unknown): string {
  if (typeof v === "string") return v.trim();
  return "";
}

function usernameFromEmail(email: string) {
  const e = email.trim();
  const at = e.indexOf("@");
  if (at > 0) return e.slice(0, at);
  return e;
}

function pickUsername(obj: any): { username: string; email?: string; role?: "user" | "admin" } | null {
  if (!obj || typeof obj !== "object") return null;

  const username =
    safeString(obj.username) ||
    safeString(obj.user_name) ||
    safeString(obj.displayName) ||
    safeString(obj.display_name) ||
    safeString(obj.name) ||
    safeString(obj.full_name) ||
    safeString(obj.fullName);

  const email = safeString(obj.email) || safeString(obj.mail);

  const roleRaw = safeString(obj.role).toLowerCase();
  const role: "user" | "admin" | undefined = roleRaw === "admin" ? "admin" : roleRaw === "user" ? "user" : undefined;

  const finalUsername = username || (email ? usernameFromEmail(email) : "");
  if (!finalUsername) return null;

  return { username: finalUsername, email: email || undefined, role };
}

function tryParseUserFromRaw(raw: string | null): SessionUser | null {
  if (!raw) return null;

  try {
    const parsed: any = JSON.parse(raw);

    const direct = pickUsername(parsed);
    if (direct) return direct;

    if (parsed?.user) {
      const nested = pickUsername(parsed.user);
      if (nested) return nested;
    }
    if (parsed?.data?.user) {
      const nested2 = pickUsername(parsed.data.user);
      if (nested2) return nested2;
    }

    if (parsed?.user && parsed.user?.user_metadata) {
      const meta = parsed.user.user_metadata;
      const fromMeta =
        safeString(meta.username) ||
        safeString(meta.user_name) ||
        safeString(meta.full_name) ||
        safeString(meta.name) ||
        safeString(meta.display_name);

      const email = safeString(parsed.user.email);

      const roleRaw = safeString(meta.role ?? parsed.user.role).toLowerCase();
      const role: "user" | "admin" | undefined =
        roleRaw === "admin" ? "admin" : roleRaw === "user" ? "user" : undefined;

      const finalUsername = fromMeta || (email ? usernameFromEmail(email) : "");
      if (finalUsername) return { username: finalUsername, email: email || undefined, role };
    }
  } catch {
    // ignore
  }

  const s = String(raw).trim();
  const looksLikeJson = s.startsWith("{") || s.startsWith("[");
  if (looksLikeJson) return null;

  if (s && s.length <= 80) return { username: s };
  return null;
}

function readUserFromStorage(): SessionUser | null {
  for (const k of USER_KEYS_TO_TRY) {
    try {
      const raw = localStorage.getItem(k);
      const u = tryParseUserFromRaw(raw);
      if (u) return u;
    } catch {
      // ignore
    }
  }

  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (!k) continue;
      if (k.startsWith("sb-") && k.endsWith("-auth-token")) {
        const raw = localStorage.getItem(k);
        const u = tryParseUserFromRaw(raw);
        if (u) return u;
      }
    }
  } catch {
    // ignore
  }

  return null;
}

function parseOrders(raw: string | null): Date[] {
  if (!raw) return [];
  try {
    const parsed: any = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    const dates: Date[] = [];
    for (const it of parsed as OrderLike[]) {
      const s =
        safeString((it as any)?.createdAt) ||
        safeString((it as any)?.created_at) ||
        safeString((it as any)?.date) ||
        safeString((it as any)?.time);

      if (!s) continue;

      const d = new Date(s);
      if (!Number.isNaN(d.getTime())) dates.push(d);
    }
    return dates.sort((a, b) => a.getTime() - b.getTime());
  } catch {
    return [];
  }
}

function readOrdersFromStorage(): Date[] {
  for (const k of ORDER_KEYS_TO_TRY) {
    try {
      const raw = localStorage.getItem(k);
      const dates = parseOrders(raw);
      if (dates.length) return dates;
    } catch {
      // ignore
    }
  }
  return [];
}

type RangeKey = "day" | "week" | "month" | "3m" | "6m" | "year";

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function addDays(d: Date, days: number) {
  const x = new Date(d);
  x.setDate(x.getDate() + days);
  return x;
}

function addMonths(d: Date, months: number) {
  const x = new Date(d);
  x.setMonth(x.getMonth() + months);
  return x;
}

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function buildSeries(orderDates: Date[], range: RangeKey) {
  const now = new Date();
  const today0 = startOfDay(now);

  let points = 12;
  let from = today0;
  let step: "hour" | "day" | "week" | "month" = "day";

  if (range === "day") {
    points = 24;
    from = addDays(today0, 0);
    step = "hour";
  } else if (range === "week") {
    points = 7;
    from = addDays(today0, -6);
    step = "day";
  } else if (range === "month") {
    points = 30;
    from = addDays(today0, -29);
    step = "day";
  } else if (range === "3m") {
    points = 12;
    from = addDays(today0, -(7 * 11));
    step = "week";
  } else if (range === "6m") {
    points = 12;
    from = addDays(today0, -(14 * 11));
    step = "week";
  } else {
    points = 12;
    from = addMonths(today0, -11);
    step = "month";
  }

  const labels: string[] = [];
  const values = new Array(points).fill(0);

  for (let i = 0; i < points; i++) {
    if (step === "hour") {
      labels.push(String(i).padStart(2, "0") + ":00");
    } else if (step === "day") {
      const d = addDays(from, i);
      labels.push(`${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}`);
    } else if (step === "week") {
      const d = addDays(from, i * 7);
      labels.push(`${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}`);
    } else {
      const d = addMonths(from, i);
      labels.push(`${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getFullYear()).slice(-2)}`);
    }
  }

  for (const od of orderDates) {
    if (step === "hour") {
      if (!isSameDay(od, now)) continue;
      const h = od.getHours();
      if (h >= 0 && h < 24) values[h] += 1;
      continue;
    }

    if (step === "day") {
      const d0 = startOfDay(od);
      const idx = Math.floor((d0.getTime() - from.getTime()) / (24 * 3600 * 1000));
      if (idx >= 0 && idx < points) values[idx] += 1;
      continue;
    }

    if (step === "week") {
      const d0 = startOfDay(od);
      const idx = Math.floor((d0.getTime() - from.getTime()) / (7 * 24 * 3600 * 1000));
      if (idx >= 0 && idx < points) values[idx] += 1;
      continue;
    }

    const y = od.getFullYear();
    const m = od.getMonth();
    const fy = from.getFullYear();
    const fm = from.getMonth();
    const idx = (y - fy) * 12 + (m - fm);
    if (idx >= 0 && idx < points) values[idx] += 1;
  }

  return { labels, values };
}

function makeSparkPath(values: number[], w: number, h: number, pad: number) {
  const max = Math.max(1, ...values);
  const n = values.length;
  const innerW = w - pad * 2;
  const innerH = h - pad * 2;

  const pts = values.map((v, i) => {
    const x = pad + (n === 1 ? 0 : (i * innerW) / (n - 1));
    const y = pad + (1 - v / max) * innerH;
    return { x, y };
  });

  let d = "";
  for (let i = 0; i < pts.length; i++) {
    d += i === 0 ? `M ${pts[i].x.toFixed(2)} ${pts[i].y.toFixed(2)}` : ` L ${pts[i].x.toFixed(2)} ${pts[i].y.toFixed(2)}`;
  }
  return d;
}

/**
 * IMPORTANT:
 * We store ONLY the filename in PRODUCTS (e.g. "starterimage.png"),
 * but Next/Image needs a path from /public.
 * Your files must be in: /public/shop/<filename>
 */
function productImage(filename: string) {
  return `/shop/${filename}`;
}

export default function ShopPage() {
  const [accountOpen, setAccountOpen] = useState(false);
  const [adminStatsOpen, setAdminStatsOpen] = useState(false);
  const [range, setRange] = useState<RangeKey>("week");

  const [cartOpen, setCartOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<ProductCategory | "All">("All");
  const [onlyFeatured, setOnlyFeatured] = useState(false);
  const [sort, setSort] = useState<"featured" | "priceAsc" | "priceDesc" | "title">("featured");

  const [cart, setCart] = useState<CartItem[]>([]);
  const [user, setUser] = useState<SessionUser | null>(null);
  const [orders, setOrders] = useState<Date[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as CartItem[];
      if (Array.isArray(parsed)) setCart(parsed);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    } catch {
      // ignore
    }
  }, [cart]);

  useEffect(() => {
    function syncAll() {
      setUser(readUserFromStorage());
      setOrders(readOrdersFromStorage());
    }

    syncAll();

    function onStorage() {
      syncAll();
    }
    function onFocus() {
      syncAll();
    }
    function onVisibility() {
      if (document.visibilityState === "visible") syncAll();
    }

    window.addEventListener("storage", onStorage);
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisibility);

    const interval = window.setInterval(syncAll, 1200);

    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisibility);
      window.clearInterval(interval);
    };
  }, []);

  function logout() {
    for (const k of USER_KEYS_TO_TRY) {
      try {
        localStorage.removeItem(k);
      } catch {
        // ignore
      }
    }
    setUser(null);
    setAccountOpen(false);
    setAdminStatsOpen(false);
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setAccountOpen(false);
        setAdminStatsOpen(false);
      }
    }
    function onClick() {
      setAccountOpen(false);
      setAdminStatsOpen(false);
    }
    function onScroll() {
      setAccountOpen(false);
      setAdminStatsOpen(false);
    }

    window.addEventListener("keydown", onKey);
    window.addEventListener("click", onClick);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("click", onClick);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const productById = useMemo(() => {
    const map = new Map<string, Product>();
    for (const p of PRODUCTS) map.set(p.id, p);
    return map;
  }, []);

  const filteredProducts = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = [...PRODUCTS];

    if (category !== "All") list = list.filter((p) => p.category === category);
    if (onlyFeatured) list = list.filter((p) => !!p.featured);

    if (q) {
      list = list.filter((p) => {
        const hay = `${p.title} ${p.subtitle} ${p.category} ${p.tags.join(" ")}`.toLowerCase();
        return hay.includes(q);
      });
    }

    switch (sort) {
      case "priceAsc":
        list.sort((a, b) => a.priceEUR - b.priceEUR);
        break;
      case "priceDesc":
        list.sort((a, b) => b.priceEUR - a.priceEUR);
        break;
      case "title":
        list.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "featured":
      default:
        list.sort((a, b) => Number(!!b.featured) - Number(!!a.featured) || a.title.localeCompare(b.title));
        break;
    }

    return list;
  }, [query, category, onlyFeatured, sort]);

  const cartCount = useMemo(() => cart.reduce((sum, it) => sum + it.qty, 0), [cart]);

  const cartLines = useMemo(() => {
    return cart
      .map((it) => {
        const p = productById.get(it.productId);
        if (!p) return null;
        return { product: p, qty: it.qty, lineTotal: p.priceEUR * it.qty };
      })
      .filter(Boolean) as { product: Product; qty: number; lineTotal: number }[];
  }, [cart, productById]);

  const cartTotal = useMemo(() => cartLines.reduce((sum, l) => sum + l.lineTotal, 0), [cartLines]);

  function addToCart(productId: string) {
    setCart((prev) => {
      const idx = prev.findIndex((x) => x.productId === productId);
      if (idx === -1) return [...prev, { productId, qty: 1 }];
      const copy = [...prev];
      copy[idx] = { ...copy[idx], qty: clampQty(copy[idx].qty + 1) };
      return copy;
    });
    setCartOpen(true);
  }

  function setQty(productId: string, qty: number) {
    const q = clampQty(qty);
    setCart((prev) => prev.map((x) => (x.productId === productId ? { ...x, qty: q } : x)));
  }

  function removeFromCart(productId: string) {
    setCart((prev) => prev.filter((x) => x.productId !== productId));
  }

  function clearCart() {
    setCart([]);
  }

  const isLogged = !!user?.username;
  const displayUsername = isLogged ? user!.username : "Sign in";
  const isAdmin = user?.role === "admin";

  const series = useMemo(() => buildSeries(orders, range), [orders, range]);
  const sparkW = 220;
  const sparkH = 60;
  const sparkPad = 6;
  const sparkPath = useMemo(() => makeSparkPath(series.values, sparkW, sparkH, sparkPad), [series.values]);
  const totalOrdersInRange = useMemo(() => series.values.reduce((a, b) => a + b, 0), [series.values]);

  function RangeBtn({ k, label }: { k: RangeKey; label: string }) {
    const active = range === k;
    return (
      <button
        onClick={() => setRange(k)}
        className={`px-2 py-1 rounded-lg text-[11px] border transition ${
          active ? "bg-black text-white border-black" : "bg-white text-gray-900 border-gray-200 hover:bg-gray-100"
        }`}
      >
        {label}
      </button>
    );
  }

  return (
    <div className="min-h-screen bg-animated-gradient text-black">
      <header className="w-full pt-4 relative z-[50]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="relative z-[100]">
            <div className="relative rounded-2xl bg-white/80 backdrop-blur shadow-lg border border-white/60 overflow-visible">
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-indigo-500 via-pink-500 to-emerald-400 opacity-80" />

              <div className="flex items-center justify-between gap-6 px-5 py-3">
                <div className="flex items-center gap-3">
                  <Link href="/" className="flex items-center gap-3 group">
                    <Image
                      src="/logoChoice1 (1).png"
                      alt="Vanix Logo"
                      width={40}
                      height={40}
                      className="object-contain rounded-xl transition-transform duration-200 group-hover:scale-105"
                    />
                    <div className="flex flex-col leading-tight">
                      <span className="font-extrabold text-xl text-gray-900">Vanix</span>
                      <span className="text-xs text-gray-500">Anton Kabakov &amp; Viktor Kanev</span>
                    </div>
                  </Link>
                </div>

                <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-gray-700">
                  <Link href="/" className="group relative">
                    <span className="transition-colors duration-200 group-hover:text-indigo-600">Home</span>
                    <span className="absolute left-0 -bottom-1 h-[2px] w-0 rounded-full bg-gradient-to-r from-indigo-500 to-sky-400 transition-all duration-200 group-hover:w-full" />
                  </Link>

                  <Link href="/shop" className="group relative">
                    <span className="transition-colors duration-200 group-hover:text-indigo-600">Shop</span>
                    <span className="absolute left-0 -bottom-1 h-[2px] w-0 rounded-full bg-gradient-to-r from-indigo-500 to-sky-400 transition-all duration-200 group-hover:w-full" />
                  </Link>

                  <Link href="/contact" className="group relative">
                    <span className="transition-colors duration-200 group-hover:text-indigo-600">Contact Us</span>
                    <span className="absolute left-0 -bottom-1 h-[2px] w-0 rounded-full bg-gradient-to-r from-indigo-500 to-sky-400 transition-all duration-200 group-hover:w-full" />
                  </Link>
                </nav>

                <div className="flex items-center gap-3">
                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setAccountOpen((v) => !v);
                        setAdminStatsOpen(false);
                      }}
                      className="w-10 h-10 rounded-full border border-gray-300 flex justify-center items-center bg-white/90 hover:bg-gray-100 text-lg transition hover:scale-105"
                      aria-label="Account"
                      title={displayUsername}
                    >
                      👤
                    </button>

                    {accountOpen && (
                      <div
                        className="absolute right-0 top-full mt-2 w-72 bg-white border rounded-xl shadow-2xl z-[99999] text-gray-900 ring-1 ring-black/10 overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="px-4 py-3 border-b bg-white">
                          <div className="text-xs text-gray-500">{isLogged ? "Signed in as" : "Account"}</div>
                          <div className="text-sm font-semibold text-gray-900 truncate">{displayUsername}</div>
                          {isAdmin && (
                            <div className="mt-1 inline-flex items-center rounded-full bg-indigo-600/10 text-indigo-700 text-[11px] px-2 py-0.5">
                              Admin
                            </div>
                          )}
                        </div>

                        {isLogged ? (
                          <>
                            <Link
                              href="/account"
                              className="block px-4 py-2 hover:bg-gray-100 text-gray-900"
                              onClick={() => {
                                setAccountOpen(false);
                                setAdminStatsOpen(false);
                              }}
                            >
                              My Account
                            </Link>

                            {isAdmin && (
                              <div className="border-t">
                                <button
                                  onClick={() => setAdminStatsOpen((v) => !v)}
                                  className="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-900 flex items-center justify-between"
                                >
                                  <span>Statistics</span>
                                  <span className="text-xs text-gray-500">{adminStatsOpen ? "▲" : "▼"}</span>
                                </button>

                                {adminStatsOpen && (
                                  <div className="px-4 pb-4">
                                    <div className="mt-2 rounded-xl border border-gray-200 bg-white p-3">
                                      <div className="flex items-center justify-between gap-2">
                                        <div>
                                          <div className="text-xs text-gray-500">Orders</div>
                                          <div className="text-sm font-semibold text-gray-900">{totalOrdersInRange} total</div>
                                        </div>
                                        <div className="text-xs text-gray-500 text-right">
                                          Range:{" "}
                                          <span className="font-semibold text-gray-900">
                                            {range === "day"
                                              ? "Day"
                                              : range === "week"
                                              ? "Week"
                                              : range === "month"
                                              ? "Month"
                                              : range === "3m"
                                              ? "3 months"
                                              : range === "6m"
                                              ? "6 months"
                                              : "Year"}
                                          </span>
                                        </div>
                                      </div>

                                      <div className="mt-3 flex flex-wrap gap-1.5">
                                        <RangeBtn k="day" label="Day" />
                                        <RangeBtn k="week" label="Week" />
                                        <RangeBtn k="month" label="Month" />
                                        <RangeBtn k="3m" label="3M" />
                                        <RangeBtn k="6m" label="6M" />
                                        <RangeBtn k="year" label="Year" />
                                      </div>

                                      <div className="mt-3 rounded-xl border border-gray-200 bg-gray-50 p-2">
                                        <svg width={sparkW} height={sparkH} viewBox={`0 0 ${sparkW} ${sparkH}`}>
                                          <path d={sparkPath} fill="none" stroke="black" strokeWidth="2" />
                                        </svg>
                                        <div className="mt-1 text-[11px] text-gray-600 flex justify-between">
                                          <span>{series.labels[0] ?? ""}</span>
                                          <span>{series.labels[series.labels.length - 1] ?? ""}</span>
                                        </div>
                                      </div>

                                      <div className="mt-2">
                                        <Link
                                          href="/admin/dashboard"
                                          className="inline-flex w-full justify-center rounded-xl px-4 py-2 text-sm font-medium bg-black text-white hover:bg-black/90 transition"
                                          onClick={() => {
                                            setAccountOpen(false);
                                            setAdminStatsOpen(false);
                                          }}
                                        >
                                          Open Admin Dashboard
                                        </Link>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}

                            <div className="border-t">
                              <button className="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-900" onClick={logout}>
                                Log out
                              </button>
                            </div>
                          </>
                        ) : (
                          <>
                            <Link
                              href="/account"
                              className="block px-4 py-2 hover:bg-gray-100 text-gray-900"
                              onClick={() => {
                                setAccountOpen(false);
                                setAdminStatsOpen(false);
                              }}
                            >
                              Log in
                            </Link>
                            <Link
                              href="/account?mode=register"
                              className="block px-4 py-2 hover:bg-gray-100 text-gray-900"
                              onClick={() => {
                                setAccountOpen(false);
                                setAdminStatsOpen(false);
                              }}
                            >
                              Register
                            </Link>
                          </>
                        )}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      setCartOpen(true);
                      setAccountOpen(false);
                      setAdminStatsOpen(false);
                    }}
                    className="w-10 h-10 rounded-full border border-gray-300 flex justify-center items-center bg-white/90 hover:bg-gray-100 text-lg transition hover:scale-105 relative"
                    aria-label="Cart"
                    title={cartCount > 0 ? `Cart: ${cartCount}` : "Cart"}
                  >
                    🛒
                    {cartCount > 0 && (
                      <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-indigo-600 text-white text-[11px] leading-[18px] text-center">
                        {cartCount}
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-[0] mt-4 rounded-2xl bg-white/80 backdrop-blur shadow-lg border border-white/60 text-black">
            <div className="px-5 py-5">
              <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                <div className="flex-1">
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search products (e.g. website, dashboard, logo...)"
                    className="w-full rounded-2xl px-4 py-3 bg-white/70 border border-white/70 text-black placeholder:text-black/50 outline-none focus:ring-2 focus:ring-black/10"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="rounded-2xl px-4 py-3 bg-white/70 border border-white/70 text-black text-sm outline-none"
                  >
                    <option value="All">All categories</option>
                    <option value="Website">Website</option>
                    <option value="App">App</option>
                    <option value="Design">Design</option>
                    <option value="UI Kit">UI Kit</option>
                    <option value="Other">Other</option>
                  </select>

                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value as any)}
                    className="rounded-2xl px-4 py-3 bg-white/70 border border-white/70 text-black text-sm outline-none"
                  >
                    <option value="featured">Sort: Featured</option>
                    <option value="priceAsc">Sort: Price ↑</option>
                    <option value="priceDesc">Sort: Price ↓</option>
                    <option value="title">Sort: Title</option>
                  </select>

                  <button
                    onClick={() => setOnlyFeatured((v) => !v)}
                    className={`rounded-2xl px-4 py-3 text-sm border transition ${
                      onlyFeatured ? "bg-black text-white border-black" : "bg-white/70 text-black border-white/70 hover:bg-white"
                    }`}
                  >
                    Featured
                  </button>

                  <button
                    onClick={() => {
                      setQuery("");
                      setCategory("All");
                      setOnlyFeatured(false);
                      setSort("featured");
                    }}
                    className="rounded-2xl px-4 py-3 text-sm bg-white/70 text-black border border-white/70 hover:bg-white transition"
                  >
                    Reset
                  </button>
                </div>
              </div>

              <div className="mt-3 text-xs text-black/60">
                Showing <span className="font-semibold text-black">{filteredProducts.length}</span> products
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProducts.map((p) => (
            <article
              key={p.id}
              className="rounded-2xl bg-white/80 backdrop-blur border border-white/60 shadow-lg overflow-hidden text-black"
            >
              <div className="relative w-full aspect-[16/9] overflow-hidden">
                <Image
                  src={productImage(p.image)}
                  alt={p.title}
                  fill
                  quality={90}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-300 hover:scale-110"
                  priority={!!p.featured}
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-black/0 to-black/0" />

                {p.featured && (
                  <div className="absolute top-3 left-3 rounded-full bg-black text-white text-xs px-3 py-1">Featured</div>
                )}
              </div>

              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-base font-semibold text-black">{p.title}</h3>
                    <p className="text-sm text-black/70 mt-1">{p.subtitle}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold text-black">{eur(p.priceEUR)}</div>
                    <div className="text-xs text-black/60">{p.category}</div>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {p.tags.map((t) => (
                    <span key={t} className="text-xs px-3 py-1 rounded-full bg-black/10 border border-black/15 text-black/80">
                      {t}
                    </span>
                  ))}
                </div>

                <div className="mt-5 flex items-center gap-2">
                  <button
                    onClick={() => addToCart(p.id)}
                    className="flex-1 rounded-xl px-4 py-2 text-sm font-medium bg-black text-white hover:bg-black/90 transition"
                  >
                    Add to cart
                  </button>

                  <Link
                    href={`/shop/${p.slug}`}
                    className="rounded-xl px-4 py-2 text-sm font-medium bg-white border border-black/10 text-black hover:bg-black/5 transition"
                  >
                    Details
                  </Link>
                </div>

                <div className="mt-3 text-xs text-black/60">Delivery: source files + setup notes (digital).</div>
              </div>
            </article>
          ))}
        </section>

        <section className="mt-10 rounded-2xl bg-white/80 backdrop-blur border border-white/60 shadow-lg p-6 text-black">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-black">Need something custom?</h2>
              <p className="text-sm text-black/70 mt-1">
                If you want a custom website/app/design tailored to your exact requirements, contact us and we will quote it.
              </p>
            </div>
            <div className="flex gap-2">
              <Link href="/contact" className="rounded-xl px-5 py-3 text-sm font-medium bg-black text-white hover:bg-black/90 transition">
                Contact
              </Link>
              <button
                onClick={() => setCartOpen(true)}
                className="rounded-xl px-5 py-3 text-sm font-medium bg-white text-black border border-black/10 hover:bg-black/5 transition"
              >
                View cart
              </button>
            </div>
          </div>
        </section>
      </main>

      <div className={`fixed inset-0 z-50 transition ${cartOpen ? "pointer-events-auto" : "pointer-events-none"}`}>
        <div
          className={`absolute inset-0 bg-black/40 transition-opacity ${cartOpen ? "opacity-100" : "opacity-0"}`}
          onClick={() => setCartOpen(false)}
        />

        <aside
          className={`absolute right-0 top-0 h-full w-full sm:w-[440px] bg-white text-black shadow-2xl transition-transform ${
            cartOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="h-full flex flex-col">
            <div className="p-5 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-lg font-semibold text-black">Your cart</div>
                  <div className="text-xs text-black/60">{cartCount} item(s)</div>
                </div>
                <button onClick={() => setCartOpen(false)} className="rounded-xl px-3 py-2 text-sm bg-black/5 text-black hover:bg-black/10 transition">
                  Close
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-auto p-5">
              {cartLines.length === 0 ? (
                <div className="rounded-2xl border border-black/10 bg-black/5 p-5 text-sm text-black/70">Cart is empty. Add a product from the shop.</div>
              ) : (
                <div className="space-y-3">
                  {cartLines.map(({ product, qty, lineTotal }) => (
                    <div key={product.id} className="rounded-2xl border border-black/10 p-4 flex gap-3">
                      <div className="relative h-16 w-16 rounded-xl overflow-hidden border border-black/10">
                        <Image
                          src={productImage(product.image)}
                          alt={product.title}
                          fill
                          quality={80}
                          sizes="64px"
                          className="object-cover"
                        />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="text-sm font-semibold text-black">{product.title}</div>
                            <div className="text-xs text-black/60">{eur(product.priceEUR)} each</div>
                          </div>
                          <button
                            onClick={() => removeFromCart(product.id)}
                            className="text-xs rounded-lg px-2 py-1 bg-black/5 text-black hover:bg-black/10 transition"
                          >
                            Remove
                          </button>
                        </div>

                        <div className="mt-3 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <button onClick={() => setQty(product.id, qty - 1)} className="h-9 w-9 rounded-xl bg-black text-white hover:bg-black/90 transition">
                              -
                            </button>
                            <input
                              value={qty}
                              onChange={(e) => setQty(product.id, Number(e.target.value))}
                              className="w-14 h-9 rounded-xl border border-black/10 text-black text-center outline-none"
                              inputMode="numeric"
                            />
                            <button onClick={() => setQty(product.id, qty + 1)} className="h-9 w-9 rounded-xl bg-black text-white hover:bg-black/90 transition">
                              +
                            </button>
                          </div>

                          <div className="text-sm font-semibold text-black">{eur(lineTotal)}</div>
                        </div>

                        <div className="mt-3">
                          <Link href={`/shop/${product.slug}`} className="text-xs underline text-black/70 hover:text-black">
                            View details
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-5 border-t">
              <div className="flex items-center justify-between">
                <div className="text-sm text-black/70">Total</div>
                <div className="text-lg font-semibold text-black">{eur(cartTotal)}</div>
              </div>

              <div className="mt-4 flex gap-2">
                <button
                  onClick={clearCart}
                  className="flex-1 rounded-xl px-4 py-3 text-sm font-medium bg-white text-black border border-black/10 hover:bg-black/5 transition disabled:opacity-50"
                  disabled={cartLines.length === 0}
                >
                  Clear
                </button>

                <button
                  onClick={() => {
                    if (cartLines.length === 0) return;
                    alert("Checkout placeholder. Add your real payment flow here.");
                  }}
                  className="flex-1 rounded-xl px-4 py-3 text-sm font-medium bg-black text-white hover:bg-black/90 transition disabled:opacity-50"
                  disabled={cartLines.length === 0}
                >
                  Checkout
                </button>
              </div>

              <div className="mt-3 text-xs text-black/60">Note: This is a digital products cart UI. Integrate Stripe/Supabase checkout when you are ready.</div>
            </div>
          </div>
        </aside>
      </div>

      <footer className="py-10">
        <div className="max-w-6xl mx-auto px-6 text-center text-xs text-black/70">© {new Date().getFullYear()} Vanix. All rights reserved.</div>
      </footer>
    </div>
  );
}
