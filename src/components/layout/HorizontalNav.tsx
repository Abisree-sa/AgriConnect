'use client'
import { Leaf } from 'lucide-react'

interface Props {
  sections: { id: string; label: string }[]
  active: number
  onNav: (i: number) => void
  onReport: () => void
}

export default function HorizontalNav({ sections, active, onNav, onReport }: Props) {
  return (
    <nav
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
        background: 'rgba(4,8,15,0.75)', backdropFilter: 'blur(18px)',
        borderBottom: '1px solid rgba(16,217,160,0.1)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 24px', height: 60,
      }}
    >
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }} onClick={() => onNav(0)}>
        <div style={{
          width: 34, height: 34, borderRadius: 10,
          background: 'rgba(16,217,160,0.12)',
          boxShadow: '0 0 16px rgba(16,217,160,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Leaf size={16} color="#10d9a0" />
        </div>
        <span style={{ color: '#fff', fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 18 }}>
          Agri<span style={{ color: '#10d9a0' }}>Mind</span>
        </span>
      </div>

      {/* Section tabs */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        {sections.map((s, i) => (
          <button
            key={s.id}
            onClick={() => onNav(i)}
            style={{
              padding: '6px 14px',
              borderRadius: 50,
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              border: active === i ? '1px solid rgba(16,217,160,0.45)' : '1px solid transparent',
              background: active === i ? 'rgba(16,217,160,0.12)' : 'transparent',
              color: active === i ? '#10d9a0' : '#5a8fa8',
              transition: 'all 0.2s',
              boxShadow: active === i ? '0 0 12px rgba(16,217,160,0.15)' : 'none',
            }}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* CTA buttons */}
      <div style={{ display: 'flex', gap: 10 }}>
        <button
          onClick={onReport}
          style={{
            padding: '8px 18px', borderRadius: 50, fontSize: 13, fontWeight: 600,
            cursor: 'pointer', color: '#10d9a0',
            border: '1px solid rgba(16,217,160,0.3)',
            background: 'rgba(16,217,160,0.06)',
            transition: 'all 0.2s',
          }}
        >
          Report Outbreak
        </button>
        <button
          onClick={() => onNav(6)}
          style={{
            padding: '8px 18px', borderRadius: 50, fontSize: 13, fontWeight: 600,
            cursor: 'pointer', color: '#000',
            background: 'linear-gradient(120deg,#10d9a0,#06b6d4)',
            border: 'none',
            boxShadow: '0 0 16px rgba(16,217,160,0.3)',
            transition: 'all 0.2s',
          }}
        >
          Try AI Chat
        </button>
      </div>
    </nav>
  )
}
