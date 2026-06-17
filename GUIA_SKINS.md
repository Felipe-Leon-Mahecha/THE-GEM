# 🎮 GUÍA DE SKINS — THE GEM
> Para humanos normales, no ingenieros

---

## 📁 Estructura de carpetas

```
assets/UI/Store/VIP/Bundles/[Paquete]/
│
├── skin_zombie.png          ← imagen SUELTA = la que ve la tienda
│
└── skin_zombie/             ← carpeta de la skin (para el juego)
    ├── skin_zombie_lado.png             (si es simétrica)
    ├── skin_zombie_lado_derecho.png     (si es asimétrica)
    └── skin_zombie_lado_izquierdo.png   (si es asimétrica)
```

**Regla de oro:** la imagen suelta es para la tienda, la carpeta es para el juego en movimiento.

---

## 🎨 Tipos de skin

### 🔄 Rueda (rolling)
Gira como una llanta según la dirección. Ideal para cosas redondas.
- Ejemplos: dona, pizza, planetas, caramelo
- No necesita carpeta de lados
- Solo se marca en `shop.js` con `rolling: true`

### ↔️ Lados (el nuevo sistema)
Tiene imagen de perfil. Puede ser:

**Simétrica** → los dos lados se ven iguales (espejados)
- Solo necesitas `skin_[nombre]_lado.png`
- El código la voltea solo para la izquierda
- Ejemplos: fantasma, lobo, bruja

**Asimétrica** → los lados son diferentes (rayo en un lado, musgo en el otro)
- Necesitas `skin_[nombre]_lado_derecho.png` + `skin_[nombre]_lado_izquierdo.png`
- Ejemplos: zombie, mago (bastón en una mano), arquera

### 🔵 Sin imagen lateral (skins viejas / básicas)
Usan la imagen de la tienda como fallback, o son solo una bolita de color.
- No pasa nada, el juego las muestra igual
- Se van actualizando poco a poco

---

## 📐 drawScale — el tamaño visual

La hitbox (zona de colisión) **siempre es la bolita circular** y nunca cambia.
El `drawScale` solo afecta qué tan grande se VE la imagen:

| Tipo de skin | drawScale sugerido |
|---|---|
| Bolita simple sin accesorios | `1.0` |
| Detalles pequeños (orejas, colmillos) | `1.3` |
| Accesorios medianos (capa, cuernos pequeños) | `1.5` |
| Sombrero, corona, bastón | `1.6 – 1.7` |
| Sombrero MUY alto, alas grandes | `1.8` |

> 💡 Cuando diseñes el arte: la bolita debe ocupar el **60-70% del canvas**.
> El resto es espacio para accesorios. Así se ve bien con cualquier drawScale.

---

## ✅ Checklist para agregar una skin nueva

### Paso 1 — Decide el tipo
- [ ] ¿Gira como rueda? → `rolling`
- [ ] ¿Tiene lados iguales? → `symmetric: true`
- [ ] ¿Tiene lados diferentes? → `symmetric: false`

### Paso 2 — Prepara el arte
- [ ] Fondo **transparente** (PNG con alpha, NO fondo negro)
- [ ] Bolita ocupando el 60-70% del canvas
- [ ] Imagen suelta para la tienda: `skin_[nombre].png` en la carpeta del paquete
- [ ] Si tiene lados: crear carpeta `skin_[nombre]/` con sus imágenes

### Paso 3 — Agregar en `shop.js`
En el paquete que corresponde dentro de `VIP_PACKAGES_DATA`:
```js
// Rueda:
{ type: 'vipSkin', id: 'skin_nueva', name: 'Nueva', price: 300,
  image: 'assets/.../skin_nueva.png', rolling: true }

// Con lados:
{ type: 'vipSkin', id: 'skin_nueva', name: 'Nueva', price: 300,
  image: 'assets/.../skin_nueva.png' }
```

### Paso 4 — Agregar en `skins-side.js` (solo si NO es rolling)
Descomenta la línea existente o agrega una nueva:
```js
{ id: 'skin_nueva', folder: 'assets/.../skin_nueva', symmetric: true, drawScale: 1.5 }
```

### Paso 5 — Decidir dónde aparece en la tienda

| Quiero que... | Hago... |
|---|---|
| Se compre en tienda normal | Agregar en `SKINS_DATA` con `vipOnly: false` |
| Aparezca en tienda normal pero dirija al VIP | Agregar en `SKINS_DATA` con `vipOnly: true` |
| Solo exista en paquete VIP | Solo en `VIP_PACKAGES_DATA`, no en `SKINS_DATA` |
| Esté en ambos lados | En los dos, con `vipOnly: true` en `SKINS_DATA` |

---

## 🗑️ Eliminar una skin

1. Buscar su `id` en `shop.js` con Ctrl+F
2. Si no aparece → el PNG está huérfano, se borra sin miedo
3. Si aparece → borrar esa línea del array + borrar el PNG
4. Verificar también en `skins-side.js` por si está registrada ahí

---

## 📦 Paquetes existentes y sus rutas

| Paquete | Carpeta |
|---|---|
| Monstruos | `Bundles/Monsters/` |
| Realeza | `Bundles/Royal/` |
| Espacio | `Bundles/Space/` |
| Comida | `Bundles/Food/` |
| Salvaje | `Bundles/Wild/` |
| Navidad | `Bundles/Christmas/` |
| Mitología | `Bundles/Mythology/` |
| Criaturas | `Bundles/Creatures/` |
| Dark Carnival | `Bundles/DarkCarnival/` |
| Elementos | `Bundles/Elements/` |
| Profesional | `Bundles/Professional/` |
| Emojis | `Bundles/Emojis/` |

---

## ⚠️ Cosas importantes que NO olvidar

- El PNG siempre con **fondo transparente**, no negro
- El `id` de la skin debe ser **exactamente igual** en `shop.js` y `skins-side.js`
- Las skins con `rolling: true` **no van** en `skins-side.js`
- El `lado.png` y `lado_derecho.png` deben mostrar el personaje mirando a la **derecha**
- La hitbox es siempre la bolita, los accesorios son puramente visuales

---

## 🐛 Cosas pendientes / posibles bugs conocidos

> Estos no los revisamos en detalle pero valen la pena revisar:

- **Botón de pausa en nivel** — comportamiento inconsistente reportado
- **Player AI** — se queda en el centro sin moverse (si hay modo AI)
- **HUD superpuesto con el reloj del sistema** en algunos Android
- **Panel de tienda** — sizing en móvil puede verse raro
- **Ícono del APK** — sigue siendo el default de Capacitor
- **Level select screen** — escalado en móvil pendiente de revisar

