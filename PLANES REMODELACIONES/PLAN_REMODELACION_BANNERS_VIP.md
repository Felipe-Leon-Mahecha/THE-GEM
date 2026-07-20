# PLAN DE REMODELACIÓN — Apartado "BANNERS VIP" (THE GEM)

> Instrucciones de uso: pega este .md completo a la IA nueva y dile:
> "Mira el md, aquí están las partes de la remodelación de Banners VIP, vamos en la parte # ___, continúa por favor."
> Cada parte indica QUÉ ARCHIVOS ADJUNTAR. No hace falta mandar los archivos completos si son gigantes (shop.js pesa ~315KB, style.css ~285KB) — se puede pegar solo el rango de líneas indicado o pedirle a la IA que pida ver esas funciones/selectores puntuales.

---

## 0. DIAGNÓSTICO (ya hecho, no repetir — es contexto)

Estado actual (líneas aproximadas al 08/07/2026, pueden moverse tras ediciones):

| Elemento visual | Función/selector responsable | Archivo |
|---|---|---|
| Círculo "BANNERS VIP" con botones flotantes | `renderVIPLegendRoom()` (shop.js ~3066-3088) + `.vip-legend-room`, `.vip-legend-core`, `.vip-floating-stations`, `.vip-station` (style.css ~3852-3934) | shop.js, style.css |
| Botones POTENCIADORES / BANNERS VIP / COLECCIONES / PAQUETES | Hardcodeados dentro de `renderVIPLegendRoom()` (shop.js ~3077-3082) | shop.js |
| Grid de banners individuales (Speed Color Red, etc.) | `renderVIPStationBanner()` (shop.js ~3090-3101) + `.vip-banner-catalog-chamber`, `.vip-station-card` (style.css ~3936-3970) | shop.js, style.css |
| Banner de entrada "BG Carousel Void Lux" | `renderVIPPromoBanner()` (shop.js ~3001-3009) + `.vip-promo-banner` (style.css ~3140-3160, height fijo 172px) | shop.js, style.css |
| Banner "Potenciadores VIP" (al lado, sí terminado) | `renderVIPPowerupPromoBanner()` (shop.js ~1270-1300) + `.vip-powerup-promo-banner` (style.css ~3161-3268, min-height 190px) | shop.js, style.css |
| Fila donde viven ambos banners | `.vip-banner-row` (style.css ~3133-3138), renderizada en `renderVIPHome()` (shop.js ~2960-2962) | shop.js, style.css |

**Hallazgo importante:** `responsive.css` no tiene NINGUNA regla `.vip-*`. Toda esta sección no tiene versión mobile — hay que crearla, no solo ajustarla.

**Problemas confirmados a resolver:**
1. Botones COLECCIONES y PAQUETES no llevan a ninguna parte real (solo `renderVIPHome()`). Son leftover.
2. El círculo + botones flotantes es un concepto decorativo que no aporta nada funcional real — se puede demoler entero.
3. El grid de banners individuales es plano, sin jerarquía (todos se ven igual de importantes, sin distinguir animados/exclusivos/GIF).
4. El banner de entrada (Void Lux) no tiene el mismo peso visual que el de al lado (Potenciadores).
5. Cero soporte mobile en toda la sección.

---

## 0.5 — ACTUALIZACIÓN IMPORTANTE: sistema de catálogo de banners (ya implementado, no es parte del rediseño visual, pero LO ALIMENTA)

Felipe ya construyó (por su cuenta, fuera de este plan) un catálogo central de banners que reemplaza la carpeta suelta `Placeholders`. Cualquier IA que continúe este plan DEBE conocer esto antes de tocar la Parte 4, porque de aquí salen los datos reales de las filas.

**Archivo fuente de verdad:** `assets/Imagenes/Banners/banners.catalog.js` → expone `window.GEM_BANNERS_CATALOG` (se carga en `index.html` ANTES que `shop.js`).

**Carpetas de assets:**
- `assets/Imagenes/Banners/tienda_normal/`
- `assets/Imagenes/Banners/tienda_vip/`
- `assets/Imagenes/Banners/banners_temporada/`
- `assets/Imagenes/Banners/banners_nuevos/`

