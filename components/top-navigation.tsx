"use client";

import { useEffect, useState } from "react";

const links = [
  { href: "#intro", label: "Intro" },
  { href: "#foundation", label: "Foundation" },
  { href: "#columns", label: "Structure" },
  { href: "#floors", label: "Systems" },
  { href: "#facade", label: "Facade" },
  { href: "#rooftop", label: "Junior" }
];

export default function TopNavigation() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 14);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`fixed inset-x-0 top-0 z-50 mx-auto w-[min(1680px,98vw)] ${scrolled ? "pt-2" : "pt-4"} transition-all`}>
      <nav className="glass-panel rounded-2xl px-4 py-3 lg:px-6">
        <div className="flex items-center justify-between gap-4">
          <a href="#story" className="display-title text-sm tracking-[0.16rem] text-blueprint sm:text-base">
            ARCHVIZ GROWTH STORY
          </a>
          <ul className="hidden items-center gap-1 lg:flex">
            {links.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  className="rounded-full px-3 py-1.5 text-[0.67rem] uppercase tracking-[0.14rem] text-slate-300 transition hover:bg-white/10 hover:text-slate-100"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  );
}
