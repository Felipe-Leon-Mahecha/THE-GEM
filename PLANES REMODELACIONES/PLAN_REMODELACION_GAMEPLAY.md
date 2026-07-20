# Handoff técnico — Rework de render visual de THE GEM

> Este documento es para que OTRA IA retome este trabajo específico sin
> perder contexto, si la sesión anterior se corta. Está escrito para ti,
> asistente — no es explicación para el usuario. Léelo completo antes de
> tocar código o pedir archivos que ya están descritos aquí.

## 1. Qué es el proyecto

**THE GEM**: juego 2D arcade/survival hecho en HTML5 Canvas + JS ES6,
empaquetado con Capacitor para móvil. Mecánica central: el jugador orbita
entre un núcleo interior (`BASE_RADIUS`) y una cúpula exterior
(`DOME_RADIUS`), esquivando trampas (púas/sierras/láseres) mientras
recolecta monedas/gemas. Nivel se gana a los 133s.

Archivo principal de render: **`main.js`** (raíz del proyecto, cargado
como `<script src="src/main.js">` según el index). No existe `config.js`
único — está separado en un config de layout y un config de texto (el
usuario no dio los nombres exactos de esos archivos todavía).

## 2. El problema original (ya diagnosticado y parcialmente resuelto)

El juego dibuja el marco (aro exterior), el núcleo (core) y el fondo del
túnel como imágenes PNG. La física/colisión usa geometría matemática pura
(`BASE_RADIUS`, `DOME_RADIUS`, ángulos). El bug: el código dibujaba esos
PNG con `drawCenteredImage()` usando multiplicadores arbitrarios ("a ojo")
sin ningún `clip()` que forzara el borde visible a coincidir con el radio
real. Resultado: el jugador se veía "hundido" en el aro, y había huecos
entre capas.

## 3. Cambios YA aplicados en el código (no repetir, no revertir sin razón)

Dos parches quirúrgicos en `main.js`, ambos ya verificados con `node -c`
(sintaxis válida) y entregados al usuario:

### 3.1 — CORE, dentro de `buildStaticCanvas()` (~línea 328-350 en la última
versión conocida, puede moverse si el usuario edita el archivo)

Se agregó un `clip()` circular exacto a `BASE_RADIUS` antes de dibujar
`coreImg`, y se cambió el tamaño de dibujo de `BASE_RADIUS * 2.2` a
`BASE_RADIUS * 2` (diámetro exacto, ya no un multiplicador inventado):

```js
if (coreImg) {
    offCtx.save();
    offCtx.beginPath();
    offCtx.arc(0, 0, window.BASE_RADIUS, 0, Math.PI * 2);
    offCtx.clip();
    drawCenteredImage(
        offCtx, coreImg, 0, 0,
        window.BASE_RADIUS * 2, window.BASE_RADIUS * 2,
        visual.coreScale ?? 1, visual.coreOffsetX || 0, visual.coreOffsetY || 0
    );
    offCtx.restore();
} else { /* fallback de gradiente sin cambios */ }
```

### 3.2 — MARCO, dentro de `draw()`, sección "6) MARCO"

Se agregó un `clip()` tipo dona (evenodd) que fuerza el borde INTERNO del
marco a `DOME_RADIUS` exacto. El límite exterior del clip es todo el
canvas (`ctx.rect(0,0,canvas.width,canvas.height)`) — NO usar un círculo
como límite exterior, se probó con `DOME_RADIUS * 1.8` y se cambió a rect
completo para evitar recortar el aro si `frameSize`/`frameScale` lo agranda:

```js
if (window.running && frameImg) {
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, canvas.width, canvas.height);
    ctx.arc(cx, cy, window.DOME_RADIUS, 0, Math.PI * 2, true);
    ctx.clip("evenodd");
    const marcoSize = window.DOME_RADIUS * (visual.frameSize || 2.28);
    drawCenteredImage(ctx, frameImg, cx, cy, marcoSize, marcoSize, visual.frameScale ?? 1, visual.frameOffsetX || 0, visual.frameOffsetY || 0);
    ctx.restore();
}
```

Justo después de ese bloque se agregó un overlay de debug, apagado por
defecto, que el usuario activa desde la consola del navegador con
`window.DEBUG_RADII = true`:

```js
if (window.running && window.DEBUG_RADII) {
    ctx.save();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "lime";
    ctx.beginPath(); ctx.arc(cx, cy, window.DOME_RADIUS, 0, Math.PI * 2); ctx.stroke();
    ctx.strokeStyle = "red";
    ctx.beginPath(); ctx.arc(cx, cy, window.BASE_RADIUS, 0, Math.PI * 2); ctx.stroke();
    ctx.restore();
}
```

