// =====================================================
// TRAILS.JS — Sistema de estelas de THE GEM v2
// =====================================================

const TRAIL_COLORS_RGB = {
    cyan:   '0,255,231',
    red:    '255,68,68',
    blue:   '68,136,255',
    yellow: '255,238,0',
    orange: '255,136,0',
    green:  '68,255,136',
    purple: '204,68,255',
    spark:  '255,255,0',
    rgb:    null,
};

// =====================================================
// ESTADO
// =====================================================

let trail = [];
let lastTrailPoint = null;
let cachedTrailId = null;
let cachedTrailConfig = { effect: 'solid', colorKey: 'cyan' };

const TRAIL_EFFECT_MAP = {
    'none':             'none',
    'basic':            'solid',
    'ghost':            'ghost',
    'fractura':         'fractura',
    'hielo':            'hielo',
    'toxico':           'toxico',
    'spark':            'spark',
    'trail_vampiro':    'vampiro',
    'trail_zombie':     'zombie',
    'trail_fire':       'fire',
    'trail_water':      'water',
    'trail_wind':       'wind',
    'trail_ice':        'ice',
    'trail_lava':       'lava',
    'trail_nature':     'nature',
    'trail_custom_text':'custom_text',
};

// =====================================================
// CONFIG DEL TRAIL EQUIPADO
// =====================================================

function getTrailConfig() {
    const trailId = localStorage.getItem('equippedTrail') || 'basic_cyan';
    if (trailId === cachedTrailId) return cachedTrailConfig;

    if (trailId === 'none') {
        cachedTrailId = 'none';
        cachedTrailConfig = { effect: 'none', colorKey: 'cyan' };
        return cachedTrailConfig;
    }
    if (trailId === 'spark') {
        cachedTrailId = 'spark';
        cachedTrailConfig = { effect: 'spark', colorKey: 'spark' };
        return cachedTrailConfig;
    }

    let effect = 'solid';
    let colorKey = 'cyan';

    if (TRAIL_EFFECT_MAP[trailId]) {
        effect   = TRAIL_EFFECT_MAP[trailId];
        colorKey = getTrailColorKey(trailId);
    } else {
        const idx = trailId.lastIndexOf('_');
        if (idx > 0) {
            const potentialEffect = trailId.substring(0, idx);
            const potentialColor  = trailId.substring(idx + 1);
            effect   = TRAIL_EFFECT_MAP[potentialEffect] || potentialEffect;
            colorKey = potentialColor;
        }
    }

    cachedTrailId     = trailId;
    cachedTrailConfig = { effect, colorKey };
    return cachedTrailConfig;
}

function getTrailColorKey(trailId) {
    const colorMap = {
        'ghost':            'purple',
        'fractura':         'red',
        'hielo':            'blue',
        'toxico':           'green',
        'spark':            'spark',
        'trail_vampiro':    'red',
        'trail_zombie':     'green',
        'trail_fire':       'orange',
        'trail_water':      'blue',
        'trail_wind':       'cyan',
        'trail_ice':        'blue',
        'trail_lava':       'red',
        'trail_nature':     'green',
        'trail_custom_text':'yellow',
    };
    return colorMap[trailId] || 'cyan';
}

// =====================================================
// UPDATE — llamado cada frame desde main.js
// IMPORTANTE: todos los valores aleatorios se generan
// AQUÍ (al crear el punto), nunca en drawTrail()
// =====================================================

function updateTrail() {
    const r  = window.BASE_RADIUS + window.offset;
    const cx = window.canvas.width  / (window.canvasDPR || 1) / 2;
    const cy = window.canvas.height / (window.canvasDPR || 1) / 2;
    const px = cx + Math.cos(window.angle) * r;
    const py = cy + Math.sin(window.angle) * r;

    if (lastTrailPoint && Math.hypot(px - lastTrailPoint.x, py - lastTrailPoint.y) < 1.5) {
        for (let i = trail.length - 1; i >= 0; i--) {
            trail[i].life *= 0.94;
            if (trail[i].life < 0.04) trail.splice(i, 1);
        }
        return;
    }

    lastTrailPoint = { x: px, y: py };

    // Valores aleatorios generados UNA VEZ al crear el punto
    trail.push({
        x:         px,
        y:         py,
        life:      1.0,
        seed:      Math.random(),
        spin:      (Math.random() - 0.5) * Math.PI * 2,
        shapeType: Math.floor(Math.random() * 3),
        // Para toxico/zombie/fire: posiciones fijas de partículas por punto
        rndX:      (Math.random() - 0.5),
        rndY:      (Math.random() - 0.5),
        rndX2:     (Math.random() - 0.5),
        rndY2:     (Math.random() - 0.5),
        rndSize:   Math.random(),
        rndSize2:  Math.random(),
    });

    const { effect } = getTrailConfig();
    const lowPower = window.GAME_PERF?.lowPower?.();
    const baseLengths = {
        solid: 32, glow: 38, glow_shapes: 42, spark: 45,
        ghost: 40, fractura: 38, hielo: 42, toxico: 40,
        vampiro: 38, zombie: 40, fire: 45, water: 42,
        wind: 44, ice: 42, lava: 45, nature: 40,
        custom_text: 35
    };
    let maxLen = baseLengths[effect] ?? 32;
    if (lowPower) maxLen = Math.ceil(maxLen * 0.55);
    if (trail.length > maxLen) trail.shift();

    for (let i = 0; i < trail.length; i++) {
        trail[i].life = (i + 1) / trail.length;
    }
}

