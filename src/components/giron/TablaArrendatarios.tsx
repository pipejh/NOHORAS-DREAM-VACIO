import Link from "next/link";
import { formatCOP } from "@/lib/format";
import { EstadoBadge } from "./Badge";
import type { ArrendatarioRow } from "@/lib/giron/data";

export function TablaArrendatarios({ rows }: { rows: ArrendatarioRow[] }) {
  if (rows.length === 0) {
    return (
      <div className="g-empty">
        <p>Todavía no hay arrendatarios con contrato activo.</p>
        <Link className="btn btn-primary" href="/giron/admin/arrendatarios">
          Crear el primero
        </Link>
      </div>
    );
  }

  return (
    <div className="g-panel">
      <table className="g-table">
        <thead>
          <tr>
            <th>Apto</th>
            <th>Arrendatario</th>
            <th>Valor</th>
            <th>Día de pago</th>
            <th>Estado del mes</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id}>
              <td><strong>{r.unit?.identificador ?? "—"}</strong></td>
              <td>
                {r.arrendatario?.nombre ?? r.arrendatario?.username ?? "—"}
                <small className="g-sub">@{r.arrendatario?.username}</small>
              </td>
              <td>{formatCOP(r.valor_mensual)}</td>
              <td>Día {r.dia_pago}</td>
              <td><EstadoBadge estado={r.estadoMes} /></td>
              <td>
                <Link className="g-link" href={`/giron/admin/arrendatarios/${r.id}`}>
                  Ver detalle →
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
