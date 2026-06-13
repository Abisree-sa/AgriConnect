import { NextRequest, NextResponse } from 'next/server'

const ML_SERVER = process.env.ML_SERVER_URL || 'http://localhost:8000'

// Crop recommendation matrix based on farmer-friendly inputs
const CROP_MATRIX: Record<string, Record<string, { crops: string[]; yields: Record<string, number>; profits: Record<string, number> }>> = {
  Kharif: {
    High:   { crops: ['Rice','Maize','Cotton','Sugarcane'],    yields: { Rice: 4.5, Maize: 5.0, Cotton: 2.2, Sugarcane: 35 },   profits: { Rice: 81000, Maize: 60000, Cotton: 121000, Sugarcane: 122500 } },
    Medium: { crops: ['Maize','Groundnut','Turmeric','Cotton'], yields: { Maize: 4.2, Groundnut: 1.8, Turmeric: 5.5, Cotton: 1.8 }, profits: { Maize: 50400, Groundnut: 81000, Turmeric: 440000, Cotton: 99000 } },
    Low:    { crops: ['Groundnut','Maize','Turmeric'],          yields: { Groundnut: 1.4, Maize: 3.2, Turmeric: 4.0 },             profits: { Groundnut: 63000, Maize: 38400, Turmeric: 320000 } },
  },
  Rabi: {
    High:   { crops: ['Wheat','Tomato','Sugarcane'],  yields: { Wheat: 4.8, Tomato: 18, Sugarcane: 32 },   profits: { Wheat: 96000, Tomato: 450000, Sugarcane: 112000 } },
    Medium: { crops: ['Wheat','Tomato','Groundnut'],  yields: { Wheat: 4.0, Tomato: 14, Groundnut: 1.6 },  profits: { Wheat: 80000, Tomato: 350000, Groundnut: 72000 } },
    Low:    { crops: ['Wheat','Groundnut'],           yields: { Wheat: 3.0, Groundnut: 1.2 },               profits: { Wheat: 60000, Groundnut: 54000 } },
  },
  Zaid: {
    High:   { crops: ['Tomato','Rice','Sugarcane'],   yields: { Tomato: 16, Rice: 3.8, Sugarcane: 30 },     profits: { Tomato: 400000, Rice: 68400, Sugarcane: 105000 } },
    Medium: { crops: ['Tomato','Maize'],              yields: { Tomato: 12, Maize: 3.5 },                    profits: { Tomato: 300000, Maize: 42000 } },
    Low:    { crops: ['Maize','Groundnut'],           yields: { Maize: 2.8, Groundnut: 1.0 },               profits: { Maize: 33600, Groundnut: 45000 } },
  },
}

const RISK_REASONS: Record<string, string> = {
  Rice: 'Needs high water. Good for canal/river farms.',
  Maize: 'Versatile. Works in most soils and seasons.',
  Cotton: 'High profit but needs pest monitoring.',
  Sugarcane: 'Long crop (12mo). Very high yield.',
  Wheat: 'Reliable Rabi crop. Easy to manage.',
  Tomato: 'High profit but needs care and water.',
  Groundnut: 'Drought tolerant. Good for light soil.',
  Turmeric: 'Highest profit/acre. 9-month crop.',
}

