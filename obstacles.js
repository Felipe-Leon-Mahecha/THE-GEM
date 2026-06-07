// =====================================================
// SPAWN OBSTACLES
// =====================================================

const SIERRA_SIZE = 88;
const SIERRA_WARNING_START_ANGLE = 0.08;
const SIERRA_TRAVEL_ANGLE = 0.5;

function getObstacleBaseRadius(fromGround) {
    const config = window.getCurrentLevelConfig ? window.getCurrentLevelConfig() : {};
    const inset = config.ringInset || 0;
    return fromGround
        ? window.BASE_RADIUS
        : window.DOME_RADIUS - inset;
}

function spawnObstacleGroup() {
    const config = window.getCurrentLevelConfig ? window.getCurrentLevelConfig() : {};
    if (config.obstacles && !config.obstacles.spikes) return;

    let count =
        1 + Math.floor(Math.random() * 3);

    let baseAngle =
        angle +
        worldRotation +
        Math.PI * (0.6 + Math.random() * 0.4);

    let spacing = 0.18;

    for (let i = 0; i < count; i++) {

        let a =
            baseAngle +
            (i - (count - 1) / 2) * spacing;

        if (window.isAngleInsideLethalZone?.(a)) continue;

        let blocked =
            obstacles.some(o =>
                Math.abs(o.angle - a) < 0.15
            );

        if (blocked) continue;

        obstacles.push({

            angle: a,

            width: 0.12,

            height:
                (DOME_RADIUS - BASE_RADIUS) * 0.18,

            life: 180,

            progress: 0,

            state: "warning",

            warning: true,

            warningTime: 45,

            fromGround:
                config.ringInset > 0 ? false : Math.random() < 0.5,

            color: config.theme === "frozen" ? "#a9efff" : (config.ringInset > 0 ? "#c8c8c8" : "#ff2f92"),
            proximityChecked: false // Nueva bandera para el sistema de near miss
        });
    }
}

// =====================================================
// COLLISIONS
// =====================================================

function checkCollisions() {

    if (window.invulnerable || window.isPowerupInvulnerable?.()) return;

    let r = window.BASE_RADIUS + window.offset; // Posición radial del jugador

    for (let o of window.obstacles) {

        if (o.warning) continue;

        if (o.progress < 0.9) continue; // Solo cuando el obstáculo es "activo"

        let obstacleAngle =
            o.angle + window.worldRotation;

        let rel =
            ((obstacleAngle - window.angle + Math.PI * 2)
                % (Math.PI * 2));

        if (rel > Math.PI)
            rel -= Math.PI * 2;

        const baseR = getObstacleBaseRadius(o.fromGround);
        let from =
            o.fromGround
                ? baseR
                : baseR - o.height * o.progress;

        let to =
            o.fromGround
                ? baseR + o.height * o.progress
                : baseR;

        // Determinar si hay colisión
        const collisionAngularThreshold = o.width * 0.75;
        const collisionRadialThreshold = 5; // Margen de colisión en píxeles

        const isCollisionAngular = Math.abs(rel) <= collisionAngularThreshold;
        const isCollisionRadial = (r > from - collisionRadialThreshold && r < to + collisionRadialThreshold);

        if (isCollisionAngular && isCollisionRadial) {
            playerHit();
            o.proximityChecked = true; // Si hay hit, también lo marcamos para no disparar near miss
            return; // Colisión, no hay near miss
        }

        // Si no hay colisión, verificar near miss (solo una vez por obstáculo)
        if (!o.proximityChecked && o.progress >= 0.95 && window.onNearMiss) { 
            const angularDistance = Math.abs(rel);
            // Distancia al borde más cercano del obstáculo radialmente
            const radialDistanceToClosestEdge = Math.min(Math.abs(r - (from - collisionRadialThreshold)), Math.abs(r - (to + collisionRadialThreshold)));

            const isAngularNearMiss = angularDistance < (collisionAngularThreshold + window.NEAR_MISS_ANGULAR_THRESHOLD);
            const isRadialNearMiss = radialDistanceToClosestEdge < window.SPIKE_NEAR_MISS_RADIAL_MARGIN;
            
            if (isAngularNearMiss && isRadialNearMiss) {
                const isPerfect = window.checkPerfectDodge?.(obstacleAngle, window.angle);
                window.onNearMiss(isPerfect);
                o.proximityChecked = true; // Marcar como verificado para no repetir
            }
        }
    }
}

