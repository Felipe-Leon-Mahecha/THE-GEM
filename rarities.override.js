// TEMPORAL: cambia aqui la calidad/rareza de cada coleccionable.
// Valores permitidos: DEFAULT, BASICO, ESPECIAL, EPICA, DEMON, VIP, LEGENDARIO, EXCLUSIVO.
// Puedes cambiar el color general de cada calidad en colors.
// EXCLUSIVO siempre usa brillo RGB y no toma color configurable.
// Cuando todo quede como quieres, podemos aplicar estos valores a shop.js y borrar este archivo.
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
            "none": "BASICO", // Ninguna
            "basic": "BASICO", // Basica
            "ghost": "EPICA", // Ghost
            "fractura": "EPICA", // Fractura
            "hielo": "ESPECIAL", // Hielo
            "toxico": "ESPECIAL", // Toxico
            "spark": "EPICA", // Electricidad
            "trail_vampiro": "VIP", // Vampiro
            "trail_zombie": "VIP", // Zombie
            "trail_fire": "VIP", // Elemento Fuego
            "trail_water": "VIP", // Elemento Agua
            "trail_wind": "VIP", // Elemento Viento
            "trail_ice": "VIP", // Elemento Hielo
            "trail_lava": "VIP", // Elemento Lava
            "trail_nature": "VIP", // Elemento Naturaleza
            "trail_custom_text": "VIP", // Texto Personalizado
        },
        skins: {
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
            "frank": "EPICA", // Contorno Amarillo
            "shield": "EPICA", // Contorno Azul
            "kenji": "EPICA", // KENJI
            "brifon": "EPICA", // BRIFON
            "demon_ember": "DEMON", // Demon Ember
            "daxor": "DEMON", // DAXOR
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
            "Speed_Color_Red_Animado": "EPICO", // Speed Color Red Animado
            "Abstracto_Fuego_Rojo": "ESPECIAL", // Estas que ardes
            "Abstracto_Lineas_Yellow": "ESPECIAL", // Un toque sofisticado
            "Abstracto_Rayos_Az_Rd": "ESPECIAL", // Para alguien especial
            "Abstracto_Rayos_Morados": "ESPECIAL", // Algo dark para alguien dark
            "Abstracto_Rayos_Rojos": "ESPECIAL", // Para alguien mas especial
            "Dark_Lineas_Blue": "EPICO", // Un tono relajante verdad?
            "Dark_Ondas_Blue": "EPICO", // Muchas ondas!!
            "Neon_Grid_Motion": "EPICO", // Simple pero elegante
            "Ondas_Blue": "EPICO", // Un tono relajante v2
            "Dark_Lineas_Or_Bck": "DEMON", // Tienes calor?
            "Dark_Aurora_Blue": "DEMON", // Siente el poder!
            "Dark_Ondas_PrAz": "DEMON", // Calma, que aun no inicia...
            "Speed_Color_Yellow_Animado": "DEMON", // Te vez cool con este
            "El_Dragon_Chino": "DEMON", // El Dragon Chino
            "Un_poco_de_nieve": "DEMON", // Un poco de nieve?
            "Vacaciones_en_la_playa": "DEMON", // Vacaciones en la playa
            "Dracula_Edition": "VIP", // El Dracula
            "Jack_o_lantern": "VIP", // Jack o lantern
            "Zombies_Edition": "VIP", // Los zombies estan aqui!
            "El_Dragon_Chino_VIP": "VIP", // El Super Dragon Chino
            "Un_poco_de_hielo_VIP": "VIP", // Un poco de hielo
            "La_playa_relajante_VIP": "VIP", // La playa es relajante

            "VIP_Placeholder_PNG_1": "VIP", // VIP Placeholder PNG 1
            "VIP_Placeholder_PNG_2": "VIP", // VIP Placeholder PNG 2
            "VIP_Placeholder_PNG_3": "VIP", // VIP Placeholder PNG 3
            "VIP_Placeholder_PNG_4": "VIP", // VIP Placeholder PNG 4
            "VIP_Placeholder_PNG_5": "VIP", // VIP Placeholder PNG 5
            "VIP_Placeholder_GIF_1": "VIP", // VIP Placeholder GIF 1
            "VIP_Placeholder_GIF_2": "VIP", // VIP Placeholder GIF 2
            "VIP_Placeholder_GIF_3": "VIP", // VIP Placeholder GIF 3
            "VIP_Placeholder_GIF_4": "VIP", // VIP Placeholder GIF 4
            "VIP_Placeholder_GIF_5": "VIP", // VIP Placeholder GIF 5

            "normal_placeholder_01": "", // Normal Placeholder 01
            "normal_placeholder_02": "", // Normal Placeholder 02
            "normal_placeholder_03": "", // Normal Placeholder 03
            "normal_placeholder_04": "", // Normal Placeholder 04
            "normal_placeholder_05": "", // Normal Placeholder 05
            "normal_placeholder_06": "", // Normal Placeholder 06
            "normal_placeholder_07": "", // Normal Placeholder 07
            "normal_placeholder_08": "", // Normal Placeholder 08
            "normal_placeholder_09": "", // Normal Placeholder 09
            "normal_placeholder_10": "", // Normal Placeholder 10
            "vip_placeholder_01": "", // VIP Placeholder 01
            "vip_placeholder_02": "", // VIP Placeholder 02
            "vip_placeholder_03": "", // VIP Placeholder 03
            "vip_placeholder_04": "", // VIP Placeholder 04
            "vip_placeholder_05": "", // VIP Placeholder 05
            "vip_placeholder_06": "", // VIP Placeholder 06
            "vip_placeholder_07": "", // VIP Placeholder 07
            "vip_placeholder_08": "", // VIP Placeholder 08
            "vip_placeholder_09": "", // VIP Placeholder 09
            "vip_placeholder_10": "", // VIP Placeholder 10
            "temporada_placeholder_01": "", // Temporada Placeholder 01
            "temporada_placeholder_02": "", // Temporada Placeholder 02
            "temporada_placeholder_03": "", // Temporada Placeholder 03
            "nuevo_placeholder_01": "", // Nuevo Placeholder 01
            "nuevo_placeholder_02": "", // Nuevo Placeholder 02
            "nuevo_placeholder_03": "", // Nuevo Placeholder 03
            "nuevo_placeholder_04": "", // Nuevo Placeholder 04
            "nuevo_placeholder_05": "", // Nuevo Placeholder 05
        },
        emotes: {
            "emote_normal": "BASICO", // Normal
            "emote_saludo": "BASICO", // Saludo
            "emote_enojado": "BASICO", // Enojado
            "emote_Llorando": "BASICO", // Llorando
            "emote_sorprendido": "BASICO", // Sorprendido
            "emote_mudo": "BASICO", // Mudo
            "emote_ruby_pass_01": "VIP", // Ruby Pass
            "emoji_fachero": "VIP", // Fachero
            "emoji_enamorado": "VIP", // Enamorado
            "emoji_asustado": "VIP", // Asustado
            "emoji_skull_pack": "VIP", // Skull
            "emoji_derretido": "VIP", // Derretido
            "emoji_serio": "VIP", // Serio
            "emoji_llorando": "VIP", // Llorando VIP
            "emoji_enojado": "VIP", // Enojado VIP
            "emoji_triste": "VIP", // Triste
            "emoji_feliz": "VIP", // Feliz
            "emoji_guino": "VIP", // Guino
            "emoji_sonriente": "VIP", // Sonriente
            "emoji_bomito": "VIP", // Bomito
            "emote_risa": "ESPECIAL", // Risa
            "emote_risa_malvada": "EPICA", // Risa Malvada
        },
        vipItems: {
            "panel_los_reyes": "VIP", // LOS REYES
            "skin_rey": "VIP", // Rey
            "skin_reina": "VIP", // Reina
            "skin_caballero_bronce": "DEMON", // Caballero Bronce
            "skin_caballero_plata": "DEMON", // Caballero Plata
            "skin_caballero_dorado": "DEMON", // Caballero Dorado
            "skin_bufon": "EPICO", // Bufon
            "skin_emperador_oscuro": "VIP", // Emperador Oscuro
            "skin_principe_helado": "DEMON", // Principe Helado
            "skin_mago": "DEMON", // Mago
            "skin_arquera": "EPICO", // Arquera
            "skin_noble": "VIP", // Noble


            "panel_dioses": "VIP", // DIOSES
            "skin_zeus": "VIP", // Zeus
            "skin_hades": "VIP", // Hades
            "skin_poseidon": "VIP", // Poseidon
            "skin_ares": "VIP", // Ares
            "skin_medusa": "VIP", // Medusa
            "panel_nilo": "VIP", // NILO REAL
            "bundle_faraon": "VIP", // Faraon
            "skin_faraon": "VIP", // Faraon
            "trail_faraon": "VIP", // Trail Faraon
            "bundle_reina_nilo": "VIP", // Reina del Nilo
            "skin_reina_nilo": "VIP", // Reina del Nilo
            "trail_nilo": "VIP", // Trail Nilo
            "skin_guardian_dorado": "VIP", // Guardian Dorado
            "skin_momia": "VIP", // Momia
            "skin_momia_malvada": "VIP", // Momia Malvada
            "skin_sarcofago": "VIP", // Sarcofago
            "skin_escarabajo": "VIP", // Escarabajo
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
            "skin_bufon_diurno": "VIP", // Bufón Diurno
            "skin_bufon_nocturno": "VIP", // Bufón Nocturno
            "trail_sonrisa_malvada": "VIP", // Trail Sonrisa Malvada
            "trail_circo": "VIP", // Trail Circo
            "skin_bufon_maldito": "VIP", // Bufon Maldito
            "skin_payaso_oscuro": "VIP", // Payaso Oscuro
            "skin_marioneta": "VIP", // Marioneta
            "skin_mascara_sonriente": "VIP", // Mascara Sonriente
            "skin_titiritero": "VIP", // Titiritero
            "skin_arlequin": "VIP", // Arlequin
            "skin_mascara_veneciana": "VIP", // Mascara Veneciana
            "skin_sonrisa_rota": "VIP", // Sonrisa Rota

            "skin_conde_dracula": "VIP", // Conde Dracula
            "trail_vampiro": "VIP", // Trail Vampiro
            "skin_zombie": "VIP", // Zombie
            "trail_zombie": "VIP", // Trail Zombie
            "skin_fantasma": "DEMON", // Fantasma
            "skin_lobo_monstruo": "DEMON", // Lobo Monstruo
            "skin_calabaza": "DEMON", // Calabaza
            "skin_bruja": "DEMON", // Bruja
            "skin_nocturna": "DEMON", // Nocturna

            "trail_custom_text": "VIP", // ¡Trail personalizable!
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
            "skin_hamburguesa": "VIP", // Hamburguesa
            "skin_pizza": "VIP", // Pizza
            "skin_helado": "VIP", // Helado
            "skin_limon_toxico": "VIP", // Limon Toxico
            "skin_sandia": "VIP", // Sandia
            "skin_cafe": "VIP", // Cafe
            "skin_dona": "VIP", // Dona
            "skin_papas_fritas": "VIP", // Papas Fritas
            "skin_sandwich": "VIP", // Sandwich
            "skin_manzana": "VIP", // Manzana
            "skin_palomitas": "VIP", // Palomitas
            "skin_cupcake": "VIP", // Cupcake
            "skin_jugo": "VIP", // Jugo
            "skin_galleta": "VIP", // Galleta
            "skin_torta": "VIP", // Torta
            "skin_chocolate": "VIP", // Chocolate
            "skin_pina": "VIP", // Pina
            "skin_pancakes": "VIP", // Pancakes
            "skin_hamburguesa_trofeo_oro": "VIP", // Hamburguesa Dorada
            "skin_sandia_trofeo_plata": "VIP", // Sandia de Plata
            "skin_chocolate_trofeo_cobre": "VIP", // Chocolate de Cobre
            "skin_sol": "VIP", // Sol
            "skin_luna": "VIP", // Luna
            "skin_galaxia": "VIP", // Galaxia
            "skin_planeta_marte": "VIP", // Planeta Marte
            "skin_planeta_saturno": "VIP", // Planeta Saturno
            "skin_planeta_tierra": "VIP", // Planeta Tierra
            "skin_agujero_negro": "VIP", // Agujero Negro
            "skin_meteorito": "VIP", // Meteorito
            "skin_alien": "VIP", // Alien
            "trail_estrellas": "VIP", // Trail Estrellas
            "trail_auroras": "VIP", // Trail Auroras
            "skin_ninja": "VIP", // Ninja
            "skin_pirata": "VIP", // Pirata
            "skin_cientifico": "VIP", // Cientifico
            "skin_hacker": "VIP", // Hacker
            "skin_chef": "VIP", // Chef
            "skin_samurai": "VIP", // Samurai
            "skin_lobo_salvaje": "VIP", // Lobo Salvaje
            "skin_serpiente": "VIP", // Serpiente
            "skin_tiburon": "VIP", // Tiburon
            "skin_cuervo": "VIP", // Cuervo
            "skin_escorpion": "VIP", // Escorpion
            "skin_tigre": "VIP", // Tigre
            "skin_leon": "VIP", // Leon
            "skin_cebra": "VIP", // Cebra
            "skin_elefante": "VIP", // Elefante
            "skin_cerdo": "VIP", // Cerdo
            "skin_ciervo": "VIP", // Ciervo
            "skin_aguila": "VIP", // Aguila
            "skin_santa_claus": "VIP", // Santa Claus
            "trail_santa": "VIP", // Trail Santa
            "skin_mama_claus": "VIP", // Mama Claus
            "trail_mama_claus": "VIP", // Trail Mama Claus
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
