"use client";

import Container from "@/components/ui/Container";
import { AndalusianStarMark } from "@/components/ui/AndalusianMotif";
import { socialProofItems } from "@/data/social-proof";
import { useLanguage } from "@/lib/i18n";

export default function SocialProofSection() {
  const { lang, t } = useLanguage();

  // Si no hay datos reales verificados, la sección NO se renderiza
  if (!socialProofItems || socialProofItems.length === 0) {
    return null;
  }

  return (
    <section
      aria-label={t("Prueba social y menciones", "Social proof and features")}
      className="relative border-b border-[#C5A880]/15 bg-[#0E1012] py-16"
    >
      <Container>
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.35em] text-[#C5A880]">
            <AndalusianStarMark className="h-3 w-3 text-[#C5A880]" />
            <span>{t("Publicaciones & Coleccionistas", "Features & Collectors")}</span>
          </div>
          <h2 className="mt-2 font-serif text-2xl font-light text-[#EBE7DF]">
            {t("Reconocimiento y Presencia", "Recognition & Presence")}
          </h2>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {socialProofItems.map((item) => (
            <div
              key={item.id}
              className="flex flex-col justify-between rounded-xl border border-white/[0.08] bg-[#15171A] p-6"
            >
              {item.quote && (
                <p className="font-serif italic text-sm text-[#EBE7DF] leading-relaxed">
                  &ldquo;{lang === "en" && item.quoteEn ? item.quoteEn : item.quote}&rdquo;
                </p>
              )}
              <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs">
                <div>
                  <p className="font-sans font-medium text-[#EBE7DF]">{item.name}</p>
                  {item.roleOrOutlet && (
                    <p className="font-mono text-[10px] text-[#8E8A80]">{item.roleOrOutlet}</p>
                  )}
                </div>
                {item.url && (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-[10px] uppercase tracking-wider text-[#C5A880] hover:underline"
                  >
                    Ver ↗
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
