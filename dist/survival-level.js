// =====================================================
// SURVIVAL LEVEL ADDITION
// =====================================================
// Este archivo agrega el nivel Modo Supervivencia al juego antes de que se pinte el selector.

(function () {
    if (!window.LEVEL_CONFIGS || window.LEVEL_CONFIGS.some(level => level.isSurvival)) return;

    const placeholderAssets = window.LEVEL_ASSET_PLACEHOLDERS || {
        cover: "assets/Imagenes/Placeholders/Placeholder_Level_Cover.png",
        core: "assets/Imagenes/Placeholders/Placeholder_Core.png",
        sphereBackground: "assets/Imagenes/Placeholders/Placeholder_Sphere_Background.png",
        outerBackground: "assets/Imagenes/Placeholders/Placeholder_Level_Background.png",
        frame: "assets/Imagenes/Placeholders/Placeholder_Frame.png"
    };

    window.LEVEL_CONFIGS.push({
        name: "Supervivencia",
        number: 99,
        difficulty: 5,
        unlocked: true,
        isSurvival: true,
        theme: "survival",
        rotationSpeed: 0.022,
        spawnRate: 90,
        ringInset: 0,
        winTime: 999999,
        visual: {
            sphereBackgroundScale: 1.3,
            frameScale: 1.15,
            frameSize: 2.35,
            layers: { trail: 55, player: 65, frame: 75, obstacles: 88, lasers: 94 }
        },
        rubySpawnInterval: 600,
        maxRubies: 5,
        deadCoinSpawnInterval: 300,
        maxDeadCoins: 3,
        assets: {
            ...placeholderAssets,
            cover: "assets/Imagenes/Portadas Niveles/Nivel_3.png",
            outerBackground: "assets/Imagenes/Fondo de Niveles/Nivel_3_Fondo.png",
            music: "assets/Musica/Gravity Well.mp3"
        },
        obstacles: {
            spikes: true,
            saws: true,
            lasers: true,
            future: {}
        },
        lasers: {
            spawnInterval: 200,
            warningDuration: 80,
            activeDuration: 45,
            fadeDuration: 30,
            warningType: "emitter",
            beamType: "survival",
            thickness: 10,
            glowThickness: 25,
            angularWidth: 0.055,
            variants: [
                { type: "radial", weight: 3, inner: 0.06, outer: 0.96 },
                { type: "outerChord", weight: 4, angularSpan: 0.5, outer: 0.93 },
                { type: "short", weight: 3, inner: 0.38, outer: 0.84, mobility: "sweep", speed: 0.006, range: 0.28 },
                { type: "giantArc", weight: 2, angularSpan: 0.9, inner: 0.15, outer: 0.97, mobility: "static", thickness: 16, glowThickness: 35, warningDuration: 100 }
            ]
        }
    });
})();
