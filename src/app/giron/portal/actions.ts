"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { periodoActual } from "@/lib/giron/estado";

export type ReporteState = { error?: string; ok?: string };

const MAX_BYTES = 6 * 1024 * 1024; // 6 MB
const TIPOS_OK = ["image/jpeg", "image/png", "image/webp", "application/pdf"];

/**
 * El arrendatario reporta una transferencia subiendo el comprobante.
 * Crea (o reemplaza) un pago en estado 'pendiente'. La aprobación la hace el
 * admin. Se ejecuta con service_role pero SOLO sobre el lease del propio usuario
 * y forzando estado='pendiente' (el arrendatario nunca se marca aprobado).
 */
export async function reportarTransferencia(
  _prev: ReporteState,
  formData: FormData,
): Promise<ReporteState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Tu sesión expiró. Vuelve a entrar." };

  // Contrato activo del usuario (RLS garantiza que sea suyo).
  const { data: lease } = await supabase
    .from("giron_leases")
    .select("id, valor_mensual")
    .eq("arrendatario_id", user.id)
    .eq("estado", "activo")
    .maybeSingle();
  if (!lease) return { error: "No tienes un contrato activo." };

  const periodo = String(formData.get("periodo") ?? periodoActual());
  if (!/^\d{4}-\d{2}$/.test(periodo)) return { error: "Periodo inválido." };

  const file = formData.get("comprobante");
  if (!(file instanceof File) || file.size === 0) {
    return { error: "Adjunta el comprobante de la transferencia." };
  }
  if (file.size > MAX_BYTES) return { error: "El archivo supera 6 MB." };
  if (!TIPOS_OK.includes(file.type)) {
    return { error: "Sube una imagen (JPG/PNG) o un PDF." };
  }

  const admin = createAdminClient();

  // Evitar duplicar si el periodo ya está aprobado.
  const { data: existentes } = await admin
    .from("giron_payments")
    .select("id, estado")
    .eq("lease_id", lease.id)
    .eq("periodo", periodo);
  if ((existentes ?? []).some((p) => p.estado === "aprobado")) {
    return { error: `El arriendo de ${periodo} ya está pagado.` };
  }

  // Subir el comprobante al bucket privado.
  const ext = file.type === "application/pdf" ? "pdf" : file.type.split("/")[1] ?? "jpg";
  const path = `${lease.id}/${periodo}-${Date.now()}.${ext}`;
  const bytes = new Uint8Array(await file.arrayBuffer());
  const { error: upErr } = await admin.storage
    .from("comprobantes")
    .upload(path, bytes, { contentType: file.type, upsert: true });
  if (upErr) return { error: `No se pudo subir el comprobante: ${upErr.message}` };

  // Crear/actualizar el pago pendiente (estado forzado).
  const pendiente = (existentes ?? []).find((p) => p.estado === "pendiente");
  if (pendiente) {
    await admin
      .from("giron_payments")
      .update({ comprobante_url: path, metodo: "transferencia", created_at: new Date().toISOString() })
      .eq("id", pendiente.id);
  } else {
    await admin.from("giron_payments").insert({
      lease_id: lease.id,
      periodo,
      monto: lease.valor_mensual,
      metodo: "transferencia",
      estado: "pendiente",
      comprobante_url: path,
    });
  }

  revalidatePath("/giron/portal");
  revalidatePath("/giron/portal/historial");
  revalidatePath("/giron/admin");
  return { ok: "¡Listo! Reportamos tu pago. Lo confirmamos muy pronto." };
}
