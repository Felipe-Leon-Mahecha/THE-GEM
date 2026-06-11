// =====================================================
// SISTEMA DE POWERUPS
// =====================================================
// Este archivo maneja todos los powerups del juego: compra, mejora, equipamiento,
// uso durante la partida, efectos visuales y estadísticas de uso.

// Claves para almacenamiento en localStorage
const POWERUP_STORAGE_KEY = 'powerups'; // Inventario de powerups
const POWERUP_SLOT_KEY = 'equippedPowerups'; // Powerups equipados
const POWERUP_MAX_LEVEL = 6; // Nivel máximo de mejora para powerups

// Datos de todos los powerups disponibles en el juego
// Cada powerup tiene: id, nombre, color, tipo, costos, descripción base,
// descripciones por nivel, y efectos específicos por nivel
const POWERUPS_DATA = [
    {
        id: 'proteccion', name: 'Proteccion', color: '#AAE3D8', type: 'defensivo', buy: { coins: 180, gems: 6 }, upgrade: [0, 8, 13, 20, 30, 48],
        base: 'Invulnerabilidad por 2 segundos.',
        levels: ['2.0s de escudo.', '2.4s de escudo.', '2.8s de escudo.', '3.2s de escudo.', '3.8s de escudo.', '2 escudos por activacion.'],
        effect: { duration: [2, 2.4, 2.8, 3.2, 3.8, 4.2] }
    },
    {
        id: 'fantasma', name: 'Fantasma', color: '#DEAAF0', type: 'defensivo', buy: { coins: 240, gems: 8 }, upgrade: [0, 9, 15, 24, 36, 58],
        base: 'Atraviesas obstaculos por 3 segundos.',
        levels: ['3.0s intangible.', '3.5s intangible.', '4.0s intangible.', '4.6s intangible.', '5.2s intangible.', '2 usos por activacion.'],
        effect: { duration: [3, 3.5, 4, 4.6, 5.2, 5.8] }
    },
    {
        id: 'stop_time', name: 'Hora de parada', color: '#B09C54', type: 'control', buy: { coins: 380, gems: 13 }, upgrade: [0, 14, 23, 36, 54, 84],
        base: 'Detiene todos los obstaculos por 5 segundos.',
        levels: ['5.0s de congelacion.', '5.6s de congelacion.', '6.2s de congelacion.', '6.8s de congelacion.', '7.5s de congelacion.', '2 usos por activacion.'],
        effect: { duration: [5, 5.6, 6.2, 6.8, 7.5, 8.2] }
    },
    {
        id: 'camara_lenta', name: 'Camara Lenta', color: '#D9C938', type: 'control', buy: { coins: 300, gems: 10 }, upgrade: [0, 12, 19, 30, 45, 70],
        base: 'Ralentiza intensamente el mundo alrededor del jugador.',
        levels: ['3.6s de ralentizacion.', '4.2s de ralentizacion.', '4.8s de ralentizacion.', '5.4s de ralentizacion.', '6.0s de ralentizacion.', '6.8s de ralentizacion.'],
        effect: { duration: [3.6, 4.2, 4.8, 5.4, 6, 6.8] }
    },
    {
        id: 'vida_extra', name: 'Vida Extra', color: '#DE21C8', type: 'defensivo', buy: { coins: 520, gems: 18 }, upgrade: [0, 22, 34, 52, 76, 110],
        base: 'Ganas 1 vida extra al instante.',
        levels: ['+1 vida.', '+1 vida y escudo breve.', '+2 vidas.', '+2 vidas y escudo breve.', '+3 vidas.', '+3 vidas y escudo fuerte.'],
        effect: { lives: [1, 1, 2, 2, 3, 3] }
    },
    {
        id: 'destruccion_letal', name: 'Destruccion Letal', color: '#ED2121', type: 'control', buy: { coins: 720, gems: 24 }, upgrade: [0, 24, 40, 66, 96, 140],
        base: 'Un angulo de la esfera queda inactivo y sin spawns por 10 segundos.',
        levels: ['10s y angulo pequeno.', '11s y angulo mayor.', '12s y angulo mayor.', '13s y angulo amplio.', '14s y angulo amplio.', '15s y angulo letal.'],
        effect: { duration: [10, 11, 12, 13, 14, 15], arc: [0.5, 0.58, 0.66, 0.74, 0.82, 0.92] }
    },
    {
        id: 'caos', name: 'Caos', color: '#A16603', type: 'control', buy: { coins: 0, gems: 45 }, upgrade: [0, 34, 55, 86, 128, 190], normalCurrency: 'gems',
        base: 'La bola se vuelve multicolor, invencible, y ganas 1 vida extra.',
        levels: ['Invencible y +1 vida.', 'Invencible y +2 vidas.', 'Invencible y +2 vidas.', 'Invencible y +2 vidas.', 'Invencible y +3 vidas.', 'Invencible y +3 vidas extendido.'],
        effect: { duration: [5, 5.5, 6, 6.5, 7, 8], lives: [1, 2, 2, 2, 3, 3] }
    },
    {
        id: 'iman', name: 'Iman', color: '#FAFF00', type: 'utilidad', buy: { coins: 220, gems: 8 }, upgrade: [0, 9, 15, 24, 36, 60],
        base: 'Atrae monedas en rango pequeno.',
        levels: ['Rango pequeno.', 'Rango medio.', 'Rango alto.', 'Rango muy alto.', 'Rango enorme.', 'Todo el mapa y algunas monedas duplicadas.'],
        effect: { duration: [7, 8, 9, 10, 11, 12], range: [95, 135, 180, 230, 290, 9999] }
    },
    {
        id: 'monedas_x2', name: 'Monedas x2', color: '#FFD700', type: 'utilidad', buy: { coins: 650, gems: 22 }, upgrade: [0, 30, 52, 86, 130, 200],
        base: 'Duplica monedas recogidas durante esta partida.',
        levels: ['x2 monedas.', 'x3 monedas.', 'x3 monedas y gemas +1.', 'x4 monedas.', 'x5 monedas y gemas x2.', 'x5 monedas y gemas x3.'],
        effect: { duration: [999, 999, 999, 999, 999, 999], coins: [2, 3, 3, 4, 5, 5], gems: [1, 1, 1.2, 1.5, 2, 3] }
    },
    {
        id: 'angel_guardian', name: 'Angel guardian', color: '#4BC0EB', type: 'defensivo', buy: { coins: 880, gems: 30 }, upgrade: [0, 28, 48, 78, 118, 170],
        base: 'Al morir, congela la pantalla y revive con 1 vida.',
        levels: ['Revive con 1 vida.', 'Revive con 2 vidas.', 'Revive con 2 vidas y escudo.', 'Revive con 3 vidas.', 'Revive con 3 vidas y mas escudo.', 'Revive con 4 vidas.'],
        effect: { lives: [1, 2, 2, 3, 3, 4] }
    },
    {
        id: 'teletransporte', name: 'Punto de teletransporte', color: '#3B289E', type: 'utilidad', buy: { coins: 360, gems: 12 }, upgrade: [0, 16, 28, 0, 0, 0], maxLevel: 3,
        base: 'Primera pulsacion marca posicion, segunda pulsacion vuelve al punto.',
        levels: ['Marca y vuelve.', 'Marca dura mas tiempo.', 'Vuelve con escudo breve.', 'Nivel maximo 3.', 'Nivel maximo 3.', 'Nivel maximo 3.'],
        effect: { markerLife: [10, 14, 18] }
    },
    {
        id: 'sobrecarga', name: 'Sobrecarga', color: '#F97316', type: 'control', buy: { coins: 420, gems: 14 }, upgrade: [0, 14, 22, 34, 52, 82],
        base: 'Aumenta velocidad 40%, destruye obstaculos pequenos y termina con aturdimiento.',
        levels: ['Velocidad +40%.', 'Velocidad +45%.', 'Velocidad +50%.', 'Velocidad +55%.', 'Velocidad +60%.', 'Sin aturdimiento y destruye medianos.'],
        effect: { duration: [4, 4.6, 5.2, 5.8, 6.4, 7], speed: [1.4, 1.45, 1.5, 1.55, 1.6, 1.7], stun: [1.5, 1.25, 1, 0.75, 0.45, 0] }
    },
    {
        id: 'sombra', name: 'Sombra', color: '#2D2D2D', type: 'defensivo', buy: { coins: 460, gems: 16 }, upgrade: [0, 16, 26, 42, 66, 98],
        base: 'Crea un clon que absorbe el proximo golpe fatal.',
        levels: ['Clon de 1s y 1 golpe.', 'Clon dura mas.', 'Absorbe 2 golpes.', 'Absorbe 2 golpes y dura mas.', 'Absorbe 2 golpes extendido.', 'El clon tambien atrae monedas.'],
        effect: { cloneDelay: [1, 1.3, 1.5, 1.8, 2, 2.2], hits: [1, 1, 2, 2, 2, 2] }
    },
    {
        id: 'tierra', name: 'Lluvia de oro', color: '#C58A12', type: 'utilidad', buy: { coins: 500, gems: 17 }, upgrade: [0, 18, 30, 48, 72, 108],
        base: 'Convierte los obstaculos en pantalla en monedas doradas.',
        levels: ['Convierte obstaculos en monedas.', 'Mas monedas.', 'Algunos sueltan gemas.', 'Mas chance de gemas.', 'Gran pop dorado.', 'Alta chance de gemas.'],
        effect: { gemChance: [0, 0, 0.12, 0.18, 0.24, 0.32] }
    },
    {
        id: 'burbuja', name: 'Burbuja Fantasma', color: '#FF6EB4', type: 'defensivo', buy: { coins: 280, gems: 10 }, upgrade: [0, 12, 19, 30, 45, 70],
        base: 'Una burbuja rebota obstaculos durante 4 segundos sin recibir dano.',
        levels: ['4.0s de burbuja.', '4.6s de burbuja.', '5.2s de burbuja.', '5.8s de burbuja.', '6.4s de burbuja.', 'Empuja monedas hacia el jugador.'],
        effect: { duration: [4, 4.6, 5.2, 5.8, 6.4, 7] }
    },
    {
        id: 'dash', name: 'Salto Cuantico', color: '#4E2A84', type: 'defensivo', buy: { coins: 260, gems: 9 }, upgrade: [0, 12, 20, 32, 50, 78],
        base: 'Aceleron orbital que atraviesa peligros por una distancia corta. Cada compra agrega 1 uso; en partida tiene cargas separadas.',
        levels: ['3 cargas por partida.', '3 cargas con mas distancia.', '4 cargas por partida.', '4 cargas e invulnerabilidad mejorada.', '5 cargas por partida.', '5 cargas y mayor alcance.'],
        effect: { distance: [0.34, 0.39, 0.44, 0.5, 0.56, 0.62], invuln: [0.35, 0.42, 0.48, 0.55, 0.62, 0.7], charges: [3, 3, 4, 4, 5, 5] }
    },
    {
        id: 'onda_repulsora', name: 'Onda Repulsora', color: '#E65100', type: 'control', buy: { coins: 430, gems: 15 }, upgrade: [0, 18, 30, 48, 74, 112],
        base: 'Pulso expansivo que empuja obstaculos cercanos y despeja tu zona inmediata.',
        levels: ['Radio cercano.', 'Mas radio y fuerza.', 'Empuja sierras tambien.', 'Cubre gran parte de la pista.', 'Pulso casi total.', 'Pantalla completa con fuerza maxima.'],
        effect: { radius: [0.75, 1.05, 1.35, 1.75, 2.25, 99], force: [0.55, 0.72, 0.9, 1.08, 1.25, 1.55], duration: [0.75, 0.85, 0.95, 1.05, 1.15, 1.25] }
    },
    {
        id: 'rebobinado', name: 'Capsula de Rebobinado', color: '#00A896', type: 'defensivo', buy: { coins: 520, gems: 18 }, upgrade: [0, 24, 40, 64, 96, 145],
        base: 'Registra tu estado. Si recibes un golpe fatal en la ventana, vuelves al pasado con vida.',
        levels: ['Ventana de 4s.', 'Ventana de 5s.', 'Ventana de 6s.', 'Ventana de 7s.', 'Ventana de 8s.', 'Ventana de 9s.'],
        effect: { duration: [4, 5, 6, 7, 8, 9] }
    },
    {
        id: 'espejo_rubies', name: 'Espejo de Rubies', color: '#B11226', type: 'utilidad', buy: { coins: 390, gems: 14 }, upgrade: [0, 20, 34, 56, 84, 126],
        base: 'Durante 6 segundos las monedas que aparezcan y recojas se convierten en rubies.',
        levels: ['6.0s de conversion.', '6.4s de conversion.', '6.8s de conversion.', '7.2s de conversion.', '7.6s de conversion.', '8.0s y duplica rubies visibles.'],
        effect: { duration: [6, 6.4, 6.8, 7.2, 7.6, 8] }
    },
    {
        id: 'gravedad_cero', name: 'Gravedad Cero', color: '#7CB342', type: 'defensivo', buy: { coins: 360, gems: 13 }, upgrade: [0, 16, 26, 42, 66, 100],
        base: 'Flotas en el centro de la pista durante 3 segundos y evitas peligros de suelo o techo.',
        levels: ['3.0s lento.', '3.6s menos lento.', '4.2s estable.', '4.8s agil.', '5.4s casi normal.', '6.0s con movilidad normal.'],
        effect: { duration: [3, 3.6, 4.2, 4.8, 5.4, 6], speed: [0.45, 0.55, 0.65, 0.78, 0.9, 1] }
    },
    {
        id: 'tormenta_clavos', name: 'Tormenta de Clavos', color: '#D81B60', type: 'control', buy: { coins: 470, gems: 16 }, upgrade: [0, 18, 30, 48, 74, 112],
        base: 'Dispara puas radiales que destruyen obstaculos al tocarlos.',
        levels: ['6 clavos.', '8 clavos.', '10 clavos.', '12 clavos.', '14 clavos.', '16 clavos y 2 rafagas.'],
        effect: { nails: [6, 8, 10, 12, 14, 16], bursts: [1, 1, 1, 1, 1, 2] }
    },
    {
        id: 'super_vinculo', name: 'Super Vinculo', color: '#FFB300', type: 'riesgo', buy: { coins: 620, gems: 22 }, upgrade: [0, 26, 44, 70, 106, 156],
        base: 'Crea un clon a 180 grados. Sus recompensas valen x3, pero si choca te quita vida.',
        levels: ['5s y x3.', '6s y x4.', '6.5s y x4.', '7s y x5.', '7.5s y x5.', '8s, x6 y sin dano por choque.'],
        effect: { duration: [5, 6, 6.5, 7, 7.5, 8], multiplier: [3, 4, 4, 5, 5, 6], safe: [false, false, false, false, false, true] }
    }
];

