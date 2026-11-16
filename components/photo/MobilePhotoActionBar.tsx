"use client";

import { useState } from "react";
import Link from "next/link";
import type { Photo } from "@/types/photo";
import { getSavedWorks } from "@/components/photo/FavoriteButton";

const STORAGE_KEY = "javier_selected_works";

export default function MobilePhotoActionBar({ photo }: { photo: Photo }) {
  const [saved, setSaved] = useState(() => getSavedWorks().includes(photo.title));
  const [copied, setCopied] = useState(false);

  const toggleFavorite = () => {
    const current = getSavedWorks();
    const updated = current.includes(photo.title)
      ? current.filter((t) => t !== photo.title)
      : [...current, photo.title];
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setSaved(updated.includes(photo.title));
    window.dispatchEvent(new Event("javier-selection-updated"));
  };

  const handleShare = async () => {
    const url = window.location.href;
    const title = `${photo.title} — Javier Espinosa Fotografía`;
    const text = `Fotografía de autor por Javier Espinosa: «${photo.title}» (${photo.focalLength} · ${photo.camera})`;

    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
        return;
      } catch {
        // User cancelled or share failed, fallback to clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      // Ignore
    }
  };

  return (
    <aside
      aria-label="Acciones móviles para esta obra"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-[#1D2021] bg-[#101112]/95 px-4 pt-3 pb-[max(1.5rem,env(safe-area-inset-bottom))] shadow-[0_-15px_40px_rgba(0,0,0,0.8)] backdrop-blur-2xl lg:hidden"
    >
      <div className="mx-auto flex max-w-md items-center justify-between gap-3">
        {/* Favorite Button */}
        <button
          type="button"
          onClick={toggleFavorite}
          aria-label={saved ? "Quitar de favoritos" : "Guardar en favoritos"}
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border transition ${
            saved
              ? "border-[#95836B] bg-[#95836B] text-[#101112]"
              : "border-[#1D2021] bg-[#141617] text-[#D8D5CD] hover:border-[#95836B]"
          }`}
        >
          <span className="text-base">{saved ? "♥" : "♡"}</span>
        </button>

        {/* Native Share Button */}
        <button
          type="button"
          onClick={handleShare}
          aria-label="Compartir fotografía"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-[#1D2021] bg-[#141617] text-[#D8D5CD] transition hover:border-[#95836B]"
        >
          {copied ? (
            <span className="font-mono text-[9px] uppercase tracking-wider text-emerald-400">
              ✓
            </span>
          ) : (
            <svg
              className="h-4 w-4 text-[#95836B]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.8}
                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
              />
            </svg>
          )}
        </button>

        {/* Primary Action: Direct Print / License CTA */}
        <Link
          href={
            photo.prints
              ? `/prints?obra=${encodeURIComponent(photo.title)}`
              : `/contact?motivo=licencia&obra=${encodeURIComponent(photo.title)}`
          }
          className="flex h-11 flex-1 items-center justify-center rounded-lg border border-[#D8D5CD] bg-[#D8D5CD] px-4 font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-[#101112] transition hover:bg-transparent hover:text-white"
        >
          <span>{photo.prints ? "Adquirir Print Fine Art" : "Solicitar Licencia"}</span>
        </Link>
      </div>
    </aside>
  );
}
