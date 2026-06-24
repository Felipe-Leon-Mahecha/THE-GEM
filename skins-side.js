// =====================================================
// SKINS-SIDE.JS — Sistema de imágenes laterales
// THE GEM — cargarlo DESPUÉS de shop.js, ANTES de main.js
// =====================================================
//
// Campos por skin:
//
//   id         → mismo id que usa la tienda (ej: 'skin_zombie')
//   folder     → ruta a la carpeta de esa skin
//   rolling    → true = gira como rueda (no necesita imágenes laterales)
//   symmetric  → true = una imagen (lado.png), false = dos (lado_derecho + lado_izquierdo)
//   drawScale  → qué tan grande se dibuja vs la hitbox (la hitbox NUNCA cambia)
//
// Nombres de archivo dentro de la carpeta:
//   skin_[id]_lado.png           → simétrico
//   skin_[id]_lado_derecho.png   → asimétrico derecha
//   skin_[id]_lado_izquierdo.png → asimétrico izquierda
//
// La imagen frontal (tienda) se queda SUELTA en la carpeta padre, sin mover.
//
// drawScale referencia:
//   1.0 = sin accesorios
//   1.4 = detalles pequeños
//   1.6 = accesorios medianos (capa, cuernos, corona)
//   1.8 = accesorios grandes (sombrero alto, bastón, alas)
// =====================================================

