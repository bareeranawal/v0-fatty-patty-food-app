"use client"

import { useState, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { 
  ArrowLeft, 
  Star, 
  Plus, 
  Minus, 
  ShoppingBag,
  Clock,
  Flame,
  Check
} from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { CartDrawer } from '@/components/cart-drawer'
import { WelcomeScreen } from '@/components/welcome-screen'
import { useOrder } from '@/lib/order-context'
import { useCart, type CartItem } from '@/lib/cart-context'
import { menuItems, getAddOnsForCategory, drinkOptions, type MenuItem, type AddOn } from '@/lib/menu-data'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { hasCompletedSetup, isHydrated } = useOrder()
  const { addItem } = useCart()

  const [quantity, setQuantity] = useState(1)
  const [selectedAddOns, setSelectedAddOns] = useState<AddOn[]>([])
  const [selectedDrink, setSelectedDrink] = useState<string>('')
  const [specialInstructions, setSpecialInstructions] = useState('')

  // Find the menu item
  const item = useMemo(() => {
    return menuItems.find(m => m.id === params.id) || null
  }, [params.id])

  // Get available add-ons for this item
  const availableAddOns = useMemo(() => {
    if (!item) return []
    return getAddOnsForCategory(item.category)
  }, [item])

  // Find related items from the same category
  const relatedItems = useMemo(() => {
    if (!item) return []
    return menuItems
      .filter(m => m.category === item.category && m.id !== item.id)
      .slice(0, 4)
  }, [item])

  // Calculate total price
  const totalPrice = useMemo(() => {
    if (!item) return 0
    const addOnsTotal = selectedAddOns.reduce((sum, addon) => sum + addon.price, 0)
    return (item.price + addOnsTotal) * quantity
  }, [item, selectedAddOns, quantity])

  const handleAddOnToggle = (addon: AddOn) => {
    setSelectedAddOns(prev => {
      const exists = prev.find(a => a.id === addon.id)
      if (exists) {
        return prev.filter(a => a.id !== addon.id)
      }
      return [...prev, addon]
    })
  }

  const handleAddToCart = () => {
    if (!item) return

    const cartItem: CartItem = {
      menuItem: item,
      quantity,
      addOns: selectedAddOns,
      specialInstructions: specialInstructions || undefined,
    }

    addItem(cartItem)
    toast.success(`${item.name} added to cart!`)
    
    // Reset selections
    setQuantity(1)
    setSelectedAddOns([])
    setSpecialInstructions('')
  }

  if (!isHydrated) {
    return null
  }

  if (!hasCompletedSetup) {
    return <WelcomeScreen />
  }

  if (!item) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-background pt-16">
          <div className="mx-auto max-w-4xl px-4 py-20 text-center">
            <h1 className="font-serif text-2xl font-bold text-foreground">Product not found</h1>
            <p className="mt-2 text-muted-foreground">The item you are looking for does not exist.</p>
            <Link
              href="/menu"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#C1121F] px-6 py-3 text-sm font-semibold text-white hover:bg-[#C1121F]/90"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Menu
            </Link>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background pt-16">
        <div className="mx-auto max-w-6xl px-4 py-8 lg:px-8">
          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className="mb-6 flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Menu
          </button>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Product Image */}
            <div className="relative">
              <div className="sticky top-24">
                <div className="relative aspect-square overflow-hidden rounded-3xl border border-border">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                    priority
                  />
                  {item.popular && (
                    <span className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full bg-[#FCA311] px-3 py-1.5 text-xs font-bold text-[#1a1a1a]">
                      <Flame className="h-3.5 w-3.5" />
                      Popular
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              {/* Header */}
              <div>
                <div className="mb-2 flex items-center gap-3">
                  <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground capitalize">
                    {item.category.replace('-', ' ')}
                  </span>
                  <div className="flex items-center gap-1 rounded-full bg-[#1a1a1a]/5 px-2.5 py-1 dark:bg-white/10">
                    <Star className="h-3.5 w-3.5 fill-[#FCA311] text-[#FCA311]" />
                    <span className="text-xs font-semibold text-foreground">{item.rating}</span>
                  </div>
                </div>
                <h1 className="font-serif text-3xl font-bold text-foreground lg:text-4xl">{item.name}</h1>
                <p className="mt-3 text-base leading-relaxed text-muted-foreground">{item.description}</p>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-[#C1121F]">Rs. {item.price.toLocaleString()}</span>
                <span className="text-sm text-muted-foreground">per item</span>
              </div>

              {/* Estimated Time */}
              <div className="flex items-center gap-2 rounded-xl border border-border bg-muted/50 px-4 py-3">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Estimated preparation: 15-20 minutes</span>
              </div>

              {/* Add-ons */}
              {availableAddOns.length > 0 && (
                <div>
                  <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-foreground">Customize Your Order</h3>
                  <div className="space-y-2">
                    {availableAddOns.map((addon) => {
                      const isSelected = selectedAddOns.find(a => a.id === addon.id)
                      return (
                        <button
                          key={addon.id}
                          onClick={() => handleAddOnToggle(addon)}
                          className={cn(
                            'flex w-full items-center justify-between rounded-xl border p-4 text-left transition-all',
                            isSelected
                              ? 'border-[#C1121F] bg-[#C1121F]/5'
                              : 'border-border hover:border-[#C1121F]/50 hover:bg-muted'
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              'flex h-5 w-5 items-center justify-center rounded-full border-2 transition-all',
                              isSelected
                                ? 'border-[#C1121F] bg-[#C1121F]'
                                : 'border-border'
                            )}>
                              {isSelected && <Check className="h-3 w-3 text-white" />}
                            </div>
                            <span className="text-sm font-medium text-foreground">{addon.name}</span>
                          </div>
                          <span className={cn(
                            'text-sm font-semibold',
                            addon.price === 0 ? 'text-muted-foreground' : 'text-[#C1121F]'
                          )}>
                            {addon.price === 0 ? 'Included' : `+Rs. ${addon.price}`}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Drink Selection (for items with cold drink add-on) */}
              {selectedAddOns.find(a => a.id === 'add-cold-drink') && (
                <div>
                  <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-foreground">Choose Your Drink</h3>
                  <div className="flex flex-wrap gap-2">
                    {drinkOptions.map((drink) => (
                      <button
                        key={drink.id}
                        onClick={() => setSelectedDrink(drink.id)}
                        className={cn(
                          'rounded-full px-4 py-2 text-sm font-medium transition-all',
                          selectedDrink === drink.id
                            ? 'bg-[#C1121F] text-white'
                            : 'border border-border text-foreground hover:bg-muted'
                        )}
                      >
                        {drink.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Special Instructions */}
              <div>
                <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-foreground">Special Instructions</h3>
                <textarea
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  placeholder="Any special requests? (e.g., no onions, extra sauce)"
                  rows={3}
                  className="w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-[#C1121F] focus:outline-none focus:ring-2 focus:ring-[#C1121F]/20"
                />
              </div>

              {/* Quantity & Add to Cart */}
              <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:bg-muted disabled:opacity-50"
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-8 text-center text-lg font-bold text-foreground">{quantity}</span>
                  <button
                    onClick={() => setQuantity(prev => prev + 1)}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:bg-muted"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#C1121F] py-3.5 text-sm font-semibold text-white transition-all hover:bg-[#C1121F]/90 active:scale-[0.98]"
                >
                  <ShoppingBag className="h-4 w-4" />
                  Add to Cart - Rs. {totalPrice.toLocaleString()}
                </button>
              </div>
            </div>
          </div>

          {/* Related Items */}
          {relatedItems.length > 0 && (
            <div className="mt-16">
              <h2 className="mb-6 font-serif text-2xl font-bold text-foreground">You Might Also Like</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {relatedItems.map((relatedItem) => (
                  <Link
                    key={relatedItem.id}
                    href={`/menu/${relatedItem.id}`}
                    className="group overflow-hidden rounded-2xl border border-border bg-card transition-all hover:-translate-y-1 hover:shadow-lg"
                  >
                    <div className="relative h-36 w-full overflow-hidden">
                      <Image
                        src={relatedItem.image}
                        alt={relatedItem.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-foreground line-clamp-1">{relatedItem.name}</h3>
                      <p className="mt-1 text-xs text-muted-foreground line-clamp-1">{relatedItem.description}</p>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="font-bold text-[#C1121F]">Rs. {relatedItem.price.toLocaleString()}</span>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-[#FCA311] text-[#FCA311]" />
                          <span className="text-xs font-medium text-foreground">{relatedItem.rating}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
      <CartDrawer />
    </>
  )
}
