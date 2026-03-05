"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

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

interface OrderContextType {
  orderType: OrderType
  setOrderType: (type: OrderType) => void
  selectedArea: string
  setSelectedArea: (area: string) => void
  selectedBranch: Branch | null
  setSelectedBranch: (branch: Branch | null) => void
  hasCompletedSetup: boolean
  setHasCompletedSetup: (done: boolean) => void
}

const OrderContext = createContext<OrderContextType | undefined>(undefined)

export function OrderProvider({ children }: { children: ReactNode }) {
  const [orderType, setOrderType] = useState<OrderType>('delivery')
  const [selectedArea, setSelectedArea] = useState('')
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null)
  const [hasCompletedSetup, setHasCompletedSetup] = useState(false)

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