**Categorías del catálogo (campo `category` de cada item):**
- `tienda_normal` — banners normales permanentes
- `tienda_vip` — banners VIP permanentes (esto es la "Colección completa" de la Parte 4)
- `banners_temporada` — banners de evento/temporada. Se muestran en tienda normal hasta `expiresAt`; después el juego los trata como `tienda_vip` automáticamente (regla `expiredSeasonalCategory`).
- `banners_nuevos` — banners recién agregados. Se muestran como "nuevos" hasta `movesAt` (regla: 2 meses, `newMovesAfterMonths`); después pasan a su `finalCategory` (`tienda_normal` o `tienda_vip`).

**Funciones ya existentes en `shop.js` (líneas aproximadas al 08/07/2026) que ya resuelven todo esto — NO hay que reprogramar la lógica de datos, solo consumirla para pintar las filas:**
- `getBannerActiveCategory(item, now)` (shop.js ~883) — resuelve la categoría real de un item según fechas
- `mapBannerCatalogItem(item)` (shop.js ~904) — devuelve el objeto banner con `isSeasonal: true/false` e `isNew: true/false` ya calculados
- `getAllBannerCatalog()` (shop.js ~930), `getNormalBannerCatalog()` (shop.js ~938), `getVipBannerCatalogFromConfig()` (shop.js ~942)
- `getVIPBannerCatalog()` (shop.js ~986) — el que ya usa el panel VIP hoy

**Esto significa que el flag `featured: true` que se planteó antes YA NO HACE FALTA inventarlo a mano** — hay algo mejor: `isSeasonal` e `isNew` vienen calculados por fechas reales del catálogo. Ver PARTE 4 actualizada abajo para cómo se usa esto en las filas finales.

**Rarezas:** `rarities.override.js` tiene los 28 banners placeholder nuevos con rareza vacía (`""`) para que Felipe las defina luego (`BASICO`, `ESPECIAL`, `EPICA`, `DEMON`, `VIP`). El catálogo ya trae `rarity` por defecto en cada item, pero `rarities.override.js` puede pisarlo. Se resuelve por id activo, alias viejo, o nombre visible.

---

## PARTE 1 — Demolición segura

**Objetivo:** eliminar lo roto/leftover sin tocar nada más, dejar el terreno limpio antes de construir el diseño nuevo.

**Qué se hace:**
- Quitar los botones `COLECCIONES` y `PAQUETES` de `renderVIPLegendRoom()` (no llevan a nada real).
- Decidir: ¿el círculo + `.vip-floating-stations` se demuele completo (recomendado) o se deja como base para la Parte 2? (yo recomiendo demoler completo y reconstruir con el diseño nuevo de la Parte 2, va a quedar mejor).
- Eliminar el CSS muerto asociado una vez decidido qué se demuele (`.vip-floating-stations`, `.vip-station`, `.vip-station:nth-child(1..4)`, `.vip-legend-room`, `.vip-legend-core`, `.vip-core-rings`, `@keyframes vipSlowFloat`) — SOLO si se confirma que no se usan en ningún otro lado del juego (hay que grep primero).
- No tocar `renderVIPStationBanner()` ni `.vip-station-card` todavía (eso es la Parte 4, son cosas distintas aunque el nombre se parezca).

**Archivos a adjuntar:**
- `shop.js` — pero solo pegar el rango de la función `renderVIPLegendRoom()` (buscar `function renderVIPLegendRoom`)
- `style.css` — solo pegar el bloque `.vip-legend-room` a `.vip-station-card` (buscar `.vip-floating-stations` en el archivo, ese bloque completo)

**Criterio de aceptación:** al entrar a "Banners VIP" ya no aparecen botones que no funcionan. El juego sigue corriendo sin errores en consola.

---

## PARTE 2 — Nueva "puerta de entrada" a Banners VIP

**Objetivo:** reemplazar el círculo demolido en la Parte 1 por un header/hero que se sienta premium y con propósito real (sin navegación falsa).

**Qué se hace:**
- Diseñar un nuevo hero para `renderVIPLegendRoom()`: título "BANNERS VIP", subtítulo, y el botón real "VER BANNERS" que hace scroll al catálogo (ese si funciona, se mantiene).
- Se puede reutilizar el lenguaje visual que YA existe y se ve bien: `.vip-carousel-room` / `.vip-reactor-hero` (grid con imagen de fondo, glow, `vip-kicker`, etc.) — así no se inventa un sistema visual nuevo, se es consistente con el resto del VIP.
- Si se quiere mantener algo del círculo (opcional), se puede convertir en un elemento puramente decorativo SIN botones encima — pero mi sugerencia es ir directo al formato hero horizontal que ya usan `vip-carousel-room`/`vip-reactor-hero`, se ve más "tienda premium" y menos "misterioso sin sentido".
- Definir 1-2 variantes de diseño (para que el usuario elija) antes de programarlas.

