"use client";

import Link from "next/link";
import { useRef, useState, type PointerEvent } from "react";

interface DrumLink {
  label: string;
  href: string;
}

const ROW = 48; // px between rows

/**
 * Speedometer / drum picker: the active link sits in the center, big and bright;
 * the others roll away above and below (tilted, smaller, faded). It only turns when
 * the visitor asks: mouse wheel, swipe/drag up or down, arrow keys, or a click on a
 * rolled-away link. The first link starts in the center.
 */
export default function LinkDrum({ links }: { links: DrumLink[] }) {
  const n = links.length;
  const [{ active, prev }, setPos] = useState({ active: 0, prev: 0 });
  const drag = useRef({ y: 0, down: false, moved: false });
  const lastWheel = useRef(0);

  const go = (next: number) => setPos((p) => ({ active: next, prev: p.active }));
  const step = (dir: 1 | -1) =>
    setPos((p) => ({ active: (p.active + dir + n) % n, prev: p.active }));

  const onPointerDown = (e: PointerEvent) => {
    drag.current = { y: e.clientY, down: true, moved: false };
  };
  const onPointerMove = (e: PointerEvent) => {
    const d = drag.current;
    if (!d.down) return;
    const dy = e.clientY - d.y;
    if (Math.abs(dy) >= ROW * 0.6) {
      // Dragging up brings the next link to the center, like turning a wheel.
      step(dy < 0 ? 1 : -1);
      d.y = e.clientY;
      d.moved = true;
    }
  };
  const endDrag = () => {
    drag.current.down = false;
    // Let the click that follows a drag pass before forgetting it.
    setTimeout(() => (drag.current.moved = false), 0);
  };

  // Signed distance from the center, wrapped into -n/2 … n/2.
  const offsetOf = (i: number, a: number) => {
    let o = (((i - a) % n) + n) % n;
    if (o > n / 2) o -= n;
    return o;
  };

  return (
    <nav
      aria-label="Accesos rápidos"
      onWheel={(e) => {
        const now = Date.now();
        if (Math.abs(e.deltaY) < 4 || now - lastWheel.current < 260) return;
        lastWheel.current = now;
        step(e.deltaY > 0 ? 1 : -1);
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onPointerLeave={endDrag}
      onClickCapture={(e) => {
        if (drag.current.moved) {
          e.preventDefault();
          e.stopPropagation();
        }
      }}
      onKeyDown={(e) => {
        if (e.key === "ArrowDown") {
          e.preventDefault();
          step(1);
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          step(-1);
        }
      }}
      className="relative mb-4 w-full max-w-xs cursor-grab select-none active:cursor-grabbing"
      style={{ height: ROW * 3, perspective: 500, touchAction: "none" }}
    >
      {/* Soft fade at the top and bottom edges of the drum. */}
      {links.map((link, i) => {
        const o = offsetOf(i, active);
        const abs = Math.abs(o);
        const jumped = Math.abs(o - offsetOf(i, prev)) > 1;
        const isActive = o === 0;
        const style = {
          height: ROW,
          top: "50%",
          marginTop: -ROW / 2,
          transform: `translateY(${o * ROW}px) rotateX(${-o * 35}deg) scale(${1 - abs * 0.12})`,
          opacity: isActive ? 1 : Math.max(0.3, 0.75 - (abs - 1) * 0.25),
          transition: jumped
            ? "none"
            : "transform 600ms cubic-bezier(0.23,1,0.32,1), opacity 600ms ease-out",
        } as const;
        const cls =
          "absolute inset-x-0 flex items-center justify-center whitespace-nowrap font-semibold [text-shadow:0_1px_12px_rgba(0,0,0,0.6)] motion-reduce:!transition-none";
        return isActive ? (
          <Link
            key={link.label}
            href={link.href}
            style={style}
            className={`${cls} text-2xl text-white underline-offset-4 hover:underline sm:text-3xl`}
          >
            {link.label}
          </Link>
        ) : (
          <button
            key={link.label}
            type="button"
            onClick={() => go(i)}
            aria-label={link.label}
            style={style}
            className={`${cls} text-xl text-white sm:text-2xl`}
          >
            {link.label}
          </button>
        );
      })}
    </nav>
  );
}
