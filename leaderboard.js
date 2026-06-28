// =====================================================
// LEADERBOARD — SALA DE REYES
// THE GEM · Tabla de clasificación global
// Lee datos de Firestore > jugadores > {uid} > datos
// =====================================================

(function () {

    // ── Constantes ─────────────────────────────────
    const PANEL_ID = 'leaderboardPanel';
    const LIMIT = 50;   // máx jugadores a cargar

    // ── Helpers ────────────────────────────────────

    /** Convierte XP a nombre de rango (igual que rank-system.js) */
    function getRankFromXP(xp) {
        const ranks = [
            { min: 0, name: 'Chispa', emoji: '✦', color: '#aaaaaa' },
            { min: 100, name: 'Llama', emoji: '🔥', color: '#ff6b35' },
            { min: 300, name: 'Brasa', emoji: '🌋', color: '#ff4500' },
            { min: 600, name: 'Cristal', emoji: '💎', color: '#00d4ff' },
            { min: 1000, name: 'Zafiro', emoji: '🔷', color: '#0088ff' },
            { min: 1500, name: 'Esmeralda', emoji: '💚', color: '#00ff88' },
            { min: 2200, name: 'Rubí', emoji: '❤️', color: '#ff2d55' },
            { min: 3000, name: 'Diamante', emoji: '💠', color: '#00ffe7' },
            { min: 4500, name: 'Obsidiana', emoji: '🌑', color: '#8a2be2' },
            { min: 6500, name: 'Rey de Reyes', emoji: '👑', color: '#ffd700' },
        ];
        let result = ranks[0];
        for (const r of ranks) {
            if (xp >= r.min) result = r;
            else break;
        }
        return result;
    }

    /** Formatea número grande: 1200 → 1.2K */
    function fmtXP(n) {
        if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
        if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K';
        return String(n);
    }

    /** Devuelve el avatar HTML (emoji o img) */
    function avatarHTML(avatarVal, size = 36) {
        if (!avatarVal) return `<span style="font-size:${size * 0.7}px">👤</span>`;
        // Si empieza con assets/ o http → imagen
        if (avatarVal.startsWith('assets/') || avatarVal.startsWith('http')) {
            return `<img src="${avatarVal}" style="width:${size}px;height:${size}px;border-radius:50%;object-fit:cover;" onerror="this.replaceWith(document.createTextNode('👤'))">`;
        }
        // Emoji directo
        return `<span style="font-size:${size * 0.7}px;line-height:1">${avatarVal}</span>`;
    }

    // ── Render de los 3 podios ─────────────────────
    function renderPodium(top3) {
        const order = [top3[1], top3[0], top3[2]]; // 2º · 1º · 3º
        const medals = ['🥈', '🥇', '🥉'];
        const heights = ['72px', '100px', '56px'];
        const glows = ['rgba(192,192,192,.55)', 'rgba(255,215,0,.75)', 'rgba(205,127,50,.55)'];
        const positions = [2, 1, 3];

        return order.map((p, i) => {
            if (!p) return `<div class="lb-podium-slot lb-podium-empty"></div>`;
            const rank = getRankFromXP(p.xp);
            return `
            <div class="lb-podium-slot ${i === 1 ? 'lb-podium-first' : ''}">
                <div class="lb-podium-medal">${medals[i]}</div>
                <div class="lb-podium-avatar" style="box-shadow:0 0 14px ${glows[i]}">
                    ${avatarHTML(p.avatar, i === 1 ? 52 : 40)}
                </div>
                <div class="lb-podium-name">${escHtml(p.name)}</div>
                <div class="lb-podium-rank" style="color:${rank.color}">${rank.emoji} ${rank.name}</div>
                <div class="lb-podium-xp">${fmtXP(p.xp)} XP</div>
                <div class="lb-podium-base" style="height:${heights[i]};box-shadow:0 -4px 18px ${glows[i]}">
                    <span class="lb-podium-pos">${positions[i]}</span>
                </div>
            </div>`;
        }).join('');
    }

    // ── Render de la lista (4º en adelante) ────────
    function renderList(rest, myUID) {
        if (!rest.length) return `<p class="lb-empty">Solo hay 3 guerreros por ahora. ¡Sé el 4to!</p>`;
        return rest.map((p, i) => {
            const rank = getRankFromXP(p.xp);
            const isMe = p.uid === myUID;
            return `
            <div class="lb-row ${isMe ? 'lb-row-me' : ''}">
                <span class="lb-row-pos">${i + 4}</span>
                <div class="lb-row-avatar">${avatarHTML(p.avatar, 32)}</div>
                <div class="lb-row-info">
                    <span class="lb-row-name">${escHtml(p.name)}${isMe ? ' <span class="lb-you-tag">TÚ</span>' : ''}</span>
                    <span class="lb-row-rank" style="color:${rank.color}">${rank.emoji} ${rank.name}</span>
                </div>
                <span class="lb-row-xp">${fmtXP(p.xp)} XP</span>
            </div>`;
        }).join('');
    }

    function escHtml(s) {
        return String(s || 'Jugador')
            .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    // ── Carga datos desde Firestore ─────────────────
    async function loadLeaderboard() {
        const panel = document.getElementById(PANEL_ID);
        if (!panel) return;

        const podiumEl = panel.querySelector('#lb-podium');
        const listEl = panel.querySelector('#lb-list');
        const myUID = window._firebaseUID || null;

        // Estado de carga
        podiumEl.innerHTML = `
            <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;padding:32px;gap:16px;width:100%;">
                <div style="
                    width:40px;height:40px;
                    border:3px solid rgba(0,255,231,.1);
                    border-top:3px solid rgba(0,255,231,.8);
                    border-radius:50%;
                    animation:lbSpin 0.8s linear infinite;
                "></div>
                <span style="font-family:monospace;font-size:11px;letter-spacing:3px;color:rgba(0,255,231,.4);">CARGANDO…</span>
            </div>
            <style>@keyframes lbSpin{to{transform:rotate(360deg)}}</style>
        `;
        listEl.innerHTML = '';

        if (!window.fbDb) {
            podiumEl.innerHTML = `<div class="lb-error">⚠ Firebase no disponible</div>`;
            return;
        }

        try {
            const snap = await window.fbDb
                .collection('jugadores')
                .limit(LIMIT)
                .get();

            const players = [];
            snap.forEach(doc => {
                const d = doc.data()?.datos || {};
                const xp = parseInt(d.totalXP || '0', 10);
                if (isNaN(xp) || xp < 0) return;
                players.push({
                    uid: doc.id,
                    name: d.playerName || 'Jugador',
                    avatar: d.playerAvatar || '',
                    xp,
                });
            });

            // Ordenar por XP de mayor a menor (sin necesitar índice en Firestore)
            players.sort((a, b) => b.xp - a.xp);

            if (!players.length) {
                podiumEl.innerHTML = `<div class="lb-empty">Aún no hay guerreros registrados.</div>`;
                listEl.innerHTML = '';
                return;
            }

            const top3 = players.slice(0, 3);
            const rest = players.slice(3);

            podiumEl.innerHTML = renderPodium(top3);
            listEl.innerHTML = renderList(rest, myUID);

            // Scroll suave a la fila del jugador actual
            if (myUID) {
                const myRow = listEl.querySelector('.lb-row-me');
                if (myRow) setTimeout(() => myRow.scrollIntoView({ block: 'center', behavior: 'smooth' }), 300);
            }

        } catch (err) {
            console.error('Leaderboard error:', err);
            // Si Firestore no tiene índice compuesto todavía, lo indicamos
            if (err.code === 'failed-precondition' || String(err).includes('index')) {
                podiumEl.innerHTML = `<div class="lb-error">⚠ Necesitas crear un índice en Firestore.<br>
                    <small>Ve a Firebase Console → Firestore → Índices<br>
                    y añade: colección <b>jugadores</b>, campo <b>datos.totalXP</b> DESC</small></div>`;
            } else {
                podiumEl.innerHTML = `<div class="lb-error">⚠ Error cargando datos.<br><small>${err.message}</small></div>`;
            }
        }
    }

    // ── Abrir / cerrar panel ────────────────────────
    function showLeaderboard() {
        const panel = document.getElementById(PANEL_ID);
        if (!panel) return;

        // Técnica para Capacitor: primero hacer visible con opacity 0,
        // luego en el siguiente frame animar. Evita el bug de WebView
        // donde display:flex no hace repaint si el elemento nunca fue visible.
        panel.style.opacity = '0';
        panel.style.display = 'flex';

        // Forzar reflow (crítico en WebView Android)
        void panel.getBoundingClientRect();

        panel.style.opacity = '';
        panel.classList.remove('entering', 'leaving');
        void panel.offsetWidth; // segundo reflow para disparar la animación
        panel.classList.add('entering');

        loadLeaderboard();
    }

    function closeLeaderboard() {
        const panel = document.getElementById(PANEL_ID);
        if (!panel) return;
        panel.classList.remove('entering');
        panel.classList.add('leaving');
        setTimeout(() => {
            panel.style.display = 'none';
            panel.classList.remove('leaving');
        }, 350);
    }

    // ── Registrar todos los listeners ──────────────
    // DOMContentLoaded ya disparó si el script está al final del body,
    // así que ejecutamos directamente. Si por algún motivo el DOM aún
    // no está listo, esperamos.
    function bindListeners() {

        // ── Botón REYES en menú principal ────────────
        const reyesMenuBtn = document.getElementById('reyes-menu-btn');
        if (reyesMenuBtn) {
            let tmoved = false;
            reyesMenuBtn.addEventListener('touchstart', function () { tmoved = false; }, { passive: true });
            reyesMenuBtn.addEventListener('touchmove', function () { tmoved = true; }, { passive: true });
            reyesMenuBtn.addEventListener('touchend', function (e) {
                if (!tmoved) { e.preventDefault(); window.showLeaderboard(); }
            }, { passive: false });
            reyesMenuBtn.addEventListener('click', function () { window.showLeaderboard(); });
        }

        // ── Botón flotante REYES ──────────────────────
        const btn = document.getElementById('leaderboard-float-btn');
        if (btn) {
            let touchMoved = false;
            btn.addEventListener('touchstart', function () { touchMoved = false; }, { passive: true });
            btn.addEventListener('touchmove', function () { touchMoved = true; }, { passive: true });
            btn.addEventListener('touchend', function (e) {
                if (!touchMoved) { e.preventDefault(); window.showLeaderboard(); }
            }, { passive: false });
            btn.addEventListener('click', function () { window.showLeaderboard(); });
        }

        // ── Botones de cierre ─────────────────────────
        function addCloseHandler(id) {
            const el = document.getElementById(id);
            if (!el) return;
            el.addEventListener('touchend', function (e) {
                e.preventDefault();
                window.closeLeaderboard();
            }, { passive: false });
            el.addEventListener('click', function () { window.closeLeaderboard(); });
        }
        addCloseHandler('lb-close-top');
        addCloseHandler('lb-close-bottom');

        // Cerrar tocando el backdrop
        const panel = document.getElementById(PANEL_ID);
        if (panel) {
            panel.addEventListener('touchend', function (e) {
                if (e.target === panel) { e.preventDefault(); window.closeLeaderboard(); }
            }, { passive: false });
            panel.addEventListener('click', function (e) {
                if (e.target === panel) window.closeLeaderboard();
            });
        }
    }

    // Ejecutar: si el DOM ya está listo (readyState != 'loading') directo,
    // si no, esperar el evento.
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', bindListeners);
    } else {
        bindListeners();
    }

    // ── Exponer globalmente ─────────────────────────
    // Sobreescribir los stubs del head con la versión completa
    window._lbLoad = loadLeaderboard;
    window.showLeaderboard = showLeaderboard;
    window.closeLeaderboard = closeLeaderboard;

})();
