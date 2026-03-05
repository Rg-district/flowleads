import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, phone, type, location, budget } = body

    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 })
    }

    const { error } = await supabaseAdmin
      .from('lead_requests')
      .insert({ name, email, phone: phone || null, lead_type: type || null, location: location || null, budget: budget || null })

    if (error) {
      console.error('Lead request insert error:', error)
      return NextResponse.json({ error: 'Failed to submit request' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Request handler error:', err)
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
