"use client"

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Store, ChevronRight, Sparkles } from 'lucide-react'
import { useOrder, deliveryAreas, branches } from '@/lib/order-context'
import type { Branch } from '@/lib/order-context'
import { cn } from '@/lib/utils'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24,
    },
  },
}

const cardVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24,
    },
  },
  hover: {
    scale: 1.02,
    transition: { type: "spring", stiffness: 400, damping: 10 },
  },
  tap: { scale: 0.98 },
}

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
    <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-[#C1121F]">
      {/* Animated gradient background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          className="absolute -top-1/2 -left-1/2 h-full w-full rounded-full bg-[#FCA311]/20 blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div 
          className="absolute -bottom-1/2 -right-1/2 h-full w-full rounded-full bg-[#8B0000]/40 blur-3xl"
          animate={{
            x: [0, -100, 0],
            y: [0, -50, 0],
            scale: [1.2, 1, 1.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Dot pattern overlay */}
      <div className="absolute inset-0 opacity-5">
        <div 
          className="h-full w-full" 
          style={{ 
            backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', 
            backgroundSize: '24px 24px' 
          }} 
        />
      </div>

      <motion.div 
        className="relative z-10 w-full max-w-md px-4"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Logo Section */}
        <motion.div className="mb-8 flex flex-col items-center" variants={itemVariants}>
          <motion.div 
            className="relative mb-4 h-28 w-28 overflow-hidden rounded-full border-4 border-[#FCA311]/50 shadow-2xl"
            whileHover={{ scale: 1.05, rotate: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Image
              src="/images/logo.png"
              alt="Fatty Patty"
              width={112}
              height={112}
              className="h-full w-full object-cover"
              priority
            />
            <motion.div 
              className="absolute inset-0 rounded-full"
              animate={{
                boxShadow: [
                  "0 0 20px rgba(252, 163, 17, 0.3)",
                  "0 0 40px rgba(252, 163, 17, 0.5)",
                  "0 0 20px rgba(252, 163, 17, 0.3)",
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>
          <motion.h1 
            className="font-serif text-4xl font-bold tracking-tight text-white"
            variants={itemVariants}
          >
            Fatty Patty
          </motion.h1>
          <motion.div 
            className="mt-2 flex items-center gap-2"
            variants={itemVariants}
          >
            <Sparkles className="h-4 w-4 text-[#FCA311]" />
            <p className="text-sm font-medium text-white/70">Original Taste Since 2020</p>
            <Sparkles className="h-4 w-4 text-[#FCA311]" />
          </motion.div>
        </motion.div>

        <AnimatePresence mode="wait">
          {/* Step: Choose Order Type */}
          {step === 'type' && (
            <motion.div
              key="type"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <motion.h2 
                className="mb-6 text-center text-lg font-semibold text-white"
                variants={itemVariants}
              >
                How would you like to order?
              </motion.h2>
              <div className="grid grid-cols-2 gap-4">
                <motion.button
                  onClick={() => handleSelectType('delivery')}
                  className="group flex flex-col items-center gap-4 rounded-2xl border-2 border-white/10 bg-white/5 p-6 backdrop-blur-md transition-colors hover:border-[#FCA311]/50 hover:bg-white/10"
                  variants={cardVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <motion.div 
                    className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FCA311]/30 to-[#FCA311]/10"
                    whileHover={{ rotate: 10 }}
                  >
                    <MapPin className="h-8 w-8 text-[#FCA311]" />
                  </motion.div>
                  <div className="text-center">
                    <span className="block text-lg font-bold text-white">Delivery</span>
                    <span className="mt-1 block text-xs text-white/50">To your doorstep</span>
                  </div>
                </motion.button>
                <motion.button
                  onClick={() => handleSelectType('pickup')}
                  className="group flex flex-col items-center gap-4 rounded-2xl border-2 border-white/10 bg-white/5 p-6 backdrop-blur-md transition-colors hover:border-[#FCA311]/50 hover:bg-white/10"
                  variants={cardVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <motion.div 
                    className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FCA311]/30 to-[#FCA311]/10"
                    whileHover={{ rotate: -10 }}
                  >
                    <Store className="h-8 w-8 text-[#FCA311]" />
                  </motion.div>
                  <div className="text-center">
                    <span className="block text-lg font-bold text-white">Pickup</span>
                    <span className="mt-1 block text-xs text-white/50">From our branch</span>
                  </div>
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Step: Select Delivery Area */}
          {step === 'area' && (
            <motion.div
              key="area"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <motion.button
                onClick={() => setStep('type')}
                className="mb-4 flex items-center gap-1 text-sm text-white/60 transition-colors hover:text-white"
                whileHover={{ x: -4 }}
              >
                <ChevronRight className="h-4 w-4 rotate-180" />
                Back
              </motion.button>
              <h2 className="mb-2 text-center text-lg font-semibold text-white">Select Delivery Area</h2>
              <p className="mb-5 text-center text-xs text-white/50">We deliver within 20km of our branches</p>
              <motion.div 
                className="mb-5 max-h-56 overflow-y-auto rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {deliveryAreas.map((area, index) => (
                  <motion.button
                    key={area}
                    onClick={() => setLocalArea(area)}
                    className={cn(
                      'flex w-full items-center justify-between px-4 py-3.5 text-left text-sm transition-all border-b border-white/5 last:border-0',
                      localArea === area
                        ? 'bg-[#FCA311]/20 text-[#FCA311] font-medium'
                        : 'text-white/80 hover:bg-white/5'
                    )}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.02 }}
                    whileHover={{ x: 4 }}
                  >
                    <span>{area}</span>
                    {localArea === area && (
                      <motion.div 
                        className="h-2.5 w-2.5 rounded-full bg-[#FCA311]"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 500 }}
                      />
                    )}
                  </motion.button>
                ))}
              </motion.div>
              <motion.button
                onClick={handleContinue}
                disabled={!localArea}
                className="w-full rounded-xl bg-[#FCA311] py-4 text-sm font-bold text-[#1A1A1A] shadow-lg transition-all hover:bg-[#FCA311]/90 disabled:opacity-40 disabled:cursor-not-allowed"
                whileHover={{ scale: localArea ? 1.02 : 1 }}
                whileTap={{ scale: localArea ? 0.98 : 1 }}
              >
                Continue
              </motion.button>
            </motion.div>
          )}

          {/* Step: Select Branch */}
          {step === 'branch' && (
            <motion.div
              key="branch"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <motion.button
                onClick={() => setStep('type')}
                className="mb-4 flex items-center gap-1 text-sm text-white/60 transition-colors hover:text-white"
                whileHover={{ x: -4 }}
              >
                <ChevronRight className="h-4 w-4 rotate-180" />
                Back
              </motion.button>
              <h2 className="mb-5 text-center text-lg font-semibold text-white">Select Branch for Pickup</h2>
              <div className="mb-5 space-y-3">
                {branches.map((branch, index) => (
                  <motion.button
                    key={branch.id}
                    onClick={() => setLocalBranch(branch.id)}
                    className={cn(
                      'flex w-full items-start gap-4 rounded-2xl border-2 p-5 text-left transition-all backdrop-blur-md',
                      localBranch === branch.id
                        ? 'border-[#FCA311] bg-[#FCA311]/10'
                        : 'border-white/10 bg-white/5 hover:border-white/20'
                    )}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <motion.div 
                      className={cn(
                        'flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl',
                        localBranch === branch.id 
                          ? 'bg-gradient-to-br from-[#FCA311]/40 to-[#FCA311]/20' 
                          : 'bg-white/10'
                      )}
                      animate={localBranch === branch.id ? { rotate: [0, 5, -5, 0] } : {}}
                      transition={{ duration: 0.5 }}
                    >
                      <Store className={cn('h-6 w-6', localBranch === branch.id ? 'text-[#FCA311]' : 'text-white/60')} />
                    </motion.div>
                    <div className="flex-1">
                      <p className={cn('text-base font-bold', localBranch === branch.id ? 'text-[#FCA311]' : 'text-white')}>
                        {branch.name}
                      </p>
                      <p className="mt-1 text-xs text-white/50">{branch.address}</p>
                    </div>
                    {localBranch === branch.id && (
                      <motion.div 
                        className="h-3 w-3 rounded-full bg-[#FCA311] self-center"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 500 }}
                      />
                    )}
                  </motion.button>
                ))}
              </div>
              <motion.button
                onClick={handleContinue}
                disabled={!localBranch}
                className="w-full rounded-xl bg-[#FCA311] py-4 text-sm font-bold text-[#1A1A1A] shadow-lg transition-all hover:bg-[#FCA311]/90 disabled:opacity-40 disabled:cursor-not-allowed"
                whileHover={{ scale: localBranch ? 1.02 : 1 }}
                whileTap={{ scale: localBranch ? 0.98 : 1 }}
              >
                Continue
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
