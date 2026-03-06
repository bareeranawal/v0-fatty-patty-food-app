"use client"

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js'

interface Order {
  id: string
  order_number: string
  customer_name: string
  customer_phone: string
  customer_email: string | null
  order_type: 'delivery' | 'pickup'
  status: string
  delivery_address: string | null
  delivery_fee: number
  subtotal: number
  total_amount: number
  special_instructions: string | null
  created_at: string
}

interface UseRealtimeOrdersOptions {
  onNewOrder?: (order: Order) => void
  onOrderUpdate?: (order: Order) => void
}

export function useRealtimeOrders(options: UseRealtimeOrdersOptions = {}) {
  const [newOrderCount, setNewOrderCount] = useState(0)
  const [isConnected, setIsConnected] = useState(false)

  const clearNewOrderCount = useCallback(() => {
    setNewOrderCount(0)
  }, [])

  useEffect(() => {
    const supabase = createClient()

    const channel = supabase
      .channel('orders-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'orders',
        },
        (payload: RealtimePostgresChangesPayload<Order>) => {
          const newOrder = payload.new as Order
          setNewOrderCount((prev) => prev + 1)
          options.onNewOrder?.(newOrder)
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
        },
        (payload: RealtimePostgresChangesPayload<Order>) => {
          const updatedOrder = payload.new as Order
          options.onOrderUpdate?.(updatedOrder)
        }
      )
      .subscribe((status) => {
        setIsConnected(status === 'SUBSCRIBED')
      })

    return () => {
      supabase.removeChannel(channel)
    }
  }, [options])

  return {
    newOrderCount,
    clearNewOrderCount,
    isConnected,
  }
}