**Archivos a adjuntar:**
- `shop.js` resultante de la Parte 1 (la función `renderVIPLegendRoom()` ya limpia)
- `style.css` — bloque de `.vip-carousel-room`, `.vip-reactor-hero`, `.vip-carousel-core`, `.vip-legend-core`, `.vip-parallax-panels` (buscar `.vip-carousel-room,` en el archivo — todo ese bloque de ~3507 a ~3660 en el snapshot actual)

**Criterio de aceptación:** el header de Banners VIP se ve como una vitrina real, con un solo botón funcional ("VER BANNERS"), consistente visualmente con el resto del panel VIP.

---

## PARTE 3 — Igualar el banner de entrada (Void Lux) con el de Potenciadores

**Objetivo:** que ambos banners de `.vip-banner-row` (Potenciadores VIP y Banners VIP) tengan el mismo peso visual y tamaño, ninguno se vea como "placeholder sin terminar".

**Qué se hace:**
- Diseñar `renderVIPPromoBanner()` (el de banners) con el mismo nivel de detalle que `renderVIPPowerupPromoBanner()`: fondo con gradientes/glow, texto real posicionado, algún elemento gráfico (no solo una imagen `<img>` de placeholder).
- Igualar altura real: usar `min-height` consistente entre `.vip-promo-banner` y `.vip-powerup-promo-banner` (hoy 172px fijo vs 190px min — unificar a una sola variable).
- Reemplazar el placeholder PNG actual ("PLACEHOLDER PNG - REEMPLAZABLE" quemado en la imagen) por diseño real en CSS/HTML, para no depender de que el placeholder se vea bien.

**Archivos a adjuntar:**
- `shop.js` — funciones `renderVIPPromoBanner()` y `renderVIPPowerupPromoBanner()` (para copiar el mismo nivel de detalle/estructura)
- `style.css` — bloque `.vip-banner-row` a `.vip-empty-slot` (buscar `.vip-banner-row {` — todo ese bloque de ~3133 a ~3278 en el snapshot actual)
- Si tienes ya pensado un asset/imagen de fondo nueva para "Void Lux", avisar la ruta o adjuntar el PNG

**Criterio de aceptación:** los dos banners de esa fila se ven como parte del mismo sistema de diseño, mismo alto, mismo nivel de terminado — ninguno grita "esto es un placeholder".

---

## PARTE 4 — Rediseño del catálogo de banners individuales

**Objetivo:** que el listado de banners (Speed Color Red, Tienes color?, etc.) deje de verse como catálogo genérico en filas/columnas y se sienta "premium".

**DECISIÓN DE DISEÑO YA TOMADA (ver captura adjunta del preview aprobado):**

Diseño elegido: **"panal escalonado" estilo Netflix** — filas horizontales apiladas, donde cada fila se corre lateralmente respecto a la de arriba (efecto ladrillo/panal), en vez de un grid parejo o un mosaico bento. Cada card individual usa esquinas cortadas en diagonal (`clip-path`, no rectángulo perfecto), fondo oscuro con acento azul (normal) o morado con glow (animado/GIF), sobre el fondo con auroras moradas/azules + estrellas ya definido en la Parte 2/3.

Se descartaron:
- Grid clásico parejo (opción segura pero menos "wow", se dejó como plan B)
- Rail horizontal tipo Clash Royale (descartado: los banners son verticales/altos, obliga a scroll lateral incómodo)
- Bento/mosaico con tamaños mixtos (descartado: genera jerarquía falsa entre productos que en realidad son equivalentes — un banner grande no es "mejor" que uno chico, solo confunde a la hora de comparar precio/rareza)

**FILAS FINALES (ya definidas, alimentadas por el catálogo real — ver sección 0.5):**

1. **Fila "TEMPORADA"** (o el nombre de la temporada activa, ej. "VERANO 2026")
   - Fuente: banners con `isSeasonal: true` (categoría `banners_temporada`, no expirados)
   - **NO es carrusel/bucle** — es estática, siempre muestra los banners de temporada activos en pantalla fija (hoy son 3, definidos en `banners.catalog.js`)
   - Cards más grandes que el resto de filas (son el evento/lo especial del momento)
   - Si no hay temporada activa (0 banners con `isSeasonal:true` vigentes), esta fila no se renderiza

