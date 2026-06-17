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

        window.menuMusic.play().catch(() => { });

    }

    const overlay =
        document.getElementById("overlay");

    overlay.classList.add("slide-down");

    setTimeout(() => {

        overlay.style.display = "none";

        overlay.classList.remove("slide-down");

        window.showLevelSelect();

        drawCarousel();

        const ls =
            document.getElementById("levelSelect");

        ls.classList.add("slide-up");

        setTimeout(() => {

            ls.classList.remove("slide-up");

        }, 500);

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
    document.getElementById("optionsPanel").style.display = "block";
};

// =====================================================
// PROFILE / AVATAR
// =====================================================

const PROFILE_AVATARS = [
    "assets/Imagenes/Avatares/Avatar_Default.png",
    "assets/Imagenes/Avatares/DXZ_Avatar.png",
    "assets/Imagenes/Avatares/FOX_Avatar.png",
    "assets/Imagenes/Avatares/BRIFON_Avatar.png",
    "assets/Imagenes/BUHE Avatar.png"
];

let selectedProfileAvatar =
    localStorage.getItem("playerAvatar") || PROFILE_AVATARS[0];

function refreshProfilePreview() {
    const preview = document.getElementById("profilePreview");
    if (preview) preview.style.backgroundImage = `url("${selectedProfileAvatar}")`;
}

function formatTime(seconds) {
    if (!Number.isFinite(seconds) || seconds <= 0) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
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

function getUnlockedLevelsCount() {
    const levels = window.levels || [];
    if (levels.length > 0) {
        const unlocked = levels.filter((level, index) => {
            if (level.unlocked) return true;
            return localStorage.getItem(`level${index}Unlocked`) === 'true';
        }).length;
        return `${unlocked} / ${levels.length}`;
    }

    return '0 / 0';
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
    const avatarUrl = localStorage.getItem('playerAvatar') || PROFILE_AVATARS[0];

    const coinsValue = window.infiniteCoinsMode ? '∞' : (parseInt(localStorage.getItem('deadCoins') || '0', 10) || 0);
    const gemsValue = window.infiniteCoinsMode ? '∞' : (parseInt(localStorage.getItem('gems') || '0', 10) || 0);

    const profileFields = {
        'menu-profile-rank': rankName,
        'profileStat-total-xp': totalXP.toLocaleString(),
        'profileStat-xp-to-next': nextRank
            ? xpToNext.toLocaleString() + ' XP'
            : '¡Máximo!',
        'menu-profile-name': playerName,
        'menu-profile-gems': gemsValue,
        'menu-profile-coins': coinsValue,
        'profileStat-longest-combo': stats.longestCombo || stats.maxCombo || 0,
        'profileStat-game-wins': wins,
        'profileStat-game-losses': losses,
        'profileStat-games-played': gamesPlayed,
        'profileStat-total-time': formatTime(stats.totalTimePlayed),
        'profileStat-current-coins': coinsValue,
        'profileStat-current-gems': gemsValue,
        'profileStat-unlocked-levels': getUnlockedLevelsCount(),
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
        }
        // Barra de progreso
        const progressBar = document.getElementById('rank-progress-bar-fill');
        if (progressBar) progressBar.style.width = (rankProgress * 100).toFixed(1) + '%';
    }

    const profileNameEl = document.getElementById('menu-profile-name');
    const profileAvatarEl = document.getElementById('menu-profile-avatar');
    const heroNameEl = document.getElementById('profileHeroName');
    const heroRankEl = document.getElementById('profileHeroRank');
    const profilePreviewEl = document.getElementById('profilePreview');

    if (profileNameEl) profileNameEl.textContent = playerName;
    if (profileAvatarEl) {
        profileAvatarEl.style.backgroundImage = `url("${avatarUrl}")`;
        profileAvatarEl.style.backgroundSize = 'cover';
        profileAvatarEl.style.backgroundPosition = 'center';
    }
    if (heroNameEl) heroNameEl.textContent = playerName;
    // heroRankEl lo maneja el bloque rankObj de arriba (con emoji y color)
    // Solo aplicar fallback si rankObj no existe
    if (!rankObj && heroRankEl) heroRankEl.textContent = rankName;
    if (profilePreviewEl) {
        profilePreviewEl.style.backgroundImage = `url("${avatarUrl}")`;
        profilePreviewEl.style.backgroundSize = 'cover';
        profilePreviewEl.style.backgroundPosition = 'center';
    }
}

window.openProfileMenu = function () {
    window.playSfx?.('avatarBanner', 0.55);
    selectedProfileAvatar =
        localStorage.getItem("playerAvatar") || PROFILE_AVATARS[0];

    const panel = document.getElementById("profilePanel");
    refreshProfilePreview();
    updateProfilePanelStats();
    if (panel) panel.classList.add("showing");
    // Render rank path visible by default when opening profile
    setTimeout(() => window.renderRankPathOnOpen?.(), 50);
};

window.closeProfileMenu = function () {
    const panel = document.getElementById("profilePanel");
    if (panel) panel.classList.remove("showing");
};

// Profile editing is not currently displayed in the profile panel.

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

    document.getElementById(
        "controls-mode-text"
    ).innerText = window.adaptiveControls
            ? "Controles adaptativos"
            : "Controles fijos";
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

function syncOptionsPanel() {
    const music = document.getElementById('music-volume');
    const sfx = document.getElementById('sfx-volume');
    const side = document.getElementById('touch-side-offset');
    const gravity = document.getElementById('touch-gravity-offset');
    const size = document.getElementById('touch-size');
    const opacity = document.getElementById('touch-opacity');
    const powerupX = document.getElementById('powerup-offset-x');
    const powerupY = document.getElementById('powerup-offset-y');
    if (music) music.value = Math.round((parseFloat(localStorage.getItem('musicVolume') || '0.45')) * 100);
    if (sfx) sfx.value = Math.round((parseFloat(localStorage.getItem('sfxVolume') || '0.75')) * 100);
    if (side) side.value = localStorage.getItem('touchSideOffset') || '50';
    if (gravity) gravity.value = localStorage.getItem('touchGravityOffset') || '50';
    if (size) size.value = localStorage.getItem('touchSize') || '100';
    if (opacity) opacity.value = localStorage.getItem('touchOpacity') || '100';
    if (powerupX) powerupX.value = localStorage.getItem('powerupOffsetX') || '0';
    if (powerupY) powerupY.value = localStorage.getItem('powerupOffsetY') || '0';
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
    document.body.classList.toggle('reduced-motion', next);
    document.body.classList.toggle('performance-mode', next);
    updateMotionText();
}

function updateMotionText() {
    const el = document.getElementById('motion-mode-text');
    if (el) el.textContent = localStorage.getItem('reducedMotion') === 'true'
        ? 'Rendimiento alto'
        : 'Visuales completos';
}

function saveTouchLayout() {
    const side = document.getElementById('touch-side-offset');
    const gravity = document.getElementById('touch-gravity-offset');
    const size = document.getElementById('touch-size');
    const opacity = document.getElementById('touch-opacity');
    const powerupX = document.getElementById('powerup-offset-x');
    const powerupY = document.getElementById('powerup-offset-y');
    if (side) localStorage.setItem('touchSideOffset', side.value);
    if (gravity) localStorage.setItem('touchGravityOffset', gravity.value);
    if (size) localStorage.setItem('touchSize', size.value);
    if (opacity) localStorage.setItem('touchOpacity', opacity.value);
    if (powerupX) localStorage.setItem('powerupOffsetX', powerupX.value);
    if (powerupY) localStorage.setItem('powerupOffsetY', powerupY.value);
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

                window.menuMusic.play();

            }
}, { once: true });

