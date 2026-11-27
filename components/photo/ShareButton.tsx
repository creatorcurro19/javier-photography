"use client";

import { useEffect, useRef, useState } from "react";
import { SITE_CONFIG } from "@/data/site-config";
import { useLanguage } from "@/lib/i18n";

interface ShareButtonProps {
  title: string;
  slug: string;
  location?: string;
  image?: string;
  prints?: boolean;
  variant?: "default" | "lightbox";
}

/**
 * Controles minimalistas para compartir una fotografía (menú nativo móvil o copiar enlace)
 * y guardarla directamente en tableros de Pinterest con imagen y descripción optimizada.
 */
export default function ShareButton({
  title,
  slug,
  location,
  image,
  prints,
  variant = "default",
}: ShareButtonProps) {
  const { t, href } = useLanguage();
  const [status, setStatus] = useState<"idle" | "copied">("idle");
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, []);

  const canonicalUrl = `${SITE_CONFIG.siteUrl}${href(`/portfolio/${slug}`)}`;
  const pinterestHref = image
    ? `https://www.pinterest.com/pin/create/button/?url=${encodeURIComponent(
        canonicalUrl
      )}&media=${encodeURIComponent(
        `${SITE_CONFIG.siteUrl}${image}`
      )}&description=${encodeURIComponent(
        `${title}${location ? ` (${location})` : ""} — ${
          prints
            ? t(
                "Copia Fine Art en papel Hahnemühle Photo Rag 308g · Javier Espinosa",
                "Fine Art Print on Hahnemühle Photo Rag 308g · Javier Espinosa Photography"
              )
            : t(
                "Fotografía de autor · Javier Espinosa",
                "Fine Art Photography · Javier Espinosa"
              )
        }`
      )}`
    : null;

  const handleShare = async () => {
    const origin =
      typeof window !== "undefined"
        ? window.location.origin
        : SITE_CONFIG.siteUrl;
    const url = `${origin}${href(`/portfolio/${slug}`)}`;
    const brandSuffix = t("Javier Espinosa Fotografía", "Javier Espinosa Photography");
    const text = location
      ? `${title} (${location}) — ${brandSuffix}`
      : `${title} — ${brandSuffix}`;

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
        aria-label={t(`Compartir ${title}`, `Share ${title}`)}
      >
        <span>{status === "copied" ? t("✓ Enlace copiado", "✓ Link copied") : t("↗ Compartir", "↗ Share")}</span>
      </button>
    );
  }

  return (
    <div className="inline-flex flex-wrap items-center gap-2">
      {pinterestHref && (
        <a
          href={pinterestHref}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t(`Guardar ${title} en Pinterest`, `Pin ${title} on Pinterest`)}
          className="inline-flex min-h-[36px] items-center gap-1.5 rounded-full border border-[#202226] bg-[#202226]/50 px-3.5 py-1.5 text-xs uppercase tracking-[0.18em] text-[#EBE7DF] hover:border-[#C5A880] hover:text-white transition"
        >
          <svg
            aria-hidden="true"
            className="h-3.5 w-3.5 text-[#C5A880]"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12.017 2C6.486 2 2 6.486 2 12.017c0 4.238 2.636 7.855 6.356 9.312-.087-.79-.166-2.005.035-2.868.181-.78 1.172-4.969 1.172-4.969s-.299-.599-.299-1.484c0-1.389.805-2.426 1.807-2.426.852 0 1.264.64 1.264 1.407 0 .858-.546 2.14-.828 3.33-.236.995.499 1.806 1.481 1.806 1.778 0 3.144-1.874 3.144-4.58 0-2.393-1.72-4.068-4.177-4.068-2.845 0-4.515 2.135-4.515 4.34 0 .859.331 1.781.745 2.281a.3.3 0 0 1 .069.288l-.278 1.133c-.044.183-.145.223-.335.134-1.249-.581-2.03-2.407-2.03-3.874 0-3.154 2.292-6.052 6.608-6.052 3.469 0 6.165 2.473 6.165 5.776 0 3.447-2.173 6.22-5.19 6.22-1.013 0-1.965-.527-2.291-1.148l-.623 2.378c-.226.869-.835 1.958-1.244 2.621.937.29 1.931.446 2.962.446 5.531 0 10.017-4.486 10.017-10.017S17.548 2 12.017 2Z" />
          </svg>
          <span>Pinterest</span>
        </a>
      )}

      <button
        type="button"
        onClick={handleShare}
        className={`inline-flex min-h-[36px] items-center gap-1.5 rounded-full border px-4 py-1.5 text-xs uppercase tracking-[0.2em] transition cursor-pointer ${
          status === "copied"
            ? "border-[#C5A880] bg-[#C5A880] text-[#0B0C0E] font-medium"
            : "border-[#202226] bg-[#202226]/50 text-[#EBE7DF] hover:border-[#8E8A80]"
        }`}
        aria-label={t(`Compartir ${title}`, `Share ${title}`)}
      >
        <span>{status === "copied" ? t("✓ Enlace copiado", "✓ Link copied") : t("↗ Compartir", "↗ Share")}</span>
      </button>
    </div>
  );
}
