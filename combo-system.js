// =====================================================
// COMBO SYSTEM
// =====================================================

const COMBO_STATS_STORAGE_KEY = 'comboStats_v2';
const COMBO_TIMEOUT = 3000; // 3 segundos sin esquivar = combo reset

let comboSystem = {
    currentCombo: 0,
    maxCombo: 0,
    comboMultiplier: 1,
    comboTimer: 0,
    totalDodges: 0,
    totalPerfectDodges: 0,
    totalCoinsCollected: 0,
    totalGemsCollected: 0,
    totalGamesPlayed: 0,
    totalTimePlayed: 0, // en segundos
    longestCombo: 0,
    perfectDodgesInARow: 0,
    maxPerfectDodgesInARow: 0
};

// Cargar estadísticas guardadas
function loadComboStats() {
    try {
        const saved = localStorage.getItem(COMBO_STATS_STORAGE_KEY);
        if (saved) {
            const parsed = JSON.parse(saved);
            // Fusionar las propiedades cargadas, evitando sobrescribir valores por defecto con `undefined`.
            // Esto asegura que propiedades como `comboMultiplier` siempre tengan un valor numérico.
            for (const key in parsed) {
                if (parsed[key] !== undefined) {
                    comboSystem[key] = parsed[key];
                }
            }
        }
    } catch (e) {
        console.error('Error loading combo stats:', e);
    }
}

// Guardar estadísticas
function saveComboStats() {
    try {
        localStorage.setItem(COMBO_STATS_STORAGE_KEY, JSON.stringify(comboSystem));
    } catch (e) {
        console.error('Error saving combo stats:', e);
    }
}

// Iniciar combo system
function initComboSystem() {
    loadComboStats();
    // Asegurarse de que el multiplicador se actualice después de cargar los stats,
    // garantizando que `comboMultiplier` tenga un valor numérico válido.
    updateComboMultiplier();
    window.comboSystem = comboSystem;
}

// Resetear combo al inicio de cada partida
function resetCombo() {
    comboSystem.currentCombo = 0;
    comboSystem.comboMultiplier = 1;
    comboSystem.comboTimer = 0;
    comboSystem.perfectDodgesInARow = 0;
}

// Incrementar combo cuando el jugador esquiva un obstáculo
function incrementCombo(isPerfect = false) {
    comboSystem.currentCombo++;
    comboSystem.totalDodges++;
    comboSystem.comboTimer = COMBO_TIMEOUT;

    if (isPerfect) {
        comboSystem.totalPerfectDodges++;
        comboSystem.perfectDodgesInARow++;
        if (comboSystem.perfectDodgesInARow > comboSystem.maxPerfectDodgesInARow) {
            comboSystem.maxPerfectDodgesInARow = comboSystem.perfectDodgesInARow;
        }
    } else {
        comboSystem.perfectDodgesInARow = 0;
    }

    // Actualizar combo máximo
    if (comboSystem.currentCombo > comboSystem.maxCombo) {
        comboSystem.maxCombo = comboSystem.currentCombo;
    }

    if (comboSystem.currentCombo > comboSystem.longestCombo) {
        comboSystem.longestCombo = comboSystem.currentCombo;
    }

    // Calcular multiplicador basado en combo
    updateComboMultiplier();

    // Otorgar XP del pase rubí basado en el multiplicador
    if (typeof window.addRubyPassXp === 'function') {
        const baseXp = 5; // XP base por cada near-miss
        const xpGained = baseXp * comboSystem.comboMultiplier;
        const result = window.addRubyPassXp(xpGained);

        // Actualizar la visualización del pase rubí si está abierto
        const rubyPassPanel = document.getElementById('rubyPassPanel');
        const rubyPassContent = document.getElementById('rubyPassContent');
        if (rubyPassPanel?.style.display !== 'none' && rubyPassContent && typeof window.renderBattlePassPage === 'function') {
            window.renderBattlePassPage(rubyPassContent, {
                animateFrom: {
                    xp: result.previousXp,
                    freeLevel: result.previousLevel,
                    premiumLevel: result.previousPremiumLevel
                }
            });
        }
    }

    // Feedback visual
    showComboFeedback(isPerfect);

    saveComboStats();
}

