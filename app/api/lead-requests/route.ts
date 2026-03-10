import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { resend } from '@/lib/resend'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, phone, type, location, budget } = body
    
    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 })
    }
    
    const supabase = createServerClient()
    
    const { data, error } = await supabase
      .from('lead_requests')
      .insert({
        name,
        email,
        phone: phone || null,
        lead_type: type || null,
        location: location || null,
        budget: budget || null,
        status: 'new'
      })
      .select()
      .single()
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    // Send notification email to admin
    try {
      await resend.emails.send({
        from: 'FlowLeads <leads@arkaihq.com>',
        to: 'avyon@arkaihq.co.uk',
        subject: `New Lead Request: ${type || 'General'}`,
        html: `
          <h2>New Lead Request</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
          <p><strong>Looking for:</strong> ${type || 'Not specified'}</p>
          <p><strong>Location:</strong> ${location || 'Not specified'}</p>
          <p><strong>Budget:</strong> ${budget || 'Not specified'}</p>
        `
      })
    } catch (emailError) {
      console.error('Failed to send admin notification:', emailError)
    }
    
    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
