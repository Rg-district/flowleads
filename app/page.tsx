'use client'
import { useState, useEffect } from 'react'

const niches = [
  { icon: '🏭', name: 'Commercial Kitchen', desc: 'Businesses actively searching for kitchen hire or dark kitchen space in the UK', priceRange: '£35–80/lead', vol: '~85 leads/mo' },
  { icon: '🚐', name: 'Catering Van Buyers', desc: 'Verified buyers looking to purchase a fully converted food or catering vehicle', priceRange: '£60–150/lead', vol: '~40 leads/mo' },
  { icon: '🍽️', name: 'Food Business Startups', desc: 'New food business owners looking for accountants, equipment, licensing, insurance', priceRange: '£30–65/lead', vol: '~120 leads/mo' },
  { icon: '📦', name: 'Food Packaging & Supplies', desc: 'Restaurants and caterers buying packaging, disposables, and consumables in volume', priceRange: '£25–50/lead', vol: '~200 leads/mo' },
  { icon: '⚙️', name: 'Equipment Buyers', desc: 'Businesses purchasing commercial cooking equipment, refrigeration, or fit-out services', priceRange: '£45–100/lead', vol: '~60 leads/mo' },
  { icon: '🔧', name: 'Custom (your niche)', desc: 'We build a custom funnel for your specific product or service and deliver qualified enquiries', priceRange: 'Custom pricing', vol: 'Talk to us' },
]

const liveLeads = [
  { icon: '🍕', name: 'Pizza concept, East London', detail: 'Commercial kitchen · £1,500–3,000/mo budget', price: '£45', time: '2 min ago' },
  { icon: '🚐', name: 'Street food trader, Manchester', detail: 'Catering van buyer · budget £25–40k', price: '£95', time: '8 min ago' },
  { icon: '☕', name: 'Coffee subscription, Birmingham', detail: 'Food startup · looking for accountant', price: '£35', time: '14 min ago' },
  { icon: '🥡', name: 'Dark kitchen operator, Leeds', detail: 'Commercial kitchen · immediate start', price: '£60', time: '21 min ago' },
]

const packages = [
  { niche: 'Kitchen Leads', name: 'Starter Pack', price: '£350', per: '10 leads', cpl: '£35 per lead', features: ['10 qualified kitchen enquiries', 'Full contact details', 'Budget & timeline confirmed', 'Delivered within 14 days', 'Each lead sold once only'] },
  { niche: 'Van Buyer Leads', name: 'Conversion Pack', price: '£475', per: '5 leads', cpl: '£95 per lead · highest intent', features: ['5 verified van buyer enquiries', 'Budget range confirmed', 'Location + timeline', 'Specific requirements included', 'Delivered within 7 days'] },
  { niche: 'Custom', name: 'Monthly Retainer', price: 'From £500', per: '/mo', cpl: 'Guaranteed volume, lower CPL', features: ['Dedicated campaign for your niche', 'Guaranteed monthly volume', 'Real-time lead delivery', 'Custom qualification criteria', 'Monthly performance report'] },
]

const GREEN = '#16a34a'

