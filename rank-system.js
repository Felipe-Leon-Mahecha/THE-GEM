// =====================================================
// RANK SYSTEM — THE GEM
// Sistema de 17 rangos basado en XP total acumulada.
// Protegido con try-catch para no bloquear el juego.
// =====================================================

try {

    // ─────────────────────────────────────────────
    // 1. TABLA DE RANGOS (17 rangos, lista definitiva)
    // ─────────────────────────────────────────────
    const RANKS = [
        { id: 1, name: "Cobre", threshold: 0, color: "#b87333", emoji: "✦" },
        { id: 2, name: "Hierro", threshold: 100, color: "#a8a9ad", emoji: "◈" },
        { id: 3, name: "Plata", threshold: 300, color: "#c0c0c0", emoji: "◇" },
        { id: 4, name: "Oro", threshold: 600, color: "#ffd700", emoji: "⬡" },
        { id: 5, name: "Ámbar", threshold: 1000, color: "#ffbf00", emoji: "⬢" },
        { id: 6, name: "Diamante", threshold: 1500, color: "#00ffe7", emoji: "◈" },
        { id: 7, name: "Granate", threshold: 2200, color: "#c0392b", emoji: "⬢" },
        { id: 8, name: "Rubí", threshold: 3000, color: "#ff2d55", emoji: "◉" },
        { id: 9, name: "Obsidiana", threshold: 4000, color: "#3d2b4a", emoji: "◈" },
        { id: 10, name: "Zafiro", threshold: 5500, color: "#0066ff", emoji: "★" },
        { id: 11, name: "Esmeralda", threshold: 7500, color: "#00c864", emoji: "◆" },
        { id: 12, name: "Amatista", threshold: 10000, color: "#cc44ff", emoji: "❋" },
        { id: 13, name: "Prisma", threshold: 13000, color: "#ff66ff", emoji: "◈" },
        { id: 14, name: "Ópalo", threshold: 17000, color: "#ff9ab0", emoji: "⚜" },
        { id: 15, name: "Celestita", threshold: 22000, color: "#88ccff", emoji: "✦" },
        { id: 16, name: "Voidita", threshold: 28000, color: "#7700cc", emoji: "♛" },
        { id: 17, name: "The Gem", threshold: 35000, color: "#ffffff", emoji: "⚡" },
    ];

    // ─────────────────────────────────────────────
    // 2. NÚCLEO DEL SISTEMA
    // ─────────────────────────────────────────────
    const rankSystem = {

        // Flag para pruebas de ascensión
        isAscensionTrialActive: false,
        ascensionTrialTargetRank: null,

        // Obtiene la XP actual desde window.playerData (fuente única de verdad)
        getXP() {
            return (window.playerData && window.playerData.totalXP) || 0;
        },

        // Devuelve el rango correspondiente a una cantidad de XP
        getRankForXP(xp) {
            for (let i = RANKS.length - 1; i >= 0; i--) {
                if (xp >= RANKS[i].threshold) return RANKS[i];
            }
            return RANKS[0];
        },

        // Devuelve el rango actual del jugador
        getCurrentRank() {
            return this.getRankForXP(this.getXP());
        },

        // Devuelve el siguiente rango (o null si ya es Omnipotente)
        getNextRank() {
            const current = this.getCurrentRank();
            const idx = RANKS.findIndex(r => r.id === current.id);
            return idx < RANKS.length - 1 ? RANKS[idx + 1] : null;
        },

        // Devuelve XP faltante para el siguiente rango (0 si es el último)
        getXPToNextRank() {
            const next = this.getNextRank();
            if (!next) return 0;
            return Math.max(0, next.threshold - this.getXP());
        },

        // Progreso 0–1 dentro del rango actual
        getRankProgress() {
            const current = this.getCurrentRank();
            const next = this.getNextRank();
            if (!next) return 1;
            const xp = this.getXP();
            const range = next.threshold - current.threshold;
            if (range <= 0) return 1;
            return Math.min(1, (xp - current.threshold) / range);
        },

        // ─── AÑADIR XP ──────────────────────────────
        // Recibe la XP ganada, la suma a playerData.totalXP,
        // guarda en localStorage y dispara evento si cambia el rango.
        addXP(amount) {
            if (!amount || amount <= 0) return;
            try {
                const prevRank = this.getCurrentRank();

                if (!window.playerData) window.playerData = {};
                if (typeof window.playerData.totalXP !== 'number') {
                    window.playerData.totalXP = 0;
                }
                window.playerData.totalXP += amount;
                localStorage.setItem('totalXP', String(window.playerData.totalXP));

                const newRank = this.getCurrentRank();

                // Sincronizar rankName y rankColor legacy (para banners que los lean)
                localStorage.setItem('rankName', newRank.name);
                localStorage.setItem('rankColor', newRank.color);

                // Si subió de rango, disparar evento
                if (newRank.id !== prevRank.id) {
                    this._onRankUp(prevRank, newRank);
                }

                // Actualizar banners de UI
                this._refreshUI();

            } catch (e) {
                console.warn('[RankSystem] Error en addXP:', e);
            }
        },

        // ─── CALCULAR XP DE VICTORIA NORMAL ─────────
        // +50 base + combo máximo de la sesión
        calcNormalVictoryXP() {
            const comboBonus = typeof window.sessionMaxCombo === 'number'
                ? window.sessionMaxCombo : 0;
            return 50 + comboBonus;
        },

        // ─── CALCULAR XP DE SURVIVAL ─────────────────
        // +30 por cada minuto sobrevivido + combo
        calcSurvivalXP(secondsSurvived) {
            const minutes = (secondsSurvived || 0) / 60;
            const comboBonus = typeof window.sessionMaxCombo === 'number'
                ? window.sessionMaxCombo : 0;
            return Math.floor(30 * minutes) + comboBonus;
        },

        // ─── PRUEBA DE ASCENSIÓN ──────────────────────
        startAscensionTrial(targetRankId) {
            this.isAscensionTrialActive = true;
            this.ascensionTrialTargetRank = targetRankId;
            localStorage.setItem('ascensionTrialActive', 'true');
            localStorage.setItem('ascensionTrialTarget', String(targetRankId));
        },

        resolveAscensionTrial(result) {
            // result: 'victory' | 'defeat'
            try {
                if (result === 'victory') {
                    const targetRank = RANKS.find(r => r.id === this.ascensionTrialTargetRank);
                    if (targetRank) {
                        // Asegurar que el jugador tenga al menos la XP del nuevo rango
                        if (!window.playerData) window.playerData = {};
                        if ((window.playerData.totalXP || 0) < targetRank.threshold) {
                            window.playerData.totalXP = targetRank.threshold;
                            localStorage.setItem('totalXP', String(targetRank.threshold));
                        }
                        // Recompensa
                        const rewardCoins = 200 * targetRank.id;
                        const rewardGems = 2 * targetRank.id;
                        window.playerData.deadCoins = (window.playerData.deadCoins || 0) + rewardCoins;
                        window.playerData.gems = (window.playerData.gems || 0) + rewardGems;
                        localStorage.setItem('deadCoins', String(window.playerData.deadCoins));
                        localStorage.setItem('gems', String(window.playerData.gems));
                        this._onRankUp(this.getRankForXP(targetRank.threshold - 1), targetRank);
                    }
                } else {
                    // Derrota: penalización — reducir XP a mitad del rango actual
                    if (!window.playerData) window.playerData = {};
                    const currentRank = this.getCurrentRank();
                    const penaltyXP = Math.floor(
                        currentRank.threshold + (this.getXP() - currentRank.threshold) * 0.5
                    );
                    window.playerData.totalXP = Math.max(currentRank.threshold, penaltyXP);
                    localStorage.setItem('totalXP', String(window.playerData.totalXP));
                }
            } finally {
                this.isAscensionTrialActive = false;
                this.ascensionTrialTargetRank = null;
                localStorage.removeItem('ascensionTrialActive');
                localStorage.removeItem('ascensionTrialTarget');
                this._refreshUI();
            }
        },

        // ─── EVENTO INTERNO: SUBIDA DE RANGO ─────────
        _onRankUp(prevRank, newRank) {
            try {
                window.dispatchEvent(new CustomEvent('rankChanged', {
                    detail: { prevRank, newRank, totalXP: this.getXP() }
                }));
                // Notificación visual de subida de rango
                // Imagen: assets/UI/Rangos/rango_<id>.png (cuando existan)
                // Fallback: emoji del rango
                const rankImgPath = `assets/UI/Rangos/rango_${newRank.id}.png`;
                if (typeof window.showRankUpNotification === 'function') {
                    window.showRankUpNotification(newRank, rankImgPath);
                } else if (typeof window.showAchievementNotification === 'function') {
                    window.showAchievementNotification({
                        img: rankImgPath,
                        name: `${newRank.emoji} ${newRank.name}`,
                        title: '¡NUEVO RANGO!'
                    });
                }
            } catch (e) {
                console.warn('[RankSystem] Error en _onRankUp:', e);
            }
        },

        // ─── REFRESCAR TODOS LOS BANNERS DE UI ───────
        _refreshUI() {
            try {
                const rank = this.getCurrentRank();
                const xp = this.getXP();
                const next = this.getNextRank();
                const progress = this.getRankProgress();

                // Elementos del menú principal
                const menuRankEl = document.getElementById('menu-profile-rank');
                if (menuRankEl) {
                    menuRankEl.textContent = rank.name;
                    menuRankEl.style.color = rank.color;
                }

                // profilePanel
                const heroRankEl = document.getElementById('profileHeroRank');
                if (heroRankEl) {
                    heroRankEl.textContent = `${rank.emoji} ${rank.name}`;
                    heroRankEl.style.color = rank.color;
                }

                // XP total y barra de progreso
                const xpEl = document.getElementById('profileStat-total-xp');
                if (xpEl) xpEl.textContent = xp.toLocaleString();

                const xpNextEl = document.getElementById('profileStat-xp-to-next');
                if (xpNextEl) xpNextEl.textContent = next
                    ? this.getXPToNextRank().toLocaleString() + ' XP para ' + next.name
                    : '¡Rango máximo!';

                const progressBar = document.getElementById('rank-progress-bar-fill');
                if (progressBar) progressBar.style.width = (progress * 100).toFixed(1) + '%';

                // Camino de rangos si está abierto
                if (typeof window.renderRankPath === 'function') {
                    window.renderRankPath();
                }

                // Actualizar updateProfilePanelStats si existe
                if (typeof window.updateProfilePanelStats === 'function') {
                    window.updateProfilePanelStats();
                }
            } catch (e) {
                console.warn('[RankSystem] Error en _refreshUI:', e);
            }
        }
    };

    // ─────────────────────────────────────────────
    // 3. INICIALIZACIÓN — cargar XP guardada
    // ─────────────────────────────────────────────
    (function initRankSystem() {
        try {
            if (!window.playerData) window.playerData = {};
            const savedXP = parseInt(localStorage.getItem('totalXP') || '0', 10);
            window.playerData.totalXP = isNaN(savedXP) ? 0 : savedXP;

            // Restaurar prueba de ascensión si estaba activa
            if (localStorage.getItem('ascensionTrialActive') === 'true') {
                rankSystem.isAscensionTrialActive = true;
                rankSystem.ascensionTrialTargetRank =
                    parseInt(localStorage.getItem('ascensionTrialTarget') || '0', 10);
            }

            // Sincronizar rankName/rankColor legacy
            const currentRank = rankSystem.getCurrentRank();
            localStorage.setItem('rankName', currentRank.name);
            localStorage.setItem('rankColor', currentRank.color);

            rankSystem._refreshUI();
        } catch (e) {
            console.warn('[RankSystem] Error en init:', e);
        }
    })();

    // ─────────────────────────────────────────────
    // 4. CAMINO DE RANGOS — renderizado HTML
    // ─────────────────────────────────────────────
    window.renderRankPath = function () {
        try {
            const container = document.getElementById('rank-path-container');
            if (!container) return;
            const currentRank = rankSystem.getCurrentRank();
            const xp = rankSystem.getXP();

            container.innerHTML = RANKS.map((rank, i) => {
                const unlocked = xp >= rank.threshold;
                const isCurrent = rank.id === currentRank.id;
                const isLast = i === RANKS.length - 1;
                const progress = isCurrent ? rankSystem.getRankProgress() : (unlocked ? 1 : 0);

                return `
                    <div class="rank-path-node ${unlocked ? 'unlocked' : 'locked'} ${isCurrent ? 'current' : ''}">
                        <div class="rank-node-connector ${unlocked && !isLast ? 'filled' : ''}">
                            ${!isLast ? `<div class="rank-connector-fill" style="height:${unlocked && !isCurrent ? 100 : isCurrent ? progress * 100 : 0}%"></div>` : ''}
                        </div>
                        <div class="rank-node-circle" style="--rank-color:${rank.color}">
                            <span class="rank-node-emoji">${rank.emoji}</span>
                        </div>
                        <div class="rank-node-info">
                            <span class="rank-node-name" style="color:${isCurrent || unlocked ? rank.color : '#666'}">${rank.name}</span>
                            <span class="rank-node-xp">${rank.threshold.toLocaleString()} XP</span>
                        </div>
                        ${isCurrent ? `<div class="rank-node-badge">▶ ACTUAL</div>` : ''}
                    </div>
                `;
            }).join('');

            // Scroll automático al rango actual
            const currentNode = container.querySelector('.rank-path-node.current');
            if (currentNode) {
                setTimeout(() => currentNode.scrollIntoView({ behavior: 'smooth', block: 'center' }), 80);
            }
        } catch (e) {
            console.warn('[RankSystem] Error en renderRankPath:', e);
        }
    };

    // ─────────────────────────────────────────────
    // 5. EXPONER GLOBALMENTE
    // ─────────────────────────────────────────────
    window.rankSystem = rankSystem;
    window.RANKS = RANKS;

    // Escuchar el evento rankChanged para refrescar UI automáticamente
    window.addEventListener('rankChanged', function (e) {
        try {
            console.log('[RankSystem] Rango cambiado:', e.detail.prevRank.name, '→', e.detail.newRank.name);
            rankSystem._refreshUI();
        } catch (err) {
            console.warn('[RankSystem] Error en listener rankChanged:', err);
        }
    });

    console.log('[RankSystem] Iniciado. XP:', rankSystem.getXP(), '| Rango:', rankSystem.getCurrentRank().name);

} catch (fatalErr) {
    // Si todo falla, el juego sigue funcionando
    console.error('[RankSystem] ERROR FATAL (el juego continúa):', fatalErr);
    window.rankSystem = {
        getXP: () => 0,
        getCurrentRank: () => ({ id: 1, name: 'Chispa', color: '#aaaaaa', emoji: '✦' }),
        getNextRank: () => null,
        getXPToNextRank: () => 0,
        getRankProgress: () => 0,
        addXP: () => { },
        calcNormalVictoryXP: () => 50,
        calcSurvivalXP: () => 0,
        _refreshUI: () => { },
        isAscensionTrialActive: false
    };
    window.RANKS = [];
}

