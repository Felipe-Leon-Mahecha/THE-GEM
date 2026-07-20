# PLAN — Remodelación Ruby Pass (demolición total del círculo)

Documento de handoff scoped SOLO al Ruby Pass. Se puede pasar a otra IA sin perder contexto.
Frase para retomar en cualquier sesión nueva: **"Estoy en la parte # continuemos"**.

## 📎 Protocolo de handoff (leer primero si sos otra IA continuando esto)

1. Este archivo es independiente del plan general de la tienda (`PLAN_REMODELACION_HUD_TIENDA.md`,
   Fase 3 de ese documento). Ese plan menciona Ruby Pass pero ESTE archivo es la fuente de verdad
   para todo lo específico del Ruby Pass de acá en adelante.
2. **Decisión de Felipe (Lexus): demoler todo.** No se reutiliza nada del diseño circular actual
   (el "gear-shell" giratorio). Se construye un apartado 100% nuevo. Lo único que se conserva es la
   lógica de datos (XP, niveles, premium, reclamos) — cero lógica nueva, todo visual.
3. Formato de trabajo: exploración de diseño (varias variantes/preview) → Felipe elige una → se
   actualiza este MD → implementación parte por parte, mostrando resultado y esperando confirmación
   antes de seguir con la próxima parte.
4. Al final de cada fase, decir explícitamente qué archivos necesita subir Felipe para la siguiente.

---

## Estado actual en el juego (lo que hay que demoler)

Captura de referencia: `Captura_de_pantalla__1147_.png` (el círculo dorado/gris gigante, desbordado,
con nodos flotando alrededor, textos "MONEDAS MONOJO" pisándose, botones DEV visibles).

### Arquitectura de datos (esto NO se toca, queda intacto)
- **`RUBY_PASS_REWARDS`** (`shop.js` ~línea 1117): array de 30 niveles. Cada nivel tiene `level`, `xp`
  acumulado necesario, y dos objetos de recompensa `free` / `premium` (tipos: `coins`, `rubies`,
  `chest`, `emote`, `banner`, `skin`, `frame`, `trail` — cada uno con su `image` o slot de asset).
- **`getRubyPassState()`**: lee `localStorage` (`rubyPassXp`, `rubyPassPremiumOwned`,
  `rubyPassPremiumLevel`) y devuelve `{ xp, freeLevel, premiumOwned, premiumLevel }`.
- **`getRubyPassLevelFromXp`, `getRubyPassProgress`**: calculan nivel actual y % de progreso hacia el
  próximo nivel a partir del XP acumulado.
- **`addRubyPassXp`, `claimRubyPassReward`, `unlockRubyPassPremium`, `grantRubyPassPremiumFromPayment`**:
  lógica de otorgar XP, reclamar recompensas (con animación de toast/sfx), y comprar/otorgar el
  carril premium (costo: `RUBY_PASS_PREMIUM_COST_GEMS`, default 250 rubíes, configurable vía
  `window.RUBY_PASS_CONFIG.settings` — ese archivo de config, `rubypass.config.js`, existe en el
  proyecto pero todavía no se subió a esta sesión).
- **`RUBY_PASS_ASSETS`** (~línea 1089): diccionario central de rutas de imagen (logo, banner de
  acceso, fondo, punto de marcador actual, texturas de track free/premium, marcador de nivel, y cada
  recompensa individual). Los slots `freeTrackTexture` / `premiumTrackTexture` ya apuntan a
  `assets/UI/Store/RubyPass/Arcs/ruby_pass_free_track.png` y `ruby_pass_premium_track.png` — mismos
  nombres que las imágenes ya provistas por Felipe, así que reemplazando esos 2 archivos + agregando
  los 2 "marco" nuevos, el código los encuentra solo sin tocar rutas.
- Todo esto vive en `shop.js`. **No existe todavía** un archivo/HTML dedicado — el panel se crea
  dinámicamente:
  - `ensureRubyPassPanel()` (~línea 3203): crea `#rubyPassPanel` con `#rubyPassContent` adentro si no
    existe, colgado de `document.body` (no está en `index.html`).
  - `openRubyPass()` / `closeRubyPass()`: muestran/ocultan el panel y disparan el render.
  - **`renderBattlePassPage(container, options)`** (~línea 6694): la función que arma TODO el HTML del
    Ruby Pass vía template string. Esta es la función que hay que reescribir para la demolición.

