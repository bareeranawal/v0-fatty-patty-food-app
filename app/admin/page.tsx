"use client"

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  Package,
  Users,
  UtensilsCrossed,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  LogOut,
  Plus,
  RefreshCw,
  ChevronRight,
  X,
  Phone,
  MapPin,
} from 'lucide-react'
import { useAdmin, type AdminOrder } from '@/lib/admin-context'
import { menuItems as defaultMenuItems } from '@/lib/menu-data'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

type Tab = 'dashboard' | 'orders' | 'menu' | 'customers'

function getStatusColor(status: AdminOrder['status']) {
  switch (status) {
    case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
    case 'preparing': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
    case 'delivered': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
    default: return 'bg-gray-100 text-gray-800'
  }
}

function getStatusIcon(status: AdminOrder['status']) {
  switch (status) {
    case 'pending': return <AlertCircle className="h-4 w-4" />
    case 'preparing': return <Clock className="h-4 w-4" />
    case 'delivered': return <CheckCircle2 className="h-4 w-4" />
    default: return null
  }
}

export default function AdminPage() {
  const router = useRouter()
  const { 
    isAdminLoggedIn, 
    isHydrated, 
    orders, 
    login, 
    logout, 
    updateOrderStatus,
    addDemoOrder 
  } = useAdmin()
  const [activeTab, setActiveTab] = useState<Tab>('dashboard')
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null)

  useEffect(() => {
    if (isHydrated && !isAdminLoggedIn) {
      setShowLoginModal(true)
    }
  }, [isHydrated, isAdminLoggedIn])

  if (!isHydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#C1121F] border-t-transparent" />
      </div>
    )
  }

  if (!isAdminLoggedIn) {
    return <AdminLoginModal onLogin={login} onClose={() => router.push('/')} />
  }

  // Calculate stats
  const todayOrders = orders.filter(o => {
    const orderDate = new Date(o.createdAt)
    const today = new Date()
    return orderDate.toDateString() === today.toDateString()
  })
  const pendingOrders = orders.filter(o => o.status === 'pending')
  const totalRevenue = orders.filter(o => o.status === 'delivered').reduce((sum, o) => sum + o.total, 0)
  const avgOrderValue = orders.length > 0 ? Math.round(totalRevenue / orders.filter(o => o.status === 'delivered').length) || 0 : 0

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 border-r border-border bg-card lg:block">
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex items-center gap-3 border-b border-border p-6">
            <div className="h-10 w-10 overflow-hidden rounded-full">
              <Image
                src="/images/logo.png"
                alt="Fatty Patty"
                width={40}
                height={40}
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <h1 className="font-serif text-lg font-bold text-foreground">Fatty Patty</h1>
              <p className="text-xs text-muted-foreground">Admin Panel</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-4">
            {[
              { id: 'dashboard' as Tab, label: 'Dashboard', icon: LayoutDashboard },
              { id: 'orders' as Tab, label: 'Orders', icon: Package, badge: pendingOrders.length },
              { id: 'menu' as Tab, label: 'Menu Manager', icon: UtensilsCrossed },
              { id: 'customers' as Tab, label: 'Customers', icon: Users },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  'flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all',
                  activeTab === item.id
                    ? 'bg-[#C1121F] text-white'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
                {item.badge !== undefined && item.badge > 0 && (
                  <span className={cn(
                    'ml-auto flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-bold',
                    activeTab === item.id ? 'bg-white/20 text-white' : 'bg-[#C1121F] text-white'
                  )}>
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>

          {/* Logout */}
          <div className="border-t border-border p-4">
            <button
              onClick={() => { logout(); router.push('/') }}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
            >
              <LogOut className="h-5 w-5" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64">
        {/* Mobile Header */}
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-card p-4 lg:hidden">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 overflow-hidden rounded-full">
              <Image src="/images/logo.png" alt="Fatty Patty" width={32} height={32} className="h-full w-full object-cover" />
            </div>
            <span className="font-serif font-bold text-foreground">Admin</span>
          </div>
          <button
            onClick={() => { logout(); router.push('/') }}
            className="rounded-full p-2 text-muted-foreground hover:bg-muted"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </header>

        {/* Mobile Tab Bar */}
        <div className="sticky top-[57px] z-20 flex gap-1 border-b border-border bg-card p-2 lg:hidden">
          {[
            { id: 'dashboard' as Tab, icon: LayoutDashboard },
            { id: 'orders' as Tab, icon: Package },
            { id: 'menu' as Tab, icon: UtensilsCrossed },
            { id: 'customers' as Tab, icon: Users },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                'flex flex-1 items-center justify-center rounded-lg py-2.5 transition-all',
                activeTab === item.id ? 'bg-[#C1121F] text-white' : 'text-muted-foreground'
              )}
            >
              <item.icon className="h-5 w-5" />
            </button>
          ))}
        </div>

        <div className="p-6 lg:p-8">
          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-foreground">Dashboard</h2>
                  <p className="text-sm text-muted-foreground">Overview of your restaurant</p>
                </div>
                <button
                  onClick={addDemoOrder}
                  className="flex items-center gap-2 rounded-full bg-[#C1121F] px-4 py-2 text-sm font-semibold text-white hover:bg-[#C1121F]/90"
                >
                  <Plus className="h-4 w-4" />
                  Add Demo Order
                </button>
              </div>

              {/* Stats Grid */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  { label: "Today's Orders", value: todayOrders.length, icon: Package, color: 'bg-blue-500' },
                  { label: 'Pending Orders', value: pendingOrders.length, icon: AlertCircle, color: 'bg-yellow-500' },
                  { label: 'Total Revenue', value: `Rs. ${totalRevenue.toLocaleString()}`, icon: TrendingUp, color: 'bg-green-500' },
                  { label: 'Avg Order Value', value: `Rs. ${avgOrderValue.toLocaleString()}`, icon: TrendingUp, color: 'bg-purple-500' },
                ].map((stat) => (
                  <div key={stat.label} className="rounded-2xl border border-border bg-card p-5">
                    <div className="flex items-center justify-between">
                      <div className={cn('flex h-10 w-10 items-center justify-center rounded-xl text-white', stat.color)}>
                        <stat.icon className="h-5 w-5" />
                      </div>
                    </div>
                    <p className="mt-4 text-2xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Recent Orders */}
              <div className="rounded-2xl border border-border bg-card">
                <div className="flex items-center justify-between border-b border-border p-5">
                  <h3 className="font-serif text-lg font-bold text-foreground">Recent Orders</h3>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="flex items-center gap-1 text-sm font-medium text-[#C1121F] hover:underline"
                  >
                    View All
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
                <div className="divide-y divide-border">
                  {orders.slice(0, 5).map((order) => (
                    <button
                      key={order.id}
                      onClick={() => setSelectedOrder(order)}
                      className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-muted"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-foreground">#{order.id}</span>
                          <span className={cn('flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold', getStatusColor(order.status))}>
                            {getStatusIcon(order.status)}
                            {order.status}
                          </span>
                        </div>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {order.customerName} - {order.items.length} items
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-[#C1121F]">Rs. {order.total.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(order.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-foreground">Orders</h2>
                  <p className="text-sm text-muted-foreground">Manage customer orders</p>
                </div>
                <button
                  onClick={addDemoOrder}
                  className="flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
                >
                  <RefreshCw className="h-4 w-4" />
                  New Demo Order
                </button>
              </div>

              {/* Orders List */}
              <div className="space-y-3">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="rounded-2xl border border-border bg-card p-5 transition-all hover:shadow-md"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-foreground">#{order.id}</span>
                          <span className={cn('flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold', getStatusColor(order.status))}>
                            {getStatusIcon(order.status)}
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                        </div>
                        <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Users className="h-3.5 w-3.5" />
                            {order.customerName}
                          </span>
                          <span className="flex items-center gap-1">
                            <Phone className="h-3.5 w-3.5" />
                            {order.customerPhone}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5" />
                            {order.orderType === 'delivery' ? order.area : order.branch}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-[#C1121F]">Rs. {order.total.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(order.createdAt).toLocaleString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </div>

                    {/* Items */}
                    <div className="mt-4 border-t border-border pt-4">
                      <div className="flex flex-wrap gap-2">
                        {order.items.map((item, idx) => (
                          <span key={idx} className="rounded-full bg-muted px-3 py-1 text-xs text-foreground">
                            {item.quantity}x {item.name}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-4 flex flex-wrap gap-2">
                      {order.status === 'pending' && (
                        <button
                          onClick={() => { updateOrderStatus(order.id, 'preparing'); toast.success('Order status updated!') }}
                          className="rounded-full bg-blue-500 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-600"
                        >
                          Start Preparing
                        </button>
                      )}
                      {order.status === 'preparing' && (
                        <button
                          onClick={() => { updateOrderStatus(order.id, 'delivered'); toast.success('Order marked as delivered!') }}
                          className="rounded-full bg-green-500 px-4 py-2 text-xs font-semibold text-white hover:bg-green-600"
                        >
                          Mark Delivered
                        </button>
                      )}
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="rounded-full border border-border px-4 py-2 text-xs font-semibold text-foreground hover:bg-muted"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Menu Tab */}
          {activeTab === 'menu' && (
            <div className="space-y-6">
              <div>
                <h2 className="font-serif text-2xl font-bold text-foreground">Menu Manager</h2>
                <p className="text-sm text-muted-foreground">View and manage menu items</p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {defaultMenuItems.map((item) => (
                  <div key={item.id} className="rounded-2xl border border-border bg-card overflow-hidden">
                    <div className="relative h-32 w-full">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-bold text-foreground">{item.name}</h4>
                          <p className="text-xs text-muted-foreground line-clamp-1">{item.description}</p>
                        </div>
                        <span className="text-sm font-bold text-[#C1121F]">Rs. {item.price}</span>
                      </div>
                      <div className="mt-3 flex items-center gap-2">
                        <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                          {item.category}
                        </span>
                        {item.popular && (
                          <span className="rounded-full bg-[#FCA311]/20 px-2 py-0.5 text-xs font-medium text-[#FCA311]">
                            Popular
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Customers Tab */}
          {activeTab === 'customers' && (
            <div className="space-y-6">
              <div>
                <h2 className="font-serif text-2xl font-bold text-foreground">Customers</h2>
                <p className="text-sm text-muted-foreground">View customer information</p>
              </div>

              <div className="rounded-2xl border border-border bg-card">
                <div className="divide-y divide-border">
                  {[...new Map(orders.map(o => [o.customerPhone, o])).values()].map((order) => (
                    <div key={order.customerPhone} className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#C1121F] text-sm font-bold text-white">
                          {order.customerName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">{order.customerName}</p>
                          <p className="text-sm text-muted-foreground">{order.customerPhone}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-foreground">
                          {orders.filter(o => o.customerPhone === order.customerPhone).length} orders
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Rs. {orders.filter(o => o.customerPhone === order.customerPhone).reduce((sum, o) => sum + o.total, 0).toLocaleString()} total
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#1a1a1a]/60 p-4 backdrop-blur-sm"
          onClick={() => setSelectedOrder(null)}
        >
          <div
            className="w-full max-w-lg rounded-2xl bg-card shadow-2xl animate-fade-in-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-border p-5">
              <div>
                <h3 className="font-serif text-lg font-bold text-foreground">Order #{selectedOrder.id}</h3>
                <span className={cn('mt-1 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold', getStatusColor(selectedOrder.status))}>
                  {getStatusIcon(selectedOrder.status)}
                  {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                </span>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="rounded-full p-2 text-muted-foreground hover:bg-muted"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-5">
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-semibold uppercase text-muted-foreground">Customer</p>
                  <p className="font-medium text-foreground">{selectedOrder.customerName}</p>
                  <p className="text-sm text-muted-foreground">{selectedOrder.customerPhone}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase text-muted-foreground">
                    {selectedOrder.orderType === 'delivery' ? 'Delivery Address' : 'Pickup Branch'}
                  </p>
                  <p className="text-sm text-foreground">
                    {selectedOrder.orderType === 'delivery' 
                      ? `${selectedOrder.address}, ${selectedOrder.area}`
                      : selectedOrder.branch}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase text-muted-foreground">Items</p>
                  <div className="mt-2 space-y-2">
                    {selectedOrder.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <span className="text-foreground">{item.quantity}x {item.name}</span>
                        <span className="font-medium text-foreground">Rs. {item.price.toLocaleString()}</span>
                      </div>
                    ))}
                    <div className="flex justify-between border-t border-border pt-2">
                      <span className="font-bold text-foreground">Total</span>
                      <span className="font-bold text-[#C1121F]">Rs. {selectedOrder.total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 flex gap-2">
                {selectedOrder.status === 'pending' && (
                  <button
                    onClick={() => { 
                      updateOrderStatus(selectedOrder.id, 'preparing')
                      setSelectedOrder({ ...selectedOrder, status: 'preparing' })
                      toast.success('Order is now being prepared!')
                    }}
                    className="flex-1 rounded-xl bg-blue-500 py-3 text-sm font-semibold text-white hover:bg-blue-600"
                  >
                    Start Preparing
                  </button>
                )}
                {selectedOrder.status === 'preparing' && (
                  <button
                    onClick={() => { 
                      updateOrderStatus(selectedOrder.id, 'delivered')
                      setSelectedOrder({ ...selectedOrder, status: 'delivered' })
                      toast.success('Order marked as delivered!')
                    }}
                    className="flex-1 rounded-xl bg-green-500 py-3 text-sm font-semibold text-white hover:bg-green-600"
                  >
                    Mark Delivered
                  </button>
                )}
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="flex-1 rounded-xl border border-border py-3 text-sm font-semibold text-foreground hover:bg-muted"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function AdminLoginModal({ onLogin, onClose }: { onLogin: (email: string, password: string) => Promise<boolean>; onClose: () => void }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    
    const success = await onLogin(email, password)
    
    if (!success) {
      setError('Invalid credentials. Use admin@fattypatty.com / admin123')
    }
    setIsLoading(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1a1a1a] p-4">
      <div className="w-full max-w-md rounded-2xl bg-card shadow-2xl animate-fade-in-up">
        <div className="border-b border-border p-6 text-center">
          <div className="mx-auto mb-4 h-16 w-16 overflow-hidden rounded-full">
            <Image src="/images/logo.png" alt="Fatty Patty" width={64} height={64} className="h-full w-full object-cover" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-foreground">Admin Login</h2>
          <p className="mt-1 text-sm text-muted-foreground">Sign in to access the admin panel</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-4 rounded-xl bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground focus:border-[#C1121F] focus:outline-none focus:ring-2 focus:ring-[#C1121F]/20"
                placeholder="admin@fattypatty.com"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground focus:border-[#C1121F] focus:outline-none focus:ring-2 focus:ring-[#C1121F]/20"
                placeholder="Enter password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="mt-6 w-full rounded-xl bg-[#C1121F] py-3.5 text-sm font-semibold text-white transition-all hover:bg-[#C1121F]/90 disabled:opacity-50"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="mt-3 w-full rounded-xl border border-border py-3 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            Back to Website
          </button>

          <p className="mt-4 text-center text-xs text-muted-foreground">
            Demo credentials: admin@fattypatty.com / admin123
          </p>
        </form>
      </div>
    </div>
  )
}
