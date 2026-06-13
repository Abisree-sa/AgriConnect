'use client'
import { motion } from 'framer-motion'
import { Home, Map, Cpu, MessageCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

const tabs = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'map', label: 'Outbreak Map', icon: Map },
  { id: 'twin', label: 'Digital Twin', icon: Cpu },
  { id: 'chat', label: 'Wisdom Chat', icon: MessageCircle },
]

interface Props {
  active: string
  onChange: (id: string) => void
}

export function BottomNav({ active, onChange }: Props) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-[#1a3328]">
      <div className="flex max-w-lg mx-auto">
        {tabs.map(({ id, label, icon: Icon }) => {
          const isActive = active === id
          return (
            <button
              key={id}
              onClick={() => onChange(id)}
              className="flex-1 flex flex-col items-center py-3 px-1 relative"
            >
              {isActive && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full"
                />
              )}
              <Icon
                size={20}
                className={cn('mb-1 transition-colors', isActive ? 'text-primary' : 'text-muted')}
              />
              <span className={cn('text-[10px] font-medium transition-colors', isActive ? 'text-primary' : 'text-muted')}>
                {label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
