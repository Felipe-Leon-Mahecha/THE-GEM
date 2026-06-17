// =====================================================
// SISTEMA DE OBSTÁCULOS
// =====================================================
// Este archivo maneja la generación, movimiento y colisiones de los obstáculos
// como spikes (pinchos), sierras giratorias y láseres.

// Constantes para las sierras giratorias
const SIERRA_SIZE = 88; // Tamaño de la sierra en píxeles
const SIERRA_WARNING_START_ANGLE = 0.08; // Ángulo donde empieza la advertencia de la sierra
const SIERRA_TRAVEL_ANGLE = 0.5; // Ángulo total que recorre la sierra

// Obtener el radio base para los obstáculos según si vienen del suelo o del domo
// fromGround: true si el obstáculo viene desde el suelo, false si viene desde el domo
function getObstacleBaseRadius(fromGround) {
    const config = window.getCurrentLevelConfig ? window.getCurrentLevelConfig() : {};
    const inset = config.ringInset || 0;
    return fromGround
        ? window.BASE_RADIUS
        : window.DOME_RADIUS - inset;
}

// Generar un grupo de spikes (pinchos) en el nivel
// Crea entre 1 y 3 spikes en posiciones aleatorias evitando zonas letales y otros obstáculos
function spawnObstacleGroup() {
    const config = window.getCurrentLevelConfig ? window.getCurrentLevelConfig() : {};
    if (config.obstacles && !config.obstacles.spikes) return;

    // Número aleatorio de spikes (1 a 3)
    let count =
        1 + Math.floor(Math.random() * 3);

    // Ángulo base donde aparecerán los spikes (delante del jugador)
    let baseAngle =
        angle +
        worldRotation +
        Math.PI * (0.6 + Math.random() * 0.4);

    // Espaciado entre spikes
    let spacing = 0.18;

    // Crear cada spike del grupo
    for (let i = 0; i < count; i++) {

        // Calcular el ángulo de este spike
        let a =
            baseAngle +
            (i - (count - 1) / 2) * spacing;

        // No spawnear en zona letal
        if (window.isAngleInsideLethalZone?.(a)) continue;

        // Verificar si ya hay un obstáculo cerca
        let blocked =
            obstacles.some(o =>
                Math.abs(o.angle - a) < 0.15
            );

        // Si está bloqueado, intentar otro ángulo
        if (blocked) continue;

        // Crear el objeto del obstáculo spike
        obstacles.push({

            angle: a, // Ángulo donde aparece

            width: 0.12, // Ancho angular del spike

            height:
                (DOME_RADIUS - BASE_RADIUS) * 0.18, // Altura del spike

            life: 180, // Tiempo de vida en frames

            progress: 0, // Progreso de aparición (0 a 1)

            state: "warning", // Estado: warning (advertencia) o active (activo)

            warning: true, // Si está en fase de advertencia

            warningTime: 45, // Tiempo de advertencia en frames

            fromGround:
                config.ringInset > 0 ? false : Math.random() < 0.5, // Si viene del suelo o del domo

            color: config.theme === "frozen" ? "#a9efff" : (config.ringInset > 0 ? "#c8c8c8" : "#ff2f92"), // Color según tema
            proximityChecked: false // Bandera para el sistema de near miss (esquiva cercana)
        });
    }
}

// =====================================================
// SISTEMA DE COLISIONES
// =====================================================

