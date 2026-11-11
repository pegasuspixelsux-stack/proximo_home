"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Slides its content up by the height of the on-screen keyboard (iPhone), so the
 * search bar stays visible above it. The page itself never scrolls; the background
 * photo stays put and only this layer moves.
 */
export default function KeyboardLift({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const vv = window.visualViewport;
    const el = ref.current;
    if (!vv || !el) return;
    const update = () => {
      // Space taken by the keyboard (also corrects for iOS panning the visual viewport).
      const kb = Math.max(0, window.innerHeight - vv.height - vv.offsetTop);
      const lift = kb > 80 ? kb : 0;
      el.style.transform = lift ? `translateY(${-lift}px)` : "";
      // iOS scrolls the page to reveal a focused input; undo it so only the layer moves.
      if (window.scrollY !== 0) window.scrollTo(0, 0);
    };
    vv.addEventListener("resize", update);
    vv.addEventListener("scroll", update);
    return () => {
      vv.removeEventListener("resize", update);
      vv.removeEventListener("scroll", update);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-transform duration-300 ease-out motion-reduce:transition-none ${className}`}
    >
      {children}
    </div>
  );
}
