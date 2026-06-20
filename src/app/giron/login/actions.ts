"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { usernameToEmail } from "@/lib/giron/constants";

export type LoginState = { error?: string };

export async function signIn(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "");

  if (!username || !password) {
    return { error: "Escribe tu usuario y contraseña." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: usernameToEmail(username),
    password,
  });

  if (error) {
    return { error: "Usuario o contraseña incorrectos." };
  }

  // Decidir destino según el rol.
  const {
    data: { user },
  } = await supabase.auth.getUser();
  let destino = next && next.startsWith("/giron") ? next : "/giron/portal";
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("rol")
      .eq("id", user.id)
      .single();
    if (profile && ["admin", "owner"].includes(profile.rol) && !next) {
      destino = "/giron/admin";
    }
  }
  redirect(destino);
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/giron/login");
}
