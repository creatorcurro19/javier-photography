/**
 * Tipo oficial de referencia BCE (EUR -> USD) verificado vía:
 * https://api.frankfurter.dev/v1/latest?from=EUR&to=USD
 * Empleado únicamente como estimación orientativa cuando el visitante navega en inglés (/en).
 * La facturación y el cobro final en Stripe se ejecutan siempre en EUR.
 */
export const FALLBACK_ECB_EUR_USD_RATE = 1.0975;
export const FALLBACK_ECB_EUR_USD_DATE = "2026-11-26";

export function getInitialEurUsdRate(): number {
  const override = Number(process.env.NEXT_PUBLIC_EUR_USD_RATE);
  if (Number.isFinite(override) && override > 0) return override;
  return FALLBACK_ECB_EUR_USD_RATE;
}

export const DEFAULT_EUR_USD_RATE = getInitialEurUsdRate();

export function eurToUsd(eurAmount: number, rate = DEFAULT_EUR_USD_RATE): number {
  return Math.round(eurAmount * rate);
}

export function formatApproxUsd(eurAmount: number, rate = DEFAULT_EUR_USD_RATE): string {
  return `~$${eurToUsd(eurAmount, rate)} USD`;
}

export function formatApproxUsdShort(eurAmount: number, rate = DEFAULT_EUR_USD_RATE): string {
  return `~$${eurToUsd(eurAmount, rate)}`;
}

export function formatApproxUsdRange(
  minEur: number,
  maxEur: number,
  rate = DEFAULT_EUR_USD_RATE
): string {
  const minUsd = eurToUsd(minEur, rate);
  const maxUsd = eurToUsd(maxEur, rate);
  return minUsd === maxUsd ? `~$${minUsd} USD` : `~$${minUsd}–$${maxUsd} USD`;
}
