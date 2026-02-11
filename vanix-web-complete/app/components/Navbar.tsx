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
    const unsub = onAuthChanged((u) =>
      setUser(u ? { ...u, role: u.role as StoredUser["role"] } : null)
    );
    return () => unsub();
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const target = e.target as HTMLElement;
      if (!target.closest("[data-dropdown]")) {
        setAccountOpen(false);
      }
    }
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  async function handleLogout() {
    await signOut();
    setAccountOpen(false);
  }

  const isActive = (href: string) =>
    pathname === href ? "nav-link active" : "nav-link";

  return (
    <>
      <header style={{ width: "100%", paddingTop: "24px", position: "relative", zIndex: 50 }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 24px" }}>
          <div
            style={{
              position: "relative",
              borderRadius: "var(--radius-xl)",
              background: "var(--surface-primary)",
              border: "1px solid var(--border-subtle)",
              boxShadow: "var(--shadow-md)",
            }}
          >
            {/* Gradient accent line */}
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: "3px",
                borderRadius: "0 0 var(--radius-xl) var(--radius-xl)",
                background: "linear-gradient(90deg, var(--brand), var(--sky), var(--mint))",
                opacity: 0.9,
                pointerEvents: "none",
              }}
            />

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "24px",
                padding: "20px 32px",
              }}
            >
              {/* Logo + Brand */}
              <Link href="/" style={{ display: "flex", alignItems: "center", gap: "14px", textDecoration: "none" }}>
                <Image
                  src="/logo.png"
                  alt="Vanix Logo"
                  width={46}
                  height={46}
                  style={{ objectFit: "contain", borderRadius: "var(--radius-md)" }}
                />
                <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.2 }}>
                  <span
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 800,
                      fontSize: "1.5rem",
                      color: "var(--ink)",
                    }}
                  >
                    Vanix
                  </span>
                  <span style={{ fontSize: "0.8rem", color: "var(--slate)" }}>
                    Anton Kabakov & Viktor Kanev
                  </span>
                </div>
              </Link>

              {/* Navigation */}
              <nav
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "28px",
                }}
                className="hidden md:flex"
              >
                <Link href="/" className={isActive("/")}>Home</Link>
                <Link href="/shop" className={isActive("/shop")}>Shop</Link>
                <Link href="/portfolio" className={isActive("/portfolio")}>Portfolio</Link>
                <Link href="/about" className={isActive("/about")}>About Us</Link>
                <Link href="/contact" className={isActive("/contact")}>Contact Us</Link>
              </nav>

              {/* Icons: Cart + Account */}
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                {/* Shopping Cart */}
                <button
                  type="button"
                  onClick={() => {
                    setCartOpen(!cartOpen);
                    setAccountOpen(false);
                  }}
                  className="nav-icon-btn"
                  aria-label="Shopping Cart"
                >
                  🛒
                </button>

                {/* Account */}
                <div style={{ position: "relative" }} data-dropdown>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setAccountOpen(!accountOpen);
                      setCartOpen(false);
                    }}
                    className="nav-icon-btn"
                    aria-label="Account"
                  >
                    👤
                  </button>

                  {accountOpen && (
                    <div className="dropdown-menu" style={{ minWidth: "220px" }}>
                      {!user ? (
                        <Link
                          href="/auth"
                          onClick={() => setAccountOpen(false)}
                          className="btn btn-primary btn-sm"
                          style={{ width: "100%", borderRadius: "var(--radius-md)" }}
                        >
                          Login
                        </Link>
                      ) : (
                        <>
                          {/* User info header */}
                          <div
                            style={{
                              padding: "10px 14px",
                              marginBottom: "6px",
                              borderRadius: "var(--radius-md)",
                              background: "var(--surface-interactive)",
                            }}
                          >
                            <div style={{ fontWeight: 600, fontSize: "0.9rem", color: "var(--ink)" }}>
                              {user.username ?? user.username ?? "User"}
                            </div>
                            <div style={{ fontSize: "0.8rem", color: "var(--slate)" }}>
                              {user.email ?? ""}
                            </div>
                            {user.role && (
                              <span className="badge badge-brand" style={{ marginTop: "6px" }}>
                                {user.role}
                              </span>
                            )}
                          </div>

                          <Link
                            href="/account"
                            onClick={() => setAccountOpen(false)}
                            className="dropdown-item"
                          >
                            My Account
                          </Link>

                          {user.role === "admin" ? (
                            <Link
                              href="/account?tab=dashboard"
                              onClick={() => setAccountOpen(false)}
                              className="dropdown-item"
                            >
                              Dashboard
                            </Link>
                          ) : (
                            <Link
                              href="/account?tab=orders"
                              onClick={() => setAccountOpen(false)}
                              className="dropdown-item"
                            >
                              Order History
                            </Link>
                          )}

                          <div className="dropdown-divider" />

                          <button onClick={handleLogout} className="dropdown-item" style={{ color: "#ef4444" }}>
                            Logout
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ── Cart Sidebar ── */}
      {cartOpen && (
        <>
          <div className="cart-backdrop" onClick={() => setCartOpen(false)} />
          <div className="cart-sidebar">
            {/* Header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "24px",
                borderBottom: "1px solid var(--border-default)",
              }}
            >
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: "1.25rem",
                  color: "var(--ink)",
                }}
              >
                Shopping Cart
              </h2>
              <button
                onClick={() => setCartOpen(false)}
                className="nav-icon-btn"
                style={{ width: "36px", height: "36px", fontSize: "0.9rem" }}
                aria-label="Close cart"
              >
                ✕
              </button>
            </div>

            {/* Cart Items (empty state) */}
            <div style={{ flex: 1, overflow: "auto", padding: "24px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "3.5rem", marginBottom: "16px" }}>🛒</div>
                <p
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    fontSize: "1.1rem",
                    color: "var(--ink)",
                    marginBottom: "6px",
                  }}
                >
                  Your cart is empty
                </p>
                <p style={{ fontSize: "0.9rem", color: "var(--slate)" }}>
                  Add items from the shop to get started
                </p>
              </div>
            </div>

            {/* Footer */}
            <div style={{ borderTop: "1px solid var(--border-default)", padding: "24px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "16px",
                }}
              >
                <span style={{ color: "var(--slate)" }}>Subtotal:</span>
                <span
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    fontSize: "1.25rem",
                    color: "var(--ink)",
                  }}
                >
                  €0
                </span>
              </div>
              <Link
                href="/shop"
                onClick={() => setCartOpen(false)}
                className="btn btn-primary"
                style={{ width: "100%", textAlign: "center" }}
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