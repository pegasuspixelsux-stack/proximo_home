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
    let meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"][data-live]');
    if (!meta) {
      document.querySelectorAll('meta[name="theme-color"]').forEach((m) => m.remove());
      meta = document.createElement("meta");
      meta.name = "theme-color";
      meta.dataset.live = "";
      document.head.appendChild(meta);
    }
    const apply = () => {
      const bg = getComputedStyle(document.body).backgroundColor;
      if (bg && meta) meta.content = bg;
    };
    apply();
    const observer = new MutationObserver(apply);
    observer.observe(html, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, [pathname]);
  return null;
}
