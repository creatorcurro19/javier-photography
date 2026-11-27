"use client";

import { useState } from "react";
import Link from "@/components/ui/LocalizedLink";
import { useLanguage } from "@/lib/i18n";

const STORAGE_KEY = "javier_selected_works";

export function getSavedWorks(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export default function FavoriteButton({ title }: { title: string }) {
  const { t } = useLanguage();
  const [savedList, setSavedList] = useState<string[]>(() => getSavedWorks());

  const isSaved = savedList.includes(title);

  const toggleSave = () => {
    const current = getSavedWorks();
    const updated = current.includes(title)
      ? current.filter((item) => item !== title)
      : [...current, title];
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setSavedList(updated);
    window.dispatchEvent(new Event("javier-selection-updated"));
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        onClick={toggleSave}
        className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs uppercase tracking-[0.2em] transition ${
          isSaved
            ? "border-[#8E8A80] bg-[#8E8A80] text-[#0B0C0E] font-medium"
            : "border-[#202226] bg-[#202226]/50 text-[#EBE7DF] hover:border-[#8E8A80]"
        }`}
      >
        <span>
          {isSaved
            ? t("♥ En tu selección", "♥ In your selection")
            : t("♡ Guardar en selección", "♡ Save to selection")}
        </span>
      </button>

      {savedList.length > 0 && (
        <Link
          href={`/contact?motivo=print&obra=${encodeURIComponent(savedList.join(", "))}`}
          className="text-xs uppercase tracking-[0.2em] text-[#8E8A80] underline underline-offset-4 hover:text-[#EBE7DF] transition"
        >
          {t(
            `Consultar por tu selección (${savedList.length}) →`,
            `Inquire about your selection (${savedList.length}) →`
          )}
        </Link>
      )}
    </div>
  );
}
