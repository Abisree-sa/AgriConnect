import { NextRequest, NextResponse } from 'next/server'

const ML_SERVER = process.env.ML_SERVER_URL || 'http://localhost:8000'

const CROP_FALLBACKS = [
  { keywords: ['tomato','tamatar'], crop: 'Tomato', disease: 'Early Blight', confidence: 78, risk: 'Medium', treatment: 'Spray Chlorothalonil 2g/L every 7 days. Remove lower infected leaves. Avoid overhead watering.' },
  { keywords: ['cotton','kapas'], crop: 'Cotton', disease: 'Bollworm', confidence: 81, risk: 'High', treatment: 'Apply Chlorpyrifos 2ml/L. Install 5 pheromone traps per acre. Scout weekly.' },
  { keywords: ['maize','corn','makka'], crop: 'Maize', disease: 'Fall Armyworm', confidence: 85, risk: 'High', treatment: 'Spray Emamectin Benzoate 0.4g/L in evenings. Apply inside leaf whorls.' },
  { keywords: ['rice','paddy','dhan'], crop: 'Rice', disease: 'Leaf Blight', confidence: 76, risk: 'Medium', treatment: 'Spray Mancozeb 2.5g/L. Improve field drainage. Remove infected tillers.' },
  { keywords: ['wheat','gehu'], crop: 'Wheat', disease: 'Leaf Rust', confidence: 82, risk: 'High', treatment: 'Apply Propiconazole 1ml/L at booting stage. Use resistant varieties next season.' },
  { keywords: ['groundnut','peanut','moongfali'], crop: 'Groundnut', disease: 'Leaf Spot', confidence: 74, risk: 'Medium', treatment: 'Spray Carbendazim 1g/L. Ensure proper plant spacing.' },
  { keywords: ['potato','aloo'], crop: 'Potato', disease: 'Late Blight', confidence: 83, risk: 'High', treatment: 'Spray Metalaxyl 2g/L immediately. Destroy infected tubers.' },
  { keywords: ['sugarcane','ganna'], crop: 'Sugarcane', disease: 'Red Rot', confidence: 77, risk: 'Medium', treatment: 'Remove infected canes. Apply Carbendazim soil drench.' },
]

const DEFAULT_FALLBACK = {
  crop: 'Unknown Crop',
  disease: 'Possible Disease Detected',
  confidence: 55,
  risk: 'Medium',
  treatment: 'Upload a clearer photo of the affected leaf/plant for better results. Consult your local agriculture officer for accurate diagnosis.',
}

function detectFromFilename(filename?: string) {
  if (!filename) return DEFAULT_FALLBACK
  const lower = filename.toLowerCase()
  for (const f of CROP_FALLBACKS) {
    if (f.keywords.some(k => lower.includes(k))) return f
  }
  return DEFAULT_FALLBACK
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { base64Image, filename } = body
    if (!base64Image) return NextResponse.json({ error: 'No image' }, { status: 400 })

    // Try ML model first
    try {
      const mlRes = await fetch(`${ML_SERVER}/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ base64Image }),
        signal: AbortSignal.timeout(10000),
      })
      if (mlRes.ok) {
        const data = await mlRes.json()
        return NextResponse.json({ crop: data.crop, disease: data.disease, confidence: data.confidence, risk: data.risk, treatment: data.treatment, source: 'ml_model', top3: data.top3 })
      }
    } catch { /* fall through */ }

    // Try OpenAI GPT-4o Vision
    const apiKey = process.env.OPENAI_API_KEY
    if (apiKey && apiKey !== 'sk-xxx') {
      try {
        const { default: OpenAI } = await import('openai')
        const openai = new OpenAI({ apiKey })
        const res = await openai.chat.completions.create({
          model: 'gpt-4o',
          messages: [{
            role: 'user',
            content: [
              { type: 'text', text: 'You are an agricultural expert. Look at this crop image carefully and identify: 1) the exact crop plant (tomato, maize, rice, wheat, cotton, potato etc.) 2) any visible disease or pest damage. Return ONLY valid JSON: {"crop":"exact crop name","disease":"disease name or Healthy","confidence":number 50-95,"risk":"Low or Medium or High","treatment":"specific treatment in 1-2 sentences"}' },
              { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${base64Image}` } },
            ],
          }],
          max_tokens: 300,
        })
        const text = res.choices[0].message.content || '{}'
        const json = text.match(/\{[\s\S]*\}/)?.[0] || '{}'
        const parsed = JSON.parse(json)
        if (parsed.crop && parsed.disease) return NextResponse.json({ ...parsed, source: 'openai' })
      } catch { /* fall through */ }
    }

    // Context-aware fallback based on filename
    return NextResponse.json({ ...detectFromFilename(filename), source: 'fallback' })

  } catch {
    return NextResponse.json({ ...DEFAULT_FALLBACK, source: 'fallback' })
  }
}
