"use client"

import Image from 'next/image'
import { Flame, Check } from 'lucide-react'
import { deals } from '@/lib/menu-data'
import { useCart } from '@/lib/cart-context'
import { toast } from 'sonner'

export function Promotions() {
  const { addItem } = useCart()

  const handleAddDeal = (deal: typeof deals[0]) => {
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
      quantity: 1,
      addOns: [],
    })
    toast.success(`${deal.title} added to cart!`)
  }

  return (
    <section id="offers" className="bg-muted/50 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mb-12 text-center">
          <span className="mb-3 inline-block text-sm font-semibold uppercase tracking-widest text-brand-red">
            Special Offers
          </span>
          <h2 className="font-serif text-3xl font-bold text-foreground md:text-4xl lg:text-5xl text-balance">
            Deals You Cannot Miss
          </h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {deals.map((deal) => (
            <div
              key={deal.id}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
            >
              {/* Deal Image */}
              <div className="relative h-44 w-full overflow-hidden">
                <Image
                  src={deal.image}
                  alt={deal.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/70 via-brand-dark/20 to-transparent" />
                <div className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full bg-brand-gold px-3 py-1">
                  <Flame className="h-3.5 w-3.5 text-brand-dark" />
                  <span className="text-xs font-bold text-brand-dark">{deal.name}</span>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-xl font-bold text-primary-foreground">{deal.title}</h3>
                </div>
              </div>

              {/* Deal Content */}
              <div className="p-5">
                <ul className="mb-4 space-y-1.5">
                  {deal.items.map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check className="h-4 w-4 flex-shrink-0 text-brand-red" />
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-brand-red">
                    Rs. {deal.price.toLocaleString()}
                  </span>
                  <button
                    onClick={() => handleAddDeal(deal)}
                    className="rounded-full bg-brand-red px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:bg-brand-red/90 hover:scale-105 active:scale-95"
                  >
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
