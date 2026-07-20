# THE GEM — Contexto global del proyecto

> **Instrucción de uso:** copia y pega este documento completo al inicio de tu conversación con la
> IA cada vez que vayas a pedir un cambio, optimización o corrección en el código.

---

## 1. Descripción general del juego

**THE GEM** es un juego arcade/survival en 2D desarrollado con HTML5 Canvas y JavaScript (ES6)
nativo, empaquetado para plataformas móviles utilizando Capacitor.

**Mecánica principal (movimiento orbital):**
- El jugador se mueve de forma circular/orbital en un espacio geométrico definido por dos radios:
  un núcleo interno (`BASE_RADIUS`) y un domo externo (`DOME_RADIUS`).
- El jugador alterna la gravedad entre ambos radios para esquivar obstáculos (pinchos/spikes,
  sierras/saws, láseres) y recolectar monedas (`DEAD_COIN`) y gemas (`Rubies`).
- **Tiempo de victoria por nivel:** 133 segundos (2:13.3), definido globalmente por
  `LEVEL_WIN_TIME`.

---

## 2. Variables globales de control y estado (`window.`)

El bucle principal del juego, las físicas y la interfaz dependen críticamente de estas variables
globales alojadas en el objeto `window`:

| Variable | Qué hace |
|---|---|
| `window.running` / `window.paused` | Controlan la ejecución o pausa del bucle de actualización (`update`/`draw`) |
| `window.level` / `window.currentLevel` | Índice numérico (basado en 0) del nivel activo |
| `window.lives` | Vidas restantes del jugador (inicia en 3, revive con 1) |
| `window.angle` / `window.angVel` | Posición angular actual del jugador (radianes) y su velocidad de giro |
| `window.playerRollAngle` | Ángulo de rotación estética de la skin al moverse/rodar |
| `window.playerFacing` | Dirección a la que mira el jugador (`'left'` o `'right'`) |
| `window.offset` / `window.vel` | Distancia radial respecto al centro (0 = núcleo, `MAX_OFFSET` = domo) y su velocidad radial |
| `window.gravity` / `window.gravityForce` | Dirección de la gravedad (1 = núcleo, -1 = domo) y la fuerza interpolada aplicada |
| `window.invulnerable` / `window.invulnerableTimer` | Controla la inmunidad temporal tras un golpe o al revivir |
| `window.canvasDPR` | Multiplicador de escala (`devicePixelRatio`, máx. 2x) aplicado en móviles/táctiles para nitidez y rendimiento |

---

## 3. Configuración estética y de layout (`GEM_CONFIG` / `GEM_LAYOUT`)

> ⚠️ **Actualizado:** el antiguo `config.js` **ya no existe** — se dividió en dos archivos:
> - **`textgemconfig.js`** → `window.GEM_CONFIG` — textos editables, tema (colores/fuentes),
>   rangos (nombres/colores), imágenes de botones, banner de versión.
> - **`layoutconfig.js`** → `window.GEM_LAYOUT` — tamaños, paddings, responsive y posicionamiento
>   (tienda, menú, perfil, level select, etc.).

**Colores clave (tema):**
| Color | Hex | Uso |
|---|---|---|
| Cian | `#00ffe7` | Color principal de acento, brillos y textos destacados |
| Rojo | `#ff2d55` | Alertas y rareza DEMON |
| Rosa | `#ff4d6d` | Título de la TIENDA y acentos secundarios |
| Verde neón | `#00ffae` | Confirmaciones y badges de "desbloqueado" |

**Fuentes del sistema:**
- Principal: `'Geom'`, monospace (títulos y UI del juego)
- Secundaria: `'monospace'` (textos generales)

---

## 4. Sistema de combos y rozamiento ("near-miss")

Monitorea la cercanía del jugador frente a los obstáculos para otorgar puntos, combos y efectos
visuales sin llegar a colisionar. Centralizado en `combo-system.js`.

