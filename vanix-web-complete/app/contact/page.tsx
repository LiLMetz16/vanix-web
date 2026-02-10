"use client";

import { useState } from "react";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();
  setLoading(true);
  setSent(false);
  setError(null);

  const form = e.currentTarget;                // <- ВАЖНО: пазим формата
  const formData = new FormData(form);

  const body = {
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message"),
  };

  try {
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(data.error || "Something went wrong");
    }

    setSent(true);
    setError(null);
    form.reset();                              // <- вече е безопасно
  } catch (err: any) {
    setError(err.message || "Something went wrong");
  } finally {
    setLoading(false);
  }
    
  }

  return (
    <div className="min-h-screen">

      {/* MAIN CONTENT */}
      <main className="max-w-5xl mx-auto px-6 pt-14 pb-20">
        <h1 className="text-3xl font-bold text-white drop-shadow mb-6">
          Contact Us
        </h1>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact info */}
          <div className="bg-white rounded-2xl shadow p-6 text-gray-900">
            <h2 className="text-xl font-bold mb-3">Get in touch</h2>
            <p className="text-sm text-gray-700 mb-4">
              Свържете се с нашия екип за въпроси относно услуги, цени или
              поръчки.
            </p>

            <ul className="text-sm space-y-2">
              <li>
                <b>Email:</b> vanix.team@gmail.com
              </li>
              <li>
                <b>Phone:</b> +359 88 123 4567
              </li>
              <li>
                <b>Location:</b> Bulgaria, Burgas / Varna
              </li>
            </ul>

            <div className="mt-6">
              <p className="text-xs text-gray-600">
                Отговаряме най-често в рамките на 1–2 часа.
              </p>
            </div>
          </div>

          {/* Contact form */}
          <div className="bg-white rounded-2xl shadow p-6 text-gray-900">
            <h2 className="text-xl font-bold mb-4">Send a message</h2>

            <form className="space-y-3" onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                placeholder="Your name"
                className="w-full border rounded-xl px-3 py-2 text-sm text-gray-900"
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                className="w-full border rounded-xl px-3 py-2 text-sm text-gray-900"
                required
              />
              <textarea
                name="message"
                placeholder="Your message"
                rows={4}
                className="w-full border rounded-xl px-3 py-2 text-sm text-gray-900"
                required
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 disabled:opacity-60"
              >
                {loading ? "Sending..." : "Send message"}
              </button>
            </form>

            {sent && (
              <p className="mt-3 text-sm text-green-600">
                ✅ Your message has been sent successfully.
              </p>
            )}

            {error && (
              <p className="mt-3 text-sm text-red-600">
                ❌ Error: {error}
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
