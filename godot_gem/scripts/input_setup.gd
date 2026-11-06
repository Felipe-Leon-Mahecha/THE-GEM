# input_setup.gd
# Registra los InputMap necesarios en tiempo de ejecución si no existen.
# Añade este script como Autoload en Project > Project Settings > Autoload
# (nombre: InputSetup, ruta: res://scripts/input_setup.gd)
#
# Controles por defecto:
#   move_left      → Flecha izquierda  / A
#   move_right     → Flecha derecha    / D
#   jump           → Espacio           / W / Flecha arriba
#   flip_gravity   → Shift             / F  (cambia entre núcleo y exterior)

extends Node

func _ready() -> void:
	_ensure_action("move_left",    [KEY_LEFT,  KEY_A])
	_ensure_action("move_right",   [KEY_RIGHT, KEY_D])
	_ensure_action("jump",         [KEY_SPACE, KEY_W, KEY_UP])
	_ensure_action("flip_gravity", [KEY_SHIFT, KEY_F])

func _ensure_action(action: String, keys: Array) -> void:
	if not InputMap.has_action(action):
		InputMap.add_action(action)
		for key in keys:
			var ev := InputEventKey.new()
			ev.keycode = key
			InputMap.action_add_event(action, ev)
