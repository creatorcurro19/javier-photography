"use client";

import { useEffect } from "react";
import Link from "next/link";
import Container from "@/components/ui/Container";
import { AndalusianStarMark } from "@/components/ui/AndalusianMotif";
import { useLanguage } from "@/lib/i18n";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { t } = useLanguage();

  useEffect(() => {
    console.error("[app:error]", error);
  }, [error]);

  return (
    <div className="flex min-h-[85vh] items-center justify-center bg-[#0B0C0E] pt-24 pb-20 text-[#EBE7DF]">
      <Container className="max-w-2xl text-center">
        <div className="inline-flex items-center gap-2.5">
          <AndalusianStarMark className="h-3.5 w-3.5 text-[#C5A880]" />
          <p className="font-mono text-xs uppercase tracking-[0.4em] text-[#C5A880]">
            {t(
              "Interrupción Temporal · Sala de Exposición",
              "Temporary Interruption · Exhibition Gallery"
            )}
          </p>
          <AndalusianStarMark className="h-3.5 w-3.5 text-[#C5A880]" />
        </div>

        <h1 className="mt-4 font-serif text-4xl font-light tracking-wide text-[#EBE7DF] sm:text-5xl">
          {t(
            "No se pudo revelar este fotograma",
            "Unable to load this frame"
          )}
        </h1>

        <p className="mt-6 text-base font-light leading-relaxed text-[#8E8A80]">
          {t(
            "Ha ocurrido un problema momentáneo al cargar la vista. Puedes volver a intentarlo o regresar al catálogo principal de obras.",
            "A temporary issue occurred while loading this view. You can try again or return to the main archive."
          )}
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => reset()}
            className="border border-[#EBE7DF] bg-[#EBE7DF] px-8 py-3.5 font-mono text-xs uppercase tracking-[0.28em] font-medium text-[#0B0C0E] transition hover:bg-transparent hover:text-white"
          >
            {t("Reintentar carga", "Retry")}
          </button>
          <Link
            href="/portfolio"
            className="border border-white/15 bg-[#151618] px-8 py-3.5 font-mono text-xs uppercase tracking-[0.28em] text-[#EBE7DF] transition hover:border-[#C5A880] hover:text-white"
          >
            {t("Ir al Archivo Completo", "Go to Full Archive")}
          </Link>
        </div>
      </Container>
    </div>
  );
}
