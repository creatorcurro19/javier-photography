"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState, Suspense, useCallback } from "react";
import { getSavedWorks } from "@/components/photo/FavoriteButton";
import { getPlazos } from "@/data/plazos";
import { SITE_CONFIG } from "@/data/site-config";
import { trackEvent } from "@/lib/analytics";
import { useLanguage } from "@/lib/i18n";

interface SearchParamsSyncProps {
  onSync: (params: {
    motivo: string;
    obra: string;
    formato: string;
    uso: string;
    territorio: string;
    duracion: string;
    tipo: string;
    servicio: string;
  }) => void;
}

function SearchParamsReader({ onSync }: SearchParamsSyncProps) {
  const searchParams = useSearchParams();
  const motivo = searchParams.get("motivo") || "";
  const obra = searchParams.get("obra") || "";
  const formato = searchParams.get("formato") || "";
  const uso = searchParams.get("uso") || "";
  const territorio = searchParams.get("territorio") || "";
  const duracion = searchParams.get("duracion") || "";
  const tipo = searchParams.get("tipo") || "";
  const servicio = searchParams.get("servicio") || "";

  // Call parent once synchronously or on mount
  useState(() => {
    onSync({ motivo, obra, formato, uso, territorio, duracion, tipo, servicio });
  });

  return null;
}

