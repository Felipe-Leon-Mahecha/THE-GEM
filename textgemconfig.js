// ============================================================
//  THE GEM — textgemconfig.js
//  Capa de DATOS: textos, tema (colores/fuentes), rangos (nombres/
//  colores), rutas de imágenes de botones y banner de versión.
//  Todo lo que es TAMAÑO/POSICIÓN/RESPONSIVE vive en layoutconfig.js
//  (window.GEM_LAYOUT) — ese archivo se carga DESPUÉS de este.
//  Cambia un valor acá y se aplica en todo el juego.
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
    //  ESTILOS DE TEXTO INDEPENDIENTES (bloque 3.1)
    //  Por defecto TODOS los textos usan el color y la fuente GLOBAL de
    //  arriba (tema.colores / tema.fuentes). Si quieres que UN texto
    //  puntual se vea diferente SIN afectar el resto del juego, agrégalo
    //  aquí usando el mismo "id" que tiene en el HTML.
    //
    //  Ejemplo — quiero que el título "OPCIONES" se vea rosa y con la
    //  fuente especial, sin tocar nada más:
    //    'txt-opt-titulo': { color: '#ff4d6d', fuente: 'var(--font-especial)' },
    //
    //  color:  cualquier color CSS válido ('#ff4d6d', 'red', 'rgb(...)'),
    //          o un DEGRADADO completo tipo:
    //          'linear-gradient(90deg, #FFD700, #B8860B)'
    //          (si empieza con "linear-gradient(" se aplica automático
    //          como degradado de texto, no hace falta nada más).
    //  fuente: 'var(--font-principal)' / 'var(--font-secundaria)' /
    //          'var(--font-especial)' (las 3 de arriba), o una fuente
    //          nueva escrita directo (ej: "'Cinzel', serif").
    //  Deja color/fuente en null, o deja la línea comentada, para que
    //  ese texto siga usando el estilo global normal.
    //
    //  Abajo están TODOS los ids válidos de Menú principal, Panel de
    //  Estadísticas, Panel de Opciones (bloques 1 y 2) y Camino de Reyes,
    //  comentados y listos para descomentar el que quieras personalizar.
    // --------------------------------------------------------
    estilosTexto: {

        // ── Menú principal ──
        // 'txt-menu-clasificacion': { color: null, fuente: null },

        // ── Game Over ──
        // 'txt-go-kicker': { color: null, fuente: null },
        // 'go-title': { color: null, fuente: null },   // el número de nivel lo pinta main.js
        // 'go-sub': { color: null, fuente: null },
        // 'go-retry': { color: null, fuente: null },
        // 'go-levels': { color: null, fuente: null },
        // 'go-menu': { color: null, fuente: null },

        // ── Game Win ──
        // 'gw-menu': { color: null, fuente: null },
        // 'gw-levels': { color: null, fuente: null },
        // 'gw-retry': { color: null, fuente: null },

        // ── Panel de Estadísticas ──
        // 'txt-profile-stats-title': { color: null, fuente: null },
        // 'txt-stat-label-combo': { color: null, fuente: null },
        // 'txt-stat-label-wins': { color: null, fuente: null },
        // 'txt-stat-label-losses': { color: null, fuente: null },
        // 'txt-stat-title-games': { color: null, fuente: null },
        // 'txt-stat-title-days': { color: null, fuente: null },
        // 'txt-stat-title-coins': { color: null, fuente: null },
        // 'txt-stat-title-gems': { color: null, fuente: null },
        // 'txt-stat-title-collection': { color: null, fuente: null },
        // 'txt-stat-title-survival': { color: null, fuente: null },
        // 'txt-stat-title-lastseen': { color: null, fuente: null },
        // 'txt-stat-title-streak': { color: null, fuente: null },

        // ── Editar perfil (modal) ──
        // 'txt-profileedit-title': { color: null, fuente: null },
        // 'txt-profileedit-label-name': { color: null, fuente: null },
        // 'txt-profileedit-label-avatar': { color: null, fuente: null },
        // 'profileEditCancelBtn': { color: null, fuente: null },
        // 'profileEditSaveBtn': { color: null, fuente: null },

        // ── Opciones — general ──
        // 'txt-opt-titulo': { color: null, fuente: null },
        // 'txt-opt-btn-cerrar': { color: null, fuente: null },

        // ── Opciones — Controles ──
        // 'txt-opt-controles-titulo': { color: null, fuente: null },
        // 'txt-opt-key-mover': { color: null, fuente: null },
        // 'txt-opt-key-gravedad': { color: null, fuente: null },
        // 'txt-opt-key-power1': { color: null, fuente: null },
        // 'txt-opt-key-power2': { color: null, fuente: null },
        // 'txt-opt-btn-cambiar-controles': { color: null, fuente: null },

        // ── Opciones — Reasignar Teclas ──
        // 'txt-opt-reasignar-titulo': { color: null, fuente: null },
        // 'txt-opt-keybind-izquierda': { color: null, fuente: null },
        // 'txt-opt-keybind-derecha': { color: null, fuente: null },
        // 'txt-opt-keybind-gravedad': { color: null, fuente: null },
        // 'txt-opt-keybind-power1': { color: null, fuente: null },
        // 'txt-opt-keybind-power2': { color: null, fuente: null },
        // 'txt-opt-btn-restaurar': { color: null, fuente: null },

        // ── Opciones — Audio ──
        // 'txt-opt-audio-titulo': { color: null, fuente: null },
        // 'txt-opt-audio-musica': { color: null, fuente: null },
        // 'txt-opt-audio-efectos': { color: null, fuente: null },

        // ── Opciones — Visual ──
        // 'txt-opt-visual-titulo': { color: null, fuente: null },
        // 'txt-opt-btn-rendimiento': { color: null, fuente: null },

        // ── Opciones — Controles Celular ──
        // 'txt-opt-mobile-titulo': { color: null, fuente: null },
        // 'txt-opt-mobile-lateral': { color: null, fuente: null },
        // 'txt-opt-mobile-tamano': { color: null, fuente: null },
        // 'txt-opt-mobile-transparencia': { color: null, fuente: null },
        // 'txt-opt-mobile-boton-gravedad': { color: null, fuente: null },
        // 'txt-opt-btn-guardar-touch': { color: null, fuente: null },

        // ── Opciones — Modo Pruebas (DEV) ──
        // 'txt-opt-dev-titulo': { color: null, fuente: null },

        // ── Camino de Reyes ──
        // 'rs-title': { color: null, fuente: null },
        // 'txt-rangos-boton-volver': { color: null, fuente: null },
        // 'txt-rangos-label-experiencia': { color: null, fuente: null },
        // 'txt-rangos-xp-unidad': { color: null, fuente: null },
        // 'txt-rangos-hero-xp-sufijo': { color: null, fuente: null },

        // ── Panel de Logros ──
        // 'txt-achievements-titulo': { color: null, fuente: null },

        // ── Inventario — Topnav (Config Parte 1) ──
        // tamano acepta cualquier valor CSS de font-size ('14px', '1.2rem', etc.)
        // 'inv-brand-title': { color: null, fuente: null, tamano: null },
        // 'inv-brand-sub': { color: null, fuente: null, tamano: null },
        // 'inv-back-btn-icon': { color: null, fuente: null, tamano: null },
        // 'inv-nav-skins': { color: null, fuente: null, tamano: null },
        // 'inv-nav-trails': { color: null, fuente: null, tamano: null },
        // 'inv-nav-banners': { color: null, fuente: null, tamano: null },
        // 'inv-nav-emotes': { color: null, fuente: null, tamano: null },
        // 'inv-nav-powerups': { color: null, fuente: null, tamano: null },
        // 'inv-nav-cofres': { color: null, fuente: null, tamano: null },

        // ── Inventario — Hero (Config Parte 2) ──
        // 'inv-equip-label': { color: null, fuente: null, tamano: null },
        // 'inv-equip-rarity': { color: null, fuente: null, tamano: null },
        // 'inv-p-lbl-skins': { color: null, fuente: null, tamano: null },
        // 'inv-p-num-skins': { color: null, fuente: null, tamano: null },
        // 'inv-p-lbl-trails': { color: null, fuente: null, tamano: null },
        // 'inv-p-num-trails': { color: null, fuente: null, tamano: null },
        // 'inv-p-lbl-total': { color: null, fuente: null, tamano: null },
        // 'inv-p-num-total': { color: null, fuente: null, tamano: null },

        // ── Inventario — Título de sección (Config Parte 3) ──
        // 'inv-section-title': { color: null, fuente: null, tamano: null },

        // ── Inventario — Emotes (Config Parte 4) ──
        // 'inv-empty-emotes': { color: null, fuente: null, tamano: null },

        // ── Inventario — Trails (Config Parte 5) ──
        // 'inv-empty-trails': { color: null, fuente: null, tamano: null },

        // ── Inventario — Banners (Config Parte 6) ──
        // 'inv-profile-banner-kicker': { color: null, fuente: null, tamano: null },

        // ── Inventario — Potenciadores (Config Parte 8) ──
        // 'inv-powerups-unavailable': { color: null, fuente: null, tamano: null },
        // 'inv-empty-powerups': { color: null, fuente: null, tamano: null },

        // ── Inventario — Cofres (Config Parte 9) ──
        // 'inv-empty-cofres': { color: null, fuente: null, tamano: null },

        // ── Panel de Ayuda (Guía de Potenciadores) ──
        // 'txt-help-titulo': { color: null, fuente: null },

        // ── Notificaciones (logro desbloqueado / subida de rango) ──
        // Ojo: estas se crean dinámicamente cada vez que aparecen, pero
        // igual funcionan con color/fuente normal aquí, ya main.js/ui.js
        // se encarga de reaplicar el estilo cada vez que salen en pantalla.
        // 'txt-achievement-notif-titulo': { color: null, fuente: null },
        // 'txt-rankup-notif-titulo': { color: null, fuente: null },
    },

    // --------------------------------------------------------
    //  TEXTOS — Menú principal y Panel de estadísticas
    //  Cambia cualquier string acá y se actualiza en el juego.
    //  (Parte 1 de la auditoría de textos editables)
    // --------------------------------------------------------
    textos: {

        menu: {
            clasificacion: 'CLASIFICACIÓN',
        },

        gameOver: {
            esferaColapsada: 'ESFERA COLAPSADA',   // "kicker" chico arriba del título
            nivelPrefix: 'NIVEL ',                  // prefijo antes del número de nivel (el número lo pone main.js)
            intentaloDeNuevo: 'INTENTALO DE NUEVO', // subtítulo debajo del título
            reintentar: 'REINTENTAR',
            niveles: 'NIVELES',
            menu: 'MENU',
        },

        gameWin: {
            menu: '⌂ MENÚ',
            niveles: 'NIVELES',
            jugarDeNuevo: '↺ JUGAR DE NUEVO',
        },

        estadisticas: {
            tituloSeccion: 'ESTADÍSTICAS DEL JUGADOR',
            topCombo: 'Top Combo',
            victorias: 'Victorias',
            derrotas: 'Derrotas',
            juegosJugados: 'Juegos jugados',
            diasJugados: 'Días jugados',
            monedasActuales: 'Monedas actuales',
            rubiesActuales: 'Rubies actuales',
            coleccion: 'Colección',
            supervivenciaMejor: 'Supervivencia mejor',
            ultimoAcceso: 'Último acceso',
            mejorRacha: 'Mejor racha',
        },

        editarPerfil: {
            titulo: 'EDITAR PERFIL',
            labelNombre: 'Nombre de jugador',
            labelAvatar: 'Elegir avatar',
            botonCancelar: 'Cancelar',
            botonGuardar: 'Guardar',
        },

        opciones: {
            titulo: 'OPCIONES',
            botonCerrar: 'CERRAR',

            controles: {
                titulo: 'CONTROLES',
                mover: 'Mover',
                invertirGravedad: 'Invertir gravedad',
                potenciador1: 'Potenciador slot 1',
                potenciador2: 'Potenciador slot 2',
                botonCambiar: 'CAMBIAR CONTROLES',
                // Textos dinámicos que pinta ui.js según el modo activo:
                textoAdaptativo: 'Controles adaptativos',
                textoFijo: 'Controles fijos',
            },

            reasignarTeclas: {
                titulo: 'REASIGNAR TECLAS',
                moverIzquierda: 'Mover Izquierda',
                moverDerecha: 'Mover Derecha',
                invertirGravedad: 'Invertir Gravedad',
                potenciador1: 'Potenciador 1',
                potenciador2: 'Potenciador 2',
                botonRestaurar: 'RESTAURAR POR DEFECTO',
            },

            audio: {
                titulo: 'AUDIO',
                musica: 'MÚSICA',
                efectos: 'EFECTOS',
            },

            visual: {
                titulo: 'VISUAL',
                botonModoRendimiento: 'MODO RENDIMIENTO',
                // Textos dinámicos que pinta ui.js según el modo activo:
                textoRendimientoAlto: 'Rendimiento alto',
                textoVisualesCompletos: 'Visuales completos',
            },

            controlesCelular: {
                titulo: 'CONTROLES CELULAR',
                botonesLaterales: 'BOTONES LATERALES',
                tamanoBotones: 'TAMAÑO BOTONES',
                transparencia: 'TRANSPARENCIA',
                botonGravedad: 'BOTÓN GRAVEDAD',
                botonGuardar: 'GUARDAR CONFIGURACIÓN',
            },

            modoPruebasDev: {
                titulo: 'MODO PRUEBAS (DEV)',
                // Prefijo del botón de monedas infinitas (ui.js le agrega ": ON"/": OFF")
                monedasInfinitasPrefix: 'MONEDAS INFINITAS',
            },
        },

        rangos: {
            tituloPantalla: 'CAMINO DE REYES',
            botonVolver: '← VOLVER',
            labelExperiencia: 'EXPERIENCIA',
            sufijoXP: 'XP',                  // se usa junto al número de XP en varios lugares
            xpMaximo: '¡Máximo!',            // se muestra cuando ya no hay siguiente rango
            badgeActual: 'ACTUAL',           // etiqueta sobre el nodo donde está el jugador
            mapaCompleto: '¡MAPA COMPLETO!', // aparece en la flecha para pasar al siguiente mapa

            // Popup que aparece al reclamar una recompensa del camino
            recompensa: {
                tituloRango: '¡RANGO DESBLOQUEADO!',
                tituloNodo: '¡RECOMPENSA DEL CAMINO!',
                subtituloRango: 'Has alcanzado un nuevo rango',
                subtituloNodo: 'Nodo del camino desbloqueado',
                botonReclamarSkin: 'RECLAMAR SKIN',
                botonReclamar: 'RECLAMAR',
            },
        },

        // ── Panel de Logros + notificaciones (logro / subida de rango) ──
        // Los nombres/descripciones de cada logro individual siguen en
        // ACHIEVEMENTS_DATA (ui.js) — son catálogo del juego, igual que
        // pasa con los nombres de skins en shop.js, no "texto de UI".
        logros: {
            tituloPanel: 'LOGROS',
            // {actual} y {total} se reemplazan por la cantidad desbloqueada y el total
            desbloqueadosTemplate: 'Desbloqueados: {actual}/{total}',

            notificacion: {
                tituloLogro: '¡LOGRO DESBLOQUEADO!',
                tituloRango: '¡NUEVO RANGO!',
            },
        },

        // ── Panel de Ayuda (Guía de Potenciadores) ──
        // Los nombres/descripciones/niveles de cada potenciador siguen en
        // POWERUPS_DATA (powerups.js) — son catálogo del juego, igual que
        // pasa con logros y skins, no "texto de UI".
        ayuda: {
            tituloPanel: 'GUÍA DE POTENCIADORES',
            // {n} = número de nivel, {texto} = descripción de ese nivel
            nivelTemplate: 'Nivel {n}: {texto}',
            // {n} = cantidad de usos registrados
            usosTemplate: 'Usos: {n}',
        },

        // ── TIENDA NORMAL (Parte 4 de la auditoría) ──
        // No incluye: Tienda VIP, Pase Ruby, Regalo diario ni Cofres
        // (esas tienen o tendrán su propio bloque en el checklist).
        // Los nombres/rarezas/textos de cada skin, banner, trail, emote
        // o misión individual siguen viviendo en sus arreglos de datos
        // (SKINS_DATA, BANNERS_DATA, etc. en shop.js) — son catálogo del
        // juego, no "textos de UI", así que no se movieron acá.
        tienda: {

            // Sidebar izquierdo (fijo en index.html)
            sidebar: {
                titulo: 'TIENDA',
                botonVolver: '← VOLVER',
                labelEstandarte: 'ESTANDARTE',
                labelRubies: 'RUBIES',
                labelCoins: 'COINS',
                misionesTitulo: 'MISIONES',
                misionesSubtitulo: 'Diarias y racha',
                labelEquipado: 'EQUIPADO',
            },

            // Textos compartidos por varias páginas de la tienda
            comun: {
                botonVolver: '← VOLVER',       // header de cada sub-página (skins/banners/emotes/conversión)
                proximamente: 'PRÓXIMAMENTE',  // sección aún sin implementar
                monedaRubies: 'rubies',        // usado en frases tipo "por 50 rubies"
                monedaMonedas: 'monedas',      // usado en frases tipo "por 50 monedas"
            },

            // Modal genérico de compra/confirmación (showShopModal)
            modal: {
                kickerDefault: 'THE GEM',      // texto pequeño de arriba si no se especifica otro
                fallbackImagen: 'PNG',         // texto que se muestra si el item no tiene imagen
                botonCerrarX: 'X',
                botonCerrarDefault: 'CERRAR',
                botonSi: 'SI',
                botonNo: 'NO',
                // {monto} y {moneda} se reemplazan por el precio y "rubies"/"monedas"
                preguntaCompraTemplate: '¿Seguro que quieres comprar por {monto} {moneda}?',
                kickerConfirmarCompra: 'CONFIRMAR COMPRA',
            },

            // Página de Skins
            skins: {
                titulo: 'SKINS',
                botonEquipar: 'EQUIPAR',
                botonEquipada: '✔ EQUIPADA',
                botonDirigirVIP: 'DIRIGIR A TIENDA VIP',
                labelSoloVIP: 'SOLO EN TIENDA VIP',
                labelTrofeo: 'TROFEO',
                labelLegendario: 'LEGENDARIO',
                labelFragmentos: 'FRAGMENTOS',        // fallback cuando no hay barra de fragmentos
                sufijoFragmentos: 'FRAGMENTOS',        // "{n} FRAGMENTOS" bajo la carta
            },

            // Página de Banners
            banners: {
                titulo: 'BANNERS',
                botonEquipar: 'EQUIPAR',
                botonEquipado: 'EQUIPADO',
                botonSoloVIP: 'SOLO EN TIENDA VIP',
                labelPortada: 'PORTADA',              // placeholder cuando el banner no tiene imagen
                labelVipPaseRuby: 'VIP / PASE RUBY',
                labelNormal: 'NORMAL',
            },

            // Página de Emotes
            emotes: {
                titulo: 'EMOTES',
                botonUsar: 'USAR',
                botonActivo: 'ACTIVO',
                botonEnElPase: 'EN EL PASE',
                labelFragmentos: 'FRAGMENTOS',
                placeholderSinImagen: 'PNG',
                kickerConfirmarCompra: 'CONFIRMAR EMOTE',
                alertaSinRubies: 'No tienes suficientes rubies.',
                alertaSinMonedas: 'No tienes suficientes monedas.',
            },

            // Página de Trails (carrusel pantalla completa)
            trails: {
                titulo: 'TRAILS',
                botonVolver: '← VOLVER',
                labelCoins: 'COINS',
                labelGems: 'GEMS',
                labelSeleccionado: 'SELECCIONADO',
                labelTrailExclusivo: 'Trail exclusivo',
                botonEquipar: 'EQUIPAR',
                botonEquipado: '✔ EQUIPADO',
                botonComprar: 'COMPRAR',
                labelTienes: '✔ TIENES',
                labelGratis: '✔ GRATIS',
                kickerConfirmarCompra: 'CONFIRMAR TRAIL',
                fallbackImagen: 'TRAIL',
                alertaSinFondos: 'No tienes suficientes monedas/gemas',
                alertaSinGemas: '¡No tienes suficientes gemas!',
                alertaSinCoins: '¡No tienes suficientes Dead Coins!',
            },

            // Página de Conversión de monedas
            conversion: {
                titulo: 'CONVERSIÓN',
                labelTasaCambio: 'TASA DE CAMBIO',
                textoTasa: '100 = 1 / 1 = 30',
                labelDeadCoins: 'DEAD COINS',
                labelGemas: 'GEMAS',
                tituloConvertirCoins: 'CONVERTIR COINS → GEMAS',
                placeholderCoins: 'ej: 100',
                tituloConvertirGemas: 'CONVERTIR RUBIES A MONEDAS',
                placeholderGemas: 'ej: 3',
                botonConvertir: 'CONVERTIR',
                // Mensajes de resultado/error de la conversión
                errorMultiploCoins: 'Ingresa un multiplo de 100 (minimo 100)',
                errorSinCoins: '¡No tienes suficientes Dead Coins!',
                exitoCoinsAGemas: '✔ Convertiste {input} coins en {ganado} gemas',
                errorMinimoGemas: 'Ingresa al menos 1 ruby',
                errorSinRubies: 'No tienes suficientes rubies',
                exitoGemasACoins: 'Convertiste {input} rubies en {ganado} monedas',
            },

            // ── INVENTARIO (Config — Parte 1: Topnav) ──
            // Los nombres/rarezas de cada skin/trail/banner/emote individual
            // siguen en sus arreglos de datos (igual que en la tienda normal).
            // Esto es solo el texto de la barra superior del panel.
            inventario: {
                topnav: {
                    brandTitle: 'INVENTARIO',
                    brandSub: 'THE GEM',
                    pillSkins: 'SKINS',
                    pillTrails: 'TRAILS',
                    pillBanners: 'BANNERS',
                    pillEmotes: 'EMOTES',
                    pillPowerups: 'POTENCIADORES',
                    pillCofres: 'COFRES',
                },
                // Barra hero (skin equipada + progreso SKINS/TRAILS/TOTAL)
                hero: {
                    labelEquipada: 'SKIN EQUIPADA',
                    labelLegendario: 'LEGENDARIO',
                    labelSkins: 'SKINS',
                    labelTrails: 'TRAILS',
                    labelTotal: 'TOTAL',
                },
                // Chips de filtro por rareza/categoría (Config Parte 3)
                filtros: {
                    chipTodas: 'TODAS',       // chip para quitar el filtro
                    chipInicial: 'INICIAL',   // rareza DEFAULT de banners
                    chipBasico: 'BÁSICO',     // rareza BASICO de banners
                },
                // Título de cada sección, arriba de los filtros (Config Parte 3)
                // {n} se reemplaza por la cantidad de items obtenidos/guardados
                titulos: {
                    skinsTemplate: 'SKINS OBTENIDAS — {n}',
                    trailsTemplate: 'TRAILS OBTENIDOS — {n} EFECTOS',
                    bannersTemplate: 'BANNERS OBTENIDOS — {n}',
                    emotesTemplate: 'EMOTES OBTENIDOS — {n}',
                    powerupsTemplate: 'POTENCIADORES OBTENIDOS — {n}',
                    cofresTemplate: 'COFRES GUARDADOS — {n}',
                },
                // Cards de SKINS (Config Parte 4)
                skins: {
                    tooltipEquipada: 'Equipada',           // title="" cuando ya está equipada
                    tooltipClickEquipar: 'Click para equipar', // title="" cuando no está equipada
                },
                // Cards de EMOTES (Config Parte 4 — combinada con Skins por ser casi idénticas)
                emotes: {
                    tooltipEquipado: 'Equipado',
                    tooltipClickEquipar: 'Click para equipar',
                    // {br} se reemplaza por un salto de línea
                    emptyState: 'NO TIENES EMOTES{br}EN ESTA CATEGORÍA',
                },
                // Cards de TRAILS + carrusel (Config Parte 5)
                trails: {
                    emptyState: 'NO TIENES TRAILS{br}EN ESTA CATEGORÍA',
                    labelCompleto: '★ COMPLETO',      // cuando ya tienes todos los colores de un trail
                    labelEquipadoPrefix: '✔ EQUIPADO · ', // seguido del nombre del color equipado
                },
                // Cards de BANNERS + preview de perfil (Config Parte 6)
                banners: {
                    tooltipEquipado: 'Equipado',
                    tooltipClickEquipar: 'Click para equipar',
                    labelBannerEquipado: 'BANNER EQUIPADO', // kicker sobre el preview de perfil
                    fallbackNombreJugador: 'Jugador',        // si no hay nombre guardado
                    fallbackNombreBanner: 'Banner',          // si el banner no tiene nombre
                },
                // Cards de POTENCIADORES (Config Parte 8)
                powerups: {
                    // {br} se reemplaza por un salto de línea
                    unavailable: 'POTENCIADORES{br}NO DISPONIBLES', // si powerups.js no cargó
                    emptyState: 'NO TIENES POTENCIADORES{br}EN ESTA CATEGORÍA',
                    // {n} se reemplaza por el número de nivel
                    labelNivel: 'NIVEL {n}',
                    labelBloqueado: 'BLOQUEADO',
                },
                // Cards de COFRES (Config Parte 9)
                cofres: {
                    emptyState: 'NO TIENES COFRES{br}GUARDADOS',
                    botonAbrir: 'ABRIR',
                },
            },

            // Panel de Misiones (se abre desde el botón del sidebar)
            misiones: {
                tituloPanel: 'MISIONES DIARIAS',
                // {n} = número de días, {plural} = '' o 's'
                rachaTemplate: 'Racha {n} dia{plural}',
                rachaSesion: 'RACHA DE SESION',
                botonReclamar: 'RECLAMAR',
                botonReclamado: 'OK',
            },
        },

    },

    // --------------------------------------------------------
    //  RANGOS — Nombre y color de cada uno de los 17 rangos
    //  El emoji, la imagen y el XP necesario NO van aquí (son
    //  balance/datos del juego) — se manejan en rank-system.js.
    //  Solo pon aquí los rangos que quieras renombrar o
    //  recolorear; si un id no aparece, se usa el valor original.
    // --------------------------------------------------------
    rangos: {
        nombres: {
            // 0: 'Principiante', 1: 'Cobre', 2: 'Hierro', ... 17: 'The Gem'
        },
        colores: {
            // 0: '#7a7a7a', 1: '#b87333', ...
        },
    },

    // --------------------------------------------------------
    //  IMÁGENES DE BOTONES — Menú principal
    //  Cambia la ruta acá para usar otro PNG sin tocar el HTML
    // --------------------------------------------------------
    imagenesBotones: {
        menu: {
            jugar: 'assets/Imagenes/Botones menu/JUGAR.png',
            tienda: 'assets/Imagenes/Botones menu/TIENDA.png',
            inventario: 'assets/Imagenes/Botones menu/INVENTARIO.png',
            logros: 'assets/Imagenes/Botones menu/LOGROS.png',
            ayuda: 'assets/Imagenes/Botones menu/AYUDA.png',
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

// ── Aplicar textos (Menú + Estadísticas + Opciones + Tienda sidebar + Inventario topnav + Rangos + imágenes de botones) ──
// ── Aplicar textos (Menú + Estadísticas) ──
function applyTextos() {
    const t = GEM_CONFIG.textos;
    if (!t) return;

    // Helper: setea textContent solo si el elemento existe y el valor viene definido
    const set = (id, txt) => {
        const el = document.getElementById(id);
        if (el && txt !== undefined) el.textContent = txt;
    };

    // Menú principal
    set('txt-menu-clasificacion', t.menu.clasificacion);

    // Pantalla de Game Over
    set('txt-go-kicker', t.gameOver.esferaColapsada);
    set('go-retry', t.gameOver.reintentar);
    set('go-levels', t.gameOver.niveles);
    set('go-menu', t.gameOver.menu);

    // Pantalla de victoria (Game Win)
    set('gw-menu', t.gameWin.menu);
    set('gw-levels', t.gameWin.niveles);
    set('gw-retry', t.gameWin.jugarDeNuevo);

    // Panel de estadísticas del jugador
    set('txt-profile-stats-title', t.estadisticas.tituloSeccion);
    set('txt-stat-label-combo', t.estadisticas.topCombo);
    set('txt-stat-label-wins', t.estadisticas.victorias);
    set('txt-stat-label-losses', t.estadisticas.derrotas);
    set('txt-stat-title-games', t.estadisticas.juegosJugados);
    set('txt-stat-title-days', t.estadisticas.diasJugados);
    set('txt-stat-title-coins', t.estadisticas.monedasActuales);
    set('txt-stat-title-gems', t.estadisticas.rubiesActuales);
    set('txt-stat-title-collection', t.estadisticas.coleccion);
    set('txt-stat-title-survival', t.estadisticas.supervivenciaMejor);
    set('txt-stat-title-lastseen', t.estadisticas.ultimoAcceso);
    set('txt-stat-title-streak', t.estadisticas.mejorRacha);

    // Modal de editar perfil
    set('txt-profileedit-title', t.editarPerfil.titulo);
    set('txt-profileedit-label-name', t.editarPerfil.labelNombre);
    set('txt-profileedit-label-avatar', t.editarPerfil.labelAvatar);
    set('profileEditCancelBtn', t.editarPerfil.botonCancelar);
    set('profileEditSaveBtn', t.editarPerfil.botonGuardar);

    // Panel de Opciones — textos estáticos (los dinámicos como modo controles,
    // modo rendimiento y monedas infinitas los pinta ui.js leyendo del mismo config)
    const o = t.opciones;
    if (o) {
        set('txt-opt-titulo', o.titulo);
        set('txt-opt-btn-cerrar', o.botonCerrar);

        set('txt-opt-controles-titulo', o.controles.titulo);
        set('txt-opt-key-mover', o.controles.mover);
        set('txt-opt-key-gravedad', o.controles.invertirGravedad);
        set('txt-opt-key-power1', o.controles.potenciador1);
        set('txt-opt-key-power2', o.controles.potenciador2);
        set('txt-opt-btn-cambiar-controles', o.controles.botonCambiar);

        set('txt-opt-reasignar-titulo', o.reasignarTeclas.titulo);
        set('txt-opt-keybind-izquierda', o.reasignarTeclas.moverIzquierda);
        set('txt-opt-keybind-derecha', o.reasignarTeclas.moverDerecha);
        set('txt-opt-keybind-gravedad', o.reasignarTeclas.invertirGravedad);
        set('txt-opt-keybind-power1', o.reasignarTeclas.potenciador1);
        set('txt-opt-keybind-power2', o.reasignarTeclas.potenciador2);
        set('txt-opt-btn-restaurar', o.reasignarTeclas.botonRestaurar);

        set('txt-opt-audio-titulo', o.audio.titulo);
        set('txt-opt-audio-musica', o.audio.musica);
        set('txt-opt-audio-efectos', o.audio.efectos);

        set('txt-opt-visual-titulo', o.visual.titulo);
        set('txt-opt-btn-rendimiento', o.visual.botonModoRendimiento);

        set('txt-opt-mobile-titulo', o.controlesCelular.titulo);
        set('txt-opt-mobile-lateral', o.controlesCelular.botonesLaterales);
        set('txt-opt-mobile-tamano', o.controlesCelular.tamanoBotones);
        set('txt-opt-mobile-transparencia', o.controlesCelular.transparencia);
        set('txt-opt-mobile-boton-gravedad', o.controlesCelular.botonGravedad);
        set('txt-opt-btn-guardar-touch', o.controlesCelular.botonGuardar);

        set('txt-opt-dev-titulo', o.modoPruebasDev.titulo);
    }

    // Sidebar de la tienda normal — textos estáticos del HTML
    // (los textos dinámicos de cada página de la tienda los pinta shop.js
    // leyendo del mismo config, ver GEM_CONFIG.textos.tienda)
    const ts = t.tienda?.sidebar;
    if (ts) {
        set('txt-shop-titulo', ts.titulo);
        set('txt-shop-btn-volver', ts.botonVolver);
        set('txt-shop-label-estandarte', ts.labelEstandarte);
        set('txt-shop-label-rubies', ts.labelRubies);
        set('txt-shop-label-coins', ts.labelCoins);
        set('txt-shop-misiones-titulo', ts.misionesTitulo);
        set('txt-shop-misiones-subtitulo', ts.misionesSubtitulo);
        set('txt-shop-label-equipado', ts.labelEquipado);
    }

    // Inventario — topnav (Config Parte 1)
    // (los textos dinámicos de cada sección — título "SKINS OBTENIDAS — N",
    // rarezas, nombres de items, etc. — los sigue pintando shop.js;
    // esto es solo la barra superior fija)
    const invTop = t.tienda?.inventario?.topnav;
    if (invTop) {
        set('inv-brand-title', invTop.brandTitle);
        set('inv-brand-sub', invTop.brandSub);
        set('inv-nav-skins', invTop.pillSkins);
        set('inv-nav-trails', invTop.pillTrails);
        set('inv-nav-banners', invTop.pillBanners);
        set('inv-nav-emotes', invTop.pillEmotes);
        set('inv-nav-powerups', invTop.pillPowerups);
        set('inv-nav-cofres', invTop.pillCofres);
    }

    // Camino de Rangos — textos estáticos del HTML
    // (los dinámicos como "ACTUAL", "¡MAPA COMPLETO!" y el popup de recompensa
    // los pinta rank-system.js leyendo del mismo config, ver GEM_CONFIG.textos.rangos)
    const r = t.rangos;
    if (r) {
        set('rs-title', r.tituloPantalla);
        set('txt-rangos-boton-volver', r.botonVolver);
        set('txt-rangos-label-experiencia', r.labelExperiencia);
        set('txt-rangos-xp-unidad', r.sufijoXP);
        set('txt-rangos-hero-xp-sufijo', r.sufijoXP);
    }

    // Panel de Logros — título estático del HTML
    // (el cuerpo del panel y las notificaciones los pinta ui.js leyendo
    // del mismo config, ver GEM_CONFIG.textos.logros)
    set('txt-achievements-titulo', t.logros?.tituloPanel);

    // Panel de Ayuda (Guía de Potenciadores) — título estático del HTML
    // (el cuerpo lo pinta powerups.js leyendo GEM_CONFIG.textos.ayuda)
    set('txt-help-titulo', t.ayuda?.tituloPanel);

    // Imágenes de los botones del menú principal
    const img = GEM_CONFIG.imagenesBotones?.menu;
    const setSrc = (id, src) => {
        const el = document.getElementById(id);
        if (el && src !== undefined) el.src = src;
    };
    if (img) {
        setSrc('img-btn-play', img.jugar);
        setSrc('img-btn-shop', img.tienda);
        setSrc('img-btn-inventory', img.inventario);
        setSrc('img-btn-achievements', img.logros);
        setSrc('img-btn-help', img.ayuda);
    }

    aplicarEstilosTexto();
}

// ── Aplicar color/fuente independiente por texto (bloque 3.1) ──
// Lee GEM_CONFIG.estilosTexto y le pone estilo inline SOLO a los ids que
// tengan color o fuente definidos. Si un texto no aparece aquí (o está
// comentado), sigue usando el color/fuente global de tema.colores/fuentes
// vía el CSS normal — no se toca nada.
function aplicarEstilosTexto() {
    const estilos = GEM_CONFIG.estilosTexto;
    if (!estilos) return;
    Object.keys(estilos).forEach(function (id) {
        const el = document.getElementById(id);
        if (!el) return;
        const cfg = estilos[id] || {};
        const color = (cfg.color || '').trim();
        const esDegradado = color.startsWith('linear-gradient(') || color.startsWith('radial-gradient(');

        if (esDegradado) {
            // Degradado de texto: se pinta con background + clip, no con color
            el.style.background = color;
            el.style.webkitBackgroundClip = 'text';
            el.style.backgroundClip = 'text';
            el.style.color = 'transparent';
            el.style.webkitTextFillColor = 'transparent';
        } else {
            // Color sólido normal (o vacío para volver al color global)
            el.style.background = '';
            el.style.webkitBackgroundClip = '';
            el.style.backgroundClip = '';
            el.style.webkitTextFillColor = '';
            el.style.color = color;
        }
        el.style.fontFamily = cfg.fuente || '';
        // tamano (opcional): cualquier valor CSS de font-size ('14px', '1.2rem', etc.)
        // Si no se define (o queda null), el texto conserva su tamaño normal del CSS.
        el.style.fontSize = cfg.tamano || '';
    });
}

// ── Emoji ↔ PNG universal (bloque 3.4) ──
// Toma un valor de "ícono" (puede ser un emoji, un símbolo, o una ruta de
// imagen) y devuelve el HTML correcto automáticamente:
//   - Si el valor termina en .png/.jpg/.jpeg/.webp/.svg/.gif → <img>
//   - Si no (emoji, texto, símbolo) → <span> normal
// Así, TODOS los emojis del juego (logros, rangos, avatar, etc.) quedan
// listos para cambiarse a PNG en el futuro solo reemplazando el valor en
// los datos (ej: ACHIEVEMENTS_DATA, RANKS) por una ruta de imagen —
// no hay que tocar el código de renderizado en ningún lado.
//
// Uso:
//   renderIcon('🏆')                                  → <span>🏆</span>
//   renderIcon('assets/logros/trofeo.png')             → <img src="...">
//   renderIcon('🏆', { clase: 'achievement-icon' })    → con clase CSS
//   renderIcon('🏆', { tamano: 50 })                   → tamaño en px
//
// Si en el futuro pones una ruta de imagen que no existe todavía, cae
// automáticamente de vuelta al ícono de advertencia ⚠️ (nunca rompe el layout).
function renderIcon(valor, opciones) {
    opciones = opciones || {};
    if (valor === null || valor === undefined || valor === '') return '';
    const texto = String(valor);
    const esImagen = /\.(png|jpe?g|webp|svg|gif)$/i.test(texto);
    const clase = opciones.clase || '';
    const tamano = opciones.tamano || null;
    const extra = opciones.estiloExtra || '';

    if (esImagen) {
        const estiloImg = `width:${tamano || 32}px;height:${tamano || 32}px;object-fit:contain;${extra}`;
        // Fallback si la imagen no existe: ícono de advertencia (no rompe el layout)
        return `<img src="${texto}" alt="" class="${clase}" style="${estiloImg}" onerror="this.outerHTML='<span class=\\'${clase}\\' style=\\'font-size:${tamano || 24}px;${extra}\\'>⚠️</span>'">`;
    }

    const estiloSpan = tamano ? `font-size:${tamano}px;${extra}` : extra;
    return `<span class="${clase}"${estiloSpan ? ` style="${estiloSpan}"` : ''}>${texto}</span>`;
}


window.GEM_CONFIG = GEM_CONFIG;
window.applyTextos = applyTextos;
window.aplicarEstilosTexto = aplicarEstilosTexto;
window.renderIcon = renderIcon;

// Aplicar al cargar
applyTextos();
