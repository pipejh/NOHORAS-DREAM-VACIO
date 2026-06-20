"use client";

import Image from "next/image";
import { RESENAS, RATING_PROMEDIO } from "@/lib/resenas";
import { SantaMartaLangProvider, LangSwitch, useLang } from "./lang";
import { Gallery } from "./Gallery";
import { BookingWidget, WaIcon } from "./BookingWidget";
import type { DictKey } from "@/lib/i18n/santa-marta";

const LISTING_URL =
  process.env.NEXT_PUBLIC_AIRBNB_LISTING_URL ??
  "https://airbnb.com/rooms/1483618072090950324";
const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP_SANTA_MARTA ?? "573022332388";

// Íconos de línea (sin emojis, según docs/10)
const ICONS: Record<string, React.ReactNode> = {
  sunrise: (
    <>
      <path d="M17 18a5 5 0 0 0-10 0" />
      <line x1="12" y1="2" x2="12" y2="9" />
      <line x1="4.2" y1="10.2" x2="5.6" y2="11.6" />
      <line x1="18.4" y1="11.6" x2="19.8" y2="10.2" />
      <line x1="2" y1="18" x2="22" y2="18" />
      <polyline points="8 6 12 2 16 6" />
    </>
  ),
  snow: (
    <>
      <line x1="12" y1="2" x2="12" y2="22" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <line x1="5" y1="5" x2="19" y2="19" />
      <line x1="19" y1="5" x2="5" y2="19" />
    </>
  ),
  kitchen: (
    <>
      <path d="M6 2v7a3 3 0 0 0 6 0V2" />
      <line x1="9" y1="2" x2="9" y2="9" />
      <path d="M18 2c-1.5 1.5-1.5 4 0 6v14" />
    </>
  ),
  wifi: (
    <>
      <path d="M2 8.5a16 16 0 0 1 20 0" />
      <path d="M5 12a11 11 0 0 1 14 0" />
      <path d="M8.5 15.5a6 6 0 0 1 7 0" />
      <circle cx="12" cy="19" r="1" />
    </>
  ),
  beach: (
    <>
      <path d="M3 21h18" />
      <path d="M12 21V9" />
      <path d="M12 9c-4 0-8 1-9 3 4-1 7 0 9 0 2 0 5-1 9 0-1-2-5-3-9-3z" />
      <circle cx="12" cy="6" r="3" />
    </>
  ),
  key: (
    <>
      <circle cx="8" cy="8" r="5" />
      <line x1="11.5" y1="11.5" x2="21" y2="21" />
      <line x1="17" y1="17" x2="20" y2="14" />
      <line x1="14" y1="14" x2="17" y2="11" />
    </>
  ),
  arrow: (
    <>
      <line x1="4" y1="12" x2="19" y2="12" />
      <polyline points="13 6 19 12 13 18" />
    </>
  ),
};

function Icon({ name }: { name: keyof typeof ICONS }) {
  return (
    <svg className="ic-line" viewBox="0 0 24 24">
      {ICONS[name]}
    </svg>
  );
}

const FEATURES: { icon: keyof typeof ICONS; t: DictKey; p: DictKey }[] = [
  { icon: "sunrise", t: "sm_f1t", p: "sm_f1p" },
  { icon: "snow", t: "sm_f2t", p: "sm_f2p" },
  { icon: "kitchen", t: "sm_f3t", p: "sm_f3p" },
  { icon: "wifi", t: "sm_f4t", p: "sm_f4p" },
  { icon: "beach", t: "sm_f5t", p: "sm_f5p" },
  { icon: "key", t: "sm_f6t", p: "sm_f6p" },
];

const FAQS: { q: DictKey; a: DictKey }[] = [
  { q: "sm_faq_q1", a: "sm_faq_a1" },
  { q: "sm_faq_q2", a: "sm_faq_a2" },
  { q: "sm_faq_q3", a: "sm_faq_a3" },
  { q: "sm_faq_q4", a: "sm_faq_a4" },
];

function Stars({ n }: { n: number }) {
  return <span aria-hidden="true">{"★".repeat(n)}</span>;
}

