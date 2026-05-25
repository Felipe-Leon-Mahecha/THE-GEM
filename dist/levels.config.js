// =====================================================
// LEVEL CONFIGS
// Agrega niveles aqui para no tocar la logica del juego.
// =====================================================

(function () {
    const PLACEHOLDER_ASSETS = {
        cover: "assets/Imagenes/Placeholders/Placeholder_Level_Cover.png",
        core: "assets/Imagenes/Placeholders/Placeholder_Core.png",
        sphereBackground: "assets/Imagenes/Placeholders/Placeholder_Sphere_Background.png",
        outerBackground: "assets/Imagenes/Placeholders/Placeholder_Level_Background.png",
        frame: "assets/Imagenes/Placeholders/Placeholder_Frame.png"
    };

    window.LEVEL_ASSET_PLACEHOLDERS = PLACEHOLDER_ASSETS;

    const DEFAULT_LEVEL = {
        name: "Nuevo Nivel",
        number: 1,
        difficulty: 1,
        unlocked: false,
        completed: false,
        percent: 0,
        winTime: 133,
        rotationSpeed: 0.016,
        spawnRate: 140,
        deadCoinSpawnInterval: 500,
        maxDeadCoins: 1,
        rubySpawnInterval: 0,
        maxRubies: 0,
        ringInset: 0,
        theme: "silver",
        playerSpawn: {
            angle: Math.PI / 2,
            offset: 0
        },
        visual: {
            sphereBackgroundScale: 0.72,
            sphereBackgroundOffsetX: 0,
            sphereBackgroundOffsetY: 0,
            coreScale: 1,
            coreOffsetX: 0,
            coreOffsetY: 0,
            frameScale: 1,
            frameSize: 2.28,
            frameOffsetX: 0,
            frameOffsetY: 0,
            outerBackgroundScale: 1,
            outerBackgroundOffsetX: 0,
            outerBackgroundOffsetY: 0,
            layers: {
                trail: 55,
                player: 65,
                frame: 75,
                obstacles: 85,
                lasers: 90
            }
        },
        assets: {
            cover: PLACEHOLDER_ASSETS.cover,
            core: PLACEHOLDER_ASSETS.core,
            sphereBackground: PLACEHOLDER_ASSETS.sphereBackground,
            outerBackground: PLACEHOLDER_ASSETS.outerBackground,
            frame: PLACEHOLDER_ASSETS.frame,
            music: "assets/Musica/Gravity Well.mp3"
        },
        obstacles: {
            spikes: true,
            saws: false,
            lasers: false,
            future: {}
        },
        lasers: {
            spawnInterval: 300,
            warningDuration: 95,
            activeDuration: 46,
            fadeDuration: 34,
            warningType: "emitter",
            beamType: "standard",
            thickness: 8,
            glowThickness: 18,
            angularWidth: 0.045,
            length: 1,
            mobility: "static",
            speed: 0,
            variants: [
                { type: "radial", weight: 5, inner: 0.05, outer: 0.96 },
                { type: "outerChord", weight: 2, angularSpan: 0.55, outer: 0.92, range: 1.8, mobility: "sweep", speed: 0.008 },
                { type: "short", weight: 2, inner: 0.45, outer: 0.86 },
                { type: "giantArc", weight: 1, angularSpan: 0.785, inner: 0.2, outer: 0.96, mobility: "static", thickness: 14, glowThickness: 30 }
            ]
        }
    };

    window.LEVEL_CONFIGS = [
        {
            name: "The Beggin",
            number: 1,
            difficulty: 1,
            unlocked: true,
            theme: "silver",
            rotationSpeed: 0.016,
            spawnRate: 118,
            ringInset: 0,
            visual: {
                sphereBackgroundScale: 0.58,
                frameScale: 1,
                frameSize: 2.22,
                layers: { trail: 55, player: 65, frame: 75, obstacles: 88, lasers: 92 }
            },
            rubySpawnInterval: 1100,
            maxRubies: 2,
            assets: {
                cover: "assets/Imagenes/Portadas Niveles/Nivel_0.png",
                core: "assets/Imagenes/Diseno Esfera/Nucleos/Nucleo_Meteoro_Nv1.png",
                sphereBackground: "assets/Imagenes/Diseno Esfera/Fondos Esfera/Fondo_Esfera_Nvl_1.png",
                outerBackground: "assets/Imagenes/Fondo de Niveles/Nivel_1_Fondo.png",
                frame: "assets/Imagenes/Diseno Esfera/Marcos/Marco_Nvl_1.png",
                music: "assets/Musica/Gravity Well.mp3"
            },
            obstacles: {
                spikes: true,
                saws: false,
                future: {}
            }
        },
        {
            name: "Volcano",
            number: 2,
            difficulty: 3,
            unlocked: true,
            theme: "volcano",
            rotationSpeed: 0.014,
            spawnRate: 110,
            ringInset: 14,
            visual: {
                sphereBackgroundScale: 0.62,
                frameScale: 1,
                frameSize: 2.22,
                layers: { trail: 55, player: 65, frame: 75, obstacles: 88, lasers: 92 }
            },
            rubySpawnInterval: 850,
            maxRubies: 3,
            assets: {
                cover: "assets/Imagenes/Portadas Niveles/Nivel_1.png",
                core: "assets/Imagenes/Diseno Esfera/Nucleos/Nucleo_Meteoro_Nv2.png",
                sphereBackground: "assets/Imagenes/Diseno Esfera/Fondos Esfera/Fondo_Esfera_Nvl_2.png",
                outerBackground: "assets/Imagenes/Fondo de Niveles/Nivel_2_Fondo.png",
                frame: "assets/Imagenes/Diseno Esfera/Marcos/Marco_Nvl_2.png",
                music: "assets/Musica/Dark Descent.mp3"
            },
            obstacles: {
                spikes: true,
                saws: true,
                future: {}
            }
        },
        {
            name: "Frozen World",
            number: 3,
            difficulty: 5,
            unlocked: true,
            theme: "frozen",
            rotationSpeed: 0.026,
            spawnRate: 65,
            ringInset: 14,
            visual: {
                sphereBackgroundScale: 0.58,
                frameScale: 1,
                frameSize: 2.22,
                layers: { trail: 55, player: 65, frame: 75, obstacles: 88, lasers: 94 }
            },
            rubySpawnInterval: 800,
            maxRubies: 4,
            assets: {
                cover: "assets/Imagenes/Portadas Niveles/Nivel_2.png",
                core: "assets/Imagenes/Diseno Esfera/Nucleos/Nucleo_Meteoro_Nv3.png",
                sphereBackground: "assets/Imagenes/Diseno Esfera/Fondos Esfera/Fondo_Esfera_Nvl_3.png",
                outerBackground: "assets/Imagenes/Fondo de Niveles/Nivel_3_Fondo.png",
                frame: "assets/Imagenes/Diseno Esfera/Marcos/Marco_Nvl_3.png",
                music: "assets/Musica/Dead Weight.mp3"
            },
            obstacles: {
                spikes: true,
                saws: true,
                lasers: true,
                laserSpawnInterval: 260,
                future: {}
            },
            lasers: {
                spawnInterval: 260,
                warningDuration: 90,
                activeDuration: 52,
                fadeDuration: 32,
                warningType: "emitter",
                beamType: "ice",
                thickness: 8,
                glowThickness: 20,
                angularWidth: 0.05,
                variants: [
                    { type: "radial", weight: 4, inner: 0.08, outer: 0.95 },
                    { type: "outerChord", weight: 3, angularSpan: 0.45, outer: 0.94, range: 1.8, mobility: "sweep", speed: 0.008 },
                    { type: "short", weight: 2, inner: 0.42, outer: 0.82, mobility: "sweep", speed: 0.004, range: 0.22 },
                    { type: "giantArc", weight: 1, angularSpan: 0.785, inner: 0.18, outer: 0.96, mobility: "static", thickness: 14, glowThickness: 30, warningDuration: 120 }
                ]
            }
        }

    ];

    const imageCache = new Map();

    function mergeLevelConfig(config) {
        const assets = { ...DEFAULT_LEVEL.assets, ...(config.assets || {}) };
        const visual = {
            ...DEFAULT_LEVEL.visual,
            ...(config.visual || {}),
            layers: { ...DEFAULT_LEVEL.visual.layers, ...((config.visual || {}).layers || {}) }
        };
        const lasers = {
            ...DEFAULT_LEVEL.lasers,
            ...(config.lasers || {}),
            variants: (config.lasers && config.lasers.variants) || DEFAULT_LEVEL.lasers.variants
        };
        Object.keys(PLACEHOLDER_ASSETS).forEach(key => {
            if (!assets[key]) assets[key] = PLACEHOLDER_ASSETS[key];
        });

        return {
            ...DEFAULT_LEVEL,
            ...config,
            assets,
            visual,
            playerSpawn: { ...DEFAULT_LEVEL.playerSpawn, ...(config.playerSpawn || {}) },
            lasers,
            obstacles: { ...DEFAULT_LEVEL.obstacles, ...(config.obstacles || {}) }
        };
    }

    window.getLevelConfig = function (levelNumber = window.level || 1) {
        const raw = window.LEVEL_CONFIGS[levelNumber - 1] || window.LEVEL_CONFIGS[0];
        return mergeLevelConfig(raw || {});
    };

    window.getCurrentLevelConfig = function () {
        return window.getLevelConfig(window.level || 1);
    };

    window.getLevelImage = function (src) {
        if (!src) src = PLACEHOLDER_ASSETS.cover;
        if (!imageCache.has(src)) {
            const img = new Image();
            img.src = src;
            img.onerror = () => {
                if (img.src.endsWith(PLACEHOLDER_ASSETS.cover)) return;
                img.src = PLACEHOLDER_ASSETS.cover;
            };
            imageCache.set(src, img);
        }
        return imageCache.get(src);
    };

    window.preloadLevelAssets = function () {
        window.LEVEL_CONFIGS.forEach(level => {
            const assets = level.assets || {};
            Object.keys(assets).forEach(key => window.getLevelImage(assets[key]));
        });
    };

    window.preloadLevelAssets();
})();
