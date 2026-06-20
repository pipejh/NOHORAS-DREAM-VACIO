/** Formato de moneda COP es-CO: $1.250.000 (separador de miles con punto). */
export function formatCOP(n: number): string {
  return `$${Math.round(n).toLocaleString("es-CO")}`;
}

/** Fecha ISO (YYYY-MM-DD) → legible es-CO, ej. "5 de junio de 2026". */
export function formatFecha(iso: string): string {
  const d = new Date(`${iso}T12:00:00`);
  return d.toLocaleDateString("es-CO", { day: "numeric", month: "long", year: "numeric" });
}

/** Periodo 'YYYY-MM' → "junio 2026". */
export function formatPeriodo(periodo: string): string {
  const [y, m] = periodo.split("-").map(Number);
  const d = new Date(y, m - 1, 1);
  return d.toLocaleDateString("es-CO", { month: "long", year: "numeric" });
}
