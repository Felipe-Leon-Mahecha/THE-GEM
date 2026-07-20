// =====================================================
// SISTEMA DE TEMPORADAS
// =====================================================
// Este archivo maneja la configuración de temporadas del juego.
// Cada temporada tiene sus propios items (skins, trails, emotes, banners)
// con fechas de inicio y expiración.

// Objeto central de temporadas
const GEM_SEASONS = {
    halloween: {
        id: 'halloween',
        displayName: 'Halloween',
        startsAt: '2024-10-01',
        expiresAt: '2024-11-30',
        contains: {
            skins: [],
            trails: [],
            banners: [],
            emotes: []
        }
    },
    navidad: {
        id: 'navidad',
        displayName: 'Navidad',
        startsAt: '2024-12-01',
        expiresAt: '2025-01-15',
        contains: {
            skins: [],
            trails: [],
            banners: [],
            emotes: []
        }
    },
    elemental_fuego: {
        id: 'elemental_fuego',
        displayName: 'Elemental Fuego',
        startsAt: '2024-06-01',
        expiresAt: '2024-08-31',
        contains: {
            skins: [],
            trails: [],
            banners: [],
            emotes: []
        }
    }
};

// Función para verificar si una temporada está activa
// seasonId: ID de la temporada (ej: 'halloween', 'navidad')
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

// Exportar para uso global
window.GEM_SEASONS = GEM_SEASONS;
window.isSeasonActive = isSeasonActive;
window.getActiveSeasons = getActiveSeasons;
window.getSeasonById = getSeasonById;
