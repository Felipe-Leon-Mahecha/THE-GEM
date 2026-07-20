# Plan: Llaves de Caronte

> Este documento existe para que cualquier sesión de IA (o vos mismo) pueda retomar
> este feature sin perder contexto, aunque el chat original se corte por límite de uso.
> Seguí el mismo patrón que `PLAN_REMODELACION_HUD_TIENDA.md`.

## 1. Qué es esto

Un ítem coleccionable (moneda de un solo uso) llamado **Llave de Caronte**.

- **Único uso:** gastarla para poder tirar/pagar la **Ruleta VIP** (`#vipRouletteOverlay`,
  ya existe en `shop.js` línea ~3640, título actual `"LA LLAVE DE CARONTE"` en el modal —
  el nombre ya estaba puesto en el juego antes de este plan, solo faltaba el ítem real).
- **Cómo se consigue:** SOLO por drop aleatorio, con probabilidad muy baja:
  - Al abrir cofres (`CHESTS_DATA`, `shop.js` línea ~1067).
  - Al terminar una partida (probabilidad "muy rara vez", más baja que el drop de cofres).
- **No se puede comprar** con monedas ni gemas. No tiene precio. Es 100% drop.

## 2. Tema visual (decidido)

Descartamos la idea original de "corona real dorada" — no pega con el nombre.
El juego ya usa **Caronte** (barquero del inframundo griego, cruza el río Estigia
cobrando un óbolo/peaje). Tema final: **bronce envejecido, óbolo/hueso, NO dorado brillante,
NO gore**.

**Concepto elegido: Idea 3 — "Llave-hueso"**
- Cabeza de la llave: silueta de cráneo estilizado (actualmente muy simple, pendiente de
  refinar — ver sección 3, Parte A).
- Cuerpo: dos "vértebras" (rects redondeados apilados) en vez de vástago liso.
- Material: gradiente hueso/bronce claro (`#D8CBA8` → `#8A7A54`), contorno oscuro
  `#241708`, nada de brillo dorado.
- Dientes/guarda: simétricos a ambos lados (igual que la corona clásica descartada,
  pero en tono hueso).
- Regla del proyecto: **cero emoji**, todo dibujado en CSS/SVG (ya respetado en el boceto).

**Pendiente:** la calavera actual se ve "muy simple" (feedback de Luna). Falta una
segunda pasada de diseño antes de pasar a CSS real — ver Parte A abajo.

## 3. Fases de implementación

Cada fase es independiente y se puede hacer en un chat separado. Antes de arrancar
cualquier fase, subir `shop.js` y `style.css` actualizados (pueden haber cambiado
por el trabajo paralelo del HUD de la tienda VIP).

### Parte A — Refinar el diseño y pasarlo a CSS/SVG real ✅ TERMINADA
- Diseño final: cráneo con volumen real (`box-shadow` interno simulando curva de
  hueso), cuencas hundidas (radial-gradient + inset shadow, no óvalos planos),
  grieta diagonal, quijada/mordida como triángulo, 2 vértebras, vástago, dientes
  simétricos. Sin gore, 100% `div` + CSS (nada de SVG, nada de emoji — coherente
  con el resto de `style.css` que usa `clip-path`/gradientes, no SVG inline).
- Namespace de clases: `caronte-key-*` (no rompe selectores existentes).
- Base de diseño: canvas interno fijo de 64×176px, escalado con `transform: scale()`
  para no tener que recalcular cada propiedad por tamaño.
- Tamaños definidos:
  - `.caronte-key--sm` → ~28px alto (ícono de HUD/inventario), scale 0.18
  - `.caronte-key--lg` → 176px alto (animación de "conseguiste llave"), scale 1
  - Si se necesita un tamaño intermedio, agregar `.caronte-key--md` con su propio
    `scale` calculado igual que los otros dos (no tocar el resto de las reglas).
- **CSS final y helper JS ya escritos — pegar tal cual en `style.css` y en el
  archivo de renders (junto a `getSkinSidePath` o similar), y llamar con
  `renderCaronteKeyIcon('sm')` / `renderCaronteKeyIcon('lg')`.** El código
  completo quedó en el historial del chat donde se hizo esta parte; si se perdió,
  es rápido de regenerar pidiendo "recreá el CSS de la Parte A del plan de
  Llaves de Caronte, canvas 64×176px, clases caronte-key-*, cráneo con box-shadow
  interno, 2 vértebras, vástago, dientes simétricos".
- Sin animación todavía (eso queda para Parte E, si aplica).

