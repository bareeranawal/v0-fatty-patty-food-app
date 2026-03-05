"use client"

import Image from 'next/image'
import { ShoppingBag } from 'lucide-react'
import { popularItems } from '@/lib/menu-data'
import type { MenuItem } from '@/lib/menu-data'

interface PopularItemsProps {
  onItemClick: (item: MenuItem) => void
}

export function PopularItems({ onItemClick }: PopularItemsProps) {
  return (
    <section className="bg-muted/50 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mb-12 text-center">
          <span className="mb-3 inline-block text-sm font-semibold uppercase tracking-widest text-brand-red">
            Fan Favorites
          </span>
          <h2 className="font-serif text-3xl font-bold text-foreground md:text-4xl lg:text-5xl text-balance">
            Most Popular
          </h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {popularItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onItemClick(item)}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card text-left shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="relative h-52 w-full overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/50 to-transparent" />
                <span className="absolute left-4 top-4 rounded-full bg-brand-gold px-3 py-1 text-xs font-bold text-brand-dark">
                  Popular
                </span>
              </div>
              <div className="p-5">
                <h3 className="mb-1 text-lg font-bold text-foreground">{item.name}</h3>
                <p className="mb-4 text-sm leading-relaxed text-muted-foreground line-clamp-2">
                  {item.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-brand-red">
                    Rs. {item.price.toLocaleString()}
                  </span>
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-red text-primary-foreground transition-transform group-hover:scale-110">
                    <ShoppingBag className="h-4 w-4" />
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
