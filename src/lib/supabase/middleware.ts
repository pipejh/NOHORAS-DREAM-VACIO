import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Refresca la sesión de Supabase en cada request (patrón @supabase/ssr) y
 * aplica protección de rutas de Girón por rol:
 *  - /giron/portal/*  → arrendatario | admin | owner
 *  - /giron/admin/*   → admin | owner
 * La autorización a nivel de datos la garantiza RLS, no solo esto.
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(
          cookiesToSet: { name: string; value: string; options?: CookieOptions }[],
        ) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;
  const isPortal = path.startsWith("/giron/portal");
  const isAdmin = path.startsWith("/giron/admin");

  if (isPortal || isAdmin) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = "/giron/login";
      url.searchParams.set("next", path);
      return NextResponse.redirect(url);
    }

    // Verificar rol contra el perfil.
    const { data: profile } = await supabase
      .from("profiles")
      .select("rol")
      .eq("id", user.id)
      .single();
    const rol = profile?.rol ?? "arrendatario";

    if (isAdmin && !["admin", "owner"].includes(rol)) {
      const url = request.nextUrl.clone();
      url.pathname = "/giron/portal";
      return NextResponse.redirect(url);
    }
  }

  return response;
}
