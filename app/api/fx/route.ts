import { NextResponse } from "next/server";
import { FALLBACK_ECB_EUR_USD_DATE, FALLBACK_ECB_EUR_USD_RATE } from "@/lib/fx-constants";

export const revalidate = 21600; // 6 horas

export async function GET() {
  const envOverride = Number(process.env.NEXT_PUBLIC_EUR_USD_RATE);
  if (Number.isFinite(envOverride) && envOverride > 0) {
    return NextResponse.json(
      {
        base: "EUR",
        quote: "USD",
        rate: envOverride,
        date: "configured",
        source: "env-override",
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        },
      }
    );
  }

  try {
    const res = await fetch("https://api.frankfurter.dev/v1/latest?from=EUR&to=USD", {
      next: { revalidate: 21600 },
      signal: AbortSignal.timeout(3500),
    });
    if (res.ok) {
      const data = (await res.json()) as {
        date?: string;
        rates?: { USD?: number };
      };
      const liveRate = Number(data?.rates?.USD);
      if (Number.isFinite(liveRate) && liveRate > 0) {
        return NextResponse.json(
          {
            base: "EUR",
            quote: "USD",
            rate: liveRate,
            date: data.date || FALLBACK_ECB_EUR_USD_DATE,
            source: "ecb-frankfurter",
          },
          {
            headers: {
              "Cache-Control": "public, s-maxage=21600, stale-while-revalidate=86400",
            },
          }
        );
      }
    }
  } catch {
    // Caída de red / offline: usar última referencia BCE verificada
  }

  return NextResponse.json(
    {
      base: "EUR",
      quote: "USD",
      rate: FALLBACK_ECB_EUR_USD_RATE,
      date: FALLBACK_ECB_EUR_USD_DATE,
      source: "ecb-reference-fallback",
    },
    {
      headers: {
        "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=86400",
      },
    }
  );
}
