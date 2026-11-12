import type { Metadata } from "next";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import JsonLd, { breadcrumbs } from "@/lib/json-ld";
import { absoluteUrl } from "@/lib/seo";
import AboutSection from "./components/AboutSection";
import ConversionCTA from "./components/ConversionCTA";
import FAQSection from "./components/FAQSection";
import Footer from "./components/Footer";
import SeoIntro from "./components/SeoIntro";
import SiteHeader from "./components/SiteHeader";
import HeroScrollState from "./components/cover/HeroScrollState";
import { getSiteSettings } from "./data/site-store";
import { getVehicles } from "./data/vehicle-store";
import InventoryBrowser from "./casas/InventoryBrowser";

export const metadata: Metadata = {
  title: { absolute: "Casas de vacaciones en Punta del Este | Tu Próxima Casa" },
  description:
    "Explorá casas de vacaciones en Punta del Este: Península, Playa Brava, Playa Mansa, La Barra, Manantiales y José Ignacio. Filtrá por zona, dormitorios y precio.",
  alternates: { canonical: "/" },
};

export default async function HomePage() {
  const [vehicles, { whatsappNumber }] = await Promise.all([
    getVehicles(),
    getSiteSettings(),
  ]);
  return (
    <>
      <JsonLd
        data={breadcrumbs([
          { name: "Inicio", url: absoluteUrl("/") },
          { name: "Casas de vacaciones", url: absoluteUrl("/#inventario") },
        ])}
      />
      <HeroScrollState />
      <SiteHeader transparent />
      <section
        data-testid="cover"
        className="relative flex h-dvh w-full justify-center overflow-hidden bg-black text-white lg:h-[70vh]"
      >
        <Image
          src="/hero_image/pde_aerial.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-[72%_center] lg:object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/20 to-black/55" />
        <div className="relative z-10 mx-auto flex h-full w-full max-w-[1440px] flex-col items-start justify-end px-3 pb-[calc(max(0.75rem,env(safe-area-inset-bottom))+4.625rem)] pt-[calc(4.5rem+env(safe-area-inset-top))] text-left sm:px-8 sm:pt-32 lg:px-10 lg:pb-8">
          <div className="w-full">
          <h1 className="text-balance text-[calc((100vw-1.5rem)/7.3)] font-semibold leading-[1.05] tracking-[-0.03em] sm:text-5xl lg:text-6xl xl:text-7xl">
            Encontrá tu
            <br />
            próxima casa.
          </h1>
          <p className="mt-3 max-w-xl text-balance text-base text-white/80 sm:text-lg lg:text-xl">
            Casas de vacaciones seleccionadas en Punta del Este.
          </p>
          <div className="mt-8 flex w-full max-w-xl flex-col items-start self-center lg:self-start">
            <a
              href="#inventario"
              className="relative flex h-[3.875rem] w-full items-center justify-center rounded-full bg-white px-14 text-base font-semibold text-black lg:w-[30%] lg:min-w-[10.8rem] lg:pl-4 lg:pr-14 shadow-[0_10px_30px_-6px_rgba(0,0,0,0.45)] transition-[transform,opacity] duration-150 hover:opacity-90 active:scale-[0.98]"
            >
              Explorar
              <span className="absolute right-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black text-white">
                <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
              </span>
            </a>
          </div>
          </div>
        </div>
      </section>
      <div data-site-home className="light-surface">
      <main
        id="inventario"
        className="mx-auto w-full max-w-[1440px] scroll-mt-20 bg-bg px-3 pb-6 pt-4 text-fg md:pb-12 lg:px-6"
      >
        <InventoryBrowser vehicles={vehicles} />
      </main>
      <div className="mx-auto w-full max-w-[1440px] bg-bg text-fg">
        <SeoIntro />
        <FAQSection />
        <AboutSection />
        <ConversionCTA whatsappNumber={whatsappNumber} />
        <Footer />
      </div>
      </div>
    </>
  );
}
