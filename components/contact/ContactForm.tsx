"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { getSavedWorks } from "@/components/photo/FavoriteButton";

export default function ContactForm() {
  const searchParams = useSearchParams();
  const motivoParam = searchParams.get("motivo") || "";
  const obraParam = searchParams.get("obra") || "";
  const formatoParam = searchParams.get("formato") || "";
  const tipoParam = searchParams.get("tipo") || "";
  const servicioParam = searchParams.get("servicio") || "";

  const servicioMap: Record<string, { motivo: string; label: string }> = {
    "rally-motor": { motivo: "encargo", label: "Servicio: Automovilismo y Rally Histórico" },
    "arquitectura-territorio": { motivo: "encargo", label: "Servicio: Arquitectura, Espacios y Patrimonio" },
    "documental-editorial": { motivo: "encargo", label: "Servicio: Proyectos Documentales y Editorial" },
    "prints-interiorismo": { motivo: "print", label: "Servicio: Copia de Autor Fine Art" },
  };

  const initialMotivo =
    servicioParam && servicioMap[servicioParam]
      ? servicioMap[servicioParam].motivo
      : motivoParam === "print"
      ? "print"
      : motivoParam === "licencia"
      ? "licencia"
      : motivoParam === "exposicion"
      ? "exposicion"
      : "encargo";

  let initialRef = "";
  if (servicioParam && servicioMap[servicioParam]) {
    initialRef = servicioMap[servicioParam].label;
  }
  if (obraParam) initialRef += (initialRef ? " | " : "") + `Obra: ${obraParam}`;
  if (formatoParam) initialRef += (initialRef ? " | " : "") + `Formato: ${formatoParam}`;
  if (tipoParam) initialRef += (initialRef ? " | " : "") + `Tipo: ${tipoParam}`;

  const [formData, setFormData] = useState(() => {
    let ref = initialRef;
    if (!ref) {
      const saved = getSavedWorks();
      if (saved.length > 0) {
        ref = `Selección guardada (${saved.length}): ${saved.join(", ")}`;
      }
    }
    return {
      nombre: "",
      email: "",
      telefono: "",
      motivo: initialMotivo,
      referencia: ref,
      mensaje: "",
    };
  });

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!privacyAccepted) return;
    setSubmitting(true);
    try {
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
    } catch {
      // Fallback available on confirmation view
    }
    setSubmitting(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="border border-[#202226] bg-[#0B0C0E]/90 p-8 text-center sm:p-12 rounded-lg">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-[#202226] bg-[#202226] text-[#8E8A80]">
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h3 className="mt-5 font-serif text-2xl text-[#EBE7DF]">
          Solicitud registrada para Javier Espinosa
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-[#EBE7DF]/80 font-light">
          Gracias por contactar, {formData.nombre}. Tu mensaje ha sido enviado a{" "}
          <span className="font-mono text-[#EBE7DF]">javierespinosa1995@hotmail.com</span> y
          recibirás respuesta en <span className="font-mono text-[#EBE7DF]">{formData.email}</span>{" "}
          en un plazo máximo de 24 a 48 horas laborables.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <a
            href={`mailto:javierespinosa1995@hotmail.com?subject=${encodeURIComponent(
              `[${formData.motivo.toUpperCase()}] Consulta de ${formData.nombre}`
            )}&body=${encodeURIComponent(
              `Nombre: ${formData.nombre}\nEmail: ${formData.email}\nTeléfono: ${formData.telefono || "No indicado"}\nObra(s) de referencia: ${formData.referencia || "General"}\n\nMensaje:\n${formData.mensaje}`
            )}`}
            className="inline-flex border border-[#8E8A80]/50 bg-[#8E8A80]/15 px-6 py-2.5 text-xs uppercase tracking-[0.22em] text-[#EBE7DF] transition hover:border-[#8E8A80] hover:bg-[#8E8A80]/25"
          >
            Enviar también desde tu gestor de correo →
          </a>
          <button
            type="button"
            onClick={() => {
              setSubmitted(false);
              setFormData({
                nombre: "",
                email: "",
                telefono: "",
                motivo: "encargo",
                referencia: "",
                mensaje: "",
              });
            }}
            className="inline-flex border border-[#202226] bg-[#202226]/60 px-6 py-2.5 text-xs uppercase tracking-[0.25em] text-[#EBE7DF] transition hover:border-[#8E8A80] hover:text-white"
          >
            Enviar otra consulta
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label
            htmlFor="nombre"
            className="block text-xs uppercase tracking-[0.2em] text-[#8E8A80] font-mono"
          >
            Nombre completo <span className="text-[#8E8A80]">*</span>
          </label>
          <input
            id="nombre"
            type="text"
            required
            value={formData.nombre}
            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
            placeholder="Ej. Carmen Ortiz"
            className="mt-2 w-full border border-[#202226] bg-[#0B0C0E] px-4 py-3 text-sm text-[#EBE7DF] placeholder-[#EBE7DF]/30 transition focus:border-[#8E8A80] focus:outline-none rounded-sm"
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-xs uppercase tracking-[0.2em] text-[#8E8A80] font-mono"
          >
            Correo electrónico <span className="text-[#8E8A80]">*</span>
          </label>
          <input
            id="email"
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="ejemplo@dominio.com"
            className="mt-2 w-full border border-[#202226] bg-[#0B0C0E] px-4 py-3 text-sm text-[#EBE7DF] placeholder-[#EBE7DF]/30 transition focus:border-[#8E8A80] focus:outline-none rounded-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label
            htmlFor="telefono"
            className="block text-xs uppercase tracking-[0.2em] text-[#8E8A80] font-mono"
          >
            Teléfono de contacto <span className="text-[#8E8A80]/60">(opcional)</span>
          </label>
          <input
            id="telefono"
            type="tel"
            value={formData.telefono}
            onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
            placeholder="+34 600 000 000"
            className="mt-2 w-full border border-[#202226] bg-[#0B0C0E] px-4 py-3 text-sm text-[#EBE7DF] placeholder-[#EBE7DF]/30 transition focus:border-[#8E8A80] focus:outline-none rounded-sm"
          />
        </div>

        <div>
          <label
            htmlFor="motivo"
            className="block text-xs uppercase tracking-[0.2em] text-[#8E8A80] font-mono"
          >
            Tipo de solicitud <span className="text-[#8E8A80]">*</span>
          </label>
          <select
            id="motivo"
            value={formData.motivo}
            onChange={(e) => setFormData({ ...formData, motivo: e.target.value })}
            className="mt-2 w-full border border-[#202226] bg-[#0B0C0E] px-4 py-3 text-sm text-[#EBE7DF] transition focus:border-[#8E8A80] focus:outline-none rounded-sm"
          >
            <option value="encargo" className="bg-[#0B0C0E] text-[#EBE7DF]">Encargo Profesional (Rally / Arquitectura / Documental)</option>
            <option value="print" className="bg-[#0B0C0E] text-[#EBE7DF]">Adquisición de Copia Fine Art (Hahnemühle)</option>
            <option value="licencia" className="bg-[#0B0C0E] text-[#EBE7DF]">Licencia de Derechos de Imagen (Editorial / Publicidad)</option>
            <option value="exposicion" className="bg-[#0B0C0E] text-[#EBE7DF]">Exposición, Galería o Prensa</option>
            <option value="general" className="bg-[#0B0C0E] text-[#EBE7DF]">Consulta General</option>
          </select>
        </div>
      </div>

      <div>
        <label
          htmlFor="referencia"
          className="block text-xs uppercase tracking-[0.2em] text-[#8E8A80] font-mono"
        >
          Obra o Formato de Referencia <span className="text-[#8E8A80]/60">(si aplica)</span>
        </label>
        <input
          id="referencia"
          type="text"
          value={formData.referencia}
          onChange={(e) => setFormData({ ...formData, referencia: e.target.value })}
          placeholder="Ej. Salto en tramo húmedo / Formato 50x70 cm"
          className="mt-2 w-full border border-[#202226] bg-[#0B0C0E] px-4 py-3 text-sm text-[#EBE7DF] placeholder-[#EBE7DF]/30 transition focus:border-[#8E8A80] focus:outline-none rounded-sm"
        />
      </div>

      <div>
        <label
          htmlFor="mensaje"
          className="block text-xs uppercase tracking-[0.2em] text-[#8E8A80] font-mono"
        >
          Detalle del proyecto o consulta <span className="text-[#8E8A80]">*</span>
        </label>
        <textarea
          id="mensaje"
          required
          rows={5}
          value={formData.mensaje}
          onChange={(e) => setFormData({ ...formData, mensaje: e.target.value })}
          placeholder="Describa el alcance de la cobertura, fechas tentativas, dimensiones deseadas o especificaciones de su encargo..."
          className="mt-2 w-full border border-[#202226] bg-[#0B0C0E] px-4 py-3 text-sm text-[#EBE7DF] placeholder-[#EBE7DF]/30 transition focus:border-[#8E8A80] focus:outline-none rounded-sm"
        />
      </div>

      <div className="flex items-start gap-3 pt-1">
        <input
          id="privacidad"
          type="checkbox"
          required
          checked={privacyAccepted}
          onChange={(e) => setPrivacyAccepted(e.target.checked)}
          className="mt-1 h-4 w-4 accent-[#8E8A80]"
        />
        <label htmlFor="privacidad" className="text-xs text-[#EBE7DF]/75 font-light leading-relaxed">
          He leído y acepto la{" "}
          <Link
            href="/legal#privacidad"
            className="underline decoration-[#8E8A80] underline-offset-4 hover:text-white"
          >
            Política de Privacidad y Protección de Datos (RGPD)
          </Link>
          . Mis datos se emplearán exclusivamente para responder a esta solicitud.
        </label>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pt-2">
        <button
          type="submit"
          disabled={submitting || !privacyAccepted}
          className="inline-flex items-center justify-center border border-[#EBE7DF] bg-[#EBE7DF] px-8 py-3.5 text-xs uppercase tracking-[0.3em] text-[#0B0C0E] font-semibold transition hover:bg-transparent hover:text-white disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
        >
          {submitting ? "Transmitiendo solicitud..." : "Enviar solicitud"}
        </button>

        <p className="text-[11px] text-[#8E8A80] font-mono">
          Destino directo: javierespinosa1995@hotmail.com
        </p>
      </div>
    </form>
  );
}
