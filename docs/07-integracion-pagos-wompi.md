# 07 — Integración de pagos Wompi (Girón)

Wompi es la pasarela de pagos colombiana (de Bancolombia). Soporta **PSE, tarjetas y Nequi** — los métodos que usan los arrendatarios. Este documento describe el flujo de cobro de arriendos.

## Conceptos Wompi

- **Llaves:** `pública` (frontend) y `privada` (backend). Hay ambiente de **sandbox** y **producción**.
- **Transacción:** cada intento de pago. Estados: `PENDING`, `APPROVED`, `DECLINED`, `VOIDED`, `ERROR`.
- **Webhook (Eventos):** Wompi notifica el resultado real del pago a tu backend. **Esta es la fuente de verdad**, no el redirect del usuario.
- **Firma de integridad:** al crear la transacción se firma con `WOMPI_INTEGRITY_SECRET`. Los webhooks se validan con `WOMPI_EVENTS_SECRET`.

## Flujo de cobro de arriendo

```
1. Arrendatario (portal) → "Pagar arriendo de junio"
2. Backend crea giron_payments (estado='pendiente', periodo='2026-06')
   y genera la referencia de pago + firma de integridad.
3. Se abre el Checkout de Wompi (Widget o redirect) con:
   - monto (valor_mensual en centavos),
   - referencia única (= giron_payments.id),
   - firma de integridad.
4. Arrendatario paga (PSE/tarjeta/Nequi) en Wompi.
5. Wompi → POST a /api/wompi/webhook con el resultado.
6. Backend valida la firma del evento, busca el pago por referencia,
   actualiza estado ('aprobado'/'rechazado'), guarda wompi_tx_id y pagado_at.
7. Si aprobado: genera comprobante PDF (Storage) + dispara notificación de confirmación.
8. El portal refleja el nuevo estado.
```

## Monto en centavos

Wompi maneja montos en **centavos**. Un arriendo de $1.250.000 COP = `125000000`. Cuidado con esto en todo el flujo.

## Webhook (el punto crítico)

```ts
// app/api/wompi/webhook/route.ts
import crypto from 'crypto';
import { createClient } from '@/lib/supabase/server'; // usa service_role

export async function POST(req: Request) {
  const body = await req.json();
  const { data, signature, timestamp } = body;

  // 1. Validar firma del evento
  const props = signature.properties
    .map((p: string) => p.split('.').reduce((o: any, k: string) => o[k], { data }))
    .join('');
  const concat = props + timestamp + process.env.WOMPI_EVENTS_SECRET;
  const checksum = crypto.createHash('sha256').update(concat).digest('hex');
  if (checksum !== signature.checksum) {
    return new Response('invalid signature', { status: 401 });
  }

  // 2. Procesar la transacción
  const tx = data.transaction;
  const supabase = createClient();
  const estado =
    tx.status === 'APPROVED' ? 'aprobado'
    : tx.status === 'DECLINED' ? 'rechazado'
    : 'pendiente';

  await supabase.from('giron_payments')
    .update({
      estado,
      wompi_tx_id: tx.id,
      metodo: (tx.payment_method_type || '').toLowerCase(),
      pagado_at: estado === 'aprobado' ? new Date().toISOString() : null,
    })
    .eq('id', tx.reference); // reference = giron_payments.id

  // 3. Si aprobado: generar comprobante + notificar (idempotente)
  // ... generar PDF, subir a Storage, enviar WhatsApp/email

  return new Response('ok', { status: 200 });
}
```

## Reglas de seguridad

- **Nunca** marcar un pago como aprobado desde el frontend o el redirect. Solo el webhook validado.
- **Idempotencia:** Wompi puede reenviar el webhook. No dupliques comprobantes ni notificaciones (revisa si el pago ya estaba `aprobado`).
- El webhook corre con `service_role` (bypassa RLS) — correcto porque es server-side.
- Validar siempre la firma antes de tocar la base de datos.

## Comprobante PDF

Al aprobar: generar PDF con datos del pago (arrendatario, apartamento, periodo, monto, método, fecha, n.º de transacción Wompi), subir a Storage (`comprobantes/{lease_id}/{periodo}.pdf`), guardar URL en `giron_payments.comprobante_url`.

## Pendientes a confirmar con Felipe

- Cuenta de comercio Wompi (registro + llaves).
- ¿Quién asume la comisión de Wompi? (afecta si se cobra al arrendatario un recargo o lo absorbe Nohoras Dream).
- Política de mora: ¿recargo automático al monto si se paga tarde?

## Testing

Usar el **sandbox de Wompi** con sus tarjetas/usuarios de prueba antes de pasar a producción. Probar los 4 estados (aprobado, rechazado, pendiente, error) y el reenvío de webhook.
