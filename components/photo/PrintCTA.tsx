import Link from "next/link";
import CertificateOfAuthenticityModal from "@/components/prints/CertificateOfAuthenticityModal";
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
      className="rounded-lg border border-[#202226] bg-[#202226]/30 p-8 sm:p-10"
    >
      <span className="text-[11px] font-mono uppercase tracking-[0.35em] text-[#8E8A80]">
        Edición de Autor
      </span>
      <h2
        id="print-heading"
        className="mt-2 font-serif text-2xl font-light text-[#EBE7DF]"
      >
        Copia Fine Art en Papel de Museo
      </h2>
      <p className="mt-4 text-sm leading-relaxed text-[#EBE7DF]/80 font-light">
        Disponible en impresión giclée de conservación sobre papel 100% algodón (Hahnemühle Photo Rag® 308 g/m²).
        Cada tirada se inspecciona individualmente y se acompaña de certificado de autenticidad firmado.
      </p>

      {/* Sello de Certificación Museística */}
      <div className="mt-6 rounded-md border border-[#202226] bg-[#0B0C0E]/80 p-4 text-xs">
        <div className="flex items-center justify-between border-b border-[#202226] pb-2.5 text-[10px] uppercase tracking-[0.25em] text-[#8E8A80]">
          <span>Certificación de Obra Gráfica</span>
          <span>Norma ISO 9706</span>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-3 text-[11px] text-[#EBE7DF]/85">
          <div>
            <span className="block text-[10px] uppercase tracking-wider text-[#8E8A80]">Soporte:</span>
            Hahnemühle Photo Rag® 308g
          </div>
          <div>
            <span className="block text-[10px] uppercase tracking-wider text-[#8E8A80]">Tintas:</span>
            Pigmento Mineral 12 Tintas
          </div>
          <div>
            <span className="block text-[10px] uppercase tracking-wider text-[#8E8A80]">Margen:</span>
            5 cm blanco de conservación
          </div>
          <div>
            <span className="block text-[10px] uppercase tracking-wider text-[#8E8A80]">Autenticidad:</span>
            Firma manuscrita y holograma
          </div>
          <div className="col-span-2 border-t border-[#202226] pt-2.5 flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-wider text-[#8E8A80]">Tarifa Orientativa:</span>
            <span className="font-serif text-sm text-[#EBE7DF]">Ediciones firmadas desde 240 € (30×45 cm) a 890 € (70×100 cm)</span>
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href={`/contact?motivo=print&obra=${encodeURIComponent(photo.title)}`}
          className="inline-flex items-center justify-center border border-[#EBE7DF] bg-[#EBE7DF] px-6 py-3 text-xs uppercase tracking-[0.25em] text-[#0B0C0E] font-semibold transition hover:bg-transparent hover:text-white"
        >
          Solicitar Copia Directa
        </Link>
        <a
          href="https://www.saatchiart.com/javier-espinosa-photography"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center border border-[#8E8A80]/60 bg-[#202226]/60 px-5 py-3 text-xs uppercase tracking-[0.22em] text-[#EBE7DF] transition hover:border-[#EBE7DF] hover:text-white"
        >
          Adquirir en Saatchi Art ↗
        </a>
        <Link
          href="/prints"
          className="inline-flex items-center justify-center border border-[#202226] bg-[#202226]/60 px-5 py-3 text-xs uppercase tracking-[0.22em] text-[#EBE7DF] transition hover:border-[#8E8A80] hover:text-white"
        >
          Ver Formatos
        </Link>
        <CertificateOfAuthenticityModal photo={photo} />
      </div>
    </section>
  );
}
