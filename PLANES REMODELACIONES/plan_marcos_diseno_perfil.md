# PLAN — Sistema de Marcos + Rename "Banners" → "Diseño de Perfil"
**Proyecto:** THE GEM
**Fecha:** 2026-07-22
**Para:** pasar a Cursor (u otra IA) en varios prompts, no en uno solo — es mucho feature.

---

## 0. Contexto (por qué existe este documento)

Ya existe en el juego un sistema de **Banners** (estandartes de perfil) completo:
- Catálogo: `BANNERS_DATA` (array base) + `BANNERS_CATALOG_CONFIG` (config externa opcional) vía `getAllBannerCatalog()`.
- Ownership: `localStorage.getItem('banner_' + id) === 'true'`, seteado con `setBannerOwned()`.
- Equipado: `localStorage.getItem('equippedBanner')`.
- Funciones clave: `ownsBanner()`, `findBannerById()`, `equipBanner()`, `getNormalBannerCatalog()`, `getVipBannerCatalogFromConfig()`.
- Renderizado en: tienda normal, tienda VIP, pase de temporada (Ruby Pass), inventario, sidebar de tienda, pill de perfil en menú principal.
- **Bug ya corregido:** `getAllBannerCatalog()` ignoraba `BANNERS_DATA` cuando existía `BANNERS_CATALOG_CONFIG`, causando que banners otorgados por el pase (`passOnly`) no aparecieran en inventario ni en el banner de perfil equipado. Fix: sumar manualmente los `passOnly` de `BANNERS_DATA` que no estén en el config. **Cursor no debe reintroducir este patrón de bug en Marcos** (ver sección 6).
- **Ya implementado:** en el inventario, el banner de perfil vive en un contenedor especial `#inv-banner-spotlight` (clase `.inv-banner-spotlight`), que es HERMANO de `.inv-main` (el área con scroll), no está adentro. Por eso tiene `overflow: visible` y puede tener efectos que sobresalgan del rectángulo (hojas, gotas, marcos) sin que el scroll los recorte. **Esto NO existe en ningún otro lugar todavía** (tienda, VIP, temporada, sidebar, menú principal siguen con `overflow: hidden` normal).

Queremos agregar **Marcos**: un accesorio de perfil separado que se equipa ENCIMA del banner (no lo reemplaza). Banner = capa de fondo. Marco = capa decorativa encima, PNG con transparencia, que puede sobresalir del rectángulo.

---

## 1. Decisión de diseño ya tomada

- **Un solo tamaño/ratio de banner-slot para todo el juego.** No se van a hacer variantes de arte por cada caja (tienda 4:1, inventario 2:1, etc). Se define UN ratio maestro y todas las cajas se ajustan a ese ratio (aunque se vean más chicas o grandes en pantalla). Esto aplica tanto a Banners como a Marcos — mismo lienzo para ambos, para que cualquier combinación banner+marco calce.
- **Los banners viejos (arte "todo en uno", ej. "Exclusivo de Leyendas", "Rosáceo de Leyendas") NO se convierten en marcos.** Se quedan como están. El tipo "Marco" (PNG transparente, solo el borde) es un tipo de asset nuevo hacia adelante — no se retrofitea arte viejo.
- **"Banners" pasa a ser una subcategoría dentro de "Diseño de Perfil"**, junto a "Marcos". En cada lugar donde hoy hay una sección de Banners, debe aparecer un selector tipo pill/tab para alternar entre **Banners** y **Marcos**, mostrando el grid correspondiente debajo. El preview de arriba (spotlight) siempre muestra el banner + marco equipados juntos, sin importar qué tab esté activo abajo.
- **El rename es SOLO cosmético (texto visible), no de arquitectura.** Los IDs internos de sección en el código (ej. `showInventorySection('banners')`) se quedan exactamente igual — no vale la pena el riesgo de tocar referencias internas (`onclick`, `data-section`, selectores CSS) por algo que nadie ve. Solo cambia el TEXTO en pantalla: "BANNERS" → "DISEÑO DE PERFIL" con las pills Banners/Marcos debajo.
- **Arquitectura parametrizada, no duplicada.** En vez de copiar cada función de Banners con otro nombre para Marcos (`getAllBannerCatalog` → `getAllFrameCatalog`, etc.), usar una sola función genérica con un parámetro de tipo: `getAllCosmeticCatalog(type)` donde `type` es `'banner'` o `'frame'`, y storage tipo `localStorage['cosmetic_' + type + '_' + id]`. Mismo resultado para el jugador, la mitad del código para mantener — un bug arreglado una vez sirve para los dos tipos, y un feature nuevo (favoritos, orden por rareza, etc.) se escribe una sola vez.

