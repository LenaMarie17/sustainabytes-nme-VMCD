'use server'

import { count, desc, eq, sum } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'
import { savedTrips } from '@/lib/db/schema'
import { emissionsFor, type TravelMode } from '@/lib/emissions'
import { getRouteDistances, RouteError } from '@/lib/routing'
import { getSession } from '@/lib/session'
import { enrichTrip, type TripRow } from '@/lib/trip-stats'

const MODES: TravelMode[] = ['car', 'bus', 'bike', 'walk']

export type TripTally = { trips: number; distanceKm: number; co2SavedGrams: number }

export type SaveTripResult = { ok: true; co2SavedGrams: number } | { ok: false; error: string }

async function getUserId() {
  const session = await getSession()
  if (!session?.user) throw new Error('Unauthorized')
  return session.user.id
}

export async function getTripTally(): Promise<TripTally> {
  const userId = await getUserId()
  const [row] = await db
    .select({
      trips: count(),
      distanceKm: sum(savedTrips.distanceKm),
      co2SavedGrams: sum(savedTrips.co2SavedGrams),
    })
    .from(savedTrips)
    .where(eq(savedTrips.userId, userId))
  return {
    trips: row?.trips ?? 0,
    distanceKm: Number(row?.distanceKm ?? 0),
    co2SavedGrams: Number(row?.co2SavedGrams ?? 0),
  }
}

export async function getTripHistory(): Promise<TripRow[]> {
  const userId = await getUserId()
  const rows = await db
    .select({
      id: savedTrips.id,
      fromId: savedTrips.fromId,
      toId: savedTrips.toId,
      mode: savedTrips.mode,
      distanceKm: savedTrips.distanceKm,
      co2SavedGrams: savedTrips.co2SavedGrams,
      createdAt: savedTrips.createdAt,
    })
    .from(savedTrips)
    .where(eq(savedTrips.userId, userId))
    .orderBy(desc(savedTrips.createdAt))
  return rows
    .filter((row): row is typeof row & { mode: TravelMode } => MODES.includes(row.mode as TravelMode))
    .map(enrichTrip)
}

export async function saveTrip(fromId: unknown, toId: unknown, mode: unknown): Promise<SaveTripResult> {
  let userId: string
  try {
    userId = await getUserId()
  } catch {
    return { ok: false, error: 'Please sign in again to save routes.' }
  }

  if (typeof fromId !== 'string' || typeof toId !== 'string' || !MODES.includes(mode as TravelMode)) {
    return { ok: false, error: 'Invalid route.' }
  }
  const travelMode = mode as TravelMode

  try {
    // Distances are recomputed on the server so the saved tally can't be inflated by the client.
    const distances = await getRouteDistances(fromId, toId)
    const metres = distances[travelMode]
    const co2SavedGrams = Math.max(
      0,
      emissionsFor('car', distances.car) - emissionsFor(travelMode, metres),
    )

    await db.insert(savedTrips).values({
      userId,
      fromId,
      toId,
      mode: travelMode,
      distanceKm: metres / 1000,
      co2SavedGrams,
    })
    revalidatePath('/')
    return { ok: true, co2SavedGrams }
  } catch (error) {
    if (error instanceof RouteError) return { ok: false, error: error.message }
    console.error('[saveTrip] failed', error)
    return { ok: false, error: 'Could not save this route. Please try again.' }
  }
}
