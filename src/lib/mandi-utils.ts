// Utility functions for market data and price calculations

// Generate deterministic daily variation using date as seed
export function getDayVariation(date: Date, crop: string, state: string): number {
  // Use date + crop + state hash for consistent daily variation
  const day = date.getDate()
  const month = date.getMonth()
  const year = date.getFullYear() % 10
  const seed = (day + month * 31 + year * 365 + hashString(crop + state)) % 7

  // Returns variation between -0.03 to +0.03 (±3%)
  return (seed - 3) * 0.01
}

function hashString(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32bit integer
  }
  return Math.abs(hash)
}

// Apply daily variation to base prices
export function applyDailyVariation(basePrice: number, variation: number, volatility: number = 0.02): number {
  // Add small random component to variation for realism
  const randomFactor = (Math.random() - 0.5) * volatility
  const adjustedPrice = basePrice * (1 + variation + randomFactor)
  return Math.round(adjustedPrice)
}

// Generate 7-day price trend
export function generatePriceTrend(basePrice: number, crop: string, state: string): Array<{ date: string; price: number }> {
  const trend = []
  const today = new Date()

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today.getTime() - i * 86400000)
    const variation = getDayVariation(date, crop, state)
    const price = applyDailyVariation(basePrice, variation)

    trend.push({
      date: date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
      price
    })
  }

  return trend
}

// Calculate MSP comparison advice
export function getMSPAdvice(avgPrice: number, msp: number, crop: string): string {
  if (msp === 0) return `📊 Prices are ₹${avgPrice}/qtl. Monitor for best selling opportunity.`

  if (avgPrice < msp) {
    const diff = msp - avgPrice
    return `⚠️ Market price ₹${avgPrice}/qtl is ₹${diff} below MSP ₹${msp}/qtl. Consider government procurement centres for guaranteed MSP.`
  }

  if (avgPrice > msp * 1.15) {
    const percent = Math.round(((avgPrice / msp) - 1) * 100)
    return `📈 Excellent! Prices are ${percent}% above MSP. Visit nearby mandis immediately to sell ${crop}.`
  }

  const percent = Math.round(((avgPrice / msp) - 1) * 100)
  return `📊 Prices are ${percent > 0 ? '+' + percent : percent}% vs MSP. Prices are stable—check again in 2-3 days for peak rates.`
}

// Generate realistic crop-specific price ranges by season
export function getSeasonalPriceRange(crop: string, state: string): { modal: number; min: number; max: number } {
  // Realistic price ranges based on crop and state (in ₹/quintal)
  const priceMap: Record<string, Record<string, { modal: number; min: number; max: number }>> = {
    'Maize': {
      'default': { modal: 2100, min: 1900, max: 2300 },
      'Telangana': { modal: 2200, min: 2100, max: 2350 },
      'Andhra Pradesh': { modal: 2180, min: 2050, max: 2300 },
      'Karnataka': { modal: 2100, min: 1980, max: 2220 },
      'Maharashtra': { modal: 2050, min: 1950, max: 2200 }
    },
    'Cotton': {
      'default': { modal: 7200, min: 6800, max: 7600 },
      'Telangana': { modal: 7100, min: 6700, max: 7500 },
      'Maharashtra': { modal: 7350, min: 7000, max: 7700 },
      'Karnataka': { modal: 7200, min: 6800, max: 7600 }
    },
    'Rice': {
      'default': { modal: 2400, min: 2200, max: 2600 },
      'Telangana': { modal: 2500, min: 2250, max: 2700 },
      'Andhra Pradesh': { modal: 2450, min: 2200, max: 2650 },
      'Tamil Nadu': { modal: 2600, min: 2350, max: 2800 }
    },
    'Wheat': {
      'default': { modal: 2300, min: 2200, max: 2450 },
      'Uttar Pradesh': { modal: 2310, min: 2200, max: 2440 },
      'Punjab': { modal: 2350, min: 2240, max: 2480 },
      'Rajasthan': { modal: 2280, min: 2170, max: 2410 }
    },
    'Tomato': {
      'default': { modal: 1500, min: 800, max: 2800 },
      'Maharashtra': { modal: 1800, min: 900, max: 3200 },
      'Karnataka': { modal: 1500, min: 700, max: 2800 },
      'Telangana': { modal: 1100, min: 500, max: 2200 }
    },
    'Groundnut': {
      'default': { modal: 5700, min: 5300, max: 6200 },
      'Andhra Pradesh': { modal: 5650, min: 5200, max: 6100 },
      'Gujarat': { modal: 5900, min: 5500, max: 6400 },
      'Karnataka': { modal: 5800, min: 5400, max: 6250 }
    },
    'Sugarcane': {
      'default': { modal: 340, min: 320, max: 360 },
      'Uttar Pradesh': { modal: 360, min: 340, max: 380 },
      'Maharashtra': { modal: 350, min: 330, max: 370 }
    },
    'Turmeric': {
      'default': { modal: 11500, min: 9500, max: 13500 },
      'Telangana': { modal: 11200, min: 9200, max: 13200 },
      'Karnataka': { modal: 12000, min: 10000, max: 14000 }
    },
    'Onion': {
      'default': { modal: 1200, min: 600, max: 2200 },
      'Maharashtra': { modal: 1450, min: 800, max: 2600 },
      'Gujarat': { modal: 1300, min: 700, max: 2400 }
    },
    'Potato': {
      'default': { modal: 950, min: 650, max: 1500 },
      'Uttar Pradesh': { modal: 950, min: 650, max: 1500 },
      'Bihar': { modal: 1000, min: 700, max: 1600 }
    }
  }

  const cropPrices = priceMap[crop] || priceMap['Maize']
  return cropPrices[state] || cropPrices['default']
}

// Normalize prices with realistic daily variation
export function generateDailyPrices(
  cropName: string,
  state: string,
  mandis: string[],
  msp: number = 0
): Array<{
  mandi: string
  min: number
  max: number
  modal: number
  change: number
  date: string
}> {
  const baseRange = getSeasonalPriceRange(cropName, state)
  const dayVariation = getDayVariation(new Date(), cropName, state)
  const prevDayVariation = getDayVariation(new Date(Date.now() - 86400000), cropName, state)

  return mandis.map((mandi, i) => {
    // Add slight variation per mandi location
    const mandiVariation = ((i - mandis.length / 2) * 0.005)
    const totalVariation = dayVariation + mandiVariation

    const modal = applyDailyVariation(baseRange.modal, totalVariation)
    const min = applyDailyVariation(baseRange.min, totalVariation - 0.01)
    const max = applyDailyVariation(baseRange.max, totalVariation + 0.01)

    const prevModal = applyDailyVariation(baseRange.modal, prevDayVariation + mandiVariation)
    const change = modal - prevModal

    return {
      mandi,
      district: mandi,
      min: Math.max(min, 100),
      max: Math.max(max, min + 50),
      modal: Math.max(modal, 150),
      change,
      date: new Date().toLocaleDateString('en-IN')
    }
  })
}
