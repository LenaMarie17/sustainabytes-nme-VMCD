import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { CampusMapLoader } from '@/components/map/campus-map-loader'

export const metadata: Metadata = {
  title: 'Campus Map | Sustainabytes NME',
  description: 'Interactive map of Cornell University North and Central Campus.',
}

export default function MapPage() {
  return (
    <main className="flex h-dvh flex-col bg-background">
      <header className="flex items-center gap-4 border-b border-border px-4 py-3 md:px-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium text-primary hover:bg-secondary"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Home
        </Link>
        <h1 className="font-serif text-xl font-semibold text-foreground">Campus map</h1>
        <p className="ml-auto hidden text-sm text-muted-foreground sm:block">North &amp; Central Campus</p>
      </header>
      <div className="relative z-0 flex-1">
        <CampusMapLoader />
      </div>
    </main>
  )
}
