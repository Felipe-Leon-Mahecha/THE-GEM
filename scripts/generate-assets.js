const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const PORT = 8080;

// Mapeo de colores hexadecimales para las skins
const COLORS = {
    cian: '#00ffe7',
    rojo: '#ff4444',
    azul: '#5045eb',
    amarillo: '#ffee00',
    naranja: '#ff8800',
    verde: '#3fe969',
    morado: '#cc44ff',
    blanco: '#ffffff',
    negro: '#222222'
};

const server = http.createServer((req, res) => {
    if (req.method === 'GET' && (req.url === '/' || req.url === '/index.html')) {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(getHTMLContent());
    } else if (req.method === 'POST' && req.url === '/save-asset') {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', () => {
            try {
                const { filename, folder, dataUrl } = JSON.parse(body);
                const base64Data = dataUrl.replace(/^data:image\/png;base64,/, "");
                
                // Asegurar que la carpeta existe
                const targetDir = path.resolve(folder);
                if (!fs.existsSync(targetDir)) {
                    fs.mkdirSync(targetDir, { recursive: true });
                }
                
                const targetPath = path.join(targetDir, filename);
                fs.writeFileSync(targetPath, base64Data, 'base64');
                console.log(`[GENERATED] Saved: ${targetPath}`);
                
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true }));
            } catch (err) {
                console.error('[ERROR] Failed to save asset:', err);
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Error');
            }
        });
    } else if (req.method === 'POST' && req.url === '/done') {
        console.log('[SUCCESS] All assets generated successfully!');
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('OK');
        setTimeout(() => {
            console.log('Shutting down server.');
            process.exit(0);
        }, 1000);
    } else {
        res.writeHead(404);
        res.end();
    }
});

server.listen(PORT, () => {
    console.log(`Asset generator server listening on http://localhost:${PORT}`);
    console.log('Opening browser to generate assets automatically...');
    
    // Abrir navegador según sistema operativo
    const url = `http://localhost:${PORT}`;
    const startCmd = process.platform === 'win32' ? `start ${url}` :
                     process.platform === 'darwin' ? `open ${url}` :
                     `xdg-open ${url}`;
    exec(startCmd);
});

