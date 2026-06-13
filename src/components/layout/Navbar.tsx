'use client'
import { useState, useEffect } from 'react'
import { Leaf, Menu, X, LogOut, LayoutDashboard } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'

interface Props { onReport: () => void }

export default function Navbar({ onReport }: Props) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { farmer, logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const scroll = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setMenuOpen(false)
  }

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'glass border-b border-[rgba(34,197,94,0.12)]' : ''}`}>
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => scroll('hero')}>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(34,197,94,0.15)', boxShadow: '0 0 20px rgba(34,197,94,0.2)' }}>
            <Leaf size={18} className="text-green-400" />
          </div>
          <span className="text-white font-bold text-xl tracking-tight">Agri<span className="text-green-400">Mind</span></span>
        </div>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-8">
          {[['story','The Story'],['features','Features'],['outbreak','Outbreak Map'],['twin','Digital Twin'],['chat','AI Chat']].map(([id,label]) => (
            <button key={id} onClick={() => scroll(id)} className="nav-link">{label}</button>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          {farmer ? (
            <>
              <Link href="/dashboard"
                className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold text-green-400 transition-all hover:bg-green-400/10"
                style={{ border: '1px solid rgba(34,197,94,0.3)' }}>
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black text-black" style={{ background: '#22c55e' }}>
                  {farmer.avatar}
                </div>
                {farmer.name.split(' ')[0]}
              </Link>
              <button onClick={onReport}
                className="px-4 py-2 rounded-full text-sm font-semibold text-black bg-green-400 hover:bg-green-300 transition-all">
                Report Outbreak
              </button>
              <button onClick={() => { logout(); router.push('/') }}
                className="p-2 rounded-full transition-all hover:bg-red-400/10" style={{ color: '#ef4444' }}>
                <LogOut size={16} />
              </button>
            </>
          ) : (
            <>
              <Link href="/login"
                className="px-5 py-2.5 rounded-full text-sm font-semibold text-green-400 border border-green-400/30 hover:bg-green-400/10 transition-all">
                Sign In
              </Link>
              <Link href="/register"
                className="px-5 py-2.5 rounded-full text-sm font-semibold text-black bg-green-400 hover:bg-green-300 transition-all">
                Join Free
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden text-green-400" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden glass border-t border-green-400/10 px-6 py-4 space-y-3">
          {[['story','The Story'],['features','Features'],['outbreak','Outbreak Map'],['twin','Digital Twin'],['chat','AI Chat']].map(([id,label]) => (
            <button key={id} onClick={() => scroll(id)} className="block w-full text-left nav-link py-2">{label}</button>
          ))}
          <div className="pt-2 space-y-2 border-t border-green-400/10">
            {farmer ? (
              <>
                <Link href="/dashboard" onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 w-full py-2.5 rounded-xl text-sm font-semibold text-green-400 px-4"
                  style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)' }}>
                  <LayoutDashboard size={14} /> {farmer.name}'s Dashboard
                </Link>
                <button onClick={onReport} className="w-full py-2.5 rounded-xl text-sm font-bold text-black bg-green-400">Report Outbreak</button>
                <button onClick={() => { logout(); router.push('/'); setMenuOpen(false) }}
                  className="w-full py-2 text-sm text-red-400 font-medium">Sign Out</button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setMenuOpen(false)} className="block w-full py-2.5 text-center rounded-xl text-sm font-semibold text-green-400" style={{ border: '1px solid rgba(34,197,94,0.3)' }}>Sign In</Link>
                <Link href="/register" onClick={() => setMenuOpen(false)} className="block w-full py-2.5 text-center rounded-xl text-sm font-bold text-black bg-green-400">Join Free</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
