// =====================================================
// POWERUPS SYSTEM
// =====================================================

const POWERUP_STORAGE_KEY = 'powerups';
const POWERUP_SLOT_KEY = 'equippedPowerups';
const POWERUP_MAX_LEVEL = 6;

const POWERUPS_DATA = [
    {
        id: 'proteccion', name: 'Proteccion', color: '#AAE3D8', buy: { coins: 180, gems: 6 }, upgrade: [0, 8, 13, 20, 30, 48],
        base: 'Invulnerabilidad por 2 segundos.',
        levels: ['2.0s de escudo.', '2.4s de escudo.', '2.8s de escudo.', '3.2s de escudo.', '3.8s de escudo.', '2 escudos por activacion.'],
        effect: { duration: [2, 2.4, 2.8, 3.2, 3.8, 4.2] }
    },
    {
        id: 'fantasma', name: 'Fantasma', color: '#DEAAF0', buy: { coins: 240, gems: 8 }, upgrade: [0, 9, 15, 24, 36, 58],
        base: 'Atraviesas obstaculos por 3 segundos.',
        levels: ['3.0s intangible.', '3.5s intangible.', '4.0s intangible.', '4.6s intangible.', '5.2s intangible.', '2 usos por activacion.'],
        effect: { duration: [3, 3.5, 4, 4.6, 5.2, 5.8] }
    },
    {
        id: 'stop_time', name: 'Stop Time', color: '#B09C54', buy: { coins: 380, gems: 13 }, upgrade: [0, 14, 23, 36, 54, 84],
        base: 'Detiene todos los obstaculos por 5 segundos.',
        levels: ['5.0s de congelacion.', '5.6s de congelacion.', '6.2s de congelacion.', '6.8s de congelacion.', '7.5s de congelacion.', '2 usos por activacion.'],
        effect: { duration: [5, 5.6, 6.2, 6.8, 7.5, 8.2] }
    },
    {
        id: 'camara_lenta', name: 'Camara Lenta', color: '#D9C938', buy: { coins: 300, gems: 10 }, upgrade: [0, 12, 19, 30, 45, 70],
        base: 'Ralentiza intensamente el mundo alrededor del jugador.',
        levels: ['3.6s de ralentizacion.', '4.2s de ralentizacion.', '4.8s de ralentizacion.', '5.4s de ralentizacion.', '6.0s de ralentizacion.', '6.8s de ralentizacion.'],
        effect: { duration: [3.6, 4.2, 4.8, 5.4, 6, 6.8] }
    },
    {
        id: 'vida_extra', name: 'Vida Extra', color: '#DE21C8', buy: { coins: 520, gems: 18 }, upgrade: [0, 22, 34, 52, 76, 110],
        base: 'Ganas 1 vida extra al instante.',
        levels: ['+1 vida.', '+1 vida y escudo breve.', '+2 vidas.', '+2 vidas y escudo breve.', '+3 vidas.', '+3 vidas y escudo fuerte.'],
        effect: { lives: [1, 1, 2, 2, 3, 3] }
    },
    {
        id: 'destruccion_letal', name: 'Destruccion Letal', color: '#ED2121', buy: { coins: 720, gems: 24 }, upgrade: [0, 24, 40, 66, 96, 140],
        base: 'Un angulo de la esfera queda inactivo y sin spawns por 10 segundos.',
        levels: ['10s y angulo pequeno.', '11s y angulo mayor.', '12s y angulo mayor.', '13s y angulo amplio.', '14s y angulo amplio.', '15s y angulo letal.'],
        effect: { duration: [10, 11, 12, 13, 14, 15], arc: [0.5, 0.58, 0.66, 0.74, 0.82, 0.92] }
    },
    {
        id: 'caos', name: 'Caos', color: '#A16603', buy: { coins: 0, gems: 45 }, upgrade: [0, 34, 55, 86, 128, 190], normalCurrency: 'gems',
        base: 'La bola se vuelve multicolor, invencible, y ganas 1 vida extra.',
        levels: ['Invencible y +1 vida.', 'Invencible y +2 vidas.', 'Invencible y +2 vidas.', 'Invencible y +2 vidas.', 'Invencible y +3 vidas.', 'Invencible y +3 vidas extendido.'],
        effect: { duration: [5, 5.5, 6, 6.5, 7, 8], lives: [1, 2, 2, 2, 3, 3] }
    },
    {
        id: 'iman', name: 'Iman', color: '#FAFF00', buy: { coins: 220, gems: 8 }, upgrade: [0, 9, 15, 24, 36, 60],
        base: 'Atrae monedas en rango pequeno.',
        levels: ['Rango pequeno.', 'Rango medio.', 'Rango alto.', 'Rango muy alto.', 'Rango enorme.', 'Todo el mapa y algunas monedas duplicadas.'],
        effect: { duration: [7, 8, 9, 10, 11, 12], range: [95, 135, 180, 230, 290, 9999] }
    },
    {
        id: 'monedas_x2', name: 'Monedas x2', color: '#FFD700', buy: { coins: 650, gems: 22 }, upgrade: [0, 30, 52, 86, 130, 200],
        base: 'Duplica monedas recogidas durante esta partida.',
        levels: ['x2 monedas.', 'x3 monedas.', 'x3 monedas y gemas +1.', 'x4 monedas.', 'x5 monedas y gemas x2.', 'x5 monedas y gemas x3.'],
        effect: { duration: [999, 999, 999, 999, 999, 999], coins: [2, 3, 3, 4, 5, 5], gems: [1, 1, 1.2, 1.5, 2, 3] }
    },
    {
        id: 'angel_guardian', name: 'Angel Guardian', color: '#4BC0EB', buy: { coins: 880, gems: 30 }, upgrade: [0, 28, 48, 78, 118, 170],
        base: 'Al morir, congela la pantalla y revive con 1 vida.',
        levels: ['Revive con 1 vida.', 'Revive con 2 vidas.', 'Revive con 2 vidas y escudo.', 'Revive con 3 vidas.', 'Revive con 3 vidas y mas escudo.', 'Revive con 4 vidas.'],
        effect: { lives: [1, 2, 2, 3, 3, 4] }
    },
    {
        id: 'teletransporte', name: 'Teletransporte', color: '#3B289E', buy: { coins: 360, gems: 12 }, upgrade: [0, 16, 28, 0, 0, 0], maxLevel: 3,
        base: 'Primera pulsacion marca posicion, segunda pulsacion vuelve al punto.',
        levels: ['Marca y vuelve.', 'Marca dura mas tiempo.', 'Vuelve con escudo breve.', 'Nivel maximo 3.', 'Nivel maximo 3.', 'Nivel maximo 3.'],
        effect: { markerLife: [10, 14, 18] }
    },
    {
        id: 'sobrecarga', name: 'Sobrecarga', color: '#F97316', buy: { coins: 420, gems: 14 }, upgrade: [0, 14, 22, 34, 52, 82],
        base: 'Aumenta velocidad 40%, destruye obstaculos pequenos y termina con aturdimiento.',
        levels: ['Velocidad +40%.', 'Velocidad +45%.', 'Velocidad +50%.', 'Velocidad +55%.', 'Velocidad +60%.', 'Sin aturdimiento y destruye medianos.'],
        effect: { duration: [4, 4.6, 5.2, 5.8, 6.4, 7], speed: [1.4, 1.45, 1.5, 1.55, 1.6, 1.7], stun: [1.5, 1.25, 1, 0.75, 0.45, 0] }
    },
    {
        id: 'sombra', name: 'Sombra', color: '#2D2D2D', buy: { coins: 460, gems: 16 }, upgrade: [0, 16, 26, 42, 66, 98],
        base: 'Crea un clon que absorbe el proximo golpe fatal.',
        levels: ['Clon de 1s y 1 golpe.', 'Clon dura mas.', 'Absorbe 2 golpes.', 'Absorbe 2 golpes y dura mas.', 'Absorbe 2 golpes extendido.', 'El clon tambien atrae monedas.'],
        effect: { cloneDelay: [1, 1.3, 1.5, 1.8, 2, 2.2], hits: [1, 1, 2, 2, 2, 2] }
    },
    {
        id: 'tierra', name: 'Tierra', color: '#8B4513', buy: { coins: 500, gems: 17 }, upgrade: [0, 18, 30, 48, 72, 108],
        base: 'Convierte los obstaculos en pantalla en monedas doradas.',
        levels: ['Convierte obstaculos en monedas.', 'Mas monedas.', 'Algunos sueltan gemas.', 'Mas chance de gemas.', 'Gran pop dorado.', 'Alta chance de gemas.'],
        effect: { gemChance: [0, 0, 0.12, 0.18, 0.24, 0.32] }
    },
    {
        id: 'burbuja', name: 'Burbuja', color: '#FF6EB4', buy: { coins: 280, gems: 10 }, upgrade: [0, 12, 19, 30, 45, 70],
        base: 'Una burbuja rebota obstaculos durante 4 segundos sin recibir dano.',
        levels: ['4.0s de burbuja.', '4.6s de burbuja.', '5.2s de burbuja.', '5.8s de burbuja.', '6.4s de burbuja.', 'Empuja monedas hacia el jugador.'],
        effect: { duration: [4, 4.6, 5.2, 5.8, 6.4, 7] }
    }
];

