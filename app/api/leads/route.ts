import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

export async function GET() {
  const supabase = createServerClient()
  
  const { data: leads, error } = await supabase
    .from('leads')
    .select('id, created_at, icon, title, detail, category, location, budget_min, budget_max, price, status, exclusive, verified')
    .eq('status', 'available')
    .order('created_at', { ascending: false })
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  
  return NextResponse.json(leads)
}

export async function POST(request: Request) {
  const supabase = createServerClient()
  const body = await request.json()
  
  // Admin auth check would go here
  const adminKey = request.headers.get('x-admin-key')
  if (adminKey !== process.env.ADMIN_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  const { data, error } = await supabase
    .from('leads')
    .insert(body)
    .select()
    .single()
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  
  return NextResponse.json(data)
}
