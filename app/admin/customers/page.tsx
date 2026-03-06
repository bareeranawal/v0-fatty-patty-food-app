"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, User, Mail, Phone, MapPin, ShoppingBag } from 'lucide-react'
import { cn } from '@/lib/utils'

// Mock customers data
const mockCustomers = [
  {
    id: '1',
    name: 'Ahmed Khan',
    email: 'ahmed@email.com',
    phone: '0300-1234567',
    area: 'DHA Phase 8',
    totalOrders: 12,
    totalSpent: 34500,
    lastOrder: '2024-01-15',
  },
  {
    id: '2',
    name: 'Sara Ali',
    email: 'sara@email.com',
    phone: '0321-9876543',
    area: 'Clifton',
    totalOrders: 8,
    totalSpent: 24800,
    lastOrder: '2024-01-14',
  },
  {
    id: '3',
    name: 'Omar Hassan',
    email: 'omar@email.com',
    phone: '0333-5551234',
    area: 'PECHS',
    totalOrders: 15,
    totalSpent: 45200,
    lastOrder: '2024-01-15',
  },
  {
    id: '4',
    name: 'Fatima Malik',
    email: 'fatima@email.com',
    phone: '0345-7771234',
    area: 'Tipu Sultan',
    totalOrders: 5,
    totalSpent: 12000,
    lastOrder: '2024-01-12',
  },
  {
    id: '5',
    name: 'Zain Ahmed',
    email: 'zain@email.com',
    phone: '0311-3334455',
    area: 'DHA Phase 7',
    totalOrders: 20,
    totalSpent: 62500,
    lastOrder: '2024-01-15',
  },
]

export default function AdminCustomersPage() {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredCustomers = mockCustomers.filter((customer) => 
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.phone.includes(searchQuery)
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-serif text-2xl font-bold text-foreground">Customers</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          View and manage customer information
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-border bg-card p-5 shadow-sm"
        >
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Total Customers</p>
          <p className="mt-2 text-3xl font-bold text-foreground">{mockCustomers.length}</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl border border-border bg-card p-5 shadow-sm"
        >
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Total Revenue</p>
          <p className="mt-2 text-3xl font-bold text-foreground">
            Rs. {mockCustomers.reduce((sum, c) => sum + c.totalSpent, 0).toLocaleString()}
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl border border-border bg-card p-5 shadow-sm"
        >
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Avg. Orders/Customer</p>
          <p className="mt-2 text-3xl font-bold text-foreground">
            {(mockCustomers.reduce((sum, c) => sum + c.totalOrders, 0) / mockCustomers.length).toFixed(1)}
          </p>
        </motion.div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search by name, email, or phone..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-xl border border-border bg-card pl-10 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-[#C1121F] focus:outline-none focus:ring-2 focus:ring-[#C1121F]/20"
        />
      </div>

      {/* Customers Table */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Customer</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Contact</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Area</th>
                <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">Orders</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Total Spent</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} className="transition-colors hover:bg-muted/30">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#C1121F]/10">
                        <User className="h-5 w-5 text-[#C1121F]" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{customer.name}</p>
                        <p className="text-xs text-muted-foreground">Last order: {new Date(customer.lastOrder).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-foreground">
                        <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                        {customer.email}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-foreground">
                        <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                        {customer.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2 text-sm text-foreground">
                      <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                      {customer.area}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <div className="flex items-center justify-center gap-1 text-sm font-medium text-foreground">
                      <ShoppingBag className="h-3.5 w-3.5 text-muted-foreground" />
                      {customer.totalOrders}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <p className="font-bold text-[#C1121F]">Rs. {customer.totalSpent.toLocaleString()}</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {filteredCustomers.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card p-12 text-center">
          <p className="text-sm text-muted-foreground">No customers found</p>
        </div>
      )}
    </div>
  )
}
