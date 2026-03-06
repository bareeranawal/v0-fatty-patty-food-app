import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { status, notes } = await request.json()

    if (!status) {
      return NextResponse.json(
        { data: null, error: 'Status is required' },
        { status: 400 }
      )
    }

    const validStatuses = ['pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'picked_up', 'cancelled']
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { data: null, error: 'Invalid status' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Update order status
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .update({ 
        status,
        updated_at: new Date().toISOString(),
        ...(status === 'ready' && { actual_ready_time: new Date().toISOString() }),
      })
      .eq('id', id)
      .select()
      .single()

    if (orderError) throw orderError

    // Add status history entry
    await supabase
      .from('order_status_history')
      .insert({
        order_id: id,
        status,
        notes: notes || null,
      })

    return NextResponse.json({
      data: order,
      error: null,
    })
  } catch (error) {
    console.error('Error updating order status:', error)
    return NextResponse.json(
      { data: null, error: 'Failed to update order status' },
      { status: 500 }
    )
  }
}