const SKIN_FOLDER_REGISTRY = [

    // ══════════════════════════════════════════════════════
    // MONSTRUOS
    // ══════════════════════════════════════════════════════
    // Descomenta cuando tengas el arte listo:

    { id: 'skin_bruja', folder: 'assets/UI/Store/VIP/Bundles/Monsters/skin_bruja', symmetric: true, drawScale: 1.8 }, // sombrero alto
    { id: 'skin_calabaza', folder: 'assets/UI/Store/VIP/Bundles/Monsters/skin_calabaza', symmetric: true, drawScale: 1.5 },
    { id: 'skin_conde_dracula', folder: 'assets/UI/Store/VIP/Bundles/Monsters/skin_conde_dracula', symmetric: true, drawScale: 1.6 },
    { id: 'skin_fantasma', folder: 'assets/UI/Store/VIP/Bundles/Monsters/skin_fantasma', symmetric: true, drawScale: 1.5 },
    { id: 'skin_lobo_monstruo', folder: 'assets/UI/Store/VIP/Bundles/Monsters/skin_lobo_monstruo', symmetric: true, drawScale: 1.4 },
    { id: 'skin_nocturna', folder: 'assets/UI/Store/VIP/Bundles/Monsters/skin_nocturna', symmetric: true, drawScale: 1.6 },
    { id: 'skin_zombie', folder: 'assets/UI/Store/VIP/Bundles/Monsters/skin_zombie', symmetric: false, drawScale: 1.4 },
    // skin_conde_dracula — rolling:false, asimétrico (colmillos solo en un lado)

    // ══════════════════════════════════════════════════════
    // REALEZA
    // ══════════════════════════════════════════════════════
    // { id: 'skin_arquera', folder: 'assets/UI/Store/VIP/Bundles/Royal/skin_arquera', symmetric: false, drawScale: 1.7 }, // arco en un lado
    // { id: 'skin_bufon', folder: 'assets/UI/Store/VIP/Bundles/Royal/skin_bufon', symmetric: true, drawScale: 1.8 }, // sombrero largo
    // { id: 'skin_caballero_bronce', folder: 'assets/UI/Store/VIP/Bundles/Royal/skin_caballero_bronce', symmetric: false, drawScale: 1.6 },
    // { id: 'skin_caballero_dorado', folder: 'assets/UI/Store/VIP/Bundles/Royal/skin_caballero_dorado', symmetric: false, drawScale: 1.7 }, // penacho
    // { id: 'skin_caballero_plata', folder: 'assets/UI/Store/VIP/Bundles/Royal/skin_caballero_plata', symmetric: false, drawScale: 1.6 },
    // { id: 'skin_emperador_oscuro', folder: 'assets/UI/Store/VIP/Bundles/Royal/skin_emperador_oscuro', symmetric: false, drawScale: 1.6 },
    // { id: 'skin_mago', folder: 'assets/UI/Store/VIP/Bundles/Royal/skin_mago', symmetric: false, drawScale: 1.8 }, // sombrero + bastón
    // { id: 'skin_noble', folder: 'assets/UI/Store/VIP/Bundles/Royal/skin_noble', symmetric: true, drawScale: 1.5 },
    // { id: 'skin_principe_helado', folder: 'assets/UI/Store/VIP/Bundles/Royal/skin_principe_helado', symmetric: true, drawScale: 1.6 },
    // { id: 'skin_reina', folder: 'assets/UI/Store/VIP/Bundles/Royal/skin_reina', symmetric: true, drawScale: 1.6 }, // corona
    // { id: 'skin_rey', folder: 'assets/UI/Store/VIP/Bundles/Royal/skin_rey', symmetric: true, drawScale: 1.6 }, // corona

    // ══════════════════════════════════════════════════════
    // ESPACIO
    // ══════════════════════════════════════════════════════
    // { id: 'skin_agujero_negro',    folder: 'assets/UI/Store/VIP/Bundles/Space/skin_agujero_negro',    symmetric: true,  drawScale: 1.5 },
    // { id: 'skin_alien',            folder: 'assets/UI/Store/VIP/Bundles/Space/skin_alien',            symmetric: false, drawScale: 1.5 },
    // { id: 'skin_galaxia',          folder: 'assets/UI/Store/VIP/Bundles/Space/skin_galaxia',          rolling: true,    drawScale: 1.4 },
    // { id: 'skin_luna',             folder: 'assets/UI/Store/VIP/Bundles/Space/skin_luna',             symmetric: true,  drawScale: 1.4 },
    // { id: 'skin_meteorito',        folder: 'assets/UI/Store/VIP/Bundles/Space/skin_meteorito',        symmetric: true,  drawScale: 1.4 },
    // { id: 'skin_planeta_marte',    folder: 'assets/UI/Store/VIP/Bundles/Space/skin_planeta_marte',    rolling: true,    drawScale: 1.4 },
    // { id: 'skin_planeta_saturno',  folder: 'assets/UI/Store/VIP/Bundles/Space/skin_planeta_saturno',  rolling: true,    drawScale: 1.5 },
    // { id: 'skin_planeta_tierra',   folder: 'assets/UI/Store/VIP/Bundles/Space/skin_planeta_tierra',   rolling: true,    drawScale: 1.4 },
    // { id: 'skin_sol',              folder: 'assets/UI/Store/VIP/Bundles/Space/skin_sol',              rolling: true,    drawScale: 1.5 },

    // ══════════════════════════════════════════════════════
    // COMIDA
    // ══════════════════════════════════════════════════════
    { id: 'skin_cafe', folder: 'assets/UI/Store/VIP/Bundles/Food/skin_cafe', symmetric: true, drawScale: 1.4 },
    // { id: 'skin_cupcake',       folder: 'assets/UI/Store/VIP/Bundles/Food/skin_cupcake',       rolling: true,    drawScale: 1.4 },
    // { id: 'skin_dona',          folder: 'assets/UI/Store/VIP/Bundles/Food/skin_dona',          rolling: true,    drawScale: 1.4 },
    // { id: 'skin_galleta',       folder: 'assets/UI/Store/VIP/Bundles/Food/skin_galleta',       rolling: true,    drawScale: 1.4 },
    { id: 'skin_hamburguesa', folder: 'assets/UI/Store/VIP/Bundles/Food/skin_hamburguesa', rolling: true, drawScale: 1.5 },
    { id: 'skin_helado', folder: 'assets/UI/Store/VIP/Bundles/Food/skin_helado', rolling: true, drawScale: 1.6 },
    { id: 'skin_jugo', folder: 'assets/UI/Store/VIP/Bundles/Food/skin_jugo', rolling: true, drawScale: 1.4 },
    { id: 'skin_limon_toxico', folder: 'assets/UI/Store/VIP/Bundles/Food/skin_limon_toxico', rolling: true, drawScale: 1.4 },
    // { id: 'skin_manzana',       folder: 'assets/UI/Store/VIP/Bundles/Food/skin_manzana',       rolling: true,    drawScale: 1.4 },
    // { id: 'skin_palomitas',     folder: 'assets/UI/Store/VIP/Bundles/Food/skin_palomitas',     rolling: true,    drawScale: 1.4 },
    // { id: 'skin_papas_fritas',  folder: 'assets/UI/Store/VIP/Bundles/Food/skin_papas_fritas',  rolling: true,    drawScale: 1.4 },
    { id: 'skin_pizza', folder: 'assets/UI/Store/VIP/Bundles/Food/skin_pizza', rolling: true, drawScale: 1.4 },
    // { id: 'skin_sandwich',      folder: 'assets/UI/Store/VIP/Bundles/Food/skin_sandwich',      rolling: true,    drawScale: 1.4 },
    { id: 'skin_sandia', folder: 'assets/UI/Store/VIP/Bundles/Food/skin_sandia', rolling: true, drawScale: 1.4 },
    // { id: 'skin_torta',         folder: 'assets/UI/Store/VIP/Bundles/Food/skin_torta',         rolling: true,    drawScale: 1.4 },

    // ══════════════════════════════════════════════════════
    // SALVAJE (Wild)
    // ══════════════════════════════════════════════════════
    // { id: 'skin_aguila',        folder: 'assets/UI/Store/VIP/Bundles/Wild/skin_aguila',        symmetric: false, drawScale: 1.6 },
    // { id: 'skin_cebra',         folder: 'assets/UI/Store/VIP/Bundles/Wild/skin_cebra',         symmetric: false, drawScale: 1.4 },
    // { id: 'skin_cerdo',         folder: 'assets/UI/Store/VIP/Bundles/Wild/skin_cerdo',         rolling: true,    drawScale: 1.4 }, // si decides que ruede
    // { id: 'skin_ciervo',        folder: 'assets/UI/Store/VIP/Bundles/Wild/skin_ciervo',        symmetric: true,  drawScale: 1.6 },
    // { id: 'skin_cuervo',        folder: 'assets/UI/Store/VIP/Bundles/Wild/skin_cuervo',        symmetric: false, drawScale: 1.5 },
    // { id: 'skin_elefante',      folder: 'assets/UI/Store/VIP/Bundles/Wild/skin_elefante',      symmetric: false, drawScale: 1.5 },
    // { id: 'skin_escorpion',     folder: 'assets/UI/Store/VIP/Bundles/Wild/skin_escorpion',     symmetric: false, drawScale: 1.5 },
    // { id: 'skin_leon',          folder: 'assets/UI/Store/VIP/Bundles/Wild/skin_leon',          symmetric: true,  drawScale: 1.5 },
    // { id: 'skin_lobo_salvaje',  folder: 'assets/UI/Store/VIP/Bundles/Wild/skin_lobo_salvaje',  rolling: true,    drawScale: 1.4 },
    // { id: 'skin_serpiente',     folder: 'assets/UI/Store/VIP/Bundles/Wild/skin_serpiente',     symmetric: false, drawScale: 1.5 },
    // { id: 'skin_tiburon',       folder: 'assets/UI/Store/VIP/Bundles/Wild/skin_tiburon',       symmetric: false, drawScale: 1.5 },
    // { id: 'skin_tigre',         folder: 'assets/UI/Store/VIP/Bundles/Wild/skin_tigre',         symmetric: false, drawScale: 1.4 },

    // ══════════════════════════════════════════════════════
    // PROFESIONAL
    // ══════════════════════════════════════════════════════
    // { id: 'skin_chef',          folder: 'assets/UI/Store/VIP/Bundles/Professional/skin_chef',       symmetric: true,  drawScale: 1.7 }, // gorro alto
    // { id: 'skin_cientifico',    folder: 'assets/UI/Store/VIP/Bundles/Professional/skin_cientifico', symmetric: false, drawScale: 1.5 },
    // { id: 'skin_hacker',        folder: 'assets/UI/Store/VIP/Bundles/Professional/skin_hacker',     symmetric: false, drawScale: 1.5 },
    // { id: 'skin_ninja',         folder: 'assets/UI/Store/VIP/Bundles/Professional/skin_ninja',      symmetric: false, drawScale: 1.5 },
    // { id: 'skin_pirata',        folder: 'assets/UI/Store/VIP/Bundles/Professional/skin_pirata',     symmetric: false, drawScale: 1.6 }, // sombrero + parche
    // { id: 'skin_samurai',       folder: 'assets/UI/Store/VIP/Bundles/Professional/skin_samurai',    symmetric: false, drawScale: 1.6 },

    // ══════════════════════════════════════════════════════
    // NAVIDAD
    // ══════════════════════════════════════════════════════
    // { id: 'skin_arbol_navidad',    folder: 'assets/UI/Store/VIP/Bundles/Christmas/skin_arbol_navidad',    symmetric: true,  drawScale: 1.8 },
    // { id: 'skin_baston_cristal',   folder: 'assets/UI/Store/VIP/Bundles/Christmas/skin_baston_cristal',   symmetric: true,  drawScale: 1.7 },
    // { id: 'skin_duende',           folder: 'assets/UI/Store/VIP/Bundles/Christmas/skin_duende',           symmetric: true,  drawScale: 1.6 },
    // { id: 'skin_esfera_navidad',   folder: 'assets/UI/Store/VIP/Bundles/Christmas/skin_esfera_navidad',   rolling: true,    drawScale: 1.4 },
    // { id: 'skin_galleta_navidad',  folder: 'assets/UI/Store/VIP/Bundles/Christmas/skin_galleta_navidad',  rolling: true,    drawScale: 1.4 },
    // { id: 'skin_mama_claus',       folder: 'assets/UI/Store/VIP/Bundles/Christmas/skin_mama_claus',       symmetric: true,  drawScale: 1.6 },
    // { id: 'skin_regalo',           folder: 'assets/UI/Store/VIP/Bundles/Christmas/skin_regalo',           rolling: true,    drawScale: 1.5 },
    // { id: 'skin_reno',             folder: 'assets/UI/Store/VIP/Bundles/Christmas/skin_reno',             symmetric: false, drawScale: 1.5 },
    // { id: 'skin_santa_claus',      folder: 'assets/UI/Store/VIP/Bundles/Christmas/skin_santa_claus',      symmetric: true,  drawScale: 1.6 },
    // { id: 'Caramelo_de_Navidad',   folder: 'assets/UI/Store/VIP/Bundles/Christmas/Caramelo_de_Navidad',   rolling: true,    drawScale: 1.4 },
    // { id: 'skin_regalo',          folder: 'assets/UI/Store/VIP/Bundles/Christmas/skin_regalo',          symmetric: true,  drawScale: 1.5 },
    // { id: 'skin_reno',            folder: 'assets/UI/Store/VIP/Bundles/Christmas/skin_reno',            symmetric: false, drawScale: 1.5 },
    // { id: 'skin_santa_claus',     folder: 'assets/UI/Store/VIP/Bundles/Christmas/skin_santa_claus',     symmetric: true,  drawScale: 1.6 },

    // ══════════════════════════════════════════════════════
    // MITOLOGÍA
    // ══════════════════════════════════════════════════════
    // { id: 'skin_ares',          folder: 'assets/UI/Store/VIP/Bundles/Mythology/skin_ares',          symmetric: false, drawScale: 1.7 }, // lanza asimétrica
    // { id: 'skin_escarabajo',    folder: 'assets/UI/Store/VIP/Bundles/Mythology/skin_escarabajo',    symmetric: true,  drawScale: 1.5 },
    // { id: 'skin_faraon',        folder: 'assets/UI/Store/VIP/Bundles/Mythology/skin_faraon',        symmetric: true,  drawScale: 1.7 }, // nemes alto
    // { id: 'skin_guardian_dorado',folder:'assets/UI/Store/VIP/Bundles/Mythology/skin_guardian_dorado',symmetric:false, drawScale: 1.6 },
    // { id: 'skin_hades',         folder: 'assets/UI/Store/VIP/Bundles/Mythology/skin_hades',         symmetric: false, drawScale: 1.6 },
    // { id: 'skin_medusa',        folder: 'assets/UI/Store/VIP/Bundles/Mythology/skin_medusa',        symmetric: true,  drawScale: 1.6 }, // serpientes
    // { id: 'skin_momia',         folder: 'assets/UI/Store/VIP/Bundles/Mythology/skin_momia',         symmetric: true,  drawScale: 1.5 },
    // { id: 'skin_momia_malvada', folder: 'assets/UI/Store/VIP/Bundles/Mythology/skin_momia_malvada', symmetric: true,  drawScale: 1.5 },
    // { id: 'skin_poseidon',      folder: 'assets/UI/Store/VIP/Bundles/Mythology/skin_poseidon',      symmetric: false, drawScale: 1.7 }, // tridente
    // { id: 'skin_reina_nilo',    folder: 'assets/UI/Store/VIP/Bundles/Mythology/skin_reina_nilo',    symmetric: true,  drawScale: 1.6 },
    // { id: 'skin_sarcofago',     folder: 'assets/UI/Store/VIP/Bundles/Mythology/skin_sarcofago',     symmetric: true,  drawScale: 1.5 },
    // { id: 'skin_zeus',          folder: 'assets/UI/Store/VIP/Bundles/Mythology/skin_zeus',          symmetric: false, drawScale: 1.7 }, // rayo asimétrico

    // ══════════════════════════════════════════════════════
    // CRIATURAS (Creatures)
    // ══════════════════════════════════════════════════════
    // { id: 'skin_ciclope',          folder: 'assets/UI/Store/VIP/Bundles/Creatures/skin_ciclope',          symmetric: true,  drawScale: 1.5 },
    // { id: 'skin_dragon',           folder: 'assets/UI/Store/VIP/Bundles/Creatures/skin_dragon',           symmetric: false, drawScale: 1.7 }, // cuernos + alas
    // { id: 'skin_fenix',            folder: 'assets/UI/Store/VIP/Bundles/Creatures/skin_fenix',            symmetric: false, drawScale: 1.7 }, // alas asimétricas
    // { id: 'skin_gargola',          folder: 'assets/UI/Store/VIP/Bundles/Creatures/skin_gargola',          symmetric: false, drawScale: 1.6 },
    // { id: 'skin_grifo',            folder: 'assets/UI/Store/VIP/Bundles/Creatures/skin_grifo',            symmetric: false, drawScale: 1.6 },
    // { id: 'skin_hydra',            folder: 'assets/UI/Store/VIP/Bundles/Creatures/skin_hydra',            symmetric: false, drawScale: 1.7 }, // múltiples cabezas
    // { id: 'skin_leviatan',         folder: 'assets/UI/Store/VIP/Bundles/Creatures/skin_leviatan',         symmetric: false, drawScale: 1.6 },
    // { id: 'skin_manticora',        folder: 'assets/UI/Store/VIP/Bundles/Creatures/skin_manticora',        symmetric: false, drawScale: 1.6 },
    // { id: 'skin_minotauro',        folder: 'assets/UI/Store/VIP/Bundles/Creatures/skin_minotauro',        symmetric: false, drawScale: 1.6 },
    // { id: 'skin_quimera',          folder: 'assets/UI/Store/VIP/Bundles/Creatures/skin_quimera',          symmetric: false, drawScale: 1.7 },
    // { id: 'skin_serpiente_marina', folder: 'assets/UI/Store/VIP/Bundles/Creatures/skin_serpiente_marina', symmetric: false, drawScale: 1.6 },

    // ══════════════════════════════════════════════════════
    // DARK CARNIVAL
    // ══════════════════════════════════════════════════════
    // { id: 'skin_arlequin',        folder: 'assets/UI/Store/VIP/Bundles/DarkCarnival/skin_arlequin',        symmetric: true,  drawScale: 1.7 }, // gorro bicolor
    { id: 'skin_bufon_maldito', folder: 'assets/UI/Store/VIP/Bundles/DarkCarnival/skin_bufon_maldito', symmetric: true, drawScale: 1.8 }, // sombrero largo
    // { id: 'skin_marioneta',       folder: 'assets/UI/Store/VIP/Bundles/DarkCarnival/skin_marioneta',       symmetric: false, drawScale: 1.6 },
    // { id: 'skin_mascara_sonriente',folder:'assets/UI/Store/VIP/Bundles/DarkCarnival/skin_mascara_sonriente',symmetric:true,  drawScale: 1.5 },
    // { id: 'skin_mascara_veneciana',folder:'assets/UI/Store/VIP/Bundles/DarkCarnival/skin_mascara_veneciana',symmetric:true,  drawScale: 1.5 },
    // { id: 'skin_payaso_oscuro',   folder: 'assets/UI/Store/VIP/Bundles/DarkCarnival/skin_payaso_oscuro',   symmetric: true,  drawScale: 1.7 },
    // { id: 'skin_sonrisa_rota',    folder: 'assets/UI/Store/VIP/Bundles/DarkCarnival/skin_sonrisa_rota',    symmetric: true,  drawScale: 1.5 },
    // { id: 'skin_titiritero',      folder: 'assets/UI/Store/VIP/Bundles/DarkCarnival/skin_titiritero',      symmetric: false, drawScale: 1.7 }, // marioneta en mano
    { id: 'skin_bufon_diurno', folder: 'assets/UI/Store/VIP/Bundles/DarkCarnival/skin_bufon_diurno', symmetric: true, drawScale: 1.8 },
    { id: 'skin_bufon_nocturno', folder: 'assets/UI/Store/VIP/Bundles/DarkCarnival/skin_bufon_nocturno', symmetric: true, drawScale: 1.8 },

    // ══════════════════════════════════════════════════════
    // ELEMENTOS (solo skins, no trails)
    // ══════════════════════════════════════════════════════
    // { id: 'skin_magma',           folder: 'assets/UI/Store/VIP/Bundles/Elements/skin_magma',    symmetric: true,  drawScale: 1.5 },
    // { id: 'skin_tormenta',        folder: 'assets/UI/Store/VIP/Bundles/Elements/skin_tormenta', symmetric: false, drawScale: 1.6 }, // rayo asimétrico

    // Agrega más aquí...

    // ══════════════════════════════════════════════════════
    // PELOTA BÁSICA (rolling — imagen frontal del catálogo)
    // No necesitan carpeta de lados: son esferas simétricas.
    // ══════════════════════════════════════════════════════
    { id: 'cyan',   folder: 'assets/UI/Store/Skins/Normal/skin pelota', rolling: true, drawScale: 1.0 },
    { id: 'red',    folder: 'assets/UI/Store/Skins/Normal/skin pelota', rolling: true, drawScale: 1.0 },
    { id: 'blue',   folder: 'assets/UI/Store/Skins/Normal/skin pelota', rolling: true, drawScale: 1.0 },
    { id: 'yellow', folder: 'assets/UI/Store/Skins/Normal/skin pelota', rolling: true, drawScale: 1.0 },
    { id: 'orange', folder: 'assets/UI/Store/Skins/Normal/skin pelota', rolling: true, drawScale: 1.0 },
    { id: 'green',  folder: 'assets/UI/Store/Skins/Normal/skin pelota', rolling: true, drawScale: 1.0 },
    { id: 'purple', folder: 'assets/UI/Store/Skins/Normal/skin pelota', rolling: true, drawScale: 1.0 },
    { id: 'white',  folder: 'assets/UI/Store/Skins/Normal/skin pelota', rolling: true, drawScale: 1.0 },
    { id: 'black',  folder: 'assets/UI/Store/Skins/Normal/skin pelota', rolling: true, drawScale: 1.0 },

    // ══════════════════════════════════════════════════════
    // PELOTA DONA (rolling — aro de color)
    // ══════════════════════════════════════════════════════
    { id: 'dona_cyan',   folder: 'assets/UI/Store/Skins/Normal/pelota dona', rolling: true, drawScale: 1.0 },
    { id: 'dona_red',    folder: 'assets/UI/Store/Skins/Normal/pelota dona', rolling: true, drawScale: 1.0 },
    { id: 'dona_blue',   folder: 'assets/UI/Store/Skins/Normal/pelota dona', rolling: true, drawScale: 1.0 },
    { id: 'dona_yellow', folder: 'assets/UI/Store/Skins/Normal/pelota dona', rolling: true, drawScale: 1.0 },
    { id: 'dona_orange', folder: 'assets/UI/Store/Skins/Normal/pelota dona', rolling: true, drawScale: 1.0 },
    { id: 'dona_green',  folder: 'assets/UI/Store/Skins/Normal/pelota dona', rolling: true, drawScale: 1.0 },
    { id: 'dona_purple', folder: 'assets/UI/Store/Skins/Normal/pelota dona', rolling: true, drawScale: 1.0 },
    { id: 'dona_white',  folder: 'assets/UI/Store/Skins/Normal/pelota dona', rolling: true, drawScale: 1.0 },
    { id: 'dona_black',  folder: 'assets/UI/Store/Skins/Normal/pelota dona', rolling: true, drawScale: 1.0 },

    // ══════════════════════════════════════════════════════
    // PICHOS (rolling — esfera con pinchos)
    // ══════════════════════════════════════════════════════
    { id: 'pichos', folder: 'assets/UI/Store/Skins/Normal', rolling: true, drawScale: 1.1 },
];

