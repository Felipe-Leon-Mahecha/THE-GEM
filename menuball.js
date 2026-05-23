const menuBallCanvas = document.getElementById('menuBall');

// Validación de existencia antes de inicializar contexto
if (menuBallCanvas) {
    const mbc = menuBallCanvas.getContext('2d');

    const SKIN_COLORS = {
        default: '#00ffe7',
        cyan: '#00ffe7',
        red: '#ff4444',
        blue: '#4488ff',
        yellow: '#ffee00',
        orange: '#ff8800',
        green: '#44ff88',
        purple: '#cc44ff',
    };

    function getEquippedColor() {
        const skin = localStorage.getItem('equippedSkin') || 'cyan';
        return SKIN_COLORS[skin] || '#00ffe7';
    }

    let menuTime = 0;
    let menuTrail = [];

    function hexToRgb(hex) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `${r},${g},${b}`;
    }

    function drawMenuBall() {
        mbc.clearRect(0, 0, 60, 60);
        menuTime += 0.02;

        const x = 30 + Math.cos(menuTime) * 8;
        const y = 30 + Math.sin(menuTime) * 5;
        const color = getEquippedColor();
        const rgb = hexToRgb(color);

        // Guardar posición para trail
        menuTrail.push({ x, y, life: 1.0 });
        if (menuTrail.length > 30) menuTrail.shift();

        // Dibujar trail
        for (let t of menuTrail) {
            t.life -= 0.015;
            if (t.life <= 0) continue;

            // Outer glow
            mbc.arc(t.x, t.y, 14 * t.life, 0, Math.PI * 2);
            mbc.fillStyle = `rgba(${rgb},${t.life * 0.15})`;

            // Mid glow  
            mbc.arc(t.x, t.y, 8 * t.life, 0, Math.PI * 2);
            mbc.fillStyle = `rgba(${rgb},${t.life * 0.3})`;

            // Core
            mbc.arc(t.x, t.y, 3.5 * t.life, 0, Math.PI * 2);
            mbc.fillStyle = `rgba(255,255,255,${t.life})`;
        }

        // Glow principal
        mbc.shadowBlur = 16;
        mbc.shadowColor = color;

        // Bolita
        mbc.beginPath();
        mbc.arc(x, y, 10, 0, Math.PI * 2);
        mbc.fillStyle = color;
        mbc.fill();

        // Brillo interno
        mbc.shadowBlur = 0;
        mbc.beginPath();
        mbc.arc(x - 4, y - 4, 3.5, 0, Math.PI * 2);
        mbc.fillStyle = 'rgba(255,255,255,0.35)';
        mbc.fill();

        requestAnimationFrame(drawMenuBall);
    }

    drawMenuBall();
}