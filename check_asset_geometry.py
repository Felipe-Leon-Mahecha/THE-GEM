#!/usr/bin/env python3
"""
check_asset_geometry.py

Verifica si un PNG cumple con la geometria esperada para assets de THE GEM:
- Centrado exacto (el contenido visible cae justo en el centro del lienzo)
- Radio aproximado como % del lienzo (ancho y alto por separado)
- Circularidad (si el contenido es igual de ancho que de alto, señal de
  que es un círculo real y no un óvalo)

Detecta el "contenido" de dos formas:
1. Si el PNG tiene canal alfa real (transparencia), usa eso.
2. Si no tiene transparencia real (fondo blanco sólido), detecta el
   contenido como "todo lo que no es casi-blanco".

Uso:
    python check_asset_geometry.py ruta/a/imagen.png
    python check_asset_geometry.py ruta/a/imagen.png otra_imagen.png ...

Requiere: pip install pillow numpy
"""
import sys
import numpy as np
from PIL import Image


def analyze(path, white_threshold=245, center_tolerance_pct=1.0, circularity_tolerance_pct=2.0):
    img = Image.open(path).convert("RGBA")
    w, h = img.size
    arr = np.array(img)
    alpha = arr[:, :, 3]

    if alpha.min() < 250:
        mask = alpha > 10
        modo = "canal alfa (transparencia real detectada)"
    else:
        rgb = arr[:, :, :3]
        mask = ~np.all(rgb > white_threshold, axis=-1)
        modo = "SIN transparencia real -> detectando por fondo blanco"

    ys, xs = np.where(mask)
    print(f"\n{'=' * 60}")
    print(f"Archivo: {path}")
    print(f"Lienzo: {w}x{h}px")
    print(f"Modo de detección: {modo}")

    if len(xs) == 0:
        print("⚠ No se detectó contenido (imagen vacía o toda blanca/transparente).")
        return

    left, right = int(xs.min()), int(xs.max())
    top, bottom = int(ys.min()), int(ys.max())
    content_w = right - left
    content_h = bottom - top
    content_cx = (left + right) / 2
    content_cy = (top + bottom) / 2
    canvas_cx, canvas_cy = w / 2, h / 2
    offset_x = content_cx - canvas_cx
    offset_y = content_cy - canvas_cy
    radius_pct_w = (content_w / 2) / w * 100
    radius_pct_h = (content_h / 2) / h * 100
    aspect_diff_pct = abs(content_w - content_h) / max(content_w, content_h) * 100

    print(f"Bounding box del contenido: ({left},{top}) → ({right},{bottom})")
    print(f"Tamaño del contenido: {content_w} x {content_h} px")
    print(f"Centro del contenido: ({content_cx:.1f}, {content_cy:.1f})")
    print(f"Centro del lienzo:    ({canvas_cx:.1f}, {canvas_cy:.1f})")
    print(f"Desfase del centro:   X={offset_x:+.1f}px   Y={offset_y:+.1f}px")
    print(f"Radio aprox. (ancho): {radius_pct_w:.1f}% del lienzo")
    print(f"Radio aprox. (alto):  {radius_pct_h:.1f}% del lienzo")
    print(f"Diferencia ancho/alto (circularidad): {aspect_diff_pct:.1f}%")

    problemas = []
    if abs(offset_x) > w * center_tolerance_pct / 100:
        problemas.append(f"Centro desplazado en X ({offset_x:+.1f}px)")
    if abs(offset_y) > h * center_tolerance_pct / 100:
        problemas.append(f"Centro desplazado en Y ({offset_y:+.1f}px)")
    if aspect_diff_pct > circularity_tolerance_pct:
        problemas.append(f"No es un círculo perfecto — ancho y alto difieren {aspect_diff_pct:.1f}%")
    if "SIN transparencia" in modo:
        problemas.append("El PNG no tiene transparencia real — según la especificación debería tenerla")

    if problemas:
        print("\n⚠ Problemas encontrados:")
        for p in problemas:
            print(f"  - {p}")
    else:
        print("\n✅ Geometría OK (contorno exterior): centrado y circular dentro de tolerancia.")

    # --- Análisis radial: mide el radio REAL en cada dirección desde el centro.
    # Para un anillo (dona) detecta radio interior y exterior por separado,
    # que es lo que de verdad importa para calibrar el juego.
    radial_scan(mask, content_cx, content_cy, w, h)


def radial_scan(mask, cx, cy, w, h, n_rays=72):
    max_r = int(min(w, h) / 2) + 5
    inner_radii = []
    outer_radii = []
    ring_like = True
    for i in range(n_rays):
        theta = 2 * np.pi * i / n_rays
        dx, dy = np.cos(theta), np.sin(theta)
        transitions = []
        prev = False
        for r in range(0, max_r):
            x = int(round(cx + dx * r))
            y = int(round(cy + dy * r))
            if not (0 <= x < w and 0 <= y < h):
                break
            val = bool(mask[y, x])
            if val != prev:
                transitions.append(r)
                prev = val
        if len(transitions) >= 2:
            inner_radii.append(transitions[0])
            outer_radii.append(transitions[1])
        elif len(transitions) == 1:
            ring_like = False
            outer_radii.append(transitions[0])

    if not outer_radii:
        return

    diag = (w ** 2 + h ** 2) ** 0.5 / 2  # referencia para %, usa min(w,h)/2 mejor
    ref = min(w, h) / 2

    def pct(vals):
        return [v / ref * 100 for v in vals]

    print(f"\n--- Análisis radial ({n_rays} rayos desde el centro) ---")
    if ring_like and inner_radii:
        ip = pct(inner_radii)
        print(f"RADIO INTERIOR (agujero): promedio {np.mean(ip):.1f}%  "
              f"(min {min(ip):.1f}% / max {max(ip):.1f}% / variación {max(ip)-min(ip):.1f} puntos)")
    op = pct(outer_radii)
    print(f"RADIO EXTERIOR: promedio {np.mean(op):.1f}%  "
          f"(min {min(op):.1f}% / max {max(op):.1f}% / variación {max(op)-min(op):.1f} puntos)")
    if (max(op) - min(op)) > 3:
        print("⚠ El radio exterior varía más de 3 puntos entre direcciones — hay un bulto o deformación real, no es un círculo perfecto.")
    if ring_like and inner_radii and (max(ip) - min(ip)) > 3:
        print("⚠ El radio interior varía más de 3 puntos entre direcciones — el agujero no es perfectamente circular.")


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Uso: python check_asset_geometry.py imagen1.png [imagen2.png ...]")
        sys.exit(1)
    for path in sys.argv[1:]:
        analyze(path)
