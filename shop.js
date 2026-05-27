// =====================================================
// SHOP SYSTEM
// =====================================================

const SHOP_PLACEHOLDER_IMAGE = 'assets/UI/Store/Placeholders/placeholder_store_item.png';
const RUBY_PASS_REWARD_PLACEHOLDER = 'assets/UI/Store/Placeholders/placeholder_ruby_pass_reward.png';
const EMOTE_STANDARD_PRICE_COINS = 150;

const SKINS_DATA = [
    { id: 'cyan', name: 'Cian', color: '#00ffe7', rarity: 'BASICA', price: 0, priceType: 'coins', owned: true, archetype: 'Supervivencia', ability: 'Sobrevive a 1 pinchazo por partida.' },
    { id: 'red', name: 'Rojo', color: '#ff4444', rarity: 'BASICA', price: 50, priceType: 'coins', owned: false, archetype: 'Supervivencia', ability: 'Sobrevive a 1 pinchazo por partida.' },
    { id: 'blue', name: 'Azul', color: '#5045eb', rarity: 'BASICA', price: 50, priceType: 'coins', owned: false, archetype: 'Supervivencia', ability: 'Sobrevive a 1 pinchazo por partida.' },
    { id: 'yellow', name: 'Amarillo', color: '#ffee00', rarity: 'BASICA', price: 50, priceType: 'coins', owned: false, archetype: 'Supervivencia', ability: 'Sobrevive a 1 pinchazo por partida.' },
    { id: 'orange', name: 'Naranja', color: '#ff8800', rarity: 'BASICA', price: 50, priceType: 'coins', owned: false, archetype: 'Supervivencia', ability: 'Sobrevive a 1 pinchazo por partida.' },
    { id: 'green', name: 'Verde', color: '#3fe969', rarity: 'BASICA', price: 50, priceType: 'coins', owned: false, archetype: 'Supervivencia', ability: 'Sobrevive a 1 pinchazo por partida.' },
    { id: 'purple', name: 'Morado', color: '#cc44ff', rarity: 'BASICA', price: 50, priceType: 'coins', owned: false, archetype: 'Supervivencia', ability: 'Sobrevive a 1 pinchazo por partida.' },
    { id: 'cool', name: 'Cool', color: '#ffffff', rarity: 'ESPECIAL', price: 300, priceType: 'coins', altPrice: 10, altType: 'gems', owned: false, emoji: 'C', archetype: 'Magnetismo', ability: 'Atrae recursos en radio pequeno.' },
    { id: 'frank', name: 'Frankenstein', color: '#78ff8f', rarity: 'EPICA', price: 1200, priceType: 'coins', altPrice: 40, altType: 'gems', fragments: 3, owned: false, emoji: 'F', archetype: 'Magnetismo', ability: 'Atrae recursos en radio grande.' },
    { id: 'shield', name: 'Centinela', color: '#7fd8ff', rarity: 'EPICA', price: 1200, priceType: 'coins', altPrice: 40, altType: 'gems', fragments: 3, owned: false, emoji: 'S', archetype: 'Supervivencia', ability: 'Escudo que regenera cada 60 segundos.' },
    { id: 'kenji', name: 'KENJI', color: '#845cff', rarity: 'EPICA', price: 1500, priceType: 'coins', altPrice: 50, altType: 'gems', fragments: 3, owned: false, imageRight: 'assets/Imagenes/Skins/KENJI Skin EPICO/Kenji_Skin_Derecha.png', imageLeft: 'assets/Imagenes/Skins/KENJI Skin EPICO/Kenji_Skin_Izquierda.png', archetype: 'Tecnica', ability: 'Movimiento preciso con estela epica.' },
    { id: 'brifon', name: 'BRIFON', color: '#b86cff', rarity: 'EPICA', price: 0, priceType: 'coins', owned: false, soon: true, imageRight: 'assets/Imagenes/Skins/BRIFON Skin EPICO/BRIFON_Skin_Derecha.png', archetype: 'Pendiente', ability: 'Apartado reservado.' },
    { id: 'demon_ember', name: 'Demon Ember', color: '#cf0000', rarity: 'DEMON', price: 4500, priceType: 'coins', altPrice: 150, altType: 'gems', fragments: 3, owned: false, emoji: 'D', archetype: 'Inmortalidad', ability: 'Invulnerable 3 segundos.' },
    { id: 'daxor', name: 'DAXOR', color: '#ff2448', rarity: 'DEMON', price: 5200, priceType: 'coins', altPrice: 170, altType: 'gems', fragments: 3, owned: false, imageRight: 'assets/Imagenes/Skins/DAXOR Skin DEMON/DAXOR_Skin_Derecha.png', imageLeft: 'assets/Imagenes/Skins/DAXOR Skin DEMON/DAXOR_Skin_Izquierda.png', archetype: 'Demon', ability: 'Aspecto demon con doble direccion.' },
    { id: 'vip_time', name: 'Crono VIP', color: '#ffee00', rarity: 'VIP', price: 500, priceType: 'gems', fragments: 4, owned: false, emoji: 'V', archetype: 'Control del Tiempo', ability: 'Ralentiza la pista 40% por 5 segundos.' },
];
window.SKINS_DATA = SKINS_DATA;

const RARITY_COLORS = {
    BASICA: '#57b7dd',
    ESPECIAL: '#ff9a17',
    EPICA: '#cc44ff',
    DEMON: '#cf0000',
    VIP: '#ffee00',
};
const BANNER_RARITY_COLORS = {
    DEFAULT: 'rgba(255,255,255,0.35)',
    BASICO: '#57b7dd',
    ESPECIAL: '#ff9a17',
    EPICA: '#cc44ff',
    DEMON: '#cf0000',
    VIP: '#ffee00',
};

const CURRENCY_ICONS = {
    coins: 'assets/Imagenes/Monetizacion/DEAD_COIN.png',
    gems: 'assets/Imagenes/Monetizacion/Rubies.png'
};

const REWARD_CURRENCY_ASSETS = {
    gems: {
        large: 'assets/UI/Rewards/Currency/Gems/Monton_de_gemas_grande.png',
        medium: 'assets/UI/Rewards/Currency/Gems/Monton_de_gemas_Mediano.png',
        small: 'assets/UI/Rewards/Currency/Gems/Monton_de_gemas_Pequeno.png',
        single: 'assets/UI/Rewards/Currency/Gems/Monojo_de_gemas.png'
    },
    coins: {
        large: 'assets/UI/Rewards/Currency/Coins/Monton_de_monedas_grande.png',
        medium: 'assets/UI/Rewards/Currency/Coins/Monton_de_monedas_Mediano.png',
        small: 'assets/UI/Rewards/Currency/Coins/Monton_de_monedas_Pequeno.png',
        single: 'assets/UI/Rewards/Currency/Coins/Monojo_de_monedas.png'
    }
};

const BANNERS_DATA = [

    //Baner por defecto
    {
        id: 'Banner_Deafult',
        name: 'El inicio...',
        price: 0,
        exclusive: false,
        cover: 'assets/Imagenes/Banners/Placeholders/Banner_Deafult.png',
        rarity: 'DEFAULT'
    },

    //Baners Basicos
    {
        id: 'Speed_Color_Green',
        name: 'Speed Color Green',
        price: 150,
        exclusive: false,
        cover: 'assets/Imagenes/Banners/Placeholders/Speed_Color_Green.png',
        rarity: 'BASICO'
    },
    {
        id: 'Speed_Color_Gold',
        name: 'Speed Color Gold',
        price: 150,
        exclusive: false,
        cover: 'assets/Imagenes/Banners/Placeholders/Speed_Color_Gold.png',
        rarity: 'BASICO'
    },
    {
        id: 'Speed_Color_Gray',
        name: 'Speed Color Gray',
        price: 150,
        exclusive: false,
        cover: 'assets/Imagenes/Banners/Placeholders/Speed_Color_Gray.png',
        rarity: 'BASICO'
    },
    {
        id: 'Speed_Color_Blue',
        name: 'Speed Color Blue',
        price: 150,
        exclusive: false,
        cover: 'assets/Imagenes/Banners/Placeholders/Speed_Color_Blue.png',
        rarity: 'BASICO'
    },
    {
        id: 'Speed_Color_Oranje',
        name: 'Speed Color Oranje',
        price: 150,
        exclusive: false,
        cover: 'assets/Imagenes/Banners/Placeholders/Speed_Color_Oranje.png',
        rarity: 'BASICO'
    },
    {
        id: 'Speed_Color_Red',
        name: 'Speed Color Red',
        price: 150,
        exclusive: false,
        cover: 'assets/Imagenes/Banners/Placeholders/Speed_Color_Red.png',
        rarity: 'BASICO'
    },
    {
        id: 'Speed_Color_Rgb',
        name: 'Speed Color Rgb',
        price: 150,
        exclusive: false,
        cover: 'assets/Imagenes/Banners/Placeholders/Speed_Color_Rgb.png',
        rarity: 'BASICO'
    },
    {
        id: 'Speed_Color_Black',
        name: 'Speed Color Black',
        price: 150,
        exclusive: false,
        cover: 'assets/Imagenes/Banners/Placeholders/Speed_Color_Black.png',
        rarity: 'BASICO'
    },

    //Baners Especiales
    {
        id: 'Speed_Color_Red_Animado',
        name: 'Speed Color Red Animado',
        price: 350,
        exclusive: false,
        cover: 'assets/Imagenes/Banners/Placeholders/Speed_Color_Red_Animado.gif',
        rarity: 'ESPECIAL'
    },
    {
        id: 'Abstracto_Fuego_Rojo',
        name: 'Estas que ardes',
        price: 300,
        exclusive: false,
        cover: 'assets/Imagenes/Banners/Placeholders/Abstracto_Fuego_Rojo.png',
        rarity: 'ESPECIAL'
    },
    {
        id: 'Abstracto_Lineas_Yellow',
        name: 'Un toque sofisticado',
        price: 300,
        exclusive: false,
        cover: 'assets/Imagenes/Banners/Placeholders/Abstracto_Lineas_Yellow.png',
        rarity: 'ESPECIAL'
    },
    {
        id: 'Abstracto_Rayos_Az_Rd',
        name: 'Para alguien especial',
        price: 300,
        exclusive: false,
        cover: 'assets/Imagenes/Banners/Placeholders/Abstracto_Rayos_Az_Rd.png',
        rarity: 'ESPECIAL'
    },
    {
        id: 'Abstracto_Rayos_Morados',
        name: 'Algo dark para alguien dark',
        price: 300,
        exclusive: false,
        cover: 'assets/Imagenes/Banners/Placeholders/Abstracto_Rayos_Morados.png',
        rarity: 'ESPECIAL'
    },
    {
        id: 'Abstracto_Rayos_Rojos',
        name: 'Para alguien mas especial',
        price: 300,
        exclusive: false,
        cover: 'assets/Imagenes/Banners/Placeholders/Abstracto_Rayos_Rojos.png',
        rarity: 'ESPECIAL'
    },
    {
        id: 'Dark_Lineas_Blue',
        name: 'Un tono relajante verdad?',
        price: 300,
        exclusive: false,
        cover: 'assets/Imagenes/Banners/Placeholders/Dark_Lineas_Blue.png',
        rarity: 'ESPECIAL'
    },
    {
        id: 'Dark_Ondas_Blue',
        name: 'Muchas ondas!!',
        price: 300,
        exclusive: false,
        cover: 'assets/Imagenes/Banners/Placeholders/Dark_Ondas_Blue.png',
        rarity: 'ESPECIAL'
    },
    {
        id: 'Neon_Grid_Motion',
        name: 'Simple pero elegante',
        price: 300,
        exclusive: false,
        cover: 'assets/Imagenes/Banners/Placeholders/Neon_Grid_Motion.png',
        rarity: 'ESPECIAL'
    },
    {
        id: 'Ondas_Blue',
        name: 'Un tono relajante v2',
        price: 300,
        exclusive: false,
        cover: 'assets/Imagenes/Banners/Placeholders/Ondas_Blue.png',
        rarity: 'ESPECIAL'
    },

    //Baners Epicos
    {
        id: 'Dark_Lineas_Or_Bck',
        name: 'Tienes calor?',
        price: 500,
        exclusive: false,
        cover: 'assets/Imagenes/Banners/Placeholders/Dark_Lineas_Or_Bck.gif',
        rarity: 'EPICA'
    },
    {
        id: 'Dark_Aurora_Blue',
        name: 'Siente el poder!',
        price: 500,
        exclusive: false,
        cover: 'assets/Imagenes/Banners/Placeholders/Dark_Aurora_Blue.gif',
        rarity: 'EPICA'
    },
    {
        id: 'Dark_Ondas_PrAz',
        name: 'Calma, que aun no inicia...',
        price: 500,
        exclusive: false,
        cover: 'assets/Imagenes/Banners/Placeholders/Dark_Ondas_PrAz.gif',
        rarity: 'EPICA'
    },
    {
        id: 'Speed_Color_Yellow_Animado',
        name: 'Te vez cool con este',
        price: 500,
        exclusive: false,
        cover: 'assets/Imagenes/Banners/Placeholders/Speed_Color_Yellow_Animado.gif',
        rarity: 'EPICA'
    },

    //Baners Demon
    {
        id: 'El_Dragon_Chino',
        name: 'El Dragon Chino',
        price: 300,
        exclusive: false,
        cover: 'assets/Imagenes/Banners/Placeholders/El_Dragon_Chino.png',
        rarity: 'DEMON'
    },
    {
        id: 'Un_poco_de_nieve',
        name: 'Un poco de nieve?',
        price: 300,
        exclusive: false,
        cover: 'assets/Imagenes/Banners/Placeholders/Un_poco_de_nieve.png',
        rarity: 'DEMON'
    },
    {
        id: 'Vacaciones_en_la_playa',
        name: 'Vacaciones en la playa',
        price: 300,
        exclusive: false,
        cover: 'assets/Imagenes/Banners/Placeholders/Vacaciones_en_la playa.png',
        rarity: 'DEMON'
    },

    //Banners VIP
    {
        id: 'Dracula_Edition',
        name: 'El Dracula',
        price: 300,
        exclusive: true,
        cover: 'assets/Imagenes/Banners/Placeholders/Dracula_Edition.png',
        rarity: 'VIP'
    },
    {
        id: 'Jack_o_lantern',
        name: 'Jack o lantern',
        price: 300,
        exclusive: true,
        cover: 'assets/Imagenes/Banners/Placeholders/Jack_o_lantern_monster.png',
        rarity: 'VIP'
    },
    {
        id: 'Zombies_Edition',
        name: 'Los zombies estan aqui!',
        price: 300,
        exclusive: true,
        cover: 'assets/Imagenes/Banners/Placeholders/Zombies_Edition.png',
        rarity: 'VIP'
    },
    {
        id: 'El_Dragon_Chino_VIP',
        name: 'El Super Dragon Chino',
        price: 500,
        exclusive: false,
        cover: 'assets/Imagenes/Banners/Placeholders/El_Dragon_Chino_VIP.png',
        rarity: 'VIP'
    },
    {
        id: 'Un_poco_de_hielo_VIP',
        name: 'Un poco de hielo',
        price: 500,
        exclusive: true,
        cover: 'assets/Imagenes/Banners/Placeholders/Un_poco_de_hielo_VIP.png',
        rarity: 'VIP'
    },
    {
        id: 'La_playa_relajante_VIP',
        name: 'La playa es relajante',
        price: 500,
        exclusive: true,
        cover: 'assets/Imagenes/Banners/Placeholders/Vacaciones_en_la playa_VIP.png',
        rarity: 'VIP'
    },
];

