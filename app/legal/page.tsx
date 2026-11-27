import Link from "next/link";
import Container from "@/components/ui/Container";
import {
  AndalusianCenefa,
  AndalusianPageBackdrop,
} from "@/components/ui/AndalusianMotif";
import { SITE_CONFIG } from "@/data/site-config";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata = buildPageMetadata({
  title: "Aviso Legal y Privacidad | Javier Espinosa",
  description:
    "Información legal, política de privacidad RGPD y protección de derechos de autor sobre el archivo fotográfico de Javier Espinosa Martínez.",
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
                href={`mailto:${SITE_CONFIG.contactEmail}`}
                className="text-[#EBE7DF] underline decoration-[#C5A880]/50 underline-offset-4"
              >
                {SITE_CONFIG.contactEmail}
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
                En cumplimiento del artículo 10 de la Ley 34/2002, de 11 de julio, de Servicios
                de la Sociedad de la Información y de Comercio Electrónico
                (LSSI-CE), se informa de los datos identificativos del titular de este sitio web:
              </p>
              <div className="grid grid-cols-1 gap-4 border border-[#202226] bg-[#151618]/50 p-6 sm:grid-cols-2 font-mono text-xs">
                <div>
                  <span className="block text-[10px] uppercase tracking-wider text-[#A39E93]">
                    Titular / Autor
                  </span>
                  <span className="mt-1 block text-[#EBE7DF]">Javier Espinosa Martínez</span>
                </div>
                <div>
                  <span className="block text-[10px] uppercase tracking-wider text-[#A39E93]">
                    NIF / Documento Fiscal
                  </span>
                  <span className="mt-1 block text-[#C5A880]">26505129K</span>
                </div>
                <div>
                  <span className="block text-[10px] uppercase tracking-wider text-[#A39E93]">
                    Domicilio Fiscal / Estudio
                  </span>
                  <span className="mt-1 block text-[#EBE7DF]">
                    Puerto de la Cruz (Santa Cruz de Tenerife, Islas Canarias, España)
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] uppercase tracking-wider text-[#A39E93]">
                    Correo Electrónico de Contacto
                  </span>
                  <span className="mt-1 block text-[#EBE7DF]">
                    {SITE_CONFIG.contactEmail}
                  </span>
                </div>
              </div>
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
                    href={SITE_CONFIG.social.getty}
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
                    {SITE_CONFIG.authorName} ({SITE_CONFIG.contactEmail})
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
                  <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#A39E93]">
                    Derechos del Usuario y Reclamación ante la AEPD
                  </p>
                  <p className="mt-1 text-xs text-[#EBE7DF]">
                    Acceso, rectificación, supresión, limitación, oposición y portabilidad
                    escribiendo a {SITE_CONFIG.contactEmail}. Asimismo, tiene derecho a presentar una reclamación ante la{" "}
                    <a
                      href="https://www.aepd.es"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline decoration-[#C5A880] underline-offset-4 hover:text-[#C5A880]"
                    >
                      Agencia Española de Protección de Datos (AEPD · www.aepd.es)
                    </a>
                    .
                  </p>
                </div>
                <div className="sm:col-span-2 border-t border-white/[0.06] pt-4">
                  <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#A39E93]">
                    Encargados del Tratamiento y Destinatarios Técnicos
                  </p>
                  <p className="mt-1 text-xs text-[#EBE7DF]">
                    No se ceden datos a terceros salvo obligación legal. Actúan como encargados técnicos del tratamiento: <strong className="text-white">Vercel Inc.</strong> (alojamiento e infraestructura de servidor web) y <strong className="text-white">servicios de correo transaccional (FormSubmit / Resend)</strong> para la recepción y confirmación de mensajes enviados por los formularios de contacto y solicitud de copias.
                  </p>
                </div>
              </div>
              <p className="text-xs text-[#A39E93]">
                Este sitio web no utiliza cookies publicitarias ni rastreadores
                de terceros con fines de perfilado comercial. Solo se emplea
                almacenamiento local técnico (`localStorage`) en el navegador del
                propio usuario cuando guarda voluntariamente sus obras favoritas o su cesta.
              </p>
            </section>

            {/* 4. Derechos de Imagen de Personas y Marcas/Libreas de Vehículos */}
            <section
              id="derechos-imagen-marcas"
              className="space-y-4 border-t border-[#202226] pt-12"
            >
              <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.28em] text-[#C5A880]">
                <span>04</span>
                <span>/</span>
                <h2>Derechos de Imagen de Personas y Marcas / Libreas de Automóviles</h2>
              </div>
              <p>
                Las fotografías de corte documental, etnográfico, urbano y de competición automovilística (rally histórico, parque de asistencia y vehículos clásicos) han sido capturadas en contextos públicos, culturales o deportivos con finalidad artística, documental e informativa.
              </p>
              <ul className="list-disc space-y-2 pl-5 text-[#EBE7DF]/85">
                <li>
                  <strong className="font-medium text-[#EBE7DF]">Derechos de imagen de personas (LO 1/1982):</strong> Las obras en las que aparecen personas reconocibles trabajando en oficios tradicionales o escenas públicas se comercializan como obra artística de colección privada o para uso estrictamente editorial/documental. Para cualquier uso publicitario o promocional comercial (<em>Commercial Advertising</em>), el licenciatario deberá verificar previamente con el autor la existencia de autorización expresa de imagen (<em>Model Release</em>).
                </li>
                <li>
                  <strong className="font-medium text-[#EBE7DF]">Marcas, logotipos, dorsales y libreas de automóviles (Ley 17/2001 de Marcas):</strong> Las fotografías de vehículos clásicos y de rally muestran marcas de fabricantes, libreas históricas y patrocinadores tal como participan en la prueba deportiva. La adquisición de una copia Fine Art o de una licencia editorial no otorga derecho alguno sobre las marcas registradas de los fabricantes o patrocinadores reproducidos; para campañas publicitarias comerciales de terceros se requiere autorización de marca o eliminación previa de signos distintivos bajo encargo.
                </li>
              </ul>
            </section>

            {/* 5. Condiciones de Obra Gráfica */}
            <section
              id="condiciones-prints"
              className="space-y-4 border-t border-[#202226] pt-12"
            >
              <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.28em] text-[#A39E93]">
                <span>05</span>
                <span>/</span>
                <h2>Condiciones de Compra, Envío, Desistimiento y Licencias</h2>
              </div>
              <p>
                Consulta el detalle completo de producción, envío en tubo rígido, impuestos aplicables, derecho de desistimiento (y excepción en personalizados), devoluciones y términos de licencia en la página específica de{" "}
                <Link
                  href="/condiciones"
                  className="text-[#C5A880] underline underline-offset-4 hover:text-white"
                >
                  Condiciones de Contratación y Licencias (/condiciones) →
                </Link>
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