// Actualizar multiplicador de combo
function updateComboMultiplier() {
    const combo = comboSystem.currentCombo;
    if (combo >= 50) {
        comboSystem.comboMultiplier = 5;
    } else if (combo >= 30) {
        comboSystem.comboMultiplier = 4;
    } else if (combo >= 20) {
        comboSystem.comboMultiplier = 3;
    } else if (combo >= 10) {
        comboSystem.comboMultiplier = 2;
    } else {
        comboSystem.comboMultiplier = 1;
    }
}

// Actualizar timer de combo (llamar cada frame)
function updateComboTimer(deltaTime) {
    if (comboSystem.comboTimer > 0) {
        comboSystem.comboTimer -= deltaTime;
        if (comboSystem.comboTimer <= 0) {
            resetCombo();
        }
    }
}

// Obtener multiplicador actual para monedas/gemas
function getCoinMultiplier() {
    return comboSystem.comboMultiplier;
}

function getComboMultiplier() {
    return comboSystem.comboMultiplier;
}
// Mostrar feedback visual de combo
function showComboFeedback(isPerfect) {
    if (!window.showFloatingText) return;

    const text = isPerfect ? `PERFECT! x${comboSystem.comboMultiplier}` : `x${comboSystem.comboMultiplier}`;
    const color = isPerfect ? '#FFD700' : '#00FFE7';
    const size = isPerfect ? 28 : 24;

    window.showFloatingText?.(text, color, size);
}

// Resetear combo cuando el jugador es golpeado
function resetComboOnHit() {
    resetCombo();
    saveComboStats();
}

// =====================================================
// PERFECT DODGE SYSTEM
// =====================================================

const PERFECT_DODGE_THRESHOLD = 0.08; // Distancia angular para perfect dodge
let lastDodgeDistance = 0;
let lastDodgeTime = 0;

// Verificar si fue un perfect dodge
function checkPerfectDodge(obstacleAngle, playerAngle) {
    const distance = Math.abs(obstacleAngle - playerAngle);
    lastDodgeDistance = distance;
    lastDodgeTime = Date.now();

    // Perfect dodge si el obstáculo pasó muy cerca
    if (distance < PERFECT_DODGE_THRESHOLD) {
        return true;
    }

    return false;
}

// Mostrar efecto visual de perfect dodge
function showPerfectDodgeEffect() {
    if (!window.createParticles) return;

    // Crear partículas doradas
    const cx = window.canvas?.width / 2 || 0;
    const cy = window.canvas?.height / 2 || 0;
    const r = window.BASE_RADIUS + window.offset || 0;
    const px = cx + Math.cos(window.angle) * r;
    const py = cy + Math.sin(window.angle) * r;

    // Partículas en forma de cruz
    for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const speed = 3 + Math.random() * 2;
        window.createParticles?.(px, py, '#FFD700', 5, {
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            life: 30,
            size: 4 + Math.random() * 3
        });
    }

    // Flash effect
    if (window.ctx) {
        window.ctx.save();
        window.ctx.globalAlpha = 0.3;
        window.ctx.fillStyle = '#FFD700';
        window.ctx.fillRect(0, 0, window.canvas.width, window.canvas.height);
        window.ctx.restore();
    }
}

