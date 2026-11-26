"use client";

import { useEffect, useRef, useState } from "react";

interface ShareButtonProps {
  title: string;
  slug: string;
  location?: string;
  variant?: "default" | "lightbox";
}

/**
 * Botón minimalista para compartir una fotografía mediante el menú nativo del móvil
 * (WhatsApp, Instagram, AirDrop, Telegram) o copiando su enlace directo en escritorio.
 */
export default function ShareButton({
  title,
  slug,
  location,
  variant = "default",
}: ShareButtonProps) {
  const [status, setStatus] = useState<"idle" | "copied">("idle");
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, []);

  const handleShare = async () => {
    const origin =
      typeof window !== "undefined"
        ? window.location.origin
        : "https://javier-photography.vercel.app";
    const url = `${origin}/portfolio/${slug}`;
    const text = location
      ? `${title} (${location}) — Javier Espinosa Fotografía`
      : `${title} — Javier Espinosa Fotografía`;

    if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
      try {
        await navigator.share({ title, text, url });
        return;
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setStatus("copied");
      if (timerRef.current) window.clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(() => setStatus("idle"), 2400);
    } catch {
      // Clipboard blocked in restricted context
    }
  };

  if (variant === "lightbox") {
    return (
      <button
        type="button"
        onClick={handleShare}
        className="inline-flex min-h-[36px] items-center gap-1.5 rounded-full border border-white/15 bg-[#151618] px-3 py-1 text-xs font-mono text-[#EBE7DF] transition hover:border-[#C5A880] hover:text-white cursor-pointer"
        aria-label={`Compartir ${title}`}
      >
        <span>{status === "copied" ? "✓ Enlace copiado" : "↗ Compartir"}</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleShare}
      className={`inline-flex min-h-[36px] items-center gap-1.5 rounded-full border px-4 py-1.5 text-xs uppercase tracking-[0.2em] transition cursor-pointer ${
        status === "copied"
          ? "border-[#C5A880] bg-[#C5A880] text-[#0B0C0E] font-medium"
          : "border-[#202226] bg-[#202226]/50 text-[#EBE7DF] hover:border-[#8E8A80]"
      }`}
      aria-label={`Compartir ${title}`}
    >
      <span>{status === "copied" ? "✓ Enlace copiado" : "↗ Compartir"}</span>
    </button>
  );
}
