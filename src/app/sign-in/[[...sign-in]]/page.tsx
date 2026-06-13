import Link from 'next/link'

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-sm text-center">
        <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-4" style={{ boxShadow: '0 0 24px rgba(34,197,94,0.2)' }}>
          <span className="text-3xl">🌿</span>
        </div>
        <h1 className="text-2xl font-bold text-white">AgriMind</h1>
        <p className="text-muted text-sm mt-1 mb-6">Agricultural Intelligence Platform</p>
        <Link href="/" className="block w-full py-3 rounded-2xl bg-primary text-background font-bold text-sm text-center">
          Enter App
        </Link>
      </div>
    </div>
  )
}