// Mostrar efecto visual de near miss (rozamiento)
function showNearMissEffect() {
    if (!window.createParticles) return;

    const cx = window.canvas?.width / 2 || 0;
    const cy = window.canvas?.height / 2 || 0;
    const r = window.BASE_RADIUS + window.offset || 0;
    const px = cx + Math.cos(window.angle) * r;
    const py = cy + Math.sin(window.angle) * r;

    // Partículas azules/blancas para near miss
    for (let i = 0; i < 4; i++) {
        const angle = (i / 4) * Math.PI * 2 + Math.random() * Math.PI / 4;
        const speed = 2 + Math.random() * 1.5;
        window.createParticles?.(px, py, '#00FFE7', 4, {
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            life: 25,
            size: 3 + Math.random() * 2
        });
    }
}

// =====================================================
// STATS SYSTEM
// =====================================================

function recordGamePlayed(timePlayed) {
    comboSystem.totalGamesPlayed++;
    comboSystem.totalTimePlayed += timePlayed;
    saveComboStats();
}

function recordCoinCollected(amount = 1) {
    comboSystem.totalCoinsCollected += amount;
    saveComboStats();
}

function recordGemCollected(amount = 1) {
    comboSystem.totalGemsCollected += amount;
    saveComboStats();
}

// Función global para manejar el evento de near miss
function onNearMiss(isPerfect = false) {
    incrementCombo(isPerfect); // Usa la lógica existente de incremento de combo

    if (isPerfect) {
        showPerfectDodgeEffect(); // Ya incluye feedback visual para perfecto
    } else {
        showNearMissEffect(); // Nuevo feedback visual para near miss general
    }
}

function getStats() {
    return {
        ...comboSystem,
        averageCombo: comboSystem.totalDodges > 0 ? (comboSystem.maxCombo / comboSystem.totalGamesPlayed).toFixed(2) : 0,
        perfectDodgeRate: comboSystem.totalDodges > 0 ? ((comboSystem.totalPerfectDodges / comboSystem.totalDodges) * 100).toFixed(1) : 0
    };
}

// =====================================================
// NEAR-MISS SYSTEM THRESHOLDS (AÑADIDOS)
// =====================================================
const NEAR_MISS_ANGULAR_THRESHOLD = 0.25; // Distancia angular adicional para near miss general
const SPIKE_NEAR_MISS_RADIAL_MARGIN = 40; // Margen adicional para near miss radial de spikes (píxeles)
const SAW_NEAR_MISS_RADIAL_MARGIN = 45; // Margen adicional para near miss radial de sierras (píxeles)
const LASER_NEAR_MISS_RADIAL_MARGIN = 50; // Margen adicional para near miss radial de láseres (píxeles)

// Inicializar sistema
initComboSystem();

// Exportar funciones para uso global
window.comboSystem = comboSystem;
window.incrementCombo = incrementCombo;
window.resetCombo = resetCombo;
window.resetComboOnHit = resetComboOnHit;
window.updateComboTimer = updateComboTimer;
window.getCoinMultiplier = getCoinMultiplier;
window.getComboMultiplier = getComboMultiplier;
window.checkPerfectDodge = checkPerfectDodge;
window.showPerfectDodgeEffect = showPerfectDodgeEffect;
window.showNearMissEffect = showNearMissEffect; // Exportar el nuevo efecto
window.onNearMiss = onNearMiss; // Exportar la nueva función de near miss
window.recordGamePlayed = recordGamePlayed;
window.recordCoinCollected = recordCoinCollected;
window.recordGemCollected = recordGemCollected;
window.getStats = getStats;

// Exportar los nuevos umbrales para uso global en otros archivos
window.NEAR_MISS_ANGULAR_THRESHOLD = NEAR_MISS_ANGULAR_THRESHOLD;
window.SPIKE_NEAR_MISS_RADIAL_MARGIN = SPIKE_NEAR_MISS_RADIAL_MARGIN;
window.SAW_NEAR_MISS_RADIAL_MARGIN = SAW_NEAR_MISS_RADIAL_MARGIN;
window.LASER_NEAR_MISS_RADIAL_MARGIN = LASER_NEAR_MISS_RADIAL_MARGIN;
