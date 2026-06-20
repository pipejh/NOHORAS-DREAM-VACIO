"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type Photo = { src: string; cap: string; cls?: "big" | "tall" };

const PHOTOS: Photo[] = [
  { src: "/santa-marta/img_4523.jpg", cap: "El Rodadero · Atardecer", cls: "big" },
  { src: "/santa-marta/img_4500.jpg", cap: "La vista" },
  { src: "/santa-marta/img_4506.jpg", cap: "Interior" },
  { src: "/santa-marta/pareja_4.jpg", cap: "El balcón", cls: "tall" },
  { src: "/santa-marta/img_4540.jpg", cap: "Atardecer dorado" },
  { src: "/santa-marta/img_4508.jpg", cap: "El loft" },
  { src: "/santa-marta/pareja_6.jpg", cap: "Brisa del Caribe", cls: "tall" },
  { src: "/santa-marta/img_4528.jpg", cap: "El loft" },
  { src: "/santa-marta/img_4530.jpg", cap: "Detalles" },
  { src: "/santa-marta/img_4532.jpg", cap: "Detalles" },
];

export function Gallery() {
  const [open, setOpen] = useState<string | null>(null);

  // Cerrar con Escape y bloquear scroll de fondo mientras está abierto.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <div className="gallery">
        {PHOTOS.map((p) => (
          <figure
            key={p.src}
            className={p.cls}
            onClick={() => setOpen(p.src)}
            role="button"
            tabIndex={0}
            aria-label={p.cap}
            onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setOpen(p.src)}
          >
            <Image
              src={p.src}
              alt={p.cap}
              fill
              sizes="(max-width: 560px) 100vw, (max-width: 900px) 50vw, 25vw"
              style={{ objectFit: "cover" }}
            />
            <span className="gcap">{p.cap}</span>
          </figure>
        ))}
      </div>

      {open && (
        <div className="lightbox" onClick={() => setOpen(null)} role="dialog" aria-modal="true">
          <span className="x" aria-hidden="true">
            ×
          </span>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={open} alt="" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </>
  );
}