### Lo que hay que demoler específicamente (la parte visual)
Dentro de `renderBattlePassPage`:
- `.ruby-pass-gear-shell`: el círculo gigante (hasta `min(2300px, 190vw, 245vh)`) posicionado con
  `top: calc(100% + min(54vw,520px))` — por eso se ve desbordado y empujado hacia abajo/afuera.
- `.ruby-pass-lane-free` / `.ruby-pass-lane-premium`: dos anillos concéntricos que rotan vía
  `--free-rotation` / `--premium-rotation` (variables CSS en grados) para "traer" el nivel actual al
  frente.
- `renderRubyPassNode()`: cada recompensa se posiciona con `transform: rotate(var(--node-angle))
  translateX(...)` — trigonometría circular para distribuir 30 nodos en el anillo.
- `initRubyPassDrag()`: lógica de arrastre horizontal que en realidad rota el círculo (`pointerdown`
  / `pointermove` calculando delta de rotación) y detecta clicks por distancia euclidiana al nodo más
  cercano.
- `.ruby-pass-liquid` / `.ruby-pass-liquid-tip`: un relleno tipo "líquido" que sigue el progreso
  dentro del anillo free.
- CSS: dos bloques en `style.css` — uno de "overrides" en líneas ~1263-1421 (fuerza el tamaño/posición
  gigante del círculo, con `!important` en casi todo) y el bloque base real en líneas ~4886-6233+
  (`.ruby-pass-*` sin overrides). El plan es reemplazar TODO esto por el sistema nuevo, no parchear.

### Lo que SÍ se conserva del HTML actual (reutilizable, no es parte del círculo)
- `.ruby-pass-topbar` con `.ruby-pass-profile` (avatar + nombre + banner equipado) y
  `.ruby-pass-season` (nivel + XP) — esto ya funciona bien, solo hay que integrarlo al layout nuevo.
- Botón `.ruby-pass-back` ("VOLVER").
- Botones DEV (`DEV +250 XP`, `DEV RESET XP`) — quedan, son herramientas de testeo de Felipe.

---

## Referencias visuales entregadas (las 4 imágenes del kit de riel)

Ubicación final en proyecto: `assets/UI/Store/RubyPass/Arcs/` (mismos nombres que ya usan los slots
de `RUBY_PASS_ASSETS`, así el código los toma sin tocar rutas).

| Archivo | Medidas | Rol confirmado |
|---|---|---|
| `ruby_pass_free_track.png` | 1536×292px (~5.3:1) | Track del carril **FREE** — delgado, metal gris con remaches. Va como `border-image` (9-slice), NO como `repeat-x` tiling (los bordes no calzan perfectamente pixel a pixel, sobre todo este). |
| `ruby_pass_premium_track.png` | 1774×483px (~3.7:1) | Track del carril **PREMIUM** — grueso, dorado con filigrana + diamantes. También 9-slice. Jerarquía intencional: el premium SIEMPRE debe pesar visualmente más que el free (empuja la sensación de "esto es lo importante / lo que vale comprar"). |
| `ruby_pass_free_marco.png` | (variante gruesa gris, el "track" gris pero en su versión ancha) | Reasignado: marco de la vidriera de "próxima recompensa" — da sensación industrial/resistente sin competir con el dorado del VIP. |
| `ruby_pass_premium_marco.png` | (variante delgada dorada) | Reasignado: línea divisoria fina bajo títulos, o borde de ítem premium dentro del resumen de misiones cuando la recompensa es premium — un toque "esto es especial" sin ser el track completo. |

**Técnica confirmada: `border-image` CSS (9-slice).** En vez de repetir la imagen con `repeat-x` (se
notaría la costura por el desajuste de bordes), se define borde izquierdo/derecho como "puntas" fijas
y el centro se estira/repite según el ancho real de la barra — funciona igual con 20 o 60 niveles, y
no depende de que los bordes calcen a la perfección.

---

## Combo de diseño confirmado (por qué cada pieza está, no es relleno)

Basado en cómo lo hacen Fortnite / COD Mobile / Free Fire, priorizado por impacto en retención:

1. **Riel horizontal de progreso** (reemplaza el círculo) — la base, todo lo demás se apoya acá.
2. **Vidriera de "próxima recompensa"** arriba — la pieza que más engancha visualmente ("¿qué es esa
   skin borrosa del nivel 12?"). Usa `free_marco` como marco.
3. **Banner del jugador** (`.ruby-pass-profile`, ya existe) — se integra al header nuevo, no se rehace.
4. **Countdown de temporada** — "quedan N días" es el gatillo de urgencia más simple y usado en todos
   los pases; empuja la compra del premium cuando el jugador siente que se acaba el tiempo. Barato de
   hacer (usa `seasonLabel`, aunque el config de temporada — `rubypass.config.js` /
   `window.RUBY_PASS_CONFIG` — todavía no fue subido a esta sesión, hay que pedirlo si hace falta ese
   dato real).
5. **Banner de Premium — el MISMO espacio cambia de contenido según estado, nunca queda vacío:**
   - Sin comprar: CTA "Activá el Ruby Pass Premium" + preview de 2-3 recompensas exclusivas que se
     pierde + botón de compra (`unlockRubyPassPremium()`, ya existe).
   - Ya comprado: el mismo cajón se convierte en banner de estado (ej. "PREMIUM ACTIVO ✓" + dato útil
     tipo "3 recompensas premium esperando reclamo"). Ya existía conceptualmente
     (`.ruby-pass-buy.is-owned` → "PREMIUM ACTIVO"), solo hay que integrarlo bien al layout nuevo.
6. **Resumen de misiones** al lado o debajo del riel — reutiliza el sistema real ya armado en
   `shop.js` (`DAILY_MISSIONS`, `readMissionState`, `MISSION_STREAK_REWARDS`, `getMissionReadyCount`,
   `renderMissionReward`, `openMissionsPanel` — todo desde línea ~7029). Se muestran 2-3 misiones del
   día (la más cerca de completarse arriba) + link "ver todas" que abre el panel completo existente.
   Cero lógica nueva.
7. **(Opcional, baja prioridad) Galería "ver todo"** dividida en 2 columnas (gratis/VIP) con todas las
   30 recompensas en grande — más trabajo, se deja para el final si sobra tiempo.

**Regla de jerarquía visual confirmada:** track premium (grueso, dorado) siempre debe pesar más que
el track free (delgado, gris) — es a propósito, no es solo gusto estético.

---

## Orden de implementación (partes, una por vez, con confirmación de Felipe entre cada una)

- **# 1** — Estructura nueva: reemplazar el círculo por el riel horizontal, con las 4 imágenes reales
  vía `border-image` 9-slice, sin costuras visibles. Base de todo lo demás.
- **# 2** — Vidriera de "próxima recompensa" arriba.
- **# 3** — Banner del jugador + countdown de temporada integrados al header nuevo.
- **# 4** — Banner de Premium (CTA si no lo tiene / estado si ya lo tiene, mismo espacio).
- **# 5** — Resumen de misiones al lado del riel.
- **# 6** — Panel "ver todo" dividido en 2 (gratis/VIP), estilo Free Fire.

## Progreso

### ✅ Parte # 1 — CONFIRMADA por Felipe

**Problema visto en el primer render real (captura del riel andando):** las barras se
veían "estiradas" (el patrón de rombos/filigrana deformado) y la línea de progreso morada
se veía gruesísima, no como una línea fina.

**Causa raíz y fix aplicado (solo `style.css`, sin tocar `shop.js` ni la lógica):**
- `.ruby-rail-bar-slot` tenía `border-image-repeat: stretch`. Las imágenes fuente miden
  1774px/1536px de ancho pero el riel completo (30 niveles) mide varios miles de px —
  `stretch` toma la franja decorativa y la estira de un tirón para cubrir ese ancho, lo
  que deforma el dibujo (rombos alargados). Cambiado a `border-image-repeat: round`: repite
  el motivo completo en copias enteras en vez de estirarlo, sin deformar el arte original.
- `.ruby-rail-path` (la línea de progreso) tenía `height: 16px` más un glow doble (blur de
  16px + 8px superpuestos) que visualmente leía como una franja mucho más ancha que la
  línea real. Bajado a `height: 5px` con un glow más sutil (6px + 3px).
- Los números de `border-image-slice`/`border-image-width` (109/23 premium, 78/14 free) NO
  se tocaron — Felipe confirmó que con el cambio a `round` ya se ve bien, así que no hizo
  falta ese ajuste fino que el plan dejaba pendiente.

**Captura de referencia del resultado confirmado:** riel con rombos dorados nítidos (sin
deformar) arriba, línea de progreso morada fina y discreta en el medio, barra gris metálica
del carril free abajo, todo dentro de proporción.

<details>
<summary>Detalle completo de la implementación original de la Parte # 1 (demolición del
círculo, construcción del riel) — referencia histórica, ya confirmada</summary>

