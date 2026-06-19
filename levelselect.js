// =====================================================
// LEVEL SELECT
// =====================================================

const BANNER_TRAIL_COLORS = {
    cyan: '0,255,231',
    red: '255,68,68',
    blue: '68,136,255',
    yellow: '255,238,0',
    orange: '255,136,0',
    green: '68,255,136',
    purple: '204,68,255',
};

const LEVEL_SELECT_SKIN_IMAGES = {
    daxor: {
        side: "assets/UI/Store/Skins/Normal/DAXOR Skin DEMON/DAXOR_Skin_lado.png"
    },
    brifon: {
        side: "assets/UI/Store/Skins/Normal/BRIFON Skin EPICO/BRIFON_Skin_lado_derecho.png",
        sideLeft: "assets/UI/Store/Skins/Normal/BRIFON Skin EPICO/BRIFON_Skin_lado_izquierdo.png"
    },
    kenji: {
        side: "assets/UI/Store/Skins/Normal/KENJI Skin EPICO/Kenji_Skin_lado.png"
    }
};

const levelSelectSkinImages = {};
Object.entries(LEVEL_SELECT_SKIN_IMAGES).forEach(([id, paths]) => {
    levelSelectSkinImages[id] = new Image();
    levelSelectSkinImages[id].src = paths.side;
});

// En levelselect.js
function getLevelSelectSkinImage(id) {
    const skinPaths = LEVEL_SELECT_SKIN_IMAGES[id];
    if (!skinPaths) return { image: null, rolling: false };

    // Si Brifon tiene sideLeft, usamos la dirección actual del jugador
    let src = skinPaths.side;
    if (id === 'brifon' && window.playerFacing === 'left' && skinPaths.sideLeft) {
        src = skinPaths.sideLeft;
    }

    const key = `${id}_${window.playerFacing}`;
    if (!levelSelectSkinImages[key]) {
        levelSelectSkinImages[key] = new Image();
        levelSelectSkinImages[key].src = src;
    }
    return { image: levelSelectSkinImages[key], rolling: true };
}

// Nombres de archivo del fondo grande (carpeta "Fondo portada niveles"), uno por nivel en orden.
// Si agregas un nivel nuevo, agrega su nombre de archivo aquí en la misma posición.
const LEVEL_BACKGROUND_LARGE_FILES = [
    "Nivel_THE_GEGGIN",
    "Nivel_VOLCANO",
    "Nivel_FROZEN_WORLD",
    "Nivel_THE_BEGGIN_2",
    "Nivel_SUPERVIVENCIA",
];

const levels = (window.LEVEL_CONFIGS || []).map((lv, i) => ({
    name: lv.name,
    unlocked: i === 0 ? true : !!lv.unlocked,
    difficulty: lv.difficulty,
    // Icono pequeño de la barra lateral (el de siempre, sin cambios)
    image: lv.assets && lv.assets.cover
        ? lv.assets.cover
        : window.LEVEL_ASSET_PLACEHOLDERS?.cover || "assets/Imagenes/Placeholders/Placeholder_Level_Cover.png",
    // Fondo grande de la vista previa derecha (distinto al icono de la barra lateral)
    backgroundLarge: LEVEL_BACKGROUND_LARGE_FILES[i]
        ? `assets/Imagenes/Fondo portada niveles/${LEVEL_BACKGROUND_LARGE_FILES[i]}.png`
        : (lv.assets && lv.assets.cover ? lv.assets.cover : window.LEVEL_ASSET_PLACEHOLDERS?.cover),
    completed: !!lv.completed,
    percent: lv.percent || 0
}));
window.levels = levels;

levels.forEach((lv, i) => {
    if (i > 0 && localStorage.getItem(`level${i}Unlocked`) === 'true') {
        lv.unlocked = true;
    }
});

// Precarga de imágenes
const levelImages = levels.map(lv => {
    const img = new Image();
    img.src = lv.image;
    img.onerror = () => {
        img.src = window.LEVEL_ASSET_PLACEHOLDERS?.cover || "assets/Imagenes/Placeholders/Placeholder_Level_Cover.png";
    };
    return img;
});

