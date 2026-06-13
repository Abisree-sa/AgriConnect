import { NextRequest, NextResponse } from 'next/server'
import { NEAREST_MANDIS, MANDI_BY_STATE } from '@/data/mandis'
import { generateDailyPrices, getSeasonalPriceRange, getDayVariation, applyDailyVariation } from '@/lib/mandi-utils'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const lat = parseFloat(searchParams.get('lat') || '17.385')
  const lng = parseFloat(searchParams.get('lng') || '78.486')
  const radius = parseInt(searchParams.get('radius') || '100')
  const crop = searchParams.get('crop') || null

  // Get nearby mandis within radius
  const nearbyMandis = NEAREST_MANDIS(lat, lng, radius)

  if (nearbyMandis.length === 0) {
    return NextResponse.json({
      location: { lat, lng },
      radius,
      mandis: [],
      message: 'No mandis found within this radius'
    })
  }

  // Generate prices for each mandi
  const mandisWithPrices = nearbyMandis.map(mandi => {
    // Get prices for requested crop or all major crops
    const crops = crop ? [crop] : (mandi.crops.slice(0, 3) || ['Maize', 'Cotton', 'Rice'])

    const topCrops = crops.map(cropName => {
      const baseRange = getSeasonalPriceRange(cropName, mandi.state)
      const dayVariation = getDayVariation(new Date(), cropName, mandi.state)
      const mandiVariation = ((Math.random() - 0.5) * 0.02)
      const totalVariation = dayVariation + mandiVariation

      const modal = applyDailyVariation(baseRange.modal, totalVariation)
      const min = applyDailyVariation(baseRange.min, totalVariation - 0.01)
      const max = applyDailyVariation(baseRange.max, totalVariation + 0.01)

      return {
        crop: cropName,
        modal: Math.round(modal),
        min: Math.round(min),
        max: Math.round(max),
        date: new Date().toLocaleDateString('en-IN')
      }
    })

    return {
      id: mandi.id,
      name: mandi.name,
      state: mandi.state,
      district: mandi.district,
      latitude: mandi.latitude,
      longitude: mandi.longitude,
      distance: Math.round(mandi.distance * 10) / 10,
      crops: mandi.crops,
      topCrops,
      contact: mandi.contact || 'Not available',
      hours: mandi.hours || '6:00 AM - 6:00 PM'
    }
  })

  return NextResponse.json({
    location: { lat, lng },
    radius,
    totalMandis: mandisWithPrices.length,
    searchDate: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
    mandis: mandisWithPrices,
    message: `Found ${mandisWithPrices.length} mandis within ${radius}km. Updated daily.`
  })
}
