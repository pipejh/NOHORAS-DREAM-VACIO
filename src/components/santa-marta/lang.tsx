"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { dict, type DictKey, type Lang } from "@/lib/i18n/santa-marta";

type LangCtx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: DictKey) => string;
};

const Ctx = createContext<LangCtx | null>(null);

export function SantaMartaLangProvider({ children }: { children: React.ReactNode }) {
  // Español por defecto → es lo que se renderiza en SSR y se indexa.
  const [lang, setLangState] = useState<Lang>("es");

  // Al montar, recuperar preferencia guardada (solo cliente).
  useEffect(() => {
    const saved = window.localStorage.getItem("nd-lang");
    if (saved === "en" || saved === "es") setLangState(saved);
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    try {
      window.localStorage.setItem("nd-lang", l);
    } catch {
      // localStorage no disponible (modo privado): no es crítico.
    }
  };

  const t = (key: DictKey) => dict[lang][key];

  return <Ctx.Provider value={{ lang, setLang, t }}>{children}</Ctx.Provider>;
}

export function useLang() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useLang debe usarse dentro de SantaMartaLangProvider");
  return ctx;
}

/** Selector ES/EN flotante sobre el hero. */
export function LangSwitch() {
  const { lang, setLang } = useLang();
  return (
    <div className="lang" role="group" aria-label="Idioma / Language">
      <button className={lang === "es" ? "on" : undefined} onClick={() => setLang("es")}>
        ES
      </button>
      <button className={lang === "en" ? "on" : undefined} onClick={() => setLang("en")}>
        EN
      </button>
    </div>
  );
}