### Parte B — Estado y almacenamiento ✅ TERMINADA
- Confirmado en `index.html` línea ~109: `subirDatosFirebase` sube TODO `localStorage`
  de una (no hace falta tocar esa función). El auto-sync automático se dispara
  solo para una whitelist de claves en línea ~174 — **hay que agregar
  `'caronteKeys'` a esa lista**.
- **No se encontró mutex/debounce en `index.html`** (mencionado en sesiones
  previas, puede estar en otro archivo no subido aún). La función actual es
  simple: sube todo `localStorage` en cada llamada. Si aparece el archivo con
  el mutex real, revisar si `caronteKeys` necesita algo especial ahí (no
  debería, sigue el mismo patrón que `deadCoins`/`gems`).
- Clave de storage: `localStorage.getItem('caronteKeys')` (mismo patrón que
  `deadCoins`/`gems`).
- `shop.js` línea ~2962: `canAfford` / `spendCurrency` / `addCurrency` ya
  soportan `'caronteKeys'` como tercer tipo de moneda vía un mapa
  `CURRENCY_KEYS = { gems, coins, caronteKeys }` (antes era un ternario de solo
  2 opciones). Código final ya escrito — pegar tal cual en `shop.js`.
- Nueva función `getCaronteKeys()` para leer el contador.
- **Decisión tomada:** `infiniteCoinsMode` (modo debug de monedas/gemas
  infinitas) NO afecta a `caronteKeys` — las llaves siguen siendo 100% drop
  incluso en modo debug, para no romper el sentido de rareza. Si Luna quiere
  cambiar esto para testear más fácil, es una condición de una línea en
  `canAfford`/`spendCurrency` (quitar el `&& currency !== 'caronteKeys'`).
- Si se perdió el código: pedir "recreá el CURRENCY_KEYS map y
  canAfford/spendCurrency/addCurrency de la Parte B del plan de Llaves de
  Caronte, con soporte para gems/coins/caronteKeys".

### Parte C — Drop en cofres ✅ TERMINADA
- Roll **independiente** (no reemplaza el drop normal del cofre): tabla
  `CARONTE_KEY_CHEST_CHANCE` agregada justo después de `CHESTS_DATA`
  (`shop.js` línea ~1134). Solo cofres de rareza alta sueltan llave:
  - `basic` / `special` / `luck` → 0% (nunca)
  - `epic` → 0.8%
  - `demon` → 2%
  - `vip` → 3.5%
  - **Estos % son un punto de partida, no están balanceados con datos reales
    — ajustar cuando haya métricas de cuántos cofres abre un jugador promedio.**
- `openChestReward()` ahora también tira el dado de la llave y devuelve
  `result.caronteKey` (bool). Cubre TODOS los puntos de apertura de cofre
  porque es la única función wrapper que se llama desde los dos lugares donde
  se abre un cofre (`showChestResult` y `openInventoryChestAmount` — se
  verificó que no hay un tercer punto de entrada).
- `showChestResult()` (apertura individual) y `openInventoryChestAmount()`
  (apertura múltiple, ej. "abrir 5") ambas muestran una línea extra con el
  ícono chico (`renderCaronteKeyIcon('sm')`) cuando cae al menos una llave.
- CSS de esa línea (`.caronte-key-drop-line`) agregado al final de `style.css`.
- **Nota técnica importante para las próximas partes:** el campo `drops` de
  `CHESTS_DATA` NO es un sistema real de loot de ítems — es una tabla de
  etiquetas de texto ponderadas (`rollDrop()`) que solo alimenta un contador
  `localStorage['drop_' + etiqueta]` para mostrar en el modal. No hay que
  meter la llave ahí; por eso se hizo un roll aparte con su propia tabla de
  probabilidad (`CARONTE_KEY_CHEST_CHANCE`), igual que ya se hacía con
  `grantRandomFragment()` (25% fijo, roll independiente del `drops`).

### Parte D — Drop en partidas ✅ TERMINADA
- El hook de fin de partida vive en **`main.js`** (no en `rank-system.js` ni
  `ui.js` como se pensaba al principio), función `winGame()`.
- **Decisión tomada:** el roll solo pasa en **victoria** (`winGame()`), no en
  derrota (`showGameOverWithRevive()`). Cubre normal y survival por igual,
  porque `winGame()` es la misma función para ambos modos. Si en algún
  momento Luna quiere que también caiga (más raro todavía) al perder, hay que
  agregar el mismo bloque en `showGameOverWithRevive()`.
- Probabilidad: **0.3%** (`CARONTE_KEY_WIN_CHANCE`), bastante más baja que la
  de cofres a propósito — el drop principal sigue siendo por cofres, esto es
  un extra raro. Ajustar si hace falta, no está balanceado con datos reales.
