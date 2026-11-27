import Link from "next/link";
import Container from "@/components/ui/Container";
import {
  AndalusianCenefa,
  AndalusianPageBackdrop,
} from "@/components/ui/AndalusianMotif";
import JsonLd from "@/components/seo/JsonLd";
import { PLAZOS } from "@/data/plazos";
import { SITE_CONFIG } from "@/data/site-config";
import { buildPageMetadata } from "@/lib/metadata";
import { generateBreadcrumbSchema } from "@/lib/schema";

export const metadata = buildPageMetadata({
  title: "Condiciones de Compra, Envío y Licencias | Javier Espinosa",
  description:
    "Condiciones generales de venta de copias Fine Art en tubo rígido, impuestos (IGIC/IVA), plazos de envío, derecho de desistimiento, devoluciones y términos de licencia.",
  path: "/condiciones",
});

export default function CondicionesPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0B0C0E] pt-36 pb-28 text-[#EBE7DF]">
      <JsonLd
        data={generateBreadcrumbSchema([
          { name: "Inicio", path: "/" },
          { name: "Condiciones de Compra y Licencias", path: "/condiciones" },
        ])}
      />
      <AndalusianPageBackdrop variant="laceria" />
      <Container className="relative z-10">
        <div className="mx-auto max-w-4xl">
          <header className="pb-8">
            <p className="font-mono text-xs uppercase tracking-[0.38em] text-[#C5A880]">
              Contratación, Obra Gráfica y Derechos de Uso
            </p>
            <h1 className="mt-3 font-serif text-4xl font-light text-[#EBE7DF] sm:text-5xl">
              Condiciones de Compra, Envío y Licencias
            </h1>
            <p className="mt-4 font-mono text-xs text-[#A39E93]">
              Titular: Javier Espinosa Martínez · NIF: 26505129K · Domicilio: Puerto de la Cruz (Santa Cruz de Tenerife, Islas Canarias, España).
            </p>
          </header>

          <AndalusianCenefa variant="estrella" className="text-[#C5A880]/36" />

          <div className="mt-12 space-y-12 text-sm font-light leading-relaxed text-[#EBE7DF]/85">
            {/* 1. Producción y Envío */}
            <section id="envio" className="space-y-3">
              <h2 className="font-mono text-xs uppercase tracking-[0.28em] text-[#C5A880]">
                01 / Producción Fine Art y Envío en Tubo Rígido
              </h2>
              <p>
                Todas las copias Fine Art se producen bajo pedido individual en laboratorio especializado de Tenerife sobre papel 100% algodón mate (Hahnemühle Photo Rag® 308g / Canson Rag Photographique 310g) o papel baritado de sulfato de bario (Canson Baryta II 340g / Hahnemühle FineArt Baryta 325g), según la obra seleccionada.
              </p>
              <ul className="list-disc space-y-1.5 pl-5 text-[#A39E93]">
                <li>
                  <strong className="text-[#EBE7DF]">Modalidad exclusiva sin enmarcar:</strong> Las obras se entregan únicamente como lámina con margen blanco perimetral de conservación (3 a 7,5 cm según formato), protegidas con papel tisú libre de ácido dentro de un tubo rígido cilíndrico de alta densidad (3–4 mm de grosor) junto a su Certificado de Autenticidad firmado y numerado.
                </li>
                <li>
                  <strong className="text-[#EBE7DF]">Plazos y tarifas de envío por zona:</strong> {PLAZOS.copias} Coste de envío en tubo rígido: <strong className="text-[#EBE7DF]">Canarias: 0 € (incluido)</strong> · <strong className="text-[#EBE7DF]">España Peninsular y Baleares: 15 €</strong> · <strong className="text-[#EBE7DF]">Unión Europea e Internacional: 28 €</strong>.
                </li>
              </ul>
            </section>

            {/* 2. Pago e Impuestos */}
            <section id="pago-impuestos" className="space-y-3 border-t border-white/[0.08] pt-10">
              <h2 className="font-mono text-xs uppercase tracking-[0.28em] text-[#C5A880]">
                02 / Pago, Impuestos (IGIC / IVA) y Aduanas
              </h2>
              <p>
                Los precios de cada obra están expresados en Euros (€) de forma individual según su ficha técnica.
              </p>
              <ul className="list-disc space-y-1.5 pl-5 text-[#A39E93]">
                <li>
                  <strong className="text-[#EBE7DF]">Régimen fiscal y precios:</strong> Venta particular de obra gráfica y artística de autor (creación artística independiente no sujeta a repercusión de IGIC mercantil). Los importes mostrados son precios finales para el adquirente. En envíos fuera de Canarias (Península, Baleares e Internacional), las entregas se realizan mediante correo postal certificado en tubo rígido.
                </li>
                <li>
                  <strong className="text-[#EBE7DF]">Medios de pago:</strong> Reserva directa con confirmación del autor y pago mediante pasarela segura (Stripe, cuando esté activa) o transferencia bancaria / enlace de pago verificado tras confirmar disponibilidad del número de edición.
                </li>
              </ul>
            </section>

            {/* 3. Desistimiento y Devoluciones */}
            <section id="desistimiento" className="space-y-3 border-t border-white/[0.08] pt-10">
              <h2 className="font-mono text-xs uppercase tracking-[0.28em] text-[#C5A880]">
                03 / Derecho de Desistimiento (14 días) y Devoluciones
              </h2>
              <p>
                De conformidad con el Real Decreto Legislativo 1/2007 (TRLGDCU):
              </p>
              <ul className="list-disc space-y-1.5 pl-5 text-[#A39E93]">
                <li>
                  <strong className="text-[#EBE7DF]">Plazo de 14 días naturales (formatos estándar de catálogo):</strong> El comprador dispone de un plazo de 14 días naturales desde la recepción del tubo rígido para ejercer su derecho de desistimiento sobre copias en formatos estándar del catálogo, siempre que la lámina y el Certificado de Autenticidad se devuelvan en su tubo rígido original sin marcas de manipulación, dobleces ni enmarcado previo.
                </li>
                <li>
                  <strong className="text-[#EBE7DF]">Excepción legal en encargos personalizados (Art. 103.c TRLGDCU):</strong> El derecho de desistimiento no será aplicable a obras producidas bajo especificaciones personalizadas del cliente (medidas especiales fuera de los tres formatos estándar, recortes a medida, dípticos comisariados bajo encargo o sesiones fotográficas por encargo).
                </li>
                <li>
                  <strong className="text-[#EBE7DF]">Garantía por daños en tránsito:</strong> Si el tubo rígido llegara con daños visibles de transporte que afecten a la lámina, el comprador deberá comunicarlo en un plazo de 48 horas adjuntando fotografías del embalaje y de la obra a <span className="font-mono text-[#EBE7DF]">{SITE_CONFIG.contactEmail}</span> para proceder a la reposición sin coste de un nuevo ejemplar certificado.
                </li>
              </ul>
            </section>

            {/* 4. Términos de Licencia */}
            <section id="licencias" className="space-y-3 border-t border-white/[0.08] pt-10">
              <h2 className="font-mono text-xs uppercase tracking-[0.28em] text-[#C5A880]">
                04 / Términos de Licencia de Reproducción (Rights-Managed · TIFF 16-bit)
              </h2>
              <p>
                La adquisición de una copia física Fine Art no conlleva la cesión de derechos de reproducción, explotación comercial ni digitalización de la imagen. Para usos editoriales, publicitarios o corporativos:
              </p>
              <ul className="list-disc space-y-1.5 pl-5 text-[#A39E93]">
                <li>
                  Toda licencia digital se otorga por escrito bajo modalidad <strong className="text-[#EBE7DF]">Rights-Managed (RM)</strong>, especificando obra, medio, alcance territorial, duración temporal y carácter exclusivo o no exclusivo.
                </li>
                <li>
                  Los archivos máster se entregan unificados en formato <strong className="text-[#EBE7DF]">TIFF 16-bit sin comprimir</strong> (y/o JPEG a 300 DPI en perfil Adobe RGB / sRGB según destino).
                </li>
                <li>
                  <strong className="text-[#EBE7DF]">Derechos de imagen de terceros y marcas/libreas de vehículos:</strong> En fotografías donde aparezcan personas identificables o vehículos de competición con marcas comerciales, logotipos, patrocinadores o libreas, la licencia estándar autoriza únicamente el <strong className="text-[#EBE7DF]">uso editorial, cultural o informativo</strong>. Cualquier uso publicitario comercial requiere verificar previamente las autorizaciones de imagen (<em>Model Release</em>) o de propiedad industrial/marcaria (<em>Property / Trademark Release</em>) con el titular correspondiente.
                </li>
              </ul>
            </section>
          </div>

          <div className="mt-14 flex flex-wrap gap-4 border-t border-white/[0.08] pt-8">
            <Link
              href="/legal"
              className="inline-flex min-h-[44px] items-center border border-white/20 bg-[#151618] px-6 py-3 font-mono text-xs uppercase tracking-[0.22em] text-[#EBE7DF] transition hover:border-white/50"
            >
              ← Ver Aviso Legal y Privacidad (/legal)
            </Link>
            <Link
              href="/contact"
              className="inline-flex min-h-[44px] items-center border border-[#C5A880] bg-[#C5A880] px-6 py-3 font-mono text-xs font-semibold uppercase tracking-[0.22em] text-[#0B0C0E] transition hover:bg-white hover:border-white"
            >
              Consultar con el Estudio →
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
