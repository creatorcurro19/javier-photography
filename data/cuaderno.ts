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
    title: "Notas sobre distancia, espera y luz natural a 600mm",
    subtitle: "Borrador 01 · Notas sobre distancia, espera y luz natural con teleobjetivo",
    date: "Próxima publicación",
    author: "Javier Espinosa Martínez",
    categoryLabel: "Fauna y Naturaleza",
    relatedWorkSlug: "cuervo-canario-ante-las-cumbres",
    status: "borrador",
    body: [
      "Cuaderno de campo en preparación por Javier Espinosa Martínez.",
    ],
    cta: {
      label: "Ver obra relacionada y copias Fine Art",
      href: "/portfolio/cuervo-canario-ante-las-cumbres",
    },
  },
  {
    slug: "borrador-02-luz-y-bruma-en-tenerife",
    number: "02",
    title: "Entre el Teide y Anaga: el contraste del alisio y la cumbre",
    subtitle: "Borrador 02 · Cuaderno sobre el contraste entre la cumbre volcánica y la laurisilva",
    date: "Próxima publicación",
    author: "Javier Espinosa Martínez",
    categoryLabel: "Paisajes y Territorio",
    relatedWorkSlug: "cumbre-nevada-al-alba",
    status: "borrador",
    body: [
      "Cuaderno de campo en preparación por Javier Espinosa Martínez.",
    ],
    cta: {
      label: "Explorar serie Entre la Bruma y el Volcán",
      href: "/projects/entre-la-bruma-y-el-volcan",
    },
  },
  {
    slug: "borrador-03-tramo-y-asistencia-rally-historico",
    number: "03",
    title: "Crónica de tramo y parque de asistencia en rally clásico",
    subtitle: "Borrador 03 · Apuntes sobre fotografía de rally histórico en Canarias",
    date: "Próxima publicación",
    author: "Javier Espinosa Martínez",
    categoryLabel: "Coches y Rally",
    relatedWorkSlug: "cruzada-sobre-el-asfalto",
    status: "borrador",
    body: [
      "Cuaderno de campo en preparación por Javier Espinosa Martínez.",
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