const CHESTS_DATA = [
    { id: 'basic', name: 'Cofre Basico', image: 'assets/Imagenes/Cofres Imagenes/Cofre BASICO.png', openImage: 'assets/Imagenes/Cofres Imagenes/Cofres Abiertos/Cofre_BASICO_Abierto.png', cost: 150, currency: 'coins', base: { coins: [25, 60], gems: [0, 1] }, drops: [['Item basico', 85], ['Item especial', 14], ['Fragmento epico', 1]] },
    { id: 'special', name: 'Cofre Especial', image: 'assets/Imagenes/Cofres Imagenes/Cofre ESPECIAL.png', openImage: 'assets/Imagenes/Cofres Imagenes/Cofres Abiertos/Cofre_ESPECIAL_Abierto.png', cost: 500, currency: 'coins', altCost: 20, altCurrency: 'gems', base: { coins: [70, 140], gems: [1, 3] }, drops: [['Item especial', 60], ['Fragmento epico', 8], ['Fragmento demon', 2]] },
    { id: 'epic', name: 'Cofre Epico', image: 'assets/Imagenes/Cofres Imagenes/Cofre EPICO.png', openImage: 'assets/Imagenes/Cofres Imagenes/Cofres Abiertos/Cofre_EPICO_Abierto.png', cost: 100, currency: 'gems', base: { coins: [150, 260], gems: [4, 8] }, drops: [['Fragmento epico o item completo', 70], ['Fragmento demon', 9], ['Fragmento VIP', 1]] },
    { id: 'demon', name: 'Cofre Demon', image: 'assets/Imagenes/Cofres Imagenes/Cofre DEMON.png', openImage: 'assets/Imagenes/Cofres Imagenes/Cofres Abiertos/Cofre_DEMON_Abierto.png', cost: 250, currency: 'gems', base: { coins: [260, 420], gems: [8, 16] }, drops: [['Fragmento o item Demon', 65], ['Fragmento VIP', 10]] },
    { id: 'vip', name: 'Cofre VIP', image: 'assets/Imagenes/Cofres Imagenes/Cofre VIP.png', openImage: 'assets/Imagenes/Cofres Imagenes/Cofres Abiertos/Cofre_VIP_Abierto.png', cost: 600, currency: 'gems', base: { coins: [450, 800], gems: [18, 34] }, drops: [['Fragmento o item VIP', 60], ['Fragmento Demon', 40]] },
    { id: 'luck', name: 'Cofre de la Suerte', image: 'assets/Imagenes/Cofres Imagenes/Cofre LUCK.png', openImage: 'assets/Imagenes/Cofres Imagenes/Cofres Abiertos/Cofre_LUCK_Abierto.png', cost: 50, currency: 'coins', base: { coins: [35, 90], gems: [0, 2] }, drops: [['Monedas extra', 50], ['Fragmento epico', 30], ['Skin sorpresa', 15], ['Fragmento demon', 5]], upgradeable: true }
];
window.CHESTS_DATA = CHESTS_DATA;

// RUBY_PASS_ASSET_SLOT: replace null image paths with your final PNG files.
const RUBY_PASS_ASSETS = {
    logo: 'assets/UI/Store/RubyPass/Logo/ruby_pass_lock.png', // RUBY_PASS_ASSET_SLOT_LOGO_LOCK
    accessBanner: 'assets/UI/Store/RubyPass/Access/ruby_pass_banner.png', // RUBY_PASS_ASSET_SLOT_ACCESS_BANNER
    background: 'assets/UI/Store/RubyPass/Backgrounds/bg_ruby_pass_main.png', // RUBY_PASS_ASSET_SLOT_BACKGROUND
    currentPoint: 'assets/UI/Store/RubyPass/Markers/ruby_pass_current_point.png', // RUBY_PASS_ASSET_SLOT_CURRENT_POINT
    arcTexture: RUBY_PASS_REWARD_PLACEHOLDER, // Slot visual de reserva por si se reactiva un arco unico.
    freeTrackTexture: 'assets/UI/Store/RubyPass/Arcs/ruby_pass_free_track.png', // RUBY_PASS_ASSET_SLOT_FREE_TRACK
    premiumTrackTexture: 'assets/UI/Store/RubyPass/Arcs/ruby_pass_premium_track.png', // RUBY_PASS_ASSET_SLOT_PREMIUM_TRACK
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
// RUBY_PASS_REWARDS — 30 niveles
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

const RUBY_PASS_PREMIUM_COST_GEMS = 250;
const RUBY_PASS_XP_PER_WIN = 120;

// SHOP_EMOTE_ASSET_SLOT: add your emote PNG paths here.
const EMOTES_DATA = [
    { id: 'emote_normal', name: 'Normal', image: 'assets/UI/Store/Emotes/emote_brifon_normal.png', rarity: 'BASICA', price: EMOTE_STANDARD_PRICE_COINS, priceType: 'coins', slot: 'SHOP_EMOTE_ASSET_SLOT_BASIC_NORMAL' },
    { id: 'emote_saludo', name: 'Saludo', image: 'assets/UI/Store/Emotes/emote_brifon_saludo.png', rarity: 'BASICA', price: EMOTE_STANDARD_PRICE_COINS, priceType: 'coins', slot: 'SHOP_EMOTE_ASSET_SLOT_BASIC_SALUDO' },
    { id: 'emote_enojado', name: 'Enojado', image: 'assets/UI/Store/Emotes/emote_brifon_enojado.png', rarity: 'BASICA', price: EMOTE_STANDARD_PRICE_COINS, priceType: 'coins', slot: 'SHOP_EMOTE_ASSET_SLOT_BASIC_ENOJADO' },
    { id: 'emote_Llorando', name: 'Llorando', image: 'assets/UI/Store/Emotes/emote_brifon_llorando.png', rarity: 'BASICA', price: EMOTE_STANDARD_PRICE_COINS, priceType: 'coins', slot: 'SHOP_EMOTE_ASSET_SLOT_BASIC_LLORANDO' },
    { id: 'emote_sorprendido', name: 'Sorprendido', image: 'assets/UI/Store/Emotes/emote_brifon_sorprendido.png', rarity: 'BASICA', price: EMOTE_STANDARD_PRICE_COINS, priceType: 'coins', slot: 'SHOP_EMOTE_ASSET_SLOT_BASIC_SORPRENDIDO' },
    { id: 'emote_mudo', name: 'Mudo', image: 'assets/UI/Store/Emotes/emote_brifon_mudo.png', rarity: 'BASICA', price: EMOTE_STANDARD_PRICE_COINS, priceType: 'coins', slot: 'SHOP_EMOTE_ASSET_SLOT_BASIC_MUDO' },
    { id: 'emote_ruby_pass_01', name: 'Ruby Pass', image: RUBY_PASS_ASSETS.premiumEmote01, rarity: 'VIP', vip: true, passOnly: true, rubyPassLane: 'premium', rubyPassLevel: 8, slot: 'SHOP_EMOTE_ASSET_SLOT_RUBY_PASS_01' },
];

const VIP_ASSET_BASE = 'assets/UI/Store/VIP/Bundles';
const VIP_ITEM_PRICE = 300;
const VIP_PANEL_PRICE = 620;

function vipSkin(folder, id, name, price = VIP_ITEM_PRICE) {
    return { type: 'vipSkin', id, name, price, image: `${VIP_ASSET_BASE}/${folder}/${id}.png` };
}

function vipTrail(folder, id, name, price = 320) {
    return { type: 'vipTrailPng', id, name, price, image: `${VIP_ASSET_BASE}/${folder}/${id}.png`, trailId: id };
}

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
        title: 'ESPECIALES VIP',
        subtitle: 'Espacio reservado para nuevos extras',
        cover: 'assets/UI/Store/VIP/Banners/banner_vip_specials.png',
        detailBackground: 'assets/UI/Store/VIP/Banners/bg_vip_specials.png'
    }
];

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
            { ...vipTrail('DarkCarnival', 'trail_sonrisa_malvada', 'Trail Sonrisa Malvada'), previewColor: 'red' },
            { ...vipTrail('DarkCarnival', 'trail_circo', 'Trail Circo'), previewColor: 'orange' },
            vipSkin('DarkCarnival', 'skin_bufon_maldito', 'Bufon Maldito', 340),
            vipSkin('DarkCarnival', 'skin_payaso_oscuro', 'Payaso Oscuro', 340),
            vipSkin('DarkCarnival', 'skin_marioneta', 'Marioneta'),
            vipSkin('DarkCarnival', 'skin_mascara_sonriente', 'Mascara Sonriente'),
            vipSkin('DarkCarnival', 'skin_titiritero', 'Titiritero', 340),
            vipSkin('DarkCarnival', 'skin_arlequin', 'Arlequin'),
            vipSkin('DarkCarnival', 'skin_mascara_veneciana', 'Mascara Veneciana'),
            vipSkin('DarkCarnival', 'skin_sonrisa_rota', 'Sonrisa Rota', 340)
        ]
    }
];

const VIP_PACKAGES_DATA = [
    {
        id: 'monsters',
        title: 'PAQUETE MONSTRUOS',
        price: 1200,
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
            },
            { type: 'vipSkin', id: 'skin_fantasma', name: 'Fantasma', price: 260, image: 'assets/UI/Store/VIP/Bundles/Monsters/skin_fantasma.png' },
            { type: 'vipSkin', id: 'skin_lobo_monstruo', name: 'Lobo Monstruo', price: 300, image: 'assets/UI/Store/VIP/Bundles/Monsters/skin_lobo_monstruo.png' },
            { type: 'vipSkin', id: 'skin_calabaza', name: 'Calabaza', price: 280, image: 'assets/UI/Store/VIP/Bundles/Monsters/skin_calabaza.png' },
            {
                type: 'bundle',
                name: 'Las brujas',
                price: 620,
                image: 'assets/UI/Store/VIP/Bundles/Monsters/skin_bruja.png',
                items: [
                    { type: 'skin', id: 'skin_bruja', name: 'Bruja', image: 'assets/UI/Store/VIP/Bundles/Monsters/skin_bruja.png' },
                    { type: 'skin', id: 'skin_nocturna', name: 'Nocturna', image: 'assets/UI/Store/VIP/Bundles/Monsters/skin_nocturna.png' }
                ]
            }
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
        price: 1200,
        cover: 'assets/UI/Store/VIP/Bundles/Food/panel_bundle_food.png',
        detailBackground: 'assets/UI/Store/VIP/Bundles/Food/bg_food_panel.png',
        popupBackground: 'assets/UI/Store/VIP/Bundles/Food/popup_food_bg.png',
        accent: '#ff8a3d',
        items: [
            { type: 'vipSkin', id: 'skin_hamburguesa', name: 'Hamburguesa', price: 260, image: 'assets/UI/Store/VIP/Bundles/Food/skin_hamburguesa.png' },
            { type: 'vipSkin', id: 'skin_pizza', name: 'Pizza', price: 260, image: 'assets/UI/Store/VIP/Bundles/Food/skin_pizza.png' },
            { type: 'vipSkin', id: 'skin_helado', name: 'Helado', price: 260, image: 'assets/UI/Store/VIP/Bundles/Food/skin_helado.png' },
            { type: 'vipSkin', id: 'skin_limon_toxico', name: 'Limon Toxico', price: 320, image: 'assets/UI/Store/VIP/Bundles/Food/skin_limon_toxico.png' },
            { type: 'vipSkin', id: 'skin_sandia', name: 'Sandia', price: 260, image: 'assets/UI/Store/VIP/Bundles/Food/skin_sandia.png' },
            { type: 'vipSkin', id: 'skin_cafe', name: 'Cafe', price: 260, image: 'assets/UI/Store/VIP/Bundles/Food/skin_cafe.png' }
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
            { type: 'vipSkin', id: 'skin_sol', name: 'Sol', price: 300, image: 'assets/UI/Store/VIP/Bundles/Space/skin_sol.png' },
            { type: 'vipSkin', id: 'skin_luna', name: 'Luna', price: 300, image: 'assets/UI/Store/VIP/Bundles/Space/skin_luna.png' },
            { type: 'vipSkin', id: 'skin_planeta', name: 'Planeta', price: 300, image: 'assets/UI/Store/VIP/Bundles/Space/skin_planeta.png' },
            { type: 'vipSkin', id: 'skin_agujero_negro', name: 'Agujero Negro', price: 380, image: 'assets/UI/Store/VIP/Bundles/Space/skin_agujero_negro.png' },
            { type: 'vipSkin', id: 'skin_meteorito', name: 'Meteorito', price: 320, image: 'assets/UI/Store/VIP/Bundles/Space/skin_meteorito.png' },
            { type: 'vipSkin', id: 'skin_alien', name: 'Alien', price: 340, image: 'assets/UI/Store/VIP/Bundles/Space/skin_alien.png' },
            { type: 'vipTrailPng', id: 'trail_estrellas', name: 'Trail Estrellas', price: 320, image: 'assets/UI/Store/VIP/Bundles/Space/trail_estrellas.png', trailId: 'trail_estrellas' },
            { type: 'vipTrailPng', id: 'trail_auroras', name: 'Trail Auroras', price: 320, image: 'assets/UI/Store/VIP/Bundles/Space/trail_auroras.png', trailId: 'trail_auroras' }
        ]
    },
    {
        id: 'professional',
        title: 'PAQUETE PROFESIONAL',
        price: 1300,
        cover: 'assets/UI/Store/VIP/Bundles/Professional/portada_paquete_profesional.png',
        detailBackground: 'assets/UI/Store/VIP/Bundles/Professional/bg_profesional_panel.png',
        popupBackground: 'assets/UI/Store/VIP/Bundles/Professional/popup_profesional_bg.png',
        accent: '#b6c7ff',
        items: [
            { type: 'vipSkin', id: 'skin_ninja', name: 'Ninja', price: 300, image: 'assets/UI/Store/VIP/Bundles/Professional/skin_ninja.png' },
            { type: 'vipSkin', id: 'skin_pirata', name: 'Pirata', price: 300, image: 'assets/UI/Store/VIP/Bundles/Professional/skin_pirata.png' },
            { type: 'vipSkin', id: 'skin_cientifico', name: 'Cientifico', price: 300, image: 'assets/UI/Store/VIP/Bundles/Professional/skin_cientifico.png' },
            { type: 'vipSkin', id: 'skin_hacker', name: 'Hacker', price: 340, image: 'assets/UI/Store/VIP/Bundles/Professional/skin_hacker.png' },
            { type: 'vipSkin', id: 'skin_chef', name: 'Chef', price: 280, image: 'assets/UI/Store/VIP/Bundles/Professional/skin_chef.png' },
            { type: 'vipSkin', id: 'skin_samurai', name: 'Samurai', price: 360, image: 'assets/UI/Store/VIP/Bundles/Professional/skin_samurai.png' }
        ]
    },
    {
        id: 'wild',
        title: 'PAQUETE SALVAJE',
        price: 1350,
        cover: 'assets/UI/Store/VIP/Bundles/Wild/portada_paquete_salvaje.png',
        detailBackground: 'assets/UI/Store/VIP/Bundles/Wild/bg_salvaje_panel.png',
        popupBackground: 'assets/UI/Store/VIP/Bundles/Wild/popup_salvaje_bg.png',
        accent: '#44ff88',
        items: [
            { type: 'vipSkin', id: 'skin_lobo_salvaje', name: 'Lobo Salvaje', price: 320, image: 'assets/UI/Store/VIP/Bundles/Wild/skin_lobo_salvaje.png' },
            { type: 'vipSkin', id: 'skin_serpiente', name: 'Serpiente', price: 300, image: 'assets/UI/Store/VIP/Bundles/Wild/skin_serpiente.png' },
            { type: 'vipSkin', id: 'skin_tiburon', name: 'Tiburon', price: 340, image: 'assets/UI/Store/VIP/Bundles/Wild/skin_tiburon.png' },
            { type: 'vipSkin', id: 'skin_cuervo', name: 'Cuervo', price: 300, image: 'assets/UI/Store/VIP/Bundles/Wild/skin_cuervo.png' },
            { type: 'vipSkin', id: 'skin_escorpion', name: 'Escorpion', price: 320, image: 'assets/UI/Store/VIP/Bundles/Wild/skin_escorpion.png' },
            { type: 'vipSkin', id: 'skin_tigre', name: 'Tigre', price: 360, image: 'assets/UI/Store/VIP/Bundles/Wild/skin_tigre.png' }
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
            { type: 'vipSkin', id: 'skin_galleta_navidad', name: 'Galleta Navidad', price: 320, image: 'assets/UI/Store/VIP/Bundles/Christmas/skin_galleta_navidad.png' }
        ]
    }
];

