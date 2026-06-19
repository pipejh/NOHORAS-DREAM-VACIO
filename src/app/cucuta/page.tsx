import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Cúcuta — Próximamente",
  description:
    "Algo nuevo está llegando a Cúcuta. Un coliving de Nohoras Dream en etapa temprana.",
};

export default function CucutaPage() {
  return (
    <section className="placeholder-page grain">
      <div className="inner">
        <span className="tag">Próximamente</span>
        <h1 style={{ marginTop: 22 }}>
          Algo nuevo está llegando a <em>Cúcuta.</em>
        </h1>
        <p>
          Un coliving en etapa temprana —comunidad, diseño y experiencia. El
          formulario para dejar tus datos llega en la Fase 5.
        </p>
        <Link className="btn btn-gold" href="/">
          Volver al inicio
        </Link>
      </div>
    </section>
  );
}
