# Nohoras Dream Platform — Instrucciones del proyecto

Eres el desarrollador de la **plataforma web multi-propiedad de Nohoras Dream**. Felipe es el dueño del negocio y product owner.

## Qué estás construyendo

Una plataforma web con tres secciones, una por propiedad. Lee `README.md` y `docs/00-vision-general.md` antes de escribir código. La documentación en `/docs` es la fuente de verdad.

## Principios

1. **Empieza por Santa Marta.** Es la sección más simple (vitrina + calendario) y la propiedad ya está en operación. Genera valor rápido.
2. **Girón es la parte compleja** (auth por rol, pagos Wompi, notificaciones). Constrúyela por fases según `docs/09-roadmap.md`.
3. **No reinventes la integración de Airbnb.** Hay un límite real: Airbnb no da API de precios; solo iCal de disponibilidad. La lógica probada está documentada en `docs/06`. Reúsala.
4. **Seguridad primero en Girón.** Datos financieros y de arrendatarios. Usa Row Level Security de Supabase (ver `docs/05`). Un arrendatario nunca debe ver datos de otro.
5. **Mobile-first.** La mayoría de arrendatarios y huéspedes entran desde el celular.
6. **Bilingüe en Santa Marta** (es/en) — la audiencia turística incluye extranjeros. Girón y Cúcuta solo en español.
7. **Respeta el sistema de diseño** de `docs/08`. El prototipo en `/prototipo` define el look & feel objetivo.

## Stack (no cambiar sin justificación)

Next.js (App Router) + TypeScript + Tailwind + Supabase + Wompi + Vercel. Ver `docs/04`.

## Convenciones

- Español para UI de Girón/Cúcuta y comentarios de código. Santa Marta es bilingüe.
- Moneda: COP, formato `$1.250.000` (separador de miles con punto, es-CO).
- Zona horaria: `America/Bogota`.
- Fechas en BD: ISO `YYYY-MM-DD`.

## Antes de dar algo por terminado

- Verifica que el flujo funciona de punta a punta (no solo que compila).
- En pagos: nunca confíes en el frontend; confirma el estado vía webhook de Wompi (ver `docs/07`).
- En calendario: maneja el caso de que el iCal de Airbnb falle o no responda (no rompas la página).
