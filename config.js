// ============================================================
//  THE GEM — config.js
//  Aquí puedes modificar tamaños y posiciones de los elementos
//  del juego para PC y móvil por separado.
//  Cambia un número acá y se aplica en todo el juego.
// ============================================================

const GEM_CONFIG = {

    // --------------------------------------------------------
    //  SIDEBAR DE LA TIENDA — Columna izquierda
    // --------------------------------------------------------
    tiendaSidebar: {

        // Ancho total del sidebar
        width: {
            mobile: '100%',
            desktop: '300px',
        },

        // Header: zona con "TIENDA" y botón VOLVER
        header: {
            padding: {
                mobile: '14px 14px 10px',
                desktop: '15px 18px 16px',
            },
        },

        // Texto "TIENDA"
        titulo: {
            fontSize: {
                mobile: '14px',
                desktop: '35px', // tamaño del texto "TIENDA" en el header del sidebar
            },
            color: '#ff4d6d',   // cambia acá para cambiar el color en todos lados
        },

        // Botón VOLVER
        backBtn: {
            padding: {
                mobile: '7px',
                desktop: '15px',
            },
            fontSize: {
                mobile: '9px',
                desktop: '15px',
            },
        },

        // Sección ESTANDARTE (wrapper del banner de perfil)
        profileSection: {
            padding: {
                mobile: '10px 10px 12px',
                desktop: '16px 13px 19px',
            },
        },

        // Labels pequeños (ESTANDARTE, EQUIPADO)
        labelFont: {
            mobile: '8px',
            desktop: '15px',
        },

        // Cuadro de perfil (banner del jugador)
        profileBanner: {
            height: {
                mobile: '72px',
                desktop: '130px',
            },
            borderRadius: {
                mobile: '8px',
                desktop: '20px',
            },
            padding: {
                mobile: '8px',
                desktop: '15px',
            },
        },

        // Avatar circular dentro del banner
        avatar: {
            size: {
                mobile: '28px',
                desktop: '45px',
            },
        },

        // Texto del nombre del jugador
        profileName: {
            fontSize: {
                mobile: '10px',
                desktop: '17px',
            },
        },

        // Texto del nivel (ej: "Nivel 1")
        profileLevel: {
            fontSize: {
                mobile: '8px',
                desktop: '13px',
            },
        },

        // Nombre del banner equipado (texto abajo del cuadro)
        bannerName: {
            fontSize: {
                mobile: '7px',
                desktop: '8px', //nombre del banner equipado (ej: "ESTANDARTE DEL VIENTO")
            },
        },

        // Chips de monedas (RUBIES / COINS)
        currency: {
            gap: {   // espacio entre el monedas y gemas
                mobile: '6px',
                desktop: '5px',
            },
            padding: {
                mobile: '6px 10px',
                desktop: '15px 22px', // espacio interno de monetizacion y al aumentar valor aumenta a la derecha
            },
            labelFont: {
                mobile: '9px',
                desktop: '15px', //Tamaño del texto "RUBIES" y "COINS"
            },
            valueFont: {
                mobile: '12px',
                desktop: '17px', //Tamaño del número que indica la cantidad de monedas/gemas
            },
            iconSize: {
                mobile: '14px',
                desktop: '27px', //Tamaño del ícono de moneda/gema dentro del chip
            },
        },

        // Sección EQUIPADO
        equipped: {
            padding: {
                mobile: '14px 14px',
                desktop: '20px 24px', //1. espacio entre misiones y equipado, 2. al aumentar el texto dentro se corre a la derecha
            },
            previewSize: {
                mobile: '30px',
                desktop: '40px', //Tamaño del ícono pequeño que muestra la skin equipada dentro del chip de "EQUIPADO"
            },
            nameFont: {
                mobile: '11px',
                desktop: '14px', //Tamaño del texto con el nombre de la skin equipada dentro del chip de "EQUIPADO" (ej: "SKIN DRAGÓN")
            },
            rarityFont: {
                mobile: '9px',
                desktop: '13px', //Tamaño del texto con la rareza de la skin equipada dentro del chip de "EQUIPADO" (ej: "RARITY: LEGENDARY")
            },
        },

    },

    // --------------------------------------------------------
    //  TIENDA — Pantalla de inicio de la tienda
    // --------------------------------------------------------
    tienda: {

        // Banner superior izquierdo (Tienda VIP)
        bannerVIP: {
            mobile: { height: '100px' },
            desktop: { height: '130px' }, //tamaño del banner VIP en la parte superior de la tienda, debajo del header. Solo afecta al alto, el ancho se adapta al contenedor
        },

        // Botón cuadrado del Ruby Pass (derecha del VIP)
        rubyPass: {
            mobile: { width: '100%', height: '90px' },
            desktop: { width: '350px', height: '130px' }, //controla ambos por medio de pase rubi
        },

        // Fila que contiene ambos banners
        bannerRow: {
            mobile: { flexDirection: 'column', gap: '10px' },
            desktop: { flexDirection: 'row', gap: '12px' },
        },

        // Grid de los 8 paneles de categorías (Skins, Trails, etc.)
        panelGrid: {
            mobile: { columns: 2, gap: '10px' },
            desktop: { columns: 4, gap: '14px' },
        },

    },

    // --------------------------------------------------------
    //  MENÚ PRINCIPAL — Pantalla de inicio
    // --------------------------------------------------------
    menu: {

        // Panel derecho con los botones (JUGAR, TIENDA, etc.)
        panel: {
            mobile: { width: '100%', paddingBottom: '40px' },
            desktop: { width: '58%', paddingBottom: '80px' },
        },

        // Botones del menú (tamaño general)
        botones: {
            mobile: { gap: '10px' },
            desktop: { gap: '14px' },
        },

    },

    // --------------------------------------------------------
    //  CONTROLES TÁCTILES — Botones en pantalla durante el juego
    // --------------------------------------------------------
    controles: {

        // Tamaño de los botones táctiles
        botonSize: {
            mobile: 'clamp(58px, 14vmin, 76px)',
            desktop: 'clamp(58px, 14vmin, 76px)', // en PC no se muestran pero puedes cambiarlos
        },

        // Posición del botón izquierdo (mover izquierda)
        botonIzquierda: {
            mobile: { left: '14px', bottom: '20px' },
            desktop: { left: '14px', bottom: '20px' },
        },

        // Posición del botón derecho (mover derecha)
        botonDerecha: {
            mobile: { left: '86px', bottom: '20px' },
            desktop: { left: '86px', bottom: '20px' },
        },

        // Posición del botón de gravedad
        botonGravedad: {
            mobile: { right: '18px', bottom: '20px' },
            desktop: { right: '18px', bottom: '20px' },
        },

    },

    // --------------------------------------------------------
    //  BOTÓN DE MUTE — Esquina inferior derecha
    // --------------------------------------------------------
    muteBTN: {
        mobile: { size: '44px', bottom: '16px', right: '16px' },
        desktop: { size: '52px', bottom: '20px', right: '20px' },
    },

    // --------------------------------------------------------
    //  HUD EN PARTIDA — Elementos durante el juego
    // --------------------------------------------------------
    hud: {

        // Texto del puntaje
        score: {
            mobile: { fontSize: '28px', top: '16px' },
            desktop: { fontSize: '36px', top: '20px' },
        },

    },

    // --------------------------------------------------------
    //  LEVEL SELECT — Carrusel de selección de niveles
    // --------------------------------------------------------
    levelSelect: {

        // --- HEADER: título "SELECCIONAR NIVEL" ---
        header: {
            // Posición vertical del header (top)
            top: { mobile: '14px', desktop: '28px' },
            // Ancho del contenedor del header
            width: { mobile: '96%', desktop: '92%' },
        },

        // --- TÍTULO: caja que encierra "THE GEM / SELECCIONAR NIVEL" ---
        titleBox: {
            // Activar o desactivar el cuadro visual alrededor del título
            enabled: true,
            padding: { mobile: '8px 14px', desktop: '10px 20px' },
            borderRadius: { mobile: '10px', desktop: '14px' },
            background: 'rgba(0,0,0,0.38)',
            border: 'rgba(0,255,231,0.15)',
            backdropBlur: '8px',
        },

        // Tamaño del texto del título
        titleFont: {
            small: { mobile: '9px', desktop: '11px' },   // "THE GEM"
            large: { mobile: '26px', desktop: '42px' },   // "SELECCIONAR NIVEL"
        },

        // --- BOTÓN VOLVER ---
        backBtn: {
            // top: distancia desde arriba
            top: { mobile: '14px', desktop: '28px' },
            height: { mobile: '36px', desktop: '42px' },
            fontSize: { mobile: '12px', desktop: '14px' },
            padding: { mobile: '0 12px', desktop: '0 18px' },
        },

        // --- PLAYER BAR (arriba derecha con avatar/nombre/monedas) ---
        playerBar: {
            // solo afecta si back-btn y player-bar conviven
            top: { mobile: '64px', desktop: '86px' },
        },

        // --- FLECHAS DE NAVEGACIÓN (← →) ---
        navArrows: {
            size: { mobile: '48px', desktop: '64px' },           // ancho y alto
            fontSize: { mobile: '22px', desktop: '34px' },       // tamaño del símbolo
            borderRadius: { mobile: '12px', desktop: '18px' },
            // distancia desde el borde de la pantalla
            sideOffset: { mobile: 'clamp(12px, 4vw, 32px)', desktop: 'clamp(24px, 7vw, 110px)' },
            // posición vertical (top como % del viewport)
            verticalPos: { mobile: '54%', desktop: '52%' },
        },

        // --- CARDS DEL CARRUSEL (canvas, no CSS) ---
        card: {
            desktop: { width: 320, height: 420, spacing: 420 },
            landscape: { width: 250, height: 315, spacing: 315 },  // móvil horizontal
        },

        // Posición vertical del centro del carrusel
        centerY: {
            desktop: { mode: 'offset', value: 70 },   // H/2 + 70
            landscape: { mode: 'factor', value: 0.58 },  // H * 0.58
        },

        // --- FOOTER (barra sistema + botón JUGAR) ---
        footer: {
            bottom: { mobile: '16px', desktop: '30px' },
        },

        // --- BARRA DEL SISTEMA (mensajes tipo "TIP: no mueras") ---
        systemBar: {
            width: { mobile: '100%', desktop: '360px' },
            height: { mobile: '36px', desktop: '40px' },
        },

        // --- BOTÓN JUGAR ---
        playBtn: {
            width: { mobile: '160px', desktop: '220px' },
            height: { mobile: '52px', desktop: '64px' },
            fontSize: { mobile: '18px', desktop: '22px' },
        },

        // --- COLORES (canvas y UI) ---
        colors: {
            selectedGlow: '#00ffe7',
            selectedBorder: 'rgba(0,255,231,0.45)',
            idleBorder: 'rgba(255,255,255,0.06)',
            unlockedBadge: '#00ffae',
            lockedText: '#ff4466',
            starColor: '0,255,231',
            nebulaColor: '120,0,255',
            titleBoxBorder: 'rgba(0,255,231,0.15)',
        },

        // --- TIPOGRAFÍA DEL CANVAS (se multiplica por scale de la card) ---
        fonts: {
            levelName: { size: 24 },
            statusText: { size: 13 },
            badgeText: { size: 11 },
        },

    },

};

