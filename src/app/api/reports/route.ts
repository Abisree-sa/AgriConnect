import { NextResponse } from 'next/server'

// Only 3 realistic reports — outbreaks are not that common
const SEED_REPORTS = [
  {
    id: '1',
    cropType: 'Maize',
    pestName: 'Fall Armyworm',
    description: 'Found worms inside the leaf whorls this morning. Leaves have small round holes and white scratches. About 3 out of 10 plants affected in the south field.',
    riskLevel: 'HIGH',
    status: 'ACTIVE',
    latitude: 17.395,
    longitude: 78.496,
    imageUrl: '',
    createdAt: new Date(Date.now() - 2 * 3600000).toISOString(),
    user: { name: 'Ramesh Kumar', village: 'Rampur', district: 'Guntur' },
  },
  {
    id: '2',
    cropType: 'Tomato',
    pestName: 'Early Blight',
    description: 'Dark brown spots with yellow rings on the lower leaves. Started 4 days ago, slowly spreading upward. Around 2 acres affected.',
    riskLevel: 'MEDIUM',
    status: 'ACTIVE',
    latitude: 17.365,
    longitude: 78.506,
    imageUrl: '',
    createdAt: new Date(Date.now() - 18 * 3600000).toISOString(),
    user: { name: 'Priya Devi', village: 'Kavali', district: 'Nellore' },
  },
  {
    id: '3',
    cropType: 'Cotton',
    pestName: 'Whitefly',
    description: 'Noticed tiny white insects on the underside of leaves. Leaves turning yellow and sticky. Checked 5 plants — all affected. Not spreading fast yet.',
    riskLevel: 'LOW',
    status: 'RESOLVED',
    latitude: 17.425,
    longitude: 78.446,
    imageUrl: '',
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    user: { name: 'Suresh Reddy', village: 'Nandyal', district: 'Kurnool' },
  },
]

let reports = [...SEED_REPORTS]

export async function GET() {
  return NextResponse.json(reports)
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const newReport = {
      id: Date.now().toString(),
      cropType: body.cropType || 'Unknown',
      pestName: body.pestName || 'Unknown',
      description: body.description || '',
      riskLevel: body.riskLevel || 'MEDIUM',
      status: 'ACTIVE',
      latitude: body.latitude || 17.385,
      longitude: body.longitude || 78.486,
      imageUrl: body.imageUrl || '',
      createdAt: new Date().toISOString(),
      user: { name: 'You', village: 'Your Village', district: 'Your District' },
    }
    reports = [newReport, ...reports]
    return NextResponse.json({ ...newReport, farmersNotified: Math.floor(Math.random() * 4) + 1 }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
