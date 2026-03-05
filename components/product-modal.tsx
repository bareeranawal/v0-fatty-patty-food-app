"use client"

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { X, Plus, Minus, ShoppingBag, Check, Star } from 'lucide-react'
import type { MenuItem } from '@/lib/menu-data'
import { addOns } from '@/lib/menu-data'
import { useCart } from '@/lib/cart-context'
import { toast } from 'sonner'

interface ProductModalProps {
  item: MenuItem
  onClose: () => void
}

const sizes = [
  { id: 'small', label: 'Small', priceModifier: 0 },
  { id: 'medium', label: 'Medium', priceModifier: 150 },
  { id: 'large', label: 'Large', priceModifier: 300 },
]

export function ProductModal({ item, onClose }: ProductModalProps) {
  const [quantity, setQuantity] = useState(1)
  const [selectedSize, setSelectedSize] = useState('small')
  const [selectedAddOns, setSelectedAddOns] = useState<typeof addOns>([])
  const [specialInstructions, setSpecialInstructions] = useState('')
  const { addItem } = useCart()

  // Lock body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  const toggleAddOn = (addOn: (typeof addOns)[0]) => {
    setSelectedAddOns((prev) => {
      const exists = prev.find((a) => a.id === addOn.id)
      if (exists) return prev.filter((a) => a.id !== addOn.id)
      return [...prev, addOn]
    })
  }

  const sizeModifier = sizes.find((s) => s.id === selectedSize)?.priceModifier || 0
  const addOnTotal = selectedAddOns.reduce((sum, a) => sum + a.price, 0)
  const itemTotal = (item.price + sizeModifier + addOnTotal) * quantity

  const handleAddToCart = () => {
    const sizeAddOn = selectedSize !== 'small'
      ? [{ id: `size-${selectedSize}`, name: `Size: ${sizes.find(s => s.id === selectedSize)?.label}`, price: sizeModifier }]
      : []

    addItem({
      menuItem: item,
      quantity,
      addOns: [
        ...sizeAddOn,
        ...selectedAddOns.map((a) => ({ id: a.id, name: a.name, price: a.price })),
      ],
      specialInstructions: specialInstructions || undefined,
    })
    toast.success(`${item.name} added to cart!`)
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-brand-dark/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative flex w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-card shadow-2xl max-h-[90vh]"
        role="dialog"
        aria-modal="true"
        aria-label={`${item.name} details`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-brand-dark/50 text-primary-foreground backdrop-blur-sm transition-colors hover:bg-brand-dark/70"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Scrollable content */}
        <div className="overflow-y-auto">
          {/* Image */}
          <div className="relative h-56 w-full flex-shrink-0">
            <Image
              src={item.image}
              alt={item.name}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/40 to-transparent" />
            {/* Rating badge on image */}
            <div className="absolute left-4 bottom-4 flex items-center gap-1.5 rounded-full bg-brand-dark/70 px-3 py-1.5 backdrop-blur-sm">
              <Star className="h-4 w-4 fill-brand-gold text-brand-gold" />
              <span className="text-sm font-semibold text-primary-foreground">{item.rating}</span>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="mb-1 flex items-start justify-between gap-4">
              <h2 className="text-xl font-bold text-foreground">{item.name}</h2>
              <span className="flex-shrink-0 text-xl font-bold text-brand-red">
                Rs. {item.price.toLocaleString()}
              </span>
            </div>
            <p className="mb-6 text-sm leading-relaxed text-muted-foreground">{item.description}</p>

            {/* Size Options */}
            <div className="mb-5">
              <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-foreground">
                Choose Size
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {sizes.map((size) => (
                  <button
                    key={size.id}
                    onClick={() => setSelectedSize(size.id)}
                    className={`flex flex-col items-center rounded-xl border px-3 py-3 transition-all ${
                      selectedSize === size.id
                        ? 'border-brand-red bg-brand-red/5 ring-1 ring-brand-red'
                        : 'border-border bg-background hover:bg-muted'
                    }`}
                  >
                    <span className={`text-sm font-semibold ${selectedSize === size.id ? 'text-brand-red' : 'text-foreground'}`}>
                      {size.label}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {size.priceModifier === 0 ? 'Base' : `+Rs. ${size.priceModifier}`}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Add-ons */}
            <div className="mb-5">
              <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-foreground">
                Extras & Add-ons
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

            {/* Special Instructions */}
            <div className="mb-5">
              <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-foreground">
                Special Instructions
              </h3>
              <textarea
                rows={2}
                placeholder="Any special requests? (e.g., no onions, extra sauce)"
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                className="w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-brand-red focus:outline-none focus:ring-2 focus:ring-brand-red/20"
              />
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
          </div>
        </div>

        {/* Sticky Add to Cart Button */}
        <div className="flex-shrink-0 border-t border-border bg-card p-4">
          <button
            onClick={handleAddToCart}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-red py-3.5 text-sm font-semibold text-primary-foreground transition-all hover:bg-brand-red/90 active:scale-[0.98]"
          >
            <ShoppingBag className="h-4 w-4" />
            Add to Cart - Rs. {itemTotal.toLocaleString()}
          </button>
        </div>
      </div>
    </div>
  )
}
