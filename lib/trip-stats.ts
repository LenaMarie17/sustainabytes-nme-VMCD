import { EMISSIONS_G_PER_KM, type TravelMode } from '@/lib/emissions'
import { LOCATIONS } from '@/lib/locations'

export type SavedTrip = {
  id: number
  fromId: string
  toId: string
  mode: TravelMode
  distanceKm: number
  co2SavedGrams: number
  createdAt: Date
}

export type TripRow = SavedTrip & {
  fromName: string
  toName: string
  emittedGrams: number
  carGrams: number
  carKm: number
}

const locationNames = new Map(LOCATIONS.map((l) => [l.id, l.name]))

export function locationName(id: string) {
  return locationNames.get(id) ?? id
}

/**
 * Saved rows store the chosen mode's distance and the CO2 saved vs. driving.
 * The driving baseline is reconstructed as saved + emitted, so no extra routing calls are needed.
 */
export function enrichTrip(trip: SavedTrip): TripRow {
  const emittedGrams = EMISSIONS_G_PER_KM[trip.mode] * trip.distanceKm
  const carGrams = trip.co2SavedGrams + emittedGrams
  return {
    ...trip,
    fromName: locationName(trip.fromId),
    toName: locationName(trip.toId),
    emittedGrams,
    carGrams,
    carKm: carGrams / EMISSIONS_G_PER_KM.car,
  }
}

export type ModeBreakdown = Record<TravelMode, { trips: number; km: number; savedGrams: number }>

export type SavingsSummary = {
  trips: number
  savedGrams: number
  emittedGrams: number
  carBaselineGrams: number
  /** Share of the driving baseline avoided, 0-1. */
  savedShare: number
  /** If every trip had been walked or cycled. */
  maxPossibleGrams: number
  missedGrams: number
  /** If every trip had been taken by bus. */
  allBusGrams: number
  byMode: ModeBreakdown
}

export function summarize(rows: TripRow[]): SavingsSummary {
  const byMode: ModeBreakdown = {
    car: { trips: 0, km: 0, savedGrams: 0 },
    bus: { trips: 0, km: 0, savedGrams: 0 },
    bike: { trips: 0, km: 0, savedGrams: 0 },
    walk: { trips: 0, km: 0, savedGrams: 0 },
  }
  let savedGrams = 0
  let emittedGrams = 0
  let carBaselineGrams = 0
  let allBusGrams = 0

  for (const row of rows) {
    savedGrams += row.co2SavedGrams
    emittedGrams += row.emittedGrams
    carBaselineGrams += row.carGrams
    allBusGrams += row.carGrams - EMISSIONS_G_PER_KM.bus * row.carKm
    const bucket = byMode[row.mode]
    bucket.trips += 1
    bucket.km += row.distanceKm
    bucket.savedGrams += row.co2SavedGrams
  }

  return {
    trips: rows.length,
    savedGrams,
    emittedGrams,
    carBaselineGrams,
    savedShare: carBaselineGrams > 0 ? savedGrams / carBaselineGrams : 0,
    maxPossibleGrams: carBaselineGrams,
    missedGrams: Math.max(0, carBaselineGrams - savedGrams),
    allBusGrams,
    byMode,
  }
}

/**
 * Real-world equivalents for a mass of CO2, in grams.
 * Sources (approximate, edit freely):
 * - Mature tree absorbs ~21.77 kg CO2 per year (Arbor Day / EPA estimates).
 * - Smartphone full charge ~8.22 g CO2 (US EPA GHG equivalencies).
 * - Gasoline: 8,887 g CO2 per US gallon burned (US EPA).
 * - 10 W LED bulb for one hour on the US grid ~3.86 g CO2 (~0.386 kg/kWh).
 * - Laptop (50 W) for one hour ~19.3 g CO2.
 * - One hour of HD video streaming ~36 g CO2 (IEA estimate).
 * - CO2 gas volume ~0.509 L per gram at 0 °C; party balloon ~14 L.
 */
export const EQUIVALENTS = {
  treeYearGrams: 21_770,
  phoneChargeGrams: 8.22,
  gasolineGallonGrams: 8_887,
  ledHourGrams: 3.86,
  laptopHourGrams: 19.3,
  streamingHourGrams: 36,
  litresPerGram: 0.509,
  balloonLitres: 14,
} as const

export function formatNumber(value: number, decimals = 2) {
  return value.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
}

export function formatGramsPrecise(grams: number) {
  if (grams >= 1000) return `${formatNumber(grams / 1000, 3)} kg`
  return `${formatNumber(grams, 1)} g`
}

export const MODE_LABELS: Record<TravelMode, string> = {
  car: 'Car',
  bus: 'Bus',
  bike: 'Bike',
  walk: 'Walk',
}
