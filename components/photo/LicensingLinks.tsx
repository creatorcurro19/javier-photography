import Link from "next/link";
import { SITE_CONFIG } from "@/data/site-config";
import type { Photo } from "@/types/photo";

type LicensingLinksProps = {
  photo: Photo;
};

export default function LicensingLinks({ photo }: LicensingLinksProps) {
  return (
    <section
      aria-labelledby="licensing-heading"
      className="rounded-lg border border-[#202226] bg-[#202226]/30 p-8 sm:p-10"
    >
      <span className="text-[11px] font-mono uppercase tracking-[0.35em] text-[#8E8A80]">
        Uso Editorial y Comercial
      </span>
      <h2
        id="licensing-heading"
        className="mt-2 font-serif text-2xl font-light text-[#EBE7DF]"
      >
        Licencias de Publicación
      </h2>
      <p className="mt-4 text-sm leading-relaxed text-[#EBE7DF]/80 font-light">
        Esta obra está disponible en alta resolución con cesión de derechos para publicaciones editoriales,
        prensa, publicidad, campañas corporativas o proyectos documentales.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <a
          href={SITE_CONFIG.social.getty}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center border border-[#EBE7DF] bg-[#EBE7DF] px-6 py-3 text-xs uppercase tracking-[0.22em] text-[#0B0C0E] font-semibold transition hover:bg-transparent hover:text-white"
        >
          Licenciar en Getty / iStock ↗
        </a>
        <Link
          href={`/contact?motivo=licencia&obra=${encodeURIComponent(photo.title)}`}
          className="inline-flex items-center justify-center border border-[#8E8A80]/60 bg-[#202226]/60 px-5 py-3 text-xs uppercase tracking-[0.22em] text-[#EBE7DF] transition hover:border-[#EBE7DF] hover:text-white"
        >
          Cesión Directa de Autor
        </Link>
        <Link
          href="/licensing"
          className="inline-flex items-center justify-center border border-[#202226] bg-[#202226]/60 px-5 py-3 text-xs uppercase tracking-[0.22em] text-[#EBE7DF] transition hover:border-[#8E8A80] hover:text-white"
        >
          Tarifas
        </Link>
      </div>
    </section>
  );
}
