"use client";

import { useEffect } from "react";

/**
 * Protección silenciosa de imágenes del archivo fotográfico:
 * - Deshabilita el menú contextual (clic derecho) sobre imágenes sin mostrar mensajes intrusivos
 * - Bloquea el arrastre de imágenes fuera de la ventana
 * - Bloquea atajo de guardado de página (Cmd+S / Ctrl+S)
 * - Navegación 100% limpia y sin alertas emergentes para el usuario
 */
export default function PhotoProtection() {
  useEffect(() => {
    // 1. Bloqueo silencioso de menú contextual (clic derecho) sobre imágenes y galerías
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
      }
    };

    // 2. Bloqueo silencioso de arrastrar imagen fuera del navegador
    const handleDragStart = (e: DragEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === "IMG" || target.closest("figure"))) {
        e.preventDefault();
      }
    };

    // 3. Bloqueo silencioso de atajos de teclado para guardar página (Cmd+S / Ctrl+S)
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === "s" || e.key === "S")) {
        e.preventDefault();
        return;
      }

      if ((e.ctrlKey || e.metaKey) && (e.key === "u" || e.key === "U")) {
        e.preventDefault();
      }
    };

    window.addEventListener("contextmenu", handleContextMenu, { capture: true });
    window.addEventListener("dragstart", handleDragStart, { capture: true });
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("contextmenu", handleContextMenu, { capture: true });
      window.removeEventListener("dragstart", handleDragStart, { capture: true });
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return null;
}

