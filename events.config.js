// =====================================================
// EVENTS CONFIG — Registro de eventos de temporada
// =====================================================
// Cada entrada en GEM_EVENTS es un evento independiente con sus
// propias fechas, misiones y recompensas. Varios eventos pueden
// correr al mismo tiempo (distintos seasonId, o mismos si se desea).
//
// Métricas disponibles para misiones (ya instrumentadas):
//   coin_collect, powerup_use, distance, shop_purchase, game_win,
//   games_played, circuit_lap, dash_use, chest_open,
//   skin_fragment_collect, max_combo, playtime_seconds,
//   skin_equip_distinct, perfect_win, level_win_id, coins_spent,
//   gems_spent, rubypass_level_check, rubypass_premium_level_check
//
// Tipos de recompensa soportados en rewards[]:
//   { type: 'banner', id: '...' }
//   { type: 'frame',  id: '...' }
//   { type: 'skin',   id: '...' }
//   { type: 'trail',  id: '...' }   — desbloquea variante 'cyan' por defecto
//   { type: 'emote',  id: '...' }
// =====================================================

const GEM_EVENTS = [
    {
        // EVENTO ACTUAL — mismo id que el evento hardcodeado anterior.
        // Esto permite que migrateLegacyEventState() (en shop.js) preserve
        // el progreso ya guardado bajo 'seasonEventState_v1' sin pérdida.
        id: 'evento_leyendas_01',
        seasonId: 'leyendas',
        name: 'Campeones de Leyendas',
        description: 'Completa las misiones de temporada y desbloquea la recompensa exclusiva del evento.',
        startsAt: '2026-07-28',
        expiresAt: '2026-08-25',
        missions: [
            {
                id: 'ev_coins',
                metric: 'coin_collect',
                goal: 200,
                title: 'Cazador de oro',
                text: 'Recoge 200 monedas durante el evento.'
            },
            {
                id: 'ev_powerups',
                metric: 'powerup_use',
                goal: 10,
                title: 'Poder desatado',
                text: 'Usa 10 potenciadores durante el evento.'
            },
            {
                id: 'ev_distance',
                metric: 'distance',
                goal: 6000,
                title: 'Larga travesía',
                text: 'Recorre 6000 metros durante el evento.'
            },
            {
                id: 'ev_purchase',
                metric: 'shop_purchase',
                goal: 3,
                title: 'Cliente frecuente',
                text: 'Haz 3 compras en la tienda durante el evento.'
            },
            {
                id: 'ev_wins',
                metric: 'game_win',
                goal: 5,
                title: 'Racha de victorias',
                text: 'Gana 5 partidas durante el evento.'
            },
            {
                id: 'ev_rubypass_level',
                metric: 'rubypass_level_check',
                goal: 5,
                title: 'Ascenso constante',
                text: 'Alcanza el nivel 5 del carril gratuito del Ruby Pass.'
            }
        ],
        rewards: [
            { type: 'banner', id: 'banner_leyendas_campeones' },
            { type: 'frame', id: 'Frame_Leyendas_Campeones' }
        ]
    }

    // Aquí se agregarán más eventos en el futuro, por ejemplo:
    // {
    //     id: 'evento_nueva_temporada_01',
    //     seasonId: 'nueva_temporada',
    //     name: 'Nombre del evento',
    //     description: '...',
    //     startsAt: 'YYYY-MM-DD',
    //     expiresAt: 'YYYY-MM-DD',
    //     missions: [ ... ],
    //     rewards: [ ... ]
    // }
];

window.GEM_EVENTS = GEM_EVENTS;

// ── Helpers de filtrado ────────────────────────────────────────────

/**
 * Devuelve los eventos activos en este momento.
 * @param {Date} [now]
 * @returns {Array}
 */
function getActiveEvents(now = new Date()) {
    return GEM_EVENTS.filter(ev => {
        const startsAt = new Date(`${ev.startsAt}T00:00:00`);
        const expiresAt = new Date(`${ev.expiresAt}T23:59:59`);
        return now >= startsAt && now <= expiresAt;
    });
}
window.getActiveEvents = getActiveEvents;

/**
 * Devuelve los eventos que aún no han comenzado.
 * @param {Date} [now]
 * @returns {Array}
 */
function getUpcomingEvents(now = new Date()) {
    return GEM_EVENTS.filter(ev => new Date(`${ev.startsAt}T00:00:00`) > now);
}
window.getUpcomingEvents = getUpcomingEvents;

/**
 * Devuelve los eventos que ya terminaron.
 * @param {Date} [now]
 * @returns {Array}
 */
function getPastEvents(now = new Date()) {
    return GEM_EVENTS.filter(ev => new Date(`${ev.expiresAt}T23:59:59`) < now);
}
window.getPastEvents = getPastEvents;
