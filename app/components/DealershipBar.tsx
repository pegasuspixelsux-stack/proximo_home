"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export interface DealershipBarItem {
  id: string;
  name: string;
  /** Optional logo; initials are shown when missing. */
  logoUrl?: string;
  slug: string;
  vehicleCount: number;
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

export default function DealershipBar({
  dealerships,
}: {
  dealerships: DealershipBarItem[];
}) {
  const reduce = useReducedMotion();

  return (
    <section
      aria-labelledby="featured-dealers-heading"
      data-testid="dealership-bar"
      className="px-3 pb-10 lg:px-6 lg:pb-14"
    >
      <div className="flex items-baseline justify-between gap-4">
        <div>
          <h2
            id="featured-dealers-heading"
            className="text-balance text-3xl font-light tracking-[-0.02em] lg:text-4xl"
          >
            Inmobiliarias Destacadas
          </h2>
          <p className="mt-2 text-sm text-muted">
            Propiedades de nuestras inmobiliarias verificadas.
          </p>
        </div>
        <Link
          href="/inmobiliarias"
          className="shrink-0 text-xs text-muted underline-offset-4 transition-colors duration-150 hover:text-fg hover:underline"
        >
          Ver todas →
        </Link>
      </div>

      <ul
        tabIndex={0}
        aria-label="Inmobiliarias destacadas, desplazá horizontalmente"
        className="-mx-3 mt-6 flex snap-x gap-6 overflow-x-auto px-3 py-3 [scrollbar-width:none] lg:-mx-6 lg:gap-8 lg:px-6 [&::-webkit-scrollbar]:hidden"
      >
        {dealerships.map((dealer) => (
          <li key={dealer.id} className="shrink-0 snap-start">
            <motion.div
              whileHover={reduce ? undefined : { scale: 1.05 }}
              transition={{ type: "spring", duration: 0.3, bounce: 0.15 }}
            >
              <Link
                href={`/inmobiliarias/${dealer.slug}`}
                data-testid={`dealer-chip-${dealer.slug}`}
                aria-label={`${dealer.name}, ${dealer.vehicleCount} casas`}
                className="group flex w-32 flex-col md:w-36 items-center text-center outline-none"
              >
                <span className="relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border border-line bg-surface text-xl font-semibold tracking-tight text-fg shadow-[var(--card-shadow)] backdrop-blur-sm transition-[border-color,box-shadow] duration-200 group-hover:border-fg/40 group-focus-visible:ring-2 group-focus-visible:ring-fg/60 md:h-28 md:w-28 md:text-2xl [:root:not([data-theme=light])_&]:group-hover:border-brand/60 [:root:not([data-theme=light])_&]:group-hover:shadow-[0_0_28px_-4px_rgba(255,234,0,0.45)]">
                  {dealer.logoUrl ? (
                    <Image
                      src={dealer.logoUrl}
                      alt=""
                      fill
                      sizes="112px"
                      className="object-cover"
                    />
                  ) : (
                    <span aria-hidden>{initials(dealer.name)}</span>
                  )}
                </span>
                <span className="mt-3 max-w-[120px] truncate text-sm font-medium text-fg/90 md:max-w-[140px]">
                  {dealer.name}
                </span>
                <span className="mt-0.5 text-[10px] tabular-nums text-subtle">
                  {dealer.vehicleCount}{" "}
                  {dealer.vehicleCount === 1 ? "casa" : "casas"}
                </span>
              </Link>
            </motion.div>
          </li>
        ))}
      </ul>
    </section>
  );
}
