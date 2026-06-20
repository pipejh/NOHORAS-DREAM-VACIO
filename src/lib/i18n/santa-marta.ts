/**
 * Diccionario bilingüe (es/en) de la vitrina de Santa Marta.
 * Santa Marta es la única sección bilingüe (audiencia turística extranjera).
 * El español es el idioma por defecto (SSR) → es el que se indexa.
 */
export type Lang = "es" | "en";

export const dict = {
  es: {
    // Hero
    sm_eyebrow: "Nohoras Dream · El Rodadero",
    sm_title_a: "Despierta con la mejor vista de ",
    sm_title_em: "El Rodadero.",
    sm_sub:
      "Un loft exclusivo, solo para ti. Atardeceres dorados, brisa del Caribe y todo el confort de un espacio pensado al detalle.",
    sm_cta_air: "Reservar en Airbnb",
    sm_cta_wa: "Reservar directo por WhatsApp",
    sm_micro_b: "¿Prefieres trato directo?",
    sm_micro:
      " Escríbenos por WhatsApp y coordinamos tu reserva con un adelanto — a veces con mejor precio que en Airbnb.",
    sm_cta_avail: "Ver disponibilidad",
    sm_m1_b: "2",
    sm_m1: " adultos + 2 niños",
    sm_m2_b: "Vista",
    sm_m2: " al mar",
    sm_m3_b: "Check-in",
    sm_m3: " autónomo",
    sm_m4_b: "5,0★",
    sm_m4: " · reseñas verificadas",

    // Galería
    sm_gal_e: "Galería",
    sm_gal_t: "La vista que lo dice todo",
    sm_gal_p:
      "Amaneceres, atardeceres y un loft pensado para vivir el Caribe con calma.",

    // Pull quote
    sm_pq:
      "Tremenda vista. Es maravilloso, muy fresco, corre el viento y el loft está pensado al detalle.",
    sm_pq_cite: "Reseña real · Airbnb",

    // Qué incluye
    sm_inc_e: "Qué incluye",
    sm_inc_t: "Todo listo para descansar",
    sm_f1t: "Vista panorámica",
    sm_f1p: "Balcón frente a la bahía de El Rodadero, la mejor del sector.",
    sm_f2t: "Aire acondicionado",
    sm_f2p: "Clima fresco en cada ambiente, ideal para el calor costero.",
    sm_f3t: "Cocina equipada",
    sm_f3p: "Todo para preparar tus comidas y compartir en familia.",
    sm_f4t: "WiFi de alta velocidad",
    sm_f4p: "Perfecto para teletrabajo con vista al mar.",
    sm_f5t: "A pasos de la playa",
    sm_f5p: "Restaurantes, playa y vida nocturna a pocos minutos.",
    sm_f6t: "Check-in flexible",
    sm_f6p: "Llegada autónoma y manilla de seguridad al ingresar.",

    // Calendario + cotizador
    sm_cal_e: "Disponibilidad y precios",
    sm_cal_t: "Elige tus fechas",
    sm_cal_p:
      "Disponibilidad sincronizada con Airbnb. Toca una fecha de entrada y otra de salida para cotizar.",
    sm_legend_avail: "Disponible",
    sm_legend_high: "Temporada alta",
    sm_legend_blocked: "No disponible",
    sm_legend_sel: "Tu selección",
    sm_cal_warn:
      "No pudimos sincronizar el calendario de Airbnb en este momento. La disponibilidad mostrada está sujeta a confirmación — escríbenos por WhatsApp.",
    sm_pernight: "/ noche · desde",
    sm_rating: "reseñas verificadas",
    sm_checkin: "Entrada",
    sm_checkout: "Salida",
    sm_pick: "Elige fecha",
    sm_guests: "Huéspedes",
    sm_g1: "2 adultos",
    sm_g2: "2 adultos · 1 niño",
    sm_g3: "2 adultos · 2 niños",
    sm_bd_nights: "noche(s)",
    sm_bd_discount: "Descuento estadía larga (10%)",
    sm_bd_total: "Total alojamiento",
    sm_bd_extra: "Costos en sitio: aseo y manilla por persona.",
    sm_bd_deposit: "Adelanto para asegurar la fecha",
    sm_bd_pick: "Selecciona entrada y salida en el calendario para ver tu cotización.",
    sm_bd_invalid: "Esas fechas incluyen noches no disponibles. Prueba otro rango.",
    sm_cta_air2: "Reservar en Airbnb",
    sm_cta_wa2: "Reservar directo por WhatsApp",
    sm_micro2_b: "¿Prefieres trato directo?",
    sm_micro2:
      " Por WhatsApp coordinamos con un adelanto — a veces con mejor precio que en Airbnb. Tus fechas y total van en el mensaje.",
    sm_note:
      "No se cobra aún. El pago se realiza en Airbnb o, si reservas directo, con un adelanto por WhatsApp.",
    sm_wa_default:
      "Hola, me interesa el loft de Nohoras Dream en El Rodadero. ¿Está disponible?",

    // Reseñas
    sm_rev_e: "Reseñas",
    sm_rev_t: "Lo que dicen los huéspedes",
    sm_rev_count: "· reseñas reales verificadas en Airbnb",
    sm_rev_all: "Ver todas las reseñas en Airbnb",

    // Ubicación
    sm_loc_e: "Ubicación",
    sm_loc_t: "En el corazón de El Rodadero",
    sm_loc_p:
      "A pasos de la playa, rodeado de restaurantes y con la mejor vista de la bahía.",
    sm_loc_1: "Edificio El Peñón del Rodadero, frente a la bahía — Santa Marta.",
    sm_loc_2: "Playa, restaurantes y vida nocturna a pocos minutos a pie.",
    sm_loc_3: "A ~15 min del aeropuerto Simón Bolívar.",

    // FAQ
    sm_faq_e: "Preguntas frecuentes",
    sm_faq_t: "Antes de reservar",
    sm_faq_q1: "¿Cómo es el check-in?",
    sm_faq_a1:
      "Check-in autónomo y flexible. Coordinamos la llegada por WhatsApp; al ingresar se entrega la manilla de seguridad en el lobby.",
    sm_faq_q2: "¿Qué costos se pagan en sitio?",
    sm_faq_a2:
      "Aseo y lavandería ($60.000, a la Señora Deicy al check-in) y manilla de seguridad ($35.000 por persona, en el lobby).",
    sm_faq_q3: "¿Cuál es la capacidad?",
    sm_faq_a3: "2 adultos y hasta 2 niños. Es un loft pensado para parejas y familias pequeñas.",
    sm_faq_q4: "¿Puedo reservar sin pasar por Airbnb?",
    sm_faq_a4:
      "Sí. Por WhatsApp coordinamos la reserva directa con un adelanto (1 noche, o 50% si es una sola noche) — a veces con mejor precio.",

    // CTA final
    sm_final_e: "Tu escapada al Caribe",
    sm_final_t_a: "Reserva tu fecha en ",
    sm_final_t_em: "El Rodadero.",
    sm_final_p:
      "Elige las dos vías: la protección de Airbnb o el trato directo por WhatsApp. Como prefieras.",
  },
  en: {
    sm_eyebrow: "Nohoras Dream · El Rodadero",
    sm_title_a: "Wake up to the best view of ",
    sm_title_em: "El Rodadero.",
    sm_sub:
      "An exclusive loft, just for you. Golden sunsets, Caribbean breeze and all the comfort of a space designed down to the detail.",
    sm_cta_air: "Book on Airbnb",
    sm_cta_wa: "Book direct via WhatsApp",
    sm_micro_b: "Prefer to deal directly?",
    sm_micro:
      " Message us on WhatsApp and we'll arrange your booking with a deposit — sometimes at a better price than Airbnb.",
    sm_cta_avail: "Check availability",
    sm_m1_b: "2",
    sm_m1: " adults + 2 kids",
    sm_m2_b: "Sea",
    sm_m2: " view",
    sm_m3_b: "Self",
    sm_m3: " check-in",
    sm_m4_b: "5.0★",
    sm_m4: " · verified reviews",

    sm_gal_e: "Gallery",
    sm_gal_t: "The view says it all",
    sm_gal_p: "Sunrises, sunsets and a loft made to enjoy the Caribbean at your own pace.",

    sm_pq:
      "Incredible view. It's wonderful, very fresh, the breeze flows and the loft is thought out to the detail.",
    sm_pq_cite: "Real review · Airbnb",

    sm_inc_e: "What's included",
    sm_inc_t: "Everything ready to rest",
    sm_f1t: "Panoramic view",
    sm_f1p: "Balcony facing El Rodadero bay — the best in the area.",
    sm_f2t: "Air conditioning",
    sm_f2p: "Cool climate in every room, ideal for the coastal heat.",
    sm_f3t: "Equipped kitchen",
    sm_f3p: "Everything to cook your meals and share with family.",
    sm_f4t: "High-speed WiFi",
    sm_f4p: "Perfect for remote work with a sea view.",
    sm_f5t: "Steps from the beach",
    sm_f5p: "Restaurants, beach and nightlife a few minutes away.",
    sm_f6t: "Flexible check-in",
    sm_f6p: "Self check-in and a security wristband on arrival.",

    sm_cal_e: "Availability & prices",
    sm_cal_t: "Choose your dates",
    sm_cal_p:
      "Availability synced with Airbnb. Tap a check-in and a check-out date to get a quote.",
    sm_legend_avail: "Available",
    sm_legend_high: "High season",
    sm_legend_blocked: "Unavailable",
    sm_legend_sel: "Your selection",
    sm_cal_warn:
      "We couldn't sync Airbnb's calendar right now. Availability shown is subject to confirmation — message us on WhatsApp.",
    sm_pernight: "/ night · from",
    sm_rating: "verified reviews",
    sm_checkin: "Check-in",
    sm_checkout: "Check-out",
    sm_pick: "Pick a date",
    sm_guests: "Guests",
    sm_g1: "2 adults",
    sm_g2: "2 adults · 1 child",
    sm_g3: "2 adults · 2 children",
    sm_bd_nights: "night(s)",
    sm_bd_discount: "Long-stay discount (10%)",
    sm_bd_total: "Accommodation total",
    sm_bd_extra: "On-site costs: cleaning and wristband per person.",
    sm_bd_deposit: "Deposit to confirm your dates",
    sm_bd_pick: "Select check-in and check-out on the calendar to see your quote.",
    sm_bd_invalid: "Those dates include unavailable nights. Try another range.",
    sm_cta_air2: "Book on Airbnb",
    sm_cta_wa2: "Book direct via WhatsApp",
    sm_micro2_b: "Prefer to deal directly?",
    sm_micro2:
      " On WhatsApp we arrange a deposit — sometimes at a better price than Airbnb. Your dates and total go in the message.",
    sm_note:
      "No charge yet. Payment is made on Airbnb or, if you book direct, with a deposit via WhatsApp.",
    sm_wa_default:
      "Hi, I'm interested in the Nohoras Dream loft in El Rodadero. Is it available?",

    sm_rev_e: "Reviews",
    sm_rev_t: "What guests say",
    sm_rev_count: "· real reviews verified on Airbnb",
    sm_rev_all: "See all reviews on Airbnb",

    sm_loc_e: "Location",
    sm_loc_t: "In the heart of El Rodadero",
    sm_loc_p:
      "Steps from the beach, surrounded by restaurants and with the best view of the bay.",
    sm_loc_1: "El Peñón del Rodadero building, facing the bay — Santa Marta.",
    sm_loc_2: "Beach, restaurants and nightlife a few minutes' walk away.",
    sm_loc_3: "~15 min from Simón Bolívar airport.",

    sm_faq_e: "Frequently asked",
    sm_faq_t: "Before you book",
    sm_faq_q1: "How does check-in work?",
    sm_faq_a1:
      "Self check-in, flexible. We coordinate arrival via WhatsApp; on arrival you get the security wristband at the lobby.",
    sm_faq_q2: "What costs are paid on-site?",
    sm_faq_a2:
      "Cleaning and laundry ($60,000 COP, paid to Señora Deicy at check-in) and a security wristband ($35,000 COP per person, at the lobby).",
    sm_faq_q3: "What's the capacity?",
    sm_faq_a3: "2 adults and up to 2 children. A loft designed for couples and small families.",
    sm_faq_q4: "Can I book without going through Airbnb?",
    sm_faq_a4:
      "Yes. On WhatsApp we arrange a direct booking with a deposit (1 night, or 50% for a single night) — sometimes at a better price.",

    sm_final_e: "Your Caribbean getaway",
    sm_final_t_a: "Book your dates in ",
    sm_final_t_em: "El Rodadero.",
    sm_final_p:
      "Choose either way: the protection of Airbnb or the direct deal via WhatsApp. Whatever you prefer.",
  },
} as const;

export type DictKey = keyof (typeof dict)["es"];
