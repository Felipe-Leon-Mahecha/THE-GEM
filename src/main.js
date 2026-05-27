function preloadLevelImages(lvl) {
    const config = window.getLevelConfig?.(lvl);
    if (!config?.assets) return;
    Object.values(config.assets).forEach(src => {
        if (typeof src === 'string' && src.endsWith('.png')) {
            const img = new Image();
            img.src = src;
        }
    });
}
// Precarga todos los niveles al iniciar
setTimeout(() => {
    for (let i = 1; i <= 10; i++) preloadLevelImages(i);
}, 1000);

let gameTimerInterval = null;
window.currentLevel = 0;
const LEVEL_WIN_TIME = 133; // 2:13.3 en segundos

window.SFX = {
    buyClick: 'assets/Sonidos/UI/Sonido Blow.mp3',
    menuHover: 'assets/Sonidos/UI/Menu Bottom.mp3',
    levelHover: 'assets/Sonidos/UI/Nivel Bottom.mp3',
    startGame: 'assets/Sonidos/UI/Start game buttom.mp3',
    gameOver: 'assets/Sonidos/UI/Game over.mp3',
    powerUp: 'assets/Sonidos/UI/Powewr up on.mp3',
    sawShort: 'assets/Sonidos/UI/Sierra 1.mp3',
    sawLong: 'assets/Sonidos/UI/Sierra 2.mp3',
    vipBuy: 'assets/Sonidos/UI/VIP interfaz sound.mp3',
    reward: 'assets/Sonidos/UI/Reward.mp3',
    selectTrail: 'assets/Sonidos/UI/Select Trail.mp3',
    spend: 'assets/Sonidos/UI/Gastar money.mp3',
    passReward: 'assets/Sonidos/UI/Pass Reward.mp3',
    colorSelect: 'assets/Sonidos/UI/Color select.mp3',
    menuSelect: 'assets/Sonidos/UI/Menu select bottom.mp3',
    avatarBanner: 'assets/Sonidos/UI/Avatar y banner select.mp3',
    laser: 'assets/Sonidos/UI/Sonido laser.mp3'
};

window.sfxVolume = parseFloat(localStorage.getItem('sfxVolume') || '0.75');
window.musicVolume = parseFloat(localStorage.getItem('musicVolume') || '0.45');
window.sfxCache = {};
const SFX_POOL_SIZE = 4;

window.playSfx = function (name, volume = 1) {
    if (window.isMuted) return;
    const src = window.SFX?.[name];
    if (!src) return;
    let entry = window.sfxCache[name];
    if (!entry) {
        entry = {
            index: 0,
            pool: Array.from({ length: SFX_POOL_SIZE }, () => {
                const audio = new Audio(src);
                audio.preload = 'auto';
                return audio;
            })
        };
        window.sfxCache[name] = entry;
    }
    const sound = entry.pool[entry.index++ % entry.pool.length];
    sound.pause();
    sound.currentTime = 0;
    sound.volume = Math.max(0, Math.min(1, window.sfxVolume * volume));
    sound.play().catch(() => { });
};

window.applyAudioSettings = function () {
    window.sfxVolume = parseFloat(localStorage.getItem('sfxVolume') || '0.75');
    window.musicVolume = parseFloat(localStorage.getItem('musicVolume') || '0.45');
    if (window.bgMusic) window.bgMusic.volume = window.isMuted ? 0 : window.musicVolume;
    if (window.menuMusic) window.menuMusic.volume = window.isMuted ? 0 : Math.min(1, window.musicVolume * 0.55);
};

const heartImg = new Image();
heartImg.src = "assets/Imagenes/Icono/Corazon_Vida.png";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d", { alpha: false });
ctx.imageSmoothingEnabled = true;
ctx.imageSmoothingQuality = "medium";
window.canvas = canvas;
window.ctx = ctx;
window.GAME_PERF = {
    frame: 0,
    now: 0,
    lowPower() {
        return document.body.classList.contains("is-touch-device") || localStorage.getItem("reducedMotion") === "true";
    }
};

window.bgMusic =
    new Audio('assets/Musica/Gravity Well.mp3');
bgMusic.loop = true;
bgMusic.volume = window.musicVolume;
window.currentLevelMusicSrc = bgMusic.src;

//aqui agrega canciones nuevas para el menu
const cancionesMenu = [
    'assets/Musica/Nebula Rift (MENU).mp3',
    'assets/Musica/Chrome Lullaby 2 (MENU).mp3'
];

window.menuMusic = new Audio();
window.menuMusic.volume =
    Math.min(1, window.musicVolume * 0.55);
window.menuMusic.addEventListener('ended', () => {
    if (!window.isMuted && !window.running) reproducirAleatoria();
});

let ultimaCancion = -1;

function reproducirAleatoria() {
    const player = window.menuMusic;
    if (window.isMuted || !player) return;

    let indice;

    do {
        indice =
            Math.floor(Math.random() * cancionesMenu.length);
    }
    while (
        cancionesMenu.length > 1 &&
        indice === ultimaCancion
    );

    ultimaCancion = indice;

    player.src = cancionesMenu[indice];

    player.currentTime = 0;

    player.play().catch(() => { });
}

// cuando termina → otra
window.ensureMenuMusic = function () {
    if (!window.menuMusic || window.isMuted || window.running) return;
    if (!window.menuMusic.src || window.menuMusic.ended) reproducirAleatoria();
    else if (window.menuMusic.paused) window.menuMusic.play().catch(() => { });
};

reproducirAleatoria();

// =====================================================
// OFFSCREEN CANVAS
// =====================================================

const offscreen = document.createElement("canvas");
const offCtx = offscreen.getContext("2d");
const backgroundCanvas = document.createElement("canvas");
const backgroundCtx = backgroundCanvas.getContext("2d", { alpha: false });

function drawCenteredImage(ctxTarget, img, x, y, width, height, scale = 1, offsetX = 0, offsetY = 0) {
    if (!img || !img.complete || img.naturalWidth <= 0) return;
    const w = width * scale;
    const h = height * scale;
    ctxTarget.drawImage(img, x - w / 2 + offsetX, y - h / 2 + offsetY, w, h);
}

function drawCoverImage(ctxTarget, img, x, y, width, height, scale = 1, offsetX = 0, offsetY = 0) {
    if (!img || !img.complete || img.naturalWidth <= 0) return;
    const targetW = width * scale;
    const targetH = height * scale;
    const srcRatio = img.naturalWidth / img.naturalHeight;
    const targetRatio = targetW / targetH;
    let sx = 0, sy = 0, sw = img.naturalWidth, sh = img.naturalHeight;
    if (srcRatio > targetRatio) {
        sw = img.naturalHeight * targetRatio;
        sx = (img.naturalWidth - sw) / 2;
    } else {
        sh = img.naturalWidth / targetRatio;
        sy = (img.naturalHeight - sh) / 2;
    }
    ctxTarget.drawImage(img, sx, sy, sw, sh, x - targetW / 2 + offsetX, y - targetH / 2 + offsetY, targetW, targetH);
}

function buildBackgroundCanvas(lvl = window.level || 1) {
    if (!window.canvas) return;
    backgroundCanvas.width = window.canvas.width;
    backgroundCanvas.height = window.canvas.height;
    const levelConfig = window.getLevelConfig ? window.getLevelConfig(lvl) : { assets: {} };
    const levelAssets = levelConfig.assets || {};
    const visual = levelConfig.visual || {};
    const bg = window.getLevelImage ? window.getLevelImage(levelAssets.outerBackground) : null;
    if (bg && bg.complete && bg.naturalWidth > 0) {
        drawCoverImage(
            backgroundCtx,
            bg,
            backgroundCanvas.width / 2,
            backgroundCanvas.height / 2,
            backgroundCanvas.width,
            backgroundCanvas.height,
            visual.outerBackgroundScale ?? 1,
            visual.outerBackgroundOffsetX || 0,
            visual.outerBackgroundOffsetY || 0
        );
        return;
    }
    if (bg && !bg.complete) {
        bg.onload = () => {
            if ((window.level || 1) === lvl) buildBackgroundCanvas(lvl);
        };
    }
    const fallbackBg = backgroundCtx.createLinearGradient(0, 0, 0, backgroundCanvas.height);
    fallbackBg.addColorStop(0, "#12131a");
    fallbackBg.addColorStop(1, "#020307");
    backgroundCtx.fillStyle = fallbackBg;
    backgroundCtx.fillRect(0, 0, backgroundCanvas.width, backgroundCanvas.height);
}

