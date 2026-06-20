-- ─────────────────────────────────────────────────────────────
-- 0002_rls.sql — Row Level Security (crítico para Girón)
-- Un arrendatario solo puede leer SUS datos. Admin/owner ven todo.
-- ─────────────────────────────────────────────────────────────

-- Helper: rol del usuario actual. SECURITY DEFINER para que pueda leer
-- `profiles` sin quedar atrapado por las propias políticas RLS (evita recursión).
create or replace function current_rol() returns text
language sql
stable
security definer
set search_path = public
as $$
  select rol from profiles where id = auth.uid()
$$;

-- Habilitar RLS en todas las tablas con datos sensibles
alter table profiles            enable row level security;
alter table giron_units         enable row level security;
alter table giron_leases        enable row level security;
alter table giron_payments      enable row level security;
alter table giron_notifications enable row level security;
alter table leads_cucuta        enable row level security;
alter table properties          enable row level security;

-- ─── properties: lectura pública, escritura solo admin/owner ────
drop policy if exists "properties_select" on properties;
create policy "properties_select" on properties for select using (true);

-- ─── profiles ───────────────────────────────────────────────────
-- Cada quien ve su propio perfil; admin/owner ven todos.
drop policy if exists "profiles_select" on profiles;
create policy "profiles_select" on profiles for select
using (id = auth.uid() or current_rol() in ('admin','owner'));

-- Cada quien actualiza su propio perfil; admin/owner cualquiera.
drop policy if exists "profiles_update" on profiles;
create policy "profiles_update" on profiles for update
using (id = auth.uid() or current_rol() in ('admin','owner'))
with check (id = auth.uid() or current_rol() in ('admin','owner'));
-- (La creación de perfiles la hace el server con service_role, que bypassa RLS.)

-- ─── giron_units ────────────────────────────────────────────────
-- Lectura para cualquier usuario autenticado; escritura admin/owner.
drop policy if exists "units_select" on giron_units;
create policy "units_select" on giron_units for select
using (auth.uid() is not null);

drop policy if exists "units_write" on giron_units;
create policy "units_write" on giron_units for all
using (current_rol() in ('admin','owner'))
with check (current_rol() in ('admin','owner'));

-- ─── giron_leases ───────────────────────────────────────────────
-- Arrendatario ve SOLO sus contratos; admin/owner ven todo.
drop policy if exists "leases_select" on giron_leases;
create policy "leases_select" on giron_leases for select
using (arrendatario_id = auth.uid() or current_rol() in ('admin','owner'));

-- Solo admin/owner crean/editan contratos.
drop policy if exists "leases_write" on giron_leases;
create policy "leases_write" on giron_leases for all
using (current_rol() in ('admin','owner'))
with check (current_rol() in ('admin','owner'));

-- ─── giron_payments ─────────────────────────────────────────────
-- Arrendatario ve SOLO sus pagos; admin/owner ven todo.
drop policy if exists "payments_select" on giron_payments;
create policy "payments_select" on giron_payments for select
using (
  current_rol() in ('admin','owner')
  or lease_id in (select id from giron_leases where arrendatario_id = auth.uid())
);

-- Solo admin/owner registran pagos manuales (el webhook de Wompi usa service_role).
drop policy if exists "payments_write_admin" on giron_payments;
create policy "payments_write_admin" on giron_payments for insert
with check (current_rol() in ('admin','owner'));

drop policy if exists "payments_update_admin" on giron_payments;
create policy "payments_update_admin" on giron_payments for update
using (current_rol() in ('admin','owner'))
with check (current_rol() in ('admin','owner'));

-- ─── giron_notifications ────────────────────────────────────────
drop policy if exists "notifs_select" on giron_notifications;
create policy "notifs_select" on giron_notifications for select
using (
  current_rol() in ('admin','owner')
  or lease_id in (select id from giron_leases where arrendatario_id = auth.uid())
);

-- ─── leads_cucuta ───────────────────────────────────────────────
-- Inserción pública (formulario de interés); lectura solo admin/owner.
drop policy if exists "leads_insert" on leads_cucuta;
create policy "leads_insert" on leads_cucuta for insert with check (true);

drop policy if exists "leads_select" on leads_cucuta;
create policy "leads_select" on leads_cucuta for select
using (current_rol() in ('admin','owner'));