const powerupImages = {};
const powerupImageCache = new Map();

function loadPowerupImage(powerupId, type = 'icon') {
    const cacheKey = `${powerupId}_${type}`;
    if (powerupImageCache.has(cacheKey)) {
        return powerupImageCache.get(cacheKey);
    }
    
    const img = new Image();
    img.loading = 'lazy';
    img.decoding = 'async';
    
    if (type === 'icon') {
        img.src = `assets/powerups/icons/${powerupId}.png`;
    } else {
        img.src = `assets/powerups/effects/${powerupId}_effect.png`;
    }
    
    powerupImageCache.set(cacheKey, img);
    
    if (!powerupImages[powerupId]) {
        powerupImages[powerupId] = {};
    }
    powerupImages[powerupId][type] = img;
    
    return img;
}

// Cargar solo las imágenes de iconos al inicio (lazy loading para efectos)
POWERUPS_DATA.forEach(powerup => {
    loadPowerupImage(powerup.id, 'icon');
    // Efectos se cargarán bajo demanda
});

window.POWERUPS_DATA = POWERUPS_DATA;

function getPowerupById(id) {
    return POWERUPS_DATA.find(powerup => powerup.id === id) || null;
}

function normalizePowerupsStore(raw = {}) {
    const next = {};
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

function readPowerups() {
    let parsed = {};
    try {
        parsed = JSON.parse(localStorage.getItem(POWERUP_STORAGE_KEY) || '{}') || {};
    } catch (error) {
        parsed = {};
    }
    const normalized = normalizePowerupsStore(parsed);
    localStorage.setItem(POWERUP_STORAGE_KEY, JSON.stringify(normalized));
    window.powerupsInventory = normalized;
    return normalized;
}

function savePowerups(inventory) {
    const normalized = normalizePowerupsStore(inventory);
    localStorage.setItem(POWERUP_STORAGE_KEY, JSON.stringify(normalized));
    window.powerupsInventory = normalized;
    return normalized;
}

function getEquippedPowerups() {
    try {
        const slots = JSON.parse(localStorage.getItem(POWERUP_SLOT_KEY) || '[]');
        return [slots[0] || null, slots[1] || null];
    } catch (error) {
        return [null, null];
    }
}

function setEquippedPowerups(slots) {
    const clean = [slots?.[0] || null, slots?.[1] || null];
    localStorage.setItem(POWERUP_SLOT_KEY, JSON.stringify(clean));
    window.equippedPowerups = clean;
    return clean;
}

function getPowerupLevelState(id) {
    const inventory = readPowerups();
    return inventory[id] || normalizePowerupsStore({})[id];
}

function getPowerupLevel(id) {
    return Math.max(1, getPowerupLevelState(id)?.nivel || 1);
}

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

// =====================================================
// POWERUP USAGE STATISTICS
// =====================================================

const POWERUP_STATS_KEY = 'powerupStats';

function incrementPowerupUsage(powerupId) {
    const stats = JSON.parse(localStorage.getItem(POWERUP_STATS_KEY) || '{}');
    stats[powerupId] = (stats[powerupId] || 0) + 1;
    localStorage.setItem(POWERUP_STATS_KEY, JSON.stringify(stats));
}

function getPowerupStats() {
    return JSON.parse(localStorage.getItem(POWERUP_STATS_KEY) || '{}');
}

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

function canAffordPowerup(amount, currency) {
    const key = currency === 'gems' ? 'gems' : 'deadCoins';
    return parseInt(localStorage.getItem(key) || '0', 10) >= amount;
}

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
    refreshPowerupShopViews();
    return true;
}

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
    return true;
}

