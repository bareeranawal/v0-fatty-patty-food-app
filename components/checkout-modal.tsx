"use client"

import { useState } from 'react'
import { X, CheckCircle2, MessageCircle } from 'lucide-react'
import { useCart } from '@/lib/cart-context'
import { useOrder, deliveryAreas, branches } from '@/lib/order-context'
import { toast } from 'sonner'

interface CheckoutModalProps {
  onClose: () => void
}

const WHATSAPP_NUMBER = '923342024000'

function generateWhatsAppMessage(
  items: { name: string; quantity: number; price: number; addOns?: string[] }[],
  total: number,
  orderType: string,
  customerInfo: {
    fullName: string
    phone: string
    address?: string
    area?: string
    branch?: string
    notes?: string
  }
) {
  let message = `*New Order - Fatty Patty*\n\n`
  message += `*Order Type:* ${orderType === 'delivery' ? 'Delivery' : 'Pickup'}\n`
  
  if (orderType === 'delivery' && customerInfo.area) {
    message += `*Area:* ${customerInfo.area}\n`
  } else if (orderType === 'pickup' && customerInfo.branch) {
    message += `*Branch:* ${customerInfo.branch}\n`
  }
  
  message += `\n*Items:*\n`
  items.forEach((item) => {
    message += `${item.quantity}x ${item.name} - Rs. ${item.price.toLocaleString()}\n`
    if (item.addOns && item.addOns.length > 0) {
      message += `   + ${item.addOns.join(', ')}\n`
    }
  })
  
  message += `\n*Total:* Rs. ${total.toLocaleString()}\n\n`
  message += `*Customer Details:*\n`
  message += `Name: ${customerInfo.fullName}\n`
  message += `Phone: ${customerInfo.phone}\n`
  
  if (orderType === 'delivery' && customerInfo.address) {
    message += `Address: ${customerInfo.address}\n`
  }
  
  if (customerInfo.notes) {
    message += `\n*Special Instructions:*\n${customerInfo.notes}\n`
  }
  
  return encodeURIComponent(message)
}

