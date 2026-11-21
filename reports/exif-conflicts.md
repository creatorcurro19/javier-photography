# Informe de Conflictos Técnicos y EXIF (`/reports/exif-conflicts.md`)

> **Regla aplicada:** Ningún dato EXIF dudoso ha sido modificado o inventado. Todos los casos quedan registrados en este informe y marcados con `{{VERIFICAR: ...}}` en la fuente única de verdad (`/data/works.ts`) para que **Javier Espinosa Martínez** los confirme directamente desde los archivos RAW (`.CR3` / `.CR2`).

---

## 1. Aperturas físicamente imposibles para la lente declarada (`Sigma 150-600mm f/5-6.3 DG OS HSM Contemporary`)

El teleobjetivo **Sigma 150-600mm f/5-6.3 DG OS HSM Contemporary** tiene una apertura máxima física de **`f/5.0`** a 150 mm, pasa a **`f/5.6`** entre ~180 mm y ~380 mm, y cierra su apertura máxima física a **`f/6.3`** desde ~400 mm hasta 600 mm. Por tanto, cualquier registro con `f/5.6` o `f/6.0` entre 403 mm y 600 mm requiere verificación del archivo RAW original:

| ID | Slug | Título | Lente declarada | Focal | Apertura actual | Estado en `/data/works.ts` |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `fn-08` | `el-paso-del-lobo` | El Paso del Lobo | Sigma 150-600mm f/5-6.3 DG OS HSM Contemporary | `600mm` | `f/5.6` | `{{VERIFICAR: apertura f/5.6 a 600mm incompatible con apertura máxima física f/6.3}}` |
| `vc-06` | `cisne-en-el-estanque` | Cisne en el Estanque | Sigma 150-600mm f/5-6.3 DG OS HSM Contemporary | `403mm` | `f/6.0` | `{{VERIFICAR: apertura f/6.0 a 403mm incompatible con apertura máxima física f/6.3}}` |
| `vc-07` | `carbonero-en-la-niebla` | Carbonero en la Niebla | Sigma 150-600mm f/5-6.3 DG OS HSM Contemporary | `562mm` | `f/5.6` | `{{VERIFICAR: apertura f/5.6 a 562mm incompatible con apertura máxima física f/6.3}}` |
| `vc-08` | `ciguena-entre-la-hierba` | Cigüeña entre la Hierba | Sigma 150-600mm f/5-6.3 DG OS HSM Contemporary | `600mm` | `f/5.6` | `{{VERIFICAR: apertura f/5.6 a 600mm incompatible con apertura máxima física f/6.3}}` |
| `vc-13` | `perfil-del-venado` | Perfil del Venado | Sigma 150-600mm f/5-6.3 DG OS HSM Contemporary | `600mm` | `f/5.6` | `{{VERIFICAR: apertura f/5.6 a 600mm incompatible con apertura máxima física f/6.3}}` |
| `fn-14` | `ciguena-bajo-la-lluvia` | Cigüeña bajo la Lluvia | Sigma 150-600mm f/5-6.3 DG OS HSM Contemporary | `600mm` | `f/5.6` | `{{VERIFICAR: apertura f/5.6 a 600mm incompatible con apertura máxima física f/6.3}}` |

---

## 2. Cuerpos de cámara distintos al cuerpo principal (`Canon EOS 750D` vs `Canon EOS R7`)

Dos obras del archivo declaran el cuerpo **`Canon EOS 750D`** (24,2 MP APS-C), mientras que en textos generales de equipo o tarjetas previas del sitio se generalizaba el uso de **`Canon EOS R7`** (32,5 MP APS-C):

| ID | Slug | Título | Cuerpo en ficha | Lente | Focal / EXIF | Estado en `/data/works.ts` |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `fn-03` | `garza-blanca-al-sol` | Garza Blanca al Sol | `Canon EOS 750D` | Sigma 150-600mm f/5-6.3 | `600mm · f/6.3 · 1/1250s · ISO 400` | `{{VERIFICAR: cuerpo declarado Canon EOS 750D distinto al cuerpo principal Canon EOS R7; confirmar desde RAW}}` |
| `vc-06` | `cisne-en-el-estanque` | Cisne en el Estanque | `Canon EOS 750D` | Sigma 150-600mm f/5-6.3 | `403mm · f/6.0 · 1/640s · ISO 400` | `{{VERIFICAR: cuerpo declarado Canon EOS 750D distinto al cuerpo principal Canon EOS R7; confirmar desde RAW}}` |

