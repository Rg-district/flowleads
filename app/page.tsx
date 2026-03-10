'use client'
import { useState, useEffect } from 'react'

interface Lead {
  id: string
  icon: string | null
  title: string
  detail: string | null
  category: string
  location: string | null
  budget_min: number | null
  budget_max: number | null
  price: number
  status: string
  verified: boolean
  created_at: string
}

const niches = [
  { icon: '🏭', name: 'Commercial Kitchen', desc: 'Businesses actively searching for kitchen hire or dark kitchen space in the UK', priceRange: '£35–80/lead', vol: '~85 leads/mo' },
  { icon: '🚐', name: 'Catering Van Buyers', desc: 'Verified buyers looking to purchase a fully converted food or catering vehicle', priceRange: '£60–150/lead', vol: '~40 leads/mo' },
  { icon: '🍽️', name: 'Food Business Startups', desc: 'New food business owners looking for accountants, equipment, licensing, insurance', priceRange: '£30–65/lead', vol: '~120 leads/mo' },
  { icon: '📦', name: 'Food Packaging & Supplies', desc: 'Restaurants and caterers buying packaging, disposables, and consumables in volume', priceRange: '£25–50/lead', vol: '~200 leads/mo' },
  { icon: '⚙️', name: 'Equipment Buyers', desc: 'Businesses purchasing commercial cooking equipment, refrigeration, or fit-out services', priceRange: '£45–100/lead', vol: '~60 leads/mo' },
  { icon: '🔧', name: 'Custom (your niche)', desc: 'We build a custom funnel for your specific product or service and deliver qualified enquiries', priceRange: 'Custom pricing', vol: 'Talk to us' },
]

const packages = [
  { niche: 'Kitchen Leads', name: 'Starter Pack', price: '£350', per: '10 leads', cpl: '£35 per lead', features: ['10 qualified kitchen enquiries', 'Full contact details', 'Budget & timeline confirmed', 'Delivered within 14 days', 'Each lead sold once only'] },
  { niche: 'Van Buyer Leads', name: 'Conversion Pack', price: '£475', per: '5 leads', cpl: '£95 per lead · highest intent', features: ['5 verified van buyer enquiries', 'Budget range confirmed', 'Location + timeline', 'Specific requirements included', 'Delivered within 7 days'] },
  { niche: 'Custom', name: 'Monthly Retainer', price: 'From £500', per: '/mo', cpl: 'Guaranteed volume, lower CPL', features: ['Dedicated campaign for your niche', 'Guaranteed monthly volume', 'Real-time lead delivery', 'Custom qualification criteria', 'Monthly performance report'] },
]

const testimonials = [
  { name: 'James T.', company: 'Kitchen Equipment Direct', text: 'We\'ve closed 3 deals from 8 leads. The quality is excellent — these people are actually ready to buy.', rating: 5 },
  { name: 'Sarah M.', company: 'CaterVan Solutions', text: 'Best lead source we\'ve used. Each lead comes with real budget info and specific requirements. No tyre kickers.', rating: 5 },
  { name: 'Marcus P.', company: 'Dark Kitchen Network', text: 'The kitchen leads are incredibly targeted. Saved us hours of cold calling. Worth every penny.', rating: 5 },
]

const GREEN = '#16a34a'

