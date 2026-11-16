import Link from "next/link";
import Container from "@/components/ui/Container";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata = buildPageMetadata({
  title: "Aviso Legal, Privacidad y Propiedad Intelectual | Javier Espinosa",
  description:
    "Información legal, política de privacidad RGPD, protección de derechos de autor y condiciones de adquisición de obra gráfica Fine Art de Javier Espinosa Martínez.",
  path: "/legal",
});

export default function LegalPage() {
  return (
    <div className="min-h-screen bg-[#101112] pt-36 pb-28 text-[#D8D5CD]">
      <Container>
        <div className="mx-auto max-w-4xl">
          <div className="border-b border-[#1D2021] pb-8">
            <p className="font-mono text-xs uppercase tracking-[0.38em] text-[#95836B]">
              Marco Normativo & Derechos de Autor
            </p>
            <h1 className="mt-3 font-serif text-4xl font-light text-[#D8D5CD] sm:text-5xl">
              Aviso Legal, Privacidad y Copyright
            </h1>
            <p className="mt-4 font-mono text-xs text-neutral-400">
              Titular: Javier Espinosa Martínez · Contacto oficial:{" "}
              <a
                href="mailto:javierespinosa1995@hotmail.com"
                className="text-[#D8D5CD] underline decoration-[#95836B] underline-offset-4"
              >
                javierespinosa1995@hotmail.com
              </a>
            </p>
          </div>

          <div className="mt-12 space-y-14 text-sm font-light leading-relaxed text-[#D8D5CD]/80">
            {/* 1. Titularidad */}
            <section id="aviso-legal" className="space-y-4">
              <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.28em] text-[#95836B]">
                <span>01</span>
                <span>/</span>
                <h2>Identificación del Titular (LSSI-CE)</h2>
              </div>
              <p>
                En cumplimiento de la Ley 34/2002, de 11 de julio, de Servicios
                de la Sociedad de la Información y de Comercio Electrónico
                (LSSI-CE), se informa que este sitio web y el archivo
                fotográfico que alberga son titularidad de{" "}
                <strong className="font-medium text-[#D8D5CD]">
                  Javier Espinosa Martínez
                </strong>
                , fotógrafo de autor y documental con residencia en España.
              </p>
              <p>
                Para cualquier comunicación directa, solicitud de licencia
                comercial, adquisición de obra gráfica o ejercicio de derechos
                legales, puede dirigirse por escrito a la dirección electrónica{" "}
                <a
                  href="mailto:javierespinosa1995@hotmail.com"
                  className="font-mono text-[#D8D5CD] underline decoration-[#95836B] underline-offset-4"
                >
                  javierespinosa1995@hotmail.com
                </a>
                .
              </p>
            </section>

            {/* 2. Propiedad Intelectual y ReservaTDM / IA */}
            <section
              id="copyright"
              className="space-y-4 border-t border-[#1D2021] pt-12"
            >
              <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.28em] text-[#95836B]">
                <span>02</span>
                <span>/</span>
                <h2>
                  Propiedad Intelectual, Derechos de Autor y Reserva frente a IA
                </h2>
              </div>
              <p>
                La totalidad de las fotografías, textos curatoriales, ensayos
                documentales, logotipos y diseño visual de este sitio web están
                protegidos por el Texto Refundido de la Ley de Propiedad
                Intelectual (Real Decreto Legislativo 1/1996) y los tratados
                internacionales de derechos de autor (Convenio de Berna).
              </p>
              <ul className="list-disc space-y-2 pl-5 text-[#D8D5CD]/85">
                <li>
                  Queda estrictamente prohibida la reproducción, distribución,
                  comunicación pública, transformación o descarga comercial de
                  cualquier fotografía sin licencia escrita previa del autor o
                  adquisición a través de los canales oficiales (
                  <a
                    href="https://www.istockphoto.com/portfolio/JavierEspinosa?sort=purerecency&assettype=image"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline decoration-[#95836B] underline-offset-4"
                  >
                    Getty Images / iStock
                  </a>{" "}
                  o licencia directa).
                </li>
                <li>
                  <strong className="font-medium text-[#D8D5CD]">
                    Reserva expresa de derechos frente a minería de datos e
                    Inteligencia Artificial (Art. 4 Directiva UE 2019/790 DSM):
                  </strong>{" "}
                  El autor reserva expresamente todos los derechos sobre las
                  imágenes y metadatos de este archivo, prohibiendo su extracción
                  automatizada (scraping) o utilización para el entrenamiento de
                  modelos de inteligencia artificial generativa.
                </li>
              </ul>
            </section>

            {/* 3. Privacidad y RGPD */}
            <section
              id="privacidad"
              className="space-y-4 border-t border-[#1D2021] pt-12"
            >
              <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.28em] text-[#95836B]">
                <span>03</span>
                <span>/</span>
                <h2>
                  Política de Privacidad y Protección de Datos (RGPD / LOPDGDD)
                </h2>
              </div>
              <p>
                De conformidad con el Reglamento (UE) 2016/679 (RGPD) y la Ley
                Orgánica 3/2018 (LOPDGDD), los datos personales facilitados
                voluntariamente a través del formulario de contacto (nombre,
                correo electrónico, teléfono y detalles de consulta) serán
                tratados bajo las siguientes garantías:
              </p>
              <div className="grid grid-cols-1 gap-4 border border-[#1D2021] bg-[#141617]/50 p-6 sm:grid-cols-2">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#95836B]">
                    Responsable del Tratamiento
                  </p>
                  <p className="mt-1 text-xs text-[#D8D5CD]">
                    Javier Espinosa Martínez (javierespinosa1995@hotmail.com)
                  </p>
                </div>
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#95836B]">
                    Finalidad Exclusiva
                  </p>
                  <p className="mt-1 text-xs text-[#D8D5CD]">
                    Responder a solicitudes de presupuesto, encargos, licencias
                    de imagen o adquisición de obra Fine Art.
                  </p>
                </div>
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#95836B]">
                    Legitimación y Conservación
                  </p>
                  <p className="mt-1 text-xs text-[#D8D5CD]">
                    Consentimiento expreso del interesado. Conservación limitada
                    a la duración de la relación comercial o consulta.
                  </p>
                </div>
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#95836B]">
                    Derechos del Usuario
                  </p>
                  <p className="mt-1 text-xs text-[#D8D5CD]">
                    Acceso, rectificación, supresión, oposición y portabilidad
                    escribiendo a javierespinosa1995@hotmail.com.
                  </p>
                </div>
              </div>
              <p className="text-xs text-neutral-400">
                Este sitio web no utiliza cookies publicitarias ni rastreadores
                de terceros con fines de perfilado comercial. Solo se emplea
                almacenamiento local técnico (`localStorage`) en el navegador del
                propio usuario cuando guarda voluntariamente sus obras favoritas.
              </p>
            </section>

            {/* 4. Condiciones de Obra Gráfica */}
            <section
              id="condiciones-prints"
              className="space-y-4 border-t border-[#1D2021] pt-12"
            >
              <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.28em] text-[#95836B]">
                <span>04</span>
                <span>/</span>
                <h2>Condiciones de Obra Gráfica Fine Art</h2>
              </div>
              <p>
                Las copias Fine Art solicitadas directamente al autor se
                producen bajo pedido en laboratorio especializado sobre papel de
                algodón 100% libre de ácido (estándar de conservación museística
                ISO 9706, Hahnemühle Photo Rag 308 g/m² o Baryta). Cada pieza se
                entrega revisada personalmente, firmada y acompañada de su
                Certificado de Autenticidad. Alternativamente, el coleccionista
                puede adquirir impresiones a través de la plataforma oficial{" "}
                <a
                  href="https://www.saatchiart.com/javier-espinosa-photography"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline decoration-[#95836B] underline-offset-4"
                >
                  Saatchi Art
                </a>
                .
              </p>
            </section>
          </div>

          <div className="mt-16 flex flex-wrap gap-4 border-t border-[#1D2021] pt-8">
            <Link
              href="/contact"
              className="inline-flex border border-[#D8D5CD] bg-[#D8D5CD] px-6 py-3 text-xs font-semibold uppercase tracking-[0.25em] text-[#101112] transition hover:bg-transparent hover:text-white"
            >
              Formulario de Contacto
            </Link>
            <Link
              href="/portfolio"
              className="inline-flex border border-[#1D2021] px-6 py-3 text-xs uppercase tracking-[0.25em] text-[#D8D5CD] transition hover:border-[#95836B]"
            >
              Volver al Archivo
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
