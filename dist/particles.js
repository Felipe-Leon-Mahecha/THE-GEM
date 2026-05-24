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
    ghost: { type: 'ghost' },
    fractura: { type: 'fractura' },
    rayo: { type: 'rayo' },
    hielo: { type: 'hielo' },
    toxico: { type: 'toxico' },
};

// Cada punto guarda posición ABSOLUTA en el canvas
let trail = [];
let lastTrailPoint = null;

function getTrailConfig() {
    const trailId = localStorage.getItem('equippedTrail') || 'basic_cyan';
    const idx = trailId.indexOf('_');
    const effect = trailId.substring(0, idx);
    const colorKey = trailId.substring(idx + 1);
    return { effect, colorKey };
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
        trail.forEach(point => point.life *= 0.96);
        trail = trail.filter(point => point.life > 0.04);
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
    const maxTrail = effect === 'ghost' ? 38 : effect === 'fire' ? 34 : effect === 'fractura' ? 32 : effect === 'hielo' ? 34 : effect === 'toxico' ? 36 : 28;
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
    return SKIN_RGB[id] || '0,255,231';
}

// drawTrail ya NO recibe cx,cy — los puntos tienen coords absolutas
function drawTrail() {
    if (trail.length < 2) return;

    const { effect, colorKey } = getTrailConfig();
    const skinRgb = getSkinRgb();
    const hueBase = (Date.now() * 0.18) % 360;

    for (let i = 0; i < trail.length; i++) {
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
            ctx.shadowBlur = 12 * life;
            ctx.shadowColor = rgbMode ? `hsl(${(hueBase + i * 9) % 360},100%,64%)` : `rgb(${rgb})`;
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
            ctx.shadowBlur = 16 * life;
            ctx.shadowColor = rgbMode ? `hsl(${(hueBase + i * 9) % 360},100%,70%)` : `rgb(${rgb})`;
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

        else if (effect === 'hielo') {
            ctx.save();
            ctx.globalCompositeOperation = 'screen';
            ctx.shadowBlur = 10 * life;
            ctx.shadowColor = rgbMode ? `hsl(${(hueBase + i * 9) % 360},100%,74%)` : `rgb(${rgb})`;
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
    }
}