// ─────────────────────────────────────────────
// 6. TOGGLE del Camino de Rangos (llamado desde index.html)
// ─────────────────────────────────────────────
window.toggleRankPath = function () {
    try {
        const panel = document.getElementById('rank-path-panel');
        if (!panel) return;
        // Panel is open by default (no display:none on it now)
        const isOpen = panel.style.display !== 'none';
        panel.style.display = isOpen ? 'none' : 'block';
        if (!isOpen) {
            window.renderRankPath?.();
        }
        const btn = document.querySelector('.rank-path-toggle-btn');
        if (btn) btn.textContent = isOpen ? '◉ VER RANGOS' : '◉ OCULTAR RANGOS';
    } catch (e) {
        console.warn('[RankSystem] Error en toggleRankPath:', e);
    }
};

// Render rank path when profile opens (ranks visible by default)
window.renderRankPathOnOpen = function () {
    try {
        const panel = document.getElementById('rank-path-panel');
        if (panel) {
            panel.style.display = 'block';
            window.renderRankPath?.();
        }
        const btn = document.querySelector('.rank-path-toggle-btn');
        if (btn) btn.textContent = '◉ CAMINO DE LEYENDAS ◉';
    } catch (e) { }
};
// =====================================================
// PANTALLA DE RANGOS COMPLETA
// =====================================================

