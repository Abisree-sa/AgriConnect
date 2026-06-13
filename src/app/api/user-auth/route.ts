import { NextRequest, NextResponse } from 'next/server'

// In-memory store (persists for server lifetime — replace with DB for production)
const farmers = new Map<string, any>()

// Seed demo farmer
farmers.set('demo@agrimind.in', {
  id: 'farmer_demo',
  name: 'Ramesh Kumar',
  phone: '9876543210',
  email: 'demo@agrimind.in',
  password: 'demo1234',
  village: 'Rampur',
  district: 'Guntur',
  state: 'Andhra Pradesh',
  cropTypes: ['Maize', 'Cotton'],
  farmSize: 10,
  avatar: 'R',
  joinedAt: new Date(Date.now() - 86400000 * 30).toISOString(),
  reportsCount: 3,
})

function toPublic(f: any) {
  const { password, ...pub } = f
  return pub
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { action } = body

    // ── LOGIN ────────────────────────────────────────────────────────────────
    if (action === 'login') {
      const { email, password } = body
      if (!email || !password)
        return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 })

      const farmer = farmers.get(email.toLowerCase().trim())
      if (!farmer || farmer.password !== password)
        return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 })

      return NextResponse.json({ farmer: toPublic(farmer) })
    }

    // ── REGISTER ─────────────────────────────────────────────────────────────
    if (action === 'register') {
      const { name, phone, email, password, village, district, state, cropTypes, farmSize } = body

      if (!name || !phone || !email || !password)
        return NextResponse.json({ error: 'Name, phone, email and password are required.' }, { status: 400 })

      if (password.length < 6)
        return NextResponse.json({ error: 'Password must be at least 6 characters.' }, { status: 400 })

      const key = email.toLowerCase().trim()
      if (farmers.has(key))
        return NextResponse.json({ error: 'An account with this email already exists.' }, { status: 409 })

      const farmer = {
        id: `farmer_${Date.now()}`,
        name: name.trim(),
        phone: phone.trim(),
        email: key,
        password,
        village: village || '',
        district: district || '',
        state: state || '',
        cropTypes: cropTypes || [],
        farmSize: farmSize || 1,
        avatar: name.trim().charAt(0).toUpperCase(),
        joinedAt: new Date().toISOString(),
        reportsCount: 0,
      }
      farmers.set(key, farmer)
      return NextResponse.json({ farmer: toPublic(farmer) }, { status: 201 })
    }

    return NextResponse.json({ error: 'Unknown action.' }, { status: 400 })
  } catch {
    return NextResponse.json({ error: 'Server error. Please try again.' }, { status: 500 })
  }
}
