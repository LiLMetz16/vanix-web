"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full mt-20 bg-white/90 backdrop-blur border-t-2 border-[#5e63b6]/20">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold text-[#27296d] mb-4">Vanix</h3>
            <p className="text-[#5e63b6] text-sm mb-4">
              Software & Design Studio by Anton Kabakov & Viktor Kanev
            </p>
            <p className="text-[#889E9E] text-xs">
              © {new Date().getFullYear()} Vanix. All rights reserved.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-[#27296d] mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-[#5e63b6] hover:text-[#27296d] text-sm transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/shop" className="text-[#5e63b6] hover:text-[#27296d] text-sm transition-colors">
                  Shop
                </Link>
              </li>
              <li>
                <Link href="/portfolio" className="text-[#5e63b6] hover:text-[#27296d] text-sm transition-colors">
                  Portfolio
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-[#5e63b6] hover:text-[#27296d] text-sm transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-[#5e63b6] hover:text-[#27296d] text-sm transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Social */}
          <div>
            <h4 className="font-semibold text-[#27296d] mb-4">Legal & Social</h4>
            <ul className="space-y-2 mb-6">
              <li>
                <Link href="/privacy-policy" className="text-[#5e63b6] hover:text-[#27296d] text-sm transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-conditions" className="text-[#5e63b6] hover:text-[#27296d] text-sm transition-colors">
                  Terms & Conditions
                </Link>
              </li>
            </ul>

            {/* Social Media Icons */}
            <div className="flex items-center gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[#87CEEB]/20 hover:bg-[#87CEEB]/40 border-2 border-[#87CEEB]/30 flex items-center justify-center transition-all hover:scale-110"
                aria-label="Facebook"
              >
                <svg className="w-5 h-5 text-[#27296d]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>

              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[#F4C2C2]/20 hover:bg-[#F4C2C2]/40 border-2 border-[#F4C2C2]/30 flex items-center justify-center transition-all hover:scale-110"
                aria-label="Instagram"
              >
                <svg className="w-5 h-5 text-[#27296d]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>

              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[#DCD0FF]/20 hover:bg-[#DCD0FF]/40 border-2 border-[#DCD0FF]/30 flex items-center justify-center transition-all hover:scale-110"
                aria-label="X (Twitter)"
              >
                <svg className="w-5 h-5 text-[#27296d]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>

              <a
                href="tel:+1234567890"
                className="w-10 h-10 rounded-full bg-[#AAF0D1]/20 hover:bg-[#AAF0D1]/40 border-2 border-[#AAF0D1]/30 flex items-center justify-center transition-all hover:scale-110"
                aria-label="Phone"
              >
                <svg className="w-5 h-5 text-[#27296d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                </svg>
              </a>

              <a
                href="mailto:contact@vanix.com"
                className="w-10 h-10 rounded-full bg-[#a393eb]/20 hover:bg-[#a393eb]/40 border-2 border-[#a393eb]/30 flex items-center justify-center transition-all hover:scale-110"
                aria-label="Email"
              >
                <svg className="w-5 h-5 text-[#27296d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