// Caché de imágenes de powerups para optimizar carga
const powerupImages = {};
const powerupImageCache = new Map();

// Cargar imagen de powerup (icono o efecto) con caché
// powerupId: ID del powerup
// type: 'icon' para icono, cualquier otro valor para efecto
function loadPowerupImage(powerupId, type = 'icon') {
    // Verificar si ya está en caché
    const cacheKey = `${powerupId}_${type}`;
    if (powerupImageCache.has(cacheKey)) {
        return powerupImageCache.get(cacheKey);
    }
    
    // Crear nueva imagen con lazy loading
    const img = new Image();
    img.loading = 'lazy';
    img.decoding = 'async';
    
    // Cargar icono o efecto según el tipo
    if (type === 'icon') {
        img.src = `assets/powerups/icons/${powerupId}.png`;
    } else {
        img.src = `assets/powerups/effects/${powerupId}_effect.png`;
    }
    
    // Guardar en caché y retornar
    powerupImageCache.set(cacheKey, img);
    
    if (!powerupImages[powerupId]) {
        powerupImages[powerupId] = {};
    }
    powerupImages[powerupId][type] = img;
    
    return img;
}

// Cargar solo las imágenes de iconos al inicio (lazy loading para efectos)
// Los efectos se cargarán bajo demanda cuando se necesiten
POWERUPS_DATA.forEach(powerup => {
    loadPowerupImage(powerup.id, 'icon');
    // Efectos se cargarán bajo demanda
});

// Exportar datos de powerups para uso global
window.POWERUPS_DATA = POWERUPS_DATA;

// Obtener datos de un powerup por su ID
// id: ID del powerup a buscar
// Retorna el objeto del powerup o null si no existe
function getPowerupById(id) {
    return POWERUPS_DATA.find(powerup => powerup.id === id) || null;
}

// Normalizar el inventario de powerups desde localStorage
// Asegura que todos los powerups tengan las propiedades correctas
// raw: Objeto crudo del localStorage
function normalizePowerupsStore(raw = {}) {
    const next = {};
    // Recorrer todos los powerups y normalizar sus datos
    POWERUPS_DATA.forEach(powerup => {
        const current = raw[powerup.id] || {};
        next[powerup.id] = {
            id: powerup.id,
            nivel: Math.max(0, Math.min(powerup.maxLevel || POWERUP_MAX_LEVEL, parseInt(current.nivel || 0, 10))),
            usos: Math.max(0, parseInt(current.usos || 0, 10)),
            desbloqueado: current.desbloqueado === true || current.desbloqueado === 'true'
        };
    });
    return next;
}

// Leer inventario de powerups desde localStorage
// Retorna el inventario normalizado
function readPowerups() {
    let parsed = {};
    try {
        parsed = JSON.parse(localStorage.getItem(POWERUP_STORAGE_KEY) || '{}') || {};
    } catch (error) {
        parsed = {};
    }
    // Normalizar y guardar
    const normalized = normalizePowerupsStore(parsed);
    localStorage.setItem(POWERUP_STORAGE_KEY, JSON.stringify(normalized));
    window.powerupsInventory = normalized;
    return normalized;
}

// Guardar inventario de powerups en localStorage
// inventory: Objeto con el inventario a guardar
function savePowerups(inventory) {
    const normalized = normalizePowerupsStore(inventory);
    localStorage.setItem(POWERUP_STORAGE_KEY, JSON.stringify(normalized));
    window.powerupsInventory = normalized;
    return normalized;
}

// Obtener los powerups equipados en los 2 slots
// Retorna array con [slot1, slot2] (puede ser null si está vacío)
function getEquippedPowerups() {
    try {
        const slots = JSON.parse(localStorage.getItem(POWERUP_SLOT_KEY) || '[]');
        return [slots[0] || null, slots[1] || null];
    } catch (error) {
        return [null, null];
    }
}

// Establecer los powerups equipados en los 2 slots
// slots: Array con [slot1, slot2]
function setEquippedPowerups(slots) {
    const clean = [slots?.[0] || null, slots?.[1] || null];
    localStorage.setItem(POWERUP_SLOT_KEY, JSON.stringify(clean));
    window.equippedPowerups = clean;
    return clean;
}

// Obtener el estado completo de un powerup (nivel, usos, desbloqueado)
// id: ID del powerup
function getPowerupLevelState(id) {
    const inventory = readPowerups();
    return inventory[id] || normalizePowerupsStore({})[id];
}

// Obtener el nivel actual de un powerup
// id: ID del powerup
// Retorna nivel (mínimo 1)
function getPowerupLevel(id) {
    return Math.max(1, getPowerupLevelState(id)?.nivel || 1);
}

// Gastar un uso de powerup durante una partida
// id: ID del powerup
// Retorna true si se gastó correctamente, false si no tenía usos
function spendPowerupUse(id) {
    const inventory = readPowerups();
    if (!inventory[id] || inventory[id].usos <= 0) return false;
    inventory[id].usos -= 1;
    inventory[id].desbloqueado = true;
    if (inventory[id].nivel <= 0) inventory[id].nivel = 1;
    savePowerups(inventory);
    
    // Incrementar contador de uso en estadísticas
    incrementPowerupUsage(id);
    
    return true;
}

// Obtener número de cargas por partida para un powerup
// Algunos powerups como Dash tienen múltiples cargas por partida
// powerup: Objeto del powerup
// level: Nivel del powerup
function getPowerupSessionCharges(powerup, level) {
    // Solo Dash tiene múltiples cargas
    if (powerup?.id !== 'dash') return 1;
    const idx = Math.max(0, (level || 1) - 1);
    return powerup.effect?.charges?.[idx] || 3;
}

// =====================================================
// ESTADÍSTICAS DE USO DE POWERUPS
// =====================================================

// Clave para almacenar estadísticas de uso
const POWERUP_STATS_KEY = 'powerupStats';

// Incrementar contador de uso de un powerup
// powerupId: ID del powerup usado
function incrementPowerupUsage(powerupId) {
    const stats = JSON.parse(localStorage.getItem(POWERUP_STATS_KEY) || '{}');
    stats[powerupId] = (stats[powerupId] || 0) + 1;
    localStorage.setItem(POWERUP_STATS_KEY, JSON.stringify(stats));
}

// Obtener estadísticas de uso de todos los powerups
// Retorna objeto con { powerupId: usos }
function getPowerupStats() {
    return JSON.parse(localStorage.getItem(POWERUP_STATS_KEY) || '{}');
}

// Obtener el powerup más usado por el jugador
// Retorna ID del powerup más usado o null
function getMostUsedPowerup() {
    const stats = getPowerupStats();
    let maxUses = 0;
    let mostUsed = null;
    
    for (const [id, uses] of Object.entries(stats)) {
        if (uses > maxUses) {
            maxUses = uses;
            mostUsed = id;
        }
    }
    
    return mostUsed;
}

// Verificar si el jugador puede pagar por un powerup
// amount: Cantidad a pagar
// currency: 'gems' o 'coins' (deadCoins)
// Retorna true si puede pagar
function canAffordPowerup(amount, currency) {
    const key = currency === 'gems' ? 'gems' : 'deadCoins';
    return parseInt(localStorage.getItem(key) || '0', 10) >= amount;
}

// Gastar monedas o gemas para comprar powerup
// amount: Cantidad a gastar
// currency: 'gems' o 'coins' (deadCoins)
// Retorna true si se gastó correctamente
// Gastar monedas o gemas para comprar powerup
// amount: Cantidad a gastar
// currency: 'gems' o 'coins' (deadCoins)
// Retorna true si se gastó correctamente
function spendPowerupCurrency(amount, currency) {
    const key = currency === 'gems' ? 'gems' : 'deadCoins';
    const current = parseInt(localStorage.getItem(key) || '0', 10);
    if (current < amount) return false;
    const next = current - amount;
    localStorage.setItem(key, String(next));
    if (window.playerData) {
        if (currency === 'gems') window.playerData.gems = next;
        else window.playerData.deadCoins = next;
    }
    window.refreshShopBalances?.();
    window.updateMenuHUD?.();
    return true;
}

// Comprar un powerup por primera vez
// id: ID del powerup
// source: 'normal' para tienda normal, 'vip' para tienda VIP
// Retorna true si se compró correctamente
function buyPowerup(id, source = 'normal') {
    const powerup = getPowerupById(id);
    if (!powerup) return false;
    const currency = source === 'vip' ? 'gems' : (powerup.normalCurrency || 'coins');
    const amount = currency === 'gems'
        ? (source === 'vip' ? Math.max(1, Math.ceil((powerup.buy.coins || powerup.buy.gems * 30) / 30)) : powerup.buy.gems)
        : powerup.buy.coins;
    if (!canAffordPowerup(amount, currency)) {
        alert(currency === 'gems' ? 'No tienes suficientes rubies.' : 'No tienes suficientes monedas.');
        return false;
    }
    spendPowerupCurrency(amount, currency);
    const inventory = readPowerups();
    const item = inventory[id];
    item.desbloqueado = true;
    item.nivel = Math.max(1, item.nivel || 1);
    item.usos += powerup.id === 'monedas_x2' ? 2 : 1;
    savePowerups(inventory);
    window.playSfx?.('spend', 0.8);
    window.trackMissionProgress?.('shop_purchase', 1);
    refreshPowerupShopViews();
    if (document.getElementById('powerupDetailModal')?.style.display === 'grid' || document.getElementById('normalPowerupDetail')?.innerHTML) {
        openPowerupDetail(id, source);
    }
    return true;
}

