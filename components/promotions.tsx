"use client"

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { Flame, Check } from 'lucide-react'
import { deals } from '@/lib/menu-data'
import type { Deal } from '@/lib/menu-data'

interface PromotionsProps {
  onDealClick: (deal: Deal) => void
}

export function Promotions({ onDealClick }: PromotionsProps) {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in-up')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1 }
    )
    const cards = sectionRef.current?.querySelectorAll('.reveal-card')
    cards?.forEach((card) => observer.observe(card))
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} id="offers" className="bg-background py-10 lg:py-14">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mb-8 text-center">
          <span className="mb-2 inline-block text-sm font-semibold uppercase tracking-widest text-[#C1121F]">
            Special Offers
          </span>
          <h2 className="font-serif text-3xl font-bold text-foreground md:text-4xl lg:text-5xl text-balance">
            Deals You Cannot Miss
          </h2>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          {deals.map((deal, i) => (
            <button
              key={deal.id}
              onClick={() => onDealClick(deal)}
              className="reveal-card group relative overflow-hidden rounded-2xl border border-border bg-card text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl opacity-0"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="relative h-44 w-full overflow-hidden">
                <Image
                  src={deal.image}
                  alt={deal.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a]/70 via-[#1a1a1a]/20 to-transparent" />
                <div className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full bg-[#F4A261] px-3 py-1">
                  <Flame className="h-3.5 w-3.5 text-[#1a1a1a]" />
                  <span className="text-xs font-bold text-[#1a1a1a]">{deal.name}</span>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-xl font-bold text-white">{deal.title}</h3>
                </div>
              </div>

              <div className="p-5">
                <ul className="mb-4 space-y-1.5">
                  {deal.items.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check className="h-4 w-4 flex-shrink-0 text-[#C1121F]" />
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-[#C1121F]">
                    Rs. {deal.price.toLocaleString()}
                  </span>
                  <span className="rounded-full bg-[#C1121F] px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 group-hover:bg-[#C1121F]/90 group-hover:scale-105">
                    View Deal
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
