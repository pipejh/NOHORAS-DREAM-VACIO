import Image from "next/image";
import Link from "next/link";

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <div className="f-top" />
      <div className="wrap f-inner">
        <div>
          <Image
            className="f-logo"
            src="/brand/logo-white.png"
            alt="Nohoras Dream"
            width={520}
            height={493}
          />
          <small>Hospitalidad premium · Colombia</small>
        </div>

        <nav className="f-links">
          <Link href="/santa-marta">Santa Marta</Link>
          <Link href="/giron">Girón</Link>
          <Link href="/cucuta">Cúcuta</Link>
          <a
            href="https://instagram.com/nohorasdream"
            target="_blank"
            rel="noopener noreferrer"
          >
            Instagram
          </a>
        </nav>

        <small>© {year} Nohoras Dream. Todos los derechos reservados.</small>
      </div>
    </footer>
  );
}
