const steps = [
  { num:'01', icon:'📸', title:'Farmer Uploads Photo', desc:'Farmer photographs suspicious crop symptoms via the AgriConnect mobile app. GPS coordinates captured automatically.' },
  { num:'02', icon:'🧠', title:'CNN Disease Detection', desc:'Convolutional Neural Network (ResNet-50) analyzes the image. Trained on 87,000+ labeled plant disease images from PlantVillage dataset.' },
  { num:'03', icon:'📡', title:'Pattern Recognition', desc:'Spatial clustering algorithm groups reports by location, crop type and weather. Identifies emerging outbreak corridors.' },
  { num:'04', icon:'🗺️', title:'Location Prediction', desc:'Random Forest model predicts spread risk to neighboring farms using wind direction, humidity, and historical spread data.' },
  { num:'05', icon:'🔔', title:'Collective Alert', desc:'Targeted SMS + app notifications sent to at-risk farmers before symptoms appear. Collective intelligence in action.' },
]

export default function ACHowItWorks() {
  return (
    <section id="how" style={{ padding:'6rem 2rem', background:'#0d1410' }}>
      <div style={{ maxWidth:1100, margin:'0 auto' }}>
        <div style={{ display:'inline-block', fontSize:'0.7rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.1em', color:'#4ade80', background:'rgba(34,197,94,0.1)', border:'1px solid rgba(34,197,94,0.2)', padding:'4px 12px', borderRadius:999, marginBottom:'1rem' }}>How it works</div>
        <h2 style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:'clamp(1.8rem,4vw,2.8rem)', fontWeight:700, color:'#f0fdf4', letterSpacing:'-1px', marginBottom:'1rem' }}>From one farmer's photo<br />to a network-wide alert</h2>
        <p style={{ color:'#6b7280', fontSize:'1.05rem', maxWidth:550, lineHeight:1.7, marginBottom:'3rem' }}>AgriConnect transforms individual observations into collective knowledge using a 5-stage ML pipeline.</p>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:'1.5rem' }}>
          {steps.map(s => (
            <div key={s.num} style={{ background:'rgba(20,30,22,0.6)', border:'1px solid rgba(34,197,94,0.1)', borderRadius:16, padding:'1.75rem', transition:'all 0.3s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(34,197,94,0.4)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(34,197,94,0.1)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)' }}>
              <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:'3rem', fontWeight:700, color:'rgba(34,197,94,0.15)', lineHeight:1, marginBottom:'0.75rem' }}>{s.num}</div>
              <div style={{ fontSize:'2rem', marginBottom:'0.75rem' }}>{s.icon}</div>
              <h3 style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:'1.05rem', fontWeight:600, color:'#e8f0e9', marginBottom:'0.5rem' }}>{s.title}</h3>
              <p style={{ fontSize:'0.875rem', color:'#6b7280', lineHeight:1.6 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
