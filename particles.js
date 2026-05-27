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
    custom_text: { type: 'custom_text' },
    toxico: { type: 'toxico' },
};

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
    });

    const { effect } = getTrailConfig();
    const speedStretch = Math.min(18, Math.abs(window.angVel || 0) * 220);
    const baseMaxTrail = effect === 'custom_text' ? 30 + Math.round(speedStretch) : effect === 'ghost' ? 38 : effect === 'fire' || effect === 'lava' ? 34 : effect === 'fractura' ? 32 : effect === 'hielo' || effect === 'ice' ? 34 : effect === 'toxico' || effect === 'nature' ? 36 : 28;
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
            if (!lowPower) {
                ctx.shadowBlur = 10 * life;
                ctx.shadowColor = rgbMode ? `hsl(${(hueBase + i * 9) % 360},100%,74%)` : `rgb(${rgb})`;
            }
            ctx.beginPath();
            ctx.ellipse(t.x - dx * 0.38, t.y - dy * 0.38, 15 * life, 5 * life, Math.atan2(dy, dx), 0, Math.PI * 2);
            ctx.strokeStyle = fill(life * 0.48);
            ctx.lineWidth = Math.max(1, 2 * life);
            ctx.stroke();
            if (t.seed > 0.45) {
                ctx.beginPath();
                ctx.moveTo(t.x, t.y);
                ctx.lineTo(t.x - (dx / len) * 20 * life + nx * 8 * life, t.y - (dy / len) * 20 * life + ny * 8 * life);
                ctx.strokeStyle = 'rgba(220,250,255,0.72)';
                ctx.lineWidth = 1;
                ctx.stroke();
            }
            ctx.restore();
        }

        else if (effect === 'toxico') {
            ctx.save();
            ctx.globalCompositeOperation = 'lighter';
            for (let b = 0; b < 3; b++) {
                ctx.beginPath();
                ctx.arc(
                    t.x - (dx / len) * (b * 9 + 5) * life + nx * Math.sin(t.seed * 8 + b) * 8 * life,
                    t.y - (dy / len) * (b * 9 + 5) * life + ny * Math.cos(t.seed * 8 + b) * 8 * life,
                    (7 + b * 2) * life,
                    0,
                    Math.PI * 2
                );
                ctx.fillStyle = fill(life * (0.1 + b * 0.04), b * 16);
                ctx.fill();
            }
            ctx.restore();
        }

        else if (effect === 'water' || effect === 'wind' || effect === 'nature' || effect === 'vampiro' || effect === 'zombie') {
            ctx.save();
            ctx.globalCompositeOperation = effect === 'wind' ? 'screen' : 'lighter';
            const wave = Math.sin((window.GAME_PERF?.now || performance.now()) * 0.012 + t.seed * 12 + i) * 10 * life;
            const tone = effect === 'water' ? '68,136,255' : effect === 'wind' ? '180,255,245' : effect === 'nature' ? '68,255,136' : effect === 'vampiro' ? '255,77,109' : '120,255,143';
            for (let b = 0; b < 4; b++) {
                const back = (b * 8 + 6) * life;
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

        else if (effect === 'custom_text') {
            ctx.save();
            const phrase = (localStorage.getItem('customTrailText') || 'RUBY').slice(0, 18);
            const speedStretch = Math.min(1.8, 1 + Math.abs(window.angVel || 0) * 11);
            const back = (1 - life) * 52 * speedStretch;
            const px = t.x - (dx / len) * back;
            const py = t.y - (dy / len) * back;
            const angle = Math.atan2(dy, dx);
            ctx.translate(px, py);
            ctx.rotate(angle);
            ctx.globalAlpha = Math.min(1, life * 1.05);
            const rectW = Math.min(168, 42 + phrase.length * 12 * speedStretch);
            const rectH = 28;
            const grad = ctx.createLinearGradient(-rectW / 2, 0, rectW / 2, 0);
            grad.addColorStop(0, `rgba(7,9,18,${0.1 + life * 0.62})`);
            grad.addColorStop(0.72, `rgba(7,9,18,${0.08 + life * 0.44})`);
            grad.addColorStop(1, `rgba(255,218,58,${life * 0.18})`);
            ctx.fillStyle = grad;
            ctx.fillRect(-rectW / 2, -rectH / 2, rectW, rectH);
            ctx.font = '900 14px Geom, monospace';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.shadowBlur = lowPower ? 0 : 10 * life;
            ctx.shadowColor = '#ffda3a';
            ctx.fillStyle = `rgba(255,238,150,${0.18 + life * 0.72})`;
            const spacing = Math.min(16, 9 + (1 - life) * 5 * speedStretch);
            const chars = phrase.split('');
            const start = -(chars.length - 1) * spacing / 2;
            chars.forEach((ch, charIndex) => {
                const wave = Math.sin((window.GAME_PERF?.now || performance.now()) * 0.009 + charIndex * 0.72 + t.seed * 3) * 5 * life;
                ctx.fillText(ch, start + charIndex * spacing, wave);
            });
            ctx.restore();
        }
    }
}
