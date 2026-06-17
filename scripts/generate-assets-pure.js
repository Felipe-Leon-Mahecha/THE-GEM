const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

// Mapeo de colores hexadecimales para las skins
const COLORS = {
    cian: [0, 255, 231],
    rojo: [255, 68, 68],
    azul: [80, 69, 235],
    amarillo: [255, 238, 0],
    naranja: [255, 136, 0],
    verde: [63, 233, 105],
    morado: [204, 68, 255],
    blanco: [255, 255, 255],
    negro: [34, 34, 34]
};

// --- PNG ENCODER ---
const crcTable = [];
for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
        c = ((c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
    }
    crcTable[n] = c;
}

function crc32(buf) {
    let crc = 0 ^ -1;
    for (let i = 0; i < buf.length; i++) {
        crc = (crc >>> 8) ^ crcTable[(crc ^ buf[i]) & 0xFF];
    }
    return (crc ^ -1) >>> 0;
}

function makeChunk(type, data) {
    const len = data.length;
    const buf = Buffer.alloc(4 + 4 + len + 4);
    buf.writeUInt32BE(len, 0);
    buf.write(type, 4);
    data.copy(buf, 8);
    
    const crcBuf = Buffer.alloc(4 + len);
    crcBuf.write(type, 0);
    data.copy(crcBuf, 4);
    const crc = crc32(crcBuf);
    
    buf.writeUInt32BE(crc, 8 + len);
    return buf;
}

