"use client";

import { ChevronDown } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { centerSection } from "@/lib/center-section";

/**
 * "Quiénes somos": text on one side, a photo on the other (two columns from md up).
 * On mobile it collapses behind a bar, like the other sections of the page.
 */
export default function AboutSection() {
  const [open, setOpen] = useState(false);

  // Expand when a link or the URL points at this section (collapsed on mobile).
  useEffect(() => {
    const expand = () => {
      if (window.location.hash !== "#quienes-somos") return;
      setOpen(true);
      centerSection("quienes-somos", "top");
    };
    expand();
    window.addEventListener("hashchange", expand);
    return () => window.removeEventListener("hashchange", expand);
  }, []);

  return (
    <section
      id="quienes-somos"
      aria-labelledby="about-heading"
      data-testid="about-section"
      className="scroll-mt-4 md:px-3 md:py-12 lg:px-6"
    >
      <button
        type="button"
        aria-expanded={open}
        aria-controls="about-content"
        data-testid="about-toggle"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-4 border-y border-line px-3 py-4 text-left md:hidden"
      >
        <span className="text-xs font-medium uppercase tracking-widest text-fg">
          Quiénes somos
        </span>
        <ChevronDown
          aria-hidden
          strokeWidth={1.75}
          className={`h-5 w-5 shrink-0 text-muted transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      <div
        id="about-content"
        className={open ? "px-3 pb-10 pt-8 md:p-0" : "hidden md:block"}
      >
        <div className="mx-auto grid max-w-[1000px] items-center gap-8 md:grid-cols-2 md:gap-12">
          <div>
            <h2
              id="about-heading"
              className="text-balance text-3xl font-semibold tracking-[-0.02em] lg:text-4xl"
            >
              Quiénes somos
            </h2>
            <p className="mt-4 leading-relaxed text-muted">
              Somos una automotora de Tigre, Zona Norte, dedicada a la venta de
              autos usados seleccionados y verificados. Cada unidad se revisa
              antes de publicarse, con documentación al día y VTV vigente.
            </p>
            <p className="mt-4 leading-relaxed text-muted">
              Te acompañamos en todo el proceso: asesoramiento, financiación con
              tarjeta, toma de tu usado como parte de pago, gestoría y
              transferencia. Visitanos en nuestro salón, probá la unidad y
              llevátela con tranquilidad.
            </p>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-line bg-neutral-900">
            <Image
              src="/hero_image/buyers-1080.webp"
              alt="Clientes recibiendo las llaves de su auto en el salón de ventas"
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
