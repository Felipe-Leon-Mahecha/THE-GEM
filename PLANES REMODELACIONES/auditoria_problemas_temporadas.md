# THE GEM — Auditoría de Temporadas/Eventos: problemas encontrados

> Generado tras revisar `shop.js`, `style.css`, `rubypass.config.js` y
> `seasons.config.js` actuales del proyecto (después de que Felipe agregó
> arte real: 3 skins, 1 trail, 8 emotes, y un sistema nuevo de Marcos/Frames).
> Objetivo: que cualquier IA (Cursor/Devin/otro Claude) pueda tomar este
> documento y arreglar los puntos uno por uno, con contexto completo.

---

### 2. `banner_leyendas_racha_ganadora` y `Frame_Leyendas_Racha_Ganadora` NO tienen forma de desbloquearse — están rotos permanentemente

**Archivos:** `shop.js` (`BANNERS_DATA`/`banners.catalog.js` y `FRAMES_DATA`)

Ambos cosméticos están marcados `missionOnly: true`. El diseño original
decía "se gana jugando 20 días de la temporada", pero **esa lógica
nunca se implementó**:

- No hay ninguna función que cuente días jugados dentro de una temporada.
- No hay ningún hook que llame a `setBannerOwned()` / `equipCosmetic()`
  para desbloquear estos 2 ítems.
- No están conectados al sistema de Eventos (`SEASON_EVENT_CONFIG` solo
  referencia `banner_leyendas_campeones` y `Frame_Leyendas_Campeones`,
  NO a los de "racha_ganadora").

**Resultado actual:** estos 2 cosméticos son inalcanzables para
cualquier jugador, para siempre, tal como está el código hoy.

**Hay que decidir UNA de estas 2 rutas antes de programar nada:**

- **Solucion para arreglar:** Crear el sistema real de "días jugados en la
  temporada" — necesita: contador persistente de días únicos jugados
  (similar a la racha de sesión que ya existe en Misiones, pero scoped
  a la temporada activa), y un chequeo que otorgue el cosmético al
  llegar a 20.

**Este documento no elige por ti — es una decisión de diseño de Felipe.**
Cualquier IA que tome este punto debe preguntar antes de implementar.

---

### 4. `skin_sombra_real` no tiene opción de pago con gemas — inconsistente con Daxor

**Archivo:** `shop.js`, `SKINS_DATA` (línea ~570)

Daxor (skin existente) tiene:
```js
price: 5200, priceType: 'coins', altPrice: 170, altType: 'gems'
```

Sombra Real (skin nueva) solo tiene:
```js
price: 2500, priceType: 'coins'
```

Sin `altPrice`/`altType`, no se puede comprar con gemas. Si el patrón
del juego es que las skins de temporada compradas directamente sí
acepten gemas (como Daxor), falta agregarle esos 2 campos a Sombra Real.
**Confirmar con Felipe el precio en gemas antes de agregarlo.**

IMPORTANTE: anadir skin de DAXOR  a el apartad de TIENDA NORMAL -> TEMPORADAS -> SKINS ya que daxor hace aprte de la temporada agregale precio elevado pero no tanto

---

## 🟢 VERIFICADO — Esto SÍ está bien, no tocar

- Los IDs en `season.contains` (leyendas) coinciden EXACTAMENTE con los
  IDs reales en `SKINS_DATA`, `TRAILS_DATA`, `EMOTES_DATA`, `FRAMES_DATA`
  y el catálogo de banners. No hay IDs huérfanos ni referencias rotas
  en ese sentido.
- El campo `seasonId: 'leyendas'` se agregó consistentemente a las 3
  skins nuevas y a los 8 emotes nuevos (buena práctica, aunque
  actualmente el filtrado real de "qué pertenece a la temporada" sigue
  usando `season.contains` con arrays de IDs, no este campo — el campo
  `seasonId` por ahora es metadata informativa, no se usa para filtrar
  nada — **no es un error, solo una nota** para quien quiera usarlo más
  adelante).
- El sistema de Marcos (`FRAMES_DATA`, `getAllCosmeticCatalog('frame')`,
  `renderFrameCard`, `equipFrameFromShop`, `buyFrameFromShop`) replica
  correctamente el patrón ya usado en banners (missionOnly, passOnly,
  rubyPassLane) — arquitectura sólida, solo le falta el punto 3 (gemas).
- La 5ta categoría "MARCOS" ya está agregada al bento de la sección
  Temporadas (`category-bento` ahora tiene 5 cards: skins, trails,
  banners, marcos, emotes) y conectada a `openSeasonContentModal('frames')`.
- `SEASON_EVENT_CONFIG` ahora soporta recompensa doble (`rewardBannerId`
  + `rewardFrameId` simultáneos) — el evento de Campeones al completarse
  otorga tanto el banner como el marco a juego. Esto es una mejora
  intencional sobre el diseño original (que solo contemplaba 1 banner).
- Sintaxis de `shop.js` y `rubypass.config.js` validada sin errores.

---

## ⚪ NO VERIFICABLE — Faltan archivos para confirmar

Estos puntos requieren archivos que no estaban disponibles al hacer
esta auditoría. Quien continúe debe pedirlos:

- **`src/main.js`**: no se pudo confirmar si el hook `game_win` (para
  la misión "Gana 5 partidas" del evento) sigue presente en `winGame()`
  tal como se implementó originalmente.
- **`banners.catalog.js`**: no se pudo re-confirmar que
  `banner_leyendas_perla`/`rosaceo`/`exclusivo` sigan teniendo su
  `priceGems` (140/120/120) tal como se dejaron en la sesión anterior.
- **Archivo de configuración de niveles del Ruby Pass** (para el
  punto 7 de arriba).

---