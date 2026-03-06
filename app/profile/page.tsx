"use client"

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  User, 
  Package, 
  MapPin, 
  Clock, 
  ChevronRight, 
  LogOut, 
  Edit2, 
  Check, 
  X,
  ShoppingBag,
  Star
} from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { CartDrawer } from '@/components/cart-drawer'
import { WelcomeScreen } from '@/components/welcome-screen'
import { useOrder } from '@/lib/order-context'
import { useUser, type Order } from '@/lib/user-context'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

type Tab = 'profile' | 'orders'

function getStatusColor(status: Order['status']) {
  switch (status) {
    case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
    case 'preparing': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
    case 'delivered': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
    default: return 'bg-gray-100 text-gray-800'
  }
}

function getStatusLabel(status: Order['status']) {
  switch (status) {
    case 'pending': return 'Pending'
    case 'preparing': return 'Preparing'
    case 'delivered': return 'Delivered'
    default: return status
  }
}

export default function ProfilePage() {
  const router = useRouter()
  const { hasCompletedSetup, isHydrated: orderHydrated } = useOrder()
  const { user, orders, isLoggedIn, isHydrated: userHydrated, updateProfile, logout } = useUser()
  const [activeTab, setActiveTab] = useState<Tab>('profile')
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  })

  // Auth modal state
  const [showAuthModal, setShowAuthModal] = useState(false)

  useEffect(() => {
    if (userHydrated && !isLoggedIn) {
      setShowAuthModal(true)
    }
  }, [userHydrated, isLoggedIn])

  useEffect(() => {
    if (user) {
      setEditForm({
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
      })
    }
  }, [user])

  const handleSaveProfile = () => {
    updateProfile(editForm)
    setIsEditing(false)
    toast.success('Profile updated successfully!')
  }

  const handleLogout = () => {
    logout()
    router.push('/')
    toast.success('Logged out successfully')
  }

  if (!orderHydrated || !userHydrated) {
    return null
  }

  if (!hasCompletedSetup) {
    return <WelcomeScreen />
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background pt-16">
        <div className="mx-auto max-w-4xl px-4 py-10 lg:px-8">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="font-serif text-3xl font-bold text-foreground">My Account</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Manage your profile and view order history
              </p>
            </div>
            {isLoggedIn && (
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            )}
          </div>

          {/* Tabs */}
          <div className="mb-8 flex gap-2 rounded-xl border border-border bg-card p-1">
            <button
              onClick={() => setActiveTab('profile')}
              className={cn(
                'flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-medium transition-all',
                activeTab === 'profile'
                  ? 'bg-[#C1121F] text-white shadow-sm'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <User className="h-4 w-4" />
              Profile
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={cn(
                'flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-medium transition-all',
                activeTab === 'orders'
                  ? 'bg-[#C1121F] text-white shadow-sm'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <Package className="h-4 w-4" />
              Order History
            </button>
          </div>

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              {/* Profile Card */}
              <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="font-serif text-xl font-bold text-foreground">Personal Information</h2>
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-2 rounded-full bg-[#C1121F]/10 px-4 py-2 text-sm font-medium text-[#C1121F] transition-colors hover:bg-[#C1121F]/20"
                    >
                      <Edit2 className="h-4 w-4" />
                      Edit
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={() => setIsEditing(false)}
                        className="flex items-center gap-1 rounded-full border border-border px-3 py-1.5 text-sm font-medium text-muted-foreground hover:bg-muted"
                      >
                        <X className="h-4 w-4" />
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveProfile}
                        className="flex items-center gap-1 rounded-full bg-[#C1121F] px-3 py-1.5 text-sm font-medium text-white hover:bg-[#C1121F]/90"
                      >
                        <Check className="h-4 w-4" />
                        Save
                      </button>
                    </div>
                  )}
                </div>

                {/* Avatar */}
                <div className="mb-6 flex items-center gap-4">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#C1121F] text-2xl font-bold text-white">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground">{user?.name || 'Guest User'}</h3>
                    <p className="text-sm text-muted-foreground">{user?.email || 'Not logged in'}</p>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Full Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editForm.name}
                        onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground focus:border-[#C1121F] focus:outline-none focus:ring-2 focus:ring-[#C1121F]/20"
                      />
                    ) : (
                      <p className="rounded-xl border border-border bg-muted/50 px-4 py-3 text-sm text-foreground">
                        {user?.name || '-'}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Email
                    </label>
                    {isEditing ? (
                      <input
                        type="email"
                        value={editForm.email}
                        onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground focus:border-[#C1121F] focus:outline-none focus:ring-2 focus:ring-[#C1121F]/20"
                      />
                    ) : (
                      <p className="rounded-xl border border-border bg-muted/50 px-4 py-3 text-sm text-foreground">
                        {user?.email || '-'}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Phone Number
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={editForm.phone}
                        onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="Enter phone number"
                        className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-[#C1121F] focus:outline-none focus:ring-2 focus:ring-[#C1121F]/20"
                      />
                    ) : (
                      <p className="rounded-xl border border-border bg-muted/50 px-4 py-3 text-sm text-foreground">
                        {user?.phone || '-'}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Delivery Address
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editForm.address}
                        onChange={(e) => setEditForm(prev => ({ ...prev, address: e.target.value }))}
                        placeholder="Enter delivery address"
                        className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-[#C1121F] focus:outline-none focus:ring-2 focus:ring-[#C1121F]/20"
                      />
                    ) : (
                      <p className="rounded-xl border border-border bg-muted/50 px-4 py-3 text-sm text-foreground">
                        {user?.address || '-'}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <h2 className="mb-4 font-serif text-xl font-bold text-foreground">Quick Actions</h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Link
                    href="/menu"
                    className="flex items-center gap-3 rounded-xl border border-border p-4 transition-colors hover:bg-muted"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#C1121F]/10">
                      <ShoppingBag className="h-5 w-5 text-[#C1121F]" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-foreground">Order Now</p>
                      <p className="text-xs text-muted-foreground">Browse our menu</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </Link>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="flex items-center gap-3 rounded-xl border border-border p-4 text-left transition-colors hover:bg-muted"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FCA311]/10">
                      <Package className="h-5 w-5 text-[#FCA311]" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-foreground">Track Orders</p>
                      <p className="text-xs text-muted-foreground">View order history</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              {orders.length === 0 ? (
                <div className="rounded-2xl border border-border bg-card p-12 text-center shadow-sm">
                  <Package className="mx-auto mb-4 h-16 w-16 text-muted-foreground/30" />
                  <h3 className="mb-2 font-serif text-xl font-bold text-foreground">No orders yet</h3>
                  <p className="mb-6 text-sm text-muted-foreground">
                    {"When you place an order, it will appear here."}
                  </p>
                  <Link
                    href="/menu"
                    className="inline-flex items-center gap-2 rounded-full bg-[#C1121F] px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-[#C1121F]/90"
                  >
                    <ShoppingBag className="h-4 w-4" />
                    Start Ordering
                  </Link>
                </div>
              ) : (
                orders.map((order) => (
                  <div
                    key={order.id}
                    className="rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:shadow-md"
                  >
                    <div className="mb-4 flex items-start justify-between">
                      <div>
                        <p className="text-sm font-bold text-foreground">Order #{order.id}</p>
                        <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {new Date(order.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {order.orderType === 'delivery' ? order.area : order.branch}
                          </span>
                        </div>
                      </div>
                      <span className={cn('rounded-full px-3 py-1 text-xs font-semibold', getStatusColor(order.status))}>
                        {getStatusLabel(order.status)}
                      </span>
                    </div>
                    
                    <div className="mb-4 space-y-2 border-t border-border pt-4">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">
                            {item.quantity}x {item.name}
                          </span>
                          <span className="font-medium text-foreground">
                            Rs. {item.price.toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between border-t border-border pt-4">
                      <span className="text-sm font-semibold text-foreground">Total</span>
                      <span className="text-lg font-bold text-[#C1121F]">
                        Rs. {order.total.toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
      <CartDrawer />

      {/* Auth Modal */}
      {showAuthModal && !isLoggedIn && (
        <AuthModal onClose={() => setShowAuthModal(false)} />
      )}
    </>
  )
}

function AuthModal({ onClose }: { onClose: () => void }) {
  const router = useRouter()
  const { login, signup } = useUser()
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      if (mode === 'login') {
        await login(formData.email, formData.password)
        toast.success('Welcome back!')
      } else {
        await signup({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          address: '',
          favoriteArea: '',
        })
        toast.success('Account created successfully!')
      }
      onClose()
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-[#1a1a1a]/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-card shadow-2xl animate-fade-in-up">
        <div className="border-b border-border p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 overflow-hidden rounded-full">
                <Image
                  src="/images/logo.png"
                  alt="Fatty Patty"
                  width={40}
                  height={40}
                  className="h-full w-full object-cover"
                />
              </div>
              <h2 className="font-serif text-xl font-bold text-foreground">
                {mode === 'login' ? 'Welcome Back' : 'Create Account'}
              </h2>
            </div>
            <button
              onClick={() => router.push('/')}
              className="rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            {mode === 'login'
              ? 'Sign in to access your profile and order history'
              : 'Join Fatty Patty for exclusive deals and faster checkout'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground focus:border-[#C1121F] focus:outline-none focus:ring-2 focus:ring-[#C1121F]/20"
                  placeholder="John Doe"
                />
              </div>
            )}
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Email
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground focus:border-[#C1121F] focus:outline-none focus:ring-2 focus:ring-[#C1121F]/20"
                placeholder="you@example.com"
              />
            </div>
            {mode === 'signup' && (
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Phone Number
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground focus:border-[#C1121F] focus:outline-none focus:ring-2 focus:ring-[#C1121F]/20"
                  placeholder="03XX XXXXXXX"
                />
              </div>
            )}
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Password
              </label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
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
            {isLoading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>

          <p className="mt-4 text-center text-sm text-muted-foreground">
            {mode === 'login' ? (
              <>
                {"Don't have an account? "}
                <button
                  type="button"
                  onClick={() => setMode('signup')}
                  className="font-semibold text-[#C1121F] hover:underline"
                >
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="font-semibold text-[#C1121F] hover:underline"
                >
                  Sign in
                </button>
              </>
            )}
          </p>
        </form>
      </div>
    </div>
  )
}
