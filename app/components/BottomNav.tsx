"use client";

import { Car, CreditCard, Home, MessageCircle } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const ITEMS = [
  { label: "Inicio", href: "/", icon: Home },
  { label: "Autos", href: "/#inventario", icon: Car },
  { label: "Financiar", href: "/#financiacion", icon: CreditCard },
  { label: "Contacto", href: "/#contacto", icon: MessageCircle },
];

/** Mobile-only floating pill (styled like the cover's Explorar button) pinned to the bottom. Hidden in the dashboard, login and over the hero. */
export default function BottomNav() {
  const pathname = usePathname();
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/login"))
    return null;

  return (
    <nav
      aria-label="Navegación inferior"
      data-testid="bottom-nav"
      className={`${pathname === "/" ? "cover-bottom-nav " : ""}pointer-events-none fixed inset-x-0 bottom-0 z-40 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] lg:hidden`}
    >
      <ul className="pointer-events-auto mx-auto flex max-w-xl items-center justify-between rounded-full bg-white p-2 shadow-[0_10px_30px_-6px_rgba(0,0,0,0.45)]">
        {ITEMS.map(({ label, href, icon: Icon }) => {
          // Only page links can be "current"; the anchors live on the home page.
          const active = !href.includes("#") && href !== "/" && pathname === href;
          return (
            <li key={label} className="flex-1">
              <Link
                href={href}
                aria-label={label}
                onClick={(e) => {
                  if (pathname !== "/") return;
                  // Same-page links on the one-page home: scroll to the section. Collapsible
                  // sections open (and scroll) through "hashchange", even if the hash is unchanged.
                  const hash = href.includes("#") ? `#${href.split("#")[1]}` : "";
                  if (!hash) {
                    e.preventDefault();
                    window.history.replaceState(null, "", "/");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  } else if (document.querySelector(hash)) {
                    e.preventDefault();
                    window.history.replaceState(null, "", `/${hash}`);
                    if (hash === "#inventario")
                      document.querySelector(hash)?.scrollIntoView({ behavior: "smooth" });
                    else window.dispatchEvent(new HashChangeEvent("hashchange"));
                  }
                }}
                aria-current={active ? "page" : undefined}
                className="mx-auto flex h-11 w-11 items-center justify-center rounded-full text-black transition-[transform,background-color,color] duration-150 hover:bg-black/5 active:scale-95 aria-[current=page]:bg-black aria-[current=page]:text-white"
              >
                <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden />
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
