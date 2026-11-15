'use client'

import { Bike, Bookmark, Car, Check, Footprints, Loader2, RotateCcw, Route } from 'lucide-react'
import { emissionsFor, formatDistance, formatGrams, type TravelMode } from '@/lib/emissions'
import { LocationSearch } from './location-search'
import { useTrip } from './trip-context'

export function TripSearch() {
  const { from, to, distances, loading, error, resetKey, setFrom, setTo, search, clear } = useTrip()
  const showClear = distances !== null || error !== null || from !== null || to !== null

  return (
    <div className="flex flex-col gap-4">
      <div className="relative z-30">
        <LocationSearch
          key={`from-${resetKey}`}
          label="From"
          placeholder="Starting point, e.g. Appel Commons"
          onSelect={setFrom}
        />
      </div>
      <div className="relative z-20">
        <LocationSearch
          key={`to-${resetKey}`}
          label="To"
          placeholder="Destination, e.g. Olin Library"
          onSelect={setTo}
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={search}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-2.5 font-semibold text-accent-foreground shadow-lg shadow-black/20 transition hover:brightness-105 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent/60 disabled:opacity-70"
        >
          {loading ? (
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          ) : (
            <Route className="size-4" aria-hidden="true" />
          )}
          {loading ? 'Calculating…' : 'Search route'}
        </button>
        {showClear && (
          <button
            type="button"
            onClick={clear}
            className="inline-flex items-center gap-2 rounded-xl border border-white/50 bg-white/10 px-5 py-2.5 font-semibold text-white backdrop-blur transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/40"
          >
            <RotateCcw className="size-4" aria-hidden="true" />
            Clear
          </button>
        )}
      </div>

      <div aria-live="polite">
        {error && (
          <p className="rounded-xl bg-destructive/90 px-4 py-2.5 text-sm font-medium text-white">{error}</p>
        )}
        {distances && from && to && (
          <div className="rounded-2xl border border-white/30 bg-card/95 p-4 text-card-foreground shadow-xl shadow-black/20 backdrop-blur-md">
            <p className="text-sm text-muted-foreground">
              {from.name} <span aria-hidden="true">→</span>
              <span className="sr-only">to</span> {to.name}
            </p>
            <dl className="mt-3 grid gap-3 sm:grid-cols-3">
              <DistanceItem icon={Car} label="Car / bus (roads)" metres={distances.car} />
              <DistanceItem icon={Bike} label="Bike (roads)" metres={distances.bike} />
              <DistanceItem icon={Footprints} label="Walking (roads & paths)" metres={distances.walk} />
            </dl>
            <SaveRoute />
          </div>
        )}
      </div>
    </div>
  )
}

const MODE_LABELS: Record<TravelMode, string> = {
  car: 'Car',
  bus: 'Bus',
  bike: 'Bike',
  walk: 'Walking',
}

function SaveRoute() {
  const { distances, mode, saving, saveStatus, save } = useTrip()
  if (!distances) return null
  const saved = mode ? Math.max(0, emissionsFor('car', distances.car) - emissionsFor(mode, distances[mode])) : 0

  return (
    <div className="mt-4 flex flex-col gap-2 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-muted-foreground">
        {mode ? (
          <>
            <span className="font-semibold text-foreground">{MODE_LABELS[mode]}</span> saves{' '}
            <span className="font-semibold text-primary">{formatGrams(saved)}</span> CO
            <sub className="text-[0.7em]">2</sub> vs. driving.
          </>
        ) : (
          'Pick a route below, then save it to add to your tally.'
        )}
      </p>
      <button
        type="button"
        onClick={save}
        disabled={!mode || saving || saveStatus?.kind === 'success'}
        className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/40 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {saving ? (
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
        ) : saveStatus?.kind === 'success' ? (
          <Check className="size-4" aria-hidden="true" />
        ) : (
          <Bookmark className="size-4" aria-hidden="true" />
        )}
        {saving ? 'Saving…' : saveStatus?.kind === 'success' ? 'Saved' : 'Save route'}
      </button>
      {saveStatus && (
        <p
          className={
            saveStatus.kind === 'success'
              ? 'text-sm font-medium text-primary sm:basis-full'
              : 'text-sm font-medium text-destructive sm:basis-full'
          }
        >
          {saveStatus.message}
        </p>
      )}
    </div>
  )
}

function DistanceItem({
  icon: Icon,
  label,
  metres,
}: {
  icon: typeof Car
  label: string
  metres: number
}) {
  return (
    <div className="flex items-start gap-2.5">
      <Icon className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
      <div>
        <dt className="text-xs text-muted-foreground">{label}</dt>
        <dd className="font-semibold text-foreground">{formatDistance(metres)}</dd>
      </div>
    </div>
  )
}
