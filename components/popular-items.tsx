"use client"

import Image from 'next/image'
import { Star, Plus } from 'lucide-react'
import { motion } from 'framer-motion'
import { popularItems } from '@/lib/menu-data'
import type { MenuItem } from '@/lib/menu-data'
import { useCart } from '@/lib/cart-context'
import { toast } from 'sonner'

interface PopularItemsProps {
  onItemClick: (item: MenuItem) => void
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1],
    },
  },
}

export function PopularItems({ onItemClick }: PopularItemsProps) {
  const { addItem } = useCart()

  const handleQuickAdd = (e: React.MouseEvent, item: MenuItem) => {
    e.stopPropagation()
    addItem({ menuItem: item, quantity: 1, addOns: [] })
    toast.success(`${item.name} added to cart!`)
  }

  return (
    <section className="bg-muted/50 py-14 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-10 text-center"
        >
          <span className="mb-3 inline-block text-sm font-semibold uppercase tracking-widest text-[#C1121F]">
            Fan Favorites
          </span>
          <h2 className="font-serif text-3xl font-bold text-foreground md:text-4xl lg:text-5xl text-balance">
            Most Popular
          </h2>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {popularItems.map((item) => (
            <motion.div
              key={item.id}
              variants={itemVariants}
              whileHover={{ y: -8 }}
              onClick={() => onItemClick(item)}
              className="group relative cursor-pointer overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-shadow hover:shadow-xl hover:border-[#C1121F]/20"
            >
              <div className="relative h-52 w-full overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a]/60 via-transparent to-transparent" />
                <span className="absolute left-4 top-4 rounded-full bg-[#FCA311] px-3 py-1 text-xs font-bold text-[#1a1a1a]">
                  Popular
                </span>
                <div className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-[#1a1a1a]/70 px-2.5 py-1 backdrop-blur-sm">
                  <Star className="h-3.5 w-3.5 fill-[#FCA311] text-[#FCA311]" />
                  <span className="text-xs font-semibold text-white">{item.rating}</span>
                </div>
              </div>

              <div className="p-5">
                <h3 className="mb-1 text-lg font-bold text-foreground">{item.name}</h3>
                <p className="mb-4 text-sm leading-relaxed text-muted-foreground line-clamp-2">
                  {item.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-[#C1121F]">
                    Rs. {item.price.toLocaleString()}
                  </span>
                  <motion.button
                    onClick={(e) => handleQuickAdd(e, item)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-1.5 rounded-full bg-[#C1121F] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#C1121F]/90"
                    aria-label={`Add ${item.name} to cart`}
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add to Cart
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
