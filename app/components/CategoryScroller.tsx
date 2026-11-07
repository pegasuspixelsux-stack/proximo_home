"use client";

const CATEGORIES = [
  { label: "Todos", bodyType: "" },
  { label: "Autos", bodyType: "Auto" },
  { label: "SUV", bodyType: "SUV" },
  { label: "Camionetas", bodyType: "Camioneta" },
  { label: "Motos", bodyType: "Moto" },
  { label: "Camiones", bodyType: "Camión" },
];

/** Horizontal row of category pills; the selected one is filled. "" means all. */
export default function CategoryScroller({
  value,
  onChange,
}: {
  value: string;
  onChange: (bodyType: string) => void;
}) {
  return (
    <div
      role="group"
      aria-label="Categorías de vehículos"
      data-testid="category-scroller"
      className="flex snap-x gap-2 overflow-x-auto py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      {CATEGORIES.map(({ label, bodyType }) => {
        const selected = value === bodyType;
        return (
          <button
            key={label}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(bodyType)}
            className={`shrink-0 snap-start whitespace-nowrap rounded-full border px-4 py-2 text-xs font-medium transition-[color,background-color,border-color,transform] duration-150 active:scale-[0.97] ${
              selected
                ? "border-transparent bg-inverse text-on-inverse"
                : "border-line text-muted hover:border-fg/40 hover:text-fg"
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
