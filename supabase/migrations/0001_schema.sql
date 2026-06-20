-- ─────────────────────────────────────────────────────────────
-- 0001_schema.sql — Esquema base de la plataforma Nohoras Dream
-- Ver docs/05-data-model.md. Moneda COP como integer (sin decimales).
-- ─────────────────────────────────────────────────────────────

-- ─── Propiedades (las 3) ────────────────────────────────────────
create table if not exists properties (
  id          text primary key,             -- 'santa-marta' | 'giron' | 'cucuta'
  nombre      text not null,
  ciudad      text not null,
  tipo        text not null,                -- 'turistico' | 'arriendo' | 'futuro'
  activo      boolean default true
);

-- ─── Perfiles de usuario (extiende auth.users) ──────────────────
-- username: para login por usuario (sin email real). El email de auth es
-- sintético interno (<username>@giron.nohorasdream.co), nunca se le muestra
-- ni se le pide al arrendatario. Toda comunicación va por WhatsApp.
create table if not exists profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  username    text unique,
  nombre      text,
  telefono    text,                         -- WhatsApp
  email       text,                         -- opcional (owner/admin), informativo
  rol         text not null default 'arrendatario',  -- 'owner' | 'admin' | 'arrendatario'
  created_at  timestamptz default now()
);

-- ─── Girón: apartamentos ────────────────────────────────────────
create table if not exists giron_units (
  id            uuid primary key default gen_random_uuid(),
  identificador text not null unique,        -- '101' | '201' | '301' | '401'
  descripcion   text,
  estado        text default 'disponible'    -- 'disponible' | 'ocupado'
);

-- ─── Girón: contratos de arriendo ───────────────────────────────
create table if not exists giron_leases (
  id              uuid primary key default gen_random_uuid(),
  unit_id         uuid references giron_units(id),
  arrendatario_id uuid references profiles(id),
  valor_mensual   integer not null,         -- COP
  dia_pago        smallint not null check (dia_pago between 1 and 28),
  fecha_inicio    date not null,
  fecha_fin       date,
  deposito        integer default 0,
  estado          text default 'activo',    -- 'activo' | 'finalizado'
  notas           text,
  created_at      timestamptz default now()
);

-- ─── Girón: pagos / transacciones ───────────────────────────────
create table if not exists giron_payments (
  id              uuid primary key default gen_random_uuid(),
  lease_id        uuid references giron_leases(id),
  periodo         text not null,            -- 'YYYY-MM' (mes que cubre)
  monto           integer not null,         -- COP
  metodo          text,                     -- 'pse' | 'tarjeta' | 'nequi' | 'efectivo' | 'transferencia'
  estado          text not null default 'pendiente', -- 'pendiente' | 'aprobado' | 'rechazado' | 'anulado'
  wompi_tx_id     text,
  comprobante_url text,
  pagado_at       timestamptz,
  registrado_por  uuid references profiles(id),  -- admin si fue manual
  created_at      timestamptz default now()
);

-- ─── Girón: notificaciones enviadas ─────────────────────────────
create table if not exists giron_notifications (
  id          uuid primary key default gen_random_uuid(),
  lease_id    uuid references giron_leases(id),
  tipo        text not null,                -- 'recordatorio' | 'mora' | 'confirmacion'
  canal       text not null,                -- 'whatsapp' | 'email'
  periodo     text,
  enviado_at  timestamptz default now()
);

-- ─── Cúcuta: leads ──────────────────────────────────────────────
create table if not exists leads_cucuta (
  id          uuid primary key default gen_random_uuid(),
  nombre      text,
  contacto    text not null,                -- email o whatsapp
  mensaje     text,
  created_at  timestamptz default now()
);

create index if not exists idx_leases_arrendatario on giron_leases(arrendatario_id);
create index if not exists idx_payments_lease on giron_payments(lease_id);
create index if not exists idx_payments_periodo on giron_payments(periodo);
