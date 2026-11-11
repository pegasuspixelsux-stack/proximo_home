"use client";

import { useEffect } from "react";

/**
 * Locks the cover page to one screen (no scrolling) with a black body, only while it
 * is mounted. Every other page keeps its normal scrolling and background.
 */
export default function PageLock() {
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const prev = {
      htmlOverflow: html.style.overflow,
      bodyOverflow: body.style.overflow,
      bodyBg: body.style.background,
      htmlBg: html.style.background,
    };
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    html.style.background = "#000";
    body.style.background = "#000";
    return () => {
      html.style.overflow = prev.htmlOverflow;
      body.style.overflow = prev.bodyOverflow;
      html.style.background = prev.htmlBg;
      body.style.background = prev.bodyBg;
    };
  }, []);
  return null;
}
