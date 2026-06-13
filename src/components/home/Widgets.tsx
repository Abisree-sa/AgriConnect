'use client'
import { Cloud, TrendingUp, Users, Thermometer } from 'lucide-react'
import { motion } from 'framer-motion'

export function WeatherMarketWidget() {
  return (
    <div className="grid grid-cols-2 gap-3 mb-4">
      {/* Weather */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl p-4 glow-green"
      >
        <div className="flex items-center gap-1.5 mb-2">
          <Cloud size={13} className="text-primary" />
          <span className="text-[11px] text-muted uppercase tracking-wide font-medium">Weather</span>
        </div>
        <div className="flex items-end gap-1">
          <span className="text-3xl font-bold text-white">31°</span>
          <span className="text-sm text-muted mb-1">C</span>
        </div>
        <div className="flex items-center gap-1 mt-1">
          <Thermometer size={11} className="text-accent" />
          <span className="text-xs text-accent">Humid • Partly Cloudy</span>
        </div>
      </motion.div>

      {/* Market */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="glass rounded-2xl p-4"
      >
        <div className="flex items-center gap-1.5 mb-2">
          <TrendingUp size={13} className="text-accent" />
          <span className="text-[11px] text-muted uppercase tracking-wide font-medium">Market</span>
        </div>
        <div className="text-sm font-semibold text-white">Maize</div>
        <div className="text-xl font-bold text-accent mt-0.5">₹2,250</div>
        <div className="text-[11px] text-muted">/ Quintal • ↑ 3.2%</div>
      </motion.div>
    </div>
  )
}

interface NetworkBannerProps {
  notified: number
}

export function NetworkBanner({ notified }: NetworkBannerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.1 }}
      className="rounded-2xl p-4 mb-4 relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0c2d1a 0%, #0f3d22 100%)', border: '1px solid rgba(34,197,94,0.3)' }}
    >
      <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -translate-y-6 translate-x-6" />
      <div className="flex items-center gap-2 mb-2">
        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
        <span className="text-xs text-primary font-semibold uppercase tracking-wider">Collective Network Protected</span>
      </div>
      <p className="text-white text-sm font-medium">
        Your pest report has notified{' '}
        <span className="text-primary font-bold">{notified} nearby farmers</span>.
      </p>
      <p className="text-muted text-xs mt-1">Together we prevent outbreaks. 🌿</p>
      <div className="flex items-center gap-1.5 mt-3">
        <Users size={12} className="text-primary" />
        <span className="text-xs text-muted">1,240 farmers protected in your district</span>
      </div>
    </motion.div>
  )
}
