# PLAN DE PROFESIONALIZACIÓN — THE GEM

**Propósito de este documento:** Este archivo es una guía de referencia para cualquier IA (Claude, Gemini, etc.) o desarrollador que retome este plan. Describe las mejoras necesarias para acercar THE GEM a un juego "nivel profesional", en qué consiste cada una, por qué importa, y qué archivos del proyecto se deben pedir antes de proponer cambios.

**Contexto del proyecto:** THE GEM es un juego 2D arcade hecho en JavaScript vanilla + HTML5 Canvas, sin frameworks, con Vite como bundler y compilado a APK vía Capacitor. Backend: Firebase (Firestore + Auth). El desarrollador (Juan Felipe / Felix) es un "ideas person", no programador profesional — cualquier IA que trabaje en esto debe explicar en lenguaje simple, sin jerga innecesaria, y pedir ver archivos relevantes antes de proponer cambios.

**Estado del proyecto:** En desarrollo activo, NO publicado aún en Google Play Store (por costo de cuenta de developer). Prioridad actual: mejorar experiencia de juego y sentar bases técnicas sanas, no monetización aún.

---

## ÍNDICE DE PRIORIDAD SUGERIDA

1. Onboarding / Tutorial
2. Feedback / "Juice" (sonidos, haptics, partículas)
3. Política de privacidad y términos de servicio
4. Guardado en la nube ligado a cuenta
5. Sistema de pagos (futuro, no urgente)
6. Backend anti-trampa para monedas/gemas (futuro, no urgente)
7. Analytics y crash reporting
8. Notificaciones push / eventos temporales
9. Economía balanceada (diseño, no código)

---

## 1. ONBOARDING / TUTORIAL

### Qué es y por qué importa
Es la experiencia guiada que recibe un jugador la primerísima vez que abre el juego. El objetivo es que en los primeros 30-60 segundos entienda qué hacer SIN leer bloques de texto. Los juegos profesionales pierden muchísimos jugadores nuevos en los primeros minutos si la curva de aprendizaje es confusa — a esto se le llama "frustración de onboarding" y es una de las principales causas de abandono temprano.

La mejor práctica es enseñar **jugando**, no explicando. Ejemplo: diseñar el primer nivel de forma que sea físicamente imposible avanzar sin aprender el control básico (ej. la esfera solo puede pasar el primer obstáculo si el jugador ya usó el giro).

### Opciones de implementación
- **Overlay guiado**: capa semi-transparente sobre el juego con flechas/círculos señalando botones importantes la primera vez, con un flag guardado (localStorage o Firebase) tipo `tutorial_completado: true` para que no se repita.
- **Nivel-tutorial forzado**: un primer nivel diseñado específicamente para enseñar mecánicas sin texto.
- **Tooltips contextuales**: mensajes cortos que aparecen solo la primera vez que el jugador entra a una pantalla nueva (tienda, ranks, etc.), no todos de una vez.

### Qué debe pedir la IA antes de proponer cambios
- `main.js` (loop de juego, cómo arranca una partida)
- `ui.js` (sistema de paneles/overlays existente, para reusar estilos)
- Archivo de configuración de niveles (`levels.config.js`) si se opta por nivel-tutorial
- Confirmar si ya existe algún flag de "primera vez" guardado en localStorage o Firebase
- `textgemconfig.js` (si el tutorial necesita textos, deben centralizarse ahí siguiendo el patrón ya establecido en el proyecto)

---

## 2. FEEDBACK / "JUICE" (sonidos, haptics, partículas)

### Qué es y por qué importa
"Juice" es el término de la industria para las capas de retroalimentación sensorial que hacen que las acciones del jugador se sientan satisfactorias: sonido al recoger una gema, vibración al chocar, partículas al ganar un nivel. No cambia la mecánica del juego, pero es lo que diferencia un juego que "funciona" de uno que "se siente bien". Es de las inversiones con mejor relación esfuerzo/impacto que existen.

### Opciones de implementación
- **Sonidos**: Web Audio API o simplemente instancias de `Audio` para efectos cortos (recoger moneda, chocar, subir de nivel). Requiere archivos de audio (mp3/ogg) cargados como assets.
- **Haptics en Android**: plugin oficial de Capacitor `@capacitor/haptics`. Una vez instalado, se dispara con un par de líneas en el evento correspondiente (choque, logro, compra). Solo funciona en el build de Android, no en navegador.
- **Partículas**: dado que el juego ya usa Canvas puro, se puede implementar un sistema simple de partículas (círculos/formas que nacen en un punto, tienen velocidad + gravedad + opacidad que decae con el tiempo, y se eliminan al desvanecerse). No requiere librerías externas.

