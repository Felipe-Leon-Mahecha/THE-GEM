import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync, spawnSync } from "node:child_process";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const appId = "com.felixcompany.thegem";
const apkPath = join(root, "android", "app", "build", "outputs", "apk", "debug", "app-debug.apk");

function run(command, args, options = {}) {
  const pretty = [command, ...args].join(" ");
  console.log(`\n> ${pretty}`);
  const result = spawnSync(command, args, {
    cwd: root,
    stdio: "inherit",
    ...options,
  });
  if (result.status !== 0) {
    process.exit(result.status || 1);
  }
}

function findAdb() {
  const candidates = [
    process.env.ADB,
    process.env.ANDROID_HOME && join(process.env.ANDROID_HOME, "platform-tools", process.platform === "win32" ? "adb.exe" : "adb"),
    process.env.ANDROID_SDK_ROOT && join(process.env.ANDROID_SDK_ROOT, "platform-tools", process.platform === "win32" ? "adb.exe" : "adb"),
    process.env.LOCALAPPDATA && join(process.env.LOCALAPPDATA, "Android", "Sdk", "platform-tools", "adb.exe"),
    "adb",
  ].filter(Boolean);

  return candidates.find(candidate => candidate === "adb" || existsSync(candidate));
}

function getDeviceState(adb) {
  const output = execFileSync(adb, ["devices"], { encoding: "utf8" });
  const devices = output
    .split(/\r?\n/)
    .slice(1)
    .map(line => line.trim())
    .filter(Boolean)
    .map(line => {
      const [serial, state] = line.split(/\s+/);
      return { serial, state };
    });
  return devices[0] || null;
}

const adb = findAdb();
if (!adb) {
  console.error("No encontre adb. Instala Android Platform Tools o configura ANDROID_HOME.");
  process.exit(1);
}

function runCli(command, args, options = {}) {
  if (process.platform === "win32") {
    run("cmd.exe", ["/d", "/s", "/c", command, ...args], options);
    return;
  }
  run(command, args, options);
}

runCli("npm", ["run", "build"]);
runCli("npx", ["cap", "sync", "android"]);

if (process.platform === "win32") {
  run("cmd.exe", ["/c", "gradlew.bat", "assembleDebug"], { cwd: join(root, "android") });
} else {
  run("./gradlew", ["assembleDebug"], { cwd: join(root, "android") });
}

run(adb, ["wait-for-device"]);
const device = getDeviceState(adb);
if (!device) {
  console.error("No hay celular conectado por ADB. Conecta el cable y activa Depuracion USB.");
  process.exit(1);
}
if (device.state !== "device") {
  console.error(`El celular esta en estado "${device.state}". Acepta la ventana de Depuracion USB en el celular y vuelve a correr npm run phone.`);
  process.exit(1);
}

run(adb, ["install", "-r", apkPath]);
run(adb, ["shell", "am", "force-stop", appId]);
run(adb, ["shell", "monkey", "-p", appId, "-c", "android.intent.category.LAUNCHER", "1"]);

console.log("\nApp actualizada, instalada y abierta en el celular.");
