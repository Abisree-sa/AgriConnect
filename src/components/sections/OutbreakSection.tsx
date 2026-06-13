'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { AlertTriangle, MapPin, Clock, CheckCircle, Filter } from 'lucide-react'

const RISK_COLOR: Record<string, string> = { HIGH: '#ef4444', MEDIUM: '#f59e0b', LOW: '#22c55e' }
const RISK_BG: Record<string, string> = { HIGH: 'rgba(239,68,68,0.1)', MEDIUM: 'rgba(245,158,11,0.1)', LOW: 'rgba(34,197,94,0.1)' }
const RISK_BORDER: Record<string, string> = { HIGH: 'rgba(239,68,68,0.25)', MEDIUM: 'rgba(245,158,11,0.25)', LOW: 'rgba(34,197,94,0.25)' }

function timeAgo(d: string) {
  const diff = Date.now() - new Date(d).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

export default function OutbreakSection() {
  const [filter, setFilter] = useState('ALL')
  const [selected, setSelected] = useState<any>(null)

  const { data: reports = [], isLoading } = useQuery({
    queryKey: ['reports'],
    queryFn: () => axios.get('/api/reports').then(r => r.data),
    refetchInterval: 30000,
  })

  const filtered = filter === 'ALL' ? reports : reports.filter((r: any) => r.riskLevel === filter)
  const activeCount = reports.filter((r: any) => r.status === 'ACTIVE').length

  return (
    <section id="outbreak" className="py-24 relative" style={{ background: 'linear-gradient(180deg, transparent, rgba(239,68,68,0.02), transparent)' }}>
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold text-red-400 uppercase tracking-widest mb-4"
              style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
              <div className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
              Live Outbreak Network
            </div>
            <h2 className="font-black text-white mb-3" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', letterSpacing: '-0.02em' }}>
              Community <span style={{ color: '#ef4444' }}>Outbreak Feed</span>
            </h2>
            <p className="text-base" style={{ color: '#6b9e7f', maxWidth: 480 }}>
              Real reports from real farmers. Every entry here is an early warning that could save your crops.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)' }}>
              <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
              <span className="text-red-400 text-sm font-semibold">{activeCount} Active Outbreaks</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Feed — left 2/3 */}
          <div className="lg:col-span-2">
            {/* Filter bar */}
            <div className="flex gap-2 mb-5 flex-wrap">
              {['ALL','HIGH','MEDIUM','LOW'].map(f => (
                <button key={f} onClick={() => setFilter(f)}
                  className={`tab-btn ${filter === f ? 'active' : ''}`}
                  style={filter === f && f !== 'ALL' ? { color: RISK_COLOR[f], borderColor: RISK_BORDER[f], background: RISK_BG[f] } : {}}>
                  {f === 'ALL' ? 'All Reports' : `${f} Risk`}
                </button>
              ))}
              <div className="ml-auto text-xs flex items-center gap-1" style={{ color: '#4a7c5f' }}>
                <Filter size={11} /> {filtered.length} reports
              </div>
            </div>

            {/* Report cards */}
            {isLoading ? (
              <div className="space-y-3">
                {[1,2,3].map(i => <div key={i} className="glass rounded-2xl p-5 animate-pulse h-28" />)}
              </div>
            ) : (
              <div className="space-y-3 max-h-[620px] overflow-y-auto pr-1">
                {filtered.map((r: any, i: number) => (
                  <motion.div key={r.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                    onClick={() => setSelected(selected?.id === r.id ? null : r)}
                    className="glass rounded-2xl p-5 cursor-pointer transition-all hover:-translate-y-0.5"
                    style={{ borderColor: selected?.id === r.id ? RISK_BORDER[r.riskLevel] : undefined }}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-green-400 shrink-0"
                          style={{ background: 'rgba(34,197,94,0.15)' }}>
                          {r.user?.name?.charAt(0)}
                        </div>
                        <div>
                          <p className="text-white text-sm font-semibold">{r.user?.name}</p>
                          <div className="flex items-center gap-1 mt-0.5">
                            <MapPin size={10} style={{ color: '#4a7c5f' }} />
                            <span className="text-xs" style={{ color: '#4a7c5f' }}>{r.user?.village || r.user?.district || 'Unknown'}</span>
                            <span style={{ color: '#2a4a35' }}>·</span>
                            <Clock size={10} style={{ color: '#4a7c5f' }} />
                            <span className="text-xs" style={{ color: '#4a7c5f' }}>{timeAgo(r.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1.5">
                        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full"
                          style={{ color: RISK_COLOR[r.riskLevel], background: RISK_BG[r.riskLevel], border: `1px solid ${RISK_BORDER[r.riskLevel]}` }}>
                          {r.riskLevel} RISK
                        </span>
                        {r.status === 'ACTIVE' && (
                          <div className="flex items-center gap-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                            <span className="text-[10px] text-red-400 font-medium">ACTIVE</span>
                          </div>
                        )}
                        {r.status === 'RESOLVED' && (
                          <div className="flex items-center gap-1">
                            <CheckCircle size={10} className="text-green-400" />
                            <span className="text-[10px] text-green-400 font-medium">RESOLVED</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full text-green-400"
                        style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)' }}>
                        {r.cropType}
                      </span>
                      <span className="text-white text-xs font-bold">• {r.pestName}</span>
                    </div>
                    <p className="text-sm leading-relaxed" style={{ color: '#6b9e7f' }}>{r.description}</p>

                    {selected?.id === r.id && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                        className="mt-3 pt-3 border-t border-green-400/10 grid grid-cols-2 gap-3">
                        <div className="rounded-xl p-2.5 text-xs" style={{ background: 'rgba(34,197,94,0.05)' }}>
                          <p style={{ color: '#4a7c5f' }}>Location</p>
                          <p className="text-white font-medium mt-0.5">{r.latitude?.toFixed(4)}, {r.longitude?.toFixed(4)}</p>
                        </div>
                        <div className="rounded-xl p-2.5 text-xs" style={{ background: 'rgba(34,197,94,0.05)' }}>
                          <p style={{ color: '#4a7c5f' }}>District</p>
                          <p className="text-white font-medium mt-0.5">{r.user?.district || 'Unknown'}</p>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                ))}
                {!filtered.length && (
                  <div className="glass rounded-2xl p-10 text-center">
                    <CheckCircle size={36} className="text-green-400 mx-auto mb-3" />
                    <p className="text-white font-semibold">No {filter !== 'ALL' ? filter.toLowerCase() + ' risk' : ''} outbreaks right now</p>
                    <p className="text-sm mt-1" style={{ color: '#4a7c5f' }}>Your area is currently safe 🌿</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right sidebar — risk breakdown + map placeholder */}
          <div className="space-y-4">
            {/* Risk summary */}
            <div className="glass rounded-2xl p-5">
              <p className="text-white font-bold text-sm mb-4">Risk Breakdown</p>
              {['HIGH','MEDIUM','LOW'].map(level => {
                const count = reports.filter((r: any) => r.riskLevel === level).length
                const pct = reports.length ? Math.round((count / reports.length) * 100) : 0
                return (
                  <div key={level} className="mb-3">
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-xs font-semibold" style={{ color: RISK_COLOR[level] }}>{level} Risk</span>
                      <span className="text-xs text-white font-bold">{count} reports</span>
                    </div>
                    <div className="progress-bar">
                      <motion.div className="progress-fill" initial={{ width: 0 }} whileInView={{ width: `${pct}%` }} viewport={{ once: true }}
                        style={{ background: RISK_COLOR[level] }} />
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Map visual */}
            <div className="glass rounded-2xl overflow-hidden" style={{ height: 280 }}>
              <div className="relative w-full h-full flex flex-col items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #0a1f14, #0c2a1a)',
                  backgroundImage: 'linear-gradient(rgba(34,197,94,0.06) 1px,transparent 1px),linear-gradient(90deg,rgba(34,197,94,0.06) 1px,transparent 1px)',
                  backgroundSize: '30px 30px' }}>
                <p className="text-xs mb-4 z-10" style={{ color: '#4a7c5f' }}>Outbreak Map — Telangana</p>
                {/* Simulated markers */}
                {reports.slice(0, 6).map((r: any, i: number) => (
                  <div key={r.id} className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                    style={{ left: `${22 + (i * 67 + 13) % 60}%`, top: `${18 + (i * 51 + 17) % 60}%` }}
                    onClick={() => setSelected(r)}>
                    <div className="w-4 h-4 rounded-full border-2 border-white shadow-lg animate-pulse-slow"
                      style={{ background: RISK_COLOR[r.riskLevel], boxShadow: `0 0 10px ${RISK_COLOR[r.riskLevel]}88` }} />
                  </div>
                ))}
              </div>
            </div>

            {/* Legend */}
            <div className="glass rounded-2xl p-4">
              <p className="text-white text-xs font-semibold mb-3">Map Legend</p>
              {[['HIGH','Critical outbreak'],['MEDIUM','Monitor closely'],['LOW','Low activity']].map(([level, desc]) => (
                <div key={level} className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 rounded-full shrink-0" style={{ background: RISK_COLOR[level] }} />
                  <span className="text-xs" style={{ color: '#6b9e7f' }}><strong style={{ color: RISK_COLOR[level] }}>{level}</strong> — {desc}</span>
                </div>
              ))}
            </div>

            {/* Alert preview */}
            <div className="rounded-2xl p-4" style={{ background: 'linear-gradient(135deg, rgba(239,68,68,0.08), rgba(239,68,68,0.04))', border: '1px solid rgba(239,68,68,0.2)' }}>
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle size={14} className="text-red-400" />
                <span className="text-red-400 text-xs font-semibold uppercase tracking-wide">Sample Alert</span>
              </div>
              <p className="text-white text-xs font-semibold mb-1">Pest Outbreak Warning</p>
              <p className="text-xs leading-relaxed" style={{ color: '#6b9e7f' }}>
                Fall Armyworm reported in nearby maize fields. Estimated spread risk to your area: <span className="text-red-400 font-bold">HIGH within 5 days.</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
