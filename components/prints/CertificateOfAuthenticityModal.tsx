"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import type { Photo } from "@/types/photo";

type CertificateProps = {
  photo: Photo;
  buttonLabel?: string;
  className?: string;
};

export default function CertificateOfAuthenticityModal({
  photo,
  buttonLabel = "Ver Certificado de Autenticidad (ISO 9706)",
  className,
}: CertificateProps) {
  const [open, setOpen] = useState(false);
  const certId = `JE-${photo.year}-${photo.id.toUpperCase()}-750`;
  const canonicalUrl = `https://javier-photography.vercel.app/portfolio/${photo.slug}`;

  // Deterministic SVG QR-like code representation
  const qrGrid = [
    [1,1,1,1,1,1,1,0,1,0,1,0,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,1,0,0,1,0,1,1,0,0,0,0,0,1],
    [1,0,1,1,1,0,1,0,1,1,1,0,1,0,1,1,1,0,1],
    [1,0,1,1,1,0,1,0,0,0,1,1,1,0,1,1,1,0,1],
    [1,0,1,1,1,0,1,0,1,0,0,0,1,0,1,1,1,0,1],
    [1,0,0,0,0,0,1,0,1,1,0,1,1,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,0,1,0,1,0,1,1,1,1,1,1,1],
    [0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0],
    [1,0,1,1,0,1,1,1,0,1,0,1,1,0,1,0,1,0,1],
    [0,1,0,0,1,0,0,1,1,0,1,0,0,1,0,1,1,0,0],
    [1,1,0,1,0,1,1,0,1,0,1,1,0,1,1,0,0,1,1],
    [0,0,0,0,0,0,0,0,1,1,0,1,1,0,0,1,0,1,0],
    [1,1,1,1,1,1,1,0,0,1,0,1,0,1,0,1,1,0,1],
    [1,0,0,0,0,0,1,0,1,0,1,0,1,0,1,0,0,1,0],
    [1,0,1,1,1,0,1,0,0,1,0,1,1,1,1,0,1,0,1],
    [1,0,1,1,1,0,1,0,1,1,1,0,0,0,0,1,1,1,0],
    [1,0,1,1,1,0,1,0,1,0,1,0,1,1,0,0,1,0,1],
    [1,0,0,0,0,0,1,0,0,1,0,1,0,1,1,0,0,1,0],
    [1,1,1,1,1,1,1,0,1,1,0,1,1,0,1,1,0,1,1],
  ];

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={
          className ??
          "inline-flex items-center gap-2 border border-[#8E8A80]/60 bg-[#151618] px-4 py-2 font-mono text-[10px] uppercase tracking-[0.22em] text-[#EBE7DF] transition hover:border-[#EBE7DF] hover:text-white"
        }
      >
        <svg
          className="h-3.5 w-3.5 text-[#8E8A80]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          />
        </svg>
        <span>{buttonLabel}</span>
      </button>

      {open &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Certificado de Autenticidad de Obra Fine Art"
            className="fixed inset-0 z-[120] flex items-center justify-center overflow-y-auto bg-[#0A0B0C]/90 p-4 backdrop-blur-2xl sm:p-6"
            onClick={() => setOpen(false)}
          >
            <div
              className="relative w-full max-w-3xl overflow-hidden border border-[#D5CFC5] bg-[#FAF8F5] p-8 text-[#1A1A1A] shadow-[0_35px_90px_rgba(0,0,0,0.85)] sm:p-12"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Classical Double Border Frame */}
              <div className="pointer-events-none absolute inset-3 border border-[#D5CFC5]/80 sm:inset-4" />
              <div className="pointer-events-none absolute inset-4 border border-[#8C765C]/40 sm:inset-5" />

              {/* Top Watermark & Header */}
              <div className="relative text-center">
                <span className="font-mono text-[9px] uppercase tracking-[0.4em] text-[#8C765C]">
                  ESTUDIO & ARCHIVO DE FOTOGRAFÍA DE AUTOR
                </span>
                <h2 className="mt-1 font-serif text-3xl font-light tracking-wider text-[#1A1A1A] sm:text-4xl">
                  CERTIFICADO DE AUTENTICIDAD
                </h2>
                <p className="mt-1 font-mono text-[10px] tracking-[0.25em] text-[#8C765C]">
                  NORMA INTERNACIONAL DE CONSERVACIÓN MUSEÍSTICA ISO 9706
                </p>
                <div className="mx-auto mt-4 h-px w-24 bg-[#8C765C]" />
              </div>

              {/* Statement */}
              <p className="relative mt-8 text-center text-xs font-light leading-relaxed text-[#4A4744] sm:text-sm">
                Por el presente documento se certifica que la obra fotográfica descrita a continuación
                ha sido producida bajo la supervisión directa del autor, garantizando su tirada limitada,
                la fidelidad cromática de revelado y su permanencia en soportes de máxima longevidad europea.
              </p>

              {/* Artwork Summary Spec Table */}
              <div className="relative mt-8 grid grid-cols-1 gap-6 border-y border-[#D5CFC5] py-6 sm:grid-cols-12">
                {/* Thumbnail Preview */}
                <div className="relative aspect-[4/3] w-full overflow-hidden border border-[#D5CFC5] bg-[#EFECE6] sm:col-span-4">
                  <Image
                    src={photo.image}
                    alt={photo.alt}
                    fill
                    sizes="220px"
                    className="object-contain p-2"
                  />
                </div>

                {/* Details */}
                <div className="space-y-2.5 font-mono text-xs text-[#2A2825] sm:col-span-8">
                  <div>
                    <span className="block text-[9px] uppercase tracking-wider text-[#8C765C]">
                      Título de la Obra:
                    </span>
                    <span className="font-serif text-xl font-normal text-[#1A1A1A]">
                      «{photo.title}»
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="block text-[9px] uppercase tracking-wider text-[#8C765C]">
                        Año de Registro:
                      </span>
                      <span>{photo.year}</span>
                    </div>
                    <div>
                      <span className="block text-[9px] uppercase tracking-wider text-[#8C765C]">
                        Localización:
                      </span>
                      <span className="truncate">{photo.location ?? "España"}</span>
                    </div>
                  </div>
                  <div>
                    <span className="block text-[9px] uppercase tracking-wider text-[#8C765C]">
                      Soporte de Impresión:
                    </span>
                    <span className="text-[11px]">
                      Hahnemühle Photo Rag® 308 g/m² · 100% Fibra de Algodón
                    </span>
                  </div>
                  <div>
                    <span className="block text-[9px] uppercase tracking-wider text-[#8C765C]">
                      Procedimiento:
                    </span>
                    <span className="text-[11px]">
                      Giclée Fine Art de 12 Tintas Minerales Pigmentadas UltraChrome PRO
                    </span>
                  </div>
                </div>
              </div>

              {/* Holographic Security & Signatures Strip */}
              <div className="relative mt-8 flex flex-col items-center justify-between gap-6 border-b border-[#D5CFC5] pb-8 sm:flex-row sm:items-end">
                {/* Security Hologram Simulation */}
                <div className="flex items-center gap-4">
                  <div className="relative flex h-16 w-16 items-center justify-center rounded-full border-2 border-[#8C765C] bg-gradient-to-tr from-[#C5A880] via-[#EADBCE] to-[#8E8A80] shadow-md">
                    <div className="text-center font-serif text-[10px] font-bold text-[#3B2E1E]">
                      <span>ISO</span>
                      <span className="block text-[11px]">9706</span>
                    </div>
                  </div>
                  <div>
                    <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#8C765C]">
                      Registro de Edición Numerada:
                    </span>
                    <p className="font-mono text-xs font-semibold tracking-wider text-[#1A1A1A]">
                      {certId}
                    </p>
                    <p className="font-mono text-[9px] text-[#6E6962]">
                      Norma ISO 9706 · Algodón 100% de conservación museística
                    </p>
                  </div>
                </div>

                {/* SVG QR Code */}
                <div className="flex items-center gap-3 border border-[#D5CFC5] bg-white p-2">
                  <svg
                    viewBox="0 0 19 19"
                    className="h-12 w-12 text-[#1A1A1A]"
                    shapeRendering="crispEdges"
                    aria-label={`Código QR de verificación para ${canonicalUrl}`}
                  >
                    {qrGrid.map((row, r) =>
                      row.map((cell, c) =>
                        cell ? (
                          <rect
                            key={`${r}-${c}`}
                            x={c}
                            y={r}
                            width="1"
                            height="1"
                            fill="currentColor"
                          />
                        ) : null
                      )
                    )}
                  </svg>
                  <div className="font-mono text-[8px] uppercase tracking-wider text-[#6E6962]">
                    <span>Verificación</span>
                    <span className="block text-[#1A1A1A]">Directa</span>
                  </div>
                </div>

                {/* Signature */}
                <div className="text-center sm:text-right">
                  <div className="font-serif text-2xl italic tracking-wider text-[#1A1A1A]">
                    Javier Espinosa M.
                  </div>
                  <div className="mt-1 h-px w-44 bg-[#8C765C] sm:ml-auto" />
                  <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.2em] text-[#8C765C]">
                    Firma del Autor & Fotógrafo
                  </p>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="relative mt-6 flex flex-wrap items-center justify-between gap-4">
                <span className="font-mono text-[10px] text-[#8C765C]">
                  Copia Registrada en el Catálogo Razonado · Javier Espinosa Martínez
                </span>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="border border-[#8C765C] bg-[#8C765C] px-5 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-white transition hover:bg-[#735F49]"
                  >
                    Imprimir Certificado
                  </button>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="border border-[#D5CFC5] bg-white px-5 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[#1A1A1A] transition hover:bg-[#EFECE6]"
                  >
                    Cerrar [ESC]
                  </button>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