// Mejorar un powerup al siguiente nivel
// id: ID del powerup
// Retorna true si se mejoró correctamente
function upgradePowerup(id) {
    const powerup = getPowerupById(id);
    const inventory = readPowerups();
    const item = inventory[id];
    if (!powerup || !item?.desbloqueado) return false;
    const maxLevel = powerup.maxLevel || POWERUP_MAX_LEVEL;
    if (item.nivel >= maxLevel) return false;
    const nextLevel = item.nivel + 1;
    const cost = powerup.upgrade[nextLevel - 1] || Math.ceil((powerup.buy.gems || 8) * (1 + nextLevel * 0.8));
    if (!canAffordPowerup(cost, 'gems')) {
        alert('No tienes suficientes rubies.');
        return false;
    }
    spendPowerupCurrency(cost, 'gems');
    item.nivel = nextLevel;
    savePowerups(inventory);
    window.playSfx?.('vipBuy', 0.8);
    refreshPowerupShopViews();
    if (document.getElementById('powerupDetailModal')?.style.display === 'grid' || document.getElementById('normalPowerupDetail')?.innerHTML) {
        openPowerupDetail(id, 'vip');
    }
    return true;
}

// Obtener la duración de un powerup según su nivel
// id: ID del powerup
// level: Nivel del powerup
// Retorna duración en segundos
function getPowerupDuration(id, level) {
    const powerup = getPowerupById(id);
    const duration = powerup?.effect?.duration;
    if (!duration) return 0;
    return duration[Math.max(0, Math.min(duration.length - 1, level - 1))] || 0;
}

// Crear el runtime de powerups para una partida
// Inicializa los slots de powerups y los efectos activos
// slots: Array con los powerups equipados
function createPowerupRuntime(slots = getEquippedPowerups()) {
    const isTouch = document.body.classList.contains('is-touch-device');
    // Inicializar slots de powerups
    window.activePowerupSlots = slots.map((id, index) => {
        const state = id ? getPowerupLevelState(id) : null;
        return {
            id,
            key: isTouch ? '' : (index === 0 ? 'W' : 'E'), /* Eliminar letras en móvil */
            active: false,
            startedAt: 0,
            duration: 0,
            flash: 0,
            usesAtStart: state?.usos || 0
        };
    });
    // Inicializar efectos de powerups
    window.powerupEffects = {
        invulnerableUntil: 0, // Tiempo hasta que termina la invulnerabilidad
        ghostUntil: 0, // Tiempo hasta que termina el modo fantasma
        stopUntil: 0, // Tiempo hasta que termina el tiempo detenido
        slowUntil: 0, // Tiempo hasta que termina la cámara lenta
        magnetUntil: 0, // Tiempo hasta que termina el imán
        magnetRange: 0, // Rango del imán
        chaosUntil: 0, // Tiempo hasta que termina el modo caos
        bubbleUntil: 0, // Tiempo hasta que termina la burbuja
        overloadUntil: 0, // Tiempo hasta que termina la sobrecarga
        overloadSpeed: 1, // Multiplicador de velocidad de sobrecarga
        overloadStunUntil: 0, // Tiempo hasta que termina el aturdimiento
        overloadStunFactor: 1, // Factor de aturdimiento
        coinMultiplier: 1, // Multiplicador de monedas
        gemMultiplier: 1, // Multiplicador de gemas
        lethalZone: null, // Zona letal activa
        teleport: {}, // Datos de teletransporte
        shadowClone: null, // Clon sombra activo
        guardian: null, // Ángel guardián activo
        rewind: null, // Datos de rebobinado
        repulseWaves: [], // Ondas repulsoras activas
        zeroGravityUntil: 0, // Tiempo hasta que termina gravedad cero
        zeroGravitySpeed: 1, // Velocidad en gravedad cero
        rubyMirrorUntil: 0, // Tiempo hasta que termina el espejo de rubies
        nailBursts: [], // Ráfagas de clavos
        linkedClone: null, // Clon vinculado activo
        dramaFlash: 0, // Flash dramático
        popBursts: [] // Ráfagas de pop
    };
}

// Verificar si el jugador es invulnerable por algún powerup
// Retorna true si es invulnerable
function isPowerupInvulnerable() {
    const now = performance.now();
    const effects = window.powerupEffects || {};
    return now < (effects.invulnerableUntil || 0) ||
        now < (effects.ghostUntil || 0) ||
        now < (effects.chaosUntil || 0) ||
        now < (effects.bubbleUntil || 0) ||
        now < (effects.dashInvulnerableUntil || 0);
}

// Obtener la escala de tiempo actual (para slow motion, stop time, etc)
// Retorna 0 si tiempo detenido, 0.34 si cámara lenta, 1 si normal
function getPowerupTimeScale() {
    const now = performance.now();
    const effects = window.powerupEffects || {};
    if (now < (effects.stopUntil || 0)) return 0;
    if (now < (effects.slowUntil || 0)) return 0.34;
    return 1;
}

// Obtener el factor de velocidad del jugador por powerups
// Retorna multiplicador de velocidad
function getPowerupSpeedFactor() {
    const now = performance.now();
    const effects = window.powerupEffects || {};
    if (now < (effects.zeroGravityUntil || 0)) return effects.zeroGravitySpeed || 0.6;
    if (now < (effects.overloadUntil || 0)) return effects.overloadSpeed || 1.4;
    if (now < (effects.overloadStunUntil || 0)) return effects.overloadStunFactor || 0.62;
    return 1;
}

// Verificar si el modo gravedad cero está activo
// Retorna true si está activo
function isZeroGravityActive() {
    return performance.now() < (window.powerupEffects?.zeroGravityUntil || 0);
}

// =====================================================
// SISTEMA DE COMBO - Usa combo-system.js
// =====================================================
// El sistema de combo se maneja en combo-system.js
// Este archivo solo usa las funciones exportadas desde allí

// Activar un powerup en un slot específico
// slotIndex: Índice del slot (0 o 1)
// Retorna true si se activó correctamente
function activatePowerupSlot(slotIndex) {
    const slot = window.activePowerupSlots?.[slotIndex];
    if (!slot?.id || slot.active) return false;
    const powerup = getPowerupById(slot.id);
    const state = getPowerupLevelState(slot.id);
    if (!powerup || !state?.desbloqueado || state.usos <= 0) return false;

    // Dash tiene lógica especial (múltiples cargas)
    if (slot.id === 'dash') {
        return activateDashPowerupSlot(slotIndex, powerup, state);
    }

    // Teletransporte tiene lógica especial (marcar y volver)
    if (slot.id === 'teletransporte') {
        return handleTeleportPowerup(slotIndex, powerup, state);
    }

    if (!spendPowerupUse(slot.id)) return false;
    const level = Math.max(1, state.nivel || 1);
    const duration = getPowerupDuration(slot.id, level);
    slot.active = duration > 0;
    slot.startedAt = performance.now();
    slot.duration = duration * 1000;
    slot.flash = 1;
    runPowerupEffect(slot.id, level, duration, slotIndex);
    window.playSfx?.('powerUp', 0.75);
    window.trackMissionProgress?.('powerup_use', 1);
    
    // Establecer cooldown después de la duración
    if (duration > 0) {
        slot.cooldownDuration = 2000; // 2 segundos de cooldown
        slot.cooldownUntil = performance.now() + slot.duration + slot.cooldownDuration;
    }
    
    return true;
}

// Activar el powerup Dash (Salto Cuántico) con múltiples cargas
// slotIndex: Índice del slot
// powerup: Objeto del powerup
// state: Estado del powerup
function activateDashPowerupSlot(slotIndex, powerup, state) {
    const slot = window.activePowerupSlots?.[slotIndex];
    if (!slot) return false;
    const level = Math.max(1, state.nivel || 1);
    // Iniciar sesión de cargas si no ha empezado
    if (!slot.sessionStarted) {
        if (!spendPowerupUse(slot.id)) return false;
        slot.sessionStarted = true;
        slot.sessionCharges = getPowerupSessionCharges(powerup, level);
    }
    if ((slot.sessionCharges || 0) <= 0) return false;
    slot.sessionCharges -= 1;
    slot.flash = 1;
    runPowerupEffect(slot.id, level, 0, slotIndex);
    window.playSfx?.('powerUp', 0.75);
    window.trackMissionProgress?.('powerup_use', 1);
    return true;
}

// Manejar el powerup de Teletransporte (marcar y volver)
// slotIndex: Índice del slot
// powerup: Objeto del powerup
// state: Estado del powerup
function handleTeleportPowerup(slotIndex, powerup, state) {
    const effects = window.powerupEffects || {};
    const tp = effects.teleport[slotIndex] || null;
    // Si no hay marca, crear una
    if (!tp) {
        if (!spendPowerupUse(powerup.id)) return false;
        const life = (powerup.effect.markerLife[Math.max(0, (state.nivel || 1) - 1)] || 10) * 1000;
        effects.teleport[slotIndex] = {
            angle: window.angle,
            offset: window.offset,
            createdAt: performance.now(),
            expiresAt: performance.now() + life
        };
        window.playSfx?.('powerUp', 0.65);
        return true;
    }
    // Si hay marca, teletransportarse a esa posición
    window.angle = tp.angle;
    window.offset = tp.offset;
    window.vel = 0;
    delete effects.teleport[slotIndex];
    // Nivel 3+ da escudo breve al teletransportarse
    if ((state.nivel || 1) >= 3) {
        effects.invulnerableUntil = Math.max(effects.invulnerableUntil || 0, performance.now() + 1200);
    }
    window.hitFlash = 0.6;
    return true;
}

// Ejecutar el efecto de un powerup específico
// id: ID del powerup
// level: Nivel del powerup
// duration: Duración en segundos
// slotIndex: Índice del slot que lo activó
function runPowerupEffect(id, level, duration, slotIndex) {
    const now = performance.now();
    const effects = window.powerupEffects;
    const powerup = getPowerupById(id);
    const levelIdx = Math.max(0, level - 1);
    const until = now + duration * 1000;

    // Powerups defensivos
    if (id === 'proteccion') effects.invulnerableUntil = Math.max(effects.invulnerableUntil || 0, until);
    if (id === 'fantasma') effects.ghostUntil = Math.max(effects.ghostUntil || 0, until);
    // Powerups de control de tiempo
    if (id === 'stop_time') effects.stopUntil = Math.max(effects.stopUntil || 0, until);
    if (id === 'camara_lenta') effects.slowUntil = Math.max(effects.slowUntil || 0, until);
    // Vida extra
    if (id === 'vida_extra') {
        window.lives += powerup.effect.lives[levelIdx] || 1;
        if (level >= 2) effects.invulnerableUntil = Math.max(effects.invulnerableUntil || 0, now + 900);
    }
    // Destrucción letal (zona segura)
    if (id === 'destruccion_letal') {
        effects.lethalZone = {
            angle: Math.random() * Math.PI * 2,
            arc: powerup.effect.arc[levelIdx] || 0.5,
            expiresAt: until
        };
    }
    // Modo caos (invencible + vidas)
    if (id === 'caos') {
        window.lives += powerup.effect.lives[levelIdx] || 1;
        effects.chaosUntil = Math.max(effects.chaosUntil || 0, until);
    }
    // Imán (atrae monedas)
    if (id === 'iman') {
        effects.magnetUntil = Math.max(effects.magnetUntil || 0, until);
        effects.magnetRange = powerup.effect.range[levelIdx] || 100;
    }
    // Monedas x2 (multiplicador)
    if (id === 'monedas_x2') {
        effects.coinMultiplier = Math.max(effects.coinMultiplier || 1, powerup.effect.coins[levelIdx] || 2);
        effects.gemMultiplier = Math.max(effects.gemMultiplier || 1, powerup.effect.gems[levelIdx] || 1);
    }
    // Ángel guardián (revive al morir)
    if (id === 'angel_guardian') {
        effects.guardian = { level, lives: powerup.effect.lives[levelIdx] || 1, slotIndex };
    }
    // Sobrecarga (velocidad + destrucción)
    if (id === 'sobrecarga') {
        effects.overloadUntil = until;
        effects.overloadSpeed = powerup.effect.speed[levelIdx] || 1.4;
        const stun = powerup.effect.stun[levelIdx] || 0;
        effects.overloadStunFactor = stun > 0 ? 0.58 : 1;
        effects.overloadStunQueued = stun * 1000;
    }
    // Sombra (clon que absorbe golpes)
    if (id === 'sombra') {
        effects.shadowClone = {
            angle: window.angle,
            offset: window.offset,
            createdAt: now,
            splitAt: now + (powerup.effect.cloneDelay[levelIdx] || 1) * 1000,
            hits: powerup.effect.hits[levelIdx] || 1,
            fading: 0,
            attractCoins: level >= 6
        };
    }
    // Lluvia de oro (convierte obstáculos en monedas)
    if (id === 'tierra') convertObstaclesToRewards(level);
    // Burbuja fantasma (rebota obstáculos)
    if (id === 'burbuja') effects.bubbleUntil = Math.max(effects.bubbleUntil || 0, until);
    // Dash (salto cuántico con invulnerabilidad)
    if (id === 'dash') {
        const dir = (window.playerFacing || 'right') === 'left' ? 1 : -1;
        const distance = powerup.effect.distance[levelIdx] || 0.34;
        window.angle += dir * distance;
        window.angVel = dir * 0.034;
        window.vel = 0;
        effects.dashInvulnerableUntil = Math.max(effects.dashInvulnerableUntil || 0, now + (powerup.effect.invuln[levelIdx] || 0.35) * 1000);
        effects.popBursts.push({ angle: window.angle - window.worldRotation, radius: window.BASE_RADIUS + window.offset, born: now, color: powerup.color });
    }
    // Onda repulsora (empuja obstáculos)
    if (id === 'onda_repulsora') {
        triggerRepulseWave(level, now, powerup);
    }
    // Cápsula de rebobinado (vuelve al pasado si mueres)
    if (id === 'rebobinado') {
        effects.rewind = {
            angle: window.angle,
            offset: window.offset,
            vel: window.vel,
            gravity: window.gravity,
            timer: window.gameTimer || 0,
            lives: window.lives,
            expiresAt: until
        };
    }
    // Espejo de rubies (convierte monedas en rubies)
    if (id === 'espejo_rubies') {
        effects.rubyMirrorUntil = Math.max(effects.rubyMirrorUntil || 0, until);
        if (level >= 6) duplicateVisibleRubies();
    }
    // Gravedad cero (flotas en el centro)
    if (id === 'gravedad_cero') {
        effects.zeroGravityUntil = Math.max(effects.zeroGravityUntil || 0, until);
        effects.zeroGravitySpeed = powerup.effect.speed[levelIdx] || 0.55;
        effects.invulnerableUntil = Math.max(effects.invulnerableUntil || 0, now + 220);
    }
    // Tormenta de clavos (destruye obstáculos)
    if (id === 'tormenta_clavos') {
        triggerNailStorm(level, now, powerup);
    }
    // Super vínculo (clon a 180° con recompensas x3)
    if (id === 'super_vinculo') {
        effects.linkedClone = {
            angle: window.angle + Math.PI,
            offset: window.offset,
            expiresAt: until,
            multiplier: powerup.effect.multiplier[levelIdx] || 3,
            safe: !!powerup.effect.safe[levelIdx],
            fading: 0
        };
    }

    // Nivel 6+ regresa 1 uso a ciertos powerups defensivos
    if (level >= 6 && ['proteccion', 'fantasma', 'stop_time'].includes(id)) {
        const inventory = readPowerups();
        inventory[id].usos += 1;
        savePowerups(inventory);
    }
}