function buildStaticCanvas(lvl = window.level || 1) {
    if (!window.canvas || !window.BASE_RADIUS || !window.DOME_RADIUS) return;

    const levelConfig = window.getLevelConfig ? window.getLevelConfig(lvl) : { theme: "silver", assets: {} };
    const levelAssets = levelConfig.assets || {};
    const visual = levelConfig.visual || {};
    const sphereBgImg = window.getLevelImage ? window.getLevelImage(levelAssets.sphereBackground) : null;
    const coreImg = window.getLevelImage ? window.getLevelImage(levelAssets.core) : null;

    offscreen.width = window.canvas.width;
    offscreen.height = window.canvas.height;

    const cx = offscreen.width / 2;
    const cy = offscreen.height / 2;

    offCtx.save();
    offCtx.translate(cx, cy);

    // TUNNEL
    offCtx.beginPath();
    offCtx.arc(0, 0, window.DOME_RADIUS, 0, Math.PI * 2);
    offCtx.arc(0, 0, window.BASE_RADIUS, 0, Math.PI * 2, true);
    offCtx.closePath();
    let tg = offCtx.createRadialGradient(0, 0, window.BASE_RADIUS, 0, 0, window.DOME_RADIUS);
    if (levelConfig.theme === "volcano") {
        tg.addColorStop(0, "#1a0800");
        tg.addColorStop(0.3, "#8b2500");
        tg.addColorStop(0.5, "#cc4400");
        tg.addColorStop(0.8, "#3d1000");
        tg.addColorStop(1, "#0a0000");
    } else if (levelConfig.theme === "frozen") {
        tg.addColorStop(0, "#061824");
        tg.addColorStop(0.3, "#6ad8ff");
        tg.addColorStop(0.5, "#d8fbff");
        tg.addColorStop(0.8, "#4b8fb8");
        tg.addColorStop(1, "#05101a");
    } else {
        tg.addColorStop(0, "#3a3a3a");
        tg.addColorStop(0.3, "#d8d8d8");
        tg.addColorStop(0.5, "#ffffff");
        tg.addColorStop(0.8, "#8d8d8d");
        tg.addColorStop(1, "#3a3a3a");
    }
    offCtx.fillStyle = tg;
    offCtx.fill("evenodd");

    if (sphereBgImg) {
        offCtx.save();
        offCtx.beginPath();
        offCtx.arc(0, 0, window.DOME_RADIUS - 12, 0, Math.PI * 2);
        offCtx.arc(0, 0, window.BASE_RADIUS + 12, 0, Math.PI * 2, true);
        offCtx.clip("evenodd");
        drawCoverImage(
            offCtx,
            sphereBgImg,
            0,
            0,
            window.DOME_RADIUS * 2,
            window.DOME_RADIUS * 2,
            visual.sphereBackgroundScale ?? 0.72,
            visual.sphereBackgroundOffsetX || 0,
            visual.sphereBackgroundOffsetY || 0
        );
        offCtx.restore();
    }

    // PANELS
    for (let i = 0; i < 0; i++) {
        let a = (Math.PI * 2 / 0) * i;
        offCtx.beginPath();
        offCtx.moveTo(Math.cos(a) * (window.BASE_RADIUS + 10), Math.sin(a) * (window.BASE_RADIUS + 10));
        offCtx.lineTo(Math.cos(a) * (window.DOME_RADIUS - 10), Math.sin(a) * (window.DOME_RADIUS - 10));
        offCtx.strokeStyle = levelConfig.theme === "volcano" ? "rgba(255,60,0,0.12)" : levelConfig.theme === "frozen" ? "rgba(160,230,255,0.16)" : "rgba(255,255,255,0.08)";
        offCtx.lineWidth = 2;
        offCtx.stroke();
    }

    // INNER RING
    offCtx.beginPath();
    offCtx.arc(0, 0, window.DOME_RADIUS - 12, 0, Math.PI * 2);
    offCtx.lineWidth = 3;
    offCtx.strokeStyle = "rgba(255,255,255,0.15)";
    offCtx.stroke();

    // CORE 
    if (coreImg) {
        drawCenteredImage(
            offCtx,
            coreImg,
            0,
            0,
            window.BASE_RADIUS * 2.2,
            window.BASE_RADIUS * 2.2,
            visual.coreScale ?? 1,
            visual.coreOffsetX || 0,
            visual.coreOffsetY || 0
        );
    } else {
        let cg = offCtx.createRadialGradient(-20, -20, 10, 0, 0, window.BASE_RADIUS);
        cg.addColorStop(0, "#fff");
        cg.addColorStop(0.5, "#ccc");
        cg.addColorStop(1, "#444");
        offCtx.beginPath();
        offCtx.arc(0, 0, window.BASE_RADIUS, 0, Math.PI * 2);
        offCtx.fillStyle = cg;
        offCtx.fill();
    }

    offCtx.restore();
}

function isTouchLayout() {
    const viewport = window.visualViewport;
    const width = viewport?.width || window.innerWidth || document.documentElement.clientWidth || screen.width;
    const height = viewport?.height || window.innerHeight || document.documentElement.clientHeight || screen.height;
    const phoneSizedViewport = Math.min(width, height) <= 600 && Math.max(width, height) <= 950;
    return window.matchMedia?.("(hover: none) and (pointer: coarse)").matches ||
        (("ontouchstart" in window) && Math.min(screen.width, screen.height) <= 900) ||
        phoneSizedViewport;
}

function getViewportSize() {
    const viewport = window.visualViewport;
    return {
        width: Math.max(1, Math.round(viewport?.width || window.innerWidth || document.documentElement.clientWidth || 1)),
        height: Math.max(1, Math.round(viewport?.height || window.innerHeight || document.documentElement.clientHeight || 1))
    };
}

function syncPlayfieldSize(width, height, compact) {
    if (!compact) {
        window.BASE_RADIUS = 150;
        window.DOME_RADIUS = 300;
    } else {
        const shortestSide = Math.min(width, height);
        const dome = Math.max(135, Math.min(270, shortestSide * 0.37));
        window.DOME_RADIUS = dome;
        window.BASE_RADIUS = dome * 0.5;
    }
    window.MAX_OFFSET = Math.max(30, window.DOME_RADIUS - window.BASE_RADIUS - 30);
    if (window.offset > window.MAX_OFFSET) window.offset = window.MAX_OFFSET;
}

let lastCanvasWidth = 0;
let lastCanvasHeight = 0;
let lastTouchLayout = null;
let resizeQueued = false;

function resize(force = false) {
    if (!window.canvas) return;
    const touchLayout = isTouchLayout();
    const { width, height } = getViewportSize();
    document.body.classList.toggle("is-touch-device", touchLayout);
    syncPlayfieldSize(width, height, touchLayout);

    const targetWidth = touchLayout ? width : innerWidth;
    const targetHeight = touchLayout ? height : innerHeight;
    const sameSize = targetWidth === lastCanvasWidth && targetHeight === lastCanvasHeight && touchLayout === lastTouchLayout;
    window.compactHud = touchLayout && Math.min(targetWidth, targetHeight) < 520;
    if (sameSize && !force) return;

    if (touchLayout) {
        window.canvas.width = targetWidth;
        window.canvas.height = targetHeight;
        window.canvas.style.width = targetWidth + "px";
        window.canvas.style.height = targetHeight + "px";
        window.canvas.style.position = "fixed";
        window.canvas.style.left = "0";
        window.canvas.style.top = "0";
        window.canvas.style.transform = "none";
    } else {
        window.canvas.width = targetWidth;
        window.canvas.height = targetHeight;
        window.canvas.style.width = '';
        window.canvas.style.height = '';
        window.canvas.style.position = '';
        window.canvas.style.left = '';
        window.canvas.style.top = '';
        window.canvas.style.transform = '';
    }
    lastCanvasWidth = targetWidth;
    lastCanvasHeight = targetHeight;
    lastTouchLayout = touchLayout;
    if (typeof buildStaticCanvas === "function") {
        buildStaticCanvas(window.level || 1);
    }
    if (typeof buildBackgroundCanvas === "function") {
        buildBackgroundCanvas(window.level || 1);
    }
}

