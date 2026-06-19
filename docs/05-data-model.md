# 05 — Modelo de datos (Supabase / Postgres)

Schema inicial. Ajustar al construir, pero esta es la base. Moneda en COP como `integer` (sin decimales). Fechas como `date`, timestamps como `timestamptz`.

## Diagrama lógico

```
properties (las 3 propiedades)
profiles (usuarios: admin / arrendatario / owner)  ─┐
                                                     │
giron_units (apartamentos del edificio)              │
        │                                            │
        └─ giron_leases (contratos) ── arrendatario ─┘
                  │
                  ├─ giron_payments (pagos / transacciones)
                  └─ giron_notifications (envíos)

leads_cucuta (captación)
```

## SQL base

```sql
-- ─── Propiedades ────────────────────────────────────────────────
create table properties (
  id          text primary key,            -- 'santa-marta' | 'giron' | 'cucuta'
  nombre      text not null,
  ciudad      text not null,
  tipo        text not null,               -- 'turistico' | 'arriendo' | 'futuro'
  activo      boolean default true
);

-- ─── Perfiles de usuario (extiende auth.users) ──────────────────
create table profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  nombre      text,
  telefono    text,
  email       text,
  rol         text not null default 'arrendatario',  -- 'owner' | 'admin' | 'arrendatario'
  created_at  timestamptz default now()
);

-- ─── Girón: apartamentos ────────────────────────────────────────
create table giron_units (
  id          uuid primary key default gen_random_uuid(),
  identificador text not null,             -- 'Apto 101'
  descripcion text,
  estado      text default 'disponible'    -- 'disponible' | 'ocupado'
);

-- ─── Girón: contratos de arriendo ───────────────────────────────
create table giron_leases (
  id              uuid primary key default gen_random_uuid(),
  unit_id         uuid references giron_units(id),
  arrendatario_id uuid references profiles(id),
  valor_mensual   integer not null,        -- COP
  dia_pago        smallint not null check (dia_pago between 1 and 28),
  fecha_inicio    date not null,
  fecha_fin       date,
  deposito        integer default 0,
  estado          text default 'activo',   -- 'activo' | 'finalizado'
  notas           text,
  created_at      timestamptz default now()
);

-- ─── Girón: pagos / transacciones ───────────────────────────────
create table giron_payments (
  id              uuid primary key default gen_random_uuid(),
  lease_id        uuid references giron_leases(id),
  periodo         text not null,           -- '2026-06' (mes que cubre)
  monto           integer not null,        -- COP
  metodo          text,                    -- 'pse' | 'tarjeta' | 'nequi' | 'efectivo' | 'transferencia'
  estado          text not null default 'pendiente', -- 'pendiente' | 'aprobado' | 'rechazado' | 'anulado'
  wompi_tx_id     text,                    -- id de transacción Wompi (si aplica)
  comprobante_url text,                    -- Storage (PDF)
  pagado_at       timestamptz,
  registrado_por  uuid references profiles(id),  -- admin si fue manual
  created_at      timestamptz default now()
);

-- ─── Girón: notificaciones enviadas ─────────────────────────────
create table giron_notifications (
  id          uuid primary key default gen_random_uuid(),
  lease_id    uuid references giron_leases(id),
  tipo        text not null,               -- 'recordatorio' | 'mora' | 'confirmacion'
  canal       text not null,               -- 'whatsapp' | 'email'
  periodo     text,
  enviado_at  timestamptz default now()
);

-- ─── Cúcuta: leads ──────────────────────────────────────────────
create table leads_cucuta (
  id          uuid primary key default gen_random_uuid(),
  nombre      text,
  contacto    text not null,               -- email o whatsapp
  mensaje     text,
  created_at  timestamptz default now()
);
```

## Row Level Security (RLS)

**Crítico para Girón.** Habilitar RLS en todas las tablas de Girón.

```sql
alter table giron_leases enable row level security;
alter table giron_payments enable row level security;
alter table giron_notifications enable row level security;

-- Helper: rol del usuario actual
create or replace function current_rol() returns text
language sql stable as $$
  select rol from profiles where id = auth.uid()
$$;

-- Arrendatario ve SOLO sus contratos; admin/owner ven todo
create policy "leases_select" on giron_leases for select
using (
  arrendatario_id = auth.uid()
  or current_rol() in ('admin','owner')
);

-- Arrendatario ve SOLO sus pagos; admin/owner ven todo
create policy "payments_select" on giron_payments for select
using (
  current_rol() in ('admin','owner')
  or lease_id in (select id from giron_leases where arrendatario_id = auth.uid())
);

-- Solo admin/owner crean/editan contratos y registran pagos manuales
create policy "leases_write" on giron_leases for all
using (current_rol() in ('admin','owner'))
with check (current_rol() in ('admin','owner'));

create policy "payments_write_admin" on giron_payments for insert
with check (current_rol() in ('admin','owner'));
```

> Los pagos creados por el flujo Wompi (webhook) usan la `service_role` key, que **bypassa RLS** — está bien porque el webhook es server-side y confiable. La regla anterior cubre la escritura manual desde el admin.

## Notas

- `periodo` en formato `'YYYY-MM'` permite saber qué mes cubre cada pago y detectar meses sin pagar (mora).
- El estado "al día / en mora" de un arrendatario se **calcula** (no se almacena): para el `periodo` actual, ¿existe un `giron_payments` con `estado='aprobado'`? Una vista SQL o función puede resolverlo.
- Storage: bucket `comprobantes` con política de acceso por `lease_id`/usuario.
