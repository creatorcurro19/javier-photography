import Link from "next/link";
import Container from "@/components/ui/Container";
import {
  AndalusianCenefa,
  AndalusianPageBackdrop,
} from "@/components/ui/AndalusianMotif";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata = buildPageMetadata({
  title: "Aviso Legal, Privacidad y Propiedad Intelectual | Javier Espinosa",
  description:
    "Información legal, política de privacidad RGPD, protección de derechos de autor y condiciones de adquisición de obra gráfica Fine Art de Javier Espinosa Martínez.",
  path: "/legal",
});

export default function LegalPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0B0C0E] pt-36 pb-28 text-[#EBE7DF]">
      <AndalusianPageBackdrop variant="laceria" />
      <Container className="relative z-10">
        <div className="mx-auto max-w-4xl">
          <div className="pb-8">
            <p className="font-mono text-xs uppercase tracking-[0.38em] text-[#C5A880]/85">
              Marco Normativo & Derechos de Autor
            </p>
            <h1 className="mt-3 font-serif text-4xl font-light text-[#EBE7DF] sm:text-5xl">
              Aviso Legal, Privacidad y Copyright
            </h1>
            <p className="mt-4 font-mono text-xs text-neutral-400">
              Titular: Javier Espinosa Martínez · Contacto oficial:{" "}
              <a
                href="mailto:javierespinosa1995@hotmail.com"
                className="text-[#EBE7DF] underline decoration-[#C5A880]/50 underline-offset-4"
              >
                javierespinosa1995@hotmail.com
              </a>
            </p>
          </div>

          <AndalusianCenefa
            variant="estrella"
            className="text-[#C5A880]/36"
          />

          <div className="mt-12 space-y-14 text-sm font-light leading-relaxed text-[#EBE7DF]/80">
            {/* 1. Titularidad */}
            <section id="aviso-legal" className="space-y-4">
              <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.28em] text-[#8E8A80]">
                <span>01</span>
                <span>/</span>
                <h2>Identificación del Titular (LSSI-CE)</h2>
              </div>
              <p>
                En cumplimiento de la Ley 34/2002, de 11 de julio, de Servicios
                de la Sociedad de la Información y de Comercio Electrónico
                (LSSI-CE), se informa que este sitio web y el archivo
                fotográfico que alberga son titularidad de{" "}
                <strong className="font-medium text-[#EBE7DF]">
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
                  className="font-mono text-[#EBE7DF] underline decoration-[#8E8A80] underline-offset-4"
                >
                  javierespinosa1995@hotmail.com
                </a>
                .
              </p>
            </section>

            {/* 2. Propiedad Intelectual y ReservaTDM / IA */}
            <section
              id="copyright"
              className="space-y-4 border-t border-[#202226] pt-12"
            >
              <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.28em] text-[#8E8A80]">
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
              <ul className="list-disc space-y-2 pl-5 text-[#EBE7DF]/85">
                <li>
                  Queda estrictamente prohibida la reproducción, distribución,
                  comunicación pública, transformación o descarga comercial de
                  cualquier fotografía sin licencia escrita previa del autor o
                  adquisición a través de los canales oficiales (
                  <a
                    href="https://www.istockphoto.com/portfolio/JavierEspinosa?sort=purerecency&assettype=image"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline decoration-[#8E8A80] underline-offset-4"
                  >
                    Getty Images / iStock
                  </a>{" "}
                  o licencia directa).
                </li>
                <li>
                  <strong className="font-medium text-[#EBE7DF]">
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
              className="space-y-4 border-t border-[#202226] pt-12"
            >
              <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.28em] text-[#8E8A80]">
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
              <div className="grid grid-cols-1 gap-4 border border-[#202226] bg-[#151618]/50 p-6 sm:grid-cols-2">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#8E8A80]">
                    Responsable del Tratamiento
                  </p>
                  <p className="mt-1 text-xs text-[#EBE7DF]">
                    Javier Espinosa Martínez (javierespinosa1995@hotmail.com)
                  </p>
                </div>
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#8E8A80]">
                    Finalidad Exclusiva
                  </p>
                  <p className="mt-1 text-xs text-[#EBE7DF]">
                    Responder a solicitudes de presupuesto, encargos, licencias
                    de imagen o adquisición de obra Fine Art.
                  </p>
                </div>
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#8E8A80]">
                    Legitimación y Conservación
                  </p>
                  <p className="mt-1 text-xs text-[#EBE7DF]">
                    Consentimiento expreso del interesado. Conservación limitada
                    a la duración de la relación comercial o consulta.
                  </p>
                </div>
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#8E8A80]">
                    Derechos del Usuario
                  </p>
                  <p className="mt-1 text-xs text-[#EBE7DF]">
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
              className="space-y-4 border-t border-[#202226] pt-12"
            >
              <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.28em] text-[#8E8A80]">
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
                  className="underline decoration-[#8E8A80] underline-offset-4"
                >
                  Saatchi Art
                </a>
                .
              </p>
            </section>
          </div>

          <div className="mt-16 flex flex-wrap gap-4 border-t border-[#202226] pt-8">
            <Link
              href="/contact"
              className="inline-flex border border-[#EBE7DF] bg-[#EBE7DF] px-6 py-3 text-xs font-semibold uppercase tracking-[0.25em] text-[#0B0C0E] transition hover:bg-transparent hover:text-white"
            >
              Formulario de Contacto
            </Link>
            <Link
              href="/portfolio"
              className="inline-flex border border-[#202226] px-6 py-3 text-xs uppercase tracking-[0.25em] text-[#EBE7DF] transition hover:border-[#8E8A80]"
            >
              Volver al Archivo
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