**No tocar el túnel/fondo (`sphereBgImg`) ni el gradiente del túnel** —
esos YA estaban bien hechos desde antes (con `clip("evenodd")` correcto
usando `BASE_RADIUS`/`DOME_RADIUS` reales). No son parte del bug.

## 4. Herramienta de verificación creada: `check_asset_geometry.py`

Script Python (usa `pillow` + `numpy`) que analiza un PNG y mide:
- Si el contenido no transparente está centrado en el lienzo.
- Circularidad del contorno exterior (bounding box ancho vs alto).
- **Análisis radial (72 rayos desde el centro)**: mide el radio interior
  (si es tipo anillo/dona) y exterior REAL como % de `min(ancho,alto)/2`
  del lienzo, y su variación entre direcciones (detecta bultos).

Uso: `python check_asset_geometry.py archivo.png`

## 5. Hallazgos ya medidos sobre los assets del nivel 1 (con el script)

Corridos contra `Marco_Nvl_1.png` (1254x1254), `Nucleo_Meteoro_Nv1.png`
(381x375), `Fondo_Esfera_Nvl_1.png` (1024x1024) — los tres YA tienen
transparencia real y buen centrado/circularidad de contorno. El hallazgo
importante:

- **CORE**: el contenido real solo llega al **95.8%** del radio que el
  código asume (100%). Esto deja un anillo transparente de ~4.2% de
  `BASE_RADIUS` entre el borde del core y el inicio del túnel — es la
  causa confirmada del "hueco" grisáceo que el usuario reportó cerca del
  centro/arriba del nivel 1.
- **MARCO**: agujero interior real ≈ 79.5% del lienzo, borde exterior real
  ≈ 93.6% (medido ANTES de aplicar el fix, sobre la imagen fuente cruda,
  no sobre el resultado ya clippeado en juego).
- **FONDO**: agujero interior real ≈ 39.1%, borde exterior ≈ 98.3%.

**Fix rápido pendiente de confirmar con el usuario**: agregar
`coreScale: 1.045` (≈ 100/95.8) en la config visual del nivel 1 para
compensar el core mientras no se regenera el asset. Esto NO se ha
aplicado en código todavía — queda como próximo paso si el usuario lo
pide.

## 6. Decisión de fondo del usuario: regenerar los assets con IA

El usuario decidió no solo parchar en código, sino regenerar los PNG de
marco/core/fondo de cada nivel con una IA generadora de imágenes, con
especificación técnica estricta (lienzo cuadrado, fondo transparente real,
círculo centrado, radios en % fijos e iguales entre niveles). El plan
completo con los prompts exactos ya se le entregó en el archivo
**`plan-reconstruccion-assets-the-gem.md`** (ya generado y entregado al
usuario, no hay que rehacerlo desde cero — solo consultarlo si hace falta
ajustar algo).

## 7. Estado actual / próximos pasos posibles

- [x] Diagnóstico de causa raíz (código sin clip)
- [x] Fix de CORE con clip exacto
- [x] Fix de MARCO con clip tipo dona
- [x] Overlay de debug `DEBUG_RADII`
- [x] Fusión de los fixes con cambios paralelos que el usuario hizo en su
      copia de `main.js` (sin pisar nada de ninguno de los dos lados)
- [x] Script `check_asset_geometry.py` para medir geometría real de PNGs
- [x] Plan `.md` con prompts de IA para regenerar assets
- [ ] Aplicar `coreScale` de compensación en config del nivel 1 (o esperar
      a que el usuario regenere el asset del core)
- [ ] El usuario aún no confirmó si el hueco desapareció después del
      último fix de MARCO (límite exterior ampliado a rect completo) — no
      hay captura de pantalla posterior a ese cambio todavía
- [ ] Nivel 1 aún no se ha usado como piloto completo del plan de
      regeneración de assets (paso pendiente, ver sección 6)
- [ ] Niveles 2 en adelante: no se ha tocado nada, mismo bug probablemente
      presente ahí también (no confirmado, no hay assets ni capturas de
      otros niveles todavía)

## 8. Cómo seguir si retomas esta conversación

1. Pregunta al usuario si probó el fix del marco (límite exterior a rect
   completo) y si el hueco del core sigue apareciendo.
2. Si el hueco del core sigue, aplica el `coreScale: 1.045` mencionado en
   la sección 5 directamente en la config visual del nivel 1 (pide el
   archivo de config si no lo tienes en contexto — el usuario mencionó que
   layout y texto están en archivos separados, no en un `config.js` único).
3. Si el usuario ya generó nuevos assets con el plan de la sección 6,
   corre `check_asset_geometry.py` contra ellos antes de integrarlos.
4. No reinventes el diagnóstico — ya está hecho y confirmado con datos
   reales, no hace falta volver a pedir capturas de pantalla del problema
   original.
