"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  ChevronDown,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { ZONES } from "../data/vehicles";
import { readCriteria, type SearchCriteria } from "@/lib/vehicle-search";

const EASE_OUT = [0.23, 1, 0.32, 1] as const;

const QUICK_LINKS = [
  { label: "Ver casas", href: "#inventory" },
  { label: "Publicar mi casa", href: "#" },
];
const FIELD =
  "w-full rounded-xl border border-line bg-bg/60 px-3 py-2 text-sm text-fg outline-none transition-colors duration-150 placeholder:text-subtle focus:border-fg/40";

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[10px] font-medium uppercase tracking-widest text-muted">
        {label}
      </span>
      {children}
    </label>
  );
}


/** The advanced filter fields; shared by the inline panel and the mobile search modal. */
export function AdvancedFields({
  defaults,
}: {
  defaults?: Partial<SearchCriteria>;
}) {
  return (
    <>
      <Field label="Zona">
        <select name="zone" defaultValue={defaults?.zone ?? ""} className={FIELD}>
          <option value="">Todas</option>
          {ZONES.map((z) => (
            <option key={z} value={z}>
              {z}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Dormitorios (mín.)">
        <input
          type="number"
          name="bedroomsMin"
          defaultValue={defaults?.bedroomsMin}
          inputMode="numeric"
          min={1}
          placeholder="3"
          className={FIELD}
        />
      </Field>
      <Field label="Huéspedes (mín.)">
        <input
          type="number"
          name="guestsMin"
          defaultValue={defaults?.guestsMin}
          inputMode="numeric"
          min={1}
          placeholder="6"
          className={FIELD}
        />
      </Field>
      <Field label="Precio mín. (US$)">
        <input
          type="number"
          name="priceMin"
          defaultValue={defaults?.priceMin}
          inputMode="numeric"
          min={0}
          placeholder="200000"
          className={FIELD}
        />
      </Field>
      <Field label="Precio máx. (US$)">
        <input
          type="number"
          name="priceMax"
          defaultValue={defaults?.priceMax}
          inputMode="numeric"
          min={0}
          placeholder="2000000"
          className={FIELD}
        />
      </Field>
      <Field label="Anunciante">
        <select name="seller" defaultValue={defaults?.seller ?? ""} className={FIELD}>
          <option value="">Todos</option>
          <option value="private">Particulares</option>
          <option value="dealer">Inmobiliarias</option>
        </select>
      </Field>
    </>
  );
}

export default function HeroSearch({
  compact = false,
  onSearch,
  initial,
}: {
  compact?: boolean;
  /** When given, the search filters live on the page instead of reloading it. */
  onSearch?: (criteria: SearchCriteria) => void;
  /** Pre-fills the search box (e.g. from the mobile search modal). */
  initial?: Partial<SearchCriteria>;
}) {
  const reduce = useReducedMotion();
  const [filtersOpen, setFiltersOpen] = useState(() =>
    Boolean(initial && Object.entries(initial).some(([k, v]) => k !== "q" && v)),
  );

  return (
    <div
      className={
        compact
          ? "relative w-full shrink-0 max-sm:static" // on mobile the filter panel anchors to the search row
          : "mx-auto w-full max-w-xl px-3 text-center lg:max-w-3xl lg:px-6"
      }
    >
      <form
        role="search"
        action="#inventory"
        data-testid="hero-search"
        onChange={
          onSearch
            ? (e) => onSearch(readCriteria(new FormData(e.currentTarget)))
            : undefined
        }
        onSubmit={
          onSearch
            ? (e) => {
                e.preventDefault();
                onSearch(readCriteria(new FormData(e.currentTarget)));
                document
                  .getElementById("inventory")
                  ?.scrollIntoView({ behavior: "smooth", block: "start" });
              }
            : undefined
        }
        className={compact ? "" : "mt-2.5 sm:mt-4"}
      >
        <div className="flex items-center gap-3 rounded-full border border-line bg-surface [:root:not([data-theme=light])_&]:border-white [:root:not([data-theme=light])_&]:bg-white py-2 pl-5 pr-2 shadow-[0_10px_30px_-6px_rgba(0,0,0,0.45)] transition-[transform,box-shadow] duration-300 ease-out hover:shadow-[0_16px_40px_-8px_rgba(0,0,0,0.55)] focus-within:border-fg/40 motion-reduce:transition-none">
          <Search
            className="h-4 w-4 shrink-0 text-muted [:root:not([data-theme=light])_&]:text-zinc-500"
            strokeWidth={1.5}
          />
          <input
            type="search"
            name="q"
            defaultValue={initial?.q}
            aria-label="Buscar casas"
            placeholder={
              compact
                ? "Buscar casa o zona"
                : "Buscá por nombre, zona o comodidad"
            }
            className="w-full bg-transparent text-sm text-fg [:root:not([data-theme=light])_&]:text-black outline-none placeholder:text-subtle [:root:not([data-theme=light])_&]:placeholder:text-zinc-500"
          />
          <button
            type="button"
            aria-expanded={filtersOpen}
            aria-controls="advanced-search"
            aria-label="Filtros"
            data-testid="hero-filters-toggle"
            onClick={() => setFiltersOpen((open) => !open)}
            className="flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-muted [:root:not([data-theme=light])_&]:text-zinc-600 transition-[color,transform] duration-150 hover:text-fg [:root:not([data-theme=light])_&]:hover:text-black active:scale-95"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" strokeWidth={1.75} />
            <span className="hidden sm:inline">Filtros</span>
            <ChevronDown
              className={`h-3.5 w-3.5 transition-transform duration-200 ${filtersOpen ? "rotate-180" : ""}`}
              strokeWidth={1.75}
            />
          </button>
          <button
            type="submit"
            aria-label="Buscar"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-inverse text-on-inverse [:root:not([data-theme=light])_&]:bg-black [:root:not([data-theme=light])_&]:text-white transition-[transform,opacity] duration-150 ease-out hover:opacity-85 active:scale-95"
          >
            <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
          </button>
        </div>

        <AnimatePresence initial={false}>
          {filtersOpen && (
            <motion.div
              id="advanced-search"
              data-testid="hero-advanced-search"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: reduce ? 0 : 0.3, ease: EASE_OUT }}
              className={
                compact
                  ? "absolute right-0 top-full z-30 w-[min(92vw,26rem)] overflow-hidden"
                  : "overflow-hidden"
              }
            >
              <div
                className={`mt-3 grid grid-cols-2 gap-3 rounded-xl border border-line p-4 ${compact ? "bg-bg shadow-2xl" : "bg-surface"} text-left backdrop-blur-md`}
              >
                <AdvancedFields defaults={initial} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
      {!compact && (
        <nav
          aria-label="Accesos rápidos"
          className="mt-3 flex flex-wrap items-center justify-center sm:mt-5 gap-x-6 gap-y-2 text-sm"
        >
          {QUICK_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-muted underline-offset-4 transition-colors duration-150 hover:text-fg hover:underline"
            >
              {link.label}
            </a>
          ))}
        </nav>
      )}
    </div>
  );
}
