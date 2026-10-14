import { Bookmark, Droplets, Recycle, Sprout, Wind, Zap } from 'lucide-react'

const stats = [
  { label: 'Tracked locations', value: '—', icon: Sprout },
  { label: 'Air quality index', value: '—', icon: Wind },
  { label: 'Renewable energy', value: '—', icon: Zap },
]

const actions = [
  { title: 'Water usage', description: 'Compare consumption across regions.', icon: Droplets },
  { title: 'Waste & recycling', description: 'See diversion rates by county.', icon: Recycle },
  { title: 'Saved locations', description: 'Quick access to places you follow.', icon: Bookmark },
]

export function QuickOverview() {
  return (
    <section aria-labelledby="overview-heading" className="mt-12 px-4 md:px-8">
      <div className="mx-auto max-w-6xl">
        <h2 id="overview-heading" className="sr-only">
          Overview
        </h2>
        <ul className="grid gap-4 sm:grid-cols-3">
          {stats.map(({ label, value, icon: Icon }) => (
            <li
              key={label}
              className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5 shadow-lg shadow-primary/5"
            >
              <span className="flex size-11 items-center justify-center rounded-xl bg-secondary text-primary">
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm text-muted-foreground">{label}</p>
                <p className="font-serif text-2xl font-semibold text-foreground">{value}</p>
              </div>
            </li>
          ))}
        </ul>

        <div id="saved" className="mt-14">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="font-serif text-2xl font-semibold text-foreground md:text-3xl">Get started</h2>
              <p className="mt-1 text-muted-foreground">Jump into a topic once your data is connected.</p>
            </div>
          </div>
          <ul className="mt-6 grid gap-4 md:grid-cols-3">
            {actions.map(({ title, description, icon: Icon }) => (
              <li key={title}>
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
