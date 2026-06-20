-- ─────────────────────────────────────────────────────────────
-- 0004_pagos_transferencia.sql — Cobro por transferencia + comprobante
-- (sin pasarela / sin comisión). Datos de cobro editables por el admin y
-- bucket privado para los comprobantes.
-- ─────────────────────────────────────────────────────────────

-- Datos de cobro de Girón (fila única editable por el admin)
create table if not exists giron_settings (
  id            smallint primary key default 1 check (id = 1),
  titular       text,
  banco         text,
  tipo_cuenta   text,            -- 'ahorros' | 'corriente'
  numero_cuenta text,
  nequi         text,
  llave_breb    text,
  instrucciones text,
  updated_at    timestamptz default now()
);

insert into giron_settings (id) values (1) on conflict (id) do nothing;

alter table giron_settings enable row level security;

-- Cualquier usuario autenticado puede leer a dónde pagar; solo admin/owner edita.
drop policy if exists "settings_select" on giron_settings;
create policy "settings_select" on giron_settings for select
using (auth.uid() is not null);

drop policy if exists "settings_write" on giron_settings;
create policy "settings_write" on giron_settings for all
using (current_rol() in ('admin','owner'))
with check (current_rol() in ('admin','owner'));

-- Nota: el arrendatario NO inserta pagos directamente (podría marcarlos
-- aprobados). El reporte de transferencia se crea vía server action con
-- service_role, forzando estado='pendiente' tras verificar el contrato.

-- Bucket privado para comprobantes (se lee siempre vía URL firmada del server).
insert into storage.buckets (id, name, public)
values ('comprobantes', 'comprobantes', false)
on conflict (id) do nothing;
