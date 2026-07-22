// TEMPORAL: cambia aqui la calidad/rareza de cada coleccionable.
// Valores permitidos: DEFAULT, BASICO, ESPECIAL, EPICA, DEMON, VIP, LEGENDARIO, EXCLUSIVO.
// Puedes cambiar el color general de cada calidad en colors.
// EXCLUSIVO siempre usa brillo RGB y no toma color configurable.
// Cuando todo quede como quieres, podemos aplicar estos valores a shop.js y borrar este archivo.
//
// ACTUALIZADO: mapeo final de rarezas y bundles (sesion de reestructuracion completa).
// PENDIENTE (fuera del alcance de este archivo, para hacer aparte):
//   - Renombrados de id (guardian_dorado, payaso_oscuro, nocturna, emote_* de Brifon) -> para Devin
//   - Eliminaciones (titiritero, arlequin, mascara_veneciana, emote_risa, emote_risa_malvada) -> HECHO (ver shop.js)
//   - Ocultar trails sin arte (vampiro, zombie, faraon, nilo, circo, santa, mama_claus)
//   - Reclasificar emojis de "emotes" a "skins" a nivel estructural (hoy siguen duplicados
//     en ambos buckets, es intencional por ahora para no romper el lookup existente)
(function () {
    window.GEM_RARITY_OVERRIDES = {
        colors: {
            DEFAULT: "rgba(255,255,255,0.35)",
            BASICO: "#57b7dd",
            ESPECIAL: "#ff9a17",
            EPICA: "#cc44ff",
            DEMON: "#cf0000",
            VIP: "#ffee00",
            LEGENDARIO: "#8a2be2",
            // EXCLUSIVO no se cambia aqui: siempre alumbra RGB.
        },
        trails: {
            // Sin cambios: ya estaba correcto.
            "none": "BASICO", // Ninguna
            "basic": "BASICO", // Basica
            "ghost": "EPICA", // Ghost
            "fractura": "EPICA", // Fractura
            "hielo": "ESPECIAL", // Hielo
            "toxico": "ESPECIAL", // Toxico
            "spark": "EPICA", // Electricidad
            "trail_vampiro": "VIP", // Vampiro (bundle Halloween, ESTACIONAL - sin arte aun)
            "trail_zombie": "VIP", // Zombie (bundle Halloween, ESTACIONAL - sin arte aun)
            "trail_fire": "VIP", // Elemento Fuego (ESTACIONAL rotativo, mes 1)
            "trail_water": "VIP", // Elemento Agua (ESTACIONAL rotativo, mes 2)
            "trail_wind": "VIP", // Elemento Viento (ESTACIONAL rotativo, mes 3)
            "trail_ice": "VIP", // Elemento Hielo (ESTACIONAL rotativo, mes 4)
            "trail_lava": "VIP", // Elemento Lava (ESTACIONAL rotativo, mes 5)
            "trail_nature": "VIP", // Elemento Naturaleza (ESTACIONAL rotativo, mes 6)
            "trail_custom_text": "VIP", // Texto Personalizado (VIP permanente)
        },
        skins: {
            // ----- BASICO (sin cambios) -----
            "cyan": "BASICO", // Pelota Cian
            "red": "BASICO", // Pelota Rojo
            "blue": "BASICO", // Pelota Azul
            "yellow": "BASICO", // Pelota Amarillo
            "orange": "BASICO", // Pelota Naranja
            "green": "BASICO", // Pelota Verde
            "purple": "BASICO", // Pelota Morado
            "white": "BASICO", // Pelota Blanco
            "black": "BASICO", // Pelota Negro
            "dona_cyan": "BASICO", // Dona Cian
            "dona_red": "BASICO", // Dona Rojo
            "dona_blue": "BASICO", // Dona Azul
            "dona_yellow": "BASICO", // Dona Amarillo
            "dona_orange": "BASICO", // Dona Naranja
            "dona_green": "BASICO", // Dona Verde
            "dona_purple": "BASICO", // Dona Morado
            "dona_white": "BASICO", // Dona Blanco
            "dona_black": "BASICO", // Dona Negro
            "cool": "BASICO", // Contorno Verde
            "contorno_red": "BASICO", // Contorno Rojo
            "contorno_purple": "BASICO", // Contorno Morado
            "contorno_cyan": "BASICO", // Contorno Cian
            "contorno_orange": "BASICO", // Contorno Naranja
            "contorno_white": "BASICO", // Contorno Blanco
            "contorno_black": "BASICO", // Contorno Negro
            "controlador": "BASICO", // Controlador
            "metalman": "BASICO", // Metalman
            "pichos": "BASICO", // Pichos

            // ----- ESPECIAL (nuevo: comida/espacio sueltos que bajaron de VIP,
            //                  + bruja que baja de DEMON) -----
            "skin_helado": "ESPECIAL",
            "skin_limon_toxico": "ESPECIAL",
            "skin_sandia": "ESPECIAL",
            "skin_cafe": "ESPECIAL",
            "skin_papas_fritas": "ESPECIAL",
            "skin_sandwich": "ESPECIAL",
            "skin_manzana": "ESPECIAL",
            "skin_palomitas": "ESPECIAL",
            "skin_cupcake": "ESPECIAL",
            "skin_jugo": "ESPECIAL",
            "skin_galleta": "ESPECIAL",
            "skin_torta": "ESPECIAL",
            "skin_pina": "ESPECIAL",
            "skin_pancakes": "ESPECIAL",
            "skin_dona": "ESPECIAL", // Dona (comida), distinta de dona_* (colores)
            "skin_planeta_marte": "ESPECIAL",
            "skin_planeta_saturno": "ESPECIAL",
            "skin_planeta_tierra": "ESPECIAL",
            "skin_meteorito": "ESPECIAL",
            "skin_alien": "ESPECIAL",
            "skin_agujero_negro": "ESPECIAL",
            "skin_galaxia": "ESPECIAL",
            "skin_chef": "ESPECIAL",
            "skin_cerdo": "ESPECIAL",
            "skin_elefante": "ESPECIAL",
            "skin_bruja": "ESPECIAL", // bajo de DEMON, ahora suelta en tienda normal (bundle Halloween)

            // ----- EPICA (sin cambios: frank/shield + nuevo: bajaron de VIP,
            //              + monstruos que bajaron de DEMON) -----
            "frank": "EPICA", // Contorno Amarillo
            "shield": "EPICA", // Contorno Azul
            "skin_chocolate": "EPICA",
            "skin_sol": "EPICA",
            "skin_luna": "EPICA",
            "skin_hamburguesa": "EPICA",
            "skin_pizza": "EPICA",
            "skin_ninja": "EPICA",
            "skin_pirata": "EPICA",
            "skin_cientifico": "EPICA",
            "skin_hacker": "EPICA",
            "skin_cebra": "EPICA",
            "skin_tiburon": "EPICA",
            "skin_cuervo": "EPICA",
            "skin_escorpion": "EPICA",
            "skin_serpiente": "EPICA",
            "skin_fantasma": "EPICA", // bajo de DEMON (bundle Halloween)
            "skin_lobo_monstruo": "EPICA", // bajo de DEMON (bundle Halloween)
            "skin_calabaza": "EPICA", // bajo de DEMON (bundle Halloween)
            "skin_nocturna": "EPICA", // bajo de DEMON (bundle Halloween) - RENOMBRAR a Frankenstein (pendiente, tarea de Devin)

            // ----- DEMON (kenji/brifon/demon_ember/daxor sin cambios,
            //              + samurai que baja de VIP) -----
            "kenji": "DEMON", // KENJI
            "brifon": "DEMON", // BRIFON
            "demon_ember": "DEMON", // Demon Ember
            "daxor": "DEMON", // DAXOR
            "skin_samurai": "DEMON", // bajo de VIP

            // ----- LEGENDARIO (trofeo, NO comprable) -----
            "skin_caballero_bronce": "LEGENDARIO", // Trofeo Mapa 1 Camino de Reyes
            "skin_caballero_plata": "LEGENDARIO", // Trofeo Mapa 1 Camino de Reyes
            "skin_caballero_dorado": "LEGENDARIO", // Trofeo Mapa 1 Camino de Reyes
            "skin_hamburguesa_trofeo_oro": "LEGENDARIO",
            "skin_sandia_trofeo_plata": "LEGENDARIO",
            "skin_chocolate_trofeo_cobre": "LEGENDARIO",
        },
        banners: {
            "Banner_Deafult": "DEFAULT", // El inicio...
            "Speed_Color_Green": "BASICO", // Speed Color Green
            "Speed_Color_Gold": "BASICO", // Speed Color Gold
            "Speed_Color_Gray": "BASICO", // Speed Color Gray
            "Speed_Color_Blue": "BASICO", // Speed Color Blue
            "Speed_Color_Oranje": "BASICO", // Speed Color Oranje
            "Speed_Color_Red": "BASICO", // Speed Color Red
            "Speed_Color_Rgb": "BASICO", // Speed Color Rgb
            "Speed_Color_Black": "BASICO", // Speed Color Black
            "Speed_Color_Red_Animado": "EPICA", // (typo corregido: era EPICO)
            "Abstracto_Fuego_Rojo": "ESPECIAL", // Estas que ardes
            "Abstracto_Lineas_Yellow": "ESPECIAL", // Un toque sofisticado
            "Abstracto_Rayos_Az_Rd": "ESPECIAL", // Para alguien especial
            "Abstracto_Rayos_Morados": "ESPECIAL", // Algo dark para alguien dark
            "Abstracto_Rayos_Rojos": "ESPECIAL", // Para alguien mas especial
            "Dark_Lineas_Blue": "EPICA", // (typo corregido: era EPICO) Un tono relajante verdad?
            "Dark_Ondas_Blue": "EPICA", // (typo corregido: era EPICO) Muchas ondas!!
            "Neon_Grid_Motion": "EPICA", // (typo corregido: era EPICO) Simple pero elegante
            "Ondas_Blue": "EPICA", // (typo corregido: era EPICO) Un tono relajante v2
            "Dark_Lineas_Or_Bck": "DEMON", // Tienes calor?
            "Dark_Aurora_Blue": "DEMON", // Siente el poder!
            "Dark_Ondas_PrAz": "DEMON", // Calma, que aun no inicia...
            "Speed_Color_Yellow_Animado": "DEMON", // Te vez cool con este
            "El_Dragon_Chino": "DEMON", // El Dragon Chino (permanente por ahora, futura temporada Ano Nuevo Chino)
            "Un_poco_de_nieve": "DEMON", // Un poco de nieve? (se unira a temporada Navidad cuando este activa)
            "Vacaciones_en_la_playa": "DEMON", // Vacaciones en la playa (futura temporada Playa)
            "Feliz_Navidad": "DEMON", // NUEVO - pendiente de arte. Estacional, temporada Navidad.
            "Dracula_Edition": "VIP", // El Dracula (bundle Halloween, ESTACIONAL)
            "Jack_o_lantern": "VIP", // Jack o lantern (bundle Halloween, ESTACIONAL)
            "Zombies_Edition": "VIP", // Los zombies estan aqui! (bundle Halloween, ESTACIONAL)
            "El_Dragon_Chino_VIP": "VIP", // El Super Dragon Chino (se agrupa con bundle Criaturas Miticas)
            "Un_poco_de_hielo_VIP": "VIP", // Un poco de hielo (permanente por ahora)
            "La_playa_relajante_VIP": "VIP", // La playa es relajante (permanente por ahora)
            "La_leyenda": "EXCLUSIVO", // NUEVO - pendiente de arte. Pase Rubi.

            "VIP_Placeholder_PNG_1": "VIP", // "Poder de la realeza" -> bundle Realeza
            "VIP_Placeholder_PNG_2": "VIP", // "El gran olimpo" -> bundle Dioses
            "VIP_Placeholder_PNG_3": "VIP", // "Nuestro mejor amigo" -> bundle Salvaje
            "VIP_Placeholder_PNG_4": "VIP", // "El antiguo Egipto" -> bundle Egipto
            "VIP_Placeholder_PNG_5": "VIP", // "Un circo tenebroso" -> bundle Circo
            "VIP_Placeholder_GIF_1": "VIP", // "Mucha risa?" -> Paquete Emoji
            "VIP_Placeholder_GIF_2": "VIP", // "Espacio exterior" -> bundle Espacio
            "VIP_Placeholder_GIF_3": "VIP", // "Un lugar tranquilo" -> futura temporada Elemental: Naturaleza
            "VIP_Placeholder_GIF_4": "VIP", // "Corta unas sandias" -> bundle Comida
            "VIP_Placeholder_GIF_5": "VIP", // "Personalizame" -> feature standalone, 10.000 gemas, sube imagen propia

            "normal_placeholder_01": "", // reservado, pendiente de asignar
            "normal_placeholder_02": "", // reservado, pendiente de asignar
            "normal_placeholder_03": "", // reservado, pendiente de asignar
            "normal_placeholder_04": "", // reservado, pendiente de asignar
            "normal_placeholder_05": "", // reservado, pendiente de asignar
            "normal_placeholder_06": "", // reservado, pendiente de asignar
            "normal_placeholder_07": "", // reservado, pendiente de asignar
            "normal_placeholder_08": "", // reservado, pendiente de asignar
            "normal_placeholder_09": "", // reservado, pendiente de asignar
            "normal_placeholder_10": "", // reservado, pendiente de asignar
            "vip_placeholder_01": "", // reservado, pendiente de asignar
            "vip_placeholder_02": "", // reservado, pendiente de asignar
            "vip_placeholder_03": "", // reservado, pendiente de asignar
            "vip_placeholder_04": "", // reservado, pendiente de asignar
            "vip_placeholder_05": "", // reservado, pendiente de asignar
            "vip_placeholder_06": "", // reservado, pendiente de asignar
            "vip_placeholder_07": "", // reservado, pendiente de asignar
            "vip_placeholder_08": "", // reservado, pendiente de asignar
            "vip_placeholder_09": "", // reservado, pendiente de asignar
            "vip_placeholder_10": "", // reservado, pendiente de asignar
            "nuevo_placeholder_01": "", // reservado, pendiente de asignar
            "nuevo_placeholder_02": "", // reservado, pendiente de asignar
            "nuevo_placeholder_03": "", // reservado, pendiente de asignar
            "nuevo_placeholder_04": "", // reservado, pendiente de asignar
            "nuevo_placeholder_05": "", // reservado, pendiente de asignar
        },
        emotes: {
            // Regla nueva: los emotes reales NO llevan sistema de rareza (se deja "" =
            // sin etiqueta). Solo el exclusivo del Pase Rubi lleva marco dorado.
            // Los ids se renombraran a brifon_emote_* como tarea aparte para Devin.
            "emote_normal": "", // Normal (sin rareza, regla nueva)
            "emote_saludo": "", // Saludo (sin rareza, regla nueva)
            "emote_enojado": "", // Enojado (sin rareza, regla nueva)
            "emote_Llorando": "", // Llorando (sin rareza, regla nueva)
            "emote_sorprendido": "", // Sorprendido (sin rareza, regla nueva)
            "emote_mudo": "", // Mudo (sin rareza, regla nueva)
            "emote_ruby_pass_01": "EXCLUSIVO", // Se renombrara a "Daxor Power" (tarea Devin). Exclusivo Pase Rubi.
            "emoji_fachero": "VIP", // Fachero (en realidad es skin, ver nota de reclasificacion arriba)
            "emoji_enamorado": "VIP", // Enamorado (idem)
            "emoji_asustado": "VIP", // Asustado (idem)
            "emoji_skull_pack": "VIP", // Skull (idem)
            "emoji_derretido": "VIP", // Derretido (idem)
            "emoji_serio": "VIP", // Serio (idem)
            "emoji_llorando": "VIP", // Llorando (idem)
            "emoji_enojado": "VIP", // Enojado (idem)
            "emoji_triste": "VIP", // Triste (idem)
            "emoji_feliz": "VIP", // Feliz (idem)
            "emoji_guino": "VIP", // Guino (idem)
            "emoji_sonriente": "VIP", // Sonriente (idem)
            "emoji_bomito": "VIP", // Bomito (idem)
        },
        vipItems: {
            // ===== BUNDLE REALEZA =====
            // Fix: bufon/principe_helado/mago/arquera tenian rarezas sueltas (EPICO/DEMON)
            // que no coincidian con que todo el bundle es VIP. Corregido.
            "panel_los_reyes": "VIP", // LOS REYES
            "skin_rey": "VIP", // Rey
            "skin_reina": "VIP", // Reina
            "skin_bufon": "VIP", // Bufon (corregido: era "EPICO", typo + rareza incorrecta)
            "skin_emperador_oscuro": "VIP", // Emperador Oscuro
            "skin_principe_helado": "VIP", // Principe Helado (corregido: era DEMON)
            "skin_mago": "VIP", // Mago (corregido: era DEMON)
            "skin_arquera": "VIP", // Arquera (corregido: era "EPICO", typo + rareza incorrecta)
            "skin_noble": "VIP", // Noble
            // caballero_bronce/plata/dorado se movieron a LEGENDARIO (ver bucket "skins"):
            // ya NO son parte de la compra VIP de este bundle, son trofeo de Camino de Reyes.

            // ===== BUNDLE DIOSES (expandido) =====
            "panel_dioses": "VIP", // DIOSES
            "skin_zeus": "VIP", // Zeus
            "skin_hades": "VIP", // Hades
            "skin_poseidon": "VIP", // Poseidon
            "skin_ares": "VIP", // Ares
            "skin_medusa": "VIP", // Medusa
            "skin_atenea": "VIP", // NUEVO - pendiente de arte
            "skin_apolo": "VIP", // NUEVO - pendiente de arte
            "skin_afrodita": "VIP", // NUEVO - pendiente de arte
            "skin_hermes": "VIP", // NUEVO - pendiente de arte

            // ===== BUNDLE EGIPTO =====
            "panel_nilo": "VIP", // NILO REAL
            "bundle_faraon": "VIP", // Faraon
            "skin_faraon": "VIP", // Faraon
            "trail_faraon": "VIP", // Trail Faraon (sin arte aun)
            "bundle_reina_nilo": "VIP", // Reina del Nilo
            "skin_reina_nilo": "VIP", // Reina del Nilo
            "trail_nilo": "VIP", // Trail Nilo (sin arte aun)
            "skin_guardian_dorado": "VIP", // Se renombrara a "moneda_egipcia" (tarea Devin) + animacion girando
            "skin_momia": "VIP", // Momia
            "skin_momia_malvada": "VIP", // Momia Malvada
            "skin_sarcofago": "VIP", // Sarcofago
            "skin_escarabajo": "VIP", // Escarabajo

            // ===== BUNDLE CRIATURAS MITICAS =====
            "skin_dragon": "VIP", // Dragon
            "skin_hydra": "VIP", // Hydra
            "skin_fenix": "VIP", // Fenix
            "skin_quimera": "VIP", // Quimera
            "skin_leviatan": "VIP", // Leviatan
            "skin_grifo": "VIP", // Grifo
            "skin_minotauro": "VIP", // Minotauro
            "skin_gargola": "VIP", // Gargola
            "skin_manticora": "VIP", // Manticora
            "skin_serpiente_marina": "VIP", // Serpiente Marina
            "skin_ciclope": "VIP", // Ciclope

            // ===== BUNDLE CIRCO =====
            "skin_bufon_diurno": "VIP", // Bufón Diurno
            "skin_bufon_nocturno": "VIP", // Bufón Nocturno
            "trail_sonrisa_malvada": "VIP", // Trail Sonrisa Malvada (sin arte aun)
            "trail_circo": "VIP", // Trail Circo (sin arte aun)
            "skin_bufon_maldito": "VIP", // Bufon Maldito
            "skin_payaso_oscuro": "VIP", // Se renombrara a "Senor Penumbra" (tarea Devin)
            "skin_marioneta": "VIP", // Marioneta
            "skin_mascara_sonriente": "VIP", // Mascara Sonriente
            "skin_sonrisa_rota": "VIP", // Sonrisa Rota

            // ===== BUNDLE HALLOWEEN (unificado, ESTACIONAL) =====
            // calabaza/fantasma/lobo_monstruo/nocturna/bruja se movieron al bucket "skins"
            // (bajaron de DEMON a EPICA/ESPECIAL). Siguen siendo parte del bundle Halloween,
            // solo que ahora conceptualmente son de tienda normal dentro de esa temporada.
            "skin_conde_dracula": "VIP", // Conde Dracula
            "trail_vampiro": "VIP", // Trail Vampiro (sin arte aun)
            "skin_zombie": "VIP", // Zombie
            "trail_zombie": "VIP", // Trail Zombie (sin arte aun)

            "trail_custom_text": "VIP", // ¡Trail personalizable! (permanente)

            // ===== PAQUETE EMOJI (conceptualmente son skins, ver nota arriba) =====
            "emoji_pack_expresiones": "VIP", // Paquete de emojis
            "emoji_fachero": "VIP", // Fachero
            "emoji_enamorado": "VIP", // Enamorado
            "emoji_asustado": "VIP", // Asustado
            "emoji_skull_pack": "VIP", // Skull
            "emoji_derretido": "VIP", // Derretido
            "emoji_serio": "VIP", // Serio
            "emoji_llorando": "VIP", // Llorando
            "emoji_enojado": "VIP", // Enojado
            "emoji_triste": "VIP", // Triste
            "emoji_feliz": "VIP", // Feliz
            "emoji_guino": "VIP", // Guino
            "emoji_sonriente": "VIP", // Sonriente
            "emoji_bomito": "VIP", // Bomito

            // ===== TROFEOS (movidos a LEGENDARIO, ver bucket "skins") =====
            // skin_hamburguesa_trofeo_oro, skin_sandia_trofeo_plata,
            // skin_chocolate_trofeo_cobre ya NO estan aqui como VIP comprable.

            // ===== BUNDLE ESPACIO (skins bajaron a tienda normal, ver bucket "skins") =====
            // skin_sol, skin_luna, skin_galaxia, skin_planeta_marte, skin_planeta_saturno,
            // skin_planeta_tierra, skin_agujero_negro, skin_meteorito, skin_alien
            // ya NO estan aqui como VIP: bajaron a ESPECIAL/EPICA en el bucket "skins".
            "trail_estrellas": "VIP", // sin confirmar aun si va EPICA normal o se queda VIP
            "trail_auroras": "VIP", // sin confirmar aun si va EPICA normal o se queda VIP

            // ===== BUNDLE SALVAJE =====
            // skin_cebra, skin_tiburon, skin_cuervo, skin_escorpion, skin_elefante,
            // skin_serpiente, skin_cerdo bajaron a tienda normal (ver bucket "skins").
            "skin_lobo_salvaje": "VIP", // Lobo Salvaje
            "skin_tigre": "VIP", // Tigre
            "skin_leon": "VIP", // Leon
            "skin_ciervo": "VIP", // Ciervo
            "skin_aguila": "VIP", // Aguila

            // ===== BUNDLE NAVIDAD (ESTACIONAL) =====
            "skin_santa_claus": "VIP", // Santa Claus
            "trail_santa": "VIP", // Trail Santa (sin arte aun)
            "skin_mama_claus": "VIP", // Mama Claus
            "trail_mama_claus": "VIP", // Trail Mama Claus (sin arte aun)
            "skin_reno": "VIP", // Reno
            "skin_duende": "VIP", // Duende
            "skin_regalo": "VIP", // Regalo
            "skin_arbol_navidad": "VIP", // Arbol Navidad
            "skin_baston_cristal": "VIP", // Baston Cristal
            "skin_esfera_navidad": "VIP", // Esfera Navidad
            "skin_galleta_navidad": "VIP", // Galleta Navidad
            "Caramelo_de_Navidad": "VIP", // Caramelo de Navidad
        },
        vipGameplay: {
            "boosters": "BASICO", // Potenciadores
            "bots": "BASICO", // Bots VIP
            "perks": "BASICO", // Ventajas
            "power": "BASICO", // Especiales
            "reactor": "BASICO", // Reactor
        }
    };
})();
