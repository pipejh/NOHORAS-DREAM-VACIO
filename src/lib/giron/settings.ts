import { createClient } from "@/lib/supabase/server";

export type PagoInfo = {
  titular: string | null;
  banco: string | null;
  tipo_cuenta: string | null;
  numero_cuenta: string | null;
  nequi: string | null;
  llave_breb: string | null;
  instrucciones: string | null;
};

/** Datos de cobro (a dónde transferir). Fila única id=1. */
export async function getPagoInfo(): Promise<PagoInfo | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("giron_settings")
    .select("titular, banco, tipo_cuenta, numero_cuenta, nequi, llave_breb, instrucciones")
    .eq("id", 1)
    .maybeSingle();
  return (data as PagoInfo | null) ?? null;
}

/** ¿Hay al menos un dato de cobro configurado? */
export function tienePagoInfo(info: PagoInfo | null): boolean {
  if (!info) return false;
  return Boolean(info.llave_breb || info.nequi || info.numero_cuenta);
}
