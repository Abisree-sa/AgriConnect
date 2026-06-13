'use client'
import { Bell, Leaf, User } from 'lucide-react'
// No auth dependency — works without Clerk keys

export function TopBar() {
  return (
    <header className="sticky top-0 z-40 glass border-b border-[#1a3328] px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center glow-green">
          <Leaf size={16} className="text-primary" />
        </div>
        <span className="font-bold text-white text-lg tracking-tight">AgriMind</span>
      </div>
      <div className="flex items-center gap-3">
        <button className="relative w-8 h-8 flex items-center justify-center rounded-full bg-card border border-[#1a3328]">
          <Bell size={15} className="text-muted" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-danger" />
        </button>
        <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
          <User size={14} className="text-primary" />
        </div>
      </div>
    </header>
  )
}
