import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Girón — Portal de arriendos",
  description:
    "Plataforma de gestión de arriendos de Nohoras Dream en Girón, Santander. Portal de arrendatarios y panel del administrador.",
};

export default function GironPage() {
  return (
    <section className="placeholder-page grain">
      <div className="inner">
        <span className="eyebrow">Nohoras Dream · Girón, Santander</span>
        <h1>
          Tu arriendo, <em>al día y sin enredos.</em>
        </h1>
        <p>
          El portal del arrendatario y el panel del administrador llegan en la
          Fase 2: consultar tu arriendo, pagar en línea y ver tu historial.
        </p>
        <Link className="btn btn-gold" href="/">
          Volver al inicio
        </Link>
      </div>
    </section>
  );
}
