import { Hero } from '@/components/home/hero'
import { QuickOverview } from '@/components/home/quick-overview'
import { SiteFooter } from '@/components/home/site-footer'

export default function HomePage() {
  return (
    <>
      <main>
        <Hero />
        <QuickOverview />
      </main>
      <SiteFooter />
    </>
  )
}