2. **Fila "NUEVOS"**
   - Fuente: banners con `isNew: true` (categoría `banners_nuevos`, aún no llegó `movesAt`)
   - Carrusel **en bucle infinito** (loop) — el jugador puede seguir deslizando a la derecha y vuelve a aparecer el primer banner (se resuelve duplicando los items al final de la fila, o clonando el primer set al llegar al final — no con "scroll infinito real" tipo fetch, es finito y cíclico)
   - Si no hay banners nuevos vigentes, esta fila no se renderiza

3. **Filas "COLECCIÓN" (permanentes, VIP)**
   - Fuente: banners con `category: 'tienda_vip'` (incluye los que ya expiraron de temporada, por la regla `expiredSeasonalCategory`)
   - **IMPORTANTE (pedido explícito de Felipe): NO meter todos los banners permanentes en una sola fila-bucle gigante.** Se reparten en varias filas (3, 4, 5... las que hagan falta según cuántos banners haya) para que cada fila se sienta curada y no una lista infinita disfrazada de carrusel.
   - Criterio de reparto a definir en la Parte 4 (opciones a decidir con Felipe cuando se programe):
     - Por rareza (`rarity`): una fila por cada rareza presente entre los VIP (`VIP`, `DEMON`, etc.)
     - Por chunks fijos: ej. de a 6-8 banners por fila, en el orden del catálogo
     - Mixto: filas con nombre temático si el catálogo lo permite (fase 2, ver abajo)
   - Cada fila-colección también es carrusel en bucle (igual que "Nuevos")

**Loop/bucle infinito — cómo se resuelve técnicamente (para la IA que programe):**
- Duplicar el set de items de la fila al final del track (`[...items, ...items.slice(0, N)]`) y, al llegar al punto de duplicado, hacer un salto invisible (`scroll-behavior` normal + reset de `scrollLeft` sin animación) de vuelta al inicio real — patrón estándar de carrusel infinito en CSS/JS.
- Aplica solo a las filas carrusel ("Nuevos" y "Colección"), NUNCA a la fila "Temporada" (esa es estática, 3 banners fijos, sin loop).

**Fase 2 (opcional, futura, NO bloquea la Parte 4):** categorías temáticas reales dentro de "Colección" tipo Netflix ("Naturaleza", "Espacio", "Terror") aprovechando banners temáticos ya existentes (`El_Dragon_Chino_VIP`, `Un_poco_de_hielo_VIP`, `La_playa_relajante_VIP`). Requeriría agregar un campo `theme`/`category` temático nuevo al catálogo — se deja pendiente para no inflar esta parte.

**Qué se hace:**
- Reemplazar `.vip-banner-catalog-chamber` (grid parejo) por un contenedor de filas (`.vip-banner-shelf-row` o similar), cada una con su título (Temporada / Nuevos / Colección — o Colección 1, 2, 3... si se reparte) y su set de cards escalonadas.
- La fila "Temporada" se pinta con un layout distinto (estático, cards grandes, sin lógica de scroll/loop) — no reutilizar el mismo componente de carrusel que las demás filas, aunque comparta el mismo lenguaje visual (esquinas cortadas, glow, etc.)
- Nueva card individual con `clip-path` en diagonal (no rectángulo), sustituyendo `.vip-station-card`.
- Distinguir visualmente animados/GIF (borde morado + glow + badge "GIF") de los normales (borde azul) — igual que en el preview aprobado. Usar también el flag `isNew` para un badge "NUEVO" si aplica, y considerar un indicador visual sutil para banners de temporada que van a expirar pronto (opcional).
- El escalonado entre filas se resuelve con offset horizontal por fila (alternar `margin-left` o `translateX` en filas pares/impares), cuidando que siga siendo responsive (en mobile probablemente el offset debe reducirse o eliminarse — ver Parte 5).
- Mantener consistencia con el sistema de rareza que ya usas en el resto del inventario (`RARITY_COLORS`) y con `rarities.override.js` para resolver la rareza mostrada de cada card.

**Archivos a adjuntar:**
- La captura del preview aprobado (panal escalonado, filas de ejemplo)
- `shop.js` — todo el bloque del sistema de catálogo (líneas ~829-990 en el snapshot actual: `BANNERS_CATALOG_CONFIG`, `getBannerActiveCategory`, `mapBannerCatalogItem`, `getAllBannerCatalog`, `getNormalBannerCatalog`, `getVipBannerCatalogFromConfig`, `getVIPBannerCatalog`, `isVIPBannerOnly`) + las funciones de render actuales (`renderVIPStationBanner()`, `buyVIPBanner()`)
- `assets/Imagenes/Banners/banners.catalog.js` (el catálogo central completo)
- `assets/Imagenes/Banners/README_BANNERS_CATALOG.txt`
- `rarities.override.js`
- `style.css` — bloque `.vip-banner-catalog-chamber` a `.vip-station-card h3` (buscar `.vip-banner-catalog-chamber {`)

