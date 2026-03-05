"use client"

import Image from 'next/image'
import { categories } from '@/lib/menu-data'

interface CategoriesProps {
  onCategoryClick?: (categoryId: string) => void
}

export function Categories({ onCategoryClick }: CategoriesProps) {
  const handleClick = (categoryId: string) => {
    if (onCategoryClick) {
      onCategoryClick(categoryId)
    }
    const element = document.getElementById(`category-${categoryId}`)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <section id="categories" className="bg-background py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mb-12 text-center">
          <span className="mb-3 inline-block text-sm font-semibold uppercase tracking-widest text-brand-red">
            Explore
          </span>
          <h2 className="font-serif text-3xl font-bold text-foreground md:text-4xl lg:text-5xl text-balance">
            Our Categories
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleClick(category.id)}
              className="group relative flex flex-col items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
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
              <span className="rounded-full bg-brand-red/10 px-2 py-0.5 text-xs font-medium text-brand-red">
                {category.count} items
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
