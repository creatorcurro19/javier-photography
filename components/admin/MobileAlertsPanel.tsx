"use client";

import React, { useEffect, useState, useSyncExternalStore } from "react";
import { getAdminAuthHeaders } from "@/lib/admin-client";
import { BellIcon, CheckIcon } from "./AdminIcons";

interface HealthMobileStatus {
  mobilePush: {
    ntfyConfigured: boolean;
    telegramConfigured: boolean;
    ready: boolean;
  };
  email: {
    resendConfigured: boolean;
    fallbackRelay: string;
  };
}

interface MobileAlertsPanelProps {
  onToast: (text: string, type?: "success" | "error" | "warning") => void;
  onStatusLoaded?: (ready: boolean) => void;
}

const subscribeStandalone = (callback: () => void) => {
  if (typeof window === "undefined") return () => {};
  const mq = window.matchMedia("(display-mode: standalone)");
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
};

const getStandaloneSnapshot = () => {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as { standalone?: boolean }).standalone === true
  );
};

export default function MobileAlertsPanel({
  onToast,
  onStatusLoaded,
}: MobileAlertsPanelProps) {
  const isStandalone = useSyncExternalStore(
    subscribeStandalone,
    getStandaloneSnapshot,
    () => false
  );
  const [status, setStatus] = useState<HealthMobileStatus | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    ok: boolean;
    message: string;
  } | null>(null);

  useEffect(() => {
    fetch("/api/health", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.integrations) {
          const next: HealthMobileStatus = {
            mobilePush: data.integrations.mobilePush ?? {
              ntfyConfigured: false,
              telegramConfigured: false,
              ready: false,
            },
            email: data.integrations.email ?? {
              resendConfigured: false,
              fallbackRelay: "formsubmit",
            },
          };
          setStatus(next);
          onStatusLoaded?.(next.mobilePush.ready);
        }
      })
      .catch(() => null);
  }, [onStatusLoaded]);

  const handleSendTestPush = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const res = await fetch("/api/admin/notify-test", {
        method: "POST",
        headers: getAdminAuthHeaders(),
      });
      const data = await res.json().catch(() => null);

      if (data?.ok) {
        const channels: string[] = [];
        if (data.result?.ntfySent) channels.push("ntfy");
        if (data.result?.telegramSent) channels.push("Telegram");
        const msg = `Notificación de prueba enviada (${channels.join(" + ") || "móvil"}). Debería llegar a tu iPhone en segundos.`;
        setTestResult({ ok: true, message: msg });
        onToast(msg, "success");
      } else {
        const msg =
          data?.error ||
          "Aún falta configurar ADMIN_NTFY_TOPIC o TELEGRAM_BOT_TOKEN en Vercel.";
        setTestResult({ ok: false, message: msg });
        onToast(msg, "warning");
      }
    } catch {
      const msg = "No se pudo conectar con /api/admin/notify-test.";
      setTestResult({ ok: false, message: msg });
      onToast(msg, "error");
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Estado de la App en iPhone (PWA) */}
      <section className="rounded-2xl border border-[#24262E] bg-[#131418] p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#C5A880]/40 bg-[#C5A880]/10 text-[#C5A880]">
              <BellIcon className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-serif text-lg font-medium text-[#EBE7DF]">
                Versión App iPhone & Avisos en Directo
              </h2>
              <p className="mt-1 text-xs leading-relaxed text-[#A39E93]">
                {isStandalone
                  ? "Estás usando la app instalada del Estudio en pantalla completa. Al abrirla entra directa en tus consultas y sincroniza los avisos automáticamente."
                  : "Instala este panel como una app independiente en tu iPhone para entrar directo sin barras de navegador y ver el globo de mensajes pendientes."}
              </p>
            </div>
          </div>

          <span
            className={`shrink-0 rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-wider ${
              isStandalone
                ? "border-emerald-500/40 bg-emerald-500/15 text-emerald-300"
                : "border-[#C5A880]/40 bg-[#C5A880]/10 text-[#C5A880]"
            }`}
          >
            {isStandalone ? "✓ App iOS Activa" : "Safari Web"}
          </span>
        </div>

        {!isStandalone && (
          <div className="mt-4 rounded-xl border border-[#272932] bg-[#0E0F12] p-4 text-xs text-[#D4CEC3] space-y-2">
            <p className="font-mono text-[10px] uppercase tracking-wider text-[#C5A880]">
              Cómo instalar la App Admin en tu iPhone (15 segundos):
            </p>
            <ol className="list-decimal list-inside space-y-1.5 text-[#A39E93]">
              <li>
                Abre <strong className="text-[#EBE7DF]">javier-photography.vercel.app/admin</strong> en{" "}
                <strong className="text-[#EBE7DF]">Safari</strong> desde el iPhone.
              </li>
              <li>
                Toca el botón <strong className="text-[#EBE7DF]">Compartir</strong> (cuadrado con flecha hacia arriba).
              </li>
              <li>
                Elige <strong className="text-[#EBE7DF]">Añadir a pantalla de inicio</strong> → nombre{" "}
                <span className="font-mono text-[#EBE7DF]">J.E. Admin</span> → <strong className="text-[#EBE7DF]">Añadir</strong>.
              </li>
            </ol>
          </div>
        )}
      </section>

      {/* 2. Canales Push Instantáneos hacia iPhone */}
      <section className="rounded-2xl border border-[#24262E] bg-[#131418] p-5 sm:p-6 space-y-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="font-serif text-lg font-medium text-[#EBE7DF]">
              Notificaciones Push al iPhone
            </h3>
            <p className="mt-0.5 text-xs text-[#A39E93]">
              Cada consulta, pedido Fine Art, pago confirmado con Stripe o nuevo suscriptor envía una notificación inmediata con acceso directo a la bandeja.
            </p>
          </div>

          <button
            type="button"
            disabled={isTesting}
            onClick={handleSendTestPush}
            className="inline-flex min-h-[44px] shrink-0 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#C5A880] to-[#A88C64] px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#0B0C0E] shadow-lg transition hover:opacity-95 disabled:opacity-50 cursor-pointer"
          >
            <BellIcon className="h-4 w-4 text-[#0B0C0E]" />
            <span>{isTesting ? "Enviando…" : "Enviar notificación de prueba"}</span>
          </button>
        </div>

        {testResult && (
          <div
            className={`rounded-xl border px-4 py-3 text-xs ${
              testResult.ok
                ? "border-emerald-500/40 bg-emerald-950/25 text-emerald-200"
                : "border-amber-500/40 bg-amber-950/25 text-amber-200"
            }`}
          >
            {testResult.message}
          </div>
        )}

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-[#252730] bg-[#16171C] p-4">
            <span className="font-mono text-[10px] uppercase tracking-wider text-[#8E8A81]">
              Canal Push · ntfy
            </span>
            <div className="mt-1.5 flex items-center justify-between">
              <span className="text-sm font-medium text-[#EBE7DF]">
                {status?.mobilePush.ntfyConfigured ? "Conectado" : "Pendiente"}
              </span>
              {status?.mobilePush.ntfyConfigured ? (
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                  <CheckIcon className="h-4 w-4" />
                </span>
              ) : (
                <span className="rounded-full bg-amber-500/15 px-2 py-0.5 font-mono text-[10px] text-amber-300">
                  1 variable
                </span>
              )}
            </div>
          </div>

          <div className="rounded-xl border border-[#252730] bg-[#16171C] p-4">
            <span className="font-mono text-[10px] uppercase tracking-wider text-[#8E8A81]">
              Alternativa · Telegram
            </span>
            <div className="mt-1.5 flex items-center justify-between">
              <span className="text-sm font-medium text-[#EBE7DF]">
                {status?.mobilePush.telegramConfigured ? "Conectado" : "Opcional"}
              </span>
              {status?.mobilePush.telegramConfigured ? (
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                  <CheckIcon className="h-4 w-4" />
                </span>
              ) : (
                <span className="rounded-full bg-[#22242B] px-2 py-0.5 font-mono text-[10px] text-[#8E8A81]">
                  Inactivo
                </span>
              )}
            </div>
          </div>

          <div className="rounded-xl border border-[#252730] bg-[#16171C] p-4">
            <span className="font-mono text-[10px] uppercase tracking-wider text-[#8E8A81]">
              Correo · Resend / Relé
            </span>
            <div className="mt-1.5 flex items-center justify-between">
              <span className="text-sm font-medium text-[#EBE7DF]">
                {status?.email.resendConfigured ? "Resend Activo" : "FormSubmit"}
              </span>
              <span className="rounded-full bg-[#22242B] px-2 py-0.5 font-mono text-[10px] text-[#C5A880]">
                {status?.email.resendConfigured ? "API" : "Respaldo"}
              </span>
            </div>
          </div>
        </div>

        {/* Guía rápida de activación en 1 minuto */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="rounded-xl border border-[#252730] bg-[#0E0F12] p-4 text-xs text-[#A39E93] space-y-2">
            <span className="block font-mono text-[10px] uppercase tracking-wider text-[#C5A880]">
              Opción A (Más rápida · Sin cuentas): ntfy en iPhone
            </span>
            <ol className="list-decimal list-inside space-y-1.5 leading-relaxed">
              <li>
                Descarga la app gratuita <strong className="text-[#EBE7DF]">ntfy</strong> del App Store en tu iPhone y acepta las notificaciones.
              </li>
              <li>
                Pulsa <strong className="text-[#EBE7DF]">+</strong> e inventa un nombre privado difícil de adivinar (ej.{" "}
                <code className="text-[#EBE7DF]">je-estudio-9482a7c1</code>).
              </li>
              <li>
                En <strong className="text-[#EBE7DF]">Vercel → Settings → Environment Variables</strong> añade{" "}
                <code className="text-[#C5A880]">ADMIN_NTFY_TOPIC</code> con ese nombre y haz Redeploy.
              </li>
            </ol>
          </div>

          <div className="rounded-xl border border-[#252730] bg-[#0E0F12] p-4 text-xs text-[#A39E93] space-y-2">
            <span className="block font-mono text-[10px] uppercase tracking-wider text-[#C5A880]">
              Opción B (Alternativa): Bot de Telegram
            </span>
            <ol className="list-decimal list-inside space-y-1.5 leading-relaxed">
              <li>
                Abre <strong className="text-[#EBE7DF]">@BotFather</strong> en Telegram, escribe{" "}
                <code className="text-[#EBE7DF]">/newbot</code> y copia el token generado.
              </li>
              <li>
                Abre conversación con tu nuevo bot, pulsa Iniciar y obtén tu ID numérico con{" "}
                <strong className="text-[#EBE7DF]">@userinfobot</strong>.
              </li>
              <li>
                Añade en Vercel <code className="text-[#C5A880]">TELEGRAM_BOT_TOKEN</code> y{" "}
                <code className="text-[#C5A880]">TELEGRAM_CHAT_ID</code> y haz Redeploy.
              </li>
            </ol>
          </div>
        </div>
      </section>
    </div>
  );
}
