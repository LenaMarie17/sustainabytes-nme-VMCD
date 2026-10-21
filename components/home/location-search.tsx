'use client'

import { useId, useMemo, useRef, useState } from 'react'
import { MapPin, Search, X } from 'lucide-react'
import { CAMPUSES, LOCATIONS, searchLocations, type Location } from '@/lib/locations'
import { cn } from '@/lib/utils'

type LocationSearchProps = {
  label?: string
  placeholder?: string
  locations?: Location[]
  onSelect?: (location: Location | null) => void
}

export function LocationSearch({
  label,
  placeholder = 'Search a building, e.g. Appel Commons or Olin Library',
  locations = LOCATIONS,
  onSelect,
}: LocationSearchProps) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const [selected, setSelected] = useState<Location | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const listboxId = useId()

  const results = useMemo(() => searchLocations(query, locations), [query, locations])
  const groups = useMemo(
    () =>
      CAMPUSES.map((campus) => ({
        campus,
        items: results
          .map((loc, index) => ({ loc, index }))
          .filter(({ loc }) => loc.campus === campus),
      })).filter((group) => group.items.length > 0),
    [results],
  )

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
      <form role="search" onSubmit={(e) => e.preventDefault()} className="relative">
        <label htmlFor={`${listboxId}-input`} className="sr-only">
          {label ? `${label}: search campus locations` : 'Search campus locations'}
        </label>
        <div className="flex items-center gap-3 rounded-2xl border border-white/40 bg-card/95 px-4 py-3 shadow-xl shadow-black/20 backdrop-blur-md transition focus-within:ring-4 focus-within:ring-accent/60">
          {label ? (
            <span
              aria-hidden="true"
              className="w-12 shrink-0 text-xs font-semibold uppercase tracking-widest text-primary"
            >
              {label}
            </span>
          ) : (
            <Search className="size-5 shrink-0 text-primary" aria-hidden="true" />
          )}
          <input
            ref={inputRef}
            id={`${listboxId}-input`}
            type="text"
            role="combobox"
            aria-expanded={open}
            aria-controls={listboxId}
            aria-autocomplete="list"
            aria-activedescendant={
              open && results[activeIndex] ? `${listboxId}-${results[activeIndex].id}` : undefined
            }
            autoComplete="off"
            placeholder={placeholder}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setActiveIndex(0)
              setOpen(true)
              if (selected) onSelect?.(null)
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
                if (selected) onSelect?.(null)
                setSelected(null)
                setActiveIndex(0)
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
          <div
            id={listboxId}
            role="listbox"
            aria-label="Matching locations"
            className="absolute inset-x-0 top-full z-20 mt-2 max-h-80 overflow-auto rounded-2xl border border-border bg-popover p-1.5 shadow-2xl"
          >
            {groups.length === 0 ? (
              <p className="px-3 py-4 text-center text-sm text-muted-foreground">
                No locations match &ldquo;{query}&rdquo;
              </p>
            ) : (
              groups.map(({ campus, items }) => (
                <div key={campus} role="group" aria-labelledby={`${listboxId}-${campus}`}>
                  <div
                    id={`${listboxId}-${campus}`}
                    className="sticky top-0 z-10 flex items-center justify-between rounded-lg bg-popover/95 px-3 pb-1.5 pt-2.5 text-xs font-semibold uppercase tracking-widest text-primary backdrop-blur"
                  >
                    <span>{campus} Campus</span>
                    <span className="font-normal normal-case tracking-normal text-muted-foreground">
                      {items.length}
                    </span>
                  </div>
                  {items.map(({ loc, index }) => (
                    <div
                      key={loc.id}
                      id={`${listboxId}-${loc.id}`}
                      role="option"
                      aria-selected={index === activeIndex}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => choose(loc)}
                      onMouseEnter={() => setActiveIndex(index)}
                      className={cn(
                        'flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm',
                        index === activeIndex
                          ? 'bg-secondary text-secondary-foreground'
                          : 'text-popover-foreground',
                      )}
                    >
                      <MapPin className="size-4 shrink-0 text-primary" aria-hidden="true" />
                      <span className="font-medium">{loc.name}</span>
                    </div>
                  ))}
                </div>
              ))
            )}
          </div>
        )}
      </form>

      <p className="mt-1.5 pl-1 text-xs text-white/80" aria-live="polite">
        {selected
          ? `Selected: ${selected.name}, ${selected.campus} Campus`
          : query
            ? `${results.length} matching location${results.length === 1 ? '' : 's'}`
            : `${locations.length} locations across North and Central Campus`}
      </p>
    </div>
  )
}
