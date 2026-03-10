'use client'

import { useState, useEffect } from 'react'

interface Lead {
  id: string
  created_at: string
  icon: string | null
  title: string
  detail: string | null
  category: string
  location: string | null
  budget_min: number | null
  budget_max: number | null
  price: number
  contact_name: string | null
  contact_email: string | null
  contact_phone: string | null
  status: string
  exclusive: boolean
  verified: boolean
}

const categories = [
  'Commercial Kitchen',
  'Catering Van',
  'Food Startup',
  'Food Packaging',
  'Equipment Buyer',
  'Other'
]

const icons = ['🏭', '🚐', '🍽️', '📦', '⚙️', '🍕', '☕', '🥡', '🔧']

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingLead, setEditingLead] = useState<Lead | null>(null)
  const [form, setForm] = useState({
    icon: '🏭',
    title: '',
    detail: '',
    category: 'Commercial Kitchen',
    location: '',
    budget_min: '',
    budget_max: '',
    price: '',
    contact_name: '',
    contact_email: '',
    contact_phone: '',
    status: 'available',
    exclusive: true,
    verified: false
  })

  const ADMIN_PASSWORD = 'flowleads2026'

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true)
      fetchLeads()
    } else {
      alert('Incorrect password')
    }
  }

  const fetchLeads = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/leads?order=created_at.desc`, {
        headers: {
          'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`
        }
      })
      const data = await res.json()
      setLeads(data)
    } catch (err) {
      console.error('Failed to fetch leads:', err)
    }
    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    const payload = {
      ...form,
      budget_min: form.budget_min ? parseInt(form.budget_min) : null,
      budget_max: form.budget_max ? parseInt(form.budget_max) : null,
      price: parseInt(form.price) || 0
    }
    
    try {
      const url = editingLead 
        ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/leads?id=eq.${editingLead.id}`
        : `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/leads`
      
      const res = await fetch(url, {
        method: editingLead ? 'PATCH' : 'POST',
        headers: {
          'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify(payload)
      })
      
      if (res.ok) {
        setShowForm(false)
        setEditingLead(null)
        resetForm()
        fetchLeads()
      } else {
        alert('Failed to save lead')
      }
    } catch (err) {
      console.error('Failed to save lead:', err)
    }
    setLoading(false)
  }

  const resetForm = () => {
    setForm({
      icon: '🏭',
      title: '',
      detail: '',
      category: 'Commercial Kitchen',
      location: '',
      budget_min: '',
      budget_max: '',
      price: '',
      contact_name: '',
      contact_email: '',
      contact_phone: '',
      status: 'available',
      exclusive: true,
      verified: false
    })
  }

  const editLead = (lead: Lead) => {
    setEditingLead(lead)
    setForm({
      icon: lead.icon || '🏭',
      title: lead.title,
      detail: lead.detail || '',
      category: lead.category,
      location: lead.location || '',
      budget_min: lead.budget_min?.toString() || '',
      budget_max: lead.budget_max?.toString() || '',
      price: lead.price.toString(),
      contact_name: lead.contact_name || '',
      contact_email: lead.contact_email || '',
      contact_phone: lead.contact_phone || '',
      status: lead.status,
      exclusive: lead.exclusive,
      verified: lead.verified
    })
    setShowForm(true)
  }

  const deleteLead = async (id: string) => {
    if (!confirm('Are you sure you want to delete this lead?')) return
    
    try {
      await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/leads?id=eq.${id}`, {
        method: 'DELETE',
        headers: {
          'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`
        }
      })
      fetchLeads()
    } catch (err) {
      console.error('Failed to delete lead:', err)
    }
  }

  if (!authenticated) {
    return (
      <div style={{ fontFamily: 'Inter, -apple-system, sans-serif', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#111' }}>
        <form onSubmit={handleLogin} style={{ background: '#fff', padding: 40, borderRadius: 16, width: 360 }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>Admin Login</h1>
          <p style={{ fontSize: 14, color: '#666', marginBottom: 24 }}>Enter the admin password to continue.</p>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Password"
            style={{ width: '100%', padding: '12px 14px', borderRadius: 8, border: '1px solid #e0e0dc', fontSize: 14, marginBottom: 16, boxSizing: 'border-box' }}
          />
          <button type="submit" style={{ width: '100%', background: '#111', color: '#fff', padding: 14, borderRadius: 8, fontSize: 14, fontWeight: 600, border: 'none', cursor: 'pointer' }}>
            Login
          </button>
        </form>
      </div>
    )
  }

  return (
    <div style={{ fontFamily: 'Inter, -apple-system, sans-serif', minHeight: '100vh', background: '#fafaf8' }}>
      <nav style={{ background: '#111', color: '#fff', padding: '16px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 8, height: 8, background: '#16a34a', borderRadius: '50%' }} />
          <span style={{ fontWeight: 700 }}>FlowLeads Admin</span>
        </div>
        <button onClick={() => { setShowForm(true); setEditingLead(null); resetForm() }} style={{ background: '#16a34a', color: '#fff', padding: '10px 20px', borderRadius: 8, fontSize: 13, fontWeight: 600, border: 'none', cursor: 'pointer' }}>
          + Add Lead
        </button>
      </nav>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: 32 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h1 style={{ fontSize: 28, fontWeight: 800 }}>Leads ({leads.length})</h1>
          <button onClick={fetchLeads} style={{ background: '#fff', border: '1px solid #e0e0dc', padding: '8px 16px', borderRadius: 6, fontSize: 13, cursor: 'pointer' }}>
            Refresh
          </button>
        </div>

        {loading && <p>Loading...</p>}

        <div style={{ display: 'grid', gap: 12 }}>
          {leads.map(lead => (
            <div key={lead.id} style={{ background: '#fff', border: '1px solid #e0e0dc', borderRadius: 12, padding: 20, display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 48, height: 48, background: '#f4f4f2', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>
                {lead.icon || '📋'}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{ fontWeight: 700, fontSize: 15 }}>{lead.title}</span>
                  <span style={{
                    fontSize: 11,
                    padding: '2px 8px',
                    borderRadius: 10,
                    fontWeight: 600,
                    background: lead.status === 'available' ? '#f0fdf4' : lead.status === 'sold' ? '#fef2f2' : '#f4f4f2',
                    color: lead.status === 'available' ? '#16a34a' : lead.status === 'sold' ? '#dc2626' : '#666'
                  }}>
                    {lead.status}
                  </span>
                  {lead.verified && <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 10, fontWeight: 600, background: '#eff6ff', color: '#2563eb' }}>✓ Verified</span>}
                </div>
                <div style={{ fontSize: 13, color: '#888' }}>
                  {lead.category} · {lead.location || 'UK'} · £{lead.price}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => editLead(lead)} style={{ background: '#f4f4f2', border: 'none', padding: '8px 14px', borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Edit</button>
                <button onClick={() => deleteLead(lead.id)} style={{ background: '#fef2f2', color: '#dc2626', border: 'none', padding: '8px 14px', borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', borderRadius: 16, width: 560, maxHeight: '90vh', overflow: 'auto' }}>
            <div style={{ padding: 24, borderBottom: '1px solid #f0f0ee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: 20, fontWeight: 700 }}>{editingLead ? 'Edit Lead' : 'Add New Lead'}</h2>
              <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', fontSize: 24, cursor: 'pointer', color: '#999' }}>×</button>
            </div>
            <form onSubmit={handleSubmit} style={{ padding: 24 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: '#666', display: 'block', marginBottom: 6 }}>Icon</label>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {icons.map(icon => (
                      <button key={icon} type="button" onClick={() => setForm({...form, icon})} style={{ width: 36, height: 36, borderRadius: 8, border: form.icon === icon ? '2px solid #16a34a' : '1px solid #e0e0dc', background: '#fff', cursor: 'pointer', fontSize: 18 }}>{icon}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: '#666', display: 'block', marginBottom: 6 }}>Category</label>
                  <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #e0e0dc', fontSize: 14 }}>
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#666', display: 'block', marginBottom: 6 }}>Title *</label>
                <input required value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="e.g. Pizza concept, East London" style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #e0e0dc', fontSize: 14, boxSizing: 'border-box' }} />
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#666', display: 'block', marginBottom: 6 }}>Detail</label>
                <textarea value={form.detail} onChange={e => setForm({...form, detail: e.target.value})} placeholder="Brief description of the lead requirements" rows={3} style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #e0e0dc', fontSize: 14, resize: 'vertical', boxSizing: 'border-box' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: '#666', display: 'block', marginBottom: 6 }}>Location</label>
                  <input value={form.location} onChange={e => setForm({...form, location: e.target.value})} placeholder="e.g. Manchester" style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #e0e0dc', fontSize: 14, boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: '#666', display: 'block', marginBottom: 6 }}>Price (£) *</label>
                  <input required type="number" value={form.price} onChange={e => setForm({...form, price: e.target.value})} placeholder="45" style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #e0e0dc', fontSize: 14, boxSizing: 'border-box' }} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: '#666', display: 'block', marginBottom: 6 }}>Budget Min (£)</label>
                  <input type="number" value={form.budget_min} onChange={e => setForm({...form, budget_min: e.target.value})} placeholder="1500" style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #e0e0dc', fontSize: 14, boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: '#666', display: 'block', marginBottom: 6 }}>Budget Max (£)</label>
                  <input type="number" value={form.budget_max} onChange={e => setForm({...form, budget_max: e.target.value})} placeholder="3000" style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #e0e0dc', fontSize: 14, boxSizing: 'border-box' }} />
                </div>
              </div>

              <div style={{ background: '#f9fafb', borderRadius: 10, padding: 16, marginBottom: 16 }}>
                <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 12 }}>Contact Information (hidden until purchased)</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                  <input value={form.contact_name} onChange={e => setForm({...form, contact_name: e.target.value})} placeholder="Name" style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid #e0e0dc', fontSize: 14 }} />
                  <input value={form.contact_email} onChange={e => setForm({...form, contact_email: e.target.value})} placeholder="Email" style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid #e0e0dc', fontSize: 14 }} />
                  <input value={form.contact_phone} onChange={e => setForm({...form, contact_phone: e.target.value})} placeholder="Phone" style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid #e0e0dc', fontSize: 14 }} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
                  <input type="checkbox" checked={form.exclusive} onChange={e => setForm({...form, exclusive: e.target.checked})} />
                  Exclusive (sold once only)
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
                  <input type="checkbox" checked={form.verified} onChange={e => setForm({...form, verified: e.target.checked})} />
                  Verified lead
                </label>
                <div style={{ marginLeft: 'auto' }}>
                  <select value={form.status} onChange={e => setForm({...form, status: e.target.value})} style={{ padding: '6px 12px', borderRadius: 6, border: '1px solid #e0e0dc', fontSize: 13 }}>
                    <option value="available">Available</option>
                    <option value="sold">Sold</option>
                    <option value="expired">Expired</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setShowForm(false)} style={{ padding: '12px 24px', borderRadius: 8, border: '1px solid #e0e0dc', background: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
                <button type="submit" disabled={loading} style={{ padding: '12px 24px', borderRadius: 8, border: 'none', background: '#111', color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
                  {loading ? 'Saving...' : (editingLead ? 'Update Lead' : 'Add Lead')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
