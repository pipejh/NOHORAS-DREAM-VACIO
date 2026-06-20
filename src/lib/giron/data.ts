import { createClient } from "@/lib/supabase/server";
import { calcularEstadoMes, periodoActual, type EstadoArriendo } from "./estado";

export type Profile = {
  id: string;
  username: string | null;
  nombre: string | null;
  telefono: string | null;
  email: string | null;
  rol: string;
};

/** Usuario autenticado + su perfil (o null si no hay sesión). */
export async function getSessionProfile(): Promise<{ userId: string; profile: Profile } | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: profile } = await supabase
    .from("profiles")
    .select("id, username, nombre, telefono, email, rol")
    .eq("id", user.id)
    .single();
  if (!profile) return null;
  return { userId: user.id, profile: profile as Profile };
}

export type LeaseFull = {
  id: string;
  unit_id: string | null;
  valor_mensual: number;
  dia_pago: number;
  fecha_inicio: string;
  fecha_fin: string | null;
  deposito: number;
  estado: string;
  notas: string | null;
  unit: { identificador: string } | null;
  arrendatario: Profile | null;
};

export type Payment = {
  id: string;
  periodo: string;
  monto: number;
  metodo: string | null;
  estado: string;
  pagado_at: string | null;
  comprobante_url: string | null;
  created_at: string;
};

/** Contrato activo del arrendatario logueado (RLS garantiza que sea el suyo). */
export async function getMiArriendo(userId: string): Promise<LeaseFull | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("giron_leases")
    .select(
      "id, unit_id, valor_mensual, dia_pago, fecha_inicio, fecha_fin, deposito, estado, notas, unit:giron_units(identificador), arrendatario:profiles(id, username, nombre, telefono, email, rol)",
    )
    .eq("arrendatario_id", userId)
    .eq("estado", "activo")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  return (data as unknown as LeaseFull | null) ?? null;
}

export async function getPagosDeLease(leaseId: string): Promise<Payment[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("giron_payments")
    .select("id, periodo, monto, metodo, estado, pagado_at, comprobante_url, created_at")
    .eq("lease_id", leaseId)
    .order("periodo", { ascending: false })
    .order("created_at", { ascending: false });
  return (data as Payment[]) ?? [];
}

// ─── Admin ──────────────────────────────────────────────────────

export type ArrendatarioRow = LeaseFull & { estadoMes: EstadoArriendo };

export type AdminResumen = {
  rows: ArrendatarioRow[];
  kpis: {
    recaudadoMes: number;
    porcentajeAlDia: number;
    ocupadas: number;
    totalUnidades: number;
  };
};

/** Datos del dashboard admin: contratos activos + KPIs del periodo actual. */
export async function getAdminResumen(): Promise<AdminResumen> {
  const supabase = await createClient();
  const periodo = periodoActual();

  const [{ data: leases }, { data: pagosMes }, { count: totalUnidades }] = await Promise.all([
    supabase
      .from("giron_leases")
      .select(
        "id, unit_id, valor_mensual, dia_pago, fecha_inicio, fecha_fin, deposito, estado, notas, unit:giron_units(identificador), arrendatario:profiles(id, username, nombre, telefono, email, rol)",
      )
      .eq("estado", "activo"),
    supabase
      .from("giron_payments")
      .select("lease_id, monto, periodo, estado")
      .eq("periodo", periodo)
      .eq("estado", "aprobado"),
    supabase.from("giron_units").select("id", { count: "exact", head: true }),
  ]);

  const leasesArr = (leases as unknown as LeaseFull[]) ?? [];
  const pagos = (pagosMes as { lease_id: string; monto: number }[]) ?? [];

  const rows: ArrendatarioRow[] = leasesArr.map((l) => {
    const pagosLease = pagos
      .filter((p) => p.lease_id === l.id)
      .map(() => ({ periodo, estado: "aprobado" }));
    const { estado } = calcularEstadoMes(
      { valor_mensual: l.valor_mensual, dia_pago: l.dia_pago },
      pagosLease,
    );
    return { ...l, estadoMes: estado };
  });

  const recaudadoMes = pagos.reduce((s, p) => s + p.monto, 0);
  const alDia = rows.filter((r) => r.estadoMes === "al_dia").length;
  const porcentajeAlDia = rows.length ? Math.round((alDia / rows.length) * 100) : 0;

  return {
    rows,
    kpis: {
      recaudadoMes,
      porcentajeAlDia,
      ocupadas: leasesArr.length,
      totalUnidades: totalUnidades ?? 0,
    },
  };
}

/** Detalle de un contrato para el admin (contrato + arrendatario + pagos). */
export async function getArrendatarioDetalle(
  leaseId: string,
): Promise<{ lease: LeaseFull; pagos: Payment[] } | null> {
  const supabase = await createClient();
  const { data: lease } = await supabase
    .from("giron_leases")
    .select(
      "id, unit_id, valor_mensual, dia_pago, fecha_inicio, fecha_fin, deposito, estado, notas, unit:giron_units(identificador), arrendatario:profiles(id, username, nombre, telefono, email, rol)",
    )
    .eq("id", leaseId)
    .maybeSingle();
  if (!lease) return null;
  const pagos = await getPagosDeLease(leaseId);
  return { lease: lease as unknown as LeaseFull, pagos };
}

/** Unidades disponibles (sin contrato activo) para el alta de arrendatarios. */
export async function getUnidadesDisponibles(): Promise<{ id: string; identificador: string }[]> {
  const supabase = await createClient();
  const { data: units } = await supabase
    .from("giron_units")
    .select("id, identificador")
    .order("identificador");
  const { data: leases } = await supabase
    .from("giron_leases")
    .select("unit_id")
    .eq("estado", "activo");
  const ocupadas = new Set((leases ?? []).map((l) => l.unit_id));
  return ((units as { id: string; identificador: string }[]) ?? []).filter(
    (u) => !ocupadas.has(u.id),
  );
}