// Activar la onda repulsora del powerup
// Empuja obstáculos y sierras lejos del jugador
// level: Nivel del powerup
// now: Tiempo actual
// powerup: Objeto del powerup
function triggerRepulseWave(level, now, powerup) {
    const effects = window.powerupEffects;
    const levelIdx = Math.max(0, level - 1);
    const radius = powerup.effect.radius[levelIdx] || 1; // Radio de la onda
    const force = powerup.effect.force[levelIdx] || 0.7; // Fuerza del empuje
    const centerAngle = window.angle - window.worldRotation;
    // Función para empujar un obstáculo
    const repel = item => {
        let rel = ((item.angle - centerAngle + Math.PI * 3) % (Math.PI * 2)) - Math.PI;
        if (Math.abs(rel) > radius) return false;
        item.angle += Math.sign(rel || 1) * force;
        if (typeof item.progress === 'number') item.progress = Math.max(0.2, item.progress - 0.35);
        if (item.state === 'moving') item.traveled = Math.max(0, item.traveled - 0.12);
        return true;
    };
    // Aplicar a todos los obstáculos y sierras
    (window.obstacles || []).forEach(repel);
    (window.sierras || []).forEach(repel);
    effects.slowUntil = Math.max(effects.slowUntil || 0, now + (powerup.effect.duration[levelIdx] || 0.8) * 1000);
    effects.repulseWaves.push({ angle: centerAngle, born: now, color: powerup.color, radius });
}

// Activar la tormenta de clavos del powerup
// Dispara clavos radiales que destruyen obstáculos
// level: Nivel del powerup
// now: Tiempo actual
// powerup: Objeto del powerup
function triggerNailStorm(level, now, powerup) {
    const effects = window.powerupEffects;
    const levelIdx = Math.max(0, level - 1);
    const nailCount = powerup.effect.nails[levelIdx] || 6; // Número de clavos
    const bursts = powerup.effect.bursts[levelIdx] || 1; // Número de ráfagas
    // Calcular ángulos de los clavos (distribuidos uniformemente)
    const nailAngles = Array.from({ length: nailCount }, (_, i) => window.angle - window.worldRotation + (Math.PI * 2 * i) / nailCount);
    // Verificar si un obstáculo es golpeado por algún clavo
    const hitByNail = item => nailAngles.some(a => Math.abs(((item.angle - a + Math.PI * 3) % (Math.PI * 2)) - Math.PI) < 0.12);
    // Eliminar spikes golpeados
    window.obstacles = (window.obstacles || []).filter(item => {
        const hit = hitByNail(item);
        if (hit) effects.popBursts.push({ angle: item.angle, radius: getObstacleRewardRadius(item), born: now, color: powerup.color });
        return !hit;
    });
    // Eliminar sierras golpeadas
    window.sierras = (window.sierras || []).filter(item => {
        const hit = hitByNail(item);
        if (hit) effects.popBursts.push({ angle: item.angle, radius: item.fromGround ? window.BASE_RADIUS : window.DOME_RADIUS, born: now, color: powerup.color });
        return !hit;
    });
    // Crear efectos visuales de las ráfagas
    for (let i = 0; i < bursts; i++) {
        effects.nailBursts.push({ born: now + i * 160, count: nailCount, color: powerup.color });
    }
}

// Duplicar todos los rubies visibles (efecto del nivel 6 del Espejo de Rubies)
function duplicateVisibleRubies() {
    const clones = (window.rubies || []).map(ruby => ({
        ...ruby,
        angle: ruby.angle + 0.08, // Pequeño offset
        pulse: (ruby.pulse || 0) + Math.PI // Diferente fase de pulso
    }));
    window.rubies.push(...clones);
}

// Convertir todos los obstáculos en pantalla en monedas o gemas (Lluvia de Oro)
// level: Nivel del powerup (afecta probabilidad de gemas)
function convertObstaclesToRewards(level) {
    const effects = window.powerupEffects;
    const gemChance = getPowerupById('tierra').effect.gemChance[Math.max(0, level - 1)] || 0; // Probabilidad de gemas
    const converted = [...(window.obstacles || [])];
    converted.forEach(obstacle => {
        const radius = getObstacleRewardRadius(obstacle);
        // Convertir en gema o moneda según probabilidad
        if (Math.random() < gemChance) {
            window.rubies.push({ angle: obstacle.angle, radius, life: 360, pulse: 0 });
        } else {
            window.deadCoins.push({ angle: obstacle.angle, radius, life: 300, pulse: 0, golden: true });
        }
        effects.popBursts.push({ angle: obstacle.angle, radius, born: performance.now(), color: '#FFD700' });
    });
    window.obstacles = [];
}

// Obtener el radio donde aparecerá la recompensa de un obstáculo
// obstacle: Objeto del obstáculo
// Retorna el radio en píxeles
function getObstacleRewardRadius(obstacle) {
    const fromGround = obstacle?.fromGround;
    return fromGround ? window.BASE_RADIUS + 30 : window.DOME_RADIUS - 34;
}

// Actualizar todos los efectos de powerups activos (llamado cada frame)
// Maneja timers, animaciones y efectos continuos
function updatePowerups() {
    if (!window.powerupEffects) return;
    const now = performance.now();
    const effects = window.powerupEffects;

    // Actualizar slots de powerups
    window.activePowerupSlots?.forEach(slot => {
        if (slot.active && now - slot.startedAt >= slot.duration) slot.active = false;
        if (slot.flash > 0) slot.flash -= 0.05;
    });

    // Activar aturdimiento después de sobrecarga
    if (effects.overloadStunQueued && now > (effects.overloadUntil || 0)) {
        effects.overloadStunUntil = now + effects.overloadStunQueued;
        effects.overloadStunQueued = 0;
    }
    // Limpiar efectos expirados
    if (effects.lethalZone && now > effects.lethalZone.expiresAt) effects.lethalZone = null;
    if (effects.rewind && now > effects.rewind.expiresAt) effects.rewind = null;
    effects.repulseWaves = (effects.repulseWaves || []).filter(wave => now - wave.born < 720);
    effects.nailBursts = (effects.nailBursts || []).filter(burst => now - burst.born < 620);
    // Desvanecer clon vinculado
    if (effects.linkedClone && now > effects.linkedClone.expiresAt) {
        effects.linkedClone.fading = (effects.linkedClone.fading || 0) + 0.05;
        if (effects.linkedClone.fading >= 1) effects.linkedClone = null;
    }
    // Limpiar marcas de teletransporte expiradas
    Object.keys(effects.teleport || {}).forEach(key => {
        if (now > effects.teleport[key].expiresAt) delete effects.teleport[key];
    });
    effects.popBursts = (effects.popBursts || []).filter(pop => now - pop.born < 520);
    if (effects.dramaFlash > 0) effects.dramaFlash -= 0.025;

    // Actualizar efectos continuos
    updateMagnetEffect();
    updateBubbleEffect();
    updateShadowClone();
    updateLinkedClone();
}

// Actualizar el efecto del imán (atrae monedas y gemas hacia el jugador)
function updateMagnetEffect() {
    const effects = window.powerupEffects;
    const now = performance.now();
    // Verificar si el imán está activo (también funciona con clon sombra y burbuja)
    const active = now < (effects.magnetUntil || 0) || effects.shadowClone?.attractCoins || now < (effects.bubbleUntil || 0);
    if (!active) return;
    const range = now < (effects.magnetUntil || 0) ? effects.magnetRange : 110;
    const playerRadius = window.BASE_RADIUS + window.offset;
    // Función para atraer y recolectar items
    const pullCollection = (items, isGem = false) => {
        for (let i = items.length - 1; i >= 0; i--) {
            const item = items[i];
            let rel = ((item.angle + window.worldRotation - window.angle + Math.PI * 2) % (Math.PI * 2));
            if (rel > Math.PI) rel -= Math.PI * 2;
            const arcDistance = Math.abs(rel) * Math.max(item.radius, 1);
            const radialDistance = Math.abs(playerRadius - item.radius);
            // Si está en rango, atraer hacia el jugador
            if (range >= 9999 || Math.hypot(arcDistance, radialDistance) < range) {
                item.angle += (window.angle - window.worldRotation - item.angle) * 0.14;
                item.radius += (playerRadius - item.radius) * 0.12;
                // Si está muy cerca, recolectar
                if (Math.abs(rel) < 0.08 && radialDistance < 20) {
                    if (isGem) {
                        const gain = Math.max(1, Math.round(effects.gemMultiplier || 1));
                        window.playerData.gems += gain;
                        localStorage.setItem('gems', window.playerData.gems);
                    } else {
                        // Verificar si está activo el espejo de rubies
                        if (performance.now() < (effects.rubyMirrorUntil || 0)) {
                            const gain = Math.max(1, Math.round(effects.gemMultiplier || 1));
                            window.playerData.gems += gain;
                            localStorage.setItem('gems', window.playerData.gems);
                        } else {
                            const bonus = range >= 9999 && Math.random() < 0.18 ? 2 : 1;
                            window.playerData.deadCoins += bonus;
                            localStorage.setItem('deadCoins', window.playerData.deadCoins);
                        }
                    }
                    items.splice(i, 1);
                }
            }
        }
    };
    pullCollection(window.deadCoins || [], false);
    pullCollection(window.rubies || [], true);
}

// Actualizar el efecto de la burbuja fantasma (rebota obstáculos)
function updateBubbleEffect() {
    const effects = window.powerupEffects;
    if (performance.now() > (effects.bubbleUntil || 0)) return;
    const playerRadius = window.BASE_RADIUS + window.offset;
    // Empujar obstáculos cerca del jugador
    (window.obstacles || []).forEach(obstacle => {
        let rel = ((obstacle.angle + window.worldRotation - window.angle + Math.PI * 2) % (Math.PI * 2));
        if (rel > Math.PI) rel -= Math.PI * 2;
        const radius = getObstacleRewardRadius(obstacle);
        if (Math.abs(rel) < 0.28 && Math.abs(radius - playerRadius) < 65) {
            obstacle.angle += Math.sign(rel || 1) * 0.04;
            obstacle.progress = Math.max(0.15, obstacle.progress - 0.025);
        }
    });
}

