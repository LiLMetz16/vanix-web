"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

/* ═══════════════════════════════════════════════════════════
   THEME SYSTEM
   Colors:
   Primary:   #27296d (deep navy), #5e63b6 (brand purple), #a393eb (lavender)
   Accents:   #889E9E (sage), #87CEEB (sky), #F4C2C2 (blush), #DCD0FF (lilac), #BCD4E6 (ice)
   Mint:      #AAF0D1
   Light accent: #a393eb
   ═══════════════════════════════════════════════════════════ */

const THEME_VARS = {
  light: {
    "--background": "#f8f7fc",
    "--background-rgb": "248, 247, 252",
    "--surface-primary": "rgba(255,255,255,0.85)",
    "--surface-secondary": "rgba(163,147,235,0.06)",
    "--surface-elevated": "#ffffff",
    "--ink": "#27296d",
    "--ink-soft": "#3a3d7c",
    "--slate": "#6b6e9b",
    "--silver": "#9d9fbd",
    "--brand": "#5e63b6",
    "--brand-deep": "#27296d",
    "--brand-vivid": "#a393eb",
    "--brand-glow": "rgba(163,147,235,0.14)",
    "--sky": "#87CEEB",
    "--mint": "#AAF0D1",
    "--mint-soft": "#c2f5e0",
    "--coral": "#F4C2C2",
    "--lilac": "#DCD0FF",
    "--ice": "#BCD4E6",
    "--sage": "#889E9E",
    "--blush": "#F4C2C2",
    "--border-subtle": "rgba(94,99,182,0.12)",
    "--border-medium": "rgba(94,99,182,0.2)",
    "--shadow-xs": "0 1px 3px rgba(39,41,109,0.06)",
    "--shadow-sm": "0 2px 10px rgba(39,41,109,0.08)",
    "--shadow-md": "0 4px 20px rgba(39,41,109,0.1)",
    "--shadow-lg": "0 8px 40px rgba(39,41,109,0.12)",
    "--grid-color": "rgba(94,99,182,0.04)",
    "--noise-opacity": "0.025",
  },
  dark: {
    "--background": "#1a1b3a",
    "--background-rgb": "26, 27, 58",
    "--surface-primary": "rgba(39,41,109,0.45)",
    "--surface-secondary": "rgba(163,147,235,0.08)",
    "--surface-elevated": "rgba(45,47,120,0.6)",
    "--ink": "#eeedf5",
    "--ink-soft": "#d4d3e8",
    "--slate": "#a8a7c4",
    "--silver": "#7e7d9e",
    "--brand": "#a393eb",
    "--brand-deep": "#5e63b6",
    "--brand-vivid": "#DCD0FF",
    "--brand-glow": "rgba(163,147,235,0.18)",
    "--sky": "#87CEEB",
    "--mint": "#AAF0D1",
    "--mint-soft": "#c2f5e0",
    "--coral": "#F4C2C2",
    "--lilac": "#DCD0FF",
    "--ice": "#BCD4E6",
    "--sage": "#889E9E",
    "--blush": "#F4C2C2",
    "--border-subtle": "rgba(163,147,235,0.15)",
    "--border-medium": "rgba(163,147,235,0.25)",
    "--shadow-xs": "0 1px 3px rgba(0,0,0,0.2)",
    "--shadow-sm": "0 2px 10px rgba(0,0,0,0.25)",
    "--shadow-md": "0 4px 20px rgba(0,0,0,0.3)",
    "--shadow-lg": "0 8px 40px rgba(0,0,0,0.35)",
    "--grid-color": "rgba(163,147,235,0.04)",
    "--noise-opacity": "0.03",
  },
};

function applyTheme(theme: "light" | "dark") {
  const vars = THEME_VARS[theme];
  const root = document.documentElement;
  for (const [key, value] of Object.entries(vars)) {
    root.style.setProperty(key, value);
  }
  root.setAttribute("data-theme", theme);
}

/* ─── Scroll-reveal hook ─── */
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("visible");
          observer.unobserve(el);
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return ref;
}