export default function Home() {
  const [activeTab, setActiveTab] = useState<'buyers' | 'leads'>('buyers')
  const [form, setForm] = useState({ name: '', phone: '', email: '', type: '', location: '', budget: '' })
  const [submitted, setSubmitted] = useState(false)
  const [tick, setTick] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setTick(n => n + 1), 8000)
    return () => clearInterval(t)
  }, [])

  const handleForm = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await fetch('/api/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
    } catch (err) {
      console.error('Form submission error:', err)
    }
    setSubmitted(true)
  }

  return (
    <div style={{ fontFamily: 'Inter, -apple-system, sans-serif' }}>
      {/* Nav */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, background: 'rgba(255,255,255,0.94)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #f0f0ee' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 32px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 800, fontSize: 17, letterSpacing: '-0.5px' }}>
            <div style={{ width: 8, height: 8, background: GREEN, borderRadius: '50%' }} />
            FlowLeads
          </div>
          <div style={{ display: 'flex', background: '#f4f4f2', borderRadius: 8, padding: 3, gap: 2 }}>
            {(['buyers', 'leads'] as const).map(t => (
              <div key={t} onClick={() => setActiveTab(t)} style={{ padding: '6px 16px', borderRadius: 6, fontSize: 12.5, fontWeight: 600, cursor: 'pointer', color: activeTab === t ? '#111' : '#888', background: activeTab === t ? '#fff' : 'transparent', boxShadow: activeTab === t ? '0 1px 4px rgba(0,0,0,0.08)' : 'none', transition: 'all 0.12s' }}>
                {t === 'buyers' ? 'For Businesses' : 'Looking for a service?'}
              </div>
            ))}
          </div>
          <a href="#buy-leads" style={{ background: '#111', color: '#fff', padding: '8px 18px', borderRadius: 7, fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>Buy leads</a>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ padding: '130px 32px 80px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 20, padding: '5px 12px', fontSize: 12, fontWeight: 600, color: GREEN, marginBottom: 24 }}>🇬🇧 UK-verified leads only</div>
            <h1 style={{ fontSize: 52, fontWeight: 900, letterSpacing: '-2.5px', lineHeight: 1.05, marginBottom: 18 }}>Stop prospecting.<br />Start closing.</h1>
            <p style={{ fontSize: 17, color: '#777', lineHeight: 1.6, marginBottom: 32 }}>Qualified, ready-to-buy leads delivered straight to your inbox. Food businesses, catering van buyers, kitchen operators and more — filtered to exactly what your business needs.</p>
            <div style={{ display: 'flex', gap: 10 }}>
              <a href="#buy-leads" style={{ background: '#111', color: '#fff', padding: '13px 26px', borderRadius: 9, fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>Buy leads from £30</a>
              <a href="#how-it-works" style={{ background: 'transparent', color: '#111', border: '1.5px solid #e0e0dc', padding: '13px 26px', borderRadius: 9, fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>See how it works</a>
            </div>
          </div>

          {/* Live leads widget */}
          <div style={{ background: '#fafaf8', border: '1.5px solid #f0f0ee', borderRadius: 16, padding: 28 }}>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              Latest leads
              <span style={{ fontSize: 10, fontWeight: 600, color: GREEN, background: '#f0fdf4', padding: '2px 8px', borderRadius: 10, display: 'flex', alignItems: 'center', gap: 4 }}>
                <div style={{ width: 5, height: 5, background: GREEN, borderRadius: '50%' }} /> Live
              </span>
            </div>
            {liveLeads.map((lead, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: i < liveLeads.length - 1 ? '1px solid #f0f0ee' : 'none' }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, flexShrink: 0 }}>{lead.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12.5, fontWeight: 600 }}>{lead.name}</div>
                  <div style={{ fontSize: 11, color: '#999', marginTop: 1 }}>{lead.detail}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>{lead.price}</div>
                  <div style={{ fontSize: 10, color: '#bbb' }}>{lead.time}</div>
                </div>
              </div>
            ))}
            <div style={{ marginTop: 16, textAlign: 'center', fontSize: 12, color: '#999' }}><strong style={{ color: '#111' }}>47 leads</strong> generated in the last 24 hours</div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <div style={{ background: '#111', color: '#fff', padding: '20px 32px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)' }}>
          {[{ val: '2,400+', lab: 'Leads generated' }, { val: '£30–150', lab: 'Per qualified lead' }, { val: '94%', lab: 'Contact rate' }, { val: '48hrs', lab: 'Avg delivery time' }].map((s, i) => (
            <div key={s.lab} style={{ textAlign: 'center', padding: '0 20px', borderRight: i < 3 ? '1px solid #222' : 'none' }}>
              <div style={{ fontSize: 32, fontWeight: 900, letterSpacing: '-1.5px' }}>{s.val}</div>
              <div style={{ fontSize: 12, color: '#666', marginTop: 2 }}>{s.lab}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Lead categories */}
      <section id="buy-leads" style={{ maxWidth: 1100, margin: '0 auto', padding: '80px 32px' }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: '#bbb', marginBottom: 12 }}>Lead categories</div>
        <h2 style={{ fontSize: 38, fontWeight: 800, letterSpacing: '-1.5px', marginBottom: 12 }}>Leads for the food &<br />catering industry</h2>
        <p style={{ fontSize: 16, color: '#888', lineHeight: 1.6, maxWidth: 480, marginBottom: 48 }}>Every lead is verified, exclusive to one buyer, and delivered with full contact details and context.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }}>
          {niches.map(n => (
            <div key={n.name} style={{ border: '1.5px solid #f0f0ee', borderRadius: 12, padding: 22, cursor: 'pointer' }}>
              <div style={{ fontSize: 24, marginBottom: 10 }}>{n.icon}</div>
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{n.name}</div>
              <div style={{ fontSize: 12, color: '#999', marginBottom: 10, lineHeight: 1.5 }}>{n.desc}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 13, fontWeight: 700 }}>{n.priceRange}</span>
                <span style={{ fontSize: 11, color: '#bbb' }}>{n.vol}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works + sample lead */}
      <div style={{ background: '#fafaf8' }}>
        <div id="how-it-works" style={{ maxWidth: 1100, margin: '0 auto', padding: '80px 32px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'start' }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: '#bbb', marginBottom: 12 }}>For businesses</div>
            <h2 style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-1.5px', marginBottom: 12 }}>Leads that are actually ready to buy</h2>
            <p style={{ fontSize: 15, color: '#888', lineHeight: 1.6, marginBottom: 36 }}>Every lead has confirmed intent, budget and location before you see them.</p>
            {[
              { n: '1', t: 'Choose your niche and volume', d: 'Tell us what you sell and how many leads you need per month. Pay per lead or buy in bundles.' },
              { n: '2', t: 'We run the campaigns', d: 'Our team builds and runs targeted ads and landing pages. Every enquiry is captured and qualified.' },
              { n: '3', t: 'Leads land in your inbox', d: 'Name, phone, email, budget, timeline, specific requirement — everything you need to close.' },
              { n: '4', t: 'You close the deal', d: 'Leads are exclusive — only sold once. You call, they\'re expecting to hear from a business like yours.' },
            ].map(s => (
              <div key={s.n} style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#111', color: '#fff', fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>{s.n}</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{s.t}</div>
                  <div style={{ fontSize: 13, color: '#888', lineHeight: 1.5 }}>{s.d}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Sample lead card */}
          <div style={{ border: '1.5px solid #f0f0ee', borderRadius: 14, padding: 24, background: '#fff' }}>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#bbb', marginBottom: 16 }}>Sample lead — Catering van buyer</div>
            {[
              { k: 'Business type', v: 'Street food — Indian cuisine', blur: false },
              { k: 'Location', v: 'Greater Manchester', blur: false },
              { k: 'Budget', v: '£25,000 – £35,000', blur: false },
              { k: 'Timeline', v: 'Looking to buy within 4–6 weeks', blur: false },
              { k: 'Requirements', v: 'Gas-certified, commercial fryer, serving hatch, single phase electrics', blur: false },
              { k: 'Name & contact', v: 'Jamie Richardson · 07700 xxxxxx · j.richardson@xxx.com', blur: true },
            ].map(f => (
              <div key={f.k} style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 11, color: '#bbb', fontWeight: 600, marginBottom: 2, textTransform: 'uppercase', letterSpacing: '0.3px' }}>{f.k}</div>
                <div style={{ fontSize: 13.5, fontWeight: 500, filter: f.blur ? 'blur(4px)' : 'none', userSelect: f.blur ? 'none' : 'auto' }}>{f.v}</div>
              </div>
            ))}
            <button style={{ background: '#111', color: '#fff', width: '100%', padding: 12, borderRadius: 8, fontSize: 13, fontWeight: 600, textAlign: 'center', cursor: 'pointer', border: 'none', fontFamily: 'inherit', marginTop: 16 }}>
              Unlock this lead — £95
            </button>
          </div>
        </div>
      </div>

      {/* Packages */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '80px 32px' }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: '#bbb', marginBottom: 12 }}>Packages</div>
        <h2 style={{ fontSize: 38, fontWeight: 800, letterSpacing: '-1.5px', marginBottom: 12 }}>Pay per lead, or save with bundles</h2>
        <p style={{ fontSize: 16, color: '#888', lineHeight: 1.6, marginBottom: 48 }}>No subscriptions, no lock-ins. Buy when you need them.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }}>
          {packages.map(p => (
            <div key={p.name} style={{ border: '1.5px solid #f0f0ee', borderRadius: 12, padding: 24 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#bbb', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>{p.niche}</div>
              <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 4 }}>{p.name}</div>
              <div style={{ fontSize: 28, fontWeight: 900, letterSpacing: '-1px', margin: '12px 0 4px' }}>{p.price}<span style={{ fontSize: 13, fontWeight: 500, letterSpacing: 0 }}>/{p.per}</span></div>
              <div style={{ fontSize: 12, color: '#aaa', marginBottom: 16 }}>{p.cpl}</div>
              <ul style={{ listStyle: 'none', marginBottom: 20 }}>
                {p.features.map(f => (
                  <li key={f} style={{ fontSize: 12.5, color: '#666', padding: '5px 0', borderBottom: '1px solid #f4f4f2', display: 'flex', alignItems: 'center', gap: 7 }}>
                    <span style={{ color: GREEN, fontWeight: 700, fontSize: 10 }}>✓</span>{f}
                  </li>
                ))}
              </ul>
              <button style={{ width: '100%', padding: 11, borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', border: '1.5px solid #e0e0dc', background: 'transparent', color: '#111' }}>Buy now</button>
            </div>
          ))}
        </div>
      </section>

      {/* Separator */}
      <div style={{ background: '#fafaf8', borderTop: '1px solid #f0f0ee', borderBottom: '1px solid #f0f0ee', padding: '24px 32px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 20 }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 800, letterSpacing: '-0.3px' }}>Looking for a commercial kitchen, catering van or food business service?</div>
            <div style={{ fontSize: 13, color: '#888', marginTop: 3 }}>Tell us what you need and we'll match you with the right businesses — for free.</div>
          </div>
          <a href="#get-matched" style={{ background: GREEN, color: '#fff', border: 'none', padding: '10px 22px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', textDecoration: 'none', whiteSpace: 'nowrap', marginLeft: 'auto' }}>Get matched free →</a>
        </div>
      </div>

      {/* Consumer capture */}
      <div id="get-matched" style={{ background: '#111', color: '#fff', padding: '80px 32px' }}>
        <div style={{ maxWidth: 560, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 36, fontWeight: 900, letterSpacing: '-1.5px', marginBottom: 10 }}>Tell us what you need</h2>
          <p style={{ fontSize: 15, color: '#888', marginBottom: 32 }}>Free. Takes 60 seconds. The right businesses come to you.</p>
          {submitted ? (
            <div style={{ background: '#1a1a1a', border: '1px solid #333', borderRadius: 12, padding: '24px', fontSize: 15, color: GREEN, fontWeight: 600 }}>✓ We'll match you with the best options within 24 hours.</div>
          ) : (
            <form onSubmit={handleForm} style={{ display: 'flex', flexDirection: 'column', gap: 10, textAlign: 'left' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} required placeholder="Your name" style={{ padding: '13px 14px', borderRadius: 9, border: 'none', fontSize: 14, fontFamily: 'inherit', background: '#1a1a1a', color: '#fff', outline: 'none' }} />
                <input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} required placeholder="Phone number" style={{ padding: '13px 14px', borderRadius: 9, border: 'none', fontSize: 14, fontFamily: 'inherit', background: '#1a1a1a', color: '#fff', outline: 'none' }} />
              </div>
              <input value={form.email} onChange={e => setForm({...form, email: e.target.value})} required type="email" placeholder="Email address" style={{ padding: '13px 14px', borderRadius: 9, border: 'none', fontSize: 14, fontFamily: 'inherit', background: '#1a1a1a', color: '#fff', outline: 'none' }} />
              <select value={form.type} onChange={e => setForm({...form, type: e.target.value})} required style={{ padding: '13px 14px', borderRadius: 9, border: 'none', fontSize: 14, fontFamily: 'inherit', background: '#1a1a1a', color: form.type ? '#fff' : '#666', outline: 'none' }}>
                <option value="">What are you looking for?</option>
                <option>Commercial kitchen hire</option>
                <option>Catering van to buy</option>
                <option>Food business accountant</option>
                <option>Catering equipment</option>
                <option>Food packaging & supplies</option>
                <option>Something else</option>
              </select>
              <input value={form.location} onChange={e => setForm({...form, location: e.target.value})} required placeholder="Location (city or postcode)" style={{ padding: '13px 14px', borderRadius: 9, border: 'none', fontSize: 14, fontFamily: 'inherit', background: '#1a1a1a', color: '#fff', outline: 'none' }} />
              <input value={form.budget} onChange={e => setForm({...form, budget: e.target.value})} placeholder="Budget range (optional)" style={{ padding: '13px 14px', borderRadius: 9, border: 'none', fontSize: 14, fontFamily: 'inherit', background: '#1a1a1a', color: '#fff', outline: 'none' }} />
              <button type="submit" style={{ background: GREEN, color: '#fff', border: 'none', padding: 14, borderRadius: 9, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', marginTop: 4 }}>Get matched now →</button>
              <p style={{ fontSize: 11, color: '#555', textAlign: 'center' }}>Your details are only shared with relevant, verified businesses. No spam.</p>
            </form>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid #f0f0ee', padding: 28 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 14, fontWeight: 800, letterSpacing: '-0.3px', display: 'flex', alignItems: 'center', gap: 7 }}>
            <div style={{ width: 7, height: 7, background: GREEN, borderRadius: '50%' }} /> FlowLeads
          </div>
          <div style={{ display: 'flex', gap: 24 }}>
            {['Privacy', 'Terms', 'For businesses', 'Contact'].map(l => <a key={l} href="#" style={{ fontSize: 12, color: '#bbb', textDecoration: 'none' }}>{l}</a>)}
          </div>
          <div style={{ fontSize: 12, color: '#ccc' }}>© 2026 FlowLeads</div>
        </div>
      </footer>
    </div>
  )
}
