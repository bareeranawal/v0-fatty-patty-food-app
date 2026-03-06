"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Bell, Moon, Sun, Globe, Shield, Trash2 } from 'lucide-react'
import { useTheme } from 'next-themes'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const [notifications, setNotifications] = useState({
    orderUpdates: true,
    promotions: false,
    newsletter: false,
  })

  const handleToggle = (key: keyof typeof notifications) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }))
    toast.success('Settings updated')
  }

  const handleClearData = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.clear()
      localStorage.clear()
      toast.success('All data cleared. Refreshing...')
      setTimeout(() => window.location.reload(), 1000)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-serif text-2xl font-bold text-foreground">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your preferences
        </p>
      </div>

      {/* Appearance */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-border bg-card p-6 shadow-sm"
      >
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#C1121F]/10">
            {theme === 'dark' ? (
              <Moon className="h-5 w-5 text-[#C1121F]" />
            ) : (
              <Sun className="h-5 w-5 text-[#C1121F]" />
            )}
          </div>
          <div>
            <h2 className="font-semibold text-foreground">Appearance</h2>
            <p className="text-xs text-muted-foreground">Customize how the app looks</p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <button
            onClick={() => setTheme('light')}
            className={cn(
              'flex items-center gap-3 rounded-xl border p-4 transition-all',
              theme === 'light'
                ? 'border-[#C1121F] bg-[#C1121F]/5'
                : 'border-border hover:bg-muted'
            )}
          >
            <Sun className={cn('h-5 w-5', theme === 'light' ? 'text-[#C1121F]' : 'text-muted-foreground')} />
            <div className="text-left">
              <p className="text-sm font-semibold text-foreground">Light</p>
              <p className="text-xs text-muted-foreground">Bright and clean</p>
            </div>
          </button>
          <button
            onClick={() => setTheme('dark')}
            className={cn(
              'flex items-center gap-3 rounded-xl border p-4 transition-all',
              theme === 'dark'
                ? 'border-[#C1121F] bg-[#C1121F]/5'
                : 'border-border hover:bg-muted'
            )}
          >
            <Moon className={cn('h-5 w-5', theme === 'dark' ? 'text-[#C1121F]' : 'text-muted-foreground')} />
            <div className="text-left">
              <p className="text-sm font-semibold text-foreground">Dark</p>
              <p className="text-xs text-muted-foreground">Easy on the eyes</p>
            </div>
          </button>
        </div>
      </motion.div>

      {/* Notifications */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-2xl border border-border bg-card p-6 shadow-sm"
      >
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#C1121F]/10">
            <Bell className="h-5 w-5 text-[#C1121F]" />
          </div>
          <div>
            <h2 className="font-semibold text-foreground">Notifications</h2>
            <p className="text-xs text-muted-foreground">Manage your notification preferences</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Order Updates</p>
              <p className="text-xs text-muted-foreground">Get notified about your order status</p>
            </div>
            <button
              onClick={() => handleToggle('orderUpdates')}
              className={cn(
                'relative h-6 w-11 rounded-full transition-colors',
                notifications.orderUpdates ? 'bg-[#C1121F]' : 'bg-muted'
              )}
            >
              <span
                className={cn(
                  'absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform',
                  notifications.orderUpdates ? 'left-[22px]' : 'left-0.5'
                )}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Promotions</p>
              <p className="text-xs text-muted-foreground">Receive deals and special offers</p>
            </div>
            <button
              onClick={() => handleToggle('promotions')}
              className={cn(
                'relative h-6 w-11 rounded-full transition-colors',
                notifications.promotions ? 'bg-[#C1121F]' : 'bg-muted'
              )}
            >
              <span
                className={cn(
                  'absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform',
                  notifications.promotions ? 'left-[22px]' : 'left-0.5'
                )}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Newsletter</p>
              <p className="text-xs text-muted-foreground">Get updates about new items</p>
            </div>
            <button
              onClick={() => handleToggle('newsletter')}
              className={cn(
                'relative h-6 w-11 rounded-full transition-colors',
                notifications.newsletter ? 'bg-[#C1121F]' : 'bg-muted'
              )}
            >
              <span
                className={cn(
                  'absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform',
                  notifications.newsletter ? 'left-[22px]' : 'left-0.5'
                )}
              />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Data & Privacy */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-2xl border border-border bg-card p-6 shadow-sm"
      >
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#C1121F]/10">
            <Shield className="h-5 w-5 text-[#C1121F]" />
          </div>
          <div>
            <h2 className="font-semibold text-foreground">Data & Privacy</h2>
            <p className="text-xs text-muted-foreground">Manage your data</p>
          </div>
        </div>

        <button
          onClick={handleClearData}
          className="flex w-full items-center gap-3 rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-left transition-colors hover:bg-destructive/10"
        >
          <Trash2 className="h-5 w-5 text-destructive" />
          <div>
            <p className="text-sm font-semibold text-destructive">Clear All Data</p>
            <p className="text-xs text-muted-foreground">Remove all saved preferences and cart items</p>
          </div>
        </button>
      </motion.div>
    </div>
  )
}
