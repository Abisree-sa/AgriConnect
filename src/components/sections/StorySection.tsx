'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, Bell, CheckCircle, TrendingUp, Users, Brain, MapPin, Clock, Smartphone, Wifi, ChevronRight, Leaf } from 'lucide-react'

const steps = [
  {
    id: 'old',
    icon: AlertTriangle,
    color: '#ef4444',
    bg: 'rgba(239,68,68,0.08)',
    border: 'rgba(239,68,68,0.25)',
    who: 'Before AgriMind',
    title: 'Ramesh walks his field at 5:30 AM',
    desc: 'He notices strange marks on his maize leaves. He ignores it. "Maybe it\'s nothing." Three days later the damage spreads. A week later — a full pest infestation. The loss is already significant by the time officers confirm.',
    quote: '"If only I had known earlier."',
    tag: 'The Old Reality',
    visual: 'loss',
  },
  {
    id: 'detect',
    icon: Brain,
    color: '#22c55e',
    bg: 'rgba(34,197,94,0.08)',
    border: 'rgba(34,197,94,0.25)',
    who: 'With AgriMind',
    title: 'He opens the app, takes a photo',
    desc: 'The AI analyzes the image instantly. It detects Fall Armyworm. But AgriMind does something more powerful — it learns from the report. It checks crop type, location, weather, and similar reports from nearby regions.',
    quote: 'Collective intelligence activates.',
    tag: 'AI Detection',
    visual: 'ai',
  },
  {
    id: 'alert',
    icon: Bell,
    color: '#f59e0b',
    bg: 'rgba(245,158,11,0.08)',
    border: 'rgba(245,158,11,0.25)',
    who: 'Kumar — 20 km away',
    title: 'Kumar receives a warning',
    desc: 'His field still looks healthy. But the system has predicted the outbreak path. He gets an alert: "Pest outbreak reported in nearby maize fields. Estimated spread risk: HIGH within 5 days."',
    quote: '"For the first time, I avoided a problem before it happened."',
    tag: 'Outbreak Alert',
    visual: 'notification',
  },
  {
    id: 'saved',
    icon: CheckCircle,
    color: '#22c55e',
    bg: 'rgba(34,197,94,0.08)',
    border: 'rgba(34,197,94,0.25)',
    who: 'The Outcome',
    title: 'Kumar takes preventive action',
    desc: 'He sprays preventive treatment immediately. The outbreak never reaches his farm. His crops are saved. His income is protected. The network worked.',
    quote: "One farmer's loss became every farmer's protection.",
    tag: 'Farm Saved ✓',
    visual: 'saved',
  },
  {
    id: 'twin',
    icon: TrendingUp,
    color: '#f59e0b',
    bg: 'rgba(245,158,11,0.08)',
    border: 'rgba(245,158,11,0.25)',
    who: 'Planting Season',
    title: 'Ramesh asks: "What should I plant?"',
    desc: 'AgriMind creates a Digital Twin of his 5-acre farm. It simulates soil conditions, water availability, weather forecasts and market trends. Then it shows him three possible futures before he spends a single rupee.',
    quote: '"For the first time, I am comparing futures, not guessing."',
    tag: 'Digital Twin',
    visual: 'twin',
  },
  {
    id: 'network',
    icon: Users,
    color: '#22c55e',
    bg: 'rgba(34,197,94,0.08)',
    border: 'rgba(34,197,94,0.25)',
    who: 'The Network Effect',
    title: 'As more farmers join, the network gets smarter',
    desc: 'One farmer discovers a pest — thousands learn. One farmer finds a successful irrigation technique — thousands benefit. One farmer identifies a profitable market — thousands gain access. Knowledge no longer stays inside individual villages.',
    quote: 'It becomes collective intelligence.',
    tag: 'Collective Power',
    visual: 'network',
  },
]

