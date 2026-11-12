"use client";

import { LayoutGroup, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Search, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  EMPTY_CRITERIA,
  FILTER_PILLS,
  hasCriteria,
  matchesCriteria,
  pillCounts,
  type PillId,
  type SearchCriteria,
} from "@/lib/vehicle-search";
import { useArsRate } from "../components/CurrencyProvider";
import CategoryScroller from "../components/CategoryScroller";
import VehicleCard from "../components/VehicleCard";
import type { Vehicle } from "../data/vehicles";

const PAGE_SIZE = 12;

export default function InventoryBrowser({
  vehicles,
}: {
  vehicles: Vehicle[];
}) {
  const [criteria, setCriteria] = useState<SearchCriteria>(EMPTY_CRITERIA);
  // Bumping this remounts the search box, which empties its inputs.
  const [searchKey, setSearchKey] = useState(0);
  const [pill, setPill] = useState<PillId>("all");
  const [page, setPage] = useState(1);
  // Mobile category pills ("" = Todos), same as the home page.
  const [category, setCategory] = useState("");
  const [initial, setInitial] = useState<Partial<SearchCriteria>>();
  const pillsRef = useRef<HTMLDivElement>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const arsRate = useArsRate();

  // The mobile search modal sends its query as URL params; apply them once on arrival.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const fromUrl = { ...EMPTY_CRITERIA };
    for (const key of Object.keys(fromUrl) as (keyof SearchCriteria)[])
      fromUrl[key] = (params.get(key) ?? "").trim();
    // The zone is shown by the category pills instead of the filter panel.
    const urlCategory = fromUrl.zone;
    fromUrl.zone = "";
    if (!hasCriteria(fromUrl) && !urlCategory) return;
    // Deferred so the first (server-matching) render stays untouched.
    queueMicrotask(() => {
      setInitial(fromUrl);
      setCategory(urlCategory);
      setCriteria(fromUrl);
      setSearchKey((k) => k + 1);
    });
  }, []);

  const counts = useMemo(
    () => pillCounts(vehicles, criteria, arsRate),
    [vehicles, criteria, arsRate],
  );

  const results = useMemo(() => {
    const pillTest = (FILTER_PILLS.find((p) => p.id === pill) ?? FILTER_PILLS[0]).test;
    const list = vehicles.filter(
      (v) =>
        pillTest(v) &&
        (!category || v.zone === category) &&
        matchesCriteria(v, criteria, arsRate),
    );
    // Newest first.
    return list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }, [vehicles, criteria, pill, category, arsRate]);

  const filtering = pill !== "all" || category !== "" || hasCriteria(criteria);
  const pageCount = Math.max(1, Math.ceil(results.length / PAGE_SIZE));
  const current = Math.min(page, pageCount);
  const items = results.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  function clearFilters() {
    setPill("all");
    setCategory("");
    setCriteria(EMPTY_CRITERIA);
    setInitial(undefined);
    setSearchKey((k) => k + 1);
    setPage(1);
  }
  function scrollPills(direction: -1 | 1) {
    const el = pillsRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * el.clientWidth * 0.7, behavior: "smooth" });
  }
  function goTo(n: number) {
    setPage(n);
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const searchBox = (className: string, testId: string) => (
    <form
      role="search"
      onSubmit={(e) => e.preventDefault()}
      className={`flex items-center gap-3 rounded-full border border-line bg-surface py-2 pl-4 pr-2 focus-within:border-fg/40 ${className}`}
    >
      <Search aria-hidden className="h-4 w-4 shrink-0 text-muted" strokeWidth={1.5} />
      <input
        type="search"
        value={criteria.q}
        onChange={(e) => {
          setCriteria((c) => ({ ...c, q: e.target.value }));
          setPage(1);
        }}
        aria-label="Buscar casas"
        data-testid={testId}
        placeholder="Buscá por nombre, zona o comodidad"
        className="w-full min-w-0 bg-transparent text-base text-fg outline-none placeholder:text-subtle sm:text-sm [&::-webkit-search-cancel-button]:hidden"
      />
      {criteria.q && (
        <button
          type="button"
          aria-label="Borrar búsqueda"
          onClick={() => {
            setCriteria((c) => ({ ...c, q: "" }));
            setPage(1);
          }}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-muted transition-[color,transform] duration-150 hover:text-fg active:scale-95"
        >
          <X className="h-4 w-4" strokeWidth={1.75} aria-hidden />
        </button>
      )}
    </form>
  );

  return (
    <>
      <header className="pt-[10px] lg:pt-5">
        <h1 className="sr-only">
          Casas de vacaciones en Punta del Este
        </h1>
        <p className="mt-1 max-w-2xl text-center text-muted sm:text-left">
          Explorá nuestras casas de vacaciones en Punta del Este.
        </p>
      </header>

      {/* Search lives in the top nav; this is just the scroll anchor. */}
      <div ref={topRef} className="scroll-mt-20" />

      <section className="mt-2 md:mt-4 lg:mt-3" aria-label="Resultados">
        {searchBox("mb-2 md:hidden", "inventory-search-mobile")}
        <div className="mb-2 md:hidden">
          <CategoryScroller
            value={category}
            onChange={(next) => {
              setCategory(next);
              setPage(1);
            }}
          />
        </div>
        <LayoutGroup id="inventory-filters">
          <div className="mb-2 hidden min-w-0 md:flex items-center gap-2">
            <button
              type="button"
              aria-label="Desplazar filtros a la izquierda"
              onClick={() => scrollPills(-1)}
              className="hidden h-8 w-8 shrink-0 items-center justify-center rounded-full border border-line text-muted transition-[color,transform] duration-150 hover:text-fg active:scale-95 md:flex"
            >
              <ChevronLeft className="h-4 w-4" strokeWidth={1.75} />
            </button>
            <div
              ref={pillsRef}
              role="group"
              aria-label="Filtrar por zona"
              className="flex min-w-0 flex-1 snap-x gap-2 overflow-x-auto py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {FILTER_PILLS.map((f) => {
                const selected = f.id === pill;
                const count = counts[f.id];
                return (
                  <button
                    key={f.id}
                    type="button"
                    data-testid={`filter-${f.id}`}
                    aria-pressed={selected}
                    onClick={() => {
                      setPill(f.id);
                      setPage(1);
                    }}
                    className={`relative shrink-0 snap-start whitespace-nowrap rounded-full border px-4 py-2 text-xs font-medium transition-[color,border-color,transform] duration-150 active:scale-[0.97] ${
                      selected
                        ? "border-transparent text-on-inverse"
                        : "border-line text-muted hover:border-fg/40 hover:text-fg"
                    } ${count === 0 && !selected ? "opacity-50" : ""}`}
                  >
                    {selected && (
                      <motion.span
                        layoutId="filter-pill"
                        transition={{ type: "spring", duration: 0.4, bounce: 0.15 }}
                        className="absolute inset-0 rounded-full bg-inverse"
                      />
                    )}
                    <span className="relative">
                      {f.label}
                      <span className="ml-1.5 tabular-nums opacity-60">{count}</span>
                    </span>
                  </button>
                );
              })}
            </div>
            <button
              type="button"
              aria-label="Desplazar filtros a la derecha"
              onClick={() => scrollPills(1)}
              className="hidden h-8 w-8 shrink-0 items-center justify-center rounded-full border border-line text-muted transition-[color,transform] duration-150 hover:text-fg active:scale-95 md:flex"
            >
              <ChevronRight className="h-4 w-4" strokeWidth={1.75} />
            </button>
            {searchBox("w-1/2 shrink-0", "inventory-search")}
          </div>
        </LayoutGroup>

        {items.length === 0 ? (
          <div
            data-testid="empty-state"
            className="flex flex-col items-center gap-4 py-24 text-center"
          >
            <p className="text-sm text-muted">
              Ninguna casa coincide con los filtros. Probá con otros o
              limpialos.
            </p>
            {filtering && (
              <button
                type="button"
                onClick={clearFilters}
                data-testid="clear-search"
                className="rounded-full border border-line px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-fg transition-[border-color,transform] duration-150 hover:border-fg/40 active:scale-95"
              >
                Limpiar filtros
              </button>
            )}
          </div>
        ) : (
          // Same cards and grid as the home page catalog.
          <ul className={`mt-3 grid sm:mx-0 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4 grid-cols-1 gap-3`}>
            {items.map((v) => (
              <li key={v.id} className="flex">
                <VehicleCard
                  vehicle={v}
                  animateIn={false}
                />
              </li>
            ))}
          </ul>
        )}

        <p
          data-testid="results-count"
          aria-live="polite"
          className="mt-4 text-left text-sm tabular-nums text-muted"
        >
          Mostrando {items.length} de {results.length}{" "}
          {results.length === 1 ? "casa" : "casas"}
        </p>

        {pageCount > 1 && (
          <nav
            aria-label="Paginación"
            data-testid="pagination"
            className="mt-12 flex flex-wrap items-center justify-center gap-2"
          >
            <button
              type="button"
              disabled={current === 1}
              onClick={() => goTo(current - 1)}
              className="inline-flex h-9 items-center gap-1 rounded-full border border-line px-4 text-xs font-medium text-muted transition-[color,transform] duration-150 hover:text-fg active:scale-95 disabled:pointer-events-none disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" strokeWidth={1.75} aria-hidden />
              Anterior
            </button>
            {Array.from({ length: pageCount }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                type="button"
                aria-label={`Página ${n}`}
                aria-current={n === current ? "page" : undefined}
                onClick={() => goTo(n)}
                className={`h-9 min-w-9 rounded-full px-3 text-xs font-medium tabular-nums transition-[color,background-color,transform] duration-150 active:scale-95 ${
                  n === current
                    ? "bg-inverse text-on-inverse"
                    : "border border-line text-muted hover:text-fg"
                }`}
              >
                {n}
              </button>
            ))}
            <button
              type="button"
              disabled={current === pageCount}
              onClick={() => goTo(current + 1)}
              className="inline-flex h-9 items-center gap-1 rounded-full border border-line px-4 text-xs font-medium text-muted transition-[color,transform] duration-150 hover:text-fg active:scale-95 disabled:pointer-events-none disabled:opacity-40"
            >
              Siguiente
              <ChevronRight className="h-4 w-4" strokeWidth={1.75} aria-hidden />
            </button>
          </nav>
        )}
      </section>
    </>
  );
}
