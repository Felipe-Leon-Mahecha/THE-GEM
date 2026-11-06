# THE GEM — Manual de Método para Generar Personajes/Skins (para otra IA)

Este documento es una guía operativa para que otra IA (u otra sesión de Claude) genere prompts de personajes para THE GEM en el mismo estilo y con el mismo método de trabajo que ya se usó exitosamente. No es un resumen de roster — es el "cómo trabajar", para que cualquier IA que lo lea pueda replicar el proceso sin repetir los errores ya corregidos.

Felix (el desarrollador) subirá imágenes de referencia de personajes ya aprobados junto con este documento. Úsalas como ejemplo visual de la fórmula descrita abajo.

---

## 1. LA FÓRMULA VISUAL BASE ("personaje bolita")

Todo personaje de THE GEM (salvo los de la carpeta Creatures, ver sección 4) sigue esta estructura obligatoria:

1. **Silueta = una sola esfera continua 1:1.** Nunca un busto/torso con cuello y hombros realistas. La cara es PEQUEÑA (aprox. 35-40% del ancho de la esfera) y centrada — no un rostro grande y detallado tipo retrato. Cabeza + cuerpo/capa/collar deben leerse como UN SOLO círculo, nunca como dos círculos apilados (cabeza y cuerpo separados por una "cintura" o cuello visible).
2. **Ojos: formas sólidas geométricas.** Nunca ojo humano realista con iris+pupila+brillo+pestañas+cejas peludas. Rendijas, diamantes, óvalos alargados — siempre planos, sin gradiente ni glow.
3. **Cero rasgos humanos realistas** en el resto de la cara — sin mejillas sombreadas, sin arrugas, sin anatomía facial detallada. Nariz y boca solo si el personaje lo requiere, y siempre como formas simples y planas.
4. **Cel-shading duro y plano.** Máximo 2-3 tonos por color (base, sombra, un highlight diagonal limpio). CERO gradientes suaves tipo airbrush, cero glow/brillo difuso.
5. **Elementos que rompen la silueta circular hacia afuera** (corona, cuernos, capa, alas, pelo, cabello de serpientes, etc.) — deben sobresalir claramente del círculo base, no quedar contenidos dentro. Dar padding extra en el prompt para que la IA de imagen no los recorte.
6. **Contorno negro grueso** en todas las formas, estilo cómic/sticker.
7. **La fusión cabeza-cuerpo debe ser sin costura.** La capa/collar/cuello se funde directamente en la curva de la cabeza, sin línea de corte visible, sin "cuello" ni "hombros" que rompan la sensación de esfera única.

## 2. ERRORES COMUNES Y CÓMO EVITARLOS (aprendidos en la práctica)

- **"Dos bolitas apiladas"**: el error más recurrente. Pasa cuando el prompt describe cabeza y capa/traje como piezas separadas ("head... then a cape below..."). Solución: describir explícitamente que todo es UNA esfera con superficies pintadas encima, o forzar frases tipo "fuses seamlessly with no visible neck/seam/gap". Si after varios intentos la IA sigue partiendo el diseño en dos, cambiar de estrategia: adjuntar como imagen de referencia un personaje que sí lo logra bien (ej. un personaje con corona+capa ya aprobado) y pedir que copie ÚNICAMENTE la técnica estructural, no el tema/colores.
- **Cara "vacía" o demasiado simple**: si se empuja demasiado el minimalismo ("flat, no detail"), la IA puede eliminar rasgos necesarios (nariz, boca, textura). Hay que calibrar: plano en el SOMBREADO, pero con suficiente detalle en las FORMAS.
- **Perfil que "no rota" (queda casi frontal)**: pedir explícitamente "like a coin-profile portrait", "exactly 90 degrees, NOT a 3/4 view", y si no funciona a la primera, reforzar la instrucción repitiéndola con más énfasis.
- **Perfil deforme por mal manejo de elementos asimétricos** (alas, un solo cuerno visible, etc.): siempre especificar QUÉ elemento se ve del lado cercano y QUÉ elemento queda oculto detrás de la cabeza. Nunca dejarlo ambiguo.
- **Personajes asimétricos requieren DOS prompts de perfil** (uno mirando a cada lado), especificando en cada uno qué detalle asimétrico corresponde a ese lado. Personajes simétricos solo necesitan un prompt (se espeja en post-producción).
- **Correcciones puntuales sobre una imagen ya generada**: siempre acotar "keep everything exactly the same — [lista de elementos] — only fix: [problema puntual]". Sin ese acotamiento, la IA reinterpreta el personaje entero y se pierde consistencia.
- **Elementos que deberían romper la silueta pero quedan contenidos dentro**: hay que decir explícitamente que deben sobresalir "clearly past the circular silhouette", con padding extra.

