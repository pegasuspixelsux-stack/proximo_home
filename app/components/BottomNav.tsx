"use client";

import {
  Calculator,
  Car,
  CircleHelp,
  CreditCard,
  Home,
  KeyRound,
  MessageCircle,
  Plus,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type MouseEvent } from "react";

// One entry per section of the page, in page order.
const ITEMS = [
  { label: "Inicio", href: "/", icon: Home },
  { label: "Autos", href: "/#inventario", icon: Car },
  { label: "Comprá tu auto", href: "/#comprar", icon: KeyRound },
  { label: "Financiación", href: "/#financiacion", icon: CreditCard },
  { label: "Calculadora", href: "/#calculadora", icon: Calculator },
  { label: "Preguntas frecuentes", href: "/#preguntas-frecuentes", icon: CircleHelp },
  { label: "Quiénes somos", href: "/#quienes-somos", icon: Users },
  { label: "Contacto", href: "/#contacto", icon: MessageCircle },
];

/**
 * Mobile-only floating glass pill pinned to the bottom. The section icons scroll sideways
 * inside it, four at a time; the "+" at the end opens the full list with names. Shown on every public page
 * (including over the home hero); hidden in the dashboard and login.
 */
export default function BottomNav() {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  // Close the list on outside tap or Escape (links close it themselves).
  useEffect(() => {
    if (!moreOpen) return;
    const onDown = (e: PointerEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setMoreOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMoreOpen(false);
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [moreOpen]);

  if (pathname.startsWith("/dashboard") || pathname.startsWith("/login"))
    return null;

  // Section links scroll in place when the section is on this page (home and car detail pages
  // both have them); otherwise the link navigates to the home page. Collapsible sections open
  // (and scroll) through "hashchange", even if the hash is unchanged.
  function go(e: MouseEvent<HTMLAnchorElement>, href: string) {
    setMoreOpen(false);
    const hash = href.includes("#") ? `#${href.split("#")[1]}` : "";
    if (!hash) {
      if (pathname !== "/") return;
      e.preventDefault();
      window.history.replaceState(null, "", "/");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const target = document.querySelector(hash);
    if (!target) return;
    e.preventDefault();
    window.history.replaceState(null, "", `${pathname}${hash}`);
    if (hash === "#inventario") target.scrollIntoView({ behavior: "smooth" });
    else window.dispatchEvent(new HashChangeEvent("hashchange"));
  }

  const iconBtn =
    "flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.55)] transition-[transform,background-color,color] duration-150 hover:bg-white/15 active:scale-95";

  return (
    <nav
      aria-label="Navegación inferior"
      data-testid="bottom-nav"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-40 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] lg:hidden"
    >
      <div ref={wrapRef} className="pointer-events-auto relative mx-auto max-w-xl">
        {moreOpen && (
          <ul
            id="bottom-nav-more"
            className="absolute bottom-full right-0 mb-2 w-64 overflow-hidden rounded-2xl border border-white/20 bg-black/70 p-1.5 text-white shadow-[0_10px_30px_-6px_rgba(0,0,0,0.5)] backdrop-blur-2xl"
          >
            {ITEMS.map(({ label, href, icon: Icon }) => (
              <li key={label}>
                <Link
                  href={href}
                  onClick={(e) => go(e, href)}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors duration-150 hover:bg-white/10 active:bg-white/15"
                >
                  <Icon className="h-5 w-5 shrink-0" strokeWidth={1.75} aria-hidden />
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        )}
        <div className="flex items-center gap-1 rounded-full border border-white/30 bg-gradient-to-b from-white/20 to-white/5 p-2 backdrop-blur-2xl backdrop-saturate-200 shadow-[0_10px_30px_-6px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.5)]">
          {/* Four icons are visible at a time; swipe sideways for the rest (scrollbar hidden). */}
          <ul className="flex min-w-0 flex-1 snap-x snap-mandatory items-center overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {ITEMS.map(({ label, href, icon: Icon }) => (
              <li key={label} className="flex w-1/4 shrink-0 snap-start justify-center">
                <Link
                  href={href}
                  aria-label={label}
                  onClick={(e) => go(e, href)}
                  className={iconBtn}
                >
                  <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
          <button
            type="button"
            aria-label="Más secciones"
            aria-expanded={moreOpen}
            aria-controls="bottom-nav-more"
            onClick={() => setMoreOpen((o) => !o)}
            className={`${iconBtn} border border-white/30 bg-white/10 ${moreOpen ? "rotate-45" : ""}`}
          >
            <Plus className="h-5 w-5" strokeWidth={1.75} aria-hidden />
          </button>
        </div>
      </div>
    </nav>
  );
}
