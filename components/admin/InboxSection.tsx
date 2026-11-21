"use client";

import { useState } from "react";
import type { InboxItem, InboxStatus, InboxType } from "@/data/inbox";

interface InboxSectionProps {
  initialItems: InboxItem[];
  onToast: (text: string, type?: "success" | "error" | "warning") => void;
  onItemsChange?: (items: InboxItem[]) => void;
}

const TYPE_LABELS: Record<InboxType, { label: string; color: string }> = {
  pedido: {
    label: "Pedido Fine Art",
    color: "border-emerald-500/40 bg-emerald-500/15 text-emerald-300",
  },
  rally: {
    label: "Rally & Prensa",
    color: "border-sky-500/40 bg-sky-500/15 text-sky-300",
  },
  licencia: {
    label: "Licencia de Uso",
    color: "border-purple-500/40 bg-purple-500/15 text-purple-300",
  },
  consulta: {
    label: "Consulta General",
    color: "border-[#C5A880]/40 bg-[#C5A880]/15 text-[#C5A880]",
  },
};

const STATUS_CONFIG: Record<
  InboxStatus,
  { label: string; badgeClass: string; actionLabel: string }
> = {
  pendiente: {
    label: "Pendiente",
    badgeClass: "border-amber-500/50 bg-amber-500/20 text-amber-300",
    actionLabel: "Marcar Pendiente",
  },
  atendido: {
    label: "Atendido / En contacto",
    badgeClass: "border-sky-500/50 bg-sky-500/20 text-sky-300",
    actionLabel: "Marcar Atendido",
  },
  enviado: {
    label: "Enviado / Completado",
    badgeClass: "border-emerald-500/50 bg-emerald-500/20 text-emerald-300",
    actionLabel: "Marcar Enviado",
  },
  archivado: {
    label: "Archivado",
    badgeClass: "border-white/15 bg-white/10 text-[#A39E93]",
    actionLabel: "Archivar",
  },
};

function cleanPhoneForWhatsApp(phone?: string): string {
  if (!phone) return "";
  const cleaned = phone.replace(/[^0-9]/g, "");
  // Si no lleva código de país, asume España (+34)
  if (cleaned.length === 9) return `34${cleaned}`;
  return cleaned;
}