// Precarga del fondo del level select para transición sin parpadeo
const levelSelectBg = new Image();
levelSelectBg.src = "assets/Imagenes/Select Nivel Fondo/Select_Nivel_Image.png";

let selectedLevel = 0;
window.selectedLevel = selectedLevel;
let carouselX = 0;
let carouselTarget = 0;
let selectVisible = false;

// Variable global para el trail del banner (usada también en shop.js)
var bannerTrail = [];
var bannerTime = 0;

let carouselAnimId = null; // Control para memory leak
let carouselLastFrame = 0;

function updateLevelSelectNav() {
    window.selectedLevel = selectedLevel;
    renderCinematicPreview(selectedLevel);
    renderCinematicList();
}

function renderCinematicList() {
    const list = document.getElementById('lsc-list');
    if (!list) return;
    list.innerHTML = '';
    levels.forEach((lv, i) => {
        const item = document.createElement('div');
        item.className = 'lsc-item' + (i === selectedLevel ? ' active' : '') + (!lv.unlocked ? ' locked' : '');
        const thumb = document.createElement('div');
        thumb.className = 'lsc-item-thumb';
        if (lv.image) thumb.style.backgroundImage = `url("${lv.image}")`;
        const info = document.createElement('div');
        info.style.minWidth = '0';
        const name = document.createElement('div');
        name.className = 'lsc-item-name';
        name.textContent = lv.name;
        const sub = document.createElement('div');
        sub.className = 'lsc-item-sub';
        sub.textContent = lv.unlocked ? `${lv.completed ? '100' : lv.percent}%` : '🔒 BLOQUEADO';
        info.appendChild(name);
        info.appendChild(sub);
        item.appendChild(thumb);
        item.appendChild(info);
        item.addEventListener('click', () => {
            if (!lv.unlocked) return;
            selectedLevel = i;
            window.selectedLevel = i;
            carouselTarget = 0;
            window.playSfx?.("levelHover", 0.45);
            updateLevelSelectNav();
        });
        list.appendChild(item);
    });
}

function renderCinematicPreview(idx) {
    const lv = levels[idx];
    if (!lv) return;

    const bgEl = document.getElementById('lsc-preview-bg');
    if (bgEl) bgEl.style.backgroundImage = lv.backgroundLarge ? `url("${lv.backgroundLarge}")` : (lv.image ? `url("${lv.image}")` : '');

    const kicker = document.getElementById('lsc-kicker');
    if (kicker) kicker.textContent = `NIVEL ${String(idx + 1).padStart(2, '0')} · THE GEM`;

    const titleBig = document.getElementById('lsc-title-big');
    if (titleBig) titleBig.textContent = lv.name.toUpperCase();

    const diffRow = document.getElementById('lsc-diff-row');
    if (diffRow) {
        const d = lv.difficulty || 2;
        diffRow.innerHTML = `<span class="lsc-diff-label">DIFICULTAD</span>` +
            Array.from({ length: 5 }, (_, i) => `<div class="lsc-diff-dot${i < d ? '' : ' off'}"></div>`).join('');
    }

    const starsEl = document.getElementById('lsc-stars');
    if (starsEl) {
        const pct = lv.completed ? 100 : (lv.percent || 0);
        const full = pct >= 100 ? 3 : pct >= 50 ? 2 : pct > 0 ? 1 : 0;
        starsEl.textContent = Array.from({ length: 3 }, (_, i) => i < full ? '⭐' : '☆').join('');
    }

    const pctEl = document.getElementById('lsc-percent');
    if (pctEl) pctEl.textContent = lv.completed ? '100%' : `${lv.percent || 0}%`;

    const recordEl = document.getElementById('lsc-record');
    if (recordEl) recordEl.textContent = localStorage.getItem(`level${idx}_record`) || '—';

    const attemptsEl = document.getElementById('lsc-attempts');
    if (attemptsEl) attemptsEl.textContent = localStorage.getItem(`level${idx}_attempts`) || '0';

    const comboEl = document.getElementById('lsc-combo');
    if (comboEl) comboEl.textContent = localStorage.getItem(`level${idx}_deaths`) || '0';

    const badgeWrap = document.getElementById('lsc-badge-wrap');
    if (badgeWrap) {
        badgeWrap.innerHTML = lv.unlocked
            ? `<span class="lsc-badge ok">✓ DESBLOQUEADO</span>`
            : `<span class="lsc-badge locked">🔒 BLOQUEADO</span>`;
    }
}

