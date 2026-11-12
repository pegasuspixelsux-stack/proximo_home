import type { Metadata } from "next";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import JsonLd, { breadcrumbs } from "@/lib/json-ld";
import { absoluteUrl } from "@/lib/seo";
import AboutSection from "./components/AboutSection";
import ConversionCTA from "./components/ConversionCTA";
import FAQSection from "./components/FAQSection";
import FinanceCalculator from "./components/FinanceCalculator";
import FinancingSection from "./components/FinancingSection";
import Footer from "./components/Footer";
import SeoIntro from "./components/SeoIntro";
import SiteHeader from "./components/SiteHeader";
import HeroScrollState from "./components/cover/HeroScrollState";
import LinkDrum from "./components/cover/LinkDrum";
import { getSiteSettings } from "./data/site-store";
import { getVehicles } from "./data/vehicle-store";
import InventoryBrowser from "./autos/InventoryBrowser";

// One-page site: every link scrolls to a section below the hero.
const QUICK_LINKS = [
  { label: "Explorar salón", href: "/#inventario" },
  { label: "Comprá tu auto", href: "/#comprar" },
  { label: "Financiación", href: "/#financiacion" },
  { label: "Calculadora", href: "/#calculadora" },
  { label: "Preguntas frecuentes", href: "/#preguntas-frecuentes" },
  { label: "Quiénes somos", href: "/#quienes-somos" },
  { label: "Contacto", href: "/#contacto" },
];

export const metadata: Metadata = {
  title: { absolute: "Autos usados en Tigre y Buenos Aires | Tu Próximo Auto" },
  description:
    "Explorá todos los autos usados en venta en Tigre, Zona Norte, Buenos Aires y CABA. Filtrá por marca, precio, año y kilometraje, y financiá con tarjeta.",
  alternates: { canonical: "/" },
};

export default async function HomePage() {
  const [vehicles, { whatsappNumber, calculatorCurrency }] = await Promise.all([
    getVehicles(),
    getSiteSettings(),
  ]);
  return (
    <>
      <JsonLd
        data={breadcrumbs([
          { name: "Inicio", url: absoluteUrl("/") },
          { name: "Autos usados", url: absoluteUrl("/#inventario") },
        ])}
      />
      <HeroScrollState />
      <SiteHeader transparent />
      <section
        data-testid="cover"
        className="relative flex h-dvh w-full justify-center overflow-hidden bg-black text-white"
      >
        <Image
          src="/hero_image/eq_hero.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-[68%_center] lg:object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/15 to-black/40" />
        <div className="relative z-10 mx-auto flex h-full w-full max-w-[1440px] flex-col items-start justify-end px-4 pb-[calc(6rem+env(safe-area-inset-bottom))] pt-[calc(4.5rem+env(safe-area-inset-top))] text-left sm:px-8 sm:pt-32 lg:px-10 lg:pb-[9dvh]">
          <div className="w-full">
          <h1 className="text-balance text-5xl font-semibold leading-[1.02] tracking-[-0.03em] sm:text-7xl lg:text-8xl xl:text-9xl">
            Encontrá tu próximo auto.
          </h1>
          <p className="mt-4 max-w-xl text-balance text-base text-white/80 sm:text-lg">
            Autos usados seleccionados y verificados en Tigre y Buenos Aires.
          </p>
          <div className="mt-8 flex w-full max-w-xl flex-col items-center">
            <div className="hidden w-full sm:block">
              <LinkDrum links={QUICK_LINKS} />
            </div>
            <a
              href="#inventario"
              className="relative flex w-full items-center justify-center rounded-full bg-white py-3 text-2xl font-semibold text-black shadow-[0_10px_30px_-6px_rgba(0,0,0,0.45)] transition-[transform,opacity] duration-150 hover:opacity-90 active:scale-[0.98] sm:text-3xl"
            >
              Explorar
              <span className="absolute right-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black text-white">
                <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
              </span>
            </a>
          </div>
          </div>
        </div>
        <p className="absolute inset-x-0 bottom-3 z-10 hidden text-center lg:block text-xs font-medium tracking-wide text-white/70">
          Dealio v 3.0
        </p>
      </section>
      <div data-site-home className="light-surface">
      <main
        id="inventario"
        className="mx-auto w-full max-w-[1440px] scroll-mt-20 bg-bg px-3 pb-6 pt-4 text-fg md:pb-12 lg:px-6"
      >
        <InventoryBrowser vehicles={vehicles} />
      </main>
      <div className="mx-auto w-full max-w-[1440px] bg-bg pb-24 text-fg lg:pb-0">
        <SeoIntro />
        <FinancingSection whatsappNumber={whatsappNumber} />
        <FinanceCalculator defaultCurrency={calculatorCurrency} />
        <FAQSection />
        <AboutSection />
        <ConversionCTA whatsappNumber={whatsappNumber} />
        <Footer />
      </div>
      </div>
    </>
  );
}
