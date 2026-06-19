"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Isotype } from "./Logo";

const LINKS = [
  { href: "/", label: "Inicio" },
  { href: "/santa-marta", label: "Santa Marta" },
  { href: "/giron", label: "Girón" },
  { href: "/cucuta", label: "Cúcuta" },
];

export function SiteNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="topbar">
      <div className="wrap topbar-inner">
        <Link href="/" className="brand" onClick={() => setOpen(false)}>
          <Isotype />
          <span className="lockup">
            <span className="wordmark">
              NOHORAS <span className="dream">DREAM</span>
            </span>
            <small>Propiedades · Colombia</small>
          </span>
        </Link>

        <button
          className="nav-toggle"
          aria-label="Abrir menú"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          ☰
        </button>

        <nav className={`nav${open ? " open" : ""}`}>
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={isActive(l.href) ? "on" : undefined}
              onClick={() => setOpen(false)}
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
