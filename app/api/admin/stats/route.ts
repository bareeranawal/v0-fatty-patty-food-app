import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await createClient()
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const todayISO = today.toISOString()

    // Get today's orders
    const { data: todayOrders, error: todayError } = await supabase
      .from('orders')
      .select('total_amount, status')
      .gte('created_at', todayISO)

    if (todayError) throw todayError

    // Get pending orders count
    const { count: pendingCount, error: pendingError } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .in('status', ['pending', 'confirmed', 'preparing'])

    if (pendingError) throw pendingError

    // Get total orders
    const { count: totalOrders, error: totalError } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })

    if (totalError) throw totalError

    // Calculate stats
    const todayRevenue = todayOrders?.reduce((sum, o) => sum + (o.total_amount || 0), 0) || 0
    const todayOrdersCount = todayOrders?.length || 0
    const completedTodayCount = todayOrders?.filter(o => 
      ['delivered', 'picked_up'].includes(o.status)
    ).length || 0

    return NextResponse.json({
      data: {
        todayRevenue,
        todayOrders: todayOrdersCount,
        pendingOrders: pendingCount || 0,
        totalOrders: totalOrders || 0,
        completedToday: completedTodayCount,
      },
      error: null,
    })
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json(
      { data: null, error: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}
