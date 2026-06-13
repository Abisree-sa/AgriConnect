import { NextRequest, NextResponse } from 'next/server'

// WMO weather code → description + emoji (standard codes)
function decodeWMO(code: number): { desc: string; icon: string } {
  if (code === 0)              return { desc: 'Clear Sky',             icon: '☀️' }
  if (code <= 2)               return { desc: 'Partly Cloudy',         icon: '⛅' }
  if (code === 3)              return { desc: 'Overcast',              icon: '☁️' }
  if (code <= 49)              return { desc: 'Foggy / Hazy',          icon: '🌫️' }
  if (code <= 57)              return { desc: 'Drizzle',               icon: '🌦️' }
  if (code <= 67)              return { desc: 'Rain',                  icon: '🌧️' }
  if (code <= 77)              return { desc: 'Snow / Sleet',          icon: '❄️' }
  if (code <= 82)              return { desc: 'Rain Showers',          icon: '🌦️' }
  if (code <= 84)              return { desc: 'Heavy Showers',         icon: '🌧️' }
  if (code <= 94)              return { desc: 'Thunderstorm',          icon: '⛈️' }
  return                              { desc: 'Thunderstorm + Hail',   icon: '⛈️' }
}

function farmAdvice(temp: number, humidity: number, rain_mm: number, wind_kmh: number): string {
  if (rain_mm > 10) return '🌧️ Heavy rain today. Do not spray any pesticides or fertilizers. Check field drainage immediately.'
  if (rain_mm > 2)  return '🌦️ Light rain expected. Avoid spraying. Good time to transplant seedlings.'
  if (wind_kmh > 30)return '💨 Strong winds. Do NOT spray pesticides — drift will waste chemicals and harm nearby crops.'
  if (temp > 40)    return '🌡️ Extreme heat. Irrigate before 7am or after 6pm. Avoid transplanting and heavy field work.'
  if (temp > 36)    return '☀️ Hot day. Water stress likely — check soil moisture. Mulch to retain moisture.'
  if (humidity > 88)return '💧 Very high humidity. High risk of fungal diseases (blight, mold). Inspect crops daily.'
  if (humidity > 75)return '🌿 Moderate humidity. Watch for early signs of blight or rust on leaves.'
  return '✅ Good weather for farm operations. Ideal for spraying, sowing, or field work.'
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const lat = parseFloat(searchParams.get('lat') || '17.385')
  const lng = parseFloat(searchParams.get('lng') || '78.486')

  try {
    // Open-Meteo: completely free, no API key, real WMO forecast data
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}` +
      `&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,visibility` +
      `&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,relative_humidity_2m_max,sunrise,sunset` +
      `&timezone=Asia%2FKolkata&forecast_days=6`

    const res = await fetch(url, { signal: AbortSignal.timeout(8000), next: { revalidate: 1800 } })
    if (!res.ok) throw new Error('Open-Meteo failed')
    const d = await res.json()

    const c = d.current
    const curr = decodeWMO(c.weather_code)
    const wind_kmh = Math.round(c.wind_speed_10m * 3.6)

    const forecast = d.daily.time.slice(0, 6).map((date: string, i: number) => {
      const w = decodeWMO(d.daily.weather_code[i])
      return {
        date: new Date(date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' }),
        temp_max: Math.round(d.daily.temperature_2m_max[i]),
        temp_min: Math.round(d.daily.temperature_2m_min[i]),
        description: w.desc,
        icon: w.icon,
        humidity: d.daily.relative_humidity_2m_max[i],
        rain_mm: Math.round((d.daily.precipitation_sum[i] || 0) * 10) / 10,
        sunrise: d.daily.sunrise[i]?.split('T')[1]?.slice(0, 5) || '',
        sunset: d.daily.sunset[i]?.split('T')[1]?.slice(0, 5) || '',
      }
    })

    return NextResponse.json({
      current: {
        temp: Math.round(c.temperature_2m),
        feels_like: Math.round(c.apparent_temperature),
        humidity: c.relative_humidity_2m,
        description: curr.desc,
        icon: curr.icon,
        wind_speed: wind_kmh,
        visibility: Math.round((c.visibility || 10000) / 1000),
        rain_mm: c.precipitation || 0,
        sunrise: forecast[0]?.sunrise || '',
        sunset: forecast[0]?.sunset || '',
      },
      forecast,
      farmAdvice: farmAdvice(c.temperature_2m, c.relative_humidity_2m, c.precipitation || 0, wind_kmh),
      source: 'open-meteo',
      updated: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    })
  } catch (err) {
    // Hard fallback — season-based estimate
    const m = new Date().getMonth()
    const monsoon = m >= 5 && m <= 9
    const summer  = m >= 2 && m <= 5
    const temp    = summer ? 37 : monsoon ? 29 : 24
    const hum     = monsoon ? 82 : summer ? 44 : 58
    const w       = monsoon ? { desc: 'Rain Showers', icon: '🌧️' } : summer ? { desc: 'Clear Sky', icon: '☀️' } : { desc: 'Partly Cloudy', icon: '⛅' }
    return NextResponse.json({
      current: { temp, feels_like: temp + 2, humidity: hum, description: w.desc, icon: w.icon, wind_speed: 14, visibility: 8, rain_mm: monsoon ? 5 : 0, sunrise: '06:10', sunset: '18:30' },
      forecast: [0,1,2,3,4,5].map(i => ({ date: new Date(Date.now() + i * 86400000).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' }), temp_max: temp + 2, temp_min: temp - 7, description: w.desc, icon: w.icon, humidity: hum, rain_mm: monsoon ? 3 : 0, sunrise: '06:10', sunset: '18:30' })),
      farmAdvice: farmAdvice(temp, hum, monsoon ? 5 : 0, 14),
      source: 'fallback',
      updated: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    })
  }
}
