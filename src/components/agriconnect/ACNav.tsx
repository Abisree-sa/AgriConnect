'use client'
const scroll = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

export default function ACNav() {
  return (
    <nav style={{ position:'fixed', top:0, left:0, right:0, zIndex:1000, background:'rgba(10,15,10,0.92)', backdropFilter:'blur(16px)', borderBottom:'1px solid rgba(34,197,94,0.15)', padding:'0 2rem', display:'flex', alignItems:'center', justifyContent:'space-between', height:64 }}>
      <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:'1.4rem', fontWeight:700, color:'#4ade80' }}>
        Agri<span style={{ color:'#e8f0e9' }}>Connect</span>
      </div>
      <ul style={{ display:'flex', gap:'2rem', listStyle:'none' }}>
        {[['how','How It Works'],['demo','Live Demo'],['model','ML Model'],['database','Database'],['map','Outbreak Map']].map(([id,label]) => (
          <li key={id}><button onClick={() => scroll(id)} style={{ background:'none', border:'none', color:'#9ca3af', fontSize:'0.875rem', fontWeight:500, cursor:'pointer' }}>{label}</button></li>
        ))}
      </ul>
      <button onClick={() => scroll('demo')} style={{ background:'#16a34a', color:'#fff', border:'none', padding:'8px 20px', borderRadius:8, fontSize:'0.875rem', fontWeight:600, cursor:'pointer' }}>
        Try Demo
      </button>
    </nav>
  )
}
