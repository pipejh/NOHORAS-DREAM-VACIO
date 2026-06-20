import Link from "next/link";
import { signOut } from "@/app/giron/login/actions";
import type { Profile } from "@/lib/giron/data";

type Tab = { href: string; label: string };

const TABS: Record<"portal" | "admin", Tab[]> = {
  portal: [
    { href: "/giron/portal", label: "Mi arriendo" },
    { href: "/giron/portal/historial", label: "Historial" },
  ],
  admin: [
    { href: "/giron/admin", label: "Dashboard" },
    { href: "/giron/admin/arrendatarios", label: "Arrendatarios" },
    { href: "/giron/admin/configuracion", label: "Configuración" },
  ],
};

export function GironBar({
  variant,
  active,
  profile,
}: {
  variant: "portal" | "admin";
  active: string;
  profile: Profile;
}) {
  return (
    <div className="giron-tabs">
      <div className="wrap">
        <span className="gt-label">Girón · {variant === "admin" ? "Admin" : "Portal"}</span>
        {TABS[variant].map((t) => (
          <Link key={t.href} href={t.href} className={t.href === active ? "on" : undefined}>
            {t.label}
          </Link>
        ))}
        <div className="gt-right">
          <span className="gt-user">{profile.nombre ?? profile.username}</span>
          <form action={signOut}>
            <button type="submit" className="gt-logout">
              Cerrar sesión
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