- **`onNearMiss(isPerfect)`**: callback global invocado por los obstáculos cuando el jugador pasa
  muy cerca.
  - Esquive perfecto (`isPerfect = true`) → `showPerfectDodgeEffect()` (partículas doradas y destello).
  - Esquive normal → `showNearMissEffect()` (partículas cian).
- **Multiplicadores de combo:** 1x (base), 2x (10 combos), 3x (20 combos), 4x (30 combos), 5x (50 combos).
  El combo se reinicia si pasan más de 3 segundos (`COMBO_TIMEOUT = 3000`) sin esquivar.
- **Umbrales de cercanía radial (píxeles adicionales):**
  - `NEAR_MISS_ANGULAR_THRESHOLD = 0.25` (margen angular)
  - `SPIKE_NEAR_MISS_RADIAL_MARGIN = 40`
  - `SAW_NEAR_MISS_RADIAL_MARGIN = 45`
  - `LASER_NEAR_MISS_RADIAL_MARGIN = 50`

---

## 5. Sistema de fragmentos y skins

Administrado por `fragment-system.js` y documentado en `GUIA_SKINS.md`. Las skins se dividen en:

- **Rueda (`rolling: true`)**: giran continuamente como una llanta según la dirección. No requieren
  assets de lados específicos (ej. dona, planetas).
- **Lados (skins con perfil):**
  - *Simétricas*: usan un solo archivo `skin_[nombre]_lado.png`; el código lo voltea automáticamente
    hacia la izquierda.
  - *Asimétricas*: requieren archivos separados `_lado_derecho.png` y `_lado_izquierdo.png`.
- **Regla crítica:** las hitboxes son siempre circulares y uniformes; los accesorios visuales de las
  skins no afectan las colisiones del juego.

---

## 6. Motor de audio y optimización

- **Audio pooling (`window.playSfx`)**: mantiene un pool dinámico (`SFX_POOL_SIZE = 4`) por cada
  efecto de sonido, permitiendo ráfagas continuas (láseres, clics de UI) en móviles sin cortes ni
  latencia de carga.
- **Volúmenes nativos**: SFX inicializado en 0.75; Música en 0.45.
- **Canvas estáticos (offscreen)**: el fondo geométrico del túnel de cada nivel se pre-renderiza de
  forma asíncrona en un canvas oculto y luego se dibuja ya rotado (según `worldRotation`) en el
  canvas principal, evitando caídas de FPS.

---

## 7. Persistencia de datos y trucos (`playerData`)

Guardado local en `localStorage`:
- `deadCoins`: monedas acumuladas (afectado por el modo de desarrollo `window.infiniteCoinsMode`).
- `gems`: rubíes acumulados.
- `totalXP`: experiencia acumulada gestionada por el sistema de rangos.
- **Huevo de Pascua**: si el nombre del jugador ingresado es exactamente "LEX", el juego establece
  los recursos al máximo (999999) automáticamente.

---

## 8. Catálogo maestro de potenciadores (22 totales)

Organizados por categoría, con color único de hexágono e IDs reales de `powerups.js`.
Cada uno escala de nivel 1 a 6 (salvo excepción indicada).

### 🛡️ Defensivos (9)

| # | Nombre | ID | Color | Descripción / tope de nivel |
|---|---|---|---|---|
| 1 | Protección | `proteccion` | `#AAE3D8` | Escudo temporal, invulnerabilidad total. Tope: 4.2s + escudos adicionales |
| 2 | Fantasma | `fantasma` | `#DEAAF0` | Intangibilidad temporal. Tope: mayor duración + usos adicionales |
| 3 | Vida Extra | `vida_extra` | `#DE21C8` | Vidas adicionales. Tope: hasta 3 vidas extra + escudo reforzado |
| 4 | Ángel Guardián | `angel_guardian` | `#4BC0EB` | Resurrección automática al recibir golpe fatal. Tope: revive con 4 vidas |
| 5 | Burbuja Fantasma | `burbuja` | `#FF6EB4` | Burbuja protectora que bloquea impactos. Tope: también atrae monedas cercanas |
| 6 | Salto Cuántico (Dash) | `dash` | `#4E2A84` | Desplazamiento instantáneo sobre la órbita. Tope: 5 cargas por partida |
| 7 | Cápsula de Rebobinado | `rebobinado` | `#00A896` | Guarda tu estado; si mueres en la ventana activa, regresas al punto. Tope: 9s de registro |
| 8 | Gravedad Cero | `gravedad_cero` | `#7CB342` | Flotas en el centro de la pista evitando peligros. Tope: movimiento normal mientras flota |
| 9 | Sombra | `sombra` | `#2D2D2D` | Clon protector que absorbe golpes fatales. Tope: también ayuda a recoger monedas |

