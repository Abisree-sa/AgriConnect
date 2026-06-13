const OUTBREAKS = [
  { color:'#ef4444', label:'Namakkal', sub:'Fall Armyworm · Critical' },
  { color:'#f59e0b', label:'Thanjavur', sub:'Rice Blast · High' },
  { color:'#f59e0b', label:'Dharmapuri', sub:'Pink Bollworm · High' },
  { color:'#60a5fa', label:'Coimbatore', sub:'Late Blight · Watch' },
  { color:'#60a5fa', label:'Tiruvarur', sub:'BPH · Watch' },
  { color:'#22c55e', label:'Tirunelveli', sub:'All Clear · Low Risk' },
]

export default function ACMap() {
  return (
    <section id="map" style={{ padding:'6rem 2rem', background:'#0d1410' }}>
      <div style={{ maxWidth:1100, margin:'0 auto' }}>
        <div style={{ display:'inline-block', fontSize:'0.7rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.1em', color:'#4ade80', background:'rgba(34,197,94,0.1)', border:'1px solid rgba(34,197,94,0.2)', padding:'4px 12px', borderRadius:999, marginBottom:'1rem' }}>Outbreak Map</div>
        <h2 style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:'clamp(1.8rem,4vw,2.8rem)', fontWeight:700, color:'#f0fdf4', letterSpacing:'-1px', marginBottom:'1rem' }}>Location-based disease prediction</h2>
        <p style={{ color:'#6b7280', marginBottom:'2rem' }}>AgriConnect tracks active outbreaks across Tamil Nadu in real time.</p>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1.5fr', gap:'2rem', alignItems:'start' }}>
          <div>
            {[
              { bg:'rgba(239,68,68,0.08)', border:'rgba(239,68,68,0.25)', icon:'🚨', title:'Critical: Fall Armyworm spreading', desc:'Detected in 3 farms in Namakkal. Predicted spread to Tiruchengode (87% confidence) within 5 days.' },
              { bg:'rgba(251,191,36,0.08)', border:'rgba(251,191,36,0.25)', icon:'⚠️', title:'Warning: Rice blast risk elevated', desc:'High humidity (82%) in Cauvery delta. Historical outbreak conditions met. 156 farmers notified.' },
              { bg:'rgba(34,197,94,0.08)', border:'rgba(34,197,94,0.2)', icon:'✅', title:'Prevention success: Coimbatore', desc:'Early warning sent 6 days ago. 94% of alerted farmers took preventive action. Zero crop loss reported.' },
            ].map(a => (
              <div key={a.title} style={{ background:a.bg, border:`1px solid ${a.border}`, borderRadius:12, padding:'1rem 1.25rem', marginBottom:'1rem', display:'flex', gap:10 }}>
                <span style={{ fontSize:'1.1rem', marginTop:1 }}>{a.icon}</span>
                <div>
                  <h5 style={{ fontSize:'0.875rem', fontWeight:600, color:'#e8f0e9', marginBottom:2 }}>{a.title}</h5>
                  <p style={{ fontSize:'0.8rem', color:'#9ca3af', lineHeight:1.5 }}>{a.desc}</p>
                </div>
              </div>
            ))}

            <h4 style={{ color:'#9ca3af', fontSize:'0.8rem', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:'1rem', marginTop:'1.5rem' }}>Active Outbreak Zones</h4>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.75rem' }}>
              {OUTBREAKS.map(o => (
                <div key={o.label} style={{ background:'rgba(20,30,22,0.6)', border:'1px solid rgba(34,197,94,0.1)', borderRadius:12, padding:'1rem', display:'flex', alignItems:'center', gap:10 }}>
                  <div style={{ width:10, height:10, borderRadius:'50%', background:o.color, boxShadow:`0 0 8px ${o.color}`, flexShrink:0 }} />
                  <div>
                    <h5 style={{ fontSize:'0.875rem', color:'#e8f0e9', fontWeight:600, marginBottom:1 }}>{o.label}</h5>
                    <p style={{ fontSize:'0.75rem', color:'#6b7280' }}>{o.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SVG Map */}
          <div style={{ background:'rgba(20,30,22,0.4)', borderRadius:16, padding:'1rem', textAlign:'center' }}>
            <svg viewBox="0 0 400 520" width="100%" style={{ maxHeight:500 }} xmlns="http://www.w3.org/2000/svg">
              <defs>
                <filter id="gr"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
                <filter id="ga"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
              </defs>
              <rect width="400" height="520" fill="rgba(10,20,12,0.5)" rx="12"/>
              <path d="M180 30 L240 25 L290 40 L310 80 L320 120 L315 160 L305 200 L290 240 L270 290 L255 340 L240 380 L220 420 L200 460 L185 490 L170 490 L160 470 L155 440 L148 400 L142 360 L138 320 L130 280 L120 240 L110 200 L100 160 L95 120 L100 80 L120 50 Z" fill="rgba(34,197,94,0.06)" stroke="rgba(34,197,94,0.25)" strokeWidth="1.5"/>
              <circle cx="275" cy="120" r="8" fill="rgba(34,197,94,0.8)" opacity="0.7"/>
              <text x="288" y="124" fill="#9ca3af" fontSize="11" fontFamily="Inter">Chennai</text>
              <circle cx="165" cy="210" r="14" fill="rgba(239,68,68,0.3)" filter="url(#gr)"/>
              <circle cx="165" cy="210" r="7" fill="#ef4444"/>
              <text x="120" y="230" fill="#f87171" fontSize="10" fontFamily="Inter" fontWeight="600">Namakkal 🚨</text>
              <circle cx="230" cy="240" r="11" fill="rgba(251,191,36,0.3)" filter="url(#ga)"/>
              <circle cx="230" cy="240" r="6" fill="#f59e0b"/>
              <text x="243" y="244" fill="#fbbf24" fontSize="10" fontFamily="Inter">Thanjavur ⚠️</text>
              <circle cx="150" cy="160" r="10" fill="rgba(251,191,36,0.3)"/>
              <circle cx="150" cy="160" r="5" fill="#d97706"/>
              <text x="104" y="156" fill="#fbbf24" fontSize="10" fontFamily="Inter">Dharmapuri</text>
              <circle cx="120" cy="185" r="9" fill="rgba(96,165,250,0.3)"/>
              <circle cx="120" cy="185" r="5" fill="#60a5fa"/>
              <text x="75" y="181" fill="#93c5fd" fontSize="10" fontFamily="Inter">Coimbatore</text>
              <circle cx="170" cy="170" r="6" fill="rgba(34,197,94,0.5)"/>
              <text x="178" y="174" fill="#6ee7b7" fontSize="10" fontFamily="Inter">Salem</text>
              <circle cx="190" cy="340" r="8" fill="rgba(34,197,94,0.6)"/>
              <text x="200" y="344" fill="#6ee7b7" fontSize="10" fontFamily="Inter">Madurai</text>
              <circle cx="175" cy="420" r="7" fill="rgba(34,197,94,0.8)"/>
              <text x="185" y="424" fill="#4ade80" fontSize="10" fontFamily="Inter">Tirunelveli ✓</text>
              <circle cx="250" cy="270" r="8" fill="rgba(96,165,250,0.5)"/>
              <text x="260" y="274" fill="#93c5fd" fontSize="10" fontFamily="Inter">Tiruvarur</text>
              <circle cx="165" cy="210" r="45" fill="none" stroke="rgba(239,68,68,0.25)" strokeWidth="1" strokeDasharray="4,4"/>
              <circle cx="165" cy="210" r="70" fill="none" stroke="rgba(239,68,68,0.12)" strokeWidth="1" strokeDasharray="4,4"/>
            </svg>
          </div>
        </div>
      </div>
    </section>
  )
}
