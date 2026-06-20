/**
 * bootstrap-owner.mjs — Crea (o promueve) la cuenta OWNER de Felipe.
 * Login por usuario (sin email real): usuario `felipe` + contraseña generada.
 *
 * Uso:  node --env-file=.env.local scripts/bootstrap-owner.mjs
 * Requiere NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY en .env.local.
 */
import { createClient } from "@supabase/supabase-js";
import { randomBytes } from "node:crypto";

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!URL || !KEY) {
  console.error("Falta NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en .env.local");
  process.exit(1);
}

const USERNAME = "felipe";
const EMAIL_SINT = `${USERNAME}@giron.nohorasdream.co`;
const EMAIL_REAL = "pipeh0202@gmail.com";
const password = randomBytes(9).toString("base64url"); // contraseña fuerte

const admin = createClient(URL, KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// ¿Ya existe?
const { data: list } = await admin.auth.admin.listUsers({ perPage: 1000 });
let user = list?.users?.find((u) => u.email === EMAIL_SINT);

if (!user) {
  const { data, error } = await admin.auth.admin.createUser({
    email: EMAIL_SINT,
    password,
    email_confirm: true,
    user_metadata: { username: USERNAME, nombre: "Felipe" },
  });
  if (error) {
    console.error("Error creando owner:", error.message);
    process.exit(1);
  }
  user = data.user;
  console.log("✓ Cuenta owner creada.");
  console.log(`\n  Usuario:    ${USERNAME}`);
  console.log(`  Contraseña: ${password}\n`);
  console.log("  (Guárdala. Es la contraseña de tu cuenta de administrador.)");
} else {
  console.log("• La cuenta owner ya existía; me aseguro del perfil/rol.");
}

const { error: profErr } = await admin.from("profiles").upsert(
  {
    id: user.id,
    username: USERNAME,
    nombre: "Felipe",
    email: EMAIL_REAL,
    rol: "owner",
  },
  { onConflict: "id" },
);
if (profErr) {
  console.error("Error en perfil owner:", profErr.message);
  process.exit(1);
}
console.log("✓ Perfil owner listo (rol = owner).");