**Archivos tocados:** `shop.js` y `style.css` únicamente. `index.html` no se tocó (el panel sigue sin
bloque propio ahí, se sigue inyectando 100% por JS, como ya estaba). `rubypass.config.js` tampoco se
tocó todavía — sus variables (`--rp-*`) controlaban el sistema circular viejo, ahora están huérfanas,
sin uso, pero no rompen nada (simplemente no las lee nadie).

**Qué se demolió:**
- `renderRubyPassNode()` (posicionaba nodos con trigonometría circular) → reemplazada por
  `renderRubyPassRailNode()`.
- `initRubyPassDrag()` (rotaba el círculo al arrastrar + detectaba clicks por distancia euclidiana al
  nodo más cercano) → reemplazada por `initRubyPassRail()`, mucho más simple: cada nodo tiene su
  propio `onclick` directo, y lo único que hace esta función es centrar el scroll horizontal en el
  nivel actual al abrir el pase.
- Todo el HTML de `.ruby-pass-arc-window` / `.ruby-pass-gear-shell` / `.ruby-pass-lane-premium` /
  `.ruby-pass-lane-free` / `.ruby-pass-liquid` / `.ruby-pass-current-point` dentro de
  `renderBattlePassPage()`.
- Variables muertas en `renderBattlePassPage` que solo alimentaban las rotaciones (`freeRotation`,
  `premiumRotation`, `tipAngle`, `premiumLevelForRender`, `renderPremiumLevel`).

**Qué se construyó (nuevo, prefijo de clase `.ruby-rail-*` para no chocar con nada viejo):**
- `.ruby-rail-scroll` — contenedor con scroll horizontal nativo (`overflow-x:auto`), sin librerías.
- `.ruby-rail-group` — apila el carril premium (arriba) y el carril free (abajo) DENTRO del mismo
  scroller, así se desplazan juntos en sincronía sin necesitar JS que sincronice dos scrolls
  separados.
- `.ruby-rail.is-premium` / `.ruby-rail.is-free` — cada uno con su `.ruby-rail-bar` (el borde con la
  imagen real via `border-image`, ver técnica abajo) y `.ruby-rail-nodes` (los 30 nodos en fila con
  `display:flex; gap:58px`).
- El nodo del nivel actual tiene la clase `.is-current` (se agranda, borde blanco brillante).
- Nodos reclamables (`.is-claimable`) pulsan suave en dorado — respeta `body.reduced-motion` /
  `body.performance-mode` (no anima en esos modos, pero sigue siendo clickeable).
- `renderRewardIcon()` (la función que decide qué ícono mostrar por tipo de recompensa) **NO se
  tocó** — se sigue usando tal cual, ya andaba bien.
- `data-ruby-claim="${lane}_${level}"` se mantuvo igual en los nodos nuevos — `claimRubyPassReward()`
  (la función que realmente otorga la recompensa) no se tocó para nada, sigue funcionando exacto
  igual que antes, solo cambió CÓMO se dibuja el nodo que dispara el click.

**Deuda técnica dejada a propósito (para no arriesgar romper algo a ciegas):**
- El CSS viejo del círculo (`.ruby-pass-gear-shell`, `.ruby-pass-lane-*`, `.ruby-pass-node-*`, etc. —
  están duplicados en varios bloques del archivo, algunos con `!important`) **NO se borró**, quedó
  como código muerto sin uso. Se puede limpiar en una pasada aparte una vez que Felipe confirme que el
  riel nuevo anda bien — hacerlo ahora a ciegas es más riesgo que beneficio.
- `.ruby-pass-focus` (el panel con el % de progreso y el botón de comprar premium) sigue siendo
  literalmente el mismo HTML/CSS de antes, solo se le sacó el `position:absolute` que lo centraba
  sobre el círculo (ahora vive en flujo normal, debajo del riel). Se rediseña de raíz en la **Parte
  #4** (banner de Premium), así que como se ve ahora es temporal a propósito.