function queueResize() {
    if (resizeQueued) return;
    resizeQueued = true;
    requestAnimationFrame(() => {
        resizeQueued = false;
        resize();
    });
}

addEventListener("resize", queueResize, { passive: true });

window.visualViewport?.addEventListener("resize", queueResize, { passive: true });

setTimeout(() => {

    resize(true);

}, 50);

// =====================================================
// GAME STATES
// =====================================================

const GAME_STATES = { MENU: "menu", PLAYING: "playing", SHOP: "shop", GAMEOVER: "gameover" };
let currentState = GAME_STATES.MENU;

// =====================================================
// PLAYER DATA
// =====================================================

const playerData = {
    deadCoins: parseInt(localStorage.getItem("deadCoins") || "10"),
    gems: parseInt(localStorage.getItem("gems") || "5")
};

window.player = {
    name: localStorage.getItem("playerName") || "Jugador",
    avatar: localStorage.getItem("playerAvatar") || "assets/Imagenes/Avatares/Avatar_Default.png"
};

if ((window.player.name || "").toUpperCase() === "LEX") {
    if (playerData.deadCoins < 9999) playerData.deadCoins = 9999;
    if (playerData.gems < 9999) playerData.gems = 9999;
    localStorage.setItem("deadCoins", playerData.deadCoins);
    localStorage.setItem("gems", playerData.gems);
}

// =====================================================
// SKINS
// =====================================================

const skins = {
    default: { color: "#00ffe7", glow: "#00ffe7", core: "#ffffff" },
    plasma: { color: "#ff2fd1", glow: "#ff2fd1", core: "#ffffff" }
};

const DIRECTIONAL_SKINS = {
    daxor: {
        right: "assets/Imagenes/Skins/DAXOR Skin DEMON/DAXOR_Skin_Derecha.png",
        left: "assets/Imagenes/Skins/DAXOR Skin DEMON/DAXOR_Skin_Izquierda.png",
        glow: "#ff2448"
    },
    kenji: {
        right: "assets/Imagenes/Skins/KENJI Skin EPICO/Kenji_Skin_Derecha.png",
        left: "assets/Imagenes/Skins/KENJI Skin EPICO/Kenji_Skin_Izquierda.png",
        glow: "#845cff"
    }
};

const directionalSkinImages = {};
for (const [id, skin] of Object.entries(DIRECTIONAL_SKINS)) {
    directionalSkinImages[id] = {
        right: new Image(),
        left: new Image()
    };
    directionalSkinImages[id].right.src = skin.right;
    directionalSkinImages[id].left.src = skin.left;
}

window.playerFacing = "right";

// =====================================================
// RADIOS
// =====================================================

const isMobileDevice = isTouchLayout();
document.body.classList.toggle("is-touch-device", isMobileDevice);
window.BASE_RADIUS = 150;
window.DOME_RADIUS = 300;
window.MAX_OFFSET = window.DOME_RADIUS - window.BASE_RADIUS - 30;

// =====================================================
// PLAYER
// =====================================================

window.angle = Math.PI;
window.angVel = 0;
window.offset = 0;
window.vel = 0;
window.adaptiveControls = localStorage.getItem("adaptiveControls") === "true";
window.lives = 3;
window.gravityFlipCooldown = 0;
window.gravityPulse = 0;

// =====================================================
// INVULNERABILITY
// =====================================================

window.invulnerable = false;
window.invulnerableTimer = 0;

// =====================================================
// INTRO
// =====================================================

let level = 1;
window.introTimer = 0;
window.showingIntro = false;

// =====================================================
// HIT EFFECT
// =====================================================

window.hitFlash = 0;

// =====================================================
// WORLD
// =====================================================

window.worldRotation = 0
window.worldChangeTimer = 180;

// =====================================================
// GAME
// =====================================================

window.running = false;
window.paused = false;
window.reviveCount = 0;
window.reviveTimer = null;
window.pendingWinChest = null;
window.lasers = [];
window.laserSpawnTimer = 0;

// =====================================================
// INPUT
// =====================================================

window.keys = {
    left: false,
    right: false,
    jump: false,
    gravity: false
};

// =====================================================
// OBSTACLES
// =====================================================

window.obstacles = [];
window.spawnTimer = 0;

// =====================================================
// DEAD COINS
// =====================================================

window.deadCoins = [];
window.deadCoinSpawnTimer = 0;
window.rubies = [];
window.rubySpawnTimer = 0;

// ── Ruta actualizada ──────────────────────────────────
const skullCoinImg = new Image();
skullCoinImg.src = "assets/Imagenes/Monetizacion/DEAD_COIN.png";
const rubyImg = new Image();
rubyImg.src = "assets/Imagenes/Monetizacion/Rubies.png";

// =====================================================
// UPDATE
// =====================================================

