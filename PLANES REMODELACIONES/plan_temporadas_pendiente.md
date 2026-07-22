# THE GEM — Sistema de Temporadas: estado actual y plan restante

> Documento de traspaso para retomar con otra sesión de IA (Cursor/Devin/etc).
> Última actualización: temporada "Leyendas" activa, banners conectados.

---

## ✅ Ya implementado (no tocar sin razón)

### Archivos clave
- `seasons.config.js` — objeto `GEM_SEASONS` con 3 temporadas: `leyendas`, `raices`, `oceanica`. Funciones: `isSeasonActive()`, `getActiveSeasons()`, `getSeasonById()`.
- `rubypass.config.js` — `settings.seasonEndsAt` ya no se usa fijo; el countdown del Ruby Pass se calcula dinámico vía `getActiveSeasonEndDate()`.
- `banners.catalog.js` — esquema extendido con campo opcional `priceGems`. `paths.banners_temporada` apunta a `assets/Imagenes/Temporadas/Temp_Leyendas/Banners/`.
- `shop.js`:
  - `renderShopSeasonsPage(container)` — función principal de la pantalla de Temporadas en tienda normal (case `'seasons'` dentro de `showShopSection`).
  - `toggleSeasonInfo(e)` — abre/cierra el panel de info (lore + chips) desde el botón "i".
  - `openSeasonBannersModal()` — modal simple que lista los banners reales de la temporada activa (reutiliza `renderBannerCard`).
  - `VIP_PROMO_BANNERS` — YA NO tiene entrada de temporadas (se quitó, Temporadas no vive en VIP).
- `style.css` — bloque completo de clases `.season-*`, `.category-bento`, `.showcase-grid`, `.season-banners-modal-*` (buscar comentario `Basado en temporadas_idea_1_v2.html` para ubicarlo).
- Estructura de carpetas: `assets/Imagenes/Temporadas/Temp_Leyendas/{Banners,Skins,Trails,Emotes,Portada}/`, mismo patrón para `Temp_Raices` y `Temp_Oceanica` (vacías, listas para usar).

### Fechas de las 3 temporadas
| Temporada | Inicio | Fin |
|---|---|---|
| Leyendas | 2026-07-01 | 2027-02-28 |
| Raíces | 2027-03-01 | 2027-04-30 |
| Oceánica | 2027-05-01 | 2027-06-30 |

### Banners de Leyendas (ya en `banners.catalog.js`, `category: 'banners_temporada'`)
| id | Cómo se consigue | Precio |
|---|---|---|
| `banner_leyendas_exclusivo` | Compra | 2000 monedas / 140 gemas |
| `banner_leyendas_perla` | Compra | 1800 monedas / 120 gemas |
| `banner_leyendas_rosaceo` | Compra | 1800 monedas / 120 gemas |
| `banner_leyendas_campeones` | `missionOnly: true` — se ganará con el futuro sistema de Eventos | — |
| `banner_leyendas_racha_ganadora` | `missionOnly: true` — se gana jugando 20 días de la temporada | — |

**Ojo:** `priceGems` ya viaja en los datos del banner pero la compra sigue funcionando SOLO con monedas por ahora (`buyBanner()` no tiene lógica de pago con gemas todavía — ver pendiente #1).

---

## ⏳ Pendiente — en orden sugerido

### 1. Habilitar compra con gemas para los banners que tienen `priceGems`
Tocar `buyBanner(id)` y `renderBannerCard(b, equipped)` en `shop.js`: si el banner tiene `priceGems`, mostrar 2 botones (comprar con monedas / comprar con gemas), igual que ya existe el patrón de "Desbloquear con gemas" vs "dinero real" en el Ruby Pass. Sin esto, `banner_leyendas_perla` y `banner_leyendas_rosaceo` solo se pueden pagar en monedas aunque el dato de gemas ya exista.

### 2. Conectar las cards de Skins, Trails y Emotes del bento (mismo patrón que Banners)
Ahora mismo, en `renderShopSeasonsPage`, solo la card `BANNERS` tiene `onclick="openSeasonBannersModal()"`. Falta:
- `openSeasonSkinsModal()` — filtrar el catálogo de skins por `season.contains.skins` (ids: `daxor`, `skin_leyendas_placeholder_01`, `skin_leyendas_placeholder_02` — confirmar que el id real de Daxor en el catálogo coincide antes de asumir `'daxor'`)
- `openSeasonTrailsModal()` — filtrar por `season.contains.trails`
- `openSeasonEmotesModal()` — filtrar por `season.contains.emotes`
- Reutilizar el mismo CSS `.season-banners-modal-*` (renombrar a algo genérico tipo `.season-content-modal-*` si se prefiere, o duplicar clases con otro nombre — decisión de estilo, no bloqueante)

### 3. Crear el arte real de los cosméticos placeholder
Actualmente `seasons.config.js` tiene IDs placeholder para 2 skins, 2 trails, 2 emotes de Leyendas, pero no existen imágenes reales ni entradas en sus catálogos respectivos (`skins.catalog.js` o equivalente, `trails.js`, catálogo de emotes). Sin esto, los modales de la Parte 2 se van a ver vacíos o rotos para skins/trails/emotes.

### 4. Vitrina de "Destacados" (`showcaseHTML` dentro de `renderShopSeasonsPage`)
Ahora mismo arma placeholders genéricos combinando skins+trails+emotes. Cuando haya cosméticos reales (Pendiente #3), revisar que muestre la imagen/ícono real en vez del texto `SKIN`/`TRAIL`/`EMOTE` fijo que tiene ahora.

### 5. Ajustar los lore de Raíces y Oceánica
Cursor puso textos genéricos de relleno en `seasons.config.js` (`raices.lore`, `oceanica.lore`). El usuario (Felipe) los va a reescribir él mismo — no tocar sin que él los revise primero.

### 6. Limpieza menor (no urgente)
`rarities.override.js` tiene claves huérfanas `temporada_placeholder_01/02/03` de cuando existían los banners de temporada viejos (ya no existen esos banners). No rompen nada, se pueden borrar cuando se tenga tiempo.

---

## 🗂️ Aparte, NO parte de este plan (documentos separados)

- **Sistema de Eventos** (misiones propias para ganar `banner_leyendas_campeones`) — ver `brainstorm_sistema_eventos.md` ya generado. Requiere decidir estructura (checklist simple / tiers / rotación semanal) antes de implementar.
- **Notificaciones locales de Capacitor** ("mañana empieza la temporada X") — mencionado pero no iniciado. Requiere `@capacitor/local-notifications` + `npx cap sync`.

---

## Notas de contexto para quien retome esto

- El proyecto usa Git; siempre revisar `git status` antes y después de que un agente de IA haga cambios — hubo un incidente previo de un agente borrando archivos sin permiso, así que las instrucciones a agentes en este proyecto son siempre explícitas sobre "no tocar nada fuera de lo pedido".
- Cuando se pide auditoría antes de cambios destructivos (mover/borrar/renombrar), es intencional — seguir ese patrón con cualquier IA nueva.
- Convención de nombres: sin tildes ni "ñ" en archivos/carpetas (causó un bug de encoding con "Baúl" anteriormente).
- `shop.js` tiene ~9000 líneas; `style.css` tiene ~14000 líneas — al pedirle a una IA que edite, siempre dar número de línea aproximado o nombre de función/clase exacta para que no tenga que leer el archivo completo.
