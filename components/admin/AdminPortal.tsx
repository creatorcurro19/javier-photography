"use client";

import React, { useState, useEffect, useCallback } from "react";
import type { Photo } from "@/types/photo";
import type { CuadernoPost, SiteSettings } from "@/data/site-config";
import type { InboxItem } from "@/data/inbox";
import AdminLogin from "./AdminLogin";
import AdminDashboard from "./AdminDashboard";
import type { AdminSeries } from "./categoryEditorConfig";

interface AdminPortalProps {
  initialWorks: Photo[];
  initialSeries: AdminSeries[];
  initialSiteSettings: SiteSettings;
  initialCuadernoPosts: CuadernoPost[];
  initialInboxItems?: InboxItem[];
}

export default function AdminPortal({
  initialWorks,
  initialSeries,
  initialSiteSettings,
  initialCuadernoPosts,
  initialInboxItems = [],
}: AdminPortalProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [user, setUser] = useState<string>("Javier");
  const [works, setWorks] = useState<Photo[]>(initialWorks);
  const [series, setSeries] = useState<AdminSeries[]>(initialSeries);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(initialSiteSettings);
  const [cuadernoPosts, setCuadernoPosts] = useState<CuadernoPost[]>(initialCuadernoPosts);
  const [inboxItems, setInboxItems] = useState<InboxItem[]>(initialInboxItems);
  const [githubConfigured, setGithubConfigured] = useState(false);
  const [loadingWorks, setLoadingWorks] = useState(false);
  const [dataVersion, setDataVersion] = useState(0);

  const loadWorks = useCallback(async () => {
    setLoadingWorks(true);
    try {
      const [worksRes, inboxRes] = await Promise.all([
        fetch("/api/admin/works"),
        fetch("/api/admin/inbox"),
      ]);
      if (worksRes.ok) {
        const data = await worksRes.json();
        if (data.works && Array.isArray(data.works)) {
          setWorks(data.works);
        }
        if (Array.isArray(data.series)) setSeries(data.series);
        if (data.siteSettings) setSiteSettings(data.siteSettings);
        if (Array.isArray(data.cuadernoPosts)) setCuadernoPosts(data.cuadernoPosts);
        setGithubConfigured(Boolean(data.githubConfigured));
      }
      if (inboxRes.ok) {
        const inboxData = await inboxRes.json();
        if (Array.isArray(inboxData.items)) {
          setInboxItems(inboxData.items);
        }
      }
      setDataVersion((v) => v + 1);
    } catch {
      // Si falla, se usan initialWorks pasados por servidor
    } finally {
      setLoadingWorks(false);
    }
  }, []);

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/admin/check");
        if (res.ok) {
          const data = await res.json();
          if (data.authenticated) {
            setUser(data.user || "Javier");
            setIsAuthenticated(true);
            loadWorks();
            return;
          }
        }
      } catch {
        // Fallback a no autenticado
      }
      setIsAuthenticated(false);
    }

    checkAuth();
  }, [loadWorks]);

  const handleLoginSuccess = async (userName: string) => {
    setUser(userName);
    setIsAuthenticated(true);
    await loadWorks();
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      try {
        localStorage.removeItem("je_admin_token");
      } catch {
        // ignore
      }
    } catch {
      // ignore
    }
    setIsAuthenticated(false);
  };

  if (isAuthenticated === null) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#C5A880] border-t-transparent" />
          <span className="font-mono text-xs uppercase tracking-widest text-[#A39E93]">
            Comprobando credenciales...
          </span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div>
      {loadingWorks && (
        <div className="fixed bottom-4 right-4 z-50 rounded-lg border border-[#C5A880]/30 bg-[#16171B] px-3 py-1.5 font-mono text-[11px] text-[#C5A880] shadow-lg">
          Sincronizando archivo...
        </div>
      )}
      <AdminDashboard
        key={dataVersion}
        initialWorks={works}
        initialSeries={series}
        initialSiteSettings={siteSettings}
        initialCuadernoPosts={cuadernoPosts}
        initialInboxItems={inboxItems}
        githubConfigured={githubConfigured}
        user={user}
        onLogout={handleLogout}
      />
    </div>
  );
}
