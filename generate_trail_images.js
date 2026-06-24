const fs = require('fs');
const path = require('path');

// Simular Canvas con Node.js usando una biblioteca simple
// Como no tenemos canvas instalado, crearemos un SVG y lo convertiremos a PNG
// Pero primero verifiquemos si podemos usar una solución más simple

const TRAILS_DATA = [
    { id: 'none', name: 'Ninguna', rarity: 'BASICA', rarityColor: '#888888' },
    { id: 'basic', name: 'Basica', rarity: 'BASICA', rarityColor: '#57b7dd' },
    { id: 'ghost', name: 'Ghost', rarity: 'EPICA', rarityColor: '#cc44ff' },
    { id: 'fractura', name: 'Fractura', rarity: 'EPICA', rarityColor: '#cc44ff' },
    { id: 'hielo', name: 'Hielo', rarity: 'ESPECIAL', rarityColor: '#7fd8ff' },
    { id: 'toxico', name: 'Toxico', rarity: 'ESPECIAL', rarityColor: '#8dff5a' },
    { id: 'trail_vampiro', name: 'Vampiro', rarity: 'VIP', rarityColor: '#ff4d6d' },
    { id: 'trail_zombie', name: 'Zombie', rarity: 'VIP', rarityColor: '#78ff8f' },
    { id: 'trail_fire', name: 'Elemento Fuego', rarity: 'VIP', rarityColor: '#ff8a00' },
    { id: 'trail_water', name: 'Elemento Agua', rarity: 'VIP', rarityColor: '#4488ff' },
    { id: 'trail_wind', name: 'Elemento Viento', rarity: 'VIP', rarityColor: '#00ffe7' },
    { id: 'trail_ice', name: 'Elemento Hielo', rarity: 'VIP', rarityColor: '#7fd8ff' },
    { id: 'trail_lava', name: 'Elemento Lava', rarity: 'VIP', rarityColor: '#ff4444' },
    { id: 'trail_nature', name: 'Elemento Naturaleza', rarity: 'VIP', rarityColor: '#44ff88' },
    { id: 'trail_custom_text', name: 'Texto Personalizado', rarity: 'VIP', rarityColor: '#ffda3a' },
];

const TRAIL_COLORS = {
    cyan:   '0,255,231',
    red:    '255,68,68',
    blue:   '68,136,255',
    yellow: '255,238,0',
    orange: '255,136,0',
    green:  '68,255,136',
    purple: '204,68,255',
};

function getTrailColor(trailId) {
    switch(trailId) {
        case 'basic': return TRAIL_COLORS.cyan;
        case 'ghost': return TRAIL_COLORS.purple;
        case 'fractura': return TRAIL_COLORS.red;
        case 'hielo': return TRAIL_COLORS.blue;
        case 'toxico': return TRAIL_COLORS.green;
        case 'trail_vampiro': return '255,0,0';
        case 'trail_zombie': return '120,255,143';
        case 'trail_fire': return '255,138,0';
        case 'trail_water': return '68,136,255';
        case 'trail_wind': return '0,255,231';
        case 'trail_ice': return '127,216,255';
        case 'trail_lava': return '255,68,68';
        case 'trail_nature': return '68,255,136';
        case 'trail_custom_text': return '255,218,58';
        default: return TRAIL_COLORS.cyan;
    }
}

function generateSVG(trailId) {
    const width = 400;
    const height = 400;
    const centerX = width / 2;
    const centerY = height / 2;
    const color = getTrailColor(trailId);
    const trail = TRAILS_DATA.find(t => t.id === trailId);
    
    let svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">`;
    
    // Fondo
    svgContent += `<rect width="${width}" height="${height}" fill="#0f0f1a"/>`;
    
    if (trailId === 'none') {
        svgContent += `<text x="${centerX}" y="${centerY}" fill="#666" font-size="24" font-weight="bold" text-anchor="middle">Sin Trail</text>`;
    } else {
        // Generar trail circular
        const numPoints = 40;
        const radius = 80;
        
        for (let i = 0; i < numPoints; i++) {
            const angle = (i / numPoints) * Math.PI * 2;
            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius;
            const life = (i + 1) / numPoints;
            const alpha = Math.floor(life * 255);
            const rgbColor = color;
            
            if (trailId === 'basic') {
                const size = Math.max(2, 6 * life);
                svgContent += `<circle cx="${x}" cy="${y}" r="${size}" fill="rgba(${rgbColor}, ${life * 0.9})" stroke="rgba(${rgbColor}, ${life * 0.9})" stroke-width="2"/>`;
            } else if (trailId === 'ghost') {
                svgContent += `<circle cx="${x}" cy="${y}" r="${15 * life}" fill="rgba(${rgbColor}, ${life * 0.3})"/>`;
            } else if (trailId === 'fractura') {
                const size = Math.max(2, 5 * life);
                svgContent += `<circle cx="${x}" cy="${y}" r="${size}" fill="rgba(${rgbColor}, ${life * 0.8})"/>`;
                if (i % 3 === 0) {
                    for (let j = 0; j < 3; j++) {
                        const fragAngle = Math.random() * Math.PI * 2;
                        const dist = 10 + Math.random() * 20;
                        const fragX = x + Math.cos(fragAngle) * dist;
                        const fragY = y + Math.sin(fragAngle) * dist;
                        svgContent += `<circle cx="${fragX}" cy="${fragY}" r="${3 * life}" fill="rgba(${rgbColor}, ${life * 0.6})"/>`;
                    }
                }
            } else {
                // Efecto genérico para otros trails
                svgContent += `<circle cx="${x}" cy="${y}" r="${15 * life}" fill="rgba(${rgbColor}, ${life * 0.4})"/>`;
            }
        }
    }
    
    // Nombre del trail
    svgContent += `<text x="${centerX}" y="${height - 30}" fill="#fff" font-size="28" font-weight="bold" text-anchor="middle">${trail.name}</text>`;
    
    // Rareza
    svgContent += `<text x="${centerX}" y="${height - 10}" fill="${trail.rarityColor}" font-size="16" font-weight="bold" text-anchor="middle">${trail.rarity}</text>`;
    
    svgContent += '</svg>';
    
    return svgContent;
}

// Crear directorio de salida
const outputDir = path.join(__dirname, 'assets', 'UI', 'Store', 'Imagenes Trails', 'Trails portadas');
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

console.log('Generando imágenes SVG de trails...');
console.log('Directorio de salida:', outputDir);

TRAILS_DATA.forEach(trail => {
    const svg = generateSVG(trail.id);
    const filename = `${trail.name.replace(/\s+/g, '_')}_trail.svg`;
    const filepath = path.join(outputDir, filename);
    
    fs.writeFileSync(filepath, svg);
    console.log(`✅ Creado: ${filename}`);
});

console.log('\n⚠️  Nota: Se generaron archivos SVG. Para convertirlos a PNG, necesitas:');
console.log('1. Instalar una herramienta como "sharp" o usar un convertidor online');
console.log('2. O usar el script HTML que creé anteriormente para generar PNGs directamente');
console.log('\nLos archivos SVG están en:', outputDir);
