"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Search, 
  Filter, 
  Clock, 
  ChefHat, 
  Truck, 
  CheckCircle2,
  MapPin,
  Store,
  Phone,
  ChevronDown,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

// Mock orders data
const mockOrders = [
  {
    id: 'FP-ABC123',
    customer: { name: 'Ahmed Khan', phone: '0300-1234567', email: 'ahmed@email.com' },
    items: [
      { name: 'All American Burger', quantity: 2, price: 2300 },
      { name: 'Fatty Fries', quantity: 1, price: 850 },
    ],
    total: 3450,
    status: 'pending',
    orderType: 'delivery',
    area: 'DHA Phase 8',
    address: 'House 123, Street 4, DHA Phase 8',
    time: '2024-01-15T14:30:00',
  },
  {
    id: 'FP-DEF456',
    customer: { name: 'Sara Ali', phone: '0321-9876543', email: 'sara@email.com' },
    items: [
      { name: 'Classic Wagyu', quantity: 1, price: 2800 },
      { name: 'Cold Drink', quantity: 2, price: 300 },
    ],
    total: 3100,
    status: 'preparing',
    orderType: 'pickup',
    branch: 'DHA Phase 8',
    time: '2024-01-15T14:15:00',
  },
  {
    id: 'FP-GHI789',
    customer: { name: 'Omar Hassan', phone: '0333-5551234', email: 'omar@email.com' },
    items: [
      { name: 'Chicken Jalapeno', quantity: 3, price: 2250 },
      { name: 'Fries', quantity: 2, price: 600 },
    ],
    total: 2850,
    status: 'out-for-delivery',
    orderType: 'delivery',
    area: 'Clifton',
    address: 'Apt 45, Clifton Block 5',
    time: '2024-01-15T13:45:00',
  },
  {
    id: 'FP-JKL012',
    customer: { name: 'Fatima Malik', phone: '0345-7771234', email: 'fatima@email.com' },
    items: [
      { name: 'Moroccan Chicken Bowl', quantity: 1, price: 1200 },
      { name: 'Alfredo Pasta Bowl', quantity: 1, price: 1200 },
    ],
    total: 2400,
    status: 'delivered',
    orderType: 'delivery',
    area: 'PECHS',
    address: 'House 78, Block 6, PECHS',
    time: '2024-01-15T12:30:00',
  },
]

const statusConfig = {
  pending: { 
    label: 'Pending', 
    color: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    icon: Clock,
    next: 'preparing',
    nextLabel: 'Start Preparing',
  },
  preparing: { 
    label: 'Preparing', 
    color: 'bg-blue-100 text-blue-700 border-blue-200',
    icon: ChefHat,
    next: 'out-for-delivery',
    nextLabel: 'Out for Delivery',
  },
  'out-for-delivery': { 
    label: 'Out for Delivery', 
    color: 'bg-purple-100 text-purple-700 border-purple-200',
    icon: Truck,
    next: 'delivered',
    nextLabel: 'Mark Delivered',
  },
  delivered: { 
    label: 'Delivered', 
    color: 'bg-green-100 text-green-700 border-green-200',
    icon: CheckCircle2,
    next: null,
    nextLabel: null,
  },
}

type OrderStatus = keyof typeof statusConfig

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState(mockOrders)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null)

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.phone.includes(searchQuery)
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleUpdateStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders(orders.map((order) => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ))
    toast.success(`Order ${orderId} marked as ${statusConfig[newStatus].label}`)
  }

  const statusCounts = {
    all: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    preparing: orders.filter(o => o.status === 'preparing').length,
    'out-for-delivery': orders.filter(o => o.status === 'out-for-delivery').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-serif text-2xl font-bold text-foreground">Orders</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage and track all customer orders
        </p>
      </div>

      {/* Status Tabs */}
      <div className="flex flex-wrap gap-2">
        {Object.entries(statusCounts).map(([status, count]) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={cn(
              'flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition-all',
              statusFilter === status
                ? 'bg-[#C1121F] text-white'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            )}
          >
            {status === 'all' ? 'All Orders' : statusConfig[status as OrderStatus]?.label || status}
            <span className={cn(
              'rounded-full px-1.5 py-0.5 text-[10px]',
              statusFilter === status ? 'bg-white/20' : 'bg-background'
            )}>
              {count}
            </span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search by order ID, customer name, or phone..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-xl border border-border bg-card pl-10 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-[#C1121F] focus:outline-none focus:ring-2 focus:ring-[#C1121F]/20"
        />
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.map((order, index) => {
          const status = statusConfig[order.status as OrderStatus]
          const StatusIcon = status.icon
          const isExpanded = expandedOrder === order.id

          return (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm"
            >
              {/* Order Header */}
              <button
                onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                className="flex w-full items-center justify-between p-4 text-left"
              >
                <div className="flex items-center gap-4">
                  <div className={cn('flex h-10 w-10 items-center justify-center rounded-xl', status.color)}>
                    <StatusIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-foreground">{order.id}</p>
                      <span className={cn('rounded-full border px-2 py-0.5 text-[10px] font-semibold', status.color)}>
                        {status.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{order.customer.name}</span>
                      <span>•</span>
                      <span>{new Date(order.time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <p className="text-lg font-bold text-[#C1121F]">Rs. {order.total.toLocaleString()}</p>
                  <ChevronDown className={cn('h-5 w-5 text-muted-foreground transition-transform', isExpanded && 'rotate-180')} />
                </div>
              </button>

              {/* Order Details (Expanded) */}
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="border-t border-border"
                >
                  <div className="p-4 space-y-4">
                    {/* Customer Info */}
                    <div className="flex flex-wrap gap-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span className="text-foreground">{order.customer.phone}</span>
                      </div>
                      {order.orderType === 'delivery' ? (
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="text-foreground">{order.area} - {order.address}</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-sm">
                          <Store className="h-4 w-4 text-muted-foreground" />
                          <span className="text-foreground">Pickup: {order.branch}</span>
                        </div>
                      )}
                    </div>

                    {/* Order Items */}
                    <div className="rounded-xl bg-muted/50 p-3">
                      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Order Items</p>
                      <div className="space-y-2">
                        {order.items.map((item, i) => (
                          <div key={i} className="flex items-center justify-between text-sm">
                            <span className="text-foreground">{item.quantity}x {item.name}</span>
                            <span className="font-medium text-foreground">Rs. {item.price.toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    {status.next && (
                      <button
                        onClick={() => handleUpdateStatus(order.id, status.next as OrderStatus)}
                        className="w-full rounded-xl bg-[#C1121F] py-3 text-sm font-semibold text-white transition-colors hover:bg-[#C1121F]/90"
                      >
                        {status.nextLabel}
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
            </motion.div>
          )
        })}
      </div>

      {filteredOrders.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card p-12 text-center">
          <p className="text-sm text-muted-foreground">No orders found</p>
        </div>
      )}
    </div>
  )
}
