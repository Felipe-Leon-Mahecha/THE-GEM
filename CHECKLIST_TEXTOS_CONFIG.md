# Checklist — arreglos en config

**Objetivo:** que todo botón y texto de cada panel del juego se pueda editar
desde `textgemconfig.js` (sección `GEM_CONFIG.textos`), en vez de estar
escrito directo en el HTML o en JS.

**Cómo usar este archivo:**
- Pásale este .md a Claude al empezar una sesión nueva.
- Claude trabaja el bloque marcado como `EN PROGRESO` (o el primero pendiente
  si no hay ninguno en progreso).
- Cuando un bloque quede terminado y confirmado por ti, se tacha (marca `[x]`)
  y se mueve a "Hecho".
- Los archivos que Claude va a pedir para cada bloque están listados debajo
  de cada uno — súbelos cuando arranques ese bloque.

---

## ⚠️ Cambio importante (config.js ya no existe)

`config.js` se dividió en dos archivos nuevos:
- **`textgemconfig.js`** → `window.GEM_CONFIG` — textos, tema (colores/fuentes),
  rangos (nombres/colores), imágenes de botones, banner de versión.
- **`layoutconfig.js`** → `window.GEM_LAYOUT` — todo lo de tamaños, paddings,
  responsive y posicionamiento (tienda, menú, perfil, level select, etc.).

Para los bloques pendientes de este checklist (textos/botones editables),
lo que hay que subir de ahora en adelante es **`textgemconfig.js`**, no
`config.js`.

---

## Pendientes

- [ ] **5. Pase Ruby**
  Archivos a subir: `index.html`, `textgemconfig.js`, `rubypass.config.js`
  (y el/los archivo(s) de lógica del pase ruby si son distintos)

- [ ] **6. Regalo diario**
  Archivos a subir: `index.html`, `textgemconfig.js`, y el archivo de lógica
  del regalo diario (si existe uno separado)

- [ ] **7. Cofres**
  Archivos a subir: `index.html`, `textgemconfig.js`, y el archivo de lógica
  de cofres (si existe uno separado)

- [ ] **8. Demás paneles** (los que queden sin revisar)
  Se define al llegar a este punto, según lo que falte.

---

## Hecho

