'use client'
import { useState, useEffect, useRef } from 'react'
import { DISEASE_DB, CROP_FUTURES, FEED_MESSAGES } from '@/lib/agriconnect-data'

export default function ACDemo() {
  const [tab, setTab] = useState<'detect'|'twin'|'feed'>('detect')
  const [selectedCrop, setSelectedCrop] = useState('')
  const [symptom, setSymptom] = useState('')
  const [location, setLocation] = useState('')
  const [analyzing, setAnalyzing] = useState(false)
  const [result, setResult] = useState<any>(null)

  // Twin
  const [acres, setAcres] = useState(5)
  const [soil, setSoil] = useState('red')
  const [water, setWater] = useState('canal')
  const [season, setSeason] = useState('kharif')
  const [simResult, setSimResult] = useState<any[]>([])

  // Feed
  const [feed, setFeed] = useState<any[]>([])
  const feedIdx = useRef(0)

  useEffect(() => {
    if (tab === 'feed' && feed.length === 0) {
      setFeed(FEED_MESSAGES.slice(0, 5))
      feedIdx.current = 5
    }
  }, [tab])

  const runDetection = () => {
    if (!selectedCrop || !symptom || !location) return
    setAnalyzing(true); setResult(null)
    setTimeout(() => {
      const db = (DISEASE_DB as any)[selectedCrop]?.[symptom] || { disease:'Unknown pathogen', confidence:61, risk:'medium', treatment:'Consult local agricultural officer.', spread:'Unable to predict.' }
      setResult({ ...db, crop: selectedCrop, location })
      setAnalyzing(false)
    }, 1800)
  }

  const runSim = () => {
    const opts = ((CROP_FUTURES as any)[season]?.[soil] || (CROP_FUTURES as any).kharif.red).slice(0, 3)
    setSimResult(opts)
  }

  const addFeedItem = () => {
    const item = FEED_MESSAGES[feedIdx.current % FEED_MESSAGES.length]
    setFeed(f => [item, ...f.slice(0, 9)])
    feedIdx.current++
  }

  const CROPS = [['Maize','🌽'],['Rice','🌾'],['Cotton','🌿'],['Tomato','🍅'],['Groundnut','🥜'],['Sugarcane','🍬']]
  const riskColor = (r: string) => r === 'critical' ? '#ef4444' : r === 'high' ? '#f59e0b' : '#22c55e'
  const riskWidth = (r: string) => r === 'critical' ? '95%' : r === 'high' ? '72%' : '42%'

  return (
    <section id="demo" style={{ padding:'6rem 2rem', background:'#0a0f0a' }}>
      <div style={{ maxWidth:1100, margin:'0 auto' }}>
        <div style={{ display:'inline-block', fontSize:'0.7rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.1em', color:'#4ade80', background:'rgba(34,197,94,0.1)', border:'1px solid rgba(34,197,94,0.2)', padding:'4px 12px', borderRadius:999, marginBottom:'1rem' }}>Interactive Demo</div>
        <h2 style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:'clamp(1.8rem,4vw,2.8rem)', fontWeight:700, color:'#f0fdf4', letterSpacing:'-1px', marginBottom:'0.75rem' }}>Try AgriConnect live</h2>
        <p style={{ color:'#6b7280', marginBottom:'2rem' }}>Select a crop and symptom to see disease detection, risk prediction, and market optimization in real time.</p>

        <div style={{ background:'rgba(10,20,12,0.9)', border:'1px solid rgba(34,197,94,0.2)', borderRadius:24, padding:'2rem', overflow:'hidden' }}>
          {/* Tabs */}
          <div style={{ display:'flex', gap:4, marginBottom:'2rem', background:'rgba(0,0,0,0.3)', padding:4, borderRadius:10 }}>
            {[['detect','🔍 Pest Detection'],['twin','🌱 Digital Twin'],['feed','📡 Live Network Feed']].map(([id, label]) => (
              <button key={id} onClick={() => setTab(id as any)}
                style={{ flex:1, padding:'10px 16px', border:'none', background: tab === id ? '#15803d' : 'transparent', color: tab === id ? '#fff' : '#9ca3af', fontSize:'0.875rem', fontWeight:500, borderRadius:8, cursor:'pointer', transition:'all 0.2s' }}>
                {label}
              </button>
            ))}
          </div>

          {/* DETECT */}
          {tab === 'detect' && (
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'2rem' }}>
              <div>
                <p style={{ fontSize:'0.875rem', color:'#9ca3af', marginBottom:'1rem', fontWeight:500 }}>1. Select your crop</p>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'0.75rem', marginBottom:'1.5rem' }}>
                  {CROPS.map(([name, emoji]) => (
                    <button key={name} onClick={() => setSelectedCrop(name)}
                      style={{ padding:10, border:`1px solid ${selectedCrop === name ? '#22c55e' : 'rgba(34,197,94,0.15)'}`, borderRadius:10, background: selectedCrop === name ? 'rgba(34,197,94,0.1)' : 'transparent', color: selectedCrop === name ? '#4ade80' : '#d1d5db', fontSize:'0.825rem', cursor:'pointer', display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
                      <span style={{ fontSize:'1.5rem' }}>{emoji}</span>{name}
                    </button>
                  ))}
                </div>

                <p style={{ fontSize:'0.875rem', color:'#9ca3af', marginBottom:'0.75rem', fontWeight:500 }}>2. Describe symptom</p>
                <select value={symptom} onChange={e => setSymptom(e.target.value)}
                  style={{ width:'100%', padding:'10px 12px', borderRadius:8, border:'1px solid rgba(34,197,94,0.2)', background:'rgba(0,0,0,0.4)', color:'#e5e7eb', fontSize:'0.875rem', outline:'none', marginBottom:'1rem' }}>
                  <option value="">— Choose symptom —</option>
                  {[['yellow_spots','Yellow spots on leaves'],['brown_lesions','Brown lesions / patches'],['white_powder','White powdery coating'],['leaf_curl','Leaf curling / wilting'],['stem_rot','Stem rot / blackening'],['insect_holes','Insect holes / bite marks'],['orange_rust','Orange rust pustules']].map(([v,l]) => <option key={v} value={v}>{l}</option>)}
                </select>

                <p style={{ fontSize:'0.875rem', color:'#9ca3af', marginBottom:'0.75rem', fontWeight:500 }}>3. Your location</p>
                <select value={location} onChange={e => setLocation(e.target.value)}
                  style={{ width:'100%', padding:'10px 12px', borderRadius:8, border:'1px solid rgba(34,197,94,0.2)', background:'rgba(0,0,0,0.4)', color:'#e5e7eb', fontSize:'0.875rem', outline:'none', marginBottom:'1.5rem' }}>
                  <option value="">— Select district —</option>
                  {['Namakkal, TN','Coimbatore, TN','Salem, TN','Erode, TN','Tiruchengode, TN','Dharmapuri, TN','Krishnagiri, TN'].map(d => <option key={d} value={d}>{d}</option>)}
                </select>

                <button onClick={runDetection} style={{ width:'100%', padding:'12px', background:'#16a34a', color:'#fff', border:'none', borderRadius:10, fontSize:'1rem', fontWeight:600, cursor:'pointer' }}>
                  🔍 Analyze with ML Model
                </button>
              </div>

              <div>
                <p style={{ fontSize:'0.875rem', color:'#9ca3af', marginBottom:'1rem', fontWeight:500 }}>ML Analysis Result</p>
                {analyzing && (
                  <div style={{ textAlign:'center', padding:'3rem', color:'#6b7280' }}>
                    <div style={{ fontSize:'2rem', animation:'spin 1s linear infinite', display:'inline-block' }}>⚙️</div>
                    <p style={{ marginTop:'1rem', fontSize:'0.875rem' }}>Running CNN model...</p>
                  </div>
                )}
                {!analyzing && !result && (
                  <div style={{ border:'2px dashed rgba(34,197,94,0.15)', borderRadius:16, padding:'3rem', textAlign:'center', color:'#6b7280' }}>
                    <div style={{ fontSize:'3rem' }}>🔬</div>
                    <p style={{ marginTop:'0.75rem', fontSize:'0.875rem' }}>Select crop and symptom,<br />then click Analyze</p>
                  </div>
                )}
                {!analyzing && result && (
                  <div style={{ background:'rgba(20,30,22,0.8)', border:'1px solid rgba(34,197,94,0.2)', borderRadius:12, padding:'1.25rem' }}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1rem' }}>
                      <span style={{ fontSize:'0.7rem', color:'#6b7280', textTransform:'uppercase', letterSpacing:'0.06em' }}>Disease Detected</span>
                      <span style={{ fontSize:'0.75rem', background:'rgba(34,197,94,0.1)', color:'#4ade80', padding:'2px 8px', borderRadius:999, fontWeight:600 }}>{result.confidence}% confidence</span>
                    </div>
                    <h3 style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:'1.25rem', color:'#f0fdf4', marginBottom:'0.75rem' }}>{result.disease}</h3>
                    <div style={{ marginBottom:'1rem' }}>
                      <div style={{ display:'flex', justifyContent:'space-between', fontSize:'0.75rem', color:'#9ca3af', marginBottom:4 }}>
                        <span>Risk Level</span>
                        <span style={{ color: riskColor(result.risk), fontWeight:600 }}>{result.risk.toUpperCase()}</span>
                      </div>
                      <div style={{ background:'rgba(0,0,0,0.3)', borderRadius:999, height:8, overflow:'hidden' }}>
                        <div style={{ height:'100%', width: riskWidth(result.risk), background: riskColor(result.risk), borderRadius:999, transition:'width 1s ease' }} />
                      </div>
                    </div>
                    <div style={{ background:'rgba(34,197,94,0.05)', borderRadius:8, padding:'0.875rem', marginBottom:'0.75rem' }}>
                      <div style={{ fontSize:'0.7rem', color:'#4ade80', fontWeight:600, textTransform:'uppercase', marginBottom:4 }}>💊 Recommended Treatment</div>
                      <p style={{ fontSize:'0.825rem', color:'#d1d5db', lineHeight:1.5 }}>{result.treatment}</p>
                    </div>
                    <div style={{ background:'rgba(239,68,68,0.05)', borderRadius:8, padding:'0.875rem' }}>
                      <div style={{ fontSize:'0.7rem', color:'#f87171', fontWeight:600, textTransform:'uppercase', marginBottom:4 }}>📡 Spread Prediction ({result.location})</div>
                      <p style={{ fontSize:'0.825rem', color:'#d1d5db', lineHeight:1.5 }}>{result.spread}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TWIN */}
          {tab === 'twin' && (
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'2rem' }}>
              <div>
                <p style={{ fontSize:'0.875rem', color:'#9ca3af', marginBottom:'1.5rem' }}>Enter your farm details. AgriConnect simulates multiple crop futures using soil + weather + market ML models.</p>
                {[
                  { label:'Farm size (acres)', el: <input type="number" value={acres} min={1} max={100} onChange={e => setAcres(+e.target.value)} style={{ width:'100%', padding:'9px 12px', borderRadius:8, border:'1px solid rgba(34,197,94,0.2)', background:'rgba(0,0,0,0.3)', color:'#e5e7eb', fontSize:'0.875rem', outline:'none' }} /> },
                  { label:'Soil type', el: <select value={soil} onChange={e => setSoil(e.target.value)} style={{ width:'100%', padding:'9px 12px', borderRadius:8, border:'1px solid rgba(34,197,94,0.2)', background:'rgba(0,0,0,0.3)', color:'#e5e7eb', fontSize:'0.875rem', outline:'none' }}><option value="red">Red Laterite (common in TN)</option><option value="black">Black Cotton Soil</option><option value="sandy">Sandy Loam</option><option value="alluvial">Alluvial</option></select> },
                  { label:'Water source', el: <select value={water} onChange={e => setWater(e.target.value)} style={{ width:'100%', padding:'9px 12px', borderRadius:8, border:'1px solid rgba(34,197,94,0.2)', background:'rgba(0,0,0,0.3)', color:'#e5e7eb', fontSize:'0.875rem', outline:'none' }}><option value="canal">Canal / River</option><option value="borewell">Borewell</option><option value="rain">Rainfed</option><option value="tank">Tank irrigation</option></select> },
                  { label:'Season', el: <select value={season} onChange={e => setSeason(e.target.value)} style={{ width:'100%', padding:'9px 12px', borderRadius:8, border:'1px solid rgba(34,197,94,0.2)', background:'rgba(0,0,0,0.3)', color:'#e5e7eb', fontSize:'0.875rem', outline:'none' }}><option value="kharif">Kharif (Jun–Oct)</option><option value="rabi">Rabi (Oct–Feb)</option><option value="summer">Summer (Feb–Jun)</option></select> },
                ].map(({ label, el }) => (
                  <div key={label} style={{ marginBottom:'1rem' }}>
                    <label style={{ display:'block', fontSize:'0.8rem', color:'#9ca3af', marginBottom:4, fontWeight:500 }}>{label}</label>
                    {el}
                  </div>
                ))}
                <button onClick={runSim} style={{ width:'100%', padding:'12px', background:'#16a34a', color:'#fff', border:'none', borderRadius:10, fontSize:'1rem', fontWeight:600, cursor:'pointer', marginTop:'0.5rem' }}>
                  🧬 Simulate Farm Futures
                </button>
              </div>
              <div>
                {simResult.length === 0 ? (
                  <div style={{ border:'2px dashed rgba(34,197,94,0.15)', borderRadius:16, padding:'3rem', textAlign:'center', color:'#6b7280' }}>
                    <div style={{ fontSize:'3rem' }}>🌐</div>
                    <p style={{ marginTop:'0.75rem', fontSize:'0.875rem' }}>Your digital twin will appear here with crop comparisons</p>
                  </div>
                ) : (
                  <>
                    <p style={{ fontSize:'0.8rem', color:'#9ca3af', marginBottom:'0.75rem' }}>Digital Twin results for {acres} acres · {soil} soil · {season} season</p>
                    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'1rem' }}>
                      {simResult.map((c, i) => {
                        const isWinner = c.color === 'winner'
                        const rColor = c.risk === 'high' ? '#ef4444' : c.risk === 'medium' ? '#f59e0b' : '#22c55e'
                        return (
                          <div key={i} style={{ borderRadius:12, padding:'1.25rem', textAlign:'center', border:`1px solid ${isWinner ? '#22c55e' : 'rgba(255,255,255,0.08)'}`, background: isWinner ? 'rgba(34,197,94,0.08)' : 'rgba(34,197,94,0.03)', transition:'transform 0.3s' }}>
                            {isWinner && <div style={{ fontSize:'0.65rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.06em', color:'#4ade80', background:'rgba(34,197,94,0.15)', padding:'2px 8px', borderRadius:999, marginBottom:6, display:'inline-block' }}>Best choice</div>}
                            <div style={{ fontSize:'1.8rem', marginBottom:4 }}>{c.emoji}</div>
                            <div style={{ fontSize:'0.8rem', color:'#9ca3af', marginBottom:6 }}>{c.name}</div>
                            <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:'1.3rem', fontWeight:700, color:'#4ade80' }}>₹{(c.profit_per_acre * acres).toLocaleString('en-IN')}</div>
                            <div style={{ fontSize:'0.7rem', color:'#6b7280', marginTop:2 }}>for {acres} acres</div>
                            <div style={{ fontSize:'0.75rem', padding:'2px 8px', borderRadius:999, display:'inline-block', marginTop:4, background:`${rColor}22`, color: rColor }}>{c.risk.toUpperCase()} RISK</div>
                          </div>
                        )
                      })}
                    </div>
                    <p style={{ marginTop:'1rem', fontSize:'0.775rem', color:'#6b7280' }}>🤖 Predicted using XGBoost model trained on 5-year TNAU + AGMARKNET price data</p>
                  </>
                )}
              </div>
            </div>
          )}

          {/* FEED */}
          {tab === 'feed' && (
            <div>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1rem' }}>
                <p style={{ fontSize:'0.875rem', color:'#9ca3af' }}>Real-time reports from AgriConnect network</p>
                <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                  <div style={{ width:8, height:8, borderRadius:'50%', background:'#22c55e', animation:'pulse 2s infinite' }} />
                  <span style={{ fontSize:'0.75rem', color:'#4ade80', fontWeight:600 }}>LIVE</span>
                </div>
              </div>
              <div style={{ background:'rgba(0,0,0,0.2)', borderRadius:12, border:'1px solid rgba(34,197,94,0.1)', overflow:'hidden', maxHeight:380, overflowY:'auto' }}>
                {feed.map((d, i) => (
                  <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:12, padding:14, borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ width:36, height:36, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.1rem', flexShrink:0, background: d.type === 'red' ? 'rgba(239,68,68,0.15)' : d.type === 'amber' ? 'rgba(251,191,36,0.15)' : 'rgba(34,197,94,0.15)' }}>{d.emoji}</div>
                    <div>
                      <p style={{ fontSize:'0.875rem', color:'#d1d5db', lineHeight:1.5 }}>
                        <strong style={{ color:'#e8f0e9' }}>{d.name}</strong> · {d.crop} · <span style={{ color:'#4ade80' }}>{d.loc}</span><br />{d.msg}
                      </p>
                      <div style={{ fontSize:'0.75rem', color:'#6b7280', marginTop:2 }}>{d.time}</div>
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={addFeedItem} style={{ width:'100%', marginTop:'1rem', padding:'10px', background:'transparent', color:'#d1d5db', border:'1px solid rgba(255,255,255,0.15)', borderRadius:10, cursor:'pointer', fontSize:'0.875rem' }}>
                + Simulate New Report
              </button>
            </div>
          )}
        </div>
      </div>
      <style>{`@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>
    </section>
  )
}
