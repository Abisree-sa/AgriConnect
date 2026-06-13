import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json([
    { id: '1', latitude: 17.395, longitude: 78.496, riskLevel: 'HIGH', cropType: 'Maize', pestName: 'Fall Armyworm', status: 'ACTIVE', user: { name: 'Ramesh Kumar', village: 'Rampur' } },
    { id: '2', latitude: 17.375, longitude: 78.476, riskLevel: 'HIGH', cropType: 'Cotton', pestName: 'Bollworm', status: 'ACTIVE', user: { name: 'Suresh Reddy', village: 'Nandyal' } },
    { id: '3', latitude: 17.365, longitude: 78.506, riskLevel: 'MEDIUM', cropType: 'Rice', pestName: 'Leaf Blight', status: 'ACTIVE', user: { name: 'Priya Devi', village: 'Kavali' } },
    { id: '4', latitude: 17.405, longitude: 78.466, riskLevel: 'MEDIUM', cropType: 'Tomato', pestName: 'Early Blight', status: 'ACTIVE', user: { name: 'Arjun Singh', village: 'Hapur' } },
    { id: '5', latitude: 17.415, longitude: 78.516, riskLevel: 'HIGH', cropType: 'Wheat', pestName: 'Rust Disease', status: 'ACTIVE', user: { name: 'Lakshmi Bai', village: 'Sangli' } },
    { id: '6', latitude: 17.345, longitude: 78.456, riskLevel: 'LOW', cropType: 'Groundnut', pestName: 'Leaf Spot', status: 'ACTIVE', user: { name: 'Kumar Swamy', village: 'Tirupati' } },
  ])
}
