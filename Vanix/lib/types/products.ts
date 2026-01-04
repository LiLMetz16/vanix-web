
export type ProductCategory = "Website" | "App" | "Design" | "UI Kit" | "Other";

export type Product = {
  id: string;
  slug: string; // product1, product2...
  title: string;
  subtitle: string;
  description: string;
  priceEUR: number;
  category: ProductCategory;
  tags: string[];
  image: string; // ONLY filename, e.g. "starterimage.png" (stored in /public/shop/)
  featured?: boolean;

  deliverables: string[];
  timeline: string;
  faq: { q: string; a: string }[];
};

export const PRODUCTS: Product[] = [
  {
    id: "vanix-website-starter",
    slug: "product1",
    title: "Website Starter",
    subtitle: "Next.js + Tailwind landing page (fast, clean, SEO-ready).",
    description:
      "A fast, modern landing page built with Next.js + Tailwind. Clean sections, strong CTA layout, and SEO-ready structure.",
    priceEUR: 149,
    category: "Website",
    tags: ["Next.js", "Tailwind", "SEO"],
    image: "starterimage.png",
    featured: true,
    deliverables: ["Landing page UI", "Responsive layout", "SEO basics", "Setup notes"],
    timeline: "2–3 days (typical)",
    faq: [
      { q: "Can you deploy it for me?", a: "Yes — we can deploy to Vercel/Netlify on request." },
      { q: "Do I get the source code?", a: "Yes — source files + setup notes are included." },
    ],
  },
  {
    id: "vanix-website-business",
    slug: "product2",
    title: "Business Website",
    subtitle: "Multi-page website with sections, contact form, and CMS-ready structure.",
    description:
      "A multi-page website for a business: clear structure, contact section, and a scalable layout that can later be connected to a CMS.",
    priceEUR: 399,
    category: "Website",
    tags: ["Multi-page", "Branding", "Responsive"],
    image: "buisness.png",
    featured: true,
    deliverables: ["Multiple pages", "Responsive sections", "Contact form UI", "Scalable structure"],
    timeline: "5–10 days (typical)",
    faq: [
      { q: "Is it CMS-ready?", a: "Yes — we structure it so it’s easy to connect a CMS later." },
      { q: "Do you include copywriting?", a: "Not by default, but we can help with guidance." },
    ],
  },
  {
    id: "vanix-ecommerce-ui",
    slug: "product3",
    title: "E-commerce UI Pack",
    subtitle: "Reusable UI blocks for a modern shop (cart, filters, product cards).",
    description:
      "A reusable UI pack for e-commerce: product cards, filters, cart patterns, and clean layout blocks that you can plug into your store.",
    priceEUR: 79,
    category: "UI Kit",
    tags: ["UI", "Components", "Shop"],
    image: "e-commerce.png",
    deliverables: ["UI components", "Cart patterns", "Filter patterns", "Layout blocks"],
    timeline: "1–2 days (typical)",
    faq: [
      { q: "Does it include backend?", a: "No — this is UI only. We can integrate Supabase/Stripe later." },
      { q: "Is it responsive?", a: "Yes." },
    ],
  },
  {
    id: "vanix-app-dashboard",
    slug: "product4",
    title: "Admin Dashboard",
    subtitle: "Dashboard layout with tables, charts placeholders, and responsive sidebar.",
    description:
      "Admin dashboard UI: sidebar navigation, tables, and chart placeholders (ready for your real data).",
    priceEUR: 199,
    category: "App",
    tags: ["Dashboard", "Admin", "Layout"],
    image: "admindashboard.png",
    deliverables: ["Dashboard layout", "Responsive sidebar", "Table UI", "Chart placeholders"],
    timeline: "3–5 days (typical)",
    faq: [
      { q: "Do charts work?", a: "Placeholders by default — we can wire real data when you’re ready." },
      { q: "Can you connect Supabase?", a: "Yes, on request." },
    ],
  },
  {
    id: "vanix-logo-pack",
    slug: "product5",
    title: "Logo + Brand Pack",
    subtitle: "Logo concepts + simple brand rules (colors, typography suggestions).",
    description:
      "Logo concepts plus simple brand rules: color direction and typography suggestions for consistent visuals.",
    priceEUR: 129,
    category: "Design",
    tags: ["Logo", "Brand", "Identity"],
    image: "logo+brand.png",
    deliverables: ["Logo concepts", "Color suggestions", "Typography direction", "Basic brand rules"],
    timeline: "2–4 days (typical)",
    faq: [
      { q: "Do I get vector files?", a: "Yes (SVG/PNG), depending on the final direction." },
      { q: "How many concepts?", a: "Typically 2–3 initial concepts." },
    ],
  },
  {
    id: "vanix-ui-audit",
    slug: "product6",
    title: "UI/UX Audit",
    subtitle: "Practical feedback list (visual hierarchy, spacing, usability, consistency).",
    description:
      "A practical UI/UX audit with actionable feedback: hierarchy, spacing, usability issues, consistency, and quick wins.",
    priceEUR: 59,
    category: "Other",
    tags: ["Audit", "UX", "Checklist"],
    image: "uiux.png",
    deliverables: ["Actionable checklist", "Priority issues", "Quick wins", "Consistency notes"],
    timeline: "1–2 days (typical)",
    faq: [
      { q: "Do you redesign too?", a: "We can — audit first, redesign as a follow-up." },
      { q: "What do you need from me?", a: "Link to your site/app or screenshots." },
    ],
  },
];