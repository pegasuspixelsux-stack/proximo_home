"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, type ComponentProps, type MouseEvent } from "react";

/**
 * Link that opens the inventory as one continuous slide: the cover stays on screen as a
 * snapshot overlay while the next page loads, then both move up together (the cover
 * leaves at the top as the inventory enters from directly below). The animation starts
 * in app/autos/template.tsx once the new page is mounted, so there is never a gap.
 * Falls back to a plain link for modified clicks and reduced-motion users.
 */
export default function SlideLink({
  href,
  onClick,
  ...props
}: ComponentProps<typeof Link> & { href: string }) {
  const router = useRouter();

  useEffect(() => {
    router.prefetch(href);
  }, [router, href]);

  function handle(e: MouseEvent<HTMLAnchorElement>) {
    onClick?.(e);
    if (
      e.defaultPrevented ||
      e.metaKey ||
      e.ctrlKey ||
      e.shiftKey ||
      e.altKey ||
      e.button !== 0 ||
      matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    e.preventDefault();

    // Snapshot of the cover (nav + hero) that stays up until the new page is ready.
    const overlay = document.createElement("div");
    overlay.id = "slide-overlay";
    overlay.setAttribute("aria-hidden", "true");
    for (const el of [document.querySelector("header"), document.querySelector("main")])
      if (el) overlay.appendChild(el.cloneNode(true));
    document.getElementById("slide-overlay")?.remove();
    document.body.appendChild(overlay);

    const html = document.documentElement;
    html.dataset.slideIn = "1";
    router.push(href);

    // If the next page never arrives, drop the snapshot.
    window.setTimeout(() => {
      if (location.pathname === "/") {
        overlay.remove();
        delete html.dataset.slideIn;
      }
    }, 10000);
  }

  return <Link href={href} onClick={handle} {...props} />;
}