function moveLevelSelection(direction) {
    if (!selectVisible) return;

    const nextLevel = Math.max(
        0,
        Math.min(levels.length - 1, selectedLevel + direction)
    );

    if (nextLevel === selectedLevel) {
        updateLevelSelectNav();
        return;
    }

    selectedLevel = nextLevel;
    carouselTarget = 0;
    updateLevelSelectNav();
    window.playSfx?.("levelHover", 0.45);
}

window.moveLevelSelection = moveLevelSelection;

window.playSelectedLevel = function () {
    if (!levels[selectedLevel]?.unlocked) return;
    window.hideLevelSelect();
    const launch = window.startLevelWithTransition || window.startGame;
    if (typeof launch === 'function') {
        launch(selectedLevel);
    } else {
        console.error('[THE GEM] startGame no disponible, reintentando...');
        setTimeout(() => {
            const retry = window.startLevelWithTransition || window.startGame;
            if (typeof retry === 'function') retry(selectedLevel);
        }, 200);
    }
};

const systemMessages = [

    "TIP: respirar ayuda.",
    "En la esfera hay muchas almas atrapadas.",
    "A veces el problema sí era skill issue.",
    "Broken Signal detectado.",
    "TIP: no mueras.",
    "Inicializando núcleo...",
    "La gravedad parece estable.",
    "ERROR_#442 • trayectoria inválida.",
    "TIP: las monedas no sirven si estás muerto.",
    "El Demonio no muestra piedad.",
    "¿Y si esta vez sí ganas?",
    "El sistema observa tus intentos.",
    "TIP: culpar al lag aumenta la moral.",
    "Reactor sincronizado.",
    "The Gem es la fuerza del Demonio.",
    "Sabias que existen mas gemas aparte de la roja?.",
    "Tengo 1 semana de haber credado el juego."

];

let currentSystemMessage = 0;

function getDifficultyColor(d) {
    if (d <= 2) return "#ffffff";
    if (d <= 4) return "#ff8c00";
    if (d <= 6) return "#8b0000";
    return "#6a0000";
}

window.showLevelSelect = function () {

    selectVisible = true;
    selectedLevel = window.currentLevel || 0;
    window.selectedLevel = selectedLevel;
    carouselTarget = 0;
    carouselX = 0;
    bannerTrail = [];
    bannerTime = 0;

    const ls =
        document.getElementById("levelSelect");

    document.getElementById("overlay")
        .style.display = "none";

    const nameEl =
        document.getElementById("playerName");

    const avatarEl =
        document.getElementById("playerAvatar");

    if (nameEl)
        if (nameEl && window.player) {

            nameEl.textContent =
                window.player.name || "Jugador";

        }

    const coinsEl =
        document.getElementById("playerCoins");

    const gemsEl =
        document.getElementById("playerGems");

    const coins = parseInt(
        localStorage.getItem("deadCoins") || "0"
    );

    const gems = parseInt(
        localStorage.getItem("gems") || "0"
    );

    if (coinsEl) coinsEl.textContent = coins;
    if (gemsEl) gemsEl.textContent = gems;

    if (avatarEl) {

        if (avatarEl && window.player) {

            avatarEl.style.backgroundImage =
                `url(${window.player.avatar})`;

            avatarEl.style.backgroundSize =
                "cover";

            avatarEl.style.backgroundPosition =
                "center";
        }

        avatarEl.style.backgroundSize =
            "cover";

        avatarEl.style.backgroundPosition =
            "center";

    }

    ls.style.opacity = "1";
    ls.style.transition = "none";
    ls.style.display = "flex";
    updateLevelSelectNav();

    if (carouselAnimId)
        cancelAnimationFrame(carouselAnimId);

    drawCarousel();

    clearInterval(window.systemMsgLoop);
    clearTimeout(window.systemMsgTimeout);

    startSystemMessages();

    window.systemMsgLoop =
        setInterval(() => {

            startSystemMessages();

        }, 4000);

};

