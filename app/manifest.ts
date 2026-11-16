import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Javier Espinosa Martínez | Fotografía de Autor & Fine Art",
    short_name: "Javier Espinosa",
    description:
      "Archivo fotográfico de autor, naturaleza salvaje a 600mm, rally histórico, arquitectura vernácula y obra gráfica Fine Art.",
    start_url: "/",
    display: "standalone",
    background_color: "#101112",
    theme_color: "#101112",
    lang: "es",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