*(Nota: Para ambas obras con `Canon EOS 750D`, `maxRecommendedFormat` se ha fijado en `galeria` —50 × 70 cm— deshabilitando 70 × 100 cm por menor resolución nativa del sensor de 24 MP).*

---

## 3. Focales y metadatos contradictorios entre componentes y ficha técnica

Antes de unificar la lectura desde `/data/works.ts`, los componentes `components/prints/PrintScaleVisualizer.tsx` y `components/about/AboutInteractiveStudio.tsx` contenían arrays estáticos con focales distintas a las declaradas en la ficha de la obra:

| ID | Slug | Título | Focal en Ficha (`/data/works.ts`) | Focal en componentes estáticos previos | Estado en `/data/works.ts` |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `pd-02` | `cumbre-nevada-al-alba` | Cumbre Nevada al Alba | `115mm` (f/6.3 · ISO 320 · 2026) | `24mm` en Simulador de Escala y `24mm` en visor de `/about` | `{{VERIFICAR: Focal contradictoria entre ficha (115mm) y simulador/estudio previos (24mm); confirmar focal exacta desde RAW}}` |
| `fn-04` | `mirada-del-lince-boreal` | Mirada del Lince Boreal | `600mm` (f/6.3 · ISO 1250 · 2026) | `400mm` en Simulador de Escala y `232mm · f/5.0 · ISO 2000` en `/about` | `{{VERIFICAR: Focal contradictoria entre ficha (600mm), simulador previo (400mm) y visor /about (232mm f/5.0); confirmar desde RAW}}` |
| `fn-08` | `el-paso-del-lobo` | El Paso del Lobo | `600mm` (f/5.6 · ISO 6400 · 2026) | `300mm` en Simulador de Escala | `{{VERIFICAR: Apertura f/5.6 a 600mm + focal 300mm en simulador previo; confirmar desde RAW}}` |
| `vc-42` | `ocaso-sobre-el-erg` | Ocaso sobre el Erg | `150mm` (f/6.3 · ISO 320 · 2024) | `200mm` en Simulador de Escala | `{{VERIFICAR: Focal contradictoria entre ficha (150mm) y simulador previo (200mm); confirmar desde RAW}}` |
| `cr-13` | `cruzada-sobre-el-asfalto` | Cruzada sobre el Asfalto | `200mm` (f/5.6 · ISO 400 · 2025) | `135mm` en Simulador de Escala | `{{VERIFICAR: Focal contradictoria entre ficha (200mm) y simulador previo (135mm); confirmar desde RAW}}` |
| `vc-44` | `el-oficio-y-la-chispa` | El Oficio y la Chispa | `18mm` (f/3.5 · ISO 1600 · 2025) | `50mm` en Simulador de Escala y `ISO 1000` en `/about` | `{{VERIFICAR: Focal contradictoria entre ficha (18mm) y simulador previo (50mm); confirmar desde RAW}}` |

---

## 4. Conflicto de profundidad de color en Licencias (`TIFF 8-bit` vs `TIFF 16-bit`)

- **Ubicación del conflicto:**
  - En `app/licensing/page.tsx` (líneas 41 y 75) y `data/client-galleries.ts` (línea 32) se especificaba entrega de máster **`TIFF 16-bit sin comprimir`**.
  - En `components/licensing/LicenseConfigurator.tsx` (línea 10, modalidad Editorial & Prensa) figuraba **`JPEG Máxima Calidad / TIFF 8-bit · 300 DPI · Adobe RGB`**.
- **Acción tomada:**
  - Registrado en este informe con marca `{{VERIFICAR: confirmar profundidad de exportación estándar TIFF 16-bit para todas las modalidades de licencia}}` y unificado en el bloque de Conversión/Licencias a **`TIFF 16-bit`**.

---

## 5. Reubicación Taxonómica Categoría ↔ Carpeta de Imagen (18 obras normalizadas)

Todas las obras cumplen ahora la correspondencia estricta `/images/portfolio/{category}/{slug}.jpg`:

