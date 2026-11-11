export interface NavLink {
  label: string;
  href: string;
  /** Only shown inline in the desktop bar from the lg breakpoint. */
  wide?: boolean;
}

/** Left side of the top nav. */
export const NAV_LINKS: NavLink[] = [
  { label: "Inicio", href: "/" },
  { label: "Compra tu auto", href: "/autos" },
  { label: "Vende tu auto", href: "/autos#financiacion" },
];

/** Right side of the top nav. */
export const NAV_RIGHT_LINKS: NavLink[] = [
  { label: "Financiación", href: "/autos#financiacion", wide: true },
  { label: "Contacto", href: "/autos#contacto", wide: true },
];
