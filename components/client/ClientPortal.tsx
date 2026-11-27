"use client";

import { useState } from "react";
import Image from "next/image";
import type { UnlockedClientGallery } from "@/types/client-gallery";
import {
  AndalusianCenefa,
  AndalusianCornerOrnaments,
  AndalusianStarMark,
} from "@/components/ui/AndalusianMotif";
import LightboxModal from "@/components/ui/LightboxModal";
import { SITE_CONFIG } from "@/data/site-config";
import { trackEvent } from "@/lib/analytics";
import { useLanguage } from "@/lib/i18n";
import { getLocalizedPhoto } from "@/lib/i18n-works";

interface ClientPortalProps {
  initialCode?: string;
}

const DEMO_EN = {
  clientName: "Historic Rally Team · Sample Room",
  projectTitle: "Special Stage & Service Park Coverage",
  date: "2026 Season",
  location: "Tenerife · Canary Islands",
  note: "Private high-resolution selection for team review. Mark your preferred frames and press \"Submit Selection\" to receive calibrated master files (16-bit TIFF / 300 DPI JPEG).",
};

export default function ClientPortal({ initialCode = "" }: ClientPortalProps) {
  const { lang, t } = useLanguage();
  const [codeInput, setCodeInput] = useState(initialCode);
  const [unlocked, setUnlocked] = useState<UnlockedClientGallery | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState("");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [clientEmail, setClientEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [sentOk, setSentOk] = useState(false);
  const [sendError, setSendError] = useState("");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const unlockWithCode = async (rawCode: string) => {
    const code = rawCode.trim();
    if (!code) return;
    setError("");
    setVerifying(true);
    try {
      const res = await fetch("/api/client-gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.ok || !data?.gallery) {
        setError(
          data?.error ??
            t(
              "Clave no reconocida. Verifica el código proporcionado por el estudio (o prueba «DEMO» para ver una muestra).",
              "Access code not recognized. Verify the studio code (or try \"DEMO\" to preview a sample)."
            )
        );
        return;
      }
      setUnlocked(data.gallery as UnlockedClientGallery);
      setFavorites([]);
      setSentOk(false);
      setSendError("");
      trackEvent("portal_cliente_acceso", { codigo: data.gallery.code });
    } catch {
      setError(
        t(
          "Error de conexión verificando la clave. Inténtalo de nuevo.",
          "Connection error while verifying the code. Please try again."
        )
      );
    } finally {
      setVerifying(false);
    }
  };

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    await unlockWithCode(codeInput);
  };

  const toggleFavorite = (photoId: string) => {
    setFavorites((prev) =>
      prev.includes(photoId)
        ? prev.filter((id) => id !== photoId)
        : [...prev, photoId]
    );
  };

  const handleSendSelection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!unlocked || favorites.length === 0) return;
    setSending(true);
    setSendError("");

    const galleryPhotos = unlocked.photos;
    const selectedTitles = galleryPhotos
      .filter((p) => favorites.includes(p.id))
      .map((p, idx) => `${idx + 1}. ${p.title} (${p.slug})`)
      .join("\n");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: unlocked.clientName,
          email: clientEmail.trim(),
          motivo: "Selección Galería Privada",
          referencia: `${unlocked.projectTitle} [${unlocked.code}]`,
          mensaje: `Selección final de ${favorites.length} fotografías desde el Portal de Clientes:\n\n${selectedTitles}`,
        }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.ok) {
        setSendError(
          data?.error ??
            t(
              `No se pudo enviar automáticamente. Escríbenos a ${SITE_CONFIG.contactEmail} con tu selección.`,
              `Could not send automatically. Email ${SITE_CONFIG.contactEmail} with your selection.`
            )
        );
        return;
      }
      trackEvent("portal_cliente_seleccion", {
        codigo: unlocked.code,
        cantidad: favorites.length,
      });
      setSentOk(true);
    } catch {
      setSendError(
        t(
          "Error de red al enviar la selección. Inténtalo de nuevo.",
          "Network error sending your selection. Please try again."
        )
      );
    } finally {
      setSending(false);
    }
  };

  if (!unlocked) {
    return (
      <div className="mx-auto max-w-xl">
        <div className="relative border border-[#C5A880]/30 bg-[#151618]/95 p-8 sm:p-12 shadow-[0_30px_90px_rgba(0,0,0,0.75)]">
          <AndalusianCornerOrnaments className="text-[#C5A880]/60" />

          <div className="flex flex-col items-center text-center">
            <Image
              src="/icon.svg"
              alt={t("Sello JE", "JE Monogram")}
              width={52}
              height={52}
              className="h-12 w-12 rounded-xl ring-1 ring-[#C5A880]/40"
            />
            <div className="mt-5 flex items-center gap-2">
              <AndalusianStarMark className="h-3 w-3 text-[#C5A880]" />
              <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-[#C5A880]">
                {t("Sala Privada de Entrega", "Private Client Delivery Room")}
              </p>
              <AndalusianStarMark className="h-3 w-3 text-[#C5A880]" />
            </div>

            <h1 className="mt-3 font-serif text-3xl sm:text-4xl font-light text-[#F7F4EE]">
              {t("Acceso Clientes", "Client Access")}
            </h1>
            <p className="mt-3 text-sm font-light leading-relaxed text-[#8E8A80]">
              {t(
                "Introduce la clave facilitada por Javier Espinosa para revisar tu reportaje privado, marcar tus fotografías favoritas y solicitar los archivos máster.",
                "Enter the access code provided by Javier Espinosa to review your private shoot gallery, mark favorites, and request master files."
              )}
            </p>
          </div>

          <form onSubmit={handleUnlock} className="mt-8 space-y-4">
            <div>
              <label
                htmlFor="client-code"
                className="block font-mono text-[10px] uppercase tracking-[0.25em] text-[#8E8A80] mb-2"
              >
                {t("Clave de Galería Privada", "Private Gallery Access Code")}
              </label>
              <input
                id="client-code"
                type="text"
                value={codeInput}
                onChange={(e) => setCodeInput(e.target.value)}
                placeholder={t("Ej. RALLY2026 o DEMO", "e.g. RALLY2026 or DEMO")}
                className="w-full border border-white/[0.12] bg-[#0B0C0E] px-4 py-3 font-mono text-sm uppercase tracking-[0.25em] text-[#F7F4EE] placeholder-[#8E8A80]/50 focus:border-[#C5A880] focus:outline-none"
                required
              />
            </div>

            {error && (
              <p className="border border-red-500/30 bg-red-950/20 px-4 py-2.5 text-xs text-red-200">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={verifying}
              className="w-full border border-[#EBE7DF] bg-[#EBE7DF] py-3.5 font-mono text-xs uppercase tracking-[0.28em] font-medium text-[#0B0C0E] transition hover:bg-transparent hover:text-white disabled:opacity-50"
            >
              {verifying
                ? t("Verificando clave...", "Verifying code...")
                : t("Desbloquear Sala Privada →", "Unlock Private Room →")}
            </button>

            <div className="pt-3 text-center">
              <button
                type="button"
                disabled={verifying}
                onClick={() => {
                  setCodeInput("DEMO");
                  void unlockWithCode("DEMO");
                }}
                className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#C5A880]/85 underline underline-offset-4 hover:text-[#EBE7DF] disabled:opacity-50"
              >
                {t("Ver galería de demostración (DEMO)", "Preview sample gallery (DEMO)")}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  const galleryPhotos = unlocked.photos;
  const isDemoEn = lang === "en" && unlocked.code === "RALLY2026";
  const projectTitle = isDemoEn ? DEMO_EN.projectTitle : unlocked.projectTitle;
  const clientName = isDemoEn ? DEMO_EN.clientName : unlocked.clientName;
  const galleryLocation = isDemoEn ? DEMO_EN.location : unlocked.location;
  const galleryDate = isDemoEn ? DEMO_EN.date : unlocked.date;
  const galleryNote = isDemoEn ? DEMO_EN.note : unlocked.note;

  return (
    <div>
      {/* Cabecera de sala desbloqueada */}
      <div className="flex flex-col justify-between gap-6 border-b border-[#C5A880]/20 pb-8 md:flex-row md:items-end">
        <div>
          <div className="flex items-center gap-2.5">
            <AndalusianStarMark className="h-3.5 w-3.5 text-[#C5A880]" />
            <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-[#C5A880]">
              {t(`Entrega Privada · Clave ${unlocked.code}`, `Private Delivery · Code ${unlocked.code}`)}
            </p>
          </div>
          <h1 className="mt-3 font-serif text-3xl sm:text-5xl font-light text-[#F7F4EE]">
            {projectTitle}
          </h1>
          <p className="mt-2 font-mono text-xs uppercase tracking-[0.2em] text-[#8E8A80]">
            {clientName} · {galleryLocation} · {galleryDate}
          </p>
          <p className="mt-4 max-w-2xl text-sm font-light leading-relaxed text-[#8E8A80]">
            {galleryNote}
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setUnlocked(null);
            setCodeInput("");
          }}
          className="self-start border border-white/15 bg-[#151618] px-4 py-2 font-mono text-[10px] uppercase tracking-[0.24em] text-[#8E8A80] transition hover:border-[#C5A880] hover:text-white"
        >
          {t("Salir de la Sala", "Exit Gallery")}
        </button>
      </div>

      <AndalusianCenefa variant="estrella" className="my-8 text-[#C5A880]/36" />

      {/* Cuadrícula de selección del cliente */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {galleryPhotos.map((rawPhoto, idx) => {
          const photo = getLocalizedPhoto(rawPhoto, lang);
          const isFav = favorites.includes(photo.id);
          return (
            <div
              key={photo.id}
              className={`group overflow-hidden border bg-[#151618] transition ${
                isFav
                  ? "border-[#C5A880] shadow-[0_0_30px_rgba(197,168,128,0.18)]"
                  : "border-white/[0.08] hover:border-white/30"
              }`}
            >
              <div
                role="button"
                tabIndex={0}
                onClick={() => {
                  setLightboxIndex(idx);
                  setLightboxOpen(true);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setLightboxIndex(idx);
                    setLightboxOpen(true);
                  }
                }}
                className="relative aspect-[4/3] w-full cursor-pointer overflow-hidden bg-[#0B0C0E]"
              >
                <Image
                  src={photo.image}
                  alt={photo.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition duration-500 group-hover:scale-[1.03]"
                />
                {isFav && (
                  <span className="absolute top-3 right-3 border border-[#C5A880] bg-[#0B0C0E]/90 px-2.5 py-1 font-mono text-[9px] uppercase tracking-widest text-[#C5A880]">
                    {t("★ Seleccionada", "★ Selected")}
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between gap-3 border-t border-white/[0.06] px-4 py-3.5">
                <div className="min-w-0">
                  <p className="truncate font-serif text-base font-light text-[#F7F4EE]">
                    {photo.title}
                  </p>
                  <p className="font-mono text-[10px] text-[#8E8A80]">
                    {photo.camera} · {photo.focalLength}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => toggleFavorite(photo.id)}
                  className={`shrink-0 border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] transition ${
                    isFav
                      ? "border-[#C5A880] bg-[#C5A880] text-[#0B0C0E] font-medium"
                      : "border-white/15 bg-[#0B0C0E] text-[#EBE7DF] hover:border-[#C5A880]"
                  }`}
                >
                  {isFav ? t("✓ Elegida", "✓ Chosen") : t("+ Elegir", "+ Select")}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Barra de envío de selección final */}
      <div className="relative mt-14 border border-[#C5A880]/30 bg-[#151618] p-6 sm:p-10">
        <AndalusianCornerOrnaments className="text-[#C5A880]/50" />
        {sentOk ? (
          <div className="text-center py-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-[#C5A880]">
              {t("Selección Recibida", "Selection Received")}
            </p>
            <h2 className="mt-2 font-serif text-2xl font-light text-[#F7F4EE]">
              {t(
                `Hemos enviado tus ${favorites.length} fotografías elegidas al estudio`,
                `Your ${favorites.length} selected photographs have been sent to the studio`
              )}
            </h2>
            <p className="mt-2 text-xs text-[#8E8A80]">
              {t(
                "Javier preparará los archivos máster calibrados y te enviará el enlace de descarga directa.",
                "Javier will prepare your calibrated master files and send you a direct download link."
              )}
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSendSelection}
            className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between"
          >
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#C5A880]">
                {t(
                  `Resumen de Selección (${favorites.length} / ${unlocked.maxSelection})`,
                  `Selection Summary (${favorites.length} / ${unlocked.maxSelection})`
                )}
              </p>
              <h2 className="mt-1.5 font-serif text-2xl font-light text-[#F7F4EE]">
                {t("Enviar selección final al fotógrafo", "Submit final selection to photographer")}
              </h2>
              <p className="mt-1 text-xs font-light text-[#8E8A80]">
                {t(
                  "Marca las obras que deseas recibir en máxima resolución y confirma tu correo.",
                  "Mark the frames you wish to receive in full resolution and confirm your email."
                )}
              </p>
              {sendError && (
                <p className="mt-2 text-xs text-red-300 font-mono">{sendError}</p>
              )}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <input
                type="email"
                required
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                placeholder={t("Tu correo electrónico...", "Your email address...")}
                className="border border-white/15 bg-[#0B0C0E] px-4 py-3 font-mono text-xs text-[#F7F4EE] placeholder-[#8E8A80]/60 focus:border-[#C5A880] focus:outline-none sm:w-64"
              />
              <button
                type="submit"
                disabled={favorites.length === 0 || sending}
                className="border border-[#EBE7DF] bg-[#EBE7DF] px-6 py-3 font-mono text-[10px] uppercase tracking-[0.25em] font-medium text-[#0B0C0E] transition hover:bg-transparent hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {sending
                  ? t("Enviando...", "Submitting...")
                  : t(`Enviar Selección (${favorites.length}) →`, `Submit Selection (${favorites.length}) →`)}
              </button>
            </div>
          </form>
        )}
      </div>

      <LightboxModal
        photos={galleryPhotos}
        currentIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onNavigate={setLightboxIndex}
      />
    </div>
  );
}
