"use client";

import React from "react";
import { BellIcon, InboxIcon, LayersIcon, PhotoGridIcon, SlidersIcon } from "./AdminIcons";

export type AdminSectionTab = "photos" | "series" | "inbox" | "alerts" | "settings";

interface AdminMobileTabBarProps {
  activeSection: AdminSectionTab;
  pendingCount: number;
  alertsReady: boolean | null;
  onSelectSection: (section: AdminSectionTab) => void;
}

export default function AdminMobileTabBar({
  activeSection,
  pendingCount,
  alertsReady,
  onSelectSection,
}: AdminMobileTabBarProps) {
  const items: Array<{
    id: AdminSectionTab;
    label: string;
    badge?: number;
    dot?: boolean;
    icon: React.ReactNode;
  }> = [
    {
      id: "inbox",
      label: "Consultas",
      badge: pendingCount,
      icon: <InboxIcon className="h-5 w-5" />,
    },
    {
      id: "photos",
      label: "Obras",
      icon: <PhotoGridIcon className="h-5 w-5" />,
    },
    {
      id: "series",
      label: "Series",
      icon: <LayersIcon className="h-5 w-5" />,
    },
    {
      id: "alerts",
      label: "Avisos",
      dot: alertsReady === false,
      icon: <BellIcon className="h-5 w-5" />,
    },
    {
      id: "settings",
      label: "Ajustes",
      icon: <SlidersIcon className="h-5 w-5" />,
    },
  ];

  return (
    <nav
      aria-label="Navegación principal del Estudio Admin"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-[#252730] bg-[#101114]/95 backdrop-blur-xl md:hidden pb-[max(0.5rem,env(safe-area-inset-bottom))]"
    >
      <div className="mx-auto grid max-w-lg grid-cols-5 px-1.5 pt-1.5">
        {items.map((item) => {
          const active = activeSection === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                onSelectSection(item.id);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className={`relative flex flex-col items-center justify-center gap-0.5 rounded-xl py-1.5 text-[10px] font-medium transition cursor-pointer ${
                active ? "text-[#C5A880]" : "text-[#8E8A81] hover:text-[#EBE7DF]"
              }`}
            >
              <span className="relative flex h-6 w-6 items-center justify-center">
                {item.icon}
                {typeof item.badge === "number" && item.badge > 0 && (
                  <span className="absolute -right-2.5 -top-1 flex min-w-[18px] items-center justify-center rounded-full bg-[#C5A880] px-1 py-0.5 font-mono text-[9px] font-bold leading-none text-[#0B0C0E]">
                    {item.badge > 99 ? "99+" : item.badge}
                  </span>
                )}
                {item.dot && (
                  <span
                    className="absolute -right-1 top-0 h-2 w-2 rounded-full bg-amber-400"
                    title="Falta configurar aviso push"
                  />
                )}
              </span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
