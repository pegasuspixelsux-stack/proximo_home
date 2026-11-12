export default function AnnouncementBar({
  text = "Casas de vacaciones en Punta del Este · Visitas con cita previa.",
  linkText = "Agendá tu visita",
  href = "#contacto",
}: {
  text?: string;
  linkText?: string;
  href?: string;
}) {
  return (
    <div
      data-testid="announcement-bar"
      className="w-full bg-inverse text-on-inverse"
    >
      <div className="mx-auto max-w-[1440px] px-3 sm:whitespace-nowrap py-2 text-center text-[10px] font-medium sm:py-2.5 sm:text-xs tracking-tight lg:px-6">
        <span className="sm:hidden">Casas de vacaciones en Punta del Este.</span>
        <span className="hidden sm:inline">{text}</span>{" "}
        <a
          href={href}
          className="ml-1 font-semibold underline decoration-brand decoration-2 underline-offset-4 transition-opacity hover:opacity-70"
        >
          {linkText}
        </a>
      </div>
    </div>
  );
}
