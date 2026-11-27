import type { Metadata, Viewport } from "next";
import {
  Plus_Jakarta_Sans,
  Playfair_Display,
  JetBrains_Mono,
} from "next/font/google";
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

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-plus-jakarta",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-playfair",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
  variable: "--font-jetbrains-mono",
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
    default: "Fotografía de Autor en Tenerife | Javier Espinosa",
    template: "%s | Javier Espinosa",
  },

  description:
    "Fotógrafo independiente en Tenerife. Naturaleza, paisajes, arquitectura y cultura buscando nuevas maneras de mirar. Copias Fine Art en papel de algodón.",

  applicationName: "Javier Espinosa Fotografía",

  authors: [{ name: "Javier Espinosa Martínez" }],

  creator: "Javier Espinosa Martínez",

  keywords: [
    "Fotografía de autor",
    "Fine Art Photography",
    "Javier Espinosa Martínez",
    "Fotógrafo en Tenerife",
    "Puerto de la Cruz Tenerife",
    "Fotografía de fauna salvaje",
    "Rallye Orvecame Isla Tenerife Histórico",
    "Cruces de Mayo Los Realejos",
    "Fotografía de paisaje Canarias y Sahara",
    "Fotografía de arquitectura",
    "Fotografía documental y viajes",
    "Canon EOS R7",
    "Copias Fine Art Hahnemühle",
  ],

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
