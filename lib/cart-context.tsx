"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import type { MenuItem } from './menu-data'

export interface CartItem {
  menuItem: MenuItem
  quantity: number
  addOns: { id: string; name: string; price: number }[]
  specialInstructions?: string
}

interface CartContextType {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (index: number) => void
  updateQuantity: (index: number, quantity: number) => void
  clearCart: () => void
  totalItems: number
  subtotal: number
  isCartOpen: boolean
  setIsCartOpen: (open: boolean) => void
  isCartHydrated: boolean
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const CART_STORAGE_KEY = 'fatty-patty-cart'

function loadCartFromStorage(): CartItem[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = sessionStorage.getItem(CART_STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed)) return parsed
    return []
  } catch {
    return []
  }
}

function saveCartToStorage(items: CartItem[]) {
  if (typeof window === 'undefined') return
  try {
    sessionStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
  } catch {
    // ignore storage errors
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isCartHydrated, setIsCartHydrated] = useState(false)

  // On mount, restore cart from sessionStorage
  useEffect(() => {
    const persisted = loadCartFromStorage()
    if (persisted.length > 0) {
      setItems(persisted)
    }
    setIsCartHydrated(true)
  }, [])

  // Persist cart changes to sessionStorage
  useEffect(() => {
    if (!isCartHydrated) return
    saveCartToStorage(items)
  }, [items, isCartHydrated])

  const addItem = useCallback((item: CartItem) => {
    console.log("[v0] CartContext addItem called with:", item.menuItem.name, "qty:", item.quantity, "addOns:", item.addOns.length)
    setItems(prev => {
      console.log("[v0] Previous cart items count:", prev.length)
      const existingIndex = prev.findIndex(
        existing =>
          existing.menuItem.id === item.menuItem.id &&
          JSON.stringify(existing.addOns) === JSON.stringify(item.addOns)
      )
      if (existingIndex >= 0) {
        console.log("[v0] Found existing item at index:", existingIndex, "- incrementing quantity")
        const updated = [...prev]
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + item.quantity,
        }
        return updated
      }
      console.log("[v0] Adding new item to cart, new total:", prev.length + 1)
      return [...prev, item]
    })
    setIsCartOpen(true)
  }, [])

  const removeItem = useCallback((index: number) => {
    setItems(prev => prev.filter((_, i) => i !== index))
  }, [])

  const updateQuantity = useCallback((index: number, quantity: number) => {
    if (quantity <= 0) {
      setItems(prev => prev.filter((_, i) => i !== index))
      return
    }
    setItems(prev => {
      const updated = [...prev]
      updated[index] = { ...updated[index], quantity }
      return updated
    })
  }, [])

  const clearCart = useCallback(() => {
    setItems([])
    // Also clear from storage on explicit clear (e.g. after order)
    if (typeof window !== 'undefined') {
      try { sessionStorage.removeItem(CART_STORAGE_KEY) } catch { /* ignore */ }
    }
  }, [])

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const subtotal = items.reduce((sum, item) => {
    const addOnTotal = item.addOns.reduce((a, addon) => a + addon.price, 0)
    return sum + (item.menuItem.price + addOnTotal) * item.quantity
  }, 0)

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
        isCartOpen,
        setIsCartOpen,
        isCartHydrated,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
