'use client'

import dynamic from 'next/dynamic'

export const CampusMapLoader = dynamic(() => import('./campus-map').then((m) => m.CampusMap), {
  ssr: false,
  loading: () => (
    <div className="flex size-full items-center justify-center text-muted-foreground">Loading map…</div>
  ),
})
