"use client"

import { Flame, Utensils } from 'lucide-react'

const offers = [
  {
    title: 'Make It A Meal',
    description: 'Add fries and a drink to any burger for just Rs. 300. Upgrade your order and save!',
    price: 'Just +300',
    icon: Utensils,
    accent: 'from-brand-red to-brand-red/80',
  },
  {
    title: 'Weekend Burger Deals',
    description: 'Every weekend, enjoy exclusive discounts on our premium wagyu and signature burgers.',
    price: 'Up to 20% Off',
    icon: Flame,
    accent: 'from-brand-gold to-brand-gold/80',
  },
]

export function Promotions() {
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

        <div className="grid gap-6 md:grid-cols-2">
          {offers.map((offer) => (
            <div
              key={offer.title}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl md:p-10"
            >
              <div className={`absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gradient-to-br ${offer.accent} opacity-10 transition-transform group-hover:scale-150`} />
              <div className="relative z-10">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-red/10">
                  <offer.icon className="h-6 w-6 text-brand-red" />
                </div>
                <h3 className="mb-2 text-xl font-bold text-foreground">{offer.title}</h3>
                <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
                  {offer.description}
                </p>
                <span className="inline-block rounded-full bg-brand-red px-6 py-2.5 text-sm font-bold text-primary-foreground">
                  {offer.price}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
