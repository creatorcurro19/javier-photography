"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { findClientGallery, type ClientGallery } from "@/data/client-galleries";
import type { Photo } from "@/types/photo";
import {
  AndalusianCenefa,
  AndalusianCornerOrnaments,
  AndalusianStarMark,
} from "@/components/ui/AndalusianMotif";
import LightboxModal from "@/components/ui/LightboxModal";

interface ClientPortalProps {
  allPhotos: Photo[];
  initialCode?: string;
}

export default function ClientPortal({
  allPhotos,
  initialCode = "",
}: ClientPortalProps) {
  const [codeInput, setCodeInput] = useState(initialCode);
  const [unlocked, setUnlocked] = useState<ClientGallery | null>(() =>
    initialCode ? findClientGallery(initialCode) ?? null : null
  );
  const [error, setError] = useState("");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [clientEmail, setClientEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [sentOk, setSentOk] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const galleryPhotos = useMemo(() => {
    if (!unlocked) return [];
    const bySlug = new Map(allPhotos.map((p) => [p.slug, p]));
    const matched = unlocked.photoSlugs
      .map((slug) => bySlug.get(slug))
      .filter((p): p is Photo => Boolean(p));

    // Fallback gracefully to motorsport photos if specific slugs aren't found
    if (matched.length > 0) return matched;
    return allPhotos
      .filter((p) => p.category === "coches-rally")
      .slice(0, 8);
  }, [allPhotos, unlocked]);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const found = findClientGallery(codeInput);
    if (!found) {
      setError(
        "Clave no reconocida. Verifica el código proporcionado por el estudio (o prueba «DEMO» para ver una muestra)."
      );
      return;
    }
    setUnlocked(found);
    setFavorites([]);
    setSentOk(false);
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

    const selectedTitles = galleryPhotos
      .filter((p) => favorites.includes(p.id))
      .map((p, idx) => `${idx + 1}. ${p.title} (${p.slug})`)
      .join("\n");

    try {
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: unlocked.clientName,
          email: clientEmail.trim() || "cliente@javier-photography.vercel.app",
          motivo: "Selección Galería Privada",
          referencia: `${unlocked.projectTitle} [${unlocked.code}]`,
          mensaje: `Selección final de ${favorites.length} fotografías desde el Portal de Clientes:\n\n${selectedTitles}`,
        }),
      });
      setSentOk(true);
    } catch {
      setSentOk(true);
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
              alt="Sello JE"
              width={52}
              height={52}
              className="h-12 w-12 rounded-xl ring-1 ring-[#C5A880]/40"
            />
            <div className="mt-5 flex items-center gap-2">
              <AndalusianStarMark className="h-3 w-3 text-[#C5A880]" />
              <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-[#C5A880]">
                Sala Privada de Entrega
              </p>
              <AndalusianStarMark className="h-3 w-3 text-[#C5A880]" />
            </div>

            <h1 className="mt-3 font-serif text-3xl sm:text-4xl font-light text-[#F7F4EE]">
              Acceso Clientes
            </h1>
            <p className="mt-3 text-sm font-light leading-relaxed text-[#8E8A80]">
              Introduce la clave facilitada por Javier Espinosa para revisar tu reportaje privado, marcar tus fotografías favoritas y solicitar los archivos máster.
            </p>
          </div>

          <form onSubmit={handleUnlock} className="mt-8 space-y-4">
            <div>
              <label
                htmlFor="client-code"
                className="block font-mono text-[10px] uppercase tracking-[0.25em] text-[#8E8A80] mb-2"
              >
                Clave de Galería Privada
              </label>
              <input
                id="client-code"
                type="text"
                value={codeInput}
                onChange={(e) => setCodeInput(e.target.value)}
                placeholder="Ej. RALLY2026 o DEMO"
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
              className="w-full border border-[#EBE7DF] bg-[#EBE7DF] py-3.5 font-mono text-xs uppercase tracking-[0.28em] font-medium text-[#0B0C0E] transition hover:bg-transparent hover:text-white"
            >
              Desbloquear Sala Privada →
            </button>

            <div className="pt-3 text-center">
              <button
                type="button"
                onClick={() => {
                  const demo = findClientGallery("DEMO");
                  if (demo) {
                    setCodeInput("DEMO");
                    setUnlocked(demo);
                  }
                }}
                className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#C5A880]/85 underline underline-offset-4 hover:text-[#EBE7DF]"
              >
                Ver galería de demostración (DEMO)
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Cabecera de sala desbloqueada */}
      <div className="flex flex-col justify-between gap-6 border-b border-[#C5A880]/20 pb-8 md:flex-row md:items-end">
        <div>
          <div className="flex items-center gap-2.5">
            <AndalusianStarMark className="h-3.5 w-3.5 text-[#C5A880]" />
            <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-[#C5A880]">
              Entrega Privada · Clave {unlocked.code}
            </p>
          </div>
          <h1 className="mt-3 font-serif text-3xl sm:text-5xl font-light text-[#F7F4EE]">
            {unlocked.projectTitle}
          </h1>
          <p className="mt-2 font-mono text-xs uppercase tracking-[0.2em] text-[#8E8A80]">
            {unlocked.clientName} · {unlocked.location} · {unlocked.date}
          </p>
          <p className="mt-4 max-w-2xl text-sm font-light leading-relaxed text-[#8E8A80]">
            {unlocked.note}
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
          Salir de la Sala
        </button>
      </div>

      <AndalusianCenefa variant="estrella" className="my-8 text-[#C5A880]/36" />

      {/* Cuadrícula de selección del cliente */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {galleryPhotos.map((photo, idx) => {
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
                    ★ Seleccionada
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
                  {isFav ? "✓ Elegida" : "+ Elegir"}
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
              Selección Recibida
            </p>
            <h2 className="mt-2 font-serif text-2xl font-light text-[#F7F4EE]">
              Hemos enviado tus {favorites.length} fotografías elegidas al estudio
            </h2>
            <p className="mt-2 text-xs text-[#8E8A80]">
              Javier preparará los archivos máster calibrados y te enviará el enlace de descarga directa.
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSendSelection}
            className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between"
          >
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#C5A880]">
                Resumen de Selección ({favorites.length} / {unlocked.maxSelection})
              </p>
              <h2 className="mt-1.5 font-serif text-2xl font-light text-[#F7F4EE]">
                Enviar selección final al fotógrafo
              </h2>
              <p className="mt-1 text-xs font-light text-[#8E8A80]">
                Marca las obras que deseas recibir en máxima resolución y confirma tu correo.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <input
                type="email"
                required
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                placeholder="Tu correo electrónico..."
                className="border border-white/15 bg-[#0B0C0E] px-4 py-3 font-mono text-xs text-[#F7F4EE] placeholder-[#8E8A80]/60 focus:border-[#C5A880] focus:outline-none sm:w-64"
              />
              <button
                type="submit"
                disabled={favorites.length === 0 || sending}
                className="border border-[#EBE7DF] bg-[#EBE7DF] px-6 py-3 font-mono text-[10px] uppercase tracking-[0.25em] font-medium text-[#0B0C0E] transition hover:bg-transparent hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {sending
                  ? "Enviando..."
                  : `Enviar Selección (${favorites.length}) →`}
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
