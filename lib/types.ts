export interface Lead {
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
  status: 'available' | 'sold' | 'expired'
  exclusive: boolean
  verified: boolean
}

export interface LeadPurchase {
  id: string
  created_at: string
  lead_id: string
  buyer_name: string
  buyer_email: string
  buyer_phone: string | null
  buyer_company: string | null
  amount_paid: number
  stripe_payment_id: string | null
  status: 'pending' | 'completed' | 'refunded'
}

export interface LeadRequest {
  id: string
  created_at: string
  name: string
  email: string
  phone: string | null
  lead_type: string | null
  location: string | null
  budget: string | null
  status: 'new' | 'contacted' | 'converted'
}