// Map farmer-friendly answers to NPK estimates
function estimateNPK(soilType: string, lastCrop: string, hasOrganicManure: string) {
  const base: Record<string, { n: number; p: number; k: number }> = {
    Loamy: { n: 65, p: 55, k: 60 },
    Silty: { n: 55, p: 50, k: 55 },
    Clay:  { n: 45, p: 40, k: 50 },
    Sandy: { n: 30, p: 25, k: 35 },
  }
  let { n, p, k } = base[soilType] || base.Loamy
  // Legume last crop boosts nitrogen
  if (['Groundnut'].includes(lastCrop)) n = Math.min(n + 15, 100)
  // Organic manure boosts all
  if (hasOrganicManure === 'yes') { n = Math.min(n + 10, 100); p = Math.min(p + 8, 100); k = Math.min(k + 8, 100) }
  // Sugarcane depletes heavily
  if (lastCrop === 'Sugarcane') { n -= 15; p -= 10; k -= 10 }
  return { nitrogen: n, phosphorus: p, potassium: k }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { farmSize, soilType, waterAvailability, season = 'Kharif', lastCrop = 'Fallow (nothing)', hasOrganicManure = 'yes' } = body

    // Estimate NPK from farmer-friendly inputs
    const { nitrogen, phosphorus, potassium } = estimateNPK(soilType, lastCrop, hasOrganicManure)

    // Try ML server first
    try {
      const mlRes = await fetch(`${ML_SERVER}/predict/yield`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ farmSize, soilType, waterAvailability, nitrogen, phosphorus, potassium, cropType: 'Maize', season, temperature: 28, rainfall: 800 }),
        signal: AbortSignal.timeout(5000),
      })
      if (mlRes.ok) {
        const data = await mlRes.json()
        return NextResponse.json({ ...data, nitrogen, phosphorus, potassium })
      }
    } catch { /* fallback below */ }

    // Build crop recommendation from matrix
    const seasonData = CROP_MATRIX[season] || CROP_MATRIX.Kharif
    const waterKey = waterAvailability === 'High' ? 'High' : waterAvailability === 'Low' ? 'Low' : 'Medium'
    const matrixEntry = seasonData[waterKey]
    const crops = matrixEntry.crops

    // Score each crop
    const baseYield = soilType === 'Loamy' ? 1.15 : soilType === 'Silty' ? 1.05 : soilType === 'Clay' ? 0.95 : 0.82
    const manureBoost = hasOrganicManure === 'yes' ? 1.08 : 1.0
    const rotationBoost = (c: string) => c !== lastCrop ? 1.05 : 0.95

    const cropOptions = crops.map((crop, i) => {
      const yieldBase = (matrixEntry.yields[crop] || 4) * baseYield * manureBoost * rotationBoost(crop)
      const profitTotal = Math.round((matrixEntry.profits[crop] || 50000) * baseYield * manureBoost * rotationBoost(crop) * farmSize)
      const risk = i === 0 && waterAvailability === 'High' ? 'Low' : i === 0 ? 'Medium' : waterAvailability === 'Low' ? 'High' : 'Medium'
      return {
        crop,
        profit: `₹${(profitTotal / 1000).toFixed(0)}K`,
        risk,
        reason: RISK_REASONS[crop] || 'Good option for your conditions.',
      }
    })

    const best = cropOptions[0]
    const bestYield = (matrixEntry.yields[best.crop] || 4) * baseYield * manureBoost
    const bestProfit = Math.round((matrixEntry.profits[best.crop] || 50000) * baseYield * manureBoost * farmSize)
    const nutrientScore = (nitrogen + phosphorus + potassium) / 300
    const riskScore = nutrientScore > 0.55 && waterAvailability !== 'Low' ? 'Low' : nutrientScore > 0.35 ? 'Medium' : 'High'

    // Advice
    const advices = []
    if (lastCrop === best.crop) advices.push(`Avoid ${best.crop} again — rotate to prevent soil depletion.`)
    if (hasOrganicManure === 'no') advices.push('Add compost or FYM (5 tons/acre) before sowing to improve soil health.')
    if (waterAvailability === 'Low') advices.push('Consider drip irrigation to reduce water use by 40%.')
    if (soilType === 'Sandy') advices.push('Sandy soil needs organic matter — mix in compost before planting.')
    advices.push(`${best.crop} grows well in ${season} season in ${soilType.toLowerCase()} soil with your water source.`)

    return NextResponse.json({
      yieldPrediction: parseFloat(bestYield.toFixed(1)),
      profitPrediction: bestProfit,
      riskScore,
      bestCrop: best.crop,
      cropOptions,
      recommendations: advices.join(' '),
      modelSource: 'crop-matrix',
    })
  } catch {
    return NextResponse.json({
      yieldPrediction: 4.8, profitPrediction: 325000, riskScore: 'Low',
      bestCrop: 'Maize',
      recommendations: 'Maize is a safe choice for most Indian farms. Apply balanced fertilizer and ensure regular watering.',
      modelSource: 'fallback',
    })
  }
}
