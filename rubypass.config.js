// ============================================================
//  THE GEM — rubypass.config.js
//  Configuración del Pase de Rubíes (Ruby Pass).
//  Cambia un número acá y se aplica directo en el juego.
// ============================================================

const RUBY_PASS_CONFIG = {

    // --------------------------------------------------------
    //  AJUSTES GENERALES
    // --------------------------------------------------------
    settings: {
        premiumCostGems: 250,   // costo de comprar el pase premium
        xpPerWin: 120,          // XP que se gana por cada victoria

        // Montos por defecto si un nivel no especifica uno propio abajo
        defaultCoinsAmount: 50,
        defaultGemsAmount: 3,
    },

    // --------------------------------------------------------
    //  MONTOS POR NIVEL (opcional)
    // --------------------------------------------------------
    levelOverrides: {
        // 30: { coins: 100, gems: 6 },
    },

    // --------------------------------------------------------
    //  UI — Controles visuales del Ruby Pass
    //  mobile = celular | desktop = PC
    // --------------------------------------------------------
    ui: {

        // ── ANILLO GIRATORIO (gear shell) ──
        gearShell: {
            topOffset: {
                mobile: 'min(340px, 52vw)',
                desktop: 'min(20px,  54vw)',
            },
            size: {
                mobile: 'min(1700px, 210vw)',
                desktop: 'min(2300px, 190vw, 245vh)',
            },
        },

        // ── VENTANA DEL ARCO ──
        arcWindow: {
            desktop: { top: '0', right: '0', bottom: '0', left: '0' },
            mobile: { top: '130px', right: '18px', bottom: '160px', left: '18px' },
        },

        // ── NODOS ──
        nodes: {
            premium: {
                translateX: {
                    mobile: 'min(620px, 58vw, 76vh)',
                    desktop: 'min(810px, 68vw, 88vh)',
                },
            },
            free: {
                translateX: {
                    mobile: 'min(470px, 44vw, 58vh)',
                    desktop: 'min(620px, 52vw, 67vh)',
                },
            },
        },

        // ── CARRIL GRATUITO ──
        freeTrackSize: {
            mobile: '58%',
            desktop: '58%',
        },

        // ── PANEL CENTRAL (VIP ACTIVO / RUBY PASS / 0% PROGRESO) ──
        focus: {
            desktop: {
                top: '10%',
                left: '50%',
                width: 'min(360px, calc(100vw - 40px))',
            },
            mobile: {
                top: '50%',
                left: '50%',
                width: '300px',
            },
        },

        // ── TEXTOS DEL PANEL CENTRAL ──
        focusTexts: {
            titleFont: { mobile: '15px', desktop: '22px' },
            titleSpacing: { mobile: '3px', desktop: '5px' },
            kickerFont: { mobile: '9px', desktop: '11px' },
            subFont: { mobile: '10px', desktop: '11px' },
        },

        // ── BARRA DE XP ──
        xpBar: {
            height: { mobile: '8px', desktop: '10px' },
            marginTop: { mobile: '10px', desktop: '18px' },
        },

        // ── BOTÓN COMPRAR / PREMIUM ACTIVO ──
        buyBtn: {
            height: { mobile: '36px', desktop: '40px' },
            fontSize: { mobile: '10px', desktop: '11px' },
        },

        // ── BOTONES DEV ──
        devBtn: {
            height: { mobile: '30px', desktop: '34px' },
            fontSize: { mobile: '9px', desktop: '10px' },
        },

        // ── TOPBAR ──
        topbar: {
            height: { mobile: '92px', desktop: '76px' },
            padding: { mobile: '10px 14px', desktop: '12px 22px' },
            gap: { mobile: '10px', desktop: '16px' },
        },

        // ── PERFIL dentro del topbar ──
        profile: {
            height: { mobile: '52px', desktop: '54px' },
            minWidth: { mobile: '0', desktop: 'min(360px, 48vw)' },
            padding: { mobile: '6px 10px', desktop: '8px 12px' },
            borderRadius: { mobile: '8px', desktop: '8px' },
            gap: { mobile: '8px', desktop: '12px' },
        },

        // ── AVATAR ──
        profileAvatar: {
            size: { mobile: '32px', desktop: '38px' },
        },

        // ── TEXTOS del perfil ──
        profileName: { fontSize: { mobile: '10px', desktop: '12px' } },
        profileSub: { fontSize: { mobile: '8px', desktop: '9px' } },

        // ── BANNER DE TEMPORADA (esquina derecha del topbar) ──
        //
        //  MODO PNG (bannerImg con ruta):
        //    Muestra tu imagen de Canva con decoraciones.
        //    El texto y textoStyle se ignoran.
        //
        //  MODO TEXTO (bannerImg: null):
        //    Muestra el texto controlable con color, tamaño, etc.
        //    Puedes activar un cuadro decorativo alrededor con caja.
        //
        seasonLabel: {
            show: { mobile: false, desktop: true },

            // ── MODO PNG ──
            // Cambia la ruta para cada temporada.
            // Pon null para usar modo texto.
            bannerImg: 'assets/Imagenes/Temporadas/temporada_1.png',
            bannerWidth: { mobile: '0px', desktop: '220px' },
            bannerHeight: { mobile: '0px', desktop: '54px' },

            // ── MODO TEXTO ──
            // Solo aplica cuando bannerImg es null.
            texto: 'TEMPORADA 1',
            textoStyle: {
                color: { mobile: '#ffffff', desktop: '#00ffe7' }, // color del texto
                fontSize: { mobile: '10px', desktop: '14px' }, // tamaño
                fontStyle: { mobile: 'normal', desktop: 'italic' }, // 'italic' o 'normal'
                rotate: { mobile: '0deg', desktop: '-2deg' }, // inclinación
                letterSpacing: { mobile: '2px', desktop: '3px' }, // separación letras
            },

            // ── CUADRO DECORATIVO alrededor del texto ──
            // Solo aplica cuando bannerImg es null.
            caja: {
                activa: true,                        // true = mostrar | false = ocultar
                color: 'rgba(0, 255, 231, 0.12)',   // color de fondo del cuadro
                borde: '1px solid rgba(0, 255, 231, 0.4)', // borde (grosor, estilo, color)
                radio: { mobile: '8px', desktop: '10px' },  // redondez de las esquinas
                padding: { mobile: '4px 10px', desktop: '6px 16px' }, // espacio interno
            },
        },

    },

};

