import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Container from "@/components/ui/Container";
import JsonLd from "@/components/seo/JsonLd";
import UpcomingEventsSection from "@/components/events/UpcomingEventsSection";
import {
  AndalusianCenefa,
  AndalusianPageBackdrop,
  AndalusianStarMark,
} from "@/components/ui/AndalusianMotif";
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
    <div className="relative min-h-screen overflow-hidden bg-[#0B0C0E] pt-36 pb-28 text-[#EBE7DF]">
      <AndalusianPageBackdrop variant="sebka" />
      <JsonLd data={buildSpecificServiceJsonLd(landing)} />
      <JsonLd data={generateFAQSchema(landing.faqs)} />
      <JsonLd
        data={generateBreadcrumbSchema([
          { name: "Inicio", path: "/" },
          { name: "Servicios", path: "/servicios" },
          { name: landing.title, path: `/servicios/${landing.slug}` },
        ])}
      />

      <Container className="relative z-10">
        {/* Breadcrumb */}
        <nav aria-label="Ruta de navegación" className="mb-8 font-mono text-[10px] uppercase tracking-[0.28em] text-[#8E8A80]">
          <Link href="/servicios" className="hover:text-[#EBE7DF] transition">
            ← Volver a Servicios y Encargos
          </Link>
        </nav>

        {/* Hero / Header */}
        <header className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-7">
            <div className="flex items-center gap-2.5">
              <AndalusianStarMark className="h-3.5 w-3.5 text-[#C5A880]" />
              <p className="font-mono text-xs uppercase tracking-[0.35em] text-[#C5A880]">
                {landing.kicker}
              </p>
            </div>
            <h1 className="mt-4 font-serif text-4xl sm:text-5xl font-light tracking-tight text-[#F7F4EE]">
              {landing.title}
            </h1>
            <p className="mt-5 text-base sm:text-lg font-light leading-relaxed text-[#EBE7DF]/85">
              {landing.subtitle}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3.5">
              <Link
                href={landing.primaryCta.href}
                className="inline-flex items-center gap-2 border border-[#EBE7DF] bg-[#EBE7DF] px-6 py-3 font-mono text-xs uppercase tracking-[0.25em] font-semibold text-[#0B0C0E] transition hover:bg-transparent hover:text-white"
              >
                <span>{landing.primaryCta.label}</span>
                <span>→</span>
              </Link>
              <Link
                href={landing.secondaryCta.href}
                className="inline-flex items-center gap-2 border border-[#C5A880]/40 bg-[#151618] px-5 py-3 font-mono text-xs uppercase tracking-[0.22em] text-[#EBE7DF] transition hover:border-[#C5A880] hover:text-white"
              >
                <span>{landing.secondaryCta.label}</span>
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="relative aspect-[4/3] overflow-hidden border border-white/[0.1] bg-[#151618]">
              <Image
                src={landing.heroImage}
                alt={landing.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 42vw"
                className="object-cover"
              />
            </div>
          </div>
        </header>

        <AndalusianCenefa variant="sebka" className="my-12 text-[#C5A880]/38" />

        {/* Intro + Deliverables */}
        <section className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="space-y-5 lg:col-span-7">
            <h2 className="font-serif text-2xl sm:text-3xl font-light text-[#F7F4EE]">
              Enfoque Técnico y Mirada de Autor
            </h2>
            {landing.intro.map((paragraph, i) => (
              <p
                key={i}
                className="text-sm sm:text-base font-light leading-relaxed text-[#EBE7DF]/80"
              >
                {paragraph}
              </p>
            ))}

            <div className="mt-6 border border-[#202226] bg-[#151618]/70 p-5 text-xs text-[#8E8A80]">
              <span className="font-mono uppercase tracking-[0.22em] text-[#C5A880]">
                Perfil de cliente habitual:
              </span>{" "}
              <span className="text-[#EBE7DF]/85 font-light">{landing.idealFor}</span>
            </div>
          </div>

          <div className="border border-[#202226] bg-[#151618]/50 p-7 sm:p-8 lg:col-span-5">
            <h3 className="font-mono text-xs uppercase tracking-[0.25em] text-[#C5A880]">
              Alcance y Entregables
            </h3>
            <ul className="mt-5 space-y-3.5 text-sm text-[#EBE7DF]/85">
              {landing.deliverables.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="text-[#C5A880] mt-0.5">—</span>
                  <span className="font-light leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-7 border-t border-white/[0.08] pt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {landing.technicalSpecs.map((spec) => (
                <div key={spec.label}>
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#8E8A80]">
                    {spec.label}
                  </p>
                  <p className="mt-0.5 text-xs font-light text-[#F7F4EE]">
                    {spec.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Calendario de próximas coberturas (solo se renderiza si hay eventos futuros) */}
        <UpcomingEventsSection category={landing.category} />

        {/* Sample works from catalogue */}
        {samplePhotos.length > 0 && (
          <section className="mt-20 border-t border-[#202226] pt-16">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-[#C5A880]">
                  Muestra Verificada del Archivo
                </p>
                <h2 className="mt-2 font-serif text-3xl font-light text-[#F7F4EE]">
                  Obras Recientes en esta Disciplina
                </h2>
              </div>
              <Link
                href={`/portfolio/${landing.category}`}
                className="font-mono text-xs uppercase tracking-[0.22em] text-[#C5A880] hover:text-white transition"
              >
                Ver colección completa →
              </Link>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {samplePhotos.map((photo) => (
                <Link
                  key={photo.id}
                  href={`/portfolio/${photo.slug}`}
                  className="group overflow-hidden border border-white/[0.08] bg-[#151618] transition hover:border-[#C5A880]/60"
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#0B0C0E]">
                    <Image
                      src={photo.image}
                      alt={photo.alt}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition duration-500 group-hover:scale-[1.03]"
                    />
                  </div>
                  <div className="px-4 py-3.5">
                    <p className="font-serif text-base font-light text-[#F7F4EE] group-hover:text-[#C5A880] transition">
                      {photo.title}
                    </p>
                    <p className="mt-0.5 font-mono text-[10px] text-[#8E8A80]">
                      {photo.camera} · {photo.focalLength} · {photo.aperture} · {photo.shutter}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Process */}
        <section className="mt-20 border-t border-[#202226] pt-16">
          <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-[#8E8A80]">
            Metodología de Trabajo
          </p>
          <h2 className="mt-2 font-serif text-3xl font-light text-[#F7F4EE]">
            Fases de Producción y Entrega
          </h2>

          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {landing.process.map((p) => (
              <div
                key={p.step}
                className="border border-[#202226] bg-[#151618]/40 p-6"
              >
                <span className="font-mono text-2xl font-light text-[#C5A880]">
                  {p.step}
                </span>
                <h3 className="mt-3 font-serif text-lg text-[#F7F4EE]">
                  {p.title}
                </h3>
                <p className="mt-2 text-xs font-light leading-relaxed text-[#8E8A80]">
                  {p.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQs */}
        <section aria-labelledby="landing-faq" className="mt-20 border-t border-[#202226] pt-16">
          <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-[#8E8A80]">
            Preguntas Frecuentes
          </p>
          <h2 id="landing-faq" className="mt-2 font-serif text-3xl font-light text-[#F7F4EE]">
            Dudas Habituales sobre este Servicio
          </h2>

          <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-2">
            {landing.faqs.map((item) => (
              <details
                key={item.q}
                className="group border border-[#202226] bg-[#151618]/40 p-6 transition hover:border-[#8E8A80]/50"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-serif text-lg text-[#EBE7DF]">
                  <span>{item.q}</span>
                  <span className="text-xs text-[#C5A880] transition group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-4 text-xs font-light leading-relaxed text-[#EBE7DF]/80">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section className="mt-20 border border-[#C5A880]/30 bg-[#151618]/80 p-10 text-center">
          <h2 className="font-serif text-3xl font-light text-[#F7F4EE]">
            ¿Planificamos tu próximo proyecto o cobertura?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm font-light text-[#8E8A80]">
            Indica las fechas, localización y alcance requerido. Recibirás una propuesta personalizada en un plazo habitual de 24 a 48 horas laborables.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-4">
            <Link
              href={landing.primaryCta.href}
              className="border border-[#EBE7DF] bg-[#EBE7DF] px-8 py-3.5 font-mono text-xs uppercase tracking-[0.25em] font-semibold text-[#0B0C0E] transition hover:bg-transparent hover:text-white"
            >
              {landing.primaryCta.label}
            </Link>
            <Link
              href="/servicios"
              className="border border-white/15 bg-[#0B0C0E] px-6 py-3.5 font-mono text-xs uppercase tracking-[0.22em] text-[#EBE7DF] transition hover:border-[#C5A880]"
            >
              Ver todos los servicios
            </Link>
          </div>
        </section>
      </Container>
    </div>
  );
}
