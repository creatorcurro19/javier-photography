"use client";

import { useState, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { getSavedWorks } from "@/components/photo/FavoriteButton";
import { getAllPhotos } from "@/lib/photos";

const STORAGE_KEY = "javier_selected_works";

export default function SavedCollectionDrawer() {
  const [savedTitles, setSavedTitles] = useState<string[]>(() => getSavedWorks());
  const [open, setOpen] = useState(false);
  const [compareOpen, setCompareOpen] = useState(false);
  const [leftIdx, setLeftIdx] = useState(0);
  const [rightIdx, setRightIdx] = useState(1);

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

  const pool = savedPhotos.length >= 2 ? savedPhotos : allPhotos.slice(0, 12);
  const leftPhoto = pool[leftIdx % pool.length] ?? allPhotos[0];
  const rightPhoto = pool[rightIdx % pool.length] ?? allPhotos[1];

  const removeWork = (title: string) => {
    const updated = savedTitles.filter((t) => t !== title);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setSavedTitles(updated);
    window.dispatchEvent(new Event("javier-selection-updated"));
    if (updated.length === 0) setOpen(false);
  };

  if (savedTitles.length === 0) return null;

  return (
    <>
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
              <button
                type="button"
                onClick={() => {
                  setLeftIdx(0);
                  setRightIdx(1);
                  setCompareOpen(true);
                }}
                className="w-full border border-[#95836B]/70 bg-[#141617] px-4 py-2 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-[#D8D5CD] transition hover:border-[#D8D5CD] hover:text-white"
              >
                Comparar en Díptico (Mesa de Luz)
              </button>
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

      {/* Full-Screen Collector Diptych Comparator Modal */}
      {compareOpen &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Comparador de díptico para coleccionistas"
            className="fixed inset-0 z-[110] flex items-center justify-center bg-[#0B0C0D]/95 p-4 backdrop-blur-2xl sm:p-8"
            onClick={() => setCompareOpen(false)}
          >
            <div
              className="w-full max-w-6xl border border-[#1D2021] bg-[#101112] p-6 sm:p-10 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#1D2021] pb-4">
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#95836B]">
                    Simulador de Díptico · Mesa de Coleccionista
                  </span>
                  <h3 className="mt-1 font-serif text-2xl text-[#D8D5CD]">
                    Diálogo Visual entre Dos Obras
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setCompareOpen(false)}
                  className="border border-[#1D2021] px-4 py-1.5 font-mono text-[10px] uppercase tracking-widest text-neutral-400 hover:border-[#D8D5CD] hover:text-white"
                >
                  Cerrar [ESC]
                </button>
              </div>

              <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2">
                {[
                  {
                    slot: "Obra Izquierda (A)",
                    photo: leftPhoto,
                    idx: leftIdx,
                    setIdx: setLeftIdx,
                  },
                  {
                    slot: "Obra Derecha (B)",
                    photo: rightPhoto,
                    idx: rightIdx,
                    setIdx: setRightIdx,
                  },
                ].map(({ slot, photo, idx, setIdx }) => (
                  <div
                    key={slot}
                    className="flex flex-col justify-between border border-[#1D2021] bg-[#141617]/60 p-5"
                  >
                    <div className="flex items-center justify-between gap-2 pb-4">
                      <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#95836B]">
                        {slot}
                      </span>
                      <select
                        value={idx % pool.length}
                        onChange={(e) => setIdx(Number(e.target.value))}
                        className="border border-[#1D2021] bg-[#101112] px-3 py-1 font-mono text-xs text-[#D8D5CD] focus:border-[#95836B] focus:outline-none"
                      >
                        {pool.map((p, i) => (
                          <option key={p.id} value={i}>
                            {p.title} ({p.focalLength})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Museum Passepartout Frame */}
                    <div className="flex h-72 items-center justify-center border border-[#2A2622] bg-[#EAE6DF] p-5 shadow-inner">
                      <div className="relative h-full w-full">
                        <Image
                          src={photo.image}
                          alt={photo.alt}
                          fill
                          sizes="480px"
                          className="object-contain"
                        />
                      </div>
                    </div>

                    <div className="mt-4 flex items-baseline justify-between border-t border-[#1D2021] pt-3">
                      <div>
                        <p className="font-serif text-xl text-[#D8D5CD]">
                          {photo.title}
                        </p>
                        <p className="font-mono text-[10px] text-[#95836B]">
                          {photo.camera} · {photo.focalLength} · {photo.aperture} ·{" "}
                          {photo.shutter}
                        </p>
                      </div>
                      <span className="font-mono text-[10px] text-neutral-500">
                        {photo.width}×{photo.height}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-[#1D2021] pt-5">
                <p className="font-mono text-xs text-neutral-400">
                  Díptico seleccionado:{" "}
                  <strong className="text-[#D8D5CD]">{leftPhoto.title}</strong> +{" "}
                  <strong className="text-[#D8D5CD]">{rightPhoto.title}</strong>
                </p>
                <Link
                  href={`/contact?motivo=print&obra=${encodeURIComponent(
                    `Díptico Fine Art: ${leftPhoto.title} + ${rightPhoto.title}`
                  )}`}
                  onClick={() => {
                    setCompareOpen(false);
                    setOpen(false);
                  }}
                  className="border border-[#D8D5CD] bg-[#D8D5CD] px-6 py-3 font-mono text-xs font-semibold uppercase tracking-[0.25em] text-[#101112] transition hover:bg-transparent hover:text-white"
                >
                  Solicitar Presupuesto de este Díptico →
                </Link>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
