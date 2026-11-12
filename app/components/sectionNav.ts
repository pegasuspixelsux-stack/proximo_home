import type { MouseEvent } from "react";

/**
 * Section links scroll in place when the section is on this page; otherwise the link
 * navigates to the home page. Collapsible sections open (and scroll) through
 * "hashchange", even if the hash is unchanged.
 */
export function goToSection(
  e: MouseEvent<HTMLAnchorElement>,
  href: string,
  pathname: string,
) {
  const hash = href.includes("#") ? `#${href.split("#")[1]}` : "";
  if (!hash) {
    if (pathname !== "/") return;
    e.preventDefault();
    window.history.replaceState(null, "", "/");
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }
  const target = document.querySelector(hash);
  if (!target) return;
  e.preventDefault();
  window.history.replaceState(null, "", `${pathname}${hash}`);
  if (hash === "#inventario") target.scrollIntoView({ behavior: "smooth" });
  else window.dispatchEvent(new HashChangeEvent("hashchange"));
}
