"use client";

import { useEffect, useState } from "react";
import {
  DEFAULT_EUR_USD_RATE,
  eurToUsd,
  formatApproxUsd,
  formatApproxUsdRange,
  formatApproxUsdShort,
} from "@/lib/fx-constants";

export {
  DEFAULT_EUR_USD_RATE,
  eurToUsd,
  formatApproxUsd,
  formatApproxUsdRange,
  formatApproxUsdShort,
};

const SESSION_STORAGE_KEY = "javier_ecb_eur_usd";

let memoryRate: number | null = null;
let inflightRequest: Promise<number> | null = null;

async function fetchLiveEurUsdRate(): Promise<number> {
  if (memoryRate !== null) return memoryRate;

  if (typeof window !== "undefined") {
    try {
      const cached = window.sessionStorage.getItem(SESSION_STORAGE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached) as { rate?: number };
        if (typeof parsed?.rate === "number" && parsed.rate > 0) {
          memoryRate = parsed.rate;
          return parsed.rate;
        }
      }
    } catch {
      // Ignorar errores de almacenamiento
    }
  }

  if (!inflightRequest) {
    inflightRequest = fetch("/api/fx")
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { rate?: number } | null) => {
        const nextRate = Number(data?.rate);
        if (Number.isFinite(nextRate) && nextRate > 0) {
          memoryRate = nextRate;
          if (typeof window !== "undefined") {
            try {
              window.sessionStorage.setItem(
                SESSION_STORAGE_KEY,
                JSON.stringify({ rate: nextRate })
              );
            } catch {
              // Ignorar cuota de almacenamiento
            }
          }
          return nextRate;
        }
        return DEFAULT_EUR_USD_RATE;
      })
      .catch(() => DEFAULT_EUR_USD_RATE);
  }

  return inflightRequest;
}

/**
 * Devuelve el tipo de cambio EUR -> USD para mostrar equivalencias orientativas en inglés.
 * Arranca con DEFAULT_EUR_USD_RATE en SSR y primer render para garantizar cero discrepancias
 * de hidratación y actualiza en segundo plano mediante /api/fx (datos BCE cacheados).
 */
export function useUsdRate(enabled = true): number {
  const [rate, setRate] = useState<number>(DEFAULT_EUR_USD_RATE);

  useEffect(() => {
    if (!enabled) return;
    let active = true;
    fetchLiveEurUsdRate().then((resolved) => {
      if (active && resolved > 0) {
        setRate((prev) => (prev === resolved ? prev : resolved));
      }
    });
    return () => {
      active = false;
    };
  }, [enabled]);

  return rate;
}
