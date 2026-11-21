import { getPhotoBySlug } from "@/lib/photos";
import type { Photo } from "@/types/photo";

export interface CuadernoPost {
  slug: string;
  number: string;
  title: string;
  subtitle: string;
  date: string;
  author: string;
  categoryLabel: string;
  relatedWorkSlug: string;
  status: "borrador" | "publicado";
  body: string[];
  cta: {
    label: string;
    href: string;
  };
}

/**
 * 3 borradores vacíos del Cuaderno (/cuaderno/[slug]).
 * El texto de cada artículo lo redacta personalmente Javier Espinosa Martínez.
 */
export const CUADERNO_POSTS: CuadernoPost[] = [
  {
    slug: "borrador-01-observacion-fauna-600mm",
    number: "01",
    title: "{{DATO_PENDIENTE: TÍTULO DEL ARTÍCULO 01 — FAUNA Y OBSERVACIÓN A 600MM}}",
    subtitle: "Borrador 01 · Notas sobre distancia, espera y luz natural con teleobjetivo",
    date: "{{DATO_PENDIENTE: FECHA_PUBLICACION_01}}",
    author: "Javier Espinosa Martínez",
    categoryLabel: "Fauna y Naturaleza",
    relatedWorkSlug: "cuervo-canario-ante-las-cumbres",
    status: "borrador",
    body: [
      "{{DATO_PENDIENTE: TEXTO DEL ARTÍCULO 01 — Espacio reservado para el texto redactado por Javier Espinosa Martínez.}}",
    ],
    cta: {
      label: "Ver obra relacionada y copias Fine Art",
      href: "/portfolio/cuervo-canario-ante-las-cumbres",
    },
  },
  {
    slug: "borrador-02-luz-y-bruma-en-tenerife",
    number: "02",
    title: "{{DATO_PENDIENTE: TÍTULO DEL ARTÍCULO 02 — PAISAJE ENTRE EL TEIDE Y ANAGA}}",
    subtitle: "Borrador 02 · Cuaderno sobre el contraste entre la cumbre volcánica y la laurisilva",
    date: "{{DATO_PENDIENTE: FECHA_PUBLICACION_02}}",
    author: "Javier Espinosa Martínez",
    categoryLabel: "Paisajes y Territorio",
    relatedWorkSlug: "cumbre-nevada-al-alba",
    status: "borrador",
    body: [
      "{{DATO_PENDIENTE: TEXTO DEL ARTÍCULO 02 — Espacio reservado para el texto redactado por Javier Espinosa Martínez.}}",
    ],
    cta: {
      label: "Explorar serie Entre la Bruma y el Volcán",
      href: "/projects/entre-la-bruma-y-el-volcan",
    },
  },
  {
    slug: "borrador-03-tramo-y-asistencia-rally-historico",
    number: "03",
    title: "{{DATO_PENDIENTE: TÍTULO DEL ARTÍCULO 03 — CRÓNICA DE TRAMO Y PARQUE DE ASISTENCIA}}",
    subtitle: "Borrador 03 · Apuntes sobre fotografía de rally histórico en Canarias",
    date: "{{DATO_PENDIENTE: FECHA_PUBLICACION_03}}",
    author: "Javier Espinosa Martínez",
    categoryLabel: "Coches y Rally",
    relatedWorkSlug: "cruzada-sobre-el-asfalto",
    status: "borrador",
    body: [
      "{{DATO_PENDIENTE: TEXTO DEL ARTÍCULO 03 — Espacio reservado para el texto redactado por Javier Espinosa Martínez.}}",
    ],
    cta: {
      label: "Consultar cobertura de Rally Histórico",
      href: "/servicios/fotografo-rally-motorsport",
    },
  },
];

export function getAllCuadernoPosts(): (CuadernoPost & { relatedWork?: Photo })[] {
  return CUADERNO_POSTS.map((post) => ({
    ...post,
    relatedWork: getPhotoBySlug(post.relatedWorkSlug),
  }));
}

export function getCuadernoPostBySlug(
  slug: string
): (CuadernoPost & { relatedWork?: Photo }) | undefined {
  const post = CUADERNO_POSTS.find((p) => p.slug === slug);
  if (!post) return undefined;
  return {
    ...post,
    relatedWork: getPhotoBySlug(post.relatedWorkSlug),
  };
}