// =====================================================
// CACHÉ DE IMÁGENES
// =====================================================

const SIDE_IMAGE_CACHE = {};


// Esta función ahora es inteligente: si es 'rolling', no hace nada.
function _loadSideImage(id, tipo, src) {
    // 1. Buscamos los datos de la skin
    const skinData = findShopSkin(id);

    // 2. Si es rolling, no intentamos cargar nada (evita errores 404)
    if (skinData && skinData.rolling) return null;

    // 3. Verificamos el caché para no cargar la misma imagen dos veces
    const key = `${id}_${tipo}`;
    if (SIDE_IMAGE_CACHE[key]) return;

    // 4. Cargamos la imagen solo si pasó los filtros anteriores
    const img = new Image();
    img.src = src;
    SIDE_IMAGE_CACHE[key] = img;
}

function _getSideImage(id, tipo) {
    return SIDE_IMAGE_CACHE[`${id}_${tipo}`] || null;
}

// =====================================================
// PRECARGA AL INICIO
// =====================================================

function preloadSideSkinImages() {
    for (const entry of SKIN_FOLDER_REGISTRY) {
        const { id, folder, symmetric, rolling } = entry;
        if (rolling) continue; // las rolling no necesitan imágenes laterales
        const shortId = id.replace('skin_', '');
        if (symmetric) {
            _loadSideImage(id, 'lado', `${folder}/skin_${shortId}_lado.png`);
        } else {
            _loadSideImage(id, 'lado_derecho', `${folder}/skin_${shortId}_lado_derecho.png`);
            _loadSideImage(id, 'lado_izquierdo', `${folder}/skin_${shortId}_lado_izquierdo.png`);
        }
    }
}

