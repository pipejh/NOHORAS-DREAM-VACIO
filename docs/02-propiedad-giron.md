# 02 — Nohoras Dream Girón (gestión de arriendos)

## Resumen

Edificio de apartamentos pequeños en **Girón, Santander**, en modelo de **arriendo residencial mensual**. La sección web es una **plataforma de gestión de pagos** con dos roles bien diferenciados: **administrador** y **arrendatario**.

Esta es la parte más compleja de la plataforma: requiere autenticación por rol, manejo de datos financieros, pagos en línea y notificaciones. Construir por fases (ver `09-roadmap.md`).

## Problema que resuelve

Hoy el control de arriendos es manual (WhatsApp, memoria, recibos sueltos). Esto causa:
- Pagos sin registrar, mora difícil de rastrear.
- Arrendatarios sin claridad de cuándo y cuánto deben pagar.
- Sin comprobantes formales ni historial.

La plataforma centraliza todo: cada arrendatario tiene su cuenta, paga en línea, recibe recordatorios automáticos, y el administrador ve el estado del edificio de un vistazo.

## Los dos roles

### 👤 Arrendatario — Portal (`/giron/portal`)

Qué ve y hace al iniciar sesión:

- **Mi arriendo:** apartamento, valor mensual, día de pago, estado del contrato.
- **Estado del mes:** ¿al día o en mora? cuánto debo, fecha límite.
- **Pagar ahora:** botón que abre el flujo de pago Wompi (PSE, tarjeta, Nequi). Ver `07-integracion-pagos-wompi.md`.
- **Historial de pagos:** lista de pagos con fecha, monto, método y **comprobante descargable (PDF)**.
- **Mis datos / contrato:** información del contrato y datos de contacto.
- **Notificaciones:** recordatorio de cobro, confirmación de pago, aviso de mora.

### 🛠️ Administrador — Dashboard (`/giron/admin`)

Qué ve y hace:

- **Resumen del edificio:** total recaudado del mes, % al día vs en mora, apartamentos ocupados/vacíos.
- **Lista de arrendatarios:** nombre, apartamento, valor, día de pago, estado (al día / por vencer / en mora), última fecha de pago.
- **Detalle de arrendatario:** contrato, historial completo de pagos, notas.
- **Registrar pago manual:** para pagos en efectivo o transferencia fuera de la plataforma (conciliación).
- **Gestión de contratos:** crear/editar arrendatario, asignar apartamento, fijar valor y día de pago, activar/finalizar contrato.
- **Reportes:** recaudo por mes, mora acumulada, exportar a CSV.
- **Disparar recordatorios:** manual o automático.

## Notificaciones (qué se envía y cuándo)

| Evento | Cuándo | Canal |
|---|---|---|
| Recordatorio de cobro | X días antes del día de pago (config.) | WhatsApp + email |
| Cobro vencido (mora) | El día después de la fecha límite | WhatsApp + email |
| Confirmación de pago | Inmediatamente al confirmar Wompi (webhook) | WhatsApp + email |
| Comprobante | Junto a la confirmación (PDF adjunto/enlace) | email |

Canales: **WhatsApp** (Meta Cloud API) y **email** (Resend). Ver `04-arquitectura-tecnica.md`. Los recordatorios programados se ejecutan con un cron (Vercel Cron o Supabase scheduled function).

## Flujo de pago (resumen)

1. Arrendatario entra al portal → "Pagar ahora".
2. Se crea una **transacción** en estado `pendiente` y se genera el checkout de Wompi.
3. Arrendatario paga (PSE/tarjeta/Nequi).
4. Wompi notifica vía **webhook** → confirmamos el estado real (nunca confiar solo en el redirect del frontend).
5. Marcamos el pago como `aprobado`, generamos comprobante PDF y disparamos la notificación de confirmación.

Detalle completo y manejo de estados en `07-integracion-pagos-wompi.md`.

## Reglas de negocio (a confirmar con Felipe al construir)

- **Periodicidad:** arriendo mensual. Cada arrendatario tiene un `dia_de_pago` (1–28).
- **Cálculo de mora:** definir si hay interés/recargo por mora o solo marca de estado. *(Pendiente: confirmar política.)*
- **Pagos parciales:** definir si se permiten. *(Pendiente.)*
- **Servicios incluidos:** definir si el valor del arriendo incluye administración/servicios o se cobran aparte. *(Pendiente.)*
- **Depósito/garantía:** definir si se registra en la plataforma. *(Pendiente.)*

> Estas reglas no bloquean el diseño ni la arquitectura base. Constrúyela flexible (config. por arrendatario) y confirma los detalles con Felipe antes de la fase de pagos.

## Seguridad (no negociable)

- Auth por rol con Supabase Auth. Roles: `admin`, `arrendatario`, `owner`.
- **Row Level Security:** un arrendatario solo puede leer/escribir SUS propios datos (su contrato, sus pagos). Ver políticas en `05-data-model.md`.
- Datos financieros y personales: tratar con cuidado (es información sensible de terceros).
- Comprobantes y documentos en Supabase Storage con acceso restringido por usuario.

## Página pública `/giron`

Antes del login hay una landing pública del edificio:
- Info del edificio (ubicación, fotos, tipo de apartamentos).
- Sección "¿Eres arrendatario?" → botón a `/giron/login`.
- (Opcional) "¿Buscas arriendo?" → formulario de interés si hay disponibilidad.

## Datos pendientes de Felipe (para construir Girón)

- Número de apartamentos del edificio y valores de arriendo.
- Lista inicial de arrendatarios (nombre, apartamento, valor, día de pago, contacto).
- Política de mora y servicios (ver reglas de negocio arriba).
- Cuenta Wompi (comercio) para recibir los pagos.
