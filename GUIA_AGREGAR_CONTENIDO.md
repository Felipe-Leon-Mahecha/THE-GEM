# 📦 GUÍA: Agregar contenido a THE GEM
> Referencia rápida para agregar skins, bundles, trails y paquetes nuevos

---

## 🗂️ Dónde va cada cosa

| Archivo | Para qué |
|---|---|
| `shop.js` | Registrar skins, bundles y paquetes en la tienda |
| `skins-side.js` | Configurar cómo se mueve la skin en el juego |
| `assets/UI/Store/VIP/Bundles/[Paquete]/` | Las imágenes |

---

## 🎨 Tipos de item que existen en `shop.js`

| `type` | Qué es |
|---|---|
| `vipSkin` | Skin individual dentro de un paquete VIP |
| `skin` | Skin dentro de un bundle (van de a dos o más) |
| `bundle` | Mini-paquete con 2+ items (skin + trail, o 2 skins) |
| `trail` | Trail dentro de un bundle |
| `vipTrailPng` | Trail individual dentro de un paquete VIP |
| `elementTrail` | Trail de elemento (fuego, agua, etc.) |
| `emoji` | Emoji individual |
| `emojiPack` | Pack de emojis |
| `customTextTrail` | Trail de texto personalizable |

---

## ✅ CASO 1 — Agregar una skin individual a un paquete existente

**Ejemplo:** agregar `skin_taco` al paquete Comida.

### Paso 1 — Imagen
Poner en `assets/UI/Store/VIP/Bundles/Food/`:
```
skin_taco.png   ← imagen para la tienda (suelta en la carpeta del paquete)
```

### Paso 2 — `shop.js`
Buscar el paquete `food` en `VIP_PACKAGES_DATA` y agregar en su array `items`:
```js
// Sin rolling (tiene imagen lateral):
{ type: 'vipSkin', id: 'skin_taco', name: 'Taco', price: 260, image: 'assets/UI/Store/VIP/Bundles/Food/skin_taco.png' },

// Con rolling (gira como rueda):
{ type: 'vipSkin', id: 'skin_taco', name: 'Taco', price: 260, image: 'assets/UI/Store/VIP/Bundles/Food/skin_taco.png', rolling: true },
```

### Paso 3 — `skins-side.js` (solo si NO tiene rolling)
Agregar en la sección correspondiente:
```js
{ id: 'skin_taco', folder: 'assets/UI/Store/VIP/Bundles/Food/skin_taco', symmetric: true, drawScale: 1.4 },
```
Y crear la carpeta con su imagen lateral:
```
Food/skin_taco/skin_taco_lado.png
```

---

## ✅ CASO 2 — Agregar un bundle (dos skins juntas)

**Ejemplo:** bundle "Los Bufones" con bufón diurno y nocturno, dentro del paquete Royal.

### Paso 1 — Imágenes
```
Royal/skin_bufon_diurno.png     ← suelta
Royal/skin_bufon_nocturno.png   ← suelta
```

### Paso 2 — `shop.js`
Dentro del paquete `royal` en `VIP_PACKAGES_DATA`, agregar en `items`:
```js
{
    type: 'bundle',
    name: 'Los Bufones',
    price: 620,
    image: 'assets/UI/Store/VIP/Bundles/Royal/skin_bufon_diurno.png',
    items: [
        { type: 'skin', id: 'skin_bufon_diurno',   name: 'Bufón Diurno',   image: 'assets/UI/Store/VIP/Bundles/Royal/skin_bufon_diurno.png' },
        { type: 'skin', id: 'skin_bufon_nocturno',  name: 'Bufón Nocturno', image: 'assets/UI/Store/VIP/Bundles/Royal/skin_bufon_nocturno.png' }
    ]
},
```

### Paso 3 — `skins-side.js`
```js
{ id: 'skin_bufon_diurno',   folder: 'assets/UI/Store/VIP/Bundles/Royal/skin_bufon_diurno',   symmetric: true, drawScale: 1.8 },
{ id: 'skin_bufon_nocturno', folder: 'assets/UI/Store/VIP/Bundles/Royal/skin_bufon_nocturno', symmetric: true, drawScale: 1.8 },
```

### Paso 4 — Carpetas con imágenes laterales
```
Royal/skin_bufon_diurno/skin_bufon_diurno_lado.png
Royal/skin_bufon_nocturno/skin_bufon_nocturno_lado.png
```

---

## ✅ CASO 3 — Agregar un bundle (skin + trail)

**Ejemplo:** bundle "Dracula" con skin y trail (como los que ya existen).

