'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function SuccessContent() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')

  return (
    <div style={{ fontFamily: 'Inter, -apple-system, sans-serif', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fafaf8' }}>
      <div style={{ maxWidth: 480, padding: 40, textAlign: 'center' }}>
        <div style={{ width: 80, height: 80, background: '#16a34a', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', fontSize: 40 }}>
          ✓
        </div>
        <h1 style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-1px', marginBottom: 12 }}>Payment Successful!</h1>
        <p style={{ fontSize: 16, color: '#666', lineHeight: 1.6, marginBottom: 32 }}>
          Thank you for your purchase. The full lead details have been sent to your email. Check your inbox (and spam folder) for the contact information.
        </p>
        <div style={{ background: '#fff', border: '1px solid #e0e0dc', borderRadius: 12, padding: 20, marginBottom: 24 }}>
          <div style={{ fontSize: 12, color: '#999', marginBottom: 8 }}>What happens next?</div>
          <ul style={{ textAlign: 'left', fontSize: 14, color: '#444', lineHeight: 1.8, paddingLeft: 20, margin: 0 }}>
            <li>Lead details sent to your email</li>
            <li>Contact the lead within 24 hours</li>
            <li>This lead is exclusive to you only</li>
          </ul>
        </div>
        <a href="/" style={{ display: 'inline-block', background: '#111', color: '#fff', padding: '14px 32px', borderRadius: 9, fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>
          Browse More Leads
        </a>
      </div>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>}>
      <SuccessContent />
    </Suspense>
  )
}
