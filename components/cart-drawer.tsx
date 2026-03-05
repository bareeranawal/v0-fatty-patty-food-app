"use client"

import { useState } from 'react'
import Image from 'next/image'
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react'
import { useCart } from '@/lib/cart-context'
import { menuItems } from '@/lib/menu-data'
import type { MenuItem } from '@/lib/menu-data'
import { cn } from '@/lib/utils'
import { CheckoutModal } from './checkout-modal'

interface CartDrawerProps {
  onItemClick?: (item: MenuItem) => void
}

export function CartDrawer({ onItemClick }: CartDrawerProps) {
  const { items, removeItem, updateQuantity, isCartOpen, setIsCartOpen, subtotal, totalItems } = useCart()
  const [showCheckout, setShowCheckout] = useState(false)

  const deliveryFee = subtotal > 0 ? 150 : 0
  const total = subtotal + deliveryFee

  const handleItemClick = (itemId: string) => {
    const menuItem = menuItems.find((m) => m.id === itemId)
    if (menuItem && onItemClick) {
      setIsCartOpen(false)
      onItemClick(menuItem)
    }
  }

  return (
    <>
      {/* Overlay */}
      <div
        className={cn(
          'fixed inset-0 z-50 bg-brand-dark/50 backdrop-blur-sm transition-opacity duration-300',
          isCartOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        )}
        onClick={() => setIsCartOpen(false)}
      />

      {/* Drawer */}
      <div
        className={cn(
          'fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-card shadow-2xl transition-transform duration-300 ease-in-out',
          isCartOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border p-5">
          <div className="flex items-center gap-3">
            <ShoppingBag className="h-5 w-5 text-brand-red" />
            <h2 className="text-lg font-bold text-foreground">Your Cart</h2>
            {totalItems > 0 && (
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-red text-xs font-bold text-primary-foreground">
                {totalItems}
              </span>
            )}
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Close cart"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-5">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <ShoppingBag className="mb-4 h-16 w-16 text-muted-foreground/30" />
              <p className="mb-2 text-lg font-semibold text-foreground">Your cart is empty</p>
              <p className="text-sm text-muted-foreground">Add some delicious items to get started!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item, index) => {
                const addOnTotal = item.addOns.reduce((sum, addon) => sum + addon.price, 0)
                const itemTotal = (item.menuItem.price + addOnTotal) * item.quantity

                return (
                  <div
                    key={`${item.menuItem.id}-${index}`}
                    className="flex gap-3 rounded-xl border border-border bg-background p-3 transition-colors hover:border-brand-red/30"
                  >
                    {/* Clickable image */}
                    <button
                      onClick={() => handleItemClick(item.menuItem.id)}
                      className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg"
                      aria-label={`View ${item.menuItem.name}`}
                    >
                      <Image
                        src={item.menuItem.image}
                        alt={item.menuItem.name}
                        fill
                        className="object-cover"
                      />
                    </button>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <button
                          onClick={() => handleItemClick(item.menuItem.id)}
                          className="text-left"
                        >
                          <h4 className="text-sm font-bold text-foreground truncate hover:text-brand-red transition-colors">
                            {item.menuItem.name}
                          </h4>
                        </button>
                        <button
                          onClick={() => removeItem(index)}
                          className="flex-shrink-0 text-muted-foreground transition-colors hover:text-destructive"
                          aria-label={`Remove ${item.menuItem.name}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      {item.addOns.length > 0 && (
                        <p className="text-xs text-muted-foreground truncate">
                          + {item.addOns.map((a) => a.name).join(', ')}
                        </p>
                      )}
                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(index, item.quantity - 1)}
                            className="flex h-7 w-7 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:bg-muted"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-5 text-center text-sm font-semibold text-foreground">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(index, item.quantity + 1)}
                            className="flex h-7 w-7 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:bg-muted"
                            aria-label="Increase quantity"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <span className="text-sm font-bold text-brand-red">
                          Rs. {itemTotal.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-border p-5">
            <div className="mb-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium text-foreground">Rs. {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Delivery Fee</span>
                <span className="font-medium text-foreground">Rs. {deliveryFee}</span>
              </div>
              <div className="flex items-center justify-between border-t border-border pt-2">
                <span className="font-bold text-foreground">Total</span>
                <span className="text-lg font-bold text-brand-red">Rs. {total.toLocaleString()}</span>
              </div>
            </div>
            <button
              onClick={() => {
                setShowCheckout(true)
                setIsCartOpen(false)
              }}
              className="w-full rounded-xl bg-brand-red py-3.5 text-sm font-semibold text-primary-foreground transition-all hover:bg-brand-red/90"
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>

      {/* Checkout Modal */}
      {showCheckout && (
        <CheckoutModal onClose={() => setShowCheckout(false)} />
      )}
    </>
  )
}
