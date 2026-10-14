'use client'

import { useState } from 'react'
import { BarChart3, Bike, Bus, Car, Footprints, Leaf, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

function Co2() {
  return (
    <>
      CO<sub className="text-[0.7em]">2</sub>
    </>
  )
}

/** Placeholder emission figures (g CO2 per km, per person). Replace with your own data. */
const routes = [
  { id: 'car', label: 'Car route', emissions: '~170 g', icon: Car },
  { id: 'bus', label: 'Bus route', emissions: '~90 g', icon: Bus },
  { id: 'bike', label: 'Bike route', emissions: '0 g', icon: Bike },
  { id: 'walk', label: 'Walking route', emissions: '0 g', icon: Footprints },
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

  return (
    <section aria-labelledby="routes-heading" className="mt-12 px-4 md:px-8">
      <div className="mx-auto max-w-6xl">
        <h2 id="routes-heading" className="sr-only">
          Choose a route
        </h2>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {routes.map(({ id, label, emissions, icon: Icon }) => {
            const isActive = activeRoute === id
            return (
              <li key={id}>
                <button
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => setActiveRoute(isActive ? null : id)}
                  className={cn(
                    'flex w-full items-center gap-4 rounded-2xl border bg-card p-5 text-left shadow-lg shadow-primary/5 transition hover:-translate-y-0.5 hover:border-primary/40 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/40',
                    isActive ? 'border-primary ring-2 ring-primary/40' : 'border-border',
                  )}
                >
                  <span
                    className={cn(
                      'flex size-11 shrink-0 items-center justify-center rounded-xl',
                      isActive ? 'bg-primary text-primary-foreground' : 'bg-secondary text-primary',
                    )}
                  >
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <span>
                    <span className="block font-serif text-lg font-semibold text-foreground">{label}</span>
                    <span className="block text-sm text-muted-foreground">
                      {emissions} <Co2 />
                      /km
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
        </div>
      </div>
    </section>
  )
}
