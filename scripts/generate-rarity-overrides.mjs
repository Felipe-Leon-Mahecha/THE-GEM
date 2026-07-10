import { readFileSync, writeFileSync } from 'node:fs';
import vm from 'node:vm';

const source = readFileSync('shop.js', 'utf8');

const emptyElement = {
    style: {},
    classList: { add() {}, remove() {}, toggle() {}, contains() { return false; } },
    dataset: {},
    innerHTML: '',
    appendChild() {},
    addEventListener() {},
    querySelectorAll() { return []; },
    querySelector() { return null; }
};

const documentStub = {
    body: emptyElement,
    createElement() { return { ...emptyElement, dataset: {} }; },
    getElementById() { return emptyElement; },
    querySelectorAll() { return []; },
    querySelector() { return null; },
    addEventListener() {}
};

const context = {
    console,
    Image: function Image() { this.src = ''; },
    Audio: function Audio() {
        this.play = () => Promise.resolve();
        this.pause = () => {};
        this.addEventListener = () => {};
    },
    window: {
        addEventListener() {},
        applyShopPrices() {},
        GEM_CONFIG: {},
        SHOP_PRICES: { general: {} }
    },
    document: documentStub,
    localStorage: {
        getItem() { return null; },
        setItem() {}
    },
    setTimeout,
    clearTimeout,
    setInterval,
    clearInterval,
    requestAnimationFrame() { return 0; },
    cancelAnimationFrame() {}
};

vm.createContext(context);

vm.runInContext(`${source}
function collectNestedRarityItems(items, fallback = 'VIP') {
    const out = [];
    const seen = new Set();
    const walk = list => (list || []).forEach(item => {
        if (item && item.id && !seen.has(item.id)) {
            seen.add(item.id);
            out.push({ id: item.id, name: item.name || item.title || item.label || item.id, rarity: item.rarity || fallback });
        }
        walk(item && item.items);
    });
    walk(items);
    return out;
}
window.__RARITY_EXPORT = {
    trails: TRAILS_DATA.map(item => ({ id: item.id, name: item.name, rarity: item.rarity })),
    skins: SKINS_DATA.map(item => ({ id: item.id, name: item.name, rarity: item.rarity })),
    banners: [...BANNERS_DATA, ...VIP_BANNER_PLACEHOLDERS].map(item => ({ id: item.id, name: item.name, rarity: item.rarity })),
    emotes: EMOTES_DATA.map(item => ({ id: item.id, name: item.name, rarity: item.rarity })),
    vipItems: [
        ...collectNestedRarityItems(VIP_CAROUSEL_DATA.flatMap(panel => panel.items || [])),
        ...collectNestedRarityItems(VIP_PACKAGES_DATA.flatMap(pack => pack.items || []))
    ].filter((item, index, list) => list.findIndex(other => other.id === item.id) === index),
    vipGameplay: VIP_GAMEPLAY_PLACEHOLDERS.map(item => ({ id: item.id, name: item.name, rarity: item.rarity }))
};
`, context);

const groups = context.window.__RARITY_EXPORT;
const allowedRarities = ['DEFAULT', 'BASICO', 'ESPECIAL', 'EPICA', 'DEMON', 'VIP', 'LEGENDARIO', 'EXCLUSIVO'];
const defaultColors = {
    DEFAULT: 'rgba(255,255,255,0.35)',
    BASICO: '#57b7dd',
    ESPECIAL: '#ff9a17',
    EPICA: '#cc44ff',
    DEMON: '#cf0000',
    VIP: '#ffee00',
    LEGENDARIO: '#8a2be2'
};

function normalizeOutputRarity(rarity) {
    const value = String(rarity || 'BASICO').toUpperCase();
    if (allowedRarities.includes(value)) return value;
    return 'BASICO';
}

function objectBlock(items, indent = '        ') {
    const maxIdLength = Math.max(0, ...items.map(item => item.id.length));
    return items
        .map(item => {
            const id = JSON.stringify(item.id).padEnd(maxIdLength + 2);
            const rarity = JSON.stringify(normalizeOutputRarity(item.rarity));
            return `${indent}${id}: ${rarity}, // ${item.name || item.id}`;
        })
        .join('\n');
}

const output = `// TEMPORAL: cambia aqui la calidad/rareza de cada coleccionable.
// Valores permitidos: DEFAULT, BASICO, ESPECIAL, EPICA, DEMON, VIP, LEGENDARIO, EXCLUSIVO.
// Puedes cambiar el color general de cada calidad en colors.
// EXCLUSIVO siempre usa brillo RGB y no toma color configurable.
// Cuando todo quede como quieres, podemos aplicar estos valores a shop.js y borrar este archivo.
(function () {
    window.GEM_RARITY_OVERRIDES = {
        colors: {
${Object.entries(defaultColors).map(([key, value]) => `            ${key}: ${JSON.stringify(value)},`).join('\n')}
            // EXCLUSIVO no se cambia aqui: siempre alumbra RGB.
        },
        trails: {
${objectBlock(groups.trails)}
        },
        skins: {
${objectBlock(groups.skins)}
        },
        banners: {
${objectBlock(groups.banners)}
        },
        emotes: {
${objectBlock(groups.emotes)}
        },
        vipItems: {
${objectBlock(groups.vipItems)}
        },
        vipGameplay: {
${objectBlock(groups.vipGameplay)}
        }
    };
})();
`;

writeFileSync('rarities.override.js', output);
console.log(`Generated rarities.override.js with ${Object.values(groups).reduce((sum, items) => sum + items.length, 0)} entries.`);
