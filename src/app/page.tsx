'use client'
import Link from 'next/link'
import { Leaf, Shield, Zap, Users, ArrowRight, MapPin, MessageCircle, Cpu, Camera } from 'lucide-react'
import { useAuth } from '@/lib/auth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function HomePage() {
  const { farmer, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && farmer) router.push('/dashboard')
  }, [farmer, loading, router])

  return (
    <div style={{ background: '#fff', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      {/* Navbar */}
      <nav style={{ borderBottom: '1px solid #e5e7eb', padding: '0 24px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, background: '#fff', zIndex: 50 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 32, height: 32, background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Leaf size={16} color="#16a34a" />
          </div>
          <span style={{ fontWeight: 800, fontSize: 18, color: '#111' }}>Agri<span style={{ color: '#16a34a' }}>Mind</span></span>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Link href="/login" style={{ padding: '8px 18px', borderRadius: 8, border: '1.5px solid #bbf7d0', color: '#16a34a', fontWeight: 600, fontSize: 13, textDecoration: 'none' }}>
            Sign In
          </Link>
          <Link href="/register" style={{ padding: '8px 18px', borderRadius: 8, background: '#16a34a', color: '#fff', fontWeight: 600, fontSize: 13, textDecoration: 'none' }}>
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ maxWidth: 640, margin: '0 auto', padding: '72px 24px 48px', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 999, padding: '5px 14px', marginBottom: 24 }}>
          <div style={{ width: 6, height: 6, background: '#16a34a', borderRadius: '50%' }} />
          <span style={{ fontSize: 12, fontWeight: 600, color: '#16a34a' }}>AI-powered farm protection for Indian farmers</span>
        </div>

        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.2rem)', fontWeight: 900, lineHeight: 1.15, letterSpacing: '-0.03em', color: '#111', marginBottom: 20 }}>
          Protect your farm with<br />
          <span style={{ color: '#16a34a' }}>collective intelligence</span>
        </h1>

        <p style={{ fontSize: 16, color: '#6b7280', lineHeight: 1.7, marginBottom: 36, maxWidth: 480, margin: '0 auto 36px' }}>
          AI detects crop diseases, alerts nearby farmers about outbreaks, recommends what to plant, and answers your farming questions — in your language.
        </p>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/register" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '13px 28px', background: '#16a34a', color: '#fff', borderRadius: 10, fontWeight: 700, fontSize: 15, textDecoration: 'none', boxShadow: '0 4px 14px rgba(22,163,74,0.25)' }}>
            Start for free <ArrowRight size={16} />
          </Link>
          <Link href="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '13px 28px', border: '1.5px solid #e5e7eb', color: '#374151', borderRadius: 10, fontWeight: 600, fontSize: 15, textDecoration: 'none' }}>
            I already have an account
          </Link>
        </div>
      </div>

      {/* Stats bar */}
      <div style={{ borderTop: '1px solid #f3f4f6', borderBottom: '1px solid #f3f4f6', background: '#f9fafb' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', padding: '24px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0 }}>
          {[
            { val: '1,240+', label: 'Farmers' },
            { val: '94%',    label: 'Accuracy' },
            { val: '5 min',  label: 'Alert speed' },
            { val: '5 lang', label: 'Languages' },
          ].map(({ val, label }) => (
            <div key={label} style={{ textAlign: 'center', padding: '8px 0', borderRight: '1px solid #e5e7eb' }}>
              <p style={{ fontWeight: 800, fontSize: 20, color: '#111' }}>{val}</p>
              <p style={{ fontSize: 12, color: '#9ca3af', marginTop: 2 }}>{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '64px 24px' }}>
        <p style={{ textAlign: 'center', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#9ca3af', marginBottom: 12 }}>What AgriMind does</p>
        <h2 style={{ textAlign: 'center', fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 800, color: '#111', marginBottom: 40, letterSpacing: '-0.02em' }}>
          Everything a farmer needs, in one app
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
          {[
            { icon: Camera,      color: '#16a34a', bg: '#f0fdf4', title: 'Scan & Detect',       desc: 'Upload a photo of your crop — AI identifies the disease and gives treatment advice instantly.' },
            { icon: MapPin,      color: '#dc2626', bg: '#fef2f2', title: 'Outbreak Alerts',     desc: 'Get notified when a pest outbreak is reported within 200km of your farm.' },
            { icon: Cpu,         color: '#d97706', bg: '#fffbeb', title: 'Crop Advisor',         desc: 'Tell us about your land — we suggest the best crop for your soil, season, and water source.' },
            { icon: MessageCircle, color: '#7c3aed', bg: '#f5f3ff', title: 'AI Chat',            desc: 'Ask anything in Tamil, Hindi, Telugu, Kannada or English. Get practical farming advice.' },
          ].map(({ icon: Icon, color, bg, title, desc }) => (
            <div key={title} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 14, padding: 22, transition: 'all 0.2s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = '#bbf7d0'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 16px rgba(22,163,74,0.08)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = '#e5e7eb'; (e.currentTarget as HTMLDivElement).style.boxShadow = 'none' }}>
              <div style={{ width: 40, height: 40, background: bg, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                <Icon size={18} color={color} />
              </div>
              <p style={{ fontWeight: 700, fontSize: 14, color: '#111', marginBottom: 6 }}>{title}</p>
              <p style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.6 }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Social proof */}
      <div style={{ background: '#f9fafb', borderTop: '1px solid #f3f4f6', borderBottom: '1px solid #f3f4f6', padding: '48px 24px' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <p style={{ textAlign: 'center', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#9ca3af', marginBottom: 32 }}>What farmers say</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
            {[
              { name: 'Ramesh Kumar', loc: 'Guntur, AP', text: 'AgriMind identified Fall Armyworm in my maize before it spread. Saved my 8 acres.' },
              { name: 'Priya Devi',   loc: 'Nellore, AP', text: 'I asked in Telugu — it answered in Telugu. Finally an app that speaks my language.' },
              { name: 'Suresh Reddy', loc: 'Kurnool, AP', text: 'The crop advisor told me to plant groundnut this Rabi. Best decision I made.' },
            ].map(({ name, loc, text }) => (
              <div key={name} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 14, padding: 20 }}>
                <p style={{ fontSize: 13, color: '#374151', lineHeight: 1.65, marginBottom: 14 }}>"{text}"</p>
                <p style={{ fontWeight: 700, fontSize: 13, color: '#111' }}>{name}</p>
                <p style={{ fontSize: 12, color: '#9ca3af' }}>{loc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{ maxWidth: 520, margin: '0 auto', padding: '64px 24px', textAlign: 'center' }}>
        <div style={{ width: 56, height: 56, background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
          <Leaf size={24} color="#16a34a" />
        </div>
        <h2 style={{ fontSize: 24, fontWeight: 800, color: '#111', marginBottom: 10, letterSpacing: '-0.02em' }}>Join 1,240+ farmers today</h2>
        <p style={{ fontSize: 14, color: '#6b7280', marginBottom: 28 }}>Free to use. No credit card needed. Works in 5 languages.</p>
        <Link href="/register" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '13px 32px', background: '#16a34a', color: '#fff', borderRadius: 10, fontWeight: 700, fontSize: 15, textDecoration: 'none' }}>
          Create free account <ArrowRight size={16} />
        </Link>
      </div>

      {/* Footer */}
      <div style={{ borderTop: '1px solid #e5e7eb', padding: '20px 24px', textAlign: 'center' }}>
        <p style={{ fontSize: 12, color: '#9ca3af' }}>© 2024 AgriMind · Built for Indian farmers · <Link href="/login" style={{ color: '#16a34a', textDecoration: 'none' }}>Sign in</Link></p>
      </div>
    </div>
  )
}
