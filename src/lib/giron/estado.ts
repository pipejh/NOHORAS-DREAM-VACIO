/**
 * Cálculo del estado del mes de un arriendo (al día / por vencer / en mora).
 * El estado NO se almacena: se calcula a partir de los pagos aprobados del
 * periodo actual y del día de pago del contrato. Zona horaria America/Bogota.
 * En Fase 2 no hay recargo de mora: solo se marca el estado.
 */
export type EstadoArriendo = "al_dia" | "por_vencer" | "en_mora";

export type LeaseLite = {
  valor_mensual: number;
  dia_pago: number;
};

export type PaymentLite = {
  periodo: string;
  estado: string;
};

export type EstadoMes = {
  estado: EstadoArriendo;
  periodo: string; // 'YYYY-MM' actual
  diaPago: number;
  fechaLimite: string; // 'YYYY-MM-DD'
  montoPendiente: number; // 0 si está al día
};

/** Fecha actual en America/Bogota como {y, m, d}. */
export function bogotaHoy(now: Date = new Date()): { y: number; m: number; d: number } {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Bogota",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
  const [y, m, d] = parts.split("-").map(Number);
  return { y, m, d };
}

export function periodoActual(now: Date = new Date()): string {
  const { y, m } = bogotaHoy(now);
  return `${y}-${String(m).padStart(2, "0")}`;
}

export function calcularEstadoMes(
  lease: LeaseLite,
  payments: PaymentLite[],
  now: Date = new Date(),
): EstadoMes {
  const { y, m, d } = bogotaHoy(now);
  const periodo = `${y}-${String(m).padStart(2, "0")}`;
  const diaPago = lease.dia_pago;
  const fechaLimite = `${y}-${String(m).padStart(2, "0")}-${String(diaPago).padStart(2, "0")}`;

  const pagado = payments.some((p) => p.periodo === periodo && p.estado === "aprobado");

  let estado: EstadoArriendo;
  if (pagado) estado = "al_dia";
  else if (d <= diaPago) estado = "por_vencer";
  else estado = "en_mora";

  return {
    estado,
    periodo,
    diaPago,
    fechaLimite,
    montoPendiente: pagado ? 0 : lease.valor_mensual,
  };
}

export const ESTADO_LABEL: Record<EstadoArriendo, string> = {
  al_dia: "Al día",
  por_vencer: "Por vencer",
  en_mora: "En mora",
};