document.getElementById('go-retry').onclick = () => {
    document.getElementById('gameOver').style.display = 'none';
    window.startGame(window.currentLevel);
};

document.getElementById('go-menu').onclick = () => {
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

            window.menuMusic.play();

        }
};

document.getElementById('go-levels').onclick = () => {
    document.getElementById('gameOver').style.display = 'none';
    document.getElementById("gameCanvas").style.visibility = "hidden";
    document.body.classList.remove('is-playing-touch');
    const pauseBtn = document.getElementById('pause-btn');
    if (pauseBtn) pauseBtn.classList.remove('is-playing');
    if (typeof window.showLevelSelect === "function") window.showLevelSelect();
};

document.getElementById('gw-menu').onclick = () => {
    document.getElementById('gameWin').style.display = 'none';
    window.menuMusic.currentTime = 0;
    if (window.menuMusic.paused)
        if (
            window.menuMusic &&
            window.menuMusic.paused &&
            !window.isMuted
        ) {

            window.menuMusic.play();

        }
    document.getElementById('overlay').style.display = 'flex';
    updateMenuHUD();
};

document.getElementById('gw-levels').onclick = () => {
    document.getElementById('gameWin').style.display = 'none';
    document.getElementById("gameCanvas").style.visibility = "hidden";
    document.body.classList.remove('is-playing-touch');
    const pauseBtn = document.getElementById('pause-btn');
    if (pauseBtn) pauseBtn.classList.remove('is-playing');
    if (typeof window.showLevelSelect === "function") window.showLevelSelect();
};