window.openRanksScreen = function () {
    try {
        const screen = document.getElementById('ranksScreen');
        if (!screen) return;
        screen.style.display = 'flex';
        screen.classList.remove('entering', 'leaving');
        void screen.offsetWidth;
        screen.classList.add('entering');

        // Esperar un frame para que el navegador calcule el layout
        // antes de que _renderRankMap lea offsetWidth/offsetHeight
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                window.buildRanksScreen();
                window._injectRankDebugPanel();
            });
        });

        // Hide overlay if open
        const overlay = document.getElementById('overlay');
        if (overlay) {
            overlay.classList.remove('exit-shop', 'enter-shop', 'exit-inventory', 'enter-inventory', 'exit-play', 'enter-play');
            void overlay.offsetWidth;
            overlay.classList.add('exit-play');
        }

        setTimeout(() => {
            if (overlay && screen.style.display === 'flex') {
                overlay.style.display = 'none';
                overlay.classList.remove('exit-play');
            }
            screen.classList.remove('entering');
        }, 450);
    } catch (e) { console.warn('[RankSystem] openRanksScreen:', e); }
};

// ─────────────────────────────────────────────────────────────────────────────
// PANEL DE DEBUG XP — solo visible en localhost
// ─────────────────────────────────────────────────────────────────────────────
window._injectRankDebugPanel = function () {
    try {
        const isLocalDev = ['localhost', '127.0.0.1', '[::1]'].includes(window.location.hostname);
        if (!isLocalDev) return;
        const screen = document.getElementById('ranksScreen');
        if (!screen || document.getElementById('rsm-debug-btn')) return;

        const btn = document.createElement('button');
        btn.id = 'rsm-debug-btn';
        btn.type = 'button';
        btn.textContent = '🛠';
        btn.title = 'Debug XP (solo localhost)';
        btn.style.cssText = 'position:fixed;bottom:18px;left:18px;z-index:9998;width:38px;height:38px;border-radius:50%;background:#1a1a1a;border:1.5px solid #ff8c00;color:#ff8c00;font-size:16px;cursor:pointer;box-shadow:0 0 10px #ff8c0066;';

        const panel = document.createElement('div');
        panel.id = 'rsm-debug-panel';
        panel.style.cssText = 'position:fixed;bottom:64px;left:18px;z-index:9998;display:none;flex-direction:column;gap:8px;background:#111c;border:1px solid #ff8c0066;border-radius:10px;padding:12px;width:200px;backdrop-filter:blur(6px);font-family:monospace;';
        panel.innerHTML = `
            <div style="font-size:11px;color:#ff8c00;letter-spacing:1px;margin-bottom:2px;">DEBUG · CAMINO DE RANGOS</div>
            <input id="rsm-debug-xp-input" type="number" placeholder="Cantidad XP" style="width:100%;box-sizing:border-box;padding:6px 8px;background:#000;border:1px solid #444;border-radius:6px;color:#0ff;font-size:12px;">
            <button id="rsm-debug-add-xp" type="button" style="padding:6px;border-radius:6px;border:1px solid #00ffe766;background:#00ffe71a;color:#00ffe7;font-size:11px;cursor:pointer;">➕ Añadir XP</button>
            <button id="rsm-debug-reset-xp" type="button" style="padding:6px;border-radius:6px;border:1px solid #ff5c5c66;background:#ff5c5c1a;color:#ff8585;font-size:11px;cursor:pointer;">↺ Reset XP (a 0)</button>
            <button id="rsm-debug-reset-nodes" type="button" style="padding:6px;border-radius:6px;border:1px solid #ffd70066;background:#ffd7001a;color:#ffd700;font-size:11px;cursor:pointer;">🗑 Reset nodos reclamados</button>
        `;

        btn.onclick = () => {
            panel.style.display = panel.style.display === 'none' ? 'flex' : 'none';
        };

        panel.querySelector('#rsm-debug-add-xp').onclick = () => {
            const input = panel.querySelector('#rsm-debug-xp-input');
            const amount = parseInt(input.value, 10);
            if (!amount || amount <= 0) return;
            window.rankSystem.addXP(amount);
            window.buildRanksScreen();
            input.value = '';
        };

        panel.querySelector('#rsm-debug-reset-xp').onclick = () => {
            if (!confirm('¿Reiniciar XP a 0?')) return;
            if (!window.playerData) window.playerData = {};
            window.playerData.totalXP = 0;
            localStorage.setItem('totalXP', '0');
            // Limpiar también el rango cacheado para forzar recalculo desde 0
            localStorage.removeItem('rankName');
            localStorage.removeItem('rankColor');
            localStorage.removeItem('rankId');
            // Re-sincronizar rankSystem si existe
            if (window.rankSystem && window.rankSystem.currentRank) {
                window.rankSystem.currentRank = null;
            }
            // Refrescar UI del rango (banners, barra de progreso) ANTES de redibujar el mapa
            window.rankSystem && window.rankSystem._refreshUI();
            window.buildRanksScreen();
        };

        panel.querySelector('#rsm-debug-reset-nodes').onclick = () => {
            if (!confirm('¿Borrar todos los nodos reclamados?')) return;
            Object.keys(localStorage)
                .filter(k => k.startsWith('rsm_claimed_'))
                .forEach(k => localStorage.removeItem(k));
            window.buildRanksScreen();
        };

        screen.appendChild(btn);
        screen.appendChild(panel);
    } catch (e) { console.warn('[RankSystem] _injectRankDebugPanel:', e); }
};

window.closeRanksScreen = function () {
    try {
        const screen = document.getElementById('ranksScreen');
        if (screen) {
            screen.classList.remove('entering');
            screen.classList.add('leaving');
        }

        const overlay = document.getElementById('overlay');
        if (overlay) {
            overlay.style.display = 'flex';
            overlay.classList.remove('exit-play', 'enter-play');
            void overlay.offsetWidth;
            overlay.classList.add('enter-play');
        }

        setTimeout(() => {
            if (screen) {
                screen.style.display = 'none';
                screen.classList.remove('leaving');
            }
            if (overlay) {
                overlay.classList.remove('enter-play');
            }
        }, 450);
    } catch (e) { }
};

// ─────────────────────────────────────────────────────────────────────────────
// MAPA DE RANGOS — sistema visual de 3 mapas con islas, curva neon y avatar
// ─────────────────────────────────────────────────────────────────────────────

// Iconos especiales para nodo inicio y fin de cada mapa
// Aumentan en grandiosidad mapa a mapa
const MAP_SPECIAL_NODES = [
    // Mapa 1 — La Forja Cósmica
    {
        start: { icon: '◎', label: 'ORIGEN', size: 38, glow: 0.6, ring: 1 },
        end: { icon: '⬡', label: 'ORO', size: 54, glow: 1.2, ring: 2 }
    },
    // Mapa 2 — El Núcleo Ardiente (inicio = igual al fin del mapa 1)
    {
        start: { icon: '⬡', label: 'ORO', size: 54, glow: 1.2, ring: 2 },
        end: { icon: '◈', label: 'OBSIDIANA', size: 62, glow: 1.6, ring: 3 }
    },
    // Mapa 3 — El Palacio de Cristal (inicio = igual al fin del mapa 2)
    {
        start: { icon: '◈', label: 'ZAFIRO', size: 62, glow: 1.6, ring: 3 },
        end: { icon: '⚡', label: 'THE GEM', size: 72, glow: 2.5, ring: 4 }
    }
];

const MAP_DEFS = [
    {
        id: 1, name: 'La Forja Cósmica',
        bg: 'assets/UI/Imagenes Camino de reyes/Islas_mapa_1.png',
        bgColor: '#07080f',
        starColor: 'rgba(0,255,231,{a})',
        pathColor: '#00ffe7', pathGlow: '#00ffe7',
        gemImage: 'assets/UI/Imagenes Camino de reyes/GEMA_1.png',
        gemPos: { xPct: 0.72, yPct: 0.38 },
        rankIds: [1, 2, 3, 4]
    },
    {
        id: 2, name: 'El Núcleo Ardiente',
        bg: null, bgColor: '#120800',
        starColor: 'rgba(255,140,0,{a})',
        pathColor: '#ff8c00', pathGlow: '#ff6600',
        gemImage: 'assets/UI/Imagenes Camino de reyes/GEMA_2.png',
        gemPos: { xPct: 0.28, yPct: 0.42 },
        rankIds: [5, 6, 7, 8, 9]
    },
    {
        id: 3, name: 'El Palacio de Cristal',
        bg: null, bgColor: '#08060f',
        starColor: 'rgba(255,215,0,{a})',
        pathColor: '#ffd700', pathGlow: '#ffaa00',
        gemImage: 'assets/UI/Imagenes Camino de reyes/GEMA_3.png',
        gemPos: { xPct: 0.5, yPct: 0.35 },
        rankIds: [10, 11, 12, 13, 14, 15, 16, 17]
    }
];

