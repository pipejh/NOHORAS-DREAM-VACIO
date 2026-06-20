/**
 * precios.ts — Tabla de precios por temporada y cotización para Santa Marta.
 *
 * Port a TypeScript de `ASISTENTE LABORAL/bot/nohoras-precios.js` (lógica
 * probada en producción). Es la FUENTE DE VERDAD de precios: Airbnb no expone
 * precios por API/iCal (ver docs/06). El pricing del loft es estacional, así
 * que esta tabla refleja el precio real publicado en Airbnb.
 *
 * Para actualizar precios: editar TEMPORADAS. Las fechas sin temporada usan
 * PRECIO_BASE. Moneda: COP. Zona horaria de referencia: America/Bogota.
 */

// ─── Precio base (temporada regular) ─────────────────────────────────────────
export const PRECIO_BASE = 200_000; // COP por noche

// ─── Costos adicionales (se pagan en sitio) ──────────────────────────────────
export const COSTO_ASEO = 60_000; // COP — a la Señora Deicy al check-in
export const COSTO_MANILLA = 35_000; // COP por persona — en el lobby al llegar

// ─── Descuentos ──────────────────────────────────────────────────────────────
export const DESCUENTO_SEMANA = 0.1; // 10% para estadías de 7+ noches

// ─── Adelanto para asegurar fecha ─────────────────────────────────────────────
// 1 noche completa (al precio promedio), o 50% si es una sola noche.

export type Temporada = {
  nombre: string;
  /** YYYY-MM-DD (aplica solo ese año) o MM-DD (aplica todos los años). */
  inicio: string;
  fin: string;
  precio: number;
};

// Entradas con año (YYYY-MM-DD) aplican solo ese año (ej. Semana Santa, que
// cambia de fecha). Entradas sin año (MM-DD) aplican todos los años (ej.
// diciembre, puentes fijos). Si un rango cruza año nuevo, usar dos entradas.
export const TEMPORADAS: Temporada[] = [
  // Semana Santa (varía por año — actualizar anualmente)
  { nombre: "Semana Santa 2025", inicio: "2025-04-10", fin: "2025-04-20", precio: 420_000 },
  { nombre: "Semana Santa 2026", inicio: "2026-03-26", fin: "2026-04-05", precio: 420_000 },
  { nombre: "Semana Santa 2027", inicio: "2027-03-25", fin: "2027-04-04", precio: 420_000 },

  // Mitad de año
  { nombre: "Vacaciones junio-julio", inicio: "06-15", fin: "07-20", precio: 350_000 },

  // Diciembre — temporada alta
  { nombre: "Temporada alta diciembre", inicio: "12-15", fin: "12-31", precio: 460_000 },

  // Año nuevo — enero
  { nombre: "Año nuevo - enero", inicio: "01-01", fin: "01-10", precio: 460_000 },

  // Festivos puente Colombia (ajustar según calendario oficial)
  { nombre: "Puente festivo", inicio: "08-07", fin: "08-11", precio: 350_000 },
  { nombre: "Puente festivo", inicio: "10-12", fin: "10-15", precio: 350_000 },
  { nombre: "Puente festivo", inicio: "11-02", fin: "11-04", precio: 350_000 },
];

