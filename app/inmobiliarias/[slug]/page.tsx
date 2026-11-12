import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BadgeCheck, MapPin, MessageCircle, Phone, Star } from "lucide-react";
import JsonLd, { breadcrumbs } from "@/lib/json-ld";
import { absoluteUrl } from "@/lib/seo";
import { placeLabel } from "@/lib/place";
import Footer from "../../components/Footer";
import SiteHeader from "../../components/SiteHeader";
import WhatsAppLeadButton from "../../components/WhatsAppLeadButton";
import VehicleCard from "../../components/VehicleCard";
import {
  getDealership,
  getActiveDealerships,
  vehiclesByDealer,
} from "../../data/vehicle-store";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await getActiveDealerships()).map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const dealer = await getDealership((await params).slug);
  if (!dealer) return {};
  const place = placeLabel(dealer.city ? `${dealer.city}, ${dealer.province ?? ""}` : dealer.location);
  return {
    title: `Casas de vacaciones en ${place}`,
    description: `Mirá las casas de vacaciones de ${dealer.name} en ${place}. Consultá precios y coordiná una visita por WhatsApp.`,
    alternates: { canonical: `/inmobiliarias/${dealer.slug}` },
  };
}

export default async function DealerPage({ params }: Props) {
  const dealer = await getDealership((await params).slug);
  if (!dealer) notFound();

  const vehicles = await vehiclesByDealer(dealer.id);
  const whatsappMessage = `Hola ${dealer.name}, vi su inmobiliaria en Tu Próxima Casa y quiero hacer una consulta.`;

  return (
    <>
      <JsonLd
        data={breadcrumbs([
          { name: "Inicio", url: absoluteUrl("/") },
          { name: "Nuestra inmobiliaria", url: absoluteUrl(`/inmobiliarias/${dealer.slug}`) },
        ])}
      />
      <SiteHeader />
      <main className="mx-auto min-h-screen w-full max-w-[1440px] bg-bg px-3 text-fg lg:px-6">
        <section
          data-testid="dealer-banner"
          className="mt-8 rounded-xl border border-line bg-surface p-6 shadow-[var(--card-shadow)] lg:p-10"
        >
          <p className="text-xs font-medium uppercase tracking-widest text-muted">
            Inmobiliaria
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <h1 className="text-balance text-3xl font-light tracking-[-0.02em] lg:text-5xl">
              {dealer.name}
            </h1>
            {dealer.verified && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted">
                <BadgeCheck className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
                Verificada
              </span>
            )}
          </div>

          <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-3 text-sm text-muted">
            <div className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4" strokeWidth={1.75} aria-hidden />
              <dt className="sr-only">Ubicación</dt>
              <dd>{dealer.location}</dd>
            </div>
            <div className="flex items-center gap-1.5">
              <Phone className="h-4 w-4" strokeWidth={1.75} aria-hidden />
              <dt className="sr-only">Teléfono</dt>
              <dd>+{dealer.phone}</dd>
            </div>
            {dealer.rating && (
              <div className="flex items-center gap-1.5 tabular-nums">
                <Star className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                <dt className="sr-only">Calificación</dt>
                <dd>{dealer.rating.toFixed(1)}</dd>
              </div>
            )}
            <div data-testid="dealer-count">
              <dt className="sr-only">Propiedades</dt>
              <dd>
                {vehicles.length}{" "}
                {vehicles.length === 1 ? "casa publicada" : "casas publicadas"}
              </dd>
            </div>
          </dl>

          <WhatsAppLeadButton
            targetPhone={dealer.phone}
            message={whatsappMessage}
            sourceItem={dealer.name}
            testId="dealer-contact"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-inverse px-6 py-3 text-xs font-semibold uppercase tracking-wider text-on-inverse transition-[transform,opacity] duration-150 hover:opacity-85 active:scale-95"
          >
            <MessageCircle className="h-4 w-4" strokeWidth={1.75} aria-hidden />
            Consultar por WhatsApp
          </WhatsAppLeadButton>
        </section>

        <section className="py-16" aria-labelledby="dealer-inventory">
          <h2
            id="dealer-inventory"
            className="text-3xl font-light tracking-[-0.02em] lg:text-4xl"
          >
            Casas
          </h2>
          {vehicles.length === 0 ? (
            <p className="py-16 text-center text-sm text-muted">
              Esta inmobiliaria todavía no tiene casas publicadas.
            </p>
          ) : (
            <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
              {vehicles.map((vehicle) => (
                <VehicleCard
                  key={vehicle.id}
                  vehicle={vehicle}
                  compact="mobile"
                />
              ))}
            </div>
          )}
        </section>
      </main>
      <div className="mx-auto w-full max-w-[1440px]">
        <Footer />
      </div>
    </>
  );
}
