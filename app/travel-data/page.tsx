import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { Bike, Bus, Car, Footprints } from 'lucide-react'
import { getTripHistory } from '@/app/actions/trips'
import { Co2, EmptyTrips, PageShell, StatCard } from '@/components/pages/page-shell'
import type { TravelMode } from '@/lib/emissions'
import { displayNameFor, getSession } from '@/lib/session'
import { formatGramsPrecise, formatNumber, MODE_LABELS, summarize } from '@/lib/trip-stats'

export const metadata: Metadata = {
  title: 'Travel data | Sustainabytes NME',
  description: 'Every route you have saved, with mode of transport and CO2 saved.',
}

const MODE_ICONS: Record<TravelMode, typeof Car> = { car: Car, bus: Bus, bike: Bike, walk: Footprints }

const dateFormat = new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'short' })

export default async function TravelDataPage() {
  const session = await getSession()
  if (!session?.user) redirect('/sign-in')

  const trips = await getTripHistory()
  const summary = summarize(trips)
  const totalKm = trips.reduce((acc, t) => acc + t.distanceKm, 0)

  return (
    <PageShell
      userName={displayNameFor(session.user)}
      eyebrow="Travel data"
      title="Your past trips"
      description="Every route you've saved: where it started, where it ended, how you travelled and what it saved."
    >
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Trips saved" value={summary.trips} />
        <StatCard label="Distance travelled" value={`${formatNumber(totalKm)} km`} />
        <StatCard
          label={
            <>
              <Co2 /> saved vs. driving
            </>
          }
          value={formatGramsPrecise(summary.savedGrams)}
        />
      </div>

      <h2 className="mt-12 font-serif text-2xl font-semibold text-foreground md:text-3xl">Trip history</h2>
      <p className="mt-1 text-muted-foreground">Newest first.</p>

      <div className="mt-6">
        {trips.length === 0 ? (
          <EmptyTrips />
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-border bg-card">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="border-b border-border bg-secondary/60 text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th scope="col" className="px-5 py-3 font-medium">From</th>
                  <th scope="col" className="px-5 py-3 font-medium">To</th>
                  <th scope="col" className="px-5 py-3 font-medium">Mode</th>
                  <th scope="col" className="px-5 py-3 text-right font-medium">Distance</th>
                  <th scope="col" className="px-5 py-3 text-right font-medium">
                    <Co2 /> saved
                  </th>
                  <th scope="col" className="px-5 py-3 font-medium">Saved on</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {trips.map((trip) => {
                  const Icon = MODE_ICONS[trip.mode]
                  return (
                    <tr key={trip.id} className="transition-colors hover:bg-secondary/40">
                      <td className="px-5 py-4 font-medium text-foreground">{trip.fromName}</td>
                      <td className="px-5 py-4 font-medium text-foreground">{trip.toName}</td>
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center gap-2 rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-primary">
                          <Icon className="size-3.5" aria-hidden="true" />
                          {MODE_LABELS[trip.mode]}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right tabular-nums text-foreground">
                        {formatNumber(trip.distanceKm)} km
                      </td>
                      <td className="px-5 py-4 text-right font-semibold tabular-nums text-primary">
                        {formatGramsPrecise(trip.co2SavedGrams)}
                      </td>
                      <td className="px-5 py-4 text-muted-foreground">{dateFormat.format(trip.createdAt)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </PageShell>
  )
}
