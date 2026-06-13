import Link from 'next/link'

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-sm text-center">
        <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">🌿</span>
        </div>
        <h1 className="text-2xl font-bold text-white">Join AgriMind</h1>
        <p className="text-muted text-sm mt-1 mb-6">Protect your crops with collective intelligence</p>
        <Link href="/" className="block w-full py-3 rounded-2xl bg-primary text-background font-bold text-sm text-center">
          Enter App
        </Link>
      </div>
    </div>
  )
}
