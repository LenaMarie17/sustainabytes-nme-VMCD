'use client'

import { useId, useMemo, useRef, useState } from 'react'
import { MapPin, Search, X } from 'lucide-react'
import { LOCATIONS, searchLocations, type Location } from '@/lib/locations'
import { cn } from '@/lib/utils'

type LocationSearchProps = {
  locations?: Location[]
  onSelect?: (location: Location) => void
}

export function LocationSearch({ locations = LOCATIONS, onSelect }: LocationSearchProps) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const [selected, setSelected] = useState<Location | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const listboxId = useId()

  const results = useMemo(() => searchLocations(query, locations), [query, locations])

  function choose(location: Location) {
    setSelected(location)
    setQuery(location.name)
    setOpen(false)
    onSelect?.(location)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setOpen(true)
      setActiveIndex((i) => Math.min(i + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter') {
      if (e.nativeEvent.isComposing || e.keyCode === 229) return
      e.preventDefault()
      const match = results[activeIndex]
      if (open && match) choose(match)
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  return (
    <div className="w-full">
      <form
        role="search"
        onSubmit={(e) => e.preventDefault()}
        className="relative"
      >
        <label htmlFor={`${listboxId}-input`} className="sr-only">
          Search locations
        </label>
        <div className="flex items-center gap-3 rounded-2xl border border-white/40 bg-card/95 px-4 py-3 shadow-xl shadow-black/20 backdrop-blur-md transition focus-within:ring-4 focus-within:ring-accent/60">
          <Search className="size-5 shrink-0 text-primary" aria-hidden="true" />
          <input
            ref={inputRef}
            id={`${listboxId}-input`}
            type="text"
            role="combobox"
            aria-expanded={open}
            aria-controls={listboxId}
            aria-autocomplete="list"
            aria-activedescendant={open && results[activeIndex] ? `${listboxId}-${results[activeIndex].id}` : undefined}
            autoComplete="off"
            placeholder="Search a location, e.g. Albany or Adirondacks"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setActiveIndex(0)
              setOpen(true)
              setSelected(null)
            }}
            onFocus={() => setOpen(true)}
            onBlur={() => setTimeout(() => setOpen(false), 120)}
            onKeyDown={handleKeyDown}
            className="min-w-0 flex-1 bg-transparent text-base text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('')
                setSelected(null)
                inputRef.current?.focus()
              }}
              className="flex size-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <X className="size-4" aria-hidden="true" />
              <span className="sr-only">Clear search</span>
            </button>
          )}
        </div>

        {open && (
          <ul
            id={listboxId}
            role="listbox"
            aria-label="Matching locations"
            className="absolute inset-x-0 top-full z-20 mt-2 max-h-72 overflow-auto rounded-2xl border border-border bg-popover p-1.5 shadow-2xl"
          >
            {results.length === 0 ? (
              <li className="px-3 py-4 text-center text-sm text-muted-foreground">
                No locations match &ldquo;{query}&rdquo;
              </li>
            ) : (
              results.map((loc, i) => (
                <li
                  key={loc.id}
                  id={`${listboxId}-${loc.id}`}
                  role="option"
                  aria-selected={i === activeIndex}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => choose(loc)}
                  onMouseEnter={() => setActiveIndex(i)}
                  className={cn(
                    'flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm',
                    i === activeIndex ? 'bg-secondary text-secondary-foreground' : 'text-popover-foreground',
                  )}
                >
                  <MapPin className="size-4 shrink-0 text-primary" aria-hidden="true" />
                  <span className="font-medium">{loc.name}</span>
                  <span className="ml-auto text-xs text-muted-foreground">{loc.region}</span>
                </li>
              ))
            )}
          </ul>
        )}
      </form>

      <p className="mt-3 text-sm text-white/80" aria-live="polite">
        {selected
          ? `Selected: ${selected.name}, ${selected.region}`
          : `${locations.length} locations available`}
      </p>
    </div>
  )
}
