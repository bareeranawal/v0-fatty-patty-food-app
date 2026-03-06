import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const orderNumber = searchParams.get('orderNumber')
    const phone = searchParams.get('phone')

    if (!orderNumber || !phone) {
      return NextResponse.json(
        { data: null, error: 'Order number and phone are required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Clean up phone number for comparison (remove spaces, dashes, etc.)
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '')

    const { data: order, error } = await supabase
      .from('orders')
      .select(`
        *,
        branch:branches(*),
        items:order_items(*),
        status_history:order_status_history(*)
      `)
      .eq('order_number', orderNumber.toUpperCase())
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { data: null, error: 'Order not found' },
          { status: 404 }
        )
      }
      throw error
    }

    // Verify phone number matches (clean both for comparison)
    const orderPhone = order.customer_phone.replace(/[\s\-\(\)]/g, '')
    if (!orderPhone.includes(cleanPhone) && !cleanPhone.includes(orderPhone)) {
      return NextResponse.json(
        { data: null, error: 'Phone number does not match order' },
        { status: 403 }
      )
    }

    return NextResponse.json({
      data: order,
      error: null,
    })
  } catch (error) {
    console.error('Error tracking order:', error)
    return NextResponse.json(
      { data: null, error: 'Failed to track order' },
      { status: 500 }
    )
  }
}
