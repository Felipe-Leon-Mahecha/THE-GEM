# PLAN — Rediseño visual de la Máquina de Recompensas (Ruleta Diaria)

> Este documento es para pasarle a la IA de código (Cursor/Kiro/etc). Contiene
> el plan completo. Seguir el orden de las fases y NO tocar código antes de
> completar la Fase 1 (auditoría).

---

## Contexto

La Ruleta Diaria de THE GEM ya está migrada visualmente al concepto de
"máquina" (marco "THE GEM", grilla de íconos arriba, franja de íconos abajo,
botón de girar). Funciona bien, pero visualmente se ve plana: los íconos
están en cuadros separados y ordenados, como una grilla de inventario, no
como objetos reales tirados/amontonados dentro de una máquina física. Además,
el ícono que aparece en la pantalla de resultado ("ganaste tal cosa") no
coincide visualmente con los íconos mostrados en la máquina.

Referencia visual: capturas de pantalla del modal `RULETA DIARIA` (estado
antes de girar y estado de resultado tras ganar 100 monedas).

---

## Objetivo

1. Que los íconos de premios se vean como objetos físicos amontonados dentro
   de la vitrina de la máquina (rotaciones leves, superposición parcial,
   tamaños ligeramente variables) — no en una grilla ordenada de cuadros.
2. Agregar una animación de mecanismo tipo **brazo robótico** que, al
   resolverse el giro:
   - baja y "agarra" el ícono del premio ganador,
   - lo levanta,
   - lo desliza lateralmente hacia el cuadro de recompensa,
   - lo suelta/deja caer dentro del cuadro,
   - el cuadro de recompensa reacciona (glow/pulso) confirmando el premio.
3. Que el ícono mostrado en la pila coincida siempre con el ícono real del
   premio ganador (corregir el mismatch actual).

**Restricciones del proyecto (no negociables):**
- Sin emojis decorativos — todo dibujado en CSS/SVG.
- Nombres de archivo/clases nuevas: snake_case, sin tildes ni "ñ".
- La lógica de qué premio se gana (probabilidades, tabla de recompensas) NO
  cambia — esto es puramente visual/animación.

---

## Fase 1 — Auditoría (hacer PRIMERO, no tocar código todavía)

Antes de escribir una sola línea, reportar:

1. Nombre exacto de la función/módulo que renderiza el modal de la Ruleta
   Diaria (¿está en `shop.js`? ¿archivo aparte?).
2. Estructura de datos de los premios (array/objeto), y de dónde salen los
   íconos que se muestran arriba y abajo en la máquina.
3. Función que determina el premio ganador (dónde vive la lógica de
   probabilidad/resultado) y cómo se comunica ese resultado al front para
   pintarlo.
4. Clases CSS actuales usadas para el layout de la grilla de íconos y para
   la animación existente al ganar (si hay alguna transición ya).
5. Confirmar si existe ya algún elemento tipo "cuadro de recompensa" donde
   cae el premio, o si hay que crearlo desde cero.
6. Confirmar si hay una sola instancia de esta máquina en el juego o varias
   (para saber si el cambio se replica en más de un lugar).

Entregar este reporte antes de seguir a la Fase 2.

---

## Fase 2 — Composición del "pilón" de objetos

- Reemplazar la grilla ordenada de íconos por un posicionamiento tipo
  desorden curado: cada ícono con una posición fija pero con rotación leve
  (`-8deg` a `8deg`), ligera superposición entre ellos, y variación sutil de
  tamaño (±10-15%), simulando que están tirados/amontonados dentro de la
  vitrina.
- Mantener el marco "THE GEM" y la estructura general del modal — solo
  cambia cómo se posicionan los íconos dentro de la vitrina.
- Evitar random real en cada render (rompería consistencia visual entre
  sesiones) — usar un set de posiciones/rotaciones predefinidas que se vean
  naturales, no una grilla.

---

## Fase 3 — Mecanismo (brazo robótico)

- Elemento CSS-only (sin imágenes nuevas) que simule un brazo robótico:
  base articulada + pinza/garra simple, estilo sci-fi acorde a la estética
  HUD neón del juego (nada de peluche/arcade clásico).
- Secuencia de animación al resolverse el giro:
  1. El brazo baja desde arriba hacia la posición del ícono ganador dentro
     del pilón.
  2. La pinza se cierra sobre el ícono (el ícono correcto, ya determinado
     por la lógica existente — no hay randomización visual acá).
  3. El brazo sube con el ícono sujeto.
  4. Se desliza lateralmente hacia el cuadro de recompensa.
  5. La pinza se abre y el ícono cae dentro del cuadro.
  6. El cuadro de recompensa pulsa/brilla confirmando el premio, y ahí se
     muestra el texto actual ("100 monedas", "Para el bolsillo, no está
     mal.", etc.) sin cambios de copy.
- Timing sugerido: 2-3 segundos en total la secuencia completa, sin sentirse
  lenta ni cortada.

---

## Fase 4 — Sincronizar ícono ganador con lo mostrado

- Verificar que el ícono que el brazo agarra dentro del pilón sea el MISMO
  ícono/asset que se muestra en la pantalla de resultado (actualmente no
  coinciden). Esto es un fix, no una feature nueva.

---

## Fase 5 — Pulido final

- Probar en viewport mobile (el juego corre como APK vía Capacitor).
- Si el tiempo lo permite: sonido o haptic al momento de la caída del ícono
  en el cuadro (no prioritario, solo si es fácil de enganchar con lo que ya
  exista de sonido en el proyecto).

---

## Entregable esperado de la IA de código

- Reporte de auditoría (Fase 1) antes de tocar nada.
- Resumen de qué archivos y funciones/clases se modificaron o crearon en
  cada fase.
- Confirmación explícita de que la lógica de probabilidad/premio no se
  tocó, solo la capa visual.
- Mensaje de commit listo para copiar/pegar al final.
