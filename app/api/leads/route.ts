import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const category = searchParams.get('category')

  let query = supabaseAdmin
    .from('leads')
    .select('id, icon, title, detail, category, location, budget_min, budget_max, price, status, verified, created_at')
    .eq('status', 'available')
    .order('created_at', { ascending: false })

  if (category) query = query.eq('category', category)

  const { data, error } = await query

  if (error) {
    console.error('Leads fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch leads' }, { status: 500 })
  }

  return NextResponse.json({ leads: data ?? [], total: data?.length ?? 0 })
}
