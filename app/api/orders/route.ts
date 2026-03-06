import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import type { CartItem, OrderType, PaymentMethod } from '@/lib/types/database'

interface CreateOrderRequest {
  customerName: string
  customerPhone: string
  customerEmail?: string
  orderType: OrderType
  branchId?: string
  deliveryAddress?: string
  deliveryAreaId?: string
  deliveryFee: number
  subtotal: number
  taxAmount: number
  discountAmount: number
  totalAmount: number
  paymentMethod: PaymentMethod
  specialInstructions?: string
  items: CartItem[]
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

    // Create the order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        customer_name: body.customerName,
        customer_phone: body.customerPhone,
        customer_email: body.customerEmail || null,
        order_type: body.orderType,
        status: 'pending',
        branch_id: body.branchId || null,
        delivery_address: body.deliveryAddress || null,
        delivery_area_id: body.deliveryAreaId || null,
        delivery_fee: body.deliveryFee,
        subtotal: body.subtotal,
        tax_amount: body.taxAmount,
        discount_amount: body.discountAmount,
        total_amount: body.totalAmount,
        payment_method: body.paymentMethod,
        payment_status: body.paymentMethod === 'cash' ? 'pending' : 'pending',
        special_instructions: body.specialInstructions || null,
      })
      .select()
      .single()

    if (orderError) throw orderError

    // Create order items
    const orderItems = body.items.map((item) => ({
      order_id: order.id,
      menu_item_id: item.type === 'menu_item' ? item.menuItem?.id : null,
      deal_id: item.type === 'deal' ? item.deal?.id : null,
      item_name: item.type === 'menu_item' 
        ? item.menuItem?.name || 'Unknown Item'
        : item.deal?.name || 'Unknown Deal',
      quantity: item.quantity,
      unit_price: item.unitPrice,
      total_price: item.totalPrice,
      customizations: item.customizations 
        ? {
            addOns: item.customizations.addOns?.map(a => ({ id: a.id, name: a.name, price: a.price })),
            drinkOption: item.customizations.drinkOption 
              ? { id: item.customizations.drinkOption.id, name: item.customizations.drinkOption.name, price: item.customizations.drinkOption.price }
              : null,
            dealSelections: item.dealSelections?.map(s => ({ 
              group: s.group, 
              menuItemId: s.menuItem.id, 
              menuItemName: s.menuItem.name,
              quantity: s.quantity 
            })),
          }
        : null,
      special_instructions: item.customizations?.specialInstructions || null,
    }))

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems)

    if (itemsError) throw itemsError

    // Create initial status history entry
    await supabase
      .from('order_status_history')
      .insert({
        order_id: order.id,
        status: 'pending',
        notes: 'Order placed',
      })

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
