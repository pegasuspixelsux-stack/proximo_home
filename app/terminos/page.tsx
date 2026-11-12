// DRAFT: this text must be reviewed by a lawyer before launch.
import type { Metadata } from "next";
import Link from "next/link";
import LegalPage, { LegalSection, Todo } from "../components/LegalPage";

export const metadata: Metadata = {
  title: "Términos y condiciones",
  description:
    "Condiciones de uso de Tu Próxima Casa Uruguay: cómo funciona el portal de avisos de casas de vacaciones, el rol de las inmobiliarias y los límites de responsabilidad.",
  alternates: { canonical: "/terminos" },
};

export default function TerminosPage() {
  return (
    <LegalPage
      path="/terminos"
      title="Términos y condiciones"
      intro="Al usar este sitio aceptás las condiciones que figuran a continuación. Leelas con atención antes de contactar a una inmobiliaria o de avanzar con una operación."
    >
      <LegalSection title="Quiénes somos">
        <p>
          Tu Próxima Casa Uruguay es un portal online donde las inmobiliarias publican avisos de casas de
          vacaciones. Es operado por <Todo>razón social</Todo>, CUIT <Todo>CUIT</Todo>, con domicilio en{" "}
          <Todo>domicilio legal</Todo>.
        </p>
      </LegalSection>
      <LegalSection title="Cómo funciona el portal">
        <p>
          El sitio funciona como un mercado en línea de avisos: reúne las propiedades que las inmobiliarias
          cargan y te permite contactarlas. Los avisos son publicados y administrados por cada inmobiliaria.
        </p>
        <p>
          Tu Próxima Casa Uruguay facilita el contacto, pero la operación, la reserva y la
          escrituración se acuerdan directamente con la inmobiliaria, que es la responsable de la propiedad
          ofrecida.
        </p>
      </LegalSection>
      <LegalSection title="Precios, disponibilidad e información">
        <p>
          Los precios, las fotos, la disponibilidad y demás datos de cada aviso los informa la inmobiliaria y
          pueden cambiar sin previo aviso. Una propiedad publicada puede haberse vendido, alquilado o reservado. Confirmá
          siempre precio, disponibilidad, estado y documentación antes de tomar una decisión.
        </p>
        <p>
          Los precios publicados son orientativos y no constituyen una oferta vinculante. Las condiciones
          finales las acuerdan las partes directamente.
        </p>
      </LegalSection>
      <LegalSection title="Tu responsabilidad como usuario">
        <p>
          Te comprometés a brindar datos verdaderos cuando completás un formulario, a no usar el sitio con
          fines ilícitos y a no intentar vulnerar su funcionamiento. Es tu derecho y tu deber verificar la
          propiedad y su documentación antes de concretar una operación.
        </p>
      </LegalSection>
      <LegalSection title="Limitación de responsabilidad">
        <p>
          En la medida que lo permita la ley, Tu Próxima Casa Uruguay no responde por la exactitud de los
          avisos de terceros, por el estado, la titularidad o la documentación de las propiedades, ni por los
          daños que pudieran derivarse de una operación acordada con una inmobiliaria. Tampoco garantiza que
          el sitio funcione sin interrupciones o errores.
        </p>
        <p>Esto no limita los derechos que te reconoce la ley de defensa del consumidor.</p>
      </LegalSection>
      <LegalSection title="Propiedad intelectual">
        <p>
          La marca, el diseño y el contenido propio del sitio pertenecen a sus titulares. Las fotos y textos
          de cada aviso son de la inmobiliaria que los publica.
        </p>
      </LegalSection>
      <LegalSection title="Cambios, ley aplicable y contacto">
        <p>
          Podemos actualizar estos términos; la versión vigente es la publicada en esta página. Se rigen por
          las leyes de la República Oriental del Uruguay, con jurisdicción en los tribunales de <Todo>jurisdicción</Todo>.
          Para consultas, escribinos desde la página de <Link className="underline underline-offset-4" href="/soporte">soporte</Link>.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
