// =====================================================
// SISTEMA DE TEMPORADAS
// =====================================================
// Este archivo maneja la configuración de temporadas del juego.
// Cada temporada tiene sus propios items (skins, trails, emotes, banners)
// con fechas de inicio y expiración.

// Objeto central de temporadas
const GEM_SEASONS = {
    leyendas: {
        id: 'leyendas',
        displayName: 'Temporada de Leyendas',
        startsAt: '2026-07-01',
        expiresAt: '2027-02-28',
        portadaPath: 'assets/Imagenes/Temporadas/Temp_Leyendas/Portada/portada_leyendas.png',
        lore: 'Los héroes olvidados del reino regresan. Nuevas skins, trails y recompensas exclusivas te esperan mientras dure el evento.',
        contains: {
            skins: ['skin_solmerion', 'skin_zherath', 'skin_sombra_real', 'daxor'],
            trails: ['trail_solmerion', 'trail_zherath'],
            banners: ['banner_leyendas_exclusivo', 'banner_leyendas_perla', 'banner_leyendas_rosaceo', 'banner_leyendas_campeones', 'banner_leyendas_racha_ganadora'],
            frames: ['Frame_Leyendas_Perla', 'Frame_Leyendas_Exclusivo', 'Frame_Leyendas_Rosaceo', 'Frame_Leyendas_Campeones', 'Frame_Leyendas_Racha_Ganadora', 'Frame_Leyendas_RubyPass_VIP', 'Frame_Leyendas_RubyPass_Free'],
            emotes: ['emote_solmerion_enojado', 'emote_solmerion_negacion', 'emote_solmerion_saludo', 'emote_solmerion_victoria', 'emote_zherath_aceptacion', 'emote_zherath_avergonzado', 'emote_zherath_enojado', 'emote_zherath_reto']
        }
    },
    raices: {
        id: 'raices',
        displayName: 'A las Raíces',
        startsAt: '2027-03-01',
        expiresAt: '2027-04-30',
        portadaPath: 'assets/Imagenes/Temporadas/Temp_Raices/Portada/portada_raices.png',
        lore: 'Descubre los orígenes del mundo. Cosméticos inspirados en la naturaleza y los antiguos guardianes de la tierra.',
        contains: {
            skins: [],
            trails: [],
            banners: [],
            frames: [],
            emotes: []
        }
    },
    oceanica: {
        id: 'oceanica',
        displayName: 'Temporada Oceánica',
        startsAt: '2027-05-01',
        expiresAt: '2027-06-30',
        portadaPath: 'assets/Imagenes/Temporadas/Temp_Oceanica/Portada/portada_oceanica.png',
        lore: 'Sumérgete en las profundidades. Colecciona cosméticos de las criaturas y misterios del océano infinito.',
        contains: {
            skins: [],
            trails: [],
            banners: [],
            frames: [],
            emotes: []
        }
    }
};

// Función para verificar si una temporada está activa
// seasonId: ID de la temporada (ej: 'leyendas', 'raices', 'oceanica')
// now: Fecha actual (opcional, por defecto usa la fecha actual)
// Retorna true si la temporada está activa, false en caso contrario
function isSeasonActive(seasonId, now = new Date()) {
    const season = GEM_SEASONS[seasonId];
    if (!season) return false;

    const startsAt = new Date(`${season.startsAt}T00:00:00`);
    const expiresAt = new Date(`${season.expiresAt}T23:59:59`);

    if (isNaN(startsAt.getTime()) || isNaN(expiresAt.getTime())) {
        return false;
    }

    return now >= startsAt && now <= expiresAt;
}

// Función para obtener todas las temporadas activas
// now: Fecha actual (opcional, por defecto usa la fecha actual)
// Retorna array de temporadas activas
function getActiveSeasons(now = new Date()) {
    return Object.values(GEM_SEASONS).filter(season => isSeasonActive(season.id, now));
}

// Función para obtener una temporada por su ID
// seasonId: ID de la temporada
// Retorna el objeto de temporada o null si no existe
function getSeasonById(seasonId) {
    return GEM_SEASONS[seasonId] || null;
}

const SEASON_EVENT_CONFIG = {
    id: 'evento_leyendas_01',
    seasonId: 'leyendas',
    startsAt: '2026-07-01',
    expiresAt: '2026-08-25',
    rewardBannerId: 'banner_leyendas_campeones',
    rewardFrameId: 'Frame_Leyendas_Campeones',
    missions: [
        { id: 'ev_coins', metric: 'coin_collect', goal: 200, title: 'Cazador de oro', text: 'Recoge 200 monedas durante el evento.' },
        { id: 'ev_powerups', metric: 'powerup_use', goal: 10, title: 'Poder desatado', text: 'Usa 10 potenciadores durante el evento.' },
        { id: 'ev_distance', metric: 'distance', goal: 6000, title: 'Larga travesía', text: 'Recorre 6000 metros durante el evento.' },
        { id: 'ev_purchase', metric: 'shop_purchase', goal: 3, title: 'Cliente frecuente', text: 'Haz 3 compras en la tienda durante el evento.' },
        { id: 'ev_wins', metric: 'game_win', goal: 5, title: 'Racha de victorias', text: 'Gana 5 partidas durante el evento.' },
        { id: 'ev_rubypass_level', metric: 'rubypass_level_check', goal: 5, title: 'Ascenso constante', text: 'Alcanza el nivel 5 del carril gratuito del Ruby Pass.' }
    ]
};

function isSeasonEventActive(now = new Date()) {
    const startsAt = new Date(`${SEASON_EVENT_CONFIG.startsAt}T00:00:00`);
    const expiresAt = new Date(`${SEASON_EVENT_CONFIG.expiresAt}T23:59:59`);
    return now >= startsAt && now <= expiresAt;
}

// Exportar para uso global
window.GEM_SEASONS = GEM_SEASONS;
window.isSeasonActive = isSeasonActive;
window.getActiveSeasons = getActiveSeasons;
window.getSeasonById = getSeasonById;
window.SEASON_EVENT_CONFIG = SEASON_EVENT_CONFIG;
window.isSeasonEventActive = isSeasonEventActive;
