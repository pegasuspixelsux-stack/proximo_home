import { MessageCircle, Phone } from "lucide-react";
import Link from "next/link";
import { NAV_LINKS, NAV_RIGHT_LINKS } from "./navLinks";
import { SOCIALS } from "./socials";
import ThemeToggle from "./ThemeToggle";
import { formatPhone } from "../data/site";
import { getSiteSettings } from "../data/site-store";

interface FooterColumn {
  title: string;
  links: { label: string; href: string }[];
}

const COLUMNS: FooterColumn[] = [
  {
    title: "Navegación",
    // Same links as the top nav.
    links: [
      ...NAV_LINKS,
      ...NAV_RIGHT_LINKS,
      { label: "Casas de vacaciones", href: "/casas" },
    ],
  },
  {
    title: "Legales & Ayuda",
    links: [
      { label: "Términos y Condiciones", href: "/terminos" },
      { label: "Política de Privacidad", href: "/privacidad" },
      { label: "Preguntas Frecuentes", href: "/#preguntas-frecuentes" },
      { label: "Soporte", href: "/soporte" },
    ],
  },
];

const LEGAL_LINKS = [
  { label: "Política de cookies", href: "/cookies" },
  { label: "Protección de datos personales", href: "/privacidad" },
  { label: "Admin", href: "/login" },
];

const LINK = "text-sm text-muted transition-colors duration-150 hover:text-fg";
const HEADING = "text-xs font-semibold uppercase tracking-widest text-fg";

export default async function Footer() {
  const { whatsappNumber } = await getSiteSettings();
  const phoneLabel = formatPhone(whatsappNumber);
  return (
    <footer data-testid="footer" className="border-t border-line bg-bg">
      <div className="mx-auto max-w-[1440px] px-3 pb-8 pt-16 md:max-lg:px-[52px] lg:px-6">
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
          <div className="col-span-2 lg:col-span-1">
            <p className="text-[21px] font-bold uppercase tracking-[0.2em] text-fg lg:text-[23px]">
              Inmobiliaria
            </p>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-muted">
              Plataforma de casas de vacaciones en Punta del Este: Península,
              Playa Brava, Playa Mansa, La Barra, Manantiales y José Ignacio.
              Coordiná tu visita y encontrá tu lugar en la costa.
            </p>
            {/* TODO(seo): add the street address once the owner provides it. */}
            <address className="mt-4 text-sm not-italic leading-relaxed text-muted">
              Inmobiliaria
              <br />
              Punta del Este, Maldonado, Uruguay
              <br />
              Atención con cita previa
            </address>
          </div>

          {COLUMNS.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <h2 className={HEADING}>{column.title}</h2>
              <ul className="mt-5 space-y-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className={LINK}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div data-testid="footer-contact">
            <h2 className={HEADING}>Contacto &amp; Redes</h2>
            <ul className="mt-5 space-y-3">
              <li>
                <a
                  href={`https://wa.me/${whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${LINK} inline-flex items-center gap-2`}
                >
                  <MessageCircle
                    className="h-4 w-4 shrink-0"
                    strokeWidth={1.75}
                    aria-hidden
                  />
                  WhatsApp {phoneLabel}
                </a>
              </li>
              <li>
                <a
                  href={`tel:+${whatsappNumber}`}
                  data-testid="footer-phone"
                  className={`${LINK} inline-flex items-center gap-2`}
                >
                  <Phone
                    className="h-4 w-4 shrink-0"
                    strokeWidth={1.75}
                    aria-hidden
                  />
                  Llamar {phoneLabel}
                </a>
              </li>
            </ul>
            <ul className="mt-5 flex gap-2">
              {SOCIALS.map(({ label, href, icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    aria-label={label}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-muted transition-[color,border-color,transform] duration-150 hover:border-fg/40 hover:text-fg active:scale-95"
                  >
                    {icon}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div
          data-testid="disclaimer"
          className="mt-16 border-t border-line pt-8 text-xs leading-relaxed text-subtle"
        >
          <p>
            Inmobiliaria es una plataforma de publicidad. Nuestra única función
            es publicar los avisos de las inmobiliarias y propietarios. No somos
            parte de la operación, no intervenimos en la negociación, el pago,
            la reserva ni la escrituración de las propiedades, y no actuamos
            como intermediarios ni garantes. Las propiedades, la información,
            las fotos y los precios publicados son de exclusiva responsabilidad
            del anunciante. Inmobiliaria no garantiza su exactitud ni su
            actualización, y no asume responsabilidad por el estado, la
            titularidad, la documentación, la disponibilidad, las condiciones
            de la operación ni cualquier otro aspecto de las propiedades
            publicadas, ni por los daños o perjuicios que puedan derivarse de una
            operación. Es derecho y deber del interesado verificar por su cuenta
            toda la información, visitar la propiedad, revisar su documentación
            y sus antecedentes, y completar la transacción de manera legal y
            honesta, directamente con el anunciante. Cualquier reclamo debe
            dirigirse al anunciante.
          </p>
        </div>

        <div className="mt-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <nav
            aria-label="Legal"
            data-testid="legal-links"
            className="flex flex-wrap gap-x-6 gap-y-2 text-xs"
          >
            {LEGAL_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-subtle transition-colors duration-150 hover:text-fg"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-3 sm:justify-end">
            <p className="text-xs text-subtle">
              © 2026 Inmobiliaria. Todos los derechos reservados.
            </p>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </footer>
  );
}
