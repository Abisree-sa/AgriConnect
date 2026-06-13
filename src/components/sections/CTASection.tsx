'use client'
import { motion } from 'framer-motion'
import { ArrowRight, Leaf, Shield, Zap } from 'lucide-react'

interface Props { onReport: () => void }

export default function CTASection({ onReport }: Props) {
  const scroll = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 70% 70% at 50% 50%, rgba(16,217,160,0.06) 0%, rgba(6,182,212,0.03) 40%, transparent 70%)' }} />

      <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest mb-6"
            style={{ background: 'rgba(16,217,160,0.08)', border: '1px solid rgba(16,217,160,0.22)', color: '#10d9a0' }}>
            <Leaf size={12} /> Join the Network
          </div>

          <h2 className="font-black text-white mb-6"
            style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', letterSpacing: '-0.03em', lineHeight: 1.1, fontFamily: 'Syne, sans-serif' }}>
            Stop Fighting Problems<br />
            <span className="gradient-text">Alone.</span>
          </h2>

          <p className="text-lg mb-4 max-w-2xl mx-auto" style={{ color: '#5a8fa8' }}>
            AgriMind is not just another agriculture app.<br />
            It is a <strong className="text-white">living intelligence network</strong> where every farmer's experience becomes every farmer's advantage.
          </p>

          <p className="text-base mb-12 italic" style={{ color: '#3d6475' }}>
            "Because the future of farming is not just artificial intelligence — it is collective intelligence."
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
            <button onClick={onReport}
              className="flex items-center gap-2 px-8 py-4 rounded-full font-bold text-base text-black transition-all hover:-translate-y-0.5"
              style={{ background: 'linear-gradient(120deg,#10d9a0,#06b6d4)', boxShadow: '0 0 28px rgba(16,217,160,0.3)' }}>
              Report an Outbreak <ArrowRight size={18} />
            </button>
            <button onClick={() => scroll('twin')}
              className="flex items-center gap-2 px-8 py-4 rounded-full font-bold text-base transition-all hover:-translate-y-0.5"
              style={{ border: '1px solid rgba(16,217,160,0.3)', color: '#10d9a0', background: 'rgba(16,217,160,0.05)' }}>
              <Zap size={18} /> Simulate My Farm
            </button>
            <button onClick={() => scroll('chat')}
              className="flex items-center gap-2 px-8 py-4 rounded-full font-bold text-base transition-all hover:-translate-y-0.5"
              style={{ border: '1px solid rgba(16,217,160,0.15)', color: '#5a8fa8', background: 'rgba(16,217,160,0.03)' }}>
              Ask AI Chat
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6">
            {[
              { icon: Shield, text: '1,240+ farmers protected' },
              { icon: Zap,    text: 'Works without internet (fallback)' },
              { icon: Leaf,   text: '5 Indian languages supported' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2 text-sm" style={{ color: '#3d6475' }}>
                <Icon size={14} style={{ color: '#10d9a0' }} />
                {text}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
