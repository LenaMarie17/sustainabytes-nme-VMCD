'use client'

import { createContext, useContext, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { saveTrip } from '@/app/actions/trips'
import type { Location } from '@/lib/locations'
import type { RouteDistances, TravelMode } from '@/lib/emissions'

type SaveStatus = { kind: 'success' | 'error'; message: string } | null

type TripState = {
  from: Location | null
  to: Location | null
  distances: RouteDistances | null
  loading: boolean
  error: string | null
  resetKey: number
  mode: TravelMode | null
  saving: boolean
  saveStatus: SaveStatus
  setFrom: (location: Location | null) => void
  setTo: (location: Location | null) => void
  setMode: (mode: TravelMode | null) => void
  search: () => Promise<void>
  save: () => Promise<void>
  clear: () => void
}

const TripContext = createContext<TripState | null>(null)

export function TripProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [from, setFromState] = useState<Location | null>(null)
  const [to, setToState] = useState<Location | null>(null)
  const [distances, setDistances] = useState<RouteDistances | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [resetKey, setResetKey] = useState(0)
  const [mode, setModeState] = useState<TravelMode | null>(null)
  const [saving, setSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<SaveStatus>(null)
  // Incremented whenever inputs change so a slow, outdated response is ignored.
  const requestId = useRef(0)

  function invalidate() {
    requestId.current += 1
    setDistances(null)
    setError(null)
    setLoading(false)
    setSaveStatus(null)
  }

  function setFrom(location: Location | null) {
    setFromState(location)
    invalidate()
  }

  function setTo(location: Location | null) {
    setToState(location)
    invalidate()
  }

  function setMode(next: TravelMode | null) {
    setModeState(next)
    setSaveStatus(null)
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
    const id = ++requestId.current
    setLoading(true)
    setError(null)
    setSaveStatus(null)
    try {
      const params = new URLSearchParams({ from: from.id, to: to.id })
      const res = await fetch(`/api/route?${params}`)
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error ?? 'Could not calculate the route.')
      if (id === requestId.current) setDistances(data as RouteDistances)
    } catch (e) {
      if (id !== requestId.current) return
      setDistances(null)
      setError(e instanceof Error ? e.message : 'Could not calculate the route.')
    } finally {
      if (id === requestId.current) setLoading(false)
    }
  }

  async function save() {
    if (!from || !to || !distances || !mode || saving) return
    setSaving(true)
    setSaveStatus(null)
    try {
      const result = await saveTrip(from.id, to.id, mode)
      if (result.ok) {
        setSaveStatus({ kind: 'success', message: 'Route saved to your tally.' })
        router.refresh()
      } else {
        setSaveStatus({ kind: 'error', message: result.error })
      }
    } catch {
      setSaveStatus({ kind: 'error', message: 'Could not save this route. Please try again.' })
    } finally {
      setSaving(false)
    }
  }

  function clear() {
    setFromState(null)
    setToState(null)
    setModeState(null)
    invalidate()
    setResetKey((k) => k + 1)
  }

  return (
    <TripContext.Provider
      value={{
        from,
        to,
        distances,
        loading,
        error,
        resetKey,
        mode,
        saving,
        saveStatus,
        setFrom,
        setTo,
        setMode,
        search,
        save,
        clear,
      }}
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
