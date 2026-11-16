"use client";

import { useState } from "react";
import Link from "next/link";

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
  const [savedList, setSavedList] = useState<string[]>(() => getSavedWorks());

  const isSaved = savedList.includes(title);

  const toggleSave = () => {
    const current = getSavedWorks();
    const updated = current.includes(title)
      ? current.filter((item) => item !== title)
      : [...current, title];
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setSavedList(updated);
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        onClick={toggleSave}
        className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs uppercase tracking-[0.2em] transition ${
          isSaved
            ? "border-[#95836B] bg-[#95836B] text-[#101112] font-medium"
            : "border-[#1D2021] bg-[#1D2021]/50 text-[#D8D5CD] hover:border-[#95836B]"
        }`}
      >
        <span>{isSaved ? "♥ En tu selección" : "♡ Guardar en selección"}</span>
      </button>

      {savedList.length > 0 && (
        <Link
          href={`/contact?motivo=print&obra=${encodeURIComponent(savedList.join(", "))}`}
          className="text-xs uppercase tracking-[0.2em] text-[#95836B] underline underline-offset-4 hover:text-[#D8D5CD] transition"
        >
          Consultar por tu selección ({savedList.length}) →
        </Link>
      )}
    </div>
  );
}
