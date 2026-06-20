import { getAirbnbBookings } from "@/lib/airbnb/ical";

// El iCal de Airbnb no cambia al segundo: cacheamos la respuesta ~1h.
export const revalidate = 3600;

// Fecha de calendario (YYYY-MM-DD) en UTC. Los eventos all-day del iCal de
// Airbnb se normalizan así para que el cliente los compare como strings, sin
// reparsear a Date (evita corrimientos de un día por zona horaria).
function toDateKey(d: Date): string {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getUTCFullYear()}-${p(d.getUTCMonth() + 1)}-${p(d.getUTCDate())}`;
}

/**
 * GET /api/airbnb/availability
 * Devuelve solo los rangos bloqueados (start inclusivo, end exclusivo) como
 * fechas YYYY-MM-DD, y un flag `ok`. La UI nunca debe romperse si `ok` es false.
 */
export async function GET() {
  const { bookings, ok } = await getAirbnbBookings();
  const blocked = bookings.map((b) => ({
    start: toDateKey(b.start),
    end: toDateKey(b.end),
  }));
  return Response.json({ blocked, ok });
}
