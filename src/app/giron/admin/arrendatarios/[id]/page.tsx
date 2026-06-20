import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getArrendatarioDetalle, getSessionProfile } from "@/lib/giron/data";
import { esAdmin } from "@/lib/giron/constants";
import { calcularEstadoMes, periodoActual } from "@/lib/giron/estado";
import { formatCOP, formatFecha, formatPeriodo } from "@/lib/format";
import { GironBar } from "@/components/giron/GironBar";
import { EstadoBadge, PagoBadge } from "@/components/giron/Badge";
import { RegistrarPagoForm } from "@/components/giron/RegistrarPagoForm";
import { finalizarContrato, aprobarPago, rechazarPago } from "@/app/giron/admin/actions";

export const metadata: Metadata = {
  title: "Detalle de arrendatario — Girón Admin",
  robots: { index: false },
};

export default async function DetalleArrendatario({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSessionProfile();
  if (!session) redirect("/giron/login");
  if (!esAdmin(session.profile.rol)) redirect("/giron/portal");

  const { id } = await params;
  const detalle = await getArrendatarioDetalle(id);
  if (!detalle) notFound();

  const { lease, pagos } = detalle;
  const { estado } = calcularEstadoMes(
    { valor_mensual: lease.valor_mensual, dia_pago: lease.dia_pago },
    pagos.map((p) => ({ periodo: p.periodo, estado: p.estado })),
  );

  return (
    <>
      <GironBar variant="admin" active="/giron/admin/arrendatarios" profile={session.profile} />
      <section className="block g-section">
        <div className="wrap">
          <Link href="/giron/admin/arrendatarios" className="g-back">
            ← Arrendatarios
          </Link>

          <div className="g-head">
            <div>
              <span className="eyebrow">Apto {lease.unit?.identificador ?? "—"}</span>
              <h1 className="g-h1">{lease.arrendatario?.nombre ?? lease.arrendatario?.username}</h1>
            </div>
            <EstadoBadge estado={estado} />
          </div>

          <div className="portal-grid">
            <div className="g-card">
              <h3 className="g-card-title">Contrato</h3>
              <dl className="g-dl">
                <div><dt>Usuario</dt><dd>@{lease.arrendatario?.username}</dd></div>
                <div><dt>WhatsApp</dt><dd>{lease.arrendatario?.telefono ?? "—"}</dd></div>
                <div><dt>Valor mensual</dt><dd>{formatCOP(lease.valor_mensual)}</dd></div>
                <div><dt>Día de pago</dt><dd>Día {lease.dia_pago}</dd></div>
                <div><dt>Inicio</dt><dd>{formatFecha(lease.fecha_inicio)}</dd></div>
                <div><dt>Depósito</dt><dd>{formatCOP(lease.deposito)}</dd></div>
                <div><dt>Estado del contrato</dt><dd className="cap">{lease.estado}</dd></div>
              </dl>

              {lease.estado === "activo" && (
                <form action={finalizarContrato} className="g-inline-form">
                  <input type="hidden" name="lease_id" value={lease.id} />
                  <input type="hidden" name="unit_id" value={lease.unit_id ?? ""} />
                  <button type="submit" className="g-danger-link">
                    Finalizar contrato
                  </button>
                </form>
              )}
            </div>

            <div className="g-card">
              <h3 className="g-card-title">Registrar pago manual</h3>
              <RegistrarPagoForm
                leaseId={lease.id}
                periodoActual={periodoActual()}
                valorMensual={lease.valor_mensual}
              />
            </div>
          </div>

          <h2 className="g-h2">Historial de pagos</h2>
          {pagos.length === 0 ? (
            <div className="g-empty"><p>Aún no hay pagos registrados.</p></div>
          ) : (
            <div className="g-panel">
              <table className="g-table">
                <thead>
                  <tr>
                    <th>Periodo</th>
                    <th>Monto</th>
                    <th>Método</th>
                    <th>Estado</th>
                    <th>Comprobante</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {pagos.map((p) => (
                    <tr key={p.id}>
                      <td>{formatPeriodo(p.periodo)}</td>
                      <td>{formatCOP(p.monto)}</td>
                      <td className="cap">{p.metodo ?? "—"}</td>
                      <td><PagoBadge estado={p.estado} /></td>
                      <td>
                        {p.comprobante_url ? (
                          <a className="g-link" href={`/giron/comprobante/${p.id}`} target="_blank" rel="noopener noreferrer">
                            Ver
                          </a>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td>
                        {p.estado === "pendiente" ? (
                          <div className="g-row-actions">
                            <form action={aprobarPago}>
                              <input type="hidden" name="payment_id" value={p.id} />
                              <input type="hidden" name="lease_id" value={lease.id} />
                              <button type="submit" className="g-approve">Aprobar</button>
                            </form>
                            <form action={rechazarPago}>
                              <input type="hidden" name="payment_id" value={p.id} />
                              <input type="hidden" name="lease_id" value={lease.id} />
                              <button type="submit" className="g-danger-link">Rechazar</button>
                            </form>
                          </div>
                        ) : (
                          <span className="g-sub">{p.pagado_at ? formatFecha(p.pagado_at.slice(0, 10)) : "—"}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