---

## 2. Alcance: TODOS los lugares donde hoy hay Banners deben tener Marcos también

| Lugar | Banners hoy | Marcos (nuevo) |
|---|---|---|
| Tienda normal (sidebar "ESTANDARTE" + sección banners) | Sí | Agregar tab Marcos |
| Tienda VIP (`#vipPanel`, sección banners VIP) | Sí | Agregar tab Marcos |
| Pase de temporada / Ruby Pass (Temp_Leyendas, sección "BANNERS DE TEMPORADA DE LEYENDAS") | Sí | Agregar sección/tab Marcos de temporada |
| Inventario (`showInventorySection('banners')`, `#inv-banner-spotlight`) | Sí | Agregar tab Marcos + overlay del marco sobre el banner en el spotlight |
| Sidebar de tienda (mini preview "LEON / Nivel 1") | Sí (solo banner) | Opcional / fase posterior — overlay del marco ahí también si se quiere |
| Pill de perfil menú principal | Sí (solo banner) | Opcional / fase posterior |

**Importante:** el `overflow: visible` (para que el marco sobresalga) HOY solo existe en el inventario. Si se quiere que sobresalga también en tienda/VIP/temporada/sidebar/menú, hay que replicar el mismo patrón (contenedor hermano fuera del área con scroll/overflow) en cada uno — es trabajo aparte, no asumir que ya funciona ahí.

---

## 3. Rename de raíz: "Banners" → "Diseño de Perfil"

Esto se hace ANTES o EN PARALELO a agregar Marcos, pero como cambio de raíz aparte (ids incluidos). Afecta:

- Nombre de sección/label visible en UI: "BANNERS" / "ESTANDARTE" → "DISEÑO DE PERFIL" (con sub-tabs Banners/Marcos).
- IDs de sección internos en código (ej. `showInventorySection('banners')` → probablemente pasa a `showInventorySection('perfil')` con un sub-estado de tab activo, o se mantiene `'banners'`/`'marcos'` como dos secciones hermanas — **a decidir con Cursor mirando el código real**, lo importante es que quede consistente de raíz, no una mezcla de nombres viejos y nuevos a medias).
- Los prefijos de ID de los ASSETS (`Banner_...`) se mantienen para banners (no romper saves existentes: `localStorage['banner_' + id]`, `equippedBanner`). Los marcos usan su propio prefijo `Frame_...` y sus propias keys (`frame_` + id, `equippedFrame`) — **no reusar ni mezclar las keys de banners para marcos.**

---

## 4. Estructura de datos para Marcos — PARAMETRIZADA, no duplicada

**No copiar cada función de Banners con otro nombre.** En vez de `getAllFrameCatalog()`, `ownsFrame()`, `equipFrame()`, etc. como funciones aparte, extender las funciones existentes para que acepten un parámetro `type` (`'banner'` | `'frame'`):

