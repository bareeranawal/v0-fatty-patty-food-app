"use client"

import { useState, useEffect } from 'react'
import { X, CheckCircle2, Loader2, MapPin, Clock, Store } from 'lucide-react'
import { useCart, type CartItem } from '@/lib/cart-context'
import { useOrder, deliveryAreas, branches } from '@/lib/order-context'
import { toast } from 'sonner'

interface CheckoutModalProps {
  onClose: () => void
}

export function CheckoutModal({ onClose }: CheckoutModalProps) {
  const { items, subtotal, clearCart } = useCart()
  const { orderType, selectedArea, selectedBranch } = useOrder()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [orderNumber, setOrderNumber] = useState('')
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    area: selectedArea || '',
    orderType: orderType,
    branch: selectedBranch || '',
    notes: '',
  })

  const deliveryFee = formData.orderType === 'delivery' ? 150 : 0
  const taxRate = 0 // No tax for now
  const taxAmount = subtotal * taxRate
  const total = subtotal + deliveryFee + taxAmount
  const estimatedTime = formData.orderType === 'delivery' ? '35-45 minutes' : '15-20 minutes'

  // Lock body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation
    if (!formData.fullName.trim()) {
      toast.error('Please enter your name')
      return
    }
    if (!formData.phone.trim()) {
      toast.error('Please enter your phone number')
      return
    }
    if (formData.orderType === 'delivery' && !formData.area) {
      toast.error('Please select a delivery area')
      return
    }
    if (formData.orderType === 'delivery' && !formData.address.trim()) {
      toast.error('Please enter your delivery address')
      return
    }
    if (formData.orderType === 'pickup' && !formData.branch) {
      toast.error('Please select a pickup branch')
      return
    }

    setIsSubmitting(true)

    try {
      // Prepare cart items for API
      const cartItemsForApi = items.map((item: CartItem) => ({
        id: item.id,
        type: item.type,
        menuItem: item.menuItem ? {
          id: item.menuItem.id,
          name: item.menuItem.name,
          price: item.menuItem.price,
          image: item.menuItem.image,
        } : undefined,
        deal: item.deal ? {
          id: item.deal.id,
          name: item.deal.name,
          title: item.deal.title,
          price: item.deal.price,
          image: item.deal.image,
        } : undefined,
        dealSelections: item.dealSelections,
        quantity: item.quantity,
        customizations: {
          addOns: item.addOns,
          specialInstructions: item.specialInstructions,
        },
        unitPrice: item.unitPrice,
        totalPrice: item.totalPrice,
      }))

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: formData.fullName.trim(),
          customerPhone: formData.phone.trim(),
          customerEmail: formData.email.trim() || 'guest@fattypatty.pk',
          orderType: formData.orderType,
          pickupBranch: formData.orderType === 'pickup' ? (branches.find(b => b.id === formData.branch)?.name || formData.branch) : undefined,
          deliveryArea: formData.orderType === 'delivery' ? formData.area : undefined,
          deliveryAddress: formData.orderType === 'delivery' ? formData.address.trim() : undefined,
          deliveryFee,
          subtotal,
          total,
          specialInstructions: formData.notes.trim() || undefined,
          items: cartItemsForApi,
        }),
      })

      const result = await response.json()

      if (!response.ok || result.error) {
        throw new Error(result.error || 'Failed to place order')
      }

      // Try to send confirmation email (non-blocking)
      try {
        await fetch('/api/send-confirmation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            customerName: formData.fullName,
            email: formData.email,
            orderId: result.data.order_number,
            items: items.map(item => ({
              name: item.type === 'deal' 
                ? `${item.deal?.name} - ${item.deal?.title}` 
                : item.menuItem?.name,
              quantity: item.quantity,
              price: item.totalPrice,
            })),
            total,
            orderType: formData.orderType,
            estimatedTime,
            area: formData.area,
            branch: formData.branch ? branches.find(b => b.id === formData.branch)?.name : '',
          }),
        })
      } catch {
        // Email sending is non-critical
      }

      setOrderNumber(result.data.order_number)
      setOrderPlaced(true)
      clearCart()
      toast.success('Order placed successfully!')
    } catch (error) {
      console.error('Order submission error:', error)
      toast.error(error instanceof Error ? error.message : 'Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  if (orderPlaced) {
    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center bg-brand-dark/50 backdrop-blur-sm p-4">
        <div className="w-full max-w-md rounded-2xl bg-card p-8 text-center shadow-2xl animate-fade-in-up">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="mb-2 text-2xl font-bold text-foreground">Order Placed!</h2>
          <p className="mb-1 text-sm text-muted-foreground">
            Your order has been placed successfully.
          </p>
          <p className="mb-2 text-sm font-medium text-foreground">
            Order Number: <span className="text-brand-red font-bold">{orderNumber}</span>
          </p>
          <p className="mb-1 text-xs text-muted-foreground">
            Estimated Time: <span className="font-medium text-foreground">{estimatedTime}</span>
          </p>
          {formData.email && (
            <p className="mb-6 text-xs text-muted-foreground">
              A confirmation email has been sent to your email.
            </p>
          )}
          <div className="space-y-3">
            <a
              href={`/track?order=${orderNumber}&phone=${encodeURIComponent(formData.phone)}`}
              className="block w-full rounded-xl border border-brand-red py-3 text-sm font-semibold text-brand-red transition-all hover:bg-brand-red/5"
            >
              Track Your Order
            </a>
            <button
              onClick={onClose}
              className="w-full rounded-xl bg-brand-red py-3 text-sm font-semibold text-primary-foreground transition-all hover:bg-brand-red/90"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto bg-brand-dark/50 p-4 backdrop-blur-sm">
      <div className="my-8 w-full max-w-2xl rounded-2xl bg-card shadow-2xl animate-fade-in-up">
        <div className="flex items-center justify-between border-b border-border p-5">
          <h2 className="text-lg font-bold text-foreground">Checkout</h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Close checkout"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5">
          <div className="grid gap-6 lg:grid-cols-5">
            <div className="lg:col-span-3 space-y-5">
              {/* Customer Details */}
              <div>
                <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-foreground">Customer Details</h3>
                <div className="space-y-3">
                  <input
                    type="text"
                    required
                    placeholder="Full Name *"
                    value={formData.fullName}
                    onChange={(e) => updateField('fullName', e.target.value)}
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-brand-red focus:outline-none focus:ring-2 focus:ring-brand-red/20"
                  />
                  <input
                    type="email"
                    placeholder="Email Address (optional)"
                    value={formData.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-brand-red focus:outline-none focus:ring-2 focus:ring-brand-red/20"
                  />
                  <input
                    type="tel"
                    required
                    placeholder="Phone Number *"
                    value={formData.phone}
                    onChange={(e) => updateField('phone', e.target.value)}
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-brand-red focus:outline-none focus:ring-2 focus:ring-brand-red/20"
                  />
                </div>
              </div>

              {/* Order Type */}
              <div>
                <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-foreground">Order Type</h3>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => updateField('orderType', 'delivery')}
                    className={`flex-1 flex items-center justify-center gap-2 rounded-xl border py-3 text-sm font-medium transition-all ${
                      formData.orderType === 'delivery'
                        ? 'border-brand-red bg-brand-red/10 text-brand-red'
                        : 'border-border bg-background text-foreground hover:bg-muted'
                    }`}
                  >
                    <MapPin className="h-4 w-4" />
                    Delivery
                  </button>
                  <button
                    type="button"
                    onClick={() => updateField('orderType', 'pickup')}
                    className={`flex-1 flex items-center justify-center gap-2 rounded-xl border py-3 text-sm font-medium transition-all ${
                      formData.orderType === 'pickup'
                        ? 'border-brand-red bg-brand-red/10 text-brand-red'
                        : 'border-border bg-background text-foreground hover:bg-muted'
                    }`}
                  >
                    <Store className="h-4 w-4" />
                    Pickup
                  </button>
                </div>
              </div>

              {/* Delivery Details */}
              {formData.orderType === 'delivery' && (
                <div>
                  <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-foreground">Delivery Details</h3>
                  <div className="space-y-3">
                    <select
                      required
                      value={formData.area}
                      onChange={(e) => updateField('area', e.target.value)}
                      className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground focus:border-brand-red focus:outline-none focus:ring-2 focus:ring-brand-red/20"
                    >
                      <option value="">Select Delivery Area *</option>
                      {deliveryAreas.map((area) => (
                        <option key={area} value={area}>{area}</option>
                      ))}
                    </select>
                    <textarea
                      required
                      rows={2}
                      placeholder="Full Delivery Address *"
                      value={formData.address}
                      onChange={(e) => updateField('address', e.target.value)}
                      className="w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-brand-red focus:outline-none focus:ring-2 focus:ring-brand-red/20"
                    />
                  </div>
                </div>
              )}

              {/* Pickup Branch */}
              {formData.orderType === 'pickup' && (
                <div>
                  <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-foreground">Pickup Branch</h3>
                  <div className="space-y-2">
                    {branches.map((branch) => (
                      <button
                        key={branch.id}
                        type="button"
                        onClick={() => updateField('branch', branch.id)}
                        className={`flex w-full items-start gap-3 rounded-xl border p-4 text-left transition-all ${
                          formData.branch === branch.id
                            ? 'border-brand-red bg-brand-red/5'
                            : 'border-border bg-background hover:bg-muted'
                        }`}
                      >
                        <Store className={`h-5 w-5 mt-0.5 ${formData.branch === branch.id ? 'text-brand-red' : 'text-muted-foreground'}`} />
                        <div>
                          <p className="text-sm font-semibold text-foreground">{branch.name}</p>
                          <p className="text-xs text-muted-foreground">{branch.address}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes */}
              <div>
                <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-foreground">Special Instructions</h3>
                <textarea
                  rows={2}
                  placeholder="Any special requests or notes..."
                  value={formData.notes}
                  onChange={(e) => updateField('notes', e.target.value)}
                  className="w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-brand-red focus:outline-none focus:ring-2 focus:ring-brand-red/20"
                />
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-2">
              <div className="rounded-xl border border-border bg-background p-4 sticky top-4">
                <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-foreground">Order Summary</h3>
                <div className="mb-4 max-h-48 space-y-2 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground truncate mr-2">
                        {item.quantity}x {item.type === 'deal' 
                          ? `${item.deal?.name}` 
                          : item.menuItem?.name}
                      </span>
                      <span className="font-medium text-foreground flex-shrink-0">
                        Rs. {item.totalPrice.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="space-y-2 border-t border-border pt-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="text-foreground">Rs. {subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Delivery</span>
                    <span className="text-foreground">
                      {formData.orderType === 'pickup' ? 'Free' : `Rs. ${deliveryFee}`}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-t border-border pt-2">
                    <span className="font-bold text-foreground">Total</span>
                    <span className="text-lg font-bold text-brand-red">Rs. {total.toLocaleString()}</span>
                  </div>
                </div>
                
                {/* Estimated Time */}
                <div className="mt-4 flex items-center gap-2 rounded-lg bg-muted/50 p-3">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    Estimated: <span className="font-medium text-foreground">{estimatedTime}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-6 w-full flex items-center justify-center gap-2 rounded-xl bg-brand-red py-3.5 text-sm font-semibold text-primary-foreground transition-all hover:bg-brand-red/90 disabled:opacity-50 active:scale-[0.98]"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Placing Order...
              </>
            ) : (
              `Place Order - Rs. ${total.toLocaleString()}`
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
