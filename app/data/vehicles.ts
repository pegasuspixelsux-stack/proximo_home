/** NOTE: the `Vehicle` type is a vacation home now (name kept to avoid churn in the Firestore collection and imports). */

/** Punta del Este zones: the site's only location filter. */
export const ZONES = [
  "Península",
  "Playa Brava",
  "Playa Mansa",
  "La Barra",
  "Manantiales",
  "José Ignacio",
] as const;
export type Zone = (typeof ZONES)[number];

export type SellerType = "private" | "dealer";

export interface Dealership {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  /** Display location; built from address, city and province when edited in the dashboard. */
  location: string;
  address?: string;
  city?: string;
  province?: string;
  email?: string;
  /** Inactive dealerships are hidden from the public site. Missing means active. */
  active?: boolean;
  verified: boolean;
  /** Digits only, with country code, so it can be used in a wa.me link. */
  phone: string;
  rating?: number;
}

/** Listing price in USD, converting ARS listings with the given rate (for filters and sorting). */
export const priceInUsd = (
  v: Pick<Vehicle, "price" | "priceCurrency">,
  arsRate: number,
) => (v.priceCurrency === "ARS" && arsRate > 0 ? v.price / arsRate : v.price);

/** Reference number shown on the listing: the saved one, or the padded legacy id. */
export const vehicleReference = (v: Pick<Vehicle, "id" | "reference">) =>
  v.reference || v.id.padStart(4, "0");

export interface Vehicle {
  id: string;
  /** Human-friendly reference number (e.g. "0012"), unique per listing. */
  reference?: string;
  /** Name of the home, e.g. "Casa Los Pinos". */
  name: string;
  price: number;
  /** Currency `price` was listed in; missing means USD. */
  priceCurrency?: "USD" | "ARS";
  /** Punta del Este zone; drives the zone filter. */
  zone: Zone;
  /** Street / neighborhood detail shown under the name (optional). */
  location: string;
  bedrooms: number;
  bathrooms: number;
  /** Maximum number of guests. */
  guests: number;
  /** Featured photo: used on cards and as the first slide on the detail page. */
  image: string;
  /** Every photo of the listing (includes `image`); older listings only have `image`. */
  images?: string[];
  /** Extra detail rows, label → value (e.g. "Superficie" → "320 m²"). */
  specs?: Record<string, string>;
  sellerType: SellerType;
  /** Set when sellerType === "dealer" (an agency). */
  dealership?: Dealership;
  /** WhatsApp number (digits only) for private sellers. */
  sellerPhone?: string;
  /** ISO date the listing was published. */
  createdAt: string;
  badge?: string;
  /** Free-text description shown on the detail page. */
  description?: string;
  /** Feature ids from HOME_FEATURES (e.g. sea view, fireplace). */
  features?: string[];
  /** Amenity ids from HOME_AMENITIES (e.g. pool, wifi). */
  amenities?: string[];
  /** Show on the homepage catalog (capped at HOMEPAGE_LIMIT, newest first). Shown unless set to false. */
  homepage?: boolean;
}

export const HOMEPAGE_LIMIT = 48;
