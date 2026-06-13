'use client'
import { motion } from 'framer-motion'
import { ArrowRight, Leaf, Shield, Zap, Users } from 'lucide-react'

interface Props { onReport: () => void }

export default function HeroSection({ onReport }: Props) {
  const scroll = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  return (
    <section id="hero" className="relative min-h-screen flex flex-col items-center justify-center hero-bg grid-pattern overflow-hidden pt-20">
      {/* Glow orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full pointer-events-none aurora"
        style={{ background: 'radial-gradient(circle, rgba(16,217,160,0.09) 0%, rgba(6,182,212,0.05) 50%, transparent 70%)' }} />
      <div className="absolute top-1/3 left-1/4 w-64 h-64 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(129,140,248,0.07) 0%, transparent 70%)' }} />
      <div className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(245,166,35,0.06) 0%, transparent 70%)' }} />

      <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
        {/* Badge */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 text-xs font-semibold uppercase tracking-widest"
          style={{ background: 'rgba(16,217,160,0.08)', border: '1px solid rgba(16,217,160,0.22)', color: '#10d9a0' }}>
          <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#10d9a0' }} />
          Collective Intelligence Network for Farmers
        </motion.div>

        {/* Headline */}
        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
          className="hero-title font-black leading-tight mb-6"
          style={{ fontSize: 'clamp(2.8rem, 6vw, 5rem)', letterSpacing: '-0.03em', fontFamily: 'Syne, sans-serif' }}>
          <span className="text-white">When One Farmer</span>
          <br />
          <span className="gradient-text">Learns, Every</span>
          <br />
          <span className="text-white">Farmer Benefits</span>
        </motion.h1>

        {/* Subtext */}
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg max-w-2xl mx-auto mb-10 leading-relaxed"
          style={{ color: '#5a8fa8' }}>
          AgriMind is a living intelligence network where AI detects pest outbreaks, predicts crop futures through Digital Twin simulation, and preserves the wisdom of experienced farmers — in your language.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-4 mb-16">
          <button onClick={onReport}
            className="flex items-center gap-2 px-8 py-4 rounded-full font-bold text-base text-black transition-all hover:-translate-y-0.5"
            style={{ background: 'linear-gradient(120deg,#10d9a0,#06b6d4)', boxShadow: '0 0 28px rgba(16,217,160,0.35)' }}>
            Report an Outbreak <ArrowRight size={18} />
          </button>
          <button onClick={() => scroll('twin')}
            className="flex items-center gap-2 px-8 py-4 rounded-full font-bold text-base transition-all hover:-translate-y-0.5"
            style={{ border: '1px solid rgba(16,217,160,0.3)', color: '#10d9a0', background: 'rgba(16,217,160,0.06)' }}>
            Simulate My Farm <Zap size={18} />
          </button>
        </motion.div>

        {/* Stats row */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mb-16">
          {[
            { icon: Users, val: '1,240+', label: 'Farmers Protected' },
            { icon: Shield, val: '94%', label: 'Outbreak Prevention' },
            { icon: Zap, val: '< 5 min', label: 'Alert Speed' },
            { icon: Leaf, val: '8 Crops', label: 'Monitored' },
          ].map(({ icon: Icon, val, label }) => (
            <div key={label} className="glass rounded-2xl py-4 px-5 text-center card-hover">
              <Icon size={18} className="mx-auto mb-2" style={{ color: '#10d9a0' }} />
              <p className="text-white font-bold text-xl">{val}</p>
              <p className="text-xs mt-0.5" style={{ color: '#3d6475' }}>{label}</p>
            </div>
          ))}
        </motion.div>

        {/* Farmer story teaser */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.5 }}
          className="glass rounded-3xl p-6 max-w-xl mx-auto text-left mb-8"
          style={{ border: '1px solid rgba(16,217,160,0.15)' }}>
          <div className="flex items-start gap-3 mb-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-sm font-bold"
              style={{ background: 'rgba(16,217,160,0.15)', color: '#10d9a0' }}>R</div>
            <div>
              <p className="text-white font-semibold text-sm">Ramesh Kumar · Maize Farmer · Guntur</p>
              <div className="flex items-center gap-1 mt-0.5">
                <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#10d9a0' }} />
                <span className="text-xs" style={{ color: '#10d9a0' }}>Just now</span>
              </div>
            </div>
          </div>
          <p className="text-sm leading-relaxed" style={{ color: '#5a8fa8' }}>
            "Strange marks on my maize leaves at 5:30 AM. AgriMind identified it as <span className="text-white font-medium">Fall Armyworm</span> and immediately alerted 4 nearby farmers. Kumar's farm was saved before the outbreak spread."
          </p>
          <div className="flex items-center gap-2 mt-3">
            <span className="text-xs px-2.5 py-1 rounded-full risk-high font-semibold">HIGH RISK</span>
            <span className="text-xs px-2.5 py-1 rounded-full risk-low font-semibold">4 Farmers Notified</span>
          </div>
        </motion.div>

        {/* Scroll hint */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
          className="flex flex-col items-center gap-2 cursor-pointer" onClick={() => scroll('story')}>
          <p className="text-xs uppercase tracking-widest" style={{ color: '#3d6475' }}>The Story</p>
          <div className="w-5 h-8 rounded-full flex items-start justify-center pt-1.5"
            style={{ border: '1px solid rgba(16,217,160,0.2)' }}>
            <motion.div className="w-1 h-2 rounded-full" style={{ background: '#10d9a0' }}
              animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.5 }} />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
