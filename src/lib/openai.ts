import OpenAI from 'openai'

export const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function analyzeImage(base64Image: string): Promise<{
  crop: string; disease: string; confidence: number; risk: string; treatment: string
}> {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [{
      role: 'user',
      content: [
        {
          type: 'text',
          text: `Analyze this crop image. Return JSON only:
{"crop":"crop name","disease":"disease/pest name","confidence":0-100,"risk":"Low|Medium|High","treatment":"brief treatment advice"}`
        },
        { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${base64Image}` } }
      ]
    }],
    max_tokens: 300,
  })

  try {
    const text = response.choices[0].message.content || '{}'
    const json = text.match(/\{[\s\S]*\}/)?.[0] || '{}'
    return JSON.parse(json)
  } catch {
    return { crop: 'Unknown', disease: 'Unknown', confidence: 0, risk: 'Medium', treatment: 'Consult local agronomist.' }
  }
}

export async function chatWithAgri(question: string, language: string, history: {q:string,a:string}[]): Promise<string> {
  const langMap: Record<string,string> = { en:'English', ta:'Tamil', hi:'Hindi', te:'Telugu', kn:'Kannada' }
  const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
    {
      role: 'system',
      content: `You are AgriMind AI, an expert agricultural assistant for Indian farmers. 
Respond in ${langMap[language] || 'English'}. Be practical, concise, and use simple language.
Focus on: pest management, fertilizers, weather guidance, organic treatments, irrigation.
Always mention local context (Indian farming conditions).`
    },
    ...history.slice(-6).flatMap(h => ([
      { role: 'user' as const, content: h.q },
      { role: 'assistant' as const, content: h.a }
    ])),
    { role: 'user', content: question }
  ]

  const response = await openai.chat.completions.create({
    model: 'gpt-4o', messages, max_tokens: 500,
  })
  return response.choices[0].message.content || 'Sorry, I could not process your question.'
}

export async function simulateCrop(params: {
  farmSize: number; soilType: string; waterAvailability: string
  nitrogen: number; phosphorus: number; potassium: number
}): Promise<{ yieldPrediction: number; profitPrediction: number; riskScore: string; recommendations: string }> {
  const prompt = `Indian farm simulation:
Farm: ${params.farmSize} acres, Soil: ${params.soilType}, Water: ${params.waterAvailability}
N:${params.nitrogen} P:${params.phosphorus} K:${params.potassium} mg/kg

Return JSON only:
{"yieldPrediction":tons_per_acre,"profitPrediction":INR_total,"riskScore":"Low|Medium|High","recommendations":"2-3 specific actionable tips"}`

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 300,
  })

  try {
    const text = response.choices[0].message.content || '{}'
    const json = text.match(/\{[\s\S]*\}/)?.[0] || '{}'
    return JSON.parse(json)
  } catch {
    return { yieldPrediction: 3.5, profitPrediction: 200000, riskScore: 'Medium', recommendations: 'Optimize irrigation and apply balanced fertilizer.' }
  }
}
