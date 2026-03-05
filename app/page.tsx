"use client"

import { useState } from 'react'
import { Navbar } from '@/components/navbar'
import { Hero } from '@/components/hero'
import { Categories } from '@/components/categories'
import { PopularItems } from '@/components/popular-items'
import { MenuSection } from '@/components/menu-section'
import { Promotions } from '@/components/promotions'
import { Reviews } from '@/components/reviews'
import { Contact } from '@/components/contact'
import { Footer } from '@/components/footer'
import { CartDrawer } from '@/components/cart-drawer'
import { ProductModal } from '@/components/product-modal'
import type { MenuItem } from '@/lib/menu-data'

export default function HomePage() {
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null)

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Categories />
        <PopularItems onItemClick={setSelectedItem} />
        <MenuSection onItemClick={setSelectedItem} />
        <Promotions />
        <Reviews />
        <Contact />
      </main>
      <Footer />
      <CartDrawer />
      {selectedItem && (
        <ProductModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </>
  )
}