function getPowerupDuration(id, level) {
    const powerup = getPowerupById(id);
    const duration = powerup?.effect?.duration;
    if (!duration) return 0;
    return duration[Math.max(0, Math.min(duration.length - 1, level - 1))] || 0;
}

function createPowerupRuntime(slots = getEquippedPowerups()) {
    window.activePowerupSlots = slots.map((id, index) => {
        const state = id ? getPowerupLevelState(id) : null;
        return {
            id,
            key: index === 0 ? 'W' : 'E',
            active: false,
            startedAt: 0,
            duration: 0,
            flash: 0,
            usesAtStart: state?.usos || 0
        };
    });
    window.powerupEffects = {
        invulnerableUntil: 0,
        ghostUntil: 0,
        stopUntil: 0,
        slowUntil: 0,
        magnetUntil: 0,
        magnetRange: 0,
        chaosUntil: 0,
        bubbleUntil: 0,
        overloadUntil: 0,
        overloadSpeed: 1,
        overloadStunUntil: 0,
        overloadStunFactor: 1,
        coinMultiplier: 1,
        gemMultiplier: 1,
        lethalZone: null,
        teleport: {},
        shadowClone: null,
        guardian: null,
        dramaFlash: 0,
        popBursts: []
    };
}

function isPowerupInvulnerable() {
    const now = performance.now();
    const effects = window.powerupEffects || {};
    return now < (effects.invulnerableUntil || 0) ||
        now < (effects.ghostUntil || 0) ||
        now < (effects.chaosUntil || 0) ||
        now < (effects.bubbleUntil || 0);
}

