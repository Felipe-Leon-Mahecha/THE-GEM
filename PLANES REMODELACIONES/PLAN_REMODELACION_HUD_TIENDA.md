# PLAN — Remodelación Visual Tienda (Kit de Decoraciones HUD)

Solo remodelación visual. Cero lógica nueva.

## 📎 Protocolo de handoff (leer primero si sos otra IA continuando este trabajo)

Este documento se puede pasar a otra sesión/IA sin perder contexto. Reglas:

1. **No repetir trabajo ya hecho.** Revisá la tabla de estado de piezas abajo antes de proponer nada — si una pieza dice "✅ Confirmada" o "✏️ Corrección aplicada", no se rediseña, se usa tal cual.
2. **Regla de oro del proyecto:** cero emojis como decoración final en el juego. Todo ícono decorativo (candados, relojes, cajas, tachas de cerrar, etc.) se dibuja en CSS/SVG puro. Los íconos de ítems reales (skins, monedas) siguen siendo sprites/imágenes del juego — eso no cambia.
3. **Convención de código:** namespace `.hud-*` en `style.css` para todo lo de este kit (no pisa nada existente). Color dinámico vía `--cfg-hud-accent` (hereda `var(--color-cian)` por defecto, o `var(--inv-rarity-color)` en cards de ítems con rareza — esa variable ya existe en el proyecto y la usa el sistema de inventario).
4. **Al final de cada fase, decí explícitamente qué archivos necesita subir Felix para la fase siguiente** (ver tabla de abajo). No asumas que los tenés — pedilos.

### Qué subir en cada fase

| Fase | Archivos que Felix debe subir |
|------|-------------------------------|
| Fase 1 (piezas base → código) | `style.css` actual del proyecto |
| Fase 2 (pantalla piloto) | 1. Captura de la pantalla a remodelar (Hero + bundles) · 2. `style.css` con el Kit ya integrado (salida de Fase 1) · 3. El HTML donde vive esa pantalla (ej. el bloque de `#shopPanel` / `#vipPanel` en `index.html`) |
| Fase 3 (Ruby Pass desde cero) | 1. Captura del Ruby Pass actual (el círculo) · 2. Las secciones de `style.css` relacionadas a `.ruby-pass-*` / `.rank-*` (ya identificadas: líneas ~1263, ~4524-4952, ~6233 del `style.css` original) · 3. Referencias visuales que le gusten a Felix (ej. capturas de Free Fire u otros) |
| Fase 4 (Regalo diario desde cero) | 1. Captura del panel de regalo diario actual · 2. Sección de `style.css` correspondiente |
| Fase 5 (Rollout al resto) | 1. Capturas de cada pantalla restante (skins, trails, banners, emotes, cofres, temporadas) · 2. `style.css` actualizado hasta ese punto |

**Formato general por parte, para no perder tiempo:** imagen de la pantalla + `style.css` (o el fragmento relevante) + kit de herramientas (`gem_decor_kit.html` y `gem_decor_kit_part2.html`, piezas 01-22) cuando haga falta recordar cómo se ve cada pieza.

## Estado de las 22 piezas

### ✅ Confirmadas, listas para implementar en `style.css`
| # | Pieza | Uso confirmado |
|---|-------|-----------------|
| 01 | Marco de esquinas | Botones y contenedores en general |
| 02 | Tag angular ◀ ▶ | Etiquetas sueltas |
| 03 | Socket hexagonal/octogonal | Solo botones de sistema (sonido, monedas infinitas, opciones) |
| 04 | Panel esquina cortada | Superficie base tranquila (soporta otras piezas encima) |
| 05 | Barra con muescas | Headers de sección dentro de un panel |
| 06 | Divisor con nodo | Separador entre bloques |
| 08 | Bandera de esquina | Rareza en cards |
| 11 | Bandera dorada VIP + variante NEW | Reemplaza texto flotante de rareza |
| 14 | Pills de filtro | Tabs de categoría (potenciadores, etc.) |
| 15 | Chip de precio | Rubíes/monedas en cualquier card |
| 16 | Badge de temporizador | Ofertas/temporadas con expiración |
| 17 | Overlay de bloqueado | Items/tiers no disponibles |
| 19 | Badge de nivel/rango | Estandarte, leaderboard |
| 20 | Punto de notificación | Avisos pulsantes |
| 21 | Header con ornamento | Títulos de bloque grandes |
| 22 | Marco de modal | Popups de confirmación |

