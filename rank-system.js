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
        { id: 1, name: "Chispa", threshold: 0, color: "#aaaaaa", emoji: "✦" },
        { id: 2, name: "Brillo Opaco", threshold: 100, color: "#c8b89a", emoji: "◈" },
        { id: 3, name: "Reflejo", threshold: 300, color: "#b0c4de", emoji: "◇" },
        { id: 4, name: "Bronce", threshold: 600, color: "#cd7f32", emoji: "⬡" },
        { id: 5, name: "Cuantium Básico", threshold: 1000, color: "#5bc8e8", emoji: "⬢" },
        { id: 6, name: "Cuantium Templado", threshold: 1500, color: "#00bfff", emoji: "⬡" },
        { id: 7, name: "Acero", threshold: 2200, color: "#c0c0c0", emoji: "⬢" },
        { id: 8, name: "Pulso Morado", threshold: 3000, color: "#cc44ff", emoji: "◉" },
        { id: 9, name: "Sombra", threshold: 4000, color: "#7700cc", emoji: "◈" },
        { id: 10, name: "Oro", threshold: 5500, color: "#ffd700", emoji: "★" },
        { id: 11, name: "Verdor", threshold: 7500, color: "#00ff88", emoji: "◆" },
        { id: 12, name: "Aura de Élite", threshold: 10000, color: "#ff8800", emoji: "❋" },
        { id: 13, name: "Diamante", threshold: 13000, color: "#00ffe7", emoji: "◈" },
        { id: 14, name: "Custodio Dorado", threshold: 17000, color: "#ffee44", emoji: "⚜" },
        { id: 15, name: "Gran Prisma", threshold: 22000, color: "#ff66ff", emoji: "✦" },
        { id: 16, name: "Maestro de Reyes", threshold: 28000, color: "#ff4444", emoji: "♛" },
        { id: 17, name: "Omnipotente", threshold: 35000, color: "#ffffff", emoji: "⚡" }
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
                // Toast visual si existe la función
                if (typeof window.showToast === 'function') {
                    window.showToast(`¡RANGO SUBIDO! ${newRank.emoji} ${newRank.name}`, 3500);
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
        window.buildRanksScreen();
        // Hide overlay if open
        const overlay = document.getElementById('overlay');
        if (overlay) overlay.style.display = 'none';
    } catch (e) { console.warn('[RankSystem] openRanksScreen:', e); }
};

window.closeRanksScreen = function () {
    try {
        const screen = document.getElementById('ranksScreen');
        if (screen) screen.style.display = 'none';
        const overlay = document.getElementById('overlay');
        if (overlay) overlay.style.display = 'flex';
    } catch (e) { }
};

window.buildRanksScreen = function () {
    try {
        const currentXP = window.rankSystem ? window.rankSystem.getXP() : 0;
        const currentRank = window.rankSystem ? window.rankSystem.getCurrentRank() : { name: 'Chispa', color: '#aaa', emoji: '✦', threshold: 0 };
        const nextRank = window.rankSystem ? window.rankSystem.getNextRank() : null;
        const progress = window.rankSystem ? window.rankSystem.getRankProgress() : 0;

        // Update header XP
        const xpEl = document.getElementById('rs-player-xp');
        if (xpEl) xpEl.textContent = currentXP.toLocaleString();

        // Update current rank banner
        const nameEl = document.getElementById('rs-current-name');
        if (nameEl) {
            nameEl.textContent = `${currentRank.emoji} ${currentRank.name}`;
            nameEl.style.color = currentRank.color;
        }

        const barFill = document.getElementById('rs-current-bar-fill');
        if (barFill) { barFill.style.width = (progress * 100).toFixed(1) + '%'; barFill.style.background = `linear-gradient(90deg, ${currentRank.color}, ${currentRank.color}88)`; }

        const xpInfo = document.getElementById('rs-current-xp-info');
        if (xpInfo) {
            if (nextRank) {
                const needed = nextRank.threshold - currentXP;
                xpInfo.textContent = `${currentXP.toLocaleString()} XP · Próximo: ${nextRank.name} (${needed.toLocaleString()} XP falta)`;
            } else {
                xpInfo.textContent = `${currentXP.toLocaleString()} XP · ¡Rango máximo alcanzado!`;
            }
        }

        // Avatar + nombre + monedas en el mini banner
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

        // Build rank nodes
        const ranks = window.RANKS || [];
        const container = document.getElementById('rs-map-inner');
        if (!container || !ranks.length) return;

        container.innerHTML = '';

        // Render from last to first (top = highest rank, like a goal path)
        const reversed = [...ranks].reverse();
        reversed.forEach((rank, i) => {
            const isUnlocked = currentXP >= rank.threshold;
            const isCurrent = rank.id === currentRank.id;
            const isLocked = !isUnlocked;

            const node = document.createElement('div');
            node.className = `rs-node ${isUnlocked ? 'unlocked' : ''} ${isCurrent ? 'current' : ''} ${isLocked ? 'locked' : ''}`;

            node.innerHTML = `
                <div class="rs-node-card">
                    <div class="rs-node-circle" style="color:${rank.color}; border-color:${rank.color}44;">
                        ${rank.emoji}
                    </div>
                    <div class="rs-node-text">
                        <div class="rs-node-name" style="color:${isLocked ? 'rgba(255,255,255,0.35)' : '#fff'}">${rank.name}</div>
                        <div class="rs-node-xp">${rank.threshold === 0 ? 'Inicio' : rank.threshold.toLocaleString() + ' XP'}</div>
                    </div>
                    ${isCurrent ? '<div class="rs-node-badge">ACTUAL</div>' : ''}
                </div>
            `;

            container.appendChild(node);
        });

        // Scroll to current rank node
        setTimeout(() => {
            const currentNode = container.querySelector('.rs-node.current');
            if (currentNode) {
                currentNode.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }, 150);

        // Particle canvas
        window.initRanksParticles?.();

    } catch (e) { console.warn('[RankSystem] buildRanksScreen:', e); }
};

// Partículas de fondo para la pantalla de rangos
window.initRanksParticles = function () {
    try {
        const canvas = document.getElementById('ranksParticleCanvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;

        const particles = Array.from({ length: 60 }, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            r: Math.random() * 1.5 + 0.3,
            vx: (Math.random() - 0.5) * 0.3,
            vy: (Math.random() - 0.5) * 0.3,
            alpha: Math.random() * 0.4 + 0.05,
        }));

        let rafId;
        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(0,255,231,${p.alpha})`;
                ctx.fill();
                p.x += p.vx;
                p.y += p.vy;
                if (p.x < 0) p.x = canvas.width;
                if (p.x > canvas.width) p.x = 0;
                if (p.y < 0) p.y = canvas.height;
                if (p.y > canvas.height) p.y = 0;
            });
            const screen = document.getElementById('ranksScreen');
            if (screen && screen.style.display !== 'none') {
                rafId = requestAnimationFrame(draw);
            }
        }
        cancelAnimationFrame(rafId);
        draw();
    } catch (e) { }
};