| Función actual (solo banner) | Cómo queda (genérica) |
|---|---|
| `getAllBannerCatalog()` | `getAllCosmeticCatalog(type)` — `type='banner'` reemplaza el uso actual, `type='frame'` es lo nuevo |
| `ownsBanner(banner)` | `ownsCosmetic(item, type)` |
| `findBannerById(id)` | `findCosmeticById(id, type)` |
| `equipBanner(id)` | `equipCosmetic(id, type)` |
| `localStorage: 'banner_' + id` | `localStorage: 'cosmetic_' + type + '_' + id` — **OJO:** para banners existentes hay que decidir si se migra la key vieja `'banner_' + id` a la nueva, o si banner sigue usando su key vieja por compatibilidad y SOLO frame usa el esquema nuevo. Recomendado: banner mantiene su key vieja tal cual (cero riesgo de romper saves), frame usa `'cosmetic_frame_' + id` desde cero. No migrar lo que ya funciona. |
| `localStorage: 'equippedBanner'` | se queda igual para banner; frame usa `'equippedFrame'` nueva, independiente |
| `renderInventoryProfileBanner(equipped)` | se actualiza para pintar el marco ENCIMA del banner (capa adicional, misma función extendida, no una función aparte) |

Datos base: `BANNERS_DATA` se queda igual (no tocar, ya funciona). Se agrega `FRAMES_DATA` como su propio array — el dato SÍ está separado por tipo (son catálogos distintos), lo que se parametriza es la LÓGICA que opera sobre ellos, no el contenido.

Campos esperados por cada item en `FRAMES_DATA` (mínimo, espejo de banner): `id`, `nombre`, `rarity`, `activeCategory` (`tienda_normal` / `tienda_vip` / `temporada` / `passOnly`), `precio`/costo si aplica, `imagen` (ruta al PNG transparente).

---

## 5. Estructura de carpetas de assets

Regla general: **por cada carpeta donde hoy existan banners, crear una carpeta hermana "Marcos"** con la misma organización. Ejemplos concretos ya identificados por el usuario (Cursor debe detectar el resto del mismo modo, buscando todas las carpetas de banners existentes):

- `assets/Imagenes/` (donde estén los banners de tienda normal) → agregar `assets/Imagenes/Marcos/`
- `assets/Imagenes/Temporadas/Temp_Leyendas/` → agregar `assets/Imagenes/Temporadas/Temp_Leyendas/Marcos/`
- Aplicar el mismo patrón a cualquier otra carpeta de temporada o de VIP que tenga banners (Cursor debe listar el árbol de `assets/Imagenes/` primero y proponer la lista completa antes de crear carpetas).

**Archivo existente a reubicar:**
`assets/Imagenes/Temporadas/marco_leyendas_perla.png` (está suelto en `Temporadas/`) → mover a
`assets/Imagenes/Temporadas/Temp_Leyendas/Marcos/marco_leyendas_perla.png`

**Placeholders:** en cada carpeta "Marcos" nueva que se cree, generar (o dejar espacio con naming claro para reemplazar después) **3-4 placeholders** de marco (no 10 — son varias carpetas, 10 por cada una es mucho volumen de relleno para algo que se va a reemplazar de todos modos), mismo criterio que los placeholders normales que ya existen para banners/skins en el proyecto (naming tipo `Marco_Placeholder_01.png` ... `Marco_Placeholder_04.png`), como PNG transparente simple (silueta básica), no arte final.

---

## 6. Gotchas / cosas que NO se deben repetir

1. **El bug de `getAllBannerCatalog()`** (sección 0): al construir `getAllFrameCatalog()`, si hay `FRAMES_CATALOG_CONFIG` con items, ASEGURARSE de igual sumar los marcos `passOnly` que vivan solo en `FRAMES_DATA` (temporada/pase) y no en el config. No repetir el mismo error.
2. **`.inv-main` tiene `overflow-y: auto`**, lo que clip-ea cualquier cosa que quiera sobresalir. El marco en inventario debe vivir dentro de `#inv-banner-spotlight` (ya tiene `overflow: visible`), NUNCA directo dentro del grid con scroll.
3. **Mobile:** hay una media query (`@media (max-width: 760px), (max-height: 430px)`) que le pone `overflow: hidden !important` a todo `#inventoryPanel`. En mobile el marco NO va a poder sobresalir aunque el spotlight tenga overflow visible — es una limitación conocida, no un bug nuevo.
4. **No tocar los banners "todo en uno" existentes** (Exclusivo de Leyendas, Rosáceo de Leyendas, etc.) — se quedan tal cual, no se dividen en banner+marco.
5. **No perder compatibilidad con saves existentes** de jugadores: `equippedBanner` y las keys `banner_*` deben seguir funcionando exactamente igual que hoy.

