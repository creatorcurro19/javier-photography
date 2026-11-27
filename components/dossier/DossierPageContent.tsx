"use client";

import Image from "next/image";
import Link from "@/components/ui/LocalizedLink";
import Container from "@/components/ui/Container";
import PrintDossierButton from "@/components/dossier/PrintDossierButton";
import {
  AndalusianCenefa,
  AndalusianCornerOrnaments,
  AndalusianPageBackdrop,
  AndalusianStarMark,
} from "@/components/ui/AndalusianMotif";
import { BASE_PRINT_FORMATS, type getFormatPriceRanges } from "@/data/formatos";
import { SITE_CONFIG } from "@/data/site-config";
import { useLanguage } from "@/lib/i18n";
import { getLocalizedPhoto } from "@/lib/i18n-works";
import { CATEGORY_METADATA, type Photo } from "@/types/photo";

interface DossierPageContentProps {
  plates: Photo[];
  priceRanges: ReturnType<typeof getFormatPriceRanges>;
}

export default function DossierPageContent({
  plates,
  priceRanges,
}: DossierPageContentProps) {
  const { lang, t } = useLanguage();

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0B0C0E] pt-36 pb-28 text-[#EBE7DF] print:bg-white print:pt-6 print:pb-6 print:text-neutral-900">
      <div className="print:hidden">
        <AndalusianPageBackdrop variant="sebka" />
      </div>

      <Container className="relative z-10 max-w-4xl">
        {/* Barra superior de descarga */}
        <div className="mb-10 flex flex-wrap items-center justify-between gap-4 border-b border-[#C5A880]/25 pb-6 print:hidden">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-[#C5A880]">
              {t("Edición Curatorial · Formato A4", "Curatorial Edition · A4 Format")}
            </p>
            <p className="mt-1 text-xs text-[#8E8A80]">
              {t(
                "Listo para prensa, galerías, patrocinadores y estudios de arquitectura.",
                "Ready for press offices, galleries, sponsors, and architectural practices."
              )}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <PrintDossierButton />
            <Link
              href="/contact"
              className="border border-[#C5A880]/40 px-5 py-3 font-mono text-[10px] uppercase tracking-[0.24em] text-[#EBE7DF] transition hover:border-[#C5A880] hover:text-white"
            >
              {t("Contacto", "Contact")}
            </Link>
          </div>
        </div>

        {/* Documento Editorial del Dossier */}
        <article className="relative border border-[#C5A880]/30 bg-[#151618]/95 p-8 sm:p-14 print:border-neutral-300 print:bg-white print:p-6">
          <div className="print:hidden">
            <AndalusianCornerOrnaments className="text-[#C5A880]/60" />
          </div>

          {/* Portada del Dossier */}
          <header className="flex flex-col items-center text-center border-b border-[#C5A880]/25 pb-10 print:border-neutral-300">
            <Image
              src="/icon.svg"
              alt={t("Monograma JE — Javier Espinosa", "JE Monogram — Javier Espinosa")}
              width={64}
              height={64}
              className="h-14 w-14 rounded-xl ring-1 ring-[#C5A880]/40"
            />
            <div className="mt-5 flex items-center gap-2.5">
              <AndalusianStarMark className="h-3.5 w-3.5 text-[#C5A880]" />
              <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-[#C5A880] print:text-neutral-600">
                {t("Dossier de Autor y Prensa", "Author & Press Dossier")}
              </p>
              <AndalusianStarMark className="h-3.5 w-3.5 text-[#C5A880]" />
            </div>

            <h1 className="mt-3 font-sans text-3xl sm:text-5xl font-light tracking-[0.22em] uppercase text-[#F7F4EE] print:text-neutral-900">
              Javier Espinosa
            </h1>
            <p className="mt-2 font-serif italic text-xl text-[#E5D3B3] print:text-neutral-700">
              {t("The Art of Seeing · Fotografía de Autor", "The Art of Seeing · Author Photography")}
            </p>
            <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.22em] text-[#8E8A80] print:text-neutral-600">
              {t(
                "Residiendo en Tenerife, Canarias · Disponibilidad para desplazamientos",
                "Based in Tenerife, Canary Islands · Available to travel"
              )}
            </p>
          </header>

          {/* Declaración y Biografía */}
          <section className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-12">
            <div className="md:col-span-7 space-y-4">
              <h2 className="font-mono text-[10px] uppercase tracking-[0.35em] text-[#C5A880] print:text-neutral-700">
                {t("01 · Enfoque y Trayectoria", "01 · Approach & Background")}
              </h2>
              <blockquote className="border-l-2 border-[#C5A880]/60 pl-4 font-serif italic text-base leading-relaxed text-[#F7F4EE] print:text-neutral-900">
                {t(
                  "«La fotografía no tiene que demostrar constantemente lo impresionante que es el mundo. A veces basta con detenerse a observarlo.»",
                  '"Photography does not always need to prove how dramatic the world looks. Sometimes it is enough to stop and observe it."'
                )}
              </blockquote>
              <p className="text-sm font-light leading-relaxed text-[#D4CEC3] print:text-neutral-700">
                {t(
                  "Soy Javier Espinosa, fotógrafo independiente, actualmente residiendo en Tenerife. Me gusta perderme en lugares nuevos, observar lo que normalmente pasa desapercibido y encontrar imágenes en situaciones cotidianas. Mi fotografía se mueve entre la naturaleza, los paisajes, la arquitectura y la cultura, sin demasiadas etiquetas ni límites; más que especializarme en una sola forma de fotografiar, me interesa seguir descubriendo nuevas maneras de mirar.",
                  "I am Javier Espinosa, an independent photographer currently based in Tenerife. I enjoy wandering into unfamiliar places, noticing what usually passes unnoticed, and finding honest photographs in everyday light. My work moves between wildlife, landscapes, historic rallies, architecture, and cultural documentary without rigid boundaries—focused always on learning to look more closely."
                )}
              </p>
            </div>

            <div className="md:col-span-5 border border-white/[0.08] bg-[#0B0C0E]/70 p-6 space-y-4 print:border-neutral-300 print:bg-neutral-50">
              <h2 className="font-mono text-[10px] uppercase tracking-[0.35em] text-[#C5A880] print:text-neutral-700">
                {t("02 · Ficha Técnica & Soporte", "02 · Technical Specs & Craft")}
              </h2>
              <ul className="space-y-2.5 text-xs font-light text-[#D4CEC3] print:text-neutral-800">
                <li>
                  <strong className="font-mono uppercase text-[#EBE7DF] print:text-neutral-900">
                    {t("Cuerpo:", "Camera:")}
                  </strong>{" "}
                  Canon EOS R7 (32,5 MP APS-C)
                </li>
                <li>
                  <strong className="font-mono uppercase text-[#EBE7DF] print:text-neutral-900">
                    {t("Ópticas:", "Optics:")}
                  </strong>{" "}
                  {t(
                    "Sigma 150-600mm Contemporary · Canon RF-S 18-150mm · Fijos luminosos",
                    "Sigma 150-600mm Contemporary · Canon RF-S 18-150mm · Fast Primes"
                  )}
                </li>
                <li>
                  <strong className="font-mono uppercase text-[#EBE7DF] print:text-neutral-900">
                    Fine Art:
                  </strong>{" "}
                  {t(
                    "Hahnemühle Photo Rag® 308 g/m² (100% algodón, ISO 9706)",
                    "Hahnemühle Photo Rag® 308 gsm (100% cotton, ISO 9706)"
                  )}
                </li>
                <li>
                  <strong className="font-mono uppercase text-[#EBE7DF] print:text-neutral-900">
                    {t("Tiradas:", "Editions:")}
                  </strong>{" "}
                  {t(
                    "Ediciones limitadas (10 a 50 ejemplares), numeradas y firmadas a mano",
                    "Limited editions (10 to 50 copies), hand-numbered and signed"
                  )}
                </li>
              </ul>
            </div>
          </section>

          <AndalusianCenefa
            variant="estrella"
            className="my-10 text-[#C5A880]/36 print:opacity-40"
          />

          {/* Selección de Láminas del Dossier */}
          <section>
            <h2 className="font-mono text-[10px] uppercase tracking-[0.35em] text-[#C5A880] print:text-neutral-700">
              {t("03 · Selección de Obra Representativa", "03 · Representative Work Selection")}
            </h2>
            <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3">
              {plates.map((raw) => {
                const photo = getLocalizedPhoto(raw, lang);
                const catMeta = CATEGORY_METADATA[photo.category];
                const catLabel = catMeta
                  ? lang === "en"
                    ? catMeta.titleEn
                    : catMeta.title
                  : photo.category;
                return (
                  <figure
                    key={photo.id}
                    className="overflow-hidden border border-white/[0.08] bg-[#0B0C0E] print:border-neutral-300 print:bg-white"
                  >
                    <div className="relative aspect-[4/3] w-full overflow-hidden">
                      <Image
                        src={photo.image}
                        alt={photo.alt}
                        fill
                        sizes="(max-width: 640px) 50vw, 33vw"
                        quality={85}
                        className="object-cover"
                      />
                    </div>
                    <figcaption className="p-3">
                      <p className="truncate font-serif text-xs text-[#F7F4EE] print:text-neutral-900">
                        {photo.title}
                      </p>
                      <p className="truncate font-mono text-[9px] uppercase tracking-wider text-[#8E8A80] print:text-neutral-600">
                        {catLabel} · {photo.year}
                      </p>
                    </figcaption>
                  </figure>
                );
              })}
            </div>
          </section>

          {/* Tarifas Orientativas Fine Art y Contacto */}
          <section className="mt-10 grid grid-cols-1 gap-6 border-t border-[#C5A880]/20 pt-8 sm:grid-cols-2 print:border-neutral-300">
            <div>
              <h2 className="font-mono text-[10px] uppercase tracking-[0.35em] text-[#C5A880] print:text-neutral-700">
                {t("04 · Formatos de Colección Fine Art", "04 · Fine Art Collection Formats")}
              </h2>
              <ul className="mt-3 space-y-1.5 font-mono text-xs text-[#D4CEC3] print:text-neutral-800">
                <li>
                  {lang === "en"
                    ? BASE_PRINT_FORMATS.estudio.shortNameEn
                    : BASE_PRINT_FORMATS.estudio.shortName}{" "}
                  ({BASE_PRINT_FORMATS.estudio.dimensions} · Ed. {priceRanges.estudio.editionMin}–
                  {priceRanges.estudio.editionMax}) — {priceRanges.estudio.min} {t("a", "to")}{" "}
                  {priceRanges.estudio.max} €
                </li>
                <li>
                  {lang === "en"
                    ? BASE_PRINT_FORMATS.galeria.shortNameEn
                    : BASE_PRINT_FORMATS.galeria.shortName}{" "}
                  ({BASE_PRINT_FORMATS.galeria.dimensions} · Ed. {priceRanges.galeria.editionMin}–
                  {priceRanges.galeria.editionMax}) — {priceRanges.galeria.min} {t("a", "to")}{" "}
                  {priceRanges.galeria.max} €
                </li>
                <li>
                  {lang === "en"
                    ? BASE_PRINT_FORMATS.coleccion.shortNameEn
                    : BASE_PRINT_FORMATS.coleccion.shortName}{" "}
                  ({BASE_PRINT_FORMATS.coleccion.dimensions} · Ed. {priceRanges.coleccion.editionMin}–
                  {priceRanges.coleccion.editionMax}) — {priceRanges.coleccion.min} {t("a", "to")}{" "}
                  {priceRanges.coleccion.max} €
                </li>
              </ul>
            </div>

            <div>
              <h2 className="font-mono text-[10px] uppercase tracking-[0.35em] text-[#C5A880] print:text-neutral-700">
                {t("05 · Representación y Contacto Directo", "05 · Representation & Direct Contact")}
              </h2>
              <ul className="mt-3 space-y-1.5 font-mono text-xs text-[#D4CEC3] print:text-neutral-800">
                <li>
                  {t("Email", "Email")}: {SITE_CONFIG.contactEmail}
                </li>
                <li>Web: {SITE_CONFIG.siteHost}</li>
                <li>Saatchi Art · Getty Images / iStock · @Javier.espinosa19</li>
              </ul>
            </div>
          </section>
        </article>
      </Container>
    </div>
  );
}
