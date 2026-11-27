"use client";

import Link from "@/components/ui/LocalizedLink";
import { getActiveUpcomingEvents, type UpcomingEvent } from "@/data/events";
import type { PhotoCategory } from "@/types/photo";
import JsonLd from "@/components/seo/JsonLd";
import { absoluteUrl } from "@/lib/metadata";
import { AndalusianStarMark } from "@/components/ui/AndalusianMotif";
import { useLanguage } from "@/lib/i18n";

interface UpcomingEventsSectionProps {
  category?: PhotoCategory;
}

function buildEventsJsonLd(events: UpcomingEvent[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Próximas Coberturas y Desplazamientos — Javier Espinosa Fotografía",
    itemListElement: events.map((ev, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Event",
        name: ev.title,
        startDate: ev.startDate,
        ...(ev.endDate ? { endDate: ev.endDate } : {}),
        eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
        eventStatus: "https://schema.org/EventScheduled",
        location: {
          "@type": "Place",
          name: ev.location,
        },
        organizer: {
          "@type": "Person",
          name: "Javier Espinosa Martínez",
          url: absoluteUrl("/about"),
        },
        description:
          ev.notes ||
          `Cobertura fotográfica profesional (${ev.discipline}) en ${ev.location}.`,
      },
    })),
  };
}

export default function UpcomingEventsSection({ category }: UpcomingEventsSectionProps) {
  const { lang, t } = useLanguage();
  const allActive = getActiveUpcomingEvents();
  const events = category
    ? allActive.filter((ev) => ev.category === category)
    : allActive;

  if (events.length === 0) {
    return null;
  }

  return (
    <section
      aria-labelledby="upcoming-events-heading"
      className="mt-20 rounded-xl border border-[#C5A880]/30 bg-[#151618]/80 p-8 sm:p-10"
    >
      <JsonLd data={buildEventsJsonLd(events)} />

      <div className="flex flex-col justify-between gap-4 border-b border-white/[0.08] pb-6 md:flex-row md:items-end">
        <div>
          <div className="flex items-center gap-2">
            <AndalusianStarMark className="h-3.5 w-3.5 text-[#C5A880]" />
            <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-[#C5A880]">
              {t("Agenda de Campo & Desplazamientos", "Field Schedule & Travel")}
            </p>
          </div>
          <h2
            id="upcoming-events-heading"
            className="mt-2 font-serif text-2xl sm:text-3xl font-light text-[#EBE7DF]"
          >
            {t("Próximas Coberturas Confirmadas", "Upcoming Confirmed Assignments")}
          </h2>
        </div>
        <p className="max-w-md text-xs font-light leading-relaxed text-[#8E8A80]">
          {t(
            "Si tu equipo o proyecto coincide con alguna de estas fechas y localizaciones, puedes reservar seguimiento fotográfico dedicado optimizando costes de desplazamiento.",
            "If your team or project aligns with any of these dates and locations, you can book dedicated coverage while sharing travel logistics."
          )}
        </p>
      </div>

      <div className="mt-6 divide-y divide-white/[0.06]">
        {events.map((ev) => {
          const title = lang === "en" && ev.titleEn ? ev.titleEn : ev.title;
          const displayDate = lang === "en" && ev.displayDateEn ? ev.displayDateEn : ev.displayDate;
          const location = lang === "en" && ev.locationEn ? ev.locationEn : ev.location;
          const notes = lang === "en" && ev.notesEn ? ev.notesEn : ev.notes;
          return (
          <div
            key={ev.id}
            className="flex flex-col justify-between gap-4 py-5 sm:flex-row sm:items-center"
          >
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#C5A880]">
                  {displayDate}
                </span>
                <span className="text-white/20">·</span>
                <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-[#8E8A80]">
                  {location}
                </span>
                <span
                  className={`border px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.2em] ${
                    ev.availability === "abierta"
                      ? "border-emerald-500/40 bg-emerald-950/30 text-emerald-300"
                      : ev.availability === "ultimas-plazas"
                        ? "border-amber-500/40 bg-amber-950/30 text-amber-200"
                        : "border-white/15 bg-white/5 text-[#8E8A80]"
                  }`}
                >
                  {ev.availability === "abierta"
                    ? t("Reserva Abierta", "Open Booking")
                    : ev.availability === "ultimas-plazas"
                      ? t("Últimas Plazas", "Final Slots")
                      : t("Agenda Completa", "Fully Booked")}
                </span>
              </div>
              <h3 className="mt-1.5 font-serif text-xl font-light text-[#F7F4EE]">
                {title}
              </h3>
              {notes && (
                <p className="mt-1 text-xs font-light text-[#8E8A80]">
                  {notes}
                </p>
              )}
            </div>

            {ev.availability !== "completa" && (
              <Link
                href={`/contact?motivo=Encargo&referencia=${encodeURIComponent(
                  `${title} (${displayDate})`
                )}`}
                className="shrink-0 self-start sm:self-center border border-[#EBE7DF] bg-[#EBE7DF] px-4 py-2 font-mono text-[10px] uppercase tracking-[0.22em] font-medium text-[#0B0C0E] transition hover:bg-transparent hover:text-white"
              >
                {t("Reservar en este evento →", "Book for this event →")}
              </Link>
            )}
          </div>
          );
        })}
      </div>
    </section>
  );
}
