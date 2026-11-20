"use client";

import { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n";
import { AndalusianStarMark } from "@/components/ui/AndalusianMotif";

export default function PrintAlertsForm() {
  const { lang, t } = useLanguage();
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !consent) return;

    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, consent }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Error al procesar la suscripción.");
      }

      setStatus("success");
      setEmail("");
      setConsent(false);
    } catch (err: unknown) {
      setStatus("error");
      setErrorMessage(
        err instanceof Error
          ? err.message
          : lang === "en"
          ? "Failed to subscribe. Please try again."
          : "No se pudo procesar la suscripción. Inténtalo de nuevo."
      );
    }
  };

  return (
    <section
      aria-label={t("Avisos de nuevas tiradas", "New release print alerts")}
      className="relative overflow-hidden border-t border-[#C5A880]/20 bg-[#0E1012] py-16 sm:py-20"
    >
      <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-8 text-center">
        <div className="inline-flex items-center gap-2 font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.35em] text-[#C5A880]">
          <AndalusianStarMark className="h-3 w-3 text-[#C5A880]" />
          <span>{t("Coleccionistas & Ediciones Limitadas", "Collectors & Limited Editions")}</span>
        </div>

        <h2 className="mt-2.5 font-serif text-3xl sm:text-4xl font-light text-[#EBE7DF]">
          {t("Avisos de Nuevas Tiradas de Autor", "New Release Print Alerts")}
        </h2>

        <p className="mx-auto mt-3 max-w-xl text-xs sm:text-sm font-light text-[#8E8A80] leading-relaxed">
          {t(
            "Recibe notificación previa 48 horas antes de que se abran nuevas series numeradas sobre papel Hahnemühle Photo Rag 308g. Cero spam, solo aperturas de archivo.",
            "Receive private advance notice 48 hours before new numbered series open on Hahnemühle Photo Rag 308g paper. Zero spam, only archive releases."
          )}
        </p>

        {status === "success" ? (
          <div className="mx-auto mt-8 max-w-md rounded-xl border border-[#C5A880]/40 bg-[#C5A880]/10 p-6 text-center">
            <p className="font-serif text-base text-[#EBE7DF]">
              {t("¡Suscripción confirmada!", "Subscription confirmed!")}
            </p>
            <p className="mt-1 font-mono text-xs text-[#C5A880]">
              {t(
                "Te avisaremos con prioridad antes del lanzamiento público de cada nueva edición.",
                "You will receive priority notification before each new public print edition."
              )}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mx-auto mt-8 max-w-lg space-y-4">
            <div className="flex flex-col sm:flex-row gap-2.5">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("Tu correo electrónico...", "Your email address...")}
                aria-label={t("Correo electrónico para avisos de tiradas", "Email address for print release alerts")}
                className="flex-1 rounded-lg border border-white/15 bg-[#15171A] px-4 py-3 text-xs text-[#EBE7DF] placeholder:text-neutral-500 focus:border-[#C5A880] focus:outline-none focus:ring-1 focus:ring-[#C5A880]"
              />
              <button
                type="submit"
                disabled={status === "loading" || !consent}
                className="inline-flex items-center justify-center rounded-lg border border-[#C5A880] bg-[#C5A880] px-6 py-3 font-mono text-xs uppercase tracking-[0.2em] text-[#0B0C0E] font-semibold transition hover:bg-white hover:border-white disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {status === "loading"
                  ? t("Enviando...", "Sending...")
                  : t("Recibir avisos", "Get Alerts")}
              </button>
            </div>

            {/* Casilla de Consentimiento RGPD */}
            <div className="flex items-start gap-2.5 text-left pt-1">
              <input
                type="checkbox"
                id="rgpd-consent"
                required
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-0.5 h-3.5 w-3.5 rounded border-white/20 bg-[#15171A] text-[#C5A880] focus:ring-[#C5A880] cursor-pointer"
              />
              <label
                htmlFor="rgpd-consent"
                className="text-[10.5px] sm:text-[11px] font-light text-[#8E8A80] leading-snug cursor-pointer select-none"
              >
                {t(
                  "He leído y acepto la ",
                  "I have read and agree to the "
                )}
                <Link
                  href="/legal"
                  className="text-[#C5A880] underline underline-offset-2 hover:text-white"
                >
                  {t("política de privacidad", "privacy policy")}
                </Link>
                {t(
                  " y el tratamiento de mis datos para recibir avisos de tiradas de autor según el RGPD.",
                  " and the processing of my data to receive author print alerts under GDPR."
                )}
              </label>
            </div>

            {status === "error" && (
              <p className="text-xs text-red-400 font-mono mt-2">{errorMessage}</p>
            )}
          </form>
        )}
      </div>
    </section>
  );
}
