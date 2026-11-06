# THE GEM — Guía de traspaso para Claude (nueva sesión)

> Este documento está escrito PARA CLAUDE, no para Felipe. Es la
> memoria de cómo trabajamos juntos hasta ahora, para que una sesión
> nueva no tenga que redescubrir el ritmo de trabajo desde cero.

---

## Quién es Felipe y cómo le gusta trabajar

- Escribe en español informal, con muchos "xd", typos, y mensajes
  cortos seguidos — no corrijas su estilo, respóndele en el mismo tono
  casual (sin ser payaso, solo natural).
- **No es programador experto** pero sí entiende el juego a fondo y
  tiene buen ojo de diseño. Explícale conceptos técnicos con analogías
  cuando haga falta, pero no lo trates como si no entendiera nada.
- Le gusta que Claude **arme el plan/diseño** y que **otras IAs de
  código ejecuten** (Cursor, Kiro, y antes Devin). Claude casi nunca
  edita el código directamente — casi siempre escribe PROMPTS
  detallados para que Felipe se los pase a esas otras IAs, y luego
  Felipe trae la respuesta de vuelta para que Claude la revise.
  - Excepción: cuando Felipe sube los archivos reales y pide
    explícitamente "arréglalo tú", Claude sí edita directo (usando las
    herramientas de archivo), valida sintaxis con `node --check`, y
    entrega los archivos para descargar.
- **Le encanta que Claude proponga ideas y arme brainstorms** antes de
  construir algo grande — no lances directo a codificar sin antes
  discutir 2-3 direcciones de diseño cuando el pedido es abierto.
- Usa emojis y reacciones entusiastas ("wtf que buena idea", "SUUUU",
  "jajaja") — está bien reflejar ese entusiasmo, no hay que ser plano.

---

## Metodología de trabajo (MUY IMPORTANTE — seguir siempre)

1. **Auditar antes de tocar algo existente.** Nunca asumir cómo está
   hecho algo — pedirle a la IA de código que primero audite/reporte
   (nombres de función exactos, líneas, estructura de datos) ANTES de
   escribir instrucciones de cambio. Esto se volvió el patrón
   fundamental de todo el proyecto, después de un incidente temprano
   donde un agente borró archivos sin permiso.

2. **Dividir tareas grandes en partes numeradas**, cada una con su
   propio prompt, y pedir confirmación/resumen antes de seguir a la
   siguiente si el cambio es delicado (ej. migraciones de datos con
   jugadores reales con progreso guardado).

3. **Revisar cada resumen que trae Felipe de vuelta con ojo crítico.**
   No asumir que la otra IA lo hizo bien solo porque dice que sí — leer
   el resumen, buscar inconsistencias, confirmar que no rompió nada
   colateral (ej. detectamos varias veces bugs de "refresca la página
   equivocada al comprar desde un modal", líneas muertas que no hacían
   nada, fechas de prueba que se quedaron puestas por accidente).

4. **Ojo con archivos desactualizados.** Felipe varias veces subió una
   copia vieja de un archivo por error (shop.js o style.css de antes de
   los últimos cambios). SIEMPRE verificar con `grep`/`node --check`
   que el archivo subido tiene lo que se espera antes de asumir que es
   la versión actual — si algo no aparece que debería estar, decir
   "esto parece una copia vieja" en vez de reportar un bug falso.

5. **Nombres de archivo: sin tildes ni "ñ".** Ya causó un bug de
   encoding una vez (`Baúl` se corrompió). Siempre snake_case simple.

6. **Cuando algo es ambiguo o hay una decisión de diseño real que
   tomar (precio, estructura de datos, alcance de una feature),
   preguntar con opciones concretas** (el tool de preguntas rápidas
   con botones, no un párrafo abierto) — Felipe responde rápido y bien
   a eso, prefiere elegir entre opciones a que Claude asuma.