### Qué debe pedir la IA antes de proponer cambios
- `main.js` (loop de renderizado, para saber dónde enganchar el sistema de partículas)
- `obstacles.js` (para saber en qué punto exacto se detecta colisión y disparar el efecto ahí)
- Confirmar si ya existe algún sistema de audio en el proyecto (buscar referencias a `Audio` o Web Audio API)
- Confirmar si Capacitor ya tiene plugins instalados (revisar `package.json` y `capacitor.config`)
- Assets de sonido disponibles (si no existen, hay que definir qué eventos necesitan sonido primero)

---

## 3. POLÍTICA DE PRIVACIDAD Y TÉRMINOS DE SERVICIO

### Qué es y por qué importa
Documentos legales que explican qué datos recoge el juego (ej. correo de Google al hacer login, progreso guardado) y cómo se usan. Aunque el juego no esté en Play Store todavía, es buena práctica tenerlos si ya se usa Firebase Auth con login de Google, porque se están manejando datos personales de usuarios reales (aunque sean pocos, como beta testers).

Importante: si en algún momento el juego lo llegan a jugar menores de edad, hay consideraciones adicionales (por ejemplo, no recolectar más datos de los necesarios, y ser claros sobre qué se guarda).

### Qué incluye normalmente
- Qué datos se recogen (correo, UID de Google, progreso de juego, no debería incluir nada más sensible)
- Para qué se usan (guardar progreso, nada de venta de datos a terceros salvo que se planee)
- Cómo el usuario puede pedir que se borren sus datos
- Contacto del desarrollador

### Qué debe pedir la IA antes de proponer cambios
- No requiere archivos de código. Requiere que el desarrollador confirme:
  - Qué datos exactos se guardan en Firestore (revisar la estructura de documentos de usuario)
  - Si se usa algún servicio de analytics o terceros además de Firebase
  - Dónde se va a alojar el documento (¿una página en el sitio web? ¿un link dentro del juego?)
- Este es el ítem más rápido de resolver de toda la lista — se puede redactar en una sola sesión.

---

## 4. GUARDADO EN LA NUBE LIGADO A CUENTA DE GOOGLE

### Qué es y por qué importa
Que el progreso del jugador (nivel alcanzado, monedas, skins desbloqueadas, rank) esté asociado a su cuenta de Google (vía Firebase Auth) y no solo al dispositivo. Así, si el usuario cambia de celular o reinstala el juego, puede iniciar sesión y recuperar todo tal cual lo dejó.

El proyecto ya tiene la mitad de esto resuelto porque ya usa Firebase Auth. Lo que falta es asegurar que **todo** el progreso relevante se sincronice a Firestore de forma consistente (no solo login, sino que cada cambio de estado importante se refleje en la nube).

### Consideración importante ya conocida
El login de Google en Android tuvo problemas de compatibilidad con el Credential Manager en el dispositivo de prueba (Oppo A38 / OPPO CPH2579 ColorOS), por lo que actualmente Google login está degradado a un estado "Solo en PC" en Android. Esto debe resolverse (o al menos tenerse en cuenta) antes de depender de este sistema en la versión Android.

### Qué debe pedir la IA antes de proponer cambios
- Archivo(s) donde se maneja Firebase Auth actualmente
- Estructura de datos actual en Firestore (qué se guarda por usuario, ejemplo de un documento)
- Dónde se guarda el progreso localmente hoy (localStorage, variables en memoria, etc.) para saber qué migrar
- Confirmar el estado actual del bug de login en Android antes de construir sobre esa base

---

## 5. SISTEMA DE PAGOS (futuro, no urgente)

### Qué es y por qué importa
Permitir que el jugador compre monedas o gemas pro con dinero real. NO es trivial: depende de la plataforma.

- **En Android (Google Play)**: cualquier compra de contenido digital dentro de la app DEBE pasar por Google Play Billing — no se puede usar Stripe/PayPal directo para eso, o Google puede rechazar o suspender la app. Requiere plugin de Capacitor (ej. `@capacitor-community/in-app-purchases`) y una cuenta de developer configurada con los productos.
- **En web**: libertad total — Stripe, PayPal, MercadoPago (recomendado para Colombia), etc.
- En ambos casos se necesita un **backend** que valide que el pago fue real antes de entregar el contenido (nunca confiar en el cliente para esto).

### Por qué NO es prioridad ahora
El desarrollador no piensa publicar en Play Store en primera instancia (por el costo de la cuenta de developer), y el juego sigue en desarrollo. Se recomienda dejar la UI de tienda lista visualmente (botones, precios) pero con los pagos reales desactivados o marcados "Próximamente" hasta que el juego esté más maduro.

### Qué debe pedir la IA antes de proponer cambios (cuando llegue el momento)
- `shop.js` (estructura actual de productos/paquetes VIP)
- Confirmar en qué plataforma se lanzará primero (web o Android) porque cambia completamente la implementación
- Confirmar si ya existe algún backend/Cloud Function en el proyecto

---

## 6. BACKEND ANTI-TRAMPA PARA MONEDAS/GEMAS (futuro, no urgente)

