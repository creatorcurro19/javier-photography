import Link from "next/link";
import type { Photo } from "@/types/photo";

type LicensingLinksProps = {
  photo: Photo;
};

export default function LicensingLinks({ photo }: LicensingLinksProps) {
  return (
    <section
      aria-labelledby="licensing-heading"
      className="rounded-lg border border-[#1D2021] bg-[#1D2021]/30 p-8 sm:p-10"
    >
      <span className="text-[11px] font-mono uppercase tracking-[0.35em] text-[#95836B]">
        Uso Editorial y Comercial
      </span>
      <h2
        id="licensing-heading"
        className="mt-2 font-serif text-2xl font-light text-[#D8D5CD]"
      >
        Licencias de Publicación
      </h2>
      <p className="mt-4 text-sm leading-relaxed text-[#D8D5CD]/80 font-light">
        Esta obra está disponible en alta resolución con cesión de derechos para publicaciones editoriales,
        prensa, publicidad, campañas corporativas o proyectos documentales.
      </p>
      <div className="mt-8 flex flex-wrap gap-4">
        <Link
          href={`/contact?motivo=licencia&obra=${encodeURIComponent(photo.title)}`}
          className="inline-flex items-center justify-center border border-[#D8D5CD] bg-[#D8D5CD] px-6 py-3 text-xs uppercase tracking-[0.25em] text-[#101112] font-semibold transition hover:bg-transparent hover:text-white"
        >
          Solicitar Licencia
        </Link>
        <Link
          href="/licensing"
          className="inline-flex items-center justify-center border border-[#1D2021] bg-[#1D2021]/60 px-6 py-3 text-xs uppercase tracking-[0.25em] text-[#D8D5CD] transition hover:border-[#95836B] hover:text-white"
        >
          Ver Tarifas y Formatos
        </Link>
      </div>
    </section>
  );
}
