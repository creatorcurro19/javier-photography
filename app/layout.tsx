import type { Metadata } from "next";
import "./globals.css";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SavedCollectionDrawer from "@/components/photo/SavedCollectionDrawer";
import CartDrawer from "@/components/cart/CartDrawer";
import JsonLd from "@/components/seo/JsonLd";
import { SITE_URL } from "@/lib/metadata";
import { generatePersonSchema } from "@/lib/schema";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  verification: {
    google: "mlxi0QGeNLmXxCnVUMclZhd9jt85PqqVvK9TFIkEDgo",
  },

  title: {
    default: "Javier Espinosa | Fotografía de Autor & Fine Art",
    template: "%s | Javier Espinosa Fotografía",
  },

  description:
    "Portfolio oficial de Javier Espinosa Martínez. Fotografía de autor, documental, fauna salvaje, coches y rally, arquitectura urbana y viajes. Ediciones Fine Art y encargos profesionales.",

  applicationName: "Javier Espinosa Fotografía",

  authors: [{ name: "Javier Espinosa Martínez" }],

  creator: "Javier Espinosa Martínez",

  keywords: [
    "Fotografía de autor",
    "Fine Art Photography",
    "Javier Espinosa Martínez",
    "Fotografía de fauna salvaje",
    "Fotografía de rally y coches",
    "Fotografía de arquitectura",
    "Fotografía documental y viajes",
    "Canon EOS R7",
    "Copias Fine Art Hahnemühle",
  ],

  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    type: "website",
    locale: "es_ES",
    siteName: "Javier Espinosa Fotografía",
    images: [{ url: "/images/portfolio/hero/hero.jpg", width: 1920, height: 1080, alt: "Javier Espinosa Fotografía" }],
  },

  twitter: {
    card: "summary_large_image",
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
    <html lang="es">
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
        <Footer />
      </body>
    </html>
  );
}
