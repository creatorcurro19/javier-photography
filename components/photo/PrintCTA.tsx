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
        Disponible en impresión giclée de conservación sobre papel 100% algodón (Hahnemühle Photo Rag® 308 g/m²).
        Cada tirada se inspecciona individualmente y se acompaña de certificado de autenticidad firmado.
      </p>

      {/* Sello de Certificación Museística */}
      <div className="mt-6 rounded-md border border-[#1D2021] bg-[#101112]/80 p-4 text-xs">
        <div className="flex items-center justify-between border-b border-[#1D2021] pb-2.5 text-[10px] uppercase tracking-[0.25em] text-[#95836B]">
          <span>Certificación de Obra Gráfica</span>
          <span>Norma ISO 9706</span>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-3 text-[11px] text-[#D8D5CD]/85">
          <div>
            <span className="block text-[10px] uppercase tracking-wider text-[#95836B]">Soporte:</span>
            Hahnemühle Photo Rag® 308g
          </div>
          <div>
            <span className="block text-[10px] uppercase tracking-wider text-[#95836B]">Tintas:</span>
            Pigmento Mineral 12 Tintas
          </div>
          <div>
            <span className="block text-[10px] uppercase tracking-wider text-[#95836B]">Margen:</span>
            5 cm blanco de conservación
          </div>
          <div>
            <span className="block text-[10px] uppercase tracking-wider text-[#95836B]">Autenticidad:</span>
            Firma manuscrita y holograma
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href={`/contact?motivo=print&obra=${encodeURIComponent(photo.title)}`}
          className="inline-flex items-center justify-center border border-[#D8D5CD] bg-[#D8D5CD] px-6 py-3 text-xs uppercase tracking-[0.25em] text-[#101112] font-semibold transition hover:bg-transparent hover:text-white"
        >
          Solicitar Copia Directa
        </Link>
        <a
          href="https://www.saatchiart.com/javier-espinosa-photography"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center border border-[#95836B]/60 bg-[#1D2021]/60 px-5 py-3 text-xs uppercase tracking-[0.22em] text-[#D8D5CD] transition hover:border-[#D8D5CD] hover:text-white"
        >
          Adquirir en Saatchi Art ↗
        </a>
        <Link
          href="/prints"
          className="inline-flex items-center justify-center border border-[#1D2021] bg-[#1D2021]/60 px-5 py-3 text-xs uppercase tracking-[0.22em] text-[#D8D5CD] transition hover:border-[#95836B] hover:text-white"
        >
          Ver Formatos
        </Link>
      </div>
    </section>
  );
}
