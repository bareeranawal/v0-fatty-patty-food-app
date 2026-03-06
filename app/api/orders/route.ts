import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

interface CartItemForOrder {
  id: string
  type: 'menu_item' | 'deal'
  menuItem?: {
    id: string
    name: string
    price: number
    image?: string
  }
  deal?: {
    id: string
    name: string
    title: string
    price: number
    image?: string
  }
  dealSelections?: Array<{
    group: string
    menuItem: { id: string; name: string }
    quantity: number
  }>
  quantity: number
  customizations?: {
    addOns?: Array<{ id: string; name: string; price: number }>
    specialInstructions?: string
  }
  unitPrice: number
  totalPrice: number
}

interface CreateOrderRequest {
  customerName: string
  customerPhone: string
  customerEmail?: string
  orderType: 'delivery' | 'pickup'
  deliveryArea?: string
  deliveryAddress?: string
  pickupBranch?: string
  deliveryFee: number
  subtotal: number
  total: number
  specialInstructions?: string
  items: CartItemForOrder[]
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const body: CreateOrderRequest = await request.json()

    // Validate required fields
    if (!body.customerName || !body.customerPhone || !body.items?.length) {
      return NextResponse.json(
        { data: null, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (!body.customerEmail) {
      return NextResponse.json(
        { data: null, error: 'Email is required' },
        { status: 400 }
      )
    }

    // Format items for storage in JSONB
    const itemsJsonb = body.items.map((item) => ({
      id: item.id,
      type: item.type,
      name: item.type === 'deal' ? item.deal?.name : item.menuItem?.name,
      title: item.type === 'deal' ? item.deal?.title : null,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      totalPrice: item.totalPrice,
      addOns: item.customizations?.addOns || [],
      specialInstructions: item.customizations?.specialInstructions || null,
      dealSelections: item.dealSelections || null,
    }))

    // Estimate time based on order type
    const estimatedTime = body.orderType === 'delivery' ? '35-45 minutes' : '15-20 minutes'

    // Create the order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        customer_name: body.customerName,
        customer_email: body.customerEmail,
        customer_phone: body.customerPhone,
        order_type: body.orderType,
        delivery_area: body.deliveryArea || null,
        delivery_address: body.deliveryAddress || null,
        pickup_branch: body.pickupBranch || null,
        items: itemsJsonb,
        subtotal: body.subtotal,
        delivery_fee: body.deliveryFee,
        total: body.total,
        status: 'pending',
        special_instructions: body.specialInstructions || null,
        estimated_time: estimatedTime,
      })
      .select()
      .single()

    if (orderError) {
      console.error('Supabase order error:', orderError)
      throw orderError
    }

    return NextResponse.json({
      data: order,
      error: null,
    })
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json(
      { data: null, error: 'Failed to create order' },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const orderNumber = searchParams.get('orderNumber')
    const phone = searchParams.get('phone')

    if (!orderNumber || !phone) {
      return NextResponse.json(
        { data: null, error: 'Order number and phone are required' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('order_number', orderNumber)
      .eq('customer_phone', phone)
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

    return NextResponse.json({ data, error: null })
  } catch (error) {
    console.error('Error fetching order:', error)
    return NextResponse.json(
      { data: null, error: 'Failed to fetch order' },
      { status: 500 }
    )
  }
}