// Nodos leídos desde config.js → RANK_MAP_CONFIG
// Si el config no está cargado aún, usa fallback
const _defaultNodes = [
    [{ x: 7, y: 62 }, { x: 30, y: 32 }, { x: 58, y: 60 }, { x: 88, y: 28 }],
    [{ x: 10, y: 70 }, { x: 28, y: 30 }, { x: 50, y: 65 }, { x: 72, y: 28 }, { x: 90, y: 60 }],
    [{ x: 8, y: 80 }, { x: 22, y: 45 }, { x: 38, y: 75 }, { x: 52, y: 35 }, { x: 62, y: 65 }, { x: 74, y: 30 }, { x: 86, y: 60 }, { x: 94, y: 25 }]
];
function _getNodesPct(mapIdx) {
    const cfg = window.RANK_MAP_CONFIG;
    if (cfg && cfg.maps && cfg.maps[mapIdx]) return cfg.maps[mapIdx].nodes;
    return _defaultNodes[mapIdx] || [];
}

let _activeMap = 0;
let _mapRafId = null;

function _catmullToBezier(pts) {
    const segs = [];
    for (let i = 0; i < pts.length - 1; i++) {
        const p0 = pts[Math.max(i - 1, 0)];
        const p1 = pts[i];
        const p2 = pts[i + 1];
        const p3 = pts[Math.min(i + 2, pts.length - 1)];
        const cp1x = p1.x + (p2.x - p0.x) / 6;
        const cp1y = p1.y + (p2.y - p0.y) / 6;
        const cp2x = p2.x - (p3.x - p1.x) / 6;
        const cp2y = p2.y - (p3.y - p1.y) / 6;
        segs.push({ cp1x, cp1y, cp2x, cp2y, x: p2.x, y: p2.y });
    }
    return segs;
}

function _buildPathD(pts, W, H) {
    if (!pts.length) return '';
    const abs = pts.map(p => ({ x: p.x / 100 * W, y: p.y / 100 * H }));
    const segs = _catmullToBezier(abs);
    let d = `M ${abs[0].x.toFixed(1)},${abs[0].y.toFixed(1)}`;
    segs.forEach(s => {
        d += ` C ${s.cp1x.toFixed(1)},${s.cp1y.toFixed(1)} ${s.cp2x.toFixed(1)},${s.cp2y.toFixed(1)} ${s.x.toFixed(1)},${s.y.toFixed(1)}`;
    });
    return d;
}

window.buildRanksScreen = function () {
    try {
        const currentXP = window.rankSystem ? window.rankSystem.getXP() : 0;
        const currentRank = window.rankSystem ? window.rankSystem.getCurrentRank() : { name: 'Chispa', color: '#aaa', emoji: '✦', threshold: 0, id: 1 };
        const nextRank = window.rankSystem ? window.rankSystem.getNextRank() : null;
        const progress = window.rankSystem ? window.rankSystem.getRankProgress() : 0;

        const xpEl = document.getElementById('rs-player-xp');
        if (xpEl) xpEl.textContent = currentXP.toLocaleString();

        const nameEl = document.getElementById('rs-current-name');
        if (nameEl) { nameEl.textContent = `${currentRank.emoji} ${currentRank.name}`; nameEl.style.color = currentRank.color; }

        const barFill = document.getElementById('rs-current-bar-fill');
        if (barFill) { barFill.style.width = (progress * 100).toFixed(1) + '%'; barFill.style.background = `linear-gradient(90deg, ${currentRank.color}, ${currentRank.color}88)`; }

        const xpInfo = document.getElementById('rs-current-xp-info');
        if (xpInfo) {
            if (nextRank) {
                const xpFalta = nextRank.threshold - currentXP;
                const pct = Math.round((progress || 0) * 100);
                xpInfo.innerHTML = `
                    <span style="color:#fff;font-weight:600;">${currentXP.toLocaleString()} XP</span>
                    <span style="color:rgba(255,255,255,0.4);margin:0 6px;">·</span>
                    <span style="color:rgba(255,255,255,0.6);">Hacia <strong style="color:${nextRank.color || '#fff'}">${nextRank.name}</strong></span>
                    <span style="color:rgba(255,255,255,0.4);margin:0 6px;">·</span>
                    <span style="color:rgba(255,255,255,0.5);">faltan <strong style="color:#fff">${xpFalta.toLocaleString()} XP</strong></span>
                    <span style="color:rgba(255,255,255,0.3);margin-left:6px;">(${pct}%)</span>
                `;
            } else {
                xpInfo.innerHTML = `<span style="color:#ffd700;font-weight:600;">⚡ ${currentXP.toLocaleString()} XP · ¡Rango máximo alcanzado!</span>`;
            }
        }

        const avatarUrl = localStorage.getItem('playerAvatar') || '';
        const rsAvatar = document.getElementById('rs-profile-avatar');
        if (rsAvatar) {
            if (avatarUrl) { rsAvatar.style.backgroundImage = `url("${avatarUrl}")`; rsAvatar.style.backgroundSize = 'cover'; rsAvatar.style.backgroundPosition = 'center'; }
            rsAvatar.style.borderColor = currentRank.color;
            rsAvatar.style.boxShadow = `0 0 14px ${currentRank.color}66`;
        }
        const rsName = document.getElementById('rs-profile-name');
        if (rsName) rsName.textContent = localStorage.getItem('playerName') || 'Jugador';
        const rsGems = document.getElementById('rs-display-gems');
        const rsCoins = document.getElementById('rs-display-coins');
        if (rsGems) rsGems.textContent = window.infiniteCoinsMode ? '∞' : (parseInt(localStorage.getItem('gems') || '0', 10) || 0);
        if (rsCoins) rsCoins.textContent = window.infiniteCoinsMode ? '∞' : (parseInt(localStorage.getItem('deadCoins') || '0', 10) || 0);

        const allRanks = window.RANKS || [];
        let mapIdx = 0;
        for (let m = MAP_DEFS.length - 1; m >= 0; m--) {
            if (MAP_DEFS[m].rankIds.includes(currentRank.id)) { mapIdx = m; break; }
        }
        _activeMap = mapIdx;

        window._renderRankMap(mapIdx, currentXP, currentRank, allRanks);

    } catch (e) { console.warn('[RankSystem] buildRanksScreen:', e); }
};

