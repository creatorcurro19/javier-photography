"use client";

import Image from "next/image";
import Link from "next/link";
import Container from "@/components/ui/Container";
import UpcomingEventsSection from "@/components/events/UpcomingEventsSection";
import {
  AndalusianCenefa,
  AndalusianPageBackdrop,
  AndalusianStarMark,
} from "@/components/ui/AndalusianMotif";
import { getPlazos } from "@/data/plazos";
import type { ServiceLanding } from "@/data/service-landings";
import { getLocalizedServiceLanding } from "@/data/service-landings-en";
import { useLanguage } from "@/lib/i18n";
import { getLocalizedPhoto } from "@/lib/i18n-works";
import type { Photo } from "@/types/photo";

interface ServiceLandingContentProps {
  rawLanding: ServiceLanding;
  samplePhotos: Photo[];
}

export default function ServiceLandingContent({
  rawLanding,
  samplePhotos,
}: ServiceLandingContentProps) {
  const { lang, t } = useLanguage();
  const plazos = getPlazos(lang);
  const landing = getLocalizedServiceLanding(rawLanding, lang);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0B0C0E] pt-36 pb-28 text-[#EBE7DF]">
      <AndalusianPageBackdrop variant="sebka" />

      <Container className="relative z-10">
        {/* Breadcrumb */}
        <nav
          aria-label={t("Ruta de navegación", "Breadcrumb")}
          className="mb-8 font-mono text-[10px] uppercase tracking-[0.28em] text-[#8E8A80]"
        >
          <Link href="/servicios" className="hover:text-[#EBE7DF] transition">
            {t("← Volver a Servicios y Encargos", "← Back to Services & Commissions")}
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
                quality={85}
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
              {t("Enfoque Técnico y Mirada de Autor", "Technical Approach & Author Vision")}
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
                {t("Perfil de cliente habitual:", "Typical client profile:")}
              </span>{" "}
              <span className="text-[#EBE7DF]/85 font-light">{landing.idealFor}</span>
            </div>
          </div>

          <div className="border border-[#202226] bg-[#151618]/50 p-7 sm:p-8 lg:col-span-5">
            <h3 className="font-mono text-xs uppercase tracking-[0.25em] text-[#C5A880]">
              {t("Alcance y Entregables", "Scope & Deliverables")}
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
                  {t("Muestra Verificada del Archivo", "Verified Archive Selection")}
                </p>
                <h2 className="mt-2 font-serif text-3xl font-light text-[#F7F4EE]">
                  {t("Obras Recientes en esta Disciplina", "Recent Works in This Discipline")}
                </h2>
              </div>
              <Link
                href={`/portfolio/${landing.category}`}
                className="font-mono text-xs uppercase tracking-[0.22em] text-[#C5A880] hover:text-white transition"
              >
                {t("Ver colección completa →", "View full collection →")}
              </Link>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {samplePhotos.map((raw) => {
                const photo = getLocalizedPhoto(raw, lang);
                return (
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
                        quality={85}
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
                );
              })}
            </div>
          </section>
        )}

        {/* Process */}
        <section className="mt-20 border-t border-[#202226] pt-16">
          <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-[#8E8A80]">
            {t("Metodología de Trabajo", "Workflow & Methodology")}
          </p>
          <h2 className="mt-2 font-serif text-3xl font-light text-[#F7F4EE]">
            {t("Fases de Producción y Entrega", "Production & Delivery Phases")}
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
            {t("Preguntas Frecuentes", "Frequently Asked Questions")}
          </p>
          <h2 id="landing-faq" className="mt-2 font-serif text-3xl font-light text-[#F7F4EE]">
            {t("Dudas Habituales sobre este Servicio", "Common Questions About This Service")}
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
            {t(
              "¿Planificamos tu próximo proyecto o cobertura?",
              "Planning an upcoming project or coverage?"
            )}
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm font-light text-[#8E8A80]">
            {t(
              "Indica las fechas, localización y alcance requerido.",
              "Let me know your dates, location, and required scope."
            )}{" "}
            {plazos.respuesta}
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
              {t("Ver todos los servicios", "View all services")}
            </Link>
          </div>
        </section>
      </Container>
    </div>
  );
}