export function CheckoutModal({ onClose }: CheckoutModalProps) {
  const { items, subtotal, clearCart } = useCart()
  const { orderType, selectedArea, selectedBranch } = useOrder()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [orderId, setOrderId] = useState('')
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
  const total = subtotal + deliveryFee
  const estimatedTime = formData.orderType === 'delivery' ? '35-45 minutes' : '15-20 minutes'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.orderType === 'delivery' && !formData.area) {
      toast.error('Please select a delivery area')
      return
    }
    if (formData.orderType === 'pickup' && !formData.branch) {
      toast.error('Please select a pickup branch')
      return
    }
    setIsSubmitting(true)

    try {
      // Simulate order processing
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const newOrderId = `FP-${Date.now().toString(36).toUpperCase()}`

      // Prepare items for WhatsApp message
      const orderItems = items.map((item) => {
        const addOnTotal = item.addOns.reduce((sum, a) => sum + a.price, 0)
        return {
          name: item.menuItem.name,
          quantity: item.quantity,
          price: (item.menuItem.price + addOnTotal) * item.quantity,
          addOns: item.addOns.map(a => a.name),
        }
      })

      // Generate WhatsApp message
      const branchName = formData.branch ? branches.find(b => b.id === formData.branch)?.name : ''
      const whatsappMessage = generateWhatsAppMessage(
        orderItems,
        total,
        formData.orderType,
        {
          fullName: formData.fullName,
          phone: formData.phone,
          address: formData.address,
          area: formData.area,
          branch: branchName || '',
          notes: formData.notes,
        }
      )

      // Open WhatsApp in new tab
      const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMessage}`
      window.open(whatsappUrl, '_blank')

      // Send confirmation email (optional)
      try {
        await fetch('/api/send-confirmation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            customerName: formData.fullName,
            email: formData.email,
            orderId: newOrderId,
            items: orderItems,
            total,
            orderType: formData.orderType,
            estimatedTime,
            area: formData.area,
            branch: branchName,
          }),
        })
      } catch {
        // Email is optional, don't fail the order
      }

      setOrderId(newOrderId)
      setOrderPlaced(true)
      clearCart()
      toast.success('Order sent to WhatsApp!')
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  if (orderPlaced) {
    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#1a1a1a]/50 backdrop-blur-sm p-4">
        <div className="w-full max-w-md rounded-2xl bg-card p-8 text-center shadow-2xl animate-fade-in-up">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="mb-2 font-serif text-2xl font-bold text-foreground">Order Sent!</h2>
          <p className="mb-1 text-sm text-muted-foreground">
            Your order has been sent to our WhatsApp.
          </p>
          <p className="mb-2 text-sm font-medium text-foreground">
            Order ID: <span className="text-[#C1121F]">{orderId}</span>
          </p>
          <p className="mb-1 text-xs text-muted-foreground">
            Estimated Time: <span className="font-medium text-foreground">{estimatedTime}</span>
          </p>
          <p className="mb-6 text-xs text-muted-foreground">
            Please complete your order on WhatsApp. Our team will confirm shortly.
          </p>
          <div className="flex gap-3">
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#25D366] py-3 text-sm font-semibold text-white transition-all hover:bg-[#25D366]/90"
            >
              <MessageCircle className="h-4 w-4" />
              Open WhatsApp
            </a>
            <button
              onClick={onClose}
              className="flex-1 rounded-xl bg-[#C1121F] py-3 text-sm font-semibold text-white transition-all hover:bg-[#C1121F]/90"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto bg-[#1a1a1a]/50 p-4 backdrop-blur-sm">
      <div className="my-8 w-full max-w-2xl rounded-2xl bg-card shadow-2xl animate-fade-in-up">
        <div className="flex items-center justify-between border-b border-border p-5">
          <div className="flex items-center gap-3">
            <h2 className="font-serif text-lg font-bold text-foreground">Checkout</h2>
            <span className="flex items-center gap-1.5 rounded-full bg-[#25D366]/10 px-3 py-1 text-xs font-medium text-[#25D366]">
              <MessageCircle className="h-3 w-3" />
              via WhatsApp
            </span>
          </div>
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
                    placeholder="Full Name"
                    value={formData.fullName}
                    onChange={(e) => updateField('fullName', e.target.value)}
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-[#C1121F] focus:outline-none focus:ring-2 focus:ring-[#C1121F]/20"
                  />
                  <input
                    type="email"
                    placeholder="Email Address (optional)"
                    value={formData.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-[#C1121F] focus:outline-none focus:ring-2 focus:ring-[#C1121F]/20"
                  />
                  <input
                    type="tel"
                    required
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={(e) => updateField('phone', e.target.value)}
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-[#C1121F] focus:outline-none focus:ring-2 focus:ring-[#C1121F]/20"
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
                    className={`flex-1 rounded-xl border py-3 text-sm font-medium transition-all ${
                      formData.orderType === 'delivery'
                        ? 'border-[#C1121F] bg-[#C1121F]/10 text-[#C1121F]'
                        : 'border-border bg-background text-foreground hover:bg-muted'
                    }`}
                  >
                    Delivery
                  </button>
                  <button
                    type="button"
                    onClick={() => updateField('orderType', 'pickup')}
                    className={`flex-1 rounded-xl border py-3 text-sm font-medium transition-all ${
                      formData.orderType === 'pickup'
                        ? 'border-[#C1121F] bg-[#C1121F]/10 text-[#C1121F]'
                        : 'border-border bg-background text-foreground hover:bg-muted'
                    }`}
                  >
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
                      className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground focus:border-[#C1121F] focus:outline-none focus:ring-2 focus:ring-[#C1121F]/20"
                    >
                      <option value="">Select Delivery Area</option>
                      {deliveryAreas.map((area) => (
                        <option key={area} value={area}>{area}</option>
                      ))}
                    </select>
                    <input
                      type="text"
                      required
                      placeholder="Full Delivery Address"
                      value={formData.address}
                      onChange={(e) => updateField('address', e.target.value)}
                      className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-[#C1121F] focus:outline-none focus:ring-2 focus:ring-[#C1121F]/20"
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
                            ? 'border-[#C1121F] bg-[#C1121F]/5'
                            : 'border-border bg-background hover:bg-muted'
                        }`}
                      >
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
                  rows={3}
                  placeholder="Any special requests or notes..."
                  value={formData.notes}
                  onChange={(e) => updateField('notes', e.target.value)}
                  className="w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-[#C1121F] focus:outline-none focus:ring-2 focus:ring-[#C1121F]/20"
                />
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-2">
              <div className="rounded-xl border border-border bg-background p-4">
                <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-foreground">Order Summary</h3>
                <div className="mb-4 max-h-48 space-y-2 overflow-y-auto">
                  {items.map((item, index) => {
                    const addOnTotal = item.addOns.reduce((sum, a) => sum + a.price, 0)
                    return (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground truncate mr-2">
                          {item.quantity}x {item.menuItem.name}
                        </span>
                        <span className="font-medium text-foreground flex-shrink-0">
                          Rs. {((item.menuItem.price + addOnTotal) * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    )
                  })}
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
                    <span className="text-lg font-bold text-[#C1121F]">Rs. {total.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] py-3.5 text-sm font-semibold text-white transition-all hover:bg-[#25D366]/90 disabled:opacity-50 active:scale-[0.98]"
          >
            <MessageCircle className="h-4 w-4" />
            {isSubmitting ? 'Processing...' : `Order via WhatsApp - Rs. ${total.toLocaleString()}`}
          </button>
        </form>
      </div>
    </div>
  )
}