// Verificar colisiones entre el jugador y los obstáculos
// También detecta near misses (esquivas cercanas) para el sistema de combo
function checkCollisions() {

    // Si el jugador es invulnerable, no verificar colisiones
    if (window.invulnerable || window.isPowerupInvulnerable?.()) return;

    let r = window.BASE_RADIUS + window.offset; // Posición radial del jugador

    // Revisar cada obstáculo
    for (let o of window.obstacles) {

        // Ignorar si está en fase de advertencia
        if (o.warning) continue;

        // Solo verificar cuando el obstáculo está casi completamente activo
        if (o.progress < 0.9) continue;

        // Calcular el ángulo actual del obstáculo (considerando rotación del mundo)
        let obstacleAngle =
            o.angle + window.worldRotation;

        // Calcular la distancia angular relativa entre el obstáculo y el jugador
        let rel =
            ((obstacleAngle - window.angle + Math.PI * 2)
                % (Math.PI * 2));

        // Normalizar a rango [-PI, PI]
        if (rel > Math.PI)
            rel -= Math.PI * 2;

        // Calcular los límites radiales del obstáculo
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
        // Umbrales de colisión (hitbox)
        const collisionAngularThreshold = o.width * 0.615; /* Reducido 18% para hitbox más justa */
        const collisionRadialThreshold = 4.1; /* Reducido 18% para hitbox más justa */

        // Verificar colisión angular y radial
        const isCollisionAngular = Math.abs(rel) <= collisionAngularThreshold;
        const isCollisionRadial = (r > from - collisionRadialThreshold && r < to + collisionRadialThreshold);

        // Si hay colisión en ambos ejes, el jugador es golpeado
        if (isCollisionAngular && isCollisionRadial) {
            playerHit();
            o.proximityChecked = true; // Marcar como verificado para no disparar near miss
            return; // Colisión detectada, salir de la función
        }

        // Si no hay colisión, verificar near miss (esquiva cercana)
        // Solo se verifica una vez por obstáculo
        if (!o.proximityChecked && o.progress >= 0.95 && window.onNearMiss) {
            const angularDistance = Math.abs(rel);
            // Distancia al borde más cercano del obstáculo radialmente
            const radialDistanceToClosestEdge = Math.min(Math.abs(r - (from - collisionRadialThreshold)), Math.abs(r - (to + collisionRadialThreshold)));

            // Verificar si es un near miss angular y radial
            const isAngularNearMiss = angularDistance < (collisionAngularThreshold + window.NEAR_MISS_ANGULAR_THRESHOLD);
            const isRadialNearMiss = radialDistanceToClosestEdge < window.SPIKE_NEAR_MISS_RADIAL_MARGIN;

            // Si es near miss en ambos ejes, activar el sistema de combo
            if (isAngularNearMiss && isRadialNearMiss) {
                const isPerfect = window.checkPerfectDodge?.(obstacleAngle, window.angle);
                window.onNearMiss(isPerfect);
                o.proximityChecked = true; // Marcar como verificado para no repetir
            }
        }
    }
}

// =====================================================
// GOLPE AL JUGADOR
// =====================================================

// Función llamada cuando el jugador es golpeado por un obstáculo
// Reduce vidas, activa invulnerabilidad temporal y resetea el combo
function playerHit() {
    // Si hay un powerup que absorbe el golpe, no hacer nada
    if (window.absorbPowerupHit?.()) return;

    // Marcar todos los obstáculos como proximityChecked para evitar near-miss incorrectos
    if (window.obstacles) {
        window.obstacles.forEach(o => o.proximityChecked = true);
    }
    if (window.sierras) {
        window.sierras.forEach(s => s.proximityChecked = true);
    }
    if (window.lasers) {
        window.lasers.forEach(l => l.proximityChecked = true);
    }

    // Reducir vidas
    window.lives--;

    // Efecto visual de golpe
    window.hitFlash = 1;

    // Activar invulnerabilidad temporal
    window.invulnerable = true;
    window.invulnerableTimer = 60;

    // Resetear combo cuando es golpeado
    window.resetComboOnHit?.();

    // Si no quedan vidas, mostrar game over
    if (window.lives <= 0) {
        if (typeof window.showGameOverWithRevive === 'function') {
            window.showGameOverWithRevive();
            return;
        }
    }
}

// =====================================================
// SISTEMA DE SIERRAS GIRATORIAS
// =====================================================

// Cargar imagen de la sierra giratoria
const sierraImg = new Image();
sierraImg.src = "assets/Imagenes/Obstaculos/Sierra_Metalica.png";

