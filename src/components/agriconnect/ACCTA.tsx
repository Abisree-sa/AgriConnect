export default function ACCTA() {
  const scroll = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  const stats = [['3','ML Models'],['5','Real Datasets'],['94.2%','Accuracy'],['₹156Cr','Losses Prevented']]
  return (
    <section style={{ padding:'6rem 2rem', background:'#0a0f0a' }}>
      <div style={{ maxWidth:1100, margin:'0 auto' }}>
        <div style={{ background:'linear-gradient(135deg,rgba(22,163,74,0.15) 0%,rgba(34,197,94,0.05) 100%)', border:'1px solid rgba(34,197,94,0.2)', borderRadius:24, padding:'4rem 3rem', textAlign:'center' }}>
          <div style={{ display:'inline-block', fontSize:'0.7rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.1em', color:'#4ade80', background:'rgba(34,197,94,0.1)', border:'1px solid rgba(34,197,94,0.2)', padding:'4px 12px', borderRadius:999, marginBottom:'1.5rem' }}>Project Summary</div>
          <h2 style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:'2.5rem', fontWeight:700, color:'#f0fdf4', letterSpacing:'-1px', marginBottom:'1rem' }}>AgriConnect: Collective Intelligence<br />for Indian Agriculture</h2>
          <p style={{ color:'#9ca3af', maxWidth:600, margin:'0 auto 2rem', fontSize:'1.05rem', lineHeight:1.7 }}>
            A machine learning system that connects 12,847 farmers across Tamil Nadu. Using CNN disease detection, spatial spread prediction, and crop ROI optimization — trained on 5 verified datasets — to prevent crop losses before they happen.
          </p>
          <div style={{ display:'flex', justifyContent:'center', gap:'3rem', flexWrap:'wrap', marginBottom:'2rem' }}>
            {stats.map(([val, label]) => (
              <div key={label} style={{ textAlign:'center' }}>
                <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:'2rem', fontWeight:700, color:'#4ade80' }}>{val}</div>
                <div style={{ fontSize:'0.8rem', color:'#6b7280', textTransform:'uppercase', letterSpacing:'0.06em' }}>{label}</div>
              </div>
            ))}
          </div>
          <div style={{ display:'flex', justifyContent:'center', gap:'1rem', flexWrap:'wrap' }}>
            <button onClick={() => window.print()} style={{ background:'#16a34a', color:'#fff', border:'none', padding:'14px 28px', borderRadius:10, fontSize:'1rem', fontWeight:600, cursor:'pointer' }}>📄 Export Report</button>
            <button onClick={() => scroll('demo')} style={{ background:'transparent', color:'#d1d5db', border:'1px solid rgba(255,255,255,0.15)', padding:'14px 28px', borderRadius:10, fontSize:'1rem', cursor:'pointer' }}>🔬 Back to Demo</button>
          </div>
        </div>
      </div>
    </section>
  )
}
