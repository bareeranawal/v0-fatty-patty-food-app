"use client"

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { 
  Search, 
  Filter, 
  Clock, 
  MapPin, 
  Store,
  Phone,
  X,
  Loader2,
  RefreshCw,
  ChevronRight
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface OrderItem {
  id: string
  name: string
  title?: string | null
  type: 'menu_item' | 'deal'
  quantity: number
  unitPrice: number
  totalPrice: number
  addOns?: Array<{ id: string; name: string; price: number }>
  specialInstructions?: string | null
}

interface Order {
  id: string
  order_number: string
  customer_name: string
  customer_phone: string
  customer_email: string | null
  order_type: 'delivery' | 'pickup'
  status: string
  delivery_area: string | null
  delivery_address: string | null
  pickup_branch: string | null
  delivery_fee: number
  subtotal: number
  total: number
  special_instructions: string | null
  estimated_time: string | null
  created_at: string
  items: OrderItem[]
}

const statusOptions = [
  { value: 'all', label: 'All Orders' },
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'preparing', label: 'Preparing' },
  { value: 'ready', label: 'Ready' },
  { value: 'out_for_delivery', label: 'Out for Delivery' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'picked_up', label: 'Picked Up' },
  { value: 'cancelled', label: 'Cancelled' },
]

const nextStatusMap: Record<string, string[]> = {
  pending: ['confirmed', 'cancelled'],
  confirmed: ['preparing', 'cancelled'],
  preparing: ['ready', 'cancelled'],
  ready: ['out_for_delivery', 'picked_up', 'cancelled'],
  out_for_delivery: ['delivered', 'cancelled'],
}

