import type { Metadata } from "next";
import { SERVICE_LANDINGS } from "@/data/service-landings";
import {
  ServiceLandingView,
  getServiceLandingMetadata,
} from "@/lib/page-views";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return SERVICE_LANDINGS.map((landing) => ({ slug: landing.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  return getServiceLandingMetadata(slug, "en");
}

export default async function EnServiceLandingPage({ params }: PageProps) {
  const { slug } = await params;
  return <ServiceLandingView slug={slug} lang="en" />;
}
