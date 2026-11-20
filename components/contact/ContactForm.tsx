"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState, Suspense, useCallback } from "react";
import { getSavedWorks } from "@/components/photo/FavoriteButton";
import { trackEvent } from "@/lib/analytics";

interface SearchParamsSyncProps {
  onSync: (params: {
    motivo: string;
    obra: string;
    formato: string;
    tipo: string;
    servicio: string;
  }) => void;
}

function SearchParamsReader({ onSync }: SearchParamsSyncProps) {
  const searchParams = useSearchParams();
  const motivo = searchParams.get("motivo") || "";
  const obra = searchParams.get("obra") || "";
  const formato = searchParams.get("formato") || "";
  const tipo = searchParams.get("tipo") || "";
  const servicio = searchParams.get("servicio") || "";

  // Call parent once synchronously or on mount
  useState(() => {
    onSync({ motivo, obra, formato, tipo, servicio });
  });

  return null;
}

export default function ContactForm() {
  const [formData, setFormData] = useState(() => {
    let ref = "";
    if (typeof window !== "undefined") {
      const saved = getSavedWorks();
      if (saved.length > 0) {
        ref = `Selección guardada (${saved.length}): ${saved.join(", ")}`;
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
      tipo,
      servicio,
    }: {
      motivo: string;
      obra: string;
      formato: string;
      tipo: string;
      servicio: string;
    }) => {
      const servicioMap: Record<string, { motivo: string; label: string }> = {
        "rally-motor": {
          motivo: "encargo",
          label: "Servicio: Automovilismo y Rally Histórico",
        },
        "arquitectura-territorio": {
          motivo: "encargo",
          label: "Servicio: Arquitectura, Espacios y Patrimonio",
        },
        "documental-editorial": {
          motivo: "encargo",
          label: "Servicio: Proyectos Documentales y Editorial",
        },
        "prints-interiorismo": {
          motivo: "print",
          label: "Servicio: Copia de Autor Fine Art",
        },
      };

      const resolvedMotivo =
        servicio && servicioMap[servicio]
          ? servicioMap[servicio].motivo
          : motivo === "print"
          ? "print"
          : motivo === "licencia"
          ? "licencia"
          : motivo === "exposicion"
          ? "exposicion"
          : "";

      let resolvedRef = "";
      if (servicio && servicioMap[servicio]) {
        resolvedRef = servicioMap[servicio].label;
      }
      if (obra) resolvedRef += (resolvedRef ? " | " : "") + `Obra: ${obra}`;
      if (formato) resolvedRef += (resolvedRef ? " | " : "") + `Formato: ${formato}`;
      if (tipo) resolvedRef += (resolvedRef ? " | " : "") + `Tipo: ${tipo}`;

      setFormData((prev) => ({
        ...prev,
        motivo: resolvedMotivo || prev.motivo,
        referencia: resolvedRef || prev.referencia,
      }));
    },
    []
  );

  const mailtoLink = `mailto:javierespinosa1995@hotmail.com?subject=${encodeURIComponent(
    `[WEB · ${formData.motivo.toUpperCase()}] Consulta de ${formData.nombre || "Interesado"}`
  )}&body=${encodeURIComponent(
    `Nombre: ${formData.nombre}\nEmail: ${formData.email}\nTeléfono: ${formData.telefono || "No indicado"}\nMotivo: ${formData.motivo}\nReferencia / Obra: ${formData.referencia || "General"}\n\nMensaje:\n${formData.mensaje}`
  )}`;

  const handleCopy = () => {
    const textToCopy = `Para: javierespinosa1995@hotmail.com\nAsunto: [WEB · ${formData.motivo.toUpperCase()}] Consulta de ${formData.nombre}\n\nNombre: ${formData.nombre}\nEmail: ${formData.email}\nTeléfono: ${formData.telefono || "No indicado"}\nReferencia: ${formData.referencia || "General"}\n\nMensaje:\n${formData.mensaje}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError("");

    if (!privacyAccepted) {
      setValidationError("Debe aceptar la política de privacidad para enviar el formulario.");
      return;
    }

    if (!formData.nombre.trim()) {
      setValidationError("Por favor, introduzca su nombre o entidad.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email)) {
      setValidationError("Por favor, introduzca un correo electrónico válido.");
      return;
    }

    if (!formData.mensaje.trim() || formData.mensaje.trim().length < 10) {
      setValidationError("Por favor, describa con un poco más de detalle el objetivo de su consulta.");
      return;
    }

    setSubmitting(true);

    try {
      // 1. Try server route
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, _gotcha: honeypot }),
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
          "https://formsubmit.co/ajax/javierespinosa1995@hotmail.com",
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
          Solicitud Transmitida con Éxito
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-[#8E8A80] font-light max-w-lg mx-auto">
          Gracias por contactar, {formData.nombre}. Su mensaje ha sido registrado para{" "}
          <strong className="text-[#EBE7DF] font-medium">Javier Espinosa Martínez</strong> en{" "}
          <span className="font-mono text-[#EBE7DF]">javierespinosa1995@hotmail.com</span>.
          Recibirá respuesta orientativa en su correo{" "}
          <span className="font-mono text-[#EBE7DF]">{formData.email}</span> en un plazo estimado de 24 a 48 horas laborables.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <a
            href={mailtoLink}
            className="inline-flex border border-white/20 bg-transparent px-6 py-2.5 font-mono text-xs uppercase tracking-[0.22em] text-[#EBE7DF] transition hover:border-white/50 hover:text-white"
          >
            Abrir copia en mi gestor de correo →
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
            Enviar otra consulta
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
          Envío Directo Preparado
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-[#8E8A80] font-light max-w-lg mx-auto">
          Los datos de su consulta están listos y organizados. Para garantizar la recepción inmediata sin intermediarios técnicos, puede despacharlo directamente a{" "}
          <strong className="text-[#EBE7DF] font-medium font-mono">javierespinosa1995@hotmail.com</strong>.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href={mailtoLink}
            className="inline-flex border border-[#EBE7DF] bg-[#EBE7DF] px-8 py-3.5 font-mono text-xs uppercase tracking-[0.25em] text-[#0B0C0E] font-medium transition hover:bg-transparent hover:text-white"
          >
            Enviar por mi gestor de correo →
          </a>
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex border border-white/20 bg-[#0B0C0E] px-6 py-3.5 font-mono text-xs uppercase tracking-[0.22em] text-[#EBE7DF] transition hover:border-white/50 hover:text-white"
          >
            {copied ? "✓ Copiado al Portapapeles" : "Copiar Texto Completo"}
          </button>
        </div>

        <div className="mt-8 border-t border-white/[0.06] pt-6">
          <button
            type="button"
            onClick={() => setSubmissionStatus("idle")}
            className="font-mono text-xs text-[#8E8A80] hover:text-[#EBE7DF] underline underline-offset-4"
          >
            ← Volver a editar el formulario
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
              Nombre o Entidad <span className="text-[#EBE7DF]">*</span>
            </label>
            <input
              id="nombre"
              type="text"
              required
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              placeholder="Ej. Ana Morales / Escudería Norte"
              className="mt-2 w-full border border-white/[0.1] bg-[#0B0C0E] px-4 py-3 text-sm text-[#EBE7DF] placeholder-[#8E8A80]/40 transition focus:border-white/40 focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-xs uppercase tracking-[0.25em] text-[#8E8A80] font-mono"
            >
              Correo Electrónico <span className="text-[#EBE7DF]">*</span>
            </label>
            <input
              id="email"
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="contacto@ejemplo.com"
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
              Teléfono de Contacto <span className="text-[#8E8A80]/60">(Opcional)</span>
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
              Tipo de Consulta <span className="text-[#EBE7DF]">*</span>
            </label>
            <select
              id="motivo"
              value={formData.motivo}
              onChange={(e) => setFormData({ ...formData, motivo: e.target.value })}
              className="mt-2 w-full border border-white/[0.1] bg-[#0B0C0E] px-4 py-3 text-sm text-[#EBE7DF] transition focus:border-white/40 focus:outline-none"
            >
              <option value="encargo" className="bg-[#0B0C0E] text-[#EBE7DF]">
                Encargo Profesional (Rally / Arquitectura / Documental)
              </option>
              <option value="print" className="bg-[#0B0C0E] text-[#EBE7DF]">
                Adquisición de Copia Fine Art (Hahnemühle 308g)
              </option>
              <option value="licencia" className="bg-[#0B0C0E] text-[#EBE7DF]">
                Licencia de Derechos de Imagen (Editorial / Publicidad)
              </option>
              <option value="exposicion" className="bg-[#0B0C0E] text-[#EBE7DF]">
                Propuesta de Exposición, Galería o Prensa
              </option>
              <option value="general" className="bg-[#0B0C0E] text-[#EBE7DF]">
                Consulta General de Autor
              </option>
            </select>
          </div>
        </div>

        <div>
          <label
            htmlFor="referencia"
            className="block text-xs uppercase tracking-[0.25em] text-[#8E8A80] font-mono"
          >
            Obra, Serie o Formato de Referencia <span className="text-[#8E8A80]/60">(si aplica)</span>
          </label>
          <input
            id="referencia"
            type="text"
            value={formData.referencia}
            onChange={(e) => setFormData({ ...formData, referencia: e.target.value })}
            placeholder="Ej. Descenso en la Roca / Formato Galería 50x70 cm"
            className="mt-2 w-full border border-white/[0.1] bg-[#0B0C0E] px-4 py-3 text-sm text-[#EBE7DF] placeholder-[#8E8A80]/40 transition focus:border-white/40 focus:outline-none"
          />
        </div>

        <div>
          <label
            htmlFor="mensaje"
            className="block text-xs uppercase tracking-[0.25em] text-[#8E8A80] font-mono"
          >
            Detalle del Proyecto o Consulta <span className="text-[#EBE7DF]">*</span>
          </label>
          <textarea
            id="mensaje"
            required
            rows={5}
            value={formData.mensaje}
            onChange={(e) => setFormData({ ...formData, mensaje: e.target.value })}
            placeholder="Describa el alcance del encargo, fechas previstas, requerimientos de entrega o especificaciones para obra impresa..."
            className="mt-2 w-full border border-white/[0.1] bg-[#0B0C0E] px-4 py-3 text-sm text-[#EBE7DF] placeholder-[#8E8A80]/40 transition focus:border-white/40 focus:outline-none"
          />
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
          <label htmlFor="privacidad" className="text-xs text-[#8E8A80] font-light leading-relaxed">
            He leído y acepto la{" "}
            <Link
              href="/legal#privacidad"
              className="text-[#EBE7DF] underline decoration-white/30 underline-offset-4 hover:text-white"
            >
              Política de Privacidad (RGPD)
            </Link>
            . Los datos facilitados se emplearán exclusivamente para responder a esta solicitud profesional.
          </label>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pt-2">
          <button
            type="submit"
            disabled={submitting || !privacyAccepted}
            className="inline-flex items-center justify-center border border-[#EBE7DF] bg-[#EBE7DF] px-8 py-3.5 font-mono text-xs uppercase tracking-[0.28em] text-[#0B0C0E] font-medium transition hover:bg-transparent hover:text-white disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
          >
            {submitting ? "Transmitiendo solicitud..." : "Enviar Solicitud"}
          </button>

          <p className="font-mono text-[11px] text-[#8E8A80]">
            Destino directo: <span className="text-[#EBE7DF]">javierespinosa1995@hotmail.com</span>
          </p>
        </div>
      </form>
    </>
  );
}
