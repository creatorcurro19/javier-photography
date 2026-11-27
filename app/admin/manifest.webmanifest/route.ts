import { NextResponse } from "next/server";

export function GET() {
  const manifest = {
    id: "/admin",
    name: "Estudio Javier Espinosa · Admin",
    short_name: "J.E. Admin",
    description:
      "App privada de gestión de consultas, pedidos Fine Art, series y catálogo.",
    start_url: "/admin?tab=inbox",
    scope: "/admin",
    display: "standalone",
    orientation: "portrait",
    background_color: "#0B0C0E",
    theme_color: "#0B0C0E",
    lang: "es",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };

  return NextResponse.json(manifest, {
    headers: {
      "Content-Type": "application/manifest+json; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
