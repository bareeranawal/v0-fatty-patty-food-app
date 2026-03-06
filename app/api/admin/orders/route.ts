import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    const supabase = await createClient()

    let query = supabase
      .from('orders')
      .select(`
        *,
        items:order_items(*)
      `, { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (status && status !== 'all') {
      query = query.eq('status', status)
    }

    const { data: orders, error, count } = await query

    if (error) throw error

    return NextResponse.json({
      data: orders,
      count,
      error: null,
    })
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      { data: null, count: 0, error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}