// =====================================================
// PLAYER HIT
// =====================================================

function playerHit() {
    if (window.absorbPowerupHit?.()) return;
    window.lives--;
    window.hitFlash = 1;
    window.invulnerable = true;
    window.invulnerableTimer = 60;`n    `n    // Resetear combo cuando es golpeado`n    window.resetComboOnHit?.();

    if (window.lives <= 0) {
        if (typeof window.showGameOverWithRevive === 'function') {
            window.showGameOverWithRevive();
            return;
        }
    }
}

// =====================================================
// SIERRA GIRATORIA
// =====================================================

const sierraImg = new Image();
sierraImg.src = "assets/Imagenes/Obstaculos/Sierra_Metalica.png";

function spawnSierra() {
    const config = window.getCurrentLevelConfig ? window.getCurrentLevelConfig() : {};
    if (!config.obstacles || !config.obstacles.saws) return;

    let fromGround = Math.random() < 0.5;
    let a = Math.random() * Math.PI * 2;
    let dir = Math.random() < 0.5 ? 1 : -1;

    for (let tries = 0; tries < 12; tries++) {
        const blockedBySpike = window.obstacles.some(o => {
            let rel = Math.abs(((o.angle - a + Math.PI * 3) % (Math.PI * 2)) - Math.PI);
            return rel < 0.34;
        });

        const blockedBySierra = window.sierras.some(s => {
            let rel = Math.abs(((s.angle - a + Math.PI * 3) % (Math.PI * 2)) - Math.PI);
            return rel < 0.5;
        });

        if (!blockedBySpike && !blockedBySierra) break;
        a = Math.random() * Math.PI * 2;
    }

    window.sierras.push({
        angle: a,
        startAngle: a,
        travelAngle: SIERRA_TRAVEL_ANGLE,
        dir: dir,
        fromGround: fromGround,
        state: "warning",
        warningTime: 120,
        maxWarningTime: 120,
        warning: true,
        progress: 0,
        traveled: 0,
        rotation: 0,
        size: SIERRA_SIZE,
        proximityChecked: false // Nueva bandera para el sistema de near miss
    });
}

