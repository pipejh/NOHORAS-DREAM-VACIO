-- ─────────────────────────────────────────────────────────────
-- 0003_seed.sql — Datos iniciales
-- ─────────────────────────────────────────────────────────────

-- Las 3 propiedades
insert into properties (id, nombre, ciudad, tipo) values
  ('santa-marta', 'Nohoras Dream Santa Marta', 'Santa Marta', 'turistico'),
  ('giron',       'Nohoras Dream Girón',       'Girón',       'arriendo'),
  ('cucuta',      'Nohoras Dream Cúcuta',      'Cúcuta',      'futuro')
on conflict (id) do nothing;

-- Los 4 apartamentos de Girón
insert into giron_units (identificador, descripcion) values
  ('101', 'Apartamento 101'),
  ('201', 'Apartamento 201'),
  ('301', 'Apartamento 301'),
  ('401', 'Apartamento 401')
on conflict (identificador) do nothing;