7. **Git**: siempre terminar con un mensaje de commit ya armado y
   listo para copiar/pegar, con resumen claro de qué cambió y por qué.

---

## Stack y convenciones del proyecto

- **THE GEM**: juego arcade sci-fi oscuro, HTML/CSS/JS + Capacitor
  (wrapper Android). Estética HUD: paneles de esquinas cortadas,
  tipografías Rajdhani + Chakra Petch, acentos neón.
- Economía dual: Coins (monedas, `localStorage 'deadCoins'`) y Gems
  (`localStorage 'gems'`, mostradas en UI como "Rubíes" — el nombre
  visual no coincide con la clave interna, es así a propósito, no es
  un bug).
- Taxonomía de rareza: BASICO, ESPECIAL, EPICA, DEMON, VIP,
  LEGENDARIO, EXCLUSIVO.
- Archivos clave: `shop.js` (el más grande, ~10-11k líneas, casi toda
  la lógica de tienda/temporadas/eventos/misiones vive ahí),
  `seasons.config.js`, `events.config.js`, `rubypass.config.js`,
  `banners.catalog.js`, `src/main.js` (loop del juego), `powerups.js`,
  `fragment-system.js`, `ui.js`, `style.css` (~16-17k líneas),
  `index.html`.

---

## Estado actual del proyecto (a la fecha de este documento)

### Sistema de Temporadas — completo
- Temporada activa: **Leyendas** (2026-07-01 a 2027-02-28). Raíces y
  Oceánica ya definidas con fechas pero sin contenido cargado todavía.
- 2 personajes con arte real: **Solmerion** (dorado) y **Zherath**
  (rojo `#E00000`, corregido desde un morado inicial). Cada uno con
  skin, trail, y 4 emotes.
- Sistema de **Packs** (vitrina "Destacados"): muestra colecciones por
  personaje. Portadas de los packs (`pack_solmerion.png`,
  `pack_zherath.png`) generadas con IA — proceso: ChatGPT con prompts
  muy específicos para lograr silueta blanca simple para íconos, y
  posters cinemáticos para las portadas de pack.
- **Marcos (Frames)**: sistema nuevo paralelo a Banners, mismo patrón
  (comprables con monedas+gemas, `missionOnly`, `passOnly` del Ruby
  Pass). Viven en `FRAMES_DATA` dentro de `shop.js`.
- **Sistema de Eventos — generalizado a Registro** (`events.config.js`,
  `GEM_EVENTS`): soporta múltiples eventos simultáneos, recompensas de
  cualquier tipo de cosmético (banner/frame/skin/trail/emote), y
  modal de historial de eventos pasados. El evento actual
  "Campeones de Leyendas" corre del 10 al 25 de agosto de 2026.
- **Racha de 20 días jugados**: sistema paralelo (no confundir con el
  Evento), otorga `banner_leyendas_racha_ganadora` +
  `Frame_Leyendas_Racha_Ganadora` al jugar 20 días distintos de la
  temporada. Tiene su propia card persistente en la página de
  Temporadas (sección "04").
- **19 métricas de misión disponibles** para armar futuros eventos sin
  escribir código nuevo: `coin_collect`, `powerup_use`, `distance`,
  `shop_purchase`, `game_win`, `games_played`, `circuit_lap`,
  `dash_use`, `chest_open`, `skin_fragment_collect`, `max_combo`,
  `playtime_seconds`, `skin_equip_distinct`, `perfect_win`,
  `level_win_id`, `coins_spent`, `gems_spent`, `rubypass_level_check`,
  `rubypass_premium_level_check`. Hay 3 "modos" de tracking: suma
  normal (`trackMissionProgress`), mejor-valor
  (`trackMissionBestValue`), y valores-únicos
  (`trackMissionUniqueValue`) — todos ya construidos y reutilizables.
