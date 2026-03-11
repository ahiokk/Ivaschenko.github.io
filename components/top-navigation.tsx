"use client";

import { useEffect, useState } from "react";

const links = [
  { href: "#hero", label: "Start" },
  { href: "#foundation", label: "Foundation" },
  { href: "#projects", label: "Projects" },
  { href: "#skills", label: "Structure" },
  { href: "#complex", label: "Elevation" },
  { href: "#rooftop", label: "Rooftop" },
  { href: "#contact", label: "Contact" }
];

export default function TopNavigation() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 mx-auto w-[min(1440px,96vw)] transition-all duration-500 ${
        scrolled ? "pt-3" : "pt-5"
      }`}
    >
      <nav className="glass-panel rounded-2xl px-4 py-3 lg:px-6">
        <div className="flex items-center justify-between gap-4">
          <a href="#hero" className="display-title text-sm font-semibold tracking-wide text-blueprint lg:text-base">
            ARCHITECTING GROWTH
          </a>
          <ul className="hidden items-center gap-1 lg:flex">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="rounded-full px-3 py-1.5 text-xs tracking-wide text-slate-300 transition duration-300 hover:bg-slate-200/10 hover:text-slate-100"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  );
}
