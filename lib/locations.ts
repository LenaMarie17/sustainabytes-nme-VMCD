export type Location = {
  id: string
  name: string
  region: string
}

/**
 * The set list of searchable locations.
 * Replace or extend these placeholder entries with your real data.
 * The search box on the home screen reads directly from this array.
 */
export const LOCATIONS: Location[] = [
  { id: 'albany', name: 'Albany', region: 'Capital District' },
  { id: 'buffalo', name: 'Buffalo', region: 'Western New York' },
  { id: 'ithaca', name: 'Ithaca', region: 'Finger Lakes' },
  { id: 'lake-placid', name: 'Lake Placid', region: 'Adirondacks' },
  { id: 'new-york-city', name: 'New York City', region: 'Downstate' },
  { id: 'rochester', name: 'Rochester', region: 'Finger Lakes' },
  { id: 'saratoga-springs', name: 'Saratoga Springs', region: 'Capital District' },
  { id: 'syracuse', name: 'Syracuse', region: 'Central New York' },
]

export function searchLocations(query: string, list: Location[] = LOCATIONS) {
  const q = query.trim().toLowerCase()
  if (!q) return list
  return list.filter(
    (loc) => loc.name.toLowerCase().includes(q) || loc.region.toLowerCase().includes(q),
  )
}
