/**
 * Isotipo Nohoras Dream — sol naciente dorado sobre olas en degradado azul.
 * Derivado del favicon/logo del prototipo. Sin fondo (transparente), para
 * usarse sobre crema (nav) u oscuro (footer).
 */
export function Isotype({ className = "iso" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 64"
      role="img"
      aria-label="Nohoras Dream"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Sol */}
      <circle className="sun" cx="32" cy="30" r="9" fill="#EAA716" />
      {/* Rayos */}
      <g className="ray" stroke="#EAA716" strokeWidth="2.4" strokeLinecap="round">
        <line x1="32" y1="10" x2="32" y2="15" />
        <line x1="17" y1="15" x2="20" y2="19" />
        <line x1="47" y1="15" x2="44" y2="19" />
        <line x1="10" y1="30" x2="15" y2="30" />
        <line x1="49" y1="30" x2="54" y2="30" />
      </g>
      {/* Olas (degradado de marca: marino → azul → cielo) */}
      <path
        d="M4 42c6 0 6-4 12-4s6 4 12 4 6-4 12-4 6 4 12 4 6-4 8-4v6c-2 0-2 4-8 4s-6-4-12-4-6 4-12 4-6-4-12-4-6 4-12 4z"
        fill="#173B5E"
      />
      <path
        d="M4 50c6 0 6-3 12-3s6 3 12 3 6-3 12-3 6 3 12 3 6-3 8-3v8H4z"
        fill="#3E7CB1"
      />
      <path
        d="M4 56c6 0 6-2 12-2s6 2 12 2 6-2 12-2 6 2 12 2 6-2 8-2v6H4z"
        fill="#7FB5DD"
      />
    </svg>
  );
}

/** Lockup completo: isotipo + wordmark "NOHORAS DREAM" (DREAM en dorado). */
export function BrandLockup() {
  return (
    <span className="brand">
      <Isotype />
      <span className="lockup">
        <span className="wordmark">
          NOHORAS <span className="dream">DREAM</span>
        </span>
        <small>Propiedades · Colombia</small>
      </span>
    </span>
  );
}
