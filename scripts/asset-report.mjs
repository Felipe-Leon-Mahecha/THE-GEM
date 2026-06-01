import { readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const roots = ["assets"];
const extensions = new Set([".png", ".jpg", ".jpeg", ".gif", ".webp", ".mp3"]);
const limit = Number(process.argv[2] || 30);
const files = [];

function extensionOf(path) {
  const index = path.lastIndexOf(".");
  return index >= 0 ? path.slice(index).toLowerCase() : "";
}

function walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(path);
      continue;
    }
    if (!entry.isFile() || !extensions.has(extensionOf(entry.name))) continue;
    const size = statSync(path).size;
    files.push({ path: relative(process.cwd(), path), size });
  }
}

for (const root of roots) walk(root);

files.sort((a, b) => b.size - a.size);

console.log(`Top ${Math.min(limit, files.length)} largest runtime assets:`);
for (const file of files.slice(0, limit)) {
  const mb = file.size / 1024 / 1024;
  console.log(`${mb.toFixed(2).padStart(7)} MB  ${file.path}`);
}

const totalMb = files.reduce((sum, file) => sum + file.size, 0) / 1024 / 1024;
console.log(`\nScanned ${files.length} files, total ${totalMb.toFixed(2)} MB.`);
