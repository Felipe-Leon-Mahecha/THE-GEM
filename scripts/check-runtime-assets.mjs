import { existsSync, readFileSync } from "node:fs";
import vm from "node:vm";

const runtimeFiles = [
  "shop.js",
  "skins-side.js",
  "powerups.js",
  "src/main.js",
  "particles.js",
  "levelselect.js",
  "index.html",
  "style.css"
];

const assetPattern = /assets\/[A-Za-z0-9_ .\-\/()ÁÉÍÓÚáéíóúÑñ]+?\.(?:png|jpg|jpeg|gif|mp3|webp|svg|json|kra)/g;
const assetRefs = new Set();

for (const file of runtimeFiles) {
  const source = readFileSync(file, "utf8");
  for (const match of source.matchAll(assetPattern)) assetRefs.add(match[0]);
}

const missingAssets = [...assetRefs].filter(path => !existsSync(path));

const store = new Map();
const emptyElement = {
  style: {},
  classList: { add() {}, remove() {}, toggle() {} },
  dataset: {},
  innerHTML: "",
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
  querySelector() { return null; }
};
const context = {
  console,
  Image: function Image() { this.src = ""; },
  window: { addEventListener() {} },
  localStorage: {
    getItem(key) { return store.get(key) || null; },
    setItem(key, value) { store.set(key, String(value)); }
  },
  document: documentStub,
  setTimeout,
  clearTimeout,
  requestAnimationFrame() { return 0; },
  cancelAnimationFrame() {}
};

vm.createContext(context);
vm.runInContext(readFileSync("shop.js", "utf8"), context);
vm.runInContext(readFileSync("skins-side.js", "utf8"), context);

const skins = context.window.getAllShopSkins?.() || [];
const missingSkinAssets = [];

// 1. Validar los recursos asignados en el catálogo general de skins
for (const skin of skins) {
  for (const key of ["image", "imageSide", "imageRight", "imageLeft"]) {
    if (skin[key] && !existsSync(skin[key])) {
      missingSkinAssets.push(`${skin.id}.${key}: ${skin[key]}`);
    }
  }
}

// 2. Validar explícitamente los archivos declarados en el registro lateral
const sideRegistry = context.window.SKIN_FOLDER_REGISTRY || [];
for (const entry of sideRegistry) {
  const { id, folder, symmetric, rolling } = entry;
  if (rolling) continue;
  
  const shortId = id.replace('skin_', '');
  if (symmetric) {
    const pathSym = `${folder}/skin_${shortId}_lado.png`;
    if (!existsSync(pathSym)) {
      missingSkinAssets.push(`${id}.symmetricSide: ${pathSym}`);
    }
  } else {
    const pathR = `${folder}/skin_${shortId}_lado_derecho.png`;
    const pathL = `${folder}/skin_${shortId}_lado_izquierdo.png`;
    if (!existsSync(pathR)) {
      missingSkinAssets.push(`${id}.asymmetricRightSide: ${pathR}`);
    }
    if (!existsSync(pathL)) {
      missingSkinAssets.push(`${id}.asymmetricLeftSide: ${pathL}`);
    }
  }
}

if (missingAssets.length || missingSkinAssets.length) {
  console.error("Runtime asset check failed.");
  if (missingAssets.length) {
    console.error("\nMissing referenced assets:");
    missingAssets.forEach(path => console.error(`- ${path}`));
  }
  if (missingSkinAssets.length) {
    console.error("\nMissing skin catalog assets:");
    missingSkinAssets.forEach(path => console.error(`- ${path}`));
  }
  process.exit(1);
}

console.log(`Runtime asset check passed: ${assetRefs.size} asset refs, ${skins.length} skins, ${sideRegistry.length} side configurations checked.`);
