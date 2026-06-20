import { formatCOP, formatPeriodo } from "@/lib/format";
import { periodoActual } from "@/lib/giron/estado";

export function Kpis({
  recaudadoMes,
  porcentajeAlDia,
  ocupadas,
  totalUnidades,
}: {
  recaudadoMes: number;
  porcentajeAlDia: number;
  ocupadas: number;
  totalUnidades: number;
}) {
  return (
    <div className="kpi-grid">
      <div className="kpi">
        <span className="kpi-label">Recaudado · {formatPeriodo(periodoActual())}</span>
        <span className="kpi-value">{formatCOP(recaudadoMes)}</span>
      </div>
      <div className="kpi">
        <span className="kpi-label">Al día</span>
        <span className="kpi-value">{porcentajeAlDia}%</span>
      </div>
      <div className="kpi">
        <span className="kpi-label">Apartamentos ocupados</span>
        <span className="kpi-value">
          {ocupadas}<span className="kpi-sub"> / {totalUnidades}</span>
        </span>
      </div>
    </div>
  );
}