const menuMusic =
    document.getElementById("menuMusic");

if (menuMusic) {

    menuMusic.volume = 0.45;

    menuMusic.play().catch(() => { });

}

window.hideLevelSelect = function () {
    selectVisible = false;
    document.getElementById("levelSelect").style.display = "none";
    if (carouselAnimId) cancelAnimationFrame(carouselAnimId);
    clearInterval(window.systemMsgLoop); // Prevenir ejecución fantasma en fondo
    clearTimeout(window.systemMsgTimeout);
}

function startSystemMessages() {

    const text = document.getElementById("systemMessage");

    if (!text) return;

    text.style.opacity = 0;

    clearTimeout(window.systemMsgTimeout);
    window.systemMsgTimeout = setTimeout(() => {
        if (!selectVisible) return;

        currentSystemMessage++;

        if (currentSystemMessage >= systemMessages.length) {
            currentSystemMessage = 0;
        }

        text.innerHTML =
            `<span>${systemMessages[currentSystemMessage]}</span>`;

        text.style.opacity = 1;

    }, 250);

}

function drawCarousel(timestamp = 0) {
    const now = timestamp || performance.now();
    if (selectVisible && carouselLastFrame && now - carouselLastFrame < 33) {
        carouselAnimId = requestAnimationFrame(drawCarousel);
        return;
    }
    carouselLastFrame = now;

    const container = document.getElementById("carouselCanvas");
    const ctx2 = container.getContext("2d");

    const W = container.width;
    const H = container.height;

    ctx2.clearRect(0, 0, W, H);

    // =========================
    // FONDO ESPACIAL ANIMADO
    // =========================

    const bg = ctx2.createLinearGradient(0, 0, 0, H);

    bg.addColorStop(0, "#050510");
    bg.addColorStop(1, "#000000");

    ctx2.fillStyle = bg;
    ctx2.fillRect(0, 0, W, H);

    // estrellas
    const starCount = document.body.classList.contains('is-touch-device') ? 56 : 90;
    for (let i = 0; i < starCount; i++) {

        const x =
            (i * 97 + now * 0.002) % W;

        const y =
            (i * 53) % H;

        const size =
            Math.sin(i + now * 0.001) * 1.5 + 2;

        ctx2.beginPath();

        ctx2.arc(x, y, size, 0, Math.PI * 2);

        ctx2.fillStyle = `rgba(0,255,231,${0.2 + 0.35 * 0.5
            })`;

        ctx2.fill();
    }

    // nebulosa glow
    const nebula = ctx2.createRadialGradient(
        W * 0.7,
        H * 0.3,
        50,
        W * 0.7,
        H * 0.3,
        500
    );

    nebula.addColorStop(0, "rgba(120,0,255,0.18)");
    nebula.addColorStop(1, "rgba(0,0,0,0)");

    ctx2.fillStyle = nebula;
    ctx2.fillRect(0, 0, W, H);

    drawBanner();

    // Fondo cinematico
    const bgGrad = ctx2.createLinearGradient(0, 0, 0, H);

    bgGrad.addColorStop(0, "rgba(8,8,12,0.25)");
    bgGrad.addColorStop(1, "rgba(0,0,0,0.55)");

    ctx2.fillStyle = bgGrad;
    ctx2.fillRect(0, 0, W, H);

    const compact = document.body.classList.contains('is-touch-device') && window.innerWidth > window.innerHeight;

    // ── Leer dimensiones del carrusel desde GEM_CONFIG ──
    const lsCfg = window.GEM_CONFIG?.levelSelect || {};
    const cardCfg = compact ? (lsCfg.card?.landscape || {}) : (lsCfg.card?.desktop || {});
    const cardW = cardCfg.width ?? (compact ? 250 : 320);
    const cardH = cardCfg.height ?? (compact ? 315 : 420);
    const spacing = cardCfg.spacing ?? (compact ? 315 : 420);

    const centerX = W / 2;
    const cyCfg = compact ? (lsCfg.centerY?.landscape || {}) : (lsCfg.centerY?.desktop || {});
    const centerY = cyCfg.mode === 'factor'
        ? H * (cyCfg.value ?? 0.58)
        : H / 2 + (cyCfg.value ?? 70);

    carouselX += (carouselTarget - carouselX) * 0.12;

    levels.forEach((lv, i) => {


        const offsetX = (i - selectedLevel) * spacing + carouselX;

        const scale = i === selectedLevel ? 1 : 0.72;
        const alpha = i === selectedLevel ? 1 : 0.42;

        const x = centerX + offsetX - cardW * scale / 2;
        const floatY =
            Math.sin(now * 0.002 + i) * 8;

        const y =
            centerY -
            cardH * scale / 2 +
            floatY;

        const w = cardW * scale;
        const h = cardH * scale;

        ctx2.save();

        ctx2.globalAlpha = alpha;

        // =========================================
        // CARD GLOW
        // =========================================

        if (i === selectedLevel) {

            const glowColor = window.GEM_CONFIG?.levelSelect?.colors?.selectedGlow || "#00ffe7";
            ctx2.shadowColor = glowColor;
            ctx2.shadowBlur =
                25 +
                Math.sin(now * 0.005) * 15;

        }

        // =========================================
        // FONDO CARD
        // =========================================

        const grad = ctx2.createLinearGradient(x, y, x, y + h);

        grad.addColorStop(0, "rgba(28,28,34,0.96)");
        grad.addColorStop(1, "rgba(8,8,12,0.98)");

        ctx2.fillStyle = grad;

        ctx2.beginPath();
        ctx2.roundRect(x, y, w, h, 22 * scale);
        ctx2.fill();

        ctx2.shadowBlur = 0;

        // =========================================
        // BORDE
        // =========================================

        const lsColors = window.GEM_CONFIG?.levelSelect?.colors || {};
        ctx2.strokeStyle = i === selectedLevel
            ? (lsColors.selectedBorder || "rgba(0,255,231,0.45)")
            : (lsColors.idleBorder || "rgba(255,255,255,0.06)");

        ctx2.lineWidth = i === selectedLevel ? 2 : 1.2;

        ctx2.stroke();

        // =========================================
        // BRILLO SUPERIOR
        // =========================================

        const shine = ctx2.createLinearGradient(
            x,
            y,
            x,
            y + h * 0.3
        );

        shine.addColorStop(0, "rgba(255,255,255,0.06)");
        shine.addColorStop(1, "rgba(255,255,255,0)");

        ctx2.fillStyle = shine;

        ctx2.beginPath();
        ctx2.roundRect(
            x + 2,
            y + 2,
            w - 4,
            h * 0.35,
            20 * scale
        );

        ctx2.fill();

        // =========================================
        // IMAGEN
        // =========================================

        if (lv.image) {

            const img = levelImages[i];

            ctx2.save();

            ctx2.beginPath();

            ctx2.roundRect(
                x + 14 * scale,
                y + 14 * scale,
                w - 28 * scale,
                h * 0.56,
                14 * scale
            );

            ctx2.clip();

            ctx2.drawImage(
                img,
                x + 14 * scale,
                y + 14 * scale,
                w - 28 * scale,
                h * 0.56
            );

            // sombra oscura abajo imagen
            const imgGrad = ctx2.createLinearGradient(
                0,
                y + h * 0.4,
                0,
                y + h * 0.62
            );

            imgGrad.addColorStop(0, "rgba(0,0,0,0)");
            imgGrad.addColorStop(1, "rgba(0,0,0,0.8)");

            ctx2.fillStyle = imgGrad;

            ctx2.fillRect(
                x + 14 * scale,
                y + h * 0.34,
                w - 28 * scale,
                h * 0.25
            );

            ctx2.restore();

        }

        // =========================================
        // NOMBRE NIVEL
        // =========================================

        ctx2.fillStyle = "#ffffff";

        const lsFonts = window.GEM_CONFIG?.levelSelect?.fonts || {};
        ctx2.font = `bold ${(lsFonts.levelName?.size ?? 24) * scale}px Geom`;

        ctx2.textAlign = "center";

        ctx2.shadowColor = "rgba(255,255,255,0.25)";
        ctx2.shadowBlur = 10;

        ctx2.fillText(
            lv.name,
            centerX + offsetX,
            y + h * 0.73
        );

        ctx2.shadowBlur = 0;

        // =========================================
        // ESTADO
        // =========================================

        if (lv.unlocked) {

            // progreso
            ctx2.fillStyle = "rgba(255,255,255,0.45)";

            ctx2.font = `${(window.GEM_CONFIG?.levelSelect?.fonts?.statusText?.size ?? 13) * scale}px monospace`;

            ctx2.fillText(
                lv.completed
                    ? "100%"
                    : lv.percent + "%",
                centerX + offsetX,
                y + h * 0.81
            );

            // badge desbloqueado
            ctx2.fillStyle = "rgba(0,255,180,0.12)";

            ctx2.beginPath();

            ctx2.roundRect(
                centerX + offsetX - 70 * scale,
                y + h * 0.85,
                140 * scale,
                28 * scale,
                12 * scale
            );

            ctx2.fill();

            ctx2.strokeStyle = "rgba(0,255,180,0.25)";
            ctx2.stroke();

            ctx2.fillStyle = window.GEM_CONFIG?.levelSelect?.colors?.unlockedBadge || "#00ffae";

            ctx2.font = `bold ${(window.GEM_CONFIG?.levelSelect?.fonts?.badgeText?.size ?? 11) * scale}px monospace`;

            ctx2.fillText(
                lv.completed
                    ? "COMPLETADO"
                    : "DESBLOQUEADO",
                centerX + offsetX,
                y + h * 0.89
            );

            // dificultad
            const dColor = getDifficultyColor(lv.difficulty);

            const dSize = 9 * scale;

            const dY = y + h - 24 * scale;

            const dStartX =
                centerX + offsetX -
                ((lv.difficulty - 1) *
                    (dSize * 2.4)) / 2;

            for (let d = 0; d < lv.difficulty; d++) {

                const dx =
                    dStartX +
                    d * (dSize * 2.4);

                ctx2.save();

                ctx2.translate(dx, dY);

                ctx2.rotate(Math.PI / 4);

                ctx2.fillStyle = dColor;

                ctx2.shadowColor = dColor;
                ctx2.shadowBlur = 12;

                ctx2.fillRect(
                    -dSize / 2,
                    -dSize / 2,
                    dSize,
                    dSize
                );

                ctx2.restore();

            }

        } else {

            // overlay oscuro
            ctx2.fillStyle = "rgba(0,0,0,0.45)";

            ctx2.beginPath();
            ctx2.roundRect(x, y, w, h, 22 * scale);
            ctx2.fill();

            // candado
            ctx2.fillStyle = "#ffffff22";
            ctx2.strokeStyle = "#ffffff55";

            ctx2.lineWidth = 2;

            const lx = centerX + offsetX;
            const ly = centerY - 10 * scale;

            ctx2.beginPath();

            ctx2.roundRect(
                lx - 18 * scale,
                ly,
                36 * scale,
                28 * scale,
                8 * scale
            );

            ctx2.fill();
            ctx2.stroke();

            ctx2.beginPath();

            ctx2.arc(
                lx,
                ly,
                14 * scale,
                Math.PI,
                0
            );

            ctx2.stroke();

            // texto
            ctx2.fillStyle = window.GEM_CONFIG?.levelSelect?.colors?.lockedText || "#ff4466";

            ctx2.font = `bold ${13 * scale}px monospace`;

            ctx2.fillText(
                "BLOQUEADO",
                centerX + offsetX,
                y + h * 0.9
            );

        }

        ctx2.restore();

    });

    if (selectVisible) {
        carouselAnimId = requestAnimationFrame(drawCarousel);
    }

}

