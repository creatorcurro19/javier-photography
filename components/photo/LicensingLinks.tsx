import Link from "next/link";
import type { Photo } from "@/types/photo";

type LicensingLinksProps = {
  photo: Photo;
};

export default function LicensingLinks({ photo }: LicensingLinksProps) {
  return (
    <section
      aria-labelledby="licensing-heading"
      className="rounded-lg border border-neutral-800 bg-neutral-950/70 p-8 sm:p-10"
    >
      <span className="text-[11px] font-mono uppercase tracking-[0.35em] text-neutral-400">
        Uso Editorial y Comercial
      </span>
      <h2
        id="licensing-heading"
        className="mt-2 font-serif text-2xl font-light text-neutral-100"
      >
        Licencias de Publicación
      </h2>
      <p className="mt-4 text-sm leading-relaxed text-neutral-300">
        Esta obra está disponible en alta resolución con cesión de derechos para publicaciones editoriales,
        prensa, publicidad, campañas corporativas o proyectos documentales.
      </p>
      <div className="mt-8 flex flex-wrap gap-4">
        <Link
          href={`/contact?motivo=licencia&obra=${encodeURIComponent(photo.title)}`}
          className="inline-flex items-center justify-center border border-neutral-200 bg-neutral-100 px-6 py-3 text-xs uppercase tracking-[0.25em] text-neutral-950 font-medium transition hover:bg-white hover:text-black hover:border-white"
        >
          Solicitar Licencia
        </Link>
        <Link
          href="/licensing"
          className="inline-flex items-center justify-center border border-neutral-700 bg-neutral-900/60 px-6 py-3 text-xs uppercase tracking-[0.25em] text-neutral-200 transition hover:border-neutral-400 hover:text-white"
        >
          Ver Tarifas y Formatos
        </Link>
      </div>
    </section>
  );
}
