// =====================================================
// TRAIL EFFECTS — estela estilo Geometry Dash
// =====================================================

const TRAIL_COLORS_RGB = {
    cyan: '0,255,231',
    red: '255,68,68',
    blue: '68,136,255',
    yellow: '255,238,0',
    orange: '255,136,0',
    green: '68,255,136',
    purple: '204,68,255',
    rgb: null,
};

const TRAIL_EFFECTS = {
    basic: { type: 'basic' },
    fire: { type: 'fire' },
    water: { type: 'water' },
    wind: { type: 'wind' },
    ghost: { type: 'ghost' },
    fractura: { type: 'fractura' },
    rayo: { type: 'rayo' },
    hielo: { type: 'hielo' },
    ice: { type: 'hielo' },
    lava: { type: 'lava' },
    nature: { type: 'nature' },
    vampiro: { type: 'vampiro' },
    zombie: { type: 'zombie' },
    navidad: { type: 'navidad' },
    santa: { type: 'navidad' },
    mama_claus: { type: 'navidad' },
    sonrisa_malvada: { type: 'risa_malvada' },
    circo: { type: 'risa' },
    money: { type: 'dinero' },
    dinero: { type: 'dinero' },
    custom_text: { type: 'custom_text' },
    toxico: { type: 'toxico' },
};

const snowflakeTrailImg = new Image();
snowflakeTrailImg.src = 'assets/UI/Efectos de trails/Efecto copo de nieve.png';
const trailParticleImages = {
    veneno: new Image(),
    burbuja: new Image(),
    dinero: new Image(),
    risa: new Image(),
    risaMalvada: new Image(),
    dulce: new Image(),
};
trailParticleImages.veneno.src = 'assets/UI/Efectos de trails/Particulas/particula_veneno.png';
trailParticleImages.burbuja.src = 'assets/UI/Efectos de trails/Particulas/particula_burbuja.png';
trailParticleImages.dinero.src = 'assets/UI/Efectos de trails/Particulas/particula_dinero.png';
trailParticleImages.risa.src = 'assets/UI/Efectos de trails/Particulas/particula_risa.png';
trailParticleImages.risaMalvada.src = 'assets/UI/Efectos de trails/Particulas/particula_risa_malvada.png';
trailParticleImages.dulce.src = 'assets/UI/Efectos de trails/Particulas/particula_dulce.png';

// Cada punto guarda posición ABSOLUTA en el canvas
let trail = [];
let lastTrailPoint = null;
let cachedTrailId = null;
let cachedTrailConfig = { effect: 'basic', colorKey: 'cyan' };
let cachedSkinId = null;
let cachedSkinRgb = '0,255,231';

function getTrailConfig() {
    const trailId = localStorage.getItem('equippedTrail') || 'basic_cyan';
    if (trailId === cachedTrailId) return cachedTrailConfig;
    let effect = 'basic';
    let colorKey = 'cyan';
    if (trailId.startsWith('trail_custom_text_')) {
        effect = 'custom_text';
        colorKey = trailId.substring('trail_custom_text_'.length) || 'cyan';
    } else if (trailId.startsWith('trail_')) {
        const rest = trailId.substring('trail_'.length);
        const lastIdx = rest.lastIndexOf('_');
        effect = lastIdx > 0 ? rest.substring(0, lastIdx) : rest;
        colorKey = lastIdx > 0 ? rest.substring(lastIdx + 1) : 'cyan';
    } else {
        const idx = trailId.indexOf('_');
        effect = idx > 0 ? trailId.substring(0, idx) : 'basic';
        colorKey = idx > 0 ? trailId.substring(idx + 1) : 'cyan';
    }
    effect = TRAIL_EFFECTS[effect]?.type || effect;
    cachedTrailId = trailId;
    cachedTrailConfig = { effect, colorKey };
    return cachedTrailConfig;
}

