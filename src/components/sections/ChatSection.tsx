'use client'
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bot, User, Send, Loader2, ChevronDown } from 'lucide-react'
import axios from 'axios'

const LANGUAGES = [
  { code: 'en', label: '🇬🇧 English' },
  { code: 'hi', label: '🇮🇳 हिंदी' },
  { code: 'te', label: '🌿 తెలుగు' },
  { code: 'ta', label: '🌿 தமிழ்' },
  { code: 'kn', label: '🌿 ಕನ್ನಡ' },
]

const PROMPTS = [
  'How to treat Fall Armyworm organically?',
  'Fertilizer schedule for Maize',
  'Drought management tips',
  'Best irrigation for Cotton',
  'How experienced farmers handle pest outbreaks?',
  'Soil health improvement methods',
]

interface Msg { id: string; role: 'user' | 'assistant'; content: string }

export default function ChatSection() {
  const [messages, setMessages] = useState<Msg[]>([{
    id: '0', role: 'assistant',
    content: "Namaste! 🌱 I'm AgriMind AI — your agricultural assistant powered by collective farmer wisdom. Ask me anything about crops, pests, fertilizers, irrigation, or market prices. I can respond in multiple Indian languages!",
  }])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [lang, setLang] = useState('en')
  const [showLang, setShowLang] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  const send = async (q: string) => {
    if (!q.trim() || loading) return
    setMessages(m => [...m, { id: Date.now().toString(), role: 'user', content: q }])
    setInput('')
    setLoading(true)
    try {
      const { data } = await axios.post('/api/chat', { question: q, language: lang })
      setMessages(m => [...m, { id: (Date.now() + 1).toString(), role: 'assistant', content: data.response }])
    } catch {
      setMessages(m => [...m, { id: (Date.now() + 1).toString(), role: 'assistant', content: 'Sorry, I had trouble connecting. Please try again.' }])
    }
    setLoading(false)
  }

  return (
    <section id="chat" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold text-green-400 uppercase tracking-widest mb-4"
            style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)' }}>
            AI Wisdom Chat
          </div>
          <h2 className="font-black text-white mb-4" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', letterSpacing: '-0.02em' }}>
            Ask <span className="gradient-text">Decades of Wisdom</span>
          </h2>
          <p className="text-base max-w-xl mx-auto" style={{ color: '#6b9e7f' }}>
            Experienced farmers carry decades of knowledge that is rarely written down. AgriMind preserves and shares that wisdom — in your language — so every farmer benefits.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left — prompts + info */}
          <div className="space-y-4">
            <div className="glass rounded-2xl p-5">
              <p className="text-white font-semibold text-sm mb-4">Try asking:</p>
              <div className="space-y-2">
                {PROMPTS.map(p => (
                  <button key={p} onClick={() => send(p)}
                    className="w-full text-left text-xs px-3 py-2.5 rounded-xl transition-all hover:border-green-400/30 hover:text-green-400"
                    style={{ background: 'rgba(34,197,94,0.04)', border: '1px solid rgba(34,197,94,0.12)', color: '#6b9e7f' }}>
                    "{p}"
                  </button>
                ))}
              </div>
            </div>

            <div className="glass rounded-2xl p-5">
              <p className="text-white font-semibold text-sm mb-3">Knowledge Sources</p>
              {['1,240+ farmer experiences','Pest treatment database','Soil & fertilizer science','Local market data','Weather pattern history'].map(s => (
                <div key={s} className="flex items-center gap-2 mb-2 text-xs" style={{ color: '#6b9e7f' }}>
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400 shrink-0" />
                  {s}
                </div>
              ))}
            </div>
          </div>

          {/* Chat Window */}
          <div className="lg:col-span-2 glass rounded-3xl flex flex-col" style={{ height: 560 }}>
            {/* Chat Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-green-400/10 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full flex items-center justify-center glow-green" style={{ background: 'rgba(34,197,94,0.15)' }}>
                  <Bot size={16} className="text-green-400" />
                </div>
                <div>
                  <p className="text-white text-sm font-semibold">AgriMind AI</p>
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-xs" style={{ color: '#4a7c5f' }}>Online · Collective Intelligence Active</span>
                  </div>
                </div>
              </div>
              {/* Language picker */}
              <div className="relative">
                <button onClick={() => setShowLang(!showLang)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs text-white glass"
                  style={{ border: '1px solid rgba(34,197,94,0.15)' }}>
                  {LANGUAGES.find(l => l.code === lang)?.label}
                  <ChevronDown size={11} />
                </button>
                <AnimatePresence>
                  {showLang && (
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                      className="absolute right-0 top-full mt-1 glass rounded-xl overflow-hidden z-50 min-w-[160px]">
                      {LANGUAGES.map(l => (
                        <button key={l.code} onClick={() => { setLang(l.code); setShowLang(false) }}
                          className="w-full text-left px-3 py-2 text-xs transition-colors hover:bg-green-400/10"
                          style={{ color: lang === l.code ? '#22c55e' : '#fff' }}>
                          {l.label}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              <AnimatePresence initial={false}>
                {messages.map(msg => (
                  <motion.div key={msg.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {msg.role === 'assistant' && (
                      <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ background: 'rgba(34,197,94,0.15)' }}>
                        <Bot size={13} className="text-green-400" />
                      </div>
                    )}
                    <div className="max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-line"
                      style={msg.role === 'user'
                        ? { background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.25)', color: '#fff', borderBottomRightRadius: 4 }
                        : { background: 'rgba(10,25,18,0.8)', border: '1px solid rgba(34,197,94,0.12)', color: '#d1fae5', borderBottomLeftRadius: 4 }}>
                      {msg.content}
                    </div>
                    {msg.role === 'user' && (
                      <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.15)' }}>
                        <User size={13} style={{ color: '#4a7c5f' }} />
                      </div>
                    )}
                  </motion.div>
                ))}
                {loading && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2.5 justify-start">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: 'rgba(34,197,94,0.15)' }}>
                      <Bot size={13} className="text-green-400" />
                    </div>
                    <div className="glass rounded-2xl px-4 py-3" style={{ borderBottomLeftRadius: 4 }}>
                      <div className="flex gap-1 items-center">
                        {[0, 1, 2].map(i => (
                          <div key={i} className="w-1.5 h-1.5 rounded-full bg-green-400 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="px-5 pb-5 pt-3 border-t border-green-400/10 shrink-0">
              <div className="flex gap-2 rounded-2xl p-1.5" style={{ background: 'rgba(10,25,18,0.6)', border: '1px solid rgba(34,197,94,0.15)' }}>
                <input className="flex-1 bg-transparent px-3 text-white text-sm placeholder:text-green-900 focus:outline-none"
                  placeholder="Ask about crops, pests, fertilizers, irrigation..."
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send(input)} />
                <button onClick={() => send(input)} disabled={!input.trim() || loading}
                  className="w-9 h-9 rounded-xl flex items-center justify-center transition-all disabled:opacity-40 hover:bg-green-300"
                  style={{ background: '#22c55e' }}>
                  {loading ? <Loader2 size={14} className="text-black animate-spin" /> : <Send size={14} className="text-black" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
