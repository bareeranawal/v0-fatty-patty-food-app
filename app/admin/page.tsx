"use client"

import { motion } from 'framer-motion'
import { 
  DollarSign, 
  ShoppingBag, 
  Users, 
  TrendingUp,
  Package,
  Clock,
  CheckCircle2,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// Mock data - in a real app this would come from a database
const stats = [
  {
    title: 'Total Revenue',
    value: 'Rs. 125,430',
    change: '+12.5%',
    trend: 'up',
    icon: DollarSign,
  },
  {
    title: 'Total Orders',
    value: '156',
    change: '+8.2%',
    trend: 'up',
    icon: ShoppingBag,
  },
  {
    title: 'Total Customers',
    value: '89',
    change: '+15.3%',
    trend: 'up',
    icon: Users,
  },
  {
    title: 'Avg. Order Value',
    value: 'Rs. 804',
    change: '-2.4%',
    trend: 'down',
    icon: TrendingUp,
  },
]

const recentOrders = [
  {
    id: 'FP-ABC123',
    customer: 'Ahmed Khan',
    items: '2x All American, 1x Fatty Fries',
    total: 3450,
    status: 'preparing',
    time: '5 min ago',
  },
  {
    id: 'FP-DEF456',
    customer: 'Sara Ali',
    items: '1x Classic Wagyu, 1x Cold Drink',
    total: 2950,
    status: 'pending',
    time: '12 min ago',
  },
  {
    id: 'FP-GHI789',
    customer: 'Omar Hassan',
    items: '3x Chicken Jalapeno, 2x Fries',
    total: 2850,
    status: 'delivered',
    time: '25 min ago',
  },
  {
    id: 'FP-JKL012',
    customer: 'Fatima Malik',
    items: '1x Moroccan Bowl, 1x Alfredo Pasta',
    total: 2400,
    status: 'delivered',
    time: '45 min ago',
  },
]

const topSellingItems = [
  { name: 'All American Burger', sold: 45, revenue: 51750 },
  { name: 'Classic Wagyu', sold: 28, revenue: 78400 },
  { name: 'Fatty Fries', sold: 67, revenue: 56950 },
  { name: 'Chicken Jalapeno', sold: 52, revenue: 39000 },
  { name: 'Moroccan Chicken Bowl', sold: 31, revenue: 37200 },
]

const statusConfig = {
  pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-700' },
  preparing: { label: 'Preparing', color: 'bg-blue-100 text-blue-700' },
  delivered: { label: 'Delivered', color: 'bg-green-100 text-green-700' },
}

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-serif text-2xl font-bold text-foreground lg:text-3xl">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {"Welcome back! Here's what's happening at Fatty Patty."}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="rounded-2xl border border-border bg-card p-5 shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#C1121F]/10">
                <stat.icon className="h-5 w-5 text-[#C1121F]" />
              </div>
              <div className={cn(
                'flex items-center gap-1 text-xs font-semibold',
                stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
              )}>
                {stat.trend === 'up' ? (
                  <ArrowUpRight className="h-3.5 w-3.5" />
                ) : (
                  <ArrowDownRight className="h-3.5 w-3.5" />
                )}
                {stat.change}
              </div>
            </div>
            <div className="mt-4">
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="mt-1 text-xs text-muted-foreground">{stat.title}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Orders */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 rounded-2xl border border-border bg-card shadow-sm"
        >
          <div className="flex items-center justify-between border-b border-border p-5">
            <div>
              <h2 className="font-semibold text-foreground">Recent Orders</h2>
              <p className="text-xs text-muted-foreground">Latest orders from customers</p>
            </div>
            <a
              href="/admin/orders"
              className="text-xs font-semibold text-[#C1121F] hover:underline"
            >
              View All
            </a>
          </div>
          <div className="divide-y divide-border">
            {recentOrders.map((order) => {
              const status = statusConfig[order.status as keyof typeof statusConfig]
              return (
                <div key={order.id} className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted">
                      <Package className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-foreground">{order.id}</p>
                        <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-semibold', status.color)}>
                          {status.label}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">{order.customer}</p>
                      <p className="text-xs text-muted-foreground truncate max-w-[200px]">{order.items}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-foreground">Rs. {order.total.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">{order.time}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </motion.div>

        {/* Top Selling Items */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="rounded-2xl border border-border bg-card shadow-sm"
        >
          <div className="border-b border-border p-5">
            <h2 className="font-semibold text-foreground">Top Selling Items</h2>
            <p className="text-xs text-muted-foreground">Best performers this month</p>
          </div>
          <div className="divide-y divide-border">
            {topSellingItems.map((item, index) => (
              <div key={item.name} className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#C1121F]/10 text-xs font-bold text-[#C1121F]">
                    {index + 1}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-foreground">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.sold} sold</p>
                  </div>
                </div>
                <p className="text-sm font-semibold text-foreground">
                  Rs. {item.revenue.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="grid gap-4 sm:grid-cols-3"
      >
        <a
          href="/admin/menu"
          className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:border-[#C1121F]/30 hover:shadow-md"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#FCA311]/10">
            <Package className="h-6 w-6 text-[#FCA311]" />
          </div>
          <div>
            <p className="font-semibold text-foreground">Manage Menu</p>
            <p className="text-xs text-muted-foreground">Add or edit items</p>
          </div>
        </a>
        <a
          href="/admin/orders"
          className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:border-[#C1121F]/30 hover:shadow-md"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
            <Clock className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <p className="font-semibold text-foreground">Pending Orders</p>
            <p className="text-xs text-muted-foreground">3 orders waiting</p>
          </div>
        </a>
        <a
          href="/admin/reports"
          className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:border-[#C1121F]/30 hover:shadow-md"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100">
            <CheckCircle2 className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <p className="font-semibold text-foreground">View Reports</p>
            <p className="text-xs text-muted-foreground">Sales analytics</p>
          </div>
        </a>
      </motion.div>
    </div>
  )
}