```js
{
    type: 'bundle',
    name: 'Dracula',
    price: 520,
    image: 'assets/UI/Store/VIP/Bundles/Monsters/skin_conde_dracula.png',
    items: [
        { type: 'skin',  id: 'skin_conde_dracula', name: 'Conde Dracula', image: 'assets/...skin_conde_dracula.png' },
        { type: 'trail', id: 'trail_vampiro',       name: 'Trail Vampiro', image: 'assets/...trail_vampiro.png', trailId: 'trail_vampiro' }
    ]
},
```

> ⚠️ El `trailId` debe coincidir con el ID que usa el sistema de trails en `main.js`

---

## ✅ CASO 4 — Crear un paquete VIP nuevo desde cero

**Ejemplo:** paquete nuevo "Piratas".

### Paso 1 — Imágenes necesarias
```
assets/UI/Store/VIP/Bundles/Piratas/
├── panel_bundle_piratas.png    ← portada del paquete (se ve en el carrusel VIP)
├── bg_piratas_panel.png        ← fondo del panel de detalle
├── popup_piratas_bg.png        ← fondo del popup
├── skin_pirata_rojo.png        ← skins sueltas
└── skin_pirata_negro.png
```

### Paso 2 — `shop.js`
Al final de `VIP_PACKAGES_DATA` (antes del `];` de cierre), agregar:
```js
{
    id: 'piratas',
    title: 'PAQUETE PIRATAS',
    price: 1200,
    cover: 'assets/UI/Store/VIP/Bundles/Piratas/panel_bundle_piratas.png',
    detailBackground: 'assets/UI/Store/VIP/Bundles/Piratas/bg_piratas_panel.png',
    popupBackground: 'assets/UI/Store/VIP/Bundles/Piratas/popup_piratas_bg.png',
    accent: '#ff8800',   ← color del acento del panel (hex)
    items: [
        { type: 'vipSkin', id: 'skin_pirata_rojo',  name: 'Pirata Rojo',  price: 300, image: 'assets/UI/Store/VIP/Bundles/Piratas/skin_pirata_rojo.png' },
        { type: 'vipSkin', id: 'skin_pirata_negro', name: 'Pirata Negro', price: 300, image: 'assets/UI/Store/VIP/Bundles/Piratas/skin_pirata_negro.png' },
    ]
},
```

### Paso 3 — `skins-side.js`
Agregar una sección nueva:
```js
// ══════════════════════════════════════════════════════
// PIRATAS
// ══════════════════════════════════════════════════════
{ id: 'skin_pirata_rojo',  folder: 'assets/UI/Store/VIP/Bundles/Piratas/skin_pirata_rojo',  symmetric: false, drawScale: 1.6 },
{ id: 'skin_pirata_negro', folder: 'assets/UI/Store/VIP/Bundles/Piratas/skin_pirata_negro', symmetric: false, drawScale: 1.6 },
```

---

## ✅ CASO 5 — Agregar skins de comida nuevas (tu caso actual)

En el paquete `food` de `VIP_PACKAGES_DATA`, dentro de `items`, agregar:

```js
// Sin rolling (tiene lados):
{ type: 'vipSkin', id: 'skin_sushi',    name: 'Sushi',    price: 260, image: 'assets/UI/Store/VIP/Bundles/Food/skin_sushi.png' },

// Con rolling:
{ type: 'vipSkin', id: 'skin_naranja',  name: 'Naranja',  price: 260, image: 'assets/UI/Store/VIP/Bundles/Food/skin_naranja.png', rolling: true },
```

Y en `skins-side.js` en la sección COMIDA (las que no tienen rolling):
```js
{ id: 'skin_sushi', folder: 'assets/UI/Store/VIP/Bundles/Food/skin_sushi', symmetric: true, drawScale: 1.4 },
```

---

## 📐 Referencia rápida de drawScale

| Tipo de accesorio | drawScale |
|---|---|
| Sin accesorios | `1.0 – 1.3` |
| Detalles pequeños (orejas, colmillos) | `1.4` |
| Accesorios medianos (cuernos, capa, corona) | `1.5 – 1.6` |
| Sombrero alto, bastón, alas | `1.7 – 1.8` |

> Empieza siempre en `1.4` y ajusta a ojo en el juego.

---

## ⚠️ Reglas que no se pueden olvidar

- El `id` debe ser **exactamente igual** en `shop.js` y `skins-side.js`
- Siempre fondo **transparente** en los PNG (no negro)
- Las skins con `rolling: true` en `shop.js` **no van** en `skins-side.js`
- `lado.png` y `lado_derecho.png` = personaje mirando a la **derecha**
- La hitbox es siempre la bolita — los accesorios son puramente visuales
- Si el bundle tiene `popupBackground` propio, se muestra ese en lugar del del paquete

