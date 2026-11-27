"use client";

import Link from "next/link";
import Container from "@/components/ui/Container";
import {
  AndalusianCenefa,
  AndalusianPageBackdrop,
} from "@/components/ui/AndalusianMotif";
import { SITE_CONFIG } from "@/data/site-config";
import { useLanguage } from "@/lib/i18n";

export default function LegalPageContent() {
  const { t } = useLanguage();

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0B0C0E] pt-36 pb-28 text-[#EBE7DF]">
      <AndalusianPageBackdrop variant="laceria" />
      <Container className="relative z-10">
        <div className="mx-auto max-w-4xl">
          <div className="pb-8">
            <p className="font-mono text-xs uppercase tracking-[0.38em] text-[#C5A880]/85">
              {t("Marco Normativo & Derechos de Autor", "Legal Framework & Copyright")}
            </p>
            <h1 className="mt-3 font-serif text-4xl font-light text-[#EBE7DF] sm:text-5xl">
              {t("Aviso Legal, Privacidad y Copyright", "Legal Notice, Privacy & Copyright")}
            </h1>
            <p className="mt-4 font-mono text-xs text-neutral-400">
              {t(
                "Titular: Javier Espinosa Martínez · Contacto oficial: ",
                "Owner: Javier Espinosa Martínez · Official contact: "
              )}
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
                <h2>
                  {t("Identificación del Titular (LSSI-CE)", "Owner Identification (LSSI-CE)")}
                </h2>
              </div>
              <p>
                {t(
                  "En cumplimiento del artículo 10 de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y de Comercio Electrónico (LSSI-CE), se informa de los datos identificativos del titular de este sitio web:",
                  "In compliance with Article 10 of Spanish Law 34/2002 of July 11 on Information Society Services and Electronic Commerce (LSSI-CE), the identifying details of the website owner are provided below:"
                )}
              </p>
              <div className="grid grid-cols-1 gap-4 border border-[#202226] bg-[#151618]/50 p-6 sm:grid-cols-2 font-mono text-xs">
                <div>
                  <span className="block text-[10px] uppercase tracking-wider text-[#A39E93]">
                    {t("Titular / Autor", "Owner / Author")}
                  </span>
                  <span className="mt-1 block text-[#EBE7DF]">Javier Espinosa Martínez</span>
                </div>
                <div>
                  <span className="block text-[10px] uppercase tracking-wider text-[#A39E93]">
                    {t("NIF / Documento Fiscal", "Tax ID / NIF")}
                  </span>
                  <span className="mt-1 block text-[#C5A880]">26505129K</span>
                </div>
                <div>
                  <span className="block text-[10px] uppercase tracking-wider text-[#A39E93]">
                    {t("Domicilio Fiscal / Estudio", "Registered Address / Studio")}
                  </span>
                  <span className="mt-1 block text-[#EBE7DF]">
                    {t(
                      "Puerto de la Cruz (Santa Cruz de Tenerife, Islas Canarias, España)",
                      "Puerto de la Cruz (Santa Cruz de Tenerife, Canary Islands, Spain)"
                    )}
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] uppercase tracking-wider text-[#A39E93]">
                    {t("Correo Electrónico de Contacto", "Contact Email")}
                  </span>
                  <span className="mt-1 block text-[#EBE7DF]">
                    {SITE_CONFIG.contactEmail}
                  </span>
                </div>
              </div>
            </section>

            {/* 2. Propiedad Intelectual y Reserva TDM / IA */}
            <section
              id="copyright"
              className="space-y-4 border-t border-[#202226] pt-12"
            >
              <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.28em] text-[#8E8A80]">
                <span>02</span>
                <span>/</span>
                <h2>
                  {t(
                    "Propiedad Intelectual, Derechos de Autor y Reserva frente a IA",
                    "Intellectual Property, Copyright & AI Training Opt-Out"
                  )}
                </h2>
              </div>
              <p>
                {t(
                  "La totalidad de las fotografías, textos curatoriales, ensayos documentales, logotipos y diseño visual de este sitio web están protegidos por el Texto Refundido de la Ley de Propiedad Intelectual (Real Decreto Legislativo 1/1996) y los tratados internacionales de derechos de autor (Convenio de Berna).",
                  "All photographs, curatorial texts, documentary essays, monograms, and visual design elements on this website are protected by Spain's Intellectual Property Law (Royal Legislative Decree 1/1996) and international copyright treaties (Berne Convention)."
                )}
              </p>
              <ul className="list-disc space-y-2 pl-5 text-[#EBE7DF]/85">
                <li>
                  {t(
                    "Queda estrictamente prohibida la reproducción, distribución, comunicación pública, transformación o descarga comercial de cualquier fotografía sin licencia escrita previa del autor o adquisición a través de los canales oficiales (",
                    "Any reproduction, distribution, public communication, modification, or commercial download of any photograph without prior written license from the author or official acquisition channels ("
                  )}
                  <a
                    href={SITE_CONFIG.social.getty}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline decoration-[#8E8A80] underline-offset-4"
                  >
                    Getty Images / iStock
                  </a>{" "}
                  {t("o licencia directa).", "or direct licensing) is strictly prohibited.")}
                </li>
                <li>
                  <strong className="font-medium text-[#EBE7DF]">
                    {t(
                      "Reserva expresa de derechos frente a minería de datos e Inteligencia Artificial (Art. 4 Directiva UE 2019/790 DSM):",
                      "Express reservation of rights regarding Text & Data Mining and Artificial Intelligence (Art. 4 EU DSM Directive 2019/790):"
                    )}
                  </strong>{" "}
                  {t(
                    "El autor reserva expresamente todos los derechos sobre las imágenes y metadatos de este archivo, prohibiendo su extracción automatizada (scraping) o utilización para el entrenamiento de modelos de inteligencia artificial generativa.",
                    "The author expressly reserves all rights over the images and metadata in this archive, prohibiting automated scraping or any use for training generative artificial intelligence models."
                  )}
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
                  {t(
                    "Política de Privacidad y Protección de Datos (RGPD / LOPDGDD)",
                    "Privacy Policy & Data Protection (GDPR / LOPDGDD)"
                  )}
                </h2>
              </div>
              <p>
                {t(
                  "De conformidad con el Reglamento (UE) 2016/679 (RGPD) y la Ley Orgánica 3/2018 (LOPDGDD), los datos personales facilitados voluntariamente a través del formulario de contacto (nombre, correo electrónico, teléfono y detalles de consulta) serán tratados bajo las siguientes garantías:",
                  "In accordance with EU Regulation 2016/679 (GDPR) and Spanish Organic Law 3/2018 (LOPDGDD), personal data voluntarily submitted via our contact forms (name, email, phone number, and inquiry details) is processed under the following safeguards:"
                )}
              </p>
              <div className="grid grid-cols-1 gap-4 border border-[#202226] bg-[#151618]/50 p-6 sm:grid-cols-2">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#8E8A80]">
                    {t("Responsable del Tratamiento", "Data Controller")}
                  </p>
                  <p className="mt-1 text-xs text-[#EBE7DF]">
                    {SITE_CONFIG.authorName} ({SITE_CONFIG.contactEmail})
                  </p>
                </div>
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#8E8A80]">
                    {t("Finalidad Exclusiva", "Sole Purpose")}
                  </p>
                  <p className="mt-1 text-xs text-[#EBE7DF]">
                    {t(
                      "Responder a solicitudes de presupuesto, encargos, licencias de imagen o adquisición de obra Fine Art.",
                      "Responding to quote requests, commissions, image licensing inquiries, or Fine Art print acquisitions."
                    )}
                  </p>
                </div>
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#8E8A80]">
                    {t("Legitimación y Conservación", "Legal Basis & Retention")}
                  </p>
                  <p className="mt-1 text-xs text-[#EBE7DF]">
                    {t(
                      "Consentimiento expreso del interesado. Conservación limitada a la duración de la relación comercial o consulta.",
                      "Explicit consent of the data subject. Retained only for the duration of the inquiry or commercial relationship."
                    )}
                  </p>
                </div>
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#A39E93]">
                    {t(
                      "Derechos del Usuario y Reclamación ante la AEPD",
                      "Data Subject Rights & Supervisory Authority (AEPD)"
                    )}
                  </p>
                  <p className="mt-1 text-xs text-[#EBE7DF]">
                    {t(
                      `Acceso, rectificación, supresión, limitación, oposición y portabilidad escribiendo a ${SITE_CONFIG.contactEmail}. Asimismo, tiene derecho a presentar una reclamación ante la `,
                      `Right of access, rectification, erasure, restriction, objection, and portability by writing to ${SITE_CONFIG.contactEmail}. You also have the right to lodge a complaint with the `
                    )}
                    <a
                      href="https://www.aepd.es"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline decoration-[#C5A880] underline-offset-4 hover:text-[#C5A880]"
                    >
                      {t(
                        "Agencia Española de Protección de Datos (AEPD · www.aepd.es)",
                        "Spanish Data Protection Agency (AEPD · www.aepd.es)"
                      )}
                    </a>
                    .
                  </p>
                </div>
                <div className="sm:col-span-2 border-t border-white/[0.06] pt-4">
                  <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#A39E93]">
                    {t(
                      "Encargados del Tratamiento y Destinatarios Técnicos",
                      "Data Processors & Technical Infrastructure"
                    )}
                  </p>
                  <p className="mt-1 text-xs text-[#EBE7DF]">
                    {t(
                      "No se ceden datos a terceros salvo obligación legal. Actúan como encargados técnicos del tratamiento: ",
                      "Data is never sold or shared with third parties unless legally required. Technical processors are: "
                    )}
                    <strong className="text-white">Vercel Inc.</strong>{" "}
                    {t(
                      "(alojamiento e infraestructura de servidor web) y ",
                      "(web hosting and serverless infrastructure) and "
                    )}
                    <strong className="text-white">
                      {t(
                        "servicios de correo transaccional (FormSubmit / Resend)",
                        "transactional mail providers (FormSubmit / Resend)"
                      )}
                    </strong>{" "}
                    {t(
                      "para la recepción y confirmación de mensajes enviados por los formularios de contacto y solicitud de copias.",
                      "for delivering and confirming inquiries sent via contact and print request forms."
                    )}
                  </p>
                </div>
              </div>
              <p className="text-xs text-[#A39E93]">
                {t(
                  "Este sitio web no utiliza cookies publicitarias ni rastreadores de terceros con fines de perfilado comercial. Solo se emplea almacenamiento local técnico (`localStorage`) en el navegador del propio usuario cuando guarda voluntariamente sus obras favoritas o su cesta.",
                  "This website uses no advertising cookies or third-party behavioral tracking. Only functional browser storage (`localStorage`) is used locally when you choose to save favorite works, language preference, or cart items."
                )}
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
                <h2>
                  {t(
                    "Derechos de Imagen de Personas y Marcas / Libreas de Automóviles",
                    "Personality Rights and Automotive Trademarks / Liveries"
                  )}
                </h2>
              </div>
              <p>
                {t(
                  "Las fotografías de corte documental, etnográfico, urbano y de competición automovilística (rally histórico, parque de asistencia y vehículos clásicos) han sido capturadas en contextos públicos, culturales o deportivos con finalidad artística, documental e informativa.",
                  "Documentary, ethnographic, urban, and motorsport photographs (historic rallies, service parks, and classic cars) were captured in public, cultural, or sporting settings for artistic, documentary, and editorial reporting purposes."
                )}
              </p>
              <ul className="list-disc space-y-2 pl-5 text-[#EBE7DF]/85">
                <li>
                  <strong className="font-medium text-[#EBE7DF]">
                    {t(
                      "Derechos de imagen de personas (LO 1/1982):",
                      "Personality rights of individuals (Spanish Organic Law 1/1982):"
                    )}
                  </strong>{" "}
                  {t(
                    "Las obras en las que aparecen personas reconocibles trabajando en oficios tradicionales o escenas públicas se comercializan como obra artística de colección privada o para uso estrictamente editorial/documental. Para cualquier uso publicitario o promocional comercial (",
                    "Photographs featuring recognizable people engaged in traditional crafts or public scenes are offered strictly as private Fine Art editions or for editorial/documentary use. Any commercial advertising or promotional campaign ("
                  )}
                  <em>Commercial Advertising</em>
                  {t(
                    "), el licenciatario deberá verificar previamente con el autor la existencia de autorización expresa de imagen (",
                    ") requires the licensee to confirm prior written model authorization ("
                  )}
                  <em>Model Release</em>
                  {t(").", ").")}
                </li>
                <li>
                  <strong className="font-medium text-[#EBE7DF]">
                    {t(
                      "Marcas, logotipos, dorsales y libreas de automóviles (Ley 17/2001 de Marcas):",
                      "Automotive trademarks, logos, race numbers & liveries (Spanish Trademark Law 17/2001):"
                    )}
                  </strong>{" "}
                  {t(
                    "Las fotografías de vehículos clásicos y de rally muestran marcas de fabricantes, libreas históricas y patrocinadores tal como participan en la prueba deportiva. La adquisición de una copia Fine Art o de una licencia editorial no otorga derecho alguno sobre las marcas registradas de los fabricantes o patrocinadores reproducidos; para campañas publicitarias comerciales de terceros se requiere autorización de marca o eliminación previa de signos distintivos bajo encargo.",
                    "Photographs of historic and rally cars show manufacturer emblems, heritage liveries, and event sponsors as entered in competition. Purchasing a Fine Art print or editorial license grants no rights over any depicted registered trademarks; third-party commercial advertising requires brand authorization or commissioned retouching of distinctive marks."
                  )}
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
                <h2>
                  {t(
                    "Condiciones de Compra, Envío, Desistimiento y Licencias",
                    "Purchasing, Shipping, Withdrawal & Licensing Terms"
                  )}
                </h2>
              </div>
              <p>
                {t(
                  "Consulta el detalle completo de producción, envío en tubo rígido, impuestos aplicables, derecho de desistimiento (y excepción en personalizados), devoluciones y términos de licencia en la página específica de ",
                  "Read the complete terms covering Fine Art production, rigid tube shipping, applicable taxes, right of withdrawal (and custom order exclusions), returns, and reproduction licenses on the dedicated "
                )}
                <Link
                  href="/condiciones"
                  className="text-[#C5A880] underline underline-offset-4 hover:text-white"
                >
                  {t(
                    "Condiciones de Contratación y Licencias (/condiciones) →",
                    "Terms of Sale & Licensing (/condiciones) →"
                  )}
                </Link>
              </p>
            </section>
          </div>

          <div className="mt-16 flex flex-wrap gap-4 border-t border-[#202226] pt-8">
            <Link
              href="/contact"
              className="inline-flex border border-[#EBE7DF] bg-[#EBE7DF] px-6 py-3 text-xs font-semibold uppercase tracking-[0.25em] text-[#0B0C0E] transition hover:bg-transparent hover:text-white"
            >
              {t("Formulario de Contacto", "Contact Form")}
            </Link>
            <Link
              href="/portfolio"
              className="inline-flex border border-[#202226] px-6 py-3 text-xs uppercase tracking-[0.25em] text-[#EBE7DF] transition hover:border-[#8E8A80]"
            >
              {t("Volver al Archivo", "Back to Archive")}
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
