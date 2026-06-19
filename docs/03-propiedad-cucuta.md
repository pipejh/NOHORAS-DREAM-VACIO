# 03 — Nohoras Dream Cúcuta (coliving — proyecto lejano)

## Estado

**Proyecto futuro y lejano.** Es un **coliving**, pero todavía se está **pagando el lote** — no hay construcción ni fecha. Es la propiedad más distante del portafolio.

> ⚠️ **Importante para la arquitectura:** es probable que **entren otros proyectos antes que Cúcuta**. La plataforma NO debe tratar a Cúcuta como "la tercera y última propiedad", sino como un slot más dentro de un **portafolio extensible** (ver abajo). Agregar una propiedad nueva debe ser trivial.

## Concepto (lo poco que se sabe)

- **Tipo:** coliving (vivienda compartida con espacios comunes, orientada a comunidad/estadías medias-largas).
- **Ciudad:** Cúcuta.
- **Etapa:** compra del lote en curso. Sin diseño, sin precios, sin fecha.

## Objetivo de la sección web (fase actual)

Mínimo esfuerzo: una **landing de "próximamente"** con captación de interesados, para construir una base de contactos de cara al lanzamiento (aún lejano).

## Estructura de la página `/cucuta`

1. **Hero "Próximamente"** — identidad Nohoras Dream + concepto coliving + ciudad. Sin prometer fechas ni detalles que no existen.
2. **Teaser del concepto** — qué es un coliving Nohoras Dream (comunidad, diseño, experiencia). Aspiracional, sin comprometer specs.
3. **Formulario de interés** — nombre + email/WhatsApp → tabla `leads_cucuta` (Supabase).
4. **CTA** — "Déjanos tus datos y serás el primero en saber".

## El portafolio es extensible (regla de arquitectura)

La home y el modelo de datos deben soportar **N propiedades**, no exactamente tres. Para sumar una propiedad nueva (antes o después de Cúcuta):

- Agregar una fila en la tabla `properties` (`docs/05`).
- Crear su sección/ruta (`/[propiedad]`) reutilizando los patrones existentes:
  - ¿es alquiler turístico tipo Santa Marta? → reusar vitrina + calendario + doble reserva.
  - ¿es arriendo/gestión tipo Girón? → reusar portal + admin + pagos.
  - ¿es futuro tipo Cúcuta? → reusar landing "próximamente" + leads.
- La home renderiza las cards desde `properties` (no hardcodear las tres).

> Diséñalo como **plantillas por tipo de propiedad** (`turistico` | `arriendo` | `futuro`), no como tres páginas a medida. Así, cuando llegue el "cuarto" o "quinto" proyecto, es agregar datos, no construir un sitio.

## Datos pendientes de Felipe (cuando avance)
- Concepto final del coliving (modelo de negocio, público).
- Render/ubicación/fecha — cuando existan.
