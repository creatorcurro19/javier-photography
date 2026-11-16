# Javier Espinosa Martínez — Portfolio de Fotografía de Autor & Documental

Sitio web oficial y archivo fotográfico de autor para **Javier Espinosa Martínez**, fotógrafo español especializado en fauna salvaje, coches y rally histórico, arquitectura urbana y fotografía documental de viajes.

Desarrollado con **Next.js 16 (App Router)**, **React 19**, **Tailwind CSS v4** y tipografía editorial de alta fidelidad estética.

---

## 📸 Colecciones del Archivo (52 Obras Reales)

El portfolio organiza el archivo visual en 5 series independientes:

1. **Fauna y Naturaleza** (`/portfolio/fauna-naturaleza`): 6 obras en hábitats de la Península Ibérica (Monfragüe, Sierra de Gredos, Candelario). Óptica Sigma 150-600mm Contemporary.
2. **Paisajes y Fotografía Documental** (`/portfolio/paisajes-documental`): 5 obras. Horizontes rurales, carreteras de montaña y memorias geográficas.
3. **Coches y Rally** (`/portfolio/coches-rally`): 14 obras. Rally de tramo, automovilismo clásico, trazadas en lluvia y vehículos de competición.
4. **Arquitectura y Fotografía Urbana** (`/portfolio/arquitectura-urbana`): 5 obras. Geometría contemporánea, rascacielos y diagonales de hormigón y cristal en Madrid.
5. **Viajes y Cultura** (`/portfolio/viajes-cultura`): 22 obras. Cuadernos visuales en Merzouga (Sahara), Marrakech, Tenerife y Castilla y León.

---

## ⚙️ Especificaciones Técnicas y Equipo

Todas las imágenes corresponden a capturas auténticas con registro EXIF completo:
- **Cuerpo:** Canon EOS R7 (Sensor APS-C Dual Pixel CMOS AF II de 32,5 MP).
- **Ópticas:**
  - Sigma 150-600mm F5-6.3 DG OS HSM Contemporary
  - Canon RF-S 18-150mm F3.5-6.3 IS STM
  - Canon EF-S 10-18mm F4.5-5.6 IS STM
- **Revelado:** Flujo digital preservando el grano orgánico del sensor y la temperatura lumínica original, sin manipulaciones generativas.

---

## 🏛️ Arquitectura del Proyecto

```
javier-photography/
├── app/
│   ├── page.tsx                     # Portada editorial (Hero, Colecciones, Selección, Biografía)
│   ├── layout.tsx                   # Layout raíz con Schema.org JSON-LD, SEO y OpenGraph
│   ├── portfolio/
│   │   ├── page.tsx                 # Archivo completo con filtro por categorías y masonry
│   │   └── [slug]/page.tsx          # Ficha individual de obra con metadatos EXIF, mapa y relacionados
│   ├── servicios/page.tsx           # Encargos profesionales (Rally, Arquitectura, Documental, Prints)
│   ├── prints/page.tsx              # Catálogo Fine Art en papel algodón Hahnemühle Photo Rag 308g
│   ├── licensing/page.tsx           # Guía y solicitud de licencias de uso editorial y comercial
│   ├── stories/page.tsx             # Cuaderno de campo con 15 historias y notas técnicas de toma
│   ├── about/page.tsx               # Biografía, filosofía artística y desglose de equipo
│   ├── contact/page.tsx             # Formulario interactivo de contacto y consultas
│   ├── sitemap.ts                   # Generador de sitemap XML con 70 rutas estáticas
│   ├── robots.ts                    # Configuración de rastreo para motores de búsqueda
│   └── not-found.tsx                # Página 404 personalizada en castellano
├── components/
│   ├── home/                        # Componentes exclusivos de la página de inicio
│   ├── layout/                      # Navbar fija con backdrop blur y Footer editorial multisección
│   ├── photo/                       # Ficha de obra (Hero, ExifPanel, EquipmentPanel, StorySection, etc.)
│   ├── portfolio/                   # ExhibitionGallery masonry y CategoryNav
│   └── ui/                          # LightboxModal con navegación táctil/teclado, Container y Header
├── data/
│   └── photos.ts                    # Catálogo de 52 obras con metadatos EXIF reales
├── lib/
│   ├── photos.ts                    # Funciones de consulta y filtrado del catálogo
│   ├── metadata.ts                  # Generador uniforme de metadatos SEO
│   └── schema.ts                    # Generador de Schema.org Person & Photograph
└── public/
    └── images/portfolio/            # 52 imágenes organizadas en sus 5 directorios temáticos
```

---

## 🚀 Comandos de Ejecución y Despliegue

### Entorno de desarrollo
```bash
npm run dev
```
Acceso en local: `http://localhost:3000`

### Comprobación de tipos TypeScript
```bash
npx tsc --noEmit
```

### Compilación estática para producción (SSG)
```bash
npm run build
```
Genera las 70 páginas estáticas pre-renderizadas optimizadas para CDN.

### Servidor de producción local
```bash
npm run start
```
