"use client"

import { useState, useMemo, useEffect } from 'react'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { Star, Plus } from 'lucide-react'
import { menuItems as defaultMenuItems, categories } from '@/lib/menu-data'
import type { MenuItem } from '@/lib/menu-data'
import { useCart } from '@/lib/cart-context'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface MenuSectionProps {
  onItemClick: (item: MenuItem) => void
}

export function MenuSection({ onItemClick }: MenuSectionProps) {
  const searchParams = useSearchParams()
  const initialCategory = searchParams.get('category') || 'all'
  const [activeCategory, setActiveCategory] = useState<string>(initialCategory)
  const [menuItems, setMenuItems] = useState<MenuItem[]>(defaultMenuItems)
  const { addItem } = useCart()

  // Load products from localStorage
  useEffect(() => {
    const loadProducts = () => {
      const storedProducts = localStorage.getItem('products')
      if (storedProducts) {
        try {
          const products = JSON.parse(storedProducts)
          // Convert stored products to MenuItem format
          const convertedProducts: MenuItem[] = products
            .filter((p: Record<string, unknown>) => p.is_available !== false)
            .map((p: Record<string, unknown>) => ({
              id: p.id as string,
              name: p.name as string,
              description: (p.description as string) || '',
              price: p.price as number,
              category: (p.category_id as string) || (p.category as string) || 'other',
              image: (p.image as string) || (p.image_url as string) || '/images/placeholder.jpg',
              rating: (p.rating as number) || 4.5,
              popular: false,
            }))
          if (convertedProducts.length > 0) {
            setMenuItems(convertedProducts)
          }
        } catch (error) {
          console.error('[v0] Error loading products from localStorage:', error)
        }
      }
    }
    
    loadProducts()
    
    // Listen for storage changes - both from other tabs and same-tab sync
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'products' || e.key === null) {
        loadProducts()
      }
    }
    
    window.addEventListener('storage', handleStorageChange)
    
    // Also reload when window gets focus (same tab scenario)
    window.addEventListener('focus', loadProducts)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('focus', loadProducts)
    }
  }, [])

  useEffect(() => {
    const cat = searchParams.get('category')
    if (cat) {
      setActiveCategory(cat)
      setTimeout(() => {
        const el = document.getElementById(`category-${cat}`)
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 100)
    }
  }, [searchParams])

  const handleQuickAdd = (e: React.MouseEvent, item: MenuItem) => {
    e.stopPropagation()
    addItem({ menuItem: item, quantity: 1, addOns: [] })
    toast.success(`${item.name} added to cart!`)
  }

  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => activeCategory === 'all' || item.category === activeCategory)
  }, [activeCategory])

  const groupedItems = useMemo(() => {
    if (activeCategory !== 'all') {
      return [{ categoryId: activeCategory, items: filteredItems }]
    }
    const groups: { categoryId: string; items: MenuItem[] }[] = []
    categories.forEach((cat) => {
      const items = filteredItems.filter((item) => item.category === cat.id)
      if (items.length > 0) groups.push({ categoryId: cat.id, items })
    })
    return groups
  }, [filteredItems, activeCategory])

  return (
    <section id="menu" className="bg-background py-14 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mb-10 text-center">
          <span className="mb-3 inline-block text-sm font-semibold uppercase tracking-widest text-[#C1121F]">
            Our Menu
          </span>
          <h2 className="font-serif text-3xl font-bold text-foreground md:text-4xl lg:text-5xl text-balance">
            Explore the Full Menu
          </h2>
        </div>

        {/* Sticky Category Filter */}
        <div className="sticky top-14 z-30 -mx-4 mb-8 border-b border-border bg-background/95 px-4 py-3 backdrop-blur-md">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            <button
              onClick={() => setActiveCategory('all')}
              className={cn(
                'flex-shrink-0 rounded-full px-5 py-2 text-sm font-medium transition-all',
                activeCategory === 'all'
                  ? 'bg-[#C1121F] text-white shadow-md'
                  : 'bg-card text-foreground hover:bg-muted border border-border'
              )}
            >
              All Items
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={cn(
                  'flex-shrink-0 rounded-full px-5 py-2 text-sm font-medium transition-all',
                  activeCategory === cat.id
                    ? 'bg-[#C1121F] text-white shadow-md'
                    : 'bg-card text-foreground hover:bg-muted border border-border'
                )}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Menu Items */}
        {groupedItems.map((group) => {
          const category = categories.find((c) => c.id === group.categoryId)
          return (
            <div key={group.categoryId} id={`category-${group.categoryId}`} className="mb-12">
              <h3 className="mb-5 flex items-center gap-3 font-serif text-2xl font-bold text-foreground">
                <span className="h-8 w-1 rounded-full bg-[#C1121F]" />
                {category?.name || group.categoryId}
              </h3>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {group.items.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => onItemClick(item)}
                    className="group cursor-pointer overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-[#C1121F]/20"
                  >
                    <div className="relative h-44 w-full overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a]/40 via-transparent to-transparent" />
                      <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-[#1a1a1a]/70 px-2 py-0.5 backdrop-blur-sm">
                        <Star className="h-3 w-3 fill-[#F4A261] text-[#F4A261]" />
                        <span className="text-xs font-semibold text-white">{item.rating}</span>
                      </div>
                      {item.popular && (
                        <span className="absolute left-3 top-3 rounded-full bg-[#F4A261] px-2.5 py-0.5 text-xs font-bold text-[#1a1a1a]">
                          Best Seller
                        </span>
                      )}
                    </div>

                    <div className="p-4">
                      <h4 className="mb-1 text-base font-bold text-foreground">{item.name}</h4>
                      <p className="mb-3 text-xs leading-relaxed text-muted-foreground line-clamp-2">
                        {item.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-[#C1121F]">
                          Rs. {item.price.toLocaleString()}
                        </span>
                        <button
                          onClick={(e) => handleQuickAdd(e, item)}
                          className="flex h-9 w-9 items-center justify-center rounded-full bg-[#C1121F] text-white transition-all hover:scale-110 hover:bg-[#C1121F]/90 active:scale-95"
                          aria-label={`Add ${item.name} to cart`}
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}

        {filteredItems.length === 0 && (
          <div className="py-16 text-center">
            <p className="text-lg text-muted-foreground">No items found. Try a different category.</p>
          </div>
        )}
      </div>
    </section>
  )
}
