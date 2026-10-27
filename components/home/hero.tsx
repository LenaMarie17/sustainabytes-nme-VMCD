import Image from 'next/image'
import { siteConfig } from '@/lib/site-config'
import { SiteHeader } from './site-header'
import { TripSearch } from './trip-search'

export function Hero() {
  return (
    <section className="relative isolate z-10">
      <Image
        src="/images/ny-forest.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="-z-20 object-cover"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-b from-[oklch(0.25_0.06_155/0.55)] via-[oklch(0.25_0.06_155/0.45)] to-[oklch(0.2_0.05_155/0.85)]"
      />

      <SiteHeader />

      <div className="mx-auto flex max-w-3xl flex-col items-center px-4 pb-28 pt-16 text-center md:pb-36 md:pt-24">
        <span className="rounded-full bg-accent/90 px-3 py-1 text-xs font-medium uppercase tracking-widest text-accent-foreground">
          New York State
        </span>
        <h1 className="mt-6 text-balance font-serif text-5xl font-semibold tracking-tight text-white md:text-7xl">
          Hello, {siteConfig.userName}
        </h1>
        <p className="mt-4 max-w-xl text-pretty text-lg leading-relaxed text-white/85">
          {siteConfig.tagline}
        </p>

        <div id="explore" className="mt-10 w-full max-w-2xl text-left">
          <TripSearch />
        </div>
      </div>
    </section>
  )
}
