"use client"

import Image from 'next/image'
import { Star, Plus } from 'lucide-react'
import { popularItems } from '@/lib/menu-data'
import type { MenuItem } from '@/lib/menu-data'
import { useCart } from '@/lib/cart-context'
import { toast } from 'sonner'

interface PopularItemsProps {
  onItemClick: (item: MenuItem) => void
}

export function PopularItems({ onItemClick }: PopularItemsProps) {
  const { addItem } = useCart()

  const handleQuickAdd = (e: React.MouseEvent, item: MenuItem) => {
    e.stopPropagation()
    addItem({ menuItem: item, quantity: 1, addOns: [] })
    toast.success(`${item.name} added to cart!`)
  }

  return (
    <section className="bg-muted/50 py-14 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mb-10 text-center">
          <span className="mb-3 inline-block text-sm font-semibold uppercase tracking-widest text-[#C1121F]">
            Fan Favorites
          </span>
          <h2 className="font-serif text-3xl font-bold text-foreground md:text-4xl lg:text-5xl text-balance">
            Most Popular
          </h2>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {popularItems.map((item) => (
            <div
              key={item.id}
              onClick={() => onItemClick(item)}
              className="group relative cursor-pointer overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-[#C1121F]/20"
            >
              <div className="relative h-52 w-full overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a]/60 via-transparent to-transparent" />
                <span className="absolute left-4 top-4 rounded-full bg-[#F4A261] px-3 py-1 text-xs font-bold text-[#1a1a1a]">
                  Popular
                </span>
                <div className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-[#1a1a1a]/70 px-2.5 py-1 backdrop-blur-sm">
                  <Star className="h-3.5 w-3.5 fill-[#F4A261] text-[#F4A261]" />
                  <span className="text-xs font-semibold text-white">{item.rating}</span>
                </div>
              </div>

              <div className="p-5">
                <h3 className="mb-1 text-lg font-bold text-foreground">{item.name}</h3>
                <p className="mb-4 text-sm leading-relaxed text-muted-foreground line-clamp-2">
                  {item.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-[#C1121F]">
                    Rs. {item.price.toLocaleString()}
                  </span>
                  <button
                    onClick={(e) => handleQuickAdd(e, item)}
                    className="flex items-center gap-1.5 rounded-full bg-[#C1121F] px-4 py-2 text-xs font-semibold text-white transition-all hover:bg-[#C1121F]/90 hover:scale-105 active:scale-95"
                    aria-label={`Add ${item.name} to cart`}
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
