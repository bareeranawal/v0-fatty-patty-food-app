"use client"

import { useState, useMemo } from 'react'
import Image from 'next/image'
import { Search, Star, Plus } from 'lucide-react'
import { menuItems, categories } from '@/lib/menu-data'
import type { MenuItem } from '@/lib/menu-data'
import { useCart } from '@/lib/cart-context'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface MenuSectionProps {
  onItemClick: (item: MenuItem) => void
}

export function MenuSection({ onItemClick }: MenuSectionProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const { addItem } = useCart()

  const handleQuickAdd = (e: React.MouseEvent, item: MenuItem) => {
    e.stopPropagation()
    addItem({
      menuItem: item,
      quantity: 1,
      addOns: [],
    })
    toast.success(`${item.name} added to cart!`)
  }

  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      const matchesCategory = activeCategory === 'all' || item.category === activeCategory
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesCategory && matchesSearch
    })
  }, [activeCategory, searchQuery])

  const groupedItems = useMemo(() => {
    if (activeCategory !== 'all') {
      return [{ categoryId: activeCategory, items: filteredItems }]
    }
    const groups: { categoryId: string; items: MenuItem[] }[] = []
    categories.forEach((cat) => {
      const items = filteredItems.filter((item) => item.category === cat.id)
      if (items.length > 0) {
        groups.push({ categoryId: cat.id, items })
      }
    })
    return groups
  }, [filteredItems, activeCategory])

  return (
    <section id="menu" className="bg-background py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mb-12 text-center">
          <span className="mb-3 inline-block text-sm font-semibold uppercase tracking-widest text-brand-red">
            Our Menu
          </span>
          <h2 className="font-serif text-3xl font-bold text-foreground md:text-4xl lg:text-5xl text-balance">
            Explore the Full Menu
          </h2>
        </div>

        {/* Sticky Filter Bar */}
        <div className="sticky top-16 z-30 -mx-4 mb-10 border-b border-border bg-background/95 px-4 py-4 backdrop-blur-md lg:top-20">
          {/* Search */}
          <div className="relative mx-auto mb-4 max-w-md">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search the menu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-full border border-border bg-card py-3 pl-11 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-brand-red focus:outline-none focus:ring-2 focus:ring-brand-red/20"
            />
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <button
              onClick={() => setActiveCategory('all')}
              className={cn(
                'flex-shrink-0 rounded-full px-5 py-2 text-sm font-medium transition-all',
                activeCategory === 'all'
                  ? 'bg-brand-red text-primary-foreground shadow-md'
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
                    ? 'bg-brand-red text-primary-foreground shadow-md'
                    : 'bg-card text-foreground hover:bg-muted border border-border'
                )}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Menu Items by Category */}
        {groupedItems.map((group) => {
          const category = categories.find((c) => c.id === group.categoryId)
          return (
            <div key={group.categoryId} id={`category-${group.categoryId}`} className="mb-14">
              <h3 className="mb-6 flex items-center gap-3 font-serif text-2xl font-bold text-foreground">
                <span className="h-8 w-1 rounded-full bg-brand-red" />
                {category?.name || group.categoryId}
              </h3>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {group.items.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => onItemClick(item)}
                    className="group cursor-pointer overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                  >
                    {/* Card Image */}
                    <div className="relative h-44 w-full overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/40 via-transparent to-transparent" />
                      {/* Rating */}
                      <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-brand-dark/70 px-2 py-0.5 backdrop-blur-sm">
                        <Star className="h-3 w-3 fill-brand-gold text-brand-gold" />
                        <span className="text-xs font-semibold text-primary-foreground">{item.rating}</span>
                      </div>
                      {item.popular && (
                        <span className="absolute left-3 top-3 rounded-full bg-brand-gold px-2.5 py-0.5 text-xs font-bold text-brand-dark">
                          Best Seller
                        </span>
                      )}
                    </div>

                    {/* Card Content */}
                    <div className="p-4">
                      <h4 className="mb-1 text-base font-bold text-foreground">{item.name}</h4>
                      <p className="mb-3 text-xs leading-relaxed text-muted-foreground line-clamp-2">
                        {item.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-brand-red">
                          Rs. {item.price.toLocaleString()}
                        </span>
                        <button
                          onClick={(e) => handleQuickAdd(e, item)}
                          className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-red text-primary-foreground transition-all hover:scale-110 hover:bg-brand-red/90 active:scale-95"
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
            <p className="text-lg text-muted-foreground">No items found. Try a different search.</p>
          </div>
        )}
      </div>
    </section>
  )
}
