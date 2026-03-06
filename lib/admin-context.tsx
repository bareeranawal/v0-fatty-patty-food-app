"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import type { MenuItem } from './menu-data'

// Demo admin credentials
const ADMIN_EMAIL = 'admin@fattypatty.com'
const ADMIN_PASSWORD = 'admin123'

export interface AdminOrder {
  id: string
  customerName: string
  customerPhone: string
  items: { name: string; quantity: number; price: number }[]
  total: number
  status: 'pending' | 'preparing' | 'delivered'
  orderType: 'delivery' | 'pickup'
  area?: string
  branch?: string
  address?: string
  createdAt: string
}

interface AdminContextType {
  isAdminLoggedIn: boolean
  isHydrated: boolean
  orders: AdminOrder[]
  menuItems: MenuItem[]
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  updateOrderStatus: (orderId: string, status: AdminOrder['status']) => void
  addMenuItem: (item: Omit<MenuItem, 'id'>) => void
  updateMenuItem: (id: string, item: Partial<MenuItem>) => void
  deleteMenuItem: (id: string) => void
  addDemoOrder: () => void
}

const AdminContext = createContext<AdminContextType | undefined>(undefined)

const ADMIN_STORAGE_KEY = 'fatty-patty-admin'
const ADMIN_ORDERS_KEY = 'fatty-patty-admin-orders'
const ADMIN_MENU_KEY = 'fatty-patty-admin-menu'

// Demo orders for testing
const demoOrders: AdminOrder[] = [
  {
    id: 'FP-DEMO1',
    customerName: 'Ahmed Khan',
    customerPhone: '0300-1234567',
    items: [
      { name: 'All American', quantity: 2, price: 2300 },
      { name: 'Fatty Fries', quantity: 1, price: 850 },
    ],
    total: 3150,
    status: 'pending',
    orderType: 'delivery',
    area: 'DHA Phase 8',
    address: 'House 123, Street 4, DHA Phase 8',
    createdAt: new Date(Date.now() - 15 * 60000).toISOString(),
  },
  {
    id: 'FP-DEMO2',
    customerName: 'Sara Malik',
    customerPhone: '0321-9876543',
    items: [
      { name: 'Chicken Jalapeno', quantity: 1, price: 750 },
      { name: 'Cold Drink', quantity: 1, price: 150 },
    ],
    total: 900,
    status: 'preparing',
    orderType: 'pickup',
    branch: 'DHA Phase 8',
    createdAt: new Date(Date.now() - 30 * 60000).toISOString(),
  },
  {
    id: 'FP-DEMO3',
    customerName: 'Faisal Raza',
    customerPhone: '0333-5551234',
    items: [
      { name: 'Classic Wagyu', quantity: 1, price: 2800 },
      { name: 'Mushroom Cheese Fries', quantity: 1, price: 650 },
      { name: 'Mineral Water', quantity: 2, price: 200 },
    ],
    total: 3650,
    status: 'delivered',
    orderType: 'delivery',
    area: 'Clifton',
    address: 'Apt 5B, Clifton Block 4',
    createdAt: new Date(Date.now() - 2 * 60 * 60000).toISOString(),
  },
]

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false)
  const [isHydrated, setIsHydrated] = useState(false)
  const [orders, setOrders] = useState<AdminOrder[]>([])
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])

  useEffect(() => {
    if (typeof window === 'undefined') return
    
    // Check admin login state
    const adminState = localStorage.getItem(ADMIN_STORAGE_KEY)
    if (adminState === 'true') {
      setIsAdminLoggedIn(true)
    }
    
    // Load orders
    const savedOrders = localStorage.getItem(ADMIN_ORDERS_KEY)
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders))
    } else {
      setOrders(demoOrders)
      localStorage.setItem(ADMIN_ORDERS_KEY, JSON.stringify(demoOrders))
    }
    
    // Load custom menu items
    const savedMenu = localStorage.getItem(ADMIN_MENU_KEY)
    if (savedMenu) {
      setMenuItems(JSON.parse(savedMenu))
    }
    
    setIsHydrated(true)
  }, [])

  useEffect(() => {
    if (!isHydrated) return
    localStorage.setItem(ADMIN_ORDERS_KEY, JSON.stringify(orders))
  }, [orders, isHydrated])

  useEffect(() => {
    if (!isHydrated) return
    localStorage.setItem(ADMIN_MENU_KEY, JSON.stringify(menuItems))
  }, [menuItems, isHydrated])

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      setIsAdminLoggedIn(true)
      localStorage.setItem(ADMIN_STORAGE_KEY, 'true')
      return true
    }
    return false
  }, [])

  const logout = useCallback(() => {
    setIsAdminLoggedIn(false)
    localStorage.removeItem(ADMIN_STORAGE_KEY)
  }, [])

  const updateOrderStatus = useCallback((orderId: string, status: AdminOrder['status']) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status } : order
    ))
  }, [])

  const addMenuItem = useCallback((item: Omit<MenuItem, 'id'>) => {
    const newItem: MenuItem = {
      ...item,
      id: `custom-${Date.now()}`,
    }
    setMenuItems(prev => [...prev, newItem])
  }, [])

  const updateMenuItem = useCallback((id: string, item: Partial<MenuItem>) => {
    setMenuItems(prev => prev.map(m => m.id === id ? { ...m, ...item } : m))
  }, [])

  const deleteMenuItem = useCallback((id: string) => {
    setMenuItems(prev => prev.filter(m => m.id !== id))
  }, [])

  const addDemoOrder = useCallback(() => {
    const names = ['Ali Hassan', 'Fatima Ahmed', 'Omar Syed', 'Ayesha Khan', 'Bilal Qureshi']
    const areas = ['DHA Phase 8', 'Clifton', 'PECHS', 'Gulshan']
    const items = [
      { name: 'All American', price: 1150 },
      { name: 'Beef Signature', price: 1000 },
      { name: 'Chicken Jalapeno', price: 750 },
      { name: 'Fatty Fries', price: 850 },
    ]
    
    const randomItems = Array.from({ length: Math.floor(Math.random() * 3) + 1 }, () => {
      const item = items[Math.floor(Math.random() * items.length)]
      const quantity = Math.floor(Math.random() * 2) + 1
      return { ...item, quantity, price: item.price * quantity }
    })
    
    const newOrder: AdminOrder = {
      id: `FP-${Date.now().toString(36).toUpperCase()}`,
      customerName: names[Math.floor(Math.random() * names.length)],
      customerPhone: `03${Math.floor(Math.random() * 100).toString().padStart(2, '0')}-${Math.floor(Math.random() * 10000000).toString().padStart(7, '0')}`,
      items: randomItems,
      total: randomItems.reduce((sum, item) => sum + item.price, 0) + 150,
      status: 'pending',
      orderType: Math.random() > 0.3 ? 'delivery' : 'pickup',
      area: areas[Math.floor(Math.random() * areas.length)],
      address: `House ${Math.floor(Math.random() * 500)}, Street ${Math.floor(Math.random() * 20)}`,
      createdAt: new Date().toISOString(),
    }
    
    setOrders(prev => [newOrder, ...prev])
  }, [])

  return (
    <AdminContext.Provider
      value={{
        isAdminLoggedIn,
        isHydrated,
        orders,
        menuItems,
        login,
        logout,
        updateOrderStatus,
        addMenuItem,
        updateMenuItem,
        deleteMenuItem,
        addDemoOrder,
      }}
    >
      {children}
    </AdminContext.Provider>
  )
}

export function useAdmin() {
  const context = useContext(AdminContext)
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider')
  }
  return context
}