export default function Home() {
  const [activeTab, setActiveTab] = useState<'buyers' | 'leads'>('buyers')
  const [form, setForm] = useState({ name: '', phone: '', email: '', type: '', location: '', budget: '' })
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [leads, setLeads] = useState<Lead[]>([])
  const [loadingLeads, setLoadingLeads] = useState(true)
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [buyerForm, setBuyerForm] = useState({ name: '', email: '', phone: '', company: '' })
  const [purchasing, setPurchasing] = useState(false)

  useEffect(() => {
    fetchLeads()
  }, [])

  const fetchLeads = async () => {
    try {
      const res = await fetch('/api/leads')
      const data = await res.json()
      setLeads(data)
    } catch (err) {
      console.error('Failed to fetch leads:', err)
    }
    setLoadingLeads(false)
  }

  const handleForm = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const res = await fetch('/api/lead-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      if (res.ok) {
        setSubmitted(true)
      }
    } catch (err) {
      console.error('Failed to submit:', err)
    }
    setSubmitting(false)
  }

  const handlePurchase = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedLead) return
    
    setPurchasing(true)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadId: selectedLead.id,
          buyerName: buyerForm.name,
          buyerEmail: buyerForm.email,
          buyerPhone: buyerForm.phone,
          buyerCompany: buyerForm.company
        })
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        alert('Failed to start checkout')
      }
    } catch (err) {
      console.error('Checkout error:', err)
      alert('Something went wrong')
    }
    setPurchasing(false)
  }

  const formatTimeAgo = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const mins = Math.floor((now.getTime() - date.getTime()) / 60000)
    if (mins < 60) return `${mins} min ago`
    const hours = Math.floor(mins / 60)
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    return `${days}d ago`
  }

  const displayLeads = leads.length > 0 ? leads.slice(0, 4) : [
    { id: '1', icon: '🍕', title: 'Pizza concept, East London', detail: 'Commercial kitchen · £1,500–3,000/mo budget', price: 45, created_at: new Date(Date.now() - 2*60000).toISOString() },
    { id: '2', icon: '🚐', title: 'Street food trader, Manchester', detail: 'Catering van buyer · budget £25–40k', price: 95, created_at: new Date(Date.now() - 8*60000).toISOString() },
    { id: '3', icon: '☕', title: 'Coffee subscription, Birmingham', detail: 'Food startup · looking for accountant', price: 35, created_at: new Date(Date.now() - 14*60000).toISOString() },
    { id: '4', icon: '🥡', title: 'Dark kitchen operator, Leeds', detail: 'Commercial kitchen · immediate start', price: 60, created_at: new Date(Date.now() - 21*60000).toISOString() },
  ] as any[]

  return (
    <div style={{ fontFamily: 'Inter, -apple-system, sans-serif' }}>
      {/* Nav */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, background: 'rgba(255,255,255,0.94)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #f0f0ee' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 800, fontSize: 17, letterSpacing: '-0.5px' }}>
            <div style={{ width: 8, height: 8, background: GREEN, borderRadius: '50%' }} />
            FlowLeads
          </div>
          <div className="tab-switcher" style={{ display: 'flex', background: '#f4f4f2', borderRadius: 8, padding: 3, gap: 2 }}>
            {(['buyers', 'leads'] as const).map(t => (
              <div key={t} onClick={() => setActiveTab(t)} style={{ padding: '6px 16px', borderRadius: 6, fontSize: 12.5, fontWeight: 600, cursor: 'pointer', color: activeTab === t ? '#111' : '#888', background: activeTab === t ? '#fff' : 'transparent', boxShadow: activeTab === t ? '0 1px 4px rgba(0,0,0,0.08)' : 'none', transition: 'all 0.12s' }}>
                {t === 'buyers' ? 'For Businesses' : 'Looking for a service?'}
              </div>
            ))}
          </div>
          <a href="#buy-leads" className="nav-cta" style={{ background: '#111', color: '#fff', padding: '8px 18px', borderRadius: 7, fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>Buy leads</a>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ padding: '130px 24px 80px', maxWidth: 1100, margin: '0 auto' }}>
        <div className="hero-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 20, padding: '5px 12px', fontSize: 12, fontWeight: 600, color: GREEN, marginBottom: 24 }}>🇬🇧 UK-verified leads only</div>
            <h1 className="hero-title" style={{ fontSize: 52, fontWeight: 900, letterSpacing: '-2.5px', lineHeight: 1.05, marginBottom: 18 }}>Stop prospecting.<br />Start closing.</h1>
            <p style={{ fontSize: 17, color: '#777', lineHeight: 1.6, marginBottom: 32 }}>Qualified, ready-to-buy leads delivered straight to your inbox. Food businesses, catering van buyers, kitchen operators and more — filtered to exactly what your business needs.</p>
            <div className="hero-buttons" style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <a href="#buy-leads" style={{ background: '#111', color: '#fff', padding: '13px 26px', borderRadius: 9, fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>Buy leads from £30</a>
              <a href="#how-it-works" style={{ background: 'transparent', color: '#111', border: '1.5px solid #e0e0dc', padding: '13px 26px', borderRadius: 9, fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>See how it works</a>
            </div>
          </div>

          {/* Live leads widget */}
          <div className="live-leads-widget" style={{ background: '#fafaf8', border: '1.5px solid #f0f0ee', borderRadius: 16, padding: 28 }}>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              Latest leads
              <span style={{ fontSize: 10, fontWeight: 600, color: GREEN, background: '#f0fdf4', padding: '2px 8px', borderRadius: 10, display: 'flex', alignItems: 'center', gap: 4 }}>
                <div style={{ width: 5, height: 5, background: GREEN, borderRadius: '50%', animation: 'pulse 2s infinite' }} /> Live
              </span>
            </div>
            {displayLeads.map((lead, i) => (
              <div key={lead.id} onClick={() => leads.length > 0 ? setSelectedLead(lead as Lead) : null} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: i < displayLeads.length - 1 ? '1px solid #f0f0ee' : 'none', cursor: leads.length > 0 ? 'pointer' : 'default' }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, flexShrink: 0 }}>{lead.icon || '📋'}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12.5, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{lead.title}</div>
                  <div style={{ fontSize: 11, color: '#999', marginTop: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{lead.detail || `${lead.category} · ${lead.location || 'UK'}`}</div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>£{lead.price}</div>
                  <div style={{ fontSize: 10, color: '#bbb' }}>{formatTimeAgo(lead.created_at)}</div>
                </div>
              </div>
            ))}
            <div style={{ marginTop: 16, textAlign: 'center', fontSize: 12, color: '#999' }}><strong style={{ color: '#111' }}>{leads.length > 0 ? leads.length : 47} leads</strong> available now</div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <div style={{ background: '#111', color: '#fff', padding: '20px 24px' }}>
        <div className="stats-grid" style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)' }}>
          {[{ val: '2,400+', lab: 'Leads generated' }, { val: '£30–150', lab: 'Per qualified lead' }, { val: '94%', lab: 'Contact rate' }, { val: '48hrs', lab: 'Avg delivery time' }].map((s, i) => (
            <div key={s.lab} style={{ textAlign: 'center', padding: '0 20px' }}>
              <div style={{ fontSize: 28, fontWeight: 900, letterSpacing: '-1.5px' }}>{s.val}</div>
              <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>{s.lab}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Lead categories */}
      <section id="buy-leads" style={{ maxWidth: 1100, margin: '0 auto', padding: '80px 24px' }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: '#bbb', marginBottom: 12 }}>Lead categories</div>
        <h2 className="section-title" style={{ fontSize: 38, fontWeight: 800, letterSpacing: '-1.5px', marginBottom: 12 }}>Leads for the food &<br />catering industry</h2>
        <p style={{ fontSize: 16, color: '#888', lineHeight: 1.6, maxWidth: 480, marginBottom: 48 }}>Every lead is verified, exclusive to one buyer, and delivered with full contact details and context.</p>
        <div className="categories-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }}>
          {niches.map(n => (
            <div key={n.name} style={{ border: '1.5px solid #f0f0ee', borderRadius: 12, padding: 22, cursor: 'pointer', transition: 'border-color 0.15s' }} onMouseOver={e => (e.currentTarget.style.borderColor = '#ccc')} onMouseOut={e => (e.currentTarget.style.borderColor = '#f0f0ee')}>
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

      {/* Available Leads */}
      {leads.length > 0 && (
        <section style={{ background: '#fafaf8', padding: '80px 24px' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: '#bbb', marginBottom: 12 }}>Available now</div>
            <h2 style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-1px', marginBottom: 32 }}>Browse Leads</h2>
            <div className="leads-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 16 }}>
              {leads.map(lead => (
                <div key={lead.id} onClick={() => setSelectedLead(lead)} style={{ background: '#fff', border: '1.5px solid #e0e0dc', borderRadius: 14, padding: 24, cursor: 'pointer', transition: 'all 0.15s' }} onMouseOver={e => { e.currentTarget.style.borderColor = '#111'; e.currentTarget.style.transform = 'translateY(-2px)' }} onMouseOut={e => { e.currentTarget.style.borderColor = '#e0e0dc'; e.currentTarget.style.transform = 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 10, background: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>{lead.icon || '📋'}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <span style={{ fontWeight: 700, fontSize: 15 }}>{lead.title}</span>
                        {lead.verified && <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 4, background: '#eff6ff', color: '#2563eb', fontWeight: 600 }}>✓ Verified</span>}
                      </div>
                      <div style={{ fontSize: 13, color: '#666', marginBottom: 8 }}>{lead.detail || `${lead.category} lead`}</div>
                      <div style={{ display: 'flex', gap: 12, fontSize: 12, color: '#999' }}>
                        <span>📍 {lead.location || 'UK'}</span>
                        {lead.budget_min && lead.budget_max && <span>💰 £{lead.budget_min.toLocaleString()}–£{lead.budget_max.toLocaleString()}</span>}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 20, fontWeight: 800, color: GREEN }}>£{lead.price}</div>
                      <div style={{ fontSize: 11, color: '#999' }}>Exclusive</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* How it works + sample lead */}
      <div style={{ background: leads.length > 0 ? '#fff' : '#fafaf8' }}>
        <div id="how-it-works" style={{ maxWidth: 1100, margin: '0 auto', padding: '80px 24px' }}>
          <div className="how-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'start' }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: '#bbb', marginBottom: 12 }}>For businesses</div>
              <h2 className="section-title" style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-1.5px', marginBottom: 12 }}>Leads that are actually ready to buy</h2>
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
              <button onClick={() => leads.length > 0 && setSelectedLead(leads[0])} style={{ background: '#111', color: '#fff', width: '100%', padding: 12, borderRadius: 8, fontSize: 13, fontWeight: 600, textAlign: 'center', cursor: 'pointer', border: 'none', fontFamily: 'inherit', marginTop: 16 }}>
                Unlock this lead — £95
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '80px 24px' }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: '#bbb', marginBottom: 12, textAlign: 'center' }}>Testimonials</div>
        <h2 style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-1px', marginBottom: 48, textAlign: 'center' }}>What our customers say</h2>
        <div className="testimonials-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }}>
          {testimonials.map((t, i) => (
            <div key={i} style={{ border: '1.5px solid #f0f0ee', borderRadius: 12, padding: 24 }}>
              <div style={{ display: 'flex', gap: 2, marginBottom: 12 }}>
                {[...Array(t.rating)].map((_, j) => <span key={j} style={{ color: '#fbbf24' }}>★</span>)}
              </div>
              <p style={{ fontSize: 14, color: '#555', lineHeight: 1.6, marginBottom: 16 }}>"{t.text}"</p>
              <div style={{ fontSize: 13, fontWeight: 700 }}>{t.name}</div>
              <div style={{ fontSize: 12, color: '#999' }}>{t.company}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Packages */}
      <section style={{ background: '#fafaf8', padding: '80px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: '#bbb', marginBottom: 12 }}>Packages</div>
          <h2 style={{ fontSize: 38, fontWeight: 800, letterSpacing: '-1.5px', marginBottom: 12 }}>Pay per lead, or save with bundles</h2>
          <p style={{ fontSize: 16, color: '#888', lineHeight: 1.6, marginBottom: 48 }}>No subscriptions, no lock-ins. Buy when you need them.</p>
          <div className="packages-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }}>
            {packages.map(p => (
              <div key={p.name} style={{ border: '1.5px solid #e0e0dc', borderRadius: 12, padding: 24, background: '#fff' }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#bbb', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>{p.niche}</div>
                <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 4 }}>{p.name}</div>
                <div style={{ fontSize: 28, fontWeight: 900, letterSpacing: '-1px', margin: '12px 0 4px' }}>{p.price}<span style={{ fontSize: 13, fontWeight: 500, letterSpacing: 0 }}>/{p.per}</span></div>
                <div style={{ fontSize: 12, color: '#aaa', marginBottom: 16 }}>{p.cpl}</div>
                <ul style={{ listStyle: 'none', marginBottom: 20, padding: 0 }}>
                  {p.features.map(f => (
                    <li key={f} style={{ fontSize: 12.5, color: '#666', padding: '5px 0', borderBottom: '1px solid #f4f4f2', display: 'flex', alignItems: 'center', gap: 7 }}>
                      <span style={{ color: GREEN, fontWeight: 700, fontSize: 10 }}>✓</span>{f}
                    </li>
                  ))}
                </ul>
                <button style={{ width: '100%', padding: 11, borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', border: '1.5px solid #e0e0dc', background: 'transparent', color: '#111' }}>Contact us</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Separator */}
      <div style={{ background: '#fff', borderTop: '1px solid #f0f0ee', borderBottom: '1px solid #f0f0ee', padding: '24px' }}>
        <div className="separator-content" style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 280 }}>
            <div style={{ fontSize: 16, fontWeight: 800, letterSpacing: '-0.3px' }}>Looking for a commercial kitchen, catering van or food business service?</div>
            <div style={{ fontSize: 13, color: '#888', marginTop: 3 }}>Tell us what you need and we'll match you with the right businesses — for free.</div>
          </div>
          <a href="#get-matched" style={{ background: GREEN, color: '#fff', border: 'none', padding: '10px 22px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', textDecoration: 'none', whiteSpace: 'nowrap' }}>Get matched free →</a>
        </div>
      </div>

      {/* Consumer capture */}
      <div id="get-matched" style={{ background: '#111', color: '#fff', padding: '80px 24px' }}>
        <div style={{ maxWidth: 560, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 36, fontWeight: 900, letterSpacing: '-1.5px', marginBottom: 10 }}>Tell us what you need</h2>
          <p style={{ fontSize: 15, color: '#888', marginBottom: 32 }}>Free. Takes 60 seconds. The right businesses come to you.</p>
          {submitted ? (
            <div style={{ background: '#1a1a1a', border: '1px solid #333', borderRadius: 12, padding: '24px', fontSize: 15, color: GREEN, fontWeight: 600 }}>✓ We'll match you with the best options within 24 hours.</div>
          ) : (
            <form onSubmit={handleForm} style={{ display: 'flex', flexDirection: 'column', gap: 10, textAlign: 'left' }}>
              <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
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
              <button type="submit" disabled={submitting} style={{ background: GREEN, color: '#fff', border: 'none', padding: 14, borderRadius: 9, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', marginTop: 4, opacity: submitting ? 0.7 : 1 }}>
                {submitting ? 'Submitting...' : 'Get matched now →'}
              </button>
              <p style={{ fontSize: 11, color: '#555', textAlign: 'center' }}>Your details are only shared with relevant, verified businesses. No spam.</p>
            </form>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid #f0f0ee', padding: 28 }}>
        <div className="footer-content" style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ fontSize: 14, fontWeight: 800, letterSpacing: '-0.3px', display: 'flex', alignItems: 'center', gap: 7 }}>
            <div style={{ width: 7, height: 7, background: GREEN, borderRadius: '50%' }} /> FlowLeads
          </div>
          <div style={{ display: 'flex', gap: 24 }}>
            {['Privacy', 'Terms', 'For businesses', 'Contact'].map(l => <a key={l} href="#" style={{ fontSize: 12, color: '#bbb', textDecoration: 'none' }}>{l}</a>)}
          </div>
          <div style={{ fontSize: 12, color: '#ccc' }}>© 2026 FlowLeads</div>
        </div>
      </footer>

      {/* Purchase Modal */}
      {selectedLead && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 24 }} onClick={() => setSelectedLead(null)}>
          <div style={{ background: '#fff', borderRadius: 16, width: '100%', maxWidth: 480, maxHeight: '90vh', overflow: 'auto' }} onClick={e => e.stopPropagation()}>
            <div style={{ padding: 24, borderBottom: '1px solid #f0f0ee' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div style={{ display: 'flex', gap: 14 }}>
                  <div style={{ width: 48, height: 48, borderRadius: 10, background: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>{selectedLead.icon || '📋'}</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>{selectedLead.title}</div>
                    <div style={{ fontSize: 13, color: '#666' }}>{selectedLead.category} · {selectedLead.location || 'UK'}</div>
                  </div>
                </div>
                <button onClick={() => setSelectedLead(null)} style={{ background: 'none', border: 'none', fontSize: 24, cursor: 'pointer', color: '#999', padding: 0 }}>×</button>
              </div>
            </div>
            
            <div style={{ padding: 24 }}>
              <div style={{ background: '#f9fafb', borderRadius: 10, padding: 16, marginBottom: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <span style={{ fontSize: 13, color: '#666' }}>Lead price</span>
                  <span style={{ fontSize: 24, fontWeight: 800, color: GREEN }}>£{selectedLead.price}</span>
                </div>
                {selectedLead.detail && <div style={{ fontSize: 13, color: '#555', marginBottom: 8 }}>{selectedLead.detail}</div>}
                {selectedLead.budget_min && selectedLead.budget_max && (
                  <div style={{ fontSize: 12, color: '#888' }}>💰 Budget: £{selectedLead.budget_min.toLocaleString()} – £{selectedLead.budget_max.toLocaleString()}</div>
                )}
              </div>
              
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>Enter your details to purchase</div>
              <form onSubmit={handlePurchase} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <input required value={buyerForm.name} onChange={e => setBuyerForm({...buyerForm, name: e.target.value})} placeholder="Your name *" style={{ padding: '12px 14px', borderRadius: 8, border: '1px solid #e0e0dc', fontSize: 14, fontFamily: 'inherit' }} />
                <input required type="email" value={buyerForm.email} onChange={e => setBuyerForm({...buyerForm, email: e.target.value})} placeholder="Email address *" style={{ padding: '12px 14px', borderRadius: 8, border: '1px solid #e0e0dc', fontSize: 14, fontFamily: 'inherit' }} />
                <input value={buyerForm.phone} onChange={e => setBuyerForm({...buyerForm, phone: e.target.value})} placeholder="Phone number" style={{ padding: '12px 14px', borderRadius: 8, border: '1px solid #e0e0dc', fontSize: 14, fontFamily: 'inherit' }} />
                <input value={buyerForm.company} onChange={e => setBuyerForm({...buyerForm, company: e.target.value})} placeholder="Company name" style={{ padding: '12px 14px', borderRadius: 8, border: '1px solid #e0e0dc', fontSize: 14, fontFamily: 'inherit' }} />
                <button type="submit" disabled={purchasing} style={{ background: '#111', color: '#fff', padding: 14, borderRadius: 8, fontSize: 14, fontWeight: 600, border: 'none', cursor: 'pointer', fontFamily: 'inherit', marginTop: 8, opacity: purchasing ? 0.7 : 1 }}>
                  {purchasing ? 'Processing...' : `Pay £${selectedLead.price} — Unlock Lead`}
                </button>
              </form>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 16, justifyContent: 'center' }}>
                <span style={{ fontSize: 11, color: '#999' }}>🔒 Secure checkout powered by Stripe</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @media (max-width: 768px) {
          .hero-grid, .how-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
          .hero-title { font-size: 36px !important; }
          .section-title { font-size: 28px !important; }
          .categories-grid, .packages-grid, .testimonials-grid { grid-template-columns: 1fr !important; }
          .leads-grid { grid-template-columns: 1fr !important; }
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 20px !important; }
          .tab-switcher { display: none !important; }
          .nav-cta { padding: 6px 14px !important; font-size: 12px !important; }
          .live-leads-widget { margin-top: 20px; }
          .form-row { grid-template-columns: 1fr !important; }
          .separator-content { flex-direction: column; text-align: center; }
          .footer-content { flex-direction: column; text-align: center; }
        }
      `}</style>
    </div>
  )
}