// =====================================================
// RESET
// =====================================================

function resetTrail() {
    trail = [];
    lastTrailPoint = null;
    cachedTrailId  = null;
}

// =====================================================
// DRAW — llamado cada frame desde main.js
// =====================================================

function drawTrail() {
    if (trail.length < 2) return;
    const { effect, colorKey } = getTrailConfig();
    if (effect === 'none') return;

    const lowPower = window.GAME_PERF?.lowPower?.();
    const now      = window.GAME_PERF?.now || performance.now();
    const hue      = (now * 0.18) % 360;
    const rgbMode  = colorKey === 'rgb';
    const rgb      = TRAIL_COLORS_RGB[colorKey] || '0,255,231';

    function fillColor(alpha, hueShift = 0) {
        if (rgbMode) return `hsla(${(hue + hueShift) % 360},100%,65%,${alpha.toFixed(3)})`;
        return `rgba(${rgb},${alpha.toFixed(3)})`;
    }

    const step = lowPower ? 2 : 1;

    // ── 1. SOLID ────────────────────────────────────
    // Línea limpia estilo Geometry Dash: núcleo brillante + halo suave
    if (effect === 'solid') {
        // Pasada 1: halo exterior suave (sin shadowBlur, solo alpha bajo)
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        for (let i = step; i < trail.length; i += step) {
            const t    = trail[i];
            const prev = trail[i - step] || trail[0];
            const life = t.life;
            ctx.beginPath();
            ctx.moveTo(prev.x, prev.y);
            ctx.lineTo(t.x, t.y);
            ctx.strokeStyle = fillColor(life * 0.18);
            ctx.lineWidth   = 10 * life;
            ctx.lineCap     = 'round';
            ctx.stroke();
        }
        ctx.restore();

        // Pasada 2: núcleo nítido
        ctx.save();
        for (let i = step; i < trail.length; i += step) {
            const t    = trail[i];
            const prev = trail[i - step] || trail[0];
            const life = t.life;
            ctx.beginPath();
            ctx.moveTo(prev.x, prev.y);
            ctx.lineTo(t.x, t.y);
            ctx.strokeStyle = fillColor(life * 0.95);
            ctx.lineWidth   = Math.max(1, 3.5 * life);
            ctx.lineCap     = 'round';
            ctx.stroke();
        }
        ctx.restore();
    }

    // ── 2. GLOW ─────────────────────────────────────
    // Elipses orientadas con núcleo brillante — estela suave y elegante
    else if (effect === 'glow') {
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        for (let i = step; i < trail.length; i += step) {
            const t    = trail[i];
            const prev = trail[Math.max(0, i - step)];
            const next = trail[Math.min(trail.length - 1, i + step)];
            const life = t.life;
            const dx   = next.x - prev.x;
            const dy   = next.y - prev.y;
            const len  = Math.hypot(dx, dy) || 1;
            const angle = Math.atan2(dy, dx);

            // Halo exterior
            ctx.beginPath();
            ctx.ellipse(
                t.x - (dx / len) * 6 * life,
                t.y - (dy / len) * 6 * life,
                22 * life, 7 * life, angle, 0, Math.PI * 2
            );
            ctx.fillStyle = fillColor(life * 0.07, i * 4);
            ctx.fill();

            // Capa media
            ctx.beginPath();
            ctx.ellipse(
                t.x - (dx / len) * 3 * life,
                t.y - (dy / len) * 3 * life,
                13 * life, 4.5 * life, angle, 0, Math.PI * 2
            );
            ctx.fillStyle = fillColor(life * 0.14, i * 4);
            ctx.fill();

            // Núcleo
            ctx.beginPath();
            ctx.arc(t.x, t.y, 3.5 * life, 0, Math.PI * 2);
            ctx.fillStyle = fillColor(life * 0.7, i * 4);
            ctx.fill();
        }
        ctx.restore();
    }

    // ── 3. GLOW + SHAPES ────────────────────────────
    else if (effect === 'glow_shapes') {
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        for (let i = step; i < trail.length; i += step) {
            const t    = trail[i];
            const prev = trail[Math.max(0, i - step)];
            const next = trail[Math.min(trail.length - 1, i + step)];
            const life = t.life;
            const dx   = next.x - prev.x;
            const dy   = next.y - prev.y;
            const len  = Math.hypot(dx, dy) || 1;
            const angle = Math.atan2(dy, dx);

            ctx.beginPath();
            ctx.ellipse(
                t.x - (dx / len) * 6 * life,
                t.y - (dy / len) * 6 * life,
                20 * life, 6 * life, angle, 0, Math.PI * 2
            );
            ctx.fillStyle = fillColor(life * 0.06, i * 4);
            ctx.fill();

            ctx.beginPath();
            ctx.ellipse(
                t.x - (dx / len) * 3 * life,
                t.y - (dy / len) * 3 * life,
                11 * life, 4 * life, angle, 0, Math.PI * 2
            );
            ctx.fillStyle = fillColor(life * 0.12, i * 4);
            ctx.fill();

            ctx.beginPath();
            ctx.arc(t.x, t.y, 3 * life, 0, Math.PI * 2);
            ctx.fillStyle = fillColor(life * 0.6, i * 4);
            ctx.fill();

            if (t.seed > 0.45 && i % 2 === 0) {
                const nx    = -dy / len;
                const ny    =  dx / len;
                const side  = t.seed > 0.5 ? 1 : -1;
                const dist  = (6 + t.seed * 10) * life;
                const shapeX = t.x + nx * dist * side;
                const shapeY = t.y + ny * dist * side;
                const size  = (5 + t.seed * 6) * life;
                const rot   = t.spin + now * 0.002 * (t.seed > 0.5 ? 1 : -1);

                ctx.save();
                ctx.fillStyle   = fillColor(life * 0.7, i * 6);
                ctx.strokeStyle = fillColor(life * 0.4, i * 6);
                ctx.lineWidth   = 1;
                ctx.translate(shapeX, shapeY);
                ctx.rotate(rot);
                ctx.beginPath();
                if (t.shapeType === 0) {
                    ctx.arc(0, 0, size, 0, Math.PI * 2);
                } else if (t.shapeType === 1) {
                    ctx.rect(-size, -size, size * 2, size * 2);
                } else {
                    ctx.moveTo(0, -size * 1.2);
                    ctx.lineTo( size, size * 0.8);
                    ctx.lineTo(-size, size * 0.8);
                    ctx.closePath();
                }
                ctx.fill();
                ctx.stroke();
                ctx.restore();
            }
        }
        ctx.restore();
    }

    // ── 4. SPARK/ELECTRICIDAD ───────────────────────
    // FIX RENDIMIENTO: shadowBlur solo en el núcleo (no en cada rayo)
    // Los rayos se actualizan ~12fps con seed estable
    else if (effect === 'spark') {
        // Estela base suave
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        for (let i = step; i < trail.length; i += step) {
            const t    = trail[i];
            const prev = trail[Math.max(0, i - step)];
            const life = t.life;
            ctx.beginPath();
            ctx.moveTo(prev.x, prev.y);
            ctx.lineTo(t.x, t.y);
            ctx.strokeStyle = `rgba(255,255,120,${life * 0.3})`;
            ctx.lineWidth   = 2.5 * life;
            ctx.lineCap     = 'round';
            ctx.stroke();
        }
        ctx.restore();

        // Rayos desde la bolita — seed estable por frame (~12fps para los rayos)
        const ball = trail[trail.length - 1];
        if (!ball) return;

        const frameSeed = Math.floor(now * 0.012);
        const rng = (n) => {
            let x = Math.sin(frameSeed * 127.1 + n * 311.7) * 43758.5453;
            return x - Math.floor(x);
        };

        // Rayos sin shadowBlur — el glow lo da el 'lighter' compositing
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        const rayCount = lowPower ? 3 : 5;
        for (let r = 0; r < rayCount; r++) {
            const baseAngle = rng(r * 7) * Math.PI * 2;
            const rayLen    = 20 + rng(r * 3 + 1) * 30;
            const segments  = 3 + Math.floor(rng(r * 5 + 2) * 3);
            const alpha     = 0.5 + rng(r * 11) * 0.4;

            ctx.strokeStyle = `rgba(255,255,${Math.floor(rng(r)*80+150)},${alpha})`;
            ctx.lineWidth   = 1 + rng(r * 2) * 0.8;
            ctx.lineCap     = 'round';
            ctx.lineJoin    = 'round';

            ctx.beginPath();
            ctx.moveTo(ball.x, ball.y);
            let bx = ball.x, by = ball.y;
            for (let s = 1; s <= segments; s++) {
                const tt   = s / segments;
                const ex   = ball.x + Math.cos(baseAngle) * rayLen * tt;
                const ey   = ball.y + Math.sin(baseAngle) * rayLen * tt;
                const perp = baseAngle + Math.PI / 2;
                const dev  = (rng(r * 13 + s) - 0.5) * 16 * (1 - tt * 0.5);
                bx = ex + Math.cos(perp) * dev;
                by = ey + Math.sin(perp) * dev;
                ctx.lineTo(bx, by);
            }
            ctx.stroke();
        }
        ctx.restore();

        // Núcleo brillante — shadowBlur SOLO aquí (1 vez por frame)
        if (!lowPower) {
            ctx.save();
            ctx.globalCompositeOperation = 'lighter';
            ctx.shadowBlur  = 16;
            ctx.shadowColor = 'rgba(255,255,80,1)';
            const grd = ctx.createRadialGradient(ball.x, ball.y, 0, ball.x, ball.y, 12);
            grd.addColorStop(0, 'rgba(255,255,255,0.9)');
            grd.addColorStop(0.4, 'rgba(255,255,80,0.6)');
            grd.addColorStop(1,   'rgba(255,200,0,0)');
            ctx.fillStyle = grd;
            ctx.beginPath();
            ctx.arc(ball.x, ball.y, 12, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }

    // ── 5. GHOST ────────────────────────────────────
    // Humo espectral: nubes borrosas que derivan hacia arriba
    else if (effect === 'ghost') {
        ctx.save();
        // Sin 'lighter' para que el humo se vea opaco/suave, no brillante
        for (let i = step; i < trail.length; i += step) {
            const t    = trail[i];
            const life = t.life;
            // Deriva hacia arriba basada en cuánto ha vivido el punto (1-life = envejecimiento)
            const age    = 1 - life;
            const driftY = age * 22 * t.seed;          // sube más cuanto más viejo
            const driftX = (t.seed - 0.5) * 8 * age;  // pequeña deriva lateral (determinista)
            const cx     = t.x + driftX;
            const cy     = t.y - driftY;
            // Radio crece al envejecer (el humo se expande)
            const r = (5 + age * 14) * life;

            // Gradiente radial suave — aspecto de nube de humo
            const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
            const a0  = life * 0.45;
            const a1  = life * 0.18;
            if (rgbMode) {
                grd.addColorStop(0,   `hsla(${(hue + i * 6) % 360},60%,80%,${a0.toFixed(3)})`);
                grd.addColorStop(0.5, `hsla(${(hue + i * 6) % 360},50%,70%,${(a0*0.5).toFixed(3)})`);
                grd.addColorStop(1,   `hsla(${(hue + i * 6) % 360},40%,60%,0)`);
            } else {
                grd.addColorStop(0,   `rgba(${rgb},${a0.toFixed(3)})`);
                grd.addColorStop(0.5, `rgba(${rgb},${(a0*0.5).toFixed(3)})`);
                grd.addColorStop(1,   `rgba(${rgb},0)`);
            }
            ctx.beginPath();
            ctx.arc(cx, cy, r, 0, Math.PI * 2);
            ctx.fillStyle = grd;
            ctx.fill();
        }
        ctx.restore();
    }

    // ── 6. FRACTURA ─────────────────────────────────
    // Líneas quebradas desplazadas — como cristal rompiéndose
    else if (effect === 'fractura') {
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        for (let i = step; i < trail.length; i += step) {
            const t    = trail[i];
            const prev = trail[Math.max(0, i - step)];
            const life = t.life;

            // 3 líneas desplazadas con diferentes alphas
            const offsets = [
                { ox: -4 * t.seed, oy:  2 * t.seed, a: 0.9 },
                { ox:  0,           oy:  0,           a: 0.5 },
                { ox:  3 * t.seed, oy: -3 * t.seed, a: 0.7 },
            ];
            for (const o of offsets) {
                ctx.beginPath();
                ctx.moveTo(prev.x + o.ox * life, prev.y + o.oy * life);
                ctx.lineTo(t.x   + o.ox * life, t.y   + o.oy * life);
                ctx.strokeStyle = fillColor(life * o.a);
                ctx.lineWidth   = (o.a === 0.9 ? 2.5 : 1.2) * life;
                ctx.lineCap     = 'square';
                ctx.stroke();
            }
        }
        ctx.restore();
    }

    // ── 7. HIELO ────────────────────────────────────
    // Cristales hexagonales con líneas de escarcha
    else if (effect === 'hielo') {
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        for (let i = step; i < trail.length; i += step) {
            const t    = trail[i];
            const life = t.life;

            // Solo dibujar hex en puntos alternos para no saturar
            if (i % 2 === 0) {
                const size = 7 * life;
                const rotation = t.spin + now * 0.0005;
                ctx.save();
                ctx.translate(t.x, t.y);
                ctx.rotate(rotation);
                ctx.beginPath();
                for (let j = 0; j < 6; j++) {
                    const a = (j / 6) * Math.PI * 2;
                    j === 0
                        ? ctx.moveTo(Math.cos(a) * size, Math.sin(a) * size)
                        : ctx.lineTo(Math.cos(a) * size, Math.sin(a) * size);
                }
                ctx.closePath();
                ctx.strokeStyle = fillColor(life * 0.8);
                ctx.lineWidth   = 1.2 * life;
                ctx.stroke();
                // Cruz interior
                ctx.beginPath();
                ctx.moveTo(-size, 0); ctx.lineTo(size, 0);
                ctx.moveTo(0, -size); ctx.lineTo(0, size);
                ctx.strokeStyle = fillColor(life * 0.3);
                ctx.lineWidth   = 0.8 * life;
                ctx.stroke();
                ctx.restore();
            } else {
                // Puntos entre hex — núcleo pequeño
                ctx.beginPath();
                ctx.arc(t.x, t.y, 2 * life, 0, Math.PI * 2);
                ctx.fillStyle = fillColor(life * 0.5);
                ctx.fill();
            }
        }
        ctx.restore();
    }

    // ── 8. TOXICO ───────────────────────────────────
    // FIX: sin Math.random() en draw — usa rndX/rndY del punto
    else if (effect === 'toxico') {
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        for (let i = step; i < trail.length; i += step) {
            const t    = trail[i];
            const life = t.life;

            // Burbuja 1 — posición fija (generada al crear el punto)
            const b1x = t.x + t.rndX * 12 * life;
            const b1y = t.y + t.rndY * 12 * life;
            const b1r = (2 + t.rndSize * 3.5) * life;
            ctx.beginPath();
            ctx.arc(b1x, b1y, b1r, 0, Math.PI * 2);
            ctx.fillStyle = fillColor(life * 0.45);
            ctx.strokeStyle = fillColor(life * 0.7);
            ctx.lineWidth = 0.8 * life;
            ctx.fill();
            ctx.stroke();

            // Burbuja 2
            if (!lowPower) {
                const b2x = t.x + t.rndX2 * 10 * life;
                const b2y = t.y + t.rndY2 * 10 * life;
                const b2r = (1.5 + t.rndSize2 * 2.5) * life;
                ctx.beginPath();
                ctx.arc(b2x, b2y, b2r, 0, Math.PI * 2);
                ctx.fillStyle = fillColor(life * 0.3);
                ctx.fill();
            }
        }
        ctx.restore();
    }

    // ── 9. VAMPIRO ──────────────────────────────────
    // Gotas de sangre con caída determinista
    else if (effect === 'vampiro') {
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        for (let i = step; i < trail.length; i += step) {
            const t    = trail[i];
            const life = t.life;
            // Caída basada en seed del punto (determinista, sin random en draw)
            const dropOffset = (t.seed * 8) * (1 - life);
            const dropSize   = 4 * life;
            const dropY = t.y + dropOffset;

            ctx.beginPath();
            ctx.moveTo(t.x, dropY - dropSize);
            ctx.quadraticCurveTo(t.x - dropSize, dropY, t.x, dropY + dropSize);
            ctx.quadraticCurveTo(t.x + dropSize, dropY, t.x, dropY - dropSize);
            ctx.fillStyle = fillColor(life * 0.85);
            ctx.fill();

            // Línea de rastro arriba
            ctx.beginPath();
            ctx.moveTo(t.x, dropY - dropSize);
            ctx.lineTo(t.x, t.y - dropOffset * 0.5 - dropSize);
            ctx.strokeStyle = fillColor(life * 0.4);
            ctx.lineWidth = 1 * life;
            ctx.stroke();
        }
        ctx.restore();
    }

    // ── 10. ZOMBIE ──────────────────────────────────
    // FIX: sin Math.random() en draw
    else if (effect === 'zombie') {
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        for (let i = step; i < trail.length; i += step) {
            const t    = trail[i];
            const life = t.life;

            // 3 partículas con posiciones fijas del punto
            const pts = [
                { x: t.x + t.rndX  * 18 * life, y: t.y + t.rndY  * 18 * life, r: (1.5 + t.rndSize  * 2.5) * life },
                { x: t.x + t.rndX2 * 14 * life, y: t.y + t.rndY2 * 14 * life, r: (1 + t.rndSize2 * 2) * life },
                { x: t.x + t.seed  *  8 * life - 4 * life, y: t.y - t.seed * 10 * life, r: 1.5 * life },
            ];
            for (const p of pts) {
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = fillColor(life * 0.6);
                ctx.fill();
            }
        }
        ctx.restore();
    }

    // ── 11. FIRE ────────────────────────────────────
    // FIX: flicker usa seed del punto, no random en draw
    else if (effect === 'fire') {
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        for (let i = step; i < trail.length; i += step) {
            const t    = trail[i];
            const life = t.life;
            const flameH = (8 + t.rndSize * 10) * life;
            const flameW = 5 * life;
            // Flicker basado en seed + tiempo (determinista por punto)
            const flicker = Math.sin(now * 0.008 + t.seed * 6.28) * 2.5 * t.rndX;

            ctx.beginPath();
            ctx.moveTo(t.x - flameW * 0.5, t.y);
            ctx.quadraticCurveTo(t.x + flicker, t.y - flameH, t.x + flameW * 0.5, t.y);
            ctx.fillStyle = fillColor(life * 0.75);
            ctx.fill();

            // Núcleo más brillante
            ctx.beginPath();
            ctx.moveTo(t.x - flameW * 0.25, t.y);
            ctx.quadraticCurveTo(t.x + flicker * 0.5, t.y - flameH * 0.6, t.x + flameW * 0.25, t.y);
            ctx.fillStyle = `rgba(255,255,200,${life * 0.5})`;
            ctx.fill();
        }
        ctx.restore();
    }

    // ── 12. WATER ───────────────────────────────────
    // Anillos de agua que se expanden — más dinámico
    else if (effect === 'water') {
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        for (let i = step; i < trail.length; i += step) {
            const t    = trail[i];
            const life = t.life;
            // El anillo se expande conforme el punto envejece (1 - life)
            const expand = (1 - life) * 14;
            const r1 = (5 + expand) * life;
            const r2 = r1 * 0.55;

            ctx.beginPath();
            ctx.arc(t.x, t.y, r1, 0, Math.PI * 2);
            ctx.strokeStyle = fillColor(life * 0.45);
            ctx.lineWidth   = 1.8 * life;
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(t.x, t.y, r2, 0, Math.PI * 2);
            ctx.strokeStyle = fillColor(life * 0.65);
            ctx.lineWidth   = 1.2 * life;
            ctx.stroke();
        }
        ctx.restore();
    }

    // ── 13. WIND ────────────────────────────────────
    // Líneas curvas orientadas al movimiento
    else if (effect === 'wind') {
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        for (let i = step; i < trail.length; i += step) {
            const t    = trail[i];
            const prev = trail[Math.max(0, i - step)];
            const life = t.life;
            const windLen  = 18 * life;
            const windAngle = Math.atan2(t.y - prev.y, t.x - prev.x) + Math.PI / 4;

            // 2 líneas paralelas con offset basado en seed
            for (let w = 0; w < 2; w++) {
                const sideOff = (w === 0 ? 1 : -1) * 3 * t.seed * life;
                const perpAngle = windAngle + Math.PI / 2;
                const sx = t.x + Math.cos(perpAngle) * sideOff;
                const sy = t.y + Math.sin(perpAngle) * sideOff;
                ctx.beginPath();
                ctx.moveTo(sx, sy);
                ctx.lineTo(
                    sx + Math.cos(windAngle) * windLen,
                    sy + Math.sin(windAngle) * windLen
                );
                ctx.strokeStyle = fillColor(life * (w === 0 ? 0.55 : 0.35));
                ctx.lineWidth   = (w === 0 ? 1.8 : 1) * life;
                ctx.lineCap     = 'round';
                ctx.stroke();
            }
        }
        ctx.restore();
    }

    // ── 14. ICE (ELEMENTO) ──────────────────────────
    // Escarcha en 4 direcciones — más visible que el hielo
    else if (effect === 'ice') {
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        for (let i = step; i < trail.length; i += step) {
            const t    = trail[i];
            const life = t.life;
            const frostSize = (4 + t.seed * 5) * life;
            // 4 puntas de escarcha con ángulo basado en seed del punto
            for (let f = 0; f < 4; f++) {
                const a = (f / 4) * Math.PI * 2 + t.spin;
                ctx.beginPath();
                ctx.moveTo(t.x, t.y);
                ctx.lineTo(
                    t.x + Math.cos(a) * frostSize,
                    t.y + Math.sin(a) * frostSize
                );
                // Puntita extra
                const a2 = a + 0.4;
                ctx.lineTo(
                    t.x + Math.cos(a2) * frostSize * 0.5,
                    t.y + Math.sin(a2) * frostSize * 0.5
                );
                ctx.strokeStyle = fillColor(life * 0.65);
                ctx.lineWidth   = 1.2 * life;
                ctx.lineCap     = 'round';
                ctx.stroke();
            }
        }
        ctx.restore();
    }

    // ── 15. LAVA ────────────────────────────────────
    // Burbujas de lava con tamaño determinista
    else if (effect === 'lava') {
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        for (let i = step; i < trail.length; i += step) {
            const t    = trail[i];
            const life = t.life;
            // Tamaño oscila con tiempo pero seed fija la base (sin random en draw)
            const bubbleSize = (4 + t.rndSize * 4 + Math.sin(now * 0.004 + t.seed * 6.28) * 1.5) * life;

            ctx.beginPath();
            ctx.arc(t.x, t.y, bubbleSize, 0, Math.PI * 2);
            ctx.fillStyle = fillColor(life * 0.8);
            ctx.fill();

            // Halo caliente
            ctx.beginPath();
            ctx.arc(t.x, t.y, bubbleSize * 1.7, 0, Math.PI * 2);
            ctx.fillStyle = fillColor(life * 0.15);
            ctx.fill();
        }
        ctx.restore();
    }

    // ── 16. NATURE ──────────────────────────────────
    // Hojas elípticas con rotación suave
    else if (effect === 'nature') {
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        for (let i = step; i < trail.length; i += step) {
            const t    = trail[i];
            const life = t.life;
            const leafSize = (4 + t.rndSize * 4) * life;
            // Rotación basada en seed + tiempo (determinista, sin random en draw)
            const rotation = t.spin + now * 0.0015 * (t.seed > 0.5 ? 1 : -1);

            ctx.save();
            ctx.translate(t.x, t.y);
            ctx.rotate(rotation);
            ctx.beginPath();
            ctx.ellipse(0, 0, leafSize, leafSize * 0.45, 0, 0, Math.PI * 2);
            ctx.fillStyle = fillColor(life * 0.65);
            ctx.fill();
            // Nervio central
            ctx.beginPath();
            ctx.moveTo(-leafSize, 0);
            ctx.lineTo(leafSize, 0);
            ctx.strokeStyle = fillColor(life * 0.35);
            ctx.lineWidth = 0.7 * life;
            ctx.stroke();
            ctx.restore();
        }
        ctx.restore();
    }

    // ── 17. CUSTOM_TEXT ─────────────────────────────
    else if (effect === 'custom_text') {
        const customText = localStorage.getItem('customTrailText') || '★';
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        for (let i = step; i < trail.length; i += step) {
            const t    = trail[i];
            const life = t.life;
            ctx.font          = `${11 * life}px monospace`;
            ctx.textAlign     = 'center';
            ctx.textBaseline  = 'middle';
            ctx.fillStyle     = fillColor(life * 0.85);
            ctx.fillText(customText, t.x, t.y);
        }
        ctx.restore();
    }

    // ── DEFAULT: SOLID ───────────────────────────────
    else {
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        for (let i = step; i < trail.length; i += step) {
            const t    = trail[i];
            const prev = trail[Math.max(0, i - step)];
            const life = t.life;
            ctx.beginPath();
            ctx.moveTo(prev.x, prev.y);
            ctx.lineTo(t.x, t.y);
            ctx.strokeStyle = fillColor(life * 0.9);
            ctx.lineWidth   = Math.max(1, 4 * life);
            ctx.lineCap     = 'round';
            ctx.stroke();
        }
        ctx.restore();
    }
}

// =====================================================
// PARTICLE SYSTEM
// =====================================================

let particles     = [];
let floatingTexts = [];

function createParticles(x, y, color, count, options = {}) {
    const { vx = 0, vy = 0, life = 30, size = 4 } = options;
    for (let i = 0; i < count; i++) {
        const a     = Math.random() * Math.PI * 2;
        const speed = Math.random() * 2 + 1;
        particles.push({
            x, y,
            vx: vx + Math.cos(a) * speed,
            vy: vy + Math.sin(a) * speed,
            life:    life + Math.random() * 10,
            maxLife: life + Math.random() * 10,
            color,
            size: size + Math.random() * 2,
        });
    }
}

function showFloatingText(text, color, size) {
    const r  = window.BASE_RADIUS + window.offset;
    const cx = window.canvas.width  / 2;
    const cy = window.canvas.height / 2;
    floatingTexts.push({
        text, color, size,
        x: cx + Math.cos(window.angle) * r,
        y: cy + Math.sin(window.angle) * r,
        life: 60,
        vy: -2,
    });
}

function updateAndDrawParticles() {
    const ctx = window.ctx;

    for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x  += p.vx;
        p.y  += p.vy;
        p.vx *= 0.95;
        p.vy *= 0.95;
        p.life--;
        if (p.life <= 0) { particles.splice(i, 1); continue; }
        const alpha = p.life / p.maxLife;
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle   = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * alpha, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    for (let i = floatingTexts.length - 1; i >= 0; i--) {
        const ft = floatingTexts[i];
        ft.y += ft.vy;
        ft.life--;
        if (ft.life <= 0) { floatingTexts.splice(i, 1); continue; }
        const alpha = Math.min(1, ft.life / 20);
        ctx.save();
        ctx.globalAlpha     = alpha;
        ctx.fillStyle       = ft.color;
        ctx.font            = `900 ${ft.size}px Geom, monospace`;
        ctx.textAlign       = 'center';
        ctx.textBaseline    = 'middle';
        ctx.shadowColor     = ft.color;
        ctx.shadowBlur      = 10;
        ctx.fillText(ft.text, ft.x, ft.y);
        ctx.restore();
    }
}

window.createParticles        = createParticles;
window.showFloatingText       = showFloatingText;
window.updateAndDrawParticles = updateAndDrawParticles;

// =====================================================
// PREVIEW DE TRAILS — para inventario y tienda VIP
// Llamada desde shop.js: drawPreviewTrailPoint(ctx, p, trailId, rgb, colorId)
// p = { x, y, life, seed }  |  ctx.__previewNow = timestamp
// =====================================================

window.drawPreviewTrailPoint = function(ctx, p, trailId, rgb, colorId) {
    const life = Math.max(0, p.life);
    if (life <= 0) return;

    const now     = ctx.__previewNow || performance.now();
    const rgbMode = colorId === 'rgb';
    const hue     = (now * 0.18) % 360;

    function fc(alpha, hShift = 0) {
        if (rgbMode) return `hsla(${(hue + hShift) % 360},100%,65%,${alpha.toFixed(3)})`;
        return `rgba(${rgb},${alpha.toFixed(3)})`;
    }

    // Mapear trailId → effect (igual que TRAIL_EFFECT_MAP)
    const effectMap = {
        'none': 'none', 'basic': 'solid', 'ghost': 'ghost',
        'fractura': 'fractura', 'hielo': 'hielo', 'toxico': 'toxico',
        'spark': 'spark', 'trail_vampiro': 'vampiro', 'trail_zombie': 'zombie',
        'trail_fire': 'fire', 'trail_water': 'water', 'trail_wind': 'wind',
        'trail_ice': 'ice', 'trail_lava': 'lava', 'trail_nature': 'nature',
        'trail_custom_text': 'custom_text',
    };
    // Para trails con formato effect_color (ej: glow_cyan)
    let effect = effectMap[trailId] || trailId.split('_').slice(0, -1).join('_') || 'solid';
    if (effect === trailId) effect = 'solid'; // fallback

    const seed  = p.seed  ?? 0.5;
    const age   = 1 - life;

    ctx.save();
    ctx.globalCompositeOperation = 'lighter';

    if (effect === 'none') {
        // nada
    }
    else if (effect === 'solid' || effect === 'glow' || effect === 'glow_shapes') {
        // Halo + núcleo
        ctx.beginPath();
        ctx.arc(p.x, p.y, 8 * life, 0, Math.PI * 2);
        ctx.fillStyle = fc(life * 0.15);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3 * life, 0, Math.PI * 2);
        ctx.fillStyle = fc(life * 0.9);
        ctx.fill();
    }
    else if (effect === 'ghost') {
        // Humo: nube radial que deriva hacia arriba
        ctx.globalCompositeOperation = 'source-over';
        const driftY = age * 18 * seed;
        const driftX = (seed - 0.5) * 6 * age;
        const cx = p.x + driftX;
        const cy = p.y - driftY;
        const r  = (4 + age * 12) * life;
        const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
        grd.addColorStop(0, rgbMode ? `hsla(${hue},60%,80%,${(life*0.4).toFixed(2)})` : `rgba(${rgb},${(life*0.4).toFixed(2)})`);
        grd.addColorStop(1, rgbMode ? `hsla(${hue},40%,60%,0)` : `rgba(${rgb},0)`);
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();
    }
    else if (effect === 'fractura') {
        const off = seed * 5;
        for (let s = 0; s < 3; s++) {
            const o = (s - 1) * off * life;
            ctx.beginPath();
            ctx.arc(p.x + o, p.y + o, 2.5 * life, 0, Math.PI * 2);
            ctx.fillStyle = fc(life * (s === 0 ? 0.9 : 0.5));
            ctx.fill();
        }
    }
    else if (effect === 'hielo') {
        const size = 6 * life;
        const rot  = seed * Math.PI + now * 0.0005;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(rot);
        ctx.beginPath();
        for (let j = 0; j < 6; j++) {
            const a = (j / 6) * Math.PI * 2;
            j === 0 ? ctx.moveTo(Math.cos(a)*size, Math.sin(a)*size)
                    : ctx.lineTo(Math.cos(a)*size, Math.sin(a)*size);
        }
        ctx.closePath();
        ctx.strokeStyle = fc(life * 0.85);
        ctx.lineWidth = 1.2 * life;
        ctx.stroke();
        ctx.restore();
    }
    else if (effect === 'toxico') {
        const bx = p.x + (seed - 0.5) * 10 * life;
        const by = p.y + (seed * 0.7 - 0.35) * 10 * life;
        ctx.beginPath();
        ctx.arc(bx, by, (2 + seed * 3) * life, 0, Math.PI * 2);
        ctx.fillStyle = fc(life * 0.6);
        ctx.fill();
    }
    else if (effect === 'spark') {
        // Mini rayo desde el punto
        const len = 14 * life;
        const a = seed * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x + Math.cos(a) * len, p.y + Math.sin(a) * len);
        ctx.strokeStyle = `rgba(255,255,150,${life * 0.8})`;
        ctx.lineWidth = 1.5 * life;
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3 * life, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,200,${life * 0.9})`;
        ctx.fill();
    }
    else if (effect === 'vampiro') {
        const ds = 4 * life;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y - ds);
        ctx.quadraticCurveTo(p.x - ds, p.y, p.x, p.y + ds);
        ctx.quadraticCurveTo(p.x + ds, p.y, p.x, p.y - ds);
        ctx.fillStyle = fc(life * 0.85);
        ctx.fill();
    }
    else if (effect === 'zombie') {
        for (let z = 0; z < 2; z++) {
            const zx = p.x + (z === 0 ? seed - 0.5 : 0.5 - seed) * 12 * life;
            const zy = p.y + (z === 0 ? seed * 0.6 : -seed * 0.4) * 12 * life;
            ctx.beginPath();
            ctx.arc(zx, zy, (1.5 + seed * 2) * life, 0, Math.PI * 2);
            ctx.fillStyle = fc(life * 0.6);
            ctx.fill();
        }
    }
    else if (effect === 'fire') {
        const fh = (6 + seed * 8) * life;
        ctx.beginPath();
        ctx.moveTo(p.x - 3 * life, p.y);
        ctx.quadraticCurveTo(p.x, p.y - fh, p.x + 3 * life, p.y);
        ctx.fillStyle = fc(life * 0.75);
        ctx.fill();
        // núcleo blanco-amarillo
        ctx.beginPath();
        ctx.arc(p.x, p.y - fh * 0.2, 2 * life, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,200,${life * 0.6})`;
        ctx.fill();
    }
    else if (effect === 'water') {
        const expand = age * 10;
        ctx.beginPath();
        ctx.arc(p.x, p.y, (4 + expand) * life, 0, Math.PI * 2);
        ctx.strokeStyle = fc(life * 0.5);
        ctx.lineWidth = 1.5 * life;
        ctx.stroke();
    }
    else if (effect === 'wind') {
        const wl = 14 * life;
        const wa = seed * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x + Math.cos(wa) * wl, p.y + Math.sin(wa) * wl);
        ctx.strokeStyle = fc(life * 0.55);
        ctx.lineWidth = 1.5 * life;
        ctx.lineCap = 'round';
        ctx.stroke();
    }
    else if (effect === 'ice') {
        const fs = (3 + seed * 4) * life;
        const spin = seed * Math.PI;
        for (let f = 0; f < 4; f++) {
            const a = (f / 4) * Math.PI * 2 + spin;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p.x + Math.cos(a) * fs, p.y + Math.sin(a) * fs);
            ctx.strokeStyle = fc(life * 0.65);
            ctx.lineWidth = 1.2 * life;
            ctx.stroke();
        }
    }
    else if (effect === 'lava') {
        const bs = (3 + seed * 4 + Math.sin(now * 0.004 + seed * 6) * 1.5) * life;
        ctx.beginPath();
        ctx.arc(p.x, p.y, bs, 0, Math.PI * 2);
        ctx.fillStyle = fc(life * 0.8);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(p.x, p.y, bs * 1.8, 0, Math.PI * 2);
        ctx.fillStyle = fc(life * 0.15);
        ctx.fill();
    }
    else if (effect === 'nature') {
        const ls = (3 + seed * 4) * life;
        const rot = seed * Math.PI * 2 + now * 0.001;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(rot);
        ctx.beginPath();
        ctx.ellipse(0, 0, ls, ls * 0.45, 0, 0, Math.PI * 2);
        ctx.fillStyle = fc(life * 0.65);
        ctx.fill();
        ctx.restore();
    }
    else if (effect === 'custom_text') {
        const txt = localStorage.getItem('customTrailText') || '★';
        ctx.globalCompositeOperation = 'source-over';
        ctx.font = `${10 * life}px monospace`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = fc(life * 0.85);
        ctx.fillText(txt, p.x, p.y);
    }
    else {
        // Fallback: punto sólido
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3 * life, 0, Math.PI * 2);
        ctx.fillStyle = fc(life * 0.9);
        ctx.fill();
    }

    ctx.restore();
};
