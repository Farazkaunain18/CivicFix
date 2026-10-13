import { Facility } from "./types";

export const DEFAULT_PUNJAB_COORDS = {
  lat: 30.9084,
  lng: 75.8573,
  city: "Ludhiana Central, Punjab",
};

/**
 * Calculates Great-circle distance between two GPS points using Haversine formula
 */
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Radius of the Earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return Math.round(d * 10) / 10;
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}

/**
 * Enriches and sorts a list of facilities by distance from a given point
 */
export function sortFacilitiesByDistance(
  facilities: Facility[],
  userLat: number,
  userLng: number
): Facility[] {
  return facilities
    .map((fac) => ({
      ...fac,
      distanceKm: calculateDistanceKm(userLat, userLng, fac.lat, fac.lng),
    }))
    .sort((a, b) => (a.distanceKm ?? 999) - (b.distanceKm ?? 999));
}
