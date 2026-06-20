/**
 * verify-pagos.mjs — Prueba el flujo de pago por transferencia (Fase 3).
 * Usa datos efímeros y limpia todo al final.
 * Uso: node --env-file=.env.local scripts/verify-pagos.mjs
 */
import { createClient } from "@supabase/supabase-js";

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const SR = process.env.SUPABASE_SERVICE_ROLE_KEY;
const admin = createClient(URL, SR, { auth: { persistSession: false } });

const periodo = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Bogota", year: "numeric", month: "2-digit" })
  .format(new Date()).slice(0, 7);

let pass = true;
const log = (k, v) => { console.log(`  ${v ? "✓" : "✗"} ${k}`); if (!v) pass = false; };

const email = `pagotest_${Date.now()}@giron.nohorasdream.co`;
let userId, leaseId, paymentId, path;

try {
  // 1) settings legibles por arrendatario
  await admin.from("giron_settings").update({ llave_breb: "@nohoras-test", titular: "Felipe Test" }).eq("id", 1);

  // 2) tenant + lease
  const { data: u } = await admin.auth.admin.createUser({ email, password: "Test123456", email_confirm: true });
  userId = u.user.id;
  await admin.from("profiles").insert({ id: userId, username: email.split("@")[0], rol: "arrendatario" });
  const { data: lease } = await admin.from("giron_leases")
    .insert({ arrendatario_id: userId, valor_mensual: 1000000, dia_pago: 5, fecha_inicio: "2026-01-01", estado: "activo" })
    .select("id").single();
  leaseId = lease.id;

  // 3) subir comprobante al bucket privado
  path = `${leaseId}/${periodo}-test.pdf`;
  const { error: upErr } = await admin.storage.from("comprobantes")
    .upload(path, new Uint8Array([37, 80, 68, 70]), { contentType: "application/pdf", upsert: true });
  log("subir comprobante a Storage", !upErr);

  // 4) crear pago pendiente
  const { data: pay } = await admin.from("giron_payments")
    .insert({ lease_id: leaseId, periodo, monto: 1000000, metodo: "transferencia", estado: "pendiente", comprobante_url: path })
    .select("id").single();
  paymentId = pay.id;

  // 5) URL firmada
  const { data: signed } = await admin.storage.from("comprobantes").createSignedUrl(path, 60);
  log("generar URL firmada del comprobante", Boolean(signed?.signedUrl));

  // 6) como arrendatario (anon): ve settings y su pago pendiente
  const asT = createClient(URL, ANON, { auth: { persistSession: false } });
  await asT.auth.signInWithPassword({ email, password: "Test123456" });
  const { data: setT } = await asT.from("giron_settings").select("llave_breb").eq("id", 1).maybeSingle();
  log("arrendatario ve datos de cobro (settings)", setT?.llave_breb === "@nohoras-test");
  const { data: payT } = await asT.from("giron_payments").select("id, estado").eq("id", paymentId).maybeSingle();
  log("arrendatario ve su pago pendiente", payT?.estado === "pendiente");

  // 7) aprobar (admin) → al día
  await admin.from("giron_payments").update({ estado: "aprobado", pagado_at: new Date().toISOString() }).eq("id", paymentId);
  const { data: payA } = await admin.from("giron_payments").select("estado").eq("id", paymentId).single();
  log("admin aprueba el pago", payA.estado === "aprobado");
} catch (e) {
  console.error("Error:", e.message); pass = false;
} finally {
  if (path) await admin.storage.from("comprobantes").remove([path]);
  if (leaseId) await admin.from("giron_payments").delete().eq("lease_id", leaseId);
  if (leaseId) await admin.from("giron_leases").delete().eq("id", leaseId);
  if (userId) await admin.auth.admin.deleteUser(userId);
  await admin.from("giron_settings").update({ llave_breb: null, titular: null }).eq("id", 1);
  console.log(pass ? "\n✅ Flujo de pago por transferencia OK." : "\n❌ Falló algo en el flujo.");
  process.exit(pass ? 0 : 1);
}
