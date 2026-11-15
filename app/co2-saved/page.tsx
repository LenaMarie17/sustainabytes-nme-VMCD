import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getTripHistory } from '@/app/actions/trips'
import { Co2, EmptyTrips, PageShell, StatCard } from '@/components/pages/page-shell'
import { EMISSIONS_G_PER_KM, type TravelMode } from '@/lib/emissions'
import { displayNameFor, getSession } from '@/lib/session'
import { formatGramsPrecise, formatNumber, MODE_LABELS, summarize } from '@/lib/trip-stats'

export const metadata: Metadata = {
  title: 'CO2 saved by not driving | Sustainabytes NME',
  description: 'How much CO2 you avoided by walking, cycling and taking the bus instead of driving.',
}

const MODES: TravelMode[] = ['walk', 'bike', 'bus', 'car']

export default async function Co2SavedPage() {
  const session = await getSession()
  if (!session?.user) redirect('/sign-in')

  const trips = await getTripHistory()
  const s = summarize(trips)
  const greenTrips = s.byMode.walk.trips + s.byMode.bike.trips

  return (
    <PageShell
      userName={displayNameFor(session.user)}
      eyebrow="Savings"
      title={
        <>
          <Co2 /> saved by not driving
        </>
      }
      description="Compared with driving every saved route alone in an average car."
    >
      {trips.length === 0 ? (
        <EmptyTrips />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              label={
                <>
                  Total <Co2 /> saved
                </>
              }
              value={formatGramsPrecise(s.savedGrams)}
              hint={`${formatNumber(s.savedShare * 100, 1)}% of your driving baseline`}
            />
            <StatCard
              label={
                <>
                  <Co2 /> actually emitted
                </>
              }
              value={formatGramsPrecise(s.emittedGrams)}
              hint="From the car and bus trips you saved"
            />
            <StatCard
              label="If you had driven every trip"
              value={formatGramsPrecise(s.carBaselineGrams)}
              hint={`At ${EMISSIONS_G_PER_KM.car} g per km`}
            />
            <StatCard
              label="Walking & cycling trips"
              value={`${greenTrips} of ${s.trips}`}
              hint="Zero-emission journeys"
            />
          </div>

          <h2 className="mt-12 font-serif text-2xl font-semibold text-foreground md:text-3xl">Savings by mode</h2>
          <p className="mt-1 text-muted-foreground">What each way of travelling saved compared with the car.</p>
          <div className="mt-6 overflow-x-auto rounded-2xl border border-border bg-card">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead className="border-b border-border bg-secondary/60 text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th scope="col" className="px-5 py-3 font-medium">Comparison</th>
                  <th scope="col" className="px-5 py-3 text-right font-medium">Trips</th>
                  <th scope="col" className="px-5 py-3 text-right font-medium">Distance</th>
                  <th scope="col" className="px-5 py-3 text-right font-medium">
                    <Co2 /> saved
                  </th>
                  <th scope="col" className="px-5 py-3 font-medium">Share of savings</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {MODES.map((mode) => {
                  const m = s.byMode[mode]
                  const share = s.savedGrams > 0 ? m.savedGrams / s.savedGrams : 0
                  return (
                    <tr key={mode}>
                      <td className="px-5 py-4 font-medium text-foreground">
                        {mode === 'car' ? 'Car (no saving)' : `${MODE_LABELS[mode]} instead of car`}
                      </td>
                      <td className="px-5 py-4 text-right tabular-nums">{m.trips}</td>
                      <td className="px-5 py-4 text-right tabular-nums">{formatNumber(m.km)} km</td>
                      <td className="px-5 py-4 text-right font-semibold tabular-nums text-primary">
                        {formatGramsPrecise(m.savedGrams)}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-2 w-28 overflow-hidden rounded-full bg-secondary" aria-hidden="true">
                            <div className="h-full rounded-full bg-primary" style={{ width: `${share * 100}%` }} />
                          </div>
                          <span className="tabular-nums text-muted-foreground">{formatNumber(share * 100, 1)}%</span>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <h2 className="mt-12 font-serif text-2xl font-semibold text-foreground md:text-3xl">What if?</h2>
          <p className="mt-1 text-muted-foreground">How your savings would change with different choices on the same routes.</p>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <StatCard
              label="If you had only walked or cycled"
              value={formatGramsPrecise(s.maxPossibleGrams)}
              hint={
                s.missedGrams > 0
                  ? `${formatGramsPrecise(s.missedGrams)} more than you saved`
                  : 'You already saved the maximum possible'
              }
            />
            <StatCard
              label="If you had only taken the bus"
              value={formatGramsPrecise(s.allBusGrams)}
              hint={`Bus emits ~${EMISSIONS_G_PER_KM.bus} g per passenger-km vs ${EMISSIONS_G_PER_KM.car} g by car`}
            />
            <StatCard
              label="Room left to improve"
              value={`${formatNumber((1 - s.savedShare) * 100, 1)}%`}
              hint="Of your driving baseline still emitted"
            />
          </div>
        </>
      )}
    </PageShell>
  )
}
