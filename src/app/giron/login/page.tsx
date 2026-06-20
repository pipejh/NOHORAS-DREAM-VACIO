import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "@/components/giron/LoginForm";

export const metadata: Metadata = {
  title: "Ingresar — Girón",
  description: "Portal de arrendatarios de Nohoras Dream Girón.",
  robots: { index: false },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  return (
    <section className="g-auth">
      <div className="g-auth-inner">
        <span className="eyebrow">Nohoras Dream · Girón</span>
        <h1 className="g-auth-title">Portal de arrendatarios</h1>
        <p className="g-auth-sub">
          Ingresa con el usuario y la contraseña que te entregamos.
        </p>
        <LoginForm next={next} />
        <Link href="/giron" className="g-back">
          ← Volver
        </Link>
      </div>
    </section>
  );
}
