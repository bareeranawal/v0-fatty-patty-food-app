"use client"

import { useState } from 'react'
import { Navbar } from '@/components/navbar'
import { Hero } from '@/components/hero'
import { Categories } from '@/components/categories'
import { PopularItems } from '@/components/popular-items'
import { Promotions } from '@/components/promotions'
import { Reviews } from '@/components/reviews'
import { Contact } from '@/components/contact'
import { Footer } from '@/components/footer'
import { CartDrawer } from '@/components/cart-drawer'
import { ProductModal } from '@/components/product-modal'
import { DealModal } from '@/components/deal-modal'
import { WelcomeScreen } from '@/components/welcome-screen'
import { useOrder } from '@/lib/order-context'
import type { MenuItem, Deal } from '@/lib/menu-data'

export default function HomePage() {
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null)
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null)
  const { hasCompletedSetup } = useOrder()

  if (!hasCompletedSetup) {
    return <WelcomeScreen />
  }

  return (
    <>
      <Navbar onItemClick={setSelectedItem} />
      <main>
        <Hero />
        <Categories />
        <PopularItems onItemClick={setSelectedItem} />
        <Promotions onDealClick={setSelectedDeal} />
        <Reviews />
        <Contact />
      </main>
      <Footer />
      <CartDrawer onItemClick={setSelectedItem} />
      {selectedItem && (
        <ProductModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      )}
      {selectedDeal && (
        <DealModal
          deal={selectedDeal}
          onClose={() => setSelectedDeal(null)}
        />
      )}
    </>
  )
}
