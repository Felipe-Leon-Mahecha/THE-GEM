# 💎 THE GEM

> Juego arcade/survival 2D desarrollado con HTML5 Canvas, JavaScript nativo y Capacitor para Android.

🔗 **[Jugar en línea](https://thegembyfelixcompany.netlify.app/)** *(versión de demostración — puede no estar actualizada)*

---

## 🎮 ¿De qué trata el juego?

**THE GEM** es un juego de habilidad y reflejos donde controlas una **bolita** que se mueve de forma **orbital** dentro de un túnel circular. Tu objetivo es **sobrevivir el tiempo que dura cada nivel** esquivando obstáculos mientras recolectas monedas y gemas.

La bolita se desplaza entre dos zonas:
- **Núcleo interno** — la parte de adentro del túnel
- **Domo externo** — la parte de afuera del túnel

Alternar entre ambas zonas con un solo toque es la mecánica central. Cada nivel tiene su propio tiempo de supervivencia, sus obstáculos y su tema visual.

Los obstáculos incluyen **pinchos**, **sierras rotativas** y **láseres**.

---

## ✨ Características principales

- 🌀 **Movimiento orbital** único — no es un juego de plataformas común
- ⏱️ **Tiempo variable por nivel** — cada nivel define su propio reto de duración
- 💀 **Dead Coins** y **Rubíes** como monedas del juego
- 🛍️ **Tienda** con skins, trails, emotes, banners y power-ups desbloqueables
- 🎯 **Sistema de combos** y esquives perfectos (near-miss) con efectos visuales y multiplicadores de recompensa
- 🏆 **17 rangos** de progresión por XP: desde *Cobre* hasta *The Gem*
- 🗺️ **Camino de Rangos** — mapa visual con islas flotantes y nodos de recompensa
- 🧩 **Sistema de fragmentos** — desbloquea skins especiales coleccionando 4 fragmentos
- 📱 **Compatible con Android** (empaquetado con Capacitor)
- 🎵 Música de fondo y efectos de sonido

---

## 🕹️ Cómo se juega

| Plataforma | Acción |
|-----------|--------|
| **Móvil** | Toca la pantalla para cambiar de zona (núcleo ↔ domo) |
| **PC / Navegador** | Clic o barra espaciadora para cambiar de zona |

Esquiva todos los obstáculos y sobrevive el tiempo del nivel para ganar. Recolecta monedas en el camino para desbloquear contenido en la tienda.

---

## 🗺️ Niveles disponibles

| # | Nombre | Obstáculos |
|---|--------|-----------|
| 1 | The Beggin | Pinchos |
| 2 | Volcano | Pinchos + Sierras |
| 3 | Frozen World | Pinchos + Sierras + Láseres |

---

## 🏅 Sistema de rangos

Hay **17 rangos** que se desbloquean acumulando XP al ganar partidas:

`Cobre → Hierro → Plata → Oro → Ámbar → Diamante → Granate → Rubí → Obsidiana → Zafiro → Esmeralda → Amatista → Prisma → Ópalo → Celestita → Voidita → The Gem`

El progreso se visualiza en el **Camino de Rangos**, un mapa con islas flotantes y nodos de recompensa reclamables.

---

## 🚀 Cómo ejecutarlo localmente

### Requisitos previos
- [Node.js](https://nodejs.org/) versión 16 o superior
- npm (viene incluido con Node.js)

### Pasos

```bash
# 1. Clona el repositorio
git clone https://github.com/Felipe-Leon-Mahecha/THE-GEM.git

# 2. Entra a la carpeta
cd THE-GEM

# 3. Instala las dependencias
npm install

# 4. Inicia el servidor de desarrollo
npm run dev
```

Luego abre tu navegador en `http://localhost:5173` (o el puerto que indique Vite en consola).

---

## 📱 Compilar para Android

> Requiere tener instalado Android Studio y el SDK de Android.

```bash
# 1. Genera el build de producción
npm run build

# 2. Sincroniza con el proyecto Android
npx cap sync android

# 3. Abre en Android Studio
npx cap open android
```

Desde Android Studio puedes correrlo en un emulador o conectando tu celular por USB con **Depuración USB** activada.

---

## 🗂️ Estructura del proyecto

```
THE-GEM/
├── index.html              # Punto de entrada
├── config.js               # Configuración visual centralizada (colores, fuentes, etc.)
├── levels.config.js        # Configuración de niveles y tiempos
├── prices.config.js        # Precios de la tienda
├── responsive.css          # Variables CSS y diseño responsive
├── style.css               # Estilos generales
├── main.js                 # Bucle del juego, físicas y colisiones
├── ui.js                   # Interfaz de usuario (HUD, pantallas)
├── shop.js                 # Sistema de tienda
├── levelselect.js          # Pantalla de selección de nivel
├── obstacles.js            # Obstáculos (pinchos, sierras, láseres)
├── particles.js            # Sistema de partículas
├── rank-system.js          # Sistema de rangos y XP
├── combo-system.js         # Sistema de combos y near-miss
├── powerups.js             # Potenciadores
├── fragment-system.js      # Fragmentos y skins especiales
├── skins-side.js           # Datos de skins con perfil lateral
├── trails.js               # Estelas visuales
├── player.js               # Lógica del jugador
├── assets/                 # Imágenes, sonidos y fuentes
├── android/                # Proyecto nativo Android (Capacitor)
├── capacitor.config.json   # Configuración de Capacitor
└── vite.config.js          # Configuración de Vite
```

---

## 💾 Guardado de datos

El juego guarda tu progreso automáticamente en el navegador (`localStorage`), incluyendo monedas, gemas, XP, skins desbloqueadas y configuración de audio. No necesitas cuenta ni conexión a internet para jugar localmente.

> 🥚 **Easter egg:** Ingresa el nombre **"LEX"** en tu perfil y verás qué pasa.

---

## 🛠️ Tecnologías utilizadas

- **HTML5 Canvas** — renderizado del juego
- **JavaScript ES6** — lógica y mecánicas
- **Vite** — bundler y servidor de desarrollo
- **Capacitor** — empaquetado para Android
- **CSS Variables** — sistema de diseño responsive

---

## 👤 Autor

**Felipe León Mahecha**  
Estudiante de Tecnología en Análisis y Desarrollo de Software — SENA  
📍 Paipa, Boyacá, Colombia

---

## 📄 Estado del proyecto

🚧 **En desarrollo activo** — nuevas mecánicas, niveles y contenido siendo añadidos constantemente.
