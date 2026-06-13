import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const FARMERS = [
  { name: 'Ramesh Kumar', village: 'Rampur', district: 'Guntur', state: 'Andhra Pradesh', lat: 16.307, lng: 80.436 },
  { name: 'Suresh Reddy', village: 'Nandyal', district: 'Kurnool', state: 'Andhra Pradesh', lat: 15.478, lng: 78.484 },
  { name: 'Priya Devi', village: 'Kavali', district: 'Nellore', state: 'Andhra Pradesh', lat: 14.916, lng: 79.994 },
  { name: 'Arjun Singh', village: 'Hapur', district: 'Hapur', state: 'Uttar Pradesh', lat: 28.729, lng: 77.775 },
  { name: 'Lakshmi Bai', village: 'Sangli', district: 'Sangli', state: 'Maharashtra', lat: 16.856, lng: 74.564 },
  { name: 'Vijay Patil', village: 'Kolhapur', district: 'Kolhapur', state: 'Maharashtra', lat: 16.705, lng: 74.243 },
]

const REPORTS = [
  { cropType: 'Maize', pestName: 'Fall Armyworm', description: 'Leaves have strange marks and holes. Spotted worms inside rolled leaves.', riskLevel: 'HIGH', lat: 17.395, lng: 78.496 },
  { cropType: 'Cotton', pestName: 'Bollworm', description: 'Cotton bolls are damaged. Small holes visible on green bolls.', riskLevel: 'HIGH', lat: 17.375, lng: 78.476 },
  { cropType: 'Rice', pestName: 'Leaf Blight', description: 'Yellow-brown lesions on rice leaves. Spreading fast in humid conditions.', riskLevel: 'MEDIUM', lat: 17.365, lng: 78.506 },
  { cropType: 'Tomato', pestName: 'Early Blight', description: 'Dark spots with yellow rings on lower leaves. Some fruits affected.', riskLevel: 'MEDIUM', lat: 17.405, lng: 78.466 },
  { cropType: 'Wheat', pestName: 'Rust Disease', description: 'Orange-red pustules on wheat leaves. Rapid spread noticed.', riskLevel: 'HIGH', lat: 17.415, lng: 78.516 },
  { cropType: 'Sugarcane', pestName: 'Red Rot', description: 'Red discoloration inside stalks. Foul smell from infected canes.', riskLevel: 'MEDIUM', lat: 17.345, lng: 78.456 },
  { cropType: 'Groundnut', pestName: 'Leaf Spot', description: 'Circular brown spots on groundnut leaves. Defoliation starting.', riskLevel: 'LOW', lat: 17.355, lng: 78.486 },
  { cropType: 'Cotton', pestName: 'Whitefly', description: 'White insects on leaf undersides. Sticky residue visible.', riskLevel: 'LOW', lat: 17.425, lng: 78.446 },
]

async function main() {
  console.log('🌱 Seeding AgriMind database...')

  await prisma.communityAlert.deleteMany()
  await prisma.chatHistory.deleteMany()
  await prisma.simulation.deleteMany()
  await prisma.pestReport.deleteMany()
  await prisma.user.deleteMany()

  const users = await Promise.all(
    FARMERS.map((f, i) =>
      prisma.user.create({
        data: {
          clerkId: `seed_user_${i + 1}`,
          name: f.name,
          village: f.village,
          district: f.district,
          state: f.state,
          latitude: f.lat,
          longitude: f.lng,
          role: 'FARMER',
        },
      })
    )
  )

  const admin = await prisma.user.create({
    data: {
      clerkId: 'seed_admin_1',
      name: 'AgriMind Admin',
      village: 'Hyderabad',
      district: 'Hyderabad',
      state: 'Telangana',
      latitude: 17.385,
      longitude: 78.486,
      role: 'ADMIN',
    },
  })

  const reports = await Promise.all(
    REPORTS.map((r, i) =>
      prisma.pestReport.create({
        data: {
          userId: users[i % users.length].id,
          cropType: r.cropType,
          pestName: r.pestName,
          description: r.description,
          riskLevel: r.riskLevel as any,
          latitude: r.lat,
          longitude: r.lng,
          status: i < 5 ? 'ACTIVE' : 'RESOLVED' as any,
        },
      })
    )
  )

  await Promise.all(
    reports.slice(0, 5).map(r =>
      prisma.communityAlert.create({
        data: {
          reportId: r.id,
          userId: users[0].id,
          affectedRadius: 5,
          farmerCountNotified: Math.floor(Math.random() * 8) + 2,
        },
      })
    )
  )

  await prisma.simulation.create({
    data: {
      userId: users[0].id,
      farmSize: 12,
      soilType: 'Loamy',
      waterAvailability: 'Medium',
      nitrogen: 65,
      phosphorus: 45,
      potassium: 50,
      yieldPrediction: 4.8,
      profitPrediction: 325000,
      riskScore: 'Low',
      recommendations: 'Apply balanced NPK. Consider drip irrigation.',
    },
  })

  await prisma.chatHistory.create({
    data: {
      userId: users[0].id,
      question: 'How to treat Fall Armyworm organically?',
      response: 'Apply neem oil (5ml/L) every 7 days. Use Beauveria bassiana biopesticide. Install pheromone traps at 5/acre.',
      language: 'en',
    },
  })

  console.log(`✅ Seeded: ${users.length + 1} users, ${reports.length} reports, 5 alerts`)
}

main().catch(console.error).finally(() => prisma.$disconnect())
