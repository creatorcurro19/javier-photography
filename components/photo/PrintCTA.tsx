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
      className="rounded-lg border border-[#1D2021] bg-[#1D2021]/30 p-8 sm:p-10"
    >
      <span className="text-[11px] font-mono uppercase tracking-[0.35em] text-[#95836B]">
        Edición de Autor
      </span>
      <h2
        id="print-heading"
        className="mt-2 font-serif text-2xl font-light text-[#D8D5CD]"
      >
        Copia Fine Art en Papel de Museo
      </h2>
      <p className="mt-4 text-sm leading-relaxed text-[#D8D5CD]/80 font-light">
        Disponible en impresión giclée de conservación sobre papel 100% algodón (Hahnemühle Photo Rag).
        Cada tirada se inspecciona individualmente y se acompaña de certificado de autenticidad firmado.
      </p>
      <div className="mt-8 flex flex-wrap gap-4">
        <Link
          href={`/contact?motivo=print&obra=${encodeURIComponent(photo.title)}`}
          className="inline-flex items-center justify-center border border-[#D8D5CD] bg-[#D8D5CD] px-6 py-3 text-xs uppercase tracking-[0.25em] text-[#101112] font-semibold transition hover:bg-transparent hover:text-white"
        >
          Solicitar Copia Fine Art
        </Link>
        <Link
          href="/prints"
          className="inline-flex items-center justify-center border border-[#1D2021] bg-[#1D2021]/60 px-6 py-3 text-xs uppercase tracking-[0.25em] text-[#D8D5CD] transition hover:border-[#95836B] hover:text-white"
        >
          Ver Formatos y Papeles
        </Link>
      </div>
    </section>
  );
}