// Generar una sierra giratoria en el nivel
// La sierra aparece en una posición aleatoria y se mueve en un arco
function spawnSierra() {
    // Verificar si el nivel permite sierras
    const config = window.getCurrentLevelConfig ? window.getCurrentLevelConfig() : {};
    if (!config.obstacles || !config.obstacles.saws) return;

    // Posición aleatoria: desde el suelo o desde el domo
    let fromGround = Math.random() < 0.5;
    
    // Ángulo aleatorio de aparición
    let a = Math.random() * Math.PI * 2;
    
    // Dirección de movimiento (1 = horario, -1 = antihorario)
    let dir = Math.random() < 0.5 ? 1 : -1;

    // Intentar encontrar una posición libre (máximo 12 intentos)
    for (let tries = 0; tries < 12; tries++) {
        // Verificar si hay un spike cerca
        const blockedBySpike = window.obstacles.some(o => {
            let rel = Math.abs(((o.angle - a + Math.PI * 3) % (Math.PI * 2)) - Math.PI);
            return rel < 0.34;
        });

        // Verificar si hay otra sierra cerca
        const blockedBySierra = window.sierras.some(s => {
            let rel = Math.abs(((s.angle - a + Math.PI * 3) % (Math.PI * 2)) - Math.PI);
            return rel < 0.5;
        });

        // Si está libre, usar este ángulo. Si no, intentar otro
        if (!blockedBySpike && !blockedBySierra) break;
        a = Math.random() * Math.PI * 2;
    }

    // Crear el objeto de la sierra
    window.sierras.push({
        angle: a, // Ángulo actual
        startAngle: a, // Ángulo donde empezó
        travelAngle: SIERRA_TRAVEL_ANGLE, // Ángulo total que recorrerá
        dir: dir, // Dirección de movimiento
        fromGround: fromGround, // Si viene del suelo o del domo
        state: "warning", // Estado: warning, moving, o leave
        warningTime: 120, // Tiempo de advertencia
        maxWarningTime: 120, // Tiempo máximo de advertencia
        warning: true, // Si está en fase de advertencia
        progress: 0, // Progreso de salida
        traveled: 0, // Ángulo recorrido
        rotation: 0, // Rotación visual de la sierra
        size: SIERRA_SIZE, // Tamaño de la sierra
        proximityChecked: false // Bandera para near miss
    });
}

