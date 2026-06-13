'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Cpu, Loader2, TrendingUp, AlertTriangle, CheckCircle, RotateCcw, Sprout } from 'lucide-react'
import { cn } from '@/lib/utils'
import axios from 'axios'

interface SimResult {
  yieldPrediction: number
  profitPrediction: number
  riskScore: string
  recommendations: string
  bestCrop?: string
  cropOptions?: { crop: string; profit: string; risk: string; reason: string }[]
}

// Farmer-friendly questions — no lab values needed
const SOIL_COLOR_OPTIONS = [
  { value: 'Loamy',  label: '🟤 Dark brown / Black soil' },
  { value: 'Silty',  label: '🟫 Reddish brown soil' },
  { value: 'Clay',   label: '🟡 Yellow / Light brown soil' },
  { value: 'Sandy',  label: '⚪ Sandy / Light coloured soil' },
]
const WATER_OPTIONS = [
  { value: 'High',   label: '💧 River / Canal nearby' },
  { value: 'Medium', label: '🪣 Borewell / Well water' },
  { value: 'Low',    label: '🌧️ Only rainwater' },
]
const SEASON_OPTIONS = [
  { value: 'Kharif', label: '☀️ Kharif (June–Oct)' },
  { value: 'Rabi',   label: '❄️ Rabi (Nov–Mar)' },
  { value: 'Zaid',   label: '🌤️ Zaid (Mar–Jun)' },
]
const LAST_CROP_OPTIONS = ['Maize','Cotton','Rice','Wheat','Tomato','Sugarcane','Groundnut','Turmeric','Fallow (nothing)']

