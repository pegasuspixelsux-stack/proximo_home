const COUNTRY = /^(uy|uru|uruguay)$/i;

export const FALLBACK_PLACE = "Punta del Este";
/** Kept for callers that still import it; the region label for the whole site. */
export const CAPITAL_LABEL = "Punta del Este, Maldonado";

/**
 * Cleans a free-text `location` ("Parada 5, Playa Brava, UY") into the form used
 * for display, titles, meta and JSON-LD: the last two meaningful parts
 * ("Parada 5, Playa Brava"). The country is dropped and the result is never empty.
 */
export function placeLabel(location: string | null | undefined): string {
  const parts = (location ?? "")
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean);
  while (parts.length > 1 && COUNTRY.test(parts[parts.length - 1])) parts.pop();
  if (parts.length === 0 || (parts.length === 1 && COUNTRY.test(parts[0]))) {
    return FALLBACK_PLACE;
  }
  return parts.slice(-2).join(", ");
}

/** Whether the raw value already is a clean label. */
export function isCleanPlace(location: string | null | undefined): boolean {
  const raw = (location ?? "").trim();
  return raw !== "" && raw === placeLabel(raw);
}

/** Longest candidate that fits in `max` characters (candidates ordered long to short). */
export function fitText(candidates: string[], max: number): string {
  return candidates.find((c) => c.length <= max) ?? candidates[candidates.length - 1];
}

/** Joins parts in order while the result stays within `max`. */
export function fitParts(parts: string[], max: number): string {
  let out = "";
  for (const part of parts) {
    const next = out ? `${out} ${part}` : part;
    if (next.length <= max) out = next;
  }
  return out;
}
