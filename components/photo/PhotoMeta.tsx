import Link from "next/link";
import type { Photo } from "@/types/photo";
import { CATEGORY_METADATA } from "@/types/photo";
import { getProjectsForPhoto } from "@/lib/photos";
import FavoriteButton from "@/components/photo/FavoriteButton";

type PhotoMetaProps = {
  photo: Photo;
};

export default function PhotoMeta({ photo }: PhotoMetaProps) {
  const categoryInfo = CATEGORY_METADATA[photo.category];
  const relatedProjects = getProjectsForPhoto(photo.id);

  return (
    <header className="border-b border-[#202226] pb-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href={`/portfolio/${photo.category}`}
            className="rounded-full border border-[#202226] bg-[#202226]/50 px-3.5 py-1 text-xs font-mono uppercase tracking-[0.2em] text-[#8E8A80] hover:border-[#8E8A80]/60 hover:text-[#EBE7DF] transition"
          >
            {categoryInfo?.title ?? photo.category} · {categoryInfo?.codeEn}
          </Link>
          <span className="text-xs font-mono text-neutral-600">·</span>
          <span className="text-xs font-mono uppercase tracking-wider text-[#8E8A80]">
            {photo.year}
          </span>
        </div>

        <FavoriteButton title={photo.title} />
      </div>

      <h1 className="mt-4 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light tracking-tight text-[#EBE7DF] leading-[1.12]">
        {photo.title}
      </h1>

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
          <dt className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#8E8A80]">
            Disciplina
          </dt>
          <dd className="mt-1.5 font-light text-[#EBE7DF]">
            {categoryInfo?.titleEn ?? "Fine Art Photography"}
          </dd>
        </div>
        <div>
          <dt className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#8E8A80]">
            Captura Original
          </dt>
          <dd className="mt-1.5 font-light text-[#EBE7DF]">
            32,5 MP · {photo.focalLength}
          </dd>
        </div>
        {photo.location && (
          <div className="col-span-2">
            <dt className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#8E8A80]">
              Ubicación / Location
            </dt>
            <dd className="mt-1.5 font-light text-[#EBE7DF]">
              {photo.location}{photo.country ? `, ${photo.country}` : ""}
            </dd>
          </div>
        )}
        {relatedProjects.length > 0 && (
          <div className="col-span-2">
            <dt className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#C5A880]">
              Ensayo Monográfico / Monograph Essay
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
    </header>
  );
}