function update() {
    if (!window.running) return;
    if (window.paused) return;
    const levelConfig = window.getCurrentLevelConfig ? window.getCurrentLevelConfig() : {};

    if (window.invulnerable) {
        window.invulnerableTimer--;
        if (window.invulnerableTimer <= 0) window.invulnerable = false;
    }

    if (window.hitFlash > 0) window.hitFlash -= 0.03;
    if (window.gravityFlipCooldown > 0) window.gravityFlipCooldown--;
    if (window.gravityPulse > 0) window.gravityPulse -= 0.04;

    if (window.showingIntro) {
        window.introTimer--;
        if (window.introTimer <= 0) window.showingIntro = false;
        return;
    }

    window.gameTimer = (window.gameTimer || 0) + 1 / 60;
    if (!window.paused && window.gameTimer >= (levelConfig.winTime || LEVEL_WIN_TIME)) {
        winGame();
        return;
    }

    // WORLD ROTATION
    window.worldChangeTimer--;
    if (window.worldChangeTimer <= 0) {
        window.worldChangeTimer = 120 + Math.random() * 240;
        let speed = 0.004 + Math.random() * 0.012;
        let dir = Math.random() < 0.5 ? -1 : 1;
        window.targetWorldSpeed = speed * dir;
    }
    window.worldRotationSpeed += (window.targetWorldSpeed - window.worldRotationSpeed) * 0.02;
    window.worldRotation += window.worldRotationSpeed;

    // PLAYER MOVEMENT
    let moveDir = 1;

    if (window.adaptiveControls)
        moveDir =
            window.gravity === 1 ? 1 : -1;

    if (window.keys.left) {
        window.angVel += 0.0026 * moveDir;
        window.playerFacing = "left";
    }
    if (window.keys.right) {
        window.angVel -= 0.0026 * moveDir;
        window.playerFacing = "right";
    }

    window.angVel = Math.max(-0.062, Math.min(0.062, window.angVel * 0.925));
    window.angle += window.angVel;
    if (Math.abs(window.angVel) > 0.0015) {
        window.playerFacing = window.angVel > 0 ? "left" : "right";
    }

    // GRAVITY
    window.vel += 0.38 * window.gravity;
    window.offset += window.vel;

    if (window.offset <= 0) { window.offset = 0; window.vel = 0; }
    if (window.offset >= MAX_OFFSET) { window.offset = MAX_OFFSET; window.vel = 0; }

    // JUMP
    if (window.keys.jump) {
        if (window.gravity === 1 && window.offset === 0) window.vel = -7;
        if (window.gravity === -1 && window.offset === MAX_OFFSET) window.vel = 7;
    }

    // GRAVITY SWITCH
    if (window.keys.gravity) {
        window.gravity *= -1;
        window.vel = window.gravity * 2.6;
        window.gravityFlipCooldown = 5;
        window.gravityPulse = 1;
        window.keys.gravity = false;
    }

    updateTrail();

    // SPAWN OBSTACLES
    window.spawnTimer++;
    let spawnRate = levelConfig.spawnRate || 140;

    if (levelConfig.obstacles && levelConfig.obstacles.spikes && window.spawnTimer > spawnRate) {
        window.spawnTimer = 0;
        spawnObstacleGroup();
    }

    // DEAD COINS SPAWN
    window.deadCoinSpawnTimer++;
    if (window.deadCoinSpawnTimer > (levelConfig.deadCoinSpawnInterval || 500)) {
        window.deadCoinSpawnTimer = 0;
        if (window.deadCoins.length < (levelConfig.maxDeadCoins || 1)) spawnDeadCoin();
    }

    if ((levelConfig.maxRubies || 0) > 0) {
        window.rubySpawnTimer++;
        const rubyInterval = levelConfig.rubySpawnInterval || 900;
        if (window.rubySpawnTimer > rubyInterval) {
            window.rubySpawnTimer = 0;
            if (window.rubies.length < levelConfig.maxRubies && Math.random() < 0.35) spawnRuby();
        }
    }

    // UPDATE DEAD COINS
    for (let i = window.deadCoins.length - 1; i >= 0; i--) {
        let c = window.deadCoins[i];
        c.life--;
        c.pulse += 0.1;
        if (c.life <= 0) { window.deadCoins.splice(i, 1); continue; }

        let r = BASE_RADIUS + window.offset;
        let rel = ((c.angle + window.worldRotation - window.angle + Math.PI * 2) % (Math.PI * 2));
        if (rel > Math.PI) rel -= Math.PI * 2;
        let radialDist = Math.abs(r - c.radius);

        if (Math.abs(rel) < 0.08 && radialDist < 18) {
            playerData.deadCoins++;
            localStorage.setItem("deadCoins", playerData.deadCoins);
            window.deadCoins.splice(i, 1);
        }
    }

    for (let i = window.rubies.length - 1; i >= 0; i--) {
        let rby = window.rubies[i];
        rby.life--;
        rby.pulse += 0.08;
        if (rby.life <= 0) { window.rubies.splice(i, 1); continue; }

        let r = BASE_RADIUS + window.offset;
        let rel = ((rby.angle + window.worldRotation - window.angle + Math.PI * 2) % (Math.PI * 2));
        if (rel > Math.PI) rel -= Math.PI * 2;
        let radialDist = Math.abs(r - rby.radius);

        if (Math.abs(rel) < 0.08 && radialDist < 20) {
            playerData.gems++;
            localStorage.setItem("gems", playerData.gems);
            window.rubies.splice(i, 1);
        }
    }

    // UPDATE OBSTACLES
    for (let i = window.obstacles.length - 1; i >= 0; i--) {
        let o = window.obstacles[i];
        if (o.state === "warning") { o.warningTime--; if (o.warningTime <= 0) { o.warning = false; o.state = "enter"; } }
        else if (o.state === "enter") { o.progress += 0.08; if (o.progress >= 1) { o.progress = 1; o.state = "alive"; } }
        else if (o.state === "alive") { o.life--; if (o.life <= 0) o.state = "leave"; }
        else if (o.state === "leave") { o.progress -= 0.08; if (o.progress <= 0) { window.obstacles.splice(i, 1); continue; } }
    }

    // SIERRA SPAWN
    if (levelConfig.obstacles && levelConfig.obstacles.saws) {
        window.sierraSpawnTimer++;
        if (window.sierraSpawnTimer > 180) {
            window.sierraSpawnTimer = 0;
            spawnSierra();
        }
        updateSierras();
    }

    if (levelConfig.obstacles && levelConfig.obstacles.lasers) {
        window.laserSpawnTimer++;
        const laserRate = levelConfig.lasers?.spawnInterval || levelConfig.laserSpawnInterval || 360;
        if (window.laserSpawnTimer > laserRate) {
            window.laserSpawnTimer = 0;
            spawnIceLaser();
        }
        updateIceLasers();
    }

    checkCollisions();
}

// =====================================================
// DEAD COIN SPAWN
// =====================================================

function spawnDeadCoin() {
    let a = Math.random() * Math.PI * 2;
    let r = BASE_RADIUS + 30 + Math.random() * (MAX_OFFSET - 60);
    window.deadCoins.push({ angle: a, radius: r, life: 240, pulse: Math.random() * 10 });
}

function spawnRuby() {
    let a = Math.random() * Math.PI * 2;
    let r = BASE_RADIUS + 35 + Math.random() * (MAX_OFFSET - 70);
    window.rubies.push({ angle: a, radius: r, life: 420, pulse: Math.random() * 10 });
}

function spawnIceLaser() {
    const levelConfig = window.getCurrentLevelConfig ? window.getCurrentLevelConfig() : {};
    const cfg = levelConfig.lasers || {};
    const variants = cfg.variants || [{ type: "radial", weight: 1 }];
    const totalWeight = variants.reduce((sum, variant) => sum + (variant.weight || 1), 0);
    let roll = Math.random() * totalWeight;
    let variant = variants[0];
    for (const candidate of variants) {
        roll -= candidate.weight || 1;
        if (roll <= 0) {
            variant = candidate;
            break;
        }
    }

    const baseAngle = window.angle - window.worldRotation + Math.PI * (0.45 + Math.random() * 0.9);
    const warningDuration = variant.warningDuration || cfg.warningDuration || 95;
    const outer = variant.outer ?? 0.94;
    const inner = variant.inner ?? 0.35;
    const angularSpan = variant.angularSpan || cfg.angularSpan || 0.28;
    const type = variant.type || "radial";
    const laser = {
        type,
        angle: baseAngle,
        startAngle: baseAngle,
        endAngle: baseAngle,
        inner,
        outer,
        angularSpan,
        warningTime: warningDuration,
        maxWarningTime: warningDuration,
        activeTime: variant.activeDuration || cfg.activeDuration || 46,
        fadeTime: variant.fadeDuration || cfg.fadeDuration || 34,
        maxFadeTime: variant.fadeDuration || cfg.fadeDuration || 34,
        state: 'warning',
        width: variant.angularWidth || cfg.angularWidth || 0.045,
        thickness: variant.thickness || cfg.thickness || 8,
        glowThickness: variant.glowThickness || cfg.glowThickness || 18,
        mobility: variant.mobility || cfg.mobility || "static",
        speed: variant.speed || cfg.speed || 0,
        range: variant.range || cfg.range || 0,
        direction: Math.random() < 0.5 ? -1 : 1,
        warningType: variant.warningType || cfg.warningType || "emitter",
        beamType: variant.beamType || cfg.beamType || "standard",
        played: false
    };

    if (type === "outerChord") {
        laser.startAngle = baseAngle - angularSpan / 2;
        laser.endAngle = baseAngle + angularSpan / 2;
        laser.inner = outer;
        laser.outer = outer;
    } else if (type === "short") {
        laser.startAngle = baseAngle - angularSpan / 3;
        laser.endAngle = baseAngle + angularSpan / 3;
    } else if (type === "giantArc") {
        laser.startAngle = baseAngle - angularSpan / 2;
        laser.endAngle = baseAngle + angularSpan / 2;
        laser.mobility = "static";
    }

    window.lasers.push(laser);
}

function updateIceLasers() {
    for (let i = window.lasers.length - 1; i >= 0; i--) {
        const laser = window.lasers[i];
        if (laser.mobility === "sweep" && laser.state !== "fade") {
            laser.angle += laser.speed * laser.direction;
            if (laser.range && Math.abs(laser.angle - laser.startAngle) > laser.range) {
                laser.direction *= -1;
            }
        }
        if (laser.state === 'warning') {
            laser.warningTime--;
            if (laser.warningTime <= 0) {
                laser.state = 'active';
                if (!laser.played) {
                    window.playSfx?.('laser', 0.85);
                    laser.played = true;
                }
            }
            continue;
        }
        if (laser.state === 'active') {
            laser.activeTime--;
            if (!window.invulnerable) {
                if (laserHitsPlayer(laser)) {
                    playerHit();
                }
            }
            if (laser.activeTime <= 0) laser.state = 'fade';
            continue;
        }
        laser.fadeTime--;
        if (laser.fadeTime <= 0) window.lasers.splice(i, 1);
    }
}