---

## 7. Fases sugeridas para dividir el trabajo en prompts separados

No pedirle todo esto a Cursor en un solo prompt. Orden actualizado: **primero validar que el combo se vea bien con UN solo asset, antes de construir infraestructura para docenas de assets que capaz ni combinan bien.** El rename se movió al final porque es puramente cosmético y no bloquea nada — mejor decidir cómo debe verse el selector Banners/Marcos una vez que Marcos ya existe de verdad.

**Prompt 1 — Prueba de combo visual (sin infraestructura nueva)**
Overlay temporal/hardcodeado de `marco_leyendas_perla.png` encima del banner actualmente equipado, SOLO dentro de `#inv-banner-spotlight` (que ya tiene overflow visible). Sin `FRAMES_DATA`, sin carpetas nuevas, sin tabs, sin storage — es un experimento visual desechable para confirmar que un marco encima de un banner real se ve bien (no tapa texto, no choca de color, el sobresaliente no estorba). Si no se ve bien, se ajusta el diseño ANTES de construir todo lo demás.

**Prompt 2 — Capa de datos parametrizada**
Extender las funciones existentes de Banners para aceptar `type` (`'banner'`/`'frame'`) en vez de duplicarlas — `getAllCosmeticCatalog(type)`, `ownsCosmetic()`, `findCosmeticById()`, `equipCosmetic()`. Agregar `FRAMES_DATA` como catálogo nuevo. Sin UI todavía, solo la lógica. Referenciar sección 4 y 6 de este doc (ojo con el bug de `passOnly` ya conocido).

**Prompt 3 — Carpetas y assets**
Crear las carpetas "Marcos" hermanas donde corresponda, mover `marco_leyendas_perla.png` a su nueva ubicación, generar los placeholders mínimos (3-4 por carpeta nueva). Referenciar sección 5.

**Prompt 4 — Render/UI de Marcos en cada lugar**
Conectar Prompt 2 (datos) + Prompt 3 (assets): pintar el grid de Marcos en tienda normal, tienda VIP, temporada e inventario, con tabs Banners/Marcos en cada uno. Overlay del marco sobre el banner en `#inv-banner-spotlight` (ahora con datos reales, ya no hardcodeado como en Prompt 1).

**Prompt 5 — Rename cosmético "Banners" → "Diseño de Perfil"**
Solo el texto visible ("BANNERS" → "DISEÑO DE PERFIL"), sin tocar IDs internos de sección ni referencias en el código. Va de último porque no bloquea nada y ya se va a ver con Marcos funcionando de verdad al lado.

**Prompt 6 (opcional, después) — Extender overflow visible a otros lugares**
Replicar el patrón "contenedor hermano fuera del scroll" en sidebar de tienda y pill de menú principal, para que el marco también sobresalga ahí (hoy solo funciona en inventario).

---

## 8. Estado actual (para no repetir trabajo)