function OrdersContent() {
  const searchParams = useSearchParams()
  const [orders, setOrders] = useState<Order[]>([])
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || 'all')
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)

  const fetchOrders = async () => {
    setIsLoading(true)
    try {
      const url = statusFilter === 'all' 
        ? '/api/admin/orders' 
        : `/api/admin/orders?status=${statusFilter}`
      const response = await fetch(url)
      const data = await response.json()
      if (data.data) setOrders(data.data)
    } catch (error) {
      console.error('Error fetching orders:', error)
      toast.error('Failed to fetch orders')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
    const interval = setInterval(fetchOrders, 30000)
    return () => clearInterval(interval)
  }, [statusFilter])

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    setIsUpdating(true)
    try {
      const response = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      
      const data = await response.json()
      if (data.error) throw new Error(data.error)

      setOrders(prev => prev.map(o => 
        o.id === orderId ? { ...o, status: newStatus } : o
      ))
      
      if (selectedOrder?.id === orderId) {
        setSelectedOrder(prev => prev ? { ...prev, status: newStatus } : null)
      }

      toast.success(`Order status updated to ${newStatus.replace('_', ' ')}`)
    } catch (error) {
      toast.error('Failed to update order status')
    } finally {
      setIsUpdating(false)
    }
  }

  const filteredOrders = orders.filter(order => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      order.order_number.toLowerCase().includes(query) ||
      order.customer_name.toLowerCase().includes(query) ||
      order.customer_phone.includes(query)
    )
  })

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      confirmed: 'bg-blue-100 text-blue-800 border-blue-200',
      preparing: 'bg-orange-100 text-orange-800 border-orange-200',
      ready: 'bg-green-100 text-green-800 border-green-200',
      out_for_delivery: 'bg-purple-100 text-purple-800 border-purple-200',
      delivered: 'bg-green-100 text-green-800 border-green-200',
      picked_up: 'bg-green-100 text-green-800 border-green-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200',
    }
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-6">
      {/* Orders List */}
      <div className="flex w-full flex-col lg:w-1/2">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Orders</h1>
          <button
            onClick={fetchOrders}
            disabled={isLoading}
            className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground hover:bg-muted"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Filters */}
        <div className="mb-4 flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-border bg-background py-2 pl-10 pr-4 text-sm focus:border-brand-red focus:outline-none focus:ring-2 focus:ring-brand-red/20"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none rounded-lg border border-border bg-background py-2 pl-10 pr-8 text-sm focus:border-brand-red focus:outline-none focus:ring-2 focus:ring-brand-red/20"
            >
              {statusOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Orders List */}
        <div className="flex-1 overflow-y-auto rounded-xl border border-border bg-card">
          {isLoading && orders.length === 0 ? (
            <div className="flex h-full items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-brand-red" />
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center p-8">
              <Clock className="mb-4 h-12 w-12 text-muted-foreground/30" />
              <p className="text-muted-foreground">No orders found</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {filteredOrders.map((order) => (
                <button
                  key={order.id}
                  onClick={() => setSelectedOrder(order)}
                  className={cn(
                    "flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-muted/50",
                    selectedOrder?.id === order.id && "bg-muted"
                  )}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-foreground">{order.order_number}</span>
                      <span className={`rounded-full border px-2 py-0.5 text-xs font-medium capitalize ${getStatusColor(order.status)}`}>
                        {order.status.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="mt-1 truncate text-sm text-muted-foreground">{order.customer_name}</p>
                    <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                      {order.order_type === 'delivery' ? (
                        <MapPin className="h-3 w-3" />
                      ) : (
                        <Store className="h-3 w-3" />
                      )}
                      <span className="capitalize">{order.order_type}</span>
                      <span>-</span>
                      <span>{formatDate(order.created_at)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-foreground">Rs. {order.total.toLocaleString()}</span>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Order Details Panel */}
      <div className="hidden lg:block lg:w-1/2">
        {selectedOrder ? (
          <div className="h-full overflow-y-auto rounded-xl border border-border bg-card">
            <div className="sticky top-0 flex items-center justify-between border-b border-border bg-card p-4">
              <div>
                <h2 className="text-lg font-bold text-foreground">{selectedOrder.order_number}</h2>
                <p className="text-sm text-muted-foreground">{formatDate(selectedOrder.created_at)}</p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="rounded-lg p-2 text-muted-foreground hover:bg-muted"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-4 space-y-6">
              {/* Status Actions */}
              {nextStatusMap[selectedOrder.status] && (
                <div>
                  <h3 className="mb-2 text-sm font-semibold text-foreground">Update Status</h3>
                  <div className="flex flex-wrap gap-2">
                    {nextStatusMap[selectedOrder.status].map((status) => (
                      <button
                        key={status}
                        onClick={() => updateOrderStatus(selectedOrder.id, status)}
                        disabled={isUpdating}
                        className={cn(
                          "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                          status === 'cancelled'
                            ? "border border-destructive text-destructive hover:bg-destructive/10"
                            : "bg-brand-red text-primary-foreground hover:bg-brand-red/90"
                        )}
                      >
                        {isUpdating ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          `Mark as ${status.replace('_', ' ')}`
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Customer Info */}
              <div>
                <h3 className="mb-2 text-sm font-semibold text-foreground">Customer</h3>
                <div className="rounded-lg border border-border p-3 space-y-2">
                  <p className="font-medium text-foreground">{selectedOrder.customer_name}</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <a href={`tel:${selectedOrder.customer_phone}`} className="hover:text-brand-red">
                      {selectedOrder.customer_phone}
                    </a>
                  </div>
                  {selectedOrder.customer_email && (
                    <p className="text-sm text-muted-foreground">{selectedOrder.customer_email}</p>
                  )}
                </div>
              </div>

              {/* Delivery/Pickup Info */}
              <div>
                <h3 className="mb-2 text-sm font-semibold text-foreground">
                  {selectedOrder.order_type === 'delivery' ? 'Delivery Address' : 'Pickup'}
                </h3>
                <div className="rounded-lg border border-border p-3">
                  <div className="flex items-start gap-2">
                    {selectedOrder.order_type === 'delivery' ? (
                      <>
                        <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground" />
                        <p className="text-sm text-foreground">{selectedOrder.delivery_address}</p>
                      </>
                    ) : (
                      <>
                        <Store className="mt-0.5 h-4 w-4 text-muted-foreground" />
                        <p className="text-sm text-foreground">Customer will pickup from branch</p>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="mb-2 text-sm font-semibold text-foreground">Items</h3>
                <div className="rounded-lg border border-border divide-y divide-border">
                  {selectedOrder.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3">
                      <div>
                        <p className="font-medium text-foreground">{item.quantity}x {item.item_name}</p>
                        <p className="text-sm text-muted-foreground">Rs. {item.unit_price.toLocaleString()} each</p>
                      </div>
                      <p className="font-semibold text-foreground">Rs. {item.total_price.toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Special Instructions */}
              {selectedOrder.special_instructions && (
                <div>
                  <h3 className="mb-2 text-sm font-semibold text-foreground">Special Instructions</h3>
                  <div className="rounded-lg border border-border p-3">
                    <p className="text-sm text-foreground">{selectedOrder.special_instructions}</p>
                  </div>
                </div>
              )}

              {/* Order Total */}
              <div className="rounded-lg border border-border p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-foreground">Rs. {selectedOrder.subtotal.toLocaleString()}</span>
                </div>
                {selectedOrder.delivery_fee > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Delivery Fee</span>
                    <span className="text-foreground">Rs. {selectedOrder.delivery_fee.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between border-t border-border pt-2">
                  <span className="font-bold text-foreground">Total</span>
                  <span className="text-lg font-bold text-brand-red">Rs. {selectedOrder.total_amount.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex h-full items-center justify-center rounded-xl border border-dashed border-border bg-muted/30">
            <div className="text-center">
              <Clock className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <p className="mt-4 text-muted-foreground">Select an order to view details</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function AdminOrdersPage() {
  return (
    <Suspense fallback={
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-red" />
      </div>
    }>
      <OrdersContent />
    </Suspense>
  )
}
