'use client'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface Farmer {
  id: string
  name: string
  phone: string
  email: string
  village: string
  district: string
  state: string
  cropTypes: string[]
  farmSize: number
  avatar: string
  joinedAt: string
  reportsCount: number
}

interface AuthCtx {
  farmer: Farmer | null
  loading: boolean
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>
  register: (data: RegisterData) => Promise<{ ok: boolean; error?: string }>
  logout: () => void
  updateProfile: (data: Partial<Farmer>) => void
}

interface RegisterData {
  name: string
  phone: string
  email: string
  password: string
  village: string
  district: string
  state: string
  cropTypes: string[]
  farmSize: number
}

const Ctx = createContext<AuthCtx>({} as AuthCtx)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [farmer, setFarmer] = useState<Farmer | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    try {
      const stored = localStorage.getItem('agrimind_farmer')
      if (stored) setFarmer(JSON.parse(stored))
    } catch {}
    setLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch('/api/user-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'login', email, password }),
      })
      const data = await res.json()
      if (!res.ok) return { ok: false, error: data.error }
      setFarmer(data.farmer)
      localStorage.setItem('agrimind_farmer', JSON.stringify(data.farmer))
      return { ok: true }
    } catch {
      return { ok: false, error: 'Network error. Please try again.' }
    }
  }

  const register = async (form: RegisterData) => {
    try {
      const res = await fetch('/api/user-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'register', ...form }),
      })
      const data = await res.json()
      if (!res.ok) return { ok: false, error: data.error }
      setFarmer(data.farmer)
      localStorage.setItem('agrimind_farmer', JSON.stringify(data.farmer))
      return { ok: true }
    } catch {
      return { ok: false, error: 'Network error. Please try again.' }
    }
  }

  const logout = () => {
    setFarmer(null)
    localStorage.removeItem('agrimind_farmer')
  }

  const updateProfile = (data: Partial<Farmer>) => {
    if (!farmer) return
    const updated = { ...farmer, ...data }
    setFarmer(updated)
    localStorage.setItem('agrimind_farmer', JSON.stringify(updated))
  }

  return <Ctx.Provider value={{ farmer, loading, login, register, logout, updateProfile }}>{children}</Ctx.Provider>
}

export const useAuth = () => useContext(Ctx)
