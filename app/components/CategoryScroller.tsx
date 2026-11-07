import { Bike, Car, Container, Truck } from "lucide-react";
import Link from "next/link";

const CATEGORIES = [
  { label: "Autos", bodyType: "Auto", icon: Car },
  { label: "Camionetas", bodyType: "Camioneta", icon: Truck },
  { label: "Motos", bodyType: "Moto", icon: Bike },
  { label: "Camiones", bodyType: "Camión", icon: Container },
];

/** Horizontal scroller of vehicle categories; each opens /autos filtered by body type. */
export default function CategoryScroller() {
  return (
    <nav aria-label="Categorías de vehículos" data-testid="category-scroller">
      <ul className="flex snap-x gap-1 overflow-x-auto pb-0 [scrollbar-width:none] sm:justify-center [&::-webkit-scrollbar]:hidden">
        {CATEGORIES.map(({ label, bodyType, icon: Icon }) => (
          <li key={bodyType} className="shrink-0 snap-start">
            <Link
              href={`/autos?bodyType=${encodeURIComponent(bodyType)}`}
              className="group flex w-24 flex-col items-center gap-1 text-center"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-full border border-line bg-surface text-fg transition-[transform,border-color] duration-150 group-hover:border-fg/40 group-active:scale-95">
                <Icon className="h-6 w-6" strokeWidth={1.5} aria-hidden />
              </span>
              <span className="text-xs font-medium text-muted transition-colors duration-150 group-hover:text-fg">
                {label}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
