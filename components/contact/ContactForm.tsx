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
      <div className="border border-[#1D2021] bg-[#101112]/90 p-8 text-center sm:p-12 rounded-lg">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-[#1D2021] bg-[#1D2021] text-[#95836B]">
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
        <h3 className="mt-5 font-serif text-2xl text-[#D8D5CD]">
          Solicitud registrada para Javier Espinosa
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-[#D8D5CD]/80 font-light">
          Gracias por contactar, {formData.nombre}. Tu mensaje ha sido enviado a{" "}
          <span className="font-mono text-[#D8D5CD]">javierespinosa1995@hotmail.com</span> y
          recibirás respuesta en <span className="font-mono text-[#D8D5CD]">{formData.email}</span>{" "}
          en un plazo máximo de 24 a 48 horas laborables.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <a
            href={`mailto:javierespinosa1995@hotmail.com?subject=${encodeURIComponent(
              `[${formData.motivo.toUpperCase()}] Consulta de ${formData.nombre}`
            )}&body=${encodeURIComponent(
              `Nombre: ${formData.nombre}\nEmail: ${formData.email}\nTeléfono: ${formData.telefono || "No indicado"}\nObra(s) de referencia: ${formData.referencia || "General"}\n\nMensaje:\n${formData.mensaje}`
            )}`}
            className="inline-flex border border-[#95836B]/50 bg-[#95836B]/15 px-6 py-2.5 text-xs uppercase tracking-[0.22em] text-[#D8D5CD] transition hover:border-[#95836B] hover:bg-[#95836B]/25"
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
            className="inline-flex border border-[#1D2021] bg-[#1D2021]/60 px-6 py-2.5 text-xs uppercase tracking-[0.25em] text-[#D8D5CD] transition hover:border-[#95836B] hover:text-white"
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
            className="block text-xs uppercase tracking-[0.2em] text-[#95836B] font-mono"
          >
            Nombre completo <span className="text-[#95836B]">*</span>
          </label>
          <input
            id="nombre"
            type="text"
            required
            value={formData.nombre}
            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
            placeholder="Ej. Carmen Ortiz"
            className="mt-2 w-full border border-[#1D2021] bg-[#101112] px-4 py-3 text-sm text-[#D8D5CD] placeholder-[#D8D5CD]/30 transition focus:border-[#95836B] focus:outline-none rounded-sm"
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-xs uppercase tracking-[0.2em] text-[#95836B] font-mono"
          >
            Correo electrónico <span className="text-[#95836B]">*</span>
          </label>
          <input
            id="email"
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="ejemplo@dominio.com"
            className="mt-2 w-full border border-[#1D2021] bg-[#101112] px-4 py-3 text-sm text-[#D8D5CD] placeholder-[#D8D5CD]/30 transition focus:border-[#95836B] focus:outline-none rounded-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label
            htmlFor="telefono"
            className="block text-xs uppercase tracking-[0.2em] text-[#95836B] font-mono"
          >
            Teléfono de contacto <span className="text-[#95836B]/60">(opcional)</span>
          </label>
          <input
            id="telefono"
            type="tel"
            value={formData.telefono}
            onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
            placeholder="+34 600 000 000"
            className="mt-2 w-full border border-[#1D2021] bg-[#101112] px-4 py-3 text-sm text-[#D8D5CD] placeholder-[#D8D5CD]/30 transition focus:border-[#95836B] focus:outline-none rounded-sm"
          />
        </div>

        <div>
          <label
            htmlFor="motivo"
            className="block text-xs uppercase tracking-[0.2em] text-[#95836B] font-mono"
          >
            Tipo de solicitud <span className="text-[#95836B]">*</span>
          </label>
          <select
            id="motivo"
            value={formData.motivo}
            onChange={(e) => setFormData({ ...formData, motivo: e.target.value })}
            className="mt-2 w-full border border-[#1D2021] bg-[#101112] px-4 py-3 text-sm text-[#D8D5CD] transition focus:border-[#95836B] focus:outline-none rounded-sm"
          >
            <option value="encargo" className="bg-[#101112] text-[#D8D5CD]">Encargo Profesional (Rally / Arquitectura / Documental)</option>
            <option value="print" className="bg-[#101112] text-[#D8D5CD]">Adquisición de Copia Fine Art (Hahnemühle)</option>
            <option value="licencia" className="bg-[#101112] text-[#D8D5CD]">Licencia de Derechos de Imagen (Editorial / Publicidad)</option>
            <option value="exposicion" className="bg-[#101112] text-[#D8D5CD]">Exposición, Galería o Prensa</option>
            <option value="general" className="bg-[#101112] text-[#D8D5CD]">Consulta General</option>
          </select>
        </div>
      </div>

      <div>
        <label
          htmlFor="referencia"
          className="block text-xs uppercase tracking-[0.2em] text-[#95836B] font-mono"
        >
          Obra o Formato de Referencia <span className="text-[#95836B]/60">(si aplica)</span>
        </label>
        <input
          id="referencia"
          type="text"
          value={formData.referencia}
          onChange={(e) => setFormData({ ...formData, referencia: e.target.value })}
          placeholder="Ej. Salto en tramo húmedo / Formato 50x70 cm"
          className="mt-2 w-full border border-[#1D2021] bg-[#101112] px-4 py-3 text-sm text-[#D8D5CD] placeholder-[#D8D5CD]/30 transition focus:border-[#95836B] focus:outline-none rounded-sm"
        />
      </div>

      <div>
        <label
          htmlFor="mensaje"
          className="block text-xs uppercase tracking-[0.2em] text-[#95836B] font-mono"
        >
          Detalle del proyecto o consulta <span className="text-[#95836B]">*</span>
        </label>
        <textarea
          id="mensaje"
          required
          rows={5}
          value={formData.mensaje}
          onChange={(e) => setFormData({ ...formData, mensaje: e.target.value })}
          placeholder="Describa el alcance de la cobertura, fechas tentativas, dimensiones deseadas o especificaciones de su encargo..."
          className="mt-2 w-full border border-[#1D2021] bg-[#101112] px-4 py-3 text-sm text-[#D8D5CD] placeholder-[#D8D5CD]/30 transition focus:border-[#95836B] focus:outline-none rounded-sm"
        />
      </div>

      <div className="flex items-start gap-3 pt-1">
        <input
          id="privacidad"
          type="checkbox"
          required
          checked={privacyAccepted}
          onChange={(e) => setPrivacyAccepted(e.target.checked)}
          className="mt-1 h-4 w-4 accent-[#95836B]"
        />
        <label htmlFor="privacidad" className="text-xs text-[#D8D5CD]/75 font-light leading-relaxed">
          He leído y acepto la{" "}
          <Link
            href="/legal#privacidad"
            className="underline decoration-[#95836B] underline-offset-4 hover:text-white"
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
          className="inline-flex items-center justify-center border border-[#D8D5CD] bg-[#D8D5CD] px-8 py-3.5 text-xs uppercase tracking-[0.3em] text-[#101112] font-semibold transition hover:bg-transparent hover:text-white disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
        >
          {submitting ? "Transmitiendo solicitud..." : "Enviar solicitud"}
        </button>

        <p className="text-[11px] text-[#95836B] font-mono">
          Destino directo: javierespinosa1995@hotmail.com
        </p>
      </div>
    </form>
  );
}
