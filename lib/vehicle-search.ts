import {
  ZONES,
  priceInUsd,
  vehicleReference,
  type Vehicle,
  type Zone,
} from "@/app/data/vehicles";
import { HOME_AMENITY_LABEL, HOME_FEATURE_LABEL } from "@/app/data/home-features";

/** Everything the home-page search box and its advanced panel can ask for. */
export interface SearchCriteria {
  q: string;
  zone: string;
  bedroomsMin: string;
  guestsMin: string;
  priceMin: string;
  priceMax: string;
  seller: string;
}

export const EMPTY_CRITERIA: SearchCriteria = {
  q: "",
  zone: "",
  bedroomsMin: "",
  guestsMin: "",
  priceMin: "",
  priceMax: "",
  seller: "",
};

/** Reads the search form's fields (missing ones stay empty). */
export function readCriteria(form: FormData): SearchCriteria {
  const out = { ...EMPTY_CRITERIA };
  for (const key of Object.keys(out) as (keyof SearchCriteria)[])
    out[key] = String(form.get(key) ?? "").trim();
  return out;
}

export const hasCriteria = (c: SearchCriteria) =>
  Object.values(c).some((v) => v !== "");

/** Lowercase and accent-free, so "jose ignacio" finds "José Ignacio". */
export const norm = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();

/** Free-text search: every word typed must appear somewhere in the listing. */
export function matchesText(v: Vehicle, query: string) {
  const words = norm(query).split(/\s+/).filter(Boolean);
  if (!words.length) return true;
  const haystack = norm(
    [
      v.name,
      v.zone,
      v.location,
      v.badge,
      v.description,
      ...Object.values(v.specs ?? {}),
      ...(v.features ?? []).map((id) => HOME_FEATURE_LABEL[id]),
      ...(v.amenities ?? []).map((id) => HOME_AMENITY_LABEL[id]),
      v.dealership?.name,
      vehicleReference(v),
    ]
      .filter((x) => x != null && x !== "")
      .join(" "),
  );
  return words.every((w) => haystack.includes(w));
}

const num = (s: string) => (s === "" ? null : Number(s));

/** The single predicate behind the home page: text search and every filter must pass. */
export function matchesCriteria(v: Vehicle, c: SearchCriteria, arsRate: number) {
  if (!matchesText(v, c.q)) return false;
  if (c.zone && v.zone !== c.zone) return false;
  if (c.seller && v.sellerType !== c.seller) return false;

  const beds = num(c.bedroomsMin);
  if (beds != null && v.bedrooms < beds) return false;
  const guests = num(c.guestsMin);
  if (guests != null && v.guests < guests) return false;

  const usd = priceInUsd(v, arsRate);
  const priceMin = num(c.priceMin);
  const priceMax = num(c.priceMax);
  if (priceMin != null && usd < priceMin) return false;
  if (priceMax != null && usd > priceMax) return false;
  return true;
}

export type PillId = "all" | Zone;

export interface FilterPill {
  id: PillId;
  label: string;
  test: (v: Vehicle) => boolean;
}

/** Quick-filter pills shared by the home catalog and /casas: one per zone. */
export const FILTER_PILLS: FilterPill[] = [
  { id: "all", label: "Todas", test: () => true },
  ...ZONES.map((z) => ({
    id: z as PillId,
    label: z,
    test: (v: Vehicle) => v.zone === z,
  })),
];

export const isPillId = (value: string): value is PillId =>
  FILTER_PILLS.some((p) => p.id === value);

/** How many listings each pill would show given the current search criteria. */
export function pillCounts(
  vehicles: Vehicle[],
  criteria: SearchCriteria,
  arsRate: number,
): Record<PillId, number> {
  const matching = vehicles.filter((v) => matchesCriteria(v, criteria, arsRate));
  return Object.fromEntries(
    FILTER_PILLS.map((p) => [p.id, matching.filter(p.test).length]),
  ) as Record<PillId, number>;
}