window._renderRankMap = function (mapIdx, currentXP, currentRank, allRanks) {
    const map = MAP_DEFS[mapIdx];
    const nodesPct = _getNodesPct(mapIdx);
    const container = document.getElementById('rs-map-inner');
    if (!container) return;

    container.innerHTML = '';
    if (_mapRafId) { cancelAnimationFrame(_mapRafId); _mapRafId = null; }

    if (map.bg) {
        container.style.backgroundImage = `url("${map.bg}")`;
        container.style.backgroundSize = 'cover';
        container.style.backgroundPosition = 'center';
    } else {
        container.style.backgroundImage = 'none';
    }
    container.style.backgroundColor = map.bgColor;
    container.style.position = 'relative';
    container.style.overflow = 'visible';

    const cfg = window.RANK_MAP_CONFIG || {};
    const W = cfg.mapWidth || 2200;
    const H = container.offsetHeight || 500;

    container.style.setProperty('--rs-map-width', W + 'px');
    container.style.width = W + 'px';

    // Canvas estrellas
    const cvs = document.createElement('canvas');
    cvs.width = W; cvs.height = H;
    cvs.style.cssText = `position:absolute;left:0;top:0;width:${W}px;height:100%;pointer-events:none;z-index:1;`;
    container.appendChild(cvs);
    const ctx = cvs.getContext('2d');

    const stars = Array.from({ length: 80 }, () => ({
        x: Math.random() * W, y: Math.random() * H,
        r: Math.random() * 1.4 + 0.2,
        a: Math.random() * 0.5 + 0.1,
        da: (Math.random() - 0.5) * 0.008
    }));

    // Obtener rangos desde todas las fuentes posibles
    const ranksSource = (allRanks && allRanks.length > 0) ? allRanks : (window.RANKS || []);
    const mapRanks = ranksSource.filter(r => map.rankIds.includes(Number(r.id)));
    console.log('[RankMap] W:', W, 'H:', H, 'mapRanks:', mapRanks.length, 'nodesPct:', nodesPct.length, 'rankIds:', map.rankIds, 'ids en source:', ranksSource.map(r => r.id));
    const absNodes = nodesPct.map(p => ({ x: p.x / 100 * W, y: p.y / 100 * H }));
    const pathD = _buildPathD(nodesPct, W, H);

    // Gema decorativa
    const gemEl = document.createElement('img');
    gemEl.src = map.gemImage;
    gemEl.alt = 'gema';
    const gcfgArr = (window.RANK_MAP_CONFIG || {}).gems || [];
    const gcfg = gcfgArr[mapIdx] || {};
    const gemSz = gcfg.sizePx || 90;
    const gemX = gcfg.xPct != null ? gcfg.xPct : map.gemPos.xPct * 100;
    const gemY = gcfg.yPct != null ? gcfg.yPct : map.gemPos.yPct * 100;
    gemEl.style.cssText = `position:absolute;width:${gemSz}px;height:${gemSz}px;object-fit:contain;z-index:3;pointer-events:none;left:${gemX}%;top:${gemY}%;transform:translate(-50%,-50%);filter:drop-shadow(0 0 12px ${map.pathColor}88);`;
    if (map.id === 2) gemEl.style.animation = 'rs-gem-pulse 1.2s ease-in-out infinite alternate';
    container.appendChild(gemEl);

    // SVG curva neon
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', W); svg.setAttribute('height', H);
    svg.style.cssText = `position:absolute;left:0;top:0;width:${W}px;height:100%;z-index:2;pointer-events:none;`;

    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    defs.innerHTML = `<filter id="rs-glow-${mapIdx}" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="4" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>`;
    svg.appendChild(defs);

    const pathBase = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    pathBase.setAttribute('d', pathD);
    pathBase.setAttribute('fill', 'none');
    pathBase.setAttribute('stroke', map.pathColor + '33');
    pathBase.setAttribute('stroke-width', '3');
    pathBase.setAttribute('stroke-linecap', 'round');
    svg.appendChild(pathBase);

    const pathNeon = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    pathNeon.setAttribute('d', pathD);
    pathNeon.setAttribute('fill', 'none');
    pathNeon.setAttribute('stroke', map.pathColor);
    pathNeon.setAttribute('stroke-width', '2.5');
    pathNeon.setAttribute('stroke-linecap', 'round');
    pathNeon.setAttribute('filter', `url(#rs-glow-${mapIdx})`);
    svg.appendChild(pathNeon);
    container.appendChild(svg);

    // ── Renderizar los 12 nodos desde RANK_MAP_CONFIG.nodeRewards ──
    const allNodeRewards = (window.RANK_MAP_CONFIG || {}).nodeRewards || [];
    const allRanksGlobal = window.RANKS || ranksSource;

    // Posición proporcional del avatar
    const playerPos = window._getPlayerNodePosition ? window._getPlayerNodePosition(currentXP, mapIdx) : { floatPos: 0 };
    const floatPos = playerPos.floatPos || 0;

    absNodes.forEach((pos, i) => {
        const reward = allNodeRewards[i];
        if (!reward) return;

        const isRankNode = reward.rankId !== null;
        const rank = isRankNode ? allRanksGlobal.find(r => r.id === reward.rankId) : null;
        const isReached = floatPos >= i;
        const isClaimed = window._isNodeClaimed ? window._isNodeClaimed(mapIdx, i) : false;
        const hasUnclaimed = isReached && reward.type !== 'none' && !isClaimed;

        // Color del nodo
        let nodeColor;
        if (isRankNode && rank) {
            nodeColor = isReached ? rank.color : 'rgba(255,255,255,0.18)';
        } else {
            nodeColor = isReached ? map.pathColor : 'rgba(255,255,255,0.18)';
        }

        const ncfg = (window.RANK_MAP_CONFIG || {}).node || {};
        const specialNodes = MAP_SPECIAL_NODES[mapIdx] || {};
        const isFirstNode = i === 0;
        const isLastNode = i === absNodes.length - 1;
        const specialDef = isFirstNode ? specialNodes.start : isLastNode ? specialNodes.end : null;
        const sz = specialDef ? specialDef.size : isRankNode ? (ncfg.sizePx || 42) : 28;

        const wrap = document.createElement('div');
        wrap.className = 'rsm-node' + (isRankNode ? ' rsm-rank-node' : '') + (isReached ? ' rsm-unlocked' : ' rsm-locked');
        wrap.style.cssText = `position:absolute;left:${pos.x.toFixed(1)}px;top:${pos.y.toFixed(1)}px;transform:translate(-50%,-50%);z-index:20;pointer-events:all;`;

        // Círculo del nodo
        const circle = document.createElement('div');
        circle.className = 'rsm-circle';
        const glowMult = specialDef ? specialDef.glow : (isRankNode ? 1 : 0.5);
        const glowStr = isReached
            ? `0 0 ${Math.round(16 * glowMult)}px ${nodeColor}99, 0 0 ${Math.round(32 * glowMult)}px ${nodeColor}44`
            : 'none';
        const borderW = specialDef ? (1.5 + specialDef.ring) : (isRankNode ? 2.5 : 1.5);
        const fontSize = specialDef ? Math.round(sz * 0.42) : (isRankNode ? 15 : 11);
        circle.style.cssText = `width:${sz}px;height:${sz}px;border-radius:50%;background:radial-gradient(circle at 35% 35%,${nodeColor}44,#000d);border:${borderW}px solid ${nodeColor};display:flex;align-items:center;justify-content:center;font-size:${fontSize}px;color:${nodeColor};box-shadow:${glowStr};transition:all .3s;`;
        if (specialDef && isReached) {
            for (let r = 0; r < specialDef.ring; r++) {
                const ring = document.createElement('div');
                const rSz = sz + 10 + r * 12;
                ring.style.cssText = `position:absolute;width:${rSz}px;height:${rSz}px;border-radius:50%;border:1px solid ${nodeColor}33;top:50%;left:50%;transform:translate(-50%,-50%);pointer-events:none;animation:rsm-ring-pulse ${1.2 + r * 0.3}s ease-in-out infinite alternate;`;
                wrap.appendChild(ring);
            }
        }
        // Ícono: especial para inicio/fin, emoji de rango para nodos de rango, punto para decorativos
        circle.textContent = specialDef ? specialDef.icon :
            (isRankNode && rank ? rank.emoji : '·');

        // Etiqueta para nodos especiales (inicio y fin de mapa)
        if (specialDef) {
            const label = document.createElement('div');
            label.innerHTML = `<div style="font-size:9px;font-weight:600;color:${isReached ? '#fff' : 'rgba(255,255,255,0.3)'};text-align:center;letter-spacing:2px;text-shadow:0 1px 6px #000;white-space:nowrap;margin-top:6px;">${specialDef.label}</div>`;
            wrap.appendChild(label);
        }

        // Badge "ACTUAL" si es el nodo de rango actual
        const isPlayerHere = currentXP === 0
            ? (i === 0)
            : (isRankNode && rank && rank.id === currentRank.id);
        if (isPlayerHere) {
            const badgeColor = isRankNode ? rank.color : map.pathColor;
            const badge = document.createElement('div');
            badge.style.cssText = `position:absolute;top:-22px;left:50%;transform:translateX(-50%);background:${badgeColor};color:#000;font-size:9px;font-weight:700;padding:2px 8px;border-radius:10px;white-space:nowrap;letter-spacing:1px;`;
            badge.textContent = 'ACTUAL';
            wrap.appendChild(badge);
        }

        // ── Indicador de recompensa pendiente (circulito clickeable encima) ──
        if (hasUnclaimed) {
            const rewardDot = document.createElement('div');
            const dotColor = reward.type === 'gems' ? '#00ffe7' : reward.type === 'skin' ? '#ffd700' : '#f4c842';
            const dotIcon = reward.type === 'gems' ? '💎' : reward.type === 'skin' ? '🏆' : '🪙';
            rewardDot.style.cssText = `position:absolute;top:${isRankNode ? -38 : -28}px;left:50%;transform:translateX(-50%);width:26px;height:26px;border-radius:50%;background:radial-gradient(circle,${dotColor}cc,${dotColor}66);border:2px solid ${dotColor};display:flex;align-items:center;justify-content:center;font-size:12px;cursor:pointer;z-index:25;pointer-events:all;animation:rsm-bounce .8s ease-in-out infinite alternate;box-shadow:0 0 10px ${dotColor}88;`;
            rewardDot.title = reward.label;
            rewardDot.textContent = dotIcon;
            rewardDot.onclick = (e) => {
                e.stopPropagation();
                window._showNodeRewardPopup(reward, () => {
                    window._claimNode(mapIdx, i);
                    // Quitar el indicador
                    rewardDot.style.display = 'none';
                    window.updateProfileBanner && window.updateProfileBanner();
                });
            };
            wrap.appendChild(rewardDot);
        }

        wrap.appendChild(circle);
        container.appendChild(wrap);
    });

    // ── Avatar del jugador posicionado proporcionalmente (usa la skin equipada) ──
    const avatarPos = window._getAvatarXY ? window._getAvatarXY(floatPos, absNodes) : (absNodes[0] || { x: 0, y: 0 });
    const acfg = (window.RANK_MAP_CONFIG || {}).avatar || {};
    const avSize = acfg.sizePx || 46;

    const equippedSkinId = localStorage.getItem('equippedSkin') || window._cachedEquippedSkin || 'cyan';
    const equippedSkin = (typeof window.findShopSkin === 'function') ? window.findShopSkin(equippedSkinId) : null;
    const skinImg = equippedSkin ? (equippedSkin.imageSide || equippedSkin.imageRight || equippedSkin.image) : null;
    const isRollingSkin = !!(equippedSkin && equippedSkin.rolling);

    const shadow = document.createElement('div');
    shadow.id = 'rsm-player-shadow';
    shadow.style.cssText = `position:absolute;left:${avatarPos.x.toFixed(1)}px;top:${avatarPos.y.toFixed(1)}px;transform:translate(-50%,16px);z-index:4;width:30px;height:8px;background:radial-gradient(ellipse,rgba(0,0,0,.6) 0%,transparent 70%);border-radius:50%;`;
    container.appendChild(shadow);

    const playerEl = document.createElement('div');
    playerEl.id = 'rsm-player-avatar';
    // Sin círculo de fondo/borde: la skin flota libre, con un glow sutil del color de rango como ancla visual
    playerEl.style.cssText = `position:absolute;left:${avatarPos.x.toFixed(1)}px;top:${avatarPos.y.toFixed(1)}px;transform:translate(-50%,-120%);z-index:10;width:${avSize}px;height:${avSize}px;display:flex;align-items:center;justify-content:center;filter:drop-shadow(0 0 10px ${currentRank.color}aa) drop-shadow(0 0 4px #000);`;
    if (skinImg) {
        const skinImgEl = document.createElement('img');
        skinImgEl.src = skinImg;
        skinImgEl.alt = 'skin';
        skinImgEl.style.cssText = `width:100%;height:100%;object-fit:contain;${isRollingSkin ? 'animation:rsm-skin-spin 2s linear infinite;' : ''}`;
        playerEl.appendChild(skinImgEl);
    } else if (equippedSkin && equippedSkin.emoji) {
        playerEl.innerHTML = `<span style="font-size:${Math.round(avSize * 0.7)}px;">${equippedSkin.emoji}</span>`;
    } else {
        playerEl.innerHTML = `<span style="font-size:${Math.round(avSize * 0.6)}px;line-height:${avSize}px;display:block;text-align:center;">👤</span>`;
    }
    container.appendChild(playerEl);

    // Verificar recompensas pendientes automáticamente al abrir (sin popup inmediato, solo muestra los dots)
    // Para reclamar en secuencia automática llamar: window._checkAndShowPendingRewards(mapIdx)

    // Nombre del mapa
    const mapNameEl = document.createElement('div');
    mapNameEl.style.cssText = `position:absolute;bottom:38px;left:50%;transform:translateX(-50%);font-size:11px;letter-spacing:3px;color:${map.pathColor}aa;text-transform:uppercase;z-index:20;white-space:nowrap;text-shadow:0 0 10px ${map.pathColor}66;`;
    mapNameEl.textContent = map.name;
    container.appendChild(mapNameEl);

    // Tabs de mapa
    const tabsEl = document.createElement('div');
    tabsEl.style.cssText = 'position:absolute;bottom:14px;left:50%;transform:translateX(-50%);display:flex;gap:10px;z-index:20;';
    tabsEl.innerHTML = MAP_DEFS.map((m, mi) => {
        const isActive = mi === mapIdx;
        const hasPlayer = m.rankIds.includes(currentRank.id);
        return `<button onclick="window._switchMap(${mi})" style="width:${isActive ? 32 : 10}px;height:10px;border-radius:5px;border:none;background:${isActive ? map.pathColor : hasPlayer ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.2)'};cursor:pointer;transition:all .3s;" title="${m.name}"></button>`;
    }).join('');
    container.appendChild(tabsEl);

    // ── Drag-to-scroll con mouse/touch ──
    // Ignora el inicio del drag si el gesto comienza sobre un nodo/dot
    // (evita que el scroll programático cancele el click sobre ellos).
    const scrollEl = document.getElementById('rs-map-scroll');
    if (scrollEl && !scrollEl._dragBound) {
        scrollEl._dragBound = true;
        let isDown = false, startX, scrollLeft;
        const isOnNode = (e) => !!(e.target && e.target.closest && e.target.closest('.rsm-node'));

        scrollEl.addEventListener('mousedown', e => {
            if (isOnNode(e)) return; // no iniciar drag sobre un nodo/dot
            isDown = true;
            startX = e.pageX - scrollEl.offsetLeft; scrollLeft = scrollEl.scrollLeft;
        });
        scrollEl.addEventListener('mouseleave', () => isDown = false);
        scrollEl.addEventListener('mouseup', () => isDown = false);
        scrollEl.addEventListener('mousemove', e => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - scrollEl.offsetLeft;
            scrollEl.scrollLeft = scrollLeft - (x - startX);
        });
        // Touch
        scrollEl.addEventListener('touchstart', e => {
            if (isOnNode(e)) { startX = null; return; } // no interferir con el tap sobre un nodo/dot
            startX = e.touches[0].pageX; scrollLeft = scrollEl.scrollLeft;
        }, { passive: true });
        scrollEl.addEventListener('touchmove', e => {
            if (startX == null) return; // gesto iniciado sobre un nodo: ignorar
            const dx = e.touches[0].pageX - startX;
            scrollEl.scrollLeft = scrollLeft - dx;
        }, { passive: true });

        // Rueda del mouse: scroll vertical se traduce en horizontal
        scrollEl.addEventListener('wheel', e => {
            const delta = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
            if (!delta) return;
            e.preventDefault();
            scrollEl.scrollLeft += delta;
        }, { passive: false });
    }


    // Auto-scroll al nodo actual
    setTimeout(() => {
        const scroll = document.getElementById('rs-map-scroll');
        const currentNodeIdx = Math.max(0, Math.min(absNodes.length - 1, Math.floor(floatPos)));
        if (!scroll || currentNodeIdx < 0 || !absNodes[currentNodeIdx]) return;
        const nodeX = absNodes[currentNodeIdx].x;
        const scrollTo = nodeX - scroll.offsetWidth / 2;
        scroll.scrollTo({ left: Math.max(0, scrollTo), behavior: 'smooth' });
    }, 120);

    // ── Flechas de navegación entre mapas ──
    // (scrollEl ya está declarado arriba en el bloque drag-to-scroll)

    // Flecha SIGUIENTE (solo si no es el último mapa)
    if (mapIdx < MAP_DEFS.length - 1) {
        const nextMap = MAP_DEFS[mapIdx + 1];
        const isMapComplete = !!(floatPos >= absNodes.length - 1);
        const arrowNext = document.createElement('div');
        arrowNext.id = 'rsm-arrow-next';
        arrowNext.style.cssText = `position:absolute;right:18px;top:50%;transform:translateY(-50%);z-index:30;display:flex;flex-direction:column;align-items:center;gap:6px;transition:opacity .5s;pointer-events:all;cursor:pointer;opacity:${isMapComplete ? '1' : '0'};`;
        arrowNext.innerHTML = `
            <div style="font-size:10px;letter-spacing:2px;color:${map.pathColor};text-transform:uppercase;text-shadow:0 0 8px ${map.pathColor}88;">${nextMap.name}</div>
            <div style="width:52px;height:52px;border-radius:50%;border:2px solid ${map.pathColor};background:radial-gradient(circle,${map.pathColor}33,transparent);display:flex;align-items:center;justify-content:center;font-size:26px;box-shadow:0 0 24px ${map.pathColor}99;${isMapComplete ? 'animation:rsm-bounce-h .9s ease-in-out infinite alternate;' : ''}">›</div>
            ${isMapComplete ? `<div style="font-size:9px;color:${map.pathColor};letter-spacing:1px;text-shadow:0 0 6px ${map.pathColor};">¡MAPA COMPLETO!</div>` : ''}
        `;
        arrowNext.onclick = () => window._switchMap(mapIdx + 1);
        container.appendChild(arrowNext);

        // Si el mapa NO está completo, la flecha aparece solo al llegar al final del scroll
        if (!isMapComplete && scrollEl) {
            setTimeout(() => {
                const checkScroll = () => {
                    const nearEnd = scrollEl.scrollLeft + scrollEl.clientWidth >= scrollEl.scrollWidth - 80;
                    arrowNext.style.opacity = nearEnd ? '0.4' : '0';
                    arrowNext.style.pointerEvents = nearEnd ? 'all' : 'none';
                };
                scrollEl.addEventListener('scroll', checkScroll, { passive: true });
                checkScroll();
            }, 300);
        }
    }

    // Flecha ANTERIOR (solo si no es el primer mapa)
    if (mapIdx > 0) {
        const prevMap = MAP_DEFS[mapIdx - 1];
        const arrowPrev = document.createElement('div');
        arrowPrev.id = 'rsm-arrow-prev';
        arrowPrev.style.cssText = `position:absolute;left:18px;top:50%;transform:translateY(-50%);z-index:30;display:flex;flex-direction:column;align-items:center;gap:6px;opacity:1;transition:opacity .5s;pointer-events:all;cursor:pointer;`;
        arrowPrev.innerHTML = `
            <div style="width:44px;height:44px;border-radius:50%;border:2px solid ${map.pathColor};background:radial-gradient(circle,${map.pathColor}22,transparent);display:flex;align-items:center;justify-content:center;font-size:22px;box-shadow:0 0 16px ${map.pathColor}66;animation:rsm-bounce-h-rev .9s ease-in-out infinite alternate;">‹</div>
            <div style="font-size:10px;letter-spacing:2px;color:${map.pathColor};text-transform:uppercase;text-shadow:0 0 8px ${map.pathColor}88;">${prevMap.name}</div>
        `;
        arrowPrev.onclick = () => window._switchMap(mapIdx - 1);
        container.appendChild(arrowPrev);

        // Desaparece al hacer scroll
        if (scrollEl) {
            setTimeout(() => {
                const hidePrev = () => {
                    const scrolled = scrollEl.scrollLeft > 60;
                    arrowPrev.style.opacity = scrolled ? '0' : '1';
                    arrowPrev.style.pointerEvents = scrolled ? 'none' : 'all';
                };
                scrollEl.addEventListener('scroll', hidePrev, { passive: true });
                hidePrev();
            }, 300);
        }
    }

    // Loop animación estrellas
    function drawBg() {
        ctx.clearRect(0, 0, W, H);
        stars.forEach(s => {
            s.a += s.da;
            if (s.a > 0.6 || s.a < 0.05) s.da *= -1;
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
            ctx.fillStyle = map.starColor.replace('{a}', s.a.toFixed(2));
            ctx.fill();
        });
        const screen = document.getElementById('ranksScreen');
        if (screen && screen.style.display !== 'none') {
            _mapRafId = requestAnimationFrame(drawBg);
        }
    }
    cancelAnimationFrame(_mapRafId);
    drawBg();
};

