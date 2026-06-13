import { NextResponse } from 'next/server'

export async function POST() {
  return NextResponse.json({ id: 'mock-user', name: 'Demo Farmer', role: 'FARMER' }, { status: 201 })
}

export async function GET() {
  return NextResponse.json({ id: 'mock-user', name: 'Demo Farmer', role: 'FARMER' })
}