// Llamada cada frame desde update() en main.js
function updateTrail() {
    const r = BASE_RADIUS + offset;
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    // Posición absoluta de la pelota en el canvas
    const px = cx + Math.cos(angle) * r;
    const py = cy + Math.sin(angle) * r;

    if (lastTrailPoint && Math.hypot(px - lastTrailPoint.x, py - lastTrailPoint.y) < 1.2) {
        for (let i = trail.length - 1; i >= 0; i--) {
            trail[i].life *= 0.96;
            if (trail[i].life <= 0.04) trail.splice(i, 1);
        }
        return;
    }

    lastTrailPoint = { x: px, y: py };

    trail.push({
        x: px,
        y: py,
        life: 1.0,
        seed: Math.random(),
        wobble: (Math.random() - 0.5) * 2,
        spin: (Math.random() - 0.5) * Math.PI * 2,
        scale: 0.65 + Math.random() * 0.8,
    });

    const { effect } = getTrailConfig();
    const speedStretch = Math.min(18, Math.abs(window.angVel || 0) * 220);
    const baseMaxTrail = effect === 'custom_text' ? 30 + Math.round(speedStretch) : effect === 'ghost' ? 38 : effect === 'fire' || effect === 'lava' ? 34 : effect === 'fractura' ? 32 : effect === 'hielo' || effect === 'ice' ? 22 : effect === 'toxico' || effect === 'nature' ? 34 : effect === 'navidad' ? 28 : 28;
    const maxTrail = window.GAME_PERF?.lowPower?.() ? Math.ceil(baseMaxTrail * 0.58) : baseMaxTrail;
    if (trail.length > maxTrail) trail.shift();

    // vida proporcional a posición: el más viejo tiene life~0, el más nuevo life~1
    for (let i = 0; i < trail.length; i++) {
        trail[i].life = (i + 1) / trail.length;
    }
}

function resetTrail() {
    trail = [];
    lastTrailPoint = null;
}

function drawTrailParticleImage(ctxTarget, img, x, y, size, rotation, alpha) {
    if (!img || !img.complete || img.naturalWidth <= 0) return false;
    ctxTarget.save();
    ctxTarget.translate(x, y);
    ctxTarget.rotate(rotation || 0);
    ctxTarget.globalAlpha = alpha;
    ctxTarget.drawImage(img, -size / 2, -size / 2, size, size);
    ctxTarget.restore();
    return true;
}

