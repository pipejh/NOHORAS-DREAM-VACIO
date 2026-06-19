# 04 — Arquitectura técnica

## Stack

| Capa | Tecnología | Por qué |
|---|---|---|
| Framework | **Next.js (App Router) + TypeScript** | SSR/SSG para SEO de Santa Marta, server actions para Girón, mismo stack que Felipe ya domina (curso-dit, barberia.lat) |
| UI | **Tailwind CSS** + componentes propios | Sistema de diseño en `08-diseno-ux.md` |
| Auth + DB | **Supabase** (Postgres + Auth + RLS + Storage) | Roles, seguridad por fila, almacenamiento de comprobantes |
| Pagos | **Wompi** (PSE, tarjetas, Nequi) | Pasarela colombiana, soporta los métodos locales |
| Notificaciones | **WhatsApp** (Meta Cloud API) + **Resend** (email) | Recordatorios y confirmaciones de Girón |
| Calendario | **iCal** (node-ical / parser propio) | Única vía oficial para disponibilidad de Airbnb |
| Deploy | **Vercel** | Integración nativa con Next.js + Vercel Cron para recordatorios |
| PDFs | **@react-pdf/renderer** o similar | Comprobantes de pago de Girón |

## Estructura de carpetas (Next.js App Router)

```
src/
├── app/
│   ├── page.tsx                    # Home: portafolio de las 3 propiedades
│   ├── layout.tsx                  # Layout raíz + providers
│   │
│   ├── santa-marta/
│   │   ├── page.tsx                # Vitrina del loft
│   │   └── galeria/page.tsx
│   │
│   ├── giron/
│   │   ├── page.tsx                # Landing pública del edificio
│   │   ├── login/page.tsx
│   │   ├── portal/                 # Rol arrendatario (protegido)
│   │   │   ├── page.tsx            # Mi arriendo / estado del mes
│   │   │   ├── pagar/page.tsx
│   │   │   └── historial/page.tsx
│   │   └── admin/                  # Rol admin (protegido)
│   │       ├── page.tsx            # Dashboard
│   │       ├── arrendatarios/
│   │       └── reportes/
│   │
│   ├── cucuta/page.tsx             # Próximamente + form de leads
│   │
│   └── api/
│       ├── airbnb/availability/route.ts   # GET disponibilidad (iCal)
│       ├── wompi/webhook/route.ts          # POST webhook de pagos
│       └── cron/recordatorios/route.ts     # Vercel Cron (notificaciones)
│
├── components/
│   ├── ui/                         # Botones, cards, inputs (design system)
│   ├── santa-marta/                # Galería, calendario, cotizador
│   └── giron/                      # Tablas de pagos, estado, gráficos
│
├── lib/
│   ├── supabase/                   # Cliente server/browser + helpers
│   ├── airbnb/ical.ts              # Parser de iCal + cruce de disponibilidad
│   ├── precios.ts                  # Tabla de temporadas + cotizador (port del bot)
│   ├── wompi/                      # SDK/cliente Wompi + firma de webhooks
│   └── notificaciones/             # WhatsApp + email
│
└── middleware.ts                   # Protección de rutas /giron/portal y /giron/admin por rol
```

## Variables de entorno (`.env.local`)

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Airbnb (Santa Marta)
AIRBNB_ICAL_SANTA_MARTA=https://www.airbnb.com/calendar/ical/1483618072090950324...
AIRBNB_LISTING_URL=https://airbnb.com/rooms/1483618072090950324

# Wompi (Girón)
WOMPI_PUBLIC_KEY=
WOMPI_PRIVATE_KEY=
WOMPI_EVENTS_SECRET=          # para validar firma de webhooks
WOMPI_INTEGRITY_SECRET=

# Notificaciones
WHATSAPP_TOKEN=               # Meta Cloud API
WHATSAPP_PHONE_ID=
RESEND_API_KEY=

# WhatsApp directo (Santa Marta CTA)
WHATSAPP_NUMERO_SANTA_MARTA=57...
```

## Protección de rutas

`middleware.ts` valida sesión y rol:
- `/giron/portal/*` → requiere rol `arrendatario` (o `owner`).
- `/giron/admin/*` → requiere rol `admin` (o `owner`).
- Resto del sitio: público.

La autorización a nivel de datos la garantiza **RLS en Supabase** (no solo el middleware). Ver `05-data-model.md`.

## Renderizado por sección

- **Home + Santa Marta + Cúcuta:** estático/ISR (SEO, velocidad). El calendario de Santa Marta se hidrata con un fetch a `/api/airbnb/availability` (cacheado ~1h).
- **Girón portal/admin:** dinámico, server components con datos de Supabase por sesión.

## Cron de recordatorios

Vercel Cron llama a `/api/cron/recordatorios` (p. ej. diario 8am Bogotá). Esa ruta:
1. Busca arriendos con día de pago próximo o vencido.
2. Dispara WhatsApp/email según la tabla de notificaciones (`02-propiedad-giron.md`).
3. Registra el envío para no duplicar.
