'use client'
import { useEffect, useRef } from 'react'

const STATS = [
  { target: 12847, label: 'Farmers Connected' },
  { target: 94, label: '% Detection Accuracy' },
  { target: 38, label: 'Districts Covered' },
  { target: 156, label: 'Crores Losses Prevented' },
]

export default function ACHero() {
  const ref = useRef<HTMLDivElement>(null)
  const animated = useRef(false)

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !animated.current) {
        animated.current = true
        document.querySelectorAll<HTMLElement>('.ac-counter').forEach(el => {
          const target = parseInt(el.dataset.target || '0')
          let cur = 0
          const step = target / 60
          const t = setInterval(() => {
            cur = Math.min(cur + step, target)
            el.textContent = Math.floor(cur).toLocaleString('en-IN')
            if (cur >= target) clearInterval(t)
          }, 20)
        })
      }
    }, { threshold: 0.5 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  return (
    <section style={{ minHeight:'100vh', display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', textAlign:'center', padding:'8rem 2rem 4rem', position:'relative', overflow:'hidden' }}>
      {/* grid bg */}
      <div style={{ position:'absolute', inset:0, backgroundImage:'linear-gradient(rgba(34,197,94,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(34,197,94,0.04) 1px,transparent 1px)', backgroundSize:'60px 60px' }} />
      <div style={{ position:'absolute', top:'20%', left:'50%', transform:'translateX(-50%)', width:600, height:400, background:'radial-gradient(ellipse, rgba(34,197,94,0.08) 0%, transparent 70%)', pointerEvents:'none' }} />

      <div style={{ position:'relative', zIndex:1 }}>
        <div style={{ display:'inline-flex', alignItems:'center', gap:6, background:'rgba(34,197,94,0.1)', border:'1px solid rgba(34,197,94,0.3)', color:'#4ade80', fontSize:'0.75rem', fontWeight:600, padding:'5px 14px', borderRadius:999, marginBottom:'1.5rem', letterSpacing:'0.05em', textTransform:'uppercase' }}>
          <span style={{ fontSize:8, animation:'pulse 2s infinite' }}>●</span> Live ML System · India 2024
        </div>

        <h1 style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:'clamp(3rem,7vw,5.5rem)', fontWeight:700, lineHeight:1.05, letterSpacing:'-2px', color:'#f0fdf4', marginBottom:'1.5rem' }}>
          When one farmer learns,<br /><span style={{ color:'#4ade80' }}>every farmer benefits.</span>
        </h1>

        <p style={{ fontSize:'1.2rem', color:'#6b7280', maxWidth:600, margin:'0 auto 2.5rem', lineHeight:1.7 }}>
          AgriConnect is a Collective Intelligence Network that uses machine learning to detect crop diseases, predict outbreaks, and optimize farming decisions — in real time, across thousands of farms.
        </p>

        <div style={{ display:'flex', gap:'1rem', justifyContent:'center', flexWrap:'wrap' }}>
          <button onClick={() => document.getElementById('demo')?.scrollIntoView({ behavior:'smooth' })}
            style={{ background:'#16a34a', color:'#fff', border:'none', padding:'14px 28px', borderRadius:10, fontSize:'1rem', fontWeight:600, cursor:'pointer' }}>
            🌾 Open Live Demo
          </button>
          <button onClick={() => document.getElementById('model')?.scrollIntoView({ behavior:'smooth' })}
            style={{ background:'transparent', color:'#d1d5db', border:'1px solid rgba(255,255,255,0.15)', padding:'14px 28px', borderRadius:10, fontSize:'1rem', fontWeight:500, cursor:'pointer' }}>
            📊 View ML Model
          </button>
        </div>

        <div ref={ref} style={{ display:'flex', gap:'3rem', justifyContent:'center', marginTop:'4rem', flexWrap:'wrap' }}>
          {STATS.map(({ target, label }) => (
            <div key={label} style={{ textAlign:'center' }}>
              <div className="ac-counter" data-target={target} style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:'2rem', fontWeight:700, color:'#4ade80' }}>0</div>
              <div style={{ fontSize:'0.8rem', color:'#6b7280', textTransform:'uppercase', letterSpacing:'0.06em', marginTop:2 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}}`}</style>
    </section>
  )
}
