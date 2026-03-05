"use client"

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
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
  const searchParams = useSearchParams()
  const router = useRouter()

  // Handle scrollTo query param (when navigating from another page)
  useEffect(() => {
    const scrollTo = searchParams.get('scrollTo')
    if (scrollTo && hasCompletedSetup) {
      // Small delay to let the page render
      const timer = setTimeout(() => {
        const el = document.getElementById(scrollTo)
        if (el) {
          const navbarHeight = 64
          const elementPosition = el.getBoundingClientRect().top + window.scrollY
          window.scrollTo({
            top: elementPosition - navbarHeight,
            behavior: 'smooth',
          })
        }
        // Clean up the URL without reloading
        router.replace('/', { scroll: false })
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [searchParams, hasCompletedSetup, router])

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
