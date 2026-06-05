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

document.getElementById("shop-btn").onclick = () => { window.playSfx?.('menuSelect'); openShop(); };

document.getElementById("options-btn")
    .onclick = () => {
        window.playSfx?.('menuSelect');
        openOptionsPanel();
    };

document.getElementById('inventory-btn').onclick = () => { window.playSfx?.('menuSelect'); openInventory(); };

['play-btn', 'shop-btn', 'options-btn', 'inventory-btn', 'menu-avatar'].forEach(id => {
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

const PROFILE_NAME_COST_GEMS = 0; // Futuro costo: subir este valor cuando quieras cobrar gemas.
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

    document.querySelectorAll(".avatar-option").forEach(option => {
        option.classList.toggle(
            "selected",
            option.dataset.avatar === selectedProfileAvatar
        );
    });
}

function renderAvatarGrid() {
    const grid = document.getElementById("avatarGrid");
    if (!grid) return;

    grid.innerHTML = PROFILE_AVATARS.map(src => `
        <button class="avatar-option" type="button" data-avatar="${src}"
            style="background-image:url('${src}')"
            aria-label="Seleccionar avatar"></button>
    `).join("");

    grid.querySelectorAll(".avatar-option").forEach(button => {
        button.onclick = () => {
            window.playSfx?.('avatarBanner', 0.55);
            selectedProfileAvatar = button.dataset.avatar;
            refreshProfilePreview();
        };
    });
}

window.openProfileMenu = function () {
    window.playSfx?.('avatarBanner', 0.55);
    selectedProfileAvatar =
        localStorage.getItem("playerAvatar") || PROFILE_AVATARS[0];

    const panel = document.getElementById("profilePanel");
    const input = document.getElementById("profileNameInput");
    const cost = document.getElementById("profileCost");

    if (input) input.value = localStorage.getItem("playerName") || "Jugador";
    if (cost) {
        cost.textContent = PROFILE_NAME_COST_GEMS > 0
            ? `COSTO FUTURO: ${PROFILE_NAME_COST_GEMS} GEMAS`
            : "GRATIS POR AHORA";
    }

    renderAvatarGrid();
    refreshProfilePreview();
    panel.classList.add("showing");
};

window.closeProfileMenu = function () {
    const panel = document.getElementById("profilePanel");
    if (panel) panel.classList.remove("showing");
};

document.getElementById("profileSaveBtn").onclick = () => {
    const input = document.getElementById("profileNameInput");
    const nextName = (input.value || "Jugador").trim().slice(0, 14) || "Jugador";

    if (PROFILE_NAME_COST_GEMS > 0) {
        const gems = parseInt(localStorage.getItem("gems") || "0");
        if (gems < PROFILE_NAME_COST_GEMS) {
            alert("No tienes suficientes gemas.");
            return;
        }
        localStorage.setItem("gems", gems - PROFILE_NAME_COST_GEMS);
    }

    localStorage.setItem("playerName", nextName);
    localStorage.setItem("playerAvatar", selectedProfileAvatar);
    window.player = {
        ...(window.player || {}),
        name: nextName,
        avatar: selectedProfileAvatar
    };

    if (typeof updateMenuHUD === "function") updateMenuHUD();
    window.closeProfileMenu();
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
    if (music) music.value = Math.round((parseFloat(localStorage.getItem('musicVolume') || '0.45')) * 100);
    if (sfx) sfx.value = Math.round((parseFloat(localStorage.getItem('sfxVolume') || '0.75')) * 100);
    if (side) side.value = localStorage.getItem('touchSideOffset') || '50';
    if (gravity) gravity.value = localStorage.getItem('touchGravityOffset') || '50';
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
    if (side) localStorage.setItem('touchSideOffset', side.value);
    if (gravity) localStorage.setItem('touchGravityOffset', gravity.value);
    applyTouchLayout();
    window.playSfx?.('avatarBanner', 0.6);
}

function applyTouchLayout() {
    document.documentElement.style.setProperty('--touch-side', localStorage.getItem('touchSideOffset') || '50');
    document.documentElement.style.setProperty('--touch-gravity', localStorage.getItem('touchGravityOffset') || '50');
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
        if (window.menuMusic.paused)
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
    document.getElementById('pause-btn').classList.remove('is-playing');
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
    document.getElementById('pause-btn').classList.remove('is-playing');
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
    document.getElementById('pause-btn').classList.remove('is-playing');
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

document.getElementById('pause-continue').onclick = () => window.resumeGame();
document.getElementById('pause-options').onclick = () => openOptionsPanel();
document.getElementById('pause-levels').onclick = () => {
    window.paused = false;
    window.running = false;
    document.getElementById('pausePanel').classList.remove('showing');
    document.getElementById('pause-btn').classList.remove('is-playing');
    document.getElementById("gameCanvas").style.visibility = "hidden";
    document.body.classList.remove('is-playing-touch');
    if (window.bgMusic) window.bgMusic.pause();
    if (typeof window.showLevelSelect === "function") window.showLevelSelect();
};
document.getElementById('pause-menu').onclick = () => {
    window.paused = false;
    window.running = false;
    document.getElementById('pausePanel').classList.remove('showing');
    document.getElementById("gameCanvas").style.visibility = "hidden";
    document.body.classList.remove('is-playing-touch');
    document.getElementById('pause-btn').classList.remove('is-playing');
    document.getElementById('overlay').style.display = 'flex';
    if (window.bgMusic) {
        window.bgMusic.pause();
        window.bgMusic.currentTime = 0;
    }
    window.menuMusic.currentTime = 0;
    if (window.menuMusic.paused && !window.isMuted) window.menuMusic.play();
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
    }
    
    // Guardar potenciadores
    window.savePowerups?.();
    
    // Guardar keybinds
    localStorage.setItem('customKeybinds', JSON.stringify(window.customKeybinds || {}));
    
    // Guardar logros
    localStorage.setItem('achievements', JSON.stringify(window.ACHIEVEMENTS_DATA || []));
    
    // Guardar combo stats
    window.saveComboStats?.();
    
    console.log('Auto-save completado');
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
