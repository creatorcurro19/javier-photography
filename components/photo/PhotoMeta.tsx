import Link from "next/link";
import type { Photo } from "@/types/photo";
import { CATEGORY_METADATA } from "@/types/photo";

type PhotoMetaProps = {
  photo: Photo;
};

export default function PhotoMeta({ photo }: PhotoMetaProps) {
  const categoryInfo = CATEGORY_METADATA[photo.category];

  return (
    <header className="border-b border-neutral-800 pb-10">
      <div className="flex flex-wrap items-center gap-3">
        <Link
          href={`/portfolio/${photo.category}`}
          className="rounded-full border border-neutral-800 bg-neutral-900 px-3.5 py-1 text-xs font-mono uppercase tracking-[0.2em] text-neutral-400 hover:border-neutral-500 hover:text-neutral-200 transition"
        >
          {categoryInfo?.title ?? photo.category}
        </Link>
        <span className="text-xs font-mono text-neutral-600">·</span>
        <span className="text-xs font-mono uppercase tracking-wider text-neutral-400">
          {photo.year}
        </span>
      </div>

      <h1 className="mt-4 font-serif text-4xl font-light text-neutral-100 md:text-5xl lg:text-6xl tracking-tight">
        {photo.title}
      </h1>

      <dl className="mt-8 grid grid-cols-2 gap-6 text-sm sm:grid-cols-4 border-y border-neutral-900 py-6">
        <div>
          <dt className="text-[11px] font-mono uppercase tracking-[0.25em] text-neutral-500">
            Serie
          </dt>
          <dd className="mt-1.5 font-light text-neutral-200">
            {categoryInfo?.title ?? photo.category}
          </dd>
        </div>
        <div>
          <dt className="text-[11px] font-mono uppercase tracking-[0.25em] text-neutral-500">
            Año de Creación
          </dt>
          <dd className="mt-1.5 font-light text-neutral-200">{photo.year}</dd>
        </div>
        <div>
          <dt className="text-[11px] font-mono uppercase tracking-[0.25em] text-neutral-500">
            Disciplina
          </dt>
          <dd className="mt-1.5 font-light text-neutral-200">
            Fotografía de Autor
          </dd>
        </div>
        <div>
          <dt className="text-[11px] font-mono uppercase tracking-[0.25em] text-neutral-500">
            Captura Original
          </dt>
          <dd className="mt-1.5 font-light text-neutral-200">
            32,5 MP (Sensor Dual Pixel)
          </dd>
        </div>
        {photo.location && (
          <div className="col-span-2">
            <dt className="text-[11px] font-mono uppercase tracking-[0.25em] text-neutral-500">
              Ubicación
            </dt>
            <dd className="mt-1.5 font-light text-neutral-200">
              {photo.location}{photo.country ? `, ${photo.country}` : ""}
            </dd>
          </div>
        )}
      </dl>

      <p className="mt-8 max-w-3xl text-base sm:text-lg leading-relaxed text-neutral-300 font-light">
        {photo.description}
      </p>
    </header>
  );
}
