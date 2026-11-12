import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  BadgeCheck,
  BedDouble,
  Bath,
  Building2,
  CalendarCheck,
  Check,
  MapPin,
  MessageCircle,
  Settings2,
  Users,
} from "lucide-react";
import JsonLd, { breadcrumbs } from "@/lib/json-ld";
import { vehicleSchema } from "@/lib/schema";
import { absoluteUrl } from "@/lib/seo";
import AboutSection from "../../components/AboutSection";
import ConversionCTA from "../../components/ConversionCTA";
import FAQSection from "../../components/FAQSection";
import Footer from "../../components/Footer";
import SeoIntro from "../../components/SeoIntro";
import SiteHeader from "../../components/SiteHeader";
import ShareVehicle from "../../components/ShareVehicle";
import WhatsAppLeadButton from "../../components/WhatsAppLeadButton";
import VehicleCard from "../../components/VehicleCard";
import VehicleSlideshow from "../../components/VehicleSlideshow";
import {
  HOME_AMENITY_LABEL,
  HOME_FEATURE_LABEL,
} from "../../data/home-features";
import { getSiteSettings } from "../../data/site-store";
import { getVehicle, getVehicles } from "../../data/vehicle-store";
import { fitParts, fitText, placeLabel } from "@/lib/place";
import { formatPrice } from "../../data/site";
import { vehicleReference } from "../../data/vehicles";

type Props = { params: Promise<{ id: string }> };

