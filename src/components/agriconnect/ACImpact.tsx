'use client'
import { useEffect, useRef } from 'react'

export default function ACImpact() {
  const r1 = useRef<HTMLCanvasElement>(null)
  const r2 = useRef<HTMLCanvasElement>(null)
  const r3 = useRef<HTMLCanvasElement>(null)
  const r4 = useRef<HTMLCanvasElement>(null)
  const loaded = useRef(false)

  useEffect(() => {
    if (loaded.current) return
    loaded.current = true
    import('chart.js/auto').then(({ default: Chart }) => {
      const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov']
      if (r1.current) new Chart(r1.current, {
        type:'bar',
        data:{ labels:months, datasets:[
          { label:'Alerts Issued', data:[12,18,24,31,28,35,42,58,67,84,92], backgroundColor:'rgba(34,197,94,0.6)', borderRadius:4 },
          { label:'Loss Prevented (₹L)', data:[8,14,19,27,22,31,38,52,61,76,84], backgroundColor:'rgba(34,197,94,0.25)', borderRadius:4 }
        ]},
        options:{ responsive:true, maintainAspectRatio:false, plugins:{legend:{display:true,labels:{color:'#9ca3af',boxWidth:10,font:{size:11}}}}, scales:{ x:{ticks:{color:'#9ca3af'},grid:{color:'rgba(255,255,255,0.04)'}}, y:{ticks:{color:'#9ca3af'},grid:{color:'rgba(255,255,255,0.05)'}} } }
      })
      if (r2.current) new Chart(r2.current, {
        type:'line',
        data:{ labels:months, datasets:[{ label:'Farmers', data:[420,890,1560,2340,3800,5100,6900,8200,9800,11400,12847], borderColor:'#4ade80', backgroundColor:'rgba(74,222,128,0.08)', tension:0.4, fill:true, pointBackgroundColor:'#4ade80', pointRadius:4 }]},
        options:{ responsive:true, maintainAspectRatio:false, plugins:{legend:{display:false}}, scales:{ x:{ticks:{color:'#9ca3af'},grid:{color:'rgba(255,255,255,0.04)'}}, y:{ticks:{color:'#9ca3af',callback:(v:any) => v>=1000?(v/1000).toFixed(0)+'K':v},grid:{color:'rgba(255,255,255,0.05)'}} } }
      })
      if (r3.current) new Chart(r3.current, {
        type:'doughnut',
        data:{ labels:['Rice','Maize','Cotton','Tomato','Groundnut','Sugarcane'], datasets:[{ data:[28,24,18,14,10,6], backgroundColor:['#16a34a','#22c55e','#4ade80','#15803d','#86efac','#166534'], borderWidth:2, borderColor:'#0a0f0a' }]},
        options:{ responsive:true, maintainAspectRatio:false, cutout:'65%', plugins:{legend:{position:'right',labels:{color:'#9ca3af',boxWidth:10,font:{size:11},padding:8}}} }
      })
      if (r4.current) new Chart(r4.current, {
        type:'radar',
        data:{ labels:['Accuracy','Precision','Recall','F1 Score','Speed','Robustness'], datasets:[
          { label:'CNN Classifier', data:[94,91,93,92,82,88], borderColor:'#22c55e', backgroundColor:'rgba(34,197,94,0.1)', pointBackgroundColor:'#22c55e' },
          { label:'RF Spread Model', data:[88,87,85,86,96,84], borderColor:'#60a5fa', backgroundColor:'rgba(96,165,250,0.08)', pointBackgroundColor:'#60a5fa' },
          { label:'XGB ROI Model', data:[91,89,90,89,94,87], borderColor:'#fbbf24', backgroundColor:'rgba(251,191,36,0.06)', pointBackgroundColor:'#fbbf24' }
        ]},
        options:{ responsive:true, maintainAspectRatio:false, plugins:{legend:{position:'bottom',labels:{color:'#9ca3af',boxWidth:10,font:{size:10},padding:8}}}, scales:{ r:{min:70,max:100,ticks:{color:'#9ca3af',stepSize:10},grid:{color:'rgba(255,255,255,0.07)'},pointLabels:{color:'#9ca3af',font:{size:10}}} } }
      })
    })
  }, [])

  const box = { background:'rgba(20,30,22,0.5)', border:'1px solid rgba(34,197,94,0.1)', borderRadius:16, padding:'1.25rem' }

  return (
    <section style={{ padding:'6rem 2rem', background:'#0a0f0a' }}>
      <div style={{ maxWidth:1100, margin:'0 auto' }}>
        <div style={{ display:'inline-block', fontSize:'0.7rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.1em', color:'#4ade80', background:'rgba(34,197,94,0.1)', border:'1px solid rgba(34,197,94,0.2)', padding:'4px 12px', borderRadius:999, marginBottom:'1rem' }}>Impact & Analytics</div>
        <h2 style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:'clamp(1.8rem,4vw,2.8rem)', fontWeight:700, color:'#f0fdf4', letterSpacing:'-1px', marginBottom:'2rem' }}>Measurable impact on farming outcomes</h2>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1.5rem', marginBottom:'1.5rem' }}>
          <div style={box}><h4 style={{ fontSize:'0.875rem', color:'#d1d5db', marginBottom:'1rem' }}>Monthly Outbreak Alerts vs. Losses Prevented (₹ Lakhs)</h4><div style={{ height:260 }}><canvas ref={r1}/></div></div>
          <div style={box}><h4 style={{ fontSize:'0.875rem', color:'#d1d5db', marginBottom:'1rem' }}>Farmer Adoption Growth – Tamil Nadu 2024</h4><div style={{ height:260 }}><canvas ref={r2}/></div></div>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1.5rem' }}>
          <div style={box}><h4 style={{ fontSize:'0.875rem', color:'#d1d5db', marginBottom:'1rem' }}>Disease Detection by Crop (top 6)</h4><div style={{ height:240 }}><canvas ref={r3}/></div></div>
          <div style={box}><h4 style={{ fontSize:'0.875rem', color:'#d1d5db', marginBottom:'1rem' }}>Prediction Accuracy by Model Type</h4><div style={{ height:240 }}><canvas ref={r4}/></div></div>
        </div>
      </div>
    </section>
  )
}
