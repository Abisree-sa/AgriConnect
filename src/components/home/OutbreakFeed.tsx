'use client'
import { motion } from 'framer-motion'
import { MapPin, Clock, AlertTriangle, CheckCircle, Image } from 'lucide-react'
import { cn, timeAgo, RISK_COLORS } from '@/lib/utils'

interface Report {
  id: string
  cropType: string
  pestName: string
  description: string
  riskLevel: string
  status: string
  latitude: number
  longitude: number
  imageUrl?: string
  createdAt: string
  user: { name: string; village?: string; district?: string }
}

interface Props {
  reports: Report[]
  loading: boolean
}

export function OutbreakFeed({ reports, loading }: Props) {
  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map(i => (
          <div key={i} className="glass rounded-2xl p-4 animate-pulse">
            <div className="h-4 bg-white/5 rounded w-1/3 mb-3" />
            <div className="h-3 bg-white/5 rounded w-full mb-2" />
            <div className="h-3 bg-white/5 rounded w-2/3" />
          </div>
        ))}
      </div>
    )
  }

  if (!reports.length) {
    return (
      <div className="glass rounded-2xl p-8 text-center">
        <CheckCircle size={32} className="text-primary mx-auto mb-3" />
        <p className="text-white font-medium">No active outbreaks nearby</p>
        <p className="text-muted text-sm mt-1">Your area is currently safe 🌿</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {reports.map((report, i) => (
        <motion.div
          key={report.id}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className="glass rounded-2xl p-4 hover:border-primary/30 transition-all"
        >
          <div className="flex items-start justify-between mb-2">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-primary text-xs font-bold">
                    {report.user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-white text-sm font-semibold">{report.user.name}</span>
              </div>
              <div className="flex items-center gap-1 mt-1 ml-9">
                <Clock size={10} className="text-muted" />
                <span className="text-muted text-[11px]">{timeAgo(new Date(report.createdAt))}</span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded-full border', RISK_COLORS[report.riskLevel])}>
                {report.riskLevel} RISK
              </span>
              {report.status === 'ACTIVE' && (
                <div className="flex items-center gap-1">
                  <AlertTriangle size={9} className="text-danger" />
                  <span className="text-[10px] text-danger font-medium">ACTIVE</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full border border-primary/20 font-medium">
              {report.cropType}
            </span>
            <span className="text-white text-xs font-semibold">• {report.pestName}</span>
          </div>

          <p className="text-muted text-xs leading-relaxed mb-2">{report.description}</p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <MapPin size={10} className="text-muted" />
              <span className="text-muted text-[11px]">
                {report.user.village || report.user.district || 'Unknown location'}
              </span>
            </div>
            {report.imageUrl && (
              <div className="w-12 h-12 rounded-lg overflow-hidden border border-[#1a3328]">
                <img src={report.imageUrl} alt="crop" className="w-full h-full object-cover" />
              </div>
            )}
            {!report.imageUrl && (
              <div className="w-12 h-12 rounded-lg bg-card border border-[#1a3328] flex items-center justify-center">
                <Image size={14} className="text-muted" />
              </div>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  )
}
