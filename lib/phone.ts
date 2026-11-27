export function cleanPhoneForWhatsApp(phone?: string): string {
  if (!phone) return "";
  const cleaned = phone.replace(/[^0-9]/g, "");
  if (!cleaned) return "";
  // Si no lleva código de país, asume España (+34)
  if (cleaned.length === 9) return `34${cleaned}`;
  return cleaned;
}

export function buildWhatsAppReplyUrl(
  phone?: string,
  greeting?: string
): string | undefined {
  const number = cleanPhoneForWhatsApp(phone);
  if (number.length < 8) return undefined;
  if (!greeting) return `https://wa.me/${number}`;
  return `https://wa.me/${number}?text=${encodeURIComponent(greeting)}`;
}
