import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getAdminResumen, getSessionProfile, getUnidadesDisponibles } from "@/lib/giron/data";
import { esAdmin } from "@/lib/giron/constants";
import { GironBar } from "@/components/giron/GironBar";
import { TablaArrendatarios } from "@/components/giron/TablaArrendatarios";
import { NuevoArrendatarioForm } from "@/components/giron/NuevoArrendatarioForm";

export const metadata: Metadata = {
  title: "Arrendatarios — Girón Admin",
  robots: { index: false },
};

export default async function ArrendatariosPage() {
  const session = await getSessionProfile();
  if (!session) redirect("/giron/login");
  if (!esAdmin(session.profile.rol)) redirect("/giron/portal");

  const [{ rows }, unidades] = await Promise.all([getAdminResumen(), getUnidadesDisponibles()]);

  return (
    <>
      <GironBar variant="admin" active="/giron/admin/arrendatarios" profile={session.profile} />
      <section className="block g-section">
        <div className="wrap">
          <span className="eyebrow">Gestión</span>
          <h1 className="g-h1">Arrendatarios</h1>

          <TablaArrendatarios rows={rows} />

          <h2 className="g-h2">Nuevo arrendatario</h2>
          <NuevoArrendatarioForm unidades={unidades} />
        </div>
      </section>
    </>
  );
}
