// =====================================================
// SISTEMA DE TIENDA
// =====================================================
// Este archivo maneja la tienda del juego: skins, trails, emotes,
// contenido VIP, bundles y compras con monedas o gemas.

// Declaraciones elevadas para prevenir errores de "antes de inicialización" en APK empaquetada
var VIP_GAMEPLAY_PLACEHOLDERS = [];
var previewTrailAnim = null;

// Imagen placeholder para items de tienda
const SHOP_PLACEHOLDER_IMAGE = 'assets/UI/Store/Placeholders/placeholder_store_item.png';
// Imagen placeholder para recompensas del pase de rubies
const RUBY_PASS_REWARD_PLACEHOLDER = 'assets/UI/Store/Placeholders/placeholder_ruby_pass_reward.png';
// Precio estándar de emotes en monedas (ver prices.config.js -> general.emoteBasicoCoins)
const EMOTE_STANDARD_PRICE_COINS = (window.SHOP_PRICES && window.SHOP_PRICES.general.emoteBasicoCoins) || 150;
// Imágenes de efectos visuales para la tienda
const SHOP_SNOWFLAKE_IMAGE = new Image();
SHOP_SNOWFLAKE_IMAGE.src = 'assets/UI/Efectos de trails/Efecto copo de nieve.png';
const SHOP_CANDY_PARTICLE_IMAGE = new Image();
SHOP_CANDY_PARTICLE_IMAGE.src = 'assets/UI/Efectos de trails/Particulas/particula_dulce.png';

const TROPHY_IDS = ['skin_chocolate_trofeo_cobre', 'skin_sandia_trofeo_plata', 'skin_hamburguesa_trofeo_oro', 'skin_caballero_bronce', 'skin_caballero_plata', 'skin_caballero_dorado'];

// Etiqueta de rango requerido para trofeos que se obtienen en Camino de Rangos
// (no se compran). AJUSTA estos textos con el rango/nodo real donde se obtiene
// cada uno en el Mapa 1 (La Forja Cosmica).
const TROPHY_RANK_LABELS = {
    skin_caballero_bronce: 'RANGO: [PENDIENTE]',
    skin_caballero_plata: 'RANGO: [PENDIENTE]',
    skin_caballero_dorado: 'RANGO: [PENDIENTE]'
};

// =====================================================
// TEXTOS DE LA TIENDA NORMAL (GEM_CONFIG.textos.tienda)
// Ver checklist_textos_config.md bloque 4. No incluye VIP,
// Pase Ruby, Regalo diario ni Cofres (tienen su propio bloque).
// =====================================================

// Devuelve GEM_CONFIG.textos.tienda.<seccion>, con {} de respaldo
// para que la tienda nunca truene si falta algo en config.js.
function shopTextos(seccion) {
    return window.GEM_CONFIG?.textos?.tienda?.[seccion] || {};
}

// Nombre legible de la moneda ('gems' -> "rubies", cualquier otra cosa -> "monedas")
function shopMonedaLabel(currency) {
    const c = shopTextos('comun');
    return currency === 'gems' ? (c.monedaRubies ?? 'rubies') : (c.monedaMonedas ?? 'monedas');
}

// Pregunta estándar de confirmación de compra ("¿Seguro que quieres comprar por X rubies?")
function shopPreguntaCompra(amount, currency) {
    const template = shopTextos('modal').preguntaCompraTemplate ?? '¿Seguro que quieres comprar por {monto} {moneda}?';
    return template.replace('{monto}', amount).replace('{moneda}', shopMonedaLabel(currency));
}

const GEM_ALLOWED_RARITIES = ['DEFAULT', 'BASICO', 'ESPECIAL', 'EPICA', 'DEMON', 'VIP', 'LEGENDARIO', 'EXCLUSIVO'];
const GEM_EXCLUSIVE_RARITY_COLOR = '#ff4dff';

const GEM_RARITY_COLORS = {
    DEFAULT: 'rgba(255,255,255,0.35)',
    BASICO: '#57b7dd',
    ESPECIAL: '#ff9a17',
    EPICA: '#cc44ff',
    DEMON: '#cf0000',
    VIP: '#ffee00',
    LEGENDARIO: '#8a2be2',
    EXCLUSIVO: GEM_EXCLUSIVE_RARITY_COLOR
};

function normalizeGemRarity(rarity, fallback = null) {
    const value = String(rarity || fallback || '').trim().toUpperCase();
    if (GEM_ALLOWED_RARITIES.includes(value)) return value;
    return fallback;
}

function applyGemRarityColorOverrides() {
    const colors = window.GEM_RARITY_OVERRIDES?.colors;
    if (!colors) return;

    Object.entries(colors).forEach(([rarity, color]) => {
        const normalized = normalizeGemRarity(rarity);
        if (!normalized || normalized === 'EXCLUSIVO' || !color) return;
        GEM_RARITY_COLORS[normalized] = color;
    });

    GEM_RARITY_COLORS.EXCLUSIVO = GEM_EXCLUSIVE_RARITY_COLOR;
}

function syncGemRarityColorMaps() {
    if (typeof RARITY_COLORS !== 'undefined') {
        Object.assign(RARITY_COLORS, GEM_RARITY_COLORS);
    }
    if (typeof BANNER_RARITY_COLORS !== 'undefined') {
        Object.assign(BANNER_RARITY_COLORS, GEM_RARITY_COLORS);
    }
}

function gemRarityClass(rarity) {
    return normalizeGemRarity(rarity) === 'EXCLUSIVO' ? ' gem-rarity-exclusive' : '';
}

function applyRarityToItem(item, rarity, options = {}) {
    if (!item || !rarity) return;
    const normalized = normalizeGemRarity(rarity, item.rarity);
    if (!normalized) return;
    item.rarity = normalized;
    if ('rarityColor' in item || options.setColor) {
        item.rarityColor = GEM_RARITY_COLORS[item.rarity] || GEM_RARITY_COLORS[normalized] || item.rarityColor;
    }
}

function applyRarityOverridesToList(list, overrides, options = {}) {
    if (!Array.isArray(list) || !overrides) return;
    list.forEach(item => {
        const aliasRarity = Array.isArray(item.aliases)
            ? item.aliases.map(alias => overrides[alias]).find(Boolean)
            : null;
        applyRarityToItem(item, overrides[item.id] || aliasRarity || overrides[item.name], options);
    });
}

function applyNestedRarityOverrides(items, overrides, options = {}) {
    if (!Array.isArray(items) || !overrides) return;
    items.forEach(item => {
        applyRarityToItem(item, overrides[item.id], options);
        applyNestedRarityOverrides(item.items, overrides, options);
    });
}

function applyGemRarityOverrides(stage = 'normal') {
    const overrides = window.GEM_RARITY_OVERRIDES;
    if (!overrides) return;

    applyGemRarityColorOverrides();
    syncGemRarityColorMaps();

    if (stage === 'normal') {
        applyRarityOverridesToList(TRAILS_DATA, overrides.trails, { setColor: true });
        applyRarityOverridesToList(SKINS_DATA, overrides.skins);
        applyRarityOverridesToList(BANNERS_DATA, overrides.banners, { bannerBasic: true });
        applyRarityOverridesToList(EMOTES_DATA, overrides.emotes);
        applyRarityOverridesToList(VIP_BANNER_PLACEHOLDERS, overrides.banners, { bannerBasic: true });
        return;
    }

    applyNestedRarityOverrides(VIP_CAROUSEL_DATA.flatMap(panel => panel.items || []), overrides.vipItems);
    applyNestedRarityOverrides(VIP_PACKAGES_DATA.flatMap(pack => pack.items || []), overrides.vipItems);
    applyRarityOverridesToList(VIP_GAMEPLAY_PLACEHOLDERS, overrides.vipGameplay);
}

// Botón "← VOLVER" compartido por las páginas internas de la tienda normal
// (antes decía "VOLVER" en algunas páginas y "← VOLVER" en otras — unificado)
function shopBotonVolverHtml(onclick = "showShopSection('home')") {
    const label = shopTextos('comun').botonVolver ?? '← VOLVER';
    return `<button onclick="${onclick}" style="padding:8px 16px; background:none; border:1px solid rgba(255,255,255,0.12); border-radius:8px; color:rgba(255,255,255,0.5); font-family:monospace; font-size:11px; letter-spacing:2px; cursor:pointer;">${label}</button>`;
}

// =====================================================
// VARIABLES GLOBALES
// =====================================================

let trailAnimId = null; // ID de la animación del trail en preview

// =====================================================
// CONSTANTES VIP
// =====================================================

const VIP_ASSET_BASE = 'assets/UI/Store/VIP/Bundles'; // Ruta base de assets VIP
// Precios VIP (ver prices.config.js -> general)
const VIP_ITEM_PRICE = (window.SHOP_PRICES && window.SHOP_PRICES.general.vipItemPriceGems) || 300;
const VIP_PANEL_PRICE = (window.SHOP_PRICES && window.SHOP_PRICES.general.vipPanelPriceGems) || 620;

// =====================================================
// FUNCIONES AUXILIARES VIP
// =====================================================

// Crear objeto de skin VIP
// folder: Carpeta de assets
// id: ID del skin
// name: Nombre del skin
// price: Precio (opcional)
// options: Opciones adicionales (opcional)
function vipSkin(folder, id, name, price = VIP_ITEM_PRICE, options = {}) {
    return {
        type: 'vipSkin',
        id,
        name,
        price,
        image: `${VIP_ASSET_BASE}/${folder}/${id}.png`,
        ...options
    };
}

// Crear objeto de trail VIP
// folder: Carpeta de assets
// id: ID del trail
// name: Nombre del trail
// price: Precio (opcional)
function vipTrail(folder, id, name, price = 320) {
    return { type: 'vipTrailPng', id, name, price, image: `${VIP_ASSET_BASE}/${folder}/${id}.png`, trailId: id };
}

// =====================================================
// DATOS DE TRAILS
// =====================================================

const TRAILS_DATA = [
    { id: 'none', name: 'Ninguna', rarity: 'BASICO', rarityColor: '#888888', price: 0, priceType: 'coins', image: 'assets/UI/Store/Trails/Covers/Ninguna_trail.png' },
    { id: 'basic', name: 'Basica', rarity: 'BASICO', rarityColor: '#57b7dd', price: 30, priceType: 'coins', image: 'assets/UI/Store/Trails/Covers/Basic_trail.png' },
    { id: 'ghost', name: 'Ghost', rarity: 'EPICA', rarityColor: '#cc44ff', price: 800, priceType: 'coins', image: 'assets/UI/Store/Trails/Covers/Ghost_trail.png' },
    { id: 'fractura', name: 'Fractura', rarity: 'EPICA', rarityColor: '#cc44ff', price: 1000, priceType: 'coins', image: 'assets/UI/Store/Trails/Covers/Fractura_trail.png' },
    { id: 'hielo', name: 'Hielo', rarity: 'ESPECIAL', rarityColor: '#7fd8ff', price: 260, priceType: 'coins', image: 'assets/UI/Store/Trails/Covers/Hielo_trail.png' },
    { id: 'toxico', name: 'Toxico', rarity: 'ESPECIAL', rarityColor: '#8dff5a', price: 320, priceType: 'coins', image: 'assets/UI/Store/Trails/Covers/Toxico_trail.png' },
    { id: 'spark', name: 'Electricidad', rarity: 'EPICA', rarityColor: '#ffff00', price: 1200, priceType: 'coins', image: 'assets/UI/Store/Trails/Covers/Electricidad_trail.png' },
    { id: 'trail_vampiro', name: 'Vampiro', rarity: 'VIP', rarityColor: '#ff4d6d', price: 0, priceType: 'gems', image: 'assets/UI/Store/Trails/Covers/Vampiro_trail.png' },
    { id: 'trail_zombie', name: 'Zombie', rarity: 'VIP', rarityColor: '#78ff8f', price: 0, priceType: 'gems', image: 'assets/UI/Store/Trails/Covers/Zombie_trail.png' },
    { id: 'trail_fire', name: 'Elemento Fuego', rarity: 'VIP', rarityColor: '#ff8a00', price: 0, priceType: 'gems', image: 'assets/UI/Store/Trails/Covers/Elemento_Fuego_trail.png' },
    { id: 'trail_water', name: 'Elemento Agua', rarity: 'VIP', rarityColor: '#4488ff', price: 0, priceType: 'gems', image: 'assets/UI/Store/Trails/Covers/Elemento_Agua_trail.png' },
    { id: 'trail_wind', name: 'Elemento Viento', rarity: 'VIP', rarityColor: '#00ffe7', price: 0, priceType: 'gems', image: 'assets/UI/Store/Trails/Covers/Elemento_Viento_trail.png' },
    { id: 'trail_ice', name: 'Elemento Hielo', rarity: 'VIP', rarityColor: '#7fd8ff', price: 0, priceType: 'gems', image: 'assets/UI/Store/Trails/Covers/Elemento_Hielo_trail.png' },
    { id: 'trail_lava', name: 'Elemento Lava', rarity: 'VIP', rarityColor: '#ff4444', price: 0, priceType: 'gems', image: 'assets/UI/Store/Trails/Covers/Elemento_Lava_trail.png' },
    { id: 'trail_nature', name: 'Elemento Naturaleza', rarity: 'VIP', rarityColor: '#44ff88', price: 0, priceType: 'gems', image: 'assets/UI/Store/Trails/Covers/Elemento_Naturaleza_trail.png' },
    { id: 'trail_custom_text', name: 'Texto Personalizado', rarity: 'VIP', rarityColor: '#ffda3a', price: 0, priceType: 'gems', image: 'assets/UI/Store/Trails/Covers/Texto_Personalizado_trail.png' },
];

// =====================================================
// DATOS DEL CARRUSEL VIP
// =====================================================

const VIP_CAROUSEL_DATA = [
    {
        id: 'la_realeza',
        title: 'LA REALEZA',
        subtitle: 'Corona, corte y poder real',
        price: 3200,
        cover: 'assets/UI/Store/VIP/CarouselPanels/panel_carousel_la_realeza.png',
        detailBackground: 'assets/UI/Store/VIP/Backgrounds/bg_carousel_la_realeza.png',
        popupBackground: 'assets/UI/Store/VIP/PopupBackgrounds/popup_carousel_la_realeza.png',
        glowA: '#ffe45c',
        glowB: '#b47a00',
        items: [
            {
                type: 'vipPanel',
                id: 'panel_los_reyes',
                name: 'LOS REYES',
                label: 'PANEL',
                price: VIP_PANEL_PRICE,
                image: 'assets/UI/Store/VIP/Bundles/Royal/panel_los_reyes.png',
                popupBackground: 'assets/UI/Store/VIP/Bundles/Royal/popup_los_reyes_bg.png',
                items: [
                    vipSkin('Royal', 'skin_rey', 'Rey'),
                    vipSkin('Royal', 'skin_reina', 'Reina')
                ]
            },
            vipSkin('Royal', 'skin_caballero_bronce', 'Caballero Bronce'),
            vipSkin('Royal', 'skin_caballero_plata', 'Caballero Plata'),
            vipSkin('Royal', 'skin_caballero_dorado', 'Caballero Dorado', 340),
            vipSkin('Royal', 'skin_bufon', 'Bufon'),
            vipSkin('Royal', 'skin_emperador_oscuro', 'Emperador Oscuro', 380),
            vipSkin('Royal', 'skin_principe_helado', 'Principe Helado', 340),
            vipSkin('Royal', 'skin_mago', 'Mago'),
            vipSkin('Royal', 'skin_arquera', 'Arquera'),
            vipSkin('Royal', 'skin_noble', 'Noble')
        ]
    },
    {
        id: 'mitologia_y_dioses',
        title: 'MITOLOGIA Y DIOSES',
        subtitle: 'Dioses, faraones y reliquias del Nilo',
        price: 3600,
        cover: 'assets/UI/Store/VIP/CarouselPanels/panel_carousel_mitologia_dioses.png',
        detailBackground: 'assets/UI/Store/VIP/Backgrounds/bg_carousel_mitologia_dioses.png',
        popupBackground: 'assets/UI/Store/VIP/PopupBackgrounds/popup_carousel_mitologia_dioses.png',
        glowA: '#244dff',
        glowB: '#00f5ff',
        items: [
            {
                type: 'vipPanel',
                id: 'panel_dioses',
                name: 'DIOSES',
                label: 'PANEL',
                price: 0,
                image: 'assets/UI/Store/VIP/Bundles/Mythology/panel_dioses.png',
                popupBackground: 'assets/UI/Store/VIP/Bundles/Mythology/popup_dioses_bg.png',
                items: [
                    vipSkin('Mythology', 'skin_zeus', 'Zeus', 380),
                    vipSkin('Mythology', 'skin_hades', 'Hades', 380),
                    vipSkin('Mythology', 'skin_poseidon', 'Poseidon', 380),
                    vipSkin('Mythology', 'skin_ares', 'Ares', 360),
                    vipSkin('Mythology', 'skin_medusa', 'Medusa', 360)
                ]
            },
            {
                type: 'vipPanel',
                id: 'panel_nilo',
                name: 'NILO REAL',
                label: 'PANEL',
                price: VIP_PANEL_PRICE,
                image: 'assets/UI/Store/VIP/Bundles/Mythology/panel_nilo_real.png',
                popupBackground: 'assets/UI/Store/VIP/Bundles/Mythology/popup_nilo_real_bg.png',
                items: [
                    {
                        type: 'bundle',
                        id: 'bundle_faraon',
                        name: 'Faraon',
                        price: 520,
                        image: 'assets/UI/Store/VIP/Bundles/Mythology/skin_faraon.png',
                        items: [
                            vipSkin('Mythology', 'skin_faraon', 'Faraon'),
                            vipTrail('Mythology', 'trail_faraon', 'Trail Faraon')
                        ]
                    },
                    {
                        type: 'bundle',
                        id: 'bundle_reina_nilo',
                        name: 'Reina del Nilo',
                        price: 520,
                        image: 'assets/UI/Store/VIP/Bundles/Mythology/skin_reina_nilo.png',
                        items: [
                            vipSkin('Mythology', 'skin_reina_nilo', 'Reina del Nilo'),
                            vipTrail('Mythology', 'trail_nilo', 'Trail Nilo')
                        ]
                    }
                ]
            },
            vipSkin('Mythology', 'skin_guardian_dorado', 'Guardian Dorado', 340),
            vipSkin('Mythology', 'skin_momia', 'Momia'),
            vipSkin('Mythology', 'skin_momia_malvada', 'Momia Malvada', 340),
            vipSkin('Mythology', 'skin_sarcofago', 'Sarcofago'),
            vipSkin('Mythology', 'skin_escarabajo', 'Escarabajo')
        ]
    },
    {
        id: 'criaturas_mitologicas',
        title: 'CRIATURAS MITOLOGICAS',
        subtitle: 'Bestias legendarias compradas una por una',
        price: 3500,
        cover: 'assets/UI/Store/VIP/CarouselPanels/panel_carousel_criaturas_mitologicas.png',
        detailBackground: 'assets/UI/Store/VIP/Backgrounds/bg_carousel_criaturas_mitologicas.png',
        popupBackground: 'assets/UI/Store/VIP/PopupBackgrounds/popup_carousel_criaturas_mitologicas.png',
        glowA: '#ff8a00',
        glowB: '#ffffff',
        items: [
            vipSkin('Creatures', 'skin_dragon', 'Dragon', 380),
            vipSkin('Creatures', 'skin_hydra', 'Hydra', 360),
            vipSkin('Creatures', 'skin_fenix', 'Fenix', 360),
            vipSkin('Creatures', 'skin_quimera', 'Quimera', 360),
            vipSkin('Creatures', 'skin_leviatan', 'Leviatan', 380),
            vipSkin('Creatures', 'skin_grifo', 'Grifo', 340),
            vipSkin('Creatures', 'skin_minotauro', 'Minotauro', 340),
            vipSkin('Creatures', 'skin_gargola', 'Gargola'),
            vipSkin('Creatures', 'skin_manticora', 'Manticora', 340),
            vipSkin('Creatures', 'skin_serpiente_marina', 'Serpiente Marina', 340),
            vipSkin('Creatures', 'skin_ciclope', 'Ciclope')
        ]
    },
    {
        id: 'carnaval_oscuro',
        title: 'CARNAVAL OSCURO',
        subtitle: 'Trails de circo y skins malditas',
        price: 2900,
        cover: 'assets/UI/Store/VIP/CarouselPanels/panel_carousel_carnaval_oscuro.png',
        detailBackground: 'assets/UI/Store/VIP/Backgrounds/bg_carousel_carnaval_oscuro.png',
        popupBackground: 'assets/UI/Store/VIP/PopupBackgrounds/popup_carousel_carnaval_oscuro.png',
        glowA: '#ff1f3d',
        glowB: '#030000',
        items: [
            {
                type: 'bundle',
                name: 'Los Bufones',
                price: 620,
                image: 'assets/UI/Store/VIP/Bundles/DarkCarnival/panel_los_bufones.png',
                popupBackground: 'assets/UI/Store/VIP/Bundles/DarkCarnival/popup_los_bufones_bg.png',
                items: [
                    { type: 'skin', id: 'skin_bufon_diurno', name: 'Bufón Diurno', image: 'assets/UI/Store/VIP/Bundles/DarkCarnival/skin_bufon_diurno.png' },
                    { type: 'skin', id: 'skin_bufon_nocturno', name: 'Bufón Nocturno', image: 'assets/UI/Store/VIP/Bundles/DarkCarnival/skin_bufon_nocturno.png' }
                ]
            },
            { ...vipTrail('DarkCarnival', 'trail_sonrisa_malvada', 'Trail Sonrisa Malvada'), previewColor: 'red' },
            { ...vipTrail('DarkCarnival', 'trail_circo', 'Trail Circo'), previewColor: 'orange' },
            vipSkin('DarkCarnival', 'skin_bufon_maldito', 'Bufon Maldito', 340),
            vipSkin('DarkCarnival', 'skin_payaso_oscuro', 'Payaso Oscuro', 340),
            vipSkin('DarkCarnival', 'skin_marioneta', 'Marioneta'),
            vipSkin('DarkCarnival', 'skin_mascara_sonriente', 'Mascara Sonriente'),
            vipSkin('DarkCarnival', 'skin_sonrisa_rota', 'Sonrisa Rota', 340)
        ]
    }
];

// =====================================================
// PRECARGAR IMÁGENES DE TIENDA
// =====================================================

// Precargar todas las imágenes de la tienda para mejor rendimiento
function preloadShopImages() {
    const shopImages = [];

    // Precargar imágenes de emotes
    EMOTES_DATA.forEach(emote => {
        if (emote.image) {
            const img = new Image();
            img.src = emote.image;
            shopImages.push(img);
        }
    });

    // Precargar imágenes de skins
    SKINS_DATA.forEach(skin => {
        if (skin.image) {
            const img = new Image();
            img.src = skin.image;
            shopImages.push(img);
        }
    });

    // Precargar imágenes de trails
    TRAILS_DATA.forEach(trail => {
        if (trail.image) {
            const img = new Image();
            img.src = trail.image;
            shopImages.push(img);
        }
    });

    // Precargar imágenes de banners
    BANNERS_DATA.forEach(banner => {
        if (banner.cover || banner.image) {
            const img = new Image();
            img.src = banner.cover || banner.image;
            shopImages.push(img);
        }
    });

    // Precargar imágenes VIP
    VIP_GAMEPLAY_PLACEHOLDERS.forEach(vip => {
        if (vip.image) {
            const img = new Image();
            img.src = vip.image;
            shopImages.push(img);
        }
    });

    return shopImages;
}

// Datos de skins disponibles en la tienda
const SKINS_DATA = [
    { id: 'cyan', name: 'Pelota Cian', color: '#00ffe7', rarity: 'BASICO', price: 0, priceType: 'coins', owned: true, image: 'assets/UI/Store/Skins/Normal/Balls/pelota cian.png' },
    { id: 'red', name: 'Pelota Rojo', color: '#ff4444', rarity: 'BASICO', price: 50, priceType: 'coins', owned: false, image: 'assets/UI/Store/Skins/Normal/Balls/pelota rojo.png' },
    { id: 'blue', name: 'Pelota Azul', color: '#5045eb', rarity: 'BASICO', price: 50, priceType: 'coins', owned: false, image: 'assets/UI/Store/Skins/Normal/Balls/pelota azul.png' },
    { id: 'yellow', name: 'Pelota Amarillo', color: '#ffee00', rarity: 'BASICO', price: 50, priceType: 'coins', owned: false, image: 'assets/UI/Store/Skins/Normal/Balls/pelota amarillo.png' },
    { id: 'orange', name: 'Pelota Naranja', color: '#ff8800', rarity: 'BASICO', price: 50, priceType: 'coins', owned: false, image: 'assets/UI/Store/Skins/Normal/Balls/pelota naranja.png' },
    { id: 'green', name: 'Pelota Verde', color: '#3fe969', rarity: 'BASICO', price: 50, priceType: 'coins', owned: false, image: 'assets/UI/Store/Skins/Normal/Balls/pelota verde.png' },
    { id: 'purple', name: 'Pelota Morado', color: '#cc44ff', rarity: 'BASICO', price: 50, priceType: 'coins', owned: false, image: 'assets/UI/Store/Skins/Normal/Balls/pelota morado.png' },
    { id: 'white', name: 'Pelota Blanco', color: '#ffffff', rarity: 'BASICO', price: 50, priceType: 'coins', owned: false, image: 'assets/UI/Store/Skins/Normal/Balls/pelota blanco.png' },
    { id: 'black', name: 'Pelota Negro', color: '#222222', rarity: 'BASICO', price: 50, priceType: 'coins', owned: false, image: 'assets/UI/Store/Skins/Normal/Balls/pelota negro.png' },

    // Serie Pelota Dona
    { id: 'dona_cyan', name: 'Dona Cian', color: '#00ffe7', rarity: 'ESPECIAL', price: 150, priceType: 'coins', owned: false, image: 'assets/UI/Store/Skins/Normal/Donuts/pelota cian.png' },
    { id: 'dona_red', name: 'Dona Rojo', color: '#ff4444', rarity: 'ESPECIAL', price: 150, priceType: 'coins', owned: false, image: 'assets/UI/Store/Skins/Normal/Donuts/pelota rojo.png' },
    { id: 'dona_blue', name: 'Dona Azul', color: '#5045eb', rarity: 'ESPECIAL', price: 150, priceType: 'coins', owned: false, image: 'assets/UI/Store/Skins/Normal/Donuts/pelota azul.png' },
    { id: 'dona_yellow', name: 'Dona Amarillo', color: '#ffee00', rarity: 'ESPECIAL', price: 150, priceType: 'coins', owned: false, image: 'assets/UI/Store/Skins/Normal/Donuts/pelota amarillo.png' },
    { id: 'dona_orange', name: 'Dona Naranja', color: '#ff8800', rarity: 'ESPECIAL', price: 150, priceType: 'coins', owned: false, image: 'assets/UI/Store/Skins/Normal/Donuts/pelota naranja.png' },
    { id: 'dona_green', name: 'Dona Verde', color: '#3fe969', rarity: 'ESPECIAL', price: 150, priceType: 'coins', owned: false, image: 'assets/UI/Store/Skins/Normal/Donuts/pelota verde.png' },
    { id: 'dona_purple', name: 'Dona Morado', color: '#cc44ff', rarity: 'ESPECIAL', price: 150, priceType: 'coins', owned: false, image: 'assets/UI/Store/Skins/Normal/Donuts/pelota morado.png' },
    { id: 'dona_white', name: 'Dona Blanco', color: '#ffffff', rarity: 'ESPECIAL', price: 150, priceType: 'coins', owned: false, image: 'assets/UI/Store/Skins/Normal/Donuts/pelota blanco.png' },
    { id: 'dona_black', name: 'Dona Negro', color: '#222222', rarity: 'ESPECIAL', price: 150, priceType: 'coins', owned: false, image: 'assets/UI/Store/Skins/Normal/Donuts/pelota negro.png' },

    // Serie Contornos y Especiales
    { id: 'cool', name: 'Contorno Verde', color: '#3fe969', rarity: 'ESPECIAL', price: 300, priceType: 'coins', altPrice: 10, altType: 'gems', owned: false },
    { id: 'contorno_red', name: 'Contorno Rojo', color: '#ff4444', rarity: 'ESPECIAL', price: 300, priceType: 'coins', owned: false },
    { id: 'contorno_purple', name: 'Contorno Morado', color: '#cc44ff', rarity: 'ESPECIAL', price: 300, priceType: 'coins', owned: false },
    { id: 'contorno_cyan', name: 'Contorno Cian', color: '#00ffe7', rarity: 'ESPECIAL', price: 300, priceType: 'coins', owned: false },
    { id: 'contorno_orange', name: 'Contorno Naranja', color: '#ff8800', rarity: 'ESPECIAL', price: 300, priceType: 'coins', owned: false },
    { id: 'contorno_white', name: 'Contorno Blanco', color: '#ffffff', rarity: 'ESPECIAL', price: 300, priceType: 'coins', owned: false },
    { id: 'contorno_black', name: 'Contorno Negro', color: '#222222', rarity: 'ESPECIAL', price: 300, priceType: 'coins', owned: false },
    { id: 'controlador', name: 'Controlador', color: '#00ffe7', rarity: 'ESPECIAL', price: 650, priceType: 'coins', imageRight: 'assets/UI/Store/Skins/skin_neon_ace.png' },
    { id: 'metalman', name: 'Metalman', color: '#ffee00', rarity: 'ESPECIAL', price: 650, priceType: 'coins', imageRight: 'assets/UI/Store/Skins/skin_volt_star.png' },
    { id: 'pichos', name: 'Pichos', color: '#ffffff', rarity: 'ESPECIAL', price: 800, priceType: 'coins', imageRight: 'assets/UI/Store/Skins/skin_pichos.png' },
    { id: 'frank', name: 'Contorno Amarillo', color: '#ffee00', rarity: 'EPICA', price: 1200, priceType: 'coins', altPrice: 40, altType: 'gems', fragments: 3, owned: false },
    { id: 'shield', name: 'Contorno Azul', color: '#4488ff', rarity: 'EPICA', price: 1200, priceType: 'coins', altPrice: 40, altType: 'gems', fragments: 3, owned: false },
    { id: 'kenji', name: 'KENJI', color: '#845cff', rarity: 'EPICA', price: 1500, priceType: 'coins', altPrice: 50, altType: 'gems', fragments: 3, owned: false, image: 'assets/UI/Store/Skins/Normal/KenjiEpic/Kenji_Skin.png', imageSide: 'assets/UI/Store/Skins/Normal/KenjiEpic/Kenji_Skin_lado.png' },
    { id: 'brifon', name: 'BRIFON', color: '#b86cff', rarity: 'EPICA', price: 1600, priceType: 'coins', owned: false, image: 'assets/UI/Store/Skins/Normal/BrifonEpic/Brifon.png', imageSide: 'assets/UI/Store/Skins/Normal/BrifonEpic/BRIFON_Skin_lado.png' },
    { id: 'demon_ember', name: 'Demon Ember', color: '#cf0000', rarity: 'DEMON', price: 4500, priceType: 'coins', altPrice: 150, altType: 'gems', fragments: 3, owned: false },
    { id: 'daxor', name: 'DAXOR', color: '#ff2448', rarity: 'DEMON', price: 5200, priceType: 'coins', altPrice: 170, altType: 'gems', fragments: 3, owned: false, image: 'assets/UI/Store/Skins/Normal/DaxorDemon/DAXOR_Skin.png', imageSide: 'assets/UI/Store/Skins/Normal/DaxorDemon/DAXOR_Skin_lado.png' },

    // ===== PRECIOS ESTIMADOS: bajaron de VIP, ajustar a tu economia real =====
    // ----- ESPECIAL (bajaron de VIP: comida, espacio, oficios, animales sueltos) -----
    { id: 'skin_helado', name: 'Helado', rarity: 'ESPECIAL', price: 450, priceType: 'coins', owned: false, image: 'assets/UI/Store/VIP/Bundles/Food/skin_helado.png' },
    { id: 'skin_limon_toxico', name: 'Limon Toxico', rarity: 'ESPECIAL', price: 450, priceType: 'coins', owned: false, image: 'assets/UI/Store/VIP/Bundles/Food/skin_limon_toxico.png' },
    { id: 'skin_sandia', name: 'Sandia', rarity: 'ESPECIAL', price: 450, priceType: 'coins', owned: false, image: 'assets/UI/Store/VIP/Bundles/Food/skin_sandia.png' },
    { id: 'skin_cafe', name: 'Cafe', rarity: 'ESPECIAL', price: 400, priceType: 'coins', owned: false, image: 'assets/UI/Store/VIP/Bundles/Food/skin_cafe.png' },
    { id: 'skin_papas_fritas', name: 'Papas Fritas', rarity: 'ESPECIAL', price: 550, priceType: 'coins', owned: false, image: 'assets/UI/Store/VIP/Bundles/Food/skin_papas_fritas.png' },
    { id: 'skin_sandwich', name: 'Sandwich', rarity: 'ESPECIAL', price: 500, priceType: 'coins', owned: false, image: 'assets/UI/Store/VIP/Bundles/Food/skin_sandwich.png' },
    { id: 'skin_manzana', name: 'Manzana', rarity: 'ESPECIAL', price: 400, priceType: 'coins', owned: false, image: 'assets/UI/Store/VIP/Bundles/Food/skin_manzana.png' },
    { id: 'skin_palomitas', name: 'Palomitas', rarity: 'ESPECIAL', price: 450, priceType: 'coins', owned: false, image: 'assets/UI/Store/VIP/Bundles/Food/skin_palomitas.png' },
    { id: 'skin_cupcake', name: 'Cupcake', rarity: 'ESPECIAL', price: 500, priceType: 'coins', owned: false, image: 'assets/UI/Store/VIP/Bundles/Food/skin_cupcake.png' },
    { id: 'skin_jugo', name: 'Jugo', rarity: 'ESPECIAL', price: 350, priceType: 'coins', owned: false, image: 'assets/UI/Store/VIP/Bundles/Food/skin_jugo.png' },
    { id: 'skin_galleta', name: 'Galleta', rarity: 'ESPECIAL', price: 450, priceType: 'coins', owned: false, image: 'assets/UI/Store/VIP/Bundles/Food/skin_galleta.png' },
    { id: 'skin_torta', name: 'Torta', rarity: 'ESPECIAL', price: 550, priceType: 'coins', owned: false, image: 'assets/UI/Store/VIP/Bundles/Food/skin_torta.png' },
    { id: 'skin_pina', name: 'Pina', rarity: 'ESPECIAL', price: 500, priceType: 'coins', owned: false, image: 'assets/UI/Store/VIP/Bundles/Food/skin_pina.png' },
    { id: 'skin_pancakes', name: 'Pancakes', rarity: 'ESPECIAL', price: 700, priceType: 'coins', owned: false, image: 'assets/UI/Store/VIP/Bundles/Food/skin_pancakes.png' },
    { id: 'skin_dona', name: 'Dona', rarity: 'ESPECIAL', price: 450, priceType: 'coins', owned: false, image: 'assets/UI/Store/VIP/Bundles/Food/skin_dona.png' },
    { id: 'skin_planeta_marte', name: 'Planeta Marte', rarity: 'ESPECIAL', price: 650, priceType: 'coins', owned: false, rolling: true, image: 'assets/UI/Store/VIP/Bundles/Space/skin_planeta_marte.png' },
    { id: 'skin_planeta_saturno', name: 'Planeta Saturno', rarity: 'ESPECIAL', price: 650, priceType: 'coins', owned: false, rolling: true, image: 'assets/UI/Store/VIP/Bundles/Space/skin_planeta_saturno.png' },
    { id: 'skin_planeta_tierra', name: 'Planeta Tierra', rarity: 'ESPECIAL', price: 650, priceType: 'coins', owned: false, rolling: true, image: 'assets/UI/Store/VIP/Bundles/Space/skin_planeta_tierra.png' },
    { id: 'skin_meteorito', name: 'Meteorito', rarity: 'ESPECIAL', price: 680, priceType: 'coins', owned: false, image: 'assets/UI/Store/VIP/Bundles/Space/skin_meteorito.png' },
    { id: 'skin_alien', name: 'Alien', rarity: 'ESPECIAL', price: 700, priceType: 'coins', owned: false, image: 'assets/UI/Store/VIP/Bundles/Space/skin_alien.png' },
    { id: 'skin_agujero_negro', name: 'Agujero Negro', rarity: 'ESPECIAL', price: 750, priceType: 'coins', owned: false, image: 'assets/UI/Store/VIP/Bundles/Space/skin_agujero_negro.png' },
    { id: 'skin_galaxia', name: 'Galaxia', rarity: 'ESPECIAL', price: 650, priceType: 'coins', owned: false, rolling: true, image: 'assets/UI/Store/VIP/Bundles/Space/skin_galaxia.png' },
    { id: 'skin_chef', name: 'Chef', rarity: 'ESPECIAL', price: 600, priceType: 'coins', owned: false, image: 'assets/UI/Store/VIP/Bundles/Professional/skin_chef.png' },
    { id: 'skin_cerdo', name: 'Cerdo', rarity: 'ESPECIAL', price: 600, priceType: 'coins', owned: false, image: 'assets/UI/Store/VIP/Bundles/Wild/skin_cerdo.png' },
    { id: 'skin_elefante', name: 'Elefante', rarity: 'ESPECIAL', price: 700, priceType: 'coins', owned: false, image: 'assets/UI/Store/VIP/Bundles/Wild/skin_elefante.png' },
    { id: 'skin_bruja', name: 'Bruja', rarity: 'ESPECIAL', price: 500, priceType: 'coins', owned: false, image: 'assets/UI/Store/VIP/Bundles/Monsters/skin_bruja.png' },

    // ----- EPICA (bajaron de VIP: comida, oficios, animales, monstruos sueltos) -----
    { id: 'skin_chocolate', name: 'Chocolate', rarity: 'EPICA', price: 1200, priceType: 'coins', owned: false, image: 'assets/UI/Store/VIP/Bundles/Food/skin_chocolate.png' },
    { id: 'skin_sol', name: 'Sol', rarity: 'EPICA', price: 1200, priceType: 'coins', owned: false, image: 'assets/UI/Store/VIP/Bundles/Space/skin_sol.png' },
    { id: 'skin_luna', name: 'Luna', rarity: 'EPICA', price: 1200, priceType: 'coins', owned: false, image: 'assets/UI/Store/VIP/Bundles/Space/skin_luna.png' },
    { id: 'skin_hamburguesa', name: 'Hamburguesa', rarity: 'EPICA', price: 1300, priceType: 'coins', owned: false, image: 'assets/UI/Store/VIP/Bundles/Food/skin_hamburguesa.png' },
    { id: 'skin_pizza', name: 'Pizza', rarity: 'EPICA', price: 1200, priceType: 'coins', owned: false, image: 'assets/UI/Store/VIP/Bundles/Food/skin_pizza.png' },
    { id: 'skin_ninja', name: 'Ninja', rarity: 'EPICA', price: 1300, priceType: 'coins', owned: false, image: 'assets/UI/Store/VIP/Bundles/Professional/skin_ninja.png' },
    { id: 'skin_pirata', name: 'Pirata', rarity: 'EPICA', price: 1300, priceType: 'coins', owned: false, image: 'assets/UI/Store/VIP/Bundles/Professional/skin_pirata.png' },
    { id: 'skin_cientifico', name: 'Cientifico', rarity: 'EPICA', price: 1300, priceType: 'coins', owned: false, image: 'assets/UI/Store/VIP/Bundles/Professional/skin_cientifico.png' },
    { id: 'skin_hacker', name: 'Hacker', rarity: 'EPICA', price: 1400, priceType: 'coins', owned: false, image: 'assets/UI/Store/VIP/Bundles/Professional/skin_hacker.png' },
    { id: 'skin_cebra', name: 'Cebra', rarity: 'EPICA', price: 1300, priceType: 'coins', owned: false, image: 'assets/UI/Store/VIP/Bundles/Wild/skin_cebra.png' },
    { id: 'skin_tiburon', name: 'Tiburon', rarity: 'EPICA', price: 1400, priceType: 'coins', owned: false, image: 'assets/UI/Store/VIP/Bundles/Wild/skin_tiburon.png' },
    { id: 'skin_cuervo', name: 'Cuervo', rarity: 'EPICA', price: 1300, priceType: 'coins', owned: false, image: 'assets/UI/Store/VIP/Bundles/Wild/skin_cuervo.png' },
    { id: 'skin_escorpion', name: 'Escorpion', rarity: 'EPICA', price: 1350, priceType: 'coins', owned: false, image: 'assets/UI/Store/VIP/Bundles/Wild/skin_escorpion.png' },
    { id: 'skin_serpiente', name: 'Serpiente', rarity: 'EPICA', price: 1300, priceType: 'coins', owned: false, image: 'assets/UI/Store/VIP/Bundles/Wild/skin_serpiente.png' },
    { id: 'skin_fantasma', name: 'Fantasma', rarity: 'EPICA', price: 1200, priceType: 'coins', owned: false, image: 'assets/UI/Store/VIP/Bundles/Monsters/skin_fantasma.png' },
    { id: 'skin_lobo_monstruo', name: 'Lobo Monstruo', rarity: 'EPICA', price: 1300, priceType: 'coins', owned: false, image: 'assets/UI/Store/VIP/Bundles/Monsters/skin_lobo_monstruo.png' },
    { id: 'skin_calabaza', name: 'Calabaza', rarity: 'EPICA', price: 1200, priceType: 'coins', owned: false, image: 'assets/UI/Store/VIP/Bundles/Monsters/skin_calabaza.png' },
    { id: 'skin_nocturna', name: 'Nocturna', rarity: 'EPICA', price: 1300, priceType: 'coins', owned: false, image: 'assets/UI/Store/VIP/Bundles/Monsters/skin_nocturna.png' },

    // ----- DEMON (bajo de VIP) -----
    { id: 'skin_samurai', name: 'Samurai', rarity: 'DEMON', price: 4800, priceType: 'coins', owned: false, image: 'assets/UI/Store/VIP/Bundles/Professional/skin_samurai.png' }
];

// Lista de skins desbloqueables con fragmentos
const FRAGMENT_SKINS_LIST = [
    { id: 'skin_caballero_dorado', name: 'Caballero Dorado', rarity: 'LEGENDARIO', imageRight: 'assets/UI/Store/VIP/Bundles/Royal/skin_caballero_dorado.png' }, // ahora trofeo, no vipOnly
    { id: 'skin_reina', name: 'Reina', rarity: 'VIP', vipOnly: true, imageRight: 'assets/UI/Store/VIP/Bundles/Royal/skin_reina.png' },
    { id: 'skin_emperador_oscuro', name: 'Principe Oscuro', rarity: 'VIP', vipOnly: true, imageRight: 'assets/UI/Store/VIP/Bundles/Royal/skin_emperador_oscuro.png' },
    { id: 'skin_fantasma', name: 'Fantasma', rarity: 'EPICA', imageRight: 'assets/UI/Store/VIP/Bundles/Monsters/skin_fantasma.png' }, // bajo a tienda normal
    { id: 'skin_limon_toxico', name: 'Limon', rarity: 'ESPECIAL', imageRight: 'assets/UI/Store/VIP/Bundles/Food/skin_limon_toxico.png' }, // bajo a tienda normal
    { id: 'skin_planeta_marte', name: 'Marte', rarity: 'ESPECIAL', imageRight: 'assets/UI/Store/VIP/Bundles/Space/skin_planeta_marte.png' }, // bajo a tienda normal
    { id: 'skin_planeta_tierra', name: 'Tierra', rarity: 'ESPECIAL', imageRight: 'assets/UI/Store/VIP/Bundles/Space/skin_planeta_tierra.png' }, // bajo a tienda normal
    { id: 'skin_cuervo', name: 'Cuervo', rarity: 'EPICA', imageRight: 'assets/UI/Store/VIP/Bundles/Wild/skin_cuervo.png' }, // bajo a tienda normal
    { id: 'skin_mama_claus', name: 'Mama Claus', rarity: 'VIP', vipOnly: true, imageRight: 'assets/UI/Store/VIP/Bundles/Christmas/skin_mama_claus.png' }
];

// Exportar datos de skins para uso global
window.SKINS_DATA = SKINS_DATA;

// Colores de rareza para items
const RARITY_COLORS = {
    DEFAULT: 'rgba(255,255,255,0.35)',
    BASICO: '#57b7dd',
    ESPECIAL: '#ff9a17',
    EPICA: '#cc44ff',
    DEMON: '#cf0000',
    VIP: '#ffee00',
    LEGENDARIO: '#8a2be2',
    EXCLUSIVO: GEM_EXCLUSIVE_RARITY_COLOR,
};
// Colores de rareza para banners
const BANNER_RARITY_COLORS = {
    DEFAULT: 'rgba(255,255,255,0.35)',
    BASICO: '#57b7dd',
    ESPECIAL: '#ff9a17',
    EPICA: '#cc44ff',
    DEMON: '#cf0000',
    VIP: '#ffee00',
    LEGENDARIO: '#8a2be2',
    EXCLUSIVO: GEM_EXCLUSIVE_RARITY_COLOR,
};

const CURRENCY_ICONS = {
    coins: 'assets/UI/Common/Currency/DEAD_COIN.png',
    gems: 'assets/UI/Common/Currency/Rubies.png'
};

const REWARD_CURRENCY_ASSETS = {
    gems: {
        large: 'assets/UI/Common/Rewards/Currency/Gems/Monton_de_gemas_grande.png',
        medium: 'assets/UI/Common/Rewards/Currency/Gems/Monton_de_gemas_Mediano.png',
        small: 'assets/UI/Common/Rewards/Currency/Gems/Monton_de_gemas_Pequeno.png',
        single: 'assets/UI/Common/Rewards/Currency/Gems/Monojo_de_gemas.png'
    },
    coins: {
        large: 'assets/UI/Common/Rewards/Currency/Coins/Monton_de_monedas_grande.png',
        medium: 'assets/UI/Common/Rewards/Currency/Coins/Monton_de_monedas_Mediano.png',
        small: 'assets/UI/Common/Rewards/Currency/Coins/Monton_de_monedas_Pequeno.png',
        single: 'assets/UI/Common/Rewards/Currency/Coins/Monojo_de_monedas.png'
    }
};

// Datos de banners disponibles en la tienda
const BANNERS_DATA = [

    // Banner por defecto
    {
        id: 'Banner_Deafult',
        name: 'El inicio...',
        price: 0,
        exclusive: false,
        cover: 'assets/Imagenes/Banners/tienda_normal/Banner_Deafult.png',
        rarity: 'DEFAULT'
    },

    // Banners Básicos
    {
        id: 'Speed_Color_Green',
        name: 'Speed Color Green',
        price: 150,
        exclusive: false,
        cover: 'assets/Imagenes/Banners/tienda_normal/Speed_Color_Green.png',
        rarity: 'BASICO'
    },
    {
        id: 'Speed_Color_Gold',
        name: 'Speed Color Gold',
        price: 150,
        exclusive: false,
        cover: 'assets/Imagenes/Banners/tienda_normal/Speed_Color_Gold.png',
        rarity: 'BASICO'
    },
    {
        id: 'Speed_Color_Gray',
        name: 'Speed Color Gray',
        price: 150,
        exclusive: false,
        cover: 'assets/Imagenes/Banners/tienda_normal/Speed_Color_Gray.png',
        rarity: 'BASICO'
    },
    {
        id: 'Speed_Color_Blue',
        name: 'Speed Color Blue',
        price: 150,
        exclusive: false,
        cover: 'assets/Imagenes/Banners/tienda_normal/Speed_Color_Blue.png',
        rarity: 'BASICO'
    },
    {
        id: 'Speed_Color_Oranje',
        name: 'Speed Color Oranje',
        price: 150,
        exclusive: false,
        cover: 'assets/Imagenes/Banners/tienda_normal/Speed_Color_Oranje.png',
        rarity: 'BASICO'
    },
    {
        id: 'Speed_Color_Red',
        name: 'Speed Color Red',
        price: 150,
        exclusive: false,
        cover: 'assets/Imagenes/Banners/tienda_normal/Speed_Color_Red.png',
        rarity: 'BASICO'
    },
    {
        id: 'Speed_Color_Rgb',
        name: 'Speed Color Rgb',
        price: 150,
        exclusive: false,
        cover: 'assets/Imagenes/Banners/tienda_normal/Speed_Color_Rgb.png',
        rarity: 'BASICO'
    },
    {
        id: 'Speed_Color_Black',
        name: 'Speed Color Black',
        price: 150,
        exclusive: false,
        cover: 'assets/Imagenes/Banners/tienda_normal/Speed_Color_Black.png',
        rarity: 'BASICO'
    },

    // Banners Especiales
    {
        id: 'Speed_Color_Red_Animado',
        name: 'Speed Color Red Animado',
        price: 350,
        exclusive: false,
        cover: 'assets/Imagenes/Banners/tienda_normal/Speed_Color_Red_Animado.gif',
        rarity: 'ESPECIAL'
    },
    {
        id: 'Abstracto_Fuego_Rojo',
        name: 'Estas que ardes',
        price: 300,
        exclusive: false,
        cover: 'assets/Imagenes/Banners/tienda_normal/Abstracto_Fuego_Rojo.png',
        rarity: 'ESPECIAL'
    },
    {
        id: 'Abstracto_Lineas_Yellow',
        name: 'Un toque sofisticado',
        price: 300,
        exclusive: false,
        cover: 'assets/Imagenes/Banners/tienda_normal/Abstracto_Lineas_Yellow.png',
        rarity: 'ESPECIAL'
    },
    {
        id: 'Abstracto_Rayos_Az_Rd',
        name: 'Para alguien especial',
        price: 300,
        exclusive: false,
        cover: 'assets/Imagenes/Banners/tienda_normal/Abstracto_Rayos_Az_Rd.png',
        rarity: 'ESPECIAL'
    },
    {
        id: 'Abstracto_Rayos_Morados',
        name: 'Algo dark para alguien dark',
        price: 300,
        exclusive: false,
        cover: 'assets/Imagenes/Banners/tienda_normal/Abstracto_Rayos_Morados.png',
        rarity: 'ESPECIAL'
    },
    {
        id: 'Abstracto_Rayos_Rojos',
        name: 'Para alguien mas especial',
        price: 300,
        exclusive: false,
        cover: 'assets/Imagenes/Banners/tienda_normal/Abstracto_Rayos_Rojos.png',
        rarity: 'ESPECIAL'
    },
    {
        id: 'Dark_Lineas_Blue',
        name: 'Un tono relajante verdad?',
        price: 300,
        exclusive: false,
        cover: 'assets/Imagenes/Banners/tienda_normal/Dark_Lineas_Blue.png',
        rarity: 'ESPECIAL'
    },
    {
        id: 'Dark_Ondas_Blue',
        name: 'Muchas ondas!!',
        price: 300,
        exclusive: false,
        cover: 'assets/Imagenes/Banners/tienda_normal/Dark_Ondas_Blue.png',
        rarity: 'ESPECIAL'
    },
    {
        id: 'Neon_Grid_Motion',
        name: 'Simple pero elegante',
        price: 300,
        exclusive: false,
        cover: 'assets/Imagenes/Banners/tienda_normal/Neon_Grid_Motion.png',
        rarity: 'ESPECIAL'
    },
    {
        id: 'Ondas_Blue',
        name: 'Un tono relajante v2',
        price: 300,
        exclusive: false,
        cover: 'assets/Imagenes/Banners/tienda_normal/Ondas_Blue.png',
        rarity: 'ESPECIAL'
    },

    // Banners Épicos
    {
        id: 'Dark_Lineas_Or_Bck',
        name: 'Tienes calor?',
        price: 500,
        exclusive: false,
        cover: 'assets/Imagenes/Banners/tienda_normal/Dark_Lineas_Or_Bck.gif',
        rarity: 'EPICA'
    },
    {
        id: 'Dark_Aurora_Blue',
        name: 'Siente el poder!',
        price: 500,
        exclusive: false,
        cover: 'assets/Imagenes/Banners/tienda_normal/Dark_Aurora_Blue.gif',
        rarity: 'EPICA'
    },
    {
        id: 'Dark_Ondas_PrAz',
        name: 'Calma, que aun no inicia...',
        price: 500,
        exclusive: false,
        cover: 'assets/Imagenes/Banners/tienda_normal/Dark_Ondas_PrAz.gif',
        rarity: 'EPICA'
    },
    {
        id: 'Speed_Color_Yellow_Animado',
        name: 'Te vez cool con este',
        price: 500,
        exclusive: false,
        cover: 'assets/Imagenes/Banners/tienda_normal/Speed_Color_Yellow_Animado.gif',
        rarity: 'EPICA'
    },

    // Banners Demon
    {
        id: 'El_Dragon_Chino',
        name: 'El Dragon Chino',
        price: 300,
        exclusive: false,
        cover: 'assets/Imagenes/Banners/tienda_normal/El_Dragon_Chino.png',
        rarity: 'DEMON'
    },
    {
        id: 'Un_poco_de_nieve',
        name: 'Un poco de nieve?',
        price: 300,
        exclusive: false,
        cover: 'assets/Imagenes/Banners/tienda_normal/Un_poco_de_nieve.png',
        rarity: 'DEMON'
    },
    {
        id: 'Vacaciones_en_la_playa',
        name: 'Vacaciones en la playa',
        price: 300,
        exclusive: false,
        cover: 'assets/Imagenes/Banners/tienda_normal/Vacaciones_en_la playa.png',
        rarity: 'DEMON'
    },

    // Banners VIP
    {
        id: 'Dracula_Edition',
        name: 'El Dracula',
        price: 300,
        exclusive: true,
        cover: 'assets/Imagenes/Banners/tienda_vip/Dracula_Edition.png',
        rarity: 'VIP'
    },
    {
        id: 'Jack_o_lantern',
        name: 'Jack o lantern',
        price: 300,
        exclusive: true,
        cover: 'assets/Imagenes/Banners/tienda_vip/Jack_o_lantern_monster.png',
        rarity: 'VIP'
    },
    {
        id: 'Zombies_Edition',
        name: 'Los zombies estan aqui!',
        price: 300,
        exclusive: true,
        cover: 'assets/Imagenes/Banners/tienda_vip/Zombies_Edition.png',
        rarity: 'VIP'
    },
    {
        id: 'El_Dragon_Chino_VIP',
        name: 'El Super Dragon Chino',
        price: 500,
        exclusive: false,
        cover: 'assets/Imagenes/Banners/tienda_vip/El_Dragon_Chino_VIP.png',
        rarity: 'VIP'
    },
    {
        id: 'Un_poco_de_hielo_VIP',
        name: 'Un poco de hielo',
        price: 500,
        exclusive: true,
        cover: 'assets/Imagenes/Banners/tienda_vip/Un_poco_de_hielo_VIP.png',
        rarity: 'VIP'
    },
    {
        id: 'La_playa_relajante_VIP',
        name: 'La playa es relajante',
        price: 500,
        exclusive: true,
        cover: 'assets/Imagenes/Banners/tienda_vip/Vacaciones_en_la playa_VIP.png',
        rarity: 'VIP'
    },
];

// Placeholders de banners VIP
const VIP_BANNER_PLACEHOLDERS = [
    { id: 'VIP_Placeholder_PNG_1', name: 'VIP Placeholder PNG 1', price: 420, cover: 'assets/Imagenes/Banners/tienda_vip/VIP_Placeholder_PNG_1.png', rarity: 'VIP', exclusive: true },
    { id: 'VIP_Placeholder_PNG_2', name: 'VIP Placeholder PNG 2', price: 420, cover: 'assets/Imagenes/Banners/tienda_vip/VIP_Placeholder_PNG_2.png', rarity: 'VIP', exclusive: true },
    { id: 'VIP_Placeholder_PNG_3', name: 'VIP Placeholder PNG 3', price: 420, cover: 'assets/Imagenes/Banners/tienda_vip/VIP_Placeholder_PNG_3.png', rarity: 'VIP', exclusive: true },
    { id: 'VIP_Placeholder_PNG_4', name: 'VIP Placeholder PNG 4', price: 420, cover: 'assets/Imagenes/Banners/tienda_vip/VIP_Placeholder_PNG_4.png', rarity: 'VIP', exclusive: true },
    { id: 'VIP_Placeholder_PNG_5', name: 'VIP Placeholder PNG 5', price: 420, cover: 'assets/Imagenes/Banners/tienda_vip/VIP_Placeholder_PNG_5.png', rarity: 'VIP', exclusive: true },
    { id: 'VIP_Placeholder_GIF_1', name: 'VIP Placeholder GIF 1', price: 560, cover: 'assets/Imagenes/Banners/tienda_vip/VIP_Placeholder_GIF_1.gif', rarity: 'VIP', exclusive: true, animated: true },
    { id: 'VIP_Placeholder_GIF_2', name: 'VIP Placeholder GIF 2', price: 560, cover: 'assets/Imagenes/Banners/tienda_vip/VIP_Placeholder_GIF_2.gif', rarity: 'VIP', exclusive: true, animated: true },
    { id: 'VIP_Placeholder_GIF_3', name: 'VIP Placeholder GIF 3', price: 560, cover: 'assets/Imagenes/Banners/tienda_vip/VIP_Placeholder_GIF_3.gif', rarity: 'VIP', exclusive: true, animated: true },
    { id: 'VIP_Placeholder_GIF_4', name: 'VIP Placeholder GIF 4', price: 560, cover: 'assets/Imagenes/Banners/tienda_vip/VIP_Placeholder_GIF_4.gif', rarity: 'VIP', exclusive: true, animated: true },
    { id: 'VIP_Placeholder_GIF_5', name: 'VIP Placeholder GIF 5', price: 560, cover: 'assets/Imagenes/Banners/tienda_vip/VIP_Placeholder_GIF_5.gif', rarity: 'VIP', exclusive: true, animated: true }
];

const BANNERS_CATALOG_CONFIG = window.GEM_BANNERS_CATALOG || null;
const BANNER_CATALOG_RULES = BANNERS_CATALOG_CONFIG?.rules || {};
const BANNER_CATALOG_PATHS = BANNERS_CATALOG_CONFIG?.paths || {};

function parseBannerCatalogDate(value) {
    if (!value) return null;
    const date = new Date(`${value}T00:00:00`);
    return Number.isNaN(date.getTime()) ? null : date;
}

function addBannerCatalogMonths(date, months) {
    if (!(date instanceof Date)) return null;
    const next = new Date(date.getTime());
    next.setMonth(next.getMonth() + months);
    return next;
}

function getBannerCatalogNow() {
    return new Date();
}

function getBannerCatalogCover(item, activeCategory) {
    const category = item.category === 'banners_temporada' || item.category === 'banners_nuevos'
        ? item.category
        : activeCategory;
    const basePath = BANNER_CATALOG_PATHS[category] || BANNER_CATALOG_PATHS[activeCategory] || '';
    return `${basePath}${item.file}`;
}

function slugifyBannerCatalogId(value) {
    const slug = String(value || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/^_+|_+$/g, '');
    return slug || 'banner';
}

function getBannerCatalogItemId(item) {
    if (!item) return '';
    if (item.autoIdFromName === true) {
        const prefix = item.idPrefix ? `${slugifyBannerCatalogId(item.idPrefix)}_` : '';
        return `${prefix}${slugifyBannerCatalogId(item.name || item.id)}`;
    }
    return item.id;
}

function getBannerCatalogAliases(item, resolvedId) {
    return [item.id, ...(Array.isArray(item.legacyIds) ? item.legacyIds : [])]
        .filter(Boolean)
        .filter((id, index, list) => id !== resolvedId && list.indexOf(id) === index);
}

function getBannerActiveCategory(item, now = getBannerCatalogNow()) {
    if (!item) return 'tienda_normal';

    if (item.category === 'banners_temporada') {
        const expiresAt = parseBannerCatalogDate(item.expiresAt);
        return expiresAt && now >= expiresAt
            ? (BANNER_CATALOG_RULES.expiredSeasonalCategory || 'tienda_vip')
            : 'tienda_normal';
    }

    if (item.category === 'banners_nuevos') {
        const movesAt = parseBannerCatalogDate(item.movesAt)
            || addBannerCatalogMonths(parseBannerCatalogDate(item.addedAt), BANNER_CATALOG_RULES.newMovesAfterMonths || 2);
        return movesAt && now >= movesAt
            ? (item.finalCategory || 'tienda_normal')
            : 'tienda_normal';
    }

    return item.category || 'tienda_normal';
}

function mapBannerCatalogItem(item) {
    const activeCategory = getBannerActiveCategory(item);
    const movedToVip = activeCategory === 'tienda_vip';
    const pendingNewVip = item.category === 'banners_nuevos' && item.finalCategory === 'tienda_vip' && !movedToVip;
    const id = getBannerCatalogItemId(item);
    return {
        id,
        aliases: getBannerCatalogAliases(item, id),
        name: item.name,
        price: item.price ?? 0,
        exclusive: movedToVip || (item.exclusive === true && !pendingNewVip),
        cover: getBannerCatalogCover(item, activeCategory),
        rarity: pendingNewVip ? (item.previewRarity || 'ESPECIAL') : (movedToVip ? 'VIP' : (item.rarity || 'BASICO')),
        animated: item.animated === true || String(item.file || '').toLowerCase().endsWith('.gif'),
        category: item.category,
        activeCategory,
        finalCategory: item.finalCategory || null,
        startsAt: item.startsAt || null,
        expiresAt: item.expiresAt || null,
        addedAt: item.addedAt || null,
        movesAt: item.movesAt || null,
        isSeasonal: item.category === 'banners_temporada',
        isNew: item.category === 'banners_nuevos'
    };
}

function getAllBannerCatalog() {
    if (!Array.isArray(BANNERS_CATALOG_CONFIG?.items)) {
        return [...BANNERS_DATA, ...VIP_BANNER_PLACEHOLDERS]
            .filter((banner, index, list) => banner?.id && list.findIndex(item => item.id === banner.id) === index);
    }
    return BANNERS_CATALOG_CONFIG.items.map(mapBannerCatalogItem);
}

function getNormalBannerCatalog() {
    return getAllBannerCatalog().filter(banner => banner.activeCategory !== 'tienda_vip');
}

function getVipBannerCatalogFromConfig() {
    return getAllBannerCatalog().filter(banner => banner.activeCategory === 'tienda_vip');
}

function findBannerById(id) {
    return getAllBannerCatalog().find(banner => banner.id === id || banner.aliases?.includes(id));
}

function getBannerStorageIds(banner) {
    if (!banner) return [];
    return [banner.id, ...(Array.isArray(banner.aliases) ? banner.aliases : [])].filter(Boolean);
}

function ownsBanner(banner) {
    return banner?.id === 'Banner_Deafult'
        || getBannerStorageIds(banner).some(id => localStorage.getItem('banner_' + id) === 'true')
        || banner?.owned === true;
}

function setBannerOwned(banner) {
    if (!banner?.id) return;
    localStorage.setItem('banner_' + banner.id, 'true');
}

function isBannerEquipped(banner, equippedId = localStorage.getItem('equippedBanner')) {
    return getBannerStorageIds(banner).includes(equippedId);
}

if (Array.isArray(BANNERS_CATALOG_CONFIG?.items)) {
    BANNERS_DATA.length = 0;
    BANNERS_DATA.push(...getNormalBannerCatalog());
    VIP_BANNER_PLACEHOLDERS.length = 0;
    VIP_BANNER_PLACEHOLDERS.push(...getVipBannerCatalogFromConfig());
}

// Verificar si un banner es exclusivamente VIP
// banner: Objeto del banner
// Retorna true si es VIP
function isVIPBannerOnly(banner) {
    return banner?.activeCategory === 'tienda_vip' || banner?.rarity === 'VIP' || banner?.exclusive === true;
}

// Obtener el catálogo de banners VIP
// Retorna array de banners VIP
function getVIPBannerCatalog() {
    if (Array.isArray(BANNERS_CATALOG_CONFIG?.items)) {
        return getVipBannerCatalogFromConfig();
    }
    const byId = new Map();
    [...BANNERS_DATA, ...VIP_BANNER_PLACEHOLDERS].forEach(banner => {
        if (!banner?.id || !isVIPBannerOnly(banner) || byId.has(banner.id)) return;
        byId.set(banner.id, { ...banner, rarity: 'VIP', exclusive: true });
    });
    return [...byId.values()];
}

// --- Filas escalonadas (panal) de la Sala Legendaria ---------------------

let vipBannerCollectionRarityFilter = 'ALL';

function chunkArray(list, size) {
    const out = [];
    for (let i = 0; i < list.length; i += size) out.push(list.slice(i, i + size));
    return out;
}

// A diferencia del flag "isNew" de mapBannerCatalogItem (que queda true para
// siempre según la categoría original), esto revisa si TODAVIA no llegó movesAt.
function isBannerStillNew(banner) {
    if (!banner || banner.category !== 'banners_nuevos') return false;
    const movesAt = parseBannerCatalogDate(banner.movesAt)
        || addBannerCatalogMonths(parseBannerCatalogDate(banner.addedAt), BANNER_CATALOG_RULES.newMovesAfterMonths || 2);
    return !movesAt || getBannerCatalogNow() < movesAt;
}

// Igual que arriba pero para temporada: revisa si TODAVIA no llegó expiresAt.
function isBannerStillSeasonal(banner) {
    if (!banner || banner.category !== 'banners_temporada') return false;
    const expiresAt = parseBannerCatalogDate(banner.expiresAt);
    return !expiresAt || getBannerCatalogNow() < expiresAt;
}

// Arma las filas que pinta la Sala Legendaria: Temporada (estática), Nuevos
// (carrusel-loop) y Colección repartida en varias filas carrusel-loop.
function getVIPBannerShelfRows() {
    const all = typeof getAllBannerCatalog === 'function' ? getAllBannerCatalog() : [];
    const temporada = all.filter(isBannerStillSeasonal);
    const nuevos = all.filter(isBannerStillNew);
    const coleccion = getVIPBannerCatalog().filter(banner => !isBannerStillNew(banner) && !isBannerStillSeasonal(banner));
    const availableRarities = GEM_ALLOWED_RARITIES
        .filter(rarity => rarity !== 'DEFAULT')
        .filter(rarity => coleccion.some(banner => normalizeGemRarity(banner.rarity, banner.rarity) === rarity));
    const activeFilter = availableRarities.includes(vipBannerCollectionRarityFilter)
        ? vipBannerCollectionRarityFilter
        : 'ALL';
    if (activeFilter !== vipBannerCollectionRarityFilter) vipBannerCollectionRarityFilter = activeFilter;
    const filteredColeccion = activeFilter === 'ALL'
        ? coleccion
        : coleccion.filter(banner => normalizeGemRarity(banner.rarity, banner.rarity) === activeFilter);
    const coleccionRows = chunkArray(filteredColeccion, 6);
    return { temporada, nuevos, coleccionRows, availableRarities, activeFilter };
}

function setVIPBannerCollectionRarityFilter(rarity) {
    vipBannerCollectionRarityFilter = rarity === 'ALL' ? 'ALL' : (normalizeGemRarity(rarity) || 'ALL');
    renderVIPPromoDetail('vip_specials');
}

function renderVIPBannerRarityFilter(rarities, activeFilter) {
    if (!Array.isArray(rarities) || !rarities.length) return '';
    const chips = ['ALL', ...rarities].map(rarity => {
        const active = rarity === activeFilter;
        const label = rarity === 'ALL' ? 'TODAS' : rarity;
        const color = rarity === 'ALL' ? '#ffee00' : (BANNER_RARITY_COLORS[rarity] || '#57b7dd');
        return `<button class="vip-banner-rarity-chip ${active ? 'active' : ''}" style="--vip-filter-color:${color};" onclick="setVIPBannerCollectionRarityFilter('${rarity}')" type="button">${label}</button>`;
    }).join('');
    return `
        <div class="vip-banner-rarity-filter" aria-label="Filtrar coleccion por rareza">
            <span>RAREZA</span>
            <div>${chips}</div>
        </div>
    `;
}

// Datos de cofres disponibles en la tienda
const CHESTS_DATA = [
    { id: 'basic', name: 'Cofre Basico', image: 'assets/Imagenes/Cofres Imagenes/Cofre BASICO.png', openImage: 'assets/Imagenes/Cofres Imagenes/Cofres Abiertos/Cofre_BASICO_Abierto.png', cost: 150, currency: 'coins', base: { coins: [25, 60], gems: [0, 1] }, drops: [['Item basico', 85], ['Item especial', 14], ['Fragmento epico', 1]] },
    { id: 'special', name: 'Cofre Especial', image: 'assets/Imagenes/Cofres Imagenes/Cofre ESPECIAL.png', openImage: 'assets/Imagenes/Cofres Imagenes/Cofres Abiertos/Cofre_ESPECIAL_Abierto.png', cost: 500, currency: 'coins', altCost: 20, altCurrency: 'gems', base: { coins: [70, 140], gems: [1, 3] }, drops: [['Item especial', 60], ['Fragmento epico', 8], ['Fragmento demon', 2]] },
    { id: 'epic', name: 'Cofre Epico', image: 'assets/Imagenes/Cofres Imagenes/Cofre EPICO.png', openImage: 'assets/Imagenes/Cofres Imagenes/Cofres Abiertos/Cofre_EPICO_Abierto.png', cost: 100, currency: 'gems', base: { coins: [150, 260], gems: [4, 8] }, drops: [['Fragmento epico o item completo', 70], ['Fragmento demon', 9], ['Fragmento VIP', 1]] },
    { id: 'demon', name: 'Cofre Demon', image: 'assets/Imagenes/Cofres Imagenes/Cofre DEMON.png', openImage: 'assets/Imagenes/Cofres Imagenes/Cofres Abiertos/Cofre_DEMON_Abierto.png', cost: 250, currency: 'gems', base: { coins: [260, 420], gems: [8, 16] }, drops: [['Fragmento o item Demon', 65], ['Fragmento VIP', 10]] },
    { id: 'vip', name: 'Cofre VIP', image: 'assets/Imagenes/Cofres Imagenes/Cofre VIP.png', openImage: 'assets/Imagenes/Cofres Imagenes/Cofres Abiertos/Cofre_VIP_Abierto.png', cost: 600, currency: 'gems', base: { coins: [450, 800], gems: [18, 34] }, drops: [['Fragmento o item VIP', 60], ['Fragmento Demon', 40]] },
    { id: 'luck', name: 'Cofre de la Suerte', image: 'assets/Imagenes/Cofres Imagenes/Cofre LUCK.png', openImage: 'assets/Imagenes/Cofres Imagenes/Cofres Abiertos/Cofre_LUCK_Abierto.png', cost: 50, currency: 'coins', base: { coins: [35, 90], gems: [0, 2] }, drops: [['Monedas extra', 50], ['Fragmento epico', 30], ['Skin sorpresa', 15], ['Fragmento demon', 5]], upgradeable: true }
];
window.CHESTS_DATA = CHESTS_DATA;

// Llave de Caronte (PLAN_LLAVES_CARONTE.md, Parte C): drop independiente,
// muy raro, SOLO en cofres de rareza alta. basic/special/luck nunca la sueltan
// (mantiene la sensación de rareza). Ajustar estos % con datos reales luego.
const CARONTE_KEY_CHEST_CHANCE = {
    basic: 0,
    special: 0,
    luck: 0,
    epic: 0.008,   // 0.8%
    demon: 0.02,   // 2%
    vip: 0.035     // 3.5%
};

// Colores por cofre (no tienen campo rarity propio, se reusan los colores de RARITY_COLORS por tier)
const CHEST_RARITY_COLORS = {
    basic: RARITY_COLORS.BASICO,
    special: RARITY_COLORS.ESPECIAL,
    epic: RARITY_COLORS.EPICA,
    demon: RARITY_COLORS.DEMON,
    vip: RARITY_COLORS.VIP,
    luck: '#ffd700'
};

// Assets del pase de rubies (Ruby Pass)
// RUBY_PASS_ASSET_SLOT: reemplaza las rutas null con tus archivos PNG finales
const RUBY_PASS_ASSETS = {
    logo: 'assets/UI/Store/RubyPass/Logo/ruby_pass_lock.png', // RUBY_PASS_ASSET_SLOT_LOGO_LOCK
    accessBanner: 'assets/UI/Store/RubyPass/Access/ruby_pass_banner.png', // RUBY_PASS_ASSET_SLOT_ACCESS_BANNER
    background: 'assets/UI/Store/RubyPass/Backgrounds/bg_ruby_pass_main.png', // RUBY_PASS_ASSET_SLOT_BACKGROUND
    currentPoint: 'assets/UI/Store/RubyPass/Markers/ruby_pass_current_point.png', // RUBY_PASS_ASSET_SLOT_CURRENT_POINT
    arcTexture: RUBY_PASS_REWARD_PLACEHOLDER, // Slot visual de reserva por si se reactiva un arco unico.
    freeTrackTexture: 'assets/UI/Store/RubyPass/Arcs/ruby_pass_free_track.png', // RUBY_PASS_ASSET_SLOT_FREE_TRACK
    premiumTrackTexture: 'assets/UI/Store/RubyPass/Arcs/ruby_pass_premium_track.png', // RUBY_PASS_ASSET_SLOT_PREMIUM_TRACK
    // Reasignados (ver PLAN_RUBY_PASS.md, tabla de referencias visuales):
    // free_marco -> marco de la vidriera de "próxima recompensa" (Parte #2).
    // premium_marco -> línea divisoria fina / borde de ítem premium (a usar más adelante).
    freeMarco: 'assets/UI/Store/RubyPass/Arcs/ruby_pass_free_marco.png', // RUBY_PASS_ASSET_SLOT_FREE_MARCO
    premiumMarco: 'assets/UI/Store/RubyPass/Arcs/ruby_pass_premium_marco.png', // RUBY_PASS_ASSET_SLOT_PREMIUM_MARCO
    // Banner ancho de temporada (la "vidriera"), SIN texto quemado encima —
    // el texto/kicker lo sigue poniendo el HTML alrededor. Si el archivo no
    // existe todavía, renderBattlePassPage() lo oculta solo (onerror).
    seasonBanner: 'assets/UI/Store/RubyPass/Banners/ruby_pass_season_banner.png', // RUBY_PASS_ASSET_SLOT_SEASON_BANNER
    levelMarker: 'assets/UI/Store/RubyPass/Markers/ruby_pass_level_marker.png', // RUBY_PASS_ASSET_SLOT_LEVEL_MARKER
    freeSkin01: 'assets/UI/Store/RubyPass/Rewards/Free/Skins/skin_free_ruby_01.png', // RUBY_PASS_ASSET_SLOT_FREE_SKIN_01
    freeSkin02: 'assets/UI/Store/RubyPass/Rewards/Free/Skins/skin_free_ruby_02.png', // RUBY_PASS_ASSET_SLOT_FREE_SKIN_02
    freeBanner01: 'assets/UI/Store/RubyPass/Rewards/Free/Banners/banner_free_ruby_01.png', // RUBY_PASS_ASSET_SLOT_FREE_BANNER_01
    freeBanner02: 'assets/UI/Store/RubyPass/Rewards/Free/Banners/banner_free_ruby_02.png', // RUBY_PASS_ASSET_SLOT_FREE_BANNER_02
    freeTrail01: 'assets/UI/Store/RubyPass/Rewards/Free/Trails/trail_free_ruby_01.png', // RUBY_PASS_ASSET_SLOT_FREE_TRAIL_01
    premiumSkinDemon: 'assets/UI/Store/RubyPass/Rewards/Premium/Skins/skin_premium_demon.png', // RUBY_PASS_ASSET_SLOT_PREMIUM_SKIN_DEMON
    premiumSkinFinal: 'assets/UI/Store/RubyPass/Rewards/Premium/Skins/skin_premium_final.png', // RUBY_PASS_ASSET_SLOT_PREMIUM_SKIN_FINAL
    premiumBanner01: 'assets/UI/Store/RubyPass/Rewards/Premium/Banners/banner_premium_ruby_01.png', // RUBY_PASS_ASSET_SLOT_PREMIUM_BANNER_01
    premiumFrame01: 'assets/UI/Store/RubyPass/Rewards/Premium/Frames/frame_premium_ruby_01.png', // RUBY_PASS_ASSET_SLOT_PREMIUM_FRAME_01
    premiumFrame02: 'assets/UI/Store/RubyPass/Rewards/Premium/Frames/frame_premium_ruby_02.png', // RUBY_PASS_ASSET_SLOT_PREMIUM_FRAME_02
    premiumEmote01: 'assets/UI/Store/RubyPass/Rewards/Premium/Emotes/emote_premium_ruby_01.png', // RUBY_PASS_ASSET_SLOT_PREMIUM_EMOTE_01
    premiumEmote02: 'assets/UI/Store/RubyPass/Rewards/Premium/Emotes/emote_premium_ruby_02.png' // RUBY_PASS_ASSET_SLOT_PREMIUM_EMOTE_02
};

// =====================================================
// RECOMPENSAS DEL PASE DE RUBIES - 30 niveles
// Reemplaza SOLO este array en shop.js
// =====================================================

const RUBY_PASS_REWARDS = [

    // ── Nivel 1 ──────────────────────────────────────
    {
        level: 1, xp: 100,
        free: { type: 'coins' },
        premium: { type: 'rubies' }
    },

    // ── Nivel 2 ──────────────────────────────────────
    {
        level: 2, xp: 250,
        free: { type: 'rubies' },
        premium: { type: 'coins' }
    },

    // ── Nivel 3 ──────────────────────────────────────
    {
        level: 3, xp: 420,
        free: { type: 'coins' },
        premium: { type: 'rubies' }
    },

    // ── Nivel 4 ──────────────────────────────────────
    {
        level: 4, xp: 620,
        free: { type: 'rubies' },
        premium: { type: 'coins' }
    },

    // ── Nivel 5: PRIMER COFRE ─────────────────────────
    {
        level: 5, xp: 850,
        free: { type: 'chest', image: 'assets/Imagenes/Cofres Imagenes/Cofre BASICO.png' },
        premium: { type: 'chest', image: 'assets/Imagenes/Cofres Imagenes/Cofre ESPECIAL.png' }
    },

    // ── Nivel 6 ──────────────────────────────────────
    {
        level: 6, xp: 1110,
        free: { type: 'coins' },
        premium: { type: 'rubies' }
    },

    // ── Nivel 7 ──────────────────────────────────────
    {
        level: 7, xp: 1400,
        free: { type: 'rubies' },
        premium: { type: 'coins' }
    },

    // ── Nivel 8: EMOTE EXCLUSIVO PREMIUM ─────────────
    {
        level: 8, xp: 1720,
        free: { type: 'coins' },
        premium: { type: 'emote', slot: 'premium_emote_01', image: RUBY_PASS_ASSETS.premiumEmote01, vip: true }
    },

    // ── Nivel 9 ──────────────────────────────────────
    {
        level: 9, xp: 2070,
        free: { type: 'rubies' },
        premium: { type: 'coins' }
    },

    // ── Nivel 10: SEGUNDO COFRE ───────────────────────
    {
        level: 10, xp: 2450,
        free: { type: 'chest', image: 'assets/Imagenes/Cofres Imagenes/Cofre BASICO.png' },
        premium: { type: 'chest', image: 'assets/Imagenes/Cofres Imagenes/Cofre EPICO.png' }
    },

    // ── Nivel 11 ─────────────────────────────────────
    {
        level: 11, xp: 2860,
        free: { type: 'coins' },
        premium: { type: 'rubies' }
    },

    // ── Nivel 12: EMOTE NORMAL FREE ───────────────────
    {
        level: 12, xp: 3300,
        free: { type: 'coins' },
        premium: { type: 'coins' }
    },

    // ── Nivel 13 ─────────────────────────────────────
    {
        level: 13, xp: 3770,
        free: { type: 'rubies' },
        premium: { type: 'rubies' }
    },

    // ── Nivel 14 ─────────────────────────────────────
    {
        level: 14, xp: 4270,
        free: { type: 'coins' },
        premium: { type: 'coins' }
    },

    // ── Nivel 15: TERCER COFRE ────────────────────────
    {
        level: 15, xp: 4800,
        free: { type: 'chest', image: 'assets/Imagenes/Cofres Imagenes/Cofre ESPECIAL.png' },
        premium: { type: 'chest', image: 'assets/Imagenes/Cofres Imagenes/Cofre EPICO.png' }
    },

    // ── Nivel 16 ─────────────────────────────────────
    {
        level: 16, xp: 5360,
        free: { type: 'rubies' },
        premium: { type: 'coins' }
    },

    // ── Nivel 17 ─────────────────────────────────────
    {
        level: 17, xp: 5950,
        free: { type: 'coins' },
        premium: { type: 'rubies' }
    },

    // ── Nivel 18: BANNER EXCLUSIVO PREMIUM ───────────
    {
        level: 18, xp: 6570,
        free: { type: 'coins' },
        premium: { type: 'banner', slot: 'premium_banner_01', image: RUBY_PASS_ASSETS.premiumBanner01, vip: true }
    },

    // ── Nivel 19 ─────────────────────────────────────
    {
        level: 19, xp: 7220,
        free: { type: 'rubies' },
        premium: { type: 'coins' }
    },

    // ── Nivel 20: CUARTO COFRE ────────────────────────
    {
        level: 20, xp: 7900,
        free: { type: 'chest', image: 'assets/Imagenes/Cofres Imagenes/Cofre ESPECIAL.png' },
        premium: { type: 'chest', image: 'assets/Imagenes/Cofres Imagenes/Cofre DEMON.png' }
    },

    // ── Nivel 21 ─────────────────────────────────────
    {
        level: 21, xp: 8610,
        free: { type: 'coins' },
        premium: { type: 'rubies' }
    },

    // ── Nivel 22: BANNER NORMAL FREE ──────────────────
    {
        level: 22, xp: 9350,
        free: { type: 'banner', slot: 'free_banner_01', image: RUBY_PASS_ASSETS.freeBanner01 },
        premium: { type: 'coins' }
    },

    // ── Nivel 23 ─────────────────────────────────────
    {
        level: 23, xp: 10120,
        free: { type: 'rubies' },
        premium: { type: 'rubies' }
    },

    // ── Nivel 24 ─────────────────────────────────────
    {
        level: 24, xp: 10920,
        free: { type: 'coins' },
        premium: { type: 'coins' }
    },

    // ── Nivel 25: QUINTO COFRE ────────────────────────
    {
        level: 25, xp: 11750,
        free: { type: 'chest', image: 'assets/Imagenes/Cofres Imagenes/Cofre EPICO.png' },
        premium: { type: 'chest', image: 'assets/Imagenes/Cofres Imagenes/Cofre DEMON.png' }
    },

    // ── Nivel 26 ─────────────────────────────────────
    {
        level: 26, xp: 12610,
        free: { type: 'rubies' },
        premium: { type: 'coins' }
    },

    // ── Nivel 27 ─────────────────────────────────────
    {
        level: 27, xp: 13500,
        free: { type: 'coins' },
        premium: { type: 'rubies' }
    },

    // ── Nivel 28 ─────────────────────────────────────
    {
        level: 28, xp: 14420,
        free: { type: 'rubies' },
        premium: { type: 'coins' }
    },

    // ── Nivel 29 ─────────────────────────────────────
    {
        level: 29, xp: 15370,
        free: { type: 'coins' },
        premium: { type: 'rubies' }
    },

    // ── Nivel 30: COFRE FINAL ─────────────────────────
    {
        level: 30, xp: 16350,
        free: { type: 'chest', image: 'assets/Imagenes/Cofres Imagenes/Cofre DEMON.png' },
        premium: { type: 'chest', image: 'assets/Imagenes/Cofres Imagenes/Cofre VIP.png' }
    },
];

// Costo del pase premium en gemas (ver rubypass.config.js -> settings)
const RUBY_PASS_PREMIUM_COST_GEMS = (window.RUBY_PASS_CONFIG && window.RUBY_PASS_CONFIG.settings.premiumCostGems) || 250;
// XP ganado por victoria en el pase de rubies (ver rubypass.config.js -> settings)
const RUBY_PASS_XP_PER_WIN = (window.RUBY_PASS_CONFIG && window.RUBY_PASS_CONFIG.settings.xpPerWin) || 120;

// Datos de emotes disponibles en la tienda
// SHOP_EMOTE_ASSET_SLOT: agrega tus rutas PNG de emotes aquí
const EMOTES_DATA = [
    { id: 'emote_normal', name: 'Normal', image: 'assets/UI/Store/Emotes/emote_brifon_normal.png', rarity: 'BASICO', price: EMOTE_STANDARD_PRICE_COINS, priceType: 'coins', slot: 'SHOP_EMOTE_ASSET_SLOT_BASIC_NORMAL' },
    { id: 'emote_saludo', name: 'Saludo', image: 'assets/UI/Store/Emotes/emote_brifon_saludo.png', rarity: 'BASICO', price: EMOTE_STANDARD_PRICE_COINS, priceType: 'coins', slot: 'SHOP_EMOTE_ASSET_SLOT_BASIC_SALUDO' },
    { id: 'emote_enojado', name: 'Enojado', image: 'assets/UI/Store/Emotes/emote_brifon_enojado.png', rarity: 'BASICO', price: EMOTE_STANDARD_PRICE_COINS, priceType: 'coins', slot: 'SHOP_EMOTE_ASSET_SLOT_BASIC_ENOJADO' },
    { id: 'emote_Llorando', name: 'Llorando', image: 'assets/UI/Store/Emotes/emote_brifon_llorando.png', rarity: 'BASICO', price: EMOTE_STANDARD_PRICE_COINS, priceType: 'coins', slot: 'SHOP_EMOTE_ASSET_SLOT_BASIC_LLORANDO' },
    { id: 'emote_sorprendido', name: 'Sorprendido', image: 'assets/UI/Store/Emotes/emote_brifon_sorprendido.png', rarity: 'BASICO', price: EMOTE_STANDARD_PRICE_COINS, priceType: 'coins', slot: 'SHOP_EMOTE_ASSET_SLOT_BASIC_SORPRENDIDO' },
    { id: 'emote_mudo', name: 'Mudo', image: 'assets/UI/Store/Emotes/emote_brifon_mudo.png', rarity: 'BASICO', price: EMOTE_STANDARD_PRICE_COINS, priceType: 'coins', slot: 'SHOP_EMOTE_ASSET_SLOT_BASIC_MUDO' },
    { id: 'emote_ruby_pass_01', name: 'Ruby Pass', image: RUBY_PASS_ASSETS.premiumEmote01, rarity: 'VIP', vip: true, passOnly: true, rubyPassLane: 'premium', rubyPassLevel: 8, slot: 'SHOP_EMOTE_ASSET_SLOT_RUBY_PASS_01' },
    { id: 'emoji_fachero', name: 'Fachero', image: 'assets/UI/Store/VIP/Bundles/Emojis/emoji_fachero.png', rarity: 'VIP', vip: true, price: 200, priceType: 'gems', slot: 'SHOP_EMOTE_ASSET_SLOT_VIP_FACHERO' },
    { id: 'emoji_enamorado', name: 'Enamorado', image: 'assets/UI/Store/VIP/Bundles/Emojis/emoji_enamorado.png', rarity: 'VIP', vip: true, price: 200, priceType: 'gems', slot: 'SHOP_EMOTE_ASSET_SLOT_VIP_ENAMORADO' },
    { id: 'emoji_asustado', name: 'Asustado', image: 'assets/UI/Store/VIP/Bundles/Emojis/emoji_asustado.png', rarity: 'VIP', vip: true, price: 200, priceType: 'gems', slot: 'SHOP_EMOTE_ASSET_SLOT_VIP_ASUSTADO' },
    { id: 'emoji_skull_pack', name: 'Skull', image: 'assets/UI/Store/VIP/Bundles/Emojis/emoji_skull_pack.png', rarity: 'VIP', vip: true, price: 200, priceType: 'gems', slot: 'SHOP_EMOTE_ASSET_SLOT_VIP_SKULL' },
    { id: 'emoji_derretido', name: 'Derretido', image: 'assets/UI/Store/VIP/Bundles/Emojis/emoji_derretido.png', rarity: 'VIP', vip: true, price: 200, priceType: 'gems', slot: 'SHOP_EMOTE_ASSET_SLOT_VIP_DERRETIDO' },
    { id: 'emoji_serio', name: 'Serio', image: 'assets/UI/Store/VIP/Bundles/Emojis/emoji_serio.png', rarity: 'VIP', vip: true, price: 200, priceType: 'gems', slot: 'SHOP_EMOTE_ASSET_SLOT_VIP_SERIO' },
    { id: 'emoji_llorando', name: 'Llorando VIP', image: 'assets/UI/Store/VIP/Bundles/Emojis/emoji_llorando.png', rarity: 'VIP', vip: true, price: 200, priceType: 'gems', slot: 'SHOP_EMOTE_ASSET_SLOT_VIP_LLORANDO' },
    { id: 'emoji_enojado', name: 'Enojado VIP', image: 'assets/UI/Store/VIP/Bundles/Emojis/emoji_enojado.png', rarity: 'VIP', vip: true, price: 200, priceType: 'gems', slot: 'SHOP_EMOTE_ASSET_SLOT_VIP_ENOJADO' },
    { id: 'emoji_triste', name: 'Triste', image: 'assets/UI/Store/VIP/Bundles/Emojis/emoji_triste.png', rarity: 'VIP', vip: true, price: 200, priceType: 'gems', slot: 'SHOP_EMOTE_ASSET_SLOT_VIP_TRISTE' },
    { id: 'emoji_feliz', name: 'Feliz', image: 'assets/UI/Store/VIP/Bundles/Emojis/emoji_feliz.png', rarity: 'VIP', vip: true, price: 200, priceType: 'gems', slot: 'SHOP_EMOTE_ASSET_SLOT_VIP_FELIZ' },
    { id: 'emoji_guino', name: 'Guino', image: 'assets/UI/Store/VIP/Bundles/Emojis/emoji_guino.png', rarity: 'VIP', vip: true, price: 200, priceType: 'gems', slot: 'SHOP_EMOTE_ASSET_SLOT_VIP_GUINO' },
    { id: 'emoji_sonriente', name: 'Sonriente', image: 'assets/UI/Store/VIP/Bundles/Emojis/emoji_sonriente.png', rarity: 'VIP', vip: true, price: 200, priceType: 'gems', slot: 'SHOP_EMOTE_ASSET_SLOT_VIP_SONRIENTE' },
    { id: 'emoji_bomito', name: 'Bomito', image: 'assets/UI/Store/VIP/Bundles/Emojis/emoji_bomito.png', rarity: 'VIP', vip: true, price: 200, priceType: 'gems', slot: 'SHOP_EMOTE_ASSET_SLOT_VIP_BOMITO' },

];

applyGemRarityOverrides('normal');

// Aplicar precios desde prices.config.js a todos los items de la tienda
if (typeof window.applyShopPrices === 'function') {
    window.applyShopPrices(TRAILS_DATA, SKINS_DATA, BANNERS_DATA, EMOTES_DATA);
}

// Precargar imágenes de la tienda al inicio del juego (después de definir SKINS_DATA y EMOTES_DATA)
window.preloadedShopImages = preloadShopImages();

// IDs de skins que rotan (animados)
var ROLLING_SKIN_IDS = new Set([
    'skin_sol',
    'skin_luna',
    'skin_galaxia',
    'skin_agujero_negro',
    'skin_meteorito',
    'skin_alien',
    'skin_planeta_marte',
    'skin_planeta_saturno',
    'skin_planeta_tierra',
    'skin_lobo_salvaje',
    'Caramelo_de_Navidad',
    'skin_hamburguesa',
    'skin_pizza',
    'skin_helado',
    'skin_limon_toxico',
    'skin_sandia',
    'skin_cafe',
    'skin_dona',
    'skin_papas_fritas',
    'skin_sandwich',
    'skin_manzana',
    'skin_palomitas',
    'skin_cupcake',
    'skin_jugo',
    'skin_galleta',
    'skin_torta',
    'dona_cyan',
    'dona_red',
    'dona_blue',
    'dona_yellow',
    'dona_orange',
    'dona_green',
    'dona_purple',
    'dona_white',
    'dona_black'
]);

// Obtener la ruta de la imagen lateral de un skin
// image: Ruta de la imagen principal
// id: ID del skin
// Retorna ruta de la imagen lateral o null
function getSkinSidePath(image, id) {
    if (!image || !id) return null;
    const slash = image.lastIndexOf('/');
    if (slash < 0) return null;
    const folder = image.slice(0, slash);
    return `${folder}/${id}/${id}_lado.png`;
}

// Agregar assets de skins de gameplay a un item
// item: Objeto del item
// Retorna el item con assets de gameplay añadidos
function withGameplaySkinAssets(item) {
    if (!item || !(item.type === 'vipSkin' || item.type === 'skin')) return item;
    const rolling = item.rolling === true || ROLLING_SKIN_IDS.has(item.id);

    let imageSide = item.imageSide || null;
    let imageRight = item.imageRight || null;
    let imageLeft = item.imageLeft || null;

    if (rolling) {
        const img = item.image || item.imageRight || item.imageLeft;
        imageSide = img;
        imageRight = img;
        imageLeft = img;
    } else {
        // Query skins-side registry if loaded
        const sideEntry = typeof window.hasSkinSideSystem === 'function' && window.hasSkinSideSystem(item.id)
            ? (window.SKIN_FOLDER_REGISTRY || []).find(e => e.id === item.id)
            : null;

        if (sideEntry) {
            const shortId = item.id.replace('skin_', '');
            if (sideEntry.symmetric) {
                imageSide = `${sideEntry.folder}/skin_${shortId}_lado.png`;
                imageRight = imageSide;
                imageLeft = imageSide;
            } else {
                imageSide = `${sideEntry.folder}/skin_${shortId}_lado_derecho.png`;
                imageRight = `${sideEntry.folder}/skin_${shortId}_lado_derecho.png`;
                imageLeft = `${sideEntry.folder}/skin_${shortId}_lado_izquierdo.png`;
            }
        } else {
            // Fallback for skins that don't have side assets
            const img = item.image || item.imageRight || item.imageLeft;
            imageSide = item.imageSide || item.imageRight || item.imageLeft || img;
            imageRight = item.imageRight || item.imageSide || img;
            imageLeft = item.imageLeft || item.imageSide || img;
        }
    }

    return {
        ...item,
        rolling,
        imageSide,
        imageRight,
        imageLeft
    };
}

// Banners promocionales VIP
const VIP_PROMO_BANNERS = [
    {
        id: 'vip_powerups',
        title: 'POTENCIADORES VIP',
        subtitle: 'Espacio reservado para potenciadores',
        cover: 'assets/UI/Store/VIP/Banners/banner_vip_powerups.png',
        detailBackground: 'assets/UI/Store/VIP/Banners/bg_vip_powerups.png'
    },
    {
        id: 'vip_specials',
        title: 'BANNERS VIP',
        subtitle: 'Banners premium, animados y coleccionables',
        cover: 'assets/UI/Store/VIP/Banners/banner_vip_specials.png',
        detailBackground: 'assets/UI/Store/VIP/Banners/bg_vip_specials.png',
        // Fondo propio de la Sala Legendaria (VER BANNERS). Opcional: si no
        // se define, renderVIPLegendRoom usa solo el gradiente morado/azul
        // y NUNCA cae en "cover" ni en "detailBackground".
        legendBackground: null // ej: 'assets/UI/Store/VIP/Banners/legend_room_banners_vip.png'
    }
];

// Renderizar banner promocional de powerups VIP
// banner: Objeto del banner
// Retorna HTML del banner
function renderVIPPowerupPromoBanner(banner) {
    const fallback = [
        { id: 'proteccion', name: 'Proteccion', color: '#AAE3D8' },
        { id: 'fantasma', name: 'Fantasma', color: '#DEAAF0' },
        { id: 'stop_time', name: 'Stop Time', color: '#B09C54' },
        { id: 'camara_lenta', name: 'Camara Lenta', color: '#D9C938' },
        { id: 'vida_extra', name: 'Vida Extra', color: '#DE21C8' }
    ];
    const source = (window.POWERUPS_DATA || fallback).slice(0, 5);

    return `
        <article class="vip-promo-banner vip-powerup-promo-banner" onclick="renderVIPPowerups()">
            <div class="vip-powerup-promo-backdrop"></div>
            <div class="vip-powerup-promo-copy">
                <span>POTENCIADORES</span>
                <strong>VIP</strong>
            </div>
            <div class="vip-powerup-promo-grid">
                ${source.map((powerup, index) => `
                    <div class="vip-powerup-promo-hex hex-${index + 1}" style="--powerup-color:${powerup.color || '#ffee00'};" onclick="event.stopPropagation(); openPowerupDetail('${powerup.id}', 'vip');">
                        <img src="assets/powerups/icons/${powerup.id}.png" alt="${powerup.name || ''}" draggable="false">
                    </div>
                `).join('')}
            </div>
        </article>
    `;
}

VIP_GAMEPLAY_PLACEHOLDERS = [
    { id: 'boosters', name: 'Potenciadores', type: 'BOOSTERS', detail: 'Slots para boosts del gameplay', rarity: 'rare' },
    { id: 'bots', name: 'Bots VIP', type: 'BOTS', detail: 'Slots para ayudantes automaticos', rarity: 'epic' },
    { id: 'perks', name: 'Ventajas', type: 'PERKS', detail: 'Slots para ventajas temporales', rarity: 'rare' },
    { id: 'power', name: 'Especiales', type: 'POWER', detail: 'Slots para poderes premium', rarity: 'legendary' },
    { id: 'reactor', name: 'Reactor', type: 'CORE', detail: 'Slots para energia de partida', rarity: 'epic' }
];

// Datos de paquetes VIP
const VIP_PACKAGES_DATA = [
    {
        id: 'monsters',
        title: 'PAQUETE MONSTRUOS',
        price: 1200,
        badge: 'best',
        cover: 'assets/UI/Store/VIP/Bundles/Monsters/panel_bundle_monsters.png',
        detailBackground: 'assets/UI/Store/VIP/Bundles/Monsters/bg_monsters_panel.png',
        popupBackground: 'assets/UI/Store/VIP/Bundles/Monsters/popup_monsters_bg.png',
        accent: '#ff4d6d',
        items: [
            {
                type: 'bundle',
                name: 'Dracula',
                price: 520,
                image: 'assets/UI/Store/VIP/Bundles/Monsters/skin_conde_dracula.png',
                items: [
                    { type: 'skin', id: 'skin_conde_dracula', name: 'Conde Dracula', image: 'assets/UI/Store/VIP/Bundles/Monsters/skin_conde_dracula.png' },
                    { type: 'trail', id: 'trail_vampiro', name: 'Trail Vampiro', image: 'assets/UI/Store/VIP/Bundles/Monsters/trail_vampiro.png', trailId: 'trail_vampiro' }
                ]
            },
            {
                type: 'bundle',
                name: 'Zombie',
                price: 520,
                image: 'assets/UI/Store/VIP/Bundles/Monsters/skin_zombie.png',
                items: [
                    { type: 'skin', id: 'skin_zombie', name: 'Zombie', image: 'assets/UI/Store/VIP/Bundles/Monsters/skin_zombie.png' },
                    { type: 'trail', id: 'trail_zombie', name: 'Trail Zombie', image: 'assets/UI/Store/VIP/Bundles/Monsters/trail_zombie.png', trailId: 'trail_zombie' }
                ]
            }
            // Fantasma, Lobo Monstruo, Calabaza y el sub-bundle "Las brujas" (bruja +
            // nocturna) bajaron completos a tienda normal (ver SKINS_DATA).
        ]
    },
    {
        id: 'elements',
        title: 'Paquete Elementos',
        price: 950,
        cover: 'assets/UI/Store/VIP/Bundles/Elements/panel_bundle_elements.png',
        detailBackground: 'assets/UI/Store/VIP/Bundles/Elements/bg_elements_panel.png',
        popupBackground: 'assets/UI/Store/VIP/Bundles/Elements/popup_elements_bg.png',
        accent: '#00ffe7',
        items: [
            { type: 'elementTrail', label: 'Elemento Fuego', name: 'Fuego', price: 300, image: 'assets/UI/Store/VIP/Bundles/Elements/trail_fire.png', trailId: 'trail_fire', previewColor: 'orange' },
            { type: 'elementTrail', label: 'Elemento Agua', name: 'Agua', price: 300, image: 'assets/UI/Store/VIP/Bundles/Elements/trail_water.png', trailId: 'trail_water', previewColor: 'blue' },
            { type: 'elementTrail', label: 'Elemento Viento', name: 'Viento', price: 300, image: 'assets/UI/Store/VIP/Bundles/Elements/trail_wind.png', trailId: 'trail_wind', previewColor: 'cyan' },
            { type: 'elementTrail', label: 'Elemento Hielo', name: 'Hielo', price: 300, image: 'assets/UI/Store/VIP/Bundles/Elements/trail_ice.png', trailId: 'trail_ice', previewColor: 'cyan' },
            { type: 'elementTrail', label: 'Elemento Lava', name: 'Lava', price: 360, image: 'assets/UI/Store/VIP/Bundles/Elements/trail_lava.png', trailId: 'trail_lava', previewColor: 'red' },
            { type: 'elementTrail', label: 'Elemento Naturaleza', name: 'Naturaleza', price: 360, image: 'assets/UI/Store/VIP/Bundles/Elements/trail_nature.png', trailId: 'trail_nature', previewColor: 'green' }
        ]
    },
    {
        id: 'emojis',
        title: 'PAQUETE EMOJIS',
        price: 1400,
        cover: 'assets/UI/Store/VIP/Bundles/Emojis/panel_bundle_emojis.png',
        detailBackground: 'assets/UI/Store/VIP/Bundles/Emojis/bg_emojis_panel.png',
        popupBackground: 'assets/UI/Store/VIP/Bundles/Emojis/popup_emojis_bg.png',
        accent: '#ffda3a',
        items: [
            { type: 'customTextTrail', id: 'trail_custom_text', name: '¡Trail personalizable!', price: 1000, image: 'assets/UI/Store/VIP/Bundles/Emojis/trail_custom_text.png' },
            {
                type: 'emojiPack',
                id: 'emoji_pack_expresiones',
                name: 'Paquete de emojis',
                price: 900,
                image: 'assets/UI/Store/VIP/Bundles/Emojis/portada_paquete_emojis_exp.png',
                items: [
                    { id: 'emoji_fachero', name: 'Fachero', image: 'assets/UI/Store/VIP/Bundles/Emojis/emoji_fachero.png' },
                    { id: 'emoji_enamorado', name: 'Enamorado', image: 'assets/UI/Store/VIP/Bundles/Emojis/emoji_enamorado.png' },
                    { id: 'emoji_asustado', name: 'Asustado', image: 'assets/UI/Store/VIP/Bundles/Emojis/emoji_asustado.png' },
                    { id: 'emoji_skull_pack', name: 'Skull', image: 'assets/UI/Store/VIP/Bundles/Emojis/emoji_skull_pack.png' },
                    { id: 'emoji_derretido', name: 'Derretido', image: 'assets/UI/Store/VIP/Bundles/Emojis/emoji_derretido.png' },
                    { id: 'emoji_serio', name: 'Serio', image: 'assets/UI/Store/VIP/Bundles/Emojis/emoji_serio.png' }
                ]
            },
            { type: 'emoji', id: 'emoji_llorando', name: 'Llorando', price: 200, image: 'assets/UI/Store/VIP/Bundles/Emojis/emoji_llorando.png' },
            { type: 'emoji', id: 'emoji_enojado', name: 'Enojado', price: 200, image: 'assets/UI/Store/VIP/Bundles/Emojis/emoji_enojado.png' },
            { type: 'emoji', id: 'emoji_triste', name: 'Triste', price: 200, image: 'assets/UI/Store/VIP/Bundles/Emojis/emoji_triste.png' },
            { type: 'emoji', id: 'emoji_feliz', name: 'Feliz', price: 200, image: 'assets/UI/Store/VIP/Bundles/Emojis/emoji_feliz.png' },
            { type: 'emoji', id: 'emoji_guino', name: 'Guino', price: 200, image: 'assets/UI/Store/VIP/Bundles/Emojis/emoji_guino.png' },
            { type: 'emoji', id: 'emoji_sonriente', name: 'Sonriente', price: 200, image: 'assets/UI/Store/VIP/Bundles/Emojis/emoji_sonriente.png' },
            { type: 'emoji', id: 'emoji_bomito', name: 'Bomito', price: 200, image: 'assets/UI/Store/VIP/Bundles/Emojis/emoji_bomito.png' }
        ]
    },
    {
        id: 'food',
        title: 'Paquete Comida',
        price: 2000,
        cover: 'assets/UI/Store/VIP/Bundles/Food/panel_bundle_food.png',
        detailBackground: 'assets/UI/Store/VIP/Bundles/Food/bg_food_panel.png',
        popupBackground: 'assets/UI/Store/VIP/Bundles/Food/popup_food_bg.png',
        accent: '#ff8a3d',
        items: [
            // Las skins de comida (hamburguesa, pizza, helado, etc) bajaron a tienda
            // normal (ver SKINS_DATA). Solo quedan aqui los 3 trofeos, que no se compran
            // (se manejan via TROPHY_IDS / TROPHY_RANK_LABELS).
            { type: 'vipSkin', id: 'skin_hamburguesa_trofeo_oro', name: 'Hamburguesa Dorada', price: 0, image: 'assets/UI/Store/VIP/Bundles/Food/skin_hamburguesa_trofeo_oro.png', rolling: true },
            { type: 'vipSkin', id: 'skin_sandia_trofeo_plata', name: 'Sandia de Plata', price: 0, image: 'assets/UI/Store/VIP/Bundles/Food/skin_sandia_trofeo_plata.png', rolling: true },
            { type: 'vipSkin', id: 'skin_chocolate_trofeo_cobre', name: 'Chocolate de Cobre', price: 0, image: 'assets/UI/Store/VIP/Bundles/Food/skin_chocolate_trofeo_cobre.png', rolling: true },
        ]
    },
    {
        id: 'space',
        title: 'PAQUETE ESPACIAL',
        price: 1500,
        cover: 'assets/UI/Store/VIP/Bundles/Space/portada_paquete_espacial.png',
        detailBackground: 'assets/UI/Store/VIP/Bundles/Space/bg_espacial_panel.png',
        popupBackground: 'assets/UI/Store/VIP/Bundles/Space/popup_espacial_bg.png',
        accent: '#7fd8ff',
        items: [
            // Las 9 skins de planetas/espacio bajaron a tienda normal (ver SKINS_DATA).
            // Los trails siguen sin confirmar si bajan tambien; por ahora quedan VIP.
            { type: 'vipTrailPng', id: 'trail_estrellas', name: 'Trail Estrellas', price: 320, image: 'assets/UI/Store/VIP/Bundles/Space/trail_estrellas.png', trailId: 'trail_estrellas' },
            { type: 'vipTrailPng', id: 'trail_auroras', name: 'Trail Auroras', price: 320, image: 'assets/UI/Store/VIP/Bundles/Space/trail_auroras.png', trailId: 'trail_auroras' }
        ]
    },
    // El "PAQUETE PROFESIONAL" se elimino: sus 6 skins (ninja, pirata, cientifico,
    // hacker, chef, samurai) bajaron todas a tienda normal (ver SKINS_DATA). Si en el
    // futuro quieres un bundle VIP de oficios, habria que crear contenido nuevo.
    {
        id: 'wild',
        title: 'PAQUETE SALVAJE',
        price: 1350,
        cover: 'assets/UI/Store/VIP/Bundles/Wild/portada_paquete_salvaje.png',
        detailBackground: 'assets/UI/Store/VIP/Bundles/Wild/bg_salvaje_panel.png',
        popupBackground: 'assets/UI/Store/VIP/Bundles/Wild/popup_salvaje_bg.png',
        accent: '#44ff88',
        items: [
            // cebra, tiburon, cuervo, escorpion, elefante, cerdo y serpiente bajaron
            // a tienda normal (ver SKINS_DATA). Solo quedan VIP los "currados".
            { type: 'vipSkin', id: 'skin_lobo_salvaje', name: 'Lobo Salvaje', price: 320, image: 'assets/UI/Store/VIP/Bundles/Wild/skin_lobo_salvaje.png' },
            { type: 'vipSkin', id: 'skin_tigre', name: 'Tigre', price: 360, image: 'assets/UI/Store/VIP/Bundles/Wild/skin_tigre.png' },
            { type: 'vipSkin', id: 'skin_leon', name: 'Leon', price: 320, image: 'assets/UI/Store/VIP/Bundles/Wild/skin_leon.png' },
            { type: 'vipSkin', id: 'skin_ciervo', name: 'Ciervo', price: 300, image: 'assets/UI/Store/VIP/Bundles/Wild/skin_ciervo.png' },
            { type: 'vipSkin', id: 'skin_aguila', name: 'Aguila', price: 340, image: 'assets/UI/Store/VIP/Bundles/Wild/skin_aguila.png' }
        ]
    },
    {
        id: 'christmas',
        title: 'PAQUETE NAVIDEÑO',
        price: 1700,
        cover: 'assets/UI/Store/VIP/Bundles/Christmas/portada_paquete_navidad.png',
        detailBackground: 'assets/UI/Store/VIP/Bundles/Christmas/bg_navidad_panel.png',
        popupBackground: 'assets/UI/Store/VIP/Bundles/Christmas/popup_navidad_bg.png',
        accent: '#ff4d6d',
        items: [
            {
                type: 'bundle',
                name: 'Santa Claus',
                price: 620,
                image: 'assets/UI/Store/VIP/Bundles/Christmas/skin_santa_claus.png',
                popupBackground: 'assets/UI/Store/VIP/Bundles/Christmas/popup_santa_claus_bg.png',
                items: [
                    { type: 'skin', id: 'skin_santa_claus', name: 'Santa Claus', image: 'assets/UI/Store/VIP/Bundles/Christmas/skin_santa_claus.png' },
                    { type: 'trail', id: 'trail_santa', name: 'Trail Santa', image: 'assets/UI/Store/VIP/Bundles/Christmas/trail_santa.png', trailId: 'trail_santa' }
                ]
            },
            {
                type: 'bundle',
                name: 'Mama Claus',
                price: 620,
                image: 'assets/UI/Store/VIP/Bundles/Christmas/skin_mama_claus.png',
                popupBackground: 'assets/UI/Store/VIP/Bundles/Christmas/popup_mama_claus_bg.png',
                items: [
                    { type: 'skin', id: 'skin_mama_claus', name: 'Mama Claus', image: 'assets/UI/Store/VIP/Bundles/Christmas/skin_mama_claus.png' },
                    { type: 'trail', id: 'trail_mama_claus', name: 'Trail Mama Claus', image: 'assets/UI/Store/VIP/Bundles/Christmas/trail_mama_claus.png', trailId: 'trail_mama_claus' }
                ]
            },
            { type: 'vipSkin', id: 'skin_reno', name: 'Reno', price: 300, image: 'assets/UI/Store/VIP/Bundles/Christmas/skin_reno.png' },
            { type: 'vipSkin', id: 'skin_duende', name: 'Duende', price: 300, image: 'assets/UI/Store/VIP/Bundles/Christmas/skin_duende.png' },
            { type: 'vipSkin', id: 'skin_regalo', name: 'Regalo', price: 300, image: 'assets/UI/Store/VIP/Bundles/Christmas/skin_regalo.png' },
            { type: 'vipSkin', id: 'skin_arbol_navidad', name: 'Arbol Navidad', price: 340, image: 'assets/UI/Store/VIP/Bundles/Christmas/skin_arbol_navidad.png' },
            { type: 'vipSkin', id: 'skin_baston_cristal', name: 'Baston Cristal', price: 340, image: 'assets/UI/Store/VIP/Bundles/Christmas/skin_baston_cristal.png' },
            { type: 'vipSkin', id: 'skin_esfera_navidad', name: 'Esfera Navidad', price: 320, image: 'assets/UI/Store/VIP/Bundles/Christmas/skin_esfera_navidad.png' },
            { type: 'vipSkin', id: 'skin_galleta_navidad', name: 'Galleta Navidad', price: 320, image: 'assets/UI/Store/VIP/Bundles/Christmas/skin_galleta_navidad.png' },
            { type: 'vipSkin', id: 'Caramelo_de_Navidad', name: 'Caramelo de Navidad', price: 320, image: 'assets/UI/Store/VIP/Bundles/Christmas/Caramelo_de_Navidad.png', rolling: true }
        ]
    }
];

applyGemRarityOverrides('vip');

// Configuración de Logros de Colección de comida
// (única fuente de verdad: usada por checkFoodCollectionProgress y por la notificación visual)
const FOOD_COLLECTION_GOALS = [
    {
        count: 7,
        rewardId: 'skin_chocolate_trofeo_cobre',
        name: 'Coleccionista de comida I',
        icon: 'assets/UI/Store/VIP/Bundles/Food/skin_chocolate_trofeo_cobre.png'
    },
    {
        count: 15,
        rewardId: 'skin_sandia_trofeo_plata',
        name: 'Coleccionista de comida II',
        icon: 'assets/UI/Store/VIP/Bundles/Food/skin_sandia_trofeo_plata.png'
    },
    {
        count: 32,
        rewardId: 'skin_hamburguesa_trofeo_oro',
        name: 'Coleccionista de comida III',
        icon: 'assets/UI/Store/VIP/Bundles/Food/skin_hamburguesa_trofeo_oro.png'
    }
];

function checkFoodCollectionProgress() {
    const foodBundle = VIP_PACKAGES_DATA.find(p => p.id === 'food');
    if (!foodBundle) return;

    let count = 0;
    foodBundle.items.forEach(item => {
        if (localStorage.getItem(getSkinStorageKey(item.id)) === 'true') {
            count++;
        }
    });

    FOOD_COLLECTION_GOALS.forEach(goal => {
        // Si cumple la meta y no tiene la skin aún
        if (count >= goal.count && localStorage.getItem(getSkinStorageKey(goal.rewardId)) !== 'true') {

            // 1. Guardamos la skin como obtenida
            localStorage.setItem(getSkinStorageKey(goal.rewardId), 'true');

            // 2. Mostramos la notificación visual del trofeo
            if (typeof window.unlockTrophyAchievement === 'function') {
                window.unlockTrophyAchievement(goal);
            }

            // 3. Forzamos actualización de tienda
            if (typeof renderSkinsPage === 'function') {
                renderSkinsPage(document.getElementById('shopContent'));
            }
        }
    });
}

// Obtener la clave de almacenamiento para un skin
// id: ID del skin
// Retorna clave de localStorage
function getSkinStorageKey(id) {
    return id && id.startsWith('skin_') ? id : `skin_${id}`;
}

// Verificar si un skin es propiedad del jugador
// s: Objeto del skin
// Retorna true si es propiedad del jugador
function isSkinOwned(s) {
    if (!s) return false;
    if (s.id === 'cyan') return true;
    if (localStorage.getItem(getSkinStorageKey(s.id)) === 'true') return true;
    if (window.isFragmentItem?.(s.id) && window.fragmentSystem?.isItemUnlocked(s.id)) return true;
    return false;
}

// Obtener el catálogo de skins VIP
// Retorna array de skins VIP
function getVIPSkinCatalog() {
    const byId = new Map();
    // Función para agregar un item al catálogo
    const add = item => {
        if (!item || !(item.type === 'vipSkin' || item.type === 'skin') || !item.id) return;
        if (byId.has(item.id)) return;
        const gameplaySkin = withGameplaySkinAssets(item);
        const isTrophyItem = TROPHY_IDS.includes(item.id);
        byId.set(item.id, {
            id: gameplaySkin.id,
            name: gameplaySkin.name,
            color: '#ffee00',
            rarity: gameplaySkin.rarity || 'VIP',
            price: gameplaySkin.price || VIP_ITEM_PRICE,
            priceType: 'gems',
            image: gameplaySkin.image,
            imageSide: gameplaySkin.imageSide,
            imageRight: gameplaySkin.imageRight,
            imageLeft: gameplaySkin.imageLeft,
            rolling: gameplaySkin.rolling,
            vipOnly: !isTrophyItem,
            rankLabel: isTrophyItem ? TROPHY_RANK_LABELS[item.id] : undefined,
            sourceItem: gameplaySkin
        });
    };
    // Función para recorrer items recursivamente
    const walk = items => (items || []).forEach(item => {
        add(item);
        walk(item.items);
    });
    VIP_CAROUSEL_DATA.forEach(panel => walk(panel.items));
    VIP_PACKAGES_DATA.forEach(pack => walk(pack.items));
    return [...byId.values()];
}

// Obtener todos los skins de la tienda
// Retorna array de todos los skins con estado de propiedad
function getAllShopSkins() {
    const byId = new Map();
    [...SKINS_DATA, ...FRAGMENT_SKINS_LIST, ...getVIPSkinCatalog()].forEach(s => {
        if (!s?.id || byId.has(s.id)) return;
        const base = s.image ? s : { ...s, image: s.imageRight || s.imageLeft };
        const gameplaySkin = withGameplaySkinAssets(base);
        byId.set(s.id, { ...gameplaySkin, owned: isSkinOwned(s) });
    });
    return [...byId.values()];
}

// Buscar un skin en la tienda por ID
// id: ID del skin
// Retorna el skin o undefined
function findShopSkin(id) {
    return getAllShopSkins().find(s => s.id === id);
}

// Exportar funciones y actualizar datos globales
window.getAllShopSkins = getAllShopSkins;
window.findShopSkin = findShopSkin;
window.SKINS_DATA = getAllShopSkins();

// Variables de estado de la tienda
let gambitState = null;
let selectedChestId = null;
let vipCarouselIndex = 0;
let selectedVIPGameplayId = VIP_GAMEPLAY_PLACEHOLDERS[0]?.id || 'boosters';

// Verificar si está activado el modo de rendimiento
// Retorna true si el modo rendimiento está activo
function isShopPerformanceMode() {
    return localStorage.getItem('reducedMotion') === 'true' ||
        document.body.classList.contains('performance-mode') ||
        document.body.classList.contains('is-touch-device');
}

// Verificar si el canvas de preview es visible
// canvas: Elemento canvas
// Retorna true si es visible
function isCanvasPreviewVisible(canvas) {
    if (!canvas || document.hidden || !document.body.contains(canvas)) return false;
    const rect = canvas.getBoundingClientRect();
    return rect.bottom > 0 && rect.right > 0 && rect.top < innerHeight && rect.left < innerWidth;
}

// Optimizar carga de media en la tienda
// root: Elemento raíz (opcional)
function optimizeShopMedia(root = document) {
    root.querySelectorAll?.('img').forEach(img => {
        img.loading = img.closest('.vip-feature, .shop-hero-slide') ? 'eager' : 'lazy';
        img.decoding = 'async';
        if ('fetchPriority' in img) img.fetchPriority = img.loading === 'eager' ? 'high' : 'low';
    });
}

// Abrir el panel de tienda
function openShop() {
    window.playSfx?.('menuSelect', 0.6);
    // Actualizar estado de propiedad de skins
    SKINS_DATA.forEach(s => {
        if (s.id === 'cyan') return;
        s.owned = localStorage.getItem(getSkinStorageKey(s.id)) === 'true';
    });
    // Actualizar estado de propiedad de banners
    BANNERS_DATA.forEach(b => {
        b.owned = ownsBanner(b);
    });
    window.SKINS_DATA = getAllShopSkins();
    const panel = document.getElementById('shopPanel');
    panel.style.display = 'flex';
    panel.classList.remove('entering', 'leaving');
    void panel.offsetWidth;
    panel.classList.add('entering');

    const overlay = document.getElementById('overlay');
    if (overlay) {
        overlay.classList.remove('exit-shop', 'enter-shop', 'exit-inventory', 'enter-inventory', 'exit-play', 'enter-play');
        void overlay.offsetWidth;
        overlay.classList.add('exit-shop');
    }

    setTimeout(() => {
        if (overlay && panel.style.display === 'flex') {
            overlay.style.display = 'none';
            overlay.classList.remove('exit-shop');
        }
    }, 450);

    // Actualizar monedas y gemas
    document.getElementById('shop-coins').textContent = parseInt(localStorage.getItem('deadCoins') || '0');
    document.getElementById('shop-gems').textContent = parseInt(localStorage.getItem('gems') || '0');

    updateEquippedSkinPreview();
    updateMissionBadge();
    showShopSection('home');
    optimizeShopMedia(panel);
    updateMenuHUD();
    hideVIPRoulette();
    showShopRoulette();
}

// Cerrar el panel de tienda
function closeShop() {
    if (trailAnimId) cancelAnimationFrame(trailAnimId);
    if (previewTrailAnim) cancelAnimationFrame(previewTrailAnim);
    stopShopHeroAutoplay();
    hideShopRoulette();
    const panel = document.getElementById('shopPanel');
    panel.classList.remove('entering');
    panel.classList.add('leaving');

    const overlay = document.getElementById('overlay');
    if (overlay) {
        overlay.style.display = 'flex';
        overlay.classList.remove('exit-shop', 'enter-shop');
        void overlay.offsetWidth;
        overlay.classList.add('enter-shop');
    }

    setTimeout(() => {
        panel.style.display = 'none';
        panel.classList.remove('leaving');
        if (overlay) {
            overlay.classList.remove('enter-shop');
        }
        updateMenuHUD();
    }, 400);
}

// Mostrar una sección específica de la tienda
// section: ID de la sección
function showShopSection(section) {
    if (section !== 'trails' && trailAnimId) cancelAnimationFrame(trailAnimId);
    if (section !== 'trails' && previewTrailAnim) cancelAnimationFrame(previewTrailAnim);

    // Actualizar estilos de navegación
    ['home', 'skins', 'trails', 'powerups', 'banners', 'cofres', 'emotes', 'daily', 'ofertas', 'conversion'].forEach(s => {
        const el = document.getElementById('nav-' + s);
        if (!el) return;
        if (s === section) {
            el.style.background = 'rgba(255,77,109,0.12)';
            el.style.border = '1px solid rgba(255,77,109,0.2)';
            el.style.color = '#ff4d6d';
        } else {
            el.style.background = 'none';
            el.style.border = '1px solid transparent';
            el.style.color = 'rgba(255,255,255,0.5)';
        }
    });

    // Renderizar contenido según sección
    const content = document.getElementById('shopContent');
    if (section === 'home') renderHome(content);
    else if (section === 'skins') renderSkinsPage(content);
    else if (section === 'trails') renderTrailsPage(content);
    else if (section === 'powerups') {
        window.showPowerupIntroModal?.();
        window.renderPowerupsShop?.(content, 'normal');
    }
    else if (section === 'banners') renderBannersPage(content);
    else if (section === 'cofres') renderChestsPage(content);
    else if (section === 'emotes') renderEmotesPage(content);
    else if (section === 'daily') renderDailyGiftPage(content);
    else if (section === 'conversion') renderRubyShopPage(content);
    else {
        content.innerHTML = `<div style="display:flex; align-items:center; gap:16px; margin-bottom:24px;">${shopBotonVolverHtml()}</div><div style="color:rgba(255,255,255,0.2); font-family:monospace; font-size:14px; letter-spacing:4px; height:300px; display:grid; place-items:center;">${shopTextos('comun').proximamente ?? 'PRÓXIMAMENTE'}</div>`;
    }
    optimizeShopMedia(content);
}

// Renderizar la página de skins
// container: Elemento contenedor
function renderSkinsPage(container) {
    const equipped = localStorage.getItem('equippedSkin') || 'cyan';
    const skins = getAllShopSkins();
    container.innerHTML = `
        <div style="display:flex; align-items:center; gap:16px; margin-bottom:24px;">
            ${shopBotonVolverHtml()}
            <div style="color:rgba(255,255,255,0.4); font-family:monospace; font-size:11px; letter-spacing:4px;">${shopTextos('skins').titulo ?? 'SKINS'}</div>
        </div>
        <div style="display:grid; grid-template-columns:repeat(5,1fr); gap:14px;">
            ${skins.map(s => renderSkinCard(s, equipped)).join('')}
        </div>
    `;
}

// Renderizar la página de inicio de la tienda
// container: Elemento contenedor
function renderHome(container) {
    const rubyClaimable = hasRubyPassClaimableRewards();

    // Accesos rápidos — más chicos, en su propia fila con más aire
    const quickAccess = [
        { section: 'trails', image: 'assets/UI/Store/Panels/portada_panel_trails_tienda_normal.png', accent: '#00e5ff' },
        { section: 'banners', image: 'assets/UI/Store/Panels/portada_panel_banners_tienda_normal.png', accent: '#7f8cff' },
        { section: 'emotes', image: 'assets/UI/Store/Panels/portada_panel_emotes_tienda_normal.png', accent: '#ff5d8f' },
        { section: 'powerups', image: 'assets/UI/Store/Panels/portada_panel_potenciadores_tienda_normal.png', accent: '#6bcf7f' },
    ];

    const panelBtnHtml = (panel) => `
        <button class="store-category-panel hud-frame" onclick="showShopSection('${panel.section}')" type="button" style="--cfg-hud-accent:${panel.accent};">
            <div class="hud-frame-c tl"></div><div class="hud-frame-c tr"></div>
            <div class="hud-frame-c bl"></div><div class="hud-frame-c br"></div>
            <img src="${panel.image}" alt="" draggable="false">
        </button>
    `;

    container.innerHTML = `
        <div class="shop-hero-carousel" id="shopHeroCarousel">
            <div class="shop-hero-track" id="shopHeroTrack">

                <button class="shop-hero-slide shop-hero-vip" onclick="openVIP()" type="button"
                    style="background-image:linear-gradient(90deg, rgba(10,6,20,.55), rgba(10,6,20,.1)), url('assets/UI/Store/VIP/Banners/banner_tienda_vip_home.png');">
                    <div class="shop-hero-scrim"></div>
                    <span class="shop-hero-kicker">CONTENIDO EXCLUSIVO</span>
                    <strong class="shop-hero-title">TIENDA VIP</strong>
                    <span class="shop-hero-go">VER →</span>
                </button>

                <button class="shop-hero-slide shop-hero-ruby ${rubyClaimable ? 'has-ruby-claim' : ''}" onclick="openRubyPass()" type="button"
                    ${RUBY_PASS_ASSETS.accessBanner ? `style="background-image:linear-gradient(90deg, rgba(20,0,10,.7), rgba(10,4,10,.25)), url('${RUBY_PASS_ASSETS.accessBanner}');"` : ''}>
                    <div class="shop-hero-scrim"></div>
                    <span class="shop-hero-kicker">PASE DE TEMPORADA</span>
                    <strong class="shop-hero-title">RUBY PASS</strong>
                    ${rubyClaimable ? '<span class="shop-hero-claim-hint">RECOMPENSA LISTA</span>' : '<span class="shop-hero-go">VER →</span>'}
                </button>

            </div>
            <div class="shop-hero-dots" id="shopHeroDots">
                <span class="active" onclick="goToShopHeroSlide(0)"></span>
                <span onclick="goToShopHeroSlide(1)"></span>
            </div>
        </div>

        <div class="store-group">
            <div class="store-group-label"><span class="txt">CATEGORÍAS PRINCIPALES</span><span class="ln"></span></div>
            <div class="store-grid-main">
                <button class="store-category-panel hud-frame" onclick="showShopSection('skins')" type="button" style="--cfg-hud-accent:#3ea7ff;">
                    <div class="hud-frame-c tl"></div><div class="hud-frame-c tr"></div>
                    <div class="hud-frame-c bl"></div><div class="hud-frame-c br"></div>
                    <img src="assets/UI/Store/Panels/portada_panel_skins_tienda_normal.png" alt="" draggable="false">
                </button>

                <button class="store-category-panel store-panel-seasons hud-frame" onclick="showShopSection('seasons')" type="button" style="--cfg-hud-accent:#a259ff; background-image:linear-gradient(180deg, rgba(10,8,20,.1), rgba(10,8,20,.7)), url('assets/seasons/Portadas%20temporadas/Temporada_1.png'); background-size:cover; background-position:center;">
                    <div class="hud-frame-c tl"></div><div class="hud-frame-c tr"></div>
                    <div class="hud-frame-c bl"></div><div class="hud-frame-c br"></div>
                    <div class="store-panel-seasons-bg"></div>
                    <div class="shop-hero-scrim"></div>
                    <span class="shop-hero-kicker">CONTENIDO LIMITADO</span>
                    <strong class="shop-hero-title">TEMPORADAS</strong>
                </button>
            </div>
        </div>

        <div class="store-group">
            <div class="store-group-label"><span class="txt">ACCESOS RÁPIDOS</span><span class="ln"></span></div>
            <div class="store-grid-quick">
                ${quickAccess.map(panelBtnHtml).join('')}
            </div>
        </div>

        <div class="store-group">
            <div class="store-group-label"><span class="txt">DESTACADOS</span><span class="ln"></span></div>
            <div class="store-grid-foot">
                <button class="store-category-panel store-panel-daily hud-frame" onclick="showShopSection('daily')" type="button" style="--cfg-hud-accent:#ffd76a; background-image:linear-gradient(90deg, rgba(10,8,4,.35), rgba(10,8,4,.05)), url('assets/UI/Store/Panels/portada_panel_regalo_diario_tienda_normal.png'); background-size:cover; background-position:center;">
                    <div class="hud-frame-c tl"></div><div class="hud-frame-c tr"></div>
                    <div class="hud-frame-c bl"></div><div class="hud-frame-c br"></div>
                </button>

                <button class="store-category-panel hud-frame" onclick="showShopSection('cofres')" type="button" style="--cfg-hud-accent:#ffc340;">
                    <div class="hud-frame-c tl"></div><div class="hud-frame-c tr"></div>
                    <div class="hud-frame-c bl"></div><div class="hud-frame-c br"></div>
                    <img src="assets/UI/Store/Panels/portada_panel_cofres_tienda_normal.png" alt="" draggable="false">
                </button>

                <button class="store-category-panel hud-frame" onclick="showShopSection('conversion')" type="button" style="--cfg-hud-accent:#ffee00;">
                    <div class="hud-frame-c tl"></div><div class="hud-frame-c tr"></div>
                    <div class="hud-frame-c bl"></div><div class="hud-frame-c br"></div>
                    <img src="assets/UI/Store/Panels/portada_panel_Tienda_Ruby_tienda_normal.png" alt="" draggable="false">
                </button>
            </div>
        </div>
    `;

    initShopHeroCarousel();
}

// ── carrusel del hero de la tienda: VIP / Ruby Pass / Temporadas, uno a la vez ──
let shopHeroCarouselTimer = null;
let shopHeroCarouselIndex = 0;
const SHOP_HERO_SLIDE_COUNT = 2;
const SHOP_HERO_AUTOPLAY_MS = 5000;

function initShopHeroCarousel() {
    shopHeroCarouselIndex = 0;
    updateShopHeroCarousel();
    startShopHeroAutoplay();

    const carousel = document.getElementById('shopHeroCarousel');
    if (carousel && !carousel.dataset.hoverBound) {
        carousel.dataset.hoverBound = '1';
        carousel.addEventListener('mouseenter', stopShopHeroAutoplay);
        carousel.addEventListener('mouseleave', startShopHeroAutoplay);
        bindShopHeroDrag(carousel);
    }
}

// ── arrastre manual del carrusel (mouse y touch) ──
function bindShopHeroDrag(carousel) {
    const track = document.getElementById('shopHeroTrack');
    let dragging = false;
    let startX = 0;
    let deltaX = 0;

    const getX = (e) => (e.touches ? e.touches[0].clientX : e.clientX);

    const onDown = (e) => {
        dragging = true;
        startX = getX(e);
        deltaX = 0;
        stopShopHeroAutoplay();
        track.style.transition = 'none';
    };

    const onMove = (e) => {
        if (!dragging) return;
        deltaX = getX(e) - startX;
        const basePercent = -(shopHeroCarouselIndex * (100 / SHOP_HERO_SLIDE_COUNT));
        const dragPercent = (deltaX / carousel.offsetWidth) * (100 / SHOP_HERO_SLIDE_COUNT);
        track.style.transform = `translateX(${basePercent + dragPercent}%)`;
    };

    const onUp = () => {
        if (!dragging) return;
        dragging = false;
        track.style.transition = '';

        if (Math.abs(deltaX) > 5) {
            carousel.dataset.justDragged = '1';
            setTimeout(() => { delete carousel.dataset.justDragged; }, 50);
        }

        const threshold = carousel.offsetWidth * 0.15;
        if (deltaX <= -threshold) {
            goToShopHeroSlide((shopHeroCarouselIndex + 1) % SHOP_HERO_SLIDE_COUNT);
        } else if (deltaX >= threshold) {
            goToShopHeroSlide((shopHeroCarouselIndex - 1 + SHOP_HERO_SLIDE_COUNT) % SHOP_HERO_SLIDE_COUNT);
        } else {
            updateShopHeroCarousel(); // no llegó al umbral, vuelve a su lugar
        }
        startShopHeroAutoplay();
    };

    carousel.addEventListener('mousedown', onDown);
    carousel.addEventListener('touchstart', onDown, { passive: true });
    window.addEventListener('mousemove', onMove);
    carousel.addEventListener('touchmove', onMove, { passive: true });
    window.addEventListener('mouseup', onUp);
    carousel.addEventListener('touchend', onUp);

    // evita que el "soltar" de un arrastre dispare el click del slide (abrir VIP/Ruby Pass/Temporadas)
    track.addEventListener('click', (e) => {
        if (carousel.dataset.justDragged) {
            e.preventDefault();
            e.stopPropagation();
        }
    }, true);
}

function startShopHeroAutoplay() {
    stopShopHeroAutoplay();
    shopHeroCarouselTimer = setInterval(() => {
        goToShopHeroSlide((shopHeroCarouselIndex + 1) % SHOP_HERO_SLIDE_COUNT);
    }, SHOP_HERO_AUTOPLAY_MS);
}

function stopShopHeroAutoplay() {
    if (shopHeroCarouselTimer) {
        clearInterval(shopHeroCarouselTimer);
        shopHeroCarouselTimer = null;
    }
}

function goToShopHeroSlide(index) {
    shopHeroCarouselIndex = index;
    updateShopHeroCarousel();
}

function updateShopHeroCarousel() {
    const track = document.getElementById('shopHeroTrack');
    const dots = document.querySelectorAll('#shopHeroDots span');
    if (track) track.style.transform = `translateX(-${shopHeroCarouselIndex * (100 / SHOP_HERO_SLIDE_COUNT)}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === shopHeroCarouselIndex));
}

function renderSkinCard(s, equipped) {
    const isEquipped = equipped === s.id;
    // Lista de tus trofeos para identificar el estilo
    const isTrophy = TROPHY_IDS.includes(s.id);

    // Si es trofeo, forzamos un color "morado" para el brillo/borde
    const rarityColor = isTrophy ? '#8a2be2' : (RARITY_COLORS[s.rarity] || '#aaa');

    const owned = isSkinOwned(s);
    // ... (mantén tus variables originales de isFragmentItem, isUnlocked)
    const isFragmentItem = window.isFragmentItem?.(s.id);
    const isUnlocked = isFragmentItem ? window.fragmentSystem?.isItemUnlocked(s.id) : false;

    // ... (mantén el bloque s.soon tal cual está)

    // ... (mantén tus variables de precios canBuyMain, canBuyAlt, etc.)
    const coins = parseInt(localStorage.getItem('deadCoins') || '0');
    const gems = parseInt(localStorage.getItem('gems') || '0');
    const canBuyMain = s.priceType === 'gems' ? gems >= s.price : coins >= s.price;
    const canBuyAlt = s.altPrice ? (s.altType === 'gems' ? gems >= s.altPrice : coins >= s.altPrice) : false;
    const canBuy = !owned && (s.vipOnly || canBuyMain || canBuyAlt);
    const mainIcon = CURRENCY_ICONS[s.priceType || 'coins'];
    const altIcon = s.altType ? CURRENCY_ICONS[s.altType] : null;
    const previewImage = s.image || s.imageRight || s.imageLeft;

    const st = shopTextos('skins');

    let action;
    if (owned || isUnlocked) {
        action = `<button onclick="equipSkin('${s.id}')" style="width:100%; padding:6px 0; border-radius:8px; border:1px solid ${isEquipped ? rarityColor + '66' : 'rgba(255,255,255,0.12)'}; background:${isEquipped ? rarityColor + '15' : 'none'}; color:${isEquipped ? rarityColor : 'rgba(255,255,255,0.4)'}; font-family:Geom, monospace; font-size:9px; cursor:pointer; letter-spacing:1px;">${isEquipped ? (st.botonEquipada ?? '✔ EQUIPADA') : (st.botonEquipar ?? 'EQUIPAR')}</button>`;
    } else if (isFragmentItem) {
        action = window.renderFragmentProgressBar?.(s.id) || `<div style="color:rgba(255,255,255,0.3); font-family:monospace; font-size:9px;">${st.labelFragmentos ?? 'FRAGMENTOS'}</div>`;
    } else if (isTrophy) {
        action = `<div style="width:100%; padding:6px 0; border-radius:8px; border:1px solid rgba(138,43,226,0.4); background:rgba(138,43,226,0.06); color:#cc99ff; font-family:Geom, monospace; font-size:8px; letter-spacing:0.5px; text-align:center;">${s.rankLabel || TROPHY_RANK_LABELS[s.id] || 'RANGO REQUERIDO'}</div>`;
    } else if (s.vipOnly) {
        action = `<button onclick="openVIP('${s.id}')" style="width:100%; padding:6px 0; border-radius:8px; border:1px solid rgba(255, 215, 0, 0.4); background:rgba(255, 215, 0, 0.05); color:#FFD700; font-family:Geom, monospace; font-size:8px; cursor:pointer; letter-spacing:0.5px; transition: 0.2s;" onmouseover="this.style.background='rgba(255, 215, 0, 0.15)'" onmouseout="this.style.background='rgba(255, 215, 0, 0.05)'">${st.botonDirigirVIP ?? 'DIRIGIR A TIENDA VIP'}</button>`;
    } else {
        action = `<button onclick="buySkin('${s.id}')" ${!canBuy ? 'disabled' : ''} style="width:100%; padding:6px 0; border-radius:8px; border:1px solid ${canBuy ? 'rgba(255,238,0,0.4)' : 'rgba(255,255,255,0.08)'}; background:none; color:${canBuy ? '#ffee00' : 'rgba(255,255,255,0.2)'}; font-family:Geom, monospace; font-size:9px; cursor:${canBuy ? 'pointer' : 'default'}; letter-spacing:1px; display:flex; align-items:center; justify-content:center; gap:5px; flex-wrap:wrap;"><img src="${mainIcon}" style="width:14px;height:14px;object-fit:contain;"> ${s.price}${s.altPrice ? ` <span style="opacity:.45;">/</span> <img src="${altIcon}" style="width:14px;height:14px;object-fit:contain;"> ${s.altPrice}` : ''}</button>`;
    }

    const cardBackground = isTrophy ? 'linear-gradient(135deg, #2e003e, #1a0026) !important' : 'rgba(255,255,255,0.03)';

    return `
    <div style="background:${cardBackground}; border:1px solid ${isEquipped ? rarityColor + '66' : (isTrophy ? '#8a2be2' : 'rgba(255,255,255,0.08)')}; border-radius:14px; padding:20px 12px; display:flex; flex-direction:column; align-items:center; gap:10px; transition:0.2s; ${isEquipped ? 'box-shadow:0 0 20px ' + rarityColor + '22' : ''}">
        <div class="shop-skin-orb" style="--skin-glow:${s.color || rarityColor};">
            ${previewImage ? `<img src="${previewImage}" alt="" draggable="false">` : (s.emoji ? s.emoji : `<div style="width:24px;height:24px;border-radius:50%;background:${s.color};box-shadow:0 0 10px ${s.color}88;"></div>`)}
        </div>
        <div style="color:white; font-family:monospace; font-size:11px; letter-spacing:1px;">${s.name}</div>
        <div class="${gemRarityClass(isTrophy ? 'LEGENDARIO' : s.rarity)}" style="color:${rarityColor}; font-family:monospace; font-size:9px; letter-spacing:2px;">${isTrophy ? (st.labelLegendario ?? 'LEGENDARIO') : s.rarity}</div>
        ${isTrophy ? `<div style="color:#cc99ff; font-family:monospace; font-size:9px; letter-spacing:1px;">${st.labelTrofeo ?? 'TROFEO'}</div>` : (s.vipOnly && !owned ? `<div style="color:#ffee00; font-family:monospace; font-size:9px; letter-spacing:1px;">${st.labelSoloVIP ?? 'SOLO EN TIENDA VIP'}</div>` : (s.fragments ? `<div style="color:rgba(255,255,255,0.22); font-family:monospace; font-size:9px;">${s.fragments} ${st.sufijoFragmentos ?? 'FRAGMENTOS'}</div>` : ''))}
        ${action}
    </div>`;
}

function equipSkin(id) {
    localStorage.setItem('equippedSkin', id);
    updateEquippedSkinPreview();
    renderSkinsPage(document.getElementById('shopContent'));
    bannerTrail = [];

    const invPanel = document.getElementById('inventoryPanel');
    if (invPanel && invPanel.style.display !== 'none') {
        showInventorySection('skins');
    }
}

function buySkin(id) {
    const skin = findShopSkin(id);
    if (!skin) return;
    if (skin.vipOnly) return openVIP();
    let coins = parseInt(localStorage.getItem('deadCoins') || '0');
    let gems = parseInt(localStorage.getItem('gems') || '0');
    playerData.deadCoins = coins;
    const canPayMain = skin.priceType === 'gems' ? gems >= skin.price : coins >= skin.price;
    const canPayAlt = skin.altPrice ? (skin.altType === 'gems' ? gems >= skin.altPrice : coins >= skin.altPrice) : false;
    if (!canPayMain && !canPayAlt) return;

    const chosenCurrency = canPayAlt && !canPayMain ? skin.altType : skin.priceType;
    const chosenAmount = canPayAlt && !canPayMain ? skin.altPrice : skin.price;
    const sm = shopTextos('modal');
    showShopModal({
        kicker: sm.kickerConfirmarCompra ?? 'CONFIRMAR COMPRA',
        title: skin.name,
        image: skin.imageRight || skin.imageLeft || SHOP_PLACEHOLDER_IMAGE,
        fallback: skin.emoji || skin.name?.charAt(0) || 'S',
        body: shopPreguntaCompra(chosenAmount, chosenCurrency),
        confirmText: sm.botonSi ?? 'SI',
        cancelText: sm.botonNo ?? 'NO',
        onConfirm: () => completeSkinPurchase(id)
    });
}

// NOTA: esta función no se usa actualmente en ningún flujo de compra
// (las skins de comida se compran vía buyVIPMiniItemById -> grantVIPItem,
// que es donde realmente se llama a checkFoodCollectionProgress()).
// Se deja por si la necesitas para otro flujo de compra a futuro.
function unlockFoodAchievement(id) {
    const skin = findShopSkin(id);
    if (!skin || skin.vipOnly) return;
    let coins = parseInt(localStorage.getItem('deadCoins') || '0');
    let gems = parseInt(localStorage.getItem('gems') || '0');
    playerData.deadCoins = coins;
    const canPayMain = skin.priceType === 'gems' ? gems >= skin.price : coins >= skin.price;
    const canPayAlt = skin.altPrice ? (skin.altType === 'gems' ? gems >= skin.altPrice : coins >= skin.altPrice) : false;
    if (!canPayMain && !canPayAlt) return;

    if (canPayAlt && !canPayMain) {
        if (skin.altType === 'gems') gems -= skin.altPrice;
        else coins -= skin.altPrice;
    } else if (skin.priceType === 'gems') {
        gems -= skin.price;
    } else {
        coins -= skin.price;
    }

    localStorage.setItem('deadCoins', coins);
    localStorage.setItem('gems', gems);
    window.playSfx?.('spend');
    localStorage.setItem(getSkinStorageKey(id), 'true');

    checkFoodCollectionProgress();

    // Actualizar catálogo global
    window.SKINS_DATA = getAllShopSkins();

    document.getElementById('shop-coins').textContent = coins;
    document.getElementById('shop-gems').textContent = gems;
    renderSkinsPage(document.getElementById('shopContent'));
    playerData.deadCoins = coins;
    updateMenuHUD();
}

function renderBannersPage(container) {
    const equipped = localStorage.getItem('equippedBanner') || 'Banner_Deafult';
    container.innerHTML = `
        <div style="display:flex; align-items:center; gap:16px; margin-bottom:24px;">
            ${shopBotonVolverHtml()}
            <div style="color:rgba(255,255,255,0.4); font-family:monospace; font-size:11px; letter-spacing:4px;">${shopTextos('banners').titulo ?? 'BANNERS'}</div>
        </div>
        <div style="display:grid; grid-template-columns:repeat(auto-fit,minmax(240px,1fr)); gap:16px;">
            ${BANNERS_DATA.map(b => renderBannerCard(b, equipped)).join('')}
        </div>
    `;
}

function renderBannerCard(b, equipped) {
    const owned = ownsBanner(b);
    const isEquipped = isBannerEquipped(b, equipped);
    const isVIP = b.rarity === 'VIP';
    const vipOnly = isVIPBannerOnly(b);
    const canBuy = !vipOnly && parseInt(localStorage.getItem('deadCoins') || '0') >= b.price;
    const bannerBg = b.cover ? `url('${b.cover}')` : `linear-gradient(135deg, rgba(0,255,231,0.18), rgba(255,77,109,0.14))`;

    let borderStyle = '';
    let boxShadow = '';
    let extraStyle = '';

    if (isVIP && isEquipped) {
        borderStyle = '2px solid transparent';
        boxShadow = '0 0 20px rgba(255,204,0,0.35)';
        extraStyle = `
        background-image: linear-gradient(rgba(18,18,24,1), rgba(18,18,24,1)),
                          linear-gradient(180deg, #00ffe7 0%, #7affcc 40%, #ffcc00 100%);
        background-origin: border-box;
        background-clip: padding-box, border-box;
    `;
    } else if (isVIP) {
        borderStyle = '2px solid rgba(255,204,0,0.8)';
        boxShadow = '0 0 18px rgba(255,204,0,0.25)';
    } else if (isEquipped) {
        borderStyle = '2px solid rgba(0,255,231,0.55)';
        boxShadow = '0 0 14px rgba(0,255,231,0.2)';
    } else {
        borderStyle = '1px solid rgba(255,255,255,0.08)';
        boxShadow = 'none';
    }

    const bt = shopTextos('banners');

    return `
        <div style="background:${isVIP && isEquipped ? 'rgb(18,18,24)' : 'rgba(255,255,255,0.03)'}; border:${borderStyle}; border-radius:14px; padding:14px; display:flex; flex-direction:column; gap:12px; box-shadow:${boxShadow}; ${extraStyle}">
            <div style="height:104px; border-radius:10px; border:1px solid rgba(0,0,0,0.45); background:${bannerBg}; background-size:cover; background-position:center; display:flex; align-items:center; justify-content:center; color:rgba(255,255,255,0.48); font-family:monospace; font-size:10px; letter-spacing:3px;">
                ${b.cover ? '' : (bt.labelPortada ?? 'PORTADA')}
            </div>
            <div style="display:flex; justify-content:space-between; gap:10px; align-items:center;">
                <div>
                    <div style="color:white; font-family:monospace; font-size:12px; letter-spacing:1px;">${b.name}</div>
                    <div class="${gemRarityClass(b.rarity)}" style="color:${BANNER_RARITY_COLORS[b.rarity] || 'rgba(255,255,255,0.35)'}; font-family:monospace; font-size:9px; margin-top:4px;">${b.rarity === 'VIP' ? (bt.labelVipPaseRuby ?? 'VIP / PASE RUBY') : (b.rarity || (bt.labelNormal ?? 'NORMAL'))}</div>
                </div>
                ${owned
            ? `<button onclick="equipBanner('${b.id}')" style="padding:8px 12px; border-radius:8px; border:1px solid ${isEquipped ? (isVIP ? 'rgba(255,204,0,0.6)' : 'rgba(0,255,231,0.6)') : 'rgba(255,255,255,0.12)'}; background:${isEquipped ? (isVIP ? 'rgba(255,204,0,0.12)' : 'rgba(0,255,231,0.12)') : 'none'}; color:${isEquipped ? (isVIP ? '#ffd700' : '#00ffe7') : 'rgba(255,255,255,0.5)'}; font-family:monospace; font-size:9px; cursor:pointer;">${isEquipped ? (bt.botonEquipado ?? 'EQUIPADO') : (bt.botonEquipar ?? 'EQUIPAR')}</button>`
            : vipOnly
                ? `<button onclick="openVIP(); setTimeout(() => renderVIPPromoDetail('vip_specials'), 40)" style="padding:8px 12px; border-radius:8px; border:1px solid rgba(255,238,0,0.36); background:rgba(255,238,0,0.08); color:#ffee00; font-family:monospace; font-size:9px; cursor:pointer;">${bt.botonSoloVIP ?? 'SOLO EN TIENDA VIP'}</button>`
                : `<button onclick="buyBanner('${b.id}')" ${!canBuy ? 'disabled' : ''} style="padding:8px 12px; border-radius:8px; border:1px solid ${canBuy ? 'rgba(255,238,0,0.45)' : 'rgba(255,255,255,0.08)'}; background:none; color:${canBuy ? '#ffee00' : 'rgba(255,255,255,0.22)'}; font-family:monospace; font-size:9px; cursor:${canBuy ? 'pointer' : 'default'};">${b.price}</button>`
        }
            </div>
        </div>
    `;
}


function buyBanner(id) {
    const banner = BANNERS_DATA.find(b => b.id === id);
    if (!banner) return;
    if (isVIPBannerOnly(banner)) return openVIP();
    let coins = parseInt(localStorage.getItem('deadCoins') || '0');
    if (coins < banner.price) return;
    coins -= banner.price;
    localStorage.setItem('deadCoins', coins);
    setBannerOwned(banner);
    localStorage.setItem('equippedBanner', banner.id);
    document.getElementById('shop-coins').textContent = coins;
    updateMenuHUD();
    renderBannersPage(document.getElementById('shopContent'));
}

function renderEmotesPage(container) {
    container.innerHTML = `
        <div style="display:flex; align-items:center; gap:16px; margin-bottom:24px;">
            ${shopBotonVolverHtml()}
            <div style="color:rgba(255,255,255,0.4); font-family:monospace; font-size:11px; letter-spacing:4px;">${shopTextos('emotes').titulo ?? 'EMOTES'}</div>
        </div>
        <div style="display:grid; grid-template-columns:repeat(auto-fit,minmax(170px,1fr)); gap:16px;">
            ${EMOTES_DATA.map(renderEmoteSlot).join('')}
        </div>
    `;
}

function renderEmoteSlot(emote) {
    const color = emote.vip ? '#ffcc00' : '#57b7dd';
    const owned = isEmoteOwned(emote);
    const equipped = localStorage.getItem('equippedEmote') === emote.id;
    const isFragmentItem = window.isFragmentItem?.(emote.id);
    const isUnlocked = isFragmentItem ? window.fragmentSystem?.isItemUnlocked(emote.id) : false;

    // Mostrar si es propio, si es de fragmentos, o si es un item de tienda normal (no exclusivo de pase)
    const showItem = owned || isFragmentItem || !emote.passOnly;
    if (!showItem) return '';

    const canBuy = !owned && !emote.passOnly && canAfford(emote.price || EMOTE_STANDARD_PRICE_COINS, emote.priceType || 'coins');

    const et = shopTextos('emotes');

    let action;
    if (owned || isUnlocked) {
        action = `<button onclick="equipEmote('${emote.id}')" type="button">${equipped ? (et.botonActivo ?? 'ACTIVO') : (et.botonUsar ?? 'USAR')}</button>`;
    } else if (isFragmentItem) {
        action = window.renderFragmentProgressBar?.(emote.id) || `<div style="color:rgba(255,255,255,0.3); font-family:monospace; font-size:9px;">${et.labelFragmentos ?? 'FRAGMENTOS'}</div>`;
    } else if (emote.passOnly) {
        action = `<button class="is-pass-only" type="button" disabled>${et.botonEnElPase ?? 'EN EL PASE'}</button>`;
    } else {
        action = `<button onclick="buyEmote('${emote.id}')" type="button" ${canBuy ? '' : 'disabled'}>${renderPrice(emote.price || EMOTE_STANDARD_PRICE_COINS, emote.priceType || 'coins')}</button>`;
    }

    return `
        <div class="emote-card" data-emote-id="${emote.id}">
            <div data-asset-slot="${emote.slot}" style="width:96px; height:96px; border-radius:50%; border:1px dashed ${color}88; background:${color}12; display:grid; place-items:center; overflow:hidden; color:rgba(255,255,255,0.35); font-family:monospace; font-size:10px; letter-spacing:2px;">
                ${emote.image ? `<img src="${emote.image}" style="width:100%;height:100%;object-fit:contain;">` : (et.placeholderSinImagen ?? 'PNG')}
            </div>
            <div style="color:white; font-family:monospace; font-size:12px; letter-spacing:1px;">${emote.name}</div>
            ${emote.passOnly ? `<div style="color:${color}; font-family:monospace; font-size:9px; letter-spacing:2px;">${et.botonEnElPase ?? 'EN EL PASE'}</div>` : `<div class="${gemRarityClass(emote.rarity)}" style="color:${color}; font-family:monospace; font-size:9px; letter-spacing:2px;">${emote.rarity}</div>`}
            ${isFragmentItem && !isUnlocked ? `<div style="color:#FFD700; font-family:monospace; font-size:9px; letter-spacing:1px;">🧩 ${et.labelFragmentos ?? 'FRAGMENTOS'}</div>` : ''}
            ${action}
        </div>
    `;
}

function isEmoteOwned(emote) {
    if (!emote) return false;
    if (localStorage.getItem('emote_' + emote.id) === 'true') return true;
    if (emote.passOnly && emote.rubyPassLane && emote.rubyPassLevel) {
        return localStorage.getItem(`rubyPassClaimed_${emote.rubyPassLane}_${emote.rubyPassLevel}`) === 'true';
    }
    // Verificar si está desbloqueado por fragmentos
    if (window.isFragmentItem?.(emote.id) && window.fragmentSystem?.isItemUnlocked(emote.id)) {
        return true;
    }
    return false;
}

function getOwnedEmotes() {
    return EMOTES_DATA.filter(isEmoteOwned);
}

function buyEmote(id) {
    const emote = EMOTES_DATA.find(e => e.id === id);
    if (!emote || emote.passOnly || isEmoteOwned(emote)) return;
    const price = emote.price || EMOTE_STANDARD_PRICE_COINS;
    const currency = emote.priceType || 'coins';
    const et = shopTextos('emotes');
    const sm = shopTextos('modal');
    showShopModal({
        kicker: et.kickerConfirmarCompra ?? 'CONFIRMAR EMOTE',
        title: emote.name,
        image: emote.image,
        body: shopPreguntaCompra(price, currency),
        confirmText: sm.botonSi ?? 'SI',
        cancelText: sm.botonNo ?? 'NO',
        onConfirm: () => {
            if (!canAfford(price, currency)) return alert(currency === 'gems' ? (et.alertaSinRubies ?? 'No tienes suficientes rubies.') : (et.alertaSinMonedas ?? 'No tienes suficientes monedas.'));
            spendCurrency(price, currency);
            localStorage.setItem('emote_' + emote.id, 'true');
            localStorage.setItem('equippedEmote', emote.id);
            window.playSfx?.('spend');
            refreshShopBalances();
            renderEmotesPage(document.getElementById('shopContent'));
            renderIngameEmotes();
            updateMenuHUD();
        }
    });
}
window.buyEmote = buyEmote;

function equipEmote(id) {
    const emote = EMOTES_DATA.find(e => e.id === id);
    if (!isEmoteOwned(emote)) return;
    localStorage.setItem('equippedEmote', id);
    renderIngameEmotes();
    const content = document.getElementById('shopContent');
    if (content && content.innerHTML.includes('EMOTES')) renderEmotesPage(content);
    const inv = document.getElementById('inventoryContent');
    if (inv && document.getElementById('inv-nav-emotes')?.style.color === 'rgb(0, 255, 231)') {
        showInventorySection('emotes');
    }
}
window.equipEmote = equipEmote;

function showActiveEmote(id) {
    const emote = EMOTES_DATA.find(e => e.id === id) || getOwnedEmotes()[0];
    if (!emote) return;
    equipEmote(emote.id);
    const bubble = document.getElementById('active-emote-bubble');
    if (bubble) {
        bubble.innerHTML = `<img src="${emote.image}" alt="">`;
        bubble.classList.add('showing');
        clearTimeout(window.activeEmoteTimeout);
        window.activeEmoteTimeout = setTimeout(() => bubble.classList.remove('showing'), 2400);
    }
    document.getElementById('emote-menu')?.classList.remove('showing');
    document.getElementById('emote-more-panel')?.classList.remove('showing');
}
window.showActiveEmote = showActiveEmote;

function toggleEmoteMenu() {
    renderIngameEmotes();
    document.getElementById('emote-menu')?.classList.toggle('showing');
    document.getElementById('emote-more-panel')?.classList.remove('showing');
}
window.toggleEmoteMenu = toggleEmoteMenu;

function toggleMoreEmotes() {
    renderIngameEmotes();
    document.getElementById('emote-more-panel')?.classList.toggle('showing');
}
window.toggleMoreEmotes = toggleMoreEmotes;

function renderIngameEmotes() {
    const owned = getOwnedEmotes();
    const main = document.getElementById('emote-menu');
    const more = document.getElementById('emote-more-panel');
    if (!main || !more) return;
    const renderButton = emote => `<button type="button" onclick="showActiveEmote('${emote.id}')" title="${emote.name}"><img src="${emote.image}" alt=""></button>`;
    main.innerHTML = owned.slice(0, 10).map(renderButton).join('') +
        (owned.length > 10 ? `<button type="button" onclick="toggleMoreEmotes()">...</button>` : '');
    more.innerHTML = owned.slice(10).map(renderButton).join('');
    renderIngameProfileBanner();
}
window.renderIngameEmotes = renderIngameEmotes;

function renderIngameProfileBanner() {
    const target = document.getElementById('ingame-profile-banner');
    if (!target) return;
    const name = localStorage.getItem('playerName') || 'Jugador';
    const avatar = localStorage.getItem('playerAvatar') || 'assets/UI/Common/Avatars/Avatar_Default.png';
    const bannerId = localStorage.getItem('equippedBanner') || 'Banner_Deafult';
    const banner = findBannerById(bannerId) || BANNERS_DATA[0];
    target.style.backgroundImage = banner.cover
        ? `linear-gradient(90deg, rgba(5,6,12,0.88), rgba(5,6,12,0.32)), url("${banner.cover}")`
        : 'linear-gradient(135deg, rgba(0,255,231,0.2), rgba(255,77,109,0.16))';
    target.innerHTML = `
        <div class="ingame-profile-avatar" style="background-image:url('${avatar}')"></div>
        <div>
            <div class="ingame-profile-name">${name}</div>
            <div class="ingame-profile-sub">${banner.name || 'Banner'}</div>
        </div>
    `;
}
window.renderIngameProfileBanner = renderIngameProfileBanner;
renderIngameEmotes();

function renderChestsPage(container) {
    const normalChests = CHESTS_DATA.filter(chest => !chest.upgradeable);
    container.innerHTML = `
        <div style="display:flex; align-items:center; gap:16px; margin-bottom:24px;">
            <button onclick="showShopSection('home')" style="padding:8px 16px; background:none; border:1px solid rgba(255,255,255,0.12); border-radius:8px; color:rgba(255,255,255,0.5); font-family:monospace; font-size:11px; letter-spacing:2px; cursor:pointer;">VOLVER</button>
            <div style="color:rgba(255,255,255,0.4); font-family:monospace; font-size:11px; letter-spacing:4px;">COFRES</div>
        </div>
        <div style="display:grid; grid-template-columns:repeat(auto-fit,minmax(210px,1fr)); gap:16px;">
            ${normalChests.map(renderChestCard).join('')}
        </div>
        ${renderGambitBox()}
    `;
}

function renderChestCard(chest) {
    const price = renderPrice(chest.cost, chest.currency);
    const alt = chest.altCost ? `<span style="opacity:.5;">/</span>${renderPrice(chest.altCost, chest.altCurrency)}` : '';
    return `
        <div style="background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.09); border-radius:14px; padding:16px; display:flex; flex-direction:column; gap:12px;">
            <img src="${chest.image}" style="width:100%; height:150px; object-fit:contain;">
            <div style="color:white; font-family:monospace; font-size:13px; font-weight:bold; letter-spacing:2px;">${chest.name}</div>
            <div style="color:rgba(255,255,255,0.35); font-family:monospace; font-size:10px; line-height:1.7;">
                ${chest.drops.map(d => `${d[1]}% ${d[0]}`).join('<br>')}
            </div>
            <button onclick="selectChest('${chest.id}')" style="height:38px; border-radius:8px; border:1px solid rgba(255,238,0,0.34); background:rgba(255,238,0,0.07); color:#ffee00; font-family:monospace; font-size:10px; letter-spacing:1px; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:6px;">COMPRAR ${price}${alt}</button>
        </div>
    `;
}

function renderChestConfirm() {
    const chest = CHESTS_DATA.find(c => c.id === selectedChestId);
    if (!chest) return '';
    const price = renderPrice(chest.cost, chest.currency);
    const alt = chest.altCost ? `<span style="opacity:.5;">/</span>${renderPrice(chest.altCost, chest.altCurrency)}` : '';
    return `
        <div style="border:1px solid rgba(255,255,255,0.12); border-radius:12px; background:rgba(0,0,0,0.38); padding:14px; display:flex; align-items:center; justify-content:space-between; gap:14px; font-family:monospace;">
            <div style="color:rgba(255,255,255,0.72); font-size:11px; letter-spacing:2px;">COMPRAR ${chest.name.toUpperCase()} ${price}${alt}</div>
            <div style="display:flex; gap:10px;">
                <button onclick="confirmChestBuy()" style="width:64px;height:34px;border-radius:8px;border:1px solid rgba(0,255,136,0.42);background:rgba(0,255,136,0.16);color:#00ff88;font-family:monospace;font-weight:bold;cursor:pointer;">SI</button>
                <button onclick="cancelChestBuy()" style="width:64px;height:34px;border-radius:8px;border:1px solid rgba(255,45,85,0.48);background:rgba(255,45,85,0.14);color:#ff4d6d;font-family:monospace;font-weight:bold;cursor:pointer;">NO</button>
            </div>
        </div>
    `;
}

function renderPrice(amount, currency) {
    return `<span style="display:inline-flex; align-items:center; gap:5px;"><img src="${CURRENCY_ICONS[currency]}" style="width:15px;height:15px;object-fit:contain;">${amount}</span>`;
}

function showShopModal(options = {}) {
    if (options.sound) window.playSfx?.(options.sound, 0.8);
    let modal = document.getElementById('shop-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'shop-modal';
        document.body.appendChild(modal);
    }
    const sm = shopTextos('modal');
    const imageHTML = options.mediaHTML || (options.image
        ? `<img src="${options.image}" alt="" draggable="false">`
        : `<span>${options.fallback || (sm.fallbackImagen ?? 'PNG')}</span>`);
    modal.innerHTML = `
        <div class="shop-modal-dim" onclick="closeShopModal()"></div>
        <div class="shop-modal-card ${options.cardClass || ''}" style="${options.background ? `background-image:linear-gradient(180deg, rgba(8,8,14,0.88), rgba(8,8,14,0.96)), url('${options.background}'); background-size:cover; background-position:center;` : ''}">
            <button class="shop-modal-x" onclick="closeShopModal()" type="button">${sm.botonCerrarX ?? 'X'}</button>
            <div class="shop-modal-kicker">${options.kicker || (sm.kickerDefault ?? 'THE GEM')}</div>
            <div class="shop-modal-title">${options.title || ''}</div>
            <div class="shop-modal-media ${options.mediaClass || ''}">${imageHTML}</div>
            <div class="shop-modal-body">${options.body || ''}</div>
            <div class="shop-modal-actions">
                ${options.cancelText === null ? '' : `<button class="shop-modal-btn secondary" id="shop-modal-cancel" type="button">${options.cancelText || (sm.botonCerrarDefault ?? 'CERRAR')}</button>`}
                ${options.confirmText ? `<button class="shop-modal-btn primary" id="shop-modal-confirm" type="button">${options.confirmText}</button>` : ''}
            </div>
        </div>
    `;
    modal.classList.add('showing');
    const cancel = document.getElementById('shop-modal-cancel');
    if (cancel) {
        cancel.onclick = () => {
            closeShopModal();
            options.onCancel?.();
        };
    }
    const confirm = document.getElementById('shop-modal-confirm');
    if (confirm) {
        confirm.onclick = () => {
            closeShopModal();
            options.onConfirm?.();
        };
    }
}

function closeShopModal() {
    const modal = document.getElementById('shop-modal');
    if (modal) modal.classList.remove('showing');
}

function selectChest(id) {
    selectedChestId = id;
    const chest = CHESTS_DATA.find(c => c.id === id && !c.upgradeable);
    if (!chest) return;
    const price = chest.altCost ? `${chest.cost} ${chest.currency === 'gems' ? 'rubies' : 'monedas'} / ${chest.altCost} ${chest.altCurrency === 'gems' ? 'rubies' : 'monedas'}` : `${chest.cost} ${chest.currency === 'gems' ? 'rubies' : 'monedas'}`;
    showShopModal({
        kicker: 'CONFIRMAR COFRE',
        title: chest.name,
        image: chest.image,
        body: `Seguro comprar por ${price}?`,
        confirmText: 'SI',
        cancelText: 'NO',
        onConfirm: confirmChestBuy
    });
}

function cancelChestBuy() {
    selectedChestId = null;
    renderChestsPage(document.getElementById('shopContent'));
}

function confirmChestBuy() {
    buyChest(selectedChestId);
}

function buyChest(id) {
    const chest = CHESTS_DATA.find(c => c.id === id && !c.upgradeable);
    if (!chest) return;
    const currency = canAfford(chest.cost, chest.currency) ? chest.currency : chest.altCurrency;
    const cost = currency === chest.currency ? chest.cost : chest.altCost;
    if (!cost || !canAfford(cost, currency)) {
        alert('No tienes suficientes recursos.');
        return;
    }
    spendCurrency(cost, currency);
    window.playSfx?.('spend');
    selectedChestId = null;
    renderChestsPage(document.getElementById('shopContent'));
    showChestResult(chest);
}

function openChestRewardOriginal(chest) {
    const coins = rand(chest.base.coins[0], chest.base.coins[1]);
    const gems = rand(chest.base.gems[0], chest.base.gems[1]);
    addCurrency(coins, 'coins');
    addCurrency(gems, 'gems');
    const drop = rollDrop(chest.drops);
    const key = 'drop_' + drop.toLowerCase().replaceAll(' ', '_');
    localStorage.setItem(key, parseInt(localStorage.getItem(key) || '0') + 1);
    updateMenuHUD();
    refreshShopBalances();
    return { coins, gems, drop };
}

function openChestReward(chest) {
    const result = openChestRewardOriginal(chest);
    // 25% de chance de otorgar fragmento
    if (Math.random() < 0.25 && window.grantRandomFragment) {
        window.grantRandomFragment();
    }
    // Llave de Caronte (PLAN_LLAVES_CARONTE.md, Parte C): roll independiente,
    // no reemplaza ni compite con el drop normal del cofre.
    result.caronteKey = false;
    const keyChance = CARONTE_KEY_CHEST_CHANCE[chest.id] || 0;
    if (keyChance > 0 && Math.random() < keyChance) {
        addCurrency(1, 'caronteKeys');
        result.caronteKey = true;
    }
    return result;
}

function showChestResult(chest) {
    const { coins, gems, drop, caronteKey } = openChestReward(chest);
    const rewardView = getChestRewardView(drop, coins, gems);
    const currencyHTML = renderCurrencyRewardPiles({ coins, gems });
    window.playSfx?.('reward');
    const caronteKeyHTML = caronteKey
        ? `<div class="caronte-key-drop-line">${renderCaronteKeyIcon('sm')}<span>+1 Llave de Caronte</span></div>`
        : '';
    showShopModal({
        kicker: 'RECOMPENSA',
        title: drop,
        image: currencyHTML ? null : (rewardView.image || chest.openImage || chest.image),
        mediaHTML: currencyHTML || null,
        mediaClass: currencyHTML ? 'wide' : '',
        fallback: rewardView.text || 'ITEM',
        body: `${drop}<br>Base: ${coins} monedas + ${gems} rubies${caronteKeyHTML}`,
        cancelText: null,
        confirmText: 'CERRAR'
    });
}
window.showChestResult = showChestResult;

function storeChestInInventory(id, amount = 1) {
    if (!id || amount <= 0) return;
    const key = 'invChest_' + id;
    localStorage.setItem(key, String(parseInt(localStorage.getItem(key) || '0') + amount));
}
window.storeChestInInventory = storeChestInInventory;

function getChestFromReward(reward) {
    if (!reward || reward.type !== 'chest') return null;
    if (reward.chestId) return CHESTS_DATA.find(chest => chest.id === reward.chestId);
    const image = (reward.image || '').toLowerCase();
    return CHESTS_DATA.find(chest => !chest.upgradeable && (
        image.includes(chest.id.toLowerCase()) ||
        image.includes(chest.name.toLowerCase().replace('cofre ', '')) ||
        image === (chest.image || '').toLowerCase()
    )) || CHESTS_DATA.find(chest => chest.id === 'basic');
}

function showChestClaimOptions(chest, sourceLabel = 'COFRE') {
    if (!chest) return;
    showShopModal({
        kicker: sourceLabel,
        title: chest.name,
        image: chest.image,
        body: 'Quieres abrirlo ahora o guardarlo para abrirlo despues desde Inventario?',
        cancelText: 'GUARDAR',
        confirmText: 'ABRIR',
        onConfirm: () => showChestResult(chest),
        onCancel: () => {
            storeChestInInventory(chest.id, 1);
            showRubyPassToast?.('COFRE GUARDADO');
        }
    });
}
window.showChestClaimOptions = showChestClaimOptions;

function getChestRewardView(drop, coins, gems) {
    const lower = drop.toLowerCase();
    if (lower.includes('moneda')) return { image: CURRENCY_ICONS.coins };
    if (lower.includes('ruby') || lower.includes('rubie') || gems > coins) return { image: CURRENCY_ICONS.gems };
    if (lower.includes('skin')) {
        const skin = SKINS_DATA.find(s => !s.soon && s.imageRight);
        return { image: skin?.imageRight || SHOP_PLACEHOLDER_IMAGE, text: 'SKIN', color: '#ffee00' };
    }
    if (lower.includes('fragmento')) return { image: SHOP_PLACEHOLDER_IMAGE, text: 'FRAG', color: '#cc44ff' };
    return { image: SHOP_PLACEHOLDER_IMAGE, text: 'ITEM', color: '#00ffe7' };
}

function getCurrencyPileAsset(currency, amount) {
    const assets = REWARD_CURRENCY_ASSETS[currency];
    if (!assets || amount <= 0) return CURRENCY_ICONS[currency];
    if (currency === 'gems') {
        if (amount > 200) return assets.large;
        if (amount > 100) return assets.medium;
        if (amount > 30) return assets.small;
        if (amount > 1) return assets.single;
        return CURRENCY_ICONS.gems;
    }
    if (amount > 700) return assets.large;
    if (amount > 450) return assets.medium;
    if (amount > 200) return assets.small;
    if (amount > 1) return assets.single;
    return CURRENCY_ICONS.coins;
}

function renderCurrencyRewardPiles(reward = {}) {
    const entries = [
        { type: 'coins', amount: reward.coins || 0, label: 'MONEDAS' },
        { type: 'gems', amount: reward.gems || reward.rubies || 0, label: 'RUBIES' }
    ].filter(entry => entry.amount > 0);
    if (!entries.length) return '';
    return `<div class="reward-currency-piles">
        ${entries.map(entry => `
            <div class="reward-currency-pile">
                <img src="${getCurrencyPileAsset(entry.type, entry.amount)}" alt="" draggable="false">
                <strong>${entry.amount}</strong>
                <span>${entry.label}</span>
            </div>
        `).join('')}
    </div>`;
}

function renderGambitBox() {
    const level = gambitState ? gambitState.level : 0;
    const clicks = gambitState ? gambitState.clicks : 0;
    const cost = [25, 50, 100, 175, 275][clicks] || 0;
    const luckChest = CHESTS_DATA.find(chest => chest.id === 'luck');
    const maxed = gambitState && clicks >= 5;
    return `
        <div class="luck-chest-banner" style="background-image:linear-gradient(90deg, rgba(22,8,18,0.92), rgba(12,6,12,0.72)), url('assets/UI/Store/Chests/banner_cofre_suerte.png');">
            <img src="${luckChest.image}" style="width:150px; height:120px; object-fit:contain; filter:brightness(${1 + level * 0.08});">
            <div>
                <div style="color:white; font-family:monospace; font-size:16px; font-weight:bold; letter-spacing:2px;">COFRE DE LA SUERTE</div>
                <div style="color:rgba(255,255,255,0.48); font-family:monospace; font-size:11px; margin-top:8px;">Compra el cofre, mejoralo hasta 5 veces y abre cuando quieras.</div>
                <div style="color:#ff4d6d; font-family:monospace; font-size:11px; margin-top:8px;">Rareza actual: ${['Basico', 'Especial', 'Epico', 'Demon', 'VIP'][level]} - Mejoras ${clicks}/5</div>
            </div>
            <div style="display:flex; flex-direction:column; gap:8px;">
                ${!gambitState
            ? `<button onclick="startGambit()" style="padding:12px 18px; border-radius:8px; border:1px solid rgba(255,238,0,0.42); background:rgba(255,238,0,0.1); color:#ffee00; font-family:monospace; cursor:pointer; letter-spacing:2px;">COMPRAR 50</button>`
            : `<button onclick="upgradeGambit()" ${maxed ? 'disabled' : ''} style="padding:10px 16px; border-radius:8px; border:1px solid ${maxed ? 'rgba(255,255,255,0.08)' : 'rgba(255,77,109,0.34)'}; background:${maxed ? 'rgba(255,255,255,0.03)' : 'rgba(255,77,109,0.08)'}; color:${maxed ? 'rgba(255,255,255,0.22)' : '#ff4d6d'}; font-family:monospace; cursor:${maxed ? 'default' : 'pointer'};">MEJORAR ${maxed ? 'MAX' : cost}</button>
                    <button onclick="openGambit()" style="padding:12px 18px; border-radius:8px; border:1px solid rgba(255,238,0,${maxed ? '0.72' : '0.34'}); background:rgba(255,238,0,${maxed ? '0.18' : '0.08'}); color:#ffee00; font-family:monospace; cursor:pointer; box-shadow:${maxed ? '0 0 20px rgba(255,238,0,0.22)' : 'none'};">ABRIR</button>`
        }
            </div>
        </div>
    `;
}

function startGambit() {
    const luckChest = CHESTS_DATA.find(chest => chest.id === 'luck');
    showShopModal({
        kicker: 'COFRE LUCKY',
        title: luckChest.name,
        image: luckChest.image,
        body: 'Seguro comprar por 50 monedas?',
        confirmText: 'SI',
        cancelText: 'NO',
        onConfirm: () => {
            if (!canAfford(50, 'coins')) return alert('No tienes suficientes monedas.');
            spendCurrency(50, 'coins');
            window.playSfx?.('spend');
            gambitState = { level: 0, clicks: 0 };
            renderChestsPage(document.getElementById('shopContent'));
            updateMenuHUD();
        }
    });
}

function upgradeGambit() {
    if (!gambitState || gambitState.clicks >= 5) return;
    const costs = [25, 50, 100, 175, 275];
    const cost = costs[gambitState.clicks];
    if (!canAfford(cost, 'coins')) return alert('No tienes suficientes monedas.');
    spendCurrency(cost, 'coins');
    window.playSfx?.('powerUp');
    if (Math.random() < 0.55 && gambitState.level < 4) gambitState.level++;
    gambitState.clicks++;
    renderChestsPage(document.getElementById('shopContent'));
    updateMenuHUD();
}

function openGambit() {
    if (!gambitState) return;
    const rewardChest = CHESTS_DATA.filter(chest => !chest.upgradeable)[gambitState.level];
    const luckChest = CHESTS_DATA.find(chest => chest.id === 'luck');
    gambitState = null;
    renderChestsPage(document.getElementById('shopContent'));
    showChestResult({ ...rewardChest, name: luckChest.name, image: luckChest.image, openImage: luckChest.openImage });
}

// Llaves de Caronte (PLAN_LLAVES_CARONTE.md, Parte B): tercera "moneda",
// se consigue por drop (cofres/partidas). Desde la Parte G, el modo
// "monedas infinitas" también las regala/no las gasta, igual que
// monedas y gemas (pedido explícito de Luna, para poder testear la
// ruleta sin farmear).
const CURRENCY_KEYS = { gems: 'gems', coins: 'deadCoins', caronteKeys: 'caronteKeys' };

function canAfford(amount, currency) {
    // Si el modo infinito está activo, siempre permitir compras (incluye llaves)
    if (window.infiniteCoinsMode) return true;

    const key = CURRENCY_KEYS[currency] || 'deadCoins';
    return parseInt(localStorage.getItem(key) || '0') >= amount;
}

function spendCurrency(amount, currency) {
    // Si el modo infinito está activo, no restar nada (incluye llaves)
    if (window.infiniteCoinsMode) {
        window.trackMissionProgress?.('shop_purchase', 1);
        refreshShopBalances();
        return;
    }

    const key = CURRENCY_KEYS[currency] || 'deadCoins';
    localStorage.setItem(key, parseInt(localStorage.getItem(key) || '0') - amount);
    if (window.playerData && currency === 'caronteKeys') {
        window.playerData.caronteKeys = parseInt(localStorage.getItem(key) || '0');
    }
    window.trackMissionProgress?.('shop_purchase', 1);
    refreshShopBalances();
}

function addCurrency(amount, currency) {
    const key = CURRENCY_KEYS[currency] || 'deadCoins';
    localStorage.setItem(key, parseInt(localStorage.getItem(key) || '0') + amount);
    if (window.playerData) {
        if (currency === 'gems') window.playerData.gems = parseInt(localStorage.getItem(key) || '0');
        else if (currency === 'caronteKeys') window.playerData.caronteKeys = parseInt(localStorage.getItem(key) || '0');
        else window.playerData.deadCoins = parseInt(localStorage.getItem(key) || '0');
    }
}

function getCaronteKeys() {
    return parseInt(localStorage.getItem('caronteKeys') || '0');
}
window.getCaronteKeys = getCaronteKeys;

function refreshShopBalances() {
    const coins = window.infiniteCoinsMode ? '∞' : parseInt(localStorage.getItem('deadCoins') || '0');
    const gems = window.infiniteCoinsMode ? '∞' : parseInt(localStorage.getItem('gems') || '0');
    const actualCoins = parseInt(localStorage.getItem('deadCoins') || '0');
    playerData.deadCoins = actualCoins;
    const coinsEl = document.getElementById('shop-coins');
    const gemsEl = document.getElementById('shop-gems');
    const vipCoinsEl = document.getElementById('vip-coins');
    const vipGemsEl = document.getElementById('vip-gems');
    if (coinsEl) coinsEl.textContent = coins;
    if (gemsEl) gemsEl.textContent = gems;
    if (vipCoinsEl) vipCoinsEl.textContent = coins;
    if (vipGemsEl) vipGemsEl.textContent = gems;
}

function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function rollDrop(drops) {
    const total = drops.reduce((sum, d) => sum + d[1], 0);
    let roll = Math.random() * total;
    for (const [name, weight] of drops) {
        roll -= weight;
        if (roll <= 0) return name;
    }
    return drops[0][0];
}

function updateEquippedSkinPreview() {
    const equippedId = localStorage.getItem('equippedSkin') || 'cyan';
    const skin = findShopSkin(equippedId);
    if (!skin) return;

    const preview = document.getElementById('sidebar-skin-preview');
    const name = document.getElementById('sidebar-skin-name');
    const rarity = document.getElementById('sidebar-skin-rarity');
    if (preview) {
        preview.style.background = skin.color + '22';
        preview.style.border = '2px solid ' + skin.color + '66';
        preview.innerHTML = skin.emoji
            ? `<span style="font-size:18px;">${skin.emoji}</span>`
            : (skin.imageRight
                ? `<img src="${skin.imageRight}" style="width:100%;height:100%;object-fit:contain;">`
                : `<div style="width:16px;height:16px;border-radius:50%;background:${skin.color};"></div>`);
    }
    if (name) name.textContent = skin.name;
    if (rarity) {
        rarity.textContent = skin.rarity;
        rarity.style.color = RARITY_COLORS[skin.rarity] || 'rgba(255,255,255,0.3)';
    }
}

function updateShopProfileBanner() {
    const name = localStorage.getItem('playerName') || 'Jugador';
    const avatar = localStorage.getItem('playerAvatar') || 'assets/UI/Common/Avatars/Avatar_Default.png';
    const bannerId = localStorage.getItem('equippedBanner') || 'Banner_Deafult';
    const banner = findBannerById(bannerId) || BANNERS_DATA[0];
    const card = document.getElementById('shop-profile-banner');
    const avatarEl = document.getElementById('shop-profile-avatar');
    const nameEl = document.getElementById('shop-profile-name');
    const bannerEl = document.getElementById('shop-profile-banner-name');

    if (card) {
        card.style.cursor = 'pointer';
        card.onclick = toggleBannerPicker;
        card.style.border = banner.rarity === 'VIP' ? '2px solid rgba(255,204,0,0.8)' : '1px solid rgba(255,255,255,0.08)';
        card.style.boxShadow = banner.rarity === 'VIP' ? '0 0 18px rgba(255,204,0,0.3)' : 'none';
        card.style.backgroundImage = banner.cover
            ? `linear-gradient(90deg, rgba(5,6,12,0.82), rgba(5,6,12,0.34)), url("${banner.cover}")`
            : 'linear-gradient(135deg, rgba(0,255,231,0.18), rgba(255,77,109,0.16)), radial-gradient(circle at right, rgba(255,255,255,0.08), transparent 48%)';
        card.style.border = banner.rarity === 'VIP' ? '2px solid rgba(255,204,0,0.8)' : '1px solid rgba(255,255,255,0.08)';
        card.style.boxShadow = banner.rarity === 'VIP' ? '0 0 18px rgba(255,204,0,0.3)' : 'none';
        card.style.overflow = 'visible';
    }
    if (avatarEl) avatarEl.style.backgroundImage = `url("${avatar}")`;
    if (nameEl) nameEl.textContent = name;
    if (bannerEl) bannerEl.textContent = '';

    // ── También actualiza el banner del menú principal ──
    const menuCard = document.getElementById('menu-profile');
    const menuAvatarEl = document.getElementById('menu-profile-avatar');
    const menuBannerNameEl = document.getElementById('menu-profile-banner-name');
    if (menuCard) {
        menuCard.style.backgroundImage = banner.cover
            ? `linear-gradient(90deg, rgba(5,6,12,0.82), rgba(5,6,12,0.34)), url("${banner.cover}")`
            : 'linear-gradient(135deg, rgba(0,255,231,0.18), rgba(255,77,109,0.16))';
        menuCard.style.backgroundSize = 'cover';
        menuCard.style.backgroundPosition = 'center';
        menuCard.style.border = banner.rarity === 'VIP' ? '2px solid rgba(255,204,0,0.8)' : '1px solid rgba(255,255,255,0.1)';
        menuCard.style.boxShadow = banner.rarity === 'VIP' ? '0 0 18px rgba(255,204,0,0.3)' : 'none';
    }
    if (menuAvatarEl) {
        menuAvatarEl.style.backgroundImage = `url("${avatar}")`;
        menuAvatarEl.style.backgroundSize = 'cover';
        menuAvatarEl.style.backgroundPosition = 'center';
    }
    if (menuBannerNameEl) menuBannerNameEl.textContent = banner.name || '';
}

function toggleBannerPicker() {
    const picker = document.getElementById('banner-picker');
    if (!picker) return;
    const opening = picker.style.display === 'none' || !picker.style.display;
    picker.style.display = opening ? 'grid' : 'none';
    if (!opening) return;
    picker.style.gridTemplateColumns = '1fr';
    picker.style.gap = '8px';
    renderBannerPicker();
}

function renderBannerPicker() {
    const picker = document.getElementById('banner-picker');
    if (!picker) return;
    const equipped = localStorage.getItem('equippedBanner') || 'Banner_Deafult';
    const ownedBanners = getAllBannerCatalog().filter(ownsBanner);
    picker.innerHTML = ownedBanners.map(b => `
        <button onclick="equipBanner('${b.id}')" style="
            height:48px;
            border-radius:8px;
            border:1px solid ${isBannerEquipped(b, equipped) ? (b.rarity === 'VIP' ? 'rgba(255,204,0,0.7)' : 'rgba(0,255,231,0.5)') : 'rgba(255,255,255,0.08)'};
            background-image: linear-gradient(90deg, rgba(5,6,12,0.92) 0%, rgba(5,6,12,0.55) 40%, transparent 100%), url('${b.cover}');
            background-size: cover;
            background-position: center;
            color: ${isBannerEquipped(b, equipped) ? (b.rarity === 'VIP' ? '#ffd700' : '#00ffe7') : 'rgba(255,255,255,0.75)'};
            font-family: monospace;
            font-size: 10px;
            letter-spacing: 1px;
            cursor: pointer;
            text-align: left;
            padding-left: 12px;
            width: 100%;
            box-shadow: ${b.rarity === 'VIP' ? '0 0 10px rgba(255,204,0,0.15)' : 'none'};
        ">${b.name}</button>
    `).join('');
}

function equipBanner(id) {
    const banner = findBannerById(id);
    localStorage.setItem('equippedBanner', banner?.id || id);
    if (banner) banner.owned = true;
    updateMenuHUD();
    updateShopProfileBanner();
    renderIngameProfileBanner();

    const picker = document.getElementById('banner-picker');
    if (picker && picker.style.display !== 'none') {
        renderBannerPicker();
    }

    const content = document.getElementById('shopContent');
    if (content && document.getElementById('shopPanel')?.style.display !== 'none') {
        renderBannersPage(content);
    }
    if (document.getElementById('inventoryPanel')?.style.display !== 'none') {
        showInventorySection('banners');
    }
}

function updateMenuHUD() {
    const coins = parseInt(localStorage.getItem('deadCoins') || '0');
    const gems = parseInt(localStorage.getItem('gems') || '0');
    const avatar = localStorage.getItem('playerAvatar') || 'assets/UI/Common/Avatars/Avatar_Default.png';
    const name = localStorage.getItem('playerName') || 'Jugador';
    const mc = document.getElementById('menu-coins');
    const mg = document.getElementById('menu-gems');
    const ma = document.getElementById('menu-avatar');
    const pn = document.getElementById('playerName');
    const pa = document.getElementById('playerAvatar');
    const spn = document.getElementById('shop-profile-name');
    const spa = document.getElementById('shop-profile-avatar');
    if (mc) mc.textContent = coins;
    if (mg) mg.textContent = gems;
    if (ma) {
        ma.textContent = '';
        ma.title = name;
        ma.style.backgroundImage = `url("${avatar}")`;
        ma.style.backgroundSize = 'cover';
        ma.style.backgroundPosition = 'center';
    }
    if (pn) pn.textContent = name;
    if (pa) {
        pa.style.backgroundImage = `url("${avatar}")`;
        pa.style.backgroundSize = 'cover';
        pa.style.backgroundPosition = 'center';
    }
    if (spn) spn.textContent = name;
    if (spa) spa.style.backgroundImage = `url("${avatar}")`;

    const mpn = document.getElementById('menu-profile-name');
    const mpr = document.getElementById('menu-profile-rank');
    const mpg = document.getElementById('menu-profile-gems');
    const mpc = document.getElementById('menu-profile-coins');
    const mpa = document.getElementById('menu-profile-avatar');

    if (mpn) mpn.textContent = name;
    const rankName = localStorage.getItem('rankName') || 'HIERRO';
    const rankColor = localStorage.getItem('rankColor') || '#ffffff';
    if (mpr) {
        mpr.textContent = rankName;
        mpr.style.color = rankColor;
    }
    if (mpg) mpg.textContent = gems;
    if (mpc) mpc.textContent = coins;
    if (mpa) {
        mpa.style.backgroundImage = `url("${avatar}")`;
        mpa.style.backgroundSize = 'cover';
        mpa.style.backgroundPosition = 'center';
    }

    updateShopProfileBanner();
    updateEquippedSkinPreview();
}

function ensureRubyPassPanel() {
    let panel = document.getElementById('rubyPassPanel');
    if (panel) return panel;
    panel = document.createElement('div');
    panel.id = 'rubyPassPanel';
    panel.style.display = 'none';
    panel.innerHTML = '<div id="rubyPassContent"></div>';
    document.body.appendChild(panel);
    return panel;
}

function openRubyPass() {
    const panel = ensureRubyPassPanel();
    renderBattlePassPage(document.getElementById('rubyPassContent'));
    panel.style.display = 'flex';
    panel.classList.remove('leaving');
    panel.classList.remove('entering');
    void panel.offsetWidth;
    panel.classList.add('entering');
}

function closeRubyPass() {
    const panel = ensureRubyPassPanel();
    panel.classList.add('leaving');
    setTimeout(() => {
        panel.style.display = 'none';
        panel.classList.remove('leaving');
    }, 260);
}

function openVIP() {
    window.playSfx?.('levelHover', 0.6);
    const panel = document.getElementById('vipPanel');
    renderVIPShell(panel);
    panel.style.display = 'flex';
    panel.classList.remove('entering');
    void panel.offsetWidth;
    panel.classList.add('entering');
    refreshShopBalances();
    renderVIPHome();
    hideShopRoulette();
    showVIPRoulette();
}

function closeVIP() {
    Object.keys(vipTrailAnims || {}).forEach(key => {
        if (vipTrailAnims[key]) cancelAnimationFrame(vipTrailAnims[key]);
        vipTrailAnims[key] = null;
    });
    if (customTextTrailAnim) {
        cancelAnimationFrame(customTextTrailAnim);
        customTextTrailAnim = null;
    }
    hideVIPRoulette();
    const panel = document.getElementById('vipPanel');
    panel.classList.add('leaving');
    setTimeout(() => {
        panel.style.display = 'none';
        panel.classList.remove('leaving');
    }, 300);
}

let vipRouletteInviteTimeout = null;
let vipRouletteInviteInterval = null;
let shopRouletteInviteTimeout = null;
let shopRouletteInviteInterval = null;

/* =====================================================
   MOTOR DE RULETA (Fase 2.5) — compartido entre la ruleta
   de la tienda normal ("Ruleta Diaria", monedas) y la de la
   tienda VIP ("La Llave de Caronte", rubíes). Reusa TODO lo
   que ya existe en el juego (addCurrency, storeChestInInventory,
   gambitState del Cofre de la Suerte, grantRandomFragment) en
   vez de inventar sistemas nuevos.
   ===================================================== */

// Elige una entrada de una tabla [{weight, ...}] según su peso relativo.
function rollWeightedTable(table) {
    const total = table.reduce((sum, entry) => sum + entry.weight, 0);
    let roll = Math.random() * total;
    for (const entry of table) {
        if (roll < entry.weight) return entry;
        roll -= entry.weight;
    }
    return table[table.length - 1];
}

// ── arte real de las ruedas (PNGs de Isabel, carpeta "Ruletas") ──
const ROULETTE_WHEEL_IMAGES = {
    vip: 'assets/Imagenes/Ruletas/Ruleta_VIP.png',
    normal: 'assets/Imagenes/Ruletas/Ruleta_Free.png',
};

// Ícono del botón de info de "La Llave de Caronte" — un óbolo (la moneda
// que se le pagaba a Caronte en la mitología) en vez de una "i" genérica.
// Usa currentColor para heredar el color del botón vía CSS.
const CARONTE_OBOLO_SVG = `<svg viewBox="0 0 40 40" width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="20" cy="20" r="18" stroke="currentColor" stroke-width="1.4" stroke-dasharray="2.6 2.2"/>
    <circle cx="20" cy="20" r="13" stroke="currentColor" stroke-width="1.2"/>
    <path d="M20 12 L26 20 L20 28 L14 20 Z" fill="currentColor"/>
</svg>`;

// Skins fijas de temporada — el premio-skin de cada ruleta NO rota
// día a día como el resto (pedido explícito de Felix). Se cambian acá
// manualmente cuando arranca una temporada nueva. Buscan por id en
// FRAGMENT_SKINS_LIST, que ya tiene nombre + imagen de cada una.
const VIP_ROULETTE_SEASON_SKIN = 'skin_emperador_oscuro';   // Príncipe Oscuro
const NORMAL_ROULETTE_SEASON_SKIN = 'skin_limon_toxico';    // Limón

// Tabla de premios — Ruleta Diaria (tienda normal, con monedas).
// Suma de weights = 100 → cada weight es directamente el % real.
const NORMAL_ROULETTE_TABLE = [
    { type: 'coins', amount: 30, weight: 33 },
    { type: 'coins', amount: 100, weight: 19 },
    { type: 'chest', chestId: 'basic', weight: 19 },   // media probabilidad
    { type: 'chest', chestId: 'special', weight: 11 }, // media-baja
    { type: 'chest', chestId: 'epic', weight: 7 },     // baja
    { type: 'chest', chestId: 'demon', weight: 3 },    // muy muy baja
    { type: 'luckChest', startLevel: 0, fallbackCoins: 40, weight: 3 }, // empieza en Básico
    { type: 'skin', skinId: NORMAL_ROULETTE_SEASON_SKIN, fallbackCoins: 150, weight: 5 }, // Limón — premio raro de temporada
];

// Tabla de premios — La Llave de Caronte (tienda VIP, con rubíes).
// Sin cofre básico. Fragmentos SOLO acá (pedido explícito de Felix).
const VIP_ROULETTE_TABLE = [
    { type: 'gems', amount: 10, weight: 13 },
    { type: 'gems', amount: 30, weight: 9 },
    { type: 'fragment', weight: 14 },
    { type: 'chest', chestId: 'special', weight: 7 },  // baja
    { type: 'chest', chestId: 'epic', weight: 20 },    // media (la más alta de las 4)
    { type: 'chest', chestId: 'demon', weight: 13 },   // medio-baja
    { type: 'chest', chestId: 'vip', weight: 9 },      // baja pero no tan baja
    { type: 'skin', skinId: VIP_ROULETTE_SEASON_SKIN, fallbackGems: 25, weight: 5 }, // Príncipe Oscuro — premio raro de temporada
    { type: 'luckChest', startLevel: 2, fallbackGems: 15, weight: 6 }, // empieza en Épico, no en Básico
];

// Agrupa VIP_ROULETTE_TABLE por categoría y devuelve el % real de cada
// una (se calcula en vivo desde los weights, así que si Felix los toca
// en el futuro el panel de info nunca queda desactualizado).
function getVIPRouletteProbabilityGroups() {
    const total = VIP_ROULETTE_TABLE.reduce((sum, e) => sum + e.weight, 0);
    const groups = [
        { type: 'gems', label: 'Rubíes', weight: 0 },
        { type: 'fragment', label: 'Fragmento', weight: 0 },
        { type: 'chest', label: 'Cofres (Especial a VIP)', weight: 0 },
        { type: 'skin', label: 'Skin de temporada', weight: 0 },
        { type: 'luckChest', label: 'Cofre de la Suerte', weight: 0 },
    ];
    VIP_ROULETTE_TABLE.forEach(entry => {
        const g = groups.find(g => g.type === entry.type);
        if (g) g.weight += entry.weight;
    });
    return groups.map(g => ({ label: g.label, pct: (g.weight / total * 100).toFixed(1) }));
}

// Aplica el premio elegido usando los sistemas que YA existen en el
// juego. Devuelve { label, image } para mostrar en el modal.
function applyRouletteReward(entry) {
    let result;
    if (entry.type === 'coins') {
        addCurrency(entry.amount, 'coins');
        result = { label: `${entry.amount} monedas`, image: 'assets/UI/Common/Currency/DEAD_COIN.png' };
    } else if (entry.type === 'gems') {
        addCurrency(entry.amount, 'gems');
        result = { label: `${entry.amount} rubíes`, image: 'assets/UI/Common/Currency/Rubies.png' };
    } else if (entry.type === 'chest') {
        const chest = CHESTS_DATA.find(c => c.id === entry.chestId);
        storeChestInInventory(entry.chestId, 1);
        result = { label: chest ? chest.name : 'Cofre', image: chest?.image };
    } else if (entry.type === 'luckChest') {
        const luckChest = CHESTS_DATA.find(c => c.id === 'luck');
        if (gambitState) {
            // Ya hay un Cofre de la Suerte en curso — no lo pisamos para
            // no borrar el progreso de mejoras de Felix/el jugador. Se
            // sustituye por un premio de respaldo equivalente.
            if (entry.fallbackGems) {
                addCurrency(entry.fallbackGems, 'gems');
                result = { label: `${entry.fallbackGems} rubíes (ya tenías un Cofre de la Suerte activo)`, image: 'assets/UI/Common/Currency/Rubies.png' };
            } else {
                addCurrency(entry.fallbackCoins || 40, 'coins');
                result = { label: `${entry.fallbackCoins || 40} monedas (ya tenías un Cofre de la Suerte activo)`, image: 'assets/UI/Common/Currency/DEAD_COIN.png' };
            }
        } else {
            gambitState = { level: entry.startLevel || 0, clicks: 0 };
            result = { label: 'Cofre de la Suerte', image: luckChest?.image };
        }
    } else if (entry.type === 'fragment') {
        window.grantRandomFragment?.();
        result = { label: 'Fragmento', image: null };
    } else if (entry.type === 'skin') {
        const skinDef = FRAGMENT_SKINS_LIST.find(s => s.id === entry.skinId);
        if (skinDef && isSkinOwned(skinDef)) {
            // ya la tiene — no tiene sentido regalarla de nuevo, se cambia por un
            // premio de respaldo equivalente (mismo patrón que el Cofre de la Suerte arriba)
            if (entry.fallbackGems) {
                addCurrency(entry.fallbackGems, 'gems');
                result = { label: `${entry.fallbackGems} rubíes (ya tenías esta skin)`, image: 'assets/UI/Common/Currency/Rubies.png' };
            } else {
                addCurrency(entry.fallbackCoins || 100, 'coins');
                result = { label: `${entry.fallbackCoins || 100} monedas (ya tenías esta skin)`, image: 'assets/UI/Common/Currency/DEAD_COIN.png' };
            }
        } else {
            // otorga la skin completa de una — mismo mecanismo que isSkinOwned() ya
            // reconoce (flag directo en localStorage), sin tocar el sistema de fragmentos
            localStorage.setItem(getSkinStorageKey(entry.skinId), 'true');
            window.SKINS_DATA = getAllShopSkins();
            result = { label: skinDef ? skinDef.name : 'Skin', image: skinDef?.imageRight };
        }
    } else {
        result = { label: 'Premio' };
    }
    updateMenuHUD();
    refreshShopBalances?.();
    return result;
}

function getTodayKey() {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

/* =====================================================
   SEGMENTOS DE LA RUEDA — qué ícono va en cada uno de los 8
   gajos. Cambian de posición cada día (mismo orden todo el día,
   distinto al día siguiente — semilla = fecha), EXCEPTO el gajo
   de la skin de temporada, que existe siempre y no rota a otra
   skin distinta hasta que Felix cambie las constantes de arriba.
   Es solo decorativo: no determina el premio real (eso lo decide
   rollWeightedTable con las tablas de arriba), es la "vidriera"
   de lo que se puede llegar a ganar.
   ===================================================== */

// Shuffle determinístico: mismo array de entrada + misma semilla = mismo
// resultado siempre (así el orden no cambia entre giros del mismo día).
function seededShuffle(array, seedStr) {
    let seed = 0;
    for (let i = 0; i < seedStr.length; i++) seed = (seed * 31 + seedStr.charCodeAt(i)) >>> 0;
    const rand = () => { seed = (seed * 1103515245 + 12345) >>> 0; return seed / 4294967296; };
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(rand() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
}

function getRouletteSkinIcon(skinId) {
    const skin = FRAGMENT_SKINS_LIST.find(s => s.id === skinId);
    return skin ? { image: skin.imageRight, label: skin.name, isSeasonSkin: true } : null;
}

function getNormalWheelSegments() {
    const pool = [
        { image: 'assets/UI/Common/Currency/DEAD_COIN.png', label: 'Monedas' },
        { image: 'assets/UI/Common/Currency/DEAD_COIN.png', label: 'Monedas extra' },
        { image: 'assets/Imagenes/Cofres Imagenes/Cofre BASICO.png', label: 'Cofre Básico' },
        { image: 'assets/Imagenes/Cofres Imagenes/Cofre ESPECIAL.png', label: 'Cofre Especial' },
        { image: 'assets/Imagenes/Cofres Imagenes/Cofre EPICO.png', label: 'Cofre Épico' },
        { image: 'assets/Imagenes/Cofres Imagenes/Cofre DEMON.png', label: 'Cofre Demon' },
        { image: 'assets/Imagenes/Cofres Imagenes/Cofre LUCK.png', label: 'Cofre de la Suerte' },
    ];
    const skinIcon = getRouletteSkinIcon(NORMAL_ROULETTE_SEASON_SKIN);
    if (skinIcon) pool.push(skinIcon);
    return seededShuffle(pool, 'normal_' + getTodayKey());
}

function getVIPWheelSegments() {
    const pool = [
        { image: 'assets/UI/Common/Currency/Rubies.png', label: 'Rubíes' },
        { image: SHOP_PLACEHOLDER_IMAGE, label: 'Fragmento' },
        { image: 'assets/Imagenes/Cofres Imagenes/Cofre ESPECIAL.png', label: 'Cofre Especial' },
        { image: 'assets/Imagenes/Cofres Imagenes/Cofre EPICO.png', label: 'Cofre Épico' },
        { image: 'assets/Imagenes/Cofres Imagenes/Cofre DEMON.png', label: 'Cofre Demon' },
        { image: 'assets/Imagenes/Cofres Imagenes/Cofre VIP.png', label: 'Cofre VIP' },
        { image: 'assets/Imagenes/Cofres Imagenes/Cofre LUCK.png', label: 'Cofre de la Suerte' },
    ];
    const skinIcon = getRouletteSkinIcon(VIP_ROULETTE_SEASON_SKIN);
    if (skinIcon) pool.push(skinIcon);
    return seededShuffle(pool, 'vip_' + getTodayKey());
}

// Distribuye los 8 íconos en círculo alrededor del centro (posiciones en %,
// para ubicarlos con left/top sobre el contenedor cuadrado de la rueda).
function renderWheelSegmentIcons(segments, wrapId) {
    const R = 37; // radio en % — qué tan cerca del borde quedan los íconos
    const half = 360 / segments.length / 2; // offset para caer en el CENTRO del gajo, no en el vértice
    const icons = segments.map((seg, i) => {
        const angle = (360 / segments.length) * i - 90 + half;
        const x = 50 + R * Math.cos(angle * Math.PI / 180);
        const y = 50 + R * Math.sin(angle * Math.PI / 180);
        return `<div class="roulette-segment-icon${seg.isSeasonSkin ? ' is-skin' : ''}" style="left:${x}%; top:${y}%;" title="${seg.label}">
            <img src="${seg.image}" alt="${seg.label}">
        </div>`;
    }).join('');
    // van adentro de un wrapper con su propio id: performRouletteSpin le
    // aplica el MISMO transform que a la rueda, para que los íconos giren
    // pegados a sus gajos en vez de quedarse quietos mientras gira el fondo.
    return `<div class="roulette-icons-wrap" id="${wrapId}">${icons}</div>`;
}

// Encuentra en `segments` (los 8 gajos visuales) cuál le corresponde
// al premio real que ya salió sorteado (`entry`, de rollWeightedTable).
// Así la rueda puede aterrizar en el gajo correcto en vez de en
// cualquier lado al azar.
function matchRouletteSegmentIndex(segments, entry) {
    if (entry.type === 'skin') {
        const i = segments.findIndex(s => s.isSeasonSkin);
        if (i !== -1) return i;
    }
    if (entry.type === 'chest') {
        const byChestLabel = {
            basic: 'Cofre Básico', special: 'Cofre Especial', epic: 'Cofre Épico',
            demon: 'Cofre Demon', vip: 'Cofre VIP',
        };
        const i = segments.findIndex(s => s.label === byChestLabel[entry.chestId]);
        if (i !== -1) return i;
    }
    if (entry.type === 'coins') {
        const label = entry.amount >= 100 ? 'Monedas extra' : 'Monedas';
        const i = segments.findIndex(s => s.label === label);
        if (i !== -1) return i;
    }
    const directLabel = { gems: 'Rubíes', fragment: 'Fragmento', luckChest: 'Cofre de la Suerte' }[entry.type];
    if (directLabel) {
        const i = segments.findIndex(s => s.label === directLabel);
        if (i !== -1) return i;
    }
    // respaldo — no debería pasar si las tablas y los pools de segmentos
    // están alineados (lo están), pero por las dudas no rompe el giro.
    return Math.floor(Math.random() * segments.length);
}

/* =====================================================
   MOTOR DE GIRO COMPARTIDO (Fase 2.6) — usado por ambas
   ruletas (VIP y Diaria). El giro visual es largo y con
   suspenso (6-8 vueltas + frenado suave), y al terminar:
   aterriza con un flash de luz, saca chispas (cantidad según
   qué tan bueno fue el premio) y abre la tarjeta de resultado
   con una frase de sabor random (nunca la misma seguido).
   El pago/costo/giro-gratis NO vive acá — eso lo maneja cada
   ruleta por separado (spinVIPRoulette/spinShopRoulette) ANTES
   de llamar a este motor.
   ===================================================== */

// Cuántas chispas salen y de qué tamaño de "susto" es la frase,
// según qué tan bueno fue el premio real (no el visual de la rueda).
function getRouletteRewardTier(entry) {
    if (entry.type === 'skin') return 'legendary';
    if (entry.type === 'coins' || entry.type === 'gems') return 'meh';
    if (entry.type === 'chest' && (entry.chestId === 'basic' || entry.chestId === 'special')) return 'mid';
    return 'good'; // chest epic/demon/vip, luckChest, fragment
}

const ROULETTE_SPARK_COUNTS = { meh: 5, mid: 11, good: 18, legendary: 28 };

const ROULETTE_FLAVOR_MEH = [
    'Suerte para la próxima.',
    'Bueno, algo es algo.',
    'La rueda te debe una.',
    'Ni tan mal, ni tan bien.',
    'El karma se está guardando algo mejor.',
    'Modesto, pero es tuyo.',
    'La próxima girá con más fe.',
    'Cerca... pero no tanto.',
    'Para el bolsillo, no está mal.',
];

const ROULETTE_FLAVOR_GOOD = [
    '¡Hoy fue tu día de suerte!',
    '¡La rueda te sonrió!',
    '¡Eso sí que es un premio!',
    '¡Cayó en el ángulo perfecto!',
    '¡Vas a presumir esto!',
    '¡La suerte estaba de tu lado!',
    '¡Golazo de la ruleta!',
    '¡Esto valió la pena!',
    '¡No lo esperabas, pero acá está!',
];

const ROULETTE_FLAVOR_LEGENDARY = [
    '¡¡PREMIO MAYOR!! No lo vas a creer.',
    '¡La rueda se lució con vos!',
    '¡Esto es de guardar en la vitrina!',
    '¡Jackpot! Suerte de otro nivel.',
];

function pickRouletteFlavor(tier) {
    const pool = tier === 'legendary' ? ROULETTE_FLAVOR_LEGENDARY
        : (tier === 'meh' ? ROULETTE_FLAVOR_MEH : ROULETTE_FLAVOR_GOOD);
    return pool[Math.floor(Math.random() * pool.length)];
}

// Chispas que salen disparadas del centro de la rueda al aterrizar.
// La cantidad escala con el tier del premio real.
function spawnRouletteSparks(wheelWrap, tier) {
    if (!wheelWrap) return;
    const n = ROULETTE_SPARK_COUNTS[tier] || ROULETTE_SPARK_COUNTS.mid;
    for (let i = 0; i < n; i++) {
        const spark = document.createElement('div');
        spark.className = 'roulette-spark';
        const angle = Math.random() * 360;
        const dist = 55 + Math.random() * 95;
        spark.style.setProperty('--sx', `${Math.cos(angle * Math.PI / 180) * dist}px`);
        spark.style.setProperty('--sy', `${Math.sin(angle * Math.PI / 180) * dist}px`);
        spark.style.animationDelay = `${Math.random() * 0.12}s`;
        wheelWrap.appendChild(spark);
        spark.addEventListener('animationend', () => spark.remove());
    }
}

// Motor de giro compartido. `table` ya decide el premio real
// (rollWeightedTable) — el giro visual de la rueda es puro
// suspenso, no tiene que "aterrizar" en el ícono correcto (la
// rueda es la vidriera, ver comentario en getNormalWheelSegments).
function performRouletteSpin(opts) {
    const { wheelWrapId, bigWheelId, iconsWrapId, smallWheelSelector, footerId, table, segments, resultTextColor, spinAgainFn } = opts;

    const wheelWrap = document.getElementById(wheelWrapId);
    const bigWheel = document.getElementById(bigWheelId);
    const iconsWrap = iconsWrapId ? document.getElementById(iconsWrapId) : null;
    const smallWheel = document.querySelector(smallWheelSelector);
    const footer = document.getElementById(footerId);
    if (!bigWheel || !footer) return;

    const entry = rollWeightedTable(table);
    const reduced = isShopPerformanceMode();

    // Ángulo del gajo que REALMENTE ganó (misma fórmula que usa
    // renderWheelSegmentIcons para ubicar los íconos), para que la
    // rueda aterrice ahí y no en cualquier lado al azar.
    const n = segments.length;
    const half = 360 / n / 2;
    const targetIndex = matchRouletteSegmentIndex(segments, entry);
    const segAngle = (360 / n) * targetIndex - 90 + half;

    // El puntero está fijo arriba (ángulo -90). Un poco de jitter dentro
    // del propio gajo para que no caiga siempre justo en el centro.
    const jitter = (Math.random() - 0.5) * (half * 0.7);
    const desiredMod = (((-90 - segAngle + jitter) % 360) + 360) % 360;

    // 6 a 8 vueltas completas, acumuladas sobre la rotación previa (para
    // que nunca "salte" hacia atrás visualmente), ajustadas para terminar
    // exactamente en el gajo ganador.
    const prevRotation = parseFloat(bigWheel.dataset.rotation || '0');
    const currentMod = ((prevRotation % 360) + 360) % 360;
    const diff = (desiredMod - currentMod + 360) % 360;
    const nextRotation = prevRotation + (6 + Math.random() * 2) * 360 + diff;
    bigWheel.dataset.rotation = nextRotation;

    const duration = reduced ? 0.9 : 4.6;
    footer.innerHTML = `<div class="roulette-spinning-msg">GIRANDO…</div>`;

    // Curva monótona (frena parejo, sin "rebotes" a mitad de camino) en vez
    // de la anterior que arrancaba con un salto casi instantáneo al 82% del
    // giro y después se arrastraba — eso era el efecto "rueda chueca".
    const easing = 'cubic-bezier(0.16, 1, 0.3, 1)';
    bigWheel.style.transition = `transform ${duration}s ${easing}`;
    bigWheel.style.transform = `rotate(${nextRotation}deg)`;
    if (iconsWrap) {
        iconsWrap.style.transition = `transform ${duration}s ${easing}`;
        iconsWrap.style.transform = `rotate(${nextRotation}deg)`;
    }
    if (smallWheel) {
        smallWheel.style.transition = `transform ${duration}s ${easing}`;
        smallWheel.style.transform = `rotate(${nextRotation}deg)`;
    }
    window.playSfx?.('powerUp');

    setTimeout(() => {
        const result = applyRouletteReward(entry);
        window.playSfx?.('reward');

        const tier = getRouletteRewardTier(entry);

        wheelWrap?.classList.add('roulette-landed-glow');
        bigWheel.classList.add('roulette-glowing');
        setTimeout(() => {
            wheelWrap?.classList.remove('roulette-landed-glow');
            bigWheel.classList.remove('roulette-glowing');
        }, 750);

        if (!reduced) spawnRouletteSparks(wheelWrap, tier);

        const flavor = pickRouletteFlavor(tier === 'mid' ? 'good' : tier);

        footer.innerHTML = `
            <div class="roulette-result-card${tier === 'legendary' ? ' is-legendary' : ''}">
                ${result.image ? `<img src="${result.image}" class="roulette-result-img" alt="">` : ''}
                <div class="roulette-result-label" style="color:${resultTextColor};">${result.label}</div>
                <div class="roulette-result-flavor">${flavor}</div>
                <button class="roulette-spin-btn roulette-spin-again-btn" onclick="${spinAgainFn}()">GIRAR DE NUEVO</button>
            </div>
        `;
    }, duration * 1000);
}

// Costo del próximo giro en la Ruleta Diaria: gratis 1 vez por día
// (mismo patrón de reinicio por día calendario que el Regalo Diario),
// después escala 50 → 100 → 200 monedas.
function getNormalRouletteSpinCost() {
    const todayKey = getTodayKey();
    if (localStorage.getItem('rouletteFreeSpin_' + todayKey) !== 'true') return 0;
    const paidCount = parseInt(localStorage.getItem('roulettePaidSpins_' + todayKey) || '0');
    const costs = [50, 100, 200];
    return costs[Math.min(paidCount, costs.length - 1)];
}

// Llave de Caronte (PLAN_LLAVES_CARONTE.md, Parte F): la ruleta VIP ya NO
// cobra en rubíes — se paga en Llaves de Caronte, que son 100% drop
// (cofres raros / victorias muy raras). Dos opciones: 1 giro por 1 llave,
// o 12 giros por 10 llaves (2 gratis de "descuento" por comprar en bulk).
const VIP_ROULETTE_KEY_COST_SINGLE = 1;
const VIP_ROULETTE_KEY_COST_BULK = 10;
const VIP_ROULETTE_BULK_SPINS = 12;

function ensureVIPRouletteButton() {
    let btn = document.getElementById('vipRouletteBtn');
    if (btn) return btn;

    btn = document.createElement('div');
    btn.id = 'vipRouletteBtn';
    btn.className = 'vip-roulette-btn';
    btn.style.setProperty('--cfg-hud-accent', '#e0b563');
    btn.style.display = 'none';
    btn.innerHTML = `
        <div class="vip-roulette-wheel" style="background-image:url('${ROULETTE_WHEEL_IMAGES.vip}');"></div>
        <span class="vip-roulette-label">CARONTE</span>
    `;
    btn.addEventListener('click', openVIPRouletteModal);
    document.body.appendChild(btn);

    const overlay = document.createElement('div');
    overlay.id = 'vipRouletteOverlay';
    overlay.className = 'vip-roulette-overlay';
    overlay.innerHTML = `
        <div class="vip-roulette-modal">
            <div class="vip-roulette-modal-close" id="vipRouletteModalClose"></div>
            <div class="vip-roulette-modal-title">LA LLAVE DE CARONTE</div>
            <div class="vip-roulette-modal-body" id="vipRouletteModalBody"></div>
        </div>
    `;
    overlay.addEventListener('pointerdown', (e) => {
        if (e.target === overlay) closeVIPRouletteModal();
    });
    document.body.appendChild(overlay);
    overlay.querySelector('#vipRouletteModalClose').addEventListener('click', closeVIPRouletteModal);

    return btn;
}

function renderVIPRouletteModalBody() {
    const body = document.getElementById('vipRouletteModalBody');
    if (!body) return;
    const keys = getCaronteKeys();
    const canPaySingle = window.infiniteCoinsMode || keys >= VIP_ROULETTE_KEY_COST_SINGLE;
    const canPayBulk = window.infiniteCoinsMode || keys >= VIP_ROULETTE_KEY_COST_BULK;
    const keysDisplay = window.infiniteCoinsMode ? '∞' : keys;
    const segments = getVIPWheelSegments();
    const probGroups = getVIPRouletteProbabilityGroups();
    body.innerHTML = `
        <div class="roulette-wheel-big-wrap" id="vipRouletteWheelWrap">
            <div class="roulette-wheel-pointer"></div>
            <div class="vip-roulette-wheel roulette-wheel-big" id="vipRouletteBigWheel" style="background-image:url('${ROULETTE_WHEEL_IMAGES.vip}');"></div>
            ${renderWheelSegmentIcons(segments, 'vipRouletteIconsWrap')}
        </div>
        <div class="roulette-footer" id="vipRouletteFooter">
            <button type="button" class="caronte-info-btn" id="vipRouletteInfoBtn" aria-label="Información de La Llave de Caronte">
                ${CARONTE_OBOLO_SVG}
            </button>
            <div class="caronte-info-panel" id="vipRouletteInfoPanel">
                <p>Bienvenido a la Llave de Caronte. Aquí tendrás acceso a increíbles recompensas.</p>
                <div class="caronte-info-divider"></div>
                <p class="caronte-info-subtitle">Probabilidades por giro</p>
                <ul class="caronte-info-list">
                    ${probGroups.map(g => `<li><span>${g.label}</span><span>${g.pct}%</span></li>`).join('')}
                </ul>
            </div>
            <div class="vip-roulette-keys-display">
                ${renderCaronteKeyIcon('sm')}
                <span>TIENES ${keysDisplay} LLAVE${keys === 1 ? '' : 'S'} DE CARONTE</span>
            </div>
            <div class="vip-roulette-spin-options">
                <button id="vipRouletteSpinBtn" class="roulette-spin-btn" onclick="spinVIPRoulette()" ${canPaySingle ? '' : 'disabled'}>
                    GIRAR x1 · ${renderCaronteKeyIcon('sm')} 1
                </button>
                <button id="vipRouletteSpinBulkBtn" class="roulette-spin-btn roulette-spin-bulk-btn" onclick="spinVIPRouletteBulk()" ${canPayBulk ? '' : 'disabled'}>
                    GIRAR x12 · ${renderCaronteKeyIcon('sm')} 10
                </button>
            </div>
        </div>
    `;
    document.getElementById('vipRouletteInfoBtn')?.addEventListener('click', () => {
        document.getElementById('vipRouletteInfoPanel')?.classList.toggle('open');
    });
}

function spinVIPRoulette() {
    if (!window.infiniteCoinsMode && getCaronteKeys() < VIP_ROULETTE_KEY_COST_SINGLE) return;
    if (!window.infiniteCoinsMode) spendCurrency(VIP_ROULETTE_KEY_COST_SINGLE, 'caronteKeys');

    performRouletteSpin({
        wheelWrapId: 'vipRouletteWheelWrap',
        bigWheelId: 'vipRouletteBigWheel',
        iconsWrapId: 'vipRouletteIconsWrap',
        smallWheelSelector: '#vipRouletteBtn .vip-roulette-wheel',
        footerId: 'vipRouletteFooter',
        table: VIP_ROULETTE_TABLE,
        segments: getVIPWheelSegments(),
        resultTextColor: '#5a1220',
        spinAgainFn: 'renderVIPRouletteModalBody',
    });
}

// Giro x12 (Parte F): sin animación de rueda por cada giro individual (sería
// ~55s de espera con la duración actual) — tira las 12 recompensas de una,
// las agrupa, y muestra un resumen. Mismo patrón que "abrir cofre x N" en
// el inventario (openInventoryChestAmount), para mantener consistencia.
function spinVIPRouletteBulk() {
    if (!window.infiniteCoinsMode && getCaronteKeys() < VIP_ROULETTE_KEY_COST_BULK) return;
    if (!window.infiniteCoinsMode) spendCurrency(VIP_ROULETTE_KEY_COST_BULK, 'caronteKeys');

    const footer = document.getElementById('vipRouletteFooter');
    if (footer) footer.innerHTML = `<div class="roulette-spinning-msg">GIRANDO x${VIP_ROULETTE_BULK_SPINS}…</div>`;

    setTimeout(() => {
        const counts = {};
        let firstImage = null;
        for (let i = 0; i < VIP_ROULETTE_BULK_SPINS; i++) {
            const entry = rollWeightedTable(VIP_ROULETTE_TABLE);
            const result = applyRouletteReward(entry);
            if (!firstImage) firstImage = result.image;
            counts[result.label] = (counts[result.label] || 0) + 1;
        }
        window.playSfx?.('reward');
        if (!footer) return;
        footer.innerHTML = `
            <div class="roulette-result-card">
                <div class="roulette-result-label">¡${VIP_ROULETTE_BULK_SPINS} giros completados!</div>
                <div class="roulette-bulk-list">
                    ${Object.entries(counts).map(([label, qty]) => `<div>${label}${qty > 1 ? ' x' + qty : ''}</div>`).join('')}
                </div>
                <button class="roulette-spin-btn roulette-spin-again-btn" onclick="renderVIPRouletteModalBody()">CERRAR</button>
            </div>
        `;
    }, 500); // pequeño delay para que se sienta como que "pasó algo", no instantáneo
}

function openVIPRouletteModal() {
    window.playSfx?.('levelHover', 0.6);
    renderVIPRouletteModalBody();
    document.getElementById('vipRouletteOverlay')?.classList.add('open');
}

function closeVIPRouletteModal() {
    document.getElementById('vipRouletteOverlay')?.classList.remove('open');
}

function showVIPRoulette() {
    const btn = ensureVIPRouletteButton();
    btn.style.display = 'flex';

    const INITIAL_DELAY = 3000;  // no invita apenas se abre la tienda, espera un poco
    const REPEAT_EVERY = 9000;   // cada cuánto vuelve a invitar
    const CYCLE_LENGTH = 1100;   // debe matchear la duración de las animaciones CSS

    const inviteOnce = () => {
        const overlay = document.getElementById('vipRouletteOverlay');
        if (!btn || overlay?.classList.contains('open')) return;
        btn.classList.add('inviting');
        setTimeout(() => btn.classList.remove('inviting'), CYCLE_LENGTH);
    };

    vipRouletteInviteTimeout = setTimeout(() => {
        inviteOnce();
        vipRouletteInviteInterval = setInterval(inviteOnce, REPEAT_EVERY);
    }, INITIAL_DELAY);
}

function hideVIPRoulette() {
    if (vipRouletteInviteTimeout) { clearTimeout(vipRouletteInviteTimeout); vipRouletteInviteTimeout = null; }
    if (vipRouletteInviteInterval) { clearInterval(vipRouletteInviteInterval); vipRouletteInviteInterval = null; }
    const btn = document.getElementById('vipRouletteBtn');
    if (btn) { btn.style.display = 'none'; btn.classList.remove('inviting'); }
    closeVIPRouletteModal();
}

/* =====================================================
   RULETA DIARIA — tienda normal, con monedas. Mismo patrón
   que la de VIP (botón fijo + modal), pero con acento rosa/rojo
   (el color de marca de la tienda normal, no el dorado de VIP)
   y 1 giro gratis por día antes de empezar a cobrar.
   ===================================================== */
function ensureShopRouletteButton() {
    let btn = document.getElementById('shopRouletteBtn');
    if (btn) return btn;

    btn = document.createElement('div');
    btn.id = 'shopRouletteBtn';
    btn.className = 'vip-roulette-btn shop-roulette-btn';
    btn.style.setProperty('--cfg-hud-accent', '#ff4d6d');
    btn.style.display = 'none';
    btn.innerHTML = `
        <div class="vip-roulette-wheel" style="background-image:url('${ROULETTE_WHEEL_IMAGES.normal}');"></div>
        <span class="vip-roulette-label">DIARIA</span>
    `;
    btn.addEventListener('click', openShopRouletteModal);
    document.body.appendChild(btn);

    const overlay = document.createElement('div');
    overlay.id = 'shopRouletteOverlay';
    overlay.className = 'vip-roulette-overlay shop-roulette-overlay';
    overlay.innerHTML = `
        <div class="vip-roulette-modal">
            <div class="vip-roulette-modal-close" id="shopRouletteModalClose"></div>
            <div class="vip-roulette-modal-title">RULETA DIARIA</div>
            <div class="vip-roulette-modal-body" id="shopRouletteModalBody"></div>
        </div>
    `;
    overlay.addEventListener('pointerdown', (e) => {
        if (e.target === overlay) closeShopRouletteModal();
    });
    document.body.appendChild(overlay);
    overlay.querySelector('#shopRouletteModalClose').addEventListener('click', closeShopRouletteModal);

    return btn;
}

function renderShopRouletteModalBody() {
    const body = document.getElementById('shopRouletteModalBody');
    if (!body) return;
    const cost = getNormalRouletteSpinCost();
    const coins = parseInt(localStorage.getItem('deadCoins') || '0');
    const canPay = cost === 0 || window.infiniteCoinsMode || coins >= cost;
    const segments = getNormalWheelSegments();
    body.innerHTML = `
        <div class="roulette-wheel-big-wrap" id="shopRouletteWheelWrap">
            <div class="roulette-wheel-pointer"></div>
            <div class="vip-roulette-wheel roulette-wheel-big" id="shopRouletteBigWheel" style="background-image:url('${ROULETTE_WHEEL_IMAGES.normal}');"></div>
            ${renderWheelSegmentIcons(segments, 'shopRouletteIconsWrap')}
        </div>
        <div class="roulette-footer" id="shopRouletteFooter">
            <p class="roulette-hint-text">
                ${cost === 0 ? 'Tenés tu giro gratis de hoy esperando.' : `Ya usaste el giro gratis de hoy. Girar de nuevo cuesta ${cost} monedas.`}
            </p>
            <button id="shopRouletteSpinBtn" class="roulette-spin-btn" onclick="spinShopRoulette()" ${canPay ? '' : 'disabled'}>
                ${cost === 0 ? 'GIRAR GRATIS' : `GIRAR · ${cost} monedas`}
            </button>
            ${canPay ? '' : '<p class="roulette-cant-pay">No te alcanzan las monedas.</p>'}
        </div>
    `;
}

function spinShopRoulette() {
    const cost = getNormalRouletteSpinCost();
    const coins = parseInt(localStorage.getItem('deadCoins') || '0');
    if (cost > 0 && !window.infiniteCoinsMode && coins < cost) return;

    const todayKey = getTodayKey();
    if (cost === 0) {
        localStorage.setItem('rouletteFreeSpin_' + todayKey, 'true');
    } else {
        spendCurrency(cost, 'coins');
        const paidCount = parseInt(localStorage.getItem('roulettePaidSpins_' + todayKey) || '0');
        localStorage.setItem('roulettePaidSpins_' + todayKey, String(paidCount + 1));
    }

    performRouletteSpin({
        wheelWrapId: 'shopRouletteWheelWrap',
        bigWheelId: 'shopRouletteBigWheel',
        iconsWrapId: 'shopRouletteIconsWrap',
        smallWheelSelector: '#shopRouletteBtn .vip-roulette-wheel',
        footerId: 'shopRouletteFooter',
        table: NORMAL_ROULETTE_TABLE,
        segments: getNormalWheelSegments(),
        resultTextColor: '#ffffff',
        spinAgainFn: 'renderShopRouletteModalBody',
    });
}

function openShopRouletteModal() {
    window.playSfx?.('levelHover', 0.6);
    renderShopRouletteModalBody();
    document.getElementById('shopRouletteOverlay')?.classList.add('open');
}

function closeShopRouletteModal() {
    document.getElementById('shopRouletteOverlay')?.classList.remove('open');
}

function showShopRoulette() {
    const btn = ensureShopRouletteButton();
    btn.style.display = 'flex';

    const INITIAL_DELAY = 3000;
    const REPEAT_EVERY = 9000;
    const CYCLE_LENGTH = 1100;

    const inviteOnce = () => {
        const overlay = document.getElementById('shopRouletteOverlay');
        if (!btn || overlay?.classList.contains('open')) return;
        btn.classList.add('inviting');
        setTimeout(() => btn.classList.remove('inviting'), CYCLE_LENGTH);
    };

    shopRouletteInviteTimeout = setTimeout(() => {
        inviteOnce();
        shopRouletteInviteInterval = setInterval(inviteOnce, REPEAT_EVERY);
    }, INITIAL_DELAY);
}

function hideShopRoulette() {
    if (shopRouletteInviteTimeout) { clearTimeout(shopRouletteInviteTimeout); shopRouletteInviteTimeout = null; }
    if (shopRouletteInviteInterval) { clearInterval(shopRouletteInviteInterval); shopRouletteInviteInterval = null; }
    const btn = document.getElementById('shopRouletteBtn');
    if (btn) { btn.style.display = 'none'; btn.classList.remove('inviting'); }
    closeShopRouletteModal();
}

function renderVIPShell(panel) {
    panel.innerHTML = `
        <div class="vip-bg">
            <img src="assets/UI/Store/VIP/Backgrounds/bg_store_vip.png" alt="" draggable="false">
            <div></div>
        </div>
        <div class="vip-shell">
            <div class="vip-topbar">
                <div>
                    <div class="vip-kicker">CONTENIDO EXCLUSIVO</div>
                    <div class="vip-title">TIENDA VIP</div>
                </div>
                <div class="vip-balance">
                    <span><img src="assets/UI/Common/Currency/Rubies.png" alt=""> <b id="vip-gems">0</b></span>
                    <span><img src="assets/UI/Common/Currency/DEAD_COIN.png" alt=""> <b id="vip-coins">0</b></span>
                    <button onclick="closeVIP()" type="button">VOLVER</button>
                </div>
            </div>
            <div id="vipContent" class="vip-content"></div>
        </div>
    `;
    optimizeShopMedia(panel);
}

function renderVIPHome() {
    const content = document.getElementById('vipContent');
    if (!content) return;
    window.currentVIPDetailRenderer = null;
    const active = VIP_CAROUSEL_DATA[vipCarouselIndex % VIP_CAROUSEL_DATA.length];
    content.innerHTML = `
        <section class="vip-hero">
            <button class="vip-arrow" onclick="moveVIPCarousel(-1)" type="button">&lt;</button>
            <div class="vip-feature hud-frame hud-panel-cut vip-carousel-glow" style="--vip-glow-a:${active.glowA || '#ffee00'}; --vip-glow-b:${active.glowB || '#ff8800'}; --cfg-hud-accent:#e0b563;" onclick="renderVIPCarouselDetail('${active.id}')">
                <div class="hud-frame-c tl"></div><div class="hud-frame-c tr"></div>
                <div class="hud-frame-c bl"></div><div class="hud-frame-c br"></div>
                <div class="vip-feature-cover" style="background-image:linear-gradient(90deg, rgba(0,0,0,.35), rgba(0,0,0,.05)), url('${active.cover}');"></div>
                <div class="vip-feature-scrim"></div>
                <div class="vip-feature-copy">
                    <span class="hud-tag">PANEL DESTACADO</span>
                    <span class="hero-kicker-line"></span>
                    <h2>${active.title}</h2>
                    <p>${active.subtitle}</p>
                </div>
                <div class="vip-feature-bottom">
                    <span class="label">Desde</span>
                    <span class="hud-price-chip">${renderPrice(active.price, 'gems')}</span>
                </div>
            </div>
            <button class="vip-arrow" onclick="moveVIPCarousel(1)" type="button">&gt;</button>
        </section>
        <div class="vip-dots">
            ${VIP_CAROUSEL_DATA.map((panel, index) => `<button class="${index === vipCarouselIndex ? 'active' : ''}" onclick="setVIPCarousel(${index})" type="button">${index + 1}</button>`).join('')}
        </div>
        <section class="vip-banner-row">
            ${VIP_PROMO_BANNERS.map(banner => `
                <div class="vip-banner-col">
                    <div class="vip-section-title hud-header-bar" style="--cfg-hud-accent:#e0b563;">${banner.title}</div>
                    ${renderVIPPromoBanner(banner)}
                </div>
            `).join('')}
        </section>
        <div class="vip-section-title hud-header-bar" style="--cfg-hud-accent:#e0b563;">PAQUETES DE LA VITRINA</div>
        <section class="vip-package-grid">
            ${VIP_PACKAGES_DATA.map(renderVIPPackageCard).join('')}
        </section>
        <div class="vip-section-title hud-header-bar" style="--cfg-hud-accent:#e0b563;">OFERTAS RELÁMPAGO</div>
        <div class="mini-row">
            ${VIP_FLASH_OFFERS_DEMO.map(renderVIPFlashOfferMini).join('')}
        </div>
    `;
    optimizeShopMedia(content);
}

function moveVIPCarousel(direction) {
    vipCarouselIndex = (vipCarouselIndex + direction + VIP_CAROUSEL_DATA.length) % VIP_CAROUSEL_DATA.length;
    renderVIPHome();
}

function setVIPCarousel(index) {
    vipCarouselIndex = index;
    renderVIPHome();
}

/* Ofertas relámpago (Fase 2.4.8) — SOLO VISUAL por ahora, calcada de
   V6.html. No hay temporizador real corriendo ni sistema de expiración
   de ofertas en el juego (ver nota en el .md, Fase 2.4.4) — el texto
   de tiempo es fijo, no cuenta atrás de verdad. Usa 3 items reales que
   YA existen en VIP_PACKAGES_DATA (no se inventaron items nuevos) solo
   para no dejarlo con nombres de mentira. Cuando exista un sistema real
   de ofertas con vencimiento, esto se reemplaza por datos reales ahí.
   */
const VIP_FLASH_OFFERS_DEMO = [
    { name: 'Fantasma', timeText: '00:41:12', price: 260, image: 'assets/UI/Store/VIP/Bundles/Monsters/skin_fantasma.png' },
    { name: 'Lobo Monstruo', timeText: '02:03:47', price: 300, image: 'assets/UI/Store/VIP/Bundles/Monsters/skin_lobo_monstruo.png' },
    { name: 'Calabaza', timeText: '05:12:00', price: 280, image: 'assets/UI/Store/VIP/Bundles/Monsters/skin_calabaza.png' }
];

function renderVIPFlashOfferMini(offer) {
    return `
        <article class="hud-panel-cut mini-banner">
            <div class="mini-art"></div>
            <div class="mini-body"><span class="name">${offer.name}</span></div>
            <div class="mini-foot">
                <span class="hud-timer"><span class="hud-timer-clock"></span>${offer.timeText}</span>
                <span class="hud-price-chip">${renderPrice(offer.price, 'gems')}</span>
            </div>
        </article>
    `;
}

function renderVIPPackageCard(pack) {
    return `
        <article class="vip-pack-card hud-panel-cut" style="--vip-accent:${pack.accent}; --cfg-hud-accent:#e0b563;" onclick="renderVIPPackageDetail('${pack.id}')">
            ${pack.badge === 'best' ? '<div class="vip-pack-ribbon">MÁS VENDIDO</div>' : ''}
            ${pack.isNew ? '<div class="hud-notify-dot"></div>' : ''}
            <div class="vip-pack-cover" style="background-image:url('${pack.cover}');"></div>
            <div class="vip-pack-scrim"></div>
            <div class="vip-pack-body">
                <div class="vip-kicker">PAQUETE</div>
                <h3>${pack.title}</h3>
                <div class="tier-sub">${pack.items.length} items</div>
                <div class="tier-foot"><span class="hud-price-chip">${renderPrice(pack.price, 'gems')}</span></div>
            </div>
        </article>
    `;
}

function renderVIPCarouselDetail(id) {
    const panel = VIP_CAROUSEL_DATA.find(item => item.id === id);
    if (!panel) return renderVIPHome();
    window.currentVIPDetailRenderer = () => renderVIPCarouselDetail(id);
    renderVIPCarouselShowcase(panel);
}

function renderVIPPromoBanner(banner) {
    if (banner.id === 'vip_powerups') return renderVIPPowerupPromoBanner(banner);
    if (banner.id === 'vip_seasons') return renderVIPSeasonsBanner(banner);

    return `
        <article class="vip-promo-banner hud-frame hud-panel-cut" style="--cfg-hud-accent:#e0b563;" onclick="renderVIPPromoDetail('${banner.id}')">
            <div class="hud-frame-c tl"></div><div class="hud-frame-c tr"></div>
            <div class="hud-frame-c bl"></div><div class="hud-frame-c br"></div>
            <img src="${banner.cover}" alt="" draggable="false">
        </article>
    `;
}

function renderVIPPromoDetail(id) {
    const banner = VIP_PROMO_BANNERS.find(item => item.id === id);
    if (!banner) return renderVIPHome();
    const content = document.getElementById('vipContent');
    if (!content) return;
    window.currentVIPDetailRenderer = () => renderVIPPromoDetail(id);
    const isBannerShop = id === 'vip_specials';
    const isSeasons = id === 'vip_seasons';
    content.innerHTML = `
        <button class="vip-back" onclick="renderVIPHome()" type="button">VOLVER A VIP</button>
        ${isBannerShop
            ? renderVIPLegendRoom(banner)
            : isSeasons
                ? renderVIPSeasonsDetail(banner)
                : renderVIPGameplayLab(banner)}
    `;
    optimizeShopMedia(content);
    if (isBannerShop) initVIPBannerShelfLoops(content);
}

// Renderizar banner promocional de Temporadas VIP
// banner: Objeto del banner
// Retorna HTML del banner con carrusel de temporadas
function renderVIPSeasonsBanner(banner) {
    const seasons = window.GEM_SEASONS ? Object.values(window.GEM_SEASONS) : [];
    const activeSeasons = seasons.filter(s => window.isSeasonActive?.(s.id));

    return `
        <article class="vip-promo-banner vip-seasons-promo-banner" onclick="renderVIPPromoDetail('${banner.id}')">
            <div class="vip-seasons-promo-backdrop"></div>
            <div class="vip-seasons-promo-copy">
                <span>TEMPORADAS</span>
                <strong>EXCLUSIVAS</strong>
            </div>
            <div class="vip-seasons-promo-grid">
                ${seasons.slice(0, 4).map((season, index) => `
                    <div class="vip-season-card season-${index + 1}" style="--season-active:${window.isSeasonActive?.(season.id) ? '1' : '0'};" onclick="event.stopPropagation(); renderVIPSeasonDetail('${season.id}');">
                        <div class="vip-season-cover">
                            <img src="${SHOP_PLACEHOLDER_IMAGE}" alt="${season.displayName}" draggable="false">
                        </div>
                        <div class="vip-season-info">
                            <span>${season.displayName}</span>
                        </div>
                    </div>
                `).join('')}
            </div>
        </article>
    `;
}

// Renderizar detalle de Temporadas VIP
// banner: Objeto del banner
// Retorna HTML de la página de detalle de temporadas
function renderVIPSeasonsDetail(banner) {
    const seasons = window.GEM_SEASONS ? Object.values(window.GEM_SEASONS) : [];
    const activeSeasons = seasons.filter(s => window.isSeasonActive?.(s.id));

    return `
        <section class="vip-seasons-hero" style="background-image:linear-gradient(90deg, rgba(2,5,12,0.82), rgba(4,10,16,0.58)), url('${banner.detailBackground || banner.cover}');">
            <div class="vip-seasons-hero-content">
                <div class="vip-kicker">TEMPORADAS</div>
                <h2>${banner.title}</h2>
                <p>${banner.subtitle}</p>
                <div class="vip-seasons-count">${activeSeasons.length} temporadas activas</div>
            </div>
        </section>
        <section class="vip-seasons-grid">
            ${seasons.map(season => renderVIPSeasonCard(season)).join('')}
        </section>
    `;
}

// Renderizar tarjeta de temporada
// season: Objeto de temporada
// Retorna HTML de la tarjeta
function renderVIPSeasonCard(season) {
    const isActive = window.isSeasonActive?.(season.id);
    const now = new Date();
    const startsAt = new Date(`${season.startsAt}T00:00:00`);
    const expiresAt = new Date(`${season.expiresAt}T23:59:59`);

    let statusText = '';
    let statusColor = '';

    if (isActive) {
        statusText = 'ACTIVA';
        statusColor = '#00ff88';
    } else if (now < startsAt) {
        statusText = 'PRÓXIMAMENTE';
        statusColor = '#ffee00';
    } else {
        statusText = 'EXPIRADA';
        statusColor = '#ff4d6d';
    }

    return `
        <article class="vip-season-detail-card" onclick="renderVIPSeasonDetail('${season.id}')">
            <div class="vip-season-detail-cover">
                <img src="${SHOP_PLACEHOLDER_IMAGE}" alt="${season.displayName}" draggable="false">
                <div class="vip-season-status" style="color:${statusColor}; border-color:${statusColor};">${statusText}</div>
            </div>
            <div class="vip-season-detail-body">
                <div class="vip-kicker">TEMPORADA</div>
                <h3>${season.displayName}</h3>
                <p>Del ${season.startsAt} al ${season.expiresAt}</p>
                <div class="vip-season-items-count">
                    ${season.contains.skins.length} skins • ${season.contains.trails.length} trails • ${season.contains.banners.length} banners • ${season.contains.emotes.length} emotes
                </div>
            </div>
        </article>
    `;
}

// Renderizar detalle individual de una temporada
// seasonId: ID de la temporada
// Retorna HTML de la página de detalle de la temporada
function renderVIPSeasonDetail(seasonId) {
    const season = window.getSeasonById?.(seasonId);
    if (!season) return renderVIPSeasonsDetail(VIP_PROMO_BANNERS.find(b => b.id === 'vip_seasons'));

    const content = document.getElementById('vipContent');
    if (!content) return;

    window.currentVIPDetailRenderer = () => renderVIPSeasonDetail(seasonId);

    content.innerHTML = `
        <button class="vip-back" onclick="renderVIPPromoDetail('vip_seasons')" type="button">VOLVER A TEMPORADAS</button>
        <section class="vip-season-detail-hero" style="background-image:linear-gradient(90deg, rgba(2,5,12,0.82), rgba(4,10,16,0.58));">
            <div class="vip-season-detail-hero-cover">
                <img src="${SHOP_PLACEHOLDER_IMAGE}" alt="${season.displayName}" draggable="false">
            </div>
            <div class="vip-season-detail-hero-content">
                <div class="vip-kicker">TEMPORADA</div>
                <h2>${season.displayName}</h2>
                <p>Del ${season.startsAt} al ${season.expiresAt}</p>
            </div>
        </section>
        <section class="vip-season-detail-content">
            <div class="vip-season-empty-state">
                <div style="color:rgba(255,255,255,0.3); font-family:monospace; font-size:14px; letter-spacing:2px; text-align:center; padding:40px;">
                    CONTENIDO DE TEMPORADA
                </div>
            </div>
        </section>
    `;
    optimizeShopMedia(content);
}

function renderVIPGameplayPlaceholder(item) {
    const selected = selectedVIPGameplayId === item.id;
    return `
        <article class="vip-gameplay-module ${item.rarity || 'rare'} ${selected ? 'selected' : ''}" onclick="selectVIPGameplayModule('${item.id}')">
            <div class="vip-placeholder-core">
                <span>${item.type}</span>
            </div>
            <div class="vip-module-copy">
                <div class="vip-mini-type">PROXIMO CONTENIDO</div>
                <h3>${item.name}</h3>
                <p>${item.detail}</p>
            </div>
        </article>
    `;
}

function selectVIPGameplayModule(id) {
    selectedVIPGameplayId = id;
    renderVIPPromoDetail('vip_powerups');
}

function renderVIPGameplayLab(banner) {
    const active = VIP_GAMEPLAY_PLACEHOLDERS.find(item => item.id === selectedVIPGameplayId) || VIP_GAMEPLAY_PLACEHOLDERS[0];
    return `
        <section class="vip-reactor-hero" style="background-image:linear-gradient(90deg, rgba(2,5,12,0.82), rgba(4,10,16,0.58)), url('${banner.detailBackground || banner.cover}');">
            <div class="vip-reactor-orb"><span>${active?.type || 'CORE'}</span></div>
            <div>
                <div class="vip-kicker">LABORATORIO VIP</div>
                <h2>${banner.title}</h2>
                <p>${active?.detail || banner.subtitle}</p>
            </div>
        </section>
        <section class="vip-hex-lab">
            <div class="vip-hex-links"></div>
            ${VIP_GAMEPLAY_PLACEHOLDERS.map(renderVIPGameplayPlaceholder).join('')}
        </section>
    `;
}

function renderVIPLegendRoom(banner) {
    const { temporada, nuevos, coleccionRows, availableRarities, activeFilter } = getVIPBannerShelfRows();
    // Fondo EXCLUSIVO de la Sala Legendaria: nunca debe repetir la imagen de
    // portada (banner.cover) que ya se ve en la tarjeta de la tienda VIP.
    // Mientras no exista arte final para este fondo, se usa solo el gradiente
    // (nunca cae en banner.cover ni en banner.detailBackground).
    const gradientBase = 'linear-gradient(150deg, rgba(88,28,135,0.5), rgba(10,8,24,0.82)), radial-gradient(ellipse 70% 70% at 12% 8%, rgba(147,51,234,0.4), transparent 60%), radial-gradient(ellipse 70% 70% at 88% 92%, rgba(37,99,235,0.4), transparent 60%)';
    const legendCoreStyle = banner.legendBackground
        ? `background-image:${gradientBase}, url('${banner.legendBackground}');`
        : `background-image:${gradientBase};`;

    let shelvesHtml = '';
    if (temporada.length) {
        shelvesHtml += renderVIPBannerShelf({
            title: temporada[0]?.seasonName || 'TEMPORADA',
            items: temporada,
            variant: 'temporada'
        });
    }
    if (nuevos.length) {
        shelvesHtml += renderVIPBannerShelf({ title: 'NUEVOS', items: nuevos, variant: 'carousel' });
    }
    shelvesHtml += renderVIPBannerRarityFilter(availableRarities, activeFilter);
    coleccionRows.forEach((rowItems, index) => {
        shelvesHtml += renderVIPBannerShelf({
            title: coleccionRows.length > 1 ? `COLECCION ${index + 1}` : 'COLECCION',
            items: rowItems,
            variant: 'carousel',
            offset: index % 2 === 1
        });
    });

    return `
        <div class="vip-legend-view">
            <section class="vip-legend-room">
                <div class="vip-legend-stars" aria-hidden="true"></div>
                <div class="vip-legend-core" style="${legendCoreStyle}">
                    <div class="vip-kicker">SALA LEGENDARIA</div>
                    <h2>${banner.title}</h2>
                    <p>${banner.subtitle}</p>
                    <button class="vip-tech-button" onclick="document.querySelector('.vip-banner-catalog-chamber')?.scrollIntoView({behavior:'smooth', block:'start'})" type="button">VER BANNERS</button>
                </div>
            </section>
            <section class="vip-banner-catalog-chamber">
                ${shelvesHtml || '<p class="vip-banner-empty">Aún no hay banners disponibles.</p>'}
            </section>
        </div>
    `;
}

// Una fila del panal escalonado. variant: 'temporada' (estática, sin loop) o
// 'carousel' (Nuevos / Colección: loop infinito duplicando el set de items).
function renderVIPBannerShelf({ title, items, variant, offset = false }) {
    const isCarousel = variant === 'carousel';
    const shelfId = `vip-shelf-${slugifyBannerCatalogId(title)}-${Math.random().toString(36).slice(2, 7)}`;
    const trackItems = isCarousel ? [...items, ...items, ...items] : items;
    const cardsHtml = trackItems.map(b => renderVIPStationBanner(b, variant === 'temporada')).join('');
    return `
        <div class="vip-banner-shelf ${isCarousel ? 'is-carousel' : 'is-static'} ${offset ? 'is-offset' : ''}">
            <div class="vip-banner-shelf-title">${title}</div>
            <div class="vip-banner-shelf-track-wrap">
                ${isCarousel ? `<button class="vip-shelf-arrow left" onclick="scrollVIPShelf('${shelfId}', -1)" type="button" aria-label="Anterior">&lt;</button>` : ''}
                <div class="vip-banner-shelf-track" id="${shelfId}" ${isCarousel ? `data-vip-shelf-loop="true" data-vip-shelf-count="${items.length}"` : ''}>
                    ${cardsHtml}
                </div>
                ${isCarousel ? `<button class="vip-shelf-arrow right" onclick="scrollVIPShelf('${shelfId}', 1)" type="button" aria-label="Siguiente">&gt;</button>` : ''}
            </div>
        </div>
    `;
}

// Desplaza una fila-carrusel de banners hacia la izquierda/derecha.
// NOTA (fix bug carrusel): ya no forzamos normalizeVIPShelfLoop() ni
// tocamos scrollLeft de forma síncrona aquí. Antes esta función y el
// listener de scroll (más abajo) escribían scrollLeft casi al mismo tiempo
// que la animación nativa 'smooth' seguía en curso, y se peleaban entre sí
// (esos eran los saltos/glitches visibles). Ahora scrollVIPShelf() SOLO
// dispara el scroll suave; el reacomodo del loop lo hace siempre el mismo
// mecanismo (ver initVIPBannerShelfLoops), sin importar si el scroll vino
// del botón, del touch o de la rueda del mouse.
function scrollVIPShelf(id, direction) {
    const track = document.getElementById(id);
    if (!track) return;
    const card = track.querySelector('.vip-station-card');
    const step = ((card?.offsetWidth || 220) + 18) * 3;
    // Esta clase le dice al CSS que anime este scroll (scroll-behavior:
    // smooth); el touch/wheel nativo se queda "auto" (instantáneo) siempre,
    // así que no compite con el gesto del usuario. Se quita en 'settle',
    // cuando el scroll ya terminó de verdad (ver initVIPBannerShelfLoops).
    track.classList.add('is-smooth-scrolling');
    track.scrollBy({ left: direction * step, behavior: 'smooth' });
}

function getVIPShelfLoopWidth(track) {
    if (!track) return 0;
    const count = parseInt(track.dataset.vipShelfCount || '0', 10);
    const cards = track.querySelectorAll('.vip-station-card');
    if (count && cards.length > count) {
        return cards[count].offsetLeft - cards[0].offsetLeft;
    }
    return track.scrollWidth ? track.scrollWidth / 3 : 0;
}

function jumpVIPShelfWithoutSmooth(track, left) {
    if (!track) return;
    track.dataset.vipLoopJumping = 'true';
    track.style.scrollBehavior = 'auto';
    track.scrollLeft = left;
    requestAnimationFrame(() => {
        track.style.scrollBehavior = '';
        // Doble rAF: esperamos un frame extra para que el propio salto no
        // dispare de nuevo el listener de scroll antes de limpiar la bandera.
        requestAnimationFrame(() => {
            track.dataset.vipLoopJumping = 'false';
        });
    });
}

function normalizeVIPShelfLoop(track) {
    const loopWidth = getVIPShelfLoopWidth(track);
    if (!loopWidth) return;
    const left = track.scrollLeft;
    if (left >= loopWidth * 2) {
        jumpVIPShelfWithoutSmooth(track, left - loopWidth);
    } else if (left < loopWidth) {
        jumpVIPShelfWithoutSmooth(track, left + loopWidth);
    }
}

// Activa el "loop" infinito de las filas-carrusel: al llegar a cualquiera de
// los extremos del track duplicado, salta sin animación al punto equivalente
// del otro set, dando la sensación de scroll infinito.
//
// FIX BUG (ver notas arriba): normalizeVIPShelfLoop ya NO se ejecuta en cada
// frame mientras el scroll está en movimiento (eso era lo que chocaba con el
// scroll suave del botón y con el touch/wheel nativo). Ahora se espera a que
// el scroll realmente se haya detenido -usando el evento nativo 'scrollend'
// si el navegador lo soporta, o un debounce corto como fallback- y solo
// ENTONCES se decide si hace falta el salto de loop.
function initVIPBannerShelfLoops(root = document) {
    const supportsScrollEnd = 'onscrollend' in window;
    root.querySelectorAll('[data-vip-shelf-loop="true"]').forEach(track => {
        if (track.dataset.vipLoopBound === 'true') return;
        track.dataset.vipLoopBound = 'true';
        const count = parseInt(track.dataset.vipShelfCount || '0', 10);
        if (!count) return;
        requestAnimationFrame(() => {
            const loopWidth = getVIPShelfLoopWidth(track);
            if (loopWidth) jumpVIPShelfWithoutSmooth(track, loopWidth);
        });

        const settle = () => {
            if (track.dataset.vipLoopJumping === 'true') return;
            track.classList.remove('is-smooth-scrolling');
            normalizeVIPShelfLoop(track);
        };

        if (supportsScrollEnd) {
            // Camino ideal: el navegador avisa cuando el scroll (venga de
            // botón, touch o wheel) terminó de verdad, sin adivinar tiempos.
            track.addEventListener('scrollend', settle, { passive: true });
        } else {
            // Fallback (navegadores sin 'scrollend', ej. Safari viejo):
            // debounce. Reinicia el timer en cada evento de scroll y solo
            // normaliza cuando pasan 150ms sin nuevos eventos, es decir,
            // cuando el scroll ya se detuvo por completo (sea cual sea su
            // origen), en vez de reaccionar a cada frame intermedio.
            track.addEventListener('scroll', () => {
                if (track.dataset.vipLoopJumping === 'true') return;
                clearTimeout(track.vipScrollSettleTimer);
                track.vipScrollSettleTimer = setTimeout(settle, 150);
            }, { passive: true });
        }
    });
}

function renderVIPStationBanner(banner, isTemporadaCard = false) {
    const owned = ownsBanner(banner);
    const equipped = isBannerEquipped(banner);
    const isGif = banner.animated || String(banner.cover).endsWith('.gif');
    const stillNew = isBannerStillNew(banner);
    const rarityColor = BANNER_RARITY_COLORS[banner.rarity] || (isGif ? '#cc44ff' : '#57b7dd');
    const badges = `${isGif ? '<span class="vip-station-badge badge-gif">GIF</span>' : ''}${stillNew ? '<span class="vip-station-badge badge-new">NUEVO</span>' : ''}`;
    return `
        <article class="vip-station-card ${isGif ? 'is-animated' : ''} ${isTemporadaCard ? 'is-temporada' : ''} ${owned ? 'owned' : ''}" style="--vip-station-rarity:${rarityColor};">
            <div class="vip-station-banner" style="background-image:url('${banner.cover}');"></div>
            <div class="vip-station-scrim"></div>
            ${badges ? `<div class="vip-station-badges">${badges}</div>` : ''}
            <div class="vip-station-info">
                <h3>${banner.name}</h3>
                <div class="vip-mini-type" style="color:${rarityColor};">${isGif ? 'ANIMADO' : (banner.rarity || 'VIP')}</div>
                <button class="vip-tech-button" onclick="${owned ? `equipBanner('${banner.id}')` : `buyVIPBanner('${banner.id}')`}" ${equipped ? 'disabled' : ''} type="button">${equipped ? 'EQUIPADO' : owned ? 'EQUIPAR' : `COMPRAR ${renderPrice(banner.price || 420, 'gems')}`}</button>
            </div>
        </article>
    `;
}

function renderVIPCarouselShowcase(panel) {
    const content = document.getElementById('vipContent');
    if (!content) return;
    window.currentVIPBuyAll = () => buyVIPCollection('carousel', panel);
    content.innerHTML = `
        <button class="vip-back" onclick="renderVIPHome()" type="button">VOLVER A VIP</button>
        <section class="vip-carousel-room" style="--vip-glow-a:${panel.glowA || '#ffee00'}; --vip-glow-b:${panel.glowB || '#ff8800'}; background-image:linear-gradient(90deg, rgba(3,4,10,0.86), rgba(3,4,10,0.58)), url('${panel.detailBackground || panel.cover}');">
            <button class="vip-show-arrow left" onclick="moveVIPCarouselDetail(-1)" type="button">&lt;</button>
            <div class="vip-carousel-core">
                <div class="vip-kicker">SHOWCASE VIP</div>
                <h2>${panel.title}</h2>
                <p>${panel.subtitle || 'Coleccion exclusiva'}</p>
                <button onclick="currentVIPBuyAll()" class="vip-tech-button" type="button">COMPRAR TODO ${renderPrice(panel.price, 'gems')}</button>
            </div>
            <div class="vip-parallax-panels">
                ${panel.items.map((item, index) => renderVIPParallelogramItem(item, index)).join('')}
            </div>
            <button class="vip-show-arrow right" onclick="moveVIPCarouselDetail(1)" type="button">&gt;</button>
        </section>
    `;
    optimizeShopMedia(content);
    setTimeout(() => {
        panel.items.forEach(item => {
            if ((item.type === 'trail' || item.type === 'elementTrail' || item.type === 'vipTrailPng') && item.trailId) {
                startVIPTrailCanvas(item.trailId, item.previewColor || vipSelectedColors[item.trailId] || 'cyan', `vip-show-trail-${item.trailId}`);
            }
        });
    }, 50);
}

function moveVIPCarouselDetail(direction) {
    vipCarouselIndex = (vipCarouselIndex + direction + VIP_CAROUSEL_DATA.length) % VIP_CAROUSEL_DATA.length;
    renderVIPCarouselDetail(VIP_CAROUSEL_DATA[vipCarouselIndex].id);
}

function renderVIPParallelogramItem(item, index) {
    const itemKey = getVIPItemStorageKey(item);
    const owned = localStorage.getItem(itemKey) === 'true';
    const lane = index % 3;
    const media = item.trailId
        ? `<canvas id="vip-show-trail-${item.trailId}" width="220" height="90" class="vip-trail-preview"></canvas>`
        : `<img src="${item.image || SHOP_PLACEHOLDER_IMAGE}" alt="" draggable="false">`;
    return `
        <article class="vip-show-card lane-${lane} ${index === 0 ? 'selected' : ''} ${owned ? 'owned' : ''}">
            <div class="vip-show-media">${media}</div>
            <div class="vip-mini-type">${(item.type || 'VIP').toUpperCase()}</div>
            <h3>${item.name}</h3>
            ${item.price ? `<button class="vip-tech-button" onclick="buyVIPMiniItemById('${item.id || item.trailId || item.name}')" ${owned ? 'disabled' : ''} type="button">${owned ? 'OBTENIDO' : `COMPRAR ${renderPrice(item.price, 'gems')}`}</button>` : ''}
        </article>
    `;
}

function renderVIPBannerItem(banner) {
    const owned = ownsBanner(banner);
    const equipped = isBannerEquipped(banner);
    return `
        <article class="vip-mini-item vip-banner-item ${owned ? 'owned' : ''}">
            <div class="vip-banner-preview" style="background-image:url('${banner.cover}');"></div>
            <div class="vip-mini-type">${banner.animated || String(banner.cover).endsWith('.gif') ? 'BANNER ANIMADO' : 'BANNER VIP'}</div>
            <h3>${banner.name}</h3>
            <button onclick="${owned ? `equipBanner('${banner.id}')` : `buyVIPBanner('${banner.id}')`}" ${equipped ? 'disabled' : ''} type="button">${equipped ? 'EQUIPADO' : owned ? 'EQUIPAR' : `COMPRAR ${renderPrice(banner.price || 420, 'gems')}`}</button>
        </article>
    `;
}

function buyVIPBanner(id) {
    const banner = findBannerById(id);
    if (!banner) return;
    const price = banner.price || 420;
    showShopModal({
        kicker: banner.animated || String(banner.cover).endsWith('.gif') ? 'BANNER ANIMADO VIP' : 'BANNER VIP',
        title: banner.name,
        image: banner.cover,
        background: banner.cover,
        body: `Seguro comprar por ${price} rubies?`,
        confirmText: 'SI',
        cancelText: 'NO',
        onConfirm: () => {
            if (!canAfford(price, 'gems')) return alert('No tienes suficientes rubies.');
            spendCurrency(price, 'gems');
            window.playSfx?.('vipBuy');
            setBannerOwned(banner);
            localStorage.setItem('equippedBanner', banner.id);
            renderVIPPromoDetail('vip_specials');
            updateMenuHUD();
        }
    });
}

function renderVIPPackageDetail(id) {
    const pack = VIP_PACKAGES_DATA.find(item => item.id === id);
    if (!pack) return renderVIPHome();
    window.currentVIPDetailRenderer = () => renderVIPPackageDetail(id);
    renderVIPDetail(pack.title, '', pack.price, pack.cover, pack.items, () => buyVIPCollection('package', pack), pack.detailBackground || pack.cover);
}

function renderVIPDetail(title, subtitle, price, cover, items, buyAll, detailBackground = cover) {
    const content = document.getElementById('vipContent');
    if (!content) return;
    window.currentVIPBuyAll = buyAll;
    content.innerHTML = `
        <button class="vip-back" onclick="renderVIPHome()" type="button">VOLVER A VIP</button>
        <section class="vip-detail-head" style="background-image:url('${detailBackground}'); background-size:cover; background-position:center;">
        </section>
        <button onclick="currentVIPBuyAll()" class="vip-buy-all vip-buy-all-detail" type="button">COMPRAR TODO ${renderPrice(price, 'gems')}</button>
        <section class="vip-item-grid">
            ${items.map(item => renderVIPMiniItem(item)).join('')}
        </section>
    `;
    optimizeShopMedia(content);
    setTimeout(() => {
        items.forEach(item => {
            if ((item.type === 'trail' || item.type === 'elementTrail' || item.type === 'vipTrailPng') && item.trailId) {
                const defaultColor = item.previewColor || vipSelectedColors[item.trailId] || 'cyan';
                startVIPTrailCanvas(item.trailId, defaultColor);
            } else if (item.type === 'customTextTrail') {
                startCustomTextTrailPreview('custom-text-trail-canvas', 'customTrailPhrase');
            }
        });
    }, 50);
}

function renderVIPMiniItem(item) {
    const itemKey = getVIPItemStorageKey(item);
    const owned = localStorage.getItem(itemKey) === 'true';
    const isTrophy = TROPHY_IDS.includes(item.id || item.trailId || item.name);
    const trophyClass = isTrophy ? 'trophy-skin' : '';

    // Mantenemos tus retornos tempranos para los otros tipos (no los toques)
    if (item.type === 'vipPanel') return renderVIPPanelItem(item, owned);
    if (item.type === 'customTextTrail') return renderCustomTextTrailItem(item, owned);
    // ... (mantén todos tus if) ...

    const isSkinItem = item.type === 'vipSkin' || item.type === 'skin';
    const rarity = String(item.rarity || '').toUpperCase();
    const rarityColor = item.rarityColor || '#ffee00';
    const flagClass = rarity === 'VIP' ? 'hud-flag--vip' : '';
    const flagLetter = rarity ? rarity.charAt(0) : '';

    // AQUÍ ES EL ÚNICO RETURN QUE DEBE QUEDAR:
    return `
        <article class="vip-mini-item ${owned ? 'owned' : ''} ${trophyClass}" style="--inv-rarity-color:${rarityColor};">
            ${rarity ? `
                <div class="hud-flag ${flagClass}" style="${flagClass ? '' : `background:${rarityColor};`}">
                    <span class="hud-flag-txt">${flagLetter}</span>
                </div>
                ${flagClass ? '<div class="hud-flag-shine"></div>' : ''}
            ` : ''}
            <div class="${isSkinItem ? 'vip-skin-orb' : 'vip-mini-image'}">
                <img src="${item.image}" alt="" draggable="false">
            </div>
            <div class="vip-mini-type">${isTrophy ? 'TROFEO' : (item.type === 'vipSkin' ? 'SKIN' : item.type).toUpperCase()}</div>
            <h3>${item.name}</h3>
            ${item.price ? `<button onclick="buyVIPMiniItemById('${item.id || item.name}')" ${owned ? 'disabled' : ''} type="button">${owned ? 'OBTENIDO' : `COMPRAR ${renderPrice(item.price, 'gems')}`}</button>` : ''}
        </article>
    `;
}

function getVIPItemStorageKey(item) {
    const raw = item.id || item.trailId || item.name || 'item';
    return `vip_item_${String(raw).toLowerCase().replaceAll(' ', '_')}`;
}

function findVIPItemById(id) {
    const match = item => (item.id || item.trailId || item.name) === id;
    const walk = items => {
        for (const item of items || []) {
            if (match(item)) return item;
            const nested = walk(item.items);
            if (nested) return nested;
        }
        return null;
    };
    const carouselItem = walk(VIP_CAROUSEL_DATA.flatMap(panel => panel.items || []));
    if (carouselItem) return carouselItem;
    for (const pack of VIP_PACKAGES_DATA) {
        const direct = walk(pack.items);
        if (direct) return direct;
    }
    return null;
}

function renderVIPPanelItem(item, owned) {
    return `
        <article class="vip-mini-item vip-panel-card ${owned ? 'owned' : ''}" onclick="openVIPPanelModal('${item.id || item.name}')">
            <div class="vip-mini-image vip-panel-cover">
                <img src="${item.image}" alt="" draggable="false">
            </div>
            <div class="vip-mini-type">${item.label || 'PANEL'}</div>
            <h3>${item.name}</h3>
            <button onclick="event.stopPropagation(); openVIPPanelModal('${item.id || item.name}')" type="button">${owned ? 'VER' : 'ABRIR'}</button>
        </article>
    `;
}

function openVIPPanelModal(id) {
    const item = findVIPItemById(id);
    if (!item || item.type !== 'vipPanel') return;
    const rows = (item.items || []).map(part => {
        if (part.type === 'bundle') {
            const owned = localStorage.getItem(getVIPItemStorageKey(part)) === 'true';
            return `
                <div class="vip-panel-modal-item vip-panel-modal-bundle">
                    <div class="shop-modal-bundle-grid">${(part.items || []).map(piece => `
                        <div>
                            <img src="${piece.image}" alt="" draggable="false">
                            <span>${piece.name}</span>
                        </div>
                    `).join('')}</div>
                    <strong>${part.name}</strong>
                    <button onclick="openVIPBundleModal('${part.id || part.name}')" type="button">${owned ? 'VER' : `ABRIR ${renderPrice(part.price, 'gems')}`}</button>
                </div>
            `;
        }
        const owned = localStorage.getItem(getVIPItemStorageKey(part)) === 'true';
        const isSkinItem = part.type === 'vipSkin' || part.type === 'skin';
        return `
            <div class="vip-panel-modal-item">
                <div class="${isSkinItem ? 'vip-skin-orb' : 'vip-mini-image'}">
                    <img src="${part.image}" alt="" draggable="false">
                </div>
                <strong>${part.name}</strong>
                <button onclick="buyVIPMiniItemById('${part.id || part.trailId || part.name}')" ${owned ? 'disabled' : ''} type="button">${owned ? 'OBTENIDO' : `COMPRAR ${renderPrice(part.price, 'gems')}`}</button>
            </div>
        `;
    }).join('');

    showShopModal({
        kicker: item.label || 'PANEL VIP',
        title: item.name,
        mediaHTML: `<div class="vip-panel-modal-grid">${rows}</div>`,
        mediaClass: 'vip-panel-wide',
        cardClass: 'shop-modal-card-wide',
        background: item.popupBackground,
        body: 'Contenido disponible para compra individual.',
        cancelText: 'CERRAR',
        confirmText: null
    });
}

window.openVIPPanelModal = openVIPPanelModal;

function openEmojiPackModal(id) {
    const item = findVIPItemById(id);
    if (!item || item.type !== 'emojiPack') return;
    const owned = localStorage.getItem(getVIPItemStorageKey(item)) === 'true';
    showShopModal({
        kicker: 'PAQUETE DE EMOJIS',
        title: item.name,
        mediaHTML: `<div class="shop-modal-emoji-grid emoji-pack-modal-grid">
            ${(item.items || []).map(part => `
                <div>
                    <img src="${part.image}" alt="" draggable="false">
                    <strong>${part.name}</strong>
                </div>
            `).join('')}
        </div>`,
        mediaClass: 'wide',
        background: item.popupBackground || getVIPPackageForItem(item)?.popupBackground,
        body: owned ? 'Ya tienes este paquete desbloqueado.' : `Incluye ${item.items?.length || 6} emojis. Comprar por ${item.price} rubies?`,
        cancelText: owned ? 'CERRAR' : 'NO',
        confirmText: owned ? null : 'COMPRAR',
        onConfirm: () => {
            if (!canAfford(item.price, 'gems')) return alert('No tienes suficientes rubies.');
            spendCurrency(item.price, 'gems');
            window.playSfx?.('vipBuy');
            grantVIPItem(item);
            if (typeof currentVIPDetailRenderer === 'function') currentVIPDetailRenderer();
            updateMenuHUD();
        }
    });
}

window.openEmojiPackModal = openEmojiPackModal;

function renderVIPBundleItem(item, owned) {
    const previews = item.items.map(part => `
        <div class="vip-bundle-part">
            <img src="${part.image}" alt="" draggable="false">
            <span>${part.type.toUpperCase()}</span>
        </div>
    `).join('');
    return `
        <article class="vip-mini-item vip-bundle-card ${owned ? 'owned' : ''}" onclick="openVIPBundleModal('${item.id || item.name}')">
            <div class="vip-bundle-preview">${previews}</div>
            <div class="vip-mini-type">BUNDLE</div>
            <h3>${item.name}</h3>
            <button onclick="event.stopPropagation(); openVIPBundleModal('${item.id || item.name}')" type="button">${owned ? 'VER' : 'ABRIR'}</button>
        </article>
    `;
}

function openVIPBundleModal(id) {
    const item = findVIPItemById(id);
    if (!item || item.type !== 'bundle') return;
    const owned = localStorage.getItem(getVIPItemStorageKey(item)) === 'true';
    const rows = (item.items || []).map(part => {
        const isSkinItem = part.type === 'vipSkin' || part.type === 'skin';
        return `
            <div class="vip-panel-modal-item">
                <div class="${isSkinItem ? 'vip-skin-orb' : 'vip-mini-image'}">
                    <img src="${part.image}" alt="" draggable="false">
                </div>
                <strong>${part.name}</strong>
            </div>
        `;
    }).join('');
    showShopModal({
        kicker: 'BUNDLE VIP',
        title: item.name,
        mediaHTML: `<div class="vip-panel-modal-grid">${rows}</div>`,
        mediaClass: 'vip-panel-wide',
        cardClass: 'shop-modal-card-wide',
        background: item.popupBackground || getVIPPackageForItem(item)?.popupBackground,
        body: owned ? 'Ya tienes este bundle desbloqueado.' : `Incluye ${item.items?.length || 2} piezas. Comprar por ${item.price} rubies?`,
        cancelText: owned ? 'CERRAR' : 'NO',
        confirmText: owned ? null : 'COMPRAR',
        onConfirm: () => {
            if (!canAfford(item.price, 'gems')) return alert('No tienes suficientes rubies.');
            spendCurrency(item.price, 'gems');
            window.playSfx?.('vipBuy');
            grantVIPItem(item);
            if (typeof currentVIPDetailRenderer === 'function') currentVIPDetailRenderer();
            updateMenuHUD();
        }
    });
}

window.openVIPBundleModal = openVIPBundleModal;

function renderElementTrailItem(item, owned) {
    return `
        <article class="vip-mini-item vip-element-card ${owned ? 'owned' : ''}">
            <div class="vip-simple-panel">
                <img src="${item.image}" alt="" draggable="false">
            </div>
            <div class="vip-mini-type">TRAIL</div>
            <h3>${item.label}</h3>
            <canvas id="vip-trail-canvas-${item.trailId}" width="220" height="90" class="vip-trail-preview"></canvas>
            <button onclick="buyVIPMiniItemById('${item.trailId}')" ${owned ? 'disabled' : ''} type="button">${owned ? 'OBTENIDO' : `COMPRAR ${renderPrice(item.price, 'gems')}`}</button>
        </article>
    `;
}

function renderVIPPngTrailItem(item, owned) {
    const isSkinItem = item.type === 'vipSkin' || item.type === 'skin';
    const isTrailPreview = item.type === 'vipTrailPng' && item.trailId;
    return `
        <article class="vip-mini-item ${owned ? 'owned' : ''}">
            ${isTrailPreview ? `<canvas id="vip-trail-canvas-${item.trailId}" width="220" height="90" class="vip-trail-preview"></canvas>` : `<div class="vip-skin-orb">
    <img src="${item.image}" alt="" draggable="false">
</div>`}
            <div class="vip-mini-type">TRAIL</div>
            <h3>${item.name}</h3>
            <button onclick="buyVIPMiniItemById('${item.id || item.trailId}')" ${owned ? 'disabled' : ''} type="button">${owned ? 'OBTENIDO' : `COMPRAR ${renderPrice(item.price, 'gems')}`}</button>
        </article>
    `;
}

function renderCustomTextTrailItem(item, owned) {
    const saved = localStorage.getItem('customTrailText') || '';
    return `
        <article class="vip-mini-item vip-custom-trail-card ${owned ? 'owned' : ''}">
            <div class="vip-mini-type">TRAIL PERSONALIZABLE</div>
            <h3>${item.name}</h3>
            <canvas id="custom-text-trail-canvas" width="360" height="110" class="vip-custom-trail-preview"></canvas>
            <input id="customTrailPhrase" class="vip-custom-trail-input" maxlength="18" value="${escapeHtml(saved)}" placeholder="Pon tu frase aqui" oninput="validateCustomTrailInput(this); startCustomTextTrailPreview('custom-text-trail-canvas','customTrailPhrase')" />
            <div id="customTrailValidation" class="vip-custom-trail-validation">Maximo 18 caracteres.</div>
            <button onclick="buyCustomTextTrail()" ${owned ? '' : ''} type="button">${owned ? 'ACTUALIZAR Y EQUIPAR' : `COMPRAR ${renderPrice(item.price, 'gems')}`}</button>
        </article>
    `;
}

function renderEmojiPackItem(item, owned) {
    return `
        <article class="vip-mini-item vip-emoji-pack ${owned ? 'owned' : ''}">
            <div class="vip-mini-image vip-pack-poster" onclick="openEmojiPackModal('${item.id || item.name}')">
                <img src="${item.image}" alt="" draggable="false">
            </div>
            <div class="vip-mini-type">PANEL 2</div>
            <h3>${item.name}</h3>
            <button onclick="openEmojiPackModal('${item.id || item.name}')" type="button">${owned ? 'VER EMOJIS' : `VER ${renderPrice(item.price, 'gems')}`}</button>
        </article>
    `;
}

function renderEmojiItem(item, owned) {
    const isSkinItem = item.type === 'vipSkin' || item.type === 'skin';
    const equipped = item.type === 'emoji' && localStorage.getItem('equippedEmote') === item.id;
    const action = item.type === 'emoji' && owned
        ? `<button onclick="equipEmote('${item.id}')" ${equipped ? 'disabled' : ''} type="button">${equipped ? 'ACTIVO' : 'EQUIPAR'}</button>`
        : `<button onclick="buyVIPMiniItemById('${item.id}')" ${owned ? 'disabled' : ''} type="button">${owned ? 'OBTENIDO' : `COMPRAR ${renderPrice(item.price, 'gems')}`}</button>`;
    return `
        <article class="vip-mini-item ${owned ? 'owned' : ''}">
            <div class="${isSkinItem ? 'vip-skin-orb' : 'vip-emoji-orb'}">
                <img src="${item.image}" alt="" draggable="false">
            </div>
            <div class="vip-mini-type">EMOJI</div>
            <h3>${item.name}</h3>
            ${action}
        </article>
    `;
}

function escapeHtml(value) {
    return String(value || '').replace(/[&<>"']/g, char => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    }[char]));
}

function buyVIPCollection(kind, data) {
    showShopModal({
        kicker: kind === 'carousel' ? 'PANEL VIP' : 'PAQUETE VIP',
        title: data.title,
        image: data.cover,
        background: data.popupBackground || data.detailBackground || data.cover,
        body: `Seguro comprar por ${data.price} rubies?`,
        confirmText: 'SI',
        cancelText: 'NO',
        onConfirm: () => {
            if (!canAfford(data.price, 'gems')) return alert('No tienes suficientes rubies.');
            spendCurrency(data.price, 'gems');
            window.playSfx?.('vipBuy');
            localStorage.setItem(`vip_${kind}_${data.id}`, 'true');
            data.items.forEach(item => grantVIPItem(item));
            if (typeof currentVIPDetailRenderer === 'function') currentVIPDetailRenderer();
            else renderVIPHome();
            updateMenuHUD();
        }
    });
}

function buyVIPMiniItem(name, image, price) {
    showShopModal({
        kicker: 'MINI-ITEM VIP',
        title: name,
        image,
        body: `Seguro comprar por ${price} rubies?`,
        confirmText: 'SI',
        cancelText: 'NO',
        onConfirm: () => {
            if (!canAfford(price, 'gems')) return alert('No tienes suficientes rubies.');
            spendCurrency(price, 'gems');
            window.playSfx?.('vipBuy');
            grantVIPItem({ name, image });
            if (typeof currentVIPDetailRenderer === 'function') currentVIPDetailRenderer();
            else renderVIPHome();
            updateMenuHUD();
        }
    });
}

function buyVIPMiniItemById(id) {
    const item = findVIPItemById(id);
    if (!item) return;
    if (item.type === 'customTextTrail') return buyCustomTextTrail();

    const key = getVIPItemStorageKey(item);
    const owned = localStorage.getItem(key) === 'true';
    const mediaHTML = item.type === 'bundle'
        ? `<div class="shop-modal-bundle-grid">${item.items.map(part => `
            <div>
                <img src="${part.image}" alt="" draggable="false">
                <span>${part.name}</span>
            </div>
        `).join('')}</div>`
        : item.type === 'emojiPack'
            ? `<div class="shop-modal-emoji-grid emoji-pack-modal-grid">${(item.items || []).map(part => `
                <div><img src="${part.image}" alt="" draggable="false"><strong>${part.name}</strong></div>
            `).join('')}</div>`
            : item.type === 'elementTrail'
                ? `<canvas id="modal-vip-trail-${item.trailId}" width="260" height="110" class="vip-trail-preview"></canvas>`
                : null;

    showShopModal({
        kicker: item.type === 'bundle' ? 'BUNDLE VIP' : item.type === 'elementTrail' ? 'TRAIL VIP' : item.type === 'emojiPack' ? 'EMOJIS VIP' : 'MINI-ITEM VIP',
        title: item.name || item.label,
        image: mediaHTML ? null : item.image,
        mediaHTML,
        mediaClass: mediaHTML ? 'wide' : '',
        background: item.popupBackground || getVIPPackageForItem(item)?.popupBackground,
        body: owned ? 'Ya lo tienes desbloqueado.' : `Seguro comprar por ${item.price} rubies?`,
        confirmText: owned ? null : 'SI',
        cancelText: owned ? 'CERRAR' : 'NO',
        onConfirm: () => {
            if (!canAfford(item.price, 'gems')) return alert('No tienes suficientes rubies.');
            spendCurrency(item.price, 'gems');
            window.playSfx?.('vipBuy');
            grantVIPItem(item);
            if (typeof currentVIPDetailRenderer === 'function') currentVIPDetailRenderer();
            else renderVIPHome();
            updateMenuHUD();
        }
    });

    if (item.type === 'elementTrail') {
        setTimeout(() => startVIPTrailCanvas(item.trailId, item.previewColor || 'cyan', `modal-vip-trail-${item.trailId}`), 20);
    }
}

function grantVIPItem(item) {
    localStorage.setItem(getVIPItemStorageKey(item), 'true');
    if (item.type === 'vipPanel' && Array.isArray(item.items)) {
        item.items.forEach(part => grantVIPItem(part));
        return;
    }
    if (item.type === 'bundle' && Array.isArray(item.items)) {
        item.items.forEach(part => grantVIPItem(part));
        return;
    }
    if (item.type === 'vipSkin' || item.type === 'skin') {
        localStorage.setItem(item.id || `skin_${item.name.toLowerCase().replaceAll(' ', '_')}`, 'true');
        window.SKINS_DATA = getAllShopSkins();
        if (typeof checkFoodCollectionProgress === 'function') checkFoodCollectionProgress();
    } else if (item.type === 'emoji') {
        const emoteId = item.id || `emoji_${item.name.toLowerCase().replaceAll(' ', '_')}`;
        localStorage.setItem(emoteId, 'true');
        localStorage.setItem('emote_' + emoteId, 'true');
        localStorage.setItem('equippedEmote', emoteId);
    } else if (item.type === 'emojiPack') {
        (item.items || []).forEach(part => {
            localStorage.setItem(part.id, 'true');
            localStorage.setItem('emote_' + part.id, 'true');
        });
        const first = item.items?.[0]?.id;
        if (first) localStorage.setItem('equippedEmote', first);
    } else if (item.type === 'vipTrailPng') {
        const trailId = item.trailId || item.id;
        localStorage.setItem(`trail_${trailId}_png`, 'true');
    } else if (item.trailId || item.id?.startsWith('trail_')) {
        const trailId = item.trailId || item.id;
        const defaultColor = item.previewColor || 'cyan';
        localStorage.setItem(`trail_${trailId}_${defaultColor}`, 'true');
        localStorage.setItem('equippedTrail', `${trailId}_${defaultColor}`);
        if (typeof bannerTrail !== 'undefined') bannerTrail = [];
    }
}

function getVIPPackageForItem(item) {
    return VIP_PACKAGES_DATA.find(pack => pack.items.includes(item) || pack.items.some(candidate => candidate.name === item?.name || candidate.id === item?.id));
}

function openInventory() {
    window.playSfx?.('menuSelect', 0.6);
    if (trailAnimId) {
        cancelAnimationFrame(trailAnimId);
        trailAnimId = null;
    }
    if (previewTrailAnim) {
        cancelAnimationFrame(previewTrailAnim);
        previewTrailAnim = null;
    }
    const panel = document.getElementById('inventoryPanel');
    panel.style.display = 'flex';
    panel.classList.remove('entering', 'leaving');
    void panel.offsetWidth;
    panel.classList.add('entering');

    const overlay = document.getElementById('overlay');
    if (overlay) {
        overlay.classList.remove('exit-shop', 'enter-shop', 'exit-inventory', 'enter-inventory', 'exit-play', 'enter-play');
        void overlay.offsetWidth;
        overlay.classList.add('exit-inventory');
    }

    setTimeout(() => {
        if (overlay && panel.style.display === 'flex') {
            overlay.style.display = 'none';
            overlay.classList.remove('exit-inventory');
        }
    }, 450);

    invActiveRarityFilter = { skins: 'TODAS', trails: 'TODAS', banners: 'TODAS', emotes: 'TODAS', powerups: 'TODAS' };
    showInventorySection('skins');
}

function closeInventory() {
    Object.keys(invTrailAnims || {}).forEach(key => {
        if (invTrailAnims[key]) cancelAnimationFrame(invTrailAnims[key]);
        invTrailAnims[key] = null;
    });
    const panel = document.getElementById('inventoryPanel');
    panel.classList.remove('entering');
    panel.classList.add('leaving');

    const overlay = document.getElementById('overlay');
    if (overlay) {
        overlay.style.display = 'flex';
        overlay.classList.remove('exit-inventory', 'enter-inventory');
        void overlay.offsetWidth;
        overlay.classList.add('enter-inventory');
    }

    setTimeout(() => {
        panel.style.display = 'none';
        panel.classList.remove('leaving');
        if (overlay) {
            overlay.classList.remove('enter-inventory');
        }
    }, 400);
}

// Orden y color de rareza para los chips de filtro del inventario
const INV_RARITY_ORDER = ['DEFAULT', 'BASICO', 'ESPECIAL', 'EPICA', 'DEMON', 'VIP', 'LEGENDARIO', 'EXCLUSIVO'];

let invActiveRarityFilter = { skins: 'TODAS', trails: 'TODAS', banners: 'TODAS', emotes: 'TODAS', powerups: 'TODAS' };
const INV_BANNER_RARITY_ORDER = ['DEFAULT', 'BASICO', 'ESPECIAL', 'EPICA', 'DEMON', 'VIP', 'LEGENDARIO', 'EXCLUSIVO'];

function invGetSkinsProgress() {
    const owned = getAllShopSkins().filter(s => isSkinOwned(s) && !s.soon);
    const total = getAllShopSkins().filter(s => !s.soon);
    return { owned: owned.length, total: total.length };
}

function invGetTrailsProgress() {
    let owned = 0;
    const total = TRAILS_DATA.length * TRAIL_COLOR_LIST.length;
    TRAILS_DATA.forEach(t => {
        TRAIL_COLOR_LIST.forEach(c => {
            if (localStorage.getItem(`trail_${t.id}_${c.id}`) === 'true') owned++;
        });
    });
    return { owned, total };
}

function invGetBannersProgress() {
    const all = getAllBannerCatalog();
    const owned = all.filter(ownsBanner);
    return { owned: owned.length, total: all.length };
}

function invGetEmotesProgress() {
    const owned = EMOTES_DATA.filter(isEmoteOwned);
    return { owned: owned.length, total: EMOTES_DATA.length };
}

function renderInventoryHero(section) {
    const equippedId = localStorage.getItem('equippedSkin') || 'cyan';
    const equippedSkin = getAllShopSkins().find(s => s.id === equippedId) || getAllShopSkins()[0];
    const isTrophy = TROPHY_IDS.includes(equippedSkin.id);
    const rarityColor = isTrophy ? '#8a2be2' : (RARITY_COLORS[equippedSkin.rarity] || '#aaa');
    const previewImage = equippedSkin.image || equippedSkin.imageRight || equippedSkin.imageLeft;

    const skinsP = invGetSkinsProgress();
    const trailsP = invGetTrailsProgress();
    const bannersP = invGetBannersProgress();
    const emotesP = invGetEmotesProgress();

    const totalOwned = skinsP.owned + trailsP.owned + bannersP.owned + emotesP.owned;
    const totalAll = skinsP.total + trailsP.total + bannersP.total + emotesP.total;
    const totalPct = totalAll ? Math.round((totalOwned / totalAll) * 100) : 0;
    const skinsPct = skinsP.total ? Math.round((skinsP.owned / skinsP.total) * 100) : 0;
    const trailsPct = trailsP.total ? Math.round((trailsP.owned / trailsP.total) * 100) : 0;

    const h = shopTextos('inventario').hero || {};

    return `
        <div class="inv-equip-stage" style="--inv-rarity-color:${rarityColor};">
            <div class="inv-ring"></div>
            <div class="inv-ring inv-r2"></div>
            <div class="inv-equip-core">
                ${previewImage ? `<img src="${previewImage}" alt="">` : (equippedSkin.emoji || '⬤')}
            </div>
        </div>
        <div class="inv-equip-info">
            <div class="inv-equip-label" id="inv-equip-label">${h.labelEquipada ?? 'SKIN EQUIPADA'}</div>
            <div class="inv-equip-name">${equippedSkin.name}</div>
            <div class="inv-equip-rarity${gemRarityClass(isTrophy ? 'LEGENDARIO' : equippedSkin.rarity)}" id="inv-equip-rarity" style="--inv-rarity-color:${rarityColor};">★ ${isTrophy ? (h.labelLegendario ?? 'LEGENDARIO') : equippedSkin.rarity}</div>
        </div>
        <div class="inv-hero-progress">
            <div class="inv-p-item">
                <div class="inv-p-num" id="inv-p-num-skins">${skinsP.owned}/${skinsP.total}</div><div class="inv-p-lbl" id="inv-p-lbl-skins">${h.labelSkins ?? 'SKINS'}</div>
                <div class="inv-p-bar-track"><div class="inv-p-bar-fill" style="width:${skinsPct}%; background:linear-gradient(90deg,#0891b2,#22d3ee);"></div></div>
            </div>
            <div class="inv-p-item">
                <div class="inv-p-num" id="inv-p-num-trails">${trailsP.owned}/${trailsP.total}</div><div class="inv-p-lbl" id="inv-p-lbl-trails">${h.labelTrails ?? 'TRAILS'}</div>
                <div class="inv-p-bar-track"><div class="inv-p-bar-fill" style="width:${trailsPct}%; background:linear-gradient(90deg,#a16207,#eab308);"></div></div>
            </div>
            <div class="inv-p-item">
                <div class="inv-p-num" id="inv-p-num-total">${totalPct}%</div><div class="inv-p-lbl" id="inv-p-lbl-total">${h.labelTotal ?? 'TOTAL'}</div>
                <div class="inv-p-bar-track"><div class="inv-p-bar-fill" style="width:${totalPct}%; background:linear-gradient(90deg,#6d28d9,#a78bfa);"></div></div>
            </div>
        </div>
    `;
}

function renderInventorySkinCard(s, equipped) {
    const isEquipped = equipped === s.id;
    const isTrophy = TROPHY_IDS.includes(s.id);
    const rarityColor = isTrophy ? '#8a2be2' : (RARITY_COLORS[s.rarity] || '#aaa');
    const previewImage = s.image || s.imageRight || s.imageLeft;
    const inv = shopTextos('inventario');
    const sk = inv.skins || {};
    const tooltip = isEquipped ? (sk.tooltipEquipada ?? 'Equipada') : (sk.tooltipClickEquipar ?? 'Click para equipar');
    const legendario = inv.hero?.labelLegendario ?? 'LEGENDARIO';
    return `
        <div class="inv-item-card ${isEquipped ? 'inv-equipped' : ''}" style="--inv-card-color:${rarityColor};" onclick="equipSkin('${s.id}')" title="${tooltip}">
            ${isEquipped ? `<div class="inv-item-check">✓</div>` : ''}
            <div class="inv-item-icon">
                ${previewImage ? `<img src="${previewImage}" alt="" draggable="false">` : (s.emoji || `<div style="width:22px;height:22px;border-radius:50%;background:${s.color};"></div>`)}
            </div>
            <div class="inv-item-name">${s.name}</div>
            <div class="inv-item-rarity${gemRarityClass(isTrophy ? 'LEGENDARIO' : s.rarity)}">${isTrophy ? legendario : s.rarity}</div>
        </div>
    `;
}

function renderInventoryBannerCard(b, equipped) {
    const isEquipped = isBannerEquipped(b, equipped);
    const isVIP = b.rarity === 'VIP';
    const rarityColor = BANNER_RARITY_COLORS[b.rarity] || 'rgba(255,255,255,0.4)';
    const cover = b.cover ? `url('${b.cover}')` : 'linear-gradient(135deg, rgba(0,255,231,0.18), rgba(255,77,109,0.14))';
    const bn = shopTextos('inventario').banners || {};
    const f = shopTextos('inventario').filtros || {};
    const tooltip = isEquipped ? (bn.tooltipEquipado ?? 'Equipado') : (bn.tooltipClickEquipar ?? 'Click para equipar');
    const vipLabel = shopTextos('banners').labelVipPaseRuby ?? 'VIP / PASE RUBY';
    const rarityLabel = b.rarity === 'VIP' ? vipLabel : (b.rarity === 'BASICO' ? (f.chipBasico ?? 'BASICO') : b.rarity);
    return `
        <div class="inv-banner-card ${isEquipped ? 'inv-equipped' : ''}" style="--inv-card-color:${rarityColor};" onclick="equipBanner('${b.id}'); showInventorySection('banners');" title="${tooltip}">
            ${isEquipped ? `<div class="inv-item-check">✓</div>` : ''}
            <div class="inv-banner-cover" style="background-image:${cover};"></div>
            <div class="inv-banner-name">${b.name}</div>
            <div class="inv-item-rarity${gemRarityClass(b.rarity)}">${rarityLabel}</div>
        </div>
    `;
}

function renderInventoryEmoteCard(e, equipped) {
    const isEquipped = equipped === e.id;
    const rarityColor = RARITY_COLORS[e.rarity] || '#aaa';
    const em = shopTextos('inventario').emotes || {};
    const tooltip = isEquipped ? (em.tooltipEquipado ?? 'Equipado') : (em.tooltipClickEquipar ?? 'Click para equipar');
    return `
        <div class="inv-item-card ${isEquipped ? 'inv-equipped' : ''}" style="--inv-card-color:${rarityColor};" onclick="equipEmote('${e.id}'); showInventorySection('emotes');" title="${tooltip}">
            ${isEquipped ? `<div class="inv-item-check">✓</div>` : ''}
            <div class="inv-item-icon">
                ${e.image ? `<img src="${e.image}" alt="" draggable="false">` : '😀'}
            </div>
            <div class="inv-item-name">${e.name}</div>
            <div class="inv-item-rarity${gemRarityClass(e.rarity)}">${e.rarity}</div>
        </div>
    `;
}

// Colores por categoría de potenciador (no tienen rareza, se agrupan por tipo)
const POWERUP_CATEGORY_COLORS = {
    defensivo: '#4bc0eb',
    control: '#ff9a17',
    utilidad: '#eab308',
    riesgo: '#cf0000'
};

function invRenderPowerupFilters(types) {
    const filtersEl = document.getElementById('inv-filters');
    if (!filtersEl) return;
    const f = shopTextos('inventario').filtros || {};
    const chips = ['TODAS', ...types];
    filtersEl.innerHTML = chips.map(t => {
        const color = t === 'TODAS' ? '#22d3ee' : (POWERUP_CATEGORY_COLORS[t] || '#22d3ee');
        const active = invActiveRarityFilter.powerups === t;
        const label = t === 'TODAS' ? (f.chipTodas ?? 'TODAS') : (POWERUP_CATEGORY_LABELS[t] || t).toUpperCase();
        return `<div class="inv-chip ${active ? 'active' : ''}" style="--inv-chip-color:${color};" onclick="invSetRarityFilter('powerups','${t}')">${label}</div>`;
    }).join('');
}

function invRenderRarityFilters(section, rarities, colorMap = RARITY_COLORS) {
    const filtersEl = document.getElementById('inv-filters');
    if (!filtersEl) return;
    const f = shopTextos('inventario').filtros || {};
    const chips = ['TODAS', ...rarities];
    filtersEl.innerHTML = chips.map(r => {
        const color = r === 'TODAS' ? '#22d3ee' : (colorMap[r] || '#22d3ee');
        const active = invActiveRarityFilter[section] === r;
        const label = r === 'TODAS' ? (f.chipTodas ?? 'TODAS') : r === 'BASICO' ? (f.chipBasico ?? 'BASICO') : r;
        return `<div class="inv-chip ${active ? 'active' : ''}" style="--inv-chip-color:${color};" onclick="invSetRarityFilter('${section}','${r}')">${label}</div>`;
    }).join('');
}

function invSetRarityFilter(section, rarity) {
    invActiveRarityFilter[section] = rarity;
    showInventorySection(section);
}

function showInventorySection(section) {
    ['skins', 'trails', 'banners', 'emotes', 'powerups', 'cofres'].forEach(s => {
        const el = document.getElementById('inv-nav-' + s);
        if (!el) return;
        el.classList.toggle('active', s === section);
    });

    const gemsEl = document.getElementById('inv-gems-value');
    if (gemsEl) gemsEl.textContent = parseInt(localStorage.getItem('gems') || '0');

    const keysEl = document.getElementById('inv-keys-value');
    if (keysEl) keysEl.textContent = window.infiniteCoinsMode ? '∞' : (window.getCaronteKeys ? window.getCaronteKeys() : 0);

    const heroEl = document.getElementById('inv-hero');
    if (heroEl) heroEl.innerHTML = renderInventoryHero(section);
    // El hero se regenera cada vez (nuevo HTML => nuevos ids), así que hay que
    // volver a aplicar color/tamaño de GEM_CONFIG.estilosTexto sobre los ids nuevos.
    if (window.aplicarEstilosTexto) window.aplicarEstilosTexto();

    const titleEl = document.getElementById('inv-section-title');
    const filtersEl = document.getElementById('inv-filters');

    const content = document.getElementById('inventoryContent');

    if (section === 'skins') {
        const equipped = localStorage.getItem('equippedSkin') || 'cyan';
        let owned = getAllShopSkins().filter(s => isSkinOwned(s) && !s.soon);
        const availableRarities = INV_RARITY_ORDER.filter(r => owned.some(s => s.rarity === r));
        invRenderRarityFilters('skins', availableRarities);
        if (invActiveRarityFilter.skins !== 'TODAS') {
            owned = owned.filter(s => s.rarity === invActiveRarityFilter.skins);
        }
        if (titleEl) titleEl.textContent = (shopTextos('inventario').titulos?.skinsTemplate ?? 'SKINS OBTENIDAS — {n}').replace('{n}', owned.length);
        content.innerHTML = `
            <div class="inv-grid">
                ${owned.map(s => renderInventorySkinCard(s, equipped)).join('')}
            </div>
        `;
    } else if (section === 'trails') {
        const equippedTrail = localStorage.getItem('equippedTrail') || 'basic_cyan';

        // Agrupar por efecto
        const ownedByEffect = {};
        TRAILS_DATA.forEach(t => {
            TRAIL_COLOR_LIST.forEach(c => {
                if (localStorage.getItem(`trail_${t.id}_${c.id}`) === 'true') {
                    if (!ownedByEffect[t.id]) ownedByEffect[t.id] = { trail: t, colors: [] };
                    ownedByEffect[t.id].colors.push(c);
                }
            });
        });

        let groups = Object.values(ownedByEffect);

        const availableRarities = INV_RARITY_ORDER.filter(r => groups.some(g => g.trail.rarity === r));
        invRenderRarityFilters('trails', availableRarities);
        if (invActiveRarityFilter.trails !== 'TODAS') {
            groups = groups.filter(g => g.trail.rarity === invActiveRarityFilter.trails);
        }

        if (titleEl) titleEl.textContent = (shopTextos('inventario').titulos?.trailsTemplate ?? 'TRAILS OBTENIDOS — {n} EFECTOS').replace('{n}', groups.length);

        const tr = shopTextos('inventario').trails || {};

        if (groups.length === 0) {
            const emptyMsg = tr.emptyState ?? 'NO TIENES TRAILS{br}EN ESTA CATEGORÍA';
            content.innerHTML = `<div class="inv-empty-state" id="inv-empty-trails">${emptyMsg.replace('{br}', '<br>')}</div>`;
            if (window.aplicarEstilosTexto) window.aplicarEstilosTexto();
            return;
        }

        content.innerHTML = `
            <div class="inv-grid inv-trail-grid">
                ${groups.map(({ trail: t, colors }) => {
            const allOwned = TRAIL_COLOR_LIST.every(c => localStorage.getItem(`trail_${t.id}_${c.id}`) === 'true');
            const equippedColor = colors.find(c => equippedTrail === `${t.id}_${c.id}`);
            return `
                    <div class="inv-trail-wrap">
                        <div id="inv-trail-card-${t.id}" class="inv-trail-card ${equippedColor ? 'inv-equipped' : ''}"
                            style="--inv-card-color:${t.rarityColor};"
                            onclick="toggleInvTrailExpand('${t.id}')">
                            <canvas id="inv-trail-canvas-${t.id}" class="inv-trail-canvas" width="200" height="60"></canvas>
                            <div class="inv-trail-head">
                                <div>
                                    <div class="inv-trail-name">${t.name}</div>
                                    <div class="inv-trail-rarity${gemRarityClass(t.rarity)}" style="color:${t.rarityColor};">${t.rarity}</div>
                                </div>
                                <div class="inv-trail-status">
                                    ${allOwned ? `<span class="inv-trail-complete">${tr.labelCompleto ?? '★ COMPLETO'}</span>` : `<span class="inv-trail-count">${colors.length}/${TRAIL_COLOR_LIST.length}</span>`}
                                    <span class="inv-trail-arrow" id="inv-trail-arrow-${t.id}">▼</span>
                                </div>
                            </div>
                            ${equippedColor ? `<div class="inv-trail-equipped-tag">${tr.labelEquipadoPrefix ?? '✔ EQUIPADO · '}${equippedColor.id.toUpperCase()}</div>` : ''}
                        </div>
                        <div id="inv-trail-expand-${t.id}" class="inv-trail-expand">
                            <div class="inv-trail-swatches">
                                ${TRAIL_COLOR_LIST.map(c => {
                const has = localStorage.getItem(`trail_${t.id}_${c.id}`) === 'true';
                const isEq = equippedTrail === `${t.id}_${c.id}`;
                return `<div class="inv-trail-swatch ${isEq ? 'inv-eq' : has ? 'inv-has' : 'inv-locked'}"
                                        onclick="${has ? `event.stopPropagation();invEquipTrailColor('${t.id}','${c.id}')` : 'event.stopPropagation();'}"
                                        style="background:${c.color};"
                                        title="${c.id}${isEq ? ' (equipado)' : !has ? ' (no tienes)' : ''}">
                                        ${isEq ? `<span>✔</span>` : ''}
                                    </div>`;
            }).join('')}
                            </div>
                        </div>
                    </div>`;
        }).join('')}
            </div>
        `;

        // Iniciar canvas animados
        setTimeout(() => {
            groups.forEach(({ trail: t, colors }) => {
                const equippedColor = colors.find(c => equippedTrail === `${t.id}_${c.id}`) || colors[0];
                startInvTrailCanvas(t.id, equippedColor.id);
            });
        }, 30);


    } else if (section === 'banners') {
        const equipped = localStorage.getItem('equippedBanner') || 'Banner_Deafult';
        let owned = getAllBannerCatalog().filter(ownsBanner);

        const availableRarities = INV_BANNER_RARITY_ORDER.filter(r => owned.some(b => b.rarity === r));
        invRenderRarityFilters('banners', availableRarities, BANNER_RARITY_COLORS);
        if (invActiveRarityFilter.banners !== 'TODAS') {
            owned = owned.filter(b => b.rarity === invActiveRarityFilter.banners);
        }

        if (titleEl) titleEl.textContent = (shopTextos('inventario').titulos?.bannersTemplate ?? 'BANNERS OBTENIDOS — {n}').replace('{n}', owned.length);

        content.innerHTML = `
            ${renderInventoryProfileBanner(equipped)}
            <div class="inv-grid inv-banner-grid">
                ${owned.map(b => renderInventoryBannerCard(b, equipped)).join('')}
            </div>
        `;
        if (window.aplicarEstilosTexto) window.aplicarEstilosTexto();
    } else if (section === 'emotes') {
        const equipped = localStorage.getItem('equippedEmote');
        let owned = EMOTES_DATA.filter(isEmoteOwned);

        const availableRarities = INV_RARITY_ORDER.filter(r => owned.some(e => e.rarity === r));
        invRenderRarityFilters('emotes', availableRarities);
        if (invActiveRarityFilter.emotes !== 'TODAS') {
            owned = owned.filter(e => e.rarity === invActiveRarityFilter.emotes);
        }

        if (titleEl) titleEl.textContent = (shopTextos('inventario').titulos?.emotesTemplate ?? 'EMOTES OBTENIDOS — {n}').replace('{n}', owned.length);

        if (owned.length === 0) {
            const emptyMsg = shopTextos('inventario').emotes?.emptyState ?? 'NO TIENES EMOTES{br}EN ESTA CATEGORÍA';
            content.innerHTML = `<div class="inv-empty-state" id="inv-empty-emotes">${emptyMsg.replace('{br}', '<br>')}</div>`;
            if (window.aplicarEstilosTexto) window.aplicarEstilosTexto();
            return;
        }

        content.innerHTML = `
            <div class="inv-grid">
                ${owned.map(e => renderInventoryEmoteCard(e, equipped)).join('')}
            </div>
        `;
    } else if (section === 'powerups') {
        const pw = shopTextos('inventario').powerups || {};
        if (!window.POWERUPS_DATA || !window.readPowerups) {
            if (titleEl) titleEl.textContent = '';
            if (filtersEl) filtersEl.innerHTML = '';
            const unavailMsg = pw.unavailable ?? 'POTENCIADORES{br}NO DISPONIBLES';
            content.innerHTML = `<div class="inv-empty-state" id="inv-powerups-unavailable">${unavailMsg.replace('{br}', '<br>')}</div>`;
            if (window.aplicarEstilosTexto) window.aplicarEstilosTexto();
            return;
        }
        const inventory = window.readPowerups();
        const equippedSlots = window.getEquippedPowerups?.() || [null, null];
        let owned = window.POWERUPS_DATA.filter(p => inventory[p.id]?.desbloqueado || inventory[p.id]?.usos > 0);

        const availableTypes = ['defensivo', 'control', 'utilidad', 'riesgo'].filter(t => owned.some(p => (p.type || 'utilidad') === t));
        invRenderPowerupFilters(availableTypes);
        if (invActiveRarityFilter.powerups !== 'TODAS') {
            owned = owned.filter(p => (p.type || 'utilidad') === invActiveRarityFilter.powerups);
        }

        if (titleEl) titleEl.textContent = (shopTextos('inventario').titulos?.powerupsTemplate ?? 'POTENCIADORES OBTENIDOS — {n}').replace('{n}', owned.length);

        if (owned.length === 0) {
            const emptyMsg = pw.emptyState ?? 'NO TIENES POTENCIADORES{br}EN ESTA CATEGORÍA';
            content.innerHTML = `<div class="inv-empty-state" id="inv-empty-powerups">${emptyMsg.replace('{br}', '<br>')}</div>`;
            if (window.aplicarEstilosTexto) window.aplicarEstilosTexto();
            return;
        }

        content.innerHTML = `
            <div class="inventory-powerup-grid">
                ${owned.map(p => renderInventoryPowerupCard(p, inventory, equippedSlots)).join('')}
            </div>
        `;
    } else if (section === 'cofres') {
        const cf = shopTextos('inventario').cofres || {};
        if (filtersEl) filtersEl.innerHTML = '';
        const stored = CHESTS_DATA.filter(c => !c.upgradeable).map(chest => ({
            ...chest,
            count: parseInt(localStorage.getItem('invChest_' + chest.id) || '0')
        })).filter(chest => chest.count > 0);

        if (titleEl) titleEl.textContent = (shopTextos('inventario').titulos?.cofresTemplate ?? 'COFRES GUARDADOS — {n}').replace('{n}', stored.length);

        if (stored.length === 0) {
            const emptyMsg = cf.emptyState ?? 'NO TIENES COFRES{br}GUARDADOS';
            content.innerHTML = `<div class="inv-empty-state" id="inv-empty-cofres">${emptyMsg.replace('{br}', '<br>')}</div>`;
            if (window.aplicarEstilosTexto) window.aplicarEstilosTexto();
            return;
        }

        content.innerHTML = `
            <div class="inv-grid inv-chest-grid">
                ${stored.map(renderInventoryChestCard).join('')}
            </div>
        `;
    }
}


function renderInventoryPowerupCard(powerup, inventory, equippedSlots) {
    const state = inventory[powerup.id] || {};
    const isVipShape = !window.NORMAL_SHOP_POWERUP_IDS?.includes(powerup.id);
    const slotIndex = equippedSlots.indexOf(powerup.id);
    const isEquipped = slotIndex !== -1;
    const pw = shopTextos('inventario').powerups || {};
    const nivelLabel = (pw.labelNivel ?? 'NIVEL {n}').replace('{n}', Math.max(1, state.nivel || 1));
    const bloqueadoLabel = pw.labelBloqueado ?? 'BLOQUEADO';
    return `
        <button class="inventory-powerup-card ${isVipShape ? 'hex' : 'rect'} ${isEquipped ? 'inv-equipped' : ''}" style="--powerup-color:${powerup.color}" onclick="openPowerupDetail('${powerup.id}','${isVipShape ? 'vip' : 'normal'}')" type="button">
            ${isEquipped ? `<div class="inv-powerup-slot-tag">${slotIndex === 0 ? 'W' : 'E'}</div>` : ''}
            <img src="assets/powerups/icons/${powerup.id}.png" alt="">
            <strong>${powerup.name}</strong>
            <span>${state.desbloqueado ? nivelLabel : bloqueadoLabel} · x${state.usos || 0}</span>
        </button>
    `;
}

function renderInventoryChestCard(chest) {
    const color = CHEST_RARITY_COLORS[chest.id] || '#ffee00';
    const botonAbrir = shopTextos('inventario').cofres?.botonAbrir ?? 'ABRIR';
    return `
        <div class="inv-chest-card" style="--inv-card-color:${color};">
            <div class="inv-chest-count">x${chest.count}</div>
            <div class="inv-chest-icon"><img src="${chest.image}" alt=""></div>
            <div class="inv-chest-name">${chest.name}</div>
            <button class="inv-chest-open-btn" onclick="openInventoryChest('${chest.id}')" type="button">${botonAbrir}</button>
        </div>
    `;
}

function renderInventoryProfileBanner(equipped) {
    const bn = shopTextos('inventario').banners || {};
    const name = localStorage.getItem('playerName') || (bn.fallbackNombreJugador ?? 'Jugador');
    const avatar = localStorage.getItem('playerAvatar') || 'assets/UI/Common/Avatars/Avatar_Default.png';
    const banner = findBannerById(equipped) || BANNERS_DATA[0];
    const bg = banner.cover
        ? `linear-gradient(90deg, rgba(5,6,12,0.86), rgba(5,6,12,0.36)), url('${banner.cover}')`
        : 'linear-gradient(135deg, rgba(0,255,231,0.18), rgba(255,77,109,0.16))';
    return `
        <section class="inventory-profile-banner" style="background-image:${bg};">
            <div class="inventory-profile-avatar" style="background-image:url('${avatar}')"></div>
            <div>
                <div class="inventory-profile-kicker" id="inv-profile-banner-kicker">${bn.labelBannerEquipado ?? 'BANNER EQUIPADO'}</div>
                <div class="inventory-profile-name">${name}</div>
                <div class="inventory-profile-banner-name">${banner.name || (bn.fallbackNombreBanner ?? 'Banner')}</div>
            </div>
        </section>
    `;
}

function openInventoryChest(id) {
    const count = parseInt(localStorage.getItem('invChest_' + id) || '0');
    if (count <= 0) return;
    const chest = CHESTS_DATA.find(c => c.id === id);
    if (!chest) return;
    const options = [1, 2, 5, count].filter((value, index, arr) => value <= count && arr.indexOf(value) === index);
    showShopModal({
        kicker: 'INVENTARIO',
        title: `${chest.name} x${count}`,
        image: chest.image,
        body: `
            <div class="chest-quantity-grid">
                ${options.map(value => `<button type="button" onclick="openInventoryChestAmount('${id}', ${value})">ABRIR ${value}</button>`).join('')}
            </div>
        `,
        cancelText: 'CERRAR',
        confirmText: null
    });
}

function openInventoryChestAmount(id, amount) {
    const chest = CHESTS_DATA.find(c => c.id === id);
    const count = parseInt(localStorage.getItem('invChest_' + id) || '0');
    const total = Math.max(1, Math.min(amount, count));
    if (!chest || total <= 0) return;

    localStorage.setItem('invChest_' + id, String(count - total));
    const summary = { coins: 0, gems: 0, drops: {}, caronteKeys: 0 };
    for (let i = 0; i < total; i++) {
        const result = openChestReward(chest);
        summary.coins += result.coins;
        summary.gems += result.gems;
        summary.drops[result.drop] = (summary.drops[result.drop] || 0) + 1;
        if (result.caronteKey) summary.caronteKeys++;
    }
    window.playSfx?.('reward');
    showInventorySection('cofres');
    const caronteKeyHTML = summary.caronteKeys > 0
        ? `<div class="caronte-key-drop-line">${renderCaronteKeyIcon('sm')}<span>+${summary.caronteKeys} Llave${summary.caronteKeys > 1 ? 's' : ''} de Caronte</span></div>`
        : '';
    showShopModal({
        kicker: `${total} COFRE${total > 1 ? 'S' : ''} ABIERTO${total > 1 ? 'S' : ''}`,
        title: chest.name,
        image: chest.openImage || chest.image,
        body: `
            <div class="chest-open-result">
                <div>Base: ${summary.coins} monedas + ${summary.gems} rubies</div>
                <div>${Object.entries(summary.drops).map(([drop, qty]) => `${drop} x${qty}`).join('<br>')}</div>
                ${caronteKeyHTML}
            </div>
        `,
        cancelText: null,
        confirmText: 'CERRAR'
    });
}
window.openInventoryChestAmount = openInventoryChestAmount;

// Exponer funciones principales al objeto window
window.openShop = openShop;
window.closeShop = closeShop;
window.openInventory = openInventory;
window.closeInventory = closeInventory;

// ── Sin el color RGB ──────────────────────────────────
const TRAIL_COLOR_LIST = [
    { id: 'cyan',    color: '#00ffe7', rgb: '0,255,231' },
    { id: 'teal',    color: '#00ffaa', rgb: '0,255,170' },
    { id: 'green',   color: '#44ff88', rgb: '68,255,136' },
    { id: 'lime',    color: '#aaff00', rgb: '170,255,0' },
    { id: 'yellow',  color: '#ffee00', rgb: '255,238,0' },
    { id: 'orange',  color: '#ff8800', rgb: '255,136,0' },
    { id: 'red',     color: '#ff4444', rgb: '255,68,68' },
    { id: 'pink',    color: '#ff2288', rgb: '255,34,136' },
    { id: 'magenta', color: '#ff44cc', rgb: '255,68,204' },
    { id: 'purple',  color: '#cc44ff', rgb: '204,68,255' },
    { id: 'violet',  color: '#8844ff', rgb: '136,68,255' },
    { id: 'blue',    color: '#4488ff', rgb: '68,136,255' },
    { id: 'sky',     color: '#00ccff', rgb: '0,204,255' },
    { id: 'white',   color: '#e0eeff', rgb: '224,238,255' },
    { id: 'rgb',     color: 'linear-gradient(135deg,#ff4444,#ffee00,#44ff88,#4488ff,#cc44ff)', rgb: null, premium: true, price: 250, priceType: 'gems' },
];

function getTrailColorStyle(color) {
    return color?.color || '#ffffff';
}

function getTrailSolidColor(color) {
    if (!color) return '#ffffff';
    return color.id === 'rgb' ? '#ff4dff' : color.color;
}

function getTrailPurchaseInfo(trail, color) {
    if (color?.premium) {
        return { amount: color.price, currency: color.priceType };
    }
    return { amount: trail.price, currency: trail.priceType };
}

let selectedTrailEffect = null;
let selectedTrailColor = null;
let activeTrailIndex = 0;

function renderTrailsPage(container) {
    const equipped   = localStorage.getItem('equippedTrail') || 'solid_cyan';
    const eqParts    = equipped.split('_');
    const eqColor    = eqParts[eqParts.length - 1];
    const eqEffect   = eqParts.slice(0, -1).join('_');

    if (!selectedTrailEffect) selectedTrailEffect = eqEffect;
    if (!selectedTrailColor)  selectedTrailColor  = eqColor;

    activeTrailIndex = TRAILS_DATA.findIndex(t => t.id === selectedTrailEffect);
    if (activeTrailIndex < 0) activeTrailIndex = 0;

    const coins = window.playerData?.deadCoins ?? parseInt(localStorage.getItem('deadCoins') || '0');
    const gems  = window.playerData?.gems       ?? parseInt(localStorage.getItem('gems')      || '0');

    // Cancelar animaciones anteriores
    if (trailAnimId)      { cancelAnimationFrame(trailAnimId);      trailAnimId      = null; }
    if (previewTrailAnim) { cancelAnimationFrame(previewTrailAnim); previewTrailAnim = null; }
    if (trailArcAnimId)   { cancelAnimationFrame(trailArcAnimId);   trailArcAnimId   = null; }
    if (trailBallAnimId)  { cancelAnimationFrame(trailBallAnimId);  trailBallAnimId  = null; }

    // Eliminar overlay previo si existe
    const prev = document.getElementById('trails-fullscreen-overlay');
    if (prev) prev.remove();

    // Crear overlay pantalla completa por encima de todo
    const overlay = document.createElement('div');
    overlay.id = 'trails-fullscreen-overlay';
    overlay.style.cssText = `
        position: fixed; inset: 0; z-index: 99999;
        display: flex; flex-direction: column;
        background: url('assets/UI/Store/Trails/Fondo_Trails.png') no-repeat center center;
        background-size: cover;
        font-family: monospace; overflow: visible;
    `;

    const tt = shopTextos('trails');

    overlay.innerHTML = `
        <!-- HUD superior -->
        <div style="display:flex; justify-content:space-between; align-items:center; padding:14px 24px 0; flex-shrink:0; position:relative; z-index:5;">
            <button id="trails-back-btn" style="
                padding:8px 18px; background:rgba(255,255,255,0.06);
                border:1px solid rgba(255,255,255,0.18); border-radius:10px;
                color:rgba(255,255,255,0.7); font-family:monospace; font-size:11px;
                letter-spacing:2px; cursor:pointer; font-weight:bold;">${tt.botonVolver ?? '← VOLVER'}</button>

            <div style="text-align:center; color:#00ffe7; font-size:20px; font-weight:900; letter-spacing:6px; text-shadow:0 0 18px #00ffe788;">
                ${tt.titulo ?? 'TRAILS'}
            </div>

            <div style="
                width:220px; height:72px;
                background: url('assets/UI/Store/Trails/Fondo_Monedas.png') no-repeat center center;
                background-size: contain; position:relative;">
                <div style="position:absolute; top:18px; right:28px; text-align:right; line-height:1.5;">
                    <div style="font-size:11px; color:#00ffe7; font-weight:bold; letter-spacing:1px;">
                        ${tt.labelCoins ?? 'COINS'}: <span id="trail-hud-coins" style="color:white;">${coins.toLocaleString()}</span>
                    </div>
                    <div style="font-size:11px; color:#00ffe7; font-weight:bold; letter-spacing:1px;">
                        ${tt.labelGems ?? 'GEMS'}: <span id="trail-hud-gems" style="color:white;">${gems.toLocaleString()}</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Zona central: arco + bolita -->
        <div id="trail-center-zone" style="position:relative; flex:1; min-height:0;">
            <canvas id="trailArcCanvas" style="position:absolute; top:0; left:0; width:100%; height:100%; cursor:grab;"></canvas>
            <canvas id="trailBallCanvas" style="position:absolute; top:0; left:0; width:100%; height:100%; pointer-events:none;"></canvas>
        </div>

        <!-- Carrusel de cards -->
        <div id="trail-cards-container" style="
            position:relative; width:100%; height:240px;
            perspective:800px; transform-style:preserve-3d;
            overflow:visible; display:flex; justify-content:center;
            align-items:center; flex-shrink:0; user-select:none;">
            ${TRAILS_DATA.map((t, idx) => renderTrailCardNew(t, idx)).join('')}
        </div>

        <!-- Panel compra -->
        <div id="trail-buy-panel" style="
            position:absolute; bottom:15px; left:20px;
            width:380px; height:88px;
            background: url('assets/UI/Store/Trails/Fondo_Descripcion.png') no-repeat center center;
            background-size:contain; z-index:20; padding:12px 24px;
            display:none; box-sizing:border-box;"></div>
    `;

    document.body.appendChild(overlay);

    // Botón volver
    document.getElementById('trails-back-btn').onclick = () => {
        if (trailArcAnimId)  { cancelAnimationFrame(trailArcAnimId);  trailArcAnimId  = null; }
        if (trailBallAnimId) { cancelAnimationFrame(trailBallAnimId); trailBallAnimId = null; }
        document.removeEventListener('keydown', trailsKeyHandler);
        overlay.remove();
    };

    // ── Navegación con teclado Q/E ──
    function trailsKeyHandler(e) {
        if (!document.getElementById('trails-fullscreen-overlay')) {
            document.removeEventListener('keydown', trailsKeyHandler);
            return;
        }
        const total = TRAILS_DATA.length;
        if (e.key === 'q' || e.key === 'Q') {
            activeTrailIndex = (activeTrailIndex - 1 + total) % total;
            selectTrailEffectNew(TRAILS_DATA[activeTrailIndex].id, activeTrailIndex);
        } else if (e.key === 'e' || e.key === 'E') {
            activeTrailIndex = (activeTrailIndex + 1) % total;
            selectTrailEffectNew(TRAILS_DATA[activeTrailIndex].id, activeTrailIndex);
        }
    }
    document.addEventListener('keydown', trailsKeyHandler);

    // Dimensionar canvas al tamaño real y arrancar animaciones
    setTimeout(() => {
        const zone = document.getElementById('trail-center-zone');
        const arc  = document.getElementById('trailArcCanvas');
        const ball = document.getElementById('trailBallCanvas');
        if (zone && arc && ball) {
            arc.width  = zone.offsetWidth;  arc.height  = zone.offsetHeight;
            ball.width = zone.offsetWidth;  ball.height = zone.offsetHeight;
        }
        startTrailArcAnim();
        startTrailBallAnim();
        highlightSelectedCard();
        updateTrailCardsCarousel();
        initTrailCardsDrag();
    }, 40);
}

function isTrailOwned(effectId) {
    return TRAIL_COLOR_LIST.some(c =>
        localStorage.getItem(`trail_${effectId}_${c.id}`) === 'true'
    );
}

function renderTrailCardNew(t, index) {
    // Tarjeta especial para "Ninguna"
    if (t.id === 'none') {
        const equippedId = localStorage.getItem('equippedTrail') || '';
        const isEquipped = equippedId === 'none';
        return `
        <div id="trail-card-new-none" onclick="selectTrailEffectNew('none', ${index})" class="trail-card-3d" style="
            flex-shrink:0; width:135px; height:200px;
            background:#070d1a;
            border:2px solid ${isEquipped ? '#00ffe7' : 'rgba(255,255,255,0.12)'};
            border-radius:14px; padding:10px;
            display:flex; flex-direction:column; align-items:center; justify-content:space-between;
            cursor:pointer;
            box-shadow: ${isEquipped ? '0 0 15px rgba(0,255,231,0.25)' : '0 10px 20px rgba(0,0,0,0.5)'};
            transform-origin: center bottom;
            transition: border-color 0.3s, box-shadow 0.3s, transform 0.3s, opacity 0.3s;
        ">
            <div style="width:100%; height:110px; border-radius:10px; background:rgba(0,0,0,0.45); display:flex; align-items:center; justify-content:center;">
                <div style="color:rgba(255,255,255,0.15); font-size:32px;">∅</div>
            </div>
            <div style="display:flex; flex-direction:column; align-items:center; gap:2px; width:100%;">
                <div style="color:white; font-size:10px; letter-spacing:1px; font-weight:bold; text-align:center; font-family:'Geom',monospace;">NINGUNA</div>
                <div style="color:#888; font-size:8px; letter-spacing:2px; font-weight:bold;">BASICO</div>
            </div>
            <div style="width:100%; display:flex; justify-content:center;">
                <div style="color:#00ff88; font-size:9px; font-weight:bold; letter-spacing:1px;">${shopTextos('trails').labelGratis ?? '✔ GRATIS'}</div>
            </div>
        </div>`;
    }

    const isOwned    = isTrailOwned(t.id);
    const equippedId = localStorage.getItem('equippedTrail') || '';
    // Trails específicos sin variantes de color
    const specificTrails = ['none', 'spark', 'ghost', 'fractura', 'hielo', 'toxico', 
                           'trail_vampiro', 'trail_zombie', 'trail_fire', 'trail_water', 
                           'trail_wind', 'trail_ice', 'trail_lava', 'trail_nature', 
                           'trail_custom_text'];
    const isEquipped = specificTrails.includes(t.id) 
        ? equippedId === t.id 
        : equippedId.startsWith(t.id + '_');
    const priceIcon  = t.priceType === 'gems'
        ? 'assets/UI/Common/Currency/Rubies.png'
        : 'assets/UI/Common/Currency/DEAD_COIN.png';

    // Cargar la portada de la carpeta assets/UI/Store/Trails/Covers/
    const coverImages = {
        'solid': 'assets/UI/Store/Trails/Covers/Basic_trail.png',
        'glow': 'assets/UI/Store/Trails/Covers/Normal_trail.png',
        'glow_shapes': 'assets/UI/Store/Trails/Covers/Figure_trail.png'
    };
    const cover = coverImages[t.id] || t.image;

    return `
    <div id="trail-card-new-${t.id}" onclick="selectTrailEffectNew('${t.id}', ${index})" class="trail-card-3d" style="
        flex-shrink:0; width:135px; height:200px;
        background:#070d1a;
        border:2px solid ${isEquipped ? '#00ffe7' : 'rgba(255,255,255,0.12)'};
        border-radius:14px; padding:10px;
        display:flex; flex-direction:column; align-items:center; justify-content:space-between;
        cursor:pointer;
        box-shadow: ${isEquipped ? '0 0 15px rgba(0,255,231,0.25)' : '0 10px 20px rgba(0,0,0,0.5)'};
        transform-origin: center bottom;
        transition: border-color 0.3s, box-shadow 0.3s, transform 0.3s, opacity 0.3s;
    ">
        <div style="width:100%; height:110px; border-radius:10px; background:rgba(0,0,0,0.45); overflow:hidden; display:flex; align-items:center; justify-content:center;">
            ${cover
                ? `<img src="${cover}" style="width:100%; height:100%; object-fit:cover;" draggable="false">`
                : `<canvas id="trail-card-${t.id}" width="100" height="100"></canvas>`}
        </div>
        <div style="display:flex; flex-direction:column; align-items:center; gap:2px; width:100%;">
            <div style="color:white; font-size:10px; letter-spacing:1px; font-weight:bold; text-align:center; font-family:'Geom',monospace;">${t.name.toUpperCase()}</div>
            <div class="${gemRarityClass(t.rarity)}" style="color:${t.rarityColor}; font-size:8px; letter-spacing:2px; font-weight:bold;">${t.rarity}</div>
        </div>
        <div style="width:100%; display:flex; justify-content:center; align-items:center;">
            ${isOwned
                ? `<div style="color:#00ff88; font-size:9px; font-weight:bold; letter-spacing:1px;">${shopTextos('trails').labelTienes ?? '✔ TIENES'}</div>`
                : `<div style="display:flex; align-items:center; gap:4px; background:rgba(255,255,255,0.04); padding:4px 8px; border-radius:6px; border:1px solid rgba(255,255,255,0.08);">
                    <img src="${priceIcon}" style="width:11px;height:11px;object-fit:contain;">
                    <span style="color:#ffffff; font-size:9px; font-weight:bold;">${t.price}</span>
                   </div>`}
        </div>
    </div>`;
}

function updateTrailCardsCarousel() {
    const container = document.getElementById('trail-cards-container');
    if (!container) return;
    const cards = container.children;
    const total = cards.length;

    for (let i = 0; i < total; i++) {
        const card = cards[i];
        const diff = i - activeTrailIndex;
        
        let zIndex = 10 - Math.abs(diff);
        let opacity = 1;
        let translateX = diff * 135; 
        let rotateY = 0;
        let translateZ = 0;
        let scale = 1;

        if (diff === 0) {
            scale = 1.15;
            translateZ = 60;
            rotateY = 0;
            opacity = 1;
        } else if (diff < 0) {
            rotateY = 32; 
            translateX = diff * 115 - 40; 
            translateZ = -20 - Math.abs(diff) * 15;
            opacity = Math.max(0.35, 1 - Math.abs(diff) * 0.25);
        } else {
            rotateY = -32; 
            translateX = diff * 115 + 40; 
            translateZ = -20 - Math.abs(diff) * 15;
            opacity = Math.max(0.35, 1 - Math.abs(diff) * 0.25);
        }

        card.style.position = 'absolute';
        card.style.left = '50%';
        card.style.transform = `translateX(-50%) translate3d(${translateX}px, 0px, ${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`;
        card.style.zIndex = zIndex;
        card.style.opacity = opacity;
        card.style.pointerEvents = Math.abs(diff) > 2 ? 'none' : 'auto';
        card.style.transition = 'transform 0.45s cubic-bezier(0.25, 0.8, 0.25, 1), opacity 0.45s, z-index 0.45s, border-color 0.3s, box-shadow 0.3s';
    }
}

function initTrailCardsDrag() {
    const container = document.getElementById('trail-cards-container');
    if (!container) return;
    const total = container.children.length;

    let cardDragStartX = 0;
    let isCardDragging = false;

    container.onmousedown = e => {
        cardDragStartX = e.clientX;
        isCardDragging = true;
    };
    container.onmousemove = e => {
        if (!isCardDragging) return;
        const deltaX = e.clientX - cardDragStartX;
        if (Math.abs(deltaX) > 65) {
            if (deltaX > 0 && activeTrailIndex > 0) {
                activeTrailIndex--;
                selectTrailEffectNew(TRAILS_DATA[activeTrailIndex].id, activeTrailIndex);
                isCardDragging = false;
            } else if (deltaX < 0 && activeTrailIndex < total - 1) {
                activeTrailIndex++;
                selectTrailEffectNew(TRAILS_DATA[activeTrailIndex].id, activeTrailIndex);
                isCardDragging = false;
            }
        }
    };
    container.onmouseup = container.onmouseleave = () => {
        isCardDragging = false;
    };

    container.ontouchstart = e => {
        cardDragStartX = e.touches[0].clientX;
        isCardDragging = true;
    };
    container.ontouchmove = e => {
        if (!isCardDragging) return;
        const deltaX = e.touches[0].clientX - cardDragStartX;
        if (Math.abs(deltaX) > 65) {
            if (deltaX > 0 && activeTrailIndex > 0) {
                activeTrailIndex--;
                selectTrailEffectNew(TRAILS_DATA[activeTrailIndex].id, activeTrailIndex);
                isCardDragging = false;
            } else if (deltaX < 0 && activeTrailIndex < total - 1) {
                activeTrailIndex++;
                selectTrailEffectNew(TRAILS_DATA[activeTrailIndex].id, activeTrailIndex);
                isCardDragging = false;
            }
        }
    };
    container.ontouchend = () => {
        isCardDragging = false;
    };
}

// ─── Arco de colores giratorio ────────────────────────
let trailArcAnimId = null;
// arcOffset: cuánto se ha desplazado el arco desde su posición inicial (en pasos de índice)
let arcOffset = 0;

// ─────────────────────────────────────────────────────────────────────────────
// startTrailArcAnim — Arco semicircular con TODOS los colores visibles
// • El arco va de izquierda a derecha (180°) en la parte SUPERIOR del canvas
// • El orb del color seleccionado queda siempre en el TOPE del arco
// • Drag con mouse/touch: arrastra el arco izquierda/derecha, todos los orbs se mueven
// • Al soltar: snap suave al orb más cercano al tope → se selecciona ese color
// • Click sobre un orb: lo centra y selecciona
// ─────────────────────────────────────────────────────────────────────────────
function startTrailArcAnim() {
    if (trailArcAnimId) cancelAnimationFrame(trailArcAnimId);
    const cvs = document.getElementById('trailArcCanvas');
    if (!cvs) return;
    const ctx = cvs.getContext('2d');

    const arcColors = TRAIL_COLOR_LIST.map(c => ({ id: c.id, color: c.color, rgb: c.rgb }));
    const total     = arcColors.length;

    // Círculo COMPLETO que rota — todos los colores distribuidos en 360°
    // El orb en el tope (-π/2) es el seleccionado
    // Los orbs de la mitad inferior quedan ocultos detrás de las cards
    const ARC_SPAN  = Math.PI * 2;              // 360°
    const ARC_START = -Math.PI / 2;             // empezamos en el tope

    // Inicializar arcOffset para que el color seleccionado quede en el tope (-π/2)
    const selIdx = arcColors.findIndex(c => c.id === selectedTrailColor);
    if (selIdx >= 0) {
        // tope del arco = ARC_START + (selIdx / (total-1)) * ARC_SPAN = -π/2
        // => arcOffset = -π/2 - (ARC_START + selIdx/(total-1)*ARC_SPAN)
        arcOffset = -Math.PI / 2 - (ARC_START + (selIdx / (total - 1)) * ARC_SPAN);
    }

    // ── Helpers ──────────────────────────────────────────────────────────────
    function getOrbAngle(i) {
        const t = total === 1 ? 0.5 : i / (total - 1);
        return ARC_START + t * ARC_SPAN + arcOffset;
    }

    function getCenter(W, H) {
        // cy = borde inferior del canvas (donde empiezan las cards)
        // R = cy - margen_superior → tope del arco justo bajo el título
        const cy = H;
        const R  = H - H * 0.16; // tope a 16% del alto desde arriba
        return { cx: W / 2, cy, R };
    }

    // Índice del orb más cercano al tope del arco (-π/2)
    function getTopIndex() {
        const target = -Math.PI / 2;
        let best = 0, bestD = Infinity;
        for (let i = 0; i < total; i++) {
            let d = Math.abs(((getOrbAngle(i) - target + Math.PI * 3) % (Math.PI * 2)) - Math.PI);
            if (d < bestD) { bestD = d; best = i; }
        }
        return best;
    }

    // Snap suave: mueve arcOffset para centrar el orb `idx` en el tope
    function snapTo(idx) {
        const targetOrbAngle = ARC_START + (idx / (total - 1)) * ARC_SPAN;
        const wantedOffset   = -Math.PI / 2 - targetOrbAngle;
        // Diferencia mínima
        let diff = wantedOffset - arcOffset;
        // Normalizar a [-π, π] — aunque el arco no es periódico completo,
        // esto evita girar más de lo necesario
        while (diff >  Math.PI) diff -= Math.PI * 2;
        while (diff < -Math.PI) diff += Math.PI * 2;
        const start = arcOffset, end = arcOffset + diff;
        const t0 = performance.now();
        function anim(now) {
            if (!document.getElementById('trailArcCanvas')) return;
            const p    = Math.min(1, (now - t0) / 320);
            const ease = 1 - Math.pow(1 - p, 3);
            arcOffset  = start + (end - start) * ease;
            if (p < 1) requestAnimationFrame(anim);
        }
        requestAnimationFrame(anim);
    }

    // ── Drag ─────────────────────────────────────────────────────────────────
    let isDragging     = false;
    let dragStartX     = 0;
    let dragStartOff   = 0;
    let dragMoved      = false;
    let lastTs         = 0;

    cvs.style.cursor = 'grab';
    cvs.style.touchAction = 'none';

    cvs.onpointerdown = e => {
        isDragging   = true;
        dragMoved    = false;
        dragStartX   = e.clientX;
        dragStartOff = arcOffset;
        cvs.style.cursor = 'grabbing';
        cvs.setPointerCapture(e.pointerId);
    };

    cvs.onpointermove = e => {
        if (!isDragging) return;
        const deltaX = e.clientX - dragStartX;
        if (Math.abs(deltaX) > 3) dragMoved = true;
        // Sensibilidad: 1px de drag = 0.004 rad (ajustable)
        arcOffset = dragStartOff + deltaX * 0.005;
        // Resaltar el orb más cercano al tope en tiempo real
        const topIdx = getTopIndex();
        if (arcColors[topIdx] && arcColors[topIdx].id !== selectedTrailColor) {
            selectedTrailColor = arcColors[topIdx].id;
            window.playSfx?.('menuHover', 0.25);
        }
    };

    cvs.onpointerup = cvs.onpointercancel = e => {
        if (!isDragging) return;
        isDragging = false;
        cvs.style.cursor = 'grab';
        if (!dragMoved) {
            // Click — ver si hizo click sobre un orb
            const W = cvs.width, H = cvs.height;
            const { cx, cy, R } = getCenter(W, H);
            const rect = cvs.getBoundingClientRect();
            const mx = (e.clientX - rect.left) * (W / rect.width);
            const my = (e.clientY - rect.top)  * (H / rect.height);
            for (let i = 0; i < total; i++) {
                const a = getOrbAngle(i);
                const ox = cx + Math.cos(a) * R;
                const oy = cy + Math.sin(a) * R;
                if (Math.hypot(ox - mx, oy - my) < 28) {
                    selectedTrailColor = arcColors[i].id;
                    selectTrailColorNew(arcColors[i].id);
                    snapTo(i);
                    return;
                }
            }
        } else {
            // Snap al orb más cercano al tope
            const topIdx = getTopIndex();
            selectedTrailColor = arcColors[topIdx].id;
            selectTrailColorNew(arcColors[topIdx].id);
            snapTo(topIdx);
        }
    };

    // ── Partículas flotantes ──────────────────────────────────────────────────
    const particles = [];
    for (let i = 0; i < 38; i++) {
        particles.push({
            angle:  Math.random() * Math.PI * 2,
            offset: (Math.random() - 0.5) * 28,   // desviación radial
            speed:  (Math.random() - 0.5) * 0.004, // velocidad angular
            size:   Math.random() * 2.2 + 0.5,
            alpha:  Math.random() * 0.5 + 0.15,
            colorIdx: Math.floor(Math.random() * arcColors.length),
            twinkle: Math.random() * Math.PI * 2,
            twinkleSpeed: Math.random() * 0.08 + 0.02,
        });
    }

    // ── Frame loop ───────────────────────────────────────────────────────────
    function frame(ts) {
        if (!document.getElementById('trailArcCanvas')) { trailArcAnimId = null; return; }
        trailArcAnimId = requestAnimationFrame(frame);
        if (ts - lastTs < 16) return;
        lastTs = ts;

        const W = cvs.width, H = cvs.height;
        const { cx, cy, R } = getCenter(W, H);

        ctx.clearRect(0, 0, W, H);

        // ── Clip: solo mostrar lo que esté dentro del canvas ──
        ctx.save();
        ctx.beginPath();
        ctx.rect(0, 0, W, H);
        ctx.clip();

        // ── A) Línea del arco con gradiente de colores ──────────────────────
        // Dibujamos segmentos cortos con el color interpolado entre orbs adyacentes
        const segments = 120;
        for (let s = 0; s < segments; s++) {
            const a1 = -Math.PI + (s / segments) * Math.PI * 2;
            const a2 = -Math.PI + ((s + 1) / segments) * Math.PI * 2;
            const mx = cx + Math.cos((a1 + a2) / 2) * R;
            const my = cy + Math.sin((a1 + a2) / 2) * R;
            // Interpolar color según posición en el arco
            const t  = ((s / segments) * arcColors.length) % arcColors.length;
            const i0 = Math.floor(t) % arcColors.length;
            const i1 = (i0 + 1) % arcColors.length;
            const c0 = arcColors[i0].id === 'rgb' ? '#ff44ff' : arcColors[i0].color;
            const c1 = arcColors[i1].id === 'rgb' ? '#44ffff' : arcColors[i1].color;
            const x1 = cx + Math.cos(a1) * R, y1 = cy + Math.sin(a1) * R;
            const x2 = cx + Math.cos(a2) * R, y2 = cy + Math.sin(a2) * R;
            const grd = ctx.createLinearGradient(x1, y1, x2, y2);
            grd.addColorStop(0, c0 + '44');
            grd.addColorStop(1, c1 + '44');
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.strokeStyle = grd;
            ctx.lineWidth   = 2.5;
            ctx.stroke();
        }

        // ── B) Partículas flotantes alrededor del arco ───────────────────────
        for (const p of particles) {
            p.angle   += p.speed;
            p.twinkle += p.twinkleSpeed;
            const pr  = R + p.offset;
            const px  = cx + Math.cos(p.angle) * pr;
            const py  = cy + Math.sin(p.angle) * pr;
            if (py > H + 10) continue; // fuera del canvas
            const col = arcColors[p.colorIdx % arcColors.length];
            const c   = col.id === 'rgb' ? '#ff88ff' : col.color;
            const a   = p.alpha * (0.5 + 0.5 * Math.sin(p.twinkle));
            ctx.save();
            ctx.globalAlpha = a;
            ctx.shadowBlur  = 6;
            ctx.shadowColor = c;
            ctx.fillStyle   = c;
            ctx.beginPath();
            ctx.arc(px, py, p.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }

        // ── C) Conexiones entre orbs adyacentes ─────────────────────────────
        for (let i = 0; i < total; i++) {
            const i2  = (i + 1) % total;
            const a1  = getOrbAngle(i);
            const a2  = getOrbAngle(i2);
            const ox1 = cx + Math.cos(a1) * R, oy1 = cy + Math.sin(a1) * R;
            const ox2 = cx + Math.cos(a2) * R, oy2 = cy + Math.sin(a2) * R;
            if (oy1 > H + 10 && oy2 > H + 10) continue;
            const c1  = arcColors[i].id  === 'rgb' ? '#ff44ff' : arcColors[i].color;
            const c2  = arcColors[i2].id === 'rgb' ? '#44ffff' : arcColors[i2].color;
            const grd = ctx.createLinearGradient(ox1, oy1, ox2, oy2);
            grd.addColorStop(0, c1 + '55');
            grd.addColorStop(1, c2 + '55');
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(ox1, oy1);
            ctx.lineTo(ox2, oy2);
            ctx.strokeStyle = grd;
            ctx.lineWidth   = 1;
            ctx.stroke();
            ctx.restore();
        }

        // ── Flecha indicadora en el tope ─────────────────────────────────────
        {
            const topX     = cx;
            const topY     = cy - R;
            const topColor = arcColors[getTopIndex()]?.color || '#00ffe7';
            const pulse    = 0.7 + 0.3 * Math.sin(ts * 0.004);
            ctx.save();
            ctx.shadowBlur  = 14 * pulse;
            ctx.shadowColor = topColor;
            ctx.fillStyle   = topColor;
            ctx.globalAlpha = pulse;
            const aw = 9, ah = 11;
            ctx.beginPath();
            ctx.moveTo(topX,      topY - ah - 24);
            ctx.lineTo(topX - aw, topY - 24);
            ctx.lineTo(topX + aw, topY - 24);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
        }

        // ── D) Orbs con pulso y efectos ──────────────────────────────────────
        for (let i = 0; i < total; i++) {
            const a   = getOrbAngle(i);
            const ox  = cx + Math.cos(a) * R;
            const oy  = cy + Math.sin(a) * R;
            if (oy > H + 10) continue;

            const isTop    = oy < cy;
            const orbAlpha = isTop ? 1.0 : 0.65;
            const sel      = arcColors[i].id === selectedTrailColor;
            const pulse    = sel ? 1 + 0.12 * Math.sin(ts * 0.005 + i) : 1;
            const r        = (sel ? 15 : 10) * pulse;
            const col      = arcColors[i].id === 'rgb'
                ? `hsl(${(ts * 0.18 + i * 45) % 360},100%,68%)`
                : arcColors[i].color;

            ctx.save();
            ctx.globalAlpha = orbAlpha;

            // Anillo expansivo del seleccionado (efecto pulso)
            if (sel) {
                const ringPhase = (ts * 0.002) % 1;
                const ringR     = r + ringPhase * 22;
                ctx.beginPath();
                ctx.arc(ox, oy, ringR, 0, Math.PI * 2);
                ctx.strokeStyle = col + Math.floor((1 - ringPhase) * 120).toString(16).padStart(2,'0');
                ctx.lineWidth   = 1.5;
                ctx.stroke();
            }

            // Glow exterior
            ctx.shadowBlur  = sel ? 24 : 10;
            ctx.shadowColor = col;

            // Borde exterior
            ctx.beginPath();
            ctx.arc(ox, oy, r + 3, 0, Math.PI * 2);
            ctx.strokeStyle = sel ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.18)';
            ctx.lineWidth   = sel ? 2.5 : 1.2;
            ctx.stroke();

            // Relleno con gradiente radial
            const grd = ctx.createRadialGradient(ox - r*0.3, oy - r*0.3, 0, ox, oy, r);
            if (arcColors[i].id === 'rgb') {
                const h = (ts * 0.18 + i * 45) % 360;
                grd.addColorStop(0,   `hsl(${h},100%,88%)`);
                grd.addColorStop(0.5, `hsl(${(h+120)%360},100%,65%)`);
                grd.addColorStop(1,   `hsl(${(h+240)%360},100%,45%)`);
            } else {
                grd.addColorStop(0, 'rgba(255,255,255,0.9)');
                grd.addColorStop(0.35, col);
                grd.addColorStop(1,   col + 'aa');
            }
            ctx.fillStyle = grd;
            ctx.beginPath();
            ctx.arc(ox, oy, r, 0, Math.PI * 2);
            ctx.fill();

            // Brillo interior
            ctx.shadowBlur = 0;
            ctx.beginPath();
            ctx.arc(ox - r*0.28, oy - r*0.28, r * (sel ? 0.28 : 0.22), 0, Math.PI*2);
            ctx.fillStyle = 'rgba(255,255,255,0.75)';
            ctx.fill();

            ctx.restore();
        }

        ctx.restore(); // cierra el clip
    }
    trailArcAnimId = requestAnimationFrame(frame);
}

// ─── Vista previa de bola 2D en órbita ─────────────────
let trailBallAnimId = null;

function startTrailBallAnim() {
    if (trailBallAnimId) cancelAnimationFrame(trailBallAnimId);
    const cvs = document.getElementById('trailBallCanvas');
    if (!cvs) return;
    const ctx = cvs.getContext('2d');

    let ballPts = [];
    let lastTs  = 0;

    function frame(ts) {
        if (!document.getElementById('trailBallCanvas')) { trailBallAnimId = null; return; }
        trailBallAnimId = requestAnimationFrame(frame);
        if (ts - lastTs < 24) return;
        lastTs = ts;

        const W = cvs.width, H = cvs.height;
        const cx = W / 2;
        const cy = H * 0.48; // Centrado en la ventana del arco

        // Generar órbita caótica 2D usando curvas de Lissajous y modulación
        const tVal = ts * 0.0018;
        const rx = Math.min(W, H) * 0.32; 
        const ry = Math.min(W, H) * 0.22; 
        
        const ballX = cx + rx * Math.sin(tVal) * (1.1 + 0.3 * Math.cos(2.2 * tVal));
        const ballY = cy + ry * Math.cos(2.2 * tVal) * (0.8 + 0.2 * Math.sin(tVal));

        ctx.clearRect(0, 0, W, H);

        ballPts.push({ x: ballX, y: ballY });
        if (ballPts.length > 55) ballPts.shift();
        
        const len = ballPts.length;
        for (let i = 0; i < len; i++) ballPts[i].life = (i + 1) / len;

        // Trail
        let colorKey = selectedTrailColor || 'cyan';
        let effect   = selectedTrailEffect || 'solid';
        const hueBase  = (ts * 0.18) % 360;
        let rgbMode  = colorKey === 'rgb';
        let rgb      = TRAIL_COLOR_LIST.find(c => c.id === colorKey)?.rgb || '0,255,231';

        // Color especial para spark
        if (effect === 'spark') {
            rgbMode = false;
            rgb = '255,255,0';
        }

        function rgba(alpha, hs) {
            return rgbMode
                ? `hsla(${((hueBase + (hs||0)) % 360)},100%,65%,${alpha})`
                : `rgba(${rgb},${alpha})`;
        }
        function solidCol() {
            return rgbMode ? `hsl(${hueBase},100%,64%)` : `rgb(${rgb})`;
        }

        // Dibujar trail usando drawPreviewTrailPoint (mismo render que gameplay)
        if (len >= 2 && typeof window.drawPreviewTrailPoint === 'function') {
            ctx.__previewNow = ts;
            for (let i = 0; i < len; i++) {
                const p = ballPts[i];
                if (p.life <= 0) continue;
                if (p.seed === undefined) p.seed = ((i * 7919) % 997) / 997;
                window.drawPreviewTrailPoint(ctx, p, effect, rgb, colorKey);
            }
        } else if (len >= 2) {
            // Fallback básico si trails.js aún no cargó
            ctx.save();
            ctx.lineCap = 'round';
            for (let i = 1; i < len; i++) {
                const l = ballPts[i].life;
                ctx.beginPath();
                ctx.moveTo(ballPts[i-1].x, ballPts[i-1].y);
                ctx.lineTo(ballPts[i].x, ballPts[i].y);
                ctx.strokeStyle = `rgba(${rgb},${l * 0.9})`;
                ctx.lineWidth = Math.max(1, 4 * l);
                ctx.stroke();
            }
            ctx.restore();
        }

        // Bolita
        const SKIN_COLORS = {
            cyan:'#00ffe7',red:'#ff4444',blue:'#5045eb',yellow:'#ffee00',
            orange:'#ff8800',green:'#3fe969',purple:'#cc44ff',white:'#ffffff',black:'#444'
        };
        const skinId    = window._cachedEquippedSkin || 'cyan';
        const ballColor = SKIN_COLORS[skinId] || '#00ffe7';
        ctx.save();
        ctx.shadowBlur = 20; ctx.shadowColor = ballColor;
        ctx.beginPath(); ctx.arc(ballX, ballY, 14, 0, Math.PI * 2);
        ctx.fillStyle = ballColor; ctx.fill();
        ctx.shadowBlur = 0;
        ctx.beginPath(); ctx.arc(ballX - 4, ballY - 4, 5, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,255,255,0.5)'; ctx.fill();
        ctx.restore();
    }
    trailBallAnimId = requestAnimationFrame(frame);
}

function highlightSelectedCard() {
    TRAILS_DATA.forEach(t => {
        const el = document.getElementById(`trail-card-new-${t.id}`);
        if (!el) return;
        const sel = t.id === selectedTrailEffect;
        el.style.borderColor = sel ? '#00ffe7' : 'rgba(255,255,255,0.12)';
        el.style.boxShadow = sel ? '0 0 15px rgba(0,255,231,0.25)' : '0 10px 20px rgba(0,0,0,0.5)';
    });
}

function equipNoneTrail() {
    localStorage.setItem('equippedTrail', 'none');
    window.equippedTrailId = 'none';
    window.playSfx?.('colorSelect', 0.7);
    showTrailBuyPanel();
    highlightSelectedCard();
}

function equipSpecificTrail(trailId) {
    // Desbloquear temporalmente para pruebas
    localStorage.setItem(`trail_${trailId}_cyan`, 'true');
    
    localStorage.setItem('equippedTrail', trailId);
    if (typeof bannerTrail !== 'undefined') bannerTrail = [];
    window.playSfx?.('colorSelect', 0.7);
    showTrailBuyPanel();
    highlightSelectedCard();
}

function buySpecificTrail(trailId) {
    const trail = TRAILS_DATA.find(t => t.id === trailId);
    if (!trail) return;
    
    const canAfford = trail.priceType === 'gems'
        ? parseInt(localStorage.getItem('gems') || '0') >= trail.price
        : parseInt(localStorage.getItem('deadCoins') || '0') >= trail.price;
    
    if (!canAfford) {
        alert(shopTextos('trails').alertaSinFondos ?? 'No tienes suficientes monedas/gemas');
        return;
    }
    
    // Gastar monedas/gemas
    if (trail.priceType === 'gems') {
        const gems = parseInt(localStorage.getItem('gems') || '0') - trail.price;
        localStorage.setItem('gems', gems);
    } else {
        const coins = parseInt(localStorage.getItem('deadCoins') || '0') - trail.price;
        localStorage.setItem('deadCoins', coins);
        if (window.playerData) window.playerData.deadCoins = coins;
    }
    
    // Marcar como comprado y equipar
    localStorage.setItem(`trail_${trailId}_cyan`, 'true');
    localStorage.setItem('equippedTrail', trailId);
    if (typeof bannerTrail !== 'undefined') bannerTrail = [];
    
    window.playSfx?.('spend');
    updateMenuHUD();
    showTrailBuyPanel();
    highlightSelectedCard();
}

function selectTrailEffectNew(effectId, idx) {
    window.playSfx?.('selectTrail', 0.7);
    selectedTrailEffect = effectId;
    
    // Trails específicos sin variantes de color
    const specificTrails = ['none', 'spark', 'ghost', 'fractura', 'hielo', 'toxico', 
                           'trail_vampiro', 'trail_zombie', 'trail_fire', 'trail_water', 
                           'trail_wind', 'trail_ice', 'trail_lava', 'trail_nature', 
                           'trail_custom_text'];
    
    if (specificTrails.includes(effectId)) {
        selectedTrailColor = 'cyan';
    }
    
    if (idx !== undefined) {
        activeTrailIndex = idx;
        updateTrailCardsCarousel();
    }
    highlightSelectedCard();
    showTrailBuyPanel();
}

function selectTrailColorNew(colorId) {
    window.playSfx?.('colorSelect', 0.4);
    selectedTrailColor = colorId;
    highlightSelectedCard();
    showTrailBuyPanel();
}

function showTrailBuyPanel() {
    const panel = document.getElementById('trail-buy-panel');
    if (!panel) return;

    // Trails específicos sin variantes de color
    const specificTrails = ['none', 'spark', 'ghost', 'fractura', 'hielo', 'toxico', 
                           'trail_vampiro', 'trail_zombie', 'trail_fire', 'trail_water', 
                           'trail_wind', 'trail_ice', 'trail_lava', 'trail_nature', 
                           'trail_custom_text'];

    if (specificTrails.includes(selectedTrailEffect)) {
        const trail = TRAILS_DATA.find(t => t.id === selectedTrailEffect);
        if (!trail) return;

        const owned = localStorage.getItem(`trail_${selectedTrailEffect}_cyan`) === 'true';
        const equipped = localStorage.getItem('equippedTrail') === selectedTrailEffect;
        const tt1 = shopTextos('trails');

        panel.style.display = 'block';
        panel.innerHTML = `
        <div style="display:flex; align-items:center; justify-content:space-between; height:100%; width:100%; box-sizing:border-box; font-family:monospace;">
            <div style="display:flex; flex-direction:column; justify-content:center;">
                <div class="${gemRarityClass(trail.rarity)}" style="color:${trail.rarityColor}; font-size:8px; letter-spacing:3px; margin-bottom:2px; font-weight:bold;">${trail.rarity}</div>
                <div style="color:#fff; font-size:18px; font-weight:bold;">${trail.name}</div>
                <div style="color:rgba(255,255,255,0.5); font-size:10px; margin-top:4px;">${tt1.labelTrailExclusivo ?? 'Trail exclusivo'}</div>
            </div>
            ${owned 
                ? `<button onclick="equipSpecificTrail('${selectedTrailEffect}')" type="button" style="
                    background:${equipped ? '#ffd700' : '#00ff88'};
                    color:${equipped ? '#000' : '#000'};
                    border:2px solid ${equipped ? '#ffd700' : '#00ff88'};
                    padding:12px 24px; border-radius:8px; font-weight:bold; cursor:pointer;
                ">${equipped ? (tt1.botonEquipado ?? '✔ EQUIPADO') : (tt1.botonEquipar ?? 'EQUIPAR')}</button>`
                : `<button onclick="buySpecificTrail('${selectedTrailEffect}')" type="button" style="
                    background:rgba(255,255,255,0.1);
                    color:#fff;
                    border:2px solid rgba(255,255,255,0.2);
                    padding:12px 24px; border-radius:8px; font-weight:bold; cursor:pointer;
                ">${renderPrice(trail.price, trail.priceType)}</button>`
            }
        </div>`;
        return;
    }

    if (!selectedTrailEffect || !selectedTrailColor) return;
    const trail   = TRAILS_DATA.find(t => t.id === selectedTrailEffect);
    const color   = TRAIL_COLOR_LIST.find(c => c.id === selectedTrailColor);
    if (!trail || !color) return;

    const owned    = localStorage.getItem(`trail_${selectedTrailEffect}_${selectedTrailColor}`) === 'true';
    const equipped = localStorage.getItem('equippedTrail') === `${selectedTrailEffect}_${selectedTrailColor}`;
    const purchase = getTrailPurchaseInfo(trail, color);
    const pIcon    = purchase.currency === 'gems'
        ? 'assets/UI/Common/Currency/Rubies.png'
        : 'assets/UI/Common/Currency/DEAD_COIN.png';
    const dot      = color.id === 'rgb'
        ? `<span style="font-size:13px;margin-right:3px;vertical-align:middle;">🌈</span>`
        : `<span style="display:inline-block;width:11px;height:11px;border-radius:50%;background:${color.color};vertical-align:middle;margin-right:5px;box-shadow: 0 0 6px ${color.color}cc;"></span>`;

    const tt2 = shopTextos('trails');

    panel.style.display = 'block';
    panel.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: space-between; height: 100%; width: 100%; box-sizing: border-box; font-family: monospace;">
            <!-- Left Side: Title, Details -->
            <div style="display: flex; flex-direction: column; justify-content: center; text-align: left;">
                <div style="color:rgba(255,255,255,0.36); font-size:8px; letter-spacing:3px; margin-bottom:2px; font-weight:bold;">${tt2.labelSeleccionado ?? 'SELECCIONADO'}</div>
                <div style="color:white; font-size:12px; font-weight:bold; letter-spacing:1px; margin-bottom:2px; font-family:'Geom',monospace;">
                    ${dot}${trail.name.toUpperCase()}
                </div>
                <div class="${gemRarityClass(trail.rarity)}" style="color:${trail.rarityColor}; font-size:8px; letter-spacing:2px; font-weight:bold;">
                    ${trail.rarity} · <span style="color:${color.id==='rgb'?'#ff4dff':color.color}">${color.id.toUpperCase()}</span>
                </div>
            </div>
            
            <!-- Right Side: Buy/Equip action -->
            <div style="display: flex; align-items: center; gap: 8px; margin-right: 10px;">
                ${owned
                    ? `<div style="display:flex; gap:6px; align-items:center;">
                        ${equipped
                            ? `<span style="color:#00ffe7; font-size:11px; letter-spacing:2px; font-weight:bold; text-shadow: 0 0 8px rgba(0,255,231,0.5);">${tt2.botonEquipado ?? '✔ EQUIPADO'}</span>`
                            : `<button onclick="confirmBuyTrailNew()" style="padding:6px 14px; background:rgba(0,255,231,0.12); border:1px solid #00ffe7; border-radius:8px; color:#00ffe7; font-family:'Geom',monospace; font-size:10px; letter-spacing:2px; cursor:pointer; font-weight:bold; box-shadow: 0 0 10px rgba(0,255,231,0.15); transition: 0.2s;" onmouseover="this.style.background='rgba(0,255,231,0.2)'" onmouseout="this.style.background='rgba(0,255,231,0.12)'">${tt2.botonEquipar ?? 'EQUIPAR'}</button>`
                        }
                       </div>`
                    : `<div style="display:flex; gap:8px; align-items:center;">
                        <div style="display:flex; align-items:center; gap:4px; background:rgba(0,0,0,0.3); padding:4px 8px; border-radius:6px; border:1px solid rgba(255,255,255,0.06);">
                            <img src="${pIcon}" style="width:13px; height:13px; object-fit:contain;">
                            <span style="color:white; font-size:11px; font-weight:bold;">${purchase.amount}</span>
                        </div>
                        <button onclick="confirmBuyTrailNew()" style="padding:6px 14px; background:rgba(255,238,0,0.15); border:1px solid #ffee00; border-radius:8px; color:#ffee00; font-family:'Geom',monospace; font-size:10px; letter-spacing:2px; cursor:pointer; font-weight:bold; box-shadow: 0 0 10px rgba(255,238,0,0.15); transition: 0.2s;" onmouseover="this.style.background='rgba(255,238,0,0.25)'" onmouseout="this.style.background='rgba(255,238,0,0.15)'">${tt2.botonComprar ?? 'COMPRAR'}</button>
                       </div>`
                }
            </div>
        </div>`;
}

function hideTrailBuyPanel() {
    const p = document.getElementById('trail-buy-panel');
    if (p) p.style.display = 'none';
}
window.hideTrailBuyPanel = hideTrailBuyPanel;

function confirmBuyTrailNew() {
    confirmBuyTrail();
}
window.confirmBuyTrailNew   = confirmBuyTrailNew;
window.selectTrailEffectNew = selectTrailEffectNew;
window.selectTrailColorNew  = selectTrailColorNew;
window.updateTrailCardsCarousel = updateTrailCardsCarousel;
window.initTrailCardsDrag       = initTrailCardsDrag;

// Redirigir la vista previa antigua a la nueva para no romper completeTrailPurchase
function showTrailPreview() {
    showTrailBuyPanel();
    highlightSelectedCard();
    const coins = window.playerData?.deadCoins ?? parseInt(localStorage.getItem('deadCoins') || '0');
    const gems  = window.playerData?.gems       ?? parseInt(localStorage.getItem('gems')      || '0');
    const elCoins = document.getElementById('trail-hud-coins');
    if (elCoins) elCoins.textContent = coins.toLocaleString();
    const elGems = document.getElementById('trail-hud-gems');
    if (elGems) elGems.textContent = gems.toLocaleString();
}
window.showTrailPreview = showTrailPreview;

function normalizeTrailEffectId(effect) {
    if (effect === 'trail_custom_text') return 'custom_text';
    if (!String(effect || '').startsWith('trail_')) return effect;
    const id = String(effect).substring('trail_'.length);
    if (id === 'fire') return 'fire';
    if (id === 'ice') return 'hielo';
    if (id === 'santa' || id === 'mama_claus' || id === 'navidad') return 'navidad';
    if (id === 'sonrisa_malvada') return 'risa_malvada';
    if (id === 'circo') return 'risa';
    return id;
}

function confirmBuyTrail() {
    const key = `trail_${selectedTrailEffect}_${selectedTrailColor}`;
    const owned = localStorage.getItem(key) === 'true';
    const trail = TRAILS_DATA.find(t => t.id === selectedTrailEffect);
    const color = TRAIL_COLOR_LIST.find(c => c.id === selectedTrailColor);
    const purchase = getTrailPurchaseInfo(trail, color);

    if (owned) {
        localStorage.setItem('equippedTrail', `${selectedTrailEffect}_${selectedTrailColor}`);
        if (typeof bannerTrail !== 'undefined') bannerTrail = [];
        showTrailPreview(); // refresca botón
        return;
    }

    const tt3 = shopTextos('trails');
    const sm3 = shopTextos('modal');
    showShopModal({
        kicker: tt3.kickerConfirmarCompra ?? 'CONFIRMAR TRAIL',
        title: `${trail.name} ${selectedTrailColor.toUpperCase()}`,
        fallback: tt3.fallbackImagen ?? 'TRAIL',
        body: shopPreguntaCompra(purchase.amount, purchase.currency),
        confirmText: sm3.botonSi ?? 'SI',
        cancelText: sm3.botonNo ?? 'NO',
        onConfirm: completeTrailPurchase
    });
}

function completeTrailPurchase() {
    const key = `trail_${selectedTrailEffect}_${selectedTrailColor}`;
    const trail = TRAILS_DATA.find(t => t.id === selectedTrailEffect);
    const color = TRAIL_COLOR_LIST.find(c => c.id === selectedTrailColor);
    const purchase = getTrailPurchaseInfo(trail, color);
    const tt4 = shopTextos('trails');

    // Comprar
    if (purchase.currency === 'gems') {
        let gems = parseInt(localStorage.getItem('gems') || '0');
        if (gems < purchase.amount) { alert(tt4.alertaSinGemas ?? '¡No tienes suficientes gemas!'); return; }
        gems -= purchase.amount;
        localStorage.setItem('gems', gems);
        document.getElementById('shop-gems').textContent = gems;
    } else {
        let coins = parseInt(localStorage.getItem('deadCoins') || '0');
        if (coins < purchase.amount) { alert(tt4.alertaSinCoins ?? '¡No tienes suficientes Dead Coins!'); return; }
        coins -= purchase.amount;
        localStorage.setItem('deadCoins', coins);
        playerData.deadCoins = coins;
        document.getElementById('shop-coins').textContent = coins;
    }

    localStorage.setItem(key, 'true');
    window.playSfx?.('spend');
    localStorage.setItem('equippedTrail', `${selectedTrailEffect}_${selectedTrailColor}`);
    if (typeof bannerTrail !== 'undefined') bannerTrail = [];
    updateMenuHUD();
    showTrailPreview();
}

function cancelTrailPreview() {
    document.getElementById('trail-preview-panel').style.display = 'none';
    if (previewTrailAnim) { cancelAnimationFrame(previewTrailAnim); previewTrailAnim = null; }
    selectedTrailColor = null;
}

function getRubyPassState() {
    if ((window.player?.name || '').toUpperCase() === 'LEX' && localStorage.getItem('rubyPassDebugReset_2026_05_20') !== 'true') {
        localStorage.setItem('rubyPassXp', '0');
        localStorage.setItem('rubyPassLevel', '1');
        localStorage.setItem('rubyPassPremiumLevel', '1');
        localStorage.setItem('rubyPassDebugReset_2026_05_20', 'true');
    }
    if (localStorage.getItem('rubyPassPremiumRelock_2026_05_21') !== 'true') {
        localStorage.removeItem('rubyPassPremiumOwned');
        localStorage.setItem('rubyPassPremiumLevel', '1');
        RUBY_PASS_REWARDS.forEach(reward => localStorage.removeItem(`rubyPassClaimed_premium_${reward.level}`));
        localStorage.setItem('rubyPassPremiumRelock_2026_05_21', 'true');
    }
    const xp = parseInt(localStorage.getItem('rubyPassXp') || '0');
    const freeLevel = getRubyPassLevelFromXp(xp);
    const premiumOwned = localStorage.getItem('rubyPassPremiumOwned') === 'true';
    const premiumLevel = premiumOwned ? parseInt(localStorage.getItem('rubyPassPremiumLevel') || String(freeLevel)) : 0;
    return { xp, freeLevel, premiumOwned, premiumLevel };
}

function hasRubyPassClaimableRewards() {
    const state = getRubyPassState();
    return RUBY_PASS_REWARDS.some(reward => {
        const freeReady = reward.level <= state.freeLevel && localStorage.getItem(`rubyPassClaimed_free_${reward.level}`) !== 'true';
        const premiumReady = state.premiumOwned && reward.level <= state.premiumLevel && localStorage.getItem(`rubyPassClaimed_premium_${reward.level}`) !== 'true';
        return freeReady || premiumReady;
    });
}

function resetRubyPassXpDev() {
    localStorage.setItem('rubyPassXp', '0');
    localStorage.setItem('rubyPassLevel', '1');
    localStorage.setItem('rubyPassPremiumLevel', '1');
    RUBY_PASS_REWARDS.forEach(reward => {
        localStorage.removeItem(`rubyPassClaimed_free_${reward.level}`);
        localStorage.removeItem(`rubyPassClaimed_premium_${reward.level}`);
    });
    renderBattlePassPage(document.getElementById('rubyPassContent'));
}

function getRubyPassLevelFromXp(xp) {
    let level = 1;
    for (const reward of RUBY_PASS_REWARDS) {
        if (xp >= reward.xp) level = reward.level;
        else break;
    }
    return level;
}

function getRubyPassProgress(xp, level) {
    const prevXp = RUBY_PASS_REWARDS.filter(r => r.level <= level).at(-1)?.xp || 0;
    const nextReward = RUBY_PASS_REWARDS.find(r => r.level > level) || RUBY_PASS_REWARDS[RUBY_PASS_REWARDS.length - 1];
    return Math.min(1, Math.max(0, (xp - prevXp) / Math.max(1, nextReward.xp - prevXp)));
}

function getRubyPassRotation(level) {
    let rewardIndex = 0;
    for (let i = 0; i < RUBY_PASS_REWARDS.length; i++) {
        if (RUBY_PASS_REWARDS[i].level <= level) rewardIndex = i;
        else break;
    }
    return -Math.max(0, rewardIndex) * (360 / RUBY_PASS_REWARDS.length);
}

function unlockRubyPassPremium() {
    const state = getRubyPassState();
    if (state.premiumOwned) return;

    const gems = parseInt(localStorage.getItem('gems') || '0');
    if (gems < RUBY_PASS_PREMIUM_COST_GEMS) {
        alert('Necesitas ' + RUBY_PASS_PREMIUM_COST_GEMS + ' rubies para activar el carril premium.');
        return;
    }

    localStorage.setItem('gems', gems - RUBY_PASS_PREMIUM_COST_GEMS);
    localStorage.setItem('rubyPassPremiumOwned', 'true');
    localStorage.setItem('rubyPassPremiumLevel', '1');
    updateMenuHUD();

    const content = document.getElementById('rubyPassContent');
    renderBattlePassPage(content, { premiumCatchUpFrom: 1 });

    requestAnimationFrame(() => {
        const premiumLane = document.querySelector('.ruby-pass-lane-premium');
        if (!premiumLane) return;
        premiumLane.classList.add('is-catching-up');
        premiumLane.style.setProperty('--premium-rotation', getRubyPassRotation(state.freeLevel) + 'deg');
    });

    setTimeout(() => {
        localStorage.setItem('rubyPassPremiumLevel', String(state.freeLevel));
        if (document.getElementById('rubyPassPanel')?.style.display !== 'none') {
            renderBattlePassPage(content);
        }
    }, 1250);
}

function grantRubyPassPremiumFromPayment() {
    const state = getRubyPassState();
    localStorage.setItem('rubyPassPremiumOwned', 'true');
    localStorage.setItem('rubyPassPremiumLevel', String(state.freeLevel));
    if (document.getElementById('rubyPassPanel')?.style.display !== 'none') {
        renderBattlePassPage(document.getElementById('rubyPassContent'));
    }
}

function addRubyPassXp(amount = RUBY_PASS_XP_PER_WIN) {
    const state = getRubyPassState();
    const xp = state.xp + amount;
    const freeLevel = getRubyPassLevelFromXp(xp);
    localStorage.setItem('rubyPassXp', String(xp));
    localStorage.setItem('rubyPassLevel', String(freeLevel));
    if (state.premiumOwned) localStorage.setItem('rubyPassPremiumLevel', String(freeLevel));
    return {
        xp,
        level: freeLevel,
        gained: amount,
        previousXp: state.xp,
        previousLevel: state.freeLevel,
        previousPremiumLevel: state.premiumLevel
    };
}

window.addRubyPassXp = addRubyPassXp;
window.grantRubyPassPremiumFromPayment = grantRubyPassPremiumFromPayment;

function addRubyPassXpDev(amount = 250) {
    const result = addRubyPassXp(amount);
    if (document.getElementById('rubyPassPanel')?.style.display !== 'none') {
        renderBattlePassPage(document.getElementById('rubyPassContent'), {
            animateFrom: {
                xp: result.previousXp,
                freeLevel: result.previousLevel,
                premiumLevel: result.previousPremiumLevel
            }
        });
    }
}

// ── Helpers del banner de Premium (Parte #4 del plan) ──
// Cuando el jugador NO tiene premium: junta las próximas 3 recompensas
// premium que se está perdiendo, para mostrarlas como preview en el CTA.
function getRubyPassUpcomingPremiumRewards(state, count) {
    return RUBY_PASS_REWARDS
        .filter(reward => reward.level > state.premiumLevel)
        .slice(0, count);
}

// Cuando el jugador SÍ tiene premium: cuenta cuántas recompensas premium
// ya desbloqueadas todavía no reclamó — ese es el dato útil que reemplaza
// al CTA de compra en el mismo espacio (nunca queda vacío).
function getRubyPassClaimablePremiumCount(state) {
    return RUBY_PASS_REWARDS.filter(reward => {
        if (reward.level > state.premiumLevel) return false;
        return localStorage.getItem(`rubyPassClaimed_premium_${reward.level}`) !== 'true';
    }).length;
}

// ── Countdown de temporada (Parte #3 del plan) ──
// Lee settings.seasonEndsAt de rubypass.config.js (fecha 'YYYY-MM-DD').
// Si Felipe todavía no cargó la fecha real, devuelve null y el HTML
// no muestra el countdown (no inventa datos falsos).
function getRubyPassSeasonCountdown() {
    const cfg = window.RUBY_PASS_CONFIG;
    const endsAt = cfg && cfg.settings && cfg.settings.seasonEndsAt;
    if (!endsAt) return null;
    const end = new Date(endsAt + 'T23:59:59');
    const now = new Date();
    const diffMs = end.getTime() - now.getTime();
    if (Number.isNaN(diffMs)) return null;
    if (diffMs <= 0) return { expired: true, label: 'TEMPORADA FINALIZADA' };
    const totalHours = Math.ceil(diffMs / 3600000);
    const days = Math.floor(totalHours / 24);
    const hours = totalHours % 24;
    const label = days > 0 ? `${days}d ${hours}h` : `${hours}h`;
    return { expired: false, label };
}

function claimRubyPassReward(lane, level, rewardType) {
    const state = getRubyPassState();
    const unlocked = lane === 'free' ? level <= state.freeLevel : state.premiumOwned && level <= state.premiumLevel;
    if (!unlocked) return;
    const reward = RUBY_PASS_REWARDS.find(item => item.level === level);
    const rewardData = lane === 'premium' ? reward?.premium : reward?.free;
    const key = `rubyPassClaimed_${lane}_${level}`;
    if (localStorage.getItem(key) === 'true') {
        showRubyPassToast('YA RECLAMADO');
        return;
    }
    localStorage.setItem(key, 'true');
    window.playSfx?.('passReward', 0.9);
    const currencyReward = { coins: 0, gems: 0 };
    if (rewardData?.type === 'coins') {
        currencyReward.coins = rewardData.amount || (window.getRubyPassAmount ? window.getRubyPassAmount(level, 'coins') : 50);
        addCurrency(currencyReward.coins, 'coins');
    }
    if (rewardData?.type === 'rubies') {
        currencyReward.gems = rewardData.amount || (window.getRubyPassAmount ? window.getRubyPassAmount(level, 'gems') : 3);
        addCurrency(currencyReward.gems, 'gems');
    }
    if (rewardData?.type === 'emote') {
        const passEmote = EMOTES_DATA.find(emote => emote.passOnly && emote.rubyPassLane === lane && emote.rubyPassLevel === level);
        if (passEmote) localStorage.setItem('emote_' + passEmote.id, 'true');
    }
    if (rewardData?.type === 'chest') {
        showChestClaimOptions(getChestFromReward(rewardData), `${lane === 'premium' ? 'PREMIUM' : 'FREE'} NIVEL ${level}`);
    } else {
        showRubyPassRewardModal(lane, level, rewardData || { type: rewardType }, currencyReward);
    }
    const el = document.querySelector(`[data-ruby-claim="${lane}_${level}"]`);
    if (el) {
        el.classList.add('is-claiming', 'is-claimed');
        setTimeout(() => el.classList.remove('is-claiming'), 520);
    }
}

function showRubyPassRewardModal(lane, level, reward, currencyReward = {}) {
    const currencyHTML = renderCurrencyRewardPiles(currencyReward);
    showShopModal({
        kicker: `${lane === 'premium' ? 'PREMIUM' : 'FREE'} NIVEL ${level}`,
        title: getRewardLabel(reward),
        image: currencyHTML ? null : (reward.image || RUBY_PASS_REWARD_PLACEHOLDER),
        mediaHTML: currencyHTML || null,
        mediaClass: currencyHTML ? 'wide' : '',
        fallback: reward.type?.toUpperCase() || 'PNG',
        body: 'Recompensa reclamada. Ya puedes seguir avanzando.',
        cancelText: null,
        confirmText: 'CERRAR'
    });
}

function getRewardLabel(reward) {
    const labels = {
        banner: 'Banner',
        chest: 'Cofre',
        emote: 'Emote',
        frame: 'Marco',
        rubies: 'Rubies',
        skin: 'Skin',
        trail: 'Trail'
    };
    return labels[reward?.type] || 'Recompensa';
}

function showRubyPassToast(text) {
    let toast = document.getElementById('ruby-pass-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'ruby-pass-toast';
        document.body.appendChild(toast);
    }
    toast.textContent = text;
    toast.classList.remove('showing');
    void toast.offsetWidth;
    toast.classList.add('showing');
    setTimeout(() => toast.classList.remove('showing'), 1300);
}

function renderBattlePassPage(container, options = {}) {
    const state = getRubyPassState();
    const currentLevel = state.freeLevel;
    const currentXp = state.xp;
    const progress = getRubyPassProgress(currentXp, currentLevel);
    const renderXp = options.animateFrom?.xp ?? currentXp;
    const renderFreeLevel = options.animateFrom?.freeLevel ?? currentLevel;
    const renderProgress = getRubyPassProgress(renderXp, renderFreeLevel);
    const visibleRewards = RUBY_PASS_REWARDS;
    const seasonCountdown = getRubyPassSeasonCountdown();
    const profileName = localStorage.getItem('playerName') || 'Jugador';
    const profileAvatar = localStorage.getItem('playerAvatar') || 'assets/UI/Common/Avatars/Avatar_Default.png';
    const bannerId = localStorage.getItem('equippedBanner') || 'Banner_Deafult';
    const banner = findBannerById(bannerId) || BANNERS_DATA[0];
    const profileBannerBg = banner.cover
        ? `linear-gradient(90deg, rgba(5,6,12,0.88), rgba(5,6,12,0.34)), url('${banner.cover}')`
        : 'linear-gradient(135deg, rgba(0,255,231,0.18), rgba(255,77,109,0.16))';

    container.innerHTML = `
        <div class="ruby-pass-screen ${state.premiumOwned ? 'is-premium-owned' : 'is-premium-locked'}" style="${RUBY_PASS_ASSETS.background ? `background-image:linear-gradient(90deg, rgba(5,0,8,0.96), rgba(10,0,5,0.74)), url('${RUBY_PASS_ASSETS.background}')` : ''}">
            <div class="ruby-pass-topbar">
                <div class="ruby-pass-profile" style="background-image:${profileBannerBg};">
                    <div class="ruby-pass-profile-avatar" style="background-image:url('${profileAvatar}')"></div>
                    <div>
                        <div class="ruby-pass-profile-name">${profileName}</div>
                        <div class="ruby-pass-profile-sub">${banner.name || 'Banner'}</div>
                    </div>
                </div>
                <div class="ruby-pass-season">
                    <span>NIVEL ${currentLevel}</span>
                    <strong>${currentXp} XP</strong>
                </div>
                ${seasonCountdown ? `
                <div class="ruby-rail-countdown ${seasonCountdown.expired ? 'is-expired' : ''}">
                    TERMINA EN<b>${seasonCountdown.label}</b>
                </div>` : ''}
                <button onclick="closeRubyPass()" class="ruby-pass-back" type="button">VOLVER</button>
            </div>

            <div class="ruby-pass-stage">
                ${RUBY_PASS_ASSETS.seasonBanner ? `
                <div class="ruby-rail-showcase-banner">
                    <img src="${RUBY_PASS_ASSETS.seasonBanner}" alt="" draggable="false"
                        onerror="this.closest('.ruby-rail-showcase-banner').style.display='none'">
                </div>` : ''}

                <div class="ruby-rail-top-row">
                    ${renderRubyPassNextShowcase(state, currentLevel)}
                    <button class="ruby-rail-viewall-btn" onclick="openRubyPassGallery()" type="button">VER TODO</button>
                </div>

                <div class="ruby-rail-stage">
                    <div class="ruby-rail-scroll" id="rubyRailScroll">
                        <div class="ruby-rail-group ${state.premiumOwned ? '' : 'is-premium-locked'}">
                            <div class="ruby-rail-nodes is-premium">
                                ${visibleRewards.map(reward => renderRubyPassRailNode(reward, state.premiumLevel, 'premium', state.premiumOwned)).join('')}
                            </div>
                            <div class="ruby-rail-bar-slot is-premium"></div>

                            <div class="ruby-rail-path">
                                <div class="ruby-rail-path-track">
                                    <div class="ruby-rail-path-fill" style="width:${Math.round(renderProgress * 100)}%;"></div>
                                </div>
                                <div class="ruby-rail-path-spark" style="left:${Math.round(renderProgress * 100)}%;"></div>
                            </div>

                            <div class="ruby-rail-bar-slot is-free"></div>
                            <div class="ruby-rail-nodes is-free">
                                ${visibleRewards.map(reward => renderRubyPassRailNode(reward, currentLevel, 'free', true)).join('')}
                            </div>
                        </div>
                    </div>
                </div>

                <div class="ruby-rail-bottom-row">
                ${state.premiumOwned ? `
                <div class="ruby-rail-premium-banner is-owned">
                    <div class="ruby-rail-premium-banner-text">
                        <b>PREMIUM ACTIVO ✓</b>
                        <span>${(() => {
                    const ready = getRubyPassClaimablePremiumCount(state);
                    return ready > 0
                        ? `${ready} recompensa${ready === 1 ? '' : 's'} premium esperando reclamo`
                        : 'Estás al día con tus recompensas premium';
                })()}</span>
                    </div>
                </div>` : `
                <div class="ruby-rail-premium-banner">
                    <div class="ruby-rail-premium-banner-text">
                        <b>Activá el Ruby Pass Premium</b>
                        <span>Desbloqueá estas recompensas y muchas más antes de que termine la temporada</span>
                    </div>
                    <div class="ruby-rail-premium-previews">
                        ${getRubyPassUpcomingPremiumRewards(state, 3).map(reward => `
                        <div class="ruby-rail-premium-preview-icon">${renderRewardIcon(reward.premium, 'premium', reward.level)}</div>
                        `).join('')}
                    </div>
                    <button class="ruby-rail-premium-banner-btn" onclick="unlockRubyPassPremium()" type="button">DESBLOQUEAR · ${RUBY_PASS_PREMIUM_COST_GEMS} <img src="${getCurrencyPileAsset('gems', 1)}" alt="" draggable="false"></button>
                </div>`}

                ${renderRubyRailMissionsSummary()}
                </div>

                <div class="ruby-pass-focus">
                    <div class="ruby-pass-focus-copy">
                        <div class="ruby-pass-kicker">${state.premiumOwned ? 'VIP ACTIVO' : 'PASE FREE / VIP'}</div>
                        <h3>RUBY PASS</h3>
                        <p>${Math.round(renderProgress * 100)}% PROGRESO</p>
                        <div class="ruby-pass-xpbar"><span style="width:${Math.round(renderProgress * 100)}%;"></span></div>
                    </div>
                    <button class="ruby-pass-dev" onclick="addRubyPassXpDev()" type="button">DEV +250 XP</button>
                    <button class="ruby-pass-dev" onclick="resetRubyPassXpDev()" type="button">DEV RESET XP</button>
                </div>
            </div>
        </div>
    `;

    if (options.animateFrom) {
        animateRubyPassProgress(container, { progress });
    }
    initRubyPassRail(container);
}

// Anima solo la barra de XP del panel focus (el resto de la animación
// vieja —rotación de los anillos— se borró junto con el círculo).
// TODO (parte 4): la vidriera de "próxima recompensa" probablemente
// quiera su propia transición al ganar XP; se suma ahí, no acá.
function animateRubyPassProgress(container, target) {
    requestAnimationFrame(() => {
        const fill = Math.round(target.progress * 100) + '%';
        const xpFill = container.querySelector('.ruby-pass-xpbar span');
        if (xpFill) xpFill.style.width = fill;
    });
}

// Reemplaza a initRubyPassDrag(): ya no hay que rotar nada ni adivinar
// en qué nodo hizo click el jugador por distancia — cada nodo del
// riel tiene su propio onclick directo. Lo único que hace esta
// función es centrar el scroll horizontal en el nivel actual al
// abrir el pase, para que el jugador no tenga que buscarlo.
function initRubyPassRail(container) {
    const scroller = container.querySelector('#rubyRailScroll');
    const current = container.querySelector('.ruby-rail-node.is-current');
    if (!scroller || !current) return;
    requestAnimationFrame(() => {
        const target = current.offsetLeft - (scroller.clientWidth / 2) + (current.offsetWidth / 2);
        scroller.scrollLeft = Math.max(0, target);
    });
}

// Nodo del riel horizontal (reemplaza a renderRubyPassNode, que
// posicionaba todo con trigonometría circular). Mantiene el mismo
// data-ruby-claim que ya usa claimRubyPassReward() para no tocar esa
// lógica, y agrega el onclick directo (antes el click se resolvía
// por distancia al nodo más cercano en initRubyPassDrag — ya no hace
// falta con un riel recto).
function renderRubyPassRailNode(reward, currentLevelForLane, lane, laneActive) {
    const unlocked = laneActive && reward.level <= currentLevelForLane;
    const rewardData = lane === 'premium' ? reward.premium : reward.free;
    const claimed = localStorage.getItem(`rubyPassClaimed_${lane}_${reward.level}`) === 'true';
    const claimable = unlocked && !claimed;
    const isCurrent = laneActive && reward.level === currentLevelForLane;
    return `
        <div class="ruby-rail-node ${isCurrent ? 'is-current' : ''}">
            <button type="button"
                class="ruby-rail-node-icon ${unlocked ? 'is-unlocked' : ''} ${claimable ? 'is-claimable' : ''} ${laneActive ? '' : 'is-locked'} ${claimed ? 'is-claimed' : ''}"
                data-ruby-claim="${lane}_${reward.level}"
                data-reward-type="${rewardData.type}"
                onclick="claimRubyPassReward('${lane}', ${reward.level}, '${rewardData.type}')"
                title="${lane === 'premium' ? 'Premium' : 'Free'} nivel ${reward.level}">
                ${renderRewardIcon(rewardData, lane, reward.level)}
            </button>
            <span class="ruby-rail-node-level">${reward.level}</span>
        </div>
    `;
}

// Parte #2: busca qué recompensa mostrar en la "vidriera" de próxima
// recompensa. Prioriza el carril premium (es la pieza más atractiva —
// skins/emotes — y la que más empuja la compra del pase VIP). Si el
// jugador ya reclamó todo lo premium disponible, muestra la última
// como referencia (no debería pasar con 30 niveles, pero por las dudas).
function getRubyPassNextShowcaseReward(state, currentLevel) {
    const next = RUBY_PASS_REWARDS.find(r =>
        r.level >= currentLevel &&
        localStorage.getItem(`rubyPassClaimed_premium_${r.level}`) !== 'true'
    );
    return next || RUBY_PASS_REWARDS[RUBY_PASS_REWARDS.length - 1];
}

function renderRubyPassNextShowcase(state, currentLevel) {
    const reward = getRubyPassNextShowcaseReward(state, currentLevel);
    // "Borrosa" solo si todavía no llegó a ese nivel (es una recompensa
    // futura real, no una ya alcanzada pero sin reclamar) — el efecto es
    // para generar curiosidad ("¿qué es esa skin del nivel 12?"), no para
    // ocultar algo que el jugador ya podría reclamar.
    const isFuture = reward.level > currentLevel;
    return `
        <div class="ruby-rail-next-showcase">
            <div class="ruby-rail-next-showcase-frame">
                <div class="ruby-rail-next-showcase-icon ${isFuture ? 'is-future' : ''}">
                    ${renderRewardIcon(reward.premium, 'premium', reward.level)}
                </div>
                ${isFuture ? '<span class="ruby-rail-next-showcase-mark">?</span>' : ''}
            </div>
            <div class="ruby-rail-next-showcase-text">
                <span>PRÓXIMA RECOMPENSA VIP</span>
                <b>NIVEL ${reward.level}</b>
            </div>
        </div>
    `;
}


// ── Parte #6: galería completa "ver todo" (gratis / premium) ──
// Reutiliza RUBY_PASS_REWARDS y renderRewardIcon() tal cual (no se
// tocan). El único agregado real es claimFromRubyPassGallery(), un
// wrapper fino sobre claimRubyPassReward() — la lógica de reclamo no
// se duplica, solo se asegura de refrescar las DOS vistas (galería +
// riel) ya que pueden convivir en el DOM al mismo tiempo (el riel
// sigue detrás del modal) y claimRubyPassReward() solo actualiza el
// primer nodo que encuentra con ese data-ruby-claim.
function renderRubyPassGalleryRow(reward, lane, currentLevelForLane, laneActive) {
    const unlocked = laneActive && reward.level <= currentLevelForLane;
    const rewardData = lane === 'premium' ? reward.premium : reward.free;
    const claimed = localStorage.getItem(`rubyPassClaimed_${lane}_${reward.level}`) === 'true';
    const claimable = unlocked && !claimed;
    return `
        <button type="button"
            class="ruby-gallery-row ${claimable ? 'is-claimable' : ''} ${claimed ? 'is-claimed' : ''} ${unlocked ? '' : 'is-locked'}"
            data-ruby-claim="${lane}_${reward.level}"
            onclick="claimFromRubyPassGallery('${lane}', ${reward.level}, '${rewardData.type}')"
            title="Nivel ${reward.level}">
            <span class="ruby-gallery-row-level">${reward.level}</span>
            <span class="ruby-gallery-row-icon ${unlocked ? '' : 'is-future'}">${renderRewardIcon(rewardData, lane, reward.level)}</span>
            ${claimed ? '<span class="ruby-gallery-row-check">&check;</span>' : ''}
        </button>`;
}

function renderRubyPassGalleryColumn(lane, state) {
    const currentLevelForLane = lane === 'premium' ? state.premiumLevel : state.freeLevel;
    const laneActive = lane === 'premium' ? state.premiumOwned : true;
    return `
        <div class="ruby-gallery-column is-${lane} ${laneActive ? '' : 'is-locked'}">
            <div class="ruby-gallery-column-head">${lane === 'premium' ? 'PREMIUM' : 'GRATIS'}</div>
            <div class="ruby-gallery-column-rows">
                ${RUBY_PASS_REWARDS.map(reward => renderRubyPassGalleryRow(reward, lane, currentLevelForLane, laneActive)).join('')}
            </div>
        </div>`;
}

function renderRubyPassGalleryPage() {
    const state = getRubyPassState();
    return `
        <section class="ruby-gallery-panel">
            <button class="ruby-gallery-close" onclick="closeRubyPassGallery()" type="button">X</button>
            <div class="ruby-gallery-header">
                <span>RUBY PASS</span>
                <strong>TODAS LAS RECOMPENSAS</strong>
            </div>
            <div class="ruby-gallery-columns">
                ${renderRubyPassGalleryColumn('free', state)}
                ${renderRubyPassGalleryColumn('premium', state)}
            </div>
        </section>`;
}

function ensureRubyPassGalleryModal() {
    let modal = document.getElementById('rubyPassGalleryModal');
    if (modal) return modal;
    modal = document.createElement('div');
    modal.id = 'rubyPassGalleryModal';
    modal.className = 'ruby-gallery-modal';
    modal.addEventListener('click', event => {
        if (event.target === modal) closeRubyPassGallery();
    });
    document.body.appendChild(modal);
    return modal;
}

function openRubyPassGallery() {
    const modal = ensureRubyPassGalleryModal();
    modal.innerHTML = renderRubyPassGalleryPage();
    modal.style.display = 'grid';
}

function closeRubyPassGallery() {
    const modal = document.getElementById('rubyPassGalleryModal');
    if (modal) modal.style.display = 'none';
}

// Reclama vía claimRubyPassReward() de siempre (cero lógica nueva de
// reclamo) y después refresca ambas vistas para que no queden
// desincronizadas entre sí.
function claimFromRubyPassGallery(lane, level, type) {
    claimRubyPassReward(lane, level, type);
    openRubyPassGallery();
    const rubyContent = document.getElementById('rubyPassContent');
    if (rubyContent) renderBattlePassPage(rubyContent);
}
window.openRubyPassGallery = openRubyPassGallery;
window.closeRubyPassGallery = closeRubyPassGallery;
window.claimFromRubyPassGallery = claimFromRubyPassGallery;

function renderRewardIcon(reward, lane, level) {
    if (reward.image) return `<img src="${reward.image}" alt="" draggable="false">`;
    if (reward.type === 'coins') {
        const amount = reward.amount || (window.getRubyPassAmount ? window.getRubyPassAmount(level, 'coins') : 50);
        return `<img class="ruby-pass-currency-img" src="${getCurrencyPileAsset('coins', amount)}" alt="" draggable="false">`;
    }
    if (reward.type === 'rubies') {
        const amount = reward.amount || (window.getRubyPassAmount ? window.getRubyPassAmount(level, 'gems') : 3);
        return `<img class="ruby-pass-currency-img" src="${getCurrencyPileAsset('gems', amount)}" alt="" draggable="false">`;
    }
    const slot = reward.slot ? `${lane}_${reward.slot}` : `${lane}_${reward.type}`;
    return `<div class="ruby-pass-placeholder ruby-pass-${reward.type}" data-asset-slot="RUBY_PASS_ASSET_SLOT_${slot.toUpperCase()}"></div>`;
}

// =====================================================
// TIENDA RUBY — paquetes de monedas/gemas (dinero real) +
// conversión interna coins <-> gems (gratis, tasa fija).
// Reemplaza a la vieja pantalla suelta de "CONVERSIÓN": ahora
// esa misma sección del nav ('conversion') abre este panel con
// pestañas [COMPRAR | CONVERTIR].
// =====================================================

// Paquetes de monedas — usa los assets de contenedores ya generados
// (carpeta assets/UI/Common/Rewards/Currency/Coins/). Ajusta 'price'
// cuando conectes una pasarela de pago real (Google Play Billing,
// Stripe, etc.) — por ahora 'price' es solo el texto que se muestra.
const RUBY_SHOP_COIN_PACKAGES = [
    { id: 'coins_manojo', name: 'Manojo de Monedas', amount: 500, bonus: 0, price: '$0.99', image: 'assets/UI/Common/Rewards/Currency/Coins/Monojo_de_monedas.png' },
    { id: 'coins_saco', name: 'Saco de Monedas', amount: 1200, bonus: 10, price: '$2.49', image: 'assets/UI/Common/Rewards/Currency/Coins/Saco_de_monedas.png' },
    { id: 'coins_caja', name: 'Caja de Monedas', amount: 2600, bonus: 15, price: '$4.99', image: 'assets/UI/Common/Rewards/Currency/Coins/Caja_de_monedas.png' },
    { id: 'coins_cofre', name: 'Cofre de Monedas', amount: 5500, bonus: 20, price: '$9.99', image: 'assets/UI/Common/Rewards/Currency/Coins/Cofre_grande_de_monedas.png', best: true },
    { id: 'coins_baul', name: 'Baúl de Monedas', amount: 12000, bonus: 25, price: '$19.99', image: 'assets/UI/Common/Rewards/Currency/Coins/Baúl_de_monedas.png' },
    { id: 'coins_arca', name: 'Arca de Monedas', amount: 28000, bonus: 35, price: '$39.99', image: 'assets/UI/Common/Rewards/Currency/Coins/Arca_de_monedas.png' },
];

// Paquetes de gemas (rubies) — carpeta .../Currency/Gems/
const RUBY_SHOP_GEM_PACKAGES = [
    { id: 'gems_manojo', name: 'Manojo de Gemas', amount: 60, bonus: 0, price: '$0.99', image: 'assets/UI/Common/Rewards/Currency/Gems/Monojo_de_gemas.png' },
    { id: 'gems_saco', name: 'Bolsa de Gemas', amount: 150, bonus: 10, price: '$2.49', image: 'assets/UI/Common/Rewards/Currency/Gems/Saco_de_gemas.png' },
    { id: 'gems_cofrecillo', name: 'Cofrecillo de Gemas', amount: 340, bonus: 15, price: '$4.99', image: 'assets/UI/Common/Rewards/Currency/Gems/Cofrecillo_de_gemas.png', best: true },
    { id: 'gems_cristal', name: 'Cofre de Cristal', amount: 720, bonus: 20, price: '$9.99', image: 'assets/UI/Common/Rewards/Currency/Gems/Cofre_de_cristal.png' },
    { id: 'gems_relicario', name: 'Relicario de Gemas', amount: 1600, bonus: 25, price: '$19.99', image: 'assets/UI/Common/Rewards/Currency/Gems/Relicario_de_gemas.png' },
    { id: 'gems_geoda', name: 'Geoda de Gemas', amount: 3800, bonus: 35, price: '$39.99', image: 'assets/UI/Common/Rewards/Currency/Gems/Geoda_de_gemas.png' },
];

let rubyShopActiveTab = 'comprar';

// Abre la Tienda Ruby directamente (botón carrito, visible en toda la tienda).
// Reutiliza el mismo id de sección 'conversion' que ya maneja showShopSection,
// así no hay que tocar el arreglo de navegación ni la lógica de estilos del nav.
function openRubyShop() {
    showShopSection('conversion');
}
window.openRubyShop = openRubyShop;

// Punto de entrada de la sección (nav 'conversion' -> este panel)
function renderRubyShopPage(container) {
    const ct = shopTextos('conversion');
    container.innerHTML = `
        <div style="position:relative; display:flex; align-items:center; min-height:38px; margin-bottom:22px; flex-wrap:wrap;">
            <div style="display:flex; gap:8px;">
                <button id="ruby-tab-comprar" onclick="switchRubyShopTab('comprar')" style="padding:10px 22px; border-radius:8px 8px 0 0; border:1px solid rgba(255,255,255,0.1); border-bottom:none; background:rgba(255,238,0,0.1); color:#ffee00; font-family:monospace; font-size:12px; letter-spacing:2px; cursor:pointer;">${ct.tabComprar ?? 'COMPRAR'}</button>
                <button id="ruby-tab-convertir" onclick="switchRubyShopTab('convertir')" style="padding:10px 22px; border-radius:8px 8px 0 0; border:1px solid transparent; background:none; color:rgba(255,255,255,0.4); font-family:monospace; font-size:12px; letter-spacing:2px; cursor:pointer;">${ct.tabConvertir ?? 'CONVERTIR'}</button>
            </div>

            <div class="ruby-shop-gem-title" style="position:absolute; left:50%; top:50%; transform:translate(-50%, -50%);">${ct.tituloTienda ?? 'TIENDA RUBY'}</div>

            <div style="position:absolute; right:0; top:50%; transform:translateY(-50%);">${shopBotonVolverHtml()}</div>
        </div>

        <div id="ruby-shop-tab-body"></div>
    `;
    rubyShopActiveTab = 'comprar';
    renderRubyShopTabBody();
}

function switchRubyShopTab(tab) {
    rubyShopActiveTab = tab;
    const cBtn = document.getElementById('ruby-tab-comprar');
    const vBtn = document.getElementById('ruby-tab-convertir');
    if (cBtn && vBtn) {
        const on = { background: 'rgba(255,238,0,0.1)', color: '#ffee00', border: '1px solid rgba(255,255,255,0.1)', borderBottom: 'none' };
        const off = { background: 'none', color: 'rgba(255,255,255,0.4)', border: '1px solid transparent' };
        Object.assign(cBtn.style, tab === 'comprar' ? on : off);
        Object.assign(vBtn.style, tab === 'convertir' ? on : off);
    }
    renderRubyShopTabBody();
}

function renderRubyShopTabBody() {
    const body = document.getElementById('ruby-shop-tab-body');
    if (!body) return;
    if (rubyShopActiveTab === 'convertir') {
        body.innerHTML = renderConversionTabHtml();
    } else {
        body.innerHTML = renderRubyPackagesTabHtml();
    }
}

function rubyPackCardHtml(pack, currency) {
    const accent = currency === 'gems' ? '#ff4d6d' : '#ffee00';
    const accentBg = currency === 'gems' ? 'rgba(255,77,109,0.08)' : 'rgba(255,238,0,0.08)';
    const icon = currency === 'gems' ? 'assets/UI/Common/Currency/Rubies.png' : 'assets/UI/Common/Currency/DEAD_COIN.png';
    return `
        <div style="position:relative; background:rgba(255,255,255,0.03); border:1px solid ${pack.best ? accent : 'rgba(255,255,255,0.08)'}; border-radius:14px; padding:18px 14px; text-align:center; display:flex; flex-direction:column; align-items:center; gap:8px;">
            ${pack.best ? `<div style="position:absolute; top:8px; right:8px; background:${accent}; color:#0a0a0a; font-size:9px; font-weight:bold; letter-spacing:1px; padding:3px 8px; border-radius:6px;">${currency === 'gems' ? 'MÁS POPULAR' : 'MEJOR VALOR'}</div>` : ''}
            <img src="${pack.image}" onerror="this.src='${SHOP_PLACEHOLDER_IMAGE}'" style="width:64px; height:64px; object-fit:contain; margin-top:6px;">
            <div style="color:white; font-family:monospace; font-size:12px; letter-spacing:0.5px;">${pack.name}</div>
            <div style="display:flex; align-items:center; gap:6px; font-family:monospace; font-size:17px; font-weight:bold; color:white;">
                <img src="${icon}" style="width:14px;height:14px;object-fit:contain;">${pack.amount.toLocaleString()}
            </div>
            ${pack.bonus > 0 ? `<div style="font-size:10px; color:${accent}; background:${accentBg}; padding:2px 8px; border-radius:6px; letter-spacing:0.5px;">+${pack.bonus}% BONUS</div>` : '<div style="height:18px;"></div>'}
            <button onclick="buyCurrencyPackage('${currency}', ${pack.amount}, '${pack.name.replace(/'/g, "\\'")}', '${pack.price}')"
                style="width:100%; margin-top:6px; padding:9px 0; border-radius:8px; border:1px solid ${accent}; background:${accentBg}; color:${accent}; font-family:monospace; font-size:13px; font-weight:bold; letter-spacing:1px; cursor:pointer;">
                ${pack.price}
            </button>
        </div>
    `;
}

function renderRubyPackagesTabHtml() {
    return `
        <div class="ruby-shop-label-gold" style="margin-bottom:10px;">PAQUETES DE MONEDAS</div>
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(150px, 1fr)); gap:14px; margin-bottom:28px;">
            ${RUBY_SHOP_COIN_PACKAGES.map(p => rubyPackCardHtml(p, 'coins')).join('')}
        </div>

        <div class="ruby-shop-label-ruby" style="margin-bottom:10px;">PAQUETES DE GEMAS</div>
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(150px, 1fr)); gap:14px;">
            ${RUBY_SHOP_GEM_PACKAGES.map(p => rubyPackCardHtml(p, 'gems')).join('')}
        </div>
    `;
}

// Compra "simulada" de un paquete: confirma, entrega la divisa y refresca HUD.
// Cuando integres una pasarela de pago real, este es el punto donde se debe
// llamar primero al SDK de pago y solo ejecutar addCurrency() en su callback
// de éxito (no antes).
function buyCurrencyPackage(currency, amount, packName, priceLabel) {
    showShopModal({
        kicker: currency === 'gems' ? 'PAQUETE DE GEMAS' : 'PAQUETE DE MONEDAS',
        title: packName,
        body: `¿Confirmar compra de ${amount.toLocaleString()} ${shopMonedaLabel(currency)} por ${priceLabel}? (simulado, sin cobro real todavía)`,
        confirmText: 'COMPRAR',
        cancelText: 'CANCELAR',
        onConfirm: () => {
            addCurrency(amount, currency);
            window.playSfx?.('spend');
            updateMenuHUD();
            refreshShopBalances();
            renderRubyShopTabBody();
        }
    });
}

// =====================================================
// CONVERSIÓN COINS ↔ GEMS (gratis, tasa fija — sin tocar la lógica
// económica que ya tenías: 100 coins = 1 gema / 1 gema = 30 coins)
// =====================================================

function renderConversionTabHtml() {
    const coins = parseInt(localStorage.getItem('deadCoins') || '0');
    const gems = parseInt(localStorage.getItem('gems') || '0');
    const ct = shopTextos('conversion');

    return `
        <div style="max-width:480px; margin:0 auto; display:flex; flex-direction:column; gap:20px;">

            <div style="background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.08); border-radius:14px; padding:20px; text-align:center;">
                <div style="color:rgba(255,255,255,0.4); font-family:monospace; font-size:11px; letter-spacing:3px; margin-bottom:12px;">${ct.labelTasaCambio ?? 'TASA DE CAMBIO'}</div>
                <div style="display:flex; align-items:center; justify-content:center; gap:8px;">
                    <img src="assets/UI/Common/Currency/DEAD_COIN.png" style="width:20px;height:20px;object-fit:contain;">
                    <span style="color:white; font-family:monospace; font-size:18px; letter-spacing:2px;">${ct.textoTasa ?? '100 = 1 / 1 = 30'}</span>
                    <img src="assets/UI/Common/Currency/Rubies.png" style="width:20px;height:20px;object-fit:contain;">
                </div>
            </div>

            <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
                <div style="background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.08); border-radius:12px; padding:16px; text-align:center;">
                    <div style="display:flex; align-items:center; justify-content:center; gap:6px; margin-bottom:8px;">
                        <img src="assets/UI/Common/Currency/DEAD_COIN.png" style="width:16px;height:16px;object-fit:contain;">
                        <span style="color:rgba(255,255,255,0.4); font-family:monospace; font-size:10px; letter-spacing:2px;">${ct.labelDeadCoins ?? 'DEAD COINS'}</span>
                    </div>
                    <div id="conv-coins" style="color:white; font-family:monospace; font-size:22px; font-weight:bold;">${coins}</div>
                </div>
                <div style="background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.08); border-radius:12px; padding:16px; text-align:center;">
                    <div style="display:flex; align-items:center; justify-content:center; gap:6px; margin-bottom:8px;">
                        <img src="assets/UI/Common/Currency/Rubies.png" style="width:16px;height:16px;object-fit:contain;">
                        <span style="color:rgba(255,255,255,0.4); font-family:monospace; font-size:10px; letter-spacing:2px;">${ct.labelGemas ?? 'GEMAS'}</span>
                    </div>
                    <div id="conv-gems" style="color:#ffee00; font-family:monospace; font-size:22px; font-weight:bold;">${gems}</div>
                </div>
            </div>

            <div style="background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.08); border-radius:14px; padding:20px;">
                <div style="color:rgba(255,255,255,0.4); font-family:monospace; font-size:11px; letter-spacing:3px; margin-bottom:14px;">${ct.tituloConvertirCoins ?? 'CONVERTIR COINS → GEMAS'}</div>
                <div style="display:flex; gap:10px; align-items:center;">
                    <input id="conv-input" type="number" min="100" step="100" placeholder="${ct.placeholderCoins ?? 'ej: 100'}"
                        style="flex:1; padding:10px 14px; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.15); border-radius:8px; color:white; font-family:monospace; font-size:14px; outline:none;">
                    <button onclick="convertCoins()" style="padding:10px 20px; border:1px solid #ffee00; background:rgba(255,238,0,0.1); color:#ffee00; font-family:monospace; font-size:12px; border-radius:8px; cursor:pointer; letter-spacing:2px;">${ct.botonConvertir ?? 'CONVERTIR'}</button>
                </div>
                <div id="conv-result" style="color:rgba(255,255,255,0.3); font-family:monospace; font-size:11px; margin-top:10px;"></div>
            </div>

            <div style="background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.08); border-radius:14px; padding:20px;">
                <div style="color:rgba(255,255,255,0.4); font-family:monospace; font-size:11px; letter-spacing:3px; margin-bottom:14px;">${ct.tituloConvertirGemas ?? 'CONVERTIR RUBIES A MONEDAS'}</div>
                <div style="display:flex; gap:10px; align-items:center;">
                    <input id="conv-gem-input" type="number" min="1" step="1" placeholder="${ct.placeholderGemas ?? 'ej: 3'}"
                        style="flex:1; padding:10px 14px; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.15); border-radius:8px; color:white; font-family:monospace; font-size:14px; outline:none;">
                    <button onclick="convertGems()" style="padding:10px 20px; border:1px solid #ff4d6d; background:rgba(255,77,109,0.1); color:#ff4d6d; font-family:monospace; font-size:12px; border-radius:8px; cursor:pointer; letter-spacing:2px;">${ct.botonConvertir ?? 'CONVERTIR'}</button>
                </div>
                <div id="conv-gem-result" style="color:rgba(255,255,255,0.3); font-family:monospace; font-size:11px; margin-top:10px;"></div>
            </div>
        </div>
    `;
}

// Mantenido por compatibilidad si algo externo aún llama a renderConversionPage
// directamente (ya no se usa desde showShopSection).
function renderConversionPage(container) {
    const ct = shopTextos('conversion');
    container.innerHTML = `
        <div style="display:flex; align-items:center; gap:16px; margin-bottom:24px;">
            ${shopBotonVolverHtml()}
            <div style="color:rgba(255,255,255,0.4); font-family:monospace; font-size:11px; letter-spacing:4px;">${ct.titulo ?? 'CONVERSIÓN'}</div>
        </div>
        ${renderConversionTabHtml()}
    `;
}

function renderDailyGiftPage(container) {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const days = new Date(year, month + 1, 0).getDate();
    const today = now.getDate();
    const monthKey = `${year}-${String(month + 1).padStart(2, '0')}`;
    const rewards = ['50 MONEDAS', '1 RUBY', 'COFRE BASICO', '80 MONEDAS', '2 RUBIES', 'EMOTE', 'COFRE ESPECIAL'];
    const todayReward = rewards[(today - 1) % rewards.length];
    const streakStart = Math.max(1, today - 3);
    container.innerHTML = `
        <div style="display:flex; align-items:center; gap:16px; margin-bottom:24px;">
            <button onclick="showShopSection('home')" style="padding:8px 16px; background:none; border:1px solid rgba(255,255,255,0.12); border-radius:8px; color:rgba(255,255,255,0.5); font-family:monospace; font-size:11px; letter-spacing:2px; cursor:pointer;">VOLVER</button>
            <div style="color:rgba(255,255,255,0.4); font-family:monospace; font-size:11px; letter-spacing:4px;">REGALO DIARIO</div>
        </div>
        <div class="daily-hero" style="background-image:linear-gradient(90deg, rgba(2,30,32,0.88), rgba(16,7,18,0.72)), url('assets/UI/Store/Daily/banner_regalo_diario.png');">
            <div>
                <div class="daily-kicker">RECOMPENSA DE HOY</div>
                <h2>${todayReward}</h2>
                <p>Cada dia 7 ven por tu premio especial!!</p>
            </div>
            <button onclick="claimDailyGift(${today})" ${localStorage.getItem(`dailyGift_${monthKey}_${today}`) === 'true' ? 'disabled' : ''} type="button">${localStorage.getItem(`dailyGift_${monthKey}_${today}`) === 'true' ? 'RECLAMADO' : 'RECLAMAR'}</button>
        </div>
        <div class="daily-streak">
            ${Array.from({ length: 7 }, (_, i) => {
        const day = Math.min(days, streakStart + i);
        return renderDailyDay(day, today, monthKey, rewards[(day - 1) % rewards.length], true);
    }).join('')}
        </div>
        <div style="border:1px solid rgba(0,255,231,0.16); border-radius:8px; background:rgba(0,0,0,0.26); padding:18px;">
            <div class="daily-grid">
                ${Array.from({ length: days }, (_, i) => renderDailyDay(i + 1, today, monthKey, rewards[i % rewards.length])).join('')}
            </div>
        </div>
    `;
}

function renderDailyDay(day, today, monthKey, reward) {
    const claimed = localStorage.getItem(`dailyGift_${monthKey}_${day}`) === 'true';
    const canClaim = day === today && !claimed;
    const locked = day > today;
    return `
        <div class="daily-day ${canClaim ? 'today' : ''} ${claimed ? 'claimed' : ''} ${locked ? 'locked' : ''}">
            <div><span>DIA</span><strong>${day}</strong></div>
            <div class="daily-reward">${day % 7 === 0 ? 'BONUS · ' : ''}${reward}</div>
            <button onclick="claimDailyGift(${day})" ${canClaim ? '' : 'disabled'}>${claimed ? 'OK' : canClaim ? 'RECLAMAR' : locked ? 'BLOQ' : 'PERDIDO'}</button>
        </div>
    `;
}

function claimDailyGift(day) {
    const now = new Date();
    if (day !== now.getDate()) return;
    const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const key = `dailyGift_${monthKey}_${day}`;
    if (localStorage.getItem(key) === 'true') return;
    const rewards = [
        () => addCurrency(50, 'coins'),
        () => addCurrency(1, 'gems'),
        () => { const k = 'invChest_basic'; localStorage.setItem(k, parseInt(localStorage.getItem(k) || '0') + 1); },
        () => addCurrency(80, 'coins'),
        () => addCurrency(2, 'gems'),
        () => localStorage.setItem('emote_daily_01', 'true'),
        () => { const k = 'invChest_special'; localStorage.setItem(k, parseInt(localStorage.getItem(k) || '0') + 1); },
    ];
    rewards[(day - 1) % rewards.length]();

    // 20% de chance de otorgar fragmento
    if (Math.random() < 0.20 && window.grantRandomFragment) {
        window.grantRandomFragment();
    }
    localStorage.setItem(key, 'true');
    updateMenuHUD();
    renderDailyGiftPage(document.getElementById('shopContent'));
}

const MISSIONS_STORAGE_KEY = 'shopMissionsState_v1';
const MISSION_STREAK_STORAGE_KEY = 'shopMissionStreak_v1';
const DAILY_MISSIONS = [
    { id: 'distance', title: 'Recorre distancia', text: 'Avanza 1800 metros en partidas.', metric: 'distance', goal: 1800, reward: { coins: 90, gems: 1 } },
    { id: 'shop_purchase', title: 'Compra algo', text: 'Haz 1 compra en la tienda.', metric: 'shop_purchase', goal: 1, reward: { coins: 60, gems: 1 } },
    { id: 'coin_collect', title: 'Cazador de oro', text: 'Recoge 35 monedas.', metric: 'coin_collect', goal: 35, reward: { coins: 120, gems: 0 } },
    { id: 'powerup_use', title: 'Activa poder', text: 'Usa 3 potenciadores en partida.', metric: 'powerup_use', goal: 3, reward: { coins: 70, gems: 2 } }
];
const MISSION_STREAK_REWARDS = [
    { day: 1, coins: 70, gems: 1 },
    { day: 3, coins: 180, gems: 3 },
    { day: 5, coins: 320, gems: 5 },
    { day: 7, coins: 520, gems: 9 }
];

function getMissionDateKey(date = new Date()) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function readMissionState() {
    const today = getMissionDateKey();
    let state = {};
    try {
        state = JSON.parse(localStorage.getItem(MISSIONS_STORAGE_KEY) || '{}') || {};
    } catch (error) {
        state = {};
    }
    if (state.date !== today) {
        state = {
            date: today,
            progress: {},
            claimed: {}
        };
        localStorage.setItem(MISSIONS_STORAGE_KEY, JSON.stringify(state));
    }
    return state;
}

function saveMissionState(state) {
    localStorage.setItem(MISSIONS_STORAGE_KEY, JSON.stringify(state));
    updateMissionBadge();
}

function readMissionStreak() {
    let streak = {};
    try {
        streak = JSON.parse(localStorage.getItem(MISSION_STREAK_STORAGE_KEY) || '{}') || {};
    } catch (error) {
        streak = {};
    }
    return {
        count: Math.max(0, parseInt(streak.count || 0, 10)),
        lastDate: streak.lastDate || '',
        claimed: streak.claimed || {}
    };
}

function saveMissionStreak(streak) {
    localStorage.setItem(MISSION_STREAK_STORAGE_KEY, JSON.stringify(streak));
    updateMissionBadge();
}

function touchMissionSessionStreak() {
    const today = getMissionDateKey();
    const streak = readMissionStreak();
    if (streak.lastDate === today) return streak;
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const isConsecutive = streak.lastDate === getMissionDateKey(yesterday);
    streak.count = isConsecutive ? streak.count + 1 : 1;
    streak.lastDate = today;
    saveMissionStreak(streak);
    return streak;
}

function trackMissionProgress(metric, amount = 1) {
    const state = readMissionState();
    state.progress[metric] = Math.max(0, (parseFloat(state.progress[metric]) || 0) + amount);
    saveMissionState(state);
}

function trackMissionDistance(px = 0) {
    if (!px || px < 0.2) return;
    trackMissionProgress('distance', px / 20);
}

function getMissionReadyCount() {
    const state = readMissionState();
    const streak = readMissionStreak();
    const missionReady = DAILY_MISSIONS.filter(mission => {
        const progress = parseFloat(state.progress[mission.metric] || 0);
        return progress >= mission.goal && state.claimed[mission.id] !== true;
    }).length;
    const streakReady = MISSION_STREAK_REWARDS.filter(reward => streak.count >= reward.day && streak.claimed[reward.day] !== true).length;
    return missionReady + streakReady;
}

function updateMissionBadge() {
    const badge = document.getElementById('shop-missions-ready');
    if (!badge) return;
    badge.textContent = getMissionReadyCount();
    badge.classList.toggle('is-ready', getMissionReadyCount() > 0);
}

function renderMissionReward(reward = {}) {
    return [
        reward.coins ? `${reward.coins} monedas` : '',
        reward.gems ? `${reward.gems} rubies` : ''
    ].filter(Boolean).join(' + ');
}

// Parte #5 (Ruby Pass): arma el resumen compacto de misiones que va al
// lado del riel. Cero lógica nueva de misiones — solo lee readMissionState()
// y ordena, la reclamación real sigue pasando por openMissionsPanel() /
// claimMissionReward(), que no se tocan.
function getRubyRailMissionsPreview(limit = 2) {
    const state = readMissionState();
    const withProgress = DAILY_MISSIONS.map(mission => {
        const raw = parseFloat(state.progress[mission.metric] || 0);
        const progress = Math.min(mission.goal, raw);
        const pct = Math.max(0, Math.min(100, (progress / mission.goal) * 100));
        const claimed = state.claimed[mission.id] === true;
        const ready = raw >= mission.goal && !claimed;
        return { mission, progress, pct, claimed, ready };
    });
    // La más cerca de completarse primero; las ya reclamadas no se muestran
    // (no aportan nada nuevo en un resumen compacto).
    return withProgress
        .filter(item => !item.claimed)
        .sort((a, b) => b.pct - a.pct)
        .slice(0, limit);
}

function renderRubyRailMissionsSummary() {
    const mt = shopTextos('misiones');
    const preview = getRubyRailMissionsPreview(2);
    const readyCount = getMissionReadyCount();
    const verTodas = mt.verTodas ?? 'VER TODAS';

    if (preview.length === 0) {
        return `
        <div class="ruby-rail-missions-summary">
            <div class="ruby-rail-missions-summary-head">
                <span>${mt.tituloResumen ?? 'MISIONES DE HOY'}</span>
            </div>
            <p class="ruby-rail-missions-summary-empty">${mt.completadas ?? 'Completaste todas tus misiones de hoy'}</p>
            <button class="ruby-rail-missions-summary-link" onclick="openMissionsPanel()" type="button">${verTodas} &rsaquo;</button>
        </div>`;
    }

    return `
        <div class="ruby-rail-missions-summary">
            <div class="ruby-rail-missions-summary-head">
                <span>${mt.tituloResumen ?? 'MISIONES DE HOY'}</span>
                ${readyCount > 0 ? `<b class="ruby-rail-missions-summary-badge">${readyCount}</b>` : ''}
            </div>
            ${preview.map(item => `
            <button class="ruby-rail-missions-summary-row ${item.ready ? 'is-ready' : ''}" onclick="openMissionsPanel()" type="button">
                <div class="ruby-rail-missions-summary-row-text">
                    <span>${item.mission.title}</span>
                    <div class="ruby-rail-missions-summary-row-bar"><i style="width:${item.pct}%"></i></div>
                </div>
                <small>${Math.floor(item.progress)}/${item.mission.goal}</small>
            </button>`).join('')}
            <button class="ruby-rail-missions-summary-link" onclick="openMissionsPanel()" type="button">${verTodas} &rsaquo;</button>
        </div>`;
}

function openMissionsPanel() {
    touchMissionSessionStreak();
    const state = readMissionState();
    const streak = readMissionStreak();
    let modal = document.getElementById('missionsPanel');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'missionsPanel';
        modal.className = 'missions-modal';
        modal.addEventListener('click', event => {
            if (event.target === modal) closeMissionsPanel();
        });
        document.body.appendChild(modal);
    }
    const mt = shopTextos('misiones');
    const rachaTexto = (mt.rachaTemplate ?? 'Racha {n} dia{plural}')
        .replace('{n}', streak.count)
        .replace('{plural}', streak.count === 1 ? '' : 's');

    modal.innerHTML = `
        <section class="missions-panel">
            <button class="missions-close" onclick="closeMissionsPanel()" type="button">X</button>
            <div class="missions-header">
                <span>${mt.tituloPanel ?? 'MISIONES DIARIAS'}</span>
                <strong>${rachaTexto}</strong>
            </div>
            <div class="missions-grid">
                ${DAILY_MISSIONS.map(mission => renderMissionCard(mission, state)).join('')}
            </div>
            <div class="missions-streak">
                <div>
                    <span>${mt.rachaSesion ?? 'RACHA DE SESION'}</span>
                    <strong>${streak.count}/7</strong>
                </div>
                <div class="missions-streak-track">
                    ${MISSION_STREAK_REWARDS.map(reward => renderStreakReward(reward, streak)).join('')}
                </div>
            </div>
        </section>
    `;
    modal.style.display = 'grid';
    updateMissionBadge();
}

function renderMissionCard(mission, state) {
    const rawProgress = parseFloat(state.progress[mission.metric] || 0);
    const progress = Math.min(mission.goal, rawProgress);
    const pct = Math.max(0, Math.min(100, (progress / mission.goal) * 100));
    const claimed = state.claimed[mission.id] === true;
    const ready = rawProgress >= mission.goal && !claimed;
    return `
        <article class="mission-card ${ready ? 'ready' : ''} ${claimed ? 'claimed' : ''}">
            <div class="mission-card-top">
                <div>
                    <strong>${mission.title}</strong>
                    <p>${mission.text}</p>
                </div>
                <span>${Math.floor(progress)}/${mission.goal}</span>
            </div>
            <div class="mission-progress"><i style="width:${pct}%"></i></div>
            <div class="mission-card-bottom">
                <small>${renderMissionReward(mission.reward)}</small>
                <button onclick="claimMissionReward('${mission.id}')" ${ready ? '' : 'disabled'} type="button">${claimed ? (shopTextos('misiones').botonReclamado ?? 'OK') : (shopTextos('misiones').botonReclamar ?? 'RECLAMAR')}</button>
            </div>
        </article>
    `;
}

function renderStreakReward(reward, streak) {
    const claimed = streak.claimed[reward.day] === true;
    const ready = streak.count >= reward.day && !claimed;
    return `
        <button class="streak-node ${ready ? 'ready' : ''} ${claimed ? 'claimed' : ''}" onclick="claimMissionStreakReward(${reward.day})" ${ready ? '' : 'disabled'} type="button">
            <b>${reward.day}</b>
            <span>${reward.gems}R</span>
        </button>
    `;
}

function claimMissionReward(id) {
    const mission = DAILY_MISSIONS.find(item => item.id === id);
    if (!mission) return;
    const state = readMissionState();
    if (state.claimed[id] === true) return;
    if ((parseFloat(state.progress[mission.metric] || 0)) < mission.goal) return;
    if (mission.reward.coins) addCurrency(mission.reward.coins, 'coins');
    if (mission.reward.gems) addCurrency(mission.reward.gems, 'gems');
    state.claimed[id] = true;
    saveMissionState(state);

    // 15% de chance de otorgar fragmento
    if (Math.random() < 0.15 && window.grantRandomFragment) {
        window.grantRandomFragment();
    }

    window.playSfx?.('reward', 0.85);
    refreshShopBalances();
    openMissionsPanel();
}

function claimMissionStreakReward(day) {
    const reward = MISSION_STREAK_REWARDS.find(item => item.day === day);
    const streak = readMissionStreak();
    if (!reward || streak.count < day || streak.claimed[day] === true) return;
    if (reward.coins) addCurrency(reward.coins, 'coins');
    if (reward.gems) addCurrency(reward.gems, 'gems');
    streak.claimed[day] = true;
    saveMissionStreak(streak);
    window.playSfx?.('reward', 0.85);
    refreshShopBalances();
    openMissionsPanel();
}

window.openMissionsPanel = openMissionsPanel;
window.closeMissionsPanel = function closeMissionsPanel() {
    const modal = document.getElementById('missionsPanel');
    if (modal) modal.style.display = 'none';
};
window.trackMissionProgress = trackMissionProgress;
window.trackMissionDistance = trackMissionDistance;
window.updateMissionBadge = updateMissionBadge;

function convertCoins() {
    const input = parseInt(document.getElementById('conv-input').value || '0');
    const result = document.getElementById('conv-result');
    const ct = shopTextos('conversion');

    if (input < 100 || input % 100 !== 0) {
        result.textContent = ct.errorMultiploCoins ?? 'Ingresa un multiplo de 100 (minimo 100)';
        result.style.color = '#ff4444';
        return;
    }

    let coins = parseInt(localStorage.getItem('deadCoins') || '0');
    if (coins < input) {
        result.textContent = ct.errorSinCoins ?? '¡No tienes suficientes Dead Coins!';
        result.style.color = '#ff4444';
        return;
    }

    const gemsGained = input / 100;
    coins -= input;
    let gems = parseInt(localStorage.getItem('gems') || '0');
    gems += gemsGained;

    localStorage.setItem('deadCoins', coins);
    localStorage.setItem('gems', gems);
    playerData.deadCoins = coins;

    document.getElementById('conv-coins').textContent = coins;
    document.getElementById('conv-gems').textContent = gems;
    document.getElementById('shop-coins').textContent = coins;
    document.getElementById('shop-gems').textContent = gems;
    updateMenuHUD();

    result.textContent = (ct.exitoCoinsAGemas ?? '✔ Convertiste {input} coins en {ganado} gemas')
        .replace('{input}', input).replace('{ganado}', gemsGained);
    result.style.color = '#00ff88';
}

function convertGems() {
    const input = parseInt(document.getElementById('conv-gem-input').value || '0');
    const result = document.getElementById('conv-gem-result');
    const ct = shopTextos('conversion');

    if (input < 1) {
        result.textContent = ct.errorMinimoGemas ?? 'Ingresa al menos 1 ruby';
        result.style.color = '#ff4444';
        return;
    }

    let gems = parseInt(localStorage.getItem('gems') || '0');
    if (gems < input) {
        result.textContent = ct.errorSinRubies ?? 'No tienes suficientes rubies';
        result.style.color = '#ff4444';
        return;
    }

    let coins = parseInt(localStorage.getItem('deadCoins') || '0');
    const coinsGained = input * 30;
    gems -= input;
    coins += coinsGained;

    localStorage.setItem('gems', gems);
    localStorage.setItem('deadCoins', coins);
    playerData.deadCoins = coins;
    document.getElementById('conv-coins').textContent = coins;
    document.getElementById('conv-gems').textContent = gems;
    document.getElementById('shop-coins').textContent = coins;
    document.getElementById('shop-gems').textContent = gems;
    updateMenuHUD();

    result.textContent = (ct.exitoGemasACoins ?? 'Convertiste {input} rubies en {ganado} monedas')
        .replace('{input}', input).replace('{ganado}', coinsGained);
    result.style.color = '#00ff88';
}

function equipTrailFromInventory(effectId, colorId) {
    localStorage.setItem('equippedTrail', `${effectId}_${colorId}`);
    if (typeof bannerTrail !== 'undefined') bannerTrail = [];
    showInventorySection('trails');
}

let vipTrailAnims = {};
let vipSelectedColors = {};

function selectVIPTrailColor(trailId, colorId, price) {
    vipSelectedColors[trailId] = colorId;
    const color = TRAIL_COLOR_LIST.find(c => c.id === colorId);
    const owned = localStorage.getItem(`trail_${trailId}_${colorId}`) === 'true';
    const equipped = localStorage.getItem('equippedTrail') === `${trailId}_${colorId}`;

    const actionEl = document.getElementById(`vip-trail-action-${trailId}`);
    if (actionEl) {
        actionEl.innerHTML = owned
            ? `<button onclick="vipEquipTrail('${trailId}','${colorId}')" type="button" style="width:100%;border-color:${equipped ? '#ffd700' : '#00ff88'};color:${equipped ? '#ffd700' : '#00ff88'};">
                ${equipped ? '✔ EQUIPADO' : 'EQUIPAR'}
               </button>`
            : `<button onclick="vipBuyTrail('${trailId}','${colorId}',${price})" type="button" style="width:100%;">
                COMPRAR ${renderPrice(price, 'gems')} · ${colorId.toUpperCase()}
               </button>`;
    }

    startVIPTrailCanvas(trailId, colorId);
}

function startVIPTrailCanvas(trailId, colorId, canvasId = `vip-trail-canvas-${trailId}`) {
    const animKey = `${canvasId}_${trailId}`;
    if (vipTrailAnims[animKey]) cancelAnimationFrame(vipTrailAnims[animKey]);

    const cvs = document.getElementById(canvasId);
    if (!cvs) return;
    const ctx = cvs.getContext('2d');
    const color = TRAIL_COLOR_LIST.find(c => c.id === colorId);
    const rgb = color?.rgb || '255,80,255';
    let px = 20, pts = [];
    let lastFrame = 0;

    function loop(timestamp = 0) {
        if (!document.body.contains(cvs)) { vipTrailAnims[animKey] = null; return; }
        if (!isCanvasPreviewVisible(cvs)) {
            vipTrailAnims[animKey] = requestAnimationFrame(loop);
            return;
        }
        const frameGap = isShopPerformanceMode() ? 120 : 33;
        if (timestamp && lastFrame && timestamp - lastFrame < frameGap) {
            vipTrailAnims[animKey] = requestAnimationFrame(loop);
            return;
        }
        lastFrame = timestamp || performance.now();
        ctx.clearRect(0, 0, cvs.width, cvs.height);
        px += 1.4;
        if (px > cvs.width - 20) px = 20;
        pts.push({ x: px, y: cvs.height / 2, life: 1.0, seed: Math.random() });
        if (pts.length > 50) pts.shift();
        for (let p of pts) p.life -= 0.014;

        ctx.__previewNow = lastFrame;
        for (let p of pts) {
            if (p.life <= 0) continue;
            drawPreviewTrailPoint(ctx, p, trailId, rgb, colorId);
        }

        ctx.beginPath();
        ctx.arc(px, cvs.height / 2, 7, 0, Math.PI * 2);
        ctx.fillStyle = color?.id === 'rgb' ? `hsl(${(lastFrame * 0.18) % 360},100%,64%)` : (color?.color || '#fff');
        ctx.fill();

        vipTrailAnims[animKey] = requestAnimationFrame(loop);
    }
    loop();
}

let customTextTrailAnim = null;

function validateCustomTrailInput(input) {
    const cleaned = String(input.value || '').replace(/[<>]/g, '').slice(0, 18);
    if (input.value !== cleaned) input.value = cleaned;
    const status = document.getElementById('customTrailValidation');
    if (!status) return cleaned;
    const valid = cleaned.trim().length >= 2;
    status.textContent = valid ? `${cleaned.length}/18 caracteres` : 'Escribe minimo 2 caracteres.';
    status.classList.toggle('invalid', !valid);
    return cleaned;
}

function drawCustomTextPreviewRibbon(ctx, x, y, phrase, timestamp, width) {
    const textW = Math.min(178, Math.max(58, phrase.length * 14));
    const ribbonW = Math.min(232, Math.max(126, textW + 74));
    const ribbonH = 28;
    const startX = x - 22;
    const endX = Math.max(14, startX - ribbonW);
    const waveAmp = 5;
    const segments = 16;

    ctx.save();
    ctx.shadowColor = '#ffda3a';
    ctx.shadowBlur = 12;
    ctx.beginPath();
    for (let i = 0; i <= segments; i++) {
        const p = i / segments;
        const px = startX + (endX - startX) * p;
        const wave = Math.sin(timestamp * 0.007 + p * Math.PI * 4.4) * waveAmp;
        const taper = 1 - p * 0.18;
        const py = y - ribbonH * 0.5 * taper + wave;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
    }
    ctx.lineTo(Math.max(6, endX - 18), y + Math.sin(timestamp * 0.007 + 2.4) * waveAmp);
    for (let i = segments; i >= 0; i--) {
        const p = i / segments;
        const px = startX + (endX - startX) * p;
        const wave = Math.sin(timestamp * 0.007 + p * Math.PI * 4.4) * waveAmp;
        const taper = 1 - p * 0.18;
        ctx.lineTo(px, y + ribbonH * 0.5 * taper + wave);
    }
    ctx.closePath();
    const grad = ctx.createLinearGradient(endX, 0, startX, 0);
    grad.addColorStop(0, 'rgba(250,252,255,0.78)');
    grad.addColorStop(0.22, 'rgba(255,255,255,0.95)');
    grad.addColorStop(0.76, 'rgba(255,255,255,0.9)');
    grad.addColorStop(1, 'rgba(255,218,58,0.34)');
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'rgba(18,22,34,0.42)';
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(startX + 2, y - 7);
    ctx.lineTo(x - 8, y - 2);
    ctx.lineTo(x - 8, y + 2);
    ctx.lineTo(startX + 2, y + 7);
    ctx.strokeStyle = 'rgba(255,218,58,0.6)';
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.shadowBlur = 4;
    ctx.shadowColor = 'rgba(255,255,255,0.78)';
    ctx.font = '900 15px Geom, monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.lineWidth = 3;
    ctx.strokeStyle = 'rgba(255,255,255,0.8)';
    ctx.fillStyle = 'rgba(22,24,34,0.96)';
    const chars = phrase.split('');
    const spacing = Math.min(14, Math.max(8, textW / Math.max(1, chars.length)));
    const textCenter = endX + (startX - endX) * 0.55;
    const firstX = textCenter - ((chars.length - 1) * spacing) / 2;
    chars.forEach((ch, index) => {
        const p = (firstX + index * spacing - endX) / Math.max(1, startX - endX);
        const wave = Math.sin(timestamp * 0.007 + p * Math.PI * 4.4) * (waveAmp * 0.72);
        ctx.save();
        ctx.translate(firstX + index * spacing, y + wave);
        ctx.rotate(Math.cos(timestamp * 0.007 + p * Math.PI * 4.4) * 0.1);
        ctx.strokeText(ch, 0, 0);
        ctx.fillText(ch, 0, 0);
        ctx.restore();
    });

    const fade = ctx.createLinearGradient(width - 112, 0, width - 18, 0);
    fade.addColorStop(0, 'rgba(255,218,58,0)');
    fade.addColorStop(1, 'rgba(255,218,58,0.22)');
    ctx.fillStyle = fade;
    ctx.fillRect(width - 112, 18, 94, 74);
    ctx.restore();
}

function startCustomTextTrailPreview(canvasId, inputId) {
    if (customTextTrailAnim) cancelAnimationFrame(customTextTrailAnim);
    const cvs = document.getElementById(canvasId);
    const input = document.getElementById(inputId);
    if (!cvs) return;
    const ctx = cvs.getContext('2d');
    let x = 96;
    let lastFrame = 0;

    function loop(timestamp = 0) {
        if (!document.body.contains(cvs)) { customTextTrailAnim = null; return; }
        if (!isCanvasPreviewVisible(cvs)) {
            customTextTrailAnim = requestAnimationFrame(loop);
            return;
        }
        const frameGap = isShopPerformanceMode() ? 120 : 33;
        if (timestamp && lastFrame && timestamp - lastFrame < frameGap) {
            customTextTrailAnim = requestAnimationFrame(loop);
            return;
        }
        lastFrame = timestamp || performance.now();
        const phrase = validateCustomTrailInput(input || { value: localStorage.getItem('customTrailText') || 'RUBY' }) || 'RUBY';
        ctx.clearRect(0, 0, cvs.width, cvs.height);
        x += 2.4;
        if (x > cvs.width - 28) x = Math.min(100, cvs.width * 0.38);

        ctx.save();
        const bodyGrad = ctx.createLinearGradient(16, 0, cvs.width - 16, 0);
        bodyGrad.addColorStop(0, 'rgba(10,12,20,0.96)');
        bodyGrad.addColorStop(0.72, 'rgba(10,12,20,0.86)');
        bodyGrad.addColorStop(1, 'rgba(255,218,58,0.03)');
        ctx.fillStyle = bodyGrad;
        ctx.fillRect(14, 24, cvs.width - 28, cvs.height - 48);
        const fade = ctx.createLinearGradient(cvs.width - 110, 0, cvs.width - 16, 0);
        fade.addColorStop(0, 'rgba(255,218,58,0)');
        fade.addColorStop(1, 'rgba(255,218,58,0.34)');
        ctx.fillStyle = fade;
        ctx.fillRect(cvs.width - 110, 24, 94, cvs.height - 48);
        ctx.restore();

        const y = cvs.height / 2 + Math.sin(lastFrame * 0.006) * 4;
        drawCustomTextPreviewRibbon(ctx, x, y, phrase, lastFrame, cvs.width);

        ctx.save();
        ctx.translate(x, y);
        ctx.shadowBlur = 16;
        ctx.shadowColor = '#ffda3a';
        ctx.beginPath();
        ctx.arc(0, 0, 8, 0, Math.PI * 2);
        ctx.fillStyle = '#ffda3a';
        ctx.fill();
        ctx.beginPath();
        ctx.arc(-2, -2, 3, 0, Math.PI * 2);
        ctx.fillStyle = '#fff7b8';
        ctx.fill();
        ctx.restore();
        customTextTrailAnim = requestAnimationFrame(loop);
    }
    loop();
}

function buyCustomTextTrail() {
    const input = document.getElementById('customTrailPhrase');
    const phrase = validateCustomTrailInput(input || { value: '' }).trim();
    if (phrase.length < 2) return alert('Escribe una frase corta para el trail.');
    const item = findVIPItemById('trail_custom_text');
    const owned = localStorage.getItem('vip_item_trail_custom_text') === 'true';
    const complete = () => {
        localStorage.setItem('customTrailText', phrase);
        localStorage.setItem('vip_item_trail_custom_text', 'true');
        localStorage.setItem('trail_trail_custom_text_cyan', 'true');
        localStorage.setItem('equippedTrail', 'trail_custom_text_cyan');
        if (typeof bannerTrail !== 'undefined') bannerTrail = [];
        window.playSfx?.('spend');
        updateMenuHUD();
        if (typeof currentVIPDetailRenderer === 'function') currentVIPDetailRenderer();
    };
    if (owned) return complete();
    showShopModal({
        kicker: 'TRAIL PERSONALIZABLE',
        title: '¡Trail personalizable!',
        mediaHTML: `<canvas id="modal-custom-text-trail" width="300" height="110" class="vip-custom-trail-preview"></canvas>`,
        mediaClass: 'wide',
        body: `Comprar por ${item?.price || 1000} rubies?`,
        confirmText: 'SI',
        cancelText: 'NO',
        onConfirm: () => {
            if (!canAfford(item?.price || 1000, 'gems')) return alert('No tienes suficientes rubies.');
            spendCurrency(item?.price || 1000, 'gems');
            complete();
        }
    });
    setTimeout(() => {
        localStorage.setItem('customTrailTextPreview', phrase);
        startCustomTextTrailPreview('modal-custom-text-trail', 'customTrailPhrase');
    }, 20);
}

function vipBuyTrail(trailId, colorId, price) {
    showShopModal({
        kicker: 'TRAIL VIP',
        title: `${trailId.toUpperCase()} · ${colorId.toUpperCase()}`,
        body: `Comprar por ${price} rubies?`,
        confirmText: 'SI',
        cancelText: 'NO',
        onConfirm: () => {
            if (!canAfford(price, 'gems')) return alert('No tienes suficientes rubies.');
            spendCurrency(price, 'gems');
            localStorage.setItem(`trail_${trailId}_${colorId}`, 'true');
            localStorage.setItem('equippedTrail', `${trailId}_${colorId}`);
            if (typeof bannerTrail !== 'undefined') bannerTrail = [];
            window.playSfx?.('spend');
            updateMenuHUD();
            refreshShopBalances();
            selectVIPTrailColor(trailId, colorId, price);
            const colorsEl = document.getElementById(`vip-colors-${trailId}`);
            if (colorsEl) colorsEl.querySelectorAll('div').forEach(d => {
                if (d.title === colorId) d.style.borderColor = '#00ff88';
            });
        }
    });
}

function buyVIPTrailFull(trailId, name, price) {
    const alreadyOwned = TRAIL_COLOR_LIST.every(c =>
        localStorage.getItem(`trail_${trailId}_${c.id}`) === 'true'
    );
    if (alreadyOwned) return;

    showShopModal({
        kicker: 'TRAIL VIP COMPLETO',
        title: name,
        body: `Comprar todos los colores por ${price} rubies?`,
        confirmText: 'SI',
        cancelText: 'NO',
        onConfirm: () => {
            if (!canAfford(price, 'gems')) return alert('No tienes suficientes rubies.');
            spendCurrency(price, 'gems');
            // Desbloquear TODOS los colores
            TRAIL_COLOR_LIST.forEach(c => {
                localStorage.setItem(`trail_${trailId}_${c.id}`, 'true');
            });
            localStorage.setItem('equippedTrail', `${trailId}_cyan`);
            if (typeof bannerTrail !== 'undefined') bannerTrail = [];
            window.playSfx?.('spend');
            updateMenuHUD();
            refreshShopBalances();
            // Refrescar panel
            if (typeof currentVIPDetailRenderer === 'function') currentVIPDetailRenderer();
        }
    });
}

function vipEquipTrail(trailId, colorId) {
    localStorage.setItem('equippedTrail', `${trailId}_${colorId}`);
    if (typeof bannerTrail !== 'undefined') bannerTrail = [];
    updateMenuHUD();
    selectVIPTrailColor(trailId, colorId, 0);
}

let invTrailAnims = {};

function startInvTrailCanvas(trailId, colorId) {
    if (invTrailAnims[trailId]) cancelAnimationFrame(invTrailAnims[trailId]);
    const cvs = document.getElementById(`inv-trail-canvas-${trailId}`);
    if (!cvs) return;
    const ctx = cvs.getContext('2d');
    const color = TRAIL_COLOR_LIST.find(c => c.id === colorId);
    const rgb = color?.rgb || '0,255,231';
    let px = 20, pts = [];
    let lastFrame = 0;
    function loop(timestamp = 0) {
        if (!document.body.contains(cvs)) { invTrailAnims[trailId] = null; return; }
        if (!isCanvasPreviewVisible(cvs)) {
            invTrailAnims[trailId] = requestAnimationFrame(loop);
            return;
        }
        const frameGap = isShopPerformanceMode() ? 120 : 33;
        if (timestamp && lastFrame && timestamp - lastFrame < frameGap) {
            invTrailAnims[trailId] = requestAnimationFrame(loop);
            return;
        }
        lastFrame = timestamp || performance.now();
        ctx.clearRect(0, 0, cvs.width, cvs.height);
        px += 1.2;
        if (px > cvs.width - 20) px = 20;
        pts.push({ x: px, y: cvs.height / 2, life: 1.0, seed: Math.random() });
        if (pts.length > 45) pts.shift();
        for (let p of pts) p.life -= 0.015;
        ctx.__previewNow = lastFrame;
        for (let p of pts) {
            if (p.life <= 0) continue;
            drawPreviewTrailPoint(ctx, p, trailId, rgb, colorId);
        }
        ctx.beginPath();
        ctx.arc(px, cvs.height / 2, 6, 0, Math.PI * 2);
        ctx.fillStyle = color?.id === 'rgb' ? `hsl(${(lastFrame * 0.18) % 360},100%,64%)` : (color?.color || '#fff');
        ctx.fill();
        invTrailAnims[trailId] = requestAnimationFrame(loop);
    }
    loop();
}

function toggleInvTrailExpand(trailId) {
    const expand = document.getElementById(`inv-trail-expand-${trailId}`);
    const arrow = document.getElementById(`inv-trail-arrow-${trailId}`);
    const card = document.getElementById(`inv-trail-card-${trailId}`);
    if (!expand) return;
    const open = expand.style.display === 'none';
    expand.style.display = open ? 'block' : 'none';
    if (arrow) arrow.textContent = open ? '▲' : '▼';
    if (card) card.style.borderRadius = open ? '14px 14px 0 0' : '14px';
}

function invEquipTrailColor(trailId, colorId) {
    localStorage.setItem('equippedTrail', `${trailId}_${colorId}`);
    if (typeof bannerTrail !== 'undefined') bannerTrail = [];
    updateMenuHUD();
    showInventorySection('trails');
}

updateMenuHUD();

// Exportar funciones VIP y Ruby Pass a window
window.openVIP = openVIP;
window.closeVIP = closeVIP;
window.openRubyPass = openRubyPass;


// =====================================================
// LLAVE DE CARONTE — helper de render (Parte A del plan)
// Icono dibujado en CSS puro, dos tamaños: 'sm' (HUD/inventario)
// y 'lg' (animación de "conseguiste una llave").
// =====================================================
// =====================================================
// LLAVE DE CARONTE — helper de render (Parte A del plan, rediseño chico
// por feedback de Luna: la llave completa escalada a ~11px de ancho no
// se veía, quedaba una rayita sin detalle. Para 'sm' ahora se dibuja un
// óbolo/moneda compacta con la calavera grabada, pensada para leerse bien
// de chica. 'lg' sigue siendo la llave completa, para la animación de
// "conseguiste una llave" (todavía no implementada).
// =====================================================
function renderCaronteKeyIcon(size = 'sm') {
    if (size === 'lg') {
        return `
            <div class="caronte-key--lg">
                <div class="caronte-key-canvas">
                    <div class="caronte-key-skull"></div>
                    <div class="caronte-key-eye caronte-key-eye--l"></div>
                    <div class="caronte-key-eye caronte-key-eye--r"></div>
                    <div class="caronte-key-crack"></div>
                    <div class="caronte-key-jaw"></div>
                    <div class="caronte-key-connector"></div>
                    <div class="caronte-key-vertebra caronte-key-vertebra--1"></div>
                    <div class="caronte-key-vertebra caronte-key-vertebra--2"></div>
                    <div class="caronte-key-shaft"></div>
                    <div class="caronte-key-tooth caronte-key-tooth--l1"></div>
                    <div class="caronte-key-tooth caronte-key-tooth--r1"></div>
                    <div class="caronte-key-tooth caronte-key-tooth--l2"></div>
                    <div class="caronte-key-tooth caronte-key-tooth--r2"></div>
                </div>
            </div>
        `;
    }
    return `
        <div class="caronte-key-mini">
            <div class="caronte-key-mini-eye caronte-key-mini-eye--l"></div>
            <div class="caronte-key-mini-eye caronte-key-mini-eye--r"></div>
            <div class="caronte-key-mini-crack"></div>
        </div>
    `;
}
window.renderCaronteKeyIcon = renderCaronteKeyIcon;
