'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Camera, Bell, Cpu, MessageCircle, Map, BookOpen, CheckCircle, Zap, ArrowRight } from 'lucide-react'

const features = [
  {
    id: 'detect',
    icon: Camera,
    color: '#22c55e',
    badge: 'AI Vision',
    title: 'AI Pest & Disease Detection',
    desc: 'Upload a photo of your crop. Our GPT-4 Vision model identifies pests, diseases, and damage patterns with confidence scores and immediate treatment advice.',
    bullets: ['Instant image analysis', '8 crop types supported', 'Treatment recommendations', 'Confidence scoring'],
    demo: (
      <div className="rounded-xl p-4" style={{ background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.15)' }}>
        <p className="text-[11px] font-semibold text-green-400 mb-3">Sample Analysis Output</p>
        <div className="flex gap-3 mb-3">
          <div className="w-16 h-16 rounded-lg flex items-center justify-center text-2xl shrink-0" style={{ background: 'rgba(34,197,94,0.1)' }}>🌿</div>
          <div className="space-y-1.5 flex-1">
            {[['Pest','Fall Armyworm','#ef4444'],['Confidence','94%','#22c55e'],['Risk','HIGH','#ef4444']].map(([k,v,c]) => (
              <div key={k} className="flex justify-between">
                <span className="text-[11px]" style={{ color: '#4a7c5f' }}>{k}</span>
                <span className="text-[11px] font-bold" style={{ color: c as string }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-lg p-2.5" style={{ background: 'rgba(34,197,94,0.08)' }}>
          <p className="text-[11px] text-green-400 font-medium">✓ Treatment: Spray Emamectin Benzoate 0.4g/L in evening hours</p>
        </div>
      </div>
    ),
    stat: '94%',
    statLabel: 'Accuracy',
  },
  {
    id: 'alert',
    icon: Bell,
    color: '#ef4444',
    badge: 'Real-time',
    title: 'Outbreak Alert Network',
    desc: 'When one farmer reports a pest, AgriMind maps the spread path and sends proactive alerts to all farmers within the predicted risk zone — before the pest arrives.',
    bullets: ['Real-time spread prediction', 'GPS-based risk zoning', 'Push notifications', '5-minute alert speed'],
    demo: (
      <div className="space-y-2">
        <p className="text-[11px] font-semibold text-red-400 mb-2">Alert Propagation — Live</p>
        {[['Ramesh reports','Fall Armyworm detected','0s','#ef4444'],['3 nearby farms','Alert sent automatically','12s','#f59e0b'],['Kumar (20km)','Preventive action taken','5 min','#22c55e'],['Outbreak stopped','Network protected','24hr','#22c55e']].map(([who, action, time, color]) => (
          <div key={who} className="flex items-center gap-2 rounded-lg p-2" style={{ background: 'rgba(255,255,255,0.03)' }}>
            <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: color as string }} />
            <div className="flex-1">
              <p className="text-[11px] text-white font-medium">{who}</p>
              <p className="text-[10px]" style={{ color: '#4a7c5f' }}>{action}</p>
            </div>
            <span className="text-[10px] font-bold" style={{ color: color as string }}>{time}</span>
          </div>
        ))}
      </div>
    ),
    stat: '< 5min',
    statLabel: 'Alert Speed',
  },
  {
    id: 'twin',
    icon: Cpu,
    color: '#f59e0b',
    badge: 'Simulation',
    title: 'Digital Twin Simulator',
    desc: 'Create a virtual copy of your farm. Simulate multiple crop futures based on your soil, water, and nutrient data. Compare profit, yield, and risk before spending a rupee.',
    bullets: ['Yield prediction (tons/acre)', 'Profit forecasting (₹)', 'Risk scoring (Low/Med/High)', 'NPK & soil analysis'],
    demo: (
      <div className="space-y-2">
        <p className="text-[11px] font-semibold mb-2" style={{ color: '#f59e0b' }}>Ramesh's 3 Simulated Futures</p>
        {([['Future A','Maize','₹80,000','High','#ef4444',false],['Future B','Groundnut','₹65,000','Low','#22c55e',false],['Future C','Turmeric','₹1,20,000','Medium','#f59e0b',true]] as [string,string,string,string,string,boolean][]).map(([lbl,crop,profit,risk,rc,rec]) => (
          <div key={lbl} className="rounded-xl p-2.5 flex items-center justify-between"
            style={{ background: rec ? 'rgba(34,197,94,0.1)' : 'rgba(255,255,255,0.03)', border: rec ? '1px solid rgba(34,197,94,0.3)' : '1px solid rgba(255,255,255,0.05)' }}>
            <div className="flex items-center gap-2">
              <span className="text-[10px]" style={{ color: '#4a7c5f' }}>{lbl}</span>
              <span className="text-white text-xs font-semibold">{crop}</span>
              {rec && <span className="text-[9px] px-1.5 py-0.5 rounded-full text-black font-bold" style={{ background: '#22c55e' }}>✓ Best</span>}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold" style={{ color: rec ? '#22c55e' : '#f59e0b' }}>{profit}</span>
              <span className="text-[10px] font-bold" style={{ color: rc }}>{risk}</span>
            </div>
          </div>
        ))}
      </div>
    ),
    stat: '3x',
    statLabel: 'Better Decisions',
  },
  {
    id: 'chat',
    icon: MessageCircle,
    color: '#22c55e',
    badge: 'Multi-language',
    title: 'AI Wisdom Chat',
    desc: 'Ask AgriMind anything — in your language. Our AI draws from the collective knowledge of thousands of farmers to give you practical, locally-relevant advice.',
    bullets: ['5 Indian languages', 'Offline fallback answers', 'Pest & fertilizer advice', 'Irrigation guidance'],
    demo: (
      <div className="space-y-2">
        {[{role:'user',text:'How to treat Fall Armyworm organically?'},{role:'ai',text:'Spray neem oil 5ml/L every 7 days. Use Beauveria bassiana biopesticide. Install 5 pheromone traps per acre. 🌿'}].map((m, i) => (
          <div key={i} className={`flex gap-2 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {m.role === 'ai' && <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold text-black" style={{ background: '#22c55e' }}>AI</div>}
            <div className="max-w-[85%] rounded-xl px-3 py-2 text-[11px] leading-relaxed"
              style={m.role === 'user'
                ? { background: 'rgba(34,197,94,0.15)', color: '#fff', border: '1px solid rgba(34,197,94,0.25)' }
                : { background: 'rgba(255,255,255,0.05)', color: '#d1fae5', border: '1px solid rgba(34,197,94,0.12)' }}>
              {m.text}
            </div>
          </div>
        ))}
        <div className="flex gap-1.5 mt-2 flex-wrap">
          {['English','हिंदी','తెలుగు','தமிழ்','ಕನ್ನಡ'].map(l => (
            <span key={l} className="text-[10px] px-2 py-0.5 rounded-full font-medium" style={{ background: 'rgba(34,197,94,0.1)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.2)' }}>{l}</span>
          ))}
        </div>
      </div>
    ),
    stat: '5',
    statLabel: 'Languages',
  },
  {
    id: 'map',
    icon: Map,
    color: '#22c55e',
    badge: 'Live Map',
    title: 'Live Outbreak Map',
    desc: 'See active pest outbreaks across your district and state on an interactive map. Filter by risk level, crop type, and distance from your farm.',
    bullets: ['Real-time map markers', 'Risk level filtering', 'Click-to-view details', 'District-level view'],
    demo: (
      <div className="rounded-xl overflow-hidden" style={{ height: 120, background: 'linear-gradient(135deg,#0a1f14,#0c2a1a)', backgroundImage: 'linear-gradient(rgba(34,197,94,0.08) 1px,transparent 1px),linear-gradient(90deg,rgba(34,197,94,0.08) 1px,transparent 1px)', backgroundSize: '20px 20px', position: 'relative', border: '1px solid rgba(34,197,94,0.15)' }}>
        {[['30%','35%','#ef4444'],['55%','55%','#ef4444'],['75%','30%','#f59e0b'],['20%','65%','#f59e0b'],['65%','70%','#22c55e'],['45%','20%','#22c55e']].map(([l,t,c],i) => (
          <motion.div key={i} initial={{ scale: 0 }} whileInView={{ scale: 1 }} transition={{ delay: i * 0.1, type: 'spring' }}
            className="absolute rounded-full border-2 border-white"
            style={{ left: l, top: t, transform: 'translate(-50%,-50%)', width: 12, height: 12, background: c as string, boxShadow: `0 0 8px ${c}88` }} />
        ))}
        <div className="absolute bottom-2 left-2 flex gap-2">
          {[['High','#ef4444'],['Med','#f59e0b'],['Low','#22c55e']].map(([l,c]) => (
            <div key={l} className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full" style={{ background: c as string }} />
              <span className="text-[9px] font-medium" style={{ color: c as string }}>{l}</span>
            </div>
          ))}
        </div>
      </div>
    ),
    stat: '340+',
    statLabel: 'Villages',
  },
  {
    id: 'knowledge',
    icon: BookOpen,
    color: '#f59e0b',
    badge: 'Collective Wisdom',
    title: 'Collective Knowledge Base',
    desc: 'AgriMind captures and preserves the wisdom of experienced farmers — their decisions, successes, mistakes, and strategies — so every young farmer can benefit.',
    bullets: ['Decades of farmer wisdom', 'Experience-based answers', 'Local language support', 'Growing every day'],
    demo: (
      <div className="space-y-2">
        <p className="text-[11px] font-semibold mb-2" style={{ color: '#f59e0b' }}>Knowledge from Real Farmers</p>
        {[['Ravi, 35 yrs exp.','For cotton bollworm, spray chlorpyrifos at egg-hatching stage, not after damage appears.'],['Meena, 28 yrs exp.','Drip irrigation in summer reduces water use 40% and doubles yield quality for tomatoes.'],['Arjun, 42 yrs exp.','Intercrop groundnut with maize — it fixes nitrogen and reduces armyworm pressure naturally.']].map(([farmer, tip]) => (
          <div key={farmer} className="rounded-xl p-2.5" style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.12)' }}>
            <p className="text-[10px] font-bold mb-1" style={{ color: '#f59e0b' }}>{farmer}</p>
            <p className="text-[11px] leading-relaxed" style={{ color: '#6b9e7f' }}>{tip}</p>
          </div>
        ))}
      </div>
    ),
    stat: '1,240+',
    statLabel: 'Experiences',
  },
]

export default function FeaturesSection() {
  const [activeFeature, setActiveFeature] = useState<string | null>(null)

  return (
    <section id="features" className="py-28 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none grid-pattern opacity-50" />

      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold text-green-400 uppercase tracking-widest mb-5"
            style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)' }}>
            <Zap size={11} /> Platform Features
          </div>
          <h2 className="font-black text-white mb-5" style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.5rem)', letterSpacing: '-0.025em', lineHeight: 1.15 }}>
            Six Ways AgriMind<br /><span className="gradient-text">Protects Your Farm</span>
          </h2>
          <p className="text-lg max-w-2xl mx-auto leading-relaxed" style={{ color: '#6b9e7f' }}>
            From early detection to collective wisdom — every feature is designed to turn individual farmer knowledge into a shared intelligence network.
          </p>
        </motion.div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map(({ id, icon: Icon, color, badge, title, desc, bullets, demo, stat, statLabel }, i) => {
            const isActive = activeFeature === id
            return (
              <motion.div key={id}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="glass rounded-2xl overflow-hidden cursor-pointer group"
                style={{ border: `1px solid ${isActive ? color + '40' : 'rgba(34,197,94,0.1)'}` }}
                onClick={() => setActiveFeature(isActive ? null : id)}>

                <div className="p-6">
                  {/* Top row */}
                  <div className="flex items-start justify-between mb-4">
                    <motion.div className="w-12 h-12 rounded-2xl flex items-center justify-center"
                      style={{ background: `${color}12`, border: `1px solid ${color}20` }}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: 'spring', stiffness: 400 }}>
                      <Icon size={22} style={{ color }} />
                    </motion.div>
                    <div className="text-right">
                      <p className="text-2xl font-black" style={{ color }}>{stat}</p>
                      <p className="text-[10px] font-medium" style={{ color: '#4a7c5f' }}>{statLabel}</p>
                    </div>
                  </div>

                  {/* Badge */}
                  <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold mb-3"
                    style={{ background: `${color}12`, color, border: `1px solid ${color}25` }}>
                    {badge}
                  </div>

                  <h3 className="text-white font-bold text-lg mb-2 leading-snug">{title}</h3>
                  <p className="text-sm leading-relaxed mb-4" style={{ color: '#6b9e7f' }}>{desc}</p>

                  {/* Bullets */}
                  <ul className="space-y-1.5 mb-4">
                    {bullets.map(b => (
                      <li key={b} className="flex items-center gap-2 text-xs" style={{ color: '#4a7c5f' }}>
                        <CheckCircle size={11} style={{ color, flexShrink: 0 }} />
                        {b}
                      </li>
                    ))}
                  </ul>

                  {/* Expand hint */}
                  <button className="flex items-center gap-1.5 text-[11px] font-semibold transition-colors"
                    style={{ color: isActive ? color : '#4a7c5f' }}>
                    {isActive ? 'Hide demo' : 'See live demo'}
                    <motion.div animate={{ x: isActive ? 4 : 0 }}>
                      <ArrowRight size={11} />
                    </motion.div>
                  </button>
                </div>

                {/* Expandable demo */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="px-6 pb-6 border-t"
                      style={{ borderColor: `${color}20` }}>
                      <p className="text-[10px] font-semibold uppercase tracking-widest mt-4 mb-3" style={{ color: '#4a7c5f' }}>Live Preview</p>
                      {demo}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>

        {/* Bottom CTA row */}
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          className="mt-16 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6"
          style={{ background: 'linear-gradient(135deg, rgba(34,197,94,0.07), rgba(34,197,94,0.03))', border: '1px solid rgba(34,197,94,0.18)' }}>
          <div>
            <p className="text-white font-black text-xl mb-1" style={{ letterSpacing: '-0.02em' }}>All features work without any API keys</p>
            <p className="text-sm" style={{ color: '#4a7c5f' }}>Smart fallback responses built-in · Works offline · No signup required to explore</p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            {['No API key needed','Offline fallback','5 languages','Free to use'].map(tag => (
              <span key={tag} className="text-xs px-3 py-1.5 rounded-full font-semibold text-green-400"
                style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)' }}>
                ✓ {tag}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
