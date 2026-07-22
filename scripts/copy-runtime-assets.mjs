import { cp, mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const dist = join(root, "dist");

const runtimeFiles = [
  "assets.config.js",
  "textgemconfig.js",
  "layoutconfig.js",
  "levels.config.js",
  "powerups.js",
  "ui.js",
  "levelselect.js",
  "shop.js",
  "obstacles.js",
  "trails.js",
  "src/main.js",
  "combo-system.js",
  "fragment-system.js",
  "src/keybinds-integration.js",
  "style.css",
  "rank-system.js",
  "leaderboard.js",
  "skins-side.js",
  "survival-level.js",
  "prices.config.js",
  "rubypass.config.js",
  "rarities.override.js"
];

await mkdir(join(dist, "src"), { recursive: true });

for (const file of runtimeFiles) {
  await cp(join(root, file), join(dist, file), { force: true });
}

await cp(join(root, "assets"), join(dist, "assets"), {
  recursive: true,
  force: true
});