// ============================================================
//  APLICADOR — No tocar
// ============================================================
window.RUBY_PASS_CONFIG = RUBY_PASS_CONFIG;

window.getRubyPassAmount = function (level, currencyType) {
    const override = RUBY_PASS_CONFIG.levelOverrides[level];
    if (override && override[currencyType] !== undefined) {
        return override[currencyType];
    }
    return currencyType === 'gems'
        ? RUBY_PASS_CONFIG.settings.defaultGemsAmount
        : RUBY_PASS_CONFIG.settings.defaultCoinsAmount;
};

(function applyRubyPassConfig() {
    const isMobile = window.matchMedia('(max-width: 600px)').matches;
    const d = isMobile ? 'mobile' : 'desktop';
    const root = document.documentElement;
    const ui = RUBY_PASS_CONFIG.ui;

    // Gear shell
    root.style.setProperty('--rp-gear-top-offset', ui.gearShell.topOffset[d]);
    root.style.setProperty('--rp-gear-size', ui.gearShell.size[d]);

    // Arc window
    const aw = ui.arcWindow[d];
    root.style.setProperty('--rp-arc-top', aw.top);
    root.style.setProperty('--rp-arc-right', aw.right);
    root.style.setProperty('--rp-arc-bottom', aw.bottom);
    root.style.setProperty('--rp-arc-left', aw.left);

    // Nodes
    root.style.setProperty('--rp-node-premium-x', ui.nodes.premium.translateX[d]);
    root.style.setProperty('--rp-node-free-x', ui.nodes.free.translateX[d]);

    // Free track
    root.style.setProperty('--rp-free-track-size', ui.freeTrackSize[d]);

    // Focus panel
    const fc = ui.focus[d];
    root.style.setProperty('--rp-focus-top', fc.top);
    root.style.setProperty('--rp-focus-left', fc.left);
    root.style.setProperty('--rp-focus-width', fc.width);

    // Focus texts
    root.style.setProperty('--rp-focus-title-font', ui.focusTexts.titleFont[d]);
    root.style.setProperty('--rp-focus-title-spacing', ui.focusTexts.titleSpacing[d]);
    root.style.setProperty('--rp-focus-kicker-font', ui.focusTexts.kickerFont[d]);
    root.style.setProperty('--rp-focus-sub-font', ui.focusTexts.subFont[d]);

    // XP bar
    root.style.setProperty('--rp-xpbar-height', ui.xpBar.height[d]);
    root.style.setProperty('--rp-xpbar-margin-top', ui.xpBar.marginTop[d]);

    // Buy button
    root.style.setProperty('--rp-buy-height', ui.buyBtn.height[d]);
    root.style.setProperty('--rp-buy-font', ui.buyBtn.fontSize[d]);

    // Dev buttons
    root.style.setProperty('--rp-dev-height', ui.devBtn.height[d]);
    root.style.setProperty('--rp-dev-font', ui.devBtn.fontSize[d]);

    // Topbar
    root.style.setProperty('--rp-topbar-height', ui.topbar.height[d]);
    root.style.setProperty('--rp-topbar-padding', ui.topbar.padding[d]);
    root.style.setProperty('--rp-topbar-gap', ui.topbar.gap[d]);

    // Profile
    root.style.setProperty('--rp-profile-height', ui.profile.height[d]);
    root.style.setProperty('--rp-profile-minwidth', ui.profile.minWidth[d]);
    root.style.setProperty('--rp-profile-padding', ui.profile.padding[d]);
    root.style.setProperty('--rp-profile-radius', ui.profile.borderRadius[d]);
    root.style.setProperty('--rp-profile-gap', ui.profile.gap[d]);
    root.style.setProperty('--rp-avatar-size', ui.profileAvatar.size[d]);
    root.style.setProperty('--rp-name-font', ui.profileName.fontSize[d]);
    root.style.setProperty('--rp-sub-font', ui.profileSub.fontSize[d]);

    // Season banner
    const sl = ui.seasonLabel;
    root.style.setProperty('--rp-season-display', sl.show[d] ? 'flex' : 'none');
    root.style.setProperty('--rp-season-font', sl.fontSize ? sl.fontSize[d] : '12px');
    root.style.setProperty('--rp-season-banner-width', sl.bannerWidth[d]);
    root.style.setProperty('--rp-season-banner-height', sl.bannerHeight[d]);

    // Texto style (modo texto)
    const ts = sl.textoStyle;
    root.style.setProperty('--rp-season-color', ts.color[d]);
    root.style.setProperty('--rp-season-font-size', ts.fontSize[d]);
    root.style.setProperty('--rp-season-font-style', ts.fontStyle[d]);
    root.style.setProperty('--rp-season-rotate', ts.rotate[d]);
    root.style.setProperty('--rp-season-spacing', ts.letterSpacing[d]);

    // Caja decorativa (modo texto)
    const cj = sl.caja;
    root.style.setProperty('--rp-season-caja-display', cj.activa ? 'inline-flex' : 'none');
    root.style.setProperty('--rp-season-caja-bg', cj.color);
    root.style.setProperty('--rp-season-caja-border', cj.borde);
    root.style.setProperty('--rp-season-caja-radius', cj.radio[d]);
    root.style.setProperty('--rp-season-caja-padding', cj.padding[d]);

    window.matchMedia('(max-width: 820px)').addEventListener('change', applyRubyPassConfig);
})();