function generatePNG(width, height, pixelFn) {
    const signature = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
    
    // IHDR chunk
    const ihdrData = Buffer.alloc(13);
    ihdrData.writeUInt32BE(width, 0);
    ihdrData.writeUInt32BE(height, 4);
    ihdrData[8] = 8; // bit depth
    ihdrData[9] = 6; // color type (RGBA)
    ihdrData[10] = 0; // compression method
    ihdrData[11] = 0; // filter method
    ihdrData[12] = 0; // interlace method
    const ihdrChunk = makeChunk('IHDR', ihdrData);
    
    // IDAT chunk
    const scanlineLength = 1 + width * 4;
    const rawData = Buffer.alloc(height * scanlineLength);
    
    for (let y = 0; y < height; y++) {
        const offset = y * scanlineLength;
        rawData[offset] = 0; // Filter 0 (None)
        for (let x = 0; x < width; x++) {
            const pixelOffset = offset + 1 + x * 4;
            // 4x Super-Sampling Anti-Aliasing (SSAA)
            const [r, g, b, a] = sampleSSAA(x, y, pixelFn);
            rawData[pixelOffset] = r;
            rawData[pixelOffset + 1] = g;
            rawData[pixelOffset + 2] = b;
            rawData[pixelOffset + 3] = a;
        }
    }
    
    const compressed = zlib.deflateSync(rawData);
    const idatChunk = makeChunk('IDAT', compressed);
    const iendChunk = makeChunk('IEND', Buffer.alloc(0));
    
    return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function sampleSSAA(x, y, pixelFn) {
    let rSum = 0, gSum = 0, bSum = 0, aSum = 0;
    const offsets = [-0.25, 0.25];
    for (let dy of offsets) {
        for (let dx of offsets) {
            const [r, g, b, a] = pixelFn(x + dx, y + dy);
            rSum += r * (a / 255);
            gSum += g * (a / 255);
            bSum += b * (a / 255);
            aSum += a;
        }
    }
    const avgA = aSum / 4;
    if (avgA === 0) return [0, 0, 0, 0];
    return [
        Math.round(rSum / 4 / (avgA / 255)),
        Math.round(gSum / 4 / (avgA / 255)),
        Math.round(bSum / 4 / (avgA / 255)),
        Math.round(avgA)
    ];
}

// --- SHADING HELPERS ---
function shade(rgb, percent) {
    const f = 1 + percent / 100;
    return [
        Math.max(0, Math.min(255, Math.round(rgb[0] * f))),
        Math.max(0, Math.min(255, Math.round(rgb[1] * f))),
        Math.max(0, Math.min(255, Math.round(rgb[2] * f)))
    ];
}

function mix(rgb1, rgb2, t) {
    return [
        Math.round(rgb1[0] * (1 - t) + rgb2[0] * t),
        Math.round(rgb1[1] * (1 - t) + rgb2[1] * t),
        Math.round(rgb1[2] * (1 - t) + rgb2[2] * t)
    ];
}

// --- SKINS DRAWING LOGIC ---

// Dibuja una pelota 3D brillante
function getPelotaPixel(x, y, rgb) {
    const cx = 64, cy = 64, r = 52;
    const dx = x - cx;
    const dy = y - cy;
    const dist = Math.sqrt(dx*dx + dy*dy);
    
    if (dist > r) return [0, 0, 0, 0];
    
    // Borde suavizado
    const alpha = dist > r - 1 ? Math.max(0, Math.min(255, (r - dist) * 255)) : 255;
    
    // Luz arriba-izquierda
    const lx = 64 - r * 0.35;
    const ly = 64 - r * 0.35;
    const ld = Math.sqrt((x - lx)*(x - lx) + (y - ly)*(y - ly));
    const t = Math.min(1, ld / (r * 1.35));
    
    let color;
    if (rgb[0] === 34 && rgb[1] === 34 && rgb[2] === 34) { // Negro
        if (t < 0.25) {
            color = mix([255, 255, 255], [100, 100, 100], t / 0.25);
        } else {
            color = mix([100, 100, 100], [10, 10, 10], (t - 0.25) / 0.75);
        }
    } else if (rgb[0] === 255 && rgb[1] === 255 && rgb[2] === 255) { // Blanco
        if (t < 0.2) {
            color = mix([255, 255, 255], [235, 235, 235], t / 0.2);
        } else {
            color = mix([235, 235, 235], [140, 140, 140], (t - 0.2) / 0.8);
        }
    } else { // Color
        if (t < 0.15) {
            color = mix([255, 255, 255], rgb, t / 0.15);
        } else if (t < 0.75) {
            color = mix(rgb, shade(rgb, -55), (t - 0.15) / 0.6);
        } else {
            color = mix(shade(rgb, -55), shade(rgb, -80), (t - 0.75) / 0.25);
        }
    }
    
    return [color[0], color[1], color[2], alpha];
}

// Dibuja una dona 3D
function getDonaPixel(x, y, rgb) {
    const cx = 64, cy = 64, r = 40, w = 18;
    const dx = x - cx;
    const dy = y - cy;
    const dist = Math.sqrt(dx*dx + dy*dy);
    
    const td = Math.abs(dist - r);
    const hw = w / 2;
    if (td > hw) return [0, 0, 0, 0];
    
    // Suavizado del tubo de la dona
    const alpha = td > hw - 1 ? Math.max(0, Math.min(255, (hw - td) * 255)) : 255;
    
    const angle = Math.atan2(dy, dx);
    const u = Math.sin(Math.PI * (td / hw + 1) / 2); // 1 en centro del tubo, 0 en bordes
    
    let color = mix(shade(rgb, -60), rgb, u);
    
    // Brillo en el lado iluminado (arriba-izquierda: -135 grados)
    const lightAngle = -Math.PI * 0.75;
    let diffAngle = Math.abs(angle - lightAngle);
    if (diffAngle > Math.PI) diffAngle = Math.PI * 2 - diffAngle;
    
    if (diffAngle < Math.PI * 0.6) {
        const litT = 1 - (diffAngle / (Math.PI * 0.6));
        const uDist = Math.abs(td / hw - 0.2); // Desplazar brillo ligeramente hacia arriba
        if (uDist < 0.35) {
            const spec = Math.pow(1 - uDist/0.35, 3) * litT;
            color = mix(color, [255, 255, 255], spec * 0.7);
        }
    }
    
    // Brillo intenso localizado
    if (diffAngle < Math.PI * 0.25) {
        const uDist = Math.abs(td / hw - 0.25);
        if (uDist < 0.1) {
            const glint = Math.pow(1 - uDist/0.1, 4) * (1 - diffAngle / (Math.PI * 0.25));
            color = mix(color, [255, 255, 255], glint * 0.95);
        }
    }
    
    return [color[0], color[1], color[2], alpha];
}

// Dibuja a Pichos (esfera de neón con pinchos)
function getPichosPixel(x, y) {
    const cx = 64, cy = 64;
    const dx = x - cx;
    const dy = y - cy;
    const dist = Math.sqrt(dx*dx + dy*dy);
    
    const numSpikes = 10;
    const baseR = 32;
    const spikeR = 56;
    
    let inSpike = false;
    let spikeT = 0;
    
    // Comprobar colisión con cada uno de los 10 pinchos
    for (let i = 0; i < numSpikes; i++) {
        const spikeAngle = i * (Math.PI * 2 / numSpikes);
        
        const tipX = spikeR * Math.cos(spikeAngle);
        const tipY = spikeR * Math.sin(spikeAngle);
        
        const aLeft = spikeAngle - 0.22;
        const aRight = spikeAngle + 0.22;
        
        const lx = baseR * Math.cos(aLeft);
        const ly = baseR * Math.sin(aLeft);
        
        const rx = baseR * Math.cos(aRight);
        const ry = baseR * Math.sin(aRight);
        
        if (pointInTriangle(dx, dy, lx, ly, rx, ry, tipX, tipY)) {
            inSpike = true;
            // Proyección para saber qué tan cerca de la punta está el pixel
            const axisX = tipX - (lx + rx)/2;
            const axisY = tipY - (ly + ry)/2;
            const axisLen = Math.sqrt(axisX*axisX + axisY*axisY);
            const ux = axisX / axisLen;
            const uy = axisY / axisLen;
            
            const proj = (dx - (lx+rx)/2) * ux + (dy - (ly+ry)/2) * uy;
            spikeT = Math.max(0, Math.min(1, proj / axisLen));
            break;
        }
    }
    
    function pointInTriangle(px, py, x1, y1, x2, y2, x3, y3) {
        const d1 = (px - x2) * (y1 - y2) - (x1 - x2) * (py - y2);
        const d2 = (px - x3) * (y2 - y3) - (x2 - x3) * (py - y3);
        const d3 = (px - x1) * (y3 - y1) - (x3 - x1) * (py - y1);
        
        const neg = (d1 < 0) || (d2 < 0) || (d3 < 0);
        const pos = (d1 > 0) || (d2 > 0) || (d3 > 0);
        
        return !(neg && pos);
    }
    
    if (dist <= baseR) {
        // Bola central brillante
        const lx = 56, ly = 56;
        const ld = Math.sqrt((x - lx)*(x - lx) + (y - ly)*(y - ly));
        const t = Math.min(1, ld / (baseR * 1.35));
        
        let color;
        if (t < 0.2) {
            color = mix([255, 255, 255], [255, 0, 127], t / 0.2); // Brillo blanco a rosa neón
        } else if (t < 0.8) {
            color = mix([255, 0, 127], [60, 9, 108], (t - 0.2) / 0.6); // Rosa a violeta
        } else {
            color = mix([60, 9, 108], [18, 0, 36], (t - 0.8) / 0.2);
        }
        
        // Borde exterior de neón rosa
        if (dist > baseR - 2.5) {
            const borderT = (baseR - dist) / 2.5;
            color = mix([255, 0, 127], color, borderT);
        }
        
        return [color[0], color[1], color[2], 255];
    } else if (inSpike) {
        // Degradado de pincho: violeta -> rosa -> blanco
        let color;
        if (spikeT < 0.35) {
            color = mix([123, 44, 191], [255, 0, 127], spikeT / 0.35);
        } else {
            color = mix([255, 0, 127], [255, 255, 255], (spikeT - 0.35) / 0.65);
        }
        
        // Antialiasing en los bordes del pincho
        return [color[0], color[1], color[2], 255];
    }
    
    return [0, 0, 0, 0];
}

// --- SAVE ASSETS PIPELINE ---

function saveAsset(folder, filename, pngBuffer) {
    const targetDir = path.resolve(folder);
    if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
    }
    const targetPath = path.join(targetDir, filename);
    fs.writeFileSync(targetPath, pngBuffer);
    console.log(`[GENERATED] Saved: ${targetPath} (${pngBuffer.length} bytes)`);
}

function run() {
    console.log("=== INICIANDO GENERACIÓN PURA DE IMÁGENES ===");
    
    // 1. Generar Pelotas
    const folderPelotas = 'assets/UI/Store/Skins/Normal/skin pelota';
    for (const [name, rgb] of Object.entries(COLORS)) {
        const png = generatePNG(128, 128, (x, y) => getPelotaPixel(x, y, rgb));
        saveAsset(folderPelotas, `pelota ${name}.png`, png);
    }
    
    // 2. Generar Pelotas Dona
    const folderDonas = 'assets/UI/Store/Skins/Normal/pelota dona';
    for (const [name, rgb] of Object.entries(COLORS)) {
        const png = generatePNG(128, 128, (x, y) => getDonaPixel(x, y, rgb));
        saveAsset(folderDonas, `pelota ${name}.png`, png);
    }
    
    // 3. Generar Pichos
    const folderPichos = 'assets/UI/Store/Skins';
    const pngPichos = generatePNG(128, 128, (x, y) => getPichosPixel(x, y));
    saveAsset(folderPichos, 'skin_pichos.png', pngPichos);
    
    console.log("=== GENERACIÓN PURA DE ASSETS COMPLETADA CON ÉXITO ===");
}

run();