// ─────────────────────────────────────────────────────────────────────────────
// SISTEMA DE NODOS — posición proporcional, recompensas y popup
// ─────────────────────────────────────────────────────────────────────────────

// Devuelve el índice de nodo (0-11) donde debería estar el jugador según XP
// El avatar se interpola entre nodos según el % de XP entre dos rangos
window._getPlayerNodePosition = function (currentXP, mapIdx) {
    const cfg = window.RANK_MAP_CONFIG;
    if (!cfg) return { nodeIdx: 0, progress: 0 };

    const rewards = cfg.nodeRewards || [];
    const allRanks = window.RANKS || [];

    // En mapa 0, antes de alcanzar Hierro el jugador viaja gradualmente
    // del nodo ORIGEN (0) al nodo Cobre. Con XP=0 queda en el origen.
    if (mapIdx === 0) {
        const hierro = allRanks.find(r => r.id === 2);
        if (hierro && currentXP < hierro.threshold) {
            const cobreNodeIdx = rewards.findIndex(r => r.rankId === 1);
            const endNode = cobreNodeIdx >= 0 ? cobreNodeIdx : 2;
            const floatPos = currentXP === 0 ? 0 : (currentXP / hierro.threshold) * endNode;
            return { nodeIdx: Math.floor(floatPos), floatPos, progress: floatPos % 1 };
        }
    }
    const mapDef = MAP_DEFS[mapIdx];

    // Encontrar los nodos de rango del mapa actual
    const rankNodes = rewards
        .map((r, i) => ({ ...r, nodeIdx: i }))
        .filter(r => r.rankId !== null && mapDef.rankIds.includes(r.rankId));

    if (!rankNodes.length) return { nodeIdx: 0, progress: 0 };

    // ¿En qué par de rangos está el jugador?
    let currentRankNode = rankNodes[0];
    let nextRankNode = rankNodes[1] || null;

    for (let i = 0; i < rankNodes.length; i++) {
        const rank = allRanks.find(r => r.id === rankNodes[i].rankId);
        if (rank && currentXP >= rank.threshold) {
            currentRankNode = rankNodes[i];
            nextRankNode = rankNodes[i + 1] || null;
        }
    }

    // Si no hay siguiente rango en este mapa, está en el último nodo (fin de mapa)
    if (!nextRankNode) {
        const nodesPct = _getNodesPct(mapIdx);
        return { nodeIdx: nodesPct.length - 1, floatPos: nodesPct.length - 1, progress: 0 };
    }

    // Calcular % de progreso entre el rango actual y el siguiente
    const currentRank = allRanks.find(r => r.id === currentRankNode.rankId);
    const nextRank = allRanks.find(r => r.id === nextRankNode.rankId);
    if (!currentRank || !nextRank) return { nodeIdx: currentRankNode.nodeIdx, progress: 0 };

    const xpInSegment = currentXP - currentRank.threshold;
    const xpNeeded = nextRank.threshold - currentRank.threshold;
    const pct = Math.min(1, xpInSegment / xpNeeded); // 0.0 → 1.0

    // Interpolar: ¿qué nodo intermedio le toca?
    const startNode = currentRankNode.nodeIdx;
    const endNode = nextRankNode.nodeIdx;
    const totalNodes = endNode - startNode;
    const floatPos = startNode + pct * totalNodes;

    return {
        nodeIdx: Math.floor(floatPos),       // nodo donde está parado
        progress: floatPos % 1,              // % entre ese nodo y el siguiente
        floatPos                              // posición continua
    };
};