// =====================================================
// API PÚBLICA
// =====================================================

/**
 * Devuelve { img, flip, drawScale } con la imagen correcta según la dirección.
 *
 *   img       → imagen a dibujar
 *   flip      → true = aplicar scaleX(-1) antes de dibujar
 *   drawScale → multiplicador de tamaño visual (la hitbox no cambia)
 *
 * Retorna null si la skin no está en el registro (usa el sistema viejo).
 *
 * Convención: lado.png y lado_derecho.png = personaje mirando a la DERECHA.
 */
window.getSkinSideImage = function (id, facing) {
    const entry = SKIN_FOLDER_REGISTRY.find(e => e.id === id);
    if (!entry) return null;

    const drawScale = entry.drawScale ?? 1.4;

    // Skin tipo rueda → le decimos a drawPlayer que gire con playerRollAngle
    if (entry.rolling) {
        return { img: null, flip: false, drawScale, rolling: true };
    }

    if (entry.symmetric) {
        const img = _getSideImage(id, 'lado');
        if (img && img.complete && img.naturalWidth > 0) {
            return { img, flip: facing === 'left', drawScale, rolling: false };
        }
    } else {
        const tipo = facing === 'left' ? 'lado_izquierdo' : 'lado_derecho';
        const img = _getSideImage(id, tipo);
        if (img && img.complete && img.naturalWidth > 0) {
            return { img, flip: false, drawScale, rolling: false };
        }
    }

    return null;
};

/**
 * Indica si una skin está en el nuevo sistema de carpetas.
 */
window.hasSkinSideSystem = function (id) {
    return SKIN_FOLDER_REGISTRY.some(e => e.id === id);
};

// Arrancar precarga
preloadSideSkinImages();

// Exportar registro lateral para el script de comprobación de assets
window.SKIN_FOLDER_REGISTRY = SKIN_FOLDER_REGISTRY;

// Actualizar los datos de las skins con la información lateral recién cargada
if (typeof window.getAllShopSkins === 'function') {
    window.SKINS_DATA = window.getAllShopSkins();
}