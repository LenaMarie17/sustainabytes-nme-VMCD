import { NextResponse, type NextRequest } from 'next/server'
import { LOCATION_COORDINATES } from '@/lib/location-coordinates'
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

async function routeDistance(baseUrl: string, from: [number, number], to: [number, number]) {
  const coords = `${from[1]},${from[0]};${to[1]},${to[0]}`
  const res = await fetch(`${baseUrl}/${coords}?overview=false`, {
    headers: { 'User-Agent': 'sustainabytes-nme/1.0' },
    next: { revalidate: 60 * 60 * 24 * 7 },
  })
  if (!res.ok) throw new Error(`Routing failed (${res.status})`)
  const data = (await res.json()) as { code: string; routes?: { distance: number }[] }
  const distance = data.routes?.[0]?.distance
  if (data.code !== 'Ok' || distance === undefined) throw new Error('No route found')
  return distance
}

export async function GET(request: NextRequest) {
  const fromId = request.nextUrl.searchParams.get('from') ?? ''
  const toId = request.nextUrl.searchParams.get('to') ?? ''
  const from = LOCATION_COORDINATES[fromId]
  const to = LOCATION_COORDINATES[toId]

  if (!from || !to) {
    return NextResponse.json({ error: 'Unknown location' }, { status: 400 })
  }
  if (fromId === toId) {
    return NextResponse.json({ error: 'Choose two different locations' }, { status: 400 })
  }

  try {
    const [car, bike, walk] = await Promise.all([
      routeDistance(ROUTERS.car, from, to),
      routeDistance(ROUTERS.bike, from, to),
      routeDistance(ROUTERS.walk, from, to),
    ])
    const distances: RouteDistances = { car, bus: car, bike, walk }
    return NextResponse.json(distances)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Routing failed'
    return NextResponse.json({ error: message }, { status: 502 })
  }
}
