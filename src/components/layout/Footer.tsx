import { Leaf, Github, Twitter, Mail } from 'lucide-react'

export default function Footer() {
  return (
    <footer style={{ borderTop: '1px solid rgba(16,217,160,0.1)', background: 'transparent' }} className="pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: 'rgba(16,217,160,0.12)' }}>
                <Leaf size={16} style={{ color: '#10d9a0' }} />
              </div>
              <span className="text-white font-black text-lg" style={{ fontFamily: 'Syne, sans-serif' }}>
                Agri<span style={{ color: '#10d9a0' }}>Mind</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: '#3d6475' }}>
              A Collective Intelligence Network for Farmers. When one farmer learns, every farmer benefits.
            </p>
            <div className="flex gap-3 mt-5">
              {[Github, Twitter, Mail].map((Icon, i) => (
                <div key={i} className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer transition-all hover:-translate-y-0.5"
                  style={{ border: '1px solid rgba(16,217,160,0.15)', color: 'rgba(16,217,160,0.6)' }}>
                  <Icon size={14} />
                </div>
              ))}
            </div>
          </div>

          {/* Platform */}
          <div>
            <p className="text-white font-semibold text-sm mb-4">Platform</p>
            {['Outbreak Detection','Digital Twin','AI Wisdom Chat','Community Reports','Spread Prediction'].map(l => (
              <p key={l} className="text-sm mb-2 cursor-pointer transition-colors hover:text-white"
                style={{ color: '#3d6475' }}>{l}</p>
            ))}
          </div>

          {/* Crops */}
          <div>
            <p className="text-white font-semibold text-sm mb-4">Supported Crops</p>
            {['Maize','Cotton','Rice','Wheat','Tomato','Sugarcane','Groundnut','Turmeric'].map(c => (
              <p key={c} className="text-sm mb-2" style={{ color: '#3d6475' }}>{c}</p>
            ))}
          </div>

          {/* Tech */}
          <div>
            <p className="text-white font-semibold text-sm mb-4">Technology</p>
            {['Next.js / React','Tailwind CSS','AI / GPT-4o','Real-time Alerts','Geospatial Maps','Multi-language AI'].map(t => (
              <p key={t} className="text-sm mb-2" style={{ color: '#3d6475' }}>{t}</p>
            ))}
          </div>
        </div>

        <div className="section-divider mb-6" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs" style={{ color: '#3d6475' }}>© 2024 AgriMind. Built for Indian farmers with ❤️</p>
          <p className="text-xs" style={{ color: '#3d6475' }}>
            Protecting <span className="font-semibold" style={{ color: '#10d9a0' }}>1,240+</span> farmers across India
          </p>
        </div>
      </div>
    </footer>
  )
}