### 🤔 Sin uso claro todavía / baja prioridad
| # | Pieza | Nota |
|---|-------|------|
| 07 | Riel vertical | Puramente decorativo, no arrastrable. Se usa si aparece una necesidad real de separar columnas |
| 09 | Marco circular | Sin avatares en el juego, queda en espera por si se usa para retrato del estandarte |

### 🔨 A diseñar desde cero (no usar lo generado, solo referencia)
| # | Pieza | Por qué se descarta la versión actual |
|---|-------|----------------------------------------|
| 12 | Progreso Ruby Pass | El círculo no convenció. Objetivo: una barra de progreso que NO se sienta genérica gracias a la decoración (referencia: Free Fire — sigue siendo una línea, pero no se ve como una progress bar de tutorial) |
| 18 | Regalo diario | Funciona pero se ve saturado visualmente. Objetivo: simplificar sin perder la sensación de recompensa |

### ✏️ Correcciones ya aplicadas al kit
- **13** Flechas de carrusel → ahora son rombos, no chevrons
- **17** Candado → dibujado en CSS puro (sin emoji)
- **16** Reloj → dibujado en CSS puro (sin emoji)
- **19** Borde del hexágono → corregido el bug de `border + clip-path` (quedaba desparejo en los vértices), ahora usa doble capa para un contorno uniforme

**Regla general de acá en adelante:** ningún emoji como decoración final. Los que aparecían eran placeholders rápidos — todo ícono decorativo se dibuja en CSS/SVG. Los íconos de ítems reales (skins, monedas, etc.) siguen siendo tus imágenes/sprites de siempre, eso no cambia.

---

## Fases de trabajo

### Fase 1 — Piezas base al código (la más mecánica, arrancamos por acá)
Llevar las 16 piezas confirmadas a `style.css` como clases reutilizables + variables en `layoutconfig.js`/`config.js` (tamaños, grosores) siguiendo tu convención `--cfg-`. Conectar el color con `RARITY_COLORS` para que hereden solas. Sin tocar ninguna pantalla todavía, solo dejar el "kit" viviendo en el proyecto real.

### Fase 2 — Aplicar a una pantalla piloto
Elegir UNA pantalla (candidata: el Hero + cards de bundles, porque ya tenés piezas confirmadas para ambas: 01/04/05/08/11/21) y remodelarla completa con las piezas de Fase 1. Sirve como prueba de que el sistema funciona antes de replicarlo en todo.

### Fase 3 — Diseño desde cero: Ruby Pass (pieza 12)
Sesión de exploración dedicada, varias variantes de línea de progreso no-genérica antes de picar código.

### Fase 4 — Diseño desde cero: Regalo Diario (pieza 18)
Simplificar el panel actual, misma lógica de "explorar variantes antes de programar".

### Fase 5 — Rollout al resto de pantallas
Aplicar el sistema ya completo (piezas base + Ruby Pass nuevo + regalo diario nuevo) al resto de la tienda: skins, trails, banners, emotes, cofres, temporadas.

---

## Progreso

### ✅ Fase 1 — COMPLETADA
Las 16 piezas confirmadas (01, 02, 03, 04, 05, 06, 08, 11, 14, 15, 16, 17, 19, 20, 21, 22) ya están
en `style.css` como clases `.hud-*`, agregadas al final del archivo bajo el comentario
`KIT DE DECORACIONES HUD — FASE 1`. Todas sin emojis, con el bug de `border+clip-path` corregido
(hexágonos de doble capa), y con `--cfg-hud-accent` como variable de color central.

Pendiente: todavía no están aplicadas a ninguna pantalla real del HTML — eso es Fase 2.

## Siguiente paso inmediato
Arrancar **Fase 2**: aplicar el kit a una pantalla piloto (Hero + bundles). Subir la captura de esa
pantalla + el `style.css` actualizado + el bloque HTML correspondiente.

---

## 🔧 Fase 2 — Desglose de subtareas (trabajando sobre `v5.html`, el preview)

Regla de esta sección: cada subtarea se marca ✅ apenas está hecha Y confirmada por Felix visualmente.
Si dice "✏️ hecha, sin confirmar" significa que el código ya está pero falta que Felix la vea y apruebe.
No avanzar a la siguiente sub-fase (2.2, 2.3...) sin marcar la anterior.

