Catalogo central de banners de THE GEM
======================================

Archivo que usa el juego:
assets/Imagenes/Banners/banners.catalog.js

Ese archivo expone window.GEM_BANNERS_CATALOG antes de cargar shop.js.
La estructura es equivalente a JSON, pero esta guardada como .js para que el
juego pueda leerla directo desde index.html sin hacer fetch ni depender de un
servidor especial.

Carpetas principales:
- tienda_normal: banners permanentes de la tienda normal.
- tienda_vip: banners permanentes de la tienda VIP.
- banners_temporada: banners que salen en la tienda normal hasta expiresAt.
  Al expirar, la logica los trata como tienda_vip. Quien ya los compro los
  conserva porque la compra queda guardada por id en localStorage.
- banners_nuevos: banners recien agregados. Al llegar movesAt, pasan a
  finalCategory, que puede ser tienda_normal o tienda_vip.

Campos importantes por item:
- id: identificador estable. No lo cambies si jugadores ya lo compraron.
- name: nombre visible.
- autoIdFromName: si esta en true, el juego genera el id desde name.
  Ejemplo: name "Perro Caliente" genera id "perro_caliente".
  El id escrito queda como alias antiguo para no perder compras/equipado.
- file: nombre del archivo dentro de su carpeta.
- category: tienda_normal, tienda_vip, banners_temporada o banners_nuevos.
- finalCategory: solo para banners_nuevos; destino despues de 2 meses.
- price: precio.
- rarity: DEFAULT, BASICO, ESPECIAL, EPICA, DEMON o VIP.
- exclusive: true si debe venderse por la tienda VIP.
- startsAt/expiresAt: fechas para temporada, formato YYYY-MM-DD.
- addedAt/movesAt: fechas para nuevos, formato YYYY-MM-DD.
- animated: true para GIFs o animados.

Ejemplo de item normal:
{ id: 'mi_banner', name: 'Mi Banner', file: 'mi_banner.png', category: 'tienda_normal', price: 180, rarity: 'BASICO', exclusive: false }

Ejemplo de item nuevo que luego pasa a VIP:
{ id: 'mi_banner_nuevo', name: 'Mi Banner Nuevo', file: 'mi_banner_nuevo.png', category: 'banners_nuevos', finalCategory: 'tienda_vip', price: 430, rarity: 'VIP', exclusive: true, addedAt: '2026-07-08', movesAt: '2026-09-08' }

Regla practica:
Cuando agregues un banner nuevo, copia la imagen a la carpeta adecuada y agrega
su entrada en banners.catalog.js. Si reemplazas un placeholder por arte final,
mantener el mismo id conserva compras/equipamiento de jugadores.

Para banners nuevos/editables:
Puedes cambiar solo name y dejar autoIdFromName: true. Asi no queda algo raro
como id "perro_caliente" con nombre "Ferrari": el id activo se recalcula desde
el nombre visible. No uses autoIdFromName en banners antiguos si ya hay jugadores
que pudieron comprarlos, salvo que quieras que el id cambie; el id anterior se
mantiene como alias, pero lo mas estable para items viejos es no tocarlo.
