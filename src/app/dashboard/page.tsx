'use client'
import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import {
  Leaf, LogOut, MapPin, MessageCircle, Cpu, Camera, Rss,
  AlertTriangle, CheckCircle, Clock, Upload, Send, Bot, User,
  RotateCcw, Sprout, Droplets, Plus, Mic, MicOff,
  TrendingUp, TrendingDown, BarChart2, ShoppingCart, Wind, Eye, Thermometer
} from 'lucide-react'
import { ReportModal } from '@/components/report/ReportModal'

// ── helpers ───────────────────────────────────────────────────────────────────
function timeAgo(d: string) {
  const diff = Date.now() - new Date(d).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 2) return 'just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

function distKm(la1: number, lo1: number, la2: number, lo2: number) {
  const R = 6371, dL = (la2 - la1) * Math.PI / 180, dO = (lo2 - lo1) * Math.PI / 180
  const a = Math.sin(dL / 2) ** 2 + Math.cos(la1 * Math.PI / 180) * Math.cos(la2 * Math.PI / 180) * Math.sin(dO / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

const RS: Record<string, { bg: string; color: string }> = {
  HIGH:   { bg: '#fee2e2', color: '#dc2626' },
  MEDIUM: { bg: '#fef3c7', color: '#d97706' },
  LOW:    { bg: '#dcfce7', color: '#16a34a' },
}

// Harvest windows per crop (days from sowing)
const HARVEST_DAYS: Record<string, { min: number; max: number }> = {
  Maize: { min: 90, max: 110 }, Rice: { min: 110, max: 135 }, Wheat: { min: 110, max: 130 },
  Cotton: { min: 150, max: 180 }, Tomato: { min: 60, max: 80 }, Groundnut: { min: 110, max: 130 },
  Sugarcane: { min: 300, max: 365 }, Turmeric: { min: 240, max: 270 },
}

const TABS = [
  { id: 'feed',    icon: Rss,           label: 'Feed'    },
  { id: 'weather', icon: Thermometer,   label: 'Weather' },
  { id: 'scan',    icon: Camera,        label: 'Scan'    },
  { id: 'twin',    icon: Cpu,           label: 'Twin'    },
  { id: 'market',  icon: ShoppingCart,  label: 'Market'  },
  { id: 'chat',    icon: MessageCircle, label: 'Chat'    },
]

// ── Soil Health Score ─────────────────────────────────────────────────────────
function calcSoilScore(history: any[], manure: string, soilType: string): { score: number; grade: string; tips: string[] } {
  let score = 50
  // Crop rotation bonus
  const uniqueCrops = new Set(history.map((h: any) => h.crop)).size
  score += Math.min(uniqueCrops * 8, 20)
  // Legume bonus (groundnut fixes nitrogen)
  if (history.some((h: any) => h.crop === 'Groundnut')) score += 10
  // Organic manure bonus
  if (manure === 'yes') score += 12
  // Soil type base
  if (soilType === 'Loamy') score += 8
  else if (soilType === 'Clay') score += 3
  // Issue penalty
  const issueCount = history.filter((h: any) => h.issue !== 'None').length
  score -= issueCount * 5
  score = Math.max(10, Math.min(100, score))
  const grade = score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : score >= 40 ? 'Fair' : 'Poor'
  const tips: string[] = []
  if (uniqueCrops < 3) tips.push('Rotate crops every season to improve soil health.')
  if (manure !== 'yes') tips.push('Add FYM or compost 5 tons/acre before sowing.')
  if (soilType === 'Sandy') tips.push('Mix organic matter to improve water retention.')
  if (!history.some((h: any) => h.crop === 'Groundnut')) tips.push('Try groundnut next season — it fixes nitrogen naturally.')
  return { score, grade, tips }
}

// ── Harvest Predictor ─────────────────────────────────────────────────────────
function HarvestPredictor({ sowingDate, crop }: { sowingDate: string; crop: string }) {
  if (!sowingDate) return (
    <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 12, padding: 14 }}>
      <p style={{ fontSize: 12, color: '#9ca3af' }}>Set a sowing date in Overview to see harvest prediction.</p>
    </div>
  )
  const sowing = new Date(sowingDate)
  const hw = HARVEST_DAYS[crop] || { min: 90, max: 120 }
  const earlyHarvest = new Date(sowing.getTime() + hw.min * 86400000)
  const lateHarvest = new Date(sowing.getTime() + hw.max * 86400000)
  const today = new Date()
  const daysElapsed = Math.floor((today.getTime() - sowing.getTime()) / 86400000)
  const daysToEarly = Math.max(0, hw.min - daysElapsed)
  const progress = Math.min(100, Math.round((daysElapsed / hw.max) * 100))
  const fmt = (d: Date) => d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })

  return (
    <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 14, padding: 16 }}>
      <p style={{ fontSize: 11, fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>🌾 Harvest Prediction — {crop}</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
        {[
          { label: 'Sowing Date', val: fmt(sowing) },
          { label: 'Days Elapsed', val: `${daysElapsed} days` },
          { label: 'Earliest Harvest', val: fmt(earlyHarvest) },
          { label: 'Latest Harvest', val: fmt(lateHarvest) },
        ].map(({ label, val }) => (
          <div key={label} style={{ background: '#f9fafb', borderRadius: 8, padding: '10px 12px' }}>
            <p style={{ fontSize: 11, color: '#9ca3af' }}>{label}</p>
            <p style={{ fontWeight: 700, fontSize: 13, color: '#111', marginTop: 2 }}>{val}</p>
          </div>
        ))}
      </div>
      <div style={{ marginBottom: 10 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
          <span style={{ fontSize: 11, color: '#6b7280' }}>Growth progress</span>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#16a34a' }}>{progress}%</span>
        </div>
        <div style={{ height: 8, background: '#f3f4f6', borderRadius: 999, overflow: 'hidden' }}>
          <div style={{ width: `${progress}%`, height: '100%', background: progress > 80 ? '#16a34a' : progress > 50 ? '#d97706' : '#3b82f6', borderRadius: 999, transition: 'width 0.5s' }} />
        </div>
      </div>
      <div style={{ background: daysToEarly === 0 ? '#f0fdf4' : '#eff6ff', border: `1px solid ${daysToEarly === 0 ? '#bbf7d0' : '#bfdbfe'}`, borderRadius: 10, padding: '10px 12px' }}>
        <p style={{ fontSize: 12, fontWeight: 600, color: daysToEarly === 0 ? '#16a34a' : '#3b82f6' }}>
          {daysToEarly === 0 ? `✅ Ready to harvest! Check crop maturity daily.` : `🕐 ${daysToEarly} days until earliest harvest window.`}
        </p>
      </div>
    </div>
  )
}

// ── Weather Tab ───────────────────────────────────────────────────────────────
function WeatherTab({ userLat, userLng }: { userLat: number; userLng: number }) {
  const { data: w, isLoading } = useQuery({
    queryKey: ['weather', userLat, userLng],
    queryFn: () => axios.get(`/api/weather?lat=${userLat}&lng=${userLng}`).then(r => r.data),
    staleTime: 10 * 60 * 1000,
  })

  if (isLoading) return (
    <div style={{ padding: 16, textAlign: 'center', paddingTop: 60 }}>
      <div style={{ width: 32, height: 32, border: '3px solid #e5e7eb', borderTop: '3px solid #16a34a', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
      <p style={{ fontSize: 13, color: '#6b7280' }}>Fetching weather...</p>
    </div>
  )

  return (
    <div style={{ padding: 16, maxWidth: 560, margin: '0 auto', paddingBottom: 80 }}>
      {/* Current */}
      <div style={{ background: 'linear-gradient(135deg, #16a34a, #22c55e)', borderRadius: 18, padding: 20, color: '#fff', marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <p style={{ fontSize: 48, lineHeight: 1 }}>{w?.current?.icon}</p>
            <p style={{ fontSize: 40, fontWeight: 900, marginTop: 4 }}>{w?.current?.temp}°C</p>
            <p style={{ fontSize: 13, opacity: 0.85, marginTop: 2 }}>{w?.current?.description}</p>
            <p style={{ fontSize: 11, opacity: 0.7, marginTop: 2 }}>Feels like {w?.current?.feels_like}°C</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { icon: '💧', label: `${w?.current?.humidity}% humidity` },
                { icon: '💨', label: `${w?.current?.wind_speed} km/h wind` },
                { icon: '👁️', label: `${w?.current?.visibility} km visibility` },
              ].map(x => (
                <div key={x.label} style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'flex-end' }}>
                  <span style={{ fontSize: 12 }}>{x.icon}</span>
                  <span style={{ fontSize: 11, opacity: 0.9 }}>{x.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Farm advice */}
      <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 12, padding: '12px 14px', marginBottom: 16 }}>
        <p style={{ fontSize: 11, fontWeight: 700, color: '#d97706', marginBottom: 4 }}>🌾 Farm Advisory</p>
        <p style={{ fontSize: 13, color: '#92400e', lineHeight: 1.6 }}>{w?.farmAdvice}</p>
      </div>

      {/* 5-day forecast */}
      <p style={{ fontSize: 11, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>5-Day Forecast</p>
      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
        {w?.forecast?.map((d: any, i: number) => (
          <div key={i} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: '12px 10px', textAlign: 'center', minWidth: 80, flexShrink: 0 }}>
            <p style={{ fontSize: 10, color: '#9ca3af', marginBottom: 6 }}>{d.date}</p>
            <p style={{ fontSize: 22 }}>{d.icon}</p>
            <p style={{ fontSize: 13, fontWeight: 700, color: '#111', marginTop: 4 }}>{d.temp_max}°</p>
            <p style={{ fontSize: 11, color: '#9ca3af' }}>{d.temp_min}°</p>
            <p style={{ fontSize: 10, color: '#6b7280', marginTop: 4 }}>{d.humidity}%💧</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Market Prices Tab ─────────────────────────────────────────────────────────
function MarketTab({ farmer, userLat, userLng }: { farmer: any; userLat: number; userLng: number }) {
  const [crop, setCrop] = useState(farmer?.cropTypes?.[0] || 'Maize')
  const [showNearbyMarkets, setShowNearbyMarkets] = useState(false)
  const CROPS = ['Maize', 'Cotton', 'Rice', 'Wheat', 'Tomato', 'Sugarcane', 'Groundnut', 'Turmeric', 'Onion', 'Potato']
  const state = farmer?.state || 'Telangana'

  const { data: m, isLoading, refetch } = useQuery({
    queryKey: ['market', crop, userLat, userLng],
    queryFn: () => axios.get(`/api/market-prices?crop=${crop}&lat=${userLat}&lng=${userLng}&state=${state}`).then(r => r.data),
    staleTime: 60 * 60 * 1000,
  })

  return (
    <div style={{ padding: 16, maxWidth: 560, margin: '0 auto', paddingBottom: 80 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div>
          <p style={{ fontWeight: 700, fontSize: 15, color: '#111' }}>Mandi Prices</p>
          <p style={{ fontSize: 12, color: '#6b7280' }}>{state} · {m?.date}</p>
        </div>
        <select value={crop} onChange={e => setCrop(e.target.value)}
          style={{ padding: '6px 10px', fontSize: 12, borderRadius: 8, border: '1px solid #e5e7eb', background: '#fff' }}>
          {CROPS.map(c => <option key={c}>{c}</option>)}
        </select>
      </div>

      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <div style={{ width: 24, height: 24, border: '3px solid #e5e7eb', borderTop: '3px solid #16a34a', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto' }} />
        </div>
      ) : (
        <>
          {/* Summary card */}
          <div style={{ background: m?.belowMSP ? '#fef3c7' : '#f0fdf4', border: `1px solid ${m?.belowMSP ? '#fde68a' : '#bbf7d0'}`, borderRadius: 14, padding: 16, marginBottom: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <div>
                <p style={{ fontSize: 11, color: '#6b7280' }}>Average Modal Price</p>
                <p style={{ fontSize: 28, fontWeight: 900, color: '#111' }}>₹{m?.avgModal}<span style={{ fontSize: 12, fontWeight: 400, color: '#6b7280' }}>/qtl</span></p>
              </div>
              {m?.msp > 0 && (
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: 11, color: '#6b7280' }}>MSP</p>
                  <p style={{ fontSize: 16, fontWeight: 700, color: m?.belowMSP ? '#dc2626' : '#16a34a' }}>₹{m?.msp}</p>
                  <p style={{ fontSize: 10, color: m?.belowMSP ? '#dc2626' : '#16a34a' }}>{m?.belowMSP ? '⚠️ Below MSP' : '✅ Above MSP'}</p>
                </div>
              )}
            </div>
            <p style={{ fontSize: 12, color: m?.belowMSP ? '#92400e' : '#166534', lineHeight: 1.6 }}>{m?.advice}</p>
          </div>

          {/* Price trend */}
          <p style={{ fontSize: 11, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>7-Day Price Trend</p>
          <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 14, marginBottom: 14 }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 60 }}>
              {m?.trend?.map((t: any, i: number) => {
                const max = Math.max(...(m.trend.map((x: any) => x.price)))
                const min = Math.min(...(m.trend.map((x: any) => x.price)))
                const h = Math.round(((t.price - min) / (max - min + 1)) * 50 + 10)
                return (
                  <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                    <div style={{ width: '100%', height: h, background: i === m.trend.length - 1 ? '#16a34a' : '#dcfce7', borderRadius: 4 }} />
                    <p style={{ fontSize: 9, color: '#9ca3af' }}>{t.date.split(' ')[0]}</p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Mandi wise */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Mandi-wise Prices</p>
            {m?.nearbyMandis?.length > 0 && (
              <button onClick={() => setShowNearbyMarkets(!showNearbyMarkets)} style={{ fontSize: 11, fontWeight: 600, color: '#16a34a', background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}>
                {showNearbyMarkets ? '👇 Hide nearby' : '📍 Show nearby'}
              </button>
            )}
          </div>

          {showNearbyMarkets && m?.nearbyMandis && (
            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 12, padding: 12, marginBottom: 14 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#16a34a', marginBottom: 8 }}>Nearby Markets ({m?.totalNearbyMandis} found)</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {m.nearbyMandis.map((mandi: any, idx: number) => (
                  <div key={idx} style={{ background: '#fff', border: '1px solid #bbf7d0', borderRadius: 10, padding: '10px 12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                      <p style={{ fontWeight: 600, fontSize: 12, color: '#111' }}>{mandi.name}</p>
                      <span style={{ fontSize: 10, fontWeight: 700, color: '#16a34a', background: '#f0fdf4', padding: '2px 8px', borderRadius: 999 }}>{mandi.distance}km</span>
                    </div>
                    {mandi.prices && mandi.prices.length > 0 && (
                      <p style={{ fontSize: 11, color: '#6b7280' }}>₹{mandi.prices[0].modal}/qtl</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {m?.prices?.map((p: any) => (
              <div key={p.mandi} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: '12px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ fontWeight: 600, fontSize: 13, color: '#111' }}>{p.mandi}</p>
                  <p style={{ fontSize: 11, color: '#9ca3af' }}>Min ₹{p.min} — Max ₹{p.max}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontWeight: 700, fontSize: 15, color: '#16a34a' }}>₹{p.modal}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 2, justifyContent: 'flex-end' }}>
                    {p.change >= 0
                      ? <TrendingUp size={10} color="#16a34a" />
                      : <TrendingDown size={10} color="#dc2626" />}
                    <span style={{ fontSize: 10, color: p.change >= 0 ? '#16a34a' : '#dc2626' }}>{p.change >= 0 ? '+' : ''}{p.change}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

// ── Feed Tab ──────────────────────────────────────────────────────────────────
function FeedTab({ reports, userLat, userLng, onReport, farmer }: any) {
  const [sending, setSending] = useState<string | null>(null)
  const nearby = reports
    .map((r: any) => ({ ...r, dist: distKm(userLat, userLng, r.latitude, r.longitude) }))
    .filter((r: any) => r.dist <= 200)
    .sort((a: any, b: any) => a.dist - b.dist)

  const sendSMS = async (r: any) => {
    if (!farmer?.phone) return
    setSending(r.id)
    try {
      await axios.post('/api/sms-alert', {
        phone: farmer.phone, farmerName: farmer.name,
        pestName: r.pestName, cropType: r.cropType,
        riskLevel: r.riskLevel, village: r.user?.village || 'nearby area',
      })
      alert('SMS alert sent to your phone!')
    } catch { alert('SMS service not configured.') }
    setSending(null)
  }

  return (
    <div style={{ padding: 16, maxWidth: 600, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div>
          <p style={{ fontWeight: 700, fontSize: 15, color: '#111' }}>Nearby Outbreaks</p>
          <p style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>Within 200km · {nearby.length} reports</p>
        </div>
        <button onClick={onReport} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', background: '#16a34a', color: '#fff', borderRadius: 8, border: 'none', fontWeight: 600, fontSize: 12, cursor: 'pointer' }}>
          <AlertTriangle size={12} /> Report
        </button>
      </div>

      {nearby.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px 0' }}>
          <CheckCircle size={36} color="#16a34a" style={{ margin: '0 auto 12px' }} />
          <p style={{ fontWeight: 600, color: '#111', marginBottom: 4 }}>No outbreaks nearby</p>
          <p style={{ fontSize: 13, color: '#6b7280' }}>Your area is currently safe 🌿</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {nearby.map((r: any) => {
            const rs = RS[r.riskLevel] || RS.LOW
            return (
              <div key={r.id} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 14, padding: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 32, height: 32, background: '#f0fdf4', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13, color: '#16a34a' }}>
                      {r.user?.name?.charAt(0)}
                    </div>
                    <div>
                      <p style={{ fontWeight: 600, fontSize: 13, color: '#111' }}>{r.user?.name}</p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 1 }}>
                        <MapPin size={9} color="#9ca3af" />
                        <span style={{ fontSize: 11, color: '#9ca3af' }}>{r.user?.village} · {Math.round(r.dist)}km</span>
                        <Clock size={9} color="#9ca3af" />
                        <span style={{ fontSize: 11, color: '#9ca3af' }}>{timeAgo(r.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                  <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 999, ...rs }}>{r.riskLevel}</span>
                </div>
                <div style={{ display: 'flex', gap: 6, marginBottom: 6 }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: '#16a34a', background: '#f0fdf4', padding: '2px 8px', borderRadius: 999, border: '1px solid #bbf7d0' }}>{r.cropType}</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#111' }}>· {r.pestName}</span>
                </div>
                <p style={{ fontSize: 12, color: '#6b7280', lineHeight: 1.6, marginBottom: 10 }}>{r.description}</p>
                {r.riskLevel === 'HIGH' && (
                  <button onClick={() => sendSMS(r)} disabled={sending === r.id}
                    style={{ width: '100%', padding: '8px', border: '1px solid #fecaca', borderRadius: 8, background: '#fff', color: '#dc2626', fontSize: 12, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                    {sending === r.id ? '📤 Sending...' : '📱 Send SMS Alert to My Phone'}
                  </button>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ── Scan Tab ──────────────────────────────────────────────────────────────────
function ScanTab() {
  const [preview, setPreview] = useState('')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = async ev => {
      const dataUrl = ev.target?.result as string
      setPreview(dataUrl); setResult(null); setLoading(true)
      try {
        const { data } = await axios.post('/api/image-analysis', { base64Image: dataUrl.split(',')[1], filename: file.name })
        setResult(data)
      } catch { setResult({ crop: 'Unknown', disease: 'Could not analyse', confidence: 0, risk: 'LOW', treatment: 'Try again with a clearer photo.' }) }
      setLoading(false)
    }
    reader.readAsDataURL(file)
  }

  const rs = result ? (RS[result.risk?.toUpperCase()] || RS.LOW) : RS.LOW

  return (
    <div style={{ padding: 16, maxWidth: 500, margin: '0 auto', paddingBottom: 80 }}>
      <p style={{ fontWeight: 700, fontSize: 15, color: '#111', marginBottom: 4 }}>Crop Disease Scanner</p>
      <p style={{ fontSize: 12, color: '#6b7280', marginBottom: 16 }}>Upload a photo — AI identifies the disease instantly</p>
      <div onClick={() => fileRef.current?.click()}
        style={{ border: '2px dashed #e5e7eb', borderRadius: 14, padding: preview ? 0 : 40, textAlign: 'center', cursor: 'pointer', marginBottom: 16, overflow: 'hidden', background: '#f9fafb' }}
        onMouseEnter={e => (e.currentTarget.style.borderColor = '#16a34a')}
        onMouseLeave={e => (e.currentTarget.style.borderColor = '#e5e7eb')}>
        <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFile} />
        {preview ? (
          <div style={{ position: 'relative' }}>
            <img src={preview} alt="crop" style={{ width: '100%', height: 220, objectFit: 'cover' }} />
            {loading && (
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                <div style={{ width: 24, height: 24, border: '3px solid rgba(255,255,255,0.3)', borderTop: '3px solid #fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                <span style={{ color: '#fff', fontSize: 13 }}>Analysing crop...</span>
              </div>
            )}
          </div>
        ) : (
          <><Upload size={32} color="#9ca3af" style={{ margin: '0 auto 10px' }} /><p style={{ fontWeight: 600, color: '#374151', fontSize: 14 }}>Tap to upload photo</p><p style={{ fontSize: 12, color: '#9ca3af', marginTop: 4 }}>Photo of affected leaf or plant</p></>
        )}
      </div>
      {result && (
        <div>
          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 14, padding: 16, marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
              <div><p style={{ fontWeight: 700, fontSize: 15, color: '#111' }}>{result.crop}</p><p style={{ fontSize: 13, color: '#374151', marginTop: 2 }}>{result.disease}</p></div>
              <div style={{ textAlign: 'right' }}><span style={{ fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 999, ...rs }}>{result.risk?.toUpperCase()}</span><p style={{ fontSize: 11, color: '#6b7280', marginTop: 4 }}>{result.confidence}% confidence</p></div>
            </div>
            <div style={{ background: '#fff', border: '1px solid #bbf7d0', borderRadius: 10, padding: '10px 14px' }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#16a34a', marginBottom: 4 }}>TREATMENT</p>
              <p style={{ fontSize: 13, color: '#374151', lineHeight: 1.6 }}>{result.treatment}</p>
            </div>
          </div>
          <button onClick={() => { setPreview(''); setResult(null) }} style={{ width: '100%', padding: '10px', border: '1.5px solid #e5e7eb', borderRadius: 10, background: '#fff', color: '#374151', fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            <RotateCcw size={13} /> Scan another photo
          </button>
        </div>
      )}
    </div>
  )
}

// ── Digital Twin Tab ──────────────────────────────────────────────────────────
type IrrigationLog = { date: string; method: string; duration: string }
type CropHistory   = { season: string; crop: string; yield: string; issue: string }

const FERT: Record<string, { stage: string; fertilizer: string; qty: string; timing: string }[]> = {
  Maize:     [{ stage: 'Basal', fertilizer: 'Urea + SSP + MOP', qty: '65+155+33 kg/ac', timing: 'Day 0' }, { stage: 'Top dress 1', fertilizer: 'Urea', qty: '65 kg/ac', timing: 'Day 30' }, { stage: 'Top dress 2', fertilizer: 'Urea', qty: '65 kg/ac', timing: 'Day 50' }],
  Tomato:    [{ stage: 'Basal', fertilizer: 'DAP + MOP', qty: '50+50 kg/ac', timing: 'Day 0' }, { stage: 'Flowering', fertilizer: '00:52:34 foliar', qty: '5g/L spray', timing: 'Day 40' }, { stage: 'Fruiting', fertilizer: 'MOP', qty: '25 kg/ac', timing: 'Day 60' }],
  Wheat:     [{ stage: 'Basal', fertilizer: 'Urea + DAP', qty: '65+50 kg/ac', timing: 'Day 0' }, { stage: 'Tillering', fertilizer: 'Urea', qty: '65 kg/ac', timing: 'Day 21' }],
  Rice:      [{ stage: 'Basal', fertilizer: 'Urea + SSP', qty: '40+100 kg/ac', timing: 'Day 0' }, { stage: 'Tillering', fertilizer: 'Urea', qty: '40 kg/ac', timing: 'Day 21' }, { stage: 'Panicle', fertilizer: 'Urea + MOP', qty: '25+25 kg/ac', timing: 'Day 55' }],
  Cotton:    [{ stage: 'Basal', fertilizer: 'DAP + MOP', qty: '50+50 kg/ac', timing: 'Day 0' }, { stage: 'Squaring', fertilizer: 'Urea', qty: '50 kg/ac', timing: 'Day 40' }, { stage: 'Boll dev', fertilizer: 'Urea + MOP', qty: '30+30 kg/ac', timing: 'Day 70' }],
  Groundnut: [{ stage: 'Basal', fertilizer: 'SSP + Gypsum', qty: '100+100 kg/ac', timing: 'Day 0' }, { stage: 'Pegging', fertilizer: 'Gypsum', qty: '100 kg/ac', timing: 'Day 45' }],
  Sugarcane: [{ stage: 'Planting', fertilizer: 'Urea + SSP + MOP', qty: '75+200+75 kg/ac', timing: 'Day 0' }, { stage: '3 months', fertilizer: 'Urea', qty: '75 kg/ac', timing: 'Day 90' }, { stage: '6 months', fertilizer: 'Urea + MOP', qty: '75+50 kg/ac', timing: 'Day 180' }],
  Turmeric:  [{ stage: 'Planting', fertilizer: 'FYM + SSP + MOP', qty: '10T+100+50 kg/ac', timing: 'Day 0' }, { stage: '60 days', fertilizer: 'Urea', qty: '30 kg/ac', timing: 'Day 60' }, { stage: '120 days', fertilizer: 'Urea', qty: '30 kg/ac', timing: 'Day 120' }],
}

function TwinTab() {
  const [sec, setSec] = useState<'overview'|'history'|'irrigation'|'fertilizer'|'harvest'|'advisor'>('overview')
  const [fp, setFp] = useState({ farmName: 'My Farm', farmSize: 5, soilType: 'Loamy', location: '', currentCrop: 'Maize', cropStage: 'Vegetative', sowingDate: '', waterSource: 'Medium', irrigationMethod: 'Flood', manure: 'yes' })
  const [history, setHistory] = useState<CropHistory[]>([
    { season: 'Kharif 2023', crop: 'Maize', yield: '4.5 tons/ac', issue: 'Fall Armyworm — treated with Emamectin' },
    { season: 'Rabi 2022', crop: 'Wheat', yield: '3.8 tons/ac', issue: 'None' },
    { season: 'Kharif 2022', crop: 'Groundnut', yield: '1.6 tons/ac', issue: 'Leaf Spot — treated with Carbendazim' },
  ])
  const [irrigLog, setIrrigLog] = useState<IrrigationLog[]>([
    { date: new Date(Date.now() - 3 * 86400000).toISOString().split('T')[0], method: 'Flood', duration: '3 hours' },
    { date: new Date(Date.now() - 10 * 86400000).toISOString().split('T')[0], method: 'Flood', duration: '3 hours' },
  ])
  const [addIrrig, setAddIrrig] = useState(false)
  const [newIrrig, setNewIrrig] = useState({ date: new Date().toISOString().split('T')[0], method: 'Flood', duration: '3 hours' })
  const [addHist, setAddHist] = useState(false)
  const [newHist, setNewHist] = useState({ season: '', crop: 'Maize', yield: '', issue: 'None' })
  const [advisorRes, setAdvisorRes] = useState<any>(null)
  const [advLoading, setAdvLoading] = useState(false)

  const daysSince = irrigLog.length > 0 ? Math.floor((Date.now() - new Date(irrigLog[0].date).getTime()) / 86400000) : null
  const fertSched = FERT[fp.currentCrop] || FERT.Maize
  const soil = calcSoilScore(history, fp.manure, fp.soilType)
  const s = (k: string) => (v: any) => setFp(p => ({ ...p, [k]: v }))

  const runAdvisor = async () => {
    setAdvLoading(true)
    try {
      const { data } = await axios.post('/api/simulate', { farmSize: fp.farmSize, soilType: fp.soilType, waterAvailability: fp.waterSource, season: 'Kharif', lastCrop: history[0]?.crop || 'Fallow (nothing)', hasOrganicManure: fp.manure })
      setAdvisorRes(data)
    } catch { setAdvisorRes({ bestCrop: 'Groundnut', recommendations: 'Groundnut or Maize would be ideal next season.', cropOptions: [] }) }
    setAdvLoading(false)
  }

  const SECS = [
    { id: 'overview', label: '🏡 Overview' }, { id: 'history', label: '📋 History' },
    { id: 'irrigation', label: '💧 Irrigation' }, { id: 'fertilizer', label: '🌿 Fertilizer' },
    { id: 'harvest', label: '🌾 Harvest' }, { id: 'advisor', label: '🤖 Advisor' },
  ]

  const btnSel = (active: boolean) => ({ padding: '8px 10px', borderRadius: 8, fontSize: 12, fontWeight: 500, cursor: 'pointer', textAlign: 'left' as const, border: active ? '1.5px solid #16a34a' : '1.5px solid #e5e7eb', background: active ? '#f0fdf4' : '#fff', color: active ? '#16a34a' : '#374151' })

  return (
    <div style={{ paddingBottom: 80 }}>
      <div style={{ background: '#fff', borderBottom: '1px solid #e5e7eb', padding: '0 12px', display: 'flex', gap: 0, overflowX: 'auto' }}>
        {SECS.map(s2 => (
          <button key={s2.id} onClick={() => setSec(s2.id as any)}
            style={{ padding: '11px 12px', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 11, fontWeight: sec === s2.id ? 700 : 500, color: sec === s2.id ? '#16a34a' : '#6b7280', borderBottom: sec === s2.id ? '2px solid #16a34a' : '2px solid transparent', whiteSpace: 'nowrap' }}>
            {s2.label}
          </button>
        ))}
      </div>

      <div style={{ padding: 16, maxWidth: 560, margin: '0 auto' }}>

        {sec === 'overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {/* Soil health score */}
            <div style={{ background: soil.score >= 60 ? '#f0fdf4' : soil.score >= 40 ? '#fffbeb' : '#fef2f2', border: `1px solid ${soil.score >= 60 ? '#bbf7d0' : soil.score >= 40 ? '#fde68a' : '#fecaca'}`, borderRadius: 14, padding: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <p style={{ fontWeight: 700, fontSize: 13, color: '#111' }}>🧪 Soil Health Score</p>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: 28, fontWeight: 900, color: soil.score >= 60 ? '#16a34a' : soil.score >= 40 ? '#d97706' : '#dc2626' }}>{soil.score}</p>
                  <p style={{ fontSize: 11, color: '#6b7280' }}>{soil.grade}</p>
                </div>
              </div>
              <div style={{ height: 8, background: '#f3f4f6', borderRadius: 999, overflow: 'hidden', marginBottom: 10 }}>
                <div style={{ width: `${soil.score}%`, height: '100%', background: soil.score >= 60 ? '#16a34a' : soil.score >= 40 ? '#d97706' : '#dc2626', borderRadius: 999 }} />
              </div>
              {soil.tips.slice(0, 2).map((t, i) => <p key={i} style={{ fontSize: 12, color: '#374151', marginTop: 4 }}>• {t}</p>)}
            </div>

            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 14, padding: 16 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#16a34a', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>Farm Profile</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {[
                  { label: 'Farm Name', key: 'farmName', type: 'text' },
                  { label: 'Location', key: 'location', type: 'text' },
                  { label: 'Farm Size (acres)', key: 'farmSize', type: 'number' },
                  { label: 'Irrigation Method', key: 'irrigationMethod', type: 'select', opts: ['Flood','Drip','Sprinkler','Furrow'] },
                  { label: 'Organic Manure', key: 'manure', type: 'select', opts: ['yes','no'] },
                  { label: 'Soil Type', key: 'soilType', type: 'select', opts: ['Loamy','Clay','Sandy','Silty'] },
                ].map((f: any) => (
                  <div key={f.key}>
                    <p style={{ fontSize: 11, color: '#6b7280', marginBottom: 4 }}>{f.label}</p>
                    {f.type === 'select'
                      ? <select value={(fp as any)[f.key]} onChange={e => s(f.key)(e.target.value)} style={{ width: '100%', padding: '7px 10px', fontSize: 12, borderRadius: 8 }}>{f.opts.map((o: string) => <option key={o}>{o}</option>)}</select>
                      : <input type={f.type} value={(fp as any)[f.key]} onChange={e => s(f.key)(f.type === 'number' ? Number(e.target.value) : e.target.value)} style={{ width: '100%', padding: '7px 10px', fontSize: 12, borderRadius: 8 }} />}
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 14, padding: 16 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>Current Crop</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {[
                  { label: 'Crop', key: 'currentCrop', type: 'select', opts: ['Maize','Rice','Wheat','Cotton','Tomato','Groundnut','Sugarcane','Turmeric'] },
                  { label: 'Growth Stage', key: 'cropStage', type: 'select', opts: ['Land prep','Germination','Vegetative','Flowering','Fruiting','Harvest'] },
                  { label: 'Sowing Date', key: 'sowingDate', type: 'date' },
                  { label: 'Water Source', key: 'waterSource', type: 'select', opts: ['High','Medium','Low'] },
                ].map((f: any) => (
                  <div key={f.key}>
                    <p style={{ fontSize: 11, color: '#6b7280', marginBottom: 4 }}>{f.label}</p>
                    {f.type === 'select'
                      ? <select value={(fp as any)[f.key]} onChange={e => s(f.key)(e.target.value)} style={{ width: '100%', padding: '7px 10px', fontSize: 12, borderRadius: 8 }}>{f.opts.map((o: string) => <option key={o}>{o}</option>)}</select>
                      : <input type={f.type} value={(fp as any)[f.key]} onChange={e => s(f.key)(e.target.value)} style={{ width: '100%', padding: '7px 10px', fontSize: 12, borderRadius: 8 }} />}
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {[
                { label: 'Last Irrigated', val: daysSince !== null ? `${daysSince}d ago` : 'Not logged', warn: daysSince !== null && daysSince > 7, sub: daysSince !== null && daysSince > 7 ? '⚠️ Due' : '' },
                { label: 'Current Crop', val: fp.currentCrop, sub: fp.cropStage + ' stage' },
                { label: 'Farm Size', val: fp.farmSize + ' acres', sub: fp.soilType + ' soil' },
                { label: 'Next Fertilizer', val: fertSched[0]?.fertilizer || '—', sub: fertSched[0]?.stage },
              ].map(({ label, val, warn, sub }: any) => (
                <div key={label} style={{ background: warn ? '#fef3c7' : '#fff', border: `1px solid ${warn ? '#fde68a' : '#e5e7eb'}`, borderRadius: 12, padding: 14 }}>
                  <p style={{ fontSize: 10, color: '#6b7280', marginBottom: 4 }}>{label}</p>
                  <p style={{ fontWeight: 700, fontSize: 14, color: warn ? '#d97706' : '#111' }}>{val}</p>
                  {sub && <p style={{ fontSize: 11, color: '#9ca3af', marginTop: 2 }}>{sub}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {sec === 'history' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <p style={{ fontWeight: 700, fontSize: 14, color: '#111' }}>Crop History</p>
              <button onClick={() => setAddHist(true)} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '6px 12px', background: '#16a34a', color: '#fff', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}><Plus size={12} /> Add</button>
            </div>
            {addHist && (
              <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 12, padding: 14, marginBottom: 14 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <input placeholder="Season (e.g. Kharif 2024)" value={newHist.season} onChange={e => setNewHist(h => ({ ...h, season: e.target.value }))} style={{ padding: '8px 10px', fontSize: 12, borderRadius: 8 }} />
                  <select value={newHist.crop} onChange={e => setNewHist(h => ({ ...h, crop: e.target.value }))} style={{ padding: '8px 10px', fontSize: 12, borderRadius: 8 }}>
                    {['Maize','Rice','Wheat','Cotton','Tomato','Groundnut','Sugarcane','Turmeric'].map(c => <option key={c}>{c}</option>)}
                  </select>
                  <input placeholder="Yield (e.g. 4.2 tons/ac)" value={newHist.yield} onChange={e => setNewHist(h => ({ ...h, yield: e.target.value }))} style={{ padding: '8px 10px', fontSize: 12, borderRadius: 8 }} />
                  <input placeholder="Issues (or None)" value={newHist.issue} onChange={e => setNewHist(h => ({ ...h, issue: e.target.value }))} style={{ padding: '8px 10px', fontSize: 12, borderRadius: 8 }} />
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => { if (newHist.season) { setHistory(h => [{ ...newHist }, ...h]); setAddHist(false); setNewHist({ season: '', crop: 'Maize', yield: '', issue: 'None' }) } }} style={{ flex: 1, padding: '8px', background: '#16a34a', color: '#fff', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Save</button>
                    <button onClick={() => setAddHist(false)} style={{ flex: 1, padding: '8px', background: '#fff', color: '#374151', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 12, cursor: 'pointer' }}>Cancel</button>
                  </div>
                </div>
              </div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {history.map((h, i) => (
                <div key={i} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af' }}>{h.season}</span>
                    <span style={{ fontSize: 11, fontWeight: 600, color: '#16a34a' }}>{h.yield}</span>
                  </div>
                  <p style={{ fontWeight: 700, fontSize: 14, color: '#111', marginBottom: 4 }}>{h.crop}</p>
                  <p style={{ fontSize: 12, color: h.issue === 'None' ? '#16a34a' : '#d97706' }}>{h.issue === 'None' ? '✅ No issues' : `⚠️ ${h.issue}`}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {sec === 'irrigation' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <p style={{ fontWeight: 700, fontSize: 14, color: '#111' }}>Irrigation Log</p>
              <button onClick={() => setAddIrrig(true)} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '6px 12px', background: '#16a34a', color: '#fff', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}><Plus size={12} /> Log</button>
            </div>
            {daysSince !== null && daysSince > 7 && (
              <div style={{ background: '#fef3c7', border: '1px solid #fde68a', borderRadius: 10, padding: '10px 14px', marginBottom: 12 }}>
                <p style={{ fontWeight: 600, fontSize: 13, color: '#d97706' }}>⚠️ {daysSince} days since last irrigation — overdue</p>
              </div>
            )}
            {addIrrig && (
              <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 12, padding: 14, marginBottom: 14 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <input type="date" value={newIrrig.date} onChange={e => setNewIrrig(i => ({ ...i, date: e.target.value }))} style={{ padding: '8px 10px', fontSize: 12, borderRadius: 8 }} />
                  <select value={newIrrig.method} onChange={e => setNewIrrig(i => ({ ...i, method: e.target.value }))} style={{ padding: '8px 10px', fontSize: 12, borderRadius: 8 }}>
                    {['Flood','Drip','Sprinkler','Furrow'].map(m => <option key={m}>{m}</option>)}
                  </select>
                  <input placeholder="Duration (e.g. 3 hours)" value={newIrrig.duration} onChange={e => setNewIrrig(i => ({ ...i, duration: e.target.value }))} style={{ padding: '8px 10px', fontSize: 12, borderRadius: 8 }} />
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => { setIrrigLog(l => [{ ...newIrrig }, ...l]); setAddIrrig(false) }} style={{ flex: 1, padding: '8px', background: '#16a34a', color: '#fff', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Save</button>
                    <button onClick={() => setAddIrrig(false)} style={{ flex: 1, padding: '8px', background: '#fff', color: '#374151', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 12, cursor: 'pointer' }}>Cancel</button>
                  </div>
                </div>
              </div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {irrigLog.map((log, i) => (
                <div key={i} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 36, height: 36, background: '#eff6ff', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Droplets size={16} color="#3b82f6" /></div>
                    <div><p style={{ fontWeight: 600, fontSize: 13, color: '#111' }}>{log.method} irrigation</p><p style={{ fontSize: 11, color: '#9ca3af' }}>{log.date} · {log.duration}</p></div>
                  </div>
                  {i === 0 && <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 999, background: '#dcfce7', color: '#16a34a' }}>Latest</span>}
                </div>
              ))}
            </div>
          </div>
        )}

        {sec === 'fertilizer' && (
          <div>
            <p style={{ fontWeight: 700, fontSize: 14, color: '#111', marginBottom: 4 }}>Fertilizer Schedule</p>
            <p style={{ fontSize: 12, color: '#6b7280', marginBottom: 16 }}>For {fp.currentCrop} — {fp.farmSize} acres</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {fertSched.map((f, i) => (
                <div key={i} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 28, height: 28, background: '#f0fdf4', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>🌿</div>
                      <div><p style={{ fontWeight: 700, fontSize: 13, color: '#111' }}>{f.stage}</p><p style={{ fontSize: 11, color: '#9ca3af' }}>{f.timing}</p></div>
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 600, color: '#16a34a', background: '#f0fdf4', padding: '2px 8px', borderRadius: 6 }}>{f.qty}</span>
                  </div>
                  <div style={{ background: '#f9fafb', borderRadius: 8, padding: '8px 10px' }}>
                    <p style={{ fontSize: 12, color: '#374151' }}>Apply: <strong>{f.fertilizer}</strong></p>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 12, padding: 14, marginTop: 14 }}>
              <p style={{ fontWeight: 600, fontSize: 12, color: '#d97706', marginBottom: 4 }}>💡 Tip</p>
              <p style={{ fontSize: 12, color: '#92400e', lineHeight: 1.6 }}>Do a soil test before applying. Apply when soil is moist. Split urea applications reduce nitrogen loss by 30%.</p>
            </div>
          </div>
        )}

        {sec === 'harvest' && <HarvestPredictor sowingDate={fp.sowingDate} crop={fp.currentCrop} />}

        {sec === 'advisor' && (
          <div>
            <p style={{ fontWeight: 700, fontSize: 14, color: '#111', marginBottom: 4 }}>AI Crop Advisor</p>
            <p style={{ fontSize: 12, color: '#6b7280', marginBottom: 16 }}>Based on your farm data and crop history</p>
            <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 12, padding: 14, marginBottom: 16 }}>
              {[['Farm', `${fp.farmSize} acres · ${fp.soilType}`], ['Water', fp.waterSource], ['Last crop', history[0]?.crop || '—'], ['Soil score', `${soil.score}/100 (${soil.grade})`]].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, padding: '4px 0', borderBottom: '1px solid #f3f4f6' }}>
                  <span style={{ color: '#6b7280' }}>{k}</span><span style={{ fontWeight: 600, color: '#111' }}>{v}</span>
                </div>
              ))}
            </div>
            <button onClick={runAdvisor} disabled={advLoading} style={{ width: '100%', padding: '13px', background: '#16a34a', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 700, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: advLoading ? 0.7 : 1, marginBottom: 16 }}>
              {advLoading ? <><div style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid #fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} /> Analysing...</> : <><Sprout size={16} /> Get Next Season Recommendation</>}
            </button>
            {advisorRes && (
              <div>
                {advisorRes.bestCrop && <div style={{ background: '#f0fdf4', border: '1.5px solid #16a34a', borderRadius: 14, padding: 20, textAlign: 'center', marginBottom: 12 }}><p style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>Best crop for next season</p><p style={{ fontSize: 28, fontWeight: 900, color: '#16a34a' }}>{advisorRes.bestCrop} 🌱</p></div>}
                {advisorRes.cropOptions?.length > 0 && (
                  <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 14, marginBottom: 12 }}>
                    {advisorRes.cropOptions.map((c: any, i: number) => (
                      <div key={c.crop} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: i < advisorRes.cropOptions.length - 1 ? '1px solid #f3f4f6' : 'none' }}>
                        <div><span style={{ fontWeight: 600, fontSize: 13, color: '#111' }}>{i === 0 ? '⭐ ' : ''}{c.crop}</span><p style={{ fontSize: 11, color: '#9ca3af' }}>{c.reason}</p></div>
                        <div style={{ textAlign: 'right' }}><p style={{ fontWeight: 700, fontSize: 12, color: '#16a34a' }}>{c.profit}</p><p style={{ fontSize: 11, color: c.risk === 'Low' ? '#16a34a' : '#d97706' }}>{c.risk} risk</p></div>
                      </div>
                    ))}
                  </div>
                )}
                <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 14 }}><p style={{ fontSize: 12, fontWeight: 700, color: '#374151', marginBottom: 6 }}>Advice</p><p style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.65 }}>{advisorRes.recommendations}</p></div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// ── Chat Tab with Voice Input ─────────────────────────────────────────────────
const LANGS = [{ code: 'en', label: 'EN' }, { code: 'ta', label: 'தமிழ்' }, { code: 'hi', label: 'हिंदी' }, { code: 'te', label: 'తెలుగు' }, { code: 'kn', label: 'ಕನ್ನಡ' }]
const LANG_BCP: Record<string, string> = { en: 'en-IN', ta: 'ta-IN', hi: 'hi-IN', te: 'te-IN', kn: 'kn-IN' }
const PROMPTS = ['What crop to plant?', 'Treat Fall Armyworm', 'Irrigation tips', 'Fertilizer for tomato', 'Soil health tips']

function ChatTab() {
  const [messages, setMessages] = useState([{ id: '0', role: 'assistant', content: "Namaste! 🌱 I'm AgriMind AI. Ask me about crops, pests, fertilizers, irrigation, or soil — in your language!" }])
  const [input, setInput] = useState('')
  const [lang, setLang] = useState('en')
  const [loading, setLoading] = useState(false)
  const [listening, setListening] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const recognitionRef = useRef<any>(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  const send = async (q: string) => {
    if (!q.trim() || loading) return
    setMessages(m => [...m, { id: Date.now().toString(), role: 'user', content: q }])
    setInput('')
    setLoading(true)
    try {
      const { data } = await axios.post('/api/chat', { question: q, language: lang })
      setMessages(m => [...m, { id: Date.now().toString(), role: 'assistant', content: data.response }])
    } catch {
      setMessages(m => [...m, { id: Date.now().toString(), role: 'assistant', content: 'Connection error. Please try again.' }])
    }
    setLoading(false)
  }

  const toggleVoice = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognition) { alert('Voice input not supported in this browser. Try Chrome.'); return }

    if (listening) {
      recognitionRef.current?.stop()
      setListening(false)
      return
    }

    const rec = new SpeechRecognition()
    rec.lang = LANG_BCP[lang] || 'en-IN'
    rec.interimResults = false
    rec.maxAlternatives = 1
    rec.onresult = (e: any) => {
      const transcript = e.results[0][0].transcript
      setInput(transcript)
      setListening(false)
    }
    rec.onerror = () => setListening(false)
    rec.onend = () => setListening(false)
    rec.start()
    recognitionRef.current = rec
    setListening(true)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 120px)' }}>
      <div style={{ padding: '8px 16px', borderBottom: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', gap: 6, background: '#f9fafb', flexWrap: 'wrap' }}>
        <span style={{ fontSize: 11, color: '#6b7280', fontWeight: 600 }}>Language:</span>
        {LANGS.map(l => (
          <button key={l.code} onClick={() => setLang(l.code)} style={{ padding: '4px 10px', borderRadius: 6, border: lang === l.code ? '1.5px solid #16a34a' : '1.5px solid #e5e7eb', background: lang === l.code ? '#f0fdf4' : '#fff', color: lang === l.code ? '#16a34a' : '#374151', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>
            {l.label}
          </button>
        ))}
      </div>

      <div style={{ padding: '8px 16px', display: 'flex', gap: 6, overflowX: 'auto', borderBottom: '1px solid #f3f4f6' }}>
        {PROMPTS.map(p => (
          <button key={p} onClick={() => send(p)} style={{ whiteSpace: 'nowrap', padding: '5px 12px', border: '1px solid #e5e7eb', borderRadius: 999, background: '#fff', fontSize: 12, color: '#374151', cursor: 'pointer', flexShrink: 0 }}>{p}</button>
        ))}
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {messages.map(msg => (
          <div key={msg.id} style={{ display: 'flex', gap: 8, justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
            {msg.role === 'assistant' && <div style={{ width: 28, height: 28, background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Bot size={13} color="#16a34a" /></div>}
            <div style={{ maxWidth: '78%', padding: '10px 14px', borderRadius: msg.role === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px', background: msg.role === 'user' ? '#16a34a' : '#fff', color: msg.role === 'user' ? '#fff' : '#111', fontSize: 13, lineHeight: 1.65, border: msg.role === 'assistant' ? '1px solid #e5e7eb' : 'none', whiteSpace: 'pre-wrap' }}>{msg.content}</div>
            {msg.role === 'user' && <div style={{ width: 28, height: 28, background: '#f3f4f6', border: '1px solid #e5e7eb', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><User size={13} color="#6b7280" /></div>}
          </div>
        ))}
        {loading && (
          <div style={{ display: 'flex', gap: 8 }}>
            <div style={{ width: 28, height: 28, background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Bot size={13} color="#16a34a" /></div>
            <div style={{ padding: '12px 16px', background: '#fff', border: '1px solid #e5e7eb', borderRadius: '14px 14px 14px 4px', display: 'flex', gap: 4 }}>
              {[0,1,2].map(i => <div key={i} style={{ width: 6, height: 6, background: '#16a34a', borderRadius: '50%', animation: `bounce 1s ${i*0.15}s infinite` }} />)}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div style={{ padding: '10px 16px', borderTop: '1px solid #e5e7eb', display: 'flex', gap: 8, alignItems: 'center' }}>
        {/* Voice button */}
        <button onClick={toggleVoice} style={{ width: 40, height: 40, borderRadius: 10, border: `1.5px solid ${listening ? '#dc2626' : '#e5e7eb'}`, background: listening ? '#fee2e2' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
          {listening ? <MicOff size={16} color="#dc2626" /> : <Mic size={16} color="#6b7280" />}
        </button>
        {listening && <p style={{ fontSize: 11, color: '#dc2626', flexShrink: 0 }}>🎙️ Listening...</p>}
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send(input)}
          placeholder={listening ? 'Speak now...' : 'Ask anything about farming...'}
          style={{ flex: 1, padding: '10px 14px', fontSize: 13, borderRadius: 10 }} />
        <button onClick={() => send(input)} disabled={!input.trim() || loading} style={{ width: 40, height: 40, background: '#16a34a', border: 'none', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', opacity: !input.trim() || loading ? 0.5 : 1, flexShrink: 0 }}>
          <Send size={15} color="#fff" />
        </button>
      </div>
    </div>
  )
}

// ── Dashboard Shell ───────────────────────────────────────────────────────────
export default function DashboardPage() {
  const router = useRouter()
  const { farmer, loading, logout } = useAuth()
  const [tab, setTab] = useState('feed')
  const [showReport, setShowReport] = useState(false)
  const [userLat, setUserLat] = useState(17.385)
  const [userLng, setUserLng] = useState(78.486)

  useEffect(() => {
    if (!loading && !farmer) router.push('/login')
    navigator.geolocation?.getCurrentPosition(p => { setUserLat(p.coords.latitude); setUserLng(p.coords.longitude) })
  }, [loading, farmer, router])

  const { data: reports = [], refetch } = useQuery({
    queryKey: ['reports'],
    queryFn: () => axios.get('/api/reports').then(r => r.data),
    enabled: !!farmer,
    refetchInterval: 60000,
  })

  if (loading || !farmer) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f9fafb' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 40, height: 40, background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}><Leaf size={20} color="#16a34a" /></div>
        <p style={{ fontSize: 13, color: '#6b7280' }}>Loading...</p>
      </div>
    </div>
  )

  const nearbyCount = reports.filter((r: any) => distKm(userLat, userLng, r.latitude, r.longitude) <= 200 && r.status === 'ACTIVE').length

  return (
    <div style={{ background: '#f9fafb', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ background: '#fff', borderBottom: '1px solid #e5e7eb', padding: '0 16px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 30, height: 30, background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Leaf size={14} color="#16a34a" /></div>
          <span style={{ fontWeight: 800, fontSize: 16, color: '#111' }}>Agri<span style={{ color: '#16a34a' }}>Mind</span></span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 30, height: 30, background: '#16a34a', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 12, color: '#fff' }}>{farmer.avatar}</div>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>{farmer.name.split(' ')[0]}</span>
          <button onClick={() => { logout(); router.push('/') }} style={{ padding: '5px 10px', border: '1px solid #fee2e2', borderRadius: 6, background: '#fff', color: '#dc2626', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}><LogOut size={12} /></button>
        </div>
      </div>

      <div style={{ paddingBottom: 70 }}>
        {tab === 'feed'    && <FeedTab reports={reports} userLat={userLat} userLng={userLng} onReport={() => setShowReport(true)} farmer={farmer} />}
        {tab === 'weather' && <WeatherTab userLat={userLat} userLng={userLng} />}
        {tab === 'scan'    && <ScanTab />}
        {tab === 'twin'    && <TwinTab />}
        {tab === 'market'  && <MarketTab farmer={farmer} userLat={userLat} userLng={userLng} />}
        {tab === 'chat'    && <ChatTab />}
      </div>

      <div className="bottom-nav">
        {TABS.map(t => {
          const active = tab === t.id
          const badge = t.id === 'feed' && nearbyCount > 0 ? nearbyCount : 0
          return (
            <button key={t.id} onClick={() => setTab(t.id)} style={{ flex: 1, padding: '8px 4px 10px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, border: 'none', background: 'transparent', cursor: 'pointer', position: 'relative' }}>
              <div style={{ position: 'relative' }}>
                <t.icon size={20} color={active ? '#16a34a' : '#9ca3af'} />
                {badge > 0 && <div style={{ position: 'absolute', top: -4, right: -4, width: 14, height: 14, background: '#dc2626', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span style={{ fontSize: 8, color: '#fff', fontWeight: 700 }}>{badge}</span></div>}
              </div>
              <span style={{ fontSize: 10, fontWeight: active ? 700 : 500, color: active ? '#16a34a' : '#9ca3af' }}>{t.label}</span>
              {active && <div style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: 20, height: 2, background: '#16a34a', borderRadius: 2 }} />}
            </button>
          )
        })}
      </div>

      <ReportModal open={showReport} onClose={() => setShowReport(false)} onSuccess={() => { setShowReport(false); refetch() }} />
    </div>
  )
}
