/**
 * resenas.ts — Reseñas reales transcritas de Airbnb (curación manual; Airbnb
 * no tiene API de reseñas). La primera es la destacada. Ver docs/01.
 *
 * Para actualizar: agregar/editar entradas aquí cuando lleguen reseñas nuevas.
 */
export type Resena = {
  nombre: string;
  inicial: string;
  fecha: string;
  estrellas: number;
  texto: string;
};

export const RESENAS: Resena[] = [
  {
    nombre: "Andrés",
    inicial: "A",
    fecha: "Sept 2025 · Airbnb",
    estrellas: 5,
    texto:
      "Tremenda vista. Es maravilloso, muy fresco, corre el viento y el loft es muy bonito y equipado. Lo recomiendo en un 100%.",
  },
  {
    nombre: "Johanna",
    inicial: "J",
    fecha: "Ago 2025",
    estrellas: 5,
    texto:
      "El apto está hermoso, una vista increíble, muy limpio y equipado al 100%. Sus anfitriones son excelentes, con una calidad humana increíble.",
  },
  {
    nombre: "Jairo Andrés",
    inicial: "JA",
    fecha: "Nov 2025",
    estrellas: 5,
    texto:
      "Excelente ubicación y vista hacia El Rodadero. El apartamento muy cómodo y limpio.",
  },
  {
    nombre: "Sergio",
    inicial: "S",
    fecha: "Nov 2025",
    estrellas: 5,
    texto:
      "Excelente ubicación, el lugar muy limpio, comodidad, buena comunicación y fácil el acceso.",
  },
  {
    nombre: "Luis Daniel",
    inicial: "LD",
    fecha: "Ene 2026",
    estrellas: 5,
    texto: "Great view.",
  },
];

export const RATING_PROMEDIO = 5.0;
export const RESENAS_COUNT = RESENAS.length;