### ⏱️ Control y espacio (7)

| # | Nombre | ID | Descripción / tope de nivel |
|---|---|---|---|
| 10 | Hora de Parada | `stop_time` | Detiene el movimiento de obstáculos. Tope: mayor duración y múltiples usos |
| 11 | Cámara Lenta | `camara_lenta` | Reduce la velocidad del mundo. Tope: ralentización prolongada |
| 12 | Destrucción Letal | `destruccion_letal` | Desactiva una zona de la órbita. Tope: área segura más amplia y duradera |
| 13 | Caos | `caos` | Invencibilidad + vidas extra. Tope: invencibilidad prolongada + múltiples vidas |
| 14 | Sobrecarga | `sobrecarga` | Incrementa la velocidad del jugador. Tope: sin penalización de aturdimiento |
| 15 | Onda Repulsora | `onda_repulsora` | Empuja los obstáculos lejos del jugador. Tope: afecta casi toda la pantalla |
| 16 | Tormenta de Clavos | `tormenta_clavos` | Proyectiles radiales que destruyen obstáculos. Tope: gran cantidad de clavos + ráfagas extra |

### 💰 Utilidad y economía (5)

| # | Nombre | ID | Descripción / tope de nivel |
|---|---|---|---|
| 17 | Imán | `iman` | Atrae monedas cercanas. Tope: recoge monedas de toda la pantalla |
| 18 | Monedas x2 | `monedas_x2` | Multiplica recompensas. Tope: bonificaciones masivas de monedas y gemas |
| 19 | Punto de Teletransporte | `teletransporte` | Marca una ubicación y regresa a ella. **Tope máximo: nivel 3** (no escala a 6) |
| 20 | Lluvia de Oro | `tierra` | Transforma obstáculos en recompensas. Tope: alta probabilidad de gemas |
| 21 | Espejo de Rubíes | `espejo_rubies` | Convierte monedas obtenidas en rubíes temporalmente. Tope: duplica rubíes visibles al activarse |

### ⚠️ Alto riesgo (1)

| # | Nombre | ID | Descripción / tope de nivel |
|---|---|---|---|
| 22 | Súper Vínculo | `super_vinculo` | Clon opuesto que multiplica recompensas; los errores del clon afectan al jugador. Tope: x6 recompensas sin daño compartido |

**Resumen:** Defensivos 9 · Control y Espacio 7 · Utilidad y Economía 5 · Alto Riesgo 1 — **Total: 22**

---

## ⚠️ Reglas estrictas para la IA al modificar este proyecto

1. No rompas la compatibilidad con `window.canvasDPR` al redimensionar elementos o calcular
   posiciones táctiles en el Canvas.
2. Si añades o modificas obstáculos, debes invocar obligatoriamente `window.onNearMiss()` usando los
   umbrales de margen establecidos en `combo-system.js`.
3. Respeta siempre el flujo del ciclo de vida controlado por `window.running` y `window.paused`.
4. Las nuevas skins con propiedad `rolling: true` **no** deben registrarse en `skins-side.js`, de
   acuerdo con la guía arquitectónica oficial del proyecto (`GUIA_SKINS.md`).
5. Los textos de UI editables viven en `GEM_CONFIG.textos` (`textgemconfig.js`); los tamaños,
   paddings y responsive viven en `GEM_LAYOUT` (`layoutconfig.js`). No hardcodear texto nuevo en
   HTML/JS si ya existe una convención de config para esa pantalla.
