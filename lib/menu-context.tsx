"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

// Types for database items
export interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  category: string
  categoryId?: string
  image: string
  popular?: boolean
  rating: number
}

export interface Category {
  id: string
  name: string
  image: string
  count: number
  dbId?: string
}

export interface Deal {
  id: string
  name: string
  title: string
  items: string[]
  price: number
  image: string
}

export interface AddOn {
  id: string
  name: string
  price: number
  category?: string | null
}

export interface DrinkOption {
  id: string
  name: string
}

interface MenuData {
  categories: Category[]
  menuItems: MenuItem[]
  deals: Deal[]
  addOns: AddOn[]
  drinkOptions: DrinkOption[]
  popularItems: MenuItem[]
}

interface MenuContextType {
  categories: Category[]
  menuItems: MenuItem[]
  deals: Deal[]
  addOns: AddOn[]
  drinkOptions: DrinkOption[]
  popularItems: MenuItem[]
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
  getAddOnsForCategory: (category: string) => AddOn[]
}

const MenuContext = createContext<MenuContextType | undefined>(undefined)

export function MenuProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<MenuData>({
    categories: [],
    menuItems: [],
    deals: [],
    addOns: [],
    drinkOptions: [],
    popularItems: [],
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchMenu = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const response = await fetch('/api/menu')
      const result = await response.json()
      
      if (result.error) {
        throw new Error(result.error)
      }
      
      // Transform the data from the API
      const { categories, items, deals, addOns, drinkOptions } = result.data
      
      const transformedCategories: Category[] = categories.map((cat: {
        id: string
        name: string
        slug: string
        image_url: string | null
      }) => ({
        id: cat.slug,
        name: cat.name,
        image: cat.image_url || `/images/${cat.slug}.jpg`,
        count: items.filter((item: { category_id: string }) => item.category_id === cat.id).length,
        dbId: cat.id,
      }))

      const transformedItems: MenuItem[] = items.map((item: {
        id: string
        name: string
        description: string | null
        price: number
        category: { id: string; name: string; slug: string } | null
        category_id: string
        image_url: string | null
        is_featured: boolean
      }) => ({
        id: item.id,
        name: item.name,
        description: item.description || '',
        price: item.price,
        category: item.category?.slug || '',
        categoryId: item.category_id,
        image: item.image_url || '/images/placeholder.jpg',
        popular: item.is_featured,
        rating: 4.5,
      }))

      const transformedDeals: Deal[] = deals.map((deal: {
        id: string
        name: string
        title: string
        items: string[] | null
        price: number
        image_url: string | null
      }) => ({
        id: deal.id,
        name: deal.name,
        title: deal.title,
        items: deal.items || [],
        price: deal.price,
        image: deal.image_url || '/images/deal.jpg',
      }))

      const transformedAddOns: AddOn[] = addOns.map((addon: {
        id: string
        name: string
        price: number
        category: string | null
      }) => ({
        id: addon.id,
        name: addon.name,
        price: addon.price,
        category: addon.category,
      }))

      const transformedDrinkOptions: DrinkOption[] = drinkOptions.map((drink: {
        id: string
        name: string
      }) => ({
        id: drink.id,
        name: drink.name,
      }))

      setData({
        categories: transformedCategories,
        menuItems: transformedItems,
        deals: transformedDeals,
        addOns: transformedAddOns,
        drinkOptions: transformedDrinkOptions,
        popularItems: transformedItems.filter((item: MenuItem) => item.popular),
      })
    } catch (err) {
      console.error('Error fetching menu:', err)
      setError(err instanceof Error ? err.message : 'Failed to load menu')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchMenu()
  }, [])

  const getAddOnsForCategory = (category: string): AddOn[] => {
    // Burgers get all add-ons
    if (category === 'beef-burgers' || category === 'chicken-burgers') {
      return data.addOns.filter(addon => 
        addon.category === 'burgers' || addon.category === null || addon.category === 'all'
      )
    }
    // Drinks have no add-ons
    if (category === 'drinks') {
      return []
    }
    // Other items only get basic add-ons (drinks)
    return data.addOns.filter(addon => 
      addon.category === 'basic' || addon.name.toLowerCase().includes('drink')
    )
  }

  return (
    <MenuContext.Provider
      value={{
        categories: data.categories,
        menuItems: data.menuItems,
        deals: data.deals,
        addOns: data.addOns,
        drinkOptions: data.drinkOptions,
        popularItems: data.popularItems,
        isLoading,
        error,
        refetch: fetchMenu,
        getAddOnsForCategory,
      }}
    >
      {children}
    </MenuContext.Provider>
  )
}

export function useMenu() {
  const context = useContext(MenuContext)
  if (context === undefined) {
    throw new Error('useMenu must be used within a MenuProvider')
  }
  return context
}
