import Link from "next/link";
import type { Photo } from "@/types/photo";
import { CATEGORY_METADATA } from "@/types/photo";

type PhotoMetaProps = {
  photo: Photo;
};

export default function PhotoMeta({ photo }: PhotoMetaProps) {
  const categoryInfo = CATEGORY_METADATA[photo.category];

  return (
    <header className="border-b border-[#1D2021] pb-10">
      <div className="flex flex-wrap items-center gap-3">
        <Link
          href={`/portfolio/${photo.category}`}
          className="rounded-full border border-[#1D2021] bg-[#1D2021]/50 px-3.5 py-1 text-xs font-mono uppercase tracking-[0.2em] text-[#95836B] hover:border-[#95836B]/60 hover:text-[#D8D5CD] transition"
        >
          {categoryInfo?.title ?? photo.category}
        </Link>
        <span className="text-xs font-mono text-neutral-600">·</span>
        <span className="text-xs font-mono uppercase tracking-wider text-[#95836B]">
          {photo.year}
        </span>
      </div>

      <h1 className="mt-4 font-serif text-4xl font-light text-[#D8D5CD] md:text-5xl lg:text-6xl tracking-tight">
        {photo.title}
      </h1>

      <dl className="mt-8 grid grid-cols-2 gap-6 text-sm sm:grid-cols-4 border-y border-[#1D2021] py-6">
        <div>
          <dt className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#95836B]">
            Serie
          </dt>
          <dd className="mt-1.5 font-light text-[#D8D5CD]">
            {categoryInfo?.title ?? photo.category}
          </dd>
        </div>
        <div>
          <dt className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#95836B]">
            Año de Creación
          </dt>
          <dd className="mt-1.5 font-light text-[#D8D5CD]">{photo.year}</dd>
        </div>
        <div>
          <dt className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#95836B]">
            Disciplina
          </dt>
          <dd className="mt-1.5 font-light text-[#D8D5CD]">
            Fotografía de Autor
          </dd>
        </div>
        <div>
          <dt className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#95836B]">
            Captura Original
          </dt>
          <dd className="mt-1.5 font-light text-[#D8D5CD]">
            32,5 MP (Sensor Dual Pixel)
          </dd>
        </div>
        {photo.location && (
          <div className="col-span-2">
            <dt className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#95836B]">
              Ubicación
            </dt>
            <dd className="mt-1.5 font-light text-[#D8D5CD]">
              {photo.location}{photo.country ? `, ${photo.country}` : ""}
            </dd>
          </div>
        )}
      </dl>

      <p className="mt-8 max-w-3xl text-base sm:text-lg leading-relaxed text-[#D8D5CD]/80 font-light">
        {photo.description}
      </p>
    </header>
  );
}
