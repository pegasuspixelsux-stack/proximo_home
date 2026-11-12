"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { createPortal } from "react-dom";
import { MENU_LINKS } from "./navLinks";
import { goToSection } from "./sectionNav";
import { SOCIALS } from "./socials";

export default function MobileMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-label="Abrir menú"
        aria-expanded={open}
        aria-controls="mobile-menu"
        data-testid="mobile-menu-toggle"
        onClick={() => setOpen(true)}
        className="rounded-md p-1 text-fg/90 transition-[transform,color] duration-150 ease-out hover:text-fg active:scale-95"
      >
        <Menu className="h-5 w-5" strokeWidth={1.5} />
      </button>

      {open &&
        createPortal(
          <div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menú"
            className="fixed inset-0 z-50"
          >
            <button
              type="button"
              tabIndex={-1}
              aria-label="Cerrar menú"
              onClick={() => setOpen(false)}
              className="absolute inset-0 bg-black/60"
            />
            <div className="absolute inset-y-0 left-0 flex w-72 max-w-[85vw] flex-col border-r border-line bg-bg">
              <div className="flex items-center justify-between px-5 py-5">
                <span className="text-xs font-medium uppercase tracking-widest text-muted">
                  Menú
                </span>
                <button
                  ref={closeRef}
                  type="button"
                  aria-label="Cerrar menú"
                  onClick={() => setOpen(false)}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-muted transition-colors duration-150 hover:text-fg"
                >
                  <X className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                </button>
              </div>
              <nav
                aria-label="Menú móvil"
                className="flex-1 overflow-y-auto px-3 pb-8"
              >
                <ul className="space-y-1">
                  {MENU_LINKS.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        onClick={(e) => {
                          // Unlock scrolling first so the jump to the section works.
                          document.body.style.overflow = "";
                          setOpen(false);
                          goToSection(e, link.href, pathname);
                        }}
                        className="block rounded-xl px-3 py-3.5 text-lg font-light tracking-tight text-fg transition-colors duration-150 hover:bg-surface"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
              <div className="border-t border-line px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-5">
                <p className="text-xs font-medium uppercase tracking-widest text-muted">
                  Seguinos
                </p>
                <ul className="mt-3 flex gap-2">
                  {SOCIALS.map(({ label, href, icon }) => (
                    <li key={label}>
                      <a
                        href={href}
                        aria-label={label}
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-muted transition-[color,border-color,transform] duration-150 hover:border-fg/40 hover:text-fg active:scale-95"
                      >
                        {icon}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
