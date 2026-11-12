"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Keeps the browser chrome (Chrome's top bar / status bar and bottom toolbar) the same color
 * as the page background. The theme is switched by data-theme, so a static <meta> would go
 * stale: this reads the live body background (black on the home page) and re-applies it whenever the theme changes.
 */
export default function ThemeColor() {
  const pathname = usePathname();
  useEffect(() => {
    const html = document.documentElement;
    // Next renders the theme-color tag itself (see `viewport` in layout.tsx), and React owns
    // it: only change its content, never remove or replace the element.
    const apply = () => {
      const bg = getComputedStyle(document.body).backgroundColor;
      if (!bg) return;
      let metas = document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]');
      if (metas.length === 0) {
        const created = document.createElement("meta");
        created.name = "theme-color";
        document.head.appendChild(created);
        metas = document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]');
      }
      metas.forEach((m) => (m.content = bg));
    };
    apply();
    const observer = new MutationObserver(apply);
    observer.observe(html, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, [pathname]);
  return null;
}
