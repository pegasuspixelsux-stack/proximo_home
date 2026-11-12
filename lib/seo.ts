/** Canonical origin: the www host (the bare domain redirects here, see next.config.ts). */
export const SITE_URL = "https://www.tuproximacasa.online";

export const SITE_NAME = "Tu Próxima Casa";

export const SITE_DESCRIPTION =
  "Casas de veraneo en Punta del Este: Península, Playa Brava, Playa Mansa, La Barra, Manantiales y José Ignacio. Fotos, comodidades y contacto directo por WhatsApp.";

/** Absolute URL for a site path. */
export const absoluteUrl = (path = "/") => `${SITE_URL}${path === "/" ? "" : path}`;

/**
 * Business facts for structured data. Only what the site already states is
 * filled in; everything else is left out until the owner provides it.
 * TODO(seo): street address, postal code, geo coordinates, opening hours,
 * social profile URLs (sameAs) and the final domain.
 */
export const BUSINESS = {
  locality: "Punta del Este",
  region: "Maldonado",
  country: "UY",
  areaServed: [
    "Punta del Este",
    "Península",
    "Playa Brava",
    "Playa Mansa",
    "La Barra",
    "Manantiales",
    "José Ignacio",
    "Maldonado",
  ],
  sameAs: [] as string[],
} as const;
