import { createClient } from "@supabase/supabase-js";

/**
 * Cliente de Supabase con la llave service_role. BYPASSA RLS — usar SOLO en
 * código de servidor confiable (server actions / route handlers), nunca en el
 * cliente. Se usa para crear cuentas de arrendatario (admin API) y operaciones
 * privilegiadas. La service_role nunca debe exponerse al navegador.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    throw new Error(
      "Falta SUPABASE_SERVICE_ROLE_KEY o NEXT_PUBLIC_SUPABASE_URL para el cliente admin.",
    );
  }
  return createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
