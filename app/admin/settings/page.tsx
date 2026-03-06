"use client"

import { useState } from 'react'
import { Save, Store, Clock, DollarSign } from 'lucide-react'
import { toast } from 'sonner'

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    storeName: 'Fatty Patty',
    storePhone: '+92 300 123 4567',
    storeEmail: 'orders@fattypatty.pk',
    deliveryFee: 150,
    minOrderAmount: 500,
    estimatedDeliveryTime: '35-45',
    estimatedPickupTime: '15-20',
    isAcceptingOrders: true,
    isDeliveryEnabled: true,
    isPickupEnabled: true,
  })

  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    // In a real app, this would save to the database
    await new Promise(resolve => setTimeout(resolve, 1000))
    toast.success('Settings saved successfully')
    setIsSaving(false)
  }

  return (
    <div className="max-w-3xl space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground">Configure your store settings</p>
      </div>

      {/* Store Information */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-red/10">
            <Store className="h-5 w-5 text-brand-red" />
          </div>
          <div>
            <h2 className="font-semibold text-foreground">Store Information</h2>
            <p className="text-sm text-muted-foreground">Basic store details</p>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">Store Name</label>
            <input
              type="text"
              value={settings.storeName}
              onChange={(e) => setSettings(s => ({ ...s, storeName: e.target.value }))}
              className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm focus:border-brand-red focus:outline-none focus:ring-2 focus:ring-brand-red/20"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Phone</label>
              <input
                type="tel"
                value={settings.storePhone}
                onChange={(e) => setSettings(s => ({ ...s, storePhone: e.target.value }))}
                className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm focus:border-brand-red focus:outline-none focus:ring-2 focus:ring-brand-red/20"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Email</label>
              <input
                type="email"
                value={settings.storeEmail}
                onChange={(e) => setSettings(s => ({ ...s, storeEmail: e.target.value }))}
                className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm focus:border-brand-red focus:outline-none focus:ring-2 focus:ring-brand-red/20"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Delivery Settings */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
            <DollarSign className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h2 className="font-semibold text-foreground">Delivery & Pricing</h2>
            <p className="text-sm text-muted-foreground">Configure delivery fees and minimum order</p>
          </div>
        </div>
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Delivery Fee (Rs.)</label>
              <input
                type="number"
                value={settings.deliveryFee}
                onChange={(e) => setSettings(s => ({ ...s, deliveryFee: parseInt(e.target.value) || 0 }))}
                className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm focus:border-brand-red focus:outline-none focus:ring-2 focus:ring-brand-red/20"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Minimum Order (Rs.)</label>
              <input
                type="number"
                value={settings.minOrderAmount}
                onChange={(e) => setSettings(s => ({ ...s, minOrderAmount: parseInt(e.target.value) || 0 }))}
                className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm focus:border-brand-red focus:outline-none focus:ring-2 focus:ring-brand-red/20"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Time Estimates */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100">
            <Clock className="h-5 w-5 text-orange-600" />
          </div>
          <div>
            <h2 className="font-semibold text-foreground">Time Estimates</h2>
            <p className="text-sm text-muted-foreground">Set estimated preparation and delivery times</p>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">Delivery Time (minutes)</label>
            <input
              type="text"
              value={settings.estimatedDeliveryTime}
              onChange={(e) => setSettings(s => ({ ...s, estimatedDeliveryTime: e.target.value }))}
              placeholder="e.g. 35-45"
              className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm focus:border-brand-red focus:outline-none focus:ring-2 focus:ring-brand-red/20"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">Pickup Time (minutes)</label>
            <input
              type="text"
              value={settings.estimatedPickupTime}
              onChange={(e) => setSettings(s => ({ ...s, estimatedPickupTime: e.target.value }))}
              placeholder="e.g. 15-20"
              className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm focus:border-brand-red focus:outline-none focus:ring-2 focus:ring-brand-red/20"
            />
          </div>
        </div>
      </div>

      {/* Order Settings */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h2 className="mb-4 font-semibold text-foreground">Order Settings</h2>
        <div className="space-y-4">
          <label className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Accept Orders</p>
              <p className="text-sm text-muted-foreground">Enable or disable order acceptance</p>
            </div>
            <button
              onClick={() => setSettings(s => ({ ...s, isAcceptingOrders: !s.isAcceptingOrders }))}
              className={`relative h-6 w-11 rounded-full transition-colors ${
                settings.isAcceptingOrders ? 'bg-green-500' : 'bg-muted'
              }`}
            >
              <span
                className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                  settings.isAcceptingOrders ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </label>
          <label className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Delivery Enabled</p>
              <p className="text-sm text-muted-foreground">Allow delivery orders</p>
            </div>
            <button
              onClick={() => setSettings(s => ({ ...s, isDeliveryEnabled: !s.isDeliveryEnabled }))}
              className={`relative h-6 w-11 rounded-full transition-colors ${
                settings.isDeliveryEnabled ? 'bg-green-500' : 'bg-muted'
              }`}
            >
              <span
                className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                  settings.isDeliveryEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </label>
          <label className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Pickup Enabled</p>
              <p className="text-sm text-muted-foreground">Allow pickup orders</p>
            </div>
            <button
              onClick={() => setSettings(s => ({ ...s, isPickupEnabled: !s.isPickupEnabled }))}
              className={`relative h-6 w-11 rounded-full transition-colors ${
                settings.isPickupEnabled ? 'bg-green-500' : 'bg-muted'
              }`}
            >
              <span
                className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                  settings.isPickupEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </label>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 rounded-lg bg-brand-red px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-brand-red/90 disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {isSaving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </div>
  )
}
