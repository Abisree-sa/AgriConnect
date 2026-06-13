import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    farmers: 1240,
    activeReports: 5,
    totalReports: 8,
    simulations: 42,
    chatCount: 156,
    highRisk: 3,
  })
}