✅ Ya hecho:
- Fix de `getAllBannerCatalog()` para incluir banners `passOnly`.
- `#inv-banner-spotlight` con `overflow: visible`, fuera de `.inv-main`, solo para el banner de perfil del inventario. **Este contenedor ahora vive FUERA del scroll a propósito — si en el inventario ves el banner de perfil "fijo" arriba mientras el resto de la lista se desliza por debajo, eso es el comportamiento correcto, no un bug.**
- Fix de scroll: `mask-image` / `-webkit-mask-image` en `.inv-main` (gradiente de 28px) para que las tarjetas se desvanezcan suavemente al hacer scroll bajo el banner de perfil, en vez de cortarse feo.
- PNG de marco transparente de prueba: `marco_leyendas_perla.png` (con canal alfa real, confirmado), vive hoy en `assets/Imagenes/Temporadas/marco_leyendas_perla.png` (ubicación temporal, todavía no movida a su carpeta definitiva).
- **Prompt 1 completo:** se probó un `<img>` hardcodeado del marco superpuesto al banner en `#inv-banner-spotlight`, se confirmó visualmente que el efecto de "sobresalir" funciona bien. Ese `<img>` de prueba ya fue ELIMINADO (limpieza aplicada).
- **Prompt 2 completo:** capa de datos genérica agregada a `shop.js`:
  - `FRAMES_DATA` (array vacío por ahora).
  - `getAllCosmeticCatalog(type)`, `findCosmeticById(id, type)`, `ownsCosmetic(item, type)`, `equipCosmetic(id, type)` — funciones genéricas parametrizadas por `type` (`'banner'` | `'frame'`).
  - `getAllBannerCatalog()` y `findBannerById()` ahora son wrappers de las genéricas (delegan con `type='banner'`). `ownsBanner()` y `equipBanner()` se dejaron INTACTAS (tienen lógica propia de UI/storage específica que no vale la pena forzar a compartir).
  - El fix del bug de `passOnly` está copiado literal dentro del branch `type==='banner'` de `getAllCosmeticCatalog()` — no depende de una abstracción compartida con frames.
  - Storage para frames (nuevo, independiente de banners): `localStorage['cosmetic_frame_' + id]`, `localStorage['equippedFrame']`.
  - Verificado en el juego: banners de inventario y de tienda/temporada siguen funcionando igual que antes, sin errores de consola.

❌ Todavía no existe nada de esto:
- Ningún item real dentro de `FRAMES_DATA` (está vacío).
- `renderInventoryProfileBanner()` todavía NO lee ni pinta ningún marco real (el `<img>` de prueba ya se quitó, y no se conectó a `findCosmeticById('equippedFrame', 'frame')` todavía — sigue siendo el `equipCosmetic`/`FRAMES_DATA` sin usar en ningún render).
- Ninguna carpeta "Marcos" creada (Prompt 3, pendiente).
- Ningún tab/selector Banners↔Marcos en ninguna UI (Prompt 4, pendiente).
- Rename de "Banners" a "Diseño de Perfil" no aplicado (Prompt 5, pendiente, va de último).
- Overflow visible en tienda/VIP/temporada/sidebar/menú (Prompt 6, pendiente — solo existe en inventario).

## 9. Próximo paso inmediato (a medio camino, sin terminar)

Se estaba a punto de pedir un ajuste chico (parte del Prompt 4, adelantado): conectar `renderInventoryProfileBanner()` para que pinte el marco EQUIPADO de verdad usando `findCosmeticById(localStorage.getItem('equippedFrame'), 'frame')`, en vez de nada — para validar que la capa de datos del Prompt 2 funciona con un dato real (sin construir aún carpetas ni tabs). Para probarlo hace falta primero meter al menos 1 item real dentro de `FRAMES_DATA` apuntando al PNG existente (en su ubicación actual, sin mover nada todavía — eso es el Prompt 3).

## 10. Ideas futuras (anotadas, no priorizadas todavía)

- **Fondo dinámico en la tarjeta de skin equipada (sección "DAXOR" del inventario):** pintar el fondo de esa tarjeta con el banner actualmente equipado (en vez de un fondo fijo oscuro). Es una idea de diseño nueva, separada del sistema de Marcos — no se ha empezado, no está en las fases 1-6 del plan.
