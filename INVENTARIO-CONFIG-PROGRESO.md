# THE GEM — Inventario a `GEM_CONFIG` · Seguimiento de progreso

> Handoff entre sesiones de chat. Cada vez que abras un chat nuevo, sube este MD +
> `index.html`, `shop.js`, `textgemconfig.js` (y `style.css` si aplica) y di:
> **"Sigamos con la parte #X de mover el inventario a los configs, aquí está el MD de progreso"**.

## Qué es esto (y qué NO es)
El inventario (`INVENTARIO-REDISENO-PROGRESO.md`) ya está terminado visualmente. Este
documento trackea un trabajo **distinto y posterior**: mover lo que hoy está hardcodeado
en `shop.js`/`index.html` hacia `textgemconfig.js` (`GEM_CONFIG`), para que se pueda
editar **sin tocar código**, igual que ya funciona con Menú, Estadísticas, Opciones,
sidebar de Tienda, etc.

**Alcance decidido con Felipe (no volver a preguntar):**
- Editable: **texto** (contenido de las etiquetas), **color de texto**, **tamaño de texto**.
- NO editable por config (por ahora, decisión explícita): tamaños/paddings/gaps de layout,
  posiciones, dimensiones de cards/grids — eso se queda hardcodeado en `style.css` como
  ya estaba. Si más adelante se quiere mover a `GEM_LAYOUT` (`layoutconfig.js`), es un
  trabajo aparte que hay que pedir explícitamente.
- Se hace **por partes** (una sección del inventario a la vez), tantas partes como haga falta.

## Mecanismo (ya existía para el resto del juego, se reutiliza tal cual)
1. **Contenido de texto** → `GEM_CONFIG.textos.tienda.inventario.*` (nuevo bloque, junto a
   `tienda.skins`, `tienda.banners`, etc. que ya existían). Se aplica con la función
   `set(id, texto)` dentro de `applyTextos()` en `textgemconfig.js`.
2. **Color y tamaño de texto** → `GEM_CONFIG.estilosTexto['algun-id']`. Ya existía el
   mecanismo para `color` y `fuente`; se le agregó soporte para **`tamano`** (font-size,
   ej `'14px'`) porque Felipe lo pidió explícitamente para el inventario. Es retrocompatible:
   las entradas viejas sin `tamano` simplemente no tocan el tamaño de fuente.
   - Estos IDs están comentados por defecto en `estilosTexto` (mismo patrón que el resto
     del archivo) — para personalizar uno, descoméntalo y pon el valor.
3. Cualquier id que se quiera hacer editable por color/tamaño necesita **existir en el HTML**
   con ese `id` exacto. Si un elemento no tenía id (ej. el ícono de la flecha de volver),
   se le agregó uno nuevo.

## Estado de cada parte

| # | Parte | Estado | Notas |
|---|---|---|---|
| 1 | **Topnav** (marca, pills de categoría, flecha volver) | ✅ Hecho | Ver detalle abajo |
| 2 | **Hero** (skin equipada, barras SKINS/TRAILS/TOTAL) | ✅ Hecho | Ver detalle abajo |
| 3 | **Filtros / título de sección** (chips de rareza, plantillas de título) | ✅ Hecho | Ver detalle abajo |
| 4 | **Skins** (cards: tooltip, rareza) | ✅ Hecho | Ver detalle abajo — combinada con Emotes |
| 5 | **Trails** (cards + carrusel) | ✅ Hecho | Ver detalle abajo |
| 6 | **Banners** (cards + preview de perfil) | ✅ Hecho | Hecha junto con Trails, ambas eran rápidas |
| 7 | **Emotes** (cards) | ✅ Hecho | Hecha junto con Skins (Parte 4), son casi idénticas |
| 8 | **Potenciadores** (cards + chips de categoría) | ✅ Hecho | Ver detalle abajo |
| 9 | **Cofres** (cards) | ✅ Hecho | Hecha junto con Potenciadores, ambas eran rápidas |

**Las 9 partes están completas.** Si más adelante Felipe quiere mover tamaños/paddings/gaps
a `GEM_LAYOUT` (`layoutconfig.js`), eso es un trabajo nuevo y aparte — hay que pedirlo
explícitamente, no está incluido en este checklist.

## Qué se hizo en la Parte 1 (Topnav)

**`textgemconfig.js`**
- Nuevo bloque `GEM_CONFIG.textos.tienda.inventario.topnav` con: `brandTitle` ("INVENTARIO"),
  `brandSub` ("THE GEM"), y `pillSkins`/`pillTrails`/`pillBanners`/`pillEmotes`/`pillPowerups`/`pillCofres`
  (el texto de cada pill de categoría).
