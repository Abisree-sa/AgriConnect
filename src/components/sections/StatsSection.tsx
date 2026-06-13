'use client'
import { motion } from 'framer-motion'
import { Users, AlertTriangle, TrendingUp, MessageCircle, Shield, MapPin } from 'lucide-react'

const stats = [
  { icon: Users,         val: '1,240+',  label: 'Farmers Protected',  sub: 'Across 6 states',        color: '#10d9a0' },
  { icon: AlertTriangle, val: '847',     label: 'Outbreaks Detected', sub: 'Early warnings sent',     color: '#f43f5e' },
  { icon: Shield,        val: '94%',     label: 'Prevention Rate',    sub: 'Farms saved from loss',   color: '#10d9a0' },
  { icon: TrendingUp,    val: '₹2.4Cr',  label: 'Crop Value Saved',   sub: 'Estimated savings',       color: '#f5a623' },
  { icon: MessageCircle, val: '12,500+', label: 'AI Conversations',   sub: 'Questions answered',      color: '#06b6d4' },
  { icon: MapPin,        val: '340+',    label: 'Villages Covered',   sub: 'Growing every day',       color: '#818cf8' },
]

export default function StatsSection() {
  return (
    <section className="py-20 relative"
      style={{ background: 'linear-gradient(180deg, transparent, rgba(16,217,160,0.02), transparent)' }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="section-divider mb-16" />

        <div className="text-center mb-12">
          <h2 className="text-white font-black text-3xl mb-3" style={{ letterSpacing: '-0.02em', fontFamily: 'Syne, sans-serif' }}>
            The Numbers Behind <span className="gradient-text">Collective Intelligence</span>
          </h2>
          <p className="text-sm" style={{ color: '#3d6475' }}>Real impact. Real farmers. Real outcomes.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {stats.map(({ icon: Icon, val, label, sub, color }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              className="stat-card text-center"
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3"
                style={{ background: `${color}15` }}>
                <Icon size={18} style={{ color }} />
              </div>
              <p className="text-white font-black text-2xl mb-1" style={{ letterSpacing: '-0.02em' }}>{val}</p>
              <p className="text-white text-xs font-semibold mb-0.5">{label}</p>
              <p className="text-[11px]" style={{ color: '#3d6475' }}>{sub}</p>
            </motion.div>
          ))}
        </div>

        <div className="section-divider mt-16" />
      </div>
    </section>
  )
}
