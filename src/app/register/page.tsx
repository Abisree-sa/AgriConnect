'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Leaf, Eye, EyeOff, Loader2, AlertCircle, CheckCircle, ArrowRight, ArrowLeft, User, MapPin, Sprout } from 'lucide-react'
import { useAuth } from '@/lib/auth'

const CROPS = ['Maize', 'Cotton', 'Rice', 'Wheat', 'Tomato', 'Sugarcane', 'Groundnut', 'Turmeric']
const STATES = ['Andhra Pradesh', 'Telangana', 'Karnataka', 'Tamil Nadu', 'Maharashtra', 'Madhya Pradesh', 'Uttar Pradesh', 'Punjab', 'Rajasthan', 'Gujarat']

const STEPS = [
  { id: 1, label: 'Personal Info', icon: User },
  { id: 2, label: 'Farm Details', icon: MapPin },
  { id: 3, label: 'Crops', icon: Sprout },
]

export default function RegisterPage() {
  const router = useRouter()
  const { register } = useAuth()
  const [step, setStep] = useState(1)
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    name: '', phone: '', email: '', password: '',
    village: '', district: '', state: '',
    cropTypes: [] as string[], farmSize: 5,
  })

  const set = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }))
  const toggleCrop = (c: string) =>
    set('cropTypes', form.cropTypes.includes(c) ? form.cropTypes.filter(x => x !== c) : [...form.cropTypes, c])

  const validateStep = () => {
    if (step === 1) {
      if (!form.name.trim()) return 'Please enter your full name.'
      if (!form.phone.trim() || form.phone.length < 10) return 'Enter a valid 10-digit phone number.'
      if (!form.email.trim() || !form.email.includes('@')) return 'Enter a valid email address.'
      if (form.password.length < 6) return 'Password must be at least 6 characters.'
    }
    if (step === 2) {
      if (!form.village.trim()) return 'Please enter your village name.'
      if (!form.district.trim()) return 'Please enter your district.'
      if (!form.state) return 'Please select your state.'
    }
    if (step === 3) {
      if (!form.cropTypes.length) return 'Please select at least one crop.'
    }
    return ''
  }

  const next = () => {
    const err = validateStep()
    if (err) { setError(err); return }
    setError('')
    if (step < 3) setStep(s => s + 1)
  }

  const handleSubmit = async () => {
    const err = validateStep()
    if (err) { setError(err); return }
    setLoading(true); setError('')
    const res = await register(form)
    if (res.ok) router.push('/dashboard')
    else { setError(res.error || 'Registration failed.'); setLoading(false) }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12" style={{ background: '#050e08' }}>
      <div className="absolute inset-0 grid-pattern opacity-30 pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(34,197,94,0.06) 0%, transparent 70%)' }} />

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-lg relative z-10">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(34,197,94,0.15)' }}>
            <Leaf size={18} className="text-green-400" />
          </div>
          <span className="text-white font-bold text-xl">Agri<span className="text-green-400">Mind</span></span>
        </div>

        <div className="glass rounded-3xl p-8" style={{ border: '1px solid rgba(34,197,94,0.15)' }}>
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-black text-white mb-1" style={{ letterSpacing: '-0.02em' }}>Create Farmer Account</h1>
            <p className="text-sm" style={{ color: '#4a7c5f' }}>Join the collective intelligence network</p>
          </div>

          {/* Step indicators */}
          <div className="flex items-center gap-2 mb-8">
            {STEPS.map((s, i) => {
              const Icon = s.icon
              const done = step > s.id
              const active = step === s.id
              return (
                <div key={s.id} className="flex items-center gap-2 flex-1">
                  <div className="flex items-center gap-1.5">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center transition-all"
                      style={{
                        background: done ? '#22c55e' : active ? 'rgba(34,197,94,0.15)' : 'rgba(34,197,94,0.05)',
                        border: `2px solid ${done || active ? '#22c55e' : 'rgba(34,197,94,0.15)'}`,
                      }}>
                      {done ? <CheckCircle size={14} className="text-black" /> : <Icon size={13} style={{ color: active ? '#22c55e' : '#2a4a35' }} />}
                    </div>
                    <span className="text-xs font-medium hidden sm:block" style={{ color: active ? '#22c55e' : '#2a4a35' }}>{s.label}</span>
                  </div>
                  {i < STEPS.length - 1 && <div className="flex-1 h-px mx-1" style={{ background: step > s.id ? '#22c55e' : 'rgba(34,197,94,0.1)' }} />}
                </div>
              )
            })}
          </div>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                className="flex items-center gap-2 rounded-xl p-3 mb-5 text-sm text-red-400"
                style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
                <AlertCircle size={14} className="shrink-0" />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Step 1 — Personal Info */}
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold block mb-1.5" style={{ color: '#6b9e7f' }}>Full Name *</label>
                  <input placeholder="e.g. Ramesh Kumar" value={form.name} onChange={e => set('name', e.target.value)}
                    className="w-full px-4 py-3 text-sm rounded-xl" />
                </div>
                <div>
                  <label className="text-xs font-semibold block mb-1.5" style={{ color: '#6b9e7f' }}>Phone Number *</label>
                  <input type="tel" placeholder="10-digit mobile number" value={form.phone} onChange={e => set('phone', e.target.value)}
                    className="w-full px-4 py-3 text-sm rounded-xl" maxLength={10} />
                </div>
                <div>
                  <label className="text-xs font-semibold block mb-1.5" style={{ color: '#6b9e7f' }}>Email Address *</label>
                  <input type="email" placeholder="your@email.com" value={form.email} onChange={e => set('email', e.target.value)}
                    className="w-full px-4 py-3 text-sm rounded-xl" />
                </div>
                <div>
                  <label className="text-xs font-semibold block mb-1.5" style={{ color: '#6b9e7f' }}>Password *</label>
                  <div className="relative">
                    <input type={showPass ? 'text' : 'password'} placeholder="Min 6 characters" value={form.password} onChange={e => set('password', e.target.value)}
                      className="w-full px-4 py-3 text-sm rounded-xl pr-11" />
                    <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: '#4a7c5f' }}>
                      {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2 — Farm Location */}
            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold block mb-1.5" style={{ color: '#6b9e7f' }}>Village / Town *</label>
                  <input placeholder="e.g. Rampur" value={form.village} onChange={e => set('village', e.target.value)}
                    className="w-full px-4 py-3 text-sm rounded-xl" />
                </div>
                <div>
                  <label className="text-xs font-semibold block mb-1.5" style={{ color: '#6b9e7f' }}>District *</label>
                  <input placeholder="e.g. Guntur" value={form.district} onChange={e => set('district', e.target.value)}
                    className="w-full px-4 py-3 text-sm rounded-xl" />
                </div>
                <div>
                  <label className="text-xs font-semibold block mb-1.5" style={{ color: '#6b9e7f' }}>State *</label>
                  <select value={form.state} onChange={e => set('state', e.target.value)} className="w-full px-4 py-3 text-sm rounded-xl">
                    <option value="">Select state...</option>
                    {STATES.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold block mb-1.5" style={{ color: '#6b9e7f' }}>
                    Farm Size — <span className="text-green-400 font-bold">{form.farmSize} acres</span>
                  </label>
                  <div className="relative h-2 rounded-full" style={{ background: 'rgba(34,197,94,0.1)' }}>
                    <div className="absolute h-full rounded-full bg-green-400" style={{ width: `${(form.farmSize / 100) * 100}%` }} />
                    <input type="range" min={1} max={100} value={form.farmSize} onChange={e => set('farmSize', Number(e.target.value))}
                      className="absolute inset-0 w-full opacity-0 cursor-pointer h-full" />
                    <div className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white border-2 border-green-400 pointer-events-none"
                      style={{ left: `calc(${(form.farmSize / 100) * 100}% - 8px)` }} />
                  </div>
                  <div className="flex justify-between text-[10px] mt-1" style={{ color: '#2a4a35' }}>
                    <span>1 acre</span><span>100 acres</span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3 — Crop Selection */}
            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <p className="text-sm mb-4" style={{ color: '#6b9e7f' }}>Select crops you grow <span className="text-white">(select all that apply)</span></p>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  {CROPS.map(crop => {
                    const selected = form.cropTypes.includes(crop)
                    return (
                      <button key={crop} type="button" onClick={() => toggleCrop(crop)}
                        className="flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-medium text-left transition-all"
                        style={{
                          background: selected ? 'rgba(34,197,94,0.12)' : 'rgba(34,197,94,0.03)',
                          border: `1px solid ${selected ? 'rgba(34,197,94,0.4)' : 'rgba(34,197,94,0.1)'}`,
                          color: selected ? '#22c55e' : '#6b9e7f',
                        }}>
                        <div className="w-4 h-4 rounded flex items-center justify-center shrink-0"
                          style={{ background: selected ? '#22c55e' : 'transparent', border: `1.5px solid ${selected ? '#22c55e' : '#2a4a35'}` }}>
                          {selected && <CheckCircle size={11} className="text-black" />}
                        </div>
                        {crop}
                      </button>
                    )
                  })}
                </div>
                {form.cropTypes.length > 0 && (
                  <p className="text-xs mt-2 text-green-400">{form.cropTypes.length} crop{form.cropTypes.length > 1 ? 's' : ''} selected: {form.cropTypes.join(', ')}</p>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex gap-3 mt-8">
            {step > 1 && (
              <button type="button" onClick={() => { setStep(s => s - 1); setError('') }}
                className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all hover:border-green-400/30"
                style={{ border: '1px solid rgba(34,197,94,0.15)', color: '#4a7c5f' }}>
                <ArrowLeft size={14} /> Back
              </button>
            )}
            <button type="button" onClick={step === 3 ? handleSubmit : next} disabled={loading}
              className="flex-1 py-3 rounded-xl font-bold text-base text-black flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 disabled:opacity-60"
              style={{ background: '#22c55e' }}>
              {loading ? <><Loader2 size={16} className="animate-spin" /> Creating account...</>
                : step === 3 ? 'Create My Farmer Account' : <><span>Continue</span><ArrowRight size={16} /></>}
            </button>
          </div>

          <p className="text-center text-sm mt-5" style={{ color: '#4a7c5f' }}>
            Already have an account?{' '}
            <Link href="/login" className="text-green-400 font-semibold hover:text-green-300 transition-colors">Sign in →</Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