### 2.1 — Hero: kicker "PANEL DESTACADO" con líneas (referencia imagen 2)
✏️ Hecha, sin confirmar (corregida en 2do intento). Cambios en `v5.html`:
- **Diagnóstico del error del primer intento:** el `.hud-tag` original (pieza 02, angular, ancho
  fitted-to-content) se estiraba a todo el ancho del panel porque `.hero-top` es
  `flex-direction:column` y el default `align-items:stretch` fuerza a los hijos flex a ocupar el 100%
  del ancho — pasaba aunque el tag sea `inline-flex` por dentro, porque el stretch lo decide el padre,
  no el display interno del hijo. Por eso salía como una línea arriba Y una abajo en vez del tag chico
  + una sola línea.
- **Fix:** se agregó `.hero-top .hud-tag{ align-self:flex-start; }` para que el tag vuelva a su tamaño
  natural (pastilla angular chica, pieza 02 tal cual está confirmada en el kit), y se agregó un
  elemento aparte `.hero-kicker-line` (línea sólida, 1px, ancho completo) inmediatamente debajo del
  tag — esa sí hereda el stretch del flex column porque es un bloque sin contenido, así que ocupa
  el 100% del ancho como en la referencia.
- Color sigue siendo `--cfg-hud-accent` (dorado) — NO se copió el rosa de las imágenes de referencia,
  solo el layout.
- `.hero-top` con `gap:4px` y título/descripción con `margin-top` chico para que todo quede pegado.
- **Corrección 3er intento:** el precio (`.hud-price-chip`) estaba flotando abajo a la derecha del
  panel en un `.hero-bottom` aparte, con label "Desde" arriba. Se sacó ese bloque entero y el chip de
  precio ahora es el último elemento dentro de `.hero-top` (mismo stack que tag/línea/título/descripción),
  alineado a la izquierda, con `align-self:flex-start` (mismo fix que el tag, por el stretch del
  flex-column) y `margin-top:10px` para separarlo un poco de la descripción. `.hero-bottom` se borró
  del CSS por completo, ya no se usa.
- **Corrección 4to intento (la buena) — el 3er intento estaba mal interpretado:** Felix no quería mover
  el precio, quería mover el BLOQUE DE TEXTO completo (tag + línea + título + descripción) a la esquina
  inferior izquierda del panel. Se revirtió el precio a como estaba antes del 3er intento (bloque
  `.hero-bottom` aparte, label "Desde" arriba del `.hud-price-chip`, alineado a la derecha).
  El cambio real fue en `.hero-panel`: pasó de `justify-content:space-between` a `justify-content:flex-end`,
  así que ahora TODO el contenido (texto + precio) se apila contra el borde inferior del panel — panel
  grande y vacío arriba, bloque de info abajo a la izquierda, precio abajo a la derecha justo debajo.

### 2.2 — Ruleta: animación "ábreme" (snake + brillo)
✏️ Hecha, sin confirmar. CSS agregado en `v5.html`:
- `@keyframes roulette-wiggle` (rotación tipo snake) + `@keyframes roulette-glow` (box-shadow del botón)
  + `@keyframes roulette-wheel-glow` (brillo de la rueda dibujada adentro, con `filter`).
- Clase `.roulette-btn.inviting` dispara las 3 animaciones juntas (~1.1s por ciclo).
- JS (ver 2.2b, ya integrado): loop con `setTimeout`/`setInterval` — arranca a los 3000ms de cargar
  (`INITIAL_DELAY`), se repite cada 9000ms (`REPEAT_EVERY`), y se cancela/no dispara si `dragging` es
  true o si el modal está abierto.

### 2.3 — Ruleta: modal vacío al hacer click
✏️ Hecha, sin confirmar. En `v5.html`:
- HTML: `.roulette-overlay` con `.roulette-modal` (título "RULETA", body placeholder, botón
  `.roulette-modal-close` con la X dibujada en CSS puro, sin emoji).
- JS: se distingue click de arrastre midiendo la distancia recorrida entre `pointerdown` y
  `pointerup` (`CLICK_TOLERANCE = 6px`) — si se movió menos que eso, abre el modal en vez de asumir
  que fue un drag. Cierra con click en la X o con click en el fondo oscuro (fuera de la caja).
- Sigue sin funcionalidad real adentro (a propósito, pedido explícito de Felix — por ahora solo el
  panel vacío).

### 2.4 — Aplicar a pantallas reales (`index.html` / `style.css`)
✏️ **En curso.** Ya no se trabaja sobre `v5.html`/`V6.html` (esos quedan como referencia visual
congelada) — de acá en adelante todos los cambios van directo a `style.css` y `shop.js`, porque el
panel VIP real ya se genera con JS (`renderVIPHome()` en `shop.js`) y ya usa nombres de clase propios
(`.vip-feature`, `.vip-pack-card`, `.vip-banner-row`, etc.), no hace falta HTML estático de prueba.