- `pd-05` (`ave-del-paraiso-al-sol`): `/images/portfolio/paisajes-documental/ave-del-paraiso-al-sol.jpg` → `/images/portfolio/fauna-naturaleza/ave-del-paraiso-al-sol.jpg` (categoría: `fauna-naturaleza`)
- `au-04` (`tunel-de-laurisilva-en-la-bruma`): `/images/portfolio/arquitectura-urbana/tunel-de-laurisilva-en-la-bruma.jpg` → `/images/portfolio/paisajes-documental/tunel-de-laurisilva-en-la-bruma.jpg` (categoría: `paisajes-documental`)
- `au-05` (`luz-entre-la-niebla-del-monte`): `/images/portfolio/arquitectura-urbana/luz-entre-la-niebla-del-monte.jpg` → `/images/portfolio/paisajes-documental/luz-entre-la-niebla-del-monte.jpg` (categoría: `paisajes-documental`)
- `vc-10` (`rana-en-la-corriente`): `/images/portfolio/viajes-cultura/rana-en-la-corriente.jpg` → `/images/portfolio/fauna-naturaleza/rana-en-la-corriente.jpg` (categoría: `fauna-naturaleza`)
- `vc-17` (`macro-de-saltamontes`): `/images/portfolio/viajes-cultura/macro-de-saltamontes.jpg` → `/images/portfolio/fauna-naturaleza/macro-de-saltamontes.jpg` (categoría: `fauna-naturaleza`)
- `vc-18` (`farola-y-sombra-en-la-cal`): `/images/portfolio/viajes-cultura/farola-y-sombra-en-la-cal.jpg` → `/images/portfolio/arquitectura-urbana/farola-y-sombra-en-la-cal.jpg` (categoría: `arquitectura-urbana`)
- `vc-19` (`calleja-entre-muros-de-piedra`): `/images/portfolio/viajes-cultura/calleja-entre-muros-de-piedra.jpg` → `/images/portfolio/arquitectura-urbana/calleja-entre-muros-de-piedra.jpg` (categoría: `arquitectura-urbana`)
- `vc-20` (`perspectiva-hacia-el-campanario`): `/images/portfolio/viajes-cultura/perspectiva-hacia-el-campanario.jpg` → `/images/portfolio/arquitectura-urbana/perspectiva-hacia-el-campanario.jpg` (categoría: `arquitectura-urbana`)
- `vc-21` (`dintel-de-granito-y-madera`): `/images/portfolio/viajes-cultura/dintel-de-granito-y-madera.jpg` → `/images/portfolio/arquitectura-urbana/dintel-de-granito-y-madera.jpg` (categoría: `arquitectura-urbana`)
- `vc-23` (`entramados-de-villanueva-de-la-vera`): `/images/portfolio/viajes-cultura/entramados-de-villanueva-de-la-vera.jpg` → `/images/portfolio/arquitectura-urbana/entramados-de-villanueva-de-la-vera.jpg` (categoría: `arquitectura-urbana`)
- `vc-27` (`aleros-convergentes`): `/images/portfolio/viajes-cultura/aleros-convergentes.jpg` → `/images/portfolio/arquitectura-urbana/aleros-convergentes.jpg` (categoría: `arquitectura-urbana`)
- `vc-29` (`geometria-del-zellij-y-el-arco`): `/images/portfolio/viajes-cultura/geometria-del-zellij-y-el-arco.jpg` → `/images/portfolio/arquitectura-urbana/geometria-del-zellij-y-el-arco.jpg` (categoría: `arquitectura-urbana`)
- `vc-36` (`escalinata-de-la-kasbah`): `/images/portfolio/viajes-cultura/escalinata-de-la-kasbah.jpg` → `/images/portfolio/arquitectura-urbana/escalinata-de-la-kasbah.jpg` (categoría: `arquitectura-urbana`)
- `vc-38` (`siluetas-bajo-el-sol-del-desierto`): `/images/portfolio/viajes-cultura/siluetas-bajo-el-sol-del-desierto.jpg` → `/images/portfolio/paisajes-documental/siluetas-bajo-el-sol-del-desierto.jpg` (categoría: `paisajes-documental`)
- `vc-39` (`horizonte-de-dunas-al-atardecer`): `/images/portfolio/viajes-cultura/horizonte-de-dunas-al-atardecer.jpg` → `/images/portfolio/paisajes-documental/horizonte-de-dunas-al-atardecer.jpg` (categoría: `paisajes-documental`)
- `vc-40` (`dunas-en-el-crepusculo`): `/images/portfolio/viajes-cultura/dunas-en-el-crepusculo.jpg` → `/images/portfolio/paisajes-documental/dunas-en-el-crepusculo.jpg` (categoría: `paisajes-documental`)
- `vc-41` (`caminantes-en-la-inmensidad`): `/images/portfolio/viajes-cultura/caminantes-en-la-inmensidad.jpg` → `/images/portfolio/paisajes-documental/caminantes-en-la-inmensidad.jpg` (categoría: `paisajes-documental`)
- `vc-42` (`ocaso-sobre-el-erg`): `/images/portfolio/viajes-cultura/ocaso-sobre-el-erg.jpg` → `/images/portfolio/paisajes-documental/ocaso-sobre-el-erg.jpg` (categoría: `paisajes-documental`)