## 3. MÉTODO DE TRABAJO CON FELIX

- Felix comunica en español informal (xd, jeje, wtf), casual, directo. Responder en el mismo tono, sin formalismos.
- Felix prueba cada prompt con una IA de generación de imágenes externa (no esta sesión) y sube el resultado como imagen para evaluar.
- El flujo típico es: 1) dar prompt "desde 0" para un personaje nuevo, 2) Felix genera y sube resultado, 3) dar feedback puntual y prompt de corrección (nunca regenerar desde cero salvo que Felix lo pida explícitamente), 4) repetir hasta aprobación, 5) recién ahí generar la versión de perfil/lateral.
- Cuando Felix aprueba ("ese es!!", "ya lo guardé", "quedo!!!"), pasar al siguiente personaje sin insistir en el ya cerrado.
- Si un diseño no funciona tras 2-3 intentos de corrección, ofrecer la opción de descartarlo/eliminarlo del roster en vez de seguir iterando indefinidamente (ya pasó con la Hidra y la Mantícora original — se descartaron y no pasa nada).
- Colores/gemas: evitar repetir combinaciones ya muy usadas en el roster existente (diamante rojo facetado está sobreusado, por ejemplo) — sugerir alternativas cuando se detecte repetición.

## 4. EXCEPCIÓN DE ESTILO: carpeta "Creatures"

Los personajes de la carpeta Creatures (dragón, cíclope, grifo, hidra/descartada, leviatán, mantícora, minotauro, quimera, gárgola, serpiente marina, fénix) usan un SUBESTILO distinto llamado "cristalino/facetado":

- El cuerpo/piel/pelaje se renderiza como facetas angulares grandes tipo gema tallada (cada faceta con su propio contorno negro y color plano), NO como una malla low-poly de triángulos chiquitos sin contorno propio.
- Sigue siendo cel-shading duro, sin gradientes ni glow.
- La densidad de facetas debe calibrarse: ni tan densa que se vea como malla 3D, ni tan simple que pierda personalidad — apuntar a facetas grandes y legibles, densidad similar a la referencia del dragón (el primer diseño exitoso de esta categoría).
- El borde exterior de la silueta debe estar formado por las puntas de las facetas mismas (irregular, dentado), NUNCA por un contorno circular liso dibujado por separado detrás de la textura — este es un error muy común a vigilar.
- Este subestilo NO aplica a personajes Royal/humanos (reyes, reinas, bufones, caballeros, dioses egipcios/griegos, etc.), que usan la fórmula base de la sección 1.

## 5. TEMAS/CATÁLOGOS EN CURSO

El roster se organiza en catálogos temáticos que se trabajan de a pocos personajes por vez (Felix pide "hagamos 3" o similar, no el catálogo entero de una sola vez):

- **Royal/Humano** (base): reyes, reinas, bufones, caballeros, arqueros — carpeta "Royal".
- **Creatures** (subestilo facetado): bestias mitológicas — carpeta "Creatures".
- **Carnaval Oscuro**: personajes de payasos/carnaval tenebroso (máscaras, arlequín, titiritero, etc.) — usan la fórmula base (sección 1), con paletas de color cuidadosamente diferenciadas entre sí para que no se confundan visualmente en el shop.
- **Dioses/Egipto** (en curso, mezclado por ahora en un mismo catálogo pero son dos temas distintos: dioses griegos como Zeus/Ares/Hades, y temática egipcia como Faraón/Momia/Escarabajo/Reina del Nilo/Sarcófago): usan la fórmula base (sección 1).

Cuando se te pida seguir un catálogo, generar solo la cantidad de personajes que Felix pida (usualmente 2-4 por tanda), nunca el catálogo completo de una sola vez salvo que lo pida explícitamente.

## 6. PROCESO PASO A PASO PARA UN PERSONAJE NUEVO

1. Identificar a qué catálogo/subestilo pertenece (Royal base, Creatures facetado, etc.).
2. Diseñar la identidad visual única del personaje (evitar repetir combos de color/gema ya usados en el roster).
3. Escribir el prompt "desde 0" siguiendo la fórmula de la sección correspondiente, siendo MUY explícito en: silueta 1:1, proporción cara-pequeña-centrada (si aplica), qué rompe la silueta y por dónde, paleta de colores, estilo de renderizado.
4. Esperar el resultado de Felix. Si hay problemas, dar corrección puntual (nunca regenerar todo salvo pedido explícito).
5. Una vez aprobado el frontal, generar el/los prompt(s) de perfil lateral (1 si es simétrico, 2 si es asimétrico — especificando qué se ve/oculta en cada lado).
6. Marcar el personaje como cerrado y pasar al siguiente.
