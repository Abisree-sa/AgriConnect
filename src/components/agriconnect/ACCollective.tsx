const STEPS = [
  { emoji:'👨‍🌾', title:'Farmer A reports pest', desc:'Namakkal district. Fall Armyworm on maize leaves.' },
  { emoji:'🤖', title:'Model detects pattern', desc:"3rd similar report this week. Outbreak probability jumps to 82%." },
  { emoji:'🗺️', title:'Spatial predictor runs', desc:'Wind direction + humidity → Tiruchengode is at-risk within 5 days.' },
  { emoji:'📲', title:'147 farmers alerted', desc:'SMS + app push sent to all maize farmers within 30km radius.' },
  { emoji:'🛡️', title:'Prevention achieved', desc:'94% took action. Zero major losses in alerted zone. ₹38L saved.' },
]

export function ACCollective() {
  return (
    <section style={{ padding:'6rem 2rem', background:'#0d1410' }}>
      <div style={{ maxWidth:1100, margin:'0 auto' }}>
        <div style={{ display:'inline-block', fontSize:'0.7rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.1em', color:'#4ade80', background:'rgba(34,197,94,0.1)', border:'1px solid rgba(34,197,94,0.2)', padding:'4px 12px', borderRadius:999, marginBottom:'1rem' }}>Collective Intelligence</div>
        <h2 style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:'clamp(1.8rem,4vw,2.8rem)', fontWeight:700, color:'#f0fdf4', letterSpacing:'-1px', marginBottom:'1rem' }}>The network grows smarter every day</h2>
        <p style={{ color:'#6b7280', maxWidth:550, marginBottom:'3rem' }}>Every photo uploaded, every report submitted, every farmer's experience feeds back into the model — making predictions better for everyone.</p>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))', gap:'1.5rem' }}>
          {STEPS.map(s => (
            <div key={s.title} style={{ background:'rgba(20,30,22,0.6)', border:'1px solid rgba(34,197,94,0.1)', borderRadius:16, padding:'1.75rem', textAlign:'center', transition:'all 0.3s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor='rgba(34,197,94,0.4)'; (e.currentTarget as HTMLElement).style.transform='translateY(-4px)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor='rgba(34,197,94,0.1)'; (e.currentTarget as HTMLElement).style.transform='translateY(0)' }}>
              <div style={{ fontSize:'2.5rem', marginBottom:'0.5rem' }}>{s.emoji}</div>
              <h3 style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:'1rem', fontWeight:600, color:'#e8f0e9', marginBottom:'0.5rem' }}>{s.title}</h3>
              <p style={{ fontSize:'0.875rem', color:'#6b7280', lineHeight:1.6 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ACCollective
