"use client"

import { useState } from 'react'
import Image from 'next/image'
import { MapPin, Store, ChevronRight } from 'lucide-react'
import { useOrder, deliveryAreas, branches } from '@/lib/order-context'
import type { Branch } from '@/lib/order-context'
import { cn } from '@/lib/utils'

export function WelcomeScreen() {
  const { setOrderType, setSelectedArea, setSelectedBranch, setHasCompletedSetup } = useOrder()
  const [step, setStep] = useState<'type' | 'area' | 'branch'>('type')
  const [localOrderType, setLocalOrderType] = useState<'delivery' | 'pickup' | null>(null)
  const [localArea, setLocalArea] = useState('')
  const [localBranch, setLocalBranch] = useState<Branch | null>(null)

  const handleSelectType = (type: 'delivery' | 'pickup') => {
    setLocalOrderType(type)
    if (type === 'delivery') {
      setStep('area')
    } else {
      setStep('branch')
    }
  }

  const handleContinue = () => {
    if (localOrderType === 'delivery' && localArea) {
      setOrderType('delivery')
      setSelectedArea(localArea)
      setHasCompletedSetup(true)
    } else if (localOrderType === 'pickup' && localBranch) {
      setOrderType('pickup')
      setSelectedBranch(localBranch)
      setHasCompletedSetup(true)
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#8B0000] p-4">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="h-full w-full" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
      </div>

      <div className="relative w-full max-w-md animate-fade-in-up">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center">
          <div className="mb-4 h-24 w-24 overflow-hidden rounded-full border-3 border-[#F4A261]/50 shadow-2xl">
            <Image
              src="/images/logo.png"
              alt="Fatty Patty"
              width={96}
              height={96}
              className="h-full w-full object-cover"
              priority
            />
          </div>
          <h1 className="font-serif text-3xl font-bold text-white">Fatty Patty</h1>
          <p className="mt-1 text-sm text-white/60">Original Taste Since 2020</p>
        </div>

        {/* Step: Choose Order Type */}
        {step === 'type' && (
          <div className="animate-fade-in-up">
            <h2 className="mb-6 text-center text-lg font-semibold text-white">Choose Order Type</h2>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleSelectType('delivery')}
                className="group flex flex-col items-center gap-3 rounded-2xl border-2 border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all hover:border-[#F4A261]/50 hover:bg-white/10"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#F4A261]/20">
                  <MapPin className="h-7 w-7 text-[#F4A261]" />
                </div>
                <span className="text-base font-semibold text-white">Delivery</span>
                <span className="text-xs text-white/50">To your doorstep</span>
              </button>
              <button
                onClick={() => handleSelectType('pickup')}
                className="group flex flex-col items-center gap-3 rounded-2xl border-2 border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all hover:border-[#F4A261]/50 hover:bg-white/10"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#F4A261]/20">
                  <Store className="h-7 w-7 text-[#F4A261]" />
                </div>
                <span className="text-base font-semibold text-white">Pickup</span>
                <span className="text-xs text-white/50">From our branch</span>
              </button>
            </div>
          </div>
        )}

        {/* Step: Select Delivery Area */}
        {step === 'area' && (
          <div className="animate-fade-in-up">
            <button
              onClick={() => setStep('type')}
              className="mb-4 flex items-center gap-1 text-sm text-white/60 transition-colors hover:text-white"
            >
              <ChevronRight className="h-4 w-4 rotate-180" />
              Back
            </button>
            <h2 className="mb-2 text-center text-lg font-semibold text-white">Select Delivery Area</h2>
            <p className="mb-5 text-center text-xs text-white/50">We deliver within 20km of our branches</p>
            <div className="mb-5 max-h-56 overflow-y-auto rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm">
              {deliveryAreas.map((area) => (
                <button
                  key={area}
                  onClick={() => setLocalArea(area)}
                  className={cn(
                    'flex w-full items-center justify-between px-4 py-3 text-left text-sm transition-all border-b border-white/5 last:border-0',
                    localArea === area
                      ? 'bg-[#F4A261]/20 text-[#F4A261] font-medium'
                      : 'text-white/80 hover:bg-white/5'
                  )}
                >
                  <span>{area}</span>
                  {localArea === area && (
                    <div className="h-2 w-2 rounded-full bg-[#F4A261]" />
                  )}
                </button>
              ))}
            </div>
            <button
              onClick={handleContinue}
              disabled={!localArea}
              className="w-full rounded-xl bg-[#F4A261] py-3.5 text-sm font-semibold text-[#1a1a1a] transition-all hover:bg-[#F4A261]/90 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Continue
            </button>
          </div>
        )}

        {/* Step: Select Branch */}
        {step === 'branch' && (
          <div className="animate-fade-in-up">
            <button
              onClick={() => setStep('type')}
              className="mb-4 flex items-center gap-1 text-sm text-white/60 transition-colors hover:text-white"
            >
              <ChevronRight className="h-4 w-4 rotate-180" />
              Back
            </button>
            <h2 className="mb-5 text-center text-lg font-semibold text-white">Select Branch</h2>
            <div className="mb-5 space-y-3">
              {branches.map((branch) => (
                <button
                  key={branch.id}
                  onClick={() => setLocalBranch(branch.id)}
                  className={cn(
                    'flex w-full items-start gap-4 rounded-2xl border-2 p-5 text-left transition-all',
                    localBranch === branch.id
                      ? 'border-[#F4A261] bg-[#F4A261]/10'
                      : 'border-white/10 bg-white/5 hover:border-white/20'
                  )}
                >
                  <div className={cn(
                    'flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full',
                    localBranch === branch.id ? 'bg-[#F4A261]/30' : 'bg-white/10'
                  )}>
                    <Store className={cn('h-5 w-5', localBranch === branch.id ? 'text-[#F4A261]' : 'text-white/60')} />
                  </div>
                  <div>
                    <p className={cn('text-sm font-semibold', localBranch === branch.id ? 'text-[#F4A261]' : 'text-white')}>
                      {branch.name}
                    </p>
                    <p className="mt-0.5 text-xs text-white/50">{branch.address}</p>
                  </div>
                </button>
              ))}
            </div>
            <button
              onClick={handleContinue}
              disabled={!localBranch}
              className="w-full rounded-xl bg-[#F4A261] py-3.5 text-sm font-semibold text-[#1a1a1a] transition-all hover:bg-[#F4A261]/90 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Continue
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
