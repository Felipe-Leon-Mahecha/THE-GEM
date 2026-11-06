# player.gd
# THE GEM – Sistema de gravedad radial para plataformero circular
# Compatible con Godot 4.7 / GDScript
#
# Conceptos clave (para quien viene de JS/Canvas):
#   - La "gravedad" no es un vector fijo hacia abajo, sino un vector
#     que apunta HACIA o DESDE el centro del mundo según la superficie.
#   - "up_direction" en CharacterBody2D es la normal de la superficie
#     bajo los pies del jugador, no el eje Y global.
#   - move_and_slide() usa up_direction para determinar qué es "suelo".

class_name Player
extends CharacterBody2D

# ─── Parámetros exportables (editables en Inspector) ────────────────────────
@export var speed: float          = 220.0   # px/s de movimiento lateral
@export var jump_force: float     = 380.0   # impulso de salto
@export var gravity_strength: float = 600.0 # equivalente a 9.8 m/s² escalado

# Tiempo de transición al invertir gravedad (en segundos)
@export var flip_transition_time: float = 0.18

# Radios de las dos superficies (deben coincidir con CircularWorld)
@export var outer_radius: float = 340.0
@export var inner_radius: float = 160.0

# ─── Estado interno ──────────────────────────────────────────────────────────
enum Surface { OUTER, INNER }
var current_surface: Surface = Surface.OUTER

# true  → gravedad apunta al centro   (jugador en superficie EXTERIOR, pies adentro)
# false → gravedad apunta al exterior (jugador en NÚCLEO, pies afuera)
var gravity_toward_center: bool = true

# Vector normalizado que representa la dirección de la gravedad actual
var gravity_dir: Vector2 = Vector2.DOWN

# Flag para evitar spam del input de flip mientras está en el aire
var can_flip: bool = true

# Referencia al nodo de sprite/visual para rotarlo sin afectar la colisión
@onready var visual: Node2D = $Visual   # asigna tu Sprite2D aquí

# ─── Ciclo principal ─────────────────────────────────────────────────────────

func _ready() -> void:
	# Posicionar al jugador sobre la superficie exterior al inicio
	position = Vector2(0.0, -outer_radius + 20.0)   # justo por encima del suelo externo
	_update_gravity_direction()

func _physics_process(delta: float) -> void:
	_update_gravity_direction()
	_apply_gravity(delta)
	_handle_input(delta)
	_align_visual_to_surface()
	move_and_slide()

# ─── Gravedad radial ─────────────────────────────────────────────────────────

func _update_gravity_direction() -> void:
	# Calcula el vector desde el jugador hacia el centro del mundo (Vector2.ZERO)
	var to_center: Vector2 = (Vector2.ZERO - global_position).normalized()

	if gravity_toward_center:
		gravity_dir = to_center          # superficie exterior: caes hacia adentro
	else:
		gravity_dir = -to_center         # núcleo: caes hacia afuera

	# up_direction es lo opuesto a la gravedad → los pies apuntan contra la gravedad
	up_direction = -gravity_dir

func _apply_gravity(delta: float) -> void:
	if not is_on_floor():
		velocity += gravity_dir * gravity_strength * delta

# ─── Input ───────────────────────────────────────────────────────────────────

func _handle_input(delta: float) -> void:
	# Movimiento lateral relativo a la superficie actual
	# "derecha" e "izquierda" son tangentes al círculo, no el eje X global
	var tangent: Vector2 = gravity_dir.rotated(PI / 2.0)   # perpendicular a la gravedad

	var input_dir: float = 0.0
	if Input.is_action_pressed("move_right"):
		input_dir += 1.0
	if Input.is_action_pressed("move_left"):
		input_dir -= 1.0

	if input_dir != 0.0:
		velocity = tangent * input_dir * speed + gravity_dir * velocity.dot(gravity_dir)
	else:
		# Fricción: frena el componente tangencial cuando no hay input
		var radial_vel: float  = velocity.dot(gravity_dir)
		var tangent_vel: float = velocity.dot(tangent)
		tangent_vel = move_toward(tangent_vel, 0.0, speed * 4.0 * delta)
		velocity = gravity_dir * radial_vel + tangent * tangent_vel

	# Salto
	if Input.is_action_just_pressed("jump") and is_on_floor():
		velocity += up_direction * jump_force

	# Invertir gravedad (cambiar superficie)
	if Input.is_action_just_pressed("flip_gravity") and (is_on_floor() or can_flip):
		_flip_surface()

# ─── Cambio de superficie ────────────────────────────────────────────────────

func _flip_surface() -> void:
	can_flip = false
	gravity_toward_center = not gravity_toward_center

	if gravity_toward_center:
		current_surface = Surface.OUTER
	else:
		current_surface = Surface.INNER

	# Lanza al jugador en la dirección de la nueva gravedad con el mismo
	# impulso que un salto, para que "despegue" de la superficie actual
	_update_gravity_direction()
	velocity = gravity_dir * jump_force * 1.2

	# Reactiva el flip después del tiempo de cooldown
	await get_tree().create_timer(flip_transition_time).timeout
	can_flip = true

# ─── Rotación visual ─────────────────────────────────────────────────────────

func _align_visual_to_surface() -> void:
	if not is_instance_valid(visual):
		return
	# Rota el visual para que los "pies" apunten contra la gravedad
	# angle_to() + rotación gradual para que sea suave, no instantáneo
	var target_angle: float = up_direction.angle() + PI / 2.0
	visual.rotation = lerp_angle(visual.rotation, target_angle, 0.25)
