# Pendientes — Sistema de Rarezas y Temporadas (THE GEM)

> Documento vivo. Se va actualizando a medida que avanzamos la reestructuración de skins/trails/banners/emotes.

---

## Estado de avance (resumen rápido)

✅ Skins — mapeo final cerrado Y **aplicado de verdad en `shop.js`** (no solo en rarities_override.js)
✅ Trails — cerrado (mapeo de rareza, sin aplicar aún lo de "ocultar sin arte")
✅ Emotes — cerrado (mapeo de rareza viejo; regla nueva de "sin rareza" ya aplicada en código)
✅ Banners — cerrado (mapeo + typos corregidos)
✅ Temporadas confirmadas: Halloween + Navidad, resto de bundles permanentes
✅ Trofeos (caballeros + comida) — arreglados en código: ya no son `vipOnly`, muestran rango/trofeo
✅ Reacomodo del menú principal de Tienda — hecho, con panel de Temporadas (placeholder vacío)
⬜ Eliminaciones (titiritero, arlequín, máscara veneciana, emote_risa, emote_risa_malvada) — pendiente
⬜ Ocultar trails sin arte (vampiro, zombie, faraón, nilo, circo, santa, mama_claus) — pendiente
⬜ Reclasificar emojis de "emote" a "skin" a nivel estructural — pendiente (hoy duplicados en ambos buckets, funciona pero no está prolijo)
⬜ Sistema técnico de temporadas real (`GEM_SEASONS`) — pendiente, el panel ya existe pero está vacío
⬜ Renombrados de id (guardián dorado→moneda_egipcia, payaso_oscuro→señor_penumbra, nocturna→frankenstein, emotes de Brifon) — para Devin
⬜ Identidad visual HUD sci-fi (paneles, tags, divisores) — en curso con otra IA, en pausa

---

## 1. Arquitectura de temporadas (código) — PENDIENTE

- [ ] Crear archivo nuevo `seasons.config.js` con un registro central `GEM_SEASONS`
- [ ] Cada temporada define: `displayName`, `startsAt`, `expiresAt`, y un `contains: { skins, trails, banners, emotes }` con los ids que le pertenecen
- [ ] Generalizar la función que ya usan los banners (`getBannerActiveCategory` en shop.js) para que lea de `GEM_SEASONS` en vez de manejar `expiresAt` por separado en cada tipo de item
- [ ] Definir comportamiento al expirar: el jugador conserva lo comprado, el item solo desaparece de la tienda
- [ ] El panel "TEMPORADAS" ya vive en el hueco 2x2 de la Tienda normal (arriba a la derecha) y hoy cae en la pantalla "PRÓXIMAMENTE" al hacer click — cuando se implemente esto, hay que conectarlo ahí

## 2. Arte faltante

- [ ] Banner temático de Navidad: **"Feliz Navidad"** (DEMON, estacional) — ya reservado en rarities_override.js, falta el arte
- [ ] Banner del Pase Rubí: **"La leyenda"** (EXCLUSIVO) — ya reservado, falta el arte
- [ ] Skin propia del Pase Rubí (aparte del emote Daxor Power)
- [ ] Emotes **Brifon Power** y **Kenji Power** — recompensas de temporadas futuras del pase, se crean pero se ocultan hasta que les toque
- [ ] Bundle Dioses: agregar Atenea, Apolo, Afrodita, Hermes (ya reservados en rarities_override.js como VIP)
- [ ] Bundle Egipto: `moneda_egipcia` (ex guardián dorado) con animación de moneda girando
- [ ] Bundle Circo: `senor_penumbra` (ex payaso oscuro) con nuevo diseño de villano de circo
- [ ] Bundle Salvaje: elegir cuáles de los candidatos usar (oso, jabalí, zorro, búho, pantera, rinoceronte, cocodrilo, bisonte) para completar el bundle VIP (león/tigre/lobo salvaje/águila/ciervo)
- [ ] Fénix, Quimera, Leviatán, Grifo — pendiente resolver diseño en estilo esfera/GemPop (ver ideas dadas en el chat)

## 3. Corrección de datos — YA APLICADO ✅