function getPowerupTimeScale() {
    const now = performance.now();
    const effects = window.powerupEffects || {};
    if (now < (effects.stopUntil || 0)) return 0;
    if (now < (effects.slowUntil || 0)) return 0.34;
    return 1;
}

function getPowerupSpeedFactor() {
    const now = performance.now();
    const effects = window.powerupEffects || {};
    if (now < (effects.overloadUntil || 0)) return effects.overloadSpeed || 1.4;
    if (now < (effects.overloadStunUntil || 0)) return effects.overloadStunFactor || 0.62;
    return 1;
}

// =====================================================
// COMBO SYSTEM
// =====================================================

const COMBO_STORAGE_KEY = 'comboSystem';

function initComboSystem() {
    window.comboSystem = {
        count: 0,
        multiplier: 1,
        lastDodgeTime: 0,
        maxCombo: 0,
        totalComboXP: 0
    };
}

function incrementCombo() {
    if (!window.comboSystem) initComboSystem();
    const now = performance.now();
    const comboTimeout = 3000; // 3 segundos para mantener combo
    
    if (now - window.comboSystem.lastDodgeTime < comboTimeout) {
        window.comboSystem.count++;
    } else {
        window.comboSystem.count = 1;
    }
    
    window.comboSystem.lastDodgeTime = now;
    window.comboSystem.multiplier = Math.min(5, 1 + Math.floor(window.comboSystem.count / 5) * 0.5);
    window.comboSystem.maxCombo = Math.max(window.comboSystem.maxCombo, window.comboSystem.count);
    
    return window.comboSystem.multiplier;
}

function resetCombo() {
    if (!window.comboSystem) initComboSystem();
    window.comboSystem.count = 0;
    window.comboSystem.multiplier = 1;
}

function getComboMultiplier() {
    if (!window.comboSystem) initComboSystem();
    const now = performance.now();
    const comboTimeout = 3000;
    
    if (now - window.comboSystem.lastDodgeTime > comboTimeout) {
        resetCombo();
    }
    
    return window.comboSystem.multiplier;
}

function getComboXPBonus() {
    if (!window.comboSystem) initComboSystem();
    return Math.floor(window.comboSystem.maxCombo * 10);
}

function saveComboStats() {
    if (!window.comboSystem) initComboSystem();
    window.comboSystem.totalComboXP += getComboXPBonus();
    localStorage.setItem(COMBO_STORAGE_KEY, JSON.stringify({
        maxCombo: window.comboSystem.maxCombo,
        totalComboXP: window.comboSystem.totalComboXP
    }));
}

