import "server-only";
import { SITE_URL } from "@/lib/metadata";

export interface MobileAlertPayload {
  kind: "consulta" | "pedido" | "pago" | "newsletter" | "test";
  title: string;
  message: string;
  priority?: 2 | 3 | 4 | 5;
  tags?: string[];
  tab?: "inbox" | "alerts";
}

export interface MobilePushStatus {
  ntfyConfigured: boolean;
  telegramConfigured: boolean;
  anyConfigured: boolean;
}

export interface MobilePushResult {
  ntfySent: boolean;
  telegramSent: boolean;
  anySent: boolean;
}

function resolveNtfyConfig(): { server: string; topic: string; token: string } {
  const rawTopic = (process.env.ADMIN_NTFY_TOPIC ?? "").trim();
  const rawServer = (process.env.ADMIN_NTFY_SERVER ?? "https://ntfy.sh").trim();
  const token = (process.env.ADMIN_NTFY_TOKEN ?? "").trim();

  if (!rawTopic) {
    return { server: "", topic: "", token };
  }

  // Tolera que el usuario pegue la URL completa (ej. https://ntfy.sh/mi-tema) o solo el nombre del tema
  if (rawTopic.startsWith("http://") || rawTopic.startsWith("https://")) {
    try {
      const parsed = new URL(rawTopic);
      const cleanTopic = parsed.pathname.replace(/^\/+|\/+$/g, "");
      return {
        server: parsed.origin,
        topic: cleanTopic,
        token,
      };
    } catch {
      return { server: "", topic: "", token };
    }
  }

  return {
    server: rawServer.replace(/\/+$/, ""),
    topic: rawTopic.replace(/^\/+|\/+$/g, ""),
    token,
  };
}

export function isMobilePushConfigured(): MobilePushStatus {
  const ntfy = resolveNtfyConfig();
  const telegramToken = (process.env.TELEGRAM_BOT_TOKEN ?? "").trim();
  const telegramChatId = (process.env.TELEGRAM_CHAT_ID ?? "").trim();

  const ntfyConfigured = Boolean(ntfy.server && ntfy.topic);
  const telegramConfigured = Boolean(telegramToken && telegramChatId);

  return {
    ntfyConfigured,
    telegramConfigured,
    anyConfigured: ntfyConfigured || telegramConfigured,
  };
}

async function sendNtfyNotification(
  payload: MobileAlertPayload,
  targetUrl: string
): Promise<boolean> {
  const { server, topic, token } = resolveNtfyConfig();
  if (!server || !topic) return false;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const res = await fetch(server, {
      method: "POST",
      headers,
      signal: AbortSignal.timeout(3500),
      body: JSON.stringify({
        topic,
        title: payload.title.slice(0, 120),
        message: payload.message.slice(0, 1200),
        priority: payload.priority ?? 4,
        tags: payload.tags ?? ["camera"],
        click: targetUrl,
        actions: [
          {
            action: "view",
            label: "Abrir Admin",
            url: targetUrl,
            clear: true,
          },
        ],
      }),
    });
    if (!res.ok) {
      console.warn(`[mobile-push:ntfy] HTTP ${res.status}`);
      return false;
    }
    return true;
  } catch (error) {
    console.warn("[mobile-push:ntfy] Error enviando aviso:", error);
    return false;
  }
}

async function sendTelegramNotification(
  payload: MobileAlertPayload,
  targetUrl: string
): Promise<boolean> {
  const token = (process.env.TELEGRAM_BOT_TOKEN ?? "").trim();
  const chatId = (process.env.TELEGRAM_CHAT_ID ?? "").trim();
  if (!token || !chatId) return false;

  const text = `${payload.title}\n\n${payload.message}`.slice(0, 3800);

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: AbortSignal.timeout(3500),
      body: JSON.stringify({
        chat_id: chatId,
        text,
        disable_web_page_preview: true,
        reply_markup: {
          inline_keyboard: [[{ text: "Abrir en App Admin →", url: targetUrl }]],
        },
      }),
    });
    if (!res.ok) {
      console.warn(`[mobile-push:telegram] HTTP ${res.status}`);
      return false;
    }
    return true;
  } catch (error) {
    console.warn("[mobile-push:telegram] Error enviando aviso:", error);
    return false;
  }
}

/**
 * Envía una notificación push directa al móvil del autor (ntfy y/o Telegram)
 * con acceso directo a la App PWA de administración (/admin?tab=inbox).
 */
export async function notifyOwnerMobile(
  payload: MobileAlertPayload
): Promise<MobilePushResult> {
  const status = isMobilePushConfigured();
  if (!status.anyConfigured) {
    return { ntfySent: false, telegramSent: false, anySent: false };
  }

  const targetUrl = `${SITE_URL}/admin?tab=${payload.tab ?? "inbox"}`;

  const [ntfyRes, telegramRes] = await Promise.allSettled([
    status.ntfyConfigured ? sendNtfyNotification(payload, targetUrl) : Promise.resolve(false),
    status.telegramConfigured
      ? sendTelegramNotification(payload, targetUrl)
      : Promise.resolve(false),
  ]);

  const ntfySent = ntfyRes.status === "fulfilled" && ntfyRes.value;
  const telegramSent = telegramRes.status === "fulfilled" && telegramRes.value;

  return {
    ntfySent,
    telegramSent,
    anySent: ntfySent || telegramSent,
  };
}