let gambitState = null;
let selectedChestId = null;
let vipCarouselIndex = 0;

let trailAnimId = null; // Control para el memory leak de animaciones

function openShop() {
    window.playSfx?.('menuSelect', 0.6);
    SKINS_DATA.forEach(s => {
        if (s.id === 'cyan') return;
        s.owned = localStorage.getItem('skin_' + s.id) === 'true';
    });
    BANNERS_DATA.forEach(b => {
        b.owned = localStorage.getItem('banner_' + b.id) === 'true';
        if (b.id === 'Banner_Deafult') b.owned = true;
    });
    const panel = document.getElementById('shopPanel');
    panel.style.display = 'flex';
    panel.classList.remove('entering');
    void panel.offsetWidth;
    panel.classList.add('entering');

    document.getElementById('shop-coins').textContent =
        parseInt(localStorage.getItem('deadCoins') || '0');
    document.getElementById('shop-gems').textContent =
        parseInt(localStorage.getItem('gems') || '0');

    updateEquippedSkinPreview();

    showShopSection('home');
    updateMenuHUD();
}

function closeShop() {
    if (trailAnimId) {
        cancelAnimationFrame(trailAnimId);
        trailAnimId = null;
    }
    if (previewTrailAnim) {
        cancelAnimationFrame(previewTrailAnim);
        previewTrailAnim = null;
    }
    const panel = document.getElementById('shopPanel');
    panel.classList.add('leaving');
    setTimeout(() => {
        panel.style.display = 'none';
        panel.classList.remove('leaving');
        updateMenuHUD();
    }, 300);
}

