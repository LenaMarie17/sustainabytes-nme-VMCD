'use client'

import { createContext, useContext, useState } from 'react'
import type { Location } from '@/lib/locations'
import type { RouteDistances } from '@/lib/emissions'

type TripState = {
  from: Location | null
  to: Location | null
  distances: RouteDistances | null
  loading: boolean
  error: string | null
  resetKey: number
  setFrom: (location: Location | null) => void
  setTo: (location: Location | null) => void
  search: () => Promise<void>
  clear: () => void
}

const TripContext = createContext<TripState | null>(null)

export function TripProvider({ children }: { children: React.ReactNode }) {
  const [from, setFromState] = useState<Location | null>(null)
  const [to, setToState] = useState<Location | null>(null)
  const [distances, setDistances] = useState<RouteDistances | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [resetKey, setResetKey] = useState(0)

  function setFrom(location: Location | null) {
    setFromState(location)
    setDistances(null)
    setError(null)
  }

  function setTo(location: Location | null) {
    setToState(location)
    setDistances(null)
    setError(null)
  }

  async function search() {
    if (!from || !to) {
      setError('Choose a location from both lists first.')
      return
    }
    if (from.id === to.id) {
      setError('Choose two different locations.')
      return
    }
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams({ from: from.id, to: to.id })
      const res = await fetch(`/api/route?${params}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Could not calculate the route.')
      setDistances(data as RouteDistances)
    } catch (e) {
      setDistances(null)
      setError(e instanceof Error ? e.message : 'Could not calculate the route.')
    } finally {
      setLoading(false)
    }
  }

  function clear() {
    setFromState(null)
    setToState(null)
    setDistances(null)
    setError(null)
    setResetKey((k) => k + 1)
  }

  return (
    <TripContext.Provider
      value={{ from, to, distances, loading, error, resetKey, setFrom, setTo, search, clear }}
    >
      {children}
    </TripContext.Provider>
  )
}

export function useTrip() {
  const ctx = useContext(TripContext)
  if (!ctx) throw new Error('useTrip must be used inside <TripProvider>')
  return ctx
}
