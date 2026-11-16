import Link from "next/link";
import type { Photo } from "@/types/photo";

type PrintCTAProps = {
  photo: Photo;
};

export default function PrintCTA({ photo }: PrintCTAProps) {
  if (!photo.prints) {
    return null;
  }

  return (
    <section
      aria-labelledby="print-heading"
      className="rounded-lg border border-neutral-800 bg-neutral-950/70 p-8 sm:p-10"
    >
      <span className="text-[11px] font-mono uppercase tracking-[0.35em] text-neutral-400">
        Edición de Autor
      </span>
      <h2
        id="print-heading"
        className="mt-2 font-serif text-2xl font-light text-neutral-100"
      >
        Copia Fine Art en Papel de Museo
      </h2>
      <p className="mt-4 text-sm leading-relaxed text-neutral-300">
        Disponible en impresión giclée de conservación sobre papel 100% algodón (Hahnemühle Photo Rag).
        Cada tirada se inspecciona individualmente y se acompaña de certificado de autenticidad firmado.
      </p>
      <div className="mt-8 flex flex-wrap gap-4">
        <Link
          href={`/contact?motivo=print&obra=${encodeURIComponent(photo.title)}`}
          className="inline-flex items-center justify-center border border-neutral-200 bg-neutral-100 px-6 py-3 text-xs uppercase tracking-[0.25em] text-neutral-950 font-medium transition hover:bg-white hover:text-black hover:border-white"
        >
          Solicitar Copia Fine Art
        </Link>
        <Link
          href="/prints"
          className="inline-flex items-center justify-center border border-neutral-700 bg-neutral-900/60 px-6 py-3 text-xs uppercase tracking-[0.25em] text-neutral-200 transition hover:border-neutral-400 hover:text-white"
        >
          Ver Formatos y Papeles
        </Link>
      </div>
    </section>
  );
}
