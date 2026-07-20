// =====================================================
// MENU BUTTONS
// =====================================================

function lockLandscapeOrientation() {
    const orientation = screen.orientation || screen.mozOrientation || screen.msOrientation;
    if (!orientation?.lock) return;
    orientation.lock('landscape').catch(() => { });
}

lockLandscapeOrientation();
window.addEventListener('DOMContentLoaded', lockLandscapeOrientation);
window.addEventListener('visibilitychange', () => {
    if (!document.hidden) lockLandscapeOrientation();
});
window.addEventListener('pointerdown', lockLandscapeOrientation, { once: true, passive: true });

document.getElementById("play-btn").onclick = () => {
    lockLandscapeOrientation();
    window.playSfx?.('menuSelect');

    if (window.menuMusic) {
        window.applyAudioSettings?.();
        window.safePlayAudio?.(window.menuMusic);
    }

    const overlay = document.getElementById("overlay");
    const ls = document.getElementById("levelSelect");

    ls.style.display = "flex";
    ls.classList.remove("entering", "leaving");
    void ls.offsetWidth;
    ls.classList.add("entering");

    if (overlay) {
        overlay.classList.remove('exit-shop', 'enter-shop', 'exit-inventory', 'enter-inventory', 'exit-play', 'enter-play');
        void overlay.offsetWidth;
        overlay.classList.add("exit-play");
    }

    setTimeout(() => {
        if (overlay) {
            overlay.style.display = "none";
            overlay.classList.remove("exit-play");
        }
        window.showLevelSelect();
        if (typeof drawCarousel === 'function') drawCarousel();
        ls.classList.remove("entering");
    }, 450);
};

window.closeLevelSelect = function () {
    window.playSfx?.('menuSelect', 0.6);
    const ls = document.getElementById("levelSelect");
    const overlay = document.getElementById("overlay");

    if (ls) {
        ls.classList.remove("entering");
        ls.classList.add("leaving");
    }

    if (overlay) {
        overlay.style.display = "flex";
        overlay.classList.remove('exit-play', 'enter-play');
        void overlay.offsetWidth;
        overlay.classList.add("enter-play");
    }

    setTimeout(() => {
        window.hideLevelSelect();
        if (ls) ls.classList.remove("leaving");
        if (overlay) overlay.classList.remove("enter-play");
    }, 450);
};

const shopBtn = document.getElementById("shop-btn");
if (shopBtn) shopBtn.onclick = () => { window.playSfx?.('menuSelect'); openShop(); };

const optionsBtn = document.getElementById("options-btn");
if (optionsBtn) optionsBtn.onclick = () => {
    window.playSfx?.('menuSelect');
    openOptionsPanel();
};

const inventoryBtn = document.getElementById('inventory-btn');
if (inventoryBtn) inventoryBtn.onclick = () => { window.playSfx?.('menuSelect'); openInventory(); };

['play-btn', 'shop-btn', 'options-btn', 'inventory-btn', 'menu-avatar', 'menu-profile'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('mouseenter', () => window.playSfx?.('menuHover', 0.45));
});

window.openOptionsPanel = function () {
    syncOptionsPanel();
    document.getElementById("optionsPanel").style.display = "flex";
};

// =====================================================
// PROFILE
// =====================================================

