'use client'
import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Camera, Loader2, CheckCircle, MapPin, AlertTriangle, FileText, Printer } from 'lucide-react'
import axios from 'axios'

const CROP_OPTIONS = ['Maize', 'Cotton', 'Rice', 'Wheat', 'Tomato', 'Sugarcane', 'Groundnut', 'Turmeric']
const RISK_LEVELS = ['LOW', 'MEDIUM', 'HIGH']
const RISK_COLOR: Record<string, string> = { LOW: '#22c55e', MEDIUM: '#f59e0b', HIGH: '#ef4444' }

interface Props { open: boolean; onClose: () => void; onSuccess: (n: number) => void }

export function ReportModal({ open, onClose, onSuccess }: Props) {
  const [form, setForm] = useState({ cropType: '', pestName: '', description: '', riskLevel: 'MEDIUM' })
  const [analyzing, setAnalyzing] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [aiResult, setAiResult] = useState<any>(null)
  const [preview, setPreview] = useState('')
  const [loc, setLoc] = useState<{ lat: number; lng: number } | null>(null)
  const [success, setSuccess] = useState(false)
  const [notifiedCount, setNotifiedCount] = useState(0)
  const fileRef = useRef<HTMLInputElement>(null)

  const getLocation = () => {
    navigator.geolocation?.getCurrentPosition(p => setLoc({ lat: p.coords.latitude, lng: p.coords.longitude }))
  }

  const handleImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = async (ev) => {
      const dataUrl = ev.target?.result as string
      setPreview(dataUrl)
      setAnalyzing(true)
      try {
        const { data } = await axios.post('/api/image-analysis', {
          base64Image: dataUrl.split(',')[1],
          filename: file.name,
        })
        setAiResult(data)
        setForm(f => ({ ...f, cropType: data.crop || f.cropType, pestName: data.disease || f.pestName, riskLevel: (data.risk || 'MEDIUM').toUpperCase() }))
      } catch {}
      setAnalyzing(false)
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = async () => {
    if (!form.cropType || !form.pestName || !form.description) return
    setSubmitting(true)
    try {
      const lat = loc?.lat ?? 17.385 + (Math.random() - 0.5) * 0.1
      const lng = loc?.lng ?? 78.486 + (Math.random() - 0.5) * 0.1
      const { data } = await axios.post('/api/reports', { ...form, latitude: lat, longitude: lng, imageUrl: preview || '' })
      setNotifiedCount(data.farmersNotified ?? 4)
      setSuccess(true)
    } catch {}
    setSubmitting(false)
  }

  const handleClose = () => {
    onClose()
    setTimeout(() => {
      setSuccess(false); setForm({ cropType: '', pestName: '', description: '', riskLevel: 'MEDIUM' })
      setPreview(''); setAiResult(null); setLoc(null)
    }, 300)
  }

  const handleSuccessClose = () => { onSuccess(notifiedCount); handleClose() }

  const handleDownloadPDF = () => {
    const generatedAt = new Date().toLocaleString('en-IN', { dateStyle: 'long', timeStyle: 'short' })
    const win = window.open('', '_blank')
    if (!win) return
    win.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>AgriMind Analysis Report</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Segoe UI', sans-serif; background: #fff; color: #111; padding: 48px; }
            .header { display: flex; justify-content: space-between; align-items: flex-start; padding-bottom: 20px; margin-bottom: 28px; border-bottom: 3px solid #22c55e; }
            .brand { font-size: 2rem; font-weight: 900; color: #16a34a; letter-spacing: -0.03em; }
            .brand span { color: #111; }
            .tag { display: inline-block; font-size: 0.65rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; background: #dcfce7; color: #16a34a; padding: 3px 10px; border-radius: 999px; margin-top: 6px; }
            .meta { text-align: right; font-size: 0.78rem; color: #6b7280; line-height: 1.7; }
            .meta strong { color: #111; font-size: 0.9rem; }
            .section { margin-bottom: 28px; }
            .section-title { font-size: 0.65rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.12em; color: #9ca3af; margin-bottom: 12px; padding-bottom: 6px; border-bottom: 1px solid #f3f4f6; }
            .card { border: 1px solid #e5e7eb; border-radius: 12px; padding: 18px; }
            .ai-card { background: #f0fdf4; border-color: #bbf7d0; }
            .grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
            .grid3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; }
            .field label { font-size: 0.65rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #9ca3af; display: block; margin-bottom: 3px; }
            .field p { font-size: 0.88rem; font-weight: 600; color: #111; }
            .badge { display: inline-block; font-size: 0.7rem; font-weight: 700; padding: 3px 12px; border-radius: 999px; }
            .badge-high { background: #fee2e2; color: #dc2626; }
            .badge-medium { background: #fef3c7; color: #d97706; }
            .badge-low { background: #dcfce7; color: #16a34a; }
            .treatment-box { background: #f8fafc; border: 1px solid #e2e8f0; border-left: 4px solid #22c55e; border-radius: 8px; padding: 14px 16px; margin-top: 12px; font-size: 0.85rem; color: #374151; line-height: 1.6; }
            .treatment-box strong { color: #16a34a; }
            .image-box { width: 100%; max-height: 240px; object-fit: cover; border-radius: 10px; border: 1px solid #e5e7eb; display: block; margin-top: 8px; }
            .notified { display: flex; align-items: center; gap: 10px; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 10px; padding: 14px 16px; }
            .notified .num { font-size: 2rem; font-weight: 900; color: #16a34a; }
            .notified .txt { font-size: 0.82rem; color: #374151; line-height: 1.5; }
            .footer { text-align: center; font-size: 0.7rem; color: #9ca3af; border-top: 1px solid #e5e7eb; padding-top: 16px; margin-top: 32px; }
            @media print { body { padding: 28px; } }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="brand">Agri<span>Mind</span></div>
              <div class="tag">Outbreak Analysis Report</div>
            </div>
            <div class="meta">
              <strong>Report Generated</strong><br/>
              ${generatedAt}<br/>
              Report ID: RPT-${Date.now().toString().slice(-8)}
            </div>
          </div>

          ${aiResult ? `
          <div class="section">
            <div class="section-title">AI Analysis Result</div>
            <div class="card ai-card">
              <div class="grid3" style="margin-bottom:14px">
                <div class="field"><label>Detected Disease</label><p>${aiResult.disease ?? form.pestName}</p></div>
                <div class="field"><label>Confidence</label><p>${aiResult.confidence ?? '—'}%</p></div>
                <div class="field"><label>Risk Level</label><p><span class="badge badge-${(aiResult.risk ?? form.riskLevel).toLowerCase()}">${(aiResult.risk ?? form.riskLevel).toUpperCase()}</span></p></div>
              </div>
              <div class="treatment-box">
                <strong>Recommended Treatment:</strong> ${aiResult.treatment ?? 'Follow standard pest management protocols for your crop.'}
              </div>
            </div>
          </div>
          ` : ''}

          <div class="section">
            <div class="section-title">Report Details</div>
            <div class="card">
              <div class="grid2" style="margin-bottom:14px">
                <div class="field"><label>Crop Type</label><p>${form.cropType}</p></div>
                <div class="field"><label>Pest / Disease</label><p>${form.pestName}</p></div>
              </div>
              <div class="grid2" style="margin-bottom:14px">
                <div class="field"><label>Risk Level</label><p><span class="badge badge-${form.riskLevel.toLowerCase()}">${form.riskLevel}</span></p></div>
                <div class="field"><label>GPS Location</label><p>${loc ? loc.lat.toFixed(5) + ', ' + loc.lng.toFixed(5) : 'Not captured'}</p></div>
              </div>
              <div class="field"><label>Description</label><p style="font-weight:400;color:#374151;line-height:1.6;font-size:0.85rem;margin-top:4px">${form.description}</p></div>
            </div>
          </div>

          ${preview ? `
          <div class="section">
            <div class="section-title">Crop Photo</div>
            <img src="${preview}" class="image-box" alt="Crop photo" />
          </div>
          ` : ''}

          <div class="section">
            <div class="section-title">Network Impact</div>
            <div class="notified">
              <div class="num">${notifiedCount}</div>
              <div class="txt">Nearby farmers have been <strong>automatically alerted</strong> about this outbreak.<br/>Your report is now part of the AgriMind collective intelligence network.</div>
            </div>
          </div>

          <div class="footer">
            AgriMind — Collective Intelligence Network for Indian Farmers &nbsp;·&nbsp; This report is auto-generated and should be used as a supplementary guide. Always consult a local agronomist for critical decisions.
          </div>
        </body>
      </html>
    `)
    win.document.close()
    win.print()
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

            {/* Success State */}
            {success ? (
              <div className="p-10 text-center">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300 }}
                  className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
                  style={{ background: 'rgba(34,197,94,0.15)', border: '2px solid rgba(34,197,94,0.4)' }}>
                  <CheckCircle size={36} className="text-green-400" />
                </motion.div>
                <h3 className="text-white font-black text-2xl mb-2">Report Submitted!</h3>
                <p className="mb-1" style={{ color: '#6b9e7f' }}>Your outbreak report has been sent to the network.</p>
                <p className="text-lg font-bold text-green-400 mb-2">{notifiedCount} nearby farmers have been notified 🌿</p>
                <p className="text-sm mb-8" style={{ color: '#4a7c5f' }}>Together we prevent outbreaks. Your report may have just saved someone's harvest.</p>

                {/* PDF Report Section */}
                <div className="rounded-2xl p-5 mb-6 text-left" style={{ background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.2)' }}>
                  <div className="flex items-center gap-2 mb-3">
                    <FileText size={16} className="text-green-400" />
                    <p className="text-white font-bold text-sm">Your Analysis Report is Ready</p>
                  </div>
                  <div className="space-y-2 mb-4">
                    {[
                      ['Crop', form.cropType],
                      ['Pest / Disease', form.pestName],
                      ['Risk Level', form.riskLevel],
                      ...(aiResult ? [['AI Confidence', `${aiResult.confidence}%`], ['Treatment', aiResult.treatment]] : []),
                      ...(loc ? [['GPS', `${loc.lat.toFixed(4)}, ${loc.lng.toFixed(4)}`]] : []),
                    ].map(([k, v]) => (
                      <div key={k} className="flex justify-between text-xs">
                        <span style={{ color: '#4a7c5f' }}>{k}</span>
                        <span className="text-white font-medium text-right max-w-[60%] truncate">{v}</span>
                      </div>
                    ))}
                  </div>
                  <button onClick={handleDownloadPDF}
                    className="w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5"
                    style={{ background: 'linear-gradient(120deg,#22c55e,#4ade80)', color: '#000' }}>
                    <Printer size={15} /> Download PDF Report
                  </button>
                </div>

                <button onClick={handleSuccessClose} className="w-full px-8 py-3 rounded-full font-bold text-sm transition-all"
                  style={{ border: '1px solid rgba(34,197,94,0.2)', color: '#4a7c5f' }}>
                  Back to Dashboard
                </button>
              </div>
            ) : (
              <div className="p-7">
                {/* Header */}
                <div className="flex items-center justify-between mb-7">
                  <div>
                    <h2 className="text-white font-black text-2xl">Report an Outbreak</h2>
                    <p className="text-sm mt-1" style={{ color: '#4a7c5f' }}>Help protect nearby farmers by sharing what you see</p>
                  </div>
                  <button onClick={handleClose} className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:bg-white/10"
                    style={{ border: '1px solid rgba(34,197,94,0.15)' }}>
                    <X size={16} style={{ color: '#4a7c5f' }} />
                  </button>
                </div>

                {/* Image Upload */}
                <div className="rounded-2xl border-2 border-dashed p-5 text-center mb-5 cursor-pointer transition-all hover:border-green-400/40"
                  style={{ borderColor: preview ? 'rgba(34,197,94,0.4)' : 'rgba(34,197,94,0.15)', background: 'rgba(34,197,94,0.03)' }}
                  onClick={() => fileRef.current?.click()}>
                  <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImage} />
                  {preview ? (
                    <div className="relative">
                      <img src={preview} alt="preview" className="w-full h-44 object-cover rounded-xl" />
                      {analyzing && (
                        <div className="absolute inset-0 bg-black/60 rounded-xl flex items-center justify-center gap-2">
                          <Loader2 size={18} className="text-green-400 animate-spin" />
                          <span className="text-white text-sm font-medium">AI analyzing your crop...</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="py-6">
                      <Camera size={32} style={{ color: '#4a7c5f' }} className="mx-auto mb-3" />
                      <p className="text-white text-sm font-medium">Upload a crop photo</p>
                      <p className="text-xs mt-1" style={{ color: '#4a7c5f' }}>AI will auto-detect the pest or disease</p>
                    </div>
                  )}
                </div>

                {/* AI Result */}
                {aiResult && (
                  <div className="rounded-xl p-4 mb-5 flex items-center gap-3"
                    style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.25)' }}>
                    <CheckCircle size={16} className="text-green-400 shrink-0" />
                    <div>
                      <p className="text-green-400 text-sm font-bold">AI Detected: {aiResult.disease}</p>
                      <p className="text-xs mt-0.5" style={{ color: '#4a7c5f' }}>Confidence: {aiResult.confidence}% · {aiResult.risk} Risk · {aiResult.treatment}</p>
                    </div>
                  </div>
                )}

                {/* Form grid */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="text-xs font-medium block mb-1.5" style={{ color: '#6b9e7f' }}>Crop Type *</label>
                    <select className="w-full px-3 py-2.5 text-sm" value={form.cropType} onChange={e => setForm(f => ({ ...f, cropType: e.target.value }))}>
                      <option value="">Select crop...</option>
                      {CROP_OPTIONS.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium block mb-1.5" style={{ color: '#6b9e7f' }}>Pest / Disease Name *</label>
                    <input className="w-full px-3 py-2.5 text-sm" placeholder="e.g. Fall Armyworm..."
                      value={form.pestName} onChange={e => setForm(f => ({ ...f, pestName: e.target.value }))} />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="text-xs font-medium block mb-1.5" style={{ color: '#6b9e7f' }}>Description *</label>
                  <textarea className="w-full px-3 py-2.5 text-sm resize-none" rows={3}
                    placeholder="Describe what you see — marks, holes, colour changes, spread area..."
                    value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
                </div>

                {/* Risk Level */}
                <div className="mb-5">
                  <label className="text-xs font-medium block mb-2" style={{ color: '#6b9e7f' }}>Risk Level</label>
                  <div className="grid grid-cols-3 gap-2">
                    {RISK_LEVELS.map(r => (
                      <button key={r} onClick={() => setForm(f => ({ ...f, riskLevel: r }))}
                        className="py-2.5 rounded-xl text-xs font-bold border transition-all"
                        style={form.riskLevel === r
                          ? { color: RISK_COLOR[r], background: `${RISK_COLOR[r]}18`, border: `1px solid ${RISK_COLOR[r]}50` }
                          : { color: '#4a7c5f', background: 'rgba(34,197,94,0.03)', border: '1px solid rgba(34,197,94,0.12)' }}>
                        {r}
                      </button>
                    ))}
                  </div>
                </div>

                {/* GPS */}
                <button onClick={getLocation}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm mb-5 transition-all"
                  style={loc
                    ? { border: '1px solid rgba(34,197,94,0.4)', color: '#22c55e', background: 'rgba(34,197,94,0.08)' }
                    : { border: '1px solid rgba(34,197,94,0.15)', color: '#4a7c5f', background: 'transparent' }}>
                  <MapPin size={14} />
                  {loc ? `📍 ${loc.lat.toFixed(4)}, ${loc.lng.toFixed(4)}` : 'Capture GPS Location (Optional)'}
                </button>

                {/* Submit */}
                <button onClick={handleSubmit} disabled={submitting || !form.cropType || !form.pestName || !form.description}
                  className="w-full py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-2 transition-all disabled:opacity-50 hover:-translate-y-0.5"
                  style={{ background: '#22c55e', color: '#000' }}>
                  {submitting
                    ? <><Loader2 size={16} className="animate-spin" /> Submitting & Alerting Farmers...</>
                    : <><AlertTriangle size={16} /> Submit Report & Alert Nearby Farmers</>}
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
