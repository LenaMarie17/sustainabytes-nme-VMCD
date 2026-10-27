import { Hero } from '@/components/home/hero'
import { QuickOverview } from '@/components/home/quick-overview'
import { SiteFooter } from '@/components/home/site-footer'
import { TripProvider } from '@/components/home/trip-context'

export default function HomePage() {
  return (
    <>
      <main>
        <TripProvider>
          <Hero />
          <QuickOverview />
        </TripProvider>
      </main>
      <SiteFooter />
    </>
  )
}
