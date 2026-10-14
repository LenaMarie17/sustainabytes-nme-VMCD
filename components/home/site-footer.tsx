import { Leaf } from 'lucide-react'
import { siteConfig } from '@/lib/site-config'

export function SiteFooter() {
  return (
    <footer id="about" className="mt-20 border-t border-border bg-secondary/60">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-8 text-sm text-muted-foreground md:flex-row md:px-8">
        <p className="flex items-center gap-2">
          <Leaf className="size-4 text-primary" aria-hidden="true" />
          <span className="font-medium text-foreground">{siteConfig.name}</span>
        </p>
        <p>Building a greener New York, one byte at a time.</p>
      </div>
    </footer>
  )
}