- [x] Typo `EPICO` → `EPICA` corregido en `rarities_override.js`
- [x] `emote_ruby_pass_01` movido a EXCLUSIVO (se renombrará a "Daxor Power" — pendiente para Devin)
- [x] Reparto skins normal/VIP aplicado en `rarities_override.js` **y en `shop.js`** (SKINS_DATA, VIP_CAROUSEL_DATA, VIP_PACKAGES_DATA)
- [x] Caballeros bronce/plata/dorado: ya no comprables, muestran "Rango: [pendiente de texto real]" — falta que pongas el rango real de Camino de Reyes en `TROPHY_RANK_LABELS` (shop.js, cerca de la línea 25)

## 4. Eliminaciones — PENDIENTE

- [ ] `skin_titiritero`
- [ ] `skin_arlequin`
- [ ] `skin_mascara_veneciana`
- [ ] `emote_risa`
- [ ] `emote_risa_malvada`

## 5. Ocultar trails sin arte — PENDIENTE

- [ ] `trail_vampiro`, `trail_zombie` (bundle Halloween)
- [ ] `trail_faraon`, `trail_nilo` (bundle Egipto)
- [ ] `trail_circo` (bundle Circo). Nota: `trail_sonrisa_malvada` no se ocultó, sigue activo
- [ ] `trail_santa`, `trail_mama_claus` (bundle Navidad)

## 6. Reclasificar emojis — PENDIENTE

- [ ] Los 13 `emoji_*` (fachero, enamorado, asustado, skull, derretido, serio, llorando, enojado, triste, feliz, guiño, sonriente, bomito) son conceptualmente **skins**, no emotes. Hoy siguen duplicados en ambos buckets de datos (funciona, pero no está limpio)

---

## 7. Trails — mapeo final (rareza, CERRADO)

| Rareza | Trails |
|---|---|
| BASICO | none, basic |
| ESPECIAL | hielo, toxico |
| EPICA | ghost, fractura, spark |
| EPICA (bundle Espacio, sin confirmar) | trail_estrellas, trail_auroras |
| VIP (Halloween, estacional, sin arte) | trail_vampiro, trail_zombie |
| VIP (Elemental, estacional rotativo) | trail_fire, trail_water, trail_wind, trail_ice, trail_lava, trail_nature |
| VIP (permanente) | trail_custom_text |

**Orden de rotación Elemental** (ciclo de 6 meses, se repite): Fuego → Agua → Viento → Hielo → Lava → Naturaleza → (vuelve a Fuego)

**Regla de proyecto**: todo contenido nuevo es permanente por defecto. Solo entra en rotación si se le asigna explícitamente una temporada en `GEM_SEASONS`.

---

## 8. Emotes — mapeo final (CERRADO, con regla nueva aplicada)

Los emotes reales **ya NO llevan sistema de rareza** — solo marco dorado si son exclusivos del Pase Rubí, sin marco si son normales. Ya aplicado en `rarities_override.js` (valores en blanco) y en el código de shop.js.

| Grupo | Emotes |
|---|---|
| Normal (sin marco) | emote_normal, emote_saludo, emote_enojado, emote_Llorando, emote_sorprendido, emote_mudo (se renombrarán a brifon_emote_* — para Devin) |
| Exclusivo (Pase Rubí, marco dorado) | emote_ruby_pass_01 → "Daxor Power" (temporada actual) |
| Exclusivo, oculto (temporadas futuras del pase) | Brifon Power, Kenji Power (por crear) |
| Eliminar | emote_risa, emote_risa_malvada |
| Reclasificar a skin | los 13 emoji_* (ver sección 6) |

---

## 9. Banners — mapeo final (CERRADO)

