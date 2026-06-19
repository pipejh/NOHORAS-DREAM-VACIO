# Nohoras Dream — Plataforma Multi-Propiedad

Plataforma web central de **Nohoras Dream** para gestionar todas sus propiedades inmobiliarias y turísticas bajo una sola marca.

> **Este repositorio es el punto de partida para desarrollar la plataforma en Claude Code.**
> Toda la documentación necesaria está en `/docs`. El prototipo visual del look & feel está en `/prototipo`. Empieza leyendo este README y luego `docs/00-vision-general.md`.

---

## Las 3 propiedades

| Propiedad | Tipo | Sección de la plataforma | Estado |
|---|---|---|---|
| **Nohoras Dream Santa Marta** | Loft turístico premium (El Rodadero) | Vitrina de alquiler + calendario en vivo Airbnb | En operación |
| **Nohoras Dream Girón** | Edificio de apartamentos (arriendo) | Plataforma admin de pagos + portal de arrendatarios | Por construir |
| **Nohoras Dream Cúcuta** | Coliving (lote en pago) | Landing "próximamente" | Futuro lejano |
| *(propiedades nuevas)* | *cualquiera* | *plantilla por tipo de propiedad* | *el portafolio es extensible* |

---

## Qué hace la plataforma

### 1. Santa Marta — Vitrina de alquiler turístico
- Galería de fotos y videos del loft para promocionar el alquiler.
- **Calendario en vivo** que muestra disponibilidad real sincronizada con Airbnb (vía iCal).
- Precios por temporada (desde nuestra propia tabla — ver nota técnica sobre Airbnb).
- CTA para **reservar directamente en Airbnb** (deep-link al listing) + opción WhatsApp.

### 2. Girón — Plataforma de gestión de arriendos
- **Panel del administrador:** ver arrendatarios, estado de pagos, mora, histórico, ocupación del edificio.
- **Portal del arrendatario:** ver su contrato, fechas de pago, pagar en línea (Wompi/PSE), historial de comprobantes.
- **Notificaciones automáticas** de cobro, confirmación de pago y mora.

### 3. Cúcuta — Próximamente
- Página de captación de interesados (proyecto futuro).

---

## Stack técnico

- **Framework:** Next.js (App Router) + TypeScript
- **Base de datos + Auth:** Supabase (Postgres + Auth + RLS + Storage)
- **Pagos:** Wompi (PSE, tarjetas, Nequi) para los arriendos de Girón
- **Calendario Airbnb:** sincronización iCal (sin API oficial — ver `docs/06`)
- **Notificaciones:** WhatsApp (Meta Cloud API) + email (Resend)
- **Deploy:** Vercel
- **Estilos:** Tailwind CSS (sistema de diseño en `docs/08`)

Detalle completo en [`docs/04-arquitectura-tecnica.md`](docs/04-arquitectura-tecnica.md).

---

## Estructura del repositorio

```
NOHORAS DREAM PLATFORM/
├── README.md                       ← estás aquí
├── CLAUDE.md                       ← instrucciones para el agente que construye
├── docs/
│   ├── 00-vision-general.md        ← brief del proyecto + las 3 propiedades
│   ├── 01-propiedad-santa-marta.md ← loft: marketing, fotos, calendario Airbnb
│   ├── 02-propiedad-giron.md       ← admin + portal arrendatarios + pagos
│   ├── 03-propiedad-cucuta.md      ← futuro (placeholder)
│   ├── 04-arquitectura-tecnica.md  ← stack, estructura Next.js, deploy
│   ├── 05-data-model.md            ← schema Supabase (SQL listo)
│   ├── 06-integracion-airbnb.md    ← iCal, límites de precios, deep-link
│   ├── 07-integracion-pagos-wompi.md ← flujo Wompi/PSE, webhooks, conciliación
│   ├── 08-diseno-ux.md             ← sistema de diseño + flujos UX
│   └── 09-roadmap.md               ← fases de desarrollo
├── prototipo/                      ← mockup HTML clicable del look & feel
└── assets/                         ← referencias (fotos del loft, etc.)
```

---

## Cómo empezar a desarrollar (orden sugerido)

1. Lee `docs/00` y `docs/04` para entender el panorama y la arquitectura.
2. Abre el prototipo (`prototipo/index.html`) en el navegador para ver el look & feel objetivo.
3. Inicializa el proyecto Next.js + Supabase + Tailwind (ver `docs/04`).
4. Aplica el schema de `docs/05` en Supabase.
5. Construye por fases según `docs/09-roadmap.md` (empezar por Santa Marta — la más simple y ya en operación).

---

## Datos clave heredados del sistema actual

Estos datos ya existen en el bot de WhatsApp de Nohoras Dream (proyecto ASISTENTE LABORAL) y deben reutilizarse:

- **Listing Airbnb Santa Marta:** `1483618072090950324` → `airbnb.com/rooms/1483618072090950324`
- **Tabla de precios por temporada:** ver `docs/01` (base $200.000 COP/noche)
- **Lógica de sincronización iCal:** ver `docs/06` (ya probada en producción)
- **Fotos del loft:** `ASISTENTE LABORAL/bot/data/nohoras-photos/`
- **Instagram:** @nohorasdream
