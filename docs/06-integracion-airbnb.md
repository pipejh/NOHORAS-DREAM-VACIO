# 06 — Integración Airbnb (calendario en vivo)

## La realidad de Airbnb (leer primero)

Airbnb **no ofrece API pública** de precios ni de reservas para hosts individuales. El único mecanismo oficial de integración es el **iCal export/import** del calendario.

Lo que el iCal **sí** entrega:
- ✅ Fechas **bloqueadas** (reservadas o cerradas manualmente).
- ✅ Por tanto, qué fechas están **disponibles** (las que no aparecen).

Lo que el iCal **no** entrega:
- ❌ Precios por noche.
- ❌ Datos del huésped.
- ❌ Capacidad de crear reservas desde la web.

### Conclusión de diseño
- **Calendario en vivo de disponibilidad:** se construye con el iCal. ✅
- **Precios mostrados:** salen de **nuestra tabla de temporadas** (`lib/precios.ts`, ver `01-propiedad-santa-marta.md`). Hay que mantenerla alineada con lo publicado en Airbnb. ⚠️
- **Reservar:** botón "Reservar en Airbnb" → deep-link al listing. La reserva y el pago suceden en Airbnb. ✅

## Cómo obtener la URL del iCal de Airbnb

En Airbnb: **Calendario → Disponibilidad → Conectar calendarios → Exportar calendario** → copiar la URL `.ics`. Guardarla en `AIRBNB_ICAL_SANTA_MARTA`.

## Implementación

### Lectura del iCal (ya probada en producción)

El bot actual ya hace esto en `ASISTENTE LABORAL/bot/nohoras-calendar.js`. Portar a la plataforma:

```ts
// lib/airbnb/ical.ts
import ical from 'node-ical';

export type Booking = { start: Date; end: Date; summary: string };

export async function getAirbnbBookings(): Promise<Booking[]> {
  const url = process.env.AIRBNB_ICAL_SANTA_MARTA;
  if (!url) return [];
  try {
    const data = await ical.async.fromURL(url);
    return Object.values(data)
      .filter((e: any) => e.type === 'VEVENT')
      .map((e: any) => ({
        start: new Date(e.start),
        end: new Date(e.end),
        summary: e.summary || 'Reservado',
      }));
  } catch (err) {
    console.error('[AIRBNB] iCal error:', err);
    return []; // nunca romper la página por culpa del iCal
  }
}

export function isAvailable(bookings: Booking[], checkIn: Date, checkOut: Date) {
  const overlap = (s1: Date, e1: Date, s2: Date, e2: Date) => s1 < e2 && e1 > s2;
  return !bookings.some(b => overlap(checkIn, checkOut, b.start, b.end));
}
```

### Endpoint cacheado

```ts
// app/api/airbnb/availability/route.ts
import { getAirbnbBookings } from '@/lib/airbnb/ical';
export const revalidate = 3600; // cache 1h — el iCal de Airbnb no cambia al segundo

export async function GET() {
  const bookings = await getAirbnbBookings();
  // devolver solo rangos bloqueados (sin datos sensibles del summary si los hubiera)
  const blocked = bookings.map(b => ({ start: b.start, end: b.end }));
  return Response.json({ blocked });
}
```

### Calendario en el front

- Pintar un calendario mensual. Días dentro de un rango `blocked` → no disponibles. Resto → disponibles, con el precio de su temporada (de `lib/precios.ts`).
- Al elegir check-in/check-out, validar con `isAvailable` y calcular total con el cotizador.
- Botón principal: **"Reservar en Airbnb"** → `AIRBNB_LISTING_URL` (opcionalmente con `?check_in=…&check_out=…` para prellenar fechas en Airbnb).
- Botón secundario: **WhatsApp** con mensaje prellenado (fechas + cotización).

## Manejo de errores

- Si el iCal falla o tarda, mostrar el calendario sin bloqueos pero con aviso ("disponibilidad sujeta a confirmación") y empujar a WhatsApp/Airbnb. **Nunca** dejar la página en blanco por culpa del iCal.

## Precios: decisión y camino futuro

Pregunta frecuente: *"¿cómo tener los precios de Airbnb en vivo?"*. Respuesta honesta: Airbnb no los entrega por API/iCal. Caminos posibles:

| Opción | Qué da | Costo / riesgo | Veredicto |
|---|---|---|---|
| **A. Tabla propia estacional** ✅ *(elegida)* | Precios por temporada como fuente única (ya existe en el bot). El pricing del loft es estacional, no dinámico → la tabla = el precio real de Airbnb. | Gratis. Actualización manual al cambiar precios. | **Usar ahora.** Da el 100% del valor. |
| **B. Channel Manager / PMS** (Smoobu, Lodgify, Hostaway) | Precio + disponibilidad en vivo reales, reserva directa con pago, y **cero dobles reservas** (sync bidireccional oficial con Airbnb). | ~USD $15–30/mes + setup. | **Migrar cuando** haya volumen o se quiera precio dinámico + pago directo automático. |
| **C. Scraping API** (Apify/RapidAPI) | Lee el precio del listing público periódicamente. | Zona gris de ToS, frágil, costo. | **Evitar.** |

**Implementación actual (Opción A):** `lib/precios.ts` (port de `nohoras-precios.js`) calcula el precio noche a noche por temporada. El calendario muestra ese precio sobre los días disponibles (disponibilidad sí viene del iCal). Mantener la tabla alineada con lo publicado en Airbnb.

**Si algún día se migra a PMS (Opción B):** el PMS pasa a ser la fuente de precios y disponibilidad; la web consume su API; la reserva directa con pago se hace por el motor del PMS (evita dobles reservas con Airbnb). El resto de la arquitectura no cambia.

## Sincronización inversa (opcional, futuro)

El sistema actual también **publica** un iCal propio (reservas por WhatsApp) que Airbnb puede importar, para evitar dobles reservas. Si se quiere mantener, ver `nohoras-calendar.js` (función `buildICS` + sync por GitHub Gist). No es necesario para la vitrina web inicial.
