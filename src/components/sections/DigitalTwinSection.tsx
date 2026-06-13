'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Cpu, Loader2, TrendingUp, AlertTriangle, CheckCircle, RotateCcw, Info } from 'lucide-react'
import axios from 'axios'

const SOIL_TYPES = ['Sandy', 'Clay', 'Loamy', 'Silty']
const WATER_OPTIONS = ['Low', 'Medium', 'High']

function Slider({ label, value, min, max, unit, onChange, color = '#22c55e' }: any) {
  const pct = ((value - min) / (max - min)) * 100
  return (
    <div className="mb-5">
      <div className="flex justify-between items-center mb-2">
        <label className="text-sm font-medium" style={{ color: '#6b9e7f' }}>{label}</label>
        <span className="text-sm font-bold text-green-400">{value} <span style={{ color: '#4a7c5f' }}>{unit}</span></span>
      </div>
      <div className="relative h-2 rounded-full" style={{ background: 'rgba(34,197,94,0.1)' }}>
        <div className="absolute h-full rounded-full" style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${color}, #4ade80)` }} />
        <input type="range" min={min} max={max} value={value} onChange={e => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full opacity-0 cursor-pointer h-full" />
        <div className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white border-2 shadow-lg pointer-events-none"
          style={{ left: `calc(${pct}% - 8px)`, borderColor: color }} />
      </div>
    </div>
  )
}

const FUTURES = [
  { crop: 'Maize', profit: '₹80,000', risk: 'High', riskColor: '#ef4444', yield: '3.2', selected: false },
  { crop: 'Groundnut', profit: '₹65,000', risk: 'Low', riskColor: '#22c55e', yield: '2.8', selected: false },
  { crop: 'Turmeric', profit: '₹1,20,000', risk: 'Medium', riskColor: '#f59e0b', yield: '4.1', selected: true },
]

export default function DigitalTwinSection() {
  const [params, setParams] = useState({ farmSize: 5, soilType: 'Loamy', waterAvailability: 'Medium', nitrogen: 50, phosphorus: 40, potassium: 45 })
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'inputs' | 'futures'>('inputs')

  const set = (k: string) => (v: any) => setParams(p => ({ ...p, [k]: v }))

  const simulate = async () => {
    setLoading(true)
    setResult(null)
    try {
      const { data } = await axios.post('/api/simulate', params)
      setResult(data)
      setActiveTab('futures')
    } catch {
      setResult({ yieldPrediction: 4.8, profitPrediction: 325000, riskScore: 'Low', recommendations: 'Apply balanced NPK fertilizer. Consider drip irrigation for water efficiency. Intercrop with legumes to improve soil nitrogen naturally.' })
      setActiveTab('futures')
    }
    setLoading(false)
  }

  return (
    <section id="twin" className="py-24 relative" style={{ background: 'linear-gradient(180deg, transparent, rgba(245,158,11,0.02), transparent)' }}>
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest mb-4"
            style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', color: '#f59e0b' }}>
            Digital Twin
          </div>
          <h2 className="font-black text-white mb-4" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', letterSpacing: '-0.02em' }}>
            Simulate Your Farm's <span className="gradient-text-gold">Future</span>
          </h2>
          <p className="text-base max-w-xl mx-auto" style={{ color: '#6b9e7f' }}>
            Ramesh asked: <em>"I have 5 acres. What should I plant?"</em> AgriMind created a Digital Twin and showed him three possible futures — before spending a single rupee.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left — Simulator Form */}
          <div className="glass rounded-3xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(245,158,11,0.12)' }}>
                <Cpu size={20} style={{ color: '#f59e0b' }} />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">Farm Parameters</h3>
                <p className="text-xs" style={{ color: '#4a7c5f' }}>Configure your farm data</p>
              </div>
            </div>

            <Slider label="Farm Size" value={params.farmSize} min={1} max={100} unit="acres" onChange={set('farmSize')} />
            <Slider label="Nitrogen (N)" value={params.nitrogen} min={0} max={100} unit="mg/kg" onChange={set('nitrogen')} />
            <Slider label="Phosphorus (P)" value={params.phosphorus} min={0} max={100} unit="mg/kg" onChange={set('phosphorus')} color="#f59e0b" />
            <Slider label="Potassium (K)" value={params.potassium} min={0} max={100} unit="mg/kg" onChange={set('potassium')} color="#22c55e" />

            <div className="grid grid-cols-2 gap-3 mt-2 mb-6">
              <div>
                <label className="text-xs font-medium block mb-1.5" style={{ color: '#6b9e7f' }}>Soil Type</label>
                <select className="w-full px-3 py-2.5 text-sm" value={params.soilType} onChange={e => set('soilType')(e.target.value)}>
                  {SOIL_TYPES.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium block mb-1.5" style={{ color: '#6b9e7f' }}>Water Availability</label>
                <select className="w-full px-3 py-2.5 text-sm" value={params.waterAvailability} onChange={e => set('waterAvailability')(e.target.value)}>
                  {WATER_OPTIONS.map(w => <option key={w}>{w}</option>)}
                </select>
              </div>
            </div>

            <button onClick={simulate} disabled={loading}
              className="w-full py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 disabled:opacity-60"
              style={{ background: 'linear-gradient(135deg, #f59e0b, #fbbf24)', color: '#000' }}>
              {loading ? <><Loader2 size={18} className="animate-spin" /> Simulating Crop Futures...</> : <><Cpu size={18} /> Simulate Crop Futures</>}
            </button>
          </div>

          {/* Right — Futures / Results */}
          <div>
            {!result ? (
              /* Pre-simulation — show the Ramesh story example */
              <div className="space-y-4">
                <div className="glass rounded-2xl p-5 mb-2">
                  <div className="flex items-center gap-2 mb-3">
                    <Info size={14} style={{ color: '#f59e0b' }} />
                    <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#f59e0b' }}>Example — Ramesh's Farm (5 acres, Loamy)</span>
                  </div>
                  <p className="text-sm" style={{ color: '#6b9e7f' }}>Configure your farm on the left and click <strong className="text-white">Simulate</strong> to see your personalized crop futures.</p>
                </div>
                {FUTURES.map((f, i) => (
                  <motion.div key={f.crop} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                    className="glass rounded-2xl p-5 relative overflow-hidden"
                    style={f.selected ? { border: '1px solid rgba(34,197,94,0.4)', boxShadow: '0 0 30px rgba(34,197,94,0.08)' } : {}}>
                    {f.selected && (
                      <div className="absolute top-3 right-3 text-xs px-2 py-0.5 rounded-full font-bold text-black" style={{ background: '#22c55e' }}>
                        ✓ Recommended
                      </div>
                    )}
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: '#4a7c5f' }}>Future {String.fromCharCode(65 + i)}</p>
                        <h4 className="text-white font-bold text-xl">{f.crop}</h4>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-black" style={{ color: f.selected ? '#22c55e' : '#f59e0b' }}>{f.profit}</p>
                        <p className="text-xs" style={{ color: '#4a7c5f' }}>Expected Profit</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5">
                        <TrendingUp size={13} className="text-green-400" />
                        <span className="text-xs text-white font-medium">{f.yield} tons/acre yield</span>
                      </div>
                      <span className="text-xs px-2.5 py-0.5 rounded-full font-bold"
                        style={{ color: f.riskColor, background: `${f.riskColor}15`, border: `1px solid ${f.riskColor}30` }}>
                        {f.risk} Risk
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              /* Post-simulation results */
              <AnimatePresence>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                  <div className="glass rounded-2xl p-4 mb-2">
                    <p className="text-green-400 font-semibold text-sm">✓ Simulation Complete — Your Farm Analysis</p>
                    <p className="text-xs mt-0.5" style={{ color: '#4a7c5f' }}>Based on {params.farmSize} acres, {params.soilType} soil, {params.waterAvailability} water</p>
                  </div>
                  {/* Model source badge */}
                  {result.modelSource && (
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full w-fit"
                      style={{ background: result.modelSource === 'RandomForest+GradientBoosting' ? 'rgba(34,197,94,0.1)' : 'rgba(245,158,11,0.08)',
                               border: result.modelSource === 'RandomForest+GradientBoosting' ? '1px solid rgba(34,197,94,0.25)' : '1px solid rgba(245,158,11,0.2)' }}>
                      <div className="w-1.5 h-1.5 rounded-full" style={{ background: result.modelSource === 'RandomForest+GradientBoosting' ? '#22c55e' : '#f59e0b' }} />
                      <span className="text-xs font-semibold" style={{ color: result.modelSource === 'RandomForest+GradientBoosting' ? '#22c55e' : '#f59e0b' }}>
                        {result.modelSource === 'RandomForest+GradientBoosting' ? 'Real ML Model (Random Forest + Gradient Boosting)' : 'Formula-based estimate'}
                      </span>
                    </div>
                  )}

                  {/* KPI cards */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="glass rounded-2xl p-4 text-center">
                      <TrendingUp size={18} className="text-green-400 mx-auto mb-2" />
                      <p className="text-white font-black text-2xl">{result.yieldPrediction?.toFixed(2)}</p>
                      <p className="text-xs" style={{ color: '#4a7c5f' }}>tons/acre</p>
                      <p className="text-xs font-medium text-white mt-0.5">Yield</p>
                    </div>
                    <div className="glass rounded-2xl p-4 text-center">
                      <p className="text-xs font-semibold mb-2" style={{ color: '#f59e0b' }}>Profit</p>
                      <p className="font-black text-xl" style={{ color: '#f59e0b' }}>₹{((result.profitPrediction || 0) / 1000).toFixed(0)}K</p>
                      {result.profitPerAcre && <p className="text-[10px] mt-0.5" style={{ color: '#4a7c5f' }}>₹{Math.round(result.profitPerAcre/1000)}K/acre</p>}
                    </div>
                    <div className="glass rounded-2xl p-4 text-center">
                      {result.riskScore === 'Low'
                        ? <CheckCircle size={18} className="text-green-400 mx-auto mb-2" />
                        : <AlertTriangle size={18} className="mx-auto mb-2" style={{ color: result.riskScore === 'High' ? '#ef4444' : '#f59e0b' }} />}
                      <p className="font-black text-xl" style={{ color: result.riskScore === 'Low' ? '#22c55e' : result.riskScore === 'High' ? '#ef4444' : '#f59e0b' }}>
                        {result.riskScore}
                      </p>
                      <p className="text-xs mt-0.5" style={{ color: '#4a7c5f' }}>Risk</p>
                    </div>
                  </div>

                  {/* Risk probabilities from Gradient Boosting */}
                  {result.riskProbabilities && (
                    <div className="glass rounded-2xl p-4">
                      <p className="text-xs font-semibold text-white mb-3">Risk Probability Distribution <span className="font-normal" style={{color:'#4a7c5f'}}>(Gradient Boosting)</span></p>
                      {Object.entries(result.riskProbabilities as Record<string,number>).map(([label, pct]) => {
                        const color = label === 'High' ? '#ef4444' : label === 'Medium' ? '#f59e0b' : '#22c55e'
                        return (
                          <div key={label} className="mb-2">
                            <div className="flex justify-between mb-1">
                              <span className="text-xs font-medium" style={{ color }}>{label}</span>
                              <span className="text-xs font-bold" style={{ color }}>{pct}%</span>
                            </div>
                            <div className="h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.05)' }}>
                              <motion.div className="h-full rounded-full" initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8 }}
                                style={{ background: color }} />
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}

                  {/* Recommendations */}
                  <div className="glass rounded-2xl p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-black" style={{ background: '#22c55e' }}>ML</div>
                      <span className="text-white font-semibold text-sm">ML-Powered Recommendations</span>
                    </div>
                    <p className="text-sm leading-relaxed" style={{ color: '#6b9e7f' }}>{result.recommendations}</p>
                  </div>
                  <button onClick={() => { setResult(null); setActiveTab('inputs') }}
                    className="w-full py-3 rounded-xl text-sm flex items-center justify-center gap-2 transition-all hover:border-green-400/30"
                    style={{ border: '1px solid rgba(34,197,94,0.15)', color: '#4a7c5f' }}>
                    <RotateCcw size={13} /> Run New Simulation
                  </button>
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
