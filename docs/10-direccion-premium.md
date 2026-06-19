# 10 — Dirección premium (estándar "estudio de alto costo")

> Objetivo de Felipe: que la plataforma **no se sienta hecha por IA**, sino por un estudio profesional de alto estándar. Animaciones y diseño con acabado de marca de lujo. Esta es la vara para Santa Marta (la vitrina) y para toda la home.

Referencias estudiadas: Aman (journeys frictionless y emotivos), Belmond ("slow luxury" 2026 — ritmo pausado), Six Senses (sensorial), Mr & Mrs Smith y Plum Guide (editorial, curaduría, fotografía protagonista). Técnica de los sitios premiados (Awwwards): GSAP + ScrollTrigger + Lenis, tipografía como elemento animable, cursores magnéticos, parallax y stagger reveals a 60fps.

## Principios (los códigos del lujo digital)

1. **Slow luxury / ritmo pausado.** Transiciones largas y suaves (600–1200ms, easing tipo `cubic-bezier(.16,1,.3,1)`). Nada brusco. El lujo respira.
2. **Fotografía protagonista.** Imágenes full-bleed, cinematográficas. El texto sirve a la imagen, no compite.
3. **Aire y silencio.** Whitespace generoso, márgenes amplios, pocas cosas por pantalla. La densidad mata el lujo.
4. **Editorial, no plantilla.** Layouts asimétricos tipo revista (imagen+texto a destiempo, citas full-bleed, captions). **Evitar grids de tarjetas idénticas** — es el "tell" #1 de IA.
5. **Tipografía con carácter.** Serif display grande y aireada (Cormorant), versalitas espaciadas para eyebrows, jerarquía dramática.
6. **Detalle de oficio.** Hairlines de 1px, rejilla de espaciado consistente (8px), captions en small-caps, acentos dorados mínimos y precisos.

## Sistema de movimiento

Implementar con **Lenis (smooth scroll) + GSAP + ScrollTrigger** (CDN). Respetar `prefers-reduced-motion` y desactivar efectos pesados en touch.

| Efecto | Dónde | Detalle |
|---|---|---|
| **Smooth scroll** | Todo el sitio | Lenis con inercia suave. Base de todo lo demás. |
| **Clip-path reveal** | Imágenes hero y de sección | La foto se "destapa" (`clip-path` inset 0 → full) al entrar al viewport, 900ms. |
| **Parallax** | Hero y bloques con foto | Fondo se mueve ~15–25% más lento que el contenido. Sutil, sin mareo. |
| **Ken Burns** | Hero principal | Zoom lentísimo (scale 1→1.08 en 12–20s) continuo. |
| **Stagger reveal** | Texto y elementos de sección | Líneas/ítems aparecen con fade+translateY escalonado (60–100ms entre cada uno) al entrar. |
| **Text reveal por línea** | Titulares clave | Líneas suben desde una máscara (overflow hidden). |
| **Counter** | Métricas (ej. "37 reseñas", "5,0★") | Conteo animado al entrar. |
| **Hover zoom contenido** | Galería | `overflow:hidden` + `scale(1.06)` suave en la imagen interna. |
| **Magnetic cursor** | Desktop, sobre CTAs/links | Cursor custom (punto/anillo) que se agranda y es atraído por elementos interactivos. Desactivar en touch. |
| **Underline draw / arrow nudge** | Links y botones | Subrayado que se dibuja de izq→der; flechas que se desplazan en hover. |
| **Nav transition** | Barra superior | Transparente sobre el hero → fondo sólido al hacer scroll, con transición suave. |
| **Section/view transition** | Cambio de vista (SPA mockup) | Fundido/cortina suave entre vistas en vez de corte seco. |

## Detalles visuales que gritan "caro"

- **Grano/textura sutil** sobre secciones oscuras (overlay de ruido a ~3–5% opacidad).
- **Degradado de la ola** (marino→azul→cielo) usado con sutileza como hilo de marca, no como relleno.
- **Captions de foto** en versalitas pequeñas con tracking ("EL RODADERO · AMANECER").
- **Botones:** sin sombras pesadas; relleno que se desliza o borde fino dorado; estados con transición de 300ms.
- **Bordes redondeados moderados** (no pills exageradas). Esquinas de 2–8px máximo en cards grandes.
- **Cero emojis como íconos.** Usar íconos de línea finos o ninguno.

## Anti-patrones (lo que delata a la IA — prohibido)

- Grids de 3 tarjetas idénticas centradas para todo.
- Gradientes morados/teal genéricos de fondo.
- Todo centrado y perfectamente simétrico.
- Sombras `box-shadow` grandes y difusas por todos lados.
- Emojis decorativos. Bordes súper redondeados (border-radius enorme).
- Animaciones bruscas o de rebote (bounce) — el lujo no rebota.

## Rendimiento y accesibilidad

- 60fps: animar solo `transform` y `opacity` (no `width/top/left`).
- `prefers-reduced-motion: reduce` → desactivar parallax/cursor/reveals, dejar el contenido visible y estático.
- Touch/móvil: sin cursor custom, parallax reducido, foco en reveals ligeros.
- **Degradación:** si el JS/CDN falla, el contenido debe verse completo y legible (los reveals parten de estado visible, no oculto permanente).

## Aplicación inmediata (prototipo)

Elevar Home y Santa Marta a este estándar como muestra del look & feel. Girón mantiene la calidez pero con sobriedad funcional (menos espectáculo, misma calidad de detalle). En producción (Next.js), trasladar este sistema con GSAP/Lenis + componentes reutilizables.
