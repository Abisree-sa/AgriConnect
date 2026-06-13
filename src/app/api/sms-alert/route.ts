import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { phone, farmerName, pestName, cropType, riskLevel, village } = await req.json()
    if (!phone) return NextResponse.json({ error: 'Phone number required' }, { status: 400 })

    const message = `AgriMind Alert: ${riskLevel} RISK - ${pestName} detected in ${cropType} near ${village}. Check AgriMind app for treatment advice. Reply STOP to unsubscribe.`

    const msg91Key = process.env.MSG91_API_KEY
    const msg91Sender = process.env.MSG91_SENDER_ID || 'AGRIND'

    if (msg91Key && msg91Key !== 'your-msg91-key') {
      const res = await fetch('https://api.msg91.com/api/v5/flow/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', authkey: msg91Key },
        body: JSON.stringify({
          template_id: process.env.MSG91_TEMPLATE_ID || '',
          sender: msg91Sender,
          mobiles: `91${phone.replace(/\D/g, '')}`,
          VAR1: farmerName,
          VAR2: pestName,
          VAR3: cropType,
          VAR4: village,
        }),
        signal: AbortSignal.timeout(8000),
      })
      const data = await res.json()
      if (data.type === 'success') {
        return NextResponse.json({ success: true, message: `SMS sent to ${phone}`, provider: 'msg91' })
      }
    }

    // Fallback: Twilio
    const twilioSid = process.env.TWILIO_ACCOUNT_SID
    const twilioToken = process.env.TWILIO_AUTH_TOKEN
    const twilioFrom = process.env.TWILIO_PHONE_NUMBER

    if (twilioSid && twilioToken && twilioFrom && twilioSid !== 'your-twilio-sid') {
      const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${Buffer.from(`${twilioSid}:${twilioToken}`).toString('base64')}`,
        },
        body: new URLSearchParams({ To: `+91${phone}`, From: twilioFrom, Body: message }),
        signal: AbortSignal.timeout(8000),
      })
      if (res.ok) {
        return NextResponse.json({ success: true, message: `SMS sent to ${phone}`, provider: 'twilio' })
      }
    }

    // Dev mode: log and return success
    console.log(`[SMS DEV] To: +91${phone} | Message: ${message}`)
    return NextResponse.json({ success: true, message: `SMS logged (configure MSG91_API_KEY or TWILIO for production)`, provider: 'dev', smsContent: message })

  } catch (err) {
    return NextResponse.json({ error: 'Failed to send SMS' }, { status: 500 })
  }
}
