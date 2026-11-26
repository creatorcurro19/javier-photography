import Link from "next/link";
import type { Photo } from "@/types/photo";
import { CATEGORY_METADATA } from "@/types/photo";
import { getProjectsForPhoto } from "@/lib/photos";
import FavoriteButton from "@/components/photo/FavoriteButton";
import ShareButton from "@/components/photo/ShareButton";

type PhotoMetaProps = {
  photo: Photo;
};

export default function PhotoMeta({ photo }: PhotoMetaProps) {
  const categoryInfo = CATEGORY_METADATA[photo.category];
  const relatedProjects = getProjectsForPhoto(photo.id);

  return (
    <header className="border-b border-white/[0.08] pb-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2.5 text-xs font-mono uppercase tracking-[0.2em] text-[#C5A880]">
          <Link
            href={`/portfolio/${photo.category}`}
            className="hover:text-[#EBE7DF] transition"
          >
            {categoryInfo?.title ?? photo.category}
          </Link>
          {photo.location && (
            <>
              <span className="text-white/25">·</span>
              <span className="text-[#A39E93]">{photo.location}</span>
            </>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <ShareButton title={photo.title} slug={photo.slug} location={photo.location} />
          <FavoriteButton title={photo.title} />
        </div>
      </div>

      <h1 className="mt-3 font-serif text-3xl sm:text-4xl md:text-5xl font-light tracking-tight text-[#EBE7DF] leading-[1.12]">
        {photo.title}
      </h1>

      <p className="mt-4 max-w-2xl text-base sm:text-lg leading-relaxed text-[#EBE7DF]/80 font-light">
        {photo.description}
      </p>

      {/* Bloques técnicos y banner duplicado ocultos en versión minimalista (sin eliminar nada) */}
      <div className="hidden">
      {/* Prominent Price & Acquisition Banner */}
      {photo.prints ? (
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border border-[#C5A880]/30 bg-[#15171A] p-4 sm:p-5">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#C5A880] block">
              Copia Fine Art · {photo.pricing?.paper.includes("Baritado") ? "Papel Baritado 340g" : "Algodón 100% 308g"} (Ed. {photo.pricing?.editionTotal ?? 25} ej.)
            </span>
            <div className="mt-1 flex flex-wrap items-baseline gap-3">
              <span className="whitespace-nowrap font-serif text-2xl sm:text-3xl font-light text-[#EBE7DF]">
                Desde {photo.pricing?.estudio ?? 100}&nbsp;€
              </span>
              <span className="font-mono text-xs text-[#A39E93]">
                (<span className="whitespace-nowrap">Estudio {photo.pricing?.estudio ?? 100}&nbsp;€</span> · <span className="whitespace-nowrap">Galería {photo.pricing?.galeria ?? 190}&nbsp;€</span> · <span className="whitespace-nowrap">Colección {photo.pricing?.coleccion ?? 320}&nbsp;€</span>)
              </span>
            </div>
          </div>
          <a
            href="#adquirir-copia"
            className="inline-flex min-h-[44px] items-center gap-2 border border-[#C5A880] bg-[#C5A880] px-5 py-2.5 font-mono text-xs uppercase tracking-[0.2em] text-[#0B0C0E] font-semibold transition hover:bg-white hover:border-white shadow"
          >
            <span>Elegir Formato y Comprar</span>
            <span>↓</span>
          </a>
        </div>
      ) : (
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border border-white/10 bg-[#15171A] p-4 sm:p-5">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#C5A880] block">
              {photo.category === "coches-rally"
                ? "Archivo Motorsport · Cobertura & Prensa"
                : "Archivo Documental"}
            </span>
            <p className="mt-1 font-serif text-lg sm:text-xl font-light text-[#EBE7DF]">
              {photo.category === "coches-rally"
                ? "Disponible para pilotos, escuderías y prensa editorial"
                : "Obra de archivo para consulta y proyectos editoriales"}
            </p>
          </div>
          <a
            href="#adquirir-copia"
            className="inline-flex min-h-[44px] items-center gap-2 border border-[#C5A880] bg-[#C5A880] px-5 py-2.5 font-mono text-xs uppercase tracking-[0.2em] text-[#0B0C0E] font-semibold transition hover:bg-white hover:border-white shadow"
          >
            <span>{photo.category === "coches-rally" ? "Solicitar como Piloto / Prensa" : "Consultar Disponibilidad"}</span>
            <span>↓</span>
          </a>
        </div>
      )}

      <dl className="mt-8 grid grid-cols-2 gap-6 text-sm sm:grid-cols-4 border-y border-[#202226] py-6">
        <div>
          <dt className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#8E8A80]">
            Colección / Series
          </dt>
          <dd className="mt-1.5 font-light text-[#EBE7DF]">
            <Link
              href={`/portfolio/${photo.category}`}
              className="hover:text-[#C5A880] transition"
            >
              {categoryInfo?.title ?? photo.category}
            </Link>
          </dd>
        </div>
        <div>
          <dt className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#8E8A80]">
            Año de Creación
          </dt>
          <dd className="mt-1.5 font-light text-[#EBE7DF]">{photo.year}</dd>
        </div>
        <div>
          <dt className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#A39E93]">
            Formato Máx. Recomendado
          </dt>
          <dd className="mt-1.5 font-light text-[#EBE7DF]">
            {photo.maxRecommendedFormat === "coleccion"
              ? `Gran Colección (${photo.pricing?.dimensions.coleccion ?? "70 × 100 cm"})`
              : `Galería (${photo.pricing?.dimensions.galeria ?? "50 × 70 cm"})`}
          </dd>
        </div>
        <div>
          <dt className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#A39E93]">
            Captura Original
          </dt>
          <dd className="mt-1.5 font-light text-[#EBE7DF]">
            {photo.camera.includes("750D") ? "24,2 MP" : "32,5 MP"} · {photo.focalLength}
          </dd>
        </div>
        {photo.location && (
          <div className="col-span-2">
            <dt className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#A39E93]">
              Ubicación
            </dt>
            <dd className="mt-1.5 font-light text-[#EBE7DF]">
              {photo.location}
              {photo.country && !photo.location.includes(photo.country)
                ? `, ${photo.country}`
                : ""}
            </dd>
          </div>
        )}
        {photo.category === "fauna-naturaleza" &&
          (photo.realLocation || photo.wildlifeCondition) && (
          <div className="col-span-2">
            <dt className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#C5A880]">
              Lugar Real y Condiciones (Fauna / Naturaleza)
            </dt>
            <dd className="mt-1.5 text-xs font-light text-[#EBE7DF] space-y-1">
              {photo.realLocation && (
                <p>
                  <span className="font-mono text-[#A39E93]">Lugar real:</span>{" "}
                  {photo.realLocation}
                </p>
              )}
              {photo.wildlifeCondition && (
                <p>
                  <span className="font-mono text-[#A39E93]">Condiciones:</span>{" "}
                  {photo.wildlifeCondition === "libre"
                    ? "Libre (entorno natural abierto)"
                    : photo.wildlifeCondition === "parque"
                    ? "Parque de naturaleza / reserva controlada"
                    : photo.wildlifeCondition === "centro"
                    ? "Centro de conservación de fauna"
                    : photo.wildlifeCondition}
                </p>
              )}
            </dd>
          </div>
        )}
        {relatedProjects.length > 0 && (
          <div className="col-span-2">
            <dt className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#C5A880]">
              Serie Monográfica
            </dt>
            <dd className="mt-1.5 flex flex-wrap gap-3 font-light text-[#EBE7DF]">
              {relatedProjects.map((project) => (
                <Link
                  key={project.id}
                  href={`/projects/${project.slug}`}
                  className="underline decoration-[#C5A880]/50 underline-offset-4 hover:text-[#C5A880] transition"
                >
                  {project.title} →
                </Link>
              ))}
            </dd>
          </div>
        )}
      </dl>

      <p className="mt-8 max-w-3xl text-base sm:text-lg leading-relaxed text-[#EBE7DF]/80 font-light">
        {photo.description}
      </p>
      </div>
    </header>
  );
}
