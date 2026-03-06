"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Store, Clock, Phone, MapPin, Save } from 'lucide-react'
import { toast } from 'sonner'

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    restaurantName: 'Fatty Patty',
    phone: '03342024000',
    whatsapp: '923342024000',
    email: 'fattypatty@gmail.com',
    deliveryFee: '150',
    minOrderAmount: '500',
    branches: [
      { name: 'DHA Phase 8', address: 'Creek Walk, DHA Phase 8, Karachi', timing: '6 PM - 2 AM' },
      { name: 'Tipu Sultan', address: 'Habitt City, Tipu Sultan Road, Karachi', timing: '12 PM - 3 AM' },
    ],
  })

  const handleSave = () => {
    toast.success('Settings saved successfully!')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-foreground">Settings</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage restaurant settings
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSave}
          className="flex items-center gap-2 rounded-xl bg-[#C1121F] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#C1121F]/90"
        >
          <Save className="h-4 w-4" />
          Save Changes
        </motion.button>
      </div>

      {/* General Settings */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-border bg-card p-6 shadow-sm"
      >
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#C1121F]/10">
            <Store className="h-5 w-5 text-[#C1121F]" />
          </div>
          <div>
            <h2 className="font-semibold text-foreground">General Information</h2>
            <p className="text-xs text-muted-foreground">Basic restaurant details</p>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground">Restaurant Name</label>
            <input
              type="text"
              value={settings.restaurantName}
              onChange={(e) => setSettings({ ...settings, restaurantName: e.target.value })}
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground focus:border-[#C1121F] focus:outline-none focus:ring-2 focus:ring-[#C1121F]/20"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground">Phone Number</label>
            <input
              type="text"
              value={settings.phone}
              onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground focus:border-[#C1121F] focus:outline-none focus:ring-2 focus:ring-[#C1121F]/20"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground">WhatsApp Number</label>
            <input
              type="text"
              value={settings.whatsapp}
              onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground focus:border-[#C1121F] focus:outline-none focus:ring-2 focus:ring-[#C1121F]/20"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground">Email</label>
            <input
              type="email"
              value={settings.email}
              onChange={(e) => setSettings({ ...settings, email: e.target.value })}
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground focus:border-[#C1121F] focus:outline-none focus:ring-2 focus:ring-[#C1121F]/20"
            />
          </div>
        </div>
      </motion.div>

      {/* Delivery Settings */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-2xl border border-border bg-card p-6 shadow-sm"
      >
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FCA311]/10">
            <Phone className="h-5 w-5 text-[#FCA311]" />
          </div>
          <div>
            <h2 className="font-semibold text-foreground">Delivery Settings</h2>
            <p className="text-xs text-muted-foreground">Configure delivery options</p>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground">Delivery Fee (Rs.)</label>
            <input
              type="number"
              value={settings.deliveryFee}
              onChange={(e) => setSettings({ ...settings, deliveryFee: e.target.value })}
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground focus:border-[#C1121F] focus:outline-none focus:ring-2 focus:ring-[#C1121F]/20"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground">Minimum Order Amount (Rs.)</label>
            <input
              type="number"
              value={settings.minOrderAmount}
              onChange={(e) => setSettings({ ...settings, minOrderAmount: e.target.value })}
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground focus:border-[#C1121F] focus:outline-none focus:ring-2 focus:ring-[#C1121F]/20"
            />
          </div>
        </div>
      </motion.div>

      {/* Branch Locations */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-2xl border border-border bg-card p-6 shadow-sm"
      >
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100">
            <MapPin className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <h2 className="font-semibold text-foreground">Branch Locations</h2>
            <p className="text-xs text-muted-foreground">Manage your restaurant branches</p>
          </div>
        </div>
        <div className="space-y-4">
          {settings.branches.map((branch, index) => (
            <div key={index} className="rounded-xl border border-border bg-muted/30 p-4">
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-muted-foreground">Branch Name</label>
                  <input
                    type="text"
                    value={branch.name}
                    onChange={(e) => {
                      const newBranches = [...settings.branches]
                      newBranches[index].name = e.target.value
                      setSettings({ ...settings, branches: newBranches })
                    }}
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground focus:border-[#C1121F] focus:outline-none focus:ring-2 focus:ring-[#C1121F]/20"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-muted-foreground">Address</label>
                  <input
                    type="text"
                    value={branch.address}
                    onChange={(e) => {
                      const newBranches = [...settings.branches]
                      newBranches[index].address = e.target.value
                      setSettings({ ...settings, branches: newBranches })
                    }}
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground focus:border-[#C1121F] focus:outline-none focus:ring-2 focus:ring-[#C1121F]/20"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-muted-foreground">Timing</label>
                  <input
                    type="text"
                    value={branch.timing}
                    onChange={(e) => {
                      const newBranches = [...settings.branches]
                      newBranches[index].timing = e.target.value
                      setSettings({ ...settings, branches: newBranches })
                    }}
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground focus:border-[#C1121F] focus:outline-none focus:ring-2 focus:ring-[#C1121F]/20"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
