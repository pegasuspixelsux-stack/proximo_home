"use client";

import { useLayoutEffect, type ReactNode } from "react";

/**
 * Arriving from the cover page: start the slide the moment this page mounts. The inventory
 * rises from below while the cover snapshot (#slide-overlay) leaves at the top, in sync
 * (both animations are in globals.css and share one duration/easing).
 */
export default function Template({ children }: { children: ReactNode }) {
  useLayoutEffect(() => {
    const html = document.documentElement;
    const overlay = document.getElementById("slide-overlay");
    if (!html.dataset.slideIn) {
      overlay?.remove();
      return;
    }
    overlay?.classList.add("slide-overlay-out");
    const done = () => {
      overlay?.remove();
      delete html.dataset.slideIn;
    };
    overlay?.addEventListener("animationend", done, { once: true });
    // Safety net in case animationend never fires (e.g. background tab).
    const t = setTimeout(done, 6000);
    return () => clearTimeout(t);
  }, []);

  return <div className="slide-page">{children}</div>;
}
