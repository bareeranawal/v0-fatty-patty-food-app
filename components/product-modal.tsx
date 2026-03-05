"use client"

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { X, Plus, Minus, ShoppingBag, Check, Star } from 'lucide-react'
import type { MenuItem, AddOn } from '@/lib/menu-data'
import { getAddOnsForCategory, drinkOptions } from '@/lib/menu-data'
import { useCart } from '@/lib/cart-context'
import { toast } from 'sonner'

interface ProductModalProps {
  item: MenuItem
  onClose: () => void
}

export function ProductModal({ item, onClose }: ProductModalProps) {
  const [quantity, setQuantity] = useState(1)
  const [selectedAddOns, setSelectedAddOns] = useState<AddOn[]>([])
  const [selectedDrink, setSelectedDrink] = useState<string>('')
  const [userRating, setUserRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [hasRated, setHasRated] = useState(false)
  const [averageRating, setAverageRating] = useState(item.rating)
  const [ratingCount, setRatingCount] = useState(Math.floor(Math.random() * 50) + 20)
  const [specialInstructions, setSpecialInstructions] = useState('')
  const { addItem } = useCart()

  const availableAddOns = getAddOnsForCategory(item.category)
  const showDrinkSelector = selectedAddOns.some((a) => a.id === 'add-cold-drink')

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

  const toggleAddOn = (addOn: AddOn) => {
    setSelectedAddOns((prev) => {
      const exists = prev.find((a) => a.id === addOn.id)
      if (exists) {
        if (addOn.id === 'add-cold-drink') setSelectedDrink('')
        return prev.filter((a) => a.id !== addOn.id)
      }
      if (addOn.id === 'single-patty') {
        return [...prev.filter((a) => a.id !== 'double-patty'), addOn]
      }
      if (addOn.id === 'double-patty') {
        return [...prev.filter((a) => a.id !== 'single-patty'), addOn]
      }
      return [...prev, addOn]
    })
  }

  const handleSubmitRating = () => {
    if (userRating === 0) return
    const newCount = ratingCount + 1
    const newAvg = ((averageRating * ratingCount) + userRating) / newCount
    setAverageRating(Math.round(newAvg * 10) / 10)
    setRatingCount(newCount)
    setHasRated(true)
    toast.success('Thank you for your rating!')
  }

  const addOnTotal = selectedAddOns.reduce((sum, a) => sum + a.price, 0)
  const itemTotal = (item.price + addOnTotal) * quantity

  const handleAddToCart = () => {
    if (showDrinkSelector && !selectedDrink) {
      toast.error('Please select a drink before adding to cart')
      return
    }

    const drinkAddon = selectedDrink
      ? [{ id: `drink-${selectedDrink}`, name: `Drink: ${drinkOptions.find(d => d.id === selectedDrink)?.name}`, price: 0 }]
      : []

    addItem({
      menuItem: item,
      quantity,
      addOns: [
        ...selectedAddOns.map((a) => ({ id: a.id, name: a.name, price: a.price })),
        ...drinkAddon,
      ],
      specialInstructions: specialInstructions || undefined,
    })
    toast.success(`${item.name} added to cart!`)
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-[#1a1a1a]/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative flex w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-card shadow-2xl max-h-[90vh] animate-fade-in-up"
        role="dialog"
        aria-modal="true"
        aria-label={`${item.name} details`}
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
            <Image src={item.image} alt={item.name} fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a]/40 to-transparent" />
            <div className="absolute left-4 bottom-4 flex items-center gap-1.5 rounded-full bg-[#1a1a1a]/70 px-3 py-1.5 backdrop-blur-sm">
              <Star className="h-4 w-4 fill-[#F4A261] text-[#F4A261]" />
              <span className="text-sm font-semibold text-white">{averageRating}</span>
              <span className="text-xs text-white/60">({ratingCount})</span>
            </div>
          </div>

          <div className="p-6">
            <div className="mb-1 flex items-start justify-between gap-4">
              <h2 className="text-xl font-bold text-foreground">{item.name}</h2>
              <span className="flex-shrink-0 text-xl font-bold text-[#C1121F]">
                Rs. {item.price.toLocaleString()}
              </span>
            </div>
            <p className="mb-5 text-sm leading-relaxed text-muted-foreground">{item.description}</p>

            {/* Star Rating System */}
            <div className="mb-5 rounded-xl border border-border bg-background p-4">
              <h3 className="mb-2 text-sm font-bold uppercase tracking-wider text-foreground">
                Rate this item
              </h3>
              {hasRated ? (
                <p className="text-sm text-[#C1121F] font-medium">Thanks for your rating!</p>
              ) : (
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setUserRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-0.5 transition-transform duration-150 hover:scale-110"
                        aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                      >
                        <Star
                          className={`h-6 w-6 transition-colors ${
                            star <= (hoverRating || userRating)
                              ? 'fill-[#F4A261] text-[#F4A261]'
                              : 'fill-muted text-muted'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  {userRating > 0 && (
                    <button
                      onClick={handleSubmitRating}
                      className="rounded-full bg-[#C1121F] px-3 py-1 text-xs font-semibold text-white transition-all duration-200 hover:bg-[#C1121F]/90"
                    >
                      Submit
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Add-ons / Customizations */}
            {availableAddOns.length > 0 && (
              <div className="mb-5">
                <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-foreground">
                  {item.category === 'beef-burgers' || item.category === 'chicken-burgers'
                    ? 'Customize Your Burger'
                    : 'Add-ons'}
                </h3>
                <div className="space-y-2">
                  {availableAddOns.map((addOn) => {
                    const isSelected = selectedAddOns.some((a) => a.id === addOn.id)
                    return (
                      <button
                        key={addOn.id}
                        onClick={() => toggleAddOn(addOn)}
                        className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left transition-all duration-200 ${
                          isSelected
                            ? 'border-[#C1121F] bg-[#C1121F]/5'
                            : 'border-border bg-background hover:bg-muted'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-5 w-5 items-center justify-center rounded-md border transition-colors ${
                              isSelected
                                ? 'border-[#C1121F] bg-[#C1121F]'
                                : 'border-border'
                            }`}
                          >
                            {isSelected && <Check className="h-3 w-3 text-white" />}
                          </div>
                          <span className="text-sm font-medium text-foreground">{addOn.name}</span>
                        </div>
                        <span className="text-sm font-semibold text-[#C1121F]">
                          {addOn.price === 0 ? 'Included' : `+Rs. ${addOn.price}`}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Drink Selector */}
            {showDrinkSelector && (
              <div className="mb-5">
                <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-foreground">
                  Choose Your Drink <span className="text-[#C1121F]">*</span>
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  {drinkOptions.map((drink) => (
                    <button
                      key={drink.id}
                      onClick={() => setSelectedDrink(drink.id)}
                      className={`flex flex-col items-center rounded-xl border px-3 py-3 transition-all duration-200 ${
                        selectedDrink === drink.id
                          ? 'border-[#C1121F] bg-[#C1121F]/5 ring-1 ring-[#C1121F]'
                          : 'border-border bg-background hover:bg-muted'
                      }`}
                    >
                      <span className={`text-sm font-semibold ${selectedDrink === drink.id ? 'text-[#C1121F]' : 'text-foreground'}`}>
                        {drink.name}
                      </span>
                    </button>
                  ))}
                </div>
                {!selectedDrink && (
                  <p className="mt-2 text-xs text-[#C1121F]">Please select a drink to continue</p>
                )}
              </div>
            )}

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

        {/* Sticky Add to Cart Button */}
        <div className="flex-shrink-0 border-t border-border bg-card p-4">
          <button
            onClick={handleAddToCart}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#C1121F] py-3.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-[#C1121F]/90 active:scale-[0.98]"
          >
            <ShoppingBag className="h-4 w-4" />
            Add to Cart - Rs. {itemTotal.toLocaleString()}
          </button>
        </div>
      </div>
    </div>
  )
}
