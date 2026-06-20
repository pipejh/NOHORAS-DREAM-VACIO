import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getMiArriendo, getPagosDeLease, getSessionProfile } from "@/lib/giron/data";
import { formatCOP, formatFecha, formatPeriodo } from "@/lib/format";
import { GironBar } from "@/components/giron/GironBar";
import { PagoBadge } from "@/components/giron/Badge";

export const metadata: Metadata = {
  title: "Historial — Girón",
  robots: { index: false },
};

export default async function HistorialPage() {
  const session = await getSessionProfile();
  if (!session) redirect("/giron/login");

  const lease = await getMiArriendo(session.userId);
  const pagos = lease ? await getPagosDeLease(lease.id) : [];

  return (
    <>
      <GironBar variant="portal" active="/giron/portal/historial" profile={session.profile} />
      <section className="block g-section">
        <div className="wrap">
          <span className="eyebrow">Historial</span>
          <h1 className="g-h1">Tus pagos</h1>

          {pagos.length === 0 ? (
            <div className="g-empty">
              <p>Aún no hay pagos registrados.</p>
            </div>
          ) : (
            <div className="g-panel">
              <table className="g-table">
                <thead>
                  <tr>
                    <th>Periodo</th>
                    <th>Monto</th>
                    <th>Método</th>
                    <th>Estado</th>
                    <th>Fecha</th>
                    <th>Comprobante</th>
                  </tr>
                </thead>
                <tbody>
                  {pagos.map((p) => (
                    <tr key={p.id}>
                      <td>{formatPeriodo(p.periodo)}</td>
                      <td>{formatCOP(p.monto)}</td>
                      <td className="cap">{p.metodo ?? "—"}</td>
                      <td>
                        <PagoBadge estado={p.estado} />
                      </td>
                      <td>{p.pagado_at ? formatFecha(p.pagado_at.slice(0, 10)) : "—"}</td>
                      <td>
                        {p.comprobante_url ? (
                          <a className="g-link" href={`/giron/comprobante/${p.id}`} target="_blank" rel="noopener noreferrer">
                            Ver
                          </a>
                        ) : (
                          "—"
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
