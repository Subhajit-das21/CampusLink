// src/config/mapStyles.ts
export const MAP_LIBRARIES: ("marker" | "geometry" | "places")[] = ['marker', 'geometry', 'places'];

export const darkMapStyles = [
  { elementType: "geometry", stylers: [{ color: "#051923" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#051923" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#0AD1C8" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#020617" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#1e293b" }] },
];

export const lightMapStyles = [
  { elementType: "geometry", stylers: [{ color: "#f8fafc" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#0f172a" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#ffffff" }] },
];