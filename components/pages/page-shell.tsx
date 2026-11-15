import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { SiteFooter } from '@/components/home/site-footer'
import { SiteHeader } from '@/components/home/site-header'

export function PageShell({
  userName,
  eyebrow,
  title,
  description,
  children,
}: {
  userName: string
  eyebrow: string
  title: React.ReactNode
  description: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <>
      <main>
        <section className="relative isolate">
          <Image src="/images/ny-forest.png" alt="" fill priority sizes="100vw" className="-z-20 object-cover" />
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 bg-gradient-to-b from-[oklch(0.25_0.06_155/0.65)] via-[oklch(0.25_0.06_155/0.6)] to-[oklch(0.2_0.05_155/0.9)]"
          />
          <SiteHeader userName={userName} />
          <div className="mx-auto max-w-6xl px-4 pb-14 pt-6 md:px-8 md:pb-20 md:pt-10">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-sm font-medium text-white backdrop-blur-md transition-colors hover:bg-white/20"
            >
              <ArrowLeft className="size-4" aria-hidden="true" />
              Home
            </Link>
            <span className="mt-6 block w-fit rounded-full bg-accent/90 px-3 py-1 text-xs font-medium uppercase tracking-widest text-accent-foreground">
              {eyebrow}
            </span>
            <h1 className="mt-4 text-balance font-serif text-4xl font-semibold tracking-tight text-white md:text-6xl">
              {title}
            </h1>
            <p className="mt-3 max-w-2xl text-pretty text-lg leading-relaxed text-white/85">{description}</p>
          </div>
        </section>
        <div className="mx-auto max-w-6xl px-4 py-10 md:px-8 md:py-14">{children}</div>
      </main>
      <SiteFooter />
    </>
  )
}

export function Co2() {
  return (
    <>
      CO<sub className="text-[0.7em]">2</sub>
    </>
  )
}

export function EmptyTrips() {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed border-border bg-card px-6 py-14 text-center">
      <p className="font-serif text-xl font-semibold text-foreground">No saved routes yet</p>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        Search a route on the home page, pick how you travelled, and press &ldquo;Save route&rdquo; to start your tally.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
      >
        Plan a route
      </Link>
    </div>
  )
}

export function StatCard({ label, value, hint }: { label: React.ReactNode; value: React.ReactNode; hint?: React.ReactNode }) {
  return (
    <div className="flex flex-col rounded-2xl border border-border bg-card p-5">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-2 font-serif text-3xl font-semibold text-primary">{value}</p>
      {hint ? <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{hint}</p> : null}
    </div>
  )
}
