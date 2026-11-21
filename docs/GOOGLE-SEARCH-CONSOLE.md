# Conexión con Google Search Console y Seguimiento de Fotografías

La web ya incluye de serie los dos métodos oficiales de verificación de propiedad de Google Search Console para `https://javier-photography.vercel.app` (o tu futuro dominio propio):

1. **Etiqueta Meta HTML (`<meta name="google-site-verification">`):** configurada en [`app/layout.tsx`](file:///Users/curro19/Projects/javier-photography/app/layout.tsx#L53) (personalizable mediante `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`).
2. **Archivo HTML estático:** disponible en `/googlemlxi0QGeNLmXxCnVUMclZhd9jt85PqqVvK9TFIkEDgo.html`.

---

## Paso 1: Verificar la propiedad en Google Search Console (1 minuto)

1. Abre **[Google Search Console](https://search.google.com/search-console/welcome)**.
2. En el bloque **«Prefijo de la URL»** (derecha), introduce:
   ```text
   https://javier-photography.vercel.app
   ```
3. Haz clic en **Continuar**. Google detectará automáticamente la etiqueta `<meta name="google-site-verification">` y confirmará la propiedad al instante.

---

## Paso 2: Enviar los 2 Sitemaps (Web + Google Images)

En el menú izquierdo de Google Search Console, entra en **Indexación → Sitemaps** y añade estas dos rutas:

1. **Sitemap general (129 URLs con `hreflang` ES/EN e imágenes):**
   ```text
   sitemap.xml
   ```
2. **Sitemap exclusivo de Google Images (100 fichas + 5 disciplinas + 8 ensayos monográficos):**
   ```text
   image-sitemap.xml
   ```

---

## Paso 3: Cómo comprobar qué fotografías aparecen en Google Images y qué buscan tus visitantes

Una vez transcurridos los primeros días tras el envío de los sitemaps:

1. Ve a **Rendimiento → Resultados de búsqueda**.
2. En la barra superior de filtros, cambia **`Tipo de búsqueda: Web`** por **`Tipo de búsqueda: Imagen`** (o compáralos juntos).
3. Pestaña **Páginas**: verás exactamente qué fichas individuales (`/portfolio/mirada-del-lince-boreal`, `/portfolio/cuervo-canario-ante-las-cumbres`, `/portfolio/trazada-del-golf-mk1`, `/projects/villanueva-de-la-vera`, etc.) acumulan más impresiones y clics en Google Images.
4. Pestaña **Consultas**: verás los términos reales con los que coleccionistas, editores, pilotos o estudios de arquitectura llegan a tu obra, diferenciando:
   - **Búsquedas de identidad y autoría:** *«Javier Espinosa fotografía»*, *«Javier Espinosa Tenerife»*, *«The Art of Seeing Javier Espinosa»*.
   - **Búsquedas de disciplina y territorio:** *«fotografía fauna canaria Anaga»*, *«arquitectura popular Villanueva de la Vera»*, *«fotógrafo rally clásico Tenerife»*.
   - **Búsquedas de coleccionismo Fine Art:** *«copias Fine Art Hahnemühle 308g»*, *«láminas fotografía paisaje volcánico»*.
