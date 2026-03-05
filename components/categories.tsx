"use client"

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { categories } from '@/lib/menu-data'

export function Categories() {
  const router = useRouter()

  const handleClick = (categoryId: string) => {
    router.push(`/menu?category=${categoryId}`)
  }

  return (
    <section id="categories" className="bg-background py-14 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mb-10 text-center animate-fade-in-up">
          <span className="mb-3 inline-block text-sm font-semibold uppercase tracking-widest text-[#C1121F]">
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
              className="group relative flex flex-col items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-[#C1121F]/30"
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