/* ─── Reveal wrapper ─── */
function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useReveal();
  const delayClass = delay > 0 ? `reveal-delay-${delay}` : "";
  return (
    <div ref={ref} className={`reveal ${delayClass} ${className}`}>
      {children}
    </div>
  );
}

/* ─── Icons (inline SVG) ─── */
const Icons = {
  globe: (
    <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10A15.3 15.3 0 0 1 12 2z" />
    </svg>
  ),
  code: (
    <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  ),
  monitor: (
    <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
    </svg>
  ),
  palette: (
    <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
      <circle cx="13.5" cy="6.5" r="0.5" fill="currentColor" />
      <circle cx="17.5" cy="10.5" r="0.5" fill="currentColor" />
      <circle cx="8.5" cy="7.5" r="0.5" fill="currentColor" />
      <circle cx="6.5" cy="12.5" r="0.5" fill="currentColor" />
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
    </svg>
  ),
  layers: (
    <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </svg>
  ),
  arrow: (
    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  ),
  check: (
    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  sparkle: (
    <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 0L14.59 8.41L23 12L14.59 15.59L12 24L9.41 15.59L1 12L9.41 8.41L12 0Z" />
    </svg>
  ),
  sun: (
    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  ),
  moon: (
    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  ),
};

/* ═══════════════════════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════════════════════ */

const services = [
  {
    icon: Icons.globe,
    title: "Websites",
    subtitle: "Custom-built from scratch",
    description:
      "Responsive, performant websites tailored to your brand. From landing pages to complex multi-page platforms.",
    color: "#5e63b6",
    bgColor: "rgba(94,99,182,0.12)",
    badge: "Most Popular",
    badgeColor: "#5e63b6",
    badgeBg: "rgba(94,99,182,0.12)",
  },
  {
    icon: Icons.code,
    title: "Web Applications",
    subtitle: "Full-stack development",
    description:
      "Scalable web applications with modern frameworks, real-time features, and seamless user experiences.",
    color: "#87CEEB",
    bgColor: "rgba(135,206,235,0.12)",
    badge: null,
    badgeColor: "",
    badgeBg: "",
  },
  {
    icon: Icons.monitor,
    title: "Desktop Software",
    subtitle: "Cross-platform solutions",
    description:
      "Native-quality desktop applications built with modern tooling. Windows, macOS, and Linux.",
    color: "#AAF0D1",
    bgColor: "rgba(170,240,209,0.12)",
    badge: null,
    badgeColor: "",
    badgeBg: "",
  },
  {
    icon: Icons.palette,
    title: "UI Design",
    subtitle: "Pixel-perfect interfaces",
    description:
      "Beautiful, intuitive interfaces crafted in Figma. Design systems, component libraries, and prototypes.",
    color: "#F4C2C2",
    bgColor: "rgba(244,194,194,0.15)",
    badge: "50% off with dev",
    badgeColor: "#c88a8a",
    badgeBg: "rgba(244,194,194,0.2)",
  },
  {
    icon: Icons.layers,
    title: "UX Design",
    subtitle: "Research-driven experiences",
    description:
      "User research, information architecture, and interaction design that puts users first.",
    color: "#DCD0FF",
    bgColor: "rgba(220,208,255,0.15)",
    badge: "50% off with dev",
    badgeColor: "#a393eb",
    badgeBg: "rgba(163,147,235,0.14)",
  },
];

const statsData = [
  { value: "50+", label: "Projects Delivered" },
  { value: "100%", label: "Client Satisfaction" },
  { value: "2", label: "Founding Members" },
  { value: "24h", label: "Response Time" },
];

/* ═══════════════════════════════════════════════════════════
   THEME TOGGLE BUTTON
   ═══════════════════════════════════════════════════════════ */
function ThemeToggle({
  theme,
  setTheme,
}: {
  theme: "light" | "dark";
  setTheme: (t: "light" | "dark") => void;
}) {
  return (
    <button
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="theme-toggle"
      title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      <span className={`theme-toggle-icon ${theme === "light" ? "is-active" : ""}`}>
        {Icons.sun}
      </span>
      <span className={`theme-toggle-icon ${theme === "dark" ? "is-active" : ""}`}>
        {Icons.moon}
      </span>
    </button>
  );
}

/* ═══════════════════════════════════════════════════════════
   INTERACTIVE MESH BACKGROUND
   ═══════════════════════════════════════════════════════════ */

function InteractiveMeshBG({ theme }: { theme: "light" | "dark" }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.3 });

  /* Use theme-appropriate blob opacities */
  const opMul = theme === "dark" ? 1.6 : 1;

  const blobsRef = useRef([
    { x: 0.2,  y: 0.15, vx:  0.00018, vy:  0.00012, r: 0.38, color: [39, 41, 109]  },  // #27296d
    { x: 0.78, y: 0.25, vx: -0.00015, vy:  0.0001,  r: 0.32, color: [94, 99, 182]  },  // #5e63b6
    { x: 0.5,  y: 0.65, vx:  0.00012, vy: -0.00016, r: 0.34, color: [163, 147, 235] }, // #a393eb
    { x: 0.15, y: 0.8,  vx:  0.0002,  vy: -0.00007, r: 0.26, color: [170, 240, 209] }, // #AAF0D1
    { x: 0.85, y: 0.55, vx: -0.0001,  vy:  0.00015, r: 0.3,  color: [135, 206, 235] }, // #87CEEB
  ]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = 0;
    let height = 0;

    function resize() {
      width = window.innerWidth;
      height = Math.max(document.documentElement.scrollHeight, window.innerHeight);
      canvas!.width = width;
      canvas!.height = height;
    }
    resize();
    window.addEventListener("resize", resize);

    function onMouse(e: MouseEvent) {
      mouseRef.current = {
        x: e.clientX / window.innerWidth,
        y: (e.clientY + window.scrollY) / Math.max(height, 1),
      };
    }
    window.addEventListener("mousemove", onMouse);

    const baseAlphas = [0.055, 0.05, 0.045, 0.04, 0.035];

    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      blobsRef.current.forEach((blob, i) => {
        blob.x += blob.vx;
        blob.y += blob.vy;
        if (blob.x < -0.15 || blob.x > 1.15) blob.vx *= -1;
        if (blob.y < -0.15 || blob.y > 1.15) blob.vy *= -1;
        blob.x += (mx - blob.x) * 0.0006;
        blob.y += (my - blob.y) * 0.0003;

        const cx = blob.x * width;
        const cy = blob.y * height;
        const radius = blob.r * Math.min(width, 1400);
        const [r, g, b] = blob.color;
        const a = baseAlphas[i] * opMul;

        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
        grad.addColorStop(0, `rgba(${r},${g},${b},${a})`);
        grad.addColorStop(0.6, `rgba(${r},${g},${b},${a * 0.4})`);
        grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.fill();
      });

      animId = requestAnimationFrame(draw);
    }
    draw();

    const resizeTimer = setInterval(resize, 3000);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouse);
      clearInterval(resizeTimer);
    };
  }, [opMul]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    />
  );
}