- [x] **4.1. Layout de la tienda (auditoría, tras reporte del usuario)**
  Se confirmó que `layoutconfig.js` ya tenía valores separados
  mobile/desktop para TODO el sidebar de la tienda (ancho, tamaño de
  "TIENDA", padding, banner, avatar, monedas, equipado, etc.) y que
  `applyConfig()` sí escribía correctamente las variables CSS
  `--shop-*` y `--shop-*-mobile` para cada una.
  **Bug real encontrado (la causa de que "cambiar el tamaño no hacía
  nada" en celular):** en `style.css`, NINGUNA regla leía las
  variables `-mobile` del sidebar de la tienda — el CSS solo usaba
  siempre la variable de escritorio, sin importar el dispositivo.
  Faltaba el bloque `body.is-touch-device { ... }` que sí existe para
  otras partes del juego (ej. `#menu-profile-wrap`). Se agregó ese
  bloque completo (21 reglas, una por cada variable `-mobile` que
  arma `layoutconfig.js` para el sidebar).
  **Bug relacionado encontrado (bloque 3.4):** el nombre del rango en
  el panel de Perfil se arma en `layoutconfig.js` como ícono+nombre
  separados (para poder controlar el tamaño del ícono por
  mobile/desktop), pero `rank-system.js` reemplazaba todo ese HTML
  cada vez que el rango se actualizaba, borrando esa separación —
  así que el tamaño configurado del ícono nunca se respetaba en la
  práctica. Corregido para que solo actualice el texto del nombre.
  Archivos tocados: `style.css`, `rank-system.js`.

- [x] **4. Tienda normal** (sidebar, común, modal, skins, banners, emotes,
  trails, conversión, misiones — VIP/Pase Ruby/Regalo diario/Cofres NO
  incluidos, tienen su propio bloque)
  Al revisar `shop.js` resultó que este bloque ya estaba prácticamente
  wireado a `GEM_CONFIG.textos.tienda` desde antes de este checklist
  (probablemente de una sesión anterior que no quedó registrada aquí).
  Se auditó TODO el archivo (6200+ líneas) sección por sección y se
  encontraron y arreglaron 3 problemas reales:
  1. **Bug de verdad:** `equipEmote()` decidía si debía repintar la
     página de Emotes buscando el texto literal `"EMOTES"` dentro del
     HTML ya renderizado (`innerHTML.includes('EMOTES')`). Como ese
     título ahora es editable desde config, si lo cambiabas (ej. a
     "EXPRESIONES"), el botón de equipar dejaba de refrescar la
     página — parecía que "no funcionaba". Se reemplazó por una
     variable de estado real (`window._currentShopSection`), ya no
     depende del texto en absoluto.
  2. Botón "X" del panel de Misiones y las palabras "monedas"/"rubies"
     dentro de las recompensas de misión estaban hardcodeados — movidos
     a `GEM_CONFIG.textos.tienda.misiones.botonCerrar` y a
     `shopMonedaLabel()` (helper ya existente).
  3. "NINGUNA" y "BASICA" (tarjeta especial de "sin trail") estaban
     hardcodeados — movidos a
     `GEM_CONFIG.textos.tienda.trails.labelNinguna/labelBasica`.
  Se agregaron también los 8 ids del sidebar de la tienda a
  `estilosTexto` (color/fuente/degradado, bloque 3.1).
  Nombres/descripciones de catálogo (skins, banners, emotes, trails,
  misiones diarias) se dejaron igual — mismo criterio que logros/
  potenciadores.
  Archivos tocados: `textgemconfig.js`, `shop.js`.

---

- [x] **1. Menú principal + Panel de estadísticas**
  Incluyó: texto "CLASIFICACIÓN", pantalla de Game Over completa
  (kicker, título, subtítulo, botones), pantalla de victoria (Game Win),
  título y labels del panel de estadísticas del jugador, modal de
  "Editar perfil" (título, labels, botones Cancelar/Guardar), y rutas de
  imagen configurables de los 5 botones grandes del menú
  (Jugar/Tienda/Inventario/Logros/Ayuda).
  Archivos tocados: `index.html`, `config.js` *(en ese momento aún no
  estaba dividido)*, `main.js`.

- [x] **2. Panel de opciones**
  Incluyó: título del panel y botón Cerrar; secciones completas de
  Controles, Reasignar Teclas, Audio, Visual, Controles Celular y
  Modo Pruebas (DEV) — títulos, labels y botones. También se movieron a
  config los 3 textos dinámicos que ui.js pintaba con string fijo
  (modo de controles adaptativo/fijo, modo rendimiento alto/visuales
  completos, y el prefijo "MONEDAS INFINITAS" que estaba duplicado
  3 veces en el mismo archivo — ahora usa un solo helper
  `getInfiniteCoinsLabel()`).
  Nota: las letras de las teclas (A/D/S/W/E) en "Reasignar Teclas" NO se
  tocaron — son estado funcional (la tecla actual asignada), no texto
  editable de config.
  Archivos tocados: `index.html`, `config.js` *(en ese momento aún no
  estaba dividido)*, `ui.js`.

- [x] **3. Separación de config.js en textgemconfig.js + layoutconfig.js**
  Se dividió `config.js` (1870 líneas) en dos archivos sin perder ni
  reordenar ningún dato: `textgemconfig.js` (`GEM_CONFIG` — textos, tema,
  rangos, imágenes de botones, versionBanner) y `layoutconfig.js`
  (`GEM_LAYOUT` — tiendaSidebar, tienda, menu, perfilModal, controles,
  muteBTN, hud, levelSelect, RANK_MAP_CONFIG, RANK_HEADER_CONFIG,
  TOUCH_CONTROLS_CONFIG). `applyConfig()` ahora lee de `GEM_LAYOUT` y solo
  cruza a `GEM_CONFIG` para tema y versionBanner. Se actualizaron las 9
  lecturas de `levelselect.js` (`GEM_CONFIG?.levelSelect` →
  `GEM_LAYOUT?.levelSelect`) y el `<script>` de `index.html`. `ui.js`
  quedó intacto (solo lee `GEM_CONFIG.textos.*`).
  Archivos tocados: `index.html`, `levelselect.js`.
  Archivos nuevos: `textgemconfig.js`, `layoutconfig.js`.
  Archivo eliminado: `config.js`.

- [x] **3.1. Color/fuente independiente por texto + degradados**
  Se agregó `GEM_CONFIG.estilosTexto` (objeto por id de elemento, con
  `color` y `fuente`; si se dejan en `null` o comentado, el texto sigue
  usando el estilo global). Se agregó soporte real de degradados: si
  `color` empieza con `linear-gradient(` o `radial-gradient(`, se aplica
  con `background-clip: text` en vez de `color` normal. Función
  `aplicarEstilosTexto()` recorre todos los ids y aplica el estilo; se
  expuso como `window.aplicarEstilosTexto` para poder llamarla de nuevo
  cuando se crean elementos dinámicos (notificaciones).
  Ids ya cubiertos (comentados, listos para usar): Menú principal,
  Panel de Estadísticas, Panel de Opciones, Camino de Reyes (5 ids:
  `rs-title`, `txt-rangos-boton-volver`, `txt-rangos-label-experiencia`,
  `txt-rangos-xp-unidad`, `txt-rangos-hero-xp-sufijo`), Panel de Logros
  (`txt-achievements-titulo`) y Panel de Ayuda (`txt-help-titulo`), más
  las 2 notificaciones (`txt-achievement-notif-titulo`,
  `txt-rankup-notif-titulo` — esta última con nota: si se le pone color
  fijo, se pierde el color dinámico por rango).
  Archivos tocados: `textgemconfig.js`.

- [x] **(bonus, detectado en este bloque) "CAMINO DE RANGOS" → "CAMINO DE REYES"**
  El texto había quedado sin cambiar en una sesión anterior a pesar de
  reportarse como hecho. Corregido en `textgemconfig.js` →
  `textos.rangos.tituloPantalla`.

- [x] **3.2. Panel de Logros**
  Título del panel ("LOGROS") y template de contador
  ("Desbloqueados: {actual}/{total}") movidos a
  `GEM_CONFIG.textos.logros`. Título de notificación de logro
  ("¡LOGRO DESBLOQUEADO!") y de subida de rango ("¡NUEVO RANGO!")
  movidos a `GEM_CONFIG.textos.logros.notificacion`. Se les dio `id`
  a ambos títulos de notificación para que acepten `estilosTexto`
  (color/fuente/degradado), y como se crean dinámicamente, `ui.js`
  ahora llama `window.aplicarEstilosTexto()` justo después de crear
  cada notificación para que el estilo se aplique igual.
  Nombres/descripciones de cada logro (`ACHIEVEMENTS_DATA`) se dejaron
  igual — son catálogo del juego, no texto de UI (mismo criterio que
  nombres de skins en `shop.js`).
  Archivos tocados: `index.html`, `textgemconfig.js`, `ui.js`.

- [x] **3.3. Panel de Ayuda (Guía de Potenciadores)**
  Título del panel ("GUÍA DE POTENCIADORES") y las 2 plantillas de
  texto ("Nivel {n}: {texto}" y "Usos: {n}") movidos a
  `GEM_CONFIG.textos.ayuda`. Nombres/descripciones/niveles de cada
  potenciador (`POWERUPS_DATA`) se dejaron igual — son catálogo, mismo
  criterio que logros/skins.
  Archivos tocados: `index.html`, `textgemconfig.js`, `powerups.js`.

- [x] **(bonus, detectado en este bloque) `index.html` cargaba `config.js` viejo**
  El `index.html` subido todavía tenía `<script src="config.js">` en vez
  de los 2 archivos nuevos (esto habría roto el juego si era el archivo
  real en uso). Corregido a `<script src="textgemconfig.js">` +
  `<script src="layoutconfig.js">`.
  Archivos tocados: `index.html`.

- [x] **3.4. Emoji ↔ PNG universal (sin errores)**
  Se creó `window.renderIcon(valor, opciones)` en `textgemconfig.js`
  (primer archivo que carga el juego, así que está disponible para
  todos los demás). Detecta si `valor` es una ruta de imagen
  (.png/.jpg/.jpeg/.webp/.svg/.gif) o un emoji/símbolo, y devuelve el
  HTML correcto (`<img>` o `<span>`) automáticamente. Si en el futuro
  se pone una ruta de imagen que no existe, cae solo a un ícono de
  advertencia (nunca rompe el layout).
  Se aplicó en: panel de Logros (ícono de cada logro), notificación de
  logro (de paso se corrigió un bug real: siempre leía
  `achievement.img`, que los logros normales no tienen — solo lo
  pasaban los trofeos de comida — así que salía una imagen rota;
  ahora usa `img` si existe, si no `icon`), nombre de rango en el
  panel de Perfil, nombre de rango actual en Camino de Reyes, e ícono
  de cada nodo del camino (inicio/fin/nodos de rango).
  NO se tocó (ya tenían su propio mecanismo PNG→emoji funcionando
  bien, con el mismo criterio): `_setRankGemIcon` (gema real del
  rango con fallback a emoji + círculo de color) y el avatar del
  jugador en Camino de Reyes (ya usa `imageSide`/`imageRight`/`image`
  de la skin equipada, con fallback a `emoji`).
  Los datos siguen siendo emojis por ahora (RANKS, ACHIEVEMENTS_DATA)
  — el día que se cambien por rutas `.png` en esos mismos datos, se
  renderizan solas sin tocar código.
  Archivos tocados: `textgemconfig.js`, `ui.js`, `rank-system.js`.

---

## Notas generales (para tener en cuenta en los bloques que faltan)

- Algunos textos pueden estar **hardcodeados en JS** (no solo en el HTML),
  como pasó con `go-sub` en `main.js`. Siempre vale la pena buscar en los
  archivos de lógica, no solo en el HTML.
- Los botones que son **imágenes PNG** (no texto) no tienen string que
  mover a config — en esos casos lo que se deja configurable es la
  **ruta de la imagen**, no un texto.
- `GEM_CONFIG` (textos) y `GEM_LAYOUT` (layout) ya están expuestos como
  `window.GEM_CONFIG` y `window.GEM_LAYOUT`, así que cualquier archivo
  `.js` cargado después de `textgemconfig.js`/`layoutconfig.js` puede leer
  `window.GEM_CONFIG?.textos?.loQueSea` (o `window.GEM_LAYOUT?.loQueSea`
  para tamaños/posiciones) de forma segura.
- Ya no existe `config.js` — si algún archivo viejo o comentario lo
  menciona, es solo texto descriptivo desactualizado, no afecta nada
  funcional (quedaron algunos en `responsive.css`, `ui.js` e `index.html`
  pendientes de limpiar si quieres).
