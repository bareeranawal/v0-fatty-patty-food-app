"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Navbar } from '@/components/navbar'
import { MenuSection } from '@/components/menu-section'
import { Footer } from '@/components/footer'
import { CartDrawer } from '@/components/cart-drawer'
import { ProductModal } from '@/components/product-modal'
import { useOrder } from '@/lib/order-context'
import type { MenuItem } from '@/lib/menu-data'

export default function MenuPage() {
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null)
  const { hasCompletedSetup } = useOrder()
  const router = useRouter()

  useEffect(() => {
    if (!hasCompletedSetup) {
      router.replace('/')
    }
  }, [hasCompletedSetup, router])

  if (!hasCompletedSetup) {
    return null
  }

  return (
    <>
      <Navbar onItemClick={setSelectedItem} />
      <main className="pt-14">
        <MenuSection onItemClick={setSelectedItem} />
      </main>
      <Footer />
      <CartDrawer onItemClick={setSelectedItem} />
      {selectedItem && (
        <ProductModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </>
  )
}