// ============================================================
//  APLICADOR AUTOMÁTICO
//  No toques esto — lee el config de arriba y lo aplica en CSS
// ============================================================
(function applyConfig() {
    const isMobile = window.matchMedia('(max-width: 600px)').matches;
    const d = isMobile ? 'mobile' : 'desktop';
    const t = GEM_CONFIG.tienda;
    const m = GEM_CONFIG.menu;

    // Inyectar variables CSS desde el config
    const root = document.documentElement;

    // Tienda — Banner VIP
    root.style.setProperty('--cfg-vip-height', t.bannerVIP[d].height);

    // Tienda — Ruby Pass
    root.style.setProperty('--cfg-ruby-width', t.rubyPass[d].width);
    root.style.setProperty('--cfg-ruby-height', t.rubyPass[d].height);

    // Tienda — Fila de banners
    root.style.setProperty('--cfg-banner-row-direction', t.bannerRow[d].flexDirection);
    root.style.setProperty('--cfg-banner-row-gap', t.bannerRow[d].gap);

    // Tienda — Grid de paneles
    root.style.setProperty('--cfg-grid-cols', t.panelGrid[d].columns);
    root.style.setProperty('--cfg-grid-gap', t.panelGrid[d].gap);

    // Mute BTN
    const mute = GEM_CONFIG.muteBTN[d];
    root.style.setProperty('--cfg-mute-size', mute.size);
    root.style.setProperty('--cfg-mute-bottom', mute.bottom);
    root.style.setProperty('--cfg-mute-right', mute.right);

    // ── SIDEBAR TIENDA ──
    const sb = GEM_CONFIG.tiendaSidebar;

    root.style.setProperty('--shop-sidebar-width', sb.width[d]);
    root.style.setProperty('--shop-header-padding', sb.header.padding[d]);
    root.style.setProperty('--shop-title-font', sb.titulo.fontSize[d]);
    root.style.setProperty('--shop-title-color', sb.titulo.color);
    root.style.setProperty('--shop-back-padding', sb.backBtn.padding[d]);
    root.style.setProperty('--shop-back-font', sb.backBtn.fontSize[d]);
    root.style.setProperty('--shop-profile-padding', sb.profileSection.padding[d]);
    root.style.setProperty('--shop-label-font', sb.labelFont[d]);
    root.style.setProperty('--shop-banner-height', sb.profileBanner.height[d]);
    root.style.setProperty('--shop-banner-radius', sb.profileBanner.borderRadius[d]);
    root.style.setProperty('--shop-banner-padding', sb.profileBanner.padding[d]);
    root.style.setProperty('--shop-avatar-size', sb.avatar.size[d]);
    root.style.setProperty('--shop-profile-name-font', sb.profileName.fontSize[d]);
    root.style.setProperty('--shop-profile-level-font', sb.profileLevel.fontSize[d]);
    root.style.setProperty('--shop-banner-name-font', sb.bannerName.fontSize[d]);
    root.style.setProperty('--shop-currency-gap', sb.currency.gap[d]);
    root.style.setProperty('--shop-currency-padding', sb.currency.padding[d]);
    root.style.setProperty('--shop-currency-label-font', sb.currency.labelFont[d]);
    root.style.setProperty('--shop-currency-value-font', sb.currency.valueFont[d]);
    root.style.setProperty('--shop-currency-icon-size', sb.currency.iconSize[d]);
    root.style.setProperty('--shop-equipped-padding', sb.equipped.padding[d]);
    root.style.setProperty('--shop-equipped-size', sb.equipped.previewSize[d]);
    root.style.setProperty('--shop-equipped-name-font', sb.equipped.nameFont[d]);
    root.style.setProperty('--shop-equipped-rarity-font', sb.equipped.rarityFont[d]);

    // ── LEVEL SELECT: variables CSS ──
    const ls = GEM_CONFIG.levelSelect;

    // Header
    root.style.setProperty('--ls-header-top', ls.header.top[d]);
    root.style.setProperty('--ls-header-width', ls.header.width[d]);

    // Title box
    root.style.setProperty('--ls-title-box-display', ls.titleBox.enabled ? 'inline-flex' : 'contents');
    root.style.setProperty('--ls-title-box-padding', ls.titleBox.padding[d]);
    root.style.setProperty('--ls-title-box-radius', ls.titleBox.borderRadius[d]);
    root.style.setProperty('--ls-title-box-bg', ls.titleBox.background);
    root.style.setProperty('--ls-title-box-border', ls.titleBox.border);
    root.style.setProperty('--ls-title-box-blur', ls.titleBox.backdropBlur);

    // Title fonts
    root.style.setProperty('--ls-font-small', ls.titleFont.small[d]);
    root.style.setProperty('--ls-font-large', ls.titleFont.large[d]);

    // Back button
    root.style.setProperty('--ls-back-top', ls.backBtn.top[d]);
    root.style.setProperty('--ls-back-height', ls.backBtn.height[d]);
    root.style.setProperty('--ls-back-font', ls.backBtn.fontSize[d]);
    root.style.setProperty('--ls-back-padding', ls.backBtn.padding[d]);

    // Player bar
    root.style.setProperty('--ls-playerbar-top', ls.playerBar.top[d]);

    // Nav arrows
    root.style.setProperty('--ls-nav-size', ls.navArrows.size[d]);
    root.style.setProperty('--ls-nav-font', ls.navArrows.fontSize[d]);
    root.style.setProperty('--ls-nav-radius', ls.navArrows.borderRadius[d]);
    root.style.setProperty('--ls-nav-offset', ls.navArrows.sideOffset[d]);
    root.style.setProperty('--ls-nav-top', ls.navArrows.verticalPos[d]);

    // Footer
    root.style.setProperty('--ls-footer-bottom', ls.footer.bottom[d]);

    // System bar
    root.style.setProperty('--ls-system-width', ls.systemBar.width[d]);
    root.style.setProperty('--ls-system-height', ls.systemBar.height[d]);

    // Play button
    root.style.setProperty('--ls-play-width', ls.playBtn.width[d]);
    root.style.setProperty('--ls-play-height', ls.playBtn.height[d]);
    root.style.setProperty('--ls-play-font', ls.playBtn.fontSize[d]);

    // Re-aplicar si cambia el tamaño de ventana (rotación de pantalla en cel)
    window.matchMedia('(max-width: 600px)').addEventListener('change', applyConfig);
})();
