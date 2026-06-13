'use client'
import { useEffect, useRef, useState } from 'react'
import { Filter } from 'lucide-react'
import { cn } from '@/lib/utils'

interface MapPoint {
  id: string
  latitude: number
  longitude: number
  riskLevel: string
  cropType: string
  pestName: string
  user: { name: string; village?: string }
}

interface Props {
  points: MapPoint[]
}

const RISK_COLOR: Record<string, string> = {
  LOW: '#22c55e',
  MEDIUM: '#f59e0b',
  HIGH: '#ef4444',
}

export function OutbreakMap({ points }: Props) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const mapRef = useRef<any>(null)
  const [selected, setSelected] = useState<MapPoint | null>(null)
  const [filter, setFilter] = useState<string>('ALL')
  const [mapError, setMapError] = useState(false)

  useEffect(() => {
    if (mapError || !mapContainer.current) return
    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN
    if (!token || token === 'pk.xxx') { setMapError(true); return }

    import('mapbox-gl').then(({ default: mapboxgl }) => {
      mapboxgl.accessToken = token
      const map = new mapboxgl.Map({
        container: mapContainer.current!,
        style: 'mapbox://styles/mapbox/dark-v11',
        center: [78.486, 17.385],
        zoom: 9,
      })
      mapRef.current = map
      map.addControl(new mapboxgl.NavigationControl(), 'top-right')

      map.on('load', () => {
        const filtered = filter === 'ALL' ? points : points.filter(p => p.riskLevel === filter)
        filtered.forEach(p => {
          const el = document.createElement('div')
          const color = RISK_COLOR[p.riskLevel] || '#22c55e'
          el.className = 'cursor-pointer'
          el.innerHTML = `<div style="width:16px;height:16px;border-radius:50%;background:${color};border:2px solid white;box-shadow:0 0 8px ${color}88"></div>`
          el.addEventListener('click', () => setSelected(p))
          new mapboxgl.Marker(el).setLngLat([p.longitude, p.latitude]).addTo(map)
        })
      })
    }).catch(() => setMapError(true))

    return () => { mapRef.current?.remove() }
  }, [points, filter, mapError])

  const filtered = filter === 'ALL' ? points : points.filter(p => p.riskLevel === filter)

  if (mapError) {
    return (
      <div className="flex flex-col h-full">
        <MapFallback points={filtered} filter={filter} setFilter={setFilter} selected={selected} setSelected={setSelected} />
      </div>
    )
  }

  return (
    <div className="relative h-full">
      <div ref={mapContainer} className="w-full h-full" />
      {/* Filters */}
      <div className="absolute top-3 left-3 flex gap-2 z-10">
        {['ALL', 'LOW', 'MEDIUM', 'HIGH'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              'px-3 py-1.5 rounded-full text-xs font-semibold border transition-all glass',
              filter === f
                ? f === 'HIGH' ? 'bg-danger/30 border-danger text-danger'
                  : f === 'MEDIUM' ? 'bg-accent/30 border-accent text-accent'
                  : f === 'LOW' ? 'bg-primary/30 border-primary text-primary'
                  : 'bg-white/10 border-white/30 text-white'
                : 'border-[#1a3328] text-muted'
            )}
          >{f}</button>
        ))}
      </div>
      {/* Info Card */}
      {selected && (
        <div className="absolute bottom-4 left-3 right-3 glass rounded-2xl p-4 z-10">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-white font-semibold text-sm">{selected.cropType} — {selected.pestName}</p>
              <p className="text-muted text-xs mt-0.5">Farmer: {selected.user.name}</p>
              {selected.user.village && <p className="text-muted text-xs">📍 {selected.user.village}</p>}
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className="text-xs font-bold px-2 py-0.5 rounded-full"
                style={{ background: `${RISK_COLOR[selected.riskLevel]}22`, color: RISK_COLOR[selected.riskLevel], border: `1px solid ${RISK_COLOR[selected.riskLevel]}44` }}>
                {selected.riskLevel}
              </span>
              <button onClick={() => setSelected(null)} className="text-muted text-xs">✕ Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function MapFallback({ points, filter, setFilter, selected, setSelected }: any) {
  // Build Google Maps embed URL centered on Andhra Pradesh with markers
  const center = points.length > 0
    ? `${points[0].latitude},${points[0].longitude}`
    : '17.385,78.486'

  // Build markers query for Google Maps embed
  const markerQuery = points.slice(0, 5).map((p: MapPoint) =>
    `${p.latitude},${p.longitude}`
  ).join('|')

  const gmapSrc = `https://maps.google.com/maps?q=${center}&z=9&output=embed&markers=${markerQuery}`

  const colors: Record<string, string> = { LOW: '#22c55e', MEDIUM: '#f59e0b', HIGH: '#ef4444' }

  return (
    <div className="flex flex-col h-full">
      {/* Filter bar */}
      <div className="flex gap-2 p-3">
        {['ALL', 'LOW', 'MEDIUM', 'HIGH'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={cn(
              'px-3 py-1.5 rounded-full text-xs font-semibold border transition-all',
              filter === f ? 'bg-primary/20 border-primary text-primary' : 'bg-card border-[#1a3328] text-muted'
            )}>{f}</button>
        ))}
      </div>

      {/* Google Maps embed */}
      <div className="relative rounded-2xl overflow-hidden mx-3 mb-3" style={{ height: 260, border: '1px solid #1a3328' }}>
        <iframe
          src={gmapSrc}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
        {/* Overlay markers with risk colours */}
        <div className="absolute top-2 right-2 flex flex-col gap-1">
          {[['HIGH','#ef4444'],['MEDIUM','#f59e0b'],['LOW','#22c55e']].map(([label, color]) => (
            <div key={label} className="flex items-center gap-1 rounded-full px-2 py-0.5" style={{ background: 'rgba(0,0,0,0.7)' }}>
              <div className="w-2 h-2 rounded-full" style={{ background: color }} />
              <span className="text-[9px] font-bold" style={{ color }}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Report list */}
      <div className="px-3 space-y-2 pb-3 overflow-y-auto flex-1">
        {points.map((p: MapPoint) => (
          <button key={p.id} onClick={() => setSelected(p === selected ? null : p)}
            className="w-full glass rounded-xl p-3 text-left hover:border-primary/30 transition-all"
            style={{ border: selected?.id === p.id ? `1px solid ${colors[p.riskLevel]}` : undefined }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white text-xs font-semibold">{p.cropType} — {p.pestName}</p>
                <p className="text-muted text-[11px]">{p.user.name} • {p.user.village || 'Unknown'}</p>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                style={{ background: `${colors[p.riskLevel]}22`, color: colors[p.riskLevel] }}>
                {p.riskLevel}
              </span>
            </div>
            {selected?.id === p.id && (
              <p className="text-muted text-[11px] mt-1.5 leading-relaxed">{p.pestName} detected. Tap map pin to view exact location.</p>
            )}
          </button>
        ))}
        {!points.length && (
          <div className="text-center py-8 text-muted text-sm">No reports in this area 🌿</div>
        )}
      </div>
    </div>
  )
}
