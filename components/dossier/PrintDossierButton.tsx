"use client";

import { useLanguage } from "@/lib/i18n";

export default function PrintDossierButton() {
  const { t } = useLanguage();

  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex items-center gap-2.5 border border-[#EBE7DF] bg-[#EBE7DF] px-7 py-3 font-mono text-[11px] uppercase tracking-[0.26em] font-medium text-[#0B0C0E] transition hover:bg-transparent hover:text-white print:hidden"
    >
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.6}
          d="M12 16v-8m0 8l-3-3m3 3l3-3M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2"
        />
      </svg>
      <span>{t("Descargar Dossier en PDF (A4)", "Download Dossier PDF (A4)")}</span>
    </button>
  );
}