Formato de esta sub-fase: cada parte se numera `2.4.N`, se marca ✅ apenas Felix la confirma viendo el
juego real (no un preview), y se dice explícitamente qué archivos cambiaron. Si la sesión se corta, la
próxima IA solo tiene que seguir esta lista desde el primer ✏️ o 🔲 hacia abajo.

**2.4.1 — Hero VIP (panel destacado)** ✅ Confirmada por Felix (screenshot real).
- Archivos: `shop.js` (`renderVIPHome`, el bloque `.vip-feature`) + `style.css`.
- `.vip-feature` dejó de ser grid (imagen izq. / texto der.) y pasó a ser panel full-bleed con imagen
  de fondo + texto apilado abajo, igual que en `V6.html`: `hud-frame` + `hud-panel-cut` + `hud-tag`
  "PANEL DESTACADO" + `.hero-kicker-line` + título + descripción, y precio con label "Desde" abajo a
  la derecha (`.vip-feature-bottom` + `hud-price-chip`).
- `.vip-detail-head` (la vista de detalle) NO se tocó — compartía regla CSS con `.vip-feature` y se
  separó para no romperla.
- Acento dorado fijado con `--cfg-hud-accent:#ffd700` inline en el elemento (el kit por defecto es
  cian, `var(--color-cian)`, por eso hace falta pisarlo puntualmente en todo lo que sea VIP).
- **Bug de kit corregido de paso (beneficia a TODO lo que use el kit, no solo VIP):** `.hud-frame-c`
  (los 4 cantitos del marco) no tenía `z-index`, así que cualquier imagen de fondo puesta después en
  el HTML los tapaba. Se le agregó `z-index:2`.

**2.4.2 — Ruleta VIP (botón + animación + modal)** ✅ Confirmada por Felix (screenshot real).
- Archivos: `style.css` (sección nueva "RULETA VIP") + `shop.js`.
- Botón circular fijo `#vipRouletteBtn` (clase `.vip-roulette-btn`), creado una sola vez con
  `ensureVIPRouletteButton()` (mismo patrón que `ensureRubyPassPanel()`). Rueda dibujada en CSS puro
  (`conic-gradient`), cero emoji.
- Posición actual: `right:24px; bottom:128px` (fija, NO arrastrable en producción — el arrastre era
  solo la herramienta de prueba en `V6.html` para elegir dónde queda). Si Felix quiere otra posición,
  son 2 valores en `.vip-roulette-btn`.
- Animación "ábreme": `showVIPRoulette()` se llama al abrir la tienda (`openVIP()`) — espera 3s
  (`INITIAL_DELAY`), hace snake+glow del botón Y de la rueda de adentro (`inviting` class dispara 3
  animaciones CSS), se repite cada 9s (`REPEAT_EVERY`). `hideVIPRoulette()` se llama al cerrar la
  tienda (`closeVIP()`) y apaga los timers — no queda corriendo de fondo en otras pantallas.
- Respeta `body.reduced-motion` / `body.performance-mode` (ya existentes en el proyecto): en esos
  modos no anima, pero el botón sigue clickeable.
- Modal vacío `.vip-roulette-overlay` / `.vip-roulette-modal`, sin funcionalidad adentro (a propósito,
  pedido explícito de Felix). Marco corregido a dorado quemado (`--cfg-hud-accent:#c9922e` puesto
  directamente en `.vip-roulette-overlay`, porque el overlay cuelga de `document.body` y no hereda el
  dorado del botón) y agrandado (`620px` / `min-height:440px`, antes `440px`/`300px`) a pedido de
  Felix tras ver el primer screenshot.

**2.4.3 — Cards de paquetes (ribbon MÁS VENDIDO + notify dot)** ✅ Confirmada por Felix.

**2.4.4 — Headers de sección + banner genérico VIP** ✏️ Hecha, sin confirmar todavía.
- **Cambio de alcance respecto al plan original:** V6 tenía una fila "OFERTAS RELÁMPAGO" con
  temporizador + precio por card. Se revisó `VIP_PROMO_BANNERS` / `renderVIPPromoBanner` en el juego
  real y esa sección NO es eso — son solo 2 banners (`vip_powerups`, un widget hexagonal custom ya
  armado; y `vip_specials`, un banner genérico imagen+click) y no existe ningún sistema de oferta con
  cuenta regresiva en el proyecto (se buscó countdown/expira/flashSale, nada). Se decidió con Felix NO
  inventar un temporizador falso — en vez de eso: headers de sección + marco del kit en el banner
  genérico.
