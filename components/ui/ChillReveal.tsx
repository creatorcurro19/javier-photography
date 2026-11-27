"use client";

import { useEffect, useRef, type ReactNode } from "react";

interface ChillRevealProps {
  children: ReactNode;
  className?: string;
  delayMs?: number;
}

/**
 * Aparición sutil al hacer scroll sin ocultar el HTML SSR ni provocar parpadeos
 * encima del pliegue inicial. Respeta `prefers-reduced-motion: reduce`.
 */
export default function ChillReveal({
  children,
  className = "",
  delayMs = 0,
}: ChillRevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const rect = el.getBoundingClientRect();
    // Si ya está visible en el viewport inicial, no lo ocultamos ni animamos con retardo.
    if (rect.top <= window.innerHeight * 0.94) return;

    el.classList.add("chill-reveal-pending");

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            requestAnimationFrame(() => {
              el.classList.add("chill-reveal-active");
              el.classList.remove("chill-reveal-pending");
              el.classList.add("chill-reveal-visible");
            });
            observer.disconnect();
            break;
          }
        }
      },
      { threshold: 0.06, rootMargin: "0px 0px -24px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={delayMs > 0 ? { transitionDelay: `${delayMs}ms` } : undefined}
      className={className}
    >
      {children}
    </div>
  );
}
