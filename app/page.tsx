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
        <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-black/15 to-black/55" />
        {/* White fade under the transparent nav; the nav text is dark while it is over this (globals.css). */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-[min(34rem,62%)] sm:h-[min(38rem,58%)]"
          style={{
            // Eased stops (no hard slope change), so there is no visible line where the fade ends.
            background:
              "linear-gradient(to bottom, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.93) 6%, rgba(255,255,255,0.88) 14%, rgba(255,255,255,0.8) 24%, rgba(255,255,255,0.7) 34%, rgba(255,255,255,0.58) 44%, rgba(255,255,255,0.45) 54%, rgba(255,255,255,0.32) 64%, rgba(255,255,255,0.2) 74%, rgba(255,255,255,0.1) 84%, rgba(255,255,255,0.03) 93%, rgba(255,255,255,0) 100%)",
          }}
        />
        {/* Fade into the next section: theme background colour, so it works in light and dark. */}
        <div
          // light-surface: same --bg as the section below, so there is no seam where the hero ends.
          className="light-surface pointer-events-none absolute inset-x-0 -bottom-px h-72 sm:h-80"
          style={{
            background:
              "linear-gradient(to bottom, color-mix(in srgb, var(--bg) 0%, transparent) 0%, color-mix(in srgb, var(--bg) 3%, transparent) 18%, color-mix(in srgb, var(--bg) 8%, transparent) 32%, color-mix(in srgb, var(--bg) 16%, transparent) 46%, color-mix(in srgb, var(--bg) 30%, transparent) 60%, color-mix(in srgb, var(--bg) 50%, transparent) 72%, color-mix(in srgb, var(--bg) 72%, transparent) 83%, color-mix(in srgb, var(--bg) 90%, transparent) 93%, color-mix(in srgb, var(--bg) 100%, transparent) 100%)",
          }}
        />
        <div className="relative z-10 mx-auto flex h-full w-full max-w-[1440px] flex-col items-start justify-end px-3 pb-[calc(max(0.75rem,env(safe-area-inset-bottom))+4.625rem)] pt-[calc(4.5rem+env(safe-area-inset-top))] text-left sm:px-8 sm:pt-32 lg:px-10 lg:pb-16">
          <div className="w-full">
          <h1 className="text-balance text-[calc((100vw-1.5rem)/9.2)] font-semibold leading-[1.05] tracking-[-0.03em] sm:text-5xl lg:text-6xl xl:text-7xl">
            Tu refugio junto{" "}
            <br className="sm:hidden" />
            al mar{" "}
            <br className="hidden sm:block" />
            te espera.
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
