import type { Metadata } from "next";
import { SantaMarta } from "@/components/santa-marta/SantaMarta";
import { RESENAS, RATING_PROMEDIO, RESENAS_COUNT } from "@/lib/resenas";
import { dict } from "@/lib/i18n/santa-marta";

const SITE = "https://nohorasdream.co";

export const metadata: Metadata = {
  title: "Loft El Rodadero, Santa Marta",
  description:
    "Despierta con la mejor vista de El Rodadero. Loft turístico premium de Nohoras Dream: vista al mar, A/C, cocina equipada y check-in flexible. Reserva en Airbnb o directo por WhatsApp.",
  alternates: { canonical: `${SITE}/santa-marta` },
  openGraph: {
    title: "Nohoras Dream Santa Marta — Loft El Rodadero",
    description:
      "Un loft exclusivo con la mejor vista de El Rodadero. Reserva en Airbnb o directo por WhatsApp.",
    url: `${SITE}/santa-marta`,
    type: "website",
    locale: "es_CO",
    images: [{ url: `${SITE}/santa-marta/pareja_4.jpg`, width: 1200, height: 800 }],
  },
};

function structuredData() {
  const lodging = {
    "@context": "https://schema.org",
    "@type": "LodgingBusiness",
    name: "Nohoras Dream Santa Marta — Loft El Rodadero",
    description:
      "Loft turístico premium en El Rodadero, Santa Marta, con la mejor vista del sector. Capacidad: 2 adultos + 2 niños.",
    url: `${SITE}/santa-marta`,
    image: [
      `${SITE}/santa-marta/pareja_4.jpg`,
      `${SITE}/santa-marta/img_4500.jpg`,
      `${SITE}/santa-marta/img_4506.jpg`,
    ],
    address: {
      "@type": "PostalAddress",
      streetAddress: "Edificio El Peñón del Rodadero, El Rodadero",
      addressLocality: "Santa Marta",
      addressRegion: "Magdalena",
      addressCountry: "CO",
    },
    priceRange: "$$",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: RATING_PROMEDIO.toFixed(1),
      reviewCount: RESENAS_COUNT,
      bestRating: "5",
    },
    review: RESENAS.map((r) => ({
      "@type": "Review",
      author: { "@type": "Person", name: r.nombre },
      reviewRating: { "@type": "Rating", ratingValue: r.estrellas, bestRating: 5 },
      reviewBody: r.texto,
    })),
  };

  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: (["1", "2", "3", "4"] as const).map((n) => ({
      "@type": "Question",
      name: dict.es[`sm_faq_q${n}` as keyof typeof dict.es],
      acceptedAnswer: {
        "@type": "Answer",
        text: dict.es[`sm_faq_a${n}` as keyof typeof dict.es],
      },
    })),
  };

  return [lodging, faq];
}

export default function SantaMartaPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData()) }}
      />
      <SantaMarta />
    </>
  );
}
