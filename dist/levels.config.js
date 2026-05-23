// =====================================================
// LEVEL CONFIGS
// Agrega niveles aqui para no tocar la logica del juego.
// =====================================================

(function () {
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
        assets: {
            cover: "",
            core: "",
            sphereBackground: "",
            outerBackground: "",
            frame: "",
            music: "assets/Musica/Gravity Well.mp3"
        },
        obstacles: {
            spikes: true,
            saws: false,
            future: {}
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
            rubySpawnInterval: 1100,
            maxRubies: 2,
            assets: {
                cover: "assets/Imagenes/Portadas Niveles/Nivel_0.png",
                core: "",
                sphereBackground: "",
                outerBackground: "assets/Imagenes/Fondo de Niveles/Nivel_0_Fondo.png",
                frame: "",
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
            rubySpawnInterval: 850,
            maxRubies: 3,
            assets: {
                cover: "assets/Imagenes/Portadas Niveles/Nivel_1.png",
                core: "assets/Imagenes/Diseno Esfera/Nucleos/Nucleo_Meteoro_Nv2.png",
                sphereBackground: "assets/Imagenes/Diseno Esfera/Fondos Esfera/Fondo_Esfera_Nvl_1.png",
                outerBackground: "assets/Imagenes/Fondo de Niveles/Nivel_1_Fondo.png",
                frame: "assets/Imagenes/Diseno Esfera/Marcos/Marco_Nvl_1.png",
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
            rubySpawnInterval: 800,
            maxRubies: 4,
            assets: {
                cover: "assets/Imagenes/Portadas Niveles/Nivel_2.png",
                core: "assets/Imagenes/Diseno Esfera/Nucleos/Nucleo_Meteoro_Nv2.png",
                sphereBackground: "assets/Imagenes/Diseno Esfera/Fondos Esfera/Fondo_Esfera_Nvl_1.png",
                outerBackground: "assets/Imagenes/Fondo de Niveles/Nivel_2_Fondo.png",
                frame: "assets/Imagenes/Diseno Esfera/Marcos/Marco_Nvl_1.png",
                music: "assets/Musica/Dead Weight.mp3"
            },
            obstacles: {
                spikes: true,
                saws: true,
                lasers: true,
                laserSpawnInterval: 300,
                future: {}
            }
        }

    ];

    const imageCache = new Map();

    function mergeLevelConfig(config) {
        return {
            ...DEFAULT_LEVEL,
            ...config,
            assets: { ...DEFAULT_LEVEL.assets, ...(config.assets || {}) },
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
        if (!src) return null;
        if (!imageCache.has(src)) {
            const img = new Image();
            img.src = src;
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
