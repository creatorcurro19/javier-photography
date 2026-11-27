import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ServiceLandingContent from "@/components/servicios/ServiceLandingContent";
import JsonLd from "@/components/seo/JsonLd";
import {
  getServiceLandingBySlug,
  SERVICE_AREA,
  SERVICE_LANDINGS,
  type ServiceLanding,
} from "@/data/service-landings";
import { absoluteUrl, buildPageMetadata } from "@/lib/metadata";
import { getPhotosByCategory } from "@/lib/photos";
import { generateBreadcrumbSchema, generateFAQSchema } from "@/lib/schema";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return SERVICE_LANDINGS.map((landing) => ({ slug: landing.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const landing = getServiceLandingBySlug(slug);
  if (!landing) return {};

  return buildPageMetadata({
    title: landing.seoTitle,
    description: landing.seoDescription,
    path: `/servicios/${landing.slug}`,
    image: landing.heroImage,
  });
}

function buildSpecificServiceJsonLd(landing: ServiceLanding) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: landing.title,
    description: landing.seoDescription,
    url: absoluteUrl(`/servicios/${landing.slug}`),
    image: absoluteUrl(landing.heroImage),
    provider: {
      "@type": "Person",
      "@id": absoluteUrl("/#author"),
      name: "Javier Espinosa Martínez",
      url: absoluteUrl("/about"),
    },
    areaServed: [
      { "@type": "Place", name: SERVICE_AREA.base },
      ...SERVICE_AREA.primaryRegions.map((name) => ({ "@type": "Place", name })),
      { "@type": "Country", name: "España" },
    ],
  };
}

export default async function ServiceLandingPage({ params }: PageProps) {
  const { slug } = await params;
  const landing = getServiceLandingBySlug(slug);

  if (!landing) {
    notFound();
  }

  const samplePhotos = getPhotosByCategory(landing.category).slice(0, 6);

  return (
    <>
      <JsonLd data={buildSpecificServiceJsonLd(landing)} />
      <JsonLd data={generateFAQSchema(landing.faqs)} />
      <JsonLd
        data={generateBreadcrumbSchema([
          { name: "Inicio", path: "/" },
          { name: "Servicios", path: "/servicios" },
          { name: landing.title, path: `/servicios/${landing.slug}` },
        ])}
      />
      <ServiceLandingContent rawLanding={landing} samplePhotos={samplePhotos} />
    </>
  );
}
