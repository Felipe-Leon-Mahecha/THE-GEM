// ============================================================
//  THE GEM — prices.config.js
//  TODOS los precios de items de la tienda viven aquí.
//  Cambia un número acá y se aplica directo en el juego,
//  sin tocar shop.js.
//
//  priceType / altType pueden ser: 'coins' o 'gems'
// ============================================================

const SHOP_PRICES = {

    // --------------------------------------------------------
    //  PRECIOS GENERALES (no ligados a un item específico)
    // --------------------------------------------------------
    general: {
        emoteBasicoCoins: 150,      // precio estándar de emotes básicos
        vipItemPriceGems: 300,      // precio estándar de un item VIP individual
        vipPanelPriceGems: 620,     // precio de un panel/bundle VIP completo
    },

    // --------------------------------------------------------
    //  TRAILS — Estelas
    // --------------------------------------------------------
    trails: {
        basic:              { price: 30,   priceType: 'coins' },
        ghost:               { price: 800,  priceType: 'coins' },
        fractura:            { price: 1000, priceType: 'coins' },
        hielo:               { price: 260,  priceType: 'coins' },
        toxico:              { price: 320,  priceType: 'coins' },
        spark:               { price: 1200, priceType: 'coins' },
        trail_vampiro:       { price: 0,    priceType: 'gems' },
        trail_zombie:        { price: 0,    priceType: 'gems' },
        trail_fire:          { price: 0,    priceType: 'gems' },
        trail_water:         { price: 0,    priceType: 'gems' },
        trail_wind:          { price: 0,    priceType: 'gems' },
        trail_ice:           { price: 0,    priceType: 'gems' },
        trail_lava:          { price: 0,    priceType: 'gems' },
        trail_nature:        { price: 0,    priceType: 'gems' },
        trail_custom_text:   { price: 0,    priceType: 'gems' },
    },

    // --------------------------------------------------------
    //  SKINS
    // --------------------------------------------------------
    skins: {
        cyan:             { price: 0,    priceType: 'coins' },
        red:              { price: 50,   priceType: 'coins' },
        blue:             { price: 50,   priceType: 'coins' },
        yellow:           { price: 50,   priceType: 'coins' },
        orange:           { price: 50,   priceType: 'coins' },
        green:            { price: 50,   priceType: 'coins' },
        purple:           { price: 50,   priceType: 'coins' },
        white:            { price: 50,   priceType: 'coins' },
        black:            { price: 50,   priceType: 'coins' },

        dona_cyan:        { price: 150,  priceType: 'coins' },
        dona_red:         { price: 150,  priceType: 'coins' },
        dona_blue:        { price: 150,  priceType: 'coins' },
        dona_yellow:      { price: 150,  priceType: 'coins' },
        dona_orange:      { price: 150,  priceType: 'coins' },
        dona_green:       { price: 150,  priceType: 'coins' },
        dona_purple:      { price: 150,  priceType: 'coins' },
        dona_white:       { price: 150,  priceType: 'coins' },
        dona_black:       { price: 150,  priceType: 'coins' },

        cool:             { price: 300,  priceType: 'coins', altPrice: 10,  altType: 'gems' },
        contorno_red:     { price: 300,  priceType: 'coins' },
        contorno_purple:  { price: 300,  priceType: 'coins' },
        contorno_cyan:    { price: 300,  priceType: 'coins' },
        contorno_orange:  { price: 300,  priceType: 'coins' },
        contorno_white:   { price: 300,  priceType: 'coins' },
        contorno_black:   { price: 300,  priceType: 'coins' },

        controlador:      { price: 650,  priceType: 'coins' },
        metalman:         { price: 650,  priceType: 'coins' },
        pichos:           { price: 800,  priceType: 'coins' },

        frank:            { price: 1200, priceType: 'coins', altPrice: 40,  altType: 'gems' },
        shield:           { price: 1200, priceType: 'coins', altPrice: 40,  altType: 'gems' },
        kenji:            { price: 1500, priceType: 'coins', altPrice: 50,  altType: 'gems' },
        brifon:           { price: 1600, priceType: 'coins' },
        demon_ember:      { price: 4500, priceType: 'coins', altPrice: 150, altType: 'gems' },
        daxor:            { price: 5200, priceType: 'coins', altPrice: 170, altType: 'gems' },
    },

    // --------------------------------------------------------
    //  BANNERS
    // --------------------------------------------------------
    banners: {
        Banner_Deafult:               { price: 0 },

        Speed_Color_Green:            { price: 150 },
        Speed_Color_Gold:              { price: 150 },
        Speed_Color_Gray:              { price: 150 },
        Speed_Color_Blue:              { price: 150 },
        Speed_Color_Oranje:            { price: 150 },
        Speed_Color_Red:               { price: 150 },
        Speed_Color_Rgb:               { price: 150 },
        Speed_Color_Black:             { price: 150 },

        Speed_Color_Red_Animado:       { price: 350 },
        Abstracto_Fuego_Rojo:          { price: 300 },
        Abstracto_Lineas_Yellow:       { price: 300 },
        Abstracto_Rayos_Az_Rd:         { price: 300 },
        Abstracto_Rayos_Morados:       { price: 300 },
        Abstracto_Rayos_Rojos:         { price: 300 },
        Dark_Lineas_Blue:              { price: 300 },
        Dark_Ondas_Blue:               { price: 300 },
        Neon_Grid_Motion:              { price: 300 },
        Ondas_Blue:                    { price: 300 },

        Dark_Lineas_Or_Bck:            { price: 500 },
        Dark_Aurora_Blue:              { price: 500 },
        Dark_Ondas_PrAz:               { price: 500 },
        Speed_Color_Yellow_Animado:    { price: 500 },

        El_Dragon_Chino:               { price: 300 },
        Un_poco_de_nieve:              { price: 300 },
        Vacaciones_en_la_playa:        { price: 300 },

        Dracula_Edition:               { price: 300 },
        Jack_o_lantern:                { price: 300 },
        Zombies_Edition:               { price: 300 },
        El_Dragon_Chino_VIP:           { price: 500 },
        Un_poco_de_hielo_VIP:          { price: 500 },
        La_playa_relajante_VIP:        { price: 500 },
    },

    // --------------------------------------------------------
    //  EMOTES
    // --------------------------------------------------------
    emotes: {
        emote_normal:        { price: 150, priceType: 'coins' },
        emote_saludo:        { price: 150, priceType: 'coins' },
        emote_enojado:       { price: 150, priceType: 'coins' },
        emote_Llorando:      { price: 150, priceType: 'coins' },
        emote_sorprendido:   { price: 150, priceType: 'coins' },
        emote_mudo:          { price: 150, priceType: 'coins' },
        // emote_ruby_pass_01 no tiene precio: se obtiene por el pase, no se compra

        emoji_fachero:       { price: 200, priceType: 'gems' },
        emoji_enamorado:     { price: 200, priceType: 'gems' },
        emoji_asustado:      { price: 200, priceType: 'gems' },
        emoji_skull_pack:    { price: 200, priceType: 'gems' },
        emoji_derretido:     { price: 200, priceType: 'gems' },
        emoji_serio:         { price: 200, priceType: 'gems' },
        emoji_llorando:      { price: 200, priceType: 'gems' },
        emoji_enojado:       { price: 200, priceType: 'gems' },
        emoji_triste:        { price: 200, priceType: 'gems' },
        emoji_feliz:         { price: 200, priceType: 'gems' },
        emoji_guino:         { price: 200, priceType: 'gems' },
        emoji_sonriente:     { price: 200, priceType: 'gems' },
        emoji_bomito:        { price: 200, priceType: 'gems' },
        // emote_risa y emote_risa_malvada no tienen precio: son de fragmentos
    },

};

