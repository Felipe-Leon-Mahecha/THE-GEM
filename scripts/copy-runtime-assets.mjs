import { cp, mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const dist = join(root, "dist");

const runtimeFiles = [
  "levels.config.js",
  "powerups.js",
  "ui.js",
  "levelselect.js",
  "shop.js",
  "obstacles.js",
  "particles.js",
  "menuball.js",
  "src/main.js",
  "combo-system.js",
  "fragment-system.js",
  "src/keybinds-integration.js",
  "style.css"
];

await mkdir(join(dist, "src"), { recursive: true });

for (const file of runtimeFiles) {
  await cp(join(root, file), join(dist, file), { force: true });
}

await cp(join(root, "assets"), join(dist, "assets"), {
  recursive: true,
  force: true
});
