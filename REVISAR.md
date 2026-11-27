# Puntos a revisar y decidir por el autor (`REVISAR.md`)

Este documento recoge todos los elementos detectados durante la auditoría sobre la rama `fix/auditoria` que requieren confirmación tuya (datos RAW, ubicaciones reales, régimen fiscal o decisiones de negocio). No se ha inventado ningún dato ni cifra.

---

## Prioridad ALTA · Legal, fiscal, pagos y seguridad

### 1. Régimen fiscal aplicable antes de vender online (`IGIC / REPEP / IVA`)
- **Qué se hizo en el código:** Se eliminaron las afirmaciones categóricas ("sin recargo de IGIC", "venta particular", "no sujeta a repercusión") en `app/condiciones/page.tsx` y `types/cart.ts`, sustituyéndolas por `"Los impuestos aplicables se indican al confirmar el pedido"` (con comentarios `// PENDIENTE: confirmar con gestor` en código, respetando el guard de build `scripts/check-content.mjs` que bloquea la palabra literal `TODO`).
- **El NIF (`26505129K`)** se dejó únicamente en `app/legal/page.tsx`, enlazado desde `app/condiciones/page.tsx`.
- **Qué debes revisar con tu gestor/asesoría:**
  1. Confirmar tu encuadre fiscal real en Canarias (IGIC general, franquicia REPEP si estás de alta en IAE/autónomos, o tratamiento de ventas esporádicas / obra de autor) e impuestos para Península / Baleares / UE (IVA / DUA aduanero).
  2. Confirmar que quieres mostrar el NIF completo (`26505129K`) y la dirección exacta o población (`Puerto de la Cruz`) públicamente en `/legal`.

