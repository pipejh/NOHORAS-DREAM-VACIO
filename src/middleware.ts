import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  // Corre en las rutas de Girón (donde hay sesión/roles). Excluye estáticos.
  matcher: ["/giron/:path*"],
};