/** Precio "más alto" entre las temporadas, para clasificar días de alta. */
export const PRECIO_TEMPORADA_ALTA = Math.max(
  PRECIO_BASE,
  ...TEMPORADAS.map((t) => t.precio),
);

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getMMDD(date: Date): string {
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${m}-${d}`;
}

export type PrecioNoche = { precio: number; temporada: string };

/** Precio y temporada de una noche concreta. */
export function getPrecioNoche(date: Date): PrecioNoche {
  const yyyy = date.getFullYear();
  const mmdd = getMMDD(date);

  for (const t of TEMPORADAS) {
    if (t.inicio.length === 10) {
      // Temporada con año fijo (YYYY-MM-DD): comparar fecha completa.
      const iso = `${yyyy}-${mmdd}`;
      if (iso >= t.inicio && iso <= t.fin) {
        return { precio: t.precio, temporada: t.nombre };
      }
    } else {
      // Temporada recurrente (MM-DD): comparar solo mes-día.
      if (mmdd >= t.inicio && mmdd <= t.fin) {
        return { precio: t.precio, temporada: t.nombre };
      }
    }
  }
  return { precio: PRECIO_BASE, temporada: "Regular" };
}

/** ¿Esta noche es de temporada alta (precio por encima del base)? */
export function esTemporadaAlta(date: Date): boolean {
  return getPrecioNoche(date).precio > PRECIO_BASE;
}

// ─── Cotización ────────────────────────────────────────────────────────────────

export type DesgloseNoche = { fecha: string; precio: number; temporada: string };

export type Cotizacion = {
  checkIn: string;
  checkOut: string;
  noches: number;
  adultos: number;
  ninos: number;
  desglose: DesgloseNoche[];
  totalAlojamiento: number; // sin descuentos
  descuento: number;
  descuentoLabel: string;
  totalAlojamientoFinal: number; // a pagar al host
  costoAseo: number;
  costoManillaUnitario: number;
  costoManillasTotal: number;
  adelanto: number;
  hayVariasTemporadas: boolean;
};

/** Parsea "YYYY-MM-DD" a Date local al mediodía (evita saltos por TZ). */
function parseFecha(iso: string): Date {
  return new Date(`${iso}T12:00:00`);
}

/**
 * Calcula la cotización completa para un rango de fechas. El cálculo es noche
 * a noche porque un viaje puede cruzar temporadas.
 */
export function calcularCotizacion(
  checkIn: string,
  checkOut: string,
  adultos = 2,
  ninos = 0,
): Cotizacion {
  const entrada = parseFecha(checkIn);
  const salida = parseFecha(checkOut);
  const noches = Math.round((salida.getTime() - entrada.getTime()) / 86_400_000);

  if (noches <= 0) {
    throw new Error("Fechas inválidas: el check-out debe ser posterior al check-in");
  }

  const desglose: DesgloseNoche[] = [];
  let totalAlojamiento = 0;
  const cursor = new Date(entrada);
  for (let i = 0; i < noches; i++) {
    const { precio, temporada } = getPrecioNoche(cursor);
    desglose.push({ fecha: cursor.toISOString().split("T")[0], precio, temporada });
    totalAlojamiento += precio;
    cursor.setDate(cursor.getDate() + 1);
  }

  let descuento = 0;
  let descuentoLabel = "";
  if (noches >= 7) {
    descuento = Math.round(totalAlojamiento * DESCUENTO_SEMANA);
    descuentoLabel = `Descuento estadía larga (${Math.round(DESCUENTO_SEMANA * 100)}%)`;
  }

  const totalPersonas = adultos + ninos;
  const costoManillasTotal = COSTO_MANILLA * totalPersonas;

  const totalAlojamientoFinal = totalAlojamiento - descuento;

  const precioPromedio = Math.round(totalAlojamientoFinal / noches);
  const adelanto =
    noches === 1 ? Math.round(totalAlojamientoFinal / 2) : precioPromedio;

  const temporadas = new Set(desglose.map((d) => d.temporada));

  return {
    checkIn,
    checkOut,
    noches,
    adultos,
    ninos,
    desglose,
    totalAlojamiento,
    descuento,
    descuentoLabel,
    totalAlojamientoFinal,
    costoAseo: COSTO_ASEO,
    costoManillaUnitario: COSTO_MANILLA,
    costoManillasTotal,
    adelanto,
    hayVariasTemporadas: temporadas.size > 1,
  };
}

// ─── Formato de moneda COP (es-CO: $1.250.000) ────────────────────────────────

export function formatCOP(n: number): string {
  return `$${n.toLocaleString("es-CO")}`;
}

/**
 * Arma el mensaje de WhatsApp con la cotización lista para enviar, en es/en.
 * Reusa la estructura del bot (adelanto, aseo, manilla, descuento).
 */
export function mensajeWhatsApp(cot: Cotizacion, idioma: "es" | "en" = "es"): string {
  const fmt = (n: number) => n.toLocaleString("es-CO");
  const lines: string[] = [];

  if (idioma === "en") {
    lines.push(
      `*Quote — Nohoras Dream (El Rodadero)*`,
      ``,
      `Check-in: ${cot.checkIn}`,
      `Check-out: ${cot.checkOut}`,
      `Nights: ${cot.noches}`,
      `Guests: ${cot.adultos} adult${cot.adultos > 1 ? "s" : ""}${
        cot.ninos > 0 ? ` + ${cot.ninos} child${cot.ninos > 1 ? "ren" : ""}` : ""
      }`,
      ``,
      `Breakdown`,
    );
    if (cot.hayVariasTemporadas) {
      for (const d of cot.desglose) lines.push(`  • ${d.fecha}: $${fmt(d.precio)} COP (${d.temporada})`);
    } else {
      lines.push(`  • ${cot.noches} night${cot.noches > 1 ? "s" : ""} × $${fmt(cot.desglose[0].precio)} COP = $${fmt(cot.totalAlojamiento)} COP`);
    }
    if (cot.descuento > 0) lines.push(`  • ${cot.descuentoLabel}: -$${fmt(cot.descuento)} COP`);
    lines.push(
      ``,
      `*Total accommodation: $${fmt(cot.totalAlojamientoFinal)} COP*`,
      ``,
      `Additional costs (paid on-site):`,
      `  • Security wristband: $${fmt(cot.costoManillaUnitario)} COP/person × ${cot.adultos + cot.ninos} = $${fmt(cot.costoManillasTotal)} COP`,
      `  • Cleaning: $${fmt(cot.costoAseo)} COP`,
      ``,
      `Deposit to confirm: $${fmt(cot.adelanto)} COP (${cot.noches === 1 ? "50% of total" : "1 night"})`,
    );
  } else {
    lines.push(
      `*Cotización — Nohoras Dream (El Rodadero)*`,
      ``,
      `Entrada: ${cot.checkIn}`,
      `Salida: ${cot.checkOut}`,
      `Noches: ${cot.noches}`,
      `Huéspedes: ${cot.adultos} adulto${cot.adultos > 1 ? "s" : ""}${
        cot.ninos > 0 ? ` + ${cot.ninos} niño${cot.ninos > 1 ? "s" : ""}` : ""
      }`,
      ``,
      `Desglose`,
    );
    if (cot.hayVariasTemporadas) {
      for (const d of cot.desglose) lines.push(`  • ${d.fecha}: $${fmt(d.precio)} COP (${d.temporada})`);
    } else {
      lines.push(`  • ${cot.noches} noche${cot.noches > 1 ? "s" : ""} × $${fmt(cot.desglose[0].precio)} COP = $${fmt(cot.totalAlojamiento)} COP`);
    }
    if (cot.descuento > 0) lines.push(`  • ${cot.descuentoLabel}: -$${fmt(cot.descuento)} COP`);
    lines.push(
      ``,
      `*Total alojamiento: $${fmt(cot.totalAlojamientoFinal)} COP*`,
      ``,
      `Costos adicionales (se pagan en sitio):`,
      `  • Manilla de seguridad: $${fmt(cot.costoManillaUnitario)} COP/persona × ${cot.adultos + cot.ninos} = $${fmt(cot.costoManillasTotal)} COP`,
      `  • Aseo y lavandería: $${fmt(cot.costoAseo)} COP`,
      ``,
      `Adelanto para asegurar la fecha: $${fmt(cot.adelanto)} COP (${cot.noches === 1 ? "50% del total" : "1 noche completa"})`,
    );
  }

  return lines.join("\n");
}
