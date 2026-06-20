import { ESTADO_LABEL, type EstadoArriendo } from "@/lib/giron/estado";

/** Badge de estado con color + texto (nunca solo color, por accesibilidad). */
export function EstadoBadge({ estado }: { estado: EstadoArriendo }) {
  const cls =
    estado === "al_dia" ? "g-badge ok" : estado === "por_vencer" ? "g-badge warn" : "g-badge danger";
  return (
    <span className={cls}>
      <i className="dot" aria-hidden="true" />
      {ESTADO_LABEL[estado]}
    </span>
  );
}

/** Badge para el estado de un pago. */
export function PagoBadge({ estado }: { estado: string }) {
  const map: Record<string, [string, string]> = {
    aprobado: ["g-badge ok", "Aprobado"],
    pendiente: ["g-badge warn", "Pendiente"],
    rechazado: ["g-badge danger", "Rechazado"],
    anulado: ["g-badge muted", "Anulado"],
  };
  const [cls, label] = map[estado] ?? ["g-badge muted", estado];
  return (
    <span className={cls}>
      <i className="dot" aria-hidden="true" />
      {label}
    </span>
  );
}