function formatTime(seconds) {
    if (!Number.isFinite(seconds) || seconds <= 0) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

function getDaysPlayedCount() {
    try {
        const playedDays = JSON.parse(localStorage.getItem('playedDays') || '[]');
        return Array.isArray(playedDays) ? playedDays.length : 0;
    } catch (e) {
        return 0;
    }
}

function getLastPlayedText() {
    const lastPlayedAt = localStorage.getItem('lastPlayedAt');
    if (!lastPlayedAt) return 'N/A';
    const last = new Date(lastPlayedAt);
    if (isNaN(last.getTime())) return 'N/A';
    const now = new Date();
    const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const diffDays = Math.round((startOfDay(now) - startOfDay(last)) / 86400000);
    if (diffDays <= 0) return 'Hoy';
    if (diffDays === 1) return 'Ayer';
    return `Hace ${diffDays} días`;
}

function getBestSurvivalValue() {
    const fallbackKeys = [
        'bestSurvivalTime',
        'bestSurvivalSeconds',
        'survivalBestTime',
        'survivalRecord',
        'bestSurvivalScore'
    ];

    for (const key of fallbackKeys) {
        const raw = localStorage.getItem(key);
        if (!raw) continue;
        const value = parseFloat(raw);
        if (!Number.isNaN(value) && value > 0) {
            return formatTime(value);
        }
        if (typeof raw === 'string' && !raw.match(/^\s*\d+\.?\d*\s*$/)) {
            return raw;
        }
    }

    return 'N/A';
}

// ─── PUNTOS DE COLECCIÓN ───────────────────────────
// Pondera cada item que el jugador tiene según su rareza.
// BASICA/BASICO/DEFAULT=1, ESPECIAL=2, EPICA=4, DEMON=8, VIP=15
// (escala escalonada: una sola VIP vale tanto como 15 básicas)
function getCollectionRarityWeight(rarity) {
    const r = (rarity || '').toString().toUpperCase();
    if (r === 'VIP') return 15;
    if (r === 'DEMON') return 8;
    if (r === 'EPICA' || r === 'EPIC') return 4;
    if (r === 'ESPECIAL' || r === 'RARE') return 2;
    return 1; // BASICA, BASICO, DEFAULT, o cualquier rareza desconocida
}

function getCollectionScore() {
    let total = 0;
    try {
        // Skins (getAllShopSkins ya trae .owned y .rarity resueltos,
        // incluye skins normales + VIP + de fragmentos)
        if (typeof getAllShopSkins === 'function') {
            getAllShopSkins().forEach(skin => {
                // 'cyan' es la skin gratis de inicio, no cuenta como "coleccionada"
                if (skin.owned && skin.id !== 'cyan') {
                    total += getCollectionRarityWeight(skin.rarity);
                }
            });
        }
        // Banners
        if (typeof BANNERS_DATA !== 'undefined' && Array.isArray(BANNERS_DATA)) {
            BANNERS_DATA.forEach(b => {
                // el banner por defecto tampoco cuenta, lo tiene todo el mundo
                if (b.id === 'Banner_Deafult') return;
                const owned = localStorage.getItem('banner_' + b.id) === 'true' || b.owned === true;
                if (owned) total += getCollectionRarityWeight(b.rarity);
            });
        }
        // Emotes
        if (typeof EMOTES_DATA !== 'undefined' && Array.isArray(EMOTES_DATA) && typeof isEmoteOwned === 'function') {
            EMOTES_DATA.forEach(e => {
                if (isEmoteOwned(e)) total += getCollectionRarityWeight(e.rarity);
            });
        }
    } catch (err) {
        console.warn('[Stats] Error calculando puntos de colección:', err);
    }
    return total;
}

function updateProfilePanelStats() {
    const stats = typeof window.getStats === 'function' ? window.getStats() : {};
    const wins = parseInt(localStorage.getItem('gamesWon') || '0', 10) || 0;
    const gamesPlayed = stats.totalGamesPlayed || 0;
    const losses = Math.max(gamesPlayed - wins, 0);
    // Leer rango del nuevo sistema si existe, fallback a localStorage legacy
    const rankObj = window.rankSystem ? window.rankSystem.getCurrentRank() : null;
    const rankName = rankObj ? rankObj.name : (localStorage.getItem('rankName') || 'Chispa');
    const rankColor = rankObj ? rankObj.color : (localStorage.getItem('rankColor') || '#aaaaaa');
    const totalXP = window.rankSystem ? window.rankSystem.getXP() : 0;
    const xpToNext = window.rankSystem ? window.rankSystem.getXPToNextRank() : 0;
    const nextRank = window.rankSystem ? window.rankSystem.getNextRank() : null;
    const rankProgress = window.rankSystem ? window.rankSystem.getRankProgress() : 0;
    const playerName = localStorage.getItem('playerName') || 'Jugador';

    const coinsValue = window.infiniteCoinsMode ? '∞' : (parseInt(localStorage.getItem('deadCoins') || '0', 10) || 0);
    const gemsValue = window.infiniteCoinsMode ? '∞' : (parseInt(localStorage.getItem('gems') || '0', 10) || 0);

    const profileFields = {
        'menu-profile-rank': rankName,  // se oculta visualmente si XP=0 (ver bloque rankObj)
        'profileStat-total-xp': totalXP.toLocaleString(),
        'profileStat-xp-to-next': nextRank
            ? xpToNext.toLocaleString() + ' ' + (window.GEM_CONFIG?.textos?.rangos?.sufijoXP || 'XP')
            : (window.GEM_CONFIG?.textos?.rangos?.xpMaximo || '¡Máximo!'),
        'menu-profile-name': playerName,
        'menu-profile-gems': gemsValue,
        'menu-profile-coins': coinsValue,
        'profileStat-longest-combo': stats.longestCombo || stats.maxCombo || 0,
        'profileStat-game-wins': wins,
        'profileStat-game-losses': losses,
        'profileStat-games-played': gamesPlayed,
        'profileStat-days-played': getDaysPlayedCount(),
        'profileStat-last-played': getLastPlayedText(),
        'profileStat-current-coins': coinsValue,
        'profileStat-current-gems': gemsValue,
        'profileStat-collection-score': getCollectionScore(),
        'profileStat-best-survival': getBestSurvivalValue()
    };

    Object.entries(profileFields).forEach(([id, value]) => {
        const el = document.getElementById(id);
        if (el) el.textContent = String(value);
    });

    // Colorear elementos de rango
    if (rankObj) {
        const heroRankEl = document.getElementById('profileHeroRank');
        const menuRankEl = document.getElementById('menu-profile-rank');
        if (heroRankEl) {
            heroRankEl.textContent = `${rankObj.emoji} ${rankObj.name}`;
            heroRankEl.style.color = rankObj.color;
        }
        if (menuRankEl) {
            menuRankEl.style.color = rankObj.color;
            // Ocultar rango si el jugador aún no tiene XP
            const xpActual = window.rankSystem ? window.rankSystem.getXP() : 0;
            menuRankEl.style.display = xpActual === 0 ? 'none' : '';
            if (xpActual === 0) menuRankEl.textContent = '';
        }
        // Barra de progreso
        const progressBar = document.getElementById('rank-progress-bar-fill');
        if (progressBar) progressBar.style.width = (rankProgress * 100).toFixed(1) + '%';
    }

    const profileNameEl = document.getElementById('menu-profile-name');
    const heroNameEl = document.getElementById('profileHeroName');
    const heroRankEl = document.getElementById('profileHeroRank');

    if (profileNameEl) profileNameEl.textContent = playerName;
    if (heroNameEl) heroNameEl.textContent = playerName;
    // heroRankEl lo maneja el bloque rankObj de arriba (con emoji y color)
    // Solo aplicar fallback si rankObj no existe
    if (!rankObj && heroRankEl) heroRankEl.textContent = rankName;
}

window.openProfileMenu = function () {
    window.playSfx?.('avatarBanner', 0.55);

    const panel = document.getElementById("profilePanel");
    updateProfilePanelStats();
    if (panel) panel.classList.add("showing");
};

window.closeProfileMenu = function () {
    const panel = document.getElementById("profilePanel");
    if (panel) panel.classList.remove("showing");
};

// =====================================================
// CONTROLS TOGGLE
// =====================================================

function toggleControlsMode() {

    window.adaptiveControls =
        !window.adaptiveControls;
    localStorage.setItem("adaptiveControls", window.adaptiveControls ? "true" : "false");

    updateControlsText();
}

function updateControlsText() {

    const c = window.GEM_CONFIG?.textos?.opciones?.controles;
    document.getElementById(
        "controls-mode-text"
    ).innerText = window.adaptiveControls
            ? (c?.textoAdaptativo ?? "Controles adaptativos")
            : (c?.textoFijo ?? "Controles fijos");
}

// Inicializar texto al cargar
updateControlsText();

// =====================================================
// KEYBIND SYSTEM
// =====================================================

const DEFAULT_KEYBINDS = {
    left: 'a',
    right: 'd',
    gravity: 's',
    powerW: 'w',
    powerE: 'e'
};

let customKeybinds = JSON.parse(localStorage.getItem('customKeybinds') || '{}');
let currentKeybindAction = null;
let keybindListener = null;

function loadKeybinds() {
    const saved = localStorage.getItem('customKeybinds');
    if (saved) {
        customKeybinds = JSON.parse(saved);
    } else {
        customKeybinds = { ...DEFAULT_KEYBINDS };
    }
    updateKeybindButtons();
}

function saveKeybinds() {
    localStorage.setItem('customKeybinds', JSON.stringify(customKeybinds));
}

function updateKeybindButtons() {
    document.querySelectorAll('.keybind-btn').forEach(btn => {
        const action = btn.dataset.action;
        const key = customKeybinds[action] || DEFAULT_KEYBINDS[action];
        btn.textContent = key.toUpperCase();
    });
}

function startKeybind(btn) {
    if (currentKeybindAction) {
        cancelKeybind();
        return;
    }

    currentKeybindAction = btn.dataset.action;
    btn.classList.add('listening');
    btn.textContent = '...';

    keybindListener = (e) => {
        e.preventDefault();
        const key = e.key.toLowerCase();

        if (key === 'escape') {
            cancelKeybind();
            return;
        }

        customKeybinds[currentKeybindAction] = key;
        saveKeybinds();
        updateKeybindButtons();
        cancelKeybind();
    };

    document.addEventListener('keydown', keybindListener);
}

function cancelKeybind() {
    if (keybindListener) {
        document.removeEventListener('keydown', keybindListener);
        keybindListener = null;
    }
    currentKeybindAction = null;
    document.querySelectorAll('.keybind-btn').forEach(btn => btn.classList.remove('listening'));
    updateKeybindButtons();
}

function resetKeybinds() {
    customKeybinds = { ...DEFAULT_KEYBINDS };
    saveKeybinds();
    updateKeybindButtons();
}

function getKeybind(action) {
    return customKeybinds[action] || DEFAULT_KEYBINDS[action];
}

loadKeybinds();

// Relleno visual (cian/naranja) de los sliders custom del panel de Opciones.
// Los sliders nativos no saben pintar "lo ya recorrido"; usamos una variable
// CSS (--val) que el input actualiza en cada movimiento.
function _updateOptSliderFill(el) {
    if (!el) return;
    const min = parseFloat(el.min) || 0;
    const max = parseFloat(el.max) || 100;
    const val = parseFloat(el.value) || 0;
    const pct = ((val - min) / (max - min)) * 100;
    el.style.setProperty('--val', pct + '%');
}

function _refreshAllOptSliders() {
    document.querySelectorAll('.opt-slider').forEach(_updateOptSliderFill);
}

function _bindOptSliderFills() {
    document.querySelectorAll('.opt-slider').forEach(el => {
        _updateOptSliderFill(el);
        el.addEventListener('input', () => _updateOptSliderFill(el));
    });
}

function syncOptionsPanel() {
    const music = document.getElementById('music-volume');
    const sfx = document.getElementById('sfx-volume');
    const side = document.getElementById('touch-side-offset');
    const gravity = document.getElementById('touch-gravity-offset');
    const size = document.getElementById('touch-size');
    const opacity = document.getElementById('touch-opacity');
    if (music) music.value = Math.round((parseFloat(localStorage.getItem('musicVolume') || '0.45')) * 100);
    if (sfx) sfx.value = Math.round((parseFloat(localStorage.getItem('sfxVolume') || '0.75')) * 100);
    if (side) side.value = localStorage.getItem('touchSideOffset') || '50';
    if (gravity) gravity.value = localStorage.getItem('touchGravityOffset') || '50';
    if (size) size.value = localStorage.getItem('touchSize') || '100';
    if (opacity) opacity.value = localStorage.getItem('touchOpacity') || '100';
    _refreshAllOptSliders();
    updateMotionText();
}

function bindOptionSliders() {
    const music = document.getElementById('music-volume');
    const sfx = document.getElementById('sfx-volume');
    if (music) music.oninput = () => {
        localStorage.setItem('musicVolume', String(parseInt(music.value, 10) / 100));
        window.applyAudioSettings?.();
    };
    if (sfx) sfx.oninput = () => {
        localStorage.setItem('sfxVolume', String(parseInt(sfx.value, 10) / 100));
        window.applyAudioSettings?.();
        window.playSfx?.('colorSelect', 0.35);
    };
}

function toggleReducedMotion() {
    const next = localStorage.getItem('reducedMotion') !== 'true';
    localStorage.setItem('reducedMotion', next ? 'true' : 'false');
    window._cachedReducedMotion = next;
    document.body.classList.toggle('reduced-motion', next);
    document.body.classList.toggle('performance-mode', next);
    updateMotionText();
}

function updateMotionText() {
    const el = document.getElementById('motion-mode-text');
    const v = window.GEM_CONFIG?.textos?.opciones?.visual;
    if (el) el.textContent = localStorage.getItem('reducedMotion') === 'true'
        ? (v?.textoRendimientoAlto ?? 'Rendimiento alto')
        : (v?.textoVisualesCompletos ?? 'Visuales completos');
}

function saveTouchLayout() {
    const side = document.getElementById('touch-side-offset');
    const gravity = document.getElementById('touch-gravity-offset');
    const size = document.getElementById('touch-size');
    const opacity = document.getElementById('touch-opacity');
    if (side) localStorage.setItem('touchSideOffset', side.value);
    if (gravity) localStorage.setItem('touchGravityOffset', gravity.value);
    if (size) localStorage.setItem('touchSize', size.value);
    if (opacity) localStorage.setItem('touchOpacity', opacity.value);
    applyTouchLayout();
    window.playSfx?.('avatarBanner', 0.6);
}

function applyTouchLayout() {
    document.documentElement.style.setProperty('--touch-side', localStorage.getItem('touchSideOffset') || '50');
    document.documentElement.style.setProperty('--touch-gravity', localStorage.getItem('touchGravityOffset') || '50');
    document.documentElement.style.setProperty('--touch-size', localStorage.getItem('touchSize') || '100');
    document.documentElement.style.setProperty('--touch-opacity', localStorage.getItem('touchOpacity') || '100');
}

function bindTouchControls() {
    const bindHold = (id, key) => {
        const btn = document.getElementById(id);
        if (!btn) return;
        const down = event => {
            event.preventDefault();
            if (key === 'gravity') {
                if (window.gravityFlipCooldown <= 0) window.keys.gravity = true;
            } else {
                window.keys[key] = true;
            }
        };
        const up = event => {
            event.preventDefault();
            if (key !== 'gravity') window.keys[key] = false;
        };
        btn.addEventListener('pointerdown', down);
        btn.addEventListener('pointerup', up);
        btn.addEventListener('pointercancel', up);
        btn.addEventListener('pointerleave', up);
    };
    bindHold('touch-left', 'left');
    bindHold('touch-right', 'right');
    bindHold('touch-gravity', 'gravity');
}

bindOptionSliders();
_bindOptSliderFills();
bindTouchControls();
applyTouchLayout();
document.body.classList.toggle('reduced-motion', localStorage.getItem('reducedMotion') === 'true');
document.body.classList.toggle('performance-mode', localStorage.getItem('reducedMotion') === 'true');
document.querySelector('.ls-play-btn')?.addEventListener('mouseenter', () => window.playSfx?.('levelHover', 0.55));

// =====================================================
// CLOSE PANELS
// =====================================================

function closePanels() {

    document.getElementById(
        "shopPanel"
    ).style.display = "none";

    document.getElementById(
        "optionsPanel"
    ).style.display = "none";
}

document.body.addEventListener('click', () => {
    if (!window.running)
        if (window.menuMusic && window.menuMusic.paused)
            if (
                window.menuMusic &&
                window.menuMusic.paused &&
                !window.isMuted
            ) {

                window.safePlayAudio?.(window.menuMusic);

            }
}, { once: true });

document.getElementById('go-retry').onclick = () => {
    window.playSfx?.('confirmAction');
    document.getElementById('gameOver').style.display = 'none';
    window.startGame(window.currentLevel);
};

document.getElementById('go-menu').onclick = () => {
    window.playSfx?.('backAction');
    document.getElementById('gameOver').style.display = 'none';
    document.getElementById("gameCanvas").style.visibility = "hidden";
    document.body.classList.remove('is-playing-touch');
    const pauseBtn = document.getElementById('pause-btn');
    if (pauseBtn) pauseBtn.classList.remove('is-playing');
    document.getElementById('overlay').style.display = 'flex';
    window.menuMusic.currentTime = 0;

    if (window.menuMusic.paused)
        if (
            window.menuMusic &&
            window.menuMusic.paused &&
            !window.isMuted
        ) {

            window.safePlayAudio?.(window.menuMusic);

        }
};

document.getElementById('go-levels').onclick = () => {
    window.playSfx?.('backAction');
    document.getElementById('gameOver').style.display = 'none';
    document.getElementById("gameCanvas").style.visibility = "hidden";
    document.body.classList.remove('is-playing-touch');
    const pauseBtn = document.getElementById('pause-btn');
    if (pauseBtn) pauseBtn.classList.remove('is-playing');
    if (typeof window.showLevelSelect === "function") window.showLevelSelect();
};

document.getElementById('gw-menu').onclick = () => {
    window.playSfx?.('backAction');
    document.getElementById('gameWin').style.display = 'none';
    window.menuMusic.currentTime = 0;
    if (window.menuMusic.paused)
        if (
            window.menuMusic &&
            window.menuMusic.paused &&
            !window.isMuted
        ) {

            window.safePlayAudio?.(window.menuMusic);

        }
    document.getElementById('overlay').style.display = 'flex';
    updateMenuHUD();
};

document.getElementById('gw-levels').onclick = () => {
    window.playSfx?.('backAction');
    document.getElementById('gameWin').style.display = 'none';
    document.getElementById("gameCanvas").style.visibility = "hidden";
    document.body.classList.remove('is-playing-touch');
    const pauseBtn = document.getElementById('pause-btn');
    if (pauseBtn) pauseBtn.classList.remove('is-playing');
    if (typeof window.showLevelSelect === "function") window.showLevelSelect();
};

document.getElementById('gw-retry').onclick = () => {
    window.playSfx?.('confirmAction');
    document.getElementById('gameWin').style.display = 'none';
    window.startGame(window.currentLevel);
};

window.pauseGame = function () {
    if (!window.running || window.paused) return;
    window.paused = true;
    window.playSfx?.('pauseSound');
    document.body.classList.add('is-paused');
    if (window.bgMusic) window.bgMusic.pause();
    const panel = document.getElementById('pausePanel');
    panel?.querySelector('.pause-drawer')?.classList.remove('closing');
    panel?.querySelector('.pause-dim')?.classList.remove('closing');
    panel?.classList.add('showing');
};

window.resumeGame = function () {
    if (!window.paused) return;
    window.paused = false;
    window.playSfx?.('resumeSound');
    document.body.classList.remove('is-paused');
    const panel = document.getElementById('pausePanel');
    const drawer = panel?.querySelector('.pause-drawer');
    const dim = panel?.querySelector('.pause-dim');
    // Reproducimos la animación de cierre y recién después ocultamos el panel,
    // para que no se corte de golpe como pasaba antes.
    drawer?.classList.add('closing');
    dim?.classList.add('closing');
    setTimeout(() => {
        panel?.classList.remove('showing');
        drawer?.classList.remove('closing');
        dim?.classList.remove('closing');
    }, 260);
    if (window.bgMusic && !window.isMuted) window.safePlayAudio?.(window.bgMusic);
};

const pauseContinueBtn = document.getElementById('pause-continue');
if (pauseContinueBtn) pauseContinueBtn.onclick = () => window.resumeGame();

const pauseRestartBtn = document.getElementById('pause-restart');
if (pauseRestartBtn) pauseRestartBtn.onclick = () => {
    window.playSfx?.('confirmAction');
    window.paused = false;
    document.body.classList.remove('is-paused');
    document.getElementById('pausePanel')?.classList.remove('showing');
    window.startGame(window.currentLevel);
};

const pauseOptionsBtn = document.getElementById('pause-options');
if (pauseOptionsBtn) pauseOptionsBtn.onclick = () => openOptionsPanel();

const pauseLevelsBtn = document.getElementById('pause-levels');
if (pauseLevelsBtn) pauseLevelsBtn.onclick = () => {
    window.paused = false;
    window.running = false;
    document.body.classList.remove('is-paused');
    document.getElementById('pausePanel')?.classList.remove('showing');
    document.getElementById('pause-btn')?.classList.remove('is-playing');
    const _gc = document.getElementById("gameCanvas"); if (_gc) _gc.style.visibility = "hidden";
    document.body.classList.remove('is-playing-touch');
    if (window.bgMusic) window.bgMusic.pause();
    if (typeof window.showLevelSelect === "function") window.showLevelSelect();
};

const pauseMenuBtn = document.getElementById('pause-menu');
if (pauseMenuBtn) pauseMenuBtn.onclick = () => {
    window.paused = false;
    window.running = false;
    document.body.classList.remove('is-paused');
    document.getElementById('pausePanel')?.classList.remove('showing');
    const _gc = document.getElementById("gameCanvas"); if (_gc) _gc.style.visibility = "hidden";
    document.body.classList.remove('is-playing-touch');
    document.getElementById('pause-btn')?.classList.remove('is-playing');
    const _ov = document.getElementById('overlay'); if (_ov) _ov.style.display = 'flex';
    if (window.bgMusic) {
        window.bgMusic.pause();
        window.bgMusic.currentTime = 0;
    }
    if (window.menuMusic) {
        window.menuMusic.currentTime = 0;
        if (window.menuMusic.paused && !window.isMuted) window.safePlayAudio?.(window.menuMusic);
    }
};

window.isMuted =
    localStorage.getItem("isMuted") === "true";

function applyMuteState() {

    if (window.bgMusic)
        window.bgMusic.muted =
            window.isMuted;

    if (window.menuMusic)
        window.menuMusic.muted =
            window.isMuted;
    window.applyAudioSettings?.();

    const icon =
        document.getElementById(
            "mute-icon"
        );

    if (!icon) return;

    icon.src = window.isMuted
        ? "assets/UI/Common/Icons/Music_Off.png"
        : "assets/UI/Common/Icons/Music_On.png";
}

function toggleMute() {

    window.isMuted =
        !window.isMuted;

    localStorage.setItem(
        "isMuted",
        window.isMuted
    );

    applyMuteState();
}

applyMuteState();

window.startKeybind = startKeybind;
window.resetKeybinds = resetKeybinds;
window.getKeybind = getKeybind;

// =====================================================
// MODO PRUEBAS - MONEDAS INFINITAS
// =====================================================

window.infiniteCoinsMode = localStorage.getItem('infiniteCoinsMode') === 'true';

// Arma el texto del botón/label de monedas infinitas leyendo el prefijo desde
// config.js, para no tener el string repetido en 3 lugares distintos.
function getInfiniteCoinsLabel() {
    const prefix = window.GEM_CONFIG?.textos?.opciones?.modoPruebasDev?.monedasInfinitasPrefix ?? 'MONEDAS INFINITAS';
    return `${prefix}: ${window.infiniteCoinsMode ? 'ON' : 'OFF'}`;
}

function toggleInfiniteCoins() {
    window.infiniteCoinsMode = !window.infiniteCoinsMode;
    localStorage.setItem('infiniteCoinsMode', window.infiniteCoinsMode ? 'true' : 'false');

    const btn = document.getElementById('infinite-coins-btn');
    if (btn) {
        btn.textContent = getInfiniteCoinsLabel();
        btn.style.background = window.infiniteCoinsMode ? 'rgba(0,255,100,0.2)' : '';
        btn.style.borderColor = window.infiniteCoinsMode ? 'rgba(0,255,100,0.5)' : '';
    }

    // Actualizar botón flotante
    const floatBtn = document.getElementById('infinite-coins-float-btn');
    if (floatBtn) {
        floatBtn.style.background = window.infiniteCoinsMode ? 'rgba(0,255,100,0.4)' : 'rgba(0,0,0,0.35)';
        floatBtn.style.borderColor = window.infiniteCoinsMode ? 'rgba(0,255,100,0.6)' : 'rgba(255,255,255,0.12)';
    }

    // Actualizar botón del menú principal
    const menuBtn = document.getElementById('infinite-coins-menu-text');
    if (menuBtn) {
        menuBtn.textContent = getInfiniteCoinsLabel();
        menuBtn.style.color = window.infiniteCoinsMode ? '#00ff64' : '#ff4444';
    }

    // Actualizar display de monedas inmediatamente
    updateProfilePanelStats();

    window.playSfx?.('menuSelect');
}

window.toggleInfiniteCoins = toggleInfiniteCoins;

// Inicializar estado del botón
if (document.getElementById('infinite-coins-btn')) {
    document.getElementById('infinite-coins-btn').textContent = getInfiniteCoinsLabel();
    if (window.infiniteCoinsMode) {
        document.getElementById('infinite-coins-btn').style.background = 'rgba(0,255,100,0.2)';
        document.getElementById('infinite-coins-btn').style.borderColor = 'rgba(0,255,100,0.5)';
    }
}

// Inicializar botón flotante
if (document.getElementById('infinite-coins-float-btn')) {
    if (window.infiniteCoinsMode) {
        document.getElementById('infinite-coins-float-btn').style.background = 'rgba(0,255,100,0.4)';
        document.getElementById('infinite-coins-float-btn').style.borderColor = 'rgba(0,255,100,0.6)';
    }
}

// Inicializar botón del menú principal
if (document.getElementById('infinite-coins-menu-text')) {
    document.getElementById('infinite-coins-menu-text').textContent = getInfiniteCoinsLabel();
    document.getElementById('infinite-coins-menu-text').style.color = window.infiniteCoinsMode ? '#00ff64' : '#ff4444';
}

// =====================================================
// ACHIEVEMENTS SYSTEM
// =====================================================

const ACHIEVEMENTS_STORAGE_KEY = 'achievements';

const ACHIEVEMENTS_DATA = [
    { id: 'first_win', name: 'Primera Victoria', description: 'Completa tu primer nivel', icon: '🏆', unlocked: false },
    { id: 'combo_10', name: 'Combo x10', description: 'Alcanza un combo de 10', icon: '🔥', unlocked: false },
    { id: 'combo_50', name: 'Combo x50', description: 'Alcanza un combo de 50', icon: '💥', unlocked: false },
    { id: 'survival_5min', name: 'Superviviente', description: 'Sobrevive 5 minutos en Modo Supervivencia', icon: '⏱️', unlocked: false },
    { id: 'all_powerups', name: 'Coleccionista', description: 'Desbloquea todos los potenciadores', icon: '💎', unlocked: false },
    { id: 'max_level', name: 'Maestro', description: 'Alcanza el nivel máximo en cualquier potenciador', icon: '⭐', unlocked: false },
    { id: 'no_damage', name: 'Intocable', description: 'Completa un nivel sin recibir daño', icon: '🛡️', unlocked: false },
    { id: 'gems_100', name: 'Riqueza', description: 'Acumula 100 gemas', icon: '💰', unlocked: false }
];

function loadAchievements() {
    const saved = localStorage.getItem(ACHIEVEMENTS_STORAGE_KEY);
    if (saved) {
        const savedAchievements = JSON.parse(saved);
        ACHIEVEMENTS_DATA.forEach(achievement => {
            const saved = savedAchievements.find(a => a.id === achievement.id);
            if (saved) {
                achievement.unlocked = saved.unlocked;
                achievement.progress = saved.progress || 0;
            }
        });
    }
}

function saveAchievements() {
    localStorage.setItem(ACHIEVEMENTS_STORAGE_KEY, JSON.stringify(ACHIEVEMENTS_DATA));
}

function unlockAchievement(id) {
    const achievement = ACHIEVEMENTS_DATA.find(a => a.id === id);
    if (achievement && !achievement.unlocked) {
        achievement.unlocked = true;
        saveAchievements();
        showAchievementNotification(achievement);
    }
}

// Notificación visual para los trofeos de colección de comida (Coleccionista I/II/III)
// goal: objeto { rewardId, name, icon, count } definido en FOOD_COLLECTION_GOALS (shop.js)
function unlockTrophyAchievement(goal) {
    if (!goal) return;
    showAchievementNotification({ img: goal.icon, name: goal.name });
}

// ── Notificación de subida de rango ──
// Se llama desde rank-system.js → _onRankUp
// Cuando tengas las PNGs ponlas en: assets/UI/Common/Ranks/rango_<id>.png
window.showRankUpNotification = function (rankObj, imgPath) {
    const tituloRango = window.GEM_CONFIG?.textos?.logros?.notificacion?.tituloRango || '¡NUEVO RANGO!';
    const notification = document.createElement('div');
    notification.className = 'achievement-notification rank-up-notification';
    notification.style.cssText = `
        border-color: ${rankObj.color} !important;
        box-shadow: 0 0 18px ${rankObj.color}66 !important;
    `;

    // Intentar cargar la imagen del rango; si no existe, mostrar el emoji
    const imgEl = document.createElement('img');
    imgEl.src = imgPath;
    imgEl.className = 'achievement-icon';
    imgEl.style.cssText = 'width:50px;height:50px;object-fit:contain;';
    imgEl.onerror = () => {
        // Fallback: emoji grande en lugar de imagen rota
        const emojiEl = document.createElement('div');
        emojiEl.style.cssText = `width:50px;height:50px;display:flex;align-items:center;justify-content:center;font-size:32px;flex-shrink:0;`;
        emojiEl.textContent = rankObj.emoji;
        imgEl.replaceWith(emojiEl);
    };

    const info = document.createElement('div');
    info.className = 'achievement-info';
    info.innerHTML = `
        <strong id="txt-rankup-notif-titulo" style="color:${rankObj.color};letter-spacing:2px;">${tituloRango}</strong>
        <span style="color:#fff;font-size:13px;">${rankObj.emoji} ${rankObj.name}</span>
    `;

    notification.appendChild(imgEl);
    notification.appendChild(info);
    document.body.appendChild(notification);
    notification.classList.add('showing');
    // Re-aplica color/fuente/degradado del config si 'txt-rankup-notif-titulo'
    // está descomentado en estilosTexto (si no, se queda con el color del rango)
    window.aplicarEstilosTexto?.();
    setTimeout(() => {
        notification.classList.remove('showing');
        setTimeout(() => notification.remove(), 300);
    }, 4000);
};

function showAchievementNotification(achievement) {
    const tituloLogro = window.GEM_CONFIG?.textos?.logros?.notificacion?.tituloLogro || '¡LOGRO DESBLOQUEADO!';
    // Antes esto SIEMPRE leía achievement.img (que los logros normales no tienen,
    // solo lo pasan los trofeos de comida) — por eso salía <img src="undefined">
    // roto en logros normales. Ahora usa img si existe, si no cae a icon (emoji).
    const iconValor = achievement.img || achievement.icon;
    const notification = document.createElement('div');
    notification.className = 'achievement-notification';
    notification.innerHTML = `
            ${window.renderIcon(iconValor, { clase: 'achievement-icon', tamano: 50 })}
            <div class="achievement-info">
                <strong id="txt-achievement-notif-titulo">${tituloLogro}</strong>
                <span>${achievement.name}</span>
            </div>
        `;
    document.body.appendChild(notification);
    notification.classList.add('showing');
    // Re-aplica color/fuente/degradado del config (elemento recién creado)
    window.aplicarEstilosTexto?.();
    setTimeout(() => {
        notification.classList.remove('showing');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function showAchievementsPanel() {
    const panel = document.getElementById('achievementsPanel');
    const body = document.getElementById('achievementsBody');
    if (!panel || !body) return;

    const unlockedCount = ACHIEVEMENTS_DATA.filter(a => a.unlocked).length;
    const totalCount = ACHIEVEMENTS_DATA.length;

    const textoDesbloqueados = (window.GEM_CONFIG?.textos?.logros?.desbloqueadosTemplate || 'Desbloqueados: {actual}/{total}')
        .replace('{actual}', unlockedCount)
        .replace('{total}', totalCount);

    body.innerHTML = `
            <div class="achievements-stats">
                <span>${textoDesbloqueados}</span>
            </div>
            <div class="achievements-grid">
                ${ACHIEVEMENTS_DATA.map(achievement => `
                    <div class="achievement-item ${achievement.unlocked ? 'unlocked' : 'locked'}">
                        ${window.renderIcon(achievement.icon, { clase: 'achievement-icon' })}
                        <div class="achievement-info">
                            <strong>${achievement.name}</strong>
                            <p>${achievement.description}</p>
                        </div>
                        ${achievement.unlocked ? '<span class="achievement-status">✓</span>' : ''}
                    </div>
                `).join('')}
            </div>
        `;

    panel.style.display = 'grid';
    panel.classList.remove('entering', 'leaving');
    void panel.offsetWidth;
    panel.classList.add('entering');
}

function closeAchievementsPanel() {
    const panel = document.getElementById('achievementsPanel');
    if (panel) {
        panel.classList.remove('entering');
        panel.classList.add('leaving');
        setTimeout(() => {
            panel.style.display = 'none';
            panel.classList.remove('leaving');
        }, 350);
    }
}

loadAchievements();

window.showAchievementsPanel = showAchievementsPanel;
window.closeAchievementsPanel = closeAchievementsPanel;
window.unlockAchievement = unlockAchievement;
window.unlockTrophyAchievement = unlockTrophyAchievement;

// =====================================================
// AUTO SAVE SYSTEM
// =====================================================

const AUTO_SAVE_INTERVAL = 60000; // 60 segundos

function autoSave() {
    // Guardar datos del jugador
    if (window.playerData) {
        localStorage.setItem('deadCoins', window.playerData.deadCoins);
        localStorage.setItem('gems', window.playerData.gems);
        // XP del sistema de rangos
        if (typeof window.playerData.totalXP === 'number') {
            localStorage.setItem('totalXP', String(window.playerData.totalXP));
        }
    }

    function startAutoSave() {
        autoSave();
        setInterval(autoSave, AUTO_SAVE_INTERVAL);
    }

    // Iniciar auto-save cuando el DOM esté cargado
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', startAutoSave);
    } else {
        startAutoSave();
    }

    window.autoSave = autoSave;

    window.addEventListener(
        "DOMContentLoaded",
        applyMuteState
    );
}

// Poblar el banner del menú principal con los datos del jugador al cargar
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateProfilePanelStats);
} else {
    setTimeout(updateProfilePanelStats, 0);
}
