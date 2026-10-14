import Link from 'next/link'
import { Bell, Leaf } from 'lucide-react'
import { siteConfig } from '@/lib/site-config'

export function SiteHeader() {
  return (
    <header className="relative z-10">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-5 md:px-8">
        <Link href="/" className="flex items-center gap-2 text-white">
          <span className="flex size-9 items-center justify-center rounded-full bg-accent text-accent-foreground">
            <Leaf className="size-5" aria-hidden="true" />
          </span>
          <span className="font-serif text-lg font-semibold tracking-tight">{siteConfig.name}</span>
        </Link>

        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex items-center gap-1 rounded-full bg-white/10 p-1 backdrop-blur-md">
            {siteConfig.nav.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className="rounded-full px-4 py-1.5 text-sm text-white/90 transition-colors hover:bg-white/15 hover:text-white"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="flex size-9 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md transition-colors hover:bg-white/20"
          >
            <Bell className="size-4" aria-hidden="true" />
            <span className="sr-only">Notifications</span>
          </button>
          <span
            className="flex size-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground ring-2 ring-white/30"
            aria-label={`Signed in as ${siteConfig.userName}`}
          >
            {siteConfig.userName.charAt(0).toUpperCase()}
          </span>
        </div>
      </div>
    </header>
  )
}