- Archivos: `shop.js` (`renderVIPHome`, `renderVIPPromoBanner`) + `style.css`.
- Se agregaron dos `.hud-header-bar` (pieza 05) con clase extra `.vip-section-title` para el margen:
  "BANNERS VIP" arriba de `.vip-banner-row` y "PAQUETES DE LA VITRINA" arriba de `.vip-package-grid`
  — mismo texto/spirit que los headers de `V6.html`.
- El banner genérico (`vip_specials`, "BANNERS VIP" → Sala Legendaria) ahora usa `hud-frame` +
  `hud-panel-cut` con las 4 puntas del marco, dorado (`--cfg-hud-accent:#ffd700`). El widget hexagonal
  de powerups (`vip_powerups`) NO se tocó, ya tenía diseño propio.
- Nota técnica: `.vip-promo-banner.hud-panel-cut { border-radius:0; }` para que no quede un
  border-radius cuadrado peleando con el clip-path del kit.

**Corrección de color (aplicada a 2.4.1-2.4.4):** el dorado usado era `#ffd700` (amarillo brillante,
inventado por la IA) en vez del `#e0b563` real de `V6.html` (dorado champagne, la única variable de
color de todo ese preview). Corregido en los 7 lugares donde se había puesto — Hero, ruleta, headers
de sección, ribbon, banner genérico. El marco "quemado" (`#c9922e`) del modal de ruleta se mantiene
tal cual, fue un pedido explícito de Felix aparte de V6.

**2.4.5 — Bandera de rareza en items de skins/trails/emotes** ✏️ Hecha, sin confirmar todavía.
- **Aviso:** esto NO sale de `V6.html` (ese preview nunca mostró esta pieza) — sale del catálogo de
  piezas ya confirmadas en Fase 1 (08 "Bandera de esquina" / 11 "Bandera dorada VIP", pensadas
  justamente para "rareza en cards"). Se aplicó tal cual dice ese catálogo.
- Archivo: `shop.js` (`renderVIPMiniItem` — las cards de skins/trails/emotes que aparecen adentro del
  detalle de un paquete VIP) + `style.css` (fix de z-index, la pieza no traía uno y quedaba tapada por
  la imagen del item).
- Usa el campo `item.rarity`/`item.rarityColor` que YA existe en la data (`GEM_RARITY_COLORS`, mismo
  sistema que usa el inventario) — no se inventó nada nuevo. Si `rarity === 'VIP'` usa la bandera
  dorada con brillo animado (pieza 11); cualquier otra rareza usa la bandera simple con el color de esa
  rareza (pieza 08).
- Limitación menor: la letra de la bandera es la primera letra de la rareza, y "EPICA" y "ESPECIAL"
  comparten la E — no se nota mucho porque el color ya las distingue, pero queda anotado por si Felix
  quiere una abreviatura de 2 letras en el futuro.

**2.4.6 — Tipografía real de V6 (Cinzel / Cinzel Decorative / Rajdhani)** ✏️ Hecha, sin confirmar.
- Felix notó que, aunque la estructura ya coincidía, la Tienda VIP real no se sentía igual a
  `V6.html` — la razón principal era la tipografía: el juego usa 'Geom' (monospace, techy) en todos
  lados, mientras que `V6.html` usa Cinzel/Cinzel Decorative/Rajdhani (elegante, serif).
- Archivos: `index.html` (agregado Cinzel Decorative + Rajdhani a la petición de Google Fonts que ya
  traía Cinzel) + `style.css`.
- **Escopeado a `#vipPanel` únicamente** vía variables CSS (`--font-principal`, `--font-especial`,
  `--font-title` redefinidas ahí adentro) — el resto del juego (tienda normal, inventario, Ruby Pass,
  perfil, ajustes) sigue exactamente igual que antes, no se tocó nada global.
- Dentro de VIP: los tags/labels chicos (kicker, header-bar, hud-tag) usan Cinzel; los TÍTULOS grandes
  (nombre del panel destacado, nombre de paquete, nombre de item) usan Cinzel Decorative — misma
  distinción que hace `V6.html` entre `--font-especial` y `--font-title`.