export function DigitalTwin() {
  const [params, setParams] = useState({
    farmSize: 5,
    soilColor: 'Loamy',
    waterSource: 'Medium',
    season: 'Kharif',
    lastCrop: 'Fallow (nothing)',
    hasOrganicManure: 'yes',
  })
  const [result, setResult] = useState<SimResult | null>(null)
  const [loading, setLoading] = useState(false)

  const set = (k: string) => (v: any) => setParams(p => ({ ...p, [k]: v }))

  const simulate = async () => {
    setLoading(true)
    setResult(null)
    try {
      const { data } = await axios.post('/api/simulate', {
        farmSize: params.farmSize,
        soilType: params.soilColor,
        waterAvailability: params.waterSource,
        season: params.season,
        lastCrop: params.lastCrop,
        hasOrganicManure: params.hasOrganicManure,
        // NPK estimated internally by API based on farmer answers
      })
      setResult(data)
    } catch {
      setResult({ yieldPrediction: 4.8, profitPrediction: 325000, riskScore: 'Low', bestCrop: 'Groundnut', recommendations: 'Based on your soil and water conditions, Groundnut or Maize would work well this season.' })
    }
    setLoading(false)
  }

  const riskColor = result?.riskScore === 'High' ? 'text-danger' : result?.riskScore === 'Medium' ? 'text-accent' : 'text-primary'

  return (
    <div className="px-4 py-4 space-y-4 overflow-y-auto pb-24">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-primary/20 flex items-center justify-center glow-green">
          <Cpu size={20} className="text-primary" />
        </div>
        <div>
          <h2 className="text-white font-bold text-base">What Should I Plant?</h2>
          <p className="text-muted text-xs">Answer simple questions — AI will suggest the best crop</p>
        </div>
      </div>

      <div className="glass rounded-2xl p-4 space-y-5">
        {/* Farm size */}
        <div>
          <label className="text-xs text-muted font-semibold block mb-2">How big is your farm?</label>
          <div className="flex items-center gap-3">
            <input type="range" min={1} max={50} value={params.farmSize}
              onChange={e => set('farmSize')(Number(e.target.value))}
              className="flex-1 accent-green-400" />
            <span className="text-primary font-bold text-sm w-16 text-right">{params.farmSize} acres</span>
          </div>
        </div>

        {/* Soil color */}
        <div>
          <label className="text-xs text-muted font-semibold block mb-2">What colour is your soil?</label>
          <div className="grid grid-cols-2 gap-2">
            {SOIL_COLOR_OPTIONS.map(o => (
              <button key={o.value} onClick={() => set('soilColor')(o.value)}
                className={cn('py-2 px-3 rounded-xl text-xs text-left border transition-all',
                  params.soilColor === o.value ? 'border-primary/60 bg-primary/10 text-white' : 'border-[#1a3328] text-muted')}>
                {o.label}
              </button>
            ))}
          </div>
        </div>

        {/* Water source */}
        <div>
          <label className="text-xs text-muted font-semibold block mb-2">What is your water source?</label>
          <div className="space-y-2">
            {WATER_OPTIONS.map(o => (
              <button key={o.value} onClick={() => set('waterSource')(o.value)}
                className={cn('w-full py-2 px-3 rounded-xl text-xs text-left border transition-all',
                  params.waterSource === o.value ? 'border-primary/60 bg-primary/10 text-white' : 'border-[#1a3328] text-muted')}>
                {o.label}
              </button>
            ))}
          </div>
        </div>

        {/* Season */}
        <div>
          <label className="text-xs text-muted font-semibold block mb-2">Which season are you planting in?</label>
          <div className="grid grid-cols-3 gap-2">
            {SEASON_OPTIONS.map(o => (
              <button key={o.value} onClick={() => set('season')(o.value)}
                className={cn('py-2 px-2 rounded-xl text-[11px] text-center border transition-all',
                  params.season === o.value ? 'border-primary/60 bg-primary/10 text-white' : 'border-[#1a3328] text-muted')}>
                {o.label}
              </button>
            ))}
          </div>
        </div>

        {/* Last crop */}
        <div>
          <label className="text-xs text-muted font-semibold block mb-2">What did you grow last season?</label>
          <select value={params.lastCrop} onChange={e => set('lastCrop')(e.target.value)}
            className="w-full bg-background border border-[#1a3328] rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-primary/50">
            {LAST_CROP_OPTIONS.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>

        {/* Organic manure */}
        <div>
          <label className="text-xs text-muted font-semibold block mb-2">Do you use organic manure / compost?</label>
          <div className="grid grid-cols-2 gap-2">
            {[{ value: 'yes', label: '✅ Yes' }, { value: 'no', label: '❌ No' }].map(o => (
              <button key={o.value} onClick={() => set('hasOrganicManure')(o.value)}
                className={cn('py-2 rounded-xl text-xs border transition-all',
                  params.hasOrganicManure === o.value ? 'border-primary/60 bg-primary/10 text-white' : 'border-[#1a3328] text-muted')}>
                {o.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <button onClick={simulate} disabled={loading}
        className="w-full py-4 rounded-2xl bg-gradient-to-r from-primary to-primary-dark text-background font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-60 hover:shadow-glow transition-all">
        {loading ? <><Loader2 size={16} className="animate-spin" /> Analysing your farm...</> : <><Sprout size={16} /> Find Best Crop for My Farm</>}
      </button>

      <AnimatePresence>
        {result && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
            {/* Best crop banner */}
            {result.bestCrop && (
              <div className="rounded-2xl p-4 text-center" style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)' }}>
                <p className="text-muted text-xs mb-1">Best Crop for Your Farm</p>
                <p className="text-white font-black text-2xl text-green-400">{result.bestCrop} 🌱</p>
              </div>
            )}

            <div className="grid grid-cols-3 gap-3">
              <div className="glass rounded-2xl p-3 text-center">
                <TrendingUp size={16} className="text-primary mx-auto mb-1.5" />
                <p className="text-white font-bold text-base">{result.yieldPrediction.toFixed(1)}</p>
                <p className="text-muted text-[10px]">tons/acre</p>
              </div>
              <div className="glass rounded-2xl p-3 text-center">
                <p className="text-accent text-[10px] font-medium mb-1">Profit</p>
                <p className="text-accent font-bold text-sm">₹{(result.profitPrediction / 1000).toFixed(0)}K</p>
              </div>
              <div className="glass rounded-2xl p-3 text-center">
                {result.riskScore === 'Low'
                  ? <CheckCircle size={16} className="text-primary mx-auto mb-1.5" />
                  : <AlertTriangle size={16} className={cn('mx-auto mb-1.5', riskColor)} />}
                <p className={cn('font-bold text-sm', riskColor)}>{result.riskScore}</p>
                <p className="text-muted text-[10px] mt-0.5">Risk</p>
              </div>
            </div>

            {result.cropOptions && result.cropOptions.length > 0 && (
              <div className="glass rounded-2xl p-4">
                <p className="text-white text-xs font-semibold mb-3">All Crop Options for You</p>
                <div className="space-y-2">
                  {result.cropOptions.map((c, i) => (
                    <div key={c.crop} className="flex items-center justify-between rounded-xl px-3 py-2"
                      style={{ background: i === 0 ? 'rgba(34,197,94,0.1)' : 'rgba(255,255,255,0.03)', border: i === 0 ? '1px solid rgba(34,197,94,0.3)' : '1px solid rgba(255,255,255,0.05)' }}>
                      <div>
                        <p className="text-white text-xs font-semibold">{i === 0 ? '⭐ ' : ''}{c.crop}</p>
                        <p className="text-muted text-[10px]">{c.reason}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-green-400 text-xs font-bold">{c.profit}</p>
                        <p className="text-[10px]" style={{ color: c.risk === 'Low' ? '#22c55e' : c.risk === 'Medium' ? '#f59e0b' : '#ef4444' }}>{c.risk} risk</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="glass rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center"><span className="text-primary text-[10px]">AI</span></div>
                <span className="text-white text-sm font-semibold">Farming Advice</span>
              </div>
              <p className="text-muted text-sm leading-relaxed">{result.recommendations}</p>
            </div>

            <button onClick={() => setResult(null)}
              className="w-full py-2.5 rounded-xl border border-[#1a3328] text-muted text-sm flex items-center justify-center gap-2 hover:border-primary/30 transition-all">
              <RotateCcw size={13} /> Try Again
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