### 2. Activación de pasarela de pago (`PAGOS_ACTIVOS`)
- **Qué se hizo en el código:** Se creó el flag `PAGOS_ACTIVOS` en `data/site-config.ts` (`process.env.NEXT_PUBLIC_STRIPE_ACTIVE === "true"`, actualmente `false`). Con `false`, la web funciona en modo **"Copias Fine Art por encargo"** (`Solicitar esta copia → /contact`) y no menciona Stripe al público.
- **Qué debes decidir/configurar en Vercel cuando quieras cobrar online:**
  1. Configurar `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` y activar `NEXT_PUBLIC_STRIPE_ACTIVE=true` (solo tras validar el punto fiscal #1).
  2. Revisar `RESEND_API_KEY` y `RESEND_FROM_EMAIL` en Vercel si aún usas FormSubmit como respaldo (`javierespinosa1995@hotmail.com`).

### 3. Variables de seguridad del panel `/admin`
- **Qué se hizo en el código:** Se ocultó el enlace público `"Acceso Autor"` del pie de página (`components/layout/Footer.tsx`), `/admin` y `/cliente` tienen `noindex` + `Disallow` en `app/robots.ts`, y `app/admin/page.tsx` ya no serializa obras ni ajustes antes de comprobar la cookie de sesión.
- **Qué debes hacer en Vercel:** Asegúrate de definir **`ADMIN_PIN`** y **`AUTH_SECRET`** como variables de entorno en Vercel (para no depender del valor de respaldo local definido en `lib/server/admin-auth.ts`).

---

## Prioridad MEDIA · Veracidad documental, RAW y ubicaciones

### 4. Confirmar distancia focal / apertura en RAW (10 obras)
En el Bloque 1 se eliminaron 10 notas internas `{{VERIFICAR...}}` de `data/works.ts` conservando el valor del campo EXIF principal. Por favor, abre el archivo RAW (CR3) original de cada una y confirma si `focalLength`, `aperture`, `camera` o el texto curatorial necesitan corrección:

| ID | Slug (`title`) | EXIF conservado en `data/works.ts` | Qué debes contrastar en el RAW / texto |
| :--- | :--- | :--- | :--- |
| `fn-04` | `mirada-del-lince-boreal` (*Ojos de Ámbar*) | `Canon EOS R7 · 232mm · f/5.0 · 1/800s · ISO 2000` | El texto anterior mencionaba 600mm o 400mm frente a los `232mm` del campo EXIF. |
| `fn-08` | `el-paso-del-lobo` (*Sombra entre las Hojas*) | `Canon EOS R7 · 600mm · f/5.6 · 1/640s · ISO 6400` | Contrasta si la apertura real fue `f/5.6` o `f/6.3`. |
| `pd-02` | `cumbre-nevada-al-alba` (*Alba sobre el Volcán*) | `Canon EOS R7 · 115mm · f/6.3 · 1/25s · ISO 320` | Verifica si la toma fue con `115mm` o `24mm`. |
| `cr-13` | `cruzada-sobre-el-asfalto` (*Humo y Asfalto*) | `Canon EOS R7 · 150mm · f/5.6 · 1/800s · ISO 400` | Verifica si la focal real fue `150mm`, `135mm` o `200mm`. |
| `vc-06` | `cisne-en-el-estanque` (*Perla de Agua*) | `Canon EOS 750D · 403mm · f/6.0 · 1/1000s · ISO 400` | Contrasta cuerpo (`750D`), `403mm` y `f/6.0` frente al RAW. |
| `vc-07` | `carbonero-en-la-niebla` (*Susurro en la Bruma*) | `Canon EOS R7 · 562mm · f/5.6 · 1/1250s · ISO 160` | Contrasta focal real (`562mm`) y apertura (`f/5.6`). |
| `vc-08` | `ciguena-entre-la-hierba` (*Calma en la Pradera*) | `Canon EOS R7 · 600mm · f/5.6 · 1/1000s · ISO 1250` | Contrasta focal real (`600mm`) y apertura (`f/5.6`). |
| `vc-13` | `perfil-del-venado` (*Nobleza Salvaje*) | `Canon EOS R7 · 600mm · f/5.6 · 1/1000s · ISO 250` | Contrasta focal real (`600mm`) y apertura (`f/5.6`). |
| `vc-42` | `ocaso-sobre-el-erg` (*El Último Destello*) | `Canon EOS R7 · 150mm · f/6.3 · 1/1600s · ISO 320` | Contrasta si fue `150mm` o `200mm`. |
| `vc-44` | `el-oficio-y-la-chispa` (*Donde Nace la Chispa*) | `Canon EOS R7 · 18mm · f/3.5 · 1/500s · ISO 800` | Contrasta si fue `18mm` o `50mm`. |

### 5. Campo `condiciones` pendiente en 26 obras de `Fauna y Naturaleza`
Solo `fn-04` (Lince) y `fn-08` (Lobo) constan como **`"santuario"`** (Santuario de Fauna Salvaje, Austria). Las **26** obras restantes quedaron marcadas como **`"sin indicar"`** en `data/works.ts` para no inventar ni afirmar fauna silvestre donde pueda haber parque zoológico o cercado. Indica para cada una si corresponde `"silvestre"`, `"santuario"` o `"cautiverio"`:

- `fn-01` · `cotorra-en-reposo` (*Quietud Esmeralda*) — Tenerife, Islas Canarias
- `fn-02` · `plumaje-esmeralda` (*Latido Verde*) — Tenerife, Islas Canarias
- `fn-03` · `garza-blanca-al-sol` (*Seda al Amanecer*) — Humedal Ibérico
- `fn-05` · `vigias-del-risco` (*Señores del Abismo*) — Parque Nacional de Monfragüe, Cáceres
- `fn-06` · `descenso-en-la-roca` (*El Equilibrio de la Piedra*) — Sierra de Gredos
- `fn-07` · `cabras-monteses-en-la-pena` (*Guardianas de la Cumbre*) — Sierra de Gredos
- `pd-05` · `ave-del-paraiso-al-sol` (*Fuego en la Sombra*) — Tenerife, Islas Canarias
- `vc-06` · `cisne-en-el-estanque` (*Perla de Agua*) — Humedal Ibérico
- `vc-07` · `carbonero-en-la-niebla` (*Susurro en la Bruma*) — Bosque Caducifolio Ibérico
- `vc-08` · `ciguena-entre-la-hierba` (*Calma en la Pradera*) — Selva Negra, Alemania
- `vc-10` · `rana-en-la-corriente` (*Espejo del Arroyo*) — Garganta de la Sierra de Gredos
- `vc-12` · `majestad-en-la-dehesa` (*Corona del Bosque*) — Dehesa Ibérica, Extremadura
- `vc-13` · `perfil-del-venado` (*Nobleza Salvaje*) — Dehesa Ibérica, Extremadura
- `vc-17` · `macro-de-saltamontes` (*Escultura de Bronce*) — Monte Mediterráneo
- `fn-14` · `ciguena-bajo-la-lluvia` (*Danza bajo la Lluvia*) — Selva Negra, Alemania
- `fn-15` · `cuervo-canario-ante-las-cumbres` (*Guardián de las Cumbres*) — Macizo de Anaga, Tenerife
- `fn-16` · `despliegue-de-alas-en-la-cresta` (*Abanico de Viento*) — Macizo de Anaga, Tenerife
- `fn-17` · `vela-de-cristal-carabela-portuguesa` (*Vela de Cristal*) — Costa Atlántica, Islas Canarias *(nota: la ficha tiene la palabra "canarias"; confirma en qué isla concreta fue tomada)*
- `fn-18` · `cangrejo-moro-en-el-basalto` (*Sangre y Basalto*) — Costa Atlántica, Tenerife
- `fn-19` · `mariposa-monarca-a-contraluz` (*Vidriera al Sol*) — Tenerife, Islas Canarias
- `fn-20` · `gaviota-sobre-azul-cobalto` (*Trazo sobre Cobalto*) — Litoral Atlántico, Canarias
- `fn-21` · `vuelvepiedras-en-la-orilla-volcanica` (*A la Orilla del Atlántico*) — Costa Volcánica, Tenerife
- `fn-22` · `gamo-en-el-encinar` (*Mirada entre Encinas*) — Encinar Ibérico
- `fn-23` · `esmeralda-en-penumbra` (*Esmeralda en Penumbra*) — Tenerife, Islas Canarias
- `fn-24` · `garza-blanca-en-la-orilla` (*Calma Dorada*) — Humedal Ibérico
- `fn-25` · `cotorra-en-la-palmera` (*Vigía entre Palmas*) — Tenerife, Islas Canarias

### 6. Ubicaciones genéricas o vagas que conviene concretar
Aunque cada ficha lee `location` desde un único campo (`data/works.ts`), varias obras mantienen nombres genéricos que convendría precisar (localidad o paraje real):
- `Humedal Ibérico` (`fn-03`, `vc-06`, `fn-24`)
- `Bosque Caducifolio Ibérico` (`vc-07`)
- `Encinar Ibérico` (`fn-22`)
- `Monte Mediterráneo` (`vc-17`)
- `Cordillera Ibérica` (`pd-08`)
- `Jardín Histórico` (`au-06`)
- `Paseo Urbano` (`au-07`)
- `Monte de Laurisilva, Canarias` (`au-03`)
- `Santuario de Fauna Salvaje, Austria` (`fn-04`, `fn-08` — confirma el nombre del parque si deseas indicarlo, o si prefieres mantener genérico)
- Costas genéricas en Canarias (`Costa Atlántica, Islas Canarias`, `Litoral Atlántico, Canarias`, `Costa Volcánica, Islas Canarias`: `fn-17`, `fn-20`, `pd-03`, `vc-26`)

### 7. Títulos distintos del `slug` original (convivencia título evocador vs descriptivo)
Actualmente todas las páginas leen el campo único `title`, pero 70 de 105 obras tienen un `slug` descriptivo diferente del `title` evocador (casos destacados señalados en auditoría: `el-paso-del-lobo` → *"Sombra entre las Hojas"* y `mirada-del-lince-boreal` → *"Ojos de Ámbar"*; además de rally, paisajes y documental como `farola-y-azulejeria-nocturna` → *"Oro sobre Cerámica"*, `cisne-en-el-estanque` → *"Perla de Agua"*, `perfil-del-venado` → *"Nobleza Salvaje"*).
- **Qué debes decidir:** Confirmar si mantienes los títulos poéticos actuales en `title` (conservando el `slug` actual para no romper SEO ni URLs) o cuáles prefieres ajustar mediante `/admin`. Si en algún momento cambias un `slug`, habría que añadir redirección 301 en `next.config.ts`.

### 8. Metadatos de Rally Histórico (`evento`, `year`, `lugar`)
Las 16 fotos de `coches-rally` ya tienen rellenos `evento` (*"52º Rallye Orvecame Isla Tenerife Histórico"*), `year` (`2026`) y `lugar` (*"Tramo de El Tanque, Tenerife"* o *"Tenerife"*), derivados únicamente de su ubicación original.
- **Revisa** si las fotos de paddock/asistencia (`cr-01`, `cr-02`, `cr-03`, `cr-05`, `cr-06`, `cr-09`, `cr-10`) deben precisar un municipio/ubicación exacta del parque de asistencia en `lugar`.

---

## Prioridad BAJA · Decisiones editoriales, producto y activos

### 9. Decisión de venta: Copias SIN enmarcar por defecto
- Se eliminó `"enmarcado a medida"` de `app/servicios/page.tsx` y se etiquetó el simulador (`PrintScaleVisualizer.tsx`) como `"Vista previa (marco no incluido)"`. Las tablas y fichas indican exclusivamente envío sin enmarcar en tubo rígido.
- **Confirma** si se mantiene así permanentemente o si en el futuro ofrecerás enmarcado presencial únicamente en Tenerife.

### 10. Trabajos y colaboraciones (`data/trabajos.ts`)
- Se preparó `data/trabajos.ts` vacío (`TRABAJOS = []`) y `components/about/TrabajosSection.tsx` (actualmente no renderiza nada en `/about`).
- **Cuándo rellenarlo:** En cuanto tengas publicaciones, exposiciones o encargos verificables que autoricen mención, añádelos al array `TRABAJOS`.

### 11. Inventario de resolución de imágenes actual (decisión mantenida a 3200px)
- Conforme a tu confirmación, se mantienen los JPEG actuales optimizados sin duplicar a 2400px en `/web`:
  - 95 fotografías a lado mayor **3200 px** (variantes 3:2, 4:5 y 16:9).
  - 8 fotografías a lado mayor **3840 px**.
  - 2 fotografías ligeramente por debajo de 3200 px por reencuadre original: `fn-03` (`garza-blanca-al-sol`, `2395 × 2994 px`) y `fn-20` (`gaviota-sobre-azul-cobalto`, `2542 × 3177 px`).
- `og:image` y `twitter:image` apuntan ahora a `/api/og` (`1200 × 630` PNG) para evitar que redes sociales descarguen los archivos originales de 3200 px.
