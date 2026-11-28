"use client";

import React, { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import type { Photo, PhotoCategory, Project } from "@/types/photo";
import { PHOTO_CATEGORIES, CATEGORY_METADATA } from "@/types/photo";
import WorkEditorModal from "./WorkEditorModal";
import BatchUploadModal from "./BatchUploadModal";
import BulkPricesModal from "./BulkPricesModal";
import SeriesManagerSection from "./SeriesManagerSection";
import SiteSettingsSection from "./SiteSettingsSection";
import { type AdminSeries, type BulkWorksParams } from "./categoryEditorConfig";
import PhotoSeriesAssignModal from "./PhotoSeriesAssignModal";
import type { CuadernoPost, SiteSettings } from "@/data/site-config";
import {
  SearchIcon,
  CloseIcon,
  EditIcon,
  ExternalLinkIcon,
  DownloadIcon,
  StarIcon,
  LogOutIcon,
  GitHubIcon,
  CheckIcon,
  TrashIcon,
  UploadIcon,
  TagIcon,
  BellIcon,
} from "./AdminIcons";
import InboxSection from "./InboxSection";
import MobileAlertsPanel from "./MobileAlertsPanel";
import AdminMobileTabBar, { type AdminSectionTab } from "./AdminMobileTabBar";
import type { InboxItem } from "@/data/inbox";
import { getAdminAuthHeaders } from "@/lib/admin-client";

interface UndoSnapshot {
  label: string;
  works: Photo[];
  series: Project[];
}

interface AdminDashboardProps {
  initialTab?: AdminSectionTab;
  initialWorks: Photo[];
  initialSeries: AdminSeries[];
  initialSiteSettings: SiteSettings;
  initialCuadernoPosts: CuadernoPost[];
  initialInboxItems?: InboxItem[];
  onInboxItemsChange?: (items: InboxItem[]) => void;
  onRefreshInbox?: () => void;
  isRefreshingInbox?: boolean;
  githubConfigured: boolean;
  user: string;
  onLogout: () => void;
}

export default function AdminDashboard({
  initialTab = "photos",
  initialWorks,
  initialSeries,
  initialSiteSettings,
  initialCuadernoPosts,
  initialInboxItems = [],
  onInboxItemsChange,
  onRefreshInbox,
  isRefreshingInbox = false,
  githubConfigured,
  user,
  onLogout,
}: AdminDashboardProps) {
  const [works, setWorks] = useState<Photo[]>(initialWorks);
  const [series, setSeries] = useState<AdminSeries[]>(initialSeries);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(initialSiteSettings);
  const [cuadernoPosts, setCuadernoPosts] = useState<CuadernoPost[]>(initialCuadernoPosts);
  const [localInboxItems, setLocalInboxItems] = useState<InboxItem[]>(initialInboxItems);
  const inboxItems = onInboxItemsChange ? initialInboxItems : localInboxItems;
  const setInboxItems = onInboxItemsChange ?? setLocalInboxItems;
  const [activeSection, setActiveSection] = useState<AdminSectionTab>(initialTab);
  const [alertsReady, setAlertsReady] = useState<boolean | null>(null);

  useEffect(() => {
    fetch("/api/health", { cache: "no-store", credentials: "same-origin" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.integrations?.mobilePush) {
          setAlertsReady(Boolean(data.integrations.mobilePush.ready));
        }
      })
      .catch(() => null);
  }, []);

  // Búsqueda y filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("todas");
  const [filterPrintsOnly, setFilterPrintsOnly] = useState(false);
  const [filterFeaturedOnly, setFilterFeaturedOnly] = useState(false);
  const [filterCoversOnly, setFilterCoversOnly] = useState(false);
  const [filterStoryOnly, setFilterStoryOnly] = useState(false);
  const [sortBy, setSortBy] = useState<"id" | "title" | "price" | "year" | "featuredOrder">("id");

  // Modales de edición, subida en lote, precios en bloque y borrado
  const [editingPhoto, setEditingPhoto] = useState<Photo | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);
  const [isBulkPricesOpen, setIsBulkPricesOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingPhoto, setDeletingPhoto] = useState<Photo | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [previewMap, setPreviewMap] = useState<Record<string, string>>({});

  // Historial de Deshacer (#7)
  const [undoHistory, setUndoHistory] = useState<UndoSnapshot[]>([]);
  const [isRestoring, setIsRestoring] = useState(false);

  // Modal de Sincronización / Respaldo
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  const [githubToken, setGithubToken] = useState("");
  const [toastMessage, setToastMessage] = useState<{ text: string; type: "success" | "error" | "warning" } | null>(null);

  const showToast = (text: string, type: "success" | "error" | "warning" = "success") => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), type === "success" ? 4000 : 7000);
  };

  const pushUndoSnapshot = (label: string) => {
    const snap: UndoSnapshot = {
      label,
      works: works.map((w) => ({ ...w })),
      series: series.map((s) => ({
        ...s,
        statement: [...s.statement],
        photoIds: [...s.photoIds],
      })),
    };
    setUndoHistory((prev) => [snap, ...prev.slice(0, 9)]);
  };

  // Gestión por lote y selección múltiple de fotografías
  const [selectedPhotoIds, setSelectedPhotoIds] = useState<string[]>([]);
  const [quickAssignPhoto, setQuickAssignPhoto] = useState<Photo | null>(null);
  const [bulkTargetSeries, setBulkTargetSeries] = useState<string>("");
  const [bulkTargetCategory, setBulkTargetCategory] = useState<PhotoCategory | "">("");

  const seriesTitlesFor = (photoId: string) =>
    series.filter((s) => s.photoIds.includes(photoId)).map((s) => s.title);

  const seriesForPhoto = (photoId: string) =>
    series.filter((s) => s.photoIds.includes(photoId));

  const toggleSelectPhoto = (photoId: string) => {
    setSelectedPhotoIds((prev) =>
      prev.includes(photoId) ? prev.filter((id) => id !== photoId) : [...prev, photoId]
    );
  };

  const handleQuickAssignSeries = async (photoId: string, seriesSlugs: string[]) => {
    setIsSaving(true);
    pushUndoSnapshot("asignar colecciones");
    try {
      const res = await fetch("/api/admin/works", {
        method: "POST",
        headers: getAdminAuthHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify({
          action: "set-photo-series",
          photoId,
          seriesSlugs,
          githubToken: githubToken.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        if (Array.isArray(data.works)) setWorks(data.works);
        if (Array.isArray(data.series)) setSeries(data.series);
        showToast(data.message || "Colecciones actualizadas con éxito.");
      } else {
        setUndoHistory((prev) => prev.slice(1));
        showToast(data.error || "No se pudieron actualizar las colecciones.", "error");
      }
    } catch {
      setUndoHistory((prev) => prev.slice(1));
      showToast("Error de conexión al asignar colecciones.", "error");
    } finally {
      setIsSaving(false);
      setQuickAssignPhoto(null);
    }
  };

  const handleExecuteBulkAction = async (params: BulkWorksParams) => {
    if (params.ids.length === 0) return;
    if (params.actionType === "delete") {
      if (!confirm(`¿Eliminar definitivamente las ${params.ids.length} fotografías seleccionadas del catálogo?`)) {
        return;
      }
    }
    setIsSaving(true);
    pushUndoSnapshot(`operación por lote en ${params.ids.length} fotos`);
    try {
      const res = await fetch("/api/admin/works", {
        method: "POST",
        headers: getAdminAuthHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify({
          action: "bulk-works",
          params,
          githubToken: githubToken.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        if (Array.isArray(data.works)) setWorks(data.works);
        if (Array.isArray(data.series)) setSeries(data.series);
        setSelectedPhotoIds([]);
        showToast(data.message || `${params.ids.length} fotos actualizadas.`);
      } else {
        setUndoHistory((prev) => prev.slice(1));
        showToast(data.error || "Error en la operación por lote.", "error");
      }
    } catch {
      setUndoHistory((prev) => prev.slice(1));
      showToast("Error de conexión en la operación por lote.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const isSeriesCoverPhoto = (photo: Photo) =>
    series.some((s) => s.coverImage === photo.image);

  // Filtrado y ordenación
  const filteredWorks = useMemo(() => {
    return works
      .filter((w) => {
        if (selectedCategory !== "todas" && w.category !== selectedCategory) {
          return false;
        }
        if (filterPrintsOnly && !w.prints) return false;
        if (filterFeaturedOnly && !w.featured) return false;
        if (
          filterCoversOnly &&
          !w.heroOrder &&
          !w.categoryCover &&
          !series.some((s) => s.coverImage === w.image)
        ) {
          return false;
        }
        if (filterStoryOnly && (!w.story || w.story.trim().length === 0)) return false;

        if (searchTerm.trim()) {
          const q = searchTerm.toLowerCase();
          const matchTitle = w.title.toLowerCase().includes(q);
          const matchSlug = w.slug.toLowerCase().includes(q);
          const matchId = w.id.toLowerCase().includes(q);
          const matchSeries = seriesTitlesFor(w.id).some((t) => t.toLowerCase().includes(q));
          const matchLocation =
            w.location?.toLowerCase().includes(q) || w.realLocation?.toLowerCase().includes(q);
          const matchKeywords = w.keywords?.some((k) => k.toLowerCase().includes(q));

          return matchTitle || matchSlug || matchId || matchSeries || matchLocation || matchKeywords;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "title") return a.title.localeCompare(b.title);
        if (sortBy === "year") return b.year - a.year;
        if (sortBy === "featuredOrder") {
          const fa = a.featured ? a.featuredOrder ?? 99 : 999;
          const fb = b.featured ? b.featuredOrder ?? 99 : 999;
          return fa - fb || a.id.localeCompare(b.id);
        }
        if (sortBy === "price") {
          const priceA = a.pricing?.estudio || 95;
          const priceB = b.pricing?.estudio || 95;
          return priceA - priceB;
        }
        return a.id.localeCompare(b.id);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    works,
    series,
    selectedCategory,
    filterPrintsOnly,
    filterFeaturedOnly,
    filterCoversOnly,
    filterStoryOnly,
    searchTerm,
    sortBy,
  ]);

  // Contadores
  const stats = useMemo(() => {
    return {
      total: works.length,
      prints: works.filter((w) => w.prints).length,
      featured: works.filter((w) => w.featured).length,
      withStory: works.filter((w) => w.story && w.story.trim().length > 0).length,
    };
  }, [works]);

  // Guardar o crear obra individual
  const handleSavePhoto = async (
    updated: Photo,
    seriesSlugs?: string[],
    imageBase64?: string,
    seriesCoverSlugs?: string[]
  ) => {
    setIsSaving(true);
    pushUndoSnapshot(
      isCreatingNew ? `añadir "${updated.title}"` : `editar "${updated.title}"`
    );
    try {
      const res = await fetch("/api/admin/works", {
        method: "POST",
        headers: getAdminAuthHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify({
          photo: updated,
          seriesSlugs,
          seriesCoverSlugs,
          imageBase64,
          githubToken: githubToken.trim() || undefined,
        }),
      });

      const data = await res.json();

      if (res.ok && data.ok) {
        const saved: Photo = data.photo ?? updated;
        if (imageBase64) {
          setPreviewMap((prev) => ({ ...prev, [saved.id]: imageBase64 }));
        }
        if (Array.isArray(data.works)) {
          setWorks(data.works);
        } else {
          setWorks((prev) => {
            const exists = prev.some((w) => w.id === saved.id);
            return exists
              ? prev.map((w) => (w.id === saved.id ? saved : w))
              : [saved, ...prev];
          });
        }
        if (Array.isArray(data.series)) setSeries(data.series);
        setEditingPhoto(null);
        setIsCreatingNew(false);
        showToast(data.message || `"${saved.title}" guardada.`, data.published ? "success" : "warning");
      } else {
        setUndoHistory((prev) => prev.slice(1));
        showToast(data.error || "No se pudo guardar la fotografía en el servidor.", "error");
      }
    } catch {
      setUndoHistory((prev) => prev.slice(1));
      showToast("Error de conexión al guardar los datos.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  // Subida en lote (#1)
  const handleBatchSubmit = async (
    items: { photo: Photo; imageBase64: string }[],
    seriesSlugs: string[]
  ) => {
    setIsSaving(true);
    pushUndoSnapshot(`subida en lote (${items.length} fotos)`);
    try {
      const res = await fetch("/api/admin/works", {
        method: "POST",
        headers: getAdminAuthHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify({
          action: "batch-create",
          items,
          seriesSlugs,
          githubToken: githubToken.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        const nextPreviews: Record<string, string> = {};
        for (const it of items) {
          nextPreviews[it.photo.id] = it.imageBase64;
        }
        setPreviewMap((prev) => ({ ...prev, ...nextPreviews }));
        if (Array.isArray(data.works)) setWorks(data.works);
        if (Array.isArray(data.series)) setSeries(data.series);
        setIsBatchModalOpen(false);
        showToast(
          data.message || `${items.length} fotografías añadidas.`,
          data.published ? "success" : "warning"
        );
      } else {
        setUndoHistory((prev) => prev.slice(1));
        showToast(data.error || "No se pudo completar la subida en lote.", "error");
      }
    } catch {
      setUndoHistory((prev) => prev.slice(1));
      showToast("Error de conexión en la subida en lote.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  // Cambio de precios en bloque (#2)
  const handleBulkPricesApply = async (params: {
    scope: "all" | PhotoCategory;
    mode: "set" | "delta";
    estudio?: number;
    galeria?: number;
    coleccion?: number;
    deltaAmount?: number;
    editionTotal?: number;
    prints?: boolean;
  }) => {
    setIsSaving(true);
    pushUndoSnapshot("cambio de precios en bloque");
    try {
      const res = await fetch("/api/admin/works", {
        method: "POST",
        headers: getAdminAuthHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify({
          action: "bulk-prices",
          ...params,
          githubToken: githubToken.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        if (Array.isArray(data.works)) setWorks(data.works);
        if (Array.isArray(data.series)) setSeries(data.series);
        setIsBulkPricesOpen(false);
        showToast(
          data.message || "Precios actualizados en bloque.",
          data.published ? "success" : "warning"
        );
      } else {
        setUndoHistory((prev) => prev.slice(1));
        showToast(data.error || "No se pudieron actualizar los precios.", "error");
      }
    } catch {
      setUndoHistory((prev) => prev.slice(1));
      showToast("Error de conexión al actualizar precios.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  // Guardar Serie Monográfica (#4)
  const handleSaveSeries = async (updatedSeries: Project) => {
    setIsSaving(true);
    pushUndoSnapshot(`editar serie "${updatedSeries.title}"`);
    try {
      const res = await fetch("/api/admin/works", {
        method: "POST",
        headers: getAdminAuthHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify({
          action: "save-series",
          seriesItem: updatedSeries,
          githubToken: githubToken.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        if (Array.isArray(data.works)) setWorks(data.works);
        if (Array.isArray(data.series)) setSeries(data.series);
        showToast(
          data.message || `Serie "${updatedSeries.title}" actualizada.`,
          data.published ? "success" : "warning"
        );
      } else {
        setUndoHistory((prev) => prev.slice(1));
        showToast(data.error || "No se pudo guardar la serie.", "error");
      }
    } catch {
      setUndoHistory((prev) => prev.slice(1));
      showToast("Error de conexión al guardar la serie.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  // Eliminar Serie Monográfica (#1)
  const handleDeleteSeries = async (slug: string) => {
    setIsSaving(true);
    const target = series.find((s) => s.slug === slug);
    pushUndoSnapshot(`eliminar serie "${target?.title || slug}"`);
    try {
      const res = await fetch("/api/admin/works", {
        method: "POST",
        headers: getAdminAuthHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify({
          action: "delete-series",
          slug,
          githubToken: githubToken.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        if (Array.isArray(data.works)) setWorks(data.works);
        if (Array.isArray(data.series)) setSeries(data.series);
        showToast(
          data.message || "Serie eliminada.",
          data.published ? "success" : "warning"
        );
      } else {
        setUndoHistory((prev) => prev.slice(1));
        showToast(data.error || "No se pudo eliminar la serie.", "error");
      }
    } catch {
      setUndoHistory((prev) => prev.slice(1));
      showToast("Error de conexión al eliminar la serie.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  // Guardar Ajustes de la Web, Retrato y Cuaderno (#4)
  const handleSaveSiteConfig = async (
    nextSettings: SiteSettings,
    nextPosts: CuadernoPost[],
    portraitBase64?: string
  ) => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/works", {
        method: "POST",
        headers: getAdminAuthHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify({
          action: "save-site-config",
          siteSettings: nextSettings,
          cuadernoPosts: nextPosts,
          portraitBase64,
          githubToken: githubToken.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        if (data.siteSettings) setSiteSettings(data.siteSettings);
        if (Array.isArray(data.cuadernoPosts)) setCuadernoPosts(data.cuadernoPosts);
        showToast(
          data.message || "Ajustes de la web guardados.",
          data.published ? "success" : "warning"
        );
      } else {
        showToast(data.error || "No se pudieron guardar los ajustes.", "error");
      }
    } catch {
      showToast("Error de conexión al guardar los ajustes.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  // Eliminar una obra del catálogo
  const handleConfirmDelete = async () => {
    if (!deletingPhoto) return;
    setIsDeleting(true);
    pushUndoSnapshot(`eliminar "${deletingPhoto.title}"`);
    try {
      const res = await fetch("/api/admin/works", {
        method: "DELETE",
        headers: getAdminAuthHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify({
          id: deletingPhoto.id,
          githubToken: githubToken.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        const removedId = deletingPhoto.id;
        if (Array.isArray(data.works)) {
          setWorks(data.works);
        } else {
          setWorks((prev) => prev.filter((w) => w.id !== removedId));
        }
        if (Array.isArray(data.series)) setSeries(data.series);
        if (editingPhoto?.id === removedId) {
          setEditingPhoto(null);
          setIsCreatingNew(false);
        }
        setDeletingPhoto(null);
        showToast(data.message || "Fotografía eliminada.", data.published ? "success" : "warning");
      } else {
        setUndoHistory((prev) => prev.slice(1));
        showToast(data.error || "No se pudo eliminar la fotografía.", "error");
      }
    } catch {
      setUndoHistory((prev) => prev.slice(1));
      showToast("Error de conexión al eliminar la fotografía.", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  // Deshacer último cambio (#7)
  const handleUndoLastAction = async () => {
    const latest = undoHistory[0];
    if (!latest || isRestoring) return;
    setIsRestoring(true);
    try {
      const res = await fetch("/api/admin/works", {
        method: "POST",
        headers: getAdminAuthHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify({
          action: "restore-snapshot",
          label: latest.label,
          works: latest.works,
          series: latest.series,
          githubToken: githubToken.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        if (Array.isArray(data.works)) setWorks(data.works);
        if (Array.isArray(data.series)) setSeries(data.series);
        setUndoHistory((prev) => prev.slice(1));
        showToast(data.message || `Deshecho: ${latest.label}`, data.published ? "success" : "warning");
      } else {
        showToast(data.error || "No se pudo deshacer el cambio.", "error");
      }
    } catch {
      showToast("Error de conexión al deshacer el cambio.", "error");
    } finally {
      setIsRestoring(false);
    }
  };

  // Toggles rápidos en tarjeta
  const handleQuickTogglePrints = async (photo: Photo, e: React.MouseEvent) => {
    e.stopPropagation();
    await handleSavePhoto({ ...photo, prints: !photo.prints });
  };

  const handleQuickToggleFeatured = async (photo: Photo, e: React.MouseEvent) => {
    e.stopPropagation();
    await handleSavePhoto({ ...photo, featured: !photo.featured });
  };

  const defaultBatchCategory: PhotoCategory =
    selectedCategory !== "todas"
      ? (selectedCategory as PhotoCategory)
      : "fauna-naturaleza";

  return (
    <div className="min-h-[100dvh] bg-[#0B0C0E] text-[#EBE7DF] pb-28 md:pb-20">
      {/* Toast Flotante */}
      {toastMessage && (
        <div className="fixed top-6 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-[105] flex items-center gap-3 rounded-xl border border-[#C5A880]/40 bg-[#16171B]/95 px-5 py-3.5 shadow-2xl backdrop-blur-md animate-fadeIn">
          {toastMessage.type === "success" ? (
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
              <CheckIcon className="h-4 w-4" />
            </div>
          ) : toastMessage.type === "warning" ? (
            <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-amber-300 font-bold text-sm">
              !
            </div>
          ) : (
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-500/20 text-red-400">
              <CloseIcon className="h-4 w-4" />
            </div>
          )}
          <span className="text-xs font-medium text-[#EBE7DF]">{toastMessage.text}</span>
        </div>
      )}

      {/* Barra Superior de Control (App Header con safe area para iPhone) */}
      <header className="sticky top-0 z-40 border-b border-[#202227] bg-[#121316]/95 backdrop-blur-md pt-[env(safe-area-inset-top)]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#C5A880]/30 bg-[#181A1F] text-[#C5A880] font-serif font-bold text-sm">
              JE
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="truncate font-serif text-sm font-medium text-[#EBE7DF] sm:text-base">
                  Panel de Autor
                </span>
                <span className="hidden sm:inline-block rounded-full bg-[#C5A880]/15 px-2 py-0.5 font-mono text-[10px] text-[#C5A880]">
                  {stats.total} obras
                </span>
              </div>
              <p className="hidden sm:block truncate text-[11px] text-[#8E8A81]">
                Sesión: {user}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {undoHistory.length > 0 && (
              <button
                type="button"
                disabled={isRestoring}
                onClick={handleUndoLastAction}
                className="inline-flex items-center gap-1.5 rounded-lg border border-amber-400/40 bg-amber-500/15 px-3 py-1.5 text-xs font-medium text-amber-200 hover:bg-amber-500/25 transition cursor-pointer"
                title={`Deshacer: ${undoHistory[0].label}`}
              >
                <span>↩</span>
                <span className="hidden md:inline truncate max-w-[180px]">
                  Deshacer ({undoHistory[0].label})
                </span>
                <span className="md:hidden">Deshacer</span>
              </button>
            )}

            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#2B2D35] px-2.5 sm:px-3 py-1.5 text-xs text-[#A39E93] hover:text-[#EBE7DF] hover:border-[#C5A880] transition"
              title="Ver web pública"
            >
              <span className="hidden sm:inline">Ver Web</span>
              <ExternalLinkIcon className="h-3.5 w-3.5" />
            </a>

            <button
              onClick={() => setIsSyncModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#2B2D35] bg-[#17181D] px-3 py-1.5 text-xs text-[#EBE7DF] hover:border-[#C5A880] transition cursor-pointer"
              title="Estado de sincronización y descarga de respaldo"
            >
              {githubConfigured ? (
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
              ) : (
                <GitHubIcon className="h-3.5 w-3.5 text-[#C5A880]" />
              )}
              <span className="hidden sm:inline">
                {githubConfigured ? "Conectado" : "Sincronizar"}
              </span>
            </button>

            <button
              onClick={onLogout}
              className="inline-flex items-center gap-1.5 rounded-lg border border-red-500/20 bg-red-950/20 px-3 py-1.5 text-xs text-red-300 hover:bg-red-950/40 hover:border-red-500/40 transition cursor-pointer"
            >
              <LogOutIcon className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 pt-6 sm:px-6">
        {!githubConfigured && !githubToken.trim() && (
          <div className="mb-6 rounded-xl border border-amber-500/30 bg-amber-950/20 px-4 py-3 text-xs leading-relaxed text-amber-200">
            <strong className="font-semibold">Publicación pendiente de activar:</strong> puedes editar, pero los
            cambios no llegarán a la web pública hasta conectar GitHub (botón «Sincronizar»).
          </div>
        )}

        {/* Barra de Deshacer Destacada si hay cambios recientes (#7) */}
        {undoHistory.length > 0 && (
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-500/30 bg-amber-950/20 px-4 py-2.5 text-xs text-amber-200">
            <span>
              Último cambio: <strong className="text-[#EBE7DF]">{undoHistory[0].label}</strong>
            </span>
            <button
              type="button"
              disabled={isRestoring}
              onClick={handleUndoLastAction}
              className="inline-flex items-center gap-1.5 rounded-lg bg-amber-400 px-3 py-1.5 font-semibold text-[#0B0C0E] hover:bg-amber-300 disabled:opacity-50 transition cursor-pointer"
            >
              <span>↩</span>
              <span>{isRestoring ? "Restaurando…" : "Deshacer este cambio / recuperar"}</span>
            </button>
          </div>
        )}

        {/* Conmutador principal (en escritorio; en móvil se complementa con barra inferior App) */}
        <div className="mb-6 hidden md:flex flex-wrap items-center gap-2 border-b border-[#22242B] pb-3">
          <button
            type="button"
            onClick={() => setActiveSection("photos")}
            className={`rounded-xl px-4 py-2.5 text-xs sm:text-sm font-medium transition cursor-pointer ${
              activeSection === "photos"
                ? "bg-[#C5A880] text-[#0B0C0E] font-semibold"
                : "border border-[#262830] bg-[#141519] text-[#A39E93] hover:text-[#EBE7DF]"
            }`}
          >
            Fotos ({works.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveSection("series")}
            className={`rounded-xl px-4 py-2.5 text-xs sm:text-sm font-medium transition cursor-pointer ${
              activeSection === "series"
                ? "bg-[#C5A880] text-[#0B0C0E] font-semibold"
                : "border border-[#262830] bg-[#141519] text-[#A39E93] hover:text-[#EBE7DF]"
            }`}
          >
            Colecciones y Series ({series.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveSection("inbox")}
            className={`relative flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-medium transition cursor-pointer ${
              activeSection === "inbox"
                ? "bg-[#C5A880] text-[#0B0C0E] font-semibold"
                : "border border-[#262830] bg-[#141519] text-[#A39E93] hover:text-[#EBE7DF]"
            }`}
          >
            <span>Pedidos y Mensajes</span>
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-mono font-semibold ${
                activeSection === "inbox"
                  ? "bg-[#0B0C0E] text-[#C5A880]"
                  : inboxItems.filter((i) => i.status === "pendiente").length > 0
                  ? "bg-[#C5A880] text-[#0B0C0E]"
                  : "bg-[#22242B] text-[#8E8A81]"
              }`}
            >
              {inboxItems.filter((i) => i.status === "pendiente").length}
            </span>
          </button>
          <button
            type="button"
            onClick={() => setActiveSection("alerts")}
            className={`relative flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-medium transition cursor-pointer ${
              activeSection === "alerts"
                ? "bg-[#C5A880] text-[#0B0C0E] font-semibold"
                : "border border-[#262830] bg-[#141519] text-[#A39E93] hover:text-[#EBE7DF]"
            }`}
          >
            <BellIcon className="h-4 w-4" />
            <span>App y Avisos Móvil</span>
            {alertsReady === true && (
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
            )}
            {alertsReady === false && (
              <span className="h-2 w-2 rounded-full bg-amber-400" />
            )}
          </button>
          <button
            type="button"
            onClick={() => setActiveSection("settings")}
            className={`rounded-xl px-4 py-2.5 text-xs sm:text-sm font-medium transition cursor-pointer ${
              activeSection === "settings"
                ? "bg-[#C5A880] text-[#0B0C0E] font-semibold"
                : "border border-[#262830] bg-[#141519] text-[#A39E93] hover:text-[#EBE7DF]"
            }`}
          >
            Ajustes
          </button>
        </div>

        {activeSection === "inbox" ? (
          <InboxSection
            initialItems={inboxItems}
            onToast={showToast}
            onItemsChange={setInboxItems}
            onRefresh={onRefreshInbox}
            isRefreshing={isRefreshingInbox}
          />
        ) : activeSection === "alerts" ? (
          <MobileAlertsPanel
            onToast={showToast}
            onStatusLoaded={setAlertsReady}
          />
        ) : activeSection === "series" ? (
          <SeriesManagerSection
            series={series}
            works={works}
            previewMap={previewMap}
            isSaving={isSaving}
            onSaveSeries={handleSaveSeries}
            onDeleteSeries={handleDeleteSeries}
          />
        ) : activeSection === "settings" ? (
          <SiteSettingsSection
            initialSettings={siteSettings}
            initialPosts={cuadernoPosts}
            works={works}
            isSaving={isSaving}
            onSaveConfig={handleSaveSiteConfig}
          />
        ) : (
          <>
            {/* Botones Grandes de Acción Rápida para Catálogo */}
            <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setIsBatchModalOpen(true)}
                className="flex items-center justify-center gap-2.5 rounded-2xl border border-[#C5A880]/50 bg-gradient-to-r from-[#C5A880] to-[#A88C64] px-5 py-3.5 text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#0B0C0E] shadow-xl shadow-[#C5A880]/10 transition hover:opacity-95 cursor-pointer"
              >
                <UploadIcon className="h-5 w-5" />
                <span>Subir fotos en lote</span>
              </button>

              <button
                type="button"
                onClick={() => setIsBulkPricesOpen(true)}
                className="flex items-center justify-center gap-2.5 rounded-2xl border border-[#2D303A] bg-[#14151A] px-5 py-3.5 text-xs sm:text-sm font-medium uppercase tracking-wider text-[#EBE7DF] transition hover:border-[#C5A880] hover:text-[#C5A880] cursor-pointer"
              >
                <TagIcon className="h-4 w-4 text-[#C5A880]" />
                <span>Cambiar precios en bloque</span>
              </button>
            </div>
            {/* Banner de Métricas Rápidas (oculto en versión minimalista) */}
            <section className="grid grid-cols-2 gap-3 sm:grid-cols-4 mb-6">
              <div className="rounded-xl border border-[#22242B] bg-[#141519] p-3.5 sm:p-4">
                <span className="font-mono text-[10px] text-[#8E8A81] uppercase tracking-wider">
                  Total Archivo
                </span>
                <div className="mt-1 flex items-baseline justify-between">
                  <span className="font-serif text-2xl font-light text-[#EBE7DF]">{stats.total}</span>
                  <span className="font-mono text-[10px] text-[#C5A880]">100% catalogado</span>
                </div>
              </div>

              <div className="rounded-xl border border-[#22242B] bg-[#141519] p-3.5 sm:p-4">
                <span className="font-mono text-[10px] text-[#8E8A81] uppercase tracking-wider">
                  Venta Fine Art
                </span>
                <div className="mt-1 flex items-baseline justify-between">
                  <span className="font-serif text-2xl font-light text-[#C5A880]">{stats.prints}</span>
                  <span className="font-mono text-[10px] text-emerald-400">Activas</span>
                </div>
              </div>

              <div className="rounded-xl border border-[#22242B] bg-[#141519] p-3.5 sm:p-4">
                <span className="font-mono text-[10px] text-[#8E8A81] uppercase tracking-wider">
                  En Portada
                </span>
                <div className="mt-1 flex items-baseline justify-between">
                  <span className="font-serif text-2xl font-light text-[#EBE7DF]">{stats.featured}</span>
                  <span className="font-mono text-[10px] text-[#C5A880]">Destacadas</span>
                </div>
              </div>

              <div className="rounded-xl border border-[#22242B] bg-[#141519] p-3.5 sm:p-4">
                <span className="font-mono text-[10px] text-[#8E8A81] uppercase tracking-wider">
                  Historias de Campo
                </span>
                <div className="mt-1 flex items-baseline justify-between">
                  <span className="font-serif text-2xl font-light text-[#EBE7DF]">{stats.withStory}</span>
                  <span className="font-mono text-[10px] text-[#A39E93]">Narradas</span>
                </div>
              </div>
            </section>

            {/* Barra de Filtros y Búsqueda */}
            <section className="mb-6 space-y-3 rounded-2xl border border-[#202227] bg-[#131418] p-4 sm:p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative flex-1">
                  <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8E8A81]" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar por título, serie, lugar o etiquetas…"
                    className="w-full rounded-xl border border-[#2A2C34] bg-[#18191F] py-2.5 pl-10 pr-9 text-xs sm:text-sm text-[#EBE7DF] placeholder-[#66635C] transition focus:border-[#C5A880] focus:outline-none"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8E8A81] hover:text-[#EBE7DF] p-1"
                    >
                      <CloseIcon className="h-4 w-4" />
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <label className="text-[11px] font-mono uppercase text-[#8E8A81] whitespace-nowrap">
                    Ordenar:
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                    className="rounded-lg border border-[#2A2C34] bg-[#18191F] px-3 py-2 text-xs text-[#EBE7DF] focus:border-[#C5A880] focus:outline-none"
                  >
                    <option value="id">Catálogo (ID)</option>
                    <option value="featuredOrder">Orden en Portada (1º, 2º…)</option>
                    <option value="title">Título (A-Z)</option>
                    <option value="year">Año de captura</option>
                    <option value="price">Precio Estudio (€)</option>
                  </select>
                </div>
              </div>

              {/* Pastillas de Categoría */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar pt-1">
                <button
                  onClick={() => setSelectedCategory("todas")}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                    selectedCategory === "todas"
                      ? "bg-[#C5A880] text-[#0B0C0E] font-semibold"
                      : "border border-[#282A31] bg-[#17181D] text-[#8E8A81] hover:text-[#EBE7DF]"
                  }`}
                >
                  Todas ({works.length})
                </button>

                {PHOTO_CATEGORIES.map((cat) => {
                  const count = works.filter((w) => w.category === cat).length;
                  const title = CATEGORY_METADATA[cat]?.title || cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`rounded-full px-3.5 py-1.5 text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                        selectedCategory === cat
                          ? "bg-[#C5A880] text-[#0B0C0E] font-semibold"
                          : "border border-[#282A31] bg-[#17181D] text-[#8E8A81] hover:text-[#EBE7DF]"
                      }`}
                    >
                      {title} ({count})
                    </button>
                  );
                })}
              </div>

              {/* Filtros rápidos secundarios */}
              <div className="flex flex-wrap items-center gap-4 pt-1 border-t border-[#1F2126] text-xs">
                <label className="flex items-center gap-2 cursor-pointer text-[#A39E93] hover:text-[#EBE7DF]">
                  <input
                    type="checkbox"
                    checked={filterPrintsOnly}
                    onChange={(e) => setFilterPrintsOnly(e.target.checked)}
                    className="h-3.5 w-3.5 rounded border-[#383A43] bg-[#1A1C22] text-[#C5A880]"
                  />
                  <span>En venta</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-[#A39E93] hover:text-[#EBE7DF]">
                  <input
                    type="checkbox"
                    checked={filterFeaturedOnly}
                    onChange={(e) => setFilterFeaturedOnly(e.target.checked)}
                    className="h-3.5 w-3.5 rounded border-[#383A43] bg-[#1A1C22] text-[#C5A880]"
                  />
                  <span>Solo Destacadas</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-[#A39E93] hover:text-[#EBE7DF]">
                  <input
                    type="checkbox"
                    checked={filterCoversOnly}
                    onChange={(e) => setFilterCoversOnly(e.target.checked)}
                    className="h-3.5 w-3.5 rounded border-[#383A43] bg-[#1A1C22] text-[#C5A880]"
                  />
                  <span>Solo Portadas (Hero)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-[#A39E93] hover:text-[#EBE7DF]">
                  <input
                    type="checkbox"
                    checked={filterStoryOnly}
                    onChange={(e) => setFilterStoryOnly(e.target.checked)}
                    className="h-3.5 w-3.5 rounded border-[#383A43] bg-[#1A1C22] text-[#C5A880]"
                  />
                  <span>Solo con Historia</span>
                </label>

                <span className="ml-auto font-mono text-[11px] text-[#8E8A81]">
                  {filteredWorks.length} de {works.length} fotos
                </span>
              </div>
            </section>

            {/* Barra de Gestión por Lote (oculta en versión minimalista cuando no hay selección) */}
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#23252D] bg-[#15161B] px-4 py-2.5">
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    const visibleIds = filteredWorks.map((w) => w.id);
                    const allSelected = visibleIds.every((id) => selectedPhotoIds.includes(id));
                    if (allSelected) {
                      setSelectedPhotoIds((prev) => prev.filter((id) => !visibleIds.includes(id)));
                    } else {
                      setSelectedPhotoIds((prev) => Array.from(new Set([...prev, ...visibleIds])));
                    }
                  }}
                  className={`flex items-center gap-2 rounded-lg px-3 py-1.5 font-mono text-xs transition cursor-pointer ${
                    selectedPhotoIds.length > 0
                      ? "border border-[#C5A880]/50 bg-[#C5A880]/15 text-[#C5A880]"
                      : "border border-[#2D3038] bg-[#1A1C22] text-[#A39E93] hover:text-[#EBE7DF]"
                  }`}
                >
                  <CheckIcon className="h-3.5 w-3.5" />
                  <span>
                    {filteredWorks.length > 0 && filteredWorks.every((w) => selectedPhotoIds.includes(w.id))
                      ? "Desmarcar todas las visibles"
                      : `Seleccionar todas las visibles (${filteredWorks.length})`}
                  </span>
                </button>

                {selectedPhotoIds.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setSelectedPhotoIds([])}
                    className="font-mono text-xs text-[#8E8A81] hover:text-red-400 transition cursor-pointer"
                  >
                    Deseleccionar ({selectedPhotoIds.length})
                  </button>
                )}
              </div>

              <div className="font-mono text-xs text-[#8E8A81]">
                {selectedPhotoIds.length > 0 ? (
                  <span className="text-[#C5A880] font-semibold">
                    ✓ {selectedPhotoIds.length} foto(s) marcada(s) para acciones en lote
                  </span>
                ) : (
                  <span>Marca el recuadro de cualquier foto para gestionarla en lote o asignarla a colecciones</span>
                )}
              </div>
            </div>

            {/* Cuadrícula de Obras */}
            {filteredWorks.length === 0 ? (
              <div className="rounded-2xl border border-[#22242B] bg-[#131418] py-16 text-center">
                <p className="text-sm text-[#A39E93]">No se encontraron obras con los filtros aplicados.</p>
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("todas");
                    setFilterPrintsOnly(false);
                    setFilterFeaturedOnly(false);
                    setFilterCoversOnly(false);
                    setFilterStoryOnly(false);
                  }}
                  className="mt-3 rounded-lg border border-[#C5A880]/30 px-4 py-2 text-xs text-[#C5A880] hover:bg-[#C5A880]/10 transition"
                >
                  Restablecer todos los filtros
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredWorks.map((photo) => {
                  const estudioPrice = photo.pricing?.estudio || 95;
                  const galeriaPrice = photo.pricing?.galeria || 175;
                  const coleccionPrice = photo.pricing?.coleccion || 290;
                  const seriesCover = isSeriesCoverPhoto(photo);
                  const isSelected = selectedPhotoIds.includes(photo.id);
                  const photoSeriesList = seriesForPhoto(photo.id);

                  return (
                    <div
                      key={photo.id}
                      className={`group relative flex flex-col justify-between rounded-xl border p-4 transition-all hover:bg-[#16171D] hover:shadow-xl ${
                        isSelected
                          ? "border-[#C5A880] bg-[#161720] ring-1 ring-[#C5A880]/50"
                          : "border-[#202228] bg-[#131418] hover:border-[#C5A880]/40"
                      }`}
                    >
                      <div>
                        {/* Top fila: Miniatura + Info básica */}
                        <div className="flex gap-3.5">
                          <div className="relative flex h-20 w-24 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg border border-[#262830] bg-[#0B0C0E] p-1">
                            {/* Checkbox de Selección Múltiple */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleSelectPhoto(photo.id);
                              }}
                              className={`absolute top-1.5 left-1.5 z-10 flex h-5 w-5 items-center justify-center rounded border transition cursor-pointer ${
                                isSelected
                                  ? "bg-[#C5A880] text-[#0B0C0E] border-[#C5A880] shadow"
                                  : "bg-black/70 border-white/40 text-transparent hover:border-[#C5A880]"
                              }`}
                              title={isSelected ? "Deseleccionar" : "Seleccionar"}
                            >
                              <CheckIcon className="h-3 w-3 stroke-[3]" />
                            </button>

                            {previewMap[photo.id] ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={previewMap[photo.id]}
                                alt={photo.alt || photo.title}
                                className="max-h-full max-w-full h-auto w-auto rounded object-contain transition-transform duration-300 group-hover:scale-105"
                              />
                            ) : (
                              <Image
                                src={photo.image}
                                alt={photo.alt || photo.title}
                                width={photo.width}
                                height={photo.height}
                                sizes="96px"
                                className="max-h-full max-w-full h-auto w-auto rounded object-contain transition-transform duration-300 group-hover:scale-105"
                              />
                            )}
                            {photo.featured && (
                              <div
                                className="absolute top-1 right-1 rounded bg-[#0B0C0E]/80 p-0.5 text-[#C5A880]"
                                title="Destacada en portada"
                              >
                                <StarIcon className="h-3 w-3" filled />
                              </div>
                            )}
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="font-mono text-[10px] text-[#C5A880] bg-[#C5A880]/10 px-1.5 py-0.5 rounded">
                                {photo.id}
                              </span>
                              <span className="truncate text-[10px] text-[#8E8A81] uppercase tracking-wider">
                                {CATEGORY_METADATA[photo.category]?.title || photo.category}
                              </span>
                            </div>

                            <h3 className="mt-1 truncate font-serif text-base font-medium text-[#EBE7DF]">
                              {photo.title}
                            </h3>

                            <p className="truncate text-xs text-[#8E8A81]">
                              {photo.location || photo.country || "España"} &middot; {photo.year}
                            </p>

                            {/* Colecciones / Series a las que pertenece (oculto en versión minimalista) */}
                            <div className="mt-1.5 flex flex-wrap items-center gap-1">
                              {photoSeriesList.length > 0 ? (
                                photoSeriesList.map((s) => (
                                  <span
                                    key={s.slug}
                                    className="inline-flex items-center gap-1 rounded bg-[#C5A880]/15 border border-[#C5A880]/30 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-[#C5A880]"
                                    title={`En la colección: ${s.title}`}
                                  >
                                    <span>📁 {s.title}</span>
                                  </span>
                                ))
                              ) : (
                                <span className="font-mono text-[9px] text-[#716C62]">
                                  Sin colección
                                </span>
                              )}
                            </div>

                            {/* Etiquetas de posición en Hero / Portadas (#3) */}
                            {(photo.heroOrder || photo.categoryCover || seriesCover) && (
                              <div className="mt-1.5 flex flex-wrap gap-1">
                                {photo.heroOrder && (
                                  <span className="rounded bg-[#C5A880] px-1.5 py-0.5 font-mono text-[9px] font-semibold uppercase text-[#0B0C0E]">
                                    Portada 0{photo.heroOrder}
                                  </span>
                                )}
                                {photo.categoryCover && (
                                  <span className="rounded border border-[#C5A880]/40 bg-[#C5A880]/15 px-1.5 py-0.5 font-mono text-[9px] uppercase text-[#C5A880]">
                                    Portada Categoría
                                  </span>
                                )}
                                {seriesCover && (
                                  <span className="rounded border border-white/20 bg-white/10 px-1.5 py-0.5 font-mono text-[9px] uppercase text-[#EBE7DF]">
                                    Portada Serie
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Descripción (oculta en tarjeta minimalista) */}
                        <p className="mt-3 line-clamp-2 text-xs text-[#A39E93] leading-relaxed">
                          {photo.description}
                        </p>

                        {/* Fila de Precios Fine Art o Archivo */}
                        {photo.prints ? (
                          <div className="mt-3 flex items-center justify-between rounded-lg border border-[#202228] bg-[#17181E] px-2.5 py-1.5 font-mono text-[11px]">
                            <div className="text-center">
                              <span className="block text-[9px] text-[#716C62] uppercase">Estudio</span>
                              <span className="whitespace-nowrap font-semibold text-[#EBE7DF]">{estudioPrice}&nbsp;€</span>
                            </div>
                            <div className="h-6 w-px bg-[#262830]" />
                            <div className="text-center">
                              <span className="block text-[9px] text-[#716C62] uppercase">Galería</span>
                              <span className="whitespace-nowrap font-semibold text-[#C5A880]">{galeriaPrice}&nbsp;€</span>
                            </div>
                            <div className="h-6 w-px bg-[#262830]" />
                            <div className="text-center">
                              <span className="block text-[9px] text-[#716C62] uppercase">Colección</span>
                              <span className="whitespace-nowrap font-semibold text-[#EBE7DF]">{coleccionPrice}&nbsp;€</span>
                            </div>
                          </div>
                        ) : (
                          <div className="mt-3 flex items-center justify-between rounded-lg border border-[#202228] bg-[#131418] px-2.5 py-1.5 font-mono text-[10px] text-[#8E8A81]">
                            <span className="truncate">
                              Sin venta directa
                            </span>
                            <span className="shrink-0 ml-1 rounded bg-[#1F2128] px-1.5 py-0.5 text-[#A39E93]">Venta OFF</span>
                          </div>
                        )}
                      </div>

                      {/* Acciones y Toggles Rápidos */}
                      <div className="mt-3.5 pt-3 border-t border-[#1E2026] flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={(e) => handleQuickTogglePrints(photo, e)}
                            className={`inline-flex min-h-[38px] items-center rounded-lg px-2.5 py-1.5 text-[10px] font-mono transition cursor-pointer ${
                              photo.prints
                                ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                                : "bg-[#202228] text-[#716C62] border border-transparent"
                            }`}
                            title="Activar/desactivar venta Fine Art"
                          >
                            {photo.prints ? "Venta: ON" : "Venta: OFF"}
                          </button>

                          <button
                            type="button"
                            onClick={(e) => handleQuickToggleFeatured(photo, e)}
                            className={`inline-flex min-h-[38px] items-center rounded-lg px-2.5 py-1.5 text-[10px] font-mono transition cursor-pointer ${
                              photo.featured
                                ? "bg-[#C5A880]/20 text-[#C5A880] border border-[#C5A880]/40"
                                : "bg-[#202228] text-[#716C62] border border-transparent"
                            }`}
                            title="Destacar en portada principal"
                          >
                            {photo.featured
                              ? `★ Portada${photo.featuredOrder ? ` #${photo.featuredOrder}` : ""}`
                              : "Portada: No"}
                          </button>
                        </div>

                        {/* Botones Editar y Papelera */}
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setQuickAssignPhoto(photo)}
                            className="inline-flex min-h-[38px] items-center gap-1 rounded-lg border border-[#2B2D36] bg-[#16171E] px-2.5 py-1.5 text-xs font-mono text-[#A39E93] hover:border-[#C5A880] hover:text-[#C5A880] transition cursor-pointer"
                            title="Gestionar colecciones de esta obra"
                          >
                            <span>📁 Colecciones</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setIsCreatingNew(false);
                              setEditingPhoto(photo);
                            }}
                            className="inline-flex min-h-[38px] items-center gap-1.5 rounded-lg border border-[#C5A880]/30 bg-[#1A1C22] px-3 py-1.5 text-xs font-medium text-[#C5A880] hover:bg-[#C5A880] hover:text-[#0B0C0E] transition cursor-pointer"
                          >
                            <EditIcon className="h-3.5 w-3.5" />
                            <span>Editar</span>
                          </button>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeletingPhoto(photo);
                            }}
                            className="inline-flex min-h-[38px] min-w-[38px] items-center justify-center rounded-lg border border-red-500/25 bg-red-950/20 px-2.5 py-1.5 text-red-300 hover:bg-red-600 hover:border-red-500 hover:text-white transition cursor-pointer"
                            title={`Eliminar "${photo.title}"`}
                            aria-label={`Eliminar "${photo.title}"`}
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Barra Flotante de Acciones en Lote */}
            {selectedPhotoIds.length > 0 && (
              <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[80] w-[95vw] max-w-4xl rounded-2xl border border-[#C5A880]/60 bg-[#121316]/95 p-3 sm:p-4 text-[#EBE7DF] shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#C5A880] font-mono text-xs font-bold text-[#0B0C0E]">
                      {selectedPhotoIds.length}
                    </span>
                    <span className="font-mono text-xs text-[#EBE7DF]">
                      fotos seleccionadas
                    </span>
                    <button
                      type="button"
                      onClick={() => setSelectedPhotoIds([])}
                      className="ml-2 font-mono text-xs text-[#8E8A81] hover:text-white transition cursor-pointer underline"
                    >
                      Deseleccionar
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {/* Asignar a Colección */}
                    <div className="flex items-center gap-1.5">
                      <select
                        value={bulkTargetSeries}
                        onChange={(e) => setBulkTargetSeries(e.target.value)}
                        className="rounded-lg border border-[#2E313A] bg-[#181920] px-2.5 py-1.5 font-mono text-xs text-[#EBE7DF] focus:border-[#C5A880] focus:outline-none"
                      >
                        <option value="">Colección destino…</option>
                        {series.map((s) => (
                          <option key={s.slug} value={s.slug}>
                            📁 {s.title} ({s.photoIds.length})
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        disabled={!bulkTargetSeries || isSaving}
                        onClick={() => {
                          if (!bulkTargetSeries) return;
                          handleExecuteBulkAction({
                            ids: selectedPhotoIds,
                            actionType: "addToSeries",
                            targetSeriesSlug: bulkTargetSeries,
                          });
                          setBulkTargetSeries("");
                        }}
                        className="rounded-lg border border-[#C5A880]/50 bg-[#C5A880]/20 px-2.5 py-1.5 font-mono text-xs font-semibold text-[#C5A880] hover:bg-[#C5A880] hover:text-[#0B0C0E] disabled:opacity-40 transition cursor-pointer"
                      >
                        + Asignar
                      </button>
                    </div>

                    {/* Cambiar Categoría */}
                    <div className="flex items-center gap-1.5">
                      <select
                        value={bulkTargetCategory}
                        onChange={(e) => setBulkTargetCategory(e.target.value as PhotoCategory | "")}
                        className="rounded-lg border border-[#2E313A] bg-[#181920] px-2.5 py-1.5 font-mono text-xs text-[#EBE7DF] focus:border-[#C5A880] focus:outline-none"
                      >
                        <option value="">Categoría…</option>
                        {PHOTO_CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>
                            {CATEGORY_METADATA[cat]?.title}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        disabled={!bulkTargetCategory || isSaving}
                        onClick={() => {
                          if (!bulkTargetCategory) return;
                          handleExecuteBulkAction({
                            ids: selectedPhotoIds,
                            actionType: "setCategory",
                            targetCategory: bulkTargetCategory,
                          });
                          setBulkTargetCategory("");
                        }}
                        className="rounded-lg border border-[#2E313A] bg-[#181920] px-2.5 py-1.5 font-mono text-xs text-[#A39E93] hover:text-[#EBE7DF] disabled:opacity-40 transition cursor-pointer"
                      >
                        Cambiar
                      </button>
                    </div>

                    {/* Venta ON / OFF */}
                    <div className="flex items-center gap-1 border-l border-[#262830] pl-2">
                      <button
                        type="button"
                        disabled={isSaving}
                        onClick={() =>
                          handleExecuteBulkAction({
                            ids: selectedPhotoIds,
                            actionType: "setPrints",
                            printsValue: true,
                          })
                        }
                        className="rounded-lg border border-emerald-500/30 bg-emerald-950/30 px-2 py-1.5 font-mono text-[11px] text-emerald-300 hover:bg-emerald-600 hover:text-white transition cursor-pointer"
                        title="Activar venta Fine Art en seleccionadas"
                      >
                        Venta: ON
                      </button>
                      <button
                        type="button"
                        disabled={isSaving}
                        onClick={() =>
                          handleExecuteBulkAction({
                            ids: selectedPhotoIds,
                            actionType: "setPrints",
                            printsValue: false,
                          })
                        }
                        className="rounded-lg border border-[#2E313A] bg-[#181920] px-2 py-1.5 font-mono text-[11px] text-[#A39E93] hover:text-[#EBE7DF] transition cursor-pointer"
                        title="Pausar venta en seleccionadas"
                      >
                        Venta: OFF
                      </button>
                    </div>

                    {/* Portada */}
                    <div className="flex items-center gap-1 border-l border-[#262830] pl-2">
                      <button
                        type="button"
                        disabled={isSaving}
                        onClick={() =>
                          handleExecuteBulkAction({
                            ids: selectedPhotoIds,
                            actionType: "setFeatured",
                            featuredValue: true,
                          })
                        }
                        className="rounded-lg border border-[#C5A880]/40 bg-[#C5A880]/15 px-2 py-1.5 font-mono text-[11px] text-[#C5A880] hover:bg-[#C5A880] hover:text-[#0B0C0E] transition cursor-pointer"
                        title="Destacar en portada principal"
                      >
                        ★ Portada
                      </button>
                    </div>

                    {/* Eliminar en bloque */}
                    <div className="border-l border-[#262830] pl-2">
                      <button
                        type="button"
                        disabled={isSaving}
                        onClick={() =>
                          handleExecuteBulkAction({
                            ids: selectedPhotoIds,
                            actionType: "delete",
                          })
                        }
                        className="rounded-lg border border-red-500/30 bg-red-950/40 px-2 py-1.5 font-mono text-[11px] text-red-300 hover:bg-red-600 hover:text-white transition cursor-pointer"
                        title="Eliminar las fotos seleccionadas"
                      >
                        🗑️ Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* Modal de Asignación Rápida a Colecciones */}
      {quickAssignPhoto && (
        <PhotoSeriesAssignModal
          key={quickAssignPhoto.id}
          photo={quickAssignPhoto}
          series={series}
          previewSrc={previewMap[quickAssignPhoto.id]}
          isSaving={isSaving}
          onClose={() => setQuickAssignPhoto(null)}
          onSave={handleQuickAssignSeries}
        />
      )}

      {/* Modal de Edición / Creación Individual */}
      {editingPhoto && (
        <WorkEditorModal
          key={`${isCreatingNew ? "new" : "edit"}-${editingPhoto.id}`}
          photo={editingPhoto}
          isNew={isCreatingNew}
          existingWorks={works}
          allSeries={series}
          onClose={() => {
            setEditingPhoto(null);
            setIsCreatingNew(false);
          }}
          onSave={handleSavePhoto}
          onDelete={(p) => setDeletingPhoto(p)}
          isSaving={isSaving}
        />
      )}

      {/* Modal de Subida en Lote (#1) */}
      {isBatchModalOpen && (
        <BatchUploadModal
          initialCategory={defaultBatchCategory}
          existingWorks={works}
          allSeries={series}
          isSaving={isSaving}
          onClose={() => setIsBatchModalOpen(false)}
          onBatchSubmit={handleBatchSubmit}
        />
      )}

      {/* Modal de Precios en Bloque (#2) */}
      {isBulkPricesOpen && (
        <BulkPricesModal
          works={works}
          initialScope={selectedCategory !== "todas" ? (selectedCategory as PhotoCategory) : "all"}
          isSaving={isSaving}
          onClose={() => setIsBulkPricesOpen(false)}
          onApply={handleBulkPricesApply}
        />
      )}

      {/* Modal de Confirmación de Eliminación */}
      {deletingPhoto && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md rounded-2xl border border-red-500/30 bg-[#121316] p-6 text-[#EBE7DF] shadow-2xl">
            <div className="flex items-center gap-3.5">
              <div className="relative flex h-16 w-20 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg border border-[#2D3038] bg-[#0B0C0E] p-0.5">
                {previewMap[deletingPhoto.id] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={previewMap[deletingPhoto.id]}
                    alt={deletingPhoto.title}
                    className="max-h-full max-w-full h-auto w-auto object-contain"
                  />
                ) : (
                  <Image
                    src={deletingPhoto.image}
                    alt={deletingPhoto.title}
                    width={deletingPhoto.width}
                    height={deletingPhoto.height}
                    sizes="80px"
                    className="max-h-full max-w-full h-auto w-auto object-contain"
                  />
                )}
              </div>
              <div className="min-w-0">
                <span className="font-mono text-[10px] uppercase tracking-wider text-red-400">
                  Eliminar fotografía · {deletingPhoto.id}
                </span>
                <h3 className="truncate font-serif text-lg font-medium text-[#EBE7DF]">
                  {deletingPhoto.title}
                </h3>
              </div>
            </div>

            <p className="mt-4 text-xs leading-relaxed text-[#A39E93]">
              ¿Seguro que quieres eliminar esta fotografía? Se quitará del catálogo, de las series y de la web pública (podrás recuperarla con el botón «Deshacer»).
            </p>

            <div className="mt-6 flex items-center justify-end gap-2.5">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setDeletingPhoto(null)}
                className="min-h-[44px] rounded-lg border border-[#30333C] px-4 text-xs font-medium text-[#A39E93] hover:text-[#EBE7DF] hover:bg-[#1F2127] transition cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleConfirmDelete}
                className="inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-red-600 px-4 text-xs font-semibold uppercase tracking-wider text-white hover:bg-red-500 disabled:opacity-50 transition cursor-pointer"
              >
                {isDeleting ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span>Eliminando…</span>
                  </>
                ) : (
                  <>
                    <TrashIcon className="h-4 w-4" />
                    <span>Sí, eliminar</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Sincronización y Respaldo */}
      {isSyncModalOpen && (
        <div className="fixed inset-0 z-[95] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-lg rounded-2xl border border-[#2B2E36] bg-[#121316] p-6 text-[#EBE7DF] shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#22242B] pb-4">
              <div className="flex items-center gap-2.5">
                <GitHubIcon className="h-5 w-5 text-[#C5A880]" />
                <h3 className="font-serif text-lg font-medium text-[#EBE7DF]">
                  Sincronización y Respaldo del Archivo
                </h3>
              </div>
              <button
                onClick={() => setIsSyncModalOpen(false)}
                className="text-[#8E8A81] hover:text-[#EBE7DF] p-1 cursor-pointer"
              >
                <CloseIcon className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs text-[#A39E93] leading-relaxed">
              {githubConfigured ? (
                <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-4 text-emerald-200 space-y-1.5">
                  <span className="block font-mono text-[10px] uppercase tracking-wider text-emerald-400">
                    ✓ Sincronización Automática Activa
                  </span>
                  <p>
                    Tu panel está conectado directamente con GitHub y Vercel. Cada vez que guardes un cambio desde el móvil o el ordenador, la web pública se actualizará sola en 1–2 minutos.
                  </p>
                </div>
              ) : (
                <div className="rounded-xl border border-[#252830] bg-[#16171D] p-4 space-y-3">
                  <span className="block font-mono text-[10px] uppercase tracking-wider text-[#C5A880]">
                    Sincronización directa con GitHub (Despliegue Vercel)
                  </span>
                  <p>
                    Introduce tu Personal Access Token (PAT) de GitHub para publicar cambios directamente en la web:
                  </p>
                  <input
                    type="password"
                    value={githubToken}
                    onChange={(e) => setGithubToken(e.target.value)}
                    placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                    className="w-full rounded-lg border border-[#2D3038] bg-[#121316] px-3 py-2 font-mono text-xs text-[#EBE7DF] focus:border-[#C5A880] focus:outline-none"
                  />
                </div>
              )}

              <div className="rounded-xl border border-[#252830] bg-[#16171D] p-4 flex items-center justify-between">
                <div>
                  <span className="block font-medium text-[#EBE7DF]">Descargar data/works.ts</span>
                  <span className="text-[11px] text-[#716C62]">
                    Descarga el archivo TypeScript completo con todas las fotos actualizadas.
                  </span>
                </div>
                <a
                  href="/api/admin/export"
                  download="works.ts"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-[#C5A880]/40 bg-[#C5A880]/10 px-3.5 py-2 text-xs font-medium text-[#C5A880] hover:bg-[#C5A880] hover:text-[#0B0C0E] transition"
                >
                  <DownloadIcon className="h-3.5 w-3.5" />
                  <span>Descargar</span>
                </a>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setIsSyncModalOpen(false)}
                className="rounded-lg bg-[#1F2127] px-4 py-2 text-xs font-medium text-[#EBE7DF] hover:bg-[#2B2E37] transition cursor-pointer"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Barra inferior nativa App para móvil */}
      <AdminMobileTabBar
        activeSection={activeSection}
        pendingCount={inboxItems.filter((i) => i.status === "pendiente").length}
        alertsReady={alertsReady}
        onSelectSection={setActiveSection}
      />
    </div>
  );
}
