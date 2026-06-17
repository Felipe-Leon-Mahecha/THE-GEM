# Instrucciones para crear Skins de personaje "bolita" (estilo Rey)

## 🔄 FLUJO DE TRABAJO RECOMENDADO

0. **Antes de generar el frontal, decide:** ¿este personaje será SIMÉTRICO o
   ASIMÉTRICO?
   - **Simétrico** (igual en ambos lados): genera SOLO un lateral y luego
     espejéalo (flip horizontal) en un editor de imágenes o en el código del
     juego (`flipX`/`scaleX: -1`) para tener el otro lado gratis. No hace falta
     generar los dos lados con IA.
   - **Asimétrico** (detalles únicos de cada lado, ej: arma en una mano,
     accesorio solo de un lado): necesitas DOS prompts específicos para los
     laterales, indicando explícitamente qué detalles van en cada lado (dile a
     Claude cuáles son esos detalles y te armo los 2 prompts).

1. Genera primero la **vista frontal** con el prompt completo (estilo + personaje).
2. Revisa el resultado. Si te gusta, pasa al paso 3. Si no, ajusta la descripción y repite.
3. Para la **vista lateral**, NO generes desde cero — usa la imagen frontal ya
   aprobada como referencia y pide que la rote, manteniendo diseño y colores.

### Prompt para pedir la rotación lateral (paso 3)
```
Using this exact character image as reference, generate a side profile view
of the SAME character facing right. Keep identical colors, proportions,
accessories, outfit details and art style — do not invent new elements,
do not change the design. Rotate the head/body naturally; extend any hair,
hood, cape or hat smoothly to the back/side as described: [PEGA AQUÍ LA
DESCRIPCIÓN "PARTE DE ATRÁS" QUE PUSISTE EN EL PROMPT ORIGINAL]. Same lighting
direction and shading style as the reference image. Transparent background,
no text, no watermark.
```

> 🔑 **Clave:** en el prompt ORIGINAL (frontal), siempre agrega una frase corta
> describiendo cómo continúa el pelo/capucha/capa hacia atrás. Así, cuando pidas
> el lateral, la IA ya tiene esa info y no improvisa algo feo en la parte trasera.
>
> Ejemplo de frase a incluir: *"the hair/hood continues smoothly around the back
> of the head in the same color and texture, no abrupt cuts or strange shapes."*

---

## 🔵 ESTILO BASE (usar siempre, no cambiar)

```
A 2D fantasy GAME ICON of a sphere/ball-shaped character — graphic illustration
style, NOT a realistic digital painting and NOT a photo-textured creature
portrait. Every shape (hair, face features, accessories) is drawn as a clean
defined silhouette outlined with a THICK, BOLD, CONSISTENT BLACK OUTLINE —
this outline must be clearly visible around the entire character and around
every major internal shape, just like a comic/sticker illustration. Shading is
SIMPLE CEL-SHADING: each shape filled with a base color plus 1-2 extra tonal
layers for light/shadow (soft gradient or soft-edged shadow shapes), NOT
detailed painterly brushwork, NOT realistic skin/material texture. Add subtle
specular highlight (a clean light shape) on the upper-left of the sphere and
on glossy accessories (metal, gems) for a polished look. Expressive eyes with
clear shapes and a small gloss dot — characterful, slightly stylized, like a
high-quality mobile game character-select icon (think Brawl Stars / Clash
Royale rendering level, detailed but graphic, not photoreal). Centered
composition, isolated on transparent background (PNG), no text, no watermark,
1024x1024.
```

---

## ✏️ MINI-TEMPLATE PARA PERSONAJE NUEVO (rellena y pega tras el ESTILO BASE)

```
[ESTILO BASE] +

Character: [Tema/concepto del personaje en 1 línea, ej: "A karate fighter"].
[Color base de la esfera + cómo continúa atrás el pelo/casco/capucha si aplica].
[Accesorios principales: cinturón, banda en la cabeza, guantes, etc — con su
color y un detalle de brillo/sombra].
[Expresión facial / ojos].
[Detalles extra distintivos, máx 2-3].

View: front-facing, character looking directly at the camera, centered pose.

Avoid: realistic digital painting, photo-textured skin, soft painterly
brushwork, missing or thin outlines, extra limbs, text, watermark.
```

---

## 🎨 TRANSFERENCIA DE ESTILO (para personajes YA EXISTENTES que quieres pasar al "Estilo Orbe THE GEM")

Sube la imagen del personaje viejo y pega esto — no hace falta rediseñar desde cero:

```
Using this image as reference, redraw this EXACT same character (same colors,
same accessories, same pose, same proportions, same design elements) but in a
NEW rendering style:

A 2D fantasy GAME ICON of a sphere/ball-shaped character — graphic illustration
style, NOT a realistic digital painting and NOT a photo-textured portrait.
Every shape (hair, face features, accessories) is drawn as a clean defined
silhouette outlined with a THICK, BOLD, CONSISTENT BLACK OUTLINE — this outline
must be clearly visible around the entire character and around every major
internal shape, just like a comic/sticker illustration. Shading is SIMPLE
CEL-SHADING: each shape filled with a base color plus 1-2 extra tonal layers
for light/shadow (clean soft-edged color blocks), NOT detailed painterly
brushwork, NOT realistic texture. Add subtle specular highlight (a clean light
shape) on the upper-left of the sphere and on glossy accessories (metal, gems)
for a polished look.

Do NOT change what the character IS — only change HOW it's drawn/rendered to
match this new style. Same transparent background, no text, no watermark,
1024x1024.
```

> Si el resultado pierde algún detalle importante, pídele en un segundo mensaje:
> *"Keep this new style, but make sure [detalle específico] is still visible,
> exactly like in the original reference image."*

---

## 📝 NOTAS GENERALES

- Si el resultado sale "plano", agrega al final: *"add more dramatic painterly
  shading, gloss and depth like a painted 3D render — match the rendering
  quality of a polished mobile game icon."*
- Si los elementos se ven "pegados" (stickers separados), agrega: *"all elements
  must share the same lighting direction, shading style and line weight — make
  it look like ONE cohesive painted character, not separate layered pieces."*
- Para personajes con elementos detrás de la cabeza (capuchas, sombreros, pelo
  largo), SIEMPRE incluye una frase sobre cómo se ve la parte de atrás — esto
  evita resultados raros cuando luego pidas la vista lateral.