// Actualizar todas las sierras (movimiento, rotación, colisiones)
// timeScale: multiplicador de velocidad (para slow motion, etc)
function updateSierras(timeScale = 1) {
    // Inicializar array de sierras si no existe
    if (!window.sierras) window.sierras = [];

    // Actualizar cada sierra (en reverso para poder eliminar)
    for (let i = window.sierras.length - 1; i >= 0; i--) {
        let s = window.sierras[i];

        // Fase de advertencia: mostrar línea de advertencia
        if (s.state === "warning") {
            s.warningTime -= timeScale;
            if (s.warningTime <= 0) {
                s.warning = false;
                s.state = "moving";
                // Reproducir sonido según la distancia que recorrerá
                window.playSfx?.(s.travelAngle > 0.54 ? 'sawLong' : 'sawShort', 0.55);
            }
        } else if (s.state === "moving") {
            // Mover la sierra en su arco
            let step = 0.0025 * s.dir * timeScale;
            s.angle += step;
            s.traveled += Math.abs(step);
            
            // Rotar la sierra visualmente
            s.rotation += 0.06 * s.dir * timeScale;

            // Si recorrió la distancia total, empezar a salir
            if (s.traveled >= s.travelAngle) {
                s.state = "leave";
            }

            // Verificar colisión y near miss
            if (!window.invulnerable && !window.isPowerupInvulnerable?.() && !window.isZeroGravityActive?.()) {
                let r = window.BASE_RADIUS + window.offset; // Posición radial del jugador
                let sr = s.fromGround ? window.BASE_RADIUS : window.DOME_RADIUS; // Radio central de la sierra
                let rel = ((s.angle + window.worldRotation - window.angle + Math.PI * 2) % (Math.PI * 2));
                if (rel > Math.PI) rel -= Math.PI * 2;

                // Umbrales de colisión para la sierra
                const collisionAngularThreshold = 0.123; /* Reducido 18% para hitbox más justa */
                const collisionRadialThreshold = s.size * 0.656; /* Reducido 18% para hitbox más justa */

                // Verificar colisión
                const isCollisionAngular = Math.abs(rel) < collisionAngularThreshold;
                const isCollisionRadial = Math.abs(r - sr) < collisionRadialThreshold;

                // Si hay colisión, golpear al jugador
                if (isCollisionAngular && isCollisionRadial) {
                    playerHit();
                    s.proximityChecked = true; // Marcar como verificado
                } else if (!s.proximityChecked && s.state === "moving" && window.onNearMiss) {
                    // Si no hay colisión, verificar near miss
                    const angularDistance = Math.abs(rel);
                    const radialDistance = Math.abs(r - sr);

                    // Verificar si es near miss
                    const isAngularNearMiss = angularDistance < (collisionAngularThreshold + window.NEAR_MISS_ANGULAR_THRESHOLD);
                    const isRadialNearMiss = radialDistance < (collisionRadialThreshold + window.SAW_NEAR_MISS_RADIAL_MARGIN);

                    // Si es near miss, activar combo
                    if (isAngularNearMiss && isRadialNearMiss) {
                        const isPerfect = window.checkPerfectDodge?.(s.angle + window.worldRotation, window.angle);
                        window.onNearMiss(isPerfect);
                        s.proximityChecked = true;
                    }
                }
            }
        }

        // Fase de salida: la sierra desaparece gradualmente
        if (s.state === "leave") {
            s.progress += 0.02 * timeScale;
            if (s.progress >= 1) {
                // Eliminar la sierra cuando termina de salir
                window.sierras.splice(i, 1);
            }
        }
    }
}

// Dibujar todas las sierras en el canvas
function drawSierras() {
    if (!window.sierras) return;
    const cx = window.canvas.width / 2;
    const cy = window.canvas.height / 2;

    // Dibujar cada sierra
    for (let s of window.sierras) {
        const a = s.angle + window.worldRotation;

        // Dibujar línea de advertencia si está en fase warning
        if (s.warning) {
            let wr = s.fromGround ? window.BASE_RADIUS : window.DOME_RADIUS;
            let pulse = 0.4 + Math.sin(Date.now() * 0.015) * 0.4; // Efecto de pulso
            let t = 1 - Math.max(0, s.warningTime) / (s.maxWarningTime || 120); // Progreso de advertencia
            let start = s.startAngle + window.worldRotation - SIERRA_WARNING_START_ANGLE * s.dir;
            let end = start + s.dir * (SIERRA_WARNING_START_ANGLE + s.travelAngle * t);
            // Dibujar el arco de advertencia
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

        // Calcular posición de la sierra
        let hideOffset = s.state === "leave" ? s.progress * s.size * 0.75 : 0; // Offset para animación de salida
        let sr = s.fromGround
            ? window.BASE_RADIUS - hideOffset
            : window.DOME_RADIUS + hideOffset;
        let sx = cx + Math.cos(a) * sr;
        let sy = cy + Math.sin(a) * sr;

        // Calcular transparencia
        let alpha = s.state === "leave" ? 1 - s.progress : 1;

        // Dibujar la sierra con clipping para que solo aparezca en el anillo
        window.ctx.save();
        window.ctx.beginPath();
        window.ctx.arc(cx, cy, window.DOME_RADIUS, 0, Math.PI * 2);
        window.ctx.arc(cx, cy, window.BASE_RADIUS, 0, Math.PI * 2, true);
        window.ctx.clip("evenodd"); // Clipping para mostrar solo en el anillo
        window.ctx.globalAlpha = alpha;
        window.ctx.translate(sx, sy);
        window.ctx.rotate(s.rotation);
        window.ctx.drawImage(sierraImg, -s.size / 2, -s.size / 2, s.size, s.size);
        window.ctx.restore();
    }
}


