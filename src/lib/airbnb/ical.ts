/**
 * airbnb/ical.ts — Lectura del iCal de Airbnb (única vía oficial de
 * disponibilidad; Airbnb no expone precios ni reservas por API). Ver docs/06.
 *
 * Regla de oro: NUNCA romper la página por culpa del iCal. Si falla o tarda,
 * se devuelve una lista vacía de bloqueos y la UI muestra el calendario sin
 * bloqueos con un aviso ("disponibilidad sujeta a confirmación").
 */
import ical, { type VEvent } from "node-ical";

export type Booking = { start: Date; end: Date };

export type AvailabilityResult = {
  blocked: { start: string; end: string }[];
  /** true si el iCal se leyó bien; false si falló (mostrar aviso en la UI). */
  ok: boolean;
};

/** Lee el iCal de Airbnb y devuelve los rangos reservados/bloqueados. */
export async function getAirbnbBookings(): Promise<{ bookings: Booking[]; ok: boolean }> {
  const url = process.env.AIRBNB_ICAL_SANTA_MARTA;
  if (!url) return { bookings: [], ok: false };

  try {
    const data = await ical.async.fromURL(url);
    const bookings: Booking[] = Object.values(data)
      .filter((e): e is VEvent => (e as VEvent).type === "VEVENT")
      .filter((e) => e.start != null && e.end != null)
      .map((e) => ({ start: new Date(e.start as Date), end: new Date(e.end as Date) }));
    return { bookings, ok: true };
  } catch (err) {
    console.error("[AIRBNB] iCal error:", err);
    return { bookings: [], ok: false }; // nunca romper la página
  }
}

/** ¿Está libre el rango [checkIn, checkOut) frente a los bloqueos? */
export function isAvailable(bookings: Booking[], checkIn: Date, checkOut: Date): boolean {
  const overlap = (s1: Date, e1: Date, s2: Date, e2: Date) => s1 < e2 && e1 > s2;
  return !bookings.some((b) => overlap(checkIn, checkOut, b.start, b.end));
}