// Posición XY interpolada del avatar en el canvas
window._getAvatarXY = function (floatPos, absNodes) {
    if (!absNodes.length) return { x: 0, y: 0 };
    const i = Math.floor(floatPos);
    const frac = floatPos - i;
    const a = absNodes[Math.min(i, absNodes.length - 1)];
    const b = absNodes[Math.min(i + 1, absNodes.length - 1)];
    return {
        x: a.x + (b.x - a.x) * frac,
        y: a.y + (b.y - a.y) * frac
    };
};

// Mostrar popup de recompensa de nodo
window._showNodeRewardPopup = function (reward, onClaim) {
    const existing = document.getElementById('rsm-reward-popup');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.id = 'rsm-reward-popup';
    // Se agrega dentro de ranksScreen para que no quede flotando al salir
    overlay.style.cssText = `position:absolute;inset:0;z-index:9999;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.65);backdrop-filter:blur(4px);opacity:1;`;

    const isRank = reward.rankId !== null;
    const isSkin = reward.type === 'skin';
    const isGems = reward.type === 'gems';
    const isCoins = reward.type === 'coins';

    const currencyImg = isGems
        ? 'assets/UI/Rewards/Currency/Gems/Monton_de_gemas_Mediano.png'
        : isCoins
            ? 'assets/UI/Rewards/Currency/Coins/Monton_de_monedas_Mediano.png'
            : null;
    const icon = isSkin ? '🏆' : !currencyImg ? '⭐' : null;
    const color = isRank ? '#ffd700' : isGems ? '#00ffe7' : '#f4c842';
    const title = isRank ? '¡RANGO DESBLOQUEADO!' : '¡RECOMPENSA DEL CAMINO!';
    const iconHTML = currencyImg
        ? `<img src="${currencyImg}" alt="${reward.type}" style="width:72px;height:72px;object-fit:contain;margin:8px auto;display:block;filter:drop-shadow(0 0 10px ${color}88);">`
        : `<div style="font-size:52px;margin:8px 0;">${icon}</div>`;

    overlay.innerHTML = `
        <div id="rsm-reward-card" style="background:linear-gradient(135deg,#0a0a14,#12121e);border:2px solid ${color}44;border-radius:20px;padding:36px 40px;min-width:280px;max-width:360px;text-align:center;box-shadow:0 0 40px ${color}33,0 8px 32px #000a;position:relative;animation:rsm-pop-in .22s cubic-bezier(.2,1.4,.4,1);">
            <div style="font-size:11px;letter-spacing:4px;color:${color};margin-bottom:12px;text-transform:uppercase;">${title}</div>
            ${iconHTML}
            <div style="font-size:22px;font-weight:700;color:#fff;margin:12px 0 4px;">${reward.label}</div>
            ${isRank ? `<div style="font-size:12px;color:rgba(255,255,255,0.5);margin-bottom:20px;">Has alcanzado un nuevo rango</div>` : `<div style="font-size:12px;color:rgba(255,255,255,0.5);margin-bottom:20px;">Nodo del camino desbloqueado</div>`}
            <button id="rsm-claim-btn" style="background:linear-gradient(135deg,${color},${color}88);color:#000;font-weight:700;font-size:14px;letter-spacing:2px;padding:12px 32px;border:none;border-radius:12px;cursor:pointer;width:100%;text-transform:uppercase;">
                ${isSkin ? 'RECLAMAR SKIN' : 'RECLAMAR'}
            </button>
        </div>
    `;

    // Agregar dentro de ranksScreen (no en body)
    const ranksScreenEl = document.getElementById('ranksScreen');
    (ranksScreenEl || document.body).appendChild(overlay);

    document.getElementById('rsm-claim-btn').onclick = () => {
        // Dar la recompensa real
        if (isCoins) {
            const cur = parseInt(localStorage.getItem('deadCoins') || '0', 10);
            localStorage.setItem('deadCoins', cur + reward.amount);
            window.playerData && (window.playerData.deadCoins = cur + reward.amount);
        } else if (isGems) {
            const cur = parseInt(localStorage.getItem('gems') || '0', 10);
            localStorage.setItem('gems', cur + reward.amount);
            window.playerData && (window.playerData.gems = cur + reward.amount);
        } else if (isSkin) {
            const owned = JSON.parse(localStorage.getItem('ownedSkins') || '[]');
            if (!owned.includes(reward.skinId)) {
                owned.push(reward.skinId);
                localStorage.setItem('ownedSkins', JSON.stringify(owned));
            }
        }
        overlay.style.opacity = '0';
        overlay.style.transition = 'opacity .2s';
        setTimeout(() => { overlay.remove(); onClaim && onClaim(); }, 200);
    };

};