function drawCustomTextTrailRibbon(colorKey, lowPower, hueBase) {
    if (trail.length < 2) return;
    const phrase = (localStorage.getItem('customTrailText') || 'RUBY').trim().slice(0, 18) || 'RUBY';
    const head = trail[trail.length - 1];
    const prev = trail[Math.max(0, trail.length - 5)];
    const dx = head.x - prev.x;
    const dy = head.y - prev.y;
    const len = Math.hypot(dx, dy) || 1;
    const angle = Math.atan2(dy, dx);
    const now = window.GAME_PERF?.now || performance.now();
    const speed = Math.min(1, Math.abs(window.angVel || 0) / 0.055);
    const rgbMode = colorKey === 'rgb';
    const rgb = TRAIL_COLORS_RGB[colorKey] || '255,218,58';
    const glow = rgbMode ? `hsla(${hueBase},100%,64%,0.95)` : `rgba(${rgb},0.95)`;
    const textW = Math.min(170, Math.max(54, phrase.length * 14));
    const ribbonW = Math.min(214, Math.max(118, textW + 66));
    const ribbonH = 28;
    const attachGap = 28;
    const waveAmp = 4 + speed * 3;
    const segments = lowPower ? 9 : 16;

    ctx.save();
    ctx.translate(head.x, head.y);
    ctx.rotate(angle);
    ctx.globalAlpha = 0.96;
    ctx.shadowColor = glow;
    ctx.shadowBlur = lowPower ? 0 : 14;

    const startX = -attachGap;
    const endX = -attachGap - ribbonW;
    const drawEdge = (side) => {
        for (let i = 0; i <= segments; i++) {
            const p = i / segments;
            const x = startX + (endX - startX) * p;
            const wave = Math.sin(now * 0.007 + p * Math.PI * 4.4) * waveAmp;
            const taper = 1 - p * 0.18;
            const y = side * (ribbonH * 0.5 * taper) + wave;
            if (i === 0 && side < 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
    };

    ctx.beginPath();
    drawEdge(-1);
    ctx.lineTo(endX - 18, Math.sin(now * 0.007 + 2.4) * waveAmp);
    drawEdge(1);
    ctx.closePath();
    const bodyGrad = ctx.createLinearGradient(endX - 18, 0, startX, 0);
    bodyGrad.addColorStop(0, 'rgba(250,252,255,0.78)');
    bodyGrad.addColorStop(0.2, 'rgba(255,255,255,0.94)');
    bodyGrad.addColorStop(0.72, 'rgba(255,255,255,0.88)');
    bodyGrad.addColorStop(1, rgbMode ? `hsla(${hueBase},100%,70%,0.42)` : `rgba(${rgb},0.34)`);
    ctx.fillStyle = bodyGrad;
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'rgba(18,22,34,0.42)';
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(startX + 2, -7);
    ctx.lineTo(-10, -2);
    ctx.lineTo(-10, 2);
    ctx.lineTo(startX + 2, 7);
    ctx.strokeStyle = rgbMode ? `hsla(${hueBase},100%,64%,0.58)` : `rgba(${rgb},0.58)`;
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.shadowBlur = lowPower ? 0 : 5;
    ctx.shadowColor = 'rgba(255,255,255,0.8)';
    ctx.font = '900 15px Geom, monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.lineWidth = 3;
    ctx.strokeStyle = 'rgba(255,255,255,0.78)';
    ctx.fillStyle = 'rgba(22,24,34,0.95)';
    const chars = phrase.split('');
    const spacing = Math.min(14, Math.max(8, textW / Math.max(1, chars.length)));
    const textCenter = endX + ribbonW * 0.55;
    const firstX = textCenter - ((chars.length - 1) * spacing) / 2;
    chars.forEach((ch, index) => {
        const p = (firstX + index * spacing - endX) / ribbonW;
        const wave = Math.sin(now * 0.007 + p * Math.PI * 4.4) * (waveAmp * 0.72);
        const tilt = Math.cos(now * 0.007 + p * Math.PI * 4.4) * 0.1;
        ctx.save();
        ctx.translate(firstX + index * spacing, wave);
        ctx.rotate(tilt);
        ctx.strokeText(ch, 0, 0);
        ctx.fillText(ch, 0, 0);
        ctx.restore();
    });
    ctx.restore();
}

function getSkinRgb() {
    const SKIN_RGB = {
        cyan: '0,255,231',
        red: '255,68,68',
        blue: '68,136,255',
        yellow: '255,238,0',
        orange: '255,136,0',
        green: '68,255,136',
        purple: '204,68,255',
        cool: '255,255,255',
    };
    const id = localStorage.getItem('equippedSkin') || 'cyan';
    if (id === cachedSkinId) return cachedSkinRgb;
    cachedSkinId = id;
    cachedSkinRgb = SKIN_RGB[id] || '0,255,231';
    return cachedSkinRgb;
}

// drawTrail ya NO recibe cx,cy — los puntos tienen coords absolutas
function drawTrail() {
    if (trail.length < 2) return;

    const { effect, colorKey } = getTrailConfig();
    const lowPower = window.GAME_PERF?.lowPower?.();
    const hueBase = ((window.GAME_PERF?.now || performance.now()) * 0.18) % 360;
    const step = lowPower ? 2 : 1;

    if (effect === 'custom_text') {
        drawCustomTextTrailRibbon(colorKey, lowPower, hueBase);
        return;
    }

    for (let i = 0; i < trail.length; i += step) {
        const t = trail[i];
        const life = t.life;
        if (life <= 0) continue;

        const prev = trail[Math.max(0, i - 1)];
        const next = trail[Math.min(trail.length - 1, i + 1)];
        const dx = next.x - prev.x;
        const dy = next.y - prev.y;
        const len = Math.hypot(dx, dy) || 1;
        const nx = -dy / len;
        const ny = dx / len;
        const rgbMode = colorKey === 'rgb';
        const rgb = TRAIL_COLORS_RGB[colorKey] || '255,80,255';
        const fill = (alpha, shift = 0) => rgbMode
            ? `hsla(${(hueBase + i * 9 + shift) % 360},100%,64%,${alpha})`
            : `rgba(${rgb},${alpha})`;

        // ── BASIC ──────────────────────────────────────
        if (effect === 'basic') {
            ctx.save();
            if (!lowPower) {
                ctx.shadowBlur = 12 * life;
                ctx.shadowColor = rgbMode ? `hsl(${(hueBase + i * 9) % 360},100%,64%)` : `rgb(${rgb})`;
            }
            ctx.beginPath();
            ctx.ellipse(t.x - dx * 0.45, t.y - dy * 0.45, 18 * life, 5 * life, Math.atan2(dy, dx), 0, Math.PI * 2);
            ctx.fillStyle = fill(life * 0.13);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(t.x, t.y, 4.5 * life, 0, Math.PI * 2);
            ctx.fillStyle = fill(life * 0.34);
            ctx.fill();
            ctx.restore();
        }

        // ── FIRE ───────────────────────────────────────
        else if (effect === 'fire') {
            ctx.save();
            ctx.globalCompositeOperation = 'lighter';
            for (let f = 0; f < 5; f++) {
                const back = 4 + f * 7;
                const px = t.x - (dx / len) * back * life + nx * Math.sin(t.seed * 9 + f) * 6 * life;
                const py = t.y - (dy / len) * back * life + ny * Math.cos(t.seed * 9 + f) * 6 * life;
                const fw = (17 - f * 2.4) * life;
                ctx.beginPath();
                ctx.ellipse(px, py, fw, fw * 0.42, Math.atan2(dy, dx), 0, Math.PI * 2);
                ctx.fillStyle = f < 2 ? `rgba(255,230,80,${life * 0.34})` : fill(life * (0.30 - f * 0.035), f * 16);
                ctx.fill();
            }
            if (t.seed > 0.72) {
                ctx.beginPath();
                ctx.arc(
                    t.x - dx * 0.7 + nx * t.wobble * 9 * life,
                    t.y - dy * 0.7 + ny * t.wobble * 9 * life,
                    1.4 * life,
                    0,
                    Math.PI * 2
                );
                ctx.fillStyle = `rgba(255,230,50,${life * 0.9})`;
                ctx.fill();
            }
            ctx.restore();
        }

        // ── GHOST ──────────────────────────────────────
        else if (effect === 'ghost') {
            ctx.save();
            ctx.globalCompositeOperation = 'screen';
            for (let s = 0; s < 3; s++) {
                const drift = (1 - life) * 22 + s * 7;
                ctx.beginPath();
                ctx.arc(
                    t.x - (dx / len) * drift + nx * Math.sin(t.seed * 10 + s) * 14 * (1 - life),
                    t.y - (dy / len) * drift + ny * Math.cos(t.seed * 10 + s) * 14 * (1 - life),
                    (10 + s * 7) * life,
                    0,
                    Math.PI * 2
                );
                ctx.fillStyle = fill(life * (0.055 + s * 0.018), s * 26);
                ctx.fill();
            }
            ctx.restore();
        }

        // ── RAYO ───────────────────────────────────────
        else if (effect === 'fractura') {
            ctx.save();
            ctx.globalCompositeOperation = 'lighter';
            ctx.beginPath();
            ctx.arc(t.x, t.y, 8 * life, 0, Math.PI * 2);
            ctx.fillStyle = fill(life * 0.11);
            ctx.fill();

            if (t.seed > 0.28) {
                ctx.beginPath();
                ctx.moveTo(t.x, t.y);
                for (let b = 1; b <= 4; b++) {
                    const back = b * 9 * life;
                    ctx.lineTo(
                        t.x - (dx / len) * back + nx * Math.sin(t.seed * 22 + b) * 10 * life,
                        t.y - (dy / len) * back + ny * Math.cos(t.seed * 22 + b) * 10 * life
                    );
                }
                ctx.strokeStyle = fill(life * 0.86);
                ctx.lineWidth = Math.max(1, 2.1 * life);
                ctx.stroke();
            }
            ctx.restore();
        }

        else if (effect === 'rayo') {
            ctx.save();
            ctx.globalCompositeOperation = 'lighter';
            const bx = dx / len;
            const by = dy / len;
            if (!lowPower) {
                ctx.shadowBlur = 16 * life;
                ctx.shadowColor = rgbMode ? `hsl(${(hueBase + i * 9) % 360},100%,70%)` : `rgb(${rgb})`;
            }
            if (t.seed > 0.18) {
                ctx.beginPath();
                ctx.moveTo(t.x, t.y);
                for (let b = 1; b <= 5; b++) {
                    const back = b * 10 * life;
                    const jag = (b % 2 === 0 ? 1 : -1) * (5 + t.seed * 7) * life;
                    ctx.lineTo(t.x - bx * back + nx * jag, t.y - by * back + ny * jag);
                }
                ctx.strokeStyle = fill(life * 0.9);
                ctx.lineWidth = Math.max(1, 2.4 * life);
                ctx.stroke();
                ctx.strokeStyle = 'rgba(240,250,255,0.85)';
                ctx.lineWidth = Math.max(0.7, 1.1 * life);
                ctx.stroke();
            }
            if (t.seed > 0.66) {
                const forkBack = 18 * life;
                ctx.beginPath();
                ctx.moveTo(t.x - bx * forkBack, t.y - by * forkBack);
                ctx.lineTo(t.x - bx * (forkBack + 11) + nx * 12 * life, t.y - by * (forkBack + 11) + ny * 12 * life);
                ctx.strokeStyle = fill(life * 0.58);
                ctx.lineWidth = Math.max(0.8, 1.4 * life);
                ctx.stroke();
            }
            ctx.restore();
        }

        else if (effect === 'hielo' || effect === 'ice') {
            ctx.save();
            ctx.globalCompositeOperation = 'screen';
            if (!lowPower && i % 2 === 0) {
                ctx.shadowBlur = 5 * life;
                ctx.shadowColor = rgbMode ? `hsl(${(hueBase + i * 9) % 360},100%,74%)` : `rgb(${rgb})`;
            }
            const flakeCount = lowPower ? 1 : (t.seed > 0.48 ? 1 : 0);
            for (let f = 0; f < flakeCount; f++) {
                const drift = (t.seed - 0.5) * 12 * life;
                const back = (12 + t.seed * 10) * life;
                const fx = t.x - (dx / len) * back + nx * (drift + Math.sin((window.GAME_PERF?.now || performance.now()) * 0.003 + t.seed * 8) * 2.5 * life);
                const fy = t.y - (dy / len) * back + ny * (drift + Math.cos((window.GAME_PERF?.now || performance.now()) * 0.003 + t.seed * 6) * 2.5 * life);
                const size = Math.max(4, (8 + t.seed * 9) * life * (t.scale || 1));
                ctx.save();
                ctx.translate(fx, fy);
                ctx.rotate((t.spin || 0) + (window.GAME_PERF?.now || performance.now()) * (0.001 + t.seed * 0.0012));
                ctx.globalAlpha = Math.min(0.72, life * (0.32 + t.seed * 0.28));
                if (snowflakeTrailImg.complete && snowflakeTrailImg.naturalWidth > 0) {
                    ctx.drawImage(snowflakeTrailImg, -size / 2, -size / 2, size, size);
                } else {
                    ctx.strokeStyle = 'rgba(230,252,255,0.75)';
                    ctx.lineWidth = Math.max(0.8, size * 0.08);
                    for (let arm = 0; arm < 3; arm++) {
                        ctx.rotate(Math.PI / 3);
                        ctx.beginPath();
                        ctx.moveTo(-size * 0.42, 0);
                        ctx.lineTo(size * 0.42, 0);
                        ctx.stroke();
                    }
                }
                ctx.restore();
            }
            if (t.seed > 0.72 && i % 2 === 0) {
                ctx.beginPath();
                ctx.moveTo(t.x, t.y);
                ctx.lineTo(t.x - (dx / len) * 16 * life + nx * 6 * life, t.y - (dy / len) * 16 * life + ny * 6 * life);
                ctx.strokeStyle = 'rgba(220,250,255,0.42)';
                ctx.lineWidth = 1;
                ctx.stroke();
            }
            ctx.restore();
        }

        else if (effect === 'toxico') {
            ctx.save();
            ctx.globalCompositeOperation = 'lighter';
            for (let b = 0; b < 2; b++) {
                const px = t.x - (dx / len) * (b * 11 + 5) * life + nx * Math.sin(t.seed * 8 + b) * 7 * life;
                const py = t.y - (dy / len) * (b * 11 + 5) * life + ny * Math.cos(t.seed * 8 + b) * 7 * life;
                if (t.seed > 0.36 && drawTrailParticleImage(ctx, trailParticleImages.veneno, px, py, (13 + b * 3) * life, t.spin + b, life * 0.55)) continue;
                ctx.beginPath();
                ctx.arc(
                    px,
                    py,
                    (7 + b * 2) * life,
                    0,
                    Math.PI * 2
                );
                ctx.fillStyle = fill(life * (0.1 + b * 0.04), b * 16);
                ctx.fill();
            }
            ctx.restore();
        }

        else if (effect === 'navidad') {
            ctx.save();
            ctx.globalCompositeOperation = 'screen';
            ctx.beginPath();
            ctx.ellipse(t.x - dx * 0.45, t.y - dy * 0.45, 18 * life, 5.5 * life, Math.atan2(dy, dx), 0, Math.PI * 2);
            ctx.fillStyle = `rgba(40,255,120,${life * 0.18})`;
            ctx.fill();
            ctx.strokeStyle = `rgba(255,55,70,${life * 0.42})`;
            ctx.lineWidth = Math.max(1, 2 * life);
            ctx.stroke();
            if (!lowPower && t.seed > 0.5) {
                const px = t.x - (dx / len) * (12 + t.seed * 12) * life + nx * (t.seed - 0.5) * 16 * life;
                const py = t.y - (dy / len) * (12 + t.seed * 12) * life + ny * (t.seed - 0.5) * 16 * life;
                drawTrailParticleImage(ctx, trailParticleImages.dulce, px, py, (12 + t.seed * 8) * life, (t.spin || 0) + hueBase * 0.02, life * 0.75);
            }
            ctx.restore();
        }

        else if (effect === 'dinero' || effect === 'risa' || effect === 'risa_malvada') {
            const img = effect === 'dinero' ? trailParticleImages.dinero : effect === 'risa_malvada' ? trailParticleImages.risaMalvada : trailParticleImages.risa;
            ctx.save();
            ctx.globalCompositeOperation = 'screen';
            if (t.seed > 0.32) {
                const px = t.x - (dx / len) * (10 + t.seed * 14) * life + nx * (t.seed - 0.5) * 14 * life;
                const py = t.y - (dy / len) * (10 + t.seed * 14) * life + ny * (t.seed - 0.5) * 14 * life;
                drawTrailParticleImage(ctx, img, px, py, (14 + t.seed * 8) * life, (t.spin || 0) * 0.25, life * 0.72);
            }
            ctx.restore();
        }

        else if (effect === 'water' || effect === 'wind' || effect === 'nature' || effect === 'vampiro' || effect === 'zombie') {
            ctx.save();
            ctx.globalCompositeOperation = effect === 'wind' ? 'screen' : 'lighter';
            const wave = Math.sin((window.GAME_PERF?.now || performance.now()) * 0.012 + t.seed * 12 + i) * 10 * life;
            const tone = effect === 'water' ? '68,136,255' : effect === 'wind' ? '180,255,245' : effect === 'nature' ? '68,255,136' : effect === 'vampiro' ? '255,77,109' : '120,255,143';
            const bands = lowPower ? 2 : 3;
            for (let b = 0; b < bands; b++) {
                const back = (b * 8 + 6) * life;
                if (effect === 'water' && b === 0 && t.seed > 0.45 && drawTrailParticleImage(ctx, trailParticleImages.burbuja, t.x - (dx / len) * back, t.y + ny * wave * 0.35, 12 * life, 0, life * 0.52)) continue;
                ctx.beginPath();
                ctx.ellipse(
                    t.x - (dx / len) * back + nx * wave * (0.35 + b * 0.12),
                    t.y - (dy / len) * back + ny * wave * (0.35 + b * 0.12),
                    (14 - b * 1.8) * life,
                    (4 + b) * life,
                    Math.atan2(dy, dx) + Math.sin(t.seed * 7 + b) * 0.3,
                    0,
                    Math.PI * 2
                );
                ctx.fillStyle = `rgba(${tone},${life * (0.18 - b * 0.025)})`;
                ctx.fill();
            }
            ctx.restore();
        }

        else if (effect === 'lava') {
            ctx.save();
            ctx.globalCompositeOperation = 'lighter';
            for (let b = 0; b < 5; b++) {
                const back = (b * 7 + 5) * life;
                ctx.beginPath();
                ctx.ellipse(
                    t.x - (dx / len) * back + nx * Math.sin(t.seed * 9 + b) * 7 * life,
                    t.y - (dy / len) * back + ny * Math.cos(t.seed * 8 + b) * 7 * life,
                    (18 - b * 2.3) * life,
                    (6 + b * 0.8) * life,
                    Math.atan2(dy, dx),
                    0,
                    Math.PI * 2
                );
                ctx.fillStyle = b < 2 ? `rgba(255,226,80,${life * 0.28})` : `rgba(255,68,28,${life * (0.28 - b * 0.035)})`;
                ctx.fill();
            }
            ctx.restore();
        }

    }
}
