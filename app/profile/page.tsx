"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { User, Mail, Phone, MapPin, Edit2, Save, X } from 'lucide-react'
import { useOrder } from '@/lib/order-context'
import { toast } from 'sonner'

export default function ProfilePage() {
  const { selectedArea, orderType } = useOrder()
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState({
    name: 'Guest User',
    email: '',
    phone: '',
    address: '',
    area: selectedArea || '',
  })

  const handleSave = () => {
    setIsEditing(false)
    toast.success('Profile updated successfully!')
  }

  const handleCancel = () => {
    setIsEditing(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-foreground">My Profile</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your personal information
          </p>
        </div>
        {!isEditing ? (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 rounded-xl bg-[#C1121F] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#C1121F]/90"
          >
            <Edit2 className="h-4 w-4" />
            Edit Profile
          </motion.button>
        ) : (
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCancel}
              className="flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
            >
              <X className="h-4 w-4" />
              Cancel
            </motion.button>
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
        )}
      </div>

      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-border bg-card p-6 shadow-sm"
      >
        {/* Avatar Section */}
        <div className="mb-8 flex items-center gap-4">
          <div className="relative">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#C1121F]/10">
              <User className="h-10 w-10 text-[#C1121F]" />
            </div>
            {isEditing && (
              <button className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-[#C1121F] text-white shadow-lg transition-transform hover:scale-110">
                <Edit2 className="h-4 w-4" />
              </button>
            )}
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">{profile.name || 'Guest User'}</h2>
            <p className="text-sm text-muted-foreground">
              {orderType === 'delivery' ? 'Delivery' : 'Pickup'} Customer
            </p>
          </div>
        </div>

        {/* Profile Fields */}
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <User className="h-3.5 w-3.5" />
              Full Name
            </label>
            {isEditing ? (
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground focus:border-[#C1121F] focus:outline-none focus:ring-2 focus:ring-[#C1121F]/20"
                placeholder="Enter your name"
              />
            ) : (
              <p className="rounded-xl bg-muted/50 px-4 py-3 text-sm text-foreground">
                {profile.name || 'Not set'}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <Mail className="h-3.5 w-3.5" />
              Email Address
            </label>
            {isEditing ? (
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground focus:border-[#C1121F] focus:outline-none focus:ring-2 focus:ring-[#C1121F]/20"
                placeholder="Enter your email"
              />
            ) : (
              <p className="rounded-xl bg-muted/50 px-4 py-3 text-sm text-foreground">
                {profile.email || 'Not set'}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <Phone className="h-3.5 w-3.5" />
              Phone Number
            </label>
            {isEditing ? (
              <input
                type="tel"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground focus:border-[#C1121F] focus:outline-none focus:ring-2 focus:ring-[#C1121F]/20"
                placeholder="Enter your phone"
              />
            ) : (
              <p className="rounded-xl bg-muted/50 px-4 py-3 text-sm text-foreground">
                {profile.phone || 'Not set'}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" />
              Default Area
            </label>
            {isEditing ? (
              <input
                type="text"
                value={profile.area}
                onChange={(e) => setProfile({ ...profile, area: e.target.value })}
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground focus:border-[#C1121F] focus:outline-none focus:ring-2 focus:ring-[#C1121F]/20"
                placeholder="Enter your area"
              />
            ) : (
              <p className="rounded-xl bg-muted/50 px-4 py-3 text-sm text-foreground">
                {profile.area || 'Not set'}
              </p>
            )}
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" />
              Full Address
            </label>
            {isEditing ? (
              <textarea
                rows={3}
                value={profile.address}
                onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                className="w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground focus:border-[#C1121F] focus:outline-none focus:ring-2 focus:ring-[#C1121F]/20"
                placeholder="Enter your full address"
              />
            ) : (
              <p className="rounded-xl bg-muted/50 px-4 py-3 text-sm text-foreground">
                {profile.address || 'Not set'}
              </p>
            )}
          </div>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl border border-border bg-card p-5 shadow-sm"
        >
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Total Orders
          </p>
          <p className="mt-2 text-3xl font-bold text-foreground">0</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl border border-border bg-card p-5 shadow-sm"
        >
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Total Spent
          </p>
          <p className="mt-2 text-3xl font-bold text-foreground">Rs. 0</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl border border-border bg-card p-5 shadow-sm"
        >
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Member Since
          </p>
          <p className="mt-2 text-3xl font-bold text-foreground">Today</p>
        </motion.div>
      </div>
    </div>
  )
}