// ============================================================
//  APLICADOR AUTOMÁTICO
//  No toques esto — aplica los precios de arriba a cada
//  item de SKINS_DATA, TRAILS_DATA, BANNERS_DATA y EMOTES_DATA
//  buscándolos por su "id".
// ============================================================
window.SHOP_PRICES = SHOP_PRICES;

window.applyShopPrices = function (trailsData, skinsData, bannersData, emotesData) {
    const tables = [
        { data: trailsData,  prices: SHOP_PRICES.trails },
        { data: skinsData,   prices: SHOP_PRICES.skins },
        { data: bannersData, prices: SHOP_PRICES.banners },
        { data: emotesData,  prices: SHOP_PRICES.emotes },
    ];

    tables.forEach(({ data, prices }) => {
        if (!Array.isArray(data)) return;
        data.forEach(item => {
            const cfg = prices[item.id];
            if (!cfg) return; // item sin precio en el config (ej: gratis por pase/fragmentos), se deja como está
            if (cfg.price !== undefined) item.price = cfg.price;
            if (cfg.priceType !== undefined) item.priceType = cfg.priceType;
            if (cfg.altPrice !== undefined) item.altPrice = cfg.altPrice;
            if (cfg.altType !== undefined) item.altType = cfg.altType;
        });
    });
};