function laserRadius(ratio) {
    return window.BASE_RADIUS + 12 + (window.DOME_RADIUS - window.BASE_RADIUS - 24) * ratio;
}

function getLaserPoints(laser, cx, cy) {
    const angle = laser.angle + window.worldRotation;
    if (laser.type === "outerChord") {
        const r = laserRadius(laser.outer);
        return {
            sx: cx + Math.cos(laser.startAngle + window.worldRotation) * r,
            sy: cy + Math.sin(laser.startAngle + window.worldRotation) * r,
            ex: cx + Math.cos(laser.endAngle + window.worldRotation) * r,
            ey: cy + Math.sin(laser.endAngle + window.worldRotation) * r,
            emitterAngle: laser.startAngle + window.worldRotation
        };
    }

    const startR = laserRadius(laser.inner);
    const endR = laserRadius(laser.outer);
    const startAngle = laser.type === "short" ? laser.startAngle + window.worldRotation : angle;
    const endAngle = laser.type === "short" ? laser.endAngle + window.worldRotation : angle;
    return {
        sx: cx + Math.cos(startAngle) * startR,
        sy: cy + Math.sin(startAngle) * startR,
        ex: cx + Math.cos(endAngle) * endR,
        ey: cy + Math.sin(endAngle) * endR,
        emitterAngle: startAngle
    };
}

function laserHitsPlayer(laser) {
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const playerR = window.BASE_RADIUS + window.offset;
    const px = cx + Math.cos(window.angle) * playerR;
    const py = cy + Math.sin(window.angle) * playerR;

    if (laser.type === "giantArc") {
        const a = window.angle - window.worldRotation;
        const start = normalizeAngle(laser.startAngle);
        const end = normalizeAngle(laser.endAngle);
        const current = normalizeAngle(a);
        const inAngle = start < end
            ? current >= start && current <= end
            : current >= start || current <= end;
        const innerR = laserRadius(laser.inner);
        const outerR = laserRadius(laser.outer);
        return inAngle && playerR >= innerR && playerR <= outerR;
    }

    const p = getLaserPoints(laser, cx, cy);
    const dist = distanceToSegment(px, py, p.sx, p.sy, p.ex, p.ey);
    return dist <= Math.max(10, laser.thickness * 1.4);
}

