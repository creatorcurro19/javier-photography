import { NextResponse } from "next/server";
import { isAuthenticatedRequest } from "@/lib/server/admin-auth";
import { SITE_URL } from "@/lib/metadata";

const TELEGRAM_TOKEN_RE = /^\d{6,14}:[A-Za-z0-9_-]{20,80}$/;

interface TelegramChatEntry {
  id: number;
  type?: string;
  first_name?: string;
  last_name?: string;
  username?: string;
}

export async function POST(request: Request) {
  if (!isAuthenticatedRequest(request)) {
    return NextResponse.json({ ok: false, error: "No autorizado" }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const inputToken = typeof body?.token === "string" ? body.token.trim() : "";
  const botToken = inputToken || (process.env.TELEGRAM_BOT_TOKEN ?? "").trim();
  const sendTest = Boolean(body?.sendTest);

  if (!botToken) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "Introduce el token que te dio @BotFather (o configura TELEGRAM_BOT_TOKEN en Vercel).",
      },
      { status: 400 }
    );
  }

  if (!TELEGRAM_TOKEN_RE.test(botToken)) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "El formato del token de Telegram no es válido (debe tener el formato 123456789:ABC...).",
      },
      { status: 400 }
    );
  }

  try {
    const [meRes, updatesRes] = await Promise.all([
      fetch(`https://api.telegram.org/bot${botToken}/getMe`, {
        signal: AbortSignal.timeout(4000),
      }),
      fetch(`https://api.telegram.org/bot${botToken}/getUpdates?limit=15`, {
        signal: AbortSignal.timeout(4000),
      }),
    ]);

    const meData = (await meRes.json().catch(() => null)) as {
      ok?: boolean;
      result?: { username?: string; first_name?: string };
    } | null;

    if (!meRes.ok || !meData?.ok) {
      return NextResponse.json(
        { ok: false, error: "Telegram rechazó ese token. Revisa que esté copiado completo desde @BotFather." },
        { status: 400 }
      );
    }

    const updatesData = (await updatesRes.json().catch(() => null)) as {
      ok?: boolean;
      result?: Array<{
        message?: { chat?: TelegramChatEntry };
        my_chat_member?: { chat?: TelegramChatEntry };
      }>;
    } | null;

    const chats: TelegramChatEntry[] = [];
    for (const upd of updatesData?.result ?? []) {
      const chat = upd.message?.chat ?? upd.my_chat_member?.chat;
      if (chat && typeof chat.id === "number") {
        chats.push(chat);
      }
    }

    const latestChat = chats.at(-1);
    if (!latestChat) {
      return NextResponse.json({
        ok: false,
        botUsername: meData.result?.username || null,
        error: meData.result?.username
          ? `Bot @${meData.result.username} validado, pero aún no tiene mensajes tuyos. Ábrelo en Telegram, pulsa «Iniciar» o escribe «hola» y vuelve a pulsar Detectar.`
          : "Bot validado, pero envíale un mensaje («hola») en Telegram primero y vuelve a pulsar Detectar.",
      });
    }

    const chatId = String(latestChat.id);
    const chatLabel =
      [latestChat.first_name, latestChat.last_name].filter(Boolean).join(" ") ||
      (latestChat.username ? `@${latestChat.username}` : chatId);

    let testSent = false;
    if (sendTest) {
      const sendRes = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: AbortSignal.timeout(4000),
        body: JSON.stringify({
          chat_id: chatId,
          text: "<b>Estudio Javier Espinosa conectado</b>\n\nYa puedes copiar este Chat ID y tu Bot Token en Vercel para recibir al instante todas tus consultas, pedidos Fine Art y pagos de Stripe.",
          parse_mode: "HTML",
          reply_markup: {
            inline_keyboard: [
              [{ text: "Abrir en App Admin →", url: `${SITE_URL}/admin?tab=inbox` }],
            ],
          },
        }),
      }).catch(() => null);
      testSent = Boolean(sendRes?.ok);
    }

    return NextResponse.json({
      ok: true,
      botUsername: meData.result?.username || null,
      chatId,
      chatLabel,
      testSent,
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Error conectando con la API de Telegram." },
      { status: 502 }
    );
  }
}
