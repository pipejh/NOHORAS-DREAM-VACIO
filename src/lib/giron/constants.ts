/**
 * Constantes y helpers de Girón.
 *
 * Login por USUARIO (sin email real): el arrendatario recibe un usuario y una
 * contraseña que genera el administrador. Por dentro, Supabase Auth necesita un
 * email, así que usamos uno sintético <username>@giron.nohorasdream.co que el
 * usuario nunca ve. Toda comunicación con el arrendatario va por WhatsApp.
 */
export const GIRON_EMAIL_DOMAIN = "giron.nohorasdream.co";

export function usernameToEmail(username: string): string {
  return `${username.trim().toLowerCase()}@${GIRON_EMAIL_DOMAIN}`;
}

export type Rol = "owner" | "admin" | "arrendatario";

export function esAdmin(rol: string | null | undefined): boolean {
  return rol === "admin" || rol === "owner";
}
