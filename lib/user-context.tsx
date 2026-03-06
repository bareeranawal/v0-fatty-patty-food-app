"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'

export interface UserProfile {
  id: string
  name: string
  email: string
  phone: string
  address: string
  favoriteArea: string
}

export interface Order {
  id: string
  items: { name: string; quantity: number; price: number }[]
  total: number
  status: 'pending' | 'preparing' | 'delivered'
  orderType: 'delivery' | 'pickup'
  createdAt: string
  area?: string
  branch?: string
}

interface UserContextType {
  user: UserProfile | null
  orders: Order[]
  isLoggedIn: boolean
  isHydrated: boolean
  login: (email: string, password: string) => Promise<boolean>
  signup: (data: Omit<UserProfile, 'id'> & { password: string }) => Promise<boolean>
  logout: () => void
  updateProfile: (data: Partial<UserProfile>) => void
  addOrder: (order: Omit<Order, 'id' | 'createdAt'>) => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

const USER_STORAGE_KEY = 'fatty-patty-user'
const ORDERS_STORAGE_KEY = 'fatty-patty-orders'

function loadUserFromStorage(): UserProfile | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(USER_STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

function loadOrdersFromStorage(): Order[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(ORDERS_STORAGE_KEY)
    if (!raw) return []
    return JSON.parse(raw)
  } catch {
    return []
  }
}

function saveUserToStorage(user: UserProfile | null) {
  if (typeof window === 'undefined') return
  try {
    if (user) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user))
    } else {
      localStorage.removeItem(USER_STORAGE_KEY)
    }
  } catch {
    // ignore storage errors
  }
}

function saveOrdersToStorage(orders: Order[]) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders))
  } catch {
    // ignore storage errors
  }
}

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    const persistedUser = loadUserFromStorage()
    const persistedOrders = loadOrdersFromStorage()
    if (persistedUser) setUser(persistedUser)
    if (persistedOrders.length > 0) setOrders(persistedOrders)
    setIsHydrated(true)
  }, [])

  useEffect(() => {
    if (!isHydrated) return
    saveUserToStorage(user)
  }, [user, isHydrated])

  useEffect(() => {
    if (!isHydrated) return
    saveOrdersToStorage(orders)
  }, [orders, isHydrated])

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // For demo: accept any email/password and create a user
    // In production, this would validate against a database
    const existingUser = loadUserFromStorage()
    if (existingUser && existingUser.email === email) {
      setUser(existingUser)
      return true
    }
    
    // Create new user on first login
    const newUser: UserProfile = {
      id: `user-${Date.now()}`,
      name: email.split('@')[0],
      email,
      phone: '',
      address: '',
      favoriteArea: '',
    }
    setUser(newUser)
    return true
  }, [])

  const signup = useCallback(async (data: Omit<UserProfile, 'id'> & { password: string }): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const newUser: UserProfile = {
      id: `user-${Date.now()}`,
      name: data.name,
      email: data.email,
      phone: data.phone,
      address: data.address,
      favoriteArea: data.favoriteArea,
    }
    setUser(newUser)
    return true
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    if (typeof window !== 'undefined') {
      localStorage.removeItem(USER_STORAGE_KEY)
    }
  }, [])

  const updateProfile = useCallback((data: Partial<UserProfile>) => {
    setUser(prev => prev ? { ...prev, ...data } : null)
  }, [])

  const addOrder = useCallback((order: Omit<Order, 'id' | 'createdAt'>) => {
    const newOrder: Order = {
      ...order,
      id: `FP-${Date.now().toString(36).toUpperCase()}`,
      createdAt: new Date().toISOString(),
    }
    setOrders(prev => [newOrder, ...prev])
  }, [])

  return (
    <UserContext.Provider
      value={{
        user,
        orders,
        isLoggedIn: !!user,
        isHydrated,
        login,
        signup,
        logout,
        updateProfile,
        addOrder,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}
