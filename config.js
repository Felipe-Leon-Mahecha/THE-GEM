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
            borderWidth: {
                mobile: '3px',
                desktop: '3px',
            },
        },

        // ── Botón de lápiz (✎) flotante sobre el avatar grande, para editar perfil ──
        editAvatarBtn: {
            // icono: 'emoji' usa el texto de abajo (✎). 'imagen' usa editIconImg (poné la ruta del PNG).
            icono: 'emoji',
            emoji: '✎',
            imagen: '', // ej: 'assets/Imagenes/Iconos/lapiz.png'
            size: {
                mobile: '34px',
                desktop: '34px',
            },
            iconSize: {     // tamaño del emoji o imagen dentro del botón
                mobile: '14px',
                desktop: '14px',
            },
        },

        // ── Botón × para cerrar el modal de perfil ──
        closeBtn: {
            size: {
                mobile: '34px',
                desktop: '34px',
            },
            fontSize: {
                mobile: '16px',
                desktop: '16px',
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

        // ── Símbolo antes del nombre del rango (✦ Chispa) ──
        rangoIcono: {
            icono: 'emoji', // 'emoji' = usa el texto de abajo. 'imagen' = usa rangoImagen (PNG).
            emoji: '✦',
            imagen: '', // ej: 'assets/Imagenes/Iconos/estrella.png'
            imagenSize: {   // tamaño del ícono SOLO si icono:'imagen'
                mobile: '14px',
                desktop: '14px',
            },
        },

        // Barra de progreso de XP (debajo del rango, dentro del hero)
        barraXP: {
            height: {
                mobile: '6px',
                desktop: '6px',
            },
            marginTop: {
                mobile: '6px',
                desktop: '6px',
            },
            labelFont: {     // texto "1234 XP · — XP para siguiente"
                mobile: '10px',
                desktop: '10px',
            },
        },

        // Título "ESTADÍSTICAS DEL JUGADOR"
        seccionTituloFont: {
            mobile: '11px',
            desktop: '11px',
        },

        // Fila de 3 columnas (Top Combo / Victorias / Derrotas)
        statRow: {
            padding: {     // espacio interno de CADA columna (Top Combo / Victorias / Derrotas)
                mobile: '14px 16px',
                desktop: '14px 16px',
            },
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

        // ── Botón REYES (abre la Sala de Reyes / leaderboard) ──
        botonReyes: {
            // icono: 'emoji' usa el texto de abajo (👑). 'imagen' usa coronaImagen (PNG).
            icono: 'emoji',
            emoji: '👑',
            imagen: '', // ej: 'assets/Imagenes/Iconos/corona.png'
            iconSize: {     // tamaño del emoji/imagen dentro del botón
                mobile: '14px',
                desktop: '14px',
            },
            fontSize: {     // tamaño del texto "REYES"
                mobile: '12px',
                desktop: '12px',
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

    // ── Helper: pone un emoji o una imagen dentro de un elemento, según config ──
    // cfg = { icono: 'emoji'|'imagen', emoji: '✦', imagen: 'ruta.png', imagenSize: {mobile,desktop} (opcional) }
    function aplicarIcono(el, cfg, varNombreTamano) {
        if (!el) return;
        if (cfg.icono === 'imagen' && cfg.imagen) {
            el.innerHTML = '<img src="' + cfg.imagen + '" alt=""' +
                (varNombreTamano ? ' style="width:var(' + varNombreTamano + ');height:var(' + varNombreTamano + ');object-fit:contain;vertical-align:middle;"' : '') +
                '>';
        } else {
            el.textContent = cfg.emoji;
        }
    }

    // ── Símbolo "✦" antes del nombre del rango (en el modal de perfil) ──
    // El elemento profileHeroRank tiene el texto "✦ Chispa" junto; lo separamos
    // en un span de ícono + el nombre del rango para poder cambiar solo el ícono.
    const heroRankEl = document.getElementById('profileHeroRank');
    if (heroRankEl) {
        let iconSpan = heroRankEl.querySelector('.pp-rank-icon');
        if (!iconSpan) {
            // Primera vez: separar "✦ Chispa" en ícono + texto del rango
            const rangoTexto = heroRankEl.textContent.replace(/^[^\wÁÉÍÓÚÑáéíóúñ]+/, '').trim();
            heroRankEl.innerHTML = '<span class="pp-rank-icon"></span> <span class="pp-rank-name">' + rangoTexto + '</span>';
            iconSpan = heroRankEl.querySelector('.pp-rank-icon');
        }
        aplicarIcono(iconSpan, pp.rangoIcono, '--pp-rank-icon-size');
    }

    // ── Lápiz "✎" del botón de editar avatar ──
    const editBtnEl = document.querySelector('.profile-preview-edit-btn');
    aplicarIcono(editBtnEl, pp.editAvatarBtn, '--pp-edit-btn-icon-size');

    // ── Corona "👑" del botón REYES (dentro del modal de perfil) ──
    const reyesBtnEl = document.getElementById('btn-reyes-perfil');
    if (reyesBtnEl) {
        let iconSpan = reyesBtnEl.querySelector('.pp-reyes-icon');
        if (!iconSpan) {
            const textoReyes = reyesBtnEl.textContent.replace(/^[^\wÁÉÍÓÚÑáéíóúñ]+/, '').trim();
            reyesBtnEl.innerHTML = '<span class="pp-reyes-icon"></span> <span class="pp-reyes-text">' + textoReyes + '</span>';
            iconSpan = reyesBtnEl.querySelector('.pp-reyes-icon');
        }
        aplicarIcono(iconSpan, pp.botonReyes, '--pp-reyes-icon-size');
    }

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
        root.style.setProperty('--pp-avatar-border-width' + s, pp.avatar.borderWidth[d]);
        root.style.setProperty('--pp-edit-btn-size' + s, pp.editAvatarBtn.size[d]);
        root.style.setProperty('--pp-edit-btn-icon-size' + s, pp.editAvatarBtn.iconSize[d]);
        root.style.setProperty('--pp-close-btn-size' + s, pp.closeBtn.size[d]);
        root.style.setProperty('--pp-close-btn-font' + s, pp.closeBtn.fontSize[d]);
        root.style.setProperty('--pp-name-font' + s, pp.nombreFont[d]);
        root.style.setProperty('--pp-rank-font' + s, pp.rangoFont[d]);
        root.style.setProperty('--pp-rank-icon-size' + s, pp.rangoIcono.imagenSize[d]);
        root.style.setProperty('--pp-xp-bar-height' + s, pp.barraXP.height[d]);
        root.style.setProperty('--pp-xp-bar-margin-top' + s, pp.barraXP.marginTop[d]);
        root.style.setProperty('--pp-xp-label-font' + s, pp.barraXP.labelFont[d]);
        root.style.setProperty('--pp-section-title-font' + s, pp.seccionTituloFont[d]);
        root.style.setProperty('--pp-statrow-padding' + s, pp.statRow.padding[d]);
        root.style.setProperty('--pp-statrow-font' + s, pp.statRow.fontSize[d]);
        root.style.setProperty('--pp-statrow-value-font' + s, pp.statRow.valueFontSize[d]);
        root.style.setProperty('--pp-statsgrid-cols' + s, pp.statsGrid.columns[d]);
        root.style.setProperty('--pp-statsgrid-gap' + s, pp.statsGrid.gap[d]);
        root.style.setProperty('--pp-statcard-padding' + s, pp.statCard.padding[d]);
        root.style.setProperty('--pp-statcard-title-font' + s, pp.statCard.titleFont[d]);
        root.style.setProperty('--pp-statcard-value-font' + s, pp.statCard.valueFont[d]);
        root.style.setProperty('--pp-reyes-icon-size' + s, pp.botonReyes.iconSize[d]);
        root.style.setProperty('--pp-reyes-font' + s, pp.botonReyes.fontSize[d]);

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
    //
    // fondoImagen: PNG de las islas/fondo de ESE mapa (cubre todo el ancho scrolleable).
    // gemaImagen:  PNG de la gema decorativa de ESE mapa (su tamaño/posición se controla
    //              arriba en "gems[i]").
    // Para agregar el Mapa 2 o 3: solo poné la ruta acá, no hace falta tocar otro archivo.
    maps: [
        {
            // MAPA 1 — La Forja Cósmica
            fondoImagen: 'assets/UI/Imagenes Camino de reyes/Islas_mapa_1.png',
            gemaImagen: 'assets/UI/Imagenes Camino de reyes/GEMA_1.png',
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
            fondoImagen: 'assets/UI/Imagenes Camino de reyes/Islas_mapa_2.png',
            gemaImagen: 'assets/UI/Imagenes Camino de reyes/GEMA_2.png',
            nodes: [
                { x: 3, y: 55 },   // nodo  0 — INICIO isla grande izquierda
                { x: 12, y: 30 },   // nodo  1 — paso
                { x: 20, y: 62 },   // nodo  2 — HIERRO ★
                { x: 30, y: 38 },   // nodo  3 — paso
                { x: 38, y: 70 },   // nodo  4 — paso
                { x: 46, y: 28 },   // nodo  5 — PLATA ★
                { x: 53, y: 58 },   // nodo  6 — paso
                { x: 60, y: 35 },   // nodo  7 — ORO ★
                { x: 67, y: 65 },   // nodo  8 — paso
                { x: 74, y: 42 },   // nodo  9 — paso
                { x: 81, y: 25 },   // nodo 10 — PLATINO ★
                { x: 88, y: 55 },   // nodo 11 — paso
                { x: 97, y: 38 },   // nodo 12 — DIAMANTE ★
            ]
        },
        {
            // MAPA 3 — El Palacio de Cristal (rangos 10-17)
            fondoImagen: 'assets/UI/Imagenes Camino de reyes/Islas_mapa_3.png',
            gemaImagen: 'assets/UI/Imagenes Camino de reyes/GEMA_3.png',
            nodes: [
                { x: 3, y: 50 },   // nodo  0 — INICIO isla grande izquierda
                { x: 11, y: 28 },   // nodo  1 — paso
                { x: 18, y: 65 },   // nodo  2 — MAESTRO ★
                { x: 26, y: 35 },   // nodo  3 — paso
                { x: 33, y: 72 },   // nodo  4 — paso
                { x: 41, y: 30 },   // nodo  5 — GRAN MAESTRO ★
                { x: 48, y: 60 },   // nodo  6 — paso
                { x: 55, y: 25 },   // nodo  7 — paso
                { x: 62, y: 68 },   // nodo  8 — CAMPEÓN ★
                { x: 69, y: 38 },   // nodo  9 — paso
                { x: 76, y: 22 },   // nodo 10 — paso
                { x: 82, y: 58 },   // nodo 11 — LEYENDA ★
                { x: 88, y: 32 },   // nodo 12 — paso
                { x: 97, y: 50 },   // nodo 13 — GEMA ★ (rango final)
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
    { rankId: 4, type: 'skin', skinId: 'skin_caballero_bronce', label: '🏆 Recompensa Camino de Rangos I' },

    // ── MAPA 2 — El Núcleo Ardiente ──
    //  nodo 0 — INICIO
    { rankId: null, type: 'none', amount: 0, label: 'Inicio' },
    //  nodo 1 — paso
    { rankId: null, type: 'coins', amount: 25, label: '25 Monedas' },
    //  nodo 2 — HIERRO ★
    { rankId: 5, type: 'coins', amount: 400, label: '400 Monedas' },
    //  nodo 3 — paso
    { rankId: null, type: 'coins', amount: 25, label: '25 Monedas' },
    //  nodo 4 — paso
    { rankId: null, type: 'gems', amount: 8, label: '8 Gemas' },
    //  nodo 5 — PLATA ★
    { rankId: 6, type: 'gems', amount: 50, label: '50 Gemas' },
    //  nodo 6 — paso
    { rankId: null, type: 'gems', amount: 8, label: '8 Gemas' },
    //  nodo 7 — ORO ★
    { rankId: 7, type: 'gems', amount: 80, label: '80 Gemas' },
    //  nodo 8 — paso
    { rankId: null, type: 'gems', amount: 10, label: '10 Gemas' },
    //  nodo 9 — paso
    { rankId: null, type: 'gems', amount: 10, label: '10 Gemas' },
    //  nodo 10 — PLATINO ★
    { rankId: 8, type: 'skin', skinId: 'skin_platino', label: 'Skin: Platino' },
    //  nodo 11 — paso
    { rankId: null, type: 'gems', amount: 15, label: '15 Gemas' },
    //  nodo 12 — DIAMANTE ★
    { rankId: 9, type: 'skin', skinId: 'skin_caballero_plata', label: '🏆 Recompensa Camino de Rangos II' },

    // ── MAPA 3 — El Palacio de Cristal ──
    //  nodo 0 — INICIO
    { rankId: null, type: 'none', amount: 0, label: 'Inicio' },
    //  nodo 1 — paso
    { rankId: null, type: 'gems', amount: 15, label: '15 Gemas' },
    //  nodo 2 — MAESTRO ★
    { rankId: 10, type: 'gems', amount: 100, label: '100 Gemas' },
    //  nodo 3 — paso
    { rankId: null, type: 'gems', amount: 15, label: '15 Gemas' },
    //  nodo 4 — paso
    { rankId: null, type: 'gems', amount: 20, label: '20 Gemas' },
    //  nodo 5 — GRAN MAESTRO ★
    { rankId: 11, type: 'skin', skinId: 'skin_gran_maestro', label: 'Skin: Gran Maestro' },
    //  nodo 6 — paso
    { rankId: null, type: 'gems', amount: 20, label: '20 Gemas' },
    //  nodo 7 — paso
    { rankId: null, type: 'gems', amount: 25, label: '25 Gemas' },
    //  nodo 8 — CAMPEÓN ★
    { rankId: 12, type: 'skin', skinId: 'skin_campeon', label: 'Skin: Campeón' },
    //  nodo 9 — paso
    { rankId: null, type: 'gems', amount: 25, label: '25 Gemas' },
    //  nodo 10 — paso
    { rankId: null, type: 'gems', amount: 30, label: '30 Gemas' },
    //  nodo 11 — LEYENDA ★
    { rankId: 13, type: 'skin', skinId: 'skin_leyenda', label: 'Skin: Leyenda' },
    //  nodo 12 — paso
    { rankId: null, type: 'gems', amount: 30, label: '30 Gemas' },
    //  nodo 13 — GEMA ★
    { rankId: 14, type: 'skin', skinId: 'skin_caballero_dorado', label: '🏆 Recompensa Camino de Rangos III' },
];

// Exponer globalmente para que rank-system.js lo lea
window.RANK_MAP_CONFIG = RANK_MAP_CONFIG;

// ============================================================
//  BARRA DE PROGRESO POR NODOS (mini-camino arriba del mapa)
//  Muestra: ícono del rango actual → puntos → gema del siguiente rango
// ============================================================
window.NODE_BAR_CFG = {
    maxWidth: null,       // px del ancho total de la barra ("largo"). null = 100% (ancho actual, sin cambios)
    trackWrapHeight: 28,  // alto del área donde se dibujan los puntos (px)
    trackHeight: 4,       // grosor de la línea del camino (px)
    dotSize: 12,          // diámetro de los nodos "paso" intermedios (px)
    dotSizeCurrent: 20,   // diámetro del nodo donde está el jugador ahora (px)
    endDotSize: 32,       // diámetro del nodo final (gema del siguiente rango) (px)
    rankIconSize: 24,     // diámetro del ícono del rango actual, arriba a la izquierda (px)
};

// =================================================================
//  HEADER DEL CAMINO DE RANGOS — decoración temática por mapa
//  (hielo / fuego / dorado, banner equipado, bloque de XP)
//  NO necesitas tocar rank-system.js para nada de esto.
// =================================================================
const RANK_HEADER_CONFIG = {

    // ── Activar o desactivar la decoración temática por completo ──
    // Si lo poines en false, el header queda neutro (sin hielo/fuego/dorado).
    activado: true,

    // ── Tamaño/posición general del header (válido para los 3 temas) ──
    header: {
        padding: '20px 28px 16px',
        gap: '20px',
    },

    // ── Bloque "EXPERIENCIA" (antes "TU XP") ──
    bloqueXP: {
        padding: '8px 18px',
        radius: '10px',
        labelFont: '8px',
        labelSpacing: '4px',
        valueFont: '22px',
        unitFont: '9px',
        // Cantidad de partículas (copos/brasas/destellos) flotando dentro del bloque de XP
        cantidadParticulas: 6,
    },

    // ── Título "CAMINO DE RANGOS" ──
    titulo: {
        font: '19px',
        spacing: '3px',
    },

    // ── Línea de brillo animada bajo el header ──
    glow: {
        altura: '2px',
        velocidad: '2.4s', // más alto = más lento
    },

    // ── Velocidad del shimmer dorado (Mapa 3) ──
    shimmerVelocidad: '3.5s',

    // ── Cuántos copos de nieve / brasas decorativas se generan en el fondo del header ──
    particulasFondo: {
        hielo: 14,  // copos de nieve cayendo
        fuego: 12,  // brasas subiendo
    },

    // ── Qué tema usa cada mapa (0 = Mapa 1, 1 = Mapa 2, 2 = Mapa 3) ──
    // Valores posibles: 'hielo', 'fuego', 'dorado', o '' para neutro (sin tema).
    temaPorMapa: ['hielo', 'fuego', 'dorado'],
};
window.RANK_HEADER_CONFIG = RANK_HEADER_CONFIG;

function aplicarRankHeaderConfig() {
    const root = document.documentElement;
    const rh = RANK_HEADER_CONFIG;

    root.style.setProperty('--rh-header-padding', rh.header.padding);
    root.style.setProperty('--rh-header-gap', rh.header.gap);

    root.style.setProperty('--rh-xp-padding', rh.bloqueXP.padding);
    root.style.setProperty('--rh-xp-radius', rh.bloqueXP.radius);
    root.style.setProperty('--rh-xp-label-font', rh.bloqueXP.labelFont);
    root.style.setProperty('--rh-xp-label-spacing', rh.bloqueXP.labelSpacing);
    root.style.setProperty('--rh-xp-value-font', rh.bloqueXP.valueFont);
    root.style.setProperty('--rh-xp-unit-font', rh.bloqueXP.unitFont);

    root.style.setProperty('--rh-title-font', rh.titulo.font);
    root.style.setProperty('--rh-title-spacing', rh.titulo.spacing);

    root.style.setProperty('--rh-glow-height', rh.glow.altura);
    root.style.setProperty('--rh-glow-speed', rh.glow.velocidad);

    root.style.setProperty('--rh-shimmer-speed', rh.shimmerVelocidad);
}

// ── Genera los copos de nieve / brasas decorativas dentro de .rs-header-deco ──
// Se llama cada vez que cambia el tema, para no acumular partículas viejas.
function _generarParticulasFondoHeader(tema) {
    const deco = document.getElementById('rs-header-deco');
    if (!deco) return;
    deco.innerHTML = '';
    if (tema === 'hielo') {
        const cantidad = RANK_HEADER_CONFIG.particulasFondo.hielo;
        for (let i = 0; i < cantidad; i++) {
            const f = document.createElement('div');
            f.className = 'rs-snowflake';
            const size = Math.random() * 3 + 1.5;
            f.style.width = size + 'px';
            f.style.height = size + 'px';
            f.style.left = (Math.random() * 100) + '%';
            f.style.opacity = (Math.random() * 0.5 + 0.3).toString();
            f.style.animationDuration = (3 + Math.random() * 3) + 's';
            f.style.animationDelay = (Math.random() * 4) + 's';
            deco.appendChild(f);
        }
    } else if (tema === 'fuego') {
        const cantidad = RANK_HEADER_CONFIG.particulasFondo.fuego;
        for (let i = 0; i < cantidad; i++) {
            const e = document.createElement('div');
            e.className = 'rs-ember';
            const size = Math.random() * 2.5 + 1;
            e.style.width = size + 'px';
            e.style.height = size + 'px';
            e.style.background = Math.random() > 0.5 ? '#ff8c00' : '#ffae00';
            e.style.left = (Math.random() * 100) + '%';
            e.style.animationDuration = (1.6 + Math.random() * 1.8) + 's';
            e.style.animationDelay = (Math.random() * 3) + 's';
            deco.appendChild(e);
        }
    }
}

// ── Genera las partículas chiquitas dentro del bloque "EXPERIENCIA" ──
function _generarParticulasXP(tema) {
    const cont = document.getElementById('rs-xp-block-particles');
    if (!cont) return;
    cont.innerHTML = '';
    const cantidad = RANK_HEADER_CONFIG.bloqueXP.cantidadParticulas;
    let color = '#00ffe7';
    if (tema === 'hielo') color = '#9fe7ff';
    else if (tema === 'fuego') color = '#ffae00';
    else if (tema === 'dorado') color = '#ffd700';
    for (let i = 0; i < cantidad; i++) {
        const p = document.createElement('div');
        const size = Math.random() * 2 + 1;
        p.style.position = 'absolute';
        p.style.width = size + 'px';
        p.style.height = size + 'px';
        p.style.borderRadius = '50%';
        p.style.background = color;
        p.style.left = (15 + Math.random() * 70) + '%';
        p.style.bottom = '4px';
        p.style.opacity = '0.8';
        p.style.animation = 'riseXpParticle ' + (1.6 + Math.random()) + 's ease-in infinite';
        p.style.animationDelay = (Math.random() * 2) + 's';
        cont.appendChild(p);
    }
    // Inyectar el keyframe una sola vez
    if (!document.getElementById('rs-xp-particle-keyframes')) {
        const style = document.createElement('style');
        style.id = 'rs-xp-particle-keyframes';
        style.textContent = '@keyframes riseXpParticle{0%{transform:translateY(0);opacity:0;}20%{opacity:0.9;}100%{transform:translateY(-30px);opacity:0;}}';
        document.head.appendChild(style);
    }
}

// ── Aplica el banner equipado del jugador como fondo de .rs-compact-profile ──
// Usa el mismo localStorage('equippedBanner') + BANNERS_DATA que ya usa la tienda.
function _aplicarBannerEquipadoHeader() {
    const target = document.getElementById('rs-compact-profile-banner-bg');
    if (!target || typeof BANNERS_DATA === 'undefined') return;
    const bannerId = localStorage.getItem('equippedBanner') || 'static_core';
    const banner = BANNERS_DATA.find(b => b.id === bannerId) || BANNERS_DATA[0];
    if (banner && banner.cover) {
        target.style.backgroundImage = `url("${banner.cover}")`;
    } else {
        target.style.backgroundImage = 'none';
    }
}

// ── Llamar esto cada vez que se abre/actualiza el Camino de Rangos, pasando
//    el índice de mapa activo (0, 1 o 2). rank-system.js ya lo invoca solo. ──
window.aplicarTemaHeaderRangos = function (mapIdx) {
    const header = document.getElementById('rs-header');
    if (!header) return;

    if (!RANK_HEADER_CONFIG.activado) {
        header.classList.remove('tema-hielo', 'tema-fuego', 'tema-dorado');
        return;
    }

    const tema = RANK_HEADER_CONFIG.temaPorMapa[mapIdx] || '';
    header.classList.remove('tema-hielo', 'tema-fuego', 'tema-dorado');
    if (tema) header.classList.add('tema-' + tema);

    _generarParticulasFondoHeader(tema);
    _generarParticulasXP(tema);
    _aplicarBannerEquipadoHeader();
};

aplicarRankHeaderConfig();

