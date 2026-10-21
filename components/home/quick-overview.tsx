'use client'

import { useState } from 'react'
import Link from 'next/link'
import { BarChart3, Bike, Bus, Car, Footprints, Leaf, Map as MapIcon, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import { emissionsFor, formatGrams, type TravelMode } from '@/lib/emissions'
import { useTrip } from './trip-context'

function Co2() {
  return (
    <>
      CO<sub className="text-[0.7em]">2</sub>
    </>
  )
}

const routes: { id: TravelMode; label: string; icon: typeof Car }[] = [
  { id: 'car', label: 'Car route', icon: Car },
  { id: 'bus', label: 'Bus route', icon: Bus },
  { id: 'bike', label: 'Bike route', icon: Bike },
  { id: 'walk', label: 'Walking route', icon: Footprints },
]

const actions = [
  { title: <>Travel data</>, description: 'Distance, time and emissions for your trips.', icon: BarChart3 },
  {
    title: (
      <>
        <Co2 /> saved by not driving
      </>
    ),
    description: 'How much carbon you avoided by choosing a greener route.',
    icon: Leaf,
  },
  {
    title: (
      <>
        See what your saved <Co2 /> can do
      </>
    ),
    description: 'Turn your savings into trees, charged phones and more.',
    icon: Sparkles,
  },
]

export function QuickOverview() {
  const [activeRoute, setActiveRoute] = useState<string | null>(null)
  const { distances } = useTrip()

  return (
    <section aria-labelledby="routes-heading" className="mt-12 px-4 md:px-8">
      <div className="mx-auto max-w-6xl">
        <h2 id="routes-heading" className="sr-only">
          Choose a route
        </h2>
        <ul className="grid grid-cols-4 gap-2 md:gap-3">
          {routes.map(({ id, label, icon: Icon }) => {
            const isActive = activeRoute === id
            const emissions = distances ? formatGrams(emissionsFor(id, distances[id])) : '?'
            return (
              <li key={id} className="min-w-0">
                <button
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => setActiveRoute(isActive ? null : id)}
                  className={cn(
                    'flex h-full w-full flex-col items-center gap-1.5 rounded-xl border bg-card px-2 py-3 text-center shadow-md shadow-primary/5 transition hover:-translate-y-0.5 hover:border-primary/40 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/40 md:flex-row md:gap-3 md:px-4 md:text-left',
                    isActive ? 'border-primary ring-2 ring-primary/40' : 'border-border',
                  )}
                >
                  <span
                    className={cn(
                      'flex size-8 shrink-0 items-center justify-center rounded-lg md:size-9',
                      isActive ? 'bg-primary text-primary-foreground' : 'bg-secondary text-primary',
                    )}
                  >
                    <Icon className="size-4" aria-hidden="true" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-xs font-semibold text-foreground md:text-sm">{label}</span>
                    <span className="block text-[11px] text-muted-foreground md:text-xs">
                      {emissions} <Co2 />
                      {distances ? ' this trip' : ''}
                    </span>
                  </span>
                </button>
              </li>
            )
          })}
        </ul>

        <div className="mt-14">
          <h2 className="font-serif text-2xl font-semibold text-foreground md:text-3xl">Your impact</h2>
          <p className="mt-1 text-muted-foreground">See how your travel choices add up.</p>
          <ul className="mt-6 grid gap-4 md:grid-cols-3">
            {actions.map(({ title, description, icon: Icon }, i) => (
              <li key={i}>
                <a
                  href="#"
                  className="group flex h-full flex-col rounded-2xl border border-border bg-card p-6 transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10"
                >
                  <span className="flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <h3 className="mt-4 font-semibold text-foreground">{title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{description}</p>
                  <span className="mt-4 text-sm font-medium text-primary group-hover:underline">Open</span>
                </a>
              </li>
            ))}
          </ul>
          <Link
            href="/map"
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-4 text-center font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition hover:-translate-y-0.5 hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/40"
          >
            <MapIcon className="size-5" aria-hidden="true" />
            See campus map
          </Link>
        </div>
      </div>
    </section>
  )
}
