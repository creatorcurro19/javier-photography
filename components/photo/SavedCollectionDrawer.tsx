"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { getSavedWorks } from "@/components/photo/FavoriteButton";
import { getAllPhotos } from "@/lib/photos";

const STORAGE_KEY = "javier_selected_works";

export default function SavedCollectionDrawer() {
  const [savedTitles, setSavedTitles] = useState<string[]>(() => getSavedWorks());
  const [open, setOpen] = useState(false);

  const allPhotos = useMemo(() => getAllPhotos(), []);

  useEffect(() => {
    const sync = () => setSavedTitles(getSavedWorks());
    window.addEventListener("javier-selection-updated", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("javier-selection-updated", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const savedPhotos = useMemo(() => {
    return allPhotos.filter((p) => savedTitles.includes(p.title));
  }, [allPhotos, savedTitles]);

  const removeWork = (title: string) => {
    const updated = savedTitles.filter((t) => t !== title);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setSavedTitles(updated);
    window.dispatchEvent(new Event("javier-selection-updated"));
    if (updated.length === 0) setOpen(false);
  };

  if (savedTitles.length === 0) return null;

  return (
    <div className="fixed right-5 bottom-5 z-40 print:hidden">
      {open ? (
        <div className="w-80 border border-[#95836B]/70 bg-[#101112]/95 p-5 shadow-[0_25px_70px_rgba(0,0,0,0.85)] backdrop-blur-xl sm:w-96">
          <div className="flex items-center justify-between border-b border-[#1D2021] pb-3">
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#95836B]">
              Mi Selección ({savedTitles.length})
            </span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="font-mono text-[10px] uppercase tracking-wider text-neutral-400 hover:text-white"
            >
              Minimizar
            </button>
          </div>

          <div className="mt-3 max-h-60 divide-y divide-[#1D2021] overflow-y-auto">
            {savedPhotos.map((photo) => (
              <div
                key={photo.id}
                className="flex items-center justify-between gap-3 py-2.5"
              >
                <Link
                  href={`/portfolio/${photo.slug}`}
                  onClick={() => setOpen(false)}
                  className="flex min-w-0 items-center gap-3"
                >
                  <div className="relative h-10 w-14 shrink-0 overflow-hidden bg-[#1D2021]">
                    <Image
                      src={photo.image}
                      alt={photo.alt}
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-serif text-sm text-[#D8D5CD] hover:text-white">
                      {photo.title}
                    </p>
                    <p className="font-mono text-[9px] text-[#95836B]">
                      {photo.focalLength}
                    </p>
                  </div>
                </Link>
                <button
                  type="button"
                  onClick={() => removeWork(photo.title)}
                  aria-label={`Quitar ${photo.title}`}
                  className="px-2 font-mono text-xs text-neutral-500 hover:text-white"
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          <div className="mt-4 flex flex-col gap-2 border-t border-[#1D2021] pt-3">
            <Link
              href={`/contact?motivo=print&obra=${encodeURIComponent(
                savedTitles.join(", ")
              )}`}
              onClick={() => setOpen(false)}
              className="w-full border border-[#D8D5CD] bg-[#D8D5CD] px-4 py-2.5 text-center font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-[#101112] transition hover:bg-transparent hover:text-white"
            >
              Consultar Prints / Licencias →
            </Link>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex items-center gap-2.5 border border-[#95836B]/80 bg-[#101112]/95 px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.25em] text-[#D8D5CD] shadow-2xl backdrop-blur-md transition hover:border-[#D8D5CD] hover:text-white"
        >
          <span className="text-[#95836B]">♥</span>
          <span>Selección ({savedTitles.length})</span>
        </button>
      )}
    </div>
  );
}
