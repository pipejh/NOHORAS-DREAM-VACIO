"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getSessionProfile } from "@/lib/giron/data";
import { usernameToEmail, esAdmin } from "@/lib/giron/constants";

async function requireAdmin() {
  const session = await getSessionProfile();
  if (!session || !esAdmin(session.profile.rol)) {
    throw new Error("No autorizado");
  }
  return session;
}

export type ActionState = { error?: string; ok?: string };

/** Alta de arrendatario: crea la cuenta (usuario/contraseña), perfil y contrato. */
export async function crearArrendatario(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  const nombre = String(formData.get("nombre") ?? "").trim();
  const username = String(formData.get("username") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const telefono = String(formData.get("telefono") ?? "").trim();
  const unitId = String(formData.get("unit_id") ?? "");
  const valor = Number(formData.get("valor_mensual"));
  const diaPago = Number(formData.get("dia_pago"));
  const fechaInicio = String(formData.get("fecha_inicio") ?? "");
  const deposito = Number(formData.get("deposito") ?? 0) || 0;

  if (!nombre || !username || !password || !unitId || !valor || !diaPago || !fechaInicio) {
    return { error: "Completa todos los campos obligatorios." };
  }
  if (!/^[a-z0-9._-]{3,}$/.test(username)) {
    return { error: "El usuario debe tener 3+ caracteres (letras, números, . _ -)." };
  }
  if (password.length < 6) {
    return { error: "La contraseña debe tener al menos 6 caracteres." };
  }
  if (diaPago < 1 || diaPago > 28) {
    return { error: "El día de pago debe estar entre 1 y 28." };
  }

  const admin = createAdminClient();

  // 1) Crear la cuenta de auth (email sintético, confirmada).
  const { data: created, error: authErr } = await admin.auth.admin.createUser({
    email: usernameToEmail(username),
    password,
    email_confirm: true,
    user_metadata: { username, nombre },
  });
  if (authErr || !created.user) {
    return {
      error: authErr?.message.includes("already")
        ? "Ese usuario ya existe."
        : `No se pudo crear la cuenta: ${authErr?.message ?? "error"}`,
    };
  }
  const newId = created.user.id;

  // 2) Perfil
  const { error: profErr } = await admin.from("profiles").insert({
    id: newId,
    username,
    nombre,
    telefono,
    rol: "arrendatario",
  });
  if (profErr) {
    await admin.auth.admin.deleteUser(newId); // rollback
    return { error: `No se pudo crear el perfil: ${profErr.message}` };
  }

  // 3) Contrato + marcar unidad ocupada
  const { error: leaseErr } = await admin.from("giron_leases").insert({
    unit_id: unitId,
    arrendatario_id: newId,
    valor_mensual: valor,
    dia_pago: diaPago,
    fecha_inicio: fechaInicio,
    deposito,
    estado: "activo",
  });
  if (leaseErr) {
    await admin.auth.admin.deleteUser(newId);
    return { error: `No se pudo crear el contrato: ${leaseErr.message}` };
  }
  await admin.from("giron_units").update({ estado: "ocupado" }).eq("id", unitId);

  revalidatePath("/giron/admin");
  revalidatePath("/giron/admin/arrendatarios");
  redirect("/giron/admin/arrendatarios");
}

/** Registrar un pago manual (efectivo/transferencia) — conciliación. */
export async function registrarPago(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const session = await requireAdmin();

  const leaseId = String(formData.get("lease_id") ?? "");
  const periodo = String(formData.get("periodo") ?? "");
  const monto = Number(formData.get("monto"));
  const metodo = String(formData.get("metodo") ?? "efectivo");
  const fecha = String(formData.get("pagado_at") ?? "");

  if (!leaseId || !periodo || !monto) {
    return { error: "Completa periodo y monto." };
  }
  if (!/^\d{4}-\d{2}$/.test(periodo)) {
    return { error: "El periodo debe tener formato AAAA-MM (ej. 2026-06)." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("giron_payments").insert({
    lease_id: leaseId,
    periodo,
    monto,
    metodo,
    estado: "aprobado",
    pagado_at: fecha ? new Date(`${fecha}T12:00:00`).toISOString() : new Date().toISOString(),
    registrado_por: session.userId,
  });
  if (error) {
    return { error: `No se pudo registrar el pago: ${error.message}` };
  }

  revalidatePath(`/giron/admin/arrendatarios/${leaseId}`);
  revalidatePath("/giron/admin");
  return { ok: "Pago registrado." };
}

/** Guardar los datos de cobro (a dónde transfieren los arrendatarios). */
export async function guardarPagoInfo(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase
    .from("giron_settings")
    .update({
      titular: String(formData.get("titular") ?? "").trim() || null,
      banco: String(formData.get("banco") ?? "").trim() || null,
      tipo_cuenta: String(formData.get("tipo_cuenta") ?? "").trim() || null,
      numero_cuenta: String(formData.get("numero_cuenta") ?? "").trim() || null,
      nequi: String(formData.get("nequi") ?? "").trim() || null,
      llave_breb: String(formData.get("llave_breb") ?? "").trim() || null,
      instrucciones: String(formData.get("instrucciones") ?? "").trim() || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", 1);
  if (error) return { error: `No se pudo guardar: ${error.message}` };
  revalidatePath("/giron/admin/configuracion");
  revalidatePath("/giron/portal");
  return { ok: "Datos de cobro guardados." };
}

/** Aprobar un pago reportado (transferencia) → queda al día. */
export async function aprobarPago(formData: FormData): Promise<void> {
  const session = await requireAdmin();
  const paymentId = String(formData.get("payment_id") ?? "");
  const leaseId = String(formData.get("lease_id") ?? "");
  if (!paymentId) return;
  const supabase = await createClient();
  await supabase
    .from("giron_payments")
    .update({
      estado: "aprobado",
      pagado_at: new Date().toISOString(),
      registrado_por: session.userId,
    })
    .eq("id", paymentId);
  revalidatePath(`/giron/admin/arrendatarios/${leaseId}`);
  revalidatePath("/giron/admin");
}

/** Rechazar un pago reportado. */
export async function rechazarPago(formData: FormData): Promise<void> {
  await requireAdmin();
  const paymentId = String(formData.get("payment_id") ?? "");
  const leaseId = String(formData.get("lease_id") ?? "");
  if (!paymentId) return;
  const supabase = await createClient();
  await supabase.from("giron_payments").update({ estado: "rechazado" }).eq("id", paymentId);
  revalidatePath(`/giron/admin/arrendatarios/${leaseId}`);
  revalidatePath("/giron/admin");
}

/** Finalizar un contrato y liberar la unidad. */
export async function finalizarContrato(formData: FormData): Promise<void> {
  await requireAdmin();
  const leaseId = String(formData.get("lease_id") ?? "");
  const unitId = String(formData.get("unit_id") ?? "");
  if (!leaseId) return;

  const supabase = await createClient();
  await supabase
    .from("giron_leases")
    .update({ estado: "finalizado", fecha_fin: new Date().toISOString().slice(0, 10) })
    .eq("id", leaseId);
  if (unitId) {
    await supabase.from("giron_units").update({ estado: "disponible" }).eq("id", unitId);
  }
  revalidatePath("/giron/admin");
  revalidatePath("/giron/admin/arrendatarios");
}
