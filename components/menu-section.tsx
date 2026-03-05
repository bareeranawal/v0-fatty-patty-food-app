"use client"

import { useState, useMemo } from 'react'
import Image from 'next/image'
import { Search, ShoppingBag } from 'lucide-react'
import { menuItems, categories } from '@/lib/menu-data'
import type { MenuItem } from '@/lib/menu-data'
import { cn } from '@/lib/utils'

interface MenuSectionProps {
  onItemClick: (item: MenuItem) => void
}

export function MenuSection({ onItemClick }: MenuSectionProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

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
        <div className="sticky top-16 z-30 -mx-4 mb-8 bg-background/95 px-4 py-4 backdrop-blur-md lg:top-20">
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
            <div key={group.categoryId} id={`category-${group.categoryId}`} className="mb-12">
              <h3 className="mb-6 flex items-center gap-3 font-serif text-2xl font-bold text-foreground">
                <span className="h-8 w-1 rounded-full bg-brand-red" />
                {category?.name || group.categoryId}
              </h3>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {group.items.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => onItemClick(item)}
                    className="group flex items-center gap-4 rounded-xl border border-border bg-card p-4 text-left shadow-sm transition-all hover:shadow-md"
                  >
                    <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="mb-1 text-sm font-bold text-foreground">{item.name}</h4>
                      <p className="mb-2 text-xs leading-relaxed text-muted-foreground line-clamp-2">
                        {item.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-brand-red">
                          Rs. {item.price.toLocaleString()}
                        </span>
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-red/10 text-brand-red transition-colors group-hover:bg-brand-red group-hover:text-primary-foreground">
                          <ShoppingBag className="h-3.5 w-3.5" />
                        </span>
                      </div>
                    </div>
                  </button>
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
