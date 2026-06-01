// =====================================================
// PROGRESION: estadisticas, logros, misiones diarias, combo
// =====================================================
(function () {
    const STORAGE_KEY = 'gemProgression_v1';
    const MISSIONS_PER_DAY = 3;

    const DEFAULT_STATE = {
        stats: {
            deaths: 0,
            wins: 0,
            levelsCompleted: 0,
            coinsCollected: 0,
            rubiesCollected: 0,
            powerupsUsed: 0,
            gamesPlayed: 0,
            survivalBestSec: 0,
            maxCombo: 0,
            shopPurchases: 0,
            dailyClaims: 0,
            chestsOpened: 0
        },
        achievements: {},
        missions: { date: '', items: [] },
        claimedMissionIds: [],
        dailyProgress: { date: '', wins: 0, games: 0, coins: 0, rubies: 0, maxCombo: 0, survivalSec: 0 }
    };

    const ACHIEVEMENTS = [
        { id: 'first_win', tier: 'facil', title: 'Primera victoria', desc: 'Completa un nivel.', goal: 1, stat: 'wins', reward: { coins: 80, gems: 2 } },
        { id: 'games_3', tier: 'facil', title: 'Calentamiento', desc: 'Inicia 3 partidas.', goal: 3, stat: 'gamesPlayed', reward: { coins: 100 } },
        { id: 'coins_50', tier: 'facil', title: 'Bolsillo pesado', desc: 'Recoge 50 monedas.', goal: 50, stat: 'coinsCollected', reward: { coins: 120 } },
        { id: 'rubies_5', tier: 'facil', title: 'Brillo rojo', desc: 'Recoge 5 rubies.', goal: 5, stat: 'rubiesCollected', reward: { gems: 5 } },
        { id: 'powerups_3', tier: 'facil', title: 'Chispa inicial', desc: 'Usa potenciadores 3 veces.', goal: 3, stat: 'powerupsUsed', reward: { powerupUses: ['proteccion', 'vida_extra'], powerupUseAmount: 1 } },
        { id: 'chest_1', tier: 'facil', title: 'Primer cofre', desc: 'Abre tu primer cofre.', goal: 1, stat: 'chestsOpened', reward: { coins: 90, gems: 1 } },
        { id: 'wins_5', tier: 'medio', title: 'En racha', desc: 'Gana 5 niveles.', goal: 5, stat: 'wins', reward: { coins: 200, gems: 5 } },
        { id: 'wins_15', title: 'Veterano', desc: 'Gana 15 niveles.', goal: 15, stat: 'wins', reward: { coins: 500, gems: 12 } },
        { id: 'deaths_10', title: 'Persistente', desc: 'Muere 10 veces (sigue intentando).', goal: 10, stat: 'deaths', reward: { coins: 120 } },
        { id: 'coins_100', title: 'Cazatesoros', desc: 'Recoge 100 monedas en partida.', goal: 100, stat: 'coinsCollected', reward: { coins: 150, gems: 3 } },
        { id: 'rubies_10', title: 'Brillo rojo', desc: 'Recoge 10 rubies en partida.', goal: 10, stat: 'rubiesCollected', reward: { gems: 8 } },
        { id: 'powerups_5', title: 'Potenciado', desc: 'Usa potenciadores 5 veces.', goal: 5, stat: 'powerupsUsed', reward: { powerupUses: ['proteccion', 'fantasma', 'vida_extra'], powerupUseAmount: 2 } },
        { id: 'combo_5', title: 'Esquivador', desc: 'Alcanza racha x5 sin recibir daño.', goal: 5, stat: 'maxCombo', reward: { coins: 220, gems: 4 } },
        { id: 'survival_60', title: 'Superviviente', desc: 'Aguanta 60 s en modo supervivencia.', goal: 60, stat: 'survivalBestSec', reward: { gems: 15, coins: 300 } },
        { id: 'shop_1', tier: 'facil', title: 'Primera compra', desc: 'Realiza una compra en tienda.', goal: 1, stat: 'shopPurchases', reward: { coins: 80, chest: 'basic', chestCount: 1 } },
        { id: 'coins_250', tier: 'medio', title: 'Cazatesoros II', desc: 'Recoge 250 monedas.', goal: 250, stat: 'coinsCollected', reward: { coins: 240, gems: 3 } },
        { id: 'rubies_25', tier: 'medio', title: 'Recolector ruby', desc: 'Recoge 25 rubies.', goal: 25, stat: 'rubiesCollected', reward: { gems: 10 } },
        { id: 'powerups_15', tier: 'medio', title: 'Potenciado II', desc: 'Usa potenciadores 15 veces.', goal: 15, stat: 'powerupsUsed', reward: { powerupUses: ['proteccion', 'fantasma', 'vida_extra'], powerupUseAmount: 2 } },
        { id: 'chests_5', tier: 'medio', title: 'Cerrajero', desc: 'Abre 5 cofres.', goal: 5, stat: 'chestsOpened', reward: { coins: 260, chest: 'special', chestCount: 1 } },
        { id: 'daily_3', title: 'Fiel', desc: 'Reclama 3 regalos diarios.', goal: 3, stat: 'dailyClaims', reward: { gems: 10, banner: 'Speed_Color_Green', bannerCover: 'assets/Imagenes/Banners/Placeholders/Speed_Color_Green.png' } },
        { id: 'games_20', tier: 'medio', title: 'Adicto a la esfera', desc: 'Inicia 20 partidas.', goal: 20, stat: 'gamesPlayed', reward: { coins: 400, gems: 6 } },
        { id: 'wins_25', tier: 'dificil', title: 'Veterano real', desc: 'Gana 25 niveles.', goal: 25, stat: 'wins', reward: { coins: 650, gems: 16 } },
        { id: 'games_75', tier: 'dificil', title: 'Orbita eterna', desc: 'Inicia 75 partidas.', goal: 75, stat: 'gamesPlayed', reward: { coins: 850, gems: 18 } },
        { id: 'coins_1500', tier: 'dificil', title: 'Tesoro oscuro', desc: 'Recoge 1500 monedas.', goal: 1500, stat: 'coinsCollected', reward: { coins: 1200, gems: 25 } },
        { id: 'rubies_150', tier: 'dificil', title: 'Mina ruby', desc: 'Recoge 150 rubies.', goal: 150, stat: 'rubiesCollected', reward: { gems: 45 } },
        { id: 'combo_12', tier: 'dificil', title: 'Intocable', desc: 'Alcanza racha x12.', goal: 12, stat: 'maxCombo', reward: { coins: 900, gems: 20 } },
        { id: 'survival_300', tier: 'dificil', title: 'Superviviente real', desc: 'Aguanta 5 minutos en modo supervivencia.', goal: 300, stat: 'survivalBestSec', reward: { gems: 60, coins: 1500 } },
        { id: 'powerups_75', tier: 'dificil', title: 'Maestro de energia', desc: 'Usa potenciadores 75 veces.', goal: 75, stat: 'powerupsUsed', reward: { powerupUses: ['proteccion', 'fantasma', 'vida_extra', 'stop_time'], powerupUseAmount: 5 } }
    ];

    const MISSION_POOL = [
        { id: 'win_1', type: 'wins_session', goal: 1, label: 'Gana 1 nivel hoy', reward: { coins: 90, rubyXp: 40 } },
        { id: 'win_2', type: 'wins_session', goal: 2, label: 'Gana 2 niveles hoy', reward: { coins: 160, rubyXp: 70 } },
        { id: 'coins_25', type: 'coins_session', goal: 25, label: 'Recoge 25 monedas en partida', reward: { coins: 110 } },
        { id: 'coins_50', type: 'coins_session', goal: 50, label: 'Recoge 50 monedas en partida', reward: { coins: 200, gems: 2 } },
        { id: 'rubies_3', type: 'rubies_session', goal: 3, label: 'Recoge 3 rubies en partida', reward: { gems: 4, rubyXp: 50 } },
        { id: 'play_2', type: 'games_session', goal: 2, label: 'Juega 2 partidas hoy', reward: { coins: 80, rubyXp: 30 } },
        { id: 'play_3', type: 'games_session', goal: 3, label: 'Juega 3 partidas hoy', reward: { coins: 140, rubyXp: 55 } },
        { id: 'combo_3', type: 'combo_session', goal: 3, label: 'Llega a racha x3 en una partida', reward: { coins: 130, gems: 1 } },
        { id: 'survival_30', type: 'survival_session', goal: 30, label: 'Supervivencia: 30 segundos', reward: { coins: 250, gems: 3 } }
    ];

    const ACHIEVEMENT_ICONS = {
        first_win: '🏆',
        wins_5: '🔥',
        wins_15: '👑',
        deaths_10: '💀',
        coins_100: '🪙',
        rubies_10: '💎',
        powerups_5: '⚡',
        combo_5: '✨',
        survival_60: '⏱️',
        shop_1: '🛒',
        daily_3: '🎁',
        games_20: '🎮'
    };

    const RUBY_PASS_SEASON = {
        id: 'prelaunch_01',
        name: 'Temporada Beta',
        kicker: 'PASE DE TEMPORADA',
        subtitle: 'Pre-lanzamiento · recompensas en desarrollo',
        endsLabel: 'Activa hasta el lanzamiento oficial'
    };

    let state = load();
    let session = freshSession();

    function load() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return JSON.parse(JSON.stringify(DEFAULT_STATE));
            const parsed = JSON.parse(raw);
            return {
                stats: { ...DEFAULT_STATE.stats, ...(parsed.stats || {}) },
                achievements: parsed.achievements || {},
                missions: parsed.missions || { date: '', items: [] },
                claimedMissionIds: parsed.claimedMissionIds || [],
                dailyProgress: { ...DEFAULT_STATE.dailyProgress, ...(parsed.dailyProgress || {}) }
            };
        } catch {
            return JSON.parse(JSON.stringify(DEFAULT_STATE));
        }
    }

    function save() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }

    function freshSession() {
        return {
            wins: 0,
            coins: 0,
            rubies: 0,
            games: 0,
            maxCombo: 0,
            survivalSec: 0,
            isSurvival: false
        };
    }

    function todayKey() {
        const d = new Date();
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    }

    function rollDailyMissions() {
        const key = todayKey();
        if (state.missions.date === key && state.missions.items.length === MISSIONS_PER_DAY) {
            return state.missions.items;
        }
        const pool = [...MISSION_POOL].sort(() => Math.random() - 0.5);
        const picked = pool.slice(0, MISSIONS_PER_DAY).map(m => ({
            ...m,
            progress: 0,
            done: false,
            claimed: false
        }));
        state.missions = { date: key, items: picked };
        state.claimedMissionIds = state.claimedMissionIds.filter(id => picked.some(p => p.id === id));
        save();
        return picked;
    }

    function getMissions() {
        rollDailyMissions();
        return state.missions.items;
    }

    function pendingMissionCount() {
        return getMissions().filter(m => m.done && !m.claimed).length;
    }

    function grantReward(reward) {
        if (!reward) return;
        if (reward.coins) {
            const c = parseInt(localStorage.getItem('deadCoins') || '0', 10) + reward.coins;
            localStorage.setItem('deadCoins', String(c));
            if (window.playerData) window.playerData.deadCoins = c;
        }
        if (reward.gems) {
            const g = parseInt(localStorage.getItem('gems') || '0', 10) + reward.gems;
            localStorage.setItem('gems', String(g));
            if (window.playerData) window.playerData.gems = g;
        }
        if (reward.rubyXp && typeof window.addRubyPassXp === 'function') {
            window.addRubyPassXp(reward.rubyXp);
        }
        if (reward.chest) {
            const key = 'invChest_' + reward.chest;
            const n = parseInt(localStorage.getItem(key) || '0', 10) + (reward.chestCount || 1);
            localStorage.setItem(key, String(n));
        }
        if (reward.banner) {
            localStorage.setItem('banner_' + reward.banner, 'true');
        }
        if (Array.isArray(reward.powerupUses) && window.readPowerups && window.savePowerups) {
            const inv = window.readPowerups();
            reward.powerupUses.forEach(entry => {
                const id = typeof entry === 'string' ? entry : entry.id;
                const amount = typeof entry === 'string' ? (reward.powerupUseAmount || 2) : (entry.amount || 2);
                if (!inv[id]) inv[id] = { desbloqueado: true, usos: 0, nivel: 1 };
                inv[id].desbloqueado = true;
                inv[id].usos = (inv[id].usos || 0) + amount;
            });
            window.savePowerups(inv);
        }
        window.updateMenuHUD?.();
        const sc = document.getElementById('shop-coins');
        const sg = document.getElementById('shop-gems');
        if (sc) sc.textContent = localStorage.getItem('deadCoins') || '0';
        if (sg) sg.textContent = localStorage.getItem('gems') || '0';
    }

    function isAchievementClaimed(id) {
        return state.achievements[id]?.claimed === true;
    }

    function isAchievementUnlocked(id) {
        return !!state.achievements[id];
    }

    function unlockAchievement(ach) {
        if (state.achievements[ach.id]) return;
        state.achievements[ach.id] = { unlockedAt: Date.now(), claimed: false };
        save();
        refreshMissionChip();
        window.handleAchievementUnlocked?.(ach);
    }

    function claimAchievementReward(id) {
        const ach = ACHIEVEMENTS.find(a => a.id === id);
        const entry = state.achievements[id];
        if (!ach || !entry || entry.claimed) return false;
        entry.claimed = true;
        entry.claimedAt = Date.now();
        grantReward(ach.reward);
        save();
        window.playSfx?.('reward', 0.88);
        window.refreshAchievementNavHints?.();
        return true;
    }

    function getUnclaimedAchievementIds() {
        return ACHIEVEMENTS.filter(a => state.achievements[a.id] && !state.achievements[a.id].claimed).map(a => a.id);
    }

    function checkAchievements() {
        ACHIEVEMENTS.forEach(ach => {
            if (state.achievements[ach.id]) return;
            const val = state.stats[ach.stat] || 0;
            if (val >= ach.goal) unlockAchievement(ach);
        });
    }

    function bumpStat(key, amount = 1) {
        state.stats[key] = (state.stats[key] || 0) + amount;
        save();
        checkAchievements();
    }

    function ensureDailyProgress() {
        const key = todayKey();
        if (state.dailyProgress.date !== key) {
            state.dailyProgress = { date: key, wins: 0, games: 0, coins: 0, rubies: 0, maxCombo: 0, survivalSec: 0 };
            save();
        }
    }

    function updateMissionProgress() {
        ensureDailyProgress();
        const d = state.dailyProgress;
        getMissions().forEach(m => {
            if (m.claimed || m.done) return;
            let progress = 0;
            switch (m.type) {
                case 'wins_session': progress = d.wins; break;
                case 'coins_session': progress = d.coins; break;
                case 'rubies_session': progress = d.rubies; break;
                case 'games_session': progress = d.games; break;
                case 'combo_session': progress = Math.max(d.maxCombo, session.maxCombo); break;
                case 'survival_session': progress = Math.max(d.survivalSec, Math.floor(session.survivalSec)); break;
                default: break;
            }
            m.progress = Math.min(m.goal, progress);
            if (m.progress >= m.goal) m.done = true;
        });
        save();
        refreshMissionChip();
    }

    Object.keys(state.achievements).forEach(id => {
        if (state.achievements[id].claimed === undefined) {
            state.achievements[id].claimed = true;
        }
    });
    save();

    const REWARD_ICONS = {
        coin: 'assets/Imagenes/Monetizacion/DEAD_COIN.png',
        gem: 'assets/Imagenes/Monetizacion/Rubies.png'
    };

    function describeReward(reward) {
        if (!reward) return { label: 'Recompensa', icons: [] };
        const icons = [];
        const parts = [];
        if (reward.coins) {
            icons.push({ src: REWARD_ICONS.coin });
            parts.push(`${reward.coins} monedas`);
        }
        if (reward.gems) {
            icons.push({ src: REWARD_ICONS.gem });
            parts.push(`${reward.gems} rubies`);
        }
        if (reward.chest) {
            icons.push({ emoji: '📦' });
            parts.push(`Cofre ${reward.chest}`);
        }
        if (reward.banner) {
            if (reward.bannerCover) icons.push({ src: reward.bannerCover });
            else icons.push({ emoji: '🏳️' });
            parts.push('Banner tienda');
        }
        if (Array.isArray(reward.powerupUses)) {
            reward.powerupUses.slice(0, 3).forEach(id => {
                icons.push({ src: `assets/powerups/icons/${id}.png` });
            });
            parts.push('Pack potenciadores');
        }
        if (reward.rubyXp) parts.push(`+${reward.rubyXp} XP pase`);
        return { label: parts.join(' · ') || 'Recompensa', icons };
    }

    function claimMission(missionId) {
        const m = getMissions().find(x => x.id === missionId);
        if (!m || !m.done || m.claimed) return false;
        m.claimed = true;
        grantReward(m.reward);
        save();
        refreshMissionChip();
        window.playSfx?.('reward', 0.85);
        return true;
    }

    window.Progression = {
        getStats: () => ({ ...state.stats }),
        getAchievements: () => ACHIEVEMENTS.map(a => {
            const entry = state.achievements[a.id];
            return {
                ...a,
                name: a.title,
                description: a.desc,
                icon: ACHIEVEMENT_ICONS[a.id] || '★',
                unlocked: !!entry,
                claimable: !!entry && !entry.claimed,
                claimed: !!entry?.claimed,
                current: state.stats[a.stat] || 0
            };
        }),
        claimAchievementReward,
        getUnclaimedAchievementIds,
        describeReward: describeReward,
        getMissions,
        claimMission,
        pendingMissionCount,
        getRubyPassSeason: () => RUBY_PASS_SEASON,
        trackGameStart(levelConfig) {
            session = freshSession();
            session.isSurvival = !!(levelConfig && levelConfig.isSurvival);
            ensureDailyProgress();
            state.dailyProgress.games++;
            save();
            bumpStat('gamesPlayed');
            updateMissionProgress();
        },
        trackWin() {
            session.wins++;
            ensureDailyProgress();
            state.dailyProgress.wins++;
            save();
            bumpStat('wins');
            bumpStat('levelsCompleted');
            updateMissionProgress();
        },
        trackDeath() {
            bumpStat('deaths');
            if (session.isSurvival && session.survivalSec > 0) {
                if (session.survivalSec > (state.stats.survivalBestSec || 0)) {
                    state.stats.survivalBestSec = Math.floor(session.survivalSec);
                    save();
                    checkAchievements();
                }
            }
            updateMissionProgress();
        },
        trackCoins(n = 1) {
            session.coins += n;
            ensureDailyProgress();
            state.dailyProgress.coins += n;
            save();
            bumpStat('coinsCollected', n);
            updateMissionProgress();
        },
        trackRubies(n = 1) {
            session.rubies += n;
            ensureDailyProgress();
            state.dailyProgress.rubies += n;
            save();
            bumpStat('rubiesCollected', n);
            updateMissionProgress();
        },
        trackPowerupUse() {
            bumpStat('powerupsUsed');
        },
        trackShopPurchase() {
            bumpStat('shopPurchases');
        },
        trackDailyClaim() {
            bumpStat('dailyClaims');
        },
        trackChestOpen(amount = 1) {
            bumpStat('chestsOpened', amount);
        },
        trackCombo(level) {
            session.maxCombo = Math.max(session.maxCombo, level);
            ensureDailyProgress();
            state.dailyProgress.maxCombo = Math.max(state.dailyProgress.maxCombo, level);
            if (level > (state.stats.maxCombo || 0)) {
                state.stats.maxCombo = level;
            }
            save();
            checkAchievements();
            updateMissionProgress();
        },
        tickSurvival(dt) {
            if (!session.isSurvival) return;
            session.survivalSec += dt;
            ensureDailyProgress();
            const sec = Math.floor(session.survivalSec);
            if (sec > state.dailyProgress.survivalSec) {
                state.dailyProgress.survivalSec = sec;
                save();
            }
            if (sec > (state.stats.survivalBestSec || 0)) {
                state.stats.survivalBestSec = sec;
                save();
                checkAchievements();
            }
            updateMissionProgress();
        }
    };

    window.drawComboFloater = function (ctx, canvas) {
        if (!window.comboFloater || !ctx) return;
        const f = window.comboFloater;
        f.life--;
        if (f.life <= 0) {
            window.comboFloater = null;
            return;
        }
        f.alpha = Math.min(1, f.life / 40);
        ctx.save();
        ctx.globalAlpha = f.alpha;
        ctx.fillStyle = '#ffee00';
        ctx.strokeStyle = 'rgba(255,77,109,0.9)';
        ctx.lineWidth = 2;
        ctx.font = '900 26px Geom, monospace';
        ctx.textAlign = 'center';
        ctx.strokeText(f.text, canvas.width / 2, canvas.height * 0.22);
        ctx.fillText(f.text, canvas.width / 2, canvas.height * 0.22);
        ctx.restore();
    };

    // --- UI ---
    function ensurePanels() {
        if (!document.getElementById('missionsPanel')) {
            const mp = document.createElement('div');
            mp.id = 'missionsPanel';
            mp.innerHTML = `
                <div class="prog-dim" data-close="missions"></div>
                <section class="prog-sheet prog-sheet-missions">
                    <button type="button" class="prog-close" data-close="missions">×</button>
                    <div class="prog-kicker">OPERACIONES</div>
                    <h2>MISIONES</h2>
                    <p class="prog-sub">Objetivos diarios · se reinician cada día</p>
                    <div id="missionsList" class="prog-mission-list"></div>
                </section>`;
            document.body.appendChild(mp);
        }
        if (!document.getElementById('helpGuidePanel')) {
            const hp = document.createElement('div');
            hp.id = 'helpGuidePanel';
            hp.innerHTML = `
                <div class="prog-dim" data-close="help"></div>
                <section class="prog-sheet prog-sheet-help">
                    <button type="button" class="prog-close" data-close="help">×</button>
                    <div class="prog-kicker">MANUAL</div>
                    <h2>GUÍA</h2>
                    <div class="prog-tabs" id="helpGuideTabs"></div>
                    <div id="helpGuideBody" class="prog-help-body"></div>
                </section>`;
            document.body.appendChild(hp);
        }
        if (!document.getElementById('statsPanel')) {
            const sp = document.createElement('div');
            sp.id = 'statsPanel';
            sp.innerHTML = `
                <div class="prog-dim" data-close="stats"></div>
                <section class="prog-sheet">
                    <button type="button" class="prog-close" data-close="stats">×</button>
                    <div class="prog-kicker">PERFIL</div>
                    <h2>ESTADÍSTICAS</h2>
                    <div id="statsGrid" class="prog-stats-grid"></div>
                </section>`;
            document.body.appendChild(sp);
        }
        if (!document.getElementById('progressionToast')) {
            const t = document.createElement('div');
            t.id = 'progressionToast';
            t.className = 'progression-toast';
            document.body.appendChild(t);
        }
        if (!document.getElementById('missionRewardGuide')) {
            const b = document.createElement('button');
            b.id = 'missionRewardGuide';
            b.className = 'mission-reward-guide';
            b.type = 'button';
            b.innerHTML = '<span></span>RECLAMAR MISION';
            b.addEventListener('click', () => window.openMissionsPanel?.());
            document.body.appendChild(b);
        }

        document.querySelectorAll('[data-close]').forEach(el => {
            if (el._progBound) return;
            el._progBound = true;
            el.addEventListener('click', () => {
                const which = el.getAttribute('data-close');
                closePanel(which);
            });
        });
    }

    function closePanel(which) {
        const map = { missions: 'missionsPanel', help: 'helpGuidePanel', stats: 'statsPanel' };
        const id = map[which];
        if (id) document.getElementById(id)?.classList.remove('showing');
    }

    window.showProgressionToast = function (msg) {
        ensurePanels();
        const t = document.getElementById('progressionToast');
        if (!t) return;
        t.textContent = msg;
        t.classList.add('showing');
        clearTimeout(window._progToastTimer);
        window._progToastTimer = setTimeout(() => t.classList.remove('showing'), 2200);
    };

    function renderMissionsList() {
        const list = document.getElementById('missionsList');
        if (!list) return;
        const missions = getMissions();
        list.innerHTML = missions.map(m => {
            const pct = Math.round((m.progress / m.goal) * 100);
            const rewardBits = [];
            if (m.reward.coins) rewardBits.push(`${m.reward.coins} coins`);
            if (m.reward.gems) rewardBits.push(`${m.reward.gems} rubies`);
            if (m.reward.rubyXp) rewardBits.push(`+${m.reward.rubyXp} XP pase`);
            return `
                <article class="prog-mission-card ${m.done ? 'is-done' : ''} ${m.claimed ? 'is-claimed' : ''}">
                    <div class="prog-mission-head">
                        <strong>${m.label}</strong>
                        <span>${m.progress}/${m.goal}</span>
                    </div>
                    <div class="prog-bar"><span style="width:${pct}%"></span></div>
                    <div class="prog-mission-foot">
                        <small>${rewardBits.join(' · ') || 'Recompensa'}</small>
                        ${m.done && !m.claimed
                ? `<button type="button" class="prog-claim-btn" data-mission-claim="${m.id}">RECLAMAR</button>`
                : (m.claimed ? '<span class="prog-claimed-tag">RECLAMADO</span>' : '<span class="prog-pending-tag">EN PROGRESO</span>')}
                    </div>
                </article>`;
        }).join('');
        list.querySelectorAll('[data-mission-claim]').forEach(btn => {
            btn.onclick = () => {
                if (claimMission(btn.dataset.missionClaim)) renderMissionsList();
            };
        });
    }

    const HELP_SECTIONS = [
        {
            id: 'controls',
            title: 'Controles',
            body: `<p><b>PC:</b> flechas o A/D para girar en la esfera. Espacio o clic para cambiar gravedad.</p>
                   <p><b>Móvil:</b> botones en pantalla (izquierda, derecha, gravedad).</p>
                   <p>El botón <b>PAUSA</b> abre el menú de partida (continuar, reiniciar, niveles).</p>`
        },
        {
            id: 'sphere',
            title: 'La esfera',
            body: `<p>Giras alrededor del núcleo evitando pinchos, sierras y láseres en el túnel.</p>
                   <p>Las <b>vidas</b> están arriba a la izquierda. Recoge monedas y rubies para la tienda.</p>
                   <p>Completa el nivel antes de que acabe el tiempo indicado en la configuración del mapa.</p>`
        },
        {
            id: 'powerups',
            title: 'Potenciadores',
            body: `<p>Antes de cada nivel puedes equipar hasta <b>2 potenciadores</b> desbloqueados.</p>
                   <p>La tienda normal y VIP venden usos y desbloqueos por monedas o rubies.</p>
                   <p>Los potenciadores reemplazan habilidades de skins: las skins son solo estética.</p>`
        },
        {
            id: 'shop',
            title: 'Tienda',
            body: `<p><b>Skins, trails, banners, emotes, cofres</b> y conversión de moneda.</p>
                   <p><b>Ruby Pass:</b> pase de temporada con pista free y premium.</p>
                   <p><b>VIP:</b> paquetes temáticos (Halloween, Navidad, etc.) que rotarán por temporada.</p>
                   <p><b>Misiones:</b> debajo de tus monedas en la tienda — objetivos diarios con recompensa.</p>`
        },
        {
            id: 'modes',
            title: 'Modos',
            body: `<p><b>Campaña:</b> niveles desbloqueados progresivamente.</p>
                   <p><b>Supervivencia:</b> aguanta el máximo posible; tu récord aparece en estadísticas.</p>
                   <p><b>Combo:</b> sobrevive sin daño para subir la racha (ver HUD flotante).</p>`
        },
        {
            id: 'powerups_detail',
            title: 'Potenciadores+',
            body: `<p>Lista detallada de cada potenciador con estadísticas de uso.</p>
                   <button type="button" class="prog-tab" style="margin-top:8px;" id="helpOpenPowerupGuide">ABRIR GUÍA DE POTENCIADORES</button>`
        }
    ];

    function renderHelpGuide(activeId = 'controls') {
        const tabs = document.getElementById('helpGuideTabs');
        const body = document.getElementById('helpGuideBody');
        if (!tabs || !body) return;
        tabs.innerHTML = HELP_SECTIONS.map(s =>
            `<button type="button" class="prog-tab ${s.id === activeId ? 'is-active' : ''}" data-help-tab="${s.id}">${s.title}</button>`
        ).join('');
        const section = HELP_SECTIONS.find(s => s.id === activeId) || HELP_SECTIONS[0];
        body.innerHTML = section.body;
        tabs.querySelectorAll('[data-help-tab]').forEach(btn => {
            btn.onclick = () => renderHelpGuide(btn.dataset.helpTab);
        });
        document.getElementById('helpOpenPowerupGuide')?.addEventListener('click', () => {
            closePanel('help');
            window.showPowerupHelpPanel?.();
        });
    }

    function renderStatsGrid() {
        const grid = document.getElementById('statsGrid');
        if (!grid) return;
        const s = state.stats;
        const rows = [
            ['Victorias', s.wins],
            ['Muertes', s.deaths],
            ['Niveles completados', s.levelsCompleted],
            ['Partidas iniciadas', s.gamesPlayed],
            ['Monedas recogidas', s.coinsCollected],
            ['Rubies recogidos', s.rubiesCollected],
            ['Mejor racha', `x${s.maxCombo || 0}`],
            ['Supervivencia récord', `${s.survivalBestSec || 0}s`],
            ['Potenciadores usados', s.powerupsUsed],
            ['Compras en tienda', s.shopPurchases]
        ];
        grid.innerHTML = rows.map(([label, val]) =>
            `<div class="prog-stat-card"><span>${label}</span><strong>${val}</strong></div>`
        ).join('');
    }

    window.openMissionsPanel = function () {
        ensurePanels();
        rollDailyMissions();
        renderMissionsList();
        document.getElementById('missionsPanel').classList.add('showing');
        document.getElementById('missionRewardGuide')?.classList.remove('showing');
        window.playSfx?.('menuSelect', 0.5);
    };

    window.openHelpGuide = function () {
        ensurePanels();
        renderHelpGuide('controls');
        document.getElementById('helpGuidePanel').classList.add('showing');
        localStorage.setItem('helpGuideSeen', 'true');
        window.playSfx?.('menuSelect', 0.5);
    };

    window.openStatsPanel = function () {
        ensurePanels();
        renderStatsGrid();
        document.getElementById('statsPanel').classList.add('showing');
    };

    window.refreshMissionChip = function refreshMissionChip() {
        const chip = document.getElementById('shop-missions-chip');
        const pending = pendingMissionCount();
        const shopBtn = document.getElementById('shop-btn');
        const guide = document.getElementById('missionRewardGuide');
        const missionPanelOpen = document.getElementById('missionsPanel')?.classList.contains('showing');
        if (shopBtn) shopBtn.classList.toggle('has-mission-nav-hint', pending > 0);
        if (guide) guide.classList.toggle('showing', pending > 0 && !missionPanelOpen);
        if (!chip) return;
        chip.classList.toggle('has-mission-nav-hint', pending > 0);
        const badge = chip.querySelector('.shop-missions-badge');
        if (badge) {
            badge.textContent = pending > 0 ? String(pending) : '';
            badge.style.display = pending > 0 ? 'flex' : 'none';
        }
        const sub = chip.querySelector('.shop-missions-sub');
        if (sub) {
            const done = getMissions().filter(m => m.done && !m.claimed).length;
            const total = getMissions().length;
            sub.textContent = done > 0 ? `${done} lista(s) para reclamar` : `${total} activas hoy`;
        }
    };

    ensurePanels();
    rollDailyMissions();
    refreshMissionChip();

    // --- Logros: banner Minecraft, puntos verdes, reclamar recompensa ---
    let navHints = { shopExit: false, menuLogros: false };
    try {
        navHints = { shopExit: false, menuLogros: false, ...JSON.parse(localStorage.getItem('gemAchievementNav') || '{}') };
    } catch { /* noop */ }

    function saveNavHints() {
        localStorage.setItem('gemAchievementNav', JSON.stringify(navHints));
    }

    function isShopOpen() {
        const panel = document.getElementById('shopPanel');
        return panel && panel.style.display !== 'none';
    }

    function ensureMcBanner() {
        if (document.getElementById('mcAchievementToast')) return;
        const el = document.createElement('div');
        el.id = 'mcAchievementToast';
        el.className = 'mc-achievement-toast';
        el.innerHTML = `
            <div class="mc-achievement-frame">
                <div class="mc-achievement-icon" id="mcAchievementIcon">★</div>
                <div class="mc-achievement-copy">
                    <span class="mc-achievement-kicker">LOGRO COMPLETADO</span>
                    <strong id="mcAchievementTitle">Logro</strong>
                </div>
            </div>`;
        document.body.appendChild(el);
    }

    function showMcAchievementBanner(ach) {
        ensureMcBanner();
        const toast = document.getElementById('mcAchievementToast');
        const icon = document.getElementById('mcAchievementIcon');
        const title = document.getElementById('mcAchievementTitle');
        if (icon) icon.textContent = ACHIEVEMENT_ICONS[ach.id] || '★';
        if (title) title.textContent = ach.title;
        toast.classList.remove('showing');
        void toast.offsetWidth;
        toast.classList.add('showing');
        window.playSfx?.('reward', 0.7);
        clearTimeout(window._mcAchTimer);
        window._mcAchTimer = setTimeout(() => toast.classList.remove('showing'), 4200);
    }

    function setAchievementNavHints() {
        const unclaimed = getUnclaimedAchievementIds().length > 0;
        if (!unclaimed) {
            navHints.shopExit = false;
            navHints.menuLogros = false;
            saveNavHints();
            refreshAchievementNavHints();
            return;
        }
        if (isShopOpen()) {
            navHints.shopExit = true;
            navHints.menuLogros = false;
        } else if (document.getElementById('overlay')?.style.display === 'flex') {
            navHints.shopExit = false;
            navHints.menuLogros = true;
        }
        saveNavHints();
        refreshAchievementNavHints();
    }

    window.refreshAchievementNavHints = function () {
        const unclaimed = getUnclaimedAchievementIds().length > 0;
        if (!unclaimed) {
            navHints.shopExit = false;
            navHints.menuLogros = false;
            saveNavHints();
        }
        const shopBtn = document.getElementById('shop-exit-btn');
        const logrosBtn = document.getElementById('achievements-btn');
        if (shopBtn) shopBtn.classList.toggle('has-nav-hint', unclaimed && navHints.shopExit && isShopOpen());
        if (logrosBtn) logrosBtn.classList.toggle('has-nav-hint', unclaimed && navHints.menuLogros && !isShopOpen());
    };

    window.onShopClosedForAchievements = function () {
        if (getUnclaimedAchievementIds().length > 0) {
            navHints.shopExit = false;
            navHints.menuLogros = true;
            saveNavHints();
        }
        refreshAchievementNavHints();
    };

    window.onAchievementsPanelOpened = function () {
        navHints.menuLogros = false;
        saveNavHints();
        refreshAchievementNavHints();
    };

    window.onAchievementsPanelClosed = function () {
        if (getUnclaimedAchievementIds().length > 0 && !isShopOpen()) {
            navHints.menuLogros = true;
            saveNavHints();
        }
        refreshAchievementNavHints();
    };

    window.handleAchievementUnlocked = function (ach) {
        showMcAchievementBanner(ach);
        setTimeout(setAchievementNavHints, 400);
    };

    window.claimAchievementRewardUi = function (id) {
        if (!claimAchievementReward(id)) return;
        if (typeof window.renderAchievementsPanel === 'function') {
            window.renderAchievementsPanel();
        }
        setAchievementNavHints();
    };

    refreshAchievementNavHints();
})();