/* ── mini visual widgets per step ── */
function LossVisual() {
  return (
    <div className="rounded-2xl p-4 space-y-2" style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)' }}>
      <p className="text-xs font-semibold text-red-400 mb-3">Timeline of Loss</p>
      {[['Day 1','Strange marks noticed','text-white'],['Day 3','Damage spreads','text-red-300'],['Day 7','Full infestation','text-red-400'],['Day 14','Officers confirm','text-red-500 font-bold']].map(([day, event, cls]) => (
        <div key={day} className="flex items-center gap-3">
          <span className="text-[11px] w-10 shrink-0" style={{ color: '#4a7c5f' }}>{day}</span>
          <div className="flex-1 h-px" style={{ background: 'rgba(239,68,68,0.2)' }} />
          <span className={`text-[11px] ${cls}`}>{event}</span>
        </div>
      ))}
      <div className="mt-3 rounded-xl p-2.5 text-center" style={{ background: 'rgba(239,68,68,0.1)' }}>
        <p className="text-red-400 font-bold text-sm">₹45,000 Lost</p>
        <p className="text-[11px] text-red-400/70">Preventable damage</p>
      </div>
    </div>
  )
}

function AIVisual() {
  return (
    <div className="rounded-2xl p-4" style={{ background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.15)' }}>
      <div className="flex items-center gap-2 mb-3">
        <Smartphone size={13} className="text-green-400" />
        <p className="text-xs font-semibold text-green-400">AI Analysis Result</p>
        <div className="ml-auto flex items-center gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          <span className="text-[10px] text-green-400">Live</span>
        </div>
      </div>
      <div className="space-y-2">
        {[['Pest Detected','Fall Armyworm','#ef4444'],['Crop','Maize','#22c55e'],['Confidence','94%','#22c55e'],['Risk Level','HIGH','#ef4444'],['Treatment','Emamectin Benzoate','#f59e0b']].map(([label, value, color]) => (
          <div key={label} className="flex items-center justify-between">
            <span className="text-[11px]" style={{ color: '#4a7c5f' }}>{label}</span>
            <span className="text-[11px] font-bold" style={{ color }}>{value}</span>
          </div>
        ))}
      </div>
      <div className="mt-3 rounded-xl p-2 text-center" style={{ background: 'rgba(34,197,94,0.08)' }}>
        <p className="text-[11px] text-green-400 font-medium">🌐 Alerting 4 nearby farmers...</p>
      </div>
    </div>
  )
}

function NotificationVisual() {
  return (
    <div className="rounded-2xl p-4" style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.2)' }}>
      <div className="flex items-center gap-2 mb-3">
        <Bell size={13} style={{ color: '#f59e0b' }} />
        <p className="text-xs font-semibold" style={{ color: '#f59e0b' }}>Push Notification — Kumar's Phone</p>
      </div>
      <div className="rounded-xl p-3" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(245,158,11,0.2)' }}>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: 'rgba(34,197,94,0.2)' }}>
            <Leaf size={11} className="text-green-400" />
          </div>
          <span className="text-white text-xs font-semibold">AgriMind</span>
          <span className="ml-auto text-[10px]" style={{ color: '#4a7c5f' }}>now</span>
        </div>
        <p className="text-white text-xs font-bold mb-1">⚠️ Pest Outbreak Warning</p>
        <p className="text-xs leading-relaxed" style={{ color: '#aaa' }}>Fall Armyworm reported in nearby maize fields. Spread risk to your area: <span className="text-red-400 font-bold">HIGH within 5 days.</span></p>
      </div>
      <div className="flex gap-2 mt-3">
        <div className="flex-1 rounded-lg py-1.5 text-center text-[11px] font-semibold text-black" style={{ background: '#f59e0b' }}>View Details</div>
        <div className="flex-1 rounded-lg py-1.5 text-center text-[11px] font-semibold" style={{ color: '#f59e0b', border: '1px solid rgba(245,158,11,0.3)' }}>Dismiss</div>
      </div>
    </div>
  )
}

