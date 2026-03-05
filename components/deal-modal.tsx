"use client"

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { X, Plus, Minus, ShoppingBag, Check, Flame } from 'lucide-react'
import type { Deal } from '@/lib/menu-data'
import { drinkOptions } from '@/lib/menu-data'
import { useCart } from '@/lib/cart-context'
import { toast } from 'sonner'

interface DealModalProps {
  deal: Deal
  onClose: () => void
}

export function DealModal({ deal, onClose }: DealModalProps) {
  const [quantity, setQuantity] = useState(1)
  const [specialInstructions, setSpecialInstructions] = useState('')
  const { addItem } = useCart()

  // Count how many cold drinks are in the deal
  const drinkCount = deal.items.filter(item => item.toLowerCase().includes('cold drink')).length || 1
  const [selectedDrinks, setSelectedDrinks] = useState<string[]>(Array(drinkCount).fill(''))

  const allDrinksSelected = selectedDrinks.every(d => d !== '')

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  const handleSelectDrink = (index: number, drinkId: string) => {
    setSelectedDrinks(prev => {
      const next = [...prev]
      next[index] = drinkId
      return next
    })
  }

  const handleAddToCart = () => {
    if (!allDrinksSelected) {
      toast.error('Please select all drink choices before adding to cart')
      return
    }

    const drinkAddOns = selectedDrinks.map((drinkId, i) => ({
      id: `deal-drink-${i}-${drinkId}`,
      name: `Drink ${drinkCount > 1 ? `#${i + 1}` : ''}: ${drinkOptions.find(d => d.id === drinkId)?.name}`,
      price: 0,
    }))

    addItem({
      menuItem: {
        id: deal.id,
        name: `${deal.name} - ${deal.title}`,
        description: deal.items.join(', '),
        price: deal.price,
        category: 'deals',
        image: deal.image,
        rating: 4.8,
      },
      quantity,
      addOns: drinkAddOns,
      specialInstructions: specialInstructions || undefined,
    })
    toast.success(`${deal.title} added to cart!`)
    onClose()
  }

  const totalPrice = deal.price * quantity

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-[#1a1a1a]/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative flex w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-card shadow-2xl max-h-[90vh]"
        role="dialog"
        aria-modal="true"
        aria-label={`${deal.title} deal details`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-[#1a1a1a]/50 text-white backdrop-blur-sm transition-colors hover:bg-[#1a1a1a]/70"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="overflow-y-auto">
          {/* Image */}
          <div className="relative h-56 w-full flex-shrink-0">
            <Image src={deal.image} alt={deal.title} fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a]/70 via-[#1a1a1a]/20 to-transparent" />
            <div className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full bg-[#F4A261] px-3 py-1">
              <Flame className="h-3.5 w-3.5 text-[#1a1a1a]" />
              <span className="text-xs font-bold text-[#1a1a1a]">{deal.name}</span>
            </div>
            <div className="absolute bottom-4 left-4 right-4">
              <h2 className="text-2xl font-bold text-white">{deal.title}</h2>
            </div>
          </div>

          <div className="p-6">
            {/* Items included */}
            <div className="mb-5">
              <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-foreground">
                Items Included
              </h3>
              <div className="space-y-2">
                {deal.items.map((item, i) => (
                  <div key={i} className="flex items-center gap-2.5 rounded-lg border border-border bg-background px-4 py-2.5">
                    <Check className="h-4 w-4 flex-shrink-0 text-[#C1121F]" />
                    <span className="text-sm text-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Drink Selection - REQUIRED */}
            <div className="mb-5">
              <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-foreground">
                Choose Your Drink{drinkCount > 1 ? 's' : ''} <span className="text-[#C1121F]">*</span>
              </h3>
              {Array.from({ length: drinkCount }).map((_, drinkIndex) => (
                <div key={drinkIndex} className="mb-3">
                  {drinkCount > 1 && (
                    <p className="mb-2 text-xs font-medium text-muted-foreground">Drink #{drinkIndex + 1}</p>
                  )}
                  <div className="grid grid-cols-3 gap-2">
                    {drinkOptions.map((drink) => (
                      <button
                        key={drink.id}
                        onClick={() => handleSelectDrink(drinkIndex, drink.id)}
                        className={`flex flex-col items-center rounded-xl border px-3 py-3 transition-all ${
                          selectedDrinks[drinkIndex] === drink.id
                            ? 'border-[#C1121F] bg-[#C1121F]/5 ring-1 ring-[#C1121F]'
                            : 'border-border bg-background hover:bg-muted'
                        }`}
                      >
                        <span className={`text-sm font-semibold ${selectedDrinks[drinkIndex] === drink.id ? 'text-[#C1121F]' : 'text-foreground'}`}>
                          {drink.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              {!allDrinksSelected && (
                <p className="mt-2 text-xs text-[#C1121F]">Please select all drinks to continue</p>
              )}
            </div>

            {/* Special Instructions */}
            <div className="mb-5">
              <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-foreground">
                Special Instructions
              </h3>
              <textarea
                rows={2}
                placeholder="Any special requests?"
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                className="w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-[#C1121F] focus:outline-none focus:ring-2 focus:ring-[#C1121F]/20"
              />
            </div>

            {/* Quantity */}
            <div className="flex items-center justify-between">
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

        {/* Sticky footer */}
        <div className="flex-shrink-0 border-t border-border bg-card p-4">
          <button
            onClick={handleAddToCart}
            disabled={!allDrinksSelected}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#C1121F] py-3.5 text-sm font-semibold text-white transition-all hover:bg-[#C1121F]/90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ShoppingBag className="h-4 w-4" />
            Add to Cart - Rs. {totalPrice.toLocaleString()}
          </button>
        </div>
      </div>
    </div>
  )
}
