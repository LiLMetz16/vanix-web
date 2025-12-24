import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vanix — Software & Design Studio",
  description: "Freelance company by Anton Kabakov & Viktor Kanev",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
