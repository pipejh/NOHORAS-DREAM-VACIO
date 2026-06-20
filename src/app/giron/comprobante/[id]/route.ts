import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * GET /giron/comprobante/[id]
 * Devuelve (redirige a) una URL firmada temporal del comprobante de un pago.
 * El acceso se valida con RLS: el SELECT solo retorna el pago si pertenece al
 * arrendatario logueado o si es admin/owner. Luego se firma con service_role.
 */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: pago } = await supabase
    .from("giron_payments")
    .select("id, comprobante_url")
    .eq("id", id)
    .maybeSingle();

  if (!pago?.comprobante_url) {
    return new NextResponse("No encontrado", { status: 404 });
  }

  const admin = createAdminClient();
  const { data: signed, error } = await admin.storage
    .from("comprobantes")
    .createSignedUrl(pago.comprobante_url, 60);

  if (error || !signed) {
    return new NextResponse("No disponible", { status: 404 });
  }
  return NextResponse.redirect(signed.signedUrl);
}