function loadComboStats() {
    const saved = localStorage.getItem(COMBO_STORAGE_KEY);
    if (saved) {
        const data = JSON.parse(saved);
        if (!window.comboSystem) initComboSystem();
        window.comboSystem.totalComboXP = data.totalComboXP || 0;
    }
}

initComboSystem();
loadComboStats();

function activatePowerupSlot(slotIndex) {
    const slot = window.activePowerupSlots?.[slotIndex];
    if (!slot?.id || slot.active) return false;
    const powerup = getPowerupById(slot.id);
    const state = getPowerupLevelState(slot.id);
    if (!powerup || !state?.desbloqueado || state.usos <= 0) return false;

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
    
    // Set cooldown after duration
    if (duration > 0) {
        slot.cooldownDuration = 2000; // 2 seconds cooldown
        slot.cooldownUntil = performance.now() + slot.duration + slot.cooldownDuration;
    }
    
    return true;
}

function handleTeleportPowerup(slotIndex, powerup, state) {
    const effects = window.powerupEffects || {};
    const tp = effects.teleport[slotIndex] || null;
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
    window.angle = tp.angle;
    window.offset = tp.offset;
    window.vel = 0;
    delete effects.teleport[slotIndex];
    if ((state.nivel || 1) >= 3) {
        effects.invulnerableUntil = Math.max(effects.invulnerableUntil || 0, performance.now() + 1200);
    }
    window.hitFlash = 0.6;
    return true;
}

function runPowerupEffect(id, level, duration, slotIndex) {
    const now = performance.now();
    const effects = window.powerupEffects;
    const powerup = getPowerupById(id);
    const levelIdx = Math.max(0, level - 1);
    const until = now + duration * 1000;

    if (id === 'proteccion') effects.invulnerableUntil = Math.max(effects.invulnerableUntil || 0, until);
    if (id === 'fantasma') effects.ghostUntil = Math.max(effects.ghostUntil || 0, until);
    if (id === 'stop_time') effects.stopUntil = Math.max(effects.stopUntil || 0, until);
    if (id === 'camara_lenta') effects.slowUntil = Math.max(effects.slowUntil || 0, until);
    if (id === 'vida_extra') {
        window.lives += powerup.effect.lives[levelIdx] || 1;
        if (level >= 2) effects.invulnerableUntil = Math.max(effects.invulnerableUntil || 0, now + 900);
    }
    if (id === 'destruccion_letal') {
        effects.lethalZone = {
            angle: Math.random() * Math.PI * 2,
            arc: powerup.effect.arc[levelIdx] || 0.5,
            expiresAt: until
        };
    }
    if (id === 'caos') {
        window.lives += powerup.effect.lives[levelIdx] || 1;
        effects.chaosUntil = Math.max(effects.chaosUntil || 0, until);
    }
    if (id === 'iman') {
        effects.magnetUntil = Math.max(effects.magnetUntil || 0, until);
        effects.magnetRange = powerup.effect.range[levelIdx] || 100;
    }
    if (id === 'monedas_x2') {
        effects.coinMultiplier = Math.max(effects.coinMultiplier || 1, powerup.effect.coins[levelIdx] || 2);
        effects.gemMultiplier = Math.max(effects.gemMultiplier || 1, powerup.effect.gems[levelIdx] || 1);
    }
    if (id === 'angel_guardian') {
        effects.guardian = { level, lives: powerup.effect.lives[levelIdx] || 1, slotIndex };
    }
    if (id === 'sobrecarga') {
        effects.overloadUntil = until;
        effects.overloadSpeed = powerup.effect.speed[levelIdx] || 1.4;
        const stun = powerup.effect.stun[levelIdx] || 0;
        effects.overloadStunFactor = stun > 0 ? 0.58 : 1;
        effects.overloadStunQueued = stun * 1000;
    }
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
    if (id === 'tierra') convertObstaclesToRewards(level);
    if (id === 'burbuja') effects.bubbleUntil = Math.max(effects.bubbleUntil || 0, until);

    if (level >= 6 && ['proteccion', 'fantasma', 'stop_time'].includes(id)) {
        const inventory = readPowerups();
        inventory[id].usos += 1;
        savePowerups(inventory);
    }
}