- `applyTextos()` ahora tiene un bloque que lee ese objeto y aplica los textos vía `set(id, texto)`
  a: `inv-brand-title`, `inv-brand-sub`, `inv-nav-skins`, `inv-nav-trails`, `inv-nav-banners`,
  `inv-nav-emotes`, `inv-nav-powerups`, `inv-nav-cofres`.
- `estilosTexto` (comentado, listo para descomentar) tiene entradas para esos mismos 8 ids
  más `inv-back-btn-icon`, con `{ color, fuente, tamano }`.
- `aplicarEstilosTexto()` se extendió para aplicar `cfg.tamano` como `font-size` (antes solo
  aplicaba `color` y `fuente`). Este cambio es global — cualquier otro id que use `estilosTexto`
  en el resto del juego ahora también puede usar `tamano` si se quiere, aunque no era el pedido.

**`index.html`**
- La flecha de volver del inventario (`←`) ahora está envuelta en `<span id="inv-back-btn-icon">`
  para poder cambiarle color/tamaño desde `estilosTexto` (antes no tenía id propio).
- No se tocó nada más de la estructura.

**`shop.js`**
- No se tocó nada (el topnav es HTML estático, no lo pinta `shop.js`).

## Qué se hizo en la Parte 2 (Hero)

**`textgemconfig.js`**
- Nuevo bloque `GEM_CONFIG.textos.tienda.inventario.hero` con: `labelEquipada` ("SKIN EQUIPADA"),
  `labelLegendario` ("LEGENDARIO"), `labelSkins`/`labelTrails`/`labelTotal` (etiquetas bajo cada
  barra de progreso). El **nombre de la skin equipada** y su **rareza real** (cuando no es trofeo)
  siguen viniendo de `SKINS_DATA` — son datos del catálogo, no texto de UI, mismo criterio que
  siempre se ha usado en este proyecto.
- `estilosTexto` (comentado) tiene entradas nuevas para: `inv-equip-label`, `inv-equip-rarity`,
  `inv-p-lbl-skins`, `inv-p-num-skins`, `inv-p-lbl-trails`, `inv-p-num-trails`, `inv-p-lbl-total`,
  `inv-p-num-total`.

**`shop.js`**
- `renderInventoryHero()` ahora lee `shopTextos('inventario').hero` (con `??` de respaldo al
  texto original, por si `GEM_CONFIG` no cargó) en vez de tener los strings quemados.
- Se agregaron `id`s a los elementos generados: `inv-equip-label`, `inv-equip-rarity`,
  `inv-p-num-skins`/`inv-p-lbl-skins`, `inv-p-num-trails`/`inv-p-lbl-trails`,
  `inv-p-num-total`/`inv-p-lbl-total` (las clases CSS existentes no se tocaron, los ids son
  adicionales solo para engancharse a `estilosTexto`).
- **Detalle importante:** el hero se regenera con `innerHTML` cada vez que cambias de pestaña
  (`showInventorySection()`), así que los ids son nuevos en el DOM cada vez. Se agregó una
  llamada a `window.aplicarEstilosTexto()` justo después de insertar el hero, para que el
  color/tamaño configurado se re-aplique sobre los ids recién creados. Este mismo patrón
  (re-llamar `aplicarEstilosTexto()` tras un `innerHTML` dinámico) es el que hay que repetir
  en las próximas partes para cualquier texto que shop.js regenere dinámicamente.

## Qué se hizo en la Parte 3 (Filtros / título de sección)

**`textgemconfig.js`**
- Nuevo bloque `GEM_CONFIG.textos.tienda.inventario.filtros`: `chipTodas` ("TODAS"),
  `chipInicial` ("INICIAL" — rareza DEFAULT de banners), `chipBasico` ("BÁSICO" — rareza
  BASICO de banners). Los demás nombres de rareza (ESPECIAL, EPICA, DEMON, VIP) no se
  tocaron porque ya se muestran tal cual vienen de los datos, no tienen "traducción" especial.
- Nuevo bloque `GEM_CONFIG.textos.tienda.inventario.titulos` con una plantilla `{n}` por
  sección: `skinsTemplate`, `trailsTemplate`, `bannersTemplate`, `emotesTemplate`,
  `powerupsTemplate`, `cofresTemplate`. `{n}` se reemplaza por la cantidad de items.
- `estilosTexto` (comentado): se agregó `inv-section-title` (color/fuente/tamano) — este
  elemento **no se recrea** en cada render (solo se le cambia el `textContent`), así que
  no necesitó ningún ajuste especial en `shop.js` para que el estilo se mantenga.

**`shop.js`**
- `invRenderRarityFilters()` e `invRenderPowerupFilters()` ahora leen
  `shopTextos('inventario').filtros` para las etiquetas "TODAS"/"INICIAL"/"BÁSICO"
  (con `??` de respaldo al texto original).
