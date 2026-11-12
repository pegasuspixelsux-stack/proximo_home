"use client";

import { useEffect } from "react";

/**
 * Flags <html data-past-hero> once the hero has scrolled out of view, so the transparent
 * header (and mobile bottom nav) can switch to their solid look. See globals.css.
 */
export default function HeroScrollState() {
  useEffect(() => {
    const html = document.documentElement;
    const update = () => {
      if (window.scrollY > window.innerHeight - 96) html.dataset.pastHero = "1";
      else delete html.dataset.pastHero;
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      delete html.dataset.pastHero;
    };
  }, []);
  return null;
}
