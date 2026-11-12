"use client";

import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { centerSection } from "@/lib/center-section";

/**
 * Plain-text intro for search engines and readers: zones served and how buying
 * works. On mobile it collapses behind a bar, like the payment-options section.
 */
export default function SeoIntro() {
  const [open, setOpen] = useState(false);

  // Expand when a link or the URL points at this section (collapsed on mobile).
  useEffect(() => {
    const expand = () => {
      if (window.location.hash !== "#comprar") return;
      setOpen(true);
      centerSection("comprar", "top");
    };
    expand();
    window.addEventListener("hashchange", expand);
    return () => window.removeEventListener("hashchange", expand);
  }, []);

  return (
    <section
      id="comprar"
      aria-labelledby="seo-intro-heading"
      data-testid="seo-intro"
      className="scroll-mt-24 lg:px-6 lg:py-12"
    >
      <button
        type="button"
        aria-expanded={open}
        aria-controls="seo-intro-content"
        data-testid="seo-intro-toggle"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-4 border-y border-line px-3 py-4 text-left lg:hidden"
      >
        <span className="text-xs font-medium uppercase tracking-widest text-fg">
          Casas de vacaciones
        </span>
        <ChevronDown
          aria-hidden
          strokeWidth={1.75}
          className={`h-5 w-5 shrink-0 text-muted transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      <div
        id="seo-intro-content"
        className={
          open
            ? "px-5 pb-10 pt-8 md:px-10 lg:py-0 lg:px-16"
            : "hidden lg:block lg:px-16"
        }
      >
        <h2
          id="seo-intro-heading"
          className="text-balance text-3xl font-semibold tracking-[-0.02em] lg:text-4xl"
        >
          Casas de vacaciones en Punta del Este
        </h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2 md:gap-10">
          <p className="leading-relaxed text-muted">
            En Tu Próxima Casa Uruguay encontrás casas de vacaciones
            seleccionadas en las mejores zonas de Punta del Este: Península,
            Playa Brava, Playa Mansa, La Barra, Manantiales y José Ignacio.
            Cada propiedad muestra sus fotos, características y comodidades
            para que elijas con tranquilidad.
          </p>
          <p className="leading-relaxed text-muted">
            Filtrá por zona, cantidad de dormitorios o huéspedes, y coordiná una
            visita a la casa que más te guste escribiéndonos por WhatsApp.
          </p>
        </div>
        <p className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium">
          <Link href="/#inventario" className="underline underline-offset-4">
            Ver todas las casas
          </Link>
        </p>
      </div>
    </section>
  );
}
