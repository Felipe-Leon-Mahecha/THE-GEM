# circular_world.gd
# THE GEM – Generador procedural de las dos superficies circulares con colisión
# Compatible con Godot 4.7 / GDScript
#
# Este nodo crea en _ready() dos StaticBody2D con CollisionPolygon2D:
#   • Superficie EXTERIOR (anillo interno de un disco grande): el jugador
#     camina por DENTRO de este círculo (como dentro de un tubo).
#   • NÚCLEO (disco sólido pequeño): el jugador camina por FUERA de este círculo.
#
# Ambas superficies se dibujan también con Line2D para verlas en pantalla.
#
# Cómo funciona la colisión circular en Godot:
#   CollisionPolygon2D acepta un polígono arbitrario. Si generamos N puntos
#   igualmente espaciados en un círculo, obtenemos una colisión circular
#   suficientemente suave. Más segmentos = más suave, más coste de CPU.
#   Para la superficie exterior usamos un polígono HUECO (BuildMode.SEGMENTS)
#   que solo colisiona en el borde, no rellena todo el disco.

class_name CircularWorld
extends Node2D

# ─── Parámetros exportables ──────────────────────────────────────────────────
@export var outer_radius: float  = 340.0   # radio de la pared exterior
@export var inner_radius: float  = 160.0   # radio del núcleo interior
@export var segments: int        = 128     # puntos del polígono (más = más suave)

# Grosor visual de los bordes (solo Line2D, no afecta colisión)
@export var line_width: float    = 3.0

# Colores de cada superficie
@export var outer_color: Color   = Color(0.2, 0.6, 1.0, 1.0)   # azul
@export var inner_color: Color   = Color(1.0, 0.4, 0.1, 1.0)   # naranja

# ─── Nodos generados (accesibles desde fuera si hace falta) ─────────────────
var outer_body: StaticBody2D
var inner_body: StaticBody2D

# ─── Inicialización ──────────────────────────────────────────────────────────

func _ready() -> void:
	_build_outer_surface()
	_build_inner_surface()

# ─── Superficie exterior ─────────────────────────────────────────────────────
# El jugador camina POR DENTRO, así que la normal de colisión apunta hacia adentro.
# Usamos BuildMode.SEGMENTS para que solo el BORDE colisione (no el interior).

func _build_outer_surface() -> void:
	outer_body = StaticBody2D.new()
	outer_body.name = "OuterSurface"
	add_child(outer_body)

	var col := CollisionPolygon2D.new()
	col.build_mode = CollisionPolygon2D.BUILD_SEGMENTS   # solo el contorno
	col.polygon    = _make_circle_points(outer_radius)
	outer_body.add_child(col)

	# Visual: Line2D cerrada
	_add_line2d(self, outer_radius, outer_color)

# ─── Núcleo interior ─────────────────────────────────────────────────────────
# El jugador camina POR FUERA del núcleo, así que la normal apunta hacia afuera.
# BUILD_SOLIDS rellena el polígono → colisiona desde adentro hacia afuera.

func _build_inner_surface() -> void:
	inner_body = StaticBody2D.new()
	inner_body.name = "InnerCore"
	add_child(inner_body)

	var col := CollisionPolygon2D.new()
	col.build_mode = CollisionPolygon2D.BUILD_SOLIDS   # disco sólido
	col.polygon    = _make_circle_points(inner_radius)
	inner_body.add_child(col)

	# Visual: Line2D cerrada
	_add_line2d(self, inner_radius, inner_color)

# ─── Helpers ─────────────────────────────────────────────────────────────────

## Genera un array de Vector2 que forman un círculo de N segmentos.
## El polígono está centrado en (0, 0) = centro del mundo.
func _make_circle_points(radius: float) -> PackedVector2Array:
	var pts := PackedVector2Array()
	pts.resize(segments)
	for i in range(segments):
		var angle: float = (TAU / segments) * i   # TAU = 2*PI en Godot
		pts[i] = Vector2(cos(angle), sin(angle)) * radius
	return pts

## Añade un Line2D cerrado al nodo padre para visualizar el círculo.
func _add_line2d(parent: Node, radius: float, color: Color) -> void:
	var line := Line2D.new()
	line.width          = line_width
	line.default_color  = color
	line.closed         = true   # une el último punto con el primero

	# Generamos puntos del Line2D (puede ser menos denso que la colisión)
	var vis_segments: int = min(segments, 128)
	for i in range(vis_segments + 1):   # +1 para cerrar visualmente
		var angle: float = (TAU / vis_segments) * i
		line.add_point(Vector2(cos(angle), sin(angle)) * radius)

	parent.add_child(line)
