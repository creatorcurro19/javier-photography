"use client";

import { useState, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "@/components/ui/LocalizedLink";
import { getSavedWorks } from "@/components/photo/FavoriteButton";
import { getAllPhotos } from "@/lib/photos";
import { useLanguage } from "@/lib/i18n";
import { getLocalizedPhoto } from "@/lib/i18n-works";

const STORAGE_KEY = "javier_selected_works";

export default function SavedCollectionDrawer() {
  const { lang, t } = useLanguage();
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
  const rawLeft = pool[leftIdx % pool.length] ?? allPhotos[0];
  const rawRight = pool[rightIdx % pool.length] ?? allPhotos[1];
  const leftPhoto = getLocalizedPhoto(rawLeft, lang);
  const rightPhoto = getLocalizedPhoto(rawRight, lang);

  const removeWork = (canonicalTitle: string) => {
    const updated = savedTitles.filter((titleItem) => titleItem !== canonicalTitle);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setSavedTitles(updated);
    window.dispatchEvent(new Event("javier-selection-updated"));
    if (updated.length === 0) setOpen(false);
  };

  if (savedTitles.length === 0) return null;

  return (
    <>
      <div className="fixed right-4 sm:right-5 bottom-20 md:bottom-5 z-40 print:hidden">
        {open ? (
          <div className="w-[calc(100vw-2rem)] max-w-sm border border-[#8E8A80]/70 bg-[#0B0C0E]/95 p-5 shadow-[0_25px_70px_rgba(0,0,0,0.85)] backdrop-blur-xl">
            <div className="flex items-center justify-between border-b border-[#202226] pb-3">
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#8E8A80]">
                {t(`Mi Selección (${savedTitles.length})`, `My Selection (${savedTitles.length})`)}
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="font-mono text-[10px] uppercase tracking-wider text-neutral-400 hover:text-white"
              >
                {t("Minimizar", "Minimize")}
              </button>
            </div>

            <div className="mt-3 max-h-60 divide-y divide-[#202226] overflow-y-auto">
              {savedPhotos.map((rawPhoto) => {
                const photo = getLocalizedPhoto(rawPhoto, lang);
                return (
                  <div
                    key={photo.id}
                    className="flex items-center justify-between gap-3 py-2.5"
                  >
                    <Link
                      href={`/portfolio/${photo.slug}`}
                      onClick={() => setOpen(false)}
                      className="flex min-w-0 items-center gap-3"
                    >
                      <div className="relative h-10 w-14 shrink-0 overflow-hidden bg-[#202226]">
                        <Image
                          src={photo.image}
                          alt={photo.alt}
                          fill
                          sizes="56px"
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-serif text-sm text-[#EBE7DF] hover:text-white">
                          {photo.title}
                        </p>
                        <p className="font-mono text-[9px] text-[#8E8A80]">
                          {photo.focalLength}
                        </p>
                      </div>
                    </Link>
                    <button
                      type="button"
                      onClick={() => removeWork(rawPhoto.title)}
                      aria-label={t(`Quitar ${photo.title}`, `Remove ${photo.title}`)}
                      className="px-2 font-mono text-xs text-neutral-500 hover:text-white"
                    >
                      ×
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 flex flex-col gap-2 border-t border-[#202226] pt-3">
              <button
                type="button"
                onClick={() => {
                  setLeftIdx(0);
                  setRightIdx(1);
                  setCompareOpen(true);
                }}
                className="w-full border border-[#8E8A80]/70 bg-[#151618] px-4 py-2 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-[#EBE7DF] transition hover:border-[#EBE7DF] hover:text-white"
              >
                {t("Comparar en Díptico (Mesa de Luz)", "Compare Diptych (Light Table)")}
              </button>
              <Link
                href={`/contact?motivo=print&obra=${encodeURIComponent(
                  savedPhotos.map((p) => getLocalizedPhoto(p, lang).title).join(", ")
                )}`}
                onClick={() => setOpen(false)}
                className="w-full border border-[#EBE7DF] bg-[#EBE7DF] px-4 py-2.5 text-center font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-[#0B0C0E] transition hover:bg-transparent hover:text-white"
              >
                {t("Consultar Prints / Licencias →", "Inquire Prints / Licenses →")}
              </Link>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="flex items-center gap-2.5 border border-[#8E8A80]/80 bg-[#0B0C0E]/95 px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.25em] text-[#EBE7DF] shadow-2xl backdrop-blur-md transition hover:border-[#EBE7DF] hover:text-white"
          >
            <span className="text-[#8E8A80]">♥</span>
            <span>{t(`Selección (${savedTitles.length})`, `Selection (${savedTitles.length})`)}</span>
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
            aria-label={t(
              "Comparador de díptico para coleccionistas",
              "Collector diptych comparator"
            )}
            className="fixed inset-0 z-[110] flex items-center justify-center bg-[#0B0C0D]/95 p-4 backdrop-blur-2xl sm:p-8"
            onClick={() => setCompareOpen(false)}
          >
            <div
              className="w-full max-w-6xl max-h-[92vh] overflow-y-auto no-scrollbar border border-[#202226] bg-[#0B0C0E] p-5 sm:p-10 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#202226] pb-4">
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#8E8A80]">
                    {t(
                      "Simulador de Díptico · Mesa de Coleccionista",
                      "Diptych Comparator · Collector Table"
                    )}
                  </span>
                  <h3 className="mt-1 font-serif text-2xl text-[#EBE7DF]">
                    {t("Diálogo Visual entre Dos Obras", "Visual Dialogue Between Two Works")}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setCompareOpen(false)}
                  className="border border-[#202226] px-4 py-1.5 font-mono text-[10px] uppercase tracking-widest text-neutral-400 hover:border-[#EBE7DF] hover:text-white"
                >
                  {t("Cerrar [ESC]", "Close [ESC]")}
                </button>
              </div>

              <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2">
                {[
                  {
                    slot: t("Obra Izquierda (A)", "Left Work (A)"),
                    photo: leftPhoto,
                    idx: leftIdx,
                    setIdx: setLeftIdx,
                  },
                  {
                    slot: t("Obra Derecha (B)", "Right Work (B)"),
                    photo: rightPhoto,
                    idx: rightIdx,
                    setIdx: setRightIdx,
                  },
                ].map(({ slot, photo, idx, setIdx }) => (
                  <div
                    key={slot}
                    className="flex flex-col justify-between border border-[#202226] bg-[#151618]/60 p-5"
                  >
                    <div className="flex items-center justify-between gap-2 pb-4">
                      <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#8E8A80]">
                        {slot}
                      </span>
                      <select
                        value={idx % pool.length}
                        onChange={(e) => setIdx(Number(e.target.value))}
                        className="border border-[#202226] bg-[#0B0C0E] px-3 py-1 font-mono text-xs text-[#EBE7DF] focus:border-[#8E8A80] focus:outline-none"
                      >
                        {pool.map((rawP, i) => {
                          const lp = getLocalizedPhoto(rawP, lang);
                          return (
                            <option key={lp.id} value={i}>
                              {lp.title} ({lp.focalLength})
                            </option>
                          );
                        })}
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

                    <div className="mt-4 flex items-baseline justify-between border-t border-[#202226] pt-3">
                      <div>
                        <p className="font-serif text-xl text-[#EBE7DF]">
                          {photo.title}
                        </p>
                        <p className="font-mono text-[10px] text-[#8E8A80]">
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

              <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-[#202226] pt-5">
                <p className="font-mono text-xs text-neutral-400">
                  {t("Díptico seleccionado:", "Selected diptych:")}{" "}
                  <strong className="text-[#EBE7DF]">{leftPhoto.title}</strong> +{" "}
                  <strong className="text-[#EBE7DF]">{rightPhoto.title}</strong>
                </p>
                <Link
                  href={`/contact?motivo=print&obra=${encodeURIComponent(
                    `${t("Díptico Fine Art", "Fine Art Diptych")}: ${leftPhoto.title} + ${rightPhoto.title}`
                  )}`}
                  onClick={() => {
                    setCompareOpen(false);
                    setOpen(false);
                  }}
                  className="border border-[#EBE7DF] bg-[#EBE7DF] px-6 py-3 font-mono text-xs font-semibold uppercase tracking-[0.25em] text-[#0B0C0E] transition hover:bg-transparent hover:text-white"
                >
                  {t(
                    "Solicitar Presupuesto de este Díptico →",
                    "Request Quote for this Diptych →"
                  )}
                </Link>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
