"use client";

import Image from "next/image";
import { Star } from "lucide-react";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import type { HeroSlide } from "../data/hero";

const INTERVAL_MS = 6000;

/**
 * Hero photos skip Next's image optimizer (about 1 s per request, even when warm).
 * The built-in photos have pre-sized WebP copies in /public (-640, -1080) that the CDN
 * serves directly; ImageKit uploads are resized by ImageKit itself.
 */
function heroLoader({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}) {
  if (src.startsWith("/hero_image/") && src.endsWith(".webp")) {
    const base = src.slice(0, -".webp".length);
    if (width <= 640) return `${base}-640.webp`;
    if (width <= 1200) return `${base}-1080.webp`;
    return src;
  }
  if (src.startsWith("https://ik.imagekit.io/")) {
    const sep = src.includes("?") ? "&" : "?";
    return `${src}${sep}tr=w-${width},q-${quality ?? 75},f-auto`;
  }
  return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=${quality ?? 75}`;
}

/** On mobile the last three words of a longer heading drop to their own row. */
function Heading({ text }: { text: string }) {
  const words = text.split(" ");
  if (words.length < 5) return <>{text}</>;
  return (
    <>
      {words.slice(0, -3).join(" ")}
      <br className="sm:hidden" />
      <span className="max-sm:hidden"> </span>
      {words.slice(-3).join(" ")}
    </>
  );
}

/** Image focus per slide: the first one is nudged up 15% (shows more of its lower part). */
const focus = (i: number) => (i === 0 ? "object-[50%_65%]" : "object-center");

export default function Hero({ slides }: { slides: HeroSlide[] }) {
  const [index, setIndex] = useState(0);
  // Slide being faded out underneath the incoming one.
  const [prevIndex, setPrevIndex] = useState<number | null>(null);
  const lastIndex = useRef(0);
  const [paused, setPaused] = useState(false);
  const [preload, setPreload] = useState(false);
  const count = slides.length;
  const slide = slides[Math.min(index, count - 1)];
  // The test-drive sentence is no longer shown, even where saved slides still contain it.
  const supportText = slide.supportText
    ?.replace(/\s*Coordiná tu visita hoy\.?/i, "")
    .trim();

  // Start loading the other slides after the first one is on screen.
  useEffect(() => {
    const t = setTimeout(() => setPreload(true), 1200);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (count < 2 || paused || reduce) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % count), INTERVAL_MS);
    return () => clearInterval(t);
  }, [count, paused]);

  useEffect(() => {
    if (lastIndex.current === index) return;
    setPrevIndex(lastIndex.current);
    lastIndex.current = index;
    const t = setTimeout(() => setPrevIndex(null), 900);
    return () => clearTimeout(t);
  }, [index]);

  // Entrance animation is plain CSS (see .hero-rise in globals.css).
  const rise = (delay: number, y = 16) =>
    ({ "--rise-delay": `${delay}s`, "--rise-y": `${y}px` }) as CSSProperties;

  return (
    <section
      data-testid="hero"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      className="hero-on-photo relative mx-auto mt-[10px] lg:mt-5 flex aspect-[2/1] w-[calc(100%-4px)] sm:aspect-[3/1] lg:aspect-auto lg:w-[calc(100%-3rem)] max-w-[1392px] flex-col rounded-xl lg:h-[calc((100svh_-_290px)_*_0.924)] lg:min-h-[443px] overflow-hidden bg-bg text-fg selection:bg-fg selection:text-bg"
    >
      <h1 className="sr-only">
        Tu Próxima Casa – Casas de vacaciones en Punta del Este
      </h1>
      <div className="absolute inset-0 z-0">
        {/* Fetch the other slides once the page has settled, so a slide change never waits on the network. */}
        {preload &&
          slides.map(
            (sl, i) =>
              i !== index &&
              i !== prevIndex && (
                <Image
                  key={`preload-${sl.id}`}
                  src={sl.image}
                  alt=""
                  fill
                  loading="eager"
                  sizes="100vw"
                  loader={heroLoader}
                  aria-hidden
                  className="pointer-events-none object-cover opacity-0"
                />
              ),
          )}
        {prevIndex !== null && slides[prevIndex] && (
          <Image
            key={`prev-${slides[prevIndex].id}`}
            src={slides[prevIndex].image}
            alt=""
            fill
            sizes="100vw"
            loader={heroLoader}
            className={`object-cover ${focus(prevIndex)}`}
          />
        )}
        <Image
          key={slide.id}
          src={slide.image}
          alt=""
          fill
          priority={index === 0}
          sizes="100vw"
          loader={heroLoader}
          className={`object-cover ${focus(index)} ${prevIndex !== null ? "hero-fade" : ""}`}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/30 to-transparent" />
      </div>
      <div className="relative z-10 mx-auto flex w-full max-w-[1440px] flex-1 flex-col justify-center px-4 py-3 sm:px-8 sm:py-4 lg:px-10 lg:py-6">
        <div className="w-full text-left sm:w-[65%] lg:w-[45%]">
          <div
            key={slide.id}
            aria-live={paused ? "polite" : "off"}
            className="w-full sm:w-fit sm:max-w-full"
          >
            {slide.eyebrow && (
              <p
                style={rise(0.05, 12)}
                className="hero-rise mb-2 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-widest text-fg sm:mb-3 sm:max-lg:mb-1 sm:text-xs"
              >
                <Star
                  aria-hidden
                  className="h-2.5 w-2.5 shrink-0 fill-current text-amber-400 sm:h-3 sm:w-3"
                  strokeWidth={0}
                />
                {slide.eyebrow}
                <Star
                  aria-hidden
                  className="h-2.5 w-2.5 shrink-0 fill-current text-amber-400 sm:h-3 sm:w-3"
                  strokeWidth={0}
                />
              </p>
            )}
            <p
              style={rise(0.15, 24)}
              className="hero-rise text-balance text-[22px] font-semibold leading-[1.08] tracking-[-0.02em] sm:text-4xl sm:max-md:text-2xl lg:text-6xl"
            >
              {slide.highlight && (
                <span
                  className={`text-brand max-sm:block ${
                    // Short slides (e.g. "Estrená hoy. Pagá a tu ritmo.") put the heading on a second row on tablet.
                    `${slide.highlight} ${slide.heading}`.length < 40
                      ? "sm:max-lg:block"
                      : ""
                  }`}
                >
                  {slide.highlight}{" "}
                </span>
              )}
              <Heading text={slide.heading} />
            </p>
            {supportText && (
              <p
                style={rise(0.28)}
                className="hero-rise mt-1.5 hidden w-1/2 text-xs sm:block leading-relaxed sm:mt-4 sm:max-lg:mt-1.5 sm:w-0 sm:min-w-full sm:text-base sm:max-md:text-sm lg:mt-5 lg:text-xl text-muted"
              >
                {supportText}
              </p>
            )}
            {slide.rating && (
              <div
                style={rise(0.4)}
                data-testid="hero-rating"
                className="hero-rise mt-1.5 flex flex-col items-start gap-0.5 text-[10px] sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-2 text-muted sm:mt-5 sm:max-lg:mt-1.5 sm:text-sm"
              >
                <span className="flex items-center gap-2">
                  <span className="font-semibold text-fg">{slide.rating}</span>
                  <span aria-hidden className="flex gap-0.5 text-amber-400">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star
                        key={i}
                        className="h-3 w-3 fill-current sm:h-4 sm:w-4"
                        strokeWidth={0}
                      />
                    ))}
                  </span>
                  <span className="sr-only">{slide.rating} de 5 estrellas</span>
                </span>
                <span>
                  {slide.reviewCount} {slide.reviewLabel}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
      {count > 1 && (
        <div
          role="group"
          aria-label="Imágenes del carrusel"
          // The 24px buttons are 9px taller than the dots; bottom offsets
          // are reduced by the same amount so the dots stay where they were.
          className="absolute inset-x-0 bottom-[3px] z-20 flex justify-center gap-[9px] sm:bottom-[7px]"
        >
          {slides.map((sl, i) => (
            <button
              key={sl.id}
              type="button"
              aria-label={`Ir a la imagen ${i + 1}`}
              aria-current={i === index ? "true" : undefined}
              onClick={() => setIndex(i)}
              // 24x24 tap target; the negative margins keep the dots' spacing.
              className={`group flex h-6 w-6 items-center justify-center ${i === index ? "relative z-10" : "-mx-[9px]"}`}
            >
              <span
                className={`h-1.5 rounded-full transition-[width,background-color] duration-300 ${
                  i === index
                    ? "w-6 bg-white"
                    : "w-1.5 bg-white/50 group-hover:bg-white/80"
                }`}
              />
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