| Rareza / Grupo | Banners |
|---|---|
| DEFAULT | Banner_Deafult |
| BASICO | Speed_Color (Green, Gold, Gray, Blue, Oranje, Red, Rgb, Black) |
| ESPECIAL | Speed_Color_Red_Animado, Abstracto_Fuego_Rojo, Abstracto_Lineas_Yellow, Abstracto_Rayos_Az_Rd, Abstracto_Rayos_Morados, Abstracto_Rayos_Rojos, Dark_Lineas_Blue, Dark_Ondas_Blue, Neon_Grid_Motion, Ondas_Blue |
| EPICA | Dark_Lineas_Or_Bck, Dark_Aurora_Blue, Dark_Ondas_PrAz, Speed_Color_Yellow_Animado |
| DEMON (permanente por ahora) | El_Dragon_Chino, Un_poco_de_nieve, Vacaciones_en_la_playa |
| DEMON (nuevo, estacional Navidad, sin arte) | Feliz_Navidad |
| VIP — Halloween (estacional) | Dracula_Edition, Jack_o_lantern, Zombies_Edition |
| VIP (permanente por ahora) | Un_poco_de_hielo_VIP, La_playa_relajante_VIP |
| VIP (movido a bundle Criaturas Míticas) | El_Dragon_Chino_VIP |
| EXCLUSIVO (nuevo, Pase Rubí, sin arte) | La_leyenda |

**Placeholders renombrados y asignados:**
"Poder de la realeza"→Realeza · "El gran olimpo"→Dioses · "Nuestro mejor amigo"→Salvaje · "El antiguo Egipto"→Egipto · "Un circo tenebroso"→Circo · "Mucha risa?"→Paquete Emoji · "Espacio exterior"→Espacio · "Un lugar tranquilo"→futura temporada Naturaleza · "Corta unas sandias"→Comida · "Personalízame"→feature standalone (10.000 gemas, banner personalizado, sin bundle)

---

## 10. Skins — mapeo final (CERRADO Y APLICADO EN CÓDIGO)

### Tienda normal
| Rareza | Contenido |
|---|---|
| BASICO | colores, donas de color, contornos, controlador, metalman, pichos (sin cambios) |
| ESPECIAL | comida suelta, espacio suelto, chef, cerdo, elefante, bruja (26 items — bajaron de VIP) |
| EPICA | frank, shield + chocolate, sol, luna, hamburguesa, pizza, oficios sueltos, animales sueltos, monstruos de Halloween sueltos (19 items — bajaron de VIP) |
| DEMON | kenji, brifon, daxor + samurai (bajó de VIP) |
| LEGENDARIO (trofeo, no comprable) | 3 trofeos de comida + caballero bronce/plata/dorado (trofeo de Camino de Reyes, Mapa 1 — falta poner el rango real) |

### Tienda VIP (bundles)
| Bundle | Contenido | Temporada |
|---|---|---|
| Realeza | rey, reina, bufón, emperador oscuro, príncipe helado, mago, arquera, noble | Permanente |
| Dioses (expandido) | Zeus, Hades, Poseidón, Ares, Medusa + Atenea/Apolo/Afrodita/Hermes (nuevos, sin arte) | Permanente |
| Egipto | faraón+trail, reina del Nilo+trail, moneda egipcia (ex guardián dorado), momia, momia malvada, sarcófago, escarabajo | Permanente |
| Criaturas Míticas | dragón, hydra, fénix, quimera, leviatán, grifo, minotauro, gárgola, mantícora, serpiente marina, cíclope + banner Dragón Chino VIP | Permanente |
| Circo | bufón diurno/nocturno/maldito, señor Penumbra (ex payaso oscuro), marioneta, máscara sonriente, sonrisa rota | Permanente (titiritero/arlequín/máscara veneciana: eliminar) |
| Halloween (unificado) | Drácula+trail, Zombie+trail (VIP) + calabaza/fantasma/lobo monstruo/Frankenstein (EPICA) + bruja (ESPECIAL) | **Estacional** |
| Navidad | Santa+trail, Mamá Claus+trail, reno, duende, regalo, árbol, bastón, esfera, galleta navideña, caramelo | **Estacional** |
| Salvaje | león, tigre, lobo salvaje, águila, ciervo (+ candidatos por elegir) | Permanente |
| Paquete Emoji | los 13 emoji_* (ver sección 6, reclasificar pendiente) | Permanente |
| Elemental (trails) | fuego, agua, viento, hielo, lava, naturaleza | **Estacional rotativo** |
