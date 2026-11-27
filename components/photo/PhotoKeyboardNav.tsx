"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/lib/i18n";

type PhotoKeyboardNavProps = {
  prevSlug?: string;
  nextSlug?: string;
};

export default function PhotoKeyboardNav({ prevSlug, nextSlug }: PhotoKeyboardNavProps) {
  const router = useRouter();
  const { href } = useLanguage();

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      // Ignore if lightbox dialog is open or user is typing in an input
      if (document.querySelector('[role="dialog"]')) return;
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;

      if (e.key === "ArrowLeft" && prevSlug) {
        router.push(href(`/portfolio/${prevSlug}`));
      } else if (e.key === "ArrowRight" && nextSlug) {
        router.push(href(`/portfolio/${nextSlug}`));
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [prevSlug, nextSlug, router, href]);

  return null;
}
