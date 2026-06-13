'use client'
import { useEffect, useRef } from 'react'

const METRICS = [
  { val:'94.2%', label:'Disease Detection Accuracy' },
  { val:'87.6%', label:'Spread Prediction Precision' },
  { val:'91.3%', label:'Crop Recommendation F1' },
  { val:'87K+', label:'Training Images' },
]

const MODELS = [
  { icon:'🔬', title:'Model 1: CNN Disease Classifier', desc:'ResNet-50 fine-tuned on PlantVillage + Indian farm images. Classifies 38 disease categories across 14 crop types. Transfer learning from ImageNet.', lib:'Library: TensorFlow / Keras' },
  { icon:'📍', title:'Model 2: Spatial Spread Predictor', desc:'Random Forest with geospatial features — lat/lng, wind vectors, elevation, humidity. Predicts 5-day spread radius for active outbreaks.', lib:'Library: scikit-learn + GeoPandas' },
  { icon:'💰', title:'Model 3: Crop ROI Optimizer', desc:'Gradient Boosting Regressor trained on 5 years of TNAU + mandi price data. Predicts expected profit per acre for 22 crops given soil, water, and season inputs.', lib:'Library: XGBoost + pandas' },
]

export default function ACModel() {
  const chartRef1 = useRef<HTMLCanvasElement>(null)
  const chartRef2 = useRef<HTMLCanvasElement>(null)
  const loaded = useRef(false)

  useEffect(() => {
    if (loaded.current) return
    loaded.current = true
    import('chart.js/auto').then(({ default: Chart }) => {
      if (chartRef1.current) new Chart(chartRef1.current, {
        type: 'bar',
        data: {
          labels: ['Rice','Maize','Cotton','Tomato','Groundnut','Sugarcane'],
          datasets: [{ label:'Detection Accuracy %', data:[93.2,91.5,89.8,94.1,87.3,85.6], backgroundColor:['#16a34a','#22c55e','#4ade80','#16a34a','#22c55e','#4ade80'], borderRadius:6 }]
        },
        options: { responsive:true, maintainAspectRatio:false, plugins:{legend:{display:false}}, scales:{ x:{ticks:{color:'#9ca3af'},grid:{color:'rgba(255,255,255,0.04)'}}, y:{min:70,max:100,ticks:{color:'#9ca3af'},grid:{color:'rgba(255,255,255,0.06)'}} } }
      })
      if (chartRef2.current) new Chart(chartRef2.current, {
        type: 'line',
        data: {
          labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
          datasets: [{ label:'Confidence %', data:[78,80,81,82,84,83,86,88,89,91,93,94], borderColor:'#22c55e', backgroundColor:'rgba(34,197,94,0.08)', tension:0.4, fill:true, pointBackgroundColor:'#22c55e', pointRadius:4 }]
        },
        options: { responsive:true, maintainAspectRatio:false, plugins:{legend:{display:false}}, scales:{ x:{ticks:{color:'#9ca3af'},grid:{color:'rgba(255,255,255,0.04)'}}, y:{min:70,max:100,ticks:{color:'#9ca3af'},grid:{color:'rgba(255,255,255,0.05)'}} } }
      })
    })
  }, [])

  return (
    <section id="model" style={{ padding:'6rem 2rem', background:'#0d1410' }}>
      <div style={{ maxWidth:1100, margin:'0 auto' }}>
        <div style={{ display:'inline-block', fontSize:'0.7rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.1em', color:'#4ade80', background:'rgba(34,197,94,0.1)', border:'1px solid rgba(34,197,94,0.2)', padding:'4px 12px', borderRadius:999, marginBottom:'1rem' }}>Machine Learning</div>
        <h2 style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:'clamp(1.8rem,4vw,2.8rem)', fontWeight:700, color:'#f0fdf4', letterSpacing:'-1px', marginBottom:'1rem' }}>Trained on real agricultural data</h2>
        <p style={{ color:'#6b7280', marginBottom:'2rem' }}>Three specialized models power AgriConnect — each trained on curated Indian agricultural datasets.</p>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))', gap:'1rem', marginBottom:'2rem' }}>
          {METRICS.map(m => (
            <div key={m.label} style={{ background:'rgba(20,30,22,0.6)', border:'1px solid rgba(34,197,94,0.1)', borderRadius:12, padding:'1.25rem', textAlign:'center' }}>
              <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:'2rem', fontWeight:700, color:'#4ade80' }}>{m.val}</div>
              <div style={{ fontSize:'0.775rem', color:'#9ca3af', textTransform:'uppercase', letterSpacing:'0.06em', marginTop:2 }}>{m.label}</div>
            </div>
          ))}
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1.5rem', marginBottom:'2rem' }}>
          <div style={{ background:'rgba(20,30,22,0.5)', border:'1px solid rgba(34,197,94,0.1)', borderRadius:16, padding:'1.25rem' }}>
            <h4 style={{ fontSize:'0.875rem', color:'#d1d5db', marginBottom:'1rem', fontWeight:500 }}>Model Accuracy by Crop Type</h4>
            <div style={{ position:'relative', height:240 }}><canvas ref={chartRef1} /></div>
          </div>
          <div style={{ background:'rgba(20,30,22,0.5)', border:'1px solid rgba(34,197,94,0.1)', borderRadius:16, padding:'1.25rem' }}>
            <h4 style={{ fontSize:'0.875rem', color:'#d1d5db', marginBottom:'1rem', fontWeight:500 }}>Outbreak Prediction Confidence Over Time</h4>
            <div style={{ position:'relative', height:240 }}><canvas ref={chartRef2} /></div>
          </div>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'1.5rem' }}>
          {MODELS.map(m => (
            <div key={m.title} style={{ background:'rgba(20,30,22,0.8)', border:'1px solid rgba(34,197,94,0.1)', borderRadius:12, padding:'1.5rem' }}>
              <div style={{ fontSize:'1.5rem', marginBottom:'0.75rem' }}>{m.icon}</div>
              <h4 style={{ color:'#e8f0e9', fontWeight:600, marginBottom:'0.5rem', fontSize:'0.95rem' }}>{m.title}</h4>
              <p style={{ fontSize:'0.8rem', color:'#9ca3af', lineHeight:1.6 }}>{m.desc}</p>
              <div style={{ marginTop:'0.75rem', fontSize:'0.75rem', color:'#4ade80', fontWeight:600 }}>{m.lib}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
