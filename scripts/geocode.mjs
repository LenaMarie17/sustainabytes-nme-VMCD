import { readFileSync, writeFileSync } from 'node:fs'

const src = readFileSync('/vercel/share/v0-project/lib/locations.ts', 'utf8')
const names = [...src.matchAll(/place\('((?:[^'\\]|\\.)*)'/g)].map((m) => m[1])
const out = {}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

for (const name of names) {
  const clean = name.replace(/\(([^)]*)\)/g, '$1').replace(/"/g, '').replace(/:/g, '')
  const q = `${clean}, Ithaca, NY`
  const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&viewbox=-76.50,42.465,-76.46,42.433&bounded=1&q=${encodeURIComponent(q)}`
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'sustainabytes-nme-geocode/1.0' } })
    const data = await res.json()
    out[name] = data[0] ? [Number(data[0].lat), Number(data[0].lon), data[0].display_name.slice(0, 60)] : null
  } catch {
    out[name] = null
  }
  console.log(name, '=>', out[name] ? out[name].slice(0, 2).join(',') : 'MISS')
  await sleep(1100)
}
writeFileSync('/tmp/coords.json', JSON.stringify(out, null, 1))
