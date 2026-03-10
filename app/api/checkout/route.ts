import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createServerClient } from '@/lib/supabase'

export async function POST(request: Request) {
  try {
    const { leadId, buyerName, buyerEmail, buyerPhone, buyerCompany } = await request.json()
    
    if (!leadId || !buyerName || !buyerEmail) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    
    const supabase = createServerClient()
    
    // Get the lead
    const { data: lead, error: leadError } = await supabase
      .from('leads')
      .select('*')
      .eq('id', leadId)
      .eq('status', 'available')
      .single()
    
    if (leadError || !lead) {
      return NextResponse.json({ error: 'Lead not found or already sold' }, { status: 404 })
    }
    
    // Create pending purchase record
    const { data: purchase, error: purchaseError } = await supabase
      .from('lead_purchases')
      .insert({
        lead_id: leadId,
        buyer_name: buyerName,
        buyer_email: buyerEmail,
        buyer_phone: buyerPhone || null,
        buyer_company: buyerCompany || null,
        amount_paid: lead.price,
        status: 'pending'
      })
      .select()
      .single()
    
    if (purchaseError) {
      return NextResponse.json({ error: purchaseError.message }, { status: 500 })
    }
    
    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: buyerEmail,
      line_items: [
        {
          price_data: {
            currency: 'gbp',
            product_data: {
              name: `Lead: ${lead.title}`,
              description: `${lead.category} lead in ${lead.location || 'UK'}`,
            },
            unit_amount: lead.price * 100, // Stripe uses pence
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/?canceled=true`,
      metadata: {
        purchaseId: purchase.id,
        leadId: leadId,
      },
    })
    
    return NextResponse.json({ sessionId: session.id, url: session.url })
  } catch (error: any) {
    console.error('Checkout error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
