/**
 * Scrolls to the section with this id. By default it sits in the middle of the screen (or,
 * when it is taller than the screen, starts just under the sticky header). With
 * `align: "top"` its top edge always stops right under the sticky header. Waits two frames
 * so a collapsed section has finished expanding before it is measured.
 */
export function centerSection(id: string, align: "center" | "top" = "center") {
  requestAnimationFrame(() =>
    requestAnimationFrame(() => {
      const el = document.getElementById(id);
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // The page may still be mid-slide (translated), which shifts every rect equally.
      // Measure relative to the sliding wrapper so that offset cancels out.
      const page = document.querySelector<HTMLElement>(".slide-page");
      const top = page
        ? rect.top - page.getBoundingClientRect().top + page.offsetTop
        : rect.top + window.scrollY;
      const header = document.querySelector("header")?.getBoundingClientRect().height ?? 80;
      const target =
        align === "top"
          ? top - header
          : rect.height < vh
            ? top - (vh - rect.height) / 2
            : top - header - 16;
      window.scrollTo({ top: Math.max(0, target) });
    }),
  );
}
