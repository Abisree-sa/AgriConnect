'use client'
import { useEffect } from 'react'
import ACNav from '@/components/agriconnect/ACNav'
import ACHero from '@/components/agriconnect/ACHero'
import ACHowItWorks from '@/components/agriconnect/ACHowItWorks'
import ACDemo from '@/components/agriconnect/ACDemo'
import ACModel from '@/components/agriconnect/ACModel'
import ACDatabase from '@/components/agriconnect/ACDatabase'
import ACMap from '@/components/agriconnect/ACMap'
import ACImpact from '@/components/agriconnect/ACImpact'
import ACCollective from '@/components/agriconnect/ACCollective'
import ACCTA from '@/components/agriconnect/ACCTA'

export default function AgriConnectPage() {
  return (
    <div style={{ background: '#0a0f0a', color: '#e8f0e9', fontFamily: "'Inter', sans-serif", overflowX: 'hidden' }}>
      <ACNav />
      <ACHero />
      <ACHowItWorks />
      <ACDemo />
      <ACModel />
      <ACDatabase />
      <ACMap />
      <ACImpact />
      <ACCollective />
      <ACCTA />
      <footer style={{ background: '#050a05', borderTop: '1px solid rgba(34,197,94,0.1)', padding: '3rem 2rem', textAlign: 'center' }}>
        <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.5rem', fontWeight: 700, color: '#4ade80', marginBottom: '0.5rem' }}>AgriConnect</div>
        <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>Collective Intelligence Network for Indian Farmers</p>
        <p style={{ color: '#6b7280', fontSize: '0.875rem', marginTop: '0.5rem' }}>Built with Python · TensorFlow · scikit-learn · GeoPandas · AGMARKNET · IMD · PlantVillage</p>
      </footer>
    </div>
  )
}
