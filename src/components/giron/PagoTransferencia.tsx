"use client";

import { useActionState } from "react";
import { reportarTransferencia, type ReporteState } from "@/app/giron/portal/actions";
import { formatCOP, formatPeriodo } from "@/lib/format";
import type { PagoInfo } from "@/lib/giron/settings";

export function PagoTransferencia({
  info,
  periodo,
  monto,
  referencia,
  enRevision,
}: {
  info: PagoInfo | null;
  periodo: string;
  monto: number;
  referencia: string;
  enRevision: boolean;
}) {
  const [state, action, pending] = useActionState<ReporteState, FormData>(
    reportarTransferencia,
    {},
  );

  const hayDatos = info && (info.llave_breb || info.nequi || info.numero_cuenta);

  return (
    <div className="g-card pago-card">
      <h3 className="g-card-title">Pagar arriendo de {formatPeriodo(periodo)}</h3>

      {enRevision && (
        <p className="g-ok" style={{ marginBottom: 14 }}>
          Tu pago está <strong>en revisión</strong>. Te confirmamos pronto. Si
          necesitas, puedes volver a subir el comprobante.
        </p>
      )}

      {!hayDatos ? (
        <p className="estado-note" style={{ color: "var(--nd-muted)" }}>
          Aún no hay datos de pago configurados. Escríbenos por WhatsApp y te
          indicamos cómo transferir.
        </p>
      ) : (
        <>
          <p className="pago-intro">
            Transfiere <strong>{formatCOP(monto)}</strong> a:
          </p>
          <dl className="g-dl pago-datos">
            {info!.llave_breb && (
              <div><dt>Llave Bre-B</dt><dd>{info!.llave_breb}</dd></div>
            )}
            {info!.nequi && <div><dt>Nequi</dt><dd>{info!.nequi}</dd></div>}
            {info!.numero_cuenta && (
              <div>
                <dt>{info!.banco ?? "Cuenta"}{info!.tipo_cuenta ? ` (${info!.tipo_cuenta})` : ""}</dt>
                <dd>{info!.numero_cuenta}</dd>
              </div>
            )}
            {info!.titular && <div><dt>Titular</dt><dd>{info!.titular}</dd></div>}
            <div><dt>Referencia</dt><dd>{referencia}</dd></div>
          </dl>
          {info!.instrucciones && <p className="pago-instr">{info!.instrucciones}</p>}

          <form action={action} className="pago-form">
            <input type="hidden" name="periodo" value={periodo} />
            <label className="g-field">
              <span>Sube tu comprobante (imagen o PDF)</span>
              <input
                name="comprobante"
                type="file"
                accept="image/jpeg,image/png,image/webp,application/pdf"
                required
              />
            </label>
            {state.error && <p className="g-error">{state.error}</p>}
            {state.ok && <p className="g-ok">{state.ok}</p>}
            <button className="btn btn-gold" type="submit" disabled={pending}>
              {pending ? "Enviando…" : "Ya transferí · enviar comprobante"}
            </button>
          </form>
        </>
      )}
    </div>
  );
}
