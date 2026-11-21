"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import type { Photo, PhotoCategory } from "@/types/photo";
import { PHOTO_CATEGORIES, CATEGORY_METADATA } from "@/types/photo";
import WorkEditorModal from "./WorkEditorModal";
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
} from "./AdminIcons";

interface AdminDashboardProps {
  initialWorks: Photo[];
  user: string;
  onLogout: () => void;
}

export default function AdminDashboard({
  initialWorks,
  user,
  onLogout,
}: AdminDashboardProps) {
  const [works, setWorks] = useState<Photo[]>(initialWorks);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("todas");
  const [filterPrintsOnly, setFilterPrintsOnly] = useState(false);
  const [filterFeaturedOnly, setFilterFeaturedOnly] = useState(false);
  const [filterStoryOnly, setFilterStoryOnly] = useState(false);
  const [sortBy, setSortBy] = useState<"id" | "title" | "price" | "year">("id");

  // Edición
  const [editingPhoto, setEditingPhoto] = useState<Photo | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Modal de Sincronización / Respaldo
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  const [githubToken, setGithubToken] = useState("");
  const [toastMessage, setToastMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const showToast = (text: string, type: "success" | "error" = "success") => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Filtrado y ordenación
  const filteredWorks = useMemo(() => {
    return works
      .filter((w) => {
        // Categoría
        if (selectedCategory !== "todas" && w.category !== selectedCategory) {
          return false;
        }

        // Toggles
        if (filterPrintsOnly && !w.prints) return false;
        if (filterFeaturedOnly && !w.featured) return false;
        if (filterStoryOnly && (!w.story || w.story.trim().length === 0)) return false;

        // Búsqueda
        if (searchTerm.trim()) {
          const q = searchTerm.toLowerCase();
          const matchTitle = w.title.toLowerCase().includes(q);
          const matchSlug = w.slug.toLowerCase().includes(q);
          const matchId = w.id.toLowerCase().includes(q);
          const matchSeries = w.series?.toLowerCase().includes(q);
          const matchLocation = w.location?.toLowerCase().includes(q) || w.realLocation?.toLowerCase().includes(q);
          const matchKeywords = w.keywords?.some((k) => k.toLowerCase().includes(q));

          return matchTitle || matchSlug || matchId || matchSeries || matchLocation || matchKeywords;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "title") return a.title.localeCompare(b.title);
        if (sortBy === "year") return b.year - a.year;
        if (sortBy === "price") {
          const priceA = a.pricing?.estudio || 95;
          const priceB = b.pricing?.estudio || 95;
          return priceA - priceB;
        }
        return a.id.localeCompare(b.id);
      });
  }, [works, selectedCategory, filterPrintsOnly, filterFeaturedOnly, filterStoryOnly, searchTerm, sortBy]);

  // Contadores
  const stats = useMemo(() => {
    return {
      total: works.length,
      prints: works.filter((w) => w.prints).length,
      featured: works.filter((w) => w.featured).length,
      withStory: works.filter((w) => w.story && w.story.trim().length > 0).length,
    };
  }, [works]);

  // Guardar cambios en una obra
  const handleSavePhoto = async (updated: Photo) => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/works", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          photo: updated,
          githubToken: githubToken.trim() || undefined,
        }),
      });

      const data = await res.json();

      if (res.ok && data.ok) {
        // Actualizar array en estado local
        setWorks((prev) => prev.map((w) => (w.id === updated.id ? updated : w)));
        setEditingPhoto(null);
        showToast(data.message || `Fotografía "${updated.title}" guardada con éxito.`);
      } else {
        showToast(data.error || "No se pudo guardar la fotografía en el servidor.", "error");
      }
    } catch {
      showToast("Error de conexión al guardar los datos.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  // Toggle rápido de venta Fine Art
  const handleQuickTogglePrints = async (photo: Photo, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = { ...photo, prints: !photo.prints };
    await handleSavePhoto(updated);
  };

  // Toggle rápido de destacada en portada
  const handleQuickToggleFeatured = async (photo: Photo, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = { ...photo, featured: !photo.featured };
    await handleSavePhoto(updated);
  };

  return (
    <div className="min-h-screen bg-[#0B0C0E] text-[#EBE7DF] pb-24">
      {/* Toast Flotante */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 rounded-xl border border-[#C5A880]/40 bg-[#16171B]/95 px-5 py-3.5 shadow-2xl backdrop-blur-md animate-fadeIn">
          {toastMessage.type === "success" ? (
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
              <CheckIcon className="h-4 w-4" />
            </div>
          ) : (
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-500/20 text-red-400">
              <CloseIcon className="h-4 w-4" />
            </div>
          )}
          <span className="text-xs font-medium text-[#EBE7DF]">{toastMessage.text}</span>
        </div>
      )}

      {/* Barra Superior de Control */}
      <header className="sticky top-0 z-40 border-b border-[#202227] bg-[#121316]/95 backdrop-blur-md">
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
              <p className="hidden xs:block truncate text-[11px] text-[#8E8A81]">
                Sesión: {user} &middot; Puerto de la Cruz
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-[#2B2D35] px-3 py-1.5 text-xs text-[#A39E93] hover:text-[#EBE7DF] hover:border-[#C5A880] transition"
            >
              <span>Ver Web</span>
              <ExternalLinkIcon className="h-3.5 w-3.5" />
            </a>

            <button
              onClick={() => setIsSyncModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#2B2D35] bg-[#17181D] px-3 py-1.5 text-xs text-[#EBE7DF] hover:border-[#C5A880] transition cursor-pointer"
              title="Ajustes de Sincronización y Respaldo"
            >
              <GitHubIcon className="h-3.5 w-3.5 text-[#C5A880]" />
              <span className="hidden xs:inline">Sincronizar</span>
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
        {/* Banner de Métricas Rápidas */}
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
            {/* Buscador en tiempo real */}
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8E8A81]" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por título, serie, ubicación, cámara o etiquetas..."
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

            {/* Ordenar */}
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
          <div className="flex flex-wrap items-center gap-3 pt-1 border-t border-[#1F2126] text-xs">
            <label className="flex items-center gap-2 cursor-pointer text-[#A39E93] hover:text-[#EBE7DF]">
              <input
                type="checkbox"
                checked={filterPrintsOnly}
                onChange={(e) => setFilterPrintsOnly(e.target.checked)}
                className="h-3.5 w-3.5 rounded border-[#383A43] bg-[#1A1C22] text-[#C5A880]"
              />
              <span>Solo con Venta Activa</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-[#A39E93] hover:text-[#EBE7DF]">
              <input
                type="checkbox"
                checked={filterFeaturedOnly}
                onChange={(e) => setFilterFeaturedOnly(e.target.checked)}
                className="h-3.5 w-3.5 rounded border-[#383A43] bg-[#1A1C22] text-[#C5A880]"
              />
              <span>Solo Portada</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-[#A39E93] hover:text-[#EBE7DF]">
              <input
                type="checkbox"
                checked={filterStoryOnly}
                onChange={(e) => setFilterStoryOnly(e.target.checked)}
                className="h-3.5 w-3.5 rounded border-[#383A43] bg-[#1A1C22] text-[#C5A880]"
              />
              <span>Solo con Historia Narrada</span>
            </label>

            <span className="ml-auto font-mono text-[11px] text-[#8E8A81]">
              Mostrando {filteredWorks.length} de {works.length} obras
            </span>
          </div>
        </section>

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

              return (
                <div
                  key={photo.id}
                  className="group relative flex flex-col justify-between rounded-xl border border-[#202228] bg-[#131418] p-4 transition-all hover:border-[#C5A880]/40 hover:bg-[#16171D] hover:shadow-xl"
                >
                  <div>
                    {/* Top fila: Miniatura + Info básica */}
                    <div className="flex gap-3.5">
                      <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border border-[#262830] bg-[#1A1C22]">
                        <Image
                          src={photo.image}
                          alt={photo.alt || photo.title}
                          fill
                          sizes="80px"
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        {photo.featured && (
                          <div
                            className="absolute top-1 left-1 rounded bg-[#0B0C0E]/80 p-0.5 text-[#C5A880]"
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
                            {CATEGORY_METADATA[photo.category]?.title?.split(" ")[0] || photo.category}
                          </span>
                        </div>

                        <h3 className="mt-1 truncate font-serif text-base font-medium text-[#EBE7DF]">
                          {photo.title}
                        </h3>

                        <p className="truncate text-xs text-[#8E8A81]">
                          {photo.series || photo.location || photo.country || "Archivo"} &middot; {photo.year}
                        </p>
                      </div>
                    </div>

                    {/* Descripción y detalle */}
                    <p className="mt-3 line-clamp-2 text-xs text-[#A39E93] leading-relaxed">
                      {photo.description}
                    </p>

                    {/* Fila de Precios Fine Art */}
                    <div className="mt-3 flex items-center justify-between rounded-lg border border-[#202228] bg-[#17181E] px-2.5 py-1.5 font-mono text-[11px]">
                      <div className="text-center">
                        <span className="block text-[9px] text-[#716C62] uppercase">Estudio</span>
                        <span className="font-semibold text-[#EBE7DF]">{estudioPrice} €</span>
                      </div>
                      <div className="h-6 w-px bg-[#262830]" />
                      <div className="text-center">
                        <span className="block text-[9px] text-[#716C62] uppercase">Galería</span>
                        <span className="font-semibold text-[#C5A880]">{galeriaPrice} €</span>
                      </div>
                      <div className="h-6 w-px bg-[#262830]" />
                      <div className="text-center">
                        <span className="block text-[9px] text-[#716C62] uppercase">Colección</span>
                        <span className="font-semibold text-[#EBE7DF]">{coleccionPrice} €</span>
                      </div>
                    </div>
                  </div>

                  {/* Acciones y Toggles Rápidos */}
                  <div className="mt-4 pt-3 border-t border-[#1E2026] flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      {/* Botón rápido Venta */}
                      <button
                        type="button"
                        onClick={(e) => handleQuickTogglePrints(photo, e)}
                        className={`rounded-md px-2 py-1 text-[10px] font-mono transition cursor-pointer ${
                          photo.prints
                            ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                            : "bg-[#202228] text-[#716C62] border border-transparent"
                        }`}
                        title="Activar/desactivar venta Fine Art"
                      >
                        {photo.prints ? "Venta: ON" : "Venta: OFF"}
                      </button>

                      {/* Botón rápido Destacada */}
                      <button
                        type="button"
                        onClick={(e) => handleQuickToggleFeatured(photo, e)}
                        className={`rounded-md px-2 py-1 text-[10px] font-mono transition cursor-pointer ${
                          photo.featured
                            ? "bg-[#C5A880]/20 text-[#C5A880] border border-[#C5A880]/40"
                            : "bg-[#202228] text-[#716C62] border border-transparent"
                        }`}
                        title="Destacar en portada principal"
                      >
                        {photo.featured ? "★ Portada" : "Portada: No"}
                      </button>
                    </div>

                    {/* Botón principal Editar */}
                    <button
                      type="button"
                      onClick={() => setEditingPhoto(photo)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-[#C5A880]/30 bg-[#1A1C22] px-3 py-1.5 text-xs font-medium text-[#C5A880] hover:bg-[#C5A880] hover:text-[#0B0C0E] transition cursor-pointer"
                    >
                      <EditIcon className="h-3.5 w-3.5" />
                      <span>Editar</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Modal de Edición Completa */}
      {editingPhoto && (
        <WorkEditorModal
          photo={editingPhoto}
          isOpen={Boolean(editingPhoto)}
          onClose={() => setEditingPhoto(null)}
          onSave={handleSavePhoto}
          isSaving={isSaving}
        />
      )}

      {/* Modal de Sincronización y Respaldo */}
      {isSyncModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
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
              <p>
                Los cambios que guardas en este panel se actualizan automáticamente en el archivo local{" "}
                <code className="text-[#C5A880]">data/works.ts</code> durante el desarrollo.
              </p>

              <div className="rounded-xl border border-[#252830] bg-[#16171D] p-4 space-y-3">
                <span className="block font-mono text-[10px] uppercase tracking-wider text-[#C5A880]">
                  Sincronización directa con GitHub (Despliegue Vercel)
                </span>
                <p>
                  Si deseas que los cambios realizados desde tu móvil o desde la web en producción se sincronicen directamente con GitHub y activen el despliegue automático en Vercel, introduce tu Personal Access Token (PAT) de GitHub:
                </p>
                <input
                  type="password"
                  value={githubToken}
                  onChange={(e) => setGithubToken(e.target.value)}
                  placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                  className="w-full rounded-lg border border-[#2D3038] bg-[#121316] px-3 py-2 font-mono text-xs text-[#EBE7DF] focus:border-[#C5A880] focus:outline-none"
                />
                <p className="text-[11px] text-[#716C62]">
                  También puedes configurar la variable de entorno <code className="text-[#EBE7DF]">GITHUB_TOKEN</code> en el panel de Vercel para no tener que introducirlo aquí.
                </p>
              </div>

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
    </div>
  );
}
