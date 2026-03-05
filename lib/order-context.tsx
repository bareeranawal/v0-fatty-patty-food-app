"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'

export type OrderType = 'delivery' | 'pickup'
export type Branch = 'dha-phase-8' | 'tipu-sultan'

export const deliveryAreas = [
  'DHA Phase 8',
  'DHA Phase 7',
  'DHA Phase 6',
  'DHA Phase 5',
  'Creek Walk - DHA Phase 8',
  'Khayaban-e-Ittehad',
  'Bukhari Commercial',
  'Tipu Sultan Road',
  'Habit City - Tipu Sultan',
  'Bahadurabad',
  'Shaheed-e-Millat',
  'PECHS',
  'Tariq Road',
  'Nursery',
  'KDA Scheme 1',
  'Gulshan-e-Iqbal Block 13/14',
  'Clifton',
  'Bath Island',
  'Defence Phase 4',
  'Defence Phase 3',
  'Defence Phase 2',
  'Zamzama',
  'Khadda Market',
  'Boat Basin',
  'Sindhi Muslim Society',
  'Smchs',
]

export const branches = [
  { id: 'dha-phase-8' as Branch, name: 'DHA Phase 8', address: 'Creek Walk, DHA Phase 8, Karachi' },
  { id: 'tipu-sultan' as Branch, name: 'Tipu Sultan', address: 'Habit City, Tipu Sultan Road, Karachi' },
]

const STORAGE_KEY = 'fatty-patty-order'

function loadPersistedState() {
  if (typeof window === 'undefined') return null
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as {
      orderType: OrderType
      selectedArea: string
      selectedBranch: Branch | null
      hasCompletedSetup: boolean
    }
  } catch {
    return null
  }
}

function persistState(data: {
  orderType: OrderType
  selectedArea: string
  selectedBranch: Branch | null
  hasCompletedSetup: boolean
}) {
  if (typeof window === 'undefined') return
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {
    // ignore storage errors
  }
}

interface OrderContextType {
  orderType: OrderType
  setOrderType: (type: OrderType) => void
  selectedArea: string
  setSelectedArea: (area: string) => void
  selectedBranch: Branch | null
  setSelectedBranch: (branch: Branch | null) => void
  hasCompletedSetup: boolean
  setHasCompletedSetup: (done: boolean) => void
  isHydrated: boolean
}

const OrderContext = createContext<OrderContextType | undefined>(undefined)

export function OrderProvider({ children }: { children: ReactNode }) {
  const [orderType, setOrderTypeState] = useState<OrderType>('delivery')
  const [selectedArea, setSelectedAreaState] = useState('')
  const [selectedBranch, setSelectedBranchState] = useState<Branch | null>(null)
  const [hasCompletedSetup, setHasCompletedSetupState] = useState(false)
  const [isHydrated, setIsHydrated] = useState(false)

  // On mount, restore persisted state from sessionStorage
  useEffect(() => {
    const persisted = loadPersistedState()
    if (persisted) {
      setOrderTypeState(persisted.orderType)
      setSelectedAreaState(persisted.selectedArea)
      setSelectedBranchState(persisted.selectedBranch)
      setHasCompletedSetupState(persisted.hasCompletedSetup)
    }
    setIsHydrated(true)
  }, [])

  // Persist state changes to sessionStorage
  useEffect(() => {
    if (!isHydrated) return
    persistState({ orderType, selectedArea, selectedBranch, hasCompletedSetup })
  }, [orderType, selectedArea, selectedBranch, hasCompletedSetup, isHydrated])

  const setOrderType = useCallback((type: OrderType) => setOrderTypeState(type), [])
  const setSelectedArea = useCallback((area: string) => setSelectedAreaState(area), [])
  const setSelectedBranch = useCallback((branch: Branch | null) => setSelectedBranchState(branch), [])
  const setHasCompletedSetup = useCallback((done: boolean) => setHasCompletedSetupState(done), [])

  return (
    <OrderContext.Provider
      value={{
        orderType,
        setOrderType,
        selectedArea,
        setSelectedArea,
        selectedBranch,
        setSelectedBranch,
        hasCompletedSetup,
        setHasCompletedSetup,
        isHydrated,
      }}
    >
      {children}
    </OrderContext.Provider>
  )
}

export function useOrder() {
  const context = useContext(OrderContext)
  if (!context) {
    throw new Error('useOrder must be used within an OrderProvider')
  }
  return context
}
