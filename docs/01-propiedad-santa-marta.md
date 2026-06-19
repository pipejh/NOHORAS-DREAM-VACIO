# 01 — Nohoras Dream Santa Marta (loft turístico)

## Resumen

Loft turístico premium en **El Rodadero, Santa Marta**, con la mejor vista del sector. Un único apartamento — exclusivo, cuidado, con identidad propia. Capacidad: **2 adultos + máximo 2 niños**.

- **Diferenciador:** "La mejor vista de El Rodadero — un loft exclusivo, solo para ti."
- **Audiencia:** turistas extranjeros (foco principal) + nacionales premium; parejas en escapada romántica y familias pequeñas.
- **Tono:** premium, aspiracional, sensorial, visual-first. **Bilingüe (es/en).**
- **Instagram:** @nohorasdream
- **Reservas:** Airbnb (principal) + WhatsApp (directo).

## Objetivo de la sección web

Es una **vitrina de conversión**. La web debe:

1. **Enamorar** con fotos y videos (la vista vende sola).
2. **Mostrar disponibilidad real** (calendario en vivo sincronizado con Airbnb vía iCal).
3. **Mostrar precios** por temporada (desde nuestra tabla — es la fuente de verdad, ver abajo).
4. **Ofrecer SIEMPRE las dos vías de reserva, con igual peso** (ver siguiente sección).

## Doble vía de reserva (siempre las dos)

Muchos clientes prefieren pagar directo y coordinar por WhatsApp en lugar de pasar por Airbnb. **Nunca empujar solo a Airbnb.** En cada punto de conversión (hero, card de reserva, cotizador, CTA final) ofrecer **ambas opciones, equivalentes**:

| Vía | Qué hace | Para quién |
|---|---|---|
| **Reservar en Airbnb** | Abre el listing (`airbnb.com/rooms/1483618072090950324`), opcionalmente con fechas prellenadas. Pago y garantía via Airbnb. | Quien quiere la protección/reseñas de Airbnb |
| **Reservar directo por WhatsApp** | Abre WhatsApp con un mensaje prellenado (fechas + huéspedes + cotización del cotizador). Se cierra con **adelanto directo** (1 noche, o 50% si es 1 sola noche), igual que el flujo actual del bot. | Quien prefiere pagar directo, a veces mejor precio, trato humano |

- El botón de WhatsApp debe llevar el **mensaje ya armado** con las fechas seleccionadas y el total cotizado, para que el cierre sea inmediato.
- La reserva directa por WhatsApp reusa la lógica de cotización y adelanto del bot (`nohoras-precios.js`): adelanto, aseo $60.000 en sitio, manilla, descuento 7+ noches.
- Beneficio extra de la vía directa: podemos ofrecer un pequeño incentivo (precio directo) sin la comisión de Airbnb.

## Estructura de la página `/santa-marta`

1. **Hero** — video o foto a pantalla completa de la vista al amanecer/atardecer. Titular + CTA "Ver disponibilidad" y "Reservar en Airbnb".
2. **Galería** — grid de fotos y videos (amanecer, atardecer, noche, interior, recorrido). Las fotos ya existen, ver más abajo.
3. **Qué incluye** — características del loft (vista, capacidad, comodidades, ubicación).
4. **Calendario en vivo** — disponibilidad real + precio por temporada de cada noche (ver `06-integracion-airbnb.md`).
5. **Cotizador** (opcional) — el huésped elige fechas y ve el total estimado (reutiliza la lógica de precios documentada abajo).
6. **Prueba social** — reseñas reales de Airbnb (ver sección "Reseñas" abajo).
7. **Ubicación** — mapa de El Rodadero + cercanías (playa, restaurantes).
8. **CTA final** — "Reserva tu fecha" → Airbnb + WhatsApp.
9. **FAQ** — check-in, costos adicionales, mascotas, niños.

## Activos existentes (reutilizar)

