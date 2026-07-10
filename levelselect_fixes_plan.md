# Plan de correcciones — Level Select (THE GEM)

No es refactor completo, son ajustes puntuales sobre lo que ya existe. Vamos por partes.

---

## Parte 1 — Sidebar con imagen de fondo
**Problema:** el sidebar izquierdo usa un canvas de estrellas generado por JS. Ya hay un PNG diseñado para eso (`Barra_lat_LevelSelect.png`, 240×1080px).

**Qué hacer:**
- Ubicar el canvas de estrellas del sidebar (probablemente en `levelselect.js` o `main.js`, buscar algo tipo `starsCanvas`, `drawStars`, o el `<canvas>` dentro del contenedor de la lista de niveles).
- Reemplazar el canvas (o dejarlo pero ocultarlo) por un `background-image` con el PNG en el CSS del contenedor del sidebar.
- Usar `background-size: cover` y `background-position: center` para que no se pixele en distintas resoluciones.
- Si el canvas también dibuja algo más (partículas encima de las tarjetas de nivel, por ejemplo), hay que decidir si eso se queda por encima de la imagen o se quita también.

**Necesito de ti:** el archivo(s) donde está el sidebar (HTML + CSS + el JS que dibuja el canvas), y la ruta real donde vas a poner el PNG en el proyecto.

---

## Parte 2 — Rediseñar el header ("SELECCIONAR NIVEL" + barra negra)
**Problema:** la barra negra de arriba con el título se ve plana/genérica, no combina con el resto del diseño (paneles con blur, gradientes cian).

**Qué hacer (a decidir juntos, con opciones):**
- Opción A: quitar el fondo sólido negro y dejar el título flotando con un blur/gradient sutil como los paneles de info.
- Opción B: integrar el título dentro de un panel más chico, alineado con el estilo "glassmorphism" que ya usan las cards de info (COMPLETADO, RECORD, etc).
- Opción C: mover el botón "VOLVER" para que no quede tan suelto a la derecha, quizás como icono + texto más compacto.

**Necesito de ti:** el HTML/CSS de esa barra superior (clase del contenedor del título y del botón volver).

---

## Parte 3 — Texto rotativo de "tips" / consejos
**Problema:** el texto "Inicializando sistema..." (abajo a la izquierda) debería cambiar entre varias frases tipo tip/loading, pero está fijo.

**Qué hacer:**
- Buscar dónde está ese texto (¿es parte de un sistema de logs/consola falsa del juego?).
- Crear un array de frases (tips de control, lore, curiosidades del juego, etc).
- Un `setInterval` que rote el texto cada X segundos con un fade in/out simple.
- Definir contigo la lista de frases que quieres mostrar.

**Necesito de ti:** el archivo donde vive ese elemento de texto, y si ya existe alguna lógica de "consola" o mensajes de sistema en el juego (mencionaste antes un tipo de log de eventos).

---

## Parte 4 — Botón JUGAR: posición y estilo
**Problema:** el botón está centrado abajo, algo desconectado visualmente del panel de info del nivel seleccionado (que está a la izquierda-centro).

**Opciones a evaluar:**
- Moverlo dentro del panel de info del nivel (debajo de "DESBLOQUEADO"), como parte del mismo bloque visual.
- Dejarlo abajo pero ensancharlo o alinearlo con el panel de info en vez de centrado en toda la pantalla.
- Agregar un ícono de play dentro del botón para reforzar la acción.

**Necesito de ti:** tu preferencia de las opciones (o si quieres que te proponga un mockup primero).

---

## Orden sugerido
1. Sidebar (Parte 1) — es el cambio más aislado y visual, buen primer paso.
2. Tips rotativos (Parte 3) — lógica simple, independiente del resto.
3. Header (Parte 2) — cambio de estilo, puede afectar layout.
4. Botón JUGAR (Parte 4) — depende de cómo quede el header/panel.

¿Arrancamos con la Parte 1? Pásame el archivo/carpeta del sidebar (HTML+CSS+JS del canvas de estrellas) y la ruta donde vas a guardar el PNG.
