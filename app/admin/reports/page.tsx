"use client"

import { motion } from 'framer-motion'
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ShoppingBag, 
  Users,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// Mock data for reports
const weeklyRevenue = [
  { day: 'Mon', revenue: 12500 },
  { day: 'Tue', revenue: 15800 },
  { day: 'Wed', revenue: 11200 },
  { day: 'Thu', revenue: 18900 },
  { day: 'Fri', revenue: 22100 },
  { day: 'Sat', revenue: 28500 },
  { day: 'Sun', revenue: 24300 },
]

const topCategories = [
  { name: 'Beef Burgers', orders: 156, revenue: 178000, percentage: 42 },
  { name: 'Chicken Burgers', orders: 89, revenue: 66750, percentage: 21 },
  { name: 'Fries Specials', orders: 112, revenue: 95200, percentage: 18 },
  { name: 'Bowls', orders: 45, revenue: 54000, percentage: 12 },
  { name: 'Drinks', orders: 234, revenue: 35100, percentage: 7 },
]

const monthlyStats = {
  revenue: { value: 425300, change: 12.5 },
  orders: { value: 489, change: 8.2 },
  customers: { value: 156, change: 15.3 },
  avgOrderValue: { value: 870, change: -2.4 },
}

export default function AdminReportsPage() {
  const maxRevenue = Math.max(...weeklyRevenue.map(d => d.revenue))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-foreground">Reports</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Analytics and insights for your business
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-foreground">This Month</span>
        </div>
      </div>

      {/* Monthly Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { title: 'Total Revenue', ...monthlyStats.revenue, icon: DollarSign, prefix: 'Rs. ' },
          { title: 'Total Orders', ...monthlyStats.orders, icon: ShoppingBag },
          { title: 'New Customers', ...monthlyStats.customers, icon: Users },
          { title: 'Avg. Order Value', ...monthlyStats.avgOrderValue, icon: TrendingUp, prefix: 'Rs. ' },
        ].map((stat, index) => (
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
                stat.change >= 0 ? 'text-green-600' : 'text-red-600'
              )}>
                {stat.change >= 0 ? (
                  <ArrowUpRight className="h-3.5 w-3.5" />
                ) : (
                  <ArrowDownRight className="h-3.5 w-3.5" />
                )}
                {Math.abs(stat.change)}%
              </div>
            </div>
            <div className="mt-4">
              <p className="text-2xl font-bold text-foreground">
                {stat.prefix || ''}{stat.value.toLocaleString()}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">{stat.title}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Weekly Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-2xl border border-border bg-card p-6 shadow-sm"
        >
          <div className="mb-6">
            <h2 className="font-semibold text-foreground">Weekly Revenue</h2>
            <p className="text-xs text-muted-foreground">Revenue breakdown for this week</p>
          </div>
          <div className="flex items-end justify-between gap-2 h-48">
            {weeklyRevenue.map((day, index) => (
              <div key={day.day} className="flex flex-1 flex-col items-center gap-2">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${(day.revenue / maxRevenue) * 100}%` }}
                  transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                  className="w-full max-w-[40px] rounded-t-lg bg-gradient-to-t from-[#C1121F] to-[#FCA311]"
                />
                <span className="text-xs font-medium text-muted-foreground">{day.day}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-center gap-4 text-xs text-muted-foreground">
            <span>Total: Rs. {weeklyRevenue.reduce((sum, d) => sum + d.revenue, 0).toLocaleString()}</span>
            <span>Avg: Rs. {Math.round(weeklyRevenue.reduce((sum, d) => sum + d.revenue, 0) / 7).toLocaleString()}/day</span>
          </div>
        </motion.div>

        {/* Top Categories */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="rounded-2xl border border-border bg-card p-6 shadow-sm"
        >
          <div className="mb-6">
            <h2 className="font-semibold text-foreground">Top Categories</h2>
            <p className="text-xs text-muted-foreground">Best performing categories this month</p>
          </div>
          <div className="space-y-4">
            {topCategories.map((category, index) => (
              <div key={category.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#C1121F]/10 text-xs font-bold text-[#C1121F]">
                      {index + 1}
                    </span>
                    <span className="text-sm font-medium text-foreground">{category.name}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-foreground">Rs. {category.revenue.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">{category.orders} orders</p>
                  </div>
                </div>
                <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${category.percentage}%` }}
                    transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
                    className="h-full rounded-full bg-gradient-to-r from-[#C1121F] to-[#FCA311]"
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Insights */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="grid gap-4 sm:grid-cols-3"
      >
        <div className="rounded-2xl border border-green-200 bg-green-50 dark:bg-green-950/20 dark:border-green-900 p-5">
          <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
            <TrendingUp className="h-5 w-5" />
            <span className="text-sm font-semibold">Best Day</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-green-900 dark:text-green-300">Saturday</p>
          <p className="mt-1 text-xs text-green-700 dark:text-green-500">Rs. 28,500 in revenue</p>
        </div>
        <div className="rounded-2xl border border-blue-200 bg-blue-50 dark:bg-blue-950/20 dark:border-blue-900 p-5">
          <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400">
            <ShoppingBag className="h-5 w-5" />
            <span className="text-sm font-semibold">Most Popular</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-blue-900 dark:text-blue-300">All American</p>
          <p className="mt-1 text-xs text-blue-700 dark:text-blue-500">156 orders this month</p>
        </div>
        <div className="rounded-2xl border border-purple-200 bg-purple-50 dark:bg-purple-950/20 dark:border-purple-900 p-5">
          <div className="flex items-center gap-2 text-purple-700 dark:text-purple-400">
            <Users className="h-5 w-5" />
            <span className="text-sm font-semibold">Peak Hours</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-purple-900 dark:text-purple-300">7 PM - 10 PM</p>
          <p className="mt-1 text-xs text-purple-700 dark:text-purple-500">65% of daily orders</p>
        </div>
      </motion.div>
    </div>
  )
}
