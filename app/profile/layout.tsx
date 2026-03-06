"use client"

import { ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { User, ClipboardList, Settings, ArrowLeft } from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { WelcomeScreen } from '@/components/welcome-screen'
import { WhatsAppButton } from '@/components/whatsapp-button'
import { useOrder } from '@/lib/order-context'
import { cn } from '@/lib/utils'

const profileLinks = [
  { name: 'Profile', href: '/profile', icon: User },
  { name: 'Order History', href: '/profile/orders', icon: ClipboardList },
  { name: 'Settings', href: '/profile/settings', icon: Settings },
]

export default function ProfileLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const { hasCompletedSetup, isHydrated } = useOrder()

  if (!isHydrated) {
    return null
  }

  if (!hasCompletedSetup) {
    return <WelcomeScreen />
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background pt-16">
        <div className="mx-auto max-w-6xl px-4 py-8 lg:px-8">
          {/* Back to Home */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-6"
          >
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </motion.div>

          <div className="flex flex-col gap-8 lg:flex-row">
            {/* Sidebar Navigation */}
            <motion.aside
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="w-full lg:w-64 flex-shrink-0"
            >
              <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
                <h2 className="mb-4 px-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  My Account
                </h2>
                <nav className="space-y-1">
                  {profileLinks.map((link) => {
                    const isActive = pathname === link.href
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={cn(
                          'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all',
                          isActive
                            ? 'bg-[#C1121F]/10 text-[#C1121F]'
                            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                        )}
                      >
                        <link.icon className={cn('h-4 w-4', isActive && 'text-[#C1121F]')} />
                        {link.name}
                        {isActive && (
                          <motion.div
                            layoutId="profile-nav-indicator"
                            className="ml-auto h-1.5 w-1.5 rounded-full bg-[#C1121F]"
                          />
                        )}
                      </Link>
                    )
                  })}
                </nav>
              </div>
            </motion.aside>

            {/* Main Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex-1"
            >
              {children}
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  )
}
