"use client";

import Container from "@/components/ui/Container";
import { AndalusianStarMark } from "@/components/ui/AndalusianMotif";
import { socialProofItems } from "@/data/social-proof";
import { useLanguage } from "@/lib/i18n";

const PENDING_PROOF_SLOTS = [
  {
    id: "testimonios",
    category: "Testimonios de Coleccionistas y Clientes",
    placeholder: "{{DATO_PENDIENTE: TESTIMONIOS REALES DE COLECCIONISTAS, INTERIORISTAS O EQUIPOS}}",
    detail: "Espacio reservado para citas reales verificadas (sin testimonios inventados).",
  },
  {
    id: "logos",
    category: "Clientes, Escuderías y Estudios Colaboradores",
    placeholder: "{{DATO_PENDIENTE: LOGOS / NOMBRES DE CLIENTES, ESTUDIOS DE ARQUITECTURA O ESCUDERÍAS}}",
    detail: "Espacio reservado para logotipos o referencias autorizadas por clientes reales.",
  },
  {
    id: "publicaciones",
    category: "Publicaciones, Exposiciones y Menciones",
    placeholder: "{{DATO_PENDIENTE: PUBLICACIONES EDITORIALES, CATÁLOGOS Y EXPOSICIONES}}",
    detail: "Perfiles verificados activos: Saatchi Art · Getty Images / iStock · @Javier.espinosa19.",
  },
];

export default function SocialProofSection() {
  const { lang, t } = useLanguage();
  const hasRealItems = socialProofItems && socialProofItems.length > 0;

  if (!hasRealItems) {
    return null;
  }

  return (
    <section
      aria-label={t("Prueba social y menciones", "Social proof and features")}
      className="relative border-t border-b border-[#C5A880]/15 bg-[#0E1012] py-20"
    >
      <Container>
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.35em] text-[#C5A880]">
            <AndalusianStarMark className="h-3 w-3 text-[#C5A880]" />
            <span>{t("Trayectoria, Clientes y Publicaciones", "Track Record, Clients & Publications")}</span>
          </div>
          <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-light text-[#EBE7DF]">
            {t("Prueba Social y Presencia Editorial", "Social Proof & Editorial Presence")}
          </h2>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {hasRealItems
            ? socialProofItems.map((item) => (
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
                        <p className="font-mono text-[10px] text-[#A39E93]">{item.roleOrOutlet}</p>
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
              ))
            : PENDING_PROOF_SLOTS.map((slot) => (
                <div
                  key={slot.id}
                  className="flex flex-col justify-between border border-white/[0.08] bg-[#151618] p-6"
                >
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#C5A880]">
                      {slot.category}
                    </p>
                    <p className="mt-3 font-mono text-xs text-[#EBE7DF] leading-relaxed">
                      {slot.placeholder}
                    </p>
                  </div>
                  <p className="mt-4 border-t border-white/[0.06] pt-3 text-xs font-light text-[#A39E93]">
                    {slot.detail}
                  </p>
                </div>
              ))}
        </div>
      </Container>
    </section>
  );
}