- La animación de "ganaste XP" (antes rotaba los anillos) quedó simplificada a solo animar la barra de
  XP del panel focus. Si se quiere una transición más vistosa al ganar XP en el riel nuevo, es una
  mejora a pedir aparte, no bloquea nada.
- `getRubyPassRotation()` (la función que calculaba ángulos) quedó sin uso real, pero no se borró
  porque `unlockRubyPassPremium()` todavía la llama en una animación que ya no tiene a quién
  animarle (el elemento `.ruby-pass-lane-premium` ya no existe) — no rompe nada, el `if (!premiumLane)
  return;` que ya tenía la protege, simplemente no hace nada visible. Se puede limpiar junto con el
  resto de la deuda técnica de arriba.

</details>

---

### ✅ Parte # 2 — CONFIRMADA por Felipe

**Qué se construyó:** (sin cambios respecto al detalle de abajo)
- `getRubyPassNextShowcaseReward(state, currentLevel)` (`shop.js`): busca la próxima
  recompensa **premium** sin reclamar a partir del nivel actual (prioriza el carril premium
  porque es la pieza que más engancha — skins/emotes — y la que más empuja la compra del
  pase VIP). Si no queda ninguna (edge case, no debería pasar con 30 niveles), muestra la
  última como referencia.
- `renderRubyPassNextShowcase(state, currentLevel)` (`shop.js`): arma el HTML de la
  vidriera — usa `renderRewardIcon()` tal cual (no se tocó), agrega la marca `?` y un
  desenfoque (`blur(3px)`) SOLO si la recompensa es de un nivel futuro real (todavía no
  llegó ahí) — el efecto es generar curiosidad ("¿qué es esa skin del nivel 12?"), no
  ocultar algo que el jugador ya podría reclamar pero no reclamó.
- Insertado en `renderBattlePassPage()` arriba del riel (`.ruby-rail-stage`), debajo del
  banner de temporada si existe.
- CSS nuevo (`.ruby-rail-next-showcase*`) en `style.css`: el marco usa
  `RUBY_PASS_ASSETS.freeMarco` (`ruby_pass_free_marco.png`) vía `border-image`, tal como
  decía el plan — reasignado a esta vidriera para dar sensación industrial/resistente sin
  competir con el dorado del banner de premium que va más abajo.
- Se agregaron los slots `freeMarco` / `premiumMarco` a `RUBY_PASS_ASSETS` (no existían
  todavía en el diccionario). `premiumMarco` queda sin usar por ahora — el plan lo reserva
  para una línea divisoria fina o borde de ítem premium, a implementar más adelante.

**Confirmado por Felipe con captura:** marco se ve blanco/simple (esperado, porque
`ruby_pass_free_marco.png` todavía no está subido al proyecto — el `border-image` cae al
estilo por defecto sin romper nada), blur + "?" funcionando bien en el nivel futuro.

**Bug encontrado y corregido en el camino:** un edit anterior de esta misma sesión había
borrado por error la línea `function renderRewardIcon(reward, lane, level) {`, dejando su
cuerpo como código suelto fuera de función → `Uncaught SyntaxError: Illegal return
statement` que rompía el parseo de TODO `shop.js` desde ese punto en adelante (por eso
`openShop`/`findShopSkin` aparecían como "no definidos" — no eran bugs reales, era el
archivo entero fallando a mitad de parseo). Corregido y validado con `node --check` antes de
reenviar el archivo.

---

### 🔎 Hallazgo importante para las Partes # 3 y # 4

Al revisar `renderBattlePassPage()` para arrancar la Parte # 3, se encontró que **el HTML
de estas dos partes YA EXISTE en el código actual** (no hay que construirlo de cero):
- **Parte # 3** (banner del jugador + countdown): `.ruby-pass-topbar` con
  `.ruby-pass-profile` (avatar + nombre + banner equipado) y `.ruby-pass-season`
  (nivel + XP) ya están integrados arriba del riel nuevo — se ve en la captura confirmada de
  Felipe (LEON arriba a la izquierda, NIVEL 2 · 395 XP arriba a la derecha). El widget de
  countdown (`.ruby-rail-countdown`, "TERMINA EN...") también está en el template, pero
  condicionado a `getRubyPassSeasonCountdown()` — no aparece en la captura porque
  `rubypass.config.js` (que define la fecha real de fin de temporada) todavía no se subió a
  esta sesión.