// Marcar un nodo como reclamado en localStorage
window._claimNode = function (mapIdx, nodeIdx) {
    const key = `rsm_claimed_m${mapIdx}_n${nodeIdx}`;
    localStorage.setItem(key, '1');
};

window._isNodeClaimed = function (mapIdx, nodeIdx) {
    return localStorage.getItem(`rsm_claimed_m${mapIdx}_n${nodeIdx}`) === '1';
};

// Verificar si hay nodos nuevos por reclamar y mostrarlos en secuencia
window._checkAndShowPendingRewards = function (mapIdx) {
    const cfg = window.RANK_MAP_CONFIG;
    if (!cfg || !cfg.nodeRewards) return;
    const currentXP = window.rankSystem ? window.rankSystem.getXP() : 0;
    const currentRank = window.rankSystem ? window.rankSystem.getCurrentRank() : { id: 1 };
    const allRanks = window.RANKS || [];
    const mapDef = MAP_DEFS[mapIdx];
    const pos = window._getPlayerNodePosition(currentXP, mapIdx);

    // Nodos alcanzados = todos hasta floatPos (redondeado)
    const reachedUpTo = Math.floor(pos.floatPos);

    // Buscar nodos alcanzados y no reclamados con recompensa
    const pending = [];
    for (let i = 0; i <= reachedUpTo; i++) {
        const reward = cfg.nodeRewards[i];
        if (!reward || reward.type === 'none') continue;
        if (window._isNodeClaimed(mapIdx, i)) continue;
        // Para nodos de rango, verificar que realmente tiene ese rango
        if (reward.rankId !== null) {
            const rank = allRanks.find(r => r.id === reward.rankId);
            if (!rank || currentXP < rank.threshold) continue;
        }
        pending.push({ i, reward });
    }

    if (!pending.length) return;

    // Mostrar en secuencia
    let idx = 0;
    function showNext() {
        if (idx >= pending.length) {
            // Refrescar UI de monedas/gemas después de reclamar todo
            window.updateProfileBanner && window.updateProfileBanner();
            return;
        }
        const { i, reward } = pending[idx];
        window._showNodeRewardPopup(reward, () => {
            window._claimNode(mapIdx, i);
            idx++;
            setTimeout(showNext, 200);
        });
    }
    showNext();
};

window._switchMap = function (mi) {
    const currentXP = window.rankSystem ? window.rankSystem.getXP() : 0;
    const currentRank = window.rankSystem ? window.rankSystem.getCurrentRank() : { id: 1, name: 'Chispa', color: '#aaa', emoji: '✦', threshold: 0 };
    const allRanks = window.RANKS || [];
    _activeMap = mi;
    window._renderRankMap(mi, currentXP, currentRank, allRanks);
};

// Inyectar CSS de animaciones del mapa
(function () {
    if (document.getElementById('rs-map-styles')) return;
    const s = document.createElement('style');
    s.id = 'rs-map-styles';
    s.textContent = `
        @keyframes rs-gem-pulse {
            from { transform:translate(-50%,-50%) scale(1) rotate(-3deg); filter:drop-shadow(0 0 8px #ff8c0088); }
            to   { transform:translate(-50%,-50%) scale(1.07) rotate(3deg); filter:drop-shadow(0 0 20px #ff8c00cc); }
        }
        .rsm-node { transition: transform .2s; }
        .rsm-circle {
            transform: scaleY(0.58);
            transform-origin: 50% 50%;
        }
        .rsm-node:hover .rsm-circle { transform: scaleY(0.58) scale(1.12); }
        .rsm-rank-node .rsm-circle { animation: rs-node-pulse 2s ease-in-out infinite; }
        @keyframes rs-node-pulse {
            0%,100% { box-shadow: 0 0 16px currentColor, 0 0 6px #000; }
            50%      { box-shadow: 0 0 28px currentColor, 0 0 10px #000; }
        }
        @keyframes rsm-bounce {
            from { transform: translateX(-50%) translateY(0px); }
            to   { transform: translateX(-50%) translateY(-5px); }
        }
        @keyframes rsm-bounce-h {
            from { transform: translateX(0px); }
            to   { transform: translateX(5px); }
        }
        @keyframes rsm-bounce-h-rev {
            from { transform: translateX(0px); }
            to   { transform: translateX(-5px); }
        }
        @keyframes rsm-ring-pulse {
            from { opacity: 0.5; transform: translate(-50%,-50%) scale(1); }
            to   { opacity: 0.1; transform: translate(-50%,-50%) scale(1.08); }
        }
        @keyframes rsm-pop-in {
            from { transform: scale(0.85); opacity: 0; }
            to   { transform: scale(1);    opacity: 1; }
        }
        /* Barra XP más visible */
        .rs-xp-bar-row {
            padding: 8px 28px 10px !important;
            background: rgba(0,0,0,0.4) !important;
            border-bottom: 1px solid rgba(255,255,255,0.08) !important;
        }
        .rs-current-bar {
            height: 7px !important;
            background: rgba(255,255,255,0.08) !important;
            border-radius: 4px !important;
            overflow: hidden;
        }
        .rs-current-bar-fill {
            height: 100% !important;
            border-radius: 4px !important;
            transition: width 0.6s cubic-bezier(.4,0,.2,1) !important;
            box-shadow: 0 0 8px currentColor !important;
        }
        .rs-current-xp-info {
            font-size: 11px !important;
            white-space: nowrap;
            flex-shrink: 0;
            line-height: 1.4;
        }
        @keyframes rsm-skin-spin {
            from { transform: rotate(0deg); }
            to   { transform: rotate(360deg); }
        }
        @keyframes rsm-pop-in {
            from { transform: scale(0.85); opacity: 0; }
            to   { transform: scale(1); opacity: 1; }
        }
    `;
    document.head.appendChild(s);
})();