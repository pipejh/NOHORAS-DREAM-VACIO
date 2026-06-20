"use client";

import { useActionState } from "react";
import { crearArrendatario, type ActionState } from "@/app/giron/admin/actions";

export function NuevoArrendatarioForm({
  unidades,
}: {
  unidades: { id: string; identificador: string }[];
}) {
  const [state, action, pending] = useActionState<ActionState, FormData>(crearArrendatario, {});

  if (unidades.length === 0) {
    return (
      <div className="g-empty">
        <p>No hay apartamentos disponibles. Todos tienen un contrato activo.</p>
      </div>
    );
  }

  return (
    <form action={action} className="g-form">
      <p className="g-form-note">
        El arrendatario entra con el <strong>usuario</strong> y la{" "}
        <strong>contraseña</strong> que defines aquí. Compártelos por WhatsApp.
      </p>

      <div className="g-form-grid">
        <label className="g-field">
          <span>Nombre completo *</span>
          <input name="nombre" required placeholder="Ej. María Pérez" />
        </label>
        <label className="g-field">
          <span>WhatsApp</span>
          <input name="telefono" inputMode="tel" placeholder="3001234567" />
        </label>
        <label className="g-field">
          <span>Usuario *</span>
          <input name="username" required autoCapitalize="none" placeholder="ej. apto101" />
        </label>
        <label className="g-field">
          <span>Contraseña *</span>
          <input name="password" required placeholder="mínimo 6 caracteres" />
        </label>
        <label className="g-field">
          <span>Apartamento *</span>
          <select name="unit_id" required defaultValue="">
            <option value="" disabled>
              Selecciona…
            </option>
            {unidades.map((u) => (
              <option key={u.id} value={u.id}>
                Apto {u.identificador}
              </option>
            ))}
          </select>
        </label>
        <label className="g-field">
          <span>Valor mensual (COP) *</span>
          <input name="valor_mensual" type="number" min={0} required placeholder="1200000" />
        </label>
        <label className="g-field">
          <span>Día de pago (1–28) *</span>
          <input name="dia_pago" type="number" min={1} max={28} required placeholder="5" />
        </label>
        <label className="g-field">
          <span>Inicio del contrato *</span>
          <input name="fecha_inicio" type="date" required />
        </label>
        <label className="g-field">
          <span>Depósito (COP)</span>
          <input name="deposito" type="number" min={0} placeholder="0" />
        </label>
      </div>

      {state.error && <p className="g-error">{state.error}</p>}

      <button className="btn btn-primary" type="submit" disabled={pending}>
        {pending ? "Creando…" : "Crear arrendatario"}
      </button>
    </form>
  );
}
