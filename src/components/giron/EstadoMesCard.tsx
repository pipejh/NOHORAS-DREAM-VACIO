import { formatCOP, formatFecha, formatPeriodo } from "@/lib/format";
import { ESTADO_LABEL, type EstadoMes } from "@/lib/giron/estado";

export function EstadoMesCard({
  estadoMes,
  enRevision = false,
}: {
  estadoMes: EstadoMes;
  enRevision?: boolean;
}) {
  const { estado, periodo, fechaLimite, montoPendiente } = estadoMes;
  const cls =
    estado === "al_dia"
      ? "estado-card ok"
      : estado === "por_vencer"
        ? "estado-card warn"
        : "estado-card danger";

  return (
    <div className={cls}>
      <span className="estado-eyebrow">Estado de {formatPeriodo(periodo)}</span>
      <div className="estado-main">
        <span className="estado-label">{ESTADO_LABEL[estado]}</span>
      </div>
      {estado === "al_dia" ? (
        <p className="estado-msg">Tu arriendo de este mes está al día. ¡Gracias!</p>
      ) : (
        <p className="estado-msg">
          Debes <strong>{formatCOP(montoPendiente)}</strong>
          {estado === "en_mora"
            ? ` — el plazo venció el ${formatFecha(fechaLimite)}.`
            : ` antes del ${formatFecha(fechaLimite)}.`}
        </p>
      )}
      {estado !== "al_dia" && (
        <p className="estado-note">
          {enRevision
            ? "Recibimos tu comprobante; lo estamos confirmando."
            : "Transfiere y sube tu comprobante aquí abajo. ¡Es gratis!"}
        </p>
      )}
    </div>
  );
}