- **Parte # 4** (banner de Premium): el bloque completo con los 2 estados (CTA "Activá el
  Ruby Pass Premium" + preview de 3 recompensas + botón de compra / vs. "PREMIUM ACTIVO ✓" +
  conteo de recompensas listas para reclamar) también ya está en el template y con su CSS
  (`.ruby-rail-premium-banner*`) ya escrito.

**No se tocó nada de esto todavía** porque hace falta que Felipe confirme con una captura de
lo que se ve MÁS ABAJO del riel (la vidriera + riel ya se vieron, pero no lo que sigue) antes
de decidir si de verdad no hace falta tocar nada, o si hay algo que ajustar visualmente ahí
también (ej. que compita mal con el nuevo riel/vidriera, tamaños, spacing).

**Antes de seguir**, Felipe necesita:
1. Mandar una captura con scroll hacia abajo mostrando el banner de premium y el panel de
   progreso (`.ruby-pass-focus`) para confirmar si ya están bien integrados o si hace falta
   ajustar algo.
2. Si quiere el countdown real funcionando, subir `rubypass.config.js`.
3. Decir "estoy en la parte # 5, continuemos" si # 3 y # 4 ya están bien tal cual están, o
   pedir ajustes puntuales si no.

### 🔲 Partes # 5 y # 6 — no empezadas todavía

---

### ✅ Parte # 5 — CONFIRMADA por Felipe (con pendiente de retoque visual, ver abajo)

**Qué se construyó (`shop.js`):**
- `getRubyRailMissionsPreview(limit)`: lee `readMissionState()`, calcula % de
  cada misión del día, descarta las ya reclamadas y devuelve las `limit`
  (2) más cerca de completarse. Cero lógica nueva de misiones — solo
  lectura y orden.
- `renderRubyRailMissionsSummary()`: arma el HTML del panel "MISIONES DE
  HOY" con esas 2 misiones (título + barra de progreso + `x/goal`) y un
  link "VER TODAS". Si no queda ninguna sin reclamar, muestra un mensaje
  corto en vez de filas vacías.
- Insertado en `renderBattlePassPage()`, dentro de `.ruby-rail-bottom-row`
  (ver más abajo), junto al banner de premium.
- Cada fila y el link "VER TODAS" llaman a `openMissionsPanel()` — el
  modal de siempre. `claimMissionReward()` no se tocó: el resumen es
  puramente de lectura, el reclamo real sigue pasando por el panel
  completo.

**CSS (`style.css`):** bloque `.ruby-rail-missions-summary*` nuevo,
reusando el lenguaje visual de `.mission-card` (acento `#ffda3a`, barra
cyan→amarillo, monospace) para no sentirse un injerto aparte.

---

### 🐛 Bug encontrado tras confirmar Parte # 5: pantalla con contenido cortado (sin scroll)

**Síntoma (captura de Felipe):** al abrir el Ruby Pass solo se veía la
vidriera + el riel; el banner de premium, el resumen de misiones nuevo y
el panel `.ruby-pass-focus` no aparecían — y tampoco había scrollbar
visible, el contenido simplemente desaparecía.

**Causa raíz:** `.ruby-pass-screen` tiene `overflow:hidden` + altura fija
(`100vh`), y `.ruby-pass-stage` también tenía altura fija
(`calc(100vh - 76px)`) pero sus hijos (vidriera, riel, banner premium,
misiones, focus) se apilaban en flujo normal **sin repartirse** esa
altura — cada uno ocupaba su alto natural sumado al de los demás, y el
total superaba la altura fija del stage. Como el contenedor tiene
`overflow:hidden`, todo lo que no entraba se cortaba invisible (no
scrolleable, directamente no se renderizaba visible). Se sumaba un
`padding-bottom: 200px` en `.ruby-rail-stage`, resabio de cuando el panel
focus vivía posicionado *encima* del círculo viejo — peso muerto que ya
no cumplía ninguna función.

