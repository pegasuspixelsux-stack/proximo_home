import Link from "next/link";
import MobileMenu from "./MobileMenu";
import MobileSearch from "./MobileSearch";
import { NAV_LINKS, NAV_RIGHT_LINKS } from "./navLinks";

export default function SiteHeader({ transparent = false }: { transparent?: boolean }) {
  return (
    <header data-cover={transparent ? "" : undefined} className={transparent ? "fixed inset-x-0 top-0 z-40 border-b border-transparent bg-transparent transition-[background-color,border-color,box-shadow] duration-200" : "sticky top-0 z-40 border-b border-line shadow-[0_4px_12px_-2px_rgba(0,0,0,0.12)] bg-bg/80 backdrop-blur-xl backdrop-saturate-150"}>
      <nav
        aria-label="Principal"
        className="relative mx-auto flex max-w-[1440px] items-center justify-between px-3 pb-[19px] pt-[calc(19px+env(safe-area-inset-top))] sm:py-8 lg:px-6"
      >
        <MobileMenu />
        <div className="hidden items-center gap-6 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="relative after:absolute after:inset-x-0 after:-bottom-1 after:h-px after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-200 after:ease-out hover:after:scale-x-100 motion-reduce:after:transition-none text-xs font-medium uppercase tracking-widest text-muted transition-colors duration-150 hover:text-fg"
            >
              {link.label}
            </Link>
          ))}
        </div>
        <Link
          href="/"
          aria-label="Propiedades, inicio"
          data-logo
          className="absolute inset-x-0 mx-auto w-fit"
        >
          {/* Dealer name as the nav title on every page. White over the home hero (globals.css). */}
          <span
            data-logo-text
            className={`block text-2xl font-bold uppercase tracking-[0.2em] sm:text-3xl ${transparent ? "text-white" : "text-fg"}`}
          >
            Propiedades
          </span>
        </Link>
        <div className="hidden items-center gap-6 lg:flex">
          {NAV_RIGHT_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={`relative after:absolute after:inset-x-0 after:-bottom-1 after:h-px after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-200 after:ease-out hover:after:scale-x-100 motion-reduce:after:transition-none text-xs font-medium uppercase tracking-widest text-muted transition-colors duration-150 hover:text-fg ${link.wide ? "hidden lg:inline" : ""}`}
            >
              {link.label}
            </Link>
          ))}
        </div>
        <MobileSearch />
      </nav>
    </header>
  );
}
