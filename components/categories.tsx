"use client"

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { categories } from '@/lib/menu-data'

export function Categories() {
  const router = useRouter()
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

  const handleClick = (categoryId: string) => {
    router.push(`/menu?category=${categoryId}`)
  }

  return (
    <section ref={sectionRef} id="categories" className="bg-background py-10 lg:py-14">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mb-8 text-center">
          <span className="mb-2 inline-block text-sm font-semibold uppercase tracking-widest text-[#C1121F]">
            Explore
          </span>
          <h2 className="font-serif text-3xl font-bold text-foreground md:text-4xl lg:text-5xl text-balance">
            Our Categories
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
          {categories.map((category, i) => (
            <button
              key={category.id}
              onClick={() => handleClick(category.id)}
              className="reveal-card group relative flex flex-col items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-[#C1121F]/30 opacity-0"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <div className="relative h-20 w-20 overflow-hidden rounded-full">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              <span className="text-center text-sm font-semibold text-foreground">
                {category.name}
              </span>
              <span className="rounded-full bg-[#C1121F]/10 px-2 py-0.5 text-xs font-medium text-[#C1121F]">
                {category.count} items
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