- Los 6 `titleEl.textContent = ...` de `showInventorySection()` (skins/trails/banners/
  emotes/powerups/cofres) ahora arman el texto con `.replace('{n}', ...)` sobre la
  plantilla de `shopTextos('inventario').titulos`, en vez de tener el string quemado.
- No se tocaron los mensajes de "estado vacío" (ej. "NO TIENES TRAILS EN ESTA CATEGORÍA")
  ni los textos específicos de cada card — esos quedan para la parte de cada sección
  (Partes 4-9), porque van de la mano con el resto del contenido de esa sección.

## Qué se hizo en la Parte 4 (Skins + Emotes)

Felipe dio luz verde para combinar partes cuando tenga sentido. Skins y Emotes usan
literalmente la misma estructura de card (`.inv-item-card`), así que se hicieron juntas.

**`textgemconfig.js`**
- Nuevo bloque `GEM_CONFIG.textos.tienda.inventario.skins`: `tooltipEquipada` ("Equipada"),
  `tooltipClickEquipar` ("Click para equipar") — son el `title=""` que aparece al pasar el
  mouse sobre una skin.
- Nuevo bloque `GEM_CONFIG.textos.tienda.inventario.emotes`: `tooltipEquipado` ("Equipado"),
  `tooltipClickEquipar` ("Click para equipar"), `emptyState` ("NO TIENES EMOTES{br}EN ESTA
  CATEGORÍA" — `{br}` se reemplaza por un salto de línea, mismo patrón `{n}` que en titulos).
- El label **"LEGENDARIO"** de las skins-trofeo ya no está repetido: la card de skins ahora
  reutiliza `GEM_CONFIG.textos.tienda.inventario.hero.labelLegendario` (el mismo que ya
  existía desde la Parte 2), para que si lo cambias una vez, cambie en los dos lugares.
- `estilosTexto` (comentado): se agregó `inv-empty-emotes` (color/fuente/tamano) para el
  mensaje de "sin emotes en esta categoría".
- **No se tocó** Banners en este paso (`renderInventoryBannerCard` sigue con su rareza
  especial VIP/INICIAL/BÁSICO hardcodeada) — queda para la Parte 6 dedicada, porque su
  card es distinta (rectangular, con portada) y tiene más texto propio.

**`shop.js`**
- `renderInventorySkinCard()` y `renderInventoryEmoteCard()` ahora leen sus tooltips desde
  `shopTextos('inventario').skins` / `.emotes` (con `??` de respaldo).
- El branch `emotes` de `showInventorySection()` arma el mensaje de estado vacío desde
  `shopTextos('inventario').emotes.emptyState`, le puso `id="inv-empty-emotes"` y llama
  `aplicarEstilosTexto()` justo después (mismo patrón de la Parte 2, porque ese div también
  se recrea en cada render).

## Qué se hizo en las Partes 5 y 6 (Trails y Banners)

Igual que la vez pasada: se revisó si tenía sentido combinar y sí — ninguna de las dos
era tan grande como para necesitar su propia sesión completa.

**`textgemconfig.js`**
- Nuevo bloque `GEM_CONFIG.textos.tienda.inventario.trails`: `emptyState` ("NO TIENES
  TRAILS{br}EN ESTA CATEGORÍA"), `labelCompleto` ("★ COMPLETO" — cuando ya tienes todos
  los colores de un trail), `labelEquipadoPrefix` ("✔ EQUIPADO · " — antes del nombre del
  color equipado). Los tooltips de los swatches de color ("(equipado)"/"(no tienes)") **no**
  se movieron — son `title=""` de un elemento chiquito repetido muchas veces, no aportaba
  moverlos a config.
- Nuevo bloque `GEM_CONFIG.textos.tienda.inventario.banners`: `tooltipEquipado`,
  `tooltipClickEquipar`, `labelBannerEquipado` ("BANNER EQUIPADO" — el kicker sobre el
  preview de perfil), `fallbackNombreJugador` ("Jugador"), `fallbackNombreBanner` ("Banner").
- **Reutilización en vez de duplicar:** la card de banner en el inventario ya no tiene su
  propio "VIP / PASE RUBY" hardcodeado — ahora lee `GEM_CONFIG.textos.tienda.banners.labelVipPaseRuby`
  (el mismo que ya usa la tienda normal). Y "INICIAL"/"BÁSICO" reutilizan
  `inventario.filtros.chipInicial`/`chipBasico` (Parte 3), en vez de tener una tercera copia
  del mismo texto.
- `estilosTexto` (comentado): se agregó `inv-empty-trails` y `inv-profile-banner-kicker`.

**`shop.js`**
- Branch `trails` de `showInventorySection()`: el estado vacío ahora usa
  `shopTextos('inventario').trails.emptyState` con `id="inv-empty-trails"` +
  `aplicarEstilosTexto()` después (mismo patrón). "★ COMPLETO" y "✔ EQUIPADO · " del
  template de cada card también leen del config.
- `renderInventoryBannerCard()`: tooltip y rareza especial (VIP/INICIAL/BÁSICO) ahora
  vienen de config (reutilizando donde ya existía el texto en vez de duplicarlo).
- `renderInventoryProfileBanner()`: kicker y los dos fallback ("Jugador"/"Banner") ahora
  vienen de config; el kicker tiene `id="inv-profile-banner-kicker"` nuevo.
- Se agregó `aplicarEstilosTexto()` después de renderizar el contenido de `banners` (ese
  bloque también se recrea con `innerHTML` en cada render, mismo motivo que el hero).

## Qué se hizo en las Partes 8 y 9 (Potenciadores y Cofres)

Última tanda — se combinaron porque ambas eran chicas y ninguna dependía de la otra.

**`textgemconfig.js`**
- Nuevo bloque `GEM_CONFIG.textos.tienda.inventario.powerups`: `unavailable` ("POTENCIADORES{br}NO
  DISPONIBLES" — cuando `powerups.js` no cargó), `emptyState` ("NO TIENES POTENCIADORES{br}EN
  ESTA CATEGORÍA"), `labelNivel` ("NIVEL {n}" — plantilla), `labelBloqueado` ("BLOQUEADO").
  Las etiquetas "W"/"E" de los slots equipados **no** se movieron — son abreviaturas fijas de
  teclado, no "texto de UI" editable con sentido real.
- Nuevo bloque `GEM_CONFIG.textos.tienda.inventario.cofres`: `emptyState` ("NO TIENES COFRES{br}GUARDADOS"),
  `botonAbrir` ("ABRIR").
- `estilosTexto` (comentado): se agregaron `inv-powerups-unavailable`, `inv-empty-powerups`,
  `inv-empty-cofres`.

**`shop.js`**
- Branch `powerups`: los dos estados especiales (POWERUPS_DATA no disponible / categoría vacía)
  ahora leen de config, cada uno con su id (`inv-powerups-unavailable` / `inv-empty-powerups`)
  + `aplicarEstilosTexto()` después, mismo patrón de siempre.
- `renderInventoryPowerupCard()`: "NIVEL N" y "BLOQUEADO" ahora vienen de config.
- Branch `cofres`: estado vacío con `id="inv-empty-cofres"` + `aplicarEstilosTexto()`.
- `renderInventoryChestCard()`: el botón "ABRIR" ahora viene de config.

## Checklist completo — qué quedó SIN mover a config (a propósito)
Por si en el futuro alguien se pregunta por qué algo del inventario sigue hardcodeado:
- Nombres/rarezas/descripciones de cada skin, trail, banner, emote, potenciador o cofre
  individual → siguen en sus arreglos de datos (`SKINS_DATA`, `TRAILS_DATA`, etc.), igual
  que en la tienda normal. Son catálogo del juego, no texto de UI.
- Tooltips de los swatches de color de trails ("(equipado)"/"(no tienes)") y las etiquetas
  "W"/"E" de slots de potenciadores → son detalles fijos de interacción, no aportaba
  hacerlos editables.
- Cualquier tamaño, padding, gap, posición o dimensión → sigue en `style.css` tal cual
  (decisión explícita desde el inicio, ver arriba). Si se quiere mover a `GEM_LAYOUT`, es
  un pedido nuevo y aparte.

## Cómo pedir la siguiente parte
Ejemplo de mensaje para el chat nuevo:

> "Sigamos con la parte 2 (HERO) de mover el inventario a los configs. Aquí está el MD
> de progreso y los archivos actuales (index.html, shop.js, textgemconfig.js)."

La IA nueva debería:
1. Leer este MD para entender el alcance (solo texto/color/tamaño, nada de layout) y el mecanismo.
2. Buscar en `shop.js` los textos hardcodeados de esa sección (ej. `renderInventoryHero` para
   la Parte 2 — "SKIN EQUIPADA", "SKINS", "TRAILS", "TOTAL", "LEGENDARIO").
3. Mover esos strings a `GEM_CONFIG.textos.tienda.inventario.<seccion>`, hacer que `shop.js`
   los lea de ahí en vez de tenerlos hardcodeados en el template literal.
4. Si el elemento no tiene id propio en el HTML/template que genera `shop.js`, agregarle uno
   para poder engancharlo también a `estilosTexto` (color/tamaño).
5. Actualizar la tabla de estado de este MD y devolverlo junto con los archivos.

## Recordatorio
- Guarda la versión más reciente de `index.html`, `shop.js` y `textgemconfig.js` después de
  cada parte — son los que subes la próxima vez, no los originales.
- Este MD es independiente de `INVENTARIO-REDISENO-PROGRESO.md` (ese ya está cerrado).
