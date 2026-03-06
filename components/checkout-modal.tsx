"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, CheckCircle2, MessageCircle } from 'lucide-react'
import { useCart } from '@/lib/cart-context'
import { useOrder, deliveryAreas, branches } from '@/lib/order-context'
import { toast } from 'sonner'

const WHATSAPP_NUMBER = "923342024000"

interface CheckoutModalProps {
  onClose: () => void
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

  const generateWhatsAppMessage = () => {
    const branchName = formData.branch ? branches.find(b => b.id === formData.branch)?.name : ''
    
    let message = `*New Order - Fatty Patty*\n\n`
    message += `*Order Type:* ${formData.orderType === 'delivery' ? 'Delivery' : 'Pickup'}\n`
    
    if (formData.orderType === 'delivery') {
      message += `*Area:* ${formData.area}\n`
      message += `*Address:* ${formData.address}\n`
    } else {
      message += `*Pickup Branch:* ${branchName}\n`
    }
    
    message += `\n*Items:*\n`
    items.forEach((item) => {
      const addOnTotal = item.addOns.reduce((sum, a) => sum + a.price, 0)
      const itemTotal = (item.menuItem.price + addOnTotal) * item.quantity
      message += `${item.quantity}x ${item.menuItem.name} - Rs. ${itemTotal.toLocaleString()}\n`
      if (item.addOns.length > 0) {
        message += `   Add-ons: ${item.addOns.map(a => a.name).join(', ')}\n`
      }
      if (item.specialInstructions) {
        message += `   Note: ${item.specialInstructions}\n`
      }
    })
    
    message += `\n*Subtotal:* Rs. ${subtotal.toLocaleString()}`
    if (formData.orderType === 'delivery') {
      message += `\n*Delivery Fee:* Rs. ${deliveryFee}`
    }
    message += `\n*Total:* Rs. ${total.toLocaleString()}`
    
    message += `\n\n*Customer Details:*\n`
    message += `Name: ${formData.fullName}\n`
    message += `Phone: ${formData.phone}\n`
    if (formData.email) {
      message += `Email: ${formData.email}\n`
    }
    
    if (formData.notes) {
      message += `\n*Special Instructions:*\n${formData.notes}`
    }
    
    return encodeURIComponent(message)
  }

  const handleWhatsAppOrder = () => {
    if (!formData.fullName || !formData.phone) {
      toast.error('Please fill in your name and phone number')
      return
    }
    if (formData.orderType === 'delivery' && (!formData.area || !formData.address)) {
      toast.error('Please fill in delivery area and address')
      return
    }
    if (formData.orderType === 'pickup' && !formData.branch) {
      toast.error('Please select a pickup branch')
      return
    }

    const message = generateWhatsAppMessage()
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank')
    
    // Clear cart and show success
    clearCart()
    setOrderPlaced(true)
    setOrderId(`FP-${Date.now().toString(36).toUpperCase()}`)
    toast.success('Opening WhatsApp to complete your order!')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.orderType === 'delivery' && !formData.area) {
      toast.error('Please select a delivery area')
      return
    }
    setIsSubmitting(true)

    try {
      // Simulate order processing
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const newOrderId = `FP-${Date.now().toString(36).toUpperCase()}`

      // Send confirmation email
      const emailItems = items.map((item) => {
        const addOnTotal = item.addOns.reduce((sum, a) => sum + a.price, 0)
        return {
          name: item.menuItem.name,
          quantity: item.quantity,
          price: (item.menuItem.price + addOnTotal) * item.quantity,
        }
      })

      await fetch('/api/send-confirmation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: formData.fullName,
          email: formData.email,
          orderId: newOrderId,
          items: emailItems,
          total,
          orderType: formData.orderType,
          estimatedTime,
          area: formData.area,
          branch: formData.branch ? branches.find(b => b.id === formData.branch)?.name : '',
        }),
      })

      setOrderId(newOrderId)
      setOrderPlaced(true)
      clearCart()
      toast.success('Order placed successfully!')
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
      <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#1A1A1A]/50 backdrop-blur-sm p-4">
        <motion.div 
          className="w-full max-w-md rounded-2xl bg-card p-8 text-center shadow-2xl"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <motion.div 
            className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
          >
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </motion.div>
          <h2 className="mb-2 text-2xl font-bold text-foreground">Order Placed!</h2>
          <p className="mb-1 text-sm text-muted-foreground">
            Your order has been placed successfully.
          </p>
          <p className="mb-2 text-sm font-medium text-foreground">
            Order ID: <span className="text-[#C1121F]">{orderId}</span>
          </p>
          <p className="mb-1 text-xs text-muted-foreground">
            Estimated Time: <span className="font-medium text-foreground">{estimatedTime}</span>
          </p>
          <p className="mb-6 text-xs text-muted-foreground">
            We will contact you shortly to confirm your order.
          </p>
          <button
            onClick={onClose}
            className="w-full rounded-xl bg-[#C1121F] py-3 text-sm font-semibold text-white transition-all hover:bg-[#C1121F]/90"
          >
            Done
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto bg-[#1A1A1A]/50 p-4 backdrop-blur-sm">
      <motion.div 
        className="my-8 w-full max-w-2xl rounded-2xl bg-card shadow-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
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
              <AnimatePresence mode="wait">
                {formData.orderType === 'delivery' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                  >
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
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Pickup Branch */}
              <AnimatePresence mode="wait">
                {formData.orderType === 'pickup' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                  >
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
                  </motion.div>
                )}
              </AnimatePresence>

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

          {/* Action Buttons */}
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={handleWhatsAppOrder}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#25D366] py-3.5 text-sm font-semibold text-white transition-all hover:bg-[#25D366]/90 active:scale-[0.98]"
            >
              <MessageCircle className="h-5 w-5" />
              Order via WhatsApp
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 rounded-xl bg-[#C1121F] py-3.5 text-sm font-semibold text-white transition-all hover:bg-[#C1121F]/90 disabled:opacity-50 active:scale-[0.98]"
            >
              {isSubmitting ? 'Placing Order...' : `Place Order - Rs. ${total.toLocaleString()}`}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}
