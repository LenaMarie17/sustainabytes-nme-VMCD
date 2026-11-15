import Image from 'next/image'
import { Leaf } from 'lucide-react'
import { siteConfig } from '@/lib/site-config'

export function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle: string
  children: React.ReactNode
}) {
  return (
    <main className="relative isolate flex min-h-dvh items-center justify-center px-4 py-12">
      <Image src="/images/ny-forest.png" alt="" fill priority sizes="100vw" className="-z-20 object-cover" />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-b from-[oklch(0.25_0.06_155/0.6)] to-[oklch(0.2_0.05_155/0.85)]"
      />

      <div className="flex w-full max-w-sm flex-col items-center gap-6">
        <div className="flex items-center gap-2 text-white">
          <span className="flex size-10 items-center justify-center rounded-full bg-accent text-accent-foreground">
            <Leaf className="size-5" aria-hidden="true" />
          </span>
          <span className="font-serif text-xl font-semibold tracking-tight">{siteConfig.name}</span>
        </div>

        <div className="w-full rounded-2xl border border-white/30 bg-card/95 p-6 text-card-foreground shadow-2xl shadow-black/30 backdrop-blur-md md:p-8">
          <h1 className="font-serif text-2xl font-semibold text-foreground">{title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
          <div className="mt-6">{children}</div>
        </div>
      </div>
    </main>
  )
}
