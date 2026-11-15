import 'server-only'
import { ALL_COORDINATES as LOCATION_COORDINATES } from '@/lib/location-coordinate-overrides'
import type { RouteDistances } from '@/lib/emissions'

/**
 * OSRM routing on OpenStreetMap data:
 * - routed-car follows drivable roads only (used for car and bus)
 * - routed-bike follows roads and bike-legal ways
 * - routed-foot follows roads, footpaths and campus walkways
 */
const ROUTERS = {
  car: 'https://routing.openstreetmap.de/routed-car/route/v1/driving',
  bike: 'https://routing.openstreetmap.de/routed-bike/route/v1/driving',
  walk: 'https://routing.openstreetmap.de/routed-foot/route/v1/driving',
} as const

export class RouteError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message)
  }
}

async function routeDistance(baseUrl: string, from: [number, number], to: [number, number]) {
  const coords = `${from[1]},${from[0]};${to[1]},${to[0]}`
  const res = await fetch(`${baseUrl}/${coords}?overview=false`, {
    headers: { 'User-Agent': 'sustainabytes-nme/1.0' },
    next: { revalidate: 60 * 60 * 24 * 7 },
    signal: AbortSignal.timeout(10_000),
  })
  if (!res.ok) throw new RouteError('The routing service is unavailable right now. Please try again.', 502)
  const data = (await res.json()) as { code: string; routes?: { distance: number }[] }
  const distance = data.routes?.[0]?.distance
  if (data.code !== 'Ok' || distance === undefined) {
    throw new RouteError('No route found between these locations.', 502)
  }
  return distance
}

/** Road/path distances in metres between two known location ids. Throws RouteError on bad input. */
export async function getRouteDistances(fromId: string, toId: string): Promise<RouteDistances> {
  // Object.hasOwn guards against prototype keys like "constructor" being treated as locations.
  const from = Object.hasOwn(LOCATION_COORDINATES, fromId) ? LOCATION_COORDINATES[fromId] : undefined
  const to = Object.hasOwn(LOCATION_COORDINATES, toId) ? LOCATION_COORDINATES[toId] : undefined
  if (!from || !to) throw new RouteError('Unknown location', 400)
  if (fromId === toId) throw new RouteError('Choose two different locations', 400)

  try {
    const [car, bike, walk] = await Promise.all([
      routeDistance(ROUTERS.car, from, to),
      routeDistance(ROUTERS.bike, from, to),
      routeDistance(ROUTERS.walk, from, to),
    ])
    return { car, bus: car, bike, walk }
  } catch (error) {
    if (error instanceof RouteError) throw error
    throw new RouteError('The routing service is unavailable right now. Please try again.', 502)
  }
}