### Qué es y por qué importa
Actualmente (asumido, a confirmar) las monedas/gemas del jugador probablemente se calculan y modifican en el cliente (el propio juego en el navegador/APK). Esto es inseguro: cualquier usuario con las herramientas de desarrollador abiertas podría alterar directamente su cantidad de monedas antes de que se guarde.

La solución profesional es que **ninguna escritura de moneda ocurra directamente desde el cliente**. En vez de eso:
1. El cliente le informa al servidor qué pasó (ej. "completé el nivel X con resultado Y").
2. Una **Cloud Function de Firebase** (código que corre en servidor, no en el celular) valida que ese resultado tenga sentido.
3. Solo ahí se actualiza el balance de monedas en Firestore.
4. Las reglas de seguridad de Firestore (`firestore.rules`) deben bloquear que el campo de monedas se escriba directamente desde el cliente (solo lectura para el usuario, escritura solo desde el backend).

### Por qué NO es prioridad ahora
Sin usuarios reales todavía, el riesgo de que alguien haga trampa es prácticamente cero. Es una pieza de infraestructura importante pero pesada — se recomienda implementarla cuando el juego ya tenga usuarios activos o esté por lanzarse públicamente.

### Qué debe pedir la IA antes de proponer cambios (cuando llegue el momento)
- Archivo(s) donde actualmente se suman/restan monedas y gemas
- Estructura actual de Firestore para el documento de usuario
- Confirmar si el proyecto ya tiene Cloud Functions configuradas (carpeta `functions/` o similar)
- `firestore.rules` actual si existe

---

## 7. ANALYTICS Y CRASH REPORTING

### Qué es y por qué importa
- **Analytics**: saber cuántos usuarios juegan, en qué nivel se frustran o abandonan, cuánto tiempo juegan en promedio. Sin esto, cualquier decisión de diseño se toma "a ciegas".
- **Crash reporting**: cuando el juego falla en el dispositivo de un usuario real, el desarrollador normalmente nunca se entera. Un sistema de reporte de errores avisa automáticamente.

Como el proyecto ya usa Firebase, la opción más natural es **Firebase Analytics** y **Firebase Crashlytics**, que se integran relativamente fácil vía Capacitor con plugins oficiales.

### Qué debe pedir la IA antes de proponer cambios
- Configuración actual de Firebase en el proyecto (qué servicios de Firebase ya están inicializados)
- `capacitor.config` para saber qué plugins ya están instalados
- Confirmar qué eventos del juego serían más útiles de trackear primero (ej. nivel completado, muerte, compra) — esto es una decisión de diseño, no solo técnica

---

## 8. NOTIFICACIONES PUSH / EVENTOS TEMPORALES

### Qué es y por qué importa
Mecanismos para hacer que el jugador vuelva al juego después de haberlo cerrado: notificaciones ("evento especial esta semana") y contenido temporal que genera urgencia (solo disponible por tiempo limitado).

**Nota de contexto**: el juego no tiene sistema de energía, pero sí hay eventos mensuales planeados como parte del sistema de temporadas (seasons) que se está armando aparte del Ruby Pass. Este ítem debe coordinarse con el diseño de seasons cuando esté más definido, no se aborda de forma aislada.

### Qué debe pedir la IA antes de proponer cambios
- Documentación o plan del sistema de seasons/eventos mensuales (cuando exista)
- Confirmar si se usará Firebase Cloud Messaging para las notificaciones push
- Este ítem depende de que el sistema de seasons esté más avanzado antes de tener sentido implementarlo

---

## 9. ECONOMÍA BALANCEADA (diseño, no código)

### Qué es y por qué importa
Definir cuánto cuesta cada cosa en monedas/gemas versus qué tan fácil es conseguirlas jugando gratis. Un mal balance hace que el juego se sienta injusto (todo carísimo) o sin propósito (todo gratis fácilmente). Esto es principalmente un ejercicio de diseño/hoja de cálculo, no requiere tocar código todavía.

### Qué debe pedir la IA antes de proponer cambios
- Lista actual de precios en `shop.js` (SKINS_DATA, VIP_PACKAGES_DATA)
- Tasas actuales de generación de monedas por nivel/partida (si existen en `levels.config.js` o similar)
- Esto se puede trabajar incluso sin ver código, como ejercicio de números en una hoja aparte

---

## NOTA FINAL PARA LA IA QUE RETOME ESTE PLAN

- Siempre pedir ver los archivos relevantes indicados en cada sección ANTES de proponer código.
- Dar cambios quirúrgicos, no reescribir archivos enteros sin necesidad.
- Explicar en lenguaje simple — el desarrollador es "ideas person", no programador profesional.
- Priorizar rendimiento móvil (60fps en dispositivos mid-range, dispositivo de prueba: Oppo A38).
- Si se detectan bugs o inconsistencias en el camino, mencionarlos aunque no se hayan preguntado.
- Revisar si existe un `PLAN_REMODELACION_HUD_TIENDA.md` u otros documentos de handoff en el proyecto que puedan tener contexto relacionado antes de empezar.
