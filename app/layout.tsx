import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SavedCollectionDrawer from "@/components/photo/SavedCollectionDrawer";
import CartDrawer from "@/components/cart/CartDrawer";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import PhotoProtection from "@/components/ui/PhotoProtection";
import JsonLd from "@/components/seo/JsonLd";
import { SITE_URL } from "@/lib/metadata";
import { generatePersonSchema } from "@/lib/schema";

const plusJakarta = localFont({
  src: [
    {
      path: "./fonts/plus-jakarta-sans-latin.woff2",
      weight: "200 800",
      style: "normal",
    },
    {
      path: "./fonts/plus-jakarta-sans-italic-latin.woff2",
      weight: "200 800",
      style: "italic",
    },
  ],
  display: "swap",
  variable: "--font-plus-jakarta",
  fallback: ["system-ui", "sans-serif"],
});

const playfair = localFont({
  src: [
    {
      path: "./fonts/playfair-display-latin.woff2",
      weight: "400 900",
      style: "normal",
    },
    {
      path: "./fonts/playfair-display-italic-latin.woff2",
      weight: "400 900",
      style: "italic",
    },
  ],
  display: "swap",
  variable: "--font-playfair",
  fallback: ["Georgia", "serif"],
});

const jetbrainsMono = localFont({
  src: [
    {
      path: "./fonts/jetbrains-mono-latin.woff2",
      weight: "100 800",
      style: "normal",
    },
  ],
  display: "swap",
  variable: "--font-jetbrains-mono",
  fallback: ["monospace"],
});

export const viewport: Viewport = {
  themeColor: "#0B0C0E",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  verification: {
    google:
      process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ||
      "mlxi0QGeNLmXxCnVUMclZhd9jt85PqqVvK9TFIkEDgo",
  },

  title: {
    default: "Fotógrafo en Tenerife | Javier Espinosa",
    template: "%s | Javier Espinosa",
  },

  description:
    "Fotografía de fauna, paisaje, rally histórico, arquitectura y documental desde Tenerife. Copias Fine Art, encargos y licencias.",

  applicationName: "Javier Espinosa Fotografía",

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
    locale: "es_ES",
    siteName: "Javier Espinosa Fotografía",
    images: [
      {
        url: "/images/portfolio/paisajes-documental/mar-de-dunas-al-ocaso.jpg",
        width: 3840,
        height: 2560,
        alt: "Mar de Silencio y Arena — Javier Espinosa Fotografía",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
  },

  alternates: {
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${plusJakarta.variable} ${playfair.variable} ${jetbrainsMono.variable}`}
    >
      <body className="font-sans antialiased bg-[#0B0C0E] text-[#EBE7DF] leading-relaxed tracking-[0.015em] selection:bg-white/20 selection:text-white">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:bg-white focus:px-4 focus:py-2 focus:text-black font-mono text-xs uppercase"
        >
          Saltar al contenido principal
        </a>
        <JsonLd data={generatePersonSchema()} />
        <Navbar />
        <main id="main-content">{children}</main>
        <SavedCollectionDrawer />
        <CartDrawer />
        <WhatsAppButton />
        <PhotoProtection />
        <Footer />
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