**Fix aplicado (solo `style.css`, no se tocó lógica ni `shop.js` más allá
de un cambio estructural de HTML):**
- `.ruby-pass-stage` pasó a `display:flex; flex-direction:column`. El
  riel (`.ruby-rail-stage`) se lleva el alto sobrante vía
  `flex:1 1 auto; min-height:0`; todo lo demás queda con su tamaño
  natural comprimido — así el conjunto siempre entra en la altura
  disponible sin competir por espacio.
- Se eliminó el `padding-bottom: 200px` fantasma de `.ruby-rail-stage` y
  se recortaron paddings/gaps de la vidriera, el banner premium y
  `.ruby-pass-focus`.
- **Cambio de layout:** el banner de premium y el resumen de misiones
  ahora van lado a lado (`shop.js`: se envolvieron en un nuevo
  `.ruby-rail-bottom-row`) en vez de apilados, para aprovechar el ancho
  y ahorrar alto vertical. En mobile (`≤820px`) se apilan de nuevo.

**Confirmado por Felipe con captura:** todo el contenido entra en
pantalla sin scroll. Pendiente: retoque visual del bloque de misiones (no
se ve bien todavía) — queda anotado para retomar, sin bloquear el avance
a la Parte # 6.

---

### ✅ Parte # 6 — implementada, pendiente de confirmar con captura

**Preview de diseño mostrado y aprobado por Felipe:** 2 columnas
(gratis/premium), filas compactas por nivel. Trigger elegido: botón
"VER TODO" junto a la vidriera (no en el topbar).

**Qué se construyó (`shop.js`):**
- `renderRubyPassGalleryRow()` / `renderRubyPassGalleryColumn()` /
  `renderRubyPassGalleryPage()`: arman las 30 filas por carril
  (nivel + ícono vía `renderRewardIcon()`, sin tocar esa función,
  + check si está reclamado). Filas bloqueadas (nivel no alcanzado o
  carril premium sin comprar) quedan atenuadas y no clickeables.
- `ensureRubyPassGalleryModal()` / `openRubyPassGallery()` /
  `closeRubyPassGallery()`: mismo patrón que `ensureRubyPassPanel()` /
  `openMissionsPanel()` ya usados en el proyecto — modal fijo con click
  afuera para cerrar.
- `claimFromRubyPassGallery()`: **único agregado real de lógica**, y es
  mínimo — es un wrapper sobre `claimRubyPassReward()` (que no se
  tocó) que además refresca la galería Y el riel de atrás después de
  reclamar, porque ambos pueden convivir en el DOM al mismo tiempo y
  `claimRubyPassReward()` por sí sola solo actualiza el primer nodo que
  encuentra con ese `data-ruby-claim` (podía quedar el riel
  desincronizado si no se hacía este refresh).
- Botón "VER TODO" agregado junto a la vidriera, envueltos los dos en
  `.ruby-rail-top-row` (misma fila, no suma alto vertical — importante
  después del fix de scroll de la Parte # 5).

**CSS (`style.css`):** `.ruby-gallery-*`, mismo patrón de modal que
`.missions-modal`/`.missions-panel` (fixed + backdrop blur + panel
centrado con scroll propio) pero con paleta dorada del Ruby Pass en vez
de la cyan/amarilla de misiones. En pantallas angostas (`≤560px`) las 2
columnas pasan a 1.

**Pendiente:** Felipe todavía no mandó captura de esta parte — falta
confirmar que se ve bien antes de darla por cerrada.



## Archivos relevantes ya disponibles para esta sesión
- `index.html` — confirmado: el Ruby Pass NO tiene bloque propio acá, se inyecta 100% por JS.
- `shop.js` — contiene TODO: `RUBY_PASS_ASSETS`, `RUBY_PASS_REWARDS`, `renderBattlePassPage` y
  funciones asociadas (líneas citadas arriba), más el sistema de misiones reutilizable.
- `style.css` — contiene `.ruby-pass-*` completo, dos bloques (override ~1263-1421 + base
  ~4886-6233+) a reemplazar.
- `ui.js` — revisado, sin lógica de Ruby Pass propia.
- Las 4 imágenes de riel/marco.
- Captura del estado actual (círculo).

## Pendiente para próximas partes (pedir si hace falta)
- `rubypass.config.js` (`window.RUBY_PASS_CONFIG`) si se necesita el dato real de temporada/countdown
  o costos configurables — todavía no subido a esta sesión.
