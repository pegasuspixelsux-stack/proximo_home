"use client";

import { LayoutGroup, motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  EMPTY_CRITERIA,
  FILTER_PILLS,
  hasCriteria,
  isPillId,
  matchesCriteria,
  pillCounts,
  type PillId,
  type SearchCriteria,
} from "@/lib/vehicle-search";
import type { Vehicle } from "../data/vehicles";
import { useArsRate } from "./CurrencyProvider";
import CategoryScroller from "./CategoryScroller";
import HeroSearch from "./HeroSearch";
import VehicleCard from "./VehicleCard";

export default function Catalog({ vehicles }: { vehicles: Vehicle[] }) {
  const [filter, setFilter] = useState<PillId>("all");
  const [criteria, setCriteria] = useState<SearchCriteria>(EMPTY_CRITERIA);
  // Bumping this remounts the search box, which empties its inputs.
  const [searchKey, setSearchKey] = useState(0);
  // Mobile category pills ("" = Todos).
  const [category, setCategory] = useState("");
  const arsRate = useArsRate();
  const pillsRef = useRef<HTMLDivElement>(null);

  function scrollPills(direction: -1 | 1) {
    const el = pillsRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * el.clientWidth * 0.7, behavior: "smooth" });
  }

  // The selected pill lives in the URL (?filtro=diesel) so it can be shared.
  useEffect(() => {
    const fromUrl = new URLSearchParams(window.location.search).get("filtro");
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reads the URL once after hydration
    if (fromUrl && isPillId(fromUrl)) setFilter(fromUrl);
  }, []);

  function selectPill(id: PillId) {
    setFilter(id);
    const url = new URL(window.location.href);
    if (id === "all") url.searchParams.delete("filtro");
    else url.searchParams.set("filtro", id);
    window.history.replaceState(null, "", url);
  }

  const counts = useMemo(
    () => pillCounts(vehicles, criteria, arsRate),
    [vehicles, criteria, arsRate],
  );

  const visible = useMemo(() => {
    const active = FILTER_PILLS.find((f) => f.id === filter) ?? FILTER_PILLS[0];
    return vehicles.filter(
      (v) =>
        active.test(v) &&
        (!category || v.bodyType === category) &&
        matchesCriteria(v, criteria, arsRate),
    );
  }, [vehicles, filter, category, criteria, arsRate]);

  const filtering = filter !== "all" || category !== "" || hasCriteria(criteria);

  function clearFilters() {
    selectPill("all");
    setCategory("");
    setCriteria(EMPTY_CRITERIA);
    setSearchKey((k) => k + 1);
  }

  return (
    <section
      id="inventory"
      data-testid="catalog"
      className="mx-auto max-w-[1440px] scroll-mt-4 px-3 pb-1 pt-2 md:pb-12 md:pt-12 lg:px-6 lg:pb-16 lg:pt-16"
    >
      <h2 className="sr-only">Autos usados en venta</h2>
      <div className="mb-2 md:mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-center md:gap-6">
        <LayoutGroup id="inventory-filters">
          <div className="hidden min-w-0 items-center gap-2 md:flex md:max-w-[50%]">
            <button
              type="button"
              aria-label="Desplazar filtros a la izquierda"
              onClick={() => scrollPills(-1)}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-line text-muted transition-[color,transform] duration-150 hover:text-fg active:scale-95"
            >
              <ChevronLeft className="h-4 w-4" strokeWidth={1.75} />
            </button>
            <div
              ref={pillsRef}
              role="group"
              aria-label="Filtrar vehículos"
              className="flex min-w-0 flex-1 snap-x gap-2 overflow-x-auto py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {FILTER_PILLS.map((f) => {
                const selected = f.id === filter;
                const count = counts[f.id];
                return (
                  <button
                    key={f.id}
                    type="button"
                    data-testid={`filter-${f.id}`}
                    aria-pressed={selected}
                    onClick={() => selectPill(f.id)}
                    className={`relative shrink-0 snap-start whitespace-nowrap rounded-full border px-4 py-2 text-xs font-medium transition-[color,border-color,transform] duration-150 active:scale-[0.97] ${
                      selected
                        ? "border-transparent text-on-inverse"
                        : "border-line text-muted hover:border-fg/40 hover:text-fg"
                    } ${count === 0 && !selected ? "opacity-50" : ""}`}
                  >
                    {selected && (
                      <motion.span
                        layoutId="filter-pill"
                        transition={{
                          type: "spring",
                          duration: 0.4,
                          bounce: 0.15,
                        }}
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
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-line text-muted transition-[color,transform] duration-150 hover:text-fg active:scale-95"
            >
              <ChevronRight className="h-4 w-4" strokeWidth={1.75} />
            </button>
          </div>
        </LayoutGroup>
        <div className="relative flex w-full flex-wrap items-start justify-end gap-2 md:flex-nowrap md:justify-start md:w-[32rem] md:max-w-[50%] lg:w-[42rem]">
          <div className="w-full min-w-0 md:hidden">
            <CategoryScroller value={category} onChange={setCategory} />
          </div>
          <div className="hidden min-w-0 flex-1 md:block">
            <HeroSearch
              key={searchKey}
              compact
              onSearch={(next) => {
                setCriteria(next);
                          }}
            />
          </div>
        </div>
      </div>

      {visible.length > 0 && (
        <>
          <div className="mb-2 flex items-baseline justify-between gap-4">
            <h2 className="text-balance text-xl font-light tracking-[-0.02em] md:text-3xl">
              Destacados
            </h2>
            <Link
              href="/autos"
              data-testid="see-all-inventory"
              className="shrink-0 text-xs text-muted underline-offset-4 transition-colors duration-150 hover:text-fg hover:underline"
            >
              Ver todo el inventario →
            </Link>
          </div>
          <ul
            tabIndex={0}
            aria-label="Vehículos destacados, desplazá horizontalmente"
            className="-mx-3 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-px-3 px-3 pb-3 [scrollbar-width:thin] lg:-mx-6 lg:scroll-px-6 lg:px-6"
          >
            {visible.map((vehicle) => (
              <li
                key={vehicle.id}
                className="flex w-[189px] shrink-0 snap-start sm:w-[230px] lg:w-[260px]"
              >
                <VehicleCard vehicle={vehicle} compact />
              </li>
            ))}
          </ul>
        </>
      )}

      {visible.length === 0 && (
        <div
          data-testid="empty-state"
          className="flex flex-col items-center gap-4 py-16 text-center"
        >
          <p className="text-sm text-muted">
            No se encontraron vehículos que coincidan con tu búsqueda.
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
      )}

      <p
        data-testid="result-count"
        aria-live="polite"
        className="mt-10 hidden text-xs tabular-nums text-subtle sm:block"
      >
        {visible.length} {visible.length === 1 ? "vehículo" : "vehículos"}
      </p>
    </section>
  );
}
