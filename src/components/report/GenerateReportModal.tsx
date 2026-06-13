'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, FileText, Download, Printer, CheckCircle, AlertTriangle, Shield, TrendingUp, MapPin, Clock } from 'lucide-react'

const RISK_COLOR: Record<string, string> = { HIGH: '#ef4444', MEDIUM: '#f59e0b', LOW: '#22c55e' }

function timeAgo(d: string) {
  const diff = Date.now() - new Date(d).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

interface Props {
  open: boolean
  onClose: () => void
  reports: any[]
  farmer: any
}

export function GenerateReportModal({ open, onClose, reports, farmer }: Props) {
  const [generating, setGenerating] = useState(false)
  const [generated, setGenerated] = useState(false)

  const activeReports = reports.filter(r => r.status === 'ACTIVE')
  const highRisk = reports.filter(r => r.riskLevel === 'HIGH')
  const resolvedReports = reports.filter(r => r.status === 'RESOLVED')
  const generatedAt = new Date().toLocaleString('en-IN', { dateStyle: 'long', timeStyle: 'short' })

  const handleGenerate = () => {
    setGenerating(true)
    setTimeout(() => { setGenerating(false); setGenerated(true) }, 1200)
  }

  const handlePrint = () => {
    const printContent = document.getElementById('agrimind-report')
    if (!printContent) return
    const win = window.open('', '_blank')
    if (!win) return
    win.document.write(`
      <html>
        <head>
          <title>AgriMind Farm Report — ${farmer?.name}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Segoe UI', sans-serif; background: #fff; color: #1a1a1a; padding: 40px; }
            .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #22c55e; padding-bottom: 20px; margin-bottom: 28px; }
            .brand { font-size: 1.8rem; font-weight: 900; color: #16a34a; }
            .brand span { color: #1a1a1a; }
            .meta { font-size: 0.75rem; color: #6b7280; text-align: right; }
            .section-title { font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #6b7280; margin-bottom: 10px; }
            .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 28px; }
            .stat-box { border: 1px solid #e5e7eb; border-radius: 10px; padding: 14px; text-align: center; }
            .stat-val { font-size: 1.6rem; font-weight: 900; }
            .stat-label { font-size: 0.7rem; color: #6b7280; margin-top: 2px; }
            .farmer-box { border: 1px solid #dcfce7; background: #f0fdf4; border-radius: 10px; padding: 16px; margin-bottom: 28px; display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
            .farmer-row { font-size: 0.8rem; color: #374151; }
            .farmer-row span { font-weight: 600; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 28px; }
            th { background: #f0fdf4; font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; padding: 8px 10px; text-align: left; border-bottom: 2px solid #dcfce7; }
            td { font-size: 0.78rem; padding: 8px 10px; border-bottom: 1px solid #f3f4f6; }
            tr:last-child td { border-bottom: none; }
            .badge { display: inline-block; font-size: 0.65rem; font-weight: 700; padding: 2px 8px; border-radius: 999px; }
            .high { background: #fee2e2; color: #dc2626; }
            .medium { background: #fef3c7; color: #d97706; }
            .low { background: #dcfce7; color: #16a34a; }
            .active { background: #fee2e2; color: #dc2626; }
            .resolved { background: #dcfce7; color: #16a34a; }
            .footer { text-align: center; font-size: 0.7rem; color: #9ca3af; border-top: 1px solid #e5e7eb; padding-top: 16px; margin-top: 20px; }
            .summary-box { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 10px; padding: 14px; margin-bottom: 28px; font-size: 0.82rem; line-height: 1.6; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="brand">Agri<span>Mind</span></div>
              <div style="font-size:0.8rem;color:#6b7280;margin-top:4px;">Collective Intelligence Network for Farmers</div>
            </div>
            <div class="meta">
              <div style="font-weight:700;font-size:0.9rem;color:#1a1a1a;">Farm Outbreak Report</div>
              <div>Generated: ${generatedAt}</div>
              <div>Farmer: ${farmer?.name}</div>
            </div>
          </div>

          <div class="section-title">Farmer Profile</div>
          <div class="farmer-box">
            <div class="farmer-row"><span>Name:</span> ${farmer?.name}</div>
            <div class="farmer-row"><span>Location:</span> ${farmer?.village}, ${farmer?.district}</div>
            <div class="farmer-row"><span>State:</span> ${farmer?.state}</div>
            <div class="farmer-row"><span>Farm Size:</span> ${farmer?.farmSize} acres</div>
            <div class="farmer-row"><span>Crops:</span> ${farmer?.cropTypes?.join(', ')}</div>
            <div class="farmer-row"><span>Phone:</span> +91 ${farmer?.phone}</div>
          </div>

          <div class="section-title">Summary Statistics</div>
          <div class="stats-grid">
            <div class="stat-box"><div class="stat-val" style="color:#1a1a1a">${reports.length}</div><div class="stat-label">Total Reports</div></div>
            <div class="stat-box"><div class="stat-val" style="color:#dc2626">${activeReports.length}</div><div class="stat-label">Active Outbreaks</div></div>
            <div class="stat-box"><div class="stat-val" style="color:#dc2626">${highRisk.length}</div><div class="stat-label">High Risk</div></div>
            <div class="stat-box"><div class="stat-val" style="color:#16a34a">${resolvedReports.length}</div><div class="stat-label">Resolved</div></div>
          </div>

          <div class="section-title">AI Recommendation Summary</div>
          <div class="summary-box">
            ${highRisk.length > 0
              ? `⚠️ <strong>${highRisk.length} HIGH risk outbreaks</strong> are currently active in the network. Immediate attention is required for: ${highRisk.map(r => `${r.pestName} in ${r.cropType}`).join(', ')}. Apply recommended treatments at earliest. Monitor daily.`
              : `✅ No HIGH risk outbreaks detected currently. Network is in good health. Continue regular monitoring and preventive spraying.`
            }
            ${farmer?.cropTypes ? ` Farmer's crops (${farmer.cropTypes.join(', ')}) should be checked for any signs of infestation matching active reports.` : ''}
          </div>

          <div class="section-title">All Outbreak Reports (${reports.length})</div>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Crop</th>
                <th>Pest / Disease</th>
                <th>Risk</th>
                <th>Status</th>
                <th>Reporter</th>
                <th>Location</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              ${reports.map((r, i) => `
                <tr>
                  <td style="color:#9ca3af">${i + 1}</td>
                  <td style="font-weight:600">${r.cropType}</td>
                  <td>${r.pestName}</td>
                  <td><span class="badge ${r.riskLevel.toLowerCase()}">${r.riskLevel}</span></td>
                  <td><span class="badge ${r.status.toLowerCase()}">${r.status}</span></td>
                  <td>${r.user?.name ?? '—'}</td>
                  <td>${r.user?.village ?? '—'}, ${r.user?.district ?? '—'}</td>
                  <td style="color:#9ca3af">${timeAgo(r.createdAt)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="footer">
            AgriMind — Collective Intelligence Network · Report generated on ${generatedAt} · Confidential farm data
          </div>
        </body>
      </html>
    `)
    win.document.close()
    win.print()
  }

  const handleClose = () => {
    onClose()
    setTimeout(() => setGenerated(false), 300)
  }

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={handleClose} />

          <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl glass-bright rounded-3xl overflow-hidden shadow-2xl"
            style={{ maxHeight: '90vh', overflowY: 'auto' }}>

            <div className="p-7">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(34,197,94,0.15)' }}>
                    <FileText size={18} className="text-green-400" />
                  </div>
                  <div>
                    <h2 className="text-white font-black text-xl">Generate Farm Report</h2>
                    <p className="text-xs mt-0.5" style={{ color: '#4a7c5f' }}>Compile all outbreak data into a printable report</p>
                  </div>
                </div>
                <button onClick={handleClose} className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-white/10 transition-all"
                  style={{ border: '1px solid rgba(34,197,94,0.15)' }}>
                  <X size={16} style={{ color: '#4a7c5f' }} />
                </button>
              </div>

              {/* Stats preview */}
              <div className="grid grid-cols-4 gap-3 mb-6">
                {[
                  { icon: FileText, label: 'Total Reports', val: reports.length, color: '#22c55e' },
                  { icon: AlertTriangle, label: 'Active', val: activeReports.length, color: '#ef4444' },
                  { icon: Shield, label: 'High Risk', val: highRisk.length, color: '#f59e0b' },
                  { icon: CheckCircle, label: 'Resolved', val: resolvedReports.length, color: '#22c55e' },
                ].map(({ icon: Icon, label, val, color }) => (
                  <div key={label} className="glass rounded-2xl p-3 text-center" style={{ border: '1px solid rgba(34,197,94,0.1)' }}>
                    <Icon size={14} className="mx-auto mb-1" style={{ color }} />
                    <p className="text-white font-black text-lg" style={{ color }}>{val}</p>
                    <p className="text-[10px]" style={{ color: '#4a7c5f' }}>{label}</p>
                  </div>
                ))}
              </div>

              {/* Report preview */}
              <div id="agrimind-report" className="rounded-2xl mb-6 overflow-hidden" style={{ border: '1px solid rgba(34,197,94,0.15)' }}>
                {/* Report header */}
                <div className="px-5 py-4 flex items-center justify-between" style={{ background: 'rgba(34,197,94,0.08)', borderBottom: '1px solid rgba(34,197,94,0.12)' }}>
                  <div>
                    <p className="text-white font-black text-base">Agri<span className="text-green-400">Mind</span> Farm Report</p>
                    <p className="text-[11px] mt-0.5" style={{ color: '#4a7c5f' }}>Generated: {generatedAt}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white text-xs font-semibold">{farmer?.name}</p>
                    <p className="text-[11px]" style={{ color: '#4a7c5f' }}>{farmer?.village}, {farmer?.district}</p>
                  </div>
                </div>

                {/* Farmer info row */}
                <div className="px-5 py-3 grid grid-cols-3 gap-3" style={{ borderBottom: '1px solid rgba(34,197,94,0.08)', background: 'rgba(0,0,0,0.2)' }}>
                  {[
                    [`${farmer?.farmSize} acres`, 'Farm Size'],
                    [farmer?.state, 'State'],
                    [farmer?.cropTypes?.join(', '), 'Crops'],
                  ].map(([val, label]) => (
                    <div key={label}>
                      <p className="text-white text-xs font-semibold">{val}</p>
                      <p className="text-[10px]" style={{ color: '#4a7c5f' }}>{label}</p>
                    </div>
                  ))}
                </div>

                {/* AI summary */}
                <div className="px-5 py-3" style={{ borderBottom: '1px solid rgba(34,197,94,0.08)', background: 'rgba(245,158,11,0.04)' }}>
                  <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: '#f59e0b' }}>AI Recommendation</p>
                  <p className="text-xs leading-relaxed" style={{ color: '#a0b8a8' }}>
                    {highRisk.length > 0
                      ? `⚠️ ${highRisk.length} HIGH risk outbreaks active. Immediate action needed for: ${highRisk.map(r => r.pestName).join(', ')}. Apply treatments early and monitor daily.`
                      : '✅ No HIGH risk outbreaks detected. Network is healthy. Continue preventive monitoring.'}
                  </p>
                </div>

                {/* Reports table */}
                <div className="px-5 py-3">
                  <p className="text-[10px] font-bold uppercase tracking-wider mb-3" style={{ color: '#4a7c5f' }}>Outbreak Reports ({reports.length})</p>
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {reports.map((r, i) => (
                      <div key={r.id} className="flex items-center justify-between rounded-xl px-3 py-2" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(34,197,94,0.06)' }}>
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <span className="text-[10px] font-bold w-5 shrink-0" style={{ color: '#4a7c5f' }}>{i + 1}</span>
                          <div className="min-w-0">
                            <p className="text-white text-[11px] font-semibold truncate">{r.cropType} · {r.pestName}</p>
                            <div className="flex items-center gap-1">
                              <MapPin size={8} style={{ color: '#4a7c5f' }} />
                              <span className="text-[10px] truncate" style={{ color: '#4a7c5f' }}>{r.user?.village}, {r.user?.district}</span>
                              <span style={{ color: '#2a4a35' }}>·</span>
                              <Clock size={8} style={{ color: '#4a7c5f' }} />
                              <span className="text-[10px]" style={{ color: '#4a7c5f' }}>{timeAgo(r.createdAt)}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0 ml-2">
                          <span className="text-[9px] font-bold px-2 py-0.5 rounded-full" style={{ color: RISK_COLOR[r.riskLevel], background: `${RISK_COLOR[r.riskLevel]}15` }}>{r.riskLevel}</span>
                          <span className="text-[9px] font-bold px-2 py-0.5 rounded-full"
                            style={r.status === 'ACTIVE' ? { color: '#ef4444', background: 'rgba(239,68,68,0.1)' } : { color: '#22c55e', background: 'rgba(34,197,94,0.1)' }}>
                            {r.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="px-5 py-3 text-center" style={{ borderTop: '1px solid rgba(34,197,94,0.08)', background: 'rgba(0,0,0,0.15)' }}>
                  <p className="text-[10px]" style={{ color: '#2a4a35' }}>AgriMind · Collective Intelligence Network · Confidential</p>
                </div>
              </div>

              {/* Action buttons */}
              {!generated ? (
                <button onClick={handleGenerate} disabled={generating}
                  className="w-full py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 disabled:opacity-60"
                  style={{ background: 'linear-gradient(120deg,#22c55e,#4ade80)', color: '#000' }}>
                  {generating ? (
                    <><span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" /> Generating Report...</>
                  ) : (
                    <><FileText size={16} /> Generate Full Report</>
                  )}
                </button>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 rounded-xl px-4 py-3" style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.25)' }}>
                    <CheckCircle size={16} className="text-green-400" />
                    <p className="text-green-400 text-sm font-semibold">Report generated successfully!</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <button onClick={handlePrint}
                      className="py-3 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5"
                      style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', color: '#22c55e' }}>
                      <Printer size={15} /> Print / Save PDF
                    </button>
                    <button onClick={handleClose}
                      className="py-3 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5"
                      style={{ background: '#22c55e', color: '#000' }}>
                      <Download size={15} /> Done
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