- **Fotos del loft:** `ASISTENTE LABORAL/bot/data/nohoras-photos/` (IMG_4500…, pareja_1.jpg, pareja_2.jpg).
- **Originales HEIC:** `ASISTENTE LABORAL/CONTENIDO/nohoras/`.
- **Reels producidos:** `ASISTENTE LABORAL/CONTENIDO/salida/reel_nohoras_*.mp4`.
- Copiar los assets seleccionados a `assets/santa-marta/` de este proyecto al construir.

## Reseñas reales de Airbnb (curadas a mano)

Airbnb **no tiene API de reseñas**. Enfoque elegido: **curación manual**. Felipe entrega 5–8 reseñas reales y se cargan como **HTML nativo** (no capturas) — mejor para SEO, responsive y velocidad.

- Guardar en un archivo de datos (`lib/resenas.ts`) o tabla Supabase, con: nombre del huésped, país/ciudad, fecha, estrellas, texto, (opcional) avatar/inicial.
- Renderizar como tarjetas estilo Airbnb + promedio de estrellas + "Ver todas las reseñas en Airbnb" (enlace al listing).
- Para SEO/IA: agregar **Review / AggregateRating schema** (JSON-LD) con esas reseñas.
- Actualización: manual, periódica (cuando lleguen reseñas nuevas). No depende de scraping.

**Pendiente de Felipe:** enviar 5–8 reseñas reales (texto + nombre + país + fecha + estrellas) o capturas para transcribir.

## Precios por temporada (fuente de verdad)

> **Decisión:** la **tabla propia estacional es la fuente de verdad** de precios (no se hace scraping de Airbnb; Airbnb no expone precios por API/iCal). El pricing de este loft es estacional, no dinámico, así que esta tabla refleja fielmente el precio de Airbnb. Felipe mantiene Airbnb alineado a esta tabla (o viceversa). Si en el futuro se quisiera precio dinámico + reserva directa con pago automático, migrar a un PMS/Channel Manager — ver `06-integracion-airbnb.md`.


Heredado de `ASISTENTE LABORAL/bot/nohoras-precios.js`. Reimplementar en la plataforma (TypeScript) o exponer como tabla en Supabase.

- **Precio base (regular):** $200.000 COP/noche
- **Semana Santa:** $420.000 (varía por año — actualizar anualmente)
- **Vacaciones jun–jul (15 jun – 20 jul):** $350.000
- **Diciembre alta (15–31 dic):** $460.000
- **Año nuevo (1–10 ene):** $460.000
- **Puentes festivos:** $350.000

**Costos adicionales (se pagan en sitio):**
- Aseo y lavandería: $60.000 (a la Señora Deicy al check-in)
- Manilla de seguridad: $35.000/persona (en el lobby al llegar)

**Descuento:** 10% por estadías de 7+ noches.

**Adelanto para asegurar fecha:** 1 noche completa (o 50% si es 1 sola noche).

> El cotizador calcula noche a noche porque un viaje puede cruzar temporadas. La lógica completa está en `nohoras-precios.js` del proyecto actual — cópiala como referencia.

## ⚠️ Nota técnica crítica: Airbnb

Airbnb **no ofrece API pública de precios ni de reservas** para hosts individuales. Lo único disponible es el **iCal export** (URL del calendario), que entrega **solo disponibilidad** (fechas bloqueadas), **no precios**.

Implicaciones:
- ✅ "Calendario en vivo con disponibilidad real" → **sí**, vía iCal.
- ⚠️ "Precios en tiempo real desde Airbnb" → **no es posible**. Los precios salen de **nuestra tabla** (la de arriba). Hay que mantenerla sincronizada manualmente con lo que se publica en Airbnb.
- ✅ "Que la gente reserve directo en Airbnb" → botón que abre `airbnb.com/rooms/1483618072090950324`.

Detalle de implementación en `06-integracion-airbnb.md`.

## Datos del listing

- **Airbnb listing ID:** `1483618072090950324`
- **URL pública:** https://airbnb.com/rooms/1483618072090950324
- **iCal URL:** se obtiene en Airbnb → Calendario → Disponibilidad → Conectar calendarios → Exportar. Guardar en env como `AIRBNB_ICAL_SANTA_MARTA`.