function convertObstaclesToRewards(level) {
    const effects = window.powerupEffects;
    const gemChance = getPowerupById('tierra').effect.gemChance[Math.max(0, level - 1)] || 0;
    const converted = [...(window.obstacles || [])];
    converted.forEach(obstacle => {
        const radius = getObstacleRewardRadius(obstacle);
        if (Math.random() < gemChance) {
            window.rubies.push({ angle: obstacle.angle, radius, life: 360, pulse: 0 });
        } else {
            window.deadCoins.push({ angle: obstacle.angle, radius, life: 300, pulse: 0, golden: true });
        }
        effects.popBursts.push({ angle: obstacle.angle, radius, born: performance.now(), color: '#FFD700' });
    });
    window.obstacles = [];
}

function getObstacleRewardRadius(obstacle) {
    const fromGround = obstacle?.fromGround;
    return fromGround ? window.BASE_RADIUS + 30 : window.DOME_RADIUS - 34;
}

function updatePowerups() {
    if (!window.powerupEffects) return;
    const now = performance.now();
    const effects = window.powerupEffects;

    window.activePowerupSlots?.forEach(slot => {
        if (slot.active && now - slot.startedAt >= slot.duration) slot.active = false;
        if (slot.flash > 0) slot.flash -= 0.05;
    });

    if (effects.overloadStunQueued && now > (effects.overloadUntil || 0)) {
        effects.overloadStunUntil = now + effects.overloadStunQueued;
        effects.overloadStunQueued = 0;
    }
    if (effects.lethalZone && now > effects.lethalZone.expiresAt) effects.lethalZone = null;
    Object.keys(effects.teleport || {}).forEach(key => {
        if (now > effects.teleport[key].expiresAt) delete effects.teleport[key];
    });
    effects.popBursts = (effects.popBursts || []).filter(pop => now - pop.born < 520);
    if (effects.dramaFlash > 0) effects.dramaFlash -= 0.025;

    updateMagnetEffect();
    updateBubbleEffect();
    updateShadowClone();
}

function updateMagnetEffect() {
    const effects = window.powerupEffects;
    const now = performance.now();
    const active = now < (effects.magnetUntil || 0) || effects.shadowClone?.attractCoins || now < (effects.bubbleUntil || 0);
    if (!active) return;
    const range = now < (effects.magnetUntil || 0) ? effects.magnetRange : 110;
    const playerRadius = window.BASE_RADIUS + window.offset;
    const pullCollection = (items, isGem = false) => {
        for (let i = items.length - 1; i >= 0; i--) {
            const item = items[i];
            let rel = ((item.angle + window.worldRotation - window.angle + Math.PI * 2) % (Math.PI * 2));
            if (rel > Math.PI) rel -= Math.PI * 2;
            const arcDistance = Math.abs(rel) * Math.max(item.radius, 1);
            const radialDistance = Math.abs(playerRadius - item.radius);
            if (range >= 9999 || Math.hypot(arcDistance, radialDistance) < range) {
                item.angle += (window.angle - window.worldRotation - item.angle) * 0.14;
                item.radius += (playerRadius - item.radius) * 0.12;
                if (Math.abs(rel) < 0.08 && radialDistance < 20) {
                    if (isGem) {
                        const gain = Math.max(1, Math.round(effects.gemMultiplier || 1));
                        window.playerData.gems += gain;
                        localStorage.setItem('gems', window.playerData.gems);
                    } else {
                        const bonus = range >= 9999 && Math.random() < 0.18 ? 2 : 1;
                        window.playerData.deadCoins += bonus;
                        localStorage.setItem('deadCoins', window.playerData.deadCoins);
                    }
                    items.splice(i, 1);
                }
            }
        }
    };
    pullCollection(window.deadCoins || [], false);
    pullCollection(window.rubies || [], true);
}