// Actualizar el clon sombra (absorbe golpes)
function updateShadowClone() {
    const clone = window.powerupEffects?.shadowClone;
    if (!clone) return;
    // Seguir al jugador antes de separarse
    if (!clone.fading && performance.now() < clone.splitAt) {
        clone.angle = window.angle;
        clone.offset = window.offset;
    }
    // Desvanecer después de separarse
    if (clone.fading) {
        clone.fading += 0.04;
        if (clone.fading >= 1) window.powerupEffects.shadowClone = null;
    }
}

// Actualizar el clon vinculado (Super Vínculo)
// Clon a 180° que recolecta recompensas x3 pero puede quitar vida si choca
function updateLinkedClone() {
    const effects = window.powerupEffects;
    const clone = effects?.linkedClone;
    if (!clone || clone.fading) return;
    // El clon siempre está a 180° del jugador
    clone.angle = window.angle + Math.PI;
    clone.offset = window.offset;
    const cloneRadius = window.BASE_RADIUS + clone.offset;
    // Recolectar items con el clon
    collectLinkedCloneItems(window.deadCoins || [], false, clone, cloneRadius);
    collectLinkedCloneItems(window.rubies || [], true, clone, cloneRadius);
    // Verificar si el clon choca con obstáculos
    if (linkedCloneHitsObstacle(clone, cloneRadius)) {
        clone.fading = 0.05;
        // Si no es seguro, quitar vida al jugador
        if (!clone.safe) {
            window.lives = Math.max(0, window.lives - 1);
            window.hitFlash = 1;
            window.invulnerable = true;
            window.invulnerableTimer = 55;
            if (window.lives <= 0) window.showGameOverWithRevive?.();
        }
    }
}

// Recolectar items con el clon vinculado
// items: Array de items (monedas o gemas)
// isGem: true si son gemas, false si son monedas
// clone: Objeto del clon
// cloneRadius: Radio del clon
function collectLinkedCloneItems(items, isGem, clone, cloneRadius) {
    for (let i = items.length - 1; i >= 0; i--) {
        const item = items[i];
        let rel = ((item.angle + window.worldRotation - clone.angle + Math.PI * 2) % (Math.PI * 2));
        if (rel > Math.PI) rel -= Math.PI * 2;
        // Si el item está cerca del clon, recolectar con multiplicador
        if (Math.abs(rel) < 0.08 && Math.abs(cloneRadius - item.radius) < 22) {
            const gain = Math.max(1, Math.round(clone.multiplier || 3));
            if (isGem) {
                window.playerData.gems += gain;
                localStorage.setItem('gems', window.playerData.gems);
            } else {
                window.playerData.deadCoins += gain;
                localStorage.setItem('deadCoins', window.playerData.deadCoins);
            }
            items.splice(i, 1);
        }
    }
}

// Verificar si el clon vinculado choca con algún obstáculo
// clone: Objeto del clon
// cloneRadius: Radio del clon
// Retorna true si hay colisión
function linkedCloneHitsObstacle(clone, cloneRadius) {
    // Verificar colisión con spikes
    const hitsSpike = (window.obstacles || []).some(o => {
        if (o.warning || o.progress < 0.9) return false;
        let rel = ((o.angle + window.worldRotation - clone.angle + Math.PI * 2) % (Math.PI * 2));
        if (rel > Math.PI) rel -= Math.PI * 2;
        if (Math.abs(rel) > o.width * 0.75) return false;
        const baseR = getObstacleBaseRadius(o.fromGround);
        const from = o.fromGround ? baseR : baseR - o.height * o.progress;
        const to = o.fromGround ? baseR + o.height * o.progress : baseR;
        return cloneRadius > from - 5 && cloneRadius < to + 5;
    });
    if (hitsSpike) return true;
    // Verificar colisión con sierras
    return (window.sierras || []).some(s => {
        if (s.warning || s.state !== 'moving') return false;
        const sr = s.fromGround ? window.BASE_RADIUS : window.DOME_RADIUS;
        let rel = ((s.angle + window.worldRotation - clone.angle + Math.PI * 2) % (Math.PI * 2));
        if (rel > Math.PI) rel -= Math.PI * 2;
        return Math.abs(rel) < 0.15 && Math.abs(cloneRadius - sr) < s.size * 0.8;
    });
}

// Intentar absorber un golpe usando powerups defensivos
// Retorna true si el golpe fue absorbido
function absorbPowerupHit() {
    const effects = window.powerupEffects || {};
    // Si es invulnerable por algún powerup, absorber
    if (isPowerupInvulnerable()) return true;
    // Si tiene rebobinado y va a morir, rebobinar
    if (effects.rewind && window.lives <= 1) {
        triggerRewindReturn(effects.rewind);
        effects.rewind = null;
        return true;
    }
    // Si tiene clon sombra con hits, usar un hit
    if (effects.shadowClone?.hits > 0) {
        effects.shadowClone.hits -= 1;
        effects.shadowClone.fading = 0.05;
        window.hitFlash = 0.8;
        return true;
    }
    // Si tiene ángel guardián, revivir
    if (effects.guardian) {
        triggerGuardianRevive(effects.guardian);
        effects.guardian = null;
        return true;
    }
    return false;
}

// Activar el retorno del rebobinado (volver al estado guardado)
// snapshot: Estado guardado del jugador
function triggerRewindReturn(snapshot) {
    // Restaurar posición, velocidad, gravedad, timer y vidas
    window.angle = snapshot.angle;
    window.offset = snapshot.offset;
    window.vel = snapshot.vel || 0;
    window.gravity = snapshot.gravity || 1;
    window.gravityForce = window.gravity;
    window.gameTimer = snapshot.timer || 0;
    window.lives = Math.max(1, snapshot.lives || 1);
    // Dar invulnerabilidad temporal
    window.invulnerable = true;
    window.invulnerableTimer = 120;
    window.hitFlash = 1;
    window.powerupEffects.dramaFlash = 1;
    window.powerupEffects.stopUntil = Math.max(window.powerupEffects.stopUntil || 0, performance.now() + 650);
    window.playSfx?.('powerUp', 0.95);
}

// Activar el revive del Ángel Guardián
// guardian: Objeto del guardián con nivel y vidas
function triggerGuardianRevive(guardian) {
    // Restaurar vidas y dar invulnerabilidad
    window.lives = Math.max(window.lives, guardian.lives || 1);
    window.invulnerable = true;
    window.invulnerableTimer = 150;
    window.powerupEffects.dramaFlash = 1;
    window.hitFlash = 1;
    window.playSfx?.('powerUp', 0.95);
}

// Verificar si un ángulo está dentro de la zona letal (Destrucción Letal)
// angleValue: Ángulo a verificar
// Retorna true si está en la zona letal
function isAngleInsideLethalZone(angleValue) {
    const zone = window.powerupEffects?.lethalZone;
    if (!zone) return false;
    let rel = ((angleValue - zone.angle + Math.PI * 3) % (Math.PI * 2)) - Math.PI;
    return Math.abs(rel) < zone.arc / 2;
}

// Dibujar todos los efectos visuales de powerups en el mundo del juego
// ctx: Contexto del canvas
// cx, cy: Coordenadas del centro
function drawPowerupWorldEffects(ctx, cx, cy) {
    const effects = window.powerupEffects || {};
    const now = performance.now();
    // Dibujar cada efecto
    drawLethalZone(ctx, cx, cy, effects);
    drawTeleportMarkers(ctx, cx, cy, effects);
    drawRepulseWaves(ctx, cx, cy, effects);
    drawNailBursts(ctx, cx, cy, effects);
    drawPowerupPopBursts(ctx, cx, cy, effects);
    drawShadowClone(ctx, cx, cy, effects);
    drawLinkedClone(ctx, cx, cy, effects);
    drawPlayerAuras(ctx, cx, cy, effects, now);
    // Flash dramático (para revives, etc)
    if (effects.dramaFlash > 0) {
        ctx.save();
        ctx.fillStyle = `rgba(75,192,235,${effects.dramaFlash * 0.28})`;
        ctx.fillRect(0, 0, window.canvas.width, window.canvas.height);
        ctx.restore();
    }
}