function Content() {
  const { t } = useLang();
  const waDefault = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(t("sm_wa_default"))}`;

  return (
    <>
      {/* Hero */}
      <section className="sm-hero grain">
        <Image
          src="/santa-marta/pareja_4.jpg"
          alt="Balcón con vista a El Rodadero al atardecer"
          fill
          priority
          sizes="100vw"
          style={{ objectFit: "cover" }}
        />
        <LangSwitch />
        <div className="wrap">
          <span className="eyebrow">{t("sm_eyebrow")}</span>
          <h1>
            {t("sm_title_a")}
            <em>{t("sm_title_em")}</em>
          </h1>
          <p>{t("sm_sub")}</p>
          <div className="dual-cta">
            <a className="btn btn-gold" href={LISTING_URL} target="_blank" rel="noopener noreferrer">
              {t("sm_cta_air")}
            </a>
            <a className="btn btn-wa-direct" href={waDefault} target="_blank" rel="noopener noreferrer">
              <WaIcon />
              <span>{t("sm_cta_wa")}</span>
            </a>
          </div>
          <p className="reserve-microcopy">
            <b>{t("sm_micro_b")}</b>
            {t("sm_micro")}
          </p>
          <div className="sm-meta">
            <span><b>{t("sm_m1_b")}</b>{t("sm_m1")}</span>
            <span><b>{t("sm_m2_b")}</b>{t("sm_m2")}</span>
            <span><b>{t("sm_m3_b")}</b>{t("sm_m3")}</span>
            <span><b>{t("sm_m4_b")}</b>{t("sm_m4")}</span>
          </div>
        </div>
      </section>

      {/* Galería */}
      <section className="block">
        <div className="wrap">
          <span className="eyebrow">{t("sm_gal_e")}</span>
          <h2 className="section-title">{t("sm_gal_t")}</h2>
          <p className="lede">{t("sm_gal_p")}</p>
          <Gallery />
        </div>
      </section>

      {/* Pull quote */}
      <section className="pullquote grain">
        <div className="wrap">
          <span className="mark">“</span>
          <blockquote>{t("sm_pq")}</blockquote>
          <cite>{t("sm_pq_cite")}</cite>
        </div>
      </section>

      {/* Qué incluye */}
      <section className="block alt">
        <div className="wrap">
          <span className="eyebrow">{t("sm_inc_e")}</span>
          <h2 className="section-title">{t("sm_inc_t")}</h2>
          <div className="incl-layout">
            <div className="incl-media">
              <Image
                src="/santa-marta/img_4528.jpg"
                alt="Interior del loft"
                fill
                sizes="(max-width: 900px) 100vw, 50vw"
                style={{ objectFit: "cover" }}
              />
            </div>
            <div className="incl-list">
              {FEATURES.map((f) => (
                <div className="incl-item" key={f.t}>
                  <span className="ic">
                    <Icon name={f.icon} />
                  </span>
                  <div>
                    <h4>{t(f.t)}</h4>
                    <p>{t(f.p)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Calendario + cotizador */}
      <section className="block" id="sm-cal">
        <div className="wrap">
          <span className="eyebrow">{t("sm_cal_e")}</span>
          <h2 className="section-title">{t("sm_cal_t")}</h2>
          <p className="lede">{t("sm_cal_p")}</p>
          <BookingWidget />
        </div>
      </section>

      {/* Reseñas */}
      <section className="block alt">
        <div className="wrap">
          <span className="eyebrow">{t("sm_rev_e")}</span>
          <h2 className="section-title">{t("sm_rev_t")}</h2>
          <div className="rev-summary">
            <div className="avg">
              <span className="score">5,0</span>
              <span className="stars"><Stars n={5} /></span>
              <span className="count">{t("sm_rev_count")}</span>
            </div>
          </div>
          <div className="rev-editorial">
            <div className="rev-feature">
              <div className="stars"><Stars n={RESENAS[0].estrellas} /></div>
              <blockquote>{RESENAS[0].texto}</blockquote>
              <div className="who">
                <div className="av">{RESENAS[0].inicial}</div>
                <div>
                  <b>{RESENAS[0].nombre}</b>
                  <small>{RESENAS[0].fecha}</small>
                </div>
              </div>
            </div>
            <div className="rev-list">
              {RESENAS.slice(1).map((r) => (
                <div className="rev-item" key={r.nombre}>
                  <div className="stars"><Stars n={r.estrellas} /></div>
                  <p>“{r.texto}”</p>
                  <div className="who">
                    <div className="av">{r.inicial}</div>
                    <div>
                      <b>{r.nombre}</b>
                      <small>{r.fecha}</small>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="rev-footer">
            <a className="btn btn-outline" href={LISTING_URL} target="_blank" rel="noopener noreferrer">
              {t("sm_rev_all")} <Icon name="arrow" />
            </a>
          </div>
        </div>
      </section>

      {/* Ubicación */}
      <section className="block">
        <div className="wrap">
          <span className="eyebrow">{t("sm_loc_e")}</span>
          <h2 className="section-title">{t("sm_loc_t")}</h2>
          <p className="lede">{t("sm_loc_p")}</p>
          <div className="loc-layout">
            <iframe
              className="loc-map"
              title="El Rodadero, Santa Marta"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src="https://www.google.com/maps?q=El+Rodadero,+Santa+Marta&output=embed"
            />
            <div>
              <ul className="loc-list">
                <li>{t("sm_loc_1")}</li>
                <li>{t("sm_loc_2")}</li>
                <li>{t("sm_loc_3")}</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="block alt">
        <div className="wrap">
          <span className="eyebrow">{t("sm_faq_e")}</span>
          <h2 className="section-title">{t("sm_faq_t")}</h2>
          <div className="faq-list">
            {FAQS.map((f) => (
              <details className="faq-item" key={f.q}>
                <summary>{t(f.q)}</summary>
                <p>{t(f.a)}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="final-cta grain">
        <div className="wrap">
          <span className="eyebrow">{t("sm_final_e")}</span>
          <h2>
            {t("sm_final_t_a")}
            <em>{t("sm_final_t_em")}</em>
          </h2>
          <p>{t("sm_final_p")}</p>
          <div className="dual-cta">
            <a className="btn btn-gold" href={LISTING_URL} target="_blank" rel="noopener noreferrer">
              {t("sm_cta_air")}
            </a>
            <a className="btn btn-wa-direct" href={waDefault} target="_blank" rel="noopener noreferrer">
              <WaIcon />
              <span>{t("sm_cta_wa")}</span>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

export function SantaMarta() {
  return (
    <SantaMartaLangProvider>
      <Content />
    </SantaMartaLangProvider>
  );
}

export { RATING_PROMEDIO };
