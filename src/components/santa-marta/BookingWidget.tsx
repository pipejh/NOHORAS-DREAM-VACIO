"use client";

import { useEffect, useMemo, useState } from "react";
import {
  PRECIO_BASE,
  calcularCotizacion,
  esTemporadaEspecial,
  formatCOP,
  getPrecioNoche,
  mensajeWhatsApp,
  type Cotizacion,
} from "@/lib/precios";
import { useLang } from "./lang";

const LISTING_URL =
  process.env.NEXT_PUBLIC_AIRBNB_LISTING_URL ??
  "https://airbnb.com/rooms/1483618072090950324";
const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP_SANTA_MARTA ?? "573022332388";

// ─── helpers de fecha (date-only, sin problemas de TZ) ───
const toKey = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate(),
  ).padStart(2, "0")}`;
const fromKey = (k: string) => new Date(`${k}T12:00:00`);
const addDays = (k: string, n: number) => {
  const d = fromKey(k);
  d.setDate(d.getDate() + n);
  return toKey(d);
};

type Blocked = { start: string; end: string };

const GUESTS = [
  { adultos: 2, ninos: 0 },
  { adultos: 2, ninos: 1 },
  { adultos: 2, ninos: 2 },
];

export function BookingWidget() {
  const { t, lang } = useLang();

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(12, 0, 0, 0);
    return d;
  }, []);
  const todayKey = toKey(today);

  const [view, setView] = useState({ y: today.getFullYear(), m: today.getMonth() });
  const [blocked, setBlocked] = useState<Blocked[]>([]);
  const [icalOk, setIcalOk] = useState(true);
  const [checkIn, setCheckIn] = useState<string | null>(null);
  const [checkOut, setCheckOut] = useState<string | null>(null);
  const [guestIdx, setGuestIdx] = useState(0);
  // El calendario depende de `new Date()` (difiere server/cliente). Lo
  // renderizamos solo tras montar para evitar desajustes de hidratación.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Disponibilidad real desde el iCal de Airbnb (vía nuestro endpoint cacheado).
  useEffect(() => {
    let active = true;
    fetch("/api/airbnb/availability")
      .then((r) => r.json())
      .then((d: { blocked: Blocked[]; ok: boolean }) => {
        if (!active) return;
        setBlocked(d.blocked ?? []);
        setIcalOk(d.ok !== false);
      })
      .catch(() => active && setIcalOk(false));
    return () => {
      active = false;
    };
  }, []);

  // ¿La noche que empieza en `key` está bloqueada? El endpoint ya entrega
  // start/end como YYYY-MM-DD (end exclusivo), así que comparamos strings.
  const isBlocked = (key: string) =>
    blocked.some((b) => key >= b.start && key < b.end);

  const isPast = (key: string) => key < todayKey;

  // ¿El rango [in, out) tiene todas las noches disponibles?
  const rangoValido = (inK: string, outK: string) => {
    if (outK <= inK) return false;
    for (let d = inK; d < outK; d = addDays(d, 1)) {
      if (isBlocked(d) || isPast(d)) return false;
    }
    return true;
  };

  const onPick = (key: string) => {
    if (isPast(key) || isBlocked(key)) return;
    // Sin entrada o con rango ya completo → empezar selección nueva.
    if (!checkIn || (checkIn && checkOut)) {
      setCheckIn(key);
      setCheckOut(null);
      return;
    }
    // Hay entrada, falta salida.
    if (key <= checkIn) {
      setCheckIn(key); // clic antes/igual → mover entrada
      return;
    }
    if (rangoValido(checkIn, key)) {
      setCheckOut(key);
    } else {
      setCheckIn(key); // el rango cruza noches no disponibles → reiniciar
      setCheckOut(null);
    }
  };

  const cot: Cotizacion | null = useMemo(() => {
    if (!checkIn || !checkOut) return null;
    try {
      return calcularCotizacion(
        checkIn,
        checkOut,
        GUESTS[guestIdx].adultos,
        GUESTS[guestIdx].ninos,
      );
    } catch {
      return null;
    }
  }, [checkIn, checkOut, guestIdx]);

  // ─── construir la grilla del mes ───
  const monthLabel = new Date(view.y, view.m, 1).toLocaleDateString(
    lang === "en" ? "en-US" : "es-CO",
    { month: "long", year: "numeric" },
  );
  const firstDow = (new Date(view.y, view.m, 1).getDay() + 6) % 7; // lunes = 0
  const daysInMonth = new Date(view.y, view.m + 1, 0).getDate();

  const canPrev = view.y > today.getFullYear() || view.m > today.getMonth();
  const moveMonth = (delta: number) => {
    const d = new Date(view.y, view.m + delta, 1);
    setView({ y: d.getFullYear(), m: d.getMonth() });
  };

  const cells: ({ key: string; day: number } | null)[] = [];
  for (let i = 0; i < firstDow; i++) cells.push(null);
  for (let day = 1; day <= daysInMonth; day++) {
    cells.push({ key: toKey(new Date(view.y, view.m, day)), day });
  }

  // ─── CTAs ───
  const airbnbHref =
    checkIn && checkOut
      ? `${LISTING_URL}?check_in=${checkIn}&check_out=${checkOut}`
      : LISTING_URL;
  const waText = cot ? mensajeWhatsApp(cot, lang) : t("sm_wa_default");
  const waHref = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(waText)}`;

  const dow = lang === "en" ? ["M", "T", "W", "T", "F", "S", "S"] : ["L", "M", "X", "J", "V", "S", "D"];

  if (!mounted) {
    return (
      <div className="booking-layout">
        <div className="cal" style={{ minHeight: 420 }} aria-hidden="true" />
        <div className="book-card">
          <div className="from">
            <b>{formatCOP(PRECIO_BASE)}</b> <small>{t("sm_pernight")}</small>
          </div>
          <p className="hint" style={{ marginTop: 16 }}>
            {t("sm_bd_pick")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="booking-layout">
      {/* Calendario */}
      <div className="cal">
        <div className="cal-head">
          <h3 id="cal-month">{monthLabel}</h3>
          <div className="cal-nav">
            <button onClick={() => moveMonth(-1)} disabled={!canPrev} aria-label="Mes anterior">
              ‹
            </button>
            <button onClick={() => moveMonth(1)} aria-label="Mes siguiente">
              ›
            </button>
          </div>
        </div>
        <div className="cal-dow">
          {dow.map((d, i) => (
            <span key={i}>{d}</span>
          ))}
        </div>
        <div className="cal-grid">
          {cells.map((c, i) => {
            if (!c) return <div key={`e${i}`} className="day empty" />;
            const past = isPast(c.key);
            const blockedDay = isBlocked(c.key);
            const date = fromKey(c.key);
            const high = !past && !blockedDay && esTemporadaEspecial(date);
            const selected = c.key === checkIn || c.key === checkOut;
            const inRange =
              checkIn && checkOut && c.key > checkIn && c.key < checkOut;
            const cls = past
              ? "day past"
              : blockedDay
                ? "day blocked"
                : selected
                  ? "day avail sel"
                  : inRange
                    ? "day avail inrange"
                    : high
                      ? "day avail high"
                      : "day avail";
            return (
              <div
                key={c.key}
                className={cls}
                onClick={() => onPick(c.key)}
                role={past || blockedDay ? undefined : "button"}
                tabIndex={past || blockedDay ? undefined : 0}
                onKeyDown={(e) =>
                  (e.key === "Enter" || e.key === " ") && onPick(c.key)
                }
              >
                <span className="dn">{c.day}</span>
                {!past && !blockedDay && (
                  <span className="pr">{formatCOP(getPrecioNoche(date).precio)}</span>
                )}
              </div>
            );
          })}
        </div>
        <div className="cal-legend">
          <span>
            <i style={{ background: "rgba(62,124,177,.2)" }} /> {t("sm_legend_avail")}
          </span>
          <span>
            <i style={{ background: "rgba(234,167,22,.45)" }} /> {t("sm_legend_high")}
          </span>
          <span>
            <i style={{ background: "#e6e6e6" }} /> {t("sm_legend_blocked")}
          </span>
          <span>
            <i style={{ background: "var(--nd-blue)" }} /> {t("sm_legend_sel")}
          </span>
        </div>
        {!icalOk && <p className="cal-warn">{t("sm_cal_warn")}</p>}
      </div>

      {/* Tarjeta de cotización */}
      <div className="book-card">
        <div className="from">
          <b>{formatCOP(PRECIO_BASE)}</b> <small>{t("sm_pernight")}</small>
        </div>
        <div className="rating">★ 5,0 · <span style={{ color: "var(--nd-muted)" }}>{t("sm_rating")}</span></div>

        <div className="field-row">
          <div className="field">
            <label>{t("sm_checkin")}</label>
            <div className={`val${checkIn ? "" : " placeholder"}`}>{checkIn ?? t("sm_pick")}</div>
          </div>
          <div className="field">
            <label>{t("sm_checkout")}</label>
            <div className={`val${checkOut ? "" : " placeholder"}`}>{checkOut ?? t("sm_pick")}</div>
          </div>
        </div>
        <div className="field">
          <label>{t("sm_guests")}</label>
          <select value={guestIdx} onChange={(e) => setGuestIdx(Number(e.target.value))}>
            <option value={0}>{t("sm_g1")}</option>
            <option value={1}>{t("sm_g2")}</option>
            <option value={2}>{t("sm_g3")}</option>
          </select>
        </div>

        <div className="breakdown">
          {cot ? (
            <>
              <div className="row">
                <span>
                  {cot.noches} {t("sm_bd_nights")}
                </span>
                <span>{formatCOP(cot.totalAlojamiento)}</span>
              </div>
              {cot.descuento > 0 && (
                <div className="row disc">
                  <span>{t("sm_bd_discount")}</span>
                  <span>-{formatCOP(cot.descuento)}</span>
                </div>
              )}
              <div className="total">
                <span>{t("sm_bd_total")}</span>
                <span>{formatCOP(cot.totalAlojamientoFinal)}</span>
              </div>
              <div className="row" style={{ marginTop: 10 }}>
                <span>{t("sm_bd_deposit")}</span>
                <span>{formatCOP(cot.adelanto)}</span>
              </div>
              <p className="hint">{t("sm_bd_extra")}</p>
            </>
          ) : checkIn && !checkOut ? (
            <p className="hint">{t("sm_bd_pick")}</p>
          ) : (
            <p className="hint">{t("sm_bd_pick")}</p>
          )}
        </div>

        <div className="book-cta">
          <a className="btn btn-gold btn-block" href={airbnbHref} target="_blank" rel="noopener noreferrer">
            {t("sm_cta_air2")}
          </a>
          <a className="btn btn-wa-direct btn-block" href={waHref} target="_blank" rel="noopener noreferrer">
            <WaIcon />
            <span>{t("sm_cta_wa2")}</span>
          </a>
        </div>
        <p className="reserve-microcopy" style={{ color: "var(--nd-muted)", marginTop: 12 }}>
          <b style={{ color: "var(--nd-navy)" }}>{t("sm_micro2_b")}</b>
          {t("sm_micro2")}
        </p>
        <p className="note">{t("sm_note")}</p>
      </div>
    </div>
  );
}

export function WaIcon() {
  return (
    <svg className="wa-ic" viewBox="0 0 32 32" fill="currentColor" aria-hidden="true">
      <path d="M16 .5C7.4.5.5 7.4.5 16c0 2.8.7 5.4 2 7.7L.5 31.5l8-2.1c2.2 1.2 4.8 1.9 7.5 1.9 8.6 0 15.5-6.9 15.5-15.5S24.6.5 16 .5zm0 28.3c-2.4 0-4.7-.6-6.7-1.8l-.5-.3-4.8 1.3 1.3-4.6-.3-.5a12.7 12.7 0 0 1-2-6.9C3.2 8.9 8.9 3.2 16 3.2S28.8 8.9 28.8 16 23.1 28.8 16 28.8zm7.2-9.5c-.4-.2-2.3-1.1-2.7-1.3-.4-.1-.6-.2-.9.2-.3.4-1 1.3-1.3 1.5-.2.3-.4.3-.8.1-.4-.2-1.7-.6-3.2-2-1.2-1-2-2.4-2.2-2.8-.2-.4 0-.6.2-.8l.6-.7c.2-.2.2-.4.4-.6.1-.3 0-.5 0-.7-.1-.2-.9-2.1-1.2-2.9-.3-.7-.6-.6-.9-.7h-.7c-.2 0-.6.1-1 .5-.3.4-1.3 1.3-1.3 3.1 0 1.9 1.3 3.6 1.5 3.9.2.3 2.6 4 6.3 5.6.9.4 1.6.6 2.1.8.9.3 1.7.2 2.3.1.7-.1 2.3-.9 2.6-1.8.3-.9.3-1.7.2-1.8-.1-.2-.3-.3-.7-.5z" />
    </svg>
  );
}