function getHTMLContent() {
    return `<!DOCTYPE html>
<html>
<head>
    <title>THE GEM - Asset Generator</title>
    <style>
        body { font-family: sans-serif; background: #121214; color: #fff; text-align: center; padding-top: 50px; }
        .spinner { border: 4px solid rgba(255,255,255,0.1); width: 50px; height: 50px; border-radius: 50%; border-left-color: #00ffe7; animation: spin 1s linear infinite; display: inline-block; margin-bottom: 20px; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        h1 { margin-bottom: 10px; color: #00ffe7; }
        #log { max-width: 600px; margin: 20px auto; background: #1a1a1e; padding: 15px; border-radius: 8px; text-align: left; font-family: monospace; overflow-y: auto; height: 200px; }
    </style>
</head>
<body>
    <div class="spinner"></div>
    <h1>Generando Assets del Juego...</h1>
    <p>Por favor no cierres esta ventana. Los archivos PNG se están guardando en la carpeta del juego.</p>
    <div id="log"></div>

    <canvas id="canvas" width="128" height="128" style="display:none;"></canvas>

    <script>
        const colors = ${JSON.stringify(COLORS)};
        const logEl = document.getElementById('log');
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');
        
        function log(msg) {
            logEl.innerHTML += msg + '<br>';
            logEl.scrollTop = logEl.scrollHeight;
        }

        async function sendAsset(folder, filename, dataUrl) {
            const res = await fetch('/save-asset', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ folder, filename, dataUrl })
            });
            if (res.ok) {
                log('✓ Guardado: ' + filename);
            } else {
                log('✗ ERROR al guardar: ' + filename);
            }
        }

        // Dibuja una pelota 3D con brillo y sombras
        function drawPelota(colorHex) {
            ctx.clearRect(0, 0, 128, 128);
            
            const cx = 64, cy = 64, r = 52;
            
            // Degradado radial 3D
            // Luz viniendo de arriba-izquierda
            const grad = ctx.createRadialGradient(cx - r*0.35, cy - r*0.35, r*0.08, cx, cy, r);
            
            if (colorHex === '#222222') {
                // Pelota negra especial
                grad.addColorStop(0, '#ffffff'); // brillo blanco
                grad.addColorStop(0.2, '#666666'); // gris medio
                grad.addColorStop(0.8, '#111111'); // negro profundo
                grad.addColorStop(1, '#000000');
            } else if (colorHex === '#ffffff') {
                // Pelota blanca especial
                grad.addColorStop(0, '#ffffff');
                grad.addColorStop(0.2, '#f0f0f0');
                grad.addColorStop(0.8, '#cccccc');
                grad.addColorStop(1, '#999999');
            } else {
                // Pelota de color normal
                grad.addColorStop(0, '#ffffff'); // brillo blanco
                grad.addColorStop(0.15, colorHex); // color puro
                grad.addColorStop(0.75, shadeColor(colorHex, -60)); // sombra
                grad.addColorStop(1, shadeColor(colorHex, -85)); // borde oscuro
            }
            
            ctx.beginPath();
            ctx.arc(cx, cy, r, 0, Math.PI * 2);
            ctx.fillStyle = grad;
            ctx.fill();
            
            return canvas.toDataURL('image/png');
        }

        // Dibuja una dona 3D (Torus)
        function drawDona(colorHex) {
            ctx.clearRect(0, 0, 128, 128);
            
            const cx = 64, cy = 64, r = 40, w = 18;
            
            // Efecto 3D de dona usando múltiples trazos radiales / capas
            ctx.lineCap = 'round';
            
            // Capa 1: Sombra base / Borde oscuro
            ctx.beginPath();
            ctx.arc(cx, cy, r, 0, Math.PI * 2);
            ctx.strokeStyle = colorHex === '#ffffff' ? '#aaaaaa' : shadeColor(colorHex, -75);
            ctx.lineWidth = w + 4;
            ctx.stroke();
            
            // Capa 2: Cuerpo principal de color
            ctx.beginPath();
            ctx.arc(cx, cy, r, 0, Math.PI * 2);
            ctx.strokeStyle = colorHex;
            ctx.lineWidth = w;
            ctx.stroke();

            // Capa 3: Brillo luminoso interno (luz difusa)
            ctx.beginPath();
            ctx.arc(cx, cy, r, 0, Math.PI * 2);
            ctx.strokeStyle = colorHex === '#ffffff' ? '#ffffff' : shadeColor(colorHex, 45);
            ctx.lineWidth = w * 0.5;
            ctx.stroke();

            // Capa 4: Reflejo brillante de luz (Highlight)
            // Se dibuja en la parte superior izquierda de la dona
            ctx.beginPath();
            ctx.arc(cx, cy, r, Math.PI * 1.15, Math.PI * 1.75);
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 3;
            ctx.stroke();
            
            return canvas.toDataURL('image/png');
        }

        // Dibuja la skin Pichos (bola con pinchos de neón)
        function drawPichos() {
            ctx.clearRect(0, 0, 128, 128);
            
            const cx = 64, cy = 64, baseR = 32, spikeR = 56;
            const numSpikes = 10;
            
            // Dibujar los pinchos radialmente
            for (let i = 0; i < numSpikes; i++) {
                const angle = i * (Math.PI * 2 / numSpikes);
                
                const tipX = cx + spikeR * Math.cos(angle);
                const tipY = cy + spikeR * Math.sin(angle);
                
                const angleLeft = angle - 0.22;
                const angleRight = angle + 0.22;
                
                const baseLeftX = cx + baseR * Math.cos(angleLeft);
                const baseLeftY = cy + baseR * Math.sin(angleLeft);
                const baseRightX = cx + baseR * Math.cos(angleRight);
                const baseRightY = cy + baseR * Math.sin(angleRight);
                
                const gradSpike = ctx.createLinearGradient(cx, cy, tipX, tipY);
                gradSpike.addColorStop(0.3, '#7b2cbf'); // Violeta profundo de base
                gradSpike.addColorStop(0.7, '#ff007f'); // Rosa de neón medio
                gradSpike.addColorStop(1.0, '#ffffff'); // Blanco brillante en la punta
                
                ctx.beginPath();
                ctx.moveTo(baseLeftX, baseLeftY);
                ctx.lineTo(tipX, tipY);
                ctx.lineTo(baseRightX, baseRightY);
                ctx.closePath();
                ctx.fillStyle = gradSpike;
                ctx.fill();
            }
            
            // Bola de núcleo brillante
            const gradCore = ctx.createRadialGradient(cx - 8, cy - 8, 4, cx, cy, baseR);
            gradCore.addColorStop(0, '#ffffff');
            gradCore.addColorStop(0.2, '#ff007f');
            gradCore.addColorStop(0.8, '#3c096c');
            gradCore.addColorStop(1.0, '#120024');
            
            ctx.beginPath();
            ctx.arc(cx, cy, baseR, 0, Math.PI * 2);
            ctx.fillStyle = gradCore;
            ctx.fill();
            
            // Añadir borde brillante neon
            ctx.strokeStyle = '#ff007f';
            ctx.lineWidth = 2;
            ctx.stroke();
            
            return canvas.toDataURL('image/png');
        }

        // Auxiliar para oscurecer/aclarar colores hex
        function shadeColor(color, percent) {
            let R = parseInt(color.substring(1,3),16);
            let G = parseInt(color.substring(3,5),16);
            let B = parseInt(color.substring(5,7),16);

            R = parseInt(R * (100 + percent) / 100);
            G = parseInt(G * (100 + percent) / 100);
            B = parseInt(B * (100 + percent) / 100);

            R = (R<255)?R:255;  G = (G<255)?G:255;  B = (B<255)?B:255;
            R = (R>0)?R:0;      G = (G>0)?G:0;      B = (B>0)?B:0;

            const rHex = ((R.toString(16).length==1)?"0"+R.toString(16):R.toString(16));
            const gHex = ((G.toString(16).length==1)?"0"+G.toString(16):G.toString(16));
            const bHex = ((B.toString(16).length==1)?"0"+B.toString(16):B.toString(16));

            return "#"+rHex+gHex+bHex;
        }

        // Proceso de generación
        async function run() {
            log('Iniciando renderizado...');
            
            // 1. Generar Pelotas
            const folderPelotas = 'assets/UI/Store/Skins/Normal/skin pelota';
            for (const [name, hex] of Object.entries(colors)) {
                const dataUrl = drawPelota(hex);
                const filename = 'pelota ' + name + '.png';
                await sendAsset(folderPelotas, filename, dataUrl);
            }
            
            // 2. Generar Pelotas Dona
            const folderDonas = 'assets/UI/Store/Skins/Normal/pelota dona';
            for (const [name, hex] of Object.entries(colors)) {
                const dataUrl = drawDona(hex);
                const filename = 'pelota ' + name + '.png';
                await sendAsset(folderDonas, filename, dataUrl);
            }
            
            // 3. Generar Pichos
            const folderPichos = 'assets/UI/Store/Skins';
            const dataUrlPichos = drawPichos();
            await sendAsset(folderPichos, 'skin_pichos.png', dataUrlPichos);
            
            log('<br><b>¡Todo listo!</b> Finalizando en el servidor...');
            await fetch('/done', { method: 'POST' });
        }

        window.onload = run;
    </script>
</body>
</html>`;
}
