import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180) * Math.cos(lat2*Math.PI/180) * Math.sin(dLon/2)**2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
}

export function timeAgo(date: Date): string {
  const diff = Date.now() - new Date(date).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

export const RISK_COLORS: Record<string, string> = {
  LOW: 'text-primary bg-primary/10 border-primary/20',
  MEDIUM: 'text-accent bg-accent/10 border-accent/20',
  HIGH: 'text-danger bg-danger/10 border-danger/20',
}

export const CROP_OPTIONS = ['Maize','Cotton','Rice','Wheat','Tomato','Sugarcane','Groundnut','Turmeric']
export const SOIL_TYPES = ['Sandy','Clay','Loamy','Silty']
export const WATER_OPTIONS = ['Low','Medium','High']
export const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'ta', label: 'தமிழ் Tamil' },
  { code: 'hi', label: 'हिंदी Hindi' },
  { code: 'te', label: 'తెలుగు Telugu' },
  { code: 'kn', label: 'ಕನ್ನಡ Kannada' },
]
export const SUGGESTED_PROMPTS = [
  'Organic Armyworm Control',
  'Drought Management Tips',
  'Fertilizer Schedule for Maize',
  'Yield Improvement Methods',
  'Soil Health Improvement',
  'Irrigation Best Practices',
]