- **Notificaciones locales** (Capacitor `@capacitor/local-notifications`):
  avisan 1 día antes y el día que empieza una temporada. Ya probado y
  confirmado funcionando (incluye un respaldo con la Web Notification
  API del navegador para poder probar sin generar APK, y una función
  `testSeasonNotification()` en consola para pruebas rápidas de 10s).
- **Ruby Pass**: llega hasta nivel 30 (confirmado, sin bugs). Los
  cosméticos de temporada ligados a niveles del pase (nivel 30 premium
  para Solmerion, nivel 27 free para un Frame) son alcanzables.

### Pendientes activos ahora mismo
- Felipe está mejorando el **visual del Evento** con otra IA en
  paralelo (puede pedir ayuda de Claude si se traba).
- Lore de Raíces/Oceánica: Felipe lo escribe cuando termine de pulir
  Leyendas — **no se le debe recordar**, él avisa cuando esté listo.
- Prueba general de todo el sistema desde el celular con cuenta nueva
  (en curso, sin resultados reportados aún).

### Ideas nuevas aprobadas, aún sin construir (brainstorm reciente)
1. **Reveal cinemático** al desbloquear cosméticos raros — se decidió
   la variante "silueta que se ilumina" (el PNG aparece oscuro y se
   enciende con un barrido de luz revelando los colores reales). No
   requiere animación de sprite, es efecto de luz/cámara en CSS/canvas
   sobre la imagen estática.
2. **"El Libro de THE GEM"** (nombre CONFIRMADO por Felipe, simple a
   propósito) — un códice/libro de colección holográfico-tecnológico
   (no de fantasía clásica) que muestra TODOS los cosméticos del
   juego, poseídos a color / bloqueados en silueta, con animación de
   pasar páginas y % de completitud.
3. **Cosmético "Poción/Gema de protección de racha"** — 3 variantes
   ligadas a la taxonomía de rareza existente:
   - BÁSICO "Fragmento Protector" → protege 1 día
   - ESPECIAL "Cristal Protector" → protege 3 días
   - ÉPICA "Gema Protectora" → protege 7 días
   Se activa antes de perder la racha de Misiones (como el
   "streak freeze" de Duolingo).
4. **Resumen de fin de temporada** estilo Free Fire/Spotify Wrapped:
   pantalla con estadísticas del período (partidas jugadas, victorias,
   racha más larga, cosméticos desbloqueados). Con toda la
   infraestructura de misiones/eventos ya construida, se puede armar
   sin lógica de tracking nueva, solo lectura + presentación.
5. **Botón de "bienvenida de vuelta"** estilo Clash of Clans/ruleta —
   recompensas por volver tras ausencia, complejo, no es prioridad
   inmediata pero a Felipe le interesa.
6. Screen shake / hit-stop, haptics (vibración en celular) — aceptadas,
   no prioritarias por ahora salvo haptics que Felipe quiere sí o sí
   en algún momento.
7. Rechazado explícitamente por Felipe: sonido en capas según
   intensidad (idea 4 del primer brainstorm) — no interesa, no
   proponerlo de nuevo.
8. Ya existe pero necesita pulido (no construir desde cero):
   - Calendario de regalo diario (visible en captura — sistema de 31
     días con recompensas, ya funciona pero "está simple", Felipe
     quiere mejorarlo pero no es prioridad ahora mismo).
   - Sistema de leaderboard — existe pero "no está pulido al 100%,
     le falta ajustar cosas" (sin detalle aún de qué exactamente).

---

## Cómo continuar esta conversación

Cuando Felipe abra un chat nuevo y diga algo como "¿recuerdas el
último md que hicimos?" y suba este archivo: reconoce el contexto sin
narrar que lo estás "leyendo" — actúa con la misma familiaridad que
si la conversación nunca se hubiera cortado. No repitas este documento
de vuelta a Felipe ni le expliques su propio contenido — él ya sabe lo
que dice, es su hoja de ruta contigo, no una novedad para él.
