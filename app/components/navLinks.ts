export interface NavLink {
  label: string;
  href: string;
  /** Only shown inline in the desktop bar from the lg breakpoint. */
  wide?: boolean;
}

/** Left side of the top nav. */
export const NAV_LINKS: NavLink[] = [
  { label: "Inicio", href: "/" },
  { label: "Compra tu auto", href: "/inicio#inventory" },
  { label: "Vende tu auto", href: "/inicio#financiacion" },
];

/** Right side of the top nav. */
export const NAV_RIGHT_LINKS: NavLink[] = [
  { label: "Financiación", href: "/inicio#financiacion", wide: true },
  { label: "Contacto", href: "/inicio#contacto", wide: true },
];
