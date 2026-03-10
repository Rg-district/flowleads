import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createServerClient } from '@/lib/supabase'
import { resend } from '@/lib/resend'
import Stripe from 'stripe'

export async function POST(request: Request) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')
  
  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 })
  }
  
  let event: Stripe.Event
  
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message)
    return NextResponse.json({ error: err.message }, { status: 400 })
  }
  
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const { purchaseId, leadId } = session.metadata || {}
    
    if (!purchaseId || !leadId) {
      console.error('Missing metadata in session')
      return NextResponse.json({ error: 'Missing metadata' }, { status: 400 })
    }
    
    const supabase = createServerClient()
    
    // Update purchase status
    const { error: purchaseError } = await supabase
      .from('lead_purchases')
      .update({
        status: 'completed',
        stripe_payment_id: session.payment_intent as string
      })
      .eq('id', purchaseId)
    
    if (purchaseError) {
      console.error('Failed to update purchase:', purchaseError)
    }
    
    // Mark lead as sold
    const { error: leadError } = await supabase
      .from('leads')
      .update({ status: 'sold' })
      .eq('id', leadId)
    
    if (leadError) {
      console.error('Failed to update lead:', leadError)
    }
    
    // Get full lead and purchase data for email
    const { data: lead } = await supabase
      .from('leads')
      .select('*')
      .eq('id', leadId)
      .single()
    
    const { data: purchase } = await supabase
      .from('lead_purchases')
      .select('*')
      .eq('id', purchaseId)
      .single()
    
    if (lead && purchase) {
      // Send email with lead details
      try {
        await resend.emails.send({
          from: 'FlowLeads <leads@arkaihq.com>',
          to: purchase.buyer_email,
          subject: `Your Lead: ${lead.title}`,
          html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
              <div style="text-align: center; margin-bottom: 32px;">
                <div style="display: inline-flex; align-items: center; gap: 8px;">
                  <div style="width: 10px; height: 10px; background: #16a34a; border-radius: 50%;"></div>
                  <span style="font-weight: 800; font-size: 20px;">FlowLeads</span>
                </div>
              </div>
              
              <h1 style="font-size: 24px; font-weight: 700; margin-bottom: 8px;">Your Lead Details</h1>
              <p style="color: #666; margin-bottom: 32px;">Thank you for your purchase! Here are the full details of your lead.</p>
              
              <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
                <div style="margin-bottom: 20px;">
                  <div style="font-size: 12px; text-transform: uppercase; color: #9ca3af; font-weight: 600; margin-bottom: 4px;">Lead Type</div>
                  <div style="font-size: 16px; font-weight: 600;">${lead.category}</div>
                </div>
                
                <div style="margin-bottom: 20px;">
                  <div style="font-size: 12px; text-transform: uppercase; color: #9ca3af; font-weight: 600; margin-bottom: 4px;">Title</div>
                  <div style="font-size: 16px; font-weight: 600;">${lead.title}</div>
                </div>
                
                ${lead.detail ? `
                <div style="margin-bottom: 20px;">
                  <div style="font-size: 12px; text-transform: uppercase; color: #9ca3af; font-weight: 600; margin-bottom: 4px;">Details</div>
                  <div style="font-size: 14px;">${lead.detail}</div>
                </div>
                ` : ''}
                
                <div style="margin-bottom: 20px;">
                  <div style="font-size: 12px; text-transform: uppercase; color: #9ca3af; font-weight: 600; margin-bottom: 4px;">Location</div>
                  <div style="font-size: 14px;">${lead.location || 'UK'}</div>
                </div>
                
                ${lead.budget_min || lead.budget_max ? `
                <div style="margin-bottom: 20px;">
                  <div style="font-size: 12px; text-transform: uppercase; color: #9ca3af; font-weight: 600; margin-bottom: 4px;">Budget</div>
                  <div style="font-size: 14px;">£${lead.budget_min?.toLocaleString() || '0'} – £${lead.budget_max?.toLocaleString() || 'N/A'}</div>
                </div>
                ` : ''}
              </div>
              
              <div style="background: #111; color: #fff; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
                <h2 style="font-size: 16px; font-weight: 700; margin-bottom: 16px; color: #16a34a;">Contact Information</h2>
                
                <div style="margin-bottom: 16px;">
                  <div style="font-size: 12px; text-transform: uppercase; color: #9ca3af; font-weight: 600; margin-bottom: 4px;">Name</div>
                  <div style="font-size: 18px; font-weight: 600;">${lead.contact_name || 'Not provided'}</div>
                </div>
                
                <div style="margin-bottom: 16px;">
                  <div style="font-size: 12px; text-transform: uppercase; color: #9ca3af; font-weight: 600; margin-bottom: 4px;">Phone</div>
                  <div style="font-size: 18px; font-weight: 600;">${lead.contact_phone || 'Not provided'}</div>
                </div>
                
                <div>
                  <div style="font-size: 12px; text-transform: uppercase; color: #9ca3af; font-weight: 600; margin-bottom: 4px;">Email</div>
                  <div style="font-size: 18px; font-weight: 600;">${lead.contact_email || 'Not provided'}</div>
                </div>
              </div>
              
              <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
                <p style="margin: 0; font-size: 14px; color: #166534;">
                  <strong>Tip:</strong> Contact this lead within 24 hours for the best results. They're expecting to hear from businesses like yours.
                </p>
              </div>
              
              <p style="font-size: 12px; color: #9ca3af; text-align: center;">
                This lead is exclusive to you and won't be sold to anyone else.<br/>
                © 2026 FlowLeads · flowleadshq.com
              </p>
            </div>
          `,
        })
      } catch (emailError) {
        console.error('Failed to send email:', emailError)
      }
    }
  }
  
  return NextResponse.json({ received: true })
}
