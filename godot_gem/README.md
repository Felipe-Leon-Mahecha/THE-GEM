# THE GEM — Prototipo de plataformero circular en Godot 4.7

Sistema de gravedad radial con dos superficies concéntricas: el jugador
camina pegado a la curvatura de cada círculo y puede cambiar entre ellos.

---

## Estructura del proyecto

```
godot_gem/
├── project.godot              ← abre esto en Godot para importar el proyecto
├── scenes/
│   ├── World.tscn             ← escena principal (ejecuta con F5)
│   └── Player.tscn            ← jugador (CharacterBody2D)
└── scripts/
    ├── player.gd              ← lógica de física radial y controles
    ├── circular_world.gd      ← generador procedural de las dos superficies
    └── input_setup.gd         ← autoload: registra los inputs en tiempo de ejecución
```

---

## Cómo abrir el proyecto

1. Abre **Godot 4.7** (Godot Engine launcher).
2. Haz clic en **Import** → navega a `godot_gem/` → selecciona `project.godot`.
3. Pulsa **Import & Edit**.
4. Presiona **F5** (o el botón ▶) para ejecutar.

> Si Godot pide un icono (`icon.svg`), crea uno vacío o copia cualquier `.svg`
> en la raíz del proyecto y nómbralo `icon.svg`.

---

## Controles

| Acción            | Tecla principal | Alternativa |
|-------------------|-----------------|-------------|
| Moverse izquierda | ← Flecha        | A           |
| Moverse derecha   | → Flecha        | D           |
| Saltar            | Espacio         | W / ↑       |
| **Invertir gravedad** | **Shift**   | **F**       |

---

## Cómo funciona la física (para quien viene de JS/Canvas)

### Gravedad radial

En un plataformero clásico la gravedad es `Vector2(0, 980)` — siempre abajo.
Aquí la gravedad es **dinámica**: apunta hacia o desde el centro del mundo
(`Vector2.ZERO`) dependiendo de la superficie en la que está el jugador.

```gdscript
# En player.gd — _update_gravity_direction()
var to_center = (Vector2.ZERO - global_position).normalized()

if gravity_toward_center:
    gravity_dir = to_center      # superficie exterior: caes hacia adentro
else:
    gravity_dir = -to_center     # núcleo: caes hacia afuera

up_direction = -gravity_dir      # "arriba" es siempre contra la gravedad
```

`up_direction` le dice a `move_and_slide()` qué es el suelo en cada frame.
Como cambia en tiempo real siguiendo la posición del jugador, el personaje
siempre "siente" el suelo curvo debajo de sus pies.

### Movimiento tangencial

En JS usarías `Math.cos(angle)` y `Math.sin(angle)` para moverte en arco.
En GDScript obtenemos la tangente girando el vector de gravedad 90°:

```gdscript
var tangent = gravity_dir.rotated(PI / 2.0)
velocity = tangent * input_dir * speed
```

Esto garantiza que izquierda/derecha siempre sean perpendiculares a la
superficie, sin importar en qué punto del círculo esté el jugador.

### Inversión de gravedad (flip)

Al presionar Shift/F, `gravity_toward_center` se invierte y se lanza al
jugador con un impulso en la nueva dirección de gravedad para que "despegue"
de la superficie actual y vuele hacia la otra.

```gdscript
func _flip_surface():
    gravity_toward_center = not gravity_toward_center
    _update_gravity_direction()
    velocity = gravity_dir * jump_force * 1.2
```

### Colisión circular

`CollisionPolygon2D` con `BUILD_SEGMENTS` genera una pared circular (hueca)
para la superficie exterior — el jugador colisiona con el interior del anillo.

`BUILD_SOLIDS` genera un disco sólido para el núcleo — el jugador colisiona
con la cara exterior.

Ambas formas se generan proceduralmente en `circular_world.gd` a partir de
N puntos igualmente espaciados en una circunferencia.

---

## Parámetros configurables (Inspector de Godot)

### Player (CharacterBody2D)

| Propiedad             | Default | Descripción                              |
|-----------------------|---------|------------------------------------------|
| `speed`               | 220.0   | Velocidad de movimiento (px/s)           |
| `jump_force`          | 380.0   | Impulso del salto                        |
| `gravity_strength`    | 600.0   | Intensidad de la gravedad radial         |
| `flip_transition_time`| 0.18 s  | Cooldown entre inversiones               |
| `outer_radius`        | 340.0   | Radio de la superficie exterior          |
| `inner_radius`        | 160.0   | Radio del núcleo interior                |

### CircularWorld (Node2D)

| Propiedad      | Default | Descripción                                    |
|----------------|---------|------------------------------------------------|
| `outer_radius` | 340.0   | Radio exterior (debe coincidir con Player)     |
| `inner_radius` | 160.0   | Radio del núcleo (debe coincidir con Player)   |
| `segments`     | 128     | Suavidad de la colisión (más = más suave)      |
| `line_width`   | 3.0     | Grosor visual de los bordes                    |
| `outer_color`  | azul    | Color de la pared exterior                     |
| `inner_color`  | naranja | Color del núcleo                               |

> **Importante:** `outer_radius` e `inner_radius` deben ser **idénticos**
> en `Player` y `CircularWorld`. Si los cambias en uno, cámbialos en el otro.

---

## Próximos pasos sugeridos

- [ ] Reemplazar el `Polygon2D` triangular por un `Sprite2D` o `AnimatedSprite2D`
- [ ] Conectar `Camera2D` al jugador con `RemoteTransform2D` para que lo siga
- [ ] Añadir fondo visual (gradiente o shader circular)
- [ ] Implementar el sistema de "gemas" coleccionables con `Area2D`
- [ ] Añadir efectos de partículas al hacer flip de gravedad
- [ ] Integrar audio con `AudioStreamPlayer2D` posicionado en el centro
