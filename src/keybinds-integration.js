// =====================================================
// KEYBINDS & COMBO INTEGRATION
// =====================================================
// Este archivo se carga después de main.js para integrar
// el sistema de keybinds y combo con el juego

// Integración de Keybinds - Sobrescribir event listeners originales
setTimeout(() => {
    // Remover event listeners originales
    const originalKeydownHandler = window.addEventListener.toString();
    
    // Agregar nuevo event listener con keybinds personalizados
    const newKeydownHandler = (e) => {
        if (e.key === "Escape" || e.key === "p" || e.key === "P") {
            if (window.paused) window.resumeGame();
            else window.pauseGame();
            return;
        }
        if (window.paused) return;
        
        const key = e.key.toLowerCase();
        const leftKey = window.getKeybind?.('left') || 'a';
        const rightKey = window.getKeybind?.('right') || 'd';
        const gravityKey = window.getKeybind?.('gravity') || 's';
        const powerWKey = window.getKeybind?.('powerW') || 'w';
        const powerEKey = window.getKeybind?.('powerE') || 'e';
        
        if (key === leftKey || e.key === "ArrowLeft") window.keys.left = true;
        if (key === rightKey || e.key === "ArrowRight") window.keys.right = true;
        if ((key === gravityKey || e.key === " " || e.key === "ArrowUp") && window.gravityFlipCooldown <= 0) {
            e.preventDefault();
            window.keys.gravity = true;
        }
        if (key === powerWKey) {
            e.preventDefault();
            window.keys.powerW = true;
        }
        if (key === powerEKey) {
            e.preventDefault();
            window.keys.powerE = true;
        }
    };
    
    const newKeyupHandler = (e) => {
        const key = e.key.toLowerCase();
        const leftKey = window.getKeybind?.('left') || 'a';
        const rightKey = window.getKeybind?.('right') || 'd';
        const powerWKey = window.getKeybind?.('powerW') || 'w';
        const powerEKey = window.getKeybind?.('powerE') || 'e';
        
        if (key === leftKey || e.key === "ArrowLeft") window.keys.left = false;
        if (key === rightKey || e.key === "ArrowRight") window.keys.right = false;
        if (key === powerWKey) window.keys.powerW = false;
        if (key === powerEKey) window.keys.powerE = false;
    };
    
    // No reemplazar el canvas: main.js conserva referencias internas a ese nodo y a su ctx.
    // Cambiarlo por un clon deja el render dibujando en un canvas desconectado.
    window.addEventListener('keydown', newKeydownHandler);
    window.addEventListener('keyup', newKeyupHandler);
    
    // Integración de Combo - Incrementar combo al esquivar obstáculos
    const originalUpdate = window.update;
    if (originalUpdate) {
        window.update = function() {
            // Llamar a la función original
            originalUpdate.call(this);
            
            // Incrementar combo si el jugador está vivo y no está pausado
            if (window.running && !window.paused && window.lives > 0) {
                // El combo se incrementa cuando el jugador esquiva obstáculos
                // Esto se maneja en el loop de juego cuando se detectan esquivas
            }
        };
    }
    
    // Aplicar multiplicador de combo a recompensas
    const originalDraw = window.draw;
    if (originalDraw) {
        window.draw = function() {
            originalDraw.call(this);
            
            // El multiplicador de combo se aplica en el HUD
            // Ya está implementado en drawPowerupHud
        };
    }
    
    // Guardar stats de combo al terminar partida
    const originalGameOver = window.showGameOver;
    if (originalGameOver) {
        window.showGameOver = function() {
            // Guardar stats de combo
            window.saveComboStats?.();
            
            // Llamar a la función original
            originalGameOver.call(this);
        };
    }
    
    // Integración de combo con sistema de recompensas
    // Monitorear cambios en monedas/gemas para aplicar multiplicador
    let lastCoins = window.playerData?.deadCoins || 0;
    let lastGems = window.playerData?.gems || 0;
    
    setInterval(() => {
        if (window.running && !window.paused) {
            const currentCoins = window.playerData?.deadCoins || 0;
            const currentGems = window.playerData?.gems || 0;
            
            if (currentCoins > lastCoins) {
                const multiplier = window.getComboMultiplier?.() || 1;
                const bonus = Math.floor((currentCoins - lastCoins) * (multiplier - 1));
                if (bonus > 0) {
                    window.playerData.deadCoins += bonus;
                    spawnComboParticles('coin', multiplier);
                }
            }
            
            if (currentGems > lastGems) {
                const multiplier = window.getComboMultiplier?.() || 1;
                const bonus = Math.floor((currentGems - lastGems) * (multiplier - 1));
                if (bonus > 0) {
                    window.playerData.gems += bonus;
                    spawnComboParticles('gem', multiplier);
                }
            }
            
            lastCoins = currentCoins;
            lastGems = currentGems;
        }
    }, 100);
    
    // Función para generar partículas de combo
    function spawnComboParticles(type, multiplier) {
        if (!window.particles) window.particles = [];
        
        // Optimización para móviles: reducir cantidad de partículas
        const isMobile = document.body.classList.contains('is-touch-device') || window.innerWidth < 768;
        const particleMultiplier = isMobile ? 0.5 : 1;
        
        const colors = type === 'coin' ? ['#FFD700', '#FFA500', '#FF6347'] : ['#FF69B4', '#FF1493', '#C71585'];
        const count = Math.min(20, Math.floor(multiplier * 5 * particleMultiplier));
        
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 2 + Math.random() * 3;
            const color = colors[Math.floor(Math.random() * colors.length)];
            
            window.particles.push({
                x: window.canvas.width / 2,
                y: window.canvas.height / 2,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                life: 60 + Math.random() * 30,
                maxLife: 90,
                color: color,
                size: 3 + Math.random() * 4,
                type: 'combo'
            });
        }
    }
    
    // Integrar partículas de combo en el loop de dibujo
    const originalDrawFunction = window.draw;
    if (originalDrawFunction) {
        window.draw = function() {
            originalDrawFunction.call(this);
            drawComboParticles();
        };
    }
    
    function drawComboParticles() {
        if (!window.particles) return;
        const ctx = window.canvas?.getContext('2d');
        if (!ctx) return;
        
        for (let i = window.particles.length - 1; i >= 0; i--) {
            const p = window.particles[i];
            if (p.type !== 'combo') continue;
            
            p.x += p.vx;
            p.y += p.vy;
            p.life--;
            p.vx *= 0.98;
            p.vy *= 0.98;
            
            if (p.life <= 0) {
                window.particles.splice(i, 1);
                continue;
            }
            
            const alpha = p.life / p.maxLife;
            ctx.save();
            ctx.globalAlpha = alpha;
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size * alpha, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }
    
}, 1000); // Esperar 1 segundo para asegurar que main.js esté cargado