function SavedVisual() {
  return (
    <div className="rounded-2xl p-4" style={{ background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.2)' }}>
      <p className="text-xs font-semibold text-green-400 mb-3">Farm Outcome Comparison</p>
      <div className="space-y-3">
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-[11px] text-red-400">Ramesh (no warning)</span>
            <span className="text-[11px] font-bold text-red-400">₹45K lost</span>
          </div>
          <div className="h-2 rounded-full" style={{ background: 'rgba(239,68,68,0.15)' }}>
            <motion.div className="h-full rounded-full bg-red-400" initial={{ width: 0 }} whileInView={{ width: '75%' }} transition={{ duration: 1 }} />
          </div>
        </div>
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-[11px] text-green-400">Kumar (got alert)</span>
            <span className="text-[11px] font-bold text-green-400">₹0 lost ✓</span>
          </div>
          <div className="h-2 rounded-full" style={{ background: 'rgba(34,197,94,0.1)' }}>
            <motion.div className="h-full rounded-full" style={{ background: '#22c55e', width: '5%' }} initial={{ width: 0 }} whileInView={{ width: '5%' }} transition={{ duration: 1 }} />
          </div>
        </div>
      </div>
      <div className="mt-3 rounded-xl p-2.5 text-center" style={{ background: 'rgba(34,197,94,0.1)' }}>
        <p className="text-green-400 font-bold text-sm">₹45,000 Saved</p>
        <p className="text-[11px]" style={{ color: '#4a7c5f' }}>Because of one alert</p>
      </div>
    </div>
  )
}

function TwinVisual() {
  const futures = [
    { label: 'Future A', crop: 'Maize', profit: '₹80K', risk: 'High', color: '#ef4444' },
    { label: 'Future B', crop: 'Groundnut', profit: '₹65K', risk: 'Low', color: '#22c55e' },
    { label: 'Future C', crop: 'Turmeric', profit: '₹1.2L', risk: 'Medium', color: '#f59e0b', recommended: true },
  ]
  return (
    <div className="rounded-2xl p-4" style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.2)' }}>
      <p className="text-xs font-semibold mb-3" style={{ color: '#f59e0b' }}>3 Simulated Futures — 5 Acres</p>
      <div className="space-y-2">
        {futures.map(f => (
          <div key={f.label} className="rounded-xl p-2.5 flex items-center justify-between"
            style={{ background: f.recommended ? 'rgba(34,197,94,0.1)' : 'rgba(0,0,0,0.2)', border: f.recommended ? '1px solid rgba(34,197,94,0.3)' : '1px solid rgba(255,255,255,0.05)' }}>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold" style={{ color: '#4a7c5f' }}>{f.label}</span>
              <span className="text-white text-xs font-semibold">{f.crop}</span>
              {f.recommended && <span className="text-[9px] px-1.5 py-0.5 rounded-full text-black font-bold" style={{ background: '#22c55e' }}>Best</span>}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold" style={{ color: f.recommended ? '#22c55e' : '#f59e0b' }}>{f.profit}</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold" style={{ color: f.color, background: `${f.color}15` }}>{f.risk}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function NetworkVisual() {
  const nodes = [
    { x: 50, y: 50, label: 'R', main: true },
    { x: 20, y: 25, label: 'K' },
    { x: 75, y: 20, label: 'S' },
    { x: 80, y: 65, label: 'P' },
    { x: 30, y: 75, label: 'A' },
    { x: 55, y: 20, label: 'M' },
  ]
  return (
    <div className="rounded-2xl p-4" style={{ background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.15)' }}>
      <p className="text-xs font-semibold text-green-400 mb-3">Knowledge Propagation Network</p>
      <div className="relative h-28 mb-3">
        <svg className="absolute inset-0 w-full h-full">
          {nodes.slice(1).map((n, i) => (
            <motion.line key={i}
              x1={`${nodes[0].x}%`} y1={`${nodes[0].y}%`}
              x2={`${n.x}%`} y2={`${n.y}%`}
              stroke="rgba(34,197,94,0.3)" strokeWidth="1"
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 1 }}
              transition={{ delay: i * 0.15, duration: 0.5 }} />
          ))}
        </svg>
        {nodes.map((n, i) => (
          <motion.div key={i} initial={{ scale: 0 }} whileInView={{ scale: 1 }} transition={{ delay: i * 0.1, type: 'spring' }}
            className="absolute flex items-center justify-center text-[10px] font-bold rounded-full"
            style={{ left: `${n.x}%`, top: `${n.y}%`, transform: 'translate(-50%,-50%)',
              width: n.main ? 32 : 24, height: n.main ? 32 : 24,
              background: n.main ? '#22c55e' : 'rgba(34,197,94,0.2)',
              border: n.main ? '2px solid #4ade80' : '1px solid rgba(34,197,94,0.4)',
              color: n.main ? '#000' : '#22c55e',
              boxShadow: n.main ? '0 0 16px rgba(34,197,94,0.5)' : undefined }}>
            {n.label}
          </motion.div>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-1.5">
        {[['1 report','→ 5 alerts'],['5 alerts','→ 1,240 safe'],['24 hrs','→ 340 villages']].map(([top, bot]) => (
          <div key={top} className="rounded-lg p-2 text-center" style={{ background: 'rgba(34,197,94,0.08)' }}>
            <p className="text-green-400 text-[10px] font-bold">{top}</p>
            <p className="text-[10px]" style={{ color: '#4a7c5f' }}>{bot}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

const VISUALS: Record<string, React.FC> = {
  loss: LossVisual, ai: AIVisual, notification: NotificationVisual,
  saved: SavedVisual, twin: TwinVisual, network: NetworkVisual,
}

export default function StorySection() {
  const [active, setActive] = useState<number | null>(null)

  return (
    <section id="story" className="py-28 relative overflow-hidden">
      {/* subtle bg glow */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(34,197,94,0.04) 0%, transparent 70%)' }} />

      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold text-green-400 uppercase tracking-widest mb-5"
            style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)' }}>
            <Leaf size={11} /> The Story
          </div>
          <h2 className="font-black text-white mb-5" style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.5rem)', letterSpacing: '-0.025em', lineHeight: 1.15 }}>
            Why <span className="gradient-text">AgriMind</span> Exists
          </h2>
          <p className="text-lg max-w-2xl mx-auto leading-relaxed" style={{ color: '#6b9e7f' }}>
            Two farmers. Twenty kilometres apart. The same crop. The same pest.<br />
            One was destroyed. One was saved.<br />
            The difference was <strong className="text-green-400">collective intelligence</strong>.
          </p>
          {/* Farmer avatars */}
          <div className="flex items-center justify-center gap-6 mt-8">
            {[{ name: 'Ramesh', role: 'Maize Farmer · Guntur', color: '#ef4444', outcome: 'Lost ₹45K', outcomeBg: 'rgba(239,68,68,0.1)' },
              { name: 'Kumar', role: 'Maize Farmer · 20 km away', color: '#22c55e', outcome: 'Saved ✓', outcomeBg: 'rgba(34,197,94,0.1)' }].map(f => (
              <div key={f.name} className="flex flex-col items-center gap-2">
                <div className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-black"
                  style={{ background: `${f.color}20`, border: `2px solid ${f.color}40`, color: f.color }}>
                  {f.name[0]}
                </div>
                <p className="text-white font-bold text-sm">{f.name}</p>
                <p className="text-[11px]" style={{ color: '#4a7c5f' }}>{f.role}</p>
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full" style={{ color: f.color, background: f.outcomeBg }}>
                  {f.outcome}
                </span>
              </div>
            ))}
            <div className="flex flex-col items-center gap-1">
              <div className="w-8 h-px" style={{ background: 'rgba(34,197,94,0.3)' }} />
              <span className="text-[10px]" style={{ color: '#4a7c5f' }}>vs</span>
              <div className="w-8 h-px" style={{ background: 'rgba(34,197,94,0.3)' }} />
            </div>
          </div>
        </motion.div>

        {/* Timeline */}
        <div className="relative max-w-5xl mx-auto">
          {/* Center line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px md:-translate-x-px"
            style={{ background: 'linear-gradient(180deg, rgba(34,197,94,0.6), rgba(34,197,94,0.1))' }} />

          <div className="space-y-12">
            {steps.map((step, i) => {
              const Icon = step.icon
              const isRight = i % 2 === 1
              const Visual = VISUALS[step.visual]
              const isOpen = active === i

              return (
                <motion.div key={i}
                  initial={{ opacity: 0, x: isRight ? 50 : -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.05 }}
                  className={`relative flex flex-col md:flex-row ${isRight ? 'md:flex-row-reverse' : ''} items-start md:items-start gap-8 pl-20 md:pl-0`}>

                  {/* Step number + dot */}
                  <div className="absolute left-4 md:left-1/2 md:-translate-x-1/2 flex flex-col items-center gap-1.5 z-10">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center shadow-lg"
                      style={{ background: step.bg, border: `2px solid ${step.color}`, boxShadow: `0 0 16px ${step.color}40` }}>
                      <Icon size={14} style={{ color: step.color }} />
                    </div>
                    <span className="text-[9px] font-black" style={{ color: step.color }}>{String(i + 1).padStart(2, '0')}</span>
                  </div>

                  {/* Card */}
                  <div className={`md:w-[47%] ${isRight ? 'md:mr-auto md:ml-10' : 'md:ml-auto md:mr-10'}`}>
                    <motion.div
                      className="glass rounded-2xl overflow-hidden cursor-pointer"
                      style={{ border: `1px solid ${isOpen ? step.color + '40' : 'rgba(34,197,94,0.12)'}` }}
                      whileHover={{ borderColor: step.color + '40', y: -2 }}
                      transition={{ duration: 0.2 }}
                      onClick={() => setActive(isOpen ? null : i)}>

                      <div className="p-5">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-[11px] font-bold px-3 py-1 rounded-full"
                            style={{ background: step.bg, color: step.color, border: `1px solid ${step.border}` }}>
                            {step.tag}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-medium" style={{ color: '#4a7c5f' }}>{step.who}</span>
                            <motion.div animate={{ rotate: isOpen ? 90 : 0 }} transition={{ duration: 0.2 }}>
                              <ChevronRight size={14} style={{ color: '#4a7c5f' }} />
                            </motion.div>
                          </div>
                        </div>

                        <h3 className="text-white font-bold text-base mb-2 leading-snug">{step.title}</h3>
                        <p className="text-sm leading-relaxed mb-3" style={{ color: '#6b9e7f' }}>{step.desc}</p>

                        <div className="rounded-xl p-3 text-sm font-medium italic"
                          style={{ background: `${step.color}08`, borderLeft: `3px solid ${step.color}`, color: step.color }}>
                          {step.quote}
                        </div>
                      </div>

                      {/* Expandable visual */}
                      <AnimatePresence>
                        {isOpen && (
                          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }} className="px-5 pb-5">
                            <div className="pt-1 border-t border-green-400/10">
                              <p className="text-[11px] font-semibold uppercase tracking-widest mb-3 mt-3" style={{ color: '#4a7c5f' }}>Live Preview</p>
                              <Visual />
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {!isOpen && (
                        <div className="px-5 pb-3">
                          <button className="text-[11px] font-semibold flex items-center gap-1 transition-colors hover:text-green-400" style={{ color: '#4a7c5f' }}>
                            See live preview <ChevronRight size={11} />
                          </button>
                        </div>
                      )}
                    </motion.div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Bottom summary */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="mt-20 rounded-3xl p-8 text-center"
          style={{ background: 'linear-gradient(135deg, rgba(34,197,94,0.08), rgba(34,197,94,0.04))', border: '1px solid rgba(34,197,94,0.2)' }}>
          <p className="text-2xl font-black text-white mb-3" style={{ letterSpacing: '-0.02em' }}>
            "The future of farming is not just artificial intelligence.
          </p>
          <p className="text-2xl font-black gradient-text mb-4" style={{ letterSpacing: '-0.02em' }}>
            It is collective intelligence."
          </p>
          <p className="text-sm" style={{ color: '#4a7c5f' }}>And when one farmer learns — every farmer benefits.</p>
        </motion.div>
      </div>
    </section>
  )
}
