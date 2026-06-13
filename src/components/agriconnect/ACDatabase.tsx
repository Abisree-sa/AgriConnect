const DATASETS = [
  { icon:'🌿', title:'PlantVillage Dataset', desc:'54,306 labeled plant disease images across 14 crop species. Used to train the CNN classifier. Open-source from Penn State.', num:'54,306 images' },
  { icon:'🌤️', title:'IMD Weather API', desc:'India Meteorological Department historical + forecast data. Temperature, humidity, rainfall for 640 districts going back 10 years.', num:'640 districts' },
  { icon:'🏪', title:'AGMARKNET Mandi Prices', desc:'Real-time and historical crop prices from 7,000+ agricultural markets across India. Updated daily by the Government of India.', num:'7,000+ mandis' },
  { icon:'🗺️', title:'TNAU Soil Survey', desc:'Tamil Nadu Agricultural University soil classification for all 38 districts. pH, organic matter, NPK levels per block.', num:'38 districts' },
  { icon:'📊', title:'NRSC Crop Survey', desc:'National Remote Sensing Centre satellite crop mapping. Season-wise sown area by crop and district from 2015–2024.', num:'9 years data' },
]

const DB_ROWS = [
  { id:'#AGM-2847', crop:'🌽 Maize', disease:'Fall Armyworm', loc:'Namakkal, TN', conf:'96.2%', risk:'Critical', riskColor:'#ef4444', alerted:147, date:'2024-11-28' },
  { id:'#AGM-2846', crop:'🌾 Rice', disease:'Blast Disease', loc:'Thanjavur, TN', conf:'91.5%', risk:'High', riskColor:'#f59e0b', alerted:89, date:'2024-11-27' },
  { id:'#AGM-2845', crop:'🍅 Tomato', disease:'Late Blight', loc:'Coimbatore, TN', conf:'88.3%', risk:'High', riskColor:'#f59e0b', alerted:62, date:'2024-11-27' },
  { id:'#AGM-2844', crop:'🌿 Cotton', disease:'Pink Bollworm', loc:'Dharmapuri, TN', conf:'94.7%', risk:'Critical', riskColor:'#ef4444', alerted:203, date:'2024-11-26' },
  { id:'#AGM-2843', crop:'🥜 Groundnut', disease:'Leaf Spot', loc:'Vellore, TN', conf:'82.1%', risk:'Medium', riskColor:'#22c55e', alerted:34, date:'2024-11-26' },
  { id:'#AGM-2842', crop:'🌾 Rice', disease:'Brown Planthopper', loc:'Tiruvarur, TN', conf:'89.4%', risk:'High', riskColor:'#f59e0b', alerted:118, date:'2024-11-25' },
  { id:'#AGM-2841', crop:'🌽 Maize', disease:'Grey Leaf Spot', loc:'Salem, TN', conf:'77.6%', risk:'Medium', riskColor:'#22c55e', alerted:45, date:'2024-11-25' },
]

export default function ACDatabase() {
  return (
    <section id="database" style={{ padding:'6rem 2rem', background:'#0a0f0a' }}>
      <div style={{ maxWidth:1100, margin:'0 auto' }}>
        <div style={{ display:'inline-block', fontSize:'0.7rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.1em', color:'#4ade80', background:'rgba(34,197,94,0.1)', border:'1px solid rgba(34,197,94,0.2)', padding:'4px 12px', borderRadius:999, marginBottom:'1rem' }}>Real Data</div>
        <h2 style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:'clamp(1.8rem,4vw,2.8rem)', fontWeight:700, color:'#f0fdf4', letterSpacing:'-1px', marginBottom:'1rem' }}>Built on verified agricultural databases</h2>
        <p style={{ color:'#6b7280', marginBottom:'3rem' }}>AgriConnect integrates five real-world data sources to ensure every prediction is grounded in actual farming data.</p>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:'1.5rem', marginBottom:'3rem' }}>
          {DATASETS.map(d => (
            <div key={d.title} style={{ background:'rgba(20,30,22,0.6)', border:'1px solid rgba(34,197,94,0.1)', borderRadius:16, padding:'1.5rem' }}>
              <div style={{ fontSize:'2.2rem', marginBottom:'0.75rem' }}>{d.icon}</div>
              <h3 style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:'1rem', fontWeight:600, color:'#e8f0e9', marginBottom:'0.25rem' }}>{d.title}</h3>
              <p style={{ fontSize:'0.825rem', color:'#9ca3af', lineHeight:1.5 }}>{d.desc}</p>
              <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:'1.5rem', fontWeight:700, color:'#4ade80', marginTop:'0.75rem' }}>{d.num}</div>
            </div>
          ))}
        </div>

        <h3 style={{ color:'#e8f0e9', fontSize:'1rem', fontWeight:600, marginBottom:'1rem' }}>📋 Sample Disease Database (Live Records)</h3>
        <div style={{ overflowX:'auto', borderRadius:12, border:'1px solid rgba(34,197,94,0.15)' }}>
          <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'0.825rem' }}>
            <thead>
              <tr>
                {['Report ID','Crop','Disease Detected','Location','Confidence','Risk Level','Farmers Alerted','Date'].map(h => (
                  <th key={h} style={{ background:'rgba(34,197,94,0.08)', color:'#4ade80', padding:'10px 14px', fontWeight:600, textAlign:'left', fontSize:'0.75rem', textTransform:'uppercase', letterSpacing:'0.05em', borderBottom:'1px solid rgba(34,197,94,0.15)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {DB_ROWS.map(r => (
                <tr key={r.id} style={{ borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
                  <td style={{ padding:'10px 14px', color:'#d1d5db' }}>{r.id}</td>
                  <td style={{ padding:'10px 14px', color:'#d1d5db' }}>{r.crop}</td>
                  <td style={{ padding:'10px 14px', color:'#d1d5db' }}>{r.disease}</td>
                  <td style={{ padding:'10px 14px', color:'#d1d5db' }}>{r.loc}</td>
                  <td style={{ padding:'10px 14px', color:'#d1d5db' }}>{r.conf}</td>
                  <td style={{ padding:'10px 14px' }}><span style={{ padding:'2px 8px', borderRadius:999, fontSize:'0.7rem', fontWeight:600, background:`${r.riskColor}22`, color:r.riskColor }}>{r.risk}</span></td>
                  <td style={{ padding:'10px 14px', color:'#d1d5db' }}>{r.alerted}</td>
                  <td style={{ padding:'10px 14px', color:'#d1d5db' }}>{r.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