function updateSierras(timeScale = 1) {
    if (!window.sierras) window.sierras = [];

    for (let i = window.sierras.length - 1; i >= 0; i--) {
        let s = window.sierras[i];

        if (s.state === "warning") {
            s.warningTime -= timeScale;
            if (s.warningTime <= 0) {
                s.warning = false;
                s.state = "moving";
                window.playSfx?.(s.travelAngle > 0.54 ? 'sawLong' : 'sawShort', 0.55);
            }
        } else if (s.state === "moving") {
            let step = 0.0025 * s.dir * timeScale;
            s.angle += step;
            s.traveled += Math.abs(step);
            s.rotation += 0.06 * s.dir * timeScale;

            if (s.traveled >= s.travelAngle) {
                s.state = "leave";
            }

            // Colision y Near Miss
            if (!window.invulnerable && !window.isPowerupInvulnerable?.() && !window.isZeroGravityActive?.()) {
                let r = window.BASE_RADIUS + window.offset; // Posición radial del jugador
                let sr = s.fromGround ? window.BASE_RADIUS : window.DOME_RADIUS; // Radio central de la sierra
                let rel = ((s.angle + window.worldRotation - window.angle + Math.PI * 2) % (Math.PI * 2));
                if (rel > Math.PI) rel -= Math.PI * 2;

                const collisionAngularThreshold = 0.15;
                const collisionRadialThreshold = s.size * 0.8; // Margen de colisión en píxeles

                const isCollisionAngular = Math.abs(rel) < collisionAngularThreshold;
                const isCollisionRadial = Math.abs(r - sr) < collisionRadialThreshold;

                if (isCollisionAngular && isCollisionRadial) {
                    playerHit();
                    s.proximityChecked = true; // Si hay hit, también lo marcamos para no disparar near miss
                } else if (!s.proximityChecked && s.state === "moving" && window.onNearMiss) { // Solo si no hay colisión y no se ha verificado ya el near miss
                    const angularDistance = Math.abs(rel);
                    const radialDistance = Math.abs(r - sr);

                    const isAngularNearMiss = angularDistance < (collisionAngularThreshold + window.NEAR_MISS_ANGULAR_THRESHOLD);
                    const isRadialNearMiss = radialDistance < (collisionRadialThreshold + window.SAW_NEAR_MISS_RADIAL_MARGIN);

                    if (isAngularNearMiss && isRadialNearMiss) {
                        const isPerfect = window.checkPerfectDodge?.(s.angle + window.worldRotation, window.angle);
                        window.onNearMiss(isPerfect);
                        s.proximityChecked = true;
                    }
                }
            }
        }
        
        if (s.state === "leave") {
            s.progress += 0.02 * timeScale;
            if (s.progress >= 1) {
                window.sierras.splice(i, 1);
            }
        }
    }
}

function drawSierras() {
    if (!window.sierras) return;
    const cx = window.canvas.width / 2;
    const cy = window.canvas.height / 2;

    for (let s of window.sierras) {
        const a = s.angle + window.worldRotation;

        if (s.warning) {
            let wr = s.fromGround ? window.BASE_RADIUS : window.DOME_RADIUS;
            let pulse = 0.4 + Math.sin(Date.now() * 0.015) * 0.4;
            let t = 1 - Math.max(0, s.warningTime) / (s.maxWarningTime || 120);
            let start = s.startAngle + window.worldRotation - SIERRA_WARNING_START_ANGLE * s.dir;
            let end = start + s.dir * (SIERRA_WARNING_START_ANGLE + s.travelAngle * t);
            window.ctx.save();
            window.ctx.beginPath();
            window.ctx.arc(cx, cy, wr, start, end, s.dir < 0);
            window.ctx.strokeStyle = `rgba(255,200,0,${pulse})`;
            window.ctx.lineWidth = 9;
            window.ctx.lineCap = "round";
            window.ctx.shadowColor = "rgba(255,180,0,0.9)";
            window.ctx.shadowBlur = 18;
            window.ctx.stroke();
            window.ctx.restore();
            continue;
        }

        let hideOffset = s.state === "leave" ? s.progress * s.size * 0.75 : 0;
        let sr = s.fromGround
            ? window.BASE_RADIUS - hideOffset
            : window.DOME_RADIUS + hideOffset;
        let sx = cx + Math.cos(a) * sr;
        let sy = cy + Math.sin(a) * sr;

        let alpha = s.state === "leave" ? 1 - s.progress : 1;

        window.ctx.save();
        window.ctx.beginPath();
        window.ctx.arc(cx, cy, window.DOME_RADIUS, 0, Math.PI * 2);
        window.ctx.arc(cx, cy, window.BASE_RADIUS, 0, Math.PI * 2, true);
        window.ctx.clip("evenodd");
        window.ctx.globalAlpha = alpha;
        window.ctx.translate(sx, sy);
        window.ctx.rotate(s.rotation);
        window.ctx.drawImage(sierraImg, -s.size / 2, -s.size / 2, s.size, s.size);
        window.ctx.restore();
    }
}


