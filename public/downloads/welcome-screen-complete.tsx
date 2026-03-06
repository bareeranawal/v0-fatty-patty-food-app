/**
 * FATTY PATTY - Welcome Screen / Landing Page
 * This file contains the complete code for the delivery/pickup selection screen
 * 
 * Dependencies required:
 * - npm install framer-motion lucide-react
 * - next/image (part of Next.js)
 * - Tailwind CSS configured
 * - cn utility from @/lib/utils (or use clsx/classnames)
 */

// ============================================
// PART 1: ORDER CONTEXT (lib/order-context.tsx)
// ============================================

"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import Image from 'next/image'
import { MapPin, ShoppingBag, ChevronDown, Store } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

// ---- Types ----
export type OrderType = 'delivery' | 'pickup'
export type Branch = 'dha-phase-8' | 'tipu-sultan'

// ---- Data ----
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

// ---- Storage Helpers ----
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

// ---- Context ----
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

// ============================================
// PART 2: CN UTILITY (lib/utils.ts)
// ============================================

// Simple cn utility - you can also use clsx or classnames package
function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(' ')
}

// ============================================
// PART 3: WELCOME SCREEN COMPONENT
// ============================================

export function WelcomeScreen() {
  const { setOrderType, setSelectedArea, setSelectedBranch, setHasCompletedSetup } = useOrder()
  const [orderMode, setOrderMode] = useState<'delivery' | 'takeaway'>('delivery')
  const [selectedAreaValue, setSelectedAreaValue] = useState('')
  const [selectedBranchValue, setSelectedBranchValue] = useState<Branch | null>(null)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleContinue = () => {
    if (orderMode === 'delivery' && selectedAreaValue) {
      setOrderType('delivery')
      setSelectedArea(selectedAreaValue)
      setHasCompletedSetup(true)
    } else if (orderMode === 'takeaway' && selectedBranchValue) {
      setOrderType('pickup')
      setSelectedBranch(selectedBranchValue)
      setHasCompletedSetup(true)
    }
  }

  const canContinue = orderMode === 'delivery' ? !!selectedAreaValue : !!selectedBranchValue

  if (!mounted) return null

  return (
    <div className="fixed inset-0 z-[100] flex min-h-screen items-center justify-center overflow-y-auto bg-gradient-to-br from-[#FFF8F0] via-[#FFE8D6] to-[#FFDAB9] p-4">
      {/* Subtle decorative elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-20 -top-20 h-96 w-96 rounded-full bg-[#FCA311]/5 blur-3xl" />
        <div className="absolute -bottom-20 -right-20 h-96 w-96 rounded-full bg-[#C1121F]/5 blur-3xl" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-lg"
      >
        {/* Logo */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8 flex justify-center"
        >
          <div className="h-28 w-28 overflow-hidden rounded-2xl bg-[#8B0000] p-2 shadow-xl">
            {/* Replace with your logo */}
            <Image
              src="/images/logo.png"
              alt="Fatty Patty"
              width={112}
              height={112}
              className="h-full w-full object-contain"
              priority
            />
          </div>
        </motion.div>

        {/* Heading */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8 text-center"
        >
          <h1 className="font-serif text-3xl font-bold text-[#1a1a1a] md:text-4xl">
            How would you like to order?
          </h1>
          <p className="mt-2 text-base text-[#6b6b6b]">
            Choose your order type to get started
          </p>
        </motion.div>

        {/* Order Type Selection */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-6 grid grid-cols-2 gap-4"
        >
          {/* Delivery Card */}
          <button
            onClick={() => setOrderMode('delivery')}
            className={cn(
              'group relative flex flex-col items-center gap-3 rounded-2xl border-2 bg-white p-6 transition-all duration-200',
              orderMode === 'delivery'
                ? 'border-[#C1121F] bg-[#C1121F]/5 shadow-lg'
                : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
            )}
          >
            <div className={cn(
              'flex h-14 w-14 items-center justify-center rounded-xl transition-colors',
              orderMode === 'delivery'
                ? 'bg-[#C1121F]'
                : 'bg-gray-100 group-hover:bg-gray-200'
            )}>
              <MapPin className={cn(
                'h-7 w-7',
                orderMode === 'delivery' ? 'text-white' : 'text-gray-500'
              )} />
            </div>
            <div className="text-center">
              <p className={cn(
                'text-lg font-semibold',
                orderMode === 'delivery' ? 'text-[#1a1a1a]' : 'text-gray-700'
              )}>
                Delivery
              </p>
              <p className="mt-0.5 text-sm text-gray-500">
                To your doorstep
              </p>
            </div>
          </button>

          {/* Takeaway Card */}
          <button
            onClick={() => setOrderMode('takeaway')}
            className={cn(
              'group relative flex flex-col items-center gap-3 rounded-2xl border-2 bg-white p-6 transition-all duration-200',
              orderMode === 'takeaway'
                ? 'border-[#C1121F] bg-[#C1121F]/5 shadow-lg'
                : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
            )}
          >
            <div className={cn(
              'flex h-14 w-14 items-center justify-center rounded-xl transition-colors',
              orderMode === 'takeaway'
                ? 'bg-[#C1121F]'
                : 'bg-gray-100 group-hover:bg-gray-200'
            )}>
              <ShoppingBag className={cn(
                'h-7 w-7',
                orderMode === 'takeaway' ? 'text-white' : 'text-gray-500'
              )} />
            </div>
            <div className="text-center">
              <p className={cn(
                'text-lg font-semibold',
                orderMode === 'takeaway' ? 'text-[#1a1a1a]' : 'text-gray-700'
              )}>
                Takeaway
              </p>
              <p className="mt-0.5 text-sm text-gray-500">
                Pick up at store
              </p>
            </div>
          </button>
        </motion.div>

        {/* Delivery Area Dropdown */}
        <AnimatePresence mode="wait">
          {orderMode === 'delivery' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-6"
            >
              <label className="mb-2 block text-sm font-medium text-[#1a1a1a]">
                Select your area
              </label>
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className={cn(
                    'flex w-full items-center justify-between rounded-2xl border-2 bg-white px-4 py-4 text-left transition-all',
                    isDropdownOpen || selectedAreaValue
                      ? 'border-[#C1121F]'
                      : 'border-gray-200 hover:border-gray-300'
                  )}
                >
                  <span className={selectedAreaValue ? 'text-[#1a1a1a]' : 'text-gray-400'}>
                    {selectedAreaValue || 'Choose your delivery area'}
                  </span>
                  <ChevronDown className={cn(
                    'h-5 w-5 text-gray-400 transition-transform',
                    isDropdownOpen && 'rotate-180'
                  )} />
                </button>

                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute left-0 right-0 top-full z-50 mt-2 max-h-64 overflow-y-auto rounded-2xl border border-gray-200 bg-white shadow-xl"
                    >
                      {deliveryAreas.map((area) => (
                        <button
                          key={area}
                          onClick={() => {
                            setSelectedAreaValue(area)
                            setIsDropdownOpen(false)
                          }}
                          className={cn(
                            'flex w-full items-center justify-between px-4 py-3 text-left text-sm transition-colors',
                            selectedAreaValue === area
                              ? 'bg-[#C1121F]/10 text-[#C1121F] font-medium'
                              : 'text-gray-700 hover:bg-gray-50'
                          )}
                        >
                          {area}
                          {selectedAreaValue === area && (
                            <div className="h-2 w-2 rounded-full bg-[#C1121F]" />
                          )}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Branch Selection for Takeaway */}
        <AnimatePresence mode="wait">
          {orderMode === 'takeaway' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-6"
            >
              <label className="mb-2 block text-sm font-medium text-[#1a1a1a]">
                Select branch for pickup
              </label>
              <div className="space-y-3">
                {branches.map((branch) => (
                  <button
                    key={branch.id}
                    onClick={() => setSelectedBranchValue(branch.id)}
                    className={cn(
                      'flex w-full items-center gap-4 rounded-2xl border-2 bg-white p-4 text-left transition-all',
                      selectedBranchValue === branch.id
                        ? 'border-[#C1121F] bg-[#C1121F]/5 shadow-lg'
                        : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                    )}
                  >
                    <div className={cn(
                      'flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl transition-colors',
                      selectedBranchValue === branch.id
                        ? 'bg-[#C1121F]'
                        : 'bg-gray-100'
                    )}>
                      <Store className={cn(
                        'h-6 w-6',
                        selectedBranchValue === branch.id ? 'text-white' : 'text-gray-500'
                      )} />
                    </div>
                    <div className="flex-1">
                      <p className={cn(
                        'font-semibold',
                        selectedBranchValue === branch.id ? 'text-[#1a1a1a]' : 'text-gray-700'
                      )}>
                        {branch.name}
                      </p>
                      <p className="text-sm text-gray-500">{branch.address}</p>
                    </div>
                    {selectedBranchValue === branch.id && (
                      <div className="h-3 w-3 rounded-full bg-[#C1121F]" />
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Continue Button */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          onClick={handleContinue}
          disabled={!canContinue}
          className={cn(
            'w-full rounded-2xl py-4 text-lg font-semibold text-white transition-all',
            canContinue
              ? 'bg-[#C1121F] hover:bg-[#a00f1a] shadow-lg hover:shadow-xl active:scale-[0.98]'
              : 'bg-gray-300 cursor-not-allowed'
          )}
        >
          Continue
        </motion.button>

        {/* Footer text */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-6 text-center text-xs text-gray-500"
        >
          Original Taste Since 2020
        </motion.p>
      </motion.div>
    </div>
  )
}

// ============================================
// USAGE EXAMPLE
// ============================================

/*
// In your layout.tsx or _app.tsx, wrap your app with the OrderProvider:

import { OrderProvider } from './welcome-screen-complete'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <OrderProvider>
          {children}
        </OrderProvider>
      </body>
    </html>
  )
}

// Then in your page, conditionally render the WelcomeScreen:

import { WelcomeScreen, useOrder } from './welcome-screen-complete'

export default function HomePage() {
  const { hasCompletedSetup, isHydrated } = useOrder()
  
  if (!isHydrated) return null
  
  if (!hasCompletedSetup) {
    return <WelcomeScreen />
  }
  
  return <YourMainContent />
}
*/