function normalizeAngle(value) {
    return ((value % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
}

function distanceToSegment(px, py, x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const lenSq = dx * dx + dy * dy || 1;
    const t = Math.max(0, Math.min(1, ((px - x1) * dx + (py - y1) * dy) / lenSq));
    const x = x1 + t * dx;
    const y = y1 + t * dy;
    return Math.hypot(px - x, py - y);
}

// =====================================================
// DRAW
// =====================================================

function draw() {
    if (!window.running && !window.paused) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const levelConfig = window.getCurrentLevelConfig ? window.getCurrentLevelConfig() : { assets: {} };
    const levelAssets = levelConfig.assets || {};
    const visual = levelConfig.visual || {};

    if (window.running) {
        ctx.drawImage(backgroundCanvas, 0, 0);
    }

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    // 1) OFFSCREEN rotando, centrado, con clip al círculo
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, DOME_RADIUS, 0, Math.PI * 2);
    ctx.clip();
    ctx.translate(cx, cy);
    ctx.rotate(worldRotation);
    ctx.drawImage(offscreen, -offscreen.width / 2, -offscreen.height / 2);
    ctx.restore();

    // 2) DEAD COINS — clip al círculo, sin rotar (ángulo ya tiene worldRotation)
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, DOME_RADIUS, 0, Math.PI * 2);
    ctx.clip();
    for (let c of window.deadCoins) {
        let x = cx + Math.cos(c.angle + worldRotation) * c.radius;
        let y = cy + Math.sin(c.angle + worldRotation) * c.radius;
        ctx.save();
        ctx.translate(x, y);
        ctx.drawImage(skullCoinImg, -22, -22, 44, 44);
        ctx.restore();
    }
    for (let rby of window.rubies) {
        let x = cx + Math.cos(rby.angle + worldRotation) * rby.radius;
        let y = cy + Math.sin(rby.angle + worldRotation) * rby.radius;
        let size = 30 + Math.sin(rby.pulse) * 3;
        ctx.save();
        ctx.translate(x, y);
        if (!window.GAME_PERF?.lowPower()) {
            ctx.shadowColor = "rgba(255,40,90,0.95)";
            ctx.shadowBlur = 16;
        }
        ctx.drawImage(rubyImg, -size / 2, -size / 2, size, size);
        ctx.restore();
    }
    ctx.restore();

    const frameImg = window.getLevelImage ? window.getLevelImage(levelAssets.frame) : null;

    // 3) TRAIL
    if (window.running) drawTrail();

    // 4) HIT FLASH
    if (window.hitFlash > 0) {
        ctx.fillStyle = `rgba(255,0,80,${window.hitFlash * 0.25})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    if (window.gravityPulse > 0) {
        ctx.save();
        ctx.strokeStyle = `rgba(255,77,109,${window.gravityPulse * 0.42})`;
        ctx.lineWidth = 2 + window.gravityPulse * 5;
        ctx.beginPath();
        ctx.arc(cx, cy, BASE_RADIUS + window.offset, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
    }

    // 5) PLAYER
    if (window.running) {
        drawPlayer(cx, cy);
    }

    // 6) MARCO: encima del player para que el borde exterior lo tape.
    if (window.running && frameImg) {
        const marcoSize = window.DOME_RADIUS * (visual.frameSize || 2.28);
        drawCenteredImage(ctx, frameImg, cx, cy, marcoSize, marcoSize, visual.frameScale ?? 1, visual.frameOffsetX || 0, visual.frameOffsetY || 0);
    }

    // 7) Trampas encima del marco: si hacen dano, se ven.
    drawSpikesLayer(cx, cy);
    if (typeof drawSierras === "function") drawSierras();
    if (window.lasers && window.lasers.length) drawIceLasers(cx, cy);

    // 9) HUD
    if (!window.running) return;
    drawAbilityIntro();
    const compactHud = !!window.compactHud;
    const hudX = compactHud ? 10 : 20;
    const hudY = Math.max(compactHud ? 10 : 18, canvas.height * (compactHud ? 0.035 : 0.08));
    const hudW = compactHud ? 178 : 240;
    const hudH = compactHud ? 94 : 125;
    const hudPad = compactHud ? 10 : 14;
    ctx.save();
    ctx.fillStyle = "rgba(0,0,0,0.45)";
    ctx.beginPath();
    ctx.roundRect(hudX, hudY, hudW, hudH, 12);
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.08)";
    ctx.lineWidth = 1;
    ctx.stroke();
    const iconSize = compactHud ? 25 : 36;
    const textOffset = iconSize * 0.78;
    ctx.drawImage(heartImg, hudX + hudPad, hudY + hudPad, iconSize, iconSize);
    ctx.fillStyle = "rgba(255,255,255,0.9)";
    ctx.font = `bold ${compactHud ? 15 : 20}px Geom, monospace`;
    ctx.fillText(window.lives, hudX + hudPad + iconSize + 10, hudY + hudPad + textOffset);
    const row2Y = hudY + hudPad + (compactHud ? 38 : 50);
    ctx.drawImage(skullCoinImg, hudX + hudPad, row2Y, iconSize + (compactHud ? 5 : 8), iconSize + (compactHud ? 5 : 8));
    ctx.font = `bold ${compactHud ? 15 : 20}px Geom, monospace`;
    ctx.fillText(playerData.deadCoins, hudX + hudPad + iconSize + (compactHud ? 13 : 18), row2Y + textOffset);
    const rubyX = hudX + hudPad + (compactHud ? 92 : 128);
    ctx.drawImage(rubyImg, rubyX, row2Y + (compactHud ? 1 : 2), iconSize, iconSize);
    ctx.fillText(playerData.gems, rubyX + iconSize + (compactHud ? 7 : 10), row2Y + textOffset);
    ctx.fillStyle = "rgba(255,255,255,0.5)";
    ctx.font = `${compactHud ? 10 : 13}px Geom, monospace`;
    ctx.fillText("NIVEL " + window.level, hudX + hudPad, hudY + hudH - 10);
    ctx.restore();
}

function drawPlayer(cx, cy) {
    let r = BASE_RADIUS + window.offset;
    let px = cx + Math.cos(window.angle) * r;
    let py = cy + Math.sin(window.angle) * r;
    const lowPower = window.GAME_PERF?.lowPower?.();
    const now = window.GAME_PERF?.now || performance.now();
    ctx.save();
    ctx.translate(px, py);
    if (window.invulnerable && Math.floor(now / 100) % 2 === 0) ctx.globalAlpha = 0.2;
    const equippedId = localStorage.getItem('equippedSkin') || 'cyan';
    const SKIN_COLORS = {
        cyan: { color: '#00ffe7', glow: '#00ffe7' },
        red: { color: '#ff4444', glow: '#ff4444' },
        blue: { color: '#4488ff', glow: '#4488ff' },
        yellow: { color: '#ffee00', glow: '#ffee00' },
        orange: { color: '#ff8800', glow: '#ff8800' },
        green: { color: '#44ff88', glow: '#44ff88' },
        purple: { color: '#cc44ff', glow: '#cc44ff' },
        cool: { color: '#ffffff', glow: '#ffff00' },
    };
    const skin = SKIN_COLORS[equippedId] || SKIN_COLORS.cyan;
    const directionalSkin = directionalSkinImages[equippedId]?.[window.playerFacing || "right"];
    if (directionalSkin && directionalSkin.complete && directionalSkin.naturalWidth > 0) {
        const skinSize = 48;
        if (!lowPower) {
            ctx.shadowBlur = 18;
            ctx.shadowColor = DIRECTIONAL_SKINS[equippedId].glow;
        }
        ctx.drawImage(directionalSkin, -skinSize / 2, -skinSize / 2, skinSize, skinSize);
    } else {
        if (!lowPower) {
            ctx.shadowBlur = 20;
            ctx.shadowColor = skin.glow;
        }
        ctx.beginPath();
        ctx.arc(0, 0, 16, 0, Math.PI * 2);
        ctx.fillStyle = skin.color;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(0, 0, 6, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
    }
    ctx.shadowBlur = 0;
    ctx.restore();
}

function drawSpikesLayer(cx, cy) {
    if (!window.running || !window.obstacles?.length) return;

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, DOME_RADIUS, 0, Math.PI * 2);
    ctx.clip();

    for (let o of window.obstacles) {
        let a = o.angle + worldRotation;
        if (o.warning) {
            let wr = typeof getObstacleBaseRadius === "function"
                ? getObstacleBaseRadius(o.fromGround)
                : (o.fromGround ? BASE_RADIUS : DOME_RADIUS);
            let pulse = 0.5 + Math.sin((window.GAME_PERF?.now || performance.now()) * 0.015) * 0.35;
            let half = o.width / 2;
            ctx.beginPath();
            ctx.arc(cx, cy, wr - 6, a - half, a + half);
            ctx.strokeStyle = `rgba(255,60,90,${pulse})`;
            ctx.lineWidth = 6;
            ctx.lineCap = "round";
            if (!window.GAME_PERF?.lowPower()) {
                ctx.shadowColor = "rgba(255,0,80,0.9)";
                ctx.shadowBlur = 16;
            }
            ctx.stroke();
            ctx.shadowBlur = 0;
            ctx.lineCap = "butt";
            continue;
        }

        let baseR = typeof getObstacleBaseRadius === "function"
            ? getObstacleBaseRadius(o.fromGround)
            : (o.fromGround ? BASE_RADIUS : DOME_RADIUS);
        let dir = o.fromGround ? 1 : -1;
        let currentR = baseR + dir * o.height * o.progress;
        let half = o.width / 2;
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(a - half) * baseR, cy + Math.sin(a - half) * baseR);
        ctx.lineTo(cx + Math.cos(a + half) * baseR, cy + Math.sin(a + half) * baseR);
        ctx.lineTo(cx + Math.cos(a) * currentR, cy + Math.sin(a) * currentR);
        ctx.closePath();
        ctx.fillStyle = o.color;
        ctx.fill();
        ctx.strokeStyle = "rgba(255,255,255,0.92)";
        ctx.lineWidth = 2.8;
        ctx.stroke();
    }

    ctx.restore();
}

function drawIceLasers(cx, cy) {
    for (const laser of window.lasers) {
        const warningProgress = 1 - Math.max(0, laser.warningTime) / (laser.maxWarningTime || 95);
        const activeAlpha = laser.state === 'active' ? 1 : laser.state === 'fade' ? Math.max(0, laser.fadeTime / (laser.maxFadeTime || 34)) : 0;
        const p = getLaserPoints(laser, cx, cy);
        ctx.save();
        ctx.beginPath();
        ctx.arc(cx, cy, DOME_RADIUS, 0, Math.PI * 2);
        ctx.arc(cx, cy, BASE_RADIUS, 0, Math.PI * 2, true);
        ctx.clip("evenodd");
        ctx.globalCompositeOperation = 'lighter';
        ctx.shadowColor = '#9fe8ff';

        drawLaserEmitter(p.sx, p.sy, p.emitterAngle, warningProgress, laser);

        if (laser.state === 'warning') {
            if (laser.type === "giantArc") {
                const mid = (laserRadius(laser.inner) + laserRadius(laser.outer)) / 2;
                ctx.strokeStyle = `rgba(160,230,255,${0.16 + warningProgress * 0.42})`;
                ctx.lineWidth = Math.max(5, (laserRadius(laser.outer) - laserRadius(laser.inner)) * 0.5);
                ctx.setLineDash([14, 16]);
                ctx.beginPath();
                ctx.arc(cx, cy, mid, laser.startAngle + window.worldRotation, laser.endAngle + window.worldRotation);
                ctx.stroke();
            } else {
                ctx.strokeStyle = `rgba(160,230,255,${0.18 + warningProgress * 0.36})`;
                ctx.lineWidth = Math.max(2, laser.thickness * 0.35);
                ctx.setLineDash([]);
                const innerR = laserRadius(laser.inner);
                const outerR = laserRadius(laser.outer);
                const halfW = laser.angularSpan / 2;
                ctx.beginPath();
                ctx.arc(cx, cy, outerR, laser.angle + window.worldRotation - halfW, laser.angle + window.worldRotation + halfW);
                ctx.arc(cx, cy, innerR, laser.angle + window.worldRotation + halfW, laser.angle + window.worldRotation - halfW, true);
                ctx.closePath();
                ctx.fillStyle = `rgba(255,60,90,${0.12 + warningProgress * 0.28})`;
                ctx.fill();
                ctx.strokeStyle = `rgba(255,60,90,${0.5 + warningProgress * 0.4})`;
                ctx.lineWidth = 2;
                ctx.stroke();
            }
        } else {
            ctx.setLineDash([]);
            if (laser.type === "giantArc") {
                const mid = (laserRadius(laser.inner) + laserRadius(laser.outer)) / 2;
                ctx.strokeStyle = `rgba(80,200,255,${0.45 * activeAlpha})`;
                ctx.lineWidth = Math.max(20, laser.glowThickness);
                ctx.beginPath();
                ctx.arc(cx, cy, mid, laser.startAngle + window.worldRotation, laser.endAngle + window.worldRotation);
                ctx.stroke();
                ctx.strokeStyle = `rgba(230,252,255,${0.92 * activeAlpha})`;
                ctx.lineWidth = Math.max(10, laser.thickness);
                ctx.beginPath();
                ctx.arc(cx, cy, mid, laser.startAngle + window.worldRotation, laser.endAngle + window.worldRotation);
                ctx.stroke();
            } else {
                ctx.strokeStyle = `rgba(80,200,255,${0.55 * activeAlpha})`;
                ctx.lineWidth = laser.glowThickness;
                ctx.beginPath();
                ctx.moveTo(p.sx, p.sy);
                ctx.lineTo(p.ex, p.ey);
                ctx.stroke();
                ctx.strokeStyle = `rgba(220,250,255,${0.92 * activeAlpha})`;
                ctx.lineWidth = laser.thickness;
                ctx.beginPath();
                ctx.moveTo(p.sx, p.sy);
                ctx.lineTo(p.ex, p.ey);
                ctx.stroke();
            }
        }
        ctx.restore();
    }
}

function drawLaserEmitter(x, y, angle, progress, laser) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle + Math.PI / 2);
    const scale = 0.85 + progress * 0.25;
    ctx.scale(scale, scale);
    if (!window.GAME_PERF?.lowPower()) {
        ctx.shadowBlur = 16;
        ctx.shadowColor = '#9fe8ff';
    }
    ctx.fillStyle = 'rgba(18,28,36,0.95)';
    ctx.strokeStyle = 'rgba(170,230,255,0.72)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(-13, -18, 26, 34, 6);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = laser.state === 'warning'
        ? `rgba(255,77,109,${0.35 + progress * 0.55})`
        : 'rgba(120,235,255,0.95)';
    ctx.beginPath();
    ctx.roundRect(-7, -23, 14, 10, 4);
    ctx.fill();
    ctx.fillStyle = 'rgba(210,250,255,0.88)';
    ctx.beginPath();
    ctx.arc(0, -18, 4 + progress * 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
}

// =====================================================
// LOOP
// =====================================================

function loop(timestamp = 0) {
    window.GAME_PERF.now = timestamp;
    window.GAME_PERF.frame++;
    if (!document.hidden && (window.running || window.paused)) {
        if (window.running && !window.paused) update();
        draw();
    }
    requestAnimationFrame(loop);
}

buildStaticCanvas();
buildBackgroundCanvas();
loop();

// =====================================================
// START GAME
// =====================================================
window.startGame = function (levelIndex = 0, skipStartSound = false) {
    window.level = levelIndex + 1;
    const levelConfig = window.getCurrentLevelConfig ? window.getCurrentLevelConfig() : {};

    clearInterval(window.reviveTimer);
    window.pendingWinChest = null;
    const gameOverPanel = document.getElementById('gameOver');
    const winPanel = document.getElementById('gameWin');
    const winChestBox = document.getElementById('win-chest-box');
    if (gameOverPanel) gameOverPanel.style.display = 'none';
    if (winPanel) {
        winPanel.style.display = 'none';
        winPanel.classList.remove('showing');
    }
    if (winChestBox) winChestBox.innerHTML = '';

    document.getElementById("gameCanvas").style.visibility = "visible";
    document.getElementById('pause-btn').classList.add('is-playing');
    document.body.classList.toggle('is-playing-touch', isTouchLayout());

    if (!skipStartSound) window.playSfx?.('startGame', 0.9);
    window.menuMusic.pause();
    window.menuMusic.currentTime = 0;
    const musicSrc = levelConfig.assets && levelConfig.assets.music ? levelConfig.assets.music : 'assets/Musica/Gravity Well.mp3';
    if (!window.currentLevelMusicSrc || !window.currentLevelMusicSrc.endsWith(musicSrc)) {
        window.bgMusic.pause();
        window.bgMusic = new Audio(musicSrc);
        window.bgMusic.loop = true;
        window.bgMusic.volume = window.isMuted ? 0 : window.musicVolume;
        window.currentLevelMusicSrc = window.bgMusic.src;
    }
    window.bgMusic.currentTime = 0;
    window.bgMusic.play();

    const spawn = levelConfig.playerSpawn || {};
    window.angle = typeof spawn.angle === "number" ? spawn.angle : Math.PI / 2;
    window.angVel = 0;
    window.offset = typeof spawn.offset === "number" ? spawn.offset : 0;
    window.vel = 0;
    window.gravity = 1;
    window.lives = 3;
    window.reviveCount = 0;

    window.invulnerable = false;
    window.invulnerableTimer = 0;


    window.worldRotationSpeed = levelConfig.rotationSpeed || 0.016;
    window.targetWorldSpeed = levelConfig.rotationSpeed || 0.016;
    window.worldChangeTimer = 180;

    window.obstacles = [];
    window.deadCoins = [];
    window.rubies = [];
    window.sierras = [];
    window.lasers = [];
    window.sierraSpawnTimer = 0;
    window.laserSpawnTimer = 0;
    window.spawnTimer = 0;
    window.deadCoinSpawnTimer = 0;
    window.rubySpawnTimer = 0;
    window.paused = false;
    document.getElementById('pausePanel').classList.remove('showing');

    // ── Intro desactivada para que no congele ──────────
    showAbilityIntro();

    window.currentLevel = levelIndex;   // nivel 0 → level=1, nivel 1 → level=2, etc.

    resize(true);
    if (typeof resetTrail === "function") resetTrail();

    window.running = true;
    window.gameTimer = 0;

    clearInterval(gameTimerInterval);
    gameTimerInterval = null;

    window.gravity = 1;
    window.worldRotationSpeed = levelConfig.rotationSpeed || 0.01;
    window.targetWorldSpeed = levelConfig.rotationSpeed || 0.01;
};

window.startLevelWithTransition = function (levelIndex = 0) {
    let veil = document.getElementById('level-start-transition');
    if (!veil) {
        veil = document.createElement('div');
        veil.id = 'level-start-transition';
        document.body.appendChild(veil);
    }
    window.playSfx?.('startGame', 0.9);
    veil.className = 'showing';
    setTimeout(() => {
        window.startGame(levelIndex, true);
        veil.className = 'leaving';
        setTimeout(() => veil.className = '', 420);
    }, 420);
};

function showAbilityIntro() {
    window.showingIntro = true;
    window.introTimer = 120;
    const equippedId = localStorage.getItem('equippedSkin') || 'cyan';
    const skinData = Array.isArray(window.SKINS_DATA)
        ? window.SKINS_DATA.find(s => s.id === equippedId)
        : null;
    window.activeAbilityIntro = {
        skin: skinData?.name || equippedId.toUpperCase(),
        ability: skinData?.ability || 'Habilidad activa'
    };
    window.playSfx?.('powerUp', 0.75);
}

window.showGameOverWithRevive = function () {
    window.running = false;
    document.body.classList.remove('is-playing-touch');
    clearInterval(gameTimerInterval);
    clearInterval(window.reviveTimer);
    document.getElementById("gameCanvas").style.visibility = "hidden";
    document.getElementById('pause-btn').classList.remove('is-playing');
    document.getElementById('pausePanel').classList.remove('showing');
    window.bgMusic.pause();
    window.bgMusic.currentTime = 0;
    window.playSfx?.('gameOver', 0.9);

    const go = document.getElementById('gameOver');
    document.getElementById('go-title').textContent = 'NIVEL ' + window.level;
    document.getElementById('go-sub').textContent = 'INTENTALO DE NUEVO';
    renderReviveOffer();
    go.style.display = 'flex';
    void go.offsetHeight;
    go.style.animation = 'fadeInGO 0.8s ease forwards';
};

function renderReviveOffer() {
    const card = document.querySelector('#gameOver .go-card');
    if (!card) return;
    let offer = document.getElementById('revive-offer');
    if (!offer) {
        offer = document.createElement('div');
        offer.id = 'revive-offer';
        card.insertBefore(offer, card.querySelector('.go-actions'));
    }
    clearInterval(window.reviveTimer);
    if (window.reviveCount >= 3) {
        offer.innerHTML = '';
        return;
    }
    let timeLeft = 5;
    const coinCost = [80, 160, 320][window.reviveCount];
    const gemCost = [3, 6, 10][window.reviveCount];
    const draw = () => {
        offer.innerHTML = `
            <div class="revive-box">
                <div>REVIVIR (${timeLeft}s)</div>
                <button onclick="revivePlayer('coins')">${coinCost} MONEDAS</button>
                <button onclick="revivePlayer('gems')">${gemCost} RUBIES</button>
            </div>
        `;
    };
    draw();
    window.reviveTimer = setInterval(() => {
        timeLeft--;
        if (timeLeft <= 0) {
            clearInterval(window.reviveTimer);
            offer.innerHTML = '';
        } else draw();
    }, 1000);
}

window.revivePlayer = function (currency) {
    const coinCost = [80, 160, 320][window.reviveCount] || 320;
    const gemCost = [3, 6, 10][window.reviveCount] || 10;
    const key = currency === 'gems' ? 'gems' : 'deadCoins';
    const cost = currency === 'gems' ? gemCost : coinCost;
    const current = parseInt(localStorage.getItem(key) || '0');
    if (current < cost) return alert('No tienes suficientes recursos.');
    localStorage.setItem(key, String(current - cost));
    if (currency === 'coins') playerData.deadCoins = current - cost;
    else playerData.gems = current - cost;
    window.reviveCount++;
    window.playSfx?.('spend');
    clearInterval(window.reviveTimer);
    document.getElementById('gameOver').style.display = 'none';
    document.getElementById("gameCanvas").style.visibility = "visible";
    document.getElementById('pause-btn').classList.add('is-playing');
    document.body.classList.toggle('is-playing-touch', isTouchLayout());
    window.lives = 1;
    window.invulnerable = true;
    window.invulnerableTimer = 150;
    window.running = true;
    if (window.bgMusic && !window.isMuted) window.bgMusic.play();
};

function drawAbilityIntro() {
    if (!window.showingIntro || !window.activeAbilityIntro) return;
    const alpha = Math.min(1, window.introTimer / 28);
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = 'rgba(0,0,0,0.48)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.font = '900 30px Geom, monospace';
    ctx.fillText(window.activeAbilityIntro.skin, 0, -18);
    ctx.fillStyle = 'rgba(0,255,231,0.9)';
    ctx.font = '14px monospace';
    ctx.fillText('HABILIDAD', 0, 18);
    ctx.fillStyle = 'rgba(255,255,255,0.72)';
    ctx.font = '15px monospace';
    ctx.fillText(window.activeAbilityIntro.ability, 0, 48);
    ctx.restore();
}

// =====================================================
// WIN
// =====================================================

function winGame() {
    if (window.paused) return;
    window.running = false;
    document.body.classList.remove('is-playing-touch');
    clearInterval(gameTimerInterval);
    window.bgMusic.pause();
    window.bgMusic.currentTime = 0;

    const winPanel = document.getElementById('gameWin');
    document.getElementById('pause-btn').classList.remove('is-playing');
    winPanel.style.display = 'flex';
    winPanel.classList.remove('showing');
    void winPanel.offsetWidth;
    winPanel.classList.add('showing');

    document.getElementById('gw-sub').textContent = 'NIVEL ' + window.level + ' COMPLETADO';

    let wins = parseInt(localStorage.getItem('gamesWon') || '0');
    wins++;
    localStorage.setItem('gamesWon', wins);
    updateRank(wins);

    let rubyPassResult = null;
    if (typeof window.addRubyPassXp === 'function') {
        rubyPassResult = window.addRubyPassXp();
    }

    const nextLevelIndex = window.level;
    if (typeof levels !== 'undefined' && levels[nextLevelIndex]) {
        levels[nextLevelIndex].unlocked = true;
        localStorage.setItem(`level${nextLevelIndex}Unlocked`, 'true');
    }

    const gwUnlock = document.getElementById('gw-unlock');
    if (typeof levels !== 'undefined' && levels[nextLevelIndex] && gwUnlock) {
        gwUnlock.style.display = 'block';
        gwUnlock.textContent = '🔓 ¡HAS DESBLOQUEADO EL NIVEL ' + (nextLevelIndex + 1) + '!';
        if (rubyPassResult) {
            gwUnlock.textContent += ' · RUBY PASS +' + rubyPassResult.gained + ' XP';
        }
    } else if (gwUnlock) {
        if (rubyPassResult) {
            gwUnlock.style.display = 'block';
            gwUnlock.textContent = 'RUBY PASS +' + rubyPassResult.gained + ' XP · NIVEL ' + rubyPassResult.level;
        } else {
            gwUnlock.style.display = 'none';
        }
    }

    maybeAwardLevelChest();

    window.menuMusic.currentTime = 0;
    if (window.menuMusic.paused)
        window.menuMusic.play();
}

function updateRank(wins) {
    let rank;
    if (wins < 5) rank = { name: 'HIERRO', color: '#aaaaaa' };
    else if (wins < 6) rank = { name: 'BRONCE', color: '#cd7f32' };
    else if (wins <= 10) rank = { name: 'PLATA', color: '#c0c0c0' };
    else if (wins <= 20) rank = { name: 'ORO', color: '#ffd700' };
    else if (wins <= 40) rank = { name: 'DIAMANTE', color: '#00ffe7' };
    else if (wins <= 70) rank = { name: 'MAESTRO', color: '#cc44ff' };
    else if (wins <= 90) rank = { name: 'GRAN MAESTRO', color: '#ff4444' };
    else if (wins <= 150) rank = { name: 'ÉLITE', color: '#ff8800' };
    else rank = { name: 'CAMPEÓN LEGENDARIO', color: '#ffee00' };
    localStorage.setItem('rankName', rank.name);
    localStorage.setItem('rankColor', rank.color);
};

function maybeAwardLevelChest() {
    const roll = Math.random();
    const table = [
        ['vip', 0.01],
        ['demon', 0.03],
        ['epic', 0.07],
        ['special', 0.16],
        ['basic', 0.28]
    ];
    let acc = 0;
    let chestId = null;
    for (const [id, chance] of table) {
        acc += chance;
        if (roll < acc) { chestId = id; break; }
    }
    if (!chestId) chestId = 'basic';
    const chest = window.CHESTS_DATA?.find(c => c.id === chestId);
    if (!chest) return;
    window.pendingWinChest = chest;
    const panel = document.getElementById('gameWin');
    let box = document.getElementById('win-chest-box');
    if (!box) {
        box = document.createElement('div');
        box.id = 'win-chest-box';
        panel.insertBefore(box, document.getElementById('gw-menu'));
    }
    box.innerHTML = `
        <div class="win-chest-card">
            <img src="${chest.image}" alt="">
            <div>GANASTE ${chest.name.toUpperCase()}</div>
            <button onclick="openWonChest()">ABRIR</button>
            <button onclick="storeWonChest()">CERRAR</button>
        </div>
    `;
    window.playSfx?.('reward', 0.9);
}

window.openWonChest = function () {
    if (!window.pendingWinChest || typeof window.showChestResult !== 'function') return;
    window.showChestResult(window.pendingWinChest);
    window.pendingWinChest = null;
    const box = document.getElementById('win-chest-box');
    if (box) box.innerHTML = '';
};

window.storeWonChest = function () {
    if (!window.pendingWinChest) return;
    if (typeof window.storeChestInInventory === 'function') {
        window.storeChestInInventory(window.pendingWinChest.id, 1);
    } else {
        const key = 'invChest_' + window.pendingWinChest.id;
        localStorage.setItem(key, String(parseInt(localStorage.getItem(key) || '0') + 1));
    }
    window.pendingWinChest = null;
    const box = document.getElementById('win-chest-box');
    if (box) box.innerHTML = '';
};


// =====================================================
// INPUT
// =====================================================
window.worldRotation = 0;
addEventListener("keydown", e => {
    if (e.key === "Escape" || e.key === "p" || e.key === "P") {
        if (window.paused) window.resumeGame();
        else window.pauseGame();
        return;
    }
    if (window.paused) return;
    if (e.key === "a" || e.key === "A" || e.key === "ArrowLeft") window.keys.left = true;
    if (e.key === "d" || e.key === "D" || e.key === "ArrowRight") window.keys.right = true;
    if ((e.key === "s" || e.key === "S" || e.key === " " || e.key === "ArrowUp") && window.gravityFlipCooldown <= 0) {
        e.preventDefault();
        window.keys.gravity = true;
    }
});

addEventListener("keyup", e => {
    if (e.key === "a" || e.key === "A" || e.key === "ArrowLeft") window.keys.left = false;
    if (e.key === "d" || e.key === "D" || e.key === "ArrowRight") window.keys.right = false;
});

document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        window.bgMusic?.pause();
        window.menuMusic?.pause();
    } else {
        if (window.running && !window.paused && !window.isMuted) {
            window.bgMusic?.play();
        }
        if (!window.running && !window.isMuted) {
            window.menuMusic?.play().catch(() => { });
        }
    }
});
