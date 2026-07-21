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
            skins: [],
            trails: [],
            banners: [],
            emotes: []
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

// Exportar para uso global
window.GEM_SEASONS = GEM_SEASONS;
window.isSeasonActive = isSeasonActive;
window.getActiveSeasons = getActiveSeasons;
window.getSeasonById = getSeasonById;
