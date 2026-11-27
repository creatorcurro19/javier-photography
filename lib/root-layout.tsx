import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "@/app/globals.css";
import { jetbrainsMono, playfair, plusJakarta } from "@/app/fonts";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SavedCollectionDrawer from "@/components/photo/SavedCollectionDrawer";
import CartDrawer from "@/components/cart/CartDrawer";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import PhotoProtection from "@/components/ui/PhotoProtection";
import JsonLd from "@/components/seo/JsonLd";
import { LangProvider } from "@/lib/i18n";
import type { SiteLang } from "@/lib/i18n-helpers";
import { SITE_URL, buildLanguageAlternates } from "@/lib/metadata";
import { generatePersonSchema } from "@/lib/schema";

export const sharedViewport: Viewport = {
  themeColor: "#0B0C0E",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export function buildRootMetadata(lang: SiteLang): Metadata {
  const isEn = lang === "en";
  const ogUrl = `${SITE_URL}/api/og?title=${encodeURIComponent(
    isEn ? "Fine Art & Documentary Photography" : "Fotógrafo en Tenerife"
  )}&subtitle=${encodeURIComponent(
    isEn
      ? "Wildlife, Landscape, Historic Rally & Architecture · Hahnemuhle Prints"
      : "Fauna, paisaje, rally histórico, arquitectura y documental"
  )}&badge=${isEn ? "FINE%20ART%20PRINTS" : "FINE%20ART"}&lang=${lang}`;

  return {
    metadataBase: new URL(SITE_URL),

    verification: {
      google:
        process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ||
        "mlxi0QGeNLmXxCnVUMclZhd9jt85PqqVvK9TFIkEDgo",
    },

    title: {
      default: isEn
        ? "Fine Art Photographer & Prints | Javier Espinosa"
        : "Fotógrafo en Tenerife | Javier Espinosa",
      template: "%s | Javier Espinosa",
    },

    description: isEn
      ? "Limited edition wildlife, landscape, classic rally & architecture Fine Art prints on cotton rag paper. Museum quality, shipped in rigid tubes to the US."
      : "Fotografía de fauna, paisaje, rally histórico, arquitectura y documental desde Tenerife. Copias Fine Art, encargos y licencias.",

    applicationName: isEn
      ? "Javier Espinosa Photography"
      : "Javier Espinosa Fotografía",

    authors: [{ name: "Javier Espinosa Martínez" }],
    creator: "Javier Espinosa Martínez",

    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },

    openGraph: {
      type: "website",
      locale: isEn ? "en_US" : "es_ES",
      alternateLocale: isEn ? ["es_ES", "en_GB"] : ["en_US", "en_GB"],
      siteName: isEn
        ? "Javier Espinosa Photography"
        : "Javier Espinosa Fotografía",
      images: [
        {
          url: ogUrl,
          width: 1200,
          height: 630,
          alt: isEn
            ? "Javier Espinosa Photography — Fine Art Prints & Licensing"
            : "Javier Espinosa Fotografía — Copias Fine Art y Licencias",
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
    },

    alternates: {
      ...buildLanguageAlternates("/", lang),
      types: {
        "application/rss+xml": `${SITE_URL}/feed.xml`,
      },
    },

    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "any" },
        { url: "/icon.svg", type: "image/svg+xml" },
      ],
      apple: [
        { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
      ],
    },
  };
}

export function SiteRootShell({
  lang,
  children,
}: {
  lang: SiteLang;
  children: ReactNode;
}) {
  return (
    <html
      lang={lang}
      className={`${plusJakarta.variable} ${playfair.variable} ${jetbrainsMono.variable}`}
    >
      <body className="font-sans antialiased bg-[#0B0C0E] text-[#EBE7DF] leading-relaxed tracking-[0.015em] selection:bg-white/20 selection:text-white">
        <LangProvider lang={lang}>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:bg-white focus:px-4 focus:py-2 focus:text-black font-mono text-xs uppercase"
          >
            {lang === "en"
              ? "Skip to main content"
              : "Saltar al contenido principal"}
          </a>
          <JsonLd data={generatePersonSchema(lang)} />
          <Navbar />
          <main id="main-content">{children}</main>
          <SavedCollectionDrawer />
          <CartDrawer />
          <WhatsAppButton />
          <PhotoProtection />
          <Footer />
        </LangProvider>
        {process.env.VERCEL === "1" && (
          <>
            <Analytics />
            <SpeedInsights />
          </>
        )}
      </body>
    </html>
  );
}
