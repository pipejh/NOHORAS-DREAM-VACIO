import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSessionProfile } from "@/lib/giron/data";
import { getPagoInfo } from "@/lib/giron/settings";
import { esAdmin } from "@/lib/giron/constants";
import { GironBar } from "@/components/giron/GironBar";
import { ConfigCobroForm } from "@/components/giron/ConfigCobroForm";

export const metadata: Metadata = {
  title: "Configuración — Girón Admin",
  robots: { index: false },
};

export default async function ConfiguracionPage() {
  const session = await getSessionProfile();
  if (!session) redirect("/giron/login");
  if (!esAdmin(session.profile.rol)) redirect("/giron/portal");

  const info = await getPagoInfo();

  return (
    <>
      <GironBar variant="admin" active="/giron/admin/configuracion" profile={session.profile} />
      <section className="block g-section">
        <div className="wrap">
          <span className="eyebrow">Configuración</span>
          <h1 className="g-h1">Datos de cobro</h1>
          <div className="g-card" style={{ maxWidth: 760 }}>
            <ConfigCobroForm info={info} />
          </div>
        </div>
      </section>
    </>
  );
}
