"use client"

import { ReactNode, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  Package,
  ClipboardList,
  Users,
  BarChart3,
  Settings,
  Menu,
  X,
  LogOut,
  ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const adminLinks = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Menu Manager', href: '/admin/menu', icon: Package },
  { name: 'Orders', href: '/admin/orders', icon: ClipboardList },
  { name: 'Customers', href: '/admin/customers', icon: Users },
  { name: 'Reports', href: '/admin/reports', icon: BarChart3 },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
]

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-muted/30">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 transform bg-card border-r border-border transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex items-center justify-between border-b border-border p-4">
            <Link href="/admin" className="flex items-center gap-3">
              <div className="relative h-10 w-10 overflow-hidden rounded-full border-2 border-[#FCA311]/40">
                <Image
                  src="/images/logo.png"
                  alt="Fatty Patty"
                  width={40}
                  height={40}
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <span className="font-serif text-lg font-bold text-foreground">Admin</span>
                <p className="text-xs text-muted-foreground">Fatty Patty</p>
              </div>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="rounded-lg p-2 text-muted-foreground hover:bg-muted lg:hidden"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <div className="space-y-1">
              {adminLinks.map((link) => {
                const isActive = pathname === link.href || 
                  (link.href !== '/admin' && pathname.startsWith(link.href))
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setSidebarOpen(false)}
                    className={cn(
                      'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all',
                      isActive
                        ? 'bg-[#C1121F] text-white'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    )}
                  >
                    <link.icon className="h-5 w-5" />
                    {link.name}
                    {isActive && (
                      <ChevronRight className="ml-auto h-4 w-4" />
                    )}
                  </Link>
                )
              })}
            </div>
          </nav>

          {/* Footer */}
          <div className="border-t border-border p-4">
            <Link
              href="/"
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <LogOut className="h-5 w-5" />
              Back to Website
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        {/* Mobile Header */}
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-card px-4 py-3 lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg p-2 text-foreground hover:bg-muted"
          >
            <Menu className="h-5 w-5" />
          </button>
          <span className="font-serif text-lg font-bold text-foreground">Admin Dashboard</span>
          <div className="w-9" />
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  )
}