- La ruleta (botón + modal) vive fuera de `#vipPanel` (cuelga directo de `<body>`), así que no hereda
  ese scope — se le puso Cinzel/Cinzel Decorative directo, sin variable, solo en esos 2 lugares.

**2.4.7 — Corrección: 2 headers en vez de 1 en Banners VIP** ✅ Corregido en el mismo mensaje que
Felix lo reportó.
- El header "BANNERS VIP" de la 2.4.4 estaba mal: era uno solo cubriendo las 2 columnas
  (Potenciadores + Banners), y ya existía texto "POTENCIADORES / VIP" adentro del widget hexagonal,
  duplicado y confuso. Se cambió a un header por columna, usando el `title` que YA tiene cada banner
  en `VIP_PROMO_BANNERS` ("POTENCIADORES VIP" / "BANNERS VIP") — no se inventó texto nuevo.
- Archivos: `shop.js` (`renderVIPHome`) + `style.css` (`.vip-banner-col`, nuevo wrapper).

**2.4.8 — 4 correcciones/adiciones pedidas por Felix tras comparar contra V6.html** ✏️ Hecha,
sin confirmar.

1. **Fondo dorado → fondo idéntico a V6.** El fondo real seguía siendo la imagen
   `assets/UI/Store/VIP/Backgrounds/bg_store_vip.png` (dorado/oliva) con un velo negro al 68%, aunque
   toda la tienda ya usara el kit. Se reemplazó por el fondo exacto de `V6.html`: casi negro (`#0a080b`)
   con un brillo dorado radial muy sutil arriba a la izquierda. La imagen NO se borró del HTML, solo
   se ocultó (`display:none` en `.vip-bg img`) por si Felix quiere volver atrás.
2. **Ofertas relámpago agregadas.** Antes se había decidido no fakear un temporizador — Felix pidió
   igual agregarlo solo visualmente, como en V6. Se agregó `VIP_FLASH_OFFERS_DEMO` (3 items REALES que
   ya existen en `VIP_PACKAGES_DATA` — Fantasma, Lobo Monstruo, Calabaza — no se inventaron items) con
   un texto de tiempo fijo (`00:41:12` etc., copiado tal cual de V6, NO cuenta atrás de verdad). Cuando
   exista un sistema real de ofertas con vencimiento, esto se reemplaza ahí — está comentado en el
   código para que no se pierda ese aviso.
3. **Banners cuadrados/agrandados, revertido.** El `flex:1` que se le había puesto a
   `.vip-promo-banner`/`.vip-powerup-promo-banner` en la 2.4.7 (para que las 2 columnas quedaran parejas
   de alto) fue mal — hacía que ambos bloques crecieran hasta ocupar el alto del más grande (el
   hexagonal), poniéndolos cuadrados y grandes. Se sacó esa línea, cada banner vuelve a su altura fija
   de siempre.
4. **Cards de paquete: rediseño completo (no solo la esquina cortada).** Felix aclaró que sus paquetes
   deben pasar de verticales (imagen arriba en franja fija + texto abajo) a un panel donde la imagen
   real ocupa TODA la card de fondo (igual que se hizo con el Hero y el banner genérico), con
   nombre/cantidad de items/precio apilados abajo sobre un velo oscuro. Esto es un paso más allá de lo
   que hace el propio `tier-card` de `V6.html` (que solo tiene una franja de cover chica) — Felix pidió
   explícitamente que la imagen ocupe todo el cuadro aunque eso signifique no ser 100% idéntico a V6 en
   ese punto puntual; lo que sí debe quedar igual es "la forma del precio y demás cosas" (hud-price-chip,
   ribbon, kit en general).
   - Archivos: `shop.js` (`renderVIPPackageCard`) + `style.css` (separado `.vip-pack-card` de
     `.vip-mini-item` — antes compartían el diseño octagonal viejo; `.vip-mini-item`, que es la card de
     skins/trails/emotes de la 2.4.5, NO se tocó, sigue igual).
   - Como `.vip-pack-card` ahora usa `hud-panel-cut` (corta solo la esquina sup-derecha, no las 4 como
     el diseño viejo), el ribbon "MÁS VENDIDO" volvió a las coordenadas EXACTAS de V6
     (`top:12px;left:-32px;width:130px`) — ya no hace falta el ajuste por esquina cortada que tenía
     antes. El notify-dot sí sigue necesitando un empujón (`top:8px;right:8px`) porque su esquina
     (sup-derecha) es la única que `hud-panel-cut` corta.

**2.4.9 — Resto de pantallas VIP (cofres, temporadas)** 🔲 No empezada.
