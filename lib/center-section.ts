/**
 * Scrolls so the section with this id sits in the middle of the screen (or, when it is
 * taller than the screen, starts just under the sticky header). Waits two frames so a
 * collapsed section has finished expanding before it is measured.
 */
export function centerSection(id: string) {
  requestAnimationFrame(() =>
    requestAnimationFrame(() => {
      const el = document.getElementById(id);
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const top = rect.top + window.scrollY;
      const target = rect.height < vh ? top - (vh - rect.height) / 2 : top - 96;
      window.scrollTo({ top: Math.max(0, target) });
    }),
  );
}
