'use client'
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Loader2, Bot, User, ChevronDown } from 'lucide-react'
import { cn, LANGUAGES, SUGGESTED_PROMPTS } from '@/lib/utils'
import axios from 'axios'

interface Message {
  role: 'user' | 'assistant'
  content: string
  id: string
}

export function WisdomChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      role: 'assistant',
      content: "Namaste! 🌱 I'm AgriMind AI, your agricultural assistant. Ask me anything about crops, pests, fertilizers, or farming practices. I can respond in multiple languages!",
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [lang, setLang] = useState('en')
  const [showLang, setShowLang] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const send = async (question: string) => {
    if (!question.trim() || loading) return
    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: question }
    setMessages(m => [...m, userMsg])
    setInput('')
    setLoading(true)
    try {
      const { data } = await axios.post('/api/chat', { question, language: lang })
      setMessages(m => [...m, { id: Date.now().toString(), role: 'assistant', content: data.response }])
    } catch {
      setMessages(m => [...m, { id: Date.now().toString(), role: 'assistant', content: 'Sorry, I had trouble connecting. Please try again.' }])
    }
    setLoading(false)
  }

  const currentLang = LANGUAGES.find(l => l.code === lang)

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#1a3328]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center glow-green">
            <Bot size={16} className="text-primary" />
          </div>
          <div>
            <p className="text-white text-sm font-semibold">AgriMind AI</p>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span className="text-[10px] text-muted">Online</span>
            </div>
          </div>
        </div>
        {/* Language Picker */}
        <div className="relative">
          <button
            onClick={() => setShowLang(!showLang)}
            className="flex items-center gap-1.5 glass px-3 py-1.5 rounded-full text-xs text-white border border-[#1a3328]"
          >
            {currentLang?.label.split(' ')[0]}
            <ChevronDown size={11} />
          </button>
          <AnimatePresence>
            {showLang && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="absolute right-0 top-full mt-1 glass rounded-xl overflow-hidden z-50 min-w-[140px]"
              >
                {LANGUAGES.map(l => (
                  <button
                    key={l.code}
                    onClick={() => { setLang(l.code); setShowLang(false) }}
                    className={cn('w-full text-left px-3 py-2 text-xs hover:bg-primary/10 transition-colors', lang === l.code ? 'text-primary' : 'text-white')}
                  >
                    {l.label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Suggested prompts */}
      <div className="px-4 pt-3 pb-2 flex gap-2 overflow-x-auto scrollbar-none">
        {SUGGESTED_PROMPTS.slice(0, 4).map(p => (
          <button
            key={p}
            onClick={() => send(p)}
            className="whitespace-nowrap glass px-3 py-1.5 rounded-full text-xs text-muted border border-[#1a3328] hover:text-primary hover:border-primary/30 transition-all shrink-0"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-3">
        <AnimatePresence initial={false}>
          {messages.map(msg => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn('flex gap-2', msg.role === 'user' ? 'justify-end' : 'justify-start')}
            >
              {msg.role === 'assistant' && (
                <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot size={13} className="text-primary" />
                </div>
              )}
              <div
                className={cn(
                  'max-w-[78%] rounded-2xl px-3 py-2.5 text-sm leading-relaxed',
                  msg.role === 'user'
                    ? 'bg-primary/20 border border-primary/30 text-white rounded-br-sm'
                    : 'glass border border-[#1a3328] text-white rounded-bl-sm'
                )}
              >
                {msg.content}
              </div>
              {msg.role === 'user' && (
                <div className="w-7 h-7 rounded-full bg-card flex items-center justify-center shrink-0 mt-0.5 border border-[#1a3328]">
                  <User size={13} className="text-muted" />
                </div>
              )}
            </motion.div>
          ))}
          {loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2 justify-start">
              <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center">
                <Bot size={13} className="text-primary" />
              </div>
              <div className="glass border border-[#1a3328] rounded-2xl rounded-bl-sm px-4 py-3">
                <div className="flex gap-1 items-center">
                  {[0, 1, 2].map(i => (
                    <div key={i} className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-4 pb-4 pt-2 border-t border-[#1a3328]">
        <div className="flex gap-2 glass rounded-2xl border border-[#1a3328] p-1.5">
          <input
            className="flex-1 bg-transparent px-3 text-white text-sm placeholder:text-muted focus:outline-none"
            placeholder="Ask about crops, pests, fertilizers..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send(input)}
          />
          <button
            onClick={() => send(input)}
            disabled={!input.trim() || loading}
            className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center disabled:opacity-40 hover:bg-primary-dark transition-colors"
          >
            {loading ? <Loader2 size={14} className="text-background animate-spin" /> : <Send size={14} className="text-background" />}
          </button>
        </div>
      </div>
    </div>
  )
}
