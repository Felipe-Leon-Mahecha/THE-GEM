# Brainstorm — Sistema de "Eventos" (estilo Free Fire)

> Documento de ideas, NO es un plan de implementación todavía.
> Objetivo inicial concreto: dar una vía para ganar `banner_leyendas_campeones`
> sin comprarlo, mediante misiones propias del evento (distintas a las
> misiones diarias normales). Pensado para poder crecer después a más
> recompensas por temporada, no solo este banner.

---

## 1. Qué lo diferencia de las misiones normales

- Las misiones diarias ya existen y dan Coins/Rubies/racha.
- Un "Evento" sería una campaña **con fecha de inicio/fin propia** (puede
  durar toda la temporada o ser más corto, ej. 2 semanas dentro de ella),
  con su propia lista de misiones y **una sola recompensa insignia** al
  completarlas todas (o un set de tiers, ver opción C).

## 2. Ideas de estructura (elegir una o fusionar)

### Opción A — Checklist simple
Lista fija de 5-8 misiones del evento (ej: "da 3 vueltas al circuito",
"completa 3 niveles", "gana 2 partidas seguidas"). Al completarlas TODAS,
se desbloquea el banner. Barra de progreso tipo "4/8 completadas".

- Pro: fácil de implementar, reutiliza el sistema de tracking de misiones
  que ya existe.
- Contra: si el jugador entra tarde a la temporada, puede sentirse
  injusto si las misiones no son acumulables desde el día 1.

### Opción B — Tiers progresivos (mini pase gratuito)
Como un Ruby Pass chiquito y gratis: cada misión completada da "puntos
de evento", y hay 3-5 tiers de puntos. El banner sale en el último tier,
los tiers intermedios dan Coins/Gems chicos como adelanto.

- Pro: se siente como progreso constante, no todo-o-nada.
- Contra: más piezas que construir (barra de tiers, lógica de puntos).

### Opción C — Rotación semanal
El evento cambia de misiones cada semana dentro de la temporada
(ej. semana 1: misiones de nivel, semana 2: misiones de racha, semana 3:
misiones sociales/skins). Cada semana completada suma hacia el banner.

- Pro: mantiene el evento "vivo" y da razones para volver seguido.
- Contra: requiere config por semana, más mantenimiento manual tuyo.

## 3. Dónde viviría en la UI

- Pestaña nueva "EVENTOS" dentro de la sección Temporadas (junto a
  Skins/Trails/Banners/Emotes del bento actual), o
- Un banner separado en el hero de temporada (similar al que ya
  existe para el countdown) que lleve a una pantalla propia.

## 4. Ejemplos de misiones de evento (para Opción A o C)

*(ejemplos, no definitivos — se afinan cuando se elija la estructura)*

- Da 3 vueltas completas al circuito en una sola partida
- Completa 3 niveles distintos sin perder
- Juega 5 partidas en la temporada actual
- Alcanza el nivel 10 del carril gratuito del Ruby Pass
- Usa 3 skins distintas en partidas separadas

## 5. Preguntas para resolver juntos antes de construir esto

1. ¿Opción A, B, o C — o alguna mezcla?
2. ¿El evento dura toda la temporada (8 meses en el caso de Leyendas)
   o un tramo corto dentro de ella (ej. solo 2-3 semanas, y después
   "cierra" aunque la temporada siga)?
3. ¿Un evento por temporada, o pueden coexistir varios eventos chicos
   al mismo tiempo (ej. uno de racha + uno de nivel)?
4. ¿Las misiones de evento se resetean si no las completas a tiempo,
   o quedan guardadas para siempre una vez que las cumples (como
   logros)?

---

*Cuando quieras retomar esto, empezamos eligiendo la estructura (punto 2)
y de ahí armamos las Partes de implementación igual que con Temporadas.*
