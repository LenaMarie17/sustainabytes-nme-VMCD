export type TravelMode = 'car' | 'bus' | 'bike' | 'walk'

/**
 * Average CO2 emitted per person per kilometre travelled, in grams.
 * - car: US EPA average passenger vehicle, ~400 g CO2 per mile (~249 g/km), single occupant.
 * - bus: average local bus per passenger-km (UK DEFRA conversion factors, ~102 g/km).
 * - bike / walk: no tailpipe emissions.
 * Edit these numbers to use your own data.
 */
export const EMISSIONS_G_PER_KM: Record<TravelMode, number> = {
  car: 249,
  bus: 102,
  bike: 0,
  walk: 0,
}

/** Distances in metres for each mode, as returned by /api/route. */
export type RouteDistances = Record<TravelMode, number>

export function emissionsFor(mode: TravelMode, metres: number) {
  return (EMISSIONS_G_PER_KM[mode] * metres) / 1000
}

export function formatGrams(grams: number) {
  if (grams === 0) return '0 g'
  if (grams >= 1000) return `${(grams / 1000).toFixed(2)} kg`
  return `${Math.round(grams)} g`
}

export function formatDistance(metres: number) {
  const km = metres / 1000
  const mi = km * 0.621371
  return `${km.toFixed(2)} km (${mi.toFixed(2)} mi)`
}
