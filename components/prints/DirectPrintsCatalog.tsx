"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "@/components/ui/LocalizedLink";
import { useSearchParams } from "next/navigation";
import type { Photo, PhotoCategory } from "@/types/photo";
import { CATEGORY_METADATA, PHOTO_CATEGORIES } from "@/types/photo";
import { BASE_PRINT_FORMATS } from "@/data/formatos";
import PrintCardAction from "@/components/cart/PrintCardAction";
import { useLanguage } from "@/lib/i18n";
import { getLocalizedPhoto } from "@/lib/i18n-works";

interface DirectPrintsCatalogProps {
  allPhotos: Photo[];
}

const INITIAL_BATCH = 24;

export default function DirectPrintsCatalog({
  allPhotos,
}: DirectPrintsCatalogProps) {
  const { lang, t } = useLanguage();
  const searchParams = useSearchParams();
  const paymentStatus = searchParams.get("pago");
  const paymentRef = searchParams.get("ref");
  const obraParam = searchParams.get("obra") ?? "";

  const [activeCategory, setActiveCategory] = useState<PhotoCategory | "all">(
    "all"
  );
  const [searchQuery, setSearchQuery] = useState(obraParam);
  const [visibleCount, setVisibleCount] = useState(INITIAL_BATCH);

  const filteredPhotos = useMemo(() => {
    return allPhotos.filter((p) => {
      if (activeCategory !== "all" && p.category !== activeCategory) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const pEn = getLocalizedPhoto(p, "en");
        const haystack = `${p.title} ${p.location ?? ""} ${p.description} ${pEn.title} ${pEn.location ?? ""} ${pEn.description} ${p.keywords.join(" ")}`.toLowerCase();
        return haystack.includes(q);
      }
      return true;
    });
  }, [allPhotos, activeCategory, searchQuery]);

  const visiblePhotos = useMemo(
    () => filteredPhotos.slice(0, visibleCount),
    [filteredPhotos, visibleCount]
  );

  return (
    <div id="catalogo-fine-art" className="mt-8 scroll-mt-24">
      {/* Banner de Pago Confirmado si vuelve de Stripe */}
      {paymentStatus === "confirmado" && (
        <div className="mb-10 border border-[#C5A880] bg-[#151618] p-6 sm:p-8 shadow-2xl">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-[#C5A880]">
                {t(
                  "✓ Adquisición Confirmada · Venta Directa de Estudio",
                  "✓ Order Confirmed · Direct Studio Edition"
                )}
              </p>
              <h3 className="mt-1.5 font-serif text-2xl font-light text-[#F7F4EE]">
                {t(
                  `Gracias por tu compra directa${paymentRef ? ` (${paymentRef})` : ""}`,
                  `Thank you for your direct print order${paymentRef ? ` (${paymentRef})` : ""}`
                )}
              </h3>
              <p className="mt-2 text-xs font-light leading-relaxed text-[#8E8A80]">
                {t(
                  "Hemos registrado tu pedido en firme. Javier Espinosa supervisará personalmente la prueba de color e impresión sobre papel Hahnemühle Photo Rag® 308g y te enviará el seguimiento del envío asegurado junto al Certificado de Autenticidad numerado.",
                  "Your order is confirmed. Javier Espinosa will personally oversee color proofing and printing on Hahnemühle Photo Rag® 308g paper and send you insured tracking along with your signed, numbered Certificate of Authenticity."
                )}
              </p>
            </div>
            <button
              type="button"
              onClick={() => window.print()}
              className="shrink-0 border border-[#EBE7DF] bg-[#EBE7DF] px-5 py-2.5 font-mono text-[10px] uppercase tracking-[0.24em] font-medium text-[#0B0C0E] transition hover:bg-transparent hover:text-white"
            >
              {t("Guardar Resguardo (PDF)", "Save Receipt (PDF)")}
            </button>
          </div>
        </div>
      )}

      {/* Barra de Filtro por Disciplina y Buscador por Título/Lugar */}
      <div className="mt-6 flex flex-col justify-between gap-4 border border-white/[0.08] bg-[#151618]/80 p-4 lg:flex-row lg:items-center">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          <button
            type="button"
            onClick={() => setActiveCategory("all")}
            className={`shrink-0 rounded-full px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-wider transition ${
              activeCategory === "all"
                ? "bg-[#EBE7DF] text-[#0B0C0E] font-medium"
                : "border border-white/10 bg-[#0B0C0E] text-[#8E8A80] hover:text-white"
            }`}
          >
            {t("Todas las Disciplinas", "All Disciplines")}
          </button>
          {PHOTO_CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`shrink-0 rounded-full px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-wider transition ${
                activeCategory === cat
                  ? "bg-[#EBE7DF] text-[#0B0C0E] font-medium"
                  : "border border-white/10 bg-[#0B0C0E] text-[#8E8A80] hover:text-white"
              }`}
            >
              {lang === "en" ? CATEGORY_METADATA[cat].titleEn : CATEGORY_METADATA[cat].title}
            </button>
          ))}
        </div>

        <div className="relative w-full lg:w-72">
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t("Buscar obra, lugar o especie...", "Search work, location, or species...")}
            aria-label={t("Buscar obra para comprar copia Fine Art", "Search artwork to order Fine Art print")}
            className="w-full border border-white/15 bg-[#0B0C0E] px-3.5 py-2 font-mono text-xs text-[#EBE7DF] placeholder-[#8E8A80]/60 focus:border-[#C5A880] focus:outline-none"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 font-mono text-xs text-[#8E8A80] hover:text-white"
              aria-label={t("Limpiar búsqueda", "Clear search")}
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Cuadrícula de Obras con Compra Directa o Mensaje Informativo */}
      {visiblePhotos.length === 0 ? (
        <div className="mt-12 rounded-xl border border-white/10 bg-[#151618] p-8 sm:p-12 text-center max-w-2xl mx-auto">
          {activeCategory === "coches-rally" ? (
            <>
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#C5A880]">
                {t(
                  "Archivo Motorsport · Automovilismo y Rally Histórico",
                  "Motorsport Archive · Historic Rally & Classic Racing"
                )}
              </p>
              <h3 className="mt-3 font-serif text-2xl text-[#EBE7DF]">
                {t(
                  "Modalidad Especial para Pilotos, Escuderías y Prensa",
                  "Dedicated Access for Drivers, Teams & Press"
                )}
              </h3>
              <p className="mt-3 text-xs font-light leading-relaxed text-[#A39E93]">
                {t(
                  "Para proteger los derechos de imagen de vehículos, patrocinadores y competidores, las fotografías de competición no se comercializan a través del carrito online. Si eres piloto, miembro de un equipo, organizador o medio acreditado, puedes solicitar archivos máster en alta resolución o láminas de autor de forma directa.",
                  "To protect image rights of race vehicles, sponsors, and competitors, rally frames are not sold through open cart checkout. Drivers, team members, organizers, and accredited press can request high-resolution masters or Fine Art prints directly."
                )}
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Link
                  href="/contact?motivo=rally"
                  className="border border-[#C5A880] bg-[#C5A880] px-5 py-2.5 font-mono text-xs uppercase tracking-wider text-[#0B0C0E] font-medium transition hover:bg-white hover:border-white shadow"
                >
                  {t("Solicitar Obra de Rally →", "Request Rally Work →")}
                </Link>
                <Link
                  href="/portfolio/coches-rally"
                  className="border border-white/20 bg-[#0B0C0E] px-5 py-2.5 font-mono text-xs uppercase tracking-wider text-[#EBE7DF] hover:border-white transition"
                >
                  {t("Ver Portfolio de Rally", "View Rally Archive")}
                </Link>
              </div>
            </>
          ) : (
            <>
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#C5A880]">
                {t("Sin resultados", "No results")}
              </p>
              <h3 className="mt-2 font-serif text-xl text-[#EBE7DF]">
                {t(
                  "No hay obras disponibles con este criterio de búsqueda",
                  "No artworks match this search criteria"
                )}
              </h3>
              <button
                type="button"
                onClick={() => {
                  setActiveCategory("all");
                  setSearchQuery("");
                }}
                className="mt-5 border border-white/20 bg-[#0B0C0E] px-4 py-2 font-mono text-xs text-[#EBE7DF] hover:border-[#C5A880] transition cursor-pointer"
              >
                {t("Restablecer filtros →", "Reset filters →")}
              </button>
            </>
          )}
        </div>
      ) : (
        <div className="mt-10 columns-1 gap-8 sm:columns-2 lg:columns-3">
        {visiblePhotos.map((rawPhoto) => {
          const photo = getLocalizedPhoto(rawPhoto, lang);
          const catMeta = CATEGORY_METADATA[photo.category];
          return (
          <div
            key={photo.id}
            className="group mb-8 flex break-inside-avoid flex-col justify-between overflow-hidden border border-white/[0.08] bg-[#151618] transition hover:border-[#C5A880]/50"
          >
            <div>
              <Link
                href={`/portfolio/${photo.slug}`}
                className="relative block w-full overflow-hidden bg-[#0B0C0E]"
              >
                <Image
                  src={photo.image}
                  alt={photo.alt}
                  width={photo.width}
                  height={photo.height}
                  loading="lazy"
                  placeholder="blur"
                  blurDataURL="data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPScxNicgaGVpZ2h0PScxMCc+PHJlY3Qgd2lkdGg9JzE2JyBoZWlnaHQ9JzEwJyBmaWxsPSclMjMxNTE2MTgnLz48L3N2Zz4="
                  sizes="(max-width: 640px) 92vw, (max-width: 1024px) 45vw, 420px"
                  quality={85}
                  className="h-auto w-full transition duration-500 group-hover:scale-[1.02]"
                />
                <div className="absolute left-3 top-3 flex items-center gap-2">
                  <span className="border border-white/[0.08] bg-[#0B0C0E]/90 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.25em] text-[#EBE7DF] backdrop-blur-sm">
                    {(lang === "en" ? catMeta?.titleEn : catMeta?.title) ?? photo.category}
                  </span>
                </div>
              </Link>

              <div className="p-5">
                <p className="hidden font-mono text-[10px] uppercase tracking-[0.26em] text-[#8E8A80]">
                  {photo.location ? `${photo.location} · ` : ""}
                  {t(`Ed. Limitada ${photo.pricing?.editionTotal ?? 25} ej.`, `Limited Ed. ${photo.pricing?.editionTotal ?? 25}`)} ·{" "}
                  {rawPhoto.pricing?.paper.includes("Baritado")
                    ? t("Baritado 340g", "Baryta 340g")
                    : t("Algodón Mate 308g", "Cotton Matte 308g")}
                </p>
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="font-serif text-lg sm:text-xl font-light text-[#EBE7DF] transition group-hover:text-white">
                    <Link href={`/portfolio/${photo.slug}`} className="hover:underline underline-offset-4">
                      {photo.title}
                    </Link>
                  </h3>
                  <span className="shrink-0 whitespace-nowrap font-serif text-base text-[#C5A880]">
                    {t("Desde", "From")} {photo.pricing?.estudio ?? BASE_PRINT_FORMATS.estudio.defaultPrice}&nbsp;€
                  </span>
                </div>
                {photo.location && (
                  <p className="mt-1 font-mono text-[10px] text-[#A39E93]">
                    {photo.location}
                  </p>
                )}
                <p className="hidden mt-2 line-clamp-2 text-xs font-light leading-relaxed text-[#8E8A80]">
                  {photo.description}
                </p>
                <div className="hidden mt-4 border-t border-white/[0.06] pt-3 flex-col gap-1.5">
                  <div className="flex items-center justify-between gap-2 font-mono text-[11px]">
                    <span className="text-[#A39E93]">{t("Estudio", "Studio")} ({photo.pricing?.dimensions.estudio ?? BASE_PRINT_FORMATS.estudio.dimensions}):</span>
                    <span className="shrink-0 whitespace-nowrap font-serif text-sm text-[#C5A880] font-normal">{photo.pricing?.estudio ?? BASE_PRINT_FORMATS.estudio.defaultPrice}&nbsp;€</span>
                  </div>
                  <div className="flex items-center justify-between gap-2 font-mono text-[11px]">
                    <span className="text-[#A39E93]">{t("Galería", "Gallery")} ({photo.pricing?.dimensions.galeria ?? BASE_PRINT_FORMATS.galeria.dimensions}):</span>
                    <span className="shrink-0 whitespace-nowrap font-serif text-sm text-[#EBE7DF] font-light">{photo.pricing?.galeria ?? BASE_PRINT_FORMATS.galeria.defaultPrice}&nbsp;€</span>
                  </div>
                  <div className="flex items-center justify-between gap-2 font-mono text-[11px]">
                    <span className="text-[#A39E93]">{t("Colección", "Collection")} ({photo.pricing?.dimensions.coleccion ?? BASE_PRINT_FORMATS.coleccion.dimensions}):</span>
                    <span className="shrink-0 whitespace-nowrap font-serif text-sm text-[#EBE7DF] font-light">{photo.pricing?.coleccion ?? BASE_PRINT_FORMATS.coleccion.defaultPrice}&nbsp;€</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 border-t border-white/[0.08] bg-[#0B0C0E]/40 px-5 py-3.5">
              <Link
                href={`/portfolio/${photo.slug}#adquirir-copia`}
                className="font-mono text-xs uppercase tracking-[0.2em] text-[#A39E93] transition hover:text-[#EBE7DF]"
              >
                {t("Elegir tamaño →", "Choose size →")}
              </Link>
              <PrintCardAction photo={rawPhoto} />
            </div>
          </div>
          );
        })}
      </div>
      )}

      {filteredPhotos.length > visibleCount && (
        <div className="mt-12 flex flex-col items-center justify-center gap-3">
          <p className="font-mono text-xs text-[#8E8A80]">
            {t(
              `Mostrando ${visiblePhotos.length} de ${filteredPhotos.length} láminas disponibles`,
              `Showing ${visiblePhotos.length} of ${filteredPhotos.length} available prints`
            )}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => setVisibleCount((prev) => prev + INITIAL_BATCH)}
              className="border border-[#C5A880] bg-[#C5A880] px-8 py-3 text-xs uppercase font-mono tracking-[0.22em] text-[#0B0C0E] font-semibold transition-all duration-300 hover:bg-white hover:border-white cursor-pointer"
            >
              {t("Ver más láminas", "Load more prints")}
            </button>
            <button
              type="button"
              onClick={() => setVisibleCount(filteredPhotos.length)}
              className="border border-white/20 bg-white/[0.05] px-6 py-3 text-xs uppercase font-mono tracking-[0.22em] text-[#EBE7DF] transition-all duration-300 hover:border-white/40 hover:text-white cursor-pointer"
            >
              {t(`Ver las ${filteredPhotos.length} láminas`, `View all ${filteredPhotos.length} prints`)}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