export default function ContactForm() {
  const { lang, t } = useLanguage();
  const plazos = getPlazos(lang);

  const [formData, setFormData] = useState(() => {
    let ref = "";
    if (typeof window !== "undefined") {
      const saved = getSavedWorks();
      if (saved.length > 0) {
        ref = t(
          `Selección guardada (${saved.length}): ${saved.join(", ")}`,
          `Saved selection (${saved.length}): ${saved.join(", ")}`
        );
      }
    }
    return {
      nombre: "",
      email: "",
      telefono: "",
      motivo: "encargo",
      referencia: ref,
      mensaje: "",
    };
  });

  const [honeypot, setHoneypot] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const [submissionStatus, setSubmissionStatus] = useState<
    "idle" | "success" | "manual-required"
  >("idle");
  const [submitting, setSubmitting] = useState(false);
  const [validationError, setValidationError] = useState("");
  const [copied, setCopied] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(true);

  const handleParamsSync = useCallback(
    ({
      motivo,
      obra,
      formato,
      uso,
      territorio,
      duracion,
      tipo,
      servicio,
    }: {
      motivo: string;
      obra: string;
      formato: string;
      uso: string;
      territorio: string;
      duracion: string;
      tipo: string;
      servicio: string;
    }) => {
      const servicioMap: Record<string, { motivo: string; label: string }> = {
        "rally-motor": {
          motivo: "encargo",
          label: t(
            "Servicio: Automovilismo y Rally Histórico",
            "Service: Motorsport & Historic Rally"
          ),
        },
        "arquitectura-territorio": {
          motivo: "encargo",
          label: t(
            "Servicio: Arquitectura, Espacios y Patrimonio",
            "Service: Architecture, Spaces & Heritage"
          ),
        },
        "documental-editorial": {
          motivo: "encargo",
          label: t(
            "Servicio: Proyectos Documentales y Editorial",
            "Service: Documentary & Editorial Projects"
          ),
        },
        "prints-interiorismo": {
          motivo: "print",
          label: t(
            "Servicio: Copia de Autor Fine Art",
            "Service: Author Fine Art Print"
          ),
        },
      };

      const normalizedMotivo = motivo.toLowerCase();
      const resolvedMotivo =
        servicio && servicioMap[servicio]
          ? servicioMap[servicio].motivo
          : normalizedMotivo.includes("print")
          ? "print"
          : normalizedMotivo.includes("licencia")
          ? "licencia"
          : normalizedMotivo.includes("exposicion")
          ? "exposicion"
          : normalizedMotivo.includes("encargo")
          ? "encargo"
          : "";

      let resolvedRef = "";
      if (servicio && servicioMap[servicio]) {
        resolvedRef = servicioMap[servicio].label;
      }
      if (obra) resolvedRef += (resolvedRef ? " | " : "") + t(`Obra: ${obra}`, `Work: ${obra}`);
      if (formato) resolvedRef += (resolvedRef ? " | " : "") + t(`Formato: ${formato}`, `Format: ${formato}`);
      if (uso) resolvedRef += (resolvedRef ? " | " : "") + t(`Uso: ${uso}`, `Usage: ${uso}`);
      if (territorio) resolvedRef += (resolvedRef ? " | " : "") + t(`Territorio: ${territorio}`, `Territory: ${territorio}`);
      if (duracion) resolvedRef += (resolvedRef ? " | " : "") + t(`Duración: ${duracion}`, `Duration: ${duracion}`);
      if (tipo) resolvedRef += (resolvedRef ? " | " : "") + t(`Tipo: ${tipo}`, `Type: ${tipo}`);

      setFormData((prev) => ({
        ...prev,
        motivo: resolvedMotivo || prev.motivo,
        referencia: resolvedRef || prev.referencia,
      }));
    },
    [t]
  );

  const mailtoLink = `mailto:${SITE_CONFIG.contactEmail}?subject=${encodeURIComponent(
    t(
      `[WEB · ${formData.motivo.toUpperCase()}] Consulta de ${formData.nombre || "Interesado"}`,
      `[WEB · ${formData.motivo.toUpperCase()}] Inquiry from ${formData.nombre || "Visitor"}`
    )
  )}&body=${encodeURIComponent(
    t(
      `Nombre: ${formData.nombre}\nEmail: ${formData.email}\nTeléfono: ${formData.telefono || "No indicado"}\nMotivo: ${formData.motivo}\nReferencia / Obra: ${formData.referencia || "General"}\n\nMensaje:\n${formData.mensaje}`,
      `Name: ${formData.nombre}\nEmail: ${formData.email}\nPhone: ${formData.telefono || "Not provided"}\nSubject: ${formData.motivo}\nReference / Work: ${formData.referencia || "General"}\n\nMessage:\n${formData.mensaje}`
    )
  )}`;

  const handleCopy = () => {
    const textToCopy = t(
      `Para: ${SITE_CONFIG.contactEmail}\nAsunto: [WEB · ${formData.motivo.toUpperCase()}] Consulta de ${formData.nombre}\n\nNombre: ${formData.nombre}\nEmail: ${formData.email}\nTeléfono: ${formData.telefono || "No indicado"}\nReferencia: ${formData.referencia || "General"}\n\nMensaje:\n${formData.mensaje}`,
      `To: ${SITE_CONFIG.contactEmail}\nSubject: [WEB · ${formData.motivo.toUpperCase()}] Inquiry from ${formData.nombre}\n\nName: ${formData.nombre}\nEmail: ${formData.email}\nPhone: ${formData.telefono || "Not provided"}\nReference: ${formData.referencia || "General"}\n\nMessage:\n${formData.mensaje}`
    );
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError("");

    if (!privacyAccepted) {
      setValidationError(
        t(
          "Debe aceptar la política de privacidad para enviar el formulario.",
          "You must accept the privacy policy to submit the form."
        )
      );
      return;
    }

    if (!formData.nombre.trim()) {
      setValidationError(
        t(
          "Por favor, introduzca su nombre o entidad.",
          "Please enter your name or organization."
        )
      );
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email)) {
      setValidationError(
        t(
          "Por favor, introduzca un correo electrónico válido.",
          "Please enter a valid email address."
        )
      );
      return;
    }

    if (!formData.mensaje.trim() || formData.mensaje.trim().length < 10) {
      setValidationError(
        t(
          "Por favor, describa con un poco más de detalle el objetivo de su consulta.",
          "Please describe the purpose of your inquiry in a bit more detail."
        )
      );
      return;
    }

    setSubmitting(true);

    try {
      // 1. Try server route (with honeypot + Turnstile token)
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          _gotcha: honeypot,
          turnstileToken,
        }),
      });

      const data = await res.json().catch(() => null);

      if (res.ok && data?.ok) {
        trackEvent("contacto_enviado", { motivo: formData.motivo, via: data.provider || "server" });
        setSubmissionStatus("success");
        return;
      }

      // 2. Direct client-side relay to FormSubmit as seamless fallback
      try {
        const clientRelay = await fetch(
          `https://formsubmit.co/ajax/${SITE_CONFIG.contactEmail}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify({
              _subject: `[Web Javier Espinosa · ${formData.motivo.toUpperCase()}] ${formData.nombre}`,
              _replyto: formData.email,
              _captcha: "false",
              _template: "table",
              Nombre: formData.nombre,
              Email: formData.email,
              Telefono: formData.telefono || "No indicado",
              Motivo: formData.motivo,
              Referencia: formData.referencia || "General",
              Mensaje: formData.mensaje,
            }),
          }
        );

        const clientData = await clientRelay.json().catch(() => null);
        if (
          clientRelay.ok &&
          clientData &&
          (clientData.success === "true" || clientData.success === true)
        ) {
          trackEvent("contacto_enviado", { motivo: formData.motivo, via: "formsubmit-client" });
          setSubmissionStatus("success");
          return;
        }
      } catch {
        // Continue to manual fallback
      }

      setSubmissionStatus("manual-required");
    } catch {
      setSubmissionStatus("manual-required");
    } finally {
      setSubmitting(false);
    }
  };

  if (submissionStatus === "success") {
    return (
      <div className="border border-white/[0.08] bg-[#0B0C0E]/90 p-8 text-center sm:p-12">
        <div className="mx-auto flex h-12 w-12 items-center justify-center border border-white/20 bg-white/5 text-[#EBE7DF]">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="mt-5 font-serif text-2xl text-[#EBE7DF]">
          {t("Solicitud Transmitida con Éxito", "Inquiry Sent Successfully")}
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-[#8E8A80] font-light max-w-lg mx-auto">
          {t("Gracias por contactar, ", "Thank you for reaching out, ")}
          {formData.nombre}.{" "}
          {t("Su mensaje ha sido registrado para ", "Your message has been logged for ")}
          <strong className="text-[#EBE7DF] font-medium">Javier Espinosa Martínez</strong>{" "}
          {t("en ", "at ")}
          <span className="font-mono text-[#EBE7DF]">{SITE_CONFIG.contactEmail}</span>.{" "}
          {t("Recibirá confirmación en su correo ", "You will receive confirmation at ")}
          <span className="font-mono text-[#EBE7DF]">{formData.email}</span>. {plazos.respuesta}
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <a
            href={mailtoLink}
            className="inline-flex border border-white/20 bg-transparent px-6 py-2.5 font-mono text-xs uppercase tracking-[0.22em] text-[#EBE7DF] transition hover:border-white/50 hover:text-white"
          >
            {t("Abrir copia en mi gestor de correo →", "Open copy in my email client →")}
          </a>
          <button
            type="button"
            onClick={() => {
              setSubmissionStatus("idle");
              setFormData({
                nombre: "",
                email: "",
                telefono: "",
                motivo: "encargo",
                referencia: "",
                mensaje: "",
              });
            }}
            className="font-mono text-xs text-[#8E8A80] underline underline-offset-4 hover:text-[#EBE7DF]"
          >
            {t("Enviar otra consulta", "Send another inquiry")}
          </button>
        </div>
      </div>
    );
  }

  if (submissionStatus === "manual-required") {
    return (
      <div className="border border-white/[0.1] bg-[#151618] p-8 text-center sm:p-12">
        <div className="mx-auto flex h-12 w-12 items-center justify-center border border-white/20 bg-white/5 text-[#EBE7DF]">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 className="mt-5 font-serif text-2xl text-[#EBE7DF]">
          {t("Envío Directo Preparado", "Direct Email Ready")}
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-[#8E8A80] font-light max-w-lg mx-auto">
          {t(
            "Los datos de su consulta están listos y organizados. Para garantizar la recepción inmediata sin intermediarios técnicos, puede despacharlo directamente a ",
            "Your inquiry details are ready and formatted. To guarantee immediate delivery without technical intermediaries, you can send it directly to "
          )}
          <strong className="text-[#EBE7DF] font-medium font-mono">{SITE_CONFIG.contactEmail}</strong>.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href={mailtoLink}
            className="inline-flex border border-[#EBE7DF] bg-[#EBE7DF] px-8 py-3.5 font-mono text-xs uppercase tracking-[0.25em] text-[#0B0C0E] font-medium transition hover:bg-transparent hover:text-white"
          >
            {t("Enviar por mi gestor de correo →", "Send via email client →")}
          </a>
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex border border-white/20 bg-[#0B0C0E] px-6 py-3.5 font-mono text-xs uppercase tracking-[0.22em] text-[#EBE7DF] transition hover:border-white/50 hover:text-white"
          >
            {copied
              ? t("✓ Copiado al Portapapeles", "✓ Copied to Clipboard")
              : t("Copiar Texto Completo", "Copy Full Text")}
          </button>
        </div>

        <div className="mt-8 border-t border-white/[0.06] pt-6">
          <button
            type="button"
            onClick={() => setSubmissionStatus("idle")}
            className="font-mono text-xs text-[#8E8A80] hover:text-[#EBE7DF] underline underline-offset-4"
          >
            {t("← Volver a editar el formulario", "← Back to edit form")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Suspense fallback={null}>
        <SearchParamsReader onSync={handleParamsSync} />
      </Suspense>

      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        {/* Anti-spam honeypot */}
        <input
          type="text"
          name="_gotcha"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
          tabIndex={-1}
          autoComplete="off"
          className="hidden absolute -left-[9999px] -top-[9999px] opacity-0 pointer-events-none"
          aria-hidden="true"
        />

        {validationError && (
          <div className="border border-red-500/40 bg-red-950/20 p-4 text-xs font-mono text-red-200">
            {validationError}
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label
              htmlFor="nombre"
              className="block text-xs uppercase tracking-[0.25em] text-[#8E8A80] font-mono"
            >
              {t("Nombre o Entidad", "Name or Organization")} <span className="text-[#EBE7DF]">*</span>
            </label>
            <input
              id="nombre"
              type="text"
              required
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              placeholder={t("Ej. Ana Morales / Escudería Norte", "e.g. Sarah Miller / North Racing")}
              className="mt-2 w-full border border-white/[0.1] bg-[#0B0C0E] px-4 py-3 text-sm text-[#EBE7DF] placeholder-[#8E8A80]/40 transition focus:border-white/40 focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-xs uppercase tracking-[0.25em] text-[#8E8A80] font-mono"
            >
              {t("Correo Electrónico", "Email Address")} <span className="text-[#EBE7DF]">*</span>
            </label>
            <input
              id="email"
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder={t("contacto@ejemplo.com", "contact@example.com")}
              className="mt-2 w-full border border-white/[0.1] bg-[#0B0C0E] px-4 py-3 text-sm text-[#EBE7DF] placeholder-[#8E8A80]/40 transition focus:border-white/40 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label
              htmlFor="telefono"
              className="block text-xs uppercase tracking-[0.25em] text-[#8E8A80] font-mono"
            >
              {t("Teléfono de Contacto", "Contact Phone")}{" "}
              <span className="text-[#8E8A80]/60">{t("(Opcional)", "(Optional)")}</span>
            </label>
            <input
              id="telefono"
              type="tel"
              value={formData.telefono}
              onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
              placeholder="+34 600 000 000"
              className="mt-2 w-full border border-white/[0.1] bg-[#0B0C0E] px-4 py-3 text-sm text-[#EBE7DF] placeholder-[#8E8A80]/40 transition focus:border-white/40 focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="motivo"
              className="block text-xs uppercase tracking-[0.25em] text-[#8E8A80] font-mono"
            >
              {t("Tipo de Consulta", "Inquiry Type")} <span className="text-[#EBE7DF]">*</span>
            </label>
            <select
              id="motivo"
              value={formData.motivo}
              onChange={(e) => setFormData({ ...formData, motivo: e.target.value })}
              className="mt-2 w-full border border-white/[0.1] bg-[#0B0C0E] px-4 py-3 text-sm text-[#EBE7DF] transition focus:border-white/40 focus:outline-none"
            >
              <option value="encargo" className="bg-[#0B0C0E] text-[#EBE7DF]">
                {t(
                  "Encargo Profesional (Rally / Arquitectura / Documental)",
                  "Professional Commission (Rally / Architecture / Documentary)"
                )}
              </option>
              <option value="print" className="bg-[#0B0C0E] text-[#EBE7DF]">
                {t(
                  "Adquisición de Copia Fine Art (Hahnemühle 308g)",
                  "Fine Art Print Acquisition (Hahnemühle 308gsm)"
                )}
              </option>
              <option value="licencia" className="bg-[#0B0C0E] text-[#EBE7DF]">
                {t(
                  "Licencia de Derechos de Imagen (Editorial / Publicidad)",
                  "Image Rights Licensing (Editorial / Commercial)"
                )}
              </option>
              <option value="exposicion" className="bg-[#0B0C0E] text-[#EBE7DF]">
                {t(
                  "Propuesta de Exposición, Galería o Prensa",
                  "Exhibition, Gallery or Press Proposal"
                )}
              </option>
              <option value="general" className="bg-[#0B0C0E] text-[#EBE7DF]">
                {t("Consulta General de Autor", "General Studio Inquiry")}
              </option>
            </select>
          </div>
        </div>

        <div>
          <label
            htmlFor="referencia"
            className="block text-xs uppercase tracking-[0.25em] text-[#8E8A80] font-mono"
          >
            {t("Obra, Serie o Formato de Referencia", "Reference Work, Series or Format")}{" "}
            <span className="text-[#8E8A80]/60">{t("(si aplica)", "(if applicable)")}</span>
          </label>
          <input
            id="referencia"
            type="text"
            value={formData.referencia}
            onChange={(e) => setFormData({ ...formData, referencia: e.target.value })}
            placeholder={t(
              "Ej. Descenso en la Roca / Formato Galería 50x70 cm",
              "e.g. Descent on the Rock / Gallery Format 50x70 cm"
            )}
            className="mt-2 w-full border border-white/[0.1] bg-[#0B0C0E] px-4 py-3 text-sm text-[#EBE7DF] placeholder-[#8E8A80]/40 transition focus:border-white/40 focus:outline-none"
          />
        </div>

        <div>
          <label
            htmlFor="mensaje"
            className="block text-xs uppercase tracking-[0.25em] text-[#8E8A80] font-mono"
          >
            {t("Detalle del Proyecto o Consulta", "Project or Inquiry Details")}{" "}
            <span className="text-[#EBE7DF]">*</span>
          </label>
          <textarea
            id="mensaje"
            required
            rows={5}
            value={formData.mensaje}
            onChange={(e) => setFormData({ ...formData, mensaje: e.target.value })}
            placeholder={t(
              "Describa el alcance del encargo, fechas previstas, requerimientos de entrega o especificaciones para obra impresa...",
              "Describe the project scope, planned dates, delivery requirements, or fine art print specifications..."
            )}
            className="mt-2 w-full border border-white/[0.1] bg-[#0B0C0E] px-4 py-3 text-sm text-[#EBE7DF] placeholder-[#8E8A80]/40 transition focus:border-white/40 focus:outline-none"
          />
        </div>

        {/* Protección Antispam: Honeypot + Cloudflare Turnstile */}
        <div className="border border-white/[0.06] bg-[#0B0C0E]/70 px-4 py-3 font-mono text-[10px] text-[#A39E93] flex flex-wrap items-center justify-between gap-2">
          <span>
            {t(
              "Protección Antispam activa (Honeypot + Cloudflare Turnstile)",
              "Active spam protection (Honeypot + Cloudflare Turnstile)"
            )}
          </span>
          {process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ? (
            <input
              type="hidden"
              name="cf-turnstile-response"
              value={turnstileToken}
              onChange={(e) => setTurnstileToken(e.target.value)}
            />
          ) : null}
        </div>

        <div className="flex items-start gap-3 pt-1">
          <input
            id="privacidad"
            type="checkbox"
            required
            checked={privacyAccepted}
            onChange={(e) => setPrivacyAccepted(e.target.checked)}
            className="mt-1 h-4 w-4 accent-[#EBE7DF]"
          />
          <label htmlFor="privacidad" className="text-xs text-[#A39E93] font-light leading-relaxed">
            {t("He leído y acepto la ", "I have read and accept the ")}
            <Link
              href="/legal#privacidad"
              className="text-[#EBE7DF] underline decoration-white/30 underline-offset-4 hover:text-white"
            >
              {t("Política de Privacidad (RGPD)", "Privacy Policy (GDPR)")}
            </Link>
            {t(
              ". Los datos facilitados se emplearán exclusivamente para responder a esta solicitud.",
              ". Submitted data will be used solely to respond to this inquiry."
            )}
          </label>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pt-2">
          <button
            type="submit"
            disabled={submitting || !privacyAccepted}
            className="inline-flex min-h-[44px] items-center justify-center border border-[#EBE7DF] bg-[#EBE7DF] px-8 py-3.5 font-mono text-xs uppercase tracking-[0.28em] text-[#0B0C0E] font-medium transition hover:bg-transparent hover:text-white disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
          >
            {submitting
              ? t("Transmitiendo solicitud...", "Sending inquiry...")
              : t("Enviar Solicitud", "Send Inquiry")}
          </button>

          <p className="font-mono text-[11px] text-[#A39E93]">
            {plazos.respuesta} ·{" "}
            <span className="text-[#EBE7DF]">
              {SITE_CONFIG.contactEmail}
            </span>
          </p>
        </div>
      </form>
    </>
  );
}
