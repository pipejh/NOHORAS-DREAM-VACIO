import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Santa Marta — Loft El Rodadero",
  description:
    "Despierta con la mejor vista de El Rodadero. Loft turístico premium de Nohoras Dream en Santa Marta.",
};

export default function SantaMartaPage() {
  return (
    <section className="placeholder-page grain">
      <div className="inner">
        <span className="eyebrow">Nohoras Dream · El Rodadero</span>
        <h1>
          Despierta con la mejor vista de <em>El Rodadero.</em>
        </h1>
        <p>
          La vitrina del loft —galería, calendario en vivo y cotizador— llega en
          la Fase 1. Por ahora puedes reservar directamente en Airbnb.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <a
            className="btn btn-gold"
            href="https://airbnb.com/rooms/1483618072090950324"
            target="_blank"
            rel="noopener noreferrer"
          >
            Reservar en Airbnb
          </a>
          <Link className="btn btn-ghost" href="/">
            Volver al inicio
          </Link>
        </div>
      </div>
    </section>
  );
}
