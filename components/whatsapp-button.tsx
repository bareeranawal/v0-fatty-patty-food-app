"use client"

import { useState, useEffect } from 'react'
import { MessageCircle, X } from 'lucide-react'
import { cn } from '@/lib/utils'

const WHATSAPP_NUMBER = '923342024000'

export function WhatsAppButton() {
  const [isVisible, setIsVisible] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)

  useEffect(() => {
    // Show button after a short delay
    const timer = setTimeout(() => setIsVisible(true), 1500)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    // Show tooltip briefly after button appears
    if (isVisible) {
      const tooltipTimer = setTimeout(() => setShowTooltip(true), 500)
      const hideTimer = setTimeout(() => setShowTooltip(false), 5000)
      return () => {
        clearTimeout(tooltipTimer)
        clearTimeout(hideTimer)
      }
    }
  }, [isVisible])

  const handleClick = () => {
    const message = encodeURIComponent("Hi! I'd like to place an order at Fatty Patty.")
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank')
  }

  return (
    <div
      className={cn(
        'fixed bottom-6 right-6 z-50 transition-all duration-500',
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'
      )}
    >
      {/* Tooltip */}
      <div
        className={cn(
          'absolute bottom-full right-0 mb-3 transition-all duration-300',
          showTooltip ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0 pointer-events-none'
        )}
      >
        <div className="relative rounded-xl bg-card px-4 py-3 shadow-lg border border-border">
          <button
            onClick={() => setShowTooltip(false)}
            className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-muted text-muted-foreground hover:bg-muted-foreground hover:text-background"
            aria-label="Close tooltip"
          >
            <X className="h-3 w-3" />
          </button>
          <p className="text-sm font-medium text-foreground whitespace-nowrap">Need help ordering?</p>
          <p className="text-xs text-muted-foreground">Chat with us on WhatsApp</p>
          {/* Arrow */}
          <div className="absolute -bottom-2 right-6 h-4 w-4 rotate-45 bg-card border-r border-b border-border" />
        </div>
      </div>

      {/* Button */}
      <button
        onClick={handleClick}
        className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-all hover:scale-110 hover:shadow-xl active:scale-95"
        aria-label="Chat on WhatsApp"
      >
        {/* Pulse animation */}
        <span className="absolute inset-0 animate-ping rounded-full bg-[#25D366] opacity-20" />
        <span className="absolute inset-0 animate-pulse rounded-full bg-[#25D366] opacity-30" />
        
        <MessageCircle className="h-6 w-6 relative z-10" />
        
        {/* Hover glow */}
        <span className="absolute inset-0 rounded-full bg-white opacity-0 transition-opacity group-hover:opacity-10" />
      </button>
    </div>
  )
}
