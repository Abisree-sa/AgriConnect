'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Leaf, Eye, EyeOff, Loader2, AlertCircle, ArrowRight, Phone } from 'lucide-react'
import { useAuth } from '@/lib/auth'

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.email || !form.password) { setError('Please fill in all fields.'); return }
    setLoading(true); setError('')
    const res = await login(form.email, form.password)
    if (res.ok) {
      router.push('/dashboard')
    } else {
      setError(res.error || 'Login failed.')
      setLoading(false)
    }
  }

  const demoLogin = async () => {
    setForm({ email: 'demo@agrimind.in', password: 'demo1234' })
    setLoading(true); setError('')
    const res = await login('demo@agrimind.in', 'demo1234')
    if (res.ok) router.push('/dashboard')
    else { setError(res.error || 'Demo login failed.'); setLoading(false) }
  }

  return (
    <div className="min-h-screen flex" style={{ background: '#050e08' }}>
      {/* Left — Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #061409 0%, #0a2010 50%, #061409 100%)' }}>
        <div className="absolute inset-0 grid-pattern opacity-40 pointer-events-none" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(34,197,94,0.1) 0%, transparent 70%)' }} />

        {/* Logo */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)' }}>
            <Leaf size={20} className="text-green-400" />
          </div>
          <span className="text-white font-bold text-xl">Agri<span className="text-green-400">Mind</span></span>
        </div>

        {/* Main quote */}
        <div className="relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <p className="text-4xl font-black text-white leading-tight mb-4" style={{ letterSpacing: '-0.02em' }}>
              "When one farmer<br />
              <span className="text-green-400">learns,</span> every<br />
              farmer benefits."
            </p>
            <p className="text-base" style={{ color: '#4a7c5f' }}>
              Join 1,240+ farmers already protecting their crops with collective intelligence.
            </p>
          </motion.div>

          {/* Farmer stats */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="grid grid-cols-3 gap-4 mt-10">
            {[['1,240+', 'Farmers'], ['847', 'Outbreaks\nStopped'], ['₹2.4Cr', 'Crop Value\nSaved']].map(([val, label]) => (
              <div key={val} className="rounded-2xl p-4 text-center" style={{ background: 'rgba(34,197,94,0.07)', border: '1px solid rgba(34,197,94,0.15)' }}>
                <p className="text-green-400 font-black text-xl">{val}</p>
                <p className="text-xs mt-1 whitespace-pre-line" style={{ color: '#4a7c5f' }}>{label}</p>
              </div>
            ))}
          </motion.div>

          {/* Recent activity */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
            className="mt-6 rounded-2xl p-4" style={{ background: 'rgba(34,197,94,0.05)', border: '1px solid rgba(34,197,94,0.12)' }}>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-green-400 text-xs font-semibold">Live Activity</span>
            </div>
            <p className="text-white text-sm">Ramesh Kumar just reported <span className="text-green-400 font-semibold">Fall Armyworm</span> in Guntur — 4 nearby farmers alerted.</p>
          </motion.div>
        </div>

        <p className="text-xs relative z-10" style={{ color: '#2a4a35' }}>© 2024 AgriMind · Collective Intelligence for Indian Farmers</p>
      </div>

      {/* Right — Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(34,197,94,0.15)' }}>
              <Leaf size={16} className="text-green-400" />
            </div>
            <span className="text-white font-bold text-lg">Agri<span className="text-green-400">Mind</span></span>
          </div>

          <h1 className="text-3xl font-black text-white mb-2" style={{ letterSpacing: '-0.02em' }}>Welcome back</h1>
          <p className="text-sm mb-8" style={{ color: '#4a7c5f' }}>
            Sign in to your farmer account to access your dashboard, reports, and AI tools.
          </p>

          {/* Demo banner */}
          <div className="rounded-2xl p-4 mb-6 cursor-pointer hover:border-green-400/40 transition-all" onClick={demoLogin}
            style={{ background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.2)' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-400 text-sm font-semibold">Try Demo Account</p>
                <p className="text-xs mt-0.5" style={{ color: '#4a7c5f' }}>demo@agrimind.in · password: demo1234</p>
              </div>
              <ArrowRight size={16} className="text-green-400" />
            </div>
          </div>

          {/* Error */}
          {error && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 rounded-xl p-3 mb-5 text-sm text-red-400"
              style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
              <AlertCircle size={14} className="shrink-0" />
              {error}
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold block mb-1.5" style={{ color: '#6b9e7f' }}>Email Address</label>
              <input type="email" placeholder="your@email.com" value={form.email} onChange={set('email')}
                className="w-full px-4 py-3 text-sm rounded-xl" style={{ background: 'rgba(10,25,18,0.8)', border: '1px solid rgba(34,197,94,0.15)', color: '#fff' }} />
            </div>

            <div>
              <label className="text-xs font-semibold block mb-1.5" style={{ color: '#6b9e7f' }}>Password</label>
              <div className="relative">
                <input type={showPass ? 'text' : 'password'} placeholder="••••••••" value={form.password} onChange={set('password')}
                  className="w-full px-4 py-3 text-sm rounded-xl pr-11" style={{ background: 'rgba(10,25,18,0.8)', border: '1px solid rgba(34,197,94,0.15)', color: '#fff' }} />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: '#4a7c5f' }}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-3.5 rounded-xl font-bold text-base text-black flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 disabled:opacity-60 mt-2"
              style={{ background: '#22c55e' }}>
              {loading ? <><Loader2 size={16} className="animate-spin" /> Signing in...</> : 'Sign In to AgriMind'}
            </button>
          </form>

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px" style={{ background: 'rgba(34,197,94,0.1)' }} />
            <span className="text-xs" style={{ color: '#2a4a35' }}>OR</span>
            <div className="flex-1 h-px" style={{ background: 'rgba(34,197,94,0.1)' }} />
          </div>

          <p className="text-center text-sm" style={{ color: '#4a7c5f' }}>
            New farmer?{' '}
            <Link href="/register" className="text-green-400 font-semibold hover:text-green-300 transition-colors">
              Create your account →
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
