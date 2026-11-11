import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";
import SiteHeader from "../components/SiteHeader";
import KeyboardLift from "./KeyboardLift";
import LinkDrum from "./LinkDrum";
import PageLock from "./PageLock";

const QUICK_LINKS = [
  { label: "Explorar salón", href: "/autos" },
  { label: "Quiénes somos", href: "/concesionarias" },
  { label: "Contacto", href: "/#contacto" },
];

export const metadata: Metadata = {
  title: "Tu Próximo Auto | Autos usados en Tigre y Buenos Aires",
  alternates: { canonical: "/portada" },
};

export default function CoverPage() {
  return (
    <>
      {/* One screen, black body: applied only while this page is open. */}
      <PageLock />
      <SiteHeader transparent />
      <main className="h-dvh overflow-hidden bg-black">
        <section
          data-testid="cover"
          className="relative flex h-dvh w-full items-center justify-center overflow-hidden bg-black text-white"
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
          {/* Everything above the photo rides up with the iPhone keyboard. */}
          <KeyboardLift className="absolute inset-0 z-10 flex items-center justify-center">
          <div className="relative -top-[20%] z-10 mx-auto flex w-full max-w-[1440px] flex-col items-start px-4 text-left sm:px-8 lg:px-10">
            <h1 className="text-balance text-5xl font-semibold leading-[1.02] tracking-[-0.03em] sm:text-7xl lg:text-8xl xl:text-9xl">
              Encontrá tu próximo auto.
            </h1>
            <p className="mt-4 max-w-xl text-balance text-base text-white/80 sm:text-lg">
              Autos usados seleccionados y verificados en Tigre y Buenos Aires.
            </p>
          </div>
          <div className="absolute inset-x-0 top-[76%] z-10 lg:top-[80%] mx-auto flex w-full max-w-3xl -translate-y-1/2 justify-center px-4">
            <div className="flex w-full max-w-xl flex-col items-center">
            <LinkDrum links={QUICK_LINKS} />
            <form
              role="search"
              action="/autos"
              method="get"
              className="w-full"
            >
              <div className="flex items-center gap-3 rounded-full bg-white py-2 pl-5 pr-2 shadow-[0_10px_30px_-6px_rgba(0,0,0,0.45)] focus-within:ring-2 focus-within:ring-white/60">
                <Search
                  aria-hidden
                  className="h-4 w-4 shrink-0 text-zinc-500"
                  strokeWidth={1.5}
                />
                <input
                  type="search"
                  name="q"
                  aria-label="Buscar en el inventario"
                  placeholder="Buscá por marca, modelo o palabra clave"
                  className="w-full bg-transparent text-sm text-black outline-none placeholder:text-zinc-500"
                />
                <button
                  type="submit"
                  aria-label="Buscar"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-black text-white transition-[transform,opacity] duration-150 hover:opacity-85 active:scale-95"
                >
                  <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
                </button>
              </div>
            </form>
            <Link
              href="/autos"
              className="mt-4 text-xl font-semibold text-white sm:text-2xl underline-offset-4 transition-colors duration-150 hover:text-white hover:underline"
            >
              Ingresar
            </Link>
            <p className="mt-2 text-xs font-medium tracking-wide text-white/70 lg:hidden">
              Dealio v 3.0
            </p>
            </div>
          </div>
          </KeyboardLift>
          <p className="absolute inset-x-0 bottom-3 z-10 hidden text-center lg:block text-xs font-medium tracking-wide text-white/70">
            Dealio v 3.0
          </p>
        </section>
      </main>
    </>
  );
}
