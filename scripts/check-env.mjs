#!/usr/bin/env node
/**
 * Comprobador de variables de entorno para Javier Espinosa Photography.
 * Uso: npm run check:env
 */

import fs from "node:fs";
import path from "node:path";

const rootDir = process.cwd();
const envFiles = [".env.local", ".env.production.local", ".env"];

for (const file of envFiles) {
  const fullPath = path.join(rootDir, file);
  if (fs.existsSync(fullPath)) {
    const content = fs.readFileSync(fullPath, "utf8");
    for (const rawLine of content.split(/\r?\n/)) {
      const line = rawLine.trim();
      if (!line || line.startsWith("#")) continue;
      const eqIdx = line.indexOf("=");
      if (eqIdx === -1) continue;
      const key = line.slice(0, eqIdx).trim();
      let val = line.slice(eqIdx + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      if (!(key in process.env)) {
        process.env[key] = val;
      }
    }
  }
}

const checks = [
  {
    key: "NEXT_PUBLIC_SITE_URL",
    required: false,
    label: "URL canónica del sitio",
    fallback: "Por defecto usa https://javier-photography.vercel.app (o VERCEL_PROJECT_PRODUCTION_URL).",
  },
  {
    key: "RESEND_API_KEY",
    required: true,
    label: "API Key de Resend (emails de contacto, pedidos y avisos)",
    fallback: "Sin RESEND_API_KEY se usa FormSubmit (requiere activación por correo en javierespinosa1995@hotmail.com).",
  },
  {
    key: "RESEND_FROM_EMAIL",
    required: false,
    label: "Remitente verificado en Resend",
    fallback: "Por defecto usa onboarding@resend.dev (solo permite enviar al correo del propietario de la cuenta Resend).",
  },
  {
    key: "STRIPE_SECRET_KEY",
    required: false,
    label: "Clave secreta de Stripe (sk_test_... o sk_live_...)",
    fallback: "Sin STRIPE_SECRET_KEY el checkout funciona en modo Reserva Fine Art sin pago con tarjeta.",
  },
  {
    key: "NEWSLETTER_PROVIDER",
    required: false,
    label: "Proveedor de lista de correo (ej. 'resend')",
    fallback: "Si no hay Audience ni Webhook configurado, las altas se envían por email a Javier.",
  },
  {
    key: "NEWSLETTER_AUDIENCE_ID",
    required: false,
    label: "ID de Audiencia en Resend",
    fallback: "Opcional si usas NEWSLETTER_WEBHOOK_URL o envío directo a tu correo.",
  },
  {
    key: "NEWSLETTER_WEBHOOK_URL",
    required: false,
    label: "Webhook para altas de newsletter",
    fallback: "Opcional.",
  },
  {
    key: "NEXT_PUBLIC_WHATSAPP",
    required: false,
    label: "Teléfono de WhatsApp con prefijo internacional (ej. 34600000000)",
    fallback: "Si está vacío, el botón flotante de WhatsApp permanece oculto.",
  },
  {
    key: "ADMIN_NTFY_TOPIC",
    required: false,
    label: "Tema privado ntfy para avisos push instantáneos al iPhone",
    fallback: "Recomendado: descarga ntfy en iOS, crea un tema largo secreto y añádelo aquí o usa TELEGRAM_BOT_TOKEN.",
  },
  {
    key: "TELEGRAM_BOT_TOKEN",
    required: false,
    label: "Token de bot de Telegram (opcional para avisos push al móvil)",
    fallback: "Opcional junto a TELEGRAM_CHAT_ID si prefieres Telegram en lugar de ntfy.",
  },
];

console.log("\n==============================================================");
console.log(" Diagnóstico de Entorno · Javier Espinosa Photography");
console.log("==============================================================\n");

let missingRecommended = 0;

for (const item of checks) {
  const value = (process.env[item.key] || "").trim();
  const isSet = value.length > 0;
  const icon = isSet ? "✓" : item.required ? "⚠" : "○";
  const masked =
    !isSet
      ? "NO DEFINIDA"
      : item.key.includes("KEY") ||
          item.key.includes("WEBHOOK") ||
          item.key.includes("TOPIC") ||
          item.key.includes("TOKEN")
        ? `${value.slice(0, 7)}... (${value.length} chars)`
        : value;

  console.log(`${icon} ${item.key}: ${masked}`);
  console.log(`  └─ ${item.label}`);
  if (!isSet) {
    console.log(`     Nota: ${item.fallback}`);
    if (item.required) missingRecommended++;
  }
}

console.log("\n--------------------------------------------------------------");
if (missingRecommended === 0) {
  console.log("Estado: Configuración principal lista para producción.");
} else {
  console.log(
    `Estado: Faltan ${missingRecommended} variable(s) recomendadas para producción en Vercel.`
  );
  console.log("Consulta .env.example para ver el listado completo.");
}
console.log("--------------------------------------------------------------\n");
