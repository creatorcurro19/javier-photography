"use client";

import { useEffect, useState, useCallback } from "react";

export default function PhotoProtection() {
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState<string>("");

  const triggerNotice = useCallback((msg?: string) => {
    setToastMessage(
      msg ||
        "Obra protegida por derechos de autor © Javier Espinosa Martínez. Prohibida su descarga, captura o reproducción sin autorización expresa."
    );
    setToastVisible(true);
  }, []);

  useEffect(() => {
    if (!toastVisible) return;
    const timer = setTimeout(() => {
      setToastVisible(false);
    }, 4500);
    return () => clearTimeout(timer);
  }, [toastVisible]);

  useEffect(() => {
    // 1. Bloqueo de menú contextual (clic derecho) sobre imágenes y galerías
    const handleContextMenu = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const isProtected =
        target.tagName === "IMG" ||
        target.tagName === "CANVAS" ||
        target.tagName === "FIGURE" ||
        target.closest("figure") ||
        target.closest(".protected-image") ||
        target.closest("[data-lightbox]") ||
        target.closest("[role='dialog']");

      if (isProtected) {
        e.preventDefault();
        triggerNotice();
      }
    };

    // 2. Bloqueo de arrastrar imagen fuera del navegador
    const handleDragStart = (e: DragEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === "IMG" || target.closest("figure"))) {
        e.preventDefault();
      }
    };

    // 3. Bloqueo de atajos de teclado para guardar página o capturar imagen
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+S / Cmd+S (Guardar página)
      if ((e.ctrlKey || e.metaKey) && (e.key === "s" || e.key === "S")) {
        e.preventDefault();
        triggerNotice("La descarga directa de archivos está deshabilitada para proteger la autoría de las obras.");
        return;
      }

      // Ctrl+U / Cmd+Option+U (Ver código fuente)
      if ((e.ctrlKey || e.metaKey) && (e.key === "u" || e.key === "U")) {
        e.preventDefault();
        return;
      }

      // Tecla Impr Pant (PrintScreen en Windows)
      if (e.key === "PrintScreen") {
        triggerNotice("Captura detectada: Las fotografías de este archivo están registradas y protegidas por copyright.");
      }
    };

    // 4. Atenuación en cambio de app móvil (evita capturas en la vista multitarea de iOS / Android)
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        document.body.classList.add("privacy-protect-active");
      } else {
        document.body.classList.remove("privacy-protect-active");
      }
    };

    // 5. Prevención de pulsación larga en móvil (iOS Safari / Android Chrome "Guardar imagen")
    let touchTimer: ReturnType<typeof setTimeout> | null = null;
    const handleTouchStart = (e: TouchEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === "IMG" || target.closest("figure"))) {
        touchTimer = setTimeout(() => {
          // Si el usuario mantiene pulsado más de 450ms sobre la foto, recordamos la autoría
          triggerNotice();
        }, 500);
      }
    };

    const handleTouchEnd = () => {
      if (touchTimer) {
        clearTimeout(touchTimer);
        touchTimer = null;
      }
    };

    window.addEventListener("contextmenu", handleContextMenu, { capture: true });
    window.addEventListener("dragstart", handleDragStart, { capture: true });
    window.addEventListener("keydown", handleKeyDown);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });
    window.addEventListener("touchcancel", handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("contextmenu", handleContextMenu, { capture: true });
      window.removeEventListener("dragstart", handleDragStart, { capture: true });
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("touchcancel", handleTouchEnd);
    };
  }, [triggerNotice]);

  if (!toastVisible) return null;

  return (
    <aside
      aria-live="polite"
      role="alert"
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] w-[92vw] max-w-md animate-in fade-in slide-in-from-bottom-4 duration-300"
    >
      <div className="rounded-xl border border-[#C5A880]/60 bg-[#121316]/95 p-4 text-[#EBE7DF] shadow-2xl backdrop-blur-xl">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#C5A880]/40 bg-[#C5A880]/15 text-[#C5A880]">
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-mono text-[10px] uppercase tracking-wider text-[#C5A880]">
              Protección de Obra Fotográfica
            </p>
            <p className="mt-1 text-xs text-[#EBE7DF]/90 font-light leading-relaxed">
              {toastMessage}
            </p>
            <div className="mt-2.5 flex items-center gap-3 font-mono text-[10px]">
              <a
                href="/prints"
                className="text-[#C5A880] hover:underline"
                onClick={() => setToastVisible(false)}
              >
                Copias autorizadas Fine Art →
              </a>
              <button
                type="button"
                onClick={() => setToastVisible(false)}
                className="text-[#8E8A81] hover:text-white cursor-pointer ml-auto"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
