# 08 — Diseño y UX

> El look & feel objetivo está materializado en `/prototipo` (mockup HTML clicable). Este documento define las reglas; el prototipo las muestra.

## Personalidad de marca

**Nohoras Dream** = hospitalidad premium, cálida y costera. La marca paraguas debe sentirse **boutique, confiable y aspiracional** — no corporativa fría, pero tampoco informal.

Reto de diseño: una sola identidad debe servir a tres contextos distintos:
- **Santa Marta:** emocional, visual, seductor (vender una experiencia).
- **Girón:** funcional, claro, tranquilizador (manejar el dinero de la gente).
- **Cúcuta:** expectativa, elegancia, misterio (un "próximamente").

La solución: **misma base visual** (color, tipografía, espaciado), pero **densidad distinta**. Santa Marta respira y usa fotos grandes; Girón es más compacto y orientado a datos pero con la misma calidez.

## Sistema de color

**Paleta derivada del logo oficial** (`assets/brand/logo-nohoras-dream.png`): sol naciente dorado sobre mar azul, fondo crema. Azul marino + dorado sol + crema cálida. *(Reemplaza la paleta teal inicial.)*

```
--nd-navy       #173B5E   /* Azul marino — wordmark "NOHORAS", texto, fondos oscuros */
--nd-navy-deep  #102A45   /* Marino profundo — heros oscuros, degradados */
--nd-blue       #3E7CB1   /* Azul medio de la ola — primario interactivo */
--nd-sky        #7FB5DD   /* Azul cielo — base clara de la ola, detalles */
--nd-gold       #EAA716   /* Dorado sol — ACENTO PRINCIPAL / CTA, "DREAM" */
--nd-gold-soft  #F2C24B   /* Dorado claro — hover, highlights */
--nd-cream      #FBF6E9   /* Crema — fondo base de páginas claras (fondo del logo) */
--nd-sand       #F3EAD6   /* Arena — secciones alternas, cards */
--nd-ink        #16243A   /* Texto principal (tinte marino) sobre claro */
--nd-muted      #6B7280   /* Texto secundario */

/* Estados (Girón) */
--ok            #2E7D5B   /* Al día / aprobado */
--warn          #EAA716   /* Por vencer (dorado de marca) */
--danger        #C0552F   /* Mora / rechazado */
```

Jerarquía de uso:
- **Primario de marca / texto fuerte / fondos hero oscuros:** `--nd-navy` / `--nd-navy-deep`.
- **Acento y CTA principal:** `--nd-gold` (es el color que "salta" — botones de reservar/pagar, highlights).
- **Interacción secundaria / enlaces / olas decorativas:** `--nd-blue` → `--nd-sky` (degradado como en el logo).
- **Fondos claros:** `--nd-cream` base, `--nd-sand` para alternar.
- El **degradado de la ola** (navy → azul → cielo) es un recurso gráfico de marca: úsalo en bordes, separadores o fondos sutiles.

## Tipografía

Derivada del logo, cuyo wordmark son **capitales romanas grabadas tipo Trajan**.

- **Wordmark / eyebrows en mayúscula:** **Cinzel** — réplica libre del estilo Trajan del logo. Para el lockup textual "NOHORAS DREAM" (cuando no se use la imagen) y para etiquetas de sección en caps espaciadas.
- **Display / títulos:** **Cormorant Garamond** — serif de alto contraste, elegante y cálida, armoniza con el wordmark. Títulos grandes y aireados (sobre todo en Santa Marta).
- **Cuerpo / UI:** **Inter** — sans limpia y legible para texto, formularios y tablas (Girón).

```
font-wordmark: 'Cinzel', serif;            /* logo textual + eyebrows en caps */
font-display:  'Cormorant Garamond', serif;/* títulos */
font-body:     'Inter', system-ui, sans-serif;
```

Cargar las tres vía Google Fonts. En Santa Marta domina Cormorant (emocional); en Girón domina Inter (funcional) con Cormorant solo en encabezados.

## Uso del logo

- Archivo: `assets/brand/logo-nohoras-dream.png` (versión sobre crema). Pedir/derivar también una versión sobre fondo oscuro y un isotipo solo (sol+ola) para favicon y espacios reducidos.
- En la barra de navegación: isotipo + wordmark sobre fondo crema/claro; versión clara del wordmark sobre heros marino.
- Espacio de respeto generoso alrededor; no deformar, no recolorear el sol.

## Principios de UX

1. **Mobile-first.** Diseñar primero para 375px. La mayoría entra desde el celular.
2. **Una acción clara por pantalla.** En Santa Marta: reservar. En portal Girón: pagar. No competir CTAs.
3. **Bilingüe sin fricción** (Santa Marta): selector es/en arriba, persistente.
4. **Confianza en Girón:** estados de pago con color + texto (nunca solo color, por accesibilidad). Montos siempre formateados `$1.250.000`. Fechas claras.
5. **Velocidad percibida:** fotos optimizadas (next/image), skeletons en datos que cargan (calendario, pagos).
6. **Accesibilidad:** contraste AA, foco visible, labels en formularios.

## Componentes clave por sección

### Home (portafolio)
- Hero de marca Nohoras Dream.
- 3 cards de propiedad (Santa Marta / Girón / Cúcuta) con foto, nombre, ciudad y CTA contextual ("Ver disponibilidad" / "Ingresar" / "Próximamente").

### Santa Marta
- **Hero** con video/foto full-bleed + CTA dual.
- **Galería** masonry/grid con lightbox.
- **Calendario** mensual: días disponibles con precio, días bloqueados en gris.
- **Cotizador**: selector de fechas + huéspedes → desglose y total.
- **Card de reserva sticky** (desktop): precio desde, CTA Airbnb + WhatsApp.
- **Reseñas** estilo Airbnb.

### Girón — Portal arrendatario
- **Card "Estado del mes"**: grande, claro — al día (verde) / debes $X antes del día Y (ámbar/rojo). CTA "Pagar ahora".
- **Tabla/lista de historial** con badge de estado + descarga de comprobante.
- **Datos del contrato** en card secundaria.

### Girón — Dashboard admin
- **KPIs arriba**: recaudado del mes, % al día, apartamentos ocupados.
- **Tabla de arrendatarios** con filtros (al día / por vencer / en mora) y búsqueda.
- **Detalle** en panel lateral o página: historial + registrar pago manual.
- Tono más denso pero con la misma calidez (no un dashboard genérico gris).

### Cúcuta
- Hero "Próximamente" elegante + formulario de interés minimalista.

## Tono de copy

- **Santa Marta:** sensorial, evocador. "Despierta con la mejor vista de El Rodadero." Bilingüe.
- **Girón:** directo, tranquilizador, humano. "Tu arriendo de junio, al día. Sin filas, sin enredos."
- **Cúcuta:** intrigante. "Algo nuevo está llegando a Cúcuta."

Colombia → **tuteo** ("tú"), nunca "vos".

## Para el prototipo

El prototipo en `/prototipo` debe mostrar, como mínimo, en HTML/CSS standalone y navegable:
1. **Home** con las 3 propiedades.
2. **Santa Marta** (hero + galería + calendario + cotizador + reserva).
3. **Girón portal** (estado del mes + pagar + historial).
4. **Girón admin** (dashboard de pagos).

Es un mockup de look & feel y flujo — datos de ejemplo, no funcional real.
