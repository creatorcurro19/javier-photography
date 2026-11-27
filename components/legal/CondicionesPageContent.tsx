"use client";

import Link from "next/link";
import Container from "@/components/ui/Container";
import {
  AndalusianCenefa,
  AndalusianPageBackdrop,
} from "@/components/ui/AndalusianMotif";
import { getPlazos } from "@/data/plazos";
import { SITE_CONFIG } from "@/data/site-config";
import { useLanguage } from "@/lib/i18n";

export default function CondicionesPageContent() {
  const { lang, t } = useLanguage();
  const plazos = getPlazos(lang);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0B0C0E] pt-36 pb-28 text-[#EBE7DF]">
      <AndalusianPageBackdrop variant="laceria" />
      <Container className="relative z-10">
        <div className="mx-auto max-w-4xl">
          <header className="pb-8">
            <p className="font-mono text-xs uppercase tracking-[0.38em] text-[#C5A880]">
              {t(
                "Contratación, Obra Gráfica y Derechos de Uso",
                "Terms of Sale, Fine Art Prints & Usage Rights"
              )}
            </p>
            <h1 className="mt-3 font-serif text-4xl font-light text-[#EBE7DF] sm:text-5xl">
              {t(
                "Condiciones de Compra, Envío y Licencias",
                "Purchasing, Shipping & Licensing Terms"
              )}
            </h1>
            <p className="mt-4 font-mono text-xs text-[#A39E93]">
              {t(
                "Titular: Javier Espinosa Martínez · Domicilio e identificación fiscal en el ",
                "Owner: Javier Espinosa Martínez · Registered domicile and tax identification in the "
              )}
              <Link
                href="/legal"
                className="text-[#EBE7DF] underline decoration-[#C5A880]/50 underline-offset-4 hover:text-[#C5A880]"
              >
                {t("Aviso Legal (/legal)", "Legal Notice (/legal)")}
              </Link>
              .
            </p>
          </header>

          <AndalusianCenefa variant="estrella" className="text-[#C5A880]/36" />

          <div className="mt-12 space-y-12 text-sm font-light leading-relaxed text-[#EBE7DF]/85">
            {/* 1. Producción y Envío */}
            <section id="envio" className="space-y-3">
              <h2 className="font-mono text-xs uppercase tracking-[0.28em] text-[#C5A880]">
                {t(
                  "01 / Producción Fine Art y Envío en Tubo Rígido",
                  "01 / Fine Art Production & Rigid Tube Shipping"
                )}
              </h2>
              <p>
                {t(
                  "Todas las copias Fine Art se producen bajo pedido individual en laboratorio especializado de Tenerife sobre papel 100% algodón mate (Hahnemühle Photo Rag® 308g / Canson Rag Photographique 310g) o papel baritado de sulfato de bario (Canson Baryta II 340g / Hahnemühle FineArt Baryta 325g), según la obra seleccionada.",
                  "All Fine Art prints are produced individually to order at a specialist print studio in Tenerife on 100% cotton matte paper (Hahnemühle Photo Rag® 308g / Canson Rag Photographique 310g) or barium-sulfate baryta paper (Canson Baryta II 340g / Hahnemühle FineArt Baryta 325g), depending on the selected photograph."
                )}
              </p>
              <ul className="list-disc space-y-1.5 pl-5 text-[#A39E93]">
                <li>
                  <strong className="text-[#EBE7DF]">
                    {t("Modalidad exclusiva sin enmarcar:", "Unframed prints only:")}
                  </strong>{" "}
                  {t(
                    "Las obras se entregan únicamente como lámina con margen blanco perimetral de conservación (3 a 5 cm según formato), protegidas con papel tisú libre de ácido dentro de un tubo rígido cilíndrico de alta densidad (3–4 mm de grosor) junto a su Certificado de Autenticidad firmado y numerado.",
                    "Prints are delivered unframed with an archival white border (3 to 5 cm depending on format), protected in acid-free tissue paper inside a high-density cylindrical tube (3–4 mm wall thickness) together with a signed and numbered Certificate of Authenticity."
                  )}
                </li>
                <li>
                  <strong className="text-[#EBE7DF]">
                    {t(
                      "Plazos y tarifas de envío por zona:",
                      "Lead times & shipping rates by destination:"
                    )}
                  </strong>{" "}
                  {plazos.copias}{" "}
                  {t("Coste de envío en tubo rígido:", "Rigid tube shipping cost:")}{" "}
                  <strong className="text-[#EBE7DF]">
                    {t("Canarias: 0 € (incluido)", "Canary Islands: €0 (included)")}
                  </strong>{" "}
                  ·{" "}
                  <strong className="text-[#EBE7DF]">
                    {t(
                      "España Peninsular y Baleares: 15 €",
                      "Mainland Spain & Balearic Islands: €15"
                    )}
                  </strong>{" "}
                  ·{" "}
                  <strong className="text-[#EBE7DF]">
                    {t(
                      "Unión Europea e Internacional: 28 €",
                      "European Union & International: €28"
                    )}
                  </strong>
                  .
                </li>
              </ul>
            </section>

            {/* 2. Pago e Impuestos */}
            <section id="pago-impuestos" className="space-y-3 border-t border-white/[0.08] pt-10">
              <h2 className="font-mono text-xs uppercase tracking-[0.28em] text-[#C5A880]">
                {t("02 / Pago, Impuestos y Aduanas", "02 / Payment, Taxes & Customs")}
              </h2>
              <p>
                {t(
                  "Los precios orientativos de cada obra se muestran en Euros (€) en su ficha técnica.",
                  "Indicative prices for each work are displayed in Euros (€) on its respective sheet."
                )}
              </p>
              <ul className="list-disc space-y-1.5 pl-5 text-[#A39E93]">
                <li>
                  {/* PENDIENTE: confirmar con gestor (IGIC / REPEP / IVA) */}
                  <strong className="text-[#EBE7DF]">
                    {t("Impuestos aplicables y envíos:", "Applicable taxes and shipments:")}
                  </strong>{" "}
                  {t(
                    "Los impuestos aplicables se indican al confirmar el pedido. En envíos fuera de Canarias (Península, Baleares e Internacional), las entregas se realizan mediante correo postal certificado en tubo rígido.",
                    "Applicable taxes are indicated upon order confirmation. For deliveries outside the Canary Islands (Mainland Spain, Balearic Islands, and International), orders ship via registered postal service in a rigid tube."
                  )}
                </li>
                <li>
                  <strong className="text-[#EBE7DF]">
                    {t("Medios de pago:", "Payment methods:")}
                  </strong>{" "}
                  {t(
                    "Reserva directa con confirmación del autor y pago mediante transferencia bancaria o enlace de pago verificado tras confirmar disponibilidad del número de edición.",
                    "Direct reservation confirmed by the author, with payment via bank transfer or verified payment link once edition availability is confirmed."
                  )}
                </li>
              </ul>
            </section>

            {/* 3. Desistimiento y Devoluciones */}
            <section id="desistimiento" className="space-y-3 border-t border-white/[0.08] pt-10">
              <h2 className="font-mono text-xs uppercase tracking-[0.28em] text-[#C5A880]">
                {t(
                  "03 / Derecho de Desistimiento (14 días) y Devoluciones",
                  "03 / Right of Withdrawal (14 Days) & Returns"
                )}
              </h2>
              <p>
                {t(
                  "De conformidad con el Real Decreto Legislativo 1/2007 (TRLGDCU):",
                  "In accordance with Spanish Royal Legislative Decree 1/2007 (TRLGDCU):"
                )}
              </p>
              <ul className="list-disc space-y-1.5 pl-5 text-[#A39E93]">
                <li>
                  <strong className="text-[#EBE7DF]">
                    {t(
                      "Plazo de 14 días naturales (formatos estándar de catálogo):",
                      "14 calendar days (standard catalog formats):"
                    )}
                  </strong>{" "}
                  {t(
                    "El comprador dispone de un plazo de 14 días naturales desde la recepción del tubo rígido para ejercer su derecho de desistimiento sobre copias en formatos estándar del catálogo, siempre que la lámina y el Certificado de Autenticidad se devuelvan en su tubo rígido original sin marcas de manipulación, dobleces ni enmarcado previo.",
                    "The buyer has 14 calendar days from receipt of the rigid tube to exercise the right of withdrawal on standard catalog print formats, provided the print and Certificate of Authenticity are returned inside the original tube with no handling marks, creases, or prior framing."
                  )}
                </li>
                <li>
                  <strong className="text-[#EBE7DF]">
                    {t(
                      "Excepción legal en encargos personalizados (Art. 103.c TRLGDCU):",
                      "Statutory exception for bespoke orders (Art. 103.c TRLGDCU):"
                    )}
                  </strong>{" "}
                  {t(
                    "El derecho de desistimiento no será aplicable a obras producidas bajo especificaciones personalizadas del cliente (medidas especiales fuera de los tres formatos estándar, recortes a medida, dípticos comisariados bajo encargo o sesiones fotográficas por encargo).",
                    "The right of withdrawal does not apply to works produced to custom customer specifications (non-standard dimensions, custom crops, commissioned diptychs, or bespoke photography commissions)."
                  )}
                </li>
                <li>
                  <strong className="text-[#EBE7DF]">
                    {t("Garantía por daños en tránsito:", "Transit damage guarantee:")}
                  </strong>{" "}
                  {t(
                    "Si el tubo rígido llegara con daños visibles de transporte que afecten a la lámina, el comprador deberá comunicarlo en un plazo de 48 horas adjuntando fotografías del embalaje y de la obra a ",
                    "Should a shipping tube arrive with visible transit damage affecting the print, the buyer must notify within 48 hours enclosing photos of the packaging and artwork to "
                  )}
                  <span className="font-mono text-[#EBE7DF]">{SITE_CONFIG.contactEmail}</span>{" "}
                  {t(
                    "para proceder a la reposición sin coste de un nuevo ejemplar certificado.",
                    "so a replacement certified print can be dispatched at no extra cost."
                  )}
                </li>
              </ul>
            </section>

            {/* 4. Términos de Licencia */}
            <section id="licencias" className="space-y-3 border-t border-white/[0.08] pt-10">
              <h2 className="font-mono text-xs uppercase tracking-[0.28em] text-[#C5A880]">
                {t(
                  "04 / Términos de Licencia de Reproducción (Rights-Managed · TIFF 16-bit)",
                  "04 / Reproduction Licensing Terms (Rights-Managed · 16-bit TIFF)"
                )}
              </h2>
              <p>
                {t(
                  "La adquisición de una copia física Fine Art no conlleva la cesión de derechos de reproducción, explotación comercial ni digitalización de la imagen. Para usos editoriales, publicitarios o corporativos:",
                  "Purchasing a physical Fine Art print does not grant reproduction, commercial exploitation, or digitization rights over the image. For editorial, advertising, or corporate uses:"
                )}
              </p>
              <ul className="list-disc space-y-1.5 pl-5 text-[#A39E93]">
                <li>
                  {t(
                    "Toda licencia digital se otorga por escrito bajo modalidad ",
                    "All digital licenses are granted in writing on a "
                  )}
                  <strong className="text-[#EBE7DF]">Rights-Managed (RM)</strong>
                  {t(
                    ", especificando obra, medio, alcance territorial, duración temporal y carácter exclusivo o no exclusivo.",
                    " basis, specifying the work, media channels, geographic territory, term, and exclusive or non-exclusive rights."
                  )}
                </li>
                <li>
                  {t(
                    "Los archivos máster se entregan unificados en formato ",
                    "Master files are delivered uniformly in "
                  )}
                  <strong className="text-[#EBE7DF]">
                    {t("TIFF 16-bit sin comprimir", "uncompressed 16-bit TIFF")}
                  </strong>{" "}
                  {t(
                    "(y/o JPEG a 300 DPI en perfil Adobe RGB / sRGB según destino).",
                    "(and/or 300 DPI JPEG in Adobe RGB / sRGB according to target use)."
                  )}
                </li>
                <li>
                  <strong className="text-[#EBE7DF]">
                    {t(
                      "Derechos de imagen de terceros y marcas/libreas de vehículos:",
                      "Third-party personality rights and vehicle trademarks/liveries:"
                    )}
                  </strong>{" "}
                  {t(
                    "En fotografías donde aparezcan personas identificables o vehículos de competición con marcas comerciales, logotipos, patrocinadores o libreas, la licencia estándar autoriza únicamente el ",
                    "For photographs featuring identifiable individuals or competition vehicles bearing commercial logos, sponsors, or race liveries, the standard license covers only "
                  )}
                  <strong className="text-[#EBE7DF]">
                    {t("uso editorial, cultural o informativo", "editorial, cultural, or news usage")}
                  </strong>
                  {t(
                    ". Cualquier uso publicitario comercial requiere verificar previamente las autorizaciones de imagen (",
                    ". Any commercial advertising use requires prior clearance of personality rights ("
                  )}
                  <em>Model Release</em>
                  {t(") o de propiedad industrial/marcaria (", ") or trademark/property clearance (")}
                  <em>Property / Trademark Release</em>
                  {t(") con el titular correspondiente.", ") with the relevant rights holder.")}
                </li>
              </ul>
            </section>
          </div>

          <div className="mt-14 flex flex-wrap gap-4 border-t border-white/[0.08] pt-8">
            <Link
              href="/legal"
              className="inline-flex min-h-[44px] items-center border border-white/20 bg-[#151618] px-6 py-3 font-mono text-xs uppercase tracking-[0.22em] text-[#EBE7DF] transition hover:border-white/50"
            >
              {t("← Ver Aviso Legal y Privacidad (/legal)", "← View Legal Notice & Privacy (/legal)")}
            </Link>
            <Link
              href="/contact"
              className="inline-flex min-h-[44px] items-center border border-[#C5A880] bg-[#C5A880] px-6 py-3 font-mono text-xs font-semibold uppercase tracking-[0.22em] text-[#0B0C0E] transition hover:bg-white hover:border-white"
            >
              {t("Consultar con el Estudio →", "Contact Studio →")}
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
