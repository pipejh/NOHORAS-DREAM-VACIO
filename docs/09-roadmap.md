# 09 — Roadmap de desarrollo

Construir por fases. Cada fase entrega algo usable. Empezar por lo simple y ya operativo (Santa Marta), terminar por lo complejo (pagos de Girón).

## Fase 0 — Setup (½ día)
- [ ] Crear proyecto Next.js + TypeScript + Tailwind.
- [ ] Crear proyecto Supabase, conectar, aplicar schema de `docs/05`.
- [ ] Configurar sistema de diseño (tokens de color/tipografía de `docs/08`) en Tailwind.
- [ ] Layout raíz + navegación + deploy inicial en Vercel.

## Fase 1 — Home + Santa Marta (vitrina) ⭐ *empezar aquí*
- [ ] Home con las 3 cards de propiedad.
- [ ] Página Santa Marta: hero, galería (copiar fotos de `ASISTENTE LABORAL/bot/data/nohoras-photos`), secciones de contenido.
- [ ] Portar `lib/precios.ts` desde `nohoras-precios.js`.
- [ ] Integración iCal + endpoint de disponibilidad (`docs/06`).
- [ ] Calendario en vivo + cotizador.
- [ ] CTAs a Airbnb y WhatsApp. Bilingüe es/en. SEO on-page.
- **Entrega:** vitrina de Santa Marta lista para recibir tráfico. *Alto valor, bajo riesgo.*

## Fase 2 — Girón: base + portal arrendatario (lectura)
- [ ] Auth Supabase + roles + middleware de rutas.
- [ ] Landing pública `/giron` + login.
- [ ] Portal: "Mi arriendo", estado del mes (calculado), historial (solo lectura).
- [ ] RLS verificada (un arrendatario no ve datos de otro).
- [ ] Dashboard admin: KPIs + tabla de arrendatarios + detalle + registrar pago manual.
- **Entrega:** el administrador ya puede gestionar y los arrendatarios ya consultan, aunque el pago sea aún manual.

## Fase 3 — Girón: pagos en línea (Wompi)
- [ ] Integración Wompi sandbox (`docs/07`): crear transacción + checkout.
- [ ] Webhook validado + actualización de estado idempotente.
- [ ] Generación de comprobante PDF en Storage.
- [ ] Paso a producción Wompi.
- **Entrega:** arrendatarios pagan en línea, conciliación automática.

## Fase 4 — Girón: notificaciones
- [ ] Integrar WhatsApp (Meta Cloud API) + email (Resend).
- [ ] Confirmación de pago (al aprobar webhook).
- [ ] Vercel Cron: recordatorios de cobro y avisos de mora.
- **Entrega:** ciclo de cobro automatizado.

## Fase 5 — Cúcuta + pulido
- [ ] Landing "próximamente" + formulario de leads.
- [ ] Reportes/export del admin (CSV).
- [ ] Pulido de UX, performance, accesibilidad, analítica.

## Dependencias / insumos a pedir a Felipe
- **Fase 1:** URL iCal de Airbnb; selección final de fotos/videos.
- **Fase 2:** lista de apartamentos y arrendatarios (nombre, apto, valor, día de pago, contacto); política de mora/servicios.
- **Fase 3:** cuenta de comercio Wompi + llaves.
- **Fase 4:** WhatsApp Business API (o reutilizar la del bot actual) + dominio para email.

## Sugerencia de orden mental
> Santa Marta **vende** (trae plata) → constrúyela primero.
> Girón **organiza** (ahorra dolores de cabeza) → es el corazón del proyecto, hazlo bien y por capas.
> Cúcuta **espera** → mínimo esfuerzo hasta que el proyecto sea real.
