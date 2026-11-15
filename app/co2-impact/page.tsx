import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { Fuel, Laptop, Lightbulb, MonitorPlay, Smartphone, TreePine, Wind } from 'lucide-react'
import { getTripHistory } from '@/app/actions/trips'
import { Co2, EmptyTrips, PageShell } from '@/components/pages/page-shell'
import { EMISSIONS_G_PER_KM } from '@/lib/emissions'
import { displayNameFor, getSession } from '@/lib/session'
import { cn } from '@/lib/utils'
import { EQUIVALENTS, formatGramsPrecise, formatNumber, summarize } from '@/lib/trip-stats'

export const metadata: Metadata = {
  title: 'What your saved CO2 can do | Sustainabytes NME',
  description: 'Your saved CO2 translated into trees, phone charges, gasoline and more.',
}

const FOREST_SIZE = 24

export default async function Co2ImpactPage() {
  const session = await getSession()
  if (!session?.user) redirect('/sign-in')

  const trips = await getTripHistory()
  const g = summarize(trips).savedGrams

  const treeYears = g / EQUIVALENTS.treeYearGrams
  const treeDays = treeYears * 365
  const litres = g * EQUIVALENTS.litresPerGram

  const equivalents = [
    {
      icon: Smartphone,
      value: formatNumber(g / EQUIVALENTS.phoneChargeGrams, 1),
      unit: 'smartphone charges',
      note: `${EQUIVALENTS.phoneChargeGrams} g each`,
      wide: true,
    },
    {
      icon: Lightbulb,
      value: formatNumber(g / EQUIVALENTS.ledHourGrams, 1),
      unit: 'hours of a 10 W LED bulb',
      note: `${EQUIVALENTS.ledHourGrams} g per hour`,
    },
    {
      icon: Fuel,
      value: formatNumber(g / EQUIVALENTS.gasolineGallonGrams, 4),
      unit: 'gallons of gasoline not burned',
      note: `${formatNumber(EQUIVALENTS.gasolineGallonGrams, 0)} g per gallon`,
    },
    {
      icon: Laptop,
      value: formatNumber(g / EQUIVALENTS.laptopHourGrams, 2),
      unit: 'hours of laptop use',
      note: `${EQUIVALENTS.laptopHourGrams} g per hour`,
    },
    {
      icon: MonitorPlay,
      value: formatNumber(g / EQUIVALENTS.streamingHourGrams, 2),
      unit: 'hours of HD streaming',
      note: `${EQUIVALENTS.streamingHourGrams} g per hour`,
    },
    {
      icon: Wind,
      value: formatNumber(litres / EQUIVALENTS.balloonLitres, 2),
      unit: (
        <>
          party balloons of <Co2 /> gas
        </>
      ),
      note: `${formatNumber(litres, 1)} litres in total`,
      wide: true,
    },
  ]

  const filledTrees = Math.min(FOREST_SIZE, treeDays / 30)

  return (
    <PageShell
      userName={displayNameFor(session.user)}
      eyebrow="Impact"
      title={
        <>
          See what your saved <Co2 /> can do
        </>
      }
      description="Your savings, translated into things you can picture."
    >
      {trips.length === 0 ? (
        <EmptyTrips />
      ) : (
        <>
          <section
            aria-labelledby="forest-heading"
            className="relative overflow-hidden rounded-3xl bg-[oklch(0.24_0.05_155)] px-6 py-12 text-white md:px-12 md:py-16"
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-24 -top-24 size-80 rounded-full border-[28px] border-white/5"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-8 -top-8 size-48 rounded-full border-[18px] border-white/5"
            />
            <p className="text-sm uppercase tracking-widest text-accent">You&apos;ve kept out of the air</p>
            <p className="mt-3 font-serif text-6xl font-semibold tracking-tight md:text-8xl">
              {formatGramsPrecise(g)}
            </p>
            <p className="mt-2 text-white/75">
              of <Co2 />, across {trips.length} saved {trips.length === 1 ? 'route' : 'routes'}.
            </p>

            <div className="mt-12 grid items-end gap-10 md:grid-cols-[1fr_auto]">
              <div>
                <h2 id="forest-heading" className="font-serif text-2xl font-semibold md:text-3xl">
                  Your forest
                </h2>
                <p className="mt-2 max-w-md text-pretty leading-relaxed text-white/75">
                  A mature tree absorbs about {formatNumber(EQUIVALENTS.treeYearGrams / 1000, 2)} kg of <Co2 /> a
                  year. Your savings equal{' '}
                  <strong className="font-semibold text-accent">{formatNumber(treeDays, 2)} days</strong> of one
                  tree&apos;s work, or <strong className="font-semibold text-accent">{formatNumber(treeYears, 4)}</strong>{' '}
                  tree-years. Each tree below is one month.
                </p>
              </div>
              <ul
                className="grid grid-cols-8 gap-2 md:gap-3"
                aria-label={`${formatNumber(filledTrees, 2)} of ${FOREST_SIZE} tree-months grown`}
              >
                {Array.from({ length: FOREST_SIZE }, (_, i) => {
                  const fill = Math.max(0, Math.min(1, filledTrees - i))
                  return (
                    <li key={i} className="relative size-7 md:size-9" aria-hidden="true">
                      <TreePine className="absolute inset-0 size-full text-white/15" />
                      <span className="absolute inset-0 overflow-hidden" style={{ clipPath: `inset(${(1 - fill) * 100}% 0 0 0)` }}>
                        <TreePine className="size-full text-accent" />
                      </span>
                    </li>
                  )
                })}
              </ul>
            </div>
          </section>

          <h2 className="mt-14 font-serif text-2xl font-semibold text-foreground md:text-3xl">It&apos;s the same as...</h2>
          <p className="mt-1 text-muted-foreground">Every figure below equals the {formatGramsPrecise(g)} you saved.</p>

          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {equivalents.map(({ icon: Icon, value, unit, note, wide }, i) => (
              <li
                key={note}
                className={cn(
                  'flex flex-col justify-between gap-6 rounded-3xl border p-6',
                  wide ? 'lg:col-span-2' : '',
                  i % 3 === 0
                    ? 'border-transparent bg-primary text-primary-foreground'
                    : 'border-border bg-card text-foreground',
                )}
              >
                <span
                  className={cn(
                    'flex size-11 items-center justify-center rounded-2xl',
                    i % 3 === 0 ? 'bg-white/15' : 'bg-secondary text-primary',
                  )}
                >
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="font-serif text-4xl font-semibold tabular-nums tracking-tight md:text-5xl">{value}</p>
                  <p className="mt-1 font-medium">{unit}</p>
                  <p className={cn('mt-1 text-xs', i % 3 === 0 ? 'text-primary-foreground/70' : 'text-muted-foreground')}>
                    {note}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          <p className="mt-8 rounded-2xl bg-secondary px-5 py-4 text-sm leading-relaxed text-secondary-foreground">
            That&apos;s also {formatNumber(g / EMISSIONS_G_PER_KM.car, 3)} km of solo driving you didn&apos;t do. Figures
            are averages from US EPA and IEA estimates; edit them in <code className="font-mono">lib/trip-stats.ts</code>.
          </p>
        </>
      )}
    </PageShell>
  )
}
