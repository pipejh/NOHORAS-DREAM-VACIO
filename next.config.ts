import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // node-ical (y sus deps) deben cargarse como CommonJS en runtime, no ser
  // empaquetados por el bundler del servidor (rompe con BigInt/rrule).
  serverExternalPackages: ["node-ical"],
  images: {
    remotePatterns: [
      // Imágenes de Airbnb / placeholders externos usados en el prototipo.
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "a0.muscache.com" },
    ],
  },
};

export default nextConfig;
