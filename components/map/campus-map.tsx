'use client'

import 'leaflet/dist/leaflet.css'
import { CircleMarker, MapContainer, TileLayer, Tooltip } from 'react-leaflet'

/** Map centre sits between North and Central Campus at Cornell University, Ithaca NY. */
const CAMPUS_CENTER: [number, number] = [42.4512, -76.4795]
const CAMPUS_ZOOM = 16

/** Area labels. Add per-building markers here later (lat, lng). */
const campusAreas: { name: string; position: [number, number] }[] = [
  { name: 'North Campus', position: [42.4558, -76.4775] },
  { name: 'Central Campus', position: [42.4475, -76.4825] },
]

export function CampusMap() {
  return (
    <MapContainer
      center={CAMPUS_CENTER}
      zoom={CAMPUS_ZOOM}
      minZoom={14}
      maxZoom={19}
      scrollWheelZoom
      className="size-full"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {campusAreas.map(({ name, position }) => (
        <CircleMarker
          key={name}
          center={position}
          radius={10}
          pathOptions={{ color: '#1f6b45', fillColor: '#3fa66a', fillOpacity: 0.8, weight: 3 }}
        >
          <Tooltip permanent direction="top" offset={[0, -10]}>
            {name}
          </Tooltip>
        </CircleMarker>
      ))}
    </MapContainer>
  )
}