- Feedback visual mínimo: si cae, se muestra un mensaje en el elemento
  `#gw-unlock` de la pantalla de victoria (ya existía en `index.html`, se
  aprovechó en vez de crear uno nuevo). Se combina con el mensaje de XP si
  también hay uno (`gwUnlockEl._xpMsg`).
- Verificado: `shop.js` (donde vive `addCurrency`) carga ANTES que
  `src/main.js` en `index.html` (línea ~1022 vs ~1024), así que `window.addCurrency`
  ya existe cuando `winGame()` corre. Sin esto, el drop fallaría en silencio.
- Código final ya aplicado en `main.js` y verificado (sintaxis OK con `node -e`).

### Parte E — HUD / notificación ✅ TERMINADA (versión mínima)
- **⚠️ SUPERADO POR LA PARTE F:** la ubicación original de este contador (barra
  superior de la Tienda VIP, `renderVIPShell`) se sacó de ahí en la Parte F.
  Ahora el contador vive DENTRO de la Ruleta VIP y en el Inventario — ver el
  detalle actualizado en la Parte F más abajo. Se deja esta sección tal cual
  quedó en su momento, solo como registro histórico de la decisión original.
- **Dónde se decidió mostrarlo:** solo en la barra superior de la **Tienda
  VIP** (`renderVIPShell()`, `shop.js` línea ~4018), junto a rubies/monedas —
  no se tocó el HUD principal del menú (`menu-coins`/`menu-gems`) porque esos
  elementos NO existen en ningún archivo subido hasta ahora (deben vivir en
  un archivo de menú que todavía no se compartió). Si más adelante Luna quiere
  el contador también ahí, hace falta ese archivo.
- Elemento nuevo: `<span class="vip-balance-keys">` con el ícono chico
  (`renderCaronteKeyIcon('sm')`) + `<b id="vip-caronte-keys">`.
- `refreshShopBalances()` (línea ~3035) ahora también actualiza ese número.
  Importante: a diferencia de rubies/monedas, este **nunca** muestra `∞`
  aunque el modo debug esté activo (coherente con la Parte B: las llaves no
  participan del modo infinito).
- `openVIP()` ya llamaba a `renderVIPShell()` y después a `refreshShopBalances()`
  en ese orden — por eso el contador nuevo se pinta bien apenas se abre la
  tienda VIP, sin tocar el orden de esas llamadas.
- CSS de la píldora (`.vip-balance-keys`) agregado al final de `style.css`.
- **Lo que queda pendiente para más adelante (no es parte de este alcance):**
  una animación/notificación destacada tipo "¡conseguiste una llave!" con el
  ícono grande (`renderCaronteKeyIcon('lg')`) — hoy el aviso de la Parte D
  sigue siendo solo texto en `#gw-unlock`, y el de la Parte C solo texto en
  el modal de cofre. Si se quiere ese momento más "wow", es una fase aparte.

### Parte F — Integración con la Ruleta VIP ✅ TERMINADA
- **Decisión confirmada con Luna:** la llave REEMPLAZA el costo en rubíes por
  completo (ya no cobra `VIP_ROULETTE_SPIN_COST` = 20 rubíes — esa constante
  se borró del todo). Dos opciones de giro, ambas visibles como botones con
  el ícono de la llave adentro:
  - **GIRAR x1** → cuesta 1 llave (`VIP_ROULETTE_KEY_COST_SINGLE`)
  - **GIRAR x12** → cuesta 10 llaves (`VIP_ROULETTE_KEY_COST_BULK`,
    `VIP_ROULETTE_BULK_SPINS = 12`) — 2 giros "gratis" de descuento por
    comprar en bulk.
- El giro x1 mantiene la animación de rueda de siempre (`performRouletteSpin`).
- El giro x12 **NO anima la rueda 12 veces** (tardaría ~55s con la duración
  actual de 4.6s por giro) — tira las 12 recompensas de una con
  `rollWeightedTable` + `applyRouletteReward`, las agrupa por tipo/cantidad,
  y muestra un resumen con scroll. Mismo patrón que "abrir cofre x N" que ya
  existía en el inventario, para no inventar una UX nueva.
- El costo en llaves **siempre se cobra de verdad**, incluso con el modo
  monedas infinitas activado (coherente con la Parte B: las llaves nunca
  están exentas de ese modo debug).