function updateBubbleEffect() {
    const effects = window.powerupEffects;
    if (performance.now() > (effects.bubbleUntil || 0)) return;
    const playerRadius = window.BASE_RADIUS + window.offset;
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

function updateShadowClone() {
    const clone = window.powerupEffects?.shadowClone;
    if (!clone) return;
    if (!clone.fading && performance.now() < clone.splitAt) {
        clone.angle = window.angle;
        clone.offset = window.offset;
    }
    if (clone.fading) {
        clone.fading += 0.04;
        if (clone.fading >= 1) window.powerupEffects.shadowClone = null;
    }
}

function absorbPowerupHit() {
    const effects = window.powerupEffects || {};
    if (isPowerupInvulnerable()) return true;
    if (effects.shadowClone?.hits > 0) {
        effects.shadowClone.hits -= 1;
        effects.shadowClone.fading = 0.05;
        window.hitFlash = 0.8;
        return true;
    }
    if (effects.guardian) {
        triggerGuardianRevive(effects.guardian);
        effects.guardian = null;
        return true;
    }
    return false;
}

function triggerGuardianRevive(guardian) {
    window.lives = Math.max(window.lives, guardian.lives || 1);
    window.invulnerable = true;
    window.invulnerableTimer = 150;
    window.powerupEffects.dramaFlash = 1;
    window.hitFlash = 1;
    window.playSfx?.('powerUp', 0.95);
}

function isAngleInsideLethalZone(angleValue) {
    const zone = window.powerupEffects?.lethalZone;
    if (!zone) return false;
    let rel = ((angleValue - zone.angle + Math.PI * 3) % (Math.PI * 2)) - Math.PI;
    return Math.abs(rel) < zone.arc / 2;
}

function drawPowerupWorldEffects(ctx, cx, cy) {
    const effects = window.powerupEffects || {};
    const now = performance.now();
    drawLethalZone(ctx, cx, cy, effects);
    drawTeleportMarkers(ctx, cx, cy, effects);
    drawPowerupPopBursts(ctx, cx, cy, effects);
    drawShadowClone(ctx, cx, cy, effects);
    drawPlayerAuras(ctx, cx, cy, effects, now);
    if (effects.dramaFlash > 0) {
        ctx.save();
        ctx.fillStyle = `rgba(75,192,235,${effects.dramaFlash * 0.28})`;
        ctx.fillRect(0, 0, window.canvas.width, window.canvas.height);
        ctx.restore();
    }
}

function drawLethalZone(ctx, cx, cy, effects) {
    const zone = effects.lethalZone;
    if (!zone) return;
    ctx.save();
    ctx.beginPath();
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

function drawPlayerAuras(ctx, cx, cy, effects, now) {
    const playerRadius = window.BASE_RADIUS + window.offset;
    const x = cx + Math.cos(window.angle) * playerRadius;
    const y = cy + Math.sin(window.angle) * playerRadius;
    const activeAuras = [
        [now < (effects.invulnerableUntil || 0), '#AAE3D8', 26],
        [now < (effects.ghostUntil || 0), '#DEAAF0', 30],
        [now < (effects.chaosUntil || 0), `hsl(${(now / 8) % 360},100%,62%)`, 32],
        [now < (effects.bubbleUntil || 0), '#FF6EB4', 38],
        [now < (effects.overloadUntil || 0), '#F97316', 31]
    ];
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

function drawPowerupHud(ctx) {
    if (!window.activePowerupSlots) return;
    const compact = !!window.compactHud;
    const hudX = compact ? 10 : 20;
    const hudW = compact ? 178 : 240;
    const baseX = hudX + hudW + 12;
    const y = Math.max(compact ? 22 : 34, window.canvas.height * (compact ? 0.035 : 0.08) + 14);
    const radius = compact ? 22 : 29;
    const gap = compact ? 10 : 14;
    const inventory = readPowerups();
    window.activePowerupSlots.forEach((slot, index) => {
        const x = baseX + index * (radius * 2 + gap);
        const powerup = getPowerupById(slot.id);
        const state = slot.id ? inventory[slot.id] : null;
        drawPowerupHudCircle(ctx, x, y + radius, radius, slot, powerup, state);
    });
    
    // Draw combo indicator
    drawComboIndicator(ctx, baseX + 2 * (radius * 2 + gap), y + radius, radius);
}

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
    if (slot.active && slot.duration > 0) {
        const p = Math.max(0, 1 - (performance.now() - slot.startedAt) / slot.duration);
        ctx.strokeStyle = color;
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.arc(x, y, radius + 5, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * p, false);
        ctx.stroke();
    }
    
    // Cooldown indicator
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
    
    ctx.fillStyle = disabled ? '#9a9a9a' : '#ffffff';
    ctx.beginPath();
    ctx.arc(x + radius * 0.62, y + radius * 0.62, radius * 0.38, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = disabled ? '#555' : '#111';
    ctx.font = `900 ${Math.max(10, radius * 0.42)}px monospace`;
    ctx.fillText(String(uses), x + radius * 0.62, y + radius * 0.64);
    ctx.restore();
    
    slot.hudArea = { x, y, radius };
}

function drawComboIndicator(ctx, x, y, radius) {
    const combo = window.comboSystem || { count: 0, multiplier: 1 };
    if (combo.count <= 0) return;
    
    ctx.save();
    
    // Background circle
    ctx.fillStyle = 'rgba(255, 215, 0, 0.15)';
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    
    // Combo count
    ctx.fillStyle = '#FFD700';
    ctx.font = `900 ${Math.max(14, radius * 0.7)}px Geom, monospace`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`x${combo.count}`, x, y - 4);
    
    // Multiplier
    ctx.fillStyle = 'rgba(255, 215, 0, 0.8)';
    ctx.font = `700 ${Math.max(10, radius * 0.45)}px monospace`;
    ctx.fillText(`${combo.multiplier.toFixed(1)}x`, x, y + 12);
    
    ctx.restore();
}

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
        overlay.querySelector('.powerup-vip-feature')?.addEventListener('click', () => {
            buyPowerup(vip.id, 'vip');
            showPowerupSelection(levelIndex, onDone);
        });
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

function renderPowerupPrice(powerup, source = 'normal') {
    const currency = source === 'vip' ? 'gems' : (powerup.normalCurrency || 'coins');
    const amount = currency === 'gems'
        ? (source === 'vip' ? Math.max(1, Math.ceil((powerup.buy.coins || powerup.buy.gems * 30) / 30)) : powerup.buy.gems)
        : powerup.buy.coins;
    return `${amount} ${currency === 'gems' ? 'rubies' : 'monedas'}`;
}

function renderPowerupsShop(container, mode = 'normal', filterType = 'all') {
    readPowerups();
    
    // Filtrar potenciadores por tipo
    let filteredPowerups = POWERUPS_DATA;
    if (filterType !== 'all') {
        filteredPowerups = POWERUPS_DATA.filter(powerup => {
            const type = powerup.type || 'utilidad';
            return type === filterType;
        });
    }
    
    container.innerHTML = `
        <div class="powerup-shop-title">
            <button onclick="${mode === 'vip' ? 'renderVIPHome()' : "showShopSection('home')"}" type="button">VOLVER</button>
            <span>${mode === 'vip' ? 'POTENCIADORES VIP' : 'POTENCIADORES'}</span>
        </div>
        <div class="powerup-filter-buttons">
            <button class="filter-btn ${filterType === 'all' ? 'active' : ''}" onclick="renderPowerupsShop(document.getElementById('shopContent'), '${mode}', 'all')" type="button">Todos</button>
            <button class="filter-btn ${filterType === 'defensivo' ? 'active' : ''}" onclick="renderPowerupsShop(document.getElementById('shopContent'), '${mode}', 'defensivo')" type="button">Defensivos</button>
            <button class="filter-btn ${filterType === 'ofensivo' ? 'active' : ''}" onclick="renderPowerupsShop(document.getElementById('shopContent'), '${mode}', 'ofensivo')" type="button">Ofensivos</button>
            <button class="filter-btn ${filterType === 'utilidad' ? 'active' : ''}" onclick="renderPowerupsShop(document.getElementById('shopContent'), '${mode}', 'utilidad')" type="button">Utilidad</button>
        </div>
        <div class="powerup-shop-grid ${mode === 'vip' ? 'vip' : 'normal'}">
            ${filteredPowerups.map(powerup => renderPowerupShopCard(powerup, mode)).join('')}
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
    const selected = Math.max(1, Math.min(POWERUP_MAX_LEVEL, selectedLevel));
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
window.absorbPowerupHit = absorbPowerupHit;
window.isAngleInsideLethalZone = isAngleInsideLethalZone;
window.showPowerupSelection = showPowerupSelection;
window.renderPowerupsShop = renderPowerupsShop;
window.renderVIPPowerups = renderVIPPowerups;
window.openPowerupDetail = openPowerupDetail;
window.buyPowerup = buyPowerup;
window.upgradePowerup = upgradePowerup;
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
