import { redirect } from 'next/navigation'
import { getTripTally } from '@/app/actions/trips'
import { Hero } from '@/components/home/hero'
import { QuickOverview } from '@/components/home/quick-overview'
import { SiteFooter } from '@/components/home/site-footer'
import { TripProvider } from '@/components/home/trip-context'
import { displayNameFor, getSession } from '@/lib/session'

export default async function HomePage() {
  const session = await getSession()
  if (!session?.user) redirect('/sign-in')

  const tally = await getTripTally()

  return (
    <>
      <main>
        <TripProvider>
          <Hero userName={displayNameFor(session.user)} />
          <QuickOverview tally={tally} />
        </TripProvider>
      </main>
      <SiteFooter />
    </>
  )
}