document.getElementById('gw-retry').onclick = () => {
    document.getElementById('gameWin').style.display = 'none';
    window.startGame(window.currentLevel);
};

window.pauseGame = function () {
    if (!window.running || window.paused) return;
    window.paused = true;
    if (window.bgMusic) window.bgMusic.pause();
    document.getElementById('pausePanel').classList.add('showing');
};

window.resumeGame = function () {
    if (!window.paused) return;
    window.paused = false;
    document.getElementById('pausePanel').classList.remove('showing');
    if (window.bgMusic && !window.isMuted) window.bgMusic.play();
};

const pauseContinueBtn = document.getElementById('pause-continue');
if (pauseContinueBtn) pauseContinueBtn.onclick = () => window.resumeGame();

const pauseOptionsBtn = document.getElementById('pause-options');
if (pauseOptionsBtn) pauseOptionsBtn.onclick = () => openOptionsPanel();

const pauseLevelsBtn = document.getElementById('pause-levels');
if (pauseLevelsBtn) pauseLevelsBtn.onclick = () => {
    window.paused = false;
    window.running = false;
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
        if (window.menuMusic.paused && !window.isMuted) window.menuMusic.play();
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
        ? "assets/Imagenes/Icono/Music_Off.png"
        : "assets/Imagenes/Icono/Music_On.png";
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

function toggleInfiniteCoins() {
    window.infiniteCoinsMode = !window.infiniteCoinsMode;
    localStorage.setItem('infiniteCoinsMode', window.infiniteCoinsMode ? 'true' : 'false');
    
    const btn = document.getElementById('infinite-coins-btn');
    if (btn) {
        btn.textContent = `MONEDAS INFINITAS: ${window.infiniteCoinsMode ? 'ON' : 'OFF'}`;
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
        menuBtn.textContent = `MONEDAS INFINITAS: ${window.infiniteCoinsMode ? 'ON' : 'OFF'}`;
        menuBtn.style.color = window.infiniteCoinsMode ? '#00ff64' : '#ff4444';
    }
    
    // Actualizar display de monedas inmediatamente
    updateProfilePanelStats();
    
    window.playSfx?.('menuSelect');
}

window.toggleInfiniteCoins = toggleInfiniteCoins;

// Inicializar estado del botón
if (document.getElementById('infinite-coins-btn')) {
    document.getElementById('infinite-coins-btn').textContent = `MONEDAS INFINITAS: ${window.infiniteCoinsMode ? 'ON' : 'OFF'}`;
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
    document.getElementById('infinite-coins-menu-text').textContent = `MONEDAS INFINITAS: ${window.infiniteCoinsMode ? 'ON' : 'OFF'}`;
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

function showAchievementNotification(achievement) {
    const notification = document.createElement('div');
    notification.className = 'achievement-notification';
    notification.innerHTML = `
        <span class="achievement-icon">${achievement.icon}</span>
        <div class="achievement-info">
            <strong>¡LOGRO DESBLOQUEADO!</strong>
            <span>${achievement.name}</span>
        </div>
    `;
    document.body.appendChild(notification);
    notification.classList.add('showing');
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

    body.innerHTML = `
        <div class="achievements-stats">
            <span>Desbloqueados: ${unlockedCount}/${totalCount}</span>
        </div>
        <div class="achievements-grid">
            ${ACHIEVEMENTS_DATA.map(achievement => `
                <div class="achievement-item ${achievement.unlocked ? 'unlocked' : 'locked'}">
                    <span class="achievement-icon">${achievement.icon}</span>
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
    panel.classList.add('showing');
}

function closeAchievementsPanel() {
    const panel = document.getElementById('achievementsPanel');
    if (panel) {
        panel.classList.remove('showing');
        setTimeout(() => panel.style.display = 'none', 300);
    }
}

loadAchievements();

window.showAchievementsPanel = showAchievementsPanel;
window.closeAchievementsPanel = closeAchievementsPanel;
window.unlockAchievement = unlockAchievement;

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