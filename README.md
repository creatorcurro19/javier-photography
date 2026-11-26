# Javier Espinosa Martínez — Portfolio de Fotografía de Autor & Fine Art

Sitio web oficial, tienda de copias Fine Art y archivo fotográfico de **Javier Espinosa Martínez**, fotógrafo afincado en **Puerto de la Cruz (Tenerife, Islas Canarias)**.

🌐 **Web oficial:** https://javier-photography.vercel.app  
📰 **Feed visual (Media RSS):** https://javier-photography.vercel.app/feed.xml  
🗺️ **Sitemaps SEO e Imágenes:** https://javier-photography.vercel.app/sitemap.xml · https://javier-photography.vercel.app/image-sitemap.xml

---

## Colecciones del Archivo (103 Obras en 5 Disciplinas y 8 Series)

1. **Fauna y Naturaleza** (`/portfolio/fauna-naturaleza`): **26 obras** con teleobjetivo 600mm (Tenerife, Monfragüe, Sierra de Gredos y reservas europeas).
2. **Paisajes y Territorio** (`/portfolio/paisajes-documental`): **22 obras** (Teide, Macizo de Anaga, Puerto de la Cruz, Desierto del Sahara y Alto Atlas).
3. **Coches y Rally** (`/portfolio/coches-rally`): **16 obras** del **52º Rallye Orvecame Isla Tenerife Histórico** (Tramo de El Tanque y parque de asistencia).
4. **Arquitectura y Espacio Urbano** (`/portfolio/arquitectura-urbana`): **16 obras** (Villanueva de la Vera, El Puerto de Santa María en Cádiz y Marrakech).
5. **Documental y Tradición** (`/portfolio/viajes-cultura`): **23 obras** (Cruces de Mayo en Los Realejos, Medina de Marrakech y oficios tradicionales).

---

## Stack Técnico y SEO

- **Framework:** Next.js 16 (App Router, Turbopack), React 19 y Tailwind CSS v4.
- **Impresión Fine Art & Checkout:** Pasarela directa con Stripe + Webhook firmado y catálogo individualizado sobre papel 100% algodón Hahnemühle Photo Rag 308g / Canson Baryta Prestige II 340g.
- **SEO & Metadatos:** Schema.org (`Person`, `WebSite`, `ArtGallery`, `ImageObject`, `VisualArtwork`, `Product`), OpenGraph dinámico (`/api/og`), IndexNow, Google WebSub (`feed.xml`) y metadatos EXIF + XMP/IPTC embebidos en cada JPEG.

---

## Comandos locales

```bash
npm run dev        # Entorno local en http://localhost:3000
npx tsc --noEmit   # Verificación de tipos TypeScript
npm run build      # Compilación estática de producción (SSG)
npm run test:e2e   # Suite Playwright (APIs, Checkout, Webhook, Sitemaps y SSR)
```
