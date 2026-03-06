"use client"

import { motion } from 'framer-motion'
import { Package, Clock, CheckCircle2, Truck, ChefHat, ShoppingBag } from 'lucide-react'
import { cn } from '@/lib/utils'

// Mock order data - in a real app this would come from a database
const mockOrders = [
  {
    id: 'FP-ABC123',
    date: '2024-01-15',
    status: 'delivered',
    items: [
      { name: 'All American Burger', quantity: 2, price: 2300 },
      { name: 'Fatty Fries', quantity: 1, price: 850 },
      { name: 'Cold Drink', quantity: 2, price: 300 },
    ],
    total: 3450,
    orderType: 'delivery',
    area: 'DHA Phase 8',
  },
  {
    id: 'FP-XYZ789',
    date: '2024-01-10',
    status: 'delivered',
    items: [
      { name: 'Classic Wagyu', quantity: 1, price: 2800 },
      { name: 'Moroccan Chicken Bowl', quantity: 1, price: 1200 },
    ],
    total: 4000,
    orderType: 'pickup',
    branch: 'DHA Phase 8',
  },
]

const statusConfig = {
  pending: {
    label: 'Pending',
    color: 'bg-yellow-100 text-yellow-700',
    icon: Clock,
  },
  preparing: {
    label: 'Preparing',
    color: 'bg-blue-100 text-blue-700',
    icon: ChefHat,
  },
  'out-for-delivery': {
    label: 'Out for Delivery',
    color: 'bg-purple-100 text-purple-700',
    icon: Truck,
  },
  delivered: {
    label: 'Delivered',
    color: 'bg-green-100 text-green-700',
    icon: CheckCircle2,
  },
}

export default function OrderHistoryPage() {
  // For demo purposes, show empty state or mock data
  const orders = mockOrders // Change to [] to show empty state

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-serif text-2xl font-bold text-foreground">Order History</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          View and track your past orders
        </p>
      </div>

      {orders.length === 0 ? (
        /* Empty State */
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card p-12 text-center"
        >
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <ShoppingBag className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="mb-2 text-lg font-semibold text-foreground">No orders yet</h3>
          <p className="mb-6 max-w-sm text-sm text-muted-foreground">
            {"When you place an order, it will appear here. Start exploring our delicious menu!"}
          </p>
          <a
            href="/menu"
            className="rounded-xl bg-[#C1121F] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#C1121F]/90"
          >
            Browse Menu
          </a>
        </motion.div>
      ) : (
        /* Orders List */
        <div className="space-y-4">
          {orders.map((order, index) => {
            const status = statusConfig[order.status as keyof typeof statusConfig]
            const StatusIcon = status.icon

            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm"
              >
                {/* Order Header */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border bg-muted/30 px-5 py-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#C1121F]/10">
                      <Package className="h-5 w-5 text-[#C1121F]" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{order.id}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(order.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                  <div className={cn('flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold', status.color)}>
                    <StatusIcon className="h-3.5 w-3.5" />
                    {status.label}
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-5">
                  <div className="mb-4 space-y-2">
                    {order.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          {item.quantity}x {item.name}
                        </span>
                        <span className="font-medium text-foreground">
                          Rs. {item.price.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border pt-4">
                    <div className="text-xs text-muted-foreground">
                      {order.orderType === 'delivery' ? (
                        <span>Delivered to {order.area}</span>
                      ) : (
                        <span>Pickup from {order.branch}</span>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Total</p>
                      <p className="text-lg font-bold text-[#C1121F]">
                        Rs. {order.total.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}