// Navegación con teclado
document.addEventListener("keydown", e => {

    if (!selectVisible) return;

    if (
        e.key === "a" ||
        e.key === "A" ||
        e.key === "ArrowLeft"
    ) {

        moveLevelSelection(-1);

    }

    if (
        e.key === "d" ||
        e.key === "D" ||
        e.key === "ArrowRight"
    ) {

        moveLevelSelection(1);

    }

    if (
        e.key === "Enter" ||
        e.code === "Space"
    ) {

        window.playSelectedLevel();

    }

    if (e.key === "Escape") {

        window.hideLevelSelect();

        document.getElementById("overlay").style.display =
            "flex";

    }

});

// =====================================================
// BANNER BOLITA
// =====================================================

function drawBanner() {
    const now = carouselLastFrame || performance.now();
    const W = 1200;
    const bannerCanvas = document.getElementById('bannerCanvas');
    const bctx = bannerCanvas.getContext('2d');
    bctx.clearRect(0, 0, 1200, 66);
    const bH = 50;
    const bY = 8;
    const bx = W * 0.22 + ((Math.sin(bannerTime) + 1) / 2) * (W * 0.56);
    const by = bY + bH / 2;

    // Fondo del banner
    bctx.save();
    bctx.fillStyle = "rgba(0,0,0,0.45)";
    bctx.beginPath();
    bctx.roundRect(W * 0.2, bY, W * 0.6, bH, 14);
    bctx.fill();
    bctx.strokeStyle = "rgba(0,255,231,0.2)";
    bctx.lineWidth = 1;
    bctx.beginPath();
    bctx.roundRect(W * 0.2, bY, W * 0.6, bH, 14);
    bctx.stroke();
    bctx.restore();

    bctx.fillStyle = "rgba(255,255,255,0.4)";
    bctx.font = "11px monospace";
    bctx.textAlign = "center";
    bctx.fillText("SKIN SELECCIONADA", W / 2, bY + 14);

    bannerTime += 0.009;

    const COLORS = {
        cyan: '#00ffe7', red: '#ff4444', blue: '#5045eb',
        yellow: '#ffee00', orange: '#ff8800', green: '#3fe969',
        purple: '#cc44ff', cool: '#ffffff', daxor: '#ff2448', kenji: '#845cff',
    };

    const equippedSkin = localStorage.getItem('equippedSkin') || 'cyan';
    const equippedTrail = localStorage.getItem('equippedTrail') || 'basic_cyan';
    const parts = equippedTrail.split('_');
    const trailEffect = parts[0];
    const trailColor = parts[1];

    let skinColor = COLORS[equippedSkin] || '#00ffe7';
    let trailRgb = BANNER_TRAIL_COLORS[trailColor] || '0,255,231';

    let skinRgb;
    if (skinColor.startsWith('hsl')) {
        skinRgb = '255,255,255';
    } else {
        skinRgb = skinColor.slice(1).match(/.{2}/g).map(h => parseInt(h, 16)).join(',');
    }

    const trailHex = `rgb(${trailRgb})`;
    bctx.shadowBlur = 20;
    bctx.shadowColor = trailHex;

    bannerTrail.push({ x: bx, y: by, life: 1.0 });
    if (bannerTrail.length > 40) bannerTrail.shift();

    for (let t of bannerTrail) {
        t.life -= 0.018;
        if (t.life <= 0) continue;

        if (trailEffect === 'basic') {
            bctx.beginPath();
            bctx.arc(t.x, t.y, 14 * t.life, 0, Math.PI * 2);
            bctx.fillStyle = `rgba(${trailRgb},${t.life * 0.08})`;
            bctx.fill();
            bctx.beginPath();
            bctx.arc(t.x, t.y, 8 * t.life, 0, Math.PI * 2);
            bctx.fillStyle = `rgba(${trailRgb},${t.life * 0.2})`;
            bctx.fill();
            bctx.shadowBlur = 0;

        } else if (trailEffect === 'fire') {
            for (let f = 0; f < 4; f++) {
                const fy = t.y - f * 3 * t.life;
                const fw = (4 - f) * 2 * t.life;
                bctx.beginPath();
                bctx.arc(t.x, fy, fw, 0, Math.PI * 2);
                bctx.fillStyle = `rgba(${trailRgb},${0.5 * t.life})`;
                bctx.fill();
            }

        } else if (trailEffect === 'ghost') {
            bctx.beginPath();
            bctx.arc(t.x, t.y, 18 * t.life, 0, Math.PI * 2);
            bctx.fillStyle = `rgba(${trailRgb},${0.05 * t.life})`;
            bctx.fill();
            bctx.beginPath();
            bctx.arc(t.x, t.y, 10 * t.life, 0, Math.PI * 2);
            bctx.fillStyle = `rgba(${trailRgb},${0.12 * t.life})`;
            bctx.fill();

        } else if (trailEffect === 'fractura') {
            bctx.beginPath();
            bctx.arc(t.x, t.y, 6 * t.life, 0, Math.PI * 2);
            bctx.fillStyle = `rgba(${trailRgb},${0.1 * t.life})`;
            bctx.fill();
            if (Math.random() < 0.45) {
                bctx.beginPath();
                bctx.moveTo(t.x, t.y);
                bctx.lineTo(t.x + (Math.random() - 0.5) * 20, t.y + (Math.random() - 0.5) * 20);
                bctx.strokeStyle = `rgba(${trailRgb},${t.life})`;
                bctx.lineWidth = 1.2;
                bctx.stroke();
            }

        } else if (trailEffect === 'rayo') {
            bctx.beginPath();
            bctx.moveTo(t.x + 8 * t.life, t.y - 4 * t.life);
            bctx.lineTo(t.x - 2 * t.life, t.y + 3 * t.life);
            bctx.lineTo(t.x - 12 * t.life, t.y - 1 * t.life);
            bctx.lineTo(t.x - 22 * t.life, t.y + 7 * t.life);
            bctx.strokeStyle = `rgba(${trailRgb},${t.life})`;
            bctx.lineWidth = Math.max(1, 2 * t.life);
            bctx.stroke();
            bctx.strokeStyle = `rgba(245,250,255,${0.7 * t.life})`;
            bctx.lineWidth = Math.max(0.6, t.life);
            bctx.stroke();

        } else if (trailEffect === 'hielo') {
            bctx.beginPath();
            bctx.arc(t.x, t.y, 12 * t.life, 0, Math.PI * 2);
            bctx.strokeStyle = `rgba(${trailRgb},${0.42 * t.life})`;
            bctx.lineWidth = Math.max(1, 2 * t.life);
            bctx.stroke();
            bctx.beginPath();
            bctx.moveTo(t.x, t.y);
            bctx.lineTo(t.x - 12 * t.life, t.y - 8 * t.life);
            bctx.strokeStyle = `rgba(220,250,255,${0.62 * t.life})`;
            bctx.stroke();

        } else if (trailEffect === 'toxico') {
            for (let b = 0; b < 3; b++) {
                bctx.beginPath();
                bctx.arc(t.x - b * 8 * t.life, t.y + Math.sin(t.x * 0.08 + b) * 7 * t.life, (7 + b * 2) * t.life, 0, Math.PI * 2);
                bctx.fillStyle = `rgba(${trailRgb},${(0.08 + b * 0.04) * t.life})`;
                bctx.fill();
            }

        } else if (trailEffect === 'rainbow') {
            const hue = (now * 0.15 + t.life * 120) % 360;
            bctx.beginPath();
            bctx.arc(t.x, t.y, 14 * t.life, 0, Math.PI * 2);
            bctx.fillStyle = `hsla(${hue},100%,60%,${0.12 * t.life})`;
            bctx.fill();
        }

        // Núcleo (color skin)
        bctx.beginPath();
        bctx.arc(t.x, t.y, 3 * t.life, 0, Math.PI * 2);
        bctx.fillStyle = `rgba(${skinRgb},${t.life * 0.9})`;
        bctx.fill();
    }

    const selectedSkinPreview = getLevelSelectSkinImage(equippedSkin);
    const skinImg = selectedSkinPreview.image;
    bctx.shadowBlur = 16;
    bctx.shadowColor = skinColor;
    if (skinImg && skinImg.complete && skinImg.naturalWidth > 0) {
        if (selectedSkinPreview.rolling) {
            bctx.save();
            bctx.translate(bx, by);
            bctx.rotate(now * 0.006);
            bctx.drawImage(skinImg, -18, -18, 36, 36);
            bctx.restore();
        } else {
            bctx.drawImage(skinImg, bx - 18, by - 18, 36, 36);
        }
    } else {
        bctx.beginPath();
        bctx.arc(bx, by, 9, 0, Math.PI * 2);
        bctx.fillStyle = skinColor;
        bctx.fill();
    }
    bctx.shadowBlur = 0;
}
