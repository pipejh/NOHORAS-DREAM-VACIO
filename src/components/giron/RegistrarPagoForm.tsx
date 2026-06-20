"use client";

import { useActionState } from "react";
import { registrarPago, type ActionState } from "@/app/giron/admin/actions";

export function RegistrarPagoForm({
  leaseId,
  periodoActual,
  valorMensual,
}: {
  leaseId: string;
  periodoActual: string;
  valorMensual: number;
}) {
  const [state, action, pending] = useActionState<ActionState, FormData>(registrarPago, {});

  return (
    <form action={action} className="g-form">
      <input type="hidden" name="lease_id" value={leaseId} />
      <div className="g-form-grid">
        <label className="g-field">
          <span>Periodo (AAAA-MM) *</span>
          <input name="periodo" required defaultValue={periodoActual} placeholder="2026-06" />
        </label>
        <label className="g-field">
          <span>Monto (COP) *</span>
          <input name="monto" type="number" min={0} required defaultValue={valorMensual} />
        </label>
        <label className="g-field">
          <span>Método</span>
          <select name="metodo" defaultValue="efectivo">
            <option value="efectivo">Efectivo</option>
            <option value="transferencia">Transferencia</option>
            <option value="nequi">Nequi</option>
            <option value="pse">PSE</option>
            <option value="tarjeta">Tarjeta</option>
          </select>
        </label>
        <label className="g-field">
          <span>Fecha de pago</span>
          <input name="pagado_at" type="date" />
        </label>
      </div>

      {state.error && <p className="g-error">{state.error}</p>}
      {state.ok && <p className="g-ok">{state.ok}</p>}

      <button className="btn btn-primary" type="submit" disabled={pending}>
        {pending ? "Registrando…" : "Registrar pago"}
      </button>
    </form>
  );
}