// Dibujar las ondas repulsoras (Onda Repulsora)
// ctx: Contexto del canvas
// cx, cy: Coordenadas del centro
// effects: Objeto de efectos de powerups
function drawRepulseWaves(ctx, cx, cy, effects) {
    (effects.repulseWaves || []).forEach(wave => {
        const life = Math.min(1, (performance.now() - wave.born) / 720);
        ctx.save();
        ctx.globalAlpha = 1 - life;
        ctx.strokeStyle = wave.color || '#E65100';
        ctx.shadowColor = wave.color || '#E65100';
        ctx.shadowBlur = 24;
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.arc(cx, cy, window.BASE_RADIUS + (window.DOME_RADIUS - window.BASE_RADIUS) * life, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
    });
}

// Dibujar las ráfagas de clavos (Tormenta de Clavos)
// ctx: Contexto del canvas
// cx, cy: Coordenadas del centro
// effects: Objeto de efectos de powerups
function drawNailBursts(ctx, cx, cy, effects) {
    (effects.nailBursts || []).forEach(burst => {
        const elapsed = performance.now() - burst.born;
        if (elapsed < 0) return;
        const life = Math.min(1, elapsed / 620);
        const start = window.angle - window.worldRotation;
        ctx.save();
        ctx.strokeStyle = burst.color || '#D81B60';
        ctx.shadowColor = burst.color || '#D81B60';
        ctx.shadowBlur = 16;
        ctx.lineWidth = 4;
        ctx.globalAlpha = 1 - life * 0.6;
        // Dibujar cada clavo como una línea radial
        for (let i = 0; i < burst.count; i++) {
            const a = start + (Math.PI * 2 * i) / burst.count + window.worldRotation;
            const r1 = window.BASE_RADIUS + 18;
            const r2 = window.BASE_RADIUS + (window.DOME_RADIUS - window.BASE_RADIUS) * life;
            ctx.beginPath();
            ctx.moveTo(cx + Math.cos(a) * r1, cy + Math.sin(a) * r1);
            ctx.lineTo(cx + Math.cos(a) * r2, cy + Math.sin(a) * r2);
            ctx.stroke();
        }
        ctx.restore();
    });
}

// Dibujar la zona letal (Destrucción Letal)
// ctx: Contexto del canvas
// cx, cy: Coordenadas del centro
// effects: Objeto de efectos de powerups
function drawLethalZone(ctx, cx, cy, effects) {
    const zone = effects.lethalZone;
    if (!zone) return;
    ctx.save();
    ctx.beginPath();
    // Dibujar arco del anillo
    ctx.arc(cx, cy, window.DOME_RADIUS, zone.angle - zone.arc / 2 + window.worldRotation, zone.angle + zone.arc / 2 + window.worldRotation);
    ctx.arc(cx, cy, window.BASE_RADIUS, zone.angle + zone.arc / 2 + window.worldRotation, zone.angle - zone.arc / 2 + window.worldRotation, true);
    ctx.closePath();
    ctx.fillStyle = 'rgba(237,33,33,0.18)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(237,33,33,0.65)';
    ctx.lineWidth = 4;
    ctx.stroke();
    ctx.restore();
}

// Dibujar las marcas de teletransporte (Punto de Teletransporte)
// ctx: Contexto del canvas
// cx, cy: Coordenadas del centro
// effects: Objeto de efectos de powerups
function drawTeleportMarkers(ctx, cx, cy, effects) {
    Object.values(effects.teleport || {}).forEach(marker => {
        const x = cx + Math.cos(marker.angle) * (window.BASE_RADIUS + marker.offset);
        const y = cy + Math.sin(marker.angle) * (window.BASE_RADIUS + marker.offset);
        ctx.save();
        ctx.strokeStyle = 'rgba(59,40,158,0.95)';
        ctx.shadowColor = '#3B289E';
        ctx.shadowBlur = 18;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(x, y, 22 + Math.sin(performance.now() * 0.008) * 4, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
    });
}

// Dibujar los efectos de pop (explosiones visuales)
// ctx: Contexto del canvas
// cx, cy: Coordenadas del centro
// effects: Objeto de efectos de powerups
function drawPowerupPopBursts(ctx, cx, cy, effects) {
    (effects.popBursts || []).forEach(pop => {
        const life = Math.min(1, (performance.now() - pop.born) / 520);
        const x = cx + Math.cos(pop.angle + window.worldRotation) * pop.radius;
        const y = cy + Math.sin(pop.angle + window.worldRotation) * pop.radius;
        ctx.save();
        ctx.globalAlpha = 1 - life;
        ctx.strokeStyle = pop.color;
        ctx.lineWidth = 3;
        ctx.shadowColor = pop.color;
        ctx.shadowBlur = 14;
        ctx.beginPath();
        ctx.arc(x, y, 8 + life * 28, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
    });
}

// Dibujar el clon sombra (Sombra)
// ctx: Contexto del canvas
// cx, cy: Coordenadas del centro
// effects: Objeto de efectos de powerups
function drawShadowClone(ctx, cx, cy, effects) {
    const clone = effects.shadowClone;
    if (!clone) return;
    const split = performance.now() > clone.splitAt ? 0.18 : 0;
    const alpha = clone.fading ? Math.max(0, 1 - clone.fading) : 0.45;
    const x = cx + Math.cos(clone.angle + split) * (window.BASE_RADIUS + clone.offset);
    const y = cy + Math.sin(clone.angle + split) * (window.BASE_RADIUS + clone.offset);
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = '#0b0b12';
    ctx.shadowColor = '#ffffff';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(x, y, 17, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
}

// Dibujar el clon vinculado (Super Vínculo)
// ctx: Contexto del canvas
// cx, cy: Coordenadas del centro
// effects: Objeto de efectos de powerups
function drawLinkedClone(ctx, cx, cy, effects) {
    const clone = effects.linkedClone;
    if (!clone) return;
    const alpha = clone.fading ? Math.max(0, 1 - clone.fading) : 0.72;
    const x = cx + Math.cos(clone.angle) * (window.BASE_RADIUS + clone.offset);
    const y = cy + Math.sin(clone.angle) * (window.BASE_RADIUS + clone.offset);
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = '#FFB300';
    ctx.shadowColor = '#FFB300';
    ctx.shadowBlur = 18;
    ctx.beginPath();
    ctx.arc(x, y, 18, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.9)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x, y, 25 + Math.sin(performance.now() * 0.01) * 3, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
}

// Dibujar los auras del jugador (efectos visuales de powerups activos)
// ctx: Contexto del canvas
// cx, cy: Coordenadas del centro
// effects: Objeto de efectos de powerups
// now: Tiempo actual
function drawPlayerAuras(ctx, cx, cy, effects, now) {
    const playerRadius = window.BASE_RADIUS + window.offset;
    const x = cx + Math.cos(window.angle) * playerRadius;
    const y = cy + Math.sin(window.angle) * playerRadius;
    // Lista de auras con sus condiciones, colores y radios
    const activeAuras = [
        [now < (effects.invulnerableUntil || 0), '#AAE3D8', 26], // Protección
        [now < (effects.ghostUntil || 0), '#DEAAF0', 30], // Fantasma
        [now < (effects.chaosUntil || 0), `hsl(${(now / 8) % 360},100%,62%)`, 32], // Caos (multicolor)
        [now < (effects.bubbleUntil || 0), '#FF6EB4', 38], // Burbuja
        [now < (effects.overloadUntil || 0), '#F97316', 31], // Sobrecarga
        [now < (effects.zeroGravityUntil || 0), '#7CB342', 34], // Gravedad Cero
        [now < (effects.rubyMirrorUntil || 0), '#B11226', 36], // Espejo de Rubies
        [!!effects.rewind, '#00A896', 40] // Rebobinado
    ];
    // Dibujar cada aura activa
    activeAuras.forEach(([active, color, radius]) => {
        if (!active) return;
        ctx.save();
        ctx.strokeStyle = color;
        ctx.shadowColor = color;
        ctx.shadowBlur = 18;
        ctx.lineWidth = 3;
        ctx.globalAlpha = 0.85;
        ctx.beginPath();
        ctx.arc(x, y, radius + Math.sin(now * 0.01) * 3, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
    });
}

// Dibujar el HUD de powerups (los 2 slots en pantalla)
// ctx: Contexto del canvas
function drawPowerupHud(ctx) {
    if (!window.activePowerupSlots) return;
    const compact = !!window.compactHud;
    const isTouch = document.body.classList.contains('is-touch-device');
    
    // Obtener posición, tamaño y opacidad personalizados para móvil
    const powerupOffsetX = isTouch ? (parseInt(localStorage.getItem('powerupOffsetX') || '0')) : 0;
    const powerupOffsetY = isTouch ? (parseInt(localStorage.getItem('powerupOffsetY') || '0')) : 0;
    const powerupSize = isTouch ? (parseInt(localStorage.getItem('powerupSize') || '100') / 100) : 1;
    const powerupOpacity = isTouch ? (parseInt(localStorage.getItem('powerupOpacity') || '100') / 100) : 1;
    
    const hudX = compact ? 10 : 20;
    const hudW = compact ? 178 : 240;
    const baseX = hudX + hudW + 12 + powerupOffsetX;
    const y = Math.max(compact ? 22 : 34, window.canvas.height * (compact ? 0.035 : 0.08) + 14) + powerupOffsetY;
    const radius = (compact ? 22 : 29) * powerupSize;
    const gap = (compact ? 10 : 14) * powerupSize;
    const inventory = readPowerups();
    
    ctx.save();
    ctx.globalAlpha = powerupOpacity;
    
    // Dibujar cada slot
    window.activePowerupSlots.forEach((slot, index) => {
        const x = baseX + index * (radius * 2 + gap);
        const powerup = getPowerupById(slot.id);
        const state = slot.id ? inventory[slot.id] : null;
        drawPowerupHudCircle(ctx, x, y + radius, radius, slot, powerup, state);
    });
    
    // Dibujar indicador de combo
    drawComboIndicator(ctx, baseX + 2 * (radius * 2 + gap), y + radius, radius);
    
    ctx.restore();
}

// Dibujar un círculo del HUD de powerups (un slot)
// ctx: Contexto del canvas
// x, y: Posición del centro
// radius: Radio del círculo
// slot: Objeto del slot
// powerup: Objeto del powerup
// state: Estado del powerup (usos, etc)
function drawPowerupHudCircle(ctx, x, y, radius, slot, powerup, state) {
    const color = powerup?.color || '#777777';
    const uses = state?.usos || 0;
    const disabled = !powerup || uses <= 0;
    ctx.save();
    ctx.globalAlpha = disabled ? 0.48 : 1;
    ctx.fillStyle = disabled ? 'rgba(80,80,88,0.55)' : 'rgba(4,6,12,0.74)';
    ctx.strokeStyle = disabled ? 'rgba(160,160,170,0.35)' : color;
    ctx.shadowColor = disabled ? 'transparent' : color;
    ctx.shadowBlur = disabled ? 0 : 14 + (slot.flash || 0) * 18;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    // Dibujar icono del powerup
    if (powerup) {
        const img = powerupImages[powerup.id]?.icon;
        if (img?.complete && img.naturalWidth > 0) ctx.drawImage(img, x - radius * 0.54, y - radius * 0.54, radius * 1.08, radius * 1.08);
    }
    ctx.shadowBlur = 0;
    ctx.fillStyle = 'rgba(255,255,255,0.18)';
    ctx.font = `900 ${Math.max(12, radius * 0.58)}px Geom, monospace`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(slot.key, x, y);
    // Dibujar barra de duración si está activo
    if (slot.active && slot.duration > 0) {
        const p = Math.max(0, 1 - (performance.now() - slot.startedAt) / slot.duration);
        ctx.strokeStyle = color;
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.arc(x, y, radius + 5, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * p, false);
        ctx.stroke();
    }
    
    // Indicador de cooldown
    if (slot.cooldownUntil && performance.now() < slot.cooldownUntil) {
        const cooldownProgress = 1 - (slot.cooldownUntil - performance.now()) / (slot.cooldownDuration || 2000);
        ctx.strokeStyle = '#ff4d6d';
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.arc(x, y, radius + 8, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * cooldownProgress, false);
        ctx.stroke();
        ctx.setLineDash([]);
    }
    
    // Dibujar contador de usos
    ctx.fillStyle = disabled ? '#9a9a9a' : '#ffffff';
    ctx.beginPath();
    ctx.arc(x + radius * 0.62, y + radius * 0.62, radius * 0.38, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = disabled ? '#555' : '#111';
    ctx.font = `900 ${Math.max(10, radius * 0.42)}px monospace`;
    ctx.fillText(String(uses), x + radius * 0.62, y + radius * 0.64);
    ctx.restore();
    
    // Guardar área del HUD para detección de clics
    slot.hudArea = { x, y, radius };
}

// Dibujar el indicador de combo en el HUD
// ctx: Contexto del canvas
// x, y: Posición del centro
// radius: Radio del indicador
function drawComboIndicator(ctx, x, y, radius) {
    const combo = window.comboSystem || { currentCombo: 0, comboMultiplier: 1 };
    if (combo.currentCombo <= 0) return;

    ctx.save();

    // Círculo de fondo
    ctx.fillStyle = 'rgba(255, 215, 0, 0.15)';
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Contador de combo
    ctx.fillStyle = '#FFD700';
    ctx.font = `900 ${Math.max(14, radius * 0.7)}px Geom, monospace`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`x${combo.currentCombo || 0}`, x, y - 4);

    // Multiplicador
    ctx.fillStyle = 'rgba(255, 215, 0, 0.8)';
    ctx.font = `700 ${Math.max(10, radius * 0.45)}px monospace`;
    ctx.fillText(`${(combo.comboMultiplier || 1).toFixed(1)}x`, x, y + 12);

    ctx.restore();
}

// Mostrar el panel de selección de powerups antes de empezar un nivel
// levelIndex: Índice del nivel
// onDone: Callback cuando se completa la selección
function showPowerupSelection(levelIndex, onDone) {
    readPowerups();
    let overlay = document.getElementById('powerupSelectionOverlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'powerupSelectionOverlay';
        document.body.appendChild(overlay);
    }
    const inventory = readPowerups();
    const owned = POWERUPS_DATA.filter(powerup => inventory[powerup.id]?.desbloqueado);
    const usable = owned.filter(powerup => inventory[powerup.id].usos > 0);
    const recommended = POWERUPS_DATA.filter(powerup => !inventory[powerup.id]?.desbloqueado).sort(() => Math.random() - 0.5).slice(0, owned.length ? 2 : 3);
    const vip = POWERUPS_DATA.filter(powerup => powerup.buy.gems >= 14).sort(() => Math.random() - 0.5)[0] || POWERUPS_DATA[0];
    const selected = [];

    // Función para renderizar una tarjeta de powerup
    const renderPick = powerup => {
        const state = inventory[powerup.id];
        const selectable = state?.desbloqueado && state.usos > 0;
        const classes = ['powerup-pick-card'];
        if (state?.desbloqueado) {
            classes.push(state.usos > 0 ? 'owned' : 'owned-zero-uses');
        } else {
            classes.push('locked');
        }
        if (selected.includes(powerup.id)) classes.push('selected');
        return `
            <button class="${classes.join(' ')}" style="--powerup-color:${powerup.color}" data-powerup="${powerup.id}" type="button" ${selectable ? '' : 'data-buyable="true"'}>
                <img src="assets/powerups/icons/${powerup.id}.png" alt="">
                <strong>${powerup.name}</strong>
                <span>Nivel ${Math.max(1, state?.nivel || 1)} · x${state?.usos || 0}</span>
            </button>
        `;
    };

    // Función para redibujar el panel
    const redraw = () => {
        const main = usable.length
            ? usable
            : recommended;
        overlay.innerHTML = `
            <section class="powerup-selection-panel">
                <div class="powerup-selection-head">
                    <div>
                        <span>POTENCIADORES</span>
                        <h2>Elige hasta 2</h2>
                    </div>
                    <button id="powerupSelectionStart" type="button">EMPEZAR</button>
                </div>
                <div class="powerup-pick-grid">
                    ${recommended.slice(0, 1).map(renderPick).join('')}
                    ${main.map(renderPick).join('')}
                    ${recommended.slice(1).map(renderPick).join('')}
                </div>
                <div class="powerup-vip-feature" style="--powerup-color:${vip.color}" data-powerup="${vip.id}">
                    <img src="assets/powerups/icons/${vip.id}.png" alt="">
                    <div><b>VIP destacado</b><span>${vip.name} · ${renderPowerupPrice(vip, 'vip')}</span></div>
                    <button type="button">Comprar</button>
                </div>
            </section>
        `;
        // Manejar clics en tarjetas de powerups
        overlay.querySelectorAll('.powerup-pick-card').forEach(button => {
            button.onclick = () => {
                const id = button.dataset.powerup;
                if (button.dataset.buyable) {
                    buyPowerup(id, 'normal');
                    showPowerupSelection(levelIndex, onDone);
                    return;
                }
                const idx = selected.indexOf(id);
                if (idx >= 0) selected.splice(idx, 1);
                else if (selected.length < 2) selected.push(id);
                redraw();
            };
        });
        // Manejar clic en VIP destacado
        overlay.querySelector('.powerup-vip-feature')?.addEventListener('click', () => {
            buyPowerup(vip.id, 'vip');
            showPowerupSelection(levelIndex, onDone);
        });
        // Manejar botón de empezar
        overlay.querySelector('#powerupSelectionStart').onclick = () => {
            setEquippedPowerups(selected);
            overlay.classList.remove('showing');
            setTimeout(() => {
                overlay.style.display = 'none';
                setTimeout(onDone, 650);
            }, 220);
        };
    };
    overlay.style.display = 'grid';
    overlay.classList.add('showing');
    redraw();
}

// Renderizar el precio de un powerup como texto
// powerup: Objeto del powerup
// source: 'normal' o 'vip'
// Retorna string con precio y moneda
function renderPowerupPrice(powerup, source = 'normal') {
    const currency = source === 'vip' ? 'gems' : (powerup.normalCurrency || 'coins');
    const amount = currency === 'gems'
        ? (source === 'vip' ? Math.max(1, Math.ceil((powerup.buy.coins || powerup.buy.gems * 30) / 30)) : powerup.buy.gems)
        : powerup.buy.coins;
    return `${amount} ${currency === 'gems' ? 'rubies' : 'monedas'}`;
}

// IDs de powerups disponibles en la tienda normal
const NORMAL_SHOP_POWERUP_IDS = ['burbuja', 'sobrecarga', 'camara_lenta', 'tierra', 'angel_guardian', 'sombra', 'dash', 'onda_repulsora', 'rebobinado', 'espejo_rubies', 'gravedad_cero', 'tormenta_clavos', 'super_vinculo'];
// Etiquetas para las categorías de powerups
const POWERUP_CATEGORY_LABELS = {
    all: 'Todos',
    defensivo: 'Proteccion',
    control: 'Ofensiva / Tiempo',
    utilidad: 'Economia',
    riesgo: 'Alto riesgo'
};

// Obtener la lista de powerups para la tienda
// mode: 'normal' o 'vip'
// filterType: Tipo de filtro ('all', 'defensivo', 'control', 'utilidad', 'riesgo')
// Retorna array de powerups filtrados
function getPowerupShopList(mode = 'normal', filterType = 'all') {
    const source = mode === 'normal'
        ? [
            ...NORMAL_SHOP_POWERUP_IDS.map(id => getPowerupById(id)).filter(Boolean),
            ...POWERUPS_DATA.filter(powerup => !NORMAL_SHOP_POWERUP_IDS.includes(powerup.id))
        ]
        : POWERUPS_DATA;
    return filterType === 'all'
        ? source
        : source.filter(powerup => (powerup.type || 'utilidad') === filterType);
}

// Verificar si un powerup está disponible directamente en la tienda normal
// powerup: Objeto del powerup
// Retorna true si está en la tienda normal
function isNormalShopDirectPowerup(powerup) {
    return NORMAL_SHOP_POWERUP_IDS.includes(powerup?.id);
}

// Renderizar la tienda de powerups
// container: Elemento contenedor
// mode: 'normal' o 'vip'
// filterType: Tipo de filtro
function renderPowerupsShop(container, mode = 'normal', filterType = 'all') {
    readPowerups();
    const targetId = mode === 'vip' ? 'vipContent' : 'shopContent';
    const filteredPowerups = getPowerupShopList(mode, filterType);
    const filters = ['all', 'defensivo', 'control', 'utilidad', 'riesgo'];

    container.innerHTML = `
        <div class="powerup-shop-title">
            <button onclick="${mode === 'vip' ? 'renderVIPHome()' : "showShopSection('home')"}" type="button">VOLVER</button>
            <span>${mode === 'vip' ? 'POTENCIADORES VIP' : 'POTENCIADORES'}</span>
        </div>
        <div class="${mode === 'vip' ? 'powerup-vip-stage' : 'powerup-normal-stage'}">
            <div class="powerup-filter-buttons">
                ${filters.map(filter => `
                    <button class="filter-btn ${filterType === filter ? 'active' : ''}" onclick="renderPowerupsShop(document.getElementById('${targetId}'), '${mode}', '${filter}')" type="button">${POWERUP_CATEGORY_LABELS[filter]}</button>
                `).join('')}
            </div>
            <div class="powerup-shop-grid ${mode === 'vip' ? 'vip' : 'normal'}">
                ${filteredPowerups.map(powerup => renderPowerupShopCard(powerup, mode)).join('')}
            </div>
        </div>
        <div id="${mode === 'vip' ? 'vipPowerupDetail' : 'normalPowerupDetail'}" class="powerup-detail-slot"></div>
    `;
}

function renderPowerupShopCard(powerup, mode) {
    const state = getPowerupLevelState(powerup.id);
    const shapeClass = mode === 'vip' ? 'hex' : 'rect';
    return `
        <button class="powerup-shop-card ${shapeClass}" style="--powerup-color:${powerup.color}" onclick="openPowerupDetail('${powerup.id}','${mode}')" type="button">
            <img src="assets/powerups/icons/${powerup.id}.png" alt="">
            <b>${powerup.name}</b>
            <span>${state.desbloqueado ? `Nivel ${Math.max(1, state.nivel)} · x${state.usos}` : 'Bloqueado'}</span>
        </button>
    `;
}

function openPowerupDetail(id, mode = 'normal', selectedLevel = 1) {
    const powerup = getPowerupById(id);
    if (!powerup) return;
    const state = getPowerupLevelState(id);
    const detail = document.getElementById(mode === 'vip' ? 'vipPowerupDetail' : 'normalPowerupDetail');
    if (!detail) return;
    const maxLevel = powerup.maxLevel || POWERUP_MAX_LEVEL;
    const selected = Math.max(1, Math.min(maxLevel, selectedLevel));
    const buyText = state.desbloqueado ? `COMPRAR USO ${renderPowerupPrice(powerup, mode)}` : `DESBLOQUEAR ${renderPowerupPrice(powerup, mode)}`;
    const upgradeCost = powerup.upgrade[Math.max(0, (state.nivel || 1))] || 0;
    detail.innerHTML = `
        <section class="powerup-detail-hex" style="--powerup-color:${powerup.color}">
            <div class="powerup-detail-top">
                <img src="assets/powerups/icons/${powerup.id}.png" alt="">
                <div>
                    <strong>${powerup.name}</strong>
                    <span>${state.desbloqueado ? 'Desbloqueado' : 'Bloqueado'} · x${state.usos}</span>
                </div>
            </div>
            <p>${selected === 1 ? powerup.base : `Nivel ${selected}: ${powerup.levels[selected - 1] || powerup.base}`}</p>
            <div class="powerup-level-row">
                ${Array.from({ length: POWERUP_MAX_LEVEL }, (_, idx) => {
                    const level = idx + 1;
                    const disabled = level > maxLevel;
                    return `<button class="${level === selected ? 'active' : ''}" onclick="openPowerupDetail('${id}','${mode}',${level})" ${disabled ? 'disabled' : ''} type="button">${level}</button>`;
                }).join('')}
            </div>
            <div class="powerup-detail-actions">
                ${mode === 'normal' && powerup.normalCurrency === 'vip'
                    ? `<button class="vip-jump" onclick="openVIP(); renderVIPPowerups();" type="button">Ir a tienda VIP</button>`
                    : `<button onclick="buyPowerup('${id}','${mode}')" type="button">${buyText}</button>`}
                ${mode === 'vip'
                    ? `<button onclick="upgradePowerup('${id}')" ${!state.desbloqueado || state.nivel >= maxLevel ? 'disabled' : ''} type="button">MEJORAR ${upgradeCost ? `${upgradeCost} RUBIES` : ''}</button>`
                    : `<button class="vip-jump" onclick="openVIP(); renderVIPPowerups();" type="button">Ir a tienda VIP</button>`}
            </div>
        </section>
    `;
}

function renderPowerupShopCard(powerup, mode) {
    const state = getPowerupLevelState(powerup.id);
    const isVipRedirect = mode === 'normal' && !isNormalShopDirectPowerup(powerup);
    const shapeClass = mode === 'vip' || isVipRedirect ? 'hex' : 'rect';
    const action = isVipRedirect
        ? `jumpToVIPPowerups('${powerup.id}')`
        : `openPowerupDetail('${powerup.id}','${mode}')`;
    return `
        <button class="powerup-shop-card ${shapeClass} ${isVipRedirect ? 'vip-redirect' : ''}" style="--powerup-color:${powerup.color}" onclick="${action}" type="button" ${isVipRedirect ? 'data-tooltip="¡dirigir a tienda VIP!"' : ''}>
            <img src="assets/powerups/icons/${powerup.id}.png" alt="">
            <b>${powerup.name}</b>
            <span>${isVipRedirect ? 'VIP' : state.desbloqueado ? `Nivel ${Math.max(1, state.nivel)} - x${state.usos}` : 'Bloqueado'}</span>
        </button>
    `;
}

// Obtener la descripción de un powerup según su nivel
// powerup: Objeto del powerup
// selected: Nivel seleccionado
// Retorna descripción del nivel
function getPowerupLevelDescription(powerup, selected) {
    return selected === 1 ? powerup.base : `Nivel ${selected}: ${powerup.levels[selected - 1] || powerup.base}`;
}

function openPowerupDetail(id, mode = 'normal', selectedLevel = 1) {
    const powerup = getPowerupById(id);
    if (!powerup) return;
    // Si es tienda normal y el powerup es VIP, redirigir
    if (mode === 'normal' && !isNormalShopDirectPowerup(powerup)) {
        jumpToVIPPowerups(id);
        return;
    }
    const state = getPowerupLevelState(id);
    const maxLevel = powerup.maxLevel || POWERUP_MAX_LEVEL;
    const selected = Math.max(1, Math.min(maxLevel, selectedLevel));
    const buyText = state.desbloqueado ? `COMPRAR ITEM ${renderPowerupPrice(powerup, mode)}` : `DESBLOQUEAR ${renderPowerupPrice(powerup, mode)}`;
    const upgradeCost = powerup.upgrade[Math.max(0, (state.nivel || 1))] || 0;
    const shouldUseModal = true;
    const modalClass = mode === 'vip' ? 'vip-modal-hex' : 'normal-modal-panel';
    const detailHTML = `
        <section class="powerup-detail-hex ${modalClass}" style="--powerup-color:${powerup.color}">
            <button class="powerup-detail-close" onclick="closePowerupDetailModal()" type="button">X</button>
            <div class="powerup-current-level">Nivel ${Math.max(1, state.nivel || 1)}</div>
            <div class="powerup-detail-top">
                <img src="assets/powerups/icons/${powerup.id}.png" alt="">
                <div>
                    <strong>${powerup.name}</strong>
                    <span>${state.desbloqueado ? 'Desbloqueado' : 'Bloqueado'} - x${state.usos}</span>
                </div>
            </div>
            <p>${getPowerupLevelDescription(powerup, selected)}</p>
            <div class="powerup-detail-actions">
                <button onclick="buyPowerup('${id}','${mode}')" type="button">${buyText}</button>
                <button onclick="upgradePowerup('${id}')" ${!state.desbloqueado || state.nivel >= maxLevel ? 'disabled' : ''} type="button">MEJORAR NIVEL ${upgradeCost ? `${upgradeCost} RUBIES` : ''}</button>
            </div>
            <div class="powerup-level-row">
                ${Array.from({ length: POWERUP_MAX_LEVEL }, (_, idx) => {
                    const level = idx + 1;
                    const disabled = level > maxLevel;
                    const owned = level <= Math.max(1, state.nivel || 1);
                    return `<button class="${level === selected ? 'active' : ''} ${owned ? 'lit' : ''}" onclick="openPowerupDetail('${id}','${mode}',${level})" ${disabled ? 'disabled' : ''} type="button">${level}</button>`;
                }).join('')}
            </div>
        </section>
    `;
    if (shouldUseModal) {
        showPowerupDetailModal(detailHTML);
        return;
    }
}

function showPowerupDetailModal(contentHTML) {
    let modal = document.getElementById('powerupDetailModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'powerupDetailModal';
        modal.className = 'powerup-detail-modal';
        modal.addEventListener('click', event => {
            if (event.target === modal) closePowerupDetailModal();
        });
        document.body.appendChild(modal);
    }
    modal.innerHTML = contentHTML;
    modal.style.display = 'grid';
}

function closePowerupDetailModal() {
    const modal = document.getElementById('powerupDetailModal');
    if (modal) modal.style.display = 'none';
}

function jumpToVIPPowerups(powerupId) {
    window.openVIP?.();
    renderVIPPowerups();
    setTimeout(() => {
        if (powerupId) openPowerupDetail(powerupId, 'vip');
    }, 30);
}

function renderVIPPowerups() {
    const content = document.getElementById('vipContent');
    if (content) renderPowerupsShop(content, 'vip');
}

function refreshPowerupShopViews() {
    const normal = document.getElementById('shopContent');
    const vip = document.getElementById('vipContent');
    if (normal && document.getElementById('normalPowerupDetail')) renderPowerupsShop(normal, 'normal');
    if (vip && document.getElementById('vipPowerupDetail')) renderPowerupsShop(vip, 'vip');
}

function showPowerupIntroModal() {
    const hasSeenIntro = localStorage.getItem('powerupIntroSeen') === 'true';
    if (hasSeenIntro) return;

    let modal = document.getElementById('powerupIntroModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'powerupIntroModal';
        modal.className = 'powerup-intro-modal';
        modal.innerHTML = `
            <div class="powerup-intro-content">
                <div class="powerup-intro-header">
                    <h2>¡POTENCIADORES!</h2>
                    <button class="powerup-intro-close" onclick="closePowerupIntroModal()">×</button>
                </div>
                <div class="powerup-intro-body">
                    <p>Bienvenido al sistema de potenciadores. Estos son poderes especiales que te ayudarán a sobrevivir más tiempo y ganar más recompensas.</p>
                    <div class="powerup-intro-features">
                        <div class="powerup-intro-feature">
                            <span class="powerup-intro-icon">🎯</span>
                            <h3>2 Slots</h3>
                            <p>Equipa hasta 2 potenciadores en los slots W y E</p>
                        </div>
                        <div class="powerup-intro-feature">
                            <span class="powerup-intro-icon">⚡</span>
                            <h3>Activa con Teclas</h3>
                            <p>Presiona W para el slot 1 y E para el slot 2</p>
                        </div>
                        <div class="powerup-intro-feature">
                            <span class="powerup-intro-icon">📈</span>
                            <h3>Sube de Nivel</h3>
                            <p>Mejora tus potenciadores para efectos más potentes</p>
                        </div>
                    </div>
                    <p class="powerup-intro-tip">💡 Tip: Algunos potenciadores son VIP y requieren rubíes para desbloquear.</p>
                </div>
                <div class="powerup-intro-footer">
                    <button class="powerup-intro-button" onclick="closePowerupIntroModal()">¡ENTENDIDO!</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }
    modal.style.display = 'flex';
    setTimeout(() => modal.classList.add('showing'), 10);
}

function closePowerupIntroModal() {
    const modal = document.getElementById('powerupIntroModal');
    if (modal) {
        modal.classList.remove('showing');
        setTimeout(() => modal.style.display = 'none', 300);
    }
    localStorage.setItem('powerupIntroSeen', 'true');
}

function showPowerupTooltip(slotIndex, powerup, state) {
    if (!powerup) return;
    
    let tooltip = document.getElementById('powerupTooltip');
    if (!tooltip) {
        tooltip = document.createElement('div');
        tooltip.id = 'powerupTooltip';
        tooltip.className = 'powerup-tooltip';
        document.body.appendChild(tooltip);
    }
    
    const level = Math.max(1, state?.nivel || 1);
    const uses = state?.usos || 0;
    const description = powerup.levels && powerup.levels[level - 1] ? powerup.levels[level - 1] : powerup.base;
    
    tooltip.innerHTML = `
        <div class="powerup-tooltip-header" style="--powerup-color:${powerup.color}">
            <img src="assets/powerups/icons/${powerup.id}.png" alt="">
            <div>
                <strong>${powerup.name}</strong>
                <span>Nivel ${level} · x${uses} usos</span>
            </div>
        </div>
        <div class="powerup-tooltip-body">
            <p>${description}</p>
        </div>
    `;
    
    const slot = window.activePowerupSlots?.[slotIndex];
    if (slot?.hudArea) {
        const { x, y, radius } = slot.hudArea;
        tooltip.style.left = `${x + radius + 15}px`;
        tooltip.style.top = `${y - radius}px`;
    }
    
    tooltip.style.display = 'block';
    tooltip.classList.add('showing');
}

function hidePowerupTooltip() {
    const tooltip = document.getElementById('powerupTooltip');
    if (tooltip) {
        tooltip.classList.remove('showing');
        setTimeout(() => tooltip.style.display = 'none', 150);
    }
}

function handlePowerupTooltipMouse(e) {
    if (!window.activePowerupSlots) return;
    
    const canvas = window.canvas;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    let hoveredSlot = null;
    
    window.activePowerupSlots.forEach((slot, index) => {
        if (!slot.hudArea) return;
        const { x, y, radius } = slot.hudArea;
        const dist = Math.sqrt((mouseX - x) ** 2 + (mouseY - y) ** 2);
        if (dist <= radius + 5) {
            hoveredSlot = index;
        }
    });
    
    if (hoveredSlot !== null) {
        const slot = window.activePowerupSlots[hoveredSlot];
        const powerup = getPowerupById(slot.id);
        const inventory = readPowerups();
        const state = inventory[slot.id];
        showPowerupTooltip(hoveredSlot, powerup, state);
    } else {
        hidePowerupTooltip();
    }
}

function showPowerupHelpPanel() {
    const panel = document.getElementById('powerupHelpPanel');
    const body = document.getElementById('powerupHelpBody');
    if (!panel || !body) return;
    
    const stats = getPowerupStats();
    const mostUsed = getMostUsedPowerup();
    
    body.innerHTML = POWERUPS_DATA.map(powerup => {
        const usageCount = stats[powerup.id] || 0;
        const isMostUsed = powerup.id === mostUsed;
        
        return `
        <div class="powerup-help-item ${isMostUsed ? 'most-used' : ''}" style="--powerup-color:${powerup.color}">
            <img src="assets/powerups/icons/${powerup.id}.png" alt="">
            <div class="powerup-help-info">
                <strong>${powerup.name} ${isMostUsed ? '⭐' : ''}</strong>
                <p>${powerup.base}</p>
                <div class="powerup-help-levels">
                    ${powerup.levels.map((level, idx) => `<span>Nivel ${idx + 1}: ${level}</span>`).join('')}
                </div>
                <div class="powerup-help-stats">
                    <span>Usos: ${usageCount}</span>
                </div>
            </div>
        </div>
    `;
    }).join('');
    
    panel.style.display = 'grid';
    panel.classList.add('showing');
}

function closePowerupHelpPanel() {
    const panel = document.getElementById('powerupHelpPanel');
    if (panel) {
        panel.classList.remove('showing');
        setTimeout(() => panel.style.display = 'none', 300);
    }
}

window.getPowerupById = getPowerupById;
window.readPowerups = readPowerups;
window.savePowerups = savePowerups;
window.getEquippedPowerups = getEquippedPowerups;
window.setEquippedPowerups = setEquippedPowerups;
window.createPowerupRuntime = createPowerupRuntime;
window.activatePowerupSlot = activatePowerupSlot;
window.updatePowerups = updatePowerups;
window.drawPowerupHud = drawPowerupHud;
window.drawPowerupWorldEffects = drawPowerupWorldEffects;
window.isPowerupInvulnerable = isPowerupInvulnerable;
window.getPowerupTimeScale = getPowerupTimeScale;
window.getPowerupSpeedFactor = getPowerupSpeedFactor;
window.isZeroGravityActive = isZeroGravityActive;
window.absorbPowerupHit = absorbPowerupHit;
window.isAngleInsideLethalZone = isAngleInsideLethalZone;
window.showPowerupSelection = showPowerupSelection;
window.renderPowerupsShop = renderPowerupsShop;
window.renderVIPPowerups = renderVIPPowerups;
window.openPowerupDetail = openPowerupDetail;
window.closePowerupDetailModal = closePowerupDetailModal;
window.jumpToVIPPowerups = jumpToVIPPowerups;
window.NORMAL_SHOP_POWERUP_IDS = NORMAL_SHOP_POWERUP_IDS;
window.buyPowerup = buyPowerup;
window.upgradePowerup = upgradePowerup;

function seedOwnerPowerups() {
    if (localStorage.getItem('ownerPowerupGrant_v2') === 'true') return;
    const inventory = readPowerups();
    POWERUPS_DATA.forEach(powerup => {
        const item = inventory[powerup.id];
        item.desbloqueado = true;
        item.nivel = Math.max(1, item.nivel || 1);
        item.usos = Math.max(20, item.usos || 0);
    });
    savePowerups(inventory);
    localStorage.setItem('ownerPowerupGrant_v2', 'true');
}

seedOwnerPowerups();
window.showPowerupIntroModal = showPowerupIntroModal;
window.closePowerupIntroModal = closePowerupIntroModal;
window.showPowerupTooltip = showPowerupTooltip;
window.hidePowerupTooltip = hidePowerupTooltip;
window.handlePowerupTooltipMouse = handlePowerupTooltipMouse;
window.showPowerupHelpPanel = showPowerupHelpPanel;
window.closePowerupHelpPanel = closePowerupHelpPanel;
window.incrementCombo = incrementCombo;
window.resetCombo = resetCombo;
window.getComboMultiplier = getComboMultiplier;
window.getComboXPBonus = getComboXPBonus;
window.saveComboStats = saveComboStats;
window.incrementPowerupUsage = incrementPowerupUsage;
window.getPowerupStats = getPowerupStats;
window.getMostUsedPowerup = getMostUsedPowerup;

readPowerups();
setEquippedPowerups(getEquippedPowerups());

// =====================================================
// STARTER PACK SYSTEM
// =====================================================

const STARTER_PACK_KEY = 'starterPackReceived';
const STARTER_PACK_POWERUPS = ['escudo', 'velocidad', 'magnetismo'];

function giveStarterPack() {
    const hasReceived = localStorage.getItem(STARTER_PACK_KEY) === 'true';
    if (hasReceived) return;
    
    const inventory = readPowerups();
    
    STARTER_PACK_POWERUPS.forEach(powerupId => {
        if (!inventory[powerupId]) {
            inventory[powerupId] = {
                nivel: 1,
                usos: 5,
                desbloqueado: true
            };
        } else {
            inventory[powerupId].usos += 5;
            inventory[powerupId].desbloqueado = true;
        }
    });
    
    savePowerups();
    localStorage.setItem(STARTER_PACK_KEY, 'true');
    
    // Mostrar notificación
    showStarterPackNotification();
}

function showStarterPackNotification() {
    const notification = document.createElement('div');
    notification.className = 'starter-pack-notification';
    notification.innerHTML = `
        <span class="starter-pack-icon">🎁</span>
        <div class="starter-pack-info">
            <strong>¡PACK DE INICIO!</strong>
            <span>Has recibido 3 potenciadores básicos</span>
        </div>
    `;
    document.body.appendChild(notification);
    notification.classList.add('showing');
    setTimeout(() => {
        notification.classList.remove('showing');
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

function checkStarterPack() {
    const hasReceived = localStorage.getItem(STARTER_PACK_KEY) === 'true';
    if (!hasReceived) {
        const inventory = readPowerups();
        const hasAnyPowerup = Object.values(inventory).some(p => p?.desbloqueado);
        
        // Dar pack si el jugador no tiene ningún potenciador
        if (!hasAnyPowerup) {
            giveStarterPack();
        }
    }
}

// Verificar pack de inicio al cargar
setTimeout(checkStarterPack, 2000);

window.giveStarterPack = giveStarterPack;
window.checkStarterPack = checkStarterPack;
