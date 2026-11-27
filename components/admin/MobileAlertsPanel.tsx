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
    recipientOverride: boolean;
    fallbackRelay: string;
  };
  stripe: {
    configured: boolean;
    webhookConfigured: boolean;
    ready: boolean;
    mode: "live" | "test" | "unconfigured";
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

  // Asistente de configuración Telegram (sin persistir el token en navegador)
  const [tgToken, setTgToken] = useState("");
  const [tgLoading, setTgLoading] = useState(false);
  const [tgDetected, setTgDetected] = useState<{
    botUsername: string | null;
    chatId: string;
    chatLabel: string;
    testSent: boolean;
  } | null>(null);
  const [tgError, setTgError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/health", { cache: "no-store", credentials: "same-origin" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.integrations) {
          const next: HealthMobileStatus = {
            mobilePush: data.integrations.mobilePush ?? {
              ntfyConfigured: false,
              telegramConfigured: false,
              ready: false,
            },
            email: {
              resendConfigured: Boolean(data.integrations.email?.resendConfigured),
              recipientOverride: Boolean(data.integrations.email?.recipientOverride),
              fallbackRelay: data.integrations.email?.fallbackRelay ?? "formsubmit",
            },
            stripe: {
              configured: Boolean(data.integrations.stripe?.configured),
              webhookConfigured: Boolean(data.integrations.stripe?.webhookConfigured),
              ready: Boolean(data.integrations.stripe?.ready),
              mode: data.integrations.stripe?.mode ?? "unconfigured",
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
        if (data.result?.telegramSent) channels.push("Telegram");
        if (data.result?.ntfySent) channels.push("ntfy");
        const msg = `Notificación de prueba enviada (${channels.join(" + ") || "móvil"}). Revisa tu iPhone.`;
        setTestResult({ ok: true, message: msg });
        onToast(msg, "success");
      } else {
        const msg =
          data?.error ||
          "Aún falta configurar TELEGRAM_BOT_TOKEN + TELEGRAM_CHAT_ID (o ADMIN_NTFY_TOPIC) en Vercel.";
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

  const handleDetectTelegramChat = async (e: React.FormEvent) => {
    e.preventDefault();
    setTgLoading(true);
    setTgError(null);
    setTgDetected(null);

    try {
      const res = await fetch("/api/admin/telegram-detect", {
        method: "POST",
        headers: getAdminAuthHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify({
          token: tgToken.trim(),
          sendTest: true,
        }),
      });
      const data = await res.json().catch(() => null);

      if (res.ok && data?.ok) {
        setTgDetected({
          botUsername: data.botUsername,
          chatId: data.chatId,
          chatLabel: data.chatLabel,
          testSent: Boolean(data.testSent),
        });
        onToast(`Chat ID detectado: ${data.chatId}`, "success");
      } else {
        setTgError(data?.error || "No se pudo detectar el chat de Telegram.");
      }
    } catch {
      setTgError("Error de conexión al consultar la API de Telegram.");
    } finally {
      setTgLoading(false);
    }
  };

  const allMainChannelsReady = Boolean(
    status &&
      status.mobilePush.ready &&
      status.email.resendConfigured &&
      status.stripe.ready
  );

  return (
    <div className="space-y-6">
      {/* 1. Estado Global & Prueba en Vivo */}
      <section className="rounded-2xl border border-[#24262E] bg-[#131418] p-5 sm:p-6 space-y-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h2 className="font-serif text-lg font-medium text-[#EBE7DF]">
                Estado de Avisos y Canales
              </h2>
              {status ? (
                <span
                  className={`rounded-full border px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider ${
                    allMainChannelsReady
                      ? "border-emerald-500/40 bg-emerald-500/15 text-emerald-300"
                      : "border-[#C5A880]/40 bg-[#C5A880]/10 text-[#C5A880]"
                  }`}
                >
                  {allMainChannelsReady ? "✓ Todo activo" : "Estado parcial"}
                </span>
              ) : (
                <span className="rounded-full border border-white/10 bg-[#1B1D24] px-2.5 py-0.5 font-mono text-[10px] text-[#A39E93]">
                  Comprobando…
                </span>
              )}
            </div>
            <p className="mt-1 text-xs text-[#A39E93] leading-relaxed">
              {status?.mobilePush.ready
                ? "Cada compra con Stripe, consulta o nuevo suscriptor envía aviso inmediato a tu Telegram, push al móvil y correo por Resend."
                : "Estado en tiempo real de tus avisos al iPhone, correo transaccional y pasarela de pago."}
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

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-[#252730] bg-[#16171C] p-4">
            <span className="font-mono text-[10px] uppercase tracking-wider text-[#8E8A81]">
              Bot de Telegram
            </span>
            <div className="mt-1.5 flex items-center justify-between">
              <span className="text-sm font-medium text-[#EBE7DF]">
                {!status
                  ? "Comprobando…"
                  : status.mobilePush.telegramConfigured
                  ? "Conectado"
                  : "Pendiente"}
              </span>
              {status?.mobilePush.telegramConfigured ? (
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                  <CheckIcon className="h-4 w-4" />
                </span>
              ) : status ? (
                <span className="rounded-full bg-amber-500/15 px-2 py-0.5 font-mono text-[10px] text-amber-300">
                  Pendiente
                </span>
              ) : null}
            </div>
          </div>

          <div className="rounded-xl border border-[#252730] bg-[#16171C] p-4">
            <span className="font-mono text-[10px] uppercase tracking-wider text-[#8E8A81]">
              Respaldo Push · ntfy
            </span>
            <div className="mt-1.5 flex items-center justify-between">
              <span className="text-sm font-medium text-[#EBE7DF]">
                {!status
                  ? "Comprobando…"
                  : status.mobilePush.ntfyConfigured
                  ? "Conectado"
                  : "Inactivo"}
              </span>
              {status?.mobilePush.ntfyConfigured ? (
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                  <CheckIcon className="h-4 w-4" />
                </span>
              ) : status ? (
                <span className="rounded-full bg-[#22242B] px-2 py-0.5 font-mono text-[10px] text-[#8E8A81]">
                  Opcional
                </span>
              ) : null}
            </div>
          </div>

          <div className="rounded-xl border border-[#252730] bg-[#16171C] p-4">
            <span className="font-mono text-[10px] uppercase tracking-wider text-[#8E8A81]">
              Correo · Resend
            </span>
            <div className="mt-1.5 flex items-center justify-between">
              <span className="text-sm font-medium text-[#EBE7DF]">
                {!status
                  ? "Comprobando…"
                  : status.email.resendConfigured
                  ? "Resend Activo"
                  : "FormSubmit"}
              </span>
              {status?.email.resendConfigured ? (
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                  <CheckIcon className="h-4 w-4" />
                </span>
              ) : status ? (
                <span className="rounded-full bg-[#22242B] px-2 py-0.5 font-mono text-[10px] text-[#C5A880]">
                  Respaldo
                </span>
              ) : null}
            </div>
          </div>

          <div className="rounded-xl border border-[#252730] bg-[#16171C] p-4">
            <span className="font-mono text-[10px] uppercase tracking-wider text-[#8E8A81]">
              Pagos · Stripe
            </span>
            <div className="mt-1.5 flex items-center justify-between">
              <span className="text-sm font-medium text-[#EBE7DF]">
                {!status
                  ? "Comprobando…"
                  : status.stripe.ready
                  ? status.stripe.mode === "live"
                    ? "Live · Activo"
                    : "Modo Pruebas"
                  : "Pendiente"}
              </span>
              {status?.stripe.ready ? (
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                  <CheckIcon className="h-4 w-4" />
                </span>
              ) : status ? (
                <span className="rounded-full bg-amber-500/15 px-2 py-0.5 font-mono text-[10px] text-amber-300">
                  Revisar
                </span>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      {/* 2. Estado de la App en iPhone (PWA) */}
      <section className="rounded-2xl border border-[#24262E] bg-[#131418] p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#C5A880]/40 bg-[#C5A880]/10 text-[#C5A880]">
              <BellIcon className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-medium text-[#EBE7DF]">
                App Estudio en iPhone (PWA)
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-[#A39E93]">
                {isStandalone
                  ? "Usando la app instalada en pantalla completa. Al abrirla entra directa en tus consultas y sincroniza el contador."
                  : "Accesible como app de pantalla de inicio en iOS sin barras del navegador."}
              </p>
            </div>
          </div>

          <span
            className={`shrink-0 rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-wider ${
              isStandalone
                ? "border-emerald-500/40 bg-emerald-500/15 text-emerald-300"
                : "border-[#2B2D36] bg-[#191B22] text-[#A39E93]"
            }`}
          >
            {isStandalone ? "✓ App iOS Activa" : "Navegador Web"}
          </span>
        </div>

        {!isStandalone && (
          <details className="mt-4 rounded-xl border border-[#22242C] bg-[#0E0F12]/80 px-4 py-3 text-xs text-[#D4CEC3]">
            <summary className="cursor-pointer font-mono text-[10px] uppercase tracking-wider text-[#C5A880] hover:text-white transition">
              Cómo instalar o reinstalar el icono en iPhone (opcional) →
            </summary>
            <ol className="mt-3 list-decimal list-inside space-y-1.5 text-[#A39E93]">
              <li>
                Abre <strong className="text-[#EBE7DF]">javier-photography.vercel.app/admin</strong> en{" "}
                <strong className="text-[#EBE7DF]">Safari</strong> desde el iPhone.
              </li>
              <li>
                Toca <strong className="text-[#EBE7DF]">Compartir</strong> →{" "}
                <strong className="text-[#EBE7DF]">Añadir a pantalla de inicio</strong> → nombre{" "}
                <span className="font-mono text-[#EBE7DF]">J.E. Admin</span> → <strong className="text-[#EBE7DF]">Añadir</strong>.
              </li>
            </ol>
          </details>
        )}
      </section>

      {/* 3. Asistente Telegram: abierto solo si falta configurar; plegado si ya está conectado */}
      {status && !status.mobilePush.telegramConfigured ? (
        <section className="rounded-2xl border border-[#2B2E38] bg-[#0E0F12] p-5 sm:p-6 space-y-4">
          <div>
            <span className="block font-mono text-[10px] uppercase tracking-wider text-[#C5A880]">
              Detector automático de Chat ID (Telegram)
            </span>
            <p className="mt-1 text-xs text-[#A39E93] leading-relaxed">
              1. Crea tu bot en <strong className="text-[#EBE7DF]">@BotFather</strong> (<code className="text-[#EBE7DF]">/newbot</code>) y copia el token. 2. Abre tu nuevo bot en Telegram y envíale «hola». 3. Pega el token aquí para sacar tu <code className="text-[#C5A880]">TELEGRAM_CHAT_ID</code> y probarlo:
            </p>
          </div>

          <form onSubmit={handleDetectTelegramChat} className="flex flex-col gap-2.5 sm:flex-row">
            <input
              type="password"
              value={tgToken}
              onChange={(e) => setTgToken(e.target.value)}
              placeholder="Pega aquí el token de @BotFather (ej. 7845123456:AAH...)"
              className="flex-1 rounded-lg border border-[#2A2D36] bg-[#15161B] px-3.5 py-2.5 font-mono text-xs text-[#EBE7DF] placeholder-[#68645C] focus:border-[#C5A880] focus:outline-none"
            />
            <button
              type="submit"
              disabled={tgLoading}
              className="shrink-0 rounded-lg border border-[#C5A880]/60 bg-[#C5A880]/15 px-4 py-2.5 font-mono text-xs uppercase tracking-wider font-semibold text-[#C5A880] hover:bg-[#C5A880] hover:text-[#0B0C0E] disabled:opacity-50 transition cursor-pointer"
            >
              {tgLoading ? "Buscando…" : "Detectar Chat ID y Probar"}
            </button>
          </form>

          {tgError && (
            <p className="rounded-lg border border-amber-500/35 bg-amber-950/20 px-3.5 py-2.5 text-xs text-amber-200">
              {tgError}
            </p>
          )}

          {tgDetected && (
            <div className="rounded-lg border border-emerald-500/40 bg-emerald-950/20 p-3.5 text-xs text-emerald-200 space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span>
                  ✓ Chat encontrado:{" "}
                  <strong className="text-white">{tgDetected.chatLabel}</strong>
                  {tgDetected.botUsername ? ` via @${tgDetected.botUsername}` : ""}
                </span>
                {tgDetected.testSent && (
                  <span className="font-mono text-[10px] text-emerald-300">
                    ✓ Mensaje de prueba enviado a tu Telegram
                  </span>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-2 font-mono">
                <span className="text-[#A39E93]">TELEGRAM_CHAT_ID =</span>
                <code className="rounded bg-black/50 px-2.5 py-1 text-sm font-bold text-[#C5A880] select-all">
                  {tgDetected.chatId}
                </code>
              </div>
              <p className="text-[11px] text-emerald-200/80">
                Pega <code className="text-white">TELEGRAM_BOT_TOKEN</code> y{" "}
                <code className="text-white">TELEGRAM_CHAT_ID</code> en{" "}
                <strong>Vercel → Settings → Environment Variables</strong> y haz{" "}
                <strong>Redeploy</strong>.
              </p>
            </div>
          )}
        </section>
      ) : status?.mobilePush.telegramConfigured ? (
        <details className="rounded-2xl border border-[#22242B] bg-[#101115] p-4 sm:p-5 text-xs">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-wider text-emerald-400">
                ✓ Bot de Telegram ya conectado
              </span>
              <p className="mt-0.5 text-xs text-[#8E8A81]">
                Opciones avanzadas · Pulsa aquí solo si cambias de bot o de cuenta de Telegram
              </p>
            </div>
            <span className="shrink-0 font-mono text-[10px] uppercase tracking-wider text-[#C5A880]">
              Reconfigurar ▾
            </span>
          </summary>

          <div className="mt-4 border-t border-[#22242B] pt-4 space-y-3">
            <form onSubmit={handleDetectTelegramChat} className="flex flex-col gap-2.5 sm:flex-row">
              <input
                type="password"
                value={tgToken}
                onChange={(e) => setTgToken(e.target.value)}
                placeholder="Deja vacío para usar el token actual en Vercel o pega otro..."
                className="flex-1 rounded-lg border border-[#2A2D36] bg-[#15161B] px-3.5 py-2.5 font-mono text-xs text-[#EBE7DF] placeholder-[#68645C] focus:border-[#C5A880] focus:outline-none"
              />
              <button
                type="submit"
                disabled={tgLoading}
                className="shrink-0 rounded-lg border border-[#C5A880]/60 bg-[#C5A880]/15 px-4 py-2.5 font-mono text-xs uppercase tracking-wider font-semibold text-[#C5A880] hover:bg-[#C5A880] hover:text-[#0B0C0E] disabled:opacity-50 transition cursor-pointer"
              >
                {tgLoading ? "Buscando…" : "Detectar nuevo Chat ID"}
              </button>
            </form>

            {tgError && (
              <p className="rounded-lg border border-amber-500/35 bg-amber-950/20 px-3.5 py-2.5 text-xs text-amber-200">
                {tgError}
              </p>
            )}

            {tgDetected && (
              <div className="rounded-lg border border-emerald-500/40 bg-emerald-950/20 p-3.5 text-xs text-emerald-200 space-y-2">
                <span>
                  ✓ Chat encontrado:{" "}
                  <strong className="text-white">{tgDetected.chatLabel}</strong> (
                  <code className="text-[#C5A880] select-all">{tgDetected.chatId}</code>)
                </span>
              </div>
            )}
          </div>
        </details>
      ) : null}
    </div>
  );
}
