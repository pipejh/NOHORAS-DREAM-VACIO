import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdminResumen, getSessionProfile } from "@/lib/giron/data";
import { esAdmin } from "@/lib/giron/constants";
import { GironBar } from "@/components/giron/GironBar";
import { Kpis } from "@/components/giron/Kpis";
import { TablaArrendatarios } from "@/components/giron/TablaArrendatarios";

export const metadata: Metadata = {
  title: "Dashboard — Girón Admin",
  robots: { index: false },
};

export default async function AdminDashboard() {
  const session = await getSessionProfile();
  if (!session) redirect("/giron/login");
  if (!esAdmin(session.profile.rol)) redirect("/giron/portal");

  const { rows, kpis } = await getAdminResumen();

  return (
    <>
      <GironBar variant="admin" active="/giron/admin" profile={session.profile} />
      <section className="block g-section">
        <div className="wrap">
          <div className="g-head">
            <div>
              <span className="eyebrow">Resumen del edificio</span>
              <h1 className="g-h1">Dashboard</h1>
            </div>
            <Link className="btn btn-primary" href="/giron/admin/arrendatarios">
              + Nuevo arrendatario
            </Link>
          </div>

          <Kpis {...kpis} />

          <h2 className="g-h2">Arrendatarios</h2>
          <TablaArrendatarios rows={rows} />
        </div>
      </section>
    </>
  );
}
