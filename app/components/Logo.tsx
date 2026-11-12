/** Uruguay flag with a short label; "UY" on small screens. */
export function Country({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1 align-middle ${className}`}>
      <svg
        viewBox="0 0 18 12"
        className="h-5 w-[30px] rounded-[2px]"
        aria-hidden
      >
        <rect width="18" height="12" fill="#fff" />
        <path
          d="M0 1.33h18M0 4h18M0 6.67h18M0 9.33h18"
          stroke="#0038A8"
          strokeWidth="1.33"
        />
        <rect width="6.67" height="6.67" fill="#fff" />
        <circle cx="3.33" cy="3.33" r="1.5" fill="#FCD116" />
      </svg>
      <span className="text-[8px] font-semibold uppercase tracking-[0.2em] text-fg lg:text-[9px]">
        <span className="sm:hidden">UY</span>
        <span className="hidden sm:inline">Uruguay</span>
      </span>
    </span>
  );
}

/**
 * The wordmark: "TU PRÓXIMA" followed by a boxed, highlighted "CASA".
 * With `countryOnMobile` off, the country only shows from sm up (the header
 * places it in the right corner on mobile instead).
 */
export default function Logo({
  className = "",
  countryOnMobile = true,
  showCountry = true,
}: {
  className?: string;
  countryOnMobile?: boolean;
  /** Off in the top nav: the flag only appears in the footer. */
  showCountry?: boolean;
}) {
  return (
    <span
      className={`whitespace-nowrap text-[21px] font-bold uppercase tracking-[-0.02em] lg:text-[23px] ${className}`}
    >
      <span data-logo-word>
        Tu Próxima
        <span className="ml-[0.25em] bg-black px-1.5 py-0.5 text-brand [:root:not([data-theme=light])_&]:bg-white [:root:not([data-theme=light])_&]:text-black">
          Casa
        </span>
      </span>
      {showCountry && (
        <Country className={`ml-1.5 ${countryOnMobile ? "" : "max-sm:hidden"}`} />
      )}
    </span>
  );
}
