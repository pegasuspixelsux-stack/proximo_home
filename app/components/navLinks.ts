export interface NavLink {
  label: string;
  href: string;
  /** Only shown inline in the desktop bar from the lg breakpoint. */
  wide?: boolean;
}

/** Left side of the top nav. */
export const NAV_LINKS: NavLink[] = [
  { label: "Inicio", href: "/" },
  { label: "Casas", href: "/#inventario" },
  { label: "Publicá tu casa", href: "/#publicar" },
];

/** Every section of the home page, in page order, for the mobile burger menu. */
export const MENU_LINKS: NavLink[] = [
  { label: "Inicio", href: "/" },
  { label: "Casas", href: "/#inventario" },
  { label: "Casas de vacaciones", href: "/#comprar" },
  { label: "Preguntas frecuentes", href: "/#preguntas-frecuentes" },
  { label: "Quiénes somos", href: "/#quienes-somos" },
  { label: "Contacto", href: "/#contacto" },
];

/** Right side of the top nav. */
export const NAV_RIGHT_LINKS: NavLink[] = [
  { label: "Contacto", href: "/#contacto", wide: true },
];
