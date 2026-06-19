import type { Metadata, Viewport } from "next";
import { Cinzel, Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import { SiteNav } from "@/components/ui/SiteNav";
import { SiteFooter } from "@/components/ui/SiteFooter";

// Wordmark / eyebrows en caps (réplica del estilo Trajan del logo)
const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--nd-font-wordmark",
  display: "swap",
});

// Display / títulos
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--nd-font-display",
  display: "swap",
});

// Cuerpo / UI
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--nd-font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Nohoras Dream — Propiedades en Colombia",
    template: "%s · Nohoras Dream",
  },
  description:
    "Portafolio boutique de propiedades de Nohoras Dream: alquiler turístico en Santa Marta, arriendo residencial en Girón y un coliving en camino en Cúcuta.",
  metadataBase: new URL("https://nohorasdream.co"),
  openGraph: {
    title: "Nohoras Dream — Propiedades en Colombia",
    description:
      "Lugares con alma, cuidados como un sueño. Desde el Caribe de Santa Marta hasta el corazón de Santander.",
    type: "website",
    locale: "es_CO",
  },
};

export const viewport: Viewport = {
  themeColor: "#102A45",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="es"
      className={`${cinzel.variable} ${cormorant.variable} ${inter.variable}`}
    >
      <body>
        <SiteNav />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
