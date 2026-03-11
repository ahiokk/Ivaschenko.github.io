import type { Metadata } from "next";
import { Manrope, Syne } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  variable: "--font-manrope"
});

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne"
});

export const metadata: Metadata = {
  title: "Architecting Growth | Portfolio",
  description:
    "Премиальный storytelling-портфолио: карьерный рост через метафору поэтапного строительства архитектурной башни."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={`${manrope.variable} ${syne.variable}`}>
      <body>{children}</body>
    </html>
  );
}