- **Dónde se ve el contador de llaves ahora (pedido explícito de Luna: SOLO
  en estos 2 lugares, en ningún otro lado):**
  1. Dentro del propio modal de la Ruleta VIP (`renderVIPRouletteModalBody`),
     arriba de los botones de girar — línea "TIENES X LLAVES DE CARONTE" con
     el ícono chico.
  2. En el panel de Inventario (`#inv-keys-value`, al lado del contador de
     rubíes que ya existía) — se actualiza en `showInventorySection()`.
  - **Se sacó** el contador que se había puesto en la Parte E en la barra
    superior de la Tienda VIP (`renderVIPShell`) — ya no va ahí, por pedido
    explícito de Luna de limitarlo a esos 2 lugares nada más.
- Código final ya aplicado en `shop.js`, `style.css` e `index.html`, y
  verificado (sintaxis OK con `node -e`).

## 4. Convenciones a respetar (ya establecidas en el proyecto)

- Sin emoji en ningún ícono decorativo — todo CSS/SVG.
- Prefijos de clase nuevos y namespaced para no romper selectores compartidos
  (ej. `caronte-key-`, igual que `vip2-` en la remodelación de HUD).
- Config de texto/color centralizada en `textgemconfig.js` / `layoutconfig.js`
  cuando aplique (por si el texto de la llave necesita entrar ahí).
- Explicar la causa raíz antes de tirar la solución (preferencia habitual de Luna).

## 5. Estado actual

- [x] Tema visual definido (Caronte, no corona)
- [x] Concepto elegido: Idea 3, llave-hueso
- [x] Parte A: diseño refinado + CSS final — **TERMINADA**, código listo para pegar
- [x] Parte B: storage — **TERMINADA**, código listo para pegar
- [x] Parte C: drop en cofres — **TERMINADA**, código listo para pegar
- [x] Parte D: drop en partidas — **TERMINADA**, código listo para pegar
- [x] Parte E: HUD/notificación — **TERMINADA** (versión mínima, ver detalle arriba)
- [x] Parte F: integración ruleta VIP — **TERMINADA**, código listo para pegar

## 6. Sistema completo — TODAS las partes están terminadas (A–F)

El sistema de Llaves de Caronte está funcionalmente completo: se dibujan, se
guardan, se consiguen por cofres y por victorias raras, se ven en la ruleta
VIP y en el inventario, y son lo único que se necesita para girar la ruleta
VIP (reemplazan el costo en rubíes). Lo que quede de acá en más es ajuste de
balance (porcentajes de drop, costos) o pulido visual (animación grande de
"conseguiste llave" con `renderCaronteKeyIcon('lg')`), no funcionalidad nueva.

### Parte G — Pulido de feedback real (post-lanzamiento) ✅ TERMINADA
- **Bug encontrado por Luna probando en el juego:** el ícono chico
  (`.caronte-key--sm`, la llave completa escalada a ~11px de ancho) no se
  veía — quedaba una rayita sin detalle reconocible. Causa raíz: el diseño
  base es un canvas de 64×176px (proporción muy alargada, pensada para la
  versión grande), y a esa escala tan chica no queda nada legible.
- **Solución:** `renderCaronteKeyIcon('sm')` ahora dibuja un ícono
  independiente y compacto (`.caronte-key-mini`, ~20×18px, sin
  `transform:scale`) — un óbolo/moneda con la calavera grabada (ojos +
  grieta), pensado específicamente para verse bien de chico. La llave
  completa (`renderCaronteKeyIcon('lg')`, sin cambios) sigue reservada para
  una futura animación grande de "conseguiste una llave".
- Se actualizó también el ícono hardcodeado del contador de inventario en
  `index.html` (antes usaba el markup viejo de la llave completa escalada).
- Se sacó el texto **"No te alcanzan las llaves de Caronte."** de la Ruleta
  VIP — los botones ya se ven grises/disabled cuando no alcanza, ese
  mensaje adicional sobraba.
- **Cambio de decisión (reemplaza lo dicho en la Parte B):** el modo
  "MONEDAS INFINITAS" (`toggleInfiniteCoins()`, vive en `ui.js`) ahora
  también aplica a las Llaves de Caronte — se pueden gastar sin límite y
  se muestran como `∞`, igual que monedas y gemas. Antes estaban
  explícitamente excluidas de ese modo para no romper la sensación de
  rareza; Luna pidió el cambio para poder testear la ruleta sin tener que
  farmear llaves real. Afecta: `canAfford`, `spendCurrency`,
  `renderVIPRouletteModalBody` (muestra `∞`), `spinVIPRoulette`,
  `spinVIPRouletteBulk`, y el contador del inventario.
- Código final ya aplicado en `shop.js`, `style.css` e `index.html`, y
  verificado (sintaxis OK con `node -e`).
