# 00 — Visión general

## El negocio

**Nohoras Dream** es la marca paraguas de Felipe para sus propiedades inmobiliarias y turísticas en Colombia. Hoy son tres, con modelos de negocio distintos pero una sola identidad de marca.

La plataforma web es el **centro de operación y vitrina** de todas ellas: para huéspedes (Santa Marta), para arrendatarios y administrador (Girón), y para interesados (Cúcuta).

## Por qué una sola plataforma

- **Una marca, una experiencia.** El visitante entiende que Nohoras Dream es un portafolio serio, no un apartamento suelto.
- **Reutilización.** El mismo sistema de diseño, auth, base de datos y componentes sirven para las tres propiedades.
- **Escalabilidad.** Agregar una cuarta propiedad mañana = agregar una sección, no construir un sitio nuevo.

## Las tres propiedades en detalle

### 🌅 Nohoras Dream Santa Marta — *alquiler turístico*
Loft premium en El Rodadero con la mejor vista del sector. Modelo: alquiler por noches vía Airbnb + WhatsApp. La sección web es una **vitrina de conversión**: enamora con fotos/videos, muestra disponibilidad real y empuja a reservar en Airbnb.
→ Detalle en `01-propiedad-santa-marta.md`

### 🏢 Nohoras Dream Girón — *arriendo residencial*
Edificio de apartamentos pequeños en Girón, Santander. Modelo: arriendo mensual a largo plazo. La sección web es una **plataforma de gestión** de dos caras:
- **Administrador:** controla pagos, mora, contratos y ocupación.
- **Arrendatarios:** ven y pagan su arriendo, reciben notificaciones, consultan su historial.
→ Detalle en `02-propiedad-giron.md`

### 🏗️ Nohoras Dream Cúcuta — *coliving (lejano)*
Coliving en Cúcuta. Aún se está **pagando el lote** — proyecto muy distante, sin fecha. Por ahora solo una landing de "próximamente" para captar interesados. **Pueden entrar otros proyectos antes que Cúcuta** → el portafolio debe ser extensible (ver nota abajo).
→ Detalle en `03-propiedad-cucuta.md`

## Arquitectura de información del sitio

```
nohorasdream.co (home / portafolio de marca)
│
├── /santa-marta        → vitrina del loft + calendario + reservar
│   └── /santa-marta/galeria
│
├── /giron              → landing pública del edificio (info + "soy arrendatario")
│   ├── /giron/login
│   ├── /giron/portal           (arrendatario: mi arriendo, pagar, historial)
│   └── /giron/admin            (administrador: dashboard de pagos)
│
├── /cucuta             → "próximamente" + captación de interesados
│
└── /                   → home: hero de marca + las 3 propiedades como cards
```

## Usuarios de la plataforma

| Usuario | Propiedad | Qué hace |
|---|---|---|
| Huésped / turista | Santa Marta | Mira fotos, consulta fechas, reserva en Airbnb o escribe por WhatsApp |
| Arrendatario | Girón | Inicia sesión, ve su arriendo, paga en línea, descarga comprobantes |
| Administrador | Girón | Gestiona arrendatarios, registra/concilia pagos, ve mora y reportes |
| Felipe (owner) | Todas | Acceso total, ve métricas de todo el portafolio |
| Interesado | Cúcuta | Deja sus datos para el lanzamiento |

## Prioridad de construcción

1. **Home + Santa Marta** (rápido, alto impacto, ya operando).
2. **Girón portal + admin + pagos** (núcleo del valor nuevo, más complejo).
3. **Cúcuta** (landing simple, al final).

Ver fases detalladas en `09-roadmap.md`.

## Identidad de marca (resumen)

Premium, aspiracional, cálido, costero. Bilingüe en Santa Marta. El detalle del sistema de diseño (colores, tipografía, componentes) está en `08-diseno-ux.md` y materializado en `/prototipo`.