/* ═══════════════════════════════════════════════════════════
   HOME PAGE
   ═══════════════════════════════════════════════════════════ */

export default function HomePage() {
  const [hoveredService, setHoveredService] = useState<number | null>(null);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  /* Persist and apply theme */
  useEffect(() => {
    const saved = localStorage.getItem("vanix-theme");
    if (saved === "dark" || saved === "light") {
      setTheme(saved);
      applyTheme(saved);
    } else {
      applyTheme("light");
    }
  }, []);

  useEffect(() => {
    applyTheme(theme);
    localStorage.setItem("vanix-theme", theme);
  }, [theme]);

  return (
    <div className="min-h-screen relative" style={{ background: "var(--background)" }}>
      <InteractiveMeshBG theme={theme} />

      {/* Noise texture */}
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          zIndex: 1,
          opacity: "var(--noise-opacity, 0.025)",
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
        }}
        aria-hidden="true"
      />

      {/* ── Scoped styles ── */}
      <style jsx>{`
        /* ── Theme toggle ── */
        .theme-toggle {
          position: fixed;
          top: 24px;
          right: 24px;
          z-index: 100;
          width: 44px;
          height: 44px;
          border-radius: 14px;
          border: 1px solid var(--border-subtle);
          background: var(--surface-primary);
          backdrop-filter: blur(12px);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: var(--shadow-sm);
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .theme-toggle:hover {
          border-color: var(--brand);
          box-shadow: var(--shadow-md);
          transform: translateY(-2px);
        }
        .theme-toggle-icon {
          position: absolute;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--silver);
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          opacity: 0;
          transform: scale(0.5) rotate(-90deg);
        }
        .theme-toggle-icon.is-active {
          opacity: 1;
          transform: scale(1) rotate(0deg);
          color: var(--brand);
        }

        /* ── Grid pattern ── */
        .hero-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(var(--grid-color) 1px, transparent 1px),
            linear-gradient(90deg, var(--grid-color) 1px, transparent 1px);
          background-size: 60px 60px;
          mask-image: radial-gradient(ellipse 70% 60% at 50% 40%, black 20%, transparent 100%);
          -webkit-mask-image: radial-gradient(ellipse 70% 60% at 50% 40%, black 20%, transparent 100%);
        }

        /* ── Badge ── */
        .v-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 14px;
          border-radius: 100px;
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.02em;
          white-space: nowrap;
          font-family: var(--font-display, inherit);
        }

        /* ── Buttons ── */
        .v-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 13px 28px;
          border-radius: 14px;
          font-weight: 700;
          font-size: 0.9375rem;
          letter-spacing: -0.01em;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          border: none;
          text-decoration: none;
          font-family: var(--font-display, inherit);
        }
        .v-btn-primary {
          background: var(--brand);
          color: #fff;
          box-shadow: 0 2px 12px rgba(94,99,182,0.3);
        }
        .v-btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 24px rgba(94,99,182,0.4);
        }
        .v-btn-secondary {
          background: var(--surface-primary);
          color: var(--ink-soft);
          border: 1px solid var(--border-subtle);
          box-shadow: var(--shadow-xs);
        }
        .v-btn-secondary:hover {
          border-color: var(--brand);
          color: var(--brand);
          transform: translateY(-2px);
          box-shadow: var(--shadow-sm);
        }
        .v-btn-ghost {
          background: transparent;
          color: var(--slate);
          border: 1px solid var(--border-subtle);
        }
        .v-btn-ghost:hover {
          color: var(--brand);
          border-color: var(--brand);
          transform: translateY(-1px);
        }

        /* ── Headings ── */
        .v-heading {
          font-family: var(--font-display, inherit);
          font-weight: 750;
          letter-spacing: -0.03em;
          line-height: 1.12;
          color: var(--ink);
        }
        .v-accent {
          background: linear-gradient(135deg, #5e63b6 0%, #a393eb 50%, #87CEEB 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .v-body {
          font-family: var(--font-body, inherit);
          color: var(--slate);
          line-height: 1.7;
        }
        .v-label {
          font-family: var(--font-display, inherit);
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--brand);
        }

        /* ── Cards ── */
        .v-card {
          background: var(--surface-primary);
          backdrop-filter: blur(12px);
          border: 1px solid var(--border-subtle);
          border-radius: 20px;
          box-shadow: var(--shadow-sm);
          transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .v-card:hover {
          box-shadow: var(--shadow-md);
          border-color: var(--border-medium);
          transform: translateY(-4px);
        }
        .v-card-stat {
          text-align: center;
          padding: 28px 20px;
          border-radius: 18px;
        }
        .v-card-service {
          padding: 28px;
          height: 100%;
        }
        .v-stat-value {
          font-family: var(--font-display, inherit);
          font-size: 2rem;
          font-weight: 800;
          letter-spacing: -0.03em;
          color: var(--ink);
        }
        .v-stat-label {
          font-family: var(--font-body, inherit);
          font-size: 0.8125rem;
          color: var(--silver);
          margin-top: 4px;
        }
        .v-card-icon {
          width: 48px;
          height: 48px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        /* ── Divider ── */
        .v-divider {
          height: 1px;
          background: var(--border-subtle);
        }

        /* ── Float animation ── */
        @keyframes vfloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        .v-float-slow { animation: vfloat 5s ease-in-out infinite; }
        .v-float-medium { animation: vfloat 3.5s ease-in-out infinite; }

        /* ── Reveal ── */
        :global(.reveal) {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1),
                      transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }
        :global(.reveal.visible) {
          opacity: 1;
          transform: translateY(0);
        }
        :global(.reveal-delay-1) { transition-delay: 0.1s; }
        :global(.reveal-delay-2) { transition-delay: 0.2s; }
        :global(.reveal-delay-3) { transition-delay: 0.3s; }
        :global(.reveal-delay-4) { transition-delay: 0.4s; }
      `}</style>

      {/* Page content */}
      <div className="relative" style={{ zIndex: 10 }}>
        <ThemeToggle theme={theme} setTheme={setTheme} />

        <main>
          {/* ═══════════ HERO ═══════════ */}
          <section className="relative" style={{ paddingTop: "80px", paddingBottom: "100px" }}>
            <div className="hero-grid" />

            <div className="max-w-6xl mx-auto px-6 relative" style={{ zIndex: 10 }}>
              <Reveal>
                <div className="flex justify-center mb-6">
                  <div
                    className="v-badge"
                    style={{ background: "var(--brand-glow)", color: "var(--brand)" }}
                  >
                    <span style={{ fontSize: "10px" }}>{Icons.sparkle}</span>
                    Software &amp; Design Studio
                  </div>
                </div>
              </Reveal>

              <Reveal delay={1}>
                <h1
                  className="v-heading text-center mx-auto"
                  style={{ fontSize: "clamp(2.2rem, 5.5vw, 4rem)", maxWidth: "800px" }}
                >
                  We craft digital products{" "}
                  <span className="v-accent">from scratch</span>
                </h1>
              </Reveal>

              <Reveal delay={2}>
                <p
                  className="v-body text-center mx-auto mt-6"
                  style={{ maxWidth: "560px", fontSize: "1.1rem" }}
                >
                  A freelance studio owned by{" "}
                  <strong style={{ color: "var(--ink-soft)", fontWeight: 600 }}>
                    Anton Kabakov
                  </strong>{" "}
                  &amp;{" "}
                  <strong style={{ color: "var(--ink-soft)", fontWeight: 600 }}>
                    Viktor Kanev
                  </strong>
                  . Modern websites, web apps, desktop software, and UI/UX
                  design — built entirely from the ground up.
                </p>
              </Reveal>

              <Reveal delay={3}>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
                  <Link href="/shop" className="v-btn v-btn-primary">
                    View Services {Icons.arrow}
                  </Link>
                  <Link href="/contact" className="v-btn v-btn-secondary">
                    Contact Us
                  </Link>
                </div>
              </Reveal>

              <Reveal delay={4}>
                <div className="flex flex-wrap items-center justify-center gap-3 mt-14">
                  {["Next.js", "React", "TypeScript", "Figma", "Node.js", "Tailwind"].map(
                    (tech, i) => (
                      <span
                        key={tech}
                        className={`v-badge ${i % 2 === 0 ? "v-float-slow" : "v-float-medium"}`}
                        style={{
                          background: "var(--surface-primary)",
                          color: "var(--slate)",
                          border: "1px solid var(--border-subtle)",
                          boxShadow: "var(--shadow-xs)",
                          animationDelay: `${i * 0.3}s`,
                          backdropFilter: "blur(8px)",
                        }}
                      >
                        {tech}
                      </span>
                    )
                  )}
                </div>
              </Reveal>
            </div>
          </section>

          <div className="v-divider max-w-5xl mx-auto" />

          {/* ═══════════ STATS ═══════════ */}
          <section className="py-20 max-w-6xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {statsData.map((stat, i) => (
                <Reveal key={stat.label} delay={Math.min(i + 1, 4) as 1 | 2 | 3 | 4}>
                  <div className="v-card v-card-stat">
                    <div className="v-stat-value">{stat.value}</div>
                    <div className="v-stat-label">{stat.label}</div>
                  </div>
                </Reveal>
              ))}
            </div>
          </section>

          {/* ═══════════ SERVICES ═══════════ */}
          <section className="py-10 pb-24 max-w-6xl mx-auto px-6">
            <Reveal>
              <div className="text-center mb-14">
                <span className="v-label">What We Do</span>
                <h2
                  className="v-heading mt-3"
                  style={{ fontSize: "clamp(1.6rem, 3.5vw, 2.5rem)" }}
                >
                  Services tailored to your vision
                </h2>
                <p className="v-body mt-4 mx-auto" style={{ maxWidth: "480px" }}>
                  From concept to deployment — every project is custom-built
                  with meticulous attention to detail.
                </p>
              </div>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {services.map((service, i) => (
                <Reveal key={service.title} delay={Math.min(i + 1, 4) as 1 | 2 | 3 | 4}>
                  <div
                    className="v-card v-card-service"
                    onMouseEnter={() => setHoveredService(i)}
                    onMouseLeave={() => setHoveredService(null)}
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <div
                        className="v-card-icon"
                        style={{ background: service.bgColor, color: service.color }}
                      >
                        {service.icon}
                      </div>
                      {service.badge && (
                        <span
                          className="v-badge"
                          style={{
                            marginLeft: "auto",
                            background: service.badgeBg,
                            color: service.badgeColor,
                          }}
                        >
                          {service.badge}
                        </span>
                      )}
                    </div>

                    <h3
                      className="font-bold text-lg"
                      style={{ fontFamily: "var(--font-display, inherit)", color: "var(--ink)" }}
                    >
                      {service.title}
                    </h3>
                    <p className="text-sm mt-1 font-medium" style={{ color: "var(--slate)" }}>
                      {service.subtitle}
                    </p>
                    <p className="v-body text-sm mt-3" style={{ lineHeight: 1.65 }}>
                      {service.description}
                    </p>

                    <div
                      className="mt-5 flex items-center gap-2 text-sm font-semibold"
                      style={{
                        fontFamily: "var(--font-display, inherit)",
                        color: hoveredService === i ? service.color : "var(--silver)",
                        transform: hoveredService === i ? "translateX(4px)" : "translateX(0)",
                        transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
                      }}
                    >
                      Learn more {Icons.arrow}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </section>

          <div className="v-divider max-w-5xl mx-auto" />

          {/* ═══════════ COMBO OFFER ═══════════ */}
          <section className="py-24 max-w-6xl mx-auto px-6">
            <Reveal>
              <div
                className="relative overflow-hidden rounded-3xl"
                style={{
                  background: "linear-gradient(135deg, #27296d 0%, #5e63b6 100%)",
                  padding: "clamp(40px, 6vw, 72px) clamp(28px, 5vw, 64px)",
                }}
              >
                <div
                  className="absolute -top-20 -right-20 w-64 h-64 rounded-full"
                  style={{
                    background: "radial-gradient(circle, rgba(170,240,209,0.15) 0%, transparent 70%)",
                  }}
                />
                <div
                  className="absolute -bottom-32 -left-16 w-80 h-80 rounded-full"
                  style={{
                    background: "radial-gradient(circle, rgba(135,206,235,0.12) 0%, transparent 70%)",
                  }}
                />
                <div
                  className="absolute top-10 left-1/2 w-72 h-72 rounded-full"
                  style={{
                    background: "radial-gradient(circle, rgba(163,147,235,0.1) 0%, transparent 70%)",
                  }}
                />

                <div className="relative z-10 flex flex-col lg:flex-row items-center gap-10">
                  <div className="flex-1">
                    <span
                      className="v-badge"
                      style={{ background: "rgba(170,240,209,0.15)", color: "#AAF0D1" }}
                    >
                      {Icons.sparkle} Special Offer
                    </span>
                    <h2
                      className="mt-5"
                      style={{
                        fontFamily: "var(--font-display, inherit)",
                        fontSize: "clamp(1.5rem, 3.5vw, 2.2rem)",
                        fontWeight: 700,
                        letterSpacing: "-0.02em",
                        lineHeight: 1.2,
                        color: "#fff",
                      }}
                    >
                      Combine development &amp; design —{" "}
                      <span style={{ color: "#AAF0D1" }}>get design at 50% off</span>
                    </h2>
                    <p
                      className="mt-4"
                      style={{
                        fontFamily: "var(--font-body, inherit)",
                        color: "rgba(255,255,255,0.65)",
                        fontSize: "1.05rem",
                        lineHeight: 1.7,
                        maxWidth: "500px",
                      }}
                    >
                      When you bundle any development service with UI or UX
                      design, you pay half price for the design work. A
                      seamless process, one team, better results.
                    </p>
                  </div>

                  <div className="flex flex-col gap-4 items-start lg:items-end flex-shrink-0">
                    {[
                      "Consistent design language",
                      "Faster turnaround",
                      "Single point of contact",
                    ].map((item) => (
                      <div
                        key={item}
                        className="flex items-center gap-3"
                        style={{ color: "rgba(255,255,255,0.8)", fontSize: "0.95rem" }}
                      >
                        <span style={{ color: "#AAF0D1" }}>{Icons.check}</span>
                        {item}
                      </div>
                    ))}
                    <Link
                      href="/contact"
                      className="v-btn mt-4"
                      style={{
                        background: "#AAF0D1",
                        color: "#27296d",
                        fontWeight: 700,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-2px)";
                        e.currentTarget.style.boxShadow = "0 8px 24px rgba(170,240,209,0.3)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    >
                      Claim This Offer {Icons.arrow}
                    </Link>
                  </div>
                </div>
              </div>
            </Reveal>
          </section>

          {/* ═══════════ CTA ═══════════ */}
          <section className="pb-28 max-w-6xl mx-auto px-6">
            <Reveal>
              <div className="text-center">
                <h2
                  className="v-heading"
                  style={{ fontSize: "clamp(1.6rem, 3.5vw, 2.5rem)" }}
                >
                  Ready to start your project?
                </h2>
                <p className="v-body mt-4 mx-auto" style={{ maxWidth: "440px" }}>
                  Tell us about your idea and we&apos;ll get back to you within
                  24 hours with a tailored proposal.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
                  <Link href="/contact" className="v-btn v-btn-primary">
                    Start a Conversation {Icons.arrow}
                  </Link>
                  <Link href="/shop" className="v-btn v-btn-ghost">
                    Browse Services
                  </Link>
                </div>
              </div>
            </Reveal>
          </section>
        </main>

        {/* ═══════════ FOOTER ═══════════ */}
        <footer
          style={{
            borderTop: "1px solid var(--border-subtle)",
            background: "var(--surface-primary)",
            backdropFilter: "blur(12px)",
          }}
        >
          <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-xs"
                style={{
                  background: "linear-gradient(135deg, #5e63b6, #a393eb)",
                  fontFamily: "var(--font-display, inherit)",
                }}
              >
                V
              </div>
              <span className="text-sm" style={{ color: "var(--slate)", fontFamily: "var(--font-body, inherit)" }}>
                © {new Date().getFullYear()} Vanix Studio. All rights reserved.
              </span>
            </div>
            <div className="flex items-center gap-6">
              {["Services", "Work", "Contact"].map((item) => (
                <Link
                  key={item}
                  href={`/${item.toLowerCase()}`}
                  className="text-sm transition-colors"
                  style={{ color: "var(--slate)", fontFamily: "var(--font-display, inherit)" }}
                  onMouseEnter={(e) => {
                    (e.target as HTMLElement).style.color = "var(--brand)";
                  }}
                  onMouseLeave={(e) => {
                    (e.target as HTMLElement).style.color = "var(--slate)";
                  }}
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}