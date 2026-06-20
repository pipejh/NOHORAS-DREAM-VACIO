"use client";

import { useActionState } from "react";
import { guardarPagoInfo, type ActionState } from "@/app/giron/admin/actions";
import type { PagoInfo } from "@/lib/giron/settings";

export function ConfigCobroForm({ info }: { info: PagoInfo | null }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(guardarPagoInfo, {});

  return (
    <form action={action} className="g-form">
      <p className="g-form-note">
        Estos datos los verá el arrendatario en su portal para transferirte.
        Llena al menos uno (recomendado: tu <strong>llave Bre-B</strong> o Nequi).
      </p>

      <div className="g-form-grid">
        <label className="g-field">
          <span>Llave Bre-B</span>
          <input name="llave_breb" defaultValue={info?.llave_breb ?? ""} placeholder="@tu-llave o número" />
        </label>
        <label className="g-field">
          <span>Nequi</span>
          <input name="nequi" defaultValue={info?.nequi ?? ""} placeholder="3001234567" />
        </label>
        <label className="g-field">
          <span>Titular de la cuenta</span>
          <input name="titular" defaultValue={info?.titular ?? ""} placeholder="Felipe ..." />
        </label>
        <label className="g-field">
          <span>Banco</span>
          <input name="banco" defaultValue={info?.banco ?? ""} placeholder="Bancolombia" />
        </label>
        <label className="g-field">
          <span>Tipo de cuenta</span>
          <select name="tipo_cuenta" defaultValue={info?.tipo_cuenta ?? ""}>
            <option value="">—</option>
            <option value="ahorros">Ahorros</option>
            <option value="corriente">Corriente</option>
          </select>
        </label>
        <label className="g-field">
          <span>Número de cuenta</span>
          <input name="numero_cuenta" defaultValue={info?.numero_cuenta ?? ""} placeholder="000-000000-00" />
        </label>
      </div>
      <label className="g-field">
        <span>Instrucciones adicionales (opcional)</span>
        <textarea name="instrucciones" rows={3} defaultValue={info?.instrucciones ?? ""} placeholder="Ej. En el comentario pon tu apartamento y el mes." />
      </label>

      {state.error && <p className="g-error">{state.error}</p>}
      {state.ok && <p className="g-ok">{state.ok}</p>}

      <button className="btn btn-primary" type="submit" disabled={pending}>
        {pending ? "Guardando…" : "Guardar datos de cobro"}
      </button>
    </form>
  );
}