const date = new Intl.DateTimeFormat("es-UY", {
  day: "numeric",
  month: "long",
  year: "numeric",
});
export async function generateStaticParams() {
  return (await getVehicles()).map((v) => ({ id: v.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const vehicle = await getVehicle((await params).id);
  if (!vehicle) return {};
  const title = vehicle.name;
  const place = `${vehicle.zone}, Punta del Este`;
  // Page title budget: 60 chars minus the site-name suffix.
  const pageTitle = fitText(
    [
      `${title}, casa de vacaciones en ${vehicle.zone}`,
      `${title} en ${vehicle.zone}`,
      title,
    ],
    42,
  );
  const base = fitParts(
    [
      `${title}, casa de vacaciones en ${place}.`,
      `${vehicle.bedrooms} dormitorios, ${vehicle.bathrooms} baños,`,
      `hasta ${vehicle.guests} huéspedes.`,
      `${formatPrice(vehicle.price, vehicle.priceCurrency)}.`,
    ],
    160,
  );
  // Longest closing sentence that still fits in 160 chars.
  const tail = [
    "Coordiná una visita y consultá disponibilidad por WhatsApp.",
    "Coordiná una visita por WhatsApp.",
    "Consultá por WhatsApp.",
  ].find((t) => base.length + 1 + t.length <= 160);
  const description = tail ? `${base} ${tail}` : base;
  return {
    title: pageTitle,
    description,
    alternates: { canonical: `/casas/${vehicle.id}` },
    // Without a photo, keep the site-wide generated image instead of an empty one.
    ...(vehicle.image && { openGraph: { images: [vehicle.image] } }),
  };
}

// `params` is request-time data, so the page awaits it behind a Suspense
// boundary; the fallback is what an instant navigation shows meanwhile.
export default function VehiclePage({ params }: Props) {
  return (
    <Suspense
      fallback={
        <main
          aria-busy="true"
          className="mx-auto min-h-screen w-full max-w-[1440px] bg-bg"
        />
      }
    >
      <VehicleDetail params={params} />
    </Suspense>
  );
}

async function VehicleDetail({ params }: Props) {
  const vehicle = await getVehicle((await params).id);
  if (!vehicle) notFound();

  const title = vehicle.name;
  const { whatsappNumber } = await getSiteSettings();
  const whatsappMessage = `Hola, me interesa la casa ${title} publicada en Tu Próxima Casa.`;
  const visitMessage = `Hola, quisiera agendar una visita a la casa ${title} publicada en Tu Próxima Casa.`;
  const zonePlace = `${vehicle.zone}, Punta del Este`;
  const fullLocation = vehicle.location
    ? `${vehicle.location}, ${zonePlace}`
    : zonePlace;

  // Shown when the listing has no description of its own.
  const fallbackDescription = `${title} es una casa de vacaciones en ${zonePlace} con ${vehicle.bedrooms} dormitorios, ${vehicle.bathrooms} baños y capacidad para ${vehicle.guests} huéspedes. Podés conocerla en persona y revisar todos los detalles antes de decidir. Escribinos por WhatsApp para consultar disponibilidad, pedir más fotos o coordinar una visita; te respondemos a la brevedad y te acompañamos en cada paso del proceso.`;

  const highlights = [
    { icon: BedDouble, label: "Dormitorios", value: `${vehicle.bedrooms} dorm.` },
    { icon: Bath, label: "Baños", value: `${vehicle.bathrooms} baños` },
    { icon: Users, label: "Huéspedes", value: `${vehicle.guests} huéspedes` },
  ];

  const specs = [
    { icon: MapPin, label: "Zona", value: vehicle.zone },
    ...(vehicle.location
      ? [{ icon: MapPin, label: "Ubicación", value: vehicle.location }]
      : []),
    { icon: BedDouble, label: "Dormitorios", value: String(vehicle.bedrooms) },
    { icon: Bath, label: "Baños", value: String(vehicle.bathrooms) },
    { icon: Users, label: "Huéspedes", value: String(vehicle.guests) },
    ...Object.entries(vehicle.specs ?? {}).map(([label, value]) => ({
      icon: Settings2,
      label,
      value,
    })),
  ];

  // Featured photo first, then the rest; older listings only have `image`.
  const photos = [
    vehicle.image,
    ...(vehicle.images ?? []).filter((src) => src !== vehicle.image),
  ].filter(Boolean);

  const all = await getVehicles();
  const related = all.filter(
    (v) => v.id !== vehicle.id && v.zone === vehicle.zone,
  )
    .concat(all.filter((v) => v.zone !== vehicle.zone))
    .filter((v) => v.id !== vehicle.id)
    .slice(0, 12);

  return (
    <>
      <JsonLd data={vehicleSchema(vehicle, vehicle.description || fallbackDescription)} />
      <JsonLd
        data={breadcrumbs([
          { name: "Inicio", url: absoluteUrl("/") },
          { name: "Casas de vacaciones", url: absoluteUrl("/casas") },
          { name: title, url: absoluteUrl(`/casas/${vehicle.id}`) },
        ])}
      />
      <SiteHeader />
      <main className="mx-auto min-h-screen w-full max-w-[1440px] bg-bg px-3 pb-6 pt-[10px] text-fg md:pb-12 lg:px-6 lg:pt-5">
        <Link
          href="/#inventario"
          className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-widest text-muted transition-colors duration-150 hover:text-fg"
        >
          <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
          Ver todas las casas
        </Link>

        <div className="mt-6 grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:gap-12">
          <div className="flex flex-col gap-6">
            <VehicleSlideshow
              images={photos}
              alt={title}
              badge={vehicle.badge}
            />
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-muted">
              {vehicle.zone} · Punta del Este
            </p>
            <h1
              data-testid="vehicle-title"
              className="mt-2 text-balance text-3xl font-semibold tracking-[-0.02em] lg:text-5xl"
            >
              {vehicle.name}
            </h1>
            <p
              data-testid="vehicle-price"
              className="mt-4 text-3xl font-light tabular-nums tracking-tight"
            >
              {formatPrice(vehicle.price, vehicle.priceCurrency)}
            </p>
            <hr className="mt-6 border-line" />
            <ul
              data-testid="vehicle-highlights"
              className="grid grid-cols-3 gap-2 py-5 text-center"
            >
              {highlights.map(({ icon: Icon, label, value }) => (
                <li key={label} className="flex flex-col items-center gap-1.5">
                  <Icon
                    className="h-5 w-5 text-muted"
                    strokeWidth={1.75}
                    aria-hidden
                  />
                  <span className="sr-only">{label}: </span>
                  <span className="text-sm font-medium">{value}</span>
                </li>
              ))}
            </ul>
            <hr className="border-line" />

            <p className="mt-4 text-xs text-subtle">
              <span data-testid="vehicle-id">
                N.º de referencia: {vehicleReference(vehicle)}
              </span>
              {" · "}
              Publicado el{" "}
              {date.format(new Date(`${vehicle.createdAt}T12:00:00`))}
            </p>

            <section
              aria-label="Anunciante"
              data-testid="seller-card"
              className="mt-8 rounded-xl border border-line bg-surface p-5 shadow-[var(--card-shadow)]"
            >
              <p className="text-[10px] font-medium uppercase tracking-widest text-muted">
                Anunciante
              </p>
              <p className="mt-2 flex items-center gap-2 text-lg font-medium tracking-tight">
                <Building2
                  className="h-4 w-4 shrink-0 text-muted"
                  strokeWidth={1.75}
                  aria-hidden
                />
                {vehicle.dealership?.name ?? "Propietario particular"}
                {vehicle.dealership?.verified && (
                  <BadgeCheck
                    className="h-4 w-4 shrink-0 text-muted"
                    strokeWidth={1.75}
                    aria-label="Verificada"
                  />
                )}
              </p>
              <p className="mt-1 inline-flex items-center gap-1.5 text-sm text-muted">
                <MapPin
                  className="h-3.5 w-3.5"
                  strokeWidth={1.75}
                  aria-hidden
                />
                {fullLocation}
              </p>

              {whatsappNumber && (
                <WhatsAppLeadButton
                  targetPhone={whatsappNumber}
                  message={whatsappMessage}
                  sourceItem={title}
                  testId="vehicle-contact"
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-emerald-700 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white transition-[background-color,transform] duration-150 hover:bg-emerald-800 active:scale-[0.98]"
                >
                  <MessageCircle
                    className="h-4 w-4"
                    strokeWidth={1.75}
                    aria-hidden
                  />
                  Contactar por WhatsApp
                </WhatsAppLeadButton>
              )}
              {whatsappNumber && (
                <a
                  href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(visitMessage)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid="vehicle-test-drive"
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-full border border-fg bg-transparent px-6 py-3 text-xs font-semibold uppercase tracking-wider text-fg transition-[background-color,transform] duration-150 hover:bg-fg/5 focus-visible:bg-fg/5 active:scale-[0.98]"
                >
                  <CalendarCheck
                    className="h-4 w-4"
                    strokeWidth={1.75}
                    aria-hidden
                  />
                  Agendar una visita
                </a>
              )}
            </section>

            <ShareVehicle
              title={title}
              price={formatPrice(vehicle.price, vehicle.priceCurrency)}
              url={absoluteUrl(`/casas/${vehicle.id}`)}
              image={vehicle.image || undefined}
            />
          </div>

          <section aria-labelledby="description-heading">
            <h2
              id="description-heading"
              className="text-3xl font-semibold tracking-[-0.02em] lg:text-4xl"
            >
              Descripción
            </h2>
            <p
              data-testid="vehicle-description"
              className="mt-4 whitespace-pre-line text-pretty leading-relaxed text-muted"
            >
              {vehicle.description || fallbackDescription}
            </p>
          </section>

          <section aria-labelledby="specs-heading">
            <h2
              id="specs-heading"
              className="text-3xl font-semibold tracking-[-0.02em] lg:text-4xl"
            >
              Detalles de la casa
            </h2>
            <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {specs.map(({ icon: Icon, label, value }) => (
                <div
                  key={label}
                  className="rounded-xl border border-line bg-surface p-4"
                >
                  <Icon
                    className="h-4 w-4 text-muted"
                    strokeWidth={1.75}
                    aria-hidden
                  />
                  <dt className="mt-3 text-[10px] font-medium uppercase tracking-widest text-muted">
                    {label}
                  </dt>
                  <dd className="mt-1 text-sm font-medium">{value}</dd>
                </div>
              ))}
            </dl>
          </section>
        </div>

        {(
          [
            {
              key: "features",
              heading: "Características",
              ids: vehicle.features,
              labels: HOME_FEATURE_LABEL,
            },
            {
              key: "amenities",
              heading: "Comodidades",
              ids: vehicle.amenities,
              labels: HOME_AMENITY_LABEL,
            },
          ] as const
        ).map(
          ({ key, heading, ids, labels }) =>
            ids &&
            ids.length > 0 && (
              <section
                key={key}
                aria-labelledby={`${key}-heading`}
                className="mt-12 lg:mt-24"
              >
                <h2
                  id={`${key}-heading`}
                  className="text-3xl font-semibold tracking-[-0.02em] lg:text-4xl"
                >
                  {heading}
                </h2>
                <ul
                  data-testid={`vehicle-${key}`}
                  className="mt-6 grid gap-x-6 gap-y-3 sm:grid-cols-2 lg:grid-cols-3"
                >
                  {ids.map((id) => (
                    <li key={id} className="flex items-center gap-2 text-sm">
                      <Check
                        className="h-4 w-4 shrink-0 text-muted"
                        strokeWidth={1.75}
                        aria-hidden
                      />
                      {labels[id] ?? id}
                    </li>
                  ))}
                </ul>
              </section>
            ),
        )}

        <section aria-labelledby="related-heading" className="mt-12 lg:mt-24">
          <h2
            id="related-heading"
            className="text-3xl font-semibold tracking-[-0.02em] lg:text-4xl"
          >
            Más casas para conocer
          </h2>
          <ul
            tabIndex={0}
            aria-label="Más casas, desplazá horizontalmente"
            data-testid="related-scroller"
            className="-mx-3 mt-6 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-px-3 px-3 pb-8 pt-4 [scrollbar-width:thin] lg:-mx-6 lg:scroll-px-6 lg:px-6"
          >
            {related.map((v) => (
              <li
                key={v.id}
                className="flex w-[189px] shrink-0 snap-start sm:w-[214px]"
              >
                <VehicleCard vehicle={v} compact tall />
              </li>
            ))}
          </ul>
        </section>
      </main>
      <div className="mx-auto w-full max-w-[1440px] bg-bg text-fg">
        {/* The same collapsible sections as the home page, in the same order. */}
        <SeoIntro />
        <FAQSection />
        <AboutSection />
        <ConversionCTA whatsappNumber={whatsappNumber} />
        <Footer />
      </div>
    </>
  );
}
