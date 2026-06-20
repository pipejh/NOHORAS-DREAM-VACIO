import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getMiArriendo, getPagosDeLease, getSessionProfile } from "@/lib/giron/data";
import { calcularEstadoMes, periodoActual } from "@/lib/giron/estado";
import { getPagoInfo } from "@/lib/giron/settings";
import { formatCOP, formatFecha, formatPeriodo } from "@/lib/format";
import { GironBar } from "@/components/giron/GironBar";
import { EstadoMesCard } from "@/components/giron/EstadoMesCard";
import { PagoTransferencia } from "@/components/giron/PagoTransferencia";

export const metadata: Metadata = {
  title: "Mi arriendo — Girón",
  robots: { index: false },
};

export default async function PortalPage() {
  const session = await getSessionProfile();
  if (!session) redirect("/giron/login");

  const lease = await getMiArriendo(session.userId);
  const pagos = lease ? await getPagosDeLease(lease.id) : [];
  const periodo = periodoActual();
  const estadoMes = lease
    ? calcularEstadoMes(
        { valor_mensual: lease.valor_mensual, dia_pago: lease.dia_pago },
        pagos.map((p) => ({ periodo: p.periodo, estado: p.estado })),
      )
    : null;
  const enRevision = pagos.some((p) => p.periodo === periodo && p.estado === "pendiente");
  const pagoInfo = lease ? await getPagoInfo() : null;

  return (
    <>
      <GironBar variant="portal" active="/giron/portal" profile={session.profile} />
      <section className="block g-section">
        <div className="wrap">
          <span className="eyebrow">Mi arriendo</span>
          <h1 className="g-h1">Hola, {session.profile.nombre ?? session.profile.username}</h1>

          {!lease || !estadoMes ? (
            <div className="g-empty">
              <p>Aún no tienes un contrato activo asignado.</p>
              <p className="estado-note">Si crees que es un error, escríbenos por WhatsApp.</p>
            </div>
          ) : (
            <>
              <div className="portal-grid">
                <EstadoMesCard estadoMes={estadoMes} enRevision={enRevision} />

                <div className="g-card">
                  <h3 className="g-card-title">Tu contrato</h3>
                  <dl className="g-dl">
                    <div><dt>Apartamento</dt><dd>{lease.unit?.identificador ?? "—"}</dd></div>
                    <div><dt>Valor mensual</dt><dd>{formatCOP(lease.valor_mensual)}</dd></div>
                    <div><dt>Día de pago</dt><dd>Día {lease.dia_pago} de cada mes</dd></div>
                    <div><dt>Inicio del contrato</dt><dd>{formatFecha(lease.fecha_inicio)}</dd></div>
                  </dl>
                </div>
              </div>

              {estadoMes.estado !== "al_dia" && (
                <div style={{ marginTop: 22 }}>
                  <PagoTransferencia
                    info={pagoInfo}
                    periodo={periodo}
                    monto={lease.valor_mensual}
                    referencia={`Apto ${lease.unit?.identificador ?? ""} · ${formatPeriodo(periodo)}`.trim()}
                    enRevision={enRevision}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
}
