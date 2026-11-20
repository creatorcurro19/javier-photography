# Guía Rápida: Cómo Subir Nuevas Fotografías al Archivo

No necesitas editar código a mano para añadir obras nuevas al portfolio. El script `npm run photos:import` extrae automáticamente los datos EXIF reales de tus archivos (cámara, objetivo, distancia focal, apertura, velocidad, ISO, año y coordenadas GPS), optimiza la imagen a resolución de galería (2200 px en el lado mayor, JPEG de alta fidelidad) y añade la ficha a `data/photos.ts`.

---

## 1. Coloca tus fotos en la carpeta `photos-inbox/`

Crea (si no existe) la carpeta `photos-inbox/` en la raíz del proyecto y copia dentro tus fotografías en formato `.jpg`, `.jpeg` o `.tif`.

> **Consejo:** Pon como nombre de archivo el título de la obra, por ejemplo:
> `Amanecer en Gredos.jpg` → generará el título **"Amanecer en Gredos"** y el slug `amanecer-en-gredos`.

---

## 2. (Opcional) Añade descripciones o historias en `photos-inbox/meta.json`

Si quieres personalizar la descripción, ubicación o nota de cuaderno de campo (`story`), puedes crear un archivo `photos-inbox/meta.json` (o un `<nombre-archivo>.json` junto a la foto):

```json
{
  "Amanecer en Gredos.jpg": {
    "title": "Amanecer en Gredos",
    "description": "Primera luz invernal sobre el circo glaciar de Gredos tras la ventisca.",
    "story": "Ascenso nocturno con -6 °C esperando la ventana de luz rasante sobre la nieve virgen.",
    "location": "Sierra de Gredos, Ávila",
    "country": "España",
    "prints": true,
    "featured": false,
    "keywords": ["gredos", "alta montaña", "invierno", "paisaje"]
  }
}
```

---

## 3. Simula la importación (`--dry-run`)

Antes de guardar cambios, puedes previsualizar qué fichas se van a generar:

```bash
npm run photos:import -- photos-inbox --category paisajes-documental --dry-run
```

Categorías disponibles (`--category`):
- `fauna-naturaleza`
- `paisajes-documental`
- `coches-rally`
- `arquitectura-urbana`
- `viajes-cultura`

Opciones adicionales:
- `--prints` → habilita las obras importadas para venta como copia Fine Art Hahnemühle.
- `--featured` → marca las obras como destacadas.

---

## 4. Importa las fotografías y publica

Ejecuta el comando sin `--dry-run`:

```bash
npm run photos:import -- photos-inbox --category paisajes-documental --prints
```

Esto:
1. Generará los archivos optimizados en `public/images/portfolio/<categoria>/<slug>.jpg`.
2. Añadirá las fichas con su ID correlativo (`fn-XX`, `pd-XX`, `cr-XX`, `au-XX`, `vc-XX`) a `data/photos.ts`.
3. Actualizará automáticamente el sitemap XML (`/sitemap.xml`), el archivo del portfolio y el buscador.

Para publicar en producción:

```bash
git add public/images/portfolio data/photos.ts
git commit -m "feat(archivo): añadir nuevas obras al catálogo"
git push
```
