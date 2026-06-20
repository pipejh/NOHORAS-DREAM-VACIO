"use client";

import { useActionState } from "react";
import { signIn, type LoginState } from "@/app/giron/login/actions";

export function LoginForm({ next }: { next?: string }) {
  const [state, formAction, pending] = useActionState<LoginState, FormData>(signIn, {});

  return (
    <form action={formAction} className="login-card">
      <input type="hidden" name="next" value={next ?? ""} />
      <label className="g-field">
        <span>Usuario</span>
        <input
          name="username"
          autoComplete="username"
          autoCapitalize="none"
          autoCorrect="off"
          required
          placeholder="tu usuario"
        />
      </label>
      <label className="g-field">
        <span>Contraseña</span>
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          required
          placeholder="tu contraseña"
        />
      </label>

      {state.error && <p className="g-error">{state.error}</p>}

      <button className="btn btn-primary btn-block" type="submit" disabled={pending}>
        {pending ? "Entrando…" : "Entrar"}
      </button>

      <p className="login-help">
        ¿Problemas para entrar? Escríbenos por WhatsApp y te ayudamos.
      </p>
    </form>
  );
}
