import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getMiArriendo, getPagosDeLease, getSessionProfile } from "@/lib/giron/data";
import { calcularEstadoMes } from "@/lib/giron/estado";
import { formatCOP, formatFecha } from "@/lib/format";
import { GironBar } from "@/components/giron/GironBar";
import { EstadoMesCard } from "@/components/giron/EstadoMesCard";

export const metadata: Metadata = {
  title: "Mi arriendo — Girón",
  robots: { index: false },
};

export default async function PortalPage() {
  const session = await getSessionProfile();
  if (!session) redirect("/giron/login");

  const lease = await getMiArriendo(session.userId);

  return (
    <>
      <GironBar variant="portal" active="/giron/portal" profile={session.profile} />
      <section className="block g-section">
        <div className="wrap">
          <span className="eyebrow">Mi arriendo</span>
          <h1 className="g-h1">Hola, {session.profile.nombre ?? session.profile.username}</h1>

          {!lease ? (
            <div className="g-empty">
              <p>Aún no tienes un contrato activo asignado.</p>
              <p className="estado-note">Si crees que es un error, escríbenos por WhatsApp.</p>
            </div>
          ) : (
            <div className="portal-grid">
              <EstadoMesCard
                estadoMes={calcularEstadoMes(
                  { valor_mensual: lease.valor_mensual, dia_pago: lease.dia_pago },
                  (await getPagosDeLease(lease.id)).map((p) => ({
                    periodo: p.periodo,
                    estado: p.estado,
                  })),
                )}
              />

              <div className="g-card">
                <h3 className="g-card-title">Tu contrato</h3>
                <dl className="g-dl">
                  <div>
                    <dt>Apartamento</dt>
                    <dd>{lease.unit?.identificador ?? "—"}</dd>
                  </div>
                  <div>
                    <dt>Valor mensual</dt>
                    <dd>{formatCOP(lease.valor_mensual)}</dd>
                  </div>
                  <div>
                    <dt>Día de pago</dt>
                    <dd>Día {lease.dia_pago} de cada mes</dd>
                  </div>
                  <div>
                    <dt>Inicio del contrato</dt>
                    <dd>{formatFecha(lease.fecha_inicio)}</dd>
                  </div>
                </dl>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
