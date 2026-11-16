"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";

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

  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    motivo: initialMotivo,
    referencia: initialRef,
    mensaje: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    // Simulate brief network submission
    await new Promise((resolve) => setTimeout(resolve, 800));
    setSubmitting(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="border border-neutral-800 bg-neutral-950/80 p-8 text-center sm:p-12">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-neutral-700 bg-neutral-900 text-neutral-200">
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
        <h3 className="mt-5 font-serif text-2xl text-neutral-100">
          Mensaje transmitido correctamente
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-neutral-300">
          Gracias por contactar, {formData.nombre}. Javier Espinosa revisará su solicitud 
          y le responderá por correo electrónico ({formData.email}) en un plazo máximo de 24 a 48 horas laborables.
        </p>
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
          className="mt-8 inline-flex border border-neutral-700 bg-neutral-900 px-6 py-2.5 text-xs uppercase tracking-[0.25em] text-neutral-200 transition hover:border-white hover:text-white"
        >
          Enviar otra consulta
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label
            htmlFor="nombre"
            className="block text-xs uppercase tracking-[0.2em] text-neutral-400"
          >
            Nombre completo <span className="text-neutral-500">*</span>
          </label>
          <input
            id="nombre"
            type="text"
            required
            value={formData.nombre}
            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
            placeholder="Ej. Carmen Ortiz"
            className="mt-2 w-full border border-neutral-800 bg-neutral-950 px-4 py-3 text-sm text-neutral-100 placeholder-neutral-600 transition focus:border-neutral-400 focus:outline-none"
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-xs uppercase tracking-[0.2em] text-neutral-400"
          >
            Correo electrónico <span className="text-neutral-500">*</span>
          </label>
          <input
            id="email"
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="ejemplo@dominio.com"
            className="mt-2 w-full border border-neutral-800 bg-neutral-950 px-4 py-3 text-sm text-neutral-100 placeholder-neutral-600 transition focus:border-neutral-400 focus:outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label
            htmlFor="telefono"
            className="block text-xs uppercase tracking-[0.2em] text-neutral-400"
          >
            Teléfono de contacto <span className="text-neutral-600">(opcional)</span>
          </label>
          <input
            id="telefono"
            type="tel"
            value={formData.telefono}
            onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
            placeholder="+34 600 000 000"
            className="mt-2 w-full border border-neutral-800 bg-neutral-950 px-4 py-3 text-sm text-neutral-100 placeholder-neutral-600 transition focus:border-neutral-400 focus:outline-none"
          />
        </div>

        <div>
          <label
            htmlFor="motivo"
            className="block text-xs uppercase tracking-[0.2em] text-neutral-400"
          >
            Tipo de solicitud <span className="text-neutral-500">*</span>
          </label>
          <select
            id="motivo"
            value={formData.motivo}
            onChange={(e) => setFormData({ ...formData, motivo: e.target.value })}
            className="mt-2 w-full border border-neutral-800 bg-neutral-950 px-4 py-3 text-sm text-neutral-100 transition focus:border-neutral-400 focus:outline-none"
          >
            <option value="encargo" className="bg-neutral-900 text-neutral-200">Encargo Profesional (Rally / Arquitectura / Documental)</option>
            <option value="print" className="bg-neutral-900 text-neutral-200">Adquisición de Copia Fine Art (Hahnemühle)</option>
            <option value="licencia" className="bg-neutral-900 text-neutral-200">Licencia de Derechos de Imagen (Editorial / Publicidad)</option>
            <option value="exposicion" className="bg-neutral-900 text-neutral-200">Exposición, Galería o Prensa</option>
            <option value="general" className="bg-neutral-900 text-neutral-200">Consulta General</option>
          </select>
        </div>
      </div>

      <div>
        <label
          htmlFor="referencia"
          className="block text-xs uppercase tracking-[0.2em] text-neutral-400"
        >
          Obra o Formato de Referencia <span className="text-neutral-600">(si aplica)</span>
        </label>
        <input
          id="referencia"
          type="text"
          value={formData.referencia}
          onChange={(e) => setFormData({ ...formData, referencia: e.target.value })}
          placeholder="Ej. Salto en tramo húmedo / Formato 50x70 cm"
          className="mt-2 w-full border border-neutral-800 bg-neutral-950 px-4 py-3 text-sm text-neutral-100 placeholder-neutral-600 transition focus:border-neutral-400 focus:outline-none"
        />
      </div>

      <div>
        <label
          htmlFor="mensaje"
          className="block text-xs uppercase tracking-[0.2em] text-neutral-400"
        >
          Detalle del proyecto o consulta <span className="text-neutral-500">*</span>
        </label>
        <textarea
          id="mensaje"
          required
          rows={5}
          value={formData.mensaje}
          onChange={(e) => setFormData({ ...formData, mensaje: e.target.value })}
          placeholder="Describa el alcance de la cobertura, fechas tentativas, dimensiones deseadas o especificaciones de su encargo..."
          className="mt-2 w-full border border-neutral-800 bg-neutral-950 px-4 py-3 text-sm text-neutral-100 placeholder-neutral-600 transition focus:border-neutral-400 focus:outline-none"
        />
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pt-2">
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center justify-center border border-neutral-200 bg-neutral-100 px-8 py-3.5 text-xs uppercase tracking-[0.3em] text-neutral-950 font-medium transition hover:bg-white hover:text-black hover:border-white disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
        >
          {submitting ? "Transmitiendo solicitud..." : "Enviar solicitud"}
        </button>

        <p className="text-[11px] text-neutral-500">
          Sus datos solo se utilizarán para gestionar esta consulta.
        </p>
      </div>
    </form>
  );
}
