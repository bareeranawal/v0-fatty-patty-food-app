"use client"

import { useState } from 'react'
import Image from 'next/image'
import { X, Plus, Minus, ShoppingBag, Check } from 'lucide-react'
import type { MenuItem } from '@/lib/menu-data'
import { addOns } from '@/lib/menu-data'
import { useCart } from '@/lib/cart-context'
import { toast } from 'sonner'

interface ProductModalProps {
  item: MenuItem
  onClose: () => void
}

export function ProductModal({ item, onClose }: ProductModalProps) {
  const [quantity, setQuantity] = useState(1)
  const [selectedAddOns, setSelectedAddOns] = useState<typeof addOns>([])
  const { addItem } = useCart()

  const toggleAddOn = (addOn: (typeof addOns)[0]) => {
    setSelectedAddOns((prev) => {
      const exists = prev.find((a) => a.id === addOn.id)
      if (exists) {
        return prev.filter((a) => a.id !== addOn.id)
      }
      return [...prev, addOn]
    })
  }

  const addOnTotal = selectedAddOns.reduce((sum, a) => sum + a.price, 0)
  const itemTotal = (item.price + addOnTotal) * quantity

  const handleAddToCart = () => {
    addItem({
      menuItem: item,
      quantity,
      addOns: selectedAddOns.map((a) => ({ id: a.id, name: a.name, price: a.price })),
    })
    toast.success(`${item.name} added to cart!`)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-brand-dark/50 p-4 backdrop-blur-sm">
      <div
        className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-card shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-label={`${item.name} details`}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-brand-dark/50 text-primary-foreground backdrop-blur-sm transition-colors hover:bg-brand-dark/70"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Image */}
        <div className="relative h-56 w-full">
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/40 to-transparent" />
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-1 flex items-start justify-between gap-4">
            <h2 className="text-xl font-bold text-foreground">{item.name}</h2>
            <span className="flex-shrink-0 text-xl font-bold text-brand-red">
              Rs. {item.price.toLocaleString()}
            </span>
          </div>
          <p className="mb-5 text-sm leading-relaxed text-muted-foreground">{item.description}</p>

          {/* Add-ons */}
          <div className="mb-5">
            <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-foreground">
              Customize Your Order
            </h3>
            <div className="space-y-2">
              {addOns.map((addOn) => {
                const isSelected = selectedAddOns.some((a) => a.id === addOn.id)
                return (
                  <button
                    key={addOn.id}
                    onClick={() => toggleAddOn(addOn)}
                    className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left transition-all ${
                      isSelected
                        ? 'border-brand-red bg-brand-red/5'
                        : 'border-border bg-background hover:bg-muted'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-5 w-5 items-center justify-center rounded-md border transition-colors ${
                          isSelected
                            ? 'border-brand-red bg-brand-red'
                            : 'border-border'
                        }`}
                      >
                        {isSelected && <Check className="h-3 w-3 text-primary-foreground" />}
                      </div>
                      <span className="text-sm font-medium text-foreground">{addOn.name}</span>
                    </div>
                    <span className="text-sm font-semibold text-brand-red">
                      +Rs. {addOn.price}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Quantity */}
          <div className="mb-5 flex items-center justify-between">
            <span className="text-sm font-bold text-foreground">Quantity</span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:bg-muted"
                aria-label="Decrease quantity"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-6 text-center text-lg font-bold text-foreground">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:bg-muted"
                aria-label="Increase quantity"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Add to Cart */}
          <button
            onClick={handleAddToCart}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-red py-3.5 text-sm font-semibold text-primary-foreground transition-all hover:bg-brand-red/90"
          >
            <ShoppingBag className="h-4 w-4" />
            Add to Cart - Rs. {itemTotal.toLocaleString()}
          </button>
        </div>
      </div>
    </div>
  )
}