**Criterio de aceptación:** 
- Fila "Temporada" estática con banners grandes, sin scroll/loop, solo aparece si hay temporada activa.
- Fila "Nuevos" en carrusel-loop infinito, solo aparece si hay banners nuevos vigentes.
- Colección permanente repartida en 2+ filas (nunca una sola fila gigante), cada una en carrusel-loop.
- Cards con esquina cortada (no rectángulos perfectos), sin distorsionar la proporción real de los banners.
- Todo sigue leyendo del catálogo central (`banners.catalog.js`), cero datos hardcodeados nuevos en `shop.js`.

---

## PARTE 5 — Adaptación responsive / mobile

**Objetivo:** que todo lo construido en las Partes 2-4 funcione bien en el celular (Oppo A38 / cualquier `body.is-touch-device`), siguiendo el mismo patrón que ya usas en `responsive.css` (variables `--cfg-*` y overrides `body.is-touch-device .clase`).

**Qué se hace:**
- Crear las reglas `.vip-*` en `responsive.css` desde cero (hoy no existe ninguna).
- Revisar especialmente: el hero nuevo de la Parte 2 (que no se corte en pantallas angostas), la fila `.vip-banner-row` (hoy es `grid-template-columns: repeat(2, 1fr)` fijo — en mobile probablemente debe pasar a 1 columna), y `.vip-banner-catalog-chamber` (el `auto-fit, minmax(210px,1fr)` puede quedar muy apretado en pantallas de ~360-400px).

**Archivos a adjuntar:**
- `responsive.css` completo (o al menos la sección "TIENDA" del inicio del archivo, para ver el patrón de variables `--cfg-*` que ya usas)
- `style.css` — todos los bloques ya tocados en Partes 2, 3 y 4 (versión ya rediseñada)
- `shop.js` — solo si en el camino se necesitó agregar clases nuevas condicionadas a `is-touch-device` (normalmente no hace falta tocar JS para esto)

**Criterio de aceptación:** probado en el dispositivo Android físico vía `chrome://inspect`, la sección se ve y usa bien sin overflow ni elementos cortados.

---

## PARTE 6 — Pulido final y QA

**Objetivo:** cerrar el ciclo, revisar consistencia general y cazar bugs visuales.

**Qué se hace:**
- Revisar estados hover/disabled de botones de compra (`buyVIPBanner`, equipar banner).
- Confirmar que `localStorage` de banners comprados/equipados sigue funcionando igual que antes (no se rompió nada de la lógica de compra al rediseñar el HTML).
- Revisar `body.reduced-motion` y `body.performance-mode` (ya existen overrides para varias clases `.vip-*` — confirmar si las clases nuevas necesitan entrar en esas listas también, para no crashear en modo rendimiento).
- Pasada visual completa: desktop + mobile, con banners reales (no placeholders) si ya están listos.

**Archivos a adjuntar:**
- Todo lo tocado en las Partes 1-5 (shop.js, style.css, responsive.css) en su versión final
- Capturas de cómo quedó, para comparar contra el objetivo

**Criterio de aceptación:** cero errores en consola, se ve bien en ambas resoluciones, la lógica de compra/equipar sigue intacta.

---

## Notas generales para cualquier IA que continúe esto

- Este proyecto usa Vite como dev server y Capacitor para empaquetar Android. El debug se hace en dispositivo físico vía USB + `chrome://inspect`.
- El patrón de diseño ya establecido en el juego usa: variables CSS custom (`--cfg-*`, `--vip-glow-a/b`), overrides por `body.is-touch-device`, `body.reduced-motion`, `body.performance-mode`.
- SIEMPRE pedir ver el archivo actual antes de sobreescribirlo — Felipe modifica el código por su cuenta entre sesiones.
- **Los banners YA NO están hardcodeados en `shop.js`** (esto cambió el 08/07/2026) — ahora viven en el catálogo central `assets/Imagenes/Banners/banners.catalog.js` (`window.GEM_BANNERS_CATALOG`), leído por funciones dedicadas en `shop.js`. Ver sección 0.5 para el detalle completo. `layoutconfig.js` y `textgemconfig.js` siguen sin intervenir en banners.