export default function InboxSection({
  initialItems,
  onToast,
  onItemsChange,
}: InboxSectionProps) {
  const [items, setItems] = useState<InboxItem[]>(initialItems);
  const [activeFilter, setActiveFilter] = useState<InboxType | "all">("all");
  const [activeStatus, setActiveStatus] = useState<InboxStatus | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [savingId, setSavingId] = useState<string | null>(null);
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [notesDraft, setNotesDraft] = useState("");

  const pendingCount = items.filter((it) => it.status === "pendiente").length;
  const attendedCount = items.filter((it) => it.status === "atendido").length;
  const completedCount = items.filter((it) => it.status === "enviado").length;

  const filteredItems = items.filter((it) => {
    if (activeFilter !== "all" && it.type !== activeFilter) return false;
    if (activeStatus !== "all" && it.status !== activeStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const haystack = `${it.customerName} ${it.customerEmail} ${
        it.customerPhone || ""
      } ${it.subject} ${it.message} ${it.notes || ""} ${
        it.photoTitle || ""
      }`.toLowerCase();
      return haystack.includes(q);
    }
    return true;
  });

  const handleUpdateStatus = async (id: string, newStatus: InboxStatus) => {
    setSavingId(id);
    try {
      const res = await fetch("/api/admin/inbox", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      const data = await res.json();
      if (data.ok && data.item) {
        setItems((prev) => {
          const updated = prev.map((it) => (it.id === id ? data.item : it));
          onItemsChange?.(updated);
          return updated;
        });
        onToast(`Registro ${id} marcado como "${STATUS_CONFIG[newStatus].label}"`);
      } else {
        onToast(data.error || "No se pudo actualizar el estado", "error");
      }
    } catch {
      onToast("Error de conexión al actualizar", "error");
    } finally {
      setSavingId(null);
    }
  };

  const handleSaveNotes = async (id: string) => {
    setSavingId(id);
    try {
      const res = await fetch("/api/admin/inbox", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, notes: notesDraft }),
      });
      const data = await res.json();
      if (data.ok && data.item) {
        setItems((prev) => {
          const updated = prev.map((it) => (it.id === id ? data.item : it));
          onItemsChange?.(updated);
          return updated;
        });
        setEditingNotesId(null);
        onToast(`Notas privadas guardadas para ${id}`);
      } else {
        onToast(data.error || "No se pudo guardar la nota", "error");
      }
    } catch {
      onToast("Error al guardar la nota", "error");
    } finally {
      setSavingId(null);
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (!confirm(`¿Eliminar definitivamente el registro ${id}?`)) return;
    setSavingId(id);
    try {
      const res = await fetch(`/api/admin/inbox?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.ok) {
        setItems((prev) => {
          const updated = prev.filter((it) => it.id !== id);
          onItemsChange?.(updated);
          return updated;
        });
        onToast(`Registro ${id} eliminado`, "success");
      } else {
        onToast(data.error || "No se pudo eliminar", "error");
      }
    } catch {
      onToast("Error de conexión al eliminar", "error");
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Resumen Superior de Estado */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <button
          type="button"
          onClick={() => setActiveStatus("pendiente")}
          className={`flex flex-col items-start rounded-xl border p-4 text-left transition cursor-pointer ${
            activeStatus === "pendiente"
              ? "border-amber-500/80 bg-amber-500/15 text-amber-200 ring-1 ring-amber-500"
              : "border-[#25272F] bg-[#15161B] text-[#A39E93] hover:border-amber-500/40"
          }`}
        >
          <span className="font-mono text-[10px] uppercase tracking-wider text-amber-400">
            Pendientes de atender
          </span>
          <span className="mt-1 font-serif text-3xl font-light text-[#EBE7DF]">
            {pendingCount}
          </span>
          <span className="mt-1 text-[11px] text-amber-400/90 font-mono">
            {pendingCount > 0 ? "Requieren respuesta rápida" : "Al día"}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveStatus("atendido")}
          className={`flex flex-col items-start rounded-xl border p-4 text-left transition cursor-pointer ${
            activeStatus === "atendido"
              ? "border-sky-500/80 bg-sky-500/15 text-sky-200 ring-1 ring-sky-500"
              : "border-[#25272F] bg-[#15161B] text-[#A39E93] hover:border-sky-500/40"
          }`}
        >
          <span className="font-mono text-[10px] uppercase tracking-wider text-sky-400">
            En conversación
          </span>
          <span className="mt-1 font-serif text-3xl font-light text-[#EBE7DF]">
            {attendedCount}
          </span>
          <span className="mt-1 text-[11px] text-[#A39E93] font-mono">
            Presupuesto o prueba enviada
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveStatus("enviado")}
          className={`flex flex-col items-start rounded-xl border p-4 text-left transition cursor-pointer ${
            activeStatus === "enviado"
              ? "border-emerald-500/80 bg-emerald-500/15 text-emerald-200 ring-1 ring-emerald-500"
              : "border-[#25272F] bg-[#15161B] text-[#A39E93] hover:border-emerald-500/40"
          }`}
        >
          <span className="font-mono text-[10px] uppercase tracking-wider text-emerald-400">
            Enviados / Listos
          </span>
          <span className="mt-1 font-serif text-3xl font-light text-[#EBE7DF]">
            {completedCount}
          </span>
          <span className="mt-1 text-[11px] text-[#A39E93] font-mono">
            Tubo rígido o archivo entregado
          </span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveStatus("all");
            setActiveFilter("all");
            setSearchQuery("");
          }}
          className={`flex flex-col items-start rounded-xl border p-4 text-left transition cursor-pointer ${
            activeStatus === "all" && activeFilter === "all" && !searchQuery
              ? "border-[#C5A880] bg-[#C5A880]/15 text-[#EBE7DF] ring-1 ring-[#C5A880]"
              : "border-[#25272F] bg-[#15161B] text-[#A39E93] hover:border-[#C5A880]/40"
          }`}
        >
          <span className="font-mono text-[10px] uppercase tracking-wider text-[#C5A880]">
            Total Registro
          </span>
          <span className="mt-1 font-serif text-3xl font-light text-[#EBE7DF]">
            {items.length}
          </span>
          <span className="mt-1 text-[11px] text-[#A39E93] font-mono">
            Ver todas las entradas
          </span>
        </button>
      </div>

      {/* Barra de Filtros y Búsqueda */}
      <div className="flex flex-col gap-4 rounded-xl border border-[#25272F] bg-[#16171C] p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          {(
            [
              { id: "all", label: "Todos los tipos" },
              { id: "pedido", label: "Pedidos Fine Art" },
              { id: "rally", label: "Rally & Escuderías" },
              { id: "consulta", label: "Consultas" },
              { id: "licencia", label: "Licencias" },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveFilter(tab.id)}
              className={`rounded-lg px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider transition cursor-pointer ${
                activeFilter === tab.id
                  ? "bg-[#C5A880] text-[#0B0C0E] font-semibold"
                  : "border border-[#2C2F38] bg-[#111215] text-[#A39E93] hover:text-[#EBE7DF]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="w-full sm:w-72">
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por cliente, obra o email..."
            className="w-full rounded-lg border border-[#2C2F38] bg-[#111215] px-3.5 py-2 font-mono text-xs text-[#EBE7DF] placeholder-[#716C62] focus:border-[#C5A880] focus:outline-none"
          />
        </div>
      </div>

      {/* Lista de Registros */}
      {filteredItems.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#2C2F38] bg-[#121316] p-12 text-center">
          <p className="font-mono text-xs uppercase tracking-wider text-[#A39E93]">
            No hay registros con los filtros seleccionados
          </p>
          <button
            type="button"
            onClick={() => {
              setActiveFilter("all");
              setActiveStatus("all");
              setSearchQuery("");
            }}
            className="mt-4 inline-flex items-center gap-2 rounded-lg border border-[#C5A880]/50 bg-[#C5A880]/15 px-4 py-2 font-mono text-xs uppercase tracking-wider text-[#C5A880] hover:bg-[#C5A880] hover:text-[#0B0C0E] transition cursor-pointer"
          >
            Limpiar filtros
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredItems.map((item) => {
            const typeInfo = TYPE_LABELS[item.type];
            const statusInfo = STATUS_CONFIG[item.status];
            const waNumber = cleanPhoneForWhatsApp(item.customerPhone);
            const waGreeting = encodeURIComponent(
              `Hola ${item.customerName}, soy Javier Espinosa. Te contacto respecto a tu mensaje en mi web (${item.subject}).`
            );
            const isEditingNotes = editingNotesId === item.id;

            return (
              <article
                key={item.id}
                className={`rounded-2xl border bg-[#14151A] p-5 sm:p-6 transition ${
                  item.status === "pendiente"
                    ? "border-amber-500/40 shadow-lg shadow-amber-500/5"
                    : "border-[#22242B] hover:border-[#2F323D]"
                }`}
              >
                {/* Cabecera del Registro */}
                <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[#202228] pb-4">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span
                      className={`rounded-md border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider font-semibold ${typeInfo.color}`}
                    >
                      {typeInfo.label}
                    </span>
                    <span
                      className={`rounded-md border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider ${statusInfo.badgeClass}`}
                    >
                      {statusInfo.label}
                    </span>
                    <span className="font-mono text-[11px] text-[#716C62]">
                      Ref: {item.id}
                    </span>
                  </div>

                  <span className="font-mono text-[11px] text-[#8E8A81]">
                    {new Date(item.createdAt).toLocaleString("es-ES", {
                      timeZone: "Europe/Madrid",
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>

                {/* Cuerpo Principal */}
                <div className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-12">
                  {/* Datos del Cliente y Botones Rápidos (4 cols) */}
                  <div className="space-y-3 lg:col-span-5 border-b border-[#202228] pb-4 lg:border-b-0 lg:border-r lg:pr-6">
                    <div>
                      <h3 className="font-serif text-xl font-light text-[#EBE7DF]">
                        {item.customerName}
                      </h3>
                      <div className="mt-1.5 space-y-1 font-mono text-xs">
                        <div className="flex items-center gap-2 text-[#A39E93]">
                          <span className="text-[#716C62]">✉</span>
                          <a
                            href={`mailto:${item.customerEmail}?subject=Re: ${encodeURIComponent(
                              item.subject
                            )}`}
                            className="hover:text-[#C5A880] transition underline underline-offset-2 truncate"
                          >
                            {item.customerEmail}
                          </a>
                        </div>
                        {item.customerPhone ? (
                          <div className="flex items-center gap-2 text-[#A39E93]">
                            <span className="text-[#716C62]">☎</span>
                            <a
                              href={`tel:${item.customerPhone}`}
                              className="hover:text-[#C5A880] transition"
                            >
                              {item.customerPhone}
                            </a>
                          </div>
                        ) : (
                          <span className="text-[11px] text-[#615C52]">
                            Sin teléfono facilitado
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Acciones Directas de Contacto */}
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      {waNumber && (
                        <a
                          href={`https://wa.me/${waNumber}?text=${waGreeting}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex min-h-[38px] items-center gap-1.5 rounded-lg border border-emerald-500/50 bg-emerald-500/20 px-3 py-1.5 font-mono text-xs font-semibold text-emerald-300 hover:bg-emerald-500 hover:text-[#0B0C0E] transition"
                          title="Abrir chat de WhatsApp con saludo automático"
                        >
                          <span>WhatsApp Directo →</span>
                        </a>
                      )}
                      <a
                        href={`mailto:${item.customerEmail}?subject=Re: ${encodeURIComponent(
                          item.subject
                        )}`}
                        className="inline-flex min-h-[38px] items-center gap-1.5 rounded-lg border border-[#2A2C34] bg-[#181A20] px-3 py-1.5 font-mono text-xs text-[#EBE7DF] hover:border-[#C5A880] hover:text-[#C5A880] transition"
                      >
                        <span>Responder Email</span>
                      </a>
                    </div>

                    {/* Dirección de Envío si es pedido */}
                    {item.shippingAddress && (
                      <div className="rounded-lg border border-[#22242B] bg-[#111215] p-2.5 font-mono text-[11px] text-[#A39E93]">
                        <span className="block text-[9px] uppercase tracking-wider text-[#716C62]">
                          Dirección de Envío:
                        </span>
                        <span className="text-[#EBE7DF] leading-tight block mt-0.5">
                          {item.shippingAddress}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Asunto, Obra y Mensaje del Cliente (7 cols) */}
                  <div className="space-y-3 lg:col-span-7">
                    <div>
                      <span className="font-mono text-[10px] uppercase tracking-wider text-[#C5A880]">
                        Asunto / Obra de Referencia:
                      </span>
                      <h4 className="mt-0.5 font-serif text-base text-[#EBE7DF]">
                        {item.subject}
                      </h4>
                    </div>

                    {/* Si es pedido, mostrar desglose de copias */}
                    {item.items && item.items.length > 0 && (
                      <div className="rounded-xl border border-white/[0.08] bg-[#0E0F12] p-3 space-y-1.5 font-mono text-xs">
                        <span className="block text-[10px] uppercase tracking-wider text-[#8E8A81]">
                          Desglose de Obras Solicitadas:
                        </span>
                        {item.items.map((it, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between text-[#EBE7DF] border-b border-white/[0.04] pb-1 last:border-b-0"
                          >
                            <span>
                              {it.quantity}× {it.title} ({it.format})
                            </span>
                            <span className="font-semibold text-[#C5A880]">
                              {it.price}&nbsp;€
                            </span>
                          </div>
                        ))}
                        {typeof item.orderTotal === "number" && (
                          <div className="pt-1.5 flex items-center justify-between text-sm font-semibold border-t border-white/[0.08]">
                            <span className="text-[#EBE7DF]">Total a Tramitar:</span>
                            <span className="text-[#C5A880] font-serif text-base">
                              {item.orderTotal}&nbsp;€
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Mensaje */}
                    {item.message && (
                      <div className="rounded-xl border border-[#22242B] bg-[#111215] p-3.5">
                        <span className="block font-mono text-[10px] uppercase tracking-wider text-[#716C62]">
                          Mensaje del Cliente:
                        </span>
                        <p className="mt-1 text-xs text-[#EBE7DF]/90 font-light leading-relaxed whitespace-pre-wrap">
                          {item.message}
                        </p>
                      </div>
                    )}

                    {/* Notas Privadas del Autor */}
                    <div className="rounded-xl border border-[#262832] bg-[#17181F] p-3">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] uppercase tracking-wider text-[#C5A880]">
                          Notas Privadas del Autor (Seguimiento, envío, pago):
                        </span>
                        {!isEditingNotes && (
                          <button
                            type="button"
                            onClick={() => {
                              setEditingNotesId(item.id);
                              setNotesDraft(item.notes || "");
                            }}
                            className="font-mono text-[10px] text-[#A39E93] hover:text-[#C5A880] underline cursor-pointer"
                          >
                            {item.notes ? "Editar nota" : "+ Añadir nota"}
                          </button>
                        )}
                      </div>

                      {isEditingNotes ? (
                        <div className="mt-2 space-y-2">
                          <textarea
                            rows={2}
                            value={notesDraft}
                            onChange={(e) => setNotesDraft(e.target.value)}
                            placeholder="Ej. Llamado el martes, tubo enviado con seguimiento Correos, pago confirmado por Bizum..."
                            className="w-full rounded-lg border border-[#3A3D48] bg-[#111215] p-2 font-mono text-xs text-[#EBE7DF] focus:border-[#C5A880] focus:outline-none"
                          />
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              disabled={savingId === item.id}
                              onClick={() => handleSaveNotes(item.id)}
                              className="rounded bg-[#C5A880] px-3 py-1 font-mono text-[10px] uppercase tracking-wider font-semibold text-[#0B0C0E] hover:opacity-90 cursor-pointer"
                            >
                              Guardar
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingNotesId(null)}
                              className="font-mono text-[10px] text-[#8E8A81] hover:text-white cursor-pointer"
                            >
                              Cancelar
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className="mt-1 font-mono text-xs text-[#A39E93] italic">
                          {item.notes || "Sin notas adicionales."}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Barra de Acciones y Cambio de Estado */}
                <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-[#202228] pt-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-[#716C62] mr-1">
                      Cambiar estado:
                    </span>
                    {(
                      [
                        "pendiente",
                        "atendido",
                        "enviado",
                        "archivado",
                      ] as InboxStatus[]
                    ).map((st) => (
                      <button
                        key={st}
                        type="button"
                        disabled={savingId === item.id || item.status === st}
                        onClick={() => handleUpdateStatus(item.id, st)}
                        className={`rounded-lg px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider transition cursor-pointer ${
                          item.status === st
                            ? "bg-[#C5A880] text-[#0B0C0E] font-semibold"
                            : "border border-[#282A33] bg-[#181A20] text-[#A39E93] hover:text-[#EBE7DF] disabled:opacity-30"
                        }`}
                      >
                        {STATUS_CONFIG[st].actionLabel}
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    disabled={savingId === item.id}
                    onClick={() => handleDeleteItem(item.id)}
                    className="font-mono text-[10px] uppercase tracking-wider text-rose-400/80 hover:text-rose-300 transition cursor-pointer"
                  >
                    Eliminar registro ✕
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
