export interface HomeOption {
  id: string;
  label: string;
}

/** Features of the property itself. */
export const HOME_FEATURES: HomeOption[] = [
  { id: "seaView", label: "Vista al mar" },
  { id: "beachfront", label: "Frente a la playa" },
  { id: "garden", label: "Jardín" },
  { id: "terrace", label: "Terraza" },
  { id: "bbq", label: "Parrillero" },
  { id: "fireplace", label: "Chimenea" },
  { id: "garage", label: "Garage" },
  { id: "suite", label: "Dormitorio en suite" },
  { id: "forest", label: "Entorno de bosque" },
  { id: "gated", label: "Barrio privado" },
];

/** Services and comforts included. */
export const HOME_AMENITIES: HomeOption[] = [
  { id: "pool", label: "Piscina" },
  { id: "heatedPool", label: "Piscina climatizada" },
  { id: "wifi", label: "Wi-Fi" },
  { id: "airConditioning", label: "Aire acondicionado" },
  { id: "heating", label: "Calefacción" },
  { id: "gym", label: "Gimnasio" },
  { id: "sauna", label: "Sauna / Jacuzzi" },
  { id: "security", label: "Seguridad 24 h" },
  { id: "cleaning", label: "Servicio de limpieza" },
  { id: "petFriendly", label: "Admite mascotas" },
  { id: "tv", label: "Smart TV" },
  { id: "laundry", label: "Lavadero" },
];

const toMap = (xs: HomeOption[]) =>
  Object.fromEntries(xs.map((f) => [f.id, f.label])) as Record<string, string>;

export const HOME_FEATURE_LABEL = toMap(HOME_FEATURES);
export const HOME_AMENITY_LABEL = toMap(HOME_AMENITIES);
