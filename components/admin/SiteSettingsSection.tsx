"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import type { Photo } from "@/types/photo";
import { PHOTO_CATEGORIES, CATEGORY_METADATA } from "@/types/photo";
import type { CuadernoPost, SiteSettings } from "@/data/site-config";
import { CheckIcon, CloseIcon, EditIcon, PlusIcon, TrashIcon, UploadIcon } from "./AdminIcons";
import { processImageFileClient, slugifyTitle } from "./categoryEditorConfig";

interface SiteSettingsSectionProps {
  initialSettings: SiteSettings;
  initialPosts: CuadernoPost[];
  works: Photo[];
  isSaving: boolean;
  onSaveConfig: (
    settings: SiteSettings,
    posts: CuadernoPost[],
    portraitBase64?: string
  ) => Promise<void>;
}

const inputClass =
  "w-full rounded-lg border border-[#2D3036] bg-[#17181D] px-3.5 py-2.5 text-sm text-[#EBE7DF] placeholder-[#5E5A53] focus:border-[#C5A880] focus:outline-none";
const labelClass = "block text-xs font-mono uppercase tracking-wider text-[#A39E93] mb-1";

export default function SiteSettingsSection({
  initialSettings,
  initialPosts,
  works,
  isSaving,
  onSaveConfig,
}: SiteSettingsSectionProps) {
  const [settings, setSettings] = useState<SiteSettings>({ ...initialSettings });
  const [posts, setPosts] = useState<CuadernoPost[]>(
    initialPosts.map((p) => ({ ...p, body: [...p.body], cta: { ...p.cta } }))
  );
  const [portraitDataUrl, setPortraitDataUrl] = useState<string | null>(null);
  const [processingPortrait, setProcessingPortrait] = useState(false);
  const portraitInputRef = useRef<HTMLInputElement | null>(null);

  // Edición de artículo del Cuaderno
  const [editingPost, setEditingPost] = useState<CuadernoPost | null>(null);
  const [isNewPost, setIsNewPost] = useState(false);
  const [postBodyText, setPostBodyText] = useState("");

  const setSetting = <K extends keyof SiteSettings>(key: K, val: SiteSettings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: val }));
  };

  const handlePortraitSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setProcessingPortrait(true);
    try {
      const processed = await processImageFileClient(file);
      setPortraitDataUrl(processed.dataUrl);
      setSetting("showAuthorPortrait", true);
    } catch {
      // ignore
    } finally {
      setProcessingPortrait(false);
    }
  };

  const openNewPost = () => {
    const nextNum = String(posts.length + 1).padStart(2, "0");
    const defaultWork = works[0];
    setIsNewPost(true);
    setEditingPost({
      slug: "",
      number: nextNum,
      title: "",
      subtitle: "",
      date: new Date().toLocaleDateString("es-ES", { month: "long", year: "numeric" }),
      author: "Javier Espinosa Martínez",
      categoryLabel: CATEGORY_METADATA[PHOTO_CATEGORIES[0]].title,
      relatedWorkSlug: defaultWork?.slug ?? "",
      status: "publicado",
      body: [],
      cta: {
        label: "Ver obra relacionada y copias Fine Art",
        href: defaultWork ? `/portfolio/${defaultWork.slug}` : "/portfolio",
      },
    });
    setPostBodyText("");
  };

  const openEditPost = (post: CuadernoPost) => {
    setIsNewPost(false);
    setEditingPost({ ...post, body: [...post.body], cta: { ...post.cta } });
    setPostBodyText(post.body.join("\n\n"));
  };

  const handleSavePostModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPost) return;
    const cleanSlug =
      editingPost.slug.trim() ||
      slugifyTitle(editingPost.title) ||
      `articulo-${editingPost.number}`;
    const paragraphs = postBodyText
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter((p) => p.length > 0);
    const finalPost: CuadernoPost = {
      ...editingPost,
      slug: cleanSlug,
      body:
        paragraphs.length > 0
          ? paragraphs
          : ["Artículo del cuaderno de campo por Javier Espinosa Martínez."],
      cta: {
        label: editingPost.cta.label || "Ver obra relacionada",
        href: editingPost.relatedWorkSlug
          ? `/portfolio/${editingPost.relatedWorkSlug}`
          : "/portfolio",
      },
    };

    const nextPosts = isNewPost
      ? [...posts, finalPost]
      : posts.map((p) => (p.slug === editingPost.slug ? finalPost : p));
    setPosts(nextPosts);
    setEditingPost(null);
    setIsNewPost(false);
  };

  const handleDeletePost = (slug: string) => {
    setPosts((prev) => prev.filter((p) => p.slug !== slug));
  };

  const handleSaveAll = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSaveConfig(settings, posts, portraitDataUrl ?? undefined);
  };

  const previewPortrait = portraitDataUrl || settings.authorPortraitUrl;

  return (
    <div className="space-y-6">
      <form onSubmit={handleSaveAll} className="space-y-6">
        {/* 1. FOTO DE RETRATO PARA "SOBRE MÍ" */}
        <section className="rounded-2xl border border-[#22242B] bg-[#131418] p-5 sm:p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#202228] pb-3">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#C5A880]">
                1 · Retrato del Autor (Página «Sobre mí» e Inicio)
              </span>
              <h3 className="font-serif text-lg font-medium text-[#EBE7DF]">
                Tu fotografía de retrato
              </h3>
            </div>
            <label className="flex items-center gap-2.5 rounded-lg border border-[#2A2C34] bg-[#181A20] px-3.5 py-2 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.showAuthorPortrait}
                onChange={(e) => setSetting("showAuthorPortrait", e.target.checked)}
                className="h-4 w-4 accent-[#C5A880]"
              />
              <span className="text-xs font-medium text-[#EBE7DF]">
                {settings.showAuthorPortrait
                  ? "Retrato activado en la web"
                  : "Retrato pospuesto (usando foto de paisaje)"}
              </span>
            </label>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative h-24 w-20 flex-shrink-0 overflow-hidden rounded-xl border border-[#2D3038] bg-[#0B0C0E]">
                {previewPortrait && previewPortrait.startsWith("data:") ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={previewPortrait}
                    alt="Retrato de Javier Espinosa"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Image
                    src={previewPortrait || "/images/portfolio/hero/hero.jpg"}
                    alt="Retrato de Javier Espinosa"
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                )}
              </div>
              <div className="text-xs text-[#A39E93] space-y-1">
                <p className="font-medium text-[#EBE7DF]">
                  {portraitDataUrl
                    ? "Nuevo retrato listo para publicar"
                    : settings.showAuthorPortrait
                    ? "Mostrando tu retrato personalizado"
                    : "Actualmente oculto (pospuesto hasta que subas tu foto)"}
                </p>
                <p>
                  Cuando te hagas la foto de retrato, súbela aquí desde el móvil y se colocará automáticamente en la sección «Sobre mí».
                </p>
              </div>
            </div>

            <div>
              <input
                ref={portraitInputRef}
                type="file"
                accept="image/*"
                onChange={handlePortraitSelect}
                className="hidden"
              />
              <button
                type="button"
                disabled={processingPortrait}
                onClick={() => portraitInputRef.current?.click()}
                className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-[#C5A880]/40 bg-[#1A1C22] px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#C5A880] hover:bg-[#C5A880] hover:text-[#0B0C0E] transition cursor-pointer"
              >
                <UploadIcon className="h-4 w-4" />
                <span>
                  {processingPortrait ? "Procesando…" : "Subir foto de retrato"}
                </span>
              </button>
            </div>
          </div>
        </section>

        {/* 2. CUADERNO DE CAMPO (oculto en versión minimalista) */}
        <section className="hidden rounded-2xl border border-[#22242B] bg-[#131418] p-5 sm:p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#202228] pb-3">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#C5A880]">
                2 · Sección «Cuaderno de Campo» (Artículos y Notas)
              </span>
              <h3 className="font-serif text-lg font-medium text-[#EBE7DF]">
                Visibilidad del Cuaderno y Artículos ({posts.length})
              </h3>
            </div>

            <label className="flex items-center gap-2.5 rounded-lg border border-[#2A2C34] bg-[#181A20] px-3.5 py-2 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.showCuaderno}
                onChange={(e) => setSetting("showCuaderno", e.target.checked)}
                className="h-4 w-4 accent-[#C5A880]"
              />
              <span className="text-xs font-medium text-[#EBE7DF]">
                {settings.showCuaderno
                  ? "Visible en el menú de la web"
                  : "Oculto del menú (modo borrador)"}
              </span>
            </label>
          </div>

          <p className="text-xs text-[#A39E93]">
            Aquí puedes escribir o editar tus artículos cuando te apetezca. Mientras la casilla de arriba esté desmarcada, el Cuaderno permanece oculto del menú público.
          </p>

          <div className="space-y-2.5">
            {posts.map((post) => (
              <div
                key={post.slug}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-[#24262E] bg-[#17181E] p-3.5"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-[#C5A880]/15 px-2 py-0.5 font-mono text-[10px] text-[#C5A880]">
                      N.º {post.number} · {post.status.toUpperCase()}
                    </span>
                    <span className="text-xs text-[#8E8A81]">{post.categoryLabel}</span>
                  </div>
                  <h4 className="mt-1 truncate font-serif text-base font-medium text-[#EBE7DF]">
                    {post.title}
                  </h4>
                  <p className="truncate text-xs text-[#8E8A81]">{post.subtitle}</p>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => openEditPost(post)}
                    className="inline-flex min-h-[38px] items-center gap-1.5 rounded-lg border border-[#C5A880]/30 bg-[#1A1C22] px-3 py-1.5 text-xs font-medium text-[#C5A880] hover:bg-[#C5A880] hover:text-[#0B0C0E] transition cursor-pointer"
                  >
                    <EditIcon className="h-3.5 w-3.5" />
                    <span>Escribir / Editar</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeletePost(post.slug)}
                    className="inline-flex min-h-[38px] min-w-[38px] items-center justify-center rounded-lg border border-red-500/25 bg-red-950/20 px-2.5 text-red-300 hover:bg-red-600 hover:text-white transition cursor-pointer"
                    title="Eliminar artículo"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={openNewPost}
            className="inline-flex min-h-[42px] items-center gap-2 rounded-xl border border-[#C5A880]/40 bg-[#1A1C22] px-4 py-2 text-xs font-medium text-[#C5A880] hover:bg-[#C5A880] hover:text-[#0B0C0E] transition cursor-pointer"
          >
            <PlusIcon className="h-4 w-4" />
            <span>Crear nuevo artículo del Cuaderno</span>
          </button>
        </section>

        {/* 3. CONTACTO Y PRECIO BASE */}
        <section className="rounded-2xl border border-[#22242B] bg-[#131418] p-5 sm:p-6 space-y-4">
          <div className="border-b border-[#202228] pb-3">
            <h3 className="font-serif text-lg font-medium text-[#EBE7DF]">
              Contacto y precio base de láminas
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Email de contacto *</label>
              <input
                type="email"
                required
                value={settings.contactEmail}
                onChange={(e) => setSetting("contactEmail", e.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Láminas «Desde €»</label>
              <input
                type="number"
                inputMode="numeric"
                value={settings.basePrintPrice}
                onChange={(e) => setSetting("basePrintPrice", parseInt(e.target.value, 10) || 95)}
                className={`${inputClass} font-mono`}
              />
            </div>
          </div>

          <div className="hidden grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
            <div>
              <label className={labelClass}>
                Teléfono / WhatsApp (déjalo vacío para ocultarlo)
              </label>
              <input
                type="text"
                value={settings.whatsappNumber}
                onChange={(e) => setSetting("whatsappNumber", e.target.value)}
                placeholder="Vacío = solo email (ej. 34600000000 para activar)"
                className={`${inputClass} font-mono`}
              />
            </div>
            <div>
              <label className={labelClass}>Encargos «Desde €»</label>
              <input
                type="number"
                inputMode="numeric"
                value={settings.baseCommissionPrice}
                onChange={(e) =>
                  setSetting("baseCommissionPrice", parseInt(e.target.value, 10) || 150)
                }
                className={`${inputClass} font-mono`}
              />
            </div>
            <div>
              <label className={labelClass}>Licencias «Desde €»</label>
              <input
                type="number"
                inputMode="numeric"
                value={settings.baseLicensePrice}
                onChange={(e) => setSetting("baseLicensePrice", parseInt(e.target.value, 10) || 45)}
                className={`${inputClass} font-mono`}
              />
            </div>
          </div>
        </section>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving || processingPortrait}
            className="inline-flex min-h-[48px] items-center gap-2 rounded-xl bg-gradient-to-r from-[#C5A880] to-[#A88C64] px-6 py-3 text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#0B0C0E] shadow-xl transition hover:opacity-90 disabled:opacity-50 cursor-pointer"
          >
            <CheckIcon className="h-5 w-5 text-[#0B0C0E]" />
            <span>{isSaving ? "Guardando ajustes…" : "Guardar y publicar ajustes de la web"}</span>
          </button>
        </div>
      </form>

      {/* Modal para escribir / editar un artículo del Cuaderno */}
      {editingPost && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md">
          <div className="relative flex max-h-[94vh] w-full max-w-3xl flex-col rounded-2xl border border-[#2B2E36] bg-[#121316] text-[#EBE7DF] shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-[#22242B] px-4 py-3.5 sm:px-6 bg-[#16171B]">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-wider text-[#C5A880]">
                  Cuaderno de Campo · Artículo N.º {editingPost.number}
                </span>
                <h2 className="font-serif text-lg font-medium text-[#EBE7DF]">
                  {editingPost.title || "Nuevo artículo"}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setEditingPost(null)}
                className="flex h-10 w-10 items-center justify-center rounded-lg text-[#A39E93] hover:bg-[#202228] hover:text-[#EBE7DF] transition cursor-pointer"
              >
                <CloseIcon className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSavePostModal} className="flex-1 overflow-y-auto px-4 py-5 sm:px-6 space-y-4">
              <div>
                <label className={labelClass}>Título del artículo *</label>
                <input
                  type="text"
                  required
                  value={editingPost.title}
                  onChange={(e) =>
                    setEditingPost({ ...editingPost, title: e.target.value })
                  }
                  placeholder="Ej. Esperar a 600mm bajo la bruma de Anaga"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Subtítulo / Resumen *</label>
                <input
                  type="text"
                  required
                  value={editingPost.subtitle}
                  onChange={(e) =>
                    setEditingPost({ ...editingPost, subtitle: e.target.value })
                  }
                  placeholder="Breve introducción del artículo…"
                  className={inputClass}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className={labelClass}>Estado</label>
                  <select
                    value={editingPost.status}
                    onChange={(e) =>
                      setEditingPost({
                        ...editingPost,
                        status: e.target.value as "borrador" | "publicado",
                      })
                    }
                    className={inputClass}
                  >
                    <option value="publicado">Publicado</option>
                    <option value="borrador">Borrador</option>
                  </select>
                </div>

                <div>
                  <label className={labelClass}>Fecha</label>
                  <input
                    type="text"
                    value={editingPost.date}
                    onChange={(e) =>
                      setEditingPost({ ...editingPost, date: e.target.value })
                    }
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Fotografía de portada del artículo</label>
                  <select
                    value={editingPost.relatedWorkSlug}
                    onChange={(e) =>
                      setEditingPost({
                        ...editingPost,
                        relatedWorkSlug: e.target.value,
                      })
                    }
                    className={inputClass}
                  >
                    {works.map((w) => (
                      <option key={w.id} value={w.slug}>
                        [{w.id}] {w.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className={labelClass}>
                  Texto del artículo (separa cada párrafo con una línea en blanco) *
                </label>
                <textarea
                  rows={10}
                  required
                  value={postBodyText}
                  onChange={(e) => setPostBodyText(e.target.value)}
                  placeholder="Escribe aquí tus notas de campo, experiencia y técnica…"
                  className={`${inputClass} leading-relaxed`}
                />
              </div>

              <div className="flex items-center justify-end gap-2 border-t border-[#25272F] pt-4">
                <button
                  type="button"
                  onClick={() => setEditingPost(null)}
                  className="min-h-[44px] rounded-lg border border-[#30333C] px-4 text-xs font-medium text-[#A39E93] hover:text-[#EBE7DF] transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-[#C5A880] px-5 text-xs font-semibold uppercase tracking-wider text-[#0B0C0E] hover:opacity-90 transition cursor-pointer"
                >
                  <CheckIcon className="h-4 w-4" />
                  <span>Aplicar al artículo (recuerda pulsar Guardar ajustes después)</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
