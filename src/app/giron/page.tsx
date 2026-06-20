import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Girón — Arriendos",
  description:
    "Edificio de apartamentos de Nohoras Dream en Girón, Santander. Portal de arrendatarios: consulta y paga tu arriendo sin enredos.",
};

export default function GironLanding() {
  return (
    <>
      <section className="g-hero">
        <div className="wrap">
          <span className="eyebrow">Nohoras Dream · Girón, Santander</span>
          <h1>
            Tu arriendo, <em>al día y sin enredos.</em>
          </h1>
          <p>
            Un edificio cuidado en Girón, con un portal claro para consultar tu
            arriendo, ver tu historial y mantenerte al día. Sin filas, sin
            papeles sueltos.
          </p>
          <div className="g-hero-cta">
            <Link className="btn btn-gold" href="/giron/login">
              Soy arrendatario · Ingresar
            </Link>
          </div>
        </div>
      </section>

      <section className="block">
        <div className="wrap">
          <div className="g-feature-grid">
            <article className="g-feature">
              <h3>Tu estado del mes, claro</h3>
              <p>
                Ve de un vistazo si estás al día, cuánto debes y hasta qué día
                tienes plazo. Sin sorpresas.
              </p>
            </article>
            <article className="g-feature">
              <h3>Historial a la mano</h3>
              <p>
                Todos tus pagos registrados, con fecha y monto. Tu información,
                siempre disponible.
              </p>
            </article>
            <article className="g-feature">
              <h3>Atención por WhatsApp</h3>
              <p>
                Cualquier duda con tu arriendo la resolvemos por WhatsApp, de
                forma directa y humana.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="g-cta-band">
        <div className="wrap">
          <h2>¿Eres arrendatario del edificio?</h2>
          <p>Ingresa con el usuario y la contraseña que te entregamos.</p>
          <Link className="btn btn-gold" href="/giron/login">
            Ingresar al portal
          </Link>
        </div>
      </section>
    </>
  );
}
