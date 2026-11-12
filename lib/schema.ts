import { FAQS } from "@/app/data/faqs";
import { HOME_AMENITY_LABEL, HOME_FEATURE_LABEL } from "@/app/data/home-features";
import type { Vehicle } from "@/app/data/vehicles";
import { absoluteUrl, BUSINESS, SITE_NAME } from "@/lib/seo";

/** Organization + RealEstateAgent. Unknown facts (street, hours, geo) are left out, see lib/seo.ts. */
export function organizationSchema(whatsappNumber: string) {
  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "RealEstateAgent"],
    "@id": absoluteUrl("/#organization"),
    name: SITE_NAME,
    alternateName: SITE_NAME,
    url: absoluteUrl("/"),
    logo: absoluteUrl("/logo_folder/icon-512.png"),
    image: absoluteUrl("/logo_folder/icon-512.png"),
    telephone: `+${whatsappNumber}`,
    address: {
      "@type": "PostalAddress",
      addressLocality: BUSINESS.locality,
      addressRegion: BUSINESS.region,
      addressCountry: BUSINESS.country,
    },
    areaServed: BUSINESS.areaServed.map((name) => ({ "@type": "Place", name })),
    ...(BUSINESS.sameAs.length > 0 && { sameAs: BUSINESS.sameAs }),
  };
}

export function faqSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

export function vehicleSchema(home: Vehicle, description: string) {
  const url = absoluteUrl(`/casas/${home.id}`);
  const features = [
    ...(home.features ?? []).map((id) => HOME_FEATURE_LABEL[id]),
    ...(home.amenities ?? []).map((id) => HOME_AMENITY_LABEL[id]),
  ].filter(Boolean);
  return {
    "@context": "https://schema.org",
    "@type": ["House", "Accommodation"],
    name: home.name,
    url,
    description,
    image: home.images?.length ? home.images : [home.image],
    numberOfBedrooms: home.bedrooms,
    numberOfBathroomsTotal: home.bathrooms,
    occupancy: {
      "@type": "QuantitativeValue",
      maxValue: home.guests,
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: home.zone,
      addressRegion: BUSINESS.region,
      addressCountry: BUSINESS.country,
    },
    ...(features.length > 0 && {
      amenityFeature: features.map((name) => ({
        "@type": "LocationFeatureSpecification",
        name,
        value: true,
      })),
    }),
    offers: {
      "@type": "Offer",
      url,
      price: home.price,
      priceCurrency: home.priceCurrency ?? "USD",
      availability: "https://schema.org/InStock",
      seller: { "@id": absoluteUrl("/#organization") },
    },
  };
}
