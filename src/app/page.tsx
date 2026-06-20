import Image from "next/image";
import Link from "next/link";

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M5 12h14M13 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function HomePage() {
  return (
    <>
      {/* ===== Hero de marca ===== */}
      <section className="home-hero grain">
        <picture>
          <source media="(max-width: 768px)" srcSet="/santa-marta/hero-mobile.jpg" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/santa-marta/hero-desktop.jpg" alt="Atardecer sobre el Caribe colombiano" fetchPriority="high" />
        </picture>
        <div className="wrap">
          <span className="eyebrow">Propiedades en Colombia</span>
          <h1>
            Lugares con alma,
            <br />
            <em>cuidados como un sueño.</em>
          </h1>
          <p>
            Un portafolio boutique de espacios para descansar, vivir y soñar —
            desde el Caribe de Santa Marta hasta el corazón de Santander.
          </p>
        </div>
      </section>

      {/* ===== Portafolio editorial ===== */}
      <section className="props">
        <div className="wrap">
          <div className="editorial">
            {/* 01 — Santa Marta */}
            <article className="ed-row">
              <Link href="/santa-marta" className="ed-media" aria-label="Santa Marta">
                <Image
                  src="/santa-marta/pareja_4.jpg"
                  alt="Loft con vista a El Rodadero"
                  fill
                  sizes="(max-width: 900px) 100vw, 50vw"
                  style={{ objectFit: "cover" }}
                  priority
                />
                <span className="ed-cap">El Rodadero · Santa Marta</span>
              </Link>
              <div className="ed-body">
                <span className="ed-idx">01 — Santa Marta</span>
                <span className="prop-kind">Alquiler turístico</span>
                <h3>Loft El Rodadero</h3>
                <p>
                  La mejor vista del sector. Un loft exclusivo para parejas y
                  familias pequeñas, despertando frente al Caribe.
                </p>
                <Link href="/santa-marta" className="ed-link underline-draw">
                  Ver disponibilidad <ArrowIcon />
                </Link>
              </div>
            </article>

            <hr className="ed-divider" />

            {/* 02 — Girón */}
            <article className="ed-row flip">
              <Link href="/giron" className="ed-media" aria-label="Girón">
                <Image
                  src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1100&q=72"
                  alt="Edificio de apartamentos"
                  fill
                  sizes="(max-width: 900px) 100vw, 50vw"
                  style={{ objectFit: "cover" }}
                />
                <span className="ed-cap">Girón · Santander</span>
              </Link>
              <div className="ed-body">
                <span className="ed-idx">02 — Girón</span>
                <span className="prop-kind">Arriendo residencial</span>
                <h3>Edificio Girón</h3>
                <p>
                  Apartamentos en arriendo con un portal claro para pagar en
                  línea y un panel de gestión sin enredos.
                </p>
                <Link href="/giron" className="ed-link underline-draw">
                  Ingresar al portal <ArrowIcon />
                </Link>
              </div>
            </article>

            <hr className="ed-divider" />

            {/* 03 — Cúcuta */}
            <article className="ed-row">
              <Link href="/cucuta" className="ed-media soon" aria-label="Cúcuta">
                <span className="soon-mark">Próximamente</span>
                <span className="ed-cap">Cúcuta · Norte de Santander</span>
              </Link>
              <div className="ed-body">
                <span className="ed-idx">03 — Cúcuta</span>
                <span className="prop-kind">Coliving · En etapa temprana</span>
                <h3>Nohoras Dream Cúcuta</h3>
                <p>
                  Un coliving que toma forma — comunidad, diseño y experiencia.
                  Déjanos tus datos y serás de los primeros en saberlo.
                </p>
                <Link href="/cucuta" className="ed-link underline-draw">
                  Quiero enterarme <ArrowIcon />
                </Link>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* ===== Franja de métricas ===== */}
      <section className="home-strip grain">
        <div className="wrap">
          <div className="strip-head">
            <span className="eyebrow">Una sola casa, tres mundos</span>
            <h2>Hospitalidad cuidada, de extremo a extremo.</h2>
          </div>
          <div className="strip-grid">
            <div>
              <div className="num">3</div>
              <div className="lbl">propiedades activas</div>
            </div>
            <div>
              <div className="num">5,0★</div>
              <div className="lbl">calificación en Airbnb</div>
            </div>
            <div>
              <div className="num">100%</div>
              <div className="lbl">gestión centralizada</div>
            </div>
            <div>
              <div className="num">es / en</div>
              <div className="lbl">atención bilingüe</div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
