// ============================================================
//  THE GEM — config.js
//  Aquí puedes modificar tamaños y posiciones de los elementos
//  del juego para PC y móvil por separado.
//  Cambia un número acá y se aplica en todo el juego.
// ============================================================

const GEM_CONFIG = {

    // --------------------------------------------------------
    //  TEMA GLOBAL — Colores y fuentes de TODO el juego
    //  Cambia un valor aquí y se actualiza en cada pantalla
    //  (tienda, menú, selección de nivel, etc.)
    // --------------------------------------------------------
    tema: {
        colores: {
            cian: '#00ffe7',          // color principal/acento (brillos, texto destacado)
            rojo: '#ff2d55',          // color de alerta / rareza DEMON
            rosa: '#ff4d6d',          // título "TIENDA", acentos rosa
            rosaClaro: '#ff9ab0',     // detalles secundarios rosados
            verdeNeon: '#00ffae',     // confirmaciones, badges de "desbloqueado"
            rojoError: '#ff4466',     // textos de error / bloqueado
            azul: '#0088ff',          // gradientes secundarios
        },
        fuentes: {
            principal: "'Geom', monospace",       // fuente de títulos y UI principal
            secundaria: 'monospace',               // fuente de textos generales
            especial: '"Audiowide", "Geom", sans-serif', // fuente de detalles especiales
        },
    },

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
        // Controla el ancho del panel y su separación de los bordes
        panel: {
            mobile: { width: '42%', right: '24px', paddingTop: '92px', paddingBottom: '14px' },
            desktop: { width: '53%', paddingBottom: '80px' },
        },

        // Espacio entre los botones del menú (filas)
        botones: {
            mobile: { gap: '10px' },
            desktop: { gap: '14px' },
        },

        // Ancho del botón JUGAR (el de arriba, ancho completo por defecto)
        // Solo aplica en desktop: en móvil siempre usa el ancho del panel
        botonJugar: {
            desktop: { width: '1%' },
        },

        // Espacio entre TIENDA/INVENTARIO y entre LOGROS/AYUDA (los pares de 2 botones)
        botonesPares: {
            desktop: { gap: '14px' },
        },

        // --------------------------------------------------------
        //  TAMAÑO DE LOS BOTONES EN PAREJA (TIENDA/INVENTARIO y LOGROS/AYUDA)
        //  Cada par vive en un grid de 2 columnas. Los números son una
        //  PROPORCIÓN entre ellos (no %), así que SIEMPRE ocupan el
        //  ancho total sin desbordarse ni descuadrarse.
        //  Ejemplos:
        //    1 / 1   → mismo tamaño (por defecto)
        //    1.4 / 1 → el primero (TIENDA o LOGROS) más grande
        //    1 / 1.4 → el segundo (INVENTARIO o AYUDA) más grande
        // --------------------------------------------------------
        botonesPorPar: {
            tiendaInventario: {
                mobile: { tienda: 1, inventario: 1 }, // mismo tamaño por defecto, pero puedes cambiar la proporción para destacar uno de los dos botones
                desktop: { tienda: 1, inventario: 1.19 }, // el botón de INVENTARIO es un 40% más ancho que el de TIENDA
            },
            logrosAyuda: {
                mobile: { logros: 1, ayuda: 1 },
                desktop: { logros: 1, ayuda: 1 },
            },
        },

        // --------------------------------------------------------
        //  BANNER DE PERFIL (arriba a la derecha, con avatar/nombre/monedas)
        // --------------------------------------------------------
        perfil: {
            // Posición y ancho del cuadro completo
            posicion: {
                mobile: { width: '24%', right: '24px', top: '12px' },
                desktop: { width: '50%', maxWidth: '320px' },
            },
            // Tamaño del cuadro (alto, bordes redondeados, espacio interno)
            tamano: {
                mobile: { height: '82px', borderRadius: '10px', padding: '10px' },
                desktop: { height: '82px', borderRadius: '10px', padding: '10px' },
            },
            // Avatar circular dentro del banner
            avatar: {
                mobile: { size: '32px' },
                desktop: { size: '52px' },
            },
            // Texto del nombre del jugador (ej: "Jugador")
            nombreFont: {
                mobile: { size: '11px' },
                desktop: { size: '17px' },
            },
            // Texto del rango/nivel (ej: "CHISPA")
            rangoFont: {
                mobile: { size: '9px' },
                desktop: { size: '14px' },
            },

            // Control de tamaño de Gemas (Rubíes), Monedas y sus PNGs en el menú
            monetizacion: {
                gap: {
                    mobile: '4px',
                    desktop: '6px'
                },
                padding: {
                    mobile: '2px 6px',
                    desktop: '4px 8px'
                },
                fontSize: {
                    mobile: '10px',
                    desktop: '16px' // Tamaño del número de monedas/gemas
                },
                iconSize: {
                    mobile: '12px',
                    desktop: '16px' // Tamaño de los PNG de las monedas y gemas
                },
            },

        },

    },

    // --------------------------------------------------------
    //  PERFIL DEL JUGADOR (MODAL) — la ventana grande con
    //  "ESTADÍSTICAS DEL JUGADOR" que se abre al tocar el perfil.
    //  OJO: esto NO es el banner chiquito de arriba a la derecha
    //  (ese está en menu.perfil) — esto es el popup completo.
    //
    //  Por defecto mobile y desktop tienen los MISMOS valores
    //  (los que ya tenía el juego), así que no cambia nada visualmente
    //  hasta que vos edites los números de "mobile" para achicarlo
    //  en celular si lo ves muy grande ahí.
    // --------------------------------------------------------
    perfilModal: {

        // Tamaño general de la tarjeta (el rectángulo completo)
        card: {
            width: {
                mobile: 'min(760px, calc(100vw - 32px))',
                desktop: 'min(760px, calc(100vw - 32px))',
            },
            // Alto máximo antes de que aparezca el scroll interno.
            // Si esto es muy grande, se corta contra los bordes de la pantalla.
            // Si es muy chico, vas a scrollear más rápido.
            maxHeight: {
                mobile: 'calc(100dvh - 28px)',
                desktop: 'calc(100dvh - 28px)',
            },
        },

        // Zona de arriba: avatar grande + nombre + rango + barra de XP
        hero: {
            padding: {
                mobile: '32px 28px 24px',
                desktop: '32px 28px 24px',
            },
            gap: {   // espacio entre el avatar y el bloque de texto
                mobile: '22px',
                desktop: '22px',
            },
        },

        // Avatar circular grande (arriba a la derecha del hero)
        avatar: {
            size: {
                mobile: '110px',
                desktop: '110px', // si lo bajás en mobile, ayuda mucho a que entre todo sin scrollear tanto
            },
        },

        // Nombre del jugador (ej: "JUAN")
        nombreFont: {
            mobile: '28px',
            desktop: '28px',
        },

        // Rango (ej: "✦ CHISPA")
        rangoFont: {
            mobile: '15px',
            desktop: '15px',
        },

        // Título "ESTADÍSTICAS DEL JUGADOR"
        seccionTituloFont: {
            mobile: '11px',
            desktop: '11px',
        },

        // Fila de 3 columnas (Top Combo / Victorias / Derrotas)
        statRow: {
            fontSize: {
                mobile: '12px',
                desktop: '12px',
            },
            valueFontSize: {
                mobile: '22px',
                desktop: '22px',
            },
        },

        // Grid de 6 tarjetas (Juegos jugados, Total horas, Monedas, etc.)
        statsGrid: {
            columns: {     // número de columnas del grid (2 = como está ahora)
                mobile: 2,
                desktop: 2,
            },
            gap: {
                mobile: '10px',
                desktop: '10px',
            },
        },

        // Cada tarjeta individual dentro del grid de 6
        statCard: {
            padding: {
                mobile: '16px 18px',
                desktop: '16px 18px',
            },
            titleFont: {     // texto chico (ej: "Juegos jugados")
                mobile: '11px',
                desktop: '11px',
            },
            valueFont: {     // número grande (ej: "0")
                mobile: '22px',
                desktop: '22px',
            },
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
            top: { mobile: '14px', desktop: '-14px' },
            // Ancho del contenedor del header
            width: { mobile: '96%', desktop: '92%' },
        },

        // --- TÍTULO: caja que encierra "THE GEM / SELECCIONAR NIVEL" ---
        titleBox: {
            // Activar o desactivar el cuadro visual alrededor del título
            enabled: true,
            padding: { mobile: '10px 16px', desktop: '14px 26px' },
            borderRadius: { mobile: '12px', desktop: '14px' },
            background: 'rgba(0,0,0,0)',
            border: '1px solid rgba(0, 255, 231, 0.18)',
            backdropBlur: 'blur(10px)',
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

        // --- PREVIEW DERECHA: textos sobre el fondo grande del nivel ---
        preview: {
            // Texto pequeño arriba del título (ej: "NIVEL 01 · THE GEM")
            // Ponlo en false para ocultarlo
            kicker: {
                enabled: false,
            },
            // Título grande con el nombre del nivel (ej: "THE BEGGIN")
            tituloGrande: {
                mobile: { size: '26px' },
                desktop: { size: '46px' },
            },
        },

        // --- DIFICULTAD: los rombos/puntos debajo del título ---
        dificultad: {
            forma: 'rombo', // 'rombo' o 'circulo'
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

    // --------------------------------------------------------
    //  BANNER DE VERSIÓN — Esquina inferior izquierda del menú
    //  Cambia el texto que se muestra encima del PNG de versión.
    // --------------------------------------------------------
    versionBanner: {
        lineaUno: 'VERSION 0.5',     // texto de arriba (blanco)
        lineaDos: 'MADE BY FELIX',   // texto de abajo (rosa)
    },

};

// ============================================================
//  APLICADOR AUTOMÁTICO
//  No toques esto — lee el config de arriba y lo aplica en CSS.
//
//  FIX MÓVIL: Siempre escribe AMBOS sets de variables (mobile y
//  desktop) para que el CSS pueda usarlas sin importar cuándo
//  detecte el dispositivo (body.is-touch-device se añade tarde).
// ============================================================
function applyConfig() {
    const root = document.documentElement;
    const t = GEM_CONFIG.tienda;
    const m = GEM_CONFIG.menu;
    const mp = m.perfil;
    const mm = mp.monetizacion;
    const sb = GEM_CONFIG.tiendaSidebar;
    const ls = GEM_CONFIG.levelSelect;
    const tema = GEM_CONFIG.tema;
    const pp = GEM_CONFIG.perfilModal;

    // ── TEMA GLOBAL: colores y fuentes (no dependen de mobile/desktop) ──
    root.style.setProperty('--color-cian', tema.colores.cian);
    root.style.setProperty('--color-rojo', tema.colores.rojo);
    root.style.setProperty('--color-rosa', tema.colores.rosa);
    root.style.setProperty('--color-rosa-claro', tema.colores.rosaClaro);
    root.style.setProperty('--color-verde-neon', tema.colores.verdeNeon);
    root.style.setProperty('--color-rojo-error', tema.colores.rojoError);
    root.style.setProperty('--color-azul', tema.colores.azul);
    root.style.setProperty('--font-principal', tema.fuentes.principal);
    root.style.setProperty('--font-secundaria', tema.fuentes.secundaria);
    root.style.setProperty('--font-especial', tema.fuentes.especial);

    // Dificultad: rombo o círculo (no depende de mobile/desktop)
    const esRombo = ls.dificultad.forma === 'rombo';
    root.style.setProperty('--lsc-diff-radius', esRombo ? '1px' : '50%');
    root.style.setProperty('--lsc-diff-rotate', esRombo ? '45deg' : '0deg');
    root.style.setProperty('--lsc-kicker-display', ls.preview.kicker.enabled ? 'block' : 'none');
    root.style.setProperty('--ls-title-box-display', ls.titleBox.enabled ? 'inline-flex' : 'contents');
    root.style.setProperty('--ls-title-box-bg', ls.titleBox.background);
    root.style.setProperty('--ls-title-box-border', ls.titleBox.border);
    root.style.setProperty('--ls-title-box-blur', ls.titleBox.backdropBlur);
    root.style.setProperty('--shop-title-color', sb.titulo.color);

    // ── Banner de versión (texto, no depende de mobile/desktop) ──
    const vb = GEM_CONFIG.versionBanner;
    const vbLine1 = document.getElementById('version-banner-line1');
    const vbLine2 = document.getElementById('version-banner-line2');
    if (vbLine1) vbLine1.textContent = vb.lineaUno;
    if (vbLine2) vbLine2.textContent = vb.lineaDos;

    // ── APLICAR AMBOS SETS: mobile y desktop ──
    // El CSS usa body.is-touch-device para móvil, NO media queries de ancho.
    // Si solo escribimos el set del dispositivo actual, las variables "-mobile"
    // quedan vacías y el CSS cae al default hardcodeado. Solución: escribir todo.
    ['mobile', 'desktop'].forEach(function (d) {

        // Sufijo para las variables que el CSS distingue por nombre
        const s = d === 'mobile' ? '-mobile' : '';

        // ── Monedas del menú ──
        root.style.setProperty('--menu-currency-gap' + s, mm.gap[d]);
        root.style.setProperty('--menu-currency-padding' + s, mm.padding[d]);
        root.style.setProperty('--menu-currency-font' + s, mm.fontSize[d]);
        root.style.setProperty('--menu-currency-icon-size' + s, mm.iconSize[d]);

        // ── Tienda ──
        root.style.setProperty('--cfg-vip-height' + s, t.bannerVIP[d].height);
        root.style.setProperty('--cfg-ruby-width' + s, t.rubyPass[d].width);
        root.style.setProperty('--cfg-ruby-height' + s, t.rubyPass[d].height);
        root.style.setProperty('--cfg-banner-row-direction' + s, t.bannerRow[d].flexDirection);
        root.style.setProperty('--cfg-banner-row-gap' + s, t.bannerRow[d].gap);
        root.style.setProperty('--cfg-grid-cols' + s, t.panelGrid[d].columns);
        root.style.setProperty('--cfg-grid-gap' + s, t.panelGrid[d].gap);

        // ── Mute BTN ──
        const mute = GEM_CONFIG.muteBTN[d];
        root.style.setProperty('--cfg-mute-size' + s, mute.size);
        root.style.setProperty('--cfg-mute-bottom' + s, mute.bottom);
        root.style.setProperty('--cfg-mute-right' + s, mute.right);

        // ── Perfil del jugador (modal de estadísticas) ──
        root.style.setProperty('--pp-card-width' + s, pp.card.width[d]);
        root.style.setProperty('--pp-card-maxheight' + s, pp.card.maxHeight[d]);
        root.style.setProperty('--pp-hero-padding' + s, pp.hero.padding[d]);
        root.style.setProperty('--pp-hero-gap' + s, pp.hero.gap[d]);
        root.style.setProperty('--pp-avatar-size' + s, pp.avatar.size[d]);
        root.style.setProperty('--pp-name-font' + s, pp.nombreFont[d]);
        root.style.setProperty('--pp-rank-font' + s, pp.rangoFont[d]);
        root.style.setProperty('--pp-section-title-font' + s, pp.seccionTituloFont[d]);
        root.style.setProperty('--pp-statrow-font' + s, pp.statRow.fontSize[d]);
        root.style.setProperty('--pp-statrow-value-font' + s, pp.statRow.valueFontSize[d]);
        root.style.setProperty('--pp-statsgrid-cols' + s, pp.statsGrid.columns[d]);
        root.style.setProperty('--pp-statsgrid-gap' + s, pp.statsGrid.gap[d]);
        root.style.setProperty('--pp-statcard-padding' + s, pp.statCard.padding[d]);
        root.style.setProperty('--pp-statcard-title-font' + s, pp.statCard.titleFont[d]);
        root.style.setProperty('--pp-statcard-value-font' + s, pp.statCard.valueFont[d]);

        // ── Menú principal — panel de botones ──
        // Las variables "-mobile" son las que usa el CSS cuando body.is-touch-device
        root.style.setProperty('--menu-panel-width' + s, d === 'mobile' ? m.panel.mobile.width : m.panel.desktop.width);
        root.style.setProperty('--menu-panel-right' + s, d === 'mobile' ? m.panel.mobile.right : '0');
        root.style.setProperty('--menu-panel-padding-top' + s, d === 'mobile' ? m.panel.mobile.paddingTop : '0');
        root.style.setProperty('--menu-panel-padding-bottom' + s, d === 'mobile' ? m.panel.mobile.paddingBottom : m.panel.desktop.paddingBottom);
        root.style.setProperty('--menu-btn-gap' + s, d === 'mobile' ? m.botones.mobile.gap : m.botones.desktop.gap);
        if (d === 'desktop') {
            root.style.setProperty('--menu-play-width', m.botonJugar.desktop.width);
            root.style.setProperty('--menu-btn-pair-gap', m.botonesPares.desktop.gap);
        }

        // ── Tamaño de los botones en pareja (proporción de columnas, sin desborde) ──
        const bp = m.botonesPorPar;
        const ti = bp.tiendaInventario[d];
        const la = bp.logrosAyuda[d];
        root.style.setProperty('--grid-shop-inventory-cols' + s, ti.tienda + 'fr ' + ti.inventario + 'fr');
        root.style.setProperty('--grid-achievements-help-cols' + s, la.logros + 'fr ' + la.ayuda + 'fr');

        // ── Menú principal — perfil ──
        root.style.setProperty('--menu-profile-width' + s, d === 'mobile' ? mp.posicion.mobile.width : mp.posicion.desktop.width);
        root.style.setProperty('--menu-profile-right' + s, d === 'mobile' ? mp.posicion.mobile.right : '0');
        root.style.setProperty('--menu-profile-top' + s, d === 'mobile' ? mp.posicion.mobile.top : '0');
        if (d === 'desktop') {
            root.style.setProperty('--menu-profile-maxwidth', mp.posicion.desktop.maxWidth);
        }
        root.style.setProperty('--menu-banner-height' + s, mp.tamano[d].height);
        root.style.setProperty('--menu-banner-radius' + s, mp.tamano[d].borderRadius);
        root.style.setProperty('--menu-banner-padding' + s, mp.tamano[d].padding);
        root.style.setProperty('--menu-avatar-size' + s, mp.avatar[d].size);
        root.style.setProperty('--menu-profile-name-font' + s, mp.nombreFont[d].size);
        root.style.setProperty('--menu-profile-level-font' + s, mp.rangoFont[d].size);

        // ── Sidebar tienda ──
        root.style.setProperty('--shop-sidebar-width' + s, sb.width[d]);
        root.style.setProperty('--shop-header-padding' + s, sb.header.padding[d]);
        root.style.setProperty('--shop-title-font' + s, sb.titulo.fontSize[d]);
        root.style.setProperty('--shop-back-padding' + s, sb.backBtn.padding[d]);
        root.style.setProperty('--shop-back-font' + s, sb.backBtn.fontSize[d]);
        root.style.setProperty('--shop-profile-padding' + s, sb.profileSection.padding[d]);
        root.style.setProperty('--shop-label-font' + s, sb.labelFont[d]);
        root.style.setProperty('--shop-banner-height' + s, sb.profileBanner.height[d]);
        root.style.setProperty('--shop-banner-radius' + s, sb.profileBanner.borderRadius[d]);
        root.style.setProperty('--shop-banner-padding' + s, sb.profileBanner.padding[d]);
        root.style.setProperty('--shop-avatar-size' + s, sb.avatar.size[d]);
        root.style.setProperty('--shop-profile-name-font' + s, sb.profileName.fontSize[d]);
        root.style.setProperty('--shop-profile-level-font' + s, sb.profileLevel.fontSize[d]);
        root.style.setProperty('--shop-banner-name-font' + s, sb.bannerName.fontSize[d]);
        root.style.setProperty('--shop-currency-gap' + s, sb.currency.gap[d]);
        root.style.setProperty('--shop-currency-padding' + s, sb.currency.padding[d]);
        root.style.setProperty('--shop-currency-label-font' + s, sb.currency.labelFont[d]);
        root.style.setProperty('--shop-currency-value-font' + s, sb.currency.valueFont[d]);
        root.style.setProperty('--shop-currency-icon-size' + s, sb.currency.iconSize[d]);
        root.style.setProperty('--shop-equipped-padding' + s, sb.equipped.padding[d]);
        root.style.setProperty('--shop-equipped-size' + s, sb.equipped.previewSize[d]);
        root.style.setProperty('--shop-equipped-name-font' + s, sb.equipped.nameFont[d]);
        root.style.setProperty('--shop-equipped-rarity-font' + s, sb.equipped.rarityFont[d]);

        // ── Level Select ──
        root.style.setProperty('--ls-header-top' + s, ls.header.top[d]);
        root.style.setProperty('--ls-header-width' + s, ls.header.width[d]);
        root.style.setProperty('--ls-title-box-padding' + s, ls.titleBox.padding[d]);
        root.style.setProperty('--ls-title-box-radius' + s, ls.titleBox.borderRadius[d]);
        root.style.setProperty('--ls-font-small' + s, ls.titleFont.small[d]);
        root.style.setProperty('--ls-font-large' + s, ls.titleFont.large[d]);
        root.style.setProperty('--ls-back-top' + s, ls.backBtn.top[d]);
        root.style.setProperty('--ls-back-height' + s, ls.backBtn.height[d]);
        root.style.setProperty('--ls-back-font' + s, ls.backBtn.fontSize[d]);
        root.style.setProperty('--ls-back-padding' + s, ls.backBtn.padding[d]);
        root.style.setProperty('--ls-playerbar-top' + s, ls.playerBar.top[d]);
        root.style.setProperty('--ls-nav-size' + s, ls.navArrows.size[d]);
        root.style.setProperty('--ls-nav-font' + s, ls.navArrows.fontSize[d]);
        root.style.setProperty('--ls-nav-radius' + s, ls.navArrows.borderRadius[d]);
        root.style.setProperty('--ls-nav-offset' + s, ls.navArrows.sideOffset[d]);
        root.style.setProperty('--ls-nav-top' + s, ls.navArrows.verticalPos[d]);
        root.style.setProperty('--ls-footer-bottom' + s, ls.footer.bottom[d]);
        root.style.setProperty('--ls-system-width' + s, ls.systemBar.width[d]);
        root.style.setProperty('--ls-system-height' + s, ls.systemBar.height[d]);
        root.style.setProperty('--ls-play-width' + s, ls.playBtn.width[d]);
        root.style.setProperty('--ls-play-height' + s, ls.playBtn.height[d]);
        root.style.setProperty('--ls-play-font' + s, ls.playBtn.fontSize[d]);
        root.style.setProperty('--lsc-title-big-size' + s, ls.preview.tituloGrande[d].size);
    });
}

// ── Aplicar variables CSS del mapa de rangos ──
function applyRankMapConfig() {
    const root = document.documentElement;
    const rm = window.RANK_MAP_CONFIG;
    if (!rm) return;
    const n = rm.node || {};
    const av = rm.avatar || {};
    root.style.setProperty('--rsm-node-size', (n.sizePx || 42) + 'px');
    root.style.setProperty('--rsm-node-size-current', (n.sizePxCurrent || 54) + 'px');
    root.style.setProperty('--rsm-node-font', (n.fontSize || 15) + 'px');
    root.style.setProperty('--rsm-node-font-current', (n.fontSizeCurrent || 20) + 'px');
    root.style.setProperty('--rsm-label-font', (n.labelFontSize || 10) + 'px');
    root.style.setProperty('--rsm-xp-font', (n.xpFontSize || 9) + 'px');
    root.style.setProperty('--rsm-avatar-size', (av.sizePx || 46) + 'px');
}
applyRankMapConfig();

// Exponer globalmente para que otros scripts puedan re-aplicar si necesitan
window.applyGemConfig = applyConfig;
window.applyRankMapConfig = applyRankMapConfig;

// Aplicar al cargar
applyConfig();

// Re-aplicar si rota la pantalla o cambia el tamaño de ventana
window.matchMedia('(max-width: 600px)').addEventListener('change', applyConfig);

// ============================================================
//  CAMINO DE RANGOS — MAPA 1 "La Forja Cósmica"
//  Edita aquí las posiciones de los nodos (x,y en % del mapa)
//  y el resto de parámetros visuales.
//
//  x: 0 = borde izquierdo, 100 = borde derecho (2200px total)
//  y: 0 = borde superior,  100 = borde inferior
//
//  Nodos en orden: [Chispa, Brillo Opaco, Reflejo, Bronce]
//  El jugador (skin) aparece sobre el nodo de su rango actual.
// ============================================================
const RANK_MAP_CONFIG = {

    // ── Dimensiones del lienzo del mapa ──
    mapWidth: 2200,   // px — ancho total scrolleable
    mapHeight: 'auto', // 'auto' = usa la altura del contenedor

    // ── Tamaño de los nodos ──
    node: {
        sizePx: 42,   // diámetro del círculo (px)
        sizePxCurrent: 54,   // diámetro del nodo ACTUAL (px)
        fontSize: 15,   // emoji/icono tamaño normal
        fontSizeCurrent: 20, // emoji/icono tamaño actual
        labelFontSize: 10,   // px — nombre del rango bajo el nodo
        xpFontSize: 9,    // px — "XXX XP" bajo el nombre
    },

    // ── Avatar del jugador sobre su nodo ──
    avatar: {
        sizePx: 46,    // diámetro del círculo avatar
        offsetY: -130,   // % — qué tan arriba del nodo aparece (-130 = encima)
    },

    // ── Gemas decorativas — una por mapa ──
    // xPct/yPct: posición en % del ancho/alto del mapa (0-100)
    // sizePx: tamaño de la imagen en píxeles
    gems: [
        { sizePx: 90, xPct: 44.5, yPct: 17 },   // Mapa 1 — La Forja Cósmica
        { sizePx: 90, xPct: 28, yPct: 42 },   // Mapa 2 — El Núcleo Ardiente
        { sizePx: 90, xPct: 50, yPct: 35 },   // Mapa 3 — El Palacio de Cristal
    ],



    // ── Mapas y sus nodos ──
    // Cada nodo: { x: %horizontal, y: %vertical }
    // Ajusta estos valores para que los nodos caigan sobre las islas
    maps: [
        {
            // MAPA 1 — La Forja Cósmica
            // 12 nodos: INICIO → paso → Chispa → paso → paso → Brillo Opaco → paso → paso → Reflejo → paso → paso → Bronce
            // Ajusta x (0-100 horizontal) e y (0-100 vertical) para que caigan sobre las islas
            nodes: [
                { x: 3, y: 45 },   // nodo  0 — INICIO (isla grande izquierda)
                { x: 17, y: 25 },   // nodo  1 — paso   (15 monedas)
                { x: 20, y: 52 },   // nodo  2 — CHISPA ★ (200 monedas)
                { x: 33, y: 29 },   // nodo  3 — paso   (15 monedas)
                { x: 37, y: 57 },   // nodo  4 — paso   (15 monedas)
                { x: 43, y: 78 },   // nodo  5 — BRILLO OPACO ★ (600 monedas)
                { x: 53, y: 34 },   // nodo  6 — paso   (5 gemas)
                { x: 59, y: 55 },   // nodo  7 — paso   (5 gemas)
                { x: 67, y: 63 },   // nodo  8 — REFLEJO ★ (30 gemas)
                { x: 76, y: 23 },   // nodo  9 — paso   (5 gemas)
                { x: 83, y: 42 },   // nodo 10 — paso   (5 gemas)
                { x: 97, y: 42 },   // nodo 11 — BRONCE ★ (skin Caballero Bronce)
            ]
        },
        {
            // MAPA 2 — El Núcleo Ardiente (rangos 5-9)
            nodes: [
                { x: 10, y: 70 },
                { x: 28, y: 30 },
                { x: 50, y: 65 },
                { x: 72, y: 28 },
                { x: 90, y: 60 },
            ]
        },
        {
            // MAPA 3 — El Palacio de Cristal (rangos 10-17)
            nodes: [
                { x: 8, y: 80 },
                { x: 22, y: 45 },
                { x: 38, y: 75 },
                { x: 52, y: 35 },
                { x: 62, y: 65 },
                { x: 74, y: 30 },
                { x: 86, y: 60 },
                { x: 94, y: 25 },
            ]
        }
    ]
};

// ── Definición de recompensas por nodo (Mapa 1) ──
// type: 'none' | 'coins' | 'gems' | 'skin'
// amount: cantidad (para coins/gems)
// skinId: id de la skin (para type:'skin')
// rankId: si es nodo de rango real, el id del rango (1-17). null = nodo decorativo
RANK_MAP_CONFIG.nodeRewards = [
    //  nodo 0 — INICIO
    { rankId: null, type: 'none', amount: 0, label: 'Inicio' },
    //  nodo 1 — paso
    { rankId: null, type: 'coins', amount: 15, label: '15 Monedas' },
    //  nodo 2 — CHISPA ★
    { rankId: 1, type: 'coins', amount: 200, label: '200 Monedas' },
    //  nodo 3 — paso
    { rankId: null, type: 'coins', amount: 15, label: '15 Monedas' },
    //  nodo 4 — paso
    { rankId: null, type: 'coins', amount: 15, label: '15 Monedas' },
    //  nodo 5 — BRILLO OPACO ★
    { rankId: 2, type: 'coins', amount: 600, label: '600 Monedas' },
    //  nodo 6 — paso
    { rankId: null, type: 'gems', amount: 5, label: '5 Gemas' },
    //  nodo 7 — paso
    { rankId: null, type: 'gems', amount: 5, label: '5 Gemas' },
    //  nodo 8 — REFLEJO ★
    { rankId: 3, type: 'gems', amount: 30, label: '30 Gemas' },
    //  nodo 9 — paso
    { rankId: null, type: 'gems', amount: 5, label: '5 Gemas' },
    //  nodo 10 — paso
    { rankId: null, type: 'gems', amount: 5, label: '5 Gemas' },
    //  nodo 11 — BRONCE ★
    { rankId: 4, type: 'skin', skinId: 'skin_caballero_dorado', label: 'Skin: Caballero Dorado' },
];

// Exponer globalmente para que rank-system.js lo lea
window.RANK_MAP_CONFIG = RANK_MAP_CONFIG;