function showShopSection(section) {
    if (section !== 'trails' && trailAnimId) {
        cancelAnimationFrame(trailAnimId);
        trailAnimId = null;
    }
    if (section !== 'trails' && previewTrailAnim) {
        cancelAnimationFrame(previewTrailAnim);
        previewTrailAnim = null;
    }

    ['home', 'skins', 'trails', 'banners', 'cofres', 'emotes', 'daily', 'ofertas', 'conversion'].forEach(s => {
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

    const content = document.getElementById('shopContent');

    if (section === 'home') renderHome(content);
    else if (section === 'skins') renderSkinsPage(content);
    else if (section === 'trails') renderTrailsPage(content);
    else if (section === 'banners') renderBannersPage(content);
    else if (section === 'cofres') renderChestsPage(content);
    else if (section === 'emotes') renderEmotesPage(content);
    else if (section === 'daily') renderDailyGiftPage(content);
    else if (section === 'conversion') renderConversionPage(content);
    else {
        content.innerHTML = `
            <div style="display:flex; align-items:center; gap:16px; margin-bottom:24px;">
                <button onclick="showShopSection('home')" ...>← VOLVER</button>
            </div>
            <div ...>PRÓXIMAMENTE</div>
        `;
    }
}

function renderHome(container) {
    const rubyClaimable = hasRubyPassClaimableRewards();
    const panels = [
        { section: 'skins', image: 'assets/UI/Store/Panels/portada_panel_skins_tienda_normal.png' },
        { section: 'trails', image: 'assets/UI/Store/Panels/portada_panel_trails_tienda_normal.png' },
        { section: 'cofres', image: 'assets/UI/Store/Panels/portada_panel_cofres_tienda_normal.png' },
        { section: 'banners', image: 'assets/UI/Store/Panels/portada_panel_banners_tienda_normal.png' },
        { section: 'emotes', image: 'assets/UI/Store/Panels/portada_panel_emotes_tienda_normal.png' },
        { section: 'daily', image: 'assets/UI/Store/Panels/portada_panel_regalo_diario_tienda_normal.png' },
        { section: 'conversion', image: 'assets/UI/Store/Panels/portada_panel_conversion_tienda_normal.png' },
    ];
    container.innerHTML = `
        <div style="display:grid; grid-template-columns:minmax(0,1fr) minmax(260px,380px); gap:16px; margin-bottom:32px;">
            <div class="shop-vip-access-banner" style="background-image:linear-gradient(90deg, rgba(18,11,5,0.88), rgba(12,9,7,0.68)), url('assets/UI/Store/VIP/Banners/banner_tienda_vip_home.png');">
                <div style="position:absolute; right:0; top:0; bottom:0; width:300px; background:linear-gradient(90deg, transparent, rgba(255,180,0,0.06)); pointer-events:none;"></div>
                <div style="position:absolute; left:0; top:0; bottom:0; width:4px; background:linear-gradient(to bottom, #ffcc00, #ff8800);"></div>
                <div style="margin-left:12px;">
                    <div style="color:white; font-family:monospace; font-size:22px; font-weight:900; letter-spacing:3px;">TIENDA VIP</div>
                    <div style="color:rgba(255,255,255,0.5); font-family:monospace; font-size:12px; margin-top:6px;">Skins, trails y mas contenido exclusivo.</div>
                </div>
                <button onclick="openVIP()" style="margin-left:auto; padding:10px 24px; background:rgba(255,180,0,0.15); border:1px solid rgba(255,200,0,0.4); border-radius:8px; color:#ffcc00; font-family:monospace; font-size:12px; letter-spacing:2px; cursor:pointer; pointer-events:all;">VER</button>
            </div>

            <button onclick="openRubyPass()" class="ruby-pass-access ${rubyClaimable ? 'has-ruby-claim' : ''}" type="button" style="${RUBY_PASS_ASSETS.accessBanner ? `background-image:linear-gradient(90deg, rgba(25,0,8,0.78), rgba(8,6,10,0.52)), url('${RUBY_PASS_ASSETS.accessBanner}'); background-size:cover; background-position:center;` : ''}">
                <div class="ruby-pass-access-bg"></div>
                <div class="ruby-pass-lock-slot">
                    ${RUBY_PASS_ASSETS.logo ? `<img src="${RUBY_PASS_ASSETS.logo}" alt="">` : '<span></span>'}
                </div>
                <div class="ruby-pass-access-copy">
                    <div class="ruby-pass-access-kicker">PASE DE TEMPORADA</div>
                    <div class="ruby-pass-access-title">RUBY PASS</div>
                    ${rubyClaimable ? '<div class="ruby-pass-claim-hint">RECOMPENSA LISTA</div>' : ''}
                </div>
                <div class="ruby-pass-access-arrow">></div>
            </button>
        </div>

        <div style="color:rgba(255,255,255,0.4); font-family:monospace; font-size:11px; letter-spacing:4px; margin-bottom:16px;">CATEGORIAS</div>

        <div class="store-panel-grid">
            ${panels.map(panel => `
                <button class="store-category-panel" onclick="showShopSection('${panel.section}')" type="button">
                    <img src="${panel.image}" alt="" draggable="false">
                </button>
            `).join('')}
        </div>
    `;
}
function renderSkinsPage(container) {
    const equipped = localStorage.getItem('equippedSkin') || 'cyan';
    container.innerHTML = `
        <div style="display:flex; align-items:center; gap:16px; margin-bottom:24px;">
            <button onclick="showShopSection('home')" style="padding:8px 16px; background:none; border:1px solid rgba(255,255,255,0.12); border-radius:8px; color:rgba(255,255,255,0.5); font-family:monospace; font-size:11px; letter-spacing:2px; cursor:pointer;">← VOLVER</button>
            <div style="color:rgba(255,255,255,0.4); font-family:monospace; font-size:11px; letter-spacing:4px;">SKINS</div>
        </div>
        <div style="display:grid; grid-template-columns:repeat(5,1fr); gap:14px;">
            ${SKINS_DATA.map(s => renderSkinCard(s, equipped)).join('')}
        </div>
    `;
}

function renderSkinCard(s, equipped) {
    const isEquipped = equipped === s.id;
    const rarityColor = RARITY_COLORS[s.rarity] || '#aaa';

    if (s.soon) {
        return `
        <div style="background:rgba(255,255,255,0.02); border:1px dashed rgba(255,255,255,0.08); border-radius:14px; padding:20px 12px; display:flex; flex-direction:column; align-items:center; gap:10px;">
            <div style="width:72px; height:72px; border-radius:10px; background:rgba(255,255,255,0.05); border:2px dashed rgba(255,255,255,0.1); display:grid; place-items:center; overflow:hidden;">
                ${s.imageRight ? `<img src="${s.imageRight}" style="width:100%;height:100%;object-fit:contain;opacity:.28;">` : ''}
            </div>
            <div style="color:rgba(255,255,255,0.22); font-family:monospace; font-size:10px; letter-spacing:2px;">${s.name || '???'}</div>
            <div style="color:${rarityColor}33; font-family:monospace; font-size:9px; letter-spacing:1px;">${s.rarity}</div>
            <div style="color:rgba(255,255,255,0.12); font-family:monospace; font-size:9px;">PRÓXIMAMENTE</div>
        </div>`;
    }

    const coins = parseInt(localStorage.getItem('deadCoins') || '0');
    const gems = parseInt(localStorage.getItem('gems') || '0');
    const canBuyMain = s.priceType === 'gems' ? gems >= s.price : coins >= s.price;
    const canBuyAlt = s.altPrice ? (s.altType === 'gems' ? gems >= s.altPrice : coins >= s.altPrice) : false;
    const canBuy = !s.owned && (canBuyMain || canBuyAlt);
    const mainIcon = CURRENCY_ICONS[s.priceType || 'coins'];
    const altIcon = s.altType ? CURRENCY_ICONS[s.altType] : null;

    return `
    <div style="background:rgba(255,255,255,0.03); border:1px solid ${isEquipped ? rarityColor + '66' : 'rgba(255,255,255,0.08)'}; border-radius:14px; padding:20px 12px; display:flex; flex-direction:column; align-items:center; gap:10px; transition:0.2s; ${isEquipped ? 'box-shadow:0 0 20px ' + rarityColor + '22' : ''}">
        <div style="width:76px; height:76px; border-radius:10px; background:${s.color}22; border:2px solid ${s.color}66; display:flex; align-items:center; justify-content:center; font-size:24px; overflow:hidden;">
            ${s.imageRight ? `<img src="${s.imageRight}" style="width:100%;height:100%;object-fit:contain;">` : (s.emoji ? s.emoji : `<div style="width:24px;height:24px;border-radius:50%;background:${s.color};box-shadow:0 0 10px ${s.color}88;"></div>`)}
        </div>
        <div style="color:white; font-family:monospace; font-size:11px; letter-spacing:1px;">${s.name}</div>
        <div style="color:${rarityColor}; font-family:monospace; font-size:9px; letter-spacing:2px;">${s.rarity}</div>
        <div style="min-height:34px; color:rgba(255,255,255,0.32); font-family:monospace; font-size:9px; line-height:1.35; text-align:center;">${s.archetype || 'Sin arquetipo'}<br>${s.ability || ''}</div>
        ${s.fragments ? `<div style="color:rgba(255,255,255,0.22); font-family:monospace; font-size:9px;">${s.fragments} FRAGMENTOS</div>` : ''}
        ${s.owned
            ? `<button onclick="equipSkin('${s.id}')" style="width:100%; padding:6px 0; border-radius:8px; border:1px solid ${isEquipped ? rarityColor + '66' : 'rgba(255,255,255,0.12)'}; background:${isEquipped ? rarityColor + '15' : 'none'}; color:${isEquipped ? rarityColor : 'rgba(255,255,255,0.4)'}; font-family:monospace; font-size:9px; cursor:pointer; letter-spacing:1px;">${isEquipped ? '✔ EQUIPADA' : 'EQUIPAR'}</button>`
            : `<button onclick="buySkin('${s.id}')" ${!canBuy ? 'disabled' : ''} style="width:100%; padding:6px 0; border-radius:8px; border:1px solid ${canBuy ? 'rgba(255,238,0,0.4)' : 'rgba(255,255,255,0.08)'}; background:none; color:${canBuy ? '#ffee00' : 'rgba(255,255,255,0.2)'}; font-family:monospace; font-size:9px; cursor:${canBuy ? 'pointer' : 'default'}; letter-spacing:1px; display:flex; align-items:center; justify-content:center; gap:5px; flex-wrap:wrap;"><img src="${mainIcon}" style="width:14px;height:14px;object-fit:contain;"> ${s.price}${s.altPrice ? ` <span style="opacity:.45;">/</span> <img src="${altIcon}" style="width:14px;height:14px;object-fit:contain;"> ${s.altPrice}` : ''}</button>`
        }
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
    const skin = SKINS_DATA.find(s => s.id === id);
    if (!skin) return;
    let coins = parseInt(localStorage.getItem('deadCoins') || '0');
    let gems = parseInt(localStorage.getItem('gems') || '0');
    playerData.deadCoins = coins;
    const canPayMain = skin.priceType === 'gems' ? gems >= skin.price : coins >= skin.price;
    const canPayAlt = skin.altPrice ? (skin.altType === 'gems' ? gems >= skin.altPrice : coins >= skin.altPrice) : false;
    if (!canPayMain && !canPayAlt) return;

    const chosenCurrency = canPayAlt && !canPayMain ? skin.altType : skin.priceType;
    const chosenAmount = canPayAlt && !canPayMain ? skin.altPrice : skin.price;
    showShopModal({
        kicker: 'CONFIRMAR COMPRA',
        title: skin.name,
        image: skin.imageRight || skin.imageLeft || SHOP_PLACEHOLDER_IMAGE,
        fallback: skin.emoji || skin.name?.charAt(0) || 'S',
        body: `Seguro comprar por ${chosenAmount} ${chosenCurrency === 'gems' ? 'rubies' : 'monedas'}?`,
        confirmText: 'SI',
        cancelText: 'NO',
        onConfirm: () => completeSkinPurchase(id)
    });
}

function completeSkinPurchase(id) {
    const skin = SKINS_DATA.find(s => s.id === id);
    if (!skin) return;
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
    localStorage.setItem('skin_' + id, 'true');
    skin.owned = true;
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
            <button onclick="showShopSection('home')" style="padding:8px 16px; background:none; border:1px solid rgba(255,255,255,0.12); border-radius:8px; color:rgba(255,255,255,0.5); font-family:monospace; font-size:11px; letter-spacing:2px; cursor:pointer;">VOLVER</button>
            <div style="color:rgba(255,255,255,0.4); font-family:monospace; font-size:11px; letter-spacing:4px;">BANNERS</div>
        </div>
        <div style="display:grid; grid-template-columns:repeat(auto-fit,minmax(240px,1fr)); gap:16px;">
            ${BANNERS_DATA.map(b => renderBannerCard(b, equipped)).join('')}
        </div>
    `;
}

function renderBannerCard(b, equipped) {
    const owned = b.id === 'Banner_Deafult' || localStorage.getItem('banner_' + b.id) === 'true' || b.owned === true;
    const isEquipped = equipped === b.id;
    const isVIP = b.rarity === 'VIP';
    const canBuy = !b.exclusive && parseInt(localStorage.getItem('deadCoins') || '0') >= b.price;
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

    return `
        <div style="background:${isVIP && isEquipped ? 'rgb(18,18,24)' : 'rgba(255,255,255,0.03)'}; border:${borderStyle}; border-radius:14px; padding:14px; display:flex; flex-direction:column; gap:12px; box-shadow:${boxShadow}; ${extraStyle}">
            <div style="height:104px; border-radius:10px; border:1px solid rgba(0,0,0,0.45); background:${bannerBg}; background-size:cover; background-position:center; display:flex; align-items:center; justify-content:center; color:rgba(255,255,255,0.48); font-family:monospace; font-size:10px; letter-spacing:3px;">
                ${b.cover ? '' : 'ESPACIO PNG PORTADA'}
            </div>
            <div style="display:flex; justify-content:space-between; gap:10px; align-items:center;">
                <div>
                    <div style="color:white; font-family:monospace; font-size:12px; letter-spacing:1px;">${b.name}</div>
                    <div style="color:${BANNER_RARITY_COLORS[b.rarity] || 'rgba(255,255,255,0.35)'}; font-family:monospace; font-size:9px; margin-top:4px;">${b.rarity === 'VIP' ? 'VIP / PASE RUBY' : (b.rarity || 'NORMAL')}</div>
                </div>
                ${owned
            ? `<button onclick="equipBanner('${b.id}')" style="padding:8px 12px; border-radius:8px; border:1px solid ${isEquipped ? (isVIP ? 'rgba(255,204,0,0.6)' : 'rgba(0,255,231,0.6)') : 'rgba(255,255,255,0.12)'}; background:${isEquipped ? (isVIP ? 'rgba(255,204,0,0.12)' : 'rgba(0,255,231,0.12)') : 'none'}; color:${isEquipped ? (isVIP ? '#ffd700' : '#00ffe7') : 'rgba(255,255,255,0.5)'}; font-family:monospace; font-size:9px; cursor:pointer;">${isEquipped ? 'EQUIPADO' : 'EQUIPAR'}</button>`
            : `<button onclick="buyBanner('${b.id}')" ${(!canBuy || b.exclusive) ? 'disabled' : ''} style="padding:8px 12px; border-radius:8px; border:1px solid ${canBuy && !b.exclusive ? 'rgba(255,238,0,0.45)' : 'rgba(255,255,255,0.08)'}; background:none; color:${canBuy && !b.exclusive ? '#ffee00' : 'rgba(255,255,255,0.22)'}; font-family:monospace; font-size:9px; cursor:${canBuy && !b.exclusive ? 'pointer' : 'default'};">${b.exclusive ? 'RESERVADO' : b.price}</button>`
        }
            </div>
        </div>
    `;
}


function buyBanner(id) {
    const banner = BANNERS_DATA.find(b => b.id === id);
    if (!banner || banner.exclusive) return;
    let coins = parseInt(localStorage.getItem('deadCoins') || '0');
    if (coins < banner.price) return;
    coins -= banner.price;
    localStorage.setItem('deadCoins', coins);
    localStorage.setItem('banner_' + id, 'true');
    localStorage.setItem('equippedBanner', id);
    document.getElementById('shop-coins').textContent = coins;
    updateMenuHUD();
    renderBannersPage(document.getElementById('shopContent'));
}

function equipBanner(id) {
    localStorage.setItem('equippedBanner', id);
    updateMenuHUD();

    const picker = document.getElementById('banner-picker');
    if (picker && picker.style.display !== 'none') {
        // Forzar re-render del picker con el nuevo equipped
        picker.style.display = 'none';
        toggleBannerPicker();
    }

    const navBanners = document.getElementById('nav-banners');
    if (navBanners && navBanners.style.color === '#ff4d6d') {
        renderBannersPage(document.getElementById('shopContent'));
    }
}

function renderEmotesPage(container) {
    container.innerHTML = `
        <div style="display:flex; align-items:center; gap:16px; margin-bottom:24px;">
            <button onclick="showShopSection('home')" style="padding:8px 16px; background:none; border:1px solid rgba(255,255,255,0.12); border-radius:8px; color:rgba(255,255,255,0.5); font-family:monospace; font-size:11px; letter-spacing:2px; cursor:pointer;">VOLVER</button>
            <div style="color:rgba(255,255,255,0.4); font-family:monospace; font-size:11px; letter-spacing:4px;">EMOTES</div>
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
    const canBuy = !owned && !emote.passOnly && canAfford(emote.price || EMOTE_STANDARD_PRICE_COINS, emote.priceType || 'coins');
    const action = owned
        ? `<button onclick="equipEmote('${emote.id}')" type="button">${equipped ? 'ACTIVO' : 'USAR'}</button>`
        : emote.passOnly
            ? `<button class="is-pass-only" type="button" disabled>EN EL PASE</button>`
            : `<button onclick="buyEmote('${emote.id}')" type="button" ${canBuy ? '' : 'disabled'}>${renderPrice(emote.price || EMOTE_STANDARD_PRICE_COINS, emote.priceType || 'coins')}</button>`;
    return `
        <div class="emote-card" data-emote-id="${emote.id}">
            <div data-asset-slot="${emote.slot}" style="width:96px; height:96px; border-radius:50%; border:1px dashed ${color}88; background:${color}12; display:grid; place-items:center; overflow:hidden; color:rgba(255,255,255,0.35); font-family:monospace; font-size:10px; letter-spacing:2px;">
                ${emote.image ? `<img src="${emote.image}" style="width:100%;height:100%;object-fit:contain;">` : 'PNG'}
            </div>
            <div style="color:white; font-family:monospace; font-size:12px; letter-spacing:1px;">${emote.name}</div>
            ${emote.passOnly ? `<div style="color:${color}; font-family:monospace; font-size:9px; letter-spacing:2px;">EN EL PASE</div>` : `<div style="color:${color}; font-family:monospace; font-size:9px; letter-spacing:2px;">${emote.rarity}</div>`}
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
    showShopModal({
        kicker: 'CONFIRMAR EMOTE',
        title: emote.name,
        image: emote.image,
        body: `Seguro comprar por ${price} ${currency === 'gems' ? 'rubies' : 'monedas'}?`,
        confirmText: 'SI',
        cancelText: 'NO',
        onConfirm: () => {
            if (!canAfford(price, currency)) return alert(currency === 'gems' ? 'No tienes suficientes rubies.' : 'No tienes suficientes monedas.');
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
    const avatar = localStorage.getItem('playerAvatar') || 'assets/Imagenes/Avatares/Avatar_Default.png';
    const bannerId = localStorage.getItem('equippedBanner') || 'static_core';
    const banner = BANNERS_DATA.find(b => b.id === bannerId) || BANNERS_DATA[0];
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
    const imageHTML = options.mediaHTML || (options.image
        ? `<img src="${options.image}" alt="" draggable="false">`
        : `<span>${options.fallback || 'PNG'}</span>`);
    modal.innerHTML = `
        <div class="shop-modal-dim" onclick="closeShopModal()"></div>
        <div class="shop-modal-card ${options.cardClass || ''}" style="${options.background ? `background-image:linear-gradient(180deg, rgba(8,8,14,0.88), rgba(8,8,14,0.96)), url('${options.background}'); background-size:cover; background-position:center;` : ''}">
            <button class="shop-modal-x" onclick="closeShopModal()" type="button">X</button>
            <div class="shop-modal-kicker">${options.kicker || 'THE GEM'}</div>
            <div class="shop-modal-title">${options.title || ''}</div>
            <div class="shop-modal-media ${options.mediaClass || ''}">${imageHTML}</div>
            <div class="shop-modal-body">${options.body || ''}</div>
            <div class="shop-modal-actions">
                ${options.cancelText === null ? '' : `<button class="shop-modal-btn secondary" id="shop-modal-cancel" type="button">${options.cancelText || 'CERRAR'}</button>`}
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

function openChestReward(chest) {
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

function showChestResult(chest) {
    const { coins, gems, drop } = openChestReward(chest);
    const rewardView = getChestRewardView(drop, coins, gems);
    const currencyHTML = renderCurrencyRewardPiles({ coins, gems });
    window.playSfx?.('reward');
    showShopModal({
        kicker: 'RECOMPENSA',
        title: drop,
        image: currencyHTML ? null : (rewardView.image || chest.openImage || chest.image),
        mediaHTML: currencyHTML || null,
        mediaClass: currencyHTML ? 'wide' : '',
        fallback: rewardView.text || 'ITEM',
        body: `${drop}<br>Base: ${coins} monedas + ${gems} rubies`,
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

function canAfford(amount, currency) {
    const key = currency === 'gems' ? 'gems' : 'deadCoins';
    return parseInt(localStorage.getItem(key) || '0') >= amount;
}

function spendCurrency(amount, currency) {
    const key = currency === 'gems' ? 'gems' : 'deadCoins';
    localStorage.setItem(key, parseInt(localStorage.getItem(key) || '0') - amount);
    refreshShopBalances();
}

function addCurrency(amount, currency) {
    const key = currency === 'gems' ? 'gems' : 'deadCoins';
    localStorage.setItem(key, parseInt(localStorage.getItem(key) || '0') + amount);
}

function refreshShopBalances() {
    const coins = parseInt(localStorage.getItem('deadCoins') || '0');
    const gems = parseInt(localStorage.getItem('gems') || '0');
    playerData.deadCoins = coins;
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
    const skin = SKINS_DATA.find(s => s.id === equippedId);
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
    const avatar = localStorage.getItem('playerAvatar') || 'assets/Imagenes/Avatares/Avatar_Default.png';
    const bannerId = localStorage.getItem('equippedBanner') || 'static_core';
    const banner = BANNERS_DATA.find(b => b.id === bannerId) || BANNERS_DATA[0];
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
    const ownedBanners = BANNERS_DATA.filter(b =>
        b.id === 'Banner_Deafult' ||
        b.owned === true ||
        localStorage.getItem('banner_' + b.id) === 'true'
    );
    picker.innerHTML = ownedBanners.map(b => `
        <button onclick="equipBanner('${b.id}')" style="
            height:48px;
            border-radius:8px;
            border:1px solid ${equipped === b.id ? (b.rarity === 'VIP' ? 'rgba(255,204,0,0.7)' : 'rgba(0,255,231,0.5)') : 'rgba(255,255,255,0.08)'};
            background-image: linear-gradient(90deg, rgba(5,6,12,0.92) 0%, rgba(5,6,12,0.55) 40%, transparent 100%), url('${b.cover}');
            background-size: cover;
            background-position: center;
            color: ${equipped === b.id ? (b.rarity === 'VIP' ? '#ffd700' : '#00ffe7') : 'rgba(255,255,255,0.75)'};
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
    localStorage.setItem('equippedBanner', id);
    const banner = BANNERS_DATA.find(b => b.id === id);
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
    const avatar = localStorage.getItem('playerAvatar') || 'assets/Imagenes/Avatares/Avatar_Default.png';
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
}

function closeVIP() {
    const panel = document.getElementById('vipPanel');
    panel.classList.add('leaving');
    setTimeout(() => {
        panel.style.display = 'none';
        panel.classList.remove('leaving');
    }, 300);
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
                    <span><img src="assets/Imagenes/Monetizacion/Rubies.png" alt=""> <b id="vip-gems">0</b></span>
                    <span><img src="assets/Imagenes/Monetizacion/DEAD_COIN.png" alt=""> <b id="vip-coins">0</b></span>
                    <button onclick="closeVIP()" type="button">VOLVER</button>
                </div>
            </div>
            <div id="vipContent" class="vip-content"></div>
        </div>
    `;
}

function renderVIPHome() {
    const content = document.getElementById('vipContent');
    if (!content) return;
    window.currentVIPDetailRenderer = null;
    const active = VIP_CAROUSEL_DATA[vipCarouselIndex % VIP_CAROUSEL_DATA.length];
    content.innerHTML = `
        <section class="vip-hero">
            <button class="vip-arrow" onclick="moveVIPCarousel(-1)" type="button">&lt;</button>
            <div class="vip-feature vip-carousel-glow" style="--vip-glow-a:${active.glowA || '#ffee00'}; --vip-glow-b:${active.glowB || '#ff8800'};" onclick="renderVIPCarouselDetail('${active.id}')">
                <div class="vip-feature-cover" style="background-image:linear-gradient(90deg, rgba(0,0,0,.58), rgba(0,0,0,.12)), url('${active.cover}');"></div>
                <div class="vip-feature-copy">
                    <div class="vip-kicker">PANEL DESTACADO</div>
                    <h2>${active.title}</h2>
                    <p>${active.subtitle}</p>
                    <div class="vip-price">${renderPrice(active.price, 'gems')}</div>
                </div>
            </div>
            <button class="vip-arrow" onclick="moveVIPCarousel(1)" type="button">&gt;</button>
        </section>
        <div class="vip-dots">
            ${VIP_CAROUSEL_DATA.map((panel, index) => `<button class="${index === vipCarouselIndex ? 'active' : ''}" onclick="setVIPCarousel(${index})" type="button">${index + 1}</button>`).join('')}
        </div>
        <section class="vip-banner-row">
            ${VIP_PROMO_BANNERS.map(renderVIPPromoBanner).join('')}
        </section>
        <section class="vip-package-grid">
            ${VIP_PACKAGES_DATA.map(renderVIPPackageCard).join('')}
        </section>
    `;
}

function moveVIPCarousel(direction) {
    vipCarouselIndex = (vipCarouselIndex + direction + VIP_CAROUSEL_DATA.length) % VIP_CAROUSEL_DATA.length;
    renderVIPHome();
}

function setVIPCarousel(index) {
    vipCarouselIndex = index;
    renderVIPHome();
}

function renderVIPPackageCard(pack) {
    return `
        <article class="vip-pack-card" style="--vip-accent:${pack.accent};" onclick="renderVIPPackageDetail('${pack.id}')">
            <div class="vip-pack-cover" style="background-image:linear-gradient(180deg, rgba(0,0,0,.12), rgba(0,0,0,.64)), url('${pack.cover}');"></div>
            <div class="vip-pack-body">
                <div class="vip-kicker">PAQUETE</div>
                <h3>${pack.title}</h3>
                <div>${pack.items.length} items</div>
                <strong>${renderPrice(pack.price, 'gems')}</strong>
            </div>
        </article>
    `;
}

function renderVIPCarouselDetail(id) {
    const panel = VIP_CAROUSEL_DATA.find(item => item.id === id);
    if (!panel) return renderVIPHome();
    window.currentVIPDetailRenderer = () => renderVIPCarouselDetail(id);
    renderVIPDetail(panel.title, panel.subtitle, panel.price, panel.cover, panel.items, () => buyVIPCollection('carousel', panel), panel.detailBackground);
}

function renderVIPPromoBanner(banner) {
    return `
        <article class="vip-promo-banner" onclick="renderVIPPromoDetail('${banner.id}')">
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
    content.innerHTML = `
        <button class="vip-back" onclick="renderVIPHome()" type="button">VOLVER A VIP</button>
        <section class="vip-detail-head" style="background-image:linear-gradient(90deg, rgba(8,8,14,.86), rgba(8,8,14,.52)), url('${banner.detailBackground}'); background-size:cover; background-position:center;">
            <div class="vip-detail-cover" style="background-image:url('${banner.cover}');"></div>
        </section>
        <section class="vip-empty-slot">
            <div class="vip-kicker">CONTENIDO</div>
        </section>
    `;
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
        <section class="vip-detail-head" style="background-image:linear-gradient(90deg, rgba(8,8,14,.86), rgba(8,8,14,.52)), url('${detailBackground}'); background-size:cover; background-position:center;">
            <div class="vip-detail-cover" style="background-image:url('${cover}');"></div>
        </section>
        <button onclick="currentVIPBuyAll()" class="vip-buy-all vip-buy-all-detail" type="button">COMPRAR TODO ${renderPrice(price, 'gems')}</button>
        <section class="vip-item-grid">
            ${items.map(item => renderVIPMiniItem(item)).join('')}
        </section>
    `;
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

    if (item.type === 'vipPanel') return renderVIPPanelItem(item, owned);
    if (item.type === 'customTextTrail') return renderCustomTextTrailItem(item, owned);
    if (item.type === 'elementTrail') return renderElementTrailItem(item, owned);
    if (item.type === 'bundle') return renderVIPBundleItem(item, owned);
    if (item.type === 'emojiPack') return renderEmojiPackItem(item, owned);
    if (item.type === 'emoji') return renderEmojiItem(item, owned);
    if (item.type === 'vipTrailPng') return renderVIPPngTrailItem(item, owned);

    const isTrail = item.type === 'trail' && item.trailId;
    const canvasId = `vip-trail-canvas-${item.trailId}`;

    if (isTrail) {
        return `
        <article class="vip-mini-item ${owned ? 'owned' : ''}" style="display:flex;flex-direction:column;align-items:center;gap:10px;">
            <canvas id="${canvasId}" width="220" height="90" style="border-radius:10px;background:rgba(0,0,0,0.4);display:block;"></canvas>
            <div style="display:flex;gap:8px;flex-wrap:wrap;justify-content:center;" id="vip-colors-${item.trailId}">
                ${TRAIL_COLOR_LIST.map(c => {
            const colorOwned = localStorage.getItem(`trail_${item.trailId}_${c.id}`) === 'true';
            return `<div onclick="selectVIPTrailColor('${item.trailId}','${c.id}',${item.price})"
                        style="width:22px;height:22px;border-radius:50%;background:${c.color};
                        border:2px solid ${colorOwned ? '#00ff88' : 'rgba(255,255,255,0.2)'};
                        cursor:pointer;position:relative;"
                        title="${c.id}">
                        ${colorOwned ? `<div style="position:absolute;top:-4px;right:-4px;width:10px;height:10px;border-radius:50%;background:#00ff88;font-size:6px;display:flex;align-items:center;justify-content:center;">✔</div>` : ''}
                    </div>`;
        }).join('')}
            </div>
            <div class="vip-mini-type">TRAIL</div>
            <h3>${item.name}</h3>
            <div id="vip-trail-action-${item.trailId}" style="width:100%;">
                <button onclick="buyVIPTrailFull('${item.trailId}','${item.name}',${item.price})" type="button" style="width:100%;">
                    ${owned ? 'OBTENIDO' : `COMPRAR COMPLETO ${renderPrice(item.price, 'gems')}`}
                </button>
            </div>
        </article>`;
    }

    return `
        <article class="vip-mini-item ${owned ? 'owned' : ''}">
            <div class="vip-mini-image">
                <img src="${item.image}" alt="" draggable="false">
                <span>PNG</span>
            </div>
            <div class="vip-mini-type">${(item.type === 'vipSkin' ? 'SKIN' : item.type).toUpperCase()}</div>
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
                <span>PNG</span>
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
                    <span>PNG</span>
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
                    <span>PNG</span>
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
            ${isTrailPreview ? `<canvas id="vip-trail-canvas-${item.trailId}" width="220" height="90" class="vip-trail-preview"></canvas>` : `<div class="${isSkinItem ? 'vip-skin-orb' : 'vip-mini-image'}">
                <img src="${item.image}" alt="" draggable="false">
                <span>PNG</span>
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
                <span>PNG</span>
            </div>
            <div class="vip-mini-type">PANEL 2</div>
            <h3>${item.name}</h3>
            <button onclick="openEmojiPackModal('${item.id || item.name}')" type="button">${owned ? 'VER EMOJIS' : `VER ${renderPrice(item.price, 'gems')}`}</button>
        </article>
    `;
}

function renderEmojiItem(item, owned) {
    const isSkinItem = item.type === 'vipSkin' || item.type === 'skin';
    return `
        <article class="vip-mini-item ${owned ? 'owned' : ''}">
            <div class="${isSkinItem ? 'vip-skin-orb' : 'vip-mini-image'}">
                <img src="${item.image}" alt="" draggable="false">
                <span>PNG</span>
            </div>
            <div class="vip-mini-type">EMOJI</div>
            <h3>${item.name}</h3>
            <button onclick="buyVIPMiniItemById('${item.id}')" ${owned ? 'disabled' : ''} type="button">${owned ? 'OBTENIDO' : `COMPRAR ${renderPrice(item.price, 'gems')}`}</button>
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
    } else if (item.type === 'emoji') {
        localStorage.setItem(item.id || `emoji_${item.name.toLowerCase().replaceAll(' ', '_')}`, 'true');
    } else if (item.type === 'emojiPack') {
        (item.items || []).forEach(part => localStorage.setItem(part.id, 'true'));
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
    panel.classList.remove('entering');
    void panel.offsetWidth;
    panel.classList.add('entering');
    showInventorySection('skins');
}

function closeInventory() {
    const panel = document.getElementById('inventoryPanel');
    panel.classList.add('leaving');
    setTimeout(() => {
        panel.style.display = 'none';
        panel.classList.remove('leaving');
    }, 300);
}

function showInventorySection(section) {
    ['skins', 'trails', 'banners', 'emotes', 'cofres'].forEach(s => {
        const el = document.getElementById('inv-nav-' + s);
        if (!el) return;
        if (s === section) {
            el.style.background = 'rgba(0,255,231,0.1)';
            el.style.border = '1px solid rgba(0,255,231,0.2)';
            el.style.color = '#00ffe7';
        } else {
            el.style.background = 'none';
            el.style.border = '1px solid transparent';
            el.style.color = 'rgba(255,255,255,0.5)';
        }
    });

    const content = document.getElementById('inventoryContent');

    if (section === 'skins') {
        const equipped = localStorage.getItem('equippedBanner') || 'Banner_Deafult';
        const owned = SKINS_DATA.filter(s => s.owned && !s.soon);
        content.innerHTML = `
            <div style="color:rgba(255,255,255,0.4); font-family:monospace; font-size:11px; letter-spacing:4px; margin-bottom:20px;">SKINS OBTENIDAS — ${owned.length}</div>
            <div style="display:grid; grid-template-columns:repeat(5,1fr); gap:14px;">
                ${owned.map(s => renderSkinCard(s, equipped)).join('')}
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

        const groups = Object.values(ownedByEffect);

        if (groups.length === 0) {
            content.innerHTML = `<div style="display:flex;align-items:center;justify-content:center;height:300px;color:rgba(255,255,255,0.2);font-family:monospace;font-size:14px;letter-spacing:4px;">NO TIENES TRAILS AÚN</div>`;
            return;
        }

        content.innerHTML = `
            <div style="color:rgba(255,255,255,0.4);font-family:monospace;font-size:11px;letter-spacing:4px;margin-bottom:20px;">TRAILS — ${groups.length} EFECTOS</div>
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:16px;">
                ${groups.map(({ trail: t, colors }) => {
            const allOwned = TRAIL_COLOR_LIST.every(c => localStorage.getItem(`trail_${t.id}_${c.id}`) === 'true');
            const equippedColor = colors.find(c => equippedTrail === `${t.id}_${c.id}`);
            const displayColor = equippedColor || colors[0];
            return `
                    <div style="position:relative;">
                        <div id="inv-trail-card-${t.id}"
                            onclick="toggleInvTrailExpand('${t.id}')"
                            style="background:rgba(255,255,255,0.03);border:1px solid ${equippedColor ? t.rarityColor + '66' : 'rgba(255,255,255,0.1)'};border-radius:14px;padding:14px;cursor:pointer;transition:0.2s;${equippedColor ? 'box-shadow:0 0 16px ' + t.rarityColor + '22;' : ''}">
                            <canvas id="inv-trail-canvas-${t.id}" width="200" height="60" style="border-radius:8px;background:rgba(0,0,0,0.35);display:block;width:100%;"></canvas>
                            <div style="display:flex;justify-content:space-between;align-items:center;margin-top:10px;">
                                <div>
                                    <div style="color:white;font-family:monospace;font-size:12px;letter-spacing:1px;">${t.name}</div>
                                    <div style="color:${t.rarityColor};font-family:monospace;font-size:9px;letter-spacing:2px;">${t.rarity}</div>
                                </div>
                                <div style="display:flex;align-items:center;gap:6px;">
                                    ${allOwned ? `<div style="color:#00ff88;font-family:monospace;font-size:9px;">★ COMPLETO</div>` : `<div style="color:rgba(255,255,255,0.3);font-family:monospace;font-size:9px;">${colors.length}/${TRAIL_COLOR_LIST.length}</div>`}
                                    <div style="color:rgba(255,255,255,0.4);font-size:10px;transition:0.2s;" id="inv-trail-arrow-${t.id}">▼</div>
                                </div>
                            </div>
                            ${equippedColor ? `<div style="margin-top:8px;font-family:monospace;font-size:9px;color:#ffd700;">✔ EQUIPADO · ${equippedColor.id.toUpperCase()}</div>` : ''}
                        </div>
                        <div id="inv-trail-expand-${t.id}" style="display:none;background:rgba(0,0,0,0.3);border:1px solid rgba(255,255,255,0.08);border-top:none;border-radius:0 0 14px 14px;padding:12px 14px;">
                            <div style="display:flex;gap:8px;flex-wrap:wrap;justify-content:center;">
                                ${TRAIL_COLOR_LIST.map(c => {
                const has = localStorage.getItem(`trail_${t.id}_${c.id}`) === 'true';
                const isEq = equippedTrail === `${t.id}_${c.id}`;
                return `<div onclick="${has ? `invEquipTrailColor('${t.id}','${c.id}')` : ''}"
                                        style="width:28px;height:28px;border-radius:50%;background:${c.color};
                                        border:2px solid ${isEq ? '#ffd700' : has ? '#00ff88' : 'rgba(255,255,255,0.1)'};
                                        cursor:${has ? 'pointer' : 'default'};opacity:${has ? '1' : '0.25'};
                                        position:relative;transition:0.15s;"
                                        title="${c.id}${isEq ? ' (equipado)' : !has ? ' (no tienes)' : ''}">
                                        ${isEq ? `<div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);color:#000;font-size:9px;font-weight:bold;">✔</div>` : ''}
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
        const equipped = localStorage.getItem('equippedBanner') || 'static_core';
        const owned = BANNERS_DATA.filter(b =>
            b.id === 'Banner_Deafult' ||
            localStorage.getItem('banner_' + b.id) === 'true' ||
            b.owned === true
        );
        content.innerHTML = `
            ${renderInventoryProfileBanner(equipped)}
            <div style="color:rgba(255,255,255,0.4); font-family:monospace; font-size:11px; letter-spacing:4px; margin-bottom:20px;">BANNERS OBTENIDOS - ${owned.length}</div>
            <div style="display:grid; grid-template-columns:repeat(auto-fit,minmax(240px,1fr)); gap:14px;">
                ${owned.map(b => renderBannerCard(b, equipped)).join('')}
            </div>
        `;
    } else if (section === 'emotes') {
        const owned = EMOTES_DATA.filter(e => localStorage.getItem('emote_' + e.id) === 'true' || !e.vip);
        content.innerHTML = `
            <div style="color:rgba(255,255,255,0.4); font-family:monospace; font-size:11px; letter-spacing:4px; margin-bottom:20px;">EMOTES - ${owned.length}</div>
            <div class="inventory-emote-grid">
                ${owned.map(renderEmoteSlot).join('')}
            </div>
        `;
    } else if (section === 'cofres') {
        const stored = CHESTS_DATA.filter(c => !c.upgradeable).map(chest => ({
            ...chest,
            count: parseInt(localStorage.getItem('invChest_' + chest.id) || '0')
        })).filter(chest => chest.count > 0);
        content.innerHTML = stored.length ? `
            <div style="color:rgba(255,255,255,0.4); font-family:monospace; font-size:11px; letter-spacing:4px; margin-bottom:20px;">COFRES GUARDADOS</div>
            <div style="display:grid; grid-template-columns:repeat(auto-fit,minmax(210px,1fr)); gap:14px;">
                ${stored.map(chest => `
                    <div style="background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.09); border-radius:14px; padding:16px; display:grid; gap:10px;">
                        <img src="${chest.image}" style="width:100%;height:130px;object-fit:contain;">
                        <div style="color:white;font-family:monospace;font-size:13px;letter-spacing:2px;">${chest.name} x${chest.count}</div>
                        <button onclick="openInventoryChest('${chest.id}')" style="height:36px;border-radius:8px;border:1px solid rgba(255,238,0,.4);background:rgba(255,238,0,.08);color:#ffee00;font-family:monospace;cursor:pointer;">ABRIR</button>
                    </div>
                `).join('')}
            </div>
        ` : `<div style="display:grid;place-items:center;height:300px;color:rgba(255,255,255,.25);font-family:monospace;letter-spacing:4px;">NO TIENES COFRES GUARDADOS</div>`;
    }
}

function renderInventoryProfileBanner(equipped) {
    const name = localStorage.getItem('playerName') || 'Jugador';
    const avatar = localStorage.getItem('playerAvatar') || 'assets/Imagenes/Avatares/Avatar_Default.png';
    const banner = BANNERS_DATA.find(b => b.id === equipped) || BANNERS_DATA[0];
    const bg = banner.cover
        ? `linear-gradient(90deg, rgba(5,6,12,0.86), rgba(5,6,12,0.36)), url('${banner.cover}')`
        : 'linear-gradient(135deg, rgba(0,255,231,0.18), rgba(255,77,109,0.16))';
    return `
        <section class="inventory-profile-banner" style="background-image:${bg};">
            <div class="inventory-profile-avatar" style="background-image:url('${avatar}')"></div>
            <div>
                <div class="inventory-profile-kicker">BANNER EQUIPADO</div>
                <div class="inventory-profile-name">${name}</div>
                <div class="inventory-profile-banner-name">${banner.name || 'Banner'}</div>
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
    const summary = { coins: 0, gems: 0, drops: {} };
    for (let i = 0; i < total; i++) {
        const result = openChestReward(chest);
        summary.coins += result.coins;
        summary.gems += result.gems;
        summary.drops[result.drop] = (summary.drops[result.drop] || 0) + 1;
    }
    window.playSfx?.('reward');
    showInventorySection('cofres');
    showShopModal({
        kicker: `${total} COFRE${total > 1 ? 'S' : ''} ABIERTO${total > 1 ? 'S' : ''}`,
        title: chest.name,
        image: chest.openImage || chest.image,
        body: `
            <div class="chest-open-result">
                <div>Base: ${summary.coins} monedas + ${summary.gems} rubies</div>
                <div>${Object.entries(summary.drops).map(([drop, qty]) => `${drop} x${qty}`).join('<br>')}</div>
            </div>
        `,
        cancelText: null,
        confirmText: 'CERRAR'
    });
}
window.openInventoryChestAmount = openInventoryChestAmount;

// =====================================================
// TRAILS DATA
// =====================================================

const TRAILS_DATA = [
    { id: 'basic', name: 'Basica', rarity: 'BASICA', rarityColor: '#57b7dd', price: 30, priceType: 'coins' },
    { id: 'ghost', name: 'Ghost', rarity: 'EPICA', rarityColor: '#cc44ff', price: 800, priceType: 'coins' },
    { id: 'fractura', name: 'Fractura', rarity: 'EPICA', rarityColor: '#cc44ff', price: 1000, priceType: 'coins' },
    { id: 'hielo', name: 'Hielo', rarity: 'ESPECIAL', rarityColor: '#7fd8ff', price: 260, priceType: 'coins' },
    { id: 'toxico', name: 'Toxico', rarity: 'ESPECIAL', rarityColor: '#8dff5a', price: 320, priceType: 'coins' },
    { id: 'trail_vampiro', name: 'Vampiro', rarity: 'VIP', rarityColor: '#ff4d6d', price: 0, priceType: 'gems' },
    { id: 'trail_zombie', name: 'Zombie', rarity: 'VIP', rarityColor: '#78ff8f', price: 0, priceType: 'gems' },
    { id: 'trail_fire', name: 'Elemento Fuego', rarity: 'VIP', rarityColor: '#ff8a00', price: 0, priceType: 'gems' },
    { id: 'trail_water', name: 'Elemento Agua', rarity: 'VIP', rarityColor: '#4488ff', price: 0, priceType: 'gems' },
    { id: 'trail_wind', name: 'Elemento Viento', rarity: 'VIP', rarityColor: '#00ffe7', price: 0, priceType: 'gems' },
    { id: 'trail_ice', name: 'Elemento Hielo', rarity: 'VIP', rarityColor: '#7fd8ff', price: 0, priceType: 'gems' },
    { id: 'trail_lava', name: 'Elemento Lava', rarity: 'VIP', rarityColor: '#ff4444', price: 0, priceType: 'gems' },
    { id: 'trail_nature', name: 'Elemento Naturaleza', rarity: 'VIP', rarityColor: '#44ff88', price: 0, priceType: 'gems' },
    { id: 'trail_custom_text', name: 'Texto Personalizado', rarity: 'VIP', rarityColor: '#ffda3a', price: 0, priceType: 'gems' },
];

// ── Sin el color RGB ──────────────────────────────────
const TRAIL_COLOR_LIST = [
    { id: 'cyan', color: '#00ffe7', rgb: '0,255,231' },
    { id: 'red', color: '#ff4444', rgb: '255,68,68' },
    { id: 'blue', color: '#4488ff', rgb: '68,136,255' },
    { id: 'yellow', color: '#ffee00', rgb: '255,238,0' },
    { id: 'orange', color: '#ff8800', rgb: '255,136,0' },
    { id: 'green', color: '#44ff88', rgb: '68,255,136' },
    { id: 'purple', color: '#cc44ff', rgb: '204,68,255' },
    { id: 'rgb', color: 'linear-gradient(135deg,#ff4444,#ffee00,#44ff88,#4488ff,#cc44ff)', rgb: null, premium: true, price: 250, priceType: 'gems' },
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

function renderTrailsPage(container) {
    container.innerHTML = `
        <div style="display:flex; align-items:center; gap:16px; margin-bottom:24px;">
            <button onclick="showShopSection('home')" style="padding:8px 16px; background:none; border:1px solid rgba(255,255,255,0.12); border-radius:8px; color:rgba(255,255,255,0.5); font-family:monospace; font-size:11px; letter-spacing:2px; cursor:pointer;">← VOLVER</button>
            <div style="color:rgba(255,255,255,0.4); font-family:monospace; font-size:11px; letter-spacing:4px;">TRAILS</div>
        </div>
        <div style="display:grid; grid-template-columns:repeat(5,1fr); gap:14px;">
            ${TRAILS_DATA.map(t => renderTrailCard(t)).join('')}
        </div>

        <div id="trail-color-panel" style="display:none; margin-top:24px; background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.1); border-radius:14px; padding:20px;">
            <div style="color:rgba(255,255,255,0.4); font-family:monospace; font-size:11px; letter-spacing:3px; margin-bottom:16px;">ELIGE UN COLOR</div>
            <div style="display:flex; gap:12px; flex-wrap:wrap;" id="trail-color-dots"></div>
        </div>

        <div id="trail-preview-panel" style="display:none; margin-top:20px;">
        </div>
    `;
    if (trailAnimId) cancelAnimationFrame(trailAnimId);
    setTimeout(() => animateTrailCards(), 50);
}

function renderTrailCard(t) {
    const isOwned = isTrailOwned(t.id);
    const priceIcon = t.priceType === 'gems'
        ? `<img src="assets/Imagenes/Monetizacion/Rubies.png" style="width:14px;height:14px;object-fit:contain;">`
        : `<img src="assets/Imagenes/Monetizacion/DEAD_COIN.png" style="width:14px;height:14px;object-fit:contain;">`;

    return `
    <div style="background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.08); border-radius:14px; padding:20px 12px; display:flex; flex-direction:column; align-items:center; gap:10px; cursor:pointer; transition:0.2s;"
        onmouseover="this.style.borderColor='rgba(255,255,255,0.25)'"
        onmouseout="this.style.borderColor='rgba(255,255,255,0.08)'"
        onclick="selectTrailEffect('${t.id}')">
        <canvas class="trail-card-canvas" id="trail-card-${t.id}" width="80" height="80" style="border-radius:50%; background:rgba(0,0,0,0.3);"></canvas>
        <div style="color:white; font-family:monospace; font-size:12px; letter-spacing:1px;">${t.name}</div>
        <div style="color:${t.rarityColor}; font-family:monospace; font-size:9px; letter-spacing:2px;">${t.rarity}</div>
        ${t.id === 'trail_custom_text'
            ? `<div style="color:#ffda3a; font-family:monospace; font-size:9px; letter-spacing:1px;">SOLO VIP</div>`
            : isOwned
            ? `<div style="color:#00ff88; font-family:monospace; font-size:9px;">✔ TIENES COLORES</div>`
            : `<div style="display:flex;align-items:center;gap:4px;">${priceIcon}<span style="color:rgba(255,255,255,0.3);font-family:monospace;font-size:9px;">${t.price}</span></div>`
        }
    </div>`;
}

function animateTrailCards(timestamp = 0) {
    if (document.getElementById('shopPanel')?.style.display === 'none') {
        trailAnimId = null;
        return;
    }
    if (document.hidden) {
        trailAnimId = requestAnimationFrame(animateTrailCards);
        return;
    }
    if (timestamp && animateTrailCards.lastFrame && timestamp - animateTrailCards.lastFrame < 50) {
        trailAnimId = requestAnimationFrame(animateTrailCards);
        return;
    }
    animateTrailCards.lastFrame = timestamp || performance.now();
    TRAILS_DATA.forEach(t => {
        const cvs = document.getElementById('trail-card-' + t.id);
        if (!cvs) return;
        const ctx = cvs.getContext('2d');
        ctx.clearRect(0, 0, 80, 80);

        const cx = 40, cy = 40;
        const time = animateTrailCards.lastFrame * 0.001;

        if (t.id === 'basic') {
            for (let i = 8; i >= 0; i--) {
                const alpha = (i / 8) * 0.35;
                const size = 10 - i * 0.8;
                ctx.beginPath();
                ctx.arc(cx - i * 5, cy, size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(0,255,231,${alpha})`;
                ctx.fill();
            }
            ctx.shadowBlur = 0;
            ctx.shadowColor = '#00ffe7';
            ctx.beginPath();
            ctx.arc(cx, cy, 10, 0, Math.PI * 2);
            ctx.fillStyle = '#00ffe7';
            ctx.fill();
            ctx.shadowBlur = 0;
        }

        else if (t.id === 'fire') {
            for (let i = 0; i < 8; i++) {
                const fy = cy + 14 - i * 5;
                const fw = 10 - i * 0.8;
                const alpha = (1 - i / 8) * 0.7;
                const green = Math.floor(40 + (i / 8) * 160);
                ctx.beginPath();
                ctx.ellipse(cx + Math.sin(time * 4 + i) * 3, fy, fw, fw * 1.4, 0, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255,${green},0,${alpha})`;
                ctx.fill();
            }
            ctx.shadowBlur = 0;
            ctx.shadowColor = '#ff4400';
            ctx.beginPath();
            ctx.ellipse(cx, cy + 8, 7, 9, 0, 0, Math.PI * 2);
            ctx.fillStyle = '#ffdd00';
            ctx.fill();
            ctx.shadowBlur = 0;
            for (let i = 0; i < 4; i++) {
                if (Math.random() < 0.5) {
                    const sx = cx + (Math.random() - 0.5) * 20;
                    const sy = cy - 10 - Math.random() * 20;
                    ctx.beginPath();
                    ctx.arc(sx, sy, Math.random() * 1.5, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(255,200,50,${Math.random() * 0.9})`;
                    ctx.fill();
                }
            }
        }

        else if (t.id === 'ghost') {
            for (let i = 0; i < 5; i++) {
                const ox = Math.sin(time * 0.8 + i * 1.2) * 12;
                const oy = Math.cos(time * 0.6 + i * 0.9) * 8;
                const r = 10 + i * 3;
                const alpha = 0.06 + (Math.sin(time + i) * 0.5 + 0.5) * 0.08;
                ctx.beginPath();
                ctx.arc(cx + ox, cy + oy, r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(200,210,255,${alpha})`;
                ctx.fill();
            }
            for (let i = 0; i < 4; i++) {
                const bx = cx + Math.cos(time * 1.2 + i * 1.57) * 20;
                const by = cy + Math.sin(time + i * 1.57) * 14;
                ctx.beginPath();
                ctx.arc(bx, by, 4 + Math.sin(time * 2 + i) * 2, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(220,230,255,${0.15 + Math.sin(time + i) * 0.08})`;
                ctx.fill();
            }
            ctx.shadowBlur = 0;
            ctx.shadowColor = 'rgba(200,210,255,0.6)';
            ctx.beginPath();
            ctx.arc(cx, cy, 8, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(230,235,255,0.45)';
            ctx.fill();
            ctx.shadowBlur = 0;
        }

        else if (t.id === 'fractura') {
            ctx.beginPath();
            ctx.arc(cx, cy, 18, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(80,140,255,0.08)';
            ctx.fill();
            for (let i = 0; i < 5; i++) {
                if (Math.random() < 0.7) {
                    const angle = (i / 5) * Math.PI * 2 + time * 3;
                    const len = 18 + Math.random() * 10;
                    ctx.beginPath();
                    ctx.moveTo(cx, cy);
                    const mid1x = cx + Math.cos(angle) * len * 0.33 + (Math.random() - 0.5) * 8;
                    const mid1y = cy + Math.sin(angle) * len * 0.33 + (Math.random() - 0.5) * 8;
                    const mid2x = cx + Math.cos(angle) * len * 0.66 + (Math.random() - 0.5) * 8;
                    const mid2y = cy + Math.sin(angle) * len * 0.66 + (Math.random() - 0.5) * 8;
                    const ex = cx + Math.cos(angle) * len;
                    const ey = cy + Math.sin(angle) * len;
                    ctx.lineTo(mid1x, mid1y);
                    ctx.lineTo(mid2x, mid2y);
                    ctx.lineTo(ex, ey);
                    ctx.strokeStyle = `rgba(120,180,255,${0.5 + Math.random() * 0.5})`;
                    ctx.lineWidth = 1 + Math.random();
                    ctx.stroke();
                    ctx.beginPath();
                    ctx.arc(ex, ey, 2, 0, Math.PI * 2);
                    ctx.fillStyle = 'rgba(200,230,255,0.9)';
                    ctx.fill();
                }
            }
            ctx.shadowBlur = 0;
            ctx.shadowColor = '#4488ff';
            ctx.beginPath();
            ctx.arc(cx, cy, 8, 0, Math.PI * 2);
            ctx.fillStyle = '#aaccff';
            ctx.fill();
            ctx.shadowBlur = 0;
        }

        else if (t.id === 'rayo') {
            ctx.save();
            ctx.globalCompositeOperation = 'lighter';
            ctx.shadowBlur = 0;
            ctx.shadowColor = '#9fd2ff';
            for (let i = 0; i < 4; i++) {
                const y = cy - 16 + i * 10;
                ctx.beginPath();
                ctx.moveTo(cx + 22, y);
                ctx.lineTo(cx + 10, y + 6);
                ctx.lineTo(cx - 2, y + 1);
                ctx.lineTo(cx - 15, y + 8);
                ctx.lineTo(cx - 26, y + 4);
                ctx.strokeStyle = `rgba(150,210,255,${0.82 - i * 0.12})`;
                ctx.lineWidth = Math.max(1, 3 - i * 0.35);
                ctx.stroke();
                ctx.strokeStyle = `rgba(245,250,255,${0.75 - i * 0.1})`;
                ctx.lineWidth = 1;
                ctx.stroke();
            }
            ctx.restore();
            ctx.shadowBlur = 0;
            ctx.shadowColor = '#4488ff';
            ctx.beginPath();
            ctx.arc(cx, cy, 8, 0, Math.PI * 2);
            ctx.fillStyle = '#aaccff';
            ctx.fill();
            ctx.shadowBlur = 0;
        }

        else if (t.id === 'hielo') {
            ctx.save();
            ctx.globalCompositeOperation = 'screen';
            for (let i = 0; i < 6; i++) {
                const a = time * 1.5 + i;
                ctx.beginPath();
                ctx.moveTo(cx + Math.cos(a) * 8, cy + Math.sin(a) * 8);
                ctx.lineTo(cx + Math.cos(a) * 26, cy + Math.sin(a) * 26);
                ctx.strokeStyle = `rgba(160,225,255,${0.65 - i * 0.06})`;
                ctx.lineWidth = 1.4;
                ctx.stroke();
            }
            ctx.beginPath();
            ctx.arc(cx, cy, 9, 0, Math.PI * 2);
            ctx.fillStyle = '#c8f3ff';
            ctx.fill();
            ctx.restore();
        }

        else if (t.id === 'toxico') {
            ctx.save();
            ctx.globalCompositeOperation = 'lighter';
            for (let i = 0; i < 7; i++) {
                const ox = Math.sin(time * 2 + i) * 18;
                const oy = Math.cos(time * 1.7 + i) * 12;
                ctx.beginPath();
                ctx.arc(cx + ox, cy + oy, 4 + Math.sin(time + i) * 2, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(141,255,90,${0.18 + i * 0.035})`;
                ctx.fill();
            }
            ctx.beginPath();
            ctx.arc(cx, cy, 8, 0, Math.PI * 2);
            ctx.fillStyle = '#8dff5a';
            ctx.fill();
            ctx.restore();
        }

        else if (t.id === 'rainbow') {
            const hue = (animateTrailCards.lastFrame * 0.1) % 360;
            for (let i = 3; i >= 0; i--) {
                ctx.beginPath();
                ctx.arc(cx, cy, 10 + i * 6, 0, Math.PI * 2);
                ctx.strokeStyle = `hsla(${(hue + i * 40) % 360},100%,60%,${0.3 - i * 0.06})`;
                ctx.lineWidth = 3;
                ctx.stroke();
            }
            ctx.shadowBlur = 0;
            ctx.shadowColor = `hsl(${hue},100%,60%)`;
            ctx.beginPath();
            ctx.arc(cx, cy, 9, 0, Math.PI * 2);
            ctx.fillStyle = `hsl(${hue},100%,65%)`;
            ctx.fill();
            ctx.shadowBlur = 0;
            for (let i = 0; i < 4; i++) {
                const px = cx + Math.cos(time * 2 + i * 1.57) * 22;
                const py = cy + Math.sin(time * 2 + i * 1.57) * 22;
                ctx.beginPath();
                ctx.arc(px, py, 2.5, 0, Math.PI * 2);
                ctx.fillStyle = `hsla(${(hue + i * 90) % 360},100%,70%,0.9)`;
                ctx.fill();
            }
        }
    });

    if (document.getElementById('trail-card-basic') && document.getElementById('shopPanel')?.style.display !== 'none') {
        trailAnimId = requestAnimationFrame(animateTrailCards);
    }
}

function isTrailOwned(effectId) {
    return TRAIL_COLOR_LIST.some(c =>
        localStorage.getItem(`trail_${effectId}_${c.id}`) === 'true'
    );
}

function selectTrailEffect(effectId) {
    window.playSfx?.('selectTrail', 0.7);
    selectedTrailEffect = effectId;
    selectedTrailColor = null;

    const panel = document.getElementById('trail-color-panel');
    const dots = document.getElementById('trail-color-dots');
    panel.style.display = 'block';

    dots.innerHTML = TRAIL_COLOR_LIST.map(c => {
        const owned = localStorage.getItem(`trail_${effectId}_${c.id}`) === 'true';
        const equipped = localStorage.getItem('equippedTrail') === `${effectId}_${c.id}`;

        return `
        <div onclick="selectTrailColor('${c.id}')"
            style="position:relative; width:36px; height:36px; border-radius:50%; background:${getTrailColorStyle(c)};
            border:2px solid ${equipped ? '#ffd700' : owned ? '#00ff88' : 'rgba(255,255,255,0.2)'};
            cursor:pointer; box-shadow:0 0 8px ${getTrailSolidColor(c)}66;
            transition:0.15s;"
            onmouseover="this.style.transform='scale(1.2)'"
            onmouseout="this.style.transform='scale(1)'">
            ${owned ? `<div style="position:absolute; top:-4px; right:-4px; width:12px; height:12px; border-radius:50%; background:#00ff88; border:1px solid #000; font-size:7px; display:flex; align-items:center; justify-content:center;">✔</div>` : ''}
            ${!owned && c.premium ? `<div style="position:absolute; bottom:-7px; left:50%; transform:translateX(-50%); color:#ff4dff; font-family:monospace; font-size:8px; font-weight:bold;">RGB</div>` : ''}
        </div>`;
    }).join('');

    document.getElementById('trail-preview-panel').style.display = 'none';
}

function selectTrailColor(colorId) {
    window.playSfx?.('colorSelect', 0.7);
    selectedTrailColor = colorId;
    showTrailPreview();
}

let previewTrailAnim = null;

function showTrailPreview() {
    const previewContainer = document.getElementById('trail-preview-panel');

    const trail = TRAILS_DATA.find(t => t.id === selectedTrailEffect);
    const color = TRAIL_COLOR_LIST.find(c => c.id === selectedTrailColor);
    if (trail?.id === 'trail_custom_text') {
        previewContainer.style.display = 'block';
        previewContainer.innerHTML = `
            <div class="normal-custom-trail-preview">
                <div>
                    <div class="vip-mini-type">TRAIL PERSONALIZABLE</div>
                    <h3>Texto Personalizado</h3>
                    <canvas id="normal-custom-text-trail-canvas" width="340" height="96" class="vip-custom-trail-preview"></canvas>
                    <p>Disponible solo desde Tienda VIP.</p>
                </div>
                <button onclick="openVIP()" type="button">IR A VIP</button>
            </div>
        `;
        setTimeout(() => startCustomTextTrailPreview('normal-custom-text-trail-canvas', 'customTrailPhrase'), 20);
        return;
    }
    const owned = localStorage.getItem(`trail_${selectedTrailEffect}_${selectedTrailColor}`) === 'true';
    const equipped = localStorage.getItem('equippedTrail') === `${selectedTrailEffect}_${selectedTrailColor}`;
    const purchase = getTrailPurchaseInfo(trail, color);
    const priceIcon = purchase.currency === 'gems'
        ? 'assets/Imagenes/Monetizacion/Rubies.png'
        : 'assets/Imagenes/Monetizacion/DEAD_COIN.png';

    // Precio con imagen según tipo
    let priceHTML = '';
    if (owned) {
        priceHTML = equipped
            ? `<span style="color:#ffd700; font-family:monospace; font-size:13px; letter-spacing:2px;">✔ EQUIPADO</span>`
            : `<span style="color:#00ff88; font-family:monospace; font-size:13px; letter-spacing:2px;">✔ YA LO TIENES</span>`;
    } else {
        priceHTML = `
            <div style="display:flex; align-items:center; gap:6px;">
                <img src="${priceIcon}" style="width:22px;height:22px;object-fit:contain;">
                <span style="color:white; font-family:monospace; font-size:18px; font-weight:bold;">${purchase.amount}</span>
            </div>`;
    }

    previewContainer.style.display = 'block';
    previewContainer.innerHTML = `
        <div style="
            background: rgba(0,0,0,0.55);
            border: 1px solid rgba(255,255,255,0.12);
            border-radius: 16px;
            padding: 24px 28px;
            display: flex;
            align-items: center;
            gap: 28px;
        ">
            <div style="
                background: rgba(0,0,0,0.4);
                border: 1px solid rgba(255,255,255,0.08);
                border-radius: 12px;
                padding: 10px;
                flex-shrink: 0;
            ">
                <canvas id="trailPreviewCanvas" width="260" height="80" style="display:block; border-radius:8px;"></canvas>
            </div>

            <div style="display:flex; flex-direction:column; gap:10px; flex:1;">
                <div style="color:rgba(255,255,255,0.35); font-family:monospace; font-size:10px; letter-spacing:4px;">PREVIEW</div>
                <div style="color:white; font-family:monospace; font-size:16px; font-weight:bold; letter-spacing:2px;">${trail.name} · <span style="color:${getTrailSolidColor(color)};">${selectedTrailColor.toUpperCase()}</span></div>
                <div style="color:${trail.rarityColor}; font-family:monospace; font-size:10px; letter-spacing:3px;">${trail.rarity}</div>

                <div style="margin-top:4px;">
                    ${priceHTML}
                </div>

                <div style="display:flex; gap:10px; margin-top:4px;">
                    <button onclick="confirmBuyTrail()" id="trail-buy-btn" style="
                        padding:10px 28px;
                        border:1px solid ${owned ? (equipped ? '#ffd700' : '#00ff88') : '#ffee00'};
                        background:rgba(255,238,0,0.08);
                        color:${owned ? (equipped ? '#ffd700' : '#00ff88') : '#ffee00'};
                        font-family:monospace; font-size:12px; letter-spacing:2px;
                        border-radius:8px; cursor:pointer;">
                        ${owned ? (equipped ? '✔ EQUIPADO' : 'EQUIPAR') : 'COMPRAR'}
                    </button>
                    <button onclick="cancelTrailPreview()" style="
                        padding:10px 28px;
                        border:1px solid rgba(255,255,255,0.15);
                        background:none;
                        color:rgba(255,255,255,0.35);
                        font-family:monospace; font-size:12px; letter-spacing:2px;
                        border-radius:8px; cursor:pointer;">
                        CANCELAR
                    </button>
                </div>
            </div>
        </div>
    `;

    // Animar preview canvas
    if (previewTrailAnim) cancelAnimationFrame(previewTrailAnim);
    const cvs = document.getElementById('trailPreviewCanvas');
    const pctx = cvs.getContext('2d');
    let px = 30;
    let pts = [];
    const rgb = color?.rgb || '0,255,231';

    let previewLastFrame = 0;
    function animatePreview(timestamp = 0) {
        if (document.getElementById('shopPanel')?.style.display === 'none' || !document.body.contains(cvs)) {
            previewTrailAnim = null;
            return;
        }
        if (timestamp && previewLastFrame && timestamp - previewLastFrame < 33) {
            previewTrailAnim = requestAnimationFrame(animatePreview);
            return;
        }
        previewLastFrame = timestamp || performance.now();
        pctx.clearRect(0, 0, 260, 80);
        px += 1.2;
        if (px > 240) px = 30;

        pts.push({ x: px, y: 40, life: 1.0 });
        if (pts.length > 50) pts.shift();
        for (let p of pts) p.life -= 0.012;

        pctx.__previewNow = previewLastFrame;
        for (let p of pts) {
            if (p.life <= 0) continue;
            drawPreviewTrailPoint(pctx, p, selectedTrailEffect, rgb, selectedTrailColor);
        }

        // Bolita con el color real elegido
        pctx.shadowBlur = 0;
        pctx.shadowColor = getTrailSolidColor(color);
        pctx.beginPath();
        pctx.arc(px, 40, 8, 0, Math.PI * 2);
        pctx.fillStyle = color?.id === 'rgb' ? `hsl(${(previewLastFrame * 0.18) % 360},100%,64%)` : getTrailSolidColor(color);
        pctx.fill();
        pctx.shadowBlur = 0;

        previewTrailAnim = requestAnimationFrame(animatePreview);
    }
    animatePreview();
}

function drawPreviewTrailPoint(pctx, p, effect, rgb, colorId) {
    effect = normalizeTrailEffectId(effect);
    const life = p.life;
    // rgb SIEMPRE viene del color elegido, nunca null para colores normales
    const rgbMode = colorId === 'rgb';
    const hue = (((pctx.__previewNow || performance.now()) * 0.18) + p.x * 0.7) % 360;
    const safeRgb = rgb || '255,80,255';
    const fill = (alpha, boost = 0) => rgbMode
        ? `hsla(${(hue + boost) % 360},100%,64%,${alpha})`
        : `rgba(${safeRgb},${alpha})`;

    if (effect === 'basic') {
        const r = 6 * life;
        const grad = pctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r * 3);
        grad.addColorStop(0, fill(life * 0.7));
        grad.addColorStop(0.4, fill(life * 0.25));
        grad.addColorStop(1, fill(0));
        pctx.beginPath();
        pctx.arc(p.x, p.y, r * 3, 0, Math.PI * 2);
        pctx.fillStyle = grad;
        pctx.fill();

    } else if (effect === 'fire') {
        for (let f = 0; f < 5; f++) {
            const fy = p.y + Math.sin(p.x * 0.12 + f) * 5 * life;
            const fw = (15 - f * 2) * life;
            pctx.beginPath();
            pctx.ellipse(p.x - f * 7 * life, fy, fw, fw * 0.42, 0, 0, Math.PI * 2);
            pctx.fillStyle = f < 2 ? `rgba(255,220,60,${life * 0.32})` : fill(life * (0.28 - f * 0.03), f * 18);
            pctx.fill();
        }

    } else if (effect === 'ghost') {
        for (let i = 0; i < 3; i++) {
            pctx.beginPath();
            pctx.arc(p.x - i * 8 * life, p.y + Math.sin(p.x * 0.06 + i) * 9 * life, (14 + i * 6) * life, 0, Math.PI * 2);
            pctx.fillStyle = fill(life * (0.06 + i * 0.025), i * 30);
            pctx.fill();
        }

    } else if (effect === 'rayo') {
        // línea principal con zigzag
        pctx.beginPath();
        pctx.moveTo(p.x, p.y);
        pctx.lineTo(p.x - 10 * life, p.y - 7 * life);
        pctx.lineTo(p.x - 18 * life, p.y + 4 * life);
        pctx.lineTo(p.x - 28 * life, p.y - 5 * life);
        pctx.lineTo(p.x - 38 * life, p.y + 8 * life);
        pctx.strokeStyle = fill(life * 0.9);
        pctx.lineWidth = Math.max(1, 2.5 * life);
        pctx.stroke();
        // brillo blanco encima
        pctx.beginPath();
        pctx.moveTo(p.x, p.y);
        pctx.lineTo(p.x - 10 * life, p.y - 7 * life);
        pctx.lineTo(p.x - 18 * life, p.y + 4 * life);
        pctx.lineTo(p.x - 28 * life, p.y - 5 * life);
        pctx.lineTo(p.x - 38 * life, p.y + 8 * life);
        pctx.strokeStyle = `rgba(240,250,255,${life * 0.55})`;
        pctx.lineWidth = Math.max(0.5, life * 0.8);
        pctx.stroke();

    } else if (effect === 'hielo') {
        pctx.beginPath();
        pctx.arc(p.x, p.y, 11 * life, 0, Math.PI * 2);
        pctx.strokeStyle = fill(life * 0.46);
        pctx.lineWidth = Math.max(1, 2 * life);
        pctx.stroke();
        for (let i = 0; i < 3; i++) {
            pctx.beginPath();
            pctx.moveTo(p.x - i * 10 * life, p.y);
            pctx.lineTo(p.x - (i * 10 + 8) * life, p.y - 7 * life);
            pctx.strokeStyle = fill(life * 0.5);
            pctx.stroke();
        }
    } else if (effect === 'toxico') {
        for (let i = 0; i < 4; i++) {
            pctx.beginPath();
            pctx.arc(p.x - i * 8 * life, p.y + Math.sin(p.x * 0.08 + i) * 8 * life, (7 + i) * life, 0, Math.PI * 2);
            pctx.fillStyle = fill(life * (0.1 + i * 0.04), i * 18);
            pctx.fill();
        }
    } else if (['water', 'wind', 'nature', 'vampiro', 'zombie', 'lava'].includes(effect)) {
        const tone = effect === 'water' ? '68,136,255' : effect === 'wind' ? '180,255,245' : effect === 'nature' ? '68,255,136' : effect === 'vampiro' ? '255,77,109' : effect === 'zombie' ? '120,255,143' : '255,86,28';
        for (let i = 0; i < 4; i++) {
            const wave = Math.sin(p.x * 0.08 + i) * 8 * life;
            pctx.beginPath();
            pctx.ellipse(p.x - i * 10 * life, p.y + wave, (16 - i * 2) * life, (5 + i) * life, 0, 0, Math.PI * 2);
            pctx.fillStyle = `rgba(${tone},${life * (0.22 - i * 0.03)})`;
            pctx.fill();
        }
    }
}

function normalizeTrailEffectId(effect) {
    if (effect === 'trail_custom_text') return 'custom_text';
    if (!String(effect || '').startsWith('trail_')) return effect;
    const id = String(effect).substring('trail_'.length);
    if (id === 'fire') return 'fire';
    if (id === 'ice') return 'hielo';
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

    showShopModal({
        kicker: 'CONFIRMAR TRAIL',
        title: `${trail.name} ${selectedTrailColor.toUpperCase()}`,
        fallback: 'TRAIL',
        body: `Seguro comprar por ${purchase.amount} ${purchase.currency === 'gems' ? 'rubies' : 'monedas'}?`,
        confirmText: 'SI',
        cancelText: 'NO',
        onConfirm: completeTrailPurchase
    });
}

function completeTrailPurchase() {
    const key = `trail_${selectedTrailEffect}_${selectedTrailColor}`;
    const trail = TRAILS_DATA.find(t => t.id === selectedTrailEffect);
    const color = TRAIL_COLOR_LIST.find(c => c.id === selectedTrailColor);
    const purchase = getTrailPurchaseInfo(trail, color);

    // Comprar
    if (purchase.currency === 'gems') {
        let gems = parseInt(localStorage.getItem('gems') || '0');
        if (gems < purchase.amount) { alert('¡No tienes suficientes gemas!'); return; }
        gems -= purchase.amount;
        localStorage.setItem('gems', gems);
        document.getElementById('shop-gems').textContent = gems;
    } else {
        let coins = parseInt(localStorage.getItem('deadCoins') || '0');
        if (coins < purchase.amount) { alert('¡No tienes suficientes Dead Coins!'); return; }
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
        currencyReward.coins = rewardData.amount || 50;
        addCurrency(currencyReward.coins, 'coins');
    }
    if (rewardData?.type === 'rubies') {
        currencyReward.gems = rewardData.amount || 3;
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
    const renderPremiumLevel = options.animateFrom?.premiumLevel ?? state.premiumLevel;
    const renderProgress = getRubyPassProgress(renderXp, renderFreeLevel);
    const freeRotation = getRubyPassRotation(renderFreeLevel);
    const premiumLevelForRender = options.premiumCatchUpFrom || state.premiumLevel;
    const premiumRotation = state.premiumOwned ? getRubyPassRotation(options.animateFrom ? renderPremiumLevel : premiumLevelForRender) : 0;
    const tipAngle = 110 + renderProgress * 170;
    const visibleRewards = RUBY_PASS_REWARDS;
    const profileName = localStorage.getItem('playerName') || 'Jugador';
    const profileAvatar = localStorage.getItem('playerAvatar') || 'assets/Imagenes/Avatares/Avatar_Default.png';
    const bannerId = localStorage.getItem('equippedBanner') || 'static_core';
    const banner = BANNERS_DATA.find(b => b.id === bannerId) || BANNERS_DATA[0];
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
                <button onclick="closeRubyPass()" class="ruby-pass-back" type="button">VOLVER</button>
            </div>

            <div class="ruby-pass-stage">
                <div class="ruby-pass-arc-window">
                    <div class="ruby-pass-gear-shell">
                        <div class="ruby-pass-lane ruby-pass-lane-premium ${state.premiumOwned ? 'is-active' : 'is-locked'}" style="--premium-rotation:${premiumRotation}deg;">
                            <div class="ruby-pass-track ruby-pass-track-premium" style="${RUBY_PASS_ASSETS.premiumTrackTexture ? `background-image:url('${RUBY_PASS_ASSETS.premiumTrackTexture}')` : ''}"></div>
                            ${state.premiumOwned ? visibleRewards.map((reward, index) => renderRubyPassNode(reward, index, state.premiumLevel, 'premium', true)).join('') : ''}
                        </div>
                        <div class="ruby-pass-lane ruby-pass-lane-free" style="--free-rotation:${freeRotation}deg;">
                            <div class="ruby-pass-track ruby-pass-track-free" style="${RUBY_PASS_ASSETS.freeTrackTexture ? `background-image:url('${RUBY_PASS_ASSETS.freeTrackTexture}')` : ''}"></div>
                            <div class="ruby-pass-liquid" style="--ruby-fill:${Math.round(renderProgress * 100)}%;"></div>
                            <div class="ruby-pass-liquid-tip" style="--ruby-tip-angle:${tipAngle}deg;"></div>
                            ${visibleRewards.map((reward, index) => renderRubyPassNode(reward, index, currentLevel, 'free', true)).join('')}
                        </div>
                        <div class="ruby-pass-current-point" data-asset-slot="RUBY_PASS_ASSET_SLOT_CURRENT_POINT">
                            ${RUBY_PASS_ASSETS.currentPoint ? `<img src="${RUBY_PASS_ASSETS.currentPoint}" alt="" draggable="false">` : '<span></span>'}
                        </div>
                    </div>
                </div>

                <div class="ruby-pass-focus">
                    <div class="ruby-pass-focus-copy">
                        <div class="ruby-pass-kicker">${state.premiumOwned ? 'VIP ACTIVO' : 'PASE FREE / VIP'}</div>
                        <h3>RUBY PASS</h3>
                        <p>${Math.round(renderProgress * 100)}% PROGRESO</p>
                        <div class="ruby-pass-xpbar"><span style="width:${Math.round(renderProgress * 100)}%;"></span></div>
                    </div>
                    ${state.premiumOwned
            ? `<button class="ruby-pass-buy is-owned" type="button">PREMIUM ACTIVO</button>`
            : `<button class="ruby-pass-buy" onclick="unlockRubyPassPremium()" type="button">RUBY PREMIUM · ${RUBY_PASS_PREMIUM_COST_GEMS} RUBIES</button>`
        }
                    <button class="ruby-pass-dev" onclick="addRubyPassXpDev()" type="button">DEV +250 XP</button>
                    <button class="ruby-pass-dev" onclick="resetRubyPassXpDev()" type="button">DEV RESET XP</button>
                </div>
            </div>
        </div>
    `;

    if (options.animateFrom) {
        animateRubyPassProgress(container, {
            progress,
            freeRotation: getRubyPassRotation(currentLevel),
            premiumRotation: state.premiumOwned ? getRubyPassRotation(state.premiumLevel) : getRubyPassRotation(currentLevel)
        });
    }
    initRubyPassDrag(container);
}

function animateRubyPassProgress(container, target) {
    requestAnimationFrame(() => {
        const fill = Math.round(target.progress * 100) + '%';
        const tipAngle = 110 + target.progress * 170;
        container.querySelector('.ruby-pass-lane-free')?.style.setProperty('--free-rotation', target.freeRotation + 'deg');
        container.querySelector('.ruby-pass-lane-premium')?.style.setProperty('--premium-rotation', target.premiumRotation + 'deg');
        container.querySelector('.ruby-pass-liquid')?.style.setProperty('--ruby-fill', fill);
        container.querySelector('.ruby-pass-liquid-tip')?.style.setProperty('--ruby-tip-angle', tipAngle + 'deg');
        const xpFill = container.querySelector('.ruby-pass-xpbar span');
        if (xpFill) xpFill.style.width = fill;
    });
}

function initRubyPassDrag(container) {
    const shell = container.querySelector('.ruby-pass-gear-shell');
    if (!shell) return;

    let dragging = false;
    let startX = 0;
    let startRot = parseFloat(shell.dataset.dragRotation || '0');
    let moved = false;

    const setDrag = value => {
        const clamped = Math.max(-180, Math.min(180, value));
        shell.dataset.dragRotation = String(clamped);
        shell.style.setProperty('--ruby-drag-rotation', clamped + 'deg');
    };

    shell.addEventListener('pointerdown', e => {
        dragging = true;
        moved = false;
        startX = e.clientX;
        startRot = parseFloat(shell.dataset.dragRotation || '0');
        shell.setPointerCapture?.(e.pointerId);
        e.preventDefault();
    });

    shell.addEventListener('pointermove', e => {
        if (!dragging) return;
        const delta = e.clientX - startX;
        if (Math.abs(delta) > 4) moved = true;
        setDrag(startRot + delta * 0.22);
    });

    const endDrag = () => { dragging = false; };
    shell.addEventListener('pointerup', endDrag);
    shell.addEventListener('pointercancel', endDrag);

    shell.addEventListener('click', e => {
        if (moved) return;

        const rewards = shell.querySelectorAll('.ruby-pass-reward');
        let closest = null, closestDist = Infinity;

        rewards.forEach(el => {
            const rect = el.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            const dist = Math.hypot(e.clientX - cx, e.clientY - cy);
            const radius = Math.max(rect.width, rect.height) * 0.9;
            if (dist < radius && dist < closestDist) {
                closestDist = dist;
                closest = el;
            }
        });

        if (!closest) return;
        const [lane, levelText] = (closest.dataset.rubyClaim || '').split('_');
        const level = parseInt(levelText || '0');
        const rewardType = closest.dataset.rewardType || 'reward';
        if (lane && level) claimRubyPassReward(lane, level, rewardType);
    });
}

function renderRubyPassNode(reward, index, currentLevel, lane, laneActive) {
    const angle = -90 + index * (360 / RUBY_PASS_REWARDS.length);
    const unlocked = laneActive && reward.level <= currentLevel;
    const rewardData = lane === 'premium' ? reward.premium : reward.free;
    const claimed = localStorage.getItem(`rubyPassClaimed_${lane}_${reward.level}`) === 'true';
    const claimable = unlocked && !claimed;
    return `
        <div class="ruby-pass-node ruby-pass-node-${lane} ruby-pass-node-${index}" style="--node-angle:${angle}deg;">
            <div class="ruby-pass-level-marker ${unlocked ? 'is-unlocked' : ''} ${claimable ? 'is-claimable' : ''} ${laneActive ? '' : 'is-locked'}" data-asset-slot="RUBY_PASS_ASSET_SLOT_LEVEL_MARKER">
                ${RUBY_PASS_ASSETS.levelMarker ? `<img src="${RUBY_PASS_ASSETS.levelMarker}" alt="">` : ''}
            </div>
            <div class="ruby-pass-level-number">${reward.level}</div>
            <div class="ruby-pass-reward ruby-pass-reward-${lane} ${unlocked ? 'is-lit' : ''} ${claimable ? 'is-claimable' : ''} ${laneActive ? '' : 'is-locked'} ${claimed ? 'is-claimed' : ''}" data-ruby-claim="${lane}_${reward.level}" data-reward-type="${rewardData.type}" title="${lane === 'premium' ? 'Premium' : 'Free'} nivel ${reward.level}">
                ${renderRewardIcon(rewardData, lane)}
            </div>
        </div>
    `;
}

function renderRewardIcon(reward, lane) {
    if (reward.image) return `<img src="${reward.image}" alt="" draggable="false">`;
    if (reward.type === 'coins') {
        return `<img class="ruby-pass-currency-img" src="${getCurrencyPileAsset('coins', reward.amount || 50)}" alt="" draggable="false">`;
    }
    if (reward.type === 'rubies') {
        return `<img class="ruby-pass-currency-img" src="${getCurrencyPileAsset('gems', reward.amount || 3)}" alt="" draggable="false">`;
    }
    const slot = reward.slot ? `${lane}_${reward.slot}` : `${lane}_${reward.type}`;
    return `<div class="ruby-pass-placeholder ruby-pass-${reward.type}" data-asset-slot="RUBY_PASS_ASSET_SLOT_${slot.toUpperCase()}"></div>`;
}

// =====================================================
// CONVERSIÓN COINS ↔ GEMS
// =====================================================

function renderConversionPage(container) {
    const coins = parseInt(localStorage.getItem('deadCoins') || '0');
    const gems = parseInt(localStorage.getItem('gems') || '0');

    container.innerHTML = `
        <div style="display:flex; align-items:center; gap:16px; margin-bottom:24px;">
            <button onclick="showShopSection('home')" style="padding:8px 16px; background:none; border:1px solid rgba(255,255,255,0.12); border-radius:8px; color:rgba(255,255,255,0.5); font-family:monospace; font-size:11px; letter-spacing:2px; cursor:pointer;">← VOLVER</button>
            <div style="color:rgba(255,255,255,0.4); font-family:monospace; font-size:11px; letter-spacing:4px;">CONVERSIÓN</div>
        </div>

        <div style="max-width:480px; margin:0 auto; display:flex; flex-direction:column; gap:20px;">

            <div style="background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.08); border-radius:14px; padding:20px; text-align:center;">
                <div style="color:rgba(255,255,255,0.4); font-family:monospace; font-size:11px; letter-spacing:3px; margin-bottom:12px;">TASA DE CAMBIO</div>
                <div style="display:flex; align-items:center; justify-content:center; gap:8px;">
                    <img src="assets/Imagenes/Monetizacion/DEAD_COIN.png" style="width:20px;height:20px;object-fit:contain;">
                    <span style="color:white; font-family:monospace; font-size:18px; letter-spacing:2px;">100 = 1 / 1 = 30</span>
                    <img src="assets/Imagenes/Monetizacion/Rubies.png" style="width:20px;height:20px;object-fit:contain;">
                </div>
            </div>

            <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
                <div style="background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.08); border-radius:12px; padding:16px; text-align:center;">
                    <div style="display:flex; align-items:center; justify-content:center; gap:6px; margin-bottom:8px;">
                        <img src="assets/Imagenes/Monetizacion/DEAD_COIN.png" style="width:16px;height:16px;object-fit:contain;">
                        <span style="color:rgba(255,255,255,0.4); font-family:monospace; font-size:10px; letter-spacing:2px;">DEAD COINS</span>
                    </div>
                    <div id="conv-coins" style="color:white; font-family:monospace; font-size:22px; font-weight:bold;">${coins}</div>
                </div>
                <div style="background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.08); border-radius:12px; padding:16px; text-align:center;">
                    <div style="display:flex; align-items:center; justify-content:center; gap:6px; margin-bottom:8px;">
                        <img src="assets/Imagenes/Monetizacion/Rubies.png" style="width:16px;height:16px;object-fit:contain;">
                        <span style="color:rgba(255,255,255,0.4); font-family:monospace; font-size:10px; letter-spacing:2px;">GEMAS</span>
                    </div>
                    <div id="conv-gems" style="color:#ffee00; font-family:monospace; font-size:22px; font-weight:bold;">${gems}</div>
                </div>
            </div>

            <div style="background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.08); border-radius:14px; padding:20px;">
                <div style="color:rgba(255,255,255,0.4); font-family:monospace; font-size:11px; letter-spacing:3px; margin-bottom:14px;">CONVERTIR COINS → GEMAS</div>
                <div style="display:flex; gap:10px; align-items:center;">
                    <input id="conv-input" type="number" min="100" step="100" placeholder="ej: 100"
                        style="flex:1; padding:10px 14px; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.15); border-radius:8px; color:white; font-family:monospace; font-size:14px; outline:none;">
                    <button onclick="convertCoins()" style="padding:10px 20px; border:1px solid #ffee00; background:rgba(255,238,0,0.1); color:#ffee00; font-family:monospace; font-size:12px; border-radius:8px; cursor:pointer; letter-spacing:2px;">CONVERTIR</button>
                </div>
                <div id="conv-result" style="color:rgba(255,255,255,0.3); font-family:monospace; font-size:11px; margin-top:10px;"></div>
            </div>

            <div style="background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.08); border-radius:14px; padding:20px;">
                <div style="color:rgba(255,255,255,0.4); font-family:monospace; font-size:11px; letter-spacing:3px; margin-bottom:14px;">CONVERTIR RUBIES A MONEDAS</div>
                <div style="display:flex; gap:10px; align-items:center;">
                    <input id="conv-gem-input" type="number" min="1" step="1" placeholder="ej: 3"
                        style="flex:1; padding:10px 14px; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.15); border-radius:8px; color:white; font-family:monospace; font-size:14px; outline:none;">
                    <button onclick="convertGems()" style="padding:10px 20px; border:1px solid #ff4d6d; background:rgba(255,77,109,0.1); color:#ff4d6d; font-family:monospace; font-size:12px; border-radius:8px; cursor:pointer; letter-spacing:2px;">CONVERTIR</button>
                </div>
                <div id="conv-gem-result" style="color:rgba(255,255,255,0.3); font-family:monospace; font-size:11px; margin-top:10px;"></div>
            </div>
        </div>
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
    localStorage.setItem(key, 'true');
    updateMenuHUD();
    renderDailyGiftPage(document.getElementById('shopContent'));
}

function convertCoins() {
    const input = parseInt(document.getElementById('conv-input').value || '0');
    const result = document.getElementById('conv-result');

    if (input < 100 || input % 100 !== 0) {
        result.textContent = 'Ingresa un multiplo de 100 (minimo 100)';
        result.style.color = '#ff4444';
        return;
    }

    let coins = parseInt(localStorage.getItem('deadCoins') || '0');
    if (coins < input) {
        result.textContent = '¡No tienes suficientes Dead Coins!';
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

    result.textContent = `✔ Convertiste ${input} coins en ${gemsGained} gemas`;
    result.style.color = '#00ff88';
}

function convertGems() {
    const input = parseInt(document.getElementById('conv-gem-input').value || '0');
    const result = document.getElementById('conv-gem-result');

    if (input < 1) {
        result.textContent = 'Ingresa al menos 1 ruby';
        result.style.color = '#ff4444';
        return;
    }

    let gems = parseInt(localStorage.getItem('gems') || '0');
    if (gems < input) {
        result.textContent = 'No tienes suficientes rubies';
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

    result.textContent = `Convertiste ${input} rubies en ${coinsGained} monedas`;
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
        if (timestamp && lastFrame && timestamp - lastFrame < 33) {
            vipTrailAnims[animKey] = requestAnimationFrame(loop);
            return;
        }
        lastFrame = timestamp || performance.now();
        ctx.clearRect(0, 0, cvs.width, cvs.height);
        px += 1.4;
        if (px > cvs.width - 20) px = 20;
        pts.push({ x: px, y: cvs.height / 2, life: 1.0 });
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

function startCustomTextTrailPreview(canvasId, inputId) {
    if (customTextTrailAnim) cancelAnimationFrame(customTextTrailAnim);
    const cvs = document.getElementById(canvasId);
    const input = document.getElementById(inputId);
    if (!cvs) return;
    const ctx = cvs.getContext('2d');
    let x = 38;
    let pts = [];
    let lastFrame = 0;

    function loop(timestamp = 0) {
        if (!document.body.contains(cvs)) { customTextTrailAnim = null; return; }
        if (timestamp && lastFrame && timestamp - lastFrame < 33) {
            customTextTrailAnim = requestAnimationFrame(loop);
            return;
        }
        lastFrame = timestamp || performance.now();
        const phrase = validateCustomTrailInput(input || { value: localStorage.getItem('customTrailText') || 'RUBY' }) || 'RUBY';
        ctx.clearRect(0, 0, cvs.width, cvs.height);
        x += 2.2;
        if (x > cvs.width - 34) x = 38;
        pts.push({ x, y: cvs.height / 2, life: 1 });
        if (pts.length > 28) pts.shift();
        pts.forEach(p => p.life -= 0.018);

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

        pts.forEach((p, i) => {
            if (p.life <= 0) return;
            const stretch = 1 + Math.min(0.55, Math.abs(window.angVel || 0) * 8);
            ctx.save();
            ctx.globalAlpha = Math.max(0, p.life * 0.55);
            ctx.translate(p.x - (1 - p.life) * 68 * stretch, p.y + Math.sin(lastFrame * 0.006 + i) * 5);
            ctx.shadowBlur = 14 * p.life;
            ctx.shadowColor = '#ffda3a';
            ctx.beginPath();
            ctx.ellipse(0, 0, 26 * p.life, 7 * p.life, 0, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255,218,58,${0.08 + p.life * 0.24})`;
            ctx.fill();
            ctx.restore();
        });

        ctx.save();
        ctx.translate(x, cvs.height / 2 + Math.sin(lastFrame * 0.006) * 4);
        ctx.font = '900 18px Geom, monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowBlur = 16;
        ctx.shadowColor = '#ffda3a';
        ctx.lineWidth = 4;
        ctx.strokeStyle = 'rgba(20,12,0,0.82)';
        ctx.fillStyle = '#fff0a8';
        ctx.strokeText(phrase, 0, 0);
        ctx.fillText(phrase, 0, 0);
        ctx.restore();

        ctx.beginPath();
        ctx.arc(x, cvs.height / 2, 7, 0, Math.PI * 2);
        ctx.fillStyle = '#ffda3a';
        ctx.fill();
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
        if (timestamp && lastFrame && timestamp - lastFrame < 33) {
            invTrailAnims[trailId] = requestAnimationFrame(loop);
            return;
        }
        lastFrame = timestamp || performance.now();
        ctx.clearRect(0, 0, cvs.width, cvs.height);
        px += 1.2;
        if (px > cvs.width - 20) px = 20;
        pts.push({ x: px, y: cvs.height / 2, life: 1.0 });
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
