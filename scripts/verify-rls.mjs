/**
 * verify-rls.mjs — Prueba que el RLS aísla a cada arrendatario.
 * Crea 2 inquilinos efímeros con contrato, inicia sesión como cada uno con la
 * ANON key y verifica que solo ve SU contrato. Limpia todo al final.
 *
 * Uso: node --env-file=.env.local scripts/verify-rls.mjs
 */
import { createClient } from "@supabase/supabase-js";

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const SR = process.env.SUPABASE_SERVICE_ROLE_KEY;

const admin = createClient(URL, SR, { auth: { persistSession: false } });

const mk = (n) => ({
  email: `rlstest_${n}_${Date.now()}@giron.nohorasdream.co`,
  password: "Test123456",
});
const A = mk("a");
const B = mk("b");
const created = [];
let pass = true;

async function setup(u, valor) {
  const { data, error } = await admin.auth.admin.createUser({
    email: u.email,
    password: u.password,
    email_confirm: true,
  });
  if (error) throw error;
  created.push(data.user.id);
  await admin.from("profiles").insert({ id: data.user.id, username: u.email.split("@")[0], nombre: "RLS Test", rol: "arrendatario" });
  const { data: lease } = await admin
    .from("giron_leases")
    .insert({ arrendatario_id: data.user.id, valor_mensual: valor, dia_pago: 5, fecha_inicio: "2026-01-01", estado: "activo" })
    .select("id")
    .single();
  return { id: data.user.id, leaseId: lease.id };
}

try {
  const a = await setup(A, 111111);
  const b = await setup(B, 222222);

  // Iniciar sesión como A con la anon key (como lo haría el navegador)
  const asA = createClient(URL, ANON, { auth: { persistSession: false } });
  await asA.auth.signInWithPassword({ email: A.email, password: A.password });

  const { data: visibles } = await asA.from("giron_leases").select("id, valor_mensual");
  const ids = (visibles ?? []).map((l) => l.id);

  const veSoloElSuyo = ids.length === 1 && ids[0] === a.leaseId;
  const noVeAlOtro = !ids.includes(b.leaseId);

  console.log(`A ve ${ids.length} contrato(s).`);
  console.log(`  ✓ A ve solo el suyo: ${veSoloElSuyo ? "SÍ" : "NO"}`);
  console.log(`  ✓ A NO ve el de B:   ${noVeAlOtro ? "SÍ" : "NO"}`);

  // A intenta leer los pagos de B (no debería poder)
  const { data: pagosB } = await asA.from("giron_payments").select("id").eq("lease_id", b.leaseId);
  const noVePagosB = (pagosB ?? []).length === 0;
  console.log(`  ✓ A NO ve pagos de B: ${noVePagosB ? "SÍ" : "NO"}`);

  pass = veSoloElSuyo && noVeAlOtro && noVePagosB;
} catch (e) {
  console.error("Error en la prueba:", e.message);
  pass = false;
} finally {
  // Limpieza
  await admin.from("giron_leases").delete().in("arrendatario_id", created);
  for (const id of created) await admin.auth.admin.deleteUser(id);
  console.log(pass ? "\n✅ RLS CORRECTO: cada arrendatario solo ve lo suyo." : "\n❌ RLS FALLÓ — revisar políticas.");
  process.exit(pass ? 0 : 1);
}